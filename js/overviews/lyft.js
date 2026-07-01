// overviews/lyft.js — custom Overview for Lyft, Inc. (NASDAQ: LYFT)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series are sourced from the Summit DCF model (snapshot 2026-05-13):
//   • annual / quarterly ACTUALS  → actuals_history sheet
//   • model ESTIMATES (back-test) → projection_history sheet
// Qualitative content is from Lyft IR / SEC filings / earnings calls (see SOURCES).
// No live API calls — every figure is baked from the model snapshot + cited filings.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
  { t:'Rider requests & sees an upfront price', d:'Lyft shows an <b>upfront, all-in price</b> before the rider confirms. Lyft controls pricing (mix, Price Lock subscriptions), which shapes the take rate trip-by-trip.' },
  { t:'Trip happens; rider pays the full fare', d:'Payment is <b>card / digital wallet</b>. Lyft collects the entire <b>Gross Bookings</b> amount (fare + fees). Revenue is then reported <i>net of driver pay</i>, which is what makes the headline "take rate" optics tricky (see Unit Economics).' },
  { t:'Driver keeps their pay (≥70% commitment)', d:'Since Feb 2024 Lyft <b>guarantees drivers at least 70%</b> of rider payments each week (after external fees), capping Lyft\'s economic take ~30%. <b>Timing:</b> weekly by default, or <b>Express Pay</b> instant cashout for a small fee.' },
  { t:'Lyft keeps the spread + rider fees', d:'Lyft\'s <b>revenue</b> is the marketplace spread plus rider service fees — roughly <b>33% of bookings</b>. From here, the question is how much survives cost of revenue.' },
  { t:'Cost of revenue — mostly insurance', d:'The biggest cost slice is <b>auto insurance</b> (plus payment processing and hosting). Insurance is the <b>swing factor</b>: as cost per ride falls, gross profit per ride expands. It doesn\'t get its own income-statement line — it shows up in the <i>change</i> in cost of revenue.', payoff:false },
  { t:'What\'s left is gross profit', d:'Gross profit is ~<b>$3.32 / ride</b> (Q1 2026) — ~16% of bookings, ~48% of revenue. The 2025–26 margin story is <b>not</b> a higher take rate; it\'s a <b>lower insurance cost per ride</b>.', payoff:true },
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
  { n:'Motivate', y:'2018', deal:'~$250M', terms:'cash (est.)', own:'Operating', cat:'Bikeshare', big:true,
    detail:'<b>Terms:</b> ~$250M (press estimate — never confirmed by Lyft); closed late 2018.<br><br><b>What it added:</b> the largest US bikeshare operator — <b>Citi Bike, Divvy, Bay Wheels</b> and more.<br><br><b>Status:</b> still operating (Lyft explored a sale ~2023 at a ~$500M valuation but retained it). Citi Bike did 46M+ rides in 2025.' },
  { n:'Halo Cars', y:'2020', deal:'undisclosed', terms:'—', own:'Integrated', cat:'Advertising',
    detail:'<b>Terms:</b> undisclosed (Feb 2020).<br><br><b>What it added:</b> car-top digital advertising — the seed of <b>Lyft Media</b>.<br><br><b>Status:</b> integrated; Lyft Media is now ~$100M run-rate.' },
  { n:'Flexdrive', y:'2020', deal:'~$20M', terms:'cash + leases', own:'Integrated', cat:'Driver rentals',
    detail:'<b>Terms:</b> ~$20M cash + assumed vehicle leases (Feb 2020).<br><br><b>What it added:</b> the fleet that powers <b>Express Drive</b> — car rentals <i>for drivers</i> (not riders).<br><br><b>Status:</b> integrated subsidiary; ongoing.' },
  { n:'PBSC Urban Solutions', y:'2022', deal:'~$160M', terms:'cash', own:'Integrated', cat:'Bikeshare tech',
    detail:'<b>Terms:</b> ~$160M (May 2022).<br><br><b>What it added:</b> bikeshare <b>hardware & technology</b> (~95k bikes deployed globally).<br><br><b>Status:</b> integrated as <b>Lyft Urban Solutions</b>.' },
  { n:'FreeNow', y:'2025', deal:'~$197M', terms:'cash (€175M)', own:'Operating', cat:'Europe', big:true,
    detail:'<b>Terms:</b> ~$197M / €175M; closed Jul 31 2025.<br><br><b>What it added:</b> a European taxi / multi-mobility app across ~9 countries — Lyft\'s <b>first expansion outside North America</b>; ~€1B annualized run-rate.<br><br><b>Status:</b> operating/integrating; one-app experience planned for 2027.' },
];
var MNA_NOTE='Lyft also made the defining <b>divestiture</b> of its strategy: it sold its self-driving unit <b>Level 5 → Toyota\'s Woven Planet</b> (2021, ~$550M), choosing to be the asset-light demand + fleet-ops layer for third-party AV rather than building its own stack. Note: Waymo, May Mobility, Baidu, Tensor are <b>partnerships, not acquisitions</b>.';

