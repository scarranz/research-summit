// nvda-bl-data.js — reported data for NVIDIA Deep Dive ▸ Bottom Line ▸ General (read by ./nvda-bl.js).
//
// Rule 10: only REPORTED figures and filing text here — no market data, no Summit numbers.
//
// 1) The functional expense lines (US$ million), between the BEGIN/END markers — GENERATED, not typed, by the scratch
//    builder build_nvda_bl.py from SEC EDGAR XBRL companyfacts (CIK 0001045810), latest filing of each period:
//      · tags: Revenues (RevenueFromContractWithCustomerExcludingAssessedTax where Revenues is not tagged) · CostOfRevenue
//        (CostOfGoodsAndServicesSold for FY2019) · ResearchAndDevelopmentExpense · SellingGeneralAndAdministrativeExpense ·
//        OperatingIncomeLoss · ShareBasedCompensation (annual `sbc`, cash-flow statement) — as filed in Forms 10-K / 10-Q.
//      · fiscal years end in late January: 2026 = FY2026 (Feb 2025 – Jan 2026); 1Q27 = the quarter to late April 2026.
//      · `arm` = the "Acquisition termination cost" line of FY2023 ($1,353M: the Arm prepayment written off when the
//        acquisition was terminated, 1Q FY2023). It is the only period where revenue − cost of revenue − R&D − SG&A ≠
//        operating income; with it every year and quarter ties to OperatingIncomeLoss to the US$ million.
//      · a Q4 is the fiscal year minus the nine-month year-to-date.
//      · cost of revenue is ONE line: the 10-K does not split it into components (SAB, 2026-11-02: one bar + a note). It
//        includes the $4.5B H20 charge of 1Q FY2026 and inventory provisions ($4.0B in FY2026, $1.6B in FY2025).
//
// 2) NVDA_SBC_FN — stock-based compensation by income-statement line, Form 10-K FY2026, Note 3 (FY2024–FY2026).
//
// 3) NVDA_EW_LINES — one dive per line. Quotes verbatim: Form 10-K FY2026 (filed Feb 25 2026), Item 7 MD&A and Note 1;
//    Form 10-Q 2Q FY2027 (filed Aug 26 2026), MD&A. The 10-K defines cost of revenue but gives no definition of R&D or
//    SG&A beyond the line name, so those two dives carry no "Definition" block. Management commentary: The Motley Fool's
//    transcripts of the 3Q FY26, 4Q FY26, 1Q FY27 and 2Q FY27 calls (SAB, 2026-11-02: NVIDIA posts webcast replays, not
//    transcript text) — third-party, to be checked against the replays; no SG&A-specific remark was made on any of the
//    four calls. The amount, share of revenue, margin effect and the share-of-revenue bars are computed in nvda-bl.js
//    from the series above — never typed here.
//
// BEGIN GENERATED (build_nvda_bl.py, SEC EDGAR XBRL companyfacts, CIK 0001045810, pulled 2026-11-02)
export var NVDA_OPEX_YEARS=[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
export var NVDA_OPEX={
  2019:{"revenue": 11716, "costOfRevenue": 4545, "rnd": 2376, "sga": 991, "arm": 0, "oi": 3804, "sbc": 557},
  2020:{"revenue": 10918, "costOfRevenue": 4150, "rnd": 2829, "sga": 1093, "arm": 0, "oi": 2846, "sbc": 844},
  2021:{"revenue": 16675, "costOfRevenue": 6279, "rnd": 3924, "sga": 1940, "arm": 0, "oi": 4532, "sbc": 1397},
  2022:{"revenue": 26914, "costOfRevenue": 9439, "rnd": 5268, "sga": 2166, "arm": 0, "oi": 10041, "sbc": 2004},
  2023:{"revenue": 26974, "costOfRevenue": 11618, "rnd": 7339, "sga": 2440, "arm": 1353, "oi": 4224, "sbc": 2709},
  2024:{"revenue": 60922, "costOfRevenue": 16621, "rnd": 8675, "sga": 2654, "arm": 0, "oi": 32972, "sbc": 3549},
  2025:{"revenue": 130497, "costOfRevenue": 32639, "rnd": 12914, "sga": 3491, "arm": 0, "oi": 81453, "sbc": 4737},
  2026:{"revenue": 215938, "costOfRevenue": 62475, "rnd": 18497, "sga": 4579, "arm": 0, "oi": 130387, "sbc": 6386},
};
export var NVDA_OPEXQ=[
  {"p": "1Q24", "yr": 2024, "q": "Q1", "revenue": 7192, "costOfRevenue": 2544, "rnd": 1875, "sga": 633, "arm": 0, "oi": 2140},
  {"p": "2Q24", "yr": 2024, "q": "Q2", "revenue": 13507, "costOfRevenue": 4045, "rnd": 2040, "sga": 622, "arm": 0, "oi": 6800},
  {"p": "3Q24", "yr": 2024, "q": "Q3", "revenue": 18120, "costOfRevenue": 4720, "rnd": 2294, "sga": 689, "arm": 0, "oi": 10417},
  {"p": "4Q24", "yr": 2024, "q": "Q4", "revenue": 22103, "costOfRevenue": 5312, "rnd": 2465, "sga": 712, "arm": 0, "oi": 13614},
  {"p": "1Q25", "yr": 2025, "q": "Q1", "revenue": 26044, "costOfRevenue": 5638, "rnd": 2720, "sga": 777, "arm": 0, "oi": 16909},
  {"p": "2Q25", "yr": 2025, "q": "Q2", "revenue": 30040, "costOfRevenue": 7466, "rnd": 3090, "sga": 842, "arm": 0, "oi": 18642},
  {"p": "3Q25", "yr": 2025, "q": "Q3", "revenue": 35082, "costOfRevenue": 8926, "rnd": 3390, "sga": 897, "arm": 0, "oi": 21869},
  {"p": "4Q25", "yr": 2025, "q": "Q4", "revenue": 39331, "costOfRevenue": 10608, "rnd": 3714, "sga": 975, "arm": 0, "oi": 24034},
  {"p": "1Q26", "yr": 2026, "q": "Q1", "revenue": 44062, "costOfRevenue": 17394, "rnd": 3989, "sga": 1041, "arm": 0, "oi": 21638},
  {"p": "2Q26", "yr": 2026, "q": "Q2", "revenue": 46743, "costOfRevenue": 12890, "rnd": 4291, "sga": 1122, "arm": 0, "oi": 28440},
  {"p": "3Q26", "yr": 2026, "q": "Q3", "revenue": 57006, "costOfRevenue": 15157, "rnd": 4705, "sga": 1134, "arm": 0, "oi": 36010},
  {"p": "4Q26", "yr": 2026, "q": "Q4", "revenue": 68127, "costOfRevenue": 17034, "rnd": 5512, "sga": 1282, "arm": 0, "oi": 44299},
  {"p": "1Q27", "yr": 2027, "q": "Q1", "revenue": 81615, "costOfRevenue": 20458, "rnd": 6321, "sga": 1300, "arm": 0, "oi": 53536},
  {"p": "2Q27", "yr": 2027, "q": "Q2", "revenue": 96221, "costOfRevenue": 24079, "rnd": 7054, "sga": 1354, "arm": 0, "oi": 63734},
];
// END GENERATED

// Stock-based compensation by line item (US$ million) — Form 10-K FY2026, Note 3.
export var NVDA_SBC_FN={
  2024:{ costOfRevenue:141, rnd:2532, sga:876 },
  2025:{ costOfRevenue:178, rnd:3423, sga:1136 },
  2026:{ costOfRevenue:261, rnd:4676, sga:1449 }
};
export var NVDA_SBC_FN_SRC='NVIDIA Form 10-K FY2026, Note 3 (stock-based compensation by line item)';

export var NVDA_EW_SRC='— NVIDIA Form 10-K for FY2026, Item 7 (MD&amp;A) · SEC EDGAR';

// Composition / driver rows are [icon (ignored), label, text]. Calls: The Motley Fool transcripts (see the header, item 3).
export var NVDA_EW_LINES=[
  { k:'costOfRevenue', name:'Cost of revenue',
    kpiExtra:['$4.0B','inventory provisions in FY2026 ($1.6B in FY2025), booked in cost of revenue (10-K, balance-sheet note)'],
    def:'Cost of revenue consists of the cost of semiconductors, including wafer fabrication, assembly, testing and packaging, board and device costs, manufacturing support costs, including labor and overhead associated with such purchases, final test yield fallout, inventory and warranty provisions, memory and component costs, tariffs, and shipping costs. Cost of revenue also includes acquisition-related intangible amortization expense, costs for license and development and service arrangements, IP-related costs, and stock-based compensation related to personnel associated with manufacturing operations.',
    comp:[['','Product cost','Wafers from the foundry, packaging and test, boards, memory and other components — NVIDIA is fabless, so this is what it pays its suppliers (Bottom Line ▸ Supply Chain).'],
          ['','Provisions and charges','Inventory and warranty provisions and excess purchase obligations; the $4.5B H20 charge of 1Q FY2026 sits here.']],
    compNote:'The 10-K reports cost of revenue as one line, so the bridge and the cost-structure view draw it as one bar.',
    unit:'<div class="ew-note">NVIDIA does not disclose a dollar cost per GPU or per system.</div>',
    why:'<b>Gross margin is set by mix and by provisions.</b> The 10-K on FY2026: “Gross margin decreased in fiscal year 2026 as our business model transitioned from offering Hopper HGX systems to Blackwell full-scale datacenter solutions. The gross margin decrease was also impacted by a $4.5 billion charge associated with H20 excess inventory and purchase obligations.”',
    drivers:[['','Product transitions','2Q FY27: “Gross margin increased to 75.0% for the second quarter of fiscal year 2027 compared to 72.4% for the second quarter of fiscal year 2026 … due to improved mix from Blackwell Ultra.” (10-Q)'],
             ['','Inventory provisions','2Q FY27: “Provisions for inventory and excess inventory purchase obligations totaled $985 million and $2.1 billion for the second quarter and first half of fiscal year 2027, respectively.” (10-Q)'],
             ['','Memory prices','2Q FY27 call: management reset its gross-margin outlook on memory costs — a bottom of 71%–72% in 4Q FY27, then 72%–73% in FY2028 (see the commentary below).']],
    calls:[{q:'3Q26', txt:'“…input costs are on the rise but we are working to hold gross margins in the mid-seventies.”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“GAAP gross margin was 75% and non-GAAP gross margin was 75.2%, increasing sequentially as Blackwell continued to ramp.”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“The single most important lever of our gross margins is actually delivering generational leads to our customers.”', who:'Colette Kress, CFO'},
           {q:'1Q27', txt:'“For the full year, we are still expecting to be in the mid seventies.”', who:'Colette Kress, CFO'},
           {q:'2Q27', txt:'“As you are already aware, we are experiencing extreme pricing conditions in memory.” … “As a result, we are resetting expectations today.”', who:'Colette Kress, CFO'},
           {q:'2Q27', txt:'“We expect margins to bottom in Q4 in the 71% to 72% range before settling at 72% to 73% in fiscal year ’28…”', who:'Colette Kress, CFO'}] },
  { k:'rnd', name:'Research &amp; development',
    kpiExtra:['31,000','of NVIDIA’s ~42,000 employees work in research and development (10-K, end of FY2026)'],
    def:null,
    comp:[['','Engineers','Compensation and benefits, stock-based compensation included, of the engineering teams — the bulk of the company’s headcount.'],
          ['','Compute and infrastructure','The computing NVIDIA runs for its own chip, system and software development; the fastest-growing part of the line.']],
    compNote:'The 10-K gives no definition of research and development beyond the line name; the composition above is what the MD&amp;A names as its drivers.',
    unit:'<div class="ew-note">NVIDIA does not disclose a cost per engineer or per product generation.</div>',
    why:'The largest operating expense, and the one the product cadence runs through. The 10-K on FY2026: “The increases in research and development expenses for fiscal year 2026 were driven by a 29% increase in compensation and benefits expense, including stock-based compensation, reflecting employee growth and compensation increases and a 79% increase in compute and infrastructure.”',
    drivers:[['','Compute infrastructure','2Q FY27: R&amp;D rose “primarily driven by a 127% and 120% increase in compute infrastructure, respectively, and a 30% increase in each fiscal year 2027 period in compensation and benefits, including stock-based compensation” (10-Q).'],
             ['','Headcount and pay','Employee growth and compensation increases, stock-based compensation included (10-K FY2026).']],
    calls:[{q:'3Q26', txt:'“GAAP operating expenses were up 8% sequentially and up 11% on non GAAP basis.” … “The growth was driven by infrastructure compute, as well as higher compensation and benefits…”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“Fueled by an annual R&amp;D budget approaching $20,000,000,000…”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“Starting this quarter, we will be including stock-based compensation expense in our non-GAAP results.”', who:'Colette Kress, CFO'},
           {q:'1Q27', txt:'“For the full year, we now expect OpEx to grow somewhere in the upper forties on a year over year basis.” … “Driven by higher R&amp;D and acceleration in the usage of AI tools to enhance productivity.”', who:'Colette Kress, CFO'},
           {q:'2Q27', txt:'“GAAP and non-GAAP operating expenses were up 10% and 11% sequentially, primarily due to high compute infrastructure costs…”', who:'Colette Kress, CFO'},
           {q:'2Q27', txt:'“For the full year, we now expect OpEx to grow in the low 50s driven by a broadening of our product portfolio…”', who:'Colette Kress, CFO'}] },
  { k:'sga', name:'Sales, general &amp; administrative',
    kpiExtra:['11,000','employees in sales, marketing, operations and administration (10-K, end of FY2026)'],
    def:null,
    comp:[['','People','Compensation and benefits, stock-based compensation included, of sales, marketing, operations and administrative staff.']],
    compNote:'The 10-K gives no definition of sales, general and administrative beyond the line name.',
    unit:'<div class="ew-note">Not a unit-cost line: it moves with headcount and pay.</div>',
    why:'A small line that has shrunk as a share of revenue as revenue grew. The 10-K on FY2026: “The increases in sales, general and administrative expenses for fiscal year 2026 were primarily driven by compensation and benefits expense, including stock-based compensation, reflecting employee growth and compensation increases.”',
    drivers:[['','Compensation','2Q FY27: “The increases in sales, general and administrative expenses for the second quarter and first half of fiscal year 2027 were primarily driven by compensation and benefits, including stock-based compensation, reflecting employee growth and compensation increases.” (10-Q)']],
    calls:[],
    callsNone:'No remark specific to sales, general and administrative on the last four calls; management discussed operating expenses only in total (see Research &amp; development).' }
];

// ═══ BL-SEG — Bottom Line ▸ Segments (read by ./nvda-bl.js). Reported figures and filing text only (rule 10). ═══
// NVIDIA has two reportable segments, Compute & Networking and Graphics, measured by segment operating income, which
// EXCLUDES stock-based compensation, unallocated operating expenses and acquisition-related costs (Form 10-K FY2026,
// Note 16). Segment revenue and operating income by quarter and year are in ../results-data/nvda.js (cnrev, grrev, cnop,
// grop); the unallocated line is derived there as GAAP operating income − the two segments, which is exactly the 10-K
// reconciliation (FY2026: 139,297 − 6,386 SBC − 1,997 unallocated − 527 acquisition-related = 130,387).
export var NVDA_SEG_SRC='NVIDIA Form 10-K for FY2026 (filed Feb 25 2026), Note 16 Segment Information, and Form 10-Q for 2Q FY27 (filed Aug 26 2026), segment note';
// Depreciation and amortization by segment — Form 10-K FY2026, Note 16 (annual only; FY2026 C&N is given rounded, "$1.6 billion").
// Acquisition-related intangible amortization is not allocated to either segment. US$ millions.
export var NVDA_SEG_DA={ 2024:{ cn:457, gr:307 }, 2025:{ cn:732, gr:372 }, 2026:{ cn:1600, gr:590 } };
// The reconciling items between segment and GAAP operating income — Form 10-K FY2026 Note 16 (years) and the 2Q FY27 10-Q (quarter).
export var NVDA_SEG_UNALLOC={ 2024:{ sbc:3549, un:728, acq:613 }, 2025:{ sbc:4737, un:1171, acq:599 }, 2026:{ sbc:6386, un:1997, acq:527 },
  '2Q27':{ sbc:2027, un:612, acq:222 } };
// Verbatim, Form 10-K FY2026 Note 16.
export var NVDA_SEG_ALLOC={
  unallocated:'Certain expenses are not allocated to either Compute & Networking or Graphics for purposes of making operating decisions or assessing financial performance. The expenses include stock-based compensation expense, corporate infrastructure and support costs, acquisition-related and other costs, and other non-recurring charges and benefits that our CODM deems to be enterprise in nature.',
  codm:'Our CODM assesses operating performance of each segment based on regularly provided segment revenue and segment operating income.',
  expenses:'CODM reviews expenses on a consolidated basis, and expenses attributable to each segment are not regularly provided to our CODM.',
  assets:'Our CODM does not review any information regarding total assets on a reportable segment basis.',
  amort:'Acquisition-related intangible amortization expense is not allocated to either Compute & Networking or Graphics for purposes of making operating decisions or assessing financial performance.'
};
// One dive per segment. def = 10-K Note 16 verbatim. moves = 10-K FY2026 and 10-Q 2Q FY27 MD&A, verbatim. calls = The Motley
// Fool transcripts (SAB, 2026-11-09: as in the Expense lines), every quote checked by script against the call body — Colette
// Kress's prepared remarks, not Motley Fool's own summary that heads each page.
export var NVDA_SEG_DIVES=[
  { k:'cn', name:'Compute & Networking',
    def:'The Compute & Networking segment includes our Data Center accelerated computing and networking platforms and AI solutions and software, and Automotive platforms and autonomous and electric vehicle solutions including software.',
    business:'Almost all of NVIDIA’s profit. In market-platform terms it is Data Center (compute and networking, sold as chips, boards and full rack-scale systems to hyperscalers, AI clouds, model makers, enterprises and governments) plus Automotive — the segment the Data Center build-out runs through.',
    moves:[['Revenue','FY2026: “The year over year increase was driven by the major platform shifts – accelerated computing and AI. Revenue from Data Center computing grew 59% driven by demand for our Blackwell computing platform.” 2Q FY27: “The year-over-year increase in the second quarter and first half of fiscal year 2027 was driven by the ramp of our Blackwell Ultra infrastructure.”'],
           ['Operating income','FY2026: “The year over year increase in Compute & Networking segment operating income was driven by growth in revenue, partially offset by a $4.5 billion charge associated with H20 excess inventory and purchase obligations in the first quarter of fiscal year 2026.”'],
           ['Source','Form 10-K FY2026 and Form 10-Q 2Q FY27, MD&amp;A ▸ Reportable Segments.']],
    calls:[{q:'3Q26', txt:'“Compute grew 56% year over year driven primarily by the GB 300 ramp while networking more than doubled given the onset of NVLink scale up and robust double-digit growth across Spectrum X Ethernet and Quantum X InfiniBand.”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“For the full year, our Networking business exceeded $31,000,000,000 in revenue, up more than 10x compared to fiscal 2021, the year we acquired Mellanox.”', who:'Colette Kress, CFO'},
           {q:'1Q27', txt:'“For your models, data center computing revenue of $60 billion was up 77% year over year, while data center networking revenue of $15 billion nearly tripled year over year.”', who:'Colette Kress, CFO'},
           {q:'2Q27', txt:'“Our networking business had another record quarter with revenue growing 18% on a sequential basis.”', who:'Colette Kress, CFO'}] },
  { k:'gr', name:'Graphics',
    def:'The Graphics segment includes GeForce GPUs for gaming and PCs, and Quadro/NVIDIA RTX GPUs for enterprise workstation graphics.',
    business:'NVIDIA’s original business: GeForce GPUs for gaming and PCs and RTX workstation GPUs. In market-platform terms it sits inside Edge Computing; it is about a tenth of revenue and a smaller share of segment profit.',
    moves:[['Revenue','FY2026: “The year over year increase was driven by sales of our Blackwell architecture.” 2Q FY27: “The year-over-year increase in the second quarter and first half of fiscal year 2027 was driven by sales of our Blackwell architecture.”'],
           ['Operating income','FY2026: “The year over year increase in Graphics segment operating income was driven by the growth in revenue.”'],
           ['Source','Form 10-K FY2026 and Form 10-Q 2Q FY27, MD&amp;A ▸ Reportable Segments.']],
    calls:[{q:'3Q26', txt:'“Gaming revenue was $4.3 billion, up 30% year on year driven by strong demand as 42 million gamers, while thousands of fans packed the GeForce Gamer Festival in South Korea.”', who:'Colette Kress, CFO'},
           {q:'3Q26', txt:'“Professional visualization revenue was $760 million, up 56% year over year.”', who:'Colette Kress, CFO'},
           {q:'4Q26', txt:'“Gaming revenue of $3,700,000,000 increased 47% year on year, driven by strong Blackwell demand and improved supply.”', who:'Colette Kress, CFO'},
           {q:'1Q27', txt:'“Robust Blackwell workstation demand a strong contributor to the growth, while consumer demand fell modestly due to higher memory and system prices.”', who:'Colette Kress, CFO'}] }
];
