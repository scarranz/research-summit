// googl-bl-data.js — reported data for Alphabet Deep Dive ▸ Bottom Line ▸ General (read by ./googl-bl.js).
//
// Rule 10: only REPORTED figures and filing text here — no market data, no Summit numbers.
//
// 1) The functional expense lines (US$ million), between the BEGIN/END markers — GENERATED, not typed, by the
//    scratch builder build_googl_bl_data.py from SEC EDGAR XBRL companyfacts (CIK 0001652044):
//      · tags: Revenues (RevenueFromContractWithCustomerExcludingAssessedTax where Revenues is not tagged) ·
//        CostOfRevenue · ResearchAndDevelopmentExpense · SellingAndMarketingExpense · GeneralAndAdministrativeExpense ·
//        ShareBasedCompensation (annual `sbc`, cash-flow statement) — as filed in Alphabet's Forms 10-K and 10-Q.
//      · TAC is not tagged in XBRL (it is an MD&A table): FY2019–FY2020 from the Form 10-K FY2020 MD&A ("cost of
//        revenues, including TAC"); FY2021 onward and every quarter from js/results-data/googl.js (`tac`, 10-K / 10-Q
//        MD&A). otherCor = cost of revenues − TAC (Alphabet's "other cost of revenues").
//      · FY2019 carries a "European Commission fines" line of $1,697M on the face of the income statement; it is folded
//        into G&A here, which is where Alphabet books fines today (the $3.5B EC fine of 3Q25 sits in G&A).
//      · a Q4 is the fiscal year minus the nine-month year-to-date, so a Q4 line can differ by $1M from the earnings
//        release through rounding.
//      · tie-out run at generation: revenue − cost of revenues − R&D − S&M − G&A = reported income from operations
//        (OperatingIncomeLoss) in every year FY2019–FY2025 and every quarter 1Q23–2Q26, to the US$ million. These four
//        lines ARE Alphabet's costs and expenses.
//
// 2) Share-based compensation by income-statement line is NOT disclosed by Alphabet (the 10-K gives total SBC only;
//    the segment note gives none by function), so GOOGL_SBC_FN is empty and the "SBC by line" view is not offered.
//
// 3) GOOGL_EW_LINES — one dive per line. Quotes are verbatim: Form 10-K FY2025 (filed Feb 5 2026), Item 7 MD&A ("Costs
//    and Expenses" and "Results of Operations"); Form 10-Q 2Q26, MD&A; Alphabet's official earnings-call transcripts
//    (IR PDFs, 4Q25 · 1Q26 · 2Q26). The amount, share of revenue, margin effect and the share-of-revenue bars are
//    computed in googl-bl.js from the series above — never typed here. Dani's "Unit Economics" panel (relocation map
//    #19, #21, #22) lives in the TAC and other-cost-of-revenues dives, with each management figure tied to its call.
//
// BEGIN GENERATED (build_googl_bl_data.py, SEC EDGAR XBRL companyfacts, CIK 0001652044, pulled 2026-10-26)
export var GOOGL_OPEX_YEARS=[2019, 2020, 2021, 2022, 2023, 2024, 2025];
export var GOOGL_OPEX={
  2019:{"revenue": 161857, "costOfRevenue": 71896, "tac": 30089, "otherCor": 41807, "rnd": 26018, "marketing": 18464, "gAdmin": 11248, "sbc": 10794},
  2020:{"revenue": 182527, "costOfRevenue": 84732, "tac": 32778, "otherCor": 51954, "rnd": 27573, "marketing": 17946, "gAdmin": 11052, "sbc": 12991},
  2021:{"revenue": 257637, "costOfRevenue": 110939, "tac": 45566, "otherCor": 65373, "rnd": 31562, "marketing": 22912, "gAdmin": 13510, "sbc": 15376},
  2022:{"revenue": 282836, "costOfRevenue": 126203, "tac": 48955, "otherCor": 77248, "rnd": 39500, "marketing": 26567, "gAdmin": 15724, "sbc": 19362},
  2023:{"revenue": 307394, "costOfRevenue": 133332, "tac": 50886, "otherCor": 82446, "rnd": 45427, "marketing": 27917, "gAdmin": 16425, "sbc": 22460},
  2024:{"revenue": 350018, "costOfRevenue": 146306, "tac": 54900, "otherCor": 91406, "rnd": 49326, "marketing": 27808, "gAdmin": 14188, "sbc": 22785},
  2025:{"revenue": 402836, "costOfRevenue": 162535, "tac": 59926, "otherCor": 102609, "rnd": 61087, "marketing": 28693, "gAdmin": 21482, "sbc": 24953},
};
export var GOOGL_OPEXQ=[
  {"p": "1Q23", "yr": 2023, "q": "Q1", "revenue": 69787, "costOfRevenue": 30612, "tac": 11721, "otherCor": 18891, "rnd": 11468, "marketing": 6533, "gAdmin": 3759},
  {"p": "2Q23", "yr": 2023, "q": "Q2", "revenue": 74604, "costOfRevenue": 31916, "tac": 12537, "otherCor": 19379, "rnd": 10588, "marketing": 6781, "gAdmin": 3481},
  {"p": "3Q23", "yr": 2023, "q": "Q3", "revenue": 76693, "costOfRevenue": 33229, "tac": 12642, "otherCor": 20587, "rnd": 11258, "marketing": 6884, "gAdmin": 3979},
  {"p": "4Q23", "yr": 2023, "q": "Q4", "revenue": 86310, "costOfRevenue": 37575, "tac": 13986, "otherCor": 23589, "rnd": 12113, "marketing": 7719, "gAdmin": 5206},
  {"p": "1Q24", "yr": 2024, "q": "Q1", "revenue": 80539, "costOfRevenue": 33712, "tac": 12946, "otherCor": 20766, "rnd": 11903, "marketing": 6426, "gAdmin": 3026},
  {"p": "2Q24", "yr": 2024, "q": "Q2", "revenue": 84742, "costOfRevenue": 35507, "tac": 13387, "otherCor": 22120, "rnd": 11860, "marketing": 6792, "gAdmin": 3158},
  {"p": "3Q24", "yr": 2024, "q": "Q3", "revenue": 88268, "costOfRevenue": 36474, "tac": 13719, "otherCor": 22755, "rnd": 12447, "marketing": 7227, "gAdmin": 3599},
  {"p": "4Q24", "yr": 2024, "q": "Q4", "revenue": 96469, "costOfRevenue": 40613, "tac": 14848, "otherCor": 25765, "rnd": 13116, "marketing": 7363, "gAdmin": 4405},
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 90234, "costOfRevenue": 36361, "tac": 13748, "otherCor": 22613, "rnd": 13556, "marketing": 6172, "gAdmin": 3539},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 96428, "costOfRevenue": 39039, "tac": 14705, "otherCor": 24334, "rnd": 13808, "marketing": 7101, "gAdmin": 5209},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 102346, "costOfRevenue": 41369, "tac": 14876, "otherCor": 26493, "rnd": 15151, "marketing": 7205, "gAdmin": 7393},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 113829, "costOfRevenue": 45767, "tac": 16597, "otherCor": 29170, "rnd": 18572, "marketing": 8215, "gAdmin": 5341},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 109896, "costOfRevenue": 41271, "tac": 15228, "otherCor": 26043, "rnd": 17032, "marketing": 7606, "gAdmin": 4291},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 119796, "costOfRevenue": 45943, "tac": 16179, "otherCor": 29764, "rnd": 18219, "marketing": 8403, "gAdmin": 6461},
];
// END GENERATED

