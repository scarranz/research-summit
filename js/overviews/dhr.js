// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Danaher Corporation (NYSE: DHR) — company Overview + Deep Dive.
// Built on the AMZN layout (js/overviews/amzn.js): a standardized Overview (Key Facts · lede ·
// 2x2 · how it makes money · products · peers · timeline) plus a six-tab Deep Dive.
//
// SOURCES, per docs/OVERVIEW_CONVENTIONS.md §2 (official first):
//   S1  FY2025 Form 10-K / Annual Report (SEC EDGAR, CIK 0000313616) — Item 1 Business, human
//       capital, materials, regulation, and the FY25/FY24 financial highlights.
//   S2  Q2 2026 earnings press release, 21-Jul-2026 (investors.danaher.com).
//   S3  Q2 2026 earnings presentation — segment P&L, growth bridges, guidance.
//   S4  Q2 2026 earnings call transcript, 21-Jul-2026.
//   S5  danaher.com/about-danaher — the company's own corporate lineage (1984 founding, DBS 1988,
//       and the Fortive / Envista / Veralto separations).
//   S6  stockanalysis.com, pulled 26-Aug-2026 — peer multiples and revenue growth ONLY.
//       Market caps on the peer map are LIVE (Massive, via api.liveQuote).
//
// ⚠ THE SIGN CONVENTION — read this before touching any growth number.
// Danaher prints TWO OPPOSITE sign conventions in the same release. In the growth-bridge tables
// ("Sales Growth by Segment") the printed values are RECONCILING amounts:
//        Total + Acquisitions_printed + FX_printed = Core
// so a printed "(1.0)%" for FX means FX ADDED 1.0pp to reported growth. Verified against all 14
// published rows and against Q2'26 deck slide 3 (Revenue +5.5% / Core +3.0% / Acq +1.5% / FX
// +1.0%). The "Other Forward-Looking Information" table uses direct contribution signs instead.
// Every FX figure in this file is stated in PLAIN reading (tailwind = positive). Do not "fix" it.
//
// NOT here, because it is not yet sourced: FY2025 segment operating profit, revenue history before
// FY2024, the post-Masimo balance sheet (so no net debt and no EV multiple of our own), the board,
// ownership, and any acquisition purchase price. Those land with the Q2'26 10-Q and the full 10-K
// pull. Working material lives in danaher-research/ (local only).
// ═══════════════════════════════════════════════════════════════════════════════════════════════

import { dhrBottomLineHtml, dhrBottomLineInit } from './dhr-bottomline.js';
import { dhrBlSegmentsHtml, dhrBlSegmentsInit } from './dhr-bl-segments.js';
import { dhrMiscOtherHtml, dhrMiscOtherInit } from './dhr-misc-other.js';
// Executives & Board is the SHARED mold (js/overviews/management.js, used by 7 companies);
// Ownership, Governance & SBC and Track Record are bespoke, exactly as they are for Amazon.
import { dhrMgmtTeamHtml, dhrMgmtOwnHtml, dhrMgmtGovHtml, dhrMgmtTrackHtml,
         dhrMgmtTeamInit } from './dhr-management.js';
// Top Line is the shared segments engine, not a bespoke pane: js/segments.js renders all four
// sub-tabs from js/segments-data/dhr.js (which points at js/results-data/dhr.js for the series).
import { segmentsHtml, initSegments, segmentsOverviewHtml, initSegmentsOverview,
         segmentsOtherHtml, initSegmentsOther,
         segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';
// Evolution ▸ Results and ▸ Estimates are the shared engine (js/results.js), driven entirely by
// js/results-data/dhr.js. Nothing bespoke: the picker, the presets, the drag-zoom, the slider,
// the legend chips, the tables and the surprise scorecard all come from the dataset.
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
// Evolution ▸ Earnings — the Call Prep pane (docs/EARNINGS_CONVENTIONS.md §6). Its own module
// because it is ~700 lines of its own, and because it reads the Results dataset rather than
// re-hardcoding a single number.
import { dhrCallPrepHtml, dhrCallPrepInit } from './dhr-callprep.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Danaher palette — corporate blue, with a distinct hue per reportable segment.
var BRAND='#0F7DC2', BRAND2='#1E3A5F', TEAL='#12A8A0', GRAY='#9AA4B0';

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'&#9662;':'&#9656;')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══ DATA — Overview ═══════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5x2). IPO is deliberately NOT one of them: no IPO date appears in the
// FY2025 10-K or on Danaher's own site, and conventions §4.1 says substitute the next most
// relevant fact rather than print a hole. Recurring revenue takes the slot — it is the single most
// defining number about how this company earns.
var STD_FACTS=[
  ['Listing','NYSE: DHR'],
  ['HQ','Washington, DC, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1984 &middot; Steven &amp; Mitchell Rales'],
  ['CEO','Rainer M. Blair &middot; President &amp; CEO'],
  ['Employees','~60,000 &middot; Dec 2025'],
  ['Dividend','Payer'],
  ['Recurring revenue','82% of FY2025 sales'],
  ['Market cap','live'],
];

var DHR_LEDE='Danaher supplies the instruments, consumables and services used to develop and manufacture biologic medicines, to run laboratory research, and to diagnose patients in hospitals and clinics. It operates as a group of more than 15 operating companies with facilities in roughly 50 countries, assembled over four decades of acquisitions and separations and run on a single common management system.';

// 2x2 quadrant — each cell <= ~30 words.
var STD_BIZ=[
  ['What it sells','Bioprocessing equipment and consumables for making biologic drugs; laboratory instruments (mass spec, microscopy, flow cytometry) and their reagents; clinical analysers and the cartridges they consume; industrial filtration.'],
  ['Who buys it','Pharma and biotech manufacturers, CDMOs and CROs, universities and research institutes, hospitals, physicians&#39; office labs, reference labs, blood banks. Plus semiconductor fabs, aerospace and refineries for filtration.'],
  ['How it earns','Instruments are placed; the consumables, reagents, cartridges and service contracts are reordered for the life of the platform. FY2025: <b>82% of revenue recurring</b> &mdash; Diagnostics 89%, Biotechnology 88%, Life Sciences 66%.'],
  ['The edge','The <b>Danaher Business System</b> &mdash; the operating discipline every company runs on, and the integration playbook on every acquisition. Plus regulatory lock-in: once a resin is written into a filed process, switching means re-filing it.'],
];

