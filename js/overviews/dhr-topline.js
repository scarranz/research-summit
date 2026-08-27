// dhr-topline.js — Danaher, Deep Dive ▸ Top Line (General · Segments · Other · Customers).
//
// STRUCTURE: follows `js/overviews/amzn.js`, like the Bottom Line pane. Each sub-tab carries its
// own master "Chart" picker that swaps one `.gen-sec[data-gsec]` at a time; time series use the
// `dStd*` scaffold and walks use `dWaterfall`, both from `dhr-chartkit.js`.
//
// ── Why this pane exists in this shape ────────────────────────────────────────────────────────
// Danaher is three businesses in a trench coat, and the published totals hide them: the group's
// operating margin fell from 28.3% in FY2022 to 19.1% in FY2025, and essentially all of that is
// ONE segment. Life Sciences' operating profit went 1,209 → 879 → 520 over three years while its
// revenue barely moved, because impairments went 0 → 222 → 446. Diagnostics and Biotechnology are
// roughly where they were. A reader who only sees the consolidated line concludes the company is
// deteriorating; a reader who sees the segments concludes one segment is, and knows which.
//
// ── Where the numbers come from ───────────────────────────────────────────────────────────────
// Segment figures are DIMENSIONAL XBRL facts, which the `companyconcept` API does not return.
// They are pulled instead from the rendered "Segment Information (Segment Data) (Details)"
// R-files of every 10-K and 10-Q on EDGAR (CIK 0000313616), newest filing per period so
// restatements are picked up. Fourth quarters are never tagged on their own: each is the fiscal
// year less the three published quarters. Every derived Q4 reconciles — 4Q25 comes out at
// 2,033 + 2,085 + 2,720 = 6,838 of revenue and 1,502 of operating profit, matching the totals
// derived independently for the Bottom Line pane. Growth bridges and the guidance matrix are from
// the Q2 2026 press release and earnings presentation, 21-Jul-2026.
//
// ── The two structural breaks, and the FX sign trap ───────────────────────────────────────────
// 1. FY2022: Danaher split the old single "Life Sciences" segment into Biotechnology and Life
//    Sciences, restating back to FY2020. Before FY2020 the split does not exist at all.
// 2. FY2023: Environmental & Applied Solutions left continuing operations — it was spun off as
//    Veralto on 30-Sep-2023. The mix chart carries an "as reported at the time" / "continuing
//    operations" toggle so a reader can watch it leave rather than wonder why the total drops.
// 3. The growth bridges print RECONCILING values: `Total + Acquisitions + FX = Core`, so a printed
//    `(1.0)%` for FX means FX ADDED 1.0pp. Everything in this file is stored in plain reading —
//    a tailwind is a positive contribution — and the walk subtracts it. Verified against all 14
//    published rows and deck slide 3 (+5.5% / Core +3.0% / Acq +1.5% / FX +1.0%). The respiratory
//    row flips sign between the deck and the release; it is stored here as the release prints it,
//    a positive number meaning a headwind.

import { esc, dStdScaffold, dStdRender, dWaterfall, dTbl, dPicker, dWirePicker, dWireTables, dActivate,
         fMs, fPct, fPp, FMT_M, FMT_PP,
         D_ACT, D_REF, D_UP, D_DOWN, D_TOTAL, D_NEUT, D_SEG, DHR_KIT_CSS } from './dhr-chartkit.js';

// ═══ Data ═════════════════════════════════════════════════════════════════════════════════════

var SEGS = [
  { k:'bio', n:'Biotechnology', c:D_SEG.bio },
  { k:'ls',  n:'Life Sciences', c:D_SEG.ls  },
  { k:'dx',  n:'Diagnostics',   c:D_SEG.dx  },
  { k:'ea',  n:'Environmental & Applied', c:D_SEG.ea }   // Veralto — reported through FY2022 only
];
function segOf(k){ for (var i=0;i<SEGS.length;i++) if (SEGS[i].k === k) return SEGS[i]; return SEGS[0]; }

// Annual, $M. `rev` is the total AS FILED for that year; `revC` is the same year on today's
// continuing-operations basis where Danaher has restated it. Segment revenue and operating profit
// are unaffected by the Veralto restatement — only the total and corporate "Other" move.
var AY = [
  { y:2016, rev:16882.4 },
  { y:2017, rev:15518.8 },
  { y:2018, rev:17049 },
  { y:2019, rev:17911 },
  { y:2020, rev:22284, revC:null,   bio:5276, ls:5300, dx:7403,  ea:4305,
    bioOp:1082, lsOp: 972, dxOp:1538, eaOp: 979, corpOp:-340, op:4231,
    bioDA: 761, lsDA:292, dxDA:602, bioCx:169, lsCx:137, dxCx:447, bioAs:39086, lsAs: 9833, dxAs:15042 },
  { y:2021, rev:29453, revC:24802,  bio:8570, ls:6388, dx:9844,  ea:4651,
    bioOp:3074, lsOp:1293, dxOp:2313, eaOp:1054, corpOp:-303, op:6377,
    bioDA:1059, lsDA:382, dxDA:614, bioCx:385, lsCx:210, dxCx:644, bioAs:38118, lsAs:19768, dxAs:15054 },
  { y:2022, rev:31471, revC:26643,  bio:8758, ls:7036, dx:10849, ea:4828,
    bioOp:3008, lsOp:1414, dxOp:3436, eaOp:1135, corpOp:-322, op:7536,
    bioDA:1002, lsDA:531, dxDA:590, bioCx:405, lsCx:325, dxCx:382, bioAs:37536, lsAs:17572, dxAs:14722 },
  { y:2023, rev:23890, revC:23890,  bio:7172, ls:7141, dx:9577,  ea:null,
    bioOp:1909, lsOp:1209, dxOp:2406, eaOp:null, corpOp:-322, op:5202,
    bioDA:1026, lsDA:558, dxDA:577, bioCx:417, lsCx:320, dxCx:546, bioAs:37421, lsAs:23730, dxAs:14552,
    bioIm:  54, lsIm:   0, dxIm: 23 },
  { y:2024, rev:23875, revC:23875,  bio:6759, ls:7329, dx:9787,  ea:null,
    bioOp:1685, lsOp: 879, dxOp:2625, eaOp:null, corpOp:-326, op:4863,
    bioDA:1014, lsDA:743, dxDA:586, bioCx:447, lsCx:391, dxCx:550, bioAs:34605, lsAs:23211, dxAs:14204,
    bioIm:   0, lsIm: 222, dxIm: 43 },
  { y:2025, rev:24568, revC:24568,  bio:7293, ls:7334, dx:9941,  ea:null,
    bioOp:1864, lsOp: 520, dxOp:2650, eaOp:null, corpOp:-344, op:4690,
    bioDA:1051, lsDA:789, dxDA:598, bioCx:370, lsCx:186, dxCx:592, bioAs:37337, lsAs:23112, dxAs:14748,
    bioIm: 101, lsIm: 446, dxIm: 15 }
];
var AY_SEG_FROM = 4;      // FY2020 — the first year the three-segment split exists at all

