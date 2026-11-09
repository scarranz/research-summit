// overviews/uber-ov-data.js — the DATA of Uber's Overview (OV-1 … OV-7, OV-F; playbook §8). Rendering: ./uber-ov.js
// (a copy of googl.js's std* Overview). Market data is live (rule 10): no price, market cap or multiple is written here.
// Sources: Uber FY2025 Form 10-K (SEC EDGAR, CIK 1543151) — cover page, Item 1, Note 13 (segment and geographic
// information), MD&A key metrics; the 2Q26 release (Aug 5 2026) for the latest quarter; company IR for products.

// OV-1 Key Facts — 10 cells. Market cap: live only ('loading…' until the quote lands, 'unavailable' if it fails).
export var STD_FACTS=[
  ['Listing','NYSE: UBER'],
  ['HQ','San Francisco, California, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','2009 (Garrett Camp & Travis Kalanick)'],
  ['IPO','May 2019 · NYSE'],
  ['CEO','Dara Khosrowshahi · since Aug 2017'],
  ['Employees','~34,000 · Dec 2025'],
  ['Dividend','Non-payer · buybacks'],
  ['Market cap','loading live quote…'],
];

// OV-2 lede — 2–4 sentences, no numbers, neutral (FY2025 10-K Item 1).
export var UB_LEDE='Uber runs a global marketplace that connects people who need a ride, a meal, groceries or a truck with the drivers, couriers, merchants and carriers who provide them, all through one app. It owns almost none of the cars, kitchens or trucks: it matches supply with demand, sets prices, handles payment and keeps a share of each booking. Membership (Uber One) and advertising are layered on the same network.';

// OV-3 2×2 quadrant (each cell ≤ ~30 words). Shares: FY2025 10-K Note 13 (revenue by segment, gross bookings in MD&A).
export var STD_BIZ=[
  ['What it sells','Rides (Mobility), food, grocery and retail delivery (Delivery) and freight brokerage (Freight) — plus Uber One membership and in-app advertising — on one app.'],
  ['Who buys it','Consumers on one side; drivers, couriers, merchants, advertisers and shippers on the other. Uber earns from both sides of each transaction.'],
  ['How it earns','FY2025 revenue $52.0B: Mobility 57% · Delivery 33% · Freight 10%. It keeps a share (take rate) of $193.5B gross bookings; Freight is booked gross.'],
  ['The edge','The scale and density of one network across rides and delivery, and a membership that ties the two together; asset-light, so autonomous vehicles join as partners.'],
];

// OV-4 How it makes money — FY2025 10-K, Note 13. Two views of the same $52,017M total:
//   Mobility 29,670 + Delivery 17,248 + Freight 5,099 = 52,017
//   US & Canada 26,469 + Latin America 3,327 + EMEA 16,364 + Asia-Pacific 5,857 = 52,017
export var GMM_SEG=[
  ['Mobility', 57.0, '$29.7B', '57%', null],
  ['Delivery', 33.2, '$17.2B', '33%', null],
  ['Freight',   9.8, '$5.1B',  '10%', null],
];
export var GMM_GEO=[
  ['US & Canada',   50.9, '$26.5B', '51%', null],
  ['EMEA',          31.5, '$16.4B', '31%', null],
  ['Asia-Pacific',  11.3, '$5.9B',  '11%', null],
  ['Latin America',  6.4, '$3.3B',  '6%',  null],
];
export var MM_CAP_TOP='FY2025 revenue <b>$52.0B (+18%)</b> on <b>$193.5B of gross bookings (+19%)</b> — the same revenue total two ways: by <b>segment</b> or by <b>region</b>. Both reconcile to the reported figure.';
export var MM_CAP_END='Mobility is ~57% of revenue but ~50% of gross bookings, because Uber keeps a higher share of a ride than of a delivery order; Freight is recognized gross (revenue ≈ bookings). <span class="ave-subh-note">Source: Uber FY2025 Form 10-K, Note 13 (segment and geographic information) and MD&A key metrics. Region is where the revenue is earned, as Note 13 reports it.</span>';
export var REV_DEFS=[
  { seg:'Mobility (rides)',
    desc:'Connects riders with independent drivers for trips of every kind — standard, premium, shared, two- and three-wheelers, taxis, reserved and business travel — and, increasingly, autonomous vehicles run by partners. Uber keeps a service fee on each fare, plus rider fees and in-app advertising.',
    econ:[['FY2025 gross bookings','$97.5B'],['FY2025 revenue','$29.7B (take rate ~30%)'],['FY2025 segment Adjusted EBITDA','$7.9B']] },
  { seg:'Delivery (food, grocery, retail)',
    desc:'Uber Eats and the wider delivery marketplace: consumers order from restaurants, grocers and retailers and couriers fulfil the order. Uber earns fees from merchants and consumers on each order and from advertising sold to merchants and brands.',
    econ:[['FY2025 gross bookings','$90.9B'],['FY2025 revenue','$17.2B (take rate ~19%)'],['FY2025 segment Adjusted EBITDA','$3.6B']] },
  { seg:'Freight (logistics)',
    desc:'A digital freight brokerage and managed-transportation business connecting shippers with truck carriers. Revenue is recognized gross, so revenue is close to bookings, and the segment runs near breakeven.',
    econ:[['FY2025 gross bookings','$5.1B'],['FY2025 revenue','$5.1B (gross basis)'],['FY2025 segment Adjusted EBITDA','−$33M']] },
];

