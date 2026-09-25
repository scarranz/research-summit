// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Marriott International, Inc. (Nasdaq: MAR) — company Overview.
// Built on the standardized Overview idiom (js/overviews/dhr.js): Key Facts · lede · 2x2 quadrant ·
// how it makes money · timeline. Products (brand portfolio), the peer scatter and the Deep Dive
// come in later increments — this file is being built poco a poco with the research team.
//
// SOURCES, per docs/OVERVIEW_CONVENTIONS.md §2 (official first):
//   S1  FY2025 Form 10-K (SEC EDGAR, Commission File 1-13881) — Item 1 Business, human capital,
//       brand portfolio, system size, reportable segments, the fee-model mechanics.
//   S2  Q2 2026 earnings press release, 3-Aug-2026 (news.marriott.com) — Q2/1H income statement,
//       fee lines, RevPAR, rooms growth, pipeline, capital return and FY2026 outlook.
//   S3  Marriott corporate history (marriott.com / public record) — the 1927 genesis, the 1993
//       spin-off, the 1998 reorganization, the 2016 Starwood acquisition, Bonvoy (2019).
//
// Brand accent is an ESTIMATE (Marriott red) pending the official press-kit hex — the company's
// brand shows only in the logo and this accent line, per the palette rule.
//
// NOT here yet (increment 2+): FY2025 revenue split by reportable segment (U.S. & Canada / EMEA /
// Greater China / APEC) and by geography — needs the 10-K Note 14 pull; the brand-portfolio product
// cards; the competitor scatter; and the Deep Dive spine. The money map below therefore shows the
// revenue COMPOSITION (fees vs pass-through reimbursement), which the Q2'26 income statement gives
// in full, rather than an un-sourced region split.
// ═══════════════════════════════════════════════════════════════════════════════════════════════

import { MAR_BBG } from './mar-bbg.js';
import { SUMMIT_CAT, SUMMIT_INK, fade } from '../viz-palette.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&(?![a-zA-Z#0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Marriott palette — corporate red (estimate), with a deep maroon as the secondary.
var BRAND='#A70021', BRAND2='#6E1327';

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'&#9662;':'&#9656;')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══ DATA — Overview ═══════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5x2). No traditional IPO exists (Marriott International became public via
// the 1993 spin-off from Marriott Corporation, not an offering — see the timeline), so conventions
// §4.1 says substitute the next most relevant fact: the Bonvoy loyalty base takes that slot, since
// it is the single most defining number about how this company fills its rooms.
var STD_FACTS=[
  ['Listing','Nasdaq: MAR'],
  ['HQ','Bethesda, Maryland, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1927 &middot; J. Willard &amp; Alice Marriott'],
  ['CEO','Anthony Capuano &middot; CEO since Feb 2021'],
  ['Employees','~414,000 managed &middot; Dec 2025'],
  ['Dividend','Payer'],
  ['Loyalty','Marriott Bonvoy &middot; 295M+ members'],
  ['Market cap','live'],
];

var MAR_LEDE='Marriott International is a worldwide franchisor, operator and licensor of hotels, residences, timeshare and other lodging under a portfolio of roughly 30 brands spanning luxury to midscale. It owns or leases less than one percent of the properties in its system — the rest belong to third parties who pay Marriott to run them or fly its flags. At year-end 2025 that system reached 9,805 properties and about 1.78 million rooms across 145 countries and territories.';

// 2x2 quadrant — each cell <= ~30 words.
var STD_BIZ=[
  ['What it sells','Brands and the systems behind them &mdash; it franchises, manages or licenses ~10,000 hotels plus residences, timeshare and other lodging under ~30 brands, from The Ritz-Carlton to City Express. It owns or leases &lt;1% of them.'],
  ['Who buys it','Two customers: the <b>hotel owners and franchisees</b> who pay to operate under Marriott&#39;s brands and reservation systems, and the <b>guests</b> &mdash; largely Bonvoy&#39;s 295M+ members &mdash; whose bookings fill the rooms.'],
  ['How it earns','Asset-light <b>fees</b>: franchise royalties (~4&ndash;7% of room revenue), plus base and incentive management fees. Owned/leased is minor and reimbursed costs are pass-through. <b>Q2&#39;26 gross fee revenue $1,578M (+13%)</b>.'],
  ['The edge','Scale and the <b>Marriott Bonvoy</b> network: 295M+ members book ~68% of global room nights, which draws owners to the flags, which draws more guests. Backed by the industry&#39;s widest brand ladder and largest pipeline (~629K rooms).'],
];

// ─── How it makes money — revenue COMPOSITION, Q2 2026 (three months ended Jun 30, 2026), from the
// consolidated income statement in the Q2'26 release. Two views of the SAME quarter: what Marriott
// keeps (the fee mix) and how the reported top line is built (fees vs the pass-through). The region
// split (U.S. & Canada / EMEA / Greater China / APEC) lands in increment 2 from the 10-K Note 14.
// [label, bar width %, text inside the bar, text to the right, colour, muted note beside the label]
var GMM_FEE=[
  ['Franchise fees', 65, '$1,023M', '65%', BRAND, ''],
  ['Base management', 22, '$343M', '22%', BRAND2, ''],
  ['Incentive management', 13, '$212M', '13%', '#C98A97', ''],
];
var GMM_TOP=[
  ['Cost reimbursement', 72, '$5,058M', '72%', '#9AA4B0', 'pass-through, ~zero margin'],
  ['Gross fee revenues', 22, '$1,578M', '22%', BRAND, 'the real engine'],
  ['Owned, leased &amp; other', 7, '$466M', '7%', BRAND2, ''],
];
var REV_DEFS=[
  { seg:'Franchise fees &mdash; the largest and fastest-growing line',
    desc:'Owners run their own hotels but license a Marriott brand and its systems. Marriott charges an initial application fee plus continuing <b>royalties, typically 4&ndash;7% of room revenue</b> (and up to 4% of food-and-beverage revenue for certain brands), and is reimbursed for centralized programs &mdash; the Loyalty program, reservations and marketing. Agreements generally run 10&ndash;25 years. This is the most asset-light way Marriott earns and the line management is deliberately shifting the mix toward: at year-end 2025, <b>7,644 of 9,805 properties</b> were franchised, licensed or other.',
    econ:[['Q2&#39;26 franchise fees','$1,023M'],['vs Q2&#39;25','$860M &middot; +19%'],['Share of gross fees','~65%'],['Franchised/licensed properties (YE2025)','7,644 &middot; 1,183,513 rooms &amp; units']],
    econNote:'The Q2&#39;26 jump was driven partly by higher co-branded credit-card fees (new JPMorgan Chase and American Express agreements), rooms growth and higher RevPAR &mdash; not room royalties alone.' },
  { seg:'Base management fees &mdash; paid to operate the hotel',
    desc:'Under a management agreement Marriott runs the hotel for the owner &mdash; hiring and supervising staff, and providing reservations, marketing and the Loyalty program. The <b>base management fee is a percentage of the hotel&#39;s revenue</b>. These agreements are longer-dated (initial terms of 20&ndash;30 years, with renewal options) and stickier than a franchise, but tie Marriott more closely to the property. At year-end 2025 Marriott had <b>2,017 company-operated properties</b> (580,170 rooms), which includes the few hotels it owns or leases.',
    econ:[['Q2&#39;26 base management fees','$343M'],['vs Q2&#39;25','$340M &middot; +1%'],['Company-operated properties (YE2025)','2,017 &middot; 580,170 rooms']],
    econNote:'Base fees grow slowly and steadily &mdash; they track hotel revenue, not profit, so they are the most stable of the three fee lines.' },
  { seg:'Incentive management fees &mdash; a share of the profit',
    desc:'On many management contracts Marriott also earns an <b>incentive fee based on the hotel&#39;s profits</b>, in many cases only after the owner has earned a specified return first. That makes this the most operationally-geared line &mdash; it rises fastest when hotel profitability improves, and falls first when it deteriorates. In Q2&#39;26 the growth came disproportionately from the U.S. &amp; Canada; managed hotels in international markets contributed over half of the total incentive fees earned.',
    econ:[['Q2&#39;26 incentive management fees','$212M'],['vs Q2&#39;25','$200M &middot; +6%'],['International share','over half of the total']],
    econNote:'Because incentive fees are struck on profit above an owner return, they are the line most sensitive to the RevPAR cycle in either direction.' },
  { seg:'Cost reimbursement &mdash; why the reported top line is misleading',
    desc:'The single largest line on Marriott&#39;s income statement is not revenue it keeps. Marriott runs centralized programs and property-level operations on behalf of hotel owners &mdash; payroll, the Loyalty program, reservations, marketing &mdash; and <b>bills owners for the cost, at roughly zero margin</b>. It flows through the income statement as both <b>cost reimbursement revenue</b> and a nearly-equal <b>reimbursed expense</b>. Reading Marriott off its ~$7.1B quarterly &ldquo;revenue&rdquo; overstates the business by roughly 4x: the economic engine is the <b>$1.5B of net fee revenue</b>, not the top line.',
    econ:[['Q2&#39;26 cost reimbursement revenue','$5,058M'],['Q2&#39;26 reimbursed expenses','$5,100M'],['Net contribution','roughly nil, by design'],['Q2&#39;26 total revenue','$7,071M']],
    econNote:'This is the standard shape of an asset-light hotel franchisor. Compare fee revenue, not total revenue, across the peer set (Hilton, IHG, Hyatt) &mdash; the pass-through is not comparable value.' },
];

// ─── Timeline — corporate lineage. Genesis (1927), the 1993 spin-off that created the public
// company, the 1998 reorganization, the 2016 Starwood acquisition and Bonvoy (2019) are the load-
// bearing structural events. Source: Marriott corporate history / public record; the 10-K Item 1
// for system facts. Deal values are the widely-reported figures; exact terms will be footnoted from
// the relevant 8-K before any is presented as precise.
var TIMELINE=[
  { y:'1927', t:'<b>Genesis:</b> <b>J. Willard and Alice Marriott</b> open an A&amp;W root-beer stand in Washington, D.C., which grows into the <b>Hot Shoppes</b> restaurant chain &mdash; the company&#39;s origin was food service, not hotels.',
    d:'<ul class="ov-bullets"><li>Incorporated as Hot Shoppes, Inc.; later renamed <b>Marriott Corporation</b>.</li><li>For its first three decades Marriott was a restaurant and food/airline-catering company, not a lodging company.</li></ul>' },
  { y:'1957', t:'<b>Enters lodging:</b> opens its first hotel, the Twin Bridges Motor Hotel in Arlington, Virginia &mdash; the start of the business that defines the company today.' },
  { y:'1993', t:'<b>The public company is created &mdash; by spin-off, not an IPO.</b> Marriott Corporation splits in two: <b>Host Marriott</b> keeps the real estate and debt, and <b>Marriott International</b> takes the asset-light business of managing and franchising hotels.',
    d:'<ul class="ov-bullets"><li>This is the mechanism by which today&#39;s <b>MAR</b> became a public company &mdash; there was no traditional IPO.</li><li>The split deliberately separated <b>owning</b> hotels (Host) from <b>operating and branding</b> them (International) &mdash; the asset-light model Marriott still runs on.</li></ul>' },
  { y:'1995&ndash;97', t:'<b>Moves up-market:</b> takes a controlling interest in <b>The Ritz-Carlton</b> (1995, majority by 1998) and acquires the <b>Renaissance Hotel Group</b> (1997), adding luxury and international scale.' },
  { y:'1998', t:'<b>Reorganization:</b> Marriott International separates its lodging business from its food-service and facilities-management arm, which combines with Sodexho Alliance to form <b>Sodexho Marriott Services</b>. Marriott International continues as the pure lodging company.',
    d:'<ul class="ov-bullets"><li>Completes the focus on lodging: the restaurant/catering heritage is spun away.</li><li>Marriott International emerges as a management-and-franchise company built around brands rather than owned real estate.</li></ul>' },
  { y:'2016', t:'<b>Transformational deal:</b> acquires <b>Starwood Hotels &amp; Resorts</b> for roughly $13B, making Marriott the world&#39;s largest hotel company and adding Sheraton, Westin, W, St. Regis and Le M&eacute;ridien.',
    d:'<ul class="ov-bullets"><li>Roughly doubled the brand portfolio and the loyalty base overnight.</li><li>Brought three loyalty programs (Marriott Rewards, Ritz-Carlton Rewards, Starwood Preferred Guest) under one roof &mdash; later unified as Bonvoy.</li><li>The scale from Starwood is the foundation of the network advantage the company runs on today.</li></ul>' },
  { y:'2019', t:'<b>One loyalty program:</b> Marriott unifies its three post-Starwood programs into <b>Marriott Bonvoy</b> &mdash; now 295M+ members and the demand engine behind ~68% of global room nights.' },
  { y:'2021', t:'<b>CEO transition:</b> <b>Anthony Capuano</b> becomes CEO in February 2021 following the death of long-serving CEO Arne Sorenson; <b>David Marriott</b> becomes Chairman of the Board.' },
];

var OV_SOURCES='Sources — Marriott FY2025 Form 10-K (SEC EDGAR, Commission File 1-13881) for the business description, human capital (~414,000 managed associates), brand portfolio, system size, reportable segments and the fee-model mechanics; the Q2 2026 earnings press release (3-Aug-2026, news.marriott.com) for all Q2/1H income-statement lines, fee mix, RevPAR, rooms growth, pipeline, capital return and the FY2026 outlook; Marriott corporate history / public record for the 1927 genesis, the 1993 spin-off, the 1998 reorganization, the 2016 Starwood acquisition and Marriott Bonvoy (2019). Market cap is live (Massive). Brand accent color is an estimate pending the official press kit.';

// ═══ Overview body ═════════════════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v=(p[0]==='Market cap') ? '<span id="marMc">'+p[1]+'</span>' : p[1];
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function gmmBars(arr){
  return '<div class="ov-mbars">'+arr.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+r[0]+(r[5]?' <span style="color:var(--mu);font-weight:600">'+r[5]+'</span>':'')+'</div>'+
      '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(r[1],1.2)+'%;background:'+r[4]+';">'+r[2]+'</div></div>'+
      '<div class="ov-mbar-v">'+r[3]+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">Marriott is an <b>asset-light fee business</b>. The two views below are the same quarter (<b>Q2 2026</b>, three months ended Jun 30, 2026): what Marriott <b>keeps</b> (the fee mix) and how its reported <b>top line</b> is built.</div>';
  h+='<div class="mg-tog-row" style="display:flex;gap:14px;margin:2px 0 8px"><span class="mg-tog" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)">View: <span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px"><button type="button" class="mg-pill active" data-gmm="fee" style="border:none;background:var(--navy);color:#fff;font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">What it keeps</button><button type="button" class="mg-pill" data-gmm="top" style="border:none;background:transparent;color:var(--mu);font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Reported revenue</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="fee">'+gmmBars(GMM_FEE)+
    '<div class="ave-subh-note" style="margin-top:6px"><b>Gross fee revenues $1,578M (+13% YoY)</b>. This is the economic engine &mdash; the three fee lines Marriott actually keeps. Net fee revenues (after contract-investment amortization) were $1,547M.</div></div>';
  h+='<div class="gmm-view" data-gmm="top" hidden>'+gmmBars(GMM_TOP)+
    '<div class="ave-subh-note" style="margin-top:6px"><b>Total revenue $7,071M</b> &mdash; but ~72% is <b>cost reimbursement</b>, billed to owners at ~zero margin and offset by a near-equal reimbursed expense. Reading Marriott off its reported top line overstates the business by roughly 4x.</div></div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+r[0]+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note" style="margin-top:6px">'+s.econNote+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+s.seg+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px"><b>Next increment:</b> the same revenue split by reportable segment (U.S. &amp; Canada &middot; EMEA &middot; Greater China &middot; APEC) and by geography, from the FY2025 10-K Note 14. <span class="ave-subh-note">Not shown yet rather than shown un-sourced.</span></div>';
  return h;
}
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more &rarr;</div>':'';
    var cls=t.d?' ov-clickable':'', attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+t.y+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>';
}

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
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '</style>';
  // The hook — always visible: Key Facts, description, 2x2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+MAR_LEDE+'</p>';
  h+=stdFourQuad();
  // Everything below defaults collapsed (progressive disclosure).
  h+=collapsible('How Marriott makes money', stdMoneyMap(), false);
  h+=collapsible('Timeline — restaurants to the world’s largest hotel company', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

function html(c){
  var h='<div class="ov ov-mar" data-brand="MAR" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(167,0,33,0.08)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="marModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="marModalX" aria-label="Close">&times;</button>'+
    '<div class="ov-modal-t" id="marModalT"></div><div class="ov-modal-b" id="marModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══ Wiring ════════════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#marModalBack'), mT=root.querySelector('#marModalT'), mB=root.querySelector('#marModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#marModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  if(!root._marDetailWired){
    root._marDetailWired=true;
    root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
  }
}
function wireCommon(root){
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.innerHTML=open?'&#9662;':'&#9656;'; }; });
  // Money-map accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Money-map view toggle (What it keeps <-> Reported revenue)
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ var on=(b===btn); b.style.background=on?'var(--navy)':'transparent'; b.style.color=on?'#fff':'var(--mu)'; });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
}
// Live market cap into the Key Facts cell via Massive (api.liveQuote). Degrades silently.
function marLive(root){
  import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote('MAR'); }).then(function(res){
    var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return;
    var mcB=q.marketCap/1e9;
    var el=root.querySelector('#marMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live';
  }).catch(function(){});
}
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  // Hoist the modal to the shared ancestor so it is not swallowed by an inactive .copane.
  wireModal(root);
  wireCommon(root);
  marLive(root);
}

