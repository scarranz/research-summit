// lyft-bl-data.js — reported data, filing text and the FROZEN Summit block for Lyft Deep Dive ▸ Bottom Line ▸ General (BL-GEN-1…5),
// read by ./lyft-bl.js. docs/PROFILE_PLAYBOOK.md §13. Written 2026-11-05.
//
// 1) The income-statement cost lines (US$ million), annual FY2021–FY2025: typed from the consolidated statements of operations — Form 10-K FY2023
//    (FY2021–FY2023) and Form 10-K FY2025 (FY2024–FY2025). Tie-out run at generation: revenue − the five lines = loss from operations in
//    every year, to the US$ thousand. Lyft has five functional lines (cost of revenue, operations and support, research and development, sales and
//    marketing, general and administrative); depreciation and amortization sit inside them and Lyft reports no gross profit.
//    Quarterly (LYFT_OPEXQ): Bloomberg reported actuals for 2Q25–2Q26 (lyft-bbg.js, as of its asOf); 2Q25 and 2Q26 tie to the Form 10-Q for 2Q26
//    (cost of revenue 926.4 / 935.7, operations and support 128.7 / 117.4, R&D 119.2 / 109.3, S&M 320.0 / 190.9, G&A 301.6 / 232.3). Older quarters
//    would need the 10-Qs.
// 2) LYFT_SBC_FN — stock-based compensation by function (US$ million), from the same statements ("Stock-based compensation included in costs and
//    expenses"); the annual total is their sum.
// 3) LYFT_VA_RELEASE — the valuation-allowance release inside the income-tax line: "a $2.9 billion benefit from the release of our valuation allowance of
//    U.S. federal and certain state deferred tax assets in the fourth quarter of 2025" (Form 10-K FY2025, MD&A key metrics note).
// 4) LYFT_SUMMIT — the Summit DCF model, FROZEN from DCF LYFT.xlsm / Projection History, submit 2026-08-07 (rule 10). The model's diluted shares,
//    GAAP operating income and net income are in doubt (docs/profiles/LYFT.md §1b) and are not carried.
// 5) LYFT_EW_LINES — one dive per cost line; definitions and drivers are verbatim from the Form 10-K FY2025 MD&A and the Form 10-Q for 2Q26;
//    management remarks are verbatim from the 2Q26 prepared remarks and docs/calls. Every amount, share of revenue and margin effect is computed in
//    lyft-bl.js, never typed here.

export var LYFT_OPEX_YEARS=[2021, 2022, 2023, 2024, 2025];
export var LYFT_OPEX={
  2021:{"revenue": 3208.3, "cor": 1702.3, "opsSupport": 402.2, "marketing": 411.4, "rnd": 911.9, "gAdmin": 915.6, "oi": -1135.2, "sbc": 724.6},
  2022:{"revenue": 4095.1, "cor": 2435.7, "opsSupport": 443.8, "marketing": 531.5, "rnd": 856.8, "gAdmin": 1286.2, "oi": -1458.9, "sbc": 750.8},
  2023:{"revenue": 4403.6, "cor": 2544.0, "opsSupport": 427.2, "marketing": 481.0, "rnd": 555.9, "gAdmin": 871.1, "oi": -475.6, "sbc": 484.5},
  2024:{"revenue": 5786.0, "cor": 3337.7, "opsSupport": 443.8, "marketing": 789.0, "rnd": 397.1, "gAdmin": 937.3, "oi": -118.9, "sbc": 330.9},
  2025:{"revenue": 6316.3, "cor": 3697.7, "opsSupport": 478.3, "marketing": 875.1, "rnd": 451.4, "gAdmin": 1002.1, "oi": -188.4, "sbc": 322.3},
};
export var LYFT_OPEXQ=[
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 1588.2, "cor": 935.7, "opsSupport": 117.4, "marketing": 190.9, "rnd": 109.3, "gAdmin": 232.3, "oi": 2.4, "sbc": 159.9},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 1685.2, "cor": 927.2, "opsSupport": 131.4, "marketing": 243.3, "rnd": 109.6, "gAdmin": 250.6, "oi": 23.1, "sbc": 66.6},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 1592.7, "cor": 971.8, "opsSupport": 123.2, "marketing": 258.8, "rnd": 120.0, "gAdmin": 303.9, "oi": -185.0, "sbc": 80.4},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 1650.5, "cor": 864.1, "opsSupport": 124.4, "marketing": 272.9, "rnd": 124.2, "gAdmin": 270.2, "oi": -5.3, "sbc": 86.9},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 1843.5, "cor": 926.4, "opsSupport": 128.7, "marketing": 320.0, "rnd": 119.2, "gAdmin": 301.6, "oi": 47.6, "sbc": 149.2},
];
export var LYFT_OPEX_SRC='Lyft Forms 10-K (FY2021–FY2025, consolidated statements of operations) and Bloomberg reported actuals 2Q25–2Q26 (tied to the Form 10-Q for 2Q26)';

