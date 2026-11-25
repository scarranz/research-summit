// spcx-bl-data.js — reported data for SpaceX Deep Dive ▸ Bottom Line ▸ General (read by ./spcx-bl.js). Same contract as
// tsm-bl-data.js. Rule 10: only REPORTED figures and filing/call text here — no market data, no model numbers.
//
// 1) The functional expense lines, US$ million. FY2023–FY2025: 424B4 prospectus, consolidated statements of operations.
//    1Q25–3Q26: Q1 (prospectus interim statements), Q2 and Q3 2026 Forms 10-Q (each with the prior-year quarter); 4Q25 is
//    the fiscal year less the nine months. Typed from the filings and cross-checked against the reported columns of the
//    Bloomberg export (./spcx-bbg.js).
//      · otherOpex = restructuring charges + impairment + other operating items: revenue − cost of revenue − R&D − SG&A −
//        income from operations. FY2023 is $3,775M of impairment (X intangible assets) + $237M of restructuring.
//      · tie-out: revenue − the four lines = reported income from operations in every year and quarter, to the US$ million.
export var SPCX_OPEX_YEARS=[2023, 2024, 2025];
export var SPCX_OPEX={
  2023:{"revenue": 10387, "costOfSales": 6110, "rnd": 2105, "sga": 1665, "otherOpex": 4012},
  2024:{"revenue": 14015, "costOfSales": 7996, "rnd": 3464, "sga": 1813, "otherOpex": 276},
  2025:{"revenue": 18674, "costOfSales": 9451, "rnd": 8643, "sga": 2644, "otherOpex": 525}
};
export var SPCX_OPEXQ=[
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 4067,  "costOfSales": 1962, "rnd": 1557, "sga": 493,  "otherOpex": 28},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 4071,  "costOfSales": 2282, "rnd": 1958, "sga": 606,  "otherOpex": 195},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 5576,  "costOfSales": 2705, "rnd": 2291, "sga": 575,  "otherOpex": 278},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 4960,  "costOfSales": 2502, "rnd": 2837, "sga": 970,  "otherOpex": 24},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 4694,  "costOfSales": 2388, "rnd": 3514, "sga": 746,  "otherOpex": -11},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 7814,  "costOfSales": 3495, "rnd": 3548, "sga": 912,  "otherOpex": 2},
  {"p": "3Q26", "yr": 2026, "q": "Q3", "revenue": 14575, "costOfSales": 5478, "rnd": 4596, "sga": 1707, "otherOpex": 3}
];

export var SPCX_EW_SRC='— SpaceX 424B4 prospectus (Jun 12 2026), Management\'s Discussion and Analysis, Components of Results of Operations · SEC EDGAR';