// ═══ DEEP DIVE ═════════════════════════════════════════════════════════════════════════════════
// The standardized six-section spine (Top Line · Bottom Line · Evolution · Valuation · Management ·
// Miscellaneous). Being built poco a poco: EVOLUTION is filled from the Bloomberg model
// (js/overviews/mar-bbg.js); the other five state what will fill them and from which source, so the
// next increment does not re-derive the inventory. No sub-tab ships as a silent placeholder.
var DD_SECTIONS=[
  ['topline','Top Line'],
  ['bottomline','Bottom Line'],
  ['evolution','Evolution'],
  ['valuation','Valuation'],
  ['management','Management'],
  ['misc','Miscellaneous'],
];
// What each not-yet-built section is waiting on (source in parentheses). Shown as an honest
// "in construction" card, not a fake pane.
var DD_PENDING={
  valuation:{ h:'Valuation — what it is worth, and against what', have:['Adj. EBITDA, adj. EPS, net debt and share count, actual + estimate (Bloomberg model) — enough for forward EV/EBITDA and P/E','Live market cap / EV / price (Massive, api.liveQuote)'], need:['Peer multiples for the scatter (Hilton, IHG, Hyatt, Wyndham, Accor, Choice)','A Summit DCF for MAR (the MCP model, in development) to replace the Bloomberg forward as the primary'] },
  management:{ h:'Management — who runs it and their record', have:['CEO tenure and the 2021 transition (in the Overview timeline)'], need:['Executive & board roster (DEF 14A proxy)','Ownership and SBC (proxy + 10-K)','Capital-return track record — buybacks and the dividend history (Bloomberg model has the series)'] },
  misc:{ h:'Miscellaneous — the things that do not fit, and matter anyway', have:['Co-branded credit-card economics (JPMorgan Chase & American Express) flagged in the Overview fee note'], need:['Loyalty (Bonvoy) deferred-revenue mechanics (10-K Note 2)','Marriott Bonvoy liability build and breakage','Any change-of-estimate / definition items that move reported profit (10-K / 10-Q)'] },
};

function fmtM(v){ if(v==null) return '&ndash;'; var a=Math.abs(v); if(a>=1000) return (v<0?'-':'')+'$'+(a/1000).toFixed(a/1000>=100?1:2).replace(/\.?0+$/,'')+'B'; return (v<0?'-':'')+'$'+Math.round(a).toLocaleString('en-US')+'M'; }
function fmt2(v){ return v==null?'&ndash;':'$'+v.toFixed(2); }
function fmtX(v){ return v==null?'&ndash;':v.toFixed(2)+'x'; }
function fmtRooms(v){ return v==null?'&ndash;':Math.round(v/1000).toLocaleString('en-US')+'K'; }