// Quarterly, $M, continuing operations throughout. 1Q23 is as far back as the Veralto
// restatement reaches. `d` marks a fourth quarter derived as the fiscal year less nine months.
var QS = [
  { p:'1Q23', bio:1864, ls:1709, dx:2376, bioOp:596, lsOp: 321, dxOp:677, corpOp:-77, d:false },
  { p:'2Q23', bio:1885, ls:1796, dx:2231, bioOp:480, lsOp: 340, dxOp:424, corpOp:-81, d:false },
  { p:'3Q23', bio:1664, ls:1706, dx:2254, bioOp:417, lsOp: 313, dxOp:539, corpOp:-84, d:false },
  { p:'4Q23', bio:1759, ls:1930, dx:2716, bioOp:416, lsOp: 235, dxOp:766, corpOp:-80, d:true  },
  { p:'1Q24', bio:1524, ls:1745, dx:2527, bioOp:325, lsOp: 235, dxOp:830, corpOp:-78, d:false },
  { p:'2Q24', bio:1713, ls:1770, dx:2260, bioOp:462, lsOp: 233, dxOp:556, corpOp:-83, d:false },
  { p:'3Q24', bio:1653, ls:1782, dx:2363, bioOp:390, lsOp:  35, dxOp:615, corpOp:-82, d:false },
  { p:'4Q24', bio:1869, ls:2032, dx:2637, bioOp:508, lsOp: 376, dxOp:624, corpOp:-83, d:true  },
  { p:'1Q25', bio:1612, ls:1680, dx:2449, bioOp:441, lsOp: 201, dxOp:718, corpOp:-86, d:false },
  { p:'2Q25', bio:1850, ls:1777, dx:2309, bioOp:531, lsOp:-239, dxOp:554, corpOp:-86, d:false },
  { p:'3Q25', bio:1798, ls:1792, dx:2463, bioOp:352, lsOp: 222, dxOp:665, corpOp:-85, d:false },
  { p:'4Q25', bio:2033, ls:2085, dx:2720, bioOp:540, lsOp: 336, dxOp:713, corpOp:-87, d:true  },
  { p:'1Q26', bio:1797, ls:1737, dx:2417, bioOp:534, lsOp: 225, dxOp:674, corpOp:-89, d:false },
  { p:'2Q26', bio:1920, ls:1879, dx:2466, bioOp:556, lsOp: 244, dxOp:416, corpOp:-89, d:false }
];
function qTot(r){ return r.bio + r.ls + r.dx; }
function qOp(r){ return r.bioOp + r.lsOp + r.dxOp + r.corpOp; }

// Growth bridges, in PLAIN READING: every figure is a contribution to reported growth, so a
// tailwind is positive. `resp` follows the press release instead — positive means a headwind to
// core growth — because that is the only convention the company states in words.
// Invariant: core = total − acq − fx, and coreEx = core + resp.
var GB = {
  "1Q25|co": { total:-1.0, acq: 0.5, fx:-1.5, core: 0.0, resp: 1.0, coreEx: 1.0 },
  "2Q25|co": { total: 3.5, acq: 0.0, fx: 2.0, core: 1.5, resp: 0.5, coreEx: 2.0 },
  "3Q25|co": { total: 4.5, acq: 0.0, fx: 1.5, core: 3.0, resp:-0.5, coreEx: 2.5 },
  "4Q25|co": { total: 4.5, acq:-0.5, fx: 2.5, core: 2.5, resp: 1.5, coreEx: 4.0 },
  "FY25|co": { total: 3.0, acq: 0.0, fx: 1.0, core: 2.0, resp: 0.5, coreEx: 2.5 },
  "1Q26|co": { total: 3.5, acq: 0.0, fx: 3.0, core: 0.5, resp: 2.5, coreEx: 3.0 },
  "2Q26|co": { total: 5.5, acq: 1.5, fx: 1.0, core: 3.0, resp: 1.5, coreEx: 4.5 },
  "1H26|co": { total: 4.5, acq: 0.5, fx: 2.0, core: 2.0, resp: 2.0, coreEx: 4.0 },
  "2Q26|bio":{ total: 4.0, acq: 0.0, fx: 1.5, core: 2.5, resp:null, coreEx:null },
  "2Q26|ls": { total: 5.5, acq: 0.0, fx: 0.0, core: 5.5, resp:null, coreEx:null },
  "2Q26|dx": { total: 7.0, acq: 4.0, fx: 1.0, core: 2.0, resp: 3.0, coreEx: 5.0 },
  "1H26|bio":{ total: 7.5, acq: 0.0, fx: 3.0, core: 4.5, resp:null, coreEx:null },
  "1H26|ls": { total: 4.5, acq: 0.0, fx: 1.5, core: 3.0, resp:null, coreEx:null },
  "1H26|dx": { total: 2.5, acq: 2.0, fx: 1.5, core:-1.0, resp: 5.0, coreEx: 4.0 }
};
var GB_PERS = ['1Q25','2Q25','3Q25','4Q25','FY25','1Q26','2Q26','1H26'];
var GB_ENTS = [{ k:'co', n:'Total company', c:D_ACT }, { k:'bio', n:'Biotechnology', c:D_SEG.bio },
               { k:'ls', n:'Life Sciences', c:D_SEG.ls }, { k:'dx', n:'Diagnostics', c:D_SEG.dx }];

// Core growth by segment, actual then guided [IR deck slide 7]. Guidance is qualitative where the
// company left it qualitative — it is carried as text and never charted as a number.
var CORE_PERS = ['1Q25','2Q25','3Q25','4Q25','FY25','1Q26','2Q26','3Q26E','4Q26E','FY26E'];
var CORE_LAST_ACT = 6;                      // 2Q26 — everything after is guidance
var CORE = {
  bio:   [ 7.0,  6.0,  6.5,  6.0,  6.5,  7.0,  2.5, null, null, null],
  ls:    [-4.0, -2.5, -1.0,  0.5, -1.5,  0.5,  5.5, null, null, null],
  dx:    [-1.5,  2.0,  3.5,  2.0,  1.5, -4.0,  2.0, null, null, null],
  co:    [ 0.0,  1.5,  3.0,  2.5,  2.0,  0.5,  3.0, null, null, null],
  coEx:  [ 1.0,  2.0,  2.5,  4.0,  2.5,  3.0,  4.5, null, null, null]
};
var CORE_GUIDE = {
  bio:  { '3Q26E':'+MSD',        'FY26E':'+MSD' },
  ls:   { '3Q26E':'~3.0–4.0%',   'FY26E':'~3.0–4.0%' },
  dx:   { '3Q26E':'~Flat',       'FY26E':'Up slightly' },
  co:   { '3Q26E':'~2.0–3.0%',   '4Q26E':'+MSD', 'FY26E':'~3.0–4.0%' },
  coEx: { '3Q26E':'~5.0%',       '4Q26E':'+MSD', 'FY26E':'+MSD' }
};

