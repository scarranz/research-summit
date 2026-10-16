// tsm.js — Taiwan Semiconductor Manufacturing Company Limited (NYSE: TSM · TWSE: 2330).
// Built unit by unit with the analyst following docs/PROFILE_PLAYBOOK.md; the build log is
// docs/profiles/TSM.md. Shape copied from js/overviews/amzn.js (the reference profile).
//
// Notes that every unit has to respect:
//  · Foreign private issuer — 20-F annual + 6-K quarterly (no 10-K/10-Q/8-K).
//  · Reports in NT$; guides quarterly revenue in US$. One ADR (TSM) = 5 common shares (2330 TT).
//  · Fiscal year = calendar year.
//
// `deepDive` is exported since its first sub-tab (Evolution ▸ Results, EV-RES) was approved; each
// section and sub-tab is added only with its own approved unit (playbook §7.1 / golden rule 5).

import { SUMMIT_CAT, SUMMIT_MUTE } from '../viz-palette.js';   // the portal's fixed categorical palette
import { resultsHtml, initResults } from '../results.js';      // Evolution ▸ Results engine (data: js/results-data/tsm.js)
import { tsmCeHtml, tsmCeWire, tsmCeBuild, tsmCePop } from './tsm-ce.js';   // Evolution ▸ Earnings (Amazon's machinery + ./tsm-ce-data.js)
import { tsmBlGeneralHtml, tsmBlGeneralBuild } from './tsm-bl.js';   // Bottom Line ▸ General (Amazon's views + ./tsm-bl-data.js)
import { tsmSplcBody, tsmSplcBuild, tsmSplcPop } from './tsm-splc.js';   // Bottom Line ▸ Supply Chain (Bloomberg SPLC, top 20)
import { tsmHistMult } from './tsm-histmult.js';   // Valuation ▸ Historic Multiple (copy of amzn-histmult.js)
import { tsmTargetMult } from './tsm-target-multiple.js';   // Valuation ▸ Target Multiple / PEG (frozen Summit valuation)
import { tsmSens } from './tsm-sensitivity.js';
import { TSM_MGMT, tsmOwnBody, tsmOwnInit, tsmGovBody, tsmTrackBody, tsmTrackPop } from './tsm-mgmt.js';   // Management ▸ Executives & Board (shared makeManagement mold)   // Valuation ▸ Sensitivity (frozen Summit snapshot; SN's one-segment structure)
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line engine (data: js/segments-data/tsm.js)

function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══ Header source buttons (IR + EDGAR) — rendered by companies.js into #co-srcbtns ═══════════
// Styles live in css/overview.css (.cohd-src); no inline <style>.
var CE_IR_URL='https://investor.tsmc.com/english/quarterly-results';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1046179&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/TSM';
var CE_SEC_SEAL='img/sec-seal.png';
function ceHeaderSources(){
  return '<div class="cohd-src">'+
  '<a href="'+CE_IR_URL+'" target="_blank" rel="noopener" title="TSMC Investor Relations" aria-label="TSMC Investor Relations">'+
    '<img src="'+CE_LOGO_URL+'" alt="TSMC logo" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '<a class="edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener" title="TSMC on SEC EDGAR" aria-label="TSMC on SEC EDGAR">'+
    '<img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '</div>';
}

// ═════════════════════════════════════════════════════════════════════════════════════════════
// DATA — Overview
// ═════════════════════════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5×2), canonical set. Sources: FY2025 Form 20-F (acc. 0001628280-26-025362):
// cover page (HQ, jurisdiction, NYSE listing), Item 4 (incorporated Feb 21 1987; TWSE since Sep 5 1994;
// ADSs on NYSE since Oct 8 1997), Item 6 (C.C. Wei bio; 90,557 full-time employees at Dec 31 2025),
// Item 8 (quarterly cash dividends). Founder from tsmc.com company profile ("Established in 1987 by
// Dr. Morris Chang"). Filer status verified on EDGAR (CIK 1046179 files 20-F/6-K — foreign private issuer).
var STD_FACTS=[
  ['Listing','NYSE: TSM · TWSE: 2330'],
  ['HQ','Hsinchu, Taiwan'],
  ['Incorporated','Taiwan (R.O.C.)'],
  ['SEC filer','Foreign (20-F/6-K)'],
  ['Founded','1987 (Morris Chang)'],
  ['IPO','Sep 1994 · TWSE · ADS on NYSE Oct 1997'],
  ['CEO','C.C. Wei · joined 1998 · CEO since Jun 2018'],
  ['Employees','90,557 · Dec 2025'],
  ['Dividend','Payer · quarterly'],
  ['Market cap','loading live quote…'],
];

// Description (lede) — paraphrased from the FY2025 20-F, Item 4 ("Business Overview of the Company",
// "Our Semiconductor Facilities": 18 wafer fabs in Taiwan, 2 in the United States, 2 in China, 1 in Japan).
var TSM_LEDE='TSMC is a dedicated semiconductor foundry: it manufactures chips that other companies design, and does not sell chips under its own name. Founded in Taiwan in 1987, it turns customers\' circuit designs into finished silicon wafers across a range of process technologies, from mature to the most advanced, and also offers mask-making, advanced packaging and testing. Most of its fabs are in Taiwan, with others in the United States, China and Japan.';