// Share-based compensation by line item: not disclosed by Alphabet (see the header, item 2).
export var GOOGL_SBC_FN={};
export var GOOGL_SBC_FN_SRC='Alphabet does not disclose share-based compensation by income-statement line (Form 10-K FY2025 gives the total only)';

export var GOOGL_EW_SRC='— Alphabet Form 10-K for FY2025, Item 7 (MD&amp;A), Costs and Expenses · SEC EDGAR';

// Composition / driver rows are [icon (ignored), label, text]. Calls: Alphabet's official IR transcripts, verbatim.
export var GOOGL_EW_LINES=[
  { k:'tac', name:'TAC (traffic acquisition costs)',
    kpiExtra:['20.3%','TAC rate in FY2025, from 20.7% in FY2024 — share of the ad revenue it applies to (10-K MD&amp;A)'],
    def:'TAC includes: amounts paid to our distribution partners who make available our search access points and other ad-supported services. Our distribution partners include browser providers, mobile carriers, original equipment manufacturers, and software developers; and amounts paid to Google Network partners primarily for ads displayed on their properties.',
    comp:[['','Distribution partners','What Google pays browser makers (Apple’s Safari default), carriers, phone makers and software developers to put its search access points in front of users.'],
          ['','Google Network partners','The share of ad revenue paid to the sites and apps that show Google ads — most of the revenue from Network ads is paid out as TAC.']],
    compNote:'The 10-K reports TAC and “other cost of revenues” as the two parts of cost of revenues, so the bridge and the cost-structure view draw them as two bars.',
    unit:'<div class="ew-note">Alphabet discloses the TAC rate (TAC as a share of the ad revenue it applies to), not a cost per query or per partner.</div>',
    why:'<b>A cost that scales with ad revenue, so its weight falls as the mix shifts.</b> The 10-K on 2025: “The TAC rate decreased from 20.7% to 20.3% from 2024 to 2025, primarily due to a revenue mix shift from Google Network properties to Google Search &amp; other properties. The TAC rates on Google Search &amp; other and Google Network revenues were substantially consistent from 2024 to 2025.”',
    drivers:[['','Mix shift away from Network','“TAC as a percentage of revenues generated from ads placed on Google Network properties are significantly higher than TAC as a percentage of revenues generated from ads placed on Google Search &amp; other properties” (10-K) — so a shrinking Network lowers the blended rate.'],
             ['','Distribution partners','2Q26: “The increase in TAC … was largely due to an increase in TAC paid to distribution partners, primarily driven by growth in revenues subject to TAC.” The TAC rate fell from 20.6% to 19.8% (10-Q).'],
             ['','Default-placement deals after the US search case','The September 2025 remedies ruling in the US search case left default payments to partners in place but barred exclusive contracts (relocated from the Unit Economics panel).']],
    calls:[{q:'4Q25', txt:'“TAC was $16.6 billion, up 12%.”', who:'Anat Ashkenazi, CFO'},
           {q:'2Q26', txt:'“TAC was $16.2 billion, up 10%.”', who:'Anat Ashkenazi, CFO'}] },
  { k:'otherCor', name:'Other cost of revenues',
    kpiExtra:['$21.1B','depreciation in FY2025, from $15.3B in FY2024 (+38%), company-wide (4Q25 call)'],
    def:'Other cost of revenues primarily includes: content acquisition costs, which are payments to content providers from whom we license video and other content for distribution, primarily related to YouTube (we pay fees to these content providers based on revenues generated, subscriber counts, or a flat fee); depreciation expense, primarily related to our technical infrastructure; employee compensation expenses related to our technical infrastructure and other operations such as content review and customer and product support; inventory and other costs related to the devices we sell; and other technical infrastructure operations costs, including energy, equipment, and network capacity costs.',
    comp:[['','Technical infrastructure','Depreciation of servers and data centers, the people who run them, and their energy, equipment and network capacity.'],
          ['','Content and devices','YouTube’s payments to content providers; the inventory cost of Pixel devices and, since 2Q26, of TPU systems sold to customers.']],
    unit:'<div class="ew-note">Alphabet does not disclose a dollar cost per query or per AI answer. What management gives is the direction of that cost — see the commentary below: Gemini serving unit cost −78% over 2025 (4Q25), the cost of core AI responses −30% since Gemini 3 (1Q26), Search latency −35% in five years (1Q26) and, from an earlier call, the cost of an AI Overviews query −90% in its first 18 months (3Q24; relocated from the Unit Economics panel, “the unit is a query”).</div>',
    why:'<b>Where the AI build lands in the income statement</b> — servers and data centers depreciate here, against a falling cost to answer each query. The 10-K on 2025: “Cost of revenues increased $16.2 billion from 2024 to 2025 due to an increase in other cost of revenues and TAC of $11.2 billion and $5.0 billion, respectively. … The increase in other cost of revenues from 2024 to 2025 was primarily due to increases in content acquisition costs, largely for YouTube, depreciation expense, and other technical infrastructure operations costs.”',
    drivers:[['','Depreciation of the capex wave','“Given the increase in our CapEx investments in recent years, we expect the growth rate in 2026 depreciation to accelerate in Q1, and meaningfully increase for the full year.” (CFO, 4Q25 call)'],
             ['','TPU systems sold to customers','2Q26: “The increase in other cost of revenues … was primarily due to increases in depreciation expense, inventory and other costs, content acquisition costs, largely for YouTube, and other technical infrastructure operations costs.” (10-Q)'],
             ['','YouTube content','Payments to content providers, based on revenues generated, subscriber counts or a flat fee, grow with YouTube ads and subscriptions (10-K).']],
    calls:[{q:'4Q25', txt:'“We were able to lower Gemini serving unit costs by 78% over 2025 through model optimizations, efficiency and utilization improvements.”', who:'Sundar Pichai, CEO'},
           {q:'4Q25', txt:'“Other Costs of Revenues was $29.2 billion, up 13%, with the increase primarily driven by depreciation associated with the deployment of our technical infrastructure, content acquisition costs largely for YouTube, and other technical infrastructure operations costs.”', who:'Anat Ashkenazi, CFO'},
           {q:'1Q26', txt:'“And since upgrading AI Overviews and AI Mode to Gemini 3, we have reduced the cost of core AI responses by more than 30%, thanks to continued hardware and engineering breakthroughs.”', who:'Sundar Pichai, CEO'},
           {q:'1Q26', txt:'“Even as we have brought new AI features into our results page, we have reduced Search latency by more than 35% over the past five years.”', who:'Sundar Pichai, CEO'},
           {q:'2Q26', txt:'“Other Cost of Revenues was $29.8 billion, up 22%, driven by increases in depreciation, inventory costs, primarily from the sales of TPU systems to customers, and content acquisition costs, largely for YouTube.”', who:'Anat Ashkenazi, CFO'},
           {q:'2Q26', txt:'“Thanks to our engineering and hardware optimizations, this quarter we reduced the cost of AI Mode responses to its lowest level since launch, even as we have brought more advanced AI capabilities.”', who:'Sundar Pichai, CEO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['$4.2B','more SBC inside R&amp;D in FY2025, including the Waymo valuation-based charge (10-K MD&amp;A)'],
    def:'The main components of our research and development expenses are: depreciation expense, primarily related to our technical infrastructure; employee compensation expenses for engineering and technical employees responsible for research and development related to our existing and new products and services; other technical infrastructure operations costs, including energy, equipment, and network capacity costs; and third-party services fees primarily relating to consulting and outsourced services in support of our engineering and product development efforts.',
    comp:[['','Engineers and researchers','Pay and SBC of the engineering and technical teams, Google DeepMind included.'],
          ['','Compute for research','Depreciation and running costs of the technical infrastructure used to train models.']],
    unit:'<div class="ew-note">Alphabet does not disclose a cost per engineer or per model trained.</div>',
    why:'The largest operating expense, and the one the AI talent and training compute run through. The 10-K on 2025: “Research and development expenses increased $11.8 billion from 2024 to 2025, primarily driven by increases in employee compensation expenses of $6.9 billion and depreciation expense of $2.4 billion. The increase in employee compensation expenses was primarily driven by an increase in SBC expenses of $4.2 billion, which included an increase in a valuation-based compensation charge related to Waymo.”',
    drivers:[['','AI talent','“R&amp;D expenses increased by 26%, driven by compensation due to investment in AI talent, as well as depreciation.” (CFO, 1Q26 call)'],
             ['','Waymo compensation charge','4Q25: the $2.1B stock-based compensation charge related to Waymo — “The vast majority of the charge was reflected in R&amp;D expenses.” (CFO)'],
             ['','Depreciation','2Q26: R&amp;D rose “primarily driven by increases in employee compensation expenses of $2.9 billion and $5.3 billion, as well as depreciation expense of $592 million and $1.1 billion” for the three and six months (10-Q).']],
    calls:[{q:'4Q25', txt:'“R&amp;D expense increased by 42%, driven by compensation and depreciation.”', who:'Anat Ashkenazi, CFO'},
           {q:'1Q26', txt:'“R&amp;D expenses increased by 26%, driven by compensation due to investment in AI talent, as well as depreciation.”', who:'Anat Ashkenazi, CFO'},
           {q:'2Q26', txt:'“R&amp;D expenses increased by 32%, driven by compensation from investment in AI talent, as well as depreciation.”', who:'Anat Ashkenazi, CFO'}] },
  { k:'marketing', name:'Sales &amp; marketing',
    kpiExtra:['$1.2B','more advertising and promotion in FY2025, partly offset by $214M less compensation (10-K MD&amp;A)'],
    def:'The main components of our sales and marketing expenses are: employee compensation expenses for employees engaged in sales and marketing, sales support, and certain customer service functions; and spend relating to our advertising and promotional activities in support of our products and services.',
    comp:[['','Sales and support people','Pay of sales, sales support and certain customer-service staff.'],
          ['','Advertising and promotion','Brand and product campaigns — lately the Gemini app and Search.']],
    unit:'<div class="ew-note">Alphabet does not disclose a cost per advertiser or per user acquired.</div>',
    why:'The line that has shrunk as a share of revenue as revenue grew. The 10-K on 2025: “Sales and marketing expenses increased $885 million from 2024 to 2025, primarily driven by an increase in advertising and promotional activities of $1.2 billion, partially offset by a decrease in employee compensation expenses of $214 million.”',
    drivers:[['','Gemini app and Search campaigns','2Q26: “Sales and marketing expenses increased $1.3 billion and $2.7 billion … primarily driven by increases in advertising and promotional activities of $764 million and $1.4 billion, as well as employee compensation expenses of $402 million and $806 million, respectively.” (10-Q)']],
    calls:[{q:'4Q25', txt:'“Sales and Marketing expenses were up 12%, primarily driven by marketing investments to support the Gemini App and Search.”', who:'Anat Ashkenazi, CFO'},
           {q:'1Q26', txt:'“Sales and Marketing expenses were up 23%, driven primarily by marketing investments to support the Gemini app and Search, as well as compensation.”', who:'Anat Ashkenazi, CFO'},
           {q:'2Q26', txt:'“Sales and Marketing expenses were up 18% due to investments to support the Gemini app in Search, and compensation.”', who:'Anat Ashkenazi, CFO'}] },
  { k:'gAdmin', name:'General &amp; administrative',
    kpiExtra:['$3.5B','European Commission fine accrued in 3Q25 — inside G&amp;A (10-K MD&amp;A)'],
    def:'The main components of our general and administrative expenses are: employee compensation expenses for employees in finance, human resources, information technology, legal, and other administrative support functions; expenses relating to legal and other matters, including certain fines and settlements; and third-party services fees, including audit, consulting, outside legal, and other outsourced administrative services.',
    comp:[['','Legal and other matters','Fines, settlements and legal accruals — the swing item.'],
          ['','Corporate functions','Finance, HR, IT and legal staff; audit, consulting and outside-legal fees.']],
    compNote:'FY2019 carried a separate “European Commission fines” line ($1.70B) on the income statement; it is included in G&amp;A here, where Alphabet books fines today.',
    unit:'<div class="ew-note">Not a unit-cost line: it moves with legal accruals, not with volume.</div>',
    why:'The volatile line — one fine or legal accrual moves it by billions in a quarter. The 10-K on 2025: “General and administrative expenses increased $7.3 billion from 2024 to 2025, primarily driven by an increase in expenses related to legal and other matters of $6.2 billion, largely the result of the $3.5 billion EC fine accrued in the third quarter of 2025 and a $1.4 billion legal accrual made in the second quarter of 2025.”',
    drivers:[['','Fines and legal accruals','2Q26: G&amp;A rose “primarily driven by increases in employee compensation expenses of $279 million, non-income tax expenses of $258 million, expenses related to legal and other matters of $231 million which included a $1.5 billion charge related to a certain legal matter” (10-Q).'],
             ['','Charitable contributions','4Q25: “G&amp;A expenses increased 21%, primarily due to a shift in timing of our charitable contributions.” (CFO)']],
    calls:[{q:'4Q25', txt:'“G&amp;A expenses increased 21%, primarily due to a shift in timing of our charitable contributions.”', who:'Anat Ashkenazi, CFO'},
           {q:'1Q26', txt:'“G&amp;A expenses increased 21%, primarily due to an increase in compensation and costs related to legal and other matters.”', who:'Anat Ashkenazi, CFO'},
           {q:'2Q26', txt:'“G&amp;A expenses increased 24%, primarily driven by compensation and charges for certain legal and other matters.”', who:'Anat Ashkenazi, CFO'}] },
];

// 4) GOOGL_SEG_Y / GOOGL_SEG_Q — the segment cost split (Bottom Line ▸ Segments, BL-SEG), US$ million, typed from the
//    filings' segment note ("revenue, profitability, and expense information about our segments" — "Supplemental
//    information about segment expenses"): Form 10-K FY2025, Note 15 (FY2023–FY2025); Forms 10-Q 1Q25–2Q26 (each with
//    its prior-year comparative, so 1Q24–3Q24 come from the 2025 10-Qs). A Q4 is the fiscal year less the nine months.
//    In every row rev − comp − other = oi (checked when typed).
//    comp  = "Employee compensation expenses" (direct and allocated employees).
//    other = "Other costs and expenses" (direct costs — advertising and promotion, inventory, legal and other matters,
//            third-party services — and allocated technical infrastructure and office facilities; Services also carries
//            content acquisition costs and TAC). 3Q25 Services "other" includes the $3.5B EC fine (10-Q footnote).
//    Only Google Services and Google Cloud are split; Other Bets and Alphabet-level activities report revenue and
//    operating income only (those come from js/results-data/googl.js). No D&A, capex or assets by segment.
export var GOOGL_SEG_Y={
  2023:{ svc:{rev:272543, comp:46224, other:130461, oi:95858},  cloud:{rev:33088, comp:19054, other:12318, oi:1716} },
  2024:{ svc:{rev:304930, comp:44560, other:139107, oi:121263}, cloud:{rev:43229, comp:20519, other:16598, oi:6112} },
  2025:{ svc:{rev:342721, comp:45124, other:158193, oi:139404}, cloud:{rev:58705, comp:22078, other:22717, oi:13910} }
};
export var GOOGL_SEG_Q=[
  { p:'1Q24', svc:{rev:70398, comp:11511, other:30990, oi:27897}, cloud:{rev:9574,  comp:5157, other:3517, oi:900} },
  { p:'2Q24', svc:{rev:73928, comp:11240, other:33014, oi:29674}, cloud:{rev:10347, comp:5175, other:4000, oi:1172} },
  { p:'3Q24', svc:{rev:76510, comp:10869, other:34785, oi:30856}, cloud:{rev:11353, comp:5157, other:4249, oi:1947} },
  { p:'4Q24', svc:{rev:84094, comp:10940, other:40318, oi:32836}, cloud:{rev:11955, comp:5030, other:4832, oi:2093} },
  { p:'1Q25', svc:{rev:77264, comp:11337, other:33245, oi:32682}, cloud:{rev:12260, comp:5412, other:4671, oi:2177} },
  { p:'2Q25', svc:{rev:82543, comp:11306, other:38174, oi:33063}, cloud:{rev:13624, comp:5517, other:5281, oi:2826} },
  { p:'3Q25', svc:{rev:87052, comp:11070, other:42455, oi:33527}, cloud:{rev:15157, comp:5586, other:5977, oi:3594} },
  { p:'4Q25', svc:{rev:95862, comp:11411, other:44319, oi:40132}, cloud:{rev:17664, comp:5563, other:6788, oi:5313} },
  { p:'1Q26', svc:{rev:89637, comp:12206, other:36842, oi:40589}, cloud:{rev:20028, comp:6443, other:6987, oi:6598} },
  { p:'2Q26', svc:{rev:94540, comp:12275, other:42721, oi:39544}, cloud:{rev:24768, comp:6933, other:9021, oi:8814} }
];
export var GOOGL_SEG_SRC='Alphabet Form 10-K FY2025 (Note 15, Information about Segments and Geographic Areas) and Forms 10-Q 1Q25–2Q26 (segment note) · SEC EDGAR';
// The 10-K's own words on how costs reach a segment (Form 10-K FY2025, Note 15), verbatim.
export var GOOGL_SEG_ALLOC={
  codm:'Our CODM uses segment operating income (loss) to allocate resources to our segments in our annual planning process and to assess the performance of our segments, primarily by monitoring actual results versus the annual plan. Our operating segments are not evaluated using asset information.',
  direct:'Revenues, certain costs, such as costs associated with content and traffic acquisition, certain engineering activities, and devices, as well as certain operating expenses are directly attributable to our segments.',
  allocated:'Due to the integrated nature of Alphabet, other costs and expenses, such as technical infrastructure and office facilities, are managed centrally at a consolidated level. These costs, including the associated depreciation, are allocated to operating segments as a service cost generally based on usage, headcount, or revenue.',
  unallocated:'Certain costs are not allocated to our segments because they represent Alphabet-level activities. These costs primarily include: certain AI-focused shared research and development activities, including employee compensation expenses and technical infrastructure usage costs associated with the development of our general AI models; corporate initiatives such as our philanthropic activities; and corporate shared costs such as certain finance, human resource, and legal costs, including certain fines and settlements.'
};
// One deep dive per segment. Definitions verbatim from the 10-K FY2025 Note 15; "other" composition verbatim from the
// 10-Q 2Q26 segment note; calls verbatim from Alphabet's official IR transcripts. Every number in the key figures and
// the bars is computed in googl-bl.js from GOOGL_SEG_Y / GOOGL_SEG_Q and the Results dataset.
var G_OTHER_DEF='Google Services and Google Cloud other costs and expenses primarily include direct costs, such as advertising and promotional activities, inventory costs, legal and other matters, and third-party services fees as well as allocated costs, such as technical infrastructure and office facilities usage costs. Additionally, Google Services other costs and expenses include content acquisition costs and TAC.';
export var GOOGL_SEG_DIVES=[
  { k:'svc', name:'Google Services',
    def:'Google Services includes products and services such as ads, Android, Chrome, devices, Google Maps, Google Play, Search, and YouTube. Google Services generates revenues primarily from advertising; fees received for consumer subscription-based products such as YouTube TV, YouTube Music and Premium, and NFL Sunday Ticket, as well as Google One; the sale of apps and in-app purchases; and devices.',
    otherDef:G_OTHER_DEF,
    business:'The advertising and subscriptions business, and more than all of Alphabet’s operating income: what Services earns pays for the Other Bets loss and the unallocated Alphabet-level costs. Its costs are mostly “other costs” — TAC, YouTube content, devices and its share of the technical infrastructure.',
    moves:[
      ['Advertising revenue','Search &amp; other, YouTube ads and Network (Top Line ▸ Segments): paid clicks × cost per click, impressions × cost per impression.'],
      ['TAC and content','Paid to partners and content providers inside “other costs”; they rise with the ad and YouTube revenue they are tied to (10-K Note 15).'],
      ['Allocated infrastructure','Technical infrastructure, “including the associated depreciation”, is allocated as a service cost “generally based on usage, headcount, or revenue” (10-K Note 15), so the capex cycle reaches the segment margin.'],
      ['Legal matters','3Q25 Services operating income includes the $3.5B European Commission fine (10-Q 3Q25 footnote).']
    ],
    calls:[
      {q:'4Q25', txt:'“Google Services operating income increased 22% to $40.1 billion, and operating margins was 41.9%.”', who:'Anat Ashkenazi, CFO'},
      {q:'1Q26', txt:'“Google Services operating income increased 24% to $40.6 billion, and operating margin was 45.3%.”', who:'Anat Ashkenazi, CFO'},
      {q:'2Q26', txt:'“Google Services operating income increased 20% to $39.5 billion, and operating margin was 41.8%.”', who:'Anat Ashkenazi, CFO'}
    ] },
  { k:'cloud', name:'Google Cloud',
    def:'Google Cloud includes infrastructure and platform services, applications, and other services for enterprise customers. Google Cloud generates revenues primarily from consumption-based fees and subscriptions received for Google Cloud Platform services, Google Workspace communication and collaboration tools, and other enterprise services.',
    otherDef:G_OTHER_DEF,
    business:'The enterprise business: AI infrastructure and Gemini models sold by consumption, Workspace and Gemini Enterprise by the seat and, since 2Q26, TPU systems sold into customers’ data centers. Its operating margin went from 2.6% in 1Q23 to 35.6% in 2Q26 while revenue growth accelerated (relocated from the Margins panel, “the Cloud margin ladder”).',
    moves:[
      ['Scale','Revenue grew faster than both cost lines in every year of the split (cost-split table above), so the margin widened.'],
      ['Capacity','Management says Cloud has been supply-constrained; in Q3 2026 it adds third-party capacity as a bridge, which “will put some pressure on operating margins for Cloud” (CFO, 2Q26 call).'],
      ['Wiz','Reported in Cloud since the acquisition closed in March 2026; a low-single-digit percentage-point headwind to Cloud’s operating margin for the rest of 2026 (CFO, 1Q26 call).'],
      ['TPU system sales','Inventory cost of TPU systems sits in “other costs” from 2Q26 (10-Q 2Q26 segment note).']
    ],
    calls:[
      {q:'4Q25', txt:'“Cloud operating income was $5.3 billion, more than doubling year-over-year.”', who:'Anat Ashkenazi, CFO'},
      {q:'2Q26', txt:'“Cloud operating income was $8.8 billion, more than tripling year-over-year, and operating margin increased from 20.7% in the second quarter last year to 35.6%.”', who:'Anat Ashkenazi, CFO'},
      {q:'2Q26', txt:'“That capacity, given the cost of that capacity, will put some pressure on operating margins for Cloud.”', who:'Anat Ashkenazi, CFO'}
    ] },
  { k:'bets', name:'Other Bets',
    def:'Other Bets is a combination of multiple operating segments that are not individually material. Revenues from Other Bets are generated primarily from the sale of autonomous transportation services and internet services.',
    otherDef:null,
    business:'Waymo, GFiber and the smaller bets (Verily was deconsolidated in 1Q26). Revenue is under 1% of Alphabet’s; the loss is set by how much Alphabet chooses to invest, Waymo above all.',
    moves:[
      ['Waymo investment','The $2.1B Waymo-related stock-based compensation charge of 4Q25 sits here (CFO, 4Q25 call).'],
      ['Portfolio pruning','Verily deconsolidated in 1Q26; GFiber to merge into Astound (Evolution ▸ Earnings ▸ Notes, Other Bets).']
    ],
    calls:[
      {q:'4Q25', txt:'“In Other Bets, revenues were $370 million, and operating loss was $3.6 billion, reflecting the $2.1 billion Waymo charge I mentioned earlier.”', who:'Anat Ashkenazi, CFO'},
      {q:'1Q26', txt:'“In Other Bets, revenues were $411 million, and operating loss was $2.1 billion.”', who:'Anat Ashkenazi, CFO'},
      {q:'2Q26', txt:'“In Other Bets, revenues were $382 million, and operating loss was $1.8 billion as we continue to expand Waymo\'s business and invest in key Other Bets.”', who:'Anat Ashkenazi, CFO'}
    ] }
];
