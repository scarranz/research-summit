// dhr-bl-segments.js — Danaher, Deep Dive ▸ Bottom Line ▸ Segments.
//
// STRUCTURE: mirrors `segmentsBody()` in js/overviews/amzn.js — a master "Chart" picker over
// three `.seg-gsec[data-sgsec]` sections (operating profit & margin · revenue vs profit common
// size · the segment bridge), then a collapsible segment explorer. Charts use the `dStd*`
// scaffold and `dWaterfall` from ./dhr-chartkit.js.
//
// ── One home for the data ─────────────────────────────────────────────────────────────────────
// Nothing is copied into this file. Segment revenue and operating profit are read from
// `js/results-data/dhr.js`; depreciation, capital expenditure, impairments and identifiable
// assets from the drivers in `js/segments-data/dhr.js`. Both already exist for Top Line, and a
// second copy here is how two panes start disagreeing.
//
// ── What this pane is for ─────────────────────────────────────────────────────────────────────
// Top Line answers "how big is each segment". This one answers "where does the profit actually
// come from", and for Danaher the two are not the same question. In FY2025 Life Sciences was
// 29.9% of segment revenue and 10.3% of segment operating profit; Diagnostics was 40.5% of
// revenue and 52.6% of profit. The common-size section is where that shows up in one picture,
// and the bridge is where the three-year fall in group operating profit gets attributed.

import { esc, dStdScaffold, dStdRender, dWaterfall, dPicker, dWirePicker, dWireTables, dActivate,
         fMs, fPct, fPp, FMT_M, D_ACT, D_REF, D_UP, D_DOWN, D_TOTAL, D_NEUT, D_SEG,
         DHR_KIT_CSS } from './dhr-chartkit.js';
import { dhrResults } from '../results-data/dhr.js';
import { dhrSegments } from '../segments-data/dhr.js';

var SEGS = [
  { k:'bio', n:'Biotechnology', rk:'bio', mk:'bioopinc', c:D_SEG.bio },
  { k:'ls',  n:'Life Sciences', rk:'ls',  mk:'lsopinc',  c:D_SEG.ls  },
  { k:'dx',  n:'Diagnostics',   rk:'dx',  mk:'dxopinc',  c:D_SEG.dx  }
];
function segOf(k){ for (var i=0;i<SEGS.length;i++) if (SEGS[i].k === k) return SEGS[i]; return SEGS[0]; }

// ─── reading the two datasets ─────────────────────────────────────────────────────────────────
function rsM(view, key){
  var v = dhrResults.views[view];
  return (v && v.metrics[key]) || null;
}
// REPORTED periods only. The Results dataset carries forward quarters and years too (Street
// consensus, `cons`), and every chart in this pane is a history of what was reported — a bridge
// between two FY26 estimates, or a "latest quarter" that resolves to 3Q27, is not a thing this
// pane means. Cutting the axis at the last period with an actual keeps it immune to the forward
// horizon growing again.
function rsPeriods(view){
  var m = rsM(view, 'rev'); if (!m) return [];
  var last = -1;
  m.act.forEach(function(v, i){ if (v != null) last = i; });
  return m.periods.slice(0, last + 1);
}
function rsAct(view, key){ var m = rsM(view, key); return m ? m.act.slice(0, rsPeriods(view).length) : []; }
// Segment-note drivers live in the segments dataset, keyed by period rather than indexed.
function segDriverAt(segKey, driver, view, period){
  var s = dhrSegments.segments.filter(function(x){ return x.key === segKey; })[0];
  var d = s && s.drivers && s.drivers[driver];
  var b = d && d[view];
  return (b && b.act && b.act[period] != null) ? b.act[period] : null;
}
function corpAct(view){ return rsAct(view, 'corpopinc'); }