// Canonical project table (css/results.css: .rs-ft). cols = header strings; est = per-column
// "is estimate" flags (shades the column + adds the "E" mark); rows = [{h, cells, cls}] where
// cls defaults to rs-ft-main (use 'rs-ft-nb' for a main row whose divider passes to its sub row,
// and 'rs-ft-sub' for the indented sub row).
function rsFt(cols, est, rows, firstLabel){
  var h='<div class="rs-tablewrap"><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">'+firstLabel+'</th>';
  cols.forEach(function(c,i){ h+='<th'+(est[i]?' class="rs-ft-este"':'')+'>'+c+(est[i]?' <span class="rs-ft-e">E</span>':'')+'</th>'; });
  h+='</tr></thead><tbody>';
  rows.forEach(function(r){
    h+='<tr class="'+(r.cls||'rs-ft-main')+'"><td class="rs-ft-h">'+r.h+'</td>';
    r.cells.forEach(function(v,i){ h+='<td'+(est[i]?' class="rs-ft-este"':'')+'>'+v+'</td>'; });
    h+='</tr>';
  });
  h+='</tbody></table></div></div>';
  return h;
}
// ═══ Inline-SVG charts ═════════════════════════════════════════════════════════════════════════
// Dependency-free, CSP-safe charts (MAR is a self-contained module and loads no Chart.js). Colours
// and the estimate-fade come from js/viz-palette.js, so a MAR line is the same slot-1 blue as every
// other company's. Rules from the dataviz skill: ONE axis per chart (never dual-axis — that is why
// Occupancy/ADR/RevPAR are drawn INDEXED to a common base, not on two scales); 2px marks; a
// recessive grid; forward/estimate periods are the same hue at reduced alpha + dashed inside a light
// "forecast" band; a legend for >=2 series with a direct end-label per line. Every chart keeps its
// rs-ft data table directly below — the numbers live there, the chart carries the shape.
var GRID='#EAEDF1', AXT='#8A93A0', XT='#6B7480', XTF='#B0B7C0', FBAND='#F4F6F9';
function _log10(x){ return Math.log(x)/Math.LN10; }
function _ticks(min,max){
  if(!(max>min)){ max=min+1; min-=1; }
  var raw=(max-min)/4, mag=Math.pow(10,Math.floor(_log10(raw))), n=raw/mag;
  var step=(n<1.5?1:n<3?2:n<7?5:10)*mag;
  var lo=Math.floor(min/step)*step, hi=Math.ceil(max/step)*step, t=[];
  for(var v=lo;v<=hi+step*0.001;v+=step) t.push(+v.toFixed(6));
  return { ticks:t, min:lo, max:hi };
}
// Shared annual window used by every trend chart AND its table, so they never disagree.
function _win(from,to){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(from), i1=ys.indexOf(to), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var estFrom=idx.length; for(var k=0;k<idx.length;k++){ if(ph[idx[k]]==='E'){ estFrom=k; break; } }
  return { A:A, idx:idx, labels:idx.map(function(i){ return String(ys[i]); }), estFrom:estFrom,
    pick:function(fn){ return idx.map(fn); } };
}
function _trend(){ return _win(2021,2026); }
// Multi-line trend. cfg = { labels, estFrom, series:[{name,short,color,data,fmt}], fmtY, height, note }.
function lineChart(cfg){
  var W=720, H=cfg.height||236, L=48, R=82, T=16, B=28, pw=W-L-R, ph=H-T-B;
  var labels=cfg.labels, n=labels.length, est=(cfg.estFrom==null?n:cfg.estFrom);
  var all=[]; cfg.series.forEach(function(s){ s.data.forEach(function(v){ if(v!=null) all.push(v); }); });
  var tk=_ticks(Math.min.apply(null,all), Math.max.apply(null,all)), mn=tk.min, mx=tk.max;
  var xF=function(i){ return L+(n<2?pw/2:i/(n-1)*pw); };
  var yF=function(v){ return T+(1-(v-mn)/(mx-mn))*ph; };
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" style="width:100%;height:auto;display:block;font-family:Inter,system-ui,sans-serif">';
  // Forecast band (the dashed forward line, faded markers and "E" year already name it — no text label,
  // which would collide with the right-edge series labels).
  if(est<n){ var bx=xF(est-0.5); s+='<rect x="'+bx.toFixed(1)+'" y="'+T+'" width="'+(W-R-bx).toFixed(1)+'" height="'+ph+'" fill="'+FBAND+'"/>'; }
  tk.ticks.forEach(function(v){ var y=yF(v); s+='<line x1="'+L+'" y1="'+y.toFixed(1)+'" x2="'+(W-R)+'" y2="'+y.toFixed(1)+'" stroke="'+GRID+'"/>'+
    '<text x="'+(L-8)+'" y="'+(y+3.5).toFixed(1)+'" text-anchor="end" font-size="10.5" fill="'+AXT+'">'+cfg.fmtY(v)+'</text>'; });
  labels.forEach(function(lb,i){ var f=i>=est; s+='<text x="'+xF(i).toFixed(1)+'" y="'+(H-9)+'" text-anchor="middle" font-size="10.5" font-weight="'+(f?'400':'600')+'" fill="'+(f?XTF:XT)+'">'+esc(lb)+(f?'E':'')+'</text>'; });
  var ends=[];
  cfg.series.forEach(function(sr){
    var col=sr.color, d=sr.data;
    function seg(a,b,dash,alpha){ var p=[]; for(var i=a;i<=b;i++){ if(d[i]==null) continue; p.push((p.length?'L':'M')+xF(i).toFixed(1)+' '+yF(d[i]).toFixed(1)); } return p.length<2?'':'<path d="'+p.join(' ')+'" fill="none" stroke="'+(alpha?fade(col,alpha):col)+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'+(dash?' stroke-dasharray="2 4.5"':'')+'/>'; }
    s+=seg(0, Math.min(est-1,n-1), false, 0);
    if(est<n) s+=seg(est-1, n-1, true, .5);
    for(var i=0;i<n;i++){ if(d[i]==null) continue; var f=i>=est; s+='<circle cx="'+xF(i).toFixed(1)+'" cy="'+yF(d[i]).toFixed(1)+'" r="3.4" fill="'+(f?'#fff':col)+'" stroke="'+col+'" stroke-width="2"><title>'+esc(sr.name)+' · '+esc(labels[i])+(f?'E':'')+': '+(sr.fmt?sr.fmt(d[i]):cfg.fmtY(d[i]))+'</title></circle>'; }
    var li=n-1; while(li>=0 && d[li]==null) li--;
    if(li>=0) ends.push({ y:yF(d[li]), name:sr.short||sr.name, col:col });
  });
  ends.sort(function(a,b){ return a.y-b.y; });
  for(var i=1;i<ends.length;i++){ if(ends[i].y-ends[i-1].y<13) ends[i].y=ends[i-1].y+13; }
  ends.forEach(function(e){ s+='<text x="'+(W-R+9)+'" y="'+(e.y+3.5).toFixed(1)+'" font-size="11" font-weight="700" fill="'+e.col+'">'+esc(e.name)+'</text>'; });
  s+='</svg>';
  var leg=cfg.series.length>1 ? '<div class="mchart-leg">'+cfg.series.map(function(sr){ return '<span class="mchart-leg-i"><i style="background:'+sr.color+'"></i>'+esc(sr.name)+'</span>'; }).join('')+'</div>' : '';
  return '<div class="mchart">'+s+leg+(cfg.note?'<div class="mchart-note">'+cfg.note+'</div>':'')+'</div>';
}
// Stacked bars. cfg = { labels, estFrom, series:[{name,color,data}], fmtY, fmtTotal, height }.
function stackedBar(cfg){
  var W=720, H=cfg.height||250, L=48, R=16, T=18, B=44, pw=W-L-R, ph=H-T-B;
  var labels=cfg.labels, n=labels.length, est=(cfg.estFrom==null?n:cfg.estFrom);
  var totals=labels.map(function(_,i){ var t=0; cfg.series.forEach(function(s){ t+=s.data[i]||0; }); return t; });
  var tk=_ticks(0, Math.max.apply(null,totals)), mx=tk.max;
  var gap=pw/n, bw=Math.min(56, gap*0.6), xC=function(i){ return L+gap*i+gap/2; }, yF=function(v){ return T+(1-v/mx)*ph; };
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" style="width:100%;height:auto;display:block;font-family:Inter,system-ui,sans-serif">';
  if(est<n){ var bx=L+gap*est; s+='<rect x="'+bx.toFixed(1)+'" y="'+T+'" width="'+(W-R-bx).toFixed(1)+'" height="'+ph+'" fill="'+FBAND+'"/>'+
    '<text x="'+(W-R-3)+'" y="'+(T+10)+'" text-anchor="end" font-size="9" font-weight="700" fill="#B6BEC6">FORECAST</text>'; }
  tk.ticks.forEach(function(v){ var y=yF(v); s+='<line x1="'+L+'" y1="'+y.toFixed(1)+'" x2="'+(W-R)+'" y2="'+y.toFixed(1)+'" stroke="'+GRID+'"/>'+
    '<text x="'+(L-8)+'" y="'+(y+3.5).toFixed(1)+'" text-anchor="end" font-size="10.5" fill="'+AXT+'">'+cfg.fmtY(v)+'</text>'; });
  for(var i=0;i<n;i++){ var cx=xC(i), f=i>=est, acc=0;
    cfg.series.forEach(function(sr){ var v=sr.data[i]||0; if(v<=0) return; var yT=yF(acc+v), yB=yF(acc), hgt=Math.max(yB-yT-2,0.6), col=f?fade(sr.color,.5):sr.color;
      s+='<rect x="'+(cx-bw/2).toFixed(1)+'" y="'+yT.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+hgt.toFixed(1)+'" rx="2" fill="'+col+'"><title>'+esc(sr.name)+' · '+esc(labels[i])+(f?'E':'')+': '+cfg.fmtY(v)+'</title></rect>'; acc+=v; });
    s+='<text x="'+cx.toFixed(1)+'" y="'+(yF(acc)-6).toFixed(1)+'" text-anchor="middle" font-size="10.5" font-weight="800" fill="'+(f?'#9AA2AC':'#1E2733')+'">'+cfg.fmtTotal(acc)+'</text>'+
      '<text x="'+cx.toFixed(1)+'" y="'+(H-24)+'" text-anchor="middle" font-size="10.5" font-weight="'+(f?'400':'600')+'" fill="'+(f?XTF:XT)+'">'+esc(labels[i])+(f?'E':'')+'</text>';
  }
  s+='</svg>';
  var leg='<div class="mchart-leg">'+cfg.series.map(function(sr){ return '<span class="mchart-leg-i"><i style="background:'+sr.color+'"></i>'+esc(sr.name)+'</span>'; }).join('')+'</div>';
  return '<div class="mchart">'+s+leg+'</div>';
}

// Reading-mode toggle for a chart (Level · YoY · Share …), the same idiom as results.js. buildFn(mode)
// returns the chart HTML; the pill row re-renders the body on click (wired generically in ddInit). The
// registry lets the click handler recompute from the mode key without re-running the whole pane.
var MCH={};
function mchWrap(id, modes, buildFn){
  MCH[id]=buildFn;
  var pills='<div class="mch-modes" data-mch="'+id+'">'+modes.map(function(m,i){
    return '<button type="button" class="mch-mode'+(i===0?' active':'')+'" data-mode="'+m[0]+'">'+m[1]+'</button>'; }).join('')+'</div>';
  return '<div class="mch-wrap" data-mch="'+id+'">'+pills+'<div class="mch-body">'+buildFn(modes[0][0])+'</div></div>';
}

function finTable(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase;
  // Show FY2021 (first post-COVID normalization) through FY2028E.
  var i0=ys.indexOf(2021), i1=ys.indexOf(2028), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; });
  var col=function(fn){ return idx.map(fn); };
  var gf=function(i){ return A.baseFee[i]+A.franchiseFee[i]+A.incentiveFee[i]; };
  var rows=[
    {h:'Total revenue', cells:col(function(i){ return fmtM(A.revenue[i]); })},
    {h:'Gross fee revenue', cells:col(function(i){ return fmtM(gf(i)); })},
    {h:'Adj. EBITDA', cls:'rs-ft-nb', cells:col(function(i){ return fmtM(A.adjEbitda[i]); })},
    {h:'Adj. EBITDA margin¹', cls:'rs-ft-sub', cells:col(function(i){ return (A.adjEbitda[i]/A.revenue[i]*100).toFixed(1)+'%'; })},
    {h:'Adj. diluted EPS', cells:col(function(i){ return fmt2(A.adjDilEps[i]); })},
    {h:'Net income (GAAP)', cells:col(function(i){ return fmtM(A.gaapNetIncome[i]); })},
    {h:'Free cash flow', cells:col(function(i){ return fmtM(A.fcf[i]); })},
    {h:'Dividend / share', cells:col(function(i){ return fmt2(A.dps[i]); })},
    {h:'Net debt / EBITDA', cells:col(function(i){ return fmtX(A.netDebtToEbitda[i]); })},
    {h:'Systemwide RevPAR', cells:col(function(i){ return fmt2(A.revparSys[i]); })},
    {h:'System rooms', cells:col(function(i){ return fmtRooms(A.rooms[i]); })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY ($M unless noted)');
}

// Evolution ▸ a metric picker over the FY2021→2028E annual model. One metric at a time (one axis —
// the lines are heterogeneous: $, EPS, x, count), same lineChart idiom as Top/Bottom Line. The full
// annual summary table stays below, so the numbers for every metric are always on screen.
var _dollarB=function(v){ var a=Math.abs(v); return '$'+(a>=1000?(v/1000).toFixed(1)+'B':Math.round(v)+'M'); };
function _gf(A,i){ return A.baseFee[i]+A.franchiseFee[i]+A.incentiveFee[i]; }
// share:true → "% of revenue" (common size) applies; the $ P&L lines have it, EPS/RevPAR/Rooms don't.
var EVO_METRICS=[
  { k:'rev',    label:'Revenue',        get:function(A,i){ return A.revenue[i]; },       fmtY:_dollarB, fmt:fmtM },
  { k:'fee',    label:'Gross fee',      get:_gf,                                          fmtY:_dollarB, fmt:fmtM, share:true },
  { k:'ebitda', label:'Adj. EBITDA',    get:function(A,i){ return A.adjEbitda[i]; },      fmtY:_dollarB, fmt:fmtM, share:true },
  { k:'eps',    label:'Adj. EPS',       get:function(A,i){ return A.adjDilEps[i]; },      fmtY:function(v){ return '$'+v.toFixed(2); }, fmt:fmt2 },
  { k:'ni',     label:'Net income',     get:function(A,i){ return A.gaapNetIncome[i]; },  fmtY:_dollarB, fmt:fmtM, share:true },
  { k:'fcf',    label:'Free cash flow', get:function(A,i){ return A.fcf[i]; },            fmtY:_dollarB, fmt:fmtM, share:true },
  { k:'revpar', label:'RevPAR',         get:function(A,i){ return A.revparSys[i]; },      fmtY:function(v){ return '$'+Math.round(v); }, fmt:fmt2 },
  { k:'rooms',  label:'System rooms',   get:function(A,i){ return A.rooms[i]; },          fmtY:function(v){ return (v/1e6).toFixed(2)+'M'; }, fmt:fmtInt },
];
function evoMetric(k){ for(var i=0;i<EVO_METRICS.length;i++){ if(EVO_METRICS[i].k===k) return EVO_METRICS[i]; } return EVO_METRICS[0]; }
function evoChart(m, mode){
  var t=_win(2021,2028), A=t.A;
  if(mode==='yoy'){
    return lineChart({ labels:t.labels, estFrom:t.estFrom, height:250, fmtY:function(v){ return v.toFixed(0)+'%'; },
      note:m.label+' &mdash; year-over-year growth (from 2022; 2021 laps the COVID trough).',
      series:[ { name:m.label+' YoY', short:m.label, color:SUMMIT_INK, fmt:function(v){ return (v>=0?'+':'')+v.toFixed(1)+'%'; },
        data:t.idx.map(function(i,k){ if(k===0) return null; var p=m.get(A,i-1); return (p==null||p===0)?null:(m.get(A,i)/p-1)*100; }) } ] });
  }
  if(mode==='share' && m.share){
    return lineChart({ labels:t.labels, estFrom:t.estFrom, height:250, fmtY:function(v){ return v.toFixed(0)+'%'; },
      note:m.label+' as % of total revenue (common size).',
      series:[ { name:m.label+' % of revenue', short:m.label, color:SUMMIT_INK, fmt:function(v){ return v.toFixed(1)+'%'; },
        data:t.pick(function(i){ return m.get(A,i)/A.revenue[i]*100; }) } ] });
  }
  return lineChart({ labels:t.labels, estFrom:t.estFrom, height:250, fmtY:m.fmtY,
    series:[ { name:m.label, short:m.label, color:SUMMIT_INK, data:t.pick(function(i){ return m.get(A,i); }), fmt:m.fmt } ] });
}
var EVO_MODES=[ ['level','Level'],['yoy','YoY growth'],['share','% of revenue'] ];
function evoPicker(){
  var h='<div class="evo-wrap">';
  h+='<div class="mch-modes evo-modes">'+EVO_MODES.map(function(m,i){
    return '<button type="button" class="mch-mode'+(i===0?' active':'')+'" data-mode="'+m[0]+'">'+m[1]+'</button>'; }).join('')+'</div>';
  h+='<div class="evo-pick">'+EVO_METRICS.map(function(m,i){
    return '<button type="button" class="evo-pill'+(i===0?' active':'')+'" data-evo="'+m.k+'">'+m.label+'</button>'; }).join('')+'</div>';
  h+='<div class="evo-body">'+evoChart(EVO_METRICS[0],'level')+'</div>';
  h+='</div>';
  return h;
}
function evolutionBody(){
  var h='<div class="ov-lede" style="margin-top:2px">The Bloomberg model (actuals through 2Q26, BST estimates thereafter) is the interim financial spine while the Summit DCF is built. Pick a metric to see its FY2021&ndash;2028E path; the full annual summary is in the table below.</div>';
  h+=evoPicker();
  h+='<div class="ov-diagram-cap" style="margin:14px 0 4px"><b>Annual summary</b> &mdash; FY2021&ndash;2028E.</div>';
  h+=finTable();
  h+='<div class="ave-subh-note" style="margin-top:8px">Columns marked <b>E</b> are Bloomberg (BST) consensus estimates, not company guidance. <sup>1</sup>Adj. EBITDA margin is computed here on <b>total revenue</b>; Bloomberg strikes it on its ex-reimbursement &ldquo;adjusted revenue&rdquo; base instead (~77%), which is not comparable to a normal margin &mdash; see <code>mar-bbg.js</code>.</div>';
  h+='<div class="ov-foot">Source — Bloomberg &ldquo;Company Financial (Multiple Periods)&rdquo; export for MAR US Equity (Estimate Source: BST; Actual Source: Bloomberg), annual FY2016&ndash;FY2030, uploaded Sep 2026. No Summit DCF model exists for MAR yet; this is the interim source. Figures are Bloomberg&#39;s; margins and gross-fee sums are computed from the reported dollar lines.</div>';
  return h;
}
function pendingBody(key){
  var p=DD_PENDING[key]; if(!p) return '';
  return '<div class="mar-pend"><div class="mar-pend-h">'+p.h+'</div>'+
    '<div class="mar-pend-s">Being built poco a poco. Here is what is already sourced against what still has to be pulled &mdash; so the next increment does not re-derive it.</div>'+
    '<div class="mar-pend-c"><div class="mar-pend-have"><div class="mar-pend-k">Already sourced</div><ul>'+p.have.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div>'+
    '<div class="mar-pend-need"><div class="mar-pend-k">Still to pull</div><ul>'+p.need.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div></div></div>';
}

// ─── Top Line ▸ Segments — by who OWNS the hotel and who OPERATES it. All figures YE2025.
// Rooms by model (10-K Item 1 property tables + Bloomberg model): total system 1,779,936 rooms.
var TL_ROOMS=[
  ['Franchised / licensed', 66.5, '1,183,513', '66%', BRAND, '7,644 hotels'],
  ['Managed', 31.8, '565,764', '32%', BRAND2, '1,966 hotels'],
  ['Residences', 0.9, '', '1%', '#C98A97', '16,253 rooms · 144 props'],
  ['Owned & leased', 0.8, '', '1%', '#9AA4B0', '14,406 rooms · 51 hotels'],
];
// Rooms & hotels by GEOGRAPHY (YE2025), from the FY2025 10-K property tables (Item 2). Rooms bar
// width = share of the 1,779,936-room system; the note carries the hotel (property) count.
// Timeshare & the Ritz-Carlton Yacht Collection are reported outside the regional split.
var TL_GEO=[
  ['U.S. &amp; Canada', 59.8, '1,065,108', '60%', BRAND, '6,360 hotels'],
  ['Greater China', 10.6, '188,596', '11%', BRAND2, '684 hotels'],
  ['Europe', 9.4, '167,323', '9%', '#B5838D', '988 hotels'],
  ['Asia Pacific ex. China', 8.8, '157,326', '9%', '#7A8290', '733 hotels'],
  ['Caribbean &amp; Latin America', 5.2, '', '5%', '#C98A97', '93,134 rooms · 545 hotels'],
  ['Middle East &amp; Africa', 4.8, '', '5%', '#9AA4B0', '84,934 rooms · 397 hotels'],
  ['Timeshare &amp; Yacht', 1.3, '', '1%', '#C7CED6', '23,515 rooms · 98 props'],
];
// Geography × business model — rooms by region AND by ownership model (Bloomberg regional
// breakdown, YE2025). Reconciles to the by-model totals and to the 1,779,936-room system.
var MODEL_COLORS=[ ['Managed',BRAND2], ['Franchised, licensed &amp; other',BRAND], ['Owned &amp; leased','#9AA4B0'], ['Residences','#C98A97'] ];
var TL_GEOMODEL={ max:1084057, regions:[
  { name:'U.S. &amp; Canada', hotels:'~6,360 hotels', total:1084057, seg:[206538, 864427, 5539, 7553] },
  { name:'International', hotels:'~3,347 hotels', total:695879, seg:[359226, 319086, 8867, 8700] },
]};
function geoStacked(){
  var G=TL_GEOMODEL, max=G.max;
  var h='<div class="seg-sb">';
  G.regions.forEach(function(r){
    h+='<div class="seg-sb-row"><div class="seg-sb-l">'+r.name+'<span class="seg-sb-sub">'+r.hotels+'</span></div><div class="seg-sb-track">';
    r.seg.forEach(function(v,i){ var w=v/max*100; h+='<div class="seg-sb-seg" style="width:'+w+'%;background:'+MODEL_COLORS[i][1]+'"></div>'; });
    var gap=(max-r.total)/max*100; if(gap>0.1) h+='<div class="seg-sb-seg seg-sb-gap" style="width:'+gap+'%"></div>';
    h+='</div><div class="seg-sb-v">'+Math.round(r.total/1000).toLocaleString('en-US')+'K</div></div>';
  });
  h+='</div><div class="seg-leg">'+MODEL_COLORS.map(function(m){ return '<span class="seg-leg-i"><i style="background:'+m[1]+'"></i>'+m[0]+'</span>'; }).join('')+'</div>';
  return h;
}
function geoMatrix(){
  var rows=[
    {h:'U.S. &amp; Canada', cells:['206,538','864,427','5,539','7,553','<b>1,084,057</b>']},
    {h:'International', cells:['359,226','319,086','8,867','8,700','<b>695,879</b>']},
    {h:'Total system', cells:['<b>565,764</b>','<b>1,183,513</b>','<b>14,406</b>','<b>16,253</b>','<b>1,779,936</b>']},
  ];
  return rsFt(['Managed','Franchised, L&amp;O','Owned &amp; leased','Residences','Total rooms'], [false,false,false,false,false], rows, 'Rooms · YE2025');
}
var LIC='#7A8290'; // Licensed / Other — the "hands-off brand rent" model
// The three third-party models, compared dimension by dimension. Source: 10-K Item 1 (Franchised,
// Licensed & Other · Company-Operated · Residential; the MVW timeshare licence, MGM Collection,
// Design Hotels and Ritz-Carlton Yacht Collection) and the fee footnote; counts and fee lines from
// the Bloomberg model (FY2025). Marriott reports franchise + licence fees together, so the exact
// franchise-vs-licence split is not separately disclosed — the table says so.
var TL_CMP=[
  ['Who owns it','A third-party owner','A third-party owner','A third party &mdash; MVW for timeshare; developers &amp; buyers for residences'],
  ['Who runs it day-to-day','<b>Marriott</b> operates it','The <b>owner</b> (or an operator it hires &mdash; not Marriott)','The <b>licensee</b> &mdash; Marriott has no operating role at all'],
  ['Who employs the staff','Marriott &mdash; bills the owner for payroll (reimbursed, ~0 margin)','The owner','The licensee'],
  ['What Marriott provides','Full operation <b>+</b> brand, loyalty, reservations, marketing','Brand <b>+</b> systems (reservations, loyalty, standards)','<b>Only the brand / trademark</b> + Marriott Bonvoy affiliation'],
  ['What Marriott charges','A <b>base fee</b> (% of hotel <b>revenue</b>) + often an <b>incentive fee</b> (% of hotel <b>profit</b>, above an owner return)','A <b>royalty</b> ~<b>4&ndash;7% of room revenue</b> (+ up to 4% of F&amp;B) and an application fee','<b>Royalty / branding fees</b> &mdash; timeshare (fixed + volume-based, via MVW), one-time residential branding fees, collection royalties'],
  ['FY2025 fees','Base $1,322M + incentive $791M = <b>$2,113M</b>','Hotel royalties &mdash; the bulk of the <b>$3,325M</b> &ldquo;Franchise fees&rdquo; line','Timeshare, residential &amp; collection fees &mdash; the rest of that same $3,325M line'],
  ['Typical term','20&ndash;30 years','10&ndash;25 years','Long-term brand-licence agreements'],
  ['Scale (YE2025)','1,966 hotels &middot; <b>565,764 rooms</b>','~7,500 franchised hotels &mdash; bulk of the 1.18M &ldquo;franchised, licensed &amp; other&rdquo; rooms','Timeshare 95 &middot; 22,912 rooms; Residences 144 &middot; 16,253 units; + MGM, Design Hotels &amp; Yacht collections'],
  ['Who bears cost &amp; capital','The owner','The owner','The licensee'],
  ['Marriott capital at risk','None (may lend/invest selectively)','None','None'],
];
function tlFlow(nodes, color){
  return '<div class="mar-flow">'+nodes.map(function(n,i){
    return (i?'<span class="mar-flow-a" style="color:'+color+'">&rarr;</span>':'')+'<span class="mar-flow-n">'+n+'</span>';
  }).join('')+'</div>';
}
function tlOwnedPane(){
  var chips=[['51','hotels'],['14,406','rooms'],['0.8%','of system rooms'],['$1,679M','FY2025 owned, leased &amp; other revenue']];
  var h='<div class="mar-stats">'+chips.map(function(c){ return '<div class="mar-stat"><div class="mar-stat-v">'+c[0]+'</div><div class="mar-stat-l">'+c[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="famd" style="margin:12px 0 10px">Marriott owns the real estate outright or holds a long-term lease. This is the <b>only</b> model where Marriott takes the whole hotel P&amp;L onto its own books &mdash; and it is deliberately tiny: <b>under 1% of the system</b>, shrunk over decades in favour of fees.</div>';
  h+='<ul class="ov-bullets" style="margin-bottom:12px">'+
    '<li>The hotel&#39;s <b>entire revenue</b> (rooms, food &amp; beverage, other) is booked as &ldquo;<b>Owned, leased &amp; other</b>&rdquo; revenue &mdash; <b>$1,679M</b> in FY2025 &mdash; and Marriott <b>bears the operating costs</b> and, for owned assets, the capital.</li>'+
    '<li>Highest revenue per property, but the <b>lowest-margin and most capital-intensive</b> model. That is exactly why Marriott keeps it small.</li>'+
    '<li>Used for a handful of <b>strategic or flagship</b> assets and some <b>legacy leases</b> &mdash; not a growth vehicle. Franchising is.</li></ul>';
  h+=tlFlow(['Guests pay the hotel','Marriott keeps the full P&amp;L (revenue &minus; costs)','+ brand &amp; loyalty value'], BRAND2);
  return h;
}
function tlThirdPane(){
  var h='<div class="famd" style="margin:2px 0 12px"><b>99%+ of the system is owned by third parties.</b> Marriott plugs into them <b>three</b> ways: it <b>operates</b> the hotel for the owner (managed), <b>franchises</b> the brand and systems to an owner who runs it (franchised), or <b>only lends its brand</b> to something it neither operates nor franchises as a hotel &mdash; timeshare, residences and collections (licensed). In all three the third party keeps the real estate, the costs and the capital.</div>';
  h+='<div class="mar-mdl2">'+
    '<div class="mar-mdl"><div class="mar-mdl-h" style="border-top-color:'+BRAND2+'"><div class="mar-mdl-t">Managed</div><div class="mar-mdl-s">Marriott operates the hotel</div></div>'+tlFlow(['Third-party owner','Marriott operates &amp; staffs it','Guests'],BRAND2)+'</div>'+
    '<div class="mar-mdl"><div class="mar-mdl-h" style="border-top-color:'+BRAND+'"><div class="mar-mdl-t">Franchised</div><div class="mar-mdl-s">Owner operates; Marriott franchises the brand</div></div>'+tlFlow(['Third-party owner operates','Franchises Marriott brand + systems','Guests'],BRAND)+'</div>'+
    '<div class="mar-mdl"><div class="mar-mdl-h" style="border-top-color:'+LIC+'"><div class="mar-mdl-t">Licensed / Other</div><div class="mar-mdl-s">Marriott lends only its brand</div></div>'+tlFlow(['Third party owns &amp; runs it','Licenses only the Marriott brand','Guests / buyers'],LIC)+'</div>'+
    '</div>';
  h+='<div class="mar-cmp"><div class="mar-cmp-row mar-cmp-head"><div></div><div style="color:'+BRAND2+'">Managed</div><div style="color:'+BRAND+'">Franchised</div><div style="color:'+LIC+'">Licensed / Other</div></div>'+
    TL_CMP.map(function(r){ return '<div class="mar-cmp-row"><div class="mar-cmp-d">'+r[0]+'</div><div>'+r[1]+'</div><div>'+r[2]+'</div><div>'+r[3]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ave-subh-note" style="margin-top:10px">Marriott reports franchise <b>and</b> licence fees together as one &ldquo;<b>Franchise fees</b>&rdquo; line ($3,325M FY2025) and groups these properties as &ldquo;Franchised, Licensed &amp; Other,&rdquo; so the exact franchise-vs-licence split is not separately disclosed. In all three models the owner/licensee pays for operations and capital; Marriott&#39;s &ldquo;cost reimbursement&rdquo; ($19.2B FY2025) is pass-through at ~0 margin, not profit. The real economics are the fees above.</div>';
  return h;
}
// ─── Top Line ▸ KPIs — the demand engine (Occupancy × ADR = RevPAR) and Marriott's own split of
// fees into RevPAR-related vs non-RevPAR-related. Operating metrics from the Bloomberg model;
// fee sensitivities and non-RevPAR guidance from the FY2026 outlook on the 4Q25/1Q26/2Q26 calls.
var TL_REGIONS=[ // FY2025 systemwide by region (USD). occ/adr disclosed only at US&Canada / International.
  {name:'U.S. &amp; Canada', occ:69.5, adr:190.33, revpar:132.35, growth:'+0.7% cc', sub:false},
  {name:'International', occ:69.9, adr:183.05, revpar:121.75, growth:'+5.1% cc', sub:false},
  {name:'Europe', occ:null, adr:null, revpar:160.65, growth:'', sub:true},
  {name:'Middle East &amp; Africa', occ:null, adr:null, revpar:131.32, growth:'', sub:true},
  {name:'Greater China', occ:null, adr:null, revpar:76.53, growth:'', sub:true},
  {name:'Asia Pacific ex. China', occ:null, adr:null, revpar:133.12, growth:'', sub:true},
  {name:'Caribbean &amp; Latin America', occ:null, adr:null, revpar:126.14, growth:'', sub:true},
];
function kpiTiles(){
  var Q=MAR_BBG.quarterly, li=Q.phase.lastIndexOf('A'), lbl=Q.labels[li];
  var t=[
    ['$'+Q.revparSys[li].toFixed(2), 'RevPAR &middot; '+lbl],
    [Q.occSys[li].toFixed(1)+'%', 'Occupancy'],
    ['$'+Q.adrSys[li].toFixed(2), 'ADR (avg daily rate)'],
    ['+'+Q.revparGrowthCC[li].toFixed(1)+'%', 'RevPAR growth (cc)'],
  ];
  return '<div class="mar-stats">'+t.map(function(c){ return '<div class="mar-stat"><div class="mar-stat-v">'+c[0]+'</div><div class="mar-stat-l">'+c[1]+'</div></div>'; }).join('')+'</div>';
}
function kpiTrend(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(2021), i1=ys.indexOf(2026), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; });
  var col=function(fn){ return idx.map(fn); };
  var rows=[
    {h:'Occupancy', cells:col(function(i){ return A.occSys[i].toFixed(1)+'%'; })},
    {h:'ADR', cells:col(function(i){ return '$'+A.adrSys[i].toFixed(2); })},
    {h:'RevPAR', cls:'rs-ft-nb', cells:col(function(i){ return '$'+A.revparSys[i].toFixed(2); })},
    {h:'RevPAR YoY (rep.)', cls:'rs-ft-sub', cells:col(function(i){ var p=A.revparSys[i-1]; if(p==null) return '<span class="rs-ft-nil">&ndash;</span>'; var g=(A.revparSys[i]/p-1)*100; return (g>=0?'+':'')+g.toFixed(1)+'%'; })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY');
}
function kpiRegions(){
  var nil='<span class="rs-ft-nil">&ndash;</span>';
  var rows=TL_REGIONS.map(function(r){
    return { h:r.name, cls:(r.sub?'rs-ft-sub':'rs-ft-main'),
      cells:[ r.occ!=null?r.occ.toFixed(1)+'%':nil, r.adr!=null?'$'+r.adr.toFixed(2):nil, '$'+r.revpar.toFixed(2), r.growth||nil ] };
  });
  return rsFt(['Occupancy','ADR','RevPAR','Growth (cc)'], [false,false,false,false], rows, 'Region · FY2025');
}
function fmtInt(v){ return v==null?'<span class="rs-ft-nil">&ndash;</span>':Math.round(v).toLocaleString('en-US'); }
function yoyStr(cur, prev){ if(cur==null||prev==null) return '<span class="rs-ft-nil">&ndash;</span>'; var g=(cur/prev-1)*100; return (g>=0?'+':'')+g.toFixed(1)+'%'; }

// ── KPI ▸ RevPAR — the demand engine (Occupancy × ADR).
function kpiRevparChart(mode){
  var t=_trend(), A=t.A, pctg=function(v){ return (v>=0?'+':'')+v.toFixed(1)+'%'; };
  if(mode==='yoy'){
    var yoy=function(arr){ return t.idx.map(function(i,k){ if(k===0) return null; var p=arr[i-1]; return p==null?null:(arr[i]/p-1)*100; }); };
    return lineChart({ labels:t.labels, estFrom:t.estFrom, height:238, fmtY:function(v){ return v.toFixed(0)+'%'; },
      note:'Year-over-year growth (from 2022 &mdash; 2021 laps the COVID trough). RevPAR growth &asymp; Occupancy growth + ADR growth.',
      series:[
        { name:'Occupancy', short:'Occ.', color:SUMMIT_CAT[0], data:yoy(A.occSys), fmt:pctg },
        { name:'ADR', short:'ADR', color:SUMMIT_CAT[1], data:yoy(A.adrSys), fmt:pctg },
        { name:'RevPAR', short:'RevPAR', color:SUMMIT_INK, data:yoy(A.revparSys), fmt:pctg },
      ] });
  }
  var b={ occ:A.occSys[t.idx[0]], adr:A.adrSys[t.idx[0]], rev:A.revparSys[t.idx[0]] };
  var pct0=function(v){ return v.toFixed(0); };
  return lineChart({ labels:t.labels, estFrom:t.estFrom, height:238, fmtY:function(v){ return Math.round(v); },
    note:'Indexed to 2021 = 100 &mdash; the three trends on one scale (absolute values in the table below). RevPAR = Occupancy &times; ADR, so it compounds both.',
    series:[
      { name:'Occupancy', short:'Occ.', color:SUMMIT_CAT[0], data:t.pick(function(i){ return A.occSys[i]/b.occ*100; }), fmt:pct0 },
      { name:'ADR', short:'ADR', color:SUMMIT_CAT[1], data:t.pick(function(i){ return A.adrSys[i]/b.adr*100; }), fmt:pct0 },
      { name:'RevPAR', short:'RevPAR', color:SUMMIT_INK, data:t.pick(function(i){ return A.revparSys[i]/b.rev*100; }), fmt:pct0 },
    ] });
}
function kpiRevparPane(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 6px"><b>Demand &mdash; systemwide,</b> latest quarter (2Q26).</div>';
  h+=kpiTiles();
  h+='<div class="ave-subh-note" style="margin-top:6px">2Q26 worldwide RevPAR +3.4% (cc): <b>U.S. &amp; Canada +5.0%</b>, <b>International &minus;0.5%</b>. RevPAR = Occupancy &times; ADR.</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Occupancy · ADR · RevPAR over time</b> &mdash; systemwide, FY2021&ndash;2026E.</div>'+
    mchWrap('revpar', [['idx','Indexed (2021=100)'],['yoy','YoY growth']], kpiRevparChart)+kpiTrend();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>By region</b> &mdash; FY2025.</div>'+kpiRegions();
  h+='<div class="ave-subh-note" style="margin-top:6px">Occupancy and ADR are disclosed for U.S. &amp; Canada and International; sub-regions carry RevPAR only. Greater China is the clear laggard; Europe the strongest.</div>';
  h+='<div class="ov-foot">Source &mdash; systemwide and regional Occupancy, ADR and RevPAR from the Bloomberg model (<code>mar-bbg.js</code>); YoY is reported (not constant-currency); latest quarter 2Q26; FY2026 is the Bloomberg (BST) estimate. Worldwide / U.S. &amp; Canada / International growth splits from the 2Q26 release.</div>';
  return h;
}
// ── KPI ▸ Rooms & pipeline — the network.
function roomsByModel(){
  var rows=[
    {h:'Franchised, licensed &amp; other', cells:['1,183,513','66.5%','7,644']},
    {h:'Managed', cells:['565,764','31.8%','1,966']},
    {h:'Residences', cells:['16,253','0.9%','144']},
    {h:'Owned &amp; leased', cells:['14,406','0.8%','51']},
    {h:'Total system', cells:['<b>1,779,936</b>','<b>100%</b>','<b>9,805</b>']},
  ];
  return rsFt(['Rooms','% of system','Hotels'], [false,false,false], rows, 'By model · YE2025');
}
function roomsByRegion(){
  var rows=[
    {h:'U.S. &amp; Canada', cells:['1,084,057','+2.1%']},
    {h:'International', cells:['695,879','+8.0%']},
    {h:'Total system', cells:['<b>1,779,936</b>','<b>+4.3%</b>']},
  ];
  return rsFt(['Rooms','YoY'], [false,false], rows, 'By region · YE2025');
}
function roomsTrend(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(2021), i1=ys.indexOf(2026), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; }), col=function(fn){ return idx.map(fn); };
  var rows=[
    {h:'System rooms', cls:'rs-ft-nb', cells:col(function(i){ return fmtInt(A.rooms[i]); })},
    {h:'YoY', cls:'rs-ft-sub', cells:col(function(i){ return yoyStr(A.rooms[i], A.rooms[i-1]); })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY');
}
function roomsChart(mode){
  var t=_trend(), A=t.A;
  if(mode==='yoy') return lineChart({ labels:t.labels, estFrom:t.estFrom, height:210,
    fmtY:function(v){ return v.toFixed(1)+'%'; }, note:'Net unit growth, year-over-year (from 2022).',
    series:[ { name:'System rooms YoY', short:'YoY', color:SUMMIT_INK, data:t.idx.map(function(i,k){ if(k===0) return null; var p=A.rooms[i-1]; return p==null?null:(A.rooms[i]/p-1)*100; }), fmt:function(v){ return (v>=0?'+':'')+v.toFixed(1)+'%'; } } ] });
  return lineChart({ labels:t.labels, estFrom:t.estFrom, height:210,
    fmtY:function(v){ return (v/1e6).toFixed(2)+'M'; },
    series:[ { name:'System rooms', short:'Rooms', color:SUMMIT_INK, data:t.pick(function(i){ return A.rooms[i]; }), fmt:fmtInt } ] });
}
function kpiRoomsPane(){
  var tiles=[['1.78M','system rooms · YE2025'],['9,805','hotels · 145 countries'],['~629K','pipeline rooms'],['44%','of pipeline under construction']];
  var h='<div class="mar-stats">'+tiles.map(function(c){ return '<div class="mar-stat"><div class="mar-stat-v">'+c[0]+'</div><div class="mar-stat-l">'+c[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Rooms by model</b> &mdash; YE2025.</div>'+roomsByModel();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Rooms by region</b> &mdash; YE2025.</div>'+roomsByRegion();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Total rooms over time</b> &mdash; FY2021&ndash;2026E.</div>'+
    mchWrap('rooms', [['level','Rooms'],['yoy','YoY growth']], roomsChart)+roomsTrend();
  h+='<div class="ave-subh-note" style="margin-top:8px"><b>Pipeline (2Q26):</b> nearly 4,200 properties / ~629,000 rooms, with <b>44%</b> of pipeline rooms under construction (incl. conversions); ~1,757 properties / &gt;279,000 rooms actively under construction. Net rooms grew <b>+4.5%</b> YoY in 2Q26; FY2026 net rooms growth is guided to the <b>low end of 4.5&ndash;5%</b>.</div>';
  h+='<div class="ov-foot">Source &mdash; rooms and locations by model and region from the Bloomberg model (<code>mar-bbg.js</code>), YE2025; pipeline, under-construction and net-rooms-growth figures from the 2Q26 earnings release and FY2026 outlook. Franchised/Licensed &amp; Other includes timeshare (22,912 rooms) and the Ritz-Carlton Yacht Collection (603).</div>';
  return h;
}
// ── KPI ▸ Fees — what Marriott earns off the network, and the RevPAR / non-RevPAR split.
function feeTrend(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(2021), i1=ys.indexOf(2026), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; }), col=function(fn){ return idx.map(fn); };
  var gf=function(i){ return A.baseFee[i]+A.franchiseFee[i]+A.incentiveFee[i]; };
  var rows=[
    {h:'Base management', cells:col(function(i){ return fmtM(A.baseFee[i]); })},
    {h:'Franchise &amp; licence', cells:col(function(i){ return fmtM(A.franchiseFee[i]); })},
    {h:'Incentive management', cells:col(function(i){ return fmtM(A.incentiveFee[i]); })},
    {h:'Gross fee revenue', cls:'rs-ft-nb', cells:col(function(i){ return fmtM(gf(i)); })},
    {h:'Gross fee YoY', cls:'rs-ft-sub', cells:col(function(i){ return yoyStr(gf(i), gf(i-1)); })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY ($M)');
}
function feeCards(){
  return '<div class="mar-fee2">'+
    '<div class="mar-fee" style="border-top-color:'+BRAND+'"><div class="mar-fee-h">RevPAR-related fees</div><div class="mar-fee-s">Rise and fall with room revenue</div>'+
      '<ul class="ov-bullets"><li>Base management fees (% of hotel <b>revenue</b>) and franchise <b>royalties</b> (~4&ndash;7% of room revenue).</li>'+
      '<li><b>Sensitivity:</b> a 1-point change in full-year <b>2026 RevPAR</b> vs 2025 &asymp; <b>$55&ndash;65M</b> of RevPAR-related fees (management guidance).</li></ul></div>'+
    '<div class="mar-fee" style="border-top-color:'+LIC+'"><div class="mar-fee-h">Non-RevPAR-related fees</div><div class="mar-fee-s">Grow faster than RevPAR</div>'+
      '<ul class="ov-bullets"><li><b>Co-branded credit-card fees</b> &mdash; guided ~<b>+35%</b> in 2026 (before the new U.S. deals; JPMorgan Chase &amp; Amex signed, Visa in talks).</li>'+
      '<li><b>Residential branding fees</b> &mdash; guided ~<b>+45&ndash;50%</b> in 2026.</li>'+
      '<li><b>Timeshare license fees</b> (via MVW) &mdash; ~<b>$110&ndash;115M</b> in 2026, roughly flat.</li>'+
      '<li>Application, relicensing and other brand fees.</li>'+
      '<li>Because these grow faster than RevPAR, <b>fees per key keep rising even in a soft-RevPAR year.</b></li></ul></div>'+
    '</div>';
}
function feesChart(mode){
  var t=_trend(), A=t.A;
  var series=[
    { name:'Base management', color:SUMMIT_CAT[0], data:t.pick(function(i){ return A.baseFee[i]; }) },
    { name:'Franchise &amp; licence', color:SUMMIT_CAT[1], data:t.pick(function(i){ return A.franchiseFee[i]; }) },
    { name:'Incentive management', color:SUMMIT_CAT[2], data:t.pick(function(i){ return A.incentiveFee[i]; }) },
  ];
  if(mode==='share'){
    var tot=t.labels.map(function(_,j){ var s=0; series.forEach(function(sr){ s+=sr.data[j]||0; }); return s; });
    var sh=series.map(function(sr){ return { name:sr.name, color:sr.color, data:sr.data.map(function(v,j){ return tot[j]?v/tot[j]*100:0; }) }; });
    return stackedBar({ labels:t.labels, estFrom:t.estFrom, height:250, fmtY:function(v){ return v.toFixed(0)+'%'; }, fmtTotal:function(){ return ''; }, series:sh });
  }
  return stackedBar({ labels:t.labels, estFrom:t.estFrom, height:250, fmtY:function(v){ return '$'+(v/1000).toFixed(1)+'B'; }, fmtTotal:fmtM, series:series });
}
function kpiFeesPane(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 4px"><b>Fee lines over time</b> &mdash; FY2021&ndash;2026E. Gross fees = base + franchise/licence + incentive. Bar total = gross fee revenue; Share shows the mix.</div>'+
    mchWrap('fees', [['level','$ Level'],['share','Share (100%)']], feesChart)+feeTrend();
  h+='<div class="ave-subh-note" style="margin-top:6px">Franchise <b>and</b> licence fees are one reported line. FY2026 gross-fee guidance is $6.03&ndash;6.06B (+11%).</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>Fees vs RevPAR</b> &mdash; Marriott&#39;s own split. This is why fee growth can outrun RevPAR growth.</div>'+feeCards();
  h+='<div class="ov-foot">Source &mdash; fee lines from the Bloomberg model (<code>mar-bbg.js</code>), FY2016&ndash;2030 (FY2026+ are BST estimates). RevPAR-related sensitivity and the non-RevPAR-related fee guidance from Marriott&#39;s FY2026 outlook on the 4Q25/1Q26/2Q26 calls and 2Q26 release.</div>';
  return h;
}
var KPI_SUBTABS=[ ['revpar','RevPAR', kpiRevparPane], ['rooms','Rooms &amp; pipeline', kpiRoomsPane], ['fees','Fees', kpiFeesPane] ];
function kpisBody(){
  var h='<div class="ov-lede" style="margin-top:2px">A hotel&#39;s revenue engine is one identity: <b>RevPAR = Occupancy &times; ADR</b>. The tabs below break Marriott&#39;s operating KPIs into the three that matter: <b>RevPAR</b> (demand), the <b>rooms &amp; pipeline</b> (the network it earns off), and the <b>fees</b> themselves.</div>';
  h+='<div class="ovt-subtabs" style="margin-top:12px">'+KPI_SUBTABS.map(function(s,i){
    return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+s[0]+'">'+s[1]+'</button>'; }).join('')+'</div>';
  KPI_SUBTABS.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s[0]+'"'+(i===0?'':' hidden')+'>'+s[2]()+'</div>'; });
  return h;
}

function segmentsBody(){
  var h='<div class="ov-lede" style="margin-top:2px">Marriott owns almost nothing it operates. Of the system&#39;s ~1.78M rooms, about <b>two-thirds are franchised</b> and <b>one-third managed</b> for third-party owners; Marriott owns or leases <b>under 1%</b>. Read the same ~1.78M-room system two ways &mdash; by <b>ownership model</b> or by <b>geography</b>.</div>';
  h+='<div class="ov-diagram-cap" style="margin:4px 0 6px"><b>System rooms &amp; hotels</b> &mdash; year-end 2025 (1,779,936 rooms · 9,805 hotels). Bars show rooms; the label carries the hotel count.</div>';
  h+='<div class="seg-tog"><button type="button" class="seg-pill active" data-sv="model">By model</button><button type="button" class="seg-pill" data-sv="geo">By geography</button></div>';
  h+='<div class="seg-view" data-sv="model">'+gmmBars(TL_ROOMS)+
    '<div class="ave-subh-note" style="margin-top:6px">Managed + owned/leased = the 2,017 company-operated hotels; franchised/licensed is the rest. See the tabs below for how each model works.</div></div>';
  h+='<div class="seg-view" data-sv="geo" hidden>'+
    '<div class="ov-diagram-cap" style="margin:0 0 8px">Each region split by <b>ownership model</b> &mdash; the mix flips by geography: the U.S. system is <b>~80% franchised</b> by rooms, International is <b>~52% managed</b>. Bars scaled to rooms.</div>'+
    geoStacked()+
    '<div style="margin-top:14px">'+geoMatrix()+'</div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Rooms by region &times; model from the Bloomberg model (<code>mar-bbg.js</code>), YE2025 &mdash; reconciles to the by-model totals and the 1,779,936-room system. Hotels: U.S. &amp; Canada ~6,360, International ~3,347 (+98 timeshare/yacht). Marriott&#39;s reportable segments group these as U.S. &amp; Canada · EMEA · Greater China · APEC.</div>'+
    collapsible('Full geographic footprint — all 6 regions (rooms &amp; hotels)', gmmBars(TL_GEO)+'<div class="ave-subh-note" style="margin-top:6px">Rooms &amp; hotels across the six geographic regions, from the 10-K property tables (Item 2); timeshare &amp; the Ritz-Carlton Yacht Collection sit outside the regional split. This is a different cut from the segment view above (which groups into U.S. &amp; Canada vs International), so regional room totals differ slightly.</div>', false)+
    '</div>';
  h+='<div class="ovt-subtabs" style="margin-top:18px">'+
    '<button type="button" class="ovt-subtab active" data-ovst="owned">Company-owned &amp; leased</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="third">Third-party owned</button></div>';
  h+='<div class="ovt-subpane" data-ovst="owned">'+tlOwnedPane()+'</div>';
  h+='<div class="ovt-subpane" data-ovst="third" hidden>'+tlThirdPane()+'</div>';
  h+='<div class="ov-foot">Sources &mdash; Marriott FY2025 Form 10-K: Item 2 property tables for rooms &amp; hotels by geography; Item 1 (Franchised/Licensed, Company-Operated and Residential tables) for the ownership models and the fee mechanics. Room/hotel counts by model also cross-checked to the Bloomberg model (<code>mar-bbg.js</code>), FY2025. Percentages are of total system rooms.</div>';
  return h;
}
// Top Line sub-tabs. Only "Segments" is built for now; the bar leaves room for more later
// (General · Regions · Pipeline). Each sub-tab is an .ovt-subpane; nested sub-tabs inside them
// (e.g. Segments ▸ Company-owned | Third-party) are wired generically in ddInit.
var TL_SUBTABS=[ ['segments','Segments', segmentsBody], ['kpis','KPI’s', kpisBody] ];
function toplineBody(){
  var h='<div class="ovt-subtabs">'+TL_SUBTABS.map(function(s,i){
    return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+s[0]+'">'+s[1]+'</button>'; }).join('')+'</div>';
  TL_SUBTABS.forEach(function(s,i){
    h+='<div class="ovt-subpane" data-ovst="'+s[0]+'"'+(i===0?'':' hidden')+'>'+s[2]()+'</div>';
  });
  return h;
}

// ═══ Bottom Line — profitability & margins. The whole point for MAR: you cannot read its margin
// off total revenue, because ~73% of that revenue is cost reimbursement billed to owners at ~zero
// margin. Margins here are struck on ECONOMIC revenue (total − cost reimbursement) unless noted.
function blEcon(i){ var A=MAR_BBG.annual; return A.revenue[i]-A.costReimb[i]; }
function blPassThrough(){
  var A=MAR_BBG.annual, i=A.years.indexOf(2025), rev=A.revenue[i], reimb=A.costReimb[i], econ=rev-reimb;
  var wR=reimb/rev*100, wE=econ/rev*100;
  return '<div class="bl-pt"><div class="bl-pt-bar">'+
    '<div class="bl-pt-seg bl-pt-reimb" style="width:'+wR.toFixed(1)+'%">Cost reimbursement · '+fmtM(reimb)+' ('+Math.round(wR)+'%)</div>'+
    '<div class="bl-pt-seg bl-pt-econ" style="width:'+wE.toFixed(1)+'%">Economic · '+fmtM(econ)+'</div>'+
    '</div><div class="ave-subh-note" style="margin-top:6px">Marriott&#39;s reported <b>'+fmtM(rev)+'</b> of FY2025 &ldquo;revenue&rdquo; is <b>'+Math.round(wR)+'% pass-through cost reimbursement</b>, billed to owners at ~zero margin. It earns its margins on the other <b>'+fmtM(econ)+'</b> &mdash; the fee income plus owned/leased revenue. Every margin below is struck on that economic base.</div></div>';
}
function blMarginsChart(){
  var t=_trend(), A=t.A, pct=function(v){ return v.toFixed(1)+'%'; };
  return lineChart({ labels:t.labels, estFrom:t.estFrom, height:238, fmtY:function(v){ return v.toFixed(0)+'%'; },
    note:'Struck on economic revenue (total &minus; cost reimbursement). On total revenue these compress ~4&times; &mdash; an artefact of the reimbursement gross-up, not the business.',
    series:[
      { name:'Adj. EBITDA margin', short:'EBITDA', color:SUMMIT_INK, data:t.pick(function(i){ return A.adjEbitda[i]/blEcon(i)*100; }), fmt:pct },
      { name:'Operating margin', short:'Operating', color:SUMMIT_CAT[0], data:t.pick(function(i){ return A.opIncome[i]/blEcon(i)*100; }), fmt:pct },
      { name:'Net margin (GAAP)', short:'Net', color:SUMMIT_CAT[1], data:t.pick(function(i){ return A.gaapNetIncome[i]/blEcon(i)*100; }), fmt:pct },
    ] });
}
function blCostIntensityChart(){
  var t=_trend(), A=t.A, pct=function(v){ return v.toFixed(1)+'%'; };
  return lineChart({ labels:t.labels, estFrom:t.estFrom, height:220, fmtY:function(v){ return v.toFixed(0)+'%'; },
    series:[
      { name:'G&amp;A', short:'G&amp;A', color:SUMMIT_CAT[0], data:t.pick(function(i){ return A.gna[i]/blEcon(i)*100; }), fmt:pct },
      { name:'Owned, leased &amp; other exp.', short:'Owned', color:SUMMIT_CAT[2], data:t.pick(function(i){ return A.ownedLeasedExp[i]/blEcon(i)*100; }), fmt:pct },
      { name:'Depreciation &amp; amortization', short:'D&amp;A', color:SUMMIT_CAT[1], data:t.pick(function(i){ return A.depAmort[i]/blEcon(i)*100; }), fmt:pct },
    ] });
}
function blMargins(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(2021), i1=ys.indexOf(2026), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; }), col=function(fn){ return idx.map(fn); };
  var pct=function(n,d){ return (n/d*100).toFixed(1)+'%'; };
  var rows=[
    {h:'Economic revenue', cells:col(function(i){ return fmtM(blEcon(i)); })},
    {h:'Adj. EBITDA margin', cls:'rs-ft-nb', cells:col(function(i){ return pct(A.adjEbitda[i], blEcon(i)); })},
    {h:'Operating margin', cls:'rs-ft-sub', cells:col(function(i){ return pct(A.opIncome[i], blEcon(i)); })},
    {h:'Net margin (GAAP)', cells:col(function(i){ return pct(A.gaapNetIncome[i], blEcon(i)); })},
    {h:'Effective tax rate', cells:col(function(i){ return A.taxRate[i].toFixed(1)+'%'; })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY · on economic revenue');
}
function blWalk(){
  var A=MAR_BBG.annual, i=A.years.indexOf(2025);
  var rev=A.revenue[i], opInc=A.opIncome[i], ni=A.gaapNetIncome[i], intr=A.netInterest[i], tr=A.taxRate[i];
  var econ=blEcon(i), totOpex=rev-opInc, pretax=ni/(1-tr/100), tax=pretax-ni, other=pretax-(opInc-intr);
  var neg=function(v){ return '('+fmtM(v)+')'; };
  var rows=[
    {h:'Total revenue', cells:[fmtM(rev)]},
    {h:'&minus; Total operating expenses', cls:'rs-ft-sub', cells:['<span class="rs-ft-dim">'+neg(totOpex)+'</span>']},
    {h:'= Operating income', cells:['<b>'+fmtM(opInc)+'</b> · '+(opInc/econ*100).toFixed(0)+'% of econ. rev']},
    {h:'&minus; Net interest expense', cls:'rs-ft-sub', cells:['<span class="rs-ft-dim">'+neg(intr)+'</span>']},
    {h:'+ Gains, equity &amp; other', cls:'rs-ft-sub', cells:['<span class="rs-ft-dim">'+fmtM(other)+'</span>']},
    {h:'= Pre-tax income', cells:['<b>'+fmtM(pretax)+'</b>']},
    {h:'&minus; Income tax · '+tr.toFixed(1)+'%', cls:'rs-ft-sub', cells:['<span class="rs-ft-dim">'+neg(tax)+'</span>']},
    {h:'= Net income (GAAP)', cells:['<b>'+fmtM(ni)+'</b> · '+(ni/econ*100).toFixed(0)+'% of econ. rev']},
  ];
  return rsFt([''], [false], rows, 'FY2025');
}
function blOpex(){
  var A=MAR_BBG.annual, i=A.years.indexOf(2025), tot=A.revenue[i]-A.opIncome[i];
  var L=[ ['Reimbursed expenses (pass-through)', A.reimbExp[i], '#9AA4B0'], ['Owned, leased &amp; other', A.ownedLeasedExp[i], BRAND], ['General &amp; administrative', A.gna[i], BRAND2], ['Depreciation &amp; amortization', A.depAmort[i], '#C98A97'] ];
  return '<div class="ov-mbars">'+L.map(function(r){ var w=r[1]/tot*100;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+r[0]+'</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(w,1.2)+'%;background:'+r[2]+'">'+(w>12?fmtM(r[1]):'')+'</div></div><div class="ov-mbar-v">'+(w<=12?'<span style="color:var(--mu);font-weight:700">'+fmtM(r[1])+'</span> &middot; ':'')+Math.round(w)+'%</div></div>';
  }).join('')+'</div><div class="ave-subh-note" style="margin-top:6px"><b>'+Math.round(A.reimbExp[i]/tot*100)+'% of operating expense is the pass-through reimbursement.</b> The costs Marriott actually manages down are G&amp;A ('+fmtM(A.gna[i])+') and the owned/leased hotels &mdash; which is why it is judged on fee growth and G&amp;A discipline, not cost of goods.</div>';
}
function blCostIntensity(){
  var A=MAR_BBG.annual, ys=A.years, ph=A.phase, i0=ys.indexOf(2021), i1=ys.indexOf(2026), idx=[];
  for(var i=i0;i<=i1;i++) idx.push(i);
  var est=idx.map(function(i){ return ph[i]==='E'; }), col=function(fn){ return idx.map(fn); };
  var pct=function(n,i){ return (n/blEcon(i)*100).toFixed(1)+'%'; };
  var rows=[
    {h:'G&amp;A', cells:col(function(i){ return pct(A.gna[i], i); })},
    {h:'Depreciation &amp; amortization', cells:col(function(i){ return pct(A.depAmort[i], i); })},
    {h:'Owned, leased &amp; other exp.', cells:col(function(i){ return pct(A.ownedLeasedExp[i], i); })},
  ];
  return rsFt(col(function(i){ return ys[i]; }), est, rows, 'FY · % of economic revenue');
}
function blMarginsPane(){
  var A=MAR_BBG.annual, i=A.years.indexOf(2025), econ=blEcon(i);
  var tiles=[[fmtM(A.revenue[i]),'reported revenue · FY2025'],[fmtM(econ),'economic revenue (the margin base)'],[(A.adjEbitda[i]/econ*100).toFixed(0)+'%','adj. EBITDA margin'],[(A.gaapNetIncome[i]/econ*100).toFixed(0)+'%','net margin']];
  var h='<div class="ov-lede" style="margin-top:2px">Marriott is highly profitable, but you cannot see it in a margin on total revenue. Nearly three-quarters of the reported top line is <b>cost reimbursement</b> &mdash; costs it runs for hotel owners and bills straight back at ~zero margin. Strip that out and the real, asset-light economics appear.</div>';
  h+='<div class="mar-stats">'+tiles.map(function(c){ return '<div class="mar-stat"><div class="mar-stat-v">'+c[0]+'</div><div class="mar-stat-l">'+c[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The pass-through</b> &mdash; why the reported top line misleads (FY2025).</div>'+blPassThrough();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Margins over time</b> &mdash; on economic revenue, FY2021&ndash;2026E.</div>'+blMarginsChart()+blMargins();
  h+='<div class="ave-subh-note" style="margin-top:6px">On <b>total</b> revenue these compress ~4x (FY2025 operating margin ~16%, net ~10%) &mdash; an artefact of the reimbursement gross-up, not the business. The adjusted EBITDA margin near <b>77%</b> is the asset-light fee model.</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>From revenue to net income</b> &mdash; FY2025.</div>'+blWalk();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Where the operating costs go</b> &mdash; FY2025 operating expense, '+fmtM(A.revenue[i]-A.opIncome[i])+' total.</div>'+blOpex();
  h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>Cost intensity over time</b> &mdash; the lines Marriott controls, as % of economic revenue.</div>'+blCostIntensityChart()+blCostIntensity();
  h+='<div class="ave-subh-note" style="margin-top:6px">G&amp;A leverage is the story: it has fallen from ~'+(A.gna[A.years.indexOf(2023)]/blEcon(A.years.indexOf(2023))*100).toFixed(0)+'% of economic revenue toward ~'+(A.gna[i]/econ*100).toFixed(0)+'%, helped by the 2025 above-property efficiency program.</div>';
  h+='<div class="ov-foot">Source &mdash; income-statement lines (revenue, cost reimbursement, operating expense detail, operating income, interest, tax) from the Bloomberg model (<code>mar-bbg.js</code>), FY2016&ndash;2030 (FY2026+ are BST estimates). &ldquo;Economic revenue&rdquo; = total revenue &minus; cost reimbursement. Margins and the P&amp;L walk are computed from the reported dollar lines; the walk ties to reported operating income and net income.</div>';
  return h;
}
// Bottom Line ▸ Non-RevPAR economics — the streams that don't move with RevPAR: the Bonvoy loyalty
// program, co-branded credit cards, residential branding, timeshare licensing and the new media
// network. Near-pure-margin, recurring, faster-growing and less cyclical than room-fee income.
function blNonRevparPane(){
  var tiles=[['295M+','Bonvoy members · Jun 2026'],['69%','of global room nights are members'],['~26%','royalty Marriott takes on card funding'],['+~35%','co-branded card fees · 2026E']];
  var h='<div class="ov-lede" style="margin-top:2px">Marriott&#39;s most valuable earnings barely touch RevPAR. It rents its brand and its <b>295M-member</b> loyalty base to third parties &mdash; card issuers, developers, a timeshare operator, advertisers &mdash; for fees that are near-pure-margin, recurring and far less cyclical than room income. This is why fees per key keep rising even when RevPAR is flat.</div>';
  h+='<div class="mar-stats">'+tiles.map(function(c){ return '<div class="mar-stat"><div class="mar-stat-v">'+c[0]+'</div><div class="mar-stat-l">'+c[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The Bonvoy flywheel</b> &mdash; scale &rarr; direct demand &rarr; data &rarr; card economics.</div>';
  h+=tlFlow(['295M members','Direct bookings (skip OTA fees)','Card spend + first-party data','Marriott sells Bonvoy points to issuers','~26% royalty + breakage'], BRAND);
  // The two big engines.
  h+='<div class="ov-diagram-cap" style="margin:18px 0 6px"><b>The two engines</b></div>';
  h+='<div class="mar-fee" style="border-top-color:'+BRAND2+';margin-bottom:12px"><div class="mar-fee-h">Marriott Bonvoy &mdash; the demand &amp; data machine</div><div class="mar-fee-s">295M+ members · 69% of global / 74% of U.S. room nights (record, 2Q26)</div>'+
    '<ul class="ov-bullets"><li>Members grew <b>~19% YoY</b> (248M Jun-2025 &rarr; 295M+ Jun-2026). Every enrolled guest who books direct <b>skips the 15&ndash;25% OTA commission</b> and hands Marriott first-party data.</li>'+
    '<li>Points are a <b>deferred-revenue engine</b>: points sold (mostly to card issuers) sit as a <b>guest-loyalty liability (~$3.5B, 2025)</b> and only become revenue when redeemed &mdash; or <b>expire (breakage), which is near-pure margin</b>.</li>'+
    '<li>New in 2025: the <b>Marriott Media Network</b> &mdash; retail-media/ads built on Bonvoy data, the app and in-room TVs; management frames it as a potential card-scale profit stream at maturity.</li></ul></div>';
  h+='<div class="mar-fee" style="border-top-color:'+BRAND+'"><div class="mar-fee-h">Co-branded credit cards &mdash; the highest-return adjacency</div><div class="mar-fee-s">37 cards in 13 countries · JPMorgan Chase &amp; American Express (new U.S. deals 2026); Visa in talks</div>'+
    '<ul class="ov-bullets"><li><b>How it works:</b> issuers pay Marriott &ldquo;credit-card funding&rdquo; to buy Bonvoy points for cardholders. Marriott takes a <b>~26% royalty</b> on that funding for licensing its brand &amp; Bonvoy IP &mdash; booked <b>inside the Franchise fees line</b>.</li>'+
    '<li><b>The kicker:</b> Marriott earns on <b>all</b> cardholder spend &mdash; gas, groceries, everything &mdash; not just hotel stays. A &ldquo;significant funding source.&rdquo;</li>'+
    '<li><b>The build:</b> card fees rose <b>+37%</b> in 1Q26 and are guided to the <b>high-30%s</b> for FY2026. The new U.S. deals add ~<b>$30M</b> in 2026, building to <b>$100&ndash;125M by FY2028</b> at the current 26% royalty.</li></ul></div>';
  // Smaller brand-rent streams.
  h+='<div class="ov-diagram-cap" style="margin:18px 0 6px"><b>The other brand-rent streams</b></div>';
  h+='<div class="mar-fee3">'+
    '<div class="mar-fee" style="border-top-color:'+LIC+'"><div class="mar-fee-h">Residential branding</div><div class="mar-fee-s">One-time fees per unit</div><div class="famd">Developers pay a branding fee on each branded residence sold. <b>Lumpy</b> &mdash; it swings with the timing of unit closings; guided <b>+55&ndash;65%</b> in FY2026.</div></div>'+
    '<div class="mar-fee" style="border-top-color:'+LIC+'"><div class="mar-fee-h">Timeshare license</div><div class="mar-fee-s">Via Marriott Vacations Worldwide</div><div class="famd">A <b>fixed annual fee</b> (inflation-indexed) plus variable fees on MVW&#39;s sales volumes. Steady at <b>~$110&ndash;115M</b> in FY2026.</div></div>'+
    '<div class="mar-fee" style="border-top-color:'+LIC+'"><div class="mar-fee-h">Marriott Media Network</div><div class="mar-fee-s">Launched 2025 · retail media</div><div class="famd">Ads monetizing Bonvoy&#39;s data, the app and in-room TVs. Early-stage; the upside case is a <b>new high-margin, RevPAR-independent</b> profit line.</div></div>'+
    '</div>';
  // Quotes for authority.
  h+='<div class="mar-quote" style="margin-top:18px">&ldquo;Co-branded credit cards &hellip; a very high-return adjacency that &hellip; extends beyond just earning on travel expenses but on the ability for people to be buying gas, and we ultimately earn brand fees.&rdquo;<cite>Marriott management &mdash; Q2 2025 earnings call</cite></div>';
  h+='<div class="mar-quote">&ldquo;By full-year 2028, the impact on Marriott&#39;s co-brand card fees from these new deals could be somewhere between $100 million and $125 million at our current royalty rate of 26%.&rdquo;<cite>CFO &mdash; Q2 2026 earnings call</cite></div>';
  h+='<div class="ov-foot">Sources &mdash; Marriott FY2025 10-K, Item 1 (&ldquo;Loyalty and Credit Card Programs&rdquo;); the FY2026 outlook and prepared remarks on the 1Q25&ndash;2Q26 earnings calls (member counts and penetration, the ~26% card royalty and $30M&rarr;$100&ndash;125M build, residential/timeshare guidance, the Media Network); the guest-loyalty liability (~$3.5B, 2025) from the Bloomberg model (<code>mar-bbg.js</code>). Member counts are as reported on each quarter&#39;s call.</div>';
  return h;
}
var BL_SUBTABS=[ ['nonrevpar','Non-RevPAR economics', blNonRevparPane], ['margins','Margins', blMarginsPane] ];
function bottomlineBody(){
  var h='<div class="ovt-subtabs" style="margin-top:2px">'+BL_SUBTABS.map(function(s,i){
    return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+s[0]+'">'+s[1]+'</button>'; }).join('')+'</div>';
  BL_SUBTABS.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s[0]+'"'+(i===0?'':' hidden')+'>'+s[2]()+'</div>'; });
  return h;
}

function ddStyle(){
  return '<style>.ov-mar-dd .dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 16px;border-bottom:1px solid var(--bdr)}'+
    '.ov-mar-dd .dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.ov-mar-dd .dd-tab:hover{color:var(--navy)}.ov-mar-dd .dd-tab.active{color:'+BRAND2+';border-bottom-color:'+BRAND+'}'+
    '.ov-mar-dd .dd-pane[hidden]{display:none}'+
    '.mar-pend{border:1px dashed var(--bdr);border-radius:12px;padding:18px 20px;background:var(--w)}'+
    '.mar-pend-h{font-size:14px;font-weight:800;color:var(--navy);margin-bottom:4px}'+
    '.mar-pend-s{font-size:11.5px;color:var(--mu);line-height:1.55;margin-bottom:14px}'+
    '.mar-pend-c{display:grid;grid-template-columns:1fr 1fr;gap:16px}'+
    '@media(max-width:640px){.mar-pend-c{grid-template-columns:1fr}}'+
    '.mar-pend-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}'+
    '.mar-pend-have .mar-pend-k{color:#1E9E62}.mar-pend-need .mar-pend-k{color:var(--mu)}'+
    '.mar-pend ul{list-style:none;padding:0;margin:0}'+
    '.mar-pend li{font-size:11.5px;color:var(--navy);line-height:1.5;padding:3px 0 3px 14px;position:relative}'+
    '.mar-pend li:before{content:"";position:absolute;left:0;top:9px;width:5px;height:5px;border-radius:50%;background:var(--bdr)}'+
    '.mar-pend-have li:before{background:#1E9E62}'+
    '.mar-pend code,.ave-subh-note code,.ov-foot code{font-size:10.5px;background:#F2F4F7;border-radius:4px;padding:1px 4px}'+
    // Inline-SVG charts (lineChart / stackedBar)
    '.mchart{margin:4px 0 6px}'+
    '.mchart svg text{font-variant-numeric:tabular-nums}'+
    '.mchart svg circle,.mchart svg rect{cursor:default}'+
    '.mchart-leg{display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:center;margin:6px 0 0}'+
    '.mchart-leg-i{display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:var(--mu)}'+
    '.mchart-leg-i i{width:11px;height:11px;border-radius:3px;margin-right:6px}'+
    '.mchart-note{font-size:10px;color:var(--mu);line-height:1.5;margin:6px 0 0;text-align:center}'+
    // Evolution metric picker
    '.evo-pick{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 6px}'+
    '.evo-pill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:700;color:var(--mu);padding:5px 12px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}'+
    '.evo-pill:hover{color:var(--navy);border-color:var(--mu)}'+
    '.evo-pill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.evo-cv[hidden]{display:none}'+
    '.evo-modes{margin-top:10px}'+
    // Reading-mode toggle (Level · YoY · Share …)
    '.mch-wrap{margin:2px 0}'+
    '.mch-modes{display:flex;flex-wrap:wrap;gap:4px;margin:2px 0 6px}'+
    '.mch-mode{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:4px 11px;border-radius:999px;cursor:pointer}'+
    '.mch-mode:hover{color:var(--navy);border-color:var(--mu)}'+
    '.mch-mode.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.mch-mode-dis,.mch-mode-dis:hover{opacity:.4;cursor:not-allowed;color:var(--mu);border-color:var(--bdr)}'+
    // Top Line ▸ Segments components
    '.seg-tog{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin:2px 0 10px}'+
    '.seg-pill{border:none;background:transparent;font:inherit;font-size:11px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s}'+
    '.seg-pill:hover{color:var(--navy)}.seg-pill.active{background:var(--navy);color:#fff}'+
    '.seg-view[hidden]{display:none}'+
    // Geography × model stacked bars
    '.seg-sb{margin:2px 0 4px}'+
    '.seg-sb-row{display:flex;align-items:center;gap:12px;margin-bottom:10px}'+
    '.seg-sb-l{width:120px;flex:none;text-align:right;font-size:12px;font-weight:700;color:var(--navy);line-height:1.25}'+
    '.seg-sb-sub{display:block;font-size:10px;font-weight:600;color:var(--mu)}'+
    '.seg-sb-track{flex:1;height:30px;display:flex;border-radius:6px;overflow:hidden;background:var(--surface)}'+
    '.seg-sb-seg{height:100%}'+
    '.seg-sb-gap{background:transparent}'+
    '.seg-sb-v{width:52px;flex:none;text-align:right;font-size:12px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.seg-leg{display:flex;flex-wrap:wrap;gap:8px 16px;margin:2px 0 2px;padding-left:132px}'+
    '.seg-leg-i{display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:var(--mu)}'+
    '.seg-leg-i i{width:11px;height:11px;border-radius:3px;margin-right:6px}'+
    '@media(max-width:600px){.seg-leg{padding-left:0}.seg-sb-l{width:88px}}'+
    '.mar-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0 2px}'+
    '@media(max-width:640px){.mar-stats{grid-template-columns:repeat(2,1fr)}}'+
    '.mar-stat{border:1px solid var(--bdr);border-top:2px solid '+BRAND2+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.mar-stat-v{font-size:18px;font-weight:800;color:var(--navy);letter-spacing:-.02em;line-height:1.1}'+
    '.mar-stat-l{font-size:10.5px;color:var(--mu);line-height:1.35;margin-top:4px}'+
    '.mar-flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:4px 0 2px;padding:11px 13px;border:1px solid var(--bdr);border-radius:10px;background:var(--surface)}'+
    '.mar-flow-n{font-size:11.5px;font-weight:700;color:var(--navy);background:var(--w);border:1px solid var(--bdr);border-radius:16px;padding:5px 12px}'+
    '.mar-flow-a{font-size:16px;font-weight:800}'+
    '.mar-mdl2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:2px 0 14px}'+
    '@media(max-width:760px){.mar-mdl2{grid-template-columns:1fr}}'+
    '.mar-mdl{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;background:var(--w)}'+
    '.mar-mdl-h{border-top:3px solid var(--bdr);padding:12px 14px 10px}'+
    '.mar-mdl-t{font-size:15px;font-weight:800;color:var(--navy)}'+
    '.mar-mdl-s{font-size:11px;color:var(--mu);margin-top:2px}'+
    '.mar-mdl .mar-flow{margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0;background:var(--w)}'+
    '.mar-cmp{border:1px solid var(--bdr);border-radius:11px;overflow:hidden;margin-top:2px}'+
    '.mar-cmp-row{display:grid;grid-template-columns:0.95fr 1.15fr 1.15fr 1.35fr;border-bottom:1px solid var(--bdr)}'+
    '.mar-cmp-row:last-child{border-bottom:none}'+
    '.mar-cmp-row>div{padding:10px 13px;font-size:11.5px;color:var(--navy);line-height:1.5;border-right:1px solid var(--bdr)}'+
    '.mar-cmp-row>div:last-child{border-right:none}'+
    '.mar-cmp-row>div:first-child{color:var(--mu);font-weight:700;background:var(--surface)}'+
    '.mar-cmp-head>div{font-size:12px;font-weight:800;background:var(--surface)}'+
    '.mar-cmp-d{font-size:11px}'+
    '@media(max-width:640px){.mar-cmp-row{grid-template-columns:1fr}.mar-cmp-row>div{border-right:none;border-bottom:1px solid var(--bdr)}.mar-cmp-row>div:last-child{border-bottom:none}.mar-cmp-head{display:none}}'+
    // Bottom Line: pass-through bar
    '.bl-pt{margin:2px 0 2px}'+
    '.bl-pt-bar{display:flex;height:44px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr)}'+
    '.bl-pt-seg{height:100%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;text-align:center;padding:0 8px;line-height:1.25}'+
    '.bl-pt-reimb{background:#9AA4B0}.bl-pt-econ{background:'+BRAND+'}'+
    '@media(max-width:600px){.bl-pt-seg{font-size:9.5px}}'+
    // KPIs sub-tab: RevPAR/non-RevPAR fee cards
    '.mar-fee2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:2px 0 4px}'+
    '@media(max-width:640px){.mar-fee2{grid-template-columns:1fr}}'+
    '.mar-fee{border:1px solid var(--bdr);border-top:3px solid var(--bdr);border-radius:11px;padding:14px 16px;background:var(--w)}'+
    '.mar-fee-h{font-size:14px;font-weight:800;color:var(--navy)}'+
    '.mar-fee-s{font-size:11px;color:var(--mu);margin:2px 0 8px}'+
    '.mar-fee .ov-bullets li{font-size:11.5px}'+
    '.mar-fee3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}'+
    '@media(max-width:760px){.mar-fee3{grid-template-columns:1fr}}'+
    '.mar-quote{font-size:12.5px;font-style:italic;color:var(--blue,#2A3646);line-height:1.6;border-left:3px solid '+BRAND+';padding:4px 0 4px 14px;margin:0 0 10px}'+
    '.mar-quote cite{display:block;font-style:normal;font-size:11px;font-weight:700;color:var(--mu);margin-top:5px}'+
    '</style>';
}
function ddHtml(c){
  var h='<div class="ov ov-mar ov-mar-dd" data-brand="MAR" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(167,0,33,0.08)">';
  h+=ddStyle();
  h+='<div class="dd-tabs">'+DD_SECTIONS.map(function(s,i){ return '<button type="button" class="dd-tab'+(i===0?' active':'')+'" data-dd="'+s[0]+'">'+s[1]+'</button>'; }).join('')+'</div>';
  DD_SECTIONS.forEach(function(s,i){
    var body=(s[0]==='topline')?toplineBody():(s[0]==='bottomline')?bottomlineBody():(s[0]==='evolution')?evolutionBody():pendingBody(s[0]);
    h+='<div class="dd-pane" data-dd="'+s[0]+'"'+(i===0?'':' hidden')+'>'+body+'</div>';
  });
  h+='</div>';
  return h;
}
function ddInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  var dd=root.querySelector('.ov-mar-dd'); if(!dd) return;
  // Collapsibles inside the deep dive (e.g. KPIs ▸ trend / regions). onclick overwrites, so this is
  // safe even if the Overview's wireCommon also reached them through the shared #co-detailview root.
  dd.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.innerHTML=open?'&#9662;':'&#9656;'; }; });
  dd.querySelectorAll(':scope > .dd-tabs > .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var k=btn.getAttribute('data-dd');
    dd.querySelectorAll(':scope > .dd-tabs > .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    dd.querySelectorAll(':scope > .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==k); });
  }; });
  // Segments ▸ By model / By geography toggle (isolated from the Overview money-map's data-gmm,
  // which is wired root-scoped in wireCommon). Each .seg-tog toggles the .seg-view siblings in its
  // own parent container.
  dd.querySelectorAll('.seg-tog').forEach(function(tog){
    var container=tog.parentElement; if(!container) return;
    var pills=tog.querySelectorAll(':scope > .seg-pill');
    pills.forEach(function(btn){ btn.onclick=function(){
      var v=btn.getAttribute('data-sv');
      pills.forEach(function(b){ b.classList.toggle('active', b===btn); });
      container.querySelectorAll(':scope > .seg-view').forEach(function(p){ p.hidden=(p.getAttribute('data-sv')!==v); });
    }; });
  });
  // Reading-mode toggles (Level · YoY · Share …) — each .mch-wrap re-renders its own .mch-body via
  // the MCH registry. Evolution's mode bar is handled separately below (it also varies by metric).
  dd.querySelectorAll('.mch-wrap').forEach(function(wrap){
    var id=wrap.getAttribute('data-mch');
    var bar=wrap.querySelector(':scope > .mch-modes'), body=wrap.querySelector(':scope > .mch-body');
    if(!bar||!body) return;
    bar.querySelectorAll(':scope > .mch-mode').forEach(function(btn){ btn.onclick=function(){
      bar.querySelectorAll(':scope > .mch-mode').forEach(function(b){ b.classList.toggle('active', b===btn); });
      if(MCH[id]) body.innerHTML=MCH[id](btn.getAttribute('data-mode'));
    }; });
  });
  // Evolution: metric picker × reading-mode. "% of revenue" is disabled for metrics that have no
  // common-size (EPS/RevPAR/Rooms); picking one falls back to Level.
  dd.querySelectorAll('.evo-wrap').forEach(function(wrap){
    var modes=wrap.querySelector(':scope > .evo-modes'), pick=wrap.querySelector(':scope > .evo-pick'), body=wrap.querySelector(':scope > .evo-body');
    if(!modes||!pick||!body) return;
    function act(bar,attr){ var el=bar.querySelector('.active'); return el?el.getAttribute(attr):null; }
    function refresh(){
      var m=evoMetric(act(pick,'data-evo')||'rev'), md=act(modes,'data-mode')||'level';
      if(md==='share' && !m.share) md='level';
      modes.querySelectorAll(':scope > .mch-mode').forEach(function(b){
        var k=b.getAttribute('data-mode'), dis=(k==='share' && !m.share);
        b.disabled=dis; b.classList.toggle('mch-mode-dis', dis); b.classList.toggle('active', k===md);
      });
      body.innerHTML=evoChart(m, md);
    }
    pick.querySelectorAll(':scope > .evo-pill').forEach(function(btn){ btn.onclick=function(){
      pick.querySelectorAll(':scope > .evo-pill').forEach(function(b){ b.classList.toggle('active', b===btn); }); refresh();
    }; });
    modes.querySelectorAll(':scope > .mch-mode').forEach(function(btn){ btn.onclick=function(){
      if(btn.disabled) return;
      modes.querySelectorAll(':scope > .mch-mode').forEach(function(b){ b.classList.toggle('active', b===btn); }); refresh();
    }; });
  });
  // Sub-tabs, at any nesting depth (e.g. Top Line ▸ Segments ▸ Company-owned | Third-party).
  // Each .ovt-subtabs bar toggles only the .ovt-subpane siblings in its OWN parent container,
  // so a nested bar never drives an outer one.
  dd.querySelectorAll('.ovt-subtabs').forEach(function(bar){
    var container=bar.parentElement; if(!container) return;
    var subtabs=bar.querySelectorAll(':scope > .ovt-subtab');
    subtabs.forEach(function(btn){ btn.onclick=function(){
      var k=btn.getAttribute('data-ovst');
      subtabs.forEach(function(b){ b.classList.toggle('active', b===btn); });
      container.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==k); });
    }; });
  });
}

export var marOverview = { html: html, init: init, deepDive: { html: ddHtml, init: ddInit } };