// Geography, $M, continuing operations. Danaher names only the countries that clear 5% of sales
// or of property — the US and China for revenue; the US, UK, Sweden and Germany for property.
var GEO = [
  { y:2021, us: 9411, cn:3565, other:11826, ppeUS:1628, ppeUK:null, ppeSE:null, ppeDE:200, ppeOther: 945, ppeTot:3530 },
  { y:2022, us:11289, cn:3611, other:11743, ppeUS:1839, ppeUK:null, ppeSE:null, ppeDE:204, ppeOther: 998, ppeTot:3709 },
  { y:2023, us: 9579, cn:3143, other:11168, ppeUS:2304, ppeUK: 371, ppeSE: 425, ppeDE:238, ppeOther:1215, ppeTot:4553 },
  { y:2024, us: 9927, cn:2805, other:11143, ppeUS:2585, ppeUK: 519, ppeSE: 384, ppeDE:251, ppeOther:1251, ppeTot:4990 },
  { y:2025, us: 9981, cn:2631, other:11956, ppeUS:2757, ppeUK: 586, ppeSE: 477, ppeDE:287, ppeOther:1424, ppeTot:5531 }
];
// FY2025 sales by geographic destination, % of segment sales [10-K Item 1 and the segment pages].
// Percentages only — this is the one cut Danaher does not put dollars on.
var GEO_PCT = [
  { r:'North America (US + Canada)', co:42, bio:33, ls:41, dx:50 },
  { r:'Western Europe',              co:24, bio:35, ls:23, dx:17 },
  { r:'High-growth markets',         co:29, bio:27, ls:29, dx:29 },
  { r:'Other developed markets',     co: 5, bio: 5, ls: 7, dx: 4 }
];
// Recurring vs non-recurring, % of FY2025 sales [FY2025 annual report segment pages].
var RECUR = [
  { k:'bio', rec:88 }, { k:'ls', rec:66 }, { k:'dx', rec:89 }, { k:'co', rec:82 }
];

// Segment profiles — every clause traceable to the FY2025 10-K Item 1 or the FY2025 annual
// report segment pages. These are the descriptions, not a summary of them.
var PROFILE = {
  bio: { n:'Biotechnology', c:D_SEG.bio, brands:'Cytiva · Pall',
    what:'The tools used to develop and manufacture biological medicines — monoclonal antibodies, recombinant proteins, insulin, vaccines, and cell, gene, mRNA and other nucleic-acid therapies.',
    two:['<b>Bioprocessing</b> — cell-line and media development, cell culture media, process liquids and buffers, chromatography resins, filtration, aseptic fill-finish, single-use hardware and consumables, and whole manufacturing-suite design and installation.',
         '<b>Discovery &amp; medical</b> — lab filtration and purification, protein purification and bio-molecular analysis, reagents and membranes for assay development, healthcare filtration.'],
    who:'Pharma and biopharma manufacturers, biotech companies, translational-medicine institutions and contract manufacturers.',
    model:'88% recurring. Consumables and service dominate; equipment and installed suites are the minority.',
    watch:'The most cyclical of the three on customer capital budgets, and the one that gave back the most after the 2021–22 biopharma build-out: revenue fell from $8,758M in FY2022 to $6,759M in FY2024 before recovering to $7,293M.' },
  ls: { n:'Life Sciences', c:D_SEG.ls, brands:'SCIEX · Leica Microsystems · Beckman Coulter Life Sciences · IDT · Abcam · Aldevron · Molecular Devices · Phenomenex · Genedata · Pall industrial',
    what:'The instruments and consumables used to study DNA, RNA, proteins, metabolites and cells — upstream of any manufacturing. Mass spectrometry, microscopy, flow cytometry, centrifugation, liquid-handling automation, custom oligonucleotides, validated antibodies, plasmid DNA for cell and gene therapy.',
    two:['Also carries <b>Pall industrial filtration</b> — semiconductor fabs, aerospace, refineries, turbines, petrochemicals, food and beverage. A genuinely different end market inside a life-science segment.'],
    who:'Researchers, QA/QC technicians, CDMOs, CROs, universities and industrial manufacturers.',
    model:'66% recurring — the most instrument-weighted of the three, and the most exposed to research capital budgets.',
    watch:'Where the group\'s margin went. Operating profit fell from $1,209M in FY2023 to $520M in FY2025 on flat revenue, with impairment charges of $0M, $222M and $446M across those three years — including a $432M trade-name write-down in Q2\'25 that put the segment at a (13.4)% GAAP operating margin for the quarter.' },
  dx: { n:'Diagnostics', c:D_SEG.dx, brands:'Cepheid · Beckman Coulter Diagnostics · Radiometer · HemoCue · Leica Biosystems · Mammotome · Masimo',
    what:'Clinical instruments, consumables, software and services for hospitals, physicians\' offices, reference labs and critical care — molecular cartridge testing, high-volume clinical chemistry and immunoassay, lab automation, blood gas and point-of-care testing, anatomical and digital pathology.',
    two:['<b>Masimo</b> joined the segment in June 2026, adding patient monitoring. It contributed 4.0pp of Diagnostics\' reported growth in Q2\'26 and carried $108M of pretax acquisition items in the quarter.'],
    who:'Hospitals, physicians\' office labs, reference labs, blood banks and critical-care settings.',
    model:'89% recurring, the highest of the three. Instruments are placed and the consumable stream follows for the life of the platform — which is also why the segment runs more than double Biotechnology\'s depreciation on ~36% more revenue.',
    watch:'Two moving parts that are not the business: respiratory testing (~$1,900M in FY2025 falling to ~$1,600M expected in FY2026, a 3.0pp headwind to segment core growth in Q2\'26) and China volume-based procurement.' }
};

// ═══ General ▸ 1 — revenue and growth ═════════════════════════════════════════════════════════
var REV_MET = [
  { v:'co',  label:'Total company' }, { v:'bio', label:'Biotechnology' },
  { v:'ls',  label:'Life Sciences' }, { v:'dx',  label:'Diagnostics' }
];
function revDerive(st){
  var key = st.sel || 'co', gran = st.modes.gran || 'y';
  var rows = gran === 'y' ? AY : QS;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  var amt = rows.map(function(r){
    if (gran === 'y') return key === 'co' ? (r.revC != null ? r.revC : r.rev) : (r[key] != null ? r[key] : null);
    return key === 'co' ? qTot(r) : r[key];
  });
  // Year-over-year growth. Annual is against the prior year; quarterly against the same quarter a
  // year earlier, which is four rows back — never the prior quarter, which is seasonal.
  var lag = gran === 'y' ? 1 : 4;
  var grow = amt.map(function(v, i){
    var p = amt[i - lag];
    return (v == null || p == null || !p) ? null : Math.round((v/p - 1) * 1000)/10;
  });
  var name = key === 'co' ? 'Total company' : segOf(key).n;
  var col = key === 'co' ? D_ACT : segOf(key).c;
  return {
    labels: labels,
    series:[{ k:'amt', grp:'amt', src:name, label:name + ' revenue', color:col, type:'bar', data:amt },
            { k:'gr',  grp:'gr',  src:'Year-over-year growth', label:'Growth', color:D_REF, type:'line', yAxisID:'y2', data:grow }],
    yFmt: fMs, y2Fmt: fPct, cmpFrom: gran === 'y' ? AY_SEG_FROM : 0,
    legNote:'Bars = $M &nbsp;·&nbsp; line = growth vs the same period a year earlier (right axis)',
    tblTitle: name + ' — ' + (gran === 'y' ? 'annual' : 'quarterly') + ' revenue and growth',
    note: gran === 'y'
      ? function(i){ return (key !== 'co' && i < AY_SEG_FROM) ? 'Before FY2020 Biotechnology and Life Sciences were one segment — the split does not exist' : ''; }
      : function(i){ return QS[i].d ? 'Fourth quarter — derived as the fiscal year less the three published quarters' : ''; }
  };
}

