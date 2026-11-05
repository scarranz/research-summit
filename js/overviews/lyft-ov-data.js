// overviews/lyft-ov-data.js — Lyft's Overview data that is not code. Peer DENOMINATORS only (rule 10): market cap, price and EV are
// live (api.liveQuote); multiples are computed in the browser. EPS in US$, EBITDA and net debt in US$ M, growth in %.
// nd = net debt (negative = net cash), used only when Massive returns no EV.
export var LY_PEER_DATA=[
  { tk:'LYFT', n:'Lyft', hl:true, epsT:6.81, epsF:0.52, ebitdaT:-53, ebitdaF:702, nd:-79, gt:9.2, gf:16.6,
    src:'10-K FY2025 (acc. 0001628280-26-006960): GAAP EPS 6.81 (incl. $2.9B tax-allowance release), trailing EBITDA = operating loss (188.4) + D&A 135.2; forward: Bloomberg consensus FY2026 (EPS 0.52, adj. EBITDA 701.7, revenue 7,366.4), snapshot 2026-11-04',
    why:'Ride-hailing network in the U.S. and Canada, now also in Europe through Freenow; the profile company.' },
  { tk:'UBER', n:'Uber', epsT:2.45, epsF:null, epsFNote:'no forward P/E — Street EPS is GAAP', ebitdaT:6284, ebitdaF:11401, nd:3416, gt:18.3, gf:11.1,
    src:'10-K FY2025 (acc. 0001543151-26-000015); EPS = Non-GAAP (4Q25 release); forward EBITDA: Bloomberg consensus FY2026, snapshot 2026-11-03; forward growth carried from uber-ov-data.js (BBG 2026-09-10)',
    why:'Main ride-hailing rival in the U.S., Canada and Europe; also delivery and freight.' },
  { tk:'DASH', n:'DoorDash', epsT:2.13, epsF:null, ebitdaT:1470, ebitdaF:null, nd:-1654, gt:27.9, gf:null,
    src:'10-K FY2025 (acc. 0001792789-26-000013), figures as in uber-ov-data.js',
    why:'Largest US food-delivery marketplace; Lyft’s largest U.S. partner, whose DoorDash-linked rides grew nearly 60% year over year in 2Q26.' },
  { tk:'GRAB', n:'Grab', epsT:0.06, epsF:null, ebitdaT:242, ebitdaF:null, nd:-1380, gt:20.5, gf:null,
    src:'FY2025 results release (6-K acc. 0001855612-26-000012, EX-99.1; IFRS, US$): diluted EPS 0.06, operating profit 65 + D&A 177, revenue 3,370 vs 2,797; net cash = cash 3,433 less loans and borrowings 2,053 (excludes $4.4B of other investments). 20-F acc. 0001855612-26-000020 cross-checked on revenue and Adjusted EBITDA (500) only',
    why:'Southeast Asian super-app (rides, delivery, financial services); an international ride-hailing comparable.' },
];
