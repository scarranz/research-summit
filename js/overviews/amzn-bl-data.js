// amzn-bl-data.js — reported data for Amazon Deep Dive ▸ Bottom Line ▸ General and Segments (read by ./amzn-bl.js).
//
// Rule 10: only REPORTED figures and filing / call text here — no market data, no Summit numbers.
//
// 1) The functional expense lines, SBC by line and the segment rows (US$ million), between the BEGIN/END markers —
//    GENERATED, not typed, by the scratch builder build_amzn_bl_data.py from the XBRL instance documents of Amazon's
//    Forms 10-K (FY2020, FY2023, FY2024, FY2025) and 10-Q (1Q23–2Q26), SEC EDGAR CIK 0001018724:
//      · tags: RevenueFromContractWithCustomerExcludingAssessedTax · CostOfGoodsAndServicesSold (cost of sales) ·
//        amzn:FulfillmentExpense · amzn:TechnologyAndInfrastructureExpense (amzn:TechnologyAndContentExpense through
//        FY2020 — the same line, renamed "Technology and infrastructure" in 2023) · MarketingExpense (Amazon's "Sales and
//        marketing") · GeneralAndAdministrativeExpense · OtherOperatingIncomeExpenseNet (XBRL is income-positive; the
//        sign is flipped here so `otherOpex` is an EXPENSE, as on the income statement) · OperatingIncomeLoss ·
//        ShareBasedCompensation (annual `sbc`, cash-flow statement).
//      · these six lines ARE Amazon's "Total operating expenses": tie-out run at generation — revenue − cost of sales −
//        fulfillment − technology and infrastructure − sales and marketing − G&A − other operating expense (income), net
//        = reported operating income in every year FY2018–FY2025 and every quarter 1Q23–3Q26, to the US$ million
//        (23 periods, 0 differences).
//      · a Q4 is the fiscal year minus the nine-month year-to-date, so a Q4 line can differ by $1M from the earnings
//        release through rounding. Where a later filing restates a prior-period column, the later filing is used.
//      · 3Q26 (Oct 29 2026) typed from the 8-K Ex. 99.1 of that date (consolidated statements of operations and segment
//        information); it ties to operating income ($28,076M) the same way.
//      · AMZN_SBC_FN: AllocatedShareBasedCompensationExpense by IncomeStatementLocationAxis — the 10-K table of
//        stock-based compensation by line (Note 8, Stockholders' Equity, in the FY2025 10-K). Each year's five lines add
//        up to total SBC (cash-flow statement) exactly.
//      · AMZN_SEG_Y / AMZN_SEG_Q: segment net sales, operating expenses, operating income and "total depreciation and
//        amortization expense, by segment" (us-gaap:Depreciation by segment, 10-K / 10-Q Note "Segment Information").
//        Checked at generation: rev − opex = oi in every segment-period, and the three segments add up to consolidated
//        net sales and operating income. Quarterly segment D&A is tagged from 1Q24; 2023 quarters and 3Q26 (the 8-K
//        does not give it) are null.
//
// 2) AMZN_EW_LINES — one dive per line, in 10-K order. `def` is verbatim from the Form 10-K FY2025 (filed Feb 6 2026),
//    Item 8, Note 1 — Description of Business, Accounting Policies, and Supplemental Disclosures. Quotes in `why` and
//    `drivers` are verbatim from the 10-K FY2025 Item 7 (MD&A, "Operating Expenses") or the Form 10-Q for 2Q26 (filed
//    Jul 31 2026, MD&A). `calls` are verbatim management remarks from The Motley Fool's transcripts of the 4Q25, 1Q26
//    and 2Q26 calls. Amounts, shares of revenue, the margin effect, SBC inside each line and the share-of-revenue bars
//    are computed in amzn-bl.js from the series above — never typed here. Content from the earlier Amazon expense dives
//    (amzn.js EW_LINES / EW_UNIT / EW_DEF) is kept in substance; the paraphrases that sat inside quotation marks there
//    are replaced by verbatim quotes or moved out of quotation marks.
//
// BEGIN GENERATED (build_amzn_bl_data.py, SEC EDGAR XBRL instance documents, CIK 0001018724, pulled 2026-10-29)
export var AMZN_OPEX_YEARS=[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var AMZN_OPEX={
  2018:{"revenue": 232887, "cogs": 139156, "fulfillment": 34027, "techInfra": 28837, "marketing": 13814, "gAdmin": 4336, "otherOpex": 296, "oi": 12421, "sbc": 5418},
  2019:{"revenue": 280522, "cogs": 165536, "fulfillment": 40232, "techInfra": 35931, "marketing": 18878, "gAdmin": 5203, "otherOpex": 201, "oi": 14541, "sbc": 6864},
  2020:{"revenue": 386064, "cogs": 233307, "fulfillment": 58517, "techInfra": 42740, "marketing": 22008, "gAdmin": 6668, "otherOpex": -75, "oi": 22899, "sbc": 9208},
  2021:{"revenue": 469822, "cogs": 272344, "fulfillment": 75111, "techInfra": 56052, "marketing": 32551, "gAdmin": 8823, "otherOpex": 62, "oi": 24879, "sbc": 12757},
  2022:{"revenue": 513983, "cogs": 288831, "fulfillment": 84299, "techInfra": 73213, "marketing": 42238, "gAdmin": 11891, "otherOpex": 1263, "oi": 12248, "sbc": 19621},
  2023:{"revenue": 574785, "cogs": 304739, "fulfillment": 90619, "techInfra": 85622, "marketing": 44370, "gAdmin": 11816, "otherOpex": 767, "oi": 36852, "sbc": 24023},
  2024:{"revenue": 637959, "cogs": 326288, "fulfillment": 98505, "techInfra": 88544, "marketing": 43907, "gAdmin": 11359, "otherOpex": 763, "oi": 68593, "sbc": 22011},
  2025:{"revenue": 716924, "cogs": 356414, "fulfillment": 109074, "techInfra": 108521, "marketing": 47129, "gAdmin": 11172, "otherOpex": 4639, "oi": 79975, "sbc": 19467},
};
export var AMZN_OPEXQ=[
  {"p": "1Q23", "yr": 2023, "q": "Q1", "revenue": 127358, "cogs": 67791, "fulfillment": 20905, "techInfra": 20450, "marketing": 10172, "gAdmin": 3043, "otherOpex": 223, "oi": 4774},
  {"p": "2Q23", "yr": 2023, "q": "Q2", "revenue": 134383, "cogs": 69373, "fulfillment": 21305, "techInfra": 21931, "marketing": 10745, "gAdmin": 3202, "otherOpex": 146, "oi": 7681},
  {"p": "3Q23", "yr": 2023, "q": "Q3", "revenue": 143083, "cogs": 75022, "fulfillment": 22314, "techInfra": 21203, "marketing": 10551, "gAdmin": 2561, "otherOpex": 244, "oi": 11188},
  {"p": "4Q23", "yr": 2023, "q": "Q4", "revenue": 169961, "cogs": 92553, "fulfillment": 26095, "techInfra": 22038, "marketing": 12902, "gAdmin": 3010, "otherOpex": 154, "oi": 13209},
  {"p": "1Q24", "yr": 2024, "q": "Q1", "revenue": 143313, "cogs": 72633, "fulfillment": 22317, "techInfra": 20424, "marketing": 9662, "gAdmin": 2742, "otherOpex": 228, "oi": 15307},
  {"p": "2Q24", "yr": 2024, "q": "Q2", "revenue": 147977, "cogs": 73785, "fulfillment": 23566, "techInfra": 22304, "marketing": 10512, "gAdmin": 3041, "otherOpex": 97, "oi": 14672},
  {"p": "3Q24", "yr": 2024, "q": "Q3", "revenue": 158877, "cogs": 80977, "fulfillment": 24660, "techInfra": 22245, "marketing": 10609, "gAdmin": 2713, "otherOpex": 262, "oi": 17411},
  {"p": "4Q24", "yr": 2024, "q": "Q4", "revenue": 187792, "cogs": 98893, "fulfillment": 27962, "techInfra": 23571, "marketing": 13124, "gAdmin": 2863, "otherOpex": 176, "oi": 21203},
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 155667, "cogs": 76976, "fulfillment": 24593, "techInfra": 22994, "marketing": 9763, "gAdmin": 2628, "otherOpex": 308, "oi": 18405},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 167702, "cogs": 80809, "fulfillment": 25976, "techInfra": 27166, "marketing": 11416, "gAdmin": 2965, "otherOpex": 199, "oi": 19171},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 180169, "cogs": 88670, "fulfillment": 27679, "techInfra": 28962, "marketing": 11686, "gAdmin": 2875, "otherOpex": 2875, "oi": 17422},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 213386, "cogs": 109959, "fulfillment": 30826, "techInfra": 29399, "marketing": 14264, "gAdmin": 2704, "otherOpex": 1257, "oi": 24977},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 181519, "cogs": 87463, "fulfillment": 27289, "techInfra": 29567, "marketing": 10314, "gAdmin": 2587, "otherOpex": 447, "oi": 23852},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 200606, "cogs": 95778, "fulfillment": 29633, "techInfra": 33158, "marketing": 11698, "gAdmin": 2788, "otherOpex": 90, "oi": 27461},
  {"p": "3Q26", "yr": 2026, "q": "Q3", "revenue": 201944, "cogs": 94573, "fulfillment": 29997, "techInfra": 34814, "marketing": 11649, "gAdmin": 2701, "otherOpex": 134, "oi": 28076},
];
export var AMZN_SBC_FN={
  2018:{"cogs": 73, "fulfillment": 1121, "techInfra": 2888, "marketing": 769, "gAdmin": 567},
  2019:{"cogs": 149, "fulfillment": 1182, "techInfra": 3725, "marketing": 1135, "gAdmin": 673},
  2020:{"cogs": 283, "fulfillment": 1357, "techInfra": 5061, "marketing": 1710, "gAdmin": 797},
  2021:{"cogs": 540, "fulfillment": 1946, "techInfra": 6645, "marketing": 2530, "gAdmin": 1096},
  2022:{"cogs": 757, "fulfillment": 2745, "techInfra": 10621, "marketing": 3875, "gAdmin": 1623},
  2023:{"cogs": 836, "fulfillment": 3090, "techInfra": 13434, "marketing": 4623, "gAdmin": 2040},
  2024:{"cogs": 838, "fulfillment": 2973, "techInfra": 12150, "marketing": 4084, "gAdmin": 1966},
  2025:{"cogs": 777, "fulfillment": 2703, "techInfra": 10871, "marketing": 3445, "gAdmin": 1671},
};
export var AMZN_SEG_Y={
  2018:{"na": {"rev": 141366, "opex": 134099, "da": 4415, "oi": 7267}, "intl": {"rev": 65866, "opex": 68008, "da": 1628, "oi": -2142}, "aws": {"rev": 25655, "opex": 18359, "da": 6095, "oi": 7296}},
  2019:{"na": {"rev": 170773, "opex": 163740, "da": 5106, "oi": 7033}, "intl": {"rev": 74723, "opex": 76416, "da": 1886, "oi": -1693}, "aws": {"rev": 35026, "opex": 25825, "da": 8158, "oi": 9201}},
  2020:{"na": {"rev": 236282, "opex": 227631, "da": 6421, "oi": 8651}, "intl": {"rev": 104412, "opex": 103695, "da": 2215, "oi": 717}, "aws": {"rev": 45370, "opex": 31839, "da": 7603, "oi": 13531}},
  2021:{"na": {"rev": 279833, "opex": 272562, "da": 9234, "oi": 7271}, "intl": {"rev": 127787, "opex": 128711, "da": 3022, "oi": -924}, "aws": {"rev": 62202, "opex": 43670, "da": 10653, "oi": 18532}},
  2022:{"na": {"rev": 315880, "opex": 318727, "da": 11565, "oi": -2847}, "intl": {"rev": 118007, "opex": 125753, "da": 3483, "oi": -7746}, "aws": {"rev": 80096, "opex": 57255, "da": 9876, "oi": 22841}},
  2023:{"na": {"rev": 352828, "opex": 337951, "da": 13678, "oi": 14877}, "intl": {"rev": 131200, "opex": 133856, "da": 4016, "oi": -2656}, "aws": {"rev": 90757, "opex": 66126, "da": 12531, "oi": 24631}},
  2024:{"na": {"rev": 387497, "opex": 362530, "da": 14285, "oi": 24967}, "intl": {"rev": 142906, "opex": 139114, "da": 4462, "oi": 3792}, "aws": {"rev": 107556, "opex": 67722, "da": 13320, "oi": 39834}},
  2025:{"na": {"rev": 426305, "opex": 396686, "da": 15503, "oi": 29619}, "intl": {"rev": 161894, "opex": 157144, "da": 4907, "oi": 4750}, "aws": {"rev": 128725, "opex": 83119, "da": 21450, "oi": 45606}},
};
export var AMZN_SEG_Q=[
  {"p": "1Q23", "na": {"rev": 76881, "opex": 75983, "da": null, "oi": 898}, "intl": {"rev": 29123, "opex": 30370, "da": null, "oi": -1247}, "aws": {"rev": 21354, "opex": 16231, "da": null, "oi": 5123}},
  {"p": "2Q23", "na": {"rev": 82546, "opex": 79335, "da": null, "oi": 3211}, "intl": {"rev": 29697, "opex": 30592, "da": null, "oi": -895}, "aws": {"rev": 22140, "opex": 16775, "da": null, "oi": 5365}},
  {"p": "3Q23", "na": {"rev": 87887, "opex": 83580, "da": null, "oi": 4307}, "intl": {"rev": 32137, "opex": 32232, "da": null, "oi": -95}, "aws": {"rev": 23059, "opex": 16083, "da": null, "oi": 6976}},
  {"p": "4Q23", "na": {"rev": 105514, "opex": 99053, "da": null, "oi": 6461}, "intl": {"rev": 40243, "opex": 40662, "da": null, "oi": -419}, "aws": {"rev": 24204, "opex": 17037, "da": null, "oi": 7167}},
  {"p": "1Q24", "na": {"rev": 86341, "opex": 81358, "da": 3373, "oi": 4983}, "intl": {"rev": 31935, "opex": 31032, "da": 1054, "oi": 903}, "aws": {"rev": 25037, "opex": 15616, "da": 2839, "oi": 9421}},
  {"p": "2Q24", "na": {"rev": 90033, "opex": 84968, "da": 3517, "oi": 5065}, "intl": {"rev": 31663, "opex": 31390, "da": 1049, "oi": 273}, "aws": {"rev": 26281, "opex": 16947, "da": 3078, "oi": 9334}},
  {"p": "3Q24", "na": {"rev": 95537, "opex": 89874, "da": 3611, "oi": 5663}, "intl": {"rev": 35888, "opex": 34587, "da": 1164, "oi": 1301}, "aws": {"rev": 27452, "opex": 17005, "da": 3541, "oi": 10447}},
  {"p": "4Q24", "na": {"rev": 115586, "opex": 106330, "da": 3784, "oi": 9256}, "intl": {"rev": 43420, "opex": 42105, "da": 1195, "oi": 1315}, "aws": {"rev": 28786, "opex": 18154, "da": 3862, "oi": 10632}},
  {"p": "1Q25", "na": {"rev": 92887, "opex": 87046, "da": 3530, "oi": 5841}, "intl": {"rev": 33513, "opex": 32496, "da": 1136, "oi": 1017}, "aws": {"rev": 29267, "opex": 17720, "da": 4390, "oi": 11547}},
  {"p": "2Q25", "na": {"rev": 100068, "opex": 92551, "da": 3742, "oi": 7517}, "intl": {"rev": 36761, "opex": 35267, "da": 1180, "oi": 1494}, "aws": {"rev": 30873, "opex": 20713, "da": 4844, "oi": 10160}},
  {"p": "3Q25", "na": {"rev": 106267, "opex": 101478, "da": 4001, "oi": 4789}, "intl": {"rev": 40896, "opex": 39697, "da": 1276, "oi": 1199}, "aws": {"rev": 33006, "opex": 21572, "da": 5648, "oi": 11434}},
  {"p": "4Q25", "na": {"rev": 127083, "opex": 115611, "da": 4230, "oi": 11472}, "intl": {"rev": 50724, "opex": 49684, "da": 1315, "oi": 1040}, "aws": {"rev": 35579, "opex": 23114, "da": 6568, "oi": 12465}},
  {"p": "1Q26", "na": {"rev": 104143, "opex": 95876, "da": 4280, "oi": 8267}, "intl": {"rev": 39789, "opex": 38365, "da": 1277, "oi": 1424}, "aws": {"rev": 37587, "opex": 23426, "da": 7277, "oi": 14161}},
  {"p": "2Q26", "na": {"rev": 116177, "opex": 107054, "da": 4500, "oi": 9123}, "intl": {"rev": 42197, "opex": 40480, "da": 1293, "oi": 1717}, "aws": {"rev": 42232, "opex": 25611, "da": 8076, "oi": 16621}},
  {"p": "3Q26", "na": {"rev": 112852, "opex": 104129, "da": null, "oi": 8723}, "intl": {"rev": 43108, "opex": 41528, "da": null, "oi": 1580}, "aws": {"rev": 45984, "opex": 28211, "da": null, "oi": 17773}},
];
// END GENERATED