// OV-5 Products — two tiers: family card → pop-up with the products (key = prod:i). FY2025 10-K Item 1 + company IR.
export var U_PRODUCTS=[
  { ic:'', fam:'Everyday rides', d:'Mobility · the mass-market core.', items:[
    ['UberX','Standard rides in everyday cars — the volume core of Mobility.'],
    ['UberX Share','A shared ride with someone heading the same way, at a lower price.'],
    ['Comfort','Newer, roomier cars with top-rated drivers, for a small premium.'] ]},
  { ic:'', fam:'Premium & reserved', d:'Mobility · higher-end and scheduled rides.', items:[
    ['Uber Black','Professional black-car service in premium vehicles.'],
    ['Uber Reserve','Book a ride in advance for a set pickup time.'] ]},
  { ic:'', fam:'Low-cost formats & taxi', d:'Mobility · two/three-wheelers, taxi, wait-and-save.', items:[
    ['Moto / Auto','Motorbike and auto-rickshaw rides, mostly in emerging markets.'],
    ['Taxi','A licensed local taxi hailed through the Uber app.'] ]},
  { ic:'', fam:'Business & health', d:'Mobility · rides for organizations.', items:[
    ['Uber for Business','Managed ride and meal programs with expensing for companies.'],
    ['Uber Health','Non-emergency medical rides booked by healthcare providers.'] ]},
  { ic:'', fam:'Autonomous (partners)', d:'Mobility · partner robotaxis on the Uber network.', items:[
    ['AV partnerships','Partner autonomous vehicles dispatched on the Uber marketplace; Uber sold its own self-driving unit (ATG) to Aurora in 2020.'] ]},
  { ic:'', fam:'Uber Eats', d:'Delivery · prepared-food delivery and pickup.', items:[
    ['Restaurant delivery & pickup','On-demand meals from local restaurants.'] ]},
  { ic:'', fam:'Grocery & retail', d:'Delivery · essentials beyond food.', items:[
    ['Grocery & convenience','Same-day grocery and convenience-store delivery.'],
    ['Retail','Delivery from pharmacies, electronics and other retailers.'],
    ['Uber Direct','Uber’s courier network powering merchants’ own sites and apps.'] ]},
  { ic:'', fam:'Advertising', d:'Delivery and Mobility · ads sold on the app.', items:[
    ['Sponsored listings & in-app ads','Merchants and brands pay to promote inside Eats and Mobility.'] ]},
  { ic:'', fam:'Uber One', d:'Membership across rides and delivery.', items:[
    ['Uber One','A monthly or annual membership with fee waivers and discounts across Mobility and Delivery.'] ]},
  { ic:'', fam:'Uber Freight', d:'Freight · logistics marketplace.', items:[
    ['Freight brokerage','Matches shippers with truck carriers on demand.'],
    ['Managed transportation','Logistics-management services (from the 2021 Transplace acquisition).'] ]},
];