// ═══ General ▸ 2 — the reported → core growth walk ════════════════════════════════════════════
var gwSt = { per:'2Q26', ent:'co' };
function gwSteps(g){
  var run = g.total;
  var steps = [{ label:'Reported growth', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:g.total }];
  function step(lab, d, col){ var lo = run; run = lo + d;
    steps.push({ label:lab, kind:d >= 0 ? 'up' : 'down', color:col, dc:D_NEUT, range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:d }); }
  step('Less acquisitions', -g.acq, D_NEUT);
  step('Less currency',     -g.fx,  D_NEUT);
  steps.push({ label:'Core growth', kind:'total', color:D_ACT, range:[0, g.core], runAfter:g.core, val:g.core });
  if (g.resp != null){
    run = g.core;
    step('Respiratory testing', g.resp, g.resp >= 0 ? D_UP : D_DOWN);
    steps.push({ label:'Core ex-respiratory', kind:'total', color:D_UP, range:[0, g.coreEx], runAfter:null, val:g.coreEx });
  }
  return steps;
}
function gwBody(){
  var pers = GB_PERS.map(function(p){ return '<button type="button" data-gwp="' + p + '"' + (p === gwSt.per ? ' class="active"' : '') + '>' + p + '</button>'; }).join('');
  var ents = GB_ENTS.map(function(e){ return '<button type="button" data-gwe="' + e.k + '"' + (e.k === gwSt.ent ? ' class="active"' : '') + '>' + esc(e.n) + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Reported growth → core growth — what the headline number is made of</div>' +
    '<div class="mch-ctl"><span class="acx-tog gw-ent">' + ents + '</span>' +
      '<span class="acx-tog gw-per" style="flex-wrap:wrap">' + pers + '</span></div>' +
    '<div class="rs-noguide" id="dhrGwEmpty" hidden></div>' +
    '<div class="ov-chart-card" id="dhrGwCard"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrGw"></canvas></div></div>' +
    '<div id="dhrGw-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrGwCap"></div></div>';
}
function gwBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="growth"]'); if (!pane) return;
  var g = GB[gwSt.per + '|' + gwSt.ent];
  var box = pane.querySelector('#dhrGwEmpty'), card = pane.querySelector('#dhrGwCard');
  var cap = pane.querySelector('#dhrGwCap'), tbl = pane.querySelector('#dhrGw-tbl');
  if (!g){                                                    // rule 6 — nothing, never broken
    if (box){ box.hidden = false;
      box.innerHTML = 'Danaher publishes a growth bridge for ' + esc(GB_ENTS.filter(function(e){ return e.k === gwSt.ent; })[0].n) +
        ' only in the periods a press release reconciles by segment — <b>2Q26</b> and <b>1H26</b>. Pick one of those, or Total company for the full run.'; }
    if (card) card.hidden = true;
    if (tbl) tbl.innerHTML = '';
    if (cap) cap.innerHTML = '';
    return;
  }
  if (box) box.hidden = true;
  if (card) card.hidden = false;
  dWaterfall(root, 'dhrGw', gwSteps(g), FMT_PP, 'The walk — every contribution');
  var entName = GB_ENTS.filter(function(e){ return e.k === gwSt.ent; })[0].n;
  if (cap) cap.innerHTML = '<b>' + esc(entName) + ', ' + esc(gwSt.per) + '.</b> Reported growth of <b>' + fPct(g.total) +
    '</b> becomes core growth of <b>' + fPct(g.core) + '</b> once acquisitions (' + fPp(g.acq) + ') and currency (' + fPp(g.fx) +
    ') come out' + (g.resp != null ? ', and <b>' + fPct(g.coreEx) + '</b> once respiratory testing is set aside as well' : '') + '.<br>' +
    '<b>Read the signs carefully.</b> Danaher prints this bridge as reconciling amounts — <i>Total + Acquisitions + FX = Core</i> — so a ' +
    'printed <i>(1.0)%</i> for currency means currency <b>added</b> 1.0pp. Everything here is restated into plain reading: a positive ' +
    'contribution is a tailwind, and the walk subtracts it. The respiratory row is the release\'s own convention instead, where a ' +
    'positive number is a headwind to core growth — which is why removing it moves the bar up.';
}

// ═══ General ▸ 3 — who moved the needle ═══════════════════════════════════════════════════════
// Each segment's change in revenue, expressed as a share of the whole company's prior-period
// revenue, so the three contributions add to total company growth.
function contribDerive(st){
  var gran = st.modes.gran || 'y';
  var rows = gran === 'y' ? AY.slice(AY_SEG_FROM) : QS;
  var lag = gran === 'y' ? 1 : 4;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  function tot(r){ return gran === 'y' ? (r.bio + r.ls + r.dx + (r.ea || 0)) : qTot(r); }
  var keys = gran === 'y' ? ['bio','ls','dx','ea'] : ['bio','ls','dx'];
  var series = keys.map(function(k){
    return { k:k, grp:k, src:segOf(k).n, label:segOf(k).n, color:segOf(k).c, type:'bar', stack:'c',
      data: rows.map(function(r, i){
        var p = rows[i - lag]; if (!p) return null;
        var a = r[k], b = p[k];
        if (a == null && b == null) return null;
        return Math.round(((a || 0) - (b || 0)) / tot(p) * 1000)/10;
      }) };
  });
  return {
    labels: labels, series: series, stacked: true, yFmt: fPct,
    legNote:'Each bar is that segment\'s change in revenue as a share of the whole company\'s revenue a ' + (gran === 'y' ? 'year' : 'year') + ' earlier — the three add to total growth',
    tblTitle:'Contribution to total revenue growth, percentage points',
    note: gran === 'y' ? function(i){ return rows[i].ea != null ? 'Environmental & Applied Solutions still in continuing operations' : ''; }
                       : function(i){ return rows[i].d ? 'Fourth quarter — derived' : ''; }
  };
}

// ═══ Segments ▸ 1 — scale and mix ═════════════════════════════════════════════════════════════
function mixDerive(st){
  var gran = st.modes.gran || 'y', unit = st.modes.unit || 'usd', basis = st.modes.basis || 'filed';
  var rows = gran === 'y' ? AY.slice(AY_SEG_FROM) : QS;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  var keys = (gran === 'y' && basis === 'filed') ? ['bio','ls','dx','ea'] : ['bio','ls','dx'];
  function tot(r){ var t = 0; keys.forEach(function(k){ t += (r[k] || 0); }); return t; }
  var series = keys.map(function(k){
    return { k:k, grp:k, src:segOf(k).n, label:segOf(k).n, color:segOf(k).c, type:'bar', stack:'m',
      data: rows.map(function(r){
        var v = r[k]; if (v == null) return null;
        return unit === 'pct' ? Math.round(v/tot(r)*1000)/10 : v;
      }) };
  });
  return {
    labels: labels, series: series, stacked: true, yFmt: unit === 'pct' ? fPct : fMs,
    hideModes: gran === 'y' ? [] : ['basis'],
    legNote: gran === 'y' && basis === 'filed'
      ? 'Environmental & Applied Solutions is Veralto — spun off 30-Sep-2023. It is drawn while Danaher reported it.'
      : 'Today\'s three reportable segments',
    tblTitle:'Segment revenue, ' + (unit === 'pct' ? '% of the total drawn' : '$M'),
    note: gran === 'y'
      ? function(i){ return rows[i].ea != null && basis === 'filed' ? 'Includes Environmental & Applied Solutions, spun off as Veralto in September 2023' : ''; }
      : function(i){ return rows[i].d ? 'Fourth quarter — derived as the fiscal year less the three published quarters' : ''; }
  };
}

