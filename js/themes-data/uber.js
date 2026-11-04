// themes-data/uber.js — Uber's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Two readers: the theme record in Notes
// (js/overviews/uber-ce.js) and Top Line ▸ Segments (js/segments.js, THEME_SEG maps Mobility / Delivery / Freight;
// the other axes are company-wide). Once the portal saves a record (Supabase, company_theme_record) that copy wins
// and this seed is no longer read.
//
// Seed v2 (2026-11-03). Base: SAB's handwritten call notes (GoodNotes export "UBER.pdf", 32 pages, read as images):
// 14 earnings calls (Q3 2022 → Q2 2026; none for Q1 2023 or Q1 2024) and 13 events (Feb 2024 Investor Update, GM Cruise
// update, Barclays, Go-Get, JPMorgan, GS Communacopia 2025 and 2026, UBS, Morgan Stanley, the Zoox partnership, Nvidia GTC,
// Bernstein SDC, the Delivery Hero announcement), each event filed under the quarter of the call before it and named in
// the note. Paraphrased in English, no quotation marks. Not used: SAB's own model review (price target, multiple),
// the Delivery Hero background profile and an org chart. Figures that could not be read with confidence were checked
// against the releases or dropped (list in docs/profiles/UBER.md).
// UBER_THEMES_V1 keeps the previous record (DOAA351/SAB, Q4 2023 → Q1 2026, from the call transcripts) unchanged; it is
// not rendered (B2 #59 — never deleted).
export var UBER_THEMES_V = 2;
export var UBER_THEMES = [
  { seg:"Mobility", theme:"Mobility growth & margin", st:{ k:'trend', since:'Q3 2022', last:'Q2 2026' },
    why:"Mobility GB growth and its margin come up on almost every call",
    updates:[
      { q:'Q2 2026', items:["US GB accelerated on premium and lower-cost products, sparser areas and reinvested insurance savings.", "Still expect US acceleration this year, driven by insurance and product."] },
      { q:'Q1 2026', items:["Mobility GB +20%; Middle East and US weather a 60bp headwind; US strong in commute and travel.", "US mobility accelerated more than total mobility; no data showing an impact from Waymo."] },
      { q:'Q4 2025', items:["Expect US mobility GB to accelerate in 2026."] },
      { q:'Q2 2025', items:["Lower-end mobility products cost margin but are an investment for the next few years."] },
      { q:'Q1 2025', items:["Mobility GB +20% in constant currency, mainly from international; guide assumes ~19% trip growth (audience)."] },
      { q:'Q4 2024', items:["Mobility margin up YoY on cost leverage and higher volume."] },
      { q:'Q3 2024', items:["Mobility to grow in the low-20% range in Q4 with a flattish EBITDA margin.", "Mobility revenue growth came from more trips, especially international (APAC, Europe, LatAm); US mobility GB +17%.", "At the Barclays fireside (Dec 2024), they guided ~20% mobility growth through 2025."] },
      { q:'Q2 2024', items:["Mobility to stay in the same mid-20s range in Q3; long-term growth of mid-teens maintained."] },
      { q:'Q3 2023', items:["Mobility growth from trip volumes; cost leverage from volume lifted the Adj EBITDA margin."] },
      { q:'Q2 2023', items:["Mobility GB $16.7B (+25%); growth driven by higher trip volumes."] },
      { q:'Q4 2022', items:["Mobility is not very cyclical and tends to be resilient; still gaining market share."] },
      { q:'Q3 2022', items:["Long-term Rides EBITDA margin goal is 10% of GB; already at the long-term goal in many countries.", "Strong growth in US & Canada and EMEA; slower in LatAm and APAC."] }
    ]},
  { seg:"Mobility", theme:"US insurance costs & pricing", st:{ k:'trend', since:'Q3 2024', last:'Q2 2026' },
    why:"Went from a cost that was passed on to riders (2024) to the main reason for lower prices and the faster US growth (2025–26)",
    updates:[
      { q:'Q2 2026', items:["LA and SF had the strongest trip growth on lower prices."] },
      { q:'Q1 2026', items:["Expect hundreds of millions of dollars of savings on the insurance line; more risk offloaded to third parties.", "Price cuts in SF and LA lifted trip growth meaningfully (good elasticity).", "At Bernstein SDC (May 2026): US business accelerated from 2H25 on lower prices from lower insurance."] },
      { q:'Q4 2025', items:["Healthier pricing thanks to insurance supports the 2026 US acceleration."] },
      { q:'Q3 2025', items:["California coverage requirement cut from $1M (see illegible list for the split); savings passed to riders via lower fares.", "At the UBS conference (Dec 2025): technology to rate driving, lower per-trip liabilities (California $1M → $300K), less industry pressure."] },
      { q:'Q1 2025', items:["Insurance cost inflation was only 7%, below the prior guide; less of it passed on in the US.", "US insurance is very expensive vs international; lower inflation helps riders and drivers.", "At the JPMorgan fireside (May 2025), insurance was named the main driver of lower 1H25 pricing; driver safety scores now tied to earnings."] },
      { q:'Q4 2024', items:["US mobility insurance costs expected up high single digits, below prior years' increases; safety score via phone telemetry."] },
      { q:'Q3 2024', items:["They pass changes in insurance costs on to riders.", "At the Barclays fireside (Dec 2024), insurance costs were expected to grow high single to low double digits."] }
    ]},
  { seg:"Mobility", theme:"Sparse markets & low-cost products", st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:"Less dense, suburban markets and cheaper products are a growth lever they keep returning to",
    updates:[
      { q:'Q2 2026', items:["Mobility and delivery both growing faster in sparse markets, at healthy margins."] },
      { q:'Q1 2026', items:["Suburban and lower-density markets growing faster than the business overall.", "Low-cost mobility products drive 75% higher frequency than core products."] },
      { q:'Q4 2025', items:["Top-20 US cities are only 30% of US GB and 25% of profit; NYC, the largest rideshare market, is 10% of US trips."] },
      { q:'Q1 2025', items:["20% of rides come from suburbs (sparser markets); top cities still growing double digits.", "Sparse markets run at comparable margins; frequency is lower, but pricing and mix are higher."] },
      { q:'Q4 2024', items:["Less dense areas are a challenge; managing supply there by adjusting wait times."] },
      { q:'Q3 2024', items:["Focused on expanding in less dense markets."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, about 50% of consumers take only 1–2 trips a month."] }
    ]},
  { seg:"Mobility", theme:"Premium, airports, Reserve & Uber for Business", st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:"Higher-value trip types tracked with sizes and growth rates",
    hook:"Open: U4B target of 1M orgs and >$10B GB by 2028 (set Q1 2026)",
    updates:[
      { q:'Q2 2026', items:["U4B GB +40%; premium trips bring 2x GB and 4x contribution profit per trip vs UberX."] },
      { q:'Q1 2026', items:["Airports 15% of mobility GB; 40% of US riders take trips outside their home city (1.5B such trips in FY2025).", "U4B growing 2x mobility, $5B annualized GB (+45%), 300K organizations; 400+ spend $1M+, 40 spend $10M+.", "Acquiring Blacklane (high-margin; GB as written \"$5bn\", see illegible list).", "U4B target: serve 1M organizations and exceed $10B GB by 2028; adding sales headcount."] },
      { q:'Q4 2025', items:["Airports are 15% of mobility GB, still an opportunity; best penetration (20–40%) is in Mexico, Rio and NYC."] },
      { q:'Q2 2025', items:["Premium is $10B GB growing 35%; Moto $1.5B growing 40%; Reserve growing 60%."] },
      { q:'Q1 2025', items:["40% of Reserve trips are not travel-related, with sparse markets driving the increase."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, under 10% of airports are penetrated (as written). Airports are a $10B GB business, 20% via Reserve.", "At the Feb 2024 Investor Update, 60% of Reserve comes from airports; the other 40% is gaining in less dense markets."] }
    ]},
  { seg:"Mobility", theme:"Mobility take rate & UK model change", st:{ k:'watch', since:'Q3 2022', last:'Q2 2026' },
    why:"Take rate is managed lower; the UK move to an agency model now distorts revenue and take rate",
    hook:"Phase: UK reclassification effective Q1 2026, said to persist through 2026",
    updates:[
      { q:'Q2 2026', items:["Take rate down 500bp, of which 400bp is the UK (~$1.1B revenue impact); the rest from lower-cost products and Brazil."] },
      { q:'Q1 2026', items:["UK change cut revenue by ~$1B (8% growth headwind) and mobility take rate by 400bp; COGS improved 400bp (neutral).", "Effect to persist through 2026 at the same magnitude."] },
      { q:'Q4 2025', items:["UK tax law moves Uber from a merchant to an agency model; driver pay shifts from COGS to contra revenue.", "The UK change cuts revenue and take rate, ~350bp hit to the mobility revenue margin in Q1 2026 and FY2026."] },
      { q:'Q3 2024', items:["Mobility take rate rose to 30.2% with trips flat QoQ.", "At the Barclays fireside (Dec 2024): the stated goal is to lower take rate (as written)."] },
      { q:'Q3 2023', items:["Business-model changes cut the take rate; keeping take rate low is the right call, to be minimized."] },
      { q:'Q2 2023', items:["Mobility take rate 29.3% vs 26.6% a year earlier."] },
      { q:'Q3 2022', items:["Take rate 27% mobility (18% delivery, 100% freight).", "Plan to improve mobility take rate (linked in the notes to the advertising goal)."] }
    ]},
  { seg:"Mobility", theme:"Driver supply & fleets", st:{ k:'trend', since:'Q3 2022', last:'Q2 2026' },
    why:"Driver/courier counts, fleet partners and regulation shape supply",
    updates:[
      { q:'Q2 2026', items:["10.2M drivers and couriers."] },
      { q:'Q1 2026', items:["Active drivers +21% YoY."] },
      { q:'Q4 2025', items:["9.7M drivers and couriers (+19% YoY)."] },
      { q:'Q3 2025', items:["Strategic focus on multiple gigs: move drivers to courier work and back, plus digital tasks like labelling data for AI."] },
      { q:'Q2 2025', items:["8.8M drivers and couriers (+20% YoY)."] },
      { q:'Q4 2024', items:["Japan taxi expansion to 200K cars, with Uber's fleet system deployed (as written \"ERP\")."] },
      { q:'Q3 2024', items:["At the Barclays fireside (Dec 2024), 15% of supply comes from fleet operators; Uber's fleet software helps them run the business."] },
      { q:'Q2 2024', items:["A weak job market improves driver supply."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, supply = drivers × hours per driver, with autonomous vehicles noted as a future supply source.", "At the Feb 2024 Investor Update, fleet partners are 18% of global supply hours, with 2.5x hours per vehicle, higher acceptance and fewer cancellations."] },
      { q:'Q2 2023', items:["6M drivers and couriers."] },
      { q:'Q3 2022', items:["Driver classification to be fought state by state; California example cited as passed with 58% (see illegible list)."] }
    ]},
  { seg:"Mobility", theme:"Geographic mix, FX & Brazil", st:{ k:'watch', since:'Q3 2022', last:'Q2 2026' },
    why:"US vs international mix and LatAm FX recur; Brazil competition is new in Q2 2026",
    updates:[
      { q:'Q2 2026', items:["Brazil, the highest-volume market, slowed on food-delivery competition, a ~2pt hit to trips; two-wheeler drivers are hard to retain."] },
      { q:'Q4 2025', items:["At Morgan Stanley (Mar 2026): mobility is in 75 countries, delivery only in ~32–33; expanding delivery to the Nordics."] },
      { q:'Q1 2025', items:["GB +14% including a 4% FX headwind."] },
      { q:'Q4 2024', items:["Half of GB is US; LatAm (Argentina, Brazil, Mexico) is 25% of international GB.", "LatAm FX depreciation does not hurt profitability (costs are local) but lowers the reported amount.", "Q1 GB outlook includes US weather and assumes the same audience as Q4."] }
    ]},
  { seg:"Delivery", theme:"Delivery growth & margin", st:{ k:'trend', since:'Q2 2023', last:'Q2 2026' },
    why:"Growth rate, cost per trip and margin are discussed every call",
    updates:[
      { q:'Q2 2026', items:["Growth from record retention, Uber One, and grocery & retail outgrowing restaurants; led by Australia, UK and Mexico.", "Delivery transaction values are several times mobility's; large group orders and pickup grew strongly."] },
      { q:'Q1 2026', items:["Delivery +23% YoY (retention, membership, grocery & retail); 80bp weather headwind.", "International led by Australia, Japan and the UK (Australia trips +30%); 1.4M merchants.", "At Bernstein SDC (May 2026): Australia +30%; Canada, UK and Japan 20%+ (Japan accelerated)."] },
      { q:'Q4 2025', items:["At Morgan Stanley (Mar 2026), Uber is gaining share internationally and is 2–3x the next player (Canada, France, Australia, Japan, Taiwan, Turkey, UK)."] },
      { q:'Q3 2025', items:["Delivery growth comes from many products and markets; margin expansion is being deliberately moderated."] },
      { q:'Q1 2025', items:["Delivery GB +18% in constant currency; cost per trip down QoQ and YoY.", "Aim is steady margin expansion with healthy top-line growth.", "At the JPMorgan fireside (May 2025), a higher share of delivery GB now comes from merchant-funded offers."] },
      { q:'Q4 2024', items:["Delivery margin up YoY on cost leverage, volume and advertising.", "Delivery growth expected low-to-mid teens, pushing toward high teens; less dense areas are the challenge."] },
      { q:'Q3 2024', items:["No signs of trade-down in delivery.", "At the Barclays fireside (Dec 2024), average delivery basket is ~$30 (vs ~$20 average trip), with four straight quarters of growth (rate unclear)."] },
      { q:'Q2 2024', items:["Delivery margin up on lower cost per transaction and fewer consumer promotions.", "1.1M merchants (+13%); expect ~10% merchant growth a year for many years."] },
      { q:'Q4 2023', items:["Delivery GB $17B in Q4.", "At the Feb 2024 Investor Update: profitability from lower consumer incentives, courier cost per trip and op costs; only 35% of annual users engage monthly.", "At the Feb 2024 Investor Update, more margin opportunity ahead, helped by Uber Direct and advertising."] },
      { q:'Q3 2023', items:["Business-model changes cut the delivery take rate; margin helped by cost leverage and advertising."] },
      { q:'Q2 2023', items:["Delivery GB $15.6B (+12%); revenue and take rate stabilizing (19.6% vs 19.4%).", "Delivery Adj EBITDA up on volume, higher ad revenue and lower marketing."] }
    ]},
  { seg:"Delivery", theme:"Grocery & retail", st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:"Run-rate GB tracked from $7B to $15B, always growing ~40%",
    updates:[
      { q:'Q2 2026', items:["Grocery & retail at $15B annualized GB, growing 40% YoY."] },
      { q:'Q1 2026', items:["No fees on eligible US grocery orders above $60 for Uber One members."] },
      { q:'Q4 2025', items:["At Morgan Stanley (Mar 2026): grocery & retail ($12–13B) is where food delivery was in 2019–20 ($14B); total delivery ~$100B."] },
      { q:'Q3 2025', items:["Grocery & retail at a $12B run rate, growing faster than food delivery, contribution positive."] },
      { q:'Q1 2025', items:["Grocery and retail starting to be accretive to delivery margin."] },
      { q:'Q3 2024', items:["At the Barclays fireside (Dec 2024): grocery growing much faster than delivery; 1 in 6 food users uses grocery, and they think 1 in 3 is possible."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, grocery is a ~$7B GB run rate growing 40%."] }
    ]},
  { seg:"Delivery", theme:"Advertising", st:{ k:'trend', since:'Q3 2022', last:'Q2 2026' },
    why:"Run rate tracked from $650M to $2.5B",
    hook:"Closed: \"$1B ad revenue by 2024\" (set Q3 2022), $1B run rate reached Q3 2023",
    updates:[
      { q:'Q2 2026', items:["Advertising above a $2.5B run rate, growing 50%."] },
      { q:'Q4 2025', items:["Advertising run rate $2B (+50% YoY)."] },
      { q:'Q3 2024', items:["Advertising growing 70–80%; aiming for 2% of delivery GB from mid-1% today.", "Four ad segments: cost-per-click for SMBs, enterprise, sponsored grocery/CPG listings, and in-trip mobility ads."] },
      { q:'Q2 2024', items:["Ad spend more than tripled YoY (as written)."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, ad revenue is limited by consumer experience; ~2% of delivery GB (SAB's question mark)."] },
      { q:'Q3 2023', items:["Ad growth slower and more concentrated in fewer customers than expected, but still at a $1B run rate. The 2024 target was reached."] },
      { q:'Q2 2023', items:["Ad revenue run rate above $650M."] },
      { q:'Q3 2022', items:["Target of $1B advertising revenue by 2024."] }
    ]},
  { seg:"Delivery", theme:"Delivery Hero stake & acquisition", st:{ k:'promise', since:'Q2 2024', last:'Q1 2026' },
    why:"Started as an equity stake, now a pending takeover",
    hook:"Open: closing expected 2H 2027; ~$1.2B synergies 18 months after close",
    updates:[
      { q:'Q1 2026', items:["At Bernstein SDC (May 2026), Uber bought 37% of Delivery Hero in the open market at an average cost in the low 30s; attractive for Argentina, Korea and the Middle East.", "In the Jul 2026 deal announcement: cash offer of €41.50/share, ~$14.8B (see illegible list), high-single-digit EPS accretion by year three.", "Per the Jul 2026 announcement, Delivery Hero sells 14 markets to SSW Partners (~$1.6B), including Foodora, efood, Foody, Glovo, PedidosYa (Chile, Ecuador) and Yemeksepeti.", "Per the Jul 2026 announcement, cross-platform markets go 34 → 58 and total markets 79 → 99, with 50M+ new eligible cross-platform users.", "Per the Jul 2026 announcement, Uber holds 24.77% plus 11.74% via derivatives; Prosus will tender ~17%, taking Uber's economic interest to ~53%.", "Closing expected in 2H 2027; ~$1.2B synergies 18 months after close, with little revenue synergy.", "Delivery Hero HQ stays in Germany with no Berlin job changes until 2029; Uber to invest €2B in Germany over five years.", "Talabat (MENA) has 8M MAU at a 7% EBITDA margin; Korea's Baemin is the one platform not on DH's global stack.", "Delivery Hero brings quick commerce (which Uber lacks), ads at 3% of GMV, and cross-sell users spending 5x."] },
      { q:'Q2 2024', items:["Delivery Hero listed among the \"other\" equity stakes (with Lime, Joby and Moove)."] }
    ]},
  { seg:"Freight", theme:"Freight", st:{ k:'watch', since:'Q3 2022', last:'Q3 2023' },
    why:"Only discussed 2022–23; no mentions since",
    hook:"Dormant since Q3 2023",
    updates:[
      { q:'Q3 2023', items:["Q4 outlook has freight GB flat QoQ. No freight mentions after this call."] },
      { q:'Q2 2023', items:["Freight pulled back while mobility and delivery EBITDA grew."] },
      { q:'Q4 2022', items:["The freight acquisition hurts in the short term but should pay off over a 10-year horizon."] },
      { q:'Q3 2022', items:["Freight is 8% of GB, booked at a 100% take rate."] }
    ]},
  { seg:"Autonomous vehicles", theme:"AV economics & Uber's role", st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:"Their recurring answer: AVs are unprofitable for years and Uber's value is demand plus utilization",
    updates:[
      { q:'Q2 2026', items:["AVs are a go-to-market puzzle; AV Labs runs its own AVs to collect data for partners.", "Uber can get 20–30 trips per vehicle per day (high 20s to low 30s)."] },
      { q:'Q1 2026', items:["AV scale needs fleet management (depots, repair, charging, cleaning), financing and insurance (Marsh & Apollo partnership).", "AV financing has no residual value today, so revenue per car must be predictable.", "At Bernstein SDC (May 2026): 20B trips a year with 10M drivers, adding 3B a year, vs ~50M global AV trips; UberX costs ~$2 per mile."] },
      { q:'Q3 2025', items:["AVs not expected to be profitable for a few years; Nvidia data partnership lets Uber share data with partners."] },
      { q:'Q2 2025', items:["AV models in the market: merchant (pay per trip or day), agency (revenue share), owning cars (financing), licensing.", "At GS Communacopia (Sep 2025), lidar fell from $20–30K a unit to $300–400 at some Chinese makers."] },
      { q:'Q4 2024', items:["AV commercialization is far off; it needs superhuman safety, compute hardware, ground ops (charging, cleaning) and a high-utilization network.", "Uber sees itself as needed for AVs to reach prime time, with a focus on utilization.", "Q4 deck: human-driven US rides cost ~$2.00/mile; AV hardware and operating costs alone are above $2.00/mile."] },
      { q:'Q3 2024', items:["The AV ecosystem will grow mainly through Waymo in the US, plus other partners worldwide (14 partners).", "At the Barclays fireside (Dec 2024): AVs are critical for long-run supply; Uber's main value is as a demand aggregator (150M+ users).", "At the Barclays fireside, Europe is harder for regulatory reasons (one country in 2H 2025); the Middle East will see wider deployment."] },
      { q:'Q2 2024', items:["AVs will not contribute to profitability for 5–10 years."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, autonomous vehicles were noted as a future source of mobility supply."] }
    ]},
  { seg:"Autonomous vehicles", theme:"AV city roadmap", st:{ k:'promise', since:'Q3 2025', last:'Q2 2026' },
    why:"Dated city counts are given and updated every quarter",
    hook:"Open: 15 AV cities by end-2026; 28 Nvidia cities by 2028; largest AV facilitator by 2029",
    updates:[
      { q:'Q2 2026', items:["Still 15 AV cities by year-end; deck shows 7 live cities and 8 launching by end-2026.", "28 cities globally by 2028 (Nvidia program)."] },
      { q:'Q1 2026', items:["AV trips up 10x YoY; live in 8 cities, 15 by year-end."] },
      { q:'Q4 2025', items:["Will facilitate AV trips in 15 cities in 2026 (half US); aim to be the largest AV facilitator worldwide by 2029.", "Live: Atlanta, Austin, Dallas, Phoenix, Abu Dhabi, Dubai, Riyadh. Upcoming: Bay Area, Houston, LA, Hong Kong, London, Madrid, Munich, Zurich.", "At Morgan Stanley (Mar 2026): 15 cities in 2026, half international; Baidu, WeRide and Pony are already deploying."] },
      { q:'Q3 2025', items:["Expect AVs live on Uber in at least 10 cities by end-2026 (live: Abu Dhabi, Atlanta, Austin, Riyadh).", "Coming 2026–27: Arlington, Dallas, Dubai, London, LA, Munich, SF Bay Area."] }
    ]},
  { seg:"Autonomous vehicles", theme:"AV partners & launches", st:{ k:'trend', since:'Q3 2024', last:'Q2 2026' },
    why:"Partner list and specific city launches change each quarter",
    hook:"Open: Zoox Las Vegas (Q3 2026), Nuro/Lucid Bay Area (2026), Nvidia LA & SF (1H 2027), Rivian SF & Miami (2028)",
    updates:[
      { q:'Q2 2026', items:["Rivian in SF & Miami in 2028; Nvidia in LA & SF in 2027.", "Expect to keep operating with Waymo in Austin and Atlanta next year; will support Lucid under its new CEO.", "Drone partnerships (Flytrex) will be very important."] },
      { q:'Q1 2026', items:["New partners Rivian, Zoox, Verne and Pony.ai; Zoox in Las Vegas in Q3; planning Europe's first robotaxi service.", "Waabi relationship expanded (robotaxi and trucking); Wayve/Nissan robotaxis in Tokyo; Motional live in Las Vegas.", "WeRide fully driverless in Dubai and expanding in Abu Dhabi; Lucid/Nuro employee trips in the Bay Area, public launch in 2026.", "At Bernstein SDC (May 2026): Baidu runs 350K weekly trips in China; Nuro in the Bay Area by year-end."] },
      { q:'Q4 2025', items:["At the Zoox announcement (Mar 2026): Las Vegas this summer, LA summer 2027, rides in both apps; Zoox's first third-party platform.", "At Nvidia GTC (Mar 2026), the Uber partnership covers 28 cities by 2028, starting LA & SF in 1H 2027, in stages from data collection to L4."] },
      { q:'Q3 2025', items:["Can buy L4-ready vehicles through Nvidia Hyperion; 5K initial Stellantis cars on Nvidia, expected to scale."] },
      { q:'Q2 2025', items:["Austin with Waymo, Abu Dhabi with WeRide; Baidu, Lucid, Nuro and Wayve named as important.", "Lucid has 20K vehicle commitments."] },
      { q:'Q3 2024', items:["At the GM Cruise update (Dec 2024), GM refocused on personal vehicles and left robotaxi; the Uber partnership has to be renegotiated.", "At the Barclays fireside (Dec 2024), Waymo in Atlanta and Austin will be Uber-exclusive, with Uber handling fleet operations.", "At the Barclays fireside, Moove (2 Uber board seats, sizeable stake) will likely run Waymo's Miami fleet on Uber's fleet system."] }
    ]},
  { seg:"Autonomous vehicles", theme:"AV capital commitments", st:{ k:'watch', since:'Q4 2024', last:'Q2 2026' },
    why:"Balance-sheet commitments keep growing ($1B → $10B)",
    updates:[
      { q:'Q2 2026', items:["Expect to commit ~$10B over the coming years in equity, infrastructure and vehicle offtake; partners have committed ~120K vehicles.", "At GS Communacopia (Sep 2026), Uber has secured access to 120K vehicles and is investing in depots and fleet infrastructure."] },
      { q:'Q1 2026', items:["AV vehicle commitments are structured to be passed to fleet or financial partners over time."] },
      { q:'Q4 2025', items:["FCF use #2 is AVs: capital and data for software partners, equity or offtake commitments to OEMs, possibly early vehicle purchases.", "At Morgan Stanley (Mar 2026), Uber's AV partners ex-Waymo have raised ~$7B in 12–24 months ($1.5B last month); Uber committed $1B."] },
      { q:'Q3 2025', items:["Can commit its own balance sheet to Nvidia-platform vehicles."] },
      { q:'Q2 2025', items:["Could use internal cash flow to seed the AV ecosystem through equity stakes or capital for real estate and vehicles.", "At GS Communacopia (Sep 2025), organic growth stays first priority while Uber funds AV players with some commitments."] },
      { q:'Q1 2025', items:["At the JPMorgan fireside (May 2025), AV fleets are expected to be owned by financial players (Marriott-style)."] },
      { q:'Q4 2024', items:["Many AV business models to test; Uber could buy some cars, bring in financial partners or provide infrastructure, using some balance sheet."] }
    ]},
  { seg:"Membership & platform", theme:"Uber One scale & penetration", st:{ k:'trend', since:'Q3 2022', last:'Q2 2026' },
    why:"Members and share of GB are reported every call",
    updates:[
      { q:'Q2 2026', items:["Membership at an all-time high; members are more than 70% of delivery GB (+20pp in two years).", "At GS Communacopia (Sep 2026): 50M+ members growing 50%, 50% of GB; in a number of markets membership is 60% of GB."] },
      { q:'Q1 2026', items:["50M members, over 50% of mobility + delivery GB.", "At Bernstein SDC (May 2026): members are 2/3 of delivery GB, 1/3 of mobility GB and 50% of total GB."] },
      { q:'Q4 2025', items:["46M members (+55% globally); members are more than 35% of US mobility GB.", "At Morgan Stanley (Mar 2026), membership still growing above 50%, with high stickiness."] },
      { q:'Q3 2025', items:["36M members with healthy growth; about 2/3 of delivery comes from members."] },
      { q:'Q2 2025', items:["36M members (+40% YoY), 40% of total GB.", "At GS Communacopia (Sep 2025): 60% of delivery GB comes from members; membership is a $2B run rate."] },
      { q:'Q1 2025', items:["30M members; penetration rising toward 60% (base not written).", "At Go-Get (May 2025): $0 delivery fee, up to 10% off Eats, 6% back on rides, Member Days from May 16."] },
      { q:'Q4 2024', items:["Added 5M members to reach 30M; launched in 6 new countries, 34 in total."] },
      { q:'Q3 2024', items:["More than 25M members, with higher retention."] },
      { q:'Q2 2024', items:["Uber One above 50% of delivery GB; memberships at an all-time high."] },
      { q:'Q4 2023', items:["19M members; 45% of delivery GB comes from members.", "At the Feb 2024 Investor Update: 19M members are 30% of total GB and 45% of delivery GB (vs 23% in Q4 2021), across 25 countries."] },
      { q:'Q3 2023', items:["15M members; 40% of mobility bookings come from members."] },
      { q:'Q3 2022', items:["Uber One at 10M subscribers; 20–30M \"a matter of time\"; testing benefits on the mobility side."] }
    ]},
  { seg:"Membership & platform", theme:"Member economics", st:{ k:'watch', since:'Q3 2023', last:'Q2 2026' },
    why:"Spend multiple fell from 4x to 3x; members are unprofitable until about month 6",
    updates:[
      { q:'Q2 2026', items:["At GS Communacopia (Sep 2026), members are more loyal and less price-sensitive."] },
      { q:'Q1 2026', items:["Members spend 3x with higher retention."] },
      { q:'Q3 2025', items:["New members are unprofitable at first (discounts exceed extra usage) and turn profitable on a net margin basis after 6+ months."] },
      { q:'Q1 2025', items:["Members spend 3x."] },
      { q:'Q4 2024', items:["Still offering discounts to top Uber One members."] },
      { q:'Q4 2023', items:["Member spend multiple fell to 3x.", "At the Feb 2024 Investor Update: members spend 3.4x and are more profitable, offset by trial costs.", "At the Feb 2024 Investor Update, members carry a lower margin because of discounts."] },
      { q:'Q3 2023', items:["Members spend 4x non-members (3x in mobility); 15% higher retention. The 4x could fall to 3x.", "Members also get non-monetary benefits such as better matching and queue priority."] }
    ]},
  { seg:"Membership & platform", theme:"Cross-platform consumers", st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:"Share of multi-product users is the core platform metric",
    updates:[
      { q:'Q2 2026', items:["40% of eligible members are active across mobility and delivery."] },
      { q:'Q1 2026', items:["1 in 5 eligible consumers is active in both mobility and delivery; 2 in 5 among Uber One members.", "Cross-platform users are growing 1.5x faster than all consumers; new incentives such as cross-platform quests."] },
      { q:'Q4 2025', items:["40% of customers now use multiple products.", "At Morgan Stanley (Mar 2026), 20% of total MAPCs engage cross-platform."] },
      { q:'Q3 2025', items:["Only 20% of consumers use both products; 30% of mobility users have never tried Uber Eats.", "At the UBS conference (Dec 2025), about 15% of US users are on both platforms."] },
      { q:'Q2 2025', items:["Cross-platform users have 35% higher retention; 30% of mobility users never tried delivery and ~75% never tried grocery & retail.", "Hyper-personalized promotions are the best tool for cross-platform use; they still want standalone apps per service."] },
      { q:'Q2 2024', items:["Multi-platform consumers spend 3x more."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update: 34% of consumers are multi-product (21% in Q1 2021) and spend 3.4x (3x in Q4 2021)."] }
    ]},
  { seg:"Membership & platform", theme:"Audience, frequency & consumer health", st:{ k:'trend', since:'Q3 2022', last:'Q2 2026' },
    why:"MAPCs, trips per user and consumer resilience",
    updates:[
      { q:'Q2 2026', items:["300M trips per week; trips remain the main driver of GB growth."] },
      { q:'Q1 2026', items:["At Bernstein SDC (May 2026), Uber added 40M first-time users in Q1, 40% more than three years ago."] },
      { q:'Q3 2025', items:["Trip growth above prior quarters; record audience (+17%) and engagement (+4%) with flat average price.", "At the UBS conference (Dec 2025), growth = users × frequency × price change (17% × 4%, ≈22% as written)."] },
      { q:'Q2 2025', items:["180M users (+15.4%) averaging 6.2 trips a month (+5%).", "At GS Communacopia (Sep 2025), the top 10% order 15+ times a month while 50% use Uber 1–2 times a month."] },
      { q:'Q1 2025', items:["At the JPMorgan fireside (May 2025): food, grocery and transport spend is far less variable; transactions +15%, frequency near highs."] },
      { q:'Q3 2024', items:["Audience and frequency at all-time highs; retention up in both mobility and delivery."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update: mobility GB = consumers × trips per consumer × GB per trip; 3-year growth driven by MAPCs and frequency."] },
      { q:'Q3 2023', items:["Very healthy consumer and demand; data used heavily for matching and pricing.", "Q4 outlook: trips +20% YoY."] },
      { q:'Q2 2023', items:["Trips +23% to 2.3B; monthly trips per MAPC +9% to 5.6."] },
      { q:'Q4 2022', items:["Growth holds if the consumer holds up."] },
      { q:'Q3 2022', items:["Consumer still strong."] }
    ]},
  { seg:"Membership & platform", theme:"Product launches & AI", st:{ k:'trend', since:'Q1 2025', last:'Q2 2026' },
    why:"New products (passes, Route Share, Dine Out, Cart Assistant) and the AI agenda",
    updates:[
      { q:'Q2 2026', items:["Cart Assistant (conversational ordering) doubles basket size."] },
      { q:'Q1 2026', items:["AI use cases: interfaces, agents and pattern prediction (Cart Assistant, Earner Assistant)."] },
      { q:'Q4 2025', items:["At Morgan Stanley (Mar 2026), cross-platform growth multiplies SKUs and compute; investing in GPUs for years to come."] },
      { q:'Q3 2025', items:["Six strategic focus areas: lifetime experience, hybrid future, local commerce, multiple gigs, merchant growth engine, and generative AI.", "Toast partnership plugs merchants into Eats seamlessly; generative AI agents for customer interactions."] },
      { q:'Q2 2025', items:["Ride passes launched (Price Lock, prepaid bundles with deeper discounts)."] },
      { q:'Q1 2025', items:["At Go-Get (May 2025): Price Lock pass ($2.99/month, fixed price for a route within a 1-hour window) and prepaid trip bundles (5–20).", "At Go-Get, Route Share offers fixed pickup/drop-off points at up to 50% off UberX, rolling out in the US every 20 minutes at commute times.", "At Go-Get: Dine Out and an OpenTable partnership with Uber One priority reservations; 60% of users earn $75K+."] }
    ]},
  { seg:"Membership & platform", theme:"Leadership changes", st:{ k:'watch', since:'Q2 2025', last:'Q4 2025' }, trackUntil:'Q4 2025',
    why:"COO and CFO changes",
    hook:"Closed: CFO handover Feb 16, 2026 (announced Q4 2025)",
    updates:[
      { q:'Q4 2025', items:["CFO Prashanth leaves on February 16; Balaji, a former Uber executive, becomes CFO."] },
      { q:'Q2 2025', items:["Andrew Macdonald becomes COO over both mobility and delivery."] }
    ]},
  { seg:"Costs & capital", theme:"Quarterly outlook", st:{ k:'promise', since:'Q2 2023', last:'Q2 2026' },
    why:"A GB and profit guide every quarter, checked the next quarter",
    hook:"Rolling: each guide closes at the next call. Latest open: Q3 2026",
    updates:[
      { q:'Q2 2026', items:["Q3 guide: GB $58.25–60.25B (+18–22%); non-GAAP EPS $0.84–0.88 (+28–35%); Adj EBITDA $2.86–2.96B.", "FY2026 SBC $1.95–2.10B (top of range cut by $50M); D&A $450–550M; ETR 22–24%; cash tax mid-to-high single digits."] },
      { q:'Q1 2026', items:["Q2 guide: GB $56.25–57.75B (+18–22% cc, 2% FX tailwind, 60bp Middle East headwind); non-GAAP EPS $0.78–0.82 (+31–38%).", "Q2 guide equals Adj EBITDA of $2.7–2.8B; FY2026 SBC $1.95–2.15B, D&A $450–550M, ETR 22–24%."] },
      { q:'Q4 2025', items:["Q1 guide: GB $52–53.5B (+17–21%, 4% FX tailwind); non-GAAP EPS $0.65–0.72 (+37% at midpoint); Adj EBITDA $2.37–2.47B.", "FY2026 non-GAAP tax rate 22–25%; cash tax rate 10–15% thanks to a tax asset."] },
      { q:'Q3 2025', items:["Q4 guide: GB $52.25–53.75B (+17–21%, ~1% FX tailwind); Adj EBITDA $2.41–2.51B (+31–36%).", "FY2025 SBC $1.7–1.9B; FY2025 D&A $650–750M."] },
      { q:'Q2 2025', items:["Q3 guide: GB $48.25–49.75B (+17–21%; range reversed in the notes), modest FX tailwind, includes Trendyol Go.", "Q3 guide: Adj EBITDA $2.19–2.29B (+30–36%, range reversed in the notes); FY2025 SBC $1.7–1.9B, D&A $600–700M."] },
      { q:'Q1 2025', items:["Q2 guide: GB $45.75–47.25B (+16–20% cc; labelled \"revenue\" in the notes), with a 1.5% FX headwind (3% in mobility).", "Q2 guide: Adj EBITDA $2.02–2.12B (+29–35% YoY)."] },
      { q:'Q3 2023', items:["Q4 guide: GB $36.5–37.5B (mobility + delivery +20–23%); Adj EBITDA $1.18–1.24B."] },
      { q:'Q2 2023', items:["Q3 guide: GB $34–35B; Adj EBITDA $975M–$1.025B."] }
    ]},
  { seg:"Costs & capital", theme:"3-year outlook (Feb 2024 Investor Update)", st:{ k:'promise', since:'Q4 2023', last:'Q4 2025' },
    why:"The multi-year frame they reaffirm",
    hook:"Open: 3-year window ends FY2026 (check at the Q4 2026 call)",
    updates:[
      { q:'Q4 2025', items:["Will reach the commitments made at the 2024 Investor Update."] },
      { q:'Q4 2024', items:["Reaffirmed mid-to-high-teens GB growth and ~40s% Adj EBITDA growth."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, the 3-year outlook is GB CAGR mid-to-high teens and Adj EBITDA CAGR high-30s to 40%.", "Also from the Investor Update: FCF of 90%+ of Adj EBITDA."] }
    ]},
  { seg:"Costs & capital", theme:"Profitability (Adj EBITDA, net income)", st:{ k:'trend', since:'Q3 2022', last:'Q1 2026' },
    why:"Margin of GB and EBITDA-to-net-income bridge",
    hook:"Closed: \"2024 EBITDA targets will be achieved\" (Q3 2022), reaffirmed and superseded by the Feb 2024 outlook",
    updates:[
      { q:'Q1 2026', items:["Net income took a $1.5B hit from equity stake revaluations."] },
      { q:'Q1 2025', items:["Adj EBITDA +35% to $1.9B (4.4% of GB), only ~$100M above net income."] },
      { q:'Q2 2024', items:["Net income $1B, driven by $796M of operating income."] },
      { q:'Q2 2023', items:["Adj EBITDA $916M, margin 2.7% of GB (up from 1.3%, as written); net income positive on equity stakes."] },
      { q:'Q3 2022', items:["Adj EBITDA margin around 1.6% of GB (boxed in notes).", "2024 EBITDA targets will be met despite macro headwinds."] }
    ]},
  { seg:"Costs & capital", theme:"FCF conversion & insurance float", st:{ k:'trend', since:'Q4 2023', last:'Q4 2025' },
    why:"FCF vs Adj EBITDA: 90%+ promised, 110%+ delivered",
    updates:[
      { q:'Q4 2025', items:["FY2025 FCF ~$10B, over 110% of Adj EBITDA.", "FCF uses: invest in markets by LTV/CAC, AVs, M&A, and buybacks."] },
      { q:'Q1 2025', items:["FCF $2.3B in the quarter."] },
      { q:'Q2 2024', items:["TTM FCF $4.8B vs Adj EBITDA $6.3B, i.e. 90%+ conversion."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, FCF bridge: taxes rise with profit, interest falls as credit improves, working capital is a modest drag, capex stays asset-light.", "At the Investor Update, insurance reserves create a float (premiums in before claims out) that grows with the business, shows up in FCF and earns income.", "Reserve cash is restricted and not available for operations; reserves accrue per mile as trips are completed."] }
    ]},
  { seg:"Costs & capital", theme:"Buybacks, share count & SBC", st:{ k:'trend', since:'Q4 2022', last:'Q2 2026' },
    why:"Capital return grew from nothing to $20B",
    hook:"Closed: initial $7B program exhausted Q4 2025",
    updates:[
      { q:'Q1 2026', items:["Repurchased $3B (40M shares); $16B left."] },
      { q:'Q4 2025', items:["Bought $1.9B in Q4, finishing the initial $7B program early; $20B from Aug 2025 still available."] },
      { q:'Q2 2025', items:["New $20B authorization on top of $3B left; spread over a couple of years, ~50% of FCF, aiming to cut share count."] },
      { q:'Q4 2024', items:["$1.5B accelerated buyback within the $7B program."] },
      { q:'Q3 2024', items:["Will increase buybacks; the debt schedule matters."] },
      { q:'Q2 2024', items:["Buyback started, $355M in the quarter."] },
      { q:'Q4 2023', items:["At the Feb 2024 Investor Update, actions to offset SBC aim for a steady fall in share count."] },
      { q:'Q3 2023', items:["Capital return details to come next quarter; eligible for S&P 500 inclusion."] },
      { q:'Q4 2022', items:["Cutting SBC in a healthy way given the new environment."] }
    ]},
  { seg:"Costs & capital", theme:"Reporting change: Adj Operating Income & Adj EPS", st:{ k:'promise', since:'Q3 2025', last:'Q1 2026' }, trackUntil:'Q1 2026',
    why:"Changes what is guided and reported",
    hook:"Closed Q1 2026 (first quarter on the new basis, EPS guide replaces quarterly EBITDA)",
    updates:[
      { q:'Q1 2026', items:["Q2 guide given as non-GAAP EPS, with the Adj EBITDA equivalent shown alongside."] },
      { q:'Q4 2025', items:["First guide on the new basis (Q1 non-GAAP EPS); new non-GAAP op income includes SBC and depreciation."] },
      { q:'Q3 2025', items:["From Q1 2026, report Adj Operating Income instead of Adj EBITDA (company and segment), now including SBC, depreciation and non-M&A amortization.", "Adjusted EPS will replace quarterly EBITDA guidance.", "Adj net income excludes stake mark-to-market, FX gains/losses, other items and their tax."] }
    ]},
  { seg:"Costs & capital", theme:"Equity stakes", st:{ k:'watch', since:'Q2 2024', last:'Q1 2026' },
    why:"Stake values move net income and may be sold to fund AVs",
    updates:[
      { q:'Q1 2026', items:["Stake revaluations cost $1.5B of net income."] },
      { q:'Q2 2025', items:["Could sell part of the $8.7B in stakes to fund AV investment; $1.2B sold in Q2."] },
      { q:'Q4 2024', items:["Q4 deck: stakes carried at $8.5B (Didi $2.6B, Grab $2.5B, Aurora $2.1B, other $1.3B); liquidity $7.0B in cash and short-term investments."] },
      { q:'Q2 2024', items:["Equity stakes worth $6.2B: Didi $2.4B, Grab $1.9B, Aurora $0.9B, others $1.0B (Lime, Joby, Moove, Delivery Hero)."] }
    ]},
  { seg:"Costs & capital", theme:"Opex, headcount & AI efficiency", st:{ k:'trend', since:'Q2 2023', last:'Q2 2026' },
    why:"Corporate cost run rate and moderated hiring",
    updates:[
      { q:'Q2 2026', items:["Hiring below original plans; optimizing AI spend per token."] },
      { q:'Q1 2026', items:["Corporate G&A and R&D up on technology hiring and insurance reform.", "Plans to slow headcount growth using AI efficiencies.", "At Bernstein SDC (May 2026), hiring will slow in 2H."] },
      { q:'Q4 2024', items:["Corporate costs held at a ~$625M run rate."] },
      { q:'Q2 2023', items:["Corporate G&A and platform R&D fell as a share of GB on cost control and fixed-cost leverage."] }
    ]}
];
export var UBER_THEMES_V1 = [
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

// Stamp the seed version on every thread (as meta.js / googl.js do). The hydrate step keeps a saved record only when
// its threads carry v >= UBER_THEMES_V; without this stamp every saved record read as v0 and was overwritten by the
// seed on each load, losing notes the team added in the portal (found 2026-11-04).
UBER_THEMES.forEach(function(t){ t.v = UBER_THEMES_V; });
