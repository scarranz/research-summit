// overviews/meta.js — Overview + Deep Dive shell for Meta Platforms, Inc. (NASDAQ: META), built with
// docs/PROFILE_PLAYBOOK.md (build log: docs/profiles/META.md).
//   Overview  = OV-1…OV-7: Key Facts · lede · 2×2 · How Meta makes money · Products · Competitors (peer map) ·
//               Timeline. All data in this file, sourced to the FY2025 10-K.
//   Deep Dive = the AMZN spine — Top Line · Bottom Line · Evolution · Valuation · Management · Miscellaneous.
//               Most panes live in their own module (imports below); this file keeps the Overview, the
//               Valuation ▸ Peers map + comps table, Management (team, track record, governance & SBC,
//               capital allocation), the pop-up modal and the tab orchestration.
// Live data: price / market cap / EV via Massive (api.liveQuote), logged-in only; graceful fallback.
// F-FINAL (2026-10-22): the pre-playbook panes (old Earnings block, Earnings Calls tracker, SPLC tables,
// segment/spend/model-vs-reality panes, old Sensitivity) were removed; they survive in git history.


import { makeManagement } from './management.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { metaHistMult } from './meta-histmult.js';
import { metaSens } from './meta-sensitivity.js';
import { metaOwnBody, metaOwnInit } from './meta-own.js';
import { metaBlGeneralHtml, metaBlGeneralBuild, metaBlSegmentsHtml, metaBlSegmentsBuild } from './meta-bl.js';
import { metaCeHtml, metaCeWire, metaCeBuild, metaCePop } from './meta-ce.js';   // Evolution ▸ Earnings (Setup · Post-Results · Notes)
import { metaSplcBody, metaSplcBuild, metaSplcPop } from './meta-splc.js';   // Bottom Line ▸ Supply Chain (Bloomberg SPLC)
import { metaCompBody, metaCompInit } from './meta-comp.js';   // Misc ▸ Competitive Position (MISC-comp, §15b)
import { metaCapexBody, metaCapexBuild, metaStrategyBody, metaMnaBody, metaCapacityBody } from './meta-misc.js';   // Misc ▸ Capex, Strategy, M&A, Capacity (formal, §15b)
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line engine (data: js/segments-data/meta.js)
import { submitsHtml, initSubmits } from '../submits.js';   // Valuation ▸ Submit History (engine + js/submits-data/meta.js)

function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Accents: Summit tokens, never Meta's brand (SAB, Oct 20 2026; playbook §21) ──────────────
// BRAND = the Summit blue that underlines the profile tabs (--steel); BRAND2 = Summit navy.
// Read from the stylesheet so Chart.js gets a real colour; the fallbacks are the same tokens.
function metaTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
var BRAND=metaTok('--steel','#3E5A82'), BRAND2=metaTok('--navy','#1E2733');
var RL='#8B5CF6', GREEN='#16A34A';   // Governance & SBC chart series (Meta palette, pending the move to Summit tokens)
var _co=null;   // open company (id + ticker), captured in html/deepDiveHtml for the shared Watch List engine