// ═══ Section 1 — operating profit and margin by segment ═══════════════════════════════════════
// Bars are the amount, lines are the margin on the right axis, one chip per segment. Same shape
// as Amazon's, but the chips are SEGMENTS rather than sources: Danaher has one source here, and
// comparing the three segments to each other is the question this pane exists to answer.
var FC_MET = {
  op:     { lab:'Operating profit',     u:'$M', margin:true,
            f:function(view, s, i, p){ return rsAct(view, s.mk)[i]; } },
  impair: { lab:'Impairment charges',   u:'$M', annual:true,
            f:function(view, s, i, p){ return segDriverAt(s.k, 'impair', view, p); } },
  da:     { lab:'Depreciation & amortisation', u:'$M', annual:true,
            f:function(view, s, i, p){ return segDriverAt(s.k, 'da', view, p); } },
  capex:  { lab:'Capital expenditure',  u:'$M', annual:true,
            f:function(view, s, i, p){ return segDriverAt(s.k, 'capex', view, p); } },
  assets: { lab:'Identifiable assets',  u:'$M', annual:true,
            f:function(view, s, i, p){ return segDriverAt(s.k, 'assets', view, p); } }
};
function fcDerive(st){
  var key = st.sel || 'op', m = FC_MET[key], view = (st.modes.gran === 'q' && !m.annual) ? 'q' : 'y';
  if (st.modes.gran === 'q' && m.annual)
    return { empty: m.lab + ' is disclosed by segment once a year, in the 10-K segment note — the 10-Qs carry only revenue and operating profit. Switch the Period pill back to Annual.' };
  var periods = rsPeriods(view);
  var series = [];
  SEGS.forEach(function(s){
    var revA = rsAct(view, s.rk);
    var amt = periods.map(function(p, i){ var v = m.f(view, s, i, p); return (v == null || isNaN(v)) ? null : v; });
    series.push({ k:s.k + '$', grp:s.k, src:s.n, label:s.n + ' — ' + m.lab.toLowerCase(), color:s.c, type:'bar', data:amt });
    if (m.margin) series.push({ k:s.k + 'M', grp:s.k, src:s.n, label:s.n + ' — margin', color:s.c, type:'line', yAxisID:'y2',
      data: amt.map(function(v, i){ return (v == null || !revA[i]) ? null : Math.round(v/revA[i]*1000)/10; }) });
  });
  return {
    labels: periods, series: series, yFmt: fMs, y2Fmt: fPct,
    hideModes: m.annual ? ['gran'] : [],
    legNote: m.margin ? 'Bars = $M &nbsp;·&nbsp; lines = segment operating margin (right axis)'
                      : 'Bars = ' + m.lab.toLowerCase() + ', $M — Danaher discloses this by segment annually only',
    tblTitle: m.lab + ' by segment — ' + (view === 'y' ? 'annual' : 'quarterly'),
    extraRows: (key === 'op') ? function(lo, hi){
      var c = corpAct(view);
      return [['Corporate ("Other")'].concat(periods.slice(lo, hi+1).map(function(p, j){ return fMs(c[lo + j]); })),
              ['Group operating profit'].concat(periods.slice(lo, hi+1).map(function(p, j){ return fMs(rsAct(view, 'opinc')[lo + j]); }))];
    } : null
  };
}

