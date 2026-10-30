// segments-data/tsm.js — the Top Line dataset for Taiwan Semiconductor (NYSE: TSM).
// Contract: docs/PANE_CATALOG.md §1 · playbook §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/TSM.md.
//
// SHAPE OF THIS COMPANY: TSMC has ONE operating segment (foundry; 20-F Note 38). What it does publish
// every quarter is revenue by PLATFORM — the end market the chip goes into — so the six platforms are
// the "segments" on this tab (SAB, Oct 15 2026). The General tab quotes the 20-F so no reader takes
// them for reportable segments, and there is no segment profit: TSMC discloses none by platform.
//
// Every series is a POINTER into js/results-data/tsm.js (`results:<key>`), so each number has one
// home: platform revenue = the % TSMC prints on each quarter's presentation × its US$ revenue;
// annual = the 20-F's exact NT$ split × the year's US$ revenue. The engine reads `act` and falls back
// to `summit`, never `cons` — Street figures live in Evolution ▸ Results, not here.
// Summit (rule 10, frozen not live): the `results:<key>` pointers fall back to the Summit series frozen in
// js/results-data/tsm.js (snapshot Oct 19 2026), so the axis runs into the forecast periods (4Q26–2Q27, FY2026–FY2028).
//
// TEXT CHIPS: `tenK` = FILING, verbatim from the FY2025 20-F (the HTML's line-break hyphens such as
// "2- nanometer" are closed up); `summary` / `brief` / `sells` = OURS. TSMC names no customer — the
// 20-F calls them "Customer A" and "Customer B" — so `named` stays empty by fact, not by omission.
// TL-SEG scope (SAB, Oct 15 2026): only what TSMC publishes per platform — its share of revenue and
// its growth each quarter. No revenue identity by platform (no volume × price is disclosed).

var WHO = { text: 'We count among our customers many of the world\'s leading semiconductor companies, ranging from fabless semiconductor companies, system companies to integrated device manufacturers.',
            where: 'FY2025 Form 20-F, Item 4 — Business Overview of the Company' };
var NO_NAMES = 'TSMC does not name its customers. The 20-F (Note 38) shows two above 10% of FY2025 net revenue, unnamed: "Customer A" at 19% and "Customer B" at 17%; the ten largest were about 78%.';
var KPI_NOTE = 'TSMC publishes two things per platform each quarter — the platform\'s share of revenue and its quarter-on-quarter growth (earnings presentation, "Revenue by Platform") — and nothing else: no units, prices, margins or customers by platform. The share is a whole-number %, so a quarter carries up to ±0.5 pts of rounding.';
function kpis(k, label){
  return [
    { name: label + ' revenue', definition: 'Revenue from the platform in US$ — TSMC\'s % of revenue × its US$ revenue for the quarter. Use the YoY / QoQ pills for growth (TSMC prints the QoQ rate on the same slide).',
      filing: 'Quarterly earnings presentation (Form 6-K)', unit: 'usdM', periodicity: 'Quarterly and annual',
      source: 'Earnings presentation "Revenue by Platform" × earnings-release US$ revenue; annual from the 20-F NT$ split.', series: 'results:' + k },
    { name: 'Share of TSMC revenue', definition: 'The platform\'s revenue ÷ total revenue.',
      filing: 'Quarterly earnings presentation (Form 6-K)', unit: 'pct', periodicity: 'Quarterly and annual',
      source: 'Printed by TSMC as a whole-number % each quarter; annual from the 20-F (Item 5).', series: k + 'Share' },
  ];
}
function share(k, label){ return { num: 'results:' + k, den: 'results:rev', unit: 'pct', label: label + ' share of revenue', short: label + ' share' }; }

