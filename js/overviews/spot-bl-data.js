// spot-bl-data.js — reported data for Spotify Deep Dive ▸ Bottom Line ▸ General (read by ./spot-bl.js).
//
// Rule 10: only REPORTED figures and filing text here — no market data, no Summit numbers. EUR throughout (Spotify
// reports in euros; this is not an ADR line).
//
// 1) The functional expense lines (EUR million), between the BEGIN/END markers — GENERATED from the Bloomberg
//    export by the scratch builder build_spot_bl.py (see docs/profiles/SPOT.md, BL-GEN), not typed:
//      · each BBG_CONSENSUS.txt snapshot carries five reported quarters and three reported years; the ten SPOT
//        snapshots (Apr 28 2024 → Sep 9 2026) are stitched oldest → newest, the newest value for a period winning;
//      · FY2021–FY2025 and 1Q23–2Q26 (no new Bloomberg pull; the file already on disk);
//      · every year and every quarter ties: revenue − cost of revenue − R&D − S&M − G&A = operating income, and the
//        four quarters of a year sum to the year; FY2023–FY2025 also tie to the Form 20-F statement of operations;
//      · Spotify has no "other operating" line, so otherOpex is the residual (0 for every period).
//
// 2) SPOT_SBC — share-based compensation by function, Form 20-F FY2025 (filed Feb 2026), SBC note.
//
// 3) SPOT_EW_LINES — one dive per line. Quotes are verbatim (Form 20-F FY2025 Item 5; Q2 2026 call, Aug 4 2026).
//    The amount, share of revenue, margin effect and the share-of-revenue bars are computed in spot-bl.js from the
//    series above — never typed here.

// BEGIN GENERATED (build_spot_bl.py)
export var SPOT_OPEX_YEARS=[2021, 2022, 2023, 2024, 2025];
export var SPOT_OPEX={
  2021:{"revenue": 9668, "costOfSales": 7077, "rnd": 912, "sm": 1135, "gAdmin": 450, "otherOpex": 0},
  2022:{"revenue": 11727, "costOfSales": 8801, "rnd": 1387, "sm": 1572, "gAdmin": 626, "otherOpex": 0},
  2023:{"revenue": 13247, "costOfSales": 9850, "rnd": 1725, "sm": 1533, "gAdmin": 585, "otherOpex": 0},
  2024:{"revenue": 15673, "costOfSales": 10949, "rnd": 1486, "sm": 1392, "gAdmin": 481, "otherOpex": 0},
  2025:{"revenue": 17186, "costOfSales": 11690, "rnd": 1393, "sm": 1426, "gAdmin": 479, "otherOpex": 0},
};
export var SPOT_OPEXQ=[
  {"p": "Q1 '23", "yr": 2023, "q": "Q1", "revenue": 3042, "costOfSales": 2276, "rnd": 435, "sm": 347, "gAdmin": 140, "otherOpex": 0},
  {"p": "Q2 '23", "yr": 2023, "q": "Q2", "revenue": 3177, "costOfSales": 2411, "rnd": 453, "sm": 399, "gAdmin": 161, "otherOpex": 0},
  {"p": "Q3 '23", "yr": 2023, "q": "Q3", "revenue": 3357, "costOfSales": 2472, "rnd": 369, "sm": 355, "gAdmin": 129, "otherOpex": 0},
  {"p": "Q4 '23", "yr": 2023, "q": "Q4", "revenue": 3671, "costOfSales": 2691, "rnd": 468, "sm": 432, "gAdmin": 155, "otherOpex": 0},
  {"p": "Q1 '24", "yr": 2024, "q": "Q1", "revenue": 3636, "costOfSales": 2632, "rnd": 389, "sm": 324, "gAdmin": 123, "otherOpex": 0},
  {"p": "Q2 '24", "yr": 2024, "q": "Q2", "revenue": 3807, "costOfSales": 2695, "rnd": 379, "sm": 343, "gAdmin": 124, "otherOpex": 0},
  {"p": "Q3 '24", "yr": 2024, "q": "Q3", "revenue": 3988, "costOfSales": 2748, "rnd": 342, "sm": 332, "gAdmin": 112, "otherOpex": 0},
  {"p": "Q4 '24", "yr": 2024, "q": "Q4", "revenue": 4242, "costOfSales": 2874, "rnd": 376, "sm": 393, "gAdmin": 122, "otherOpex": 0},
  {"p": "Q1 '25", "yr": 2025, "q": "Q1", "revenue": 4190, "costOfSales": 2864, "rnd": 379, "sm": 314, "gAdmin": 124, "otherOpex": 0},
  {"p": "Q2 '25", "yr": 2025, "q": "Q2", "revenue": 4193, "costOfSales": 2873, "rnd": 415, "sm": 364, "gAdmin": 135, "otherOpex": 0},
  {"p": "Q3 '25", "yr": 2025, "q": "Q3", "revenue": 4272, "costOfSales": 2921, "rnd": 309, "sm": 349, "gAdmin": 111, "otherOpex": 0},
  {"p": "Q4 '25", "yr": 2025, "q": "Q4", "revenue": 4531, "costOfSales": 3032, "rnd": 290, "sm": 399, "gAdmin": 109, "otherOpex": 0},
  {"p": "Q1 '26", "yr": 2026, "q": "Q1", "revenue": 4533, "costOfSales": 3038, "rnd": 331, "sm": 342, "gAdmin": 107, "otherOpex": 0},
  {"p": "Q2 '26", "yr": 2026, "q": "Q2", "revenue": 4777, "costOfSales": 3181, "rnd": 403, "sm": 390, "gAdmin": 148, "otherOpex": 0},
];
// END GENERATED

