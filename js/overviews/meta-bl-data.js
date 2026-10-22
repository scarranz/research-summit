// meta-bl-data.js — reported data for Meta Deep Dive ▸ Bottom Line ▸ General (read by ./meta-bl.js).
//
// Rule 10: only REPORTED figures and filing text here — no market data, no Summit numbers.
//
// 1) The functional expense lines (US$ million), between the BEGIN/END markers — GENERATED, not typed, by the
//    scratch builder build_meta_bl_data.py from SEC EDGAR XBRL companyfacts (CIK 0001326801):
//      · tags: RevenueFromContractWithCustomerExcludingAssessedTax · CostOfRevenue · ResearchAndDevelopmentExpense ·
//        SellingAndMarketingExpense (Meta's "Marketing and sales") · GeneralAndAdministrativeExpense ·
//        ShareBasedCompensation (annual `sbc`, cash-flow statement) — as filed in Meta's Forms 10-K and 10-Q.
//      · a Q4 is the fiscal year minus the nine-month year-to-date (Meta tags no Q4 duration), so a Q4 line can
//        differ by $1M from the earnings release through rounding.
//      · tie-out run at generation: revenue − the four lines = reported income from operations (OperatingIncomeLoss)
//        in every year FY2018–FY2025 and every quarter 1Q22–2Q26, to the US$ million. Meta has no "other
//        operating" line: these four ARE its costs and expenses.
//
// 2) META_SBC_FN — share-based compensation by income-statement line, FY2023–FY2025: Form 10-K FY2025, Note 12
//    (Stockholders' Equity), the table of share-based compensation expense by line item.
//
// 3) META_TAX_ONEOFF — the two discrete tax items that make GAAP net income unrepresentative (the "Normalized" view):
//      · 3Q25 charge $15.93B on enactment of the One Big Beautiful Bill Act (OBBBA) — Form 10-K FY2025, MD&A
//        "Provision for income taxes" and Note 14 (Income Taxes): "we recorded a $15.93 billion charge in the third
//        quarter of 2025, of which $14.03 billion was a valuation allowance against our U.S. federal deferred tax
//        assets as of the enactment date of OBBBA". Effective tax rate 30% in 2025, 13% absent the charge.
//      · 1Q26 benefit $8.03B under Treasury Notice 2026-7 (CAMT relief) — Form 10-Q for 1Q26, Note 10 (Income Taxes)
//        and MD&A: "we recognized an $8.03 billion discrete income tax benefit during the first quarter of 2026, which
//        partially offsets the $15.93 billion discrete charge recognized in the third quarter of 2025".
//    `amt` carries the EXPENSE sign (a charge is positive, a benefit negative), in US$ million.
//
// 4) META_EW_LINES — one dive per line. Quotes are verbatim: Form 10-K FY2025 (filed Jan 29 2026), Item 7 MD&A
//    ("Cost of Revenue and Operating Expenses" and "Results of Operations") and Notes 1 and 6; Form 10-Q 2Q26 (filed
//    Jul 30 2026), MD&A; earnings calls from docs/calls/META.md (reflowed IR transcripts). The amount, share of revenue,
//    margin effect, SBC inside the line and the share-of-revenue bars are computed in meta-bl.js from the series
//    above — never typed here.