// ═══ Segments ▸ 2 — profitability ═════════════════════════════════════════════════════════════
var PROF_MET = {
  op:  { lab:'Operating profit',       u:'$M', f:function(r, k){ return r[k + 'Op']; },  q:function(r, k){ return r[k + 'Op']; } },
  om:  { lab:'Operating margin',       u:'%',  f:function(r, k){ return r[k] ? r[k + 'Op']/r[k]*100 : null; }, q:function(r, k){ return r[k] ? r[k + 'Op']/r[k]*100 : null; } },
  im:  { lab:'Impairment charges',     u:'$M', annual:true, f:function(r, k){ return r[k + 'Im']; } },
  da:  { lab:'Depreciation & amortisation', u:'$M', annual:true, f:function(r, k){ return r[k + 'DA']; } },
  cx:  { lab:'Capital expenditure',    u:'$M', annual:true, f:function(r, k){ return r[k + 'Cx']; } },
  as:  { lab:'Identifiable assets',    u:'$M', annual:true, f:function(r, k){ return r[k + 'As']; } },
  roa: { lab:'Operating profit ÷ identifiable assets', u:'%', annual:true, f:function(r, k){ return r[k + 'As'] ? r[k + 'Op']/r[k + 'As']*100 : null; } }
};
function profDerive(st){
  var key = st.sel || 'op', m = PROF_MET[key], gran = st.modes.gran || 'y';
  if (gran === 'q' && m.annual)
    return { empty: m.lab + ' is disclosed by segment once a year, in the 10-K segment note. Switch the Period pill back to Annual.' };
  var rows = gran === 'y' ? AY.slice(AY_SEG_FROM) : QS;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  var keys = ['bio','ls','dx'];
  var series = keys.map(function(k){
    return { k:k, grp:k, src:segOf(k).n, label:segOf(k).n, color:segOf(k).c,
      type: m.u === '%' ? 'line' : 'bar',
      data: rows.map(function(r){ var v = (gran === 'y' ? m.f : (m.q || m.f))(r, k); return (v == null || isNaN(v)) ? null : Math.round(v*10)/10; }) };
  });
  return {
    labels: labels, series: series, yFmt: m.u === '%' ? fPct : fMs,
    hideModes: m.annual ? ['gran'] : [],
    legNote: m.u === '%' ? 'Lines = ' + m.lab.toLowerCase() : 'Bars = ' + m.lab.toLowerCase() + ', $M',
    tblTitle: m.lab + ' by segment — ' + (gran === 'y' ? 'annual' : 'quarterly'),
    note: gran === 'q' ? function(i){ return rows[i].d ? 'Fourth quarter — derived' : ''; } : null,
    extraRows: (key === 'op' || key === 'om') ? function(lo, hi){
      return [['Corporate ("Other")'].concat(rows.slice(lo, hi+1).map(function(r){
        return key === 'op' ? fMs(r.corpOp) : '—'; }))];
    } : null
  };
}

// ═══ Segments ▸ 3 — core growth and guidance ══════════════════════════════════════════════════
var CORE_ROWS = [{ k:'bio', n:'Biotechnology', c:D_SEG.bio }, { k:'ls', n:'Life Sciences', c:D_SEG.ls },
                 { k:'dx', n:'Diagnostics', c:D_SEG.dx }, { k:'co', n:'Danaher', c:D_ACT },
                 { k:'coEx', n:'Danaher ex-respiratory', c:D_UP }];
function coreDerive(){
  return {
    labels: CORE_PERS, lastAct: CORE_LAST_ACT,
    series: CORE_ROWS.map(function(r){
      return { k:r.k, grp:r.k, src:r.n, label:r.n, color:r.c, type:'line', dash:(r.k === 'coEx'), data:CORE[r.k] };
    }),
    yFmt: fPct,
    legNote:'Core growth — organic, excluding acquisitions and currency. The guided quarters carry no line because Danaher guides them in words, not numbers.',
    tblTitle:'Core growth by segment, with guidance as the company words it',
    extraRows: function(lo, hi){
      return CORE_ROWS.map(function(r){
        return ['↳ ' + r.n + ' — guided'].concat(CORE_PERS.slice(lo, hi+1).map(function(p){
          return (CORE_GUIDE[r.k] && CORE_GUIDE[r.k][p]) ? CORE_GUIDE[r.k][p] : null; }));
      });
    }
  };
}

// ═══ Segments ▸ 4 — what each segment actually is ═════════════════════════════════════════════
function profileBody(){
  var last = AY[AY.length - 1];
  var h = '<div class="ov-sec"><div class="ov-sec-h">What each segment actually is</div>' +
    '<p class="dbl-lede">Three segments, three different businesses. One sells the plant that makes a drug, ' +
    'one sells the bench instruments that discover it, one sells the test that finds the disease. They share ' +
    'a management system and very little else — including how much of their revenue comes back every year ' +
    'without a new sale.</p><div class="tls-cards">';
  ['bio','ls','dx'].forEach(function(k){
    var p = PROFILE[k], rec = RECUR.filter(function(x){ return x.k === k; })[0];
    h += '<div class="tls-card" style="--seg:' + p.c + '">' +
      '<div class="tls-card-h"><span class="tls-dot"></span>' + esc(p.n) + '</div>' +
      '<div class="tls-kpis">' +
        '<div><b>' + fMs(last[k]) + 'M</b><span>FY2025 revenue</span></div>' +
        '<div><b>' + fPct(last[k]/(last.bio + last.ls + last.dx)*100) + '</b><span>of company sales</span></div>' +
        '<div><b>' + fPct(last[k + 'Op']/last[k]*100) + '</b><span>operating margin</span></div>' +
        '<div><b>' + rec.rec + '%</b><span>recurring</span></div>' +
      '</div>' +
      '<div class="tls-brands">' + esc(p.brands) + '</div>' +
      '<p class="tls-p">' + p.what + '</p>' +
      p.two.map(function(t){ return '<p class="tls-p tls-sub">' + t + '</p>'; }).join('') +
      '<div class="tls-lbl">Who buys it</div><p class="tls-p">' + esc(p.who) + '</p>' +
      '<div class="tls-lbl">How it charges</div><p class="tls-p">' + esc(p.model) + '</p>' +
      '<div class="tls-lbl">What to watch</div><p class="tls-p tls-watch">' + p.watch + '</p>' +
      '</div>';
  });
  h += '</div>' +
    '<div class="dbl-note">Every description is the 10-K\'s own, condensed but not reinterpreted; the figures are ' +
    'FY2025 from the segment note. <b>Recurring share is a percentage Danaher publishes and never puts dollars on</b> — ' +
    'there is no recurring-revenue figure and no recurring growth rate at group or segment level in anything filed.</div>' +
    '</div>';
  return h;
}

