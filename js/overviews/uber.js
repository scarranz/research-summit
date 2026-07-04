// overviews/uber.js — custom Overview for Uber Technologies, Inc. (NYSE: UBER)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model (snapshot 2026-05-07):
//   actuals_history = reported · projection_history = model estimate.
// Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 / Q1 2026 results &
// prepared remarks, the Feb 2024 "Go-Get" Investor Day (see SOURCES). No live API.

import { makeValuation } from './valuation.js';
import { makeManagement } from './management.js';

// Interactive "Scenario → price target" calculator (Valuation tab). Fundamentals from
// the Summit DCF (FY2025 actuals; FY2026E estimate). Net cash & price are editable
// (Summit model carries no balance sheet/quote); defaults reproduce the DCF FY2026E.
var UBER_VAL = makeValuation({
  brand:'#111827', sharesM:2119.689,
  netCashDefaultM:-2888, netCashNote:'Q1 2026: cash + short-term investments ≈ $7.6B − long-term debt $10.5B ≈ −$2.9B net debt.',
  priceDefault:70.00, priceAsOf:'~Jul 2026', priceHint:"≈$70–76 (Jul 2026); Q1’26 buyback avg $73. Editable — verify live.",
  volLabel:'Gross Bookings',
  segments:[
    { key:'mobility', label:'Mobility', gb2025M:97497, take2025Pct:30.43,  growthDefaultPct:13,
      hint:{ take:"'22 26.6% · '23 28.8% · '24 30.2% · '25 30.4%", growth:"'23 +31% · '24 +21% · '25 +17%", guide:"Uber guides total Gross Bookings + Adj. EBITDA each quarter." } },
    { key:'delivery', label:'Delivery', gb2025M:90864, take2025Pct:18.98,  growthDefaultPct:15,
      hint:{ take:"'22 19.5% · '23 19.2% · '24 18.4% · '25 19.0%", growth:"'23 +14% · '24 +17% · '25 +22%" } },
    { key:'freight',  label:'Freight',  gb2025M:5093,  take2025Pct:100.12, growthDefaultPct:5,
      hint:{ take:"'22 99.9% · '23 100.1% · '24 100.1% · '25 100.1%", growth:"'23 −25% · '24 −2% · '25 −1%", note:"Freight books revenue ≈ gross bookings (gross basis) — its ~100% take is not a real margin." } },
  ],
  marginBasePct:16.78, marginDefaultPct:19.67,
  marginHint:"History: '22 5.4% · '23 10.9% · '24 14.7% · '25 16.8%. Uber guides an Adj. EBITDA $ range each quarter.",
  dcf:{ fy:'FY2026E', revM:58695, ebitdaM:11547 },
  mult:{ evebitda:{min:6,max:22,def:13}, marginMin:10, marginMax:28 },
});

// Management roster (Management tab). Public-source bios; no ownership/trades.
var UBER_MGMT = makeManagement({
  brand:'#111827',
  lede:"Uber is run by a deep, long-tenured bench under CEO <b>Dara Khosrowshahi</b>, who engineered the turn from cash-burner to cash-compounder. One thing to watch: the <b>finance seat has turned over three times in three years</b>.",
  execs:[
    { id:'dara', lead:true, name:'Dara Khosrowshahi', title:'Chief Executive Officer', since:'CEO since 2017', img:'img/leadership/uber-dara.jpg',
      line:"Architect of the turnaround; ex-CEO of Expedia.",
      bio:"Chief Executive Officer since August 2017; leads Uber's platform across 70+ countries. Previously CEO of Expedia for ~12 years and CFO of IAC. Also a director of Expedia Group and Grab Holdings." },
    { id:'macdonald', name:'Andrew Macdonald', title:'President & COO', since:'At Uber since 2012', img:'img/leadership/uber-macdonald.jpg',
      line:"Top operating leader over Mobility & Delivery.",
      bio:"President & Chief Operating Officer; joined in 2012 as Toronto's first general manager. Oversees Mobility and Delivery operations globally — effectively the top operating leader. Ex-Bain & Company." },
    { id:'hazelbaker', name:'Jill Hazelbaker', title:'President, Corporate Affairs', since:'At Uber since 2015', img:'img/leadership/uber-hazelbaker.jpg',
      line:"Leads marketing, comms, policy & safety; ex-Snap, Google.",
      bio:"President & Chief Corporate Affairs Officer; oversees marketing, communications, public policy and safety. Prior: communications and public policy at Snap and comms/government relations at Google (EMEA)." },
    { id:'balaji', name:'Balaji Krishnamurthy', title:'Chief Financial Officer', since:'CFO since Feb 2026', img:'img/leadership/uber-balaji.png',
      line:"Internal promotion; ex-divisional CFO & IR; ex-Goldman Sachs.",
      bio:"CFO since February 2026; at Uber since 2019, previously divisional CFO for Mobility and Delivery and head of Investor Relations. Earlier 8+ years at Goldman Sachs. Uber's third CFO in three years, after Nelson Chai and Prashanth Mahendra-Rajah." },
    { id:'west', name:'Tony West', title:'Chief Legal Officer', since:'At Uber since 2017', img:'img/leadership/uber-west.jpg',
      line:"Ex-US Associate Attorney General; ex-GC of PepsiCo.",
      bio:"SVP, Chief Legal Officer & Corporate Secretary; leads Legal, Compliance & Ethics, and Security. Former General Counsel of PepsiCo and held two Senate-confirmed positions at the U.S. DOJ (Associate Attorney General). Stanford Law." },
    { id:'anderson', name:'Susan Anderson', title:'Head of Delivery', since:'At Uber since 2016', img:'img/leadership/uber-anderson.jpg',
      line:"Runs Uber Eats across 30+ countries.",
      bio:"Head of Delivery; runs Uber Eats and global grocery/on-demand delivery. Joined in 2016, starting by leading Uber Eats in Queensland, Australia. Prior: Amazon, Bain, Capital One." },
    { id:'kannan', name:'Madhu Kannan', title:'Chief Business Officer', since:'Rejoined 2023', img:'img/leadership/uber-kannan.jpg',
      line:"Leads business development & corporate strategy; ex-BofA.",
      bio:"Chief Business Officer; oversees global business development and corporate strategy. First joined Uber in 2017 and returned in 2023 from Bank of America Securities." },
    { id:'kansal', name:'Sachin Kansal', title:'Chief Product Officer', since:'At Uber since 2017', img:'img/leadership/uber-kansal.jpg',
      line:"Leads products, AV and sustainability.",
      bio:"Chief Product Officer; joined in 2017 as the first product leader for safety technology. Oversees Mobility and Delivery products plus autonomous and sustainability initiatives. M.S. from Stanford." },
    { id:'maredia', name:'Sarfraz Maredia', title:'Head of Autonomous', since:'At Uber since 2014', img:'img/leadership/uber-maredia.jpg',
      line:"Leads Uber's autonomous mobility & delivery.",
      bio:"Head of Autonomous Mobility & Delivery; leads Uber's AV efforts. Joined in 2014; previously ran US & Canada Mobility and the Americas for Uber Eats." },
    { id:'praveen', name:'Praveen Neppalli Naga', title:'Chief Technology Officer', since:'At Uber since 2015', img:'img/leadership/uber-praveen.jpg',
      line:"Leads engineering and science; ex-LinkedIn.",
      bio:"Chief Technology Officer; leads engineering and science strategy. Joined in 2015; previously ~7 years at LinkedIn building products and data infrastructure." },
    { id:'pradeep', name:'Pradeep Parameswaran', title:'Head of Mobility', since:'At Uber since 2017', img:'img/leadership/uber-pradeep.jpg',
      line:"Runs global ride-sharing across 70+ countries.",
      bio:"Head of Mobility; runs global ride-sharing across 70+ countries. Joined in 2017; previously led mobility in India, South Asia and APAC." },
  ],
  board:[
    { name:'Ronald Sugar', chair:true, independent:true, role:'Independent Chair · ex-Chairman & CEO of Northrop Grumman · chairs Nominating & Governance.' },
    { name:'Dara Khosrowshahi', dual:true, independent:false, role:'Chief Executive Officer.' },
    { name:'John Thain', independent:true, role:'Ex-CEO of CIT Group & Merrill Lynch · chairs Audit.' },
    { name:'Robert Eckert', independent:true, role:'Ex-CEO of Mattel · chairs Compensation.' },
    { name:'Nikesh Arora', independent:true, role:'Chairman & CEO of Palo Alto Networks · Comp, Nom & Gov.' },
    { name:'Ursula Burns', independent:true, role:'Ex-CEO of Xerox and VEON · Audit, Nom & Gov.' },
    { name:'Revathi Advaithi', independent:true, role:'CEO of Flex · Audit.' },
    { name:'Amanda Ginsberg', independent:true, role:'Ex-CEO of Match Group · Comp, Nom & Gov.' },
    { name:'Alexander Wynaendts', independent:true, role:'Ex-CEO of Aegon · Audit.' },
    { name:'Turqi Alnowaiser', independent:true, role:'Head of Int’l Investments, Saudi PIF · Audit.' },
  ],
  boardNote:'9 of 10 independent; Chair and CEO roles are separate.',
  gov:[
    { k:'Share & voting', v:'1 vote / share', d:'No dual-class or founder control.' },
    { k:'Board', v:'9 of 10 independent', d:'Chair ≠ CEO · annual elections.' },
    { k:'CEO pay · FY25', v:'$35.6M · 96% at-risk', d:'Base $1.08M · say-on-pay ~94%.' },
  ],
  foot:"Executives per Uber’s leadership page; board, committees and governance per the 2026 proxy (DEF 14A / corrected DEFR14A). Headshots from Uber’s newsroom CDN. Ownership and insider trades live in the Pillars → Management tab.",
});

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting ──────────────────────────────────────────────────────────────
function money(m){ if (m==null) return '—'; var neg=m<0,a=Math.abs(m),s;
  if (a>=1000) s='$'+(a/1000).toFixed(2).replace(/\.?0+$/,'')+'B'; else s='$'+Math.round(a)+'M'; return (neg?'−':'')+s; }
