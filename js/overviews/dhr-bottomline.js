// dhr-bottomline.js — Danaher, Deep Dive ▸ Bottom Line ▸ General.
//
// STRUCTURE: this follows `js/overviews/amzn.js` — the template ([[earnings-rollout]]). A master
// "Chart" picker swaps one section at a time (`.gen-sec[data-gsec]`, all hidden but the chosen
// one), each section is an `.ov-sec` with the §0.4 control row (`.mch-ctl` + `.acx-tog` pills),
// and the two time-series sections use the same scaffold Amazon's Profitability chart uses:
// title + `rs-msel` metric dropdown · mode pills · Range presets · source legend chips ·
// `ov-chart-card` · two-handle period slider with `rs-ticks` · a collapsible data table.
//
// Amazon's sections are margins / bridge / net / SBC. Danaher's are the same three plus the one
// reconciliation that dominates its P&L (GAAP → adjusted EPS) and the balance sheet, because
// Masimo closed inside the current quarter. SBC is not its own section here: Danaher's SBC is
// $298M on $24.6B of sales, an order of magnitude less interesting than its $1.9B of acquisition
// amortisation — which the EPS section is entirely about.
//
// The chart engine is shared with the other Danaher panes: see `dhr-chartkit.js`, which holds the
// copies of results.js / amzn.js internals that docs/CHART_ENGINE_REFERENCE.md §0.7 calls for.
//
// ── The basis trap, the thing most likely to be re-broken ─────────────────────────────────────
// Danaher separated Fortive (2016), Envista (2019) and Veralto (2023). Each separation restated
// only the two prior years, so the as-filed decade sits on THREE different companies:
//   2016         — includes dental (Envista) and Veralto
//   2017–2020    — ex-dental, still includes Veralto
//   2021–2025    — continuing operations as reported today
// A revenue line drawn straight across shows a 2016→2017 "decline" that is entirely the
// restatement. Every annual chart here carries a **Comparable** range preset that snaps to
// FY2021–FY2025, the tooltip names the basis of the year under the cursor, and the data sheet
// carries a Basis row.
//
// Sources: SEC XBRL company concepts (data.sec.gov, CIK 0000313616), newest filing per period so
// restatements are picked up. Q2/1H 2026 and every adjusted figure: Danaher's Q2 2026 press
// release and earnings presentation, 21-Jul-2026. FY25/FY24 total debt, equity and total assets:
// the FY2025 annual-report highlights.

import { esc, dStdScaffold, dStdRender, dWaterfall, dTbl, dPicker, dWirePicker, dWireTables, dActivate,
         fMs, fPct, fX, fEps, fEpsD, FMT_M, FMT_EPS, FMT_BPS,
         D_ACT, D_ADJ, D_REF, D_UP, D_DOWN, D_TOTAL, D_NEUT, DHR_KIT_CSS } from "./dhr-chartkit.js";
// The KPI strip and the expense explorer that close this pane. They take `A` as an argument rather
// than importing it, because that module would otherwise have to import this one back.
import { dhrExpenseHtml, dhrExpenseInit } from './dhr-expense.js';
// The ADJUSTED series are read from the Results dataset rather than re-derived here. It carries
// the reported adjusted figures straight from the 8-K releases — five quarters and three years of
// adjusted operating profit against the two-and-two the local AADJ/QADJ tables could reach — so
// this is both more complete and one home for the number.
import { dhrResults } from '../results-data/dhr.js';

// ═══ Data ═════════════════════════════════════════════════════════════════════════════════════