// ═══ Segments ▸ 5 — how the segment structure itself changed ══════════════════════════════════
function structureBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">How the reporting itself changed — read this before comparing years</div>' +
    '<div class="tls-tl">' +
      '<div class="tls-tli"><div class="tls-tlq">Through FY2021</div><div class="tls-tlt">' +
        '<b>Four segments</b>, and Biotechnology did not exist as one. Life Sciences was a single segment worth ' +
        '$14,958M in FY2021 — what is now Biotechnology ($8,570M) plus Life Sciences ($6,388M). Environmental & ' +
        'Applied Solutions was the fourth, at $4,651M.</div></div>' +
      '<div class="tls-tli"><div class="tls-tlq">FY2022</div><div class="tls-tlt">' +
        '<b>The split.</b> Danaher separated Biotechnology from Life Sciences and restated back to FY2020. That is ' +
        'why no chart here reaches further back for a segment — before FY2020 the split simply does not exist in ' +
        'anything filed.</div></div>' +
      '<div class="tls-tli"><div class="tls-tlq">30 September 2023</div><div class="tls-tlt">' +
        '<b>Veralto leaves.</b> Environmental & Applied Solutions was spun off and moved to discontinued ' +
        'operations, restating FY2021 and FY2022 but no further. FY2021 revenue is $29,453M as it was reported at ' +
        'the time and $24,802M on today\'s basis — the same year, two numbers, and the gap is Veralto.</div></div>' +
      '<div class="tls-tli"><div class="tls-tlq">June 2026</div><div class="tls-tlt">' +
        '<b>Masimo arrives</b>, inside Diagnostics. It added 4.0pp to that segment\'s reported growth in Q2\'26 and ' +
        'carried $108M of pretax acquisition items in the quarter. No segment was created for it.</div></div>' +
    '</div>' +
    '<div class="dbl-note">The consequence, and the thing most likely to be got wrong: <b>a five-year revenue CAGR ' +
    'computed off the as-filed totals is meaningless</b>. FY2022 to FY2023 looks like a 24% collapse and is mostly ' +
    'Veralto walking out. The mix chart\'s <i>Continuing operations</i> toggle restates FY2021 and FY2022 the way ' +
    'Danaher does; FY2020 has never been restated, so on that basis its total is the sum of the three segments ' +
    'rather than a published figure.</div></div>';
}

// ═══ Other ▸ geography ════════════════════════════════════════════════════════════════════════
var GEO_MET = {
  sales:{ lab:'Sales by country', u:'$M', keys:[['us','United States',D_ACT],['cn','China',D_DOWN],['other','All other countries',D_REF]] },
  ppe:  { lab:'Property, plant and equipment', u:'$M', keys:[['ppeUS','United States',D_ACT],['ppeUK','United Kingdom',D_SEG.bio],['ppeSE','Sweden',D_SEG.ls],['ppeDE','Germany',D_SEG.dx],['ppeOther','All other countries',D_REF]] }
};
function geoDerive(st){
  var m = GEO_MET[st.sel || 'sales'], unit = st.modes.unit || 'usd';
  function tot(r){ var t = 0; m.keys.forEach(function(k){ t += (r[k[0]] || 0); }); return t; }
  return {
    labels: GEO.map(function(r){ return 'FY' + String(r.y).slice(2); }),
    series: m.keys.map(function(k){
      return { k:k[0], grp:k[0], src:k[1], label:k[1], color:k[2], type:'bar', stack:'g',
        data: GEO.map(function(r){ var v = r[k[0]]; return v == null ? null : (unit === 'pct' ? Math.round(v/tot(r)*1000)/10 : v); }) };
    }),
    stacked: true, yFmt: unit === 'pct' ? fPct : fMs,
    legNote:'Danaher names only the countries that clear 5% of the total — everything else is one bucket',
    tblTitle: m.lab + ', ' + (unit === 'pct' ? '% of total' : '$M')
  };
}
function geoTables(){
  var h = '<div class="dbl-note" style="margin-top:22px"><b>The one cut with no dollars on it.</b> Danaher publishes ' +
    'sales by geographic destination as percentages of segment sales, and only that. "High-growth markets" is its own ' +
    'definition: Eastern Europe, the Middle East, Africa, Latin America including Mexico, and Asia except Japan, ' +
    'Australia and New Zealand.</div>';
  h += dTbl('dhrGeoPct', 'FY2025 sales by destination, % of segment sales',
    ['Region', 'Total company', 'Biotechnology', 'Life Sciences', 'Diagnostics'],
    GEO_PCT.map(function(r){ return [r.r, r.co + '%', r.bio + '%', r.ls + '%', r.dx + '%']; }));
  return h;
}

// ═══ Other ▸ revenue type ═════════════════════════════════════════════════════════════════════
function typeBody(){
  var last = AY[AY.length - 1];
  var h = '<div class="ov-sec"><div class="ov-sec-h">Recurring versus non-recurring</div>' +
    '<p class="dbl-lede">82% of Danaher\'s FY2025 sales are recurring — consumables, reagents, cartridges and service ' +
    'contracts that reorder for the life of an installed platform. That is the whole placed-instrument model in one ' +
    'number, and it is the reason a segment can have a bad year for orders without a bad year for revenue.</p>' +
    '<div class="tls-bars">';
  RECUR.forEach(function(r){
    var name = r.k === 'co' ? 'Total company' : segOf(r.k).n;
    var col = r.k === 'co' ? D_ACT : segOf(r.k).c;
    h += '<div class="tls-bar"><div class="tls-bar-l">' + esc(name) + '</div>' +
      '<div class="tls-bar-t"><div class="tls-bar-f" style="width:' + r.rec + '%;background:' + col + '"></div>' +
        '<span class="tls-bar-v">' + r.rec + '% recurring</span></div>' +
      '<div class="tls-bar-r">' + (100 - r.rec) + '% non-recurring</div></div>';
  });
  h += '</div>' +
    '<div class="dbl-note"><b>Life Sciences is the outlier and it explains its earnings.</b> At 66% recurring it is ' +
    'the most instrument-weighted of the three, so it swings with customers\' capital budgets rather than their ' +
    'consumption. Diagnostics at 89% is the opposite: instruments are placed almost as a cost of acquiring the ' +
    'consumable stream, which is also why it carries more than double Biotechnology\'s depreciation on about a third ' +
    'more revenue.<br><br><b>Dollars and growth by revenue type: not published.</b> Danaher gives the mix as ' +
    'percentages only. There is no recurring-revenue figure and no growth rate for either half, at group or segment ' +
    'level, in anything filed — so none is shown here.</div></div>';
  return h;
}