function moneyB(m){ var neg=m<0,a=Math.abs(m); return (neg?'−':'')+'$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }
function yoy(arr,i){ if(i<1||arr[i-1]==null||arr[i-1]===0) return null; return (arr[i]/arr[i-1]-1)*100; }
function cagr(v0,v1,yrs){ if(v0==null||v1==null||v0<=0||v1<=0||yrs<=0) return null; return (Math.pow(v1/v0,1/yrs)-1)*100; }

// ─── Brand: Uber black + Uber Eats green ─────────────────────────────────────
var BRAND='#10141A', BRAND2='#06C167', GRAY='#B8C0CA';
var MOB=BRAND, DEL=BRAND2, FRT='#9AA3AE';
var EST_MOB='rgba(16,20,26,0.32)', EST_DEL='rgba(6,193,103,0.32)';

// ─── Annual series 2022..2029E (idx 4 = first estimate) ──────────────────────
var YEARS=['2022','2023','2024','2025','2026E','2027E','2028E','2029E']; var FIRST_EST=4;
var A_MOB_GB=[52665,68897,83024,97497,118328,138444,173055,216319];
var A_DEL_GB=[55778,63726,74614,90864,115023,143779,165346,190147];
var A_FRT_GB=[6952,5242,5135,5093,5336,5336,5336,5336];
var A_TOT_GB=A_MOB_GB.map(function(v,i){ return v+A_DEL_GB[i]+A_FRT_GB[i]; });
var A_REV=[31877,37281,43978,52017,58695,68128,78362,93642];
var A_EBITDA=[1713,4052,6484,8730,11547,14817,17397,21496];
var A_FCF=[135,3030,6895,9763,10665,12699,15843,19617];
var A_MAPC=[131,150,171,202,236,265,297,332];

// ─── Quarterly 1Q23..1Q26 (segment economics + back-test) ────────────────────
var Q13=['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var MOB_GB_A=[14981,16728,17903,19285,18670,20554,21002,22798,21182,23762,25111,27442,26394];
var DEL_GB_A=[15026,15595,16094,17011,17699,18126,18663,20126,20377,21734,23322,25431,25992];
var FRT_GB_A=[1401,1278,1284,1279,1282,1272,1308,1273,1259,1260,1307,1267,1334];
var MOB_GB_E=[14368.8,16304.1,18199.7,19362.2,17977.2,20073.6,21841.7,23142.0,21657.2,24048.2,25937.5,27585.6,25842.0];
var DEL_GB_E=[16127.5,16096.2,15873.4,16605.4,17430.2,18090.2,18669.0,19562.7,20530.8,21388.7,22395.6,24956.2,25878.8];
var FRT_GB_E=[1555.4,1120.8,958.5,1078.6,1279.0,1282.0,1259.3,1308.0,1209.3,1259.0,1260.0,1307.0,1267.0];
var MOB_REV_A=[4330,4894,5071,5537,5633,6134,6409,6911,6496,7288,7682,8204,6798];
var DEL_REV_A=[3093,3057,2935,3119,3214,3293,3470,3773,3777,4102,4477,4892,5068];
// Segment Adj. EBITDA actuals end 4Q25 (Uber moved to segment operating income in 1Q26).
var MOB_EB_A=[1060,1170,1287,1446,1479,1567,1682,1769,1753,1905,2038,2203];
var DEL_EB_A=[288,329,413,476,528,588,628,727,763,873,921,1015];
var REV_A=[8823,9230,9292,9936,10131,10700,11188,11959,11533,12651,13467,14366,13203];
var REV_E=[8804.2,9229.2,9252.4,9488.9,9450.0,10158.8,10953.8,11771.9,11607.4,12537.3,13426.1,14462.3,14040.1];
var EB_A=[761,916,1092,1283,1382,1570,1690,1842,1868,2119,2256,2487,2481];
var EB_E=[693.4,944.9,1032.2,1068.8,1199.8,1463.9,1634.5,1890.2,1855.3,2107.1,2328.3,2517.2,2396.1];
var MAPC_A=[130,137,142,150,149,156,161,171,170,180,189,202,199];
var MAPC_E=[128.8,136.6,138.9,146.7,156.0,157.6,161.9,171.0,168.4,174.7,180.3,191.5,195.5];
var FCF_A=[549,1083,798,600,1359,1721,2109,1706,2250,2475,2230,2808,2286];
var FCF_E=[0,0,0,0,0,1913.6,2167.9,2129.8,2409.6,2632.5,2910.7,2988.1,2454.5];
// derived totals / ratios
var TOT_GB_A=MOB_GB_A.map(function(v,i){ return v+DEL_GB_A[i]+FRT_GB_A[i]; });
var TOT_GB_E=MOB_GB_E.map(function(v,i){ return v+DEL_GB_E[i]+FRT_GB_E[i]; });
var MOB_TAKE=MOB_REV_A.map(function(r,i){ return r/MOB_GB_A[i]*100; });
var DEL_TAKE=DEL_REV_A.map(function(r,i){ return r/DEL_GB_A[i]*100; });
var MOB_MARGIN=MOB_EB_A.map(function(e,i){ return e/MOB_GB_A[i]*100; }); // 12 q
var DEL_MARGIN=DEL_EB_A.map(function(e,i){ return e/DEL_GB_A[i]*100; }); // 12 q

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT=[
  ['Listing','NYSE: UBER'],['Founded','2009 — San Francisco'],['IPO','May 2019 · $45.00'],
  ['CEO','Dara Khosrowshahi (2017)'],['Segments','Mobility · Delivery · Freight'],['S&P 500','since Dec 2023'],
];
var DESC='Uber runs the largest mobility and delivery platform in the world — ridesharing (Mobility), food/grocery/retail delivery (Delivery) and logistics brokerage (Freight) — across ~70 countries. The thesis is a cross-sell flywheel: "go anywhere and get anything," with Uber One membership and a fast-growing, high-margin advertising business compounding frequency and margin. Asset-light economics convert almost all profit to free cash flow.';
var KPIS=[
  { l:'Gross Bookings', v:'$193.5B', d:pctStr((A_TOT_GB[3]/A_TOT_GB[2]-1)*100)+' YoY', dir:'up' },
  { l:'Revenue',        v:'$52.0B',  d:pctStr((A_REV[3]/A_REV[2]-1)*100)+' YoY',   dir:'up' },
  { l:'Adj. EBITDA',    v:'$8.73B',  d:pctStr((A_EBITDA[3]/A_EBITDA[2]-1)*100)+' YoY', dir:'up' },
  { l:'MAPCs',          v:'202M',    d:pctStr((A_MAPC[3]/A_MAPC[2]-1)*100)+' YoY',  dir:'up' },
];
var AS_OF='Headline KPIs are FY2025. Most recent quarter (Q1 2026): $53.7B bookings (+25% YoY), $2.48B Adj. EBITDA (+33%), 199M MAPCs (+17%), a record $3.0B of buybacks and ~$9.8B TTM free cash flow.';
// Trimmed to one scannable line; the GAAP-vs-Non-GAAP accounting nuance lives in a single tap-to-read note.
var FY_NOTE='<b>FY2025:</b> Gross Bookings $193.5B (+19%) · Adj. EBITDA $8.73B (+35%) · free cash flow $9.76B (+42%, ~112% of Adj. EBITDA). <span class="ov-clickable" data-detail="note:gaap" style="color:#06C167;font-weight:600;cursor:pointer;white-space:nowrap">Why GAAP net income is a poor gauge here ›</span>';
var GAAP_NOTE='GAAP net income swings on tax and equity-investment items (e.g. just $296M in Q4 2025 on a ~$1.6B equity revaluation), so it is a poor profitability gauge — <b>Adj. EBITDA and free cash flow are the cleaner signals.</b><br><br>From Q1 2026 Uber <b>retired Adjusted EBITDA as its headline</b>, guiding instead on <b>Non-GAAP EPS / Non-GAAP operating income</b> (which fold in stock-comp) — closer to GAAP, but deliberately not GAAP net income, given the equity-stake noise. Forward years (2026E–2029E) are Summit DCF estimates.';
// ─── What truly drives Uber — the 5 things that matter (front-door emphasis) ───
// Clickable cards (key = `key:<k>`). These are the economic drivers; Strategy holds the forward bets.
var KEY_DRIVERS=[
  { k:'flywheel', t:'The Flywheel', teaser:'One app for everything — rides, food, grocery, travel.',
    d:'<b>"Go anywhere, get anything."</b> A single demand graph that cross-sells rides ⇄ eats ⇄ grocery ⇄ travel.<br><br>~40% of users use multiple products; ~⅓ of Eats customers were acquired through the Rides app (a near-zero-CAC channel). Cross-platform users <b>spend ~3× and churn meaningfully less</b> — so each added product lowers blended CAC and lifts LTV. This is why Uber keeps adding adjacencies instead of chasing one vertical.' },
  { k:'uberone', t:'Uber One', teaser:'The membership that ties it all together — 50M+ members.',
    d:'<b>The connective tissue of the whole platform.</b> 50M+ members (Q1 2026, +50% YoY); members now drive <b>>50% of combined Mobility+Delivery bookings</b> and >50% of Delivery.<br><br>Members spend ~3× non-members and retain ~35% better. They run negative-margin for ~6 months (benefits cost) then turn profitable — so penetration (~25% of users) is the lever. See Unit Economics for the full member-vs-non-member math.' },
  { k:'barbell', t:'The Barbell', teaser:'Win the cheap end AND the premium end — skip the middle.',
    d:'<b>Uber grows at both ends of the price ladder at once</b> — the <b>affordable end</b> (UberX Share, two/three-wheelers, Moto) for frequency, the <b>premium end</b> (Black, Reserve, Comfort) for profit, skipping the squeezed middle. <b>Full breakdown — with the ~75% frequency and ~3.5× profit-growth figures — in the Mobility tab.</b>' },
  { k:'ads', t:'Advertising', teaser:'A near-100%-margin business hiding inside Delivery.',
    d:'<b>The clearest structural margin lever.</b> >$2B annualized run-rate, +50% YoY; crossed 2% of Delivery bookings (management targets higher).<br><br>Sponsored listings and in-app ads sit mostly inside Delivery and carry near-100% incremental margin — so ad growth lifts Delivery\'s take rate and margin <i>without</i> touching the marketplace split.' },
  { k:'cash', t:'The Cash Machine', teaser:'Asset-light: growth turns almost entirely into cash.',
    d:'<b>From cash-burner to cash compounder.</b> Asset-light economics convert <b>~100%+ of Adjusted EBITDA into free cash flow</b> (~$9.8B TTM), topped up by the Aleka insurance float.<br><br>That cash funds a <b>$20B buyback</b> (~$3B/quarter, ~2% annual share-count reduction). Growth no longer needs heavy capital — it drops to cash. See Strategy ▸ Capital returns for how it\'s deployed.' },
];
// Each segment is "Gross Bookings × take rate = revenue". Driver of each is what moves Gross Bookings.
var SEGMENTS=[
  ['Mobility', 'The <b>profit engine</b> — ridesharing in ~70 countries. Uber keeps ~<b>30%</b> of bookings; highest take, biggest profit (~7.7% segment op-margin, Q1 2026).'],
  ['Delivery', 'Uber Eats — food, grocery, retail. Lower take (~<b>19%</b>, merchants paid too), but bookings nearly match Mobility and margin has <b>doubled</b> on ads + scale.'],
  ['Freight', 'Logistics brokerage, reported <b>gross</b> (no take rate). ~$5B bookings, near-breakeven — kept for optionality, not profit.'],
];
// Note: Advertising and Uber One are NOT reportable segments — they cut across Mobility & Delivery,
// so they now live in "What Truly Drives Uber" (top of Overview) instead of being listed here twice.
var TIMELINE=[
  { y:'2009', t:'<b>Uber founded</b> in San Francisco by Garrett Camp and Travis Kalanick (originally "UberCab").' },
  { y:'2014', t:'Launches <b>UberX</b> at scale and <b>Uber Eats</b> — the two businesses that define the platform today.' },
  { y:'Aug 2017', t:'<b>Dara Khosrowshahi</b> (ex-Expedia) becomes CEO after Travis Kalanick\'s ouster.',
    d:'After a turbulent 2017 (culture scandals, lawsuits, executive departures), founder <b>Travis Kalanick</b> stepped down and the board hired <b>Dara Khosrowshahi</b> from Expedia. His tenure reset the culture, exited unprofitable markets (selling China to Didi, SE Asia to Grab, Russia to Yandex earlier), and drove the long march to GAAP profitability and free-cash-flow generation.' },
  { y:'May 2019', t:'<b>IPO</b> on the NYSE at $45.00 — one of the largest tech IPOs ever, but it traded down for years.',
    d:'Uber priced its IPO at <b>$45.00</b> (a ~$82B valuation), below the early hype. The stock spent its first few years underwater as the market questioned whether ride-hailing could ever be profitable. The turnaround thesis — scale + take-rate discipline + Delivery + advertising + Uber One — is what eventually re-rated the stock.' },
  { y:'2020', t:'California <b>Prop 22</b> passes; Uber sells its self-driving unit (<b>ATG</b>) to Aurora — pivot to asset-light AV.',
    d:'Two pivotal de-risking moves. <b>Prop 22</b> (Nov 2020) preserved the independent-contractor model in California — later <b>upheld by the state Supreme Court in July 2024</b>. And Uber <b>sold its money-losing self-driving unit (ATG) to Aurora</b> (booking a ~$1.6B gain), choosing to be the <b>demand aggregator</b> for third-party AV developers rather than build its own — the foundation of today\'s AV strategy.' },
  { y:'2023', t:'<b>First full year of GAAP operating profit</b> ($1.1B); added to the <b>S&P 500</b> (Dec).',
    d:'The inflection year. Uber posted its <b>first full year of GAAP operating profit</b> (~$1.1B) and was <b>added to the S&P 500 in December 2023</b> — at the time the largest company by market cap not yet in the index. It marked the shift from "can it ever make money?" to a cash-generative compounder.' },
  { y:'2024', t:'<b>First Investor Day</b> ("Go-Get") sets 3-year targets; inaugural <b>$7B buyback</b>; <b>investment grade</b>.',
    d:'At its <b>first-ever Investor Day (Feb 2024)</b>, Uber issued three-year targets: <b>mid-to-high-teens Gross Bookings CAGR</b>, <b>high-30s%–40% Adjusted EBITDA CAGR</b>, and <b>&gt;90% free-cash-flow conversion</b>. It also announced its <b>first-ever buyback ($7B)</b> and earned <b>investment-grade ratings</b> (S&P BBB-, Moody\'s Baa2). Uber has since been running ahead of all three targets.' },
  { y:'2025–26', t:'AV partnerships scale (Waymo, Nuro/Lucid, WeRide…); <b>$20B buyback</b>; Uber One tops <b>50M</b> members.',
    d:'AV went from concept to commercial: <b>Waymo</b> live on the Uber app in Austin & Atlanta, a flagship <b>Lucid + Nuro</b> program (≥20,000 robotaxis), WeRide in the Gulf, and ~20 partners total — capped by the launch of <b>Uber Autonomous Solutions</b> (Feb 2026). Capital returns scaled to a <b>$20B authorization</b> (~$3B/quarter), and <b>Uber One passed 50M members</b>.' },
];
// Richer peer table: who they are, where share moves, and the structural edge.
var PEERS=[
  { n:'Lyft', dom:'lyft.com', arena:'US/Canada rideshare · #2', edge:'Uber holds ~70%+ of US rides and is the only global, multi-product player. Same ~30% take — so scale + the Eats⇄rides bundle are the moat, not pricing.' },
  { n:'DoorDash', dom:'doordash.com', arena:'US delivery leader', edge:'The one peer that out-scales Uber in a category (~60% US food vs Eats ~22–25%). Uber counters with Mobility cross-sell, Uber One & ads; Eats is far bigger internationally.' },
  { n:'Waymo', dom:'waymo.com', arena:'Robotaxi · partner & rival', edge:'On the Uber app in Austin/Atlanta, on its own app in SF/Phoenix/LA — the defining AV question (see Strategy ▸ AV).' },
  { n:'Grab · Bolt · Didi', dom:'grab.com', arena:'Regional super-apps', edge:'SE Asia, Europe, China/LatAm. Uber competes locally or holds equity stakes; its global brand + capital are the edge.' },
];
var PEER_NOTE='Ride-hailing economics rarely turn on take rate (peers cluster ~30%) — they turn on <b>density, cross-sell and regulatory positioning</b>, where Uber\'s global scale and bundle are the edge.';
// ── Strategy ──
var TARGETS=[
  { v:'Mid–high teens', l:'Gross Bookings CAGR', s:'3-yr target (Feb 2024 Investor Day). FY25 actual: +19%.' },
  { v:'High-30s–40%',   l:'Adj. EBITDA CAGR',    s:'">2× the rate of topline." FY25 actual: +35%.' },
  { v:'>90%',           l:'FCF conversion',      s:'Of Adj. EBITDA. FY25 actual: ~112%.' },
];
// Clickable initiative cards: short teaser on the card, full story in a modal (key = `init:<k>`).
// NOTE: the flywheel / Uber One / advertising are now the front-door "drivers" on the Overview tab.
// Strategy holds the forward-looking BETS — where management is taking the business next.
// (Initiatives capital/U4B/travel now live in the Overview cash driver + the Uber One tab.)
// (AV bull/bear lists removed — reworked into evidence framing in the Mobility tab.)
var UK_NOTE='In January 2026, after a UK tax ruling, Uber moved its UK rideshare (outside London) from a <b>principal (merchant)</b> to an <b>agent</b> model. Driver payments reclassified from cost of revenue to contra-revenue — cutting reported revenue ~$1.0B and Mobility\'s revenue margin by ~<b>400 bps</b> in Q1 2026, with an equal-and-opposite drop in cost of revenue. <b>Zero impact on Adjusted EBITDA or underlying economics.</b> So the reported Q1 2026 Mobility take rate (~25.8%) understates the real ~30% — a pure gross-to-net accounting artifact, not deteriorating economics.';
var SOURCES='Quantitative series: Summit DCF model, snapshot 2026-05-07 (actuals_history = reported; projection_history = model estimate). Segment Adjusted EBITDA actuals end Q4 2025 — Uber moved its primary segment-profit measure to Segment Operating Income in Q1 2026. Take rates are derived (revenue ÷ segment gross bookings) and the Q1 2026 Mobility figure is depressed ~400 bps by a UK gross-to-net accounting change. Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 & Q1 2026 results and prepared remarks, the Feb 2024 Investor Day, and the Cal. Supreme Court Prop 22 ruling (Jul 2024). Forward years (2026E–2029E) are model estimates, not company guidance. Brand colors approximate Uber black and Uber Eats green.';

// ─── How Uber makes money: interactive per-trip chain (Mobility) ──────────────
// VISA-style: each step is clickable (key = `trip:<i>`) → modal with the economics/timing detail.
var TRIP_FLOW=[
  { img:'step-request.jpg', t:'Rider requests & sees an upfront price', d:'Uber sets and shows an <b>upfront, all-in price</b> before the rider confirms — fare + service fee + booking fee + taxes/tolls. Uber controls pricing (surge, product mix), which is how it manages the take rate trip-by-trip.' },
  { img:'step-pay.jpg', t:'Trip happens; rider pays the full fare', d:'Payment is almost always <b>card / digital wallet</b> in developed markets (some emerging markets are cash). Uber collects the <b>entire Gross Booking</b> — it is the merchant of record in most geographies (the UK ex-London moved to an <i>agency</i> model in 2026, see take-rate note).' },
  { img:'step-take.jpg', t:'Uber keeps its take (~30%)', d:'Uber retains ~<b>30%</b> of Mobility bookings as <b>revenue</b> (~19% in Delivery). This is the marketplace fee that funds the platform, support, R&D and profit. The rest is owed to the driver and the per-trip insurer.' },
  { img:'step-driver.jpg', t:'Driver is paid their earnings', d:'The driver keeps fare-based earnings + tips + incentives. <b>Timing:</b> the default is a <b>weekly</b> automatic payout, but most drivers use <b>Instant Pay / the Uber Pro Card</b> to cash out <b>within minutes, multiple times a day</b>. Because Uber collects up-front (card) and can pay drivers on a delay it chooses, the float is modestly working-capital-favorable.' },
  { img:'step-insurance.jpg', t:'Per-trip insurance is funded → Aleka', d:'Ride-hail rules require <b>commercial insurance on every trip</b>, funded from the fare and routed to <b>Aleka</b> — Uber\'s wholly-owned captive insurer. Aleka books the premium as a <b>provision</b>, invests the float, and pays claims later (see Insurance).' },
  { img:'step-cash.jpg', t:'What converts to cash for Uber', d:'From its take, Uber covers platform/R&D/admin costs → Adjusted EBITDA; after other expenses and adding the <b>insurance float spread</b>, roughly <b>$0.75 of every $10 trip</b> converts to cash. Asset-light = ~100%+ of Adj. EBITDA becomes free cash flow.' },
];
// Illustrative per-$10 Mobility trip (Summit deck, Dec 2024). Mini-bars of where the $10 goes.
var TRIP_SPLIT=[
  ['Driver earnings', 65, '$6.50', BRAND],
  ['Commercial insurance → Aleka', 5, '$0.50', '#5B8DEF'],
  ['Uber revenue (the ~30% take)', 30, '$3.00', BRAND2],
];
// Of Uber's ~$3.00 take on a $10 trip, where it lands:
var TRIP_TAKE=[
  ['Platform, R&D & admin costs', 73, '~$2.20', GRAY],
  ['Adjusted EBITDA', 27, '~$0.80', BRAND2],
];
var TRIP_CASH='From the $0.80 of Adj. EBITDA, less other expenses (≈$0.40) → ~$0.40 cash from the core trip; add the <b>Aleka insurance float</b> (≈$0.35) and <b>~$0.75 of every $10 trip converts into cash</b> for Uber. <span class="ave-subh-note">Illustrative Mobility economics — Summit deck, Dec 2024.</span>';

// ─── Insurance / Aleka deep-dive ──────────────────────────────────────────────
// The captive-insurer money cycle, as a step chain (clickable → detail).
var ALEKA_CHAIN=[
  { t:'Rider funds insurance in the fare', d:'A commercial-insurance charge is built into every trip\'s price — the rider funds it, not Uber.' },
  { t:'Uber routes it to Aleka', d:'Uber acts as intermediary, transferring the premium to <b>Aleka</b>, its <b>wholly-owned captive insurer</b>. Keeping insurance in-house (vs buying it from third parties) lets Uber capture the underwriting economics.' },
  { t:'Aleka books a provision & invests the float', d:'Aleka records the premium as a <b>provision</b> (reserve) for future claims and <b>invests the float</b> in the meantime — generating investment income on money it doesn\'t yet owe.', payoff:false },
  { t:'Claims are paid later, from the provision', d:'As accidents/claims occur over the following months and years, Aleka pays them out of the reserve. Total insurance reserves are ~<b>$12.9B</b> (Q1 2026) and rise with volume.' },
  { t:'The spread returns to Uber as cash flow', d:'<b>Provision + investment income − claims paid = a spread that returns to Uber</b>, showing up in Cash Flow from Operations. On the illustrative $10 trip this is the ~$0.35 insurance-float contribution. It buffered Uber\'s cash flow in 2021–22 and is now a steady supplement.', payoff:true },
];
var INS_TL=[
  { y:'2021–22', t:'<b>Crutch.</b> The insurance float propped up a barely-breakeven business (Mobility CFO margin ~1.2%).' },
  { y:'2022–24', t:'<b>Headwind.</b> Claim severity spiked → fare hikes (esp. CA) suppressed trips. The #1 US Mobility cost.' },
  { y:'2025–26', t:'<b>Tailwind.</b> Costs moderate, savings passed to riders → trip growth reaccelerates in SF/LA. Now a supplement, not the crutch.' },
];

// ─── Mobility take-rate: management's own words ────────────────────────────────
var TAKE_QUOTES=[
  ['CFO Prashanth Krishnamurthy, Q1 2026', '"The impact on our Mobility revenue margin was roughly <b>400 bps</b> in Q1… primarily a movement of driver payment costs from cost of revenue to contra-revenue, and has <b>no impact on underlying economics</b>. We expect this accounting headwind to persist at roughly the same magnitude for the remainder of 2026."'],
  ['Q4 2025 prepared remarks', '"Beginning in January 2026, following a UK tax-law ruling, we transitioned from a <b>merchant model to an agency model outside of London</b>… driver payments will be reclassified from cost of revenue to contra-revenue… approximately <b>350 bps lower</b>, driven solely by this accounting reclassification… <b>no impact on profitability</b>."'],
];

// ─── M&A — terms & what each deal added (clickable cards, key = `mna:<n>`) ─────
var MNA=[
  { n:'Careem', fp:'Added Middle-East Mobility + Delivery bookings — a region Uber does not run itself.', y:'2020', deal:'$3.1B', terms:'cash + convert. notes', own:'Integrated', cat:'Mobility',
    detail:'<b>Terms:</b> $3.1B ($1.4B cash + $1.7B convertible notes); closed Jan 2020.<br><br><b>What it added:</b> Middle-East mobility/delivery/payments super-app (UAE, Saudi, Egypt, Pakistan…).<br><br><b>Status:</b> operated as a unit; the Careem super-app was later partly spun out (e& invested $400M, 2023).' },
  { n:'Postmates', fp:'Roughly <b>doubled US Delivery</b> — which grew into a co-equal segment (~47% of bookings today).', y:'2020', deal:'$2.65B', terms:'all stock', own:'Integrated', cat:'Delivery', big:true,
    detail:'<b>Terms:</b> ~$2.65B all-stock ($31.45/share); closed Dec 2020.<br><br><b>What it added:</b> US food-delivery scale, merged into Uber Eats — a key step to challenging DoorDash.<br><br><b>Status:</b> fully integrated.' },
  { n:'Cornershop', fp:'The <b>grocery on-ramp</b>, folded into Eats — seed of the ~$12B grocery run-rate.', y:'2021', deal:'~$1.4B', terms:'mostly stock', own:'Integrated', cat:'Grocery',
    detail:'<b>Terms:</b> ~$450M for the initial ~53% (2019), then 29M Uber shares (~$1.4B) for the rest (2021).<br><br><b>What it added:</b> LatAm/Canada grocery delivery, folded into Uber Eats — the grocery on-ramp.<br><br><b>Status:</b> integrated.' },
  { n:'Drizly', fp:'<b>Written off in 2024</b> — a rare miss; alcohol folded back into Eats.', y:'2021', deal:'$1.1B', terms:'mostly stock', own:'Shut down', cat:'Alcohol', miss:true,
    detail:'<b>Terms:</b> ~$1.1B (mostly stock); closed Oct 2021.<br><br><b>What it was for:</b> on-demand alcohol delivery.<br><br><b>Outcome:</b> <b>shut down in early 2024</b> — service ended ~March 2024 and alcohol was folded directly into Uber Eats. A clear write-off and a rare M&A miss.' },
  { n:'Transplace', fp:'<b>Created scaled Uber Freight</b> (~$5B GB, near-breakeven) — kept for optionality.', y:'2021', deal:'$2.25B', terms:'cash + stock', own:'Integrated', cat:'Freight',
    detail:'<b>Terms:</b> ~$2.25B (up to $750M stock + cash; $550M external co-investment); closed Nov 2021, bought from TPG.<br><br><b>What it added:</b> managed-transportation / logistics network for Uber Freight.<br><br><b>Status:</b> integrated into Uber Freight — the segment that has since struggled in the freight recession.' },
  { n:'Trendyol Go', fp:'New-region Delivery — Turkey (~$2B bookings).', y:'2025', deal:'$700M', terms:'85% stake, cash', own:'Controlling', cat:'Delivery',
    detail:'<b>Terms:</b> $700M for an 85% controlling stake (announced May 2025).<br><br><b>What it added:</b> Turkey\'s leading food/grocery courier (~$2B bookings, 200M+ orders/yr) — brings Uber Eats to Turkey.<br><br><b>Status:</b> closing/operating as an independent app with Uber Eats features layered in.' },
  { n:'Foodpanda Taiwan', fp:'<b>Blocked</b> — a ~$250M break fee: a cost, not an asset.', y:'2024', deal:'$950M', terms:'cash — BLOCKED', own:'Terminated', cat:'Delivery', miss:true,
    detail:'<b>Terms:</b> ~$950M cash for Delivery Hero\'s Foodpanda Taiwan (May 2024).<br><br><b>Outcome:</b> <b>blocked by Taiwan\'s FTC (Dec 2024)</b> — it would have given Uber >90% local delivery share. Deal terminated March 2025; Uber paid a ~<b>$250M break fee</b> (and separately bought $300M of new Delivery Hero shares).' },
];

// ─── Summit thesis ──────────────────────────────────────────────────────────────────────────────
// Uber thesis intentionally removed \u2014 this overview carries NO Summit thesis.

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join(''); }
// Numbered, optionally-clickable step chain (reuses shared .ov-chain). detailKey → data-detail="<key>:<i>".
// compact=true hides the inline description (it lives in the tap-to-open modal) — keeps the Overview light.
function chain(arr, detailKey, compact){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(detailKey?' ov-clickable':'');
  var attr=detailKey?' data-detail="'+detailKey+':'+i+'"':'';
  var more=detailKey?' <span class="ov-tl-more">tap ›</span>':'';
  var body=compact?'':'<div class="ov-chain-d">'+s.d+'</div>';
  var thumb=s.img?'<div class="ov-chain-img"><img src="img/steps/'+s.img+'" alt="'+esc(s.t)+'" loading="lazy"></div>':'';
  return '<div class="'+cls+'"'+attr+'>'+thumb+'<div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div>'+body+'</div>';
}).join('')+'</div>'; }
// Horizontal proportion bars (reuses shared .ov-mbars). rows = [label, pct, valueLabel, color].
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
// M&A cards (reuses shared .ov-cards-mna).
function mnaTimeline(){
  var DIV=[
    {y:'2016', n:'China → Didi', fp:'Exited a cash-furnace market for a <b>Didi equity stake</b>.'},
    {y:'2018', n:'SE Asia → Grab', fp:'Swapped mounting losses for a <b>Grab stake</b>.'},
    {y:'2020', n:'Self-driving (ATG) → Aurora', fp:'Shed heavy <b>AV R&D burn</b> — a major step toward the 2023 profit; kept a ~26% stake.', big:true},
    {y:'2021', n:'Russia → Yandex', fp:'Sold the JV stake for cash on the way out.'}
  ];
  var acq=MNA.slice().sort(function(a,b){ return (+String(a.y).replace(/\D/g,''))-(+String(b.y).replace(/\D/g,'')); });
  var h='<style>'+
    '.mnt-h2{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin:14px 0 8px}.mnt-h2.acq{color:#049a4f}.mnt-h2.dv{color:#2E6BE6}'+
    '.mnt-rail{display:flex;flex-wrap:wrap;gap:9px}'+
    '.mnt-chip{flex:1;min-width:158px;max-width:250px;border:1px solid var(--bdr);border-radius:11px;padding:10px 12px;background:#fff}'+
    '.mnt-chip.acq{border-top:3px solid #06C167}.mnt-chip.dv{border-top:3px solid #2E6BE6}.mnt-chip.miss{border-top-color:#C0392B}'+
    '.mnt-chip.acq.ov-clickable{cursor:pointer;transition:.15s}.mnt-chip.acq.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.mnt-chip.big{box-shadow:0 0 0 2px rgba(46,107,230,.16)}'+
    '.mnt-top{display:flex;justify-content:space-between;align-items:center;gap:6px}'+
    '.mnt-yr{font-size:11px;font-weight:800;color:var(--navy)}.mnt-cat{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:var(--mu);background:#eef2f7;border-radius:10px;padding:1px 7px}'+
    '.mnt-n{font-size:12.5px;font-weight:800;color:var(--navy);margin:5px 0 4px}.mnt-x{font-size:9px;color:#C0392B;font-weight:800;text-transform:uppercase}'+
    '.mnt-fp{font-size:11px;color:var(--navy);line-height:1.45}.mnt-fp b{font-weight:800}'+
    '.mnt-more{font-size:10px;color:#049a4f;font-weight:700;margin-top:6px}'+
    '.mnt-axis{text-align:center;font-size:11.5px;color:var(--navy);background:linear-gradient(90deg,transparent,rgba(6,193,103,.10),transparent);border-top:1px dashed var(--bdr);border-bottom:1px dashed var(--bdr);padding:9px;margin:14px 0}.mnt-axis b{font-weight:800}.mnt-star{color:#E8A00C}'+
    '.mnt-punch{font-size:11.5px;color:var(--navy);line-height:1.6;background:#f6f8fa;border-left:3px solid #10141A;border-radius:8px;padding:11px 14px;margin-top:14px}.mnt-punch b{font-weight:800}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 4px">Uber’s M&A runs on <b>two tracks</b>: acquisitions <b>add</b> bookings and whole segments; divestitures <b>shed</b> losses and turn them into equity stakes. Read together, they explain how the P&L reached profit. <b>Tap any acquisition</b> for terms.</div>';
  h+='<div class="mnt-h2 acq">↑ Acquisitions — what they <b>added</b> (offense)</div>';
  h+='<div class="mnt-rail">'+acq.map(function(m){ var mc=m.miss?' miss':'';
    return '<div class="mnt-chip acq'+mc+' ov-clickable" data-detail="mna:'+esc(m.n)+'">'+
      '<div class="mnt-top"><span class="mnt-yr">'+esc(m.y)+'</span><span class="mnt-cat">'+esc(m.cat)+'</span></div>'+
      '<div class="mnt-n">'+esc(m.n)+(m.miss?' <span class="mnt-x">miss</span>':'')+'</div>'+
      '<div class="mnt-fp">'+(m.fp||'')+'</div><div class="mnt-more">terms ›</div></div>'; }).join('')+'</div>';
  h+='<div class="mnt-axis"><span class="mnt-star">★</span> Q2 2023 — Uber’s <b>first-ever GAAP operating profit</b>, where both tracks converge</div>';
  h+='<div class="mnt-h2 dv">↓ Divestitures — what they <b>shed</b> → the path to profit (defense)</div>';
  h+='<div class="mnt-rail">'+DIV.map(function(d){
    return '<div class="mnt-chip dv'+(d.big?' big':'')+'"><div class="mnt-top"><span class="mnt-yr">'+esc(d.y)+'</span></div>'+
      '<div class="mnt-n">'+d.n+'</div><div class="mnt-fp">'+d.fp+'</div></div>'; }).join('')+'</div>';
  h+='<div class="mnt-punch"><b>What actually changed in the financials:</b> Postmates made <b>Delivery a co-equal segment</b>, Transplace <b>created Freight</b>, Cornershop opened <b>grocery</b>, Careem/Trendyol added <b>regions</b>. Meanwhile exiting China, SE Asia, Russia and self-driving turned cash-burning operations into <b>equity stakes</b> — which is exactly why <b>GAAP net income swings</b> quarter to quarter (and why Uber guides on <b>Non-GAAP EPS</b>). Recent AV “deals” are capital commitments, not acquisitions.</div>';
  return h;
}
function rangeSlider(key,maxI,a,b){
  return '<div class="sg-controls"><div class="sg-slider">'+
    '<div class="sg-track"><div class="sg-fill" id="'+key+'Fill"></div></div>'+
    '<input type="range" id="'+key+'Min" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start">'+
    '<input type="range" id="'+key+'Max" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End">'+
    '</div><div class="sg-ends"><span>'+esc(a)+'</span><span>'+esc(b)+'</span></div>'+
    '<div class="sg-readout" id="'+key+'Readout"></div></div>';
}