// Annual, $M except EPS. As-filed; newest restatement wins. `b` is the reporting basis.
// `epsC` is diluted EPS from CONTINUING operations — the one bottom-line series clean across all
// ten years. Balance-sheet fields are the fiscal-year-end instants from the same filings.
// Exported so the M&A pane can read the `acq` series (cash paid for acquisitions) without a second
// copy of it. One home for the numbers; dhr-manda.js imports FROM here, never the other way round.
export var A = [
  { y:2016, b:'a', rev:16882.4, cogs:7547.8, gp:9334.6, sga:5624.3, rnd: 975.1, op:2735.2, pretax:2611.3, tax:457.9, ni:2553.7, epsC:3.08,
    cfo:3521.8, capex:589.6, dep:545,   amort: 583, sbc:129.8, div:399.8, bb:null, acq: 4880.1,
    cash: 963.7, debtL: 9674.2, debtC:2594.8, equity:23002.8, assets:45295.3, gw:23826.9, intang:11818 },
  { y:2017, b:'b', rev:15518.8, cogs:6947.5, gp:8571.3, sga:5042.6, rnd: 956.4, op:2572.3, pretax:2543.2, tax:371,   ni:2492.1, epsC:3.08,
    cfo:3477.8, capex:570.7, dep:538.1, amort: 579, sbc:127.1, div:378.3, bb:null, acq:  385.8,
    cash: 630.3, debtL:10327.4, debtC: 194.7, equity:26358.2, assets:46648.6, gw:21768.6, intang:11667.1 },
  { y:2018, b:'b', rev:17049,   cogs:7544,   gp:9505,   sga:5391,   rnd:1059,   op:3055,   pretax:2962,   tax:556,   ni:2651,   epsC:3.39,
    cfo:4022,   capex:584,   dep:562,   amort: 616, sbc:138,   div:433,   bb:null, acq: 2173,
    cash: 787.8, debtL: 9688.5, debtC:  51.8, equity:28214.4, assets:47833,   gw:22581,   intang:10282.8 },
  { y:2019, b:'b', rev:17911,   cogs:7927,   gp:9984,   sga:5589,   rnd:1126,   op:3269,   pretax:3305,   tax:873,   ni:3008,   epsC:3.26,
    cfo:3952,   capex:636,   dep:564,   amort: 625, sbc:159,   div:527,   bb:null, acq:  331,
    cash:19912,  debtL:21517,   debtC: 212,   equity:30271,   assets:62082,   gw:22713,   intang: 9750 },
  { y:2020, b:'b', rev:22284,   cogs:9809,   gp:12475,  sga:6896,   rnd:1348,   op:4231,   pretax:4495,   tax:849,   ni:3646,   epsC:4.89,
    cfo:6208,   capex:791,   dep:637,   amort:1138, sbc:187,   div:615,   bb:null, acq:20971,
    cash: 6035,  debtL:21193,   debtC:  11,   equity:39766,   assets:76161,   gw:35420,   intang:21282 },
  { y:2021, b:'c', rev:24802,   cogs:9563,   gp:15239,  sga:6817,   rnd:1498,   op:6377,   pretax:6511,   tax:1064,  ni:6433,   epsC:7.28,
    cfo:8358,   capex:1240,  dep:674,   amort:1388, sbc:184,   div:742,   bb:null, acq:10901,
    cash: 2586,  debtL:22168,   debtC:   8,   equity:45167,   assets:83184,   gw:38682,   intang:22843 },
  { y:2022, b:'c', rev:26643,   cogs:10455,  gp:16188,  sga:7124,   rnd:1528,   op:7536,   pretax:7146,   tax:818,   ni:7209,   epsC:8.47,
    cfo:8519,   capex:1118,  dep:698,   amort:1434, sbc:295,   div:818,   bb:0,    acq:  582,
    cash: 5995,  debtL:19086,   debtC: 591,   equity:50082,   assets:84350,   gw:37276,   intang:19821 },
  { y:2023, b:'c', rev:23890,   cogs:9856,   gp:14034,  sga:7329,   rnd:1503,   op:5202,   pretax:5044,   tax:823,   ni:4764,   epsC:5.65,
    cfo:7164,   capex:1383,  dep:675,   amort:1491, sbc:306,   div:821,   bb:0,    acq: 5610,
    cash: 5864,  debtL:16707,   debtC:1695,   equity:53486,   assets:84488,   gw:41608,   intang:20746 },
  { y:2024, b:'c', rev:23875,   cogs:9669,   gp:14206,  sga:7759,   rnd:1584,   op:4863,   pretax:4646,   tax:747,   ni:3899,   epsC:5.29,
    cfo:6688,   capex:1392,  dep:721,   amort:1631, sbc:288,   div:768,   bb:5979, acq:  558,
    cash: 2078,  debtL:15500,   debtC: 505,   equity:49550,   assets:77542,   gw:40497,   intang:18568 },
  { y:2025, b:'c', rev:24568,   cogs:10045,  gp:14523,  sga:8235,   rnd:1598,   op:4690,   pretax:4233,   tax:633,   ni:3614,   epsC:5.03,
    cfo:6416,   capex:1156,  dep:750,   amort:1697, sbc:298,   div:878,   bb:3088, acq:    0,
    cash: 4615,  debtL:18416,   debtC:   2,   equity:52541,   assets:83464,   gw:43151,   intang:null }
];
var BASES = { a:'incl. dental + Veralto', b:'incl. Veralto', c:'continuing ops' };
var A_CMP_FROM = 5;                       // FY2021 — the first year on today's basis

// Quarterly, $M. 1Q23 onward only: that is as far back as the Veralto restatement reaches, so the
// whole series is on one basis. Q4 is never tagged as its own window — it is the fiscal year less
// the three published quarters, which reconciles exactly against the two Q4s Danaher did tag
// (4Q23 revenue 6,405 and gross profit 3,779 both check out). Net earnings starts at 1Q24: the
// 2023 quarters still carry Veralto as a discontinued operation.
var Q = [
  { p:'1Q23', rev:5949, gp:3662, sga:1772, rnd:373, op:1517, ni:null, d:false },
  { p:'2Q23', rev:5912, gp:3318, sga:1794, rnd:361, op:1163, ni:null, d:false },
  { p:'3Q23', rev:5624, gp:3275, sga:1728, rnd:362, op:1185, ni:null, d:false },
  { p:'4Q23', rev:6405, gp:3779, sga:2035, rnd:407, op:1337, ni:null, d:true  },
  { p:'1Q24', rev:5796, gp:3487, sga:1807, rnd:368, op:1312, ni:1088, d:false },
  { p:'2Q24', rev:5743, gp:3428, sga:1869, rnd:391, op:1168, ni: 907, d:false },
  { p:'3Q24', rev:5798, gp:3401, sga:2060, rnd:383, op: 958, ni: 818, d:false },
  { p:'4Q24', rev:6538, gp:3890, sga:2023, rnd:442, op:1425, ni:1086, d:true  },
  { p:'1Q25', rev:5741, gp:3511, sga:1858, rnd:379, op:1274, ni: 954, d:false },
  { p:'2Q25', rev:5936, gp:3523, sga:2360, rnd:403, op: 760, ni: 555, d:false },
  { p:'3Q25', rev:6053, gp:3523, sga:1991, rnd:378, op:1154, ni: 908, d:false },
  { p:'4Q25', rev:6838, gp:3966, sga:2026, rnd:438, op:1502, ni:1197, d:true  },
  { p:'1Q26', rev:5951, gp:3591, sga:1860, rnd:387, op:1344, ni:1029, d:false },
  { p:'2Q26', rev:6265, gp:3611, sga:2072, rnd:412, op:1127, ni: 870, d:false }
];

// The adjusted (non-GAAP) overlay. Danaher publishes it only where a release covers the period:
// the two second quarters and the two first halves. FY2025's adjusted operating margin comes from
// the CEO letter; there is no adjusted full-year gross profit or EBITDA anywhere, and none is
// invented here.
var QADJ = { '2Q25':{ cogs:2413, sga:1502, rnd:403, op:1618, ni:1292, eps:1.80 },
             '2Q26':{ cogs:2608, sga:1547, rnd:412, op:1698, ni:1375, eps:1.94 } };
var AADJ = { 2024:{ opm:28.4, eps:7.48 }, 2025:{ opm:28.2, eps:7.80 } };