// 2×2 quadrant — ≤30 words a cell. Sources: FY2025 20-F Item 4 (business overview: processes, 3DFabric
// packaging, mask-making, testing; customers "fabless … system companies … integrated device
// manufacturers"), Item 3 risk factors (ten largest customers 78% / largest 19% of FY2025 net revenue),
// Item 5 (net revenue by platform: HPC 58% · Smartphone 29% · IoT 5% · Automotive 5% · DCE 1% · Others 2%;
// 7nm and below = 74% of wafer revenue) and "Competition" (capacity for advanced technologies as the
// major competitive advantage). "The edge" is the analyst's read (approved at the OV-3 gate).
var STD_BIZ=[
  ['What it sells','Contract manufacturing of chips its customers design — silicon wafers on processes from leading-edge 2nm to mature nodes — plus mask-making, 3DFabric advanced packaging and testing.'],
  ['Who buys it','Fabless chip designers, system companies and integrated device manufacturers. Highly concentrated: the ten largest customers were ~78% of FY2025 revenue, the largest alone 19%.'],
  ['How it earns','FY2025 by platform: ~58% HPC · ~29% smartphone · ~5% IoT · ~5% automotive · ~3% other — and 74% of wafer revenue came from 7nm and below.'],
  ['The edge','Scale and capacity at the most advanced nodes, which TSMC itself calls its major competitive advantage, and a pure-foundry model: no chips of its own competing with its customers.'],
];

// How it makes money — FY2025. TSMC reports a single segment (foundry), so the three views are the
// revenue disaggregations it does publish. Currency (SAB, 2026-10-15): US$ as TSMC reports it each quarter —
// FY2025 = 25.53 + 30.07 + 33.10 + 33.73 = $122.43B, FY2024 = 18.87 + 20.82 + 23.50 + 26.88 = $90.07B
// (quarterly earnings releases, 6-K EX-99.1). Each slice = its exact share of NT$ revenue in the 20-F × that
// US$ total, so every view sums to $122.4B. Platform and region shares: 20-F Item 5 (NT$ by platform and by
// customer headquarters). Node shares: 4Q25 earnings presentation ("Revenue by Technology", % of WAFER
// revenue) × the wafer share of revenue in the 20-F revenue note (NT$3,272,553.5M of NT$3,809,054.3M).
// [label, % of total, '$x.xB', 'x%', colour]
var GMM_PLAT=[
  ['HPC',        57.6, '$70.5B', '58%', SUMMIT_CAT[0]],
  ['Smartphone', 29.2, '$35.7B', '29%', SUMMIT_CAT[1]],
  ['IoT',         5.0, '$6.1B',  '5%',  SUMMIT_CAT[2]],
  ['Automotive',  4.9, '$6.0B',  '5%',  SUMMIT_CAT[3]],
  ['DCE',         1.3, '$1.5B',  '1%',  SUMMIT_CAT[4]],
  ['Others',      2.1, '$2.6B',  '2%',  SUMMIT_MUTE],
];
var GMM_GEO=[
  ['North America', 75.5, '$92.4B', '75%', SUMMIT_CAT[0]],
  ['Asia Pacific',   8.6, '$10.6B', '9%',  SUMMIT_CAT[1]],
  ['China',          8.6, '$10.5B', '9%',  SUMMIT_CAT[2]],
  ['Japan',          4.0, '$4.8B',  '4%',  SUMMIT_CAT[3]],
  ['EMEA',           3.3, '$4.1B',  '3%',  SUMMIT_CAT[4]],
];
var GMM_NODE=[
  ['3nm',            20.6, '$25.2B', '21%', SUMMIT_CAT[0]],
  ['5nm',            30.9, '$37.9B', '31%', SUMMIT_CAT[1]],
  ['7nm',            12.0, '$14.7B', '12%', SUMMIT_CAT[2]],
  ['16/20nm',         6.0, '$7.4B',  '6%',  SUMMIT_CAT[3]],
  ['28nm',            6.0, '$7.4B',  '6%',  SUMMIT_CAT[4]],
  ['40nm & older',   10.3, '$12.6B', '10%', SUMMIT_CAT[5]],
  ['Non-wafer',      14.1, '$17.2B', '14%', SUMMIT_MUTE],
];
// One accordion per platform: what it is (no numbers) + "The numbers". Descriptions paraphrase the 20-F
// Item 4 platform paragraphs. Growth is shown in US$ (the block's currency) with TSMC's own NT$ figure
// beside it, because TSMC's presentation quotes platform growth in NT$ (4Q25 presentation, slide 8).
// Share history: 20-F Item 5 (2023 · 2024 · 2025).
var REV_DEFS=[
  { seg:'HPC (AI accelerators, CPUs, networking)',
    desc:'High Performance Computing: chips for data centers, AI and PCs — <b>AI accelerators</b> (GPUs and custom ASICs), server and PC processors, FPGAs and high-speed networking chips — built on TSMC\'s most advanced processes and, increasingly, assembled with its <b>3DFabric advanced packaging</b> (CoWoS, SoIC). TSMC names it the key growth driver of the business.',
    econ:[['FY2025 revenue','$70.5B · 58% of total'],['Growth','+53% in US$ (+48% in NT$, as TSMC reports)'],['Share of revenue','43% (2023) → 51% (2024) → 58% (2025)']] },
  { seg:'Smartphone (application processors and companion chips)',
    desc:'The processors at the heart of phones, on leading-edge nodes for premium models and mature ones for mainstream models, plus the specialty <b>companion chips</b> around them: radio frequency, power management, sensors and display drivers, and InFO packaging.',
    econ:[['FY2025 revenue','$35.7B · 29% of total'],['Growth','+14% in US$ (+11% in NT$)'],['Share of revenue','38% (2023) → 35% (2024) → 29% (2025)']] },
  { seg:'IoT (connected and edge devices)',
    desc:'Chips for connected devices — wearables, smart home, edge AI — built mostly on an <b>ultra-low-power</b> platform that trades peak performance for battery life, plus specialty processes for radio, sensors and power management.',
    econ:[['FY2025 revenue','$6.1B · 5% of total'],['Growth','+19% in US$ (+15% in NT$)'],['Share of revenue','8% (2023) → 6% (2024) → 5% (2025)']] },
  { seg:'Automotive (driver assistance, infotainment)',
    desc:'Automotive-grade versions of its processes for <b>driver assistance</b>, in-vehicle infotainment and the zonal controllers of new vehicle architectures, for combustion and electric vehicles alike, plus specialty chips (embedded memory, radar RF, power).',
    econ:[['FY2025 revenue','$6.0B · 5% of total'],['Growth','+38% in US$ (+34% in NT$)'],['Share of revenue','6% (2023) → 5% (2024) → 5% (2025)']] },
  { seg:'DCE (TVs, set-top boxes, cameras)',
    desc:'Digital Consumer Electronics: chips for smart TVs, set-top boxes and streaming devices, cameras and their wireless connectivity.',
    econ:[['FY2025 revenue','$1.5B · 1% of total'],['Growth','+3% in US$ (+0% in NT$)'],['Share of revenue','2% (2023) → 1% (2024) → 1% (2025)']] },
  { seg:'Others',
    desc:'End markets outside the five platforms; the 20-F does not break them down further.',
    econ:[['FY2025 revenue','$2.6B · 2% of total'],['Growth','+38% in US$ (+34% in NT$)'],['Share of revenue','3% (2023) → 2% (2024) → 2% (2025)']] },
  { seg:'The revenue lines (wafers vs everything else)',
    desc:'The 20-F also splits the same total by <b>product</b>: wafer sales, and everything else TSMC sells around the wafer. The node view above splits the wafer line by technology.',
    econ:[['Wafer','$105.2B · 86% (+34% in US$)'],['Others (non-wafer)','$17.2B · 14% (+46% in US$)']],
    econNote:'20-F revenue disaggregation by product (NT$3,272.6B wafer · NT$536.5B others; +30% and +41% in NT$). The 20-F does not itemise the non-wafer line.' },
];