// ═══ Section 2 — revenue vs profit, common size ═══════════════════════════════════════════════
// The point of the pane in one chart: set Show to Share and switch the metric between Revenue and
// Operating profit. The two stacks do not match, and the gap between them IS the finding.
function mixDerive(st){
  var key = st.sel || 'rev', show = st.modes.show || 'amt', layout = st.modes.layout || 'stack';
  var view = st.modes.gran === 'q' ? 'q' : 'y';
  var periods = rsPeriods(view);
  var pick = function(s){ return key === 'rev' ? rsAct(view, s.rk) : rsAct(view, s.mk); };
  // Share is of the SEGMENTS, not of the group: corporate cost carries no revenue, so including
  // it would make the profit shares sum to more than 100% and the revenue shares to exactly 100%.
  function tot(i){ var t = 0, ok = false; SEGS.forEach(function(s){ var v = pick(s)[i]; if (v != null){ t += v; ok = true; } }); return ok ? t : null; }
  var lag = view === 'y' ? 1 : 4;
  var series = SEGS.map(function(s){
    var a = pick(s);
    return { k:s.k, grp:s.k, src:s.n, label:s.n, color:s.c, type:'bar', stack: layout === 'stack' ? 'm' : undefined,
      data: periods.map(function(p, i){
        var v = a[i]; if (v == null) return null;
        if (show === 'share'){ var t = tot(i); return t ? Math.round(v/t*1000)/10 : null; }
        if (show === 'growth'){ var b = a[i - lag]; return (b == null || !b) ? null : Math.round((v/b - 1)*1000)/10; }
        return v;
      }) };
  });
  return {
    labels: periods, series: series, stacked: layout === 'stack' && show !== 'growth',
    yFmt: show === 'amt' ? fMs : fPct,
    tblTitle: (key === 'rev' ? 'Revenue' : 'Operating profit') + ' by segment — ' +
              (show === 'amt' ? '$M' : show === 'share' ? 'share of the three segments' : 'growth'),
    legNote: show === 'share'
      ? 'Share of the three segments, not of the group — corporate cost carries no revenue, so including it would make the two stacks incomparable'
      : (show === 'growth' ? 'Growth against the same period a year earlier' : 'Segment ' + (key === 'rev' ? 'revenue' : 'operating profit') + ', $M'),
    extraRows: (show === 'share') ? function(lo, hi){
      return [['Segment total, $M'].concat(periods.slice(lo, hi+1).map(function(p, j){ return fMs(tot(lo + j)); }))];
    } : null
  };
}