// Half-years, GAAP and adjusted, with the non-operating detail the release prints line by line.
var H = [
  { p:'1H25', rev:11677, cogs:4643, gp:7034, sga:4218, rnd:782, op:2034, other:-121, intExp:143, intInc:14, pretax:1784, tax:275, ni:1509,
    adj:{ cogs:4628, sga:2950, rnd:782, op:3317, ni:2648, eps:3.68 } },
  { p:'1H26', rev:12216, cogs:5014, gp:7202, sga:3932, rnd:799, op:2471, other: -76, intExp:170, intInc:88, pretax:2313, tax:414, ni:1899,
    adj:{ cogs:4968, sga:2956, rnd:799, op:3493, ni:2838, eps:4.00 } }
];
var QDET = {
  '2Q25':{ p:'2Q25', rev:5936, cogs:2413, gp:3523, sga:2360, rnd:403, op:760,  other:-42, intExp:71,  intInc:8,  pretax:655,  tax:100, ni:555 },
  '2Q26':{ p:'2Q26', rev:6265, cogs:2654, gp:3611, sga:2072, rnd:412, op:1127, other:-3,  intExp:107, intInc:61, pretax:1078, tax:208, ni:870 }
};

// The GAAP → adjusted EPS bridge, $/share [press release]. Order is the order the release prints.
var BR_STEPS = [
  { k:'amort',  n:'Amortisation of acquisition intangibles' },
  { k:'fv',     n:'Fair-value net (gains) losses on investments' },
  { k:'masimo', n:'Acquisition-related items (Masimo)' },
  { k:'imp',    n:'Impairments' },
  { k:'disp',   n:'Gain on product-line disposition' },
  { k:'tax',    n:'Tax effect of the above' },
  { k:'disc',   n:'Discrete tax adjustments' },
  { k:'round',  n:'Rounding' }
];
var EPSBR = {
  '2Q26':{ gaap:1.23, amort:0.65, fv:0.01, masimo:0.15, imp:0,    disp:0,     tax:-0.13, disc:0.03, round:0,     adj:1.94 },
  '2Q25':{ gaap:0.77, amort:0.59, fv:0.06, masimo:0,    imp:0.60, disp:0,     tax:-0.26, disc:0.03, round:0.01,  adj:1.80 },
  '1H26':{ gaap:2.68, amort:1.26, fv:0.12, masimo:0.18, imp:0,    disp:0,     tax:-0.27, disc:0.03, round:0,     adj:4.00 },
  '1H25':{ gaap:2.10, amort:1.16, fv:0.19, masimo:0,    imp:0.62, disp:-0.01, tax:-0.39, disc:0.02, round:-0.01, adj:3.68 }
};

// The post-Masimo balance sheet — Q2'26 10-Q, appended to the annual series as its own point.
var BSQ = { p:"Q2'26", cash:4348, debtL:25147, debtC:1411, equity:52581, assets:92367, gw:47414, intang:null };

// ═══ Section 1 — Profitability & margins ══════════════════════════════════════════════════════
// Bars are the $ amount, lines are the margin on the right axis. The chips are the two BASES
// Danaher reports on — GAAP and adjusted — and hiding one drops its bar and its line together.
// `adjKey` points at the Results dataset metric that carries the REPORTED adjusted figure. Where
// it exists it wins outright: it is what Danaher published, not a margin percentage multiplied
// back out. `adjQ`/`adjA` stay as the fallback for the two lines the dataset does not carry, and a
// metric never mixes the two — one series, one provenance.
var MARG = {
  gp:     { lab:'Gross profit',      num:function(r){ return r.gp; },            adjQ:function(a, r){ return r.rev - a.cogs; }, adjA:null },
  op:     { lab:'Operating profit',  num:function(r){ return r.op; },            adjKey:'adjopinc' },
  ebitda: { lab:'EBITDA',            num:function(r){ return r.op + r.dep + r.amort; }, annualOnly:true, adjKey:'adjebitda' },
  ni:     { lab:'Net earnings',      num:function(r){ return r.ni; },            adjQ:function(a){ return a.ni; }, adjA:null },
  fcf:    { lab:'Free cash flow',    num:function(r){ return r.cfo - r.capex; }, annualOnly:true }
};