// ─── How it makes money — FY2025. Two views of the SAME total; both reconcile to $24,568M.
// Segments use the company's own rounded presentation ($7.3 + $7.3 + $10.0 = $24.6B); the
// percentages inherit that rounding. Geography is disclosed as PERCENT OF SALES only — Danaher
// publishes no revenue dollars by region, so that view carries no dollar column rather than an
// invented one.
var GMM_SEG=[
  ['Diagnostics', 40.7, '$10.0B', '41%', BRAND2],
  ['Biotechnology', 29.7, '$7.3B', '30%', BRAND],
  ['Life Sciences', 29.7, '$7.3B', '30%', TEAL],
];
// [label, bar width %, text inside the bar, text to the right, colour, muted note beside the label]
var GMM_GEO=[
  ['North America', 42, '42%', '', BRAND, 'US alone 41%'],
  ['High-growth markets', 29, '29%', '', TEAL, 'China ~11%'],
  ['Western Europe', 24, '24%', '', BRAND2, ''],
  ['Other developed', 5, '5%', '', GRAY, 'Japan, Australia, NZ'],
];
var REV_DEFS=[
  { seg:'Biotechnology &mdash; the drug factory',
    desc:'Sells the tools used to develop and manufacture biological medicines: monoclonal antibodies, insulin, vaccines, and cell, gene and mRNA therapies. The brands are <b>Cytiva</b> and <b>Pall</b>. Two businesses sit inside it &mdash; <b>bioprocessing</b> (cell-line and media development, culture media, buffers, chromatography resins, filtration, aseptic fill-finish, single-use hardware, whole manufacturing suites) and <b>discovery &amp; medical</b> (lab filtration and purification, protein purification, reagents and membranes). Danaher does not make the drug; it supplies almost everything the drug maker needs to run the factory, for the life of the product. Once a resin is written into a filed manufacturing process, switching supplier means re-filing it &mdash; that is what management means by being specced in.',
    econ:[['FY2025 revenue','$7.3B'],['Q2&#39;26 revenue','$1,920M &middot; 1H $3,717M'],['Q2&#39;26 adj. operating margin','41.0% &mdash; the highest of the three'],['Core growth','+6.5% FY25 &rarr; +7.0% Q1&#39;26 &rarr; +2.5% Q2&#39;26'],['Recurring mix','88%']],
    econNote:'The Q2&#39;26 slowdown is shipment timing, not demand: more than $100M of chromatography-resin shipments moved into 2027 at customer request. Orders grew mid-teens in the same quarter.' },
  { seg:'Life Sciences &mdash; the bench upstream of the factory',
    desc:'Sells the instruments and consumables used to study DNA, RNA, proteins and cells, long before a drug exists. Instruments: <b>SCIEX</b> mass spectrometry, <b>Leica Microsystems</b>, <b>Beckman Coulter Life Sciences</b> flow cytometry and lab automation, <b>Molecular Devices</b>. Consumables: <b>IDT</b> custom oligonucleotides, <b>Abcam</b> antibodies and assays, <b>Aldevron</b> plasmid DNA and mRNA, <b>Phenomenex</b> columns. And one business with nothing to do with healthcare: <b>Pall</b> industrial filtration for semiconductor fabs, aerospace, refineries and food and beverage. Instruments are capital purchases a lab makes once and then not again for years, which is why this segment carries the lowest recurring mix and feels the research-budget cycle first.',
    econ:[['FY2025 revenue','$7.3B'],['Q2&#39;26 revenue','$1,879M &middot; 1H $3,616M'],['Q2&#39;26 adj. operating margin','21.0%'],['Core growth','&minus;1.5% FY25 &rarr; +0.5% Q1&#39;26 &rarr; +5.5% Q2&#39;26'],['Recurring mix','66% &mdash; the lowest of the three']],
    econNote:'Q2&#39;26 was its strongest quarter in several years, yet FY26 is guided to +3.0&ndash;4.0% &mdash; below the rate it just printed. Management attributes the step-down to Pall project timing.' },
  { seg:'Diagnostics &mdash; the hospital',
    desc:'Sells clinical instruments, consumables, software and services to hospitals, physicians&#39; offices, reference labs and critical-care settings. <b>Beckman Coulter Diagnostics</b> runs high-volume blood chemistry and immunoassay plus lab automation; <b>Cepheid</b> is the GeneXpert cartridge platform that returns a molecular answer without a molecular lab; <b>Radiometer</b> and <b>HemoCue</b> cover bedside and emergency testing; <b>Leica Biosystems</b> and <b>Mammotome</b> cover the cancer-tissue workflow. <b>Masimo</b>, the patient-monitoring business, joined this segment in June 2026. Razor-and-blades in its purest form at Danaher: place the instrument, then sell the blades for a decade.',
    econ:[['FY2025 revenue','$10.0B &mdash; the largest segment'],['Q2&#39;26 revenue','$2,466M &middot; 1H $4,883M'],['Q2&#39;26 adj. operating margin','24.5%'],['Core growth','+1.5% FY25 &rarr; &minus;4.0% Q1&#39;26 &rarr; +2.0% Q2&#39;26'],['Core ex-respiratory','+5.0% Q2&#39;26 &middot; +4.0% 1H26'],['Recurring mix','89% &mdash; the highest of the three']],
    econNote:'Three things move this headline at once: a shrinking respiratory-testing comparison (~$1.9B FY25 &rarr; ~$1.6B FY26E), a China procurement headwind that is fading, and the Masimo acquisition. Core ex-respiratory is the cleanest read on the underlying business.' },
  { seg:'The revenue lines &mdash; recurring vs the instrument',
    desc:'Danaher cuts the same total a second way: what is bought once against what is reordered forever. An analyser or a bioreactor is placed with a customer; the cartridges, reagents, resins, media and service contracts that follow are the business. This is why the company describes itself through its <b>recurring</b> share rather than through unit sales &mdash; and why an instrument-heavy segment behaves very differently in a downturn from a consumable-heavy one.',
    econ:[['Total company','82% recurring &middot; 18% non-recurring'],['Diagnostics','89% recurring'],['Biotechnology','88% recurring'],['Life Sciences','66% recurring']],
    econNote:'Percentages of FY2025 sales, as published. Danaher does not disclose recurring revenue in dollars, nor a growth rate for either half &mdash; at group or segment level.' },
];

// ─── Products — family card -> pop-up with the specific products (key = prod:i).
var D_PRODUCTS=[
  { ic:'&#129514;', fam:'Bioprocessing &mdash; upstream', d:'Growing the drug inside living cells.', items:[
    ['Xcellerex X-platform single-use bioreactors','New 500L and 2,000L formats launched in FY25. Higher yield and lower cost per batch &mdash; and they pull the customer into Cytiva&#39;s disposable-bag ecosystem for the life of the platform.'],
    ['ReadyToProcess mixers and mixer bags','Single-use mixing. The bag reorders are the revenue, not the hardware.'],
    ['Cell culture media, process liquids and buffers','The food the cells eat. Pure consumable &mdash; volume scales with the customer&#39;s production volume.'],
    ['Cell line and media development services','Sold early in a program. The entry point that gets Cytiva specced in before commercial scale.'] ]},
  { ic:'&#128167;', fam:'Bioprocessing &mdash; downstream', d:'Purifying it and filling it sterile.', items:[
    ['Chromatography resins (MabSelect SuRe, PrismA X)','Protein A resins that grab the drug molecule and let everything else wash past. A single shipment runs $10&ndash;30M &mdash; the highest-value consumable in the segment, and the line at the centre of the Q2&#39;26 push-out.'],
    ['Filtration technologies','Sterile and clarifying filtration through the purification train. Recurring by design.'],
    ['Aseptic fill-finish','Final sterile filling. Regulatory validation makes it sticky.'],
    ['Manufacturing suite design and installation','Turnkey build-outs. Lumpy and capex-linked &mdash; the visible tip of the onshoring cycle management describes.'] ]},
  { ic:'&#128300;', fam:'Laboratory instruments', d:'Capital equipment for the research bench.', items:[
    ['SCIEX ZenoTOF 8600','Mass spectrometer claiming up to 30x the sensitivity of prior platforms. Sensitivity is the competitive axis in mass spec.'],
    ['SCIEX novus V55','AI-enabled triple quadrupole launched at ASMS in June 2026 &mdash; higher throughput, lower operating cost.'],
    ['Beckman CytoFLEX + Mosaic module','Spectral flow cytometry with machine learning for characterising complex cell populations.'],
    ['Leica STELLARIS confocal','Live-sample imaging workflows.'],
    ['Beckman lab automation','The Q2&#39;26 growth line, positioned for autonomous-lab and AI-enabled drug discovery build-outs.'] ]},
  { ic:'&#129516;', fam:'Research consumables', d:'What the instruments eat.', items:[
    ['IDT oligonucleotides and gene fragments','Custom DNA and RNA made to order for sequencing, CRISPR, qPCR and RNAi. Minimal-residual-disease testing led its Q2&#39;26 growth.'],
    ['Abcam antibodies, reagents and assays','Detect one specific protein reliably. Best quarter since acquisition in Q2&#39;26; diversifying from academic toward biopharma.'],
    ['Aldevron plasmid DNA, mRNA and proteins','Raw material for gene and cell therapy manufacturing.'],
    ['Phenomenex columns and media','Separation consumables for analytical labs.'] ]},
  { ic:'&#127973;', fam:'Clinical lab diagnostics', d:'The hospital workhorses.', items:[
    ['Beckman DxI 9000 immunoassay analyser','Menu expansion is the growth lever &mdash; each added assay raises pull-through per installed instrument.'],
    ['Access p-tau217 assays','Blood-based Alzheimer&#39;s biomarker testing on the DxI 9000 (CE-marked, plus a research-use version). Puts Beckman into neurodegenerative diagnostics.'],
    ['Beckman DxA 5000','Lab automation track systems that move samples with no human handling.'],
    ['Cardiac and blood-virus menus','FY25 expansions sold onto the installed base.'] ]},
  { ic:'&#128137;', fam:'Molecular diagnostics', d:'An answer in the room.', items:[
    ['Cepheid GeneXpert','Sealed-cartridge molecular testing that needs no molecular lab and no trained staff. Razor-and-blades in its purest form.'],
    ['Xpert Multiplex GI panel','Recent menu expansion, named as a Q2&#39;26 driver alongside key account wins at large hospital networks.'],
    ['Respiratory panels','~$1.9B in FY25, guided to ~$1.6B in FY26E. The single largest swing factor in Danaher&#39;s reported growth rate &mdash; and outside management control.'],
    ['Xpert Hemorrhagic Fever panel','Deployed in the DRC and Uganda Ebola response in Q2&#39;26 by donation, not commercial sale.'] ]},
  { ic:'&#128269;', fam:'Pathology &amp; tissue', d:'The cancer-diagnosis workflow.', items:[
    ['Leica Biosystems','The full anatomical pathology workflow, from specimen to stained slide.'],
    ['Aperio digital pathology + AI store','AI algorithms for speed and accuracy in reading tissue images.'],
    ['StatLab (announced Jul 2026)','Histology consumables from collection through staining. ~$250M FY25 revenue, more than 85% recurring &mdash; turns Leica from an instrument vendor into a full-workflow supplier.'],
    ['Mammotome','Breast biopsy and tissue localisation.'] ]},
  { ic:'&#9881;', fam:'Industrial filtration (Pall)', d:'The non-healthcare business.', items:[
    ['Microelectronics filtration','Highly purified process chemistries for semiconductor and memory fabs. Grew above 10% in Q2&#39;26 and led Pall. A new Singapore plant is in start-up.'],
    ['Aerospace and energy','Jet engines, refineries, power-generation turbines, petrochemicals.'],
    ['Food and beverage','Product quality and safety, lower operating cost, less waste.'] ]},
];