export var AMZN_SBC_FN_SRC='Amazon Form 10-K, Note 8 (Stockholders’ Equity), stock-based compensation expense by line — XBRL, FY2018–FY2025; forward years are Bloomberg consensus';
export var AMZN_EW_SRC='— Amazon Form 10-K for FY2025, Item 8, Note 1 (Description of Business, Accounting Policies, and Supplemental Disclosures) · SEC EDGAR';

// Composition / driver rows are [icon (ignored), label, text]. Calls: The Motley Fool transcripts, verbatim.
export var AMZN_EW_LINES=[
  { k:'cogs', name:'Cost of sales',
    kpiExtra:['$102.7B','shipping costs in FY2025, from $95.8B in FY2024 — inside cost of sales (10-K MD&amp;A)'],
    def:'Cost of sales primarily consists of the purchase price of consumer products, inbound and outbound shipping costs, including costs related to sortation and delivery centers and where we are the transportation service provider, and digital media content costs where we record revenue gross, including video and music. Shipping costs to receive products from our suppliers are included in our inventory, and recognized as cost of sales upon sale of products to our customers. Payment processing and related transaction costs, including those associated with seller transactions, are classified in “Fulfillment” on our consolidated statements of operations.',
    comp:[['','Product cost','The purchase price of the goods Amazon sells first-party, in its online and physical stores.'],
          ['','Shipping','Inbound and outbound shipping, including the sortation and delivery centers and the cases where Amazon is the transportation provider — $102.7B in FY2025 (10-K MD&amp;A).'],
          ['','Digital media content','Video and music content where Amazon records the revenue gross; licensed and original video content is amortized into cost of sales (10-K Note 1).']],
    compNote:'The 10-K reports cost of sales as one line; of its components it gives only the shipping-cost total, so the bridge and the cost-structure view draw it as a single bar. It falls as a share of revenue as third-party seller services, advertising and AWS — which carry little or no product cost — outgrow first-party retail (relocated from the earlier unit-economics panel).',
    unit:'<div class="ew-note">There is no single unit here — the economics are a mix. A first-party sale carries the full product cost; a third-party unit, an advertising dollar or an AWS dollar carries little to none. Amazon does not disclose a dollar cost per unit or per package; it reports total shipping costs and their growth.</div>',
    why:'<b>The largest line, and the one whose share of revenue has fallen most.</b> The 10-K on 2025: “The increase in cost of sales in 2025, compared to the prior year, is primarily due to increased product and shipping costs resulting from increased sales, partially offset by operational efficiencies.” Cost of sales went from 51.1% of net sales in 2024 to 49.7% in 2025 (10-K MD&amp;A).',
    drivers:[['','Mix shift to higher-margin revenue','Third-party seller services, advertising and AWS grow faster than first-party retail, so product cost shrinks as a share of revenue — the main reason the line falls.'],
             ['','Shipping offers','“We expect our cost of shipping to continue to increase to the extent our customers accept and use our shipping offers at an increasing rate, we use more expensive shipping methods, and we offer additional services.” (10-K MD&amp;A)'],
             ['','Tariff refunds (2Q26)','“Cost of sales in Q2 2026 includes tariff refunds received under the IEEPA.” (10-Q 2Q26 MD&amp;A)']],
    calls:[{q:'1Q26', txt:'“Overall unit growth of 15% continues to outpace our cost to operate the fulfillment network, as outbound shipping costs grew 12% year over year and fulfillment expense grew 9% year over year, both on an FX-neutral basis.”', who:'Brian Olsavsky, CFO'},
           {q:'2Q26', txt:'“First, we received tariff-related refunds of approximately $600 million. This is included in our North America segment and represents the significant majority of refunds we expect to receive.”', who:'Brian Olsavsky, CFO'},
           {q:'2Q26', txt:'“Excluding the impact of higher fuel and line haul rates, shipping costs grew more slowly than worldwide unit growth at a pace that is relatively consistent with last quarter.”', who:'Brian Olsavsky, CFO'}] },
  { k:'fulfillment', name:'Fulfillment',
    kpiExtra:['9% vs 15%','fulfillment expense growth vs unit growth in 1Q26, FX-neutral (CFO, 1Q26 call)'],
    def:'Fulfillment costs primarily consist of those costs incurred in operating and staffing our North America and International segments’ fulfillment centers, physical stores, and customer service centers, including facilities and equipment expenses, such as depreciation and amortization, and rent; costs attributable to buying, receiving, inspecting, and warehousing inventories; picking, packaging, and preparing customer orders for shipment; payment processing and related transaction costs, including costs associated with our guarantee for certain seller transactions; responding to inquiries from customers; and supply chain management for our manufactured electronic devices. Fulfillment costs also include amounts paid to third parties that assist us in fulfillment and customer service operations.',
    comp:[['','The fulfillment network','Operating and staffing the fulfillment centers, physical stores and customer service centers — pick, pack, warehouse — with their depreciation and rent.'],
          ['','Payment processing','Payment processing and related transaction costs, including those of seller transactions and of AWS.']],
    unit:'<div class="ew-note">Amazon does not disclose a dollar cost per unit or per package. The disclosed proxy is growth against units: in 1Q26 units grew 15% while fulfillment expense grew 9% FX-neutral (CFO), so the cost to move a unit fell. Over a million robots and the regionalized US network are the reasons management gives (see the commentary below).</div>',
    why:'<b>The retail-efficiency line</b> — held near 15% of revenue while units grew double digits. The 10-K on 2025: “The increase in fulfillment costs in 2025, compared to the prior year, is primarily due to increased sales and investments in our fulfillment network, partially offset by operational efficiencies.”',
    drivers:[['','What moves the ratio','“Fulfillment costs as a percentage of net sales may vary due to several factors, such as payment processing and related transaction costs, our level of productivity and accuracy, changes in volume, size, and weight of units received and fulfilled, the extent to which third-party sellers utilize Fulfillment by Amazon services, timing of fulfillment network and physical store expansion, the extent we utilize fulfillment services provided by third parties, mix of products and services sold, and our ability to affect customer service contacts per unit by implementing improvements in our operations and enhancements to our customer self-service features.” (10-K MD&amp;A)'],
             ['','Robotics and regionalization','The US network was split into regions (eight, now ten) and robotics are in every 2026 US large-format launch; see the commentary below.'],
             ['','One-off charges (4Q25)','Part of the 4Q25 Italy tax settlement and of the severance charge was recorded in fulfillment (CFO, 4Q25 call).']],
    calls:[{q:'4Q25', txt:'“In The US, a regionalized network is operating at scale and we continue to make refinements. This regionalization has improved local inventory placement, leading to faster delivery and lower costs.”', who:'Brian Olsavsky, CFO'},
           {q:'4Q25', txt:'“You know, we have over a million robots today in our fulfillment network.”', who:'Andy Jassy, CEO'},
           {q:'1Q26', txt:'“All of our U.S. large-format fulfillment center launches in 2026 will have this latest generation technology. We are seeing early positive results with improved site safety, higher productivity, and lower cost to serve.”', who:'Brian Olsavsky, CFO'},
           {q:'2Q26', txt:'“We\'re retrofitting our facilities with our latest generation technology, and we expect to more than double our fleet of robotic arms, like Cardinal and Sparrow, in 2026.”', who:'Brian Olsavsky, CFO'},
           {q:'2Q26', txt:'“We continue to lower our overall cost to serve, even as we face heightened transportation costs driven by fuel inflation from the conflict in the Middle East and higher line haul rates from driver capacity limitations.”', who:'Brian Olsavsky, CFO'}] },
  { k:'techInfra', name:'Technology and infrastructure',
    kpiExtra:['$21.5B','AWS depreciation and amortization in FY2025, from $13.3B in FY2024 (10-K Note 10) — most of it lands in this line'],
    def:'Technology and infrastructure costs include payroll and related expenses for employees involved in the research and development of new and existing products and services, development, design, and maintenance of our stores, curation and display of products and services made available in our online stores, and infrastructure costs. Infrastructure costs include servers, networking equipment, and data center related depreciation and amortization, rent, utilities, and other expenses necessary to support AWS and other Amazon businesses. Collectively, these costs reflect the investments we make in order to offer a wide variety of products and services to our customers, including expenditures related to initiatives to build and deploy innovative and efficient software and electronic devices and the development of a satellite network for global broadband service and autonomous vehicles for ride-hailing services. Technology and infrastructure costs are generally expensed as incurred.',
    comp:[['','Engineering payroll','Research and development for AWS, the stores, devices and AI — payroll and SBC (the largest SBC line).'],
          ['','Infrastructure and its depreciation','Servers, networking equipment and data centers, with their depreciation, rent and utilities — where the AI capex lands in the income statement.'],
          ['','New businesses','The Amazon LEO satellite network (mostly expensed as incurred until it is commercial) and Zoox autonomous vehicles.']],
    compNote:'Named Technology and content until 2023 (Forms 10-K FY2018–FY2022); the line and its tag are the same, so FY2018–FY2022 are the same series. The only line that carries both a large payroll and the depreciation of the AI build.',
    unit:'<div class="ew-note">No clean per-unit metric — the line blends engineering payroll with the depreciation of the infrastructure. The unit economics that matter are AWS’s (Segments tab): segment operating margin, and the server life and break-even management describes below. Amazon does not disclose a cost per server or per unit of compute.</div>',
    why:'<b>The one functional line rising as a share of revenue</b> — the capex reaches the income statement through depreciation before the capacity it pays for is fully used. The 10-K on 2025: “The increase in technology and infrastructure costs in 2025, compared to the prior year, is primarily due to an increase in spending on infrastructure, including depreciation and amortization.”',
    drivers:[['','The AI build','“We expect spending in technology and infrastructure to increase over time as we continue to add infrastructure and employees, including to support our artificial intelligence and machine learning initiatives.” (10-K MD&amp;A)'],
             ['','Amazon LEO','“We currently expense the majority of the costs associated with the development of our satellite network for global broadband service (including production, launch, and payroll costs, and launch services deposits upon launch).” (10-K MD&amp;A)'],
             ['','Energy contracts (2Q26)','“Technology and infrastructure costs in Q2 2026 include net unrealized gains for energy contracts that are subject to derivative accounting, primarily related to AWS.” (10-Q 2Q26 MD&amp;A)']],
    calls:[{q:'4Q25', txt:'“It certainly has a headwind from the investments in AI and the depreciation on that CapEx. But we also work very hard to offset that with efficiencies.”', who:'Brian Olsavsky, CFO'},
           {q:'4Q25', txt:'“As a reminder, today, we do expense most of these LEO costs as incurred. We expect that later in the year, many of these costs, such as satellite manufacturing and launch services, will be capitalized.”', who:'Brian Olsavsky, CFO'},
           {q:'1Q26', txt:'“Second, within the North America segment, we do expect a year-over-year cost increase of approximately $1 billion related to Amazon LEO, as we manufacture and launch more satellites in preparation for our service offering, and we expect to begin capitalizing certain costs in Q4.”', who:'Brian Olsavsky, CFO'},
           {q:'2Q26', txt:'“The servers currently have a useful life of at least five to six years, and most of our AI capacity these days is being contracted for at least five-year terms.”', who:'Andy Jassy, CEO'},
           {q:'2Q26', txt:'“Second, we recorded a separate benefit of approximately $600 million related to the change in fair value measurement of energy contracts subject to derivative accounting. This primarily impacts the AWS segment.”', who:'Brian Olsavsky, CFO'}] },
  { k:'marketing', name:'Sales and marketing',
    kpiExtra:['$23.5B','advertising and other promotional costs in FY2025, from $21.4B in FY2024 (10-K Note 1)'],
    def:'Sales and marketing costs include advertising and payroll and related expenses for personnel engaged in marketing and selling activities, including sales commissions related to AWS. We pay commissions to third parties when their customer referrals result in sales. We also participate in cooperative advertising arrangements with certain of our vendors, and other third parties.',
    comp:[['','Advertising and promotion','Sponsored search, third-party referrals, social, online and television advertising — $23.5B in FY2025 (10-K Note 1).'],
          ['','Sales and marketing staff','Payroll of marketing and selling personnel, including AWS sales commissions.']],
    compNote:'Prime shipping benefits are not here: the 10-K keeps them out of sales and marketing even though Amazon views them as marketing tools (see the drivers).',
    unit:'<div class="ew-note">Amazon does not disclose a customer-acquisition cost or a cost per Prime member (it last gave a Prime member count in 2021). What is disclosed is the ratio to revenue, computed in the bars above.</div>',
    why:'Falling as a share of revenue since 2022 — Amazon spends proportionally less to win the next sale. The 10-K on 2025: “The increase in sales and marketing costs in 2025, compared to the prior year, is primarily due to increased third-party advertising expenses.”',
    drivers:[['','Variable with sales','“Our marketing costs are largely variable, based on growth in sales and changes in rates.” (10-K MD&amp;A)'],
             ['','Prime as marketing','“While costs associated with Amazon Prime membership benefits and other shipping offers are not included in sales and marketing expense, we view these offers as effective worldwide marketing tools, and intend to continue offering them indefinitely.” (10-K MD&amp;A)'],
             ['','2026 so far','“Sales and marketing costs in Q2 2026 and for the six months ended June 30, 2026 did not significantly change compared to the comparable prior year periods.” (10-Q 2Q26 MD&amp;A)']],
    calls:[{q:'4Q25', txt:'“The second charge is $730 million for the estimated severance costs.”', who:'Brian Olsavsky, CFO'},
           {q:'4Q25', txt:'“This charge impacts all three of our segments and is recorded primarily in the fulfillment sales and marketing and technology and infrastructure expense line items.”', who:'Brian Olsavsky, CFO'}] },
  { k:'gAdmin', name:'General and administrative',
    kpiExtra:['−2%','growth in FY2025 — the only line to shrink (10-K MD&amp;A)'],
    def:'General and administrative expenses primarily consist of costs for corporate functions, including payroll and related expenses; facilities and equipment expenses, such as depreciation and amortization expense and rent; and professional fees.',
    comp:[['','Corporate functions','Finance, legal, HR and other corporate payroll; corporate facilities, their depreciation and rent; professional fees.']],
    compNote:'The smallest recurring line, and the one with the most operating leverage: corporate cost grows far slower than revenue.',
    unit:'<div class="ew-note">Not a unit-cost line: it moves with corporate headcount, not with volume.</div>',
    why:'Pure operating leverage — a largely fixed corporate base against compounding revenue. The 10-K: “General and administrative costs in 2025 did not significantly change compared to the prior year.”',
    drivers:[['','Payroll','“The decrease in general and administrative costs in Q2 2026 and for the six months ended June 30, 2026, compared to the comparable prior year periods, is primarily due to a decrease in payroll and related expenses.” (10-Q 2Q26 MD&amp;A)'],
             ['','Severance','Estimated severance for planned role eliminations: $1.8B recorded in 3Q25 (10-K MD&amp;A) and $730M in 4Q25 (CFO, 4Q25 call), spread across the expense lines.']],
    calls:[] },
  { k:'otherOpex', name:'Other operating expense (income), net',
    kpiExtra:['$2.5B','FTC settlement recorded in this line in 3Q25 (10-K)'],
    def:'Other operating expense (income), net, consists primarily of the amortization of intangible assets and asset impairments. During 2025, we also recorded the settlement of a lawsuit with the FTC and the resolution of tax disputes associated with our stores business in Italy.',
    comp:[['','Recurring','Amortization of acquired intangible assets and asset impairments.'],
          ['','One-off charges','Legal settlements and tax disputes — the FTC settlement (3Q25), the Italy tax resolution and physical-store impairments (4Q25).']],
    compNote:'Usually a few hundred million a year; a net income in FY2020. It can be negative, so in the cost-structure view it can sit below zero.',
    unit:'<div class="ew-note">Not a unit-cost line: it is charges and settlements.</div>',
    why:'The line that explains the 3Q25 and 4Q25 margin dips — not a run-rate. The 10-K: the increase in 2025 “was primarily related to the settlement of a lawsuit with the Federal Trade Commission” in Q3 2025, “and also included the resolution of tax disputes associated with our stores business in Italy, and physical stores and other asset impairments.”',
    drivers:[['','2026 so far','“Other operating expense (income), net was $199 million and $90 million for Q2 2025 and Q2 2026, and $507 million and $537 million for the six months ended June 30, 2025 and 2026, and was primarily related to asset impairments and the amortization of intangible assets.” (10-Q 2Q26 MD&amp;A)']],
    calls:[{q:'4Q25', txt:'“The first charge of $1.1 billion is for the resolution of tax disputes associated with our stores business in Italy, and the settlement of a lawsuit. This charge primarily impacts our international segment and is largely recorded in the fulfillment and other operating expense line items.”', who:'Brian Olsavsky, CFO'},
           {q:'4Q25', txt:'“The third charge of $610 million is for asset impairments primarily related to physical stores. This charge primarily impacts the North America segment as reported in other operating expense line.”', who:'Brian Olsavsky, CFO'}] }
];