// Pull an adjusted series out of the Results dataset, aligned to this pane's own row order.
// Annual rows are keyed by year ('2025'), quarterly by period ('2Q26'); anything the dataset does
// not reach back to stays null, which is what the chart wants anyway.
function resAdj(gran, key, rows){
  var v = dhrResults.views[gran === 'y' ? 'y' : 'q'], m = v && v.metrics[key];
  if (!m) return rows.map(function(){ return null; });
  return rows.map(function(r){
    var i = m.periods.indexOf(gran === 'y' ? String(r.y) : r.p);
    return (i < 0 || m.act[i] == null) ? null : m.act[i];
  });
}
function margDerive(st){
  var key = st.sel || 'op', m = MARG[key], gran = st.modes.gran || 'y';
  if (gran === 'q' && m.annualOnly)
    return { empty: m.lab + ' is built annually only — Danaher publishes no quarterly depreciation or capital expenditure, so a quarterly figure would have to be invented. Switch the Period pill back to Annual.' };
  var rows = gran === 'y' ? A : Q;
  var labels = rows.map(function(r){ return gran === 'y' ? ('FY' + String(r.y).slice(2)) : r.p; });
  var gaapN = rows.map(function(r){ var v = m.num(r); return (v == null || isNaN(v)) ? null : v; });
  var adjN = m.adjKey ? resAdj(gran, m.adjKey, rows) : rows.map(function(r){
    if (gran === 'q'){ var a = QADJ[r.p]; return (a && m.adjQ) ? m.adjQ(a, r) : null; }
    var aa = AADJ[r.y]; return (aa && m.adjA) ? m.adjA(r, aa) : null;
  });
  var hasAdj = adjN.some(function(v){ return v != null; });
  // The basis toggle. It only means anything where an adjusted figure exists, so it is hidden
  // rather than shown-and-inert on the lines Danaher never adjusts (free cash flow, and gross
  // profit annually). Default 'both' keeps what the pane did before the toggle existed.
  var basis = hasAdj ? (st.modes.basis || 'both') : 'gaap';
  var showG = basis !== 'adj', showA = hasAdj && basis !== 'gaap';
  function marg(arr){ return arr.map(function(v, i){ return (v == null || !rows[i].rev) ? null : Math.round(v/rows[i].rev*1000)/10; }); }
  var series = [];
  if (showG) series.push({ k:'g$', grp:'gaap', src:'GAAP', label:m.lab + ' — GAAP', color:D_ACT, type:'bar', data:gaapN });
  if (showA) series.push({ k:'a$', grp:'adj', src:'Adjusted', label:m.lab + ' — adjusted', color:D_ADJ, type:'bar', data:adjN });
  if (showG) series.push({ k:'gM', grp:'gaap', src:'GAAP', label:'Margin — GAAP', color:D_ACT, type:'line', yAxisID:'y2', data:marg(gaapN) });
  if (showA) series.push({ k:'aM', grp:'adj', src:'Adjusted', label:'Margin — adjusted', color:D_ADJ, type:'line', yAxisID:'y2', dash:true, data:marg(adjN) });
  return {
    labels: labels, series: series, yFmt: fMs, y2Fmt: fPct,
    cmpFrom: gran === 'y' ? A_CMP_FROM : 0,
    hideModes: hasAdj ? [] : ['basis'],
    legNote: 'Bars = $M &nbsp;·&nbsp; lines = margin (right axis)' +
      (hasAdj
        ? (m.adjKey ? ' &nbsp;·&nbsp; adjusted is the figure Danaher reported in each release, not a margin multiplied back out — it starts where the releases do'
                    : ' &nbsp;·&nbsp; adjusted is derived from the release detail for the periods a release covers')
        : ' &nbsp;·&nbsp; Danaher publishes no adjusted ' + m.lab.toLowerCase() + ' for these periods'),
    tblTitle: m.lab + ' — ' + (gran === 'y' ? 'annual' : 'quarterly') + ', $M and margin',
    note: gran === 'y'
      ? function(i){ return 'Reporting basis: ' + BASES[A[i].b]; }
      : function(i){ return Q[i].d ? 'Fourth quarter — derived as the fiscal year less the three published quarters' : ''; },
    extraRows: gran === 'y'
      ? function(lo, hi){ return [['Reporting basis'].concat(A.slice(lo, hi+1).map(function(r){ return BASES[r.b]; }))]; }
      : function(lo, hi){ return [['Source'].concat(Q.slice(lo, hi+1).map(function(r){ return r.d ? 'derived (FY − 9M)' : 'as filed'; }))]; }
  };
}

// ═══ Section 2 — the bridge, revenue → operating profit ═══════════════════════════════════════
var brSt = { mode:'buildup', gran:'y', per:2025, perQ:'1H26', from:2022, to:2025, basis:'gaap' };
var BR_LINES = [{ k:'cogs', lab:'Cost of sales', c:'#8DA2B8' }, { k:'sga', lab:'SG&A', c:'#6B7683' }, { k:'rnd', lab:'R&D', c:'#A9B4C0' }];
function brRow(gran, per){
  if (gran === 'y'){
    var r = A.filter(function(x){ return x.y === per; })[0];
    return r ? { lab:'FY' + String(r.y).slice(2), rev:r.rev, cogs:r.cogs, sga:r.sga, rnd:r.rnd, op:r.op, adj:null, basis:r.b } : null;
  }
  var h = H.filter(function(x){ return x.p === per; })[0];
  if (h) return { lab:h.p, rev:h.rev, cogs:h.cogs, sga:h.sga, rnd:h.rnd, op:h.op, adj:h.adj };
  var q = Q.filter(function(x){ return x.p === per; })[0];
  if (!q) return null;
  return { lab:q.p, rev:q.rev, cogs:q.rev - q.gp, sga:q.sga, rnd:q.rnd, op:q.op, adj:QADJ[q.p] || null };
}
function brBuildupSteps(r, useAdj){
  var src = (useAdj && r.adj) ? r.adj : r;
  var run = r.rev;
  var steps = [{ label:'Revenue', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:r.rev }];
  BR_LINES.forEach(function(l){
    var c = src[l.k] || 0, hi = run; run = hi - c;
    steps.push({ label:l.lab, kind:'down', color:l.c, dc:D_NEUT, range:[Math.min(run,hi), Math.max(run,hi)], runAfter:run, val:-c });
  });
  steps.push({ label:'Operating profit', kind:'total', color:D_UP, range:[0, run], runAfter:null, val:run });
  return steps;
}
// Operating-margin change between two years, decomposed by expense line (percentage points → bps).
function brBpsSteps(p0, p1){
  var m0 = p0.op/p0.rev*100, run = m0;
  var steps = [{ label:p0.lab, kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:m0 }];
  BR_LINES.forEach(function(l){
    var contrib = (p0[l.k]/p0.rev - p1[l.k]/p1.rev) * 100, lo = run; run = lo + contrib;
    steps.push({ label:l.lab, kind:contrib >= 0 ? 'up' : 'down', color:contrib >= 0 ? D_UP : D_DOWN,
                 range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:contrib });
  });
  steps.push({ label:p1.lab, kind:'total', color:D_TOTAL, range:[0, run], runAfter:null, val:run });
  return steps;
}
function brBody(){
  var yBtns = function(attr, sel){ return A.map(function(r){
    return '<button type="button" data-' + attr + '="' + r.y + '"' + (r.y === sel ? ' class="active"' : '') + '>FY' + String(r.y).slice(2) + '</button>'; }).join(''); };
  var pBtns = ['1H26','1H25','2Q26','2Q25','1Q26','4Q25','3Q25'].map(function(p){
    return '<button type="button" data-brp="' + p + '"' + (p === brSt.perQ ? ' class="active"' : '') + '>' + p + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">The bridge — how revenue becomes operating profit</div>' +
    '<div class="mch-ctl">' +
      '<span class="acx-tog br-mode"><button type="button" data-brm="buildup" class="active">Build-up ($M)</button>' +
        '<button type="button" data-brm="bps">Margin change (bps)</button></span><span></span></div>' +
    '<div class="mch-ctl br-ctl-bu" style="margin:0 0 8px"><span></span>' +
      '<span style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        '<span class="acx-tog br-basis"><button type="button" data-brb="gaap" class="active">GAAP</button><button type="button" data-brb="adj">Adjusted</button></span>' +
        '<span class="acx-tog br-gran"><button type="button" data-brg="y" class="active">Annual</button><button type="button" data-brg="q">Interim</button></span>' +
        '<span class="acx-tog br-yr">' + yBtns('bry', brSt.per) + '</span>' +
        '<span class="acx-tog br-per" style="display:none">' + pBtns + '</span></span></div>' +
    '<div class="mch-ctl br-ctl-bps" style="display:none;margin:0 0 8px"><span></span>' +
      '<span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        '<span class="dbl-lbl">From</span><span class="acx-tog br-from">' + yBtns('brf', brSt.from) + '</span>' +
        '<span class="dbl-lbl">to</span><span class="acx-tog br-to">' + yBtns('brt', brSt.to) + '</span></span></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrBr"></canvas></div></div>' +
    '<div id="dhrBr-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrBrCap"></div></div>';
}
function brBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="bridge"]'); if (!pane) return;
  var cap = pane.querySelector('#dhrBrCap');
  if (brSt.mode === 'bps'){
    var p0 = brRow('y', brSt.from), p1 = brRow('y', brSt.to);
    if (!p0 || !p1) return;
    dWaterfall(root, 'dhrBr', brBpsSteps(p0, p1), FMT_BPS, 'The margin walk — every expense line');
    if (cap) cap.innerHTML = 'Operating margin went from <b>' + fPct(p0.op/p0.rev*100) + '</b> in ' + esc(p0.lab) +
      ' to <b>' + fPct(p1.op/p1.rev*100) + '</b> in ' + esc(p1.lab) + '. A bar down means that line <b>took</b> margin; ' +
      'up means it gave margin back. Each line is read as a share of sales, so a cost can compress the margin while its ' +
      'absolute dollars fall.' +
      (p0.basis !== p1.basis
        ? ' <b>These two years are on different reporting bases</b> (' + esc(BASES[p0.basis]) + ' vs ' + esc(BASES[p1.basis]) +
          '). The walk still adds up, but part of the move is the separation, not the business.'
        : '');
    return;
  }
  var r = brRow(brSt.gran, brSt.gran === 'y' ? brSt.per : brSt.perQ);
  if (!r) return;
  var wantAdj = brSt.basis === 'adj', useAdj = wantAdj && !!r.adj;
  dWaterfall(root, 'dhrBr', brBuildupSteps(r, useAdj), FMT_M, 'The build-up — every line');
  if (cap) cap.innerHTML = esc(r.lab) + ' — ' + (useAdj ? 'adjusted' : 'GAAP') + ' operating margin <b>' +
    fPct(((useAdj ? r.adj.op : r.op)/r.rev)*100) + '</b> on <b>' + fMs(r.rev) + 'M</b> of sales. ' +
    (wantAdj && !r.adj ? '<b>Danaher publishes no adjusted P&amp;L for this period</b>, so the GAAP build-up is drawn. ' +
       'Adjusted lines exist only for the periods a press release reconciles — the second quarters and the first halves. ' : '') +
    'Three lines is the whole income statement: Danaher reports no other operating expense.';
}