// ─── Pane: Overview ───────────────────────────────────────────────────────────
// ─── Supply Chain (Bloomberg SPLC, 29-Jun-2026) ─────────────────────────────
// Uber's SPLC reveals two stories: (1) the AV ecosystem build-out on the supplier side,
// and (2) the restaurant/grocery merchant network on the customer side.
// Very sparse relationship-size data — most entries are undisclosed.
// Suppliers grouped by what they DO for Uber: role (what they do) + impact (how it helps/threatens Uber).
var SC_SUPPLIERS = [
  { h:'Autonomous & Automotive', tag:'30+ partners', big:true,
    role:'Supply the autonomous vehicles and the self-driving stack — sensors, compute, robotaxis, OEM cars.',
    players:[['Waymo','waymo.com'],['Aurora','aurora.tech'],['Nuro','nuro.ai'],['Lucid','lucidmotors.com'],['WeRide','weride.ai'],['Pony.ai','pony.ai'],['NVIDIA','nvidia.com'],['Stellantis','stellantis.com'],['Rivian','rivian.com'],['Zoox','zoox.com']],
    impact:{ kind:'mixed', text:'The future of low-cost supply — but the <b>one group that can disintermediate Uber</b> (Waymo already runs its own app). Mostly strategic/equity ties, not vendor bills. Uber’s hedge: aggregate 30+ so no single AV owns the demand.' } },
  { h:'Tech & Cloud', tag:'the plumbing',
    role:'Cloud hosting, mapping, messaging and outsourced engineering.',
    players:[['Oracle','oracle.com'],['HCLTech','hcltech.com'],['Adobe','adobe.com'],['Twilio','twilio.com'],['TomTom','tomtom.com']],
    impact:{ kind:'good', text:'Keeps Uber <b>asset-light</b> with strikingly low disclosed spend (HCL $127M, Oracle $55M are the only big bills). Commoditized inputs — little leverage over Uber.' } },
  { h:'Payments & Fintech', tag:'money in & out',
    role:'Move money in (rider payments) and out (driver & courier payouts).',
    players:[['Adyen','adyen.com'],['Stripe','stripe.com'],['Marqeta','marqeta.com'],['Block','block.xyz'],['Klarna','klarna.com']],
    impact:{ kind:'good', text:'Enable global card acceptance + <b>Instant Pay</b> (driver loyalty). Collecting upfront and paying out on Uber’s schedule makes the float mildly <b>working-capital-positive</b>.' } },
  { h:'Fleet & Charging', tag:'~15% of supply hours',
    role:'Provide vehicle supply (rental fleets) and EV charging infrastructure.',
    players:[['Hertz','hertz.com'],['Avis','avisbudgetgroup.com'],['EVgo','evgo.com'],['Moove','moove.io']],
    impact:{ kind:'good', text:'~<b>15% of mobility supply hours</b> come from fleets; the on-ramp for EV/AV supply. Hertz also runs Uber’s AV fleet operations.' } },
  { h:'Ad Tech & Marketing', tag:'feeds the ads engine',
    role:'Measure, target and verify Uber’s in-app advertising.',
    players:[['The Trade Desk','thetradedesk.com'],['Criteo','criteo.com'],['DoubleVerify','doubleverify.com']],
    impact:{ kind:'good', text:'Make the <b>>$2B, ~100%-margin ads business</b> sellable to brands — the clearest pure-margin lever Uber has.' } },
  { h:'Real Estate & Infra', tag:'AV depots',
    role:'Offices, data centers, and the AV depots Uber is buying for charging & repair.',
    players:[['Alexandria','are.com'],['Equinix','equinix.com'],['Hudson Pacific','hudsonpacificproperties.com']],
    impact:{ kind:'good', text:'Physical backbone for the AV scale-up; small dollars (Alexandria $28M is the largest), mostly optionality.' } },
];
// Customers in SPLC = the merchant network (Eats / Uber Direct). They are really SUPPLY for the Eats marketplace.
var SC_CUSTOMERS = [
  { h:'Restaurants', tag:'QSR → casual dining',
    role:'List menus on Eats; Uber delivers and takes a fee.',
    players:[['McDonald’s','mcdonalds.com'],['Domino’s','dominos.com'],['Chipotle','chipotle.com'],['Darden','darden.com'],['Little Caesars','littlecaesars.com']],
    impact:{ kind:'good', text:'Core Eats supply — Uber keeps ~<b>19%</b> + ads. No single chain is material, so pricing power sits with Uber.' } },
  { h:'Grocery & Retail', tag:'fastest-growing',
    role:'Stock Eats / Uber Direct with groceries and big-box goods.',
    players:[['Costco','costco.com'],['Kroger','kroger.com'],['Albertsons','albertsons.com'],['Carrefour','carrefour.com'],['Coles','coles.com.au'],['Best Buy','bestbuy.com']],
    impact:{ kind:'good', text:'The fastest-growing piece (~<b>$12B run-rate</b>) — bigger baskets, higher frequency, 5 of the top-10 US grocers on platform.' } },
  { h:'International & Notable', tag:'global + partners',
    role:'Extend the merchant network globally, plus partnerships (Instacart, airlines).',
    players:[['FEMSA','femsa.com','FMX'],['Rakuten','rakuten.com','RKUNY'],['Cencosud','cencosud.com'],['Loblaw','loblaw.ca'],['Instacart','instacart.com','CART'],['Delta','delta.com','DAL']],
    impact:{ kind:'mixed', text:'Broadens reach into emerging markets (cheaper baskets, lower take in $). The <b>Instacart (Maplebear)</b> tie-up adds suburban demand with ~20% larger baskets.' } },
];
// Color logo chip. Primary = parqet-by-ticker when a ticker is given (most reliable, CSP-allowed),
// else Clearbit by domain; falls back through Clearbit then a Google favicon. p = [name, domain, ticker?].
function scLogo(name,domain,ticker){
  var primary = ticker ? 'https://assets.parqet.com/logos/symbol/'+ticker : 'https://logo.clearbit.com/'+domain;
  var fav = 'https://www.google.com/s2/favicons?domain='+domain+'&sz=64';
  var clear = 'https://logo.clearbit.com/'+domain;
  // primary -> clearbit -> favicon
  var onerr = "this.onerror=function(){this.onerror=null;this.src='"+fav+"'};this.src='"+clear+"'";
  return '<div class="usc-logo" title="'+esc(name)+'"><img src="'+primary+'" alt="'+esc(name)+'" loading="lazy" onerror="'+onerr+'"></div>';
}
function scCard(g){
  var imp=g.impact?'<div class="usc-imp usc-imp-'+g.impact.kind+'"><b>'+(g.impact.kind==='mixed'?'For Uber ⚠':'For Uber ✓')+'</b> '+g.impact.text+'</div>':'';
  var role=g.role?'<div class="usc-role"><b>What they do —</b> '+esc(g.role)+'</div>':'';
  return '<div class="usc-card'+(g.big?' usc-card-wide':'')+'">'+
    '<div class="usc-card-h">'+esc(g.h)+(g.tag?'<span class="usc-tag">'+esc(g.tag)+'</span>':'')+'</div>'+
    role+
    '<div class="usc-logos">'+g.players.map(function(p){ return scLogo(p[0],p[1],p[2]); }).join('')+'</div>'+
    imp+
  '</div>';
}
// ─── Earnings Narrative: theme-based across 10 calls (Q4 2023 → Q1 2026) ────
var UB_THEMES = [
  { theme:'Autonomous Vehicles \u2014 The Hybrid Network',
    why:'The most debated topic in Uber\u2019s investment case: how AVs go from cool tech to scaled business, and why Uber believes it wins either way.',
    updates:[
      { q:'Q4 2023', items:['AV commercialization will take "significantly longer" than the tech itself. Five factors needed: <b>regulation, superhuman safety, cost-effective hardware, fleet ops, high-utilization network</b>.','Uber positions as "indispensable partner" for AV players. Nine AV companies mentioned. Austin/Atlanta launches planned with Waymo.'] },
      { q:'Q2 2024', items:['3P utilization "significantly higher" than 1P standalone. Uber dispatch selects routes where AVs will succeed. <b>14 AV partners</b>.','AV not expected to generate substantial profits "for 5\u201310 years" \u2014 treated as another growth bet funded by the barbell.'] },
      { q:'Q1 2025', items:['Austin live with ~100 Waymos \u2014 average Waymo <b>busier than 99% of Austin drivers</b>. "Exceptional utilization." High opt-in rates, premium pricing possible.','Five new AV partnerships announced (Waymo expansion, WeRide, May Mobility, VW/Momenta, Avride).'] },
      { q:'Q2 2025', items:['Atlanta launched. <b>Nuro-Lucid deal</b>: 20K vehicle commitment. Three business models outlined: merchant (fixed $/day), agency (rev share), owned+licensed.','$20B buyback authorized alongside AV investment \u2014 "not an either-or."'] },
      { q:'Q3 2025', items:['<b>NVIDIA partnership</b>: Hyperion reference architecture for L4; 3M+ hours real-world data collection planned.','Stellantis deal (initial 5K vehicles). AV trips in Austin/Atlanta: growth >2\u00d7 rest of US. Driver earnings UP in AV markets.','Six strategic focus areas formalized; AV as "building a hybrid future."'] },
      { q:'Q4 2025', items:['<b>30+ AV partners</b> across mobility and delivery. On track for <b>15 cities by year-end 2026</b>.','Waymo valued at $110B pre-money. Uber category position in SF and LA <b>higher</b> than 6 months ago despite Waymo presence.','Santander financing deal; Hertz fleet management; Marsh/Apollo insurance. "Financializing the ecosystem like hotel REITs."'] },
      { q:'Q1 2026', items:['AV mobility trips <b>>10\u00d7 YoY</b>. <b>Uber Autonomous Solutions</b> launched \u2014 technical + operational infra for partners.','Zoox added as partner. "No effect of Waymo launches on our overall business" \u2014 US mobility actually accelerated.','Santander deal: "line of sight to financing AV fleets" with predictable revenue per vehicle per day on Uber\u2019s network.'] },
    ]},
  { theme:'Uber One & the Membership Flywheel',
    why:'From 19M to 50M+ members in two years \u2014 the retention and cross-sell engine that competitors can\u2019t replicate.',
    updates:[
      { q:'Q4 2023', items:['19M members. ~45% of delivery GBs from members. Members spend <b>3.4\u00d7 more</b> per month. Annual Pass rollout improving retention ~200bps.'] },
      { q:'Q1 2024', items:['22M members. Subscription revenue <b>>$1B run rate</b>. 25% of Uber Cash earned on mobility redeemed on delivery (up from mid-teens). Cross-platform upsell engine working.'] },
      { q:'Q2 2024', items:['25M members, <b>+70% YoY</b>. >50% of delivery GBs. New benefits: no-fee grocery above $60 basket, global benefits for travelers.'] },
      { q:'Q4 2024', items:['<b>30M members, +60% YoY</b>. 5M added in Q4 alone. Multi-product use at all-time high: 37% of consumers using >1 Uber product.'] },
      { q:'Q2 2025', items:['<b>36M members, +60% YoY</b>. Surge savings launched for mobility \u2014 "the #1 product mobility consumers asked for." Mobility membership penetration still early vs delivery.'] },
      { q:'Q3 2025', items:['46M members. <b>>50% of gross bookings</b> from members. Retention rates improving even as base grows. Now in 42 countries (vs 28 a year ago). Member Days driving savings.'] },
      { q:'Q1 2026', items:['<b>50M+ members, +50% YoY</b>. Added 20M in a single year. Hotels: 10% Uber credits + 20% off at 10K properties. Global benefits now work internationally.','Members: 3\u00d7 higher spend, higher retention, >50% of bookings. "Don\u2019t see it slowing down."'] },
    ]},
  { theme:'The Barbell Strategy',
    why:'How Uber funds growth bets (low-cost products, AV) with premium margins \u2014 and why it keeps the TAM expanding.',
    updates:[
      { q:'Q2 2024', items:['Moto (two-wheelers): <b>>$1.5B GBs, +40%</b>. Premium: >$10B, +35%. Reserve: +60%.','Growth bets portfolio: $11B+ annual GBs, growing 80% \u2014 taxi, two-wheelers, three-wheelers, Share, Reserve.'] },
      { q:'Q3 2024', items:['Teens trips doubled. Shuttle expanding. U4B (business) >50% CC growth. Insurance cost increases causing elasticity in core \u2014 barbell products offset.'] },
      { q:'Q4 2024', items:['Barbell formally named. Low-cost: <b>75% higher frequency</b> than core. Premium: <b>3.5\u00d7 higher profit</b> growth. Both: <b>25% lift in first-time acquisition</b>.'] },
      { q:'Q1 2025', items:['Wait & Save strong in sparse markets. Reserve: 40% of trips now non-travel. Sparse markets = 20% of mobility trips, growing 1.5\u00d7 faster.'] },
      { q:'Q3 2025', items:['Growth bets now <b>$20B annual GBs, +80%</b>. Grocery/retail at $12B run rate. Sparse markets growing 2\u00d7 faster than dense markets globally.'] },
      { q:'Q1 2026', items:['Low-cost + premium growing <b>40% combined</b> in 2025. Both wings driving 25% lift in new-user acquisition.','AV treated as the newest "growth bet" \u2014 same barbell playbook: invest at negative margins, build liquidity, then turn profitable.'] },
    ]},
  { theme:'Insurance Reform & US Mobility Acceleration',
    why:'The multi-year headwind that became a tailwind \u2014 and why US mobility is expected to accelerate in 2026.',
    updates:[
      { q:'Q3 2024', items:['CPI motor vehicle insurance up 16% YoY (Sep) \u2014 moderating from 20%+ peak in Apr. Passing costs to consumers causing elasticity.','Three-pronged approach: <b>tech</b> (driver insights dashboard), <b>risk mgmt</b> (captive insurer), <b>regulatory</b> (state-by-state reform).'] },
      { q:'Q4 2024', items:['Insurance CPI down to 11% (Dec). Georgia tort reform bill awaiting signature. California UM/UIM limits reduced from $1M to $60K/$300K. Advantage Mode rewards safe drivers.'] },
      { q:'Q1 2025', items:['Insurance CPI at <b>7% YoY (Mar)</b> \u2014 lowest in 3 years. "Hundreds of millions of savings" expected for 2025. Passing savings to consumers \u2192 trip growth accelerating.'] },
      { q:'Q2 2025', items:['July trip growth accelerating vs Q2. "Delayed elasticity" showing up: lower prices \u2192 more sessions \u2192 more return visits weeks later.'] },
      { q:'Q3 2025', items:['Advantage Mode expanded. >$100M in savings from tech + policy initiatives. California wins legislated. Phoenix/Austin/Atlanta trip growth <b>>2\u00d7 rest of US</b>.'] },
      { q:'Q4 2025', items:['Insurance going from <b>"deleveraging to leverage"</b> for first time since COVID. Auto renewals improved in March. Offloading more risk to 3rd-party carriers. US acceleration confirmed.'] },
      { q:'Q1 2026', items:['L.A. trip growth "significantly better than California and rest of country." Category position in SF and LA <b>higher than 6 months ago</b>.','Even more confident than in December: US mobility will keep accelerating through 2026.'] },
    ]},
  { theme:'Delivery & Grocery Acceleration',
    why:'From "delivery is mature" skepticism to 23% growth and rising margins \u2014 driven by grocery, selection, and the platform flywheel.',
    updates:[
      { q:'Q4 2023', items:['Delivery 17% GB growth (accelerating). Grocery at <b>$7B run rate</b>, growing 40%+. 14% of Eats users ordering grocery.'] },
      { q:'Q1 2024', items:['Delivery 17% CC growth. Grocery now variable contribution positive. Restaurant margins "modestly lower than UberX" \u2014 first time disclosed.'] },
      { q:'Q2 2024', items:['<b>Instacart partnership</b> live: baskets 20% higher, suburban demand. Merchant-funded offers <b>+70% YoY</b>. Record new Eats consumers in US.'] },
      { q:'Q3 2024', items:['Delivery fastest growth in 4 years (4pp acceleration). Grocery/retail <b>>$12B run rate</b>. Selection active merchants +16% YoY.'] },
      { q:'Q4 2024', items:['Delivery accelerating again. Coles exclusive (Australia\u2019s largest grocer). Ads penetration passing 2% target. 5 of top 10 US grocers on platform.'] },
      { q:'Q2 2025', items:['Delivery grew 23%, led by grocery/retail. Toast partnership for seamless restaurant onboarding. Sparse-market delivery growing 1.5\u00d7 dense markets.'] },
      { q:'Q4 2025', items:['UK: <b>#1 delivery position (organic)</b>. Germany: neck-and-neck with top player. 7 new European markets launched. Finland #1 on App Store day one.','Advertising: enterprise ad growth now outpacing SMBs. Grocery/retail ads and mobility ads both expanding.'] },
      { q:'Q1 2026', items:['Delivery +23%. Grocery/retail and strong retention driving growth. Go-Get event: One Search, hotel bookings (700K via Expedia), Travel Mode.'] },
    ]},
  { theme:'Cross-Platform & Capital Allocation',
    why:'The platform thesis: why operating mobility + delivery + freight under one roof creates value no mono-line competitor can match.',
    updates:[
      { q:'Q4 2023', items:['Multi-product users spend <b>3\u00d7 more</b>. 19M Uber One members. "Everything should be made as simple as possible" \u2014 abstracting complexity.'] },
      { q:'Q2 2024', items:['Cross-platform consumers growing <b>1.5\u00d7 faster</b> than overall. $10B delivery GBs from mobility app (12% of annualized delivery). 30% of riders never tried Eats.'] },
      { q:'Q4 2024', items:['Multi-product use at <b>all-time high: 37%</b>. Andrew Macdonald (Mac) as COO to supercharge platform. Delta SkyMiles partnership.','Investment grade achieved. $7B buyback mostly executed. Share count reduction achieved in 2025.'] },
      { q:'Q2 2025', items:['<b>$20B buyback authorized</b>. Mac running both mobility + delivery. Free cash flow on track to reduce share count "by a healthy amount."'] },
      { q:'Q4 2025', items:['40% of Q4 consumers using >2 products. <b>$15B delivery GBs from mobility app</b> (run rate). ~$10B free cash flow, +42%.','Balaji Krishnamurthy becomes CFO (Feb 2026). Prashanth Mahendra-Rajah departs for "opportunity to serve America."'] },
      { q:'Q1 2026', items:['<b>$3B returned to shareholders</b> in Q1 (record). Non-GAAP EPS <b>+44% YoY</b>. Go-Get event showcased hotels, Travel Mode, One Search.','50M Uber One members + 10M drivers/couriers globally \u2014 "important milestones." Freight returned to growth for first time in ~2 years.'] },
    ]},
  { theme:'AI in the Product (emerging)',
    why:'The newest narrative thread \u2014 AI moving from the back-end into consumer- and earner-facing features. Early, but flagged as a multi-year lever to watch.',
    updates:[
      { q:'Q1 2026', items:['<b>Cart Assistant</b> launched \u2014 an AI helper that builds grocery/retail orders for consumers.','AI earner tools for drivers & couriers (smarter dispatch and support).','Management framed AI as a multi-year <b>efficiency + experience lever</b> \u2014 "early innings," something to track rather than a 2026 numbers driver.'] },
    ]},
];