// Products — two tiers: family card → pop-up with the specific products (key = prod:i). Families grouped
// by technology (SAB, 2026-10-15). Every line paraphrases the FY2025 20-F Item 4 (platform paragraphs,
// "Design and Technology Platforms", "Multi-project Wafer Program", "Research and Development").
var A_PRODUCTS=[
  { ic:'🔬', fam:'Leading-edge logic', d:'The most advanced transistors.', items:[
    ['N2 (2-nanometer)','TSMC\'s first node with <b>nanosheet</b> transistors instead of FinFET; entered volume production in 2025. Variants N2P (phones) and N2X (maximum clock speed for HPC).'],
    ['A16','The next step, a 16-angstrom-class node: design tools and IP have been announced as ready, and TSMC expects to move to 16 angstrom and below in the coming years.'],
    ['N3 family (N3E · N3P · N3X)','The 3-nanometer FinFET generation, with versions tuned for premium phones (N3E, N3P) and for peak performance in HPC (N3X).'],
    ['N5 / N4 family (N4P · N4X)','5- and 4-nanometer FinFET, used across HPC, smartphone, IoT and automotive designs.'],
  ]},
  { ic:'⚙️', fam:'Mainstream logic', d:'Proven nodes, broad catalog.', items:[
    ['N7 / N6','7- and 6-nanometer FinFET for mainstream phones, smart TVs and set-top boxes, automotive and ultra-low-power IoT (N6e).'],
    ['16 / 12nm FinFET','The 16FFC and 12FFC families: mainstream phone chips, IoT (N12e), automotive and millimeter-wave RF.'],
    ['28 / 22nm','Planar-transistor nodes (28HPC+, 22ULP, 22ULL) in high volume for mainstream phones, battery-powered IoT, TVs and automotive.'],
  ]},
  { ic:'📡', fam:'Specialty technologies', d:'Analog, RF, memory, sensors, power.', items:[
    ['RF and RF front-end','Radio chips for phones and wireless connectivity, and millimeter-wave RF (28, 22 and 16nm) for automotive radar.'],
    ['Embedded memory','Non-volatile memory built into logic chips — embedded flash at 28nm for cars, MRAM at 16nm.'],
    ['Power management (PMIC)','Chips that regulate power in phones, IoT devices, TVs and cars.'],
    ['Sensors','High-dynamic-range CMOS image sensors and LiDAR sensors, including automotive grades.'],
    ['Display drivers','The chips that drive phone and device displays.'],
    ['Ultra-low power (ULP / ULL)','A low-voltage platform from 55nm down to 6nm for battery-powered IoT and edge-AI devices.'],
  ]},
  { ic:'🧱', fam:'3DFabric packaging', d:'Stacking and packaging chips.', items:[
    ['CoWoS','Chip-on-Wafer-on-Substrate: several chips — for example a processor and high-bandwidth memory — side by side in one package, for HPC and AI parts.'],
    ['SoIC','System on Integrated Chips: stacks chips directly on top of each other (3D) for density and very short connections.'],
    ['InFO','Integrated Fan-Out: thin wafer-level packaging, used for smartphone application processors.'],
    ['3Dblox','An open design standard for 3D chip stacks, which TSMC contributed to the IEEE.'],
  ]},
  { ic:'🛠️', fam:'Design & manufacturing services', d:'Help to design, prototype, build.', items:[
    ['Open Innovation Platform (OIP)','Since 2008: design flows, libraries, IP and design kits from TSMC and its partners, so customers can design on each new node.'],
    ['CyberShuttle','Multi-project wafers: several customers share one mask set to prototype at a fraction of the mask cost.'],
    ['Mask making','The photomasks used to print each customer\'s design onto the wafer.'],
    ['Testing','Wafer and chip testing services.'],
  ]},
];

