// spcx-bl-data.js — reported data for SpaceX Deep Dive ▸ Bottom Line ▸ General and Segments (read by ./spcx-bl.js). Same
// contract as googl-bl-data.js. Rule 10: only REPORTED figures and filing/call text here — no market data, no model numbers.
//
// 1) The functional expense lines, US$ million. FY2023–FY2025: 424B4 prospectus (Jun 12 2026), consolidated statements of
//    operations. 1Q25–3Q26: Q1 (prospectus interim statements), Q2 and Q3 2026 Forms 10-Q / earnings releases (each with
//    the prior-year quarter); 4Q25 is the fiscal year less the nine months. Typed from the filings and cross-checked against
//    the reported columns of the Bloomberg export (./spcx-bbg.js).
//      · otherOpex = restructuring charges + impairment + other operating items: revenue − cost of revenue − R&D − SG&A −
//        income from operations. FY2023 is $3,775M of impairment (X intangible assets) + $237M of restructuring.
//      · the 424B4 and the 10-Qs give cost of revenue as ONE total (no split by component), so the bridge draws one bar.
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

// 2) Weighted-average shares, US$ million of shares — 424B4, consolidated statements of operations and Note 14 (Earnings
//    per Share). CHECKED Nov 25 2026 against the Bloomberg export's `dilShares` (2,759 · 9,956 · 2,926): Bloomberg is
//    RIGHT. FY2024's 9,956M diluted is the filing's own figure — SpaceX was profitable that year, so the diluted count adds
//    6,771M shares from the assumed conversion of the redeemable convertible preferred stock, 292M from options and 45M
//    from RSUs (Note 14); in the loss years 2023 and 2025 those are anti-dilutive and diluted = basic. Nothing overridden.
//    Basic shares are added here so the chart can show both. Pro forma for the preferred conversion (and the Class C
//    reclassification), FY2025 basic and diluted = 6,723M (424B4, summary financial data). After the xAI merger (Feb 2026)
//    and the IPO (Jun 2026) the base is different: 3Q26 basic 11,942M, diluted 12,475M (Q3 2026 earnings release).
export var SPCX_SHARES_BASIC={ 2023:2759, 2024:2848, 2025:2926 };
export var SPCX_SHARES_NOTE={ prefConv2024:6771, proForma2025:6723, q3_26basic:11942, q3_26diluted:12475 };

export var SPCX_EW_SRC='— SpaceX 424B4 prospectus (Jun 12 2026), Management’s Discussion and Analysis, Components of Results of Operations · SEC EDGAR';