// BEGIN GENERATED (build_meta_bl_data.py, SEC EDGAR XBRL companyfacts, CIK 0001326801, pulled 2026-10-20)
export var META_OPEX_YEARS=[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var META_OPEX={
  2018:{"revenue": 55838, "costOfRevenue": 9355, "rnd": 10273, "marketing": 7846, "gAdmin": 3451, "sbc": 4152},
  2019:{"revenue": 70697, "costOfRevenue": 12770, "rnd": 13600, "marketing": 9876, "gAdmin": 10465, "sbc": 4836},
  2020:{"revenue": 85965, "costOfRevenue": 16692, "rnd": 18447, "marketing": 11591, "gAdmin": 6564, "sbc": 6536},
  2021:{"revenue": 117929, "costOfRevenue": 22649, "rnd": 24655, "marketing": 14043, "gAdmin": 9829, "sbc": 9164},
  2022:{"revenue": 116609, "costOfRevenue": 25249, "rnd": 35338, "marketing": 15262, "gAdmin": 11816, "sbc": 11992},
  2023:{"revenue": 134902, "costOfRevenue": 25959, "rnd": 38483, "marketing": 12301, "gAdmin": 11408, "sbc": 14027},
  2024:{"revenue": 164501, "costOfRevenue": 30161, "rnd": 43873, "marketing": 11347, "gAdmin": 9740, "sbc": 16690},
  2025:{"revenue": 200966, "costOfRevenue": 36175, "rnd": 57372, "marketing": 11991, "gAdmin": 12152, "sbc": 20427},
};
export var META_OPEXQ=[
  {"p": "1Q22", "yr": 2022, "q": "Q1", "revenue": 27908, "costOfRevenue": 6005, "rnd": 7707, "marketing": 3312, "gAdmin": 2360},
  {"p": "2Q22", "yr": 2022, "q": "Q2", "revenue": 28822, "costOfRevenue": 5192, "rnd": 8690, "marketing": 3595, "gAdmin": 2987},
  {"p": "3Q22", "yr": 2022, "q": "Q3", "revenue": 27714, "costOfRevenue": 5716, "rnd": 9170, "marketing": 3780, "gAdmin": 3384},
  {"p": "4Q22", "yr": 2022, "q": "Q4", "revenue": 32165, "costOfRevenue": 8336, "rnd": 9771, "marketing": 4574, "gAdmin": 3085},
  {"p": "1Q23", "yr": 2023, "q": "Q1", "revenue": 28645, "costOfRevenue": 6108, "rnd": 9381, "marketing": 3044, "gAdmin": 2885},
  {"p": "2Q23", "yr": 2023, "q": "Q2", "revenue": 31999, "costOfRevenue": 5945, "rnd": 9344, "marketing": 3154, "gAdmin": 4164},
  {"p": "3Q23", "yr": 2023, "q": "Q3", "revenue": 34146, "costOfRevenue": 6210, "rnd": 9241, "marketing": 2877, "gAdmin": 2070},
  {"p": "4Q23", "yr": 2023, "q": "Q4", "revenue": 40111, "costOfRevenue": 7695, "rnd": 10517, "marketing": 3226, "gAdmin": 2289},
  {"p": "1Q24", "yr": 2024, "q": "Q1", "revenue": 36455, "costOfRevenue": 6640, "rnd": 9978, "marketing": 2564, "gAdmin": 3455},
  {"p": "2Q24", "yr": 2024, "q": "Q2", "revenue": 39071, "costOfRevenue": 7308, "rnd": 10537, "marketing": 2721, "gAdmin": 3658},
  {"p": "3Q24", "yr": 2024, "q": "Q3", "revenue": 40589, "costOfRevenue": 7375, "rnd": 11177, "marketing": 2822, "gAdmin": 1865},
  {"p": "4Q24", "yr": 2024, "q": "Q4", "revenue": 48385, "costOfRevenue": 8839, "rnd": 12180, "marketing": 3240, "gAdmin": 762},
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 42314, "costOfRevenue": 7572, "rnd": 12150, "marketing": 2757, "gAdmin": 2280},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 47516, "costOfRevenue": 8491, "rnd": 12942, "marketing": 2979, "gAdmin": 2663},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 51242, "costOfRevenue": 9206, "rnd": 15144, "marketing": 2845, "gAdmin": 3512},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 59893, "costOfRevenue": 10906, "rnd": 17135, "marketing": 3410, "gAdmin": 3697},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 56311, "costOfRevenue": 10218, "rnd": 17699, "marketing": 2908, "gAdmin": 2614},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 60801, "costOfRevenue": 11330, "rnd": 21656, "marketing": 3431, "gAdmin": 5609},
];
// END GENERATED

