// overviews/lyft-ov-data.js — Lyft's Overview data that is not code (OV-1 … OV-F, playbook section 8). Market cap, prices and
// peer multiples are NEVER here: they are live (api.liveQuote). Peer DENOMINATORS: see LY_PEER_DATA below.
// Sources: FY2025 Form 10-K (SEC EDGAR, acc. 0001628280-26-006960), FY2023 Form 10-K, the 2Q26 prepared remarks and company IR.

export var LY_FACTS=[
  ['Listing','NASDAQ: LYFT'],
  ['HQ','San Francisco, California, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2012 (incorporated 2007 as Bounder Web)'],
  ['IPO','Mar 2019 · NASDAQ'],
  ['CEO','David Risher · board since 2021 · CEO since Q2 2023'],
  ['Employees','3,913 · Dec 2025'],
  ['Dividend','Non-payer · never paid one'],
  ['Market cap','loading live quote…'],
];

export var LY_LEDE='Lyft operates a global mobility platform built around a ridesharing marketplace that connects independent drivers with riders, alongside taxis, private hire, executive chauffeur services, car sharing, bikes and scooters. It earns service fees and commissions from drivers, with smaller streams from vehicle rentals, bikeshare, advertising, data licensing and Lyft Business. The 2025 acquisitions of Freenow and TBR extended a North American business into Europe and worldwide chauffeur services.';

export var LY_BIZ=[
  ['What it sells','On-demand rides through the Lyft app, from standard rideshare to premium, taxi and chauffeur options, plus shared bikes and scooters and vehicle rentals for drivers (Express Drive).'],
  ['Who buys it','Riders paying per trip; drivers paying service fees and commissions to use the marketplace; organizations buying rides through Lyft Business; cities and advertisers in smaller lines.'],
  ['How it earns','FY2025 revenue $6.32B: ~93% from the ridesharing marketplace and other contract revenue, ~7% from rentals (Flexdrive, bikes and scooters). Advertising is not a significant line.'],
  ['The edge','A scaled two-sided network in the U.S. and Canada, where Uber is the main rival, now extended into European taxi and global chauffeur markets through Freenow and TBR.'],
];

export var LY_GMM_SEG=[
  ['Marketplace & other contracts', 93.3, '$5.90B', '93%', null],
  ['Rentals', 6.7, '$0.42B', '7%', null],
];

export var LY_GMM_GEO=[
  ['United States', 95.9, '$6.06B', '96%', null],
  ['International', 4.1, '$0.26B', '4%', null],
];

export var LY_MM_CAP_TOP='FY2025 revenue <b>$6.32B (+9%)</b> on <b>$18.51B of gross bookings (+15%)</b> — the same total two ways: by <b>revenue line</b> or by <b>region</b>. Lyft reports a single operating segment, so the lines are accounting categories. Both reconcile to the reported figure.';

export var LY_MM_CAP_END='Lyft reports <b>one operating segment</b>. FY2025 loss from operations was <b>$(188)M</b> and net income <b>$2.84B</b>: a <b>$2.90B tax benefit</b> from releasing the valuation allowance outweighed a pre-tax loss of $(53)M. <span class="ave-subh-note">Source: Lyft FY2025 Form 10-K — revenue note (disaggregation and geography), consolidated statements of operations, MD&amp;A key metrics. Region follows where the transaction occurred or where the contracting entity sits.</span>';

export var LY_REV_DEFS=[
  { seg:'Marketplace & other contracts (the core)',
    desc:'The ridesharing marketplace that connects riders with independent drivers. Lyft collects service fees and commissions from drivers for using it, and runs pricing, payments and safety. Smaller streams sit in the same line: licensing and data access, bike sales and station software, advertising and Lyft Business.',
    econ:[['FY2025 revenue','$5.90B (+10%)'],['Share of revenue','93%'],['Gross bookings (company-wide)','$18.51B (+15%)'],['Context','Advertising is not a significant part of revenue (10-K)']] },
  { seg:'Rentals (vehicles, bikes and scooters)',
    desc:'Revenue from renting an identified asset: vehicles to drivers through Express Drive (Flexdrive) and the network of shared bikes and scooters. It is recognised as lease revenue rather than as marketplace fees.',
    econ:[['FY2025 revenue','$0.42B (flat)'],['Share of revenue','7%'],['Context','The 10-K reports rentals as one line']] },
];