// ═══ Section 3 — the segment bridge ═══════════════════════════════════════════════════════════
// What each segment added to, or took off, group operating profit between two years.
var brSt = { from:'2022', to:'2025' };
function brSteps(){
  var per = rsPeriods('y'), i0 = per.indexOf(brSt.from), i1 = per.indexOf(brSt.to);
  if (i0 < 0 || i1 < 0) return null;
  var op = rsAct('y', 'opinc'), run = op[i0];
  var steps = [{ label:'FY' + brSt.from.slice(2) + ' operating profit', kind:'base', color:D_TOTAL, range:[0, run], runAfter:run, val:op[i0] }];
  SEGS.forEach(function(s){
    var a = rsAct('y', s.mk), d = a[i1] - a[i0], lo = run;
    run = lo + d;
    steps.push({ label:s.n, kind:d >= 0 ? 'up' : 'down', color:d >= 0 ? s.c : D_DOWN, dc:D_NEUT,
                 range:[Math.min(lo, run), Math.max(lo, run)], runAfter:run, val:d });
  });
  var c = corpAct('y'), dc = c[i1] - c[i0];
  if (Math.abs(dc) >= 1){
    var lo2 = run; run = lo2 + dc;
    steps.push({ label:'Corporate ("Other")', kind:dc >= 0 ? 'up' : 'down', color:D_NEUT, dc:D_NEUT,
                 range:[Math.min(lo2, run), Math.max(lo2, run)], runAfter:run, val:dc });
  }
  steps.push({ label:'FY' + brSt.to.slice(2) + ' operating profit', kind:'total', color:D_ACT, range:[0, op[i1]], runAfter:null, val:op[i1] });
  return steps;
}
function brBody(){
  var per = rsPeriods('y');
  var btns = function(attr, sel){ return per.map(function(p){
    return '<button type="button" data-' + attr + '="' + p + '"' + (p === sel ? ' class="active"' : '') + '>FY' + p.slice(2) + '</button>'; }).join(''); };
  return '<div class="ov-sec"><div class="ov-sec-h">The segment bridge — what each segment added to group operating profit</div>' +
    '<div class="mch-ctl"><span></span><span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<span class="dbl-lbl">From</span><span class="acx-tog sbr-from">' + btns('sbrf', brSt.from) + '</span>' +
      '<span class="dbl-lbl">to</span><span class="acx-tog sbr-to">' + btns('sbrt', brSt.to) + '</span></span></div>' +
    '<div class="ov-chart-card"><div class="ov-chart-wrap ovs-tall"><canvas id="dhrSbr"></canvas></div></div>' +
    '<div id="dhrSbr-tbl" style="margin-top:8px"></div>' +
    '<div class="dbl-note" id="dhrSbrCap"></div></div>';
}
function brBuild(root){
  var pane = root.querySelector('.seg-gsec[data-sgsec="bridge"]'); if (!pane) return;
  var steps = brSteps(); if (!steps) return;
  dWaterfall(root, 'dhrSbr', steps, FMT_M, 'The bridge — every segment');
  var per = rsPeriods('y'), i0 = per.indexOf(brSt.from), i1 = per.indexOf(brSt.to);
  var op = rsAct('y', 'opinc'), rev = rsAct('y', 'rev');
  var d = op[i1] - op[i0];
  // Two different "biggest" answers, and quoting only one of them reads as a contradiction of the
  // pane's own lede: Biotechnology usually moves the most in DOLLARS, Life Sciences the most in
  // MARGIN. Name both and say which is which.
  var byAmt = null, byMgn = null;
  SEGS.forEach(function(s){
    var a = rsAct('y', s.mk), r = rsAct('y', s.rk);
    var dd = a[i1] - a[i0];
    var dm = (r[i0] && r[i1]) ? (a[i1]/r[i1] - a[i0]/r[i0]) * 100 : null;
    if (byAmt == null || dd < byAmt.d) byAmt = { s:s, d:dd };
    if (dm != null && (byMgn == null || dm < byMgn.d)) byMgn = { s:s, d:dm };
  });
  function dollars(v){ return (v >= 0 ? '+$' : '−$') + Math.abs(Math.round(v)).toLocaleString('en-US') + 'M'; }
  var cap = pane.querySelector('#dhrSbrCap');
  if (cap) cap.innerHTML = 'Group operating profit went from <b>' + fMs(op[i0]) + 'M</b> in FY' + esc(brSt.from.slice(2)) +
    ' to <b>' + fMs(op[i1]) + 'M</b> in FY' + esc(brSt.to.slice(2)) + ', a change of <b>' + dollars(d) +
    '</b> — on revenue that went from ' + fMs(rev[i0]) + 'M to ' + fMs(rev[i1]) + 'M.<br>' +
    '<b>Two different answers to "which segment".</b> In dollars the biggest mover is <b>' + esc(byAmt.s.n) +
    '</b> at ' + dollars(byAmt.d) + ', because it is large and it gave back a boom. In <i>margin</i> it is <b>' +
    esc(byMgn.s.n) + '</b> at ' + fPp(byMgn.d) + ', which is the one that says something changed about the business ' +
    'rather than about the cycle. The bridge is drawn in dollars; the margin view is one section up.<br>' +
    'These are <b>GAAP</b> segment figures, deliberately: the impairments that drive most of the fall are exactly what ' +
    'an adjusted bridge would remove, and removing them would leave a chart showing nothing happened. Corporate is ' +
    'drawn separately because it carries no revenue and so has no margin to move.';
}

