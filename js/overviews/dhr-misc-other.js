// dhr-misc-other.js — Danaher, Deep Dive ▸ Miscellaneous ▸ Other Analysis.
//
// WHY THIS PANE EXISTS. Danaher changed what "core sales growth" means TWICE in two quarters:
// respiratory testing was excluded starting with the Q2 2026 10-Q, and tariff refunds returned to
// customers will be excluded starting with the Q3 2026 10-Q. A new adjusted metric introduced in a
// year when the old one looks weaker is a disclosure choice, and this is where that choice gets
// measured rather than asserted. The same question runs through the second section: adjusted EPS
// excludes ~$1.9B a year of acquisition amortisation, which is not an unusual item for a company
// that grows by acquisition — it is the cost of the strategy.
//
// STRUCTURE follows the house mold (amzn.js, and dhr-bottomline.js beside it): a master "Chart"
// picker swaps one `.gen-sec[data-gsec]` at a time, every time series uses the shared dStd*
// scaffold from dhr-chartkit.js, and the two reference sections that have no chart in them — the
// fiscal calendar and the regulatory framework — are prose cards in the same visual language.
//
// ⚠ SIGN CONVENTION — the thing most likely to be re-broken. Danaher prints its growth bridges in
// a RECONCILING convention:
//        Total + Acquisitions + FX = Core        Core + Respiratory = Core ex-respiratory
// so a printed "(1.0)%" for FX means FX ADDED 1.0pp to reported growth. Everything drawn on this
// pane is in PLAIN READING — a tailwind is positive, a headwind is negative — which is the
// OPPOSITE sign to the printed rows for acquisitions, FX and respiratory. The published rows are
// carried verbatim in the data table underneath so both readings are visible. The IR deck flips
// the respiratory row again relative to the press release; it is normalised here on ingest.
// Verified against all published rows: Total + Acq + FX = Core reconciles in every quarter.
//
// SOURCES. Growth series: Danaher Q2 2026 press release and earnings presentation, 21-Jul-2026
// (deck slide 7 for the segment matrix). Adjusting items and the EPS bridge: the same press
// release. The corporate ("Other") line and every segment figure: js/results-data/dhr.js, which
// reads Danaher's 10-K and 10-Q segment notes off SEC EDGAR. Fiscal calendar, reporting basis and
// the regulatory framework: FY2025 10-K, Item 1 and Item 8.

import { esc, dStdScaffold, dStdRender, dPicker, dWirePicker, dWireTables,
         fPct, fEps, DHR_KIT_CSS,
         D_ACT, D_ADJ, D_REF, D_UP, D_DOWN, D_TOTAL, D_NEUT, D_SEG } from './dhr-chartkit.js';
import { dhrResults } from '../results-data/dhr.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F';

// ═══ Data ═════════════════════════════════════════════════════════════════════════════════════

// ── 1 · The growth series, in PLAIN READING (tailwind positive) ───────────────────────────────
// `pAcq` / `pFx` / `pResp` are the values Danaher PRINTS, kept so the table can show both.
// The contributions charted are their negatives. 3Q26E is guidance: the company core figure is
// the midpoint of the guided 2.0–3.0% range and Life Sciences the midpoint of 3.0–4.0%, both
// marked as derived; Biotechnology is guided only as "mid-single digit" and is therefore null —
// a word is not a number (rule 6: missing data renders nothing).
var GQ   = ['1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26', '3Q26E'];
var GEST = 5;                                   // last actual index — everything after is guided
var G = {
  total:  [-1.0,  3.5,  4.5,  4.5,  3.5,  5.5, null],
  core:   [ 0.0,  1.5,  3.0,  2.5,  0.5,  3.0,  2.5],
  coreEx: [ 1.0,  2.0,  2.5,  4.0,  3.0,  4.5,  5.0],
  acqC:   [ 0.5,  0.0,  0.0, -0.5,  0.0,  1.5, null],
  fxC:    [-1.5,  2.0,  1.5,  2.5,  3.0,  1.0, null],
  respC:  [-1.0, -0.5,  0.5, -1.5, -2.5, -1.5, -2.5],
  bio:    [ 7.0,  6.0,  6.5,  6.0,  7.0,  2.5, null],
  ls:     [-4.0, -2.5, -1.0,  0.5,  0.5,  5.5,  3.5],
  dx:     [-1.5,  2.0,  3.5,  2.0, -4.0,  2.0,  0.0],
  pAcq:   [-0.5,  0.0,  0.0,  0.5,  0.0, -1.5, null],
  pFx:    [ 1.5, -2.0, -1.5, -2.5, -3.0, -1.0, null],
  pResp:  [ 1.0,  0.5, -0.5,  1.5,  2.5,  1.5,  2.5]
};

