// segments-data/nvda.js — the Top Line dataset for NVIDIA (NASDAQ: NVDA).
// Contract: playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/NVDA.md. Built Nov 2 2026.
//
// SHAPE OF THIS COMPANY: NVIDIA reports two segments (Compute & Networking, Graphics; 10-K Note 17), but since
// 1Q FY27 it publishes revenue by MARKET PLATFORM — Data Center (split into Hyperscale and ACIE) and Edge
// Computing — and that is how it explains the business. The platforms are the "segments" on this tab
// (SAB, Nov 2 2026); the reportable segments, the old platforms and geography are cuts in Other.
// NVIDIA's fiscal year ends in late January: 2Q27 = the quarter to Jul 26 2026; 2026 = FY2026.
//
// Every series is a POINTER into js/results-data/nvda.js (`results:<key>`), so each number has one home. The engine
// reads `act` and falls back to `summit`, never `cons`. Summit (rule 10, frozen on purpose, not live): the model
// (snapshot 2026-08-28) projects Data Center but not Hyperscale, ACIE or Edge Computing, so the platforms carry no
// forecast here and `summit` below stays empty; the Data Center forecast is in Evolution ▸ Results and Estimates.
// Hyperscale / ACIE are on the basis after the 2Q FY27 reclassification of one customer from ACIE to Hyperscale,
// which NVIDIA has published for 1Q26 onward — so the platform axis starts at 1Q26 (annual: FY2025–FY2026).
// Segment operating income is not shown here: NVIDIA reports profit for its two reportable segments, not for the
// market platforms (`drivers.opinc` is null) — segment profit lives in Bottom Line.
//
// TEXT CHIPS: `tenK` = FILING, verbatim with its location — the FY2026 10-K (acc. 0001045810-26-000021), the 2Q FY27
// 10-Q (acc. 0001045810-26-000075) or the 1Q FY27 earnings release (8-K Ex. 99.1, acc. 0001045810-26-000051, which
// introduced the platforms). `summary` / `brief` / `sells` / `what` = OURS. No earnings-call transcripts are on file
// (Quartr is not connected; SAB to provide the IR PDFs), so there is no CALL item and no management commentary.
// Old content absorbed (docs/profiles/NVDA.md §5): #11 FY2026 mix → the General stack; #12 SEG_NEW definitions →
// `brief`; #13 "The bridge" → the old-platforms note in Other; #16 SEG_MILESTONES → `milestones` (kept as data:
// the engine has no text slot for them — its `highlights` are bridge-table rows; the main ones are in the Timeline).

var K10 = 'FY2026 Form 10-K';
var Q10 = '2Q FY27 Form 10-Q';
var PR1 = '1Q FY27 earnings release (8-K Ex. 99.1, May 20, 2026)';
var URL_K = 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm';
var URL_Q = 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm';
var URL_PR = 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000051/q1fy27pr.htm';

// The platform definitions NVIDIA gave when it introduced them (one sentence covers both Data Center sub-markets).
var DEF_DC = 'Hyperscale will include revenue from the public clouds and the world’s largest consumer internet companies, while ACIE addresses NVIDIA’s growth opportunity in diverse AI purpose-built data centers and AI factories across industries and countries.';
var DEF_EDGE = 'Edge Computing highlights data processing devices for agentic and physical AI including PCs, game consoles, workstations, AI-RAN base stations, robotics and automotive.';

var DIRECT = { text: 'We refer to customers who purchase products directly from NVIDIA as direct customers, such as AIBs, distributors, ODMs, OEMs, CSPs, AI model makers, and system integrators.',
               where: K10 + ', Item 7 — Concentration of Revenue' };
var INDIRECT = { text: 'We refer to indirect customers as those who purchase products through our direct customers; indirect customers include CSPs, Neocloud builders, AI model makers, enterprises, and public sector entities.',
                 where: K10 + ', Item 7 — Concentration of Revenue' };
var CONC_Q = 'For the second quarter of fiscal year 2027, one direct customer represented 16% of total revenue, which was primarily attributable to the Compute & Networking segment (' + Q10 + ').';