function callsBody(){
  var h='<p class="ov-lede">The key narrative threads from <b>10 earnings calls</b> (Q4 2023 \u2192 Q1 2026) \u2014 organized by <b>theme</b> so you can trace how each story evolved. Tap any theme to expand.</p>';
  h+='<div class="lpb-acc" id="ubCallsAcc">';
  UB_THEMES.forEach(function(ct,i){
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
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Uber Q4 2023\u2013Q1 2026 earnings calls and prepared remarks, cross-checked against full transcripts. Highlights are qualitative and contemporaneous \u2014 written from the perspective of each call, not with hindsight.</div>';
  return h;
}

// ─── The Barbell — Uber grows the two ends and leans away from the middle ─────
// Low-cost = cheap but very frequent; premium = less frequent but far more profitable.
// The "core" (standard UberX) in the middle is deliberately de-emphasized.
var BB_LOW=['UberX Share','Moto · two-wheelers','Three-wheelers · rickshaws','Wait & Save','Transit · Shuttle'];
var BB_PREM=['Uber Black','Uber Reserve','Comfort · Premier','Uber for Business','Hourly · Travel'];
// Uber One headline stats (membership tab).
var UBERONE_STAT=[
  { l:'Members', v:'50M+', s:'+50% YoY (Q1 2026)' },
  { l:'% of bookings', v:'>50%', s:'of combined Mobility+Delivery' },
  { l:'Member spend', v:'~3×', s:'vs non-members' },
  { l:'Countries', v:'42', s:'up from 28 a year earlier' },
];
// Member count over time (millions) — from the earnings calls.
var UBERONE_GROWTH={ labels:['4Q23','1Q24','2Q24','4Q24','2Q25','3Q25','1Q26'], data:[19,22,25,30,36,46,50] };
// Monthly spend per user (Summit deck, Dec 2024) — the gap is the whole thesis.
var UBERONE_SPEND=[ ['Uber One member', 100, '~$192/mo', BRAND2], ['Non-member', 33, '~$64/mo', GRAY] ];
function barbellDiagram(){
  var h='<style>'+
    '.bb2-cap{font-size:12.5px;color:var(--mu);line-height:1.55;margin:0 0 12px}'+
    '.bb2-grid{display:grid;grid-template-columns:1.25fr 0.62fr 1.25fr;gap:10px;align-items:stretch}'+
    '.bb2-col{border:1px solid var(--bdr);border-radius:10px;padding:13px 15px;background:var(--w);display:flex;flex-direction:column}'+
    '.bb2-low{border-top:3px solid #06C167;background:rgba(6,193,103,0.05)}'+
    '.bb2-prem{border-top:3px solid #10141A;background:rgba(16,20,26,0.035)}'+
    '.bb2-core{background:rgba(138,147,160,0.10);align-items:center;text-align:center;justify-content:center}'+
    '.bb2-tag{font-size:11px;font-weight:800;letter-spacing:.05em;color:#06965A}'+
    '.bb2-prem .bb2-tag{color:#10141A}'+
    '.bb2-sub{font-size:11px;color:var(--mu);margin:1px 0 9px}'+
    '.bb2-stat{font-size:24px;font-weight:800;color:var(--navy);line-height:1.1}.bb2-stat span{display:block;font-size:11px;font-weight:600;color:var(--mu);margin-top:2px;line-height:1.4}'+
    '.bb2-chips{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0 9px}'+
    '.bb2-chip{font-size:10.5px;font-weight:600;color:var(--navy);background:#F2F5F8;border:1px solid var(--bdr);border-radius:14px;padding:3px 9px}'+
    '.bb2-buys{font-size:11.5px;color:var(--navy);line-height:1.45;margin-top:auto}'+
    '.bb2-corex{font-size:11px;color:var(--mu);line-height:1.5;margin-top:6px}'+
    '.bb2-flow{font-size:11.5px;font-weight:600;color:var(--navy);background:#EDF0F4;border-radius:8px;padding:10px 14px;margin-top:11px;line-height:1.5;text-align:center}'+
    '@media(max-width:720px){.bb2-grid{grid-template-columns:1fr}}'+
  '</style>';
  // U-shaped "barbell" curve: heavy ends, thin middle. Green = low-cost, black = premium.
  h+='<div class="bb2-cap"><b>The barbell, drawn as the economics.</b> A rival at one price (dashed) captures only the middle. Uber prices at <b>every point on the demand curve</b> — so it also captures the two green wedges a single price leaves on the table: <b>premium riders who would pay more</b> (top-left) and <b>price-sensitive demand only a cheap trip unlocks</b> (bottom-right). One asset-light network, near-zero cost to serve either.</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" role="img" aria-label="Barbell as a demand curve">'+
    '<text x="64" y="50" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">$$$</text>'+
    '<text x="64" y="252" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">$</text>'+
    '<text x="598" y="278" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">trips · volume →</text>'+
    '<path d="M112,62 Q150,78 200,102 Q270,132 330,162 L112,162 Z" fill="rgba(6,193,103,0.13)"/>'+
    '<path d="M330,162 Q390,188 445,205 Q500,222 552,236 L552,162 Z" fill="rgba(6,193,103,0.13)"/>'+
    '<line x1="70" y1="42" x2="70" y2="256" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="70" y1="256" x2="600" y2="256" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="112" y1="162" x2="560" y2="162" stroke="#8A93A0" stroke-width="1.3" stroke-dasharray="5,4"/>'+
    '<text x="290" y="157" font-family="Inter,sans-serif" font-size="9.5" fill="#8A93A0" text-anchor="middle">what a single-price rival captures</text>'+
    '<path d="M112,62 Q150,78 200,102 Q270,132 330,162 Q390,188 445,205 Q500,222 552,236" fill="none" stroke="#10141A" stroke-width="2.5"/>'+
    '<circle cx="112" cy="62" r="6" fill="#10141A"/>'+
    '<text x="120" y="54" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#10141A">Uber Black / Reserve · ~$90</text>'+
    '<circle cx="200" cy="102" r="4" fill="#5A6472"/>'+
    '<circle cx="330" cy="162" r="5" fill="#9AA3AE"/>'+
    '<text x="330" y="181" font-family="Inter,sans-serif" font-size="9.5" fill="#6B7480" text-anchor="middle">standard UberX — the core</text>'+
    '<circle cx="445" cy="205" r="4" fill="#3EA76B"/>'+
    '<circle cx="552" cy="236" r="6" fill="#06C167"/>'+
    '<text x="548" y="250" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#06965A" text-anchor="end">Moto / Share · ~$4</text>'+
    '<text x="150" y="122" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#10141A">PREMIUM END</text>'+
    '<text x="150" y="136" font-family="Inter,sans-serif" font-size="10.5" font-weight="700" fill="#10141A">~3.5× profit growth</text>'+
    '<text x="470" y="188" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#06965A">CHEAP END</text>'+
    '<text x="470" y="202" font-family="Inter,sans-serif" font-size="10.5" font-weight="700" fill="#06965A">~75% more trips</text>'+
  '</svg></div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">'+
    '<div class="bb2-col bb2-prem"><div class="bb2-tag">PREMIUM END · the products</div><div class="bb2-sub">top-left of the curve · wins on margin</div><div class="bb2-chips">'+BB_PREM.map(function(x){return '<span class="bb2-chip">'+esc(x)+'</span>';}).join('')+'</div></div>'+
    '<div class="bb2-col bb2-low"><div class="bb2-tag">CHEAP END · the products</div><div class="bb2-sub">bottom-right of the curve · wins on frequency</div><div class="bb2-chips">'+BB_LOW.map(function(x){return '<span class="bb2-chip">'+esc(x)+'</span>';}).join('')+'</div></div>'+
  '</div>';
  h+='<div class="ov-fynote" style="margin-top:10px">Why a fleet-heavy rival cannot copy it: owning the cars makes cheap trips loss-making, so it is forced to one price and forfeits both ends. Uber grows the two ends instead — combined ~<b>$20B</b> GB, +<b>80%</b>. AV is simply the newest cheap-end entrant.</div>'
  return h;
}

function segParts(){
  function s4(a){ return a.slice(a.length-4).reduce(function(x,y){return x+y;},0); }
  var LA=FIRST_EST-1;
  var mg=A_MOB_GB[LA], dg=A_DEL_GB[LA], fg=A_FRT_GB[LA], tot=mg+dg+fg;
  var mm=s4(MOB_EB_A)/mg*100, dm=s4(DEL_EB_A)/dg*100;
  var SEG=[
    {n:'Mobility',col:MOB,gb:mg,sh:mg/tot*100,mg:mm.toFixed(1)+'%',tag:'profit engine',
     role:'Ridesharing in ~70 countries. Highest take (~<b>30%</b> of bookings) and, at ~<b>8% margin</b>, the bulk of Uber’s profit.'},
    {n:'Delivery',col:DEL,gb:dg,sh:dg/tot*100,mg:dm.toFixed(1)+'%',tag:'scaling engine',
     role:'Uber Eats — food, grocery, retail. Lower take (~<b>19%</b>, merchants paid too), but bookings nearly match Mobility and margin has <b>doubled</b> on ads + scale.'},
    {n:'Freight',col:FRT,gb:fg,sh:fg/tot*100,mg:'~0%',tag:'optionality',
     role:'Logistics brokerage, reported <b>gross</b> (no take rate). Near-breakeven — kept for optionality, not profit.'}
  ];
  var h='<style>'+
    '.usp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:720px){.usp-grid{grid-template-columns:1fr}}'+
    '.usp-c{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:#fff}'+
    '.usp-top{display:flex;align-items:center;justify-content:space-between;gap:8px}'+
    '.usp-n{font-size:14px;font-weight:800;color:var(--navy)}'+
    '.usp-tag{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px}'+
    '.usp-big{font-size:22px;font-weight:800;color:#10141A;margin:8px 0 2px;display:flex;align-items:baseline;gap:7px}.usp-big span{font-size:10.5px;font-weight:700;color:var(--mu)}'+
    '.usp-bar{height:7px;border-radius:4px;background:#EEF2F7;overflow:hidden;margin:7px 0 8px}.usp-bar span{display:block;height:100%}'+
    '.usp-meta{display:flex;justify-content:space-between;gap:8px;font-size:10.5px;color:var(--mu);border-bottom:1px dashed var(--bdr);padding-bottom:8px;margin-bottom:8px}.usp-meta b{color:var(--navy);font-weight:800;font-size:12px}'+
    '.usp-role{font-size:11.5px;color:var(--navy);line-height:1.5}.usp-role b{font-weight:800}'+
  '</style>';
  h+='<div class="usp-grid">'+SEG.map(function(g){
    return '<div class="usp-c" style="border-top:3px solid '+g.col+'">'+
      '<div class="usp-top"><span class="usp-n">'+g.n+'</span><span class="usp-tag" style="background:'+g.col+'">'+g.tag+'</span></div>'+
      '<div class="usp-big">~$'+Math.round(g.gb/1000)+'B<span>FY2025 bookings</span></div>'+
      '<div class="usp-bar"><span style="width:'+g.sh.toFixed(0)+'%;background:'+g.col+'"></span></div>'+
      '<div class="usp-meta"><span>share of GB<br><b>'+g.sh.toFixed(0)+'%</b></span><span style="text-align:right">segment EBITDA margin<br><b>'+g.mg+'</b></span></div>'+
      '<div class="usp-role">'+g.role+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:11px">Mobility and Delivery are now <b>near-equal in size</b> — but Mobility still carries the profit (~2× the margin). Open the <b>Mobility</b> and <b>Delivery</b> tabs for each engine’s economics; <b>Uber One</b> binds them; Freight is optionality. <span class="ave-subh-note">FY2025 actuals — last full reported year.</span></div>';
  return h;
}
function overviewBody(c){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="ubLive" hidden></div>';
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+FY_NOTE+'</div>';
  h+='<style>.utn{border:1px solid var(--bdr);border-radius:14px;padding:16px 18px;margin:8px 0 4px;background:linear-gradient(180deg,rgba(6,193,103,0.05),transparent)}'+
    '.utn-big{font-size:16px;font-weight:900;color:var(--navy);letter-spacing:-.2px}'+
    '.utn-prog{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:12px 0}'+
    '.utn-step{flex:1;min-width:118px;text-align:center;border:1px solid var(--bdr);border-radius:10px;padding:11px 8px}'+
    '.utn-sv{font-size:22px;font-weight:900;line-height:1}.utn-sl{font-size:10px;color:var(--mu);font-weight:700;margin-top:4px}'+
    '.utn-ar{color:#06C167;font-weight:900;font-size:20px}'+
    '.utn-row{display:flex;flex-wrap:wrap;gap:8px}.utn-chip{font-size:11px;font-weight:700;color:var(--navy);background:rgba(6,193,103,0.08);border-radius:20px;padding:3px 11px}'+
    '.utn-note{font-size:11px;color:var(--mu);margin-top:9px;line-height:1.5}</style>';
  h+='<div class="utn"><div class="utn-big">From cash-burner to cash machine — one of tech’s great turnarounds</div>'+
    '<div class="utn-prog">'+
      '<div class="utn-step"><div class="utn-sv" style="color:#C0392B">−$3.5B</div><div class="utn-sl">GAAP operating loss · 2021</div></div>'+
      '<span class="utn-ar">→</span>'+
      '<div class="utn-step"><div class="utn-sv" style="color:#06965A">+$5.6B</div><div class="utn-sl">GAAP operating income · 2025</div></div>'+
      '<span class="utn-ar">→</span>'+
      '<div class="utn-step"><div class="utn-sv" style="color:#06965A">$9.8B</div><div class="utn-sl">free cash flow · 2025 (+42%)</div></div>'+
    '</div>'+
    '<div class="utn-row"><span class="utn-chip">Q2 2023: first-ever GAAP operating profit</span><span class="utn-chip">Investment-grade rated</span><span class="utn-chip">$20B buyback</span><span class="utn-chip">~$10B cumulative FCF</span></div>'+
    '<div class="utn-note">After ~14 years of losses, Uber flipped — and cash now compounds far faster than bookings. (The engine behind it, and the debate over the insurance float, live in the <b>Insurance &amp; FCF</b> tab.)</div></div>';
  h+=sec('What Truly Drives Uber — the things that matter most',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">If you read nothing else: these five levers explain the business. <b>Tap any card.</b></div>'+
    '<div class="ov-drivers">'+KEY_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="key:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FRT+'"></span>Freight</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings by segment <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartEbitda"></canvas></div></div>'+
  '</div>';
  h+=sec('The Business in Three Parts', segParts());
  h+=sec('3-Year Targets — Investor Day (Feb 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:14px">Uber is <b>running ahead of all three</b> — bookings ~+20%/yr while free cash flow compounds far faster.</div>');
  h+=sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>');
  h+=sec('M&A — what each deal changed in the financials', mnaTimeline());
  h+=sec('Peers & Competitive Landscape',
    '<style>.ucomp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:2px 0 6px}.ucomp-card{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}.ucomp-top{display:flex;align-items:center;gap:11px;margin-bottom:9px}.ucomp-logo{width:34px;height:34px;border-radius:8px;border:1px solid var(--bdr);background:#fff;object-fit:contain;padding:5px;flex:none}.ucomp-n{font-size:14px;font-weight:800;color:var(--navy);line-height:1.2}.ucomp-arena{font-size:11px;color:var(--mu);font-weight:600;margin-top:2px}.ucomp-edge{font-size:12px;color:var(--mu);line-height:1.5}.ucomp-edge b{color:var(--navy)}@media(max-width:720px){.ucomp-grid{grid-template-columns:1fr}}</style>'+
    '<div class="ucomp-grid">'+PEERS.map(function(p){ return '<div class="ucomp-card"><div class="ucomp-top"><img class="ucomp-logo" src="https://logo.clearbit.com/'+p.dom+'" alt="'+esc(p.n)+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+p.dom+'&sz=64\'"><div><div class="ucomp-n">'+esc(p.n)+'</div><div class="ucomp-arena">'+esc(p.arena)+'</div></div></div><div class="ucomp-edge"><b>Uber’s edge —</b> '+p.edge+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ─── Pane: Mobility (the rides business) ─────────────────────────────────────
function mobilityBody(c){
  var h='<style>'+
    '.usc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0 8px}'+
    '.usc-card{background:var(--w);border:1px solid var(--bdr);border-radius:10px;padding:14px 16px}'+
    '.usc-card-wide{grid-column:1 / -1;border-top:3px solid var(--brand-2)}'+
    '.usc-card-h{font-size:13px;font-weight:800;color:var(--navy);margin-bottom:7px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.usc-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:12px;padding:2px 8px}'+
    '.usc-role{font-size:12px;color:var(--mu);line-height:1.5;margin-bottom:9px}.usc-role b{color:var(--navy)}'+
    '.usc-logos{display:flex;flex-wrap:wrap;gap:8px}'+
    '.usc-logo{width:92px;height:42px;border:1px solid var(--bdr);border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;padding:7px;transition:border-color .15s,box-shadow .15s}'+
    '.usc-logo:hover{border-color:var(--brand);box-shadow:0 2px 8px rgba(0,0,0,.07)}'+
    '.usc-logo img{max-width:100%;max-height:100%;object-fit:contain}'+
    '.usc-imp{font-size:11.5px;line-height:1.5;margin-top:11px;padding:8px 11px;border-radius:8px}.usc-imp b{font-weight:700}'+
    '.usc-imp-good{background:rgba(6,193,103,0.08);border:1px solid rgba(6,193,103,0.28);color:var(--navy)}.usc-imp-good b{color:#06965A}'+
    '.usc-imp-mixed{background:rgba(232,160,12,0.09);border:1px solid rgba(232,160,12,0.32);color:var(--navy)}.usc-imp-mixed b{color:#B7791F}'+
    '.ir-phases{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:8px 0 2px}'+
    '.ir-phase{border:1px solid var(--bdr);border-radius:10px;padding:13px 15px;background:var(--w)}'+
    '.ir-phase-y{font-size:11px;font-weight:700;color:var(--mu)}'+
    '.ir-phase-b{display:inline-block;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border-radius:12px;padding:2px 9px;margin:6px 0 8px}'+
    '.ir-b-crutch{background:rgba(192,57,43,.10);color:#C0392B}.ir-b-head{background:rgba(232,160,12,.13);color:#B7791F}.ir-b-tail{background:rgba(6,193,103,.13);color:#06965A}.ir-b-mut{background:var(--surface);color:var(--mu)}'+
    '.ir-phase-d{font-size:12px;color:var(--mu);line-height:1.5}.ir-phase-d b{color:var(--navy)}'+
    '.ir-reg{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
    '.ir-reg-card{border:1px solid var(--bdr);border-left:3px solid var(--brand);border-radius:10px;padding:13px 15px;background:var(--w)}'+
    '.ir-reg-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:6px;display:flex;gap:7px;align-items:center;flex-wrap:wrap}'+
    '.ir-reg-chip{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;border-radius:10px;padding:2px 8px}'+
    '.ir-reg-d{font-size:11.5px;color:var(--mu);line-height:1.5}.ir-reg-d b{color:var(--navy)}'+
    '@media(max-width:720px){.usc-grid,.ir-phases,.ir-reg{grid-template-columns:1fr}}'+
  '</style>';
  h+='<p class="ov-lede"><b>Mobility</b> — ridesharing in ~70 countries, Uber’s profit engine (~<b>$97B</b> gross bookings FY2025). <b>Where it came from:</b> the post-COVID recovery doubled trips from the 2020 trough. <b>Where it’s going:</b> the barbell (low-cost + premium), insurance savings, and AV as hybrid supply. <b>Why believe:</b> the Model vs. Reality tab shows Uber consistently beating its own Mobility-GB estimates, take rate holding ~30%, and US trip growth <i>accelerating</i> as insurance costs fall.</p>';
  h+=sec('The Barbell — grow both ends, lean away from the middle', barbellDiagram());
  h+=sec('How a Trip Makes Money — one $10 ride',
    '<style>.ov-chain-img{height:78px;margin-bottom:8px;border-radius:8px;overflow:hidden;background:#eef2f7}.ov-chain-img img{width:100%;height:100%;object-fit:cover;display:block}.ov-gal-img{width:100%;height:300px;object-fit:cover;border-radius:10px;display:block;background:#eef2f7}.ov-gal-cap{font-size:12.5px;color:var(--navy);line-height:1.6;margin:12px 0}.ov-gal-nav{display:flex;align-items:center;justify-content:space-between;gap:12px}.ov-gal-btn{font-size:22px;font-weight:800;line-height:1;border:1px solid var(--bdr);background:#fff;border-radius:8px;min-width:46px;height:40px;cursor:pointer;color:var(--navy)}.ov-gal-btn:hover{background:#10141A;color:#fff;border-color:#10141A}.ov-gal-count{font-size:11px;color:var(--mu);font-weight:700}</style><p class="ov-lede" style="margin:0 0 12px">Six steps of a Mobility trip — <b>tap any step for a photo + the detail</b>, then use ‹ › to move through the trip. Below: where the $10 lands.</p>'+
    chain(TRIP_FLOW,'trip',true)+
    '<div class="ov-grid2" style="margin-top:18px"><div><div class="ov-subh">Where every $10 goes</div>'+mbars(TRIP_SPLIT)+'</div><div><div class="ov-subh">…and Uber’s ~$3.00 take</div>'+mbars(TRIP_TAKE)+'</div></div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>~$0.75 of every $10 trip converts to cash</b> (incl. the ~$0.35 Aleka insurance float). <span class="ave-subh-note">Illustrative — Summit deck, Dec 2024.</span></div>');
  h+=sec('Take Rate',
    '<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span></div>'+
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartTake"></canvas></div>'+
    '<div class="ov-fynote" style="margin-top:10px">Mobility take held ~30% until the 1Q26 dip to ~25.8% — a <span class="ov-clickable" data-detail="note:take" style="color:#06C167;font-weight:600;cursor:pointer">UK accounting artifact ›</span>, not real compression.</div>');
  h+=sec('Autonomous Vehicles — Partner or Threat?',
    '<style>'+
      '.av-vs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0 4px}'+
      '.av-col{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}'+
      '.av-bad{border-top:3px solid #C0392B}.av-good{border-top:3px solid #06C167;background:var(--surface)}'+
      '.av-col-h{font-size:13px;font-weight:800;color:var(--navy)}'+
      '.av-col-s{font-size:11px;color:var(--mu);margin:2px 0 10px}'+
      '.av-li{font-size:12px;color:var(--navy);line-height:1.45;padding:6px 0;border-top:1px solid var(--bdr);display:flex;gap:7px}'+
      '.av-li:first-of-type{border-top:none}.av-li b{font-weight:700}'+
      '.av-li .av-k{color:var(--mu);min-width:70px;flex:none;font-weight:600}'+
      '@media(max-width:720px){.av-vs{grid-template-columns:1fr}}'+
    '</style>'+
    '<div class="ov-callout"><div class="ov-tl-body"><b>The question that hit the multiple.</b> When Tesla and other AV players unveiled robotaxi launches, UBER’s multiple <b>compressed</b> — the market feared autonomy would disintermediate the platform. Uber’s answer in every call: the future is <b>hybrid</b> (human + AV), and Uber is the demand layer for it.</div></div>'+
    '<div class="av-vs">'+
      '<div class="av-col av-bad"><div class="av-col-h">Own the robotaxi fleet</div><div class="av-col-s">Tesla · Waymo on its own app</div>'+
        '<div class="av-li"><span class="av-k">Cars</span><span>bought & maintained by <b>one company</b></span></div>'+
        '<div class="av-li"><span class="av-k">Capex</span><span><b>Heavy</b> — a balance-sheet sink</span></div>'+
        '<div class="av-li"><span class="av-k">Margins</span><span><b>Lower</b> — fleet, depot, insurance costs</span></div>'+
        '<div class="av-li"><span class="av-k">Scale</span><span>city-by-city, gated by capital</span></div>'+
      '</div>'+
      '<div class="av-col av-good"><div class="av-col-h">Aggregate the demand — Uber</div><div class="av-col-s">30+ AV partners · cars Uber doesn’t own</div>'+
        '<div class="av-li"><span class="av-k">Cars</span><span><b>millions</b> Uber doesn’t own (incl. AV partners)</span></div>'+
        '<div class="av-li"><span class="av-k">Capex</span><span><b>Asset-light</b> → ~100% FCF conversion</span></div>'+
        '<div class="av-li"><span class="av-k">Margins</span><span><b>Higher</b> — marketplace take, no fleet</span></div>'+
        '<div class="av-li"><span class="av-k">Scale</span><span>instant via existing demand; hedged across partners</span></div>'+
      '</div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>Evidence it’s working:</b> AV mobility trips <b>>10× YoY</b> (Q1 2026), 30+ partners, 15+ cities targeted by end-2026, ~30% higher trips/vehicle on Uber-managed AV vs AV-only — and management reports <b>"no effect of the Waymo launches on our overall business."</b></div>');
  h+=sec('Who Powers Mobility — the supplier ecosystem',
    '<style>.alp{display:flex;align-items:center;gap:16px;background:rgba(6,193,103,0.07);border:1px solid rgba(6,193,103,0.25);border-radius:12px;padding:14px 18px;margin:0 0 12px}.alp-big{font-size:34px;font-weight:800;color:#06965A;line-height:1;flex:none}.alp-txt{font-size:12.5px;color:var(--navy);line-height:1.5}.alp-txt b{font-weight:800}@media(max-width:560px){.alp{flex-direction:column;align-items:flex-start;gap:6px}}</style><div class="alp"><div class="alp-big">0.11%</div><div class="alp-txt">of Uber’s ~<b>$193B</b> gross bookings is <b>disclosed supplier spend</b> — ~<b>$210M</b> across 138 suppliers, and only three carry any dollar value (HCL $127M, Oracle $55M, Alexandria $28M). <b>Uber does not run a supply chain; it aggregates one.</b></div></div>'+'<div class="ov-diagram-cap" style="margin:0 0 10px">Uber’s supplier base sorted by <b>what they do</b> for the platform. Most are strategic ties, not traditional vendor contracts — which is itself the asset-light thesis in data form.</div>'+
    '<div class="usc-grid">'+SC_SUPPLIERS.map(scCard).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>The asset-light proof in the data:</b> of 138 identified suppliers, only <b>three carry disclosed dollar values</b> — HCL ($127M, engineering), Oracle ($55M, cloud), Alexandria RE ($28M, offices). Total ~<b>$210M</b> against ~<b>$193B</b> of gross bookings — a ratio that screams platform, not operator. (Of the 30+ AV partners, only ~<b>5–7</b> have real money committed; the rest are MOUs.) <span class="ave-subh-note">Bloomberg SPLC, 29-Jun-2026.</span></div>');
  h+=sec('Insurance', '<div class="ov-callout">Insurance is central to Uber&rsquo;s cash story — <b>Aleka</b> (Uber&rsquo;s captive), the <b>~$12.9B reserve float</b>, and the crutch → tailwind turnaround now live in the dedicated <b>Insurance & FCF</b> tab. On a Mobility trip it is the largest cost — and the float adds ~<b>$0.35 of every $10</b> to cash (shown above).</div>');
  h+=sec('Regulation & Driver Classification', '<div class="ir-diagram-cap" style="font-size:12px;color:var(--mu);margin:0 0 8px">The core question — <b>do drivers stay contractors?</b> — is largely settled in Uber\u2019s favor. Tap any card for the detail.</div><div class="ir-reg">'+REGV.map(function(r,i){return regCard(r,i);}).join('')+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ─── Pane: Insurance & Regulation (the two genuinely-unique deep topics) ─────
// (Flywheel, Uber One, take-rate & emerging/FX moved to driver cards / Supply Chain /
//  a tap-modal — this tab is no longer a grab-bag.)
var REGV=[
  { h:'US — classification de-risked', chip:'DE-RISKED', cls:'ir-b-tail',
    teaser:'Prop 22 upheld; the model is <b>contractor + pay floor</b>, not reclassification.',
    d:'<b>Prop 22 upheld</b> by the CA Supreme Court (2024); the federal contractor rule is unenforced & proposed for rescission. The dominant model is "<b>contractor + pay floor</b>" (MA, MN, NYC, Seattle), not reclassification.' },
  { h:'International — mixed, trending favorable', chip:'MIXED', cls:'ir-b-head',
    teaser:'UK = "workers"; NL & FR reversed pro-contractor. <b>EU Directive</b> is the open risk.',
    d:'UK drivers are "workers" since <i>Aslam</i> (2021) plus a lost VAT fight; but Netherlands & France delivered pro-contractor reversals. The <b>EU Platform Work Directive</b> (transpose by Dec 2026) is the key open risk.' },
  { h:'How Uber frames it', chip:'FRAMING', cls:'ir-b-mut',
    teaser:'Its own 10-K says a reclassification loss would be <b>"not material."</b>',
    d:'The 10-K says reclassification "would require us to fundamentally change our business model" — but, unlike some peers, it affirmatively states the reasonably-possible loss would <b>not be material</b>.' },
  { h:'Other drags', chip:'MINOR', cls:'ir-b-mut',
    teaser:'NYC congestion pricing, a Dutch GDPR fine, an FTC case — cost/PR, not existential.',
    d:'NYC congestion pricing ($1.50/trip); a Dutch GDPR fine (€290M, under appeal); an FTC case on Uber One cancellation flows. Cost/PR drags, not existential.' },
];
function irPhase(p,bcls,blabel){ return '<div class="ir-phase"><div class="ir-phase-y">'+esc(p.y)+'</div><div class="ir-phase-b ir-b-'+bcls+'">'+blabel+'</div><div class="ir-phase-d">'+p.t+'</div></div>'; }
function regCard(r,i){ return '<div class="ir-reg-card ov-clickable" data-detail="reg:'+i+'"><div class="ir-reg-h">'+esc(r.h)+'<span class="ir-reg-chip '+r.cls+'">'+esc(r.chip)+'</span></div><div class="ir-reg-d">'+r.teaser+' <span class="alk-more">tap \u203a</span></div></div>'; }
function deliveryBody(c){
  var h='';
  h+='<style>.ued-hero{border:1px solid var(--bdr);border-left:3px solid '+DEL+';border-radius:12px;padding:14px 16px;margin:0 0 14px;background:linear-gradient(180deg,rgba(0,0,0,0.015),transparent)}'+
    '.ued-big{font-size:16px;font-weight:900;color:var(--navy);letter-spacing:-.2px}'+
    '.ued-sub{font-size:12.5px;color:var(--navy);line-height:1.55;margin-top:5px}.ued-sub b{font-weight:800}'+
    '.ued-prog{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}'+
    '.ued-step{flex:1;min-width:88px;text-align:center;border:1px solid var(--bdr);border-radius:9px;padding:8px 6px}'+
    '.ued-step.now{border-color:'+DEL+';background:rgba(0,0,0,0.02)}'+
    '.ued-sv{font-size:18px;font-weight:900;line-height:1}.ued-sl{font-size:9.5px;color:var(--mu);font-weight:700;margin-top:3px}'+
    '.ued-ar{color:#C4CCD6;font-weight:800;font-size:16px}</style>';
  h+='<div class="ued-hero"><div class="ued-big">The “pandemic fad” that became a profit engine</div>'+
    '<div class="ued-sub">Uber Eats (~<b>$91B</b> gross bookings) was written off as transient. Instead its Adj. EBITDA margin <b>more than doubled</b>, and a <b>&gt;$2B advertising layer</b> at ~100% margin is pulling it toward Mobility’s level — <b>without touching the merchant split</b>. The same app that hails your ride now feeds you.</div>'+
    '<div class="ued-prog">'+
      '<div class="ued-step"><div class="ued-sv" style="color:#C0392B">1.9%</div><div class="ued-sl">margin · ~2021</div></div>'+
      '<span class="ued-ar">›</span>'+
      '<div class="ued-step now"><div class="ued-sv" style="color:'+DEL+'">4.0%</div><div class="ued-sl">margin · now</div></div>'+
      '<span class="ued-ar">›</span>'+
      '<div class="ued-step"><div class="ued-sv" style="color:#06965A">~8%</div><div class="ued-sl">Mobility-level target</div></div>'+
    '</div></div>';
  h+=sec('Margin Convergence — the Delivery story',
    '<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span></div>'+
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMargin"></canvas></div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>Delivery margin has more than doubled</b> (~1.9%→4.0% of bookings) toward Mobility’s ~8%, on advertising + scale — the heart of the margin-expansion story. (Adj. EBITDA basis ends 4Q25.)</div>');
  h+=sec('Grocery & Advertising — the two growth engines',
    '<style>.ueg-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:600px){.ueg-two{grid-template-columns:1fr}}'+
    '.ueg-c{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:#fff}'+
    '.ueg-h{font-size:12px;font-weight:800;color:var(--navy)}'+
    '.ueg-big{font-size:23px;font-weight:800;color:#10141A;margin:4px 0;display:flex;align-items:baseline;gap:8px}.ueg-big span{font-size:11px;font-weight:700;color:var(--mu)}'+
    '.ueg-bar{height:7px;border-radius:4px;background:#EEF2F7;overflow:hidden;margin:6px 0 8px}.ueg-bar span{display:block;height:100%}'+
    '.ueg-d{font-size:11.5px;color:var(--navy);line-height:1.5}.ueg-d b{font-weight:800}</style>'+
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Two engines lift Delivery’s take <b>without touching the driver or merchant split</b> — the whole point of the margin story.</div>'+
    '<div class="ueg-two">'+
      '<div class="ueg-c"><div class="ueg-h">Grocery & retail — grows the volume</div><div class="ueg-big">~$12B<span>run-rate bookings</span></div>'+
        '<div class="ueg-bar"><span style="width:100%;background:#06C167"></span></div>'+
        '<div class="ueg-d">Bigger baskets, higher frequency; <b>5 of the top-10 US grocers</b> on platform. Expands the pie Delivery earns on.</div></div>'+
      '<div class="ueg-c"><div class="ueg-h">Advertising — grows the margin</div><div class="ueg-big">&gt;$2B<span>run-rate · +50% YoY</span></div>'+
        '<div class="ueg-bar"><span style="width:17%;background:#FF7009"></span></div>'+
        '<div class="ueg-d"><b>~100% incremental margin</b> — pure take-rate lift stacked on the existing marketplace, split untouched.</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Bars are relative run-rate. Grocery grows the <b>volume</b>; advertising grows the <b>margin on that volume</b> — together, why Delivery take keeps rising.</div>');
  h+=sec('The Merchant Network',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">No single merchant is material — the <b>breadth</b> is the moat, and the take/ads sit with Uber. Hover a logo for the name.</div>'+
    '<div class="usc-grid">'+SC_CUSTOMERS.map(scCard).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>The opportunity:</b> Bloomberg SPLC puts Uber\'s merchant base at ~<b>77% US</b> vs ~60%-international mobility bookings — Delivery has barely gone global, and that international whitespace is the runway. <span class="ave-subh-note">Bloomberg SPLC, 29-Jun-2026.</span></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ─── Pane: Uber One (membership + the cross-sell flywheel) ───────────────────
function uberOnePricing(){
  var x0=55,x1=600,pmax=10.5;
  function xf(p){ return (x0+(p/pmax)*(x1-x0)); }
  function tk(x){ return x.toFixed(1); }
  function dot(p,name,side){
    var x=xf(p), ly=side>0?106:152, vy=side>0?92:166;
    var end=(p>9)?' text-anchor="end"':' text-anchor="middle"';
    var lx=(p>9)?(x+8):x;
    return '<circle cx="'+tk(x)+'" cy="130" r="4.5" fill="#10141A"/>'+
      '<line x1="'+tk(x)+'" y1="130" x2="'+tk(x)+'" y2="'+(side>0?113:147)+'" stroke="#B8C0CA" stroke-width="1"/>'+
      '<text x="'+tk(lx)+'" y="'+ly+'" font-family="Inter,sans-serif" font-size="9.5" font-weight="700" fill="#3A4552"'+end+'>'+name+'</text>'+
      '<text x="'+tk(lx)+'" y="'+vy+'" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#10141A"'+end+'>$'+p.toFixed(2)+'</text>';
  }
  var h='<div class="ov-diagram-cap" style="margin:0 0 6px">Uber One is <b>not one global price</b> — it is set to <b>local purchasing power</b>. Each mark is a country at its <b>USD-equivalent monthly</b> price (13 markets, confirmed from official Uber pages, ~Jul 2026).</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 190" role="img" aria-label="Uber One price distribution across markets">'+
    '<rect x="'+tk(xf(0))+'" y="72" width="'+tk(xf(3.5)-xf(0))+'" height="58" fill="rgba(192,57,43,0.05)"/>'+
    '<rect x="'+tk(xf(3.5))+'" y="72" width="'+tk(xf(6)-xf(3.5))+'" height="58" fill="rgba(230,176,50,0.06)"/>'+
    '<rect x="'+tk(xf(6))+'" y="72" width="'+tk(xf(10.5)-xf(6))+'" height="58" fill="rgba(6,193,103,0.06)"/>'+
    '<text x="'+tk(xf(1.75))+'" y="66" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#C0392B" text-anchor="middle" letter-spacing=".05em">EMERGING</text>'+
    '<text x="'+tk(xf(4.75))+'" y="66" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#B8860B" text-anchor="middle" letter-spacing=".05em">MID-MARKET</text>'+
    '<text x="'+tk(xf(8.25))+'" y="66" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#06965A" text-anchor="middle" letter-spacing=".05em">DEVELOPED</text>'+
    '<line x1="'+tk(xf(0))+'" y1="130" x2="'+tk(xf(10.5))+'" y2="130" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="'+tk(xf(2))+'" y1="130" x2="'+tk(xf(2))+'" y2="134" stroke="#C7CED6"/><text x="'+tk(xf(2))+'" y="146" font-family="Inter,sans-serif" font-size="8.5" fill="#8A93A0" text-anchor="middle">$2</text>'+
    '<line x1="'+tk(xf(4))+'" y1="130" x2="'+tk(xf(4))+'" y2="134" stroke="#C7CED6"/><text x="'+tk(xf(4))+'" y="146" font-family="Inter,sans-serif" font-size="8.5" fill="#8A93A0" text-anchor="middle">$4</text>'+
    '<line x1="'+tk(xf(6))+'" y1="130" x2="'+tk(xf(6))+'" y2="134" stroke="#C7CED6"/><text x="'+tk(xf(6))+'" y="146" font-family="Inter,sans-serif" font-size="8.5" fill="#8A93A0" text-anchor="middle">$6</text>'+
    '<line x1="'+tk(xf(8))+'" y1="130" x2="'+tk(xf(8))+'" y2="134" stroke="#C7CED6"/><text x="'+tk(xf(8))+'" y="146" font-family="Inter,sans-serif" font-size="8.5" fill="#8A93A0" text-anchor="middle">$8</text>'+
    '<line x1="'+tk(xf(10))+'" y1="130" x2="'+tk(xf(10))+'" y2="134" stroke="#C7CED6"/><text x="'+tk(xf(10))+'" y="146" font-family="Inter,sans-serif" font-size="8.5" fill="#8A93A0" text-anchor="middle">$10</text>'+
    // developed cluster shown as a RANGE (its own insight: 6 markets converge ~$6-7.3)
    '<rect x="'+tk(xf(6.05))+'" y="122" width="'+tk(xf(7.30)-xf(6.05))+'" height="16" rx="4" fill="#06C167"/>'+
    '<text x="'+tk(xf(6.68))+'" y="112" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#06965A" text-anchor="middle">UK · France · Ireland · Canada · Australia · NZ</text>'+
    '<text x="'+tk(xf(6.68))+'" y="152" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#06965A" text-anchor="middle">6 markets · $6.0–7.3</text>'+
    dot(1.75,'India',1)+
    dot(3.05,'S. Africa',-1)+
    dot(3.70,'Brazil · Mexico',1)+
    dot(4.53,'Saudi Arabia',-1)+
    dot(5.85,'Colombia',1)+
    dot(9.99,'United States',1)+
  '</svg></div>';
  h+='<div class="ov-fynote" style="margin-top:8px"><b>A ~6× spread</b> ($1.75 India → $9.99 US) is the tell: Uber One is priced to local purchasing power, not flat globally. So <b>"50M members" is economically lopsided</b> — a US member is worth a multiple of an India member in reported dollars, and <b>FX drags the international side</b> (Q1 2026 bookings +14% reported vs ~+10% cc). Unit growth comes from the cheap end; reported value concentrates at the rich end. <span class="ave-subh-note">Official Uber pages, ~Jul 2026; FX/promotions move them.</span></div>';
  return h;
}
function uberOneBody(c){
  var h='';
  h+='<p class="ov-lede"><b>Uber One</b> is the paid membership that bundles rides + Eats + grocery. <b>50M+ members</b> (Q1 2026, ~+50% YoY) drive <b>&gt;50% of combined Mobility+Delivery gross bookings</b> and spend <b>~3×</b> more than non-members. Against 199M monthly active consumers, roughly <b>a quarter of the base</b> are members — and in the US, <b>&gt;35% of Mobility bookings</b> already run through them.</p>';
  h+='<div class="ov-kpis">'+UBERONE_STAT.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d muted">'+esc(k.s)+'</div></div>'; }).join('')+'</div>';
  h+=sec('Explosive Member Growth — 19M → 50M+ in ~2 years',
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMembers"></canvas></div>'+
    '<div class="ave-subh-note" style="margin-top:4px">~20M members added in the last year alone · now live in <b>42 countries</b> (up from 28). "Don’t see it slowing down." — mgmt, Q1 2026</div>');
  h+=sec('Priced to the Planet — one membership, many prices', uberOnePricing());
  h+=sec('Why Members Are Worth ~3×',
    '<div class="ov-subh">Monthly spend per user <span class="ave-subh-note">(Summit deck, Dec 2024)</span></div>'+
    mbars(UBERONE_SPEND)+
    '<div class="ov-fynote" style="margin-top:10px"><b>The re-rating math.</b> Members spend ~3×, are far stickier, and already drive <b>&gt;50% of combined bookings</b>. At just ~<b>25% penetration</b> of monthly actives (vs Amazon Prime ~70% of US households), the ceiling is far off. Each point of penetration shifts revenue from one-off transactions to <b>recurring, higher-LTV</b> spend — same business, structurally better revenue quality.</div>');
  h+=sec('The Cross-Sell Flywheel', '<div class="ov-callout"><div class="ov-tl-body"><b>"Go anywhere, get anything."</b> One demand graph cross-sells rides ⇄ eats ⇄ grocery. ~<b>40%</b> of users use multiple products; ~⅓ of Eats customers arrived through the Rides app (near-zero CAC). Each product the member adds <b>raises the cost of leaving</b> — not through lock-in (cancellation is easy, $9.99/mo) but because no competitor offers rides + food + grocery + hotels in one membership. That breadth-as-switching-cost is the structural moat.</div></div>');
  h+=sec('Platform Expansion',
    '<div class="ov-row"><div class="ov-row-k">Uber for Business</div><div class="ov-row-v">B2B corporate rides, meals & travel — >$5B of bookings, growing >2× faster than Mobility.</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Travel</div><div class="ov-row-v">"Hotels on Uber" (Expedia, 700k+ properties) + Vrbo + Travel Mode — feeding membership engagement, not meant as a core business.</div></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ─── Pane: Model vs. Reality ──────────────────────────────────────────────────
function modelBody(c){
  var h='';
  h+='<p class="ov-lede" style="margin-bottom:14px">How the <b>Summit DCF</b>\'s quarterly estimate has stacked up against what Uber actually reported. Each bar is the <b>surprise</b> (actual vs estimate); green favorable, red unfavorable. Pick a metric, drag the handles to window the quarters — chart and tiles recompute live.</p>';
  h+='<div class="ave-groups">';
  h+=groupRow('KPIs', [['mapc','MAPCs']]);
  h+=groupRow('Bookings', [['gb','Total GB'],['mob','Mobility GB'],['del','Delivery GB']]);
  h+=groupRow('P&L', [['rev','Revenue'],['ebitda','Adj. EBITDA']]);
  h+=groupRow('Cash', [['fcf','Free Cash Flow']]);
  h+='</div>';
  h+='<div class="ave-leg"><span class="ave-leg-i"><span class="ave-leg-up">▲</span> favorable (beat)</span><span class="ave-leg-i"><span class="ave-leg-dn">▼</span> unfavorable (miss)</span></div>';
  h+='<div class="ov-chart-t" id="ubAveT"></div>';
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="ubAveChart"></canvas></div>';
  h+=rangeSlider('ave', 1, '', '');
  h+='<div class="ave-subh-note" id="ubAveNote" style="margin:6px 2px 16px"></div>';
  h+='<div class="ov-kpis" id="ubAveStats" style="grid-template-columns:repeat(4,1fr)"></div>';
  h+='<div class="ov-foot">Estimates are the model\'s projection_history; actuals are reported. Free Cash Flow starts 2Q24 (where the model carries a stable forecast). Snapshot 2026-05-07.</div>';

  // ── Management's own guidance vs. reality (chart: guided band · actual · model) ──
  h+='<div style="border-top:1px solid var(--bdr);margin:34px 0 0"></div>';
  h+='<div class="ov-subh">Management\'s own yardstick — guidance vs. reality</div>';
  h+='<p class="ov-lede" style="margin-bottom:12px">The back-test above grades the <b>Summit model</b>. This grades <b>management</b> — on the same quarters, so the two read together. Each bar is the <b>range Uber guided</b> for that quarter; the <b>solid dot is what it reported</b> (green = above the range, dark = inside, red = below); the <b>dashed line is the Summit model</b>. The pattern: a <b>rising bar Uber keeps clearing</b> — guided GB steps up every quarter (~$31B → ~$56B) yet reported bookings land upper-half-or-above, and <b>Adj. EBITDA beat the top of its guide in every quarter of 2023</b> and again in 1Q26. Uber frames GB growth on a <b>constant-currency</b> basis (shown on hover).</p>';
  h+='<div class="guid-pills">'+['gb','ebitda'].map(function(k){
    return '<button type="button" class="guid-pill'+(k===_guideMetric?' active':'')+'" data-guidm="'+k+'">'+esc(GUIDE[k].label)+'</button>';
  }).join('')+'</div>';
  h+='<div class="guid-leg" id="ubGuideLeg"></div>';
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="ubGuideChart"></canvas></div>';
  h+='<div class="ave-subh-note" id="ubGuideNote" style="margin:8px 2px 12px"></div>';
  h+='<div class="guid-tbl-wrap" id="ubGuideTbl"></div>';
  h+='<div class="ov-foot">Guidance = the range issued for the upcoming quarter on the prior earnings call (Uber 8-K / press releases; GB growth guided constant-currency, shown on hover); reported actuals & the Summit model reuse the back-test series above. 2Q26 is the current outstanding guide (issued 2026-05-06); its quarter is not yet reported. Snapshot 2026-05-07.</div>';
  return h;
}
function groupRow(label,items){ return '<div class="ave-group"><span class="ave-group-l">'+esc(label)+'</span><div class="ave-pills">'+items.map(function(it){ return '<button type="button" class="ave-pill" data-ave="'+it[0]+'">'+esc(it[1])+'</button>'; }).join('')+'</div></div>'; }

// ─── Shell ────────────────────────────────────────────────────────────────────
function insMoneyFlow(){
  function mk(id,c){ return '<marker id="'+id+'" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="'+c+'"/></marker>'; }
  var h='<style>'+
    '@keyframes mfflow{to{stroke-dashoffset:-28}}'+
    '.mf-wrap{border:1px solid var(--bdr);border-radius:14px;background:linear-gradient(180deg,#fafcff,#fff);padding:6px 4px 2px;margin:2px 0}'+
    '.mf-line{stroke-width:5;stroke-dasharray:8 7;animation:mfflow .8s linear infinite;fill:none;stroke-linecap:round}'+
    '.mf-node{cursor:pointer}.mf-node rect{transition:.15s}.mf-node:hover rect{stroke-width:2.5;filter:drop-shadow(0 2px 5px rgba(0,0,0,.10))}'+
    '.mf-cap{font-size:11.5px;color:var(--navy);line-height:1.55;padding:9px 14px 4px}.mf-cap b{font-weight:800}'+
  '</style>';
  h+='<div class="mf-wrap"><svg viewBox="0 0 720 296" role="img" aria-label="Uber insurance money flow" style="width:100%;height:auto;font-family:Inter,sans-serif">';
  h+='<defs>'+mk('mfg','#06965A')+mk('mfb','#2E6BE6')+mk('mfa','#C77A11')+'</defs>';
  // flow lines (drawn first, behind nodes)
  h+='<line class="mf-line" x1="150" y1="150" x2="219" y2="150" stroke="#06965A" marker-end="url(#mfg)"/>';
  h+='<line class="mf-line" x1="416" y1="112" x2="497" y2="92" stroke="#2E6BE6" marker-end="url(#mfb)"/>';
  h+='<line class="mf-line" x1="416" y1="188" x2="497" y2="210" stroke="#C77A11" marker-end="url(#mfa)"/>';
  // flow labels
  h+='<text x="184" y="140" text-anchor="middle" font-size="9.5" font-weight="800" fill="#06965A">NOW</text>';
  h+='<text x="462" y="80" text-anchor="middle" font-size="9.5" font-weight="800" fill="#2E6BE6">invest</text>';
  h+='<text x="460" y="228" text-anchor="middle" font-size="9.5" font-weight="800" fill="#C77A11">pay LATER</text>';
  // source node -> aleka:0 (rider funds premium)
  h+='<g class="mf-node ov-clickable" data-detail="aleka:0">'+
    '<rect x="14" y="116" width="136" height="68" rx="10" fill="#fff" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="82" y="140" text-anchor="middle" font-size="12" font-weight="800" fill="#10141A">Every $10 fare</text>'+
    '<text x="82" y="159" text-anchor="middle" font-size="10.5" fill="#3A4552">insurance premium</text>'+
    '<text x="82" y="177" text-anchor="middle" font-size="12.5" font-weight="800" fill="#06965A">~$0.50</text></g>';
  // reservoir (the float) -> aleka:2 (books provision & invests)
  h+='<g class="mf-node ov-clickable" data-detail="aleka:2">'+
    '<rect x="222" y="60" width="194" height="180" rx="13" fill="rgba(6,193,103,0.07)" stroke="#06965A" stroke-width="2"/>'+
    '<text x="319" y="88" text-anchor="middle" font-size="11.5" font-weight="800" fill="#049a4f">ALEKA · captive insurer</text>'+
    '<text x="319" y="150" text-anchor="middle" font-size="37" font-weight="900" fill="#049a4f">$12.9B</text>'+
    '<text x="319" y="172" text-anchor="middle" font-size="10.5" fill="#2b3542">reserve float — invested</text>'+
    '<text x="319" y="214" text-anchor="middle" font-size="10" font-weight="700" fill="#6b7684">held now · owed years later</text></g>';
  // invested -> income node -> aleka:2
  h+='<g class="mf-node ov-clickable" data-detail="aleka:2">'+
    '<rect x="500" y="58" width="206" height="66" rx="10" fill="#fff" stroke="#2E6BE6" stroke-width="1.5"/>'+
    '<text x="603" y="84" text-anchor="middle" font-size="11.5" font-weight="800" fill="#2E6BE6">Float invested &#8594; income</text>'+
    '<text x="603" y="104" text-anchor="middle" font-size="10" fill="#3A4552">earns on money not yet owed</text></g>';
  // claims node -> aleka:3
  h+='<g class="mf-node ov-clickable" data-detail="aleka:3">'+
    '<rect x="500" y="178" width="206" height="66" rx="10" fill="#fff" stroke="#C77A11" stroke-width="1.5"/>'+
    '<text x="603" y="204" text-anchor="middle" font-size="11.5" font-weight="800" fill="#C77A11">Claims paid out</text>'+
    '<text x="603" y="224" text-anchor="middle" font-size="10" fill="#3A4552">months &amp; years later</text></g>';
  h+='</svg>';
  h+='<div class="mf-cap"><b>Collect now, pay later.</b> Riders fund the premium; it lands in the Aleka <b>$12.9B</b> reserve and is <b>invested</b> while Uber waits — sometimes years — to pay claims. That timing gap <i>is</i> the <b>float</b>: the reserve build threw <b>+$251M &#8594; +$399M &#8594; +$658M</b> into operating cash (2023&#8594;25), and ~<b>$0.35 of every $10 fare</b> becomes Uber cash. <span class="ave-subh-note">Tap any node for the accounting step. The bear case (below) argues drawing the reserve down flatters that cash.</span></div>';
  h+='</div>';
  return h;
}
function insuranceBody(){
  var RES=[['2021',3.99],['2022',4.72],['2023',6.74],['2024',9.80],['2025',12.46],['Q1 26',12.9]];
  var OI=[['2021',-3.53],['2022',-1.78],['2023',0.99],['2024',2.83],['2025',5.60]];
  var resMax=13, oiMax=5.6;
  var h='<style>'+
    '.uins-hero{display:flex;align-items:center;gap:18px;flex-wrap:wrap;border:1px solid rgba(6,193,103,0.3);border-radius:14px;background:linear-gradient(180deg,rgba(6,193,103,0.06),transparent);padding:16px 18px;margin:0 0 18px}'+
    '.uins-hero-v{font-size:34px;font-weight:900;color:#049a4f;line-height:1;flex:none}'+
    '.uins-hero-t{font-size:12.5px;color:var(--navy);line-height:1.6;flex:1;min-width:250px}.uins-hero-t b{font-weight:800}'+
    '.uins-h{font-size:13px;font-weight:800;color:var(--navy);margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bdr)}'+
    '.uins-m{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:11px}'+
    '.uins-mc{border:1px solid var(--bdr);border-radius:10px;padding:12px 14px}'+
    '.uins-mc-h{font-size:12.5px;font-weight:800;color:#049a4f;margin-bottom:5px}'+
    '.uins-mc-d{font-size:11.5px;color:var(--navy);line-height:1.5}.uins-mc-d b{font-weight:800}'+
    '.uins-bar{display:grid;grid-template-columns:56px 1fr 60px;gap:9px;align-items:center;margin:5px 0}'+
    '.uins-bar-y{font-size:11px;font-weight:700;color:var(--mu);text-align:right}'+
    '.uins-bar-t{height:20px;background:rgba(138,147,160,0.10);border-radius:5px;overflow:hidden}'+
    '.uins-bar-f{height:100%;background:#049a4f;border-radius:5px;opacity:.88}'+
    '.uins-bar-v{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.uins-cfo{background:rgba(6,193,103,0.06);border-left:3px solid #049a4f;border-radius:8px;padding:10px 13px;font-size:12px;color:var(--navy);line-height:1.55;margin-top:10px}.uins-cfo b{font-weight:800}'+
    '.uins-tr{margin:2px 0}'+
    '.uins-tr-row{display:grid;grid-template-columns:56px 1fr 64px;gap:9px;align-items:center;margin:5px 0}'+
    '.uins-tr-y{font-size:11px;font-weight:700;color:var(--mu);text-align:right}'+
    '.uins-tr-track{position:relative;height:20px;background:rgba(138,147,160,0.08);border-radius:5px}'+
    '.uins-tr-zero{position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:var(--bdr)}'+
    '.uins-tr-bar{position:absolute;top:0;bottom:0;border-radius:4px}'+
    '.uins-tr-v{font-size:11.5px;font-weight:800}'+
    '.uins-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:640px){.uins-two{grid-template-columns:1fr}}'+
    '.uins-side{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px}'+
    '.uins-side.bull{border-color:rgba(6,193,103,0.4);background:rgba(6,193,103,0.04)}'+
    '.uins-side.bear{border-color:rgba(192,57,43,0.35);background:rgba(192,57,43,0.035)}'+
    '.uins-side-h{font-size:12.5px;font-weight:800;margin-bottom:7px}.uins-side.bull .uins-side-h{color:#049a4f}.uins-side.bear .uins-side-h{color:#C0392B}'+
    '.uins-side-d{font-size:11.5px;color:var(--navy);line-height:1.55}.uins-side-d b{font-weight:800}.uins-side-d i{color:var(--mu)}'+
    '.uins-tl{font-size:12px;color:var(--navy);line-height:1.6;background:rgba(58,123,213,0.05);border-left:3px solid #3A7BD5;border-radius:8px;padding:11px 14px;margin-top:4px}.uins-tl b{font-weight:800}'+
  '</style>';
  h+='<div class="uins-hero"><div class="uins-hero-v">$12.9B</div>'+
    '<div class="uins-hero-t">Uber quietly runs one of the largest in-house insurers you have never heard of — a <b>~$12.9B</b> book of claims reserves (Q1 2026). Its <b>float</b> helped power the cash-flow turnaround; and as Gross Bookings compound ~20% a year, insurance is finally becoming a <b>smaller slice</b> of the model.</div></div>';
  // machine
  h+='<div class="uins-h">The self-insurance machine</div>';
  h+='<div class="uins-m">'+
    '<div class="uins-mc"><div class="uins-mc-h">~95% self-insured</div><div class="uins-mc-d">Uber must carry commercial auto insurance on every trip. Instead of buying it all, it <b>retains most of the risk</b> and reinsures it into its own captive, <b>Aleka Insurance</b> (a wholly-owned Hawaii subsidiary) — effectively running its own insurer.</div></div>'+
    '<div class="uins-mc"><div class="uins-mc-h">Reserves = future claims</div><div class="uins-mc-d">It books an actuarial liability for <b>unpaid claims</b> (reported + incurred-but-not-reported) — an expense accrued now, paid in cash over years. That timing gap is the <b>float</b>.</div></div>'+
    '<div class="uins-mc"><div class="uins-mc-h">It invests the float</div><div class="uins-mc-d">Uber holds and invests the reserved cash until claims settle — interest-free capital, Buffett-style. This is why <b>cash flow ran ahead of accounting profit</b> through the turnaround.</div></div>'+
  '</div>';
  // reserves
  h+='<div class="uins-h">Follow the money — where the float comes from &amp; where it goes</div>';
  h+=insMoneyFlow();
  h+='<div class="uins-h">How its role flipped — crutch → tailwind</div>';
  h+='<div class="ir-phases">'+irPhase(INS_TL[0],'crutch','Crutch')+irPhase(INS_TL[1],'head','Headwind')+irPhase(INS_TL[2],'tail','Tailwind')+'</div>';
  h+='<div class="uins-h">The reserve build — nearly tripled in two years</div>';
  h+=RES.map(function(r){ var w=Math.max(3,r[1]/resMax*100); return '<div class="uins-bar"><div class="uins-bar-y">'+r[0]+'</div><div class="uins-bar-t"><div class="uins-bar-f" style="width:'+w.toFixed(1)+'%"></div></div><div class="uins-bar-v">$'+r[1].toFixed(1)+'B</div></div>'; }).join('');
  h+='<div class="uins-cfo">The reserve <b>build</b> (claims accrued &gt; claims paid) flows straight into operating cash flow: <b>+$251M (2023) · +$399M (2024) · +$658M (2025)</b> — a recurring tailwind to reported cash generation, and the mechanism the bear case attacks.</div>';
  // turnaround
  h+='<div class="uins-h">From cash-burner to cash-compounder</div>';
  h+='<div class="uins-tr">'+OI.map(function(o){ var v=o[1], neg=v<0, w=Math.abs(v)/oiMax*50, col=neg?'#C0392B':'#049a4f';
    var bar='<div class="uins-tr-bar" style="'+(neg?'right:50%;':'left:50%;')+'width:'+w.toFixed(1)+'%;background:'+col+';opacity:.85"></div>';
    return '<div class="uins-tr-row"><div class="uins-tr-y">'+o[0]+'</div><div class="uins-tr-track"><div class="uins-tr-zero"></div>'+bar+'</div><div class="uins-tr-v" style="color:'+col+';text-align:'+(neg?'left':'right')+'">'+(neg?'−$'+Math.abs(v).toFixed(2):'+$'+v.toFixed(2))+'B</div></div>'; }).join('')+'</div>';
  h+='<div class="uins-cfo" style="border-left-color:#049a4f;background:rgba(6,193,103,0.06)"><b>GAAP operating income</b> swung from <b>−$3.5B (2021) to +$5.6B (2025)</b> — Q2 2023 was Uber&rsquo;s first-ever operating profit. Free cash flow scaled <b>$3.4B → $6.9B → $9.8B</b> (2025, +42%, a record $2.8B in Q4), earning an <b>investment-grade rating</b> and a <b>$20B buyback</b>.</div>';
  // debate
  h+='<div class="uins-h">Is the cash real? The debate</div>';
  h+='<div class="uins-two">'+
    '<div class="uins-side bull"><div class="uins-side-h">Bull — the cash is real</div><div class="uins-side-d">FY2025 free cash flow of <b>$9.8B (+42%)</b>, ~112% of Adj. EBITDA. An <b>investment-grade rating</b>, the first-ever buyback ($20B authorized, ~$3B/quarter), and ~$10B cumulative FCF. Asset-light growth converts almost fully to cash.</div></div>'+
    '<div class="uins-side bear"><div class="uins-side-h">Bear — a float-fed mirage</div><div class="uins-side-d">Cedar Street argues that stripping stock-comp and the reserve build cuts &ldquo;real&rdquo; FCF from ~$8.6B to <b>~$4.1B</b>, calling Uber <b>&ldquo;an unregulated, under-capitalized insurance company.&rdquo;</b> Uber also <b>pulled ~$4.1B out of reserves into cash in 2024–25</b>; Consumer Watchdog&rsquo;s 2026 &ldquo;License to Kill&rdquo; report alleges it is trimming accident liability to help fund robotaxis. <i>Contested activist/analyst framings, not Uber&rsquo;s position.</i></div></div>'+
  '</div>';
  // smaller slice
  h+='<div class="uins-h">Why it is becoming a smaller slice</div>';
  h+='<div class="uins-tl">Insurance keeps rising in absolute dollars (more trips + premium inflation), and Uber&rsquo;s cost-of-revenue growth has repeatedly been blamed on it. But it is being <b>outgrown</b>: Gross Bookings compound ~20%+/yr while Uber pushes insurance down via <b>safety tech, in-house claims (Aleka) and tort reform</b> — insurance CPI cooled from a ~20%+ peak to <b>~11%</b> (Dec 2024), with wins like Georgia tort reform and California UM/UIM limit cuts. Net: a large, cash-generative liability that is slowly shrinking as a share of the whole.</div>';
  h+='<div class="ov-foot" style="margin-top:14px">Reserves and operating results from Uber 10-Ks / Q1 2026 10-Q; the reserve&rarr;cash-flow contribution is from the Summit dataset. Uber does <b>not</b> disclose a clean standalone &ldquo;insurance % of Gross Bookings,&rdquo; so that trend is directional/inferred from cost-of-revenue commentary. The &ldquo;FCF mirage&rdquo; and reserve-raid narratives are <b>attributed</b> analyst/activist framings (Cedar Street; Consumer Watchdog), not Uber&rsquo;s own accounting characterization.</div>';
  return h;
}
function html(c){
  var h='<div class="ov ov-uber" data-brand="UBER">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mobility">Mobility</button>'+
    '<button type="button" class="ovt-tab" data-ovt="delivery">Delivery</button>'+
    '<button type="button" class="ovt-tab" data-ovt="uberone">Uber One</button>'+
    '<button type="button" class="ovt-tab" data-ovt="insurance">Insurance &amp; FCF</button>'+
    '<button type="button" class="ovt-tab" data-ovt="model">Model vs. Reality</button>'+
    '<button type="button" class="ovt-tab" data-ovt="valuation">Valuation</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mgmt">Management</button>'+
    '<button type="button" class="ovt-tab" data-ovt="calls">Earnings Narrative</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="mobility" hidden>'+mobilityBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="delivery" hidden>'+deliveryBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="uberone" hidden>'+uberOneBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="insurance" hidden>'+insuranceBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="model" hidden>'+modelBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="valuation" hidden>'+UBER_VAL.body()+'</div>';
  h+='<div class="ovt-pane" data-ovt="mgmt" hidden>'+UBER_MGMT.body()+'</div>';
  h+='<div class="ovt-pane" data-ovt="calls" hidden>'+callsBody()+'</div>';
  h+='<div class="ov-modal-back" id="ubModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ubModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ubModalT"></div><div class="ov-modal-b" id="ubModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══ Charts ═══════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// Stacked segment GB (Overview + Segments). estIdx → lighter fills.
function stackLabels(){ return { id:'sl', afterDatasetsDraw:function(chart){
  var top=chart.getDatasetMeta(2).data, ctx=chart.ctx, tot=chart.$tot||[];
  top.forEach(function(bar,i){ ctx.save(); ctx.textAlign='center'; ctx.font='700 10.5px Inter, sans-serif'; ctx.fillStyle='#1E2733';
    ctx.fillText(moneyB(tot[i]), bar.x, bar.y-6); ctx.restore(); });
} }; }
function buildSegStack(id, a, b){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy(id);
  var labels=YEARS.slice(a,b+1);
  function slice(arr,fill,fillEst){ var d=[],col=[]; for(var i=a;i<=b;i++){ d.push(arr[i]); col.push(i>=FIRST_EST?fillEst:fill);} return {d:d,col:col}; }
  var m=slice(A_MOB_GB,MOB,EST_MOB), d=slice(A_DEL_GB,DEL,EST_DEL), f=slice(A_FRT_GB,FRT,'rgba(154,163,174,0.4)');
  var tot=[]; for(var i=a;i<=b;i++) tot.push(A_TOT_GB[i]);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:'Mobility', data:m.d, backgroundColor:m.col, stack:'s', maxBarThickness:48 },
      { label:'Delivery', data:d.d, backgroundColor:d.col, stack:'s', maxBarThickness:48 },
      { label:'Freight', data:f.d, backgroundColor:f.col, stack:'s', maxBarThickness:48, borderRadius:3 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+moneyB(ctx.parsed.y); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }, y:{ stacked:true, display:false, grace:'12%' } } },
    plugins:[ stackLabels() ] });
  _charts[id].$tot=tot;
}

// Simple annual bar (Adj. EBITDA)
function buildAnnualBar(id, data, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  var colors=data.map(function(v,i){ return i>=FIRST_EST?EST_MOB:MOB; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:YEARS, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ { id:'vl', afterDatasetsDraw:function(chart){ var ctx=chart.ctx; chart.getDatasetMeta(0).data.forEach(function(bar,i){
      ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(fmt(chart.data.datasets[0].data[i]), bar.x, bar.y-7); ctx.restore(); }); } } ] });
}

// Two-line chart (take rate / margin / GB per MAPC) — quarterly or annual labels.
function buildLines(id, labels, s1, s2, fmt, opt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  opt=opt||{};
  var ds=[{ label:s1.label, data:s1.data, borderColor:s1.color, backgroundColor:'transparent', borderWidth:2.5, tension:.3, pointRadius:2.5, pointBackgroundColor:'#fff', pointBorderColor:s1.color, pointBorderWidth:2 }];
  if (s2) ds.push({ label:s2.label, data:s2.data, borderColor:s2.color, backgroundColor:'transparent', borderWidth:2.5, tension:.3, pointRadius:2.5, pointBackgroundColor:'#fff', pointBorderColor:s2.color, pointBorderWidth:2 });
  if (opt.estFrom!=null) ds.forEach(function(d){ d.segment={ borderDash:function(ctx){ return ctx.p1DataIndex>=opt.estFrom?[5,4]:undefined; } }; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return fmt(v); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 }, maxRotation:0, autoSkip:true, maxTicksLimit:9 } } } } });
}
function pf(v){ return v.toFixed(1)+'%'; }

// ═══ Model vs. Reality ════════════════════════════════════════════════════════
var AVE={
  mapc:{ label:'MAPCs', fmt:'cnt', quarters:Q13, est:MAPC_E, act:MAPC_A, note:'Monthly active platform consumers (millions). The model tracked closely; recent quarters came in a touch ahead.' },
  gb:{ label:'Total Gross Bookings', fmt:'usd', quarters:Q13, est:TOT_GB_E, act:TOT_GB_A, note:'Total Gross Bookings (Mobility + Delivery + Freight). The model has stayed within a couple percent.' },
  mob:{ label:'Mobility GB', fmt:'usd', quarters:Q13, est:MOB_GB_E, act:MOB_GB_A, note:'Mobility Gross Bookings. Reaccelerated through 2025 — actuals ran ahead of the model.' },
  del:{ label:'Delivery GB', fmt:'usd', quarters:Q13, est:DEL_GB_E, act:DEL_GB_A, note:'Delivery Gross Bookings. The model was too optimistic early (2023), then converged tightly.' },
  rev:{ label:'Revenue', fmt:'usd', quarters:Q13, est:REV_E, act:REV_A, note:'Total revenue. Tracked well until 1Q26, when a UK accounting change cut reported revenue ~$1B (a model miss that is not an economic miss).' },
  ebitda:{ label:'Adj. EBITDA', fmt:'usd', quarters:Q13, est:EB_E, act:EB_A, note:'Adjusted EBITDA. Consistent beats — Uber out-earned the model in most quarters.' },
  fcf:{ label:'Free Cash Flow', fmt:'usd', quarters:Q13.slice(5), est:FCF_E.slice(5), act:FCF_A.slice(5), note:'Free cash flow (window from 2Q24, where the model carries a forecast). Lumpy but generally ahead of estimate.' },
};
var _aveMetric='gb', AVE_GREEN='#1E9E62', AVE_RED='#C0392B';

// ═══ Management Guidance vs. Reality ══════════════════════════════════════════
// A second yardstick beside the model back-test: Uber's own next-quarter guidance
// (Gross Bookings + Adjusted EBITDA) vs what it reported, with the Summit estimate
// overlaid so all three read together. Both metrics span the full back-test window
// (1Q23 → 2Q26), congruent with the chart above. Reported actuals & Summit
// estimates reuse the back-test series (Total GB = Mobility + Delivery + Freight);
// guidance is from Uber 8-K / press releases. Uber frames GB growth constant-
// currency. 2Q26 is the current outstanding guide. Snapshot 2026-05-07.
var GQ=['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'];
var GUIDE={
  gb:{ label:'Gross Bookings', unit:'usd', q:GQ,
    glo:[31000,33000,34000,36500,37000,38750,40250,42750,42000,45750,48250,52250,52000,56250],
    ghi:[32000,34000,35000,37500,38500,40250,41750,44250,43500,47250,49750,53750,53500,57750],
    cc:['+20–24%','—','—','—','—','+18–23%','+18–23%','+16–20%','+17–21%','+16–20%','+17–21%','+17–21%','+17–21%','+18–22%'],
    act:TOT_GB_A.concat([null]),
    est:TOT_GB_E.concat([null]),
    note:'Gross Bookings guidance, framed constant-currency (hover for the cc-growth). A rising bar Uber keeps clearing — guided GB steps up every quarter yet reported bookings land in the upper half of the range almost every quarter, beating the top outright in the most recent two (4Q25, 1Q26) as Mobility and Delivery both reaccelerated.' },
  ebitda:{ label:'Adj. EBITDA', unit:'usd', q:GQ,
    glo:[660,800,975,1180,1260,1450,1580,1780,1790,2020,2190,2410,2370,2700],
    ghi:[700,850,1025,1240,1340,1530,1680,1880,1890,2120,2290,2510,2470,2800],
    act:EB_A.concat([null]),
    est:EB_E.concat([null]),
    note:'Adj. EBITDA is where Uber sandbags hardest: reported Adj. EBITDA beat the TOP of its guided range in every quarter of 2023 (and again in 1Q26), landing in the upper half the rest of the time. Management guides profitability conservatively and clears it — advertising (~100% margin) and insurance leverage compound the beat.' },
};
var _guideMetric='gb';
function guideColor(act, lo, hi){
  if(act==null) return GRAY;
  if(lo==null||hi==null) return BRAND;
  if(act>=hi) return AVE_GREEN;
  if(act>=lo-(lo+hi)/2*0.004) return BRAND;
  return AVE_RED;
}
function guideLand(act, lo, hi){
  if(act==null) return { t:'current guide', c:'guid-mut' };
  if(lo==null||hi==null) return { t:'not guided', c:'guid-mut' };
  var mid=(lo+hi)/2;
  if(act>=hi) return { t:'above range', c:'guid-up' };
  if(act>=mid) return { t:'upper half', c:'' };
  if(act>=lo-mid*0.004) return { t:'in range', c:'' };
  return { t:'below range', c:'guid-dn' };
}
function aveFmt(m,v){ if(v==null) return '—'; return m.fmt==='cnt'?v.toFixed(0)+'M':money(v); }
function aveSurprise(m,i){ var e=m.est[i]; if(e==null||e===0) return 0; return (m.act[i]-e)/Math.abs(e)*100; }
function avePctS(v){ return (v<0?'−':'+')+Math.abs(v).toFixed(1)+'%'; }
var aveLabels={ id:'aveLabels', afterDatasetsDraw:function(chart){
  var surp=chart.$surp||[], bars=chart.getDatasetMeta(0).data, ctx=chart.ctx, area=chart.chartArea;
  if(area){ var y0=chart.scales.y.getPixelForValue(0); ctx.save(); ctx.strokeStyle='#D7DDE4'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(area.left,y0); ctx.lineTo(area.right,y0); ctx.stroke(); ctx.restore(); }
  for(var i=0;i<surp.length;i++){ var bar=bars[i]; if(!bar) continue; var above=surp[i]>=0, fav=(chart.$exp?-surp[i]:surp[i])>=0;
    ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle=fav?AVE_GREEN:AVE_RED;
    ctx.fillText((above?'▲ ':'▼ ')+avePctS(surp[i]), bar.x, above?bar.y-7:bar.y+15); ctx.restore(); } } };
function buildAveChart(){
  var id='ubAveChart', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderRadius:3, maxBarThickness:54 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:24, bottom:22 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{
        title:function(items){ return (_charts.ubAveChart.$q||[])[items[0].dataIndex]||''; },
        label:function(ctx){ var i=ctx.dataIndex,m=AVE[_aveMetric]; return ['Estimate: '+aveFmt(m,(_charts.ubAveChart.$est||[])[i]),'Actual: '+aveFmt(m,(_charts.ubAveChart.$act||[])[i]),'Surprise: '+avePctS((_charts.ubAveChart.$surp||[])[i])]; } } } },
      scales:{ y:{ display:false, grace:'22%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ aveLabels ] });
}
function computeAveStats(m,a,b){
  var surp=[],beats=0,best={f:-Infinity,s:0,q:''},worst={f:Infinity,s:0,q:''};
  for(var i=a;i<=b;i++){ var s=aveSurprise(m,i),f=m.exp?-s:s; surp.push(s); if(f>=0) beats++; if(f>best.f) best={f:f,s:s,q:m.quarters[i]}; if(f<worst.f) worst={f:f,s:s,q:m.quarters[i]}; }
  var n=surp.length,sum=surp.reduce(function(t,v){return t+v;},0),sumAbs=surp.reduce(function(t,v){return t+Math.abs(v);},0);
  var sorted=surp.slice().sort(function(x,y){return x-y;}),mid=Math.floor(n/2),median=n===0?0:(n%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2),avg=n?sum/n:0;
  return { n:n,beats:beats,misses:n-beats,exp:!!m.exp,beatRate:n?beats/n*100:0,missRate:n?(n-beats)/n*100:0,avg:avg,avgFav:m.exp?-avg:avg,avgAbs:n?sumAbs/n:0,median:median,medFav:m.exp?-median:median,best:best,worst:worst,last:{ s:surp[n-1],f:m.exp?-surp[n-1]:surp[n-1],q:m.quarters[b] } };
}
function renderAveStats(m,a,b){
  var box=document.getElementById('ubAveStats'); if(!box) return; var s=computeAveStats(m,a,b);
  function tile(l,v,sub,dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
  box.innerHTML=tile('Beat rate', s.beatRate.toFixed(0)+'%', s.beats+' of '+s.n+' above estimate', s.beatRate>=s.missRate?'up':'down')+
    tile('Miss rate', s.missRate.toFixed(0)+'%', s.misses+' of '+s.n+' below estimate', s.missRate>s.beatRate?'down':'muted')+
    tile('Avg surprise', avePctS(s.avg), s.avg>=0?'we ran conservative':'we ran optimistic', s.avgFav>=0?'up':'down')+
    tile('Median surprise', avePctS(s.median), 'middle quarter', s.medFav>=0?'up':'down')+
    tile('Avg gap (abs)', s.avgAbs.toFixed(1)+'%', 'typical distance from estimate', 'muted')+
    tile('Biggest beat', avePctS(s.best.s), s.best.q, 'up')+
    tile('Biggest miss', avePctS(s.worst.s), s.worst.q, 'down')+
    tile('Latest ('+s.last.q+')', avePctS(s.last.s), s.last.f>=0?'beat estimate':'missed estimate', s.last.f>=0?'up':'down');
}
function renderAve(a,b){
  var m=AVE[_aveMetric], ch=_charts.ubAveChart;
  if(ch){ var labels=[],est=[],act=[],surp=[],colors=[]; for(var i=a;i<=b;i++){ var s=aveSurprise(m,i); labels.push(m.quarters[i]); est.push(m.est[i]); act.push(m.act[i]); surp.push(+s.toFixed(1)); colors.push((m.exp?-s:s)>=0?AVE_GREEN:AVE_RED); }
    ch.data.labels=labels; ch.data.datasets[0].data=surp; ch.data.datasets[0].backgroundColor=colors; ch.$surp=surp; ch.$est=est; ch.$act=act; ch.$q=labels; ch.$exp=!!m.exp; ch.update('none'); }
  renderAveStats(m,a,b);
}
function setupAveSlider(){
  var mn=document.getElementById('aveMin'), mx=document.getElementById('aveMax'), fill=document.getElementById('aveFill'); if(!mn||!mx||!fill) return;
  var m=AVE[_aveMetric], maxI=m.quarters.length-1; mn.max=maxI; mx.max=maxI; mn.value=0; mx.value=maxI;
  function apply(){ var a=+mn.value,b=+mx.value; fill.style.left=(a/maxI*100)+'%'; fill.style.width=((b-a)/maxI*100)+'%'; renderAve(a,b); }
  mn.oninput=function(){ if(+mn.value>=+mx.value) mn.value=+mx.value-1; apply(); };
  mx.oninput=function(){ if(+mx.value<=+mn.value) mx.value=+mn.value+1; apply(); };
  apply();
}
function switchAveMetric(root,k){
  if(!AVE[k]) return; _aveMetric=k;
  root.querySelectorAll('.ave-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ave')===k); });
  var m=AVE[k], t=document.getElementById('ubAveT'), note=document.getElementById('ubAveNote');
  if(t) t.innerHTML=esc(m.label)+' — surprise vs estimate <span>(%, per quarter · hover for value)</span>';
  if(note) note.textContent=m.note; setupAveSlider();
}
function buildModelTab(){ var root=document.querySelector('.ov-uber'); if(!root) return; buildAveChart(); switchAveMetric(root,_aveMetric); renderGuide(); }
function guideLegend(){
  var s='display:inline-flex;align-items:center;gap:7px;margin:0 18px 6px 0;font-size:12px;font-weight:600;color:var(--mu)';
  function dot(c){ return '<span style="width:11px;height:11px;border-radius:50%;background:'+c+';flex:none"></span>'; }
  function band(){ return '<span style="width:16px;height:11px;border-radius:3px;background:rgba(16,20,26,0.10);border:1px solid rgba(16,20,26,0.30);flex:none"></span>'; }
  function dash(c){ return '<span style="width:16px;border-top:2px dashed '+c+';flex:none"></span>'; }
  return '<span style="'+s+'">'+band()+'Guided range</span><span style="'+s+'">'+dot(BRAND)+'Reported actual</span><span style="'+s+'">'+dash(GRAY)+'Summit model</span>';
}
function guideTip(ctx){
  var g=GUIDE[_guideMetric], i=ctx.dataIndex, dl=ctx.dataset.label;
  if(dl==='Guided range'){ if(g.glo[i]==null) return 'Not guided'; var cc=(g.cc&&g.cc[i]&&g.cc[i]!=='—')?'  ·  '+g.cc[i]+' cc':''; return 'Guided: '+money(g.glo[i])+' – '+money(g.ghi[i])+cc; }
  if(dl==='Reported actual'){ return g.act[i]==null ? 'Reported: pending' : 'Reported: '+money(g.act[i]); }
  if(dl==='Summit model'){ return g.est[i]==null ? null : 'Summit model: '+money(g.est[i]); }
  return null;
}
function buildGuideChart(){
  var id='ubGuideChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  var g=GUIDE[_guideMetric], q=g.q, ds=[];
  ds.push({ type:'bar', label:'Guided range', order:3, maxBarThickness:30, borderSkipped:false, borderRadius:3, borderWidth:1,
    data:g.glo.map(function(lo,i){ return (lo==null||g.ghi[i]==null)?null:[lo,g.ghi[i]]; }),
    backgroundColor:'rgba(16,20,26,0.10)', borderColor:'rgba(16,20,26,0.30)' });
  ds.push({ type:'line', label:'Reported actual', data:g.act, borderColor:BRAND, borderWidth:2, tension:0, spanGaps:false, fill:false, order:1,
    pointRadius:g.act.map(function(v){ return v==null?0:5; }),
    pointBackgroundColor:g.act.map(function(v,i){ return guideColor(v,g.glo[i],g.ghi[i]); }),
    pointBorderColor:'#fff', pointBorderWidth:1.5 });
  ds.push({ type:'line', label:'Summit model', data:g.est, borderColor:GRAY, borderWidth:1.5, borderDash:[5,4], tension:0, spanGaps:false, fill:false, order:2,
    pointRadius:g.est.map(function(v){ return v==null?0:3; }), pointBackgroundColor:'#fff', pointBorderColor:GRAY, pointBorderWidth:1.5 });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:q, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:16, bottom:2 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:guideTip } } },
      scales:{ y:{ grace:'8%', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return money(v); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10.5 } } } }
    }
  });
}
function renderGuideTable(){
  var box=document.getElementById('ubGuideTbl'); if(!box) return;
  var g=GUIDE[_guideMetric];
  var rows=g.q.map(function(q,i){
    var lo=g.glo[i], hi=g.ghi[i], a=g.act[i], land=guideLand(a,lo,hi);
    var range=(lo==null)?'<span class="guid-mut">not guided</span>':money(lo)+' – '+money(hi)+((g.cc&&g.cc[i]&&g.cc[i]!=='—')?' <span class="guid-mut">('+g.cc[i]+' cc)</span>':'');
    var rep=(a==null)?'<span class="guid-mut">pending</span>':'<b>'+money(a)+'</b>';
    var model=(g.est[i]==null)?'<span class="guid-mut">—</span>':money(g.est[i]);
    return '<tr><td>'+esc(q)+'</td><td>'+range+'</td><td>'+rep+'</td><td>'+model+'</td><td class="'+land.c+'">'+land.t+'</td></tr>';
  }).join('');
  box.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Guided range</th><th>Reported</th><th>Summit model</th><th>Landing</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function renderGuide(){
  var leg=document.getElementById('ubGuideLeg'); if(leg) leg.innerHTML=guideLegend();
  var note=document.getElementById('ubGuideNote'); if(note) note.innerHTML=GUIDE[_guideMetric].note;
  buildGuideChart();
  renderGuideTable();
}
function switchGuideMetric(root,k){
  if(!GUIDE[k]) return; _guideMetric=k;
  root.querySelectorAll('.guid-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-guidm')===k); });
  renderGuide();
}