// Timeline — strict chronological order. Sources: FY2025 20-F Item 4 (incorporation Feb 21 1987 as a
// joint venture of the R.O.C. government and private investors; TWSE Sep 5 1994; NYSE ADSs Oct 8 1997;
// TSMC Arizona est. Nov 2020, volume production end-2024, CHIPS Act agreements Nov 2024; JASM est. Dec 2021,
// volume production Dec 2024; ESMC est. Jun 2023, construction 2024; 2nm volume production 2025; "7-, 5-,
// 3- and 2-nanometer … prior to … competitors"), Item 5 (platform shares 2023–2025), Item 6 (C.C. Wei:
// President & Co-CEO Nov 2013, CEO & Vice Chairman Jun 2018, now Chairman & CEO); tsmc.com company profile
// (founded by Dr. Morris Chang; "pioneered the pure-play foundry business model").
var TIMELINE=[
  { y:'1987', t:'Founded in Hsinchu as the first <b>pure-play foundry</b> — a chipmaker that only manufactures other companies\' designs.',
    d:'<ul class="ov-bullets"><li>Incorporated on February 21, 1987 as a joint venture of the Taiwan (R.O.C.) government and private investors, led by <b>Dr. Morris Chang</b>.</li><li>The model: no chips of its own — only customers\' designs, so customers never compete with their manufacturer.</li><li>TSMC describes itself as having <b>pioneered</b> the pure-play foundry business model.</li></ul>' },
  { y:'1994–97', t:'Listed on the Taiwan Stock Exchange (Sep 1994), then in New York as ADSs (Oct 1997).' },
  { y:'Jun 2018', t:'Founder <b>Morris Chang retires</b>; C.C. Wei, co-CEO since 2013, becomes sole CEO.',
    d:'<ul class="ov-bullets"><li>Nov 2013 — C.C. Wei is named President and Co-CEO.</li><li>Jun 2018 — Morris Chang retires; Wei becomes <b>CEO and Vice Chairman</b>.</li><li>Jun 2024 — Wei becomes <b>Chairman and CEO</b>, the role he holds today.</li></ul>' },
  { y:'2020–24', t:'Fabs outside Taiwan at scale: <b>Arizona</b>, <b>Kumamoto (Japan)</b> and <b>Dresden (Germany)</b>.',
    d:'<ul class="ov-bullets"><li>Nov 2020 — TSMC Arizona established; its first fab entered high-volume production at the end of 2024.</li><li>Dec 2021 — JASM established in Kumamoto with Sony, later joined by DENSO and Toyota; volume production from Dec 2024.</li><li>Jun 2023 — ESMC established in Dresden with Bosch, Infineon and NXP (10% each); construction began in 2024.</li><li>Nov 2024 — US CHIPS Act agreements for TSMC Arizona: up to <b>$6.6B</b> in direct funding and up to <b>$5B</b> in loans.</li></ul>' },
  { y:'2023', t:'<b>HPC</b> — AI accelerators, CPUs and networking chips — is the largest platform, ahead of smartphones.',
    d:'<ul class="ov-bullets"><li>2023 — HPC 43% of revenue vs smartphone 38%.</li><li>2024 — 51% vs 35%.</li><li>2025 — <b>58% vs 29%</b>: HPC is now more than half of revenue.</li></ul>' },
  { y:'2025', t:'<b>2-nanometer</b> enters volume production — TSMC\'s first node with nanosheet transistors.',
    d:'<ul class="ov-bullets"><li>N2 replaces the FinFET transistor used since 16nm with a <b>nanosheet</b> design.</li><li>TSMC states it offered 7-, 5-, 3- and 2-nanometer for volume production <b>before its competitors</b>.</li><li>Next: A16, a 16-angstrom-class node; TSMC expects to move to 16 angstrom and below in the coming years.</li></ul>' },
];

// The Overview's one source footer (OV-F) — collapsibles 4–7 carry none of their own.
var OV_SOURCES='Sources — TSMC FY2025 Form 20-F (SEC EDGAR, filed Apr 16 2026) for company facts, FY2025 revenue by platform, customer region and product, margins, headcount, the business description and history; TSMC quarterly earnings releases and presentations (Form 6-K) for revenue in US$ by quarter and the FY2025 node mix; tsmc.com for the founder and the pure-play foundry model; SEC filing history for filer status. Peers: each company\'s FY2025 annual report on SEC EDGAR (Intel 10-K; GlobalFoundries, UMC and Tower 20-F). Market cap and peer multiples are live (Massive price ÷ reported figures as of FY2025; TSMC\'s forward ÷ Bloomberg consensus as of Jul 2026). Peer-map figures for NT$ reporters (TSMC, UMC) use the rate each 20-F declares (NT$31.37 per US$). Forward figures are estimates, not company guidance.';