// Stock-based compensation by function (US$ million), 10-K statements of operations.
export var LYFT_SBC_FN={
  2021:{cor: 39.491, opsSupport: 24.083, rnd: 414.324, marketing: 38.243, gAdmin: 208.419},
  2022:{cor: 44.132, opsSupport: 25.442, rnd: 391.983, marketing: 49.867, gAdmin: 239.343},
  2023:{cor: 30.17, opsSupport: 15.468, rnd: 214.16, marketing: 29.682, gAdmin: 195.053},
  2024:{cor: 24.895, opsSupport: 8.397, rnd: 117.833, marketing: 17.286, gAdmin: 162.51},
  2025:{cor: 23.6, opsSupport: 10.244, rnd: 135.7, marketing: 17.24, gAdmin: 135.484},
};
export var LYFT_SBC_FN_SRC='Lyft Forms 10-K FY2023 and FY2025, consolidated statements of operations (stock-based compensation included in costs and expenses), FY2021–FY2025';

// Valuation-allowance release inside the income-tax line (US$ million): Form 10-K FY2025, MD&A.
export var LYFT_VA_RELEASE={ 2025:2900 };

// ═══ Summit DCF model — FROZEN, submit 2026-08-07 (Projection History), US$ million ═══
export var LYFT_SUMMIT={
  snapshot:'2026-08-07',
  years:[2026, 2027, 2028],
  rev:   [7268.7, 8068.5, 8618.5],        // REV
  gb:    [21888.8, 24636.7, 26682.5],     // GROSS_BOOKINGS
  ebitda:[718.8, 959.0, 1186.3],          // EBITDA (core row; ADJ_EBITDA reads 706.4 for 2026, doubt 3)
  fcf:   [1265.7, 1277.1, 962.1],         // FCF
  shares:[null, null, null]               // SHARES in doubt (4): not carried
};

export var LYFT_EW_SRC='— Lyft Form 10-K for FY2025, Item 7 (MD&amp;A), Components of Results of Operations · SEC EDGAR';