// ═══ The segment explorer — Amazon's trailing collapsible ═════════════════════════════════════
function pctOf(view, key, segKey){
  var per = rsPeriods(view), i = per.length - 1, t = 0;
  SEGS.forEach(function(s){ var v = rsAct(view, key === 'rev' ? s.rk : s.mk)[i]; if (v != null) t += v; });
  var v = rsAct(view, key === 'rev' ? segOf(segKey).rk : segOf(segKey).mk)[i];
  return (t && v != null) ? v/t*100 : null;
}
var EXPLORER = {
  bio: { role:'The cyclical one', chips:function(){
      var op = rsAct('y','bioopinc'), rev = rsAct('y','bio');
      return ['Revenue <b>$8,758M → $6,759M → $7,293M</b> (FY22 → FY24 → FY25)',
              'Operating margin <b>' + fPct(op[op.length-1]/rev[rev.length-1]*100) + '</b>, back from a FY24 low',
              '<b>88%</b> recurring'];
    },
    off:'<b>What moves it:</b> customers\' manufacturing capital budgets, two years earlier. The 2021–22 biopharma build-out is what made FY2022 the peak, and the digestion of it is the whole FY2023–FY2024 decline — not share loss. <b>What to watch:</b> orders, which management says grew mid-teens in 2Q26 while revenue grew low-single digit. Either that gap is timing or the recovery is real, and only the next two prints separate them.' },
  ls: { role:'Where the margin went', chips:function(){
      var op = rsAct('y','lsopinc'), rev = rsAct('y','ls');
      return ['Operating profit <b>$1,414M → $520M</b> with revenue <b>up</b>',
              'Impairments <b>$0M → $222M → $446M</b> (FY23 → FY25)',
              '<b>' + fPct(pctOf('y','rev','ls')) + '</b> of segment revenue but <b>' + fPct(pctOf('y','op','ls')) + '</b> of segment profit',
              '<b>66%</b> recurring — the lowest of the three'];
    },
    off:'<b>What happened:</b> identifiable assets went from $17.6B to $23.7B between FY2022 and FY2023 — Abcam — and revenue did not follow. The impairments since are the accounting catching up with a price paid for growth that has not arrived. <b>What to watch:</b> whether FY2026 carries a fourth year of write-downs. Strip them and the segment is flat, not broken; that is the argument, and it depends on them stopping.' },
  dx: { role:'The profit engine', chips:function(){
      return ['<b>' + fPct(pctOf('y','rev','dx')) + '</b> of segment revenue and <b>' + fPct(pctOf('y','op','dx')) + '</b> of segment profit',
              'Operating margin steady around <b>27%</b> for three years',
              'More than <b>2×</b> Biotechnology\'s D&amp;A on ~36% more revenue',
              '<b>89%</b> recurring — the highest of the three'];
    },
    off:'<b>What moves it:</b> healthcare utilisation and reimbursement, not anyone\'s capital cycle — which is why it is the steadiest line in the company. <b>What is noise:</b> the respiratory tail (~$1,900M FY2025 → ~$1,600M expected FY2026) and China volume-based procurement, both large enough to invert reported growth without touching the business. <b>What is new:</b> Masimo, from June 2026, inside this segment and not broken out.' }
};
function explorerBody(){
  var h = '<div class="seg-explorer"><div class="seg-explorer-h">Segment explorer — Biotechnology · Life Sciences · Diagnostics ' +
    '<span class="seg-hint">tap a segment to switch</span></div><div class="segx-tabs">' +
    SEGS.map(function(s, i){
      var op = rsAct('y', s.mk), rev = rsAct('y', s.rk), n = op.length - 1;
      return '<button type="button" class="segx-tab' + (i === 0 ? ' active' : '') + '" data-dsegtab="' + esc(s.k) + '">' +
        '<span class="segx-dot" style="background:' + s.c + '"></span>' + esc(s.n) +
        ' <span class="segx-tag">' + fPct(op[n]/rev[n]*100) + ' margin · ' + esc(EXPLORER[s.k].role) + '</span></button>';
    }).join('') + '</div><div class="segx-panels">' +
    SEGS.map(function(s, i){
      var e = EXPLORER[s.k];
      return '<div class="segx-panel segx-panel-card" data-dsegpanel="' + esc(s.k) + '"' + (i > 0 ? ' hidden' : '') + '>' +
        '<div class="seg-chips">' + e.chips().map(function(c){ return '<span class="seg-chip">' + c + '</span>'; }).join('') + '</div>' +
        '<div class="seg-off">' + e.off + '</div></div>';
    }).join('') + '</div></div>';
  return h;
}

