// overviews/uber.js — custom Overview for Uber Technologies, Inc. (NYSE: UBER)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model (snapshot 2026-05-07):
//   actuals_history = reported · projection_history = model estimate.
// Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 / Q1 2026 results &
// prepared remarks, the Feb 2024 "Go-Get" Investor Day (see SOURCES). No live API.

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
    d:'<b>The connective tissue of the whole platform.</b> 50M+ members (Q1 2026, +50% YoY); members now drive <b>>50% of combined Mobility+Delivery bookings</b> and ~⅔ of Delivery.<br><br>Members spend ~3× non-members and retain ~35% better. They run negative-margin for ~6 months (benefits cost) then turn profitable — so penetration (~25% of users) is the lever. See Unit Economics for the full member-vs-non-member math.' },
  { k:'barbell', t:'The Barbell', teaser:'Win the cheap end AND the premium end — skip the middle.',
    d:'<b>Uber grows at both ends of the price ladder at once.</b><br><br><b>Affordable end</b> (UberX Share, two- & three-wheelers, auto-rickshaws, Uber Moto) drives ~<b>75% higher trip frequency</b> — more users, more often, especially in emerging markets.<br><br><b>Premium end</b> (Uber Black, Reserve, Comfort) drives ~<b>3.5× the profit growth</b>.<br><br>Serving both ends — not the squeezed middle — is why adding cheaper emerging-market trips is <i>net-positive</i>: price-per-trip falls, but volume, engagement and high-end profit more than offset it.' },
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
// Secular / market tailwinds — the forces outside Uber's own levers (which live in "What drives Uber" + Strategy).
var TAILWINDS=[
  '<b>Mobility-as-a-service is early:</b> ride-hail is still a low-single-digit share of the trillions spent on personal transport — a long runway as car ownership gives way to on-demand.',
  '<b>Delivery & grocery under-penetrated:</b> online food/grocery is still a minority of the category in most markets; Uber Eats compounds as habits shift.',
  '<b>Engagement deepening:</b> trips are growing faster than users (+20% vs +17%) — people transact <i>more often</i>, not just in greater numbers.',
  '<b>Insurance costs moderating:</b> the largest US Mobility cost is easing; Uber is passing savings into lower fares, which is re-accelerating trip growth (see Unit Economics ▸ Insurance).',
];
// Note: "GAAP earnings volatility" and "equity-investment swings" are deliberately NOT headwinds — they are accounting
// features of holding large stakes (Aurora, Grab, Didi). See the FY note on Uber's shift off Adj. EBITDA.
var HEADWINDS=[
  '<b>AV disintermediation risk:</b> Waymo (and a Tesla wildcard) can bypass Uber with their own apps and structurally lower driverless costs — the genuine long-term threat to the aggregator model.',
  '<b>Delivery competition:</b> DoorDash out-scales Uber Eats in the US (~60%+ vs ~22–25% share); Mobility competition keeps incentives elevated.',
  '<b>Global regulatory exposure:</b> as the only truly global player, Uber carries the widest surface area — UK structural changes (worker status since <i>Aslam</i>, the 2026 VAT/agency-model shift), the EU Platform Work Directive (transpose by Dec 2026), and per-market pay floors. More exposed than US-only peers.',
  '<b>Insurance severity:</b> still the largest US Mobility cost; reserves ~$12.9B and rising with volume — though now moderating (see Insurance).',
];
// ── Strategy ──
var TARGETS=[
  { v:'Mid–high teens', l:'Gross Bookings CAGR', s:'3-yr target (Feb 2024 Investor Day). FY25 actual: +19%.' },
  { v:'High-30s–40%',   l:'Adj. EBITDA CAGR',    s:'">2× the rate of topline." FY25 actual: +35%.' },
  { v:'>90%',           l:'FCF conversion',      s:'Of Adj. EBITDA. FY25 actual: ~112%.' },
];
// Clickable initiative cards: short teaser on the card, full story in a modal (key = `init:<k>`).
// NOTE: the flywheel / Uber One / advertising are now the front-door "drivers" on the Overview tab.
// Strategy holds the forward-looking BETS — where management is taking the business next.
var INITIATIVES=[
  { k:'capital', t:'Capital returns', teaser:'$20B buyback; ~2% annual share-count reduction.',
    d:'<b>From cash-burner to capital-returner.</b> First-ever buyback (2024, $7B) scaled to a <b>$20B authorization</b>; a record ~$3B repurchased in Q1 2026; ~2% annual share-count reduction.<br><br>Funded by record ~$9.8B TTM free cash flow at ~100%+ conversion of Adj. EBITDA — the asset-light model in action.' },
  { k:'u4b', t:'Uber for Business', teaser:'B2B >$5B of bookings, growing >2× Mobility.',
    d:'<b>A high-margin cross-sell vector.</b> Uber for Business (corporate rides, meals, travel) is now >$5B of bookings and growing more than 2× faster than Mobility.<br><br>B2B demand is stickier and higher-value, and ties directly into the new travel push (hotels, Travel Mode).' },
  { k:'travel', t:'Travel expansion', teaser:'"Hotels on Uber" (Expedia) + Vrbo — owning more of the trip.',
    d:'<b>Extending the platform up the traveler value chain.</b> "Hotels on Uber" launched Apr 2026 (Expedia, 700k+ properties) alongside Vrbo and a dedicated <b>Travel Mode</b>.<br><br>Explicitly <i>not</i> meant to become a core business — it signals intent to own more stages of the trip (book the ride, the meal, now the stay) and feed Uber One engagement and frequency.' },
];
// (AV bull/bear lists removed — reworked into an evidence-based framing in strategyBody.)
// ── Unit economics / regulation ──
var FLY=[
  'Uber discloses MAPCs (monthly active platform consumers) and Trips, not segment trip counts — so per-trip economics are read at the platform level.',
  '<b>Frequency is rising:</b> Trips growth (+20%) consistently outpaces MAPC growth (+17%) — users transacting more often, the flywheel working.',
  '<b>Uber One</b> members are ~2× as likely to use both Mobility and Delivery (2-in-5 vs 1-in-5 platform-wide) and spend ~3× more.',
  'Gross Bookings per MAPC has risen from ~$881/yr (2022) to ~$958/yr (2025) on mix and frequency, not just price.',
];
var UK_NOTE='In January 2026, after a UK tax ruling, Uber moved its UK rideshare (outside London) from a <b>principal (merchant)</b> to an <b>agent</b> model. Driver payments reclassified from cost of revenue to contra-revenue — cutting reported revenue ~$1.0B and Mobility\'s revenue margin by ~<b>400 bps</b> in Q1 2026, with an equal-and-opposite drop in cost of revenue. <b>Zero impact on Adjusted EBITDA or underlying economics.</b> So the reported Q1 2026 Mobility take rate (~25.8%) understates the real ~30% — a pure gross-to-net accounting artifact, not deteriorating economics.';
var REG=[
  ['US — classification de-risked', '<b>Prop 22</b> upheld by the California Supreme Court (July 2024); the federal DOL\'s 2024 contractor rule is unenforced and <b>proposed for rescission</b> (Feb 2026). The dominant model is "contractor + pay floor" (Massachusetts, Minnesota, NYC, Seattle), not reclassification.'],
  ['International — mixed, trending favorable', '<b>UK</b>: drivers are "workers" since <i>Aslam</i> (2021), and Uber lost a VAT fight (2025). <b>Netherlands</b> (Jan 2026) and <b>France</b> (2025) delivered pro-contractor reversals. The <b>EU Platform Work Directive</b> (transpose by Dec 2026) is the key open risk — its bite depends on national law.'],
  ['How Uber frames it', 'The 10-K says reclassification "would require us to fundamentally change our business model" — but, unlike some peers, it <b>does not say the loss "cannot be estimated."</b> It affirmatively states the aggregate reasonably-possible loss would <b>not be material</b>.'],
  ['Other', 'NYC congestion pricing ($1.50/trip, Jan 2025); a Dutch GDPR fine (€290M, under appeal); an open FTC case on Uber One cancellation flows (filed 2025). Mostly cost/PR drags, not existential.'],
];
var SOURCES='Quantitative series: Summit DCF model, snapshot 2026-05-07 (actuals_history = reported; projection_history = model estimate). Segment Adjusted EBITDA actuals end Q4 2025 — Uber moved its primary segment-profit measure to Segment Operating Income in Q1 2026. Take rates are derived (revenue ÷ segment gross bookings) and the Q1 2026 Mobility figure is depressed ~400 bps by a UK gross-to-net accounting change. Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 & Q1 2026 results and prepared remarks, the Feb 2024 Investor Day, and the Cal. Supreme Court Prop 22 ruling (Jul 2024). Forward years (2026E–2029E) are model estimates, not company guidance. Brand colors approximate Uber black and Uber Eats green.';

