// tsm-bl-data.js — reported data for TSMC Deep Dive ▸ Bottom Line ▸ General (read by ./tsm-bl.js).
//
// Rule 10: only REPORTED figures and filing text here — no market data, no Summit numbers.
//
// 1) The functional expense lines (US$ million), between the BEGIN/END markers — GENERATED from the filings
//    by the scratch builder build_bl_data.py (see docs/profiles/TSM.md, BL-GEN), not typed:
//      · FY2018–FY2020: FY2020 Form 20-F, consolidated statements of comprehensive income (NT$ million).
//      · FY2021–FY2025 and quarters: TSMC's consolidated financial statements filed on Form 6-K (NT$ thousand);
//        a Q4 is the year minus the nine-month year-to-date.
//      · NT$ → US$ at the rate implied by the US$ revenue TSMC reports in each quarterly earnings release
//        (the same convention as js/results-data/tsm.js), so revenue here equals TSMC's reported US$ revenue.
//      · costOfSales = revenue − gross profit (FY2018–20 gross profit nets the realized/unrealized profit on
//        sales to associates); otherOpex = the residual that ties to reported income from operations, so it
//        is "other operating income and expenses, net" with the EXPENSE sign (a net gain is negative).
//
// 2) TSM_EW_LINES — one dive per line. Quotes are verbatim (20-F, FY2025, filed Apr 16 2026; 3Q26 call,
//    docs/calls/TSM-latest.md). The amount, share of revenue, margin effect and the share-of-revenue bars are
//    computed in tsm-bl.js from the series above — never typed here.