// ═══ Section 3 — operating profit → net earnings ══════════════════════════════════════════════
var nbSt = { per:'FY25' };
function nbRow(key){
  if (key.indexOf('FY') === 0){
    var y = 2000 + (+key.slice(2)), r = A.filter(function(x){ return x.y === y; })[0];
    if (!r) return null;
    // The annual filings do not split non-operating into interest and other, so the full-year walk
    // carries one reconciling step: pretax less operating profit. It ties to reported pretax exactly.
    return { lab:key, y:y, op:r.op, nonop:r.pretax - r.op, pretax:r.pretax, tax:r.tax, ni:r.ni, rev:r.rev, split:false, basis:r.b };
  }
  var h = H.filter(function(x){ return x.p === key; })[0] || QDET[key];
  if (!h) return null;
  return { lab:h.p, op:h.op, other:h.other, intExp:h.intExp, intInc:h.intInc, pretax:h.pretax, tax:h.tax, ni:h.ni, rev:h.rev, split:true };
}
function nbSteps(r){
  var run = r.op;
  var steps = [{ label:'Operating profit', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:r.op }];
  function step(lab, d){ var lo = run; run = lo + d;
    steps.push({ label:lab, kind:d >= 0 ? 'up' : 'down', color:D_NEUT, dc:D_NEUT, range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:d }); }
  if (r.split){ step('Other income (expense)', r.other); step('Interest expense', -r.intExp); step('Interest income', r.intInc); }
  else { step('Non-operating, net', r.nonop); }
  step('Income taxes', -r.tax);
  var plug = r.ni - run;
  if (Math.abs(plug) >= 5) step('Discontinued ops, NCI & other', plug);
  steps.push({ label:'Net earnings', kind:'total', color:D_UP, range:[0, r.ni], runAfter:null, val:r.ni });
  return steps;
}
function nbBody(){
  var keys = A.map(function(r){ return 'FY' + String(r.y).slice(2); }).concat(['1H26','1H25','2Q26','2Q25']);
  var btns = keys.map(function(k){ return '<button type="button" data-nbp="' + k + '"' + (k === nbSt.per ? ' class="active"' : '') + '>' + k + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">Operating profit → net earnings</div>' +
    '<div class="mch-ctl"><span></span><span class="acx-tog nb-per" style="flex-wrap:wrap">' + btns + '</span></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrNb"></canvas></div></div>' +
    '<div id="dhrNb-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrNbCap"></div></div>';
}
function nbBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="net"]'); if (!pane) return;
  var r = nbRow(nbSt.per); if (!r) return;
  dWaterfall(root, 'dhrNb', nbSteps(r), FMT_M, 'The walk — every step');
  var cap = pane.querySelector('#dhrNbCap');
  var mixed = !r.split && r.y >= 2021 && r.y <= 2023;
  if (cap) cap.innerHTML = esc(r.lab) + ' — operating margin <b>' + fPct(r.op/r.rev*100) + '</b>, net margin <b>' +
    fPct(r.ni/r.rev*100) + '</b>, effective tax rate <b>' + fPct(r.tax/r.pretax*100) + '</b>. ' +
    (r.split
      ? 'The release splits non-operating into other income, interest expense and interest income. Interest income has ' +
        'gone from immaterial to a real line as the post-Cytiva cash balance rebuilt.'
      : 'The annual filings do not split non-operating income, so this is one reconciling step — it ties to reported ' +
        'pretax earnings exactly. Pick an interim period to see it split into other income, interest expense and interest income.') +
    (mixed ? ' <b>Careful with this year:</b> revenue and operating profit are restated to continuing operations, but ' +
             'net earnings still carry Veralto as a discontinued operation — that is the reconciling step near the end. ' +
             'The walk adds up; the net margin does not compare like with like.' : '');
}