// ─── How Uber makes money: interactive per-trip chain (Mobility) ──────────────
// VISA-style: each step is clickable (key = `trip:<i>`) → modal with the economics/timing detail.
var TRIP_FLOW=[
  { t:'Rider requests & sees an upfront price', d:'Uber sets and shows an <b>upfront, all-in price</b> before the rider confirms — fare + service fee + booking fee + taxes/tolls. Uber controls pricing (surge, product mix), which is how it manages the take rate trip-by-trip.' },
  { t:'Trip happens; rider pays the full fare', d:'Payment is almost always <b>card / digital wallet</b> in developed markets (some emerging markets are cash). Uber collects the <b>entire Gross Booking</b> — it is the merchant of record in most geographies (the UK ex-London moved to an <i>agency</i> model in 2026, see take-rate note).' },
  { t:'Uber keeps its take (~30%)', d:'Uber retains ~<b>30%</b> of Mobility bookings as <b>revenue</b> (~19% in Delivery). This is the marketplace fee that funds the platform, support, R&D and profit. The rest is owed to the driver and the per-trip insurer.' },
  { t:'Driver is paid their earnings', d:'The driver keeps fare-based earnings + tips + incentives. <b>Timing:</b> the default is a <b>weekly</b> automatic payout, but most drivers use <b>Instant Pay / the Uber Pro Card</b> to cash out <b>within minutes, multiple times a day</b>. Because Uber collects up-front (card) and can pay drivers on a delay it chooses, the float is modestly working-capital-favorable.' },
  { t:'Per-trip insurance is funded → Aleka', d:'Ride-hail rules require <b>commercial insurance on every trip</b>, funded from the fare and routed to <b>Aleka</b> — Uber\'s wholly-owned captive insurer. Aleka books the premium as a <b>provision</b>, invests the float, and pays claims later (see Insurance).' },
  { t:'What converts to cash for Uber', d:'From its take, Uber covers platform/R&D/admin costs → Adjusted EBITDA; after other expenses and adding the <b>insurance float spread</b>, roughly <b>$0.75 of every $10 trip</b> converts to cash. Asset-light = ~100%+ of Adj. EBITDA becomes free cash flow.' },
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

// ─── Uber One: member vs non-member economics ─────────────────────────────────
var UBERONE_STAT=[
  { l:'Members', v:'50M+', s:'Q1 2026, +50% YoY (~30M end-2024)' },
  { l:'% of combined GB', v:'>50%', s:'members now drive a majority of Mobility+Delivery bookings' },
  { l:'Member spend', v:'~3×', s:'vs non-members (~$192 vs ~$64/mo, Summit deck Dec 2024)' },
  { l:'MAPC penetration', v:'~25%', s:'~1 in 4 monthly users — the conversion runway' },
];
var UBERONE_NOTE=[
  '<b>The spending gap is the whole thesis.</b> A member spends ~<b>3×</b> a non-member; in Delivery, members already generate ~<b>two-thirds</b> of bookings. The 2023 expansion ($0 delivery fees, up to 30% off service fees, 5% off rides + priority) primarily pulled forward <b>delivery demand</b> — Delivery began compounding faster than before.',
  '<b>Conversion is the lever, and it\'s early.</b> Members are only ~25% of MAPCs and only ~20% of eligible users use <i>both</i> Mobility and Delivery — so most of the cross-sell runway is unconverted. New members run <b>negative-margin for ~6 months</b> (benefits cost) then turn profitable; Uber is steering members from monthly to annual plans to lift retention.',
  '<b>Why it compounds:</b> members retain ~35% better and habituate into multi-product use — turning a marketing cost into a structurally higher-frequency, higher-LTV cohort and a moat competitors can\'t cheaply replicate.',
];

// ─── Emerging-markets / FX: does adding users dilute GB per user? ──────────────
var EMERGING='<b>Determined — the mechanism is real but currently out-run by frequency.</b> Management confirms trips outside the US/Canada are at a <b>lower price point</b> (two- and three-wheelers, auto-rickshaws, UberX Share in India/LatAm), so each new emerging-market user adds <i>less</i> Gross Bookings than a developed-market user — and a weaker local currency dilutes the blended USD average further. <b>But</b> blended Gross Bookings per MAPC is still <i>rising</i> (~$252→$270/qtr, +7% YoY in Q1 2026): low-cost products drive ~<b>75% higher trip frequency</b> while premium products drive ~<b>3.5× the profit growth</b> (the "barbell"), and FX has recently flipped to a <b>tailwind</b> (+4pts in Q1 2026). So affordability dilutes price-per-trip but lifts volume and engagement — net positive, not net dilutive, in the current window.';

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
  { y:'2021–22', t:'<b>Insurance float buffers a cash-burning business.</b> Reserves and investment income provided an important share of operating cash flow while the core business was barely breakeven (Mobility CFO margin ~1.2% in 2022).' },
  { y:'2022–24', t:'<b>Insurance inflation forces fare hikes.</b> US claim severity spiked; higher fares (esp. California) suppressed trip growth. Insurance became the single largest US Mobility cost.' },
  { y:'2025–26', t:'<b>Costs moderate; savings passed to riders.</b> Insurance cost growth eased; Uber began passing savings through, citing "meaningfully" improving trip growth in San Francisco and Los Angeles. The core business now generates the cash; insurance is a supplement, not the crutch.' },
];