// BEGIN GENERATED (build_bl_data.py)
// FX (NT$ per US$, implied): {2018: 30.16, 2019: 30.889, 2020: 29.428, 2021: 27.933, 2022: 29.831, 2023: 31.194, 2024: 32.134, 2025: 31.112}
export var TSM_OPEX_YEARS=[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var TSM_OPEX={
  2018:{"revenue": 34200, "costOfSales": 17692, "rnd": 2848, "gAdmin": 672, "marketing": 199, "otherOpex": 70},
  2019:{"revenue": 34640, "costOfSales": 18689, "rnd": 2960, "gAdmin": 704, "marketing": 206, "otherOpex": 16},
  2020:{"revenue": 45510, "costOfSales": 21345, "rnd": 3721, "gAdmin": 967, "marketing": 242, "otherOpex": -24},
  2021:{"revenue": 56830, "costOfSales": 27490, "rnd": 4466, "gAdmin": 1322, "marketing": 271, "otherOpex": 12},
  2022:{"revenue": 75890, "costOfSales": 30691, "rnd": 5473, "gAdmin": 1794, "marketing": 333, "otherOpex": 12},
  2023:{"revenue": 69300, "costOfSales": 31629, "rnd": 5846, "gAdmin": 1951, "marketing": 340, "otherOpex": -6},
  2024:{"revenue": 90070, "costOfSales": 39521, "rnd": 6354, "gAdmin": 2606, "marketing": 409, "otherOpex": 38},
  2025:{"revenue": 122430, "costOfSales": 49105, "rnd": 7921, "gAdmin": 2645, "marketing": 544, "otherOpex": -14},
};
export var TSM_OPEXQ=[
  {"p": "Q1 '22", "yr": 2022, "q": "Q1", "revenue": 17570, "costOfSales": 7795, "rnd": 1290, "gAdmin": 376, "marketing": 74, "otherOpex": 29},
  {"p": "Q2 '22", "yr": 2022, "q": "Q2", "revenue": 18160, "costOfSales": 7435, "rnd": 1348, "gAdmin": 393, "marketing": 73, "otherOpex": -1},
  {"p": "Q3 '22", "yr": 2022, "q": "Q3", "revenue": 20230, "costOfSales": 8006, "rnd": 1418, "gAdmin": 478, "marketing": 89, "otherOpex": 0},
  {"p": "Q4 '22", "yr": 2022, "q": "Q4", "revenue": 19930, "costOfSales": 7530, "rnd": 1421, "gAdmin": 540, "marketing": 95, "otherOpex": -12},
  {"p": "Q1 '23", "yr": 2023, "q": "Q1", "revenue": 16720, "costOfSales": 7302, "rnd": 1287, "gAdmin": 443, "marketing": 88, "otherOpex": -2},
  {"p": "Q2 '23", "yr": 2023, "q": "Q2", "revenue": 15680, "costOfSales": 7195, "rnd": 1359, "gAdmin": 462, "marketing": 77, "otherOpex": 2},
  {"p": "Q3 '23", "yr": 2023, "q": "Q3", "revenue": 17280, "costOfSales": 7904, "rnd": 1616, "gAdmin": 474, "marketing": 81, "otherOpex": -4},
  {"p": "Q4 '23", "yr": 2023, "q": "Q4", "revenue": 19620, "costOfSales": 9214, "rnd": 1581, "gAdmin": 572, "marketing": 93, "otherOpex": -2},
  {"p": "Q1 '24", "yr": 2024, "q": "Q1", "revenue": 18870, "costOfSales": 8856, "rnd": 1468, "gAdmin": 514, "marketing": 99, "otherOpex": 4},
  {"p": "Q2 '24", "yr": 2024, "q": "Q2", "revenue": 20820, "costOfSales": 9749, "rnd": 1486, "gAdmin": 596, "marketing": 91, "otherOpex": 39},
  {"p": "Q3 '24", "yr": 2024, "q": "Q3", "revenue": 23500, "costOfSales": 9909, "rnd": 1633, "gAdmin": 708, "marketing": 105, "otherOpex": -15},
  {"p": "Q4 '24", "yr": 2024, "q": "Q4", "revenue": 26880, "costOfSales": 11021, "rnd": 1771, "gAdmin": 787, "marketing": 114, "otherOpex": 10},
  {"p": "Q1 '25", "yr": 2025, "q": "Q1", "revenue": 25530, "costOfSales": 10521, "rnd": 1720, "gAdmin": 757, "marketing": 114, "otherOpex": 34},
  {"p": "Q2 '25", "yr": 2025, "q": "Q2", "revenue": 30070, "costOfSales": 12444, "rnd": 1973, "gAdmin": 610, "marketing": 138, "otherOpex": -18},
  {"p": "Q3 '25", "yr": 2025, "q": "Q3", "revenue": 33100, "costOfSales": 13421, "rnd": 2131, "gAdmin": 670, "marketing": 133, "otherOpex": 3},
  {"p": "Q4 '25", "yr": 2025, "q": "Q4", "revenue": 33730, "costOfSales": 12707, "rnd": 2091, "gAdmin": 594, "marketing": 159, "otherOpex": -36},
  {"p": "Q1 '26", "yr": 2026, "q": "Q1", "revenue": 35900, "costOfSales": 12118, "rnd": 2145, "gAdmin": 691, "marketing": 140, "otherOpex": -53},
  {"p": "Q2 '26", "yr": 2026, "q": "Q2", "revenue": 40200, "costOfSales": 12976, "rnd": 2315, "gAdmin": 676, "marketing": 141, "otherOpex": -167},
];
// END GENERATED

export var TSM_EW_SRC='— TSMC Form 20-F for FY2025, Item 5 (Operating Results) and Item 4 (Research and Development) · SEC EDGAR';

export var TSM_EW_LINES=[
  { k:'costOfSales', name:'Cost of revenue',
    kpiExtra:['42%','of the line is depreciation (FY2025)'],
    def:'Our gross margin fluctuates with the level of capacity utilization, price change, cost improvement, product mix and exchange rate, among other factors. Furthermore, our gross margin would be negatively impacted in the year when a new technology is introduced.',
    comp:[['🏭','Depreciation &amp; amortization','<b>NT$643B</b> in FY2025 — <b>42%</b> of the line: depreciation of plant, equipment and right-of-use assets recognized in cost of revenue (NT$638.0B) plus amortization (NT$5.4B).'],
          ['👥','People','<b>NT$236B</b> — <b>15%</b> of the line: employee benefits recognized in cost of revenue, profit sharing included.']],
    compNote:'The remaining 43% is not broken out by nature in the 20-F. Source: 20-F Note “Additional information of expenses by nature”.',
    unit:'<div class="ew-note">TSMC does not disclose a cost per wafer. It does disclose wafer shipments — <b>15.0 million</b> 12-inch-equivalent wafers in 2025 against 12.9 million in 2024 (20-F Item 5) — but cost of revenue also carries the non-wafer business, so dividing one by the other would not be a unit cost.</div>',
    why:'<b>The gross-margin line.</b> The 20-F: “In 2025, our gross margin increased to 59.9% of net revenue from 56.1% in 2024, mainly attributable to higher capacity utilization and cost improvement, partially offset by unfavorable foreign exchange rate.”',
    drivers:[['📈','Utilization','With depreciation at 42% of the line, how full the fabs run sets the cost of each wafer — named first in the 2025 explanation.'],
             ['🆕','New-node ramps','“Our gross margin would be negatively impacted in the year when a new technology is introduced” — 2nm in 2026.'],
             ['🌎','Overseas fabs','Fabs outside Taiwan cost more to run; management sizes the dilution in gross margin points (see the calls below).'],
             ['💱','Exchange rate','Costs are in NT$ and pricing in US$: a stronger NT$ “partially offset” the 2025 margin gain.']],
    calls:[{q:'Q3 2026', txt:'“Gross margin decreased by 1.3 percentage points sequentially to 66.4%, primarily due to margin dilution from 2 nm ramp.”', who:'Wendell Huang, CFO'},
           {q:'Q3 2026', txt:'4Q26 gross margin guided down 40 bp to 66% at the midpoint, “primarily due to the continued margin dilution from the steep ramp-up of our 2 nm technology, as well as dilution from overseas fabs.”', who:'Wendell Huang, CFO'},
           {q:'Q3 2026', txt:'“We now expect the gross margin dilution from the ramp-up of our overseas fabs to be closer to 2%… we expect the dilution from our overseas fabs to widen to 3%-4% in the next few years.”', who:'Wendell Huang, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['+20.7%','growth in NT$, FY2025 (20-F)'],
    def:'Research and development expenses increased by NT$ 42,245 million in 2025, or 20.7%, from 2024. The increases were mainly attributed to a higher level of research activities for 10-angstrom, 14-angstrom, and 16-angstrom process technologies, as we continued to advance to smaller processing nodes.',
    comp:[['🧪','Centralized R&amp;D','“Focus on developing new logic, SoC, derivatives, package/system-in-package (“SIP”) technologies, along with cost-effective 3D wafer level system integration solutions.”'],
          ['🏭','Fab-conducted R&amp;D','“Focus on improving and upgrading the manufacturing process technologies.”']],
    compNote:'Both quotes: 20-F Item 4, Research and Development.',
    why:'The largest operating expense, and the one that buys the next node. It grows in dollars every year but falls as a share of revenue — 8.5%, 7.1% and 6.5% of net revenue in 2023–2025 (20-F Item 4).',
    drivers:[['🔬','The next nodes','2025’s increase went to “10-angstrom, 14-angstrom, and 16-angstrom process technologies” — A14 is the node after N2.'],
             ['📐','Revenue outgrew it','R&amp;D rose 20.7% in 2025 while revenue rose 31.6% (both in NT$, 20-F Item 5).']],
    calls:[{q:'Q3 2026', txt:'“Total operating expenses accounted for 7.8% of net revenue.” (R&amp;D, G&amp;A and marketing together.)', who:'Wendell Huang, CFO'},
           {q:'Q3 2026', txt:'“We have already begun preparing the capacity for our A14 technology. Risk production is well on track for 2027, and volume production will start in 2028.”', who:'C.C. Wei, Chairman & CEO'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['NT$103B','employee profit-sharing bonus, FY2025 — all functions'],
    def:'General and administrative and marketing expenses in 2025 increased by NT$ 2,333 million, or 2.4%, compared to 2024, mainly reflecting higher employee profit sharing expenses due to higher net income.',
    comp:[['🤝','Employee profit sharing','TSMC accrues the employees’ profit-sharing bonus on pretax income: NT$103.1B in 2025 against NT$70.3B in 2024, spread across cost of revenue and operating expenses (20-F, employee benefits note).']],
    why:'Small — about 2% of revenue — and it moves with profits rather than with volume, because the profit-sharing bonus is set on pretax income.',
    drivers:[['💰','Profit sharing','The 2025 increase is “mainly” higher profit sharing “due to higher net income” (20-F Item 5).']] },
  { k:'marketing', name:'Marketing',
    kpiExtra:['78%','of FY2025 revenue from the ten largest customers (20-F Item 3)'],
    def:'General and administrative and marketing expenses in 2025 increased by NT$ 2,333 million, or 2.4%, compared to 2024, mainly reflecting higher employee profit sharing expenses due to higher net income.',
    comp:[['🎯','A concentrated customer base','TSMC sells to fabless companies, system companies and integrated device manufacturers (20-F Item 4); its ten largest customers were 78% of 2025 revenue.']],
    why:'The smallest functional line, under half a percent of revenue — selling to a concentrated base costs little.',
    drivers:[['💰','Profit sharing','Reported together with G&amp;A in the 20-F explanation: the 2025 change is mainly profit sharing.']] },
  { k:'otherOpex', name:'Other operating income &amp; expenses, net',
    kpiExtra:['NT$447M','net gain, FY2025 (20-F)'],
    def:'Net other operating income and expenses in 2025 increased by NT$ 1,677 million from 2024 to a net gain of NT$ 447 million (US$ 14 million), mainly due to lower loss on disposal of property, plant and equipment and reversal of impairment losses in 2025.',
    comp:[['⚖️','Disposals and impairments','Gains and losses on disposing of plant and equipment, and impairment charges or reversals.']],
    compNote:'Shown with the expense sign in this bridge: a net gain is a negative cost.',
    why:'Close to zero in most years — a reconciling line, not a cost driver.',
    drivers:[['🔧','Equipment disposals','2025 swung to a gain on “lower loss on disposal of property, plant and equipment and reversal of impairment losses”.']] },
];