// ═══ Assembly ═════════════════════════════════════════════════════════════════════════════════
var SECTIONS = [
  ['oimargin', 'Operating profit & margin by segment'],
  ['mix',      'Revenue vs profit — common size'],
  ['bridge',   'The segment bridge']
];

var SEG_CSS = '<style>' +
  '.dhr-blseg{max-width:1000px}' +
  '.seg-explorer{border:1.5px solid var(--brand,#0F7DC2);border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,var(--brand-soft,rgba(15,125,194,.10)),transparent);margin:6px 0}' +
  '.seg-explorer-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-2,#1E3A5F);margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
  '.seg-explorer-h .seg-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}' +
  '.segx-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}' +
  '.segx-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:8px 14px;cursor:pointer;font-size:12.5px;font-weight:800;color:var(--navy);transition:.13s}' +
  '.segx-tab:hover{border-color:var(--brand,#0F7DC2)}' +
  '.segx-tab.active{background:var(--navy);border-color:var(--navy);color:#fff}.segx-tab.active .segx-tag{color:rgba(255,255,255,.8)}' +
  '.segx-dot{width:11px;height:11px;border-radius:3px;flex:none}.segx-tag{font-size:10.5px;font-weight:700;color:var(--mu)}' +
  '.segx-panel-card{background:var(--card,#fff);border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}' +
  '.seg-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}' +
  '.seg-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--navy);background:rgba(0,0,0,.035);border:1px solid var(--bdr);border-radius:7px;padding:4px 9px}' +
  '.seg-chip b{font-weight:800}' +
  '.seg-off{font-size:11.5px;color:var(--mu);line-height:1.55}.seg-off b{color:var(--navy)}' +
  '</style>';