// ─── Timeline — corporate lineage. Genesis and the three separations are the company's own
// account (danaher.com/about-danaher); acquisition years are from the FY2025 10-K Item 1. NO
// purchase price appears in either source, so none is printed — see the closing note in the UI.
var TIMELINE=[
  { y:'1984', t:'<b>Genesis:</b> brothers <b>Steven and Mitchell Rales</b> found Danaher &mdash; not as a product company, but as a vehicle for buying industrial businesses and improving them.',
    d:'<ul class="ov-bullets"><li>The company&#39;s own framing: a business "dedicated to continuous improvement and customer satisfaction," built by acquisition from the start.</li><li>The FY2025 10-K puts the origin in the early 1980s and describes a company that "evolved over time into the science and technology innovator it is today" through <b>a series of acquisitions and divestitures</b>. That is the lineage: a roll-up, not an organically grown operating company.</li><li>Through the 1990s it became a broad industrial conglomerate &mdash; tools, instrumentation, controls. Almost none of that is inside Danaher today.</li></ul>' },
  { y:'1988', t:'<b>The Danaher Business System is created</b> &mdash; the operating discipline that becomes the company&#39;s real product.',
    d:'<ul class="ov-bullets"><li>DBS is what survives every portfolio change. The 10-K states it plainly: "While the operating companies that make up Danaher have changed over time, DBS continues to be the guiding philosophy."</li><li>Four tool pillars &mdash; <b>Growth, Lean, Leadership, DBS Fundamentals</b> &mdash; applied daily inside every operating company.</li><li>It is also the M&amp;A thesis: buy a good business, apply the system, compound the margin. Which is why Danaher is judged on capital deployment more than on any single product.</li></ul>' },
  { y:'2004&ndash;06', t:'<b>The pivot to healthcare begins:</b> <b>Radiometer</b> (2004) establishes diagnostics, <b>Leica Microsystems</b> (2005) establishes life sciences, Vision Systems (2006) extends diagnostics.',
    d:'<ul class="ov-bullets"><li>Radiometer becomes the acute-care platform &mdash; blood gas, electrolytes, cardiac markers &mdash; still a growth line twenty years later.</li><li>Leica Microsystems becomes the microscopy platform.</li><li>These are the first bricks of the company that exists today. At the time they sat inside a mostly industrial portfolio.</li></ul>' },
  { y:'2010&ndash;14', t:'<b>Platform build-out:</b> AB Sciex and Molecular Devices (2010), <b>Beckman Coulter</b> (2011), Iris International and Aperio (2012), HemoCue (2013), Devicor (2014).',
    d:'<ul class="ov-bullets"><li><b>Beckman Coulter</b> is the pivotal one &mdash; the only acquisition the 10-K credits to <b>two</b> segments, supplying flow cytometry and lab automation to Life Sciences and the clinical lab line to Diagnostics.</li><li>AB Sciex becomes SCIEX, the mass spectrometry platform.</li><li>Aperio is the origin of the digital pathology franchise still being extended in FY25 through Aperio HALO AP and the AI store.</li><li>Devicor becomes Mammotome.</li></ul>' },
  { y:'2015&ndash;16', t:'<b>Pall (2015) creates the Biotechnology segment</b> and the bioprocessing business; <b>Cepheid (2016)</b> creates molecular diagnostics.',
    d:'<ul class="ov-bullets"><li>Pall is the pivot into bioprocessing &mdash; and simultaneously supplies the industrial filtration business that still sits inside Life Sciences today.</li><li>Cepheid brings GeneXpert, the cartridge platform that carries <b>all</b> of Danaher&#39;s respiratory testing revenue &mdash; the line that would swing the company&#39;s reported growth rate through COVID and ever since.</li><li>Also 2015: Siemens&#39; clinical microbiology business. Also 2016: Phenomenex.</li></ul>' },
  { y:'2016', t:'<b>Separation #1: Fortive</b> is spun off &mdash; the industrial and dental businesses leave.',
    d:'<ul class="ov-bullets"><li>The first of three separations that turn a diversified industrial conglomerate into a life-sciences company.</li><li>Fortive takes the test &amp; measurement, industrial technologies and transportation businesses &mdash; effectively the original Danaher.</li></ul>' },
  { y:'2018&ndash;23', t:'<b>The consumables build:</b> IDT (2018), <b>Cytiva (2020)</b>, Aldevron (2021), Abcam (2023).',
    d:'<ul class="ov-bullets"><li><b>Cytiva</b> transforms bioprocessing scale and makes Biotechnology the segment it is today. The 10-K states only "the acquisition of Cytiva in 2020" &mdash; it names neither the seller nor the price.</li><li>IDT, Aldevron and Abcam are the reorder stream: oligos, plasmid DNA, antibodies. Together they pull Life Sciences away from pure instrument cyclicality.</li><li>Abcam delivered its best quarter since acquisition in Q2&#39;26.</li></ul>' },
  { y:'2019', t:'<b>Separation #2: Envista</b> &mdash; the remaining dental businesses leave.' },
  { y:'2023', t:'<b>Separation #3: Veralto</b> &mdash; Environmental &amp; Applied Solutions leaves, completing the transformation into a pure life-sciences and diagnostics company.',
    d:'<ul class="ov-bullets"><li>Separation completed <b>30-Sep-2023</b>; Veralto began regular-way NYSE trading as <b>VLTO</b> on 2-Oct-2023.</li><li>Danaher&#39;s own words: with Veralto gone it "completed its transformation to a science and technology leader."</li><li>Read the three separations together: over seven years Danaher sold or spun out nearly everything it was founded on. What is left is the highest-margin, most recurring end of the portfolio &mdash; and a company with far fewer places to hide when one segment stalls.</li></ul>' },
  { y:'2025', t:'<b>Leadership turns over:</b> <b>Matt Gugino</b> becomes CFO after roughly two decades of Matt McGrew; five new executive officers are appointed across 2025 and early 2026.',
    d:'<ul class="ov-bullets"><li>Gugino is an internal appointment &mdash; described as a long-tenured leader across investor relations, finance, M&amp;A and talent development.</li><li>The same year: targeted structural cost actions, mostly G&amp;A; and more than <b>$2B</b> deployed over recent years on bioprocessing capacity in South Carolina, Florida, Utah and Michigan.</li><li>FY2025 closed with core revenue +2%, adjusted EPS +4.5%, and a <b>34th consecutive year</b> of free cash flow exceeding net income.</li></ul>' },
  { y:'Jun 2026', t:'<b>Masimo closes</b> &mdash; the patient-monitoring business joins Diagnostics, ahead of the original schedule.',
    d:'<ul class="ov-bullets"><li>Closed in early June 2026. The original guidance had assumed a year-end close, which is why it added ~$0.07&ndash;0.08 to FY26 adjusted EPS that had been a 2027 number.</li><li>Added <b>+4.0pp</b> to Q2&#39;26 reported Diagnostics growth, plus $108M pretax of purchase-accounting and transaction charges booked in the same segment.</li><li>Financed with incremental debt &mdash; FY26 guidance carries ~$(310)M of net interest expense against $(170)M of interest expense in 1H26.</li><li><b>The purchase price is not separately stated</b> in the release or the deck. Q2 investing outflow was $(10,147)M and financing inflow $7,273M.</li></ul>' },
  { y:'Jul 2026', t:'<b>StatLab announced</b> by Leica Biosystems &mdash; ~$250M of revenue, more than 85% recurring, expected to close by end-2026.' },
];