// ═══ Customers ════════════════════════════════════════════════════════════════════════════════
function customersBody(){
  return '<div class="ov-sec"><div class="ov-sec-h">Customers</div>' +
    '<div class="rs-noguide" style="margin-bottom:16px">Danaher discloses <b>no customer concentration</b>. ' +
    'The FY2025 10-K has no "Major Customers" heading and names no customer anywhere. Any top-customer list for ' +
    'this company is inference, and must not reach committee as fact.</div>' +
    '<p class="dbl-lede">What the filings do say is who each segment sells to, and through what channel. That is ' +
    'the honest version of this question, and it is more useful than a fabricated concentration table: the three ' +
    'segments sell to three different budgets, which is why they do not move together.</p>' +
    '<div class="tls-cards">' +
    ['bio','ls','dx'].map(function(k){
      var p = PROFILE[k];
      return '<div class="tls-card" style="--seg:' + p.c + '">' +
        '<div class="tls-card-h"><span class="tls-dot"></span>' + esc(p.n) + '</div>' +
        '<div class="tls-lbl">Who buys</div><p class="tls-p">' + esc(p.who) + '</p>' +
        '<div class="tls-lbl">Which budget it comes out of</div><p class="tls-p">' +
          (k === 'bio' ? 'Manufacturing and capital budgets at drug makers and their contract manufacturers — it moves with how much biologic capacity the industry is building.'
         : k === 'ls'  ? 'Research budgets at pharma, academia and government, plus industrial capital spending through Pall — the most discretionary of the three, and the first cut in a downturn.'
         : 'Hospital and laboratory operating budgets, plus reimbursement — closer to healthcare utilisation than to anyone\'s capital cycle.') +
        '</p></div>';
    }).join('') + '</div>' +
    '<div class="dbl-note"><b>Channel [10-K FY2025 Item 1].</b> Danaher sells primarily through a direct sales force. ' +
    'Most non-US sales are made by non-US subsidiaries; it also sells from the US into non-US markets through ' +
    'representatives and distributors and, in some cases, directly. In countries with low sales volumes it generally ' +
    'sells through representatives and distributors. Diagnostics specifically uses both direct sales personnel and ' +
    'independent distributors.<br><br>The only concentration language ever verified is from <b>FY2019</b> — no ' +
    'customer above 10% of sales — and it came from a search snippet, not the filing. Six years stale, and not ' +
    'carried forward here as a fact.</div></div>';
}

// ═══ Section registries ═══════════════════════════════════════════════════════════════════════
var GEN_SECS = [
  ['rev',     'Revenue & growth'],
  ['growth',  'Reported growth → core growth'],
  ['contrib', 'Who moved the needle — contribution by segment']
];
var SEG_SECS = [
  ['mix',       'Scale & mix'],
  ['prof',      'Segment profitability'],
  ['core',      'Core growth & guidance'],
  ['profile',   'What each segment actually is'],
  ['structure', 'How the reporting changed']
];
var OTH_SECS = [
  ['geo',  'Geography'],
  ['type', 'Recurring vs non-recurring']
];

var TL_CSS = '<style>' +
  '.dhr-tl{max-width:1000px}' +
  '.tls-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;margin:14px 0 4px}' +
  '.tls-card{border:1px solid var(--bdr);border-top:3px solid var(--seg);border-radius:12px;padding:16px 18px;background:var(--w,#fff)}' +
  '.tls-card-h{font-size:15px;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:8px;margin-bottom:10px}' +
  '.tls-dot{width:10px;height:10px;border-radius:50%;background:var(--seg);flex:none}' +
  '.tls-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px}' +
  '.tls-kpis>div{border:1px solid var(--bdr);border-radius:8px;padding:7px 9px}' +
  '.tls-kpis b{display:block;font-size:16px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums;letter-spacing:-.02em}' +
  '.tls-kpis span{font-size:9.5px;color:var(--mu);font-weight:600}' +
  '.tls-brands{font-size:10.5px;font-weight:700;color:var(--seg);line-height:1.5;margin-bottom:10px;letter-spacing:.01em}' +
  '.tls-p{font-size:12px;line-height:1.58;color:var(--tx);margin:0 0 9px}' +
  '.tls-sub{color:var(--mu)}' +
  '.tls-watch{background:rgba(0,0,0,.028);border-left:3px solid var(--seg);border-radius:0 8px 8px 0;padding:9px 12px;margin-bottom:0}' +
  '.tls-lbl{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:12px 0 4px}' +
  '.tls-tl{position:relative;margin:14px 0 4px;padding-left:22px}' +
  '.tls-tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--bdr)}' +
  '.tls-tli{position:relative;margin-bottom:16px}.tls-tli:last-child{margin-bottom:2px}' +
  '.tls-tli::before{content:"";position:absolute;left:-21px;top:3px;width:10px;height:10px;border-radius:50%;background:var(--navy);border:2px solid var(--w,#fff);box-shadow:0 0 0 1px var(--bdr)}' +
  '.tls-tlq{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--navy)}' +
  '.tls-tlt{font-size:12.5px;line-height:1.6;color:var(--tx);margin-top:3px;max-width:80ch}' +
  '.tls-bars{margin:16px 0 4px}' +
  '.tls-bar{display:grid;grid-template-columns:150px 1fr 140px;gap:12px;align-items:center;margin-bottom:10px}' +
  '.tls-bar-l{font-size:12.5px;font-weight:700;color:var(--navy)}' +
  '.tls-bar-t{position:relative;height:24px;background:#EEF2F6;border-radius:6px;overflow:hidden}' +
  '.tls-bar-f{position:absolute;left:0;top:0;height:100%;border-radius:6px}' +
  '.tls-bar-v{position:absolute;left:10px;top:0;line-height:24px;font-size:11px;font-weight:800;color:#fff}' +
  '.tls-bar-r{font-size:11px;color:var(--mu);font-weight:600}' +
  '@media(max-width:640px){.tls-bar{grid-template-columns:1fr;gap:4px}.tls-bar-v{color:var(--navy);left:auto;right:8px}}' +
  '</style>';