// ═══ Competitors — the peer map (OV-6; the same A_PEERS / A_SC feed Valuation ▸ Peers) ════════════════
// Rule 10: no multiple and no market cap is written here. The file holds the DENOMINATORS, from each
// peer's own FY2025 annual report on SEC EDGAR; price, market cap and (when Massive has it) EV are live
// (api.liveQuote) and the multiple is computed in the browser: P/E = price ÷ EPS, EV/EBITDA = EV ÷ EBITDA,
// with EV = live EV or, when Massive has none, live market cap + net debt below.
//   epsT/epsF  US$ per listed share (per ADS for TSM and UMC: 1 ADS = 5 common shares)
//   ebitdaT/F  US$ millions = operating income + depreciation + amortization (EBITDA as reported is not a line item)
//   nd         net debt, US$ millions = borrowings (bonds, loans, current portion; ex leases) − cash & equivalents
//   gt/gf      revenue growth, %, in the reporting currency (TSM: US$ as TSMC reports it each quarter, as in OV-4)
// Non-US$ reporters are converted at the rate their own 20-F declares for its US$ column (NT$31.37 = US$1,
// Dec 31 2025, for both TSM and UMC). Forward = Bloomberg consensus FY2026 and exists only for TSM
// (BBG_CONSENSUS.txt, data_as_of 7/21/2026: EPS US$3.3167 per common share ×5, EBITDA $123,993M, revenue
// $168,165M); the other peers are not in the Street file, so they plot on Trailing only (SAB, 2026-10-15).
// Peer set (SAB, 2026-10-15): the listed foundries. Samsung Foundry and SMIC have no US listing.
var A_PEERS=[
  { tk:'TSM', n:'TSMC', hl:true, epsT:10.43, epsF:16.58, ebitdaT:83653, ebitdaF:123993, nd:-55303, gt:35.9, gf:37.2,
    src:'20-F FY2025 (US$ at NT$31.37); forward: Bloomberg consensus FY2026, Jul 21 2026',
    why:'The pure-play leader: the only foundry producing 3nm and 2nm in volume, with most of the industry\'s leading-edge capacity.' },
  { tk:'INTC', n:'Intel', epsT:-0.06, epsF:null, ebitdaT:9492, ebitdaF:null, nd:32320, gt:-0.5, gf:null,
    src:'10-K FY2025 (fiscal year ended Dec 27 2025)',
    why:'The integrated chipmaker building a foundry for outside customers (Intel Foundry). FY2025 GAAP EPS was negative, so it has no P/E — it plots on EV/EBITDA only.' },
  { tk:'GFS', n:'GlobalFoundries', epsT:1.59, epsF:null, ebitdaT:1965, ebitdaF:null, nd:-658, gt:0.6, gf:null,
    src:'20-F FY2025 (IFRS, US$)',
    why:'The largest US-headquartered pure foundry, focused on mature and specialty nodes rather than the leading edge.' },
  { tk:'UMC', n:'UMC', epsT:0.52, epsF:null, ebitdaT:3290, ebitdaF:null, nd:-1202, gt:2.3, gf:null,
    src:'20-F FY2025 (US$ at NT$31.37; EPS per ADS = 5 shares)',
    why:'Taiwan\'s second foundry, competing in mature nodes (28nm and above) and specialty processes.' },
  { tk:'TSEM', n:'Tower', epsT:1.94, epsF:null, ebitdaT:497, ebitdaF:null, nd:-74, gt:9.1, gf:null,
    src:'20-F FY2025 (US GAAP, US$)',
    why:'A specialty-analog foundry (RF, power, image sensors, silicon photonics) — small, and on different processes from TSMC\'s core.' },
];