// Share-based compensation by line item, US$ million — 10-K FY2025, Note 12 (sums to the cash-flow SBC above).
export var META_SBC_FN={
  2023:{ costOfRevenue:740,  rnd:11429, marketing:952,  gAdmin:906 },
  2024:{ costOfRevenue:1055, rnd:13683, marketing:1026, gAdmin:926 },
  2025:{ costOfRevenue:1124, rnd:17485, marketing:926,  gAdmin:892 },
};
export var META_SBC_FN_SRC='Form 10-K FY2025, Note 12 (Stockholders’ Equity)';

// Discrete tax items (US$ million, expense sign). See the header, item 3.
export var META_TAX_ONEOFF=[
  { y:2025, q:'3Q25', amt:15930, lab:'OBBBA deferred-tax charge', src:'Form 10-K FY2025, Note 14 — Income Taxes',
    note:'the 10-K’s “13% absent the charge” strips only its $14.03B valuation-allowance part' },
  { y:2026, q:'1Q26', amt:-8030, lab:'CAMT-relief tax benefit under Treasury Notice 2026-7', src:'Form 10-Q for 1Q26, Note 10 — Income Taxes' },
];

export var META_EW_SRC='— Meta Form 10-K for FY2025, Item 7 (MD&amp;A), Cost of Revenue and Operating Expenses · SEC EDGAR';

