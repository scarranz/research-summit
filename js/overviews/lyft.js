// overviews/lyft.js — custom Overview for Lyft, Inc. (NASDAQ: LYFT)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series are sourced from the Summit DCF model (snapshot 2026-05-13):
//   • annual / quarterly ACTUALS  → actuals_history sheet
//   • model ESTIMATES (back-test) → projection_history sheet
// Qualitative content is from Lyft IR / SEC filings / earnings calls (see SOURCES).
// No live API calls — every figure is baked from the model snapshot + cited filings.

import { makeValuation } from './valuation.js';
import { makeManagement } from './management.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { lyftResults } from '../results-data/lyft.js';
import { mountWatchList } from '../watchlist.js';

// Interactive "Scenario → price target" calculator (Valuation tab). Fundamentals from
// the Summit DCF (FY2025 actuals; FY2026E estimate). Net cash & price are editable
// (Summit model carries no balance sheet/quote); defaults reproduce the DCF FY2026E.
var LYFT_VAL = makeValuation({
  brand:'#EA0B8C', sharesM:417.659,
  netCashDefaultM:900, netCashNote:'Q1 2026: cash + short-term investments ≈ $1.72B − ~$0.8B convertible notes ≈ +$0.9B net cash.',
  priceDefault:14.70, priceAsOf:'~Jul 2026', priceHint:"≈$14.7 (Jul 2026). Editable — verify live.",
  volLabel:'Gross Bookings',
  segments:[
    { key:'rides', label:'Rideshare', gb2025M:18507.1, take2025Pct:34.13, growthDefaultPct:17,
      hint:{ take:"'22 34.0% · '23 32.0% · '24 35.9% · '25 34.1%", growth:"'23 +14% · '24 +17% · '25 +15%", guide:"Lyft guides Gross Bookings + Adj. EBITDA each quarter." } },
  ],
  marginBasePct:8.37, marginDefaultPct:9.37,
  marginHint:"History: '22 −10.2% · '23 5.0% · '24 6.6% · '25 8.4%. Lyft guides an Adj. EBITDA $ range each quarter.",
  dcf:{ fy:'FY2026E', revM:7372.7, ebitdaM:691.1 },
  mult:{ evebitda:{min:4,max:16,def:7.6}, marginMin:4, marginMax:16 },
});

// Management roster (Management tab). Public-source bios; no ownership/trades.
var LYFT_MGMT = makeManagement({
  brand:'#EA0B8C',
  lede:"Lyft runs a lean-but-real leadership team under CEO <b>David Risher</b>, who took over in 2023 and refocused the company on profitable growth. Its IR page publishes only the three named executive officers, but the operating bench is deeper. The founder era formally ended in <b>August 2025</b>: Logan Green and John Zimmer left the board and their super-voting shares collapsed to one-share-one-vote.",
  execs:[
    { id:'risher', lead:true, name:'David Risher', title:'Chief Executive Officer', since:'CEO since 2023', img:'img/leadership/lyft-risher.jpg',
      line:"Turnaround CEO; ex-Amazon SVP US Retail; founded Worldreader.",
      bio:"Chief Executive Officer and director since April 2023; on the board since 2021. Co-founded and led the nonprofit Worldreader. Prior: SVP US Retail at Amazon and GM at Microsoft. Princeton; Harvard MBA. Took a single large performance-RSU grant in 2023 and $0 new equity since; has pledged his bonus to charity." },
    { id:'brewer', name:'Erin Brewer', title:'Chief Financial Officer', since:'CFO since 2023', img:'img/leadership/lyft-brewer.jpg',
      line:"Ex-Charles Schwab, Atlassian and McKesson.",
      bio:"Chief Financial Officer since July 2023. Prior: MD of Enterprise Finance at Charles Schwab; Head of Strategy & Finance at Atlassian; senior finance roles at McKesson. Purdue; Berkeley Haas MBA." },
    { id:'llewellyn', name:'Lindsay Llewellyn', title:'Chief Legal & Business Officer', since:'In role since 2024 · at Lyft since 2014', img:'img/leadership/lyft-llewellyn.jpg',
      line:"11-year Lyft veteran; GC with expanded business scope.",
      bio:"Chief Legal & Business Officer and Corporate Secretary since July 2024; at Lyft since 2014, rising from litigation counsel to General Counsel. Scope expanded to include business and People functions after the President role was folded in. Prior: Winston & Strawn." },
    { id:'rasmussen', name:'Dana Rasmussen', title:'Chief People Officer', since:'CPO since 2025', img:'img/leadership/lyft-rasmussen.jpg',
      line:"Ex-Chief People Officer of Stitch Fix.",
      bio:"Chief People Officer since July 2025. Prior: Chief People & Culture Officer at Stitch Fix; HR leadership at Honor, Flywheel, Yahoo and Oracle." },
    { id:'golden', name:'Jerry Golden', title:'Chief Policy Officer', since:'Since 2024', img:'img/leadership/lyft-golden.jpg',
      line:"Runs policy; ex-Eventbrite, Internet Association.",
      bio:"Chief Policy Officer since August 2024. Prior: policy leadership at Eventbrite, the Internet Association, Vanguard and the U.S. Chamber of Commerce. Based in Washington, D.C." },
    { id:'smith', name:'Kevin S. Smith', title:'Chief Information Officer', since:'Since ~2023', img:'img/leadership/lyft-smith.jpg',
      line:"Top tech exec (CIO); ex-CIO of Cloudera.",
      bio:"Chief Information Officer (Lyft's top technology executive; there is currently no C-level CTO). 30+ years in IT; previously CIO at Cloudera and senior IT roles at Aurora, Stripe and Twitch." },
    { id:'bird', name:'Jeremy Bird', title:'EVP, Global Growth', since:'Long-tenured', img:'img/leadership/lyft-bird.jpg',
      line:"Leads global growth; ran the 2026 London launch; ex-Obama field director.",
      bio:"EVP, Global Growth; a long-tenured leader who previously served as Chief Policy Officer and led Driver Experience. Drove Lyft's April 2026 London black-cab (international) launch. Former national field director for the Obama 2012 campaign." },
    { id:'kelman', name:'Jody Kelman', title:'Head of Lyft Autonomous', since:'Long-tenured',
      line:"Leads Lyft Autonomous — the AV push.",
      bio:"Leads Lyft Autonomous, the company's autonomous-vehicle strategy — central to the 2026 robotaxi push (May Mobility, Mobileye, Baidu partnerships). Previously led Lyft's rider/customer product organization." },
    { id:'patil', name:'Siddharth Patil', title:'EVP, Data Science', since:'Long-tenured', img:'img/leadership/lyft-patil.jpg',
      line:"Leads data science & marketplace efficiency.",
      bio:"EVP, Data Science; a long-tenured technical leader overseeing data science and marketplace efficiency (matching, pricing, incentives)." },
  ],
  board:[
    { name:'Sean Aggarwal', chair:true, independent:true, role:'Independent Chair · Co-Founder & Chairman of Borderless AI · chairs Nominating & Governance.' },
    { name:'David Risher', dual:true, independent:false, role:'Chief Executive Officer.' },
    { name:'Dave Stephenson', independent:true, role:'Chief Business Officer, Airbnb · chairs Audit.' },
    { name:'David Lawee', independent:true, role:'Co-Founder of Crucible Labs; ex-Google (CapitalG) · chairs Compensation.' },
    { name:'Janey Whiteside', independent:true, role:'Chief Growth Officer, Consello · Compensation, Nom & Gov.' },
    { name:'Jill Beggs', independent:true, role:'EVP & CEO of Reinsurance, Everest Group · Audit.' },
    { name:'Betsey Stevenson', independent:true, role:'Economist, University of Michigan (ex-CEA) · Audit, Nom & Gov.' },
    { name:'Deborah Hersman', independent:true, role:'Ex-Chief Safety Officer at Waymo; former NTSB Chair · Nom & Gov.' },
  ],
  boardNote:'7 of 8 independent; independent Chair separate from the CEO.',
  gov:[
    { k:'Share & voting', v:'1 vote / share', d:'Dual-class collapsed Aug 2025; founders’ vote 30% → <2%.' },
    { k:'Board', v:'7 of 8 independent', d:'Independent chair · classified board.' },
    { k:'CEO pay · FY25', v:'$2.8M · $0 new equity', d:'One 2023 performance-RSU; ~18:1 ratio.' },
  ],
  foot:"The three statutory officers (Risher, Brewer, Llewellyn) are from Lyft’s 2026 proxy; the wider operating team is from Lyft’s newsroom and public sources (role confidence varies below the C-suite). Board, committees and governance per the 2026 proxy. Headshots from Lyft IR. Ownership and insider trades live in the Pillars → Management tab.",
});

function linsMoneyFlow(){
  function mk(id,c){ return '<marker id="'+id+'" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="'+c+'"/></marker>'; }
  var h='<style>'+
    '@keyframes lmfflow{to{stroke-dashoffset:-28}}'+
    '.lmf-wrap{border:1px solid var(--bdr);border-radius:14px;background:linear-gradient(180deg,#fffafd,#fff);padding:6px 4px 2px;margin:2px 0}'+
    '.lmf-line{stroke-width:5;stroke-dasharray:8 7;animation:lmfflow .8s linear infinite;fill:none;stroke-linecap:round}'+
    '.lmf-node{cursor:pointer}.lmf-node rect{transition:.15s}.lmf-node:hover rect{stroke-width:2.5;filter:drop-shadow(0 2px 5px rgba(0,0,0,.10))}'+
    '.lmf-cap{font-size:11.5px;color:var(--navy);line-height:1.55;padding:9px 14px 4px}.lmf-cap b{font-weight:800}'+
  '</style>';
  h+='<div class="lmf-wrap"><svg viewBox="0 0 720 296" role="img" aria-label="Lyft insurance money flow" style="width:100%;height:auto;font-family:Inter,sans-serif">';
  h+='<defs>'+mk('lmfg','#049a4f')+mk('lmfa','#C77A11')+mk('lmfp','#E6007A')+'</defs>';
  h+='<line class="lmf-line" x1="150" y1="150" x2="219" y2="150" stroke="#049a4f" marker-end="url(#lmfg)"/>';
  h+='<line class="lmf-line" x1="416" y1="112" x2="497" y2="92" stroke="#C77A11" marker-end="url(#lmfa)"/>';
  h+='<line class="lmf-line" x1="416" y1="188" x2="497" y2="210" stroke="#E6007A" marker-end="url(#lmfp)"/>';
  h+='<text x="184" y="140" text-anchor="middle" font-size="9.5" font-weight="800" fill="#049a4f">NOW</text>';
  h+='<text x="458" y="80" text-anchor="middle" font-size="9.5" font-weight="800" fill="#C77A11">pay LATER</text>';
  h+='<text x="456" y="228" text-anchor="middle" font-size="9.5" font-weight="800" fill="#E6007A">sell the tail</text>';
  // fare -> pvic:0
  h+='<g class="lmf-node ov-clickable" data-detail="pvic:0">'+
    '<rect x="14" y="116" width="136" height="68" rx="10" fill="#fff" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="82" y="140" text-anchor="middle" font-size="12" font-weight="800" fill="#10141A">Every fare</text>'+
    '<text x="82" y="159" text-anchor="middle" font-size="10.5" fill="#3A4552">insurance cost</text>'+
    '<text x="82" y="177" text-anchor="middle" font-size="12" font-weight="800" fill="#E6007A">~31% of a CA fare</text></g>';
  // reservoir PVIC -> pvic:3
  h+='<g class="lmf-node ov-clickable" data-detail="pvic:3">'+
    '<rect x="222" y="60" width="194" height="180" rx="13" fill="rgba(230,0,122,0.06)" stroke="#E6007A" stroke-width="2"/>'+
    '<text x="319" y="88" text-anchor="middle" font-size="11.5" font-weight="800" fill="#E6007A">PVIC · captive insurer</text>'+
    '<text x="319" y="150" text-anchor="middle" font-size="37" font-weight="900" fill="#E6007A">$2.18B</text>'+
    '<text x="319" y="172" text-anchor="middle" font-size="10.5" fill="#2b3542">reserves — trust-invested</text>'+
    '<text x="319" y="214" text-anchor="middle" font-size="10" font-weight="700" fill="#6b7684">held now · paid over years</text></g>';
  // claims out -> pvic:2
  h+='<g class="lmf-node ov-clickable" data-detail="pvic:2">'+
    '<rect x="500" y="58" width="206" height="66" rx="10" fill="#fff" stroke="#C77A11" stroke-width="1.5"/>'+
    '<text x="603" y="84" text-anchor="middle" font-size="11.5" font-weight="800" fill="#C77A11">Claims paid out</text>'+
    '<text x="603" y="104" text-anchor="middle" font-size="10" fill="#3A4552">carriers reimbursed from trust</text></g>';
  // LPT exit -> pvic:4 (the differentiator)
  h+='<g class="lmf-node ov-clickable" data-detail="pvic:4">'+
    '<rect x="500" y="178" width="206" height="66" rx="10" fill="rgba(230,0,122,0.06)" stroke="#E6007A" stroke-width="2"/>'+
    '<text x="603" y="200" text-anchor="middle" font-size="11.5" font-weight="800" fill="#E6007A">Legacy tail SOLD (LPT)</text>'+
    '<text x="603" y="217" text-anchor="middle" font-size="9.5" fill="#3A4552">e.g. Riverstone &#183; Feb 2025</text>'+
    '<text x="603" y="232" text-anchor="middle" font-size="9.5" font-weight="700" fill="#049a4f">old liability leaves the B/S</text></g>';
  h+='</svg>';
  h+='<div class="lmf-cap"><b>Collect now, pay later — then sell the tail.</b> The insurance cost sits inside the fare and funds the PVIC captive&rsquo;s <b>$2.18B</b> reserve (reported), trust-invested while claims settle over years (the float — an analytical framing, not a disclosed line). Two levers bend the curve — the Oct-2025 renewal came in <b>mid-single-digit</b> and <b>SB 371</b> cuts California coverage from Jan 2026 — and periodically Lyft <b>sells the matured tail via Loss Portfolio Transfers</b> (most recently the <b>Feb 2025 Riverstone</b> deal, $120.5M limit / $85.1M premium), moving old liabilities <b>off the balance sheet</b>. <span class="ave-subh-note">Tap any node for the step. The reserve is the reported figure; the "~31% of a CA fare" is an <b>Uber-advocacy estimate</b>, not a disclosed Lyft number — treat per-fare cent splits as estimates.</span></div>';
  h+='</div>';
  return h;
}
function insModelCompare(){
  var R=[
    ['Captive insurer','<b>Aleka</b> (Hawaii)','<b>PVIC</b> &mdash; Pacific Valley (Hawaii)'],
    ['How much risk it keeps','<b>Large self-insured retention</b> via Aleka + third-party reinsurance above limits <span style="color:var(--mu)">(exact split not disclosed)</span>','<b>Partial</b> &mdash; reinsures a slice back; still buys from 3rd-party carriers'],
    ['Reserves','~<b>$12.9B</b> (Q1 2026, reported)','~<b>$2.18B</b> (Dec 2025, reported)'],
    ['How each frames it','a <b>cash engine</b> &mdash; collect now, invest, pay claims years later','the story is <b>cost per ride falling</b>, not the float'],
    ['The old &ldquo;tail&rdquo;','<b>kept</b> on the books and invested','<b>sold off</b> via Loss Portfolio Transfers &mdash; e.g. the <b>Feb 2025 Riverstone</b> deal ($120.5M limit for an $85.1M premium, funds-withheld)'],
    ['The market&rsquo;s read','&ldquo;float-fed cash&rdquo; (bull) vs &ldquo;an unregulated insurer&rdquo; (bear)','&ldquo;bending the cost curve&rdquo; via SB&nbsp;371 + the captive']
  ];
  var h='<style>'+
    '.imc-hd{font-size:12.5px;color:var(--navy);line-height:1.55;margin:0 0 12px}.imc-hd b{font-weight:800}'+
    '.imc{border:1px solid var(--bdr);border-radius:12px;overflow:hidden}'+
    '.imc-row{display:grid;grid-template-columns:1.05fr 1.5fr 1.5fr;border-top:1px solid var(--bdr)}.imc-row:first-child{border-top:none}'+
    '.imc-cell{padding:9px 12px;font-size:11.5px;line-height:1.45;color:var(--navy);border-left:1px solid var(--bdr)}.imc-cell:first-child{border-left:none}.imc-cell b{font-weight:800}'+
    '.imc-k{font-weight:800;background:#fafbfc}'+
    '.imc-head .imc-cell{font-weight:900;background:#f4f6f9;font-size:12px}.imc-hu{color:#10141A}.imc-hl{color:#E6007A}'+
    '.imc-so{font-size:12px;color:var(--navy);line-height:1.55;background:#f6f8fa;border-radius:9px;padding:11px 14px;margin-top:12px}.imc-so b{font-weight:800}'+
    '@media(max-width:640px){.imc-row{grid-template-columns:1fr}.imc-cell{border-left:none;border-top:1px dashed var(--bdr)}.imc-cell:first-child{border-top:none}}'+
  '</style>';
  h+='<div class="imc-hd"><b>Both run their own captive insurer</b> &mdash; but they play it very differently. <b>Uber goes all-in on the float</b> (huge reserves it invests as a cash engine); <b>Lyft keeps it smaller and actively sells off the old risk</b> (LPT), betting on cost-per-ride reform instead.</div>';
  h+='<div class="imc"><div class="imc-row imc-head"><div class="imc-cell"></div><div class="imc-cell imc-hu">UBER &middot; Aleka</div><div class="imc-cell imc-hl">LYFT &middot; PVIC</div></div>'+
    R.map(function(r){ return '<div class="imc-row"><div class="imc-cell imc-k">'+r[0]+'</div><div class="imc-cell">'+r[1]+'</div><div class="imc-cell">'+r[2]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="imc-so"><b>In one line:</b> Uber&rsquo;s insurance is a <b>cash-flow story</b> (the float it invests); Lyft&rsquo;s is a <b>cost-reduction story</b> (SB&nbsp;371 + offloading the tail). Same plumbing, opposite emphasis.</div>';
  return h;
}
function insuranceBody(c){
  var SHARE=[['California','31'],['New York','27'],['GA · FL · TX','19'],['DC · Mass.','4']];
  var STATES=[
    ['California','120% of local min wage + ~35¢/mi','Health stipend (50–100% of bronze premium)','Prop 22 — upheld by CA Supreme Court, 2024'],
    ['Massachusetts','$32.50 / hr engaged time','Paid sick leave + health/PFML; + union rights (Q3)','AG settlement, 2024 ($175M)'],
    ['Minnesota','$1.28/mi + $0.31/min','—','Statewide law, Dec 2024 (preempts Minneapolis)'],
    ['New York City','~$1.28/mi + $0.68/min','TLC utilization-adjusted','TLC pay standard (since 2019)'],
    ['Austin / Texas','No state mandate','—','HB 100 (2017) preempts local rules'],
  ];
  var h='<style>'+
    '.lins-hero{display:flex;align-items:center;gap:16px;flex-wrap:wrap;border:1px solid rgba(230,0,122,0.28);border-radius:14px;background:linear-gradient(180deg,rgba(230,0,122,0.05),transparent);padding:16px 18px;margin:0 0 18px}'+
    '.lins-hero-v{font-size:30px;font-weight:900;color:#E6007A;line-height:1;flex:none}'+
    '.lins-hero-t{font-size:12.5px;color:var(--navy);line-height:1.6;flex:1;min-width:250px}.lins-hero-t b{font-weight:800}'+
    '.lins-h{font-size:13px;font-weight:800;color:var(--navy);margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
    '.lins-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:0;align-items:stretch}@media(max-width:640px){.lins-flow{grid-template-columns:1fr 1fr}}'+
    '.lins-ph{border:1px solid var(--bdr);border-top:3px solid #ccc;border-radius:10px;padding:11px 12px;margin:0 4px;position:relative}'+
    '.lins-ph-n{font-size:12px;font-weight:800;color:var(--navy)}.lins-ph-s{font-size:10px;color:var(--mu);margin:1px 0 7px;min-height:26px}'+
    '.lins-ph-who{font-size:10.5px;color:var(--mu);font-weight:700}.lins-ph-lim{font-size:12px;font-weight:800;margin-top:2px}'+
    '.lins-cov{height:5px;border-radius:4px;margin-top:9px;background:linear-gradient(90deg,#9AA3AE,#5B8DEF,#E6007A)}'+
    '.lins-cap{font-size:11px;color:var(--mu);line-height:1.55;margin-top:10px}.lins-cap b{color:var(--navy);font-weight:800}'+
    '.lins-share{display:flex;align-items:flex-end;gap:12px;height:110px;padding:8px 0 0}'+
    '.lins-sb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px}'+
    '.lins-sb-bar{width:70%;max-width:54px;background:#E6007A;border-radius:5px 5px 0 0;opacity:.85}'+
    '.lins-sb-v{font-size:12px;font-weight:800;color:#E6007A}.lins-sb-l{font-size:10px;color:var(--mu);font-weight:700;text-align:center}'+
    '.lins-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:640px){.lins-two{grid-template-columns:1fr}}'+
    '.lins-side{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px}.lins-side.pol{border-top:3px solid #5B8DEF}.lins-side.tec{border-top:3px solid #E6007A}'+
    '.lins-side-h{font-size:12.5px;font-weight:800;margin-bottom:8px}.lins-side.pol .lins-side-h{color:#3A7BD5}.lins-side.tec .lins-side-h{color:#E6007A}'+
    '.lins-it{font-size:11.5px;color:var(--navy);line-height:1.5;margin:7px 0}.lins-it b{font-weight:800}.lins-it .win{color:#0a8f0a;font-weight:700}'+
    '.lins-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.lins-chip{font-size:10px;font-weight:700;color:#E6007A;background:rgba(230,0,122,0.09);border-radius:20px;padding:2px 8px}'+
    '.lins-ev{background:rgba(10,143,10,0.05);border-left:3px solid #0a8f0a;border-radius:8px;padding:11px 14px;font-size:12px;color:var(--navy);line-height:1.6;margin-top:4px}.lins-ev b{font-weight:800}'+
    '.lins-tbl{width:100%;border-collapse:collapse;font-size:11px}'+
    '.lins-tbl th{text-align:left;font-size:9.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);padding:6px 8px;border-bottom:1px solid var(--bdr)}'+
    '.lins-tbl td{padding:7px 8px;border-bottom:1px solid var(--bdr);color:var(--navy);vertical-align:top}.lins-tbl td:first-child{font-weight:800}'+
  '</style>';
  h+='<div class="lins-hero"><div class="lins-hero-v">~$687M</div>'+
    '<div class="lins-hero-t">of Lyft’s 2024 cost increase was <b>insurance</b> — its <b>biggest cost and biggest controllable lever</b> (~<b>31% of the fare</b> in California). Here’s how it works, and the two-front war to bend the curve.</div></div>';
  // coverage timeline
  var LCE=[
    {name:'App OFF', lvl:18, badge:'Driver&rsquo;s personal auto policy', lim:'Their own limits', inc:'Lyft is not involved', note:'Off-app crashes are entirely on the driver.'},
    {name:'Period 1', lvl:34, badge:'Lyft &mdash; contingent liability', lim:'$50K / $100K / $25K', inc:'Fills only if the personal policy will not', note:'App on, waiting for a request &mdash; the cheapest state to insure.'},
    {name:'Period 2', lvl:86, badge:'Lyft &mdash; commercial policy', lim:'$1,000,000 / occurrence', inc:'Full primary liability', note:'Matched & en route: the big jump &mdash; $1M kicks in the moment a driver accepts.'},
    {name:'Period 3', lvl:100, badge:'Lyft &mdash; commercial policy', lim:'$1M + UM/UIM + $2.5K collision', inc:'Peak coverage &mdash; a passenger is aboard', note:'The most expensive leg &mdash; and exactly the UM/UIM that CA SB&nbsp;371 trims from Jan 2026.'},
    {name:'Drop-off', lvl:18, badge:'Reverts to Period 1 &rarr; personal', lim:'Back down', inc:'Coverage ends with the ride', note:'The instant the trip completes, coverage steps back down.'}
  ];
  var lcecss='';
  for(var ci=0;ci<LCE.length;ci++){ lcecss+='#lce-'+ci+':checked~.lce-rail label[for="lce-'+ci+'"] .lce-bar{background:#E6007A}#lce-'+ci+':checked~.lce-rail label[for="lce-'+ci+'"] .lce-lbl{color:#E6007A}#lce-'+ci+':checked~.lce-panels .lce-panel[data-i="'+ci+'"]{display:block}'; }
  h+='<div class="lins-h">The coverage &mdash; it escalates with the app state <span style="font-size:10px;font-weight:600;color:var(--mu)">(tap a state)</span></div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 10px">Rideshare insurance runs on the industry-standard <b>3-period model</b> &mdash; your coverage (and its cost) depend on <b>what the app is doing</b>. The bars show coverage <b>escalating</b> from personal (app off) to Lyft&rsquo;s full <b>$1M</b> commercial policy once a rider is aboard, then dropping back at drop-off. <b>Tap any phase</b> for who pays and the limits.</div>';
  h+='<style>.lce-in{display:none}.lce-rail{display:flex;align-items:flex-end;gap:6px;height:150px;padding:0 2px;border-bottom:2px solid var(--bdr)}.lce-step{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;cursor:pointer;gap:6px}.lce-barwrap{width:100%;flex:1;display:flex;align-items:flex-end}.lce-bar{width:100%;background:#c9d2dc;border-radius:6px 6px 0 0;transition:.2s}.lce-step:hover .lce-bar{background:#f2a8cd}.lce-lbl{font-size:10px;font-weight:800;color:var(--mu);text-align:center;line-height:1.1}.lce-panel{display:none;border:1px solid var(--bdr);border-left:3px solid #E6007A;border-radius:10px;padding:12px 14px;margin-top:10px;animation:lcefade .25s ease}@keyframes lcefade{from{opacity:0;transform:translateY(4px)}to{opacity:1}}.lce-badge{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#E6007A}.lce-lim{font-size:20px;font-weight:900;color:var(--navy);margin:4px 0 2px}.lce-inc{font-size:12px;color:var(--navy);font-weight:700}.lce-note{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:6px}'+lcecss+'</style>';
  h+='<div class="lce">';
  for(var cj=0;cj<LCE.length;cj++){ h+='<input class="lce-in" type="radio" name="lcestate" id="lce-'+cj+'"'+(cj===2?' checked':'')+'>'; }
  h+='<div class="lce-rail">'+LCE.map(function(x,i){ return '<label class="lce-step" for="lce-'+i+'"><span class="lce-barwrap"><span class="lce-bar" style="height:'+x.lvl+'%"></span></span><span class="lce-lbl">'+x.name+'</span></label>'; }).join('')+'</div>';
  h+='<div class="lce-panels">'+LCE.map(function(x,i){ return '<div class="lce-panel" data-i="'+i+'"><div class="lce-badge">'+x.badge+'</div><div class="lce-lim">'+x.lim+'</div><div class="lce-inc">'+x.inc+'</div><div class="lce-note">'+x.note+'</div></div>'; }).join('')+'</div>';
  h+='</div>';
  h+='<div class="lins-cap">The <b>$1M jump at Period 2</b> is the whole cost story: full commercial liability kicks in the instant a driver accepts, and Period 3 adds uninsured-motorist + collision. <b>Uber uses the identical 3-period model.</b> (NYC rides fall under the separate TLC / black-car regime.)</div>';
  h+='<div class="lins-h">Why it is so big &mdash; and rising</div>';
  h+='<style>.lwb-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}@media(max-width:720px){.lwb-grid{grid-template-columns:1fr 1fr}}.lwb-c{border:1px solid var(--bdr);border-top:3px solid #E6007A;border-radius:10px;padding:11px 12px;background:#fff}.lwb-v{font-size:20px;font-weight:900;color:#E6007A;line-height:1}.lwb-l{font-size:11px;font-weight:800;color:var(--navy);margin:5px 0 3px}.lwb-d{font-size:10.5px;color:var(--mu);line-height:1.45}</style>';
  h+='<div class="lwb-grid">'+
    '<div class="lwb-c"><div class="lwb-v">$1M</div><div class="lwb-l">The mandate is enormous</div><div class="lwb-d">CA requires $1M liability &mdash; ~30&times; the personal minimum. TNC rules dwarf personal auto.</div></div>'+
    '<div class="lwb-c"><div class="lwb-v">+23%</div><div class="lwb-l">Cost inflation</div><div class="lwb-d">Auto-insurance CPI peaked at +23% YoY (2024) &mdash; repair, medical & litigation costs.</div></div>'+
    '<div class="lwb-c"><div class="lwb-v">&gt;50%</div><div class="lwb-l">Per-trip escalation</div><div class="lwb-d">Uber&rsquo;s US insurance cost rose &gt;50% per trip in just three years.</div></div>'+
    '<div class="lwb-c"><div class="lwb-v">most</div><div class="lwb-l">It is pass-through</div><div class="lwb-d">Most of riders&rsquo; recent price hikes are simply insurance passed straight through.</div></div>'+
  '</div>';
  h+='<div class="lins-cap" style="margin:14px 0 8px"><b>How much of a fare is just insurance?</b> Wildly <b>uneven</b> by state &mdash; which is exactly why <b>California</b> (SB&nbsp;371) is the whole battleground. <span style="font-style:italic;color:var(--mu)">(share of the fare; Uber advocacy est.)</span></div>';
  h+='<style>.lshr-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}.lshr-l{flex:0 0 92px;font-size:11.5px;font-weight:700;color:var(--navy);text-align:right}.lshr-track{flex:1;height:24px;background:#f1f4f8;border-radius:7px;overflow:hidden}.lshr-fill{height:100%;background:linear-gradient(90deg,#E6007A,#c0006a);border-radius:7px;min-width:3px}.lshr-v{flex:0 0 46px;font-size:14px;font-weight:900;color:#E6007A}</style>';
  h+='<div>'+SHARE.map(function(x){ return '<div class="lshr-row"><div class="lshr-l">'+x[0]+'</div><div class="lshr-track"><div class="lshr-fill" style="width:'+x[1]+'%"></div></div><div class="lshr-v">'+x[1]+'%</div></div>'; }).join('')+'</div>';
  h+='<div class="lins-cap" style="margin-top:6px">Read it as <b>cents on the dollar</b>: in a <b>California</b> fare, ~<b>31¢</b> of every $1 is insurance; in DC/Mass, ~<b>4¢</b>. That spread is why one state&rsquo;s rules (SB&nbsp;371) move the <b>whole</b> margin story.</div>';
  // two-front war
  h+='<div class="lins-h">The two-front war to bend the curve</div>';
  h+='<div class="lins-two">'+
    '<div class="lins-side pol"><div class="lins-side-h">1 · Change the rules (policy reform)</div>'+
      '<div class="lins-it"><b>Insurance reform</b> — cut excessive UM/UIM & primary-liability mandates. <span class="win">Won: reduced UM/UIM in VA, NC, GA, AZ.</span></div>'+
      '<div class="lins-it"><b>Tort reform</b> — curb frivolous rideshare litigation. <span class="win">Won: TNC vicarious-liability reform in FL & TX; broad tort reform in FL & GA.</span></div>'+
      '<div class="lins-it"><b>Coalition building</b> — with the US Chamber of Commerce, targeting third-party litigation funding in Congress.</div>'+
      '<div class="lins-it" style="color:var(--mu)">The prize: California <b>SB 371</b> later cut mandated UM/UIM from <b>$1M → $60K/$300K</b> (eff. Jan 2026).</div>'+
    '</div>'+
    '<div class="lins-side tec"><div class="lins-side-h">2 · Reduce the risk (technology & partners)</div>'+
      '<div class="lins-it">Segment risk by driver and road/environment features, off <b>billions of on-platform miles</b> — powered by Lyft’s <b>in-house telematics</b> and its <b>Risk Management Information System (RMIS)</b>.</div>'+
      '<div class="lins-chips"><span class="lins-chip">Insurance Cost-Aware Pricing</span><span class="lins-chip">Road Hazard Alerts</span><span class="lins-chip">Cost-Aware LyftNav</span><span class="lins-chip">Smooth Cruiser</span></div>'+
      '<div class="lins-it" style="margin-top:9px"><span class="win">Result: on-platform accident frequency down <b>~10% over 4 years.</b></span></div>'+
      '<div class="lins-it">A <b>captive</b> retains risk strategically; insurance partners bring balance sheets, claims scale and decades of underwriting.</div>'+
    '</div>'+
  '</div>';
  h+='<div class="lins-ev"><b>Is it working?</b> Yes — Lyft is <b>bending the cost curve</b>: the sequential step-up in third-party insurance renewals halved, from <b>~+$100M (Q4 2023) to ~+$50M (Q4 2024)</b>. This is the quiet engine under the 2027 margin target — the biggest cost line growing slower than the business.</div>';
  // regulation
  h+='<div class="lins-h">The other half — driver independence & the regulatory patchwork</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">Lyft’s national model: keep drivers as <b>independent contractors</b> but attach <b>portable benefits</b>. Every state deal preserves IC status while conceding pay floors and benefits — from Prop 22 to Massachusetts’ richer bundle.</div>';
  h+='<table class="lins-tbl"><thead><tr><th>Jurisdiction</th><th>Pay floor</th><th>Benefits</th><th>Framework</th></tr></thead><tbody>'+
    STATES.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>'; }).join('')+'</tbody></table>';
  h+='<div class="lins-h">How Lyft carries the risk — the captive & the statements</div>';
  h+='<div class="insarc">'+
      '<div class="insarc-p insarc-red"><div class="insarc-y">2021–22</div><div class="insarc-l">CRUTCH</div><div class="insarc-d">Reserves ballooning, margins underwater — insurance nearly broke the model.</div></div>'+
      '<div class="insarc-p insarc-amber"><div class="insarc-y">2022–24</div><div class="insarc-l">HEADWIND</div><div class="insarc-d">The largest cost-of-revenue slice; rising claim severity squeezed gross profit.</div></div>'+
      '<div class="insarc-p insarc-green"><div class="insarc-y">2025–26</div><div class="insarc-l">TAILWIND</div><div class="insarc-d">SB 371 + a captive insurer + selling off old liabilities cut cost per ride → the unlock.</div></div>'+
    '</div>'+
    '<div class="ov-subh" style="margin-top:18px">How it flows through the P&L, balance sheet & cash flow</div>'+stmtFlow()+'<div style="font-size:12px;color:var(--mu);margin:16px 0 8px">And how the money actually flows through the captive — <b>tap any node</b>:</div>'+
    linsMoneyFlow()+
    '<div class="ov-subh" style="margin-top:16px">Legacy-risk transfers (loss portfolio transfers)</div>'+
    '<table class="ov-table"><thead><tr><th>Date</th><th>Counterparty</th><th>What was transferred</th></tr></thead><tbody>'+
    RISK_XFER.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td class="ov-td-name">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>';
  h+='<div style="font-size:13px;font-weight:800;color:var(--navy);margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bdr)">Uber vs Lyft — two ways to run insurance</div>';
  h+=insModelCompare();
  h+='<div class="ov-foot" style="margin-top:14px">Coverage structure and the two-lever strategy are from Lyft’s June-2024 Investor Day (Insurance section, Max Feldman, VP Head of Risk); limits per Lyft/Uber driver-insurance pages. Share-of-fare percentages are Uber advocacy estimates (directional). Cost figures from Lyft FY2024 10-K and Uber disclosures. State frameworks re-index annually — verify current-year figures.</div>';
  return h;
}
function lyEnginesGlance(){
  var E=[
    {n:'Lyft Media', v:'$100M&rarr;$400M', d:'~100%-margin ad surfaces (in-app, in-car, email) by 2027', role:'drives margin', rc:'#1E9E62', rb:'rgba(30,158,98,0.12)'},
    {n:'Partnerships', v:'~1 in 4 rides', d:'low-CAC demand borrowed from United, Chase, DoorDash&hellip;', role:'drives frequency', rc:'#3A7BD5', rb:'rgba(58,123,213,0.12)'},
    {n:'Healthcare (NEMT)', v:'21 states', d:'payer-funded, recurring rides that do not move with the consumer cycle', role:'drives durability', rc:'#B8860B', rb:'rgba(184,134,11,0.14)'},
    {n:'Membership', v:'Pink + Price Lock', d:'a paid tier + a surge hedge that lock riders in', role:'drives retention', rc:'#E6007A', rb:'rgba(230,0,122,0.12)'}
  ];
  var h='<style>.lmg-eng{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:2px 0 8px}@media(max-width:760px){.lmg-eng{grid-template-columns:1fr 1fr}}.lmg-eng-c{border:1px solid var(--bdr);border-radius:11px;padding:12px 13px;background:#fff}.lmg-eng-n{font-size:12.5px;font-weight:800;color:var(--navy)}.lmg-eng-v{font-size:17px;font-weight:900;margin:5px 0 3px;line-height:1.05}.lmg-eng-d{font-size:10.5px;color:var(--mu);line-height:1.4;min-height:42px}.lmg-eng-role{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:10px;padding:2px 9px;margin-top:8px}</style>';
  h+='<div class="lmg-eng">'+E.map(function(e){ return '<div class="lmg-eng-c" style="border-top:3px solid '+e.rc+'"><div class="lmg-eng-n">'+e.n+'</div><div class="lmg-eng-v" style="color:'+e.rc+'">'+e.v+'</div><div class="lmg-eng-d">'+e.d+'</div><span class="lmg-eng-role" style="color:'+e.rc+';background:'+e.rb+'">'+e.role+'</span></div>'; }).join('')+'</div>';
  return h;
}
function mediaBody(c){
  var SURF=[
    { n:'Sponsored Rides', d:'A brand subsidizes the ride, across every screen.', st:'Shipped' },
    { n:'Gated “Wait & Save”', d:'Longer wait, cheaper fare — monetized with full-screen video.', st:'Video shipped' },
    { n:'In-app media', d:'Display, video, Sponsored Map Pins — “own the map.”', st:'10× CTR' },
    { n:'In-car tablets', d:'Seatback screens carrying brand placements.', st:'6,000+ · 1M+ rides/mo' },
    { n:'Rooftop — Lyft Halo', d:'Programmatic digital car-top screens.', st:'1,000+ · 1B+ impr./mo' },
    { n:'Bikes & docks', d:'OOH panels on Citi Bike / Divvy stations.', st:'City-scale' },
  ];
  var PART=[
    { n:'DoorDash', d:'DashPass members get 5–10% off rides + free Priority upgrades; Lyft riders get a 3-month DashPass trial. Called Lyft’s “largest ever.”' },
    { n:'Chase Sapphire Reserve', d:'Renewed through 2027 — added a $10/mo ($120/yr) Lyft credit, but cut points earn from 10× to 5×.' },
    { n:'United MileagePlus', d:'Earn 1–4 miles/$1, plus “Pay With Miles” — billed as the first pay-with-miles option in US rideshare. (Replaced Delta, which left for Uber in 2025.)' },
    { n:'Hilton Honors', d:'3× points on rides — a steady travel-loyalty tie-in.' },
  ];
  var h='<style>'+
    '.lmg-lede{font-size:13px;line-height:1.6;color:var(--navy);margin:0 0 14px}.lmg-lede b{font-weight:800}'+
    '.lmg-h{font-size:13px;font-weight:800;color:var(--navy);margin:22px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
    '.lmg-vision{background:linear-gradient(180deg,rgba(230,0,122,0.06),transparent);border:1px solid rgba(230,0,122,0.25);border-radius:12px;padding:14px 16px;margin:0 0 14px}'+
    '.lmg-vision-t{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#E6007A;margin-bottom:7px}'+
    '.lmg-vision-l{font-size:12.5px;color:var(--navy);line-height:1.7;padding-left:16px;position:relative}.lmg-vision-l:before{content:"→";position:absolute;left:0;color:#E6007A;font-weight:800}.lmg-vision-l b{font-weight:800}'+
    '.lmg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}'+
    '.lmg-c{border:1px solid var(--bdr);border-top:2px solid #E6007A;border-radius:10px;padding:11px 13px}'+
    '.lmg-c-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}.lmg-c-d{font-size:11px;color:var(--navy);line-height:1.45}.lmg-c-st{font-size:10px;font-weight:800;color:#E6007A;margin-top:7px}'+
    '.lmg-cmp{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:end;border:1px solid var(--bdr);border-radius:12px;padding:16px;background:#fff;margin-top:4px}'+
    '.lmg-cmp-col{text-align:center}.lmg-cmp-bar{margin:0 auto;width:60%;max-width:90px;border-radius:6px 6px 0 0}.lmg-cmp-l{font-size:12px;font-weight:800;color:var(--navy);margin-top:8px}.lmg-cmp-v{font-size:11px;color:var(--mu)}'+
    '.lmg-cmp-cap{font-size:12px;color:var(--navy);line-height:1.55;margin-top:12px}.lmg-cmp-cap b{font-weight:800}'+
    '.lmg-part{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}'+
    '.lmg-pc{border:1px solid var(--bdr);border-radius:10px;padding:11px 13px}.lmg-pc-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}.lmg-pc-d{font-size:11px;color:var(--navy);line-height:1.45}'+
    '.lmg-hc{border:1px solid var(--bdr);border-left:3px solid #3A7BD5;border-radius:11px;padding:14px 16px}'+
    '.lmg-hc-row{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}'+
    '.lmg-hc-stat{flex:1;min-width:120px;background:rgba(58,123,213,0.06);border-radius:9px;padding:9px 11px}.lmg-hc-v{font-size:16px;font-weight:900;color:#3A7BD5;line-height:1}.lmg-hc-l{font-size:10px;color:var(--mu);font-weight:700;margin-top:3px}'+
    '.lmg-hc-d{font-size:12px;color:var(--navy);line-height:1.6}.lmg-hc-d b{font-weight:800}'+
  '</style>';
  h+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--brand);margin:0 0 8px">Beyond the ride · the high-margin growth engines</div>';
  h+='<p class="lmg-lede">Beyond the ride, Lyft runs <b>four higher-margin, more-durable engines</b> — each playing a distinct role in the 2027 model. Here they are <b>at a glance</b>, then in depth.</p>';
  h+=lyEnginesGlance();
  // Lyft Media
  h+='<div class="lmg-h">Lyft Media — the ad engine</div>';
  h+='<div class="lmg-vision"><div class="lmg-vision-t">The vision, from the Investor Day</div>'+
    '<div class="lmg-vision-l">Media that <b>drives foot traffic directly to storefronts</b></div>'+
    '<div class="lmg-vision-l">that <b>extends every rider’s experience from the storefront to their front door</b></div>'+
    '<div class="lmg-vision-l">and <b>offers merchants immediate access to rider and driver analytics</b></div></div>';
  h+='<div class="lmg-grid">'+SURF.map(function(x){ return '<div class="lmg-c"><div class="lmg-c-n">'+x.n+'</div><div class="lmg-c-d">'+x.d+'</div><div class="lmg-c-st">'+x.st+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:10px 0">Measured with an outside stack — <b>Foursquare</b> (foot-traffic), <b>NCSolutions</b> (sales lift), <b>Nielsen</b>, <b>Kantar</b>, <b>LiveRamp</b> — so a merchant can tie an ad to a store visit and a delivery.</div>';
  // the punch: proven model, Lyft early
  h+='<div class="lmg-cmp"><div class="lmg-cmp-col"><div class="lmg-cmp-bar" style="height:22px;background:#E6007A"></div><div class="lmg-cmp-l">Lyft Media</div><div class="lmg-cmp-v">~$100M run-rate (2025) → &gt;$400M target 2027</div></div>'+
    '<div class="lmg-cmp-col"><div class="lmg-cmp-bar" style="height:120px;background:#111827"></div><div class="lmg-cmp-l">Uber Advertising</div><div class="lmg-cmp-v">&gt;$2B run-rate (2025)</div></div></div>';
  h+='<div class="lmg-cmp-cap"><b>The punch:</b> the model is already proven — <b>Uber’s ad business is past $2B</b>. Lyft is running the <b>same playbook on a smaller surface</b>, growing <b>&gt;100% a year</b> (~4× to &gt;$400M gross bookings by 2027). Ads are ~100% incremental margin, so this is the single biggest lever on the 4%-of-GB EBITDA target.</div>';
  // Partnerships
  h+='<div class="lmg-h">Growth partnerships — ~1 in 4 rides</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 9px"><b>~20% of Lyft’s 2023 rides had a direct partner connection</b> — the clearest measure of how central partnerships are to volume. Each brings low-cost, loyal demand.</div>';
  h+='<div class="lmg-part">'+PART.map(function(x){ return '<div class="lmg-pc"><div class="lmg-pc-n">'+x.n+'</div><div class="lmg-pc-d">'+x.d+'</div></div>'; }).join('')+'</div>';
  // Healthcare
  h+='<div class="lmg-h">Lyft Healthcare — the quiet, counter-cyclical franchise</div>';
  h+='<div class="lmg-hc"><div class="lmg-hc-d">One of the largest US providers of <b>non-emergency medical transportation</b> — <b>recurring, payer-funded rides</b> that don’t move with consumer rideshare, embedded in clinical workflows.</div>'+
    '<div class="lmg-hc-row">'+
      '<div class="lmg-hc-stat"><div class="lmg-hc-v">21 states</div><div class="lmg-hc-l">Medicaid NEMT · &gt;62% of beneficiaries</div></div>'+
      '<div class="lmg-hc-stat"><div class="lmg-hc-v">~9 of 10</div><div class="lmg-hc-l">top US health systems</div></div>'+
      '<div class="lmg-hc-stat"><div class="lmg-hc-v">250M+</div><div class="lmg-hc-l">patient records reachable via Epic</div></div>'+
    '</div>'+
    '<div class="lmg-hc-d"><b>“Lyft for Epic”</b> books rides inside the health record. The need is real: <b>more than 1 in 5 US adults skipped care over a transport barrier.</b></div></div>';
  h+='<div class="lmg-h">Membership — Lyft Pink & Price Lock</div>';
  h+=membershipViz();
  h+='<div class="ov-foot" style="margin-top:14px">Lyft Media vision and ad products are verbatim from Lyft’s June-2024 Investor Day deck; media surface metrics and the ~$400M gross-bookings target from Lyft Media disclosures and earnings calls (the &gt;$400M figure is <b>gross bookings, not GAAP revenue</b>). Partnership and healthcare facts from Lyft press releases and the 2024 Economic Impact Report. Uber Advertising run-rate from Uber’s Q4/FY2025 disclosures.</div>';
  return h;
}
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting helpers ──────────────────────────────────────────────────────
function money(m){ // $millions → compact. 4946 → "$4.95B"; 132.8 → "$133M"
  if (m == null) return '—';
  var neg = m < 0, a = Math.abs(m), s;
  if (a >= 1000) s = '$' + (a/1000).toFixed(2).replace(/\.?0+$/,'') + 'B';
  else s = '$' + Math.round(a) + 'M';
  return (neg ? '−' : '') + s;
}
function moneyB(m){ var neg=m<0,a=Math.abs(m); return (neg?'−':'')+'$'+(a/1000).toFixed(a/1000>=10?1:2)+'B'; }
function usd2(v){ return (v<0?'−$':'$') + Math.abs(v).toFixed(2); }
function ridesLbl(v){ return v >= 1000 ? (v/1000).toFixed(2)+'B' : Math.round(v)+'M'; }
function pctStr(p){ return (p>=0?'+':'−') + Math.abs(p).toFixed(0) + '%'; }
function yoy(arr, i){ if (i<1 || arr[i-1]==null || arr[i-1]===0) return null; return (arr[i]/arr[i-1]-1)*100; }
function cagr(v0, v1, yrs){ if (v0==null||v1==null||v0<=0||v1<=0||yrs<=0) return null; return (Math.pow(v1/v0, 1/yrs)-1)*100; }

// ─── Brand ───────────────────────────────────────────────────────────────────
var BRAND  = '#E6007A';                 // Lyft pink
var BRAND2 = '#6B2BD9';                 // Lyft purple (secondary)
var EST_FILL = 'rgba(230,0,122,0.30)';  // lighter pink for estimate bars
var NEG = '#C0392B', NEG_FILL = 'rgba(192,57,43,0.30)';
var GRAY = '#B8C0CA';

// ─── Annual series (FY) — 2022..2029E. Index 4 (2026) = first estimate. ───────
var YEARS    = ['2022','2023','2024','2025','2026E','2027E','2028E','2029E'];
var FIRST_EST = 4;
var A_GB     = [12057.3, 13775.1, 16099.4, 18507.1, 21785.1, 24822.6, 26768.6, 28604.0]; // gross bookings ($M)
var A_REV    = [4095.1, 4403.6, 5786.0, 6316.3, 7372.7, 8219.3, 8844.8, 9434.9];          // revenue ($M)
var A_EBITDA = [-416.5, 222.3, 382.4, 528.9, 691.1, 829.8, 995.7, 1016.3];                // adj. EBITDA ($M)
var A_RIDES  = [598.5, 709.1, 828.2, 945.5, 1027.4, 1131.3, 1226.2, 1316.8];              // rides (millions)
var A_RIDERS = [20.4, 22.4, 24.7, 29.2, 33.0, 36.3, 39.6, 42.7];                          // active riders (millions)
var A_TAKE   = [34.0, 32.0, 35.9, 34.1, 33.8, 33.1, 33.0, 33.0];                          // revenue ÷ bookings (%)

// ─── Quarterly ACTUALS (1Q23..1Q26) — drives the unit-economics decomposition ─
var UE_Q     = ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var UE_RIDES = [153.0,177.9,187.4,190.8,187.7,205.3,216.7,218.5,218.4,234.8,248.8,243.5,236.9];
var UE_GB    = [3050.7,3446.0,3554.1,3724.3,3693.2,4018.9,4108.4,4278.9,4162.4,4490.1,4780.4,5074.2,4946.0];
var UE_REV   = [1000.6,1020.9,1157.5,1224.6,1277.2,1435.8,1522.7,1550.3,1450.2,1588.2,1685.2,1760.7,1650.5];
var UE_COGS  = [549.0,606.6,644.5,743.9,755.4,819.5,888.3,874.6,862.9,935.7,927.2,971.8,864.1];
// Per-ride (revenue is reported NET of driver pay → GB − Rev ≈ amount to drivers).
function perRide(num){ return num.map(function(v,i){ return v / UE_RIDES[i]; }); }
var PR_DRIVER = UE_GB.map(function(g,i){ return (g - UE_REV[i]) / UE_RIDES[i]; }); // driver pay $/ride
var PR_COR    = perRide(UE_COGS);                                                  // cost of revenue $/ride
var PR_GP     = UE_REV.map(function(r,i){ return (r - UE_COGS[i]) / UE_RIDES[i]; }); // gross profit $/ride
var PR_GB     = perRide(UE_GB);                                                    // bookings $/ride
var PR_REV    = perRide(UE_REV);                                                   // revenue $/ride (net)

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: LYFT'],
  ['Founded', '2012 — San Francisco'],
  ['IPO', 'Mar 2019 · $72.00'],
  ['CEO', 'David Risher (since 2023)'],
  ['Co-founders', 'Logan Green · John Zimmer'],
  ['Employees', '~3,000'],
];
var DESC = 'Lyft runs a ride-hailing marketplace across the US and Canada — matching riders with drivers in real time — alongside the largest US bikeshare network (Citi Bike, Divvy, Bay Wheels), a fast-growing in-app advertising arm (Lyft Media), and an asset-light platform strategy for autonomous-vehicle partners. In July 2025 it acquired FreeNow to enter European taxi/mobility. The current thesis is profitable growth: shifting mix toward higher-value rides while insurance-cost reform lifts margin.';

// Headline KPIs — FY2025 (latest full year), YoY vs FY2024.
var KPIS = [
  { l:'Gross Bookings', v:'$18.5B',  d:pctStr((A_GB[3]/A_GB[2]-1)*100)+' YoY',      dir:'up' },
  { l:'Revenue',        v:'$6.32B',  d:pctStr((A_REV[3]/A_REV[2]-1)*100)+' YoY',    dir:'up' },
  { l:'Adj. EBITDA',    v:'$529M',   d:pctStr((A_EBITDA[3]/A_EBITDA[2]-1)*100)+' YoY', dir:'up' },
  { l:'Active Riders',  v:'29.2M',   d:pctStr((A_RIDERS[3]/A_RIDERS[2]-1)*100)+' YoY', dir:'up' },
];
var AS_OF = 'Headline KPIs are FY2025 (year ended Dec 31, 2025). Latest reported quarter is Q1 2026 — $4.95B bookings (+19% YoY), $1.65B revenue (+14%), 236.9M rides (+8.5%), 28.3M active riders (+17%), $133M Adj. EBITDA (+25%), and a record ~$1.12B TTM free cash flow.';
var FY_NOTE = 'FY2025: record 945.5M rides (+14%), $18.5B bookings (+15%), $529M Adj. EBITDA (+38%), >$1B free cash flow. GAAP net income was $2.84B, but that includes a ~$2.9B one-time non-cash deferred-tax benefit — so Adj. EBITDA and FCF are the cleaner profit signals (FY2024 was the first full-year GAAP profit). Forward years (2026E–2029E) are Summit DCF estimates.';


// Lyft reports ONE segment (consolidated); these are revenue *sources*, not GAAP segments. Each is shown with its driver.
var SEGMENTS = [
  ['Rideshare (core)', '<b>Driver: rides × bookings/ride × take rate.</b> The real-time US/Canada marketplace and the vast majority of revenue. Rides come from active riders × frequency; bookings/ride from mix (airport, long-distance, premium); Lyft keeps ~33% net after driver pay. This is the whole engine.'],
  ['Lyft Media (ads)', '<b>Driver: riders × ad load × CPM.</b> In-app, in-car tablet and bikeshare-station advertising (~$100M annualized run-rate). High-margin revenue that scales with <i>riders</i>, not driver cost — a structural margin lever (advertisers: McDonald\'s, Sephora, Google).'],
  ['Bikes & Scooters', '<b>Driver: stations × utilization × season.</b> Citi Bike (NYC), Divvy (Chicago), Bay Wheels (SF) — the largest US bikeshare network. <b>Growing</b> (Citi Bike 46M+ rides in 2025, e-bikes ~70% of trips), but highly seasonal (summer peak).'],
  ['Autonomous (AV)', '<b>Driver: partner fleets on the network.</b> Asset-light "hybrid": Waymo (Nashville), May Mobility (Atlanta, live), Baidu, Mobileye, Tensor deploy fleets; Lyft supplies demand + fleet ops rather than owning cars — same hybrid logic as Uber.'],
  ['FreeNow (Europe)', '<b>Driver: new geography.</b> Acquired Jul 2025 (~$197M / €175M) — a European taxi / multi-mobility app across ~9 countries; ~€1B annualized run-rate. Lyft\'s first move outside North America; one-app integration planned for 2027.'],
  ['Lyft Rentals — wound down', '<b>Not a growth line — already gone.</b> The rider-facing car-rental product was <b>shut down in 2022 and discontinued by ~2023</b>; it is not a meaningful disclosed line today. <i>Do not confuse</i> it with <b>Express Drive / Flexdrive</b> (car rentals <i>for drivers</i>), which continues. So "Rentals losing share / may not be reported" is correct — for riders it effectively already isn\'t.'],
];

// Timeline with optional modal detail (`d`).
var TIMELINE = [
  { y:'2007', t:'Logan Green and John Zimmer found <b>Zimride</b>, a long-distance carpooling service.' },
  { y:'2012', t:'<b>Lyft launches</b> (the pink mustache) — on-demand short rides in San Francisco.' },
  { y:'Mar 2019', t:'<b>IPO</b> on Nasdaq at $72.00 — first of the major ride-hailing companies to go public.',
    d:'Lyft priced its IPO at <b>$72.00/share</b> in March 2019, just ahead of Uber. The stock has spent most of its public life well below the IPO price as the company pivoted from growth-at-all-costs to profitability. The independent-contractor driver model — central to its cost structure — would be challenged almost immediately by California\'s AB5.' },
  { y:'2020', t:'COVID collapses rides; California <b>Prop 22</b> passes (58.6%), preserving the contractor model.',
    d:'Rides cratered during COVID lockdowns. In November 2020 California voters passed <b>Proposition 22</b> (58.6% yes), carving app-based drivers out of AB5 — they stay independent contractors but receive an earnings floor, mileage reimbursement and a healthcare stipend. This was existential: full employee reclassification would have upended Lyft\'s cost model. The law was challenged in court (<i>Castellanos</i>) and ultimately <b>upheld by the California Supreme Court in July 2024</b>.' },
  { y:'2021', t:'Sells its self-driving unit <b>(Level 5)</b> to Toyota\'s Woven Planet — pivot to an asset-light AV-partner model.',
    d:'Rather than spend billions building its own autonomous stack, Lyft sold <b>Level 5</b> to Toyota\'s Woven Planet (~$550M) and chose to be the <b>demand and fleet-operations layer</b> for third-party AV developers. That decision frames today\'s AV strategy — partnerships with Waymo, May Mobility, Baidu, Mobileye and Tensor rather than a capital-intensive owned fleet.' },
  { y:'Apr 2023', t:'<b>David Risher</b> becomes CEO; turnaround on price competitiveness, reliability and cost.',
    d:'Co-founders Green and Zimmer stepped back; <b>David Risher</b> (ex-Amazon, ex-Microsoft, founder of nonprofit Worldreader) took over as CEO in April 2023. His turnaround focused on rider experience (price parity with Uber, faster pickups, no "prime time" surprises), driver earnings commitments, and a hard pivot to free-cash-flow generation. Adjusted EBITDA and FCF inflected positive under his tenure.' },
  { y:'Jun 2024', t:'<b>First Investor Day</b> sets 2027 targets: ~15% bookings CAGR, ~4% Adj. EBITDA margin, &gt;90% FCF conversion.',
    d:'At its <b>first-ever Investor Day (June 6, 2024)</b>, Lyft issued 2027 medium-term targets: a <b>~15% Gross Bookings CAGR</b> (2024–2027), an <b>Adjusted EBITDA margin of ~4% of Gross Bookings</b> by 2027 (from ~2% in 2024), and <b>free-cash-flow conversion &gt;90% of Adj. EBITDA</b> each year 2025–2027. (Note: a February 2024 earnings call — not the Investor Day — was the source of an embarrassing margin-guidance typo, often confused with this event.)' },
  { y:'2025', t:'Signs <b>AV partnerships</b> (Waymo, May Mobility, Baidu, Mobileye, Tensor); acquires <b>FreeNow</b> (Europe); $500M buyback.',
    d:'A pivotal year: a wave of <b>AV partnerships</b> (Waymo→Nashville, May Mobility→Atlanta, Baidu→Europe, Mobileye/Benteler shuttles, Tensor "Lyft-ready" cars, NVIDIA DRIVE), the <b>FreeNow acquisition</b> (closed July 31, 2025, ~$197M / €175M) opening ~9 European countries, and a <b>$500M buyback</b> authorization. Lyft also signed/extended consumer partnerships (DoorDash, Chase Sapphire through 2027, United Airlines).' },
];

var PEERS = [
  ['Uber', 'Global super-app — rides + delivery + ads + freight; ~3–4× Lyft\'s US rides and structurally more profitable.', 'Uber holds ~70%+ of US rides; Lyft ~24–29%. Same ~30% take, so the gap is <b>scale and cross-sell</b>, not pricing. Lyft\'s counter: price/reliability parity, driver experience, and a tighter US focus. It cannot match Uber\'s Eats-funded CAC.'],
  ['Waymo (Lyft)', 'Robotaxi operator, live in several US cities.', 'Threat <i>and</i> partner — Lyft hosts third-party AV fleets (Waymo→Nashville) on its network rather than building its own. Same asset-light hybrid bet as Uber, but Lyft has less demand density to offer fleets.'],
  ['DoorDash', 'US delivery leader.', 'Adjacent, not head-to-head — now a <b>partner</b>. DoorDash users are high-frequency Lyft riders; the partnership skews Lyft\'s mix toward higher-value trips.'],
  ['Bolt / FreeNow', 'European mobility apps.', 'Lyft now competes here <b>directly</b> via FreeNow (Jul 2025) — but as a new, sub-scale entrant against incumbents, with EU gig-regulation exposure it didn\'t have before.'],
];
var PEER_NOTE='The structural reality: <b>Lyft is the US-concentrated #2</b> in a duopoly. It has no take-rate edge and far less scale than Uber, so its thesis rests on <b>profitable-growth discipline</b> (mix up, insurance cost down) rather than winning share. Its sharpest single risk is also its concentration — <b>US driver regulation</b> hits Lyft harder than its global peer (see Regulation).';

var TAILWINDS = [
  '<b>Insurance cost reform</b> — SB 371 + captive execution keep cutting cost per ride. <i>The single biggest margin lever</i> — the entire 2025–26 gross-margin story.',
  '<b>Up-market mix + partnerships</b> — higher-value rides (+35–50%) and a record 27% partnership mix lift bookings/ride, defending growth <i>without</i> cutting price.',
  '<b>Self-funding turnaround</b> — &gt;$1B FCF now funds a $500M buyback. The model finally pays for itself.',
];
var HEADWINDS = [
  '<b>AV disruption</b> — Waymo can pressure pricing in the dense urban cores where Lyft\'s economics are <i>best</i>. The biggest structural unknown.',
  '<b>Ride-count deceleration</b> — volume growth is slowing (Q1\'26 +8.5%). If the up-market mix also tops out, the ~15% bookings CAGR gets hard.',
  '<b>US-concentrated regulatory cost</b> — pay floors (NYC/MN/Seattle) + the first US rideshare union (MA) raise cost, and hit Lyft harder than its global peer.',
];

// ── Strategy: 2027 targets (June 2024 Investor Day) ──
var TARGETS = [
  { v:'~15%',  l:'Gross Bookings CAGR', s:'2024–2027 (≈ $25B bookings by 2027).' },
  { v:'~4%',   l:'Adj. EBITDA margin',  s:'Of Gross Bookings by 2027 (from ~2% in 2024).' },
  { v:'>90%',  l:'FCF conversion',      s:'Of Adj. EBITDA, each year 2025–2027.' },
];
// Clickable initiative cards: teaser on the card, full story in a modal (key = `init:<k>`).
var INITIATIVES = [
  { k:'highvalue', t:'Higher-value rides', teaser:'Airport, long-distance, premium, Price Lock.',
    d:'<b>Mix over volume.</b> High-value modes (airport, longer trips, premium, Price Lock) grew ~<b>50% YoY in Q4\'25</b> and ~<b>35% YoY in Q1\'26</b> — well ahead of total rides — lifting bookings and profit per ride. This is the deliberate up-market tilt at the centre of the profitable-growth thesis.' },
  { k:'media', t:'Lyft Media (ads)', teaser:'~$100M run-rate; scales with riders, not driver cost.',
    d:'<b>High-margin and structural.</b> ~$100M annualized run-rate; in-app, in-car tablet and bikeshare advertising (advertisers: McDonald\'s, Sephora, Google, Adobe). Because it scales with riders rather than driver cost, every incremental ad dollar is near-pure margin — a genuine lever, even if small today.' },
  { k:'av', t:'Autonomous (AV)', teaser:'Asset-light hybrid network of AV partners.',
    d:'<b>Host fleets, don\'t build them.</b> Waymo (Nashville), May Mobility (Atlanta, live), Baidu Apollo Go (Europe), Mobileye/Benteler shuttles, Tensor "Lyft-ready" cars, NVIDIA DRIVE. Lyft supplies demand + fleet operations — the same hybrid logic as Uber, but from a smaller demand base.' },
  { k:'freenow', t:'FreeNow (Europe)', teaser:'~$197M; first move outside North America.',
    d:'<b>Step-change in addressable market.</b> Acquired Jul 31 2025 (~$197M / €175M); ~€1B annualized run-rate across ~9 European countries. Unified into one Lyft app experience planned for 2027. Adds growth — and EU gig-regulation exposure Lyft didn\'t previously carry.' },
  { k:'partners', t:'Partnerships', teaser:'Record 27% of rides — DoorDash, Chase, United.',
    d:'<b>Demand from other people\'s users.</b> DoorDash (high-frequency riders), Chase Sapphire (extended to 2027: $10/mo credit, 5× points), United Airlines (more business riders, higher bookings/ride). <b>Partnership rides hit a record 27% of total</b> — a low-CAC channel that also skews mix upward.' },
  { k:'pricelock', t:'Price Lock & Lyft Silver', teaser:'Frequency & retention plays.',
    d:'<b>Habit and accessibility.</b> Price Lock (a subscription that locks a commute price; early, management calls it "promising") targets commuter frequency; Lyft Silver simplifies the app for older riders. Both aim to lift frequency and retention rather than headline acquisition.' },
];

// ── Insurance — legacy-risk transfers (loss portfolio transfers): sells the matured "tail" to run-off specialists. ──
var RISK_XFER = [
  ['Mar 2020', 'Enstar', '~$465M legacy reserves (Oct 2015–Sep 2018) reinsured.'],
  ['Apr 2021', 'DARAG', 'Quota-share on the Oct 2018–Oct 2020 book.'],
  ['Feb 2025', 'RiverStone', 'Loss Portfolio Transfer: $120.5M limit / $85.1M premium, covering Oct 2020–Sep 2022.'],
];

// ── Gross-margin: structural vs. one-time ──
var GM_STRUCT = [
  'Q1 2026 gross margin hit <b>47.6%</b> (+~710 bps YoY); cost of revenue was <b>flat YoY</b> ($864M) despite bookings +19% — a genuine <b>per-ride cost decline</b>, not a one-quarter item.',
  'Drivers named are <b>regulatory reform (CA SB 371) + insurance-strategy execution</b> — structural levers, not a one-time reserve release.',
  'Insurance renewals land in <b>October, not Q1</b> — so the Q1 lift is <i>not</i> a renewal-timing artifact.',
  'Management reaffirmed the <b>~4% Adj. EBITDA / bookings target for 2027</b>.',
];
var GM_CAUTION = [
  'The YoY base is flattering: <b>Q1 2025 carried a "prior-year nonrecurring benefit,"</b> and management called Q1 2026 profitability roughly <b>"in line"</b> after adjusting for it.',
  '<b>Adj. EBITDA margin rose only ~10 bps</b> (2.6%→2.7% of bookings) even as gross margin jumped ~710 bps — much of the gross delta is base-effect or reinvested (FreeNow/AV/marketing).',
  'The Q1 2026 10-Q <b>does not break out prior-period reserve development</b> — a favorable-reserve component can\'t be confirmed or ruled out.',
  'CFO framing: margin expansion will be <b>"gradual."</b> No analyst on the call directly pressed insurance-margin durability.',
];

// ── Regulation & driver classification ──
var REG = [
  { h:'California', chip:'CONTAINED', cls:'g', teaser:'Prop 22 upheld unanimously (2024); SB 371 even cut insurance mandates.',
    d:'AB5 (2020) threatened to make drivers employees. <b>Prop 22</b> (Nov 2020) carved them out as contractors with a pay floor; the <b>California Supreme Court upheld it unanimously in July 2024</b> (<i>Castellanos</i>). The state legal challenge is exhausted — and <b>SB 371</b> (Jan 2026) even cut insurance-coverage mandates, a cost tailwind.' },
  { h:'Massachusetts', chip:'FIRST UNION', cls:'a', teaser:'$32.50/hr floor + the first US rideshare union, certified May 2026.',
    d:'A June 2024 AG settlement keeps drivers as contractors but adds a <b>$32.50/hr engaged-time floor</b> + benefits (companies paid <b>$175M</b>). Ballot <b>Question 3 passed (Nov 2024)</b> gave drivers the right to unionize — and in <b>May 2026 the App Drivers Union was certified</b>, the first US rideshare union. First-contract bargaining is the new watch item.' },
  { h:'MN · NYC · Seattle', chip:'PAY FLOORS', cls:'a', teaser:'Per-mile/minute floors raise cost but keep contractor status.',
    d:'<b>Minnesota</b> (statewide, Dec 2024): <b>$1.28/mi + $0.31/min</b> engaged, $5 min/ride. <b>NYC</b> TLC: per-trip minimum <b>+5% (Aug 2025)</b> with new lockout protections. <b>Seattle/WA</b>: <b>$0.70/min + $1.63/mile</b>, $6.12 min (Jan 2026). All keep contractor status but raise cost.' },
  { h:'Federal', chip:'TAILWIND', cls:'g', teaser:'DOL contractor rule unenforced, proposed for rescission.',
    d:'The 2024 Biden-era DOL independent-contractor rule is on the books but <b>unenforced since May 2025</b>, and the DOL <b>proposed rescinding it (Feb 2026)</b> toward a business-favorable two-factor test. FLSA classification does not preempt state ABC tests / wage floors, so it caps — not removes — risk.' },
  { h:'Europe (via FreeNow)', chip:'NEW RISK', cls:'a', teaser:'EU Platform Directive + UK "workers" — new exposure since FreeNow.',
    d:'The <b>EU Platform Work Directive</b> (transpose by Dec 2026) creates a rebuttable employment presumption; the UK already treats drivers as "workers" (<i>Aslam</i>). New exposure now that Lyft owns FreeNow.' },
  { h:'How Lyft frames it', chip:'10-K', cls:'g', teaser:'Reclassification loss "cannot be reasonably estimated" — no figure disclosed.',
    d:'The 10-K says reclassification could force it to "significantly alter" its model or exit jurisdictions — but states the possible loss <b>"cannot be reasonably estimated."</b> No dollar figure is disclosed.' },
];

var SOURCES = 'Quantitative series: Summit DCF model, snapshot 2026-05-13 (actuals_history = reported; projection_history = model estimate). Per-ride figures are derived (revenue is reported net of driver pay, so Gross Bookings − Revenue ≈ amount to drivers). Qualitative content: Lyft FY2024 & FY2025 Forms 10-K, Q1 2026 Form 10-Q, the June 6 2024 Investor Day, and Q3 2025 / Q4 2025 / Q1 2026 earnings calls & prepared remarks; California SB 371; CA Supreme Court Prop 22 ruling (Jul 2024). Forward years (2026E–2029E) are model estimates, not company guidance. Brand colors approximate Lyft\'s press-kit pink/purple.';

// ─── How Lyft makes money: interactive per-ride chain ─────────────────────────
var RIDE_FLOW=[
  { img:'step-request.jpg', t:'Rider requests & sees an upfront price', d:'Lyft shows an <b>upfront, all-in price</b> before the rider confirms. Lyft controls pricing (mix, Price Lock subscriptions), which shapes the take rate trip-by-trip.' },
  { img:'step-pay.jpg', t:'Trip happens; rider pays the full fare', d:'Payment is <b>card / digital wallet</b>. Lyft collects the entire <b>Gross Bookings</b> amount (fare + fees). Revenue is then reported <i>net of driver pay</i>, which is what makes the headline "take rate" optics tricky (see Unit Economics).' },
  { img:'step-driver.jpg', t:'Driver keeps their pay (≥70% commitment)', d:'Since Feb 2024 Lyft <b>guarantees drivers at least 70%</b> of rider payments each week (after external fees), capping Lyft\'s economic take ~30%. <b>Timing:</b> weekly by default, or <b>Express Pay</b> instant cashout for a small fee.' },
  { img:'step-take.jpg', t:'Lyft keeps the spread + rider fees', d:'Lyft\'s <b>revenue</b> is the marketplace spread plus rider service fees — roughly <b>33% of bookings</b>. From here, the question is how much survives cost of revenue.' },
  { img:'step-insurance.jpg', t:'Cost of revenue — mostly insurance', d:'The biggest cost slice is <b>auto insurance</b> (plus payment processing and hosting). Insurance is the <b>swing factor</b>: as cost per ride falls, gross profit per ride expands. It doesn\'t get its own income-statement line — it shows up in the <i>change</i> in cost of revenue.', payoff:false },
  { img:'step-cash.jpg', t:'What\'s left is gross profit', d:'Gross profit is ~<b>$3.32 / ride</b> (Q1 2026) — ~16% of bookings, ~48% of revenue. The 2025–26 margin story is <b>not</b> a higher take rate; it\'s a <b>lower insurance cost per ride</b>.', payoff:true },
];
// Per-ride marketplace split (Q1 2026: bookings/ride ≈ $20.88).
var RIDE_SPLIT=[
  ['Driver pay', 67, '$13.91', GRAY],
  ['Cost of revenue (insurance + processing)', 17, '$3.65', EST_FILL],
  ['Lyft gross profit', 16, '$3.32', BRAND],
];

// ─── Take-rate anomaly: why "revenue ÷ bookings" is misleading ─────────────────
var TAKE_EXPL='<b>The line is plotted correctly — but the metric is misleading.</b> Lyft\'s real economic cut is ~30% (capped by the 70% driver-earnings commitment); the zig-zag is an <b>accounting-presentation</b> effect, not Lyft taking a bigger slice:'+
  '<ul class="ov-bullets" style="margin-top:8px">'+
  '<li><b>2023 → 32% (down): real.</b> The Uber/Lyft price war — fare cuts, less Prime Time, a new driver earnings floor — are contra-revenue. Revenue +8% vs bookings +14%.</li>'+
  '<li><b>2024 → 35.9% (up): mostly presentation.</b> The Feb 2024 <b>70% driver-earnings commitment</b> moved certain markets to <b>gross-basis</b> reporting (driver fares booked in <i>both</i> revenue and cost of revenue), and <b>Lyft Media</b> ads grew ~250% (revenue with no offsetting booking). Revenue +31% vs bookings +17% — the gross-up fingerprint.</li>'+
  '<li><b>2025 → 34.1% (ease): a one-off.</b> FY2025 revenue carries a ~<b>$168M</b> legal/tax/regulatory reserve & settlement drag; ex-item, take rate would have held ~35%.</li>'+
  '</ul><b>Net:</b> the 2024 step-up is an accounting artifact, not a structural change in Lyft\'s cut. Watch <b>gross profit per ride</b>, not take rate.';

// ─── Cost of revenue: the Q4'25 → Q1'26 drop ──────────────────────────────────
var COGS_NOTE='Cost of revenue fell from ~<b>$971.8M (Q4 2025)</b> to ~<b>$864.1M (Q1 2026)</b> even with bookings strong (+19% YoY) — and it looks <b>structural</b>, not a one-off:'+
  '<ul class="ov-bullets" style="margin-top:8px">'+
  '<li><b>Cause — lower insurance cost per ride.</b> California <b>SB 371</b> (effective Jan 1 2026) cut mandated uninsured/under-insured coverage from <b>$1M → $60k/$300k</b>, plus insurance-strategy execution. CFO Erin Brewer: gross-margin expansion "driven by a <b>reduction in our average insurance cost per ride</b>."</li>'+
  '<li><b>Not a reserve release.</b> Insurance reserves actually <i>rose</i> ($2,180.4M → $2,245.0M) — the opposite of a release.</li>'+
  '<li><b>Seasonality is secondary</b> — lower Q1 bikes/FreeNow and ~3M rides lost to weather.</li>'+
  '</ul>Result: Q1 2026 gross margin <b>47.6%</b> (+~710 bps YoY) — though the YoY base was flattered by a prior-year benefit (see the structural-vs-one-time debate below).';

// ─── Lyft insurance: the captive (PVIC) cycle ─────────────────────────────────
var PVIC_CHAIN=[
  { t:'Rider funds insurance in the fare', d:'Auto insurance is required on every ride; the cost is embedded in the fare — but it never gets its own income-statement line, so it shows up inside <b>cost of revenue</b>.' },
  { t:'Lyft buys coverage from third-party carriers', d:'Lyft\'s main third-party insurance program <b>renews each October 1</b>. The Oct 2025 renewal landed at a <b>mid-single-digit</b> per-ride increase — management called it "a great outcome."' },
  { t:'Its captive (PVIC, Hawaii) reinsures part of the risk', d:'Lyft runs a <b>captive insurer — Pacific Valley Insurance Company</b> — that reinsures a portion of auto risk back from the carriers, funding trust accounts from which insurers are reimbursed for claims. Keeping risk in-house captures underwriting economics.', payoff:false },
  { t:'Reserves are set quarterly (a Critical Audit Matter)', d:'Reserves are set via actuarial loss-development factors and reached <b>$2.18B</b> at year-end 2025 (+28% YoY) — Lyft\'s largest liability. The estimate\'s sensitivity makes it a <b>Critical Audit Matter</b>.' },
  { t:'Mature "tail" is sold to run-off specialists', d:'Periodically Lyft sells the matured loss "tail" via <b>Loss Portfolio Transfers</b> (Enstar 2020, DARAG 2021, RiverStone Feb 2025) — moving old liabilities off the balance sheet and smoothing volatility.', payoff:true },
];

// ─── M&A — terms & what each deal added (clickable cards, key = `mna:<n>`) ─────
var MNA=[
  { n:'Motivate', val:'the US bikeshare leader &mdash; Citi Bike alone does <b>46M+ rides a year</b>', fp:'Created the <b>bikeshare business</b> — Citi Bike alone did 46M+ rides in 2025; a non-rideshare revenue leg.', y:'2018', deal:'~$250M', terms:'cash (est.)', own:'Operating', cat:'Bikeshare', big:true,
    detail:'<b>Terms:</b> ~$250M (press estimate — never confirmed by Lyft); closed late 2018.<br><br><b>What it added:</b> the largest US bikeshare operator — <b>Citi Bike, Divvy, Bay Wheels</b> and more.<br><br><b>Status:</b> still operating (Lyft explored a sale ~2023 at a ~$500M valuation but retained it). Citi Bike did 46M+ rides in 2025.' },
  { n:'Halo Cars', val:'<b>Lyft Media</b> &mdash; a ~<b>$100M</b>, ~100%-margin ad business, from an undisclosed deal', fp:'<b>Seeded Lyft Media</b> — now a ~<b>$100M run-rate</b> ad business at ~100% margin; the highest-margin growth engine.', y:'2020', deal:'undisclosed', terms:'—', own:'Integrated', cat:'Advertising',
    detail:'<b>Terms:</b> undisclosed (Feb 2020).<br><br><b>What it added:</b> car-top digital advertising — the seed of <b>Lyft Media</b>.<br><br><b>Status:</b> integrated; Lyft Media is now ~$100M run-rate.' },
  { n:'Flexdrive', val:'the <b>Express Drive</b> fleet that keeps driver supply flexible', fp:'The fleet behind <b>Express Drive</b> — driver car rentals that expand driver supply.', y:'2020', deal:'~$20M', terms:'cash + leases', own:'Integrated', cat:'Driver rentals',
    detail:'<b>Terms:</b> ~$20M cash + assumed vehicle leases (Feb 2020).<br><br><b>What it added:</b> the fleet that powers <b>Express Drive</b> — car rentals <i>for drivers</i> (not riders).<br><br><b>Status:</b> integrated subsidiary; ongoing.' },
  { n:'PBSC Urban Solutions', val:'<b>Lyft Urban Solutions</b> &mdash; a global B2B bikeshare-tech line', fp:'Bikeshare <b>hardware & tech</b> (~95k bikes) → <b>Lyft Urban Solutions</b>, a B2B revenue line.', y:'2022', deal:'~$160M', terms:'cash', own:'Integrated', cat:'Bikeshare tech',
    detail:'<b>Terms:</b> ~$160M (May 2022).<br><br><b>What it added:</b> bikeshare <b>hardware & technology</b> (~95k bikes deployed globally).<br><br><b>Status:</b> integrated as <b>Lyft Urban Solutions</b>.' },
  { n:'FreeNow', val:'Lyft&rsquo;s entire <b>international</b> footprint (~&euro;1B run-rate)', fp:'The <b>first revenue outside North America</b> — European taxi and multimodal, ~<b>€1B annualized</b>.', y:'2025', deal:'~$197M', terms:'cash (€175M)', own:'Operating', cat:'Europe', big:true,
    detail:'<b>Terms:</b> ~$197M / €175M; closed Jul 31 2025.<br><br><b>What it added:</b> a European taxi / multi-mobility app across ~9 countries — Lyft\'s <b>first expansion outside North America</b>; ~€1B annualized run-rate.<br><br><b>Status:</b> operating/integrating; one-app experience planned for 2027.' },
];

// ─── Render helpers (shared overview.css classes) ─────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join(''); }
// Numbered, optionally-clickable step chain (shared .ov-chain). detailKey → data-detail="<key>:<i>".
function chain(arr, detailKey){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(detailKey?' ov-clickable':'');
  var attr=detailKey?' data-detail="'+detailKey+':'+i+'"':'';
  var more=detailKey?' <span class="ov-tl-more">tap ›</span>':'';
  var thumb='';
  return '<div class="'+cls+'"'+attr+'>'+thumb+'<div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }
// Horizontal proportion bars (shared .ov-mbars). rows = [label, pct, valueLabel, color].
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
// M&A cards (shared .ov-cards-mna), key = `mna:<n>`.
function mnaTimeline(){
  var DIV=[
    {y:'2021', n:'Self-driving (Level 5) → Toyota', fp:'Sold the <b>self-driving unit</b> — chose to be the asset-light demand + fleet-ops layer for 3rd-party AV, not build the car. Kept heavy <b>R&D burn off the P&L</b> — part of what made the FCF turnaround possible.', big:true}
  ];
  var acq=MNA.slice().sort(function(a,b){ return (+String(a.y).replace(/\D/g,''))-(+String(b.y).replace(/\D/g,'')); });
  var h='<style>'+
    '.mnt-h2{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin:14px 0 8px}.mnt-h2.acq{color:#c0006a}.mnt-h2.dv{color:#2E6BE6}'+
    '.mnt-rail{display:flex;flex-wrap:wrap;gap:9px}'+
    '.mnt-chip{flex:1;min-width:158px;max-width:250px;border:1px solid var(--bdr);border-radius:11px;padding:10px 12px;background:#fff}'+
    '.mnt-chip.acq{border-top:3px solid #E6007A}.mnt-chip.dv{border-top:3px solid #2E6BE6}'+
    '.mnt-chip.acq.ov-clickable{cursor:pointer;transition:.15s}.mnt-chip.acq.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.mnt-chip.big{box-shadow:0 0 0 2px rgba(46,107,230,.16)}'+
    '.mnt-top{display:flex;justify-content:space-between;align-items:center;gap:6px}'+
    '.mnt-yr{font-size:11px;font-weight:800;color:var(--navy)}.mnt-cat{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:var(--mu);background:#eef2f7;border-radius:10px;padding:1px 7px}'+
    '.mnt-n{font-size:12.5px;font-weight:800;color:var(--navy);margin:5px 0 4px}'+
    '.mnt-fp{font-size:11px;color:var(--navy);line-height:1.45}.mnt-fp b{font-weight:800}'+
    '.mnt-val{font-size:10.5px;font-weight:700;color:#0a8f0a;background:rgba(10,143,10,0.07);border-radius:7px;padding:6px 9px;margin-top:7px;line-height:1.4}.mnt-val b{font-weight:800}'+
    '.mnt-more{font-size:10px;color:#c0006a;font-weight:700;margin-top:6px}'+
    '.mnt-axis{text-align:center;font-size:11.5px;color:var(--navy);background:linear-gradient(90deg,transparent,rgba(230,0,122,.08),transparent);border-top:1px dashed var(--bdr);border-bottom:1px dashed var(--bdr);padding:9px;margin:14px 0}.mnt-axis b{font-weight:800}.mnt-star{color:#E8A00C}'+
    '.mnt-punch{font-size:11.5px;color:var(--navy);line-height:1.6;background:#f6f8fa;border-left:3px solid #E6007A;border-radius:8px;padding:11px 14px;margin-top:14px}.mnt-punch b{font-weight:800}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 4px">Lyft used M&A to build everything <b>beyond the ride</b> — and one decisive divestiture to stay asset-light. <b>Tap any acquisition</b> for terms.</div>';
  h+='<div class="mnt-h2 acq">↑ Acquisitions — what they <b>added</b> to the financials</div>';
  h+='<div class="mnt-rail">'+acq.map(function(m){
    return '<div class="mnt-chip acq ov-clickable" data-detail="mna:'+esc(m.n)+'">'+
      '<div class="mnt-top"><span class="mnt-yr">'+esc(m.y)+'</span><span class="mnt-cat">'+esc(m.cat)+'</span></div>'+
      '<div class="mnt-n">'+esc(m.n)+'</div><div class="mnt-fp">'+(m.fp||'')+'</div>'+(m.val?'<div class="mnt-val">→ Worth today: '+m.val+'</div>':'')+'<div class="mnt-more">terms ›</div></div>'; }).join('')+'</div>';
  h+='<div class="mnt-axis"><span class="mnt-star">★</span> 2024–25 — first full-year profit for Lyft and a record <b>$1.1B free cash flow</b>, where the asset-light bet pays off</div>';
  h+='<div class="mnt-h2 dv">↓ Divestiture — what it <b>shed</b> → asset-light discipline</div>';
  h+='<div class="mnt-rail">'+DIV.map(function(d){
    return '<div class="mnt-chip dv'+(d.big?' big':'')+'"><div class="mnt-top"><span class="mnt-yr">'+esc(d.y)+'</span></div>'+
      '<div class="mnt-n">'+d.n+'</div><div class="mnt-fp">'+d.fp+'</div></div>'; }).join('')+'</div>';
  h+='<div class="mnt-punch"><b>The value-add, in one line:</b> a <b>tiny ad-tech deal (Halo Cars)</b> became a <b>$100M business</b>, a bikeshare buy became <b>Citi Bike + a B2B tech line</b>, and <b>FreeNow is all of Europe</b> — the higher-margin &ldquo;beyond the ride&rdquo; engines now carrying the margin and growth story. Meanwhile <b>selling Level 5</b> kept billions of AV R&D off the P&L — the discipline behind the first profit and $1.1B FCF. (Waymo, May Mobility, Baidu are <b>partnerships, not acquisitions</b>.)</div>';
  return h;
}
// Dual-handle year slider (fill goes INSIDE the track — otherwise it renders as a solid block).
function rangeSlider(key, maxI, endA, endB){
  return '<div class="sg-controls"><div class="sg-slider">'+
    '<div class="sg-track"><div class="sg-fill" id="'+key+'Fill"></div></div>'+
    '<input type="range" id="'+key+'Min" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start">'+
    '<input type="range" id="'+key+'Max" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End">'+
    '</div><div class="sg-ends"><span>'+esc(endA)+'</span><span>'+esc(endB)+'</span></div>'+
    '<div class="sg-readout" id="'+key+'Readout"></div></div>';
}

// ─── Earnings Narrative: theme-based across 10 calls (Q4 2023 → Q1 2026) ────
var LY_THEMES = [
  { theme:'Higher-Value Rides & Mix Shift',
    why:'The core thesis: ride-count growth is decelerating (S-curve), so Lyft needs revenue per ride to carry the growth story. If mix shift stalls or is just weather/seasonal, the thesis weakens.',
    updates:[
      { q:'Q2 2024', items:['<b>Price Lock</b> launched \u2014 "removing rideshare\u2019s most hated feature." Converts commuters into locked-in, high-frequency users.','First <b>GAAP profitability</b> in company history.'] },
      { q:'Q4 2024', items:['Market share <b>highest since 2022</b> and rising. ETAs faster than both the main competitor and newer entrants.','$500M buyback authorized \u2014 first significant shareholder-return program.'] },
      { q:'Q3 2025', items:['<b>TBR Global</b> chauffeuring acquired \u2014 entry into the $54B executive ground transport segment, 3,000 cities globally.','SB371 framed as catalyst: <b>$6/ride savings in LA</b>, stimulating demand.'] },
      { q:'Q4 2025', items:['<b>Lyft Teen</b> launched \u2014 teenagers described as "infinitely replenishing" cohort entirely absent from rideshare until now.','Declined to chase every marginal ride \u2014 "disciplined trade-offs" as operating philosophy.'] },
      { q:'Q1 2026', items:['United MileagePlus: <b>350M miles awarded</b>, "Pay with Miles" launched. Partnership strategy shifting from acquisition to retention.'] },
    ]},
  { theme:'AV Strategy \u2014 Asset-Light Hybrid Network',
    why:'Lyft\u2019s survival argument: if AVs disintermediate the driver, the value shifts to whoever aggregates demand + manages fleets. Lyft claims both. The risk: with ~15% US rideshare share vs Uber\u2019s ~70%, AV partners may prefer the larger demand graph.',
    updates:[
      { q:'Q1 2024', items:['AVs explicitly framed as <b>opportunity, not threat</b>. "Building networks \u2260 building AV tech \u2014 the two require different specialists."'] },
      { q:'Q2 2024', items:['Three AV value-chain pillars formalized: <b>demand generation</b> (40M riders), <b>marketplace management</b>, and <b>fleet operations via FlexDrive</b>.'] },
      { q:'Q3 2024', items:['Three <b>simultaneous AV models</b>: Mobileye (tech licensing), Nexar (data/learning), May Mobility (live rides in Atlanta). Not one exclusive deal \u2014 present across the supply chain.'] },
      { q:'Q2 2025', items:['<b>Baidu partnership</b> announced for European AV deployment \u2014 Baidu\u2019s driver-out tech + Lyft\u2019s fleet management + FreeNow\u2019s regulatory relationships. Commercial timeline: 2026.'] },
      { q:'Q3 2025', items:['<b>Waymo partnership</b>: integrated supply management where cars earn regardless of Waymo or Lyft dispatch. Described as the industry\u2019s first true hybrid network model, built to scale beyond Nashville.'] },
      { q:'Q4 2025', items:['AV cost structure disclosed: by 2030, AVs expected <b>~20% cheaper per mile</b> than human-driven. FlexDrive\u2019s fleet management adds incremental efficiency on top.'] },
      { q:'Q1 2026', items:['<b>Gett UK acquired</b> \u2014 70\u201380% of London\u2019s taxi fleets. (Full deal detail, including the London/AV framing, under European Expansion.)'] },
    ]},
  { theme:'Partnerships as Growth Engine',
    why:'27% of rides from partners = real demand that Lyft doesn\u2019t pay to acquire. The Delta loss (~2% of GBs) proved partnerships can walk. The question: does the portfolio compound (more partners \u00d7 deeper penetration) or plateau once the obvious deals are signed?',
    updates:[
      { q:'Q4 2023', items:['~<b>20% of rides</b> already partnership-linked. Delta described as evolving from points-only to full commute infrastructure.'] },
      { q:'Q3 2024', items:['<b>DoorDash partnership</b> announced \u2014 18M DashPass members exposed to Lyft. "Food delivery customers are naturally high-frequency riders."'] },
      { q:'Q1 2025', items:['<b>Delta partnership loss</b> quantified: ~1% rides, ~2% gross bookings. Disclosed transparently before Q2 hit. Commitment to offset via deeper penetration of existing partners.'] },
      { q:'Q2 2025', items:['Partnership rides share grew to <b>27%</b>. United Airlines added as first major airline where miles earned on all rides (not just airport). Competitor\u2019s approach called "photocopy strategy."'] },
      { q:'Q1 2026', items:['27% maintained. <b>"Pay with Miles"</b> launched (United). Partnership strategy described as compounding \u2014 each new partner reaches zero penetration on day one.'] },
    ]},
  { theme:'European Expansion \u2014 FreeNow & Beyond',
    why:'The biggest strategic bet since founding: Lyft went from US-only to a European footprint overnight. The bull case: FreeNow\u2019s taxi-regulator relationships are the AV entry ticket. The bear case: integration drag, EU gig-law exposure, and capital diverted from the US fight vs Uber.',
    updates:[
      { q:'Q1 2025', items:['<b>FreeNow acquisition announced</b> (~\u20ac175M). Framed explicitly around its taxi-first model as a <b>regulatory relationship asset</b> critical for AV expansion, not just geographic diversification.'] },
      { q:'Q2 2025', items:['FreeNow closed. ~\u20ac1B annualized run-rate across ~9 European countries. Baidu partnership announced as the vehicle for European AV deployment.'] },
      { q:'Q1 2026', items:['<b>Gett UK acquired</b> \u2014 70\u201380% of London\u2019s taxi fleets in the Lyft app. London described as critical not just for revenue but as "the proving ground" for European AV regulatory relationships.'] },
    ]},
  { theme:'Insurance Reform & Profitability Discipline',
    why:'Insurance is ~50% of Lyft\u2019s cost of revenue. SB371 cuts mandatory coverage limits in California (Lyft\u2019s largest market) starting Jan 2026 \u2014 management estimates >$6/ride savings in LA alone. If durable, this is the single largest margin lever. If reserves re-inflate, it\u2019s a trap.',
    updates:[
      { q:'Q2 2024', items:['First <b>GAAP profitability</b> in company history \u2014 presented as validation of the "customer obsession" thesis translating into financial discipline.'] },
      { q:'Q4 2024', items:['Lower prices described as a new dynamic \u2014 management argues lower prices drive ride volume and margins can be protected through <b>mix, media, and higher-value modes</b>.'] },
      { q:'Q3 2025', items:['<b>SB371</b> (California insurance reform, eff. Jan 2026): "win-win-win" that would reduce rider prices by <b>>$6 per ride in LA</b>, stimulate demand, and benefit drivers.'] },
      { q:'Q4 2025', items:['Competitor\u2019s "heightened promotional activity" in Q4, but Lyft <b>declined to chase every marginal ride</b> \u2014 framing disciplined trade-offs as a differentiating philosophy.'] },
    ]},
  { theme:'Lyft Media & Platform Identity',
    why:'At ~$100M run-rate vs Uber\u2019s >$2B, Lyft Media is 50\u00d7 smaller \u2014 but it\u2019s near-100% margin and scales with riders, not driver cost. The \u201cAudience Extension\u201d move (off-platform targeting using movement data) is the pivot from ad-format inventory to a data-moat play. If it works, it\u2019s the highest-margin dollar Lyft earns.',
    updates:[
      { q:'Q1 2024', items:['Lyft Media positioned as future margin lever: in-app ads, tablets, car-top panels, bike panels. <b>10\u00d7 industry click-through rates</b>. Long-term aspiration: $500M.'] },
      { q:'Q3 2024', items:['"Serve and connect" introduced as company\u2019s formal purpose. Identity framed not as rideshare platform but as force against physical disconnection.'] },
      { q:'Q1 2026', items:['Lyft Ads on path to <b>$100M run rate by end 2026</b>. <b>"Audience Extension"</b> off-platform capability added \u2014 evolving from format inventory into a data and targeting platform leveraging first-party movement data.'] },
    ]},
];

// Pivot the theme-organized calls into a by-quarter view (mirrors UBER's callsByQuarter).
function callsByQuarter(){
  var map={}, order=[];
  LY_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qval(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qval(b)-qval(a); });
  return { order:order, map:map };
}
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:var(--navy);color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}</style>';
  h+='<p class="ov-lede">The key narrative threads from <b>10 earnings calls</b> (Q4 2023 \u2192 Q1 2026). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered in a given call. Tap any row to expand.</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  // \u2500\u2500 By theme (default) \u2500\u2500
  h+='<div class="lpb-acc" id="lyCallsTheme">';
  LY_THEMES.forEach(function(ct){
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span>'+esc(ct.theme)+'</span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    h+='<p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){
      h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span>';
      h+='<ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  // \u2500\u2500 By quarter \u2500\u2500
  var byQ=callsByQuarter();
  h+='<div class="lpb-acc" id="lyCallsQuarter" style="display:none">';
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
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Lyft Q4 2023\u2013Q1 2026 earnings calls and prepared remarks via Quartr. Highlights are qualitative and contemporaneous \u2014 written from the perspective of each call, not with hindsight.</div>';
  return h;
}

// ─── Supply Chain (Bloomberg SPLC, 29-Jun-2026) ─────────────────────────────
// Lyft's SPLC is deliberately sparse — only 30 suppliers and 5 customers.
// The sparseness itself IS the story: Lyft is a pure B2C marketplace.
var SC_SUPPLIERS = [
  { fn:'\ud83d\ude97 AV Partners', names:'Baidu \u00b7 Mobileye \u00b7 Aptiv \u00b7 Innoviz (LiDAR) \u00b7 Ambarella (vision chips) \u00b7 Curb Mobility',
    note:'The SPLC confirms the multi-partner AV strategy. Baidu for European AV, Mobileye for Lyft Ready tech licensing, Aptiv for hardware. <b>Ambarella ($0.06M)</b> is the only relationship with a disclosed dollar value in the entire SPLC.' },
  { fn:'\u2601\ufe0f Tech & Cloud', names:'Oracle \u00b7 Dell \u00b7 Amazon (AWS) \u00b7 Twilio \u00b7 Elastic \u00b7 Sinch \u00b7 Clickhouse \u00b7 ZoomInfo \u00b7 Calendly',
    note:'Standard SaaS/cloud stack. No disclosed relationship sizes. Oracle and Dell likely the largest contracts.' },
  { fn:'\ud83d\udee1\ufe0f Insurance & Fleet', names:'CSAA Insurance Exchange \u00b7 Hertz \u00b7 EverQuote',
    note:'CSAA is Lyft\u2019s insurance partner (alongside captive PVIC). <b>Hertz</b> powers the FlexDrive rental fleet for drivers. EverQuote for insurance lead generation.' },
  { fn:'\ud83d\udcca Ad Tech & Data', names:'Integral Ad Science \u00b7 Hinge Health \u00b7 Nielsen \u00b7 FiscalNote \u00b7 Public Policy Holding',
    note:'Ad measurement and public-policy monitoring. Small names reflect Lyft Media\u2019s early-stage scale (~$100M vs Uber\u2019s $2B+).' },
];
var SC_CUSTOMERS = [
  { n:'ModivCare', ind:'Healthcare Transport', note:'NEMT (non-emergency medical transport) \u2014 Lyft provides rides for Medicaid/Medicare patients.' },
  { n:'Cano Health', ind:'Healthcare', note:'Same NEMT use case \u2014 healthcare rides are a stable, contract-based revenue source.' },
  { n:'AXS Group', ind:'Internet Media', note:'Event ticketing / venue access partnership.' },
  { n:'Sixt SE', ind:'Car Rental (Germany)', note:'European car rental. Likely connected to FreeNow\u2019s taxi/rental network.' },
];

function supplySection(){
  var av=[['Waymo',null,'waymo.com'],['Baidu','BIDU','baidu.com'],['Mobileye','MBLY','mobileye.com'],['May Mobility',null,'maymobility.com'],['Aptiv','APTV','aptiv.com'],['NVIDIA','NVDA','nvidia.com'],['Innoviz','INVZ','innoviz.tech'],['Ambarella','AMBA','ambarella.com']];
  var plumb=[['Oracle','ORCL','oracle.com'],['Dell','DELL','dell.com'],['AWS','AMZN','amazon.com'],['Twilio','TWLO','twilio.com'],['CSAA',null,'aaa.com'],['Hertz','HTZ','hertz.com']];
  var cust=[['ModivCare','MODV','modivcare.com'],['Cano Health',null,'canohealth.com'],['AXS',null,'axs.com'],['Sixt',null,'sixt.com']];
  function logos(arr){ return '<div class="lsc-logos">'+arr.map(function(a){ return '<div class="lsc-logo">'+lyLogo(a[0],a[1],a[2])+'<span>'+esc(a[0])+'</span></div>'; }).join('')+'</div>'; }
  var h='<style>'+
    '.alp{display:flex;align-items:center;gap:16px;background:var(--brand-soft);border:1px solid var(--bdr);border-radius:12px;padding:14px 18px;margin:2px 0 14px}'+
    '.alp-big{font-size:30px;font-weight:800;color:var(--brand);line-height:1;flex:none}.alp-txt{font-size:12.5px;color:var(--navy);line-height:1.5}.alp-txt b{font-weight:800}'+
    '.lmb-logo{width:38px;height:38px;border-radius:8px;background:#fff;border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;overflow:hidden}.lmb-logo img{max-width:26px;max-height:26px;object-fit:contain}'+
    '.lsc-step{display:flex;gap:12px;margin:14px 0}'+
    '.lsc-num{flex:none;width:24px;height:24px;border-radius:50%;background:var(--brand);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}'+
    '.lsc-body{flex:1;min-width:0}.lsc-h{font-size:13px;font-weight:800;color:var(--navy);margin:2px 0 6px}'+
    '.lsc-logos{display:flex;flex-wrap:wrap;gap:10px;margin:4px 0 7px}'+
    '.lsc-logo{display:flex;flex-direction:column;align-items:center;gap:4px;width:60px}.lsc-logo span{font-size:9.5px;color:var(--navy);text-align:center;font-weight:600;line-height:1.15}'+
    '.lsc-d{font-size:12px;color:var(--navy);line-height:1.55}.lsc-d b{font-weight:800}'+
    '@media(max-width:560px){.alp{flex-direction:column;align-items:flex-start;gap:6px}}'+
  '</style>';
  h+='<div class="alp"><div class="alp-big">$0.06M</div><div class="alp-txt">the <b>only</b> disclosed supplier dollar value in Lyft’s entire SPLC (Ambarella). ~30 suppliers, four B2B customers — Lyft is a <b>pure B2C marketplace</b> whose real "supply chain" is drivers it does not employ and riders it does not contract. Read it in three moves:</div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">1</div><div class="lsc-body"><div class="lsc-h">Drivers — the supply that actually matters (today)</div>'+
    '<div class="lsc-d">The platform lives on <b>liquidity</b>: enough drivers online that wait times stay low and prices stay competitive. That labor supply — <b>owned by no one</b>, recruited and incentivized — is Lyft’s core input and, via driver pay (~67% of a fare) + insurance, its largest cost. It is also the moat: the marketplace with the most drivers gives the best service at the best price. Human drivers supply <b>essentially every ride today.</b></div></div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">2</div><div class="lsc-body"><div class="lsc-h">The AV web — a future bet, not today’s signal</div>'+logos(av)+
    '<div class="lsc-d">Lyft holds a tie with <b>nearly every credible AV player</b> — the same multi-partner hedge Uber runs, smaller (Waymo → Nashville, May Mobility → Atlanta, Baidu → Europe). It matters for <b>where the model is going</b> — the bet that Lyft can host autonomy without building it — but AV is a <b>tiny fraction of rides today</b>, so this is optionality, not the supply that runs the business now.</div></div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">3</div><div class="lsc-body"><div class="lsc-h">Everything else — commodity plumbing</div>'+logos(plumb)+
    '<div class="lsc-d">Cloud & data, payments, insurance (CSAA + the captive PVIC), driver rentals (Hertz/FlexDrive) — standard inputs with <b>no leverage</b> over Lyft and near-zero disclosed spend. Not a cost story.</div></div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">4</div><div class="lsc-body"><div class="lsc-h">The customers — four B2B ties, zero concentration</div>'+logos(cust)+
    '<div class="lsc-d">Healthcare NEMT (ModivCare, Cano Health), events (AXS) and a European rental tie (Sixt, via FreeNow). No single rider or account is material — the marketplace has no customer-concentration risk.</div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:12px"><b>The so-what, in one line:</b> a sparse SPLC <i>proves</i> the asset-light B2C model — Lyft owns almost nothing and depends on almost no one <b>except its drivers</b>, who supply every ride today. The <b>AV web</b> is the one thing worth tracking for the <i>future</i> — the bet that Lyft can ride autonomy without building it — but it is optionality, not today’s supply. <span class="ave-subh-note">Bloomberg SPLC, 29-Jun-2026.</span></div>';
  return h;
}

// Revenue composition — visual hierarchy: one dominant engine (rideshare) + a
// small, flat Rentals bucket. Values are FY2025 actuals from the Summit dataset.
function revComposition(){
  var ride=6063, rent=421, gross=ride+rent;                 // $M, FY2025 actuals
  var ridePct=(ride/gross*100).toFixed(1), rentPct=(rent/gross*100).toFixed(1);
  var h='<style>'+
    '.lrv-bar{display:flex;height:54px;border-radius:10px;overflow:hidden;border:1px solid var(--bdr);margin:2px 0 7px}'+
    '.lrv-s{display:flex;flex-direction:column;justify-content:center;padding:0 15px;color:#fff;min-width:0}'+
    '.lrv-s-t{font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.lrv-s-d{font-size:11px;opacity:.92;margin-top:2px;white-space:nowrap}'+
    '.lrv-leg{font-size:11.5px;color:var(--mu)}'+
    '.lrv-cards{display:grid;grid-template-columns:2.2fr 1fr;gap:12px;margin-top:14px}'+
    '.lrv-c{border:1px solid var(--bdr);border-radius:10px;padding:15px 17px;background:var(--w)}'+
    '.lrv-c.big{border-top:3px solid var(--brand)}.lrv-c.small{border-top:3px solid var(--brand-2)}'+
    '.lrv-c-h{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.lrv-c-v{font-size:22px;font-weight:800;color:var(--navy);margin:5px 0 1px}'+
    '.lrv-c-s{font-size:11.5px;color:var(--mu)}'+
    '.lrv-c-d{font-size:12.5px;color:var(--navy);line-height:1.55;margin-top:9px}'+
    '.lrv-up{color:#1E9E62;font-weight:800;font-size:13px}.lrv-flat{color:#8A93A0;font-weight:800;font-size:13px}'+
    '.lrv-chip{display:inline-block;font-size:11px;font-weight:600;color:var(--brand-2);background:var(--brand-soft);border-radius:12px;padding:3px 10px;margin:6px 5px 0 0}'+
    '.lrv-bridge{margin-top:13px;font-size:12px;color:var(--navy);background:var(--brand-soft);border-radius:8px;padding:11px 14px;line-height:1.55}'+
    '@media(max-width:720px){.lrv-cards{grid-template-columns:1fr}}'+
  '</style>';
  h+='<p class="ov-lede" style="margin:0 0 12px">Lyft is <b>one reported segment</b>, and its revenue is really <b>two lines</b> — not six. One of them <i>is</i> the business.</p>';
  h+='<div class="lrv-bar">'+
    '<div class="lrv-s" style="flex:0 0 '+ridePct+'%;background:var(--brand)"><div class="lrv-s-t">Rideshare marketplace</div><div class="lrv-s-d">$6.06B</div></div>'+
    '<div class="lrv-s" style="flex:0 0 '+rentPct+'%;background:var(--brand-2)"></div>'+
  '</div>';
  h+='<div class="lrv-leg"><span style="color:var(--brand)">■</span> Rideshare '+ridePct+'%&nbsp;&nbsp;·&nbsp;&nbsp;<span style="color:var(--brand-2)">■</span> Rentals '+rentPct+'% <span style="opacity:.75">(share of gross revenue sources, FY2025)</span></div>';
  h+='<div class="lrv-cards">'+
    '<div class="lrv-c big"><div class="lrv-c-h">Rideshare marketplace — the engine</div><div class="lrv-c-v">$6.06B <span class="lrv-up">+13% YoY</span></div><div class="lrv-c-s">~'+ridePct+'% of revenue · FY2025</div>'+
      '<div class="lrv-c-d"><b>This is the whole business.</b> Revenue = <b>rides × bookings-per-ride × ~30% take</b>. Everything that moves the stock — the ~15% bookings CAGR, the insurance-cost unlock, the up-market mix — lives in this one line. Model <i>this</i>, not "segments."</div></div>'+
    '<div class="lrv-c small"><div class="lrv-c-h">Rentals — flat & immaterial</div><div class="lrv-c-v">$0.42B <span class="lrv-flat">+0.1% YoY</span></div><div class="lrv-c-s">~'+rentPct+'% of revenue · dead flat</div>'+
      '<div class="lrv-c-d">A small bucket where Lyft rents assets directly:'+
      '<div><span class="lrv-chip">Bikes & scooters</span><span class="lrv-chip">Driver vehicle rentals</span></div>'+
      '<div style="margin-top:7px;font-size:11px;color:var(--mu)">Rider-facing Lyft Rentals was wound down ~2022. The split inside this line isn\'t separately disclosed.</div></div></div>'+
  '</div>';
  h+='<div class="lrv-bridge"><b>One wrinkle worth knowing:</b> the two sources gross to <b>$6.48B</b>, yet FY2025 reported revenue is <b>$6.32B</b> — a <b>~$168M legal / regulatory reserve & settlement</b> is netted against revenue (the same item that made 2025\'s "take rate" optically dip). An accounting drag, not an operating miss.</div>';
  return h;
}
// Competitive positioning map — where Lyft sits vs peers on vertical breadth × geography.
function peerDot(x,y,r,color,name,sub,hl,why){
  return '<circle class="peer-dot" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'"'+(hl?' stroke="#fff" stroke-width="2"':'')+' style="cursor:pointer" data-name="'+esc(name)+'" data-why="'+esc(why||'')+'"></circle>'+
    '<text x="'+x+'" y="'+(y-r-6)+'" font-family="Inter,sans-serif" font-size="'+(hl?12.5:11)+'" font-weight="'+(hl?800:700)+'" fill="'+(hl?color:'#3A4552')+'" text-anchor="middle" style="pointer-events:none">'+esc(name)+'</text>'+
    '<text x="'+x+'" y="'+(y+r+13)+'" font-family="Inter,sans-serif" font-size="9.5" fill="#8A93A0" text-anchor="middle" style="pointer-events:none">'+esc(sub)+'</text>';
}
// Top Line ▸ Industry Analysis — the QUALITATIVE competitive landscape (rival cards +
// adjacent fronts), carved from the old Deep Overview's competitive map (Golden Rule #1).
function lyIndustryBody(c){
  var cards=[
    ['Uber','The only true rival — same ~30% take, ~70% US share. So the gap isn\'t price, it\'s <b>scale + a Delivery business that funds rider CAC</b> Lyft can\'t match.'],
    ['Didi','Went <b>global instead of broad</b> (China, Brazil, Mexico). No US overlap — the "what if Lyft had expanded" counterfactual.'],
    ['Grab','SE Asia\'s <b>everything-app</b> (rides + food + payments). The super-app path Lyft <b>rejected</b> to stay focused.'],
    ['Bolt','Europe/Africa mobility + scooters. The <b>one place Lyft now competes head-to-head</b> — via FreeNow, as a sub-scale entrant against an incumbent.'],
  ];
  var h='<style>.lpr-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:2px}'+
    '.lpr-c{border:1px solid var(--bdr);border-left:3px solid var(--brand-2);border-radius:8px;padding:10px 13px;background:var(--w)}'+
    '.lpr-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}.lpr-d{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.lpr-adj{font-size:11.5px;color:var(--mu);line-height:1.55;margin-top:10px;background:var(--brand-soft);border-radius:8px;padding:9px 12px}'+
    '@media(max-width:720px){.lpr-grid{grid-template-columns:1fr}}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">'+PEER_NOTE+'</div>';
  h+='<div class="lpr-grid">'+cards.map(function(p){ return '<div class="lpr-c"><div class="lpr-n">'+esc(p[0])+'</div><div class="lpr-d">'+p[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="lpr-adj"><b>Adjacent fronts</b> (not ride-hailing rivals, but in Lyft\'s orbit): <b>Waymo</b> — AV, a threat <i>and</i> a partner (its robotaxis run on the Lyft network) · <b>DoorDash</b> — delivery, now a <b>partner</b> sending high-frequency riders Lyft\'s way.</div>';
  return sec('Competitive Landscape — rivals & adjacent fronts', h)+
    sec('Competitive map — rivals by business traits', lyRivalScatter())+
    '<div class="ov-foot">'+esc(SOURCES)+'</div>';
}
// The competitive map (breadth × geography). Rendered inside Industry Analysis. #lyPeerTip wired in init.
function lyRivalScatter(){
  var h='<style>.peer-tip{position:fixed;z-index:60;max-width:250px;background:var(--navy);color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,0.28);pointer-events:none;border-top:3px solid var(--brand)}'+
    '.peer-tip .pt-n{display:block;font-weight:800;font-size:12.5px;color:var(--brand);margin-bottom:3px}'+
    '.peer-dot{transition:r .1s}.peer-dot:hover{stroke:var(--brand);stroke-width:2}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">The world\'s <b>ride-hailing platforms</b>, mapped by how far each has <b>diversified beyond rides</b> (x — Lyft is ~7% non-rideshare vs Uber ~50%+ via Delivery, Freight & Ads) and its <b>geographic reach</b> (y). Lyft is the deliberate outlier: <b>narrow and domestic</b> while everyone else went broad, global, or both. <span style="opacity:.75">Hover any dot for the reasoning behind its spot.</span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" role="img" aria-label="Ride-hailing positioning map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← pure ride-hailing</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">multi-service platform →</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">1 region</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">global</text>'+
    peerDot(144,221,9,'#E6007A','Lyft','US + new Europe',true,'Rides + bikes only — ~7% of revenue is non-rideshare. US-based, plus a new European foothold via FreeNow. So: the narrow-and-domestic corner.')+
    peerDot(225,100,7,'#9AA3AE','Didi','China · LatAm',false,'Mostly ride-hailing, with some delivery & fintech in China. Operates across China, Brazil, Mexico and beyond — so: moderate breadth, but broad geography.')+
    peerDot(275,158,7,'#9AA3AE','Bolt','Europe · Africa',false,'Estonia-based mobility app: ride-hailing + e-scooters + Bolt Food + grocery, across ~45 European & African countries. Moderate breadth, regional — the incumbent Lyft now faces via FreeNow.')+
    peerDot(506,175,7,'#9AA3AE','Grab','SE Asia super-app',false,'A true super-app: rides + food delivery + GrabPay financial services — but only ~8 SE-Asian countries. So: high breadth, single region.')+
    peerDot(548,68,8,'#10141A','Uber','~70 countries',false,'Rides + Delivery (~half of gross bookings) + Freight + Ads, across ~70 countries. So: the broad-and-global corner — the opposite of Lyft.')+
  '</svg></div>';
  h+='<div id="lyPeerTip" class="peer-tip" hidden></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:6px">'+PEER_NOTE+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:6px 0 0;font-size:11px;color:var(--mu)"><b>Why more names than the peer-multiples table?</b> This map places rivals by <b>business traits</b>, so it includes <b>unlisted / private</b> players (Didi, Bolt) with <b>no public market multiple</b> — they can’t appear in the Valuation ▸ Peers multiples table, which is limited to <b>listed</b> peers. Positions here are qualitative <b>approximations</b>, not market data.</div>';
  return h;
}
// Valuation ▸ Peers — how the LISTED peers trade (multiples). The competitive map lives in Industry
// Analysis; unlisted rivals (Didi, Bolt) have no public market multiple.
var LY_PEER_MULT=[
  { tk:'UBER', n:'Uber',      mc:'$149B', ev:'~15–16×', pe:'~20×', g:'+20%', read:'The scaled, global, multi-product leader — the read-across for the whole category.' },
  { tk:'DASH', n:'DoorDash',  mc:'$78B',  ev:'~22×',    pe:'~28×', g:'+38%', read:'US delivery leader; fastest grower here and richly valued. Not a ride-hailing comp, but a marketplace read.' },
  { tk:'GRAB', n:'Grab',      mc:'$16B',  ev:'~13×',    pe:'n/m',  g:'+24%', read:'SE-Asia super-app; only recently GAAP-profitable, so read it on EV/EBITDA.' },
  { tk:'CART', n:'Instacart', mc:'$11B',  ev:'~15×',    pe:'~18×', g:'+14%', read:'US grocery-delivery specialist; profitable and ad-driven — the value name.' },
  { tk:'LYFT', n:'Lyft',      mc:'$5.8B', ev:'~8×',     pe:'~9×',  g:'+14%', self:true, read:'US/Canada #2 ride-hailing — the cheapest of the group. The market prices its lack of scale & diversification.' }
];
function lyPeerMultBody(c){
  var rowsHtml=LY_PEER_MULT.map(function(p){
    var bg=p.self?'background:rgba(230,0,122,0.06);':'';
    return '<tr style="border-top:1px solid var(--bdr);'+bg+'">'+
      '<td style="padding:8px 10px;font-weight:'+(p.self?'800':'700')+'">'+esc(p.n)+' <span class="muted" style="font-weight:600">'+esc(p.tk)+'</span></td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.mc)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.ev)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.pe)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.g)+'</td>'+
      '<td style="padding:8px 10px;color:var(--mu);font-size:11px;line-height:1.45">'+p.read+'</td></tr>';
  }).join('');
  var h='<p class="ov-lede">How the <b>listed</b> peers trade — the point is where Lyft sits on the value/growth spectrum. Lyft is the <b>cheapest name in the set</b> (~8× EV/EBITDA, ~9× P/E): the market prices its <b>lack of scale and diversification</b> vs Uber, even as profitability and FCF have turned. The re-rating case is that the cash is real and the discount closes.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)">'+
    '<th style="text-align:left;padding:7px 10px">Company</th>'+
    '<th style="text-align:right;padding:7px 10px">Mkt cap</th>'+
    '<th style="text-align:right;padding:7px 10px">EV/EBITDA <span style="font-weight:600">(fwd)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(fwd)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">Rev growth</th>'+
    '<th style="text-align:left;padding:7px 10px">The read</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>Only listed peers with a public multiple belong here.</b> Unlisted rivals (Didi, Bolt) and captive subsidiaries have no market multiple — they sit on the competitive map in <b>Industry Analysis</b>. "n/m" = no meaningful P/E. Uber is the cleanest direct comp; DoorDash/Grab/Instacart are marketplace read-acrosses, not ride-hailing.</div>';
  h+='<div class="ov-foot">Multiples as of ~Jul 2026, forward where available (secondary/terminal sources); growth is latest reported YoY. Directional, not exact — confirm against a terminal before quoting.</div>';
  return h;
}
// ─── Pane: Overview ───────────────────────────────────────────────────────────
function lyKnockout(){
  var F=[
    ['Free cash flow','−$222M','+$1.12B','burning cash','first $1B+ FCF year'],
    ['Adj. EBITDA','−$417M','+$529M','structural losses','profitable at scale'],
    ['GAAP net income','−$1.6B','profitable','never profitable','first full-year profit (2024)']
  ];
  var h='<style>'+
    '.lyko{border:1px solid var(--bdr);border-left:4px solid var(--brand);border-radius:14px;padding:16px 18px;margin:2px 0 16px;background:linear-gradient(180deg,var(--brand-soft),transparent)}'+
    '.lyko-hd{font-size:16px;font-weight:800;color:var(--navy);letter-spacing:-.2px}'+
    '.lyko-sub{font-size:12px;color:var(--navy);line-height:1.55;margin:6px 0 13px;max-width:70ch}.lyko-sub b{font-weight:800}'+
    '.lyko-g{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}@media(max-width:640px){.lyko-g{grid-template-columns:1fr}}'+
    '.lyko-c{background:#fff;border:1px solid var(--bdr);border-radius:11px;padding:11px 13px}'+
    '.lyko-k{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu)}'+
    '.lyko-flip{display:flex;align-items:baseline;gap:7px;margin:5px 0 2px}'+
    '.lyko-was{font-size:14px;font-weight:800;color:#C0392B}.lyko-arw{color:#1E9E62;font-weight:900}.lyko-now{font-size:16px;font-weight:800;color:#1E9E62}'+
    '.lyko-nl{font-size:10.5px;color:#1E9E62;font-weight:700}.lyko-wl{font-size:10px;color:var(--mu)}'+
  '</style>';
  h+='<div class="lyko"><div class="lyko-hd">From cash-burning to cash machine — in ~2 years</div>'+
    '<div class="lyko-sub">CEO <b>David Risher</b> (Amazon’s first head of US retail) took a company <b>burning cash, losing share and trading near $8</b> — ~90% below its $72 IPO — and turned it into its <b>first-ever profit and $1.1B of free cash flow</b>. No robotaxi arms race, no ownership of cars: a marketplace fixed by focus.</div>'+
    '<div class="lyko-g">'+F.map(function(f){
      return '<div class="lyko-c"><div class="lyko-k">'+f[0]+'</div>'+
        '<div class="lyko-flip"><span class="lyko-was">'+f[1]+'</span><span class="lyko-arw">→</span><span class="lyko-now">'+f[2]+'</span></div>'+
        '<div class="lyko-wl">'+f[3]+' &rarr; <span class="lyko-nl">'+f[4]+'</span></div></div>';
    }).join('')+'</div>'+
    '<div style="font-size:10.5px;color:var(--mu);line-height:1.5;margin-top:10px">2022 → 2025. The catch: the market hasn’t re-rated it — the stock still sits far below IPO, and FY25’s headline profit leans on a one-time tax benefit.</div>'+
  '</div>';
  return h;
}
// ── The old "Deep Overview" subtab is DISMANTLED (Golden Rule #1 — content MOVED, not
// deleted). Its pieces are recomposed into the new 5-tab spine:
//   • intro (snapshot/KPIs/lede/as-of) + segment/revenue overview → Top Line ▸ Segments (lySegmentsBody)
//   • the turnaround knockout (lyKnockout)                        → Evolution ▸ Strategy (with the Playbook)
//   • the qualitative rival cards / adjacent fronts               → Top Line ▸ Industry Analysis (lyIndustryBody)
//   • the peer breadth×geography scatter                          → Top Line ▸ Industry Analysis (lyRivalScatter)
// (There were no explicit multi-year targets in the old Deep Overview — the 2027 targets
//  already live in the Playbook/strategyBody, and Model vs. Reality is Evolution ▸ Guidance.)
function lyIntro(){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="lyLive" hidden></div>';
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  return h;
}
// Top Line ▸ Segments — company intro, the segment/revenue overview, then each engine in
// depth via an inner Rideshare / Media & Growth toggle (mirrors uber's ubSegmentsBody).
function lySegmentsBody(c){
  var h='<div class="ov-live" id="lyLive" hidden></div>';
  h+='<p class="ov-lede">Lyft is effectively <b>one business</b>: a US & Canada rideshare marketplace (~96% of revenue), with a small flat <b>Rentals</b> bucket (bikes/scooters + driver vehicle rentals) and a fast-growing but still-small <b>Lyft Media</b> advertising arm on top. Below: how the split really looks, then each engine in depth. (Company snapshot & KPIs are on the Overview tab.)</p>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="lyChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($M, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="lyChartEbitda"></canvas></div></div>'+
  '</div>';
  h+=sec('Where the Revenue Actually Comes From', revComposition());
  // Each engine in depth, switched by an inner toggle (the "sub-tabs de los segmentos").
  h+='<div class="ov-sec-h ovt-store-h" style="margin-top:8px">Each engine in depth</div>';
  h+='<style>.seg-pill{border:1px solid var(--bdr);background:#fff;font:inherit;font-size:11px;font-weight:700;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer}.seg-pill.active{background:var(--navy);color:#fff;border-color:var(--navy)}.seg-pill:hover{color:var(--navy)}.seg-pill.active:hover{color:#fff}</style>';
  h+='<div class="seg-pills" style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 12px">'+
      '<button type="button" class="seg-pill active" data-seg="rides">Rideshare</button>'+
      '<button type="button" class="seg-pill" data-seg="media">Media & Growth</button>'+
    '</div>';
  h+='<div class="seg-body" data-seg="rides">'+growthBody(c)+'</div>';
  h+='<div class="seg-body" data-seg="media" hidden>'+mediaBody(c)+'</div>';
  return h;
}
// ── Labeled placeholder (user-approved): create the tab now, fill it later with sourced
// figures — never invent data. Marked "To build" so it's obviously incomplete. ──
function placeholder(title, note){
  return '<div style="border:1px dashed var(--bdr);border-radius:12px;padding:16px 18px;margin:10px 0;background:linear-gradient(180deg,rgba(232,160,12,0.045),transparent)">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#B7791F;background:rgba(232,160,12,0.14);border-radius:10px;padding:2px 9px">To build</span><span style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(title)+'</span></div>'+
    '<div style="font-size:12px;color:var(--mu);line-height:1.55">'+note+'</div></div>';
}
// Top Line ▸ Customers — riders + the loyalty stack. Built from in-repo vetted data (A_RIDERS,
// Q1 2026 KPIs, partnership share). Pink member counts are NOT disclosed by Lyft → kept qualitative.
function lyCustomersBody(c){
  var R=A_RIDERS.slice(-6), mx=Math.max.apply(null,R);
  var bars='<div style="display:flex;align-items:flex-end;gap:6px;height:96px;margin:6px 0 2px">'+R.map(function(v){var hp=Math.max(4,Math.round(v/mx*76));return '<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center"><div style="width:68%;background:#E6007A;border-radius:3px 3px 0 0;height:'+hp+'px"></div><div style="font-size:9.5px;color:var(--mu);margin-top:3px">'+v.toFixed(0)+'</div></div>';}).join('')+'</div>';
  var h='<p class="ov-lede">Lyft has <b>two kinds of customer</b>. <b>Riders</b> are the core — a base that keeps growing while getting <b>more loyal</b> through membership (Lyft Pink, Price Lock) and a fast-growing <b>partnership channel</b>. But <b>advertisers</b> are customers too: <b>Lyft Media</b> sells the app and in-car screens to brands — small (~$100M run-rate) but fast-growing and high-margin. Lyft does <b>not disclose Pink member counts</b>, so the membership view stays qualitative.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Active riders</div><div class="ov-kpi-v">28.3M</div><div class="ov-kpi-d muted">Q1 2026 · +17% YoY</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Rides</div><div class="ov-kpi-v">236.9M</div><div class="ov-kpi-d muted">Q1 2026 · +8.5% YoY</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Partnership rides</div><div class="ov-kpi-v">~27%</div><div class="ov-kpi-d muted">record share of total</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Membership</div><div class="ov-kpi-v">Pink + Price Lock</div><div class="ov-kpi-d muted">counts not disclosed</div></div>'+
  '</div>';
  h+=sec('Active riders — steady growth', '<div class="ov-diagram-cap" style="margin:0 0 2px">Active riders (M), recent periods.</div>'+bars);
  h+=sec('The loyalty stack', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6"><b>Lyft Pink</b> (paid membership) and <b>Price Lock</b> (a surge-hedge subscription) drive frequency and retention; a third layer is <b>borrowed loyalty</b> from partners — <b>DoorDash</b> (DashPass), <b>Chase Sapphire</b> (extended to 2027) and <b>United</b> — which pushed <b>partnership rides to a record ~27% of total</b>, a low-CAC channel that also skews mix toward higher-value trips.</div>');
  h+=sec('Advertisers — the other customer (Lyft Media)', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Lyft’s <b>second customer is the advertiser.</b> <b>Lyft Media</b> monetizes the app’s surfaces and in-car tablets for brands — a business built to roughly a <b>~$100M+ run-rate</b>. That is still a fraction of Uber’s $2B+ ad arm, but it grows fast and at <b>high incremental margin</b> because it sits on impressions Lyft already owns, and it lifts revenue <b>without touching the driver split</b> — the same structural reason advertising matters for Uber. As it scales it is one of the few levers that raises Lyft’s take on the <i>revenue</i> side rather than only cutting cost.</div>');
  h+='<div class="ov-foot">Active riders & rides: Lyft Q1 2026 results (headline KPIs FY2025 where noted). Membership counts are not disclosed by Lyft; Lyft Media run-rate is approximate.</div>';
  return h;
}
// Top Line ▸ TAM — Lyft's OWN stated market, framed in personal-vehicle TRIPS (not dollars).
// >300B trips/yr post-FREENOW (Lyft IR, Aug 2025 close; Apr 2025 deal 8-K). Rides from FY2025
// results. Lyft publishes no clean $ TAM for Media/micromobility → that piece stays a placeholder.
function lyTamBody(c){
  var modes=[
    ['Rideshare — US & Canada', 'core', 'The original ~150B+ N. American personal-vehicle-trip pool'],
    ['Europe via FREENOW', 'new · closed Aug 2025', '9 countries, 150+ cities — the deal that ~doubled the TAM'],
    ['Bikes & scooters', 'active (in-app)', 'Short rides + first- & last-mile multimodal legs'],
    ['Lyft Teen', 'launched Feb 2026', '~15B annual trips of US 13–17-year-olds'],
    ['Lyft Media', 'scaling', 'Ad monetization of the app & in-car screens — no $ TAM disclosed']
  ];
  var h='<p class="ov-lede">Lyft frames its opportunity in <b>personal-vehicle trips per year</b>, not dollars. Its own stated TAM is <b>more than 300 billion trips a year</b> — the <b>FREENOW</b> acquisition (closed Aug 2025) <b>nearly doubled</b> it by stacking Europe on top of the US/Canada base. Against that, Lyft did <b>945.5M rides in FY2025</b>, so penetration is still <b>well under 1%</b>.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Stated TAM</div><div class="ov-kpi-v">&gt;300B</div><div class="ov-kpi-d muted">personal-vehicle trips / yr (post-FREENOW)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Pre-FREENOW TAM</div><div class="ov-kpi-v">~150B+</div><div class="ov-kpi-d muted">US & Canada trips / yr</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY2025 rides</div><div class="ov-kpi-v">945.5M</div><div class="ov-kpi-d muted">all-time high</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Penetration</div><div class="ov-kpi-v">~0.3%</div><div class="ov-kpi-d muted">FY25 rides ÷ &gt;300B TAM</div></div>'+
  '</div>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Mode / market</th><th style="text-align:left;padding:7px 10px">Status</th><th style="text-align:left;padding:7px 10px">What it adds to the TAM</th></tr></thead><tbody>'+
    modes.map(function(r){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:700">'+r[0]+'</td><td style="padding:7px 10px;color:var(--mu)">'+r[1]+'</td><td style="padding:7px 10px">'+r[2]+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+=sec('How the market is defined', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Lyft’s TAM is a <b>trip-count, not a spend figure</b>: it counts annual personal-vehicle trips across its operating geographies (US, Canada and — since Aug 2025 — nine European countries via FREENOW) as the pool it can convert into app-based rides. There is no dollar sizing, so penetration is best read as <b>rides &divide; trips</b>. The FREENOW deal (~$197M) also added roughly <b>$1.17B of annualized gross bookings</b>, but Lyft did not restate the TAM in dollars.</div>');
  h+=sec('The dollar dimension — the ride-hailing market Lyft plays in', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Lyft frames TAM in trips, but the <b>revenue market</b> is sizeable too. US ride-hailing is a ~<b>$28.5B</b> market (2024), a duopoly where <b>Lyft holds ~24%</b> and Uber ~76% — add Canada and the new European FreeNow footprint on top. Lyft did <b>945.5M rides in FY2025</b> (US + Canada, +14%) for <b>$6.3B</b> of revenue. Set against the ~<b>$1.8T</b> Americans spend on personal transportation a year, ride-hailing overall is still only ~<b>1.6%</b> — the same tiny-penetration runway as Uber, just without Uber’s delivery/international diversification to lean on.</div>');
  h+=sec('Lyft Media & micromobility — sized in the app, not in dollars', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Lyft does <b>not</b> publish a clean dollar TAM for <b>Lyft Media</b> (its ad arm, ~$100M run-rate today) or for bikes/scooters — it quantifies opportunity in trips and impressions, not a market-research dollar. Rather than invent one, size these off disclosed run-rates and note the whitespace: US <b>retail media</b> is a &gt;$50B market Lyft has barely tapped, and micromobility rides feed the same trip pool. Management also frames <b>autonomous vehicles</b> as a TAM <i>expander</i> — arguing rideshare demand grows fastest where AVs already operate.</div>');
  h+='<div class="ov-foot">Source: Lyft IR — “Lyft Goes Global: FREENOW Acquisition Complete” (Aug 1, 2025) and the Apr 16, 2025 deal press release / 8-K (&gt;300B trips, ~doubled TAM, ~$1.17B annualized GB); rides & the ~15B-trip Lyft Teen figure from Lyft Q4 & FY2025 results (Feb 10, 2026, SEC EDGAR CIK 0001759509).</div>';
  return h;
}
// Bottom Line ▸ Suppliers — the real "Who Powers Lyft" ecosystem (moved here from the Playbook).
// Lyft is a pure B2C marketplace with a sparse SPLC — the story is drivers + AV partners, not vendors.
function lySuppliersBody(c){
  return '<p class="ov-lede">Lyft is an <b>asset-light B2C marketplace</b>, so its <b>single most important supplier is its drivers</b> — the people who bring the cars and the labor, recruited and incentivized but employed by no one. Everything else is thin: the disclosed vendor base carries a single dollar value in the entire SPLC. <b>Autonomous-vehicle partners are a future bet, not today’s supply</b> — worth tracking for where it is going, not the weight it carries now, since human drivers supply essentially every ride today.</p>'+
    sec('Who Powers Lyft — the supplier & customer ecosystem', supplySection());
}
// Valuation ▸ Capital Allocation — DATA-BACKED from the Summit model snapshot (FY actuals, $M):
// FCF and shares outstanding. The model does not carry buyback/SBC lines for Lyft, so those are
// framed qualitatively and flagged to-confirm (never invented).
function lyCapAllocBody(c){
  var R=[
    {fy:'FY22', fcf:-352, bb:0,   sbc:751, sh:355},
    {fy:'FY23', fcf:-248, bb:0,   sbc:485, sh:385},
    {fy:'FY24', fcf:766,  bb:0,   sbc:331, sh:414},
    {fy:'FY25', fcf:1116, bb:500, sbc:322, sh:381}
  ];
  var bb=function(m){ if(m==null) return '—'; var a=Math.abs(m), s=m<0?'−':''; return a>=1000? s+'$'+(a/1000).toFixed(2)+'B' : s+'$'+a+'M'; };
  var last=R[3], prev=R[2];
  var shChg=(last.sh/prev.sh-1)*100;
  var h='<p class="ov-lede">How Lyft handles capital as the turnaround takes hold: <b>no dividend</b>, FCF only recently durable, and shareholder returns <b>just beginning but accelerating</b> — the first-ever buyback started in early 2025 and, together with falling SBC, <b>turned the share count down for the first time</b> in FY25.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Dividend</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">never paid</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 buybacks</div><div class="ov-kpi-v">~$500M</div><div class="ov-kpi-d muted">first-ever · ~45% of FCF</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 SBC</div><div class="ov-kpi-v">$322M</div><div class="ov-kpi-d muted">5.1% of rev · down from 22.6%</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Shares out</div><div class="ov-kpi-v">~381M</div><div class="ov-kpi-d muted">▼ '+Math.abs(shChg).toFixed(1)+'% YoY (first decline)</div></div>'+
  '</div>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Fiscal year</th><th style="text-align:right;padding:7px 10px">Free cash flow</th><th style="text-align:right;padding:7px 10px">Buybacks</th><th style="text-align:right;padding:7px 10px">SBC</th><th style="text-align:right;padding:7px 10px">Shares out (M)</th></tr></thead><tbody>'+
    R.map(function(r){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:700">'+r.fy+'</td><td style="text-align:right;padding:7px 10px">'+bb(r.fcf)+'</td><td style="text-align:right;padding:7px 10px">'+(r.bb?bb(-r.bb):'—')+'</td><td style="text-align:right;padding:7px 10px">'+bb(-r.sbc)+'</td><td style="text-align:right;padding:7px 10px">'+r.sh.toLocaleString()+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+=sec('How management frames it', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">CEO David Risher’s stated priorities: <b>profitable growth first</b>, then <b>return excess cash</b>. The buyback has been <b>scaled aggressively</b> — <b>$500M</b> authorized (Feb 2025), raised to <b>$750M</b> (May 2025), then a <b>new $1.0B</b> program (Feb 2026, framed as ~<b>15% of market cap</b>) — a strong signal that management sees the stock as cheap relative to its cash generation. Lyft targets roughly <b>$1.5B of FCF</b> over the 2026–27 cycle to fund it while still investing (notably in AV).</div>');
  h+=sec('Dividend policy', '<div class="ov-callout">Lyft has <b>never paid a dividend</b> and has not signaled one. Cash goes to reinvestment and the buyback.</div>');
  h+=sec('SBC & dilution — the honest history', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">For most of Lyft’s life as a public company, SBC <b>out-diluted</b>: with <b>no buybacks before 2025</b>, the share count <b>rose every year FY22→FY24</b> (355M → 414M). Two things turned it: SBC fell hard as a share of revenue — from a bloated <b>~22.6% (FY21)</b> to <b>~5.1% (FY25)</b> — and the first ~$500M of repurchases arrived. The result is Lyft’s <b>first-ever decline in share count in FY25</b> (~414M → ~381M). So the accurate read mirrors Uber’s: dilution went <b>un-offset for years</b>, and buybacks have only <b>just begun</b> to reverse it. Full SBC-vs-shares history is charted under <b>Governance & SBC</b>.</div>');
  h+='<div class="ov-foot">Free cash flow & SBC: Lyft filings; buyback authorizations & ~$500M FY25 repurchase: Lyft Q4 2025 materials. Share counts are Summit model estimates (exact GAAP weighted shares not separately confirmed) — the FY25 decline is corroborated by management’s "reduced share count" commentary.</div>';
  return h;
}
// Valuation ▸ Balance Sheet — downside/solidity view from Lyft's Q1 2026 10-Q (Mar 31 2026,
// SEC EDGAR CIK 0001759509). Asset-light, positive net cash; the defining feature is a large
// self-insurance reserve that is substantially matched by segregated restricted assets.
var LY_BAL_BARS=[['Unrestricted liquidity',1720,'#1E9E62'],['Restricted assets (back insurance)',1998,'#5B8DEF'],['Insurance reserve (liability)',2245,'#E6007A'],['Total debt',1043,'#9AA3AE']];
function buildLyBal(){
  var cv=document.getElementById('lyChartBal'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('lyChartBal');
  _charts['lyChartBal']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:LY_BAL_BARS.map(function(b){return b[0];}), datasets:[{ label:'$M', data:LY_BAL_BARS.map(function(b){return b[1];}), backgroundColor:LY_BAL_BARS.map(function(b){return b[2];}), borderWidth:0 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' $'+(ctx.parsed.x/1000).toFixed(2)+'B'; } } } },
      scales:{ x:{ ticks:{ callback:function(v){ return '$'+(v/1000).toFixed(1)+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} }, y:{ grid:{display:false}, ticks:{font:{size:10}} } } }
  });
}
function lyBalanceBody(c){
  var rows=[
    ['Cash & cash equivalents', '$1,034.9M', 'unrestricted'],
    ['Short-term investments', '$686.1M', 'unrestricted'],
    ['Restricted cash & restricted investments', '$1,998.3M', 'segregated to back insurance claims'],
    ['Insurance reserves (current)', '−$2,245.0M', 'largest single liability'],
    ['Total debt (converts + vehicle financing)', '−$1,042.7M', '0.625% notes ’29 + 0% notes ’30'],
    ['Total stockholders’ equity', '$3,025.9M', 'book value'],
    ['Total assets', '$8,889.9M', 'total liabilities $5,864.0M']
  ];
  var h='<div style="border:1px solid rgba(232,160,12,0.45);background:linear-gradient(180deg,rgba(232,160,12,0.10),rgba(232,160,12,0.03));border-radius:12px;padding:12px 15px;margin:0 0 14px;display:flex;align-items:flex-start;gap:10px">'+
    '<span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#B7791F;background:rgba(232,160,12,0.18);border-radius:10px;padding:3px 10px;flex:none">Work in progress</span>'+
    '<span style="font-size:11.5px;color:var(--navy);line-height:1.5">This Balance Sheet section is <b>still being developed.</b> The line items and net-cash math below are pulled from Lyft’s Q1 2026 10-Q, but the deeper analysis (insurance-reserve adequacy, convert dilution scenarios, downside stress) is <b>not yet complete</b> — treat it as a draft.</span></div>';
  h+='<p class="ov-lede">Lyft runs an <b>asset-light</b> balance sheet with <b>positive net cash</b>: as of <b>March 31, 2026</b> it held <b>$1.72B</b> of unrestricted cash & short-term investments against just <b>$1.04B</b> of debt. The distinctive feature is a large <b>insurance reserve (~$2.25B)</b> — but it is substantially matched by <b>~$2.0B of restricted cash & investments</b> plus a loss-portfolio-transfer reinsurance deal, so it is not the leverage risk its size implies.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Net cash</div><div class="ov-kpi-v">+$0.68B</div><div class="ov-kpi-d muted">cash + ST inv. less all debt</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Unrestricted liquidity</div><div class="ov-kpi-v">$1.72B</div><div class="ov-kpi-d muted">$1.03B cash + $0.69B ST inv.</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Insurance reserve</div><div class="ov-kpi-v">$2.25B</div><div class="ov-kpi-d muted">~$2.0B restricted-asset backed</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Total debt</div><div class="ov-kpi-v">$1.04B</div><div class="ov-kpi-d muted">convertible notes ’29 / ’30</div></div>'+
  '</div>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Line item · Q1 2026 (Mar 31, 2026)</th><th style="text-align:right;padding:7px 10px">Amount</th><th style="text-align:left;padding:7px 10px">Note</th></tr></thead><tbody>'+
    rows.map(function(r){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:700">'+r[0]+'</td><td style="text-align:right;padding:7px 10px;font-variant-numeric:tabular-nums">'+r[1]+'</td><td style="padding:7px 10px;color:var(--mu)">'+r[2]+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ov-chart-card" style="margin-top:10px"><div class="ov-chart-t">Balance-sheet shape <span>· $B · Mar 31, 2026</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyChartBal"></canvas></div></div>';
  h+='<div class="ave-subh-note" style="margin:6px 0 4px">The ~$2.25B insurance reserve is ~<b>89% matched</b> by ~$2.0B of restricted assets set aside to pay claims; unrestricted liquidity ($1.72B) exceeds all debt ($1.04B) → net cash positive.</div>';
  h+=sec('Cash & the insurance reserve', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Lyft self-insures a portion of auto claims, so it carries a <b>~$2.25B insurance reserve</b> — huge relative to a company its size. Read it against the asset side: <b>~$0.79B restricted cash + ~$1.21B restricted investments (≈$2.0B)</b> are segregated specifically to pay those claims, and a <b>loss-portfolio-transfer reinsurance agreement</b> caps legacy exposure. The reserve is a genuine risk — adverse actuarial revisions flow straight through earnings — but it is <b>not</b> borrowed leverage.</div>');
  h+=sec('Debt & dilution', '<div class="ov-callout">Debt is <b>$1.04B</b>, essentially two convertible notes — <b>$460M of 0.625% notes due 2029</b> and <b>$500M of 0% notes due 2030</b> — plus small vehicle-financing facilities. The coupons are cheap, but converts are a <b>dilution</b> risk (not just repayment) if the stock re-rates — the one offset to a share count that <b>finally turned down in FY25</b> as buybacks began.</div>');
  h+='<div class="ov-callout" style="margin-top:10px"><b>Solidity read:</b> Positive net cash (+$0.68B), $3.0B of book equity, and an insurance reserve that is ~90% matched by restricted assets. Downside protection here is <b>financial flexibility, not hard assets</b> — Lyft is asset-light with little tangible collateral, so the key balance-sheet risk is <b>insurance-reserve adequacy</b>, not refinancing.</div>';
  h+='<div class="ov-foot">Source: Lyft Q1 2026 Form 10-Q, condensed consolidated balance sheet as of March 31, 2026 (SEC EDGAR, CIK 0001759509). Net cash = cash & equivalents + short-term investments − total debt; restricted cash/investments excluded as they back insurance claims.</div>';
  return h;
}
// Management ▸ Governance & SBC — vetted governance facts from the in-repo config; SBC $ not in the
// Summit model for Lyft, so framed via dilution (Cap Allocation) and flagged to-confirm.
var LY_SBC_HIST={ yrs:['FY22','FY23','FY24','FY25'], sbcPct:[18.3,11.0,5.7,5.1], shares:[355,385,414,381] };
function buildLySbc(){
  var cv=document.getElementById('lyChartSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('lyChartSbc');
  _charts['lyChartSbc']=new Chart(cv.getContext('2d'),{
    data:{ labels:LY_SBC_HIST.yrs, datasets:[
      { type:'bar', label:'Shares out (M)', data:LY_SBC_HIST.shares, backgroundColor:'rgba(107,43,217,0.24)', borderColor:'#6B2BD9', borderWidth:1, yAxisID:'y', order:2 },
      { type:'line', label:'SBC % of revenue', data:LY_SBC_HIST.sbcPct, borderColor:'#E6007A', backgroundColor:'#E6007A', borderWidth:2.5, tension:.3, pointRadius:3, yAxisID:'y1', order:1 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.yAxisID==='y1'? ' '+ctx.dataset.label+': '+ctx.parsed.y.toFixed(1)+'%' : ' '+ctx.dataset.label+': '+ctx.parsed.y+'M'; } } } },
      scales:{ y:{ position:'left', title:{display:true,text:'Shares out (M)',font:{size:9}}, ticks:{font:{size:9}}, grid:{color:'#EEF2F7'}, suggestedMin:300 },
        y1:{ position:'right', title:{display:true,text:'SBC % of revenue',font:{size:9}}, ticks:{callback:function(v){return v+'%';},font:{size:9}}, grid:{display:false}, min:0 },
        x:{ grid:{display:false}, ticks:{font:{size:10}} } } }
  });
}
function lyGovBody(c){
  var k=[
    ['Share & voting','1 vote / share','Dual-class collapsed Aug 2025 (founders 30% → <2%)'],
    ['Board','7 of 8 independent','Independent chair · classified board'],
    ['CEO pay · FY25','$2.8M','$0 new equity · ~18:1 ratio'],
    ['SBC · % of revenue','22.6% → 5.1%','FY21→FY25 · steep decline']
  ];
  var h='<p class="ov-lede">Lyft’s governance took a big step in <b>August 2025</b>: the <b>dual-class structure collapsed to one-share-one-vote</b> as co-founders Logan Green & John Zimmer left the board and their super-voting stock converted — their vote fell from ~30% to &lt;2%. The board is <b>7 of 8 independent</b> with a separate independent chair.</p>';
  h+='<div class="ov-kpis">'+k.map(function(f){return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(f[0])+'</div><div class="ov-kpi-v">'+esc(f[1])+'</div><div class="ov-kpi-d muted">'+esc(f[2])+'</div></div>';}).join('')+'</div>';
  h+=sec('Stock-based compensation & alignment — did buybacks offset it?',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Two things worth separating. At the <b>top</b>, alignment is cheap: CEO David Risher took a single large <b>performance-RSU in 2023</b> and <b>$0 new equity</b> since (~$2.8M FY25 pay, ~18:1 ratio). Company-<b>wide</b>, SBC was a real dilution drag — but a <b>shrinking</b> one, from a bloated <b>~22.6% of revenue (FY21)</b> to <b>~5.1% (FY25)</b>. With <b>no buybacks before 2025</b>, the share count still <b>rose FY22→FY24</b> (355M → 414M); only in <b>FY25</b>, once ~$500M of repurchases landed on top of falling SBC, did it <b>turn down</b> (~381M) — the first offset in company history.</div>'+
    '<div class="ov-chart-card" style="margin-top:10px"><div class="ov-chart-t">SBC as % of revenue vs shares outstanding <span>· FY2022–FY2025</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyChartSbc"></canvas></div></div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Bars = shares outstanding (left); line = SBC ÷ revenue (right). Bars peak FY24 and turn down FY25 — the inflection where buybacks + falling SBC first shrank the count. <span style="color:#B7791F">Shares are Summit estimates; SBC % from filings. Directional.</span></div>');
  return h;
}
var LY_TRACK_RATE={ green:{c:'#1E9E62',bg:'rgba(30,158,98,0.09)',bd:'rgba(30,158,98,0.34)',l:'Value creator'},
  amber:{c:'#B8860B',bg:'rgba(232,160,12,0.10)',bd:'rgba(232,160,12,0.34)',l:'Mixed / unproven'},
  red:{c:'#C0392B',bg:'rgba(192,57,43,0.09)',bd:'rgba(192,57,43,0.34)',l:'Value destroyer'} };
var LY_TRACK=[
  { id:'risher', n:'David Risher', role:'Chief Executive Officer', since:'2023', rate:'green',
    uber:'Cut ~26% of staff on arrival, simplified the business and delivered Lyft’s <b>first-ever GAAP profit</b> (Q2 2024, then FY2024), record rides/riders/FCF, and the first buyback. Introduced Price Lock, Women+ Connect and the AV partner strategy.',
    prior:'<b>Amazon (1997–2002)</b>: ~37th employee, SVP US Retail — scaled retail to <b>&gt;$4B</b>. Microsoft GM (launched Access). Founder/CEO of the nonprofit <b>Worldreader</b> (2009–2023).',
    detail:'<p><b>At Lyft (CEO since Apr 2023; board since 2021).</b> Led a decisive turnaround — cut ~26% of staff within days, refocused on riders/drivers, and delivered Lyft’s <b>first-ever quarter and full year of GAAP profitability</b> (Q2 2024 / FY2024), record Gross Bookings and cash flow, and the <b>inaugural $500M buyback</b> (Feb 2025). Drove customer-incentive efficiency and set 2026 as "the year of the AV."</p>'+
      '<p><b>Before Lyft.</b> <b>Amazon (1997–2002)</b> — ~37th employee, SVP US Retail, scaled the retail business past <b>$4B</b>. GM at <b>Microsoft</b> (launched Access, its first database product). Founder & CEO of <b>Worldreader</b> (2009–2023), a digital-books nonprofit — a social-impact role, not a commercial P&L.</p>'+
      '<p><b>Net read — value creator (green).</b> Turned a money-losing, founder-run company into a profitable, better-governed one. Caveat, not disqualifying: Lyft still has <b>no answer to Uber’s scale and diversification</b>, and the AV/robotaxi threat is unproven for the distant #2.</p>' },
  { id:'brewer', n:'Erin Brewer', role:'Chief Financial Officer', since:'2023', rate:'green',
    uber:'Co-architect of the profitability turnaround — oversaw the path to first full-year GAAP profit, record cash flow and the buyback; runs a stated ~$1.5B FCF strategy for the 2026–27 cycle.',
    prior:'MD, Enterprise Finance at <b>Charles Schwab</b>; Head of Strategy & Finance at <b>Atlassian</b>; <b>EVP & Chief Accounting Officer at McKesson</b> (Fortune-10).',
    detail:'<p><b>At Lyft (CFO since Jul 2023).</b> Co-architect of the financial inflection — the path to first full-year GAAP profit, record FCF ($1.12B FY25), and the share-repurchase program; manages a stated ~<b>$1.5B FCF</b> plan for 2026–27 while preserving investment capacity.</p>'+
      '<p><b>Before Lyft.</b> Managing Director, Enterprise Finance at <b>Charles Schwab</b> (2020–22); Head of Strategy and Finance at <b>Atlassian</b> (2018–20); ~13 years at <b>McKesson</b>, rising to <b>EVP & Chief Accounting Officer</b> of a Fortune-10 company.</p>'+
      '<p><b>Net read — value creator / credible (green).</b> Deep large-cap finance pedigree; her tenure coincides exactly with Lyft’s turn to durable profitability and cash generation.</p>' },
  { id:'llewellyn', n:'Lindsay Llewellyn', role:'Chief Legal Officer, Corporate Secretary', since:'2014 · CLO 2026', rate:'amber',
    uber:'A ~12-year internal riser (Lyft’s first in-house litigator) who managed a heavy litigation/regulatory docket — driver-classification, TNC regulation, safety litigation — and was promoted to CLO from within.',
    prior:'Associate at <b>Winston & Strawn</b> (2008–14); earlier a jury consultant. No prior C-suite/external-outcome record to grade.',
    detail:'<p><b>At Lyft (since 2014; CLO since Apr 2026).</b> Joined as Lyft’s first in-house litigator and rose over ~12 years managing the litigation and regulatory docket that <i>is</i> Lyft’s core risk — driver classification (Prop 22 and the state-by-state deals), TNC regulation and safety litigation — before being elevated to the top legal seat from within.</p>'+
      '<p><b>Before Lyft.</b> Associate at <b>Winston & Strawn</b> (2008–14); earlier a jury consultant. Limited external executive history.</p>'+
      '<p><b>Net read — solid but newly elevated (amber, leaning green).</b> The long internal tenure and successful defense of the contractor model are positives; the "unproven" tag is only that she stepped into the CLO role in April 2026.</p>' },
  { id:'rasmussen', n:'Dana Rasmussen', role:'Chief People Officer', since:'2025', rate:'amber',
    uber:'Joined mid-2025 to run People as Lyft scales its leaner, post-turnaround org — too new to have a Lyft value-creation record yet.',
    prior:'Chief People & Culture Officer at <b>Stitch Fix</b>; HR leadership at Honor, Flywheel, <b>Yahoo</b> and <b>Oracle</b>.',
    detail:'<p><b>At Lyft (CPO since Jul 2025).</b> Owns talent, culture and the People function for the leaner organization Lyft became after the 2023 restructuring. Too recent to have delivered a measurable Lyft outcome yet.</p>'+
      '<p><b>Before Lyft.</b> Chief People & Culture Officer at <b>Stitch Fix</b>; earlier HR leadership at Honor, Flywheel, <b>Yahoo</b> and <b>Oracle</b>.</p>'+
      '<p><b>Net read — capable but unproven here (amber).</b> Solid HR pedigree; a People seat carries limited direct value-creation signal, and her tenure is barely a year old.</p>' },
  { id:'golden', n:'Jerry Golden', role:'Chief Policy Officer', since:'2024', rate:'amber',
    uber:'Runs the policy and regulatory fight that <i>is</i> Lyft’s core risk — driver classification and TNC rules — a defensive, hard-to-quantify value role.',
    prior:'Policy leadership at <b>Eventbrite</b>, the <b>Internet Association</b>, Vanguard and the U.S. Chamber of Commerce.',
    detail:'<p><b>At Lyft (Chief Policy Officer since Aug 2024).</b> Leads the policy and regulatory agenda on the existential questions for the model — driver classification (Prop 22 and the state deals), TNC regulation, insurance rules. A defensive function: success looks like risk that never materializes.</p>'+
      '<p><b>Before Lyft.</b> Policy leadership at <b>Eventbrite</b>, the <b>Internet Association</b>, Vanguard and the U.S. Chamber of Commerce. Based in Washington, D.C.</p>'+
      '<p><b>Net read — competent, defensive (amber).</b> Relevant background for Lyft’s biggest risk; value creation is real but negative-space and hard to attribute.</p>' },
  { id:'smith', n:'Kevin S. Smith', role:'Chief Information Officer', since:'~2023', rate:'amber',
    uber:'Lyft’s top technology executive (there is no C-level CTO) — owns the tech and IT backbone; an execution seat more than a value-creation one.',
    prior:'30+ years in IT; <b>CIO at Cloudera</b>; senior IT roles at Aurora, <b>Stripe</b> and <b>Twitch</b>.',
    detail:'<p><b>At Lyft (CIO since ~2023).</b> Lyft’s senior-most technology leader, filling the role of a CTO the company does not currently have at C-level. Responsible for the engineering and IT backbone that keeps the marketplace running.</p>'+
      '<p><b>Before Lyft.</b> 30+ years in IT; <b>CIO at Cloudera</b>; senior IT roles at Aurora, <b>Stripe</b> and <b>Twitch</b>.</p>'+
      '<p><b>Net read — solid operator (amber).</b> Deep enterprise-technology pedigree; the seat is largely execution/reliability, so direct value creation is harder to isolate.</p>' },
  { id:'bird', n:'Jeremy Bird', role:'EVP, Global Growth', since:'Long-tenured', rate:'green',
    uber:'Drove Lyft’s <b>April 2026 London launch</b> (its first international market) and long ran growth and driver experience — a direct top-line lever.',
    prior:'National field director for the <b>Obama 2012 campaign</b>; earlier Chief Policy Officer at Lyft.',
    detail:'<p><b>At Lyft (long-tenured; EVP, Global Growth).</b> Leads global growth and drove Lyft’s <b>first international expansion</b> — the April 2026 London black-cab launch. Previously served as Chief Policy Officer and led Driver Experience, so he owns levers on both supply and demand.</p>'+
      '<p><b>Before Lyft.</b> National field director for the <b>Obama 2012 campaign</b> — large-scale voter mobilization, a growth/operations discipline he carried into Lyft.</p>'+
      '<p><b>Net read — value creator (green).</b> Owns a real top-line lever and executed the international launch; the "green" carries a caveat that the international payoff is still early.</p>' },
  { id:'kelman', n:'Jody Kelman', role:'Head of Lyft Autonomous', since:'Long-tenured', rate:'amber',
    uber:'Leads <b>Lyft Autonomous</b> — the AV partner strategy (May Mobility, Mobileye, Baidu) central to the 2026 robotaxi push but commercially unproven.',
    prior:'Long-tenured Lyft leader; previously led Lyft’s rider/customer product organization.',
    detail:'<p><b>At Lyft (long-tenured; Head of Lyft Autonomous).</b> Runs the autonomous-vehicle strategy that anchors the "be the network, not the carmaker" thesis — the May Mobility, Mobileye and Baidu partnerships and the 2026 robotaxi push. Strategically central, but the revenue is future optionality, not today’s P&L.</p>'+
      '<p><b>Before Lyft.</b> Previously led Lyft’s rider/customer product organization — a core-product background before moving to AV.</p>'+
      '<p><b>Net read — central but unproven (amber).</b> Owns the most important strategic bet; the grade stays amber until the AV network converts to real, paying supply.</p>' },
  { id:'patil', n:'Siddharth Patil', role:'EVP, Data Science', since:'Long-tenured', rate:'green',
    uber:'Owns <b>data science and marketplace efficiency</b> — matching, pricing and incentives — the machinery behind the unit-economics turn.',
    prior:'Long-tenured technical leader; career in data science and marketplace optimization.',
    detail:'<p><b>At Lyft (long-tenured; EVP, Data Science).</b> Leads data science and marketplace efficiency — the matching, pricing and incentive systems that determine take rate and driver-incentive spend. The incentive-efficiency gains that helped drive the turn to profitability run through this org.</p>'+
      '<p><b>Before Lyft.</b> A long-tenured technical leader whose career centers on data science and marketplace optimization.</p>'+
      '<p><b>Net read — quietly value-creating (green).</b> Less visible than the C-suite, but the marketplace-efficiency work shows up directly in Lyft’s unit economics.</p>' }
];
function lyTrackBody(c){
  var legend=Object.keys(LY_TRACK_RATE).map(function(kk){ var r=LY_TRACK_RATE[kk]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=LY_TRACK.map(function(m){ var r=LY_TRACK_RATE[m.rate];
    return '<div class="trk-card ov-clickable" data-detail="exec:'+m.id+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:11px;padding:13px 15px;cursor:pointer;transition:.14s">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(m.n)+'</div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+r.c+'">'+r.l+'</div></div>'+
      '<div style="font-size:11px;color:var(--mu);font-weight:600;margin:1px 0 8px">'+m.role+' · at Lyft since '+esc(m.since)+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:6px"><b style="color:'+r.c+'">At Lyft:</b> '+m.uber+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5"><b style="color:var(--mu)">Before:</b> '+m.prior+'</div>'+
      '<div class="ov-more" style="margin-top:7px">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running Lyft today, rated on <b>what they have actually built</b> — a <b>Lyft</b> record and a <b>prior-roles</b> record for each. Lyft publishes only <b>three statutory officers</b> (Risher, Brewer, Llewellyn), but the operating bench is deeper — this is the <b>wider leadership team</b> from Executives & Board. Color = the net read; <b>tap a card</b> for the full history.</p>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+cards+'</div>';
  h+='<style>.trk-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08)}</style>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>The founders have stepped away.</b> Co-founders <b>Logan Green</b> (ex-CEO) and <b>John Zimmer</b> (ex-President) built Lyft from Zimride into the US #2 and took it public in 2019 — genuine company-builders — but the pre-Risher era <b>never delivered profitability</b>, which is exactly what prompted the 2023 CEO change. Both <b>left the board in Aug 2025</b> and converted their super-voting stock, so they are no longer management and no longer control the vote.</div>';
  h+='<div class="ov-foot">Roster and titles per Lyft’s leadership page (mid-2026) and the FY2025 10-K; prior-role outcomes from company/press sources. Ratings are an editorial read, not a Summit output.</div>';
  return h;
}
// ── Bottom Line ▸ Margins — profitability & cash margins as a % of revenue. Renders from a sourced
// fallback history so the chart is never empty; the live Massive feed (api.fetchMargins) overrides
// the fallback when it is reachable. ──
var LY_MRG_METRICS=[
  {key:'gross',label:'Gross',color:'#E6007A'},
  {key:'oper',label:'Operating',color:'#6B2BD9'},
  {key:'net',label:'Net',color:'#7A5AF8'},
  {key:'ebitda',label:'EBITDA',color:'#12B5A5'},
  {key:'cfo',label:'CFO',color:'#F2A73B'},
  {key:'fcf',label:'FCF',color:'#EB5757'}
];
// Sourced fallback (% of revenue): gross/op/net = GAAP; EBITDA = Adjusted EBITDA %; CFO & FCF ÷ revenue.
// FY2021–FY2025 actuals (Lyft filings); FY2026E = Summit model. Overridden by live Massive.
var LY_MRG_FALLBACK=[
  {fy:'FY21', gross:46.9, oper:-35.4, net:-33.1, ebitda:-4.9,  cfo:-3.2, fcf:-5.6},
  {fy:'FY22', gross:40.5, oper:-35.6, net:-38.7, ebitda:-10.2, cfo:-5.8, fcf:-8.6},
  {fy:'FY23', gross:42.2, oper:-10.8, net:-7.7,  ebitda:5.1,   cfo:-2.2, fcf:-5.6},
  {fy:'FY24', gross:42.3, oper:-2.1,  net:0.4,   ebitda:6.6,   cfo:14.7, fcf:13.2},
  {fy:'FY25', gross:41.5, oper:-3.0,  net:45.0,  ebitda:8.4,   cfo:18.5, fcf:17.7},
  {fy:'FY26E',gross:47.0, oper:2.4,   net:2.3,   ebitda:9.4,   cfo:17.2, fcf:16.1, proj:true}
];
var LY_MRG_NOTE_FB='Gross / operating / net = <b>GAAP</b>; EBITDA = <b>Adjusted EBITDA</b> % of revenue; CFO & FCF ÷ revenue. <b>FY26E</b> = Summit model. Note: <b>FY25 GAAP net margin (+45%) is a one-time ~$2.9B tax-valuation-allowance benefit</b> — operating margin was still slightly negative. Read <b>EBITDA, CFO and FCF</b> as the clean turn to profitability. <span style="color:#B7791F">Directional fallback; the live Massive feed overrides it when reachable.</span>';
var LY_MRG_NOTE_LIVE='Historical margins computed <b>live from Massive</b> (income & cash-flow statements): gross/op/net = line ÷ revenue; EBITDA = (op income + D&A) ÷ revenue; CFO & FCF ÷ revenue. Note FY25 GAAP net is skewed by a one-time deferred-tax benefit — EBITDA/CFO/FCF are the clean trend.';
var _lyMrgRows=LY_MRG_FALLBACK.slice();
var _lyMrgSrc='fallback';
function lyMarginsBody(c){
  return '<p class="ov-lede">Profitability & cash margins as a % of revenue — gross, operating and net, plus Adjusted EBITDA, CFO and FCF. The turnaround reads cleanest in <b>EBITDA</b> and <b>cash</b> margin, which flipped from deeply negative (FY21–22) to the mid-to-high teens as insurance cost per ride fell.</p>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of revenue) <span>· fiscal years · FY26E = estimate</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyChartMargins"></canvas></div></div>'+
    '<div class="ave-subh-note" id="lyMrgNote" style="margin-top:8px">'+LY_MRG_NOTE_FB+'</div>';
}
function buildLyMargins(){
  var cv=document.getElementById('lyChartMargins'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('lyChartMargins');
  var labels=_lyMrgRows.map(function(r){ return r.fy; });
  var projIdx=_lyMrgRows.reduce(function(a,r,i){ return r.proj?i:a; }, -1);
  var ds=LY_MRG_METRICS.map(function(m){ return { label:m.label, data:_lyMrgRows.map(function(r){ return r[m.key]; }), borderColor:m.color, backgroundColor:m.color, borderWidth:2, tension:.25, spanGaps:true, fill:false,
    pointRadius:_lyMrgRows.map(function(r){ return r.proj?4:2; }), pointStyle:_lyMrgRows.map(function(r){ return r.proj?'rectRot':'circle'; }),
    segment:{ borderDash:function(ctx){ return ctx.p1DataIndex===projIdx?[5,4]:undefined; } } }; });
  _charts['lyChartMargins']=new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return l==='FY26E'?'FY26E · estimate':l; }, label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
      scales:{ y:{ ticks:{ callback:function(v){ return v+'%'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
  lyLoadMargins();
}
function lyLoadMargins(){
  if(_lyMrgSrc==='massive') return;
  import('../api.js').then(function(api){ return api.fetchMargins?api.fetchMargins('LYFT'):null; }).then(function(res){
    if(!res||!res.success||!res.data||res.data.length<3) return; // keep fallback
    var proj=LY_MRG_FALLBACK[LY_MRG_FALLBACK.length-1];
    _lyMrgRows=res.data.concat(proj&&proj.proj?[proj]:[]);
    _lyMrgSrc='massive';
    var note=document.getElementById('lyMrgNote'); if(note) note.innerHTML=LY_MRG_NOTE_LIVE;
    buildLyMargins();
  }).catch(function(){ /* keep fallback */ });
}

// ─── Pane: Strategy ───────────────────────────────────────────────────────────
function lyLogo(name,ticker,domain){
  var primary=ticker?'https://assets.parqet.com/logos/symbol/'+ticker:'https://logo.clearbit.com/'+domain;
  var clear='https://logo.clearbit.com/'+domain, fav='https://www.google.com/s2/favicons?domain='+domain+'&sz=64';
  var onerr="this.onerror=function(){this.onerror=null;this.src='"+fav+"'};this.src='"+clear+"'";
  return '<div class="lmb-logo" title="'+esc(name)+'"><img src="'+primary+'" alt="'+esc(name)+'" loading="lazy" onerror="'+onerr+'"></div>';
}
function membershipViz(){
  var logos=lyLogo('United','UAL','united.com')+lyLogo('Hilton','HLT','hilton.com')+lyLogo('DoorDash','DASH','doordash.com')+lyLogo('Chase','JPM','chase.com')+lyLogo('Bilt',null,'biltrewards.com');
  var h='<style>'+
    '.mem-tiers{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:2px 0 0}'+
    '.mem-t{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}'+
    '.mem-t.hl{border-top:3px solid var(--brand);background:var(--brand-soft)}'+
    '.mem-t-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.mem-price{font-size:19px;font-weight:800;color:var(--brand);margin:3px 0 8px}.mem-price small{font-size:12px;color:var(--mu);font-weight:600}'+
    '.mem-perk{font-size:12px;color:var(--navy);line-height:1.5;padding-left:17px;position:relative;margin-top:5px}'+
    '.mem-perk:before{content:"✓";position:absolute;left:0;color:#1E9E62;font-weight:800}'+
    '.mem-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}'+
    '.mem-box{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}'+
    '.mem-box-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:5px}'+
    '.mem-box-d{font-size:12px;color:var(--navy);line-height:1.55}.mem-box-d b{font-weight:800}'+
    '.mem-logos{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}'+
    '.lmb-logo{width:30px;height:30px;border-radius:6px;background:#fff;border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;overflow:hidden}.lmb-logo img{max-width:22px;max-height:22px;object-fit:contain}'+
    '@media(max-width:720px){.mem-tiers,.mem-two{grid-template-columns:1fr}}'+
  '</style>';
  h+='<p class="ov-lede" style="margin:0 0 12px">Lyft runs a <b>three-layer loyalty stack</b>: a paid membership (<b>Lyft Pink</b>), a surge-hedge subscription (<b>Price Lock</b>), and <b>borrowed loyalty</b> from partners. Here is each — and where the weight actually sits.</p>';
  h+='<div class="ov-subh">Lyft Pink — the membership (two tiers)</div>';
  h+='<div class="mem-tiers">'+
    '<div class="mem-t"><div class="mem-t-n">Lyft Pink</div><div class="mem-price">$9.99<small>/mo · or $99/yr</small></div>'+
      '<div class="mem-perk">Free Priority Pickup upgrades (~$3–4/ride)</div>'+
      '<div class="mem-perk">5% off Standard, Extra Comfort & XL</div>'+
      '<div class="mem-perk">Up to 3 cancel-fee credits / month</div>'+
      '<div class="mem-perk">Waived Lost & Found fees</div>'+
      '<div class="mem-perk">1 free bike/scooter unlock / mo (12 / yr on annual)</div></div>'+
    '<div class="mem-t hl"><div class="mem-t-n">Lyft Pink All Access</div><div class="mem-price">$199<small>/yr</small></div>'+
      '<div class="mem-perk"><b>Everything in Pink, plus:</b></div>'+
      '<div class="mem-perk">+10% off Black & Black SUV</div>'+
      '<div class="mem-perk">Unlimited 45-min classic bike rides</div>'+
      '<div class="mem-perk">Unlimited ebike & scooter unlocks</div>'+
      '<div class="mem-perk">5 free guest unlocks + Bike Angels</div></div>'+
  '</div>';
  h+='<div style="font-size:11.5px;color:var(--mu);line-height:1.55;margin:9px 2px 2px"><b>Strategic read:</b> Lyft <b>roughly halved the price in a 2023 relaunch</b> (from ~$19.99/mo) — repositioning Pink from a premium perk into a <b>mass-market retention tool</b>, and it rarely discloses member counts, a tell that scale (not price) is the goal. Note the perks skew hard to <b>bikes & scooters</b> — Pink quietly doubles as the loyalty layer for Lyft\'s micromobility network, not just rideshare.</div>';
  h+='<div class="mem-two">'+
    '<div class="mem-box"><div class="mem-box-h">Price Lock — a surge hedge · $2.99/mo per route</div>'+
      '<div class="mem-box-d">Locks a commute route at its <b>historical-average price</b>; you pay the <b>lower</b> of locked vs market — up to <b>$50/mo saved</b> per route, up to <b>10 routes</b>. Since Sept 2024: <b>200k+ active passes</b> within weeks and <b>1.6M</b> locked rides by Q4 2024. CEO Risher calls surge rideshare’s “most hated feature.”</div></div>'+
    '<div class="mem-box"><div class="mem-box-h">Borrowed loyalty — the partnership channel</div>'+
      '<div class="mem-logos">'+logos+'</div>'+
      '<div class="mem-box-d">Taps partner member bases at low CAC: United MileagePlus, Alaska, Hilton Honors, Bilt (2×), DoorDash DashPass, Chase Sapphire ($10/mo credit to 2027) → a record <b>27% of rides</b>. <b>Caveat:</b> when Delta ended its Lyft tie-up (Apr 2025), ~2% of bookings walked with it.</div></div>'+
  '</div>';
  h+='<div class="ov-fynote" style="margin-top:11px"><b>Where the weight sits:</b> the paid tiers are deliberately modest — Lyft does not even disclose Pink member counts — so the <b>partnership channel does the heavy lifting</b>. Capital-light and low-CAC, but Lyft does not own those relationships, so loyalty can walk when a partner leaves.</div>';
  return h;
}
var FW_DETAIL=[
  {t:'1 · Obsess over both sides', h:'Lyft&rsquo;s core belief: <b>the driver is Lyft&rsquo;s customer; the rider is the driver&rsquo;s customer.</b> Both sides of the marketplace are the product.<br><br><b>For drivers:</b> a <b>70% earnings guarantee</b> each week (after external fees) since Feb 2024 &mdash; the industry&rsquo;s only such floor; upfront pay + destination shown before accepting; Express Pay instant cashout.<br><br><b>For riders:</b> the <b>On-Time Pickup Promise</b> (credit if late), <b>Women+ Connect</b>, and <b>Price Lock</b>.<br><br><b>Why it matters:</b> happier drivers stay &rarr; reliable supply &rarr; better rider experience &rarr; the wheel turns. The opposite of squeezing either side for short-term margin.'},
  {t:'2 · Riders & rides grow', h:'A better experience pulls in <b>more riders, riding more often</b>.<br><br><b>Riders:</b> a record <b>~29M</b> active (Q4 2025), +18% YoY.<br><br><b>Frequency levers:</b> <b>Price Lock</b> (locks a commute route near its average price &mdash; kills surge, rideshare&rsquo;s &ldquo;most hated feature&rdquo;; 1.6M locked rides by Q4 2024), <b>Lyft Pink</b> membership, and the <b>partnership machine</b> (United, Chase Sapphire, DoorDash DashPass, Bilt) &mdash; now <b>~1 in 4 NA rides</b> comes through a partner at low CAC.<br><br><b>The catch:</b> in 2025 frequency turned <i>negative</i> as growth shifted to pure acquisition &mdash; the contestable point (see Rides & Riders).'},
  {t:'3 · Marketplace densifies', h:'More riders + more drivers in the same city = <b>a denser marketplace</b>, which is <i>self-improving</i>.<br><br><b>What density buys:</b> faster matching, shorter ETAs, fewer unfilled requests, less need for surge. Marketplace efficiency compounds <b>~10% a year</b>, and <b>Prime-Time surge fell ~40% over two years</b> &mdash; riders pay less <i>and</i> drivers stay busier at once.<br><br><b>Why it is a moat:</b> density is a <b>local network effect</b> &mdash; expensive for a #2 to replicate city-by-city, and it lets Lyft improve price and reliability without spending more.'},
  {t:'4 · Economics improve', h:'A denser, more efficient marketplace + falling <b>insurance cost per ride</b> = <b>more gross profit per ride</b>, without charging riders more or paying drivers less.<br><br><b>The proof:</b> gross profit/ride ~<b>$3.32</b> (Q1 2026); the turnaround took Adj. EBITDA from <b>&minus;$417M to +$529M</b> and FCF from <b>&minus;$222M to +$1.12B</b>.<br><br><b>The loop closes here:</b> that profit funds <b>more driver incentives & rider value</b> (step 1), which deepens the marketplace (step 3), which improves economics again. <b>Growth is the output of the loop, not an input you buy.</b>'}
];
function lyFlywheel(){
  function node(x,y,w,hh,t,sub,i){
    return '<g class="lyfw-node ov-clickable" data-detail="fw:'+i+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="11" fill="#fff" stroke="#E6007A" stroke-width="1.5"/>'+
      '<text x="'+(x+w/2)+'" y="'+(y+hh/2-4)+'" text-anchor="middle" font-size="11.5" font-weight="800" fill="#c0006a">'+t+'</text>'+
      '<text x="'+(x+w/2)+'" y="'+(y+hh/2+13)+'" text-anchor="middle" font-size="9.5" fill="#3A4552">'+sub+'</text>'+
      '<text x="'+(x+w-9)+'" y="'+(y+15)+'" text-anchor="end" font-size="12" font-weight="900" fill="#E6007A">+</text></g>';
  }
  var h='<style>'+
    '@keyframes lyfwspin{to{stroke-dashoffset:-26}}'+
    '.lyfw-arw{stroke:#E6007A;stroke-width:4;fill:none;stroke-dasharray:9 7;animation:lyfwspin 1s linear infinite;stroke-linecap:round}'+
    '.lyfw-node{cursor:pointer}.lyfw-node rect{transition:.12s}.lyfw-node:hover rect{stroke-width:2.5;filter:drop-shadow(0 2px 5px rgba(0,0,0,.12))}'+
    '.lyfw-src{margin-top:16px}.lyfw-src-h{font-size:12.5px;font-weight:800;color:var(--navy);margin:0 0 9px;padding-bottom:4px;border-bottom:1px solid var(--bdr)}'+
    '.lyfw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.lyfw-grid{grid-template-columns:1fr}}'+
    '.lyfw-c{border:1px solid var(--bdr);border-left:3px solid #E6007A;border-radius:10px;padding:11px 13px}'+
    '.lyfw-c-h{font-size:12px;font-weight:800;color:var(--navy);margin-bottom:3px}.lyfw-c-d{font-size:11.5px;color:var(--navy);line-height:1.5}.lyfw-c-d b{font-weight:800}'+
    '.lyfw-punch{font-size:11.5px;color:var(--navy);line-height:1.6;background:var(--brand-soft);border-radius:9px;padding:11px 14px;margin-top:14px}.lyfw-punch b{font-weight:800}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Lyft&rsquo;s Investor-Day thesis is a <b>wheel, not a list</b>: obsess over both sides &rarr; the marketplace densifies &rarr; economics improve &rarr; that funds more driver pay & rider value &rarr; the wheel spins faster. <b>Tap any stage (+)</b> for the mechanics.</div>';
  h+='<div style="border:1px solid var(--bdr);border-radius:14px;background:linear-gradient(180deg,#fffafd,#fff);padding:4px 2px"><svg viewBox="0 0 640 470" role="img" aria-label="Lyft growth flywheel" style="width:100%;height:auto;font-family:Inter,sans-serif">';
  h+='<defs><marker id="lyfwh" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#E6007A"/></marker></defs>';
  // clockwise arrows N->E->S->W->N
  h+='<path class="lyfw-arw" d="M434 58 Q 566 74 548 196" marker-end="url(#lyfwh)"/>';
  h+='<path class="lyfw-arw" d="M548 272 Q 566 398 434 412" marker-end="url(#lyfwh)"/>';
  h+='<path class="lyfw-arw" d="M206 412 Q 74 398 92 272" marker-end="url(#lyfwh)"/>';
  h+='<path class="lyfw-arw" d="M92 196 Q 74 74 206 58" marker-end="url(#lyfwh)"/>';
  // hub
  h+='<circle cx="320" cy="234" r="74" fill="rgba(230,0,122,0.06)" stroke="#E6007A" stroke-width="2"/>';
  h+='<text x="320" y="222" text-anchor="middle" font-size="13" font-weight="900" fill="#c0006a" font-family="Inter,sans-serif">Customer obsession</text>';
  h+='<text x="320" y="242" text-anchor="middle" font-size="11" font-weight="700" fill="#E6007A" font-family="Inter,sans-serif">&rarr; profitable growth</text>';
  h+='<text x="320" y="262" text-anchor="middle" font-size="9" fill="#6b7684" font-family="Inter,sans-serif">~15% bookings CAGR &middot; ~4% margin (2027)</text>';
  // nodes
  h+=node(206,30,228,56,'1 &middot; Obsess over both sides','70% driver floor &middot; On-Time Promise &middot; Women+',0);
  h+=node(450,200,182,66,'2 &middot; Riders & rides grow','Price Lock &middot; ~1 in 4 rides via partners',1);
  h+=node(206,384,228,56,'3 &middot; Marketplace densifies','better matching &middot; surge &minus;40% in 2 yrs',2);
  h+=node(8,200,182,66,'4 &middot; Economics improve','~10%/yr efficiency &middot; lower cost/ride',3);
  h+='</svg></div>';
  // where growth comes from
  h+='<div class="lyfw-src"><div class="lyfw-src-h">Where the ~15% bookings CAGR actually comes from</div><div class="lyfw-grid">'+
    '<div class="lyfw-c"><div class="lyfw-c-h">More riders</div><div class="lyfw-c-d">Record <b>~29M</b> active riders — against <b>161B</b> untapped US personal-vehicle trips a year.</div></div>'+
    '<div class="lyfw-c"><div class="lyfw-c-h">Higher frequency</div><div class="lyfw-c-d">Price Lock, Lyft Pink membership and partnerships now touch <b>~1 in 4 rides</b>.</div></div>'+
    '<div class="lyfw-c"><div class="lyfw-c-h">New modes & geographies</div><div class="lyfw-c-d">Bikes/scooters (Citi Bike <b>46M+</b> rides), Europe via <b>FreeNow</b>, and premium tiers.</div></div>'+
    '<div class="lyfw-c"><div class="lyfw-c-h">Higher-margin engines</div><div class="lyfw-c-d"><b>Lyft Media</b> ~$100M &rarr; &gt;$400M by 2027 at ~100% margin — grows the <b>margin</b>, not just volume.</div></div>'+
  '</div></div>';
  h+='<div class="lyfw-punch"><b>The point of the wheel:</b> growth is the <b>output</b>, not the input. Each turn — better experience, more density, better economics — makes the next turn cheaper, which is how a once cash-burning marketplace now compounds bookings <i>and</i> margin at the same time.</div>';
  return h;
}
function strategyBody(c){
  var ARC=[['Adj. EBITDA','−$417M','+$529M'],['Free cash flow','−$222M','+$1.12B'],['GAAP net income','−$1.6B loss','profitable (2024)'],['Adj. EBITDA margin','negative','2.9% of GB'],['Active riders (Q4)','20.4M','29.2M']];
  var TGT=[
    { t:'Gross Bookings CAGR ~15%', how:'Marketplace efficiency, new modes (bikes, Europe via FreeNow), and partnerships — <b>&gt;1 in 4 NA rides</b> is now partnership-tied (DoorDash the largest ever).', base:'$13.8B (2023)', now:'$18.5B (2025, +15%)', st:'on / ahead of pace', ok:true },
    { t:'Adj. EBITDA margin ~4% of GB by 2027', how:'~10%/yr marketplace-efficiency gains, <b>incentive efficiency</b> (17% delivered vs a ~10% goal), and <b>Lyft Media</b> ads scaling ~4× ($100M run-rate → &gt;$400M by 2027).', base:'1.6% (2023)', now:'2.9% (2025)', st:'the hardest — ~110 bps to go in 2 years', ok:false },
    { t:'FCF conversion &gt;90% of Adj. EBITDA', how:'Asset-light model + working-capital and insurance-timing discipline; buybacks now scaling ($1B authorized).', base:'negative (2023)', now:'&gt;100%; $1.12B FCF (2025)', st:'blown past — hit &gt;$1B FCF ~2 years early', ok:true },
  ];
  var h='<style>'+
    '.lst-arc{display:grid;grid-template-columns:1fr 40px 1fr;gap:10px;align-items:stretch;border:1px solid var(--bdr);border-radius:14px;padding:15px;background:#fff}@media(max-width:600px){.lst-arc{grid-template-columns:1fr}}'+
    '.lst-ch{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:9px}.lst-was .lst-ch{color:#C0392B}.lst-now .lst-ch{color:#1E9E62}'+
    '.lst-r{display:flex;justify-content:space-between;gap:8px;font-size:11.5px;padding:5px 0;border-bottom:1px dashed var(--bdr)}.lst-rl{color:var(--mu)}.lst-rv{font-weight:800;color:var(--navy)}'+
    '.lst-was .lst-rv{color:#C0392B}.lst-now .lst-rv{color:#1E9E62}'+
    '.lst-arw{display:flex;align-items:center;justify-content:center;font-size:22px;color:#1E9E62;font-weight:900}@media(max-width:600px){.lst-arw{transform:rotate(90deg)}}'+
    '.lst-cap{font-size:11px;color:var(--mu);line-height:1.55;margin-top:9px}.lst-cap b{color:var(--navy);font-weight:800}'+
    '.lst-pil{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}'+
    '.lst-pc{border:1px solid var(--bdr);border-top:2px solid var(--brand);border-radius:10px;padding:11px 13px}.lst-pc-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:4px}.lst-pc-d{font-size:11.5px;color:var(--navy);line-height:1.5}.lst-pc-d b{font-weight:800}'+
    '.lst-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:11px}.lst-chip{font-size:10.5px;font-weight:700;color:var(--brand);background:var(--brand-soft);border-radius:20px;padding:3px 10px}'+
    '.lst-tg{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;margin:9px 0}'+
    '.lst-tg-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline}'+
    '.lst-tg-t{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.lst-tg-st{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.3px;border-radius:20px;padding:2px 9px}.lst-ok{color:#1E9E62;background:rgba(30,158,98,0.12)}.lst-hard{color:#B26A00;background:rgba(255,165,0,0.14)}'+
    '.lst-tg-h{font-size:11.5px;color:var(--navy);line-height:1.55;margin:7px 0}.lst-tg-h b{font-weight:800}'+
    '.lst-tg-p{font-size:11px;color:var(--mu)}.lst-tg-p b{color:var(--navy);font-weight:800}'+
    '.lst-av{background:linear-gradient(180deg,rgba(230,0,122,0.05),transparent);border:1px solid var(--bdr);border-left:3px solid var(--brand);border-radius:11px;padding:13px 15px;font-size:12px;color:var(--navy);line-height:1.6}.lst-av b{font-weight:800}'+
  '</style>';
  h+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--brand);margin:0 0 8px">The core · is the marketplace healthy & improving?</div>';
  h+='<p class="ov-lede">It all ladders up to Lyft’s June-2024 Investor Day line — <b>&ldquo;customer obsession drives profitable growth.&rdquo;</b> The turnaround (top of the Overview) is the <i>result</i>; this is the operating system behind it.</p>';
  // 1 - the arc
  var rows=function(side,idx){ return ARC.map(function(a){ return '<div class="lst-r"><span class="lst-rl">'+esc(a[0])+'</span><span class="lst-rv">'+a[idx]+'</span></div>'; }).join(''); };
  h+=sec('The turnaround — from → to',
    '<div class="lst-arc"><div class="lst-was"><div class="lst-ch">Was · 2022</div>'+rows('was',1)+'</div>'+
    '<div class="lst-arw">→</div>'+
    '<div class="lst-now"><div class="lst-ch">Now · 2025</div>'+rows('now',2)+'</div></div>'+
    '<div class="lst-cap">Real — but it lives in <b>cash flow and riders, not the multiple yet</b>: the stock still sits far below its $72 IPO, and FY2025’s headline <b>$2.8B is mostly a one-time tax benefit</b>, not operating profit.</div>');
  // 2 - the playbook
  h+=sec('The playbook — the flywheel that compounds', lyFlywheel());
  // M&A moved to Evolution ▸ Company History & M&A (single home) — see historyStoryBody().
  // 4 - targets with the how
  h+=sec('The 2027 targets — and HOW Lyft gets there',
    TGT.map(function(t){ return '<div class="lst-tg"><div class="lst-tg-top"><span class="lst-tg-t">'+t.t+'</span><span class="lst-tg-st '+(t.ok?'lst-ok':'lst-hard')+'">'+esc(t.st)+'</span></div>'+
      '<div class="lst-tg-h"><b>How:</b> '+t.how+'</div>'+
      '<div class="lst-tg-p">'+esc(t.base)+' &nbsp;→&nbsp; <b>'+t.now+'</b></div></div>'; }).join('')+
    '<div class="ov-diagram-cap" style="margin-top:6px">Set June 2024 (FY24→FY27): ~$25B GB / ~$1B Adj. EBITDA / &gt;$1B FCF. CFO Erin Brewer: <i>&ldquo;we over-delivered on every target&rdquo;</i> in year one.</div>');
  // 5 - the AV bet
  h+=sec('The AV bet — be the network, not the carmaker',
    '<div class="lst-av">Lyft’s contrarian bet: <b>don’t build the self-driving car — be the network every AV plugs into.</b> The <b>hybrid network</b> treats AVs as baseline supply and human drivers as the flex, kept asset-light via <b>Flexdrive</b> (a claimed <b>&gt;20% per-mile cost edge</b>). Risher’s yardstick: ~<b>10% AV by 2030</b> would be &ldquo;an enormous success.&rdquo;</div>'+
    '<div class="lst-chips" style="margin-top:9px"><span class="lst-chip">May Mobility · Atlanta</span><span class="lst-chip">Mobileye · Dallas</span><span class="lst-chip">Baidu Apollo Go · Europe</span><span class="lst-chip">Waymo · Nashville — paid no matter what</span></div>');
  // 6 - membership + ecosystem lived here once; it was MOVED whole to Bottom Line ▸ Suppliers
  // (lySuppliersBody → supplySection()). No orphan header here — the content has a single home.
  return h;
}

// ─── Pane: Rides & Riders ─────────────────────────────────────────────────────
// Growth-decomposition lever: bookings growth = riders x frequency x price, per year.
var DECOMP_NOTES=[
  '',
  '<b>2023 — recovery, at the price of price.</b> Riders returned and rode <i>more</i> (frequency added ~8pts), but bookings/ride fell: the Uber–Lyft fare war, less Prime Time, and the new driver-earnings floor were all contra-revenue. Volume-led growth, bought with lower prices.',
  '<b>2024 — both engines firing.</b> Riders and frequency both grew; bookings/ride roughly flat. Lyft posted its first full-year GAAP profit under Risher. The up-market tilt had begun but had not yet shown up in price per ride.',
  '<b>2025 — the inflection.</b> A record +18% rider surge, but each new cohort rode <i>less</i> — frequency turned NEGATIVE for the first time. Growth flips from engagement to pure acquisition, and the up-market push barely lifted bookings/ride against tough price competition.',
  '<b>2026E — the model bets on mix.</b> The Summit model assumes bookings/ride jumps sharply (up-market mix + insurance-driven pricing) while volume decelerates. This is a price/mix bet: if the mix does not deliver, the year misses.',
  '<b>2027E — the glide to the target.</b> Modest rider growth + continued mix-up ≈ the pace needed for the ~15% Gross-Bookings CAGR the Investor Day promised for 2027. It leans on the mix bet continuing to pay.',
  '<b>2028E — maturing.</b> Growth eases toward ~8%; riders and mix carry it while frequency stays ~flat. The model treats Lyft as a durable compounder past the target.',
  '<b>2029E — steady state.</b> A ~7% rider-led bookings increase, frequency contributing little. Durable, but no re-acceleration in the model.',
];
function decompCalc(i){
  var gR=(A_RIDERS[i]/A_RIDERS[i-1]-1)*100, gRd=(A_RIDES[i]/A_RIDES[i-1]-1)*100, gGB=(A_GB[i]/A_GB[i-1]-1)*100;
  return { r:gR, f:((1+gRd/100)/(1+gR/100)-1)*100, p:((1+gGB/100)/(1+gRd/100)-1)*100, gb:gGB };
}
function decompBar(label,v,mx){
  var w=(Math.abs(v)/mx*46).toFixed(1);
  var pos=v>=0?('left:50%;width:'+w+'%'):('left:'+(50-w).toFixed(1)+'%;width:'+w+'%');
  var bcls=v>=0?'gd-pos':'gd-neg', vcls=v>=0?'gd-posv':'gd-negv';
  return '<div class="gd-row"><div class="gd-l">'+label+'</div><div class="gd-track"><div class="gd-bar '+bcls+'" style="'+pos+'"></div></div><div class="gd-v '+vcls+'">'+(v>=0?'+':'−')+Math.abs(v).toFixed(1)+'%</div></div>';
}
function renderDecomp(i){
  var box=document.getElementById('lyDecompBars'); if(!box) return;
  var d=decompCalc(i), mx=Math.max(Math.abs(d.r),Math.abs(d.gb),Math.abs(d.p),Math.abs(d.f),1);
  var wN=(Math.abs(d.gb)/mx*46).toFixed(1);
  box.innerHTML=decompBar('Active riders',d.r,mx)+decompBar('Ride frequency',d.f,mx)+decompBar('Bookings / ride',d.p,mx)+
    '<div class="gd-row net"><div class="gd-l"><b>= Gross Bookings</b></div><div class="gd-track"><div class="gd-bar gd-brand" style="left:50%;width:'+wN+'%"></div></div><div class="gd-v gd-brandv">'+(d.gb>=0?'+':'−')+Math.abs(d.gb).toFixed(1)+'%</div></div>';
  var est=(i>=FIRST_EST);
  var per=document.getElementById('lyDecompPeriod'); if(per) per.innerHTML='FY'+YEARS[i-1]+' → FY'+YEARS[i]+(est?'<span class="gd-est">model estimate</span>':'');
  var note=document.getElementById('lyDecompNote'); if(note) note.innerHTML=DECOMP_NOTES[i]||'';
}
function growthBody(c){
  var f24=(A_RIDES[2]/A_RIDERS[2]);
  var h='<style>'+
    '.gd-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:4px 0 12px}'+
    '.gd-period{font-size:13px;font-weight:700;color:var(--navy)}.gd-period b{color:var(--brand)}'+
    '.gd-est{font-size:10.5px;font-weight:700;color:var(--mu);background:rgba(138,147,160,0.15);border-radius:10px;padding:2px 8px;margin-left:7px}'+
    '.gd-slwrap{display:flex;flex-direction:column;gap:3px;min-width:200px;max-width:300px;flex:1}'+
    '.gd-ticks{display:flex;justify-content:space-between;font-size:10px;color:var(--mu);font-weight:600;padding:0 1px}'+
    '.gd-slider{-webkit-appearance:none;appearance:none;height:5px;border-radius:3px;background:linear-gradient(90deg,#1E9E62,#E6007A);outline:none;width:100%}'+
    '.gd-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid var(--brand);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.2)}'+
    '.gd-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid var(--brand);cursor:pointer}'+
    '.gd-row{display:grid;grid-template-columns:120px 1fr 54px;align-items:center;gap:10px;margin:6px 0}'+
    '.gd-l{font-size:12px;font-weight:600;color:var(--navy)}'+
    '.gd-track{position:relative;height:20px;background:rgba(138,147,160,0.08);border-radius:5px}'+
    '.gd-track:before{content:"";position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:#C7CED6}'+
    '.gd-bar{position:absolute;top:3px;bottom:3px;border-radius:3px}'+
    '.gd-pos{background:#1E9E62}.gd-neg{background:#C0392B}.gd-brand{background:var(--brand)}'+
    '.gd-v{font-size:12px;font-weight:800;text-align:right}'+
    '.gd-posv{color:#1E9E62}.gd-negv{color:#C0392B}.gd-brandv{color:var(--brand)}'+
    '.gd-row.net{border-top:1px solid var(--bdr);padding-top:9px;margin-top:9px}'+
    '.gd-freq{background:var(--brand-soft);border-radius:9px;padding:12px 15px;margin:12px 0 2px;font-size:12.5px;color:var(--navy);line-height:1.55}.gd-freq b{font-weight:800}'+
  '</style>';
  h+='<p class="ov-lede">Gross Bookings = <b>active riders × ride frequency × bookings/ride</b>. Split the growth into those three drivers and the story <i>shifts year to year</i> — <b>drag the lever</b> to walk it through time. Green helped, red was a drag.</p>';
  h+='<div class="gd-head"><div class="gd-period" id="lyDecompPeriod"></div><div class="gd-slwrap"><input type="range" id="lyDecompSlider" class="gd-slider" min="1" max="3" value="3" step="1"><div class="gd-ticks"><span>2023</span><span>2024</span><span>2025</span></div></div></div>';
  h+='<div id="lyDecompBars"></div>';
  h+='<div id="lyDecompNote" class="gd-freq"></div>';
  h+='<div class="gd-freq" style="background:none;border:1px dashed var(--bdr);margin-top:8px"><b>The through-line:</b> ride frequency (rides per active rider) <b>peaked at '+f24.toFixed(1)+' in 2024</b> and becomes a <i>drag</i> from 2025 on. Lyft grows by <b>adding users, not deepening them</b> — extensive, not intensive. That is the quality question sitting under the headline rider count.</div>';
  h += '<div class="ovs-loan" style="margin-top:16px">'+
    '<div class="ov-chart-t">Active Riders <span>(millions · light bars = estimate · pink = YoY growth)</span></div>'+
    rangeSlider('riders', YEARS.length-1, YEARS[0], YEARS[YEARS.length-1])+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="lyChartRiders"></canvas></div>'+
  '</div>';
  h += '<div class="ovs-loan">'+
    '<div class="ov-chart-t">Annual Rides <span>(millions · light bars = estimate · pink = YoY growth)</span></div>'+
    rangeSlider('rides', YEARS.length-1, YEARS[0], YEARS[YEARS.length-1])+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="lyChartRides"></canvas></div>'+
  '</div>';
  h += sec('The deceleration debate — saturation, or a deliberate choice?',
    '<div class="ov-callout"><div class="ov-tl-body"><b>Ride-count growth is slowing</b> — Q1 2026 <b>+8.5% YoY</b> vs <b>+14%</b> for FY2025. Two readings: <b>(1) cyclical</b> — metro saturation + ~3M rides lost to Q1 weather, with guided Q2 re-acceleration; <b>(2) deliberate</b> — tilting to higher-value rides (+35–50%) rather than chasing every marginal one. Either way, the <b>~15% bookings CAGR now leans hard on rider acquisition + richer mix</b> — the single most contestable point in the growth story.</div></div>');
  return h;
}

// ─── Pane: Unit Economics & Insurance ─────────────────────────────────────────
// Insurance across the three financial statements (interactive: crutch vs tailwind).
var SF_NOTES={
  pnl:{ before:'Large & <b>growing</b> — the #1 US Mobility cost, squeezing gross margin.', now:'Cost per ride is <b>falling</b> (SB 371) → gross margin +710 bps.' },
  bs:{ before:'Reserves <b>ballooning</b> as claim severity spiked (~$2.2B).', now:'Growth moderating; loss-portfolio transfers move the old tail <b>off the books</b>.' },
  cf:{ before:'The float <b>propped up</b> a breakeven business — the crutch.', now:'A <b>supplement</b>, not the crutch — the core business generates the cash.' },
};
function stmtFlow(){
  function box(tag,label,acct,id,cls){ return '<div class="sf-box '+cls+'"><div class="sf-tag">'+tag+'</div><div class="sf-label">'+label+'</div><div class="sf-acct">'+acct+'</div><div class="sf-note" id="sfn-'+id+'"></div></div>'; }
  var arr='<div class="sf-arr">→</div>';
  var h='<style>'+
    '.sf-intro{font-size:12.5px;color:var(--navy);line-height:1.55;margin:2px 0 10px}'+
    '.sf-tog{display:inline-flex;gap:4px;padding:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;margin:0 0 12px}'+
    '.sf-pill{border:none;background:none;border-radius:16px;font:600 12px Inter,sans-serif;color:var(--mu);padding:6px 14px;cursor:pointer}.sf-pill.active{background:var(--brand);color:#fff}'+
    '.sf-flow{display:flex;align-items:stretch;gap:6px}'+
    '.sf-box{flex:1;border:1px solid var(--bdr);border-radius:10px;padding:12px 13px;background:var(--w)}'+
    '.sf-pnl{border-top:3px solid #6B2BD9}.sf-bs{border-top:3px solid #E6007A}.sf-cf{border-top:3px solid #1E9E62}'+
    '.sf-tag{font-size:10px;font-weight:800;letter-spacing:.05em;color:var(--mu)}'+
    '.sf-label{font-size:12px;font-weight:800;color:var(--navy);margin:1px 0 6px}'+
    '.sf-acct{font-size:11.5px;color:var(--navy);line-height:1.4}'+
    '.sf-note{font-size:11px;color:var(--mu);line-height:1.45;margin-top:8px;border-top:1px dashed var(--bdr);padding-top:7px}'+
    '.sf-arr{display:flex;align-items:center;color:#B8C0CA;font-size:20px;font-weight:800;flex:none}'+
    '@media(max-width:640px){.sf-flow{flex-direction:column}.sf-arr{transform:rotate(90deg);justify-content:center}}'+
  '</style>';
  h+='<div class="sf-intro">Insurance is <b>expensed on the P&L</b> the moment a ride happens — but the cash for claims is paid out <b>over years</b>. That timing gap builds a <b>reserve liability</b> on the balance sheet, and the gap itself is the <b>float</b> that runs through cash flow. Same plumbing — toggle to see how it read then vs now:</div>';
  h+='<div class="sf-tog"><button type="button" class="sf-pill active" data-sf="before">2021–22 · crutch</button><button type="button" class="sf-pill" data-sf="now">2025–26 · tailwind</button></div>';
  h+='<div class="sf-flow">'+box('P&L','Income statement','Insurance sits inside <b>Cost of Revenue</b>','pnl','sf-pnl')+arr+box('B / S','Balance sheet','<b>Insurance reserves</b> ~$2.2B + trust investments','bs','sf-bs')+arr+box('C / F','Cash flow','<b>Δ reserves + investment income</b> = the float','cf','sf-cf')+'</div>';
  return h;
}
function renderStmtFlow(mode){ ['pnl','bs','cf'].forEach(function(k){ var el=document.getElementById('sfn-'+k); if(el&&SF_NOTES[k]) el.innerHTML=SF_NOTES[k][mode]; }); }
function unitBody(c){
  var i0 = UE_Q.length - 1, i1 = UE_Q.indexOf('1Q25');
  function prTile(l, v, sub, dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
  var h='<style>'+
    '.insarc{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:2px 0}'+
    '.insarc-p{border:1px solid var(--bdr);border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.insarc-red{border-top:3px solid #C0392B}.insarc-amber{border-top:3px solid #E6B032}.insarc-green{border-top:3px solid #1E9E62}'+
    '.insarc-y{font-size:10.5px;color:var(--mu);font-weight:700}.insarc-l{font-size:12px;font-weight:800;margin:1px 0 5px}'+
    '.insarc-red .insarc-l{color:#C0392B}.insarc-amber .insarc-l{color:#B8860B}.insarc-green .insarc-l{color:#1E9E62}'+
    '.insarc-d{font-size:11px;color:var(--navy);line-height:1.45}'+
    '.gm-v{background:var(--brand-soft);border-radius:10px;padding:14px 16px;margin-top:2px}'+
    '.gm-num{font-size:13px;color:var(--navy)}.gm-num b{font-size:22px;font-weight:800}.gm-up{color:#1E9E62;font-weight:800;margin-left:6px}'+
    '.gm-track{position:relative;height:8px;border-radius:4px;background:linear-gradient(90deg,#C0392B,#E6B032,#1E9E62);margin:14px 0 0}'+
    '.gm-marker{position:absolute;top:-5px;width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid var(--navy);transform:translateX(-50%)}'+
    '.gm-ends{display:flex;justify-content:space-between;font-size:10.5px;color:var(--mu);font-weight:600;margin-top:7px}'+
    '.gm-line{font-size:12.5px;color:var(--navy);line-height:1.55;margin-top:9px}.gm-line b{font-weight:800}'+
    '.gm-tap{color:var(--brand);font-weight:700;cursor:pointer;white-space:nowrap}'+
    '@media(max-width:640px){.insarc{grid-template-columns:1fr}}'+
  '</style>';
  var corDown=PR_COR[i0]<PR_COR[i1];
  h+='<style>.ue-ko{border:1px solid var(--bdr);border-left:4px solid #E6007A;border-radius:14px;background:linear-gradient(180deg,var(--brand-soft),transparent);padding:15px 17px;margin:2px 0 14px}.ue-ko-hd{font-size:14.5px;font-weight:800;color:var(--navy);line-height:1.4}.ue-ko-hd b{color:#c0006a}.ue-ko-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:13px}@media(max-width:560px){.ue-ko-row{grid-template-columns:1fr}}.ue-ko-c{background:#fff;border:1px solid var(--bdr);border-radius:10px;padding:11px 13px}.ue-ko-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu)}.ue-ko-flip{display:flex;align-items:baseline;gap:7px;margin:5px 0 2px}.ue-ko-was{font-size:14px;font-weight:800;color:var(--mu)}.ue-ko-now{font-size:19px;font-weight:900}.ue-ko-sub{font-size:10.5px;font-weight:700}</style>';
  h+=sec('Follow a single ride — where the money goes',
    '<style>.ov-gal-cap{font-size:12.5px;color:var(--navy);line-height:1.6;margin:12px 0}.ov-gal-nav{display:flex;align-items:center;justify-content:space-between;gap:12px}.ov-gal-btn{font-size:22px;font-weight:800;line-height:1;border:1px solid var(--bdr);background:#fff;border-radius:8px;min-width:46px;height:40px;cursor:pointer;color:var(--navy)}.ov-gal-btn:hover{background:#E6007A;color:#fff;border-color:#E6007A}.ov-gal-count{font-size:11px;color:var(--mu);font-weight:700}</style><p class="ov-lede" style="margin:0 0 14px">A rideshare trip, end to end — <b>tap any step for a photo + detail</b>, then use ‹ › to move through the ride. Below: where each dollar of a ride lands.</p>'+
    chain(RIDE_FLOW,'ride')+
    '<div class="ov-sec-h ovt-store-h" style="margin-top:20px">Where each $ of a ride goes <span class="ave-subh-note">(Q1 2026, per ride ≈ $20.88)</span></div>'+
    mbars(RIDE_SPLIT)+
    '<div class="ov-fynote">Revenue is reported <b>net of driver pay</b>, so the marketplace split is driver pay (~67%) + cost of revenue (~17%, mostly insurance) + Lyft gross profit (~16%). The margin story is the middle slice shrinking — quantified next.</div>');
  h+='<div class="ue-ko"><div class="ue-ko-hd">The whole tab in one line: <b>same fare, more profit per ride</b> &mdash; because <b>insurance is shrinking</b>, not because Lyft takes a bigger cut.</div>'+
    '<div class="ue-ko-row">'+
      '<div class="ue-ko-c"><div class="ue-ko-k">Gross profit / ride</div><div class="ue-ko-flip"><span class="ue-ko-was">'+usd2(PR_GP[i1])+'</span><span style="color:#1E9E62;font-weight:900">&rarr;</span><span class="ue-ko-now" style="color:#1E9E62">'+usd2(PR_GP[i0])+'</span></div><div class="ue-ko-sub" style="color:#1E9E62">'+pctStr((PR_GP[i0]/PR_GP[i1]-1)*100)+' YoY &middot; Q1&rsquo;25 &rarr; Q1&rsquo;26</div></div>'+
      '<div class="ue-ko-c"><div class="ue-ko-k">Cost of revenue / ride &mdash; mostly insurance</div><div class="ue-ko-flip"><span class="ue-ko-was">'+usd2(PR_COR[i1])+'</span><span style="font-weight:900;color:'+(corDown?'#0a8f0a':'#C0392B')+'">&rarr;</span><span class="ue-ko-now" style="color:'+(corDown?'#0a8f0a':'#C0392B')+'">'+usd2(PR_COR[i0])+'</span></div><div class="ue-ko-sub" style="color:'+(corDown?'#0a8f0a':'#C0392B')+'">'+(corDown?'falling per ride &mdash; the entire margin unlock':'rising per ride')+'</div></div>'+
    '</div></div>';
  h+='<p class="ov-lede" style="margin-top:0">Revenue is net of driver pay, so the number that matters is <b>gross profit per ride</b>. Below: the per-ride split by quarter, why the take-rate line misleads, the regulation it all rests on, and whether the jump is durable.</p>';
  h+='<div class="ov-kpis">'+
    prTile('Bookings / ride', usd2(PR_GB[i0]), pctStr((PR_GB[i0]/PR_GB[i1]-1)*100)+' YoY', 'up')+
    prTile('Revenue / ride (net)', usd2(PR_REV[i0]), pctStr((PR_REV[i0]/PR_REV[i1]-1)*100)+' YoY', 'up')+
    prTile('Cost of rev / ride', usd2(PR_COR[i0]), pctStr((PR_COR[i0]/PR_COR[i1]-1)*100)+' YoY', 'up')+
    prTile('Gross profit / ride', usd2(PR_GP[i0]), pctStr((PR_GP[i0]/PR_GP[i1]-1)*100)+' YoY', 'up')+
  '</div>';
  h+='<div class="ov-asof">Q1 2026 vs Q1 2025 · lower cost/ride is favorable.</div>';
  h+='<div class="tech-leg" style="margin-top:8px">'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+GRAY+'"></span>Driver pay</span>'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+EST_FILL+'"></span>Cost of revenue (mostly insurance)</span>'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+BRAND+'"></span>Lyft gross profit</span>'+
  '</div>';
  h+='<div class="ov-chart-t">Where each $ of a ride goes <span>($ per ride, by quarter · label = gross profit / ride)</span></div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px"><b>How to read it:</b> each bar is one quarter&rsquo;s ride, split into <b>driver pay</b>, <b>insurance</b> (the middle band) and <b>Lyft&rsquo;s gross profit</b> (pink). The fare barely moves &mdash; the <b>middle band shrinks</b> and the <b>pink grows</b>.</div>';
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="lyUEdecomp"></canvas></div>';
  h+='<div class="ov-foot">Source: Summit DCF actuals, snapshot 2026-05-13.</div>';
  h+='<div class="ov-sec-h ovt-store-h">Take rate — and why it misleads</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">You&rsquo;ll see a &lsquo;take rate&rsquo; line drift <b>down</b> (~36% &rarr; ~33%). <b>Ignore it</b> &mdash; Lyft is <b>not</b> taking a smaller cut. Here is why:</div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyUEtake"></canvas></div>';
  h+='<div class="ov-callout ov-clickable" data-detail="lnote:take"><div class="ov-tl-body">The line drifted ~36% → ~33% — but Lyft is <b>not</b> taking a smaller cut. Its real take is ~<b>30%</b> (the 70% driver floor caps it); the wobble is an <b>accounting artifact</b> (a gross-up move + Lyft Media). Watch gross profit per ride, not this line. <span class="gm-tap">Tap for the year-by-year ›</span></div></div>';
  h+=sec('The foundation — driver classification (US & Canada IS the story)',
    '<style>.lreg-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:2px}.lreg-c{border:1px solid var(--bdr);border-radius:10px;padding:11px 13px;background:var(--w);cursor:pointer;transition:border-color .12s}.lreg-c:hover{border-color:var(--brand)}.lreg-hd{font-size:12.5px;font-weight:800;color:var(--navy);display:flex;justify-content:space-between;align-items:center;gap:8px}.lreg-chip{font-size:9px;font-weight:800;letter-spacing:.03em;border-radius:10px;padding:2px 8px;flex:none;white-space:nowrap}.lreg-g{background:rgba(30,158,98,0.12);color:#1E9E62}.lreg-a{background:rgba(184,134,11,0.14);color:#B8860B}.lreg-t{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:5px}@media(max-width:720px){.lreg-grid{grid-template-columns:1fr}}</style>'+
    '<style>.ue-fnd-chain{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:stretch;margin:2px 0 10px}@media(max-width:640px){.ue-fnd-chain{grid-template-columns:1fr}.ue-fnd-arw{transform:rotate(90deg);justify-self:center}}.ue-fnd-box{border:1px solid var(--bdr);border-radius:10px;padding:10px 12px;background:#fff}.ue-fnd-box.danger{border-left:3px solid #C0392B;background:rgba(192,57,43,0.04)}.ue-fnd-box b{font-size:12px;color:var(--navy)}.ue-fnd-box span{display:block;font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.4}.ue-fnd-box span b{color:var(--navy)}.ue-fnd-arw{display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--brand)}.ue-fnd-note{font-size:12px;color:var(--navy);line-height:1.55;background:var(--brand-soft);border-radius:9px;padding:10px 13px;margin-bottom:12px}.ue-fnd-note b{font-weight:800}</style>'+
    '<div style="font-size:12px;font-weight:800;color:var(--navy);margin:0 0 8px">Why a regulation question lives in Unit Economics &mdash; follow the chain:</div>'+
    '<div class="ue-fnd-chain">'+
      '<div class="ue-fnd-box"><b>Driver pay &asymp; 67% of every fare</b><span>by far the biggest slice in the split above (the &ge;70% driver guarantee)</span></div>'+
      '<span class="ue-fnd-arw">&rarr;</span>'+
      '<div class="ue-fnd-box"><b>It stays a <i>variable</i> cost</b><span>only because drivers are independent <b>contractors</b>, paid per ride</span></div>'+
      '<span class="ue-fnd-arw">&rarr;</span>'+
      '<div class="ue-fnd-box danger"><b>Reclassify them as employees?</b><span>fixed wages + benefits + payroll taxes &rarr; the whole per-ride model <b>breaks</b></span></div>'+
    '</div>'+
    '<div class="ue-fnd-note"><b>That is why this sits in Unit Economics:</b> driver classification is the foundation under Lyft&rsquo;s single biggest cost. The good news &mdash; it is <b>largely settled in Lyft&rsquo;s favor</b>. Lyft is <b>US/Canada-only</b>, so these North-American deals <i>are</i> its whole regulatory story; each keeps contractor status while conceding pay floors & benefits. <b>Tap any card</b> for the state-by-state status.</div>'+
    '<div class="lreg-grid">'+REG.map(function(r,i){ return '<div class="lreg-c ov-clickable" data-detail="lreg:'+i+'"><div class="lreg-hd">'+esc(r.h)+'<span class="lreg-chip lreg-'+r.cls+'">'+esc(r.chip)+'</span></div><div class="lreg-t">'+r.teaser+' <span style="color:var(--brand);font-weight:700">tap &rsaquo;</span></div></div>'; }).join('')+'</div>');
  h+=sec('Is the margin jump durable? — the market\'s real debate',
    '<style>.gm-ev{font-size:12px;color:var(--navy);line-height:1.55;background:rgba(30,158,98,0.06);border:1px solid rgba(30,158,98,0.25);border-radius:9px;padding:10px 13px;margin:12px 0;cursor:pointer}.gm-ev b{font-weight:800}.gmdb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}@media(max-width:680px){.gmdb{grid-template-columns:1fr}}.gmdb-c{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px}.gmdb-c.bull{border-top:3px solid #1E9E62;background:rgba(30,158,98,0.04)}.gmdb-c.bear{border-top:3px solid #B8860B;background:rgba(184,134,11,0.04)}.gmdb-h{font-size:12px;font-weight:800;margin-bottom:8px}.gmdb-c.bull .gmdb-h{color:#1E9E62}.gmdb-c.bear .gmdb-h{color:#B8860B}.gmdb-li{font-size:11.5px;color:var(--navy);line-height:1.5;padding-left:15px;position:relative;margin-bottom:8px}.gmdb-li:before{content:"";position:absolute;left:1px;top:6px;width:6px;height:6px;border-radius:50%}.gmdb-c.bull .gmdb-li:before{background:#1E9E62}.gmdb-c.bear .gmdb-li:before{background:#B8860B}.gmdb-li b{font-weight:800}</style>'+
    '<div class="ov-callout" style="border-left:3px solid var(--brand);margin-bottom:14px">The entire 2025&ndash;26 margin story is <b>insurance cost per ride falling</b> (not a higher take) &mdash; via <b>CA SB&nbsp;371</b> + the captive (full mechanics in the <b>Insurance</b> tab). The only question the model cares about: <b>is it durable?</b></div>'+
    '<div class="gm-v"><div class="gm-num"><b>47.6%</b> Q1 2026 gross margin <span class="gm-up">+710 bps YoY</span></div>'+
    '<div class="gm-track"><div class="gm-marker" style="left:62%"></div></div>'+
    '<div class="gm-ends"><span>one-time / flattered</span><span>durable / structural</span></div></div>'+
    '<div class="gm-ev ov-clickable" data-detail="lnote:cogs"><b>The hard datapoint:</b> cost of revenue was <b>flat YoY</b> ($864M) despite bookings <b>+19%</b>, and fell ~<b>$108M</b> in one quarter (Q4&rsquo;25&rarr;Q1&rsquo;26) &mdash; a real per-ride cost decline, <b>not</b> a reserve release (reserves actually <i>rose</i>). <span class="gm-tap">tap for the breakdown &rsaquo;</span></div>'+
    '<div class="gmdb"><div class="gmdb-c bull"><div class="gmdb-h">&uarr; The structural case</div>'+GM_STRUCT.map(function(b){ return '<div class="gmdb-li">'+b+'</div>'; }).join('')+'</div>'+
    '<div class="gmdb-c bear"><div class="gmdb-h">&darr; Reasons for caution</div>'+GM_CAUTION.map(function(b){ return '<div class="gmdb-li">'+b+'</div>'; }).join('')+'</div></div>'+
    '<div class="gm-line" style="margin-top:12px"><b>Verdict: mostly structural &mdash; but not yet proven in magnitude.</b> SB&nbsp;371 + captive execution are real and recur; the <b>+710 bps headline is flattered by a soft Q1 2025 base</b>, and Adj. EBITDA margin barely moved. <b>Trust the direction; the magnitude needs two or three more clean quarters.</b></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Model vs. Reality (Actuals vs Estimates) ───────────────────────────
function modelBody(c){
  var h = '';
  h += '<p class="ov-lede" style="margin-bottom:14px">How the <b>Summit DCF</b>\'s quarterly estimate has stacked up against what Lyft actually reported — metric by metric. Each bar is the <b>surprise</b> (actual vs the model\'s estimate); green is favorable, red unfavorable. Pick a metric, then drag the handles to window the quarters — the chart and all eight tiles recompute live.</p>';
  h += '<div class="ave-groups">';
  h += groupRow('KPIs', [['rides','Rides']]);
  h += groupRow('Top line', [['gb','Gross Bookings'],['rev','Revenue']]);
  h += groupRow('Costs', [['cogs','Cost of Revenue']]);
  h += groupRow('Profit', [['ebitda','Adj. EBITDA']]);
  h += groupRow('Cash', [['fcf','Free Cash Flow']]);
  h += '</div>';
  h += '<div class="ave-leg">'+
    '<span class="ave-leg-i"><span class="ave-leg-up">▲</span> favorable (beat / under-budget)</span>'+
    '<span class="ave-leg-i"><span class="ave-leg-dn">▼</span> unfavorable (miss / over-budget)</span>'+
  '</div>';
  h += '<div class="ov-chart-t" id="lyAveT"></div>';
  h += '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="lyAveChart"></canvas></div>';
  h += rangeSlider('ave', 1, '', '');
  h += '<div class="ave-subh-note" id="lyAveNote" style="margin:6px 2px 16px"></div>';
  h += '<div class="ov-kpis" id="lyAveStats" style="grid-template-columns:repeat(4,1fr)"></div>';
  h += '<div class="ov-foot">Estimates are the model\'s quarterly projection_history; actuals are reported. Adj. EBITDA and Free Cash Flow windows start where the model carries a stable forecast (the 2023 quarters sit on a near-zero / negative base and are excluded). Snapshot 2026-05-13.</div>';

  // ── Management's own guidance vs. reality (chart: guided band · actual · model) ──
  h += '<div style="border-top:1px solid var(--bdr);margin:34px 0 0"></div>';
  h += '<div class="ov-subh">Management\'s own yardstick — guidance vs. reality</div>';
  h += '<p class="ov-lede" style="margin-bottom:12px">The back-test above grades the <b>Summit model</b>. This grades <b>management</b> — on the same quarters, so the two read together. Each bar is the <b>range Lyft guided</b> for that quarter; the <b>solid dot is what it reported</b> (green = above the range, pink = inside, red = below); the <b>dashed line is the Summit model</b>. Two patterns: Lyft calls <b>Gross Bookings</b> with surgical precision (inside the band almost every quarter), and <b>sandbags Adj. EBITDA</b> (upper-half-or-above every quarter). The <b>margin</b> view tracks the climb toward the 2027 Investor-Day target.</p>';
  h += '<div class="guid-pills">'+['gb','ebitda','margin'].map(function(k){
    return '<button type="button" class="guid-pill'+(k===_guideMetric?' active':'')+'" data-guidm="'+k+'">'+esc(GUIDE[k].label)+'</button>';
  }).join('')+'</div>';
  h += '<div class="guid-leg" id="lyGuideLeg"></div>';
  h += '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="lyGuideChart"></canvas></div>';
  h += '<div class="ave-subh-note" id="lyGuideNote" style="margin:8px 2px 12px"></div>';
  h += '<div class="guid-tbl-wrap" id="lyGuideTbl"></div>';
  h += '<div class="ov-foot">Guidance = the range issued for the upcoming quarter on the prior earnings call (Lyft 8-K / shareholder letters); reported actuals & the Summit model reuse the back-test series above. GB guidance begins 4Q23 (Lyft guided Rides + Revenue before that); Adj. EBITDA and margin run the full window — Lyft has guided Adj. EBITDA every quarter since 1Q23. The Summit model line only appears from 4Q24, where the model carries a real EBITDA forecast. Margin is realized Adj. EBITDA ÷ Gross Bookings; the 2027 ~4% target is from the June 2024 Investor Day. 2Q26 is the current outstanding guide. Snapshot 2026-05-13.</div>';
  return h;
}
function groupRow(label, items){
  return '<div class="ave-group"><span class="ave-group-l">'+esc(label)+'</span><div class="ave-pills">'+
    items.map(function(it){ return '<button type="button" class="ave-pill" data-ave="'+it[0]+'">'+esc(it[1])+'</button>'; }).join('')+
  '</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARDIZED OVERVIEW (per docs/OVERVIEW_CONVENTIONS.md) — the 7-block hook.
// Mirrors overviews/uber.js's std machinery; ids prefixed `ly`, data vars `LY_`.
// ═══════════════════════════════════════════════════════════════════════════════
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
// Block 1 — Key Facts. Exactly 10 cells (5×2). CEO carries tenure; Market cap carries an as-of
// (and a live #lyMc span). No live price strip anywhere in the standardized overview.
var LY_FACTS=[
  ['Listing','NASDAQ: LYFT'],
  ['HQ','San Francisco, CA, USA'],
  ['Incorporation','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2012 (Zimride 2007)'],
  ['IPO','Mar 2019 · $72.00'],
  ['CEO','David Risher · since 2023'],
  ['Employees','~3,913 · Dec 2025'],
  ['Dividend','Non-payer ($1B buyback ’26)'],
  ['Market cap','~$5.9B · Jul 2026'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+LY_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="lyMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
// Block 2 — description (high-level "what it is" only; non-redundant with the blocks below).
var LY_LEDE='Lyft runs the second-largest ridesharing network in North America, an app that matches riders with independent drivers across the United States and Canada. It owns no cars — it operates the marketplace (pricing, payments, insurance, safety) and keeps a share of each fare. Alongside core rideshare it runs city bikeshare and scooter systems and a small but fast-growing advertising business (Lyft Media). After years of losses it reached full-year GAAP profitability in 2024 and now generates strong free cash flow.';
// Block 3 — the 4-quadrant, rendered as a 2×2 TABLE. Each cell ≤ ~30 words.
var LY_BIZ=[
  ['What it sells','On-demand rides via app, plus city bikeshare & scooters, in-app and vehicle-top advertising (Lyft Media), and a Lyft Business account offering.'],
  ['Who buys it','Consumers needing point-to-point transport; enterprises and healthcare orgs (Lyft Business); advertisers reaching riders; cities that contract Lyft to run public bikeshare.'],
  ['How it earns','It keeps a share of each fare’s Gross Bookings (a take of ~34% incl. an accounting effect). Small, fast-growing add-ons: bike/scooter rentals and Lyft Media ads.'],
  ['The edge','Scale as the #2 North-American rideshare network (a liquidity/density flywheel), a strong consumer brand, and multi-year municipal bikeshare contracts with local network effects.'],
];
function stdFourQuad(){
  return '<div class="q2">'+LY_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
// Block 4 — How it makes money. Lyft is a SINGLE reportable segment, so there is no segment split
// to toggle. Show revenue-by-line (2 slices) + a compact key-metrics row + qualitative "What is X?"
// accordions. Geography OMITTED (US/Canada; substantially all revenue US-based; no country split).
var LY_REV=[['Rideshare & platform',93,'$5.90B',BRAND],['Rentals (bikes/scooters/car)',7,'$0.42B',BRAND2]];
var LY_SEG_DEF=[
  { seg:'Rideshare',
    desc:'The core marketplace: it matches a rider requesting a trip with a nearby independent driver in real time; Lyft sets pricing, handles payments, insurance and safety, and keeps a portion of each fare.',
    econ:[['Gross Bookings','$18.51B'],['Revenue','~$5.9B'],['Take rate','~34% (incl. insurance accounting)'],['Adj. EBITDA (co-wide)','$528.9M']] },
  { seg:'Lyft Media',
    desc:'An advertising business that monetizes rider attention across the app, emails, and in-car / vehicle-top screens.',
    econ:[['Revenue run-rate','~$100M (2025 exit)'],['Growth','>100% YoY (approx.)']] },
  { seg:'Bikes & Scooters',
    desc:'City-partnered shared micromobility: Lyft operates and maintains public bikeshare fleets under multi-year municipal contracts, plus e-scooters in select markets.',
    econ:[['Reported within','“Rentals revenue” ~$420.9M'],['Standalone figure','blended with car rentals; none disclosed']] },
];
function stdMoneyMap(){
  var STATS=[['Gross Bookings','$18.51B'],['Rides','945.5M'],['Active Riders','29.2M'],['Adj. EBITDA','$528.9M'],['Free cash flow','$1.09B'],['Revenue / GB','~34%']];
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">Lyft has a <b>single reportable segment</b>, so there is no segment split to toggle — here is FY2025 revenue by line, then the key metrics beneath.</div>';
  h+=mbars(LY_REV);
  h+='<div class="mm-stats">'+STATS.map(function(s){ return '<div class="mm-stat"><div class="mm-stat-k">'+esc(s[0])+'</div><div class="mm-stat-v">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="mm-defs acc-list" style="margin-top:6px">'+LY_SEG_DEF.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">Economics (FY2025) <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">What is “'+esc(s.seg)+'”?<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025, single reportable segment; reported total net revenue <b>$6,316.3M</b>. The headline ~<b>34% revenue/gross-bookings ratio is inflated by an insurance accounting change</b>, not a clean take rate. <span class="ave-subh-note">Geography omitted — operates in the US and Canada; substantially all revenue is US-based, and no country split is reported, so no geography view. Source: Lyft FY2025 10-K & Q4 2025 results; Summit model corroborates.</span></div>';
  return h;
}
// Block 5 — Products (TWO TIERS): Tier-1 family cards → pop-up → Tier-2 the specific products.
var LY_PROD_GROUPS=[
  { seg:'Rideshare', families:[
    { ic:'🚗', fam:'Everyday', d:'The mass-market core.', items:[
      ['Standard','Everyday car, up to 4 riders — the volume core of Lyft.'],
      ['Wait & Save','A lower price for a slightly longer wait or short walk.'],
      ['Priority Pickup','Pay up for a faster driver match.'],
    ]},
    { ic:'✨', fam:'Bigger & premium', d:'Larger and higher-end rides.', items:[
      ['Lyft XL','Larger vehicles for up to 6 riders.'],
      ['Extra Comfort','Newer cars with top-rated drivers.'],
      ['Lyft Black / Black SUV','Premium rides with professional drivers.'],
    ]},
    { ic:'📅', fam:'Plan ahead', d:'Book and lock in a price.', items:[
      ['Scheduled Rides','Book a ride in advance for a set pickup time.'],
      ['Price Lock','A small fee to cap a route’s price against surge.'],
    ]},
  ]},
  { seg:'Membership & micromobility', families:[
    { ic:'⭐', fam:'Lyft Pink', d:'The paid membership tier.', items:[
      ['Lyft Pink','~$9.99/mo or ~$99/yr membership: ride discounts, free/discounted bike & scooter minutes, priority pricing (no disclosed member count).'],
    ]},
    { ic:'🚲', fam:'Bikes & Scooters', d:'City bikeshare systems.', items:[
      ['Citi Bike (NYC)','New York City bikeshare — classic + e-bikes.'],
      ['Divvy (Chicago)','Chicago’s public bikeshare system.'],
      ['Bay Wheels (SF Bay Area)','Bikeshare across the San Francisco Bay Area.'],
      ['BIKETOWN (Portland)','Portland’s public bikeshare system.'],
      ['Bluebikes (Boston)','Metro Boston bikeshare.'],
      ['Capital Bikeshare (DC)','Washington DC bikeshare; e-scooters in select cities.'],
    ]},
  ]},
  { seg:'Enterprise, ads & autonomous', families:[
    { ic:'💼', fam:'Lyft Business', d:'Rides for organizations.', items:[
      ['Lyft Business','Corporate ride & meal accounts.'],
      ['Lyft Healthcare','Non-emergency medical transport.'],
    ]},
    { ic:'📣', fam:'Lyft Media', d:'The advertising surfaces.', items:[
      ['Ad placements','In-app, email and in-car / vehicle-top ad placements.'],
    ]},
    { ic:'🤖', fam:'Autonomous (partnerships)', d:'Asset-light AV network.', items:[
      ['May Mobility','AVs live on Lyft in Atlanta since 2025.'],
      ['Mobileye + Marubeni','Robotaxis planned for Dallas in 2026.'],
      ['Waymo','Driverless rides planned for Nashville in 2026.'],
      ['Level 5 (sold)','Lyft sold its in-house Level 5 self-driving unit to Toyota’s Woven Planet in 2021.'],
    ]},
  ]},
];
function stdProducts(){
  return LY_PROD_GROUPS.map(function(g,gi){
    return '<div class="stdp-group"><div class="stdp-seg">'+esc(g.seg)+'</div><div class="stdp">'+
      g.families.map(function(f,fi){
        return '<div class="stdp-card ov-clickable" data-detail="fam:'+gi+'-'+fi+'"><div class="stdp-ic">'+f.ic+'</div>'+
          '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
      }).join('')+'</div></div>';
  }).join('');
}
// Block 6 — Competitors scatter (DYNAMIC). X = valuation multiple, Y = revenue growth, bubble =
// LIVE market cap (api.liveQuote per ticker). Multiple: EV/EBITDA ⇄ P/E. Basis: Trailing ⇄ Forward.
// Peers add/removable by ticker; the chip × DELETES a peer immediately. Multiples web-sourced (mid-2026).
var LY_PEERS=[
  { tk:'LYFT', n:'Lyft',     evT:10, evF:8.5, peT:null, peF:15,   gt:9,  gf:17, mc:5.9, hl:true, why:'The #2 North-American rideshare pure-play — now GAAP-profitable and cash-generative, and the cheapest mobility name; the market prices its lack of Uber’s scale and diversification. (Trailing P/E n.m. — FY25 net income is dominated by a one-time ~$2.9B tax benefit.)' },
  { tk:'UBER', n:'Uber',     evT:22, evF:18,  peT:30,   peF:24,   gt:14, gf:15, mc:150, why:'The scaled, global, multi-product leader (rides + eats + freight). Profitable and cash-generative — the large-cap comp.' },
  { tk:'DASH', n:'DoorDash', evT:49, evF:30,  peT:75,   peF:28,   gt:30, gf:22, mc:84,  why:'US delivery leader; an adjacency (delivery, not rideshare) shown for the gig-platform read — richly valued on fast growth.' },
  { tk:'GRAB', n:'Grab',     evT:40, evF:22,  peT:null, peF:null, gt:24, gf:20, mc:16,  why:'SE-Asia super-app (rides + food + payments). Only recently profitable, so P/E is not yet meaningful; drops out of the P/E view.' },
];
var LY_SC={ type:'ev', basis:'f', peers:null };
function lyScReset(){ LY_SC.peers=LY_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function lyScMult(p){ if(LY_SC.type==='ev') return LY_SC.basis==='f'?p.evF:p.evT; return LY_SC.basis==='f'?p.peF:p.peT; }
function stdPeerScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-dot{transition:.15s}.mg-node text{pointer-events:none}'+
    '.lysc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.lysc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.lysc-chip .x{color:var(--mu);font-weight:800}'+
    '.lysc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.lysc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.lysc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid #E6007A}'+
    '.mg-tip .mgt-n{display:block;font-weight:800;font-size:12.5px;color:#E6007A;margin-bottom:3px}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD</b> (so a ~$150B Uber dwarfs a ~$6B Lyft, and currencies never distort the comparison). <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="lyScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="lyScXlab">EV/EBITDA · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="lyScNodes"></g>'+
  '</svg></div>';
  h+='<div class="lysc-chips" id="lyScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here; a name drops out of the P/E view when it has no meaningful P/E — Grab is only recently profitable, and Lyft’s trailing P/E is <b>n.m.</b> (FY25 net income is dominated by a one-time ~$2.9B tax benefit). Unlisted rivals (DiDi, Bolt) have no market multiple — they sit on the competitive map in <b>Deep Dive ▸ Deep Overview</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026); market caps are live. Directional, not exact.</span></div>';
  h+='<div id="lyScTip" class="mg-tip" hidden></div>';
  return h;
}
function lyScRender(root){
  var g=root.querySelector('#lyScNodes'); if(!g||!LY_SC.peers) return;
  var maxMult=LY_SC.type==='ev'?52:80, X0=80, X1=612, Y0=252, Y1=44;
  var lab=root.querySelector('#lyScXlab'); if(lab) lab.textContent=(LY_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(LY_SC.basis==='f'?'forward':'trailing');
  var frag='';
  LY_SC.peers.forEach(function(p){
    if(!p.on) return; var m=lyScMult(p); if(m==null||isNaN(m)) return; // drops out of this view
    var growth=LY_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/30))*(Y0-Y1);
    var r=Math.max(6,Math.min(22,5+Math.sqrt(Math.max(1,p.mc))*0.9));
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="'+(p.hl?'#E6007A':'#3A7BD5')+'"'+(p.hl?' stroke="#fff" stroke-width="2"':' opacity="0.82"')+' style="cursor:pointer"></circle>'+
      '<text y="'+(r+11).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#10141A':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function lyScChips(root){
  var box=root.querySelector('#lyScChips'); if(!box||!LY_SC.peers) return;
  var h=LY_SC.peers.map(function(p,i){ return '<span class="lysc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="lysc-add"><input id="lyScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="lyScAddBtn">Add</button></span>';
  box.innerHTML=h;
}
// Block 7 — Timeline (reuses the existing TIMELINE var + data-detail="hist:i", so the modal keeps working).
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
var LY_OV_SOURCES='Sources — Lyft FY2025 Form 10-K & Q4 2025 results (revenue, gross bookings, rides, active riders, Adjusted EBITDA, FCF); Summit DCF model (snapshot 2026-05-13) corroborating the actuals and supplying forward estimates; company IR for products & the AV partnerships. Market cap and peer bubbles are live via Massive; peer multiples & growth are web-sourced approximations (mid-2026). Geography split not shown (US/Canada; no reported country split). FY2025 GAAP net income is distorted by a one-time ~$2.9B deferred-tax benefit, so trailing P/E is shown n.m. Forward figures are model estimates, not company guidance.';
// The standardized Overview body — 7 blocks in fixed order. Hook (Key Facts + Description + 2×2 table)
// stays visible; every section below defaults collapsed (progressive disclosure).
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid var(--brand-2, var(--brand));border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#E6007A;margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.mm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}@media(max-width:520px){.mm-stats{grid-template-columns:repeat(2,1fr)}}'+
    '.mm-stat{border:1px solid var(--bdr);border-radius:9px;padding:8px 11px;background:var(--w)}'+
    '.mm-stat-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.mm-stat-v{font-size:14px;font-weight:800;color:var(--navy);margin-top:2px}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp-seg{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 7px}.stdp-group:first-child .stdp-seg{margin-top:2px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:#E6007A}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:#E6007A;margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:8px 14px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:var(--navy);border-bottom-color:var(--navy)}'+
    '.dd-pane[hidden]{display:none}</style>';
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(LY_LEDE)+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How it makes money', stdMoneyMap());
  h+=collapsible('What it makes — the products', stdProducts());
  h+=collapsible('Competitors — valuation vs growth', stdPeerScatter());
  h+=collapsible('Timeline', stdTimeline());
  h+='<div class="ov-foot">'+esc(LY_OV_SOURCES)+'</div>';
  return h;
}

// ─── Top-level shell ──────────────────────────────────────────────────────────
function html(c){
  var h = '<div class="ov ov-lyft" data-brand="LYFT">';
  h += stdOverviewBody(c);
  // Shared modal (overview.css). Overview triggers use it directly; init() hoists it
  // to #co-detailview so the Deep Dive triggers reach it on the sibling tab too.
  h += '<div class="ov-modal-back" id="lyModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="lyModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="lyModalT"></div><div class="ov-modal-b" id="lyModalB"></div></div></div>';
  h += '</div>';
  return h;
}
// ── Deep Dive: SIBLING profile tab (rendered into the Deep Dive copane), no longer
//    nested inside the Overview. Holds all prior tabs (the old "Overview" becomes
//    "Deep Overview"). Nothing deleted (Golden Rule #1). Own root class (.ov-lyft-dd). ──
// ── Deep Dive reorganized into the proposed 5-tab spine: Top Line · Bottom Line ·
// Evolution · Valuation · Management. NOTHING deleted (Golden Rule #1) — every prior
// body is re-slotted, and the two live panels from the old Pillars tab are absorbed here
// (Valuation ▸ Analyst Ratings, Management ▸ Ownership & Insiders) via #dd-val-slot /
// #dd-mgmt-slot filled by companies.js. ──
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ EARNINGS — the decision layer (docs/EARNINGS_CONVENTIONS.md v2.10)
//
//  RENDERERS ported verbatim from js/overviews/googl.js AS IT STANDS ON MAIN — i.e.
//  AFTER PR #66, so the Watch List here is the SHARED engine (js/watchlist.js) with
//  Supabase persistence, not the old in-file copy. Only the DATA is Lyft's.
//
//  Excluded from the port because lyft.js already owns them: callsBody /
//  callsByQuarter (the LY_THEMES theme record, which ceWatchBody folds in),
//  wireSubtabs, wireDD and wireModal.
//
//  ⏰ LYFT REPORTS Q2 2026 ON THU 6 AUG 2026, AFTER CLOSE — so this ships
//  Setup-first: the live quarter is a print that has not happened yet.
// ════════════════════════════════════════════════════════════════════════════

// Accent colours the ported renderers expect (lyft.js already defines BRAND/BRAND2/GRAY).
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F';
// Captured in init/deepDiveInit — the shared Watch List needs the company id + ticker.
var _co=null;

// The two mandatory source buttons (§6).
var CE_IR_URL='https://investor.lyft.com/';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1759509&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/LYFT';

// ─── CE_CONS — the expectation grid ─────────────────────────────────────────
// ⚠ PROVENANCE. Lyft has NO rows in BBG_CONSENSUS.txt (the archive carries
// GOOG/GOOGL/HOOD/KKR/MA/META/UBER only), so there is no rolling Street matrix to
// reconstruct and the horizon columns collapse to ONE. TWO different outside
// expectations stand in its place, and they are kept in SEPARATE rows because they
// are not the same thing (Rule H — never blend two bases into one number):
//
//   qg — LYFT'S OWN GUIDE, midpoint of the guided range. Lyft guides exactly TWO
//        lines, Gross Bookings and Adjusted EBITDA (plus the margin those two imply),
//        so every other row is genuinely unguided rather than missing.
//   qs — STREET CONSENSUS, compiled PER PRINT from earnings-day coverage because
//        there is no archive to reconstruct it from. Sourced per quarter below; a
//        line with no defensible published number stays null rather than invented.
//
// `qr[qi][3]` is what the engine SCORES against — the Street where one exists, else
// the guide — and `qb[qi]` records which of the two it was, so every cell can say on
// screen which basis it is using instead of leaving the reader to assume.
// Summit comes from the model's live 2026-05-13 vintage.
//
// STREET SOURCES, per quarter (all secondary; upgrade to a Bloomberg export when one exists):
//   Q2 2026 (upcoming) — Gross Bookings $5.31B, Adj. EBITDA $169M and the 3.19% margin are the
//     consensus reported against the guide when it was issued on 7 May 2026 (so they are ~3
//     months stale; treated as the standing bar because nothing newer is published). Revenue
//     $1.84B and the $0.15 adj. EPS are the CURRENT aggregate (~40 contributors). ⚠ A 31 Jul 2026
//     preview instead framed revenue as "+14% YoY", which implies ~$1.81B — a ~2% spread between
//     two published views of the same line. The higher, more recent aggregate is used.
//   Q1 2026 (reported) — Revenue $1.64B (+13.1% YoY, Investing.com preview, 7 May 2026; StockStory
//     carried $1.63B the same day), Adj. EBITDA $130.7M (StockStory), Gross Bookings $4.91B and
//     ⚠ RIDES 241.5M (both TIKR). The rides cell is the important one: the print of 236.9M MISSED
//     it by 1.9%, and without a consensus that line would render unscoreable — which is exactly
//     how the quarter got read as a clean beat at the time.
//   Q4 2025 (reported) — Revenue $1.76B (Zacks consensus, corroborated by earnings-day coverage
//     noting ADJUSTED revenue "matched analyst expectations of $1.76 billion"). ⚠ THIS IS THE WHOLE
//     STORY OF THAT PRINT: the $1,592.7M reported is $1.76B less the $168M contra-revenue charge,
//     so the 9.5% "miss" is the charge and nothing else. Bookings were described as in line but no
//     figure was published, and no Adj. EBITDA consensus was found — both stay null.
var CE_CONS = (function(){
  var q = ['Q2 2026','Q1 2026','Q4 2025'];
  // qg = guide midpoint · qs = Street consensus · qa = the print · qy = year-ago actual · qq = prior-quarter actual
  function line(k, u, t, qg, qs, qa, qy, qq){
    return { k:k, u:u, t:t,
      qg:qg, qs:qs, qa:qa, qy:qy, qq:qq,
      qb:qg.map(function(g,i){ return qs[i]!=null ? 'Street' : (g!=null ? 'Guide' : null); }),
      qr:qg.map(function(g,i){ return [null,null,null, (qs[i]!=null?qs[i]:g)]; }) };
  }
  return {
    src:'TWO outside expectations, kept separate. GUIDE = Lyft\'s own guidance for each quarter, from the prior quarter\'s 8-K Ex. 99.1 (Q2 2026: $5.30–5.43B Gross Bookings and $160–180M Adjusted EBITDA, issued 7 May 2026); the grid shows the MIDPOINT. STREET = consensus compiled per print from earnings-day coverage — Lyft is not in the BBG_CONSENSUS.txt archive, so there is no matrix to reconstruct and any line without a defensible published number is left blank rather than invented. Summit is the model\'s live 2026-05-13 vintage.',
    asOf:['2026-05-07 (the guide) · Street as noted per line','2026-05-07 (the print)','2026-02-10 (the print)'],
    q:q, hz:['company guide / Street'], nHead:4,
    m:[
      line('Gross Bookings','$M','ok',
        /*guide*/ [5365, 4930, 5070], /*street*/ [5310, 4910, null],
        /*print*/ [null, 4946.0, 5074.2], /*yr ago*/ [4490.1, 4162.4, 4278.9], /*prior q*/ [4946.0, 5074.2, 4780.4]),
      line('Revenue','$M','ok',
        [null, null, null], [1840, 1640, 1760],
        [null, 1650.5, 1592.7], [1588.2, 1450.2, 1550.3], [1650.5, 1592.7, 1685.2]),
      line('Adjusted EBITDA','$M','ok',
        [170, 130, 145], [169, 130.7, null],
        [null, 132.8, 154.1], [129.4, 106.5, 112.8], [132.8, 154.1, 138.9]),
      line('Adj. EBITDA margin','%','ok',
        [3.15, 2.65, 2.86], [3.19, null, null],
        [null, 2.7, 3.0], [2.9, 2.6, 2.6], [2.7, 3.0, 2.9]),
      // ⚠ Rides DOES carry a Street number in 1Q26 (241.5M) — and the print missed it. Without
      // that cell the quarter's most important line would render as unscoreable.
      line('Rides','M','ok',
        [null, null, null], [null, 241.5, null],
        [null, 236.9, 243.5], [234.8, 218.4, 218.5], [236.9, 243.5, 248.8]),
      line('Active Riders','M','nocons',
        [null, null, null], [null, null, null],
        [null, 28.3, 29.2], [26.1, 24.2, 24.7], [28.3, 29.2, 28.7]),
      line('Free cash flow','$M','nocons',
        [null, null, null], [null, null, null],
        [null, 287.3, 227.6], [329.4, 280.7, 140.0], [287.3, 227.6, 277.8]),
      line('Insurance reserves','$M','nocons',
        [null, null, null], [null, null, null],
        [null, 2245.0, 2180.4], [1947.9, 1823.5, 1701.4], [2245.0, 2180.4, 2070.6])
    ]
  };
})();

var CALL_EARNINGS = { ticker:'LYFT', quarters:[
  { q:'Q2 2026', status:'upcoming', date:'reports Thu Aug 6, 2026 · after close (the scoreable reaction is the NEXT day)',
    setup:{
      source:'Lyft Q2 2026 guidance (8-K Ex. 99.1, 7 May 2026) · Summit — live 2026-05-13 vintage', asOf:'2026-05-07',
      notes:{
        'Gross Bookings':{ t:'Guided $5.30–5.43B (+18–21%) — but how much of it is bought?', h:'<p>Guided to <b>$5.30–5.43B, +18–21%</b>; the grid shows the <b>midpoint</b>. That acceleration is the headline, and the honest question is how much of it is organic.</p><p><b>Q2 2026 is the first quarter carrying BOTH acquisitions in full:</b> FREENOW (closed 31 Jul 2025, only two months in 3Q25) and <b>Gett\'s UK business, which closed the week of 7 May 2026</b>. Lyft has <b>never quantified either</b>, published no organic split and restated nothing. So a guide met on a bought top line, with organic decelerating underneath, would still be a miss in substance.</p>' },
        'Revenue':{ t:'Not guided — and 4Q25 still distorts the comp', h:'<p>Lyft does not guide revenue. Watch the spread against bookings: 4Q25 printed bookings +19% against revenue +3%, entirely because a <b>$168M contra-revenue charge</b> (legal/tax/regulatory) sat inside revenue while bookings and adjusted EBITDA were untouched. That is a comp artifact, not a take-rate collapse.</p>' },
        'Adjusted EBITDA':{ t:'Guided $160–180M — the line Lyft manages to', h:'<p>Guided to <b>$160–180M</b> (~3.0–3.3% of bookings), implying <b>+30%+</b> growth at the midpoint. Lyft has printed at or above the top of this guide in almost every quarter here, so the bar is really the top of the range, not the midpoint the grid shows.</p><p>⚠ Read the Summit line on this metric with care: for closed quarters the model MIRRORS the reported figure on guided lines, so a zero surprise there is an artifact.</p>' },
        'Adj. EBITDA margin':{ t:'This line IS a rate', h:'<p>Adjusted EBITDA as a percentage of <b>Gross Bookings</b> — the margin management is judged on, and the one that has to roughly double from here to reach the 2027 goal. The cell shows the rate itself, so the growth lens does not apply.</p><p>Guided to ~3.0–3.3% against 2.7% in Q1.</p>' },
        'Rides':{ t:'The demand tell, and it disappointed last quarter', h:'<p>Not guided. In millions of rides. <b>Q1 2026 rides FELL sequentially</b> (243.5 → 236.9) and disappointed even as bookings and revenue beat — which means <b>price and mix</b>, not volume, carried that quarter. Whether ride growth reinflates is the real question behind the bookings headline.</p>' },
        'Active Riders':{ t:'Watch the acquisition effect', h:'<p>Not guided. In millions. The 3Q25 step from 26.1M to 28.7M coincides with FREENOW entering the base, so it is not a clean organic acceleration — and Q1 2026 then fell back to 28.3M.</p>' },
        'Free cash flow':{ t:'One of the three 2027 targets', h:'<p>Not guided quarterly, but Lyft raised its own 2027 goal from ~$900M to <b>over $1B</b>, and FY2025 generation exceeded $1.1B. Flattered by the insurance-reserve build below while it accrues.</p>' },
        'Insurance reserves':{ t:'Where the cost claim gets audited', h:'<p>The balance-sheet reserve, not an expense. It has risen <b>every single quarter</b>, $1.39B → $2.25B. Management credits recent insurance reform and its own strategies for a falling average cost per ride; this is the line where that claim can actually be checked over time.</p>' }
      },
      us:{ 'Gross Bookings':{v:5363.4}, 'Revenue':{v:1815.3}, 'Adjusted EBITDA':{v:173.6}, 'Rides':{v:254.3}, 'Active Riders':{v:30.5}, 'Free cash flow':{v:276.6} },
      debate:{ rows:null, synth:'The one thing to resolve: is the guided <b>+18–21% bookings acceleration</b> a real reacceleration, or is it FREENOW plus Gett arriving in the base while organic demand keeps decelerating — the pattern Q1 already hinted at when <b>rides fell sequentially and the beat came from price and mix</b>? Lyft has never disclosed the inorganic split, so the answer has to be inferred from rides and active riders, not from the headline.' }
    },
    results:null, call:null },

  // ─── Q1 2026 — REPORTED (May 7, 2026). Frozen pre-print view + the print + the call. ───────────
  { q:'Q1 2026', status:'reported', date:'Thu May 7, 2026 · after close (call 5:00pm EDT)',
    setup:{
      source:'Lyft\'s Q1 2026 guide, issued 10 Feb 2026 with the Q4 2025 results (8-K Ex. 99.1) · Street compiled from earnings-day previews (7 May 2026) · Summit = the pre-print 2026-02-11 vintage',
      asOf:'2026-02-10 (the guide) · 2026-05-07 (Street)',
      notes:{
        'Gross Bookings':{ t:'Guided $4.86–5.00B (+17–20%), Street $4.91B', h:'<p>Guide midpoint <b>$4.93B</b> against a Street of <b>$4.91B</b> — the two are effectively on top of each other, because on this name the Street largely takes the guide. The print, $4,946M, cleared both by well under a percent.</p><p>That is the point: <b>a bookings number this close to the guide carries almost no information.</b> The quarter is decided by the lines underneath it.</p>' },
        'Revenue':{ t:'Not guided — Street $1.64B', h:'<p>Lyft does not guide revenue, so this line is Street-only: <b>$1.64B, +13.1% YoY</b> (Investing.com\'s 7 May preview; StockStory carried $1.63B the same morning — a ~0.6% spread).</p><p>⚠ The YoY comparison is clean here, but the QoQ is not: 4Q25 revenue carried a <b>$168M contra-revenue charge</b>, so the sequential base is artificially low.</p>' },
        'Adjusted EBITDA':{ t:'Guided $120–140M — and the guide itself was the problem', h:'<p>Midpoint <b>$130M</b>, against a Street of <b>$130.7M</b>: the two agree almost exactly, because the Street simply took the guide.</p><p>⚠ The real story is that this guide was issued <b>below</b> where the Street stood before the Q4 print (~$139.8M) — which is a large part of why the stock fell 17% on Feb 11. Going into Q1 the bar had already been reset down.</p>' },
        'Adj. EBITDA margin':{ t:'Guided 2.5–2.8% of Gross Bookings', h:'<p>Lyft\'s own stated range; the grid shows the <b>2.65% midpoint</b>. This line IS a rate, so the growth lens does not apply to it.</p>' },
        'Rides':{ t:'⚠ THE LINE THE QUARTER TURNED ON — Street 241.5M', h:'<p>Not guided, but the Street DID carry a number: <b>241.5M</b>. Lyft printed <b>236.9M</b>, <b>1.9% short</b> — and down sequentially from 243.5M — in the same quarter bookings and revenue cleared.</p><p><b>The verdict chip reads "in line", and that is the engine being conservative:</b> the tolerance is a flat 2% and this landed at 1.9%. Judge it on the combination instead. A shortfall against the Street <i>plus</i> a sequential decline <i>plus</i> beats everywhere else says the same thing three ways — the quarter came from price and mix, not from more rides.</p><p>⚠ Ignore the Summit line here. It reads <b>236.9</b>, <i>exactly</i> the reported figure to the decimal — the model carrying the actual back into the estimate once the quarter closed, not a forecast. Score nothing off it.</p>' },
        'Active Riders':{ t:'The line that had to prove FREENOW was not the whole story', h:'<p>Not guided, not covered. The 3Q25 step to 28.7M coincided with FREENOW entering the base; Q1 was the quarter to see whether the level held without a fresh acquisition.</p>' },
        'Free cash flow':{ t:'One of the three 2027 targets', h:'<p>Not guided quarterly. Summit had <b>$212.8M</b> going in. Watch it against the insurance-reserve build below — the reserve flatters cash while it accrues.</p>' },
        'Insurance reserves':{ t:'No forward number exists at all', h:'<p>Neither guided, nor covered, nor modelled — the Summit line has actuals but no projection for this metric. It is here as the audit trail on the falling-cost-per-ride claim, not as a scoreable line.</p>' }
      },
      us:{ 'Gross Bookings':{v:4937.5}, 'Revenue':{v:1705.4}, 'Adjusted EBITDA':{v:136.2}, 'Adj. EBITDA margin':{v:2.76}, 'Rides':{v:236.9}, 'Active Riders':{v:28.6}, 'Free cash flow':{v:212.8} },
      debate:{ rows:null, synth:'Going in, the bar had already been cut: the Q1 guide issued in February landed <b>below</b> where the Street had been standing, and the stock had taken a 17% hit for it. So the question was not whether Lyft would clear $130M of adjusted EBITDA — it was whether the February reset was conservatism or the first sign that the 2027 plan was slipping. The tell was never going to be the headline; it was whether <b>rides</b> kept compounding once FREENOW stopped being a fresh addition.' },
      pricedIn:'A stock that had fallen from $25.54 (Nov 2025) to a $12.46 low on Mar 30 and was trading at $14.23 the day before the print — roughly half its 52-week high. February\'s below-Street guide was in the price; the tape was braced for a soft quarter, not for a good one.',
      oneLiner:'Pre-call view: the guide was low enough to clear, so a beat on bookings and adjusted EBITDA was the base case. The thing that would actually move the thesis was the demand line underneath it — if rides went sideways while bookings accelerated, the acceleration was price and mix, not more people taking more Lyfts.'
    },
    results:{
      headline:'<b>Beat the headline, missed the point.</b> Bookings +19% to $4.95B and adjusted EBITDA $132.8M both cleared, revenue came in $1.65B against a $1.64B Street — and underneath it <b>rides FELL sequentially</b>, 243.5M → 236.9M, with active riders also down from 29.2M to 28.3M. Both counts are still up strongly YoY. The quarter was carried by price and mix, and the release itself was unusually thin: no mention of the $300M buyback, of Lyft Media, or of any AV partner.',
      notes:{
        'Rides':{ t:'⚠ The line that matters, and it went the wrong way', h:'<p><b>236.9M vs 243.5M in Q4</b> — down sequentially, and down against a Summit line that had 236.9M only because the model mirrored the actual. Q1 is seasonally softer and management attributed ~3 million rides to winter storm Hernando, which covers part of the gap but not the trend.</p><p><b>So what:</b> bookings +19% on rides that did not grow sequentially means the acceleration came from <b>price, mix and high-value modes</b> — management said high-value-mode rides were up 35% YoY at <i>more than double</i> a standard ride\'s margin. That is a real margin story and a weak volume story at the same time.</p>' },
        'Revenue':{ t:'A clean +14%, and a flattered sequential', h:'<p>$1,650.5M, +13.8% YoY against a $1.64B Street. The QoQ (+3.6% off $1,592.7M) looks worse than it is only because the Q4 base carried the $168M charge.</p>' },
        'Adjusted EBITDA':{ t:'A 1.6% beat — the smallest kind', h:'<p>$132.8M against $130.7M. Lyft has printed at or above the TOP of its guided range in almost every quarter; here it landed just inside the upper half. Margin 2.7% of bookings against a 2.5–2.8% guide.</p>' },
        'Free cash flow':{ t:'The one big beat on the board', h:'<p>$287.3M against a Summit line of $212.8M — <b>+35%</b>, the largest surprise in the quarter. Helped by the insurance-reserve build (+$64.6M in the quarter), which is cash in hand until the claims land.</p>' }
      },
      watch:{ 'Rides':1, 'Active Riders':2, 'Gross Bookings':3, 'Adjusted EBITDA':4 },
      thesisCheck:[
        { line:'Bookings acceleration is bought, not organic', tripped:true, note:'Not resolved, and now harder to resolve: bookings +19% with rides DOWN sequentially. FREENOW and TBR are in the base and Lyft still publishes no organic split. The acceleration is real; its source is not disclosed.' },
        { line:'Demand growth stalls (rides / active riders)', tripped:true, note:'Both fell QoQ — rides 243.5M → 236.9M, riders 29.2M → 28.3M — and rides also landed 1.9% under the Street\'s 241.5M, so this is not purely a seasonal read. Storm Hernando explains ~3M rides. Still +8.5% and +17% YoY, so it is a stall in the sequential rather than a decline in the franchise.' },
        { line:'Margin expansion stops', tripped:false, note:'Gross margin expanded YoY on a lower average insurance cost per ride; adjusted EBITDA +25% YoY on 2.7% of bookings. The 2027 bridge still needs roughly a doubling from here.' },
        { line:'AV partnerships stay slideware', tripped:false, note:'Three DATED commitments made on this call: fleet ops taken over "this summer", an 80,000 sq ft Nashville depot "this fall", and Lyft-app Waymo matching in 2H26. First time the AV story carried calendar dates.' },
      ],
      intoCall:[
        '🔥 <b>Rides fell sequentially</b> — how much was storm Hernando, how much was the 30% driver fee cap, and how much is real demand?',
        '🔩 <b>The organic split</b> — FREENOW, TBR and now Gett are all in the base. Ask directly for a like-for-like bookings number.',
        '⚖️ <b>$300M of buybacks in one quarter</b> against full-year guidance of "similar to 2025" (~$500M) — that implies a sharp slowdown from here. Is it a rate or a one-off?',
        '📊 <b>Pricing</b> — Morton asked point-blank what YoY pricing is on a standard ride. Get the number, because it is the other half of the bookings-vs-rides gap.',
        '❓ <b>Waymo in the Lyft app</b> — 2H26 is a promise with a date. What is the gating item?',
      ],
      priceReaction:'<b>+1.34%</b> — next-day close $14.35 on May 8 (prior close $14.23; the day-of close was $14.16). ⚠ The after-hours tape showed roughly −3% and was wrong again; LYFT\'s overnight prints are unreliable and the next-day close is the record we keep.',
      summary:{ paras:[
        { p:'<b>Lyft beat the headline and missed the point.</b> Bookings +19% to $4.95B, adjusted EBITDA $132.8M and revenue $1.65B all cleared — and <b>rides came in short of the Street</b>, 236.9M against 241.5M, falling sequentially from 243.5M while active riders slipped from 29.2M to 28.3M. Both counts are still up strongly year over year, so this is a stall in the sequential rather than a decline in the franchise. But it means the acceleration was carried by <b>price and mix</b>, not by more people taking more Lyfts.',
          moreLabel:'＋ more — what carried the quarter instead of volume',
          more:'<p>Management\'s own explanation was mix: <b>high-value mode rides up 35% year over year at "margins more than double a standard ride"</b>, still a single-digit percent of rides. Roughly 3 million rides were attributed to winter storm Hernando, which covers part of the sequential gap but not the shape of it.</p><p>The other half is the take rate. Bookings grew faster than rides because the average ride got more expensive or more premium — and when Michael Morton (MoffettNathanson) asked <i>point-blank</i> what year-over-year pricing was on a standard ride, he did not get a number. That number is the missing half of this quarter.</p>' },
        { p:'<b>We still cannot tell how much of the growth was bought.</b> FREENOW, TBR Global and now Gett\'s UK business are all inside the reported base, and Lyft has never published an organic split or restated anything. That makes Q2 2026 the quarter that matters: it is the <b>first to carry both FREENOW and Gett in full</b>, against a guide of +18–21%.',
          moreLabel:'＋ more — why Europe was bought, and what it is not for',
          more:'<p>Gett closed the week of the call — "one of London\'s leading black cab apps… will nearly double the number of rides on the Lyft platform in London" — and was immediately deflated financially: <b>"Although strategically material, this will be financially immaterial to the quarter."</b></p><p>Read together with FREENOW ("a decade of relationships with local governments… gives Lyft a structural advantage that would take years to replicate") and the Baidu partnership, the European acquisitions are one trade, and it is <b>regulatory access for AV deployment</b>. Judging them on near-term revenue misreads what they were bought for — but it also means they contribute bookings without contributing much profit, which is exactly what makes the organic split matter.</p>' },
        { p:'<b>The AV story got dates for the first time.</b> Fleet operations taken over "this summer", an 80,000 sq ft Nashville depot "this fall", and Waymo matching inside the Lyft app in <b>2H26</b> — three scoreable promises with deadlines, where before there was positioning. The argument underneath them is operations, not autonomy.',
          moreLabel:'＋ more — the operations claim, and one thing coverage keeps getting wrong',
          more:'<p>Risher: "The vehicle itself is just the start of the total cost of an AV fleet. The rest — charging, maintenance, cleaning, depot infrastructure, fleet orchestration — is operations. Most have to pay someone else to do that work. We don\'t. Flexdrive has spent a decade and built dozens of facilities doing this. <b>Nashville isn\'t where we\'re learning how to do this, it\'s where we are starting to commercialize it.</b>"</p><p>⚠ <b>The status point most often reported wrong:</b> as of this call you could <b>not</b> order a Waymo in the Lyft app. Waymo launched public rides in Nashville on Apr 7, 2026 through its own <b>Waymo One</b> app; Lyft-app matching is the thing guided to 2H26.</p>' },
        { p:'<b>Management called its own stock dislocated and bought $300M of it in a single quarter</b> — against full-year guidance of buybacks "at a similar level to 2025", which was about $500M. Either the pace collapses to roughly $200M across the remaining three quarters, or that guidance is deliberately conservative. It cannot be both.',
          moreLabel:'＋ more — and how thin the press release was',
          more:'<p>The buyback was <b>not in the press release</b>. Neither was Lyft Media, Waymo, or any AV partner. Call-only material also included the insurance-driven gross-margin bridge, the three dated Nashville milestones, the 58% / 38-point driver-preference figure, the NBER study, the Hamburg pilot, the McDonald\'s campaign launching that day, and that Suzie Reider (ex-YouTube) runs the ad group.</p><p>This is a recurring pattern for this name — the Q4 2025 charge split was Q&A-only too — and it is why the headline number and the actual quarter keep diverging.</p>' }
      ]},
    },
    call:{
      take:'The call was better than the print. Management put <b>dates</b> on the AV story for the first time — summer, fall, 2H26 — and made the strongest version of the argument that Lyft\'s edge is not autonomy but <b>operations</b>: Flexdrive already runs depots, charging and cleaning at scale, which is the part of an AV fleet nobody else wants to own. Against that: <b>rides fell sequentially</b>, and the release itself was so thin that the buyback, Lyft Media and every AV partner were call-only disclosures.',
      highlights:[
        { tag:'thesis', band:'context', open:'Three dated commitments — the first scoreable AV calendar Lyft has given', head:'"Nashville isn\'t where we\'re learning how to do this, it\'s where we are starting to commercialize it"',
          detail:'<p>Risher put dates on it: fleet operations, facilities and charging taken over <b>this summer</b>; an <b>80,000 sq ft depot this fall</b>; and <b>in 2H26, riders will be able to match with a Waymo vehicle in the Lyft app</b>. The framing: "The vehicle itself is just the start of the total cost of an AV fleet. The rest — charging, maintenance, cleaning, depot infrastructure, fleet orchestration — is operations. Most have to pay someone else to do that work. We don\'t."</p><p><b>So what:</b> this converts the AV story from positioning into three checkable promises with deadlines. ⚠ As of this call you could <b>not</b> yet order a Waymo in the Lyft app — Waymo went live in Nashville on Apr 7 through its own app. Coverage that says otherwise is wrong.</p>' },
        { tag:'watch', band:'context', open:'Bookings +19% on rides that fell — what is the organic number?', head:'The demand line went backwards, missed the Street, and the release did not explain it',
          detail:'<p>Rides 243.5M → 236.9M and active riders 29.2M → 28.3M sequentially, with ~3 million rides attributed to winter storm Hernando. Rides also landed <b>1.9% under the Street\'s 241.5M</b> — the only line in the quarter that came in under expectations. Meanwhile <b>high-value mode rides were up 35% YoY at "margins more than double a standard ride"</b> — still a single-digit percent of rides.</p><p><b>So what:</b> the quarter was carried by price and mix. With FREENOW, TBR and now Gett in the base and <b>no organic split ever published</b>, there is currently no way to tell an accelerating marketplace from an acquired one. This is the single biggest open question into Q2.</p>' },
        { tag:'curious', band:'context', open:'$300M in one quarter vs ~$500M for the year — the pace has to fall by two thirds', head:'A $300M buyback nobody was told about in the release, on an explicit "dislocation" call',
          detail:'<p>"We repurchased approximately $300 million in shares, <b>taking an opportunistic approach to capital return given what we viewed as a dislocation in our share price.</b> For 2026, we expect buybacks at a similar level to 2025" — and 2025 was ~$500M.</p><p><b>So what:</b> management explicitly called its own stock mispriced near the lows, which is a real signal. But $300M in Q1 against ~$500M for the year implies roughly $200M across the remaining three quarters. Either the guide is conservative or the Q1 pace was a one-off; it cannot be both.</p>' },
        { tag:'thesis', band:'context', head:'Insurance reform is showing up in the margin, and California beat its own back-half framing',
          detail:'<p>"Gross margin expanded year over year driven by a reduction in our average insurance cost per ride aided by recent insurance reforms and advancement of our insurance strategies." Brewer reported California already outpacing other top regions in February and March.</p><p><b>So what:</b> on the Q4 call management had guided California\'s benefit as <b>back-half weighted</b>. It arrived early — a rare case of a company beating its own conservatism, and the mechanism behind the margin expansion is now specific rather than generic.</p>' },
        { tag:'tone', band:'context', head:'The competitive claim widened: 58% of dual-app drivers prefer Lyft, a 38-point advantage (was 31)',
          detail:'<p>"When dual-app drivers were asked in our most recent survey which rideshare app they prefer, 58% answered Lyft, a 38-percentage point advantage to the other guys." Paired with an NBER study: a NYC rider taking 100 rides in 2024 would have saved ~$177 by checking both apps.</p><p><b>So what:</b> 31 points → 38 points is two consecutive quarters of a <b>management-chosen</b> metric, which promotes it to a tracked trend. It is a survey and it is self-selected — but it is now on the record twice and can be scored.</p>' },
        { tag:'dots', band:'context', head:'Europe is being assembled as an AV regulatory position, not as a revenue line',
          detail:'<p>Gett\'s UK business closed that week — "one of London\'s leading black cab apps… will nearly double the number of rides on the Lyft platform in London" — and immediately deflated financially: <b>"Although strategically material, this will be financially immaterial to the quarter."</b> On FREENOW: "a decade of relationships with local governments… gives Lyft a structural advantage that would take years to replicate."</p><p><b>So what:</b> connect the dots — FREENOW, Gett and the Baidu partnership are one trade, and it is regulatory access for European AV deployment. Judging these deals on near-term revenue misreads what they were bought for.</p>' },
        { tag:'curious', band:'logged', head:'Lyft Media is becoming a data business: $100M run-rate target, "Audience Extension", and an ex-YouTube leader',
          detail:'<p>Ads on a path to a <b>$100M run rate by end 2026</b>, an off-platform "Audience Extension" product with The Trade Desk, the McDonald\'s campaign launching that day, and Suzie Reider (ex-YouTube) running the group — <b>none of it in the press release</b>.</p><p><b>So what:</b> the pitch has shifted from selling in-app inventory to monetising first-party movement data. Small today; the highest-margin dollar in the model if it works.</p>' },
      ],
      dots:'<b>The operations argument is the strongest version of the AV bull case Lyft has made</b> — and it now has three dates attached to it. But the quarter it was delivered in had rides going backwards, an undisclosed organic split, and a press release so thin that the buyback, the ads business and every AV partner had to be found on the call. Score the promises; keep the pressure on the demand line.',
      threeMinutes:[
        'Lyft beat on bookings, revenue and adjusted EBITDA — <b>and rides fell sequentially</b>, 243.5M to 236.9M, with active riders down too. Storm Hernando covers about 3 million of that. The rest means the +19% bookings number was carried by <b>price and mix</b>, not by more people taking more Lyfts.',
        '<b>We still cannot tell how much of the growth was bought.</b> FREENOW, TBR Global and now Gett are all in the base and Lyft has never published an organic split. That is the question for Q2, which is the first quarter carrying both FREENOW and Gett in full.',
        '<b>The AV story got dates for the first time.</b> Fleet operations this summer, an 80,000 sq ft Nashville depot this fall, and Waymo matching inside the Lyft app in 2H26. The argument underneath it is operations, not autonomy — Flexdrive already runs the depots and charging that AV fleets need and would otherwise outsource.',
        '<b>Management called its own stock dislocated and bought $300M of it in one quarter</b>, against full-year guidance of roughly $500M. Either the buyback pace collapses from here or that guidance is conservative.',
      ],
      notBringing:[
        { item:'The Hamburg first-mile/last-mile pilot', why:'Real, and the vehicle partner is "being finalized" — but an unnamed partner in one city does not move anything we underwrite this year.' },
        { item:'Lyft Maps mapping starting in Barcelona', why:'Infrastructure groundwork for European AV. Worth logging, too early to defend meeting time.' },
        { item:'The fuel relief program', why:'Management sized it itself — "almost a dollar in savings", "not material to our overall financial profile". Resolved by disclosure.' },
      ],
      newQuestions:[
        { n:'The organic bookings split — FREENOW + Gett in full for the first time', landed:{ q:'Q2 2026', rank:1 } },
        { n:'Do rides reinflate, or was Q1 the shape of things? (1Q26 landed 1.9% under the Street)', landed:{ q:'Q2 2026', rank:2 }, tripped:true },
        { n:'Buyback pace: $300M/quarter or ~$200M for the rest of the year?', landed:{ q:'Q2 2026', rank:4 } },
        { n:'YoY pricing on a standard ride — the number Morton asked for', landed:{ q:'Q2 2026', rank:3 } },
        { n:'Waymo-in-the-Lyft-app: is 2H26 still on?', landed:{ q:'Q2 2026', rank:5 } },
      ],
    } },

  // ─── Q4 2025 — REPORTED (Feb 10, 2026). The −17% quarter, and why the revenue "miss" was not one. ─
  { q:'Q4 2025', status:'reported', date:'Tue Feb 10, 2026 · after close (call 5:00–5:45pm EST)',
    setup:{
      source:'Lyft\'s Q4 2025 guide, issued 5 Nov 2025 with the Q3 2025 results (8-K Ex. 99.1) · Street revenue from Zacks consensus · Summit = the pre-print 2025-12-15 vintage',
      asOf:'2025-11-05 (the guide) · 2026-02-10 (Street)',
      notes:{
        'Gross Bookings':{ t:'Guided $5.01–5.13B — midpoint $5.07B', h:'<p>Bookings were described in earnings-day coverage as landing <b>in line</b> with Wall Street, but no consensus figure was published, so the Street row is blank. The guide midpoint is the honest reference here.</p>' },
        'Revenue':{ t:'⚠ THE MOST IMPORTANT CELL ON THIS GRID — $1.76B', h:'<p>Zacks consensus was <b>$1.76B</b>. Lyft reported <b>$1,592.7M</b>, a 9.5% "miss" that generated the headlines.</p><p><b>It was not a miss.</b> Inside that number sits a <b>$168M contra-revenue charge</b> from legal, tax and regulatory reserve changes (part of a $210M total, a split management gave only in Q&A — it was not in the press release). Add it back and revenue is ~$1.76B: <i>exactly the consensus</i>. Earnings-day coverage that looked at adjusted revenue said so — "matched analyst expectations of $1.76 billion" — but the headline number is what moved the stock.</p>' },
        'Adjusted EBITDA':{ t:'Guided $135–155M — no published Street number', h:'<p>Midpoint <b>$145M</b>. The charge does <b>not</b> touch this line: the full $211.6M is added back, so the adjusted-EBITDA print and its margin are clean and comparable.</p>' },
        'Adj. EBITDA margin':{ t:'~2.86% implied by the two guided lines', h:'<p>⚠ Derived, not stated: Lyft published the Q4 margin range for some quarters and not others, so this midpoint is computed as the guided EBITDA midpoint ÷ the guided bookings midpoint. Treat it as an implication of the guide, not as guidance.</p>' },
        'Rides':{ t:'Not guided, not covered', h:'<p>The Q4 seasonal peak. FY2025 totalled 945.5M rides across 51.3M riders — "that\'s 30 rides a second" (Risher).</p>' },
        'Active Riders':{ t:'The line the coverage called disappointing', h:'<p>Not guided and not covered, which did not stop rider growth from being named in the headlines as a reason the stock fell. 29.2M, +18% YoY.</p>' },
        'Free cash flow':{ t:'The FY2025 story more than the quarter', h:'<p>Not guided quarterly. The number that mattered was the full year: FY2025 cash generation <b>exceeded $1.1B</b>, which is what let management raise the 2027 goal from ~$900M to over $1B.</p>' },
        'Insurance reserves':{ t:'$1.70B → $2.18B over the year', h:'<p>No forward number of any kind. The year-end balance is the audit point on the falling-cost-per-ride claim.</p>' }
      },
      us:{ 'Gross Bookings':{v:5076.2}, 'Revenue':{v:1799.4}, 'Adjusted EBITDA':{v:160.8}, 'Adj. EBITDA margin':{v:3.17}, 'Rides':{v:256.5}, 'Active Riders':{v:29.9}, 'Free cash flow':{v:310.7} },
      debate:{ rows:null, synth:'Going in, this was supposed to be a victory lap: record year, the 2027 plan on track, and a stock that had run to $25.54 in November. The risk was never the quarter — it was <b>2026</b>. Consensus had already moved past Q4 to the shape of the next year, and the one thing that could break the story was a guide that implied the 2027 bridge was getting steeper rather than flatter.' },
      pricedIn:'Near the highs and priced for the plan. LYFT closed $16.61 the day before and had touched $25.54 in November; the 2027 targets (~$25B bookings, ~$1B adjusted EBITDA) were being underwritten as achievable. Expectations were for a clean record print and a 2026 that stepped toward them.',
      oneLiner:'Pre-call view: the quarter itself was a formality. What mattered was the first 2026 guide — whether the margin ramp implied by the 2027 plan showed up in Q1, or whether it was being pushed out.'
    },
    results:{
      headline:'<b>A record quarter that the tape read as a disaster.</b> Bookings +19% to $5.07B, adjusted EBITDA +37% to a record $154.1M, FY2025 cash generation over $1.1B, a new $1.0B buyback authorization — and the stock fell <b>17%</b> the next day. Two things did it: a revenue line that printed $1.59B against a $1.76B consensus <i>because of a $168M contra-revenue charge</i>, and a Q1 2026 adjusted-EBITDA guide of $120–140M against a Street sitting near $139.8M.',
      notes:{
        'Revenue':{ t:'⚠ The "miss" was the charge, and nothing else', h:'<p>$1,592.7M vs $1.76B consensus = −9.5%. Add back the <b>$168M contra-revenue charge</b> (of a $210M total for legal, tax and regulatory reserve changes and settlements) and revenue is ~$1.76B — the consensus, to the decimal.</p><p><b>So what:</b> this is the single most misread number in Lyft\'s recent record. It is why Q4 2025 shows bookings <b>+19%</b> against revenue <b>+3%</b>. It is not a take-rate collapse and it is not a demand miss. ⚠ The $210M/$168M split was disclosed <b>only in Q&A</b> — it was not in the press release, so the first wave of coverage did not have it.</p>' },
        'Adjusted EBITDA':{ t:'A record, and clean despite the charge', h:'<p>$154.1M, +37% YoY, 3.0% of bookings against 2.6% a year earlier — inside the guided $135–155M range and near its top. The full $211.6M of charges is added back, so this line and its margin are directly comparable to prior quarters.</p>' },
        'Gross Bookings':{ t:'+19%, in line, and not the problem', h:'<p>$5,074.2M against a $5.07B guide midpoint — described in coverage as in line with the Street. FY2025 bookings $18.5B, +15%.</p>' },
        'Active Riders':{ t:'Named in the headlines as a reason for the fall', h:'<p>29.2M, +18% YoY. CNBC\'s headline explicitly cited "rider numbers" alongside the results. Read alongside the sequential picture: this was the peak before Q1 2026 fell back to 28.3M.</p>' }
      },
      watch:{ 'Revenue':1, 'Adjusted EBITDA':2, 'Gross Bookings':3, 'Active Riders':4 },
      thesisCheck:[
        { line:'The 2027 plan slips', tripped:true, note:'Not in the words — "TL;DR - we\'re on track", with the FCF goal RAISED from ~$900M to over $1B. But the Q1 2026 guide came in below the Street, and the Summit model cut FY2027 adjusted EBITDA in the very next vintage. The plan was reaffirmed; the path to it got steeper.' },
        { line:'Take rate is deteriorating', tripped:false, note:'The +19% bookings vs +3% revenue gap is entirely the $168M charge. Ex-charge the relationship is normal. Explicitly NOT tripped, despite being the story the tape told.' },
        { line:'AVs are a threat, not an opportunity', tripped:false, note:'The best single datapoint yet against the threat thesis: in San Francisco, the global AV hub, the market added millions of rides in Q4 and <b>Lyft rides in the region still grew almost 10%</b>. Paired with the honest near-term caveat: "AVs are not going to be material in 2026."' },
        { line:'Competitive discipline breaks', tripped:false, note:'"During a season of heightened competitive promotions, we prioritized the most durable, profitable demand" — Lyft explicitly declined to chase volume. That choice shows up in the ride count, and management owned it rather than hiding it.' },
      ],
      intoCall:[
        '🔥 <b>The revenue line</b> — get the charge quantified and split. (It was, but only in Q&A.)',
        '🔩 <b>The Q1 guide</b> — $120–140M is below where the Street stood. Is that conservatism, competitive pressure, or the California insurance benefit arriving later than hoped?',
        '⚖️ <b>The 2027 bridge</b> — ~$1B of adjusted EBITDA from $528.8M in FY2025. What carries it: margin, mix, or Europe?',
        '📊 <b>Flexdrive\'s 20% cost claim</b> — how is it measured, and does it hold outside Nashville?',
        '❓ <b>Why so few AV partners?</b> Is that selectivity or is something not closing?',
      ],
      priceReaction:'<b>−16.97%</b> — next-day close $13.99 on Feb 11 (prior close $16.61; the day-of close was $16.85). ⚠ The after-hours tape showed roughly <b>+1.6%</b> and was flatly wrong. This is the worst reaction in the record we keep and the clearest case for never quoting LYFT\'s overnight print.',
      summary:{ paras:[
        { p:'<b>The revenue miss was not a miss.</b> $1,592.7M against a $1.76B consensus is a 9.5% shortfall entirely explained by a <b>$168M contra-revenue charge</b> — part of a $210M legal, tax and regulatory reserve — whose existence and split management disclosed <b>only in Q&amp;A</b>. Add it back and revenue is ~$1.76B: the consensus, almost exactly. It is also the whole reason this quarter shows bookings +19% against revenue +3%.',
          moreLabel:'＋ more — why the charge does not touch the other lines',
          more:'<p>Adjusted EBITDA adds back the full <b>$211.6M</b>, so the record $154.1M print and its 3.0% margin are clean and directly comparable to prior quarters. Gross Bookings are untouched. Only the revenue line and the GAAP net income carry the distortion.</p><p>Earnings-day coverage that looked at <i>adjusted</i> revenue said so plainly — it "matched analyst expectations of $1.76 billion" — but the headline number is what traded. Treat any single-quarter revenue read on this name as suspect until you have located the charges.</p>' },
        { p:'<b>What actually cost 17% was the guide.</b> Q1 2026 adjusted EBITDA was guided to <b>$120–140M against a Street sitting near $139.8M</b> — the top of Lyft\'s own range — on a flat-to-lower margin, in the very quarter the ramp toward a ~$1B 2027 target was supposed to begin. The destination was reaffirmed; the first step went the wrong way.',
          moreLabel:'＋ more — and the model agreed with the market',
          more:'<p>Risher\'s framing on the long-range plan was "<b>TL;DR - we\'re on track</b>", with the free-cash-flow goal actually <b>raised</b> from ~$900M to over $1B on the back of FY2025 generation exceeding $1.1B. The three 2027 goals as stated: ~$25B gross bookings, ~$1B adjusted EBITDA, >$1B free cash flow.</p><p>But the Summit model cut FY2027 adjusted EBITDA in its <b>very next vintage</b> after this print, and by the May snapshot carried $830M — roughly 17% short of the ~$1B goal, having started above it. The Estimates tab shows that revision in full: what came down was not how big Lyft gets, but how much of it it keeps.</p>' },
        { p:'<b>The AV evidence got real, and it cuts for Lyft.</b> In San Francisco — the densest AV market on earth — the market added millions of new rides in Q4 and <b>Lyft rides in the region still grew almost 10%</b>. Management paired it with the honest caveat that AVs "are not going to be material in 2026… from a financial perspective." Expansion, not substitution, so far.',
          moreLabel:'＋ more — the hybrid argument and the Flexdrive number',
          more:'<p>Why not AV-only: rideshare demand "can vary by 20x in San Francisco throughout the day and week", so AVs supply consistent baseline capacity and human drivers absorb the spikes. Bluntly, in Q&amp;A: <b>"You cannot build an AV only."</b></p><p>The cost claim the whole operations moat rests on: Flexdrive can deliver <b>"cost efficiencies of more than 20%, on top of the broad AVs savings, on a per mile basis"</b> — stretched to "24%, 25%" under questioning. It is management\'s own unaudited estimate and should be scored every quarter Nashville runs.</p>' },
        { p:'<b>Management was already calling the stock cheap.</b> A new <b>$1.0B</b> repurchase authorization, described as "roughly 15% of Lyft\'s market capitalization, as of today". Three months later, after the stock fell another 17% on this very print, they spent $300M of it in one quarter on an explicit "dislocation" call.',
          moreLabel:'＋ more — and the discipline choice behind the ride count',
          more:'<p>FY2025 buybacks were ~$500M, "which reduced our share count by mid-single digits."</p><p>On volume, management pre-announced the softness rather than letting it be discovered: "As the quarter evolved, we made intentional tradeoffs that influenced ride growth, prioritizing durable financial performance over dilutive volume. During a season of heightened competitive promotions, we prioritized the most durable, profitable demand." Whether that is discipline or rationalisation is testable — it should show up as margin, and Q4 margin did reach 3.0%.</p>' }
      ]},
    },
    call:{
      take:'Management delivered a record year and a reaffirmed plan — <b>"TL;DR - we\'re on track"</b> — and the market ignored all of it. The call\'s real content was the AV argument, which got its strongest evidence yet (San Francisco rides <b>+~10%</b> in the most AV-dense market on earth) and its most honest caveat ("AVs are not going to be material in 2026"). The two things that actually moved the stock were a revenue optic caused by a charge that was only explained in Q&A, and a Q1 guide below the Street.',
      highlights:[
        { tag:'thesis', band:'context', open:'Does SF hold as AV density keeps rising?', head:'The best datapoint against the AV-threat thesis: SF added millions of AV rides and Lyft still grew ~10% there',
          detail:'<p>"In San Francisco, the global hub for this tech, the market added millions of new rides to the ecosystem in Q4 alone. <b>Meanwhile, Lyft rides in the region grew almost 10%.</b>" And in Q&A: "AVs are going to expand the TAM of rideshare. There\'s just no doubt about it" — immediately paired with "AVs are not going to be material in 2026, you know, from a financial perspective."</p><p><b>So what:</b> this is the one place the AV-displacement question has a controlled experiment, and the answer so far is expansion, not substitution. Management made the bull case and refused to monetise it early — candor against interest.</p>' },
        { tag:'watch', band:'context', open:'A guide below the Street on the quarter the 2027 ramp was supposed to start', head:'The number that cost 17%: Q1 adjusted EBITDA guided $120–140M against a Street near $139.8M',
          detail:'<p>Guidance: bookings $4.86–5.00B (+17–20%), adjusted EBITDA $120–140M at a 2.5–2.8% margin. The Street was sitting at roughly $139.8M — the <b>top</b> of that range.</p><p><b>So what:</b> the 2027 plan needs adjusted EBITDA to roughly double from FY2025\'s $528.8M. A first quarter guided at a flat-to-lower margin is the opposite of the ramp the plan implies. Reaffirming the destination while guiding the first step down is exactly what a stock prices as a slip — and the Summit model then cut FY2027 adjusted EBITDA in its very next vintage.</p>' },
        { tag:'curious', band:'context', open:'The $210M total and its $168M revenue split were Q&A-only', head:'The charge that created the "revenue miss" was never in the press release',
          detail:'<p>Brewer gave it under questioning: a <b>$210M</b> legal, tax and regulatory reserve charge, <b>$168M</b> of it booked as contra-revenue. Ex-charge, revenue was ~$1.8B against a $1.76B consensus.</p><p><b>So what:</b> the first hours of coverage priced a 9.5% revenue miss that did not exist. Disclosure practice has a price, and here it was most of a 17% drawdown. Worth remembering when reading any single quarter of this name off the headline.</p>' },
        { tag:'thesis', band:'context', head:'Flexdrive quantified: >20% additional cost efficiency per mile on top of the broad AV savings, and "24%, 25%" in Q&A',
          detail:'<p>"We estimate our operations can deliver additional cost efficiencies of more than 20%, on top of the broad AVs savings, on a per mile basis" — with Brewer stretching it to "24%, 25%" under questioning. Why hybrid: demand varies "by 20x in San Francisco throughout the day and week", so AVs supply the baseline and humans the peaks. Bluntly: <b>"You cannot build an AV only."</b></p><p><b>So what:</b> this is the number the whole operations moat rests on. It is management\'s own estimate, unaudited, and it should be scored every quarter Nashville runs.</p>' },
        { tag:'tone', band:'context', head:'"We made intentional tradeoffs that influenced ride growth" — Lyft chose not to chase Q4 volume',
          detail:'<p>"During a season of heightened competitive promotions, we prioritized the most durable, profitable demand in the marketplace." Paired with the Super Bowl: <b>15% more rides at ~20% lower surge</b>.</p><p><b>So what:</b> management pre-announced a soft ride number and explained it as a choice rather than letting it be discovered. Whether it is discipline or rationalisation is testable — it should show up as margin, and Q4 margin did hit 3.0%.</p>' },
        { tag:'curious', band:'context', head:'A $1.0B buyback authorization — "roughly 15% of Lyft\'s market capitalization, as of today"',
          detail:'<p>New authorization on top of ~$500M executed in FY2025, "which reduced our share count by mid-single digits." The 15% remark implies a ~$6.7B market cap at the time.</p><p><b>So what:</b> the seed of the "dislocation" buying that showed up as $300M in Q1 2026. Management was signalling the stock was cheap <i>before</i> it fell another 17%.</p>' },
        { tag:'watch', band:'logged', head:'The IR/FP&A lead left, and it was announced verbally only',
          detail:'<p>Aurélien Nolf (VP FP&A and IR) departed — "Aurelien, you have been an incredible thought partner and finance leader" — to become <b>CFO of Navan effective Mar 2, 2026</b>, announced the same day. Erin Rome succeeded him.</p><p><b>So what:</b> not a thesis item, but a personnel change disclosed only on the call is worth logging as a pattern alongside the charge split. It also explains any change in IR tone from Q1 2026 onward.</p>' },
      ],
      dots:'<b>The gap between what was said and what was priced was the widest in this name\'s record.</b> A record year, a raised FCF goal, a $1B authorization and the strongest AV evidence yet — against a revenue optic created by a charge explained only in Q&A and a first-quarter guide below the Street. The lasting lesson is mechanical: on LYFT, read the adjusted lines and find the charge before reading the headline.',
      threeMinutes:[
        '<b>The revenue miss was not a miss.</b> $1.59B against a $1.76B consensus is entirely a $168M contra-revenue charge, part of a $210M legal and tax reserve — a split management gave only in Q&A. Add it back and revenue matched consensus exactly. That is also the whole reason Q4 shows bookings +19% against revenue +3%.',
        '<b>What actually cost 17% was the guide.</b> Q1 adjusted EBITDA guided $120–140M against a Street near $139.8M, on a flat-to-lower margin — in the quarter the ramp toward a ~$1B 2027 target was supposed to begin. The destination was reaffirmed; the first step went the wrong way.',
        '<b>The AV evidence got real.</b> In San Francisco, the most AV-dense market anywhere, the market added millions of rides in Q4 and Lyft rides there still grew ~10%. Management paired it with the honest caveat that AVs are not material to 2026 financially. Expansion, not substitution — so far.',
        '<b>Management was already calling the stock cheap.</b> A new $1.0B buyback authorization, described as roughly 15% of the market cap. Three months later they spent $300M of it in a single quarter on an explicit "dislocation" call.',
      ],
      notBringing:[
        { item:'Lyft Teen, launched the day before the call', why:'A genuinely new cohort — "a 15 billion ride TAM of 13 to 17-year-olds, just in the U.S." — but it is a 2027+ revenue line, not a Q4 item.' },
        { item:'The named AV suppliers to watch (Rivian, NVIDIA, Mobileye, Zoox)', why:'Risher\'s own caveat disqualifies it as a thesis input: "who the winners are, that\'s the thing that nobody really knows."' },
        { item:'Super Bowl metrics (15% more rides at ~20% lower surge)', why:'A good proof of marketplace efficiency, and one weekend. Logged, not defended.' },
      ],
      newQuestions:[
        { n:'Does the Q1 guide mean the 2027 margin ramp is slipping?', landed:{ q:'Q1 2026', rank:4 } },
        { n:'California insurance benefit — back-half weighted, or earlier?', landed:{ q:'Q1 2026', rank:5 }, tripped:true },
        { n:'Flexdrive\'s 20%+ cost claim: how measured, and does it travel?', landed:{ q:'Q1 2026', rank:6 } },
        { n:'Is the organic bookings number knowable at all?', landed:{ q:'Q1 2026', rank:3 } },
      ],
    } }
]};

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
// every company (EARNINGS_CONVENTIONS §6). LYFT → https://investor.lyft.com/

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
    '<span class="ce-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Lyft logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Lyft Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.lyft.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">Lyft on EDGAR</span>'+
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

// A line that IS ALREADY A RATE (the adjusted-EBITDA margin) gets no growth chip —
// the growth of a percentage is meaningless and reads as if it were a level.
// Growth of an ARBITRARY value against the quarter's own bases. Each expectation row (Guide,
// Street, Summit) computes its chip off ITS OWN number — blending a Street level with a guide's
// growth rate would be exactly the kind of mixed basis Rule H forbids.
function ceGrowthOf(m,qi,base,v){
  if(m.u==='%') return null;
  if(m.t==='basis') return null;                       // never a growth number off a basis mismatch
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(v==null||b==null||!b) return null;
  return Math.round((v/b-1)*100);
}
function ceGrowth(m,qi,base){
  return ceGrowthOf(m,qi,base, m.qr[qi]?m.qr[qi][3]:null);
}

function ceChip(g){
  if(g==null) return '';
  var up=g>=0;
  return '<span class="ce-gchip" style="color:'+(up?'#0a8f4c':'#C5221F')+'">'+(up?'+':'−')+Math.abs(g)+'%</span>';
}
// Margin lens: a metric that is a SHARE of another line carries an extra row = metric ÷ denominator,
// computed per column (Street ÷ Street, Summit ÷ Summit, print ÷ print). Toggled in the estimates
// bar; lives in the SAME cell, never a new box. (§6a-ii.)
//
// ⚠ THE MAP IS METRIC → DENOMINATOR, NOT A BOOLEAN, AND THE NAMES ARE PER-COMPANY. Ported from
// googl.js it read {'Gross profit':1,'Operating income':1,'EBITDA':1} against a hardcoded revenue
// denominator — and NONE of those keys exist on LYFT (the metric here is "Adjusted EBITDA"). Every
// cell therefore evaluated to no-margin, so the Margin button toggled an attribute with nothing to
// reveal and looked broken. It was.
//
// The denominator is also wrong for this company by default: Lyft is judged on % of GROSS BOOKINGS,
// which is what management guides and what the 2027 target is set in. Revenue-based margins are not
// a number Lyft ever quotes.
var CE_MARGIN_ON={ 'Adjusted EBITDA':'Gross Bookings', 'Free cash flow':'Gross Bookings' };

// The denominator's own CE_CONS row, by name.
function ceMarginBase(name){
  if(!name) return null;
  return CE_CONS.m.filter(function(x){ return x.k===name; })[0]||null;
}

// Lyft's margins live around 2–3%, where one decimal hides everything interesting (a 14bp move
// disappears). Use two decimals below 10% and one above it, so the same helper serves a 3% adjusted
// EBITDA margin and a 30% gross margin without lying about either.
function ceMarginPct(v, base){
  if(v==null||base==null||!base) return null;
  var p=v/base*100;
  return Math.abs(p)<10 ? Math.round(p*100)/100 : Math.round(p*10)/10;
}

function ceMChip(p){ return p==null?'':'<span class="ce-mm">'+p+'% mgn</span>'; }
// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.

// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.
// `lab` names the denominator ("% of bookings"), because "margin" alone would let the reader assume
// revenue — which for this company would be the wrong number entirely.
function ceMarginRow(cur, baseYoy, baseQoq, lab){
  if(cur==null) return '';
  return '<div class="ce-mrow"><span class="ce-mrow-l">'+esc(lab||'margin')+'</span>'+
    '<span class="ce-mrow-v">'+cur+'%'+
      (baseYoy!=null?'<span class="ce-mm-b yoy"> (prev '+baseYoy+'%)</span>':'')+
      (baseQoq!=null?'<span class="ce-mm-b qoq"> (prev '+baseQoq+'%)</span>':'')+
    '</span></div>';
}
// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on

// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    // The denominator this metric is a share OF, resolved by name from CE_CONS itself.
    var dName=CE_MARGIN_ON[m.k], dM=ceMarginBase(dName);
    var dC=(dM&&dM.qr[qi])?dM.qr[qi][3]:null;                     // the outside expectation's own base
    var dU=(dM&&us[dName]&&us[dName].v!=null)?us[dName].v:dC;     // Summit's base, else the outside one
    // THREE named expectation rows, never blended (Rule H). Lyft guides only two lines and the
    // Street covers a different four, so a single row would have to silently switch basis between
    // metrics. A row is dropped only when that expectation does not exist for this metric in ANY
    // quarter — so a metric's cell keeps the same shape as you page across quarters (Rule L).
    var any=function(arr){ return arr && arr.some(function(v){ return v!=null; }); };
    var row=function(lab, v, cls){
      var body=(v==null)
        ? '<span class="ce-empty">—</span>'
        : ceFmtV(m.u,v)+'<span class="ce-gy">'+ceChip(ceGrowthOf(m,qi,'yoy',v))+'</span>'+
          '<span class="ce-gq">'+ceChip(ceGrowthOf(m,qi,'qoq',v))+'</span>';
      return '<div class="ce-val '+cls+'"><span class="ce-val-lab">'+lab+'</span>'+body+'</div>';
    };
    var rows='';
    if(any(m.qg)) rows+=row('Guide', m.qg[qi], 'ce-val-guide');
    if(any(m.qs)) rows+=row('Street', m.qs[qi], 'ce-val-cons');
    // Nothing outside at all — say so once, plainly, instead of two empty rows.
    if(!any(m.qg)&&!any(m.qs))
      rows+='<div class="ce-val ce-val-cons"><span class="ce-val-lab">Outside</span>'+
        '<span class="ce-empty">—</span><span class="ce-nocons" title="Lyft does not guide this line and no published Street estimate exists for it — the Summit model is the only forward number we have">no est.</span></div>';
    rows+=row('Summit', uv?uv.v:null, 'ce-val-us');
    // Margin row: the OUTSIDE expectation's implied share, against the same share in the base
    // periods. Each side divides by its own denominator so the ratio is never mixed-basis.
    var mRow=dM?ceMarginRow(ceMarginPct(c,dC),
                            ceMarginPct(m.qy[qi], dM.qy[qi]),
                            ceMarginPct(m.qq[qi], dM.qq[qi]),
                            '% of '+(dName==='Gross Bookings'?'bookings':dName.toLowerCase())):'';
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mcell-v">'+rows+mRow+'</div></div>';
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
    '.ce-mcell .ce-val{margin-top:1px}'+
    /* wide enough for the longest label now that Guide and Street are separate rows */
    '.ce-mcell .ce-val-lab{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none;width:46px}'+
    /* the company\'s own guide reads in the brand colour; the Street stays neutral navy */
    '.ce-mcell .ce-val-guide{color:'+BRAND+'}'+
    /* The generic estimates toggle hides the row LABELS unless the view is "Both" — that was safe
       when a cell held one outside number. Here a cell can hold Guide AND Street AND Summit, so an
       unlabelled stack reads as two mystery figures. Force the labels on inside the setup grid
       (higher specificity than the generic rule, and this stylesheet is emitted after it). */
    '.ce-evwrap .ce-mcell .ce-mcell-v .ce-val-lab{display:inline-block}'+
    /* Guide belongs to the OUTSIDE view: it must vanish with the Street when Summit-only is picked,
       otherwise "Summit" mode still shows a company number and the toggle lies. */
    '.ce-evwrap[data-ev="us"] .ce-mcell .ce-val-guide{display:none}'+
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
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what <b>Lyft itself guided</b>, what the <b>Street</b> expects, what <b>Summit</b> expects, and where they disagree. Each is its own labelled row, never blended: Lyft guides only Gross Bookings and Adjusted EBITDA, and the Street covers a different set. '+(u.date?((frozen?'Reported <b>':'Reports <b>')+esc(u.date)+'</b>.'):'')+'</p>';
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
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — LYFT</div>'+ceGrid(u,'cust');
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Each row carries its OWN growth chip, computed off its own number against the same reported bases (<b>YoY</b> = the quarter a year earlier, <b>QoQ</b> = the prior quarter). '+
         '<b>Guide</b> = Lyft\'s own guidance, midpoint of the guided range. <b>Street</b> = consensus compiled by hand per print — ⚠ Lyft has no rows in <code>BBG_CONSENSUS.txt</code>, so there is no Bloomberg export for this name and any line without a defensible published figure is left blank rather than invented. <b>Summit</b> = our own model. <b>?</b> = a number with a caveat worth knowing. '+
         'A line reading <b>no est.</b> is neither guided nor covered — an absence of outside expectation, not a gap in our work.</div>';
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
// gave numeric FY guidance we would add a third; LYFT does not (it guides two quarterly lines only), so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (LYFT_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.

// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; LYFT does not (it guides two quarterly lines only), so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (LYFT_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit pending): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('LYFT_SETUP')+'</div>';
}

function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }

// ⚠ THIS LINE WAS MISSING AND IT THREW. `gBuildCeAnnual` was CALLED (on every return to the Setup
// phase tab) but never defined — an uncaught ReferenceError in the console, and, worse, the Setup
// chart never built at all: resultsHtml('LYFT_SETUP') emitted the markup and nothing ever
// initialised the engine against it. googl.js and amzn.js both carry this one-liner; the splice
// dropped it. Chart.js needs a visible container, so it is (re)built on visibility, not once.
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'LYFT_SETUP'); }

function wireCeAnnual(root){ /* the engine self-wires via initResults->wireResults; the chart builds on Setup visibility (gBuildCeAnnual). */ }

function ceWatchBody(c){
  // The Watch List is now the SHARED engine (js/watchlist.js): one implementation for every
  // company, persistent against Supabase (table company_themes) and sortable. We render a mount
  // host here; wireCallEarnings mounts the engine into it (it needs the company id + quarter list).
  // LYFT's own multi-year "theme record" (LY_THEMES) stays below, folded in as before.
  var h=ceStyle();
  h+='<div data-wlmount></div>';
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

// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
// Scorecard result kinds. beat/miss/inline score against a consensus line; `nodisc` (a KPI
// management STOPPED disclosing) and `nocons` (a number nobody modelled) are not beats or misses —
// they are their own signal, and conflating them with a miss loses the point.
var CE_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };

var CE_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
// ─── The frozen expectation, computed rather than recalled ─────────────────────────────
// "Frozen expectations" used to mean whatever prose someone typed into `scorecard[].cons` before
// the print ("high-teens growth modeled"). That is a memory, not a record.
// ─── cePrintBlock · THE print, in one place ────────────────────────────────────────
// Formerly two blocks that said the same thing twice: a "frozen strip" and a hand-authored
// "scorecard — ranked by surprise". Merged. The CE_CONS table is the spine — every number and
// every surprise is computed from it, so it cannot drift out of sync with the data.
// ⚠ For LYFT that table is NOT a Bloomberg archive: this name has no rows in BBG_CONSENSUS.txt, so
// each line is scored against a hand-compiled Street consensus where one was published and against
// Lyft's own guide otherwise — and `m.qb[qi]` records which, so the tile can say so on screen.
// The hand-authored layer contributes only what a number cannot: a per-metric note
// (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`).

function ceVerdict(m, c, a, surp){
  if(a==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(c==null) return {l:'no est.', c:'#7A5AF8', k:'noest'};       // nocons / noact: a print, nothing to score
  if(surp==null) return {l:'—', c:'#9AA4B0', k:'none'};
  // A line that IS ALREADY A RATE is scored in POINTS, not in percent-of-a-percent. 3.0% against a
  // 2.86% guide is +14bp; expressed the other way it reads "+4.9%", which looks like a large beat
  // and is not one. Same reasoning as ceGrowth's u==='%' guard (Rule H).
  var tol = (m.u==='%') ? 0.1 : 2;
  if(Math.abs(surp)<tol) return {l:CE_RES.inline.l, c:CE_RES.inline.c, k:'inline'};
  return surp>0 ? {l:CE_RES.beat.l, c:CE_RES.beat.c, k:'beat'} : {l:CE_RES.miss.l, c:CE_RES.miss.c, k:'miss'};
}

function cePrintBlock(qLabel, r, us){
  var qi=CE_CONS.q.indexOf(qLabel); if(qi<0) return '';
  r=r||{}; us=us||{};
  var notes=r.notes||{}, watch=r.watch||{};
  var tiles=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;   // Summit's FROZEN expectation for this line
    if(c==null&&a==null&&uexp==null) return null;
    // Surprise = actual / expected − 1, computed for BOTH bases. The estimate-view toggle (vs Street
    // ⇄ vs Summit) swaps which one drives the expected value, the surprise and the verdict.
    // A RATE line (the adjusted-EBITDA margin) is scored as a DIFFERENCE IN POINTS; everything else
    // as a percentage surprise. Dividing one percentage by another and calling the result a surprise
    // turns 14 basis points into "+4.9%" — a measurement that misstates its own size (Rule H).
    var isRate=(m.u==='%');
    var cSurp=(c!=null&&a!=null&&(isRate||c))?(isRate?(a-c):((a/c-1)*100)):null;
    var uSurp=(uexp!=null&&a!=null&&(isRate||uexp))?(isRate?(a-uexp):((a/uexp-1)*100)):null;
    var cV=ceVerdict(m,c,a,cSurp), uV=ceVerdict(m,uexp,a,uSurp);
    // growth against the print, both bases — the shared YoY/QoQ lens (independent of the estimate view)
    var g=function(base){
      var bv=(base==='qoq')?m.qq[qi]:m.qy[qi];
      if(a==null||bv==null||!bv) return '<span class="ce-fz-g-e">—</span>';
      var gv=Math.round((a/bv-1)*100);
      return '<span style="color:'+(gv>=0?'#0a8f4c':'#C5221F')+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
    };
    var surpTag=function(s){ if(s==null) return '';
      var mag=isRate ? (Math.round(Math.abs(s)*100)/100)+' pts' : (Math.round(Math.abs(s)*10)/10)+'%';
      return '<span class="ce-fz-d '+(s>=0?'up':'dn')+'">'+(s>=0?'+':'−')+mag+'</span>'; };
    // MARGIN — toggled, and it is EXPECTED-vs-REALIZED, not YoY/QoQ. Expected = the share IMPLIED by
    // the estimate (the estimate's metric ÷ THAT SAME estimate's denominator, so the ratio is never
    // mixed-basis). Realized = the print's own. The gap is shown in points.
    // ⚠ The denominator is per-metric (CE_MARGIN_ON) — for Lyft, Gross Bookings, not revenue.
    var dName=CE_MARGIN_ON[m.k], dM=ceMarginBase(dName);
    var dC=(dM&&dM.qr[qi])?dM.qr[qi][3]:null, dA=dM?dM.qa[qi]:null;
    var dU=(dM&&us[dName]&&us[dName].v!=null)?us[dName].v:dC;
    var mReal=dM?ceMarginPct(a,dA):null;
    var mExpC=dM?ceMarginPct(c,dC):null, mExpU=dM?ceMarginPct(uexp,dU):null;
    var dPts=function(exp){ if(mReal==null||exp==null) return ''; var d=Math.round((mReal-exp)*100)/100;
      return '<span class="ce-fz-mdl '+(d>=0?'up':'dn')+'">'+(d>=0?'+':'−')+Math.abs(d)+' pts</span>'; };
    var mRow='';
    if(dM&&mReal!=null){
      mRow='<div class="ce-fz-mrow"><span class="ce-fz-gl">% of '+esc(dName==='Gross Bookings'?'bookings':dName.toLowerCase())+'</span>'+
        '<span class="ce-fz-mexp ce-exp-cons">exp '+(mExpC!=null?mExpC+'%':'—')+dPts(mExpC)+'</span>'+
        '<span class="ce-fz-mexp ce-exp-us">exp '+(mExpU!=null?mExpU+'%':'—')+dPts(mExpU)+'</span>'+
        '<span class="ce-fz-ar">→</span><span class="ce-fz-mreal">'+mReal+'% realized</span>'+
        ceQ('mgn-'+ceQkey(qLabel)+'-'+ceQkey(m.k),'% of Gross Bookings — expected vs realized',
          '<p><b>The denominator is Gross Bookings, not revenue.</b> That is the ratio Lyft guides, reports and sets its 2027 target in (~$1B of adjusted EBITDA on ~$25B of bookings). A revenue-based margin would be a number the company never quotes.</p>'+
          '<p><b>Expected</b> is the share <i>implied by the estimate</i>: that estimate\'s metric ÷ <i>that same estimate\'s</i> bookings, so the ratio is never half-Street and half-print. <b>Realized</b> is the print\'s own. This is expectation vs outcome for the quarter — <b>there is no YoY/QoQ here</b>.</p>'+
          '<p>⚠ Read the Δ in <b>points, and small ones matter</b>: this line runs at 2–3%, so a 0.2pt gap is a ~7% move in the ratio. It is shown to two decimals for that reason.</p>')+
        '</div>';
    }
    var basis=(m.qb&&m.qb[qi])||null;
    var note=notes[m.k];
    var qb=note?ceReg('resnote-'+ceQkey(qLabel)+'-'+ceQkey(m.k), note.t||m.k, note.h||note):null;
    // watch[m.k] is the frozen Watch-List RANK. Theme NAMES now live in Supabase (loaded async by the
    // shared Watch List engine), so the scorecard no longer resolves the name synchronously here — it
    // keeps the "on the list" marker via the rank; the theme text lives on the Watch List itself.
    var wrRank=watch[m.k], wrTheme=null;
    var wr=wrTheme||(wrRank?('Watch #'+wrRank):null);
    // data-vdc / data-vdu carry BOTH verdicts so the verdict filter is estimate-view-aware in pure CSS.
    return { sort:(cSurp==null?-1:Math.abs(cSurp)), html:
      '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'"'+(qb?' data-detail="ce:'+qb+'"':'')+'>'+
        '<div class="ce-fz-k">'+esc(m.k)+
          '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+'</span>'+
          '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+'</span></div>'+
        '<div class="ce-fz-r"><span class="ce-fz-c ce-exp-cons">'+(c==null?'—':ceTkFmt(m.u,c))+
            // WHICH outside expectation this line is scored against. Lyft has no BBG archive, so
            // some rows are the Street and some are the company's own guide — the tile says which
            // rather than letting the "vs Street" toggle imply one basis for all of them (Rule L).
            (basis?'<span class="ce-fz-bas">'+esc(basis)+'</span>':'')+'</span>'+
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
      '<p>One block, computed — every number and every surprise comes from the <code>CE_CONS</code> table in this file, so nothing here is typed twice and it cannot drift out of sync with the data.</p>'+
      '<p>⚠ <b>Lyft is NOT in our Bloomberg archive.</b> <code>BBG_CONSENSUS.txt</code> carries GOOG/GOOGL/HOOD/KKR/MA/META/UBER only, so there is no rolling Street matrix to reconstruct for this name. The expectation each line is scored against is therefore one of TWO things, and the tag on the tile says which:</p>'+
      '<ul><li><b>Street</b> — consensus compiled BY HAND per print from earnings-day coverage. It exists for revenue and, in one quarter, adjusted EBITDA. Sources are listed against each figure in the file header.</li>'+
      '<li><b>Guide</b> — Lyft\'s own guidance, midpoint of the guided range. Lyft guides exactly two lines, Gross Bookings and Adjusted EBITDA, plus the margin they imply.</li>'+
      '<li><b>no est.</b> — neither exists. Rides, active riders, free cash flow and insurance reserves are unguided AND uncovered, so they are shown as the reported record with no verdict. That is an absence of outside expectation, never a comment on the print.</li></ul>'+
      '<ul><li><b>vs outside ⇄ vs Summit</b> — swaps which frozen expectation the print is scored against. One basis at a time; where Summit had no number, the Summit view reads <b>no est.</b></li>'+
      '<li><b>Margin</b> — the expected-implied margin → the print\'s own, Δ in pts. No YoY/QoQ on a margin.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise. A line that is ALREADY a rate is scored in <b>points</b>, not in percent-of-a-percent, so a 14bp beat reads as +0.14 pts rather than "+4.9%".</li>'+
      '<li><b>on the list</b> — this line was on the Watch List we froze before the call</li></ul>')+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    // "vs outside" rather than "vs Street": for LYFT this basis is the Street on the lines the
    // Street covers and Lyft's own guide on the two it guides. Each tile carries its own tag.
    '<span class="ce-gseg" style="margin-left:auto"><button type="button" class="active" data-fzev="cons">vs outside</button>'+
      '<button type="button" data-fzev="us">vs Summit</button></span>'+
    '<span class="ce-gseg"><button type="button" data-fzmm="on">Margin</button>'+
      '<button type="button" class="active" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div><div class="ce-fz-g" data-vdf-host>'+tiles.map(function(t){ return t.html; }).join('')+'</div>'+
    '<div class="ce-fz-f">The frozen expectation → the print → the print\'s own growth. Toggle <b>vs outside ⇄ vs Summit</b> and <b>Margin</b> above; ranked by size of surprise. <b>Sources:</b> actuals and guidance from Lyft\'s 8-K Ex. 99.1 press releases (SEC EDGAR, CIK 0001759509); Street consensus compiled by hand per print — Lyft is not in <code>BBG_CONSENSUS.txt</code>; Summit from the model\'s frozen per-quarter projections.</div></div>';
}
// A collapsible block — secondary depth is folded away by default so the phase reads as a page,
// not a wall. Wired by the generic `.ov-collap-h` handler already in init().

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
    /* the market's verdict on the print — one line, directly under the scorecard */
    '.ce-pxr{display:flex;align-items:baseline;gap:9px;border:1px solid var(--bdr);border-left:3px solid '+BRAND2+';'+
      'border-radius:10px;padding:9px 13px;margin:0 0 14px;background:#fff}'+
    '.ce-pxr-l{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none}'+
    '.ce-pxr-v{font-size:11.5px;line-height:1.55;color:var(--navy)}'+
    '@media(max-width:640px){.ce-pxr{flex-direction:column;gap:4px}}'+
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
    /* which outside expectation this row is scored against — Street or Lyft\'s own guide */
    '.ce-fz-bas{font-size:7.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;'+
      'color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:0 4px;margin-left:4px;vertical-align:1px}'+
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
       'Toggle <b>vs outside ⇄ vs Summit</b> to score the print against either expectation, and <b>Margin</b> for the expected-implied → realized margin. Each line is tagged <b>Street</b> or <b>Guide</b> because Lyft is not in our Bloomberg archive, so the outside view is compiled per print. Below the scorecard, a supplemental <i>“Also on the call”</i> aside carries the colour — not the meeting-critical items.</p>';
    // 1 · THE print — archive spine + hand-authored notes, ranked by surprise (one block now).
    // Pass the quarter's FROZEN Summit expectations (setup.us) so the print can be scored against
    // Street OR Summit via the vs-Street ⇄ vs-Summit toggle (§6a-iii).
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    // 1b · HOW THE MARKET SCORED IT. `results.priceReaction` was being authored and never rendered —
    // dead data. It is the one line that says whether the print was read the way we read it, and for
    // LYFT it carries a standing warning: the after-hours tape has been wrong on this name in 4 of
    // the last 6 prints, so the record we keep is always the NEXT-DAY CLOSE (all releases are AMC).
    if(r.priceReaction){
      b+='<div class="ce-pxr"><span class="ce-pxr-l">Market reaction</span>'+
         '<span class="ce-pxr-v">'+r.priceReaction+'</span></div>';
    }
    // 2 · the AI-generated call summary — replaces the old one-line "take" black box (v2.10).
    b+=ceSummaryBlock(q.q, r.summary);
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
    b+='<div class="ov-foot">Numbers scored against the frozen expectation — the <b>outside</b> view (Street where one was published, otherwise Lyft\'s own guide, tagged per line) or <b>Summit</b> via the toggle; actuals = reported. The <i>Also on the call</i> aside is supplemental colour — the tracking layer is the Watch List.</div>';
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
  b+='</div></div>';
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
// EVOLUTION ▸ EARNINGS CALLS — LY_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/LYFT.md + LYFT-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — LY_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/LYFT.md + LYFT-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var CE_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
// A promise open for one quarter and one open for four look identical without this. Age is the
// signal: how long has it been unreconciled, or how many quarters has the silence run?

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
}
// ═══ Deep-dive charts (Chart.js, lazy per pane) ═════════════════════════════════════════════════

// Results / Estimates panes come from the shared engine (js/results.js), driven by a per-ticker
// dataset in RESULTS_DATA. LYFT's dataset IS registered (js/results-data/lyft.js), so this fallback
// should never render — it stays only as the message for a ticker whose dataset is not built yet.
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once this ticker\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
}
// ═══ Sub-tab + Deep Dive tab machinery (standardized contract) ══════════════════════════════════

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
  // ⚠ wireCeTrack owns FOUR controls that nothing else wires: the growth lens (data-ceg), the
  // Setup margin toggle (data-cemm), and the print block's vs-outside/vs-Summit and margin
  // toggles (data-fzev / data-fzmm). It was never called — the splice from googl.js brought the
  // function across but not its call site — so all four rendered as live pills that did nothing.
  // Called FIRST on purpose: it and this function both touch .ce-qpill and .ce-ev-pill, and these
  // are `onclick=` assignments, so whichever runs LAST wins. The phase-aware handlers below are
  // the ones that must win.
  wireCeTrack(root);
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
  // persistence + sorting; nothing company-specific leaks in beyond the id, ticker and quarters.
  // Re-mounting on tab re-init is idempotent (it rebuilds the host). ──
  var wmount=pane.querySelector('[data-wlmount]');
  if(wmount && _co && _co.id){
    mountWatchList(wmount, { companyId:_co.id, ticker:_co.ticker, quarters:CALL_EARNINGS.quarters,
      colors:{ brand:BRAND, brand2:BRAND2, purple:PURPLE, gray:GRAY, red:RED } });
  }
}


function deepDiveHtml(c){
  var h = '<div class="ov ov-lyft ov-lyft-dd" data-brand="LYFT">'+
    '<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>'+
    // ── TOP LINE — Segments (with an inner Rideshare / Media & Growth toggle) · Customers ·
    // TAM · Industry Analysis. The old "Deep Overview" is dismantled into these (Golden Rule #1). ──
    '<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="customers">Customers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tam">TAM</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="industry">Industry Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments">'+lySegmentsBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="customers" hidden>'+lyCustomersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="tam" hidden>'+lyTamBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="industry" hidden>'+lyIndustryBody(c)+'</div>'+
    '</div>'+
    // ── BOTTOM LINE — Unit Economics · Suppliers · Insurance · Margins (live via Massive). ──
    '<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="unit">Unit Economics</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="suppliers">Suppliers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="insurance">Insurance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="unit">'+unitBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="suppliers" hidden>'+lySuppliersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="insurance" hidden>'+insuranceBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="margins" hidden>'+lyMarginsBody(c)+'</div>'+
    '</div>'+
    // ── EVOLUTION — Earnings History · Guidance (Model vs. Reality) · Strategy (turnaround +
    // Playbook) · Timeline (company history & M&A). ──
    '<div class="dd-pane" data-dd="evolution" hidden>'+
      // Go-forward Evolution row (EARNINGS_CONVENTIONS v2.9): Earnings · Results ·
      // Estimates · Guidance · Strategy · Timeline. "Earnings History" keeps carrying the
      // LY_THEMES compendium until the full Earnings v2.10 tab is built for LYFT — at
      // which point the compendium folds in under its Watch List (§6/v2.3) and this
      // sub-tab is retired.
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        ceIRButton()+
        '<div class="ce-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (Setup · Watch List, with the theme record folded in below it) → <b>② Post-Results</b> (the print scored against what was frozen, plus what management said). <b>Lyft reports Q2 2026 on Thursday 6 August, after close</b> — so the live quarter here is a print that has not happened yet, and Post-Results stays empty until it does.</div>'+
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
      '<div class="ovt-subpane" data-ovst="track" hidden>'+resultsHtml('LYFT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('LYFT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+modelBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+lyKnockout()+strategyBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+historyStoryBody()+'</div>'+
    '</div>'+
    // ── VALUATION — Multiples & Targets · Sensitivity · Competitors · Analyst Ratings (Massive,
    // absorbed) · Capital Allocation · Balance Sheet. ──
    '<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="multiples">Multiples</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ratings">Analyst Ratings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="capital">Capital Allocation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="balance">Balance Sheet</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="financials">Financials</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="multiples">'+LYFT_VAL.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+lyPeerMultBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="ratings" hidden><div id="dd-val-slot"></div></div>'+
      '<div class="ovt-subpane" data-ovst="capital" hidden>'+lyCapAllocBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="balance" hidden>'+lyBalanceBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="financials" hidden>'+lyFinBody()+'</div>'+
    '</div>'+
    // ── MANAGEMENT — Executives & Board · Ownership (Fiscal.ai, absorbed) · Governance & SBC ·
    // Track Record. ──
    '<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance & SBC</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+LYFT_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden><div id="dd-mgmt-slot"></div></div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+lyGovBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+lyTrackBody(c)+'</div>'+
    '</div>'+
  '</div>';
  return h;
}
// Evolution ▸ Company History & M&A — the single home for the company story and the
// deal-by-deal financial impact (moved out of the Deep Overview and Strategy to avoid
// repeating the same history/M&A in several places).
function historyStoryBody(){
  var tl='<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
  return sec('History & Milestones', tl)+sec('M&A — what each deal changed in the financials', mnaTimeline());
}

// ═══ Charts ═══════════════════════════════════════════════════════════════════
var _charts = {}; // id -> Chart instance
function destroy(id){ if (_charts[id]) { _charts[id].destroy(); _charts[id] = null; } }

// ═══ VALUATION ▸ FINANCIALS — the eight-year arc, DERIVED from the annual dataset ═══════════════
// Same construct as amzn.js: nothing here is hand-typed. Every bar and every table cell is read
// out of `lyftResults.views.y`, so the tab cannot drift from the Results/Estimates tabs that share
// the dataset. Reported years render solid; model years render faded and are suffixed "E".
var LY_FIN_YEARS = ['2022','2023','2024','2025','2026','2027','2028','2029'];

function lyFinSeries(key, src){
  var m = lyftResults.views.y.metrics[key];
  if (!m) return LY_FIN_YEARS.map(function(){ return null; });
  return LY_FIN_YEARS.map(function(yr){
    var i = m.periods.indexOf(yr);
    return (i >= 0 && m[src] && m[src][i] != null) ? m[src][i] : null;
  });
}
// Actual where it exists, else the model — one continuous line with the handover marked.
function lyFinMerged(key){
  var a = lyFinSeries(key,'act'), s = lyFinSeries(key,'summit');
  return LY_FIN_YEARS.map(function(_, i){ return a[i] != null ? a[i] : s[i]; });
}
function lyFinIsEst(key){
  var a = lyFinSeries(key,'act');
  return LY_FIN_YEARS.map(function(_, i){ return a[i] == null; });
}
function lyFinFmt(v){
  if (v == null) return '—';
  var b = v/1000;
  return (v < 0 ? '−$' : '$') + Math.abs(b).toFixed(Math.abs(b) < 10 ? 2 : 1) + 'B';
}

function lyFinBody(){
  var m = lyftResults.views.y.metrics;
  var h = '<p class="ov-lede"><b>Eight years in one picture.</b> Gross bookings compound from <b>$12.1B to $18.5B</b> while adjusted EBITDA crosses from <b>−$416M to +$529M</b> and free cash flow from <b>−$352M to +$1.12B</b> — the whole turnaround, in three lines. Bars are <b>reported</b> through 2025 and the <b>Summit model</b> from 2026 (faded, suffixed E). Everything on this tab is read out of the same annual dataset the Results and Estimates tabs use, so the three cannot disagree.</p>';

  h += '<div class="ov-sec"><div class="ov-sec-h">Gross bookings · Revenue · Adjusted EBITDA · Free cash flow ($B, fiscal year)</div>'+
       '<div style="height:320px;position:relative"><canvas id="lyFin"></canvas></div>'+
       '<div class="ov-foot">Reported years solid, model years faded. Adjusted EBITDA and free cash flow are small next to bookings by construction — this is a marketplace that keeps ~3% of what flows through it.</div></div>';

  // The table: the five lines that matter, plus the margin they imply.
  var rows = [
    { k:'gb',     lab:'Gross Bookings',   read:'The 2027 plan is written here — goal ~$25B, model $24.8B.' },
    { k:'rev',    lab:'Revenue',          read:'Outgrew bookings through 2024 on take rate; FY2025 slowed by the $168M charge.' },
    { k:'ebitda', lab:'Adjusted EBITDA',  read:'⚠ Goal ~$1B for 2027, model $829.8M — about 17% short.' },
    { k:'fcf',    lab:'Free Cash Flow',   read:'Goal raised to >$1B; model FY2027 $1,080M, then it falls.' },
    { k:'capex',  lab:'Capex',            read:'Asset-light: never above ~1.1% of bookings, down three years running.' }
  ];
  h += '<div style="overflow-x:auto;margin-top:14px"><table class="ce-tbl"><thead><tr><th>$B</th>'+
       LY_FIN_YEARS.map(function(y,i){ return '<th>'+(i>=4?y.slice(2)+'E':y.slice(2))+'</th>'; }).join('')+
       '<th style="min-width:200px">read</th></tr></thead><tbody>';
  rows.forEach(function(r){
    var vals = lyFinMerged(r.k), est = lyFinIsEst(r.k);
    h += '<tr><td><b>'+esc(r.lab)+'</b></td>'+
      vals.map(function(v,i){
        return '<td'+(est[i]?' style="color:var(--mu)"':'')+'>'+lyFinFmt(v)+'</td>';
      }).join('')+
      '<td style="color:var(--mu);font-size:10.5px">'+r.read+'</td></tr>';
  });
  // Margin row — the ratio management is judged on, computed from the same two series.
  var gbv = lyFinMerged('gb'), ebv = lyFinMerged('ebitda');
  h += '<tr><td><b>Adj. EBITDA % of bookings</b></td>'+
    gbv.map(function(g,i){
      var p = (g && ebv[i]!=null) ? (ebv[i]/g*100) : null;
      return '<td style="color:'+PURPLE+';font-weight:700">'+(p==null?'—':p.toFixed(1)+'%')+'</td>';
    }).join('')+
    '<td style="color:var(--mu);font-size:10.5px">0% → 2.9% reported; the model flattens near 3.6% against the ~4% the 2027 goal implies.</td></tr>';
  h += '</tbody></table></div>';

  h += '<div class="ave-subh-note" style="margin-top:8px">Source: Summit DCF model, snapshot <b>2026-05-13</b> — FY actuals from its actuals history (each reconciled against Lyft\'s reported quarters: FY2025 revenue $6,316.3M, gross bookings $18,507.1M, adjusted EBITDA $528.9M all tie exactly), forward years from its stored projections. <b>No Street column exists</b> at the annual level — LYFT is not in <code>BBG_CONSENSUS.txt</code> — and Lyft issues no annual guidance, so neither is shown rather than left looking unfilled. ⚠ Some Summit cells are deliberately blank in the early years: the model\'s 2022–2023 projections are unusable (adjusted EBITDA reads −$2,325M against a −$416M actual, free cash flow is sign-wrong for 2023, capex is positive where every actual is negative). Capex forward starts at 2026 because the model\'s forward capex uses a different basis (SEGM) from these actuals (DEFAULT) — a ~2x gap flagged for the model owner. Full per-line notes in <code>js/results-data/lyft.js</code>.</div>';
  return h;
}

function buildLyFin(){
  var cv = document.getElementById('lyFin');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  destroy('lyFin');
  var keys = [ ['Gross Bookings','gb','#1E2733'], ['Revenue','rev',BRAND],
               ['Adjusted EBITDA','ebitda',BRAND2], ['Free cash flow','fcf','#0a8f4c'] ];
  _charts['lyFin'] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels: LY_FIN_YEARS.map(function(y,i){ return i>=4 ? y+'E' : y; }),
      datasets: keys.map(function(k){
        var est = lyFinIsEst(k[1]);
        return { label:k[0],
          data: lyFinMerged(k[1]).map(function(v){ return v==null?null:v/1000; }),
          backgroundColor: est.map(function(e){ return e ? k[2]+'55' : k[2]; }),
          borderColor: k[2],
          borderWidth: est.map(function(e){ return e ? 1 : 0; }) };
      }) },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10 } } },
        tooltip:{ callbacks:{ label:function(ctx){
          var v = ctx.parsed.y;
          return ctx.dataset.label+': '+(v==null?'—':(v<0?'−$':'$')+Math.abs(v).toFixed(2)+'B')+
                 (ctx.dataIndex>=4 ? '  (model estimate)' : ''); } } } },
      scales:{ x:{ grid:{ display:false } },
        y:{ grid:{ color:'rgba(0,0,0,0.05)' },
            ticks:{ callback:function(v){ return (v<0?'−$':'$')+Math.abs(v)+'B'; } } } } }
  });
}

// ── Simple annual bar (Overview): actual → estimate, signed colors ──
function valueLabels(fmt){
  return { id:'vl', afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, meta = chart.getDatasetMeta(0);
    meta.data.forEach(function(bar, i){
      var v = chart.data.datasets[0].data[i];
      ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle='#1E2733';
      ctx.fillText(fmt(v), bar.x, (v<0 ? bar.y + 14 : bar.y - 7));
      ctx.restore();
    });
  } };
}
function buildAnnualBar(id, data, fmt){
  var cv = document.getElementById(id);
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  destroy(id);
  var colors = data.map(function(v, i){
    var estYr = i >= FIRST_EST;
    if (v < 0) return estYr ? NEG_FILL : NEG;
    return estYr ? EST_FILL : BRAND;
  });
  _charts[id] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:YEARS, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:24, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } }
    },
    plugins:[ valueLabels(fmt) ]
  });
}

// ── Ranged bar with YoY labels + dual-handle slider (Rides & Riders) ──
function rangedYoYLabels(cfg){
  return { id:'yl', afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, meta = chart.getDatasetMeta(0), yy = chart.$yoy || [];
    meta.data.forEach(function(bar, i){
      var v = chart.data.datasets[0].data[i];
      ctx.save(); ctx.textAlign='center'; ctx.font='700 12px Inter, sans-serif'; ctx.fillStyle='#1E2733';
      ctx.fillText(cfg.barFmt(v), bar.x, bar.y - 22);
      if (yy[i] != null){ var g=yy[i]; ctx.font='600 11px Inter, sans-serif'; ctx.fillStyle = g<0 ? NEG : BRAND;
        ctx.fillText((g<0?'−':'+')+Math.abs(g).toFixed(1)+'%', bar.x, bar.y - 7); }
      ctx.restore();
    });
  } };
}
function buildRangedBar(cfg){
  var cv = document.getElementById(cfg.canvas);
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  destroy(cfg.canvas);
  _charts[cfg.canvas] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderRadius:4, maxBarThickness:64 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:34, bottom:4 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){
        var ch=_charts[cfg.canvas], yv=(ch&&ch.$yoy)?ch.$yoy[ctx.dataIndex]:null;
        return cfg.tipFmt(ctx.parsed.y) + (yv!=null ? '  ('+(yv<0?'−':'+')+Math.abs(yv).toFixed(1)+'% YoY)' : '');
      } } } },
      scales:{ y:{ display:false, beginAtZero:true, grace:'14%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } } }
    },
    plugins:[ rangedYoYLabels(cfg) ]
  });
}
function renderRanged(cfg, a, b){
  var ch = _charts[cfg.canvas]; if (!ch) return;
  var labels=[], data=[], colors=[], yy=[];
  for (var i=a;i<=b;i++){ labels.push(YEARS[i]); data.push(cfg.data[i]);
    colors.push(i>=FIRST_EST ? EST_FILL : BRAND); yy.push(yoy(cfg.data, i)); }
  ch.data.labels=labels; ch.data.datasets[0].data=data; ch.data.datasets[0].backgroundColor=colors;
  ch.$yoy=yy; ch.update('none');
}
function setupRangedSlider(cfg){
  var mn=document.getElementById(cfg.key+'Min'), mx=document.getElementById(cfg.key+'Max');
  var fill=document.getElementById(cfg.key+'Fill'), read=document.getElementById(cfg.key+'Readout');
  if (!mn||!mx||!fill||!read) return;
  var maxI = YEARS.length-1;
  function apply(){
    var a=+mn.value, b=+mx.value;
    fill.style.left=(a/maxI*100)+'%'; fill.style.width=((b-a)/maxI*100)+'%';
    renderRanged(cfg, a, b);
    var cg=cagr(cfg.data[a], cfg.data[b], b-a);
    read.innerHTML='<span class="sg-range">'+YEARS[a]+' → '+YEARS[b]+'</span>'+
      '<span class="sg-stat"><b>'+cfg.readFmt(cfg.data[a])+'</b> → <b>'+cfg.readFmt(cfg.data[b])+'</b></span>'+
      (cg!=null ? '<span class="sg-stat sg-cagr">CAGR <b>'+cg.toFixed(1)+'%</b></span>' : '<span class="sg-stat">CAGR —</span>');
  }
  mn.oninput=function(){ if(+mn.value>=+mx.value) mn.value=+mx.value-1; apply(); };
  mx.oninput=function(){ if(+mx.value<=+mn.value) mx.value=+mn.value+1; apply(); };
  apply();
}
var RIDES_CFG  = { key:'rides',  canvas:'lyChartRides',  data:A_RIDES,  barFmt:ridesLbl, tipFmt:function(v){return ridesLbl(v)+' rides';}, readFmt:ridesLbl };
var RIDERS_CFG = { key:'riders', canvas:'lyChartRiders', data:A_RIDERS, barFmt:function(v){return v.toFixed(1)+'M';}, tipFmt:function(v){return v.toFixed(1)+'M active riders';}, readFmt:function(v){return v.toFixed(1)+'M';} };

// ── Unit-economics: per-ride decomposition (stacked) + take-rate line ──
function decompLabels(){
  return { id:'dl', afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, top = chart.getDatasetMeta(2).data; // gross profit (top stack)
    top.forEach(function(bar, i){
      ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle=BRAND;
      ctx.fillText(usd2(PR_GP[i]), bar.x, bar.y - 6); ctx.restore();
    });
  } };
}
function buildDecompChart(){
  var id='lyUEdecomp', cv=document.getElementById(id);
  if (!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  _charts[id] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:UE_Q, datasets:[
      { label:'Driver pay', data:PR_DRIVER, backgroundColor:GRAY, stack:'s', maxBarThickness:40 },
      { label:'Cost of revenue', data:PR_COR, backgroundColor:EST_FILL, stack:'s', maxBarThickness:40 },
      { label:'Gross profit', data:PR_GP, backgroundColor:BRAND, stack:'s', maxBarThickness:40, borderRadius:3 }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{
        label:function(ctx){ return ctx.dataset.label+': '+usd2(ctx.parsed.y)+'/ride'; },
        footer:function(items){ var i=items[0].dataIndex; return 'Bookings/ride: '+usd2(PR_GB[i]); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } },
        y:{ stacked:true, display:false, beginAtZero:true, grace:'14%' } }
    },
    plugins:[ decompLabels() ]
  });
}
function buildTakeChart(){
  var id='lyUEtake', cv=document.getElementById(id);
  if (!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  _charts[id] = new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:YEARS, datasets:[{ data:A_TAKE, borderColor:BRAND2, backgroundColor:'rgba(107,43,217,0.06)',
      borderWidth:2.5, tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:BRAND2, pointBorderWidth:2, fill:true,
      segment:{ borderDash:function(ctx){ return ctx.p1DataIndex>=FIRST_EST ? [5,4] : undefined; } } }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return 'Take rate: '+ctx.parsed.y.toFixed(1)+'%'; } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } }
    }
  });
}

// ═══ Model vs. Reality (Actuals vs Estimates) ═════════════════════════════════
var Q13 = ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var AVE = {
  rides: { label:'Rides', fmt:'rides', quarters:Q13,
    est:[131.8,155.3,168.0,170.7,166.9,184.3,194.0,221.2,211.2,237.8,247.4,256.5,236.9],
    act:[153.0,177.9,187.4,190.8,187.7,205.3,216.7,218.5,218.4,234.8,248.8,243.5,236.9],
    note:'Total rides (millions, per quarter). The model tracked the trend but ran consistently light on volume — riders came back faster than projected.' },
  gb: { label:'Gross Bookings', fmt:'usd', quarters:Q13,
    est:[2784.3,3097.4,3253.7,3236.8,3258.8,3625.7,3798.5,4235.2,4135.3,4532.1,4731.2,5076.2,4937.5],
    act:[3050.7,3446.0,3554.1,3724.3,3693.2,4018.9,4108.4,4278.9,4162.4,4490.1,4780.4,5074.2,4946.0],
    note:'Gross Bookings. Early quarters beat the model meaningfully; by 2025–26 the estimate converged to within ~1% of actual.' },
  rev: { label:'Revenue', fmt:'usd', quarters:Q13,
    est:[1032.0,1160.3,1226.6,1194.6,1188.5,1348.9,1417.1,1579.5,1449.0,1632.3,1719.8,1799.4,1705.4],
    act:[1000.6,1020.9,1157.5,1224.6,1277.2,1435.8,1522.7,1550.3,1450.2,1588.2,1685.2,1760.7,1650.5],
    note:'Revenue. Mixed early (revenue-recognition / insurance noise), then the model tightened — recent quarters land within a few percent.' },
  cogs: { label:'Cost of Revenue', fmt:'usd', exp:true, quarters:Q13,
    est:[619.2,696.2,735.9,716.7,713.1,809.3,850.2,946.9,840.4,1012.0,1031.9,1025.7,946.5],
    act:[549.0,606.6,644.5,743.9,755.4,819.5,888.3,874.6,862.9,935.7,927.2,971.8,864.1],
    note:'Cost of revenue — a COST line, so green/▼ means actual came in BELOW estimate (under budget). Insurance reform helped 1Q26 land well under the model.' },
  ebitda: { label:'Adj. EBITDA', fmt:'usd', quarters:['4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[110.2,95.9,134.2,151.4,160.8,136.2],
    act:[112.8,106.5,129.4,138.9,154.1,132.8],
    note:'Adj. EBITDA. Window starts 4Q24 — earlier quarters sit on a near-zero / negative base where surprise % is meaningless. Recent quarters track within a few points.' },
  fcf: { label:'Free Cash Flow', fmt:'usd', quarters:['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
    est:[138.3,256.0,242.7,86.5,141.3,257.4,292.2,310.7,212.8],
    act:[127.1,227.3,193.9,140.0,280.7,322.9,257.0,227.6,307.7],
    note:'Free cash flow — lumpy by nature (working capital, insurance timing). Window starts 1Q24, where FCF turns reliably positive.' },
};

// ═══ Management Guidance vs. Reality ══════════════════════════════════════════
// A second yardstick beside the model back-test: management's own next-quarter
// guidance vs what Lyft reported, with the Summit estimate overlaid so all three
// read together on one chart. Each metric spans the SAME quarters as its back-test
// counterpart above (congruent). Lyft did NOT guide Gross Bookings in dollars until
// 4Q23 (it guided Rides + Revenue before) → the GB band starts there. Adj. EBITDA
// is shown from 4Q24 to match the model's EBITDA window. Reported actuals & Summit
// estimates reuse the AVE series; guidance is from Lyft 8-K / shareholder letters
// (Q1'23 → Q2'26). Snapshot 2026-05-13.
var GQ = ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'];
var GUIDE = {
  gb: { label:'Gross Bookings', unit:'usd', q:GQ,
    glo:[null,null,null,3600,3500,4000,4000,4280,4050,4410,4650,5010,4860,5300],
    ghi:[null,null,null,3700,3600,4100,4100,4350,4200,4570,4800,5130,5000,5430],
    act: AVE.gb.act.concat([null]),
    est: AVE.gb.est.concat([null]),
    note:'Lyft only began guiding Gross Bookings in dollars in 4Q23 — before that it guided Rides and Revenue. Since then reported GB has tracked its guided band tightly: inside it almost every quarter, occasionally just above, generally the upper half. Precise, not sandbagged.' },
  ebitda: { label:'Adj. EBITDA', unit:'usd', q:GQ,
    glo:[5,20,75,50,50,95,90,100,90,115,125,135,120,160],
    ghi:[15,30,85,60,55,100,95,105,95,130,145,155,140,180],
    act:[22.7,41,92,66.6,59.4,102.9,107.3,112.8,106.5,129.4,138.9,154.1,132.8,null],
    est:[null,null,null,null,null,null,null].concat(AVE.ebitda.est, [null]),
    note:'Profitability is where Lyft sandbags. Reported Adj. EBITDA has finished in the upper half of, or above, its guided range every quarter — it has done so since it began guiding. Reported Adj. EBITDA finished in the upper half of, or above, the range in all 13 quarters since 1Q23 — clearing the top outright through all of 2023 (guided $5–15M in 1Q23, delivered $22.7M). The Summit model (dashed) only begins 4Q24.' },
  margin: { label:'Adj. EBITDA margin', unit:'pct', isMargin:true, q:GQ, target:4.0,
    act:[0.74,1.19,2.59,1.79,1.61,2.56,2.61,2.64,2.56,2.88,2.91,3.04,2.69,3.17],
    note:'Adj. EBITDA as a % of Gross Bookings — Lyft\'s signature framing. Realized margin has climbed from <b>under 1% in early 2023</b> to ~3% today, on the way to the <b>~4%-of-bookings target set for 2027</b> at the June 2024 Investor Day (dashed line). 2Q26 is the guided midpoint.' },
};
var _guideMetric = 'gb';
// Color an actual point by where it landed vs the guided band. Small tolerance so a
// rounding-level touch of the floor isn't mislabeled a miss.
function guideColor(act, lo, hi){
  if (act==null) return GRAY;
  if (lo==null || hi==null) return BRAND;
  if (act >= hi) return AVE_GREEN;
  if (act >= lo-(lo+hi)/2*0.004) return BRAND;
  return AVE_RED;
}
function guideLand(act, lo, hi){
  if (act==null) return { t:'current guide', c:'guid-mut' };
  if (lo==null || hi==null) return { t:'not guided', c:'guid-mut' };
  var mid=(lo+hi)/2;
  if (act >= hi) return { t:'above range', c:'guid-up' };
  if (act >= mid) return { t:'upper half', c:'' };
  if (act >= lo-mid*0.004) return { t:'in range', c:'' };
  return { t:'below range', c:'guid-dn' };
}

var _aveMetric = 'gb';
var AVE_GREEN = '#1E9E62', AVE_RED = '#C0392B';
function aveFmt(m, v){ return m.fmt==='rides' ? (v==null?'—':v.toFixed(1)+'M') : money(v); }
function aveSurprise(m, i){ var e=m.est[i]; if (e==null||e===0) return 0; return (m.act[i]-e)/Math.abs(e)*100; }
function avePctS(v){ return (v<0?'−':'+')+Math.abs(v).toFixed(1)+'%'; }

var aveLabels = { id:'aveLabels', afterDatasetsDraw:function(chart){
  var surp=chart.$surp||[], bars=chart.getDatasetMeta(0).data, ctx=chart.ctx, area=chart.chartArea;
  if (area){ var y0=chart.scales.y.getPixelForValue(0); ctx.save(); ctx.strokeStyle='#D7DDE4'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(area.left,y0); ctx.lineTo(area.right,y0); ctx.stroke(); ctx.restore(); }
  for (var i=0;i<surp.length;i++){ var bar=bars[i]; if(!bar) continue;
    var above=surp[i]>=0, fav=(chart.$exp ? -surp[i] : surp[i])>=0;
    ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle = fav?AVE_GREEN:AVE_RED;
    ctx.fillText((above?'▲ ':'▼ ')+avePctS(surp[i]), bar.x, above ? bar.y-7 : bar.y+15); ctx.restore(); }
} };
function buildAveChart(){
  var id='lyAveChart', cv=document.getElementById(id);
  if (!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  _charts[id] = new Chart(cv.getContext('2d'), {
    type:'bar',
    data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderRadius:3, maxBarThickness:54 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:24, bottom:22 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{
        title:function(items){ return (_charts.lyAveChart.$q||[])[items[0].dataIndex]||''; },
        label:function(ctx){ var i=ctx.dataIndex, m=AVE[_aveMetric];
          return ['Estimate: '+aveFmt(m,(_charts.lyAveChart.$est||[])[i]),
                  'Actual: '+aveFmt(m,(_charts.lyAveChart.$act||[])[i]),
                  'Surprise: '+avePctS((_charts.lyAveChart.$surp||[])[i])]; } } } },
      scales:{ y:{ display:false, grace:'22%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } }
    },
    plugins:[ aveLabels ]
  });
}
function computeAveStats(m, a, b){
  var surp=[], beats=0, best={f:-Infinity,s:0,q:''}, worst={f:Infinity,s:0,q:''};
  for (var i=a;i<=b;i++){ var s=aveSurprise(m,i), f=m.exp?-s:s; surp.push(s);
    if (f>=0) beats++; if (f>best.f) best={f:f,s:s,q:m.quarters[i]}; if (f<worst.f) worst={f:f,s:s,q:m.quarters[i]}; }
  var n=surp.length, sum=surp.reduce(function(t,v){return t+v;},0), sumAbs=surp.reduce(function(t,v){return t+Math.abs(v);},0);
  var sorted=surp.slice().sort(function(x,y){return x-y;}), mid=Math.floor(n/2);
  var median=n===0?0:(n%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2), avg=n?sum/n:0;
  return { n:n, beats:beats, misses:n-beats, exp:!!m.exp, beatRate:n?beats/n*100:0, missRate:n?(n-beats)/n*100:0,
    avg:avg, avgFav:m.exp?-avg:avg, avgAbs:n?sumAbs/n:0, median:median, medFav:m.exp?-median:median,
    best:best, worst:worst, last:{ s:surp[n-1], f:m.exp?-surp[n-1]:surp[n-1], q:m.quarters[b] } };
}
function renderAveStats(m, a, b){
  var box=document.getElementById('lyAveStats'); if(!box) return;
  var s=computeAveStats(m,a,b);
  function tile(l,v,sub,dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
  var beatDir=s.beatRate>=s.missRate?'up':'down';
  var beatSub=s.beats+' of '+s.n+(s.exp?' under estimate':' above estimate');
  var missSub=s.misses+' of '+s.n+(s.exp?' over estimate':' below estimate');
  var avgSub=s.exp?(s.avg>=0?'we under-budgeted (spent more)':'we over-budgeted (spent less)'):(s.avg>=0?'we ran conservative':'we ran optimistic');
  var lastSub=s.exp?(s.last.f>=0?'under estimate':'over estimate'):(s.last.f>=0?'beat estimate':'missed estimate');
  box.innerHTML =
    tile('Beat rate', s.beatRate.toFixed(0)+'%', beatSub, beatDir)+
    tile('Miss rate', s.missRate.toFixed(0)+'%', missSub, s.missRate>s.beatRate?'down':'muted')+
    tile('Avg surprise', avePctS(s.avg), avgSub, s.avgFav>=0?'up':'down')+
    tile('Median surprise', avePctS(s.median), 'middle quarter', s.medFav>=0?'up':'down')+
    tile('Avg gap (abs)', s.avgAbs.toFixed(1)+'%', 'typical distance from estimate', 'muted')+
    tile('Biggest beat', avePctS(s.best.s), s.best.q, 'up')+
    tile('Biggest miss', avePctS(s.worst.s), s.worst.q, 'down')+
    tile('Latest ('+s.last.q+')', avePctS(s.last.s), lastSub, s.last.f>=0?'up':'down');
}
function renderAve(a, b){
  var m=AVE[_aveMetric], ch=_charts.lyAveChart;
  if (ch){
    var labels=[], est=[], act=[], surp=[], colors=[];
    for (var i=a;i<=b;i++){ var s=aveSurprise(m,i); labels.push(m.quarters[i]); est.push(m.est[i]); act.push(m.act[i]);
      surp.push(+s.toFixed(1)); colors.push((m.exp?-s:s)>=0?AVE_GREEN:AVE_RED); }
    ch.data.labels=labels; ch.data.datasets[0].data=surp; ch.data.datasets[0].backgroundColor=colors;
    ch.$surp=surp; ch.$est=est; ch.$act=act; ch.$q=labels; ch.$exp=!!m.exp; ch.update('none');
  }
  renderAveStats(m, a, b);
}
function setupAveSlider(){
  var mn=document.getElementById('aveMin'), mx=document.getElementById('aveMax');
  var fill=document.getElementById('aveFill'); if(!mn||!mx||!fill) return;
  var m=AVE[_aveMetric], maxI=m.quarters.length-1;
  mn.max=maxI; mx.max=maxI; mn.value=0; mx.value=maxI;
  function apply(){ var a=+mn.value, b=+mx.value;
    fill.style.left=(a/maxI*100)+'%'; fill.style.width=((b-a)/maxI*100)+'%'; renderAve(a,b); }
  mn.oninput=function(){ if(+mn.value>=+mx.value) mn.value=+mx.value-1; apply(); };
  mx.oninput=function(){ if(+mx.value<=+mn.value) mx.value=+mn.value+1; apply(); };
  apply();
}
function switchAveMetric(root, k){
  if (!AVE[k]) return; _aveMetric=k;
  root.querySelectorAll('.ave-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ave')===k); });
  var m=AVE[k], t=document.getElementById('lyAveT'), note=document.getElementById('lyAveNote');
  if (t) t.innerHTML=esc(m.label)+' — surprise vs estimate <span>(%, per quarter · hover for $)</span>';
  if (note) note.textContent=m.note;
  setupAveSlider();
}
function buildModelTab(){
  var root=document.querySelector('.ov-lyft'); if(!root) return;
  buildAveChart();
  switchAveMetric(root, _aveMetric);
  renderGuide();
}
function guideLegend(){
  var g=GUIDE[_guideMetric];
  var s='display:inline-flex;align-items:center;gap:7px;margin:0 18px 6px 0;font-size:12px;font-weight:600;color:var(--mu)';
  function dot(c){ return '<span style="width:11px;height:11px;border-radius:50%;background:'+c+';flex:none"></span>'; }
  function band(){ return '<span style="width:16px;height:11px;border-radius:3px;background:rgba(107,43,217,0.16);border:1px solid rgba(107,43,217,0.4);flex:none"></span>'; }
  function dash(c){ return '<span style="width:16px;border-top:2px dashed '+c+';flex:none"></span>'; }
  if (g.isMargin){
    return '<span style="'+s+'">'+dot(BRAND)+'Realized margin</span><span style="'+s+'">'+dash(BRAND2)+'2027 target (~4%)</span>';
  }
  return '<span style="'+s+'">'+band()+'Guided range</span><span style="'+s+'">'+dot(BRAND)+'Reported actual</span><span style="'+s+'">'+dash(GRAY)+'Summit model</span>';
}
function guideTip(ctx){
  var g=GUIDE[_guideMetric], i=ctx.dataIndex, dl=ctx.dataset.label;
  if (g.isMargin){
    if (dl==='Realized margin'){ return (i===g.q.length-1?'Guided midpoint: ':'Realized margin: ')+g.act[i].toFixed(2)+'%'; }
    if (dl==='2027 target'){ return '2027 target: ~'+g.target.toFixed(0)+'%'; }
    return null;
  }
  if (dl==='Guided range'){ return g.glo[i]==null ? 'Not guided yet' : 'Guided: '+money(g.glo[i])+' – '+money(g.ghi[i]); }
  if (dl==='Reported actual'){ return g.act[i]==null ? 'Reported: pending' : 'Reported: '+money(g.act[i]); }
  if (dl==='Summit model'){ return g.est[i]==null ? null : 'Summit model: '+money(g.est[i]); }
  return null;
}
function buildGuideChart(){
  var id='lyGuideChart', cv=document.getElementById(id);
  if (!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  var g=GUIDE[_guideMetric], q=g.q, ds=[];
  if (g.isMargin){
    ds.push({ type:'line', label:'Realized margin', data:g.act, borderColor:BRAND, borderWidth:2.5, tension:.3, fill:false, order:1,
      pointRadius:q.map(function(_,i){ return i===q.length-1?6:4.5; }),
      pointStyle:q.map(function(_,i){ return i===q.length-1?'rectRot':'circle'; }),
      pointBackgroundColor:q.map(function(_,i){ return i===q.length-1?'#fff':BRAND; }),
      pointBorderColor:BRAND, pointBorderWidth:2 });
    ds.push({ type:'line', label:'2027 target', data:q.map(function(){ return g.target; }), borderColor:BRAND2, borderWidth:1.5, borderDash:[6,5], pointRadius:0, fill:false, order:2 });
  } else {
    ds.push({ type:'bar', label:'Guided range', order:3, maxBarThickness:32, borderSkipped:false, borderRadius:3, borderWidth:1,
      data:g.glo.map(function(lo,i){ return (lo==null||g.ghi[i]==null)?null:[lo,g.ghi[i]]; }),
      backgroundColor:'rgba(107,43,217,0.14)', borderColor:'rgba(107,43,217,0.34)' });
    ds.push({ type:'line', label:'Reported actual', data:g.act, borderColor:BRAND, borderWidth:2, tension:0, spanGaps:false, fill:false, order:1,
      pointRadius:g.act.map(function(v){ return v==null?0:5; }),
      pointBackgroundColor:g.act.map(function(v,i){ return guideColor(v,g.glo[i],g.ghi[i]); }),
      pointBorderColor:'#fff', pointBorderWidth:1.5 });
    ds.push({ type:'line', label:'Summit model', data:g.est, borderColor:GRAY, borderWidth:1.5, borderDash:[5,4], tension:0, spanGaps:false, fill:false, order:2,
      pointRadius:g.est.map(function(v){ return v==null?0:3; }), pointBackgroundColor:'#fff', pointBorderColor:GRAY, pointBorderWidth:1.5 });
  }
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:q, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:16, bottom:2 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:guideTip } } },
      scales:{ y:{ grace:'8%', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return g.isMargin?v+'%':money(v); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } } }
    }
  });
}
function renderGuideTable(){
  var box=document.getElementById('lyGuideTbl'); if(!box) return;
  var g=GUIDE[_guideMetric];
  if (g.isMargin){
    var mrows=g.q.map(function(q,i){
      var a=g.act[i], pend=(i===g.q.length-1), vs=a-g.target;
      return '<tr><td>'+esc(q)+(pend?' <span class="guid-mut">(guide)</span>':'')+'</td><td><b>'+a.toFixed(2)+'%</b></td>'+
        '<td class="'+(vs>=0?'guid-up':'guid-dn')+'">'+(vs>=0?'+':'−')+Math.abs(vs).toFixed(2)+' pp</td></tr>';
    }).join('');
    box.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Realized margin</th><th>vs 2027 target (~4%)</th></tr></thead><tbody>'+mrows+'</tbody></table>';
    return;
  }
  var rows=g.q.map(function(q,i){
    var lo=g.glo[i], hi=g.ghi[i], a=g.act[i], land=guideLand(a,lo,hi);
    var range=(lo==null)?'<span class="guid-mut">not guided</span>':money(lo)+' – '+money(hi);
    var rep=(a==null)?'<span class="guid-mut">pending</span>':'<b>'+money(a)+'</b>';
    var model=(g.est[i]==null)?'<span class="guid-mut">—</span>':money(g.est[i]);
    return '<tr><td>'+esc(q)+'</td><td>'+range+'</td><td>'+rep+'</td><td>'+model+'</td><td class="'+land.c+'">'+land.t+'</td></tr>';
  }).join('');
  box.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Guided range</th><th>Reported</th><th>Summit model</th><th>Landing</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function renderGuide(){
  var leg=document.getElementById('lyGuideLeg'); if(leg) leg.innerHTML=guideLegend();
  var note=document.getElementById('lyGuideNote'); if(note) note.innerHTML=GUIDE[_guideMetric].note;
  buildGuideChart();
  renderGuideTable();
}
function switchGuideMetric(root, k){
  if (!GUIDE[k]) return; _guideMetric=k;
  root.querySelectorAll('.guid-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-guidm')===k); });
  renderGuide();
}

// ─── Tab orchestration ────────────────────────────────────────────────────────
function buildOverviewCharts(){ buildAnnualBar('lyChartGB', A_GB, moneyB); buildAnnualBar('lyChartEbitda', A_EBITDA, money); }
function buildGrowthTab(){ buildRangedBar(RIDES_CFG); setupRangedSlider(RIDES_CFG); buildRangedBar(RIDERS_CFG); setupRangedSlider(RIDERS_CFG); }
function buildUnitTab(){ buildDecompChart(); buildTakeChart(); }

// ── Deep Dive layer: build the charts for a given dd pane when it becomes visible ──
function buildDD(root, key){
  // Every top-level tab now holds sub-panes; paint the active sub-pane's charts.
  var s=activeSubKey(root,key); if(s) buildSub(root,key,s);
}
// Build the lazy charts inside a nested sub-pane, by (group, sub-key).
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segments'){ buildOverviewCharts(); buildActiveSeg(root); }  // GB + EBITDA + active segment
    // customers, tam, industry: no charts
  } else if(group==='bottomline'){
    if(key==='unit')          buildUnitTab();
    else if(key==='margins')  buildLyMargins();   // live Massive margins
    // suppliers, insurance: no charts (insurance's sf-pill is wired globally in init)
  } else if(group==='evolution'){
    // Earnings ▸ Setup carries its own Results-engine instance (LYFT_SETUP). Build it when the
    // sub-tab becomes visible AND Setup is the live phase — a build against a hidden container
    // yields a zero-size canvas. Same guard as amzn.js/googl.js.
    if(key==='earnings'){
      var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
      if(!ph || ph.getAttribute('data-cep')==='setup') requestAnimationFrame(gBuildCeAnnual);
    }
    else if(key==='guidance') buildModelTab();      // Model vs. Reality lives under Guidance
    else if(key==='track'){                          // Results — the shared engine (js/results.js)
      var w=root.querySelector('.ovt-subpane[data-ovst="track"] .rs-wrap');
      if(w) initResults(w, 'LYFT');
    }
    else if(key==='estevo'){                         // Estimate Evolution — binds to #rsEvoWrap
      if(root.querySelector('#rsEvoWrap')) initResultsEvo();
    }
    // strategy, timeline: no lazy charts
  } else if(group==='valuation'){
    if(key==='multiples')     LYFT_VAL.init(root);
    else if(key==='balance')  buildLyBal();     // insurance-reserve coverage bar
    else if(key==='financials') buildLyFin();   // the eight-year arc, from the annual dataset
    // peers (static table), ratings, capital: no charts
  } else if(group==='mgmt'){
    if(key==='team')          LYFT_MGMT.init(root);
    else if(key==='governance') buildLySbc();   // SBC % vs share-count history
    // ownership, track: no charts
  }
}
// Segments ▸ inner Rideshare / Media & Growth toggle → build the active segment's charts.
function buildActiveSeg(root){
  var pane=root.querySelector('.dd-pane[data-dd="topline"]'); if(!pane) return;
  var b=pane.querySelector('.seg-pill.active'); var seg=b?b.getAttribute('data-seg'):'rides';
  if(seg==='rides'){
    buildGrowthTab();
    var ds=root.querySelector('#lyDecompSlider'); if(ds) renderDecomp(+ds.value);
  }
  // media: no lazy chart
}
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
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-dd')!==key); });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// ─── Modal (milestone detail) ─────────────────────────────────────────────────
function wireModal(root){
  var back=root.querySelector('#lyModalBack'), mT=root.querySelector('#lyModalT'), mB=root.querySelector('#lyModalB');
  if (!back) return;
  var galIdx=-1;
  function onEsc(e){ if (e.key==='Escape'){ closeM(); return; } if (galIdx<0) return; if (e.key==='ArrowLeft'){ e.preventDefault(); renderGal((galIdx-1+RIDE_FLOW.length)%RIDE_FLOW.length); } else if (e.key==='ArrowRight'){ e.preventDefault(); renderGal((galIdx+1)%RIDE_FLOW.length); } }
  function openM(title, bodyHtml){ mT.innerHTML=title; mB.innerHTML=bodyHtml;
    back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ galIdx=-1; back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function galBody(i){ var s=RIDE_FLOW[i], n=RIDE_FLOW.length, pv=(i-1+n)%n, nx=(i+1)%n;
    return '<div class="ov-gal"><div class="ov-gal-cap">'+s.d+'</div>'+
      '<div class="ov-gal-nav"><button type="button" class="ov-gal-btn" data-gnav="'+pv+'" aria-label="previous">\u2039</button>'+
      '<span class="ov-gal-count">'+(i+1)+' / '+n+'</span>'+
      '<button type="button" class="ov-gal-btn" data-gnav="'+nx+'" aria-label="next">\u203a</button></div></div>'; }
  function renderGal(i){ galIdx=i; var s=RIDE_FLOW[i]; mT.innerHTML='Step '+(i+1)+' \u2014 '+esc(s.t); mB.innerHTML=galBody(i);
    mB.querySelectorAll('[data-gnav]').forEach(function(b){ b.onclick=function(){ renderGal(+b.getAttribute('data-gnav')); }; }); }
  function openGal(i){ back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); renderGal(i); }
  root.querySelector('#lyModalX').onclick = closeM;
  back.onclick = function(e){ if (e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if (kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if (kind==='ride'){ var s=RIDE_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    if (kind==='fw'){ var fw=FW_DETAIL[+id]; return fw?{t:fw.t,h:fw.h}:null; }
    if (kind==='pvic'){ var v=PVIC_CHAIN[+id]; return v?{t:'Insurance — '+v.t,h:v.d}:null; }
    if (kind==='init'){ var d=INITIATIVES.filter(function(x){return x.k===id;})[0]; return d?{t:d.t,h:d.d}:null; }
    if (kind==='lreg'){ var rg=REG[+id]; return rg?{t:rg.h,h:rg.d}:null; }
    if (kind==='exec'){ var ex=LY_TRACK.filter(function(x){return x.id===id;})[0]; return ex?{t:ex.n+' <span class="ov-modal-sub">'+ex.role+' · at Lyft since '+esc(ex.since)+'</span>',h:ex.detail}:null; }
    if (kind==='lnote'&&id==='take'){ return {t:'The take-rate line — accounting, not economics',h:TAKE_EXPL}; }
    if (kind==='lnote'&&id==='cogs'){ return {t:'The Q4 → Q1 cost-of-revenue drop',h:COGS_NOTE}; }
    if (kind==='lnote'&&id==='gm'){ return {t:'Gross margin — structural or one-time?',h:'<div class="ov-wind-h">The structural case</div>'+bullets(GM_STRUCT)+'<div class="ov-wind-h" style="margin-top:14px">Reasons for caution</div>'+bullets(GM_CAUTION)}; }
    if (kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m?{t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>',h:m.detail}:null; }
    if (kind==='fam'){ var gp=id.split('-'), gg=LY_PROD_GROUPS[+gp[0]]; var f=gg&&gg.families[+gp[1]]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+esc(it[1])+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick = function(){ var key=el.getAttribute('data-detail'); if (key.indexOf('ride:')===0){ openGal(+key.split(':')[1]); return; } var d=resolve(key); if (d) openM(d.t, d.h); };
  });
}

// ── Live price (via the shared get-quote edge function; informational banner) ──
function fetchQuote(ticker){
  var env=(typeof window!=='undefined')&&window.ENV;
  if(!env||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return Promise.reject(new Error('no-env'));
  var base=String(env.SUPABASE_URL).replace(/\/+$/,'');
  return fetch(base+'/functions/v1/get-quote?ticker='+ticker,{ headers:{ apikey:env.SUPABASE_ANON_KEY, Authorization:'Bearer '+env.SUPABASE_ANON_KEY } })
    .then(function(r){ if(!r.ok) throw new Error('http '+r.status); return r.json(); })
    .then(function(j){ if(j&&typeof j.price==='number') return j; throw new Error('bad payload'); });
}
function renderLive(root){
  var el=root.querySelector('#lyLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('LYFT').then(function(q){
    var p=q.changePct, up=(p==null||p>=0);
    var t=q.time?new Date(q.time*1000):null, hhmm=t?(('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)):'';
    var st=(q.marketState&&q.marketState!=='REGULAR')?(' · '+String(q.marketState).toLowerCase()):'';
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">LYFT</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NASDAQ')+(hhmm?(' · '+hhmm):'')+st+'</span>';
  }).catch(function(){ el.hidden=true; el.innerHTML=''; }); // hide cleanly until the get-quote edge fn is deployed
}
function init(c){
  _co=c;   // company id + ticker for the shared Watch List (Supabase)
  // Root spans BOTH profile panes (Overview + Deep Dive copanes under #co-detailview),
  // so this single pass wires the Overview scatter, the Deep Dive tabs and the shared
  // modal — the element set matches the old single .ov-lyft root.
  var root = document.getElementById('co-detailview');
  if (!root) return;
  renderLive(root); // Deep Dive ▸ Deep Overview keeps its #lyLive banner; the standardized Overview has no price strip.
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt');
  // Segments ▸ inner Rideshare / Media & Growth toggle (the "sub-tabs de los segmentos").
  root.querySelectorAll('.seg-pill').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.getAttribute('data-seg');
    root.querySelectorAll('.seg-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.seg-body').forEach(function(p){ p.hidden=(p.getAttribute('data-seg')!==seg); });
    requestAnimationFrame(function(){ buildActiveSeg(root); });
  }; });
  root.querySelectorAll('.ave-pill').forEach(function(btn){
    btn.onclick = function(){ switchAveMetric(root, btn.getAttribute('data-ave')); };
  });
  root.querySelectorAll('.guid-pill').forEach(function(btn){
    btn.onclick = function(){ switchGuideMetric(root, btn.getAttribute('data-guidm')); };
  });
  wireModal(root);
  var ds=root.querySelector('#lyDecompSlider'); if(ds){ ds.oninput=function(){ renderDecomp(+ds.value); }; renderDecomp(+ds.value); }
  root.querySelectorAll('.sf-pill').forEach(function(b){ b.onclick=function(){ root.querySelectorAll('.sf-pill').forEach(function(x){ x.classList.toggle('active',x===b); }); renderStmtFlow(b.getAttribute('data-sf')); }; }); if(root.querySelector('.sf-pill')) renderStmtFlow('before');
  // Peer-map custom tooltip (vivid, replaces the native SVG title)
  (function(){
    var tip=root.querySelector('#lyPeerTip'); if(!tip) return;
    root.querySelectorAll('.peer-dot').forEach(function(dot){
      dot.addEventListener('mouseenter',function(){ tip.innerHTML='<span class="pt-n">'+dot.getAttribute('data-name')+'</span>'+dot.getAttribute('data-why'); tip.hidden=false; });
      dot.addEventListener('mousemove',function(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; });
      dot.addEventListener('mouseleave',function(){ tip.hidden=true; });
    });
  })();
  // Earnings calls accordion
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  // Earnings Narrative lens toggle (By theme \u21c4 By quarter)
  root.querySelectorAll('.calls-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-callsv');
    root.querySelectorAll('.calls-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var t=root.querySelector('#lyCallsTheme'), q=root.querySelector('#lyCallsQuarter');
    if(t) t.style.display=(v==='theme')?'':'none';
    if(q) q.style.display=(v==='quarter')?'':'none';
  }; });
  // \u2500\u2500 Standardized Overview wiring: dynamic peer scatter, segment accordions, live market cap \u2500\u2500
  lyScReset(); lyScRender(root); lyScChips(root);
  var sctip=root.querySelector('#lyScTip');
  function wireScNodes(){ if(!sctip) return; root.querySelectorAll('#lyScNodes .mg-node').forEach(function(g){
    function show(){ sctip.innerHTML='<span class="mgt-n">'+g.getAttribute('data-name')+'</span>'+g.getAttribute('data-why'); sctip.hidden=false; }
    function move(e){ sctip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; sctip.style.top=(e.clientY+16)+'px'; }
    g.addEventListener('mouseenter', show); g.addEventListener('mousemove', move);
    g.addEventListener('mouseleave', function(){ sctip.hidden=true; });
    g.addEventListener('click', function(e){ show(); move(e); });
  }); }
  function scRefresh(){ lyScRender(root); wireScNodes(); }
  wireScNodes();
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    if(btn.hasAttribute('data-mgtype')){ LY_SC.type=btn.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    else { LY_SC.basis=btn.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    scRefresh();
  }; });
  // peer chips: \u00d7 DELETES a peer immediately (no toggle); ticker input re-adds (restoring a seed's multiples)
  function wireChips(){
    root.querySelectorAll('#lyScChips .lysc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(LY_SC.peers[i]){ LY_SC.peers.splice(i,1); lyScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#lyScAddBtn'), addIn=root.querySelector('#lyScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!LY_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=LY_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; LY_SC.peers.push(o); } // restore a known peer's multiples
        else LY_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, evT:null,evF:null,peT:null,peF:null,gt:null,gf:null, why:'Added by ticker \u2014 live market cap only; no multiple on file, so it plots once one is available.' });
      }
      addIn.value=''; lyScChips(root); wireChips(); scRefresh(); lyLiveOne(tk); }; }
  }
  wireChips();
  // Segment "What is X?" + economics accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'\u2013':'+'; }; });
  // Collapsible sections (reader chooses what to expand)
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'\u25be':'\u25b8'; }; });
  // Live market cap (Key Facts #lyMc + peer bubbles) \u2014 Massive via api.liveQuote; degrades gracefully in preview
  function lyLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(q){ if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; LY_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='LYFT'){ var el=root.querySelector('#lyMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':(mcB>=10?Math.round(mcB):mcB.toFixed(1))+'B')+' \u00b7 live'; } scRefresh(); }).catch(function(){}); }
  LY_SC.peers.forEach(function(p){ if(p.tk) lyLiveOne(p.tk); });
  lyScRender(root); // first paint of the standardized Overview scatter (no ovt-tab gate anymore)
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  // (an inactive .copane is display:none, which would hide a modal nested inside it).
  root.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='lyModalBack') m.remove(); });
  var md=root.querySelector('#lyModalBack'); if(md && md.parentNode!==root) root.appendChild(md);
}
// Deep Dive charts build lazily: init() already wired the dd-tabs (root spans both
// panes), so here we only paint the active dd-pane's charts now that it is visible.
function deepDiveInit(c){
  _co=c;   // company id + ticker for the shared Watch List (Supabase)
  var _r=document.getElementById('co-detailview');
  if(_r) wireCallEarnings(_r);   // phase tabs, quarter pills, shared Watch List mount
  var root = document.getElementById('co-detailview'); if(!root) return;
  var d = activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}

export var lyftOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