// ═══ Section 4 — GAAP → adjusted EPS ══════════════════════════════════════════════════════════
var epsSt = { per:'2Q26', hidden:{} };
function epsLive(){ var d = EPSBR[epsSt.per]; return BR_STEPS.filter(function(s){ return d[s.k] !== 0; }); }
function epsShown(){ return epsLive().filter(function(s){ return !epsSt.hidden[s.k]; }); }   // rule 2 — the ONE predicate
function epsSteps(){
  var d = EPSBR[epsSt.per], run = d.gaap;
  var steps = [{ label:'Diluted EPS (GAAP)', kind:'base', color:D_ACT, range:[0, run], runAfter:run, val:d.gaap }];
  epsShown().forEach(function(s){
    var lo = run; run = lo + d[s.k];
    steps.push({ label:s.n, kind:d[s.k] >= 0 ? 'up' : 'down', color:d[s.k] >= 0 ? D_ADJ : D_DOWN, dc:D_NEUT,
                 range:[Math.min(lo,run), Math.max(lo,run)], runAfter:run, val:d[s.k] });
  });
  var full = epsShown().length === epsLive().length;
  steps.push({ label: full ? 'Adjusted diluted EPS' : 'Subtotal of what is shown', kind:'total', color:D_ADJ,
               range:[0, full ? d.adj : run], runAfter:null, val: full ? d.adj : run });
  return steps;
}
function epsBody(){
  var btns = ['2Q26','2Q25','1H26','1H25'].map(function(p){
    return '<button type="button" data-epsp="' + p + '"' + (p === epsSt.per ? ' class="active"' : '') + '>' + p + '</button>'; }).join('');
  return '<div class="ov-sec"><div class="ov-sec-h">GAAP → adjusted EPS — what the adjustment actually is</div>' +
    '<div class="mch-ctl"><span></span><span class="acx-tog eps-per">' + btns + '</span></div>' +
    '<div class="ave-leg" id="dhrEpsLeg"></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrEps"></canvas></div></div>' +
    '<div id="dhrEps-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrEpsCap"></div></div>';
}
function epsBuild(root){
  var pane = root.querySelector('.gen-sec[data-gsec="eps"]'); if (!pane) return;
  var d = EPSBR[epsSt.per];
  var leg = pane.querySelector('#dhrEpsLeg');
  if (leg) leg.innerHTML = epsLive().map(function(s){
    return '<button type="button" class="rs-leg' + (epsSt.hidden[s.k] ? ' off' : '') + '" data-epsleg="' + esc(s.k) + '">' +
      '<span class="ave-leg-act" style="background:' + (d[s.k] >= 0 ? D_ADJ : D_DOWN) + '"></span>' + esc(s.n) + ' ' + fEpsD(d[s.k]) + '</button>';
  }).join('') + '<span class="dbl-legnote">Hide an adjustment and the foot becomes a subtotal, not the published figure</span>';
  dWaterfall(root, 'dhrEps', epsSteps(), FMT_EPS, 'The reconciliation — every line the release prints');
  var pr = QDET[epsSt.per] || H.filter(function(x){ return x.p === epsSt.per; })[0];
  var adjOp = pr ? (pr.adj ? pr.adj.op : (QADJ[epsSt.per] ? QADJ[epsSt.per].op : null)) : null;
  var cap = pane.querySelector('#dhrEpsCap');
  if (cap) cap.innerHTML = (pr && adjOp != null
      ? 'In ' + esc(epsSt.per) + ' the adjusted operating margin was <b>' + fPct(adjOp/pr.rev*100) +
        '</b> against a GAAP <b>' + fPct(pr.op/pr.rev*100) + '</b>. ' : '') +
    'The gap is <b>' + fEps(d.adj - d.gaap) + '</b> a share, of which <b>' + fEps(d.amort) + '</b> is amortisation of ' +
    'acquisition intangibles. That is not a one-off: Danaher guides it to roughly <b>$1,900M for FY2026</b>, and it has ' +
    'risen every year since 2019 — $625M in FY2019, $1,697M in FY2025. It is the accounting cost of a strategy built on ' +
    'buying companies, so a reader who takes the adjusted number is accepting that the price paid for those businesses ' +
    'never runs through the P&amp;L.';
}