var A_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: only TSM has a forward
function aScReset(){ if(!A_SC.peers) A_SC.peers=A_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function aScNum(v){ return v!=null && !isNaN(v); }
function aScMult(p){
  if(!aScNum(p.px)) return null;                                     // no live price → no bubble (no seeded fallback)
  var f=A_SC.basis==='f';
  if(A_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (aScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!aScNum(eb)||eb<=0) return null;
  var ev=aScNum(p.ev)?p.ev:(aScNum(p.mc)&&aScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return aScNum(ev)?ev/eb:null;
}
function aScGrowth(p){ return A_SC.basis==='f'?p.gf:p.gt; }
function aScVisible(){ return (A_SC.peers||[]).filter(function(p){ return p.on && aScNum(aScMult(p)) && aScNum(aScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function aScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="tsm-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="tsm-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="tsm-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="tsm-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="tsm-sc-yhi">fast growth</text>'+
    '<g class="tsm-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips tsm-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>US-listed</b> peers with a public multiple plot here — <b>Samsung Foundry</b> (inside Samsung Electronics, listed in Seoul) and <b>SMIC</b> (Hong Kong / Shanghai) have no US-dollar market multiple. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures reported in each company\'s FY2025 annual report (SEC EDGAR); TSMC\'s forward = Bloomberg consensus FY2026 (as of Jul 21 2026) — the other peers have no Street file, so they plot on Trailing only. Market caps are live.</span></div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default — copied from
  // amzn.js stdPeerScatter('dd').
  if(sfx==='dd') h+='<div class="rs-collap tsm-sc-collap">'+
      '<button type="button" class="rs-collap-h tsm-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b tsm-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="tsm-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip tsm-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function aScRenderOne(wrap){
  var g=wrap.querySelector('.tsm-sc-nodes'); if(!g||!A_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var vis=aScVisible();
  var maxMult=aScNice(Math.max.apply(null, vis.map(aScMult).concat([1]))*1.12);
  var gs=vis.map(aScGrowth), gMax=aScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-aScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.tsm-sc-xlab'); if(lab) lab.textContent=(A_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(A_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.tsm-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.tsm-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===A_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===A_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=aScMult(p), growth=aScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=aScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=scLogoUrl(p);
    var read=(A_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(aScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?SUMMIT_CAT[0]:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?SUMMIT_CAT[0]:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  aScChipsOne(wrap);
  aScTableOne(wrap);
}
// ─── The comps table under the peer map (Valuation ▸ Peers) — copied from amzn.js aScTableOne ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median EXCLUDE TSMC (the set it is read against). Premium in red, discount in green.
function aScFmtMult(v){ return aScNum(v)?v.toFixed(1)+'×':'—'; }
function aScFmtPct(v){ return aScNum(v)?v.toFixed(1)+'%':'—'; }
function aScFmtMc(v){ return aScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function aScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function aScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function aScVsAvg(m, avg){
  if(!aScNum(m)||!aScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function aScTableOne(wrap){
  var box=wrap.querySelector('.tsm-sc-tbl'); if(!box||!A_SC.peers) return;
  var mLab=(A_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(A_SC.basis==='f'?'forward':'trailing');
  var rows=A_SC.peers.map(function(p){ return { p:p, m:aScMult(p), g:aScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=aScNum(a.m), bn=aScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=aScMean(peers.filter(function(r){ return aScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=aScMedian(peers.filter(function(r){ return aScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=aScMean(peers.filter(function(r){ return aScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=aScMedian(peers.filter(function(r){ return aScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return aScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(aScNum(r.m)?'':' asc-nil'), nt=aScNum(r.m)?'':aScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+aScFmtMult(r.m)+'</td>'+
      '<td>'+aScFmtPct(r.g)+'</td>'+
      '<td>'+aScFmtMc(p.mc)+'</td>'+
      '<td>'+aScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-TSMC · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+aScFmtMult(avgM)+'</td><td>'+aScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-TSMC</span></td>'+
      '<td>'+aScFmtMult(medM)+'</td><td>'+aScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.tsm-sc-tblh'), bd=wrap.querySelector('.tsm-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
// Valuation ▸ Peers (VA-PEERS): the same map as Overview ▸ Competitors — same A_SC state, so removing a
// peer here removes it there — plus the table. Multiples and caps are live; the file holds denominators.
function valuationPeersBody(){
  return '<p class="ov-lede"><b>The peer map.</b> The same live-cap scatter as the Overview, kept beside the valuation work: X = multiple (P/E ⇄ EV/EBITDA, forward ⇄ trailing), Y = revenue growth, bubble = live market cap. Every multiple is the live price over a reported (or, for TSMC forward, Bloomberg) denominator.</p>'+
    stdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company\'s FY2025 annual report on SEC EDGAR (TSMC, UMC, GlobalFoundries and Tower 20-F; Intel 10-K; non-US$ reporters at the rate their 20-F declares, NT$31.37 = US$1); TSMC forward = Bloomberg consensus FY2026 (as of Jul 21 2026) — the other peers have no Street file, so they plot on Trailing only. Price, market cap and EV live (Massive). EBITDA = operating income + D&A; net debt = borrowings ex leases − cash.</div>';
}
// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function aScChipNote(p){
  if(!aScNum(p.epsT)&&!aScNum(p.ebitdaT)&&!aScNum(p.epsF)&&!aScNum(p.ebitdaF)) return 'no figures on file';
  if(!aScNum(p.px)) return 'no live price';
  if(A_SC.basis==='f' && !aScNum(A_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!aScNum(aScMult(p))) return A_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function aScChipsOne(wrap){
  var box=wrap.querySelector('.tsm-sc-chips'); if(!box||!A_SC.peers) return;
  var keep=box.querySelector('.tsm-sc-addtk'); var typed=keep?keep.value:'';
  var h=A_SC.peers.map(function(p,i){ var nt=aScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="tsm-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="tsm-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.tsm-sc-addtk'); if(inp) inp.value=typed;
}
function aScRenderAll(root){ root.querySelectorAll('.tsm-sc').forEach(function(w){ aScRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  aScReset();
  root.querySelectorAll('.tsm-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.tsm-sc-tblh'), tblB=wrap.querySelector('.tsm-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; aScTableOne(wrap); };
    var g=wrap.querySelector('.tsm-sc-nodes'), tip=wrap.querySelector('.tsm-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ A_SC.basis=btn.getAttribute('data-mgbasis'); aScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ A_SC.metric=btn.getAttribute('data-mgmetric'); aScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.tsm-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  aScRenderAll(root); aScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.tsm-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(A_SC.peers[i]){ A_SC.peers.splice(i,1); aScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.tsm-sc-addbtn'), addIn=wrap.querySelector('.tsm-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!A_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=A_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; A_SC.peers.push(o); }
        else A_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; aScRenderAll(root); aLiveOne(root, tk); };
  }
}
function aScFetchCaps(root){ if(A_SC._capsFetched||!A_SC.peers) return; A_SC._capsFetched=true; A_SC.peers.forEach(function(p){ if(p.tk) aLiveOne(root, p.tk); }); }

// Live market cap (Key Facts cell) via Massive (api.liveQuote). Market data is ALWAYS live — no seeded
// number is ever shown: until the quote arrives the cell says so, and if it fails it says that.
// Massive's market cap for TSM and UMC is per ADR-equivalent (price × common shares ÷ 5), i.e. US$.
// The same quote feeds the peer bubbles: price (P/E), market cap (bubble size) and EV when Massive has one.
function aMcCell(root, txt){ var el=root.querySelector('#tsmMc'); if(el) el.textContent=txt; }
function aLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='TSM') aMcCell(root,'live quote unavailable'); return; }
    var mcB=q.marketCap/1e9;
    (A_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='TSM') aMcCell(root, '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}));
    aScRenderAll(root);
  }).catch(function(){ if(tk==='TSM') aMcCell(root,'live quote unavailable'); }); }

// ═══ Standardized Overview body ═══════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="tsmMc">'+esc(p[1])+'</span>'; }
    else v=esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
// Bars shorter than ~10% can't hold their $ label (amzn.js clips it): the label moves just outside the bar.
function gmmBars(arr){
  return '<div class="ov-mbars">'+arr.map(function(r){
    var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill" style="width:'+Math.max(r[1],1.2)+'%;background:'+r[4]+';">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 revenue <b>$122.4B (+35.9%)</b> in US$. TSMC reports a single segment (foundry), so the same total is shown three ways: by <b>platform</b>, by <b>customer region</b> or by <b>technology node</b>. All three reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="plat">Platform</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Geography</button>'+
    '<button type="button" class="mg-pill" data-gmm="node">Node</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="plat">'+gmmBars(GMM_PLAT)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="gmm-view" data-gmm="node" hidden>'+gmmBars(GMM_NODE)+'</div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: gross margin <b>59.9%</b> · operating margin <b>50.8%</b> · net margin <b>44.6%</b>. HPC went from <b>43% of revenue in 2023 to 58% in 2025</b>, and <b>74% of wafer revenue</b> now comes from 7nm and below. '+
    '<span class="ave-subh-note">Source: TSMC FY2025 Form 20-F (Item 5; revenue note) and 4Q25 earnings presentation (node mix, % of wafer revenue). US$ = the four quarterly US$ revenues TSMC reports, split by the 20-F NT$ shares; node and region shares carry TSMC\'s rounding.</span></div>';
  return h;
}
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function stdProducts(){
  return '<div class="ov-diagram-cap gmm-cap-top"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+A_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}

// The seven blocks (OV-1 … OV-7) and the footer (OV-F) are added here one by one as each unit is
// approved. Nothing is rendered for a block that has not been built.
function stdOverviewBody(c){
  var h='';
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+TSM_LEDE+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How TSMC makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s TSMC', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

function html(c){
  var h='<div class="ov ov-tsm" data-brand="TSM" style="--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="tsmModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="tsmModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="tsmModalT"></div><div class="ov-modal-b" id="tsmModalB"></div></div></div>';
  h+='</div>';
  return h;
}

function wireModal(root){
  var back=root.querySelector('#tsmModalBack'), mT=root.querySelector('#tsmModalT'), mB=root.querySelector('#tsmModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#tsmModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  // Hoisted to #co-detailview, so tab switches must close it (wireDD calls this once the Deep Dive exists).
  root._tsmCloseModal=closeM;
  function resolve(key){
    // One branch per detail type (prod:, hist:, exec: …) is added with the unit that uses it.
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:esc(t.y),h:t.d}:null; }
    if(kind==='ce'){ return tsmCePop(id); }   // Evolution ▸ Earnings "?" pop-ups
    if(kind==='splc'){ return tsmSplcPop(id); }   // Bottom Line ▸ Supply Chain cards
    if(kind==='exec'){ return tsmTrackPop(id); }   // Management ▸ Track Record cards
    if(kind==='prod'){ var f=A_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div class="prod-item"><div class="prod-item-n">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd prod-lead">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  if(!root._tsmDetailWired){
    root._tsmDetailWired=true;
    root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
  }
}

function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  // Collapsible sections (OV-4 … OV-7)
  root.querySelectorAll('.ov-tsm .ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Money-map accordions (OV-4)
  root.querySelectorAll('.ov-tsm .acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Money-map view toggle (Platform ⇄ Geography ⇄ Node) — the active pill is a class (css/overview.css)
  root.querySelectorAll('.ov-tsm .mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.ov-tsm .mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-tsm .gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  root.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='tsmModalBack') m.remove(); });
  var md=root.querySelector('#tsmModalBack'); if(md && md.parentNode!==root) root.appendChild(md);
  // Peer map (pure SVG, so it builds fine inside a closed collapsible); fetches every peer's live quote once
  var capsAlready=A_SC._capsFetched;
  wireScatters(root);
  // Live market cap (Key Facts cell). On the first open TSM's quote comes with the peers' (TSM is in the
  // list); on a re-open the peer quotes are not re-fetched, so the Key Facts cell asks for its own.
  if(capsAlready) aLiveOne(root, 'TSM');
}

// ═══ Deep Dive ═══════════════════════════════════════════════════════════════════════════════
// Copied from amzn.js (deepDiveHtml / wireDD / aBuildSub / deepDiveInit). Sections and sub-tabs are added
// only when their unit is approved (playbook rule 5: nothing empty on show), so the spine fills in over
// time in the fixed order Top Line · Bottom Line · Evolution · Valuation · Management (· Miscellaneous).
// Approved so far: Top Line ▸ General · Segments · Other · Customers (TL-*), Evolution ▸ Results (EV-RES);
// Evolution ▸ Earnings (EV-SET, EV-POST, EV-NOTES); Bottom Line ▸ General (BL-GEN) · Supply Chain (BL-SPLC);
// Valuation ▸ Historic Multiple (VA-HIST); Peers (VA-PEERS);
// Target Multiple (VA-TM); Sensitivity (VA-SENS);
// Management ▸ Executives & Board (MG-TEAM); Ownership (MG-OWN); Governance & SBC (MG-GOV); Track Record (MG-TRACK).
function deepDiveHtml(c){
  var h='<div class="ov ov-tsm ov-tsm-dd" data-brand="TSM" style="--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segov">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segdrv">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segoth">Other</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segcus">Customers</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segov">'+segmentsOverviewHtml('TSM')+'</div>'+
      '<div class="ovt-subpane" data-ovst="segdrv" hidden>'+segmentsHtml('TSM')+'</div>'+
      '<div class="ovt-subpane" data-ovst="segoth" hidden>'+segmentsOtherHtml('TSM')+'</div>'+
      '<div class="ovt-subpane" data-ovst="segcus" hidden>'+segmentsCustomersHtml('TSM')+'</div>'+
    '</div>';
  // Bottom Line: General only. Segments does not apply (one operating segment, 20-F Note 38; no profit by
  // platform) — playbook §13 BL-SEG ⏭️.
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="margins">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="supplychain">Supply Chain</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="margins">'+tsmBlGeneralHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="supplychain" hidden>'+tsmSplcBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+tsmCeHtml(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('TSM')+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="histmult">Historic Multiple</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="targetmult">Target Multiple</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="sensitivity">Sensitivity</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="histmult">'+tsmHistMult.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+valuationPeersBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="targetmult" hidden>'+tsmTargetMult.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="sensitivity" hidden>'+tsmSens.body()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives &amp; Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance &amp; SBC</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+TSM_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden>'+tsmOwnBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+tsmGovBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+tsmTrackBody()+'</div>'+
    '</div>';
  h+='</div>';
  return h;
}
// Lazy chart builds per Deep Dive pane / sub-tab (Chart.js needs a non-null offsetParent).
function aBuildSub(root, dd, key){
  if(dd==='topline'){
    if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'TSM'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'TSM'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'TSM'); });
    else requestAnimationFrame(function(){ initSegmentsOverview(root, 'TSM'); });
  }
  if(dd==='bottomline'){
    if(key==='supplychain') requestAnimationFrame(tsmSplcBuild);
    else requestAnimationFrame(tsmBlGeneralBuild);
  }
  if(dd==='mgmt'){
    if(key==='ownership') tsmOwnInit(root);
  }
  if(dd==='valuation'){
    if(key==='histmult' || key==null) requestAnimationFrame(function(){ tsmHistMult.init(root); });
    if(key==='peers') requestAnimationFrame(function(){ wireScatters(root); });
    if(key==='targetmult') requestAnimationFrame(function(){ tsmTargetMult.init(root); });
    if(key==='sensitivity') requestAnimationFrame(function(){ tsmSens.init(root); });
  }
  if(dd==='evolution'){
    if(key==='earnings' || key==null) tsmCeBuild(root);
    if(key==='results') requestAnimationFrame(function(){
      initResults(root.querySelector('.ov-tsm-dd .ovt-subpane[data-ovst="results"] .rs-wrap'), 'TSM'); });
  }
}
// Keep the clicked tab where it was on screen when the pane below it changes height.
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
function wireDD(root){
  function shutModal(){ if(root._tsmCloseModal) root._tsmCloseModal(); }
  root.querySelectorAll('.ov-tsm-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    shutModal();
    root.querySelectorAll('.ov-tsm-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-tsm-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    var pane=root.querySelector('.ov-tsm-dd .dd-pane[data-dd="'+key+'"]');
    var act=pane?pane.querySelector('.ovt-subtab.active'):null;
    aBuildSub(root, key, act?act.getAttribute('data-ovst'):null);
  }; });
  // Sub-tabs, pane-scoped, with the anti-scroll-jump anchor.
  root.querySelectorAll('.ov-tsm-dd .dd-pane').forEach(function(pane){
    var dd=pane.getAttribute('data-dd');
    var SUB=':scope > .ovt-subtabs > .ovt-subtab';
    pane.querySelectorAll(SUB).forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-ovst');
      shutModal();
      ceKeepPos(btn, function(){
        pane.querySelectorAll(SUB).forEach(function(b){ b.classList.toggle('active', b===btn); });
        pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
      });
      aBuildSub(root, dd, key);
    }; });
  });
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root);
  wireModal(root);   // re-run so the delegated [data-detail] handler covers the Deep Dive DOM
  TSM_MGMT.init(root);   // the Executives & Board CV modal (makeManagement), as amzn.js deepDiveInit does
  tsmCeWire(root);   // Earnings: phase tabs · quarter pills · estimate toggles · Notes (theme record + ✎ editor)
  if(!root._rsCollapWired){ root._rsCollapWired=true;   // rule 3: the table dropdown under each chart
    // Headers that already toggle themselves (the engines) are skipped — toggling them here too would
    // flip the panel twice, so a click on the button text would appear to do nothing.
    var SELF='[data-selfwired],[data-hmtblb],[data-tmtblb],[data-pegtblb],[data-sgtblb],[data-sgdrill],[data-sgnote],'+
      '[data-rsevrecb],[data-rsevdetb],[data-rssurptblb],[data-rsconvtblb],[data-rscurvetblb]';
    root.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h'):null; if(!h||!root.contains(h)) return;
      if(h.matches(SELF)) return;
      var b=h.nextElementSibling; if(!b||!b.classList.contains('rs-collap-b')) return;
      if(/^rsTableBody-/.test(b.id||'')) return;   // results.js owns its own Period-detail tables
      var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  // Build whatever is actually visible.
  requestAnimationFrame(function(){
    var pane = root.querySelector('.ov-tsm-dd .dd-pane:not([hidden])');
    var dd = pane ? pane.getAttribute('data-dd') : 'topline';
    var sub = pane ? pane.querySelector('.ovt-subtab.active') : null;
    aBuildSub(root, dd, sub ? sub.getAttribute('data-ovst') : null);
  });
}

export var tsmOverview = { html: html, init: init, headerSources: ceHeaderSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