var KPI_NOTE = 'NVIDIA publishes one number per market platform each quarter — its revenue (CFO commentary and 10-Q, "Revenue by Market Platform") — and nothing else: no units shipped, prices, ASPs, customers or profit by platform. Profit is reported only for the two reportable segments (Bottom Line). The share of revenue below is derived from the same table.';
function kpis(k, label){
  return [
    { name: label + ' revenue', definition: 'Revenue from the market platform. Use the YoY / QoQ pills for growth.',
      filing: Q10 + ', Note 13 — Revenue by Market Platform', unit: 'usdM', periodicity: 'Quarterly (annual from the sum of quarters / the recast years)',
      source: 'CFO commentary and 10-Q, through the Results dataset.', series: 'results:' + k },
    { name: 'Share of NVIDIA revenue', definition: 'The platform’s revenue ÷ total revenue (derived here, not printed by NVIDIA).',
      source: 'Derived from the same table.', unit: 'pct', periodicity: 'Quarterly and annual', series: k + 'Share' },
  ];
}
function share(num, den, label){ return { num: 'results:' + num, den: 'results:' + den, unit: 'pct', label: label, short: label }; }
var PXQ = function(label){
  return { name: 'Units × price per unit', relation: label + ' revenue = units shipped × average price per unit', bridge: null,
    lines: [label],
    why: 'The price × volume identity every hardware line has. Volume is how many GPUs, systems and network ports ship; price is what each one sells for, and it has risen with each generation as NVIDIA moved from boards to complete rack-scale systems (Hopper → Blackwell → Blackwell Ultra → Rubin). Whether that price holds would be read against unit cost, which NVIDIA does not disclose either (gross margin is the only proxy, in Bottom Line).',
    data: 'NOT CHARTED — NVIDIA publishes no units, no price per GPU or system and no unit cost, for any platform. No figure here is estimated (rule 7).' };
};

