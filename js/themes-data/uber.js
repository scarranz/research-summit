// themes-data/uber.js — Uber's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the theme record in Notes
// (js/overviews/uber-ce.js) and Top Line ▸ Segments (js/segments.js, THEME_SEG). Once the portal saves a record
// (Supabase, company_theme_record) that copy wins and this seed is no longer read.
//
// Source: the theme record that lived in js/overviews/uber.js (UB_THEMES, DOAA351/SAB, Q4 2023 → Q2 2026, distilled
// from the earnings calls in docs/calls/UBER*.md), moved here unchanged (B2 #59, 2026-11-03) with a top-level axis
// (`seg`) and a tracking window (`st`) added per thread. Quoted text is management's, in quotation marks.
export var UBER_THEMES_V = 1;
export var UBER_THEMES = [
  { seg:'Autonomous vehicles', theme:'Autonomous Vehicles \u2014 The Hybrid Network', st:{ k:'trend', since:'Q4 2023', last:'Q1 2026' }, 
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
  { seg:'Membership & platform', theme:'Uber One & the Membership Flywheel', st:{ k:'trend', since:'Q4 2023', last:'Q1 2026' }, 
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
  { seg:'Mobility', theme:'The Barbell Strategy', st:{ k:'trend', since:'Q2 2024', last:'Q1 2026' }, 
    why:'How Uber funds growth bets (low-cost products, AV) with premium margins \u2014 and why it keeps the TAM expanding.',
    updates:[
      { q:'Q2 2024', items:['Moto (two-wheelers): <b>>$1.5B GBs, +40%</b>. Premium: >$10B, +35%. Reserve: +60%.','Growth bets portfolio: $11B+ annual GBs, growing 80% \u2014 taxi, two-wheelers, three-wheelers, Share, Reserve.'] },
      { q:'Q3 2024', items:['Teens trips doubled. Shuttle expanding. U4B (business) >50% CC growth. Insurance cost increases causing elasticity in core \u2014 barbell products offset.'] },
      { q:'Q4 2024', items:['Barbell formally named. Low-cost: <b>75% higher frequency</b> than core. Premium: <b>3.5\u00d7 higher profit</b> growth. Both: <b>25% lift in first-time acquisition</b>.'] },
      { q:'Q1 2025', items:['Wait & Save strong in sparse markets. Reserve: 40% of trips now non-travel. Sparse markets = 20% of mobility trips, growing 1.5\u00d7 faster.'] },
      { q:'Q3 2025', items:['Growth bets now <b>$20B annual GBs, +80%</b>. Grocery/retail at $12B run rate. Sparse markets growing 2\u00d7 faster than dense markets globally.'] },
      { q:'Q1 2026', items:['Low-cost + premium growing <b>40% combined</b> in 2025. Both wings driving 25% lift in new-user acquisition.','AV treated as the newest "growth bet" \u2014 same barbell playbook: invest at negative margins, build liquidity, then turn profitable.'] },
    ]},
  { seg:'Mobility', theme:'Insurance Reform & US Mobility Acceleration', st:{ k:'trend', since:'Q3 2024', last:'Q1 2026' }, 
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
  { seg:'Delivery', theme:'Delivery & Grocery Acceleration', st:{ k:'trend', since:'Q4 2023', last:'Q1 2026' }, 
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
  { seg:'Costs & capital', theme:'Cross-Platform & Capital Allocation', st:{ k:'trend', since:'Q4 2023', last:'Q1 2026' }, 
    why:'The platform thesis: why operating mobility + delivery + freight under one roof creates value no mono-line competitor can match.',
    updates:[
      { q:'Q4 2023', items:['Multi-product users spend <b>3\u00d7 more</b>. 19M Uber One members. "Everything should be made as simple as possible" \u2014 abstracting complexity.'] },
      { q:'Q2 2024', items:['Cross-platform consumers growing <b>1.5\u00d7 faster</b> than overall. $10B delivery GBs from mobility app (12% of annualized delivery). 30% of riders never tried Eats.'] },
      { q:'Q4 2024', items:['Multi-product use at <b>all-time high: 37%</b>. Andrew Macdonald (Mac) as COO to supercharge platform. Delta SkyMiles partnership.','Investment grade achieved. $7B buyback mostly executed. Share count reduction achieved in 2025.'] },
      { q:'Q2 2025', items:['<b>$20B buyback authorized</b>. Mac running both mobility + delivery. Free cash flow on track to reduce share count "by a healthy amount."'] },
      { q:'Q4 2025', items:['40% of Q4 consumers using >2 products. <b>$15B delivery GBs from mobility app</b> (run rate). ~$10B free cash flow, +42%.','Balaji Krishnamurthy becomes CFO (Feb 2026). Prashanth Mahendra-Rajah departs for "opportunity to serve America."'] },
      { q:'Q1 2026', items:['<b>$3B returned to shareholders</b> in Q1 (record). Non-GAAP EPS <b>+44% YoY</b>. Go-Get event showcased hotels, Travel Mode, One Search.','50M Uber One members + 10M drivers/couriers globally \u2014 "important milestones." Freight returned to growth for first time in ~2 years.'] },
    ]},
  { seg:'Membership & platform', theme:'AI in the Product (emerging)', st:{ k:'trend', since:'Q1 2026', last:'Q1 2026' }, 
    why:'The newest narrative thread \u2014 AI moving from the back-end into consumer- and earner-facing features. Early, but flagged as a multi-year lever to watch.',
    updates:[
      { q:'Q1 2026', items:['<b>Cart Assistant</b> launched \u2014 an AI helper that builds grocery/retail orders for consumers.','AI earner tools for drivers & couriers (smarter dispatch and support).','Management framed AI as a multi-year <b>efficiency + experience lever</b> \u2014 "early innings," something to track rather than a 2026 numbers driver.'] },
    ]},
];