// 3) One dive per line. `def` and the quoted drivers are verbatim from the 424B4 MD&A; calls are verbatim from SpaceX’s
//    earnings webcasts — docs/calls/SPCX-latest.md (Q3 2026, Oct 20 2026) and docs/calls/SPCX.md (Q2 2026, Aug 4 2026),
//    checked character-for-character on Nov 25 2026 (the two Space R&D remarks were mislabelled Q3; they are Q2 2026).
//    Composition / driver rows are [icon (ignored, empty), label, text] — no emoji. Amounts, shares of revenue and the
//    bars are computed in spcx-bl.js from the series above — never typed here.
export var SPCX_EW_LINES=[
  { k:'costOfSales', name:'Cost of revenue',
    def:'Cost of revenue includes the cost of materials, depreciation and amortization, shipping and handling, payment processor fees, customs and duties, revenue share costs, infrastructure costs, allocated overhead, and employee compensation costs (including salaries, benefits, and share-based compensation).',
    comp:[['','Space','Second stages flown on Falcon 9 and Falcon Heavy (they are not reused), launch operations, and depreciation of boosters, Merlin engines and fairings — the reusable parts are capitalised and depreciated here.'],
          ['','Connectivity','Depreciation of satellites, launches and ground infrastructure, Starlink Kit costs, ground operations and payment fees. Launching Starlink satellites is capitalised into the satellites, so launch cost reaches this line through depreciation.'],
          ['','SI (AI in the 424B4)','Data-center infrastructure — leases, hosting, energy, bandwidth, depreciation of servers and networking — plus revenue share, payments to creators on X and amortisation of acquired intangibles.']],
    compNote:'The prospectus describes the line by segment and gives it as one total; it does not size the components, so the bridge draws a single cost-of-revenue bar.',
    why:'<b>The gross-margin line.</b> Because the reusable rocket parts, satellites and GPUs are capitalised, this line is mostly depreciation and runs with the capex of one to five years earlier. Gross margin went from 41% (2023) to 49% (2025) and 62% in 3Q26 as rented compute — high-margin once built — grew.',
    unit:'<div class="ew-note">SpaceX does not disclose a cost per launch, per subscriber or per GPU-hour.</div>',
    drivers:[['','Starlink scale','FY2025: “This increase was primarily due to an increase in costs in our Connectivity segment” — more satellites, kits and ground stations behind more subscribers (424B4 MD&amp;A).'],
             ['','Compute build','Depreciation of the Colossus data centers lands here once capacity is rented to customers; capacity used for Grok sits in R&amp;D instead.'],
             ['','One-offs','3Q26 Connectivity gross margin of 55% included about 3 points of tariff refunds (Q3 2026 call).']],
    calls:[{q:'3Q26', txt:'“Connectivity gross profits doubled year-over-year with gross margins of 55%, including a one-time benefit of roughly 3% primarily driven by tariff refunds in the quarter.”', who:'Bret Johnsen, CFO'},
           {q:'3Q26', txt:'“We also expect total company gross margins in Q4 to be more consistent with the second quarter, given some one-time benefits in customer mix that we highlighted in Q3.”', who:'Bret Johnsen, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    def:'Space segment’s research and development (“R&amp;D”) expenses mainly relate to the development, build, and testing of Starship. … AI segment’s R&amp;D expenses mainly relate to the training of Grok, our leading frontier model, development, build, and testing of our next-generation AI-enabled products and data center costs to train AI-enabled products.',
    comp:[['','Starship (Space)','Test-flight hardware, Raptor engines, people, tooling and R&amp;D depreciation. Once Starship is commercial these costs “generally will be capitalized and then depreciated in cost of revenue” (424B4).'],
          ['','Grok and AI products (SI)','Cloud computing, power, depreciation of GPUs and data-center assets used to train Grok, and the AI teams.'],
          ['','Next-generation satellites (Connectivity)','V3 satellites, Starlink Kits and ground infrastructure.']],
    why:'<b>The biggest swing in the P&amp;L.</b> R&amp;D rose 2.5× in 2025 to 46% of revenue: compute used for training Grok is an R&amp;D cost, not cost of revenue. As capacity moves to paying customers, the same GPUs’ depreciation moves to cost of revenue — which is why the R&amp;D share fell to 32% of revenue in 3Q26 while the dollars kept rising.',
    unit:'<div class="ew-note">SpaceX does not disclose a cost per Starship flight or per training run.</div>',
    drivers:[['','Grok training','FY2025: “higher R&amp;D costs in our AI segment of $3,888 million driven by the depreciation of GPU hardware and the cost of cloud computing as a result of our AI data center expansions” (424B4 MD&amp;A).'],
             ['','Starship','FY2025: “higher R&amp;D costs from our Space segment of $1,169 million driven by accelerated investment in our Starship vehicle.” The company expects Space R&amp;D to rise in 2026, then moderate once Starship delivers payload to orbit.'],
             ['','Cursor','The prospectus warns “AI R&amp;D expenses may increase as a result of the compute agreement with Cursor.”']],
    calls:[{q:'2Q26', txt:'“Segment costs and expenses rose $389 million year-over-year, and we continued to accelerate R&amp;D investments in our Starship program.”', who:'Bret Johnsen, CFO'},
           {q:'2Q26', txt:'“Space adjusted EBITDA was a loss of $205 million for the quarter, primarily reflecting these higher R&amp;D expenses.”', who:'Bret Johnsen, CFO'}] },
  { k:'sga', name:'Selling, general &amp; administrative',
    def:'AI segment’s SG&amp;A expenses consist primarily of employee compensation expenses (including salaries, benefits, and share-based compensation) for our sales, sales support, marketing, finance, legal, information technology, human resources and other administrative employees.',
    comp:[['','SI (AI)','People, professional services (consulting, content moderation, legal and accounting) and facilities — the largest part since the xAI combination.'],
          ['','Connectivity','Allocated staff, licensing and regulatory fees, marketing and bad debt.'],
          ['','Space','Allocated staff, depreciation and corporate aircraft.']],
    why:'<b>Small but rising with acquisitions.</b> 14% of revenue in 2025; 3Q26 rose to $1.7B, the quarter Cursor was acquired (SI SG&amp;A went from $532M in 2Q26 to $1,268M). The company expects Connectivity SG&amp;A to rise in 2026 “as we introduce marketing spend”.',
    unit:'<div class="ew-note">Not a unit-cost line: SpaceX does not disclose a cost per subscriber acquired.</div>',
    drivers:[['','AI growth','FY2025: “higher employee and facilities-related costs and higher legal expenses for our AI segment of $722 million as our AI business grew rapidly” (424B4 MD&amp;A).'],
             ['','Starlink marketing','FY2025: “higher marketing and international expansion costs of $40 million and $37 million, respectively, for our Connectivity segment”.'],
             ['','Acquisition awards','Cursor (Aug 2026) brought $23.4B of equity awards attributable to post-acquisition service, recognised over the vesting period (Q3 2026 release).']],
    calls:[{q:'3Q26', txt:'“SI segment operating income was $431 million, but excluding the $1.2 billion of stock-based compensation expense related to the Cursor acquisition, the segment delivered $1.6 billion of operating profit just in Q3.”', who:'Bret Johnsen, CFO'},
           {q:'3Q26', txt:'“These equity awards will be recognized as stock-based compensation over roughly the next three-year vesting period.”', who:'Bret Johnsen, CFO'}] },
  { k:'otherOpex', name:'Restructuring, impairment &amp; other',
    def:'Space impairment includes impairment losses on fixed assets due to anomalies on the Company’s flight vehicles and launch sites, which occur outside our normal business operations.',
    comp:[['','Impairment','FY2023: $3,775M on X’s intangible assets; later years: flight-vehicle and launch-site anomalies (Space) and a discontinued Starlink Kit product line (Connectivity).'],
          ['','Restructuring','Workforce reductions at X, which ran through 2025 ($487M in FY2025) and into 2026.']],
    why:'<b>The line that made 2023 a loss.</b> Without the X impairment, FY2023 would have had operating income instead of a $3.5B operating loss. Since 2024 it is small and mostly X restructuring.',
    drivers:[['','X','The X Merger brought impairment and restructuring of the old Twitter cost base.'],
             ['','Anomalies','Rocket or launch-site failures are written off here when they happen.']],
    calls:[] }
];

// 4) SPCX_SEG_Y / SPCX_SEG_Q — the segment cost split (Bottom Line ▸ Segments, BL-SEG), US$ million, typed from the
//    filings’ segment note (“revenues, significant segment expenses, and income (loss) from operations by the Company’s
//    reportable segments”): 424B4 Note 19 (FY2023–FY2025) and its interim note (1Q25, 1Q26); Q3 2026 earnings release,
//    segment operating and financial data (3Q25, 2Q26, 3Q26 and the nine months to Sep 30 2025). 2Q25 = nine months 2025
//    less 1Q25 and 3Q25; 4Q25 = FY2025 less the nine months. In every row rev − cor − rnd − sga − oth = oi (checked when
//    typed), and the three segments add to the consolidated lines above. oth = restructuring charges + impairment.
//    The segment the 424B4 calls “AI” is reported as “SI” (Super Intelligence) from Q3 2026 — same perimeter.
//    NOTE: js/results-data/spcx.js and ./spcx-bbg.js carry SI FY2023 operating income as +3,973; the 424B4 says (3,973), a
//    loss. This file has the filing’s sign and spcx-bl.js reads reported segment years from here.
export var SPCX_SEG_Y={
  2023:{ space:{rev:3557, cor:1669, rnd:1538, sga:351, oth:0,   oi:-1},   conn:{rev:3869,  cor:2786, rnd:381, sga:233, oth:0,  oi:469},  si:{rev:2961, cor:1655, rnd:186,  sga:1081, oth:4012, oi:-3973} },
  2024:{ space:{rev:3796, cor:1541, rnd:1835, sga:375, oth:24,  oi:21},   conn:{rev:7599,  cor:4768, rnd:453, sga:333, oth:39, oi:2006}, si:{rev:2620, cor:1687, rnd:1176, sga:1105, oth:213,  oi:-1561} },
  2025:{ space:{rev:4086, cor:1352, rnd:3004, sga:349, oth:38,  oi:-657}, conn:{rev:11387, cor:5921, rnd:575, sga:468, oth:0,  oi:4423}, si:{rev:3201, cor:2178, rnd:5064, sga:1827, oth:487,  oi:-6355} }
};
export var SPCX_SEG_Q=[
  { p:'1Q25', space:{rev:865,  cor:297, rnd:526,  sga:88,  oth:24, oi:-70},  conn:{rev:2475, cor:1214, rnd:123, sga:105, oth:0, oi:1033}, si:{rev:727,  cor:451,  rnd:908,  sga:300,  oth:4,   oi:-936} },
  { p:'2Q25', space:{rev:746,  cor:330, rnd:694,  sga:87,  oth:5,  oi:-370}, conn:{rev:2587, cor:1400, rnd:142, sga:121, oth:0, oi:924},  si:{rev:738,  cor:552,  rnd:1122, sga:398,  oth:190, oi:-1524} },
  { p:'3Q25', space:{rev:1666, cor:477, rnd:849,  sga:81,  oth:0,  oi:259},  conn:{rev:3097, cor:1657, rnd:141, sga:109, oth:0, oi:1190}, si:{rev:813,  cor:571,  rnd:1301, sga:385,  oth:278, oi:-1722} },
  { p:'4Q25', space:{rev:809,  cor:248, rnd:935,  sga:93,  oth:9,  oi:-476}, conn:{rev:3228, cor:1650, rnd:169, sga:133, oth:0, oi:1276}, si:{rev:923,  cor:604,  rnd:1733, sga:744,  oth:15,  oi:-2173} },
  { p:'1Q26', space:{rev:619,  cor:281, rnd:930,  sga:70,  oth:0,  oi:-662}, conn:{rev:3257, cor:1651, rnd:205, sga:213, oth:0, oi:1188}, si:{rev:818,  cor:456,  rnd:2379, sga:463,  oth:-11, oi:-2469} },
  { p:'2Q26', space:{rev:962,  cor:329, rnd:1076, sga:99,  oth:0,  oi:-542}, conn:{rev:4291, cor:2060, rnd:294, sga:281, oth:0, oi:1656}, si:{rev:2561, cor:1106, rnd:2178, sga:532,  oth:2,   oi:-1257} },
  { p:'3Q26', space:{rev:1767, cor:435, rnd:1225, sga:114, oth:0,  oi:-7},   conn:{rev:5248, cor:2368, rnd:188, sga:325, oth:0, oi:2367}, si:{rev:7560, cor:2675, rnd:3183, sga:1268, oth:3,   oi:431} }
];
export var SPCX_SEG_SRC='SpaceX 424B4 prospectus (Note 19, Segments, FY2023–FY2025 and 1Q25–1Q26) and Q3 2026 earnings release (segment operating and financial data, 3Q25–3Q26) · SEC EDGAR';
// The 424B4’s own words on how segments are run and what they do not show (Note 19 and the MD&A), verbatim.
export var SPCX_SEG_NOTE={
  codm:'The Company’s CODM assesses performance and allocates resources to operating segments based on segment income (loss) from operations by comparing actual income (loss) from operations to historical results and previously forecasted financial information. The Company’s CODM does not evaluate operating and reportable segments using asset or liability information.',
  interseg:'For launches of our Starlink satellites, the Company does not recognize any inter-segment revenue, rather those launch costs are capitalized in satellites in Property, plant, and equipment, net.'
};
// One deep dive per segment. `def` (revenue) and `costDef` (cost of revenue) verbatim from the 424B4, “Description of Our
// Segments”; calls verbatim from docs/calls/ (SPCX-latest.md = Q3 2026, SPCX.md = Q2 2026). Every number in the key
// figures, the bars and the cost table is computed in spcx-bl.js from SPCX_SEG_Y / SPCX_SEG_Q and the Results dataset.
export var SPCX_SEG_DIVES=[
  { k:'conn', name:'Connectivity (Starlink)',
    def:'Connectivity segment generates revenue from (i) the broadband and mobile connectivity services provided through Starlink and (ii) the sale of the Starlink Kit (inclusive of the terminal).',
    costDef:'Connectivity segment’s cost of revenue includes depreciation (inclusive of launch, satellite, and ground infrastructure costs), Starlink Kit costs, shipping and handling costs, ground operating expenses, employee compensation costs (including salaries, benefits, and share-based compensation) for our engineering and operations teams, payment processor fees, warranty expense, inventory excess and obsolescence, and customs and duties.',
    business:'Starlink: consumer subscriptions plus kit sales, enterprise and government contracts (aviation, maritime, Starshield) and Starlink Mobile through carrier partners. The profitable core of SpaceX before compute rental — its operating income carried the company through 2025. Because SpaceX books no inter-segment revenue, the cost of launching Starlink satellites reaches this segment as satellite depreciation, not as a payment to Space.',
    moves:[
      ['Subscribers and ARPU','Consumer subscribers 13.6M at 3Q26 (7.2M a year earlier); consumer ARPU $69 a month in 3Q26 against $83 a year earlier, up 5% sequentially (Q3 2026 release).'],
      ['Satellite depreciation','Launch, satellite and ground costs are capitalised and depreciated in cost of revenue (424B4), so the constellation build shows up here with a lag.'],
      ['Marketing','The company expects Connectivity SG&amp;A to rise in 2026 “as we introduce marketing spend to support growth of our business” (424B4).'],
      ['One-off in 3Q26','Gross margin of 55% included roughly 3 points of tariff refunds (Q3 2026 call) — the CFO guided total-company gross margin in 4Q26 back toward 2Q26.']
    ],
    calls:[
      {q:'3Q26', txt:'“Connectivity again delivered robust revenue growth and profitability with revenues of $5.2 billion, up 69% year-over-year and 22% sequentially.”', who:'Bret Johnsen, CFO'},
      {q:'3Q26', txt:'“Connectivity gross profits doubled year-over-year with gross margins of 55%, including a one-time benefit of roughly 3% primarily driven by tariff refunds in the quarter.”', who:'Bret Johnsen, CFO'}
    ] },
  { k:'si', name:'SI (Super Intelligence)',
    def:'AI segment generates revenue from (i) the sale of ad products displayed on its X platform, and (ii) providing AI solutions and infrastructure, which includes subscription-related offerings, data licensing arrangements, and API access to Grok models.',
    costDef:'AI segment’s cost of revenue includes infrastructure costs, revenue share expenses, payment processor fees, payments to creators, amortization of acquired intangible assets, and allocated labor and overhead costs.',
    business:'xAI and X, called “AI” in the 424B4 and “SI” since Q3 2026: rented compute (cloud services agreements), Grok subscriptions and API, X advertising and, from mid-August 2026, Cursor. It lost money every quarter until compute rental started in 2Q26; in 3Q26 it earned $431M of operating income after $1.2B of stock-based pay tied to the Cursor acquisition. Training compute is R&amp;D; compute rented to customers is cost of revenue.',
    moves:[
      ['Cloud services agreements','SI solutions and infrastructure revenue went from $359M in 3Q25 to $7,022M in 3Q26, $608M of it from Cursor (Q3 2026 release).'],
      ['Training vs renting','GPU depreciation used to train Grok sits in R&amp;D; once capacity is rented it moves to cost of revenue — R&amp;D was 42% of SI revenue in 3Q26, 85% in 2Q26.'],
      ['Cursor awards','$23.4B of equity awards attributable to post-acquisition service, recognised as stock-based compensation over about three years (Q3 2026 release and call). Adjusted EBITDA excludes it; operating income does not.'],
      ['X restructuring','Restructuring charges of the X workforce reduction sit in this segment ($487M in FY2025).']
    ],
    calls:[
      {q:'3Q26', txt:'“SI segment adjusted EBITDA was $5 billion, up $3.8 billion quarter-over-quarter, and $5.4 billion year-over-year, driven primarily by higher -margin cloud service agreements.”', who:'Bret Johnsen, CFO'},
      {q:'3Q26', txt:'“SI segment operating income was $431 million, but excluding the $1.2 billion of stock-based compensation expense related to the Cursor acquisition, the segment delivered $1.6 billion of operating profit just in Q3.”', who:'Bret Johnsen, CFO'}
    ] },
  { k:'space', name:'Space',
    def:'Space segment generates revenue primarily through (i) Launch Services for the deployment of payloads to their intended orbits for both commercial and government customers utilizing Falcon 9 and Falcon Heavy, and (ii) Launch and Development for the development of spacecraft and provision of launch and mission services for government agency space programs utilizing Falcon 9, Falcon Heavy, Starship, and Dragon.',
    costDef:'Space segment’s cost of revenue includes second stages flown related to the Company’s Falcon 9 and Falcon Heavy launches, launch operations and overhead, depreciation (inclusive of booster, Merlin engine, and fairing depreciation), employee compensation costs (including salaries, benefits, and share-based compensation) for our operations teams, launch testing and overhead, engineering costs, inventory excess and obsolescence, shared costs incurred in the production of launch hardware, and ongoing product support.',
    business:'Falcon and Dragon launches for outside customers, and government development programs. Its revenue only counts customer launches — Starlink launches are capitalised into the satellites — and Starship development is expensed here as R&amp;D, so the segment margin swings around zero on a small revenue base and says little about the launch business itself.',
    moves:[
      ['Starship R&amp;D','Space R&amp;D was $1,225M in 3Q26 against $1,767M of revenue; the company expects it to rise in 2026 and moderate once Starship delivers payload to orbit (424B4).'],
      ['Customer launch mix','12 customer launches in 3Q26 (15 a year earlier); revenue rose 6% year-over-year on a favorable customer mix (Q3 2026 release and call).'],
      ['No inter-segment revenue','The Starlink launches that fill most of the manifest earn this segment nothing; their cost is capitalised in Connectivity (424B4).']
    ],
    calls:[
      {q:'2Q26', txt:'“Segment costs and expenses rose $389 million year-over-year, and we continued to accelerate R&amp;D investments in our Starship program.”', who:'Bret Johnsen, CFO'},
      {q:'2Q26', txt:'“Space adjusted EBITDA was a loss of $205 million for the quarter, primarily reflecting these higher R&amp;D expenses.”', who:'Bret Johnsen, CFO'},
      {q:'3Q26', txt:'“The space revenues of $1.8 billion were up 84% sequentially and up 6% year-over-year , anchored by a favorable customer mix.”', who:'Bret Johnsen, CFO'}
    ] }
];