export var tsmSegments = {
  company: 'TSMC',
  updated: 'Oct 2026',
  source: 'Platform revenue: TSMC quarterly earnings presentations (Form 6-K, SEC EDGAR — "Revenue by Platform", % of revenue) × the quarter\'s US$ revenue from the earnings release, 1Q22–3Q26; annual splits from the exact NT$ figures in the FY2024 and FY2025 Form 20-F (Item 5) × the year\'s US$ revenue. Platform definitions quoted from the FY2025 Form 20-F, Item 4. TSMC has one operating segment (foundry) and discloses no profit by platform. All series are read through from js/results-data/tsm.js. Other cuts: node mix from the quarterly earnings presentations and the 20-F node table, wafer revenue from the quarterly financial statements (6-K), customer region from the 20-F (Item 5). Summit series: DCF model snapshot of Oct 19 2026, frozen (not live), read through Results — forecast for 4Q26–2Q27 and FY2026–FY2028; in reported periods it is the model’s own history in that snapshot, not a pre-print estimate, and it does not tie to the reported figures.',

  axis: {
    q: ['1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24',
        '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26', '4Q26', '1Q27', '2Q27'],
    y: ['2022', '2023', '2024', '2025', '2026', '2027', '2028'],
  },

  // Series for the Other cuts, held here because they are not Results metrics. Built from primary
  // documents (see each `src`); every cut reconciles to the Results revenue in every period.
  shared: {
    n2: { label: '2nm', short: '2nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 0, '2Q22': 0, '3Q22': 0, '4Q22': 0, '1Q23': 0, '2Q23': 0, '3Q23': 0, '4Q23': 0, '1Q24': 0, '2Q24': 0, '3Q24': 0, '4Q24': 0, '1Q25': 0, '2Q25': 0, '3Q25': 0, '4Q25': 0, '1Q26': 0, '2Q26': 1019 }, summit: {} },
      y: { act: { '2022': 0, '2023': 0, '2024': 0, '2025': 0 }, summit: {} },
    },
    n3: { label: '3nm', short: '3nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 0, '2Q22': 0, '3Q22': 0, '4Q22': 0, '1Q23': 0, '2Q23': 0, '3Q23': 897, '4Q23': 2541, '1Q24': 1496, '2Q24': 2765, '3Q24': 3991, '4Q24': 6045, '1Q25': 4779, '2Q25': 6148, '3Q25': 6621, '4Q25': 8145, '1Q26': 7661, '2Q26': 10193 }, summit: {} },
      y: { act: { '2022': 0, '2023': 3621, '2024': 14085, '2025': 25245 }, summit: {} },
    },
    n5: { label: '5nm', short: '5nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 3139, '2Q22': 3397, '3Q22': 4991, '4Q22': 5477, '1Q23': 4569, '2Q23': 4119, '3Q23': 5532, '4Q23': 5929, '1Q24': 6148, '2Q24': 6451, '3Q24': 6386, '4Q24': 7905, '1Q25': 7819, '2Q25': 9221, '3Q25': 10652, '4Q25': 10181, '1Q26': 11032, '2Q26': 11212 }, summit: {} },
      y: { act: { '2022': 17360, '2023': 19915, '2024': 26605, '2025': 37867 }, summit: {} },
    },
    n7: { label: '7nm', short: '7nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 4708, '2Q22': 4853, '3Q22': 4634, '4Q22': 3766, '1Q23': 2948, '2Q23': 3158, '3Q23': 2392, '4Q23': 2880, '1Q24': 3157, '2Q24': 3133, '3Q24': 3393, '4Q24': 3255, '1Q25': 3258, '2Q25': 3586, '3Q25': 4030, '4Q25': 4072, '1Q26': 3984, '2Q26': 3737 }, summit: {} },
      y: { act: { '2022': 18028, '2023': 11466, '2024': 13302, '2025': 14726 }, summit: {} },
    },
    n16: { label: '16/20nm', short: '16/20nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 2197, '2Q22': 2265, '3Q22': 2139, '4Q22': 2054, '1Q23': 2064, '2Q23': 1648, '3Q23': 1495, '4Q23': 1355, '1Q24': 1496, '2Q24': 1659, '3Q24': 1596, '4Q24': 1628, '1Q25': 1520, '2Q25': 1793, '3Q25': 2015, '4Q25': 1745, '1Q26': 2145, '2Q26': 2039 }, summit: {} },
      y: { act: { '2022': 8680, '2023': 6638, '2024': 6260, '2025': 7363 }, summit: {} },
    },
    n28: { label: '28nm', short: '28nm', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 1726, '2Q22': 1618, '3Q22': 1782, '4Q22': 1883, '1Q23': 1769, '2Q23': 1510, '3Q23': 1495, '4Q23': 1186, '1Q24': 1329, '2Q24': 1475, '3Q24': 1397, '4Q24': 1395, '1Q25': 1520, '2Q25': 1793, '3Q25': 2015, '4Q25': 1745, '1Q26': 2145, '2Q26': 2039 }, summit: {} },
      y: { act: { '2022': 6677, '2023': 6035, '2024': 5477, '2025': 7363 }, summit: {} },
    },
    nold: { label: '40nm & older', short: '40nm & older', unit: 'usdM', src: 'Earnings presentations (% of wafer revenue) × wafer revenue from the quarterly financial statements; annual from the 20-F', scope: 'company',
      q: { act: { '1Q22': 3923, '2Q22': 4044, '3Q22': 4278, '4Q22': 3937, '1Q23': 3390, '2Q23': 3295, '3Q23': 3140, '4Q23': 3049, '1Q24': 2991, '2Q24': 2949, '3Q24': 3193, '4Q24': 3023, '1Q25': 2824, '2Q25': 3074, '3Q25': 3455, '4Q25': 3200, '1Q26': 3677, '2Q26': 3737 }, summit: {} },
      y: { act: { '2022': 16025, '2023': 12673, '2024': 12520, '2025': 12622 }, summit: {} },
    },
    wafer: { label: 'Wafer', short: 'Wafer', unit: 'usdM', src: 'Quarterly / annual consolidated financial statements (6-K, 20-F), "Disaggregation of revenue — Product"', scope: 'company',
      q: { act: { '1Q22': 15694, '2Q22': 16176, '3Q22': 17824, '4Q22': 17117, '1Q23': 14739, '2Q23': 13730, '3Q23': 14951, '4Q23': 16939, '1Q24': 16617, '2Q24': 18431, '3Q24': 19956, '4Q24': 23251, '1Q25': 21721, '2Q25': 25615, '3Q25': 28788, '4Q25': 29088, '1Q26': 30646, '2Q26': 33976 }, summit: {} },
      y: { act: { '2022': 66771, '2023': 60349, '2024': 78249, '2025': 105186 }, summit: {} },
    },
    nonwafer: { label: 'Others (non-wafer)', short: 'Non-wafer', unit: 'usdM', src: 'Same; Others = net revenue − wafer', scope: 'company',
      q: { act: { '1Q22': 1876, '2Q22': 1984, '3Q22': 2406, '4Q22': 2813, '1Q23': 1981, '2Q23': 1950, '3Q23': 2329, '4Q23': 2681, '1Q24': 2253, '2Q24': 2389, '3Q24': 3544, '4Q24': 3629, '1Q25': 3809, '2Q25': 4455, '3Q25': 4312, '4Q25': 4642, '1Q26': 5254, '2Q26': 6224 }, summit: {} },
      y: { act: { '2022': 9119, '2023': 8951, '2024': 11821, '2025': 17244 }, summit: {} },
    },
    g_na: { label: 'North America', short: 'North America', unit: 'usdM', src: '20-F Item 5, net revenue by customer headquarters', scope: 'company',
      y: { act: { '2022': 51444, '2023': 47132, '2024': 63214, '2025': 92416 }, summit: {} },
    },
    g_apac: { label: 'Asia Pacific', short: 'Asia Pacific', unit: 'usdM', src: '20-F Item 5, net revenue by customer headquarters', scope: 'company',
      y: { act: { '2022': 8086, '2023': 5608, '2024': 8848, '2025': 10583 }, summit: {} },
    },
    g_cn: { label: 'China', short: 'China', unit: 'usdM', src: '20-F Item 5, net revenue by customer headquarters', scope: 'company',
      y: { act: { '2022': 8219, '2023': 8564, '2024': 10322, '2025': 10527 }, summit: {} },
    },
    g_jp: { label: 'Japan', short: 'Japan', unit: 'usdM', src: '20-F Item 5, net revenue by customer headquarters', scope: 'company',
      y: { act: { '2022': 3992, '2023': 4234, '2024': 4489, '2025': 4835 }, summit: {} },
    },
    g_emea: { label: 'EMEA', short: 'EMEA', unit: 'usdM', src: '20-F Item 5, net revenue by customer headquarters', scope: 'company',
      y: { act: { '2022': 4149, '2023': 3762, '2024': 3198, '2025': 4069 }, summit: {} },
    },
  },
  derived: {
    hpcShare:   share('hpc', 'HPC'),
    smartShare: share('smart', 'Smartphone'),
    iotShare:   share('iot', 'IoT'),
    autoShare:  share('auto', 'Automotive'),
    dceShare:   share('dce', 'DCE'),
    othShare:   share('oth', 'Others'),
  },

  overview: {
    tenK: {
      text: 'As a result, the Company has only one operating segment, the foundry segment.',
      where: 'FY2025 Form 20-F, Note 38 (Operating segments information)',
    },
  },

  // ── The six platforms (TSMC's own revenue disaggregation, in the order its presentations use) ──
  segments: [
    {
      key: 'hpc', label: 'High Performance Computing', short: 'HPC',
      tenK: { text: 'Driven by data explosion and AI application innovation, HPC has become the key growth driver for our business. We provide customers, including both fabless IC design companies and system companies, with leading-edge logic process technologies such as 2-nanometer Nanosheet Transistor ("N2"), 3-nanometer Fin Field-Effect Transistor ("FinFET"), 4-nanometer FinFET, 5-nanometer FinFET, 6-nanometer FinFET, and 7-nanometer FinFET …',
              where: 'FY2025 Form 20-F, Item 4 — High Performance Computing', verbatim: true },
      summary: 'The AI platform: from 43% of TSMC\'s revenue in 2023 to 68% in 3Q26, and the one that decides the company\'s growth.',
      brief: 'Chips for data centers, AI and personal computers. Customers design them; TSMC builds them on its most advanced processes and, more and more, packages several chips together with its 3DFabric technologies. TSMC names HPC the key growth driver of the business.',
      sells: [
        { name: 'AI accelerators', what: 'GPUs and custom AI chips (ASICs) for training and running AI models.' },
        { name: 'Processors', what: 'Server and PC CPUs, and consumer GPUs.' },
        { name: 'Networking and FPGAs', what: 'High-speed networking chips and programmable logic for data centers and 5G/6G infrastructure.' },
        { name: 'Advanced packaging', what: 'CoWoS and SoIC, which put processors and memory side by side or on top of each other.' },
      ],
      products: [
        { name: 'AI accelerators and processors', what: 'AI GPUs and ASICs, server and PC CPUs, consumer GPUs, FPGAs and high-speed networking chips, on N2 down to 7nm.',
          customers: { archetype: { text: 'We provide customers, including both fabless IC design companies and system companies, with leading-edge logic process technologies …', where: 'FY2025 Form 20-F, Item 4 — High Performance Computing' },
                       named: [], concentration: NO_NAMES } },
        { name: '3DFabric packaging (CoWoS, SoIC)', what: 'Advanced packaging that integrates several chips — e.g. a processor and high-bandwidth memory — for high performance and compute density.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
      ],
      kpis: kpis('hpc', 'HPC'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:hpc' } },
    },
    {
      key: 'smart', label: 'Smartphone', short: 'Smartphone',
      tenK: { text: 'For customers\' premium product applications, we offer leading logic process technologies such as 2-nanometer Nanosheet Plus ("N2P"), 3-nanometer FinFET Plus ("N3P"), 3-nanometer FinFET Enhanced ("N3E"), 3-nanometer FinFET, 4-nanometer FinFET Plus ("N4P"), 4-nanometer FinFET, 5-nanometer FinFET Plus ("N5P"), and 5-nanometer FinFET, as well as comprehensive intellectual properties to further enhance chip performance, reduce power consumption, and decrease chip size.',
              where: 'FY2025 Form 20-F, Item 4 — Smartphones', verbatim: true },
      summary: 'The second platform: still growing in FY2025 (+14% in US$) but shrinking as a share — 38% of revenue in 2023, 21% in 3Q26, when it was 1% below a year earlier.',
      brief: 'The processors at the heart of phones and the smaller chips around them. Premium phones use TSMC\'s newest nodes; mainstream phones use older, cheaper ones.',
      sells: [
        { name: 'Application processors', what: 'The main phone chip, on leading-edge nodes for premium models and mature ones for mainstream models.' },
        { name: 'Companion chips', what: 'Radio frequency, power management, sensors and display drivers.' },
        { name: 'InFO packaging', what: 'Thin wafer-level packaging used for phone processors.' },
      ],
      products: [
        { name: 'Application processors', what: 'Premium models on N2P down to 5nm; mainstream models on N3C/N4C down to 28nm.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
        { name: 'Companion chips and InFO', what: 'RF and RF front-end, embedded memory, power management, sensors and display chips, plus InFO packaging.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
      ],
      kpis: kpis('smart', 'Smartphone'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:smart' } },
    },
    {
      key: 'iot', label: 'Internet of Things', short: 'IoT',
      tenK: { text: 'Following the three megatrends of the IoT segment, "Everything Connected, Smart and Green," we not only provide customers with solid logic technologies … but also build a leading, complete and highly integrated ultra-low power ("ULP") technology platform based on our logic technologies to enable customers\' product innovations for the Artificial Intelligence of Things ("AIoT", AI+IoT) and Edge AI.',
              where: 'FY2025 Form 20-F, Item 4 — Internet of Things', verbatim: true },
      summary: 'A small, steady platform (4–7% of revenue in each quarter since 2024) built mostly on mature, low-power processes.',
      brief: 'Chips for connected devices — wearables, smart-home products and edge AI. Most are built on an ultra-low-power platform that trades peak speed for battery life.',
      sells: [
        { name: 'Ultra-low-power logic', what: 'Processes from 55nm down to 6nm tuned for battery-powered devices.' },
        { name: 'Specialty chips', what: 'Radio, sensors, embedded memory and power management for the same devices.' },
      ],
      products: [
        { name: 'Ultra-low-power logic (ULP / ULL)', what: 'N6e and N12e in volume production, 22nm ULL and 28/40/55nm ULP; a 4nm ULP node in development.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
      ],
      kpis: kpis('iot', 'IoT'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:iot' } },
    },
    {
      key: 'auto', label: 'Automotive', short: 'Automotive',
      tenK: { text: 'We offer a comprehensive spectrum of technologies and services to support the automotive industry\'s three megatrends – building vehicles that are "Safer, Smarter and Greener."',
              where: 'FY2025 Form 20-F, Item 4 — Automotive', verbatim: true },
      summary: '4–6% of revenue in each quarter since 2024. Its most advanced node, N3A (3nm, automotive grade), was released to customers at the end of 2025.',
      brief: 'Automotive-grade versions of TSMC\'s processes for driver assistance, infotainment and the controllers of new vehicle architectures, in combustion and electric vehicles alike.',
      sells: [
        { name: 'Driver assistance and infotainment', what: 'Logic from 16nm down to 3nm (N3A, released to customers at the end of 2025).' },
        { name: 'Specialty automotive chips', what: 'Embedded flash memory, millimeter-wave radar RF, image and LiDAR sensors, power management.' },
      ],
      products: [
        { name: 'Automotive logic', what: '3/4/5/7/16nm FinFET with an automotive IP ecosystem; N3A is the most advanced automotive-grade node (released end-2025).',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
        { name: 'Automotive specialty', what: '28nm embedded flash, 28/22/16nm mmWave RF, HDR image sensors, LiDAR sensors and PMICs.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
      ],
      kpis: kpis('auto', 'Automotive'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:auto' } },
    },
    {
      key: 'dce', label: 'Digital Consumer Electronics', short: 'DCE',
      tenK: { text: 'We provide customers with leading comprehensive technologies to deliver superior performance for 8K/4K video streaming, AI features, better power efficiency, and seamless connectivity for DCE applications, including smart digital TVs ("DTVs"), set-top boxes ("STBs"), AI-embedded smart cameras and associated wireless local area networks ("WLANs"), and PMICs, etc.',
              where: 'FY2025 Form 20-F, Item 4 — Digital Consumer Electronics', verbatim: true },
      summary: 'The smallest named platform, about 1% of revenue; roughly flat in FY2025 (+3% in US$, 0% in NT$).',
      brief: 'Chips for consumer devices outside the phone: smart TVs, set-top boxes and streaming devices, cameras and their wireless connectivity.',
      sells: [
        { name: 'TV and streaming chips', what: 'Processors for 8K/4K smart TVs, set-top boxes and streaming devices.' },
        { name: 'Camera and connectivity chips', what: 'AI-enabled smart cameras, DSLR cameras and Wi-Fi.' },
      ],
      products: [
        { name: 'TV, streaming and camera chips', what: '5nm, 7/6nm, 16/12nm and 22nm ULP/ULL processes for DTVs, set-top boxes, streaming devices and cameras.',
          customers: { archetype: WHO, named: [], concentration: NO_NAMES } },
      ],
      kpis: kpis('dce', 'DCE'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:dce' } },
    },
    {
      key: 'oth', label: 'Others', short: 'Others',
      summary: 'Revenue TSMC does not assign to the five platforms; about 2% of the total.',
      brief: 'Revenue TSMC does not assign to the five platforms. The filing does not break it down further.',
      sells: [],
      products: [],
      kpis: kpis('oth', 'Others'), kpiNote: KPI_NOTE,
      interactions: [], bridges: [], highlights: [],
      drivers: { rev: { from: 'results:oth' } },
    },
  ],

  // ── Alternative cuts of the SAME total (SAB, Oct 15 2026: node · customer region · wafer vs the rest) ──
  other: [
    {
      key: 'node', label: 'Technology node', sub: 'wafer revenue by process, plus non-wafer',
      lede: 'The same revenue cut by how advanced the manufacturing process is. TSMC states each node as a share of WAFER revenue, so each slice here is that share × wafer revenue, with the non-wafer remainder (packaging, masks and other) as its own slice.',
      note: 'Quarterly: each quarter\'s "Revenue by Technology" slide × wafer revenue from that quarter\'s financial statements (Q4 = full year − nine months), in US$ at the quarter\'s rate. 3Q26 is not shown yet: its financial statements, with the wafer split, are filed in mid-November (the 3Q26 slide already gives 2nm 8%, 3nm 33%, 5nm 28%, 7nm 10%). Annual: the 20-F node table.',
      caveat: 'Grouped for a continuous series: 16/20nm adds the separate 20nm slice TSMC showed in 1Q–3Q23; "40nm & older" adds 40/45nm, 65nm, 90nm, 0.11/0.13µm, 0.15/0.18µm and 0.25µm+ (TSMC merged the oldest into two slices from 2Q26). Shares are whole-number %, so each slice carries up to ±0.5 pts of rounding.',
      tenK: { text: 'The figure represents wafer revenue from a certain technology as a percentage of the total wafer revenue.', where: 'FY2025 Form 20-F, Item 5 — net revenue by technology (note 1)' },
      cite: { form: '20-F', period: '2025', accession: '0001628280-26-025362', url: 'https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm' },
      spans: 'Quarterly from 18 earnings presentations and quarterly financial statements; annual from the FY2024 and FY2025 Form 20-F.',
      axis: { q: ['1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'], y: ['2022', '2023', '2024', '2025'] },
      views: ['q', 'y'],
      series: [
        { key: 'n2', ref: 'shared:n2', label: '2nm' },
        { key: 'n3', ref: 'shared:n3', label: '3nm' },
        { key: 'n5', ref: 'shared:n5', label: '5nm' },
        { key: 'n7', ref: 'shared:n7', label: '7nm' },
        { key: 'n16', ref: 'shared:n16', label: '16/20nm' },
        { key: 'n28', ref: 'shared:n28', label: '28nm' },
        { key: 'nold', ref: 'shared:nold', label: '40nm & older' },
        { key: 'nonwafer', ref: 'shared:nonwafer', label: 'Non-wafer' },
      ],
    },
    {
      key: 'region', label: 'Customer region', sub: 'by where customers are headquartered',
      lede: 'The same revenue cut by where TSMC\'s customers are headquartered — not where chips are shipped. North America is three-quarters of the total because that is where the large chip designers are based.',
      note: 'Annual only: TSMC publishes this split in the 20-F. Each region = its exact NT$ share × the year\'s US$ revenue.',
      caveat: 'Headquarters, not destination: a US-headquartered customer\'s chips can be shipped and sold anywhere. The quarterly financial statements carry a different geography (by billing location), which is not mixed in here.',
      tenK: { text: 'We categorize our net revenue mainly based on the countries where our customers are headquartered, which may be different from the countries to which we actually sell or ship our products or different from where products are actually ordered.', where: 'FY2025 Form 20-F, Item 5 — Markets and Customers' },
      cite: { form: '20-F', period: '2025', accession: '0001628280-26-025362', url: 'https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm' },
      spans: 'Assembled from the FY2024 and FY2025 Form 20-F (each carries three years).',
      axis: { y: ['2022', '2023', '2024', '2025'] },
      views: ['y'],
      series: [
        { key: 'g_na', ref: 'shared:g_na', label: 'North America' },
        { key: 'g_apac', ref: 'shared:g_apac', label: 'Asia Pacific',
          tenK: { text: 'China and Japan are excluded from Asia Pacific.', where: 'FY2025 Form 20-F, Item 5 (note 1)' } },
        { key: 'g_cn', ref: 'shared:g_cn', label: 'China' },
        { key: 'g_jp', ref: 'shared:g_jp', label: 'Japan' },
        { key: 'g_emea', ref: 'shared:g_emea', label: 'EMEA',
          tenK: { text: 'EMEA stands for Europe, Middle East, and Africa.', where: 'FY2025 Form 20-F, Item 5 (note 2)' } },
      ],
    },
    {
      key: 'product', label: 'Wafer vs the rest', sub: 'wafer sales and everything around them',
      lede: 'The split TSMC\'s financial statements give every quarter: wafer sales, and "others" — the revenue around the wafer. Non-wafer has grown faster than wafers since 2024.',
      note: 'Quarterly financial statements (Form 6-K) and the annual report, "Disaggregation of revenue from contracts with customers — Product"; Q4 = full year − nine months; in US$ at each period\'s rate. 3Q26 appears when its financial statements are filed in mid-November.',
      caveat: 'The filings do not itemise "Others". TSMC\'s description of its services (design, mask making, 3DFabric advanced packaging and testing) suggests what it holds, but no split is published.',
      cite: { form: '20-F', period: '2025', accession: '0001628280-26-025362', url: 'https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm' },
      spans: 'Quarterly from 14 interim financial statements and 4 annual reports.',
      axis: { q: ['1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'], y: ['2022', '2023', '2024', '2025'] },
      views: ['q', 'y'],
      series: [
        { key: 'wafer', ref: 'shared:wafer', label: 'Wafer' },
        { key: 'nonwafer', ref: 'shared:nonwafer', label: 'Others (non-wafer)' },
      ],
    },
  ],
  // ── Customers ────────────────────────────────────────────────────────────────────────────
  customers: {
    classes: [
      { key: 'fabless', label: 'Fabless semiconductor companies', where: 'FY2025 Form 20-F, Item 4',
        text: 'We count among our customers many of the world\'s leading semiconductor companies, ranging from fabless semiconductor companies, system companies to integrated device manufacturers.' },
      { key: 'system', label: 'System companies', where: 'FY2025 Form 20-F, Item 4 — High Performance Computing',
        text: 'We provide customers, including both fabless IC design companies and system companies, with leading-edge logic process technologies …' },
      { key: 'idm', label: 'Integrated device manufacturers', where: 'FY2025 Form 20-F, Item 4',
        text: 'We count among our customers many of the world\'s leading semiconductor companies, ranging from fabless semiconductor companies, system companies to integrated device manufacturers.' },
    ],
    concentration: { disclosed: true,
      note: 'While we generate revenue from hundreds of customers worldwide, our ten largest customers in 2023, 2024 and 2025 accounted for approximately, 70%, 76% and 78% of our net revenue in the respective year. Our largest customer in 2023, 2024 and 2025 accounted for 25%, 22% and 19% of our net revenue in the respective year. Our second largest customer in 2023, 2024 and 2025 accounted for 11%, 12%, and 17% of our net revenue in the respective year.' },
    splc: {
      revBaseM: 33730, revBaseLabel: '4Q25 net revenue (US$, as TSMC reports it)',
      coverageWhy: 'TSMC names no customer, so every name here comes from the other side — a company that disclosed its spend with TSMC, or a Bloomberg estimate of it. The amounts are one quarter (mostly 4Q25), so they are read against 4Q25 revenue. Bloomberg puts NVIDIA at 19% and Apple at 17% of TSMC\'s revenue — the same shares the 20-F gives its unnamed largest and second-largest customers for FY2025, which is consistent but not a TSMC confirmation.',
      named: 20, sized: 20, sizedSumM: 23720.2,
      source: 'Bloomberg Supply Chain Analysis (SPLC) — counterparty disclosures and Bloomberg estimates, not TSMC filings',
      file: 'nvidia-map-reference/splc-parsed.json (subject 2330 TT Equity, customer side)',
      customers: [
        { name: 'NVIDIA', ticker: 'NVDA', amtM: 6416.3, period: 'Q4 2025', theirPct: 37.35, basis: 'COGS', what: 'AI GPUs and networking — the largest buyer' },
        { name: 'Apple', ticker: 'AAPL', amtM: 5732.3, period: 'Q4 2025', theirPct: 7.70, basis: 'COGS', what: 'iPhone / Mac processors' },
        { name: 'Advanced Micro Devices', ticker: 'AMD', amtM: 1751.4, period: 'Q4 2025', theirPct: 37.35, basis: 'COGS', what: 'CPUs and AI GPUs' },
        { name: 'QUALCOMM', ticker: 'QCOM', amtM: 1722.4, period: 'Q4 2025', theirPct: 30.96, basis: 'COGS', what: 'Phone processors and modems' },
        { name: 'Broadcom', ticker: 'AVGO', amtM: 1427.3, period: 'Q4 2025', theirPct: 22.95, basis: 'COGS', what: 'Custom AI chips and networking' },
        { name: 'Amazon.com', ticker: 'AMZN', amtM: 1377.9, period: 'Q4 2025', theirPct: 1.25, basis: 'COGS', what: 'In-house chips (Graviton, Trainium)' },
        { name: 'MediaTek', ticker: '2454 TT', amtM: 1290.5, period: 'Q4 2025', theirPct: 49.50, basis: 'COGS', what: 'Phone and TV processors (Taiwan)' },
        { name: 'Intel', ticker: 'INTC', amtM: 856.9, period: 'Q4 2025', theirPct: 9.82, basis: 'COGS', what: 'Outsourced tiles and chips' },
        { name: 'Marvell Technology', ticker: 'MRVL', amtM: 404.1, period: 'Q4 2025', theirPct: 37.35, basis: 'COGS', what: 'Custom AI chips and networking' },
        { name: 'Cisco Systems', ticker: 'CSCO', amtM: 392.4, period: 'Q4 2025', theirPct: 7.24, basis: 'COGS', what: 'Networking silicon' },
        { name: 'Sony', ticker: '6758 JP', amtM: 381.0, period: 'Q4 2025', theirPct: 2.21, basis: 'COGS', what: 'Image sensors and consumer chips' },
        { name: 'Global Unichip', ticker: '3443 TT', amtM: 377.1, period: 'C1 2026', theirPct: null, basis: 'estimate', what: 'TSMC-affiliated design-service house' },
        { name: 'Infineon Technologies', ticker: 'IFX GR', amtM: 345.4, period: 'Q4 2025', theirPct: 13.48, basis: 'COGS', what: 'Automotive and power chips' },
        { name: 'STMicroelectronics', ticker: 'STMPA FP', amtM: 290.6, period: 'Q4 2025', theirPct: 13.47, basis: 'COGS', what: 'Automotive and industrial chips' },
        { name: 'Analog Devices', ticker: 'ADI', amtM: 210.6, period: 'Q4 2025', theirPct: 18.69, basis: 'COGS', what: 'Analog and mixed-signal' },
        { name: 'NXP Semiconductors', ticker: 'NXPI', amtM: 206.1, period: 'Q4 2025', theirPct: 13.48, basis: 'COGS', what: 'Automotive chips' },
        { name: 'Texas Instruments', ticker: 'TXN', amtM: 171.9, period: 'Q4 2025', theirPct: 8.81, basis: 'COGS', what: 'Analog and embedded' },
        { name: 'OmniVision Integrated Circuits', ticker: '603501 CH', amtM: 161.0, period: 'Q4 2025', theirPct: 21.91, basis: 'COGS', what: 'Image sensors (China)' },
        { name: 'ams-OSRAM', ticker: 'AMS SW', amtM: 103.2, period: 'Q4 2025', theirPct: 13.48, basis: 'COGS', what: 'Sensors and optical' },
        { name: 'Cirrus Logic', ticker: 'CRUS', amtM: 101.7, period: 'Q4 2025', theirPct: 37.35, basis: 'COGS', what: 'Audio chips for phones' },
      ],
    },
  },
};