// ─── Tab orchestration ────────────────────────────────────────────────────────
function buildOverviewCharts(){
  buildSegStack('ubChartGB', 0, YEARS.length-1);
  buildAnnualBar('ubChartEbitda', A_EBITDA, money);
}
function buildMobilityCharts(){ buildLines('ubChartTake', Q13, { label:'Mobility', data:MOB_TAKE, color:MOB }, { label:'Delivery', data:DEL_TAKE, color:DEL }, pf); }
function buildDeliveryCharts(){ buildLines('ubChartMargin', Q13.slice(0,12), { label:'Mobility', data:MOB_MARGIN, color:MOB }, { label:'Delivery', data:DEL_MARGIN, color:DEL }, pf); }
function buildUberOneCharts(){ buildLines('ubChartMembers', UBERONE_GROWTH.labels, { label:'Members', data:UBERONE_GROWTH.data, color:BRAND2 }, null, function(v){ return v+'M'; }); }
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(buildOverviewCharts);
  if(key==='mobility') requestAnimationFrame(buildMobilityCharts);
  if(key==='delivery') requestAnimationFrame(buildDeliveryCharts);
  if(key==='uberone') requestAnimationFrame(buildUberOneCharts);
  if(key==='model')    requestAnimationFrame(buildModelTab);
  if(key==='valuation') requestAnimationFrame(function(){ UBER_VAL.init(root); });
  if(key==='mgmt') requestAnimationFrame(function(){ UBER_MGMT.init(root); });
}
function wireModal(root){
  var back=root.querySelector('#ubModalBack'), mT=root.querySelector('#ubModalT'), mB=root.querySelector('#ubModalB'); if(!back) return;
  var galIdx=-1;
  function onEsc(e){ if(e.key==='Escape'){ closeM(); return; } if(galIdx<0) return; if(e.key==='ArrowLeft'){ e.preventDefault(); renderGal((galIdx-1+TRIP_FLOW.length)%TRIP_FLOW.length); } else if(e.key==='ArrowRight'){ e.preventDefault(); renderGal((galIdx+1)%TRIP_FLOW.length); } }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ galIdx=-1; back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function galBody(i){ var s=TRIP_FLOW[i], n=TRIP_FLOW.length, pv=(i-1+n)%n, nx=(i+1)%n;
    return '<div class="ov-gal"><img class="ov-gal-img" src="img/steps/'+s.img+'" alt="'+esc(s.t)+'"><div class="ov-gal-cap">'+s.d+'</div>'+
      '<div class="ov-gal-nav"><button type="button" class="ov-gal-btn" data-gnav="'+pv+'" aria-label="previous">\u2039</button>'+
      '<span class="ov-gal-count">'+(i+1)+' / '+n+'</span>'+
      '<button type="button" class="ov-gal-btn" data-gnav="'+nx+'" aria-label="next">\u203a</button></div></div>'; }
  function renderGal(i){ galIdx=i; var s=TRIP_FLOW[i]; mT.innerHTML='Step '+(i+1)+' \u2014 '+esc(s.t); mB.innerHTML=galBody(i);
    mB.querySelectorAll('[data-gnav]').forEach(function(b){ b.onclick=function(){ renderGal(+b.getAttribute('data-gnav')); }; }); }
  function openGal(i){ back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); renderGal(i); }
  root.querySelector('#ubModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='trip'){ var s=TRIP_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    if(kind==='aleka'){ var a=ALEKA_CHAIN[+id]; return a?{t:'Aleka — '+a.t,h:a.d}:null; }
    if(kind==='key'){ var k=KEY_DRIVERS.filter(function(x){return x.k===id;})[0]; return k?{t:k.t,h:k.d}:null; }
    if(kind==='note'&&id==='gaap'){ return {t:'How to read Uber’s profitability',h:GAAP_NOTE}; }
    if(kind==='note'&&id==='take'){ return {t:'The Mobility take-rate “drop” — accounting, not economics',h:UK_NOTE+'<br><br>'+TAKE_QUOTES.map(function(q){ return '<div style="margin-top:8px"><b>'+esc(q[0])+'</b><br>'+q[1]+'</div>'; }).join('')}; }
    if(kind==='reg'){ var rg=REGV[+id]; return rg?{t:rg.h,h:rg.d}:null; }
    if(kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m?{t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>',h:m.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var key=el.getAttribute('data-detail'); if(key.indexOf('trip:')===0){ openGal(+key.split(':')[1]); return; } var d=resolve(key); if(d) openM(d.t,d.h); }; });
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
  var el=root.querySelector('#ubLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('UBER').then(function(q){
    var p=q.changePct, up=(p==null||p>=0);
    var t=q.time?new Date(q.time*1000):null, hhmm=t?(('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)):'';
    var st=(q.marketState&&q.marketState!=='REGULAR')?(' · '+String(q.marketState).toLowerCase()):'';
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">UBER</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NYSE')+(hhmm?(' · '+hhmm):'')+st+'</span>';
  }).catch(function(){ el.hidden=true; el.innerHTML=''; }); // hide cleanly until the get-quote edge fn is deployed
}
function init(c){
  var root=document.querySelector('.ov-uber'); if(!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  root.querySelectorAll('.ave-pill').forEach(function(btn){ btn.onclick=function(){ switchAveMetric(root, btn.getAttribute('data-ave')); }; });
  root.querySelectorAll('.guid-pill').forEach(function(btn){ btn.onclick=function(){ switchGuideMetric(root, btn.getAttribute('data-guidm')); }; });
  wireModal(root);
  // Earnings calls accordion
  root.querySelectorAll('#ubCallsAcc .lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var uberOverview = { html: html, init: init };