// ─── Mobility take-rate: management's own words ────────────────────────────────
var TAKE_QUOTES=[
  ['CFO Prashanth Krishnamurthy, Q1 2026', '"The impact on our Mobility revenue margin was roughly <b>400 bps</b> in Q1… primarily a movement of driver payment costs from cost of revenue to contra-revenue, and has <b>no impact on underlying economics</b>. We expect this accounting headwind to persist at roughly the same magnitude for the remainder of 2026."'],
  ['Q4 2025 prepared remarks', '"Beginning in January 2026, following a UK tax-law ruling, we transitioned from a <b>merchant model to an agency model outside of London</b>… driver payments will be reclassified from cost of revenue to contra-revenue… approximately <b>350 bps lower</b>, driven solely by this accounting reclassification… <b>no impact on profitability</b>."'],
];

// ─── M&A — terms & what each deal added (clickable cards, key = `mna:<n>`) ─────
var MNA=[
  { n:'Careem', y:'2020', deal:'$3.1B', terms:'cash + convert. notes', own:'Integrated', cat:'Mobility',
    detail:'<b>Terms:</b> $3.1B ($1.4B cash + $1.7B convertible notes); closed Jan 2020.<br><br><b>What it added:</b> Middle-East mobility/delivery/payments super-app (UAE, Saudi, Egypt, Pakistan…).<br><br><b>Status:</b> operated as a unit; the Careem super-app was later partly spun out (e& invested $400M, 2023).' },
  { n:'Postmates', y:'2020', deal:'$2.65B', terms:'all stock', own:'Integrated', cat:'Delivery', big:true,
    detail:'<b>Terms:</b> ~$2.65B all-stock ($31.45/share); closed Dec 2020.<br><br><b>What it added:</b> US food-delivery scale, merged into Uber Eats — a key step to challenging DoorDash.<br><br><b>Status:</b> fully integrated.' },
  { n:'Cornershop', y:'2021', deal:'~$1.4B', terms:'mostly stock', own:'Integrated', cat:'Grocery',
    detail:'<b>Terms:</b> ~$450M for the initial ~53% (2019), then 29M Uber shares (~$1.4B) for the rest (2021).<br><br><b>What it added:</b> LatAm/Canada grocery delivery, folded into Uber Eats — the grocery on-ramp.<br><br><b>Status:</b> integrated.' },
  { n:'Drizly', y:'2021', deal:'$1.1B', terms:'mostly stock', own:'Shut down', cat:'Alcohol', miss:true,
    detail:'<b>Terms:</b> ~$1.1B (mostly stock); closed Oct 2021.<br><br><b>What it was for:</b> on-demand alcohol delivery.<br><br><b>Outcome:</b> <b>shut down in early 2024</b> — service ended ~March 2024 and alcohol was folded directly into Uber Eats. A clear write-off and a rare M&A miss.' },
  { n:'Transplace', y:'2021', deal:'$2.25B', terms:'cash + stock', own:'Integrated', cat:'Freight',
    detail:'<b>Terms:</b> ~$2.25B (up to $750M stock + cash; $550M external co-investment); closed Nov 2021, bought from TPG.<br><br><b>What it added:</b> managed-transportation / logistics network for Uber Freight.<br><br><b>Status:</b> integrated into Uber Freight — the segment that has since struggled in the freight recession.' },
  { n:'Trendyol Go', y:'2025', deal:'$700M', terms:'85% stake, cash', own:'Controlling', cat:'Delivery',
    detail:'<b>Terms:</b> $700M for an 85% controlling stake (announced May 2025).<br><br><b>What it added:</b> Turkey\'s leading food/grocery courier (~$2B bookings, 200M+ orders/yr) — brings Uber Eats to Turkey.<br><br><b>Status:</b> closing/operating as an independent app with Uber Eats features layered in.' },
  { n:'Foodpanda Taiwan', y:'2024', deal:'$950M', terms:'cash — BLOCKED', own:'Terminated', cat:'Delivery', miss:true,
    detail:'<b>Terms:</b> ~$950M cash for Delivery Hero\'s Foodpanda Taiwan (May 2024).<br><br><b>Outcome:</b> <b>blocked by Taiwan\'s FTC (Dec 2024)</b> — it would have given Uber >90% local delivery share. Deal terminated March 2025; Uber paid a ~<b>$250M break fee</b> (and separately bought $300M of new Delivery Hero shares).' },
];
var MNA_NOTE='Uber\'s biggest "deals" are also its <b>divestitures</b>: it exited China → <b>Didi</b> (2016), SE Asia → <b>Grab</b> (2018) and Russia → <b>Yandex</b> (2021) for equity stakes, and sold its self-driving unit <b>ATG → Aurora</b> (2020, ~26% stake). Those equity stakes are exactly what makes GAAP net income swing — and why Uber now guides on Non-GAAP EPS. Recent AV "deals" are capital commitments, not acquisitions (Nuro ~$500M, Lucid, Rivian up to $1.25B).';