export function dhrBlSegmentsHtml(){
  if (!rsPeriods('y').length) return '';                      // rule 6 — nothing, never broken
  var op = rsAct('y', 'opinc'), rev = rsAct('y', 'rev'), n = op.length - 1;
  return DHR_KIT_CSS + SEG_CSS + '<div class="dhr-blseg">' +
    '<p class="dbl-lede">Top Line asks how big each segment is. This asks where the profit comes from, and for ' +
      'Danaher those are different questions. In FY2025 Life Sciences was <b>' + fPct(pctOf('y','rev','ls')) +
      '</b> of segment revenue and <b>' + fPct(pctOf('y','op','ls')) + '</b> of segment operating profit; Diagnostics ' +
      'was <b>' + fPct(pctOf('y','rev','dx')) + '</b> of revenue and <b>' + fPct(pctOf('y','op','dx')) + '</b> of profit. ' +
      'Group operating margin is ' + fPct(op[n]/rev[n]*100) + ' and no segment is anywhere near it.</p>' +
    dPicker(SECTIONS, 'oimargin') +
    '<div class="seg-gsec gen-sec" data-sgsec="oimargin" data-gsec="oimargin">' + dStdScaffold({
      id:'blsegfc', title:'Operating profit & margin by segment', height:350,
      metricSel:[{ v:'op', label:'Operating profit', on:true }, { v:'impair', label:'Impairment charges' },
                 { v:'da', label:'Depreciation & amortisation' }, { v:'capex', label:'Capital expenditure' },
                 { v:'assets', label:'Identifiable assets' }],
      modes:[{ cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']],
      note:'GAAP segment figures from the 10-K and 10-Q segment notes — the adjusted segment margins management ' +
        'discusses on calls are higher and exist only for the periods a press release covers. <b>Impairment charges</b> ' +
        'is the metric to switch to: Life Sciences took $0M, $222M and $446M across FY2023–FY2025, and that line alone ' +
        'is most of why the group\'s margin fell. <b>Identifiable assets</b> is the other half — Life Sciences carries ' +
        '$23.1B against $520M of operating profit, Diagnostics $14.7B against $2,650M.'
    }) + '</div>' +
    '<div class="seg-gsec gen-sec" data-sgsec="mix" data-gsec="mix" hidden>' + dStdScaffold({
      id:'blsegmix', title:'Revenue vs profit — common size by segment', height:350,
      metricSel:[{ v:'rev', label:'Revenue', on:true }, { v:'op', label:'Operating profit' }],
      modes:[{ cls:'show', label:'Show', opts:[{ v:'amt', label:'$M', on:true }, { v:'share', label:'Share' }, { v:'growth', label:'Growth' }] },
             { cls:'layout', label:'Layout', opts:[{ v:'stack', label:'Stacked', on:true }, { v:'side', label:'Side by side' }] },
             { cls:'gran', label:'Period', opts:[{ v:'y', label:'Annual', on:true }, { v:'q', label:'Quarterly' }] }],
      presets:[['all','All'],['l5','Last 5'],['l8','Last 8']],
      note:'<b>Set Show to Share and switch the metric between Revenue and Operating profit.</b> The two stacks do not ' +
        'match, and the gap between them is the finding: a segment that is a third of the revenue and a tenth of the ' +
        'profit is not a third of the company. Share is taken of the three segments rather than of the group, because ' +
        'corporate cost carries no revenue — including it would make the profit shares sum past 100% while the revenue ' +
        'shares summed to exactly 100%, and the two stacks would stop being comparable.'
    }) + '</div>' +
    '<div class="seg-gsec gen-sec" data-sgsec="bridge" data-gsec="bridge" hidden>' + brBody() + '</div>' +
    '<div class="rs-collap" style="margin:22px 0 4px"><button type="button" class="rs-collap-h" data-selfwired data-dsegexp="1">' +
      '<span class="rs-collap-ic">▸</span> Segment explorer — what moves each one, and what is noise' +
      '<span class="rs-collap-sub">show</span></button>' +
      '<div class="rs-collap-b" hidden style="padding-top:10px">' + explorerBody() + '</div></div>' +
    '</div>';
}

export function dhrBlSegmentsInit(root){
  if (!root || typeof Chart === 'undefined') return;
  dWireTables(root);

  // The picker uses `.gen-sec` like every other DHR pane; the `data-sgsec` alias is kept so the
  // markup reads the same as Amazon's for anyone comparing the two.
  var show = dWirePicker(root, function(v){
    if (v === 'oimargin') dStdRender('blsegfc', fcDerive, root);
    if (v === 'mix')      dStdRender('blsegmix', mixDerive, root);
    if (v === 'bridge')   brBuild(root);
  });

  root.addEventListener('click', function(e){
    if (!e.target.closest) return;
    var b = e.target.closest('[data-sbrf]');
    if (b){ brSt.from = b.getAttribute('data-sbrf'); dActivate(b); brBuild(root); return; }
    b = e.target.closest('[data-sbrt]');
    if (b){ brSt.to = b.getAttribute('data-sbrt'); dActivate(b); brBuild(root); return; }
    b = e.target.closest('[data-dsegtab]');
    if (b){
      var k = b.getAttribute('data-dsegtab');
      root.querySelectorAll('[data-dsegtab]').forEach(function(x){ x.classList.toggle('active', x === b); });
      root.querySelectorAll('[data-dsegpanel]').forEach(function(p){ p.hidden = (p.getAttribute('data-dsegpanel') !== k); });
      return;
    }
    b = e.target.closest('[data-dsegexp]');
    if (b){
      var body = b.nextElementSibling;
      if (body){ body.hidden = !body.hidden;
        var ic = b.querySelector('.rs-collap-ic'); if (ic) ic.textContent = body.hidden ? '▸' : '▾';
        var sub = b.querySelector('.rs-collap-sub'); if (sub) sub.textContent = body.hidden ? 'show' : 'hide'; }
    }
  });

  show('oimargin');
}