export var LYFT_EW_LINES=[
  { k:'cor', name:'Cost of revenue',
    kpiExtra:['$337.8M','more insurance cost in FY2025 on higher ride volume and higher cost per mile (10-K MD&amp;A)'],
    def:'Cost of revenue primarily consists of costs directly related to generating revenue through our multimodal platform which primarily includes insurance costs, payment processing charges, payments to drivers or driver incentive costs in certain markets where we control the transportation services provided, and other costs. Insurance costs consist of insurance generally required under TNC and city regulations for ridesharing, and bike and scooter rentals and also includes occupational hazard insurance for drivers.',
    comp:[['','Insurance','Insurance required under TNC and city regulations for ridesharing and for bike and scooter rentals, plus occupational hazard insurance for drivers. The largest component.'],
          ['','Payment processing','Merchant fees, chargebacks and failed charges.'],
          ['','Other','Hosting and platform technology, personnel, depreciation, amortization of technology intangibles, asset write-offs and Flexdrive vehicle lease expenses and remarketing gains and losses.']],
    compNote:'The 10-K gives cost of revenue as one line, so the bridge draws one bar. Lyft reports no gross profit and depreciation and amortization sit inside the line.',
    unit:'<div class="ew-note">Lyft does not disclose a dollar insurance cost per ride. Management speaks to the average insurance cost per ride in qualitative terms (see the commentary below).</div>',
    why:'<b>The line that moves with insurance.</b> FY2025: “Cost of revenue increased $359.9 million, or 11%, in 2025 as compared to the prior year. The increase was primarily due to a $337.8 million increase in insurance costs driven by increased ride volume paired with higher costs per mile.” In 2Q26 the line was flat year over year while revenue grew 16%.',
    drivers:[['','California insurance reform (SB 371)','2Q26 10-Q: “Cost of revenue included a decrease in insurance costs stemming from a cost per mile decrease due to California’s rideshare insurance reform bill, SB 371, and favorable changes in estimates resulting from new developments in claims originating from prior years, offset by higher ride volume.”'],
             ['','Outlook','2Q26 10-Q: “We expect to see cost of revenue increase in the near term on a year over year basis due to higher insurance costs driven by recent economic factors and the renewals of our third-party insurance agreements, but we expect total insurance costs will continue to increase at a lower rate than they have historically.”'],
             ['','Restructuring','FY2025 10-K: a $35.0 million decrease in restructuring costs partly offset the insurance increase.']],
    calls:[{q:'Q1 2026', txt:'“Gross margin expanded year over year driven by a reduction in our average insurance cost per ride aided by recent insurance reforms and advancement of our insurance strategies.”', who:'Prepared remarks'},
           {q:'Q2 2026', txt:'“Cost of revenue was down year over year, both on an absolute basis and, more notably, on a per-ride basis.”', who:'Prepared remarks'},
           {q:'Q2 2026', txt:'“We anticipate a productive annual insurance renewal process in partnership with our carriers, reflecting our team\u2019s ongoing work to bend the insurance cost curve through continued safety feature innovations and proactive policy reforms.”', who:'Prepared remarks'}] },
  { k:'opsSupport', name:'Operations &amp; support',
    kpiExtra:['$17.0M','more driver onboarding and rider, driver and car rental fleet support costs in FY2025 (10-K MD&amp;A)'],
    def:'Operations and support expenses primarily consist of personnel-related compensation costs of local operations teams and teams who provide phone, email and chat support to users, bikes and scooters fleet operations support costs, driver background checks and onboarding costs, fees paid to third-parties providing operations support, facility costs and certain car rental fleet support costs.',
    comp:[['','Local operations and support','Local operations teams and the teams who answer users by phone, email and chat.'],
          ['','Driver onboarding','Background checks, onboarding and fees paid to third parties providing operations support.'],
          ['','Bikes and scooters','Fleet operations: repairs and maintenance, repositioning, cleaning and safety checks.']],
    unit:'<div class="ew-note">Lyft does not disclose a support cost per ride or per user.</div>',
    why:'A people-and-fleet line that grows slower than revenue. FY2025: “Operations and support expenses increased $34.5 million, or 8%, in 2025 as compared to the prior year. The increase was primarily due to increases of $17.0 million in driver onboarding costs and rider, driver and car rental fleet support costs and $8.6 million in personnel-related costs driven by increased headcount.”',
    drivers:[['','International expansion','2Q26 10-Q: “Operations and support expenses increased $11.3 million, or 10%, … primarily due to increases in bikes and scooters fleet operations support costs and personnel-related costs driven by increased headcount primarily due to international expansion.”']],
    calls:[] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['$17.9M','more stock-based compensation in FY2025, with $32.5M more personnel-related cost (10-K MD&amp;A)'],
    def:'Research and development (“R&amp;D”) expenses primarily consist of personnel-related compensation costs and facilities costs. Research and development costs are expensed as incurred.',
    comp:[['','Engineering and product','Personnel-related compensation of engineering, design and product teams.'],
          ['','Facilities','Facilities cost allocated to the function.'],
          ['','Stock-based compensation','R&amp;D carries most of Lyft’s stock-based compensation (the key figure above).']],
    unit:'<div class="ew-note">Lyft does not disclose a cost per engineer or per product.</div>',
    why:'Where most of the stock-based compensation sits, and a line that fell sharply after the 2022–2023 restructurings. FY2025: “Research and development expenses increased $54.3 million, or 14%, in 2025 as compared to the prior year. The increase was primarily due to increases of $32.5 million in personnel-related costs and $17.9 million in stock-based compensation driven by increased headcount.”',
    drivers:[['','Headcount','2Q26 10-Q: “Research and development expenses increased $9.9 million, or 9%, … primarily due to personnel-related costs driven by increased headcount.”']],
    calls:[] },
  { k:'marketing', name:'Sales &amp; marketing',
    kpiExtra:['$445.8M','rider incentive programs in FY2025, from $402.8M in FY2024 (10-K MD&amp;A)'],
    def:'Sales and marketing expenses primarily consist of rider incentives, personnel-related compensation costs, certain driver incentives, advertising expenses, rider refunds, amortization of certain intangible assets and marketing partnerships with third parties. Sales and marketing costs are expensed as incurred.',
    comp:[['','Rider incentives','The largest component: incentive programs intended to improve the marketplace.'],
          ['','Marketing partnerships','Payments to third-party partners.'],
          ['','Advertising and brand','Advertising expenses related to riders and drivers, brand and other marketing, and personnel.']],
    unit:'<div class="ew-note">Lyft discloses the dollar cost of its incentive programs ($445.8M in FY2025; $186.9M in 2Q26 against $99.9M in 2Q25) but no cost per ride or per rider acquired.</div>',
    why:'<b>The growth-investment line, and the one that moved most in 2026.</b> FY2025: “Sales and marketing expenses increased $86.1 million, or 11%, in 2025 … primarily due to investments in rider engagement including (i) a $43.0 million increase of costs related to our incentive programs from $402.8 million to $445.8 million and (ii) a $32.9 million increase in marketing partnerships with third parties.” In 2Q26 the line rose 68% year over year.',
    drivers:[['','Incentive programs','2Q26 10-Q: “Sales and marketing expenses increased $129.1 million, or 68%, … primarily due to investments in rider engagement including (i) a $87.0 million increase of costs related to our incentive programs from $99.9 million for the three months ended June 30, 2025 to $186.9 million for the three months ended June 30, 2026 and (ii) a $21.1 million increase in marketing partnerships with third parties.”']],
    calls:[{q:'Q2 2026', txt:'“Strong Gross Bookings have allowed us to invest strategically in rider incentives supporting our efforts driving rider loyalty, investing as we invite riders to try new modes and optimizing balance in our marketplace.”', who:'Prepared remarks'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['$45.2M','more consultant and advisory cost in FY2025 (10-K MD&amp;A)'],
    def:'General and administrative expenses primarily consist of personnel-related compensation costs, professional services fees, certain insurance costs that are generally not required under TNC regulations, certain loss contingency expenses including legal accruals and settlements, insurance claims administrative fees, policy spend, depreciation, facility costs, amortization of certain intangible assets and other corporate costs. General and administrative expenses are expensed as incurred.',
    comp:[['','Legal and loss contingencies','Legal accruals and settlements — the swing item.'],
          ['','Insurance not required by TNC regulations','Insurance outside the regulatory minimum, plus claims administrative fees and policy spend.'],
          ['','Corporate functions','Personnel, professional services, facilities and other corporate costs.']],
    unit:'<div class="ew-note">Not a unit-cost line: it moves with legal accruals, insurance retention and integration costs, not with volume.</div>',
    why:'The volatile line. FY2025: “General and administrative expenses increased $64.8 million, or 7%, in 2025 as compared to the prior year. The increase was primarily due to a $45.2 million increase in consultant and advisory costs, a $35.5 million increase due to higher self-retained general business liabilities and the impact of a $29.6 million gain from lease termination … recorded in 2024 … These increases were partially offset by decreases of $27.0 million related to stock-based compensation and $23.3 million in certain loss contingencies including legal and tax accruals and settlements.”',
    drivers:[['','Loss contingencies','2Q26 10-Q: “General and administrative expenses increased $69.3 million, or 30%, … primarily due to a $39.2 million net increase in certain loss contingencies related to legal and tax accruals and settlements. There were also increases in personnel-related costs driven by increased headcount and consulting and advisory costs.”']],
    calls:[{q:'Q2 2026', txt:'“Separately, we have incurred, and expect to continue incurring, integration costs associated with our recent acquisitions, in line with a typical post-acquisition integration period.”', who:'Prepared remarks'}] }
];