// 3) Segments (BL-SEG). Segment net sales / operating expenses / operating income / D&A are in the generated block above.
//    Net additions to property and equipment and property and equipment, net, by segment — typed from the Form 10-K
//    FY2025, Note 10 (Segment Information), FY2023–FY2025 (the same figures the earlier amzn.js A_TENK carried).
export var AMZN_SEG_CAPEX={ 2023:{na:17529,intl:4144,aws:24843,corp:1828}, 2024:{na:24348,intl:6643,aws:53267,corp:1494}, 2025:{na:35919,intl:7617,aws:96496,corp:2320} };
export var AMZN_SEG_PPE={ 2023:{na:93632,intl:24357,aws:72701,corp:13487}, 2024:{na:103041,intl:25618,aws:110683,corp:13323}, 2025:{na:122043,intl:30632,aws:190055,corp:14295} };
export var AMZN_SEG_SRC='Amazon Form 10-K FY2025 (Note 10, Segment Information) and Forms 10-Q 1Q24–2Q26 (segment note), via SEC EDGAR XBRL; 3Q26 from the 8-K of Oct 29 2026';
// The 10-K's own words on how costs reach a segment (Form 10-K FY2025, Note 10), verbatim.
export var AMZN_SEG_ALLOC={
  codm:'Our chief operating decision maker (“CODM”) is our President and Chief Executive Officer. Our CODM regularly reviews consolidated net sales, consolidated operating expenses, and consolidated operating income (loss) by segment.',
  allocated:'We allocate to segment results the operating expenses “Fulfillment,” “Technology and infrastructure,” “Sales and marketing,” and “General and administrative” based on usage, which is generally reflected in the segment in which the costs are incurred. The majority of technology costs recorded in “Technology and infrastructure” are incurred in the U.S. and are included in our North America and AWS segments. The majority of infrastructure costs recorded in “Technology and infrastructure” are allocated to the AWS segment based on usage.',
  infra:'Technology infrastructure assets, which are included in property and equipment, net, net additions, and the depreciation and amortization expense on these assets, are allocated among the segments based on usage, with the majority allocated to the AWS segment.',
  da:'Depreciation and amortization expense on property and equipment, including corporate property and equipment, are allocated to all segments based on usage.'
};
// One deep dive per segment, 10-K order. Definitions verbatim from the 10-K FY2025 Note 10; the MD&A quotes are
// verbatim from the 10-K FY2025 and the 10-Q 2Q26; calls verbatim from The Motley Fool transcripts (4Q25 · 1Q26 · 2Q26).
// Every number in the key figures, bars and tables is computed in amzn-bl.js from the series above and the Results
// dataset. The substance of the earlier amzn.js segment dives (SEG_WORLD / SEG_COST) is kept here.
export var AMZN_SEG_DIVES=[
  { k:'na', name:'North America',
    def:'The North America segment primarily consists of amounts earned from retail sales of consumer products (including from sellers) and advertising and subscription services through North America-focused online and physical stores. This segment includes export sales from these online stores.',
    business:'The retail surface: first-party inventory, third-party sellers and the advertising and subscription layers riding on top. It carries most of the product cost, shipping and fulfillment, so its margin is a retail margin; it went below zero in FY2022 (the over-investment trough) and has climbed since on advertising and fulfillment efficiency rather than price.',
    moves:[
      ['Units and advertising','“The increase in North America operating income in 2025, compared to the prior year, is primarily due to increased unit sales and increased advertising sales, partially offset by increased fulfillment, technology and infrastructure, shipping, and other operating costs.” (10-K MD&amp;A)'],
      ['Cost to serve','Fulfillment and shipping are the offset — regionalization and robotics are how management holds them below unit growth (Expense lines ▸ Fulfillment).'],
      ['Amazon LEO','The satellite network’s costs sit in North America: management guided about $1B more year over year for each of 1Q26 and 2Q26 (CFO, 4Q25 and 1Q26 calls), until certain costs begin to be capitalized in Q4 2026.'],
      ['One-offs','3Q25 carries the $2.5B FTC settlement; 4Q25 the physical-store impairments; 2Q26 about $600M of tariff refunds (CFO, 2Q26 call).']
    ],
    calls:[
      {q:'4Q25', txt:'“Shifting to profitability, North America segment operating income was $11.5 billion with an operating margin of 9%. Up from an 8% margin in 2024.”', who:'Brian Olsavsky, CFO'},
      {q:'4Q25', txt:'“A recent study from Profitero showed that Amazon.com, Inc. is America\'s lowest priced retailer for the ninth straight year.”', who:'Andy Jassy, CEO'},
      {q:'1Q26', txt:'“Now let us shift to segment profitability. North America segment operating income was $8.3 billion, with an operating margin of 7.9%.”', who:'Brian Olsavsky, CFO'},
      {q:'2Q26', txt:'“Shifting to profitability, North America segment operating income was $9.1 billion with an operating margin of 7.9%.”', who:'Brian Olsavsky, CFO'}
    ] },
  { k:'intl', name:'International',
    def:'The International segment primarily consists of amounts earned from retail sales of consumer products (including from sellers) and advertising and subscription services through internationally-focused online stores. This segment includes export sales from these internationally-focused online stores (including export sales from these online stores to customers in the U.S., Mexico, and Canada), but excludes export sales from our North America-focused online stores.',
    business:'Two businesses under one line: established markets (Germany, the UK, Japan) that run the North America playbook at a profit, and emerging markets still spending ahead of revenue. It crossed into profit in FY2024 after years of build-out losses — the curve North America climbed, a few years behind. The reported margin also moves with the dollar.',
    moves:[
      ['The same flywheel','“The increase in International operating income in 2025, compared to the prior year, is primarily due to increased unit sales and increased advertising sales, partially offset by increased fulfillment and shipping costs.” (10-K MD&amp;A)'],
      ['Foreign exchange','“Changes in foreign exchange rates positively impacted operating income by $903 million in 2025.” (10-K MD&amp;A)'],
      ['Investment in the stores','Faster delivery (Amazon Now, under thirty minutes), sharper prices and lower seller fees in competitive countries (CFO, 4Q25 call).'],
      ['One-offs','4Q25 carries most of the $1.1B Italy tax and lawsuit charge (CFO, 4Q25 call).']
    ],
    calls:[
      {q:'4Q25', txt:'“International segment operating income was $1 billion with an operating margin of 2.1%. Excluding the impact of special charges mentioned earlier, International segment operating margins also expanded year over year.”', who:'Brian Olsavsky, CFO'},
      {q:'4Q25', txt:'“Within the international segment, we are continuing to invest more in our stores business to enhance the customer experience and to encourage retail demand to move online more quickly.”', who:'Brian Olsavsky, CFO'},
      {q:'1Q26', txt:'“International segment operating income was $1.4 billion, with an operating margin of 3.6%.”', who:'Brian Olsavsky, CFO'},
      {q:'2Q26', txt:'“International segment operating income was $1.7 billion with an operating margin of 4.1%.”', who:'Brian Olsavsky, CFO'}
    ] },
  { k:'aws', name:'AWS',
    def:'The AWS segment consists of amounts earned from global sales of compute, storage, database, and other services for start-ups, enterprises, government agencies, and academic institutions.',
    business:'The profit engine: a minority of Amazon’s revenue but the majority of its operating income, and where most of the capex, property and equipment and depreciation sit. Its margin is set by the race between revenue on the capacity and the depreciation of that capacity — management expects it to fluctuate with the level of investment.',
    moves:[
      ['Sales against infrastructure','“The increase in AWS operating income in 2025, compared to the prior year, is primarily due to increased sales, partially offset by spending on technology infrastructure that was primarily driven by additional investments to support AWS business growth.” (10-K MD&amp;A)'],
      ['Depreciation of the build','Technology infrastructure and its depreciation are allocated mostly to AWS (10-K Note 10); segment D&amp;A is drawn in the capital-footprint table below.'],
      ['Efficiency','Software and process work to optimize server capacity, lower-cost custom networking gear and custom silicon (CFO, 4Q25 and 2Q26 calls).'],
      ['Energy contracts','2Q26 includes about $600M of unrealized gains on energy contracts under derivative accounting, mostly in AWS: the margin rose 650 bps year over year, 520 bps without it (CFO, 2Q26 call).']
    ],
    calls:[
      {q:'4Q25', txt:'“As we\'ve long said, we expect AWS operating margins to fluctuate over time, driven in part by the level of investments we are making at any point in time.”', who:'Brian Olsavsky, CFO'},
      {q:'4Q25', txt:'“AWS is 35% operating margin through Q4, up 40 basis points year over year.”', who:'Brian Olsavsky, CFO'},
      {q:'1Q26', txt:'“AWS operating income was $14.2 billion and reflects our strong growth coupled with our focus on driving efficiencies across the business.”', who:'Brian Olsavsky, CFO'},
      {q:'2Q26', txt:'“You\'re seeing, despite the large investments, AWS margins have continued to remain strong, and we\'re up 650 basis points year-over-year. 520 basis points if you exclude the derivative accounting gain that I mentioned.”', who:'Brian Olsavsky, CFO'},
      {q:'2Q26', txt:'“We see the margins and returns in AI tracking what we saw with Core at the same point of evolution, actually a little ahead.”', who:'Andy Jassy, CEO'}
    ] }
];