export var LY_PRODUCTS=[
  { ic:'🚗', fam:'Everyday rides', d:'Standard, saver and fast-pickup modes.', items:[
    ['Standard rideshare','The core on-demand ride: a rider requests a trip and an independent driver nearby accepts it.'],
    ['Wait & Save','A lower price for riders who are not in a hurry; the 10-K calls it a substantial portion of rides.'],
    ['Priority Pickup','A faster driver match for riders who will pay for it.'] ]},
  { ic:'✨', fam:'Premium & larger', d:'Bigger vehicles and higher-end rides.', items:[
    ['XL and XXL','Larger vehicles for groups and luggage; XXL is a recent addition, expanding to new markets.'],
    ['Extra Comfort','Roomier, newer cars for a more comfortable ride.'],
    ['Black and Black SUV','Premium rides with professional drivers in higher-end vehicles.'] ]},
  { ic:'📅', fam:'Plan ahead & lock', d:'Book ahead and cap the price.', items:[
    ['Scheduled rides','Book a ride in advance for a set pickup time, including airport trips.'],
    ['Price Lock','A subscription launched in 2024 that caps the price of regular and scheduled rides on a chosen route and pickup time.'] ]},
  { ic:'🚕', fam:'Taxi & chauffeur', d:'Taxis, private hire and chauffeurs.', items:[
    ['Freenow by Lyft','The European multimodal app with taxi at its core, acquired in July 2025; the Lyft brand is rolling out across it.'],
    ['Taxis in the Lyft app','Licensed taxi drivers matched through the app, in partnership with Curb in Los Angeles, San Francisco and New York City.'],
    ['TBR Global Chauffeuring','A global luxury chauffeur company acquired in October 2025; select Lyft drivers with commercial insurance and livery permits can apply to drive for it.'] ]},
  { ic:'🚲', fam:'Bikes & scooters', d:'City bikeshare systems.', items:[
    ['Citi Bike (New York City)','Lyft Urban Solutions operates it, with Divvy, Capital Bikeshare, Bluebikes, Lyft Bike and BIKETOWN: six of the largest U.S. bikeshare systems.'],
    ['Divvy (Chicago)','Chicago’s bikeshare system.'],
    ['Capital Bikeshare (Washington, D.C.)','Bikeshare in the capital.'],
    ['Bluebikes (Boston)','Boston’s bikeshare system.'],
    ['Lyft Bike (San Francisco Bay Area)','Rebranded from Bay Wheels in 2026, under a five-year contract extension with the regional transport agencies and cities.'],
    ['BIKETOWN (Portland)','Portland’s bikeshare system.'] ]},
  { ic:'💼', fam:'Business & programs', d:'Organizations, teens and seniors.', items:[
    ['Lyft Business','Makes the marketplace available to organizations.'],
    ['Lyft Silver','A feature set for older adults, with strong user growth and higher frequency than the average rider.'],
    ['Lyft Teen','Rides for teens, launched in markets across the U.S.'] ]},
  { ic:'🚙', fam:'Express Drive', d:'Vehicle rentals for drivers.', items:[
    ['Express Drive','A car rental program for drivers who lack a qualifying vehicle; rentals come from the Flexdrive subsidiary and rental car partners.'] ]},
  { ic:'🤖', fam:'Autonomous (partners)', d:'Partner robotaxis on the Lyft network.', items:[
    ['Waymo in Nashville','Lyft took over fleet operations in June 2026, with a purpose-built depot due to open in October.'],
    ['Baidu Apollo Go in London','Lyft is testing the sixth-generation vehicles in the capital.'] ]},
];

