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
  ['Waymo (Alphabet)', 'Robotaxi operator, live in several US cities.', 'Threat <i>and</i> partner — Lyft hosts third-party AV fleets (Waymo→Nashville) on its network rather than building its own. Same asset-light hybrid bet as Uber, but Lyft has less demand density to offer fleets.'],
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
      '<p><b>Net read — solid but newly elevated (amber, leaning green).</b> The long internal tenure and successful defense of the contractor model are positives; the "unproven" tag is only that she stepped into the CLO role in April 2026.</p>' }
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
  var h='<p class="ov-lede">The people running Lyft today, rated on <b>what they have actually built</b> — an <b>Lyft</b> record and a <b>prior-roles</b> record for each. Lyft runs a <b>lean C-suite</b> (three named officers; no President/COO). Color = the net read; <b>tap a card</b> for the full history.</p>';
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
  // 6 - membership + ecosystem — MOVED to Bottom Line ▸ Suppliers.
  h+=sec('Supplier & customer ecosystem',
    '');
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
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings History</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+callsBody()+'</div>'+
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
      '</div>'+
      '<div class="ovt-subpane" data-ovst="multiples">'+LYFT_VAL.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+lyPeerMultBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="ratings" hidden><div id="dd-val-slot"></div></div>'+
      '<div class="ovt-subpane" data-ovst="capital" hidden>'+lyCapAllocBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="balance" hidden>'+lyBalanceBody(c)+'</div>'+
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
    if(key==='guidance')      buildModelTab();      // Model vs. Reality lives under Guidance
    // earnings (calls), strategy, timeline: no lazy charts
  } else if(group==='valuation'){
    if(key==='multiples')     LYFT_VAL.init(root);
    else if(key==='balance')  buildLyBal();     // insurance-reserve coverage bar
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
  var root = document.getElementById('co-detailview'); if(!root) return;
  var d = activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}

export var lyftOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