// OV-6 Competitors — the peer map's DENOMINATORS (rule 10: no multiple, no market cap). Filled from each company's
// FY2025 10-K / 20-F (SEC EDGAR XBRL) and, for UBER and LYFT, the Bloomberg consensus FY2026 (BBG_CONSENSUS.txt).
//   epsT/epsF diluted EPS US$ (GAAP) · ebitdaT US$M = operating income + D&A · nd US$M net debt ex leases − cash · gt/gf revenue growth %
// Bases: trailing EBITDA = GAAP operating income + D&A (10-K); forward EBITDA = Bloomberg's company-adjusted EBITDA, so the
// two are not like-for-like (Uber FY2025: 6,284 GAAP-based vs 8,730 adjusted). FY2025 GAAP EPS carries tax-valuation-allowance
// releases at Uber and Lyft. Uber's P/E uses its own Non-GAAP EPS (FY2025 $2.45, the 4Q25 release), as Historic Multiple does
// (SAB, 2026-11-03; GAAP $4.73); peers stay GAAP, so Lyft's trailing P/E still reads low. Net debt excludes leases and short-term investments.
export var U_PEERS=[
  { tk:'UBER', n:'Uber', hl:true, epsT:2.45, epsF:null, epsFNote:'no forward P/E — Street EPS is GAAP', ebitdaT:6284, ebitdaF:11383, nd:3416, gt:18.3, gf:11.1,
    src:'10-K FY2025 (acc. 0001543151-26-000015); EPS = Non-GAAP (4Q25 release); forward EBITDA: Bloomberg consensus FY2026, 2026-09-10',
    why:'Global mobility and delivery platform; the profile company.' },
  { tk:'DASH', n:'DoorDash', epsT:2.13, epsF:null, ebitdaT:1470, ebitdaF:null, nd:-1654, gt:27.9, gf:null,
    src:'10-K FY2025 (acc. 0001792789-26-000013)',
    why:'Largest US food-delivery marketplace (plus Deliveroo and Wolt abroad); overlaps with Uber Eats in restaurant and grocery delivery.' },
  { tk:'CART', n:'Instacart', epsT:1.60, epsF:null, ebitdaT:589, ebitdaF:null, nd:-637, gt:10.8, gf:null,
    src:'10-K FY2025 (acc. 0001579091-26-000018)',
    why:'US online grocery marketplace and retail-media business; overlaps with Uber Eats in grocery and retail delivery.' },
  { tk:'LYFT', n:'Lyft', epsT:6.81, epsF:0.55, ebitdaT:-53, ebitdaF:695, nd:-79, gt:9.2, gf:16.4,
    src:'10-K FY2025 (acc. 0001628280-26-006960); forward: Bloomberg consensus FY2026, 2026-09-08',
    why:'Second-largest US/Canada ride-hailing network (plus FreeNow in Europe); overlaps with Uber Mobility.' },
  { tk:'GRAB', n:'Grab', epsT:0.06, epsF:null, ebitdaT:242, ebitdaF:null, nd:1380, gt:20.5, gf:null,
    src:'20-F FY2025 (acc. 0001855612-26-000020)',
    why:'Southeast Asian super-app (ride-hailing, delivery, payments, lending) that acquired Uber’s Southeast Asia operations in 2018.' },
];

// OV-F — the Overview's one source footer.
export var OV_SOURCES='Sources — Uber FY2025 Form 10-K (SEC EDGAR) for revenue by segment and region, gross bookings, segment Adjusted EBITDA, headcount and the business description; Uber 2Q26 earnings release (Aug 5 2026); company IR for the product taxonomy. Market cap, prices and peer multiples are live (Massive), computed from each peer’s latest 10-K / 20-F and, where it exists, the Bloomberg consensus FY2026.';