// ─── Render helpers (shared overview.css classes) ─────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join(''); }
// Numbered, optionally-clickable step chain (shared .ov-chain). detailKey → data-detail="<key>:<i>".
function chain(arr, detailKey){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(detailKey?' ov-clickable':'');
  var attr=detailKey?' data-detail="'+detailKey+':'+i+'"':'';
  var more=detailKey?' <span class="ov-tl-more">tap ›</span>':'';
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }
// Horizontal proportion bars (shared .ov-mbars). rows = [label, pct, valueLabel, color].
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
// M&A cards (shared .ov-cards-mna), key = `mna:<n>`.
function mnaCards(arr){ return '<div class="ov-cards ov-cards-mna">'+arr.map(function(m){
  return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
    '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span><span class="ov-chip'+(m.miss?' ov-chip-neg':'')+'">'+esc(m.cat)+'</span></div>'+
    '<div class="ov-card-kpis"><span>'+esc(m.y)+'</span><span>'+esc(m.deal)+'</span><span>'+esc(m.terms)+'</span><span>'+esc(m.own)+'</span></div>'+
    '<div class="ov-more">What it added ›</div></div>';
}).join('')+'</div>'; }
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
      { q:'Q1 2026', items:['<b>Gett UK acquired</b> \u2014 70\u201380% of London\u2019s taxi fleets. London framed as proving ground for European AV regulatory relationships before broader deployment.'] },
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