// ─── Peers. Multiples and growth: stockanalysis.com, pulled 26-Aug-2026 (S6) — trailing and
// forward P/E, trailing EV/EBITDA, TTM revenue growth, and the 3-year forward revenue growth
// forecast. Forward EV/EBITDA is DERIVED (trailing deflated by the forward growth forecast),
// labeled as such in the caption — it is not a quoted figure. The mc values are seeds only; the
// map replaces them with LIVE market caps from Massive on load.
var D_PEERS=[
  { tk:'DHR', n:'Danaher', peT:38.46, peF:24.41, evT:21.75, evF:20.3, gt:4.56, gf:7.40, mc:151, hl:true,
    why:'The subject. Trades with the group on forward earnings while carrying the highest forward growth forecast on the map &mdash; the market is paying for the bioprocessing recovery, not for what was just printed.' },
  { tk:'TMO', n:'Thermo Fisher', peT:34.10, peF:24.14, evT:23.24, evF:21.9, gt:7.23, gf:6.26, mc:234,
    why:'The direct comparable, and the larger company: the same three-way exposure to bioprocessing, lab instruments and diagnostics. Almost the identical forward multiple, so the pair is a view on execution rather than on price.' },
  { tk:'A', n:'Agilent', peT:30.58, peF:24.03, evT:21.91, evF:20.6, gt:8.60, gf:6.54, mc:44,
    why:'Analytical instruments and lab consumables &mdash; overlaps Life Sciences, with no bioprocessing and no clinical diagnostics. The fastest trailing grower here, at the same forward multiple.' },
  { tk:'MTD', n:'Mettler-Toledo', peT:31.55, peF:28.30, evT:23.65, evF:22.5, gt:6.91, gf:5.06, mc:28,
    why:'Precision instruments; the quality compounder of the group. The richest forward multiple on the map against the lowest forward growth forecast &mdash; paid for margin and consistency, not for growth.' },
  { tk:'WAT', n:'Waters', peT:187.12, peF:26.54, evT:31.52, evF:23.6, gt:52.47, gf:33.73, mc:41,
    why:'&#9888; Read forward only. A large combination inside the last twelve months inflates its trailing P/E to 187x and its TTM revenue growth to +52%; neither figure describes the underlying business. Its forward multiple sits with the group.' },
  { tk:'RVTY', n:'Revvity', peT:60.37, peF:22.37, evT:18.75, evF:18.1, gt:4.05, gf:3.85, mc:14,
    why:'Life-science reagents and diagnostics &mdash; the closest small-cap analogue. The cheapest forward earnings multiple among the US names, and the slowest forecast growth: nobody is paying for a recovery here.' },
  { tk:'QGEN', n:'Qiagen', peT:22.05, peF:17.42, evT:13.39, evF:12.8, gt:2.96, gf:4.54, mc:9,
    why:'Sample preparation and molecular diagnostics &mdash; competes with Cepheid directly. The cheapest name on the map on every measure, which is the discount for being the smallest and the least diversified.' },
];