export var LY_TIMELINE=[
  { y:'2007', t:'Incorporated in Delaware as <b>Bounder Web</b>; renamed <b>Zimride</b> in 2008.',
    d:'<ul class="ov-bullets"><li>The company is incorporated in 2007 as Bounder Web, Inc., a Delaware corporation.</li><li>In 2008 it changes its name to Zimride, Inc.</li><li>Zimride is the origin of the business Lyft runs today.</li></ul>' },
  { y:'2012', t:'<b>Lyft is founded</b>; renamed Lyft, Inc. in 2013 after the Zimride assets are sold.',
    d:'<ul class="ov-bullets"><li>The company founds Lyft in 2012.</li><li>In 2013 it changes its name to Lyft, Inc. when it sells the assets of its Zimride operations.</li></ul>' },
  { y:'Mar 2019', t:'<b>IPO</b> on Nasdaq at $72.00 a share; first day of trading is 29 March.',
    d:'<ul class="ov-bullets"><li>Lyft prices its initial public offering at $72.00 per share.</li><li>The shares close at $78.29 on March 29, 2019, the first day of trading.</li></ul>' },
  { y:'2021', t:'Sells its <b>Level 5</b> self-driving division; from here autonomy comes through partners.',
    d:'<ul class="ov-bullets"><li>Lyft sells its Level 5 self-driving vehicle division in 2021.</li><li>Since then it no longer develops its own AV technology.</li><li>It has to build and keep partnerships with AV developers to offer autonomous vehicles on its platform.</li></ul>' },
  { y:'2022', t:'Enters bikes and station hardware by acquiring <b>PBSC Urban Solutions</b>.',
    d:'<ul class="ov-bullets"><li>In 2022 Lyft starts earning revenue from selling bikes and bike station software and hardware.</li><li>This comes substantially through its acquisition of PBSC Urban Solutions Inc.</li></ul>' },
  { y:'Q2 2023', t:'Co-founders step back; <b>David Risher</b> becomes CEO.',
    d:'<ul class="ov-bullets"><li>In the second quarter of 2023 the co-founders, Logan Green and John Zimmer, move out of their management roles.</li><li>David Risher, a director since 2021, becomes Chief Executive Officer.</li><li>Kristin Sverchek succeeds Zimmer as President.</li></ul>' },
  { y:'Jul 2025', t:'Closes the <b>Freenow</b> acquisition, taking Lyft into Europe.',
    d:'<ul class="ov-bullets"><li>Lyft acquires Intelligent Apps GmbH (Freenow), a European multimodal app with taxi at its core; the deal closes on July 31, 2025.</li><li>It adds nine countries and more than 180 cities.</li><li>Lyft starts branding it Freenow by Lyft and plans one global Lyft app, expected to be widely available in 2027.</li></ul>' },
  { y:'Oct 2025', t:'Acquires <b>TBR Global Chauffeuring</b>, a luxury chauffeur company active in thousands of cities.' },
  { y:'Q4 2025', t:'Releases its tax <b>valuation allowance</b>: a $2.9B benefit makes FY2025 net income $2.84B despite a pre-tax loss.',
    d:'<ul class="ov-bullets"><li>In the fourth quarter of 2025 Lyft releases the valuation allowance on its U.S. federal and certain state deferred tax assets.</li><li>The benefit is $2.9 billion and lifts FY2025 net income to $2.84 billion, against a loss before taxes of $53 million.</li><li>From then on the effective tax rate in the GAAP statements changes.</li></ul>' },
  { y:'Jun 2026', t:'Takes over fleet operations for <b>Waymo in Nashville</b>, with a purpose-built depot due in October.' },
];

export var LY_OV_SOURCES='Sources — Lyft FY2025 Form 10-K (SEC EDGAR) for revenue by line and region, gross bookings, loss from operations and net income, headcount and the business description; FY2023 10-K for the IPO and the 2023 leadership change; Lyft 2Q26 prepared remarks (Aug 2026) for the Freenow, TBR and Nashville milestones; company IR for the product taxonomy. Market cap, prices and peer multiples are live (Massive), computed from each peer’s latest annual filing (Grab: results release and 20-F) and, for Lyft and Uber, the Bloomberg consensus FY2026 (Nov 2026). Forward figures are estimates, not company guidance.';

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
