# LYFT — datos del Overview anterior, archivados (2026-11-05)

Constantes de `js/overviews/lyft.js` que ya no tenía ninguna referencia (el Overview vive ahora en `lyft-ov-data.js`; Supply Chain usa sus propias listas). Se conservan aquí por la regla 1 del playbook (no se borra contenido). El código muerto (funciones de Earnings/Notes viejas, `CALL_EARNINGS`, `LY_THEMES`, `CE_CONS`…) está en el historial de git, commit `77f2a89` y anteriores; sus datos viven en `lyft-ce-data.js` (`LY_CALL_EARNINGS_V1`), `themes-data/lyft.js` y `LYFT_CE_CONS_GEN`.

```js
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
var PEERS = [
  ['Uber', 'Global super-app — rides + delivery + ads + freight; ~3–4× Lyft\'s US rides and structurally more profitable.', 'Uber holds ~70%+ of US rides; Lyft ~24–29%. Same ~30% take, so the gap is <b>scale and cross-sell</b>, not pricing. Lyft\'s counter: price/reliability parity, driver experience, and a tighter US focus. It cannot match Uber\'s Eats-funded CAC.'],
  ['Waymo (Lyft)', 'Robotaxi operator, live in several US cities.', 'Threat <i>and</i> partner — Lyft hosts third-party AV fleets (Waymo→Nashville) on its network rather than building its own. Same asset-light hybrid bet as Uber, but Lyft has less demand density to offer fleets.'],
  ['DoorDash', 'US delivery leader.', 'Adjacent, not head-to-head — now a <b>partner</b>. DoorDash users are high-frequency Lyft riders; the partnership skews Lyft\'s mix toward higher-value trips.'],
  ['Bolt / FreeNow', 'European mobility apps.', 'Lyft now competes here <b>directly</b> via FreeNow (Jul 2025) — but as a new, sub-scale entrant against incumbents, with EU gig-regulation exposure it didn\'t have before.'],
];
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
// Block 4 — How it makes money. Lyft is a SINGLE reportable segment, so there is no segment split
// to toggle. Show revenue-by-line (2 slices) + a compact key-metrics row + qualitative "What is X?"
// accordions. Geography OMITTED (US/Canada; substantially all revenue US-based; no country split).
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
var A_REV    = [4095.1, 4403.6, 5786.0, 6316.3, 7372.7, 8219.3, 8844.8, 9434.9];```