// ═══ Bodies ═══════════════════════════════════════════════════════════════════════════════════
export function dhrTopLineGeneralHtml(){
  if (!AY.length) return '';                                  // rule 6 — nothing, never broken
  return DHR_KIT_CSS + TL_CSS + '<div class="dhr-tl">' +
    '<p class="dbl-lede">Danaher grew revenue 2.9% in FY2025, to $24,568M. Almost none of that is what the company ' +
    'calls growth: core growth was 2.0%, currency added a point, and respiratory testing took half a point back. The ' +
    'gap between the headline and the underlying number is the whole subject of this tab.</p>' +
    dPicker(GEN_SECS, 'rev') +
    '<div class="gen-sec" data-gsec="rev">' + dStdScaffold({
      id:'tlrev', title:'Revenue & growth', height:360, metricSel:REV_MET,
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['cmp','Segments exist'],['l5','Last 5'],['l8','Last 8']],
      note:'Segment revenue starts at <b>FY2020</b> because that is as far back as Danaher restated when it split ' +
        'Biotechnology out of Life Sciences in 2022 — the <i>Segments exist</i> preset snaps there. The total-company ' +
        'line runs from FY2016 and is shown on today\'s continuing-operations basis wherever Danaher has restated it, ' +
        'so FY2021 reads $24,802M rather than the $29,453M it was reported as at the time. Quarterly figures are ' +
        'continuing operations throughout, and each fourth quarter is the fiscal year less the three published ' +
        'quarters — Danaher never tags Q4 on its own.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="growth" hidden>' + gwBody() + '</div>' +
    '<div class="gen-sec" data-gsec="contrib" hidden>' + dStdScaffold({
      id:'tlcon', title:'Contribution to growth by segment', height:340,
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']],
      note:'Reported growth, decomposed by where it came from. Each bar is a segment\'s change in revenue divided by ' +
        'the whole company\'s revenue in the comparison period, so the bars sum to total growth and a segment that ' +
        'shrank pulls the stack down. This is the chart that shows Biotechnology, not the market, taking 8 points off ' +
        'the company in FY2023 and FY2024.'
    }) + '</div>' +
    '</div>';
}

export function dhrTopLineSegmentsHtml(){
  return DHR_KIT_CSS + TL_CSS + '<div class="dhr-tl">' +
    '<p class="dbl-lede">Three segments of roughly comparable size — $7.3B, $7.3B and $9.9B — and one of them is ' +
    'responsible for essentially the entire fall in the group\'s operating margin. Life Sciences earned $1,209M in ' +
    'FY2023 and $520M in FY2025 on flat revenue. Start with <i>Segment profitability</i> if that is the question.</p>' +
    dPicker(SEG_SECS, 'mix') +
    '<div class="gen-sec" data-gsec="mix">' + dStdScaffold({
      id:'tlmix', title:'Scale & mix', height:360,
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] },
             { cls:'unit', label:'Show',   opts:[{ v:'usd', label:'$M', on:true }, { v:'pct', label:'% of total' }] },
             { cls:'basis', label:'Basis', opts:[{ v:'filed', label:'As reported then', on:true }, { v:'cont', label:'Continuing ops' }] }],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']],
      note:'<b>As reported then</b> draws Environmental & Applied Solutions — Veralto — for as long as Danaher ' +
        'reported it, so the FY2023 drop in the total is visibly a spin-off rather than a collapse. ' +
        '<b>Continuing ops</b> drops it, matching the basis of every figure the company publishes today.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="prof" hidden>' + dStdScaffold({
      id:'tlprof', title:'Segment profitability', height:360,
      metricSel:[{ v:'op', label:'Operating profit ($M)', on:true }, { v:'om', label:'Operating margin (%)' },
                 { v:'im', label:'Impairment charges ($M)' }, { v:'da', label:'Depreciation & amortisation ($M)' },
                 { v:'cx', label:'Capital expenditure ($M)' }, { v:'as', label:'Identifiable assets ($M)' },
                 { v:'roa', label:'Operating profit ÷ identifiable assets (%)' }],
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']],
      note:'These are <b>GAAP</b> segment figures from the 10-K and 10-Q segment notes — Danaher\'s adjusted segment ' +
        'margins are higher and are published only for the periods a press release covers. Switch to <b>Impairment ' +
        'charges</b> to see where the profit went: Life Sciences took $0M, $222M and $446M across FY2023–FY2025, ' +
        'including a $432M trade-name write-down in Q2\'25 that alone put the segment at a (13.4)% operating margin ' +
        'for that quarter. <b>Identifiable assets</b> is the other half of the story — Life Sciences carries $23.1B ' +
        'of assets against $520M of operating profit, and Diagnostics $14.7B against $2,650M.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="core" hidden>' + dStdScaffold({
      id:'tlcore', title:'Core growth & guidance', height:340, presets:[['all','All'],['l5','Last 5']],
      note:'Core growth strips out acquisitions and currency, so it is the closest thing to the underlying business. ' +
        'The guided periods are shaded but carry no line: Danaher guides them in words — "+MSD", "~Flat", ' +
        '"up slightly" — and those words are in the table rather than converted into numbers that would look more ' +
        'precise than they are.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="profile" hidden>' + profileBody() + '</div>' +
    '<div class="gen-sec" data-gsec="structure" hidden>' + structureBody() + '</div>' +
    '</div>';
}

export function dhrTopLineOtherHtml(){
  return DHR_KIT_CSS + TL_CSS + '<div class="dhr-tl">' +
    '<p class="dbl-lede">Two cuts Danaher publishes and one it does not. Sales by country exist in dollars for the ' +
    'United States and China only; everything else is a single bucket. China is worth the attention: $3,565M in ' +
    'FY2021 and $2,631M in FY2025, from 14.4% of sales to 10.7%.</p>' +
    dPicker(OTH_SECS, 'geo') +
    '<div class="gen-sec" data-gsec="geo">' + dStdScaffold({
      id:'tlgeo', title:'Geography', height:340,
      metricSel:[{ v:'sales', label:'Sales by country', on:true }, { v:'ppe', label:'Property, plant and equipment' }],
      modes:[{ cls:'unit', label:'Show', opts:[{ v:'usd', label:'$M', on:true }, { v:'pct', label:'% of total' }] }],
      presets:[['all','All'],['l5','Last 5']],
      note:'Only countries above 5% of the relevant total are named — that threshold is Danaher\'s own accounting ' +
        'policy, not a choice made here, which is why the United Kingdom and Sweden appear for property but never ' +
        'for sales. The series starts at FY2021 because that is as far back as the Veralto restatement reaches; ' +
        'earlier years are on a different company.'
    }) + geoTables() + '</div>' +
    '<div class="gen-sec" data-gsec="type" hidden>' + typeBody() + '</div>' +
    '</div>';
}

export function dhrTopLineCustomersHtml(){
  return DHR_KIT_CSS + TL_CSS + '<div class="dhr-tl">' + customersBody() + '</div>';
}

// ═══ Init ═════════════════════════════════════════════════════════════════════════════════════
// Called per sub-pane the first time that pane is on screen, because Chart.js measures a canvas
// whose offsetParent is null as zero and never recovers.
export function dhrTopLineInit(root, which){
  if (!root || typeof Chart === 'undefined') return;
  dWireTables(root);

  if (which === 'general'){
    var showG = dWirePicker(root, function(v){
      if (v === 'rev')     dStdRender('tlrev', revDerive, root);
      if (v === 'growth')  gwBuild(root);
      if (v === 'contrib') dStdRender('tlcon', contribDerive, root);
    });
    root.addEventListener('click', function(e){
      if (!e.target.closest) return;
      var b = e.target.closest('[data-gwp]');
      if (b){ gwSt.per = b.getAttribute('data-gwp'); dActivate(b); gwBuild(root); return; }
      b = e.target.closest('[data-gwe]');
      if (b){ gwSt.ent = b.getAttribute('data-gwe'); dActivate(b); gwBuild(root); return; }
    });
    showG('rev');
    return;
  }

  if (which === 'segments'){
    var showS = dWirePicker(root, function(v){
      if (v === 'mix')  dStdRender('tlmix', mixDerive, root);
      if (v === 'prof') dStdRender('tlprof', profDerive, root);
      if (v === 'core') dStdRender('tlcore', coreDerive, root);
    });
    showS('mix');
    return;
  }

  if (which === 'other'){
    var showO = dWirePicker(root, function(v){
      if (v === 'geo') dStdRender('tlgeo', geoDerive, root);
    });
    showO('geo');
  }
  // Customers is prose and a table only — nothing to build.
}