export var nvdaSegments = {
  company: 'NVIDIA',
  updated: 'Nov 2026',
  source: 'Market-platform revenue: NVIDIA quarterly CFO commentaries (8-K Ex. 99.2) and the 2Q FY27 Form 10-Q (Note 13, Revenue by Market Platform), on the basis after the 2Q FY27 reclassification; 3Q26–4Q26 and the FY2025–FY2026 Hyperscale / ACIE split from Bloomberg’s recast history, which adds up to the reported Data Center. Definitions quoted from the 1Q FY27 earnings release and the FY2026 Form 10-K. Other cuts: reportable segments and the old market platforms from the CFO commentaries (FY2020–FY2026), geography from the FY2026 10-K Note 17 (customer headquarters, prior years recast). Customers: FY2026 10-K and 2Q FY27 10-Q concentration notes; Bloomberg Supply Chain Analysis (estimates). All series read through from js/results-data/nvda.js. Summit DCF model (snapshot 2026-08-28, frozen on purpose, not live) projects Data Center only, so the platforms carry no forecast on this tab.',

  axis: {
    q: ['1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27'],
    y: ['2025', '2026'],
  },
  summit: {},   // frozen on purpose, not live — empty: the model has no Hyperscale / ACIE / Edge series (DC is read through Results)

  // Series for the Other cuts that are not Results metrics: geography by customer headquarters (10-K Note 17).
  shared: {
    g_us: { label: 'United States', short: 'United States', unit: 'usdM', scope: 'company', src: K10 + ' Note 17, by customer headquarters (recast)',
      y: { act: { '2024': 31533, '2025': 77482, '2026': 149617 } } },
    g_tw: { label: 'Taiwan', short: 'Taiwan', unit: 'usdM', scope: 'company', src: K10 + ' Note 17, by customer headquarters (recast)',
      y: { act: { '2024': 14912, '2025': 23600, '2026': 42345 } } },
    g_cn: { label: 'China (incl. Hong Kong)', short: 'China', unit: 'usdM', scope: 'company', src: K10 + ' Note 17, by customer headquarters (recast)',
      y: { act: { '2024': 12330, '2025': 25048, '2026': 19677 } } },
    g_oth: { label: 'Other', short: 'Other', unit: 'usdM', scope: 'company', src: K10 + ' Note 17, by customer headquarters (recast)',
      y: { act: { '2024': 2147, '2025': 4367, '2026': 4299 } } },
  },
  derived: {
    hyperShare: share('hyper', 'rev', 'Hyperscale share of revenue'),
    acieShare:  share('acie', 'rev', 'ACIE share of revenue'),
    edgeShare:  share('edge', 'rev', 'Edge Computing share of revenue'),
    hyperOfDC:  share('hyper', 'dc', 'Hyperscale share of Data Center'),
    acieOfDC:   share('acie', 'dc', 'ACIE share of Data Center'),
  },

  overview: {
    tenK: {
      text: 'We report our business results in two segments. The Compute & Networking segment includes our Data Center accelerated computing and networking platforms and AI solutions and software, and Automotive platforms and autonomous and electric vehicle solutions including software. The Graphics segment includes GeForce GPUs for gaming and PCs, and Quadro/NVIDIA RTX GPUs for enterprise workstation graphics.',
      where: K10 + ', Item 1 — Our Businesses',
    },
  },

  // ── The market platforms, as NVIDIA has reported them since 1Q FY27 ──
  segments: [
    {
      key: 'hyper', label: 'Hyperscale', short: 'Hyperscale',
      tenK: { text: DEF_DC, where: PR1 + ' — new reporting framework', url: URL_PR, verbatim: true },
      summary: 'About half of Data Center: the public clouds and the largest consumer-internet companies, which buy NVIDIA’s rack-scale systems by the tens of billions a year.',
      brief: 'Data Center sales to the public clouds (Microsoft Azure, AWS, Google Cloud, Oracle) and the largest consumer-internet companies. They rent the capacity out or use it for their own AI models and services. It is the larger of the two Data Center sub-markets — about half of Data Center, by NVIDIA’s own account.',
      sells: [
        { name: 'Rack-scale AI systems', what: 'GB200 / GB300 NVL72 racks — 72 GPUs and 36 Grace CPUs working as one machine.' },
        { name: 'GPU boards and servers', what: 'HGX B200 / B300 boards that server makers build into their systems.' },
        { name: 'Networking', what: 'NVLink switches, InfiniBand and Spectrum-X Ethernet that link the racks.' },
        { name: 'Next generation', what: 'Vera Rubin, ramping in FY2027.' },
      ],
      products: [
        { name: 'GB300 / GB200 NVL72', what: 'Liquid-cooled racks of 72 Blackwell (Ultra) GPUs and 36 Grace CPUs on NVLink, sold as complete systems.',
          tenK: { text: 'In fiscal year 2025, we launched the NVIDIA Blackwell architecture, a full set of data center scale infrastructure that includes GPUs, CPUs, DPUs, interconnects, switch chips and systems, and networking adapters.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: DIRECT, named: [], note: 'Built mostly by ODMs (Foxconn, Quanta, Wiwynn) and OEMs (Dell, Super Micro) for the clouds that run them — the direct customer is usually the system builder, the end customer the cloud.', concentration: CONC_Q } },
        { name: 'HGX B300 / B200', what: 'Eight-GPU boards that server makers turn into their own AI servers.',
          customers: { archetype: DIRECT, named: [], concentration: CONC_Q } },
        { name: 'NVLink, InfiniBand and Spectrum-X networking', what: 'The fabric inside and between racks; Spectrum-X is NVIDIA’s Ethernet for AI.',
          tenK: { text: 'Our networking offerings include NVLink interconnects and switches, end-to-end platforms for InfiniBand and Ethernet, consisting of network adapters, cables, DPUs, switch chips and systems, as well as software.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: INDIRECT, named: [] } },
        { name: 'NVLink Fusion', what: 'Lets a cloud plug its own custom CPU or accelerator into NVIDIA’s NVLink fabric.',
          tenK: { text: 'In fiscal year 2026, we introduced NVIDIA NVLink Fusion to enable hyperscalers and custom ASIC designers to integrate custom CPUs and XPUs with our platform.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: INDIRECT, named: [] } },
        { name: 'Vera Rubin', what: 'The next platform (Rubin GPUs, Vera CPUs), in production in FY2027.',
          tenK: { text: 'In fiscal year 2026, we unveiled the NVIDIA Rubin platform, which is expected to commence production shipments in the second half of fiscal year 2027.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: INDIRECT, named: [], note: 'The 2Q FY27 release (8-K) says Vera Rubin racks are running at partners including CoreWeave, Google Cloud, Microsoft Azure, Oracle Cloud Infrastructure and Nebius — a release, not a call, so they are not listed as named customers.' } },
      ],
      kpis: kpis('hyper', 'Hyperscale'), kpiNote: KPI_NOTE,
      interactions: [
        PXQ('Hyperscale'),
        { name: 'Data Center × Hyperscale share', relation: 'Hyperscale revenue = Data Center revenue × Hyperscale share of Data Center', bridge: 'dcshare',
          lines: ['Data Center'],
          why: 'How much of Data Center the large clouds take. NVIDIA said in 1Q FY27 that Hyperscale was about half of Data Center, the rest coming from AI clouds, industrial, enterprise and sovereign customers; the share shows whether the customer base is diversifying.',
          data: 'Charted from 1Q26 (the first quarter on the post-reclassification basis). Data Center and Hyperscale from the 10-Q / CFO commentary; the share is one divided by the other.' },
      ],
      bridges: [
        { key: 'dcshare', label: 'Share of Data Center', view: 'q', target: 'rev', kind: 'decomposition', terms: ['results:dc', 'hyperOfDC'],
          identity: 'Hyperscale = Data Center × Hyperscale share of Data Center',
          note: 'A decomposition, not an independent build: the share IS Hyperscale divided by Data Center, so the two terms multiply back to Hyperscale by construction. What it shows is the split between Data Center growth and the mix within it.' },
      ],
      highlights: [],
      milestones: ['2016 — DGX-1, first AI supercomputer in a box (hand-delivered to OpenAI)', '2020 — Mellanox acquisition adds InfiniBand/Ethernet networking', '2022 — Hopper H100 launches into the ChatGPT demand wave', '2024 — Blackwell announced', '2025–26 — GB200 / GB300 NVL72 rack-scale systems ramp'],
      drivers: { rev: { from: 'results:hyper' }, opinc: null },
    },
    {
      key: 'acie', label: 'AI Clouds, Industrial & Enterprise', short: 'ACIE',
      tenK: { text: DEF_DC, where: PR1 + ' — new reporting framework', url: URL_PR, verbatim: true },
      summary: 'The other half of Data Center: AI-only clouds, sovereign AI factories and enterprises — the part of demand that does not depend on the four large clouds.',
      brief: 'Data Center sales outside the largest clouds: specialised AI clouds (“neoclouds”), national or sovereign AI data centers, industrial companies and enterprises building their own AI factories. NVIDIA calls it its growth opportunity in purpose-built AI data centers across industries and countries.',
      sells: [
        { name: 'Rack-scale systems for AI clouds', what: 'The same GB300 NVL72 racks, bought by GPU clouds that rent them out.' },
        { name: 'DGX systems and DGX Cloud', what: 'NVIDIA’s own AI servers and its cloud service.' },
        { name: 'RTX PRO servers', what: 'Blackwell servers for enterprise AI and graphics in a standard data center.' },
        { name: 'NVIDIA AI Enterprise', what: 'Licensed software to run AI in production.' },
      ],
      products: [
        { name: 'GB300 NVL72 for AI clouds and sovereign AI', what: 'Rack-scale systems bought by GPU clouds and national AI factories.',
          customers: { archetype: INDIRECT, named: [], note: 'NVIDIA said in 1Q FY27 that the half of Data Center outside Hyperscale came from AI clouds, industrial, enterprise and sovereign customers (CFO commentary).', concentration: CONC_Q } },
        { name: 'DGX systems and DGX Cloud', what: 'NVIDIA-built AI supercomputers, and the same capacity rented through cloud partners.',
          customers: { archetype: INDIRECT, named: [] } },
        { name: 'RTX PRO Blackwell servers', what: 'Air-cooled servers with RTX PRO GPUs (e.g. the RTX PRO 4500 Blackwell Server Edition, announced 1Q FY27) for enterprise data centers.',
          customers: { archetype: INDIRECT, named: [] } },
        { name: 'NVIDIA AI Enterprise', what: 'Paid software licences: frameworks, NIM microservices and tools for enterprise AI.',
          tenK: { text: 'In addition to software delivered to customers as an integral part of our data center computing and networking platform, we offer paid licenses to NVIDIA AI Enterprise, a comprehensive suite of enterprise-grade AI software and NVIDIA vGPU software for graphics-rich virtual desktops and workstations.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: INDIRECT, named: [] } },
      ],
      kpis: kpis('acie', 'ACIE'), kpiNote: KPI_NOTE,
      interactions: [
        PXQ('ACIE'),
        { name: 'Data Center × ACIE share', relation: 'ACIE revenue = Data Center revenue × ACIE share of Data Center', bridge: 'dcshare',
          lines: ['Data Center'],
          why: 'The diversification of Data Center away from the large clouds, read as a share of the whole.',
          data: 'Charted from 1Q26 (post-reclassification basis). Data Center and ACIE from the 10-Q / CFO commentary; the share is one divided by the other.' },
      ],
      bridges: [
        { key: 'dcshare', label: 'Share of Data Center', view: 'q', target: 'rev', kind: 'decomposition', terms: ['results:dc', 'acieOfDC'],
          identity: 'ACIE = Data Center × ACIE share of Data Center',
          note: 'A decomposition: the share is ACIE divided by Data Center, so the terms multiply back to ACIE by construction. 2Q27’s reclassification moved one customer out of ACIE; every quarter shown is on the new basis.' },
      ],
      highlights: [],
      drivers: { rev: { from: 'results:acie' }, opinc: null },
    },
    {
      key: 'edge', label: 'Edge Computing', short: 'Edge',
      tenK: { text: DEF_EDGE, where: PR1 + ' — new reporting framework', url: URL_PR, verbatim: true },
      summary: 'Everything outside the data center — gaming, workstations, cars, robots — about 7% of revenue, and essentially the old Gaming + ProViz + Automotive + OEM combined.',
      brief: 'Chips and systems that run AI and graphics on the device: GeForce gaming GPUs, game-console chips, RTX PRO workstation GPUs, computers for cars (DRIVE) and robots (Jetson), and AI radio base stations. It is what used to be reported as Gaming, Professional Visualization, Automotive and OEM.',
      sells: [
        { name: 'GeForce RTX', what: 'Gaming GPUs for desktops and laptops, and the GeForce NOW cloud service.' },
        { name: 'Console chips', what: 'Systems-on-chip for game consoles.' },
        { name: 'RTX PRO workstations', what: 'GPUs for designers, engineers and local AI.' },
        { name: 'DRIVE and Jetson', what: 'Computers for cars and robots.' },
        { name: 'AI-RAN', what: 'Base-station computing for telecom networks.' },
      ],
      products: [
        { name: 'GeForce RTX 50 Series and GeForce NOW', what: 'Blackwell gaming GPUs for desktop and laptop PCs, and cloud gaming.',
          tenK: { text: 'Our products for the gaming market include GeForce RTX GPUs for gaming desktop and laptop PCs, GeForce NOW cloud gaming service, as well as SoCs and development services for game consoles.', where: K10 + ', Item 1 — Gaming' },
          customers: { archetype: { text: 'Gamers choose NVIDIA GPUs to enjoy immersive, increasingly cinematic virtual worlds.', where: K10 + ', Item 1 — Our Company' }, named: [], note: 'Sold through add-in-board makers, PC makers and distributors (the direct customers).' } },
        { name: 'Game-console SoCs', what: 'Chips and development services for consoles — Nintendo Switch 2 is the current one (our identification; the 10-K does not name the console).',
          customers: { archetype: DIRECT, named: [] } },
        { name: 'RTX PRO workstation GPUs', what: 'Blackwell GPUs for design, engineering and content creation, increasingly used to run AI locally.',
          tenK: { text: 'Many leading 3D design and content creation applications developed by our ecosystem partners support RTX, allowing professionals to accelerate and transform their workflows with NVIDIA RTX PRO GPUs and software.', where: K10 + ', Item 1 — Professional Visualization' },
          customers: { archetype: DIRECT, named: [] } },
        { name: 'DRIVE AGX Thor / DRIVE Hyperion', what: 'The in-car computer and reference platform for automated driving.',
          tenK: { text: 'Leveraging our technology leadership in AI and building on long-standing relationships across several hundred automotive ecosystem partners, we are delivering a full stack end-to-end solution for the AV market under the DRIVE Hyperion platform.', where: K10 + ', Item 1 — Automotive' },
          customers: { archetype: DIRECT, named: [] } },
        { name: 'Jetson Thor and Isaac', what: 'Embedded computers and software for robots.',
          tenK: { text: 'For physical AI, we provide an end-to-end platform spanning data center infrastructure, open models, systems, embedded compute modules, and software stacks to train, simulate, and deploy advanced automation and robotics solutions.', where: K10 + ', Item 1 — Data Center' },
          customers: { archetype: DIRECT, named: [] } },
      ],
      kpis: kpis('edge', 'Edge Computing'), kpiNote: KPI_NOTE,
      interactions: [
        PXQ('Edge Computing'),
        { name: 'Edge = everything outside Data Center', relation: 'Edge Computing revenue = total revenue − Data Center revenue', bridge: null,
          lines: ['Total revenue', 'Data Center'],
          why: 'The identity NVIDIA’s recast uses: the two platforms add up to total revenue, so Edge is the remainder. It ties to the dollar in every quarter (e.g. 2Q27: $96,221M − $89,023M = $7,198M).',
          data: 'NOT CHARTED as a bridge — it is a subtraction, and the engine’s bridge chart multiplies its terms. The General stack shows the same identity.' },
      ],
      bridges: [],
      highlights: [],
      milestones: ['1999 — GeForce 256, marketed as the first "GPU"', '2018 — RTX brings real-time ray tracing + DLSS AI upscaling', '2021 — Omniverse for industrial digital twins', 'DRIVE (automotive) and Jetson / Isaac (robotics)', 'FY2027 — Gaming, Pro Viz and Auto regrouped into Edge Computing'],
      drivers: { rev: { from: 'results:edge' }, opinc: null },
    },
  ],

  // ── Alternative cuts of the SAME total (SAB, Nov 2 2026) ──
  other: [
    {
      key: 'reportable', label: 'Reportable segments', sub: 'Compute & Networking and Graphics',
      lede: 'The two segments NVIDIA reports profit for. Compute & Networking is Data Center plus automotive and robotics computers; Graphics is GeForce and RTX PRO.',
      note: 'CFO commentary, "Revenue by Reportable Segments", each quarter since 1Q FY21 (FY2020 quarters from the FY2021 commentaries’ year-ago column, when the segments were introduced). Segment operating income is in Bottom Line.',
      tenK: { text: 'We report our business results in two segments.', where: K10 + ', Item 1 — Our Businesses' },
      cite: { form: '10-K', period: 'FY2026', accession: '0001045810-26-000021', url: URL_K },
      spans: 'Quarterly 1Q20–2Q27; annual FY2020–FY2026.',
      axis: { q: ['1Q20', '2Q20', '3Q20', '4Q20', '1Q21', '2Q21', '3Q21', '4Q21', '1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27'],
              y: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'] },
      views: ['q', 'y'],
      series: [
        { key: 'cnrev', ref: 'results:cnrev', label: 'Compute & Networking',
          tenK: { text: 'The Compute & Networking segment includes our Data Center accelerated computing and networking platforms and AI solutions and software, and Automotive platforms and autonomous and electric vehicle solutions including software.', where: K10 + ', Item 1' } },
        { key: 'grrev', ref: 'results:grrev', label: 'Graphics',
          tenK: { text: 'The Graphics segment includes GeForce GPUs for gaming and PCs, and Quadro/NVIDIA RTX GPUs for enterprise workstation graphics.', where: K10 + ', Item 1' } },
      ],
    },
    {
      key: 'oldplat', label: 'Market platforms through FY2026', sub: 'as reported before the FY2027 change',
      lede: 'The framework NVIDIA used until FY2026: Data Center, Gaming, Professional Visualization, Automotive and OEM & Other. Data Center carries over unchanged; the other four became Edge Computing.',
      note: 'The bridge: the new Edge Computing platform ($22.2B in FY2026) is the old Gaming + Professional Visualization + Automotive + OEM combined ($16.0B + $3.2B + $2.3B + $0.6B, to the dollar). Data Center is unchanged between the two frameworks — what changed is its Hyperscale / ACIE sub-split. Source: each quarter’s CFO commentary, "Revenue by Market Platform" (FY2020 names: “Datacenter”, “OEM and IP”).',
      tenK: { text: 'Our platforms address four large markets where our expertise is critical: Data Center, Gaming, Professional Visualization, and Automotive.', where: K10 + ', Item 1 — Our Markets' },
      cite: { form: '10-K', period: 'FY2026', accession: '0001045810-26-000021', url: URL_K },
      spans: 'Quarterly 1Q20–4Q26; annual FY2020–FY2026.',
      axis: { q: ['1Q20', '2Q20', '3Q20', '4Q20', '1Q21', '2Q21', '3Q21', '4Q21', '1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'],
              y: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'] },
      views: ['q', 'y'],
      series: [
        { key: 'dc', ref: 'results:dc', label: 'Data Center' },
        { key: 'gaming', ref: 'results:gaming', label: 'Gaming' },
        { key: 'pv', ref: 'results:pv', label: 'Professional Visualization' },
        { key: 'auto', ref: 'results:auto', label: 'Automotive' },
        { key: 'oem', ref: 'results:oem', label: 'OEM & Other' },
      ],
    },
    {
      key: 'dcsplit', label: 'Data Center: compute vs networking', sub: 'as disclosed through FY2026',
      lede: 'Data Center split into compute (GPUs, CPUs, systems) and networking (NVLink, InfiniBand, Ethernet). Networking went from about a sixth of Data Center to a fifth as Blackwell racks ramped.',
      note: 'CFO commentary (1Q25–4Q26) and the FY2026 10-K table of revenue by end market; 1Q24–4Q24 from Bloomberg’s reported history, which adds up to the reported Data Center. NVIDIA stopped disclosing the split with the FY2027 framework (1Q27 gave it once more in words: compute $60.4B, networking $14.8B).',
      caveat: 'Compute + networking = Data Center to the dollar in every period shown. Not disclosed after 4Q26.',
      tenK: { text: 'Our networking offerings include NVLink interconnects and switches, end-to-end platforms for InfiniBand and Ethernet, consisting of network adapters, cables, DPUs, switch chips and systems, as well as software.', where: K10 + ', Item 1 — Data Center' },
      cite: { form: '10-K', period: 'FY2026', accession: '0001045810-26-000021', url: URL_K },
      spans: 'Quarterly 1Q24–4Q26; annual FY2024–FY2026.',
      axis: { q: ['1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26'], y: ['2024', '2025', '2026'] },
      views: ['q', 'y'],
      series: [
        { key: 'compute', ref: 'results:compute', label: 'Compute' },
        { key: 'netw', ref: 'results:netw', label: 'Networking' },
      ],
    },
    {
      key: 'geo', label: 'Geography', sub: 'by where customers are headquartered',
      lede: 'The same revenue by the headquarters of NVIDIA’s direct customers — not where the chips end up. Taiwan is large because the system builders (ODMs) are based there.',
      note: 'Annual only: FY2026 10-K, Note 17. NVIDIA switched from billing location to customer headquarters in 3Q FY26 and recast the prior years.',
      caveat: 'Headquarters, not end use: NVIDIA estimates 76% of FY2026 Data Center revenue from Taiwan-headquartered customers went to end customers in the United States and Europe.',
      tenK: { text: 'Revenue by geographic area is based upon the location of the customers’ headquarters. The end customer and shipping location may be different from our customers’ headquarters location.', where: K10 + ', Note 17' },
      cite: { form: '10-K', period: 'FY2026', accession: '0001045810-26-000021', url: URL_K },
      spans: 'FY2024–FY2026, from the FY2026 10-K.',
      axis: { y: ['2024', '2025', '2026'] },
      views: ['y'],
      series: [
        { key: 'g_us', ref: 'shared:g_us', label: 'United States' },
        { key: 'g_tw', ref: 'shared:g_tw', label: 'Taiwan' },
        { key: 'g_cn', ref: 'shared:g_cn', label: 'China (incl. Hong Kong)' },
        { key: 'g_oth', ref: 'shared:g_oth', label: 'Other' },
      ],
    },
  ],

  // ── Customers ──
  customers: {
    classes: [
      { key: 'direct', label: 'Direct customers', where: DIRECT.where, text: DIRECT.text },
      { key: 'indirect', label: 'Indirect customers', where: INDIRECT.where, text: INDIRECT.text },
      { key: 'markets', label: 'Who uses the Data Center platform', where: K10 + ', Item 1 — Data Center',
        text: 'Our customers include all major public and private cloud providers, AI model makers, enterprises and startups, and public sector entities.' },
      { key: 'aimaker', label: 'One AI research and deployment company', where: K10 + ', Item 7 — Concentration of Revenue',
        text: 'We estimate that one AI research and deployment company contributed to a meaningful amount of our revenue purchasing cloud services from our customers in fiscal year 2026.' },
    ],
    concentration: { disclosed: true,
      note: 'For fiscal year 2026, sales to one direct customer represented 22% of total revenue and sales to another direct customer represented 14% of total revenue, all of which were primarily attributable to the Compute & Networking segment. For fiscal year 2025, sales to one direct customer represented 12% of total revenue and sales to two direct customers each represented 11% of total revenue, all of which were primarily attributable to the Compute & Networking segment. … Three direct customers accounted for 25%, 18%, and 13% of our accounts receivable balance as of January 25, 2026.' },
    cite: { form: 'FY2026 Form 10-K (Item 7 — Concentration of Revenue; Note 9)', period: 'FY2026', accession: '0001045810-26-000021', url: URL_K },

    // Bloomberg SPLC (nvidia-map-reference/SPLC_BBG.xlsx, NVDA block, customer side; as of 2026-03-06). Every row
    // is a Bloomberg ESTIMATE ("Estimate (NVDA US)"; Avnet "Estimate (AVT US)"), for NVIDIA's 4Q FY26 (quarter to
    // Jan 25 2026) unless stated. amtM = the relationship in $M; theirPct = SPLC cost % (share of that customer's
    // tracked cost going to NVIDIA). `what` = OURS.
    splc: {
      revBaseM: 68127, revBaseLabel: '4Q FY26 revenue',
      coverageWhy: 'every row is a Bloomberg estimate for NVIDIA’s 4Q FY26 (none is a disclosure by either side), and it mixes the clouds that end up with the systems (Microsoft, Amazon, Alphabet, Meta, Oracle) with the system builders that buy the chips first (Super Micro, Foxconn, Dell, Wiwynn) — the same dollar can sit in two rows, so the coverage figure overstates how much of revenue is accounted for',
      named: 20, sized: 20, sizedSumM: 49647.0,
      source: 'Bloomberg Supply Chain Analysis (SPLC) — Bloomberg estimates, not NVIDIA or customer filings',
      file: 'nvidia-map-reference/SPLC_BBG.xlsx (NVDA block, customer side, as of Mar 6, 2026)',
      customers: [
        { name: 'Microsoft', ticker: 'MSFT', amtM: 15020.6, period: '4Q FY26', theirPct: 50.28, basis: 'CAPEX (estimate)', what: 'Azure AI capacity — GB200 / GB300 racks (Hyperscale)' },
        { name: 'Amazon.com', ticker: 'AMZN', amtM: 9551.2, period: '4Q FY26', theirPct: 24.17, basis: 'CAPEX (estimate)', what: 'AWS GPU instances (Hyperscale)' },
        { name: 'Super Micro Computer', ticker: 'SMCI', amtM: 6473.7, period: '4Q FY26', theirPct: 54.47, basis: 'COGS (estimate)', what: 'Server builder — HGX boards and GPUs (direct customer)' },
        { name: 'Alphabet', ticker: 'GOOGL', amtM: 3314.5, period: '4Q FY26', theirPct: 11.90, basis: 'CAPEX (estimate)', what: 'Google Cloud GPU capacity (Hyperscale)' },
        { name: 'Meta Platforms', ticker: 'META', amtM: 2795.6, period: '4Q FY26', theirPct: 13.07, basis: 'CAPEX (estimate)', what: 'GPU clusters for its own AI (Hyperscale)' },
        { name: 'Foxconn Industrial Internet', ticker: '601138 CH', amtM: 2454.1, period: '4Q FY26', theirPct: 7.77, basis: 'COGS (estimate)', what: 'ODM — assembles NVL72 racks (direct customer)' },
        { name: 'Dell Technologies', ticker: 'DELL', amtM: 1727.5, period: '4Q FY26', theirPct: 6.48, basis: 'COGS (estimate)', what: 'AI servers for clouds and enterprises (direct customer)' },
        { name: 'Wiwynn', ticker: '6669 TT', amtM: 1702.2, period: '4Q FY26', theirPct: 19.48, basis: 'COGS (estimate)', what: 'ODM — rack systems for clouds (direct customer)' },
        { name: 'Oracle', ticker: 'ORCL', amtM: 1345.6, period: '4Q FY26', theirPct: 11.18, basis: 'CAPEX (estimate)', what: 'OCI GPU capacity (Hyperscale)' },
        { name: 'CoreWeave', ticker: 'CRWV', amtM: 926.5, period: '4Q FY26', theirPct: 22.82, basis: 'CAPEX (estimate)', what: 'GPU cloud (ACIE)' },
        { name: 'Lenovo Group', ticker: '992 HK', amtM: 758.5, period: '4Q FY26', theirPct: 4.02, basis: 'COGS (estimate)', what: 'PCs, workstations and servers (direct customer)' },
        { name: 'ASUSTeK Computer', ticker: '2357 TT', amtM: 669.5, period: '4Q FY26', theirPct: 11.68, basis: 'COGS (estimate)', what: 'Graphics cards, PCs and servers (direct customer)' },
        { name: 'Gigabyte Technology', ticker: '2376 TT', amtM: 558.7, period: '4Q FY26', theirPct: 23.32, basis: 'COGS (estimate)', what: 'Graphics cards and servers (direct customer)' },
        { name: 'IEIT Systems', ticker: '000977 CH', amtM: 413.0, period: '4Q FY26', theirPct: 7.74, basis: 'COGS (estimate)', what: 'Chinese server builder (direct customer)' },
        { name: 'Avnet', ticker: 'AVT', amtM: 397.3, period: '2Q FY26', theirPct: 7.02, basis: 'COGS (estimate)', what: 'Distributor (direct customer)' },
        { name: 'Quanta Computer', ticker: '2382 TT', amtM: 375.3, period: '4Q FY26', theirPct: 1.95, basis: 'COGS (estimate)', what: 'ODM — servers and racks (direct customer)' },
        { name: 'Hewlett Packard Enterprise', ticker: 'HPE', amtM: 330.1, period: '4Q FY26', theirPct: 5.13, basis: 'COGS (estimate)', what: 'Enterprise AI servers (direct customer)' },
        { name: 'Cisco Systems', ticker: 'CSCO', amtM: 302.6, period: '4Q FY26', theirPct: 5.63, basis: 'COGS (estimate)', what: 'AI servers and networking (direct customer)' },
        { name: 'HP Inc', ticker: 'HPQ', amtM: 282.3, period: '4Q FY26', theirPct: 2.43, basis: 'COGS (estimate)', what: 'PCs and workstations (direct customer)' },
        { name: 'Tesla', ticker: 'TSLA', amtM: 248.2, period: '4Q FY26', theirPct: 10.37, basis: 'CAPEX (estimate)', what: 'Training clusters (ACIE)' },
      ],
    },

    // Section 5 — "What each top customer buys". NVIDIA does not name its customers: the filing rows are the unnamed
    // direct customers it quantifies; the named rows are Bloomberg estimates (4Q FY26 share of revenue), marked so.
    buysLede: 'NVIDIA does not name its largest customers. The first rows are the ones its filings quantify, unnamed; below them, the largest end buyers Bloomberg estimates for 4Q FY26 — estimates, not disclosures.',
    buys: [
      { name: 'Direct customer (unnamed, largest)', what: 'Data Center systems and components', seg: 'Compute & Networking', share: 22, shareBasis: 'filing', src: '10-K FY2026, Concentration of Revenue (FY2026)' },
      { name: 'Direct customer (unnamed, second)', what: 'Data Center systems and components', seg: 'Compute & Networking', share: 14, shareBasis: 'filing', src: '10-K FY2026, Concentration of Revenue (FY2026)' },
      { name: 'Direct customer (unnamed, largest in 2Q FY27)', what: 'Data Center systems and components', seg: 'Compute & Networking', share: 16, shareBasis: 'filing', src: '10-Q 2Q FY27, Concentration of Revenue (the quarter)' },
      { name: 'One AI research and deployment company', what: 'Cloud services built on NVIDIA systems, bought from NVIDIA’s customers', seg: 'Data Center', shareNote: '“a meaningful amount” — not quantified', src: '10-K FY2026; 10-Q 2Q FY27' },
      { name: 'Microsoft', tk: 'MSFT', what: 'GB200 / GB300 rack capacity for Azure', seg: 'Hyperscale', share: 22.0, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'Amazon.com', tk: 'AMZN', what: 'GPU capacity for AWS', seg: 'Hyperscale', share: 14.0, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'Super Micro Computer', tk: 'SMCI', what: 'HGX boards and GPUs for the servers it builds', seg: 'Hyperscale · ACIE (via system builders)', share: 9.5, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'Alphabet', tk: 'GOOGL', what: 'GPU capacity for Google Cloud', seg: 'Hyperscale', share: 4.9, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'Meta Platforms', tk: 'META', what: 'GPU clusters for its own models', seg: 'Hyperscale', share: 4.1, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'Oracle', tk: 'ORCL', what: 'GPU capacity for Oracle Cloud Infrastructure', seg: 'Hyperscale', share: 2.0, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
      { name: 'CoreWeave', tk: 'CRWV', what: 'Rack-scale systems for its GPU cloud', seg: 'ACIE', share: 1.4, shareBasis: 'estimate', src: 'Bloomberg SPLC, 4Q FY26' },
    ],
    buysNote: 'The filing shares are of FY2026 or 2Q FY27 total revenue and refer to DIRECT customers (often system builders); Bloomberg’s rows mix end buyers (clouds) and system builders, so a cloud and the server maker that built its racks can both carry the same dollars. A Bloomberg weight that matches a filing share (Microsoft ~22% next to the unnamed 22%) does not show they are the same customer — the filings identify no one. What each buys is our reading of the platform it sits in (OURS).',
  },
};