// Share-based compensation by function, EUR million (Form 20-F FY2025, note on share-based compensation).
export var SPOT_SBC={
  2023:{costOfSales:5, rnd:194, sm:66, gAdmin:56},
  2024:{costOfSales:5, rnd:152, sm:61, gAdmin:49},
  2025:{costOfSales:5, rnd:138, sm:62, gAdmin:42},
};

export var SPOT_EW_SRC='— Spotify Technology S.A. Form 20-F for FY2025 (accession 0001628280-26-006874), Item 5 (Operating and Financial Review) · SEC EDGAR';

export var SPOT_EW_LINES=[
  { k:'costOfSales', name:'Cost of revenue',
    kpiExtra:['66%','Premium cost of revenue as a share of Premium revenue, FY2025 (67% in FY2024)'],
    def:'For the year ended December 31, 2025, as compared to 2024, Premium cost of revenue increased by €860 million, or 9%, and Premium cost of revenue as a percentage of Premium revenue decreased from 67% to 66%. The increase in Premium cost of revenue was driven primarily by increases in Premium revenue and increased rates for certain licensors driving increases in music royalties, as well as increases in audiobook licensing costs and costs associated with the launch of the Spotify Partner Program, partially offset by benefits from certain marketplace programs. These collectively resulted in higher royalty costs of €765 million.',
    comp:[['🎵','Royalties and distribution','“Cost of revenue consists predominantly of royalty and distribution costs related to content streaming.” Royalty costs rose €765M in FY2025 (20-F Item 5).'],
          ['💳','Payments, ad serving and delivery','“Cost of revenue also includes credit card and payment processing fees for subscription revenue, advertising serving, advertising measurement, customer service, certain employee compensation and benefits, cloud computing, streaming, facility, and equipment costs.” Payment processing +€34M and streaming delivery +€23M in FY2025.']],
    compNote:'Both quotes: 20-F Item 5, Components of our Operating Results. Segment split (20-F Item 5, FY2025): Premium €10,184M (66% of Premium revenue), Ad-Supported €1,506M (82% of Ad-Supported revenue, from 88%).',
    unit:'<div class="ew-note">Spotify does not report a cost per stream or per subscriber. What the 20-F gives is the movement of the aggregate royalty cost (+€765M in FY2025) and cost of revenue as a share of each segment’s revenue: Premium 66% (from 67%), Ad-Supported 82% (from 88%).</div>',
    why:'<b>The gross-margin line.</b> It is by far the largest cost: the 20-F ties the FY2025 increase to Premium revenue growth and licensor rates. Ad-Supported cost fell in FY2025 (−€119M) while its revenue was roughly flat, which is where most of the segment’s margin recovery came from.',
    drivers:[['🎼','Licensor rates','FY2025 Premium cost rose on “increased rates for certain licensors driving increases in music royalties”, plus audiobook licensing and the Spotify Partner Program launch.'],
             ['🎙️','Podcast inventory','Ad-Supported cost fell mainly on “a reduction in podcast costs of €83 million due primarily to our optimization of podcast inventory” (20-F Item 5).'],
             ['⏱️','Timing of investments','2Q26 gross margin beat the guide “driven by primarily quarterly timing shifts related to our growth investments”, plus a one-off Canadian digital-service-tax accrual reversal.'],
             ['🧾','Regulatory fee in Q3','Management flags “a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets”.']],
    calls:[{q:'Q2 2026', txt:'“Gross margin came in at 33.4%, surpassing guidance by 30 basis points. The year-over-year expansion of 193 basis points. Favorability versus our guidance was driven by primarily quarterly timing shifts related to our growth investments.”', who:'Christian Luiga, CFO'},
           {q:'Q2 2026', txt:'“We anticipate a quarter three gross margin of 32.9%, approximately 130 basis points above the prior year. Our gross margin outlook incorporates continued strengthening in our core business, reinvestments into new products, and a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets.”', who:'Christian Luiga, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['€138M','share-based compensation inside R&D, FY2025 (20-F SBC note)'],
    def:'For the year ended December 31, 2025, as compared to 2024, research and development costs decreased by €93 million, or 6%. The decrease was due primarily to a decrease of €108 million in social costs due primarily to changes in share price movements. There was also a decrease in share-based compensation of €12 million, due to a change in the timing of annual grants in 2025 moving from March 1 to May 1. These decreases were partially offset by an increase of €30 million in information technology costs due primarily to an increase in our usage of cloud computing services.',
    comp:[['👩‍💻','People','“The costs incurred include cloud and IT related costs, facility costs, consulting costs, and employee compensation and benefits costs.” Average full-time employees fell from 9,123 (FY2023) to 7,691 (FY2024) and 7,287 (FY2025) (20-F personnel expenses note).'],
          ['☁️','Cloud and IT','FY2025 information technology costs rose €30M “due primarily to an increase in our usage of cloud computing services” (20-F Item 5).']],
    compNote:'Definition: 20-F Item 5, Components of our Operating Results (“costs incurred for the development of products related to our platform and Service”).',
    why:'The line that shrank most as a share of revenue: 13% in FY2023, 9% in FY2024 and 8% in FY2025 (20-F Item 5). FY2023 also carried €119M of that year’s €212M severance (20-F personnel expenses note); FY2025 reflects lower social costs. In 2026 management says it is flat on headcount and that spending growth is compute and marketing, not people.',
    drivers:[['📉','Social costs','They track the share price: R&amp;D social costs fell €108M in FY2025 on share price movements. Total social cost on share-based compensation was €125M in FY2025 against €291M in FY2024 (20-F Item 3.D).'],
             ['🤖','AI compute','The Q2 2026 call names compute as one of the two sources of 2026 operating-expense growth.'],
             ['🗓️','Grant timing','Annual equity grants moved from March 1 to May 1 in 2025, lowering FY2025 SBC by €12M.']],
    calls:[{q:'Q2 2026', txt:'“Over the last three years, we have not increased headcount while revenue per employee is on track to double. As you can see, the operating expense growth is not coming from people. It’s coming from compute and marketing. Both of these are variable and entirely in our control.”', who:'Gustav Söderström, Co-CEO'},
           {q:'Q2 2026', txt:'“We started this year by investing to make sure that we were leading in this wave of using AI… Now we’re starting to focus on cost and efficiency, which is always the second step.”', who:'Gustav Söderström, Co-CEO'}] },
  { k:'sm', name:'Sales &amp; marketing',
    kpiExtra:['+€50M','marketing campaigns, FY2025 vs FY2024 (20-F Item 5)'],
    def:'For the year ended December 31, 2025, as compared to 2024, sales and marketing expense increased by €34 million, or 2%. The increase was due primarily to an increase in costs of €50 million for marketing campaigns. This increase was partially offset by a decrease of €29 million in social costs due primarily to changes in share price movements.',
    comp:[['📣','Campaigns and brand','“Sales and marketing expenses primarily comprise employee compensation and benefits, public relations, branding, consulting expenses, customer acquisition costs, advertising, marketing events and trade shows…” (20-F Item 5).'],
          ['🛍️','Customer acquisition','The definition lists “customer acquisition costs” and “advertising” inside the line; the 20-F does not split the line further.']],
    compNote:'Definition: 20-F Item 5, Components of our Operating Results.',
    why:'In 2026 management names marketing, with AI, as the source of about €200M of incremental operating expense for the year, and calls both “variable and entirely in our control”.',
    drivers:[['🎯','2026 campaigns','Management expects “marketing and AI-related investments to drive approximately EUR 200 million in incremental operating expense for the full year”, concentrated in Q2 and Q3.'],
             ['📉','Social costs','Share-price-linked social costs lowered FY2025 S&amp;M by €29M.']],
    calls:[{q:'Q2 2026', txt:'“We continue to expect these marketing and AI-related investments to drive approximately EUR 200 million in incremental operating expense for the full year. Quarter four is well positioned to see a moderation in the rate of year-over-year operating expense growth as we move past the heavier concentration of this year’s marketing of activities and calibrate on the other costs.”', who:'Christian Luiga, CFO'},
           {q:'Q2 2026', txt:'“We are sticking to our cost moderating in Q4. It’s also important to just remind all of you that these costs are compute and marketing. They are within our control. These are not long-term CapEx investments that need years to roll back.”', who:'Gustav Söderström, Co-CEO'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['€42M','share-based compensation inside G&A, FY2025 (20-F SBC note)'],
    def:'For the year ended December 31, 2025, as compared to 2024, general and administrative expense decreased by €2 million, or less than 1%. The decrease was due primarily to a decrease of €28 million in social costs due primarily to changes in share price movements. This decrease was partially offset by an increase in other general and administrative expenses of €20 million, primarily driven by higher legal and compliance-related costs for the year ended December 31, 2025.',
    comp:[['⚖️','Legal and compliance','FY2025 “other general and administrative expenses” rose €20M, “primarily driven by higher legal and compliance-related costs”.'],
          ['🏢','Functions','“Employee compensation and benefits for functions such as finance, accounting, analytics, legal, human resources, and other costs including consulting fees, facility and equipment costs, directors’ and officers’ liability insurance, and director fees.”']],
    compNote:'Definition: 20-F Item 5, Components of our Operating Results.',
    why:'The smallest functional line, under 3% of revenue. Like R&amp;D and S&amp;M it carries share-price-linked social costs (−€28M in FY2025).',
    drivers:[['📉','Social costs','Down €28M in FY2025 on share price movements; the remaining move is legal and compliance cost (+€20M).'],
             ['🗓️','2023 base','FY2023 included €34M of severance in G&amp;A (20-F personnel expenses note); the line fell 18% in FY2024 (20-F Item 5 table).']] },
];
