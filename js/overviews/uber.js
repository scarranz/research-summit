// overviews/uber.js — custom Overview for Uber Technologies, Inc. (NYSE: UBER)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model (snapshot 2026-05-07):
//   actuals_history = reported · projection_history = model estimate.
// Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 / Q1 2026 results &
// prepared remarks, the Feb 2024 "Go-Get" Investor Day (see SOURCES). No live API.

import { makeValuation } from './valuation.js';
import { makeManagement } from './management.js';
import { WORLD_PATHS, WORLD_VB } from './world-paths.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { segmentsHtml, initSegments, segmentsOverviewHtml, initSegmentsOverview,
         segmentsOtherHtml, initSegmentsOther,
         segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line ▸ shared segments engine (General·Segments·Other·Customers)
import { mountWatchList } from '../watchlist.js';
import { uberResults } from '../results-data/uber.js';   // Actual/Summit/Consensus metric series (Bottom Line reformat)
import { uberBBG } from './uber-bbg.js';                  // BBG consensus incl. per-segment GB/take-rate/EBITDA
// Company context for the shared Watch List mount (id+ticker); set in html()/deepDiveHtml()
// because init(c) may receive no arg depending on the caller (mirrors googl.js _co).
var _co = null;

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

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
  { n:'Foodpanda Taiwan', fp:'<b>Blocked</b> — a €211.9M break fee: a cost, not an asset.', y:'2024', deal:'$950M', terms:'cash — BLOCKED', own:'Terminated', cat:'Delivery', miss:true,
    detail:'<b>Terms:</b> ~$950M cash for Delivery Hero\'s Foodpanda Taiwan (May 2024).<br><br><b>Outcome:</b> <b>blocked by Taiwan\'s FTC (Dec 2024)</b> — it would have given Uber >90% local delivery share. Share Purchase Agreement terminated March 10, 2025, upon Uber\'s decision not to proceed with the appeal; Uber paid Delivery Hero a <b>€211.9M break fee</b> in April 2025 (and separately bought $300M of new Delivery Hero shares). Source: Delivery Hero Annual Report 2025.<br><br><b>Aftermath:</b> in March 2026, Delivery Hero signed a new agreement to sell 100% of Foodpanda Taiwan to <b>Grab Holdings</b> instead, for $600M cash — expected to close H2 2026, subject to Taiwan FTC clearance. This is why Taiwan doesn\'t appear anywhere on the Delivery Hero Acquisition map below: by the time the Uber-DH deal was announced (Jul 2026), Taiwan was already under a separate, unrelated sale process to a different buyer.' },
];

// ─── Delivery Hero acquisition (announced 16-Jul-2026) ─────────────────────────
// Source: Uber-Delivery Hero joint investor presentation "Announcement of Uber's
// Acquisition of Delivery Hero" and press release, both dated July 16, 2026 (Uber IR).
// Uber's own pre-deal country footprint is NOT disclosed in those documents -- the
// "existing Uber markets" map layer is a best-effort approximation from public
// reporting (see DH_SOURCES) and is labeled as such in the UI.
// Map palette: on the "Uber After the Deal" view, every category is a distinct shade of green
// (lightest = newest/least-integrated, darkest = deepest existing presence) — only "sold to SSW"
// breaks the pattern, since that one alone is leaving the Uber/Delivery Hero group entirely.
// "Delivery Hero Today" (the standalone DH view) stays red — that view is deliberately NOT
// framed as "Uber's," so it keeps its own brand-red identity.
// Within the SSW carve-out itself there are two distinct outcomes, so it gets two shades of red:
// a handful of the 14 markets (e.g. Spain, Portugal, Poland, Chile) already have their own Uber
// Mobility and/or Delivery operations today — that business is unaffected and stays with Uber even
// though the Delivery Hero brand there (Glovo, PedidosYa, ...) goes to SSW. The rest of the 14 have
// no separate Uber presence at all, so the market leaves the Uber/Delivery Hero group entirely.
var DHCROSS='#AACC33';  // lightest, yellow-green — new cross-platform (Mobility existed, Delivery just added)
var DHNEW='#5CA83E';    // medium green — brand-new Delivery-only market for Uber
var DHBOTH='#2E7D42';   // darker green — Mobility + Delivery, unaffected
var DHMOB='#0F4C2E';    // darkest green — Mobility only, unaffected
var DHDEL='#88B04B';    // Greenery — Delivery only, unaffected (Uber Today view)
var DHRED='#E5342A';    // Delivery Hero's own brand red — "Delivery Hero Today" view only
var DHSSW='#A93226';    // sold to SSW Partners, no other Uber presence in the market
var DHSSWX='#D98880';   // sold to SSW Partners, but Uber's own Mobility/Delivery here is unaffected
var DH_GLANCE=[
  { l:'MAPCs', v:'49M', d:'monthly active platform consumers · FY25' },
  { l:'Merchants', v:'1.1M', d:'FY25' },
  { l:'Earners', v:'900K', d:'couriers/drivers · FY25' },
  { l:'Gross Bookings', v:'$42B', d:'FY25 · GMV used as proxy' },
  { l:'Trips', v:'2.9B', d:'FY25' },
  { l:'Adj. EBITDA', v:'$1.1B', d:'FY25 · IFRS, DH reporting' },
];
var DH_RATIONALE=[
  { t:'Global platform accelerates product innovation', d:'Bringing Uber’s tech platform together with Delivery Hero’s local brands and merchant relationships is meant to give consumers a more seamless <b>Uber One</b> experience across daily needs.' },
  { t:'Highly complementary geographic footprint', d:'Delivery Hero’s strength is concentrated in markets where Uber is thin or absent — <b>EMEA, LatAm and APAC</b> — with #1 category positions in 38 of its 50 markets (20 EMEA, 11 LatAm, 7 APAC).' },
  { t:'Unlocks a much larger cross-platform opportunity', d:'Cross-platform markets nearly double, from <b>34 to 58</b>, adding <b>50M+</b> newly eligible cross-platform users — the segment that generates roughly <b>3x</b> the Gross Bookings of single-service users.' },
  { t:'Clear roadmap for value creation with significant synergies', d:'Over <b>$1.2B</b> of annualized run-rate synergies targeted within 18 months of closing, from a shared tech platform and other shared services.' },
];
var DH_TIMELINE_DEAL=[
  { y:'Pre-2026', t:'Uber builds a <b>~37% economic stake</b> in Delivery Hero over time — ~24.77% in direct voting shares, plus ~11.74% of additional economic exposure via equity derivatives.',
    d:'Prior to announcing the Takeover Offer, Uber held approximately <b>24.77%</b> of Delivery Hero’s issued voting share capital directly, and held additional economic exposure of approximately <b>11.74%</b> through equity derivatives — a combined economic position of roughly <b>36.5%</b> ahead of any formal offer. Uber separately bought $300M of new Delivery Hero shares in 2025, in connection with the terminated Foodpanda Taiwan deal (see M&A).' },
  { y:'Jul 16, 2026', t:'<b>Deal announced.</b> Uber and Delivery Hero sign a Business Combination Agreement; Uber offers €41.50/share in cash for the rest of the company.',
    d:'Uber Technologies, Inc. entered into a business combination agreement with Delivery Hero, extending the combined platform to 99 markets with pro-forma 2025 Gross Bookings of $236B. Delivery Hero’s Management Board and Supervisory Board unanimously welcomed and support the offer, and intend to recommend shareholders tender into it, subject to their review of the Offer Document.' },
  { y:'Jul 16, 2026', t:'<b>Prosus</b> irrevocably agrees to tender its entire ~17% stake into the offer, taking Uber’s total economic interest to <b>~53%</b> before the acceptance period even opens.' },
  { y:'Pending', t:'The <b>Offer Document</b> is submitted to BaFin (Germany’s financial regulator) for approval, then published under the German Securities Acquisition and Takeover Act (WpÜG) — publication opens the formal acceptance period.' },
  { y:'Pending', t:'Delivery Hero shareholders decide whether to tender. The offer requires <b>50%+1 share</b> acceptance (Uber’s existing stake counts toward this) plus merger-control and financial-regulatory clearances.' },
  { y:'H2 2027', t:'<b>Expected closing.</b> Uber completes the takeover; the separate SSW Partners carve-out of 14 markets (~$1.6B) closes in parallel, conditional on the Uber offer closing.',
    d:'Funded through existing cash plus new debt, including a committed bridge facility of ~€14 billion (to be refinanced before closing). Uber is committed to maintaining its <b>investment-grade rating</b>, with gross leverage expected to stay <b>below 2x</b>. Uber\'s existing capital allocation framework — including share buybacks — is unchanged; this deal sits under Uber\'s "pursue selective M&A" pillar, alongside organic growth, autonomous investment, returning excess capital, and maintaining investment-grade strength.' },
  { y:'2027–2030', t:'<b>Integration guardrails.</b> Uber has committed <b>not</b> to enter a Domination and Profit Transfer Agreement (DPLTA) for 3 years post-close; Delivery Hero’s Berlin HQ and workforce are held through <b>at least 2029</b>; €2B is committed to Germany over 5 years.' },
  { y:'~18 mo. post-close', t:'<b>Synergy target:</b> over <b>$1.2B</b> in annualized run-rate synergies from a shared technology platform and other shared services.' },
  { y:'Year 3 post-close', t:'Transaction expected to be <b>high-single-digit percentage accretive</b> to Non-GAAP EPS (accretive from the moment it closes).' },
];
var DH_GERMANY={
  hq:'Berlin', holdYear:2029, investEUR:'€2 billion', years:5,
  focus:[
    'Developing Delivery Hero’s local corporate workforce in Germany',
    'Growing the nationwide delivery business',
    'Launching autonomous-vehicle deployments and partnerships with the German automotive industry',
  ],
};
var DH_ADVISORS=[
  ['Morgan Stanley & Co. LLC · Deutsche Bank', 'Lead financial advisors to Uber'],
  ['Bank of America · Goldman Sachs', 'Financial advisors to Uber'],
  ['Freshfields · Wachtell, Lipton, Rosen & Katz', 'Legal counsel to Uber'],
  ['Cooley LLP', 'Legal counsel to Uber on financing'],
  ['Evercore', 'Financial advisor to SSW Partners'],
  ['Paul Weiss · Hengeler Mueller · Baker Botts · Gibson Dunn', 'Legal counsel to SSW Partners'],
];
var DH_SOURCES='Source: Uber Form 8-K, Exhibits 99.1 (press release, "Uber Announces Acquisition Offer for Delivery Hero") and 99.2 (investor presentation, "Announcement of Uber’s Acquisition of Delivery Hero"), both filed with the SEC July 16, 2026. Delivery Hero market/brand data (the 50 markets retained by Uber and 14 sold to SSW Partners) is exact, as disclosed. Uber’s pre-deal country footprint is not broken out in the deal documents — the map’s "existing Uber markets" layer is a best-effort approximation from public reporting (city/market lists, ~72 countries) and should be treated as directional, not official. All terms are subject to change before the Offer Document is published — the deal has not yet closed.';

// Deal-snapshot parameters, made clickable so a reader can tap any figure for the full explanation.
var DH_PARAMS=[
  { k:'offer', chip:'€41.50/share cash offer', t:'Offer price — €41.50 per share',
    h:'A fixed cash price for every Delivery Hero share Uber doesn’t already own. Because it’s cash (not a stock-for-stock swap), Delivery Hero shareholders who tender know exactly what they’ll receive — no exposure to where Uber’s share price moves between now and closing. To the extent Uber, its financial advisers, or the Bidder buy DH shares outside the tender offer at a price above €41.50 during the offer period, the offer price must be raised to match.' },
  { k:'equity', chip:'$14.8B equity value ($13.7B net of prior stakes)', t:'Equity value — $14.8B (100%) / $13.7B (net)',
    h:'$14.8B is what 100% of Delivery Hero is worth at the €41.50 offer price, based on 314M fully diluted shares. But Uber already owned roughly <b>37%</b> of Delivery Hero before announcing the offer — bought at prices below €41.50 — so its actual incremental cash outlay to buy the rest of the company is smaller: <b>$13.7B</b>, once that prior stake is netted out.' },
  { k:'multiple', chip:'~8x EV / 2027E Adj. EBITDA', t:'Implied multiple — ~8x EV / 2027E Adj. EBITDA',
    h:'This multiple already includes Uber’s existing economic ownership and credits <b>over $1.2B</b> of expected run-rate synergies against 2027E Adjusted EBITDA. Without that synergy credit, the effective multiple Uber is paying would look meaningfully higher — the synergy assumption is what makes Uber describe this as “accretive at an attractive valuation” in its own capital-allocation framework.' },
  { k:'accept', chip:'50%+1 share minimum acceptance', t:'Minimum acceptance threshold — 50% + 1 share',
    h:'The offer only proceeds if holders of more than 50% of Delivery Hero’s shares tender — but Uber’s existing ~37% stake counts toward that threshold. In practice, Uber needs just over 13 percentage points of additional shares to tender to clear the bar — a much lower lift than a from-scratch acquirer would face. Prosus alone tendering its ~17% stake clears it with room to spare.' },
  { k:'financing', chip:'~€14B bridge facility · leverage <2x', t:'Financing & capital allocation',
    h:'Funded through existing cash plus new debt, including a committed bridge facility of approximately <b>€14 billion</b> (arranged with Morgan Stanley, Bank of America and Deutsche Bank) that Uber intends to refinance with permanent debt before closing. Even after taking on this new debt, Uber expects gross leverage to stay <b>below 2x</b> and intends to keep its investment-grade rating — so the deal does not require pausing Uber’s share buyback program. Uber frames this acquisition as an execution of its “pursue selective M&A” capital-allocation pillar, alongside organic growth, autonomous investment, returning excess capital, and maintaining investment-grade strength.' },
  { k:'stake_pre', chip:'~37% Uber stake · pre-announcement', t:'Uber’s stake before the announcement — ~37%',
    h:'Prior to announcing the Takeover Offer, Uber held approximately <b>24.77%</b> of Delivery Hero’s issued voting share capital directly, plus additional economic exposure of approximately <b>11.74%</b> through equity derivatives — a combined economic position of roughly <b>36.5%</b>, built up over time (including a $300M purchase of new Delivery Hero shares in 2025, tied to the terminated Foodpanda Taiwan deal).' },
  { k:'stake_post', chip:'~53% after Prosus tender', t:'Uber’s economic interest after Prosus tenders — ~53%',
    h:'Prosus — a large existing Delivery Hero shareholder — has irrevocably agreed to tender its entire stake (~17% of shares outstanding) into the offer. Combined with Uber’s pre-existing ~37% position, that takes Uber’s total economic interest to roughly <b>53%</b> before the formal acceptance period has even opened, comfortably clearing the 50%+1 minimum.' },
  { k:'stake_full', chip:'100% targeted at closing', t:'Full ownership — targeted at closing, H2 2027',
    h:'Once the tender offer closes (expected <b>H2 2027</b>, subject to regulatory clearances), Uber will own effectively all of the economics of the 50 markets it is retaining — the 14 markets going to SSW Partners are carved out in a separate, conditional transaction. Uber has committed <b>not</b> to enter a Domination and Profit Transfer Agreement (DPLTA) for at least 3 years post-close, a guardrail for remaining minority shareholders during the transition.' },
];
// How each company reports comparable KPIs — glossary + comparability caveats.
var DH_KPI_GLOSSARY=[
  { k:'volume', t:'Transaction volume', uber:'Gross Bookings', dh:'GMV (Gross Merchandise Value)',
    uv:'$193.5B', uvNote:'FY2025 total (Mobility + Delivery + Freight)',
    dv:'$42B (Uber’s ~50-market acquisition scope) · ~$55B / €49.2B (Delivery Hero’s full ~64-market group)', dvNote:'FY2025',
    def:'Total dollar value of everything transacted on the platform, before the company keeps its own take.',
    note:'Broadly comparable — the deal deck itself uses DH’s GMV as the Gross Bookings proxy — but DH’s GMV excludes subscription fees, tips and delivery-as-a-service fees, while Uber’s Gross Bookings includes rider tolls, taxes and tips. Treat side-by-side figures as directional, not identical.' },
  { k:'profit', t:'Core profitability', uber:'Adjusted EBITDA (US GAAP-based)', dh:'Adjusted EBITDA (non-IFRS)',
    uv:'$8.7B', uvNote:'FY2025 · +35% YoY',
    dv:'$1.1B (Uber’s acquisition scope) · ~$1.0B / €942M (Delivery Hero’s full group)', dvNote:'FY2025',
    def:'Operating profit before D&A, stock-based comp and one-off items — each company’s preferred “clean” earnings measure.',
    note:'Not directly comparable. Uber reports under US GAAP, Delivery Hero under IFRS, and each defines its own adjustment list — Delivery Hero’s own filings state its Adjusted EBITDA “may not be comparable to similarly titled measures used by other companies.”' },
  { k:'users', t:'Active customers', uber:'MAPCs (Monthly Active Platform Consumers)', dh:'MAPCs — proxied by monthly active users',
    uv:'202M', uvNote:'FY2025 · +20% YoY',
    dv:'49M', dvNote:'FY2025',
    def:'Unique consumers who used the platform at least once in the month.',
    note:'Same label, but Delivery Hero’s own disclosure notes that monthly active users is “used as a proxy” for its MAPC figure — the underlying measurement isn’t identical to Uber’s.' },
  { k:'orders', t:'Transaction count', uber:'Trips', dh:'Orders (labeled “Trips” in deal materials)',
    uv:'~13B+', uvNote:'FY2025, summed from quarterly disclosures (Q2 3.3B · Q3 3.5B · Q4 3.8B) — Uber does not publish one aggregated annual figure',
    dv:'2.9B', dvNote:'FY2025',
    def:'Number of completed transactions on the platform.',
    note:'Comparable in spirit, but Uber’s Trips span rides, deliveries and freight shipments, while Delivery Hero’s are food/grocery/quick-commerce orders only.' },
  { k:'revenue', t:'Company revenue', uber:'Revenue', dh:'Total Segment Revenue',
    uv:'$52.0B', uvNote:'FY2025 · US GAAP',
    dv:'€14.8B (~$16.6B)', dvNote:'FY2025 · IFRS, up from €12.8B in FY2024',
    def:'What the company itself recognizes as revenue, after paying couriers/drivers/merchants their share.',
    note:'Different take-rate structures across ride-hailing vs. food/grocery delivery mean revenue as a % of Gross Bookings/GMV differs structurally — a higher or lower ratio doesn’t by itself signal better or worse economics.' },
  { k:'ticket', t:'Average ticket size', uber:'Gross Bookings ÷ Trips', dh:'GMV ÷ Orders',
    uv:'~$14.23', uvNote:'$193.5B ÷ ~13.6B trips (FY2025; trips summed from quarterly disclosures: Q1 3.0B · Q2 3.3B · Q3 3.5B · Q4 3.8B — Uber doesn’t publish one aggregated annual figure)',
    dv:'~$14.48', dvNote:'$42B ÷ 2.9B orders (FY2025, Uber’s acquisition scope)',
    def:'Neither company reports this directly — it’s a derived metric: total transaction volume divided by transaction count, i.e. the average dollar value of one trip or order.',
    note:'Strikingly close for two very different businesses. But this is partly coincidental, not a sign the underlying economics are the same: Uber’s figure blends big-ticket airport/long rides with small delivery orders across Mobility + Delivery + Freight, while Delivery Hero’s is food/grocery/quick-commerce only. A similar average can hide very different mixes underneath.' },
];
// Where the 50M+ new cross-platform users come from — Delivery Hero's 50 acquired markets,
// grouped the way the deal deck groups them (by brand/region). "Already cross-platform" counts
// are computed live against DH_SETS.mobSet (Uber's existing Mobility footprint), not hardcoded,
// so they always match the map/list above.
var DH_UBERONE_REGIONS=[
  { k:'me', region:'MENA', sub:'Middle East & North Africa', brands:'talabat · Hungerstation', gmvKey:'mena',
    countries:['Bahrain','Egypt','Iraq','Jordan','Kuwait','Oman','Qatar','United Arab Emirates','Saudi Arabia'],
    rank:'#1 category position in 20 of the combined 27 MENA + Europe/Africa/CA markets (Delivery Hero doesn’t split this further).',
    read:'Every market here already has Uber Mobility — this is a pure cross-sell into an existing rider base, in some of the highest-income, highest-smartphone-penetration markets in Delivery Hero’s portfolio.',
    caseStudy:'<b>The deal deck’s own template case study.</b> Uber and talabat are both strong standalone brands in the region: ~8M MAUs each, ~7% Adj. EBITDA margin each, +34%/+28% YoY Gross Bookings growth. Combined, cross-platform coverage here can reach ~28% of users vs. a ~20% global average, and Uber’s top cross-platform markets run 3–4x larger than the #2 player across Mobility and Delivery combined — management flags this as the template for what the rest of the integration could look like.' },
  { k:'latam', region:'Latin America', brands:'PedidosYa', gmvKey:'americas',
    countries:['Argentina','Bolivia','Costa Rica','Dominican Republic','El Salvador','Guatemala','Honduras','Nicaragua','Panama','Paraguay','Peru','Uruguay','Venezuela'],
    rank:'#1 category position in 11 of these 13 markets.',
    read:'Uber Mobility already operates in 12 of these 13 markets (all but Venezuela) — a large, already-trusted rider base and payment rails. Lower average incomes than the Gulf likely mean smaller average tickets, but the addressable population is large.' },
  { k:'apac', region:'Asia-Pacific', brands:'foodpanda · Baemin', gmvKey:'asia',
    countries:['Bangladesh','Cambodia','Hong Kong','Laos','Malaysia','Myanmar','Pakistan','Philippines','Singapore','South Korea'],
    rank:'#1 category position in 7 of these 10 markets.',
    read:'Split down the middle. South Korea, Bangladesh, Pakistan and Hong Kong already have Uber Mobility. Cambodia, Laos, Malaysia, Myanmar, the Philippines and Singapore do not — Uber sold its Southeast Asia rides business to Grab in March 2018 and hasn’t returned. With no existing rider base, there’s no one to convert into Uber One yet in those six markets — they start as Delivery-only.' },
  { k:'emea2', region:'Europe, Africa & Central Asia', brands:'Glovo · foodora', gmvKey:'europe',
    countries:['Armenia','Bosnia and Herzegovina','Bulgaria','Ivory Coast','Croatia','Georgia','Hungary','Italy','Kazakhstan','Kenya','Kyrgyzstan','Montenegro','Morocco','Nigeria','Republic of Serbia','Tunisia','Uganda','Ukraine'],
    rank:'#1 category position in 20 of the combined 27 MENA + Europe/Africa/CA markets (Delivery Hero doesn’t split this further).',
    read:'The most fragmented group. Italy, Croatia, Kenya, Nigeria, Morocco, Hungary, Uganda and Ukraine already have Uber Mobility — Hungary rejoined in Apr 2024 (Uber exited in 2016, then returned via a licensed-operator deal with Főtaxi), and Uber has kept expanding rides in Ukraine even through the war. The rest — Armenia, Bosnia and Herzegovina, Bulgaria, Georgia, Kazakhstan, Kyrgyzstan, Montenegro, Republic of Serbia and Tunisia — have no existing Uber presence: several inherited from Uber’s 2018 exit of Russia/Armenia/Georgia/Kazakhstan/Azerbaijan/Belarus into the Yandex Taxi joint venture, the rest blocked by local taxi-licensing regulation. Real long-term growth markets, but converting them into Uber One is a multi-year build, not a day-one unlock.' },
];
// Delivery Hero's own FY2025 segment reporting — Annual Report 2025, "Key Figures" table and
// "Segment share of Group GMV" chart (both give the same 42/30/20/8 split). This is Delivery Hero's
// full company footprint (~65 countries, including Taiwan and the 14 SSW-bound markets) — NOT
// limited to the 50 markets Uber is acquiring, so the Europe and Americas shares below are diluted
// by markets Uber isn't getting (Europe includes the 11 SSW markets Poland/Portugal/Spain/etc. on
// top of the 18 Uber keeps; Americas includes SSW's Chile and Ecuador on top of the 13 Uber keeps).
// Asia and MENA have no such dilution — every Asia/MENA market in Delivery Hero's footprint goes to
// Uber, none to SSW. Integrated Verticals (Dmarts/quick-commerce) is excluded — it's not a geography.
// Keyed by gmvKey so each DH_UBERONE_REGIONS entry can look up its own GMV share directly.
var DH_SEGMENT_GMV={
  asia:     { eurB:20.8, usdB:23.3, share:42, clean:true },
  mena:     { eurB:14.6, usdB:16.4, share:30, clean:true },
  europe:   { eurB:9.7,  usdB:10.9, share:20, clean:false },
  americas: { eurB:4.1,  usdB:4.6,  share:8,  clean:false },
};
var DH_SEGMENT_SOURCE='Delivery Hero Annual Report 2025 ("Key Figures" and "Segment share of Group GMV"), FY2025. Total Group GMV €49,196.8M, translated to USD at the ~1.12 average rate Uber’s own investor presentation uses. Integrated Verticals (quick-commerce/Dmarts, 7% of Group GMV) excluded — it isn’t a geography.';
// Multi-year Adjusted EBITDA — both companies\' own turnaround-to-profitability trend.
// Uber: US GAAP Adj. EBITDA, in-scope Summit DCF series (matches A_EBITDA 2022-2025 above).
// Delivery Hero: reported EBITDA per public company filings, FULL GROUP (all ~64 current
// markets, incl. the 14 going to SSW Partners) — a broader scope than the $1.1B FY25
// Adjusted EBITDA shown elsewhere for Uber\'s ~50-market acquisition scope. Not from the
// Jul-16-2026 transaction documents.
var DH_EBITDA_TURN={
  uber:[ {y:'2022',v:1713}, {y:'2023',v:4052}, {y:'2024',v:6484}, {y:'2025',v:8730} ],
  dh:[ {y:'2022',v:-465}, {y:'2023',v:254}, {y:'2024',v:521}, {y:'2025',v:942} ],
};

// Delivery Hero markets Uber keeps, grouped by brand (50 markets, exact from press release).
// Country names match js/overviews/world-paths.js; entries flagged dot:true are rendered
// as point markers (city-states too small for the low-res world outline).
var DH_UBER_MARKETS=[
  { n:'South Korea', brand:'Baedal Minjok' },
  { n:'Hungary', brand:'foodora' },
  { n:'Bangladesh', brand:'foodpanda' }, { n:'Cambodia', brand:'foodpanda' }, { n:'Hong Kong', brand:'foodpanda', dot:true }, { n:'Laos', brand:'foodpanda' }, { n:'Malaysia', brand:'foodpanda' }, { n:'Myanmar', brand:'foodpanda' }, { n:'Pakistan', brand:'foodpanda' }, { n:'Philippines', brand:'foodpanda' }, { n:'Singapore', brand:'foodpanda', dot:true },
  { n:'Armenia', brand:'Glovo' }, { n:'Bosnia and Herzegovina', brand:'Glovo' }, { n:'Bulgaria', brand:'Glovo' }, { n:'Ivory Coast', brand:'Glovo' }, { n:'Croatia', brand:'Glovo' }, { n:'Georgia', brand:'Glovo' }, { n:'Italy', brand:'Glovo' }, { n:'Kazakhstan', brand:'Glovo' }, { n:'Kenya', brand:'Glovo' }, { n:'Kyrgyzstan', brand:'Glovo' }, { n:'Montenegro', brand:'Glovo' }, { n:'Morocco', brand:'Glovo' }, { n:'Nigeria', brand:'Glovo' }, { n:'Republic of Serbia', brand:'Glovo' }, { n:'Tunisia', brand:'Glovo' }, { n:'Uganda', brand:'Glovo' }, { n:'Ukraine', brand:'Glovo' },
  { n:'Saudi Arabia', brand:'Hungerstation' },
  { n:'Argentina', brand:'PedidosYa' }, { n:'Bolivia', brand:'PedidosYa' }, { n:'Costa Rica', brand:'PedidosYa' }, { n:'Dominican Republic', brand:'PedidosYa' }, { n:'El Salvador', brand:'PedidosYa' }, { n:'Guatemala', brand:'PedidosYa' }, { n:'Honduras', brand:'PedidosYa' }, { n:'Nicaragua', brand:'PedidosYa' }, { n:'Panama', brand:'PedidosYa' }, { n:'Paraguay', brand:'PedidosYa' }, { n:'Peru', brand:'PedidosYa' }, { n:'Uruguay', brand:'PedidosYa' }, { n:'Venezuela', brand:'PedidosYa' },
  { n:'Bahrain', brand:'talabat', dot:true }, { n:'Egypt', brand:'talabat' }, { n:'Iraq', brand:'talabat' }, { n:'Jordan', brand:'talabat' }, { n:'Kuwait', brand:'talabat' }, { n:'Oman', brand:'talabat' }, { n:'Qatar', brand:'talabat' }, { n:'United Arab Emirates', brand:'talabat' },
];
// Delivery Hero markets sold separately to SSW Partners (14 markets, exact from press release).
var DH_SSW_MARKETS=[
  { n:'Austria', brand:'foodora' }, { n:'Czech Republic', brand:'foodora' }, { n:'Norway', brand:'foodora' }, { n:'Sweden', brand:'foodora' },
  { n:'Greece', brand:'efood' },
  { n:'Cyprus', brand:'Foody' },
  { n:'Moldova', brand:'Glovo' }, { n:'Poland', brand:'Glovo' }, { n:'Portugal', brand:'Glovo' }, { n:'Romania', brand:'Glovo' }, { n:'Spain', brand:'Glovo' },
  { n:'Chile', brand:'PedidosYa' }, { n:'Ecuador', brand:'PedidosYa' },
  { n:'Turkey', brand:'Yemeksepeti' },
];
// Uber's own footprint, split by product line — Mobility (rides) and Delivery (Uber Eats) — since
// they were launched independently market by market and a country can have one, both, or neither.
// NOT sourced from the deal documents (Uber does not publish one official country list); this is a
// best-effort approximation from public market trackers, cross-checked against Uber's own confirmed
// divestment history. See DH_MAP_SOURCES below for exact citations. Verified/refreshed Jul 2026 —
// Mobility corrections found and applied: Uber RE-ENTERED Hungary (Apr 2024, licensed via Főtaxi,
// after exiting in 2016 — the old "exited Hungary" note was stale); and Uber Mobility is confirmed
// live (not previously listed) in Norway, Sweden, Austria, Czech Republic, Romania, Greece, Ukraine
// (expanded to 18 cities since the 2022 invasion) and Uganda. Confirmed still absent: Bulgaria
// (banned), Serbia, Bosnia and Herzegovina, Montenegro, Cyprus, Armenia, Georgia (only a niche "Uber
// Black" launched 2024, not standard Mobility), Kazakhstan/Kyrgyzstan (Yandex Go territory), Turkey
// (UberX suspended since 2019; only taxi-partnership tiers), Tunisia, and Ivory Coast (Uber operated
// 2019–Sep 2025, then exited — so its absence here is now correct, just for a newer reason).
var UBER_MOBILITY_MARKETS=[
  'USA','Canada','Mexico','Brazil','Chile','Colombia','Argentina','Peru','Uruguay','Paraguay','Bolivia','Costa Rica','Panama','Dominican Republic','Guatemala','Honduras','El Salvador','Nicaragua',
  'England','France','Germany','Italy','Spain','Portugal','Netherlands','Belgium','Switzerland','Ireland','Poland','Croatia','Hungary','Austria','Czech Republic','Norway','Sweden','Romania','Greece','Ukraine',
  'Egypt','Ghana','Kenya','Nigeria','South Africa','Morocco','Uganda','Pakistan','Jordan','Iraq','Kuwait','Oman','Bahrain','Qatar','Saudi Arabia','United Arab Emirates',
  'Bangladesh','Hong Kong','India','Japan','South Korea','Sri Lanka','Taiwan','Australia','New Zealand',
];
var UBER_DELIVERY_MARKETS=[
  'USA','Canada','Mexico','England','France','Spain','Germany','Italy','Netherlands','Belgium','Ireland','Poland','Sweden','Portugal','Switzerland','Japan','Australia','New Zealand','Taiwan','South Korea',
  'Brazil','Chile','Colombia','Costa Rica','Ecuador','Panama','Dominican Republic','Guatemala',
  'Kenya','Nigeria','Ghana','South Africa',
  'Saudi Arabia','Qatar','United Arab Emirates',
];
// Micro-states too small for the low-resolution world outline -- rendered as point markers,
// positioned by an equirectangular projection matching WORLD_VB (same convention as the paths).
var DH_DOT_GEO={ 'Hong Kong':{lat:22.3,lon:114.2}, 'Singapore':{lat:1.35,lon:103.8}, 'Bahrain':{lat:26.0,lon:50.5} };
var DH_SETS=(function(){
  var uberSet={}, sswSet={}, mobSet={}, delSet={};
  DH_UBER_MARKETS.forEach(function(m){ uberSet[m.n]=m.brand; });
  DH_SSW_MARKETS.forEach(function(m){ sswSet[m.n]=m.brand; });
  UBER_MOBILITY_MARKETS.forEach(function(n){ mobSet[n]=true; });
  UBER_DELIVERY_MARKETS.forEach(function(n){ delSet[n]=true; });
  return { uberSet:uberSet, sswSet:sswSet, mobSet:mobSet, delSet:delSet };
})();
// Geographic region for every country appearing across the four sets above — used only by the
// List view's "By Region" grouping (an alternative to grouping by deal category). Central Asia is
// folded into "Europe & Central Asia" rather than given its own bucket, matching the convention
// Delivery Hero's own investor materials use elsewhere in this file (see DH_UBERONE_REGIONS' emea2).
var DH_REGION_ORDER=['North America','Latin America','Europe & Central Asia','Middle East','Africa','Asia-Pacific'];
var DH_REGION_OF=(function(){
  var m={};
  var groups={
    'North America':['USA','Canada','Mexico'],
    'Latin America':['Brazil','Chile','Colombia','Argentina','Peru','Uruguay','Paraguay','Bolivia','Costa Rica','Panama','Dominican Republic','Guatemala','Honduras','El Salvador','Nicaragua','Venezuela','Ecuador'],
    'Europe & Central Asia':['England','France','Germany','Italy','Spain','Portugal','Netherlands','Belgium','Switzerland','Ireland','Poland','Croatia','Sweden','Norway','Austria','Czech Republic','Greece','Cyprus','Moldova','Romania','Hungary','Bosnia and Herzegovina','Bulgaria','Montenegro','Republic of Serbia','Ukraine','Armenia','Georgia','Kazakhstan','Kyrgyzstan'],
    'Middle East':['Jordan','Iraq','Kuwait','Oman','Bahrain','Qatar','Saudi Arabia','United Arab Emirates','Turkey'],
    'Africa':['Egypt','Ghana','Kenya','Nigeria','South Africa','Morocco','Ivory Coast','Tunisia','Uganda'],
    'Asia-Pacific':['Bangladesh','Hong Kong','India','Japan','South Korea','Sri Lanka','Taiwan','Australia','New Zealand','Cambodia','Laos','Malaysia','Myanmar','Philippines','Singapore','Pakistan'],
  };
  DH_REGION_ORDER.forEach(function(r){ groups[r].forEach(function(n){ m[n]=r; }); });
  return m;
})();
var DH_MAP_SOURCES='Delivery Hero markets (which 50 go to Uber, which 14 go to SSW Partners): exact, transcribed from Uber\'s SEC Form 8-K, Exhibits 99.1 (press release) and 99.2 (investor presentation), both filed Jul 16, 2026. Uber\'s own Mobility (rides) and Delivery (Uber Eats) footprint is approximated from public market trackers (Uber Eats country list, Feb 2026; Uber rides country map, 2026) since Uber does not publish one official country-by-country list — cross-checked against confirmed divestment (and re-entry) history: Southeast Asia sold to Grab (Mar 2018), Russia/Armenia/Georgia/Kazakhstan/Azerbaijan/Belarus combined into the Yandex Taxi joint venture (Feb 2018), China sold to Didi (Aug 2016), India Uber Eats sold to Zomato (Jan 2020), Uber rides exited Hungary in 2016 but **returned in Apr 2024** (licensed operator model via Főtaxi), and Uber Mobility exited Ivory Coast in Sep 2025 after operating there since 2019. Re-verified Jul 2026: Uber Mobility is live in Norway, Sweden, Austria, Czech Republic, Romania, Greece and Ukraine (updated since the last pass); still absent from Bulgaria, Serbia, Bosnia and Herzegovina, Montenegro, Cyprus, Armenia, Georgia (Uber Black only), Kazakhstan, Kyrgyzstan, Turkey (UberX suspended, taxi-partnership only) and Tunisia. Treat the Uber-footprint layers (navy/blue/purple) as directional best-effort, not an official Uber disclosure — the Delivery Hero layers (red/amber/gray) are exact. Taiwan (foodpanda) is deliberately absent — it\'s under a separate, unrelated sale to Grab Holdings (signed Mar 2026, $600M) and isn\'t part of either the Uber or SSW scope (see M&A ▸ Foodpanda Taiwan). Finland (foodora) is also absent: Delivery Hero\'s Annual Report 2025 lists it as an active Europe-segment market as of Dec 31, 2025, but it doesn\'t appear in either the 50-market or 14-market list in the Jul-16-2026 deal documents — an unresolved discrepancy between the two filings, not a data-entry gap on our end.';

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
  var thumb='';
  return '<div class="'+cls+'"'+attr+'>'+thumb+'<div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div>'+body+'</div>';
}).join('')+'</div>'; }
// Horizontal proportion bars (reuses shared .ov-mbars). rows = [label, pct, valueLabel, color].
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
// M&A grouped by WHAT CHANGED IN THE FINANCIALS — short by default, full terms on tap.
function mnaTimeline(){
  var byName={}; MNA.forEach(function(m){ byName[m.n]=m; });
  var DIV=[
    {y:'2016', n:'China → Didi', fp:'Exited a cash-furnace market for a <b>Didi equity stake</b>.'},
    {y:'2018', n:'SE Asia → Grab', fp:'Swapped mounting losses for a <b>Grab stake</b>.'},
    {y:'2020', n:'Self-driving (ATG) → Aurora', fp:'Shed heavy <b>AV R&D burn</b> — a major step toward the 2023 profit; kept a ~26% stake.'},
    {y:'2021', n:'Russia → Yandex', fp:'Sold the JV stake for cash on the way out.'}
  ];
  // impact → which deals, the color, and a one-line "so what"
  var GROUPS=[
    { label:'Created a whole segment', color:'#06965A', note:'Added a brand-new reporting line to the P&L.', click:true, items:[byName['Postmates'], byName['Transplace']] },
    { label:'Opened grocery', color:'#1E9E62', note:'The on-ramp to today’s ~$12B grocery run-rate.', click:true, items:[byName['Cornershop']] },
    { label:'Added new regions', color:'#2E6BE6', note:'Bought the local leader where Uber doesn’t operate itself.', click:true, items:[byName['Careem'], byName['Trendyol Go']] },
    { label:'Turned losses into equity stakes', color:'#7A5AF8', note:'Exited cash-burning markets for shares — a key step to the 2023 profit (and why GAAP net income now swings).', click:false, items:DIV },
    { label:'Misses & write-offs', color:'#C0392B', note:'The rare M&A that didn’t work.', click:true, items:[byName['Drizly'], byName['Foodpanda Taiwan']] }
  ];
  var h='<style>'+
    '.mng-grp{border:1px solid var(--bdr);border-left:4px solid #ccc;border-radius:10px;padding:11px 13px;margin-bottom:9px}'+
    '.mng-h{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:9px}'+
    '.mng-t{font-size:12.5px;font-weight:800;color:var(--navy)}.mng-note{font-size:11px;color:var(--mu);line-height:1.4}'+
    '.mng-rail{display:flex;flex-wrap:wrap;gap:8px}'+
    '.mng-chip{flex:1;min-width:150px;max-width:230px;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;background:#fff}'+
    '.mng-chip.click{cursor:pointer;transition:.14s}.mng-chip.click:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.mng-chip.miss{border-color:#E7B7B0}'+
    '.mng-top{display:flex;justify-content:space-between;align-items:center;gap:6px}'+
    '.mng-yr{font-size:10.5px;font-weight:800;color:var(--navy)}.mng-deal{font-size:9.5px;font-weight:700;color:var(--mu);background:#eef2f7;border-radius:9px;padding:1px 7px}'+
    '.mng-n{font-size:12px;font-weight:800;color:var(--navy);margin:4px 0 3px}.mng-x{font-size:8.5px;color:#C0392B;font-weight:800;text-transform:uppercase}'+
    '.mng-fp{font-size:10.5px;color:var(--navy);line-height:1.4}.mng-fp b{font-weight:800}.mng-more{font-size:9.5px;font-weight:700;margin-top:5px}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 10px">Uber’s deals, grouped by <b>what each changed in the financials</b> — not by date. Acquisitions <b>added</b> segments, grocery and regions; divestitures <b>turned losses into equity stakes</b> (the quiet engine of the 2023 profit). <b>Tap any acquisition</b> for terms & outcome.</div>';
  function chip(m, click, accent){
    if(!m) return '';
    var cls='mng-chip'+(click?' click ov-clickable':'')+(m.miss?' miss':'');
    var attr=click?' data-detail="mna:'+esc(m.n)+'"':'';
    return '<div class="'+cls+'"'+attr+' style="border-top:3px solid '+accent+'">'+
      '<div class="mng-top"><span class="mng-yr">'+esc(m.y)+'</span>'+(m.deal?'<span class="mng-deal">'+esc(m.deal)+'</span>':'')+'</div>'+
      '<div class="mng-n">'+esc(m.n)+(m.miss?' <span class="mng-x">miss</span>':'')+'</div>'+
      '<div class="mng-fp">'+(m.fp||'')+'</div>'+
      (click?'<div class="mng-more" style="color:'+accent+'">terms ›</div>':'')+'</div>';
  }
  h+=GROUPS.map(function(g){
    return '<div class="mng-grp" style="border-left-color:'+g.color+'">'+
      '<div class="mng-h"><span class="mng-t">'+esc(g.label)+'</span><span class="mng-note">'+g.note+'</span></div>'+
      '<div class="mng-rail">'+g.items.map(function(m){ return chip(m, g.click, g.color); }).join('')+'</div></div>';
  }).join('');
  h+=collapsible('Why this matters for the financials', '<div style="font-size:11.5px;color:var(--navy);line-height:1.6">Postmates made <b>Delivery a co-equal segment</b>, Transplace <b>created Freight</b>, Cornershop opened <b>grocery</b>, Careem/Trendyol added <b>regions</b>. Meanwhile exiting China, SE Asia, Russia and self-driving turned cash-burning operations into <b>equity stakes</b> — which is exactly why <b>GAAP net income swings</b> quarter to quarter (and why Uber guides on <b>Non-GAAP EPS</b>). Recent AV “deals” are capital commitments, not acquisitions.</div>', false);
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
    players:[['Oracle','oracle.com'],['HCLTech','hcl.com'],['Adobe','adobe.com'],['Twilio','twilio.com'],['TomTom','tomtom.com']],
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

// Regroup the theme-tagged updates by quarter (newest first) \u2014 same data, different lens.
function callsByQuarter(){
  var map={}, order=[];
  UB_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
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
  h+='<div class="lpb-acc" id="ubCallsTheme">';
  UB_THEMES.forEach(function(ct){
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
  h+='<div class="lpb-acc" id="ubCallsQuarter" style="display:none">';
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
var AR_DETAIL={
  mob:{t:'Mobility — Uber leads', h:'Uber holds <b>~70%+ of US rideshare</b>; Lyft is the only real US rival, and it is a <b>US/Canada-only #2</b>. Take rates cluster ~<b>30%</b> across every player, so <b>price is not the battle</b> &mdash; <b>density, cross-sell</b> (Eats &harr; rides via Uber One) and <b>global scale</b> are. Regionally, Uber competes locally (Bolt in Europe, inDrive in emerging markets) or holds <b>equity stakes</b> from markets it exited (Didi/China, Grab/SE&nbsp;Asia, Yandex/Russia). <b>Why it leads:</b> the only platform that is global AND multi-product.'},
  del:{t:'Delivery — Uber contests (US #2)', h:'The one arena where a rival <b>out-scales Uber</b>: <b>DoorDash ~60%</b> of US food delivery vs Uber Eats ~<b>22&ndash;25%</b>. But Eats is <b>far bigger internationally</b>, and Uber counters US share with <b>Mobility cross-sell, Uber One, grocery and a &gt;$2B ad layer</b> DoorDash cannot match at the same scale. Margin has <b>doubled</b> (~1.9% &rarr; ~4% of GB) on ads + scale, converging toward Mobility&rsquo;s ~8%.'},
  groc:{t:'Grocery & retail — Uber is a challenger', h:'Grocery is an <b>Eats cross-sell</b>, not a standalone win yet: ~<b>$12B run-rate</b>, 5 of the top-10 US grocers on platform, bigger baskets & higher frequency. It fights <b>Instacart</b> (the grocery-native leader), <b>Amazon</b> (Whole Foods + Fresh) and <b>DoorDash</b>. Uber&rsquo;s edge is the <b>existing delivery network + membership</b>; its gap is grocery-specific tech & retailer relationships, where Instacart is ahead.'},
  ads:{t:'Advertising — rising fast', h:'The clearest <b>structural margin lever</b>: <b>&gt;$2B run-rate, +50%/yr, ~100% incremental margin</b>, sitting mostly inside Delivery (sponsored listings, in-app). It competes for CPG / retail-media budgets with Amazon, Instacart and the retail-media field. <b>Why it is rising:</b> Uber has the <b>audience + purchase intent + closed loop</b>, and the ad dollar lifts Delivery&rsquo;s take <i>without</i> touching the marketplace split.'},
  av:{t:'Autonomous — the hybrid bet', h:'The <b>defining open question</b>. Uber is <b>both partner and rival</b> to Waymo: Waymo rides are dispatched on the Uber app in Austin/Atlanta, but Waymo runs its own app in SF/Phoenix/LA. Uber&rsquo;s bet: be the <b>demand + fleet-management layer</b> every AV plugs into (30+ partners; &ldquo;no effect of the Waymo launches on our overall business&rdquo;), while Tesla threatens a closed network. <b>Contested</b> &mdash; see the AV tab for the hybrid-network case.'},
  freight:{t:'Freight — optionality only', h:'Logistics brokerage, reported <b>gross</b> (no take rate). ~<b>$5B</b> bookings, <b>near-breakeven</b>, hit by the freight recession. Uber built it via <b>Transplace</b> (2021) but it is <b>subscale</b> vs incumbents. Kept for <b>optionality</b> (a data + network option on logistics), not a battle Uber must win &mdash; and a candidate to divest if it never turns.'}
};
function uberArenaMap(){
  var A=[
    {k:'mob', a:'Mobility (rideshare)', r:'vs Lyft &middot; Grab &middot; Bolt &middot; Didi', pos:'Leads', pc:'#1E9E62', pb:'rgba(30,158,98,0.12)', read:'~<b>70%+</b> of US rides and the only global, multi-product player. Peers sit at the same ~30% take &mdash; scale & the bundle are the moat, not price.'},
    {k:'del', a:'Delivery (food)', r:'vs DoorDash', pos:'Contests', pc:'#B8860B', pb:'rgba(184,134,11,0.14)', read:'<b>#2 in the US</b> (Eats ~22&ndash;25% vs DoorDash ~60%) &mdash; but <b>bigger internationally</b>, and margin is converging up on ads + scale.'},
    {k:'groc', a:'Grocery & retail', r:'vs Instacart &middot; Amazon &middot; DoorDash', pos:'Challenger', pc:'#3A7BD5', pb:'rgba(58,123,213,0.12)', read:'~<b>$12B</b> run-rate and growing fast &mdash; an Eats cross-sell, not the category leader yet.'},
    {k:'ads', a:'Advertising', r:'vs the retail-media field', pos:'Rising', pc:'#3A7BD5', pb:'rgba(58,123,213,0.12)', read:'<b>&gt;$2B</b> run-rate, ~100% margin, +50%/yr &mdash; a fast-emerging profit pool hiding inside Delivery.'},
    {k:'av', a:'Autonomous (AV)', r:'vs Waymo &middot; Tesla', pos:'Hybrid bet', pc:'#6b7684', pb:'#eef2f7', read:'<b>Partner AND rival</b> &mdash; Waymo rides on the Uber app in some cities, on its own in others. The defining open question (see AV tab).'},
    {k:'freight', a:'Freight', r:'vs digital brokerages', pos:'Optionality', pc:'#6b7684', pb:'#eef2f7', read:'Subscale, near-breakeven &mdash; kept for optionality, not a battle Uber must win.'}
  ];
  var h='<style>'+
    '.uam-row{display:grid;grid-template-columns:1.1fr auto 1.5fr;gap:12px;align-items:center;border:1px solid var(--bdr);border-left:4px solid #ccc;border-radius:10px;padding:10px 13px;margin-bottom:8px}.uam-row.ov-clickable{cursor:pointer;transition:.12s}.uam-row.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.uam-a{font-size:12.5px;font-weight:800;color:var(--navy)}.uam-r{display:block;font-size:10px;color:var(--mu);font-weight:600;margin-top:2px}'+
    '.uam-pos{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:4px 12px;text-align:center;white-space:nowrap}'+
    '.uam-read{font-size:11.5px;color:var(--navy);line-height:1.45}.uam-read b{font-weight:800}'+
    '@media(max-width:640px){.uam-row{grid-template-columns:1fr;gap:6px}.uam-pos{justify-self:start}}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 10px">Uber is #1 or #2 almost everywhere, so the useful question is not &ldquo;who is the peer&rdquo; but <b>where it leads, where it contests, and where it is only placing a bet</b> &mdash; arena by arena. <b>Tap any arena</b> for the state of play.</div>';
  h+=A.map(function(x){ return '<div class="uam-row ov-clickable" data-detail="arena:'+x.k+'" style="border-left-color:'+x.pc+'"><div class="uam-a">'+x.a+'<span class="uam-r">'+x.r+'</span></div><div class="uam-pos" style="color:'+x.pc+';background:'+x.pb+'">'+x.pos+'</div><div class="uam-read">'+x.read+' <span style="color:#10141A;font-weight:800;white-space:nowrap">detail ›</span></div></div>'; }).join('');
  return h;
}
// Reusable collapsible section — main content stays; deeper detail folds away (reader's choice).
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
// Competitive map — rivals plotted by two business characteristics (not by "similarity to Uber").
// x = business breadth (single-service specialist → multi-service platform); y = geographic reach (1 region → global).
function uberRivalScatter(){
  // Arena of competition with Uber → dot color (see legend). Uber itself = black (spans all arenas).
  var AC={ mob:'#3A7BD5', del:'#E8830C', groc:'#1E9E62', av:'#7A5AF8', uber:'#10141A' };
  var D=[
    ['Uber',552,60,10,AC.uber,'',
      'The broad-and-global corner. Rides + Delivery (~half of bookings) + Freight + Ads across ~70 countries. Its moat isn’t price — peers all take ~30% — it’s <b>scale + a cross-sell bundle</b> no single-service rival can match.',true],
    ['DiDi',255,100,8,AC.mob,'',
      '<b>Broad geography, mobility-led.</b> Rides + some delivery & fintech across China, Brazil and Mexico. Uber exited these markets and <b>holds equity stakes</b> rather than competing head-on.'],
    ['Grab',505,165,8,AC.mob,'',
      '<b>Single-region super-app.</b> Rides + food + GrabPay finance — but only ~8 SE-Asian countries. High breadth, one region; Uber sold its SE-Asia arm to Grab for a stake.'],
    ['Bolt',360,148,7,AC.mob,'',
      '<b>Regional multi-service.</b> Rides + scooters + Bolt Food + grocery across ~45 European & African countries. Mid-breadth, regional — where Uber competes locally.'],
    ['DoorDash',305,172,9,AC.del,'',
      '<b>Delivery-first, broadening.</b> ~60% of US food delivery (vs Eats ~22–25%), now adding grocery, ads and DashPass. Out-scales Uber in US food, but far smaller abroad and no mobility.'],
    ['Lyft',205,196,8,AC.mob,'',
      '<b>Pure rideshare, domestic.</b> ~7% of revenue is non-rideshare vs Uber’s ~50%. Same ~30% take and US #2 — so the gap is scale + a Delivery business funding rider CAC, not price.'],
    ['Instacart',158,216,8,AC.groc,'',
      '<b>Grocery specialist, US-only.</b> The category-native leader Uber’s grocery push fights — deep retailer integrations and 22M+ items. Narrow but deep; no mobility, no international.'],
    ['Waymo',110,232,7,AC.av,'',
      '<b>AV specialist, a few cities.</b> Robotaxis on its own app (SF/Phoenix/LA) and on Uber’s (Austin/Atlanta) — <b>partner and rival</b> at once. The defining open question for Mobility.']
  ];
  var LEG=[['Mobility',AC.mob],['Delivery',AC.del],['Grocery',AC.groc],['Autonomous',AC.av],['Uber — all arenas',AC.uber]];
  function dot(d){ var name=d[0],x=d[1],y=d[2],r=d[3],col=d[4],why=d[6],hl=d[7];
    return '<circle class="peer-dot" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'"'+(hl?' stroke="#fff" stroke-width="2"':'')+' style="cursor:pointer" data-name="'+esc(name)+'" data-why="'+esc(why)+'"></circle>'+
      '<text x="'+x+'" y="'+(y-r-5)+'" font-family="Inter,sans-serif" font-size="'+(hl?12.5:11)+'" font-weight="'+(hl?800:700)+'" fill="'+(hl?col:'#3A4552')+'" text-anchor="middle" style="pointer-events:none">'+esc(name)+'</text>'; }
  var h='<style>.peer-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,0.28);pointer-events:none;border-top:3px solid #06C167}'+
    '.peer-tip .pt-n{display:block;font-weight:800;font-size:12.5px;color:#06C167;margin-bottom:3px}'+
    '.peer-dot{transition:r .1s}.peer-dot:hover{stroke:#06C167;stroke-width:2}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:14px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:800;color:var(--navy);padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 4px}'+
    '.urs-leg{display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:center;margin:2px 0 4px}'+
    '.urs-leg-i{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--navy)}'+
    '.urs-leg-dot{width:10px;height:10px;border-radius:50%;flex:none}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">The rivals mapped by two business traits: <b>breadth</b> (single-service specialist → multi-service platform) and <b>geographic reach</b> (one region → global). Uber sits alone in the broad-and-global corner; everyone else is either <b>narrow</b> (Lyft, Instacart, DoorDash, Waymo) or <b>regional</b> (Grab, Bolt, DiDi). <span style="opacity:.75">Hover or tap any dot for the detail.</span></div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px;font-size:11px;color:var(--mu)"><b>Why more names than the Overview scatter?</b> This map plots rivals by <b>business traits</b>, so it includes <b>unlisted</b> players (DiDi, Grab, Bolt, Waymo) that have <b>no public market multiple</b> — they can’t appear on the Overview’s valuation×growth scatter, which is limited to <b>listed</b> peers. Their positions here are qualitative <b>approximations</b>, not market data.</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" role="img" aria-label="Uber competitive positioning map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← single-service specialist</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">multi-service platform →</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">1 region</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">global</text>'+
    D.map(dot).join('')+
  '</svg></div>';
  h+='<div class="urs-leg">'+LEG.map(function(l){ return '<span class="urs-leg-i"><span class="urs-leg-dot" style="background:'+l[1]+'"></span>'+esc(l[0])+'</span>'; }).join('')+'</div>';
  h+='<div id="ubPeerTip" class="peer-tip" hidden></div>';
  return h;
}
// ── The old "Deep Overview" is DISMANTLED (Golden Rule #1 — content MOVED, not deleted).
// Its pieces are composed into the new spine:
//   • intro (snapshot/KPIs/lede) + segment split → Top Line ▸ Segments  (ubSegmentsBody)
//   • arena-by-arena landscape                   → Top Line ▸ Industry Analysis (ubIndustryBody)
//   • turnaround + key drivers                   → Evolution ▸ Strategy (ubStrategyBody)
//   • 3-year Investor-Day targets                → Evolution ▸ Guidance (ub3yrTargets)
//   • rival positioning scatter                  → Top Line ▸ Industry Analysis (uberRivalScatter)
function ubIntro(){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="ubLive" hidden></div>';
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+FY_NOTE+'</div>';
  return h;
}
// Top Line ▸ Segments — the segment split and each engine in depth (inner toggle). Company-level
// snapshot/description/KPIs live in the Overview tab; this tab is about the segments themselves.
// ── Top Line ▸ Segments — AMZN-standard dual-axis per segment: Gross Bookings ($B bars) + Net Take
// Rate (% line, y2), Actual / Summit / Consensus. GB + take-rate act/summit come from uberResults;
// the take-rate CONSENSUS comes from uber-bbg (segment revenue has no consensus in results-data). ──
var UB_SEG_MAP={ mobility:{gb:'mobgb',rev:'mobrev',bbg:'mobility',lab:'Mobility'},
                 delivery:{gb:'delgb',rev:'delrev',bbg:'delivery',lab:'Delivery'},
                 freight :{gb:'frgb', rev:null,    bbg:'freight', lab:'Freight'} };
// Map a uber-bbg segment series (FY23-28) onto a given annual-period axis (e.g. uberResults' 2022-2030).
function ubBbgSegOnAxis(seg, key, periods){
  var s=uberBBG.seg[seg]; if(!s||!s[key]) return periods.map(function(){ return null; });
  var vals=s[key].a.concat(s[key].f), yrs=uberBBG.yearsA.concat(uberBBG.yearsF), by={};
  yrs.forEach(function(y,i){ by[y]=vals[i]; });
  return periods.map(function(p){ return by[+p]!=null?by[+p]:null; });
}
// Same, for a consolidated uber-bbg income-statement series.
function ubBbgIsOnAxis(key, periods){
  var s=uberBBG.is[key]; if(!s) return periods.map(function(){ return null; });
  var vals=s.a.concat(s.f), yrs=uberBBG.yearsA.concat(uberBBG.yearsF), by={};
  yrs.forEach(function(y,i){ by[y]=vals[i]; });
  return periods.map(function(p){ return by[+p]!=null?by[+p]:null; });
}
function ubSegDualBody(){
  var pills=Object.keys(UB_SEG_MAP).map(function(k,i){ return '<button type="button" class="rs-view'+(i===0?' active':'')+'" data-ubsg="'+k+'">'+UB_SEG_MAP[k].lab+'</button>'; }).join('');
  return '<div class="ov-sec" data-ubsgblock="1">'+
    '<div class="rs-block-top"><div class="rs-block-h">Segment economics — gross bookings &amp; take rate</div></div>'+
    '<div class="rs-block-modes"><div class="rs-modes"><div style="display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0"><span class="rs-quick-l">Segment</span><div class="rs-views">'+pills+'</div></div></div></div>'+
    '<div class="ave-leg" id="ubSegLeg" style="margin:2px 0 8px"></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:330px"><canvas id="ubChartSegDual"></canvas></div></div>'+
  '</div>';
}
function buildUbSegDual(root){
  var cv=document.getElementById('ubChartSegDual'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartSegDual'); var host=root||document;
  var pb=host.querySelector('[data-ubsg].active'), segk=pb?pb.getAttribute('data-ubsg'):'mobility', seg=UB_SEG_MAP[segk];
  var Y=uberResults.views.y.metrics, gbM=Y[seg.gb], revM=seg.rev?Y[seg.rev]:null;
  var periods=gbM.periods.slice(), labels=periods.map(function(p){ return 'FY'+String(p).slice(2); });
  function la(a){ var l=0; for(var i=0;i<a.length;i++) if(a[i]!=null) l=i; return l; }
  var lastAct=la(gbM.act);
  function bars(a){ return a?a.map(function(v){ return v==null?null:Math.round(v/100)/10; }):labels.map(function(){return null;}); }
  function barBg(a,color){ return a.map(function(v,i){ return i>lastAct?ubHexA(color,0.42):color; }); }
  function takeFrom(gbArr,revArr){ return gbArr.map(function(g,i){ return (g&&revArr&&revArr[i]!=null)?Math.round(revArr[i]/g*1000)/10:null; }); }
  var srcs=[{k:'act',lab:'Actual',c:UB_ACT},{k:'summit',lab:'Summit',c:UB_SUMMIT},{k:'cons',lab:'Consensus (BBG)',c:UB_CONS}];
  var ds=[];
  srcs.forEach(function(s){ var g=gbM[s.k]; if(g&&g.some(function(v){return v!=null;})) ds.push({ type:'bar', label:'Gross bookings — '+s.lab, data:bars(g), backgroundColor:barBg(bars(g),s.c), borderColor:'#fff', borderWidth:1, maxBarThickness:26, yAxisID:'y', order:3 }); });
  // take rate: act/summit = rev/gb (uberResults); consensus = uber-bbg netTakeRate mapped to this axis
  srcs.forEach(function(s){ var t;
    if(s.k==='cons') t=ubBbgSegOnAxis(seg.bbg,'netTakeRate',periods);
    else t=revM?takeFrom(gbM[s.k]||[], revM[s.k]):null;
    if(t&&t.some(function(v){return v!=null;})) ds.push({ type:'line', label:'Take rate — '+s.lab, data:t, borderColor:s.c, backgroundColor:s.c, borderWidth:2.4, pointRadius:2.2, tension:.2, spanGaps:false, yAxisID:'y2', order:1, borderDash:s.k==='cons'?[5,4]:undefined }); });
  _charts['ubChartSegDual']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c){ var e=(c.dataIndex>lastAct)?' (E)':''; return c.dataset.label+': '+(c.parsed.y==null?'—':(c.dataset.yAxisID==='y2'?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B'))+e; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} },
        y:{ position:'right', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{ font:{size:10.5}, callback:function(v){ return '$'+v+'B'; } } },
        y2:{ position:'right', grid:{display:false}, ticks:{ font:{size:10.5}, callback:function(v){ return v+'%'; } } } } }
  });
  var leg=host.querySelector('#ubSegLeg');
  if(leg) leg.innerHTML=srcs.map(function(s){ return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--mu);margin-right:14px"><span style="width:13px;height:13px;border-radius:3px;background:'+s.c+'"></span>'+s.lab+'</span>'; }).join('')+'<span style="font-size:11px;color:var(--mu)">Bars = gross bookings ($B) &nbsp;·&nbsp; lines = net take rate (right axis)</span>';
}
function ubSegmentsBody(c){
  var h='<div class="ov-live" id="ubLive" hidden></div>';
  h+='<p class="ov-lede">Uber is really <b>three businesses of very different size and economics</b>. <b>Mobility</b> (~$97B FY2025 gross bookings) is the profit engine; <b>Delivery</b> (~$91B) is the scale story whose margins are still converging upward; <b>Freight</b> (~$5B) is a near-breakeven logistics option kept for optionality. Below: how the three split, then each engine in depth.</p>';
  h+=ubSegDualBody();
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FRT+'"></span>Freight</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings by segment <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartEbitda"></canvas></div></div>'+
  '</div>';
  h+=sec('The Business in Three Parts', segParts());
  // Each engine in depth, switched by an inner toggle (the "sub-tabs de los segmentos").
  h+='<div class="ov-sec-h ovt-store-h" style="margin-top:8px">Each engine in depth</div>';
  h+='<style>.seg-pill{border:1px solid var(--bdr);background:#fff;font:inherit;font-size:11px;font-weight:700;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer}.seg-pill.active{background:var(--navy);color:#fff;border-color:var(--navy)}.seg-pill:hover{color:var(--navy)}.seg-pill.active:hover{color:#fff}</style>';
  h+='<div class="seg-pills" style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 12px">'+
      '<button type="button" class="seg-pill active" data-seg="mobility">Mobility</button>'+
      '<button type="button" class="seg-pill" data-seg="delivery">Delivery</button>'+
      '<button type="button" class="seg-pill" data-seg="freight">Freight</button>'+
    '</div>';
  h+='<div class="seg-body" data-seg="mobility">'+mobilityBody(c)+'</div>';
  h+='<div class="seg-body" data-seg="delivery" hidden>'+deliveryBody(c)+'</div>';
  h+='<div class="seg-body" data-seg="freight" hidden>'+freightBody(c)+'</div>';
  return h;
}
// Top Line ▸ Industry Analysis — the qualitative competitive landscape: arena-by-arena positioning
// PLUS the competitive map (rivals by business traits). Peer valuation MULTIPLES live in Valuation ▸ Peers.
function ubIndustryBody(c){
  return sec('Competitive Landscape — arena by arena',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Uber is #1 or #2 almost everywhere, so the useful question is not "who is the peer" but <b>where it leads, contests, or is only placing a bet</b>. Tap any arena for the state of play.</div>'+
    uberArenaMap())+
    sec('Competitive map — rivals by business traits',
      uberRivalScatter()+
      '<div class="ov-diagram-cap" style="margin-top:12px">'+PEER_NOTE+'</div>')+
    '<div class="ov-foot">'+esc(SOURCES)+'</div>';
}
// Top Line ▸ Customers — Uber One membership, the platform's monetization/retention engine.
function ubCustomersBody(c){ return uberOneBody(c); }
// Evolution ▸ Strategy — the turnaround narrative + the five levers that drive the business.
function ubStrategyBody(c){
  var h='';
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
    '<div class="utn-note">After ~14 years of losses, Uber flipped — and cash now compounds far faster than bookings.</div></div>';
  h+=sec('What Truly Drives Uber — the things that matter most',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">If you read nothing else: these five levers explain the business. <b>Tap any card.</b></div>'+
    '<div class="ov-drivers">'+KEY_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="key:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// Evolution ▸ Guidance — the 3-year Investor-Day targets (Model vs. Reality precedes this in the pane).
function ub3yrTargets(){
  return sec('3-Year Targets — Investor Day (Feb 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:14px">Uber is <b>running ahead of all three</b> — bookings ~+20%/yr while free cash flow compounds far faster.</div>');
}
// Valuation ▸ Peers — how the LISTED peers trade (multiples). The qualitative competitive map lives
// in Top Line ▸ Industry Analysis; unlisted rivals (Waymo, Bolt, DiDi) have no public market multiple.
var UB_PEER_MULT=[
  { tk:'UBER', n:'Uber',      mc:'$149B', ev:'~15–16×', pe:'~20×', g:'+20%', self:true, read:'The scaled, profitable, multi-product leader — a premium to Lyft, a discount to the faster growers.' },
  { tk:'DASH', n:'DoorDash',  mc:'$78B',  ev:'~22×',    pe:'~28×', g:'+38%', read:'US delivery leader; the fastest grower here and richly valued on it. No mobility leg.' },
  { tk:'GRAB', n:'Grab',      mc:'$16B',  ev:'~13×',    pe:'n/m',  g:'+24%', read:'SE-Asia super-app; only recently GAAP-profitable, so read it on EV/EBITDA rather than P/E.' },
  { tk:'CART', n:'Instacart', mc:'$11B',  ev:'~15×',    pe:'~18×', g:'+14%', read:'US grocery-delivery specialist; profitable and ad-driven — the value name of the set.' },
  { tk:'LYFT', n:'Lyft',      mc:'$5.8B', ev:'~8×',     pe:'~9×',  g:'+14%', read:'US/Canada #2 ride-hailing; cheapest of the group — the market prices its lack of scale.' }
];
function ubPeerMultBody(c){
  var rowsHtml=UB_PEER_MULT.map(function(p){
    var bg=p.self?'background:rgba(6,193,103,0.06);':'';
    return '<tr style="border-top:1px solid var(--bdr);'+bg+'">'+
      '<td style="padding:8px 10px;font-weight:'+(p.self?'800':'700')+'">'+esc(p.n)+' <span class="muted" style="font-weight:600">'+esc(p.tk)+'</span></td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.mc)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.ev)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.pe)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.g)+'</td>'+
      '<td style="padding:8px 10px;color:var(--mu);font-size:11px;line-height:1.45">'+esc(p.read)+'</td></tr>';
  }).join('');
  var h='<p class="ov-lede">How the <b>listed</b> peers trade — the point is where Uber sits on the value/growth spectrum, not who competes with whom (that map is in <b>Industry Analysis</b>). Uber prices at a <b>premium to Lyft</b> (scale, profitability, diversification) but a <b>discount to the faster growers</b> DoorDash and Grab.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)">'+
    '<th style="text-align:left;padding:7px 10px">Company</th>'+
    '<th style="text-align:right;padding:7px 10px">Mkt cap</th>'+
    '<th style="text-align:right;padding:7px 10px">EV/EBITDA <span style="font-weight:600">(fwd)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(fwd)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">Rev growth</th>'+
    '<th style="text-align:left;padding:7px 10px">The read</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>Only listed peers with a public multiple belong here.</b> Unlisted rivals (Waymo, Bolt, DiDi) and captive subsidiaries have no market multiple — they sit on the competitive map in <b>Industry Analysis</b>. "n/m" = no meaningful P/E (earnings too small to annualize). Grab and GoTo are newly profitable, so read them on EV/EBITDA.</div>';
  h+='<div class="ov-foot">Multiples as of ~Jul 2026, forward where available (secondary/terminal sources); growth is latest reported YoY. Market caps live via Massive on the Overview scatter. Directional, not exact — confirm against a terminal before quoting.</div>';
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
  // Per-trip economics and take rate are covered under Bottom Line ▸ Unit Economics (not duplicated here).
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
  // Supplier ecosystem is covered under Bottom Line ▸ Suppliers; insurance cost/float under Insurance & FCF.
  h+=sec('Regulation & Driver Classification', '<div class="ir-diagram-cap" style="font-size:12px;color:var(--mu);margin:0 0 8px">The core question — <b>do drivers stay contractors?</b> — is largely settled in Uber\u2019s favor. Tap any card for the detail.</div><div class="ir-reg">'+REGV.map(function(r,i){return regCard(r,i);}).join('')+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ── Labeled placeholder (user-approved): create the tab now, fill it later with sourced
// figures — never invent data. Marked "To build" so it's obviously incomplete. ──
function placeholder(title, note){
  return '<div style="border:1px dashed var(--bdr);border-radius:12px;padding:16px 18px;margin:10px 0;background:linear-gradient(180deg,rgba(232,160,12,0.045),transparent)">'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#B7791F;background:rgba(232,160,12,0.14);border-radius:10px;padding:2px 9px">To build</span><span style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(title)+'</span></div>'+
    '<div style="font-size:12px;color:var(--mu);line-height:1.55">'+note+'</div></div>';
}
// ── Bottom Line ▸ Unit Economics — the $10-trip walkthrough + take rate. MOVED here from the
// Mobility segment (Golden Rule #1). Chart id ubChartTake still built by buildMobilityCharts. ──
function unitEconBody(c){
  var h='';
  h+='<p class="ov-lede">Per-transaction economics for <b>both engines</b>: the core <b>Mobility</b> ride (where each $10 lands and Uber’s ~$3 take) and the <b>Delivery</b> order (a lower take and margin, same structure). Then how the take rate has trended.</p>';
  h+=sec('How a Trip Makes Money — one $10 ride',
    '<style>.ov-gal-cap{font-size:12.5px;color:var(--navy);line-height:1.6;margin:12px 0}.ov-gal-nav{display:flex;align-items:center;justify-content:space-between;gap:12px}.ov-gal-btn{font-size:22px;font-weight:800;line-height:1;border:1px solid var(--bdr);background:#fff;border-radius:8px;min-width:46px;height:40px;cursor:pointer;color:var(--navy)}.ov-gal-btn:hover{background:#10141A;color:#fff;border-color:#10141A}.ov-gal-count{font-size:11px;color:var(--mu);font-weight:700}</style><p class="ov-lede" style="margin:0 0 12px">Six steps of a Mobility trip — <b>tap any step for a photo + the detail</b>, then use ‹ › to move through the trip. Below: where the $10 lands.</p>'+
    chain(TRIP_FLOW,'trip',true)+
    '<div class="ov-grid2" style="margin-top:18px"><div><div class="ov-subh">Where every $10 goes</div>'+mbars(TRIP_SPLIT)+'</div><div><div class="ov-subh">…and Uber’s ~$3.00 take</div>'+mbars(TRIP_TAKE)+'</div></div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>~$0.75 of every $10 trip converts to cash</b> (incl. the ~$0.35 Aleka insurance float). <span class="ave-subh-note">Illustrative — Summit deck, Dec 2024.</span></div>');
  var dbar=function(l,pct,col){ return '<div style="margin:7px 0"><div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:3px"><span style="color:var(--navy);font-weight:600">'+l+'</span><span style="font-weight:800;color:'+col+'">'+pct+'%</span></div><div style="height:16px;background:#EEF2F7;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+col+';border-radius:5px"></div></div></div>'; };
  h+=sec('How a Delivery order makes money — the other half of the platform',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Delivery runs on a <b>lower take and a lower margin</b> than a ride — but the same structure. On a typical order the consumer pays for food + fees; the money splits between the <b>restaurant</b>, the <b>courier</b> and <b>Uber</b>. Shares below are illustrative of the disclosed structure.</div>'+
    dbar('Restaurant — food cost', 60, '#9AA4B0')+
    dbar('Courier pay', 20, DEL)+
    dbar('Uber take — commission + consumer fees', 19, '#10141A')+
    dbar('Payment & other', 1, '#C4CCD6')+
    '<div class="ov-kpis" style="margin-top:14px">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Delivery take rate</div><div class="ov-kpi-v">~19%</div><div class="ov-kpi-d muted">revenue ÷ GB (FY25) · vs Mobility ~30%</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Falls to Adj. EBITDA</div><div class="ov-kpi-v">~3.9%</div><div class="ov-kpi-d muted">of GB · vs Mobility ~8% — the convergence gap</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Per $100 of Delivery gross bookings Uber keeps ~<b>$19</b> of revenue and ~<b>$3.90</b> of Adjusted EBITDA today — roughly half Mobility’s ~$8. Closing that gap via ~100%-margin <b>advertising</b> and scale, <b>without touching the merchant/courier split</b>, is the Delivery margin-convergence thesis. <span class="ave-subh-note">Take rate & EBITDA margin: Uber FY2025 segment results. The order-split shares are illustrative of the disclosed structure, not a reported per-order breakdown.</span></div>');
  h+=sec('Take Rate',
    ubUnitDualBody()+
    '<div class="ov-sec-h ovt-store-h" style="margin-top:14px">By segment — Mobility vs Delivery</div>'+
    '<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span></div>'+
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartTake"></canvas></div>'+
    '<div class="ov-fynote" style="margin-top:10px">Mobility take held ~30% until the 1Q26 dip to ~25.8% — a <span class="ov-clickable" data-detail="note:take" style="color:#06C167;font-weight:600;cursor:pointer">UK accounting artifact ›</span>, not real compression.</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ── Bottom Line ▸ Suppliers — the vendor ecosystem. MOVED from the Mobility segment. ──
function suppliersBody(c){
  var h='';
  h+='<p class="ov-lede"><b>Uber’s most important supplier is its ~8M drivers and couriers</b> — the people who bring the cars and do the work. They are the real supply constraint and the real cost base; the software, cloud and real-estate vendors below are a rounding error next to them. <b>Autonomous vehicles are a <i>future</i> supply source, not today’s</b>: AV trips are growing fast (&gt;10× YoY) but off a tiny base, and human drivers still supply the <b>overwhelming majority of trips right now</b>. AV stays on the map for where it is going — not for the weight it carries today.</p>';
  h+=sec('The driver & courier base — the supply that actually matters',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The platform lives or dies on <b>liquidity</b>: enough drivers online that wait times stay low and prices stay competitive. That labor supply — recruited, incentivized and retained, but <b>owned by no one</b> — is Uber’s core input and, via driver pay + insurance, its largest cost. It is also the moat: the marketplace with the most drivers gives the best service at the lowest price, which attracts more riders, which attracts more drivers. Everything else here is procurement.</div>');
  h+=sec('The vendor layer — asset-light by design',
    '<style>.alp{display:flex;align-items:center;gap:16px;background:rgba(6,193,103,0.07);border:1px solid rgba(6,193,103,0.25);border-radius:12px;padding:14px 18px;margin:0 0 12px}.alp-big{font-size:34px;font-weight:800;color:#06965A;line-height:1;flex:none}.alp-txt{font-size:12.5px;color:var(--navy);line-height:1.5}.alp-txt b{font-weight:800}@media(max-width:560px){.alp{flex-direction:column;align-items:flex-start;gap:6px}}</style><div class="alp"><div class="alp-big">0.11%</div><div class="alp-txt">of Uber’s ~<b>$193B</b> gross bookings is <b>disclosed supplier spend</b> — ~<b>$210M</b> across 138 suppliers, and only three carry any dollar value (HCL $127M, Oracle $55M, Alexandria $28M). <b>Uber does not run a supply chain; it aggregates one.</b></div></div>'+'<div class="ov-diagram-cap" style="margin:0 0 10px">Uber’s supplier base sorted by <b>what they do</b> for the platform. Most are strategic ties, not traditional vendor contracts — which is itself the asset-light thesis in data form.</div>'+
    '<div class="usc-grid">'+SC_SUPPLIERS.map(scCard).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>The asset-light proof in the data:</b> of 138 identified suppliers, only <b>three carry disclosed dollar values</b> — HCL ($127M, engineering), Oracle ($55M, cloud), Alexandria RE ($28M, offices). Total ~<b>$210M</b> against ~<b>$193B</b> of gross bookings — a ratio that screams platform, not operator. (Of the 30+ AV partners, only ~<b>5–7</b> have real money committed; the rest are MOUs.) <span class="ave-subh-note">Bloomberg SPLC, 29-Jun-2026.</span></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}
// ── Top Line ▸ Segments ▸ Freight (inner toggle). Freight is the small, near-breakeven third leg —
// immaterial to the thesis, so it is intentionally covered lightly vs Mobility & Delivery. ──
function freightBody(c){
  var h='<p class="ov-lede"><b>Freight is the small, near-breakeven third leg</b> — a digital logistics brokerage matching shippers with carriers, reported <b>gross</b> (revenue ≈ gross bookings, no marketplace take rate). At ~<b>$5.1B</b> revenue it is only <b>~2–3% of platform bookings</b> and, unlike Mobility and Delivery, it does <b>not yet make money</b> at the segment level. It is covered lightly here on purpose: it neither moves the thesis nor drags on it.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 revenue</div><div class="ov-kpi-v">$5.1B</div><div class="ov-kpi-d muted">~flat YoY · ~2–3% of GB</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Segment Adj. EBITDA</div><div class="ov-kpi-v" style="color:#C0392B">−$33M</div><div class="ov-kpi-d muted">FY25 · −$74M FY24</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">First breakeven qtr</div><div class="ov-kpi-v">Q4 2025</div><div class="ov-kpi-d muted">first in 3+ years</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Status</div><div class="ov-kpi-v">Kept</div><div class="ov-kpi-d muted">no divestiture announced</div></div>'+
  '</div>';
  h+='<div class="ov-callout" style="margin-top:12px">Built up via the <b>Transplace</b> acquisition (2021), Freight has been squeezed by a multi-year <b>trucking-freight recession</b> — revenue slid from ~$6.9B (2022) to ~$5.1B — and it reached its <b>first breakeven Adjusted-EBITDA quarter in over three years in Q4 2025</b>. Management keeps running it as part of the logistics platform with no announced plan to divest, framing the work around efficiency and profitability rather than growth.</div>';
  h+='<div class="ov-foot">Segment revenue, gross bookings and Adjusted EBITDA: Uber FY2025 results / Summit model. Freight is reported gross, with no take rate.</div>';
  return h;
}
// ── Bottom Line ▸ Margins — profitability & cash margins as a % of revenue. Renders from a sourced
// fallback history so the chart is never empty; the live Massive feed (api.fetchMargins) overrides
// the fallback when it is reachable in the session. ──
var UB_MRG_METRICS=[
  {key:'gross',label:'Gross',color:'#10141A'},
  {key:'oper',label:'Operating',color:MOB},
  {key:'net',label:'Net',color:'#7A5AF8'},
  {key:'ebitda',label:'EBITDA',color:'#12B5A5'},
  {key:'cfo',label:'CFO',color:'#F2A73B'},
  {key:'fcf',label:'FCF',color:'#EB5757'}
];
// Sourced fallback (% of revenue): gross/op/net = GAAP; EBITDA = Adjusted EBITDA %; CFO & FCF ÷ revenue.
// FY2021–FY2025 actuals (Summit / Uber filings); FY2026E = consensus + model. Overridden by live Massive.
var UB_MRG_FALLBACK=[
  {fy:'FY21', gross:46.4, oper:-20.2, net:-2.8,  ebitda:-4.4, cfo:-2.5, fcf:-4.3},
  {fy:'FY22', gross:38.3, oper:-5.6,  net:-28.7, ebitda:5.4,  cfo:2.0,  fcf:1.2},
  {fy:'FY23', gross:39.8, oper:2.7,   net:5.1,   ebitda:10.9, cfo:9.6,  fcf:9.0},
  {fy:'FY24', gross:39.4, oper:6.4,   net:22.4,  ebitda:14.7, cfo:16.2, fcf:15.7},
  {fy:'FY25', gross:39.8, oper:10.8,  net:19.3,  ebitda:16.8, cfo:19.4, fcf:18.8},
  {fy:'FY26E',gross:40.0, oper:12.0,  net:11.9,  ebitda:18.6, cfo:18.7, fcf:18.0, proj:true}
];
var UB_MRG_NOTE_FB='Gross / operating / net = <b>GAAP</b>; EBITDA = <b>Adjusted EBITDA</b> %; CFO & FCF ÷ revenue. <b>FY26E</b> = consensus + model. Note: <b>GAAP net margin in FY24–25 is inflated by one-off tax & equity-stake gains</b> (and dips in FY26E as those don’t recur) — read <b>operating</b> and <b>EBITDA</b> margin as the clean, steadily-rising trend. <span style="color:#B7791F">Directional fallback; the live Massive feed overrides it when reachable.</span>';
var UB_MRG_NOTE_LIVE='Historical margins computed <b>live from Massive</b> (income & cash-flow statements): gross/op/net = line ÷ revenue; EBITDA = (op income + D&A) ÷ revenue; CFO & FCF ÷ revenue. Operating and EBITDA margin are the clean trend; GAAP net is skewed by equity-stake & tax one-offs.';
var _ubMrgRows=UB_MRG_FALLBACK.slice();
var _ubMrgSrc='fallback';
// ═══ §0.2-compliant chart engine (ported verbatim from amzn.js aStdScaffold) ─ metric-family
// dropdown + level/growth/margin modes + period slider + zoom + auto-table + Actual/Summit/Consensus.
// This replaces the bespoke dual-axis charts that violated the standard. ═══
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
// ═══ SAB-parity chart scaffold (docs/AMZN_BOTTOM_LINE §9b) ═════════════════════════════════════════
// Same classes/CSS as results.js so Bottom-Line charts read as ONE product: row1 title + rs-msel metric
// dropdown; row2 rs-views mode pills (left) · rs-quick Range presets (right) — ABOVE the chart; ave-leg
// (Actual/Summit/Consensus, click-to-hide); ov-chart-card; y-axis on the RIGHT; sg-slider two-handle
// PERIOD window with rs-ticks dots + drag-to-zoom on the X. A chart registers a derive(state) fn that
// returns {labels,lastAct,series:[{k,label,color,data,fwdDash}],yFmt}; controls re-render via it.
var ASTD_ACT='rgba(30,39,51,0.92)', ASTD_SUMMIT='rgba(37,99,235,0.85)', ASTD_CONS='rgba(124,134,148,0.85)';
var _aStd={}, _aStdDerive={};
function aStdScaffold(cfg){
  var id=cfg.id;
  var st=_aStd[id]||(_aStd[id]={win:null,hidden:{},sel:null,modes:{}});
  if(cfg.metricSel && st.sel==null){ var on=cfg.metricSel.filter(function(o){return o.on;})[0]||cfg.metricSel[0]; st.sel=on.v; }
  (cfg.modes||[]).forEach(function(g){ if(st.modes[g.cls]==null){ var d=g.opts.filter(function(o){return o.on;})[0]||g.opts[0]; st.modes[g.cls]=d.v; } });
  var sel=cfg.metricSel? '<select class="rs-msel" data-astdsel="'+id+'">'+cfg.metricSel.map(function(o){ return '<option value="'+esc(o.v)+'"'+(o.v===st.sel?' selected':'')+'>'+esc(o.label)+'</option>'; }).join('')+'</select>':'';
  var top='<div class="rs-block-top"><div class="rs-block-h">'+esc(cfg.title)+'</div>'+sel+'</div>';
  var modes=(cfg.modes||[]).map(function(g){ return '<div class="astd-modeg" data-astdmodeg="'+id+'|'+g.cls+'" style="display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0">'+(g.label?'<span class="rs-quick-l">'+esc(g.label)+'</span>':'')+'<div class="rs-views">'+g.opts.map(function(o){ return '<button type="button" class="rs-view'+(o.v===st.modes[g.cls]?' active':'')+'" data-astdmode="'+id+'|'+g.cls+'|'+o.v+'">'+esc(o.label)+'</button>'; }).join('')+'</div></div>'; }).join('');
  var presets=cfg.presets||[['all','All'],['rep','Reported'],['fwd','Forward']];
  var quick='<div class="rs-quick"><span class="rs-quick-l">Range</span>'+presets.map(function(p){ return '<button type="button" class="rs-preset" data-astdrange="'+id+'|'+p[0]+'">'+esc(p[1])+'</button>'; }).join('')+'</div>';
  var row2='<div class="rs-block-modes"><div class="rs-modes">'+modes+'</div>'+quick+'</div>';
  var leg='<div class="ave-leg" data-astdleg="'+id+'"></div>';
  var chart='<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:'+(cfg.height||320)+'px"><canvas id="astd-'+id+'"></canvas></div></div>';
  var slider='<div class="sg-controls"><div class="sg-slider"><div class="sg-track"><div class="sg-fill" data-astdfill="'+id+'"></div></div><div class="rs-ticks" data-astdticks="'+id+'"></div>'+
    '<input type="range" class="astd-r0" min="0" max="1" value="0" step="1" aria-label="Start period">'+
    '<input type="range" class="astd-r1" min="0" max="1" value="1" step="1" aria-label="End period"></div>'+
    '<div class="sg-ends"><span data-astdend0="'+id+'"></span><span data-astdend1="'+id+'"></span></div></div>';
  var tbl='<div class="rs-collap" style="margin-top:8px"><button type="button" class="rs-collap-h"><span class="rs-collap-ic">▸</span> Data — what the chart draws</button>'+
    '<div class="rs-collap-b" hidden style="padding-top:8px"><div class="rs-tablewrap" data-astdtbl="'+id+'"></div></div></div>';
  return '<div class="ov-sec" data-astdblock="'+id+'">'+top+row2+leg+chart+slider+tbl+'</div>';
}
function aStdBlk(id){ return document.querySelector('[data-astdblock="'+id+'"]'); }
function aStdRender(id, derive){
  if(derive) _aStdDerive[id]=derive; derive=_aStdDerive[id]; if(!derive) return;
  var cv=aChartReady('astd-'+id); if(!cv) return;
  var st=_aStd[id]||(_aStd[id]={win:null,hidden:{},sel:null,modes:{}});
  var spec=derive(st); if(!spec) return;
  var n=spec.labels.length; if(!st.win || st.win[1]>n-1 || st.win[0]>st.win[1]) st.win=[0,n-1];
  var lo=st.win[0], hi=st.win[1], la=spec.lastAct==null?n-1:spec.lastAct;
  var labels=spec.labels.slice(lo,hi+1), yFmt=spec.yFmt||function(v){return v;};
  aDestroy('astd-'+id);
  var stk=spec.stacked?'s':undefined, needY2=false;   // engine supports bars + a secondary right axis (SAB dual-axis)
  var ds=spec.series.filter(function(s){ return !st.hidden[s.k]; }).map(function(s){
    var t=s.type||spec.type||'line'; if(s.yAxisID==='y2') needY2=true;
    if(t==='bar') return { type:'bar', label:s.label, data:s.data.slice(lo,hi+1), backgroundColor:s.data.slice(lo,hi+1).map(function(_,i){ return (lo+i)>la?acxRGBA(s.color,0.5):s.color; }), borderColor:'#fff', borderWidth:1, maxBarThickness:34, stack:stk, yAxisID:s.yAxisID||'y', order:s.order||3 };
    return { type:'line', label:s.label, data:s.data.slice(lo,hi+1), borderColor:s.color, backgroundColor:s.color, borderWidth:2.2, pointRadius:2, tension:0.2, spanGaps:false, yAxisID:s.yAxisID||'y', order:s.order||2,
      borderDash:s.dash?[5,4]:undefined, segment: s.fwdDash?{ borderDash:function(ctx){ return (lo+ctx.p1DataIndex)>la?[5,4]:undefined; } }:undefined }; });
  var anyBar=spec.series.some(function(s){ return (s.type||spec.type)==='bar'; }), y2f=spec.y2Fmt||function(v){return v;};
  var scales={ x:{ stacked:anyBar&&spec.stacked, grid:{ display:false }, ticks:{ font:{ size:11 } } },
    y:{ stacked:anyBar&&spec.stacked, position:'right', max:spec.yMax, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ font:{ size:11 }, callback:function(v){ return yFmt(v); } } } };
  if(needY2) scales.y2={ position:'right', weight:1, grid:{ display:false }, ticks:{ font:{ size:11 }, callback:function(v){ return y2f(v); } } };
  _aCharts['astd-'+id]=new Chart(cv.getContext('2d'),{ type:anyBar?'bar':'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(c){ var f=c.dataset.yAxisID==='y2'?y2f:yFmt; return c.dataset.label+': '+(c.parsed.y==null?'—':f(c.parsed.y))+((lo+c.dataIndex)>la?' (E)':''); } } } },
      scales:scales } });
  var blk=aStdBlk(id);
  if(blk){ var hm=spec.hideModes||[];   // contextual controls: hide groups that don't apply to the current view (SAB does this)
    blk.querySelectorAll('[data-astdmodeg]').forEach(function(g){ var cls=g.getAttribute('data-astdmodeg').split('|')[1]; g.style.display=hm.indexOf(cls)>=0?'none':'inline-flex'; }); }
  var leg=blk&&blk.querySelector('[data-astdleg="'+id+'"]');
  if(leg){
    if(spec.paired){   // one chip per source; toggling hides its bar AND its margin line. Caption disambiguates shapes.
      var seen={}, chips=[];
      spec.series.forEach(function(s){ var g=s.grp||s.k; if(seen[g])return; seen[g]=1;
        chips.push('<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdleggrp="'+id+'|'+g+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.src||s.label)+'</button>'); });
      leg.innerHTML=chips.join('')+'<span style="font-size:11px;color:var(--mu,#64748b);font-weight:600;margin-left:2px">Bars = $ amount &nbsp;·&nbsp; lines = margin (right axis)</span>';
    } else {
      leg.innerHTML=spec.series.map(function(s){ return '<button type="button" class="rs-leg'+(st.hidden[s.k]?' off':'')+'" data-astdlegk="'+id+'|'+s.k+'"><span class="ave-leg-act" style="background:'+s.color+'"></span>'+esc(s.label)+'</button>'; }).join('');
    }
  }
  // Collapsible data table (rule 3) — windowed + honours hidden series, like San's charts.
  var tblc=blk&&blk.querySelector('[data-astdtbl="'+id+'"]');
  if(tblc){ var vis=spec.series.filter(function(s){ return !st.hidden[s.k]; });
    var hd='<tr><th style="text-align:left;position:sticky;left:0;background:var(--card,#fff)">Series</th>'+labels.map(function(l){ return '<th style="text-align:right">'+esc(l)+'</th>'; }).join('')+'</tr>';
    var bd=vis.map(function(s){ return '<tr><td style="text-align:left;font-weight:700;position:sticky;left:0;background:var(--card,#fff)">'+esc(s.label)+'</td>'+s.data.slice(lo,hi+1).map(function(v){ return '<td style="text-align:right;font-variant-numeric:tabular-nums">'+(v==null?'—':esc(String(yFmt(v))))+'</td>'; }).join('')+'</tr>'; }).join('');
    tblc.innerHTML='<table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead>'+hd+'</thead><tbody>'+bd+'</tbody></table>'; }
  aStdSyncSlider(id, spec.labels, la);
  aStdWire(id);
  // Re-attach the X-window brush to the freshly-built chart each render (onmousedown assignment, not
  // addEventListener, so it replaces rather than stacks). onX windows the PERIOD; double-click resets.
  var cvv=document.getElementById('astd-'+id), chh=_aCharts['astd-'+id];
  if(cvv&&chh) rsAttachBrush(cvv, chh, function(i1,i2){ var w=_aStd[id].win, lo=w[0]; _aStd[id].win=[lo+i1, lo+i2]; aStdRender(id); }, null, function(){ _aStd[id].win=null; aStdRender(id); });
}
function aStdSyncSlider(id, labels, la){
  var blk=aStdBlk(id); if(!blk) return; var n=labels.length, w=_aStd[id].win;
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1'), fill=blk.querySelector('[data-astdfill]'), ticks=blk.querySelector('[data-astdticks]'), e0=blk.querySelector('[data-astdend0]'), e1=blk.querySelector('[data-astdend1]');
  if(r0){ r0.max=n-1; r0.value=w[0]; } if(r1){ r1.max=n-1; r1.value=w[1]; }
  if(fill){ fill.style.left=(w[0]/(n-1)*100)+'%'; fill.style.width=((w[1]-w[0])/(n-1)*100)+'%'; }
  if(e0) e0.textContent=labels[w[0]]||''; if(e1) e1.textContent=labels[w[1]]||'';
  if(ticks){ var h=''; for(var i=0;i<n;i++){ h+='<span class="rs-tick'+(i>=w[0]&&i<=w[1]?' on':'')+(i>la?' est':'')+'" style="left:'+(i/(n-1)*100)+'%"></span>'; } ticks.innerHTML=h; }
}
function aStdPresetWin(code, n, la){ switch(code){ case 'rep': return [0,la]; case 'fwd': return [Math.max(0,la),n-1];
  case 'l3': return [Math.max(0,la-2),la]; case 'l5': return [Math.max(0,la-4),la];
  case 'l4': return [Math.max(0,la-3),la]; case 'l8': return [Math.max(0,la-7),la]; default: return [0,n-1]; } }
function aStdWire(id){
  var blk=aStdBlk(id); if(!blk || blk._astdWired) return; blk._astdWired=true; var st=_aStd[id];
  blk.addEventListener('click', function(e){
    var mode=e.target.closest&&e.target.closest('[data-astdmode]'); if(mode){ var p=mode.getAttribute('data-astdmode').split('|'); st.modes[p[1]]=p[2];
      mode.parentNode.querySelectorAll('.rs-view').forEach(function(x){ x.classList.toggle('active',x===mode); }); aStdRender(id); return; }
    var lg=e.target.closest&&e.target.closest('[data-astdlegk]'); if(lg){ var k=lg.getAttribute('data-astdlegk').split('|')[1]; st.hidden[k]=!st.hidden[k]; aStdRender(id); return; }
    var lgg=e.target.closest&&e.target.closest('[data-astdleggrp]'); if(lgg){ var g=lgg.getAttribute('data-astdleggrp').split('|')[1], spc=_aStdDerive[id]&&_aStdDerive[id](st);
      if(spc){ var mem=spc.series.filter(function(s){ return (s.grp||s.k)===g; }), off=mem.every(function(s){ return st.hidden[s.k]; }); mem.forEach(function(s){ st.hidden[s.k]=!off; }); } aStdRender(id); return; }
    var rp=e.target.closest&&e.target.closest('[data-astdrange]'); if(rp){ var spec=_aStdDerive[id]&&_aStdDerive[id](st); var n=spec?spec.labels.length:2, la=spec&&spec.lastAct!=null?spec.lastAct:n-1;
      st.win=aStdPresetWin(rp.getAttribute('data-astdrange').split('|')[1], n, la); aStdRender(id); return; }
  });
  var sel=blk.querySelector('[data-astdsel]'); if(sel) sel.onchange=function(){ st.sel=sel.value; aStdRender(id); };
  var r0=blk.querySelector('.astd-r0'), r1=blk.querySelector('.astd-r1');
  function onSlide(){ var a=+r0.value, b=+r1.value; st.win=[Math.min(a,b),Math.max(a,b)]; aStdRender(id); }
  if(r0) r0.oninput=onSlide; if(r1) r1.oninput=onSlide;
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
function acxRGBA(hex,a){ var h=hex.replace('#',''); var r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16); return 'rgba('+r+','+g+','+b+','+a+')'; }

// ── Bottom Line ▸ Adjusted EBITDA & margin — the AMZN-standard dual-axis: $ as bars, margin as a line
// on a right y2 axis, with Actual / Summit / Consensus. Data from uberResults (act/summit/cons). UBER's
// EBITDA margin is measured against GROSS BOOKINGS (marginOf:'gb') — its house convention. ──
var UB_ACT='rgba(16,20,26,0.92)', UB_SUMMIT='#06C167', UB_CONS='#8A94A2';
function ubHexA(hex,a){ var h=hex.replace('#',''); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return 'rgba('+parseInt(h.slice(0,2),16)+','+parseInt(h.slice(2,4),16)+','+parseInt(h.slice(4,6),16)+','+a+')'; }
// §0.2-compliant profitability chart via the ported aStdScaffold engine: metric-family dropdown
// (Adj EBITDA / Operating income / FCF), Period mode, $ bars + margin lines on y2 (one legend chip per
// source, "lines = margin"), Actual/Summit/Consensus across full history, period slider, zoom, table.
function ubProfitBody(){
  return aStdScaffold({ id:'ubprofit', title:'Profitability & margins', height:360,
    metricSel:[{v:'ebitda',label:'Adjusted EBITDA',on:true},{v:'opinc',label:'Operating income (GAAP)'},{v:'fcf',label:'Free cash flow'}],
    modes:[{cls:'gran',label:'Period',opts:[{v:'y',label:'Annual',on:true},{v:'q',label:'Quarterly'}]}],
    presets:[['all','All'],['rep','Reported'],['fwd','Forward'],['l8','Last 8']] });
}
var UB_PF_LAB={ebitda:'Adj EBITDA',opinc:'Op. income',fcf:'FCF'};
function buildUbProfit(root){
  aStdRender('ubprofit', function(st){
    var metric=st.sel||'ebitda', gran=st.modes.gran==='q'?'q':'y', lab=UB_PF_LAB[metric];
    var V=uberResults.views[gran].metrics, num=V[metric]; if(!num) return null;
    var den=(metric==='fcf')?V.rev:V.gb, denLbl=(metric==='fcf')?'revenue':'gross bookings';
    var labels=num.periods.map(function(p){ return gran==='q'?p:('FY'+String(p).slice(2)); });
    var la=0; for(var i=0;i<num.act.length;i++) if(num.act[i]!=null) la=i;
    function amt(a){ return a.map(function(v){ return v==null?null:Math.round(v/100)/10; }); }
    function marg(a){ return a.map(function(v,i){ return (v==null||!den||den[i]==null||!den[i])?null:Math.round(v/den[i]*1000)/10; }); }
    // den is the metric object; index per source below
    function mrg(numArr,denArr){ return numArr.map(function(v,i){ return (v==null||!denArr||denArr[i]==null||!denArr[i])?null:Math.round(v/denArr[i]*1000)/10; }); }
    var series=[
      {k:'act$',grp:'act',src:'Actual',label:lab+' — Actual',color:ASTD_ACT,type:'bar',data:amt(num.act)},
      {k:'sum$',grp:'sum',src:'Summit',label:lab+' — Summit',color:ASTD_SUMMIT,type:'bar',data:amt(num.summit)},
      {k:'con$',grp:'con',src:'Consensus',label:lab+' — Consensus',color:ASTD_CONS,type:'bar',data:amt(num.cons)},
      {k:'actM',grp:'act',src:'Actual',label:'Margin — Actual',color:ASTD_ACT,type:'line',yAxisID:'y2',data:mrg(num.act,den.act)},
      {k:'sumM',grp:'sum',src:'Summit',label:'Margin — Summit',color:ASTD_SUMMIT,type:'line',yAxisID:'y2',data:mrg(num.summit,den.summit)},
      {k:'conM',grp:'con',src:'Consensus',label:'Margin — Consensus',color:ASTD_CONS,type:'line',yAxisID:'y2',dash:true,data:mrg(num.cons,den.cons)} ];
    return { labels:labels, lastAct:la, paired:true, type:'bar', yFmt:function(x){ return '$'+(x==null?'':x.toFixed(1))+'B'; }, y2Fmt:function(x){ return x+'%'; }, series:series, marginDen:denLbl };
  });
}
// ── Bottom Line ▸ Unit Economics — company-level funnel: Gross Bookings ($B bars) + Net Take Rate
// (% line, y2), Actual / Summit / Consensus. All three from uberResults (take rate = revenue ÷ GB). ──
function ubUnitDualBody(){
  return '<div class="ov-sec" style="margin:0 0 6px">'+
    '<div class="rs-block-top"><div class="rs-block-h">Company economics — gross bookings &amp; take rate</div></div>'+
    '<div class="ave-leg" id="ubUnitLeg" style="margin:2px 0 8px"></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:320px"><canvas id="ubChartUnit"></canvas></div></div>'+
  '</div>';
}
function buildUbUnit(root){
  var cv=document.getElementById('ubChartUnit'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartUnit'); var host=root||document;
  var Y=uberResults.views.y.metrics, gbM=Y.gb, revM=Y.rev;
  var labels=gbM.periods.map(function(p){ return 'FY'+String(p).slice(2); });
  var la=0; for(var i=0;i<gbM.act.length;i++) if(gbM.act[i]!=null) la=i;
  function bars(a){ return a.map(function(v){ return v==null?null:Math.round(v/1000*10)/10; }); }   // $B (GB in $M)
  function barBg(a,c){ return a.map(function(v,i){ return i>la?ubHexA(c,0.42):c; }); }
  function take(k){ return gbM[k].map(function(g,i){ return (g&&revM[k][i]!=null)?Math.round(revM[k][i]/g*1000)/10:null; }); }
  var srcs=[{k:'act',lab:'Actual',c:UB_ACT},{k:'summit',lab:'Summit',c:UB_SUMMIT},{k:'cons',lab:'Consensus (BBG)',c:UB_CONS}];
  var ds=[];
  srcs.forEach(function(s){ ds.push({ type:'bar', label:'Gross bookings — '+s.lab, data:bars(gbM[s.k]), backgroundColor:barBg(bars(gbM[s.k]),s.c), borderColor:'#fff', borderWidth:1, maxBarThickness:26, yAxisID:'y', order:3 }); });
  srcs.forEach(function(s){ ds.push({ type:'line', label:'Take rate — '+s.lab, data:take(s.k), borderColor:s.c, backgroundColor:s.c, borderWidth:2.4, pointRadius:2.2, tension:.2, spanGaps:false, yAxisID:'y2', order:1, borderDash:s.k==='cons'?[5,4]:undefined }); });
  _charts['ubChartUnit']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c){ var e=(c.dataIndex>la)?' (E)':''; return c.dataset.label+': '+(c.parsed.y==null?'—':(c.dataset.yAxisID==='y2'?c.parsed.y+'%':'$'+c.parsed.y.toFixed(0)+'B'))+e; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} },
        y:{ position:'right', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{ font:{size:10.5}, callback:function(v){ return '$'+v+'B'; } } },
        y2:{ position:'right', grid:{display:false}, ticks:{ font:{size:10.5}, callback:function(v){ return v+'%'; } } } } }
  });
  var leg=host.querySelector('#ubUnitLeg');
  if(leg) leg.innerHTML=srcs.map(function(s){ return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--mu);margin-right:14px"><span style="width:13px;height:13px;border-radius:3px;background:'+s.c+'"></span>'+s.lab+'</span>'; }).join('')+'<span style="font-size:11px;color:var(--mu)">Bars = gross bookings ($B) &nbsp;·&nbsp; lines = net take rate (right axis)</span>';
}
// ── Bottom Line ▸ The bridge — revenue → operating income, by functional cost line. Floating-bar
// waterfall, reconciled from uber-bbg (rev − cost of revenue − ops − R&D − S&M − G&A − D&A = GAAP OI,
// ties exactly). Pick an actual year or a consensus forward year. ──
var UB_BR_COST=[{k:'cogs',lab:'Cost of revenue'},{k:'fulfillment',lab:'Operations & support'},{k:'techInfra',lab:'R&D'},{k:'marketing',lab:'Sales & marketing'},{k:'gAdmin',lab:'G&A'},{k:'da',lab:'D&A'}];
var UB_BR_YEARS=[{v:2,lab:'FY25'},{v:3,lab:'FY26E'},{v:4,lab:'FY27E'},{v:5,lab:'FY28E'}];
function ubBridgeBody(){
  var pills=UB_BR_YEARS.map(function(y){ return '<button type="button" class="rs-view'+(y.v===3?' active':'')+'" data-ubbr="'+y.v+'">'+y.lab+'</button>'; }).join('');
  return '<div class="ov-sec" data-ubbrblock="1">'+
    '<div class="rs-block-top"><div class="rs-block-h">The bridge — revenue → operating income</div></div>'+
    '<div class="rs-block-modes"><div class="rs-modes"><div style="display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px 0"><span class="rs-quick-l">Year</span><div class="rs-views">'+pills+'</div></div></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:320px"><canvas id="ubChartBridge"></canvas></div></div>'+
    '<div class="ave-subh-note" id="ubBridgeNote" style="margin-top:8px"></div>'+
  '</div>';
}
function buildUbBridge(root){
  var cv=document.getElementById('ubChartBridge'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartBridge'); var host=root||document;
  var yb=host.querySelector('[data-ubbr].active'), yi=yb?+yb.getAttribute('data-ubbr'):3;
  var B=uberBBG.is; function val(k){ var s=B[k]; if(!s) return null; var arr=s.a.concat(s.f); return arr[yi]; }
  var rev=val('rev'); if(rev==null){ return; }
  function b(x){ return x==null?0:x/1000; }
  var run=b(rev), steps=[{label:'Revenue', lo:0, hi:run, c:UB_ACT, val:b(rev)}];
  UB_BR_COST.forEach(function(cl){ var d=b(val(cl.k)); var lo=run-d; steps.push({label:cl.lab, lo:Math.min(lo,run), hi:Math.max(lo,run), c:'#8A94A2', val:-d}); run=lo; });
  var oiRep=b(val('operatingIncome')), diff=oiRep-run;   // reconcile to reported OI (forward line items don't perfectly sum)
  if(Math.abs(diff)>=0.05){ var lo=run+diff; steps.push({label:'Other', lo:Math.min(run,lo), hi:Math.max(run,lo), c:'#C4CCD6', val:diff}); run=lo; }
  steps.push({label:'Operating income', lo:0, hi:run, c:'#06965A', val:run});
  var yl=UB_BR_YEARS.filter(function(y){return y.v===yi;})[0].lab;
  _charts['ubChartBridge']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:steps.map(function(s){return s.label;}), datasets:[{ data:steps.map(function(s){return [s.lo,s.hi];}), backgroundColor:steps.map(function(s){return s.c;}), borderColor:'#fff', borderWidth:1, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c){ var s=steps[c.dataIndex]; return (s.val>=0?'+$':'−$')+Math.abs(s.val).toFixed(1)+'B'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10},maxRotation:35,minRotation:0} }, y:{ position:'right', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{font:{size:10.5},callback:function(v){return '$'+v+'B';}} } } },
    plugins:[{ id:'ubbrlab', afterDatasetsDraw:function(chart){ var ctx=chart.ctx, meta=chart.getDatasetMeta(0);
      meta.data.forEach(function(bar,i){ var s=steps[i]; ctx.save(); ctx.textAlign='center'; ctx.font='700 10px Inter, sans-serif'; ctx.fillStyle=(s.val<0?'#8A94A2':'#1E2733');
        ctx.fillText((s.val>=0?'':'−')+'$'+Math.abs(s.val).toFixed(1)+'B', bar.x, bar.y-6); ctx.restore(); }); } }]
  });
  var note=host.querySelector('#ubBridgeNote');
  if(note) note.innerHTML='<b>'+yl+'</b> — $'+b(rev).toFixed(0)+'B revenue converts to <b>$'+run.toFixed(1)+'B operating income</b> ('+(run/b(rev)*100).toFixed(1)+'% margin) after cost of revenue and the four opex lines. Reconciled from BBG consensus (Adj EBITDA adds back D&A + SBC on top of GAAP operating income). '+(yi>2?'Forward = consensus.':'');
}
// ── Bottom Line ▸ Insurance & FCF — free cash flow ($B bars) + FCF conversion (% of Adj EBITDA, y2),
// Actual / Summit / Consensus, all from uberResults. ──
function buildUbFcf(root){
  var cv=document.getElementById('ubChartFcf'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartFcf'); var host=root||document;
  var Y=uberResults.views.y.metrics, fcfM=Y.fcf, ebM=Y.ebitda, periods=fcfM.periods.slice();
  var labels=periods.map(function(p){ return 'FY'+String(p).slice(2); });
  var la=0; for(var i=0;i<fcfM.act.length;i++) if(fcfM.act[i]!=null) la=i;
  // Summit doesn't publish a forward FCF here → Actual (uberResults) + Consensus (uber-bbg). No fabricated Summit line.
  var consFcf=ubBbgIsOnAxis('fcf',periods), consEb=ubBbgIsOnAxis('ebitda',periods);
  function bars(a){ return a.map(function(v){ return v==null?null:Math.round(v/100)/10; }); }
  function barBg(a,c){ return a.map(function(v,i){ return i>la?ubHexA(c,0.42):c; }); }
  var srcs=[{lab:'Actual',c:UB_ACT,fcf:fcfM.act,eb:ebM.act,dash:false},{lab:'Consensus (BBG)',c:UB_CONS,fcf:consFcf,eb:consEb,dash:true}];
  var ds=[];
  srcs.forEach(function(s){ ds.push({ type:'bar', label:'FCF — '+s.lab, data:bars(s.fcf), backgroundColor:barBg(bars(s.fcf),s.c), borderColor:'#fff', borderWidth:1, maxBarThickness:30, yAxisID:'y', order:3 }); });
  srcs.forEach(function(s){ var conv=s.fcf.map(function(v,i){ return (v!=null&&s.eb[i])?Math.round(v/s.eb[i]*100):null; });
    ds.push({ type:'line', label:'Conversion — '+s.lab, data:conv, borderColor:s.c, backgroundColor:s.c, borderWidth:2.4, pointRadius:2.2, tension:.2, spanGaps:false, yAxisID:'y2', order:1, borderDash:s.dash?[5,4]:undefined }); });
  _charts['ubChartFcf']=new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c){ var e=(c.dataIndex>la)?' (E)':''; return c.dataset.label+': '+(c.parsed.y==null?'—':(c.dataset.yAxisID==='y2'?c.parsed.y+'%':'$'+c.parsed.y.toFixed(1)+'B'))+e; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} },
        y:{ position:'right', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{ font:{size:10.5}, callback:function(v){ return '$'+v+'B'; } } },
        y2:{ position:'right', grid:{display:false}, ticks:{ font:{size:10.5}, callback:function(v){ return v+'%'; } } } } }
  });
  var leg=host.querySelector('#ubFcfLeg');
  if(leg) leg.innerHTML=srcs.map(function(s){ return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--mu);margin-right:14px"><span style="width:13px;height:13px;border-radius:3px;background:'+s.c+'"></span>'+s.lab+'</span>'; }).join('');
}
function ubMarginsBody(c){
  return ubProfitBody()+ubBridgeBody()+
    '<p class="ov-lede">Profitability & cash margins as a % of revenue — gross, operating and net, plus Adjusted EBITDA, CFO and FCF. The turnaround reads cleanest in <b>operating</b> and <b>EBITDA</b> margin, which climb every year from deeply negative (FY21) into the high-teens.</p>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of revenue) <span>· fiscal years · FY26E = estimate</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMargins"></canvas></div></div>'+
    '<div class="ave-subh-note" id="ubMrgNote" style="margin-top:8px">'+UB_MRG_NOTE_FB+'</div>';
}
function buildUbMargins(){
  var cv=document.getElementById('ubChartMargins'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartMargins');
  var labels=_ubMrgRows.map(function(r){ return r.fy; });
  var projIdx=_ubMrgRows.reduce(function(a,r,i){ return r.proj?i:a; }, -1);
  var ds=UB_MRG_METRICS.map(function(m){ return { label:m.label, data:_ubMrgRows.map(function(r){ return r[m.key]; }), borderColor:m.color, backgroundColor:m.color, borderWidth:2, tension:.25, spanGaps:true, fill:false,
    pointRadius:_ubMrgRows.map(function(r){ return r.proj?4:2; }), pointStyle:_ubMrgRows.map(function(r){ return r.proj?'rectRot':'circle'; }),
    segment:{ borderDash:function(ctx){ return ctx.p1DataIndex===projIdx?[5,4]:undefined; } } }; });
  _charts['ubChartMargins']=new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return l==='FY26E'?'FY26E · estimate':l; }, label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
      scales:{ y:{ ticks:{ callback:function(v){ return v+'%'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
  ubLoadMargins();
}
function ubLoadMargins(){
  if(_ubMrgSrc==='massive') return; // already replaced with live data
  import('../api.js').then(function(api){ return api.fetchMargins?api.fetchMargins('UBER'):null; }).then(function(res){
    if(!res||!res.success||!res.data||res.data.length<3) return; // keep the fallback chart
    var proj=UB_MRG_FALLBACK[UB_MRG_FALLBACK.length-1];
    _ubMrgRows=res.data.concat(proj&&proj.proj?[proj]:[]);
    _ubMrgSrc='massive';
    var note=document.getElementById('ubMrgNote'); if(note) note.innerHTML=UB_MRG_NOTE_LIVE;
    buildUbMargins();
  }).catch(function(){ /* keep the fallback */ });
}
// ── Valuation ▸ Capital Allocation — DATA-BACKED from the Summit model snapshot (FY actuals,
// $M): FCF, share repurchases, SBC and shares outstanding. Dividend/buyback framing verified. ──
function ubCapAllocBody(c){
  var R=[
    {fy:'FY22', fcf:390,  bb:0,    sbc:1793, sh:2061},
    {fy:'FY23', fcf:3362, bb:0,    sbc:1935, sh:2122},
    {fy:'FY24', fcf:6895, bb:1252, sbc:1796, sh:2141},
    {fy:'FY25', fcf:9763, bb:6523, sbc:1826, sh:2106}
  ];
  var bb=function(m){ if(m==null) return '—'; var a=Math.abs(m), s=m<0?'−':''; return a>=1000? s+'$'+(a/1000).toFixed(1)+'B' : s+'$'+a+'M'; };
  var last=R[3], prev=R[2];
  var payout=Math.round(last.bb/last.fcf*100);
  var shChg=(last.sh/prev.sh-1)*100;
  var h='<p class="ov-lede">How Uber deploys the cash the turnaround now throws off: <b>no dividend</b>, with <b>share repurchases</b> the priority — funded by a fast-growing FCF base on a now investment-grade balance sheet.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Dividend</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">never paid</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 buybacks</div><div class="ov-kpi-v">$6.5B</div><div class="ov-kpi-d muted">~'+payout+'% of FCF</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 SBC</div><div class="ov-kpi-v">$1.8B</div><div class="ov-kpi-d muted">~flat since FY22</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Shares out</div><div class="ov-kpi-v">2.11B</div><div class="ov-kpi-d muted">▼ '+Math.abs(shChg).toFixed(1)+'% YoY</div></div>'+
  '</div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-t">FCF, buybacks &amp; share count <span>· FY22–FY28E · faded = consensus</span></div><div class="ov-chart-wrap ovs-tall" style="min-height:300px"><canvas id="ubChartCapAlloc"></canvas></div></div>';
  h+='<div class="ave-subh-note" style="margin:8px 0 4px">Bars = free cash flow (green) &amp; buybacks (navy), $B left; line = diluted shares (M, right). Consensus keeps buybacks ~$6–8B/yr, driving the share count down to ~1,976M by FY28E. <span style="color:#B7791F">Actuals + BBG consensus (uber-bbg).</span></div>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Fiscal year</th><th style="text-align:right;padding:7px 10px">Free cash flow</th><th style="text-align:right;padding:7px 10px">Buybacks</th><th style="text-align:right;padding:7px 10px">SBC</th><th style="text-align:right;padding:7px 10px">Shares out (M)</th></tr></thead><tbody>'+
    R.map(function(r){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:700">'+r.fy+'</td><td style="text-align:right;padding:7px 10px">'+bb(r.fcf)+'</td><td style="text-align:right;padding:7px 10px">'+(r.bb?bb(-r.bb):'—')+'</td><td style="text-align:right;padding:7px 10px">'+bb(-r.sbc)+'</td><td style="text-align:right;padding:7px 10px">'+r.sh.toLocaleString()+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+=sec('How management frames it — the capital-allocation hierarchy', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Management lays out an explicit <b>priority stack</b> (Q4 2025 remarks): <b>(1)</b> reinvest in growth where LTV/CAC works · <b>(2)</b> fund the <b>AV</b> strategy (asset-light, partner-financed) · <b>(3)</b> selective <b>bolt-on M&A</b> at a "high bar" · <b>(4)</b> <b>return excess capital</b> via buybacks · <b>(5)</b> hold a <b>solid investment-grade</b> rating. The intent has <b>hardened over time</b>: at the Feb 2024 launch buybacks were meant to "partially offset stock-based compensation," but by 2025 the language is "<b>steadily reduce our share count</b>… opportunistic and aggressive buyers during dislocations."</div>');
  h+=sec('Repurchase program & how much room', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Authorizations: <b>$7B</b> inaugural (Feb 2024, now exhausted "faster than expected"), a <b>$1.5B</b> accelerated repurchase (Jan 2025), then an added <b>$20B</b> (Aug 2025) — roughly <b>~$19B still authorized</b>. Actual buybacks scaled <b>$0 → $1.3B (FY24) → $6.5B (FY25)</b>, about <b>'+payout+'% of FCF</b>. The tap can stay open: FY25 FCF was <b>$9.8B (+42%)</b>, and Uber holds ~<b>$9.2B of mostly-listed equity stakes</b> (Aurora, Didi, Grab) it plans to monetize opportunistically as <b>extra firepower</b> — so the constraint is willingness, not capacity. Signaled direction: <b>steady-to-more</b>, targeting ongoing share-count reduction.</div>');
  h+=sec('Dividend policy', '<div class="ov-callout">Uber has <b>never paid a dividend</b> and has not signaled one. All shareholder return runs through <b>buybacks</b>, alongside maintaining the newly investment-grade balance sheet.</div>');
  h+=sec('SBC & dilution — the honest history', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">SBC has <b>plateaued around ~$1.8B/yr</b> since FY22 while revenue nearly doubled, so as a share of revenue it <b>fell from ~7.4% (2020) to ~3.5% (2025)</b> — a shrinking drag. But dilution was <b>not</b> offset for most of Uber’s life: with <b>$0 of buybacks until 2024</b>, the diluted share count <b>rose every year from 2020 to 2024</b> (~1,753M → ~2,151M). <b>FY25 is the first year it actually fell</b> ('+prev.sh.toLocaleString()+'M → '+last.sh.toLocaleString()+'M, ≈ −1.4%) as $6.5B of repurchases finally out-ran SBC. So the accurate read is not "buybacks always offset SBC" — it is that they <b>failed to for years</b> and have only <b>just begun to more-than-offset</b> it. The full historical picture is charted under <b>Governance & SBC</b>.</div>');
  h+='<div class="ov-foot">Buyback authorizations and framework: Uber 8-Ks / Q4 2025 earnings materials. FY actuals (FCF, repurchases, SBC, shares): Summit model. Remaining authorization ~$19B is an estimate ($20B less ~$0.8B drawn beyond the exhausted $7B program).</div>';
  return h;
}
// ── Valuation ▸ Capital Allocation — FCF & buybacks ($B bars) + diluted shares (M line, y2), actuals +
// BBG consensus forward. Shows FCF funding a growing buyback that finally shrinks the share count. ──
function buildUbCapAlloc(root){
  var cv=document.getElementById('ubChartCapAlloc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartCapAlloc'); var host=root||document, B=uberBBG.is;
  var yrs=['FY22','FY23','FY24','FY25','FY26E','FY27E','FY28E'], la=3;
  function babs(v){ return v==null?null:Math.abs(v); }
  var fcf=[390].concat(B.fcf.a, B.fcf.f).map(function(v){ return v==null?null:Math.round(v/100)/10; });
  var bbk=[0].concat(B.buyback.a.map(babs), B.buyback.f.map(babs)).map(function(v){ return v==null?null:Math.round(v/100)/10; });
  var sh=[2061].concat(B.dilShares.a, B.dilShares.f).map(function(v){ return v==null?null:Math.round(v); });
  function fade(arr,c){ return arr.map(function(_,i){ return i>la?ubHexA(c,0.42):c; }); }
  _charts['ubChartCapAlloc']=new Chart(cv.getContext('2d'),{ data:{ labels:yrs, datasets:[
    { type:'bar', label:'Free cash flow', data:fcf, backgroundColor:fade(fcf,UB_SUMMIT), borderColor:'#fff', borderWidth:1, maxBarThickness:24, yAxisID:'y', order:3 },
    { type:'bar', label:'Buybacks', data:bbk, backgroundColor:fade(bbk,UB_ACT), borderColor:'#fff', borderWidth:1, maxBarThickness:24, yAxisID:'y', order:3 },
    { type:'line', label:'Diluted shares (M)', data:sh, borderColor:'#7A5AF8', backgroundColor:'#7A5AF8', borderWidth:2.4, pointRadius:2.2, tension:.2, yAxisID:'y2', order:1, segment:{ borderDash:function(ctx){ return ctx.p1DataIndex>la?[5,4]:undefined; } } } ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10}}}, tooltip:{ callbacks:{ label:function(c){ var e=c.dataIndex>la?' (E)':''; return c.dataset.yAxisID==='y2'? c.dataset.label+': '+c.parsed.y.toLocaleString()+'M'+e : c.dataset.label+': $'+c.parsed.y.toFixed(1)+'B'+e; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} },
        y:{ position:'left', beginAtZero:true, grid:{color:'#EEF2F7'}, ticks:{font:{size:10.5},callback:function(v){return '$'+v+'B';}} },
        y2:{ position:'right', grid:{display:false}, suggestedMin:1900, suggestedMax:2200, ticks:{font:{size:10.5},callback:function(v){return v.toLocaleString();}} } } }
  });
}
// ── Valuation ▸ Balance Sheet — downside/solidity view, sourced from Uber's Q1 2026 10-Q
// (SEC EDGAR, condensed consolidated balance sheet as of March 31, 2026; $M). WORK IN PROGRESS. ──
var UB_STAKES=[['Didi',2337],['Grab',1961],['Aurora',1343],['Other non-marketable',1800],['Other marketable',569],['Related-party note',99],['Equity-method',268]];
function buildUbBal(){
  var cv=document.getElementById('ubChartBal'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartBal');
  var cols=['#10141A','#06C167','#7A5AF8','#3A7BD5','#F2A73B','#9AA4B0','#C0392B'];
  _charts['ubChartBal']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:UB_STAKES.map(function(s){return s[0];}), datasets:[{ label:'Carrying value ($M)', data:UB_STAKES.map(function(s){return s[1];}), backgroundColor:UB_STAKES.map(function(s,i){return cols[i%cols.length];}), borderWidth:0 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' $'+(ctx.parsed.x/1000).toFixed(2)+'B'; } } } },
      scales:{ x:{ ticks:{ callback:function(v){ return '$'+(v/1000).toFixed(1)+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} }, y:{ grid:{display:false}, ticks:{font:{size:10}} } } }
  });
}
function ubBalanceBody(c){
  var cash=5558, sti=533, inv=8109, eqm=268, debt=10514, insST=3467, insLT=9437,
      restrCash=2552, restrInv=9026, equity=24751, shares=2036.4;
  var stakes=inv+eqm;                       // 8,377 — marked equity-investment portfolio
  var insTot=insST+insLT;                   // 12,904 — total insurance reserve
  var netDebt=cash+sti-debt;                // −4,423 — core net cash/(debt)
  var netWithStakes=cash+sti+stakes-debt;   // 3,954 — including the stakes
  var bvps=equity/shares;                   // ~12.15 book value / share
  var B=function(m){ var a=Math.abs(m),s=m<0?'−':''; return s+'$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; };
  var cell=function(m){ var a=Math.abs(m).toLocaleString(); return m<0?'('+a+')':a; };
  var LI=[
    ['Cash & cash equivalents', cash],
    ['Short-term investments', sti],
    ['Long-term investment portfolio <span class="muted">(Didi, Grab, Aurora + other)</span>', inv],
    ['Equity-method investments', eqm],
    ['Total debt <span class="muted">(senior + convertible notes)</span>', -debt],
    ['Insurance reserves <span class="muted">(short + long-term)</span>', -insTot],
    ['Total stockholders&rsquo; equity', equity]
  ];
  var STK=UB_STAKES;
  var h='<div style="border:1px solid rgba(232,160,12,0.45);background:linear-gradient(180deg,rgba(232,160,12,0.10),rgba(232,160,12,0.03));border-radius:12px;padding:12px 15px;margin:0 0 14px;display:flex;align-items:flex-start;gap:10px">'+
    '<span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#B7791F;background:rgba(232,160,12,0.18);border-radius:10px;padding:3px 10px;flex:none">Work in progress</span>'+
    '<span style="font-size:11.5px;color:var(--navy);line-height:1.5">This Balance Sheet section is <b>still being developed.</b> The line items and net-cash math below are pulled from Uber’s Q1 2026 10-Q, but the deeper analysis (stake-by-stake marks, downside stress, tangible-book bridge) is <b>not yet complete</b> — treat it as a draft.</span></div>';
  h+='<p class="ov-lede">How much value protects the equity on the way down. Uber runs a modest <b>net-debt</b> position on the core balance sheet, but a <b>marked ~'+B(stakes)+' equity-stake portfolio</b> more than covers it — while the big <b>~'+B(insTot)+' insurance reserve</b> is separately funded and is not a free-cash claim.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Net cash / (debt)</div><div class="ov-kpi-v">'+B(netDebt)+'</div><div class="ov-kpi-d muted">cash + ST inv '+B(cash+sti)+' − debt '+B(debt)+'</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Equity stakes (marked)</div><div class="ov-kpi-v">'+B(stakes)+'</div><div class="ov-kpi-d muted">Didi, Grab, Aurora + other</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Insurance reserve</div><div class="ov-kpi-v">'+B(insTot)+'</div><div class="ov-kpi-d muted">funded by ~'+B(restrCash+restrInv)+' restricted assets</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Stockholders&rsquo; equity</div><div class="ov-kpi-v">'+B(equity)+'</div><div class="ov-kpi-d muted">~$'+bvps.toFixed(0)+'/sh book · '+shares.toFixed(0)+'M sh</div></div>'+
  '</div>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Key line item — as of Mar 31, 2026</th><th style="text-align:right;padding:7px 10px">$M</th></tr></thead><tbody>'+
    LI.map(function(r){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px">'+r[0]+'</td><td style="text-align:right;padding:7px 10px;font-variant-numeric:tabular-nums;font-weight:700">'+cell(r[1])+'</td></tr>'; }).join('')+
    '<tr style="border-top:2px solid var(--bdr)"><td style="padding:7px 10px;font-weight:800">Core net cash / (debt)</td><td style="text-align:right;padding:7px 10px;font-weight:800;color:#B23A2E">'+cell(netDebt)+'</td></tr>'+
    '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:800">Net cash incl. equity stakes</td><td style="text-align:right;padding:7px 10px;font-weight:800;color:#06965A">'+cell(netWithStakes)+'</td></tr>'+
  '</tbody></table></div>';
  h+=sec('The equity-stake portfolio', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The legacy of exiting cash-burning markets into shares: a <b>'+B(stakes)+'</b> portfolio carried at marked value. The largest positions (Mar 31, 2026): '+STK.slice(0,3).map(function(s){return '<b>'+s[0]+' '+B(s[1])+'</b>';}).join(' · ')+'. Grab and Aurora are <b>marketable</b> (mark-to-market each quarter — a major source of GAAP net-income swings), while Didi is <b>non-marketable</b>. These stakes are non-core assets that could be monetized, and they flip Uber from ~'+B(netDebt)+' core net debt to <b>~'+B(netWithStakes)+' net-positive</b>.</div>'+
    '<div class="ov-chart-card" style="margin-top:10px"><div class="ov-chart-t">Equity-stake portfolio <span>· carrying value $M · Mar 31, 2026</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartBal"></canvas></div></div>'+
    '<div class="ave-subh-note" style="margin-top:6px">Per-stake carrying values are approximate — Uber discloses the ~$9.2B aggregate but does not itemize each holding every quarter, so the split is directional.</div>');
  h+=sec('Why the insurance reserve is not a free claim', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The ~'+B(insTot)+' insurance reserve (short-term '+B(insST)+' + long-term '+B(insLT)+') is a real liability, but it is <b>separately funded</b> by ~'+B(restrCash+restrInv)+' of <b>restricted cash and investments</b> set aside to pay claims (the Aleka float — see Insurance). So it does not compete with the ~$9.8B free-cash-flow engine for capital.</div>');
  h+='<div class="ov-callout"><b>Solidity read:</b> the equity is protected less by hard asset value than by cash generation — Uber sits at only ~'+B(netDebt)+' core net debt, holds ~'+B(stakes)+' of monetizable stakes on top, carries an <b>investment-grade</b> rating, and converts ~100%+ of Adj. EBITDA to free cash flow (~$9.8B TTM). The main balance-sheet caveat is that <b>~'+B(equity)+' of book equity leans on ~$8.9B of goodwill and ~$10.8B of deferred-tax assets</b>, so tangible book is thin — the story is the cash flow, not the salvage value.</div>';
  h+='<div class="ov-foot">Source: Uber Q1 2026 Form 10-Q (SEC EDGAR), condensed consolidated balance sheet and investments note, as of March 31, 2026. Net-cash figures computed from reported line items. Free-cash-flow / rating context from FY2025 results.</div>';
  return h;
}
// ── Top Line ▸ TAM — Uber's OWN market framing from its Feb 14, 2024 Investor Update
// (Investor Day): "multiple multi-trillion-dollar markets" at low-single-digit penetration. ──
function ubTamBody(c){
  function tamTile(l,v,s){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+l+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d muted">'+s+'</div></div>'; }
  function penBar(label,num,den,sub,col){ var pct=num/den*100; return '<div style="margin:10px 0 14px">'+
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><span style="font-size:12.5px;font-weight:800;color:var(--navy)">'+label+' &mdash; ~$'+num+'B today</span><span style="font-size:13px;font-weight:900;color:'+col+'">'+pct.toFixed(1)+'%</span></div>'+
    '<div style="height:22px;background:#EEF2F7;border-radius:6px;overflow:hidden"><div style="height:100%;width:'+Math.max(pct,0.8).toFixed(1)+'%;background:'+col+';border-radius:6px"></div></div>'+
    '<div style="font-size:11px;color:var(--mu);margin-top:4px">'+sub+'</div></div>'; }
  var h='<p class="ov-lede">Uber deliberately does <b>not</b> pin one headline TAM dollar — it frames itself as operating in <b>&ldquo;multiple multi-trillion-dollar markets&rdquo;</b> at <b>low-single-digit penetration</b>. And the runway is genuinely quantifiable: today ride-hailing and delivery are each only a <b>couple of percent</b> of the everyday spend they are replacing.</p>';
  // Big-number TAM tiles — Uber's own S-1 sizing + today's market sizes
  h+='<div class="ov-kpis">'+
    tamTile('Personal Mobility TAM','$5.7T','Uber S-1 (2019), global · &lt;30-mi SAM ~$2.5T')+
    tamTile('Delivery / local-commerce TAM','$2.8T','Uber S-1 (2019) — Eats opportunity')+
    tamTile('US ride-hailing today','~$28.5B','2024 market · Uber ~76% / Lyft ~24%')+
    tamTile('US food delivery today','~$53B','2024 market · restaurant meals')+
  '</div>';
  // The runway, in two pictures
  h+=sec('The runway, in two pictures — how little of the everyday spend Uber has taken',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">The bars are almost empty on purpose: that emptiness <b>is</b> the opportunity.</div>'+
    penBar('Ride-hailing', 28.5, 1800, 'of the ~$1.8T Americans spend on <b>personal transportation</b> each year', MOB)+
    penBar('Delivery', 53, 2000, 'of the ~$2.0T Americans spend at <b>restaurants + grocery</b> each year', DEL)+
    '<div class="ov-fynote" style="margin-top:6px">On a trips basis it is starker: US ride-hailing is on the order of <b>~3.5–4B trips/yr</b> — <b>well under 1%</b> of the ~450–500B personal trips Americans take. The overwhelming majority of travel is still the self-driven personal car, which management names as its <b>real competitor</b>. (Lyft, US + Canada only, alone did <b>828M rides in 2024</b>, +17%.)</div>');
  // Uber's own penetration framing
  h+=sec('How Uber sizes it — population × usage', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Rather than a single market-research number, Uber anchors TAM to <b>population × usage</b>: the adult population of the ~70 countries it operates in, times the trips and orders those people could shift onto the platform. On that basis <b>fewer than 5%</b> of the 18+ population in its markets are monthly users, using the platform <b>just under 6 times a month</b>, with <b>~half</b> taking only one or two trips. Under 20% of adults use it even in Uber’s most saturated countries.</div>');
  // Delivery TAM quantified
  h+=sec('Delivery TAM — how to actually quantify it', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Size it in <b>three nested layers</b>: <b>(1) restaurant meals</b> — US ~$53B / global ~$289B (2024); <b>(2) + grocery</b>; <b>(3) all local commerce</b> — restaurants + grocery + retail + convenience. Uber Delivery gross bookings are already ~<b>$74B</b> (2024, global) and it now frames the segment as <b>"local commerce,"</b> where grocery/retail is the fastest-growing slice. The clean denominator: ~<b>$2T</b> of US restaurant + grocery spend, only ~<b>2–3% delivered online</b> today — plus a high-margin <b>advertising</b> layer stacked on top.</div>');
  h+='<div class="ov-callout"><b>Sourcing note:</b> the trillion-dollar TAMs are <b>Uber’s own S-1 (2019)</b> sizing; the <b>&lt;5% penetration</b> framing is Uber’s Feb 2024 Investor Update. US market sizes and denominators are third-party (GMInsights, Grand View, National Restaurant Association, Census, BLS, 2024). Trip-penetration figures are estimates — neither Uber nor Lyft publishes clean US-only trip counts.</div>';
  h+='<div class="ov-foot">Sources: Uber S-1 (2019) and Feb 14, 2024 Investor Update (TAM & penetration); US ride-hailing/food-delivery market sizes and denominators from GMInsights, Grand View Research, National Restaurant Association, US Census and BLS (2024). Lyft rides from Lyft FY2024 results. Trip counts are estimates.</div>';
  return h;
}
// ── Management ▸ Governance & SBC — vetted governance facts (share class, board, pay) from the
// in-repo management config + SBC from the Summit model. Board detail lives in Executives & Board. ──
var UB_SBC_HIST={ yrs:['FY20','FY21','FY22','FY23','FY24','FY25'], sbcPct:[7.4,6.7,5.6,5.2,4.1,3.5], shares:[1793,2006,2061,2122,2141,2106] };
function buildUbSbc(){
  var cv=document.getElementById('ubChartSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ubChartSbc');
  // Actuals FY20-25 (UB_SBC_HIST) + consensus forward FY26-28E (uber-bbg): diluted shares keep falling as
  // buybacks out-run SBC, and SBC % of revenue keeps shrinking. Forward faded / dashed.
  var bbg=uberBBG.is, fShares=bbg.dilShares?bbg.dilShares.f:[null,null,null];
  var fPct=(bbg.sbc&&bbg.rev)?bbg.sbc.f.map(function(v,i){ var r=bbg.rev.f[i]; return (v!=null&&r)?Math.round(v/r*1000)/10:null; }):[null,null,null];
  var yrs=UB_SBC_HIST.yrs.concat(['FY26E','FY27E','FY28E']);
  var shares=UB_SBC_HIST.shares.concat(fShares), sbcPct=UB_SBC_HIST.sbcPct.concat(fPct), la=UB_SBC_HIST.yrs.length-1;
  _charts['ubChartSbc']=new Chart(cv.getContext('2d'),{
    data:{ labels:yrs, datasets:[
      { type:'bar', label:'Shares out (M)', data:shares, backgroundColor:shares.map(function(_,i){ return i>la?'rgba(58,123,213,0.12)':'rgba(58,123,213,0.26)'; }), borderColor:'#3A7BD5', borderWidth:1, yAxisID:'y', order:2 },
      { type:'line', label:'SBC % of revenue', data:sbcPct, borderColor:'#7A5AF8', backgroundColor:'#7A5AF8', borderWidth:2.5, tension:.3, pointRadius:3, yAxisID:'y1', order:1, segment:{ borderDash:function(ctx){ return ctx.p1DataIndex>la?[5,4]:undefined; } } }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ var e=ctx.dataIndex>la?' (E)':''; return ctx.dataset.yAxisID==='y1'? ' '+ctx.dataset.label+': '+ctx.parsed.y.toFixed(1)+'%'+e : ' '+ctx.dataset.label+': '+ctx.parsed.y.toLocaleString()+'M'+e; } } } },
      scales:{ y:{ position:'left', title:{display:true,text:'Shares out (M)',font:{size:9}}, ticks:{font:{size:9}}, grid:{color:'#EEF2F7'}, suggestedMin:1600 },
        y1:{ position:'right', title:{display:true,text:'SBC % of revenue',font:{size:9}}, ticks:{callback:function(v){return v+'%';},font:{size:9}}, grid:{display:false}, min:0 },
        x:{ grid:{display:false}, ticks:{font:{size:10}} } } }
  });
}
function ubGovBody(c){
  var k=[
    ['Share & voting','1 vote / share','No dual-class or founder control'],
    ['Board','9 of 10 independent','Chair ≠ CEO · annual elections'],
    ['CEO pay · FY25','$35.6M','96% at-risk · say-on-pay ~94%'],
    ['SBC · % of revenue','7.4% → 3.5%','FY20→FY25 · a shrinking drag']
  ];
  var h='<p class="ov-lede">Uber’s governance is unusually clean for a founder-era tech company: <b>one share, one vote</b> (Travis Kalanick’s super-voting stock collapsed after the 2019 IPO), a <b>separate independent chair</b>, and a board that is <b>9 of 10 independent</b>.</p>';
  h+='<div class="ov-kpis">'+k.map(function(f){return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(f[0])+'</div><div class="ov-kpi-v">'+esc(f[1])+'</div><div class="ov-kpi-d muted">'+esc(f[2])+'</div></div>';}).join('')+'</div>';
  h+=sec('Stock-based compensation & alignment — did buybacks offset it?',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The honest answer is <b>not until recently</b>. SBC has run a <b>flat ~$1.8B/yr</b> since FY22 while revenue nearly doubled — so as a share of revenue it <b>fell from ~7.4% (FY20) to ~3.5% (FY25)</b>, a genuinely shrinking drag. But SBC still <b>dilutes</b>, and with <b>no buybacks before 2024</b> the share count <b>rose every year from FY20 to FY24</b> (~1,793M → ~2,141M). Only in <b>FY25</b>, once repurchases hit $6.5B, did the count finally <b>tick down</b> (~2,106M) — the first time buybacks more-than-offset dilution. CEO pay is <b>96% at-risk</b> (base ~$1.08M), say-on-pay support ~<b>94%</b>.</div>'+
    '<div class="ov-chart-card" style="margin-top:10px"><div class="ov-chart-t">SBC as % of revenue vs shares outstanding <span>· FY2020–FY2028E · faded = consensus</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartSbc"></canvas></div></div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Bars = period-end shares outstanding (left); line = SBC ÷ revenue (right). Shares peak in FY24, turn down in FY25 as buybacks first out-run SBC, and <b>consensus has them falling further to ~1,976M by FY28E</b> while SBC keeps shrinking to ~2.9% of revenue. <span style="color:#B7791F">Actuals: Uber filings / Summit. Forward: BBG consensus (uber-bbg).</span></div>');
  return h;
}
// ── Management ▸ Track Record — per-person scorecard (management only, not the board). Each exec is
// color-rated (green = value creator · amber = mixed/unproven · red = value destroyer) with an Uber
// record and a prior-roles record; tap a card for the full read. Roster per Uber's leadership page,
// Jul 2026 (C-suite turned over materially in 2025–26). ──
var TRACK_RATE={ green:{c:'#06965A',bg:'rgba(6,193,103,0.09)',bd:'rgba(6,193,103,0.34)',l:'Value creator'},
  amber:{c:'#B7791F',bg:'rgba(232,160,12,0.10)',bd:'rgba(232,160,12,0.34)',l:'Mixed / unproven'},
  red:{c:'#C0392B',bg:'rgba(192,57,43,0.09)',bd:'rgba(192,57,43,0.34)',l:'Value destroyer'} };
var TRACK_MGMT=[
  { id:'dara', n:'Dara Khosrowshahi', role:'Chief Executive Officer', since:'2017', rate:'green',
    uber:'Inherited a company in crisis (culture, Waymo suit, bans) and engineered one of tech’s great turnarounds — first full-year GAAP profit (2023), S&P 500 inclusion, ~$10B FCF, buybacks. Refocused the portfolio (exited ATG self-driving, unprofitable geos).',
    prior:'CEO of <b>Expedia (2005–17)</b>: grew revenue ~$2.1B → ~$10B+ via acquisitions and international expansion. Earlier: IAC/Barry Diller lieutenant; began at Allen & Company (1991).',
    detail:'<p><b>At Uber (CEO since Sep 2017).</b> Hired to reset the post-founder culture (Holder report, harassment scandal, regulatory bans, the Waymo litigation). Delivered: the <b>May 2019 IPO</b>; the <b>first full-year GAAP operating profit (2023)</b>; <b>S&P 500 inclusion (Dec 2023)</b>; ~<b>$10B</b> annual FCF and the first-ever buyback by 2025; and portfolio discipline — exited money-losing bets (ATG self-driving sold to Aurora; Uber Eats out of unprofitable geographies), converting several into equity stakes.</p>'+
      '<p><b>Before Uber.</b> CEO of <b>Expedia (2005–2017)</b> — grew revenue from ~$2.1B to ~$10B+ over 12 years via acquisitions (Hotels.com, Hotwire, Trivago, HomeAway/Orbitz) and international expansion, a strong shareholder-value record. Was briefly the highest-paid US CEO (~$94.6M, 2015). Earlier a Barry Diller/IAC lieutenant; began his career at Allen & Company (1991).</p>'+
      '<p><b>Net read — value creator (green).</b> One of the more successful "professional CEO into a crisis" cases in tech. Caveats, not disqualifying: very high pay (a ~$200M package recruited him), a tone-deaf 2021 Uber Eats "moonlighting" PR stunt, and years of cash burn before the profit inflection.</p>' },
  { id:'balaji', n:'Balaji Krishnamurthy', role:'Chief Financial Officer', since:'2019 · CFO 2026', rate:'amber',
    uber:'Internal promotion to CFO (effective Feb 2026). Ran Investor Relations, then Strategic Finance, then was divisional CFO for Mobility & Delivery — deep ownership of the core P&L he now runs.',
    prior:'~8 years at <b>Goldman Sachs</b> (VP, equity research); earlier Info Edge India, iTrust, Irevna. CFA; MBA (MDI Gurgaon).',
    detail:'<p><b>At Uber (since 2019; CFO effective Feb 16, 2026).</b> Head of Investor Relations (2020–23), VP Strategic Finance (2023–26), and previously <b>divisional CFO for Mobility and Delivery</b> — Uber’s two largest units. Strong internal knowledge and continuity into the seat.</p>'+
      '<p><b>Before Uber.</b> ~8 years at <b>Goldman Sachs</b> as a VP in equity research; earlier roles at Info Edge India, iTrust and Irevna. CFA charterholder; MBA from MDI Gurgaon.</p>'+
      '<p><b>Net read — mixed / unproven (amber).</b> Credible insider with direct ownership of the core-segment finances (continuity is a plus), but he is <b>Uber’s third CFO in ~3 years</b>, and a career largely in IR/equity research rather than a sitting public-company CFO means his standalone record as a top finance chief is not yet established.</p>' },
  { id:'macdonald', n:'Andrew Macdonald', role:'President & Chief Operating Officer', since:'2012', rate:'green',
    uber:'14-year veteran (Uber’s first Toronto GM). Rose to run global Mobility, Delivery and Autonomous plus membership/support/safety. Promoted to President & COO (Jun 2025) — Uber’s first COO since 2019.',
    prior:'Career built essentially at Uber — limited external executive history, so his record <i>is</i> the Uber operating record.',
    detail:'<p><b>At Uber (since 2012).</b> Joined as the first GM for Toronto and rose through the operating ranks to SVP, Mobility & Business Operations (2019). Promoted to <b>President & COO on Jun 2, 2025</b> (with a $5M performance RSU award), consolidating operational leadership; now runs global <b>Mobility, Delivery and Autonomous</b> plus cross-platform functions (Uber One, support, safety).</p>'+
      '<p><b>Before Uber.</b> Little notable external executive history — his career is essentially Uber.</p>'+
      '<p><b>Net read — value creator, lightly caveated (green).</b> A proven internal operator who scaled Uber’s largest businesses; the only caveat is that his résumé is almost entirely Uber, so there is little independent benchmark.</p>' },
  { id:'west', n:'Tony West', role:'SVP, Chief Legal Officer', since:'2017', rate:'green',
    uber:'Central architect of the post-scandal governance turnaround: guided the IPO through legal/regulatory risk, ended mandatory arbitration/NDAs for assault victims, published a first-of-its-kind US safety transparency report.',
    prior:'EVP & GC at <b>PepsiCo</b>; <b>US DOJ #3 (Associate Attorney General, 2012–14)</b> — secured ~$37B in financial-crisis penalties incl. the record BofA ($16.65B) and JPMorgan ($13B) settlements.',
    detail:'<p><b>At Uber (GC since late 2017).</b> Alongside Dara, a central architect of the cultural and governance recovery — steered the IPO through legal and regulatory risk, ended mandatory arbitration and NDAs for sexual-assault victims, published a first-of-its-kind US safety transparency report, and built governance programs.</p>'+
      '<p><b>Before Uber.</b> EVP Public Policy & GC at <b>PepsiCo</b>; <b>17th Associate Attorney General of the US (2012–14)</b>, the DOJ’s #3 — secured ~$37B in financial-crisis penalties including the record <b>Bank of America ($16.65B)</b> and <b>JPMorgan ($13B)</b> settlements; earlier a MoFo litigation partner and Assistant US Attorney.</p>'+
      '<p><b>Net read — value creator (green).</b> Rare blend of top-tier government-litigation credibility and big-company GC experience; directly tied to Uber’s reputational recovery.</p>' },
  { id:'kansal', n:'Sachin Kansal', role:'Chief Product Officer', since:'2017', rate:'green',
    uber:'Uber’s first safety-tech product leader; elevated to CPO in 2024. Owns Mobility & Delivery product and product/tech strategy for new bets (AV, taxis, Uber for Teens).',
    prior:'VP Product at <b>Lookout</b> (mobile security, scaled to 120M+ users); CPO at Flywheel (taxi-hailing); Director of Product at <b>Palm</b> (webOS).',
    detail:'<p><b>At Uber (since 2017).</b> Joined as its first product leader focused on safety tech; <b>CPO since 2024</b>. Owns Mobility & Delivery product (PM, design, product ops) and product/tech strategy for new bets — autonomous, taxis, sustainability, Uber for Teens.</p>'+
      '<p><b>Before Uber.</b> VP Product at <b>Lookout</b> (mobile security; scaled the consumer line to 120M+ users); CPO at <b>Flywheel Software</b> (taxi-hailing); Director of Product at <b>Palm</b> (webOS, later acquired by HP).</p>'+
      '<p><b>Net read — solid, green-leaning.</b> Credible marketplace and safety product operator; Palm/webOS was a commercial failure but that was an org-level outcome, not a personal red flag.</p>' },
  { id:'naga', n:'Praveen Neppalli Naga', role:'Chief Technology Officer', since:'2015', rate:'green',
    uber:'Leads engineering & science; oversees ~4,000 engineers/scientists building the core marketplace and data infrastructure; a public voice on Uber’s AI strategy.',
    prior:'~7 years in engineering leadership at <b>LinkedIn</b>, building early products and data infrastructure through its high-growth era.',
    detail:'<p><b>At Uber (since 2015).</b> Leads engineering and science strategy; oversees ~4,000 engineers and scientists on the core marketplace and data infrastructure; a public voice on Uber’s AI strategy.</p>'+
      '<p><b>Before Uber.</b> ~7 years of engineering leadership at <b>LinkedIn</b>, building early products and data infrastructure during its high-growth era. MS CS, University of Nebraska.</p>'+
      '<p><b>Net read — solid, green-leaning.</b> Long tenure plus a strong LinkedIn scaling pedigree; no red flags surfaced.</p>' },
  { id:'kannan', n:'Madhu Kannan', role:'Chief Business Officer', since:'2017 · rejoined 2023', rate:'green',
    uber:'Oversees global business development, corporate development and investments (M&A, partnerships, strategic capital).',
    prior:'CEO of the <b>Bombay Stock Exchange</b>; Group Head of BD at <b>Tata Sons</b>; senior roles at BofA Securities / Merrill Lynch and NYSE Euronext.',
    detail:'<p><b>At Uber (first 2017 as CBO Asia-Pacific; rejoined 2023 as global CBO).</b> Runs global business development, corporate development and investments — M&A, partnerships, strategic capital.</p>'+
      '<p><b>Before Uber.</b> EVC Global Corporate & Investment Banking at <b>Bank of America Securities</b>; Group Head of BD at <b>Tata Sons</b>; <b>CEO of the Bombay Stock Exchange</b>; MD at BofA-Merrill Lynch; SVP at NYSE Euronext.</p>'+
      '<p><b>Net read — green-leaning.</b> A senior dealmaker with capital-markets and BD depth; the main caveat is a somewhat itinerant career (multiple exits/re-entries).</p>' }
];
function ubTrackBody(c){
  var legend=Object.keys(TRACK_RATE).map(function(k){ var r=TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=TRACK_MGMT.map(function(m){ var r=TRACK_RATE[m.rate];
    return '<div class="trk-card ov-clickable" data-detail="exec:'+m.id+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:11px;padding:13px 15px;cursor:pointer;transition:.14s">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(m.n)+'</div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+r.c+'">'+r.l+'</div></div>'+
      '<div style="font-size:11px;color:var(--mu);font-weight:600;margin:1px 0 8px">'+m.role+' · at Uber since '+esc(m.since)+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:6px"><b style="color:'+r.c+'">At Uber:</b> '+m.uber+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5"><b style="color:var(--mu)">Before:</b> '+m.prior+'</div>'+
      '<div class="ov-more" style="margin-top:7px">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running Uber today, rated on <b>what they have actually built</b> — an <b>Uber</b> record and a <b>prior-roles</b> record for each. Color = the net read; <b>tap a card</b> for the full history. (Management only — board and ownership are separate tabs.)</p>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+cards+'</div>';
  h+='<style>@media(max-width:640px){.trk-card{}.trk-card{}} .trk-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08)}</style>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>CEO turnaround, in one line:</b> first GAAP operating profit Q2 2023 (after ~14 years of losses) · investment-grade rating · free cash flow $0.4B → $9.8B (FY22→FY25) · share count began falling in FY25 as buybacks outran SBC · exited China / SE-Asia / Russia into equity stakes.</div>';
  h+='<div class="ov-foot">Roster and titles per Uber’s leadership page (Jul 2026); prior-role outcomes from company/press sources. The C-suite turned over materially in 2025–26 (new CFO Feb 2026; new President & COO Jun 2025). Ratings are an editorial read, not a Summit output.</div>';
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
function uberOneEconomics(){
  var h='<style>'+
    '.uo-e-h{font-size:12.5px;font-weight:800;color:var(--navy);margin:16px 0 8px}'+
    '.uo-track{position:relative;height:26px;background:#eef2f7;border-radius:14px;margin:28px 0 8px}'+
    '.uo-fill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#06C167,#049a4f);border-radius:14px}'+
    '.uo-now{position:absolute;top:-22px;transform:translateX(-50%);font-size:10px;font-weight:800;color:#049a4f;white-space:nowrap}'+
    '.uo-mk{position:absolute;top:-3px;bottom:-3px;width:3px;background:#12356B;border-radius:2px}'+
    '.uo-mk span{position:absolute;top:-19px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:800;color:#12356B;white-space:nowrap}'+
    '.uo-scale{display:flex;justify-content:space-between;font-size:10px;color:var(--mu)}'+
  '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">One member who uses <b>rides + Eats + grocery</b> spends <b>~3&times;</b> a non-member and churns far less &mdash; that is how the multi-vertical bet actually pays off. But a new member is <b>underwater first</b>: the benefits (free delivery, credits) cost Uber for <b>~6 months</b> before the higher, stickier spend compounds.</div>';
  // payback curve
  h+='<div style="border:1px solid var(--bdr);border-radius:12px;background:#fff;padding:6px 4px 2px"><svg viewBox="0 0 640 190" role="img" aria-label="Uber One member payback curve" style="width:100%;height:auto;font-family:Inter,sans-serif">';
  h+='<rect x="55" y="115" width="177" height="58" fill="rgba(192,57,43,0.07)"/>';
  h+='<rect x="232" y="42" width="378" height="73" fill="rgba(6,193,103,0.07)"/>';
  h+='<line x1="55" y1="115" x2="612" y2="115" stroke="#B8C0CA" stroke-width="1" stroke-dasharray="4 4"/>';
  h+='<path d="M55 115 C 120 178, 182 178, 232 115 C 332 66, 470 54, 610 46" fill="none" stroke="#12356B" stroke-width="3"/>';
  h+='<circle cx="232" cy="115" r="5" fill="#12356B"/>';
  h+='<text x="143" y="150" text-anchor="middle" font-size="10" font-weight="800" fill="#C0392B">~6 months underwater</text>';
  h+='<text x="143" y="163" text-anchor="middle" font-size="9" fill="#9a5a52">benefits cost &gt; member spend</text>';
  h+='<text x="238" y="106" font-size="9.5" font-weight="800" fill="#12356B">breakeven ~mo 6</text>';
  h+='<text x="452" y="78" text-anchor="middle" font-size="10.5" font-weight="800" fill="#06965A">then it compounds</text>';
  h+='<text x="452" y="92" text-anchor="middle" font-size="9" fill="#3A7a57">3&times; spend &middot; ~35% stickier</text>';
  h+='<text x="55" y="186" font-size="9" fill="#8A93A0">join</text>';
  h+='<text x="232" y="186" text-anchor="middle" font-size="9" fill="#8A93A0">month 6</text>';
  h+='<text x="610" y="186" text-anchor="end" font-size="9" fill="#8A93A0">18+ months</text>';
  h+='</svg></div>';
  h+='<div class="ave-subh-note" style="margin:5px 2px 0">Cumulative member contribution margin over time &mdash; illustrative of the disclosed &ldquo;~6-month payback, then LTV-positive&rdquo; dynamic.</div>';
  // spend evidence
  h+='<div class="uo-e-h">Monthly spend per user <span class="ave-subh-note" style="font-weight:600">(Summit deck, Dec 2024)</span></div>';
  h+=mbars(UBERONE_SPEND);
  // penetration runway
  h+='<div class="uo-e-h">Penetration runway &mdash; where the growth is</div>';
  h+='<div class="uo-track"><div class="uo-fill" style="width:25%"></div><div class="uo-now" style="left:25%">Uber One ~25%</div><div class="uo-mk" style="left:70%"><span>Amazon Prime ~70%</span></div></div>';
  h+='<div class="uo-scale"><span>0% of monthly consumers</span><span>100%</span></div>';
  h+='<div class="ov-fynote" style="margin-top:10px"><b>The re-rating math.</b> Members already drive <b>&gt;50% of combined bookings</b> at just <b>~25%</b> penetration of ~199M monthly consumers &mdash; vs <b>~70%</b> for Amazon Prime in US households. Every point of penetration converts <b>one-off transactions into recurring, higher-LTV spend</b>: same business, structurally better revenue quality. That is the multiple-expansion case.</div>';
  return h;
}
function uberOneBody(c){
  var h='';
  h+='<p class="ov-lede"><b>Uber has three kinds of paying customer — not just members.</b> <b>(1) Members</b> (Uber One) are the highest-LTV core and get the deepest treatment here. <b>(2) Non-members</b> are the <b>~three-quarters of ~199M monthly consumers</b> who pay no subscription yet still generate most trips and a large share of gross bookings. <b>(3) Advertisers</b> — restaurants, grocers and brands — pay Uber directly, a &gt;$2B, ~100%-margin business. All three are covered below.</p>';
  h+='<p class="ov-lede"><b>Uber One is the monetization engine of the whole platform</b> — the mechanism that turns &ldquo;go anywhere, get anything&rdquo; into <b>recurring, higher-LTV</b> revenue. <b>50M+ members</b> (Q1 2026, ~+50% YoY) drive <b>&gt;50% of combined Mobility+Delivery bookings</b> and spend <b>~3×</b> non-members; at ~199M monthly consumers, roughly <b>a quarter</b> are members — and in the US, <b>&gt;35% of Mobility bookings</b> already run through them.</p>';
  h+='<div class="ov-kpis">'+UBERONE_STAT.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d muted">'+esc(k.s)+'</div></div>'; }).join('')+'</div>';
  h+=sec('Explosive Member Growth — 19M → 50M+ in ~2 years',
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMembers"></canvas></div>'+
    '<div class="ave-subh-note" style="margin-top:4px">~20M members added in the last year alone · now live in <b>42 countries</b> (up from 28). "Don’t see it slowing down." — mgmt, Q1 2026</div>');
  h+=sec('Priced to the Planet — one membership, many prices', uberOnePricing());
  h+=sec('The member economics — why one member is worth many', uberOneEconomics());
  h+=sec('The Cross-Sell Flywheel', '<div class="ov-callout"><div class="ov-tl-body"><b>"Go anywhere, get anything."</b> One demand graph cross-sells rides ⇄ eats ⇄ grocery. ~<b>40%</b> of users use multiple products; ~⅓ of Eats customers arrived through the Rides app (near-zero CAC). Each product the member adds <b>raises the cost of leaving</b> — not through lock-in (cancellation is easy, $9.99/mo) but because no competitor offers rides + food + grocery + hotels in one membership. That breadth-as-switching-cost is the structural moat.</div></div>');
  h+=sec('Non-members — still most of the customers',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Because Uber One is only ~<b>25%</b> of ~199M monthly consumers, <b>~three-quarters are non-members</b> — and they are not an afterthought. They pay no subscription but still generate the majority of trips and a large share of gross bookings, and every one is already <b>profitable on the marketplace take</b> the moment they ride or order. Non-members are also the <b>conversion funnel</b>: Uber One’s job is not to make an unprofitable customer profitable, it is to <b>deepen and lock in</b> spend that is already there. Roughly <b>half</b> of monthly users still take only one or two trips a month — that frequency headroom is the prize.</div>');
  h+=sec('Advertisers — when the merchant is the customer',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Uber’s customer base is <b>two-sided</b>: consumers pay for trips and orders, and the <b>restaurants, grocers and brands</b> on the platform pay Uber for <b>sponsored placement and search ads</b>. Advertising is a ~<b>$2B+ run-rate</b> business growing ~<b>50%/yr</b> at close to <b>100% incremental margin</b>, because it stacks on the existing marketplace without touching the driver or merchant split. These advertisers are among Uber’s most valuable customers precisely because what they buy costs Uber almost nothing to deliver.</div>');
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
  h+='<g class="mf-node ov-clickable" data-detail="ins:why">'+
    '<rect x="14" y="116" width="136" height="68" rx="10" fill="#fff" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="82" y="145" text-anchor="middle" font-size="12.5" font-weight="800" fill="#10141A">Every trip</text>'+
    '<text x="82" y="164" text-anchor="middle" font-size="10.5" fill="#3A4552">funds the premium</text></g>';
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
    '<text x="603" y="224" text-anchor="middle" font-size="10" fill="#3A4552">months & years later</text></g>';
  h+='</svg>';
  h+='<div class="mf-cap"><b>Collect now, pay later.</b> Riders fund the premium; it lands in Uber&rsquo;s <b>$12.9B</b> insurance reserve (Q1 2026, reported) and is <b>invested</b> while Uber waits — sometimes years — to pay claims. That timing gap is the <b>&ldquo;float&rdquo;</b> — an analytical framing, not a disclosed line. As the reserve <b>grows</b>, the increase adds to operating cash: a real, directional tailwind. <span class="ave-subh-note">Tap any node to learn the concept. The reserve balance is reported; dollar flows <i>through</i> the captive, per-fare cent breakdowns and float investment income are <b>not disclosed by Uber</b> — treat any such figure as an estimate.</span></div>';
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
// Beginner-friendly pop-ups for the insurance tab (assume the reader knows nothing about insurance).
var INS_POP={
  why:{ t:'Why does an Uber ride need insurance?', h:'Every time you take an Uber, the law in most places requires <b>commercial auto insurance</b> covering that specific trip — well beyond a normal personal car policy. If there is a crash, injuries and damage to the rider, driver and others have to be paid for. So insurance is not optional overhead for Uber; it is a <b>legal cost baked into every single trip</b>.' },
  captive:{ t:'What is a “captive insurer”? (Aleka)', h:'Instead of <b>buying</b> insurance from an outside company (and paying their profit margin), Uber built <b>its own insurance company</b> — a wholly-owned subsidiary called <b>Aleka</b>, based in Hawaii. That is a <b>captive insurer</b>: it exists only to insure its parent. By keeping insurance in-house, Uber captures the economics (and the investment income on reserves) instead of handing them to a third party.' },
  float:{ t:'What is the “float”?', h:'Uber collects insurance money from fares <b>today</b> but pays out most accident claims <b>months or years later</b>. In between, it sits on a large pile of cash. That pile is the <b>float</b>. Uber <b>invests</b> it and earns income while it waits to pay claims — using money it owes but has not paid yet. It is the same engine Warren Buffett’s insurers are famous for: <b>collect now, pay later, invest the gap.</b>' },
  selfins:{ t:'Self-insurance via the Aleka captive', h:'<b>Self-insured</b> means Uber <b>keeps a large share of the risk itself</b> instead of paying an outside insurer to take all of it. Its 10-K describes a <b>combination</b>: it retains risk in its wholly-owned Hawaii captive, <b>Aleka Insurance, Inc.</b>, and <b>transfers a significant portion</b> to third-party insurers/reinsurers above certain limits. Uber does <b>not disclose the exact retained percentage</b>. More risk kept = more reserves it controls (and can invest) — but also more exposure if claims run worse than expected.' },
  reserves:{ t:'Reserves = money set aside for future claims', h:'After a crash, the final bill can take <b>years</b> to settle (medical, legal). Uber has to <b>estimate</b> what it will eventually owe — including claims that already happened but have not been reported yet — and set that money aside now as a <b>reserve</b> (a liability on the balance sheet). It is an expense booked today, paid in cash later. That “booked now, paid later” gap is what creates the float.' },
  invest:{ t:'Investing the float', h:'The reserved cash is not idle — Uber <b>invests it</b> until claims come due, earning income on money it does not yet owe. This is why, through the turnaround, Uber’s <b>cash flow ran ahead of its accounting profit</b>: the reserve build and float added real cash while the P&L was still catching up.' },
  bull:{ t:'Bull — the cash is real', h:'FY2025 free cash flow of <b>$9.8B (+42%)</b>, ~112% of Adjusted EBITDA. An <b>investment-grade credit rating</b>, the first-ever buyback (<b>$20B</b> authorized, ~$3B/quarter), and ~$10B cumulative FCF. The case: asset-light growth converts almost fully to cash, and the rating agencies and balance sheet back it up.' },
  bear:{ t:'Bear — a float-fed mirage', h:'Cedar Street argues that stripping out stock-comp and the reserve build cuts “real” FCF from ~$8.6B to <b>~$4.1B</b>, calling Uber <b>“an unregulated, under-capitalized insurance company.”</b> Uber also <b>pulled ~$4.1B out of reserves into cash in 2024–25</b>; Consumer Watchdog’s 2026 “License to Kill” report alleges it is trimming accident liability to help fund robotaxis. <i>These are contested activist/analyst framings, not Uber’s position.</i>' }
};
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
    '.uins-mc.ov-clickable{cursor:pointer;transition:.14s}.uins-mc.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);border-color:#06965A}'+
    '.uins-primer{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin:0 0 11px}'+
    '.uins-primer-l{font-size:11.5px;font-weight:700;color:var(--mu)}'+
    '.uins-chip{font:inherit;font-size:11px;font-weight:700;color:#049a4f;background:rgba(6,193,103,0.07);border:1px solid rgba(6,193,103,0.3);border-radius:999px;padding:4px 12px;cursor:pointer;transition:.14s}'+
    '.uins-chip:hover{background:rgba(6,193,103,0.14)}'+
    '.uins-more{display:inline-block;margin-top:5px;font-size:10.5px;font-weight:800;color:#049a4f;cursor:pointer}'+
    '.uins-side .uins-more{margin-top:0}'+
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
  // Free cash flow — the cash the float helped unlock, AMZN-standard dual-axis (Actual/Summit/Consensus).
  h+='<div class="uins-h">Free cash flow &amp; conversion</div>';
  h+='<div class="ave-leg" id="ubFcfLeg" style="margin:2px 0 8px"></div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall" style="min-height:300px"><canvas id="ubChartFcf"></canvas></div></div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">Bars = free cash flow ($B); line = FCF conversion (FCF ÷ Adjusted EBITDA, right axis). Uber converts well above 100% of EBITDA to cash — the insurance float plus low capex intensity. Forward = Summit vs BBG consensus.</div>';
  // machine
  h+='<div class="uins-h">The self-insurance machine</div>';
  h+='<div class="uins-primer"><span class="uins-primer-l">New to this? Start here:</span>'+
    '<button type="button" class="uins-chip ov-clickable" data-detail="ins:why">Why a ride needs insurance</button>'+
    '<button type="button" class="uins-chip ov-clickable" data-detail="ins:captive">What’s a captive insurer?</button>'+
    '<button type="button" class="uins-chip ov-clickable" data-detail="ins:float">What’s the “float”?</button></div>';
  h+='<div class="uins-m">'+
    '<div class="uins-mc ov-clickable" data-detail="ins:selfins"><div class="uins-mc-h">Self-insured via Aleka</div><div class="uins-mc-d">Uber must carry commercial insurance on every trip. Rather than buy it all outside, it <b>retains a large share of the risk</b> in its own Hawaii captive, <b>Aleka Insurance, Inc.</b>, and transfers a significant portion to third-party reinsurers above set limits. <span class="uins-more">what this means ›</span></div></div>'+
    '<div class="uins-mc ov-clickable" data-detail="ins:reserves"><div class="uins-mc-h">Reserves = future claims</div><div class="uins-mc-d">It sets aside money now for <b>claims it will pay years later</b> — an expense booked today, cash out later. That timing gap is the <b>float</b>. <span class="uins-more">how reserves work ›</span></div></div>'+
    '<div class="uins-mc ov-clickable" data-detail="ins:invest"><div class="uins-mc-h">It invests the float</div><div class="uins-mc-d">Uber invests the reserved cash until claims settle — Buffett-style. This is why <b>cash flow ran ahead of accounting profit</b> through the turnaround. <span class="uins-more">the float, explained ›</span></div></div>'+
  '</div>';
  // reserves
  h+='<div class="uins-h">Follow the money — where the float comes from & where it goes</div>';
  h+=insMoneyFlow();
  h+='<div class="uins-h">How its role flipped — crutch → tailwind</div>';
  h+='<div class="ir-phases">'+irPhase(INS_TL[0],'crutch','Crutch')+irPhase(INS_TL[1],'head','Headwind')+irPhase(INS_TL[2],'tail','Tailwind')+'</div>';
  h+='<div class="uins-h">The reserve build — nearly tripled in two years</div>';
  h+=RES.map(function(r){ var w=Math.max(3,r[1]/resMax*100); return '<div class="uins-bar"><div class="uins-bar-y">'+r[0]+'</div><div class="uins-bar-t"><div class="uins-bar-f" style="width:'+w.toFixed(1)+'%"></div></div><div class="uins-bar-v">$'+r[1].toFixed(1)+'B</div></div>'; }).join('');
  h+='<div class="uins-cfo">The reserve <b>build</b> (claims accrued &gt; claims paid) adds to operating cash flow — a recurring, directional tailwind, and the mechanism the bear case attacks. Uber&rsquo;s reserve grew from a disclosed <b>~$9.8B (Dec 2024)</b> to <b>~$12.9B (Q1 2026)</b>; the precise year-by-year cash contribution is <b>not broken out by Uber</b>, so any single-year figure is Summit-derived/estimated.</div>';
  // turnaround
  h+='<div class="uins-h">From cash-burner to cash-compounder</div>';
  h+='<div class="uins-tr">'+OI.map(function(o){ var v=o[1], neg=v<0, w=Math.abs(v)/oiMax*50, col=neg?'#C0392B':'#049a4f';
    var bar='<div class="uins-tr-bar" style="'+(neg?'right:50%;':'left:50%;')+'width:'+w.toFixed(1)+'%;background:'+col+';opacity:.85"></div>';
    return '<div class="uins-tr-row"><div class="uins-tr-y">'+o[0]+'</div><div class="uins-tr-track"><div class="uins-tr-zero"></div>'+bar+'</div><div class="uins-tr-v" style="color:'+col+';text-align:'+(neg?'left':'right')+'">'+(neg?'−$'+Math.abs(v).toFixed(2):'+$'+v.toFixed(2))+'B</div></div>'; }).join('')+'</div>';
  h+='<div class="uins-cfo" style="border-left-color:#049a4f;background:rgba(6,193,103,0.06)"><b>GAAP operating income</b> swung from <b>−$3.5B (2021) to +$5.6B (2025)</b> — Q2 2023 was Uber&rsquo;s first-ever operating profit. Free cash flow scaled <b>$3.4B → $6.9B → $9.8B</b> (2025, +42%, a record $2.8B in Q4), earning an <b>investment-grade rating</b> and a <b>$20B buyback</b>.</div>';
  // debate
  h+='<div class="uins-h">Is the cash real? The debate</div>';
  h+='<div class="uins-two">'+
    '<div class="uins-side bull"><div class="uins-side-h">Bull — the cash is real</div><div class="uins-side-d">FCF <b>$9.8B (+42%)</b>, ~112% of Adj. EBITDA; investment-grade; a $20B buyback. <span class="uins-more ov-clickable" data-detail="ins:bull">read the full case ›</span></div></div>'+
    '<div class="uins-side bear"><div class="uins-side-h">Bear — a float-fed mirage</div><div class="uins-side-d">Activists argue “real” FCF is closer to <b>~$4.1B</b> once stock-comp & the reserve build are stripped out. <span class="uins-more ov-clickable" data-detail="ins:bear">read the full case ›</span></div></div>'+
  '</div>';
  // smaller slice
  h+='<div class="uins-h">Why it is becoming a smaller slice</div>';
  h+='<div class="uins-tl">Insurance keeps rising in absolute dollars (more trips + premium inflation), and Uber&rsquo;s cost-of-revenue growth has repeatedly been blamed on it. But it is being <b>outgrown</b>: Gross Bookings compound ~20%+/yr while Uber pushes insurance down via <b>safety tech, in-house claims (Aleka) and tort reform</b> — insurance CPI cooled from a ~20%+ peak to <b>~11%</b> (Dec 2024), with wins like Georgia tort reform and California UM/UIM limit cuts. Net: a large, cash-generative liability that is slowly shrinking as a share of the whole.</div>';
  h+='<div style="font-size:13px;font-weight:800;color:var(--navy);margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid var(--bdr)">Uber vs Lyft — two ways to run insurance</div>';
  h+=insModelCompare();
  h+='<div class="ov-foot" style="margin-top:14px">Reserves and operating results from Uber 10-Ks / Q1 2026 10-Q; the reserve&rarr;cash-flow contribution is from the Summit dataset. Uber does <b>not</b> disclose a clean standalone &ldquo;insurance % of Gross Bookings,&rdquo; so that trend is directional/inferred from cost-of-revenue commentary. The &ldquo;FCF mirage&rdquo; and reserve-raid narratives are <b>attributed</b> analyst/activist framings (Cedar Street; Consumer Watchdog), not Uber&rsquo;s own accounting characterization.</div>';
  return h;
}
// ─── History tab body: company story (timeline) + M&A (reused from Overview) ───
function historyStoryBody(){
  var tl='<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
  return sec('History & Milestones', tl)+sec('M&A — what each deal changed in the financials', mnaTimeline());
}

// ─── Delivery Hero acquisition tab (Evolution ▸ Delivery Hero Acquisition) ──────
// Classify a WORLD_PATHS country name into a deal category for the given map view.
// Classify a country for one of three map views:
//  'uber' — Uber's own footprint today (Mobility+Delivery / Mobility only / Delivery only)
//  'dh'   — Delivery Hero's own footprint today (single color; brand shown on click)
//  'post' — Uber's footprint after the acquisition closes (5-way breakdown)
function dhClassify(name, view){
  var inMob=DH_SETS.mobSet.hasOwnProperty(name), inDel=DH_SETS.delSet.hasOwnProperty(name);
  var inUber=DH_SETS.uberSet.hasOwnProperty(name), inSSW=DH_SETS.sswSet.hasOwnProperty(name);
  if(view==='uber'){
    if(inMob&&inDel) return { cat:'both', color:DHBOTH };
    if(inMob) return { cat:'mobonly', color:DHMOB };
    if(inDel) return { cat:'delonly', color:DHDEL };
    return { cat:'none', color:null };
  }
  if(view==='dh'){
    if(inUber||inSSW) return { cat:'dh', color:DHRED };
    return { cat:'none', color:null };
  }
  // post-acquisition
  if(inSSW){
    // Uber's own Mobility/Delivery in this market is unaffected by the SSW carve-out — only the
    // Delivery Hero brand here (Glovo, PedidosYa, ...) is leaving the group.
    if(inMob||inDel) return { cat:'sswuber', color:DHSSWX };
    return { cat:'ssw', color:DHSSW };
  }
  if(inUber&&inMob) return { cat:'cross', color:DHCROSS };
  if(inUber) return { cat:'new', color:DHNEW };
  if(inMob&&inDel) return { cat:'both', color:DHBOTH };
  if(inMob) return { cat:'mobonly', color:DHMOB };
  return { cat:'none', color:null };
}
var DH_VIEWS=['uber','dh','post'];
function dhLegendRow(color,label){ return '<div class="dhm-leg-row"><span class="dhm-leg-sw" style="background:'+color+'"></span>'+esc(label)+'</div>'; }
function dhChip(name,brand){ return '<span class="dhm-chip ov-clickable" data-detail="dhc:'+esc(name)+'">'+esc(name)+(brand?' <i>· '+esc(brand)+'</i>':'')+'</span>'; }
// Same chip, but carrying its own color swatch — used by the "By Region" list, where a single
// region mixes several deal categories, so each chip needs to show its category individually
// rather than inheriting one color from a group header (as dhGroup/dhChip do for "By Category").
function dhChipC(name,color,brand){ return '<span class="dhm-chip ov-clickable" data-detail="dhc:'+esc(name)+'"><span class="dhm-chip-sw" style="background:'+color+'"></span>'+esc(name)+(brand?' <i>· '+esc(brand)+'</i>':'')+'</span>'; }
function dhGroup(title,color,items,note){
  if(!items.length) return '';
  return '<div class="dhm-grp"><div class="dhm-grp-h"><span class="dhm-leg-sw" style="background:'+color+'"></span>'+esc(title)+'<span class="dhm-grp-n">'+items.length+'</span></div>'+
    (note?'<div class="ov-fynote" style="margin:2px 0 8px">'+note+'</div>':'')+
    '<div class="dhm-chips">'+items.map(function(it){ return dhChip(it.n, it.brand); }).join('')+'</div></div>';
}
// "By Region" grouping for the list view — the same countries and colors as dhClassify(view)
// produces for the map, just bucketed by geography instead of by deal category.
function dhRegionGroupsHTML(view){
  var byRegion={};
  Object.keys(DH_REGION_OF).forEach(function(name){
    var cl=dhClassify(name,view);
    if(cl.cat==='none') return;
    var region=DH_REGION_OF[name];
    (byRegion[region]||(byRegion[region]=[])).push({ n:name, color:cl.color, brand:DH_SETS.uberSet[name]||DH_SETS.sswSet[name] });
  });
  return DH_REGION_ORDER.map(function(r){
    var items=byRegion[r];
    if(!items||!items.length) return '';
    return '<div class="dhm-grp"><div class="dhm-grp-h"><span class="dhm-grp-region">'+esc(r)+'</span><span class="dhm-grp-n">'+items.length+'</span></div>'+
      '<div class="dhm-chips">'+items.map(function(it){ return dhChipC(it.n, it.color, it.brand); }).join('')+'</div></div>';
  }).join('');
}
function dhMarketsListHTML(){
  function toItems(arr){ return arr.map(function(n){ return {n:n}; }); }
  var both=toItems(UBER_MOBILITY_MARKETS.filter(function(n){ return DH_SETS.delSet.hasOwnProperty(n); }));
  var mobOnly=toItems(UBER_MOBILITY_MARKETS.filter(function(n){ return !DH_SETS.delSet.hasOwnProperty(n); }));
  var delOnly=toItems(UBER_DELIVERY_MARKETS.filter(function(n){ return !DH_SETS.mobSet.hasOwnProperty(n); }));
  var uberListCat=dhGroup('Mobility + Delivery today', DHBOTH, both)+
    dhGroup('Mobility only today', DHMOB, mobOnly)+
    dhGroup('Delivery only today', DHDEL, delOnly);
  var dhListCat=dhGroup('Delivery Hero — all current markets', DHRED, DH_UBER_MARKETS.concat(DH_SSW_MARKETS),
    'All ~64 markets Delivery Hero operates today, before the split between Uber and SSW Partners.');
  var crossList=DH_UBER_MARKETS.filter(function(m){ return DH_SETS.mobSet.hasOwnProperty(m.n); });
  var newList=DH_UBER_MARKETS.filter(function(m){ return !DH_SETS.mobSet.hasOwnProperty(m.n); });
  var bothUnaffected=toItems(UBER_MOBILITY_MARKETS.filter(function(n){ return DH_SETS.delSet.hasOwnProperty(n)&&!DH_SETS.uberSet.hasOwnProperty(n)&&!DH_SETS.sswSet.hasOwnProperty(n); }));
  var mobOnlyUnaffected=toItems(UBER_MOBILITY_MARKETS.filter(function(n){ return !DH_SETS.delSet.hasOwnProperty(n)&&!DH_SETS.uberSet.hasOwnProperty(n)&&!DH_SETS.sswSet.hasOwnProperty(n); }));
  // Split the 14 SSW markets: some already have their own Uber Mobility/Delivery (unaffected by
  // the carve-out), the rest have no other Uber presence and leave the group entirely.
  var sswKept=DH_SSW_MARKETS.filter(function(m){ return DH_SETS.mobSet.hasOwnProperty(m.n)||DH_SETS.delSet.hasOwnProperty(m.n); });
  var sswGone=DH_SSW_MARKETS.filter(function(m){ return !DH_SETS.mobSet.hasOwnProperty(m.n)&&!DH_SETS.delSet.hasOwnProperty(m.n); });
  var postListCat=dhGroup('New cross-platform — Mobility existed, Delivery added', DHCROSS, crossList)+
    dhGroup('New Delivery-only markets for Uber', DHNEW, newList)+
    dhGroup('Sold to SSW Partners — Uber keeps its own operations here', DHSSWX, sswKept, 'Only the Delivery Hero brand (Glovo, PedidosYa, ...) leaves the group in these markets — Uber’s own existing Mobility/Delivery here is unaffected.')+
    dhGroup('Sold to SSW Partners — leaves the Uber/DH group entirely', DHSSW, sswGone, 'Conditional on the Uber offer closing; Uber has no other presence in these markets.')+
    dhGroup('Mobility + Delivery — unaffected', DHBOTH, bothUnaffected)+
    dhGroup('Mobility only — unaffected', DHMOB, mobOnlyUnaffected);
  function listBlock(view,catHTML){
    return '<div class="dhm-list" id="dhList-'+view+'"'+(view!=='uber'?' hidden':'')+'>'+
        '<div class="dhm-listcols">'+
          '<div class="dhm-listcol"><div class="dhm-listcol-h">By Category</div>'+catHTML+'</div>'+
          '<div class="dhm-listcol"><div class="dhm-listcol-h">By Region</div>'+dhRegionGroupsHTML(view)+'</div>'+
        '</div>'+
      '</div>';
  }
  return '<div class="dhm-listwrap" id="dhListWrap" hidden>'+
      listBlock('uber', uberListCat)+
      listBlock('dh', dhListCat)+
      listBlock('post', postListCat)+
    '</div>';
}
function dhMarketsSection(){
  var vb=WORLD_VB.join(' ');
  function paths(view){ return WORLD_PATHS.map(function(c){
    var cl=dhClassify(c.n,view);
    return { n:c.n, d:c.d, color:cl.color, clickable:cl.cat!=='none' };
  }); }
  var byView={}; DH_VIEWS.forEach(function(v){ byView[v]=paths(v); });
  var body=WORLD_PATHS.map(function(c,i){
    var clickable=DH_VIEWS.some(function(v){ return byView[v][i].clickable; });
    var attrs=DH_VIEWS.map(function(v){ return ' data-fill-'+v+'="'+(byView[v][i].color||'#E7ECF1')+'"'; }).join('');
    var cls='dhm-c'+(clickable?' ov-clickable':'');
    var clickAttr=clickable?' data-detail="dhc:'+esc(c.n)+'"':'';
    return '<path class="'+cls+'" d="'+c.d+'" fill="'+(byView.uber[i].color||'#E7ECF1')+'"'+attrs+' data-name="'+esc(c.n)+'"'+clickAttr+'></path>';
  }).join('');
  var dots=Object.keys(DH_DOT_GEO).map(function(name){
    var g=DH_DOT_GEO[name];
    var x=(g.lon+180)/360*WORLD_VB[0], y=(90-g.lat)/180*WORLD_VB[1];
    var attrs=DH_VIEWS.map(function(v){ var cl=dhClassify(name,v); return ' data-fill-'+v+'="'+(cl.color||'#E7ECF1')+'"'; }).join('');
    var defColor=dhClassify(name,'uber').color||'#E7ECF1';
    return '<circle class="dhm-dot ov-clickable" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="5.5" fill="'+defColor+'"'+attrs+' data-name="'+esc(name)+'" data-detail="dhc:'+esc(name)+'"></circle>';
  }).join('');
  return '<div class="dhm-wrap">'+
      '<div class="dhm-toolbar">'+
        '<div class="dhm-pillrow">'+
          '<div class="dhm-pills" data-dhgroup="mode"><button type="button" class="dhm-pill active" data-dhmode="map">Map</button><button type="button" class="dhm-pill" data-dhmode="list">List</button></div>'+
          '<div class="dhm-pills" data-dhgroup="view">'+
            '<button type="button" class="dhm-pill active" data-dhview="uber">Uber Today</button>'+
            '<button type="button" class="dhm-pill" data-dhview="dh">Delivery Hero Today</button>'+
            '<button type="button" class="dhm-pill" data-dhview="post">Uber After the Deal</button>'+
          '</div>'+
        '</div>'+
        '<div class="dhm-kpis">'+
          '<div class="dhm-kpi"><b>79 → 99</b><span>total markets</span></div>'+
          '<div class="dhm-kpi"><b>34 → 58</b><span>cross-platform markets</span></div>'+
          '<div class="dhm-kpi"><b>50M+</b><span>new eligible cross-platform users</span></div>'+
        '</div>'+
      '</div>'+
      '<div class="dhm-mapblock" id="dhMapBlock">'+
        '<svg id="dhWorldSvg" viewBox="0 0 '+vb+'" data-view="uber" class="dhm-svg" preserveAspectRatio="xMidYMid meet">'+body+dots+'</svg>'+
        '<div class="dhm-legend" id="dhLegend-uber">'+
          dhLegendRow(DHBOTH,'Mobility + Delivery')+dhLegendRow(DHMOB,'Mobility only')+dhLegendRow(DHDEL,'Delivery only')+
        '</div>'+
        '<div class="dhm-legend" id="dhLegend-dh" hidden>'+
          dhLegendRow(DHRED,'Delivery Hero market (all ~64, before the SSW split)')+
        '</div>'+
        '<div class="dhm-legend" id="dhLegend-post" hidden>'+
          dhLegendRow(DHCROSS,'New cross-platform — Mobility existed, Delivery added')+dhLegendRow(DHNEW,'New Delivery-only market for Uber')+dhLegendRow(DHSSWX,'Sold to SSW — Uber’s own operations here unaffected')+dhLegendRow(DHSSW,'Sold to SSW Partners — no other Uber presence')+dhLegendRow(DHBOTH,'Mobility + Delivery — unaffected')+dhLegendRow(DHMOB,'Mobility only — unaffected')+
        '</div>'+
      '</div>'+
      dhMarketsListHTML()+
      '<div class="ov-fynote" style="margin-top:8px">Tap a country for details. '+esc(DH_MAP_SOURCES)+'</div>'+
    '</div>';
}
function dhCountryDetail(name){
  var inMob=DH_SETS.mobSet.hasOwnProperty(name), inDel=DH_SETS.delSet.hasOwnProperty(name);
  var inUber=DH_SETS.uberSet.hasOwnProperty(name), inSSW=DH_SETS.sswSet.hasOwnProperty(name);
  if(!inMob&&!inDel&&!inUber&&!inSSW) return null;
  var brand=DH_SETS.uberSet[name]||DH_SETS.sswSet[name];
  var lines=[];
  if(inMob&&inDel) lines.push('<b>Today:</b> Uber already operates both <b>Mobility</b> (rides) and <b>Delivery</b> (Uber Eats) here.');
  else if(inMob) lines.push('<b>Today:</b> Uber operates <b>Mobility</b> (rides) here; no Uber Eats presence yet.');
  else if(inDel) lines.push('<b>Today:</b> Uber operates <b>Delivery</b> (Uber Eats) here; no Uber rides presence.');
  else lines.push('<b>Today:</b> No existing Uber presence here.');
  if(brand) lines.push('<b>Delivery Hero:</b> operates as <b>'+esc(brand)+'</b> here.');
  if(inSSW){
    lines.push('<b>After the deal:</b> This market’s Delivery Hero business (<b>'+esc(brand)+'</b>) is being sold to <b>SSW Partners</b> for ~$1.6B across 14 markets — it will <b>not</b> become part of Uber. Uber is lending SSW the financing to fund the majority of that purchase.'+((inMob||inDel)?' Uber’s own existing operations here continue unaffected.':''));
  } else if(inUber&&inMob){
    lines.push('<b>After the deal:</b> <b>New cross-platform market.</b> Uber already has Mobility here; Delivery Hero’s <b>'+esc(brand)+'</b> now brings Delivery under the same roof — exactly the kind of market this deal is built around (cross-platform users generate roughly 3x the Gross Bookings of single-service users).');
  } else if(inUber){
    lines.push('<b>After the deal:</b> <b>New market for Uber.</b> Delivery Hero’s <b>'+esc(brand)+'</b> brings Uber into this market for the first time, with no prior Uber Mobility or Delivery presence.');
  } else if(inMob||inDel){
    lines.push('<b>After the deal:</b> Unaffected — not part of Delivery Hero’s footprint.');
  }
  if(['United Arab Emirates','Qatar','Bahrain','Kuwait','Oman','Jordan','Iraq','Egypt'].indexOf(name)>=0){
    lines.push('<b>Middle East case study:</b> Uber and Delivery Hero’s <b>talabat</b> are both strong standalone brands in the region (~8M MAUs each, ~7% Adj. EBITDA margin each, +34% / +28% YoY Gross Bookings growth) — management flags this as a template for the strongest combined cross-platform ecosystems.');
  }
  return { t:esc(name), h:lines.join('<br><br>') };
}
function dhTimelineBody(){
  return '<div class="ov-timeline">'+DH_TIMELINE_DEAL.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="dht:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>';
}
function dhAdvisorsBody(){
  return rows(DH_ADVISORS);
}
function dhGermanyBody(){
  var h='<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">HQ commitment</div><div class="ov-kpi-v">'+esc(DH_GERMANY.hq)+'</div><div class="ov-kpi-d muted">no workforce changes until at least '+DH_GERMANY.holdYear+'</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Germany investment</div><div class="ov-kpi-v">'+esc(DH_GERMANY.investEUR)+'</div><div class="ov-kpi-d muted">over '+DH_GERMANY.years+' years</div></div>'+
    '</div>';
  h+=bullets(DH_GERMANY.focus);
  return h;
}
function dhSnapshotHero(){
  var h='<div class="utn"><div class="utn-big">From a ~37% stake to full ownership</div>'+
    '<div class="ov-diagram-cap" style="margin:2px 0 2px">Tap any figure below for the full explanation.</div>'+
    '<div class="utn-prog">'+
      '<div class="utn-step ov-clickable" data-detail="dhp:stake_pre"><div class="utn-sv">~37%</div><div class="utn-sl">Uber’s economic stake · pre-announcement</div></div>'+
      '<span class="utn-ar">→</span>'+
      '<div class="utn-step ov-clickable" data-detail="dhp:stake_post"><div class="utn-sv" style="color:#06965A">~53%</div><div class="utn-sl">after Prosus’ ~17% irrevocable tender</div></div>'+
      '<span class="utn-ar">→</span>'+
      '<div class="utn-step ov-clickable" data-detail="dhp:stake_full"><div class="utn-sv" style="color:#06965A">100%</div><div class="utn-sl">targeted at closing · H2 2027</div></div>'+
    '</div>'+
    '<div class="utn-row">'+DH_PARAMS.filter(function(p){ return ['offer','equity','multiple','accept','financing'].indexOf(p.k)>=0; }).map(function(p){
      return '<span class="utn-chip ov-clickable" data-detail="dhp:'+esc(p.k)+'">'+esc(p.chip)+'</span>';
    }).join('')+'</div>'+
    '<div class="utn-note">Delivery Hero’s Management and Supervisory Boards unanimously support the offer. Announced July 16, 2026 — terms can still change before the Offer Document is published.</div></div>';
  return h;
}
function dhRationaleBanner(){
  return '<div class="dhu-banner ov-clickable" data-detail="dhr:1">'+
    '<div class="dhu-banner-t">Why Uber says this deal makes sense</div>'+
    '<div class="dhu-banner-d">Global platform, complementary footprint, a bigger cross-platform prize, and a clear synergy roadmap. <b>Tap for the 4-point case ›</b></div>'+
  '</div>';
}
function dhUberOneRegionCard(r){
  var cross=r.countries.filter(function(c){ return DH_SETS.mobSet.hasOwnProperty(c); });
  var crossPct=Math.round(cross.length/r.countries.length*100);
  var crossColor=crossPct>=70?'#06965A':(crossPct>=35?'#D68A1C':DHSSW);
  var seg=DH_SEGMENT_GMV[r.gmvKey];
  return '<div class="dhreg-card ov-clickable" data-detail="dhu:'+esc(r.k)+'">'+
    '<div class="dhu-region-h"><div class="dhu-region-t">'+esc(r.region)+'</div></div>'+
    (r.sub?'<div class="ov-fynote" style="margin-top:1px">'+esc(r.sub)+'</div>':'')+
    '<div class="ov-fynote" style="margin:1px 0 10px">'+esc(r.brands)+' · '+r.countries.length+' markets</div>'+
    '<div class="dhreg-stat"><div class="dhreg-stat-l">Share of Delivery Hero’s GMV</div><div class="dhreg-stat-v" style="color:#046A38">'+(seg?seg.share:'—')+'%</div>'+
      '<div class="dhreg-stat-d">'+(seg?'$'+seg.usdB+'B of Delivery Hero’s ~$55B group total':'')+'</div></div>'+
    '<div class="dhreg-stat"><div class="dhreg-stat-l">Already cross-platform</div><div class="dhreg-stat-v" style="color:'+crossColor+'">'+crossPct+'%</div>'+
      '<div class="dhreg-stat-d">'+cross.length+' of '+r.countries.length+' markets already have Uber Mobility</div></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Tap for the market-by-market read ›</div>'+
  '</div>';
}
function dhUberOneDetail(id){
  var r=DH_UBERONE_REGIONS.filter(function(x){ return x.k===id; })[0]; if(!r) return null;
  var cross=r.countries.filter(function(c){ return DH_SETS.mobSet.hasOwnProperty(c); }).map(function(n){ return {n:n}; });
  var neu=r.countries.filter(function(c){ return !DH_SETS.mobSet.hasOwnProperty(c); }).map(function(n){ return {n:n}; });
  var h='<div style="margin-bottom:10px;font-size:12.5px;line-height:1.6;color:var(--blue)">'+r.read+'</div>';
  if(r.caseStudy) h+='<div style="margin-bottom:10px;font-size:12.5px;line-height:1.6;color:var(--blue)">'+r.caseStudy+'</div>';
  h+='<div class="ov-fynote" style="margin-bottom:10px"><b>Market share:</b> '+esc(r.rank)+'</div>'+
    dhGroup('Already cross-platform', '#046A38', cross)+
    dhGroup('New market', '#5CA83E', neu);
  return { t:r.region+' <span class="ov-modal-sub">'+esc(r.brands)+'</span>', h:h };
}
function dhUberOneSection(){
  var h=dhRationaleBanner();
  h+='<div class="utn">'+
    '<div class="utn-big">Uber One Opportunity</div>'+
    '<div class="utn-prog">'+
      '<div class="utn-step"><div class="utn-sv">35M+</div><div class="utn-sl">Delivery Hero users in new cross-platform markets</div></div>'+
      '<span class="utn-ar">+</span>'+
      '<div class="utn-step"><div class="utn-sv">15M+</div><div class="utn-sl">Uber Mobility users in new cross-platform markets</div></div>'+
      '<span class="utn-ar">→</span>'+
      '<div class="utn-step"><div class="utn-sv" style="color:#06965A">3x</div><div class="utn-sl">higher spend once they become cross-platform</div></div>'+
    '</div>'+
    '<div class="utn-note">Uber’s own methodology (investor presentation, slide 8): the 50M+ is the <b>sum of Delivery Hero’s monthly active customers and Uber’s Mobility MAPCs</b> in the new cross-platform markets, <b>assuming zero existing overlap</b> between the two user bases. The <b>3x is the actual prize</b>: a cross-platform user — someone using both Mobility and Delivery, the profile Uber One membership is built to create — spends roughly <b>3x more</b> than someone using just one service. The deal’s entire economic logic is converting these 50M into that higher-spending habit. <span style="opacity:.75">Source: Uber Form 8-K, Exhibit 99.2, slides 8–9 (Jul 16, 2026).</span></div>'+
    '<div class="ov-diagram-cap" style="margin:16px 0 4px">Where the 50M breaks down by region</div>'+
    '<div class="ov-fynote" style="margin-bottom:10px">Uber doesn’t publish this split itself — each card blends two separately-sourced numbers: <b>share of Delivery Hero’s GMV</b> (FY2025 segment reporting) and <b>already cross-platform</b> (how many of the region’s markets already have Uber Mobility, computed live from the map above). <b>Tap a card</b> for the market-by-market detail.</div>'+
    '<div class="dhreg-grid">'+DH_UBERONE_REGIONS.map(dhUberOneRegionCard).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:10px">'+esc(DH_SEGMENT_SOURCE)+' Europe and Americas include the SSW-bound markets too, so Uber’s true retained share there is smaller than shown.</div>'+
  '</div>';
  return h;
}
function dhKpiSection(){
  var cards=DH_KPI_GLOSSARY.map(function(g){
    return '<div class="ov-driver ov-clickable" data-detail="dhk:'+esc(g.k)+'">'+
      '<div class="ov-driver-t">'+esc(g.t)+'</div>'+
      '<div class="dhg-terms"><span class="dhg-term uber">'+esc(g.uber)+'</span><span class="dhg-term dh">'+esc(g.dh)+'</span></div>'+
      '<div class="ov-more">Compare Uber vs. Delivery Hero ›</div></div>';
  }).join('')+
  '<div class="ov-driver ov-clickable" data-detail="dhk:trend">'+
    '<div class="ov-driver-t">Profitability trend</div>'+
    '<div class="dhg-terms"><span class="dhg-term uber">Adj. EBITDA · 2022 → 2025</span></div>'+
    '<div class="ov-more">See both turnarounds ›</div></div>';
  return '<div class="ov-diagram-cap" style="margin:0 0 10px">Uber and Delivery Hero don’t report the same metrics the same way. <b>Tap a KPI</b> to compare definitions, FY2025 values, and how much the numbers really line up.</div>'+
    '<div class="ov-drivers" style="grid-template-columns:repeat(3,1fr)">'+cards+'</div>';
}
function dhKpiDetail(id){
  if(id==='trend') return { t:'Adjusted EBITDA — the profitability trend (2022–2025)', h:dhEbitdaTurnaroundBody() };
  var g=DH_KPI_GLOSSARY.filter(function(x){ return x.k===id; })[0]; if(!g) return null;
  return { t:g.t, h:
    '<div class="dhk-compare">'+
      '<div class="dhk-side uber"><div class="dhk-lbl">Uber</div><div class="dhk-term">'+esc(g.uber)+'</div><div class="dhk-val">'+esc(g.uv)+'</div><div class="dhk-note">'+esc(g.uvNote)+'</div></div>'+
      '<div class="dhk-side dh"><div class="dhk-lbl">Delivery Hero</div><div class="dhk-term">'+esc(g.dh)+'</div><div class="dhk-val">'+esc(g.dv)+'</div><div class="dhk-note">'+esc(g.dvNote)+'</div></div>'+
    '</div>'+
    '<div style="margin-top:12px;font-size:12.5px;line-height:1.6;color:var(--blue)">'+esc(g.def)+'</div>'+
    '<div class="ov-fynote" style="margin-top:8px">'+esc(g.note)+'</div>' };
}
function dhEbitdaTurnaroundBody(){
  function fmtUSD(v){ var neg=v<0,a=Math.abs(v); return (neg?'−':'+')+'$'+(a/1000).toFixed(1)+'B'; }
  function fmtEUR(v){ var neg=v<0,a=Math.abs(v); return (neg?'−':'+')+'€'+a+'M'; }
  function row(label,pts,fmt){
    return '<div class="dhg-turn-label">'+esc(label)+'</div><div class="utn-prog" style="margin:6px 0 14px">'+
      pts.map(function(p,i){
        var arrow=i<pts.length-1?'<span class="utn-ar">→</span>':'';
        return '<div class="utn-step"><div class="utn-sv" style="color:'+(p.v<0?'#C0392B':'#06965A')+'">'+fmt(p.v)+'</div><div class="utn-sl">'+esc(p.y)+'</div></div>'+arrow;
      }).join('')+'</div>';
  }
  return '<div class="utn">'+
      '<div class="utn-big">Both companies went from cash-burner to cash-compounder</div>'+
      row('Uber — Adjusted EBITDA (US GAAP, $)', DH_EBITDA_TURN.uber, fmtUSD)+
      row('Delivery Hero — reported EBITDA (IFRS, €, full group)', DH_EBITDA_TURN.dh, fmtEUR)+
      '<div class="utn-note">Delivery Hero figures cover its <b>full group</b> (all ~64 current markets, including the 14 going to SSW Partners) as reported in its own public filings — a broader scope than the $1.1B FY25 Adjusted EBITDA shown above for Uber’s ~50-market acquisition scope, and a different accounting standard (IFRS vs. Uber’s US GAAP). Sourced from Delivery Hero’s public company filings, not the Jul-16-2026 transaction documents — see the KPI glossary above for why these numbers aren’t apples-to-apples.</div>'+
    '</div>';
}
function deliveryHeroBody(){
  var h='';
  h+='<div class="ov-fynote" style="margin-bottom:14px">Announced <b>July 16, 2026</b>. Uber has agreed to acquire Delivery Hero via a voluntary cash takeover offer; Delivery Hero’s Management and Supervisory Boards unanimously support the deal. Closing is expected in <b>H2 2027</b>, subject to regulatory approval — terms can still change before the Offer Document is published.</div>';
  h+=sec('Deal snapshot', dhSnapshotHero());
  h+=sec('Delivery Hero at a glance (FY2025)', '<div class="ov-kpis">'+DH_GLANCE.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d muted">'+esc(k.d)+'</div></div>'; }).join('')+'</div>');
  h+=sec('Where the markets change', dhMarketsSection());
  h+=sec('Combined scale — 2025 Gross Bookings ($236B pro forma)', mbars([
      ['Uber Mobility', Math.round(97/236*100), '$97B', MOB],
      ['Uber Delivery', Math.round(91/236*100), '$91B', DEL],
      ['Uber Freight', Math.round(5/236*100), '$5B', FRT],
      ['Delivery Hero', Math.round(42/236*100), '$42B', DHRED],
    ])+'<div class="ov-fynote" style="margin-top:8px">Combined 2025 Adj. EBITDA: <b>$9.8B</b> ($8.7B Uber + $1.1B Delivery Hero) — about <b>1.5x</b> the $6.0B combined Adj. EBITDA of the rest of Uber’s operational peer set (Eternal, Lyft, Grab, Prosus, Instacart, Didi, DoorDash).</div>');
  h+=sec('KPIs — Uber vs. Delivery Hero', dhKpiSection());
  h+=sec('Uber One Opportunity', dhUberOneSection());
  h+=collapsible('Timeline — from stake-building to full integration', dhTimelineBody(), false);
  h+=sec('Commitment to Germany', dhGermanyBody());
  h+=collapsible('Deal advisors', dhAdvisorsBody(), false);
  h+='<div class="ov-fynote" style="margin-top:10px">'+DH_SOURCES+'</div>';
  return h;
}
// ══════════════════════════════════════════════════════════════════════════════
// STANDARDIZED OVERVIEW  (per docs/OVERVIEW_CONVENTIONS.md — the 7 fixed blocks)
// Everything that does NOT fit these blocks is preserved in the Deep Dive tab,
// never deleted (Golden Rule #1). The old bespoke Overview lives in Deep Dive ▸ Extras.
// ══════════════════════════════════════════════════════════════════════════════
// Block 1 — Key Facts. Canonical set; missing cells are omitted (never blank).
// Sources: Uber FY2025 10-K (EDGAR CIK 0001543151, filed as a DOMESTIC 10-K), IR.
// Exactly 10 cells (5 columns × 2 rows). CEO carries tenure; Market cap carries an as-of.
var STD_FACTS=[
  ['Listing','NYSE: UBER'],
  ['HQ','San Francisco, CA, USA'],
  ['Incorporation','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2009'],
  ['IPO','May 2019'],
  ['CEO','Dara Khosrowshahi · since 2017'],
  ['Employees','~34,000 (Dec 2025)'],
  ['Dividend','Non-payer ($7B buyback ’24)'],
  ['Market cap','~$150B · Jul 2026'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="ubMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
// Block 3 — the 4-quadrant, rendered as a 2×2 TABLE. Each cell ≤ ~30 words.
var STD_BIZ=[
  ['What it sells','Rides, food / grocery / retail delivery and freight brokerage — plus Uber One membership and advertising — on one app across ~70 countries.'],
  ['Who buys it','Consumers (riders and eaters) on one side; drivers, couriers, merchants and advertisers on the other side of the marketplace.'],
  ['How it earns','It keeps a share (a “take rate”) of gross bookings. Mobility is the profit engine; Delivery is scaling; advertising is a high-margin add-on.'],
  ['The edge','Global scale plus a cross-sell bundle — rides ⇄ eats ⇄ membership — that no single-service rival matches; asset-light and cash-generative.'],
];
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
// Block 4 — How it makes money. By SEGMENT, toggled Revenue ⇄ Gross Bookings (both verified &
// reconcile). Geography IS disclosed in the 10-K, but the FY2025 regional split could not be
// verified, so it is NOT shown here (a fabricated geo view is worse than none).
var STD_REV=[['Mobility',57.0,'$29.7B',MOB],['Delivery',33.2,'$17.3B',DEL],['Freight',9.8,'$5.1B',FRT]];
var STD_GB=[['Mobility',50.4,'$97.5B',MOB],['Delivery',47.0,'$90.9B',DEL],['Freight',2.6,'$5.1B',FRT]];
// "What is X?" is qualitative (no numbers — the chart has them); the nested "Segment economics"
// adds the take rate & segment Adjusted EBITDA, which are NOT in the chart above.
var STD_SEG_DEF=[
  { seg:'Mobility',
    desc:'Uber’s ridesharing business and its profit engine: an app that connects riders with nearby independent drivers for on-demand trips of every kind. Uber owns no cars — it runs the marketplace (matching, pricing, payments) and keeps a service fee, its <b>take rate</b>, on each fare, plus rider fees, in-app advertising and Uber One membership.',
    econ:[['Gross Bookings','$97.5B'],['Revenue (take rate)','$29.7B (~30%)'],['Adjusted EBITDA','~$7.9B']] },
  { seg:'Delivery',
    desc:'Uber Eats and the wider delivery marketplace: connects consumers with restaurants, grocers and retailers, and the couriers who fulfill orders. Uber earns fees from merchants and consumers on each order, and increasingly from a <b>high-margin advertising</b> business built on the same app.',
    econ:[['Gross Bookings','$90.9B'],['Revenue (take rate)','$17.3B (~19%)'],['Adjusted EBITDA','~$3.6B']] },
  { seg:'Freight',
    desc:'A digital freight brokerage connecting shippers with truck carriers. Unlike the two consumer segments it is recognized on a <b>gross basis</b> (revenue ≈ bookings) and runs near breakeven — kept for optionality rather than as a core profit driver.',
    econ:[['Gross Bookings','$5.1B'],['Revenue','$5.1B (gross basis)'],['Adjusted EBITDA','~breakeven']] },
];
function stdMoneyMap(){
  var h='<div class="mm-tog"><button type="button" class="mm-pill active" data-mm="rev">By revenue</button><button type="button" class="mm-pill" data-mm="gb">By gross bookings</button></div>';
  h+='<div id="ubMMrev">'+mbars(STD_REV)+'</div>';
  h+='<div id="ubMMgb" hidden>'+mbars(STD_GB)+'</div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+STD_SEG_DEF.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">Segment economics (FY2025) <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">What is “'+esc(s.seg)+'”?<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025 by segment. Mobility is ~57% of <b>revenue</b> but ~50% of <b>gross bookings</b> — because Uber keeps a higher take rate on rides than on delivery. <span class="ave-subh-note">Σ revenue $52.0B · Σ bookings $193.5B (both reconcile). No geography view — FY2025 regional split not verified. Source: Uber FY2025 results; Summit model corroborates.</span></div>';
  return h;
}
// Block 5 — Products (TWO TIERS): Tier-1 family cards → pop-up → Tier-2 the specific products.
// No photos on file → emoji stands in (icon fallback). Grouped by segment.
var UB_PROD_GROUPS=[
  { seg:'Mobility', families:[
    { ic:'🚗', fam:'Everyday rides', d:'The mass-market core.', items:[
      ['UberX','Standard, affordable rides in everyday cars — the volume core of Mobility.'],
      ['UberX Share','A shared ride with someone heading the same way, at a lower price.'],
      ['Comfort','Newer, roomier cars with top-rated drivers, for a small premium.'],
    ]},
    { ic:'🏙️', fam:'Premium', d:'Higher-end & scheduled rides.', items:[
      ['Uber Black','Professional, licensed black-car service in premium vehicles.'],
      ['Uber Reserve','Book a ride in advance for a set pickup time.'],
    ]},
    { ic:'🛺', fam:'Two/three-wheelers & taxi', d:'Low-cost, local formats (international).', items:[
      ['Moto / Auto','Motorbike and auto-rickshaw rides — big in India and other emerging markets.'],
      ['Taxi','Hail a licensed local taxi through the Uber app.'],
    ]},
    { ic:'💼', fam:'Business & Health', d:'Rides for organizations.', items:[
      ['Uber for Business','Managed ride and meal programs with expensing for companies.'],
      ['Uber Health','HIPAA-compliant non-emergency medical rides booked by healthcare providers.'],
    ]},
  ]},
  { seg:'Delivery', families:[
    { ic:'🍔', fam:'Uber Eats', d:'Prepared-food delivery — the Delivery core.', items:[
      ['Restaurant delivery & pickup','On-demand meals from local restaurants — the original Eats business.'],
    ]},
    { ic:'🛒', fam:'Grocery & retail', d:'Everyday essentials beyond food.', items:[
      ['Grocery & convenience','Same-day grocery and convenience-store delivery.'],
      ['Retail','Delivery from pharmacies, electronics and other retailers.'],
    ]},
    { ic:'📦', fam:'Uber Direct', d:'Delivery-as-a-service.', items:[
      ['White-label last-mile','Uber’s courier network powering merchants’ own sites and apps — not the Uber app.'],
    ]},
    { ic:'📣', fam:'Advertising', d:'High-margin ads on the platform.', items:[
      ['Sponsored listings & in-app ads','Merchants pay to promote inside Eats and Mobility — a fast-growing, ~100%-incremental-margin business (>$2B run-rate).'],
    ]},
  ]},
  { seg:'Freight & platform', families:[
    { ic:'🚚', fam:'Uber Freight', d:'Logistics marketplace.', items:[
      ['Freight brokerage','Matches shippers with truck carriers on demand.'],
      ['Managed transportation','Logistics-management services (from the Transplace acquisition).'],
    ]},
    { ic:'⭐', fam:'Uber One', d:'The membership tying it together.', items:[
      ['Uber One','~$9.99/mo membership: fee waivers and discounts across rides and eats. Members spend materially more and drive over half of combined bookings.'],
    ]},
    { ic:'🤖', fam:'Autonomous (partnerships)', d:'Asset-light AV strategy.', items:[
      ['AV partnerships','Uber lists partner robotaxis (Waymo and others) in its marketplace rather than building its own; it sold its ATG self-driving unit to Aurora in 2020.'],
    ]},
  ]},
];
function stdProducts(){
  return UB_PROD_GROUPS.map(function(g,gi){
    return '<div class="stdp-group"><div class="stdp-seg">'+esc(g.seg)+'</div><div class="stdp">'+
      g.families.map(function(f,fi){
        return '<div class="stdp-card ov-clickable" data-detail="fam:'+gi+'-'+fi+'"><div class="stdp-ic">'+f.ic+'</div>'+
          '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
      }).join('')+'</div></div>';
  }).join('');
}
// Block 6 — Competitors scatter (DYNAMIC). X = valuation multiple, Y = revenue growth, bubble =
// LIVE market cap in USD (api.liveQuote per ticker). Multiple toggle: EV/EBITDA ⇄ P/E (never P/S).
// Basis: Trailing ⇄ Forward (default Forward). Peers add/removable by ticker; a peer with no
// meaningful multiple (unprofitable → n/m P/E; or no data) drops out of that view.
// ⚠ Multiples & growth are web-sourced APPROXIMATIONS pending the Fiscal.ai feed (flagged in audit).
var UB_PEERS=[
  { tk:'UBER', n:'Uber',      evT:28, evF:22, peT:35,   peF:28,   gt:14, gf:16, mc:150,  hl:true, why:'The scaled, global, multi-product leader. Profitable and cash-generative — a premium to pure ride-hailing but a discount to the faster growers.' },
  { tk:'DASH', n:'DoorDash',  evT:40, evF:30, peT:70,   peF:52,   gt:22, gf:18, mc:90,   why:'US delivery leader (~60% food share), growing faster than Uber and richly valued on it. No mobility; smaller internationally.' },
  { tk:'GRAB', n:'Grab',      evT:45, evF:28, peT:null, peF:null, gt:24, gf:20, mc:18,   why:'SE-Asia super-app (rides + food + GrabPay). Fastest growth of the group; only recently profitable, so P/E is not yet meaningful.' },
  { tk:'CART', n:'Instacart', evT:18, evF:14, peT:28,   peF:22,   gt:14, gf:13, mc:13,   why:'US grocery-delivery specialist (Maplebear). Mid-teens growth, profitable and ad-driven — the value name of the group.' },
  { tk:'LYFT', n:'Lyft',      evT:14, evF:10, peT:30,   peF:18,   gt:13, gf:11, mc:5.4,  why:'US/Canada #2 ride-hailing. Growing again but the cheapest of the group — the market prices its lack of scale & diversification.' },
];
// Live, mutable working set (cloned at init; .on toggles inclusion, .mc updated live).
var UB_SC={ type:'ev', basis:'f', peers:null };
function ubScReset(){ UB_SC.peers=UB_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function ubScMult(p){ if(UB_SC.type==='ev') return UB_SC.basis==='f'?p.evF:p.evT; return UB_SC.basis==='f'?p.peF:p.peT; }
function stdPeerScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-dot{transition:.15s}.mg-node text{pointer-events:none}'+
    '.ubsc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.ubsc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.ubsc-chip.off{opacity:.4;text-decoration:line-through}.ubsc-chip .x{color:var(--mu);font-weight:800}'+
    '.ubsc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.ubsc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.ubsc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid #06C167}'+
    '.mg-tip .mgt-n{display:block;font-weight:800;font-size:12.5px;color:#06C167;margin-bottom:3px}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD</b> (so a ~$150B Uber dwarfs a ~$5B Lyft, and currencies never distort the comparison). <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="ubScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="ubScXlab">EV/EBITDA · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="ubScNodes"></g>'+
  '</svg></div>';
  h+='<div class="ubsc-chips" id="ubScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here; a name drops out of the P/E view when it has no meaningful P/E, and an added ticker with no multiple on file shows its live bubble only once it has one. Unlisted rivals (Waymo, Bolt, DiDi) have no market multiple — they sit on the competitive map in <b>Deep Dive ▸ Deep Overview</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026), pending the Fiscal.ai feed; market caps are live. Directional, not exact.</span></div>';
  h+='<div id="ubScTip" class="mg-tip" hidden></div>';
  return h;
}
// Draw the current working set into #ubScNodes given the active type/basis.
function ubScRender(root){
  var g=root.querySelector('#ubScNodes'); if(!g||!UB_SC.peers) return;
  var maxMult=UB_SC.type==='ev'?52:80, X0=80, X1=612, Y0=252, Y1=44;
  var lab=root.querySelector('#ubScXlab'); if(lab) lab.textContent=(UB_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(UB_SC.basis==='f'?'forward':'trailing');
  var svgns='http://www.w3.org/2000/svg', frag='';
  UB_SC.peers.forEach(function(p){
    if(!p.on) return; var m=ubScMult(p); if(m==null||isNaN(m)) return; // drops out of this view
    var growth=UB_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/30))*(Y0-Y1);
    var r=Math.max(6,Math.min(22,5+Math.sqrt(Math.max(1,p.mc))*0.9));
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="'+(p.hl?'#10141A':'#3A7BD5')+'"'+(p.hl?' stroke="#fff" stroke-width="2"':' opacity="0.82"')+' style="cursor:pointer"></circle>'+
      '<text y="'+(r+11).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#10141A':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function ubScChips(root){
  var box=root.querySelector('#ubScChips'); if(!box||!UB_SC.peers) return;
  var h=UB_SC.peers.map(function(p,i){ return '<span class="ubsc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="ubsc-add"><input id="ubScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="ubScAddBtn">Add</button></span>';
  box.innerHTML=h;
}
// Block 7 — Timeline (compact; full history + M&A live in Deep Dive ▸ History).
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
// Overview description — high-level "what it is" only; NON-redundant with the quadrant/segments below.
var UB_LEDE='Uber runs the world’s largest mobility and delivery marketplace, connecting consumers with drivers, couriers and merchants across ~70 countries through a single app. It owns almost none of the cars, kitchens or trucks — it matches supply with demand and takes a cut. After years of losses it is now GAAP-profitable and strongly cash-generative.';
var UB_OV_SOURCES='Sources — Uber FY2025 Form 10-K and Q4 2025 results (segment revenue, gross bookings, Adjusted EBITDA); Summit DCF model (snapshot 2026-05-07) corroborating the segment series; company IR for product taxonomy and the Feb 2024 Investor Day. Market cap and peer bubbles are live via Massive; peer multiples & growth are web-sourced approximations (mid-2026) pending the Fiscal.ai feed. FY2025 geography split not shown (could not be verified). Forward figures are estimates, not company guidance.';
// The standardized Overview body — the 7 blocks in fixed order. Hook (Key Facts + Description +
// 2×2 quadrant table) stays visible; every section below defaults collapsed (progressive disclosure).
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid var(--brand-2, var(--brand));border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    /* 4-quadrant as a shared-border 2×2 TABLE */
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#06965A;margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.mm-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:10px}'+
    '.mm-pill{border:none;background:transparent;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:5px 14px;border-radius:999px;cursor:pointer}.mm-pill.active{background:var(--navy);color:#fff}'+
    /* segment "What is X?" accordions */
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    /* products (two-tier) */
    '.stdp-seg{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 7px}.stdp-group:first-child .stdp-seg{margin-top:2px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:#06965A}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:#06965A;margin-top:6px}'+
    /* collapsible sections (shared with Deep Dive; duplicated so the Overview is self-contained) */
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:8px 14px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:var(--navy);border-bottom-color:var(--navy)}'+
    '.dd-pane[hidden]{display:none}'+
    /* Delivery Hero acquisition tab — world map, quotes */
    '.dhm-wrap{margin:0}'+
    '.dhm-toolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px}'+
    '.dhm-pills{display:flex;gap:6px}'+
    '.dhm-pill{border:1px solid var(--bdr);background:#fff;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:6px 13px;border-radius:20px;cursor:pointer;transition:.12s}'+
    '.dhm-pill:hover{color:var(--navy)}.dhm-pill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.dhm-kpis{display:flex;gap:18px;flex-wrap:wrap}'+
    '.dhm-kpi{display:flex;flex-direction:column;align-items:flex-end}'+
    '.dhm-kpi b{font-size:15px;color:var(--navy);font-weight:800;letter-spacing:-.01em}'+
    '.dhm-kpi span{font-size:9.5px;color:var(--mu);font-weight:600;text-transform:uppercase;letter-spacing:.02em}'+
    '.dhm-svg{width:100%;height:auto;display:block;background:#F7F9FB;border-radius:10px;border:1px solid var(--bdr)}'+
    '.dhm-c{stroke:#fff;stroke-width:.5;transition:opacity .12s}'+
    '.dhm-c.ov-clickable{cursor:pointer}.dhm-c.ov-clickable:hover{opacity:.72}'+
    '.dhm-dot{stroke:#fff;stroke-width:1.5;cursor:pointer;transition:opacity .12s}.dhm-dot:hover{opacity:.72}'+
    '.dhm-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:10px}.dhm-legend[hidden]{display:none}'+
    '.dhm-leg-row{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--blue)}'+
    '.dhm-leg-sw{width:11px;height:11px;border-radius:3px;display:inline-block;flex-shrink:0}'+
    '.dhu-banner{border:1px solid var(--bdr);border-radius:10px;padding:12px 16px;margin-bottom:16px;background:var(--surface);cursor:pointer;transition:.14s}'+
    '.dhu-banner-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.dhu-banner-d{font-size:11.5px;color:var(--mu);margin-top:3px;line-height:1.5}'+
    '.dhu-region{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;margin-bottom:10px;background:#fff;cursor:pointer;transition:.14s}'+
    '.dhu-region-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}'+
    '.dhu-region-t{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.dhu-region-brand{font-size:11px;color:var(--mu);font-weight:600;white-space:nowrap}'+
    '.dhu-bar{display:flex;align-items:center;gap:10px;margin:9px 0 5px}'+
    '.dhu-bar-track{flex:1;height:8px;background:var(--surface);border-radius:5px;overflow:hidden}'+
    '.dhu-bar-fill{height:100%;border-radius:5px}'+
    '.dhu-bar-v{font-size:12px;font-weight:800;width:40px;text-align:right;flex-shrink:0}'+
    /* Uber One "where does the 50M come from" — 4 region cards side by side, each with two labeled stats */
    '.dhreg-grid{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 4px}'+
    '.dhreg-card{flex:1;min-width:200px;border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:#fff;cursor:pointer;transition:.14s}'+
    '.dhreg-card:hover{border-color:var(--brand-2)}'+
    '.dhreg-stat{margin-top:9px}'+
    '.dhreg-stat-l{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu)}'+
    '.dhreg-stat-v{font-size:19px;font-weight:900;color:var(--navy);letter-spacing:-.01em}'+
    '.dhreg-stat-d{font-size:10.5px;color:var(--mu);line-height:1.4;margin-top:1px}'+
    '.dhm-pillrow{display:flex;align-items:center;gap:16px;flex-wrap:wrap}'+
    '.dhm-mapblock[hidden],.dhm-listwrap[hidden]{display:none}'+
    '.dhm-chips{display:flex;flex-wrap:wrap;gap:6px}'+
    '.dhm-chip{font-size:11px;font-weight:600;padding:5px 11px;border-radius:16px;background:#fff;border:1px solid var(--bdr);color:var(--navy);cursor:pointer;transition:.12s}'+
    '.dhm-chip:hover{border-color:var(--brand);background:var(--surface)}'+
    '.dhm-chip i{font-style:normal;color:var(--mu);font-weight:500}'+
    '.dhm-chip-sw{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}'+
    '.dhm-listcols{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}'+
    '.dhm-listcol{flex:1;min-width:260px}'+
    '.dhm-listcol-h{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--bdr)}'+
    '.dhm-list{margin-top:4px}.dhm-grp{margin-bottom:16px}.dhm-grp:last-child{margin-bottom:0}'+
    '.dhm-grp-h{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:8px}'+
    '.dhm-grp-region{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.dhm-grp-n{color:var(--mu);font-weight:600;font-size:11px;margin-left:2px}'+
    /* Big green highlight card (Overview "What Truly Drives Uber" pattern) — duplicated here so this tab is self-contained */
    '.utn{border:1px solid var(--bdr);border-radius:14px;padding:16px 18px;margin:8px 0 4px;background:linear-gradient(180deg,rgba(6,193,103,0.05),transparent)}'+
    '.utn-big{font-size:16px;font-weight:900;color:var(--navy);letter-spacing:-.2px}'+
    '.utn-prog{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:12px 0}'+
    '.utn-step{flex:1;min-width:118px;text-align:center;border:1px solid var(--bdr);border-radius:10px;padding:11px 8px}'+
    '.utn-sv{font-size:22px;font-weight:900;line-height:1}.utn-sl{font-size:10px;color:var(--mu);font-weight:700;margin-top:4px}'+
    '.utn-ar{color:#06C167;font-weight:900;font-size:20px}'+
    '.utn-row{display:flex;flex-wrap:wrap;gap:8px}.utn-chip{font-size:11px;font-weight:700;color:var(--navy);background:rgba(6,193,103,0.08);border-radius:20px;padding:3px 11px}'+
    '.utn-note{font-size:11px;color:var(--mu);margin-top:9px;line-height:1.5}'+
    '.dhg-terms{display:flex;flex-wrap:wrap;gap:6px;margin:5px 0 7px}'+
    '.dhg-term{font-size:10px;font-weight:700;padding:2px 9px;border-radius:10px;white-space:nowrap}'+
    '.dhg-term.uber{background:rgba(16,20,26,.08);color:var(--navy)}'+
    '.dhg-term.dh{background:rgba(229,52,42,.10);color:#E5342A}'+
    '.dhg-turn-label{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.dhk-compare{display:flex;gap:12px;flex-wrap:wrap}'+
    '.dhk-side{flex:1;min-width:150px;border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;border-top:3px solid var(--bdr)}'+
    '.dhk-side.uber{border-top-color:var(--brand-2)}.dhk-side.dh{border-top-color:#E5342A}'+
    '.dhk-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}'+
    '.dhk-term{font-size:11.5px;font-weight:700;color:var(--navy);margin:4px 0 7px;line-height:1.4}'+
    '.dhk-val{font-size:19px;font-weight:900;color:var(--navy);letter-spacing:-.01em}'+
    '.dhk-note{font-size:10.5px;color:var(--mu);margin-top:4px;line-height:1.4}'+
    '@media(max-width:680px){.dhm-toolbar{flex-direction:column;align-items:flex-start}.dhm-kpis{gap:12px}.utn-prog{flex-direction:column}.ov-drivers{grid-template-columns:1fr !important}}'+
    '</style>';
  // ── Hook (always visible): Key Facts, Description, 2×2 quadrant table ──
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(UB_LEDE)+'</p>';
  h+=stdFourQuad();
  // ── Progressive disclosure: everything below defaults collapsed ──
  h+=collapsible('How it makes money', stdMoneyMap());
  h+=collapsible('What it makes — the products', stdProducts());
  h+=collapsible('Competitors — valuation vs growth', stdPeerScatter());
  h+=collapsible('Timeline', stdTimeline());
  h+='<div class="ov-foot">'+esc(UB_OV_SOURCES)+'</div>';
  return h;
}

// ===============================================================================================
// EARNINGS PHASE SYSTEM — ported from js/overviews/googl.js (v2.10), module-scoped ce* machinery
// copied verbatim and wired to UBER. Deviations: theme record reuses UB_THEMES via the existing
// callsBody(); RED added; IR/EDGAR banner re-branded to Uber; the consensus-driven Setup grid,
// scorecard and Setup chart are stubbed PENDING until CE_CONS is filled from BBG_CONSENSUS.txt.
// ===============================================================================================
var RED='#D64545';
var YELLOW='#FBBC05', BLUE='#1A73E8', PURPLE='#7A5AF8', AMBER='#B7791F';
// IR/EDGAR identity for the banner buttons (CIK 1543151 = Uber Technologies, Inc.)
var CE_IR_URL='https://investor.uber.com/financials/default.aspx';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1543151&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/UBER';
var CE_SEC_SEAL='img/sec-seal.png';
// Amber pending note shown wherever a consensus-driven block still needs CE_CONS.
function cePendingSnap(scope){ return '<div class="ce-note" style="border-color:#E6B34D;background:#FBF4E6;color:#7A5A12">\u2691 <b>Pending Bloomberg snapshots</b> \u2014 '+esc(scope)+', scorecard and charts populate once <code>CE_CONS</code> is filled from <code>BBG_CONSENSUS.txt</code>. The phase system (IR/EDGAR banner, phase tabs, quarter pills, Watch List + theme record) is live; only the consensus numeric blocks wait on the snapshot archive.</div>'; }
// ── Data stubs — fill from BBG_CONSENSUS.txt (CE_CONS) + Summit projection export (CE_ANNUAL). ──
var CE_CONS = {
  src:'Bloomberg (BST) \u00b7 BBG_CONSENSUS.txt snapshot archive',
  asOf:["2023-10-26", "2024-01-31", "2024-05-01", "2024-07-31", "2024-10-31", "2025-01-30", "2025-05-01", "2025-07-31", "2025-10-30", "2026-01-29", "2026-04-30", "2026-07-30"],
  q:["Q3 2022", "Q4 2022", "Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:'Revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,9.54],[null,null,10.01,9.78],[null,10.22,9.98,10.11],[10.8,10.52,10.67,10.58],[10.93,11.03,10.95,null],[11.63,11.57,null,11.77],[11.75,null,11.7,11.61],[null,12.4,12.34,12.48],[12.86,12.77,12.88,13.26],[13.65,13.78,14.08,14.29],[13.36,13.62,13.77,13.33],[14.72,14.82,14.2,14.242],[15.55,14.84,14.82,14.82],[15.78,15.82,null,null],[15.36,null,null,null]],
      qa:[8.34,8.61,8.82,9.23,9.29,9.94,10.13,10.7,11.19,11.96,11.53,12.65,13.47,14.37,13.2,14.19,null,null,null],
      qy:[null,null,null,null,8.34,8.61,8.82,9.23,9.29,9.94,10.13,10.7,11.19,11.96,11.53,12.65,13.47,14.37,13.2],
      qq:[null,8.34,8.61,8.82,9.23,9.29,9.94,10.13,10.7,11.19,11.96,11.53,12.65,13.47,14.37,13.2,14.19,null,null] },
    { k:'Operating income', u:'$B', t:'ok', code:'IS_COMPARABLE_EBIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.3],[null,null,0.48,0.51],[null,0.53,0.58,0.62],[null,0.73,0.78,0.79],[null,0.93,0.92,null],[null,1.11,null,1.2],[null,null,1.2,1.22],[null,1.4,1.42,1.47],[null,1.56,1.59,1.62],[null,1.83,1.86,1.9],[null,1.82,1.86,1.84],[null,2.1,2.06,2.111],[null,2.22,2.23,2.23],[2.46,2.5,null,null],[null,null,null,null]],
      qa:[-0.49,-0.14,-0.26,0.33,0.39,0.65,0.82,0.94,1.07,1.25,1.33,1.53,1.68,1.92,1.88,2.14,null,null,null],
      qy:[null,null,null,null,-0.49,-0.14,-0.26,0.33,0.39,0.65,0.82,0.94,1.07,1.25,1.33,1.53,1.68,1.92,1.88],
      qq:[null,-0.49,-0.14,-0.26,0.33,0.39,0.65,0.82,0.94,1.07,1.25,1.33,1.53,1.68,1.92,1.88,2.14,null,null] },
    { k:'EBITDA', u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,1.01],[null,null,1.14,1.22],[null,1.19,1.25,1.32],[1.37,1.41,1.47,1.5],[1.54,1.6,1.62,null],[1.8,1.83,null,1.85],[1.88,null,1.84,1.84],[null,2.05,2.05,2.09],[2.19,2.19,2.22,2.27],[2.42,2.44,2.49,2.48],[2.42,2.45,2.45,2.44],[2.74,2.7,2.66,2.785],[2.81,2.8,2.88,2.88],[3.06,3.34,null,null],[3.09,null,null,null]],
      qa:[0.52,0.67,0.76,0.92,1.09,1.28,0.71,1.57,1.69,1.84,1.87,2.12,2.26,2.49,2.48,2.82,null,null,null],
      qy:[null,null,null,null,0.52,0.67,0.76,0.92,1.09,1.28,0.71,1.57,1.69,1.84,1.87,2.12,2.26,2.49,2.48],
      qq:[null,0.52,0.67,0.76,0.92,1.09,1.28,0.71,1.57,1.69,1.84,1.87,2.12,2.26,2.49,2.48,2.82,null,null] },
    { k:'EPS', u:'$', t:'ok', code:'IS_COMP_EPS_GAAP',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.11],[null,null,0.14,0.17],[null,0.19,0.21,0.23],[0.25,0.27,0.3,0.31],[0.33,0.35,0.34,null],[0.42,0.45,null,0.51],[0.47,null,0.45,0.51],[null,0.56,0.59,0.63],[0.63,0.65,0.67,0.7],[0.75,0.77,0.79,0.8],[0.79,0.79,0.76,0.71],[0.9,0.86,0.78,0.844],[0.91,0.85,0.93,0.93],[0.96,1.03,null,null],[0.96,null,null,null]],
      qa:[-0.61,0.29,-0.08,0.18,0.1,0.66,-0.32,0.47,1.2,3.21,0.83,0.63,3.11,0.14,0.13,1.17,null,null,null],
      qy:[null,null,null,null,-0.61,0.29,-0.08,0.18,0.1,0.66,-0.32,0.47,1.2,3.21,0.83,0.63,3.11,0.14,0.13],
      qq:[null,-0.61,0.29,-0.08,0.18,0.1,0.66,-0.32,0.47,1.2,3.21,0.83,0.63,3.11,0.14,0.13,1.17,null,null] },
    { k:'Shares outstanding', u:'B', t:'ok', code:'IS_SH_FOR_DILUTED_EPS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,2.07],[null,null,2.08,2.1],[null,2.12,2.11,2.11],[2.14,2.13,2.12,2.09],[2.14,2.13,2.1,null],[2.15,2.11,null,2.14],[2.12,null,2.13,2.12],[null,2.14,2.12,2.11],[2.15,2.13,2.12,2.1],[2.13,2.12,2.1,2.11],[2.13,2.11,2.1,2.09],[2.11,2.1,2.09,2.059],[2.1,2.08,2.05,2.05],[2.08,2.05,null,null],[2.03,null,null,null]],
      qa:[1.98,2.06,2.01,2.08,2.11,2.12,2.08,2.15,2.15,2.14,2.12,2.13,2.12,2.11,2.07,2.05,null,null,null],
      qy:[null,null,null,null,1.98,2.06,2.01,2.08,2.11,2.12,2.08,2.15,2.15,2.14,2.12,2.13,2.12,2.11,2.07],
      qq:[null,1.98,2.06,2.01,2.08,2.11,2.12,2.08,2.15,2.15,2.14,2.12,2.13,2.12,2.11,2.07,2.05,null,null] },
    { k:'Operating cash flow', u:'$B', t:'ok', code:'CB_CF_NET_CASH_OPERATING_ACT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.76],[null,null,1.13,0.95],[null,1.15,1.2,1.22],[1.36,1.41,1.47,1.21],[1.76,1.63,1.53,null],[1.83,1.75,null,1.19],[1.96,null,1.72,1.43],[null,2.09,2.04,1.77],[2.43,2.4,2.24,2.08],[2.39,2.44,2.47,2.06],[3.17,3.22,2.89,2.88],[2.63,2.4,2.45,3.329],[2.55,2.64,2.72,2.72],[2.53,2.74,null,null],[3.08,null,null,null]],
      qa:[0.43,-0.24,0.61,1.19,0.97,0.82,1.42,1.82,2.15,1.75,2.32,2.56,2.33,2.88,2.35,2.86,null,null,null],
      qy:[null,null,null,null,0.43,-0.24,0.61,1.19,0.97,0.82,1.42,1.82,2.15,1.75,2.32,2.56,2.33,2.88,2.35],
      qq:[null,0.43,-0.24,0.61,1.19,0.97,0.82,1.42,1.82,2.15,1.75,2.32,2.56,2.33,2.88,2.35,2.86,null,null] },
    { k:'Capex', u:'$B', t:'ok', code:'CF_PURCHASE_OF_FIXED_PROD_ASSETS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.07],[null,null,0.08,0.08],[null,0.09,0.08,0.08],[0.09,0.08,0.08,0.07],[0.09,0.08,0.07,null],[0.08,0.07,null,0.07],[0.07,null,0.08,0.07],[null,0.08,0.07,0.08],[0.08,0.07,0.08,0.09],[0.08,0.08,0.09,0.1],[0.08,0.09,0.1,0.09],[0.09,0.1,0.1,0.11],[0.11,0.1,0.1,0.1],[0.1,0.1,null,null],[0.14,null,null,null]],
      qa:[0.07,0.06,0.06,0.05,0.06,0.06,0.06,0.1,0.04,0.04,0.07,0.09,0.1,0.07,0.07,0.07,null,null,null],
      qy:[null,null,null,null,0.07,0.06,0.06,0.05,0.06,0.06,0.06,0.1,0.04,0.04,0.07,0.09,0.1,0.07,0.07],
      qq:[null,0.07,0.06,0.06,0.05,0.06,0.06,0.06,0.1,0.04,0.04,0.07,0.09,0.1,0.07,0.07,0.07,null,null] },
    { k:'D&A', u:'$B', t:'ok', code:'CF_DEPR_AMORT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.21],[null,null,0.21,0.21],[null,0.21,0.21,0.2],[0.21,0.21,0.21,0.2],[0.21,0.2,0.2,null],[0.21,0.2,null,0.19],[0.19,null,0.19,0.17],[null,0.19,0.17,0.17],[0.19,0.17,0.17,0.17],[0.17,0.17,0.17,0.18],[0.18,0.19,0.18,0.19],[0.18,0.19,0.19,0.182],[0.19,0.19,0.19,0.19],[0.2,0.19,null,null],[0.2,null,null,null]],
      qa:[0.23,0.22,0.21,0.21,0.2,0.2,0.19,0.18,0.19,0.18,0.18,0.18,0.2,0.19,0.19,0.19,null,null,null],
      qy:[null,null,null,null,0.23,0.22,0.21,0.21,0.2,0.2,0.19,0.18,0.19,0.18,0.18,0.18,0.2,0.19,0.19],
      qq:[null,0.23,0.22,0.21,0.21,0.2,0.2,0.19,0.18,0.19,0.18,0.18,0.18,0.2,0.19,0.19,0.19,null,null] },
    { k:'Gross profit', u:'$B', t:'ok', code:'GROSS_PROFIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3.81],[null,null,4.02,3.87],[null,4.2,3.99,4.04],[4.45,4.23,4.27,4.22],[4.38,4.42,4.38,null],[4.69,4.64,null,4.71],[4.72,null,4.72,4.61],[null,5.04,4.94,5.03],[5.23,5.13,5.17,5.29],[5.5,5.52,5.63,5.7],[5.37,5.47,5.51,5.47],[5.91,5.94,5.84,6.16],[6.23,6.12,6.43,6.43],[6.51,6.84,null,null],[6.85,null,null,null]],
      qa:[3.17,3.3,3.56,3.71,3.67,3.88,3.96,4.21,4.43,4.72,4.6,5.04,5.36,5.68,5.95,6.38,null,null,null],
      qy:[null,null,null,null,3.17,3.3,3.56,3.71,3.67,3.88,3.96,4.21,4.43,4.72,4.6,5.04,5.36,5.68,5.95],
      qq:[null,3.17,3.3,3.56,3.71,3.67,3.88,3.96,4.21,4.43,4.72,4.6,5.04,5.36,5.68,5.95,6.38,null,null] },
    { k:'Mobility Gross Bookings', u:'$B', t:'ok', code:'INTERNET_GROSS_BOOKINGS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,17.38],[null,null,18.55,19.11],[null,18.37,18.72,19.13],[20.13,20.25,20.75,20.36],[21.48,21.77,21.54,null],[23.22,23.05,null,22.53],[22.32,null,21.73,21.47],[null,23.9,23.71,23.91],[24.58,24.3,24.54,24.85],[26.35,26.69,26.84,27.13],[24.91,25.08,25.23,25.85],[27.69,27.79,28.28,28.936],[29.02,29.47,29.87,29.87],[32.01,32.41,null,null],[30.68,null,null,null]],
      qa:[13.68,14.89,14.98,16.73,17.9,19.29,18.67,20.55,21,22.8,21.18,23.76,25.11,27.44,26.39,28.99,null,null,null],
      qy:[null,null,null,null,13.68,14.89,14.98,16.73,17.9,19.29,18.67,20.55,21.0,22.8,21.18,23.76,25.11,27.44,26.39],
      qq:[null,13.68,14.89,14.98,16.73,17.9,19.29,18.67,20.55,21,22.8,21.18,23.76,25.11,27.44,26.39,28.99,null,null] },
    { k:'Delivery Gross Bookings', u:'$B', t:'ok', code:'INTERNET_GROSS_BOOKINGS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,15.8],[null,null,16.5,16.76],[null,17.26,17.11,17.52],[17.87,17.69,18,18.11],[18.32,18.5,18.47,null],[19.47,19.41,null,19.68],[20.23,null,20.33,20.24],[null,20.78,20.81,21.21],[21.38,21.33,21.71,22.84],[22.92,23.26,24.23,24.75],[23.63,24.5,24.82,25.76],[25.66,25.94,26.64,26.965],[27.19,27.76,28.07,28.07],[29.86,30.16,null,null],[30.49,null,null,null]],
      qa:[13.68,14.31,15.03,15.6,16.09,17.01,17.7,18.13,18.66,20.13,20.38,21.73,23.32,25.43,25.99,27.46,null,null,null],
      qy:[null,null,null,null,13.68,14.31,15.03,15.6,16.09,17.01,17.7,18.13,18.66,20.13,20.38,21.73,23.32,25.43,25.99],
      qq:[null,13.68,14.31,15.03,15.6,16.09,17.01,17.7,18.13,18.66,20.13,20.38,21.73,23.32,25.43,25.99,27.46,null,null] },
    { k:'Mobility take rate', u:'%', t:'ok', code:'NET_TAKE_RATE',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,28],[null,null,27.9,27.9],[null,28.1,28.3,28.6],[28.2,28.5,28.6,29.2],[28.3,28.5,28.9,null],[28.5,29,null,30.2],[29.9,null,30.4,30.4],[null,30.2,30.2,30.4],[30.5,30.6,30.7,30.7],[30.5,30.5,30.6,30.5],[30.8,30.8,30.7,27.6],[30.8,30.7,27.8,26.5],[30.6,27.7,26.6,26.6],[27.5,26.4,null,null],[26,null,null,null]],
      qa:[27.9,27.8,28.9,29.3,28.3,28.7,30.2,29.8,30.5,30.3,30.7,30.7,30.6,29.9,25.8,25.4,null,null,null],
      qy:[null,null,null,null,27.9,27.8,28.9,29.3,28.3,28.7,30.2,29.8,30.5,30.3,30.7,30.7,30.6,29.9,25.8],
      qq:[null,27.9,27.8,28.9,29.3,28.3,28.7,30.2,29.8,30.5,30.3,30.7,30.7,30.6,29.9,25.8,25.4,null,null] },
    { k:'Delivery take rate', u:'%', t:'ok', code:'NET_TAKE_RATE',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,19.9],[null,null,20,18.7],[null,20.3,19.1,18.8],[20,18.9,18.7,18.5],[18.8,18.6,18.6,null],[18.6,18.6,null,18.7],[18.6,null,18.6,18.6],[null,18.6,18.6,18.5],[18.8,18.8,18.7,18.9],[18.9,18.8,19,19.1],[18.7,18.9,19,19],[19,19.1,19.2,19.4],[19.3,19.4,19.6,19.6],[19.4,19.6,null,null],[19.8,null,null,null]],
      qa:[20.2,20.5,20.6,19.6,18.2,18.3,18.2,18.2,18.6,18.7,18.5,18.9,19.2,19.2,19.5,19.1,null,null,null],
      qy:[null,null,null,null,20.2,20.5,20.6,19.6,18.2,18.3,18.2,18.2,18.6,18.7,18.5,18.9,19.2,19.2,19.5],
      qq:[null,20.2,20.5,20.6,19.6,18.2,18.3,18.2,18.2,18.6,18.7,18.5,18.9,19.2,19.2,19.5,19.1,null,null] },
    { k:'Adj. EPS', u:'$', t:'ok', code:'IS_COMP_EPS_ADJUSTED',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.219],[null,null,0.269,0.267],[null,0.262,0.292,0.282],[0.336,0.362,0.374,0.405],[0.416,0.433,0.426,null],[0.543,0.546,null,0.523],[0.591,null,0.543,0.542],[null,0.67,0.716,0.843],[0.746,0.799,0.897,0.911],[0.894,0.988,0.979,0.739],[1.041,0.957,0.792,0.702],[1.149,0.9,0.805,0.809],[0.965,0.856,0.856,0.856],[0.955,0.962,null,null],[0.949,null,null,null]],
      qa:[-0.61,0.29,-0.024,0.031,0.111,0.645,0.285,0.371,0.51,0.56,0.5,0.637,0.683,0.71,0.72,0.81,null,null,null],
      qy:[null, null, null, null, -0.61, 0.29, -0.024, 0.031, 0.111, 0.645, 0.285, 0.371, 0.51, 0.56, 0.5, 0.637, 0.683, 0.71, 0.72],
      qq:[null,-0.61,0.29,-0.024,0.031,0.111,0.645,0.285,0.371,0.51,0.56,0.5,0.637,0.683,0.71,0.72,0.81,null,null] },
        { k:'Trips per MAPC', u:'x', t:'ok', code:'MONTHLY_TRIPS_PER_MAU',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,5.52],[null,null,5.6,5.72],[null,5.63,5.69,5.76],[5.71,5.79,5.87,5.85],[5.97,6.01,6,null],[6.08,6.08,null,6.01],[6.06,null,5.92,5.89],[null,6.08,6.04,6.11],[6.13,6.1,6.14,6.14],[6.19,6.26,6.24,6.27],[6.17,6.18,6.18,6.12],[6.32,6.32,6.26,6.25],[6.45,6.39,6.37,6.37],[6.48,6.42,null,null],[6.32,null,null,null]],
      qa:[5,5.4,5,5.5,6,5.78,5.75,5.9,5.9,6,5.95,6.1,6.2,6.2,6.1,6.2,null,null,null],
      qy:[null,null,null,null,5.0,5.4,5.0,5.5,6.0,5.78,5.75,5.9,5.9,6.0,5.95,6.1,6.2,6.2,6.1],
      qq:[null,5,5.4,5,5.5,6,5.78,5.75,5.9,5.9,6,5.95,6.1,6.2,6.2,6.1,6.2,null,null] },
    { k:'Trips', u:'B', t:'ok', code:'NUMBER_ONLINE_TRANSACTIONS_GENL',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,2.39],[null,null,2.46,2.54],[null,2.46,2.51,2.59],[2.59,2.64,2.73,2.71],[2.93,2.88,2.87,null],[3.02,3.01,null,3.02],[2.99,null,2.96,2.98],[null,3.15,3.17,3.23],[3.28,3.28,3.33,3.39],[3.48,3.54,3.59,3.66],[3.47,3.54,3.6,3.65],[3.78,3.83,3.89,3.901],[4.05,4.09,4.12,4.12],[4.34,4.37,null,null],[4.22,null,null,null]],
      qa:[null,null,2.12,2.28,2.44,2.6,2.57,2.77,2.87,3.07,3.04,3.27,3.51,3.75,3.64,3.87,null,null,null],
      qy:[null,null,null,null,null,null,2.12,2.28,2.44,2.6,2.57,2.77,2.87,3.07,3.04,3.27,3.51,3.75,3.64],
      qq:[null,null,null,2.12,2.28,2.44,2.6,2.57,2.77,2.87,3.07,3.04,3.27,3.51,3.75,3.64,3.87,null,null] },
  ]
};
var CE_ANNUAL = {
  years:[2022, 2023, 2024, 2025, 2026, 2027],
  guidance:false,   // Summit model export carries no UBER guidance values (all zero); shown Street+reported only
  m:[
    { k:'Revenue', u:'$B', actual:[31.9,37.3,44.0,52.0,null,null], bbg:[null,37.1,43.8,52.0,58.2,66.9], summit:[null,null,null,null,null,null] },
    { k:'Operating income', u:'$B', actual:[-1.8,1.1,4.0,6.5,null,null], bbg:[null,1.0,3.2,6.2,8.8,11.0], summit:[null,null,null,null,null,null] },
    { k:'EBITDA', u:'$B', actual:[1.7,4.1,6.5,8.7,null,null], bbg:[null,4.0,6.5,8.7,11.4,13.5], summit:[null,null,null,null,null,null] },
  ]
};
// "Also on the call" supplemental colour for the Q1 2026 print \u2014 bands context/logged only
// (thesis-movers live on the shared Watch List / company_themes). Every item obeys Rule 0 (fact \u2192 why \u2192 so-what). From the
// Q1 2026 transcript analysis (docs/calls/UBER-latest.md).
var UB_Q1_2026_HIGHLIGHTS = [
  { tag:'watch', band:'logged',
    head:'Freight returned to growth for the first time in nearly two years \u2014 stated, but not explained',
    detail:'<p>Management flagged the inflection in one line and gave <b>no driver</b> for it. Freight is small and low-margin, so it barely moves the model \u2014 but the silence is the note: a segment coming off a ~2-year recession with zero colour on <i>why</i> is a datapoint to press, not celebrate.</p><p><b>So what:</b> worth mentioning as a cyclical turn in the industrial economy; not thesis-weight until management attaches a cause.</p>' },
  { tag:'curious', band:'logged',
    head:'Hotels via Expedia (700K properties) + Travel Mode \u2014 the on-demand-to-planned bet, funded by Uber One',
    detail:'<p>Dara\'s logic: Uber Reserve already proved users will book ahead (airports are ~15% of mobility GBs; 40% of US riders travel outside their home city). Expedia supplies inventory; Uber "took most of the economics and gave it back to Uber One members" (10% credits + 20% off a rolling 10K hotels). "Hoping hotels can be just as big as Reserve."</p><p><b>So what:</b> genuine new-category optionality that also deepens the membership moat \u2014 but entirely un-modelled, and the economics are deliberately handed to members, so near-term margin is not the point.</p>' },
  { tag:'thesis', band:'context',
    head:'The barbell WAS the answer to "what\'s the AV/ROI payback?" \u2014 a framework, offered instead of a number',
    detail:'<p>Pressed by Devnani on aggregate ROI, Balaji re-anchored on the barbell: low-cost products drive <b>75% higher frequency</b>, premium products <b>3.5x higher profit growth</b>, and both lift first-time acquisition <b>25%</b> \u2014 the machine that lets Uber "compound at 20% with annual margin expansion."</p><p><b>So what:</b> it confirms the profitable-scaling mechanism, but note it was a <i>deflection</i> of the direct payback question \u2014 the framework stands in for the number.</p>' },
  { tag:'dots', band:'context',
    head:'Cross-platform headroom got quantified \u2014 ~$15B run-rate delivery GBs flow from the mobility app; 30% of mobility users have never opened Eats',
    detail:'<p>Balaji, on new entry points (One Search): the mobility app already funnels ~$15B of delivery bookings, and 30% of eligible mobility consumers have never used Uber Eats. Cross-platform consumers grow 1.5x faster than the base.</p><p><b>So what:</b> connects the "platform" narrative to a concrete, largely untapped cross-sell pool that mono-line competitors structurally cannot replicate.</p>' },
  { tag:'watch', band:'logged',
    head:'International delivery is on the offensive \u2014 7 new markets, Finland #1 day one, Australia re-accelerated to 30%',
    detail:'<p>Balaji: delivery position "improving substantially" globally; expansion into 7 new European markets (Finland launched that morning, already #1 on the App Store); Australia re-accelerated to 30% by pushing into sparse markets; Japan/Taiwan trends strong. Europe faces "incremental competitive intensity from DoorDash and Prosus" \u2014 "held our own."</p><p><b>So what:</b> delivery has a real international growth leg, but the DoorDash/Prosus escalation is the cost/margin risk to watch.</p>' },
  { tag:'curious', band:'logged',
    head:'AI is already in the build \u2014 ~10% of code agent-written, and the 2026 budget was re-upped mid-year',
    detail:'<p>Dara: commits per engineer and lines per commit rising; "about 10% of our code committed is built by autonomous agents" (human-reviewed). AI investment is rising, "offset by slower headcount growth." Balaji, candidly: the November 2026 budget "underestimated the impact AI tools could have" and was re-upped after December model releases.</p><p><b>So what:</b> the efficiency lever is real and measurable, but a mid-year budget increase is a cost signal \u2014 size it against the headcount offset before calling it margin-accretive.</p>' },
  { tag:'tone', band:'context',
    head:'Management\'s stance on agentic disintermediation: the travel-metasearch analogy, "we dictate the terms of trade"',
    detail:'<p>Asked directly (Morton) about personal agents (Meta/Google) abstracting the app away, Dara reached for his Expedia/Booking history: value accrued to the consolidated players, not the metasearch layer; "as long as we build terrific core products\u2026 the majority of transactions come direct." Uber will build APIs to Apple/OpenAI/Claude/Gemini and believes its scale lets it "often dictate the terms of trade."</p><p><b>So what:</b> the clearest articulation yet of how management frames the biggest structural risk \u2014 reassuring and historically grounded, but note there were <i>no</i> terms-of-service specifics despite the direct ask.</p>',
    open:'No terms-of-service specifics were given despite the direct ask \u2014 the mechanism of defence is asserted, not shown.' },
];
// The AI-generated CALL SUMMARY ("the minute") for Q1 2026 \u2014 always-visible punch paragraphs, each
// with an optional "\uff0b more". Distilled from the Q1 2026 transcript analysis (docs/calls/UBER-latest.md).
var UB_Q1_2026_SUMMARY = { paras:[
  { p:'<b>The top line was a broad-based beat delivered at or above the high end of both guided ranges \u2014 and, the part that matters, it was trip- and audience-led, not price.</b> Gross Bookings grew ~21% on ~17% audience (MAPC) growth, so the acceleration is coming from more people taking more trips, not from insurance pass-through or FX. That is the cleanest possible quality-of-beat.',
    moreLabel:'\uff0b more \u2014 the barbell behind it', more:'<p>Management framed the quarter as the barbell compounding: low-cost products drive 75% higher frequency, premium products 3.5x higher profit growth, and both lift first-time acquisition 25% \u2014 "compounding at 20% with annual margin expansion."</p>' },
  { p:'<b>The 2026 insurance thesis got its first hard datapoint.</b> Uber said this is the "first year since COVID" that US insurance is a source of operating leverage rather than a cost headwind \u2014 March renewals reset lower and more risk moved to third-party carriers. The tell management volunteered: Los Angeles, its worst market, is now growing "significantly better than California and the rest of the country."',
    moreLabel:'\uff0b more \u2014 why L.A. is the proof point', more:'<p>L.A. had been depressed by insurance-cost-driven price elasticity; its re-acceleration is the local proof that the savings-to-riders flywheel works. Management said it is "even more confident than in December."</p>' },
  { p:'<b>AV shifted from demo to infrastructure \u2014 and picked up a genuinely new, capital-light financing doctrine.</b> AV mobility trips grew >10x YoY, Uber launched Uber Autonomous Solutions (operational infrastructure for partners), and disclosed a Santander financing arrangement \u2014 with Hertz fleet management and Marsh/Apollo insurance \u2014 that lets partners scale fleets without Uber owning the capital.',
    moreLabel:'\uff0b more \u2014 the unproven part', more:'<p>The underwriting basis is "predictable revenue per vehicle per day at a premium to 1P networks." Management acknowledged the AV residual-value risk is not yet liquid \u2014 which is exactly why this sits on the Watch List as a promise to reconcile, not a settled fact.</p>' },
  { p:'<b>Profit compounded ~2x bookings, and capital return stepped up.</b> Non-GAAP EPS grew +44% against +21% bookings on operating leverage, and Uber returned a record $3B in buybacks. Score the clean lines \u2014 income from operations and Adjusted EBITDA \u2014 because GAAP net income is distorted by mark-to-market swings on Uber\'s equity stakes (Aurora, Grab, Didi).' },
  { p:'<b>The soft spots are what management would not quantify.</b> AV economics were still described with a "$1T TAM" adjective rather than a payback number; the mid-year AI budget re-up was acknowledged but never sized; and the call itself was unusually short. Those three silences are where the next surprise most likely hides.' },
] };
// Thesis red-lines FROZEN going into Q1 2026 (from the Q4 2025 setup / Watch List), checked against
// the Q1 2026 print — the most falsifiable thing in Post-Results (§6, canonical googl.js). HELD/TRIPPED
// per the transcript analysis (docs/calls/UBER-latest.md); every note carries fact → why (Rule 0).
var UB_Q1_2026_THESISCHECK = [
  { line:'US-mobility acceleration fails to show up in trips / insurance stays a cost headwind', tripped:false,
    note:'The opposite: Mobility GB accelerated to <b>+20% with record segment margins</b>, and insurance flipped to <b>leverage for the first year since COVID</b>. L.A. — the worst insurance market — is now growing “significantly better than California and the rest of the country.” The 2026 thesis got its first hard market datapoint, in the hardest market.' },
  { line:'AV scaling triggers a capital or margin shock to the core', tripped:false,
    note:'Mobility posted <b>record margins</b> while AV mobility trips grew <b>&gt;10x YoY</b> and Uber returned a record <b>$3B</b> in buybacks. The new Santander / Hertz / Marsh financing doctrine is explicitly <b>capital-light</b> — Uber does not own the fleet. No capital or margin shock; the AV residual-value risk was acknowledged, not incurred.' },
  { line:'Waymo cannibalizes Uber’s core in the live AV markets', tripped:false,
    note:'“We don’t see any effect of the Waymo launches on our overall business” — SF/L.A. category position <b>higher</b> than six months ago, driver earnings up in Austin/Atlanta. This is management’s own read on a live competitive question, so it stays tracked, not settled (scored quarter by quarter as Waymo expands).' },
  { line:'Profitable scaling breaks as grocery/retail mixes into Delivery', tripped:false,
    note:'Non-GAAP EPS <b>+44%</b>, more than 2x the +21% bookings, on operating leverage; Delivery <b>+23%</b> led by grocery/retail <i>with</i> strong retention. The profitable-scaling machine held through the mix shift — though the grocery-margin mechanics were only partially addressed (Colantuoni’s question pivoted to competition).' },
  { line:'The AI investment step-up shows up as visible margin pressure', tripped:false,
    note:'It did not hit margins this quarter (record profitability) — but the line is now on watch: Balaji conceded the November 2026 AI budget was <b>re-upped mid-year</b> after December model releases, “traded off against incremental headcount growth,” and never sized it. Held this quarter, flagged for next.' },
];
// What the Q1 2026 print TEES UP for the next call — the hunt list, from the transcript’s seeds +
// logged silences (docs/calls/UBER-latest.md). Everything before the first em-dash is the visible
// hook; the rest opens behind “＋ the ask.”
var UB_Q1_2026_INTOCALL = [
  '🔥 <b>AV economics are still an adjective</b> — the direct ROI/payback question (Devnani) was deflected into the barbell framing and AV revenue was never sized beyond “another trillion-dollar TAM.” Press for a number: revenue per vehicle per day, the “premium to 1P networks” claim, and where the residual-value risk actually sits.',
  '💸 <b>The AI budget re-up is un-sized</b> — Balaji admitted the November 2026 budget “underestimated the impact AI tools could have” and was re-upped mid-year, “traded off against incremental headcount growth.” How big is the re-up, and does the headcount offset make it net margin-neutral or a real 2026 cost?',
  '🛵 <b>Delivery margin under a heavier grocery mix</b> — Delivery +23% is increasingly grocery/retail (lower margin), and Europe now faces “incremental competitive intensity from DoorDash and Prosus,” where Uber “held its own.” Does Delivery margin still leverage through the mix, and what does the European fight cost?',
  '📈 <b>Does insurance leverage compound past L.A.?</b> — the L.A. datapoint is the proof of concept; the thesis needs it to broaden into national US-mobility acceleration through 2026. Watch Mobility segment margin and the breadth of US trip growth beyond the three lead markets.',
  '👑 <b>When does 50%-a-year Uber One lap?</b> — 50M members, &gt;50% of bookings, now funding a hotels/Expedia push. Management “doesn’t see it slowing,” but 50% growth eventually laps; the deceleration point and whether spend/retention hold as the base scales is the model input.',
  '🚚 <b>Freight returned to growth, unexplained</b> — the first growth in nearly two years was stated with no driver. Small and low-margin, so it barely moves the model, but a ~2-year recession inflecting with zero colour is worth pressing as an industrial-economy read.',
];
// ── Q2 2026 (reported Wed 5 Aug 2026, before open; call 8:00am ET). Print from Uber's release;
// call material from the Q2 2026 transcript. ──────────────────────────────────────────────────
var UB_Q2_2026_HIGHLIGHTS = [
  { tag:'thesis', band:'context',
    head:'The take-rate collapse finally got a bridge — 400 of the ~500bp is the UK accounting change, ~100bp is deliberate',
    detail:'<p>The scariest optical line in the model got its first real explanation. Balaji put the decline at "nearly 500 basis points", attributed <b>~400bp to the UK model change</b> and the remaining <b>~100bp to "deliberate investments"</b> — which is why revenue grew <b>+12%</b> against Gross Bookings <b>+24%</b>. Mobility take rate is now ~25.4% against ~29.9% four quarters ago.</p><p><b>So what:</b> this converts a scary trend line into a mostly mechanical one, and it is datable — the UK 400bp laps from 1Q27, after which reported revenue growth should re-converge on bookings growth. But the ~100bp of "deliberate investments" was <b>never broken down by initiative</b>, so the discretionary half of the compression is still unaudited.</p>',
    open:'The ~100bp of deliberate investment was not split by initiative — the discretionary part of the compression remains unquantified.' },
  { tag:'watch', band:'logged',
    head:'Uber is retiring Adjusted EBITDA — announced in the release, never mentioned on the call',
    detail:'<p>The release states that <b>"Adjusted EBITDA is no longer a key measure used by management; we include a disclosure on Adjusted EBITDA to assist during the transition to our new non-GAAP measures"</b>, and the segment tables have been replaced with <b>Segment Operating Income</b> (Mobility $2,215M +28%, Delivery $1,055M +38%, Freight −$24M, Corporate G&amp;A / Platform R&amp;D −$1,103M). Not one word of it on the call — no analyst asked, and management did not raise it.</p><p><b>So what:</b> a company changing its headline profit measure without explaining why is a governance and comparability question, not a housekeeping note. It also breaks our own tracking: the Q1 setup named <i>Mobility segment Adjusted-EBITDA margin</i> as "the number that can’t wobble", and that number no longer exists. Uber still guided Q3 Adjusted EBITDA ($2.86–2.96B) while calling it non-key — press on what replaces it and how the guide is framed from here.</p>',
    open:'No reason given for retiring Adjusted EBITDA, and no statement of what the new headline measure is or when the guide switches.' },
  { tag:'watch', band:'logged',
    head:'Brazil is the new soft spot — a food-delivery war is raising the cost of two-wheeler supply and costing mobility trips',
    detail:'<p>An "enormous amount of competition as it relates to the food business" — DiDi Food and Meituan both entering against iFood. The mechanism matters: two-wheeler supply is <b>shared between food and mobility</b>, so "the cost of securing that supply has gone up" and share is moving "from the mobility side of the business to the delivery side". Management says Uber "continue to hold our share in Brazil"; two-wheeler margins are "quite low…certainly not hitting the bottom line, but it is affecting trip volumes."</p><p><b>So what:</b> the honest read is that a delivery price war shows up first as a <i>volume</i> drag in mobility, not a margin one — which is exactly the kind of leakage that hides inside a 22% consolidated growth number. Framed as an investment period, not a threat.</p>' },
  { tag:'thesis', band:'context',
    head:'AV is now a $10B commitment against less than 0.5% of trips — and the payback question went unanswered for a fourth quarter',
    detail:'<p>Live in <b>7 cities, on track for 15 by year-end</b>, "hundreds of thousands of trips per week" — but explicitly <b>"less than 0.5% of our overall trip volume"</b> against ~300M trips a week. Against that, a <b>$10B multi-year investment</b> across equity stakes and infrastructure, plus AV Labs (rideshare-specific data to accelerate partners’ end-to-end models) and a widened partner bench (Wayve, Zoox, Nuro, Baidu, Pony, Verne, Rivian, NVIDIA). On profitability Balaji said only: "we will give you more visibility into that as we go."</p><p><b>So what:</b> management is being unusually candid about how early this is — Dara’s own framing is that unlike foundation models, "AVs are physical, regulated systems that have to be deployed market by market", with school zones, emergency vehicles and motorcade closures as live blockers. Credible, but the spend is now large enough that "more visibility as we go" is wearing thin.</p>',
    open:'AV revenue per vehicle, payback and per-partner financial commitments all still unquantified — fourth consecutive quarter.' },
  { tag:'watch', band:'logged',
    head:'Capital return was paused for M&A — $4B went to Delivery Hero, and the buyback rebuild is a datable promise',
    detail:'<p>TTM free cash flow crossed <b>$10B for the first time ($10.1B)</b>, and $3.5B of buybacks have been done year-to-date — but Q2 "pivoted heavily to M&amp;A", ~$4B toward the Delivery Hero position. Management committed to rebuilding repurchases "steadily" within <b>"months, not quarters"</b>.</p><p><b>So what:</b> one of the few things on this call with a checkable date attached. Delivery Hero takes Uber to nearly 100 markets — roughly doubling the markets with full platform access — but primary migrations are not until <b>2029</b>, so the synergy story is long-dated while the cash went out now.</p>' },
  { tag:'curious', band:'logged',
    head:'The cross-sell pool got re-quantified downward-ish — only 20% of consumers use both Rides and Eats',
    detail:'<p>Last quarter the framing was "30% of mobility users have never opened Eats"; this quarter it is put the other way round — <b>only 20% of consumers use both</b>, and cross-platform users grow <b>1.5x faster</b>. Alongside: "less than 10% of eligible consumers in our sparse markets have used Uber in the past 12 months", Uber Premium <b>+40% YoY</b>, and "3/4 of our rides happen via a personalized destination suggestion".</p><p><b>So what:</b> the headroom numbers keep getting bigger and more specific, which is the good version of a growth story — but they are all penetration <i>opportunities</i>, not conversion rates achieved.</p>' },
  { tag:'tone', band:'context',
    head:'On AI, management refused the aggregate number on purpose — "thousands of small hits"',
    detail:'<p>Mahaney asked directly for AI’s consumer impact. Dara: <b>"I wouldn’t look for one giant hit from AI. It’s going to be thousands of small hits"</b> — then anecdotes (Cart Assistant lifting average order size "often twice the size", personalized destinations) rather than any aggregate uplift. On the internal side Balaji claimed <b>"near 100% adoption with our engineers on AI-based coding tools"</b> and a <b>"doubling in the code output per engineer"</b>, immediately hedged: "we are being quite smart internally on how we are measuring this and not getting ahead of our skis."</p><p><b>So what:</b> the hedge is the honest part and worth crediting — but a doubling of engineering output with no dollar figure, in the same quarter the AI budget question from Q1 went unanswered again, means the cost side and the benefit side are both still assertions.</p>',
    open:'No aggregate AI revenue or margin figure; the Q1 AI budget re-up still un-sized two quarters running.' },
];
var UB_Q2_2026_SUMMARY = { paras:[
  { p:'<b>A clean beat on everything Uber actually guides, and the growth is still accelerating.</b> Gross Bookings $58.0B (+24% reported, +22% constant-currency) came in <b>above the $56.25–57.75B guide</b> and above the $57.2B Street; Adjusted EBITDA $2,819M cleared the $2.70–2.80B guide; non-GAAP EPS $0.81 landed inside the $0.78–0.82 guide and effectively on the $0.809 Street. It is the fourth consecutive quarter of 20%+ bookings growth, and trailing-twelve-month free cash flow crossed <b>$10B for the first time</b>.',
    moreLabel:'＋ more — the quality of it', more:'<p>Trips +18% to 3,867M on MAPCs +16% to 208M — volume-led, not price-led. Adjusted EBITDA margin on Gross Bookings rose to <b>4.9% from 4.5%</b>, and non-GAAP operating income as a share of bookings to 3.7% from 3.3%. Profit compounded roughly 1.5x bookings.</p>' },
  { p:'<b>The revenue-versus-bookings gap finally has a bridge — and most of it is accounting, not economics.</b> Revenue grew just +12% against +24% bookings. Balaji sized the take-rate decline at "nearly 500 basis points" and attributed <b>~400bp to the UK model change</b>, with ~100bp from "deliberate investments". That is the single most useful number on the call: it dates the drag (the UK change laps from 1Q27) and moves the debate to the ~100bp that is actually discretionary.',
    moreLabel:'＋ more — why it matters for the model', more:'<p>Mobility take rate is now ~25.4% versus ~29.9% four quarters ago. If the 400bp is genuinely mechanical, reported revenue growth should re-converge on bookings growth from early 2027 without anything changing in the business. The ~100bp was never split by initiative — that is the part still to audit.</p>' },
  { p:'<b>Uber is retiring Adjusted EBITDA, and did not say so out loud.</b> The release states it "is no longer a key measure used by management" and replaces segment Adjusted EBITDA with <b>Segment Operating Income</b> (Mobility $2,215M +28%, Delivery $1,055M +38%). Nobody raised it on the call. The measure Uber still guides for Q3 is the one it just called non-key — and our own Q1 red line, Mobility segment Adjusted-EBITDA margin, no longer exists to be checked.' },
  { p:'<b>The spending has moved from the P&amp;L to the balance sheet.</b> A <b>$10B multi-year AV commitment</b> against AV volumes that are still "less than 0.5% of our overall trip volume", and ~$4B toward Delivery Hero that paused the buyback (≈$3.5B YTD, rebuilding "months, not quarters"). Margins were fine this quarter precisely because the investment is showing up as capital deployed, not opex — which is the harder thing to score.' },
  { p:'<b>Brazil is the leak worth watching.</b> DiDi Food and Meituan entering against iFood has bid up the cost of two-wheeler supply, which Uber shares between food and mobility — so a delivery price war is showing up as <b>mobility trip softness</b>, not a margin line. Small inside a 22% consolidated number, and management frames it as an investment period, but it is the mechanism to keep an eye on.' },
] };
// Thesis red-lines FROZEN going into Q2 2026 (from the Q1 2026 setup + Watch List), checked against
// the Q2 2026 print and transcript. Every note carries fact -> why (Rule 0).
var UB_Q2_2026_THESISCHECK = [
  { line:'Insurance leverage fails to broaden beyond L.A. into national US mobility', tripped:false,
    note:'Held. Insurance is now described flatly as "becoming a tailwind this year", with the savings <b>reinvested into California markets</b>, and Balaji named it first of the three drivers of US mobility momentum. Mobility Gross Bookings +22% YoY to <b>$28,988M</b> and Mobility segment operating income <b>+28% to $2,215M</b> — profit growing faster than bookings is what broadening leverage looks like. Note the caveat management volunteered: the World Cup "was a benefit, but it was as expected to a large extent."' },
  { line:'The AV/AI investment step-up shows up as visible margin pressure', tripped:false,
    note:'Held on the P&amp;L — Adjusted EBITDA margin on bookings <i>rose</i> to 4.9% from 4.5% — but for a reason that should be read carefully: the step-up landed as <b>capital</b>, not cost. A $10B multi-year AV commitment and ~$4B of M&amp;A paused the buyback. The red line as written did not trip; the risk simply moved to a line this check does not watch. Re-cut it for Q3 against capital allocation, not margin.' },
  { line:'The number that can’t wobble: Mobility segment Adjusted-EBITDA margin', tripped:true,
    note:'Tripped — not by the number, by the disclosure. Uber states Adjusted EBITDA "is no longer a key measure used by management" and has replaced segment Adjusted EBITDA with <b>Segment Operating Income</b>. The metric this red line was struck against no longer exists, and the change was never mentioned on the call. The underlying economics look fine on the new measure (Mobility operating income +28%), but a tracking line that a company can retire mid-thesis is a weak tracking line — restate it on segment operating income.' },
  { line:'Profitable scaling breaks as grocery/retail mixes into Delivery', tripped:false,
    note:'Held, and comfortably: Delivery segment operating income <b>+38% to $1,055M</b> against Delivery bookings +26% — profit still compounding faster than volume through the mix. The new colour is the Cart Assistant AI feature, where average order size is "often twice the size". The competitive cost is showing up in Brazil rather than in the margin.' },
  { line:'Waymo cannibalizes Uber’s core, or Uber ends up dependent on one AV partner', tripped:false,
    note:'Held, and answered directly for once. Dara: "Waymo is a very important partner of ours, and we continue to operate in Austin and Atlanta… the on-the-ground partnership continues to be very strong" — while conceding the diversification motive out loud: <b>"we want to make sure that we’re not dependent on one partner."</b> The partner bench is now Wayve, Zoox, Nuro, Baidu, Pony, Verne, Rivian and NVIDIA. Stays tracked as Waymo expands.' },
];
// What the Q2 2026 print TEES UP for the Q3 call. Everything before the first em-dash is the visible
// hook; the rest opens behind "+ the ask".
var UB_Q2_2026_INTOCALL = [
  '📉 <b>Split the ~100bp of "deliberate investments" in the take rate</b> — Balaji bridged ~400 of the ~500bp decline to the UK model change and left ~100bp as discretionary spend, unbroken-down. Which initiatives, how long do they run, and does the UK 400bp lap cleanly from 1Q27 so reported revenue growth re-converges on bookings growth?',
  '📐 <b>Why is Adjusted EBITDA being retired, and what replaces it?</b> — the release calls it "no longer a key measure used by management" and swaps segment tables to Segment Operating Income, with no explanation and no question asked on the call. Ask directly: what is the new headline measure, when does the guide switch to it, and what does the restated history look like?',
  '🇧🇷 <b>Size the Brazil drag</b> — DiDi Food and Meituan entering against iFood has raised two-wheeler supply cost and is "affecting trip volumes" in mobility. How many trips, for how long, and at what point does holding share stop being worth the price?',
  '🤖 <b>$10B against 0.5% of trips — the payback question is now four quarters old</b> — "we will give you more visibility into that as we go" is the fourth consecutive deferral. Ask for revenue per vehicle per day, the AV Labs data-rights economics, and what the per-partner commitments actually are (Lucid was described only as "guaranteed volume" in a "$70,000–$80,000 range").',
  '💰 <b>"Months, not quarters" is datable — check it</b> — buybacks were paused at ~$3.5B YTD for the ~$4B Delivery Hero move, with a commitment to rebuild steadily. If Q3 does not show repurchases stepping back up, the M&amp;A pivot is structural rather than opportunistic.',
  '🧠 <b>Put a number on AI, on either side</b> — "thousands of small hits" on the revenue side and a "doubling in the code output per engineer" on the cost side, with the Q1 budget re-up still un-sized two quarters running. Either the efficiency is large enough to show in opex growth or it is not; ask which.',
];
var CALL_EARNINGS = { ticker:'UBER', quarters:[
  { q:'Q3 2026', status:'upcoming', date:'early November 2026 (date TBC)',
    setup:{ source:'Bloomberg (BST) — BBG_CONSENSUS.txt snapshot archive · Summit — Summit_Financial_Data model (snapshot 2026-08-05)', asOf:'2026-07-31',
      notes:{
        'Revenue':{ t:'Street column is PRE-print', h:'<p>The newest Bloomberg snapshot in the archive is <b>31 Jul 2026</b>, before the 5 Aug print. The Q3 2026 Street figures shown are therefore that file’s <b>two-quarters-out</b> consensus, not a post-print refresh — they will move once the next archive drop lands. Summit is post-print (5 Aug vintage): Q3 2026 revenue <b>$15.17B</b>, raised from $14.93B pre-print.</p>' },
        'Operating income':{ t:'Non-GAAP, not GAAP', h:'<p>Both the Street line (<code>IS_COMPARABLE_EBIT</code>) and the Summit line (<code>ADJ_OPINC</code>) are the <b>non-GAAP / comparable</b> operating income — $2,143M in Q2 2026, not the $1,890M GAAP figure. Do not mix them.</p>' },
        'EBITDA':{ t:'A measure Uber is retiring', h:'<p>Uber guided Q3 Adjusted EBITDA at <b>$2.86–2.96B</b> while stating in the same release that Adjusted EBITDA "is no longer a key measure used by management". Summit’s forward EBITDA here is from the <b>31 Jul</b> vintage — the 5 Aug model re-cut revenue and the adjusted P&amp;L but left the quarterly EBITDA row empty.</p><p><b>Margin basis:</b> the margins shown in this grid are struck on <b>revenue</b>, which is Bloomberg’s comparable-EBITDA convention. Uber itself quotes the margin on <b>Gross Bookings</b> (4.9% in Q2 2026, up from 4.5%) — that is the basis used in the Results tab. Same numerator, different denominator; do not compare the two percentages directly.</p>' },
        'EPS':{ t:'GAAP — whipsawed by equity marks', h:'<p>This line is <b>GAAP</b> EPS (<code>IS_COMP_EPS_GAAP</code>), dominated by mark-to-market swings on Uber’s equity stakes (Aurora, Grab, Didi) — $1.17 in Q2 2026 against $0.81 non-GAAP. Score <b>Adj. EPS</b> instead, which is the line Uber guides.</p>' },
        'Adj. EPS':{ t:'The guided line', h:'<p>Uber guides Non-GAAP EPS of <b>$0.84–$0.88</b> for Q3 2026 (+28% to +35% YoY). Street ~$0.86, Summit <b>$0.90</b> — Summit sits at or just above the top of the guide, which is the disagreement to watch.</p>' },
        'Mobility take rate':{ t:'The UK change laps in 1Q27', h:'<p>Take rate fell ~500bp over four quarters; management attributes ~400bp to the UK accounting model change and ~100bp to "deliberate investments". The mechanical part laps from <b>1Q27</b>, so Q3 and Q4 2026 should still show the depressed rate.</p>' },
        'Capex':{ t:'Sign flip — and asset-light', h:'<p>Capex arrives from the archive as a cash <b>outflow</b> and is shown here as a positive magnitude. Uber is asset-light — ~$0.1B a quarter. Note this does <b>not</b> capture the $10B multi-year AV commitment, which runs through equity stakes and partner infrastructure.</p>' },
        'Trips':{ t:'Trips — in billions', h:'<p>Total quarterly Trips, in billions. Q2 2026 printed <b>3.87B</b> (+18% YoY) against a 3.90B Street. Summit Q3 2026: <b>4.20B</b>.</p>' }
      },
      us:{ 'Revenue':{v:15.169}, 'Operating income':{v:2.370}, 'EBITDA':{v:2.960}, 'Mobility Gross Bookings':{v:30.133}, 'Delivery Gross Bookings':{v:29.386}, 'Mobility take rate':{v:26.1}, 'Delivery take rate':{v:19.5}, 'Adj. EPS':{v:0.904}, 'Trips':{v:4.202}, 'Trips per MAPC':{v:6.33} },
      pricedIn:'Coming off a quarter that beat both guided lines with bookings accelerating to 22% constant-currency, the bar for Q3 is no longer growth — it is whether the spending discipline holds while $10B of AV commitment and a $4B acquisition sit on the balance sheet, and whether the buyback actually rebuilds inside the "months, not quarters" management promised.',
      oneLiner:'Pre-call view: guidance of $58.25–60.25B bookings and $0.84–0.88 EPS implies growth holds near 20% with EPS still compounding ~30%; the debate is what the discretionary ~100bp of take-rate investment is buying, and what replaces Adjusted EBITDA now that Uber has called it non-key.',
      debate:{ rows:null, diverge:[
      { t:'Summit sits above the guide on EPS — the sharpest disagreement', d:'Uber guides Non-GAAP EPS of <b>$0.84–$0.88</b>; the Street sits at <b>~$0.86</b>, mid-range, as it usually does. Summit is at <b>$0.90</b> — above the top of the guide. Uber has landed inside or above its EPS guide in each of the two quarters it has given one, so Summit is effectively betting the company is sandbagging again. A print at $0.88 or better validates the model; anything at $0.85 makes Summit the outlier, not the Street.' },
      { t:'Summit is above the Street on revenue, and the Street column is stale', d:'Summit models Q3 revenue at <b>$15.17B</b> against a Street figure of <b>$14.82B</b> — but that Street number is the <b>31 Jul, two-quarters-out</b> consensus, struck before the 5 Aug beat. Treat the gap as provisional: the honest comparison only exists once the next Bloomberg archive drop refreshes the post-print estimates. The same caveat applies to every Street cell in this Setup.' },
      { t:'The bookings guide is the one number that is not in doubt', d:'Guidance of <b>$58.25–60.25B</b> (+18% to +22% constant-currency) sits against Summit’s <b>$61.09B</b> — above the top of the range — and a stale Street at ~$59.3B. Uber has never printed below its own Gross Bookings guide in seventeen quarters of guiding it (5 above, 11 within, 0 below on our record). The interesting question is not whether the guide is met but whether Summit’s above-the-range number is right, which would mean a third consecutive quarter of accelerating bookings.' } ],
      synth:'The one thing to resolve: what the ~100bp of "deliberate investment" in the take rate is buying, and whether it is temporary. The second: what replaces Adjusted EBITDA as the measure management runs the company on — because until that is answered, the segment margin trend cannot be tracked across the change.' } },
    results:null, call:null },
  { q:'Q2 2026', status:'reported', date:'Wed Aug 5, 2026 · before open',
    setup:{ source:'Bloomberg (BST) \u2014 BBG_CONSENSUS.txt snapshot archive \u00b7 Summit \u2014 Summit_Financial_Data model', asOf:'2026-07-30',
      // Summit is filled ONLY on the lines where our model shares the reported/Street BASIS (cross-checked,
      // \u00a76a). Mobility GB, MAPCs and Trips match the archive 1:1. Revenue / Operating income / EBITDA / EPS
      // and Delivery GB are on a DIFFERENT Summit basis (grossed-up revenue+delivery, adj vs GAAP) \u2014 shown as
      // a note, NOT a fake surprise (a reconciliation item for San/Oscar; see js/results-data/uber.js header).
      notes:{
        'Revenue':{ t:'Summit reconciles (DHER toggle off)', h:'<p>The Summit revenue line used to run ~30% high ($67.9B vs reported $52.0B FY25) \u2014 that was the <b>Delivery Hero pro-forma consolidation toggle</b>, now OFF. Standalone, Summit revenue matches reported to the dollar (FY25 $52.0B), so the forward is directly comparable and is shown. Q2 2026 Summit: <b>$14.2B</b>.</p>' },
        'Delivery Gross Bookings':{ t:'Summit reconciles (DHER toggle off)', h:'<p>The ~$42B/quarter Summit Delivery GB was the <b>Delivery Hero pro-forma</b> consolidation; with the toggle off it is <b>~$27.6B</b> (vs reported ~$26B, Street ~$27B) \u2014 same basis, so it is now filled.</p>' },
        'EBITDA':{ t:'Comparable EBITDA vs Uber Adj. EBITDA', h:'<p>Bloomberg <code>IS_COMPARABLE_EBITDA</code> and Uber\u2019s own <b>Adjusted EBITDA</b> (the Summit line) are close but not identical (~10% historical gap; they converged to the dollar in Q1 2026). Read the surprise on the archive\u2019s own basis.</p>' },
        'EPS':{ t:'GAAP (Street) vs adjusted (Summit) \u2014 not mixed', h:'<p>Consensus/actual EPS is <b>GAAP</b> (<code>IS_COMP_EPS_GAAP</code>), dominated by mark-to-market swings on Uber\u2019s equity stakes (Aurora, Grab, Didi) \u2014 hence the wild history ($3.21, $0.14, $0.13). Summit only forecasts <b>adjusted</b> EPS (ex-marks, $0.83 for Q2 2026), so we deliberately do <b>not</b> show a Summit EPS here \u2014 scoring a GAAP actual against an adjusted estimate would be a false surprise. Score the clean lines (income from operations, Adj. EBITDA) instead.</p>' },
        'Capex':{ t:'Sign flip \u2014 and asset-light', h:'<p>Capex arrives from the archive as a cash <b>outflow</b> (negative) and is shown here as a positive magnitude. Uber is asset-light \u2014 capex is only ~$0.1B/quarter, immaterial to the model.</p>' },
        'Mobility Gross Bookings':{ t:'Like-for-like \u2014 Summit filled', h:'<p>Summit\u2019s Mobility GB matches the reported/archive figure to the dollar (ratio 1.00), so the forward Summit number is directly comparable. Summit Q2 2026: <b>$28.9B</b>.</p>' },
        'Adj. EPS':{ t:'Non-GAAP EPS \u2014 comparable to Summit', h:'<p>The <b>adjusted (Non-GAAP)</b> EPS the txt now carries as a KPI \u2014 clean of the equity-stake marks that whipsaw the GAAP headline line, so it is directly comparable to Summit. Street Q2 2026 ~<b>$0.81</b> vs Summit <b>$0.83</b>; Uber guides Non-GAAP EPS <b>$0.78\u2013$0.82</b>. (MAPCs was removed from the tracked KPI set.)</p>' },
        'Trips':{ t:'Trips \u2014 in billions', h:'<p>Total quarterly Trips, in billions. Summit and the archive agree 1:1; Summit Q2 2026: <b>~4.04B</b> against a <b>3.87B</b> print \u2014 the largest single miss in the Summit column this quarter. (The Q1 2026 Trips actual had come through the archive corrupted as <code>Error 2042</code>; it has since been backfilled at <b>3.64B</b>.)</p>' }
      },
      us:{ 'Revenue':{v:14.223}, 'Operating income':{v:2.084}, 'EBITDA':{v:2.795}, 'Shares outstanding':{v:2.040}, 'Operating cash flow':{v:2.673}, 'Capex':{v:0.084}, 'D&A':{v:0.213}, 'Mobility Gross Bookings':{v:28.871}, 'Delivery Gross Bookings':{v:27.602}, 'Mobility take rate':{v:26.0}, 'Delivery take rate':{v:19.5}, 'Adj. EPS':{v:0.83}, 'Trips per MAPC':{v:6.395}, 'Trips':{v:4.041} },
      debate:{ rows:null, diverge:[
      { t:'Top line ~ties, but the composition differs', d:'Revenue is a near-tie — Summit <b>$14.223B</b> vs Street <b>$14.242B</b> (−0.1%) — but they build it differently. Summit models <b>more trips</b> (4.041B vs 3.901B) and <b>more Delivery GB</b> ($27.602B vs $26.965B, +2.4%), but slightly <b>less Mobility GB</b> ($28.871B vs $28.936B) at <b>lower take rates</b> (Mobility 26.0% vs 26.5%). Summit’s revenue is more volume-led with thinner monetization; the Street leans a touch more on rate. Same destination, different path — the print settles which.' },
      { t:'On profit they cross over — not a tie', d:'Summit models slightly <b>more EBITDA</b> ($2.795B vs $2.785B) yet slightly <b>less operating income</b> ($2.084B vs $2.111B): because Summit carries higher D&amp;A ($0.213B vs $0.182B), the two swap ranking across the D&amp;A line. Small, but a real cost-structure difference — NOT a rounding tie.' },
      { t:'The real gap is CASH and capital return', d:'The biggest disagreement by far: Summit models operating cash flow <b>~20% below</b> the Street (<b>$2.673B vs $3.329B</b>, a ~$656M gap) — likely a working-capital / insurance-timing assumption. Yet Summit assumes <b>more buyback</b> (2.040B shares vs 2.059B). So Summit is cautious on cash generated but aggressive on cash returned — the two bets to reconcile against the print.' } ],
      synth:'The one thing to resolve: does the insurance-leverage acceleration broaden from L.A. to national US mobility, and does the AV/AI investment step-up show up as margin pressure before it shows up as return? The number that can\u2019t wobble: Mobility segment Adjusted-EBITDA margin.' } },
    results:{ summary:UB_Q2_2026_SUMMARY, thesisCheck:UB_Q2_2026_THESISCHECK, intoCall:UB_Q2_2026_INTOCALL },
    call:{ highlights:UB_Q2_2026_HIGHLIGHTS } },
  { q:'Q1 2026', status:'reported', date:'Tue May 6, 2026 \u00b7 after close',
    setup:{ source:'Bloomberg (BST) \u2014 BBG_CONSENSUS.txt snapshot archive (going-in consensus) \u00b7 Summit \u2014 no frozen pre-print estimate in the model snapshot', asOf:'2026-01-29', notes:{}, us:null,
      pricedIn:'Coming off a Q4 that confirmed insurance flipping to leverage and US-mobility acceleration for 2026, the bar was: prove the acceleration is showing up in trips, and show AV scaling without a capital or margin shock. The risk was an in-line print on a story already bought, where any margin/AI-cost wobble gets punished harder than the beat is paid.',
      oneLiner:'Pre-call view: audience + insurance-driven elasticity should keep Mobility accelerating and Delivery in the low-20s; the debate is whether profitable-scaling holds as grocery mixes in and the AV/AI investment steps up.',
      debate:{ rows:null, synth:null } },
    results:{ summary:UB_Q1_2026_SUMMARY, thesisCheck:UB_Q1_2026_THESISCHECK, intoCall:UB_Q1_2026_INTOCALL },
    call:{ highlights:UB_Q1_2026_HIGHLIGHTS } },
] };
// Split an intoCall item into [hook, argument] at the first em-dash that is NOT inside markup.
// Void elements are skipped so <br> / <img> do not throw the depth count off.
var CE_VOID=/^<(br|hr|img|input|wbr)\b/i;
function ceTeeSplit(s){
  s=String(s); var d=0, re=/<\/?[a-zA-Z][^>]*>|\s+—\s+/g, m;
  while((m=re.exec(s))){
    if(m[0].charAt(0)==='<'){
      if(CE_VOID.test(m[0]) || /\/>$/.test(m[0])) continue;
      d += (m[0].charAt(1)==='/') ? -1 : 1;
      continue;
    }
    if(d===0) return [s.slice(0, m.index), s.slice(m.index + m[0].length)];
  }
  return [s, ''];
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
    '<span class="ce-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Uber logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Uber Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.uber.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">Uber on EDGAR</span>'+
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
  if(u==='M')  return (+v)+'M';        // a COUNT in millions (MAPCs) — never a dollar sign
  if(u==='%')  return (+v)+'%';        // a rate (take rate)
  if(u==='x')  return (+v)+'x';        // a ratio (trips per MAPC)
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
// Growth of ANY value (Street OR Summit) against the reported base — YoY vs fq-3, QoQ vs fq0. Same
// base for both estimates, so the reader compares like-for-like. (Was Street-only before; there is
// no reason Summit shouldn't carry its own growth against the same actual base.)
function ceGrowthOf(val, m, qi, base){
  if(m.t==='basis'||val==null) return null;
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(b==null||!b) return null;
  return Math.round((val/b-1)*100);
}
// The margin block for a profit line: a "MARGIN" header, then the Street margin (Street colour) and
// the Summit margin (Summit colour) SIDE BY SIDE so it is never ambiguous whose is whose, then ONE
// shared "prev" below (the base-period actual margin — identical for both, swaps YoY/QoQ). Each
// margin is same-vintage (Street = cons/cons-rev, Summit = summit/summit-rev) per §5 rule 7.
function ceMarginBlock(mStreet, mSummit, prevYoy, prevQoq){
  if(mStreet==null && mSummit==null) return '';
  var prev='';
  if(prevYoy!=null) prev+='<span class="ce-mm-b yoy">prev '+prevYoy+'%</span>';
  if(prevQoq!=null) prev+='<span class="ce-mm-b qoq">prev '+prevQoq+'%</span>';
  return '<div class="ce-mrow2"><div class="ce-mrow2-h">MARGIN</div>'+
    '<div class="ce-mrow2-v">'+
      '<span class="ce-mgn ce-mgn-cons">'+(mStreet!=null?mStreet+'%':'—')+'</span>'+
      '<span class="ce-mgn ce-mgn-us">'+(mSummit!=null?mSummit+'%':'—')+'</span>'+
    '</div>'+
    (prev?'<div class="ce-mrow2-prev">'+prev+'</div>':'')+
  '</div>';
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
    var summit=uv
      ? ceFmtV(m.u,uv.v)+'<span class="ce-gy">'+ceChip(ceGrowthOf(uv.v,m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowthOf(uv.v,m,qi,'qoq'))+'</span>'
      : '<span class="ce-empty">—</span>';
    // Margin sits at the END of EACH estimate's OWN row (in that estimate's colour), next to its growth
    // — so POSITION, not just colour, makes it unambiguous whose margin is whose. One "MARGIN" header
    // above, one shared "prev" below (identical for both; swaps YoY/QoQ). Same-vintage per §5 rule 7.
    var mStreet=mgn?ceMarginPct(c,revC):null, mSummit=mgn?ceMarginPct(uv?uv.v:null,revS):null;
    var rmgn=function(v,cls){ return v==null?'':'<span class="ce-rmgn '+cls+'">'+v+'%</span>'; };
    var prevYoy=mgn?ceMarginPct(m.qy[qi],revQy):null, prevQoq=mgn?ceMarginPct(m.qq[qi],revQq):null;
    var mgnHead=(mgn&&(mStreet!=null||mSummit!=null))?'<div class="ce-mgnh">MARGIN</div>':'';
    var prevRow=(mgn&&(prevYoy!=null||prevQoq!=null))?'<div class="ce-mgnp">'+
        (prevYoy!=null?'<span class="ce-mm-b yoy">prev '+prevYoy+'%</span>':'')+
        (prevQoq!=null?'<span class="ce-mm-b qoq">prev '+prevQoq+'%</span>':'')+'</div>':'';
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mcell-v">'+mgnHead+
        '<div class="ce-val ce-val-cons"><span class="ce-val-lab">Street</span>'+street+rmgn(mStreet,'cons')+'</div>'+
        '<div class="ce-val ce-val-us"><span class="ce-val-lab">Summit</span>'+summit+rmgn(mSummit,'us')+'</div>'+
        prevRow+
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
    /* margin block v2 — MARGIN header, Street & Summit margins side-by-side in their colours, shared prev below */
    '.ce-mrow2{display:none;flex-direction:column;gap:1px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--bdr)}'+
    '.ce-evwrap[data-mm="on"] .ce-mrow2{display:flex}'+
    '.ce-mrow2-h{font-size:8px;font-weight:800;letter-spacing:.09em;color:var(--mu)}'+
    '.ce-mrow2-v{display:flex;gap:12px;align-items:baseline}'+
    '.ce-mgn{font-size:11.5px;font-weight:900;font-variant-numeric:tabular-nums}'+
    '.ce-mgn-cons{color:#6B7684}.ce-mgn-us{color:#2563EB}'+
    '.ce-evwrap[data-ev="cons"] .ce-mgn-us{display:none}.ce-evwrap[data-ev="us"] .ce-mgn-cons{display:none}'+
    '.ce-mrow2-prev{font-size:9px;color:var(--mu);font-weight:700;margin-top:1px}'+
    /* per-row margin (v3): at the end of each estimate row, its colour; MARGIN header + shared prev, mm-toggled */
    '.ce-rmgn{display:none;margin-left:auto;font-size:11px;font-weight:900;font-variant-numeric:tabular-nums;padding-left:8px}'+
    '.ce-evwrap[data-mm="on"] .ce-rmgn{display:inline-block}'+
    '.ce-rmgn.cons{color:#6B7684}.ce-rmgn.us{color:#2563EB}'+
    '.ce-mgnh{display:none;text-align:right;font-size:8px;font-weight:800;letter-spacing:.09em;color:var(--mu);margin-bottom:1px}'+
    '.ce-mgnp{display:none;text-align:right;font-size:9px;font-weight:700;color:var(--mu);margin-top:2px}'+
    '.ce-evwrap[data-mm="on"] .ce-mgnh,.ce-evwrap[data-mm="on"] .ce-mgnp{display:block}'+
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
    /* the debate as QUALITATIVE bullets (not a table) — where Summit & the Street diverge, and why */
    '.ce-diverge{margin:2px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}'+
    '.ce-diverge li{position:relative;padding:9px 12px 9px 30px;border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;background:#fff;font-size:11.5px;line-height:1.55;color:var(--navy)}'+
    '.ce-diverge li:before{content:"⇄";position:absolute;left:10px;top:9px;color:'+BLUE+';font-weight:900;font-size:12px}'+
    '.ce-diverge li b{color:var(--navy)}'+
  '</style>';
}
function ceSetupBody(c){
  var h=ceStyle()+ceGridStyle();
  if(!CE_CONS.m||!CE_CONS.m.length) return h+cePendingSnap('Setup grid & chart');
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
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — UBER</div>'+ceGrid(u,'cust');
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Growth chips are computed from the archive: <b>YoY</b> against <code>fq-3</code>, <b>QoQ</b> against <code>fq0</code> — both reported actuals. '+
         '<b>Street</b> = Bloomberg (BST), hardcoded from the export only. <b>Summit</b> = our own expectation. <b>?</b> = a number with a caveat worth knowing. '+
         'A line with no chip either has no like-for-like base or failed the basis test.</div>';
      // ── The debate — a LINE-BY-LINE comparison, not a paragraph ────────────────────────────
      // It answers one question: where does Summit differ from the Street, and by how much. Built
      // from the same two columns the grid shows, so it cannot disagree with them. Lines where we
      // have no number of our own are listed explicitly rather than silently dropped — an empty
      // Summit column IS the state of the work, and hiding it would misrepresent it (§6a-ii).
      // Where Summit and the Street differ is explained QUALITATIVELY (bullets), never as a numeric
      // table — the grid cells above already carry the numbers; here we explain the STORY (e.g. both
      // reach the same print via different paths). See EARNINGS_CONVENTIONS §5 rule 8.
      var d=st.debate;
      if(d&&d.diverge&&d.diverge.length){
        b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>Where Summit and the Street differ — and why</b>'+
           '<span style="color:var(--mu);font-weight:600;font-size:10px"> · same print, different paths — the numbers are in the boxes above; this is the story</span></div>';
        b+='<ul class="ce-diverge">'+d.diverge.map(function(x){ return '<li><b>'+x.t+'</b> — '+x.d+'</li>'; }).join('')+'</ul>';
      }
      if(d&&d.synth) b+='<div class="ce-synth" style="margin-top:16px">'+d.synth+'</div>';
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    }
    // Frozen pre-call prose only for a reported quarter that has NO consensus grid (fallback). For a
    // reported quarter WITH a grid, the standalone "contemporaneous read" block was dropped per Dani.
    if((st.pricedIn||st.oneLiner) && !hasGrid){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
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
    '<div class="ov-sec-h">The Setup picture — reported vs Street vs Summit: pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('UBER_SETUP')+'</div>';
}
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'UBER_SETUP'); }   // Setup chart IS the Results engine (UBER_SETUP dataset)
function wireCeAnnual(root){ /* the engine self-wires via initResults->wireResults; the chart builds on Setup visibility (gBuildCeAnnual). */ }

function ceWatchBody(c){
  // The Watch List is now the SHARED engine (js/watchlist.js): rendering + Supabase persistence
  // (table company_themes) + sorting, one implementation for every company. We render a mount
  // host; wireCallEarnings mounts the engine with the company id + quarter list. The multi-year
  // theme record (the former Evolution > Earnings Calls tab) stays folded in below, as before.
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
    // watch[m.k] is the frozen Watch-List RANK. The Watch List now lives in Supabase (async), so we
    // no longer resolve the rank to its theme text inline — show the frozen rank; the full theme is
    // in the Watch List tab (mirrors the GOOGL migration).
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
  // The SCORECARD (the numeric print vs frozen expectations) needs the Bloomberg snapshots; until
  // CE_CONS is filled it renders a pending note. The QUALITATIVE layer — the AI call summary and the
  // "Also on the call" highlights — comes straight from the transcript analysis and renders now.
  var consReady=!!(CE_CONS.m&&CE_CONS.m.length);
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
    b+= consReady ? cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{}) : cePendingSnap('Scorecard');
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
    // NOTE: ceTeeSplit (below) splits on the first em-dash that sits OUTSIDE any markup. Splitting
    // on the first em-dash full stop cuts a "<b>hook — with a dash</b>" in half and leaks an
    // unclosed <b> into the page; the HTML parser then re-opens it inside every block that follows,
    // and Chart.js — which sizes to the nearest BLOCK ancestor — collapses every chart below to its
    // 150px default. Symptom: bars bunched at the top of an over-tall card, in Results AND Estimates.
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>What this tees up for the call</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· go in hunting these</span></div>';
      b+='<div class="ce-tee">'+r.intoCall.map(function(x,i){
        // Everything up to the first em-dash is the hook; the rest is the argument behind it.
        var sp=ceTeeSplit(x), head=sp[0], body=sp[1];
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
function ceTkFmt(u,v){
  if(v==null) return '';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v).toFixed(1)+'B';
  if(u==='B')  return (+v).toFixed(2)+'B';
  if(u==='M')  return (+v).toFixed(0)+'M';       // count in millions (MAPCs)
  if(u==='%')  return (+v).toFixed(1)+'%';       // rate (take rate)
  if(u==='x')  return (+v).toFixed(2)+'x';       // ratio (trips per MAPC)
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
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once UBER\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
}
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
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
  // persistence + sorting; only the company id, ticker and quarter list are passed in. ──
  var wmount=root.querySelector('.ce-phpane[data-cep="watch"] [data-wlmount]');
  if(wmount && _co && _co.id){
    mountWatchList(wmount, { companyId:_co.id, ticker:_co.ticker, quarters:CALL_EARNINGS.quarters,
      colors:{ brand:BRAND, brand2:BLUE, purple:PURPLE, red:RED } });
  }
}

function html(c){
  _co = c;   // capture the live company object (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-uber" data-brand="UBER">';
  h+=stdOverviewBody(c);
  // Shared modal (used by Overview data-detail triggers AND, once hoisted to
  // #co-detailview in init, by the Deep Dive triggers too). Kept in the Overview
  // pane's markup; init() moves it up so it stays visible on either profile tab.
  h+='<div class="ov-modal-back" id="ubModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ubModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ubModalT"></div><div class="ov-modal-b" id="ubModalB"></div></div></div>';
  h+='</div>';
  return h;
}
// ── Deep Dive: everything deeper. Now a SIBLING profile tab (rendered into the
// Deep Dive copane by companies.js), no longer nested inside the Overview. Holds
// the prior tabs + Deep Overview (the old bespoke Overview) — nothing deleted
// (Golden Rule #1). Its own root class (.ov-uber-dd) scopes it. ──
// ── Deep Dive reorganized into the proposed 5-tab spine: Top Line · Bottom Line ·
// Evolution · Valuation · Management. NOTHING deleted (Golden Rule #1) — every prior
// body is re-slotted into the most relevant tab, and the two live panels from the old
// Pillars tab are absorbed here (Valuation ▸ Analyst Ratings, Management ▸ Ownership &
// Insiders) via #dd-val-slot / #dd-mgmt-slot filled by companies.js. ──
function deepDiveHtml(c){
  _co = c;   // capture the live company object (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-uber ov-uber-dd" data-brand="UBER">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
      '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
    '</div>';
  // ── TOP LINE — the shared segments engine (segments.js), fed by segments-data/uber.js, exactly like
  // AMZN: General · Segments · Other · Customers. UBER's former bespoke Top Line (segment worlds,
  // UberOne, TAM, Industry) is preserved under Miscellaneous ▸ Other Analysis pending fine distribution. ──
  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segov">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segdrv">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segoth">Other</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segcus">Customers</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segov">'+(segmentsOverviewHtml('UBER')||ceResultsPending('Overview'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="segdrv" hidden>'+(segmentsHtml('UBER')||ceResultsPending('Segments'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="segoth" hidden>'+(segmentsOtherHtml('UBER')||ceResultsPending('Other'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="segcus" hidden>'+(segmentsCustomersHtml('UBER')||ceResultsPending('Customers'))+'</div>'+
    '</div>';
  // ── BOTTOM LINE — Unit Economics · Suppliers · Insurance & FCF · Margins (live via Massive). ──
  // ── BOTTOM LINE — AMZN standard: General (profitability up top; the take-rate/per-trip unit economics
  // and the insurance-float/FCF as expense-style deep-dives below) · Segments (per-segment worlds +
  // Capital Allocation) · Supply Chain (suppliers). ──
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="general">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segments">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="supplychain">Supply Chain</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="general">'+ubMarginsBody(c)+
        collapsible('Unit economics — how a trip & an order make money, and the take rate', unitEconBody(c), false)+
        collapsible('The insurance float & free cash flow', insuranceBody(), false)+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments" hidden>'+ubSegmentsBody(c)+
        collapsible('Capital allocation — FCF, buybacks & the share count', ubCapAllocBody(c), false)+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="supplychain" hidden>'+suppliersBody(c)+'</div>'+
    '</div>';
  // ── EVOLUTION — Earnings History (narrative) · Guidance (Model vs. Reality + 3-yr targets) ·
  // Strategy (turnaround + drivers) · Timeline (company history & M&A). ──
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        ceIRButton()+
        '<div class="ce-note" style="margin-bottom:12px">\ud83c\udfaf <b>Earnings</b> \u2014 the decision layer, in two phases: <b>\u2460 Pre-Call</b> (Setup \u00b7 Watch List, themes tracked across quarters) \u2192 <b>\u2461 Post-Results</b> (the print scored against what was frozen, plus the call highlights). Append-only per quarter \u2014 pick a quarter below. The <b>Watch List</b> is the single home for what we track over time; the multi-year <b>theme record</b> (the former \u201cEarnings History\u201d compendium) is folded in beneath it.</div>'+
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
      '<div class="ovt-subpane" data-ovst="results" hidden>'+(resultsHtml('UBER')||ceResultsPending('Results'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+(resultsEvoHtml('UBER')||ceResultsPending('Estimates'))+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+modelBody(c)+ub3yrTargets()+'</div>'+
    '</div>';
  // ── VALUATION — Multiples · Peers (listed-peer multiples) · Analyst Ratings (Massive, absorbed) ·
  // Capital Allocation · Balance Sheet. (Sensitivity grid removed; competitive map moved to Industry.) ──
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="multiples">Multiples</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ratings">Analyst Ratings</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="multiples">'+UBER_VAL.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+ubPeerMultBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="ratings" hidden><div id="dd-val-slot"></div></div>'+
    '</div>';
  // ── MANAGEMENT — Executives & Board · Ownership (Fiscal.ai, absorbed) · Governance & SBC ·
  // Track Record. ──
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance & SBC</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+UBER_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden><div id="dd-mgmt-slot"></div></div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+ubGovBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+ubTrackBody(c)+'</div>'+
    '</div>';
  // ── MISCELLANEOUS — the catch-all for what doesn't belong in a core tab (per Dani): M&A (Delivery
  // Hero), plus Strategy, Timeline and Balance Sheet, relocated out of Evolution/Valuation. UBER is
  // asset-light so there's no Capex & Depreciation deep dive. ──
  h+='<div class="dd-pane" data-dd="misc" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="manda">M&amp;A</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="balance">Balance Sheet</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="other">Other Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="manda">'+deliveryHeroBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+ubStrategyBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+historyStoryBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="balance" hidden>'+ubBalanceBody(c)+'</div>'+
      // Other Analysis — bespoke Top-Line content preserved from before the shared segments engine took
      // over Top Line: TAM, the competitive/industry landscape, Uber One membership, and the segment
      // "worlds". Kept here so nothing is lost; to be distributed into segment adjacencies / Bottom Line.
      '<div class="ovt-subpane" data-ovst="other" hidden>'+
        collapsible('TAM — the addressable market', ubTamBody(c), false)+
        collapsible('Industry & competitive landscape', ubIndustryBody(c), false)+
        collapsible('Uber One — membership economics', ubCustomersBody(c), false)+
      '</div>'+
    '</div>';
  h+='</div>';
  return h;
}

// ═══ Charts ═══════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// Stacked segment GB (Overview + Segments). estIdx → lighter fills.
function stackLabels(totals){ return { id:'sl', afterDatasetsDraw:function(chart){
  var top=chart.getDatasetMeta(2).data, ctx=chart.ctx, tot=totals||chart.$tot||[];
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
    plugins:[ stackLabels(tot) ] });
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
// Build the lazy charts that live inside a sub-pane, by (group, sub-key).
function buildSub(root, group, key){
  if(group==='topline'){   // the shared segments engine (segments.js), same as AMZN
    if(key==='segov') requestAnimationFrame(function(){ initSegmentsOverview(root, 'UBER'); });
    else if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'UBER'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'UBER'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'UBER'); });
  } else if(group==='bottomline'){
    if(key==='general'){   // profitability up top + the Unit-economics & Insurance deep-dives (collapsibles build on expand)
      buildUbProfit(root); buildUbBridge(root); buildUbMargins();
      buildUbUnit(root); buildMobilityCharts(); buildUbFcf(root);
    }
    else if(key==='segments'){   // per-segment worlds (GB/EBITDA composition + dual-axis + active segment) + capital allocation
      buildUbSegDual(root); buildOverviewCharts(); buildActiveSeg(root); buildUbCapAlloc(root);
    }
    // supplychain: no charts
  } else if(group==='evolution'){
    if(key==='guidance')      buildModelTab();          // Model vs. Reality lives under Guidance
    else if(key==='earnings'){
      // Setup chart is the shared Results engine (UBER_SETUP dataset, registered in results.js and
      // populated in results-data/uber.js). Build only when Earnings is visible AND Setup is the active
      // phase (Chart.js needs a laid-out canvas).
      var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
      if(!ph || ph.getAttribute('data-cep')==='setup'){ requestAnimationFrame(gBuildCeAnnual); }
    }
    else if(key==='results') requestAnimationFrame(function(){ initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'UBER'); });
    else if(key==='estevo') requestAnimationFrame(function(){ initResultsEvo('UBER'); });
    // strategy, timeline: no charts
  } else if(group==='misc'){
    if(key==='balance')       buildUbBal();     // equity-stake portfolio bar (moved from Valuation)
    else if(key==='other')    buildUberOneCharts();   // Uber One membership chart (TAM/Industry have no charts)
    // manda (Delivery Hero): SVG/HTML map wired via delegated .dhm-pill handlers in init — no Chart.js
    // strategy, timeline: no charts
  } else if(group==='valuation'){
    if(key==='multiples')     UBER_VAL.init(root);
    // peers (static table), ratings: no charts (Capital Allocation moved to Bottom Line ▸ Segments)
  } else if(group==='mgmt'){
    if(key==='team')          UBER_MGMT.init(root);
    else if(key==='governance') buildUbSbc();   // SBC % vs share-count history
    // ownership, track: no charts
  }
}
// Segments ▸ inner Mobility/Delivery/Freight toggle → build the active segment's chart.
function buildActiveSeg(root){
  var pane=root.querySelector('.dd-pane[data-dd="topline"]'); if(!pane) return;
  var b=pane.querySelector('.seg-pill.active'); var seg=b?b.getAttribute('data-seg'):'mobility';
  if(seg==='delivery') buildDeliveryCharts();  // mobility & freight have no lazy chart now
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
// ── Deep Dive layer (dd-tabs inside the Deep Dive pane) ──
function buildDD(root, key){
  // All top-level tabs now hold sub-panes (except Bottom Line's single static pane);
  // paint the active sub-pane's charts. activeSubKey→null for Bottom Line → no-op.
  var s=activeSubKey(root,key); if(s) buildSub(root,key,s);
}
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }
// ── Standardized peer scatter: place bubbles from the active trailing/forward toggles ──
function positionMG(root){
  var svg=root.querySelector('#ubMgSvg'); if(!svg) return;
  var tp=root.querySelector('.mg-pill[data-mgtype].active'), bp=root.querySelector('.mg-pill[data-mgbasis].active');
  var type=(tp?tp.getAttribute('data-mgtype'):'ev'), basis=(bp?bp.getAttribute('data-mgbasis'):'f');
  var XMAX=(type==='ev'?45:70);
  svg.querySelectorAll('.mg-node').forEach(function(g){
    var multAttr = type==='ev' ? (basis==='f'?'data-evf':'data-evt') : (basis==='f'?'data-pef':'data-pet');
    var raw=g.getAttribute(multAttr), c=g.querySelector('circle'), t=g.querySelector('text');
    if(raw===''||raw==null||isNaN(parseFloat(raw))){ if(c) c.style.display='none'; if(t) t.style.display='none'; return; }
    if(c) c.style.display=''; if(t) t.style.display='';
    var mult=parseFloat(raw), grow=parseFloat(g.getAttribute(basis==='f'?'data-gf':'data-gt')), r=parseFloat(g.getAttribute('data-r'));
    var x=80+Math.min(1,mult/XMAX)*(612-80), y=252-Math.min(1,grow/30)*(252-44);
    if(c){ c.setAttribute('cx',x.toFixed(1)); c.setAttribute('cy',y.toFixed(1)); }
    if(t){ t.setAttribute('x',x.toFixed(1)); t.setAttribute('y',(y-r-5).toFixed(1)); }
  });
  var xl=root.querySelector('#ubMgXlab'); if(xl) xl.textContent=(type==='ev'?'EV/EBITDA':'P/E')+' · '+(basis==='f'?'forward':'trailing');
}
function wireModal(root){
  var back=root.querySelector('#ubModalBack'), mT=root.querySelector('#ubModalT'), mB=root.querySelector('#ubModalB'); if(!back) return;
  var galIdx=-1;
  function onEsc(e){ if(e.key==='Escape'){ closeM(); return; } if(galIdx<0) return; if(e.key==='ArrowLeft'){ e.preventDefault(); renderGal((galIdx-1+TRIP_FLOW.length)%TRIP_FLOW.length); } else if(e.key==='ArrowRight'){ e.preventDefault(); renderGal((galIdx+1)%TRIP_FLOW.length); } }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ galIdx=-1; back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function galBody(i){ var s=TRIP_FLOW[i], n=TRIP_FLOW.length, pv=(i-1+n)%n, nx=(i+1)%n;
    return '<div class="ov-gal"><div class="ov-gal-cap">'+s.d+'</div>'+
      '<div class="ov-gal-nav"><button type="button" class="ov-gal-btn" data-gnav="'+pv+'" aria-label="previous">\u2039</button>'+
      '<span class="ov-gal-count">'+(i+1)+' / '+n+'</span>'+
      '<button type="button" class="ov-gal-btn" data-gnav="'+nx+'" aria-label="next">\u203a</button></div></div>'; }
  function renderGal(i){ galIdx=i; var s=TRIP_FLOW[i]; mT.innerHTML='Step '+(i+1)+' \u2014 '+esc(s.t); mB.innerHTML=galBody(i);
    mB.querySelectorAll('[data-gnav]').forEach(function(b){ b.onclick=function(){ renderGal(+b.getAttribute('data-gnav')); }; }); }
  function openGal(i){ back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); renderGal(i); }
  root.querySelector('#ubModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='ce'){ return CE_POP[id]||null; }
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='trip'){ var s=TRIP_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    if(kind==='aleka'){ var a=ALEKA_CHAIN[+id]; return a?{t:'Aleka — '+a.t,h:a.d}:null; }
    if(kind==='key'){ var k=KEY_DRIVERS.filter(function(x){return x.k===id;})[0]; return k?{t:k.t,h:k.d}:null; }
    if(kind==='note'&&id==='gaap'){ return {t:'How to read Uber’s profitability',h:GAAP_NOTE}; }
    if(kind==='note'&&id==='take'){ return {t:'The Mobility take-rate “drop” — accounting, not economics',h:UK_NOTE+'<br><br>'+TAKE_QUOTES.map(function(q){ return '<div style="margin-top:8px"><b>'+esc(q[0])+'</b><br>'+q[1]+'</div>'; }).join('')}; }
    if(kind==='reg'){ var rg=REGV[+id]; return rg?{t:rg.h,h:rg.d}:null; }
    if(kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m?{t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>',h:m.detail}:null; }
    if(kind==='arena'){ var ar=AR_DETAIL[id]; return ar?{t:ar.t,h:ar.h}:null; }
    if(kind==='ins'){ var ip=INS_POP[id]; return ip?{t:ip.t,h:ip.h}:null; }
    if(kind==='exec'){ var ex=TRACK_MGMT.filter(function(x){return x.id===id;})[0]; return ex?{t:ex.n+' <span class="ov-modal-sub">'+ex.role+' · at Uber since '+esc(ex.since)+'</span>',h:ex.detail}:null; }
    if(kind==='fam'){ var gp=id.split('-'), gg=UB_PROD_GROUPS[+gp[0]]; var f=gg&&gg.families[+gp[1]]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+esc(it[1])+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    if(kind==='dhc'){ return dhCountryDetail(id); }
    if(kind==='dht'){ var dt=DH_TIMELINE_DEAL[+id]; return dt&&dt.d?{t:dt.y,h:dt.d}:null; }
    if(kind==='dhp'){ var dp=DH_PARAMS.filter(function(x){ return x.k===id; })[0]; return dp?{t:dp.t,h:dp.h}:null; }
    if(kind==='dhk'){ return dhKpiDetail(id); }
    if(kind==='dhu'){ return dhUberOneDetail(id); }
    if(kind==='dhr'){ return { t:'Why Uber says this deal makes sense', h:DH_RATIONALE.map(function(d){ return '<div style="margin-bottom:10px"><b>'+esc(d.t)+'</b><br><span style="font-size:12px;color:var(--blue)">'+d.d+'</span></div>'; }).join('') }; }
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
  // Root spans BOTH profile panes (Overview + Deep Dive copanes live under
  // #co-detailview), so this single pass wires the Overview scatter, the Deep
  // Dive tabs/subtabs, and the shared modal exactly as before the split — the
  // element set is identical to the old single .ov-uber root.
  var root=document.getElementById('co-detailview'); if(!root) return;
  renderLive(root); // Deep Dive ▸ Deep Overview keeps its live-price banner (#ubLive lives only there now); the standardized Overview has no price strip.
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireSubtabs(root,'misc');
  wireCallEarnings(root); wireCeTrack(root); wireCeAnnual(root); // ported earnings phase system + Setup/Post-Results lens toggles
  // Segments ▸ inner Mobility/Delivery/Freight toggle (the "sub-tabs de los segmentos").
  root.querySelectorAll('.seg-pill').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.getAttribute('data-seg');
    root.querySelectorAll('.seg-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.seg-body').forEach(function(p){ p.hidden=(p.getAttribute('data-seg')!==seg); });
    requestAnimationFrame(function(){ buildActiveSeg(root); });
  }; });
  root.querySelectorAll('.ave-pill').forEach(function(btn){ btn.onclick=function(){ switchAveMetric(root, btn.getAttribute('data-ave')); }; });
  root.querySelectorAll('.guid-pill').forEach(function(btn){ btn.onclick=function(){ switchGuideMetric(root, btn.getAttribute('data-guidm')); }; });
  // Bottom Line ▸ Adjusted EBITDA & margin — Annual/Quarterly toggle
  root.querySelectorAll('[data-ubpf]').forEach(function(btn){ btn.onclick=function(){
    var box=btn.closest('[data-ubpfblock]'); if(box) box.querySelectorAll('[data-ubpf]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    requestAnimationFrame(function(){ buildUbProfit(root); }); }; });
  // Top Line ▸ Segment economics — Mobility/Delivery/Freight selector
  root.querySelectorAll('[data-ubsg]').forEach(function(btn){ btn.onclick=function(){
    var box=btn.closest('[data-ubsgblock]'); if(box) box.querySelectorAll('[data-ubsg]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    requestAnimationFrame(function(){ buildUbSegDual(root); }); }; });
  // Bottom Line ▸ The bridge — year selector
  root.querySelectorAll('[data-ubbr]').forEach(function(btn){ btn.onclick=function(){
    var box=btn.closest('[data-ubbrblock]'); if(box) box.querySelectorAll('[data-ubbr]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    requestAnimationFrame(function(){ buildUbBridge(root); }); }; });
  // Delivery Hero acquisition markets: "mode" pills swap Map/List, "view" pills swap between
  // Uber Today / Delivery Hero Today / Uber After the Deal — swapping each map path/dot's fill
  // in place and toggling the matching legend + list block (three of each, one per view).
  root.querySelectorAll('.dhm-pill').forEach(function(btn){ btn.onclick=function(){
    var wrap=btn.closest('.dhm-wrap'); if(!wrap) return;
    var group=btn.closest('.dhm-pills');
    if(group) group.querySelectorAll('.dhm-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(btn.hasAttribute('data-dhview')){
      var view=btn.getAttribute('data-dhview');
      var svg=wrap.querySelector('.dhm-svg'); if(svg){ svg.setAttribute('data-view', view); svg.querySelectorAll('[data-fill-'+view+']').forEach(function(el){ el.setAttribute('fill', el.getAttribute('data-fill-'+view)); }); }
      ['uber','dh','post'].forEach(function(v){
        var leg=wrap.querySelector('#dhLegend-'+v); if(leg) leg.hidden=(v!==view);
        var list=wrap.querySelector('#dhList-'+v); if(list) list.hidden=(v!==view);
      });
    } else if(btn.hasAttribute('data-dhmode')){
      var mode=btn.getAttribute('data-dhmode');
      var mapBlock=wrap.querySelector('#dhMapBlock'), listWrap=wrap.querySelector('#dhListWrap');
      if(mapBlock) mapBlock.hidden=(mode!=='map'); if(listWrap) listWrap.hidden=(mode!=='list');
    }
  }; });
  wireModal(root);
  // Collapsible sections (reader chooses what to expand)
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var c=btn.parentElement; var open=c.classList.toggle('open'); var b=c.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸';
    // charts nested inside a collapsible have no offsetParent until it opens → rebuild the active subpane on expand
    if(open){ var dd=activeDD(root), sk=activeSubKey(root,dd); if(sk) requestAnimationFrame(function(){ buildSub(root,dd,sk); }); } }; });
  // Competitive-map scatter: hover/tap a dot → floating detail tip
  var ptip=root.querySelector('#ubPeerTip');
  if(ptip){ root.querySelectorAll('.peer-dot').forEach(function(d){
    function show(){ ptip.innerHTML='<span class="pt-n">'+d.getAttribute('data-name')+'</span>'+d.getAttribute('data-why'); ptip.hidden=false; }
    function move(e){ ptip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; ptip.style.top=(e.clientY+16)+'px'; }
    d.addEventListener('mouseenter', show);
    d.addEventListener('mousemove', move);
    d.addEventListener('mouseleave', function(){ ptip.hidden=true; });
    d.addEventListener('click', function(e){ show(); move(e); });
  }); }
  // Earnings calls accordion (covers both the theme and quarter lenses)
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  // Earnings narrative lens toggle (theme \u2194 quarter)
  root.querySelectorAll('.calls-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-callsv');
    root.querySelectorAll('.calls-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var t=root.querySelector('#ubCallsTheme'), q=root.querySelector('#ubCallsQuarter');
    if(t) t.style.display=(v==='theme')?'':'none';
    if(q) q.style.display=(v==='quarter')?'':'none';
  }; });
  // ── Standardized Overview wiring: dynamic peer scatter, money toggle, segment accordions, live mcap ──
  ubScReset(); ubScRender(root); ubScChips(root);
  var sctip=root.querySelector('#ubScTip');
  function wireScNodes(){ if(!sctip) return; root.querySelectorAll('#ubScNodes .mg-node').forEach(function(g){
    function show(){ sctip.innerHTML='<span class="mgt-n">'+g.getAttribute('data-name')+'</span>'+g.getAttribute('data-why'); sctip.hidden=false; }
    function move(e){ sctip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; sctip.style.top=(e.clientY+16)+'px'; }
    g.addEventListener('mouseenter', show); g.addEventListener('mousemove', move);
    g.addEventListener('mouseleave', function(){ sctip.hidden=true; });
    g.addEventListener('click', function(e){ show(); move(e); });
  }); }
  function scRefresh(){ ubScRender(root); wireScNodes(); }
  wireScNodes();
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    if(btn.hasAttribute('data-mgtype')){ UB_SC.type=btn.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    else { UB_SC.basis=btn.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    scRefresh();
  }; });
  // peer chips: toggle inclusion / add a peer by ticker
  function wireChips(){
    // Clicking the × on a chip DELETES that peer immediately (no toggle/strikethrough).
    root.querySelectorAll('#ubScChips .ubsc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(UB_SC.peers[i]){ UB_SC.peers.splice(i,1); ubScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#ubScAddBtn'), addIn=root.querySelector('#ubScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!UB_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=UB_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; UB_SC.peers.push(o); } // restore a known peer's multiples
        else UB_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, evT:null,evF:null,peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
      }
      addIn.value=''; ubScChips(root); wireChips(); scRefresh(); ubLiveOne(tk); }; }
  }
  wireChips();
  // How-it-makes-money toggle (revenue ⇄ gross bookings)
  root.querySelectorAll('.mm-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-mm');
    root.querySelectorAll('.mm-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var rv=root.querySelector('#ubMMrev'), gb=root.querySelector('#ubMMgb');
    if(rv) rv.hidden=(v!=='rev'); if(gb) gb.hidden=(v!=='gb');
  }; });
  // Segment "What is X?" + economics accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Live market cap (Key Facts cell + peer bubbles) — Massive via api.liveQuote; degrades gracefully in preview
  function ubLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(q){ if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; UB_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='UBER'){ var el=root.querySelector('#ubMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } scRefresh(); }).catch(function(){}); }
  UB_SC.peers.forEach(function(p){ if(p.tk) ubLiveOne(p.tk); });
  ubScRender(root); // first paint of the standardized Overview scatter (no ovt-tab gate anymore)
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  // (an inactive .copane is display:none, which would hide a modal nested inside it).
  var detail=document.getElementById('co-detailview');
  if(detail){
    // drop a stale modal left by a previously-opened company
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='ubModalBack') m.remove(); });
    var md=root.querySelector('#ubModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
// Deep Dive charts build lazily: the Overview init() already wired the dd-tabs
// (root spans both panes), so here we only paint the charts of the active dd-pane
// now that the Deep Dive copane is visible (Chart.js needs a laid-out canvas).
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}
export var uberOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
