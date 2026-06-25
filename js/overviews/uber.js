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
var AS_OF='Headline KPIs are FY2025. Latest quarter is Q1 2026 — $53.7B bookings (+25% YoY), $13.2B revenue (+14%, dragged ~8pts by a UK accounting change), $2.48B Adj. EBITDA (+33%), 199M MAPCs (+17%), a record $3.0B of buybacks and ~$9.8B TTM free cash flow.';
var FY_NOTE='FY2025: Gross Bookings $193.5B (+19%), Adj. EBITDA $8.73B (+35%), free cash flow $9.76B (+42%, ~112% of Adj. EBITDA). GAAP net income was $10.05B but is inflated by tax and equity-investment items — Adj. EBITDA and FCF are the cleaner signals (2023 was the first full year of GAAP operating profit). Forward years (2026E–2029E) are Summit DCF estimates.';
var HOW_MONEY=[
  'A <b>marketplace take</b> on each trip/order: Mobility keeps ~<b>30%</b> of bookings, Delivery ~<b>19%</b> — the rest goes to drivers/couriers and merchants.',
  '<b>Uber One</b> (50M+ members) drives frequency — members generate ~<b>50%</b> of combined bookings and spend ~3× non-members.',
  '<b>Advertising</b> (>$2B annualized run-rate, +50% YoY) is very high-margin and mostly rides on Delivery — the core margin-expansion engine.',
  '<b>Asset-light:</b> minimal capex means Adj. EBITDA converts to free cash flow at ~<b>100%+</b>, funding a $20B buyback.',
];
var SEGMENTS=[
  ['Mobility', 'Ridesharing across ~70 countries — the profit engine. Highest take rate (~30% of bookings) and the largest profit dollars (~$2.2B segment Adj. EBITDA in Q4 2025, ~8% of bookings).'],
  ['Delivery', 'Uber Eats — food, grocery & retail. Bookings have nearly caught Mobility. Lower take (~19%) but margin has more than doubled (1.9%→4.0% of bookings) on advertising + scale.'],
  ['Freight', 'Digital logistics brokerage. Gross-basis (revenue ≈ bookings), roughly breakeven; negligible profit contribution. Returned to growth in Q1 2026 after ~2 years of contraction.'],
  ['Advertising', 'Cross-segment, >$2B annualized run-rate (+50% YoY); crossed 2% of Delivery bookings. Very high incremental margin — the structural margin lever.'],
  ['Uber One', 'Membership tying the platform together: 50M+ members (April 2026, +50% YoY), ~50% of combined bookings, ~3× spend vs non-members.'],
];
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
var PEERS=[
  ['Lyft', 'US/Canada rideshare #2.', 'Uber is global and multi-product (Delivery, Freight, ads); Lyft is US-rides-focused. Uber\'s scale and cross-sell are structural advantages.'],
  ['DoorDash', 'US delivery leader (larger US food-delivery share).', 'Head-to-head in Delivery; Uber counters with the Mobility cross-sell and Uber One bundling rides + eats.'],
  ['Waymo (Alphabet)', 'Robotaxi operator — on the Uber app in some cities, on its own app in others.', 'Both partner and rival. Uber bets demand aggregation + utilization beats fixed AV-only fleets.'],
  ['Bolt / Grab / Didi', 'Regional super-apps (Europe, SE Asia, China/LatAm).', 'Uber competes or holds equity stakes (Grab, Didi legacy); local scale matters market-by-market.'],
];
var TAILWINDS=[
  '<b>Cross-sell flywheel:</b> 40% of customers use multiple products; cross-platform users spend ~3× and retain better — lowering CAC and lifting LTV.',
  '<b>Advertising</b> (>$2B run-rate, +50%) and <b>Uber One</b> (50M members) drive structural margin expansion.',
  '<b>Insurance pressures moderating</b> — early pass-through of savings is reviving US trip growth (esp. California).',
  '<b>Asset-light AV optionality</b> — ~20 partners; positioned as the demand aggregator for a "multi-trillion-dollar" AV market.',
  '<b>Capital returns:</b> $20B buyback, ~$3B/quarter, ~2% annual share-count reduction; record ~$9.8B TTM free cash flow.',
];
var HEADWINDS=[
  '<b>AV disintermediation risk:</b> Waymo and Tesla can bypass Uber with their own apps and structurally lower (driverless) costs.',
  '<b>Delivery competition</b> (DoorDash) and Mobility competition keep take rates and incentives under pressure.',
  '<b>Regulatory:</b> driver-classification and minimum-pay regimes raise cost; EU Platform Work Directive (transpose by Dec 2026) is the key open intl risk.',
  '<b>GAAP earnings volatility</b> from large equity stakes (Aurora, etc.) — net income is a poor profitability gauge.',
  '<b>Insurance severity</b> remains a structural US cost; reserves ~$12.9B and rising.',
];
// ── Strategy ──
var TARGETS=[
  { v:'Mid–high teens', l:'Gross Bookings CAGR', s:'3-yr target (Feb 2024 Investor Day). FY25 actual: +19%.' },
  { v:'High-30s–40%',   l:'Adj. EBITDA CAGR',    s:'">2× the rate of topline." FY25 actual: +35%.' },
  { v:'>90%',           l:'FCF conversion',      s:'Of Adj. EBITDA. FY25 actual: ~112%.' },
];
var INITIATIVES=[
  ['The flywheel', '"Go anywhere and get anything." ~40% of users use multiple products; ~⅓ of Eats customers came from the Rides app. Cross-platform users spend ~3× and churn less — lower CAC, higher LTV.'],
  ['Uber One', '50M+ members (Apr 2026, +50% YoY); ~50% of combined bookings; >35% of US Mobility bookings from members. The connective tissue of the cross-sell.'],
  ['Advertising', '>$2B annualized run-rate (+50% YoY); crossed 2% of Delivery bookings. Very high incremental margin — the clearest structural margin lever.'],
  ['Autonomous (AV)', 'Asset-light: ~20 partners (Waymo, Lucid+Nuro, WeRide, Pony.ai, Avride, Wayve, VW…). Goal: AV in 15+ cities by end-2026; "largest facilitator of AV trips in the world" by 2029.'],
  ['Capital returns', 'First-ever buyback (2024, $7B) scaled to a $20B authorization; record ~$3B repurchased in Q1 2026; ~2% annual share-count reduction.'],
  ['Uber for Business', 'B2B now >$5B of bookings, growing >2× Mobility — another high-margin cross-sell vector.'],
];
var AV_BULL=[
  '<b>Demand wins:</b> Uber argues "AVs change how trips are <i>supplied</i>, not how demand is <i>aggregated</i>" — the platform with the most demand drives the highest fleet utilization.',
  '<b>Asset-light:</b> partnering (not building) avoids the capex and regulatory risk of owning robotaxis; commitments are "flexible and transferable to fleet/financial partners."',
  '<b>Hybrid network:</b> human + AV supply lets Uber smooth demand peaks; management cites ~30% higher trips-per-vehicle on Uber-managed AV markets vs AV-only.',
  '<b>Scale today:</b> AV is ~0.1% of global rideshare trips; Uber\'s Mobility adds ~50× the entire global AV category volume each year.',
];
var AV_BEAR=[
  '<b>Disintermediation:</b> Waymo already runs its <i>own</i> app in SF/Phoenix/LA (450k+ weekly trips) and is launching 2026 cities <i>without</i> Uber (Dallas, Nashville-with-Lyft) — the partnership may be cooling.',
  '<b>Lower-cost rivals:</b> driverless fleets have no driver pay — a structural cost edge that could undercut Uber\'s marketplace pricing.',
  '<b>Winner-take-few risk:</b> if robotaxis consolidate around 1–2 operators with their own demand apps, Uber\'s partner-dependent model is exposed.',
  '<b>Tesla wildcard:</b> a credible robotaxi entrant with a captive fleet and brand could route around aggregators entirely.',
];
// ── Unit economics / regulation ──
var FLY=[
  'Uber discloses MAPCs (monthly active platform consumers) and Trips, not segment trip counts — so per-trip economics are read at the platform level.',
  '<b>Frequency is rising:</b> Trips growth (+20%) consistently outpaces MAPC growth (+17%) — users transacting more often, the flywheel working.',
  '<b>Uber One</b> members are ~2× as likely to use both Mobility and Delivery (2-in-5 vs 1-in-5 platform-wide) and spend ~3× more.',
  'Gross Bookings per MAPC has risen from ~$881/yr (2022) to ~$958/yr (2025) on mix and frequency, not just price.',
];
var UK_NOTE='In January 2026, after a UK tax ruling, Uber moved its UK rideshare (outside London) from a <b>principal (merchant)</b> to an <b>agent</b> model. Driver payments reclassified from cost of revenue to contra-revenue — cutting reported revenue ~$1.0B and Mobility\'s revenue margin by ~<b>400 bps</b> in Q1 2026, with an equal-and-opposite drop in cost of revenue. <b>Zero impact on Adjusted EBITDA or underlying economics.</b> So the reported Q1 2026 Mobility take rate (~25.8%) understates the real ~30% — a pure gross-to-net accounting artifact, not deteriorating economics.';
var INS=[
  'Insurance is the largest US Mobility cost pressure; total insurance reserves are ~<b>$12.9B</b> (Q1 2026) and rising with volume.',
  'After 2022–24 insurance inflation forced fare hikes (suppressing trips, esp. California), 2025–26 shows <b>moderating insurance costs</b>.',
  'Uber is starting to <b>pass savings through to riders</b> — management cites "meaningfully" improving trip growth in San Francisco and Los Angeles.',
];
var REG=[
  ['US — classification de-risked', '<b>Prop 22</b> upheld by the California Supreme Court (July 2024); the federal DOL\'s 2024 contractor rule is unenforced and <b>proposed for rescission</b> (Feb 2026). The dominant model is "contractor + pay floor" (Massachusetts, Minnesota, NYC, Seattle), not reclassification.'],
  ['International — mixed, trending favorable', '<b>UK</b>: drivers are "workers" since <i>Aslam</i> (2021), and Uber lost a VAT fight (2025). <b>Netherlands</b> (Jan 2026) and <b>France</b> (2025) delivered pro-contractor reversals. The <b>EU Platform Work Directive</b> (transpose by Dec 2026) is the key open risk — its bite depends on national law.'],
  ['How Uber frames it', 'The 10-K says reclassification "would require us to fundamentally change our business model" — but, unlike some peers, it <b>does not say the loss "cannot be estimated."</b> It affirmatively states the aggregate reasonably-possible loss would <b>not be material</b>.'],
  ['Other', 'NYC congestion pricing ($1.50/trip, Jan 2025); a Dutch GDPR fine (€290M, under appeal); an open FTC case on Uber One cancellation flows (filed 2025). Mostly cost/PR drags, not existential.'],
];
var SOURCES='Quantitative series: Summit DCF model, snapshot 2026-05-07 (actuals_history = reported; projection_history = model estimate). Segment Adjusted EBITDA actuals end Q4 2025 — Uber moved its primary segment-profit measure to Segment Operating Income in Q1 2026. Take rates are derived (revenue ÷ segment gross bookings) and the Q1 2026 Mobility figure is depressed ~400 bps by a UK gross-to-net accounting change. Qualitative content: Uber FY2024 & FY2025 10-Ks, Q4 2025 & Q1 2026 results and prepared remarks, the Feb 2024 Investor Day, and the Cal. Supreme Court Prop 22 ruling (Jul 2024). Forward years (2026E–2029E) are model estimates, not company guidance. Brand colors approximate Uber black and Uber Eats green.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join(''); }
function rangeSlider(key,maxI,a,b){
  return '<div class="sg-controls"><div class="sg-slider">'+
    '<div class="sg-track"><div class="sg-fill" id="'+key+'Fill"></div></div>'+
    '<input type="range" id="'+key+'Min" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start">'+
    '<input type="range" id="'+key+'Max" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End">'+
    '</div><div class="sg-ends"><span>'+esc(a)+'</span><span>'+esc(b)+'</span></div>'+
    '<div class="sg-readout" id="'+key+'Readout"></div></div>';
}