// ── 2 · The non-GAAP ledger ───────────────────────────────────────────────────────────────────
// Adjusting items as published, in three bases. Columns are [Q2'25, Q2'26] and [1H25, 1H26];
// `rec` marks an item that recurs by construction rather than by accident.
var NG_ITEMS = [
  { k:'amort', label:'Amortisation of acquisition intangibles', rec:true,  color:D_ADJ,
    pre:{ q:[426, 463], h:[836, 897] }, at:{ q:[354, 384], h:[694, 744] }, ps:{ q:[0.59, 0.65], h:[1.16, 1.26] } },
  { k:'masimo', label:'Masimo acquisition-related items', rec:false, color:BRAND,
    pre:{ q:[0, 108], h:[0, 125] }, at:{ q:[0, 95], h:[0, 110] }, ps:{ q:[0, 0.15], h:[0, 0.18] } },
  { k:'impair', label:'Impairments', rec:false, color:D_DOWN,
    pre:{ q:[432, 0], h:[447, 0] }, at:{ q:[328, 0], h:[339, 0] }, ps:{ q:[0.60, 0], h:[0.62, 0] } },
  { k:'fv', label:'Fair-value net losses on investments', rec:false, color:D_NEUT,
    pre:{ q:[44, 7], h:[134, 84] }, at:{ q:[33, 5], h:[101, 64] }, ps:{ q:[0.06, 0.01], h:[0.19, 0.12] } },
  { k:'disp', label:'Gain on product line disposition', rec:false, color:D_UP,
    pre:{ q:[0, 0], h:[-9, 0] }, at:{ q:[0, 0], h:[-7, 0] }, ps:{ q:[0, 0], h:[-0.01, 0] } },
  { k:'tax', label:'Tax effect of the above', rec:true, color:D_REF,
    pre:{ q:[null, null], h:[null, null] }, at:{ q:[null, null], h:[null, null] }, ps:{ q:[-0.26, -0.13], h:[-0.39, -0.27] } },
  { k:'dtax', label:'Net discrete tax charges', rec:false, color:D_TOTAL,
    pre:{ q:[null, null], h:[null, null] }, at:{ q:[22, 21], h:[12, 21] }, ps:{ q:[0.03, 0.03], h:[0.02, 0.03] } },
  { k:'round', label:'Rounding', rec:false, color:'#C8D2DC',
    pre:{ q:[null, null], h:[null, null] }, at:{ q:[null, null], h:[null, null] }, ps:{ q:[0.01, 0], h:[-0.01, 0] } }
];
var NG_LBL = { q:["Q2'25", "Q2'26"], h:['1H25', '1H26'] };
// Annual EPS, continuing operations. GAAP is the diluted figure Danaher tags for all ten years.
var NG_ANN = { labels:['FY2024', 'FY2025'], gaap:[5.29, 5.03], adj:[7.48, 7.80] };