function callsBody(){
  var h='<p class="ov-lede">The key narrative threads from <b>10 earnings calls</b> (Q4 2023 \u2192 Q1 2026) \u2014 organized by <b>theme</b> so you can trace how each story evolved.</p>';
  h+='<div class="lpb-acc" id="lyCallsAcc">';
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
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Lyft Q4 2023\u2013Q1 2026 earnings calls and prepared remarks via Quartr. Highlights are qualitative and contemporaneous.</div>';
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
  var plumb=[['Oracle','ORCL','oracle.com'],['Dell','DELL','dell.com'],['AWS','AMZN','amazon.com'],['Twilio','TWLO','twilio.com'],['CSAA',null,'csaa.com'],['Hertz','HTZ','hertz.com']];
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
  h+='<div class="lsc-step"><div class="lsc-num">1</div><div class="lsc-body"><div class="lsc-h">The one signal that matters — the AV web</div>'+logos(av)+
    '<div class="lsc-d">Lyft holds a tie with <b>nearly every credible AV player</b> — the same multi-partner hedge Uber runs, smaller. Whoever wins autonomy, Lyft aims to <b>host their fleet and supply the demand</b> (Waymo → Nashville, May Mobility → Atlanta, Baidu → Europe). No single AV can disintermediate Lyft <i>while Lyft owns the rider.</i></div></div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">2</div><div class="lsc-body"><div class="lsc-h">Everything else — commodity plumbing</div>'+logos(plumb)+
    '<div class="lsc-d">Cloud & data, payments, insurance (CSAA + the captive PVIC), driver rentals (Hertz/FlexDrive) — standard inputs with <b>no leverage</b> over Lyft and near-zero disclosed spend. Not a cost story.</div></div></div>';
  h+='<div class="lsc-step"><div class="lsc-num">3</div><div class="lsc-body"><div class="lsc-h">The customers — four B2B ties, zero concentration</div>'+logos(cust)+
    '<div class="lsc-d">Healthcare NEMT (ModivCare, Cano Health), events (AXS) and a European rental tie (Sixt, via FreeNow). No single rider or account is material — the marketplace has no customer-concentration risk.</div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:12px"><b>The so-what, in one line:</b> a sparse SPLC <i>proves</i> the asset-light B2C model — Lyft owns almost nothing and depends on almost no one. The single thing worth tracking here is the <b>AV web</b>: the bet that Lyft can ride autonomy without building it. <span class="ave-subh-note">Bloomberg SPLC, 29-Jun-2026.</span></div>';
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
function peerPositioning(){
  var h='<style>.lpr-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'+
    '.lpr-c{border:1px solid var(--bdr);border-left:3px solid var(--brand-2);border-radius:8px;padding:10px 13px;background:var(--w)}'+
    '.lpr-n{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}.lpr-d{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.lpr-adj{font-size:11.5px;color:var(--mu);line-height:1.55;margin-top:10px;background:var(--brand-soft);border-radius:8px;padding:9px 12px}'+
    '.peer-tip{position:fixed;z-index:60;max-width:250px;background:var(--navy);color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,0.28);pointer-events:none;border-top:3px solid var(--brand)}'+
    '.peer-tip .pt-n{display:block;font-weight:800;font-size:12.5px;color:var(--brand);margin-bottom:3px}'+
    '.peer-dot{transition:r .1s}.peer-dot:hover{stroke:var(--brand);stroke-width:2}'+
    '@media(max-width:720px){.lpr-grid{grid-template-columns:1fr}}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">The world\'s <b>ride-hailing platforms</b>, mapped by how far each has <b>diversified beyond rides</b> (x — Lyft is ~7% non-rideshare vs Uber ~50%+ via Delivery, Freight &amp; Ads) and its <b>geographic reach</b> (y). Lyft is the deliberate outlier: <b>narrow and domestic</b> while everyone else went broad, global, or both. <span style="opacity:.75">Hover any dot for the reasoning behind its spot.</span></div>';
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
  var cards=[
    ['Uber','The only true rival — same ~30% take, ~70% US share. So the gap isn\'t price, it\'s <b>scale + a Delivery business that funds rider CAC</b> Lyft can\'t match.'],
    ['Didi','Went <b>global instead of broad</b> (China, Brazil, Mexico). No US overlap — the "what if Lyft had expanded" counterfactual.'],
    ['Grab','SE Asia\'s <b>everything-app</b> (rides + food + payments). The super-app path Lyft <b>rejected</b> to stay focused.'],
    ['Bolt','Europe/Africa mobility + scooters. The <b>one place Lyft now competes head-to-head</b> — via FreeNow, as a sub-scale entrant against an incumbent.'],
  ];
  h+='<div class="lpr-grid">'+cards.map(function(p){ return '<div class="lpr-c"><div class="lpr-n">'+esc(p[0])+'</div><div class="lpr-d">'+p[1]+'</div></div>'; }).join('')+'</div>';
  h+='<div class="lpr-adj"><b>Adjacent fronts</b> (not ride-hailing rivals, but in Lyft\'s orbit): <b>Waymo</b> — AV, a threat <i>and</i> a partner (its robotaxis run on the Lyft network) · <b>DoorDash</b> — delivery, now a <b>partner</b> sending high-frequency riders Lyft\'s way.</div>';
  return h;
}
// ─── Pane: Overview ───────────────────────────────────────────────────────────
function overviewBody(c){
  var h = '';
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-live" id="lyLive" hidden></div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  h += '<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross Bookings <span>($B, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="lyChartGB"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA <span>($M, FY · light = estimate)</span></div><div class="ov-chart-wrap"><canvas id="lyChartEbitda"></canvas></div></div>'+
  '</div>';
  h += sec('How Lyft Makes Money — follow a single ride',
    '<p class="ov-lede" style="margin:0 0 14px">A rideshare trip, end to end — <b>tap any step</b> for the driver-pay split and payout timing.</p>'+
    chain(RIDE_FLOW,'ride')+
    '<div class="ov-sec-h ovt-store-h" style="margin-top:20px">Where each $ of a ride goes <span class="ave-subh-note">(Q1 2026, per ride ≈ $20.88)</span></div>'+
    mbars(RIDE_SPLIT)+
    '<div class="ov-fynote">Revenue is reported <b>net of driver pay</b>, so the marketplace split is driver pay (~67%) + cost of revenue (~17%, mostly insurance) + Lyft gross profit (~16%). The margin story is the middle slice shrinking.</div>');
  h += sec('Where the Revenue Actually Comes From', revComposition());
  // History with modal detail on milestones.
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t, i){
    var more = t.d ? '<div class="ov-tl-more">Read more →</div>' : '';
    var cls = t.d ? ' ov-clickable' : '';
    var attr = t.d ? ' data-detail="hist:'+i+'"' : '';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>');
  h += sec('M&A — Terms & What Each Deal Added',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Lyft\'s deals cluster around <b>bikeshare</b> (Motivate, PBSC), the <b>ads</b> seed (Halo), <b>driver rentals</b> (Flexdrive) and now <b>Europe</b> (FreeNow). Tap any card.</div>'+
    mnaCards(MNA)+
    '<div class="ov-diagram-cap" style="margin-top:12px">'+MNA_NOTE+'</div>');
  h += sec('Where Lyft Sits — the competitive map', peerPositioning());
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
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
      '<div class="mem-perk">5% off Standard, Extra Comfort &amp; XL</div>'+
      '<div class="mem-perk">Up to 3 cancel-fee credits / month</div>'+
      '<div class="mem-perk">Waived Lost &amp; Found fees</div>'+
      '<div class="mem-perk">1 free bike/scooter unlock / mo (12 / yr on annual)</div></div>'+
    '<div class="mem-t hl"><div class="mem-t-n">Lyft Pink All Access</div><div class="mem-price">$199<small>/yr</small></div>'+
      '<div class="mem-perk"><b>Everything in Pink, plus:</b></div>'+
      '<div class="mem-perk">+10% off Black &amp; Black SUV</div>'+
      '<div class="mem-perk">Unlimited 45-min classic bike rides</div>'+
      '<div class="mem-perk">Unlimited ebike &amp; scooter unlocks</div>'+
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
function strategyBody(c){
  var h = '';
  h += '<p class="ov-lede">Under CEO David Risher, Lyft\'s thesis shifted from chasing rides to <b>profitable growth</b>: tilt the mix toward higher-value trips, let insurance-cost reform lift margin, and add asset-light optionality (AV, advertising, Europe) — while defending the core marketplace on price and reliability.</p>';
  h += sec('2027 Targets — First Investor Day (June 6, 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){
      return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>';
    }).join('')+'</div>');
  h += sec('Strategic Initiatives',
    '<div class="ov-diagram-cap" style="margin:0 0 12px"><b>Tap any card</b> for the full detail.</div>'+
    '<div class="ov-drivers">'+INITIATIVES.map(function(d){
      return '<div class="ov-driver ov-clickable" data-detail="init:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>';
    }).join('')+'</div>');
  h += sec('Membership & Loyalty — Lyft Pink, Price Lock & Partners', membershipViz());
  h += sec('Who Powers Lyft \u2014 the supplier & customer ecosystem',
    supplySection());
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
    '<div class="ov-callout"><div class="ov-tl-body"><b>Ride-count growth is slowing</b> — Q1 2026 rides <b>+8.5% YoY</b> vs <b>+14%</b> for FY2025. Two readings decide the thesis: <b>(1) cyclical</b> — mature-metro saturation + ~3M rides lost to weather in Q1, with guided re-acceleration in Q2; <b>(2) deliberate</b> — Lyft is tilting to higher-value rides (+35–50%) and declined to chase every marginal ride in a promotional Q4. Either way, the frequency drag means the <b>~15% bookings CAGR leans hard on continued rider acquisition + richer mix</b>. If acquisition slows <i>and</i> mix tops out, the target gets difficult — the single most contestable point in the growth story.</div></div>');
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
  h+='<div class="sf-intro">Insurance is <b>expensed on the P&amp;L</b> the moment a ride happens — but the cash for claims is paid out <b>over years</b>. That timing gap builds a <b>reserve liability</b> on the balance sheet, and the gap itself is the <b>float</b> that runs through cash flow. Same plumbing — toggle to see how it read then vs now:</div>';
  h+='<div class="sf-tog"><button type="button" class="sf-pill active" data-sf="before">2021–22 · crutch</button><button type="button" class="sf-pill" data-sf="now">2025–26 · tailwind</button></div>';
  h+='<div class="sf-flow">'+box('P&amp;L','Income statement','Insurance sits inside <b>Cost of Revenue</b>','pnl','sf-pnl')+arr+box('B / S','Balance sheet','<b>Insurance reserves</b> ~$2.2B + trust investments','bs','sf-bs')+arr+box('C / F','Cash flow','<b>Δ reserves + investment income</b> = the float','cf','sf-cf')+'</div>';
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
  h+='<p class="ov-lede">Revenue is reported <b>net of driver pay</b>, so the number that matters is <b>gross profit per ride</b> — and the whole 2025–26 story is one <b>shrinking slice: insurance</b>.</p>';
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
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="lyUEdecomp"></canvas></div>';
  h+='<div class="ov-foot">The middle slice (cost of revenue, mostly insurance) shrinks while the pink slice (gross profit) grows — that IS the margin story, in one picture. Source: Summit DCF actuals, snapshot 2026-05-13.</div>';
  h+='<div class="ov-sec-h ovt-store-h">Take rate — and why it misleads</div>';
  h+='<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyUEtake"></canvas></div>';
  h+='<div class="ov-callout ov-clickable" data-detail="lnote:take"><div class="ov-tl-body">The line drifted ~36% → ~33% — but Lyft is <b>not</b> taking a smaller cut. Its real take is ~<b>30%</b> (the 70% driver floor caps it); the wobble is an <b>accounting artifact</b> (a gross-up move + Lyft Media). Watch gross profit per ride, not this line. <span class="gm-tap">Tap for the year-by-year ›</span></div></div>';
  h+=sec('Insurance — from crisis to margin unlock',
    '<div class="insarc">'+
      '<div class="insarc-p insarc-red"><div class="insarc-y">2021–22</div><div class="insarc-l">CRUTCH</div><div class="insarc-d">Reserves ballooning, margins underwater — insurance nearly broke the model.</div></div>'+
      '<div class="insarc-p insarc-amber"><div class="insarc-y">2022–24</div><div class="insarc-l">HEADWIND</div><div class="insarc-d">The largest cost-of-revenue slice; rising claim severity squeezed gross profit.</div></div>'+
      '<div class="insarc-p insarc-green"><div class="insarc-y">2025–26</div><div class="insarc-l">TAILWIND</div><div class="insarc-d">SB 371 + a captive insurer + selling off old liabilities cut cost per ride → the unlock.</div></div>'+
    '</div>'+
    '<div class="ov-subh" style="margin-top:18px">How it flows through the P&amp;L, balance sheet &amp; cash flow</div>'+stmtFlow()+'<div style="font-size:12px;color:var(--mu);margin:16px 0 8px">And how the captive (PVIC) actually works — <b>tap any step</b>:</div>'+
    chain(PVIC_CHAIN,'pvic')+
    '<div class="ov-subh" style="margin-top:16px">Legacy-risk transfers (loss portfolio transfers)</div>'+
    '<table class="ov-table"><thead><tr><th>Date</th><th>Counterparty</th><th>What was transferred</th></tr></thead><tbody>'+
    RISK_XFER.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td class="ov-td-name">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>');
  h+=sec('The Q4 2025 → Q1 2026 cost drop', '<div class="ov-callout ov-clickable" data-detail="lnote:cogs"><div class="ov-tl-body">Cost of revenue fell ~<b>$108M</b> in a single quarter (bookings still +19%) — <b>structural</b>, from SB 371 cutting mandated insurance coverage. <b>Not</b> a reserve release (reserves actually rose). <span class="gm-tap">Tap for the breakdown ›</span></div></div>');
  h+=sec('Is the margin jump durable?',
    '<div class="gm-v"><div class="gm-num"><b>47.6%</b> Q1 2026 gross margin <span class="gm-up">+710 bps YoY</span></div>'+
    '<div class="gm-track"><div class="gm-marker" style="left:66%"></div></div>'+
    '<div class="gm-ends"><span>one-time / flattered</span><span>durable / structural</span></div>'+
    '<div class="gm-line"><b>Verdict: mostly structural.</b> SB 371 + program execution are real and recur — but the <b>+710 bps headline is flattered by a soft Q1 2025 base</b>, and Adj. EBITDA margin barely moved. Trust the direction, not yet the magnitude.</div></div>');
  h+=sec('Regulation & Driver Classification',
    '<style>.lreg-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:2px}.lreg-c{border:1px solid var(--bdr);border-radius:10px;padding:11px 13px;background:var(--w);cursor:pointer;transition:border-color .12s}.lreg-c:hover{border-color:var(--brand)}.lreg-hd{font-size:12.5px;font-weight:800;color:var(--navy);display:flex;justify-content:space-between;align-items:center;gap:8px}.lreg-chip{font-size:9px;font-weight:800;letter-spacing:.03em;border-radius:10px;padding:2px 8px;flex:none;white-space:nowrap}.lreg-g{background:rgba(30,158,98,0.12);color:#1E9E62}.lreg-a{background:rgba(184,134,11,0.14);color:#B8860B}.lreg-t{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:5px}@media(max-width:720px){.lreg-grid{grid-template-columns:1fr}}</style>'+
    '<div class="ov-diagram-cap" style="margin:0 0 10px"><b>One question underneath all of it: do drivers stay contractors?</b> The whole unit economics rests on "yes" — and it is largely settled. Lyft is US-concentrated, so US rules hit it harder than its global peer. <b>Tap any card.</b></div>'+
    '<div class="lreg-grid">'+REG.map(function(r,i){ return '<div class="lreg-c ov-clickable" data-detail="lreg:'+i+'"><div class="lreg-hd">'+esc(r.h)+'<span class="lreg-chip lreg-'+r.cls+'">'+esc(r.chip)+'</span></div><div class="lreg-t">'+r.teaser+' <span style="color:var(--brand);font-weight:700">tap ›</span></div></div>'; }).join('')+'</div>');
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

// ─── Top-level shell ──────────────────────────────────────────────────────────
function html(c){
  var h = '<div class="ov ov-lyft" data-brand="LYFT">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="strategy">Strategy</button>'+
    '<button type="button" class="ovt-tab" data-ovt="growth">Rides &amp; Riders</button>'+
    '<button type="button" class="ovt-tab" data-ovt="unit">Unit Economics</button>'+
    '<button type="button" class="ovt-tab" data-ovt="model">Model vs. Reality</button>'+
    '<button type="button" class="ovt-tab" data-ovt="calls">Earnings Narrative</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="strategy" hidden>'+strategyBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="growth" hidden>'+growthBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="unit" hidden>'+unitBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="model" hidden>'+modelBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="calls" hidden>'+callsBody()+'</div>';
  // Modal scaffold (shared overview.css). Hidden until a milestone is tapped.
  h += '<div class="ov-modal-back" id="lyModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="lyModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="lyModalT"></div><div class="ov-modal-b" id="lyModalB"></div></div></div>';
  h += '</div>';
  return h;
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

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt')!==key); });
  if (key==='overview') requestAnimationFrame(buildOverviewCharts);
  if (key==='growth')   requestAnimationFrame(buildGrowthTab);
  if (key==='unit')     requestAnimationFrame(buildUnitTab);
  if (key==='model')    requestAnimationFrame(buildModelTab);
}

// ─── Modal (milestone detail) ─────────────────────────────────────────────────
function wireModal(root){
  var back=root.querySelector('#lyModalBack'), mT=root.querySelector('#lyModalT'), mB=root.querySelector('#lyModalB');
  if (!back) return;
  function onEsc(e){ if (e.key==='Escape') closeM(); }
  function openM(title, bodyHtml){ mT.innerHTML=title; mB.innerHTML=bodyHtml;
    back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#lyModalX').onclick = closeM;
  back.onclick = function(e){ if (e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if (kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if (kind==='ride'){ var s=RIDE_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    if (kind==='pvic'){ var v=PVIC_CHAIN[+id]; return v?{t:'Insurance — '+v.t,h:v.d}:null; }
    if (kind==='init'){ var d=INITIATIVES.filter(function(x){return x.k===id;})[0]; return d?{t:d.t,h:d.d}:null; }
    if (kind==='lreg'){ var rg=REG[+id]; return rg?{t:rg.h,h:rg.d}:null; }
    if (kind==='lnote'&&id==='take'){ return {t:'The take-rate line — accounting, not economics',h:TAKE_EXPL}; }
    if (kind==='lnote'&&id==='cogs'){ return {t:'The Q4 → Q1 cost-of-revenue drop',h:COGS_NOTE}; }
    if (kind==='lnote'&&id==='gm'){ return {t:'Gross margin — structural or one-time?',h:'<div class="ov-wind-h">The structural case</div>'+bullets(GM_STRUCT)+'<div class="ov-wind-h" style="margin-top:14px">Reasons for caution</div>'+bullets(GM_CAUTION)}; }
    if (kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m?{t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>',h:m.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor='pointer';
    el.onclick = function(){ var d=resolve(el.getAttribute('data-detail')); if (d) openM(d.t, d.h); };
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
  var root = document.querySelector('.ov-lyft');
  if (!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
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
  root.querySelectorAll('#lyCallsAcc .lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  var active = root.querySelector('.ovt-tab.active');
  showOvt(root, active ? active.getAttribute('data-ovt') : 'overview');
}

export var lyftOverview = { html: html, init: init };