// 2) One dive per line. `def`, composition and drivers quote the 424B4 MD&A (verbatim where in quotes); calls quote the
//    Q3 2026 earnings call transcript. Amounts, shares of revenue and the bars are computed in spcx-bl.js from the series
//    above — never typed here.
export var SPCX_EW_LINES=[
  { k:'costOfSales', name:'Cost of revenue',
    def:'Cost of revenue includes the cost of materials, depreciation and amortization, shipping and handling, payment processor fees, customs and duties, revenue share costs, infrastructure costs, allocated overhead, and employee compensation costs (including salaries, benefits, and share-based compensation).',
    comp:[['🚀','Space','Second stages flown on Falcon 9 and Falcon Heavy (they are not reused), launch operations, and depreciation of boosters, Merlin engines and fairings — the reusable parts are capitalised and depreciated here.'],
          ['🛰️','Connectivity','Depreciation of satellites, launches and ground infrastructure, Starlink Kit costs, ground operations and payment fees. Launching Starlink satellites is capitalised into the satellites, so launch cost reaches this line through depreciation.'],
          ['🖥️','SI (AI)','Data-center infrastructure — leases, hosting, energy, bandwidth, depreciation of servers and networking — plus revenue share, payments to creators on X and amortisation of acquired intangibles.']],
    compNote:'The prospectus describes the line by segment; it does not size the pieces.',
    why:'<b>The gross-margin line.</b> Because the reusable rocket parts, satellites and GPUs are capitalised, this line is mostly depreciation and runs with the capex of one to five years earlier. Gross margin went from 41% (2023) to 49% (2025) and 62% in 3Q26 as rented compute — high-margin once built — grew.',
    drivers:[['🛰️','Starlink scale','FY2025: "This increase was primarily due to an increase in costs in our Connectivity segment" — more satellites, kits and ground stations behind more subscribers.'],
             ['🖥️','Compute build','Depreciation of the Colossus data centers lands here once capacity is rented to customers; capacity used for Grok sits in R&D instead.'],
             ['🧾','One-offs','3Q26 Connectivity gross margin of 55% included about 3 points of tariff refunds (Q3 call).']],
    calls:[{q:'Q3 2026', txt:'"Connectivity gross profits doubled year-over-year with gross margins of 55%, including a one-time benefit of roughly 3% primarily driven by tariff refunds in the quarter."', who:'Bret Johnsen, CFO'},
           {q:'Q3 2026', txt:'"We also expect total company gross margins in Q4 to be more consistent with the second quarter, given some one-time benefits in customer mix that we highlighted in Q3."', who:'Bret Johnsen, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    def:'Space segment\'s research and development ("R&D") expenses mainly relate to the development, build, and testing of Starship. … AI segment\'s R&D expenses mainly relate to the training of Grok, our leading frontier model, development, build, and testing of our next-generation AI-enabled products and data center costs to train AI-enabled products.',
    comp:[['🚀','Starship (Space)','Test-flight hardware, Raptor engines, people, tooling and R&D depreciation. Once Starship is commercial these costs are "generally … capitalized and then depreciated in cost of revenue".'],
          ['🧠','Grok and AI products (SI)','Cloud computing, power, depreciation of GPUs and data-center assets used to train Grok, and the AI teams.'],
          ['🛰️','Next-generation satellites (Connectivity)','V3 satellites, Starlink Kits and ground infrastructure.']],
    why:'<b>The biggest swing in the P&amp;L.</b> R&amp;D rose 2.5× in 2025 to 46% of revenue: compute used for training Grok is an R&amp;D cost, not cost of revenue. As capacity moves to paying customers, the same GPUs\' depreciation moves to cost of revenue — which is why the R&amp;D share fell to 32% of revenue in 3Q26 while the dollars kept rising.',
    drivers:[['🧠','Grok training','FY2025: "higher R&D costs in our AI segment of $3,888 million driven by the depreciation of GPU hardware and the cost of cloud computing as a result of our AI data center expansions".'],
             ['🚀','Starship','FY2025: "higher R&D costs from our Space segment of $1,169 million driven by accelerated investment in our Starship vehicle." The company expects Space R&D to rise in 2026, then moderate once Starship delivers payload to orbit.'],
             ['🤝','Cursor','The prospectus warns AI R&D "may increase as a result of the compute agreement with Cursor".']],
    calls:[{q:'Q3 2026', txt:'"Segment costs and expenses rose $389 million year-over-year, and we continued to accelerate R&D investments in our Starship program."', who:'Bret Johnsen, CFO'},
           {q:'Q3 2026', txt:'"Space adjusted EBITDA was a loss of $205 million for the quarter, primarily reflecting these higher R&D expenses."', who:'Bret Johnsen, CFO'}] },
  { k:'sga', name:'Selling, general &amp; administrative',
    def:'AI segment\'s SG&A expenses consist primarily of employee compensation expenses (including salaries, benefits, and share-based compensation) for our sales, sales support, marketing, finance, legal, information technology, human resources and other administrative employees.',
    comp:[['🧠','SI (AI)','People, professional services (consulting, content moderation, legal and accounting) and facilities — the largest part since the xAI combination.'],
          ['🛰️','Connectivity','Allocated staff, licensing and regulatory fees, marketing and bad debt.'],
          ['🚀','Space','Allocated staff, depreciation and corporate aircraft.']],
    why:'<b>Small but rising with acquisitions.</b> 14% of revenue in 2025; 3Q26 jumped to $1.7B including stock-based pay tied to the Cursor acquisition. The company expects Connectivity SG&amp;A to rise in 2026 "as we introduce marketing spend".',
    drivers:[['🧠','AI growth','FY2025: "higher employee and facilities-related costs and higher legal expenses for our AI segment of $722 million as our AI business grew rapidly".'],
             ['📣','Starlink marketing','FY2025: "higher marketing and international expansion costs of $40 million and $37 million, respectively, for our Connectivity segment".'],
             ['🧾','Acquisition awards','Cursor (Aug 2026) brought $23.4B of unvested awards recognised over their vesting period.']],
    calls:[] },
  { k:'otherOpex', name:'Restructuring, impairment &amp; other',
    def:'Space impairment includes impairment losses on fixed assets due to anomalies on the Company\'s flight vehicles and launch sites, which occur outside our normal business operations.',
    comp:[['📉','Impairment','FY2023: $3,775M on X\'s intangible assets; later years: flight-vehicle and launch-site anomalies (Space) and abandoned production lines and damaged satellite hardware (Connectivity).'],
          ['✂️','Restructuring','Workforce reductions at X, which ran through 2025 ($487M in FY2025).']],
    why:'<b>The line that made 2023 a loss.</b> Without the X impairment, FY2023 would have had operating income instead of a $3.5B operating loss. Since 2024 it is small and mostly X restructuring.',
    drivers:[['🐦','X','The X Merger brought impairment and restructuring of the old Twitter cost base.'],
             ['🚀','Anomalies','Rocket or launch-site failures are written off here when they happen.']],
    calls:[] }
];