// ── 3 · The corporate ("Other") line ──────────────────────────────────────────────────────────
function rsM(view, key){ var v = dhrResults.views[view]; return (v && v.metrics[key]) || null; }
function rsAct(view, key){ var m = rsM(view, key); return m ? m.act.slice() : []; }
function rsPer(view){ var m = rsM(view, 'rev'); return m ? m.periods.slice() : []; }
// The corporate line is negative in every period, and the shared fMs renders that as "$-89".
// This section carries its own signed formatter rather than changing a helper five panes share.
function fMsS(v){
  if (v == null) return '—';
  return (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US');
}

// ═══ Section 1 — core sales and its definitions ═══════════════════════════════════════════════
function coreDerive(st){
  var sel = st.sel || 'defs';
  var labels = GQ.slice(), series, extra = null, legNote = '';

  if (sel === 'defs'){
    series = [
      { k:'total',  grp:'total',  label:'Reported sales growth',        src:'Reported (GAAP)',        color:D_REF, type:'line', dash:true },
      { k:'core',   grp:'core',   label:'Core sales growth',            src:'Core',                   color:D_ACT, type:'line' },
      { k:'coreEx', grp:'coreEx', label:'Core growth ex-respiratory',   src:'Core ex-respiratory',    color:BRAND, type:'line' }
    ].map(function(s){ s.data = G[s.k].slice(); return s; });
    legNote = 'Three definitions of the same quarter.';
  } else if (sel === 'bridge'){
    series = [
      { k:'acqC',  grp:'acqC',  label:'Acquisitions / divestitures',  src:'Acquisitions',  color:BRAND2,  type:'bar' },
      { k:'fxC',   grp:'fxC',   label:'Currency',                     src:'Currency',      color:D_NEUT,  type:'bar' },
      { k:'respC', grp:'respC', label:'Respiratory testing',          src:'Respiratory',   color:D_DOWN,  type:'bar' },
      { k:'core',  grp:'core',  label:'Core sales growth',            src:'Core growth',   color:D_ACT,   type:'line', order:1 }
    ].map(function(s){ s.data = G[s.k].slice(); return s; });
    legNote = 'Contribution in percentage points, tailwind positive.';
    extra = function(lo, hi){
      function row(name, key, f){ return [name].concat(G[key].slice(lo, hi + 1).map(f)); }
      var sp = function(v){ return v == null ? null : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; };
      return [
        row('Reported growth (= core + acq. + FX)', 'total', sp),
        row('Core ex-respiratory (= core − respiratory)', 'coreEx', sp),
        row('— as Danaher prints it: acquisitions', 'pAcq', sp),
        row('— as Danaher prints it: currency', 'pFx', sp),
        row('— as Danaher prints it: respiratory', 'pResp', sp)
      ];
    };
  } else {
    series = [
      { k:'bio', grp:'bio', label:'Biotechnology',  src:'Biotechnology',  color:D_SEG.bio, type:'line' },
      { k:'ls',  grp:'ls',  label:'Life Sciences',  src:'Life Sciences',  color:D_SEG.ls,  type:'line' },
      { k:'dx',  grp:'dx',  label:'Diagnostics',    src:'Diagnostics',    color:D_SEG.dx,  type:'line' },
      { k:'core', grp:'core', label:'Danaher',      src:'Danaher',        color:D_ACT,     type:'line' },
      { k:'coreEx', grp:'coreEx', label:'Danaher ex-respiratory', src:'Danaher ex-respiratory', color:BRAND, type:'line', dash:true }
    ].map(function(s){ s.data = G[s.k].slice(); return s; });
    legNote = 'Core growth only — the segments are not published on any other basis.';
  }

  var sp = function(v){ return v == null ? '—' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; };
  return {
    labels: labels, series: series, lastAct: GEST, cmpFrom: 4,
    yFmt: sp, legNote: legNote, extraRows: extra,
    tblTitle: 'Data — every growth definition, and the rows as Danaher prints them',
    note: function(i){
      if (i > GEST) return 'Guided, not reported — 3Q26 from the Q2\'26 earnings presentation.';
      if (i === 4) return 'Respiratory was a 2.5pp drag this quarter, the largest in the series.';
      if (i === 5) return 'First quarter with the ex-respiratory line in the 10-Q. Masimo added 1.5pp to reported growth.';
      return '';
    }
  };
}

// ═══ Section 2 — the non-GAAP ledger ══════════════════════════════════════════════════════════
function ngDerive(st){
  var sel = st.sel || 'pre';
  if (sel === 'ann'){
    var gap = NG_ANN.adj.map(function(a, i){ return a - NG_ANN.gaap[i]; });
    return {
      labels: NG_ANN.labels.slice(), hideModes:['per'],
      series: [
        { k:'gaap', grp:'gaap', label:'Diluted EPS (GAAP, continuing ops)', src:'GAAP', color:D_ACT, type:'bar' },
        { k:'adj',  grp:'adj',  label:'Adjusted diluted EPS',               src:'Adjusted', color:BRAND, type:'bar' },
        { k:'gap',  grp:'gap',  label:'The adjustments',                    src:'The gap',  color:D_DOWN, type:'line', yAxisID:'y2' }
      ].map(function(s){ s.data = s.k === 'gaap' ? NG_ANN.gaap.slice() : s.k === 'adj' ? NG_ANN.adj.slice() : gap; return s; }),
      yFmt: fEps, y2Fmt: fEps,
      legNote: 'The gap is not closing — it is widening.',
      extraRows: function(lo, hi){
        return [['Adjustments as % of adjusted EPS'].concat(gap.slice(lo, hi + 1).map(function(g, i){
          return fPct(g / NG_ANN.adj[lo + i] * 100); }))];
      },
      tblTitle: 'Data — GAAP and adjusted earnings per share',
      note: function(){ return 'GAAP is diluted EPS from continuing operations, the one bottom line clean across every year.'; }
    };
  }
  var per = st.modes.per || 'q';
  var basis = sel === 'at' ? 'at' : sel === 'ps' ? 'ps' : 'pre';
  var items = NG_ITEMS.filter(function(it){
    var d = it[basis][per]; return d && d.some(function(v){ return v != null && v !== 0; });
  });
  if (!items.length) return { empty:'Danaher does not publish this basis for this period.' };
  var fmt = basis === 'ps' ? fEps : fMsS;
  return {
    labels: NG_LBL[per].slice(), stacked: basis === 'ps',
    series: items.map(function(it){
      return { k:it.k, grp:it.k, label:it.label + (it.rec ? '  ·  recurs' : ''), src:it.label,
               color:it.color, type:'bar', stack:'ng', data:it[basis][per].slice() };
    }),
    yFmt: fmt,
    legNote: basis === 'ps' ? 'Stacked — the bars above the axis less the tax effect below it are the whole gap per share.'
                            : 'Grouped — Danaher publishes no per-item tax split on this basis.',
    extraRows: function(lo, hi){
      // rule 3 — the table carries the anchors the chart implies, so every total can be checked.
      var ANCH = {
        pre: { h:'Earnings before income taxes', q:{ g:[655, 1078], a:[1557, 1656] }, hh:{ g:[1784, 2313], a:[3192, 3419] } },
        at:  { h:'Net earnings',                 q:{ g:[555, 870],  a:[1292, 1375] }, hh:{ g:[1509, 1899], a:[2648, 2838] } },
        ps:  { h:'Diluted EPS',                  q:{ g:[0.77, 1.23], a:[1.80, 1.94] }, hh:{ g:[2.10, 2.68], a:[3.68, 4.00] } }
      }[basis];
      var an = per === 'q' ? ANCH.q : ANCH.hh;
      var tot = NG_LBL[per].map(function(_, i){
        return items.reduce(function(a, it){ var v = it[basis][per][i]; return a + (v == null ? 0 : v); }, 0); });
      return [
        ['Total adjustments'].concat(tot.slice(lo, hi + 1).map(fmt)),
        [ANCH.h + ' — GAAP'].concat(an.g.slice(lo, hi + 1).map(fmt)),
        [ANCH.h + ' — adjusted'].concat(an.a.slice(lo, hi + 1).map(fmt))
      ];
    },
    tblTitle: 'Data — every adjusting item Danaher published',
    note: function(){ return 'Acquisition amortisation is guided at ~$1,900M for FY26 and recurs by construction.'; }
  };
}

// ═══ Section 3 — the corporate ("Other") line ═════════════════════════════════════════════════
function corpDerive(st){
  var view = st.modes.gran || 'y';
  var labels = rsPer(view), corp = rsAct(view, 'corpopinc'), rev = rsAct(view, 'rev');
  if (!labels.length) return { empty:'No segment data for this period.' };
  var sel = st.sel || 'corp';

  if (sel === 'sum'){
    var op = rsAct(view, 'opinc');
    var sum = labels.map(function(_, i){
      return rsAct(view, 'bioopinc')[i] + rsAct(view, 'lsopinc')[i] + rsAct(view, 'dxopinc')[i]; });
    return {
      labels: labels, series: [
        { k:'sum', grp:'sum', label:'Sum of the three segments', src:'Segments', color:BRAND,  type:'bar', data:sum },
        { k:'op',  grp:'op',  label:'Company operating profit',  src:'Company',  color:D_ACT,  type:'bar', data:op }
      ],
      yFmt: fMsS, legNote: 'The difference is the corporate line, every period.',
      extraRows: function(lo, hi){
        return [['Difference (= the "Other" segment)'].concat(sum.slice(lo, hi + 1).map(function(s, i){
          return fMsS(op[lo + i] - s); }))];
      },
      tblTitle: 'Data — segments against the company',
      note: function(){ return 'Segment margins never add to the company margin: the corporate line sits between them.'; }
    };
  }
  var pct = corp.map(function(v, i){ return rev[i] ? Math.abs(v) / rev[i] * 100 : null; });
  return {
    labels: labels, series: [
      { k:'corp', grp:'corp', label:'Corporate ("Other") operating profit', src:'Corporate cost', color:D_ACT, type:'bar', data:corp },
      { k:'pct',  grp:'pct',  label:'As % of company sales',               src:'% of sales',     color:BRAND, type:'line', yAxisID:'y2', data:pct }
    ],
    yFmt: fMsS, y2Fmt: function(v){ return v.toFixed(2) + '%'; },
    legNote: 'It carries no revenue, so it has no margin of its own.',
    tblTitle: 'Data — the corporate line',
    note: function(){ return 'Guided at about $(360)M for FY2026 — the only line of the segment note Danaher guides.'; }
  };
}

// ═══ Sections 4 and 5 — prose ═════════════════════════════════════════════════════════════════
var BASIS_ROWS = [
  ['Consolidated annual series', 'FY2021', 'Veralto separated 30-Sep-2023 and Danaher restated the two prior years only. FY2020 has never been put on today\'s basis.'],
  ['Consolidated quarterly series', '1Q23', 'The same restatement, reaching the same distance back through the quarters.'],
  ['Biotechnology / Life Sciences split', 'FY2020', 'The single Life Sciences segment was split in FY2022 and restated two years. Before FY2020 the split does not exist anywhere.'],
  ['Environmental &amp; Applied Solutions', 'FY2020&ndash;FY2022 only', 'Reported as a fourth segment until Veralto left. It is why FY2022 revenue is $31,471M as filed and $26,643M as restated.'],
  ['Fourth quarters', 'never tagged', 'Danaher tags Q1, Q2 and Q3 and the fiscal year. Every Q4 in the portal is the year less the three published quarters.']
];
var CAL_ROWS = [
  ['Fiscal year', '52/53-week convention, ending on 31 December.'],
  ['Q2 2026 ended', '26 June 2026 — against 27 June 2025 a year earlier.'],
  ['Q3 2026 ends', '25 September 2026.'],
  ['FY2026 ends', '31 December 2026.'],
  ['Day-count effects', 'Not disclosed as a growth factor in any period. Danaher never attributes growth to the calendar.']
];
var REG = [
  { h:'FDA', c:BRAND, b:'Many products are medical devices under the FDCA, risk-classified I, II or III. A new device or a new indication needs 510(k) clearance or PMA unless exempt, and a post-clearance modification that could significantly affect safety or effectiveness can require a new one. Routine facility inspection, CGMP and the Quality System Regulation, medical-device reporting, and off-label promotion enforcement all apply.' },
  { h:'EU — MDR and IVDR', c:BRAND2, b:'The Regulations replace the prior Directives, with amended transition timelines running <b>May 2026 to December 2028 for MDR</b> and <b>May 2026 to May 2028 for IVDR</b>, by product classification. Compliance needs quality-system changes, added resource and technical-file updates. Danaher\'s own assessment: it "has not and is not expected to have a material impact on the Company\'s financial results." The UK and Swiss regimes are separately in flux post-Brexit and post-MRA withdrawal.' },
  { h:'Reimbursement', c:D_DOWN, b:'PAMA sets multi-year pricing on the US Clinical Laboratory Fee Schedule; the Inflation Reduction Act\'s drug-pricing provisions and PPACA sit behind the pharma customers. <b>China volume-based procurement is named explicitly in the 10-K as having unfavourably impacted revenues</b> — the only reimbursement regime Danaher quantifies as a negative, and it is the one behind the Diagnostics China line.' },
  { h:'Conduct and data', c:D_NEUT, b:'FCPA and the UK Bribery Act; the federal Anti-Kickback Statute; HIPAA; the False Claims Act including qui tam; the Civil Monetary Penalties Law; the Open Payments Act; DEA inspection of facilities handling controlled substances used in drugs-of-abuse assays; GDPR and US state privacy law; ITAR, EAR, OFAC and the anti-boycott rules.' },
  { h:'Government customers', c:D_UP, b:'Every segment sells to government entities, but the substantial majority of FY2025 revenue came from non-government customers, and <b>"no material portion of Danaher\'s business is subject to renegotiation of profits or termination of contracts at the election of a government entity."</b> The exposure that matters is upstream instead: research funding, which management sizes at under 5% of revenue.' }
];

function basisBody(){
  return '<div class="ov-sec">' +
    '<div class="mo-h">Two definition changes, in order</div>' +
    '<div class="mo-tl">' +
      '<div class="mo-tli"><div class="mo-tlq">Q2 2026 10-Q · filed July 2026</div><div class="mo-tlt">' +
        '<b>Respiratory testing comes out of core sales.</b> The stated rationale is that flu severity is outside management\'s control. ' +
        'The effect in the quarter it was introduced: core growth 3.0%, core ex-respiratory 4.5%. In 1H26 it was the difference between ' +
        '&minus;1.0% and +4.0% at the Diagnostics segment — the sign of the segment flips on this one line.</div></div>' +
      '<div class="mo-tli"><div class="mo-tlq">Q3 2026 10-Q · intended</div><div class="mo-tlt">' +
        '<b>Tariff refunds returned to customers come out of core sales.</b> Danaher has stated the intent; no size has ever been put on it. ' +
        'When it lands it will be the first number the company has attached to tariffs at all.</div></div>' +
    '</div>' +
    '<div class="mo-note-ours"><b>How to read it.</b> Both exclusions are defensible on their own terms, and both are directionally ' +
      'flattering in a year when reported core growth is 2.0%. What is worth tracking is not the first change but the second: whether ' +
      'the ex-respiratory line survives once respiratory turns into a tailwind, and whether more exclusions follow. The chart in the ' +
      'first section carries both definitions side by side so neither has to be taken on trust.</div>' +
    '</div>' +

    '<div class="ov-sec" style="margin-top:14px">' +
    '<div class="mo-h">How far back today\'s numbers actually reach</div>' +
    '<div class="mo-p">Danaher separated Fortive (2016), Envista (2019) and Veralto (2023), and each separation restated only the two ' +
      'prior years. The as-filed decade therefore sits on three different companies, and a series drawn straight across shows declines ' +
      'that are entirely restatement. Every annual chart in this profile carries a <b>Comparable</b> range preset for that reason.</div>' +
    '<div class="rs-tablewrap mo-tbl"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Series</th><th>Reaches back to</th><th>Why it stops there</th></tr></thead><tbody>' +
      BASIS_ROWS.map(function(r){
        return '<tr><td class="rs-ft-h">' + r[0] + '</td><td><b>' + r[1] + '</b></td><td class="rs-ft-dim">' + r[2] + '</td></tr>'; }).join('') +
    '</tbody></table></div>' +
    '</div>' +

    '<div class="ov-sec" style="margin-top:14px">' +
    '<div class="mo-h">Fiscal calendar</div>' +
    '<div class="mo-gov">' + CAL_ROWS.map(function(r){
      return '<div><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>' +
    '<div class="mo-p">R&amp;D intensity sits at 6.6% of sales in Q2\'26 against 6.8% a year earlier, and 6.5% against 6.7% for the half ' +
      '— stable, and low for the sector. Danaher does not guide it. Every figure in this profile is <b>continuing operations</b> unless it ' +
      'says otherwise; net income, which includes discontinued operations in the separation years, is deliberately not used as a margin ' +
      'numerator anywhere.</div>' +
    '</div>';
}

function regBody(){
  return '<div class="ov-sec">' +
    '<div class="mo-p" style="margin-top:0">Captured from Item 1 of the FY2025 10-K. None of it is modelled — it is here because the ' +
      'Diagnostics segment is the one whose revenue a regulator can move, and because the EU transition dates are the only regulatory ' +
      'deadline Danaher has put on the record.</div>' +
    '<div class="mo-h">The EU transition, on a calendar</div>' +
    '<div class="mo-gantt">' +
      '<div class="mo-gr"><span class="mo-grl">MDR</span><div class="mo-grt"><div class="mo-grb" style="left:11.1%;width:86.1%;background:' + BRAND + '">May 2026 → Dec 2028</div></div></div>' +
      '<div class="mo-gr"><span class="mo-grl">IVDR</span><div class="mo-grt"><div class="mo-grb" style="left:11.1%;width:66.7%;background:' + BRAND2 + '">May 2026 → May 2028</div></div></div>' +
      '<div class="mo-gx"><span>2026</span><span>2027</span><span>2028</span><span>2029</span></div>' +
    '</div>' +
    '<div class="mo-note-ours">Danaher states the transition <b>is not expected to be material</b>. That assessment, not the dates, is the ' +
      'thing to watch: a change of language in a future filing would be the signal.</div>' +
    '<div class="mo-h">The framework, in five parts</div>' +
    '<div class="mo-cards">' + REG.map(function(r){
      return '<div class="mo-card" style="border-left:3px solid ' + r.c + '"><div class="mo-card-h">' + esc(r.h) + '</div><div class="mo-card-b">' + r.b + '</div></div>'; }).join('') +
    '</div>' +
    '</div>';
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
var SECTIONS = [
  ['core',  'Core sales — the definition, and its two changes'],
  ['ngaap', 'The non-GAAP ledger — what adjusted leaves out'],
  ['corp',  'The "Other" segment — the corporate line'],
  ['basis', 'Definitions, calendar and reporting basis'],
  ['reg',   'Regulatory framework']
];

export function dhrMiscOtherHtml(){
  return DHR_KIT_CSS + MO_CSS + '<div class="dhr-mo">' +
    '<p class="dbl-lede">Danaher changed what core sales growth means twice in two quarters — respiratory testing came out with the ' +
      'Q2\'26 10-Q, tariff refunds come out with Q3\'26 — and its adjusted earnings exclude about <b>$1.9B a year</b> of acquisition ' +
      'amortisation that recurs by construction. Neither is improper. Both make the reported numbers better, and both are measurable ' +
      'against what the company published before. That is what this pane does.</p>' +

    dPicker(SECTIONS, 'core') +

    '<div class="gen-sec" data-gsec="core">' + dStdScaffold({
      id:'dmoc', title:'Core sales growth, on all three definitions', height:360,
      metricSel:[{ v:'defs', label:'The three definitions', on:true },
                 { v:'bridge', label:'What separates them' },
                 { v:'seg', label:'Core growth by segment' }],
      modes:[], presets:[['all','All'], ['cmp','FY26 only'], ['l5','Last 5']],
      note:'<b>Plain reading throughout: a tailwind is positive.</b> Danaher prints these rows in a reconciling convention where ' +
        '<i>Total + Acquisitions + FX = Core</i>, so a printed "(1.0)%" for currency means currency <b>added</b> 1.0pp to reported ' +
        'growth. The signs charted here are the negatives of the printed ones for acquisitions, currency and respiratory; the printed ' +
        'rows are carried verbatim in the data sheet so both readings are visible. The earnings deck flips the respiratory row again ' +
        'relative to the press release — it is normalised on ingest. 3Q26 is guided, not reported: the company figure is the midpoint ' +
        'of the guided 2.0&ndash;3.0% and Life Sciences the midpoint of 3.0&ndash;4.0%, both ours; Biotechnology is guided only as ' +
        '"mid-single digit", which is a word rather than a number, so it draws nothing. Q4\'26 is guided in words alone and is not on ' +
        'the axis at all.'
    }) + '</div>' +

    '<div class="gen-sec" data-gsec="ngaap" hidden>' + dStdScaffold({
      id:'dmon', title:'The gap between GAAP and adjusted', height:360,
      metricSel:[{ v:'pre', label:'Adjusting items — pretax $M', on:true },
                 { v:'at',  label:'Adjusting items — after tax $M' },
                 { v:'ps',  label:'Adjusting items — per share' },
                 { v:'ann', label:'GAAP vs adjusted EPS, annual' }],
      modes:[{ cls:'per', label:'Period', opts:[{ v:'q', label:'Second quarter', on:true }, { v:'h', label:'First half' }] }],
      presets:[['all','All']],
      note:'Every item is as Danaher published it in the Q2 2026 press release; nothing here is derived except the totals and the ' +
        'percentage in the annual table. <b>Amortisation of acquisition intangibles is the whole argument.</b> It is guided at about ' +
        '$1,900M for FY2026, it is roughly $1.26 of the $2.68 GAAP first-half EPS, and it recurs every year because Danaher grows by ' +
        'acquisition — the company itself notes these intangibles contribute to generating sales. Excluding it is standard practice and ' +
        'it is also the reason adjusted EPS is 55% above GAAP. The per-share view carries the tax effect and a rounding line because ' +
        'that is how the published bridge closes; the pretax and after-tax views do not, because Danaher publishes no per-item tax ' +
        'split on those bases.'
    }) + '</div>' +

    '<div class="gen-sec" data-gsec="corp" hidden>' + dStdScaffold({
      id:'dmoo', title:'The corporate line Danaher calls "Other"', height:360,
      metricSel:[{ v:'corp', label:'The corporate line', on:true },
                 { v:'sum',  label:'Segments vs the company' }],
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'], ['l5','Last 5'], ['l8','Last 8']],
      note:'The fourth line of Danaher\'s segment note is not a business. It is unallocated corporate cost — no revenue, no margin, ' +
        'excluded from how management evaluates the reportable segments — and it is guided at about $(360)M for FY2026, the only line ' +
        'of the segment note that gets a guide at all. It matters for one reason: <b>the three segments never add up to the company.</b> ' +
        'A reader who averages the segment margins gets a number Danaher never earns. It is also remarkably steady, at roughly 1.4% of ' +
        'sales in every year of the series, which is itself the finding — the corporate line is not where the margin went.'
    }) + '</div>' +

    '<div class="gen-sec" data-gsec="basis" hidden>' + basisBody() + '</div>' +
    '<div class="gen-sec" data-gsec="reg" hidden>' + regBody() + '</div>' +

    '<div class="ov-foot">Growth series and adjusting items: Danaher Q2 2026 press release and earnings presentation, 21-Jul-2026 ' +
      '(segment core-growth matrix from deck slide 7). Corporate and segment operating profit: 10-K and 10-Q segment notes via SEC ' +
      'EDGAR, CIK 0000313616, through js/results-data/dhr.js. Fiscal calendar, reporting basis and regulatory framework: FY2025 10-K, ' +
      'Item 1. Annual adjusted EPS: FY2025 annual-report highlights. Guided figures are marked on the axis and faded in the chart.</div>' +
    '</div>';
}

export function dhrMiscOtherInit(root){
  if (!root || typeof Chart === 'undefined') return;
  dWireTables(root);
  function showSection(v){
    root.querySelectorAll('.gen-sec').forEach(function(s){ s.hidden = (s.getAttribute('data-gsec') !== v); });
    if (v === 'core')  dStdRender('dmoc', coreDerive, root);
    if (v === 'ngaap') dStdRender('dmon', ngDerive, root);
    if (v === 'corp')  dStdRender('dmoo', corpDerive, root);
  }
  var show = dWirePicker(root, showSection);
  show('core');
}

// ═══ CSS — module-local, everything else is global ════════════════════════════════════════════
var MO_CSS = '<style>' +
  '.dhr-mo{max-width:1000px}' +
  '.mo-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + BRAND2 + ';margin:22px 0 10px;display:flex;align-items:center;gap:8px}' +
  '.mo-h:first-child{margin-top:2px}' +
  '.mo-h::after{content:"";flex:1;height:1px;background:var(--bdr)}' +
  '.mo-p{font-size:12.5px;line-height:1.62;color:var(--tx);margin:10px 0;max-width:84ch}' +
  '.mo-note-ours{font-size:12px;line-height:1.6;color:var(--tx);background:rgba(15,125,194,.06);border-left:3px solid ' + BRAND + ';border-radius:0 8px 8px 0;padding:11px 14px;margin:14px 0 4px;max-width:84ch}' +
  '.mo-tl{position:relative;margin:14px 0 4px;padding-left:22px}' +
  '.mo-tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--bdr)}' +
  '.mo-tli{position:relative;margin-bottom:14px}.mo-tli:last-child{margin-bottom:2px}' +
  '.mo-tli::before{content:"";position:absolute;left:-21px;top:3px;width:10px;height:10px;border-radius:50%;background:' + BRAND + ';border:2px solid var(--card,#fff);box-shadow:0 0 0 1px var(--bdr)}' +
  '.mo-tlq{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy)}' +
  '.mo-tlt{font-size:12.5px;line-height:1.6;color:var(--tx);margin-top:3px;max-width:82ch}' +
  '.mo-gov{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px;margin:12px 0 4px}' +
  '.mo-gov>div{border:1px solid var(--bdr);border-radius:9px;padding:10px 12px}' +
  '.mo-gov b{display:block;font-size:12.5px;font-weight:800;color:var(--navy)}' +
  '.mo-gov span{font-size:10.5px;color:var(--mu);font-weight:600;line-height:1.4;display:block;margin-top:2px}' +
  '.mo-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px;margin:12px 0 4px}' +
  '.mo-card{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;background:var(--card,#fff)}' +
  '.mo-card-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:6px}' +
  '.mo-card-b{font-size:11.5px;line-height:1.58;color:var(--tx)}' +
  '.mo-tbl th,.mo-tbl td{text-align:left}' +
  '.mo-gantt{margin:14px 0 4px;max-width:640px}' +
  '.mo-gr{display:grid;grid-template-columns:56px 1fr;gap:10px;align-items:center;margin-bottom:9px}' +
  '.mo-grl{font-size:11px;font-weight:800;color:var(--navy)}' +
  '.mo-grt{position:relative;height:26px;background:#EEF2F6;border-radius:6px}' +
  '.mo-grb{position:absolute;top:0;height:26px;border-radius:6px;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;letter-spacing:.02em}' +
  '.mo-gx{display:grid;grid-template-columns:repeat(4,1fr);margin-left:66px;font-size:10px;color:var(--mu);font-weight:700}' +
  '@media(max-width:640px){.mo-cards{grid-template-columns:1fr}.mo-gr{grid-template-columns:44px 1fr}}' +
  '</style>';