// ═══ Section 5 — the balance sheet & leverage ═════════════════════════════════════════════════
// EBITDA here is GAAP operating profit plus depreciation and amortisation — stated, not Danaher's
// adjusted EBITDA, which it does not publish for a full year. Q2'26 has no trailing EBITDA that
// includes Masimo, so its leverage is measured against FY2025 and flagged as a ceiling.
var BS_MET = {
  net:    { lab:'Net debt',             f:function(r){ return r.debtL + r.debtC - r.cash; } },
  debt:   { lab:'Total debt',           f:function(r){ return r.debtL + r.debtC; } },
  cash:   { lab:'Cash and equivalents', f:function(r){ return r.cash; } },
  equity: { lab:"Stockholders' equity", f:function(r){ return r.equity; } },
  gw:     { lab:'Goodwill',             f:function(r){ return r.gw; } },
  assets: { lab:'Total assets',         f:function(r){ return r.assets; } }
};
function bsRows(){
  return A.map(function(r){ return { p:'FY' + String(r.y).slice(2), r:r, ebitda:r.op + r.dep + r.amort, pf:false }; })
          .concat([{ p:BSQ.p, r:BSQ, ebitda:null, pf:true }]);
}
function bsDerive(st){
  var m = BS_MET[st.sel || 'net'], rows = bsRows();
  var fy25 = A[A.length - 1], fy25Ebitda = fy25.op + fy25.dep + fy25.amort;
  var amounts = rows.map(function(x){ var v = m.f(x.r); return (v == null || isNaN(v)) ? null : v; });
  var lev = rows.map(function(x){
    var nd = x.r.debtL + x.r.debtC - x.r.cash, eb = x.ebitda == null ? fy25Ebitda : x.ebitda;
    return (nd == null || !eb) ? null : Math.round(nd/eb*100)/100;
  });
  return {
    labels: rows.map(function(x){ return x.p; }),
    series:[{ k:'amt', grp:'amt', src:m.lab, label:m.lab, color:D_ACT, type:'bar', data:amounts },
            { k:'lev', grp:'lev', src:'Net debt / EBITDA', label:'Net debt / EBITDA', color:D_REF, type:'line', yAxisID:'y2', data:lev }],
    yFmt:fMs, y2Fmt:fX, cmpFrom:A_CMP_FROM,
    legNote:'Bars = $M &nbsp;·&nbsp; line = leverage (right axis) &nbsp;·&nbsp; the last point is the post-Masimo quarter, not a year-end',
    tblTitle:m.lab + ' — fiscal year-ends plus the post-Masimo quarter',
    note:function(i){ return rows[i].pf ? 'Post-Masimo. Leverage measured against FY2025 EBITDA — the ceiling, not a run-rate.' : ''; },
    extraRows:function(lo, hi){
      return [['EBITDA (op. profit + D&A)'].concat(rows.slice(lo, hi+1).map(function(x){ return x.ebitda == null ? 'n/a — see note' : fMs(x.ebitda); }))];
    }
  };
}

// ═══ The data sheet — the trailing collapsible (Amazon's aCollap slot) ════════════════════════
var SHEET = [
  ['Revenue',                     function(r){ return fMs(r.rev); }],
  ['Gross profit',                function(r){ return fMs(r.gp); }],
  ['Gross margin',                function(r){ return fPct(r.gp/r.rev*100); }],
  ['SG&A',                        function(r){ return fMs(r.sga); }],
  ['R&D',                         function(r){ return fMs(r.rnd); }],
  ['Operating profit',            function(r){ return fMs(r.op); }],
  ['Operating margin',            function(r){ return fPct(r.op/r.rev*100); }],
  ['Income taxes',                function(r){ return fMs(r.tax); }],
  ['Diluted EPS, continuing ops', function(r){ return fEps(r.epsC); }],
  ['Operating cash flow',         function(r){ return fMs(r.cfo); }],
  ['Capital expenditure',         function(r){ return fMs(r.capex); }],
  ['Free cash flow',              function(r){ return fMs(r.cfo - r.capex); }],
  ['Depreciation',                function(r){ return fMs(r.dep); }],
  ['Amortisation of intangibles', function(r){ return fMs(r.amort); }],
  ['Stock-based compensation',    function(r){ return fMs(r.sbc); }],
  ['Dividends paid',              function(r){ return fMs(r.div); }],
  ['Share repurchases',           function(r){ return r.bb == null ? null : fMs(r.bb); }],
  ['Acquisitions, net of cash',   function(r){ return fMs(r.acq); }],
  ['Cash and equivalents',        function(r){ return fMs(r.cash); }],
  ['Total debt',                  function(r){ return fMs(r.debtL + r.debtC); }],
  ['Net debt',                    function(r){ return fMs(r.debtL + r.debtC - r.cash); }],
  ["Stockholders' equity",        function(r){ return fMs(r.equity); }],
  ['Total assets',                function(r){ return fMs(r.assets); }],
  ['Goodwill',                    function(r){ return fMs(r.gw); }],
  ['Intangibles, net',            function(r){ return r.intang == null ? null : fMs(r.intang); }],
  ['Reporting basis',             function(r){ return BASES[r.b]; }]
];
function sheetHtml(){
  return dTbl('dhrSheet', 'The data sheet — every annual line, as filed ($M)',
    ['Line'].concat(A.map(function(r){ return 'FY' + String(r.y).slice(2); })),
    SHEET.map(function(s){ return [s[0]].concat(A.map(function(r){ return s[1](r); })); }));
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
var SECTIONS = [
  ['margins', 'Profitability & margins'],
  ['bridge',  'The bridge — revenue → operating profit'],
  ['net',     'Operating profit → net earnings'],
  ['eps',     'GAAP → adjusted EPS'],
  ['bs',      'Balance sheet & leverage']
];

export function dhrBottomLineHtml(){
  if (!A.length) return '';                                   // rule 6 — nothing, never broken
  return DHR_KIT_CSS + '<style>.dhr-bl{max-width:1000px}</style><div class="dhr-bl">' +
    '<p class="dbl-lede">Danaher earns a 59% gross margin and turns more than all of its net income into cash — ' +
      'FY2025 was the 34th consecutive year of free cash flow exceeding net earnings. Two things sit against that: ' +
      'the operating margin has fallen in every year since 2022, and the gap between GAAP and adjusted earnings is a ' +
      'recurring ~$1.9B of acquisition amortisation rather than a one-off.</p>' +
    dPicker(SECTIONS, 'margins') +
    '<div class="gen-sec" data-gsec="margins">' + dStdScaffold({
      id:'dmarg', title:'Profitability & margins', height:360,
      metricSel:[{ v:'gp', label:'Gross profit' }, { v:'op', label:'Operating profit', on:true },
                 { v:'ebitda', label:'EBITDA (op. profit + D&A)' }, { v:'ni', label:'Net earnings' },
                 { v:'fcf', label:'Free cash flow' }],
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] },
             { cls:'basis', label:'Basis', opts:[{ v:'both', label:'Both', on:true }, { v:'gaap', label:'GAAP' }, { v:'adj', label:'Adjusted' }] }],
      presets:[['all','All'],['cmp','Comparable'],['l5','Last 5'],['l8','Last 8']],
      note:'Every figure is as-filed, from Danaher\'s own filings through SEC XBRL, newest filing per period so ' +
        'restatements are picked up. <b>Comparable</b> snaps the annual window to FY2021–FY2025, the years on today\'s ' +
        'reporting basis; before that the series carries Veralto, and before FY2017 the dental business too — the ' +
        'tooltip names the basis of whichever year is under the cursor. The quarterly view starts at 1Q23 for the same ' +
        'reason, and its fourth quarters are the fiscal year less the three published quarters, which is how Danaher ' +
        'leaves them: it never tags Q4 on its own.'
    }) + '</div>' +
    '<div class="gen-sec" data-gsec="bridge" hidden>' + brBody() + '</div>' +
    '<div class="gen-sec" data-gsec="net" hidden>' + nbBody() + '</div>' +
    '<div class="gen-sec" data-gsec="eps" hidden>' + epsBody() + '</div>' +
    '<div class="gen-sec" data-gsec="bs" hidden>' + dStdScaffold({
      id:'dbs', title:'Balance sheet & leverage', height:360,
      metricSel:[{ v:'net', label:'Net debt', on:true }, { v:'debt', label:'Total debt' },
                 { v:'cash', label:'Cash and equivalents' }, { v:'equity', label:"Stockholders' equity" },
                 { v:'gw', label:'Goodwill' }, { v:'assets', label:'Total assets' }],
      modes:[], presets:[['all','All'],['cmp','Comparable'],['l5','Last 5']],
      note:'Masimo closed inside the second quarter of 2026, so the last point is not a year-end — it is the first ' +
        'balance sheet that carries the acquisition. Gross debt went from $18,418M to $26,558M and net debt from ' +
        '$13,803M to $22,210M in a single quarter; goodwill rose $4,263M. Leverage at that point is post-Masimo net ' +
        'debt against <b>FY2025</b> EBITDA — Masimo adds to the debt but to none of the earnings in the denominator, ' +
        'and no trailing figure including it exists yet, so read it as the ceiling. The FY2019 cash spike is the ' +
        'Cytiva pre-funding: Danaher raised the money months before the deal closed in March 2020.'
    }) + '</div>' +
    dhrExpenseHtml(A) +
    sheetHtml() +
    '</div>';
}