// ─── Pane: Overview ───────────────────────────────────────────────────────────
function overviewBody(c){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FRT+'"></span>Freight</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings by segment <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="ubChartEbitda"></canvas></div></div>'+
  '</div>';
  h+=sec('How Uber Makes Money', bullets(HOW_MONEY));
  h+=sec('Segments & Products', SEGMENTS.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+esc(s[1])+'</div></div>'; }).join(''));
  h+=sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>');
  h+=sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they are</th><th>How Uber differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+'</tbody></table>');
  h+=sec('Tailwinds & Headwinds',
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Strategy ───────────────────────────────────────────────────────────
function strategyBody(c){
  var h='';
  h+='<p class="ov-lede">Uber\'s thesis: own <b>demand</b>. A cross-sell flywheel (rides ⇄ eats), monetized by membership and advertising, with asset-light economics that turn growth into cash — and AV positioned as a tailwind it aggregates rather than a threat it must outbuild.</p>';
  h+=sec('3-Year Targets — Investor Day (Feb 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:14px">Uber is <b>running ahead of all three</b> targets. Over the last three years bookings compounded ~20% (1.7×) while TTM free cash flow grew ~115% CAGR (~10×).</div>');
  h+=sec('Strategic Initiatives',
    '<div class="ov-drivers">'+INITIATIVES.map(function(d){ return '<div class="ov-driver"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+d[1]+'</div></div>'; }).join('')+'</div>');
  h+=sec('Autonomous Vehicles — Opportunity vs. Threat',
    '<p class="ov-lede" style="margin-bottom:14px">The dominant long-term question. Uber sold its own AV unit in 2020 and bet on being the <b>demand aggregator</b> — but Waymo is simultaneously a <b>partner</b> (on the Uber app in Austin & Atlanta) and a <b>competitor</b> (its own app in SF/Phoenix/LA). Both are true today.</p>'+
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">The bull case (Uber\'s framing)</div>'+bullets(AV_BULL)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">The bear case</div>'+bullets(AV_BEAR)+'</div></div>'+
    '<div class="ov-fynote">Management: "we don\'t see any effect of the Waymo launches on our overall business" (Q1 2026) — while also conceding the majority of trips <i>could</i> be robot-fulfilled "15 to 20 years from now." The near-term is benign; the long-term is the debate.</div>');
  return h;
}

// ─── Pane: Segments ───────────────────────────────────────────────────────────
function segmentsBody(c){
  var h='';
  h+='<p class="ov-lede">Two engines of similar size but different economics: <b>Mobility</b> is smaller-growing but higher-margin (the profit engine); <b>Delivery</b> is the faster grower whose margins are converging upward. Freight is a near-breakeven brokerage.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FRT+'"></span>Freight</span></div>';
  h+='<div class="ov-chart-t">Gross Bookings by segment <span>($B, FY · light = estimate · drag to window)</span></div>';
  h+=rangeSlider('seg', YEARS.length-1, YEARS[0], YEARS[YEARS.length-1]);
  h+='<div class="ov-chart-wrap ovs-tall"><canvas id="ubChartSeg"></canvas></div>';
  h+='<div class="ov-fynote">Delivery bookings (green) have nearly caught Mobility (black). On the model\'s estimates the two stay neck-and-neck — but their <i>profit</i> contribution is very different (next).</div>';
  h+='<div class="ov-sec-h ovt-store-h">Take Rate by Segment <span class="ave-subh-note">(revenue ÷ segment bookings, quarterly)</span></div>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility take</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery take</span></div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartTake"></canvas></div>';
  h+='<div class="ov-fynote">Mobility take held ~30% until the <b>1Q26 drop to ~25.8%</b> — a <b>UK accounting artifact</b> (~400 bps), not real compression. Delivery take has risen ~18%→19.5% on advertising. <span class="ave-subh-note">See Unit Economics for the full explainer.</span></div>';
  h+='<div class="ov-sec-h ovt-store-h">Segment Adj. EBITDA Margin <span class="ave-subh-note">(% of segment bookings, quarterly · ends 4Q25)</span></div>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+MOB+'"></span>Mobility margin</span><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+DEL+'"></span>Delivery margin</span></div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartMargin"></canvas></div>';
  h+='<div class="ov-fynote">The key convergence: Delivery margin has <b>more than doubled</b> (~1.9%→4.0% of bookings) toward Mobility\'s ~8%, driven by advertising and scale — the heart of Uber\'s margin-expansion story. (Uber moved to "segment operating income" in 1Q26, so this Adj. EBITDA view ends 4Q25.)</div>';
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Unit Economics & Regulation ───────────────────────────────────────
function unitBody(c){
  var h='';
  h+='<p class="ov-lede">Uber\'s unit economics are a <b>demand-density</b> story: more products per user, more trips per user, monetized by membership and ads — with an accounting quirk that currently masks the Mobility take rate.</p>';
  h+=sec('The Cross-Sell Flywheel', '<div class="ov-callout">'+bullets(FLY)+'</div>');
  h+='<div class="ov-chart-t" style="margin-top:6px">Gross Bookings per MAPC <span>(annual $, all products · light = estimate)</span></div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="ubChartGBPU"></canvas></div>';
  h+=sec('The Mobility Take-Rate Artifact (UK)', '<div class="ov-callout"><div class="ov-tl-body">'+UK_NOTE+'</div></div>');
  h+=sec('Insurance', '<div class="ov-callout">'+bullets(INS)+'</div>');
  h+=sec('Regulation & Driver Classification', rows(REG));
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
    '<button type="button" class="ovt-tab" data-ovt="segments">Segments</button>'+
    '<button type="button" class="ovt-tab" data-ovt="unit">Unit Economics</button>'+
    '<button type="button" class="ovt-tab" data-ovt="model">Model vs. Reality</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="strategy" hidden>'+strategyBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="segments" hidden>'+segmentsBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="unit" hidden>'+unitBody(c)+'</div>';
  h+='<div class="ovt-pane" data-ovt="model" hidden>'+modelBody(c)+'</div>';
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
function setupSegSlider(){
  var mn=document.getElementById('segMin'), mx=document.getElementById('segMax'), fill=document.getElementById('segFill'), read=document.getElementById('segReadout');
  if(!mn||!mx||!fill||!read) return; var maxI=YEARS.length-1;
  function apply(){ var a=+mn.value,b=+mx.value; fill.style.left=(a/maxI*100)+'%'; fill.style.width=((b-a)/maxI*100)+'%';
    buildSegStack('ubChartSeg',a,b);
    var cg=cagr(A_TOT_GB[a],A_TOT_GB[b],b-a);
    read.innerHTML='<span class="sg-range">'+YEARS[a]+' → '+YEARS[b]+'</span><span class="sg-stat"><b>'+moneyB(A_TOT_GB[a])+'</b> → <b>'+moneyB(A_TOT_GB[b])+'</b> total GB</span>'+
      (cg!=null?'<span class="sg-stat sg-cagr">CAGR <b>'+cg.toFixed(1)+'%</b></span>':'<span class="sg-stat">CAGR —</span>'); }
  mn.oninput=function(){ if(+mn.value>=+mx.value) mn.value=+mx.value-1; apply(); };
  mx.oninput=function(){ if(+mx.value<=+mn.value) mx.value=+mn.value+1; apply(); };
  apply();
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
function buildOverviewCharts(){ buildSegStack('ubChartGB', 0, YEARS.length-1); buildAnnualBar('ubChartEbitda', A_EBITDA, money); }
function buildSegmentsTab(){
  buildSegStack('ubChartSeg', 0, YEARS.length-1); setupSegSlider();
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
  if(key==='segments') requestAnimationFrame(buildSegmentsTab);
  if(key==='unit')     requestAnimationFrame(buildUnitTab);
  if(key==='model')    requestAnimationFrame(buildModelTab);
}
function wireModal(root){
  var back=root.querySelector('#ubModalBack'), mT=root.querySelector('#ubModalT'), mB=root.querySelector('#ubModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#ubModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.onclick=function(){ var p=el.getAttribute('data-detail').split(':'); if(p[0]==='hist'){ var t=TIMELINE[+p[1]]; if(t&&t.d) openM(t.y,t.d); } }; });
}
function init(c){
  var root=document.querySelector('.ov-uber'); if(!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  root.querySelectorAll('.ave-pill').forEach(function(btn){ btn.onclick=function(){ switchAveMetric(root, btn.getAttribute('data-ave')); }; });
  wireModal(root);
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var uberOverview = { html: html, init: init };