// ═══ Peer scatter ══════════════════════════════════════════════════════════════════════════════
// Ported from the AMZN engine (conventions §4.6): multiple toggle (P/E ⇄ EV/EBITDA, never P/S) ×
// basis toggle (Forward ⇄ Trailing, default Forward), bubble = live market cap, peers removable by
// chip and addable by ticker, and a table under the map carrying everything the map draws.
//
// One change from AMZN: the axes AUTO-SCALE instead of running on fixed maxima. This set contains
// a genuine outlier — Waters' trailing P/E of 187x and +52% TTM growth, both merger-distorted — and
// a fixed axis would either crush the other six names into the left edge or silently clip WAT with
// no signal. dScAxis() caps the axis at a multiple of the MEDIAN, and anything beyond it plots
// pinned at the edge with a "›" marker, so an off-scale value is visibly off-scale.
var D_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };
function dScReset(){ if(!D_SC.peers) D_SC.peers=D_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function dScMult(p){ var key=(D_SC.metric==='pe'?'pe':'ev')+(D_SC.basis==='f'?'F':'T'); return p[key]; }
function dScGrowth(p){ var g=D_SC.basis==='f'?p.gf:p.gt; if(g==null) g=(p.gf!=null?p.gf:p.gt); return g; }
function dScNum(v){ return v!=null && !isNaN(v); }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }
function dScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function dScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
// A "nice" axis maximum: the largest visible value, but never more than capX times the median, so
// one distorted name cannot flatten the rest of the map. Rounded up to a readable step.
function dScAxis(vals, capX, floor){
  var v=vals.filter(dScNum); if(!v.length) return floor;
  var med=dScMedian(v), max=Math.max.apply(null, v);
  var lim=(med!=null)?Math.min(max, med*capX):max;
  lim=Math.max(lim, floor);
  var step=lim>60?10:(lim>25?5:(lim>10?2:1));
  return Math.ceil(lim/step)*step;
}
function dScFmtMult(v){ return dScNum(v)?v.toFixed(1)+'x':'&mdash;'; }
function dScFmtPct(v){ return dScNum(v)?v.toFixed(1)+'%':'&mdash;'; }
function dScFmtMc(v){ return dScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'&mdash;'; }
function dScVsAvg(m, avg){
  if(!dScNum(m)||!dScNum(avg)||avg===0) return '<span class="dsc-nilv">&mdash;</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'dsc-up':'dsc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.dsc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.dsc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.dsc-chip .x{color:var(--mu);font-weight:800}'+
    '.dsc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.dsc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.dsc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#7FC4F0}'+
    '.dsc-tblwrap{overflow-x:auto}'+
    '.dsc-tbl{border-collapse:collapse;width:100%;font-size:12px;margin:4px 0}'+
    '.dsc-tbl th,.dsc-tbl td{padding:7px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.dsc-tbl th:first-child,.dsc-tbl td:first-child{text-align:left}'+
    '.dsc-tbl thead th{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.dsc-tbl td.dsc-m{font-weight:800;color:var(--navy)}'+
    '.dsc-tbl tbody tr.dsc-hl{background:rgba(15,125,194,.07)}'+
    '.dsc-tbl tbody tr.dsc-nil td{color:var(--mu)}'+
    '.dsc-tbl tfoot td{border-top:2px solid var(--bdr);border-bottom:none;font-weight:800;color:var(--navy);background:#F7F9FB}'+
    '.dsc-tbl tfoot tr.dsc-med td{background:#FAFBFC;font-weight:700;color:var(--mu)}'+
    '.dsc-nm{display:inline-flex;align-items:center;gap:7px}'+
    '.dsc-nm img{width:16px;height:16px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.dsc-tk{color:var(--mu);font-weight:700;font-size:10.5px}'+
    '.dsc-up{color:#C0392B;font-weight:700}.dsc-dn{color:#2E8B57;font-weight:700}'+
    '.dsc-nilv{color:var(--mu)}'+
    '</style>';
  h+='<div class="dhr-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="dhr-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="278" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">&larr; cheaper (lower multiple)</text>'+
    '<text x="610" y="278" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive &rarr;</text>'+
    '<text x="346" y="294" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="dhr-sc-xlab">P/E &middot; forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="56" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<text x="80" y="265" font-family="Inter,sans-serif" font-size="9" fill="#A9B2BC" text-anchor="middle" class="dhr-sc-x0">0</text>'+
    '<text x="612" y="265" font-family="Inter,sans-serif" font-size="9" fill="#A9B2BC" text-anchor="middle" class="dhr-sc-xmax"></text>'+
    '<text x="74" y="42" font-family="Inter,sans-serif" font-size="9" fill="#A9B2BC" text-anchor="end" class="dhr-sc-ymax"></text>'+
    '<g class="dhr-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="dsc-chips dhr-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>&times;</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here &mdash; Sartorius Stedim, the closest bioprocessing pure-play, is Euronext-listed and is not in this set. <span class="ave-subh-note">Multiples and growth: stockanalysis.com, 26-Aug-2026. Forward growth is the 3-year forecast CAGR; <b>forward EV/EBITDA is derived</b> (trailing deflated by that forecast), not quoted. Market caps are live.</span></div>';
  h+='<div class="rs-collap dhr-sc-collap">'+
      '<button type="button" class="rs-collap-h dhr-sc-tblh"></button>'+
      '<div class="rs-collap-b dhr-sc-tblb"'+(sfx==='dd'?'':' hidden')+'>'+
        '<div class="rs-tablewrap dsc-tblwrap"><div class="dhr-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip dhr-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function dScRenderOne(wrap){
  var g=wrap.querySelector('.dhr-sc-nodes'); if(!g||!D_SC.peers) return;
  var X0=80, X1=612, Y0=252, Y1=44;
  var on=D_SC.peers.filter(function(p){ return p.on!==false; });
  var maxMult=dScAxis(on.map(dScMult), 2.0, 10);
  var maxG=dScAxis(on.map(dScGrowth), 2.5, 10);
  var lab=wrap.querySelector('.dhr-sc-xlab'); if(lab) lab.textContent=(D_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(D_SC.basis==='f'?'forward':'trailing');
  var xm=wrap.querySelector('.dhr-sc-xmax'); if(xm) xm.textContent=maxMult+'x';
  var ym=wrap.querySelector('.dhr-sc-ymax'); if(ym) ym.textContent=maxG+'%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===D_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===D_SC.metric); });
  // Place the nodes first, then the labels. This peer set clusters hard — DHR, TMO and Agilent sit
  // within 0.4x of each other on forward P/E — so a label drawn at a fixed offset under every
  // bubble is unreadable. Walk left to right and, whenever a label would land on one already
  // placed, push the next one further out (below, then above), so overlapping bubbles still read.
  var placed=[], nodes=[];
  D_SC.peers.forEach(function(p){
    if(p.on===false) return; var m=dScMult(p); if(!dScNum(m)) return;
    var growth=dScGrowth(p);
    var offX=m>maxMult, offY=dScNum(growth)&&growth>maxG;
    nodes.push({ p:p, m:m, growth:growth, offX:offX, offY:offY,
      x:X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0),
      y:Y0-Math.max(0,Math.min(1,(growth||0)/maxG))*(Y0-Y1),
      r:Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)) });
  });
  nodes.sort(function(a,b){ return a.x-b.x; });
  var frag='';
  nodes.forEach(function(nd){
    var p=nd.p, r=nd.r, logo=scLogoUrl(p);
    // Candidate label offsets, in order of preference: under the bubble, further under, above.
    var cands=[r+12, r+25, -(r+8), r+38, -(r+21)], dy=cands[0];
    for(var i=0;i<cands.length;i++){
      var ly=nd.y+cands[i], clash=false;
      for(var j=0;j<placed.length;j++){
        if(Math.abs(placed[j].x-nd.x)<64 && Math.abs(placed[j].y-ly)<12){ clash=true; break; }
      }
      if(!clash){ dy=cands[i]; break; }
    }
    placed.push({ x:nd.x, y:nd.y+dy });
    var off=(nd.offX||nd.offY)?' &#8250; off-scale ('+(nd.offX?dScFmtMult(nd.m):'')+(nd.offX&&nd.offY?' &middot; ':'')+(nd.offY?dScFmtPct(nd.growth):'')+')':'';
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+off+'" transform="translate('+nd.x.toFixed(1)+','+nd.y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:(nd.offX||nd.offY?'#C0392B':'#C7CED6'))+'" stroke-width="'+(p.hl?3:1.5)+'"'+((nd.offX||nd.offY)&&!p.hl?' stroke-dasharray="3 2"':'')+'></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+dy.toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#0F7DC2':'#3A4552')+'" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">'+esc(p.n)+(nd.offX||nd.offY?' ›':'')+'</text></g>';
  });
  g.innerHTML=frag;
  dScTableOne(wrap);
}
function dScChipsOne(wrap){
  var box=wrap.querySelector('.dhr-sc-chips'); if(!box||!D_SC.peers) return;
  var h=D_SC.peers.map(function(p,i){ return '<span class="dsc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">&times;</span></span>'; }).join('');
  h+='<span class="dsc-add"><input class="dhr-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="dhr-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function dScRenderAll(root){ root.querySelectorAll('.dhr-sc').forEach(dScRenderOne); }
// The table under the map — everything the scatter draws, in the units it draws it in. Reads the
// SAME state as the bubbles: the metric/basis pills pick the column, removing a chip drops the row.
// Average and median EXCLUDE Danaher: it is the subject being read against the set, so folding it
// into its own benchmark would shrink the very gap the table exists to show.
function dScTableOne(wrap){
  var box=wrap.querySelector('.dhr-sc-tbl'); if(!box||!D_SC.peers) return;
  var mLab=(D_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(D_SC.basis==='f'?'forward':'trailing');
  var rows=D_SC.peers.map(function(p){ return { p:p, m:dScMult(p), g:dScGrowth(p) }; });
  rows.sort(function(a,b){
    var an=dScNum(a.m), bn=dScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=dScMean(peers.filter(function(r){ return dScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=dScMedian(peers.filter(function(r){ return dScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=dScMean(peers.filter(function(r){ return dScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=dScMedian(peers.filter(function(r){ return dScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return dScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'dsc-hl':'')+(dScNum(r.m)?'':' dsc-nil');
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="dsc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="dsc-tk">'+esc(p.tk)+'</span></span></span></td>'+
      '<td class="dsc-m">'+dScFmtMult(r.m)+'</td>'+
      '<td>'+dScFmtPct(r.g)+'</td>'+
      '<td>'+dScFmtMc(p.mc)+'</td>'+
      '<td>'+dScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="dsc-avg"><td>Peer average <span class="dsc-tk">ex-DHR &middot; '+nM+' names</span></td>'+
      '<td>'+dScFmtMult(avgM)+'</td><td>'+dScFmtPct(avgG)+'</td>'+
      '<td><span class="dsc-nilv">&mdash;</span></td><td><span class="dsc-nilv">&mdash;</span></td></tr>'+
    '<tr class="dsc-med"><td>Peer median <span class="dsc-tk">ex-DHR</span></td>'+
      '<td>'+dScFmtMult(medM)+'</td><td>'+dScFmtPct(medG)+'</td>'+
      '<td><span class="dsc-nilv">&mdash;</span></td><td><span class="dsc-nilv">&mdash;</span></td></tr>';
  box.innerHTML='<table class="dsc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' &middot; '+esc(bLab)+'</th>'+
      '<th>Rev growth &middot; '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.dhr-sc-tblh'), bd=wrap.querySelector('.dhr-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'&#9662;':'&#9656;')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' &middot; '+esc(mLab)+' &middot; '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
function dScChipsAll(root){ root.querySelectorAll('.dhr-sc').forEach(function(w){ dScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  dScReset();
  root.querySelectorAll('.dhr-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.dhr-sc-tblh'), tblB=wrap.querySelector('.dhr-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; dScRenderOne(wrap); };
    var g=wrap.querySelector('.dhr-sc-nodes'), tip=wrap.querySelector('.dhr-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ D_SC.basis=btn.getAttribute('data-mgbasis'); dScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ D_SC.metric=btn.getAttribute('data-mgmetric'); dScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.dhr-sc-svg');
      var nodeOf=function(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; };
      var show=function(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; };
      var move=function(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; };
      var hide=function(){ tip.hidden=true; };
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  dScRenderAll(root); dScChipsAll(root); dScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.dhr-sc-chips .dsc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(D_SC.peers[i]){ D_SC.peers.splice(i,1); dScRenderAll(root); dScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.dhr-sc-addbtn'), addIn=wrap.querySelector('.dhr-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!D_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=D_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; D_SC.peers.push(o); }
      else D_SC.peers.push({ tk:tk, n:tk, on:true, mc:20, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker &mdash; live market cap only. No multiple on file, so it appears in the table and plots once one is added.' });
    }
    addIn.value=''; dScRenderAll(root); dScChipsAll(root); dLiveOne(root, tk); }; }
}
// Live market cap (Key Facts cell + peer bubbles) via Massive (api.liveQuote). Degrades silently.
function dLiveOne(root, tk){
  import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){
    var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return;
    var mcB=q.marketCap/1e9;
    if(D_SC.peers) D_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; });
    if(tk==='DHR'){ var el=root.querySelector('#dhrMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; }
    dScRenderAll(root);
  }).catch(function(){});
}
function dScFetchCaps(root){ if(D_SC._capsFetched||!D_SC.peers) return; D_SC._capsFetched=true; D_SC.peers.forEach(function(p){ if(p.tk) dLiveOne(root, p.tk); }); }

// ═══ Overview body ═════════════════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v=(p[0]==='Market cap') ? '<span id="dhrMc">'+p[1]+'</span>' : p[1];
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function gmmBars(arr){
  return '<div class="ov-mbars">'+arr.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+r[0]+(r[5]?' <span style="color:var(--mu);font-weight:600">'+r[5]+'</span>':'')+'</div>'+
      '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(r[1],1.2)+'%;background:'+r[4]+';">'+r[2]+'</div></div>'+
      '<div class="ov-mbar-v">'+r[3]+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">FY2025 revenue <b>$24,568M (+2.9%)</b> &mdash; the same total, two ways: by <b>segment</b> or by <b>geography</b>. Both reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row" style="display:flex;gap:14px;margin:2px 0 8px"><span class="mg-tog" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)">View: <span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px"><button type="button" class="mg-pill active" data-gmm="seg" style="border:none;background:var(--navy);color:#fff;font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Segments</button><button type="button" class="mg-pill" data-gmm="geo" style="border:none;background:transparent;color:var(--mu);font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+
    '<div class="ave-subh-note" style="margin-top:6px">Segment revenue is the company&#39;s own rounded presentation ($7.3 + $7.3 + $10.0 = $24.6B) against a reported $24,568M. FY2025 operating profit by segment is not disclosed in what we hold &mdash; it lands with the full 10-K.</div></div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+
    '<div class="ave-subh-note" style="margin-top:6px"><b>Percent of sales by geographic destination</b> &mdash; where the final sale to the unaffiliated customer is made. Danaher publishes no revenue dollars by region, and no growth by region, so this view carries percentages only. "High-growth markets" is the company&#39;s own bucket: Eastern Europe, Middle East, Africa, Latin America and Asia except Japan, Australia and New Zealand.</div></div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+r[0]+'</div><div class="ov-row-v">'+r[1]+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note" style="margin-top:6px">'+s.econNote+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+s.seg+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025: operating profit <b>$4,690M (19.1% GAAP margin)</b>, adjusted operating margin <b>28.2%</b> &middot; net earnings from continuing operations <b>$3,600M</b> &middot; free cash flow <b>$5,293M</b> &mdash; the <b>34th consecutive year</b> in which free cash flow exceeded net income. <span class="ave-subh-note">Source: FY2025 Annual Report highlights. The GAAP margin and the growth rate are computed from the two reported figures.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+D_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+f.fam+'</div><div class="stdp-d">'+f.d+'</div><div class="stdp-more">See products &rsaquo;</div></div>';
    }).join('')+'</div>';
}
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more &rarr;</div>':'';
    var cls=t.d?' ov-clickable':'', attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+t.y+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>'+
  '<div class="ave-subh-note" style="margin-top:8px"><b>No purchase price appears anywhere in the sources held</b> &mdash; not in the FY2025 10-K, not on Danaher&#39;s own history page, and not in the Q2&#39;26 release for Masimo. Deal values will be sourced from the relevant 8-Ks before any of them is printed here.</div>';
}
var OV_SOURCES='Sources — Danaher FY2025 Form 10-K / Annual Report (SEC EDGAR, CIK 0000313616) for the business description, employees, geography, revenue mix and FY25/FY24 financials; the Q2 2026 press release, earnings presentation and call transcript (21-Jul-2026) for all Q2/1H figures, segment margins and guidance; danaher.com for the corporate lineage (1984 founding, DBS 1988, the Fortive/Envista/Veralto separations). Peer multiples and revenue growth: stockanalysis.com, 26-Aug-2026 — forward EV/EBITDA is derived, not quoted. Market caps are live (Massive). FX figures are stated in plain reading (tailwind positive), not in the reconciling sign Danaher prints.';

function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND2+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+BRAND2+';border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.dhr-pend{border:1px dashed var(--bdr);border-radius:12px;padding:20px 22px;background:var(--w)}'+
    '.dhr-pend-h{font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px}'+
    '.dhr-pend-s{font-size:11.5px;color:var(--mu);line-height:1.55;margin-bottom:12px}'+
    '.dhr-pend-c{display:grid;grid-template-columns:1fr 1fr;gap:14px}'+
    '@media(max-width:640px){.dhr-pend-c{grid-template-columns:1fr}}'+
    '.dhr-pend-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}'+
    '.dhr-pend-have .dhr-pend-k{color:'+TEAL+'}.dhr-pend-need .dhr-pend-k{color:var(--mu)}'+
    '.dhr-pend ul{list-style:none;padding:0;margin:0}'+
    '.dhr-pend li{font-size:11.5px;color:var(--navy);line-height:1.5;padding:3px 0 3px 14px;position:relative}'+
    '.dhr-pend li:before{content:"";position:absolute;left:0;top:10px;width:5px;height:5px;border-radius:50%;background:var(--bdr)}'+
    '.dhr-pend-have li:before{background:'+TEAL+'}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '</style>';
  // The hook — always visible: Key Facts, description, 2x2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+DHR_LEDE+'</p>';
  h+=stdFourQuad();
  // Everything below defaults collapsed (progressive disclosure).
  h+=collapsible('How Danaher makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — a roll-up that sold everything it was founded on', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

function html(c){
  var h='<div class="ov ov-dhr" data-brand="DHR" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(15,125,194,0.10)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="dhrModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="dhrModalX" aria-label="Close">&times;</button>'+
    '<div class="ov-modal-t" id="dhrModalT"></div><div class="ov-modal-b" id="dhrModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══ DEEP DIVE ═════════════════════════════════════════════════════════════════════════════════
// Staged scaffold, same six-tab spine as AMZN. Content is filled by hand, tab by tab — nothing is
// auto-generated. Each pane states what is ALREADY SOURCED and waiting to be built (it is in the
// handoff at danaher-research/DHR_handoff_export.md) against what still has to be pulled, so the
// next person does not re-derive the inventory.
function ddPending(title, sub, have, need){
  var h='<div class="dhr-pend"><div class="dhr-pend-h">&#128679; '+title+'</div>';
  if(sub) h+='<div class="dhr-pend-s">'+sub+'</div>';
  h+='<div class="dhr-pend-c">';
  h+='<div class="dhr-pend-have"><div class="dhr-pend-k">Sourced &middot; ready to build</div><ul>'+(have.length?have.map(function(x){ return '<li>'+x+'</li>'; }).join(''):'<li>&mdash; nothing yet</li>')+'</ul></div>';
  h+='<div class="dhr-pend-need"><div class="dhr-pend-k">Still to pull</div><ul>'+(need.length?need.map(function(x){ return '<li>'+x+'</li>'; }).join(''):'<li>&mdash;</li>')+'</ul></div>';
  h+='</div></div>';
  return h;
}
function deepDiveHtml(c){
  var h='<div class="ov ov-dhr ov-dhr-dd" data-brand="DHR" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(15,125,194,0.10)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
      '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="tlgen">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tlseg">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tloth">Other</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tlcus">Customers</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="tlgen">'+segmentsOverviewHtml('DHR')+'</div>'+
      '<div class="ovt-subpane" data-ovst="tlseg" hidden>'+segmentsHtml('DHR')+'</div>'+
      '<div class="ovt-subpane" data-ovst="tloth" hidden>'+segmentsOtherHtml('DHR')+'</div>'+
      '<div class="ovt-subpane" data-ovst="tlcus" hidden>'+segmentsCustomersHtml('DHR')+'</div>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="blgen">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="blseg">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="blsc">Supply Chain</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="blgen">'+dhrBottomLineHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="blseg" hidden>'+dhrBlSegmentsHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="blsc" hidden>'+ddPending('Supply chain',
        'Danaher states that <b>no single supplier is material</b>, while noting that some components have only one qualified source.',
        ['Raw materials, supplier concentration language and mitigation, from the 10-K',
         'Manufacturing footprint by segment; ~50 countries',
         'Tariff exposure, and the plan to exclude tariff refunds from core sales starting with the Q3&#39;26 10-Q',
         'Capacity investment: >$2B on bioprocessing; a new Pall plant in Singapore'],
        ['Supplier names, input cost indices, any tariff quantification &mdash; none disclosed. The Q3&#39;26 tariff-refund adjustment will be the first number Danaher has put on it.']) +'</div>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="evearn">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="evres">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="evest">Estimates</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="evearn">'+dhrCallPrepHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="evres" hidden>'+resultsHtml('DHR')+'</div>'+
      // Estimates needs an `evolution` block, which needs a SERIES of dated snapshots. DHR has
      // exactly one (the Aug-2026 Bloomberg export), so resultsEvoHtml returns '' and the pane
      // falls back to a note that says what is missing — the GOOGL pattern. One snapshot is a
      // reading, not an axis; inventing vintages out of it is the one thing that would make this
      // pane lie.
      '<div class="ovt-subpane" data-ovst="evest" hidden>'+(resultsEvoHtml('DHR')||ddPending('Estimates &mdash; how the forecast moved',
        'The vintage view: what the Street and Summit expected for a given period, <b>as of each date</b>. It needs a run of dated snapshots; Danaher has one, so there is nothing to plot a revision against yet. The engine switches this pane on by itself the moment a second vintage lands &mdash; no UI work is needed.',
        ['The Aug-2026 Bloomberg export is archived as the FIRST vintage (<code>danaher-research/bbg/BBG_DHR_2026-08-31.xlsx</code>, gitignored). Its numbers are already live in <b>Results</b>.',
         'Danaher&#39;s own guidance history IS dated and is recorded in <code>js/results-data/dhr.js</code>: FY25 $7.60&ndash;7.75 &rarr; $7.70&ndash;7.80 &rarr; held; FY26 $8.35&ndash;8.50 &rarr; $8.35&ndash;8.55 &rarr; $8.45&ndash;8.60.'],
        ['<b>A second consensus snapshot.</b> DHR is not in <code>BBG_CONSENSUS.txt</code> or <code>Consensus_Portal.xlsm</code> (which carry AMZN, NVDA and UBER as of Aug 2026) &mdash; adding it is a Bloomberg-terminal job, not a code one.',
         '<b>A Summit DCF model.</b> <code>search_ticker(&quot;Danaher&quot;)</code> returns no matches, so there is no projection history and no Summit line anywhere in this tab.',
         'Analyst figures spoken on the Q2&#39;26 call are individual numbers, NOT consensus &mdash; they must never be labelled as such.'])) +'</div>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="valpeers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="valhist">Historic Multiple</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="valtgt">Target Multiple / PEG</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="valsens">Sensitivity</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="valpeers">'+stdPeerScatter('dd')+'</div>'+
      '<div class="ovt-subpane" data-ovst="valhist" hidden>'+ddPending('Where it trades against its own history',
        'Danaher&#39;s multiple against its own 5&ndash;10 year range is the first valuation question, and none of it exists yet.',
        ['Current multiples (26-Aug-2026): 38.5x trailing P/E, 24.4x forward, 21.8x trailing EV/EBITDA, 7.0x EV/Sales',
         'Adjusted EPS $7.80 FY25 actual and $8.45&ndash;8.60 FY26E guided &mdash; the denominators',
         'Share count: 707.6M diluted Q2&#39;26'],
        ['A price history and a multiple history &mdash; neither is in the portal for DHR yet',
         'Cash, therefore net debt, therefore a defensible EV of our own']) +'</div>'+
      '<div class="ovt-subpane" data-ovst="valtgt" hidden>'+ddPending('Target multiple and PEG', '', [], ['Blocked on the historic multiple work above.']) +'</div>'+
      '<div class="ovt-subpane" data-ovst="valsens" hidden>'+ddPending('Sensitivity',
        'The obvious two drivers for Danaher: bioprocessing core growth and the respiratory testing line &mdash; the first is the thesis, the second is the noise nobody controls.',
        ['Respiratory revenue path FY25 actual to FY26E, quarterly',
         'Bioprocessing growth guidance and the push-out that moved it'],
        ['A base-case model to flex. Summit DCF snapshot for DHR is the input.']) +'</div>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="mgteam">Executives &amp; Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="mgown">Ownership</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="mggov">Governance &amp; SBC</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="mgtrack">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="mgteam">'+dhrMgmtTeamHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="mgown" hidden>'+dhrMgmtOwnHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="mggov" hidden>'+dhrMgmtGovHtml()+'</div>'+
      '<div class="ovt-subpane" data-ovst="mgtrack" hidden>'+dhrMgmtTrackHtml()+'</div>'+
    '</div>';

  h+='<div class="dd-pane" data-dd="misc" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="mscap">Capex &amp; Depreciation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="msma">M&amp;A</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="msoth">Other Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="mscap">'+ddPending('Capex and depreciation',
        'One structural detail worth a chart: Diagnostics runs more than double Biotechnology&#39;s depreciation on ~28% more revenue &mdash; exactly what a placed-instrument model looks like on the balance sheet.',
        ['Capex by period: $1,156M FY25, $1,392M FY24, $506M 1H26',
         'Depreciation by segment for Q2 and 1H, both years',
         'Amortisation of acquisition intangibles, guided ~$1,900M FY26'],
        ['FY2025 and prior depreciation &mdash; the XBRL puller closes this',
         'Capex guidance &mdash; Danaher does not guide it']) +'</div>'+
      '<div class="ovt-subpane" data-ovst="msma" hidden>'+ddPending('M&amp;A capacity and criteria',
        'Danaher discloses acquisition criteria only qualitatively &mdash; no financial hurdle, no return threshold, no size criterion.',
        ['Balance-sheet capacity and the stated priorities',
         'StatLab, the only named pending transaction'],
        ['Post-Masimo leverage &mdash; needs the Q2&#39;26 10-Q balance sheet']) +'</div>'+
      '<div class="ovt-subpane" data-ovst="msoth" hidden>'+dhrMiscOtherHtml()+'</div>'+
    '</div>';

  h+='</div>';
  return h;
}

// ═══ Wiring ════════════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#dhrModalBack'), mT=root.querySelector('#dhrModalT'), mB=root.querySelector('#dhrModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#dhrModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=D_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+it[0]+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+f.fam,h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+f.d+'</div>'+body}; }
    return null;
  }
  // Delegated so it also catches [data-detail] nodes rendered later (the Deep Dive DOM).
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  if(!root._dhrDetailWired){
    root._dhrDetailWired=true;
    root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
  }
}
function wireCommon(root){
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.innerHTML=open?'&#9662;':'&#9656;'; }; });
  // Money-map accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Money-map view toggle (Segments <-> Geography)
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ var on=(b===btn); b.style.background=on?'var(--navy)':'transparent'; b.style.color=on?'#fff':'var(--mu)'; });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
}
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  wireCommon(root);
  wireScatters(root);
  dLiveOne(root, 'DHR');   // live market cap into the Key Facts cell
  // Hoist the modal to #co-detailview so it stays reachable from either profile tab.
  var detail=document.getElementById('co-detailview');
  if(detail){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='dhrModalBack') m.remove(); });
    var md=root.querySelector('#dhrModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
// Every built pane wires itself the first time it is actually on screen — Chart.js measures a
// canvas with a null offsetParent as zero and never recovers.
function ensurePane(root, sel, init){
  var pane=root.querySelector(sel);
  if(!pane || pane.hidden || pane._dhrWired) return;
  pane._dhrWired=true;
  init(pane);
}
var DD='.ov-dhr-dd .dd-pane';
var BL_SUB={ blgen:dhrBottomLineInit, blseg:dhrBlSegmentsInit };
function ensureBottomLine(root, key){
  var keys = key ? [key] : Object.keys(BL_SUB);
  keys.forEach(function(k){
    if(!BL_SUB[k]) return;
    ensurePane(root, DD+'[data-dd="bottomline"] .ovt-subpane[data-ovst="'+k+'"]', BL_SUB[k]);
  });
}
function ensureMgmt(root){
  ensurePane(root, DD+'[data-dd="mgmt"] .ovt-subpane[data-ovst="mgteam"]', dhrMgmtTeamInit);
}
// Miscellaneous ▸ Other Analysis is the only sub-pane of that tab with charts so far; Capex and
// M&A are still staged placeholders, so there is nothing to wire for them.
var MS_SUB={ msoth:dhrMiscOtherInit };
function ensureMisc(root, key){
  var fn=MS_SUB[key]; if(!fn) return;
  ensurePane(root, DD+'[data-dd="misc"] .ovt-subpane[data-ovst="'+key+'"]', fn);
}
// Top Line's four sub-panes are the shared segments engine. Each init is scoped to the DD root
// and is re-run on every show — segments.js re-renders its own wrapper on control changes, so it
// must not be treated as a one-shot wiring the way the bespoke panes are.
var TL_SUB={ tlgen:initSegmentsOverview, tlseg:initSegments, tloth:initSegmentsOther, tlcus:initSegmentsCustomers };
function ensureTopLine(root, key){
  var fn = TL_SUB[key || 'tlgen']; if(!fn) return;
  fn(root, 'DHR');
}
function wireDD(root){
  root.querySelectorAll('.ov-dhr-dd .dd-tab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-dd');
    root.querySelectorAll('.ov-dhr-dd .dd-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-dhr-dd .dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
    if(key==='valuation') requestAnimationFrame(function(){ dScRenderAll(root); });
    if(key==='bottomline') requestAnimationFrame(function(){ ensureBottomLine(root, 'blgen'); });
    if(key==='topline') requestAnimationFrame(function(){ ensureTopLine(root); });
    // Only the shared mold needs wiring — it owns the CV modal. The other three are prose.
    if(key==='mgmt') requestAnimationFrame(function(){ ensureMgmt(root); });
    // Earnings is Evolution's DEFAULT sub-pane, so it is on screen the moment this tab opens —
    // it never gets a sub-tab click of its own and has to be wired from here.
    if(key==='evolution') requestAnimationFrame(function(){
      dhrCallPrepInit(root.querySelector(DD+'[data-dd="evolution"] .ovt-subpane[data-ovst="evearn"]'), _dhrCo); });
  }; });
  // Sub-tabs, pane-scoped so panes never collide.
  root.querySelectorAll('.ov-dhr-dd .dd-pane').forEach(function(pane){
    var SUB=':scope > .ovt-subtabs > .ovt-subtab';
    pane.querySelectorAll(SUB).forEach(function(btn){ btn.onclick=function(){
      var key=btn.getAttribute('data-ovst');
      pane.querySelectorAll(SUB).forEach(function(b){ b.classList.toggle('active', b===btn); });
      pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
      if(key==='valpeers') requestAnimationFrame(function(){ dScRenderAll(root); });
      if(BL_SUB[key]) requestAnimationFrame(function(){ ensureBottomLine(root, key); });
      if(TL_SUB[key]) requestAnimationFrame(function(){ ensureTopLine(root, key); });
      if(MS_SUB[key]) requestAnimationFrame(function(){ ensureMisc(root, key); });
      // Evolution ▸ Results / Estimates. Re-run on every show, not once: the engine shares one
      // `_rs` state across every dataset on the page (Top Line ▸ Segments registers its own), so
      // coming back to this pane after visiting a segment has to re-point it at DHR. Passing the
      // ticker to both is what makes the order the reader clicks in stop mattering.
      if(key==='evres') requestAnimationFrame(function(){
        initResults(pane.querySelector('.ovt-subpane[data-ovst="evres"] .rs-wrap'), 'DHR'); });
      if(key==='evest') requestAnimationFrame(function(){ initResultsEvo('DHR'); });
      if(key==='evearn') requestAnimationFrame(function(){
        dhrCallPrepInit(pane.querySelector('.ovt-subpane[data-ovst="evearn"]'), _dhrCo); });
    }; });
  });
}
// The company row for this mount. The Call Prep Watch List persists against company_id, so it
// needs the object the deep dive was opened with — held here rather than threaded through every
// wiring function.
var _dhrCo=null;
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  _dhrCo=c||null;
  wireDD(root);
  wireModal(root);
  // Top Line is the DEFAULT pane, so its General sub-pane is already on screen at mount.
  requestAnimationFrame(function(){ ensureTopLine(root, 'tlgen'); });
  wireScatters(root);   // the Peers pane carries the same map as the Overview
  if(!root._dhrCollapWired){ root._dhrCollapWired=true;
    root.addEventListener('click', function(e){ var hd=e.target.closest?e.target.closest('.rs-collap-h'):null; if(!hd||!root.contains(hd)) return;
      // A block that wires its own collapsible (it regenerates the whole header, not just the
      // caret) opts out here — otherwise both handlers fire and the panel toggles twice.
      if(hd.hasAttribute('data-selfwired')) return;
      var b=hd.nextElementSibling; if(!b||!b.classList.contains('rs-collap-b')) return; var open=b.hidden; b.hidden=!open;
      var ic=hd.querySelector('.rs-collap-ic'); if(ic) ic.innerHTML=open?'&#9662;':'&#9656;'; }); }
}

// Source buttons rendered into the Company Profile header (#co-srcbtns) — IR + EDGAR.
var CE_IR_URL='https://investors.danaher.com/';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=313616&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/DHR';
var CE_SEC_SEAL='img/sec-seal.png';
function ceHeaderSources(){
  return '<style>'+
    '.cohd-src{display:inline-flex;gap:8px;align-items:center}'+
    '.cohd-src a{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;'+
      'text-decoration:none;position:relative;overflow:hidden;transition:.16s;'+
      'background:linear-gradient(135deg,#02080D 0%,#08222F 60%,#02080D 100%);border:1px solid rgba(15,125,194,.34);box-shadow:0 3px 12px rgba(0,0,0,.32)}'+
    '.cohd-src a:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(15,125,194,.30);border-color:rgba(15,125,194,.78)}'+
    '.cohd-src a img{width:26px;height:26px;object-fit:contain;display:block;border-radius:6px}'+
    '.cohd-src a.edgar{background:linear-gradient(135deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cohd-src a.edgar:hover{box-shadow:0 8px 20px rgba(197,164,90,.30);border-color:rgba(227,200,120,.78)}'+
    '.cohd-src a.edgar img{border-radius:0}'+
  '</style>'+
  '<div class="cohd-src">'+
  '<a href="'+CE_IR_URL+'" target="_blank" rel="noopener" title="Danaher Investor Relations" aria-label="Danaher Investor Relations">'+
    '<img src="'+CE_LOGO_URL+'" alt="Danaher logo" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '<a class="edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener" title="Danaher on SEC EDGAR" aria-label="Danaher on SEC EDGAR">'+
    '<img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.style.display=\'none\'">'+
  '</a>'+
  '</div>';
}

export var dhrOverview = { html: html, init: init, headerSources: ceHeaderSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
