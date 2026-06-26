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
  '<b>Insurance reform:</b> California SB 371 (eff. Jan 2026) cut mandated coverage — lowering insurance cost per ride in Lyft\'s largest market and lifting gross margin.',
  '<b>Mix shift to higher-value rides</b> (airport, longer trips, premium modes) growing 35–50% YoY — more profit per ride.',
  '<b>Asset-light AV partnerships</b> add supply and optionality without the capital of owning a fleet.',
  '<b>FreeNow</b> opens European markets — a step-change in addressable market.',
  '<b>Prop 22 upheld</b> (Cal. Supreme Court, July 2024) de-risks the contractor model in California.',
  'Free-cash-flow inflection (>$1B) funds buybacks ($500M authorized).',
];
var HEADWINDS = [
  '<b>Robotaxi disruption</b> (Waymo) could pressure pricing and driver supply in core urban markets.',
  '<b>Insurance severity</b> remains volatile — reserves grew +28% to $2.18B in FY2025; the recent per-ride relief may not be fully durable.',
  '<b>Ride-volume growth is decelerating</b> in mature metros (S-curve saturation) — the headline growth optics are softening.',
  'Uber\'s scale and global super-app economics; persistent price competition.',
  '<b>Driver-pay floors</b> (NYC, Seattle, Minnesota, Massachusetts) raise cost even where contractor status holds.',
  'More US-concentrated than Uber; FreeNow integration (Europe) adds near-term drag and EU gig-regulation exposure.',
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
  ['Why this matters more for Lyft', 'Lyft is ~<b>US-concentrated</b> (FreeNow aside), so US driver rules hit it harder than its global peer. The good news: the <b>existential</b> question (employee reclassification) is largely contained; what remains is <b>cost</b> (pay floors) and a <b>new unionization</b> vector.'],
  ['California — existential risk contained', 'AB5 (2020) threatened to make drivers employees. <b>Prop 22</b> (Nov 2020) carved them out as contractors with a pay floor; the <b>California Supreme Court upheld it unanimously in July 2024</b> (<i>Castellanos</i>). The state legal challenge is exhausted — and <b>SB 371</b> (Jan 2026) even cut insurance-coverage mandates, a cost tailwind.'],
  ['Massachusetts — cost + a union first', 'A June 2024 AG settlement keeps drivers as contractors but adds a <b>$32.50/hr engaged-time floor</b> + benefits (companies paid <b>$175M</b>). Ballot <b>Question 3 passed (Nov 2024)</b> giving drivers the right to unionize — and in <b>May 2026 the App Drivers Union was certified</b>, the first US rideshare union. First-contract bargaining is the new watch item.'],
  ['Minnesota / NYC / Seattle — pay floors', '<b>Minnesota</b> (statewide, eff. Dec 2024): <b>$1.28/mi + $0.31/min</b> engaged, $5 min/ride. <b>NYC</b> TLC: per-trip minimum raised <b>+5% (Aug 2025)</b> with new <b>lockout protections</b> (72-hr notice, $500/violation). <b>Seattle/WA</b> (HB 2076): <b>$0.70/min + $1.63/mile</b>, $6.12 min in Seattle (Jan 2026) + sick leave & deactivation protections. All keep contractor status but raise cost.'],
  ['Federal — receding (a tailwind, not yet operative)', 'The 2024 Biden-era DOL independent-contractor rule is technically on the books but <b>unenforced since May 2025</b>, and the DOL <b>proposed rescinding it (Feb 2026)</b> toward a business-favorable two-factor test. FLSA classification doesn\'t preempt state ABC tests/wage floors, so it caps — not removes — risk.'],
  ['Europe — new exposure via FreeNow', 'The <b>EU Platform Work Directive</b> (transpose by Dec 2026) creates a rebuttable employment presumption; the UK already treats drivers as "workers" (<i>Aslam</i>). New exposure now that Lyft owns FreeNow.'],
  ['How Lyft frames it', 'The 10-K says reclassification could force it to "significantly alter" its model or exit jurisdictions — but states the possible loss <b>"cannot be reasonably estimated."</b> No dollar figure is disclosed.'],
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
  h += sec('Products & Segments', SEGMENTS.map(function(s){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+s[1]+'</div></div>';
  }).join(''));
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
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they are</th><th>Where share moves · the structural edge</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+p[1]+'</td><td>'+p[2]+'</td></tr>';}).join('')+
    '</tbody></table>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>');
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>');
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Strategy ───────────────────────────────────────────────────────────
function strategyBody(c){
  var h = '';
  h += '<p class="ov-lede">Under CEO David Risher, Lyft\'s thesis shifted from chasing rides to <b>profitable growth</b>: tilt the mix toward higher-value trips, let insurance-cost reform lift margin, and add asset-light optionality (AV, advertising, Europe) — while defending the core marketplace on price and reliability.</p>';
  h += sec('2027 Targets — First Investor Day (June 6, 2024)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){
      return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:14px"><div class="ov-tl-body"><b>Analyst note — a quiet reaffirmation.</b> On the Q1 2026 call (May 2026), management did <i>not</i> give the 2027 targets a dedicated walk-through. The only confirmation came as Risher\'s closing line, after Q&A had ended: <i>"…as we continue to track towards our 2027 targets."</i> A soft "tracking toward," not an emphatic, itemized reaffirmation — worth watching as a conviction signal.</div></div>');
  h += sec('The Higher-Ticket Tradeoff',
    bullets([
      '<b>Mix over volume:</b> high-value modes (airport, longer trips, premium, Price Lock) grew ~<b>50% YoY in Q4\'25</b> and ~<b>35% YoY in Q1\'26</b> — well ahead of total rides. More bookings and profit per ride.',
      '<b>Partnership rides hit a record 27% of total</b> — United (more business riders, higher bookings/ride) and DoorDash (higher frequency) skew the mix upward.',
      '<b>Headline ride growth is decelerating</b> — Q1\'26 rides +8.5% YoY vs +14% for FY2025. Management frames this as <b>S-curve saturation in mature metros</b> plus weather (~3M rides lost to weather in Q1\'26), and guides to <b>re-acceleration in Q2\'26</b>.',
    ])+
    '<div class="ov-fynote"><b>The nuance:</b> the upmarket tilt is clearly intentional. But management frames the <i>ride-count slowdown</i> as cyclical/structural (mature-metro saturation, weather), not as a deliberate "profit-over-volume" sacrifice. Whether decelerating volume is a chosen tradeoff or an industry reality is the most contestable point in the thesis.</div>');
  h += sec('Strategic Initiatives',
    '<div class="ov-diagram-cap" style="margin:0 0 12px"><b>Tap any card</b> for the full detail.</div>'+
    '<div class="ov-drivers">'+INITIATIVES.map(function(d){
      return '<div class="ov-driver ov-clickable" data-detail="init:'+esc(d.k)+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>';
    }).join('')+'</div>');
  return h;
}

// ─── Pane: Rides & Riders ─────────────────────────────────────────────────────
function growthBody(c){
  var h = '';
  h += '<div class="ovs-loan">'+
    '<div class="ov-chart-t">Annual Rides <span>(millions · light bars = estimate · pink = YoY growth)</span></div>'+
    rangeSlider('rides', YEARS.length-1, YEARS[0], YEARS[YEARS.length-1])+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="lyChartRides"></canvas></div>'+
  '</div>';
  h += '<div class="ovs-loan">'+
    '<div class="ov-chart-t">Active Riders <span>(millions · light bars = estimate · pink = YoY growth)</span></div>'+
    rangeSlider('riders', YEARS.length-1, YEARS[0], YEARS[YEARS.length-1])+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="lyChartRiders"></canvas></div>'+
  '</div>';
  return h;
}

// ─── Pane: Unit Economics & Insurance ─────────────────────────────────────────
function unitBody(c){
  var i0 = UE_Q.length - 1, i1 = UE_Q.indexOf('1Q25');
  function prTile(l, v, sub, dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
  var h = '';
  h += '<p class="ov-lede">What happens inside a single Lyft ride. Revenue is reported <b>net of driver pay</b>, so each $ of <b>Gross Bookings</b> splits into <b>driver pay</b>, <b>cost of revenue</b> (mostly insurance + processing) and <b>Lyft\'s gross profit</b>. The story of 2025–26 is a <b>falling insurance cost per ride</b> widening the gross-profit slice.</p>';
  // Per-ride KPI tiles (Q1'26 vs Q1'25)
  h += '<div class="ov-kpis">'+
    prTile('Bookings / ride', usd2(PR_GB[i0]), pctStr((PR_GB[i0]/PR_GB[i1]-1)*100)+' YoY', 'up')+
    prTile('Revenue / ride (net)', usd2(PR_REV[i0]), pctStr((PR_REV[i0]/PR_REV[i1]-1)*100)+' YoY', 'up')+
    prTile('Cost of rev / ride', usd2(PR_COR[i0]), pctStr((PR_COR[i0]/PR_COR[i1]-1)*100)+' YoY', 'up')+   // lower is good
    prTile('Gross profit / ride', usd2(PR_GP[i0]), pctStr((PR_GP[i0]/PR_GP[i1]-1)*100)+' YoY', 'up')+
  '</div>';
  h += '<div class="ov-asof">Q1 2026 vs Q1 2025. Cost of revenue per ride <b>fell</b> even as bookings per ride rose — the unit-economics signature of cheaper insurance. (Lower cost/ride is favorable.)</div>';
  // Decomposition chart
  h += '<div class="tech-leg" style="margin-top:8px">'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+GRAY+'"></span>Driver pay</span>'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+EST_FILL+'"></span>Cost of revenue (insurance + processing)</span>'+
    '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+BRAND+'"></span>Lyft gross profit</span>'+
  '</div>';
  h += '<div class="ov-chart-t">Where each $ of a ride goes <span>($ per ride, by quarter · label = gross profit / ride)</span></div>';
  h += '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="lyUEdecomp"></canvas></div>';
  h += '<div class="ov-foot">Gross Bookings per ride decomposed into driver pay (Gross Bookings − Revenue), cost of revenue and gross profit, all ÷ rides. Source: Summit DCF actuals (snapshot 2026-05-13).</div>';
  // Take rate line
  h += '<div class="ov-sec-h ovt-store-h">Take Rate — Revenue ÷ Gross Bookings</div>';
  h += '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="lyUEtake"></canvas></div>';
  h += '<div class="ov-fynote">Take rate has drifted from ~36% (2024) toward ~33% — but the line is <b>not</b> what it looks like. The margin story is a <b>lower cost per ride</b> (insurance), not a higher take rate.</div>';
  h += sec('Why the take-rate line zig-zags (and why it\'s misleading)', '<div class="ov-callout"><div class="ov-tl-body">'+TAKE_EXPL+'</div></div>');
  // Cost of revenue drop
  h += sec('The Q4\'25 → Q1\'26 Cost-of-Revenue Drop', '<div class="ov-callout"><div class="ov-tl-body">'+COGS_NOTE+'</div></div>');
  // Insurance model — captive (PVIC) cycle as a step chain
  h += sec('The Insurance Model — the captive (PVIC) cycle',
    '<p class="ov-lede" style="margin:0 0 14px">Auto insurance is Lyft\'s single largest cost-of-revenue component, and it runs a <b>captive insurer</b> to capture the economics. <b>Tap any step.</b></p>'+
    chain(PVIC_CHAIN,'pvic')+
    '<div class="ov-subh" style="margin-top:16px">Legacy-risk transfers (loss portfolio transfers)</div>'+
    '<table class="ov-table"><thead><tr><th>Date</th><th>Counterparty</th><th>What was transferred</th></tr></thead><tbody>'+
    RISK_XFER.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td class="ov-td-name">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>');
  // Gross margin debate
  h += sec('Gross Margin — Structural or One-Time?',
    '<p class="ov-lede" style="margin-bottom:14px">Q1 2026 gross margin jumped to <b>47.6%</b> (+~710 bps YoY). The key question: is the insurance-driven lift <b>durable</b>, or flattered by an easy comparison?</p>'+
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">The structural case</div>'+bullets(GM_STRUCT)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Reasons for caution</div>'+bullets(GM_CAUTION)+'</div>'+
    '</div>'+
    '<div class="ov-fynote"><b>Net read:</b> the per-ride insurance improvement looks largely structural (SB 371 + program execution; renewals don\'t hit in Q1), but the <b>+710 bps headline is amplified by a soft Q1 2025 base</b> that included a prior-year benefit, and Adj. EBITDA margin barely moved. Treat the magnitude — not the direction — with caution until a couple more quarters confirm it.</div>');
  // Regulatory
  h += sec('Regulation & Driver Classification', rows(REG));
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
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
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="strategy" hidden>'+strategyBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="growth" hidden>'+growthBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="unit" hidden>'+unitBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="model" hidden>'+modelBody(c)+'</div>';
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
  wireModal(root);
  var active = root.querySelector('.ovt-tab.active');
  showOvt(root, active ? active.getAttribute('data-ovt') : 'overview');
}

export var lyftOverview = { html: html, init: init };