// ─── Snapshot & narrative ────────────────────────────────────────────────────
// OV-2 lede (playbook §8: 2–4 sentences, ~50–80 words, no numbers, neutral). Paraphrased from the
// FY2025 10-K, Item 1 "Overview".
var DESC='Meta Platforms builds the apps people use to connect and share — Facebook, Instagram, WhatsApp, Messenger and Threads — and earns its money by selling the advertising shown inside them. It also builds virtual-reality headsets, AI glasses and its own AI models, and it is investing heavily in them as the foundation of what it sees as the next computing platform.';

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW DATA (the 7 blocks)
// ═══════════════════════════════════════════════════════════════════════════
// Block 1 — Key Facts (OV-1: the 10 standard cells, playbook §8). Source: 10-K FY2025 (cover page,
// Item 1 "Corporate Information" and "Human Capital"), EDGAR CIK 1326801. Market cap is live (#meMc),
// never seeded (rule 10). Segments, dual-class control and capital return moved to OV-4 / Management (B2).
var META_FACTS=[
  ['Listing','NASDAQ: META'],
  ['HQ','Menlo Park, California, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2004 (Mark Zuckerberg)'],
  ['IPO','May 2012 · NASDAQ'],
  ['CEO','Mark Zuckerberg · founder · CEO since 2004'],
  ['Employees','78,865 · Dec 2025'],
  ['Dividend','Payer · quarterly, since 2024'],
  ['Market cap','loading live quote…'],
];
function metaKeyFacts(){
  return '<div class="stdkf">'+META_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="meMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
// OV-3 — the 2×2 (≤ 30 words a cell). Sources: FY2025 10-K — Item 1 (products), MD&A ("Family daily active
// people (DAP) was 3.58 billion on average for December 2025"; ad impressions +12%, average price per ad +9%),
// Note 2 (revenue by line), Note 15 (segment operating income), Note 1 ("No customer represented 10% or more
// of total revenue"). "The edge" is the analyst's read (SAB, 2026-10-20).
var META_BIZ=[
  ['What it sells','Ad space inside Facebook, Instagram, Messenger, WhatsApp and Threads, sold by real-time auction — plus business messaging, Meta Verified subscriptions and Reality Labs hardware: Quest headsets and AI glasses.'],
  ['Who buys it','Businesses of every size, from global brands to small merchants, bidding to reach <b>3.58 billion</b> daily people (Dec 2025). No customer is 10% of revenue.'],
  ['How it earns','FY2025: ~98% advertising, ~1% other app revenue, ~1% Reality Labs; impressions +12%, price per ad +9%. Reality Labs\' <b>$19.2B loss</b> takes the 52% apps margin to 41%.'],
  ['The edge','Meta owns the apps, the auction and the measurement — a closed loop that keeps nearly the whole ad dollar and ranks ads with AI trained on 3.58B people\'s activity.'],
];

// OV-4 — How Meta makes money, FY2025. [label, % of total, '$x.xB', 'x%', colour — unused, the bars are grey].
// Segments: 10-K Note 15. Geography: Note 2, "based on the addresses of our customers" (not user location).
// Both reconcile to total revenue $200,966M.
var GMM_SEG=[
  ['Family of Apps', 98.9, '$198.8B', '99%', null],
  ['Reality Labs',    1.1, '$2.2B',   '1%',  null],
];
var GMM_GEO=[
  ['US & Canada',   39.2, '$78.9B', '39%', null],
  ['Asia-Pacific',  26.8, '$53.8B', '27%', null],
  ['Europe',        23.2, '$46.6B', '23%', null],
  ['Rest of world', 10.8, '$21.7B', '11%', null],
];
// One accordion per segment: what it is (no numbers) + "The numbers". Descriptions paraphrase 10-K Item 1.
// The old lede's numbers (FoA ~50%+ margin, 41% consolidated, RL −$19B, losses peaking in 2026) live here now.
var REV_DEFS=[
  { seg:'Family of Apps (where the money comes from)',
    desc:'Facebook, Instagram, Messenger, WhatsApp and Threads, plus the <b>Meta AI</b> assistant. Free to use; paid for by businesses that buy the ads shown in feeds, Stories and Reels, priced by auction. A small part comes from paid business messaging on WhatsApp, <b>Meta Verified</b> subscriptions and developer payment fees.',
    econ:[['FY2025 revenue','$198.8B · 99% of total'],['Growth','+22% (from $162.4B)'],['Operating income','$102.5B · 51.6% margin'],['Advertising','$196.2B (+22%): ad impressions +12%, average price per ad +9%'],['Other revenue','$2.6B (+50%)'],['Daily active people','3.58B on average, Dec 2025 (+7%)']] },
  { seg:'Reality Labs (the long bet, run at a loss)',
    desc:'Hardware and research for what Meta sees as the next computing platform: <b>Quest</b> virtual-reality headsets and the Horizon store, <b>Ray-Ban Meta</b> and <b>Oakley Meta</b> AI glasses, <b>Meta Ray-Ban Display</b> with its Neural Band wristband, and long-range augmented-reality research such as the Orion prototype.',
    econ:[['FY2025 revenue','$2.2B · 1% of total'],['Growth','+3% (from $2.1B)'],['Operating income','−$19.2B (−$17.7B in 2024)'],['2026 spend plan','~70% wearables · ~30% VR and Horizon (10-K)'],['Outlook','2026 losses similar to 2025 and "likely the peak" (Zuckerberg, Q4 2025 call)']] },
  { seg:'The revenue lines (advertising, other, Reality Labs)',
    desc:'The 10-K also splits the same total by line: advertising and other revenue inside the Family of Apps, and Reality Labs.',
    econ:[['Advertising','$196.2B · 97.6% (+22%)'],['Other revenue','$2.6B · 1.3% (+50%)'],['Reality Labs','$2.2B · 1.1% (+3%)']],
    econNote:'10-K Note 2 (Revenue). Other revenue = WhatsApp paid messaging, Meta Verified subscriptions, developer Payments fees and other sources (MD&A).' },
];

// OV-5 — Products: family card → pop-up with the products inside (key prod:i). Every line paraphrases the
// FY2025 10-K Item 1 ("Family of Apps Products", "Reality Labs Products").
var META_PRODUCTS=[
  { ic:'👥', fam:'Facebook', d:'Community, feed and Marketplace.', items:[
    ['Feed, Reels and Stories','Where people share and discover posts, short videos and moments from friends, creators and pages.'],
    ['Groups','Communities built around shared interests.'],
    ['Marketplace','Buying and selling between people and businesses.']] },
  { ic:'📸', fam:'Instagram', d:'Photos, video and creators.', items:[
    ['Feed, Stories and Reels','Photos and short video from friends, creators and brands.'],
    ['Live and messaging','Live broadcasts and private messages.'],
    ['Shopping','Discovering and buying from favorite businesses.']] },
  { ic:'💬', fam:'Messaging', d:'WhatsApp and Messenger.', items:[
    ['WhatsApp','Private, secure messaging used by people and businesses to communicate and transact; Channels for one-to-many broadcasts.'],
    ['WhatsApp business messaging','Paid conversations between businesses and their customers — part of "other revenue".'],
    ['Messenger','Text, audio and video calls with friends, family, communities and businesses, across devices.']] },
  { ic:'🧵', fam:'Threads', d:'Text updates and public talk.', items:[
    ['Threads','Text-based updates and public conversations, where people follow creators and build their own audience.']] },
  { ic:'🤖', fam:'Meta AI', d:'The assistant, everywhere.', items:[
    ['Meta AI assistant','Available inside the apps, as a stand-alone app, on the AI glasses and on the web — to learn, get things done, create and connect.'],
    ['AI behind the apps','The same AI investment ranks content, recommends what to watch and powers the tools advertisers use to reach customers.']] },
  { ic:'🕶️', fam:'Reality Labs devices', d:'Headsets and AI glasses.', items:[
    ['Meta Quest','Virtual-reality headsets, with passthrough to see the real world, and content from the Meta Horizon Store.'],
    ['Ray-Ban Meta · Oakley Meta','AI glasses with Meta AI built in and hands-free use.'],
    ['Meta Ray-Ban Display + Neural Band','AI glasses with a display in the lens (2025), controlled by a wristband that reads muscle signals.'],
    ['Orion (prototype)','True augmented-reality glasses unveiled in 2024 — research, not on sale.']] },
  { ic:'📣', fam:'For businesses', d:'Ads, subscriptions, payments.', items:[
    ['Ads','Ads placed across the apps and bought by auction; AI tools help advertisers reach customers.'],
    ['Meta Verified','A paid subscription for verified accounts.'],
    ['Payments','Infrastructure for developers, on which Meta earns net fees.']] },
];
function metaFourQuad(){
  return '<div class="q2">'+META_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ─── Standardized render helpers ─────────────────────────────────────────────
function sec(t,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(t)+'</div>'+inner+'</section>'; }
function bullets(a){ return '<ul class="ov-bullets">'+a.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }
// neutral=true: the Overview money bars — light greys ranked by size, amounts in black (css .gmm-neutral).
function mbars(arr, neutral){
  var rk=[]; if(neutral){ arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }).forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); }); }
  return '<div class="ov-mbars'+(neutral?' gmm-neutral':'')+'">'+arr.map(function(r,i){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill'+(neutral?' gmm-g'+rk[i]:'')+'" style="width:'+r[1]+'%'+(neutral?'':';background:'+r[3])+'">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }

// ─── Timeline / Peers / Winds ────────────────────────────────────────────────
// OV-7 — strict chronological order, bullets inside "Read more" (playbook §8). Sources: FY2025 10-K Item 1
// ("incorporated in Delaware in July 2004", IPO May 2012), Item 5 (dividends "beginning in 2024"), Meta
// newsroom / 8-Ks for the acquisitions, the rename and the Scale AI investment; the FTC ruling (Nov 2025).
// No stock prices or market-cap milestones here (playbook OV-7 "what doesn't go in").
var TIMELINE=[
  { y:'2004', t:'<b>Facebook founded</b> by Mark Zuckerberg at Harvard.',
    d:'<ul class="ov-bullets"><li>February 2004 — Facebook launches for Harvard students, then opens to other universities and, in 2006, to everyone.</li><li>July 2004 — incorporated in Delaware; Zuckerberg has been CEO since.</li></ul>' },
  { y:'2012', t:'<b>IPO</b> on NASDAQ (May) and the purchase of <b>Instagram</b>.',
    d:'<ul class="ov-bullets"><li>May 2012 — traditional IPO on NASDAQ at $38.00 a share.</li><li>2012 — buys Instagram for about $1B; it is now one of Meta\'s two main ad surfaces.</li><li>The same years: the shift of the ad business from desktop to mobile.</li></ul>' },
  { y:'2014', t:'Buys <b>WhatsApp</b> and <b>Oculus</b> — messaging scale and the seed of Reality Labs.',
    d:'<ul class="ov-bullets"><li>WhatsApp (~$19B) — global messaging, later the base for business messaging.</li><li>Oculus (~$2B) — virtual reality, the origin of today\'s Reality Labs.</li></ul>' },
  { y:'2021', t:'Renamed <b>Meta</b>; <b>Reality Labs</b> becomes its own reported segment.',
    d:'<ul class="ov-bullets"><li>October 2021 — Facebook, Inc. becomes Meta Platforms, Inc.</li><li>Reality Labs is reported separately from the Family of Apps, so its losses are visible for the first time.</li></ul>' },
  { y:'2022–23', t:'Apple\'s tracking change and the <b>"Year of Efficiency"</b>.',
    d:'<ul class="ov-bullets"><li>2022 — Apple\'s App Tracking Transparency limits the data Meta uses to target and measure ads; revenue falls for the first time.</li><li>Meta rebuilds targeting and measurement on its own AI.</li><li>2023 — the "Year of Efficiency": about 21,000 roles cut and management layers removed.</li></ul>' },
  { y:'2024', t:'<b>First dividend</b> in Meta\'s history.',
    d:'<ul class="ov-bullets"><li>Beginning in 2024, the board declares a quarterly cash dividend on Class A and Class B shares.</li><li>Raised from $0.50 to $0.525 a share in 2025.</li></ul>' },
  { y:'2025', t:'All-in on AI: <b>Scale AI</b> and <b>Superintelligence Labs</b>; the FTC antitrust case is won.',
    d:'<ul class="ov-bullets"><li>June 2025 — a $14.3B investment in Scale AI; its founder Alexandr Wang joins as Chief AI Officer to lead the new Meta Superintelligence Labs.</li><li>November 2025 — a federal court rules for Meta in the FTC\'s antitrust case: no forced sale of Instagram or WhatsApp.</li></ul>' },
];

// ─── Sub-tab switching: keep the clicked tab anchored ───────────────────────────
// Tab switches hide a tall pane and show a shorter one, so the browser clamps scrollTop and the
// page appears to jump to the top. Keep the clicked control visually anchored: measure its
// viewport position, run the change, then scroll by the delta so it does not move. (§6a-iv.)
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}

// ═══════════════════════════════════════════════════════════════════════════
//  MANAGEMENT — capital allocation · team · track record · governance & SBC
// ═══════════════════════════════════════════════════════════════════════════

// Capital allocation — FY actuals ($B). Model carries shares; buyback/dividend are public facts.
var CAP_YEARS=['2021','2022','2023','2024','2025'];
var CAP_FCF   =[38.99,19.04,43.85,54.07,46.11];
var CAP_BUYBK =[44.5,27.9,20.0,30.1,29.0]; // gross repurchases $B (approx, public 10-K/press)
var CAP_DIV   =[0,0,0,5.1,5.3];            // dividends paid $B (first dividend 2024)
var CAP_SHARES=[2859,2702,2629,2614,2574];
var CAP_NOTE='Meta declared its <b>first dividend in 2024</b> ($0.50/qtr, raised to $0.525 in 2025) and authorized large buybacks (a $50B addition in 2024). The Summit model carries the <b>share count</b> (2,859M FY21 → 2,574M FY25, ~10% net reduction) but not a repurchase/dividend line — buyback and dividend dollars here are approximate, from public 10-K/press disclosures, and should be confirmed against the latest 10-K/8-K. FCF is the Summit series. Buybacks have run well above the dividend: Meta returns cash primarily by shrinking the share count.';

// Management ▸ Executives & Board — the shared engine (./management.js).
var META_MGMT = makeManagement({
  brand: BRAND,
  lede: 'Meta is <b>founder-controlled</b>: Mark Zuckerberg is Chairman & CEO and, through super-voting Class B stock, holds majority voting power despite a ~13% economic stake. The executive bench pairs long-tenured product/finance leaders (Li, Cox, Olivan) with a 2025 AI infusion (Alexandr Wang, from the $14.3B Scale AI deal). <span class="ave-subh-note">Public-source bios; ownership counts & insider trades sync separately (Fiscal.ai) into Ownership — note META is not on the Fiscal free plan, so that panel may be empty until upgrade.</span>',
  execs:[
    { id:'zuck', lead:true, name:'Mark Zuckerberg', title:'Founder, Chairman & CEO', since:'CEO since 2004', line:'Founder-CEO with voting control; drove the 2022 crash → Year of Efficiency → AI re-rate and the all-in "personal superintelligence" bet.', bio:'Founded Facebook in 2004 at Harvard. Holds majority voting power via Class B super-voting shares (~13% economic). Personally leads the AI + Reality Labs strategy: the 2023 "Year of Efficiency," the record AI-capex ramp, the 2025 Superintelligence Labs push (incl. the $14.3B Scale AI stake), and the pivot from holographic metaverse to AI glasses. His conviction and control are both the bull case (decisive, long-horizon capital allocation) and the governance risk (minority holders have little say).' },
    { id:'powell', name:'Dina Powell McCormick', title:'President & Vice Chairman', since:'since Jan 2026', line:'New #2-style role (Jan 2026); ex-Goldman Sachs partner and White House deputy national-security adviser — statecraft + capital-markets weight.', bio:'Joined Meta\'s board in April 2025, then moved into an executive role as President & Vice Chairman in January 2026. Former Goldman Sachs partner (global head of sovereign business) and US deputy national security adviser. A senior counterweight/relationships asset as Meta navigates global policy, capital markets and the AI build.' },
    { id:'li', name:'Susan Li', title:'Chief Financial Officer', since:'CFO since Nov 2022', line:'Long-time internal finance leader; the voice on capex discipline and "spending through it" while guiding operating income above prior year.', bio:'Joined Meta in 2008; VP of Finance before succeeding Dave Wehner as CFO in November 2022. Runs the capital-allocation message — the record capex ramp, the first dividend (2024), and the framing that 2026 operating income can rise even as capex steps up. The market\'s key interlocutor on the AI-spend ROI question.' },
    { id:'cox', name:'Chris Cox', title:'Chief Product Officer', since:'CPO since 2020', line:'Oversees Facebook, Instagram, WhatsApp, Threads and Meta AI product; among Zuckerberg\'s most senior and trusted lieutenants.', bio:'One of Meta\'s earliest and most influential product leaders (joined 2005). Left in 2019, returned in 2020 as CPO. Owns the app roadmap that manufactures ad inventory — Reels, AI-recommended content, Threads, business messaging and the Meta AI assistant.' },
    { id:'olivan', name:'Javier Olivan', title:'Chief Operating Officer', since:'COO since 2022', line:'Runs the business/ads org, infrastructure, and growth after Sheryl Sandberg\'s 2022 departure.', bio:'Joined 2007 building the growth team that globalized Facebook. Became COO in 2022 when Sheryl Sandberg stepped down — a more operations/infrastructure-weighted COO role than Sandberg\'s ad-sales-centric one, reflecting AI-era priorities.' },
    { id:'boz', name:'Andrew "Boz" Bosworth', title:'Chief Technology Officer', since:'CTO since 2022', line:'Leads Reality Labs (Quest, Ray-Ban/Oakley Meta glasses, Orion) and much of the AI infrastructure effort.', bio:'Long-tenured executive (joined 2006; built the News Feed ads engine). As CTO he runs Reality Labs — the ~$19B/yr bet — and champions the pivot toward AI glasses as the next platform. The public face of the hardware/AR strategy.' },
    { id:'wang', name:'Alexandr Wang', title:'Chief AI Officer · Meta Superintelligence Labs', since:'joined Jun 2025', line:'Founder of Scale AI; brought in via the $14.3B stake to lead the Superintelligence Labs talent push.', bio:'Co-founded and led Scale AI; joined Meta in June 2025 as part of the ~$14.3B investment, becoming Chief AI Officer and leading Meta Superintelligence Labs (MSL) alongside recruited researchers. The centerpiece of Meta\'s aggressive, costly 2025 AI-talent war and the shift toward frontier "superintelligence" models.' },
    { id:'mahoney', name:'C.J. Mahoney', title:'Chief Legal Officer', since:'CLO since Jan 2026', line:'New top lawyer (Jan 2026); ex-Microsoft GC and former deputy US Trade Representative — inherits EU DMA + AI-safety litigation.', bio:'Named Meta\'s Chief Legal Officer in January 2026, succeeding Jennifer Newstead (who left to become Apple\'s General Counsel). Former General Counsel at Microsoft and a deputy US Trade Representative. Leads Meta\'s legal agenda post-FTC-case (dismissed Nov 2025): EU DMA "pay-or-consent," teen-safety and AI-liability litigation.' },
    { id:'kaplan', name:'Joel Kaplan', title:'President, Global Affairs', since:'since Jan 2025', line:'Succeeded Nick Clegg as head of policy/government relations amid a shift in Meta\'s political posture.', bio:'Long-time Meta policy executive; became head of global affairs in January 2025 when Nick Clegg departed. Oversees Meta\'s global policy, content and government-relations agenda during a period of changing platform-governance stance.' },
  ],
  board:[
    { name:'Mark Zuckerberg', role:'Chairman & CEO', chair:true, dual:true, independent:false },
    { name:'Peggy Alford', role:'EVP, PayPal — chair of Audit & Risk', independent:true },
    { name:'Marc Andreessen', role:'Co-founder & GP, Andreessen Horowitz', independent:true },
    { name:'John Arnold', role:'Co-founder & Co-Chair, Arnold Ventures (joined 2024)', independent:true },
    { name:'Patrick Collison', role:'Co-founder & CEO, Stripe (joined 2025)', independent:true },
    { name:'John Elkann', role:'Chairman, Exor / Stellantis / Ferrari (joined 2025)', independent:true },
    { name:'Andrew Houston', role:'Co-founder & CEO, Dropbox', independent:true },
    { name:'Nancy Killefer', role:'Former Senior Partner, McKinsey', independent:true },
    { name:'Robert Kimmitt', role:'Former US Deputy Treasury Secretary — lead independent director', independent:true },
    { name:'Charles Songhurst', role:'Technology investor (joined 2025)', independent:true },
    { name:'Dana White', role:'CEO, UFC / TKO (joined 2025)', independent:true },
    { name:'Tony Xu', role:'Co-founder & CEO, DoorDash', independent:true },
  ],
  boardNote:'controlled company — founder holds voting majority; 12-member board per the May 2026 annual meeting (Hock Tan & Tracey Travis did not stand for re-election)',
  gov:[
    { k:'Voting control', v:'Founder majority', d:'Dual-class: Class B = 10 votes/share (founder-held); Zuckerberg controls ~61% of voting power with ~13% economics.' },
    { k:'Board leadership', v:'Combined CEO + Chair', d:'Independent lead director (R. Kimmitt); "controlled company" status limits some independence requirements.' },
    { k:'Capital return', v:'Dividend + buybacks', d:'First dividend 2024 ($0.50→$0.525/qtr); large repurchases (share count −~10% since FY21).' },
    { k:'Say-on-pay', v:'Advisory only', d:'Founder voting control means minority holders effectively cannot force governance change.' },
  ],
  foot:'Roster, titles and board membership from Meta public disclosures / company site as of mid-2026. Compensation and ownership specifics come from the annual proxy (DEF 14A) — confirm there. Ownership & insider-transaction data syncs from Fiscal.ai into the Ownership subtab (note: META is not on the Fiscal free plan, so that panel may show no data until the plan is upgraded).',
});
// Track Record — rate the MANAGEMENT (and key board) on value creation, green/amber/red,
// each with a Meta record (co) and a prior/external one (ext). Editorial reads from tenure +
// what they built, not a Meta statement. matr: pop-ups.
var META_TRACK_RATE={ green:{c:'#0F9D58',bg:'rgba(15,157,88,0.07)',l:'Value creator'}, amber:{c:'#E8A00C',bg:'rgba(232,160,12,0.08)',l:'Mixed / unproven'}, red:{c:'#C0392B',bg:'rgba(192,57,43,0.07)',l:'Value destroyer'} };
var META_TRACK=[
  { id:'zuck', n:'Mark Zuckerberg', r:'Founder, Chairman & CEO', t:'CEO since 2004', rate:'green',
    one:'Turned a college network into one of the largest companies in the world — and twice re-invented it under fire.',
    co:['Built the mobile-ad machine, then the AI-ad machine (revenue $70B → $201B, FY19→25)','Called the 2022 bottom: "Year of Efficiency" → margin ~20%→~41%, stock >10× off the low','Voting control lets him make the long-horizon AI/RL bets no hired CEO could'],
    ext:['One of the great capital allocators of the era — Instagram/WhatsApp are landmark deals','The same control that enables the bets removes minority-holder checks (the governance flag)'],
    note:'Elite builder + allocator; the open question is the return on the AI capex he alone is steering. Green.' },
  { id:'li', n:'Susan Li', r:'Chief Financial Officer', t:'CFO since Nov 2022 · at Meta since 2008', rate:'green',
    one:'Disciplined internal CFO who ran the Year-of-Efficiency and now frames the capex/ROI debate.',
    co:['Owned the cost reset that re-expanded margins, then the pivot to record capex','Started the first dividend (2024) + large buybacks while funding the AI build','The credible voice the market tests on "spend-through-it" ROI'],
    ext:['15-year Meta insider (VP Finance) — deep institutional knowledge, promoted from within'],
    note:'Rigorous, trusted operator through both the cut and the ramp. Green.' },
  { id:'cox', n:'Chris Cox', r:'Chief Product Officer', t:'CPO since 2020 · at Meta since 2005', rate:'green',
    one:'Owns the product engine that manufactures ad inventory — Reels, AI feed, Threads, Meta AI.',
    co:['Reels caught up to feed monetization; AI-recommended content now 40%+ of the FB feed','Threads scaled off the IG graph; Meta AI to ~1B users'],
    ext:['One of Meta\'s most influential early product leaders; left 2019, returned 2020'],
    note:'The engagement → inventory flywheel is his; proven product builder. Green.' },
  { id:'olivan', n:'Javier Olivan', r:'Chief Operating Officer', t:'COO since 2022 · at Meta since 2007', rate:'green',
    one:'Runs ads, business and infrastructure — the operating spine behind the numbers.',
    co:['Took the COO seat after Sandberg; re-weighted it toward ops/infra for the AI era','Built the growth org that globalized Facebook'],
    ext:['15-year insider — the execution counterpart to Zuckerberg\'s strategy'],
    note:'Steady operator running the monetization + infra machine. Green.' },
  { id:'boz', n:'Andrew "Boz" Bosworth', r:'Chief Technology Officer', t:'CTO since 2022 · at Meta since 2006', rate:'amber',
    one:'Owns Reality Labs — real glasses traction, but a ~$79B cumulative loss is on his ledger.',
    co:['Ray-Ban / Oakley Meta glasses the breakout (>7M units 2025); pivot VR→AI glasses','Built the original News Feed ads engine'],
    ext:['Long-tenured, technically deep; the public face of the hardware bet'],
    note:'Credible builder, but RL is the value question — glasses promising, losses enormous. Amber until the segment inflects. ' },
  { id:'wang', n:'Alexandr Wang', r:'Chief AI Officer · MSL', t:'joined Jun 2025', rate:'amber',
    one:'The $14.3B superintelligence bet in one hire — huge ambition, zero Meta track record yet.',
    co:['Leads Meta Superintelligence Labs; MSL\'s first model (Muse Spark) shipped fast'],
    ext:['Founder/CEO of Scale AI — built a real data-labeling business from scratch'],
    note:'Centerpiece of the most expensive, least-proven bet Meta has made. Amber — high option value, unproven. ' },
  { id:'powell', n:'Dina Powell McCormick', r:'President & Vice Chairman', t:'exec since Jan 2026', rate:'amber',
    one:'Statecraft + capital-markets weight in a brand-new #2-style role — relationships, not P&L (yet).',
    co:['Moved from the board (2025) into the executive suite Jan 2026'],
    ext:['Goldman Sachs partner (sovereign business); US deputy national security adviser'],
    note:'Heavyweight profile; too new to grade, and the seat is relationship-oriented. Amber. ' },
  { id:'mahoney', n:'C.J. Mahoney', r:'Chief Legal Officer', t:'CLO since Jan 2026', rate:'amber',
    one:'New top lawyer inheriting the EU/AI-safety litigation wave — strong pedigree, unproven here.',
    co:['Succeeds Jennifer Newstead (who left for Apple) after the FTC case was dismissed'],
    ext:['General Counsel at Microsoft; deputy US Trade Representative'],
    note:'Blue-chip legal/policy pedigree; brand-new to Meta. Amber. ' },
  { id:'kaplan', n:'Joel Kaplan', r:'President, Global Affairs', t:'since Jan 2025', rate:'amber',
    one:'Runs policy/government relations through a shifting platform-governance posture — not a P&L owner.',
    co:['Succeeded Nick Clegg; steward of the content/policy agenda'],
    ext:['Long-time Meta policy executive; White House background'],
    note:'Real policy value; not an operating growth seat. Amber by design. ' },
];
var META_BOARD_TRACK=[
  { n:'Patrick Collison', rate:'green', r:'Co-founder & CEO, Stripe', note:'Built Stripe into the defining payments-infrastructure company — a genuine builder\'s perspective on the board (joined 2025).' },
  { n:'Tony Xu', rate:'green', r:'Co-founder & CEO, DoorDash', note:'Scaled DoorDash to category leadership and profitability — a sitting founder-operator.' },
  { n:'Marc Andreessen', rate:'green', r:'Co-founder & GP, a16z', note:'Netscape founder and top-tier VC — deep tech/product judgment; long-tenured Meta director (note: a16z portfolio overlaps raise conflict questions).' },
  { n:'Peggy Alford', rate:'green', r:'EVP, PayPal', note:'Senior payments/fintech operator; chairs Audit & Risk — a substantive governance seat.' },
  { n:'John Elkann', rate:'amber', r:'Chairman, Exor / Stellantis / Ferrari', note:'Elite capital-allocator pedigree in a different industry; governance/relationships value (joined 2025).' },
  { n:'John Arnold', rate:'amber', r:'Co-founder, Arnold Ventures', note:'Ex-Centaurus energy trader turned philanthropist/investor; policy & data-driven lens (joined 2024), not an operator.' },
];
// Governance & SBC data.
var SBC_YEARS=['2021','2022','2023','2024','2025'];
var SBC_DOLLARS=[9.16,11.99,14.03,15.36,17.6];   // SBC expense $B (approx, from 10-K)
var SBC_NOTE='Meta\'s stock-based compensation has risen with headcount and AI-talent competition (~$9B in 2021 → ~$17-18B in 2025), but buybacks have run well ahead of it, so the diluted share count still <b>fell ~10%</b> over the period. The 2025 AI talent war (incl. the Scale AI hires) is the pressure to watch on future SBC. Single class of economic ownership for public holders, but <b>super-voting Class B</b> gives the founder control — the defining governance feature.';
// ═══════════════════════════════════════════════════════════════════════════
//  BODY BUILDERS
// ═══════════════════════════════════════════════════════════════════════════
// Management ▸ Governance & SBC — capital allocation.
function capAllocBody(){
  var h='<p class="ov-lede">Meta funds a record AI build <b>and</b> returns cash — primarily by shrinking the share count (~10% since FY21), plus a small dividend started in 2024. Buybacks run well ahead of the dividend.</p>';
  h+=kpis([
    { l:'FY2025 FCF', v:'$46.1B', d:'after $69.7B capex', dir:'up' },
    { l:'Buybacks (FY25)', v:'~$29B', d:'primary cash return', dir:'up' },
    { l:'Dividend (FY25)', v:'~$5.3B', d:'$0.525/qtr · since 2024', dir:'muted' },
    { l:'Shares', v:'2,574M', d:'−~10% since FY21', dir:'up' },
  ]);
  h+='<div class="ov-chart-t">Capital return vs free cash flow <span>($B, FY · buybacks + dividends vs FCF)</span></div>';
  h+='<div class="ov-chart-wrap"><canvas id="meCap"></canvas></div>';
  h+='<div style="overflow-x:auto;margin-top:8px"><table class="ov-table"><thead><tr><th>FY</th><th style="text-align:right">FCF</th><th style="text-align:right">Buybacks</th><th style="text-align:right">Dividends</th><th style="text-align:right">Shares (M)</th></tr></thead><tbody>'+
    CAP_YEARS.map(function(y,i){ return '<tr><td class="ov-td-name">'+y+'</td><td style="text-align:right">$'+CAP_FCF[i].toFixed(1)+'B</td><td style="text-align:right">$'+CAP_BUYBK[i].toFixed(1)+'B</td><td style="text-align:right">'+(CAP_DIV[i]?'$'+CAP_DIV[i].toFixed(1)+'B':'—')+'</td><td style="text-align:right">'+CAP_SHARES[i]+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  h+='<div class="ov-fynote">'+CAP_NOTE+'</div>';
  h+='<div class="ov-foot">FCF & share count from the Summit model; buyback & dividend dollars approximate (public 10-K/press) — confirm against the latest 10-K/8-K.</div>';
  return h;
}
// Management ▸ Track Record.
function trackBody(){
  var card=function(p){ var rt=META_TRACK_RATE[p.rate];
    return '<div class="mtk-card ov-clickable" data-detail="matr:'+p.id+'" style="border-left:3px solid '+rt.c+';background:'+rt.bg+'">'+
      '<div class="mtk-top"><div><div class="mtk-n">'+esc(p.n)+'</div><div class="mtk-r">'+esc(p.r)+'</div></div><span class="mtk-badge" style="color:'+rt.c+';border-color:'+rt.c+'">'+rt.l+'</span></div>'+
      '<div class="mtk-t">'+esc(p.t)+'</div><div class="mtk-one">'+p.one+'</div>'+
      '<div class="mtk-more" style="color:'+rt.c+'">Read more ›</div></div>'; };
  var bcard=function(b){ var rt=META_TRACK_RATE[b.rate];
    return '<div class="mtk-bcard" style="border-left:3px solid '+rt.c+'"><div class="mtk-btop"><span class="mtk-bn">'+esc(b.n)+'</span><span class="mtk-bdot" style="background:'+rt.c+'"></span></div><div class="mtk-br">'+esc(b.r)+'</div><div class="mtk-bnote">'+b.note+'</div></div>'; };
  var h='<style>.mtk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 4px}@media(max-width:720px){.mtk-grid{grid-template-columns:1fr}}'+
    '.mtk-card{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;cursor:pointer;transition:box-shadow .15s}.mtk-card:hover{box-shadow:0 3px 12px rgba(8,102,255,0.09)}'+
    '.mtk-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}'+
    '.mtk-n{font-size:14px;font-weight:800;color:var(--navy)}.mtk-r{font-size:11px;color:var(--mu);margin-top:1px}'+
    '.mtk-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border:1px solid;border-radius:9px;padding:2px 7px;white-space:nowrap}'+
    '.mtk-t{font-size:10.5px;color:var(--mu);margin:7px 0 5px}.mtk-one{font-size:12px;color:var(--navy);line-height:1.5}.mtk-more{font-size:11px;font-weight:800;margin-top:8px}'+
    '.mtk-bgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}@media(max-width:720px){.mtk-bgrid{grid-template-columns:1fr}}'+
    '.mtk-bcard{border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;background:var(--w)}'+
    '.mtk-btop{display:flex;align-items:center;justify-content:space-between;gap:6px}.mtk-bn{font-size:12px;font-weight:800;color:var(--navy)}.mtk-bdot{width:9px;height:9px;border-radius:50%;flex:none}'+
    '.mtk-br{font-size:10.5px;color:var(--mu);margin:1px 0 4px}.mtk-bnote{font-size:11px;color:var(--navy);line-height:1.45}</style>';
  h+='<p class="ov-lede">The people running Meta, rated on <b>value creation</b> (a Meta record and a prior/external one) — the color is the net read. The signature feature: a <b>founder with voting control</b> plus a long-tenured inner circle (Li · Cox · Olivan), now bolted onto a <b>brand-new, expensive AI/legal/president bench</b> (Wang · Mahoney · Powell McCormick). <b>Tap any card</b> for the full read.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(META_TRACK_RATE).map(function(k){ var rt=META_TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+rt.c+'"></span>'+rt.l+'</span>'; }).join('')+'</div>';
  h+='<div class="mtk-grid">'+META_TRACK.map(card).join('')+'</div>';
  h+='<div class="ov-sec-h" style="margin:18px 0 8px">Board — value-creation reads</div>';
  h+='<div class="mtk-bgrid">'+META_BOARD_TRACK.map(bcard).join('')+'</div>';
  h+='<div class="ov-foot">Editorial reads from tenure + what each person built (not a Meta statement). Roster verified current as of Jul 2026; see Executives & Board for full bios. Financial trajectory from the Summit model.</div>';
  return h;
}
// Management ▸ Governance & SBC.
function buildSbc(){
  var id='meSbc', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:SBC_YEARS, datasets:[
      { type:'bar', label:'SBC ($B)', data:SBC_DOLLARS, backgroundColor:RL, borderRadius:4, maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Diluted shares (M)', data:SBC_YEARS.map(function(y,i){ return CAP_SHARES[i]; }), borderColor:BRAND, backgroundColor:BRAND, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:BRAND, pointBorderWidth:2, yAxisID:'y1' } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.datasetIndex===0?'$'+ctx.parsed.y.toFixed(1)+'B':ctx.parsed.y+'M'); } } } },
      scales:{ y:{ position:'left', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } },
        y1:{ position:'right', grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function govBody(){
  var h='<p class="ov-lede">The defining governance feature is <b>founder voting control</b> via a dual-class structure — decisive, long-horizon capital allocation on the one hand; little minority-holder say on the other.</p>';
  h+='<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>Dual-class:</b> Class B = 10 votes/share (founder-held), Class A = 1 vote. Zuckerberg controls <b>~61% of voting power</b> with ~13% economics.</li>'+
    '<li><b>Controlled company:</b> combined CEO + Chair; an independent lead director (R. Kimmitt); some independence rules waived under "controlled company" status.</li>'+
    '<li><b>Capital return:</b> first dividend 2024 ($0.50 → $0.525/qtr) + large buybacks; share count −~10% since FY21.</li>'+
    '<li><b>Minority say:</b> say-on-pay and director elections are effectively advisory given the voting majority — the governance discount in the multiple.</li>'+
    '</ul></div>';
  h+=sec('Stock-based compensation vs the share count',
    '<div class="ov-chart-t">SBC expense vs diluted shares <span>($B and M shares, FY)</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="meSbc"></canvas></div>'+
    '<div class="ov-fynote">'+SBC_NOTE+'</div>');
  h+='<div class="ov-foot">Voting/ownership from Meta proxy disclosures; SBC from the 10-K cash-flow statement (approx). Confirm specifics in the latest DEF 14A.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  CHARTS — Management ▸ Governance & SBC (Chart.js, built when the pane is visible)
// ═══════════════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }
function buildCapital(){
  var id='meCap', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:CAP_YEARS, datasets:[
      { label:'Buybacks', data:CAP_BUYBK, backgroundColor:BRAND, stack:'r', maxBarThickness:40 },
      { label:'Dividends', data:CAP_DIV, backgroundColor:RL, stack:'r', maxBarThickness:40, borderRadius:3 },
      { type:'line', label:'Free cash flow', data:CAP_FCF, borderColor:GREEN, backgroundColor:GREEN, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:GREEN, pointBorderWidth:2 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }, y:{ stacked:true, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } } } } });
}

// ═══════════════════════════════════════════════════════════════════════════
//  SHELL — standardized Overview + Deep Dive spine
// ═══════════════════════════════════════════════════════════════════════════
// (The inline STD_STYLE block was removed in the playbook restructure: every class it defined lives in
// css/overview.css, and its pill styling of .dd-tab fought css/selectors.css — playbook A1, §21b.)
// ═══ OV-6 Competitors — the peer map (the same ME_PEERS / ME_SC will feed Valuation ▸ Peers) ═══════════
// Rule 10: no multiple and no market cap is written here. The file holds the DENOMINATORS, from each peer's
// FY2025 10-K (SEC EDGAR XBRL); price, market cap and (when Massive has it) EV are live (api.liveQuote) and the
// multiple is computed in the browser: P/E = price ÷ EPS, EV/EBITDA = EV ÷ EBITDA (EV = live EV, else live
// market cap + net debt below).
//   epsT/epsF  diluted EPS, US$ (GAAP; forward = Bloomberg consensus "IS_COMP_EPS_GAAP")
//   ebitdaT    US$ M = operating income + D&A from the 10-K; ebitdaF = Bloomberg comparable EBITDA FY2026
//   nd         net debt, US$ M = long-term debt (ex leases) − cash & equivalents, Dec 31 2025
//   gt/gf      revenue growth, % — FY2025 vs FY2024 (10-K) / FY2026 consensus vs FY2025
// Forward exists only for the names in BBG_CONSENSUS.txt: META (9/8/2026), GOOGL (9/8/2026), AMZN (9/10/2026).
// Peer set (SAB pre-approved the Overview, 2026-10-20): listed ad platforms. TikTok is private; YouTube is
// inside Alphabet.
var ME_PEERS=[
  { tk:'META', n:'Meta', hl:true, epsT:23.49, epsF:31.61, ebitdaT:101892, ebitdaF:119147, nd:22871, gt:22.2, gf:26.4,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 8 2026',
    why:'The profile company: ads across Facebook, Instagram, Messenger, WhatsApp and Threads, plus Reality Labs.' },
  { tk:'GOOGL', n:'Alphabet', epsT:10.81, epsF:19.90, ebitdaT:150175, ebitdaF:226428, nd:18377, gt:15.1, gf:6.9,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 8 2026',
    why:'Search and YouTube make it the largest seller of digital ads; it also runs Google Cloud.' },
  { tk:'AMZN', n:'Amazon', epsT:7.17, epsF:12.66, ebitdaT:145731, ebitdaF:220794, nd:-17974, gt:12.4, gf:15.6,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 10 2026',
    why:'Its retail-media ads business is a large ad platform, but most of Amazon\'s value is retail and AWS.' },
  { tk:'APP', n:'AppLovin', epsT:9.75, epsF:null, ebitdaT:4347, ebitdaF:null, nd:1026, gt:70.0, gf:null,
    src:'10-K FY2025 (continuing operations)',
    why:'An AI ad engine for mobile apps and e-commerce — competes with Meta for performance ad budgets.' },
  { tk:'RDDT', n:'Reddit', epsT:2.62, epsF:null, ebitdaT:458, ebitdaF:null, nd:-954, gt:69.4, gf:null,
    src:'10-K FY2025',
    why:'Community forums turned into an ad platform, growing fast from a small base.' },
  { tk:'PINS', n:'Pinterest', epsT:0.61, epsF:null, ebitdaT:345, ebitdaF:null, nd:-969, gt:15.8, gf:null,
    src:'10-K FY2025',
    why:'Visual discovery and shopping ads — a smaller social ad platform.' },
  { tk:'TTD', n:'The Trade Desk', epsT:0.90, epsF:null, ebitdaT:705, ebitdaF:null, nd:-658, gt:18.5, gf:null,
    src:'10-K FY2025',
    why:'The largest independent buying platform for open-web ads — the model Meta\'s closed loop competes against.' },
  { tk:'SNAP', n:'Snap', epsT:-0.27, epsF:null, ebitdaT:-369, ebitdaF:null, nd:2506, gt:10.6, gf:null,
    src:'10-K FY2025',
    why:'A social app competing for the same young audience and ad budgets. It lost money in FY2025, so it has no P/E or EV/EBITDA to plot.' },
];

var ME_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: only META, GOOGL and AMZN have a Street forward
function meScReset(){ if(!ME_SC.peers) ME_SC.peers=ME_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function meScNum(v){ return v!=null && !isNaN(v); }
function meScMult(p){
  if(!meScNum(p.px)) return null;                                     // no live price → no bubble (no seeded fallback)
  var f=ME_SC.basis==='f';
  if(ME_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (meScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!meScNum(eb)||eb<=0) return null;
  var ev=meScNum(p.ev)?p.ev:(meScNum(p.mc)&&meScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return meScNum(ev)?ev/eb:null;
}
function meScGrowth(p){ return ME_SC.basis==='f'?p.gf:p.gt; }
function meScVisible(){ return (ME_SC.peers||[]).filter(function(p){ return p.on && meScNum(meScMult(p)) && meScNum(meScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function meScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function meScLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function meStdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="me-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="me-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="me-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="me-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="me-sc-yhi">fast growth</text>'+
    '<g class="me-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips me-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. TikTok (private) and YouTube (inside Alphabet) have no listed multiple.</div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default — copied from
  // amzn.js meStdPeerScatter('dd').
  if(sfx==='dd') h+='<div class="rs-collap me-sc-collap">'+
      '<button type="button" class="rs-collap-h me-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b me-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="me-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip me-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function meScRenderOne(wrap){
  var g=wrap.querySelector('.me-sc-nodes'); if(!g||!ME_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var vis=meScVisible();
  var maxMult=meScNice(Math.max.apply(null, vis.map(meScMult).concat([1]))*1.12);
  var gs=vis.map(meScGrowth), gMax=meScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-meScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.me-sc-xlab'); if(lab) lab.textContent=(ME_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(ME_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.me-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.me-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===ME_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===ME_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=meScMult(p), growth=meScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=meScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=meScLogoUrl(p);
    var read=(ME_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(meScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND2:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND2:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  meScChipsOne(wrap);
  meScTableOne(wrap);
}
// ─── The comps table under the peer map (Valuation ▸ Peers) — copied from amzn.js meScTableOne ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median EXCLUDE Meta (the set it is read against). Premium in red, discount in green.
function meScFmtMult(v){ return meScNum(v)?v.toFixed(1)+'×':'—'; }
function meScFmtPct(v){ return meScNum(v)?v.toFixed(1)+'%':'—'; }
function meScFmtMc(v){ return meScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function meScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function meScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function meScVsAvg(m, avg){
  if(!meScNum(m)||!meScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function meScTableOne(wrap){
  var box=wrap.querySelector('.me-sc-tbl'); if(!box||!ME_SC.peers) return;
  var mLab=(ME_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(ME_SC.basis==='f'?'forward':'trailing');
  var rows=ME_SC.peers.map(function(p){ return { p:p, m:meScMult(p), g:meScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=meScNum(a.m), bn=meScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=meScMean(peers.filter(function(r){ return meScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=meScMedian(peers.filter(function(r){ return meScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=meScMean(peers.filter(function(r){ return meScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=meScMedian(peers.filter(function(r){ return meScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return meScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(meScNum(r.m)?'':' asc-nil'), nt=meScNum(r.m)?'':meScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(meScLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+meScFmtMult(r.m)+'</td>'+
      '<td>'+meScFmtPct(r.g)+'</td>'+
      '<td>'+meScFmtMc(p.mc)+'</td>'+
      '<td>'+meScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-Meta · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+meScFmtMult(avgM)+'</td><td>'+meScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-Meta</span></td>'+
      '<td>'+meScFmtMult(medM)+'</td><td>'+meScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.me-sc-tblh'), bd=wrap.querySelector('.me-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
// Valuation ▸ Peers (VA-PEERS): the same map as Overview ▸ Competitors — same ME_SC state, so removing a
// peer here removes it there — plus the table. Multiples and caps are live; the file holds denominators.
function meValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, with the numbers behind it. Multiples use live prices.</p>'+
    meStdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company’s FY2025 10-K on SEC EDGAR; forward = Bloomberg consensus FY2026 (as of Sep 8–10 2026) for Meta, Alphabet and Amazon only. Price, market cap and EV live (Massive). EBITDA = operating income + D&A; net debt = debt ex leases − cash and equivalents.</div>';
}
// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function meScChipNote(p){
  if(!meScNum(p.epsT)&&!meScNum(p.ebitdaT)&&!meScNum(p.epsF)&&!meScNum(p.ebitdaF)) return 'no figures on file';
  if(!meScNum(p.px)) return 'no live price';
  if(ME_SC.basis==='f' && !meScNum(ME_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!meScNum(meScMult(p))) return ME_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function meScChipsOne(wrap){
  var box=wrap.querySelector('.me-sc-chips'); if(!box||!ME_SC.peers) return;
  var keep=box.querySelector('.me-sc-addtk'); var typed=keep?keep.value:'';
  var h=ME_SC.peers.map(function(p,i){ var nt=meScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="me-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="me-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.me-sc-addtk'); if(inp) inp.value=typed;
}
function meScRenderAll(root){ root.querySelectorAll('.me-sc').forEach(function(w){ meScRenderOne(w); meWireScChips(root, w); }); }
function meWireScatters(root){
  meScReset();
  root.querySelectorAll('.me-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.me-sc-tblh'), tblB=wrap.querySelector('.me-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; meScTableOne(wrap); };
    var g=wrap.querySelector('.me-sc-nodes'), tip=wrap.querySelector('.me-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ ME_SC.basis=btn.getAttribute('data-mgbasis'); meScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ ME_SC.metric=btn.getAttribute('data-mgmetric'); meScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.me-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  meScRenderAll(root); meScFetchCaps(root);
}
function meWireScChips(root, wrap){
  wrap.querySelectorAll('.me-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(ME_SC.peers[i]){ ME_SC.peers.splice(i,1); meScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.me-sc-addbtn'), addIn=wrap.querySelector('.me-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!ME_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=ME_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; ME_SC.peers.push(o); }
        else ME_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; meScRenderAll(root); meLiveOne(root, tk); };
  }
}
function meScFetchCaps(root){ if(ME_SC._capsFetched||!ME_SC.peers) return; ME_SC._capsFetched=true; ME_SC.peers.forEach(function(p){ if(p.tk) meLiveOne(root, p.tk); }); }

// Live market cap (Key Facts cell) via Massive (api.liveQuote). Market data is ALWAYS live — no seeded
// number is ever shown: until the quote arrives the cell says so, and if it fails it says that.
// The same quote feeds the peer bubbles: price (P/E), market cap (bubble size) and EV when Massive has one.
function meLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='META') meMcCell(root,'live quote unavailable'); return; }
    var mcB=q.marketCap/1e9;
    (ME_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='META') meMcCell(root, '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}));
    meScRenderAll(root);
  }).catch(function(){ if(tk==='META') meMcCell(root,'live quote unavailable'); }); }


// ═══ Standardized Overview (OV-1 … OV-7 + OV-F) — copied from tsm.js, the playbook reference ═══════
// Bars shorter than ~10% can't hold their $ label: the label moves just outside the bar.
// Neutral light greys, ranked by size (css/overview.css .gmm-neutral) — the colour field r[4] is ignored.
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
function meStdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 revenue <b>$201.0B (+22%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b> (where Meta\'s customers are based). Both reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Segments</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: operating income <b>$83.3B</b> (41.4% margin) · net income <b>$60.5B</b> (30.1%). The apps earn <b>$102.5B</b>; Reality Labs loses <b>$19.2B</b>. The tax rate was 30% — <b>13% without a one-time charge</b> from the July 2025 US tax law (OBBBA). '+
    '<span class="ave-subh-note">Source: Meta FY2025 Form 10-K (Note 2 Revenue; Note 15 Segment and Geographical Information; MD&A). Geography is by customer address, as Note 2 reports it — not by where users are.</span></div>';
  return h;
}
function meStdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function meStdProducts(){
  return '<div class="ov-diagram-cap gmm-cap-top"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+META_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
// OV-F — the Overview's one source footer (the collapsibles carry none of their own).
var OV_SOURCES='Sources — Meta FY2025 Form 10-K (SEC EDGAR, filed Jan 29 2026) for company facts, headcount, FY2025 revenue by segment, line and customer geography, segment operating income, the tax rate, DAP and ad pricing, products and history; Meta Q4 2025 earnings call (Jan 28 2026) for the Reality Labs outlook; Meta newsroom and 8-Ks for acquisitions, the rename and the Scale AI investment. Peers: each company\'s FY2025 10-K. Market cap and peer multiples are live (Massive price ÷ reported figures as of FY2025; forward ÷ Bloomberg consensus as of Sep 2026 for Meta, Alphabet and Amazon). Forward figures are estimates, not company guidance.';

function html(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-meta" data-brand="META">';
  h+=metaKeyFacts();
  h+='<p class="ov-lede">'+DESC+'</p>';
  h+=metaFourQuad();
  h+=collapsible('How Meta makes money', meStdMoneyMap(), false);
  h+=collapsible('Products & platforms', meStdProducts(), false);
  h+=collapsible('Competitors — the peer map', meStdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Meta', meStdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  h+='<div class="ov-modal-back" id="meModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="meModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="meModalT"></div><div class="ov-modal-b" id="meModalB"></div></div></div>';
  h+='</div>';
  return h;
}
// Deep Dive — the AMZN spine (playbook §5, F1): Top Line · Bottom Line · Evolution · Valuation · Management ·
// Miscellaneous. Mode B: each existing pane sits in its B2 destination (docs/profiles/META.md §5) until its unit
// is rebuilt; sub-tabs with nothing to show yet are not added (rule 5). Pillars is a profile tab again (no
// absorbsPillars), so Analyst Ratings and the Fiscal.ai table live there, as in AMZN.
function subtabs(group, subs){
  var bar='<div class="ovt-subtabs">'+subs.map(function(s,i){ return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; }).join('')+'</div>';
  var panes=subs.map(function(s,i){ return '<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i===0?'':' hidden')+'>'+s.body+'</div>'; }).join('');
  return '<div class="dd-pane" data-dd="'+group+'"'+(group==='topline'?'':' hidden')+'>'+bar+panes+'</div>';
}
function deepDiveHtml(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-meta ov-meta-dd" data-brand="META">';
  h+='<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
  '</div>';
  // Top Line — the shared segments engine (TL-GEN · TL-SEG · TL-OTH · TL-CUS). The old segmentsBody /
  // customersBody panes are retired into it (B2 #14–30); their data constants stay in this file.
  h+=subtabs('topline',[
    { k:'segov', l:'General', body:segmentsOverviewHtml('META') },
    { k:'segdrv', l:'Segments', body:segmentsHtml('META') },
    { k:'segoth', l:'Other', body:segmentsOtherHtml('META') },
    { k:'segcus', l:'Customers', body:segmentsCustomersHtml('META') },
  ]);
  h+=subtabs('bottomline',[
    { k:'margins', l:'General', body:metaBlGeneralHtml() },
    { k:'segments', l:'Segments', body:metaBlSegmentsHtml() },
    { k:'supplychain', l:'Supply Chain', body:metaSplcBody() },   // ./meta-splc.js (BL-SPLC)
  ]);
  h+=subtabs('evolution',[
    { k:'earnings', l:'Earnings', body:metaCeHtml(c) },   // ./meta-ce.js — Amazon's machinery via the guide-built TSM copy (EV-SET/POST/NOTES)
    { k:'results', l:'Results', body:resultsHtml('META') },
    { k:'estevo', l:'Estimates', body:resultsEvoHtml('META') },
  ]);
  h+=subtabs('valuation',[
    { k:'histmult', l:'Historic Multiple', body:metaHistMult.body() },
    { k:'peers', l:'Peers', body:meValuationPeersBody() },
    { k:'submits', l:'Submit History', body:submitsHtml('META') },   // VA-SUB (Summit valuation per submit, frozen; price live)
    { k:'sensitivity', l:'Sensitivity', body:metaSens.body() },
  ]);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:META_MGMT.body() },
    { k:'ownership', l:'Ownership', body:metaOwnBody() },
    { k:'governance', l:'Governance & SBC', body:govBody()+capAllocBody() },
    { k:'track', l:'Track Record', body:trackBody() },
  ]);
  h+=subtabs('misc',[
    { k:'comp', l:'Competitive Position', body:metaCompBody() },
    { k:'capex', l:'Capex & Depreciation', body:metaCapexBody() },
    { k:'capacity', l:'Capacity → Revenue', body:metaCapacityBody() },
    { k:'strategy', l:'Strategy', body:metaStrategyBody() },
    { k:'manda', l:'M&A', body:metaMnaBody() },
  ]);
  h+='</div>';
  return h;
}

// ─── Live quote (Massive via api.liveQuote) ──────────────────────────────────
// No price strip on the Overview (SAB, Oct 20 2026 — the profile header already shows the price):
// the quote only feeds the Key Facts market cap (the peer map and Sensitivity fetch their own).
function meMcCell(root, txt){ var el=root.querySelector('#meMc'); if(el) el.textContent=txt; }
function renderLive(root){
  import('../api.js').then(function(api){ return api.liveQuote('META'); }).then(function(res){
    var q=(res && res.success) ? res.data : null;
    if(!q || q.marketCap==null){ meMcCell(root,'live quote unavailable'); }
    if(!q || q.price==null) return;
    if(q.marketCap!=null){ var mcB=q.marketCap/1e9;
      meMcCell(root, '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})); }
  }).catch(function(){ meMcCell(root,'live quote unavailable'); });
}

// ═══════════════════════════════════════════════════════════════════════════
//  ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════
function activeDD(root){ var t=root.querySelector('.dd-tab.active'); return t?t.getAttribute('data-dd'):'topline'; }
function activeSubKey(root, group){ var p=root.querySelector('.dd-pane[data-dd="'+group+'"] .ovt-subtab.active'); return p?p.getAttribute('data-ovst'):null; }
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'META'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'META'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'META'); });
    else requestAnimationFrame(function(){ initSegmentsOverview(root, 'META'); });
  }
  if(group==='misc' && key==='comp') metaCompInit(root);
  if(group==='misc' && key==='capex') requestAnimationFrame(function(){ metaCapexBuild(root); });
  if(group==='bottomline' && key==='supplychain') requestAnimationFrame(metaSplcBuild);
  if(group==='bottomline' && key==='margins') requestAnimationFrame(function(){ metaBlGeneralBuild(root); });
  if(group==='bottomline' && key==='segments') requestAnimationFrame(function(){ metaBlSegmentsBuild(root); });
  // Earnings ▸ Setup chart (the Results engine, META_SETUP dataset) — build only when Earnings is
  // the visible subpane AND Setup is the active phase (Chart.js needs a non-null offsetParent).
  if(group==='evolution' && key==='earnings'){
    metaCeBuild(root);
  }
  // Results / Estimates engine — pass the pane's OWN wrap + ticker so this second engine instance
  // (beside the Setup chart) re-establishes its dataset and wires the right wrap.
  if(group==='evolution' && key==='results') requestAnimationFrame(function(){
    initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'META'); });
  if(group==='evolution' && key==='estevo') requestAnimationFrame(function(){ initResultsEvo('META'); });
  if(group==='valuation' && key==='histmult') requestAnimationFrame(function(){ metaHistMult.init(root); });
  if(group==='valuation' && key==='peers') requestAnimationFrame(function(){ meWireScatters(root); });
  if(group==='valuation' && key==='submits') requestAnimationFrame(function(){ initSubmits(root, 'META'); });
  if(group==='valuation' && key==='sensitivity') requestAnimationFrame(function(){ metaSens.init(root); });
  if(group==='mgmt' && key==='team') META_MGMT.init(root);
  if(group==='mgmt' && key==='ownership') metaOwnInit(root);
  if(group==='mgmt' && key==='governance'){ buildSbc(); buildCapital(); }
}
function buildDD(root, group){ var key=activeSubKey(root, group); if(key) buildSub(root, group, key); }
function showSub(root, group, key){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  // Keep the clicked tab visually anchored — hiding a tall pane clamps scrollTop otherwise (§6a-iv).
  var btn=pane.querySelector('.ovt-subtab[data-ovst="'+key+'"]');
  ceKeepPos(btn||pane, function(){
    pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
    pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.onclick=function(){ showSub(root, group, b.getAttribute('data-ovst')); }; });
}
function showDD(root, group){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===group); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==group); });
  requestAnimationFrame(function(){ buildDD(root, group); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(b){ b.onclick=function(){ showDD(root, b.getAttribute('data-dd')); }; }); }

function wireModal(root){
  var back=root.querySelector('#meModalBack'); if(back && back.parentNode!==root) root.appendChild(back);
  var mT=root.querySelector('#meModalT'), mB=root.querySelector('#meModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#meModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){ var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='ce'){ return metaCePop(id); }
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:esc(t.y),h:t.d}:null; }
    if(kind==='prod'){ var f=META_PRODUCTS[+id]; if(!f) return null;   // Overview ▸ Products & platforms (OV-5)
      var pb=f.items.map(function(it){ return '<div class="prod-item"><div class="prod-item-n">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd prod-lead">'+esc(f.d)+'</div>'+pb}; }
    if(kind==='splc'){ return metaSplcPop(id); }   // Bottom Line ▸ Supply Chain cards
    if(kind==='matr'){ var tr=META_TRACK.filter(function(x){return x.id===id;})[0]; if(!tr) return null; var rt=META_TRACK_RATE[tr.rate];
      var body='<div style="font-size:12px;color:var(--mu);margin-bottom:4px">'+esc(tr.r)+' · '+esc(tr.t)+'</div>'+
        '<div style="margin:6px 0 10px"><span class="ov-chip" style="background:'+rt.bg+';color:'+rt.c+';border:1px solid '+rt.c+'">'+rt.l+'</span></div>'+
        '<div class="mtk-one" style="font-size:13px;margin-bottom:10px">'+tr.one+'</div>'+
        '<div class="ov-subh" style="margin:6px 0 4px">At Meta</div>'+bullets(tr.co)+
        '<div class="ov-subh" style="margin:10px 0 4px">Prior / external</div>'+bullets(tr.ext)+
        '<div class="ov-fynote" style="margin-top:10px">'+tr.note+'</div>';
      return { t:tr.n, h:body }; }
    return null; }
  // Delegated: catches static AND dynamically-rebuilt [data-detail] elements (e.g. supplier rows).
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
}
function init(c){
  var root=document.querySelector('#co-detailview')||document.querySelector('.ov-meta'); if(!root) return;
  // Overview: collapsibles
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var c2=btn.parentElement; var body=c2.querySelector('.ov-collap-b'); var open=c2.classList.toggle('open'); if(body) body.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Money-map accordions (OV-4) and the Segments ⇄ Geography toggle
  root.querySelectorAll('.ov-meta .acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  root.querySelectorAll('.ov-meta .mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.ov-meta .mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-meta .gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  // Live quote for the Key Facts market cap; the peer map (OV-6) fetches every peer's quote once, META's included.
  renderLive(root);
  meWireScatters(root);
  wireModal(root);
  // Deep Dive machinery
  wireDD(root);
  ['topline','bottomline','evolution','valuation','mgmt','misc'].forEach(function(g){ wireSubtabs(root, g); });
  metaCeWire(root);   // Earnings: phase tabs · quarter pills · estimate toggles · Notes accordions and By theme ⇄ By quarter
  // Paint the initially-visible Deep Dive pane if it is already in the DOM (openCo renders DD after Overview).
  requestAnimationFrame(function(){ if(root.querySelector('.dd-pane')) buildDD(root, activeDD(root)); });
}
function deepDiveInit(c){
  var root=document.querySelector('#co-detailview')||document.querySelector('.ov-meta-dd'); if(!root) return;
  var g=activeDD(root); requestAnimationFrame(function(){ buildDD(root, g); });
}
export var metaOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
