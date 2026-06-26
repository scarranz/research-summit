// overviews/semi-map-data.js — Semiconductor supply-chain taxonomy.
//
// This is the data behind the interactive "Industry Analysis" map. It is a plain,
// editable structure so non-developers can tweak it. The taxonomy follows Chip Stock
// Investor's "Semiconductor Industry Flow" — the industry is NOT vertically integrated,
// so each link in the chain is a distinct bucket of companies.
//
// Shape:
//   BUCKETS = [ { id, name, tag, flow, accent, desc, groups:[ { id, name, desc,
//                  companies:[ { ticker, name, note, rel?, tags? } ] } ] } ]
//
//   tag   — one-line label shown on the bucket card (keep it short / clean)
//   flow  — position in the left→right value chain (1 = upstream, 8 = demand)
//   accent— card color
//   desc  — longer description shown in the bottom detail panel
//   rel   — relationships (who they supply / buy from / compete with), shown in panel
//   tags  — small badges (e.g. 'Monopoly', 'CSI holding')
//
// Edit freely: add/remove companies, reword notes, reorder. The map re-reads this on load.

export var BUCKETS = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'materials', name: 'Materials & Gases', tag: 'Raw silicon, gases & chemicals', flow: 1,
    accent: '#6B7A8F',
    desc: 'The most upstream link: the physical inputs every fab consumes — polished silicon wafers, ultra-pure specialty gases and process chemicals. Commoditized and capital-intensive; a handful of players dominate wafer supply.',
    groups: [
      { id: 'wafers', name: 'Silicon Wafers', desc: 'Grow silicon ingots (Czochralski) and slice/polish them into the bare wafers fabs build on. Highly consolidated.',
        companies: [
          { ticker:'TYO:4063', name:'Shin-Etsu Chemical', note:'World\'s largest silicon-wafer maker.' },
          { ticker:'TYO:3436', name:'SUMCO', note:'#2 silicon-wafer producer (Japan).' },
          { ticker:'ETR:WAF', name:'Siltronic', note:'Major European wafer maker.' },
          { ticker:'TPE:6488', name:'GlobalWafers', note:'Taiwan-based top-tier wafer supplier.' },
          { ticker:'TPE:1301', name:'Formosa / FST', note:'Formosa Plastics wafer subsidiary.' },
        ] },
      { id: 'gases', name: 'Gases & Chemicals', desc: 'Specialty gases, photoresists and process chemicals consumed at every fab step. (Lighter CSI coverage — general industry names.)',
        companies: [
          { ticker:'LIN', name:'Linde', note:'Largest industrial-gas supplier.' },
          { ticker:'PA:AI', name:'Air Liquide', note:'Major electronics-gas supplier.' },
          { ticker:'TYO:4901', name:'Fujifilm', note:'Photoresists & process materials.' },
          { ticker:'TYO:4188', name:'Mitsubishi Chemical', note:'Specialty process chemicals.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'equipment', name: 'Manufacturing Equipment', tag: 'The machines that build chips · "picks & shovels"', flow: 2,
    accent: '#2D6A9F',
    desc: 'Wafer-fab equipment (WFE) makers build the machinery that fills every fab — the critical chokepoint of the industry. The "Fab 5" (ASML, Applied Materials, Lam, Tokyo Electron, KLA) are ~70% of global WFE spend. Deep patented IP creates durable, oligopoly/monopoly positions per process step.',
    groups: [
      { id: 'litho', name: 'Lithography', desc: 'Print circuit patterns onto the wafer with light. The single most concentrated step.',
        companies: [
          { ticker:'ASML', name:'ASML', note:'Lithography leader — sole maker of EUV systems.', tags:['Monopoly (EUV)','CSI'], rel:['Sells to TSMC, Samsung, Intel','Partners w/ NVIDIA on cuLitho computational litho'] },
          { ticker:'TYO:7751', name:'Canon', note:'DUV systems; developing NanoImprint (NIL) as an EUV alternative.' },
          { ticker:'TYO:7731', name:'Nikon', note:'Legacy lithography light-source systems.' },
        ] },
      { id: 'depo', name: 'Deposition & Epitaxy', desc: 'Lay down ultra-thin material films (CVD, PVD, ALD, ECD) layer by layer.',
        companies: [
          { ticker:'AMAT', name:'Applied Materials', note:'Broadest portfolio; dominant in PVD, epitaxy, ion implant.', tags:['Fab 5','CSI'] },
          { ticker:'LRCX', name:'Lam Research', note:'Deposition + etch leader, memory-focused; key to advanced packaging.', tags:['Fab 5','CSI'] },
          { ticker:'TYO:8035', name:'Tokyo Electron', note:'Generalist; deposition, etch, clean, resist-coat.', tags:['Fab 5'] },
          { ticker:'AMS:ASM', name:'ASM International', note:'ALD (atomic layer deposition) leader.' },
          { ticker:'ETR:AIXA', name:'Aixtron', note:'Compound-semi deposition (SiC, GaN, photonics).' },
          { ticker:'VECO', name:'Veeco', note:'Deposition, annealing & niche litho.' },
        ] },
      { id: 'etch', name: 'Etch', desc: 'Selectively remove material to carve the patterned structures.',
        companies: [
          { ticker:'LRCX', name:'Lam Research', note:'Etch market leader.', tags:['Fab 5','CSI'] },
          { ticker:'TYO:8035', name:'Tokyo Electron', note:'#2 in etch.', tags:['Fab 5'] },
          { ticker:'AMAT', name:'Applied Materials', note:'#3 in etch; invented Pattern Shaping.', tags:['Fab 5','CSI'] },
          { ticker:'ACMR', name:'ACM Research', note:'Fast-growing, China-focused; cleaning into etch/plating.' },
        ] },
      { id: 'metro', name: 'Metrology & Process Control', desc: 'Measure and inspect at every step to guarantee yield (PDC = process diagnostic & control).',
        companies: [
          { ticker:'KLAC', name:'KLA Corp', note:'Dominant metrology/inspection specialist.', tags:['Fab 5','CSI'] },
          { ticker:'AMAT', name:'Applied Materials', note:'#2 in metrology.', tags:['Fab 5','CSI'] },
          { ticker:'ONTO', name:'Onto Innovation', note:'Fast-growing optical metrology + advanced-packaging inspection.', tags:['CSI'] },
          { ticker:'NVMI', name:'Nova', note:'Optical + chemical metrology (Israel).', tags:['CSI'] },
          { ticker:'CAMT', name:'Camtek', note:'Advanced-packaging inspection (Israel).', tags:['CSI'] },
          { ticker:'TYO:6920', name:'Lasertec', note:'EUV photomask & wafer inspection.' },
        ] },
      { id: 'clean', name: 'Clean · CMP · Anneal', desc: 'Clean, polish (chemical-mechanical planarization) and bake the wafer between steps.',
        companies: [
          { ticker:'TYO:7735', name:'SCREEN Holdings', note:'Cleaning/scrubbing leader.' },
          { ticker:'ACMR', name:'ACM Research', note:'Wafer-cleaning leader, fastest-growing.' },
          { ticker:'LRCX', name:'Lam Research', note:'CMP & clean.', tags:['Fab 5','CSI'] },
        ] },
      { id: 'implant', name: 'Ion Implantation', desc: 'Dope the silicon by accelerating ions into the lattice.',
        companies: [
          { ticker:'AMAT', name:'Applied Materials', note:'Ion-implant leader.', tags:['Fab 5','CSI'] },
          { ticker:'ACLS', name:'Axcelis', note:'Pure-play ion implant; SiC/EV-driven.' },
        ] },
      { id: 'test', name: 'Test · Probe · Burn-in', desc: 'Test finished chips (ATE), probe wafers and burn-in for reliability.',
        companies: [
          { ticker:'TER', name:'Teradyne', note:'ATE (automated test equipment) leader.' },
          { ticker:'TYO:6857', name:'Advantest', note:'ATE leader; SoC/memory test.' },
          { ticker:'FORM', name:'FormFactor', note:'Probe cards & systems leader.' },
          { ticker:'COHU', name:'Cohu', note:'Test handling & process control.' },
          { ticker:'AEHR', name:'Aehr Test Systems', note:'SiC/GaN test & burn-in.' },
        ] },
      { id: 'mask', name: 'Photomasks', desc: 'Make the masks that lithography projects onto the wafer.',
        companies: [
          { ticker:'PLAB', name:'Photronics', note:'Pure-play photomask producer.' },
          { ticker:'TYO:7911', name:'Toppan', note:'Photomasks incl. EUV masks.' },
          { ticker:'TYO:7912', name:'Dai Nippon Printing', note:'Photomasks + precision equipment.' },
        ] },
      { id: 'dicing', name: 'Wafer Slicing & Dicing', desc: 'Slice ingots into wafers and dice finished wafers into chips.',
        companies: [
          { ticker:'TYO:6146', name:'DISCO', note:'Dominant in precision slicing, grinding & dicing.' },
          { ticker:'TYO:7729', name:'Tokyo Seimitsu', note:'Polishers, grinders & dicing.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'eda', name: 'EDA & IP', tag: 'Design software & licensable IP', flow: 3,
    accent: '#5B53A8',
    desc: 'Electronic Design Automation (EDA) software — the "AutoCAD of chips" — plus the licensable IP cores designers buy instead of reinventing. An oligopoly of three EDA platforms permeates the whole flow, from design through verification to manufacturing.',
    groups: [
      { id: 'platforms', name: 'EDA Platforms', desc: 'Full design-to-manufacture software suites. A three-way oligopoly.',
        companies: [
          { ticker:'SNPS', name:'Synopsys', note:'#1 EDA platform + top IP-core licensor.', tags:['Oligopoly','CSI'], rel:['Acquiring ANSYS (the "biggest merger of 2025")','Partners w/ NVIDIA, ASML, TSMC on cuLitho'] },
          { ticker:'CDNS', name:'Cadence', note:'#2 EDA platform; growing IP business.', tags:['Oligopoly','CSI'] },
          { ticker:'ETR:SIE', name:'Siemens EDA', note:'#3 (ex-Mentor Graphics); part of Siemens Digital Industries.', tags:['Oligopoly'] },
        ] },
      { id: 'eda-adj', name: 'EDA-Adjacent / Simulation', desc: 'Physics simulation & point tools being rolled into the big platforms.',
        companies: [
          { ticker:'ANSS', name:'ANSYS', note:'Physics simulation — being acquired by Synopsys.' },
          { ticker:'KEYS', name:'Keysight', note:'Test + RF EDA; buying divested EDA assets.' },
          { ticker:'PDFS', name:'PDF Solutions', note:'Manufacturing yield analytics.' },
        ] },
      { id: 'compute-ip', name: 'Processor / Compute IP', desc: 'License the CPU/processor architectures chips are built on.',
        companies: [
          { ticker:'ARM', name:'Arm Holdings', note:'Near-monopoly in mobile processor IP.', tags:['Near-monopoly'] },
          { ticker:'CEVA', name:'Ceva', note:'DSP (digital signal processing) IP.' },
        ] },
      { id: 'iface-ip', name: 'Interconnect & Memory IP', desc: 'License the IP that moves data on- and off-chip.',
        companies: [
          { ticker:'RMBS', name:'Rambus', note:'Memory-interface + security IP.', tags:['CSI'] },
          { ticker:'(QCOM)', name:'Alphawave', note:'Interconnect IP — acquired by Qualcomm (2025).' },
          { ticker:'AIP', name:'Arteris', note:'Network-on-chip (NoC) interconnect IP.' },
        ] },
      { id: 'other-ip', name: 'Other IP & Patents', desc: 'Specialty materials, wireless and patent-portfolio licensors.',
        companies: [
          { ticker:'IDCC', name:'InterDigital', note:'Wireless & video-compression patents.' },
          { ticker:'ADEA', name:'Adeia', note:'Hybrid-bonding & media IP.' },
          { ticker:'IBM', name:'IBM', note:'One of the world\'s largest patent portfolios.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fabless', name: 'Fabless Designers', tag: 'Design chips, outsource the manufacturing', flow: 4,
    accent: '#1F8A70',
    desc: 'Companies that design chips but own no fabs — they hand the manufacturing to foundries. This is where NVIDIA lives. The model lets designers focus all capital on R&D and ride the foundries\' process leadership.',
    groups: [
      { id: 'ai-gpu', name: 'AI Accelerators / GPU', desc: 'Design the GPUs and accelerators powering the AI build-out.',
        companies: [
          { ticker:'NVDA', name:'NVIDIA', note:'#1 accelerated-computing / AI GPU designer.', tags:['Fabless','CSI'], rel:['Chips manufactured by TSMC','HBM3e supplied by SK hynix','Systems assembled by Foxconn','Networking via Mellanox (see Networking)','Designs with Synopsys/Cadence on ASML+TSMC nodes'] },
          { ticker:'AMD', name:'AMD', note:'#2 in accelerated computing; CPUs + GPUs.', tags:['Fabless','CSI'], rel:['Manufactured by TSMC','Acquired ZT Systems (2025)'] },
        ] },
      { id: 'asic', name: 'Networking / Custom ASIC', desc: 'Design custom silicon (ASICs) for hyperscalers and networking.',
        companies: [
          { ticker:'AVGO', name:'Broadcom', note:'Custom ASIC + networking leader.', tags:['CSI'], rel:['Provides IP for Google TPU','Manufactured by TSMC'] },
          { ticker:'MRVL', name:'Marvell', note:'"Baby Broadcom" — #2 ASIC/IP for hyperscalers.' },
          { ticker:'TPE:3661', name:'Alchip', note:'Custom-silicon (ASIC) designer; Amazon a key customer.', rel:['Partnership w/ Astera Labs'] },
        ] },
      { id: 'mobile', name: 'Mobile / Wireless', desc: 'Design the SoCs in phones and connected devices.',
        companies: [
          { ticker:'QCOM', name:'Qualcomm', note:'Mobile/wireless SoC leader; acquired Alphawave (2025).', tags:['CSI'] },
          { ticker:'TPE:2454', name:'MediaTek', note:'Mobile SoC designer with growing ASIC/IP.' },
        ] },
      { id: 'fpga', name: 'FPGA / Other', desc: 'Programmable logic and specialty designers.',
        companies: [
          { ticker:'LSCC', name:'Lattice Semiconductor', note:'Low-power FPGA designer.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'foundry', name: 'Foundries', tag: 'Manufacture chips for fabless designers', flow: 5,
    accent: '#C0772C',
    desc: 'Contract manufacturers that make chips for third-party designers. TSMC dominates the leading edge and is the manufacturing partner for NVIDIA, AMD and Broadcom — one of the three "pillars" of the AI trend (NVIDIA + Broadcom + TSMC).',
    groups: [
      { id: 'leading', name: 'Leading-Edge', desc: 'The few foundries that can produce the most advanced nodes.',
        companies: [
          { ticker:'TSM', name:'TSMC', note:'World\'s largest foundry; ~$121B 2025 revenue.', tags:['Leader','CSI'], rel:['Manufactures for NVIDIA, AMD, Broadcom, Apple','Owns CoWoS advanced packaging (HBM + GPU)'] },
          { ticker:'KRX:005930', name:'Samsung Foundry', note:'#2 foundry + leading IDM.', rel:['Also makes its own memory (see Memory)'] },
          { ticker:'INTC', name:'Intel Foundry', note:'Building a third-party foundry business.', rel:['NVIDIA invested $5B in Intel'] },
        ] },
      { id: 'mature', name: 'Mature / Specialty', desc: 'Trailing-edge, analog and specialty-process foundries.',
        companies: [
          { ticker:'GFS', name:'GlobalFoundries', note:'US-listed specialty foundry.' },
          { ticker:'UMC', name:'United Microelectronics', note:'Taiwan trailing-edge foundry.' },
          { ticker:'SEHK:981', name:'SMIC', note:'China\'s largest foundry.' },
          { ticker:'TSEM', name:'Tower Semiconductor', note:'Analog/specialty foundry (Israel).', tags:['CSI'] },
          { ticker:'TPEX:5347', name:'Vanguard Intl', note:'Taiwan specialty foundry.', tags:['CSI'] },
          { ticker:'SEHK:1347', name:'Hua Hong', note:'China mature-node foundry.' },
          { ticker:'SKYT', name:'SkyWater', note:'US foundry — being acquired by IonQ.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'packaging', name: 'Packaging & Substrates', tag: 'Assemble, test & connect the finished chips', flow: 6,
    accent: '#9A6BAE',
    desc: 'The back-end of the chain. OSAT firms (outsourced assembly & test) package and test finished dies, and substrate makers supply the IC substrates that connect the chip to the board. Advanced packaging (2.5D/3D, chiplets) is increasingly where performance gains come from — TSMC keeps its CoWoS in-house, while ASE and Amkor lead the merchant market.',
    groups: [
      { id: 'osat', name: 'OSAT (Assembly & Test)', desc: 'Outsourced assembly & test of finished dies, including advanced packaging.',
        companies: [
          { ticker:'ASE', name:'ASE Technology', note:'World\'s largest OSAT (assembly & test).', rel:['Packages for fabless designers + foundries'] },
          { ticker:'AMKR', name:'Amkor', note:'#2 OSAT; advanced packaging for Western fabless.' },
        ] },
      { id: 'substrate', name: 'IC Substrates', desc: 'The substrate that carries the die and routes signals to the board.',
        companies: [
          { ticker:'TYO:4062', name:'Ibiden', note:'Leading IC-substrate maker (ABF substrates for high-end packages).' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'memory', name: 'Memory (IDMs)', tag: 'Design AND make memory · HBM is the AI bottleneck', flow: 7,
    accent: '#B0506A',
    desc: 'Integrated Device Manufacturers (IDMs) that both design and fabricate memory in-house. Memory is a cyclical commodity, but HBM (High-Bandwidth Memory) is the exception — a concentrated, fast-growing product that is essential to every AI accelerator. SK hynix is a key HBM3e supplier to NVIDIA.',
    groups: [
      { id: 'dram', name: 'DRAM & HBM', desc: 'Short-term memory; HBM stacks DRAM into "cubes" co-packaged next to the GPU.',
        companies: [
          { ticker:'KRX:000660', name:'SK hynix', note:'HBM leader; key HBM3e supplier to NVIDIA.', tags:['HBM big-3','CSI'], rel:['Supplies HBM3e to NVIDIA','#2 global memory'] },
          { ticker:'MU', name:'Micron', note:'Largest pure-play memory IDM; HBM big-3.', tags:['HBM big-3','CSI'] },
          { ticker:'KRX:005930', name:'Samsung', note:'#1 memory overall; ramping HBM.', tags:['HBM big-3'] },
          { ticker:'TPE:2408', name:'Nanya', note:'Taiwan DRAM; SanDisk invested $1B for supply.' },
          { ticker:'(private)', name:'CXMT', note:'China state-funded DRAM entrant; sampling HBM.' },
        ] },
      { id: 'nand', name: 'NAND Flash', desc: 'Non-volatile long-term storage, fabbed in 3D layers.',
        companies: [
          { ticker:'TSE:285A', name:'Kioxia', note:'NAND pure-play (ex-Toshiba); JV with SanDisk.', tags:['CSI'] },
          { ticker:'SNDK', name:'SanDisk', note:'NAND pure-play; developing High-Bandwidth Flash (HBF).', tags:['CSI'] },
        ] },
      { id: 'hdd', name: 'Hard-Disk Drives', desc: 'Legacy magnetic storage — declining but resilient for cloud cold storage.',
        companies: [
          { ticker:'STX', name:'Seagate', note:'HDD leader; ~80% duopoly with WD.', tags:['CSI'] },
          { ticker:'WDC', name:'Western Digital', note:'HDD duopoly; spun off SanDisk.', tags:['CSI'] },
        ] },
      { id: 'mem-ip', name: 'Emerging / Memory IP', desc: 'Next-gen memory types (MRAM, ReRAM, SRAM) and licensors.',
        companies: [
          { ticker:'MRAM', name:'Everspin', note:'MRAM (magnetoresistive memory).' },
          { ticker:'NVEC', name:'NVE Corp', note:'MRAM/spintronics IP.', tags:['CSI'] },
          { ticker:'GSIT', name:'GSI Technology', note:'SRAM & compute-in-memory.', tags:['CSI'] },
          { ticker:'ASX:WBT', name:'Weebit Nano', note:'ReRAM licensing (Onsemi, TI deals).' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'networking', name: 'Networking & Optical', tag: 'Move data across the AI data center', flow: 8,
    accent: '#3A7CA5',
    desc: 'The "roads and freeways" of the data center — switches, NICs, optical transceivers, retimers and silicon photonics that move massive data between GPUs. NVIDIA participates here via its Mellanox acquisition (NVLink, InfiniBand, Spectrum). Value accrues to the vertically integrated system designers.',
    groups: [
      { id: 'switching', name: 'Switching & Systems', desc: 'Switch/router silicon and full network systems.',
        companies: [
          { ticker:'NVDA', name:'NVIDIA', note:'Networking via Mellanox — NVLink, InfiniBand, Spectrum.', tags:['CSI'], rel:['Networking stack from Mellanox (2020)','Manufactured by Foxconn'] },
          { ticker:'AVGO', name:'Broadcom', note:'Switching silicon + strong supply-chain control.', tags:['CSI'] },
          { ticker:'ANET', name:'Arista Networks', note:'Data-center switch/system builder.', tags:['CSI'] },
          { ticker:'CSCO', name:'Cisco', note:'Switching/routing + systems.' },
        ] },
      { id: 'optical', name: 'Optical / Photonics', desc: 'Lasers, transceivers and silicon photonics that send data as light.',
        companies: [
          { ticker:'COHR', name:'Coherent', note:'Silicon-photonics & laser IDM (ex-II-VI).', tags:['CSI'] },
          { ticker:'LITE', name:'Lumentum', note:'Photonics/laser IDM, data-center focused.', tags:['CSI'] },
          { ticker:'FN', name:'Fabrinet', note:'Contract manufacturer of optical components.' },
          { ticker:'AAOI', name:'Applied Optoelectronics', note:'Optical networking components.' },
          { ticker:'MTSI', name:'MACOM', note:'Optical / RF semiconductors.' },
        ] },
      { id: 'retimer', name: 'Retimers & Connectivity', desc: 'Clean and re-time high-speed signals; active cables.',
        companies: [
          { ticker:'CRDO', name:'Credo', note:'Retimer / active electrical cable leader.', tags:['CSI'] },
          { ticker:'ALAB', name:'Astera Labs', note:'Retimer / connectivity; Amazon a key customer.' },
        ] },
      { id: 'cable', name: 'Cable & Interconnect', desc: 'The physical copper and fiber that carries the signal.',
        companies: [
          { ticker:'APH', name:'Amphenol', note:'Cable & assembly giant; acquiring most of CommScope.', tags:['CSI'] },
          { ticker:'GLW', name:'Corning', note:'Top fiber-optic cable provider.' },
          { ticker:'VISN', name:'Vistance', note:'CommScope successor (Ruckus/Aurora).', tags:['CSI'] },
        ] },
      { id: 'cpo', name: 'Optics IP / Co-Packaged Optics', desc: 'Emerging: integrating optics into the chip package (CPO).',
        companies: [
          { ticker:'(MRVL)', name:'Celestial AI', note:'Optical-interconnect IP — acquired by Marvell.' },
          { ticker:'POET', name:'POET Technologies', note:'Optical interposer IP (pre-revenue).' },
          { ticker:'INTC', name:'Intel', note:'Retained silicon photonics; CPO development.' },
        ] },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'endmarkets', name: 'End Markets & Hyperscalers', tag: 'Final demand: cloud, AI, devices, auto', flow: 9,
    accent: '#7A8B5A',
    desc: 'Where the chips are actually deployed and paid for. Hyperscalers are the swing buyers of the AI build-out — they both buy NVIDIA systems and design their own custom silicon (via Broadcom/Marvell), making them customers and competitors at once.',
    groups: [
      { id: 'hyperscalers', name: 'Hyperscalers', desc: 'Cloud giants driving AI capex; increasingly design custom chips.',
        companies: [
          { ticker:'MSFT', name:'Microsoft', note:'Azure; Maia custom AI silicon.' , rel:['Major NVIDIA customer']},
          { ticker:'GOOGL', name:'Alphabet / Google', note:'Designs TPUs using Broadcom IP.', rel:['Buys Broadcom ASIC IP for TPU'] },
          { ticker:'AMZN', name:'Amazon', note:'AWS; Trainium/Inferentia custom silicon.', rel:['Key customer of Alchip/Astera'] },
          { ticker:'META', name:'Meta', note:'MTIA custom AI accelerators; large GPU buyer.' },
        ] },
      { id: 'devices', name: 'Devices & Systems', desc: 'Device makers and server builders — major chip buyers in their own right.',
        companies: [
          { ticker:'AAPL', name:'Apple', note:'TSMC\'s largest customer; designs its own M/A-series silicon.', rel:['Largest TSMC customer','Designs in-house, fabbed by TSMC'] },
          { ticker:'DELL', name:'Dell', note:'AI server systems builder.' },
          { ticker:'HPE', name:'HP Enterprise', note:'Enterprise/AI systems.' },
          { ticker:'TPE:2354', name:'Foxconn', note:'Contract manufacturer; assembles NVIDIA systems.', rel:['Assembles NVIDIA hardware'] },
        ] },
    ],
  },
];

// ─── Market caps ($B) — PLACEHOLDER, to be replaced by live Massive data ───────
// Approximate, for node sizing in the Network view. Massive will overwrite these.
// Any ticker not listed falls back to a small default size.
export var MCAP = {
  NVDA:3000, MSFT:3300, GOOGL:2200, AMZN:2200, META:1400, TSM:1000, AVGO:800,
  'KRX:005930':400, ASML:350, AMD:250, QCOM:190, AMAT:160, ARM:140, MU:130,
  'KRX:000660':120, LRCX:110, KLAC:110, 'TYO:8035':110, INTC:100, SNPS:90,
  APH:90, CDNS:80, MRVL:80, 'TPE:2354':80, TER:55, 'TYO:6857':40, 'AMS:ASM':45,
  'TYO:7751':40, 'TYO:4063':35, GFS:26, UMC:25, 'TYO:6146':22, 'ETR:WAF':5,
  ANSS:30, KEYS:28, 'TPE:2454':60, 'TPE:6488':15, 'TPE:3661':15, ALAB:15, COHR:12,
  CRDO:12, GLW:55, STX:25, WDC:20, SNDK:10, 'TSE:285A':12, LITE:6, AAOI:3,
  MTSI:9, FN:18, VECO:2, ACMR:2, ACLS:3, PLAB:1.5, ONTO:9, NVMI:7, CAMT:5,
  POET:0.3, 'TPE:2408':3, TSEM:13, 'SEHK:981':77, SKYT:1.4, RMBS:7, CEVA:0.6,
  'AIP':0.7, IDCC:5, ADEA:1.5, IBM:230, LSCC:8, DELL:90, HPE:28, CSCO:240,
  ANET:130, NVEC:0.4, GSIT:0.2, MRAM:0.2, LIN:230, 'PA:AI':110,
  // New nodes added from the Bloomberg SPLC analysis:
  AAPL:3500, ASE:30, AMKR:7, 'TYO:4062':8,
};

// ─── Logo domains (nodeId → domain) — shared by all views (Clearbit + favicon fallback) ──
export var LOGO_DOMAIN = {
  'NVDA':'nvidia.com', 'AMD':'amd.com', 'AVGO':'broadcom.com', 'MRVL':'marvell.com', 'QCOM':'qualcomm.com',
  'TPE:2454':'mediatek.com', 'TPE:3661':'alchip.com', 'LSCC':'latticesemi.com', 'TSM':'tsmc.com', 'KRX:005930':'samsung.com',
  'INTC':'intel.com', 'GFS':'gf.com', 'UMC':'umc.com', 'SEHK:981':'smics.com', 'TSEM':'towersemi.com',
  'ASML':'asml.com', 'AMAT':'appliedmaterials.com', 'LRCX':'lamresearch.com', 'KLAC':'kla.com', 'TYO:8035':'tel.com',
  'AMS:ASM':'asm.com', 'VECO':'veeco.com', 'ACMR':'acmrcsh.com', 'ONTO':'ontoinnovation.com', 'NVMI':'novami.com',
  'CAMT':'camtek.com', 'ACLS':'axcelis.com', 'TER':'teradyne.com', 'TYO:6857':'advantest.com', 'FORM':'formfactor.com',
  'PLAB':'photronics.com', 'TYO:6146':'disco.co.jp', 'TYO:7751':'canon.com', 'SNPS':'synopsys.com', 'CDNS':'cadence.com',
  'ARM':'arm.com', 'ETR:SIE':'siemens.com', 'ANSS':'ansys.com', 'KEYS':'keysight.com', 'RMBS':'rambus.com',
  'IDCC':'interdigital.com', 'IBM':'ibm.com', 'KRX:000660':'skhynix.com', 'MU':'micron.com', 'TPE:2408':'nanya.com',
  'TSE:285A':'kioxia.com', 'SNDK':'sandisk.com', 'STX':'seagate.com', 'WDC':'westerndigital.com', 'ANET':'arista.com',
  'CSCO':'cisco.com', 'COHR':'coherent.com', 'LITE':'lumentum.com', 'FN':'fabrinet.com', 'AAOI':'ao-inc.com',
  'MTSI':'macom.com', 'CRDO':'credosemi.com', 'ALAB':'asteralabs.com', 'APH':'amphenol.com', 'GLW':'corning.com',
  'POET':'poet-technologies.com', 'MSFT':'microsoft.com', 'GOOGL':'abc.xyz', 'AMZN':'amazon.com', 'META':'meta.com',
  'TPE:2354':'foxconn.com', 'DELL':'dell.com', 'HPE':'hpe.com', 'TYO:4063':'shinetsu.co.jp', 'TYO:3436':'sumcosi.com',
  'LIN':'linde.com', 'PA:AI':'airliquide.com', 'TYO:4901':'fujifilm.com', 'AAPL':'apple.com', 'ASE':'aseglobal.com',
  'AMKR':'amkor.com', 'TYO:4062':'ibiden.com',
};

// ─── Relationships (directed edges) — STARTER SET, to be refined with Bloomberg ─
// Direction a → b means "a supplies / enables b" (value flows downstream).
// w = relationship size 1–3 (placeholder). Bloomberg SPLC export will set real weights.
export var EDGES = [
  // Equipment → Foundry / IDM (toolmakers fill the fabs)
  { a:'ASML', b:'TSM', t:'EUV/DUV litho', w:3 },
  { a:'ASML', b:'KRX:005930', t:'litho', w:2 },
  { a:'ASML', b:'INTC', t:'litho', w:2 },
  { a:'AMAT', b:'TSM', t:'fab equipment', w:2 },
  { a:'LRCX', b:'TSM', t:'etch/depo', w:2 },
  { a:'KLAC', b:'TSM', t:'metrology', w:2 },
  { a:'TYO:8035', b:'TSM', t:'fab equipment', w:2 },
  { a:'AMAT', b:'KRX:000660', t:'memory equipment', w:2 },
  { a:'LRCX', b:'MU', t:'memory equipment', w:2 },
  // Materials → Equipment / Foundry
  { a:'TYO:4063', b:'TSM', t:'wafers', w:2 },
  { a:'TYO:3436', b:'TSM', t:'wafers', w:1 },
  // EDA / IP → Fabless designers
  { a:'SNPS', b:'NVDA', t:'EDA tools', w:2 },
  { a:'CDNS', b:'NVDA', t:'EDA tools', w:2 },
  { a:'ARM', b:'QCOM', t:'CPU IP', w:3 },
  { a:'ARM', b:'NVDA', t:'CPU IP', w:2 },
  { a:'SNPS', b:'AMD', t:'EDA tools', w:1 },
  // Foundry → Fabless (TSMC manufactures the chips)
  { a:'TSM', b:'NVDA', t:'manufactures GPUs', w:3 },
  { a:'TSM', b:'AMD', t:'manufactures', w:3 },
  { a:'TSM', b:'AVGO', t:'manufactures', w:2 },
  { a:'TSM', b:'QCOM', t:'manufactures', w:2 },
  { a:'TSM', b:'MRVL', t:'manufactures', w:1 },
  // Memory → Fabless (HBM into the GPU)
  { a:'KRX:000660', b:'NVDA', t:'HBM3e', w:3 },
  { a:'MU', b:'NVDA', t:'HBM', w:2 },
  { a:'KRX:005930', b:'NVDA', t:'HBM', w:1 },
  { a:'SNDK', b:'TPE:2408', t:'$1B DRAM stake', w:1 },
  // Networking / Optical → Fabless / Systems
  { a:'COHR', b:'NVDA', t:'optical', w:2 },
  { a:'LITE', b:'NVDA', t:'optical', w:1 },
  { a:'CRDO', b:'NVDA', t:'retimers/AEC', w:1 },
  { a:'ALAB', b:'AMZN', t:'connectivity', w:2 },
  { a:'APH', b:'NVDA', t:'cables', w:2 },
  // Assembly → Fabless
  { a:'TPE:2354', b:'NVDA', t:'assembles systems', w:2 },
  // Fabless / Foundry → End markets & hyperscalers
  { a:'NVDA', b:'MSFT', t:'AI systems', w:3 },
  { a:'NVDA', b:'GOOGL', t:'AI systems', w:2 },
  { a:'NVDA', b:'AMZN', t:'AI systems', w:3 },
  { a:'NVDA', b:'META', t:'AI systems', w:3 },
  { a:'AVGO', b:'GOOGL', t:'TPU ASIC IP', w:3 },
  { a:'MRVL', b:'AMZN', t:'custom silicon', w:2 },
  { a:'TPE:3661', b:'AMZN', t:'ASIC design', w:1 },
  { a:'AMD', b:'MSFT', t:'AI/CPU', w:2 },
  // Cross: NVIDIA invests in Intel
  { a:'NVDA', b:'INTC', t:'$5B investment', w:1 },
];

// Unique companies, each assigned to ONE primary bucket (first/upstream-most
// occurrence in flow order). Used to build the network graph (one node per ticker).
export function uniqueCompanies(){
  var seen = {}; var out = [];
  BUCKETS.forEach(function(b){
    b.groups.forEach(function(g){
      g.companies.forEach(function(c){
        if (seen[c.ticker]) return;
        seen[c.ticker] = true;
        out.push({ co:c, bucket:b, group:g });
      });
    });
  });
  return out;
}

// Convenience lookups (used by the renderer).
export function getBucket(id){ for (var i=0;i<BUCKETS.length;i++){ if (BUCKETS[i].id===id) return BUCKETS[i]; } return null; }
export function getGroup(bucketId, groupId){
  var b = getBucket(bucketId); if (!b) return null;
  for (var i=0;i<b.groups.length;i++){ if (b.groups[i].id===groupId) return b.groups[i]; }
  return null;
}
// Every bucket that contains a company with this ticker (for cross-bucket highlighting).
export function bucketsWithTicker(ticker){
  var out = [];
  BUCKETS.forEach(function(b){
    var hit = b.groups.some(function(g){ return g.companies.some(function(c){ return c.ticker===ticker; }); });
    if (hit) out.push(b.id);
  });
  return out;
}