// ─── Summit thesis ────────────────────────────────────────────────────────────
var THESIS='<b>Uber One</b> drives higher spend and retention, compounding Gross Bookings while scale and incentive discipline expand margins. Core Mobility + Delivery now throw off <b>powerful, predictable cash flow</b> (plus the Aleka float) — which, at a reasonable valuation, underpins our conviction in durable growth and attractive returns.';

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
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div>'+body+'</div>';
}).join('')+'</div>'; }
// Horizontal proportion bars (reuses shared .ov-mbars). rows = [label, pct, valueLabel, color].
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
// M&A cards (reuses shared .ov-cards-mna).
function mnaCards(arr){ return '<div class="ov-cards ov-cards-mna">'+arr.map(function(m){
  return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
    '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span><span class="ov-chip'+(m.miss?' ov-chip-neg':'')+'">'+esc(m.cat)+'</span></div>'+
    '<div class="ov-card-kpis"><span>'+esc(m.y)+'</span><span>'+esc(m.deal)+'</span><span>'+esc(m.terms)+'</span><span>'+esc(m.own)+'</span></div>'+
    '<div class="ov-more">What it added ›</div></div>';
}).join('')+'</div>'; }
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
    players:[['FEMSA','femsa.com'],['Rakuten','rakuten.com'],['Cencosud','cencosud.com'],['Loblaw','loblaw.ca'],['Instacart','instacart.com'],['Delta','delta.com']],
    impact:{ kind:'mixed', text:'Broadens reach into emerging markets (cheaper baskets, lower take in $). The <b>Instacart (Maplebear)</b> tie-up adds suburban demand with ~20% larger baskets.' } },
];
var SC_SUP_GEO = [
  { c:'United States', fpct:49.4, fac:1280 },
  { c:'China', fpct:6.9, fac:179 },
  { c:'Germany', fpct:6.2, fac:160 },
  { c:'Canada', fpct:3.6, fac:92 },
  { c:'United Kingdom', fpct:3.4, fac:87 },
  { c:'Mexico', fpct:3.3, fac:85 },
  { c:'Japan', fpct:3.2, fac:83 },
  { c:'France', fpct:3.1, fac:81 },
  { c:'India', fpct:2.2, fac:56 },
  { c:'Brazil', fpct:2.2, fac:56 },
];
var SC_CUS_GEO = [
  { c:'United States', fpct:77.3, fac:2004 },
  { c:'Canada', fpct:8.9, fac:231 },
  { c:'Mexico', fpct:2.7, fac:71 },
  { c:'United Kingdom', fpct:2.0, fac:51 },
  { c:'France', fpct:1.7, fac:43 },
  { c:'Australia', fpct:1.6, fac:41 },
  { c:'Japan', fpct:1.3, fac:34 },
  { c:'Spain', fpct:0.9, fac:22 },
  { c:'South Korea', fpct:0.7, fac:19 },
];