export var META_EW_LINES=[
  { k:'costOfRevenue', name:'Cost of revenue',
    kpiExtra:['$2.92B','less depreciation in FY2025 from longer server and network lives (10-K Note 1, all lines)'],
    def:'Our cost of revenue consists of expenses associated with the delivery and distribution of our products. These mainly include expenses related to the operation of our data centers and technical infrastructure, such as depreciation expense from servers, network infrastructure and buildings, employee compensation which includes payroll, share-based compensation and benefits for employees on our operations teams, and energy and bandwidth costs. Cost of revenue also consists of costs associated with partner arrangements, including traffic acquisition costs and credit card and other fees related to processing customer transactions; RL inventory costs, which consist of cost of products sold and estimated losses on non-cancelable contractual commitments; and content costs.',
    comp:[['🏭','Data centers &amp; technical infrastructure','Depreciation of servers, network infrastructure and buildings; pay of the operations teams; energy and bandwidth.'],
          ['🤝','Partners, Reality Labs and content','Traffic acquisition costs and payment-processing fees; the cost of Reality Labs products sold; content costs.']],
    compNote:'The 10-K lists what sits inside cost of revenue but gives no dollar split by component, so the bridge and the cost-structure view draw it as one bar.',
    unit:'<div class="ew-note">Meta does not disclose a dollar cost per unit — per ad impression, per user or per unit of compute — so there is no unit cost to show here.</div>',
    why:'<b>The gross-margin line</b> — and the one the AI build lands in, because servers depreciate here. The 10-K on 2025: “Cost of revenue in 2025 increased $6.01 billion, or 20%, compared to 2024. The increase was mainly due to higher operational expenses related to our data centers and technical infrastructure, which included decreases in the depreciation growth rate due to an extension in the useful lives of servers and network assets, effective January 1, 2025. To a lesser extent, higher costs associated with partner arrangements also contributed to the increase.”',
    drivers:[['🖥️','Depreciation of the capex wave','Servers and network depreciation was $13.36B in 2025 against $11.34B in 2024, company-wide (10-K Note 6).'],
             ['⏳','Server useful lives','Extended to 5.5 years from January 1 2025, for “a reduction in depreciation expense of $2.92 billion” in 2025 (10-K Note 1).'],
             ['☁️','Third-party cloud','2Q26: “The increases were primarily due to higher infrastructure expenses related to our data centers, technical infrastructure, and third-party cloud services.” (10-Q)'],
             ['🤝','Partner payments','“To a lesser extent, higher costs associated with partner arrangements also contributed to the increase.” (10-K, 2025)']],
    calls:[{q:'2Q25', txt:'“Cost of revenue increased 16%, driven mostly by higher infrastructure costs and payments to partners, partially offset by a benefit from the previously announced extension of server useful lives.”', who:'Susan Li, CFO'},
           {q:'4Q25', txt:'“The majority of expense growth will be driven by infrastructure costs, which includes third party cloud spend, higher depreciation, and higher infrastructure operating expenses.”', who:'Susan Li, CFO'},
           {q:'1Q26', txt:'“The growth in infrastructure costs was due to higher depreciation, data center operating costs, and third party cloud spend.”', who:'Susan Li, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['8%','growth in engineering and technical headcount, 2025 (10-K MD&amp;A)'],
    def:'Research and development expenses consist mostly of employee compensation which includes payroll, share-based compensation and benefits for our employees on our engineering and technical teams who are responsible for developing new technologies and products; infrastructure costs; RL technology development costs; and facilities-related costs.',
    comp:[['👩‍💻','Engineering and technical pay','Payroll, share-based compensation and benefits of the engineering and technical teams — where most of Meta’s SBC sits.'],
          ['🧠','Infrastructure and Reality Labs development','Infrastructure costs, RL technology development costs and facilities.']],
    unit:'<div class="ew-note">Meta does not disclose a cost per engineer or per model trained, so there is no unit cost to show here.</div>',
    why:'The largest expense line — the AI talent and compute race runs through it. The 10-K on 2025: “Research and development expenses in 2025 increased $13.50 billion, or 31%, compared to 2024. The increase was mostly due to higher employee compensation and infrastructure costs related to research and development, including our AI initiatives. The higher employee compensation was primarily from an 8% growth in employee headcount from 2024 to 2025 in engineering and other technical functions and an increase in share-based compensation expense.”',
    drivers:[['🧑‍🔬','AI talent','Technical hiring, “particularly AI talent” (calls below), lifts both cash pay and share-based compensation.'],
             ['🪙','Compute and AI tokens','2Q26: the increase was “primarily due to higher employee compensation, infrastructure expenses related to our data centers, technical infrastructure, and third-party cloud services, and third-party AI token costs.” (10-Q)'],
             ['✂️','Severance','2Q26: “The higher employee compensation was mainly from increases in share-based compensation expense and severance expenses” (10-Q).']],
    calls:[{q:'2Q25', txt:'“R&amp;D increased 23%, mostly due to higher employee compensation and infrastructure costs.”', who:'Susan Li, CFO'},
           {q:'4Q25', txt:'“The second-largest contributor to total expense growth is employee compensation, driven by investments in technical talent.”', who:'Susan Li, CFO'},
           {q:'1Q26', txt:'“The growth in employee compensation was driven by technical hires we’ve added over the past year, particularly AI talent.”', who:'Susan Li, CFO'}] },
  { k:'marketing', name:'Marketing &amp; sales',
    kpiExtra:['$2.09B','advertising expense inside the line, FY2025 (10-K Note 1)'],
    def:'Marketing and sales expenses consist mostly of employee compensation which includes payroll, share-based compensation and benefits for our employees engaged in sales, sales support, marketing, business development, and customer service functions; professional services to support our community and product operations; and marketing and promotional expenses.',
    comp:[['📣','Sales and marketing people','Pay of sales, sales support, marketing, business development and customer service.'],
          ['🛡️','Professional services and promotion','Professional services for community and product operations (platform integrity), plus marketing and promotion.']],
    unit:'<div class="ew-note">Meta does not disclose a cost per advertiser or per user acquired.</div>',
    why:'The line that shrinks as a share of revenue as Meta grows. The 10-K on 2025: “Marketing and sales expenses in 2025 increased $644 million, or 6%, compared to 2024. The increase was mainly due to higher professional services related to our ongoing platform integrity efforts.”',
    drivers:[['🛡️','Platform integrity','Professional services for “our ongoing platform integrity efforts” drove the 2025 increase (10-K).'],
             ['🪙','AI tokens and severance','2Q26: “The increases were primarily due to higher third-party AI token costs and severance expenses.” (10-Q)']],
    calls:[{q:'2Q25', txt:'“Marketing &amp; Sales increased 9%, primarily due to an increase in professional services related to our ongoing platform integrity efforts as well as marketing costs, partially offset by lower employee compensation.”', who:'Susan Li, CFO'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['$2.40B','charges for legal proceedings in 2Q26 alone (10-Q)'],
    def:'General and administrative expenses consist primarily of employee compensation which includes payroll, share-based compensation and benefits for certain of our executives as well as our legal, finance, human resources, corporate communications and policy, and other administrative employees; legal-related costs, which include estimated fines, settlements, or other losses in connection with legal and related matters, as well as other legal fees; other taxes, such as digital services taxes and other non-income-based tax levies; and professional services.',
    comp:[['⚖️','Legal-related costs','Estimated fines, settlements and other losses on legal matters, plus legal fees — the swing item.'],
          ['🏛️','Corporate functions and other taxes','Executives, legal, finance, HR, policy; digital services taxes and other non-income levies.']],
    unit:'<div class="ew-note">Not a unit-cost line: it moves with legal accruals, not with volume.</div>',
    why:'The volatile line — legal accruals and their reversals move it by billions in a quarter. The 10-K on 2025: “General and administrative expenses in 2025 increased $2.41 billion, or 25%, compared to 2024. The increase was mainly due to higher legal-related costs, which included lapping of a $1.55 billion decrease in accrued losses for certain legal proceedings that benefited the prior year.”',
    drivers:[['⚖️','Legal accruals','2Q26: “The increases were primarily due to $2.40 billion of charges related to legal proceedings in the three months ended June 30, 2026.” (10-Q)'],
             ['↩️','Accrual reversals','A $1.55B decrease in accrued legal losses flattered 2024, so 2025 grew against a low base (10-K).']],
    calls:[{q:'2Q25', txt:'“G&amp;A decreased 27%, driven mostly by lower legal-related costs.”', who:'Susan Li, CFO'},
           {q:'4Q25', txt:'“Legal expense growth was due to both lapping legal accrual reversals in Q4’24 and charges recorded in Q4’25.”', who:'Susan Li, CFO'},
           {q:'1Q26', txt:'“…we continue to see scrutiny on youth-related issues and have additional trials scheduled for this year in the US, which may ultimately result in a material loss.”', who:'Susan Li, CFO'}] },
];

// 5) META_SEG_Y / META_SEG_Q — the segment table (Bottom Line ▸ Segments, BL-SEG), US$ million, typed from the filings'
//    segment note ("segment information of revenue, expenses, and income (loss) from operations"): Form 10-K FY2024 and
//    FY2025, Note 15 (FY2022–FY2025); Forms 10-Q 1Q25–2Q26 (each quarter plus its prior-year comparative, so 1Q24–3Q24
//    come from the 2025 10-Qs). A Q4 is the fiscal year less the nine months, so a Q4 can differ by $1M–3M from the sum
//    of the quarters through rounding. In every row rev − comp − other = oi (checked when typed).
//    comp  = "Employee compensation": payroll, share-based compensation, bonus and benefits (2Q26 includes $1.18B of
//            severance for the May 2026 reduction of ~8,000 employees, across both segments).
//    other = "Other costs and expenses": FoA — infrastructure, professional services, partner arrangements, marketing,
//            facilities, legal-related costs and other; RL — inventory, professional services, marketing, infrastructure,
//            facilities and other.
//    Meta discloses no D&A, capex or assets by segment (the CODM "does not evaluate operating segments using asset or
//    liability information"), so there is no segment EBITDA.
export var META_SEG_Y={
  2022:{ foa:{rev:114450, comp:28545, other:43244, oi:42661},  rl:{rev:2159, comp:7766,  other:8110,  oi:-13717} },
  2023:{ foa:{rev:133006, comp:28878, other:41257, oi:62871},  rl:{rev:1896, comp:8942,  other:9074,  oi:-16120} },
  2024:{ foa:{rev:162355, comp:31116, other:44130, oi:87109},  rl:{rev:2146, comp:10211, other:9664,  oi:-17729} },
  2025:{ foa:{rev:198759, comp:39943, other:56347, oi:102469}, rl:{rev:2207, comp:10759, other:10641, oi:-19193} }
};
export var META_SEG_Q=[
  { p:'1Q24', foa:{rev:36015, comp:7445,  other:10906, oi:17664}, rl:{rev:440,  comp:2458, other:1828, oi:-3846} },
  { p:'2Q24', foa:{rev:38718, comp:7746,  other:11637, oi:19335}, rl:{rev:353,  comp:2600, other:2241, oi:-4488} },
  { p:'3Q24', foa:{rev:40319, comp:8089,  other:10452, oi:21778}, rl:{rev:270,  comp:2655, other:2043, oi:-4428} },
  { p:'4Q24', foa:{rev:47302, comp:7836,  other:11135, oi:28331}, rl:{rev:1083, comp:2498, other:3552, oi:-4967} },
  { p:'1Q25', foa:{rev:41902, comp:9031,  other:11106, oi:21765}, rl:{rev:412,  comp:2777, other:1845, oi:-4210} },
  { p:'2Q25', foa:{rev:47146, comp:9336,  other:12839, oi:24971}, rl:{rev:370,  comp:2523, other:2377, oi:-4530} },
  { p:'3Q25', foa:{rev:50772, comp:10645, other:15160, oi:24967}, rl:{rev:470,  comp:2594, other:2308, oi:-4432} },
  { p:'4Q25', foa:{rev:58938, comp:10932, other:17239, oi:30767}, rl:{rev:955,  comp:2864, other:4113, oi:-6022} },
  { p:'1Q26', foa:{rev:55909, comp:12079, other:16930, oi:26900}, rl:{rev:402,  comp:2545, other:1885, oi:-4028} },
  { p:'2Q26', foa:{rev:60370, comp:14571, other:22405, oi:23394}, rl:{rev:431,  comp:2468, other:2582, oi:-4619} }
];
export var META_SEG_SRC='Meta Forms 10-K FY2024 and FY2025 (Note 15, Segment and Geographical Information) and Forms 10-Q 1Q25–2Q26 (segment note) · SEC EDGAR';
// The 10-K's own words on how costs reach a segment (Form 10-K FY2025, Note 15), verbatim.
export var META_SEG_ALLOC={
  codm:'Our CODM uses consolidated and operating segment’s revenue and income (loss) from operations to allocate resources during our annual planning process and to assess performance. Our CODM does not evaluate operating segments using asset or liability information.',
  direct:'These directly attributable costs and expenses include certain product development related operating expenses, costs associated with partnership arrangements, consumer hardware product costs, content costs, and legal-related costs.',
  indirect:'Indirect operating expenses, such as facilities, information technology, certain shared research and development activities, recruiting, and physical security expenses are mostly allocated based on headcount.',
  infra:'Costs related to the operation of our data centers and technical infrastructure are generally allocated to our segments based on estimated usage, most of which is allocated to the FoA segment.'
};
// One deep dive per segment. Definitions verbatim from the 10-K FY2025 Note 15; "other" composition verbatim from the
// 10-Q 2Q26 footnotes; calls verbatim from docs/calls/META.md (the 2Q26 call is reconstructed from press, so it is not
// quoted). Every number in the key figures and the bars is computed in meta-bl.js from META_SEG_Y / META_SEG_Q.
export var META_SEG_DIVES=[
  { k:'foa', name:'Family of Apps',
    def:'FoA includes Facebook, Instagram, Messenger, WhatsApp, and other services.',
    otherDef:'Includes costs and expenses in FoA segment for infrastructure, professional services, partner arrangements, marketing, facilities, legal-related costs, and other expenses.',
    business:'The advertising business, and all of Meta’s profit: its operating income pays for the Reality Labs loss, and what remains is the consolidated operating income. Most of the AI and data-center build lands here, because infrastructure is allocated by usage.',
    moves:[
      ['Advertising revenue','Impressions × average price per ad (Top Line ▸ Segments). Revenue grew faster than segment costs in 2023 and 2024, so the margin widened; in 2025 and the first half of 2026 costs grew faster and it narrowed (cost-split table above).'],
      ['Infrastructure','Data-center operation, depreciation and third-party cloud sit in “other costs”, and are “generally allocated … based on estimated usage, most of which is allocated to the FoA segment” (10-K Note 15). The capex cycle reaches the segment through this line (Miscellaneous ▸ Capex &amp; Depreciation).'],
      ['Employee compensation','Technical and AI hiring, share-based compensation and, in 2Q26, severance from the May 2026 reduction (10-Q 2Q26).'],
      ['Legal-related costs','Charged to the segment directly (10-K Note 15); 2Q26 carried $2.40B of charges for legal proceedings (10-Q 2Q26, MD&amp;A).']
    ],
    calls:[
      {q:'4Q24', txt:'“In Q4, Family of Apps expenses were $19.0 billion, representing 76% of our overall expenses. Family of Apps expenses were up 5%, primarily due to growth in infrastructure costs and employee compensation, which were partially offset by lower legal-related expenses. Family of Apps operating income was $28.3 billion, representing a 60% operating margin.”', who:'Susan Li, CFO'},
      {q:'2Q25', txt:'“In Q2, Family of Apps expenses were $22.2 billion, representing 82% of our overall expenses. Family of Apps expenses were up 14%, mainly due to growth in employee compensation and infrastructure costs, partially offset by lower legal-related costs. Family of Apps operating income was $25.0 billion, representing a 53% operating margin.”', who:'Susan Li, CFO'},
      {q:'4Q25', txt:'“At a segment level, we expect expense growth to be driven by the Family of Apps, with Reality Labs operating losses remaining similar to 2025 levels.”', who:'Susan Li, CFO'}
    ] },
  { k:'rl', name:'Reality Labs',
    def:'RL includes our virtual and augmented reality related consumer hardware, software, and content.',
    otherDef:'Includes costs and expenses in RL segment for inventory, professional services, marketing, infrastructure, facilities, and other expenses.',
    business:'A research budget with a small hardware business attached: revenue is about 1% of Meta’s, and the cost base is roughly half people and half everything else. The loss is set by how much Meta chooses to spend, not by sales. Its products are described in Top Line ▸ Segments.',
    moves:[
      ['Employee compensation','About half of the segment’s costs: the engineers building headsets, glasses and future devices.'],
      ['Inventory and hardware cost','Consumer hardware product costs are charged to the segment directly (10-K Note 15). They rise with Quest and glasses volumes, which is why Q4 carries both the most revenue and the largest loss.'],
      ['Portfolio mix','In 2026 spend moved from VR and Horizon to wearables (calls below). Management expects 2026 losses similar to 2025 and lower from 2027, without a stated path.'],
      ['Revenue','Small and seasonal: Q4 holiday hardware sales, and retail partners stocking Quest ahead of it. Revenue has not covered even the segment’s employee compensation in any quarter of the series.']
    ],
    calls:[
      {q:'4Q24', txt:'“…we expect in 2025 that roughly half of our Reality Labs investment will be across the Wearables initiatives and the remaining half on Metaverse.”', who:'Susan Li, CFO'},
      {q:'1Q25', txt:'“Reality Labs expenses were $4.6 billion, up 8% year-over-year driven primarily by higher employee compensation.”', who:'Susan Li, CFO'},
      {q:'4Q25', txt:'“I expect Reality Labs losses this year to be similar to last year, and this will likely be the peak as we start to gradually reduce our losses going forward while continuing to execute on our vision.”', who:'Mark Zuckerberg, CEO'},
      {q:'4Q25', txt:'“So, we are meaningfully reducing our investment in VR and Horizon this year, but we’re growing our investment in wearables to capitalize on the momentum that we’re seeing in our position as a market leader.”', who:'Susan Li, CFO'},
      {q:'4Q25', txt:'“So, I think our expectation is for Reality Labs losses to trend down from 2026 levels, but it’s hard to characterize the exact shape of that line.”', who:'Susan Li, CFO'}
    ] }
];