export function dhrBottomLineInit(root){
  if (!root || typeof Chart === 'undefined') return;
  dWireTables(root);
  // The expense explorer sits BELOW the section picker, so it is on screen whichever section is
  // chosen and is wired once here rather than per section. It draws inline SVG, not Chart.js, so
  // it has no offsetParent problem to wait for.
  dhrExpenseInit(root);

  // Each section builds the first time it is shown — Chart.js measures a canvas whose
  // offsetParent is null as zero and never recovers.
  function showSection(v){
    root.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden = (s.getAttribute('data-gsec') !== v); });
    if (v === 'margins') dStdRender('dmarg', margDerive, root);
    if (v === 'bridge')  brBuild(root);
    if (v === 'net')     nbBuild(root);
    if (v === 'eps')     epsBuild(root);
    if (v === 'bs')      dStdRender('dbs', bsDerive, root);
  }
  var show = dWirePicker(root, showSection);

  // One delegated handler on the pane root, never on document (§12, invariant 2).
  root.addEventListener('click', function(e){
    var t = e.target; if (!t.closest) return;
    function hit(attr){ return t.closest('[data-' + attr + ']'); }
    var activate = dActivate;
    var b, pane;

    if ((b = hit('brm'))){
      brSt.mode = b.getAttribute('data-brm'); activate(b);
      pane = root.querySelector('.gen-sec[data-gsec="bridge"]');
      pane.querySelector('.br-ctl-bu').style.display = brSt.mode === 'buildup' ? '' : 'none';
      pane.querySelector('.br-ctl-bps').style.display = brSt.mode === 'bps' ? '' : 'none';
      brBuild(root); return;
    }
    if ((b = hit('brb'))){ brSt.basis = b.getAttribute('data-brb'); activate(b); brBuild(root); return; }
    if ((b = hit('brg'))){
      brSt.gran = b.getAttribute('data-brg'); activate(b);
      pane = root.querySelector('.gen-sec[data-gsec="bridge"]');
      pane.querySelector('.br-yr').style.display = brSt.gran === 'y' ? '' : 'none';
      pane.querySelector('.br-per').style.display = brSt.gran === 'q' ? '' : 'none';
      brBuild(root); return;
    }
    if ((b = hit('bry'))){ brSt.per = +b.getAttribute('data-bry'); activate(b); brBuild(root); return; }
    if ((b = hit('brp'))){ brSt.perQ = b.getAttribute('data-brp'); activate(b); brBuild(root); return; }
    if ((b = hit('brf'))){ brSt.from = +b.getAttribute('data-brf'); activate(b); brBuild(root); return; }
    if ((b = hit('brt'))){ brSt.to = +b.getAttribute('data-brt'); activate(b); brBuild(root); return; }
    if ((b = hit('nbp'))){ nbSt.per = b.getAttribute('data-nbp'); activate(b); nbBuild(root); return; }
    if ((b = hit('epsp'))){ epsSt.per = b.getAttribute('data-epsp'); epsSt.hidden = {}; activate(b); epsBuild(root); return; }
    if ((b = hit('epsleg'))){ var k = b.getAttribute('data-epsleg'); epsSt.hidden[k] = !epsSt.hidden[k]; epsBuild(root); return; }
  });

  show('margins');
}