// Grayscale logo chip (clearbit -> favicon fallback); hover shows the name + colorizes.
function scLogo(name,domain){
  return '<div class="usc-logo" title="'+esc(name)+'"><img src="https://logo.clearbit.com/'+domain+'" alt="'+esc(name)+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+domain+'&sz=64\'"></div>';
}
function scCard(g){
  var imp=g.impact?'<div class="usc-imp usc-imp-'+g.impact.kind+'"><b>'+(g.impact.kind==='mixed'?'For Uber ⚠':'For Uber ✓')+'</b> '+g.impact.text+'</div>':'';
  var role=g.role?'<div class="usc-role"><b>What they do —</b> '+esc(g.role)+'</div>':'';
  return '<div class="usc-card'+(g.big?' usc-card-wide':'')+'">'+
    '<div class="usc-card-h">'+esc(g.h)+(g.tag?'<span class="usc-tag">'+esc(g.tag)+'</span>':'')+'</div>'+
    role+
    '<div class="usc-logos">'+g.players.map(function(p){ return scLogo(p[0],p[1]); }).join('')+'</div>'+
    imp+
  '</div>';
}
function supplyBody(){
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
    '.usc-logo img{max-width:100%;max-height:100%;object-fit:contain;filter:grayscale(1);opacity:.72;transition:filter .15s,opacity .15s}'+
    '.usc-logo:hover img{filter:grayscale(0);opacity:1}'+
    '.usc-imp{font-size:11.5px;line-height:1.5;margin-top:11px;padding:8px 11px;border-radius:8px}.usc-imp b{font-weight:700}'+
    '.usc-imp-good{background:rgba(6,193,103,0.08);border:1px solid rgba(6,193,103,0.28);color:var(--navy)}'+
    '.usc-imp-good b{color:#06965A}'+
    '.usc-imp-mixed{background:rgba(232,160,12,0.09);border:1px solid rgba(232,160,12,0.32);color:var(--navy)}'+
    '.usc-imp-mixed b{color:#B7791F}'+
    '.usc-geo-row{display:flex;align-items:center;gap:8px;margin:3px 0;font-size:12.5px}'+
    '.usc-geo-lbl{min-width:104px;color:var(--navy)}.usc-geo-bar{height:15px;border-radius:4px}'+
    '.usc-geo-pct{color:var(--mu);font-size:12px;min-width:38px;text-align:right}'+
    '.ueco{display:flex;align-items:stretch;margin:4px 0 10px}'+
    '.ueco-box{flex:1;border:1px solid var(--bdr);border-radius:10px;background:var(--w);padding:14px;text-align:center;min-width:0}'+
    '.ueco-box.is-hub{border:2px solid var(--brand);background:var(--surface)}'+
    '.ueco-k{font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);margin-bottom:6px}'+
    '.ueco-t{font-size:14px;font-weight:800;color:var(--navy);margin-bottom:5px}'+
    '.ueco-d{font-size:11px;color:var(--mu);line-height:1.45}'+
    '.ueco-arr{flex:none;align-self:center;display:flex;flex-direction:column;align-items:center;padding:0 10px;color:var(--brand)}'+
    '.ueco-arr i{font-style:normal;font-size:22px;line-height:1}.ueco-arr small{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '@media(max-width:720px){.ueco{flex-direction:column}.ueco-arr{padding:6px 0}.ueco-arr i{transform:rotate(90deg)}}'+
    '@media(max-width:860px){.usc-grid{grid-template-columns:1fr}}'+
  '</style>';
  h+='<p class="ov-lede">Uber’s supply chain is really a story about <b>who Uber depends on, and who could depend on Uber back</b>. The data is from Bloomberg SPLC (29-Jun-2026). Start with how the pieces fit, then each group’s role and what it means for Uber.</p>';
  // ── Ecosystem map: the interaction at a glance ──
  h+=sec('How the Ecosystem Fits Together',
    '<div class="ueco">'+
      '<div class="ueco-box"><div class="ueco-k">Suppliers · inputs</div><div class="ueco-t">Who powers Uber</div><div class="ueco-d">cars &amp; AV · money rails · cloud · ad-tech · depots</div></div>'+
      '<div class="ueco-arr"><i>→</i><small>inputs</small></div>'+
      '<div class="ueco-box is-hub"><div class="ueco-k">The platform</div><div class="ueco-t">Uber owns the demand</div><div class="ueco-d">sets the price · runs the marketplace · keeps ~20–30%</div></div>'+
      '<div class="ueco-arr"><i>→</i><small>demand</small></div>'+
      '<div class="ueco-box"><div class="ueco-k">Demand · output</div><div class="ueco-t">Riders &amp; merchants</div><div class="ueco-d">170M+ consumers · millions of restaurants, grocers &amp; fleets</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap"><b>The whole point:</b> Uber sits in the middle and owns the <b>demand</b> — that is the leverage. Suppliers compete to provide inputs (good for Uber: cheap, replaceable, low pricing power). The <b>only</b> group that can also reach the demand directly — and therefore <b>threaten</b> Uber — is AV (Waymo on its own app). That is exactly why Uber aggregates 30+ AV partners instead of betting on one, and why this tab and <b>Strategy &amp; AV</b> tell the same story from two angles.</div>');
  // ── Suppliers: role + impact ──
  h+=sec('Who Powers Uber — each supplier group & what it means',
    '<div class="usc-grid">'+SC_SUPPLIERS.map(scCard).join('')+'</div>');
  // ── Customers (merchants) ──
  h+=sec('Who Uber Serves — the merchant network',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">These are Eats’ supply. No single merchant is material, so the <b>breadth</b> is the moat — and the take/ads sit with Uber.</div>'+
    '<div class="usc-grid">'+SC_CUSTOMERS.map(scCard).join('')+'</div>');
  // ── Geographic footprint, tied to a thesis ──
  h+=sec('Geographic Footprint — and what it tells us',
    '<div class="ov-grid2">'+
      '<div><div class="ov-subh">Supplier facilities (2,593)</div>'+
        SC_SUP_GEO.map(function(g){ var w=Math.max(g.fpct*1.6,3); return '<div class="usc-geo-row"><span class="usc-geo-lbl">'+esc(g.c)+'</span><div class="usc-geo-bar" style="width:'+w+'%;background:'+BRAND+'"></div><span class="usc-geo-pct">'+g.fpct+'%</span></div>'; }).join('')+
      '</div>'+
      '<div><div class="ov-subh">Merchant facilities (2,591)</div>'+
        SC_CUS_GEO.map(function(g){ var w=Math.max(g.fpct*1.15,3); return '<div class="usc-geo-row"><span class="usc-geo-lbl">'+esc(g.c)+'</span><div class="usc-geo-bar" style="width:'+w+'%;background:'+BRAND2+'"></div><span class="usc-geo-pct">'+g.fpct+'%</span></div>'; }).join('')+
      '</div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>The story:</b> suppliers are globally diversified (49% US) — the worldwide AV race (China, Germany, Japan, Israel). Merchants look US-heavy (77%), yet ~<b>60% of mobility bookings are international</b>. That gap <i>is</i> the emerging-markets dynamic: abroad, Uber sells cheaper trips (the barbell’s low-cost wing) and a lower Uber One fee, so <b>revenue per user falls even as volume rises</b> — diluting ARPU but widening the funnel. <span class="ave-subh-note">Regulatory read: the more international the bookings, the wider Uber’s exposure to per-market driver-classification &amp; VAT rules.</span></div>');
  return h;
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
function barbellDiagram(){
  var h='<style>'+
    '.bb-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0 0}'+
    '.bb-card{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}'+
    '.bb-low{border-top:3px solid #06C167}.bb-prem{border-top:3px solid #10141A}'+
    '.bb-card-h{font-size:12px;font-weight:800;color:var(--navy);margin-bottom:2px}'+
    '.bb-card-s{font-size:11px;color:var(--mu);margin-bottom:9px}'+
    '.bb-chips{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}'+
    '.bb-chip{font-size:10.5px;font-weight:600;color:var(--navy);background:var(--surface);border:1px solid var(--bdr);border-radius:14px;padding:3px 9px}'+
    '.bb-stat{font-size:13px;color:var(--navy);line-height:1.45}.bb-stat b{font-weight:800}'+
    '@media(max-width:720px){.bb-cards{grid-template-columns:1fr}}'+
  '</style>';
  // U-shaped "barbell" curve: heavy ends, thin middle. Green = low-cost, black = premium.
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 250" role="img" aria-label="Barbell strategy curve">'+
    '<defs><marker id="bbArr" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9AA3AE"/></marker></defs>'+
    // baseline axis
    '<line x1="60" y1="208" x2="592" y2="208" stroke="#9AA3AE" stroke-width="1.5" marker-end="url(#bbArr)"/>'+
    '<text x="62" y="230" font-family="Inter,sans-serif" font-size="10.5" fill="#8A93A0">← more affordable</text>'+
    '<text x="326" y="230" font-family="Inter,sans-serif" font-size="10.5" fill="#8A93A0" text-anchor="middle">price / spend per trip</text>'+
    '<text x="590" y="230" font-family="Inter,sans-serif" font-size="10.5" fill="#8A93A0" text-anchor="end">more premium →</text>'+
    // the barbell curve (high ends, dipped middle)
    '<path d="M105 78 Q 230 196 325 184 Q 430 171 540 60" fill="none" stroke="#C7CED6" stroke-width="3.5"/>'+
    // squeezed middle marker
    '<circle cx="325" cy="184" r="6" fill="#B8C0CA"/>'+
    '<text x="325" y="172" font-family="Inter,sans-serif" font-size="10.5" fill="#8A93A0" text-anchor="middle" font-style="italic">the squeezed core</text>'+
    '<text x="325" y="201" font-family="Inter,sans-serif" font-size="9.5" fill="#A6AEB8" text-anchor="middle">standard UberX</text>'+
    // left weight (low-cost)
    '<circle cx="105" cy="78" r="40" fill="#06C167"/>'+
    '<text x="105" y="72" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">HIGH</text>'+
    '<text x="105" y="88" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">FREQUENCY</text>'+
    '<text x="105" y="138" font-family="Inter,sans-serif" font-size="12" font-weight="800" fill="#06965A" text-anchor="middle">~75% more trips</text>'+
    // right weight (premium)
    '<circle cx="540" cy="60" r="40" fill="#10141A"/>'+
    '<text x="540" y="54" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">HIGH</text>'+
    '<text x="540" y="70" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">PROFIT</text>'+
    '<text x="540" y="120" font-family="Inter,sans-serif" font-size="12" font-weight="800" fill="#10141A" text-anchor="middle">~3.5× profit growth</text>'+
  '</svg><div class="ov-diagram-cap">Uber deliberately grows the <b>two ends</b> of the price ladder and leans away from the squeezed middle: cheap-but-frequent rides on one side, premium-but-profitable on the other. The combined "growth bets" portfolio is now ~<b>$20B</b> of gross bookings, growing ~<b>80%</b>.</div></div>';
  h+='<div class="bb-cards">'+
    '<div class="bb-card bb-low"><div class="bb-card-h">Low-cost wing — wins on frequency</div><div class="bb-card-s">cheap alternatives (even transit) people use constantly</div>'+
      '<div class="bb-chips">'+BB_LOW.map(function(x){return '<span class="bb-chip">'+esc(x)+'</span>';}).join('')+'</div>'+
      '<div class="bb-stat"><b>~75%</b> higher trip frequency than the core · sparse/emerging markets growing ~<b>2×</b> faster · lower price per trip but far more trips.</div></div>'+
    '<div class="bb-card bb-prem"><div class="bb-card-h">Premium wing — wins on profit</div><div class="bb-card-s">higher-spend profiles that ride less but earn Uber more</div>'+
      '<div class="bb-chips">'+BB_PREM.map(function(x){return '<span class="bb-chip">'+esc(x)+'</span>';}).join('')+'</div>'+
      '<div class="bb-stat"><b>~3.5×</b> the profit growth of the core · Reserve <b>+60%</b> · premium >$10B GBs — fewer trips, richer economics.</div></div>'+
  '</div>'+
  '<div class="ov-fynote" style="margin-top:12px"><b>Self-funding:</b> premium margins bankroll the low-cost & AV bets, and the two wings lift new-user acquisition ~<b>25%</b>. It also explains the ARPU optics — cheap emerging-market trips lower revenue/user but raise volume. <b>AV is the newest barbell bet.</b></div>';
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
  // ── What truly drives Uber — the 5 things that matter (front-door emphasis) ──
  h+=sec('What Truly Drives Uber — the things that matter most',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">If you read nothing else: these five levers explain the whole business. <b>Tap any card.</b></div>'+
    '<div class="ov-drivers">'+KEY_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="key:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  // ── The Barbell strategy (the visual the team specifically wanted) ──
  h+=sec('The Barbell — grow both ends, lean away from the middle', barbellDiagram());
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FRT+'"></span>Freight</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings by segment <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartEbitda"></canvas></div></div>'+
  '</div>';
  h+=sec('How Uber Makes Money — one $10 trip',
    '<p class="ov-lede" style="margin:0 0 12px">The six steps of a Mobility trip — <b>tap any step</b> for the detail. Below: where the $10 lands.</p>'+
    chain(TRIP_FLOW,'trip',true)+
    '<div class="ov-grid2" style="margin-top:18px">'+
      '<div><div class="ov-subh">Where every $10 goes</div>'+mbars(TRIP_SPLIT)+'</div>'+
      '<div><div class="ov-subh">…and Uber\'s ~$3.00 take</div>'+mbars(TRIP_TAKE)+'</div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:12px"><b>~$0.75 of every $10 trip converts to cash</b> for Uber (incl. the ~$0.35 Aleka insurance float). <span class="ave-subh-note">Illustrative Mobility economics — Summit deck, Dec 2024.</span></div>');
  // ── Segments folded into Overview (no separate tab) ──
  h+=sec('The Three Segments & Their Economics',
    SEGMENTS.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join('')+
    '<div class="ov-grid2" style="margin-top:18px">'+
      '<div><div class="ov-chart-t">Take rate by segment <span>(revenue ÷ bookings, quarterly)</span></div>'+
        '<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span></div>'+
        '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartTake"></canvas></div></div>'+
      '<div><div class="ov-chart-t">Segment Adj. EBITDA margin <span>(% of bookings · ends 4Q25)</span></div>'+
        '<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span></div>'+
        '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMargin"></canvas></div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:12px">The convergence that matters: <b>Delivery margin has more than doubled</b> (~1.9%→4.0% of bookings) toward Mobility\'s ~8%, on advertising + scale. Mobility\'s 1Q26 take-rate dip to ~25.8% is a <b>UK accounting artifact</b> (~400bps), not real compression.</div>');
  h+=sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>');
  h+=sec('M&A — Terms & What Each Deal Added',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Uber\'s playbook: <b>buy density and adjacencies</b> (Delivery, grocery, Freight, regional super-apps), shut what doesn\'t work, and <b>divest</b> losing markets for equity stakes. Tap any card.</div>'+
    mnaCards(MNA)+
    '<div class="ov-diagram-cap" style="margin-top:12px">'+MNA_NOTE+'</div>');
  h+=sec('Peers & Competitive Landscape',
    '<style>'+
      '.ucomp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:2px 0 6px}'+
      '.ucomp-card{border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;background:var(--w)}'+
      '.ucomp-top{display:flex;align-items:center;gap:11px;margin-bottom:9px}'+
      '.ucomp-logo{width:34px;height:34px;border-radius:8px;border:1px solid var(--bdr);background:#fff;object-fit:contain;padding:5px;flex:none}'+
      '.ucomp-n{font-size:14px;font-weight:800;color:var(--navy);line-height:1.2}'+
      '.ucomp-arena{font-size:11px;color:var(--mu);font-weight:600;margin-top:2px}'+
      '.ucomp-edge{font-size:12px;color:var(--mu);line-height:1.5}.ucomp-edge b{color:var(--navy)}'+
      '@media(max-width:720px){.ucomp-grid{grid-template-columns:1fr}}'+
    '</style>'+
    '<div class="ucomp-grid">'+PEERS.map(function(p){
      return '<div class="ucomp-card"><div class="ucomp-top">'+
        '<img class="ucomp-logo" src="https://logo.clearbit.com/'+p.dom+'" alt="'+esc(p.n)+'" loading="lazy" onerror="this.onerror=null;this.src=\'https://www.google.com/s2/favicons?domain='+p.dom+'&sz=64\'">'+
        '<div><div class="ucomp-n">'+esc(p.n)+'</div><div class="ucomp-arena">'+esc(p.arena)+'</div></div></div>'+
        '<div class="ucomp-edge"><b>Uber’s edge —</b> '+p.edge+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Strategy ───────────────────────────────────────────────────────────
function strategyBody(c){
  var h='';
  h+='<p class="ov-lede">Uber\'s thesis: own <b>demand</b>. A cross-sell flywheel (rides ⇄ eats), monetized by membership and advertising, with asset-light economics that turn growth into cash — and AV positioned as a tailwind it aggregates rather than a threat it must outbuild.</p>';
  h+=sec('Summit Thesis', '<div class="ov-callout"><div class="ov-tl-body">'+THESIS+'</div></div>');
  h+=sec('3-Year Targets — Investor Day (Feb 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:14px">Uber is <b>running ahead of all three</b> targets. Over the last three years bookings compounded ~20% (1.7×) while TTM free cash flow grew ~115% CAGR (~10×).</div>');
  h+=sec('Strategic Initiatives',
    '<div class="ov-diagram-cap" style="margin:0 0 12px"><b>Tap any card</b> for the full detail.</div>'+
    '<div class="ov-drivers">'+INITIATIVES.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="init:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+=sec('Autonomous Vehicles — partner or threat? Uber\'s answer',
    '<div class="ov-callout"><div class="ov-tl-body"><b>The one question that decides the long term:</b> do robotaxis disrupt Uber, or does Uber become where AV fleets go to find demand? Uber sold its own self-driving unit in 2020 and made its bet — <b>aggregate the demand, don\'t build the cars.</b></div></div>'+
    '<div class="ov-sec-h" style="margin-top:18px">What Uber is actually doing — the evidence</div>'+
    bullets([
      '<b>Asset-light by design:</b> sold ATG → Aurora (2020) and chose to be the demand layer, not a robotaxi owner (owning fleets is capital-heavy).',
      '<b>30+ AV partners</b> (Waymo, Lucid+Nuro, WeRide, Pony.ai, Zoox, NVIDIA…), capped by <b>Uber Autonomous Solutions</b> (Feb 2026) — the infra layer for partners.',
      '<b>Scaling fast:</b> AV mobility trips <b>>10× YoY</b> (Q1 2026); on track for <b>15+ cities</b> by end-2026.',
      '<b>Hybrid network advantage:</b> human + AV supply smooths demand peaks; Uber-managed AV markets show ~30% higher trips-per-vehicle than AV-only.',
      '<b>Sense of scale:</b> AV is still ~0.1% of global rideshare trips — Uber\'s human network adds ~50× the entire global AV volume every year.',
    ])+
    '<div class="ov-fynote"><b>The real risk to watch:</b> Waymo already runs its <i>own</i> app in SF/Phoenix/LA — direct disintermediation. Uber\'s counter, in management\'s words (Q1 2026): <b>"no effect of the Waymo launches on our overall business,"</b> with US mobility actually accelerating. AV is run as the newest <b>barbell growth bet</b> — invest at negative margins now, turn profitable later.</div>');
  h+=sec('Tailwinds & Headwinds',
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div></div>');
  return h;
}

// (The former "Segments" tab was folded into the Overview — see overviewBody.)

// ─── Pane: Unit Economics & Regulation ───────────────────────────────────────
function unitBody(c){
  var h='';
  h+='<p class="ov-lede">Uber\'s unit economics are a <b>demand-density</b> story: more products per user, more trips per user, monetized by membership and ads — with an accounting quirk that currently masks the Mobility take rate.</p>';
  h+=sec('The Cross-Sell Flywheel', '<div class="ov-callout">'+bullets(FLY)+'</div>');
  h+='<div class="ov-chart-t" style="margin-top:6px">Gross Bookings per MAPC <span>(annual $, all products · light = estimate)</span></div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartGBPU"></canvas></div>';
  h+=sec('Emerging Markets & FX — does adding users dilute spend per user?', '<div class="ov-callout"><div class="ov-tl-body">'+EMERGING+'</div></div>');
  h+=sec('Uber One — member vs non-member economics',
    '<div class="ov-kpis">'+UBERONE_STAT.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d muted">'+esc(k.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:14px">'+bullets(UBERONE_NOTE)+'</div>');
  h+=sec('The Mobility Take-Rate "Drop" — an accounting artifact',
    '<div class="ov-callout"><div class="ov-tl-body">'+UK_NOTE+'</div></div>'+
    '<div class="ov-subh" style="margin-top:16px">In management\'s own words</div>'+
    TAKE_QUOTES.map(function(q){ return '<div class="ov-callout" style="margin-top:10px"><div class="ov-who-k">'+esc(q[0])+'</div><div class="ov-tl-body" style="margin-top:4px">'+q[1]+'</div></div>'; }).join(''));
  h+=sec('Insurance — the Aleka float',
    '<p class="ov-lede" style="margin:0 0 14px">Uber owns its own insurer, <b>Aleka</b>. Riders fund commercial insurance inside the fare; Aleka holds the float and the underwriting spread returns to Uber. <b>Tap any step.</b></p>'+
    chain(ALEKA_CHAIN,'aleka')+
    '<div class="ov-sec-h ovt-store-h" style="margin-top:18px">How it has evolved</div>'+
    '<div class="ov-timeline">'+INS_TL.map(function(t){ return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+'</div></div>'; }).join('')+'</div>');
  h+=sec('Regulation & Driver Classification — Uber\'s global surface area', rows(REG));
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
  return h;
}
function groupRow(label,items){ return '<div class="ave-group"><span class="ave-group-l">'+esc(label)+'</span><div class="ave-pills">'+items.map(function(it){ return '<button type="button" class="ave-pill" data-ave="'+it[0]+'">'+esc(it[1])+'</button>'; }).join('')+'</div></div>'; }

// ─── Shell ────────────────────────────────────────────────────────────────────
function html(c){
  var h='<div class="ov ov-uber" data-brand="UBER">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="strategy">Strategy &amp; AV</button>'+
    '<button type="button" class="ovt-tab" data-ovt="unit">Unit Economics</button>'+
    '<button type="button" class="ovt-tab" data-ovt="model">Model vs. Reality</button>'+
    '<button type="button" class="ovt-tab" data-ovt="calls">Earnings Narrative</button>'+
    '<button type="button" class="ovt-tab" data-ovt="supply">Supply Chain</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="strategy" hidden>'+strategyBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="unit" hidden>'+unitBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="model" hidden>'+modelBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="calls" hidden>'+callsBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="supply" hidden>'+supplyBody()+'</div>';
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
function buildModelTab(){ var root=document.querySelector('.ov-uber'); if(!root) return; buildAveChart(); switchAveMetric(root,_aveMetric); }

// ─── Tab orchestration ────────────────────────────────────────────────────────
function buildOverviewCharts(){
  buildSegStack('ubChartGB', 0, YEARS.length-1);
  buildAnnualBar('ubChartEbitda', A_EBITDA, money);
  // Segment economics charts (folded in from the former Segments tab)
  buildLines('ubChartTake', Q13, { label:'Mobility', data:MOB_TAKE, color:MOB }, { label:'Delivery', data:DEL_TAKE, color:DEL }, pf);
  buildLines('ubChartMargin', Q13.slice(0,12), { label:'Mobility', data:MOB_MARGIN, color:MOB }, { label:'Delivery', data:DEL_MARGIN, color:DEL }, pf);
}
function buildUnitTab(){
  var gbpu=A_TOT_GB.map(function(g,i){ return g/A_MAPC[i]; }); // annual GB per MAPC ($)
  buildLines('ubChartGBPU', YEARS, { label:'GB / MAPC', data:gbpu, color:BRAND2 }, null, function(v){ return '$'+Math.round(v); }, { estFrom:FIRST_EST });
}
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(buildOverviewCharts);
  if(key==='unit')     requestAnimationFrame(buildUnitTab);
  if(key==='model')    requestAnimationFrame(buildModelTab);
}
function wireModal(root){
  var back=root.querySelector('#ubModalBack'), mT=root.querySelector('#ubModalT'), mB=root.querySelector('#ubModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#ubModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='trip'){ var s=TRIP_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    if(kind==='aleka'){ var a=ALEKA_CHAIN[+id]; return a?{t:'Aleka — '+a.t,h:a.d}:null; }
    if(kind==='key'){ var k=KEY_DRIVERS.filter(function(x){return x.k===id;})[0]; return k?{t:k.t,h:k.d}:null; }
    if(kind==='note'&&id==='gaap'){ return {t:'How to read Uber’s profitability',h:GAAP_NOTE}; }
    if(kind==='init'){ var d=INITIATIVES.filter(function(x){return x.k===id;})[0]; return d?{t:d.t,h:d.d}:null; }
    if(kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m?{t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>',h:m.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
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
  wireModal(root);
  // Earnings calls accordion
  root.querySelectorAll('#ubCallsAcc .lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var uberOverview = { html: html, init: init };
