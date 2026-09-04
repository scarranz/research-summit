// overviews/amzn-histmult.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Historic Multiple.
//
// The multiple the market has actually paid, over time. Modelled on the Fiscal.ai "Forward P/E"
// export in Developer/AMZN — the dense daily line, the dashed average, the current-value badge —
// and then given the four controls that export does not have:
//
//   · P/E ⇄ EV/EBITDA          (the metric select)
//   · Forward ⇄ Trailing       (which side of the print the denominator comes from)
//   · NTM · Current FY · FY+1 · FY+2 · FY+3   (which period the estimate is FOR)
//   · Daily ⇄ Quarterly ⇄ Annual              (how dense the line is)
//   · a two-handle date slider + range presets + drag-to-zoom
//
// ── THE ONE IDEA THIS CHART IS BUILT ON ──────────────────────────────────────────
// A multiple is a ratio of two series on DIFFERENT CLOCKS:
//
//     multiple(t)  =  numerator(t)  ÷  denominator(t, direction, horizon)
//
//   · the numerator moves every day   — price (P/E), or price × shares + net debt (EV/EBITDA)
//   · the denominator moves in STEPS  — it only changes when the Street revises a number, or
//                                       when the period the estimate is FOR rolls forward
//
// Those steps are the cliffs in the reference image. The big drop at Jan '23 is not the market
// re-rating Amazon 30% overnight; it is "current FY" rolling from FY2022 to FY2023, so the same
// price is suddenly divided by a much larger number. **That is the single most misread feature of
// every forward-multiple chart in the industry**, which is why this one draws a dashed marker at
// each roll and lets you switch the markers off only deliberately.
//
// It is also why NTM exists. NTM never rolls — it slides:
//
//     NTM = w · FY0 + (1 − w) · FY1,     w = days left in FY0 ÷ 365
//
// so the same underlying estimates produce a smooth line instead of a staircase. Comparing "the
// stock at 28× NTM today vs 41× on average" is only honest on a basis that does not jump.
//
// ── DATA: REAL, FROM TWO SOURCES ─────────────────────────────────────────────────
//   PX        daily closes                  → Massive, via the get-market-history edge function
//             (resource:'prices' — a Polygon-shape /v2/aggs/ticker/.../range/1/day/... call, the
//             same URL family the `fx` resource in covered-calls-massive already proves works).
//   SHARES    diluted shares by quarter     → derived from get-market-history's `ratios` resource
//             (timeframe=quarterly): shares = market_cap ÷ price, per print.
//   NETDEBT   net debt by quarter           → the same `ratios` rows: enterprise_value − market_cap.
//   EST       consensus EPS / EBITDA per fiscal year, WITH ITS REVISION DATES
//             → EBITDA reads straight off estMatrix.cons.y.ebitda (js/results-data/amzn.js) — the
//             vintage archive RESULTS_CONVENTIONS §8 describes, already populated for AMZN. EPS has
//             no annual row in that matrix (its Bloomberg annual cell is basis-flagged per the
//             dataset's own notes), so it is BUILT here by summing the four quarters of
//             estMatrix.cons.q.eps for a fiscal year, per vintage — null until a vintage carries
//             all four, which is the honest state for the FY+2/FY+3 columns this early.
//   ACT       LTM EPS / EBITDA at each print → EPS: trailing four quarters of the Results dataset's
//             real views.q.metrics.eps.act. EBITDA has NO quarterly actual anywhere in the portal
//             (only annual) — LTM EV/EBITDA stays a gap; the Last FY basis (views.y.metrics.ebitda.act)
//             covers the trailing EV/EBITDA line instead.
//
// Every print date used for STEPPING (when a denominator changes) is read off estMatrix.cons.
// vintages' own lastActual field — the first vintage whose lastActual.q/y names a period is that
// period's report date, to within a few days. No calendar of report dates is hand-kept anywhere in
// this file; there is exactly one already in the dataset.
//
// ⚠ get-market-history (supabase/functions/get-market-history) is a NEW edge function shipped on
// this branch — San/Oscar have to deploy it before this pane shows real data (until then it shows
// a "live data unavailable" state, not broken charts). `market_cap`, `enterprise_value` and `price`
// on the `ratios` route are fields js/api.js's liveQuote() already reads successfully from this
// exact endpoint today — this is a parameter change (timeframe + limit) on a proven route, not a
// new schema guess. Smoke-test after deploy: the chart should draw a real, non-flat price line; if
// SHARES or NET DEBT look wrong, log one raw `ratios` row and check the field names above.

import { amznResults } from '../results-data/amzn.js';
import { fetchPriceHistory, fetchRatiosHistory } from '../api.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function num(v){ return (typeof v==='number' && isFinite(v)) ? v : null; }

// rsAttachBrush — copied verbatim from js/results.js:1221–1299 per CHART_ENGINE_REFERENCE §0.7.
// (Third copy in js/overviews/. Once a fourth chart wants it, it should move to a shared kit.)
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical){
        box.style.left = (r0.left - w0.left + area.left) + 'px';
        box.style.width = (area.right - area.left) + 'px';
      } else {
        box.style.top = (r0.top - w0.top) + 'px';
        box.style.height = r0.height + 'px';
      }
      wrap.appendChild(box);
    }
    function decide(cx, cy){
      if (vertical != null) return;
      var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy){
      if (vertical == null) return;
      ensureBox();
      if (vertical){
        var a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx);
        box.style.left = (a2 - w0.left) + 'px';
        box.style.width = (b2 - a2) + 'px';
      }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(clientX){
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        }
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

// ── Dates ────────────────────────────────────────────────────────────────────────
// Everything is a 'YYYY-MM-DD' string on the surface and an integer day underneath. No Date
// arithmetic beyond this pair, so a timezone can never shift a fiscal-year roll by a day.
var DAY = 86400000;
function dnum(s){ var p=s.split('-'); return Date.UTC(+p[0], +p[1]-1, +p[2]) / DAY; }
function dstr(n){ var d=new Date(n*DAY);
  return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2); }
function dYear(n){ return new Date(n*DAY).getUTCFullYear(); }
function dMon(n){ return new Date(n*DAY).getUTCMonth(); }         // 0-11
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dShort(n){ return MON[dMon(n)]+" '"+String(dYear(n)).slice(2); }
function dLong(n){ return MON[dMon(n)]+' '+new Date(n*DAY).getUTCDate()+', '+dYear(n); }

function todayStr(){ var d=new Date();
  return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2); }
var START = '2022-10-03', TODAY = todayStr();

// Fiscal years are calendar years for AMZN.
function fyEndDay(y){ return dnum(y+'-12-31'); }

// Step lookup: the entry in force on day `d`, or null when the series has not started yet.
function stepAt(list, d){
  var v=null;
  for(var i=0;i<list.length;i++){ if(dnum(list[i][0])<=d) v=list[i][1]; else break; }
  return v;
}

// ── Real data, built from js/results-data/amzn.js and the get-market-history edge function ──────
// PX/SHARES/NETDEBT/EST/ACT/ACT_FY/ACT_FY_V start empty and are filled once by hmLoad(); every
// reader below (denomAt, numerAt, buildSeries…) is unchanged from when they read synthetic arrays.
var PX = [];                              // [{d, px}] — daily
var SHARES = [], NETDEBT = [];            // step lists [[dateStr, value]]
var EST = { eps:{}, ebitda:{} };          // EST[metric][fiscalYear] = step list
var ACT = { eps:[], ebitda:[] };          // ACT[metric] = step list (LTM)
var ACT_FY = [];                          // step list [[dateStr, fiscalYear]]
var ACT_FY_V = { eps:{}, ebitda:{} };     // ACT_FY_V[metric][fiscalYear] = value
var hmData = { loading:false, loaded:false, error:null };

// A period like '2Q26' or a year like '2025' first became known on the date of the first
// estMatrix vintage whose lastActual names it — that vintage's own id IS the report date, to
// within a few days. One archive, reused for every series below instead of a hand-kept calendar.
function reportDateForQ(qLabel){
  var vs=amznResults.estMatrix.cons.vintages;
  for(var i=0;i<vs.length;i++){ var la=vs[i].lastActual; if(la && la.q===qLabel) return vs[i].id; }
  return null;
}
// EST.ebitda[fy] — cons.y.ebitda already carries the fiscal-year row directly; one point per
// vintage that has it.
function buildEstEbitda(){
  var vs=amznResults.estMatrix.cons.vintages, y=amznResults.estMatrix.cons.y.ebitda, out={};
  vs.forEach(function(v){
    var row=y[v.id]; if(!row) return;
    Object.keys(row).forEach(function(fy){
      var val=row[fy]; if(val==null) return;
      (out[fy]||(out[fy]=[])).push([v.id, val]);
    });
  });
  return out;
}
// EST.eps[fy] — no annual row exists for EPS (RESULTS_CONVENTIONS §8: Bloomberg's annual EPS
// basket is basis-flagged for AMZN), so it is the sum of that vintage's four quarters from
// cons.q.eps — only once all four are on file, else the fiscal year is null for that vintage.
function buildEstEpsFromQuarters(){
  var vs=amznResults.estMatrix.cons.vintages, q=amznResults.estMatrix.cons.q.eps, out={};
  vs.forEach(function(v){
    var row=q[v.id]; if(!row) return;
    var byYear={};
    Object.keys(row).forEach(function(per){
      var m=/^([1-4])Q(\d{2})$/.exec(per); if(!m) return;
      var yy='20'+m[2]; (byYear[yy]||(byYear[yy]={}))[m[1]]=row[per];
    });
    Object.keys(byYear).forEach(function(yy){
      var qs=byYear[yy];
      if(qs['1']==null||qs['2']==null||qs['3']==null||qs['4']==null) return;
      (out[yy]||(out[yy]=[])).push([v.id, qs['1']+qs['2']+qs['3']+qs['4']]);
    });
  });
  return out;
}
// ACT.eps — real trailing-4-quarter sum of views.q.metrics.eps.act, stepped at each print.
function buildActEpsLtm(){
  var m=amznResults.views.q.metrics.eps, periods=m.periods, act=m.act, out=[];
  for(var i=3;i<periods.length;i++){
    var vals=[act[i-3],act[i-2],act[i-1],act[i]];
    if(vals.some(function(v){ return v==null; })) continue;
    var d=reportDateForQ(periods[i]); if(!d) continue;
    out.push([d, vals[0]+vals[1]+vals[2]+vals[3]]);
  }
  return out;
}
// ACT_FY — the last fiscal year fully reported, stepped at each vintage's lastActual.y change.
function buildActFy(){
  var vs=amznResults.estMatrix.cons.vintages, out=[], lastY=null;
  vs.forEach(function(v){
    var y=v.lastActual && v.lastActual.y; if(!y || y===lastY) return;
    out.push([v.id, +y]); lastY=y;
  });
  return out;
}
// ACT_FY_V.ebitda — real annual actuals, direct from the dataset.
function buildActFyEbitda(){
  var m=amznResults.views.y.metrics.ebitda, out={};
  m.periods.forEach(function(y,i){ if(m.act[i]!=null) out[y]=m.act[i]; });
  return out;
}
// ACT_FY_V.eps — no annual actual row exists either; sum the four real quarterly actuals.
function buildActFyEps(){
  var m=amznResults.views.q.metrics.eps, byYear={}, out={};
  m.periods.forEach(function(p,i){
    var mm=/^([1-4])Q(\d{2})$/.exec(p); if(!mm) return;
    var yy='20'+mm[2]; (byYear[yy]||(byYear[yy]={}))[mm[1]]=m.act[i];
  });
  Object.keys(byYear).forEach(function(yy){
    var qs=byYear[yy];
    if(qs['1']==null||qs['2']==null||qs['3']==null||qs['4']==null) return;
    out[yy]=qs['1']+qs['2']+qs['3']+qs['4'];
  });
  return out;
}
// The daily price series, from get-market-history's `prices` rows ({t: ms epoch, c: close}).
function buildPxFromHistory(rows){
  return rows.map(function(r){ return { d: Math.floor(r.t/DAY), px: num(r.c) }; })
    .filter(function(p){ return p.px!=null; })
    .sort(function(a,b){ return a.d-b.d; });
}
// A quarter label out of a `ratios` row's own fiscal fields — tolerant of 'Q2', 2, '2026-Q2'…
function parseQNum(fp){
  if(fp==null) return null;
  if(typeof fp==='number' && fp>=1 && fp<=4) return String(fp);
  var s=String(fp), m=/Q\s*([1-4])/i.exec(s); if(m) return m[1];
  var m2=/^([1-4])$/.exec(s.trim()); return m2 ? m2[1] : null;
}
// SHARES + NETDEBT, from get-market-history's `ratios` rows: shares = market_cap ÷ price;
// net debt = enterprise_value − market_cap. Both fields js/api.js's liveQuote() already reads
// from this same Massive route in production — in raw dollars / a raw share count (liveQuote's
// own marketCap = price × the raw share count from `details`, and market_cap is its fallback for
// that same variable). Everything else in this file — EST, ACT, the Results dataset — is in $M and
// millions of shares (see results-data/amzn.js's own header), so both get ÷1e6 here, once, at the
// source, rather than teaching numerAt/denomAt two different scales.
function buildSharesNetDebt(rows){
  var shares=[], netDebt=[];
  rows.slice().reverse().forEach(function(r){          // rows arrive fiscal_year.desc
    var fy=r.fiscal_year, qn=parseQNum(r.fiscal_period!=null?r.fiscal_period:(r.fiscal_quarter!=null?r.fiscal_quarter:r.period));
    if(fy==null || qn==null) return;
    var d=reportDateForQ(qn+'Q'+String(fy).slice(-2)); if(!d) return;
    var price=num(r.price), mc=num(r.market_cap), ev=num(r.enterprise_value);
    if(price!=null && mc!=null) shares.push([d, (mc/price)/1e6]);      // millions of shares
    if(mc!=null && ev!=null) netDebt.push([d, (ev-mc)/1e6]);           // $M
  });
  return { shares:shares, netDebt:netDebt };
}

// Fetch once (cached for the life of the page); every call after the first is a no-op that
// resolves immediately. Errors leave hmData.error set rather than throwing, so a pane whose edge
// function isn't deployed yet shows one clear message instead of a broken chart (§0.2 rule 6).
function hmLoad(){
  if(hmData.loaded || hmData.loading) return Promise.resolve();
  hmData.loading=true;
  return Promise.all([
    fetchPriceHistory('AMZN', START, TODAY).catch(function(e){ return { success:false, error:{message:(e&&e.message)||'price fetch failed'} }; }),
    fetchRatiosHistory('AMZN', 20).catch(function(e){ return { success:false, error:{message:(e&&e.message)||'ratios fetch failed'} }; }),
  ]).then(function(res){
    var priceRes=res[0], ratiosRes=res[1];
    var priceRows=(priceRes && priceRes.success && Array.isArray(priceRes.data)) ? priceRes.data : [];
    var ratiosRows=(ratiosRes && ratiosRes.success && Array.isArray(ratiosRes.data)) ? ratiosRes.data : [];
    PX = buildPxFromHistory(priceRows);
    var sn = buildSharesNetDebt(ratiosRows);
    SHARES = sn.shares; NETDEBT = sn.netDebt;
    EST.ebitda = buildEstEbitda();
    EST.eps = buildEstEpsFromQuarters();
    ACT.eps = buildActEpsLtm();
    ACT.ebitda = [];                      // genuine gap — see the file header
    ACT_FY = buildActFy();
    ACT_FY_V.ebitda = buildActFyEbitda();
    ACT_FY_V.eps = buildActFyEps();
    hmData.loading=false; hmData.loaded=true;
    hmData.error = PX.length ? null : ((priceRes && priceRes.error && priceRes.error.message) || 'no price data');
  });
}

// ── The denominator, which is the whole chart ────────────────────────────────────
var HORIZONS = {
  ntm:   { dir:'fwd',   label:'NTM',        title:'Next twelve months — FY0 and FY1 blended by the days left in FY0, so it slides instead of stepping' },
  fy0:   { dir:'fwd',   label:'Current FY', title:'The fiscal year each date sits inside — this is the one that rolls every January' },
  fy1:   { dir:'fwd',   label:'FY+1',       title:'One fiscal year past the one each date sits in' },
  fy2:   { dir:'fwd',   label:'FY+2',       title:'Two fiscal years out' },
  fy3:   { dir:'fwd',   label:'FY+3',       title:'Three fiscal years out — thin early in the window, where nobody had published one yet' },
  ltm:   { dir:'trail', label:'LTM',        title:'The last twelve reported months, stepping at each print' },
  lastfy:{ dir:'trail', label:'Last FY',    title:'The last fiscal year fully reported' },
};
var FWD_H = ['ntm','fy0','fy1','fy2','fy3'], TRAIL_H = ['ltm','lastfy'];

function estAt(metric, fy, d){ var row=EST[metric][fy]; return row ? stepAt(row, d) : null; }
// Which fiscal year is `d` inside, and how much of it is left.
function fy0Of(d){ return dYear(d); }
function fracLeft(d){ return Math.max(0, Math.min(1, (fyEndDay(fy0Of(d)) - d) / 365)); }

function denomAt(metric, hz, d){
  if(hz==='ltm')    return stepAt(ACT[metric], d);
  if(hz==='lastfy'){ var y=stepAt(ACT_FY, d); return y==null?null:(ACT_FY_V[metric][y]!=null?ACT_FY_V[metric][y]:null); }
  var y0=fy0Of(d);
  if(hz==='ntm'){
    var a=estAt(metric,y0,d), b=estAt(metric,y0+1,d);
    if(a==null || b==null) return null;
    var w=fracLeft(d);
    return w*a + (1-w)*b;
  }
  var off = hz==='fy0'?0 : hz==='fy1'?1 : hz==='fy2'?2 : 3;
  return estAt(metric, y0+off, d);
}
// The numerator. P/E is per share; EV/EBITDA needs the whole capital structure, so it carries
// shares and net debt — which is why the two metrics cannot share one series.
function numerAt(metric, d, px){
  if(metric==='eps') return px;
  return (px * stepAt(SHARES, d)) + stepAt(NETDEBT, d);          // $M: EV
}

// The two metrics, and how each one's denominator is written down. `metric` is the key into EST /
// ACT; `denomFmt` is what the tooltip and the table print, because a multiple with an unlabelled
// denominator is a number nobody can check.
var METRICS = {
  pe:       { label:'P/E',        metric:'eps',    denomName:'EPS',
              denomFmt:function(v){ return '$'+v.toFixed(2); } },
  evebitda: { label:'EV/EBITDA',  metric:'ebitda', denomName:'EBITDA',
              denomFmt:function(v){ return '$'+Math.round(v/1000)+'B'; } },
};

// One point per business day: the multiple, plus the two halves it came from, so every tooltip and
// every table cell can show its own arithmetic instead of asking the reader to trust the ratio.
function buildSeries(mk, hz){
  var m=METRICS[mk], out=[];
  PX.forEach(function(p){
    var den=denomAt(m.metric, hz, p.d);
    var num=numerAt(m.metric, p.d, p.px);
    out.push({ d:p.d, px:p.px, den:den, v:(den==null || den<=0)?null:(num/den) });
  });
  return out;
}

// ── The four lines ───────────────────────────────────────────────────────────────
// P/E and EV/EBITDA, each forward and trailing, all four on one chart and each one a chip.
//
// The colour system carries the two dimensions so the legend is almost redundant: **the metric
// picks the hue** (P/E blue, EV/EBITDA Amazon orange) and **the direction picks the weight** —
// forward solid, trailing dashed and lighter. Two blues and two oranges, never four unrelated
// colours, because the reader's first question is "which metric" and the second is "which side of
// the print".
//
// ⚠ They cannot share a y axis. P/E runs 25–105× here and EV/EBITDA 10–25×; on one scale the
// EV/EBITDA pair is a flat line along the floor and the chart quietly says "EV/EBITDA never moves",
// which is false. So each metric gets its own axis, BOTH on the right per §0.4 — P/E inboard,
// EV/EBITDA outboard — and each axis is tinted its metric's colour, which is the only thing that
// makes a dual-axis chart readable rather than a trap.
var C_PE_F='#146EB4', C_PE_T='#7FB3E0', C_EV_F='#E08700', C_EV_T='#F5C57A';
var SERIES = [
  { k:'pe_f',  metric:'pe',       dir:'fwd',   color:C_PE_F, axis:'y',  short:'P/E fwd' },
  { k:'pe_t',  metric:'pe',       dir:'trail', color:C_PE_T, axis:'y',  short:'P/E trail', dash:true },
  { k:'ev_f',  metric:'evebitda', dir:'fwd',   color:C_EV_F, axis:'y2', short:'EV/EBITDA fwd' },
  { k:'ev_t',  metric:'evebitda', dir:'trail', color:C_EV_T, axis:'y2', short:'EV/EBITDA trail', dash:true },
];
function serOf(k){ for(var i=0;i<SERIES.length;i++) if(SERIES[i].k===k) return SERIES[i]; return SERIES[0]; }

// ── State ────────────────────────────────────────────────────────────────────────
var st = {
  hzF:'ntm',           // the basis the two FORWARD lines use
  hzT:'ltm',           // the basis the two TRAILING lines use
  gran:'daily',        // 'daily' | 'q' | 'y'
  win:null,            // [lo,hi] indices into the daily series; null = all
  range:'all',         // which preset is lit; a slider drag or a brush clears it
  yr:null,             // y-range from the brush (reads off the P/E axis)
  full:false,          // true = never frame an axis, show the whole scale spikes and all
  // All four lines start on — seeing them together is the point.
  hidden:{},
  tbl:false,           // the detail table starts CLOSED: the chart is the read, the table the receipt
  chart:null,
};
function hzOf(s){ return s.dir==='fwd' ? st.hzF : st.hzT; }
function labelOf(s){
  return METRICS[s.metric].label+' · '+(s.dir==='fwd'?'forward':'trailing')+' ('+HORIZONS[hzOf(s)].label+')';
}
function vis(k){ return !st.hidden[k]; }
function visSeries(){ return SERIES.filter(function(s){ return vis(s.k); }); }
function anyOnAxis(ax){ return visSeries().some(function(s){ return s.axis===ax; }); }

// ── Aggregation ──────────────────────────────────────────────────────────────────
// Daily is the raw line. Quarterly and annual collapse to one point per period — the AVERAGE, with
// the period's min and max kept. An average that throws away its own range is how a quiet quarter
// and a violent one end up looking identical.
function periodKey(d, gran){
  var y=dYear(d);
  return gran==='y' ? String(y) : (y+'Q'+(Math.floor(dMon(d)/3)+1));
}
function aggregate(rows, gran){
  if(gran==='daily') return rows.map(function(r){
    return { key:dstr(r.d), d:r.d, dEnd:r.d, v:r.v, lo:r.v, hi:r.v, last:r.v, den:r.den, px:r.px, n:r.v==null?0:1 };
  });
  var out=[], cur=null;
  rows.forEach(function(r){
    var k=periodKey(r.d, gran);
    if(!cur || cur.key!==k){ cur={ key:k, d:r.d, dEnd:r.d, sum:0, n:0, lo:Infinity, hi:-Infinity, den:r.den, px:r.px, v:null, last:null }; out.push(cur); }
    cur.dEnd=r.d; cur.den=r.den; cur.px=r.px;                    // carry the period's LAST reading
    if(r.v!=null){ cur.sum+=r.v; cur.n++; cur.lo=Math.min(cur.lo,r.v); cur.hi=Math.max(cur.hi,r.v); cur.last=r.v; }
  });
  out.forEach(function(c){ c.v = c.n ? c.sum/c.n : null; if(!c.n){ c.lo=null; c.hi=null; } });
  return out;
}

// ── Window ───────────────────────────────────────────────────────────────────────
// Every line shares one date grid (they are all priced off the same PX series), so the window is
// one pair of indices into that grid and every series slices with it. That is what keeps the four
// lines, the slider, the range readout and the table talking about the same stretch of time.
function winOf(n){
  if(!st.win) return [0, n-1];
  return [Math.max(0,Math.min(n-1,st.win[0])), Math.max(0,Math.min(n-1,st.win[1]))];
}
function presetWin(key){
  if(!PX.length) return null;             // still loading — nothing to window yet
  var last=PX[PX.length-1].d;
  var back={ '1y':365, '2y':730, '3y':1095, '5y':1825 }[key];
  if(!back) return null;
  var from=last-back, lo=0;
  for(var i=0;i<PX.length;i++){ if(PX[i].d>=from){ lo=i; break; } }
  return [lo, PX.length-1];
}
// The visible points for one series, already windowed and aggregated.
function pointsFor(s){
  var w=winOf(PX.length);
  return aggregate(buildSeries(s.metric, hzOf(s)).slice(w[0], w[1]+1), st.gran);
}
function idxOfDay(d){
  for(var i=0;i<PX.length;i++) if(PX[i].d>=d) return i;
  return PX.length-1;
}

// ── Stats, computed over the WINDOW (never the whole series) ─────────────────────
function statsOf(pts){
  var vs=pts.map(function(p){ return p.v; }).filter(function(v){ return v!=null; });
  if(!vs.length) return null;
  var sum=vs.reduce(function(a,b){ return a+b; },0), avg=sum/vs.length;
  var sd=Math.sqrt(vs.reduce(function(a,b){ return a+(b-avg)*(b-avg); },0)/vs.length);
  var first=vs[0], last=vs[vs.length-1];
  return { avg:avg, sd:sd, min:Math.min.apply(null,vs), max:Math.max.apply(null,vs),
           first:first, last:last, chg:first>0?(last/first-1):null, n:vs.length };
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtX(v){ return v==null ? '—' : v.toFixed(1)+'×'; }
function fmtPxv(v){ return '$'+(v>=100?Math.round(v).toLocaleString('en-US'):v.toFixed(2)); }
function signPct(p){ return p==null?'—':((p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'); }

// ── Body ─────────────────────────────────────────────────────────────────────────
function hmBody(){
  var h='<style>'+
    '.hm-notice{padding:14px 2px;color:var(--mu);font:400 12px Inter,sans-serif}'+
    '.hm-blk .rs-preset.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.hm-leg{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0 6px}'+
    '.hm-chartwrap{position:relative;height:380px;margin:2px 0 4px}'+
    '#hmTable{overflow-x:auto}'+
    '.hm-tbl{border-collapse:collapse;width:100%;font-size:12px;margin:4px 0}'+
    '.hm-tbl th,.hm-tbl td{padding:7px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.hm-tbl th:first-child,.hm-tbl td:first-child{text-align:left}'+
    '.hm-tbl thead th{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.hm-tbl tbody tr:hover td{background:#F6F8FA}'+
    '.hm-tbl td.hm-out{font-weight:800;color:var(--navy)}'+
    '.hm-slider{margin:10px 2px 2px}'+
    // the range readout: one inline pill per line, replacing the six tiles that used to sit here
    '.hm-range{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:11px;margin:6px 2px 2px}'+
    '.hm-range-l{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}'+
    '.hm-range-i{display:inline-flex;align-items:baseline;gap:6px;color:var(--mu)}'+
    '.hm-range-i b{font-size:12.5px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.hm-sw{width:9px;height:9px;border-radius:2px;display:inline-block;align-self:center}'+
    '.hm-full{appearance:none;border:1px solid rgba(178,106,0,.4);background:rgba(255,153,0,.08);color:#B26A00;'+
      'font:700 10.5px Inter,sans-serif;padding:3px 9px;border-radius:999px;cursor:pointer}'+
    '.hm-full:hover{background:rgba(255,153,0,.16)}'+
    '</style>';

  h+='<div class="rs-block hm-blk" id="hmBlock">';
  // Row 1 is identity. There is no metric select: the four chips ARE the picker, and a dropdown
  // repeating them would be a second control for the same choice.
  h+='<div class="rs-block-top"><div class="rs-block-h">Historic Multiple</div>'+
     '<span class="rs-quick-l" style="margin-left:6px">P/E and EV/EBITDA, forward and trailing — click a chip to drop one</span></div>';
  h+='<div class="rs-block-modes"><div class="rs-modes" id="hmModes"></div>'+
     '<div class="rs-quick"><span class="rs-quick-l">Range</span>'+
       ['1y','2y','3y','5y','all'].map(function(k){
         return '<button type="button" class="rs-preset" data-hmrange="'+k+'">'+(k==='all'?'All':k.toUpperCase())+'</button>'; }).join('')+
     '</div></div>';
  // The date slider sits ABOVE the legend, with the other window controls, rather than under the
  // chart: it picks WHICH dates are on screen, so it belongs beside the Range presets it shares
  // state with, not below the thing it filters.
  h+='<div class="sg-controls hm-slider"><div class="sg-slider">'+
       '<div class="sg-track"><div class="sg-fill" id="hmFill"></div></div>'+
       '<input type="range" id="hmMin" min="0" max="1" value="0" step="1" aria-label="Range start">'+
       '<input type="range" id="hmMax" min="0" max="1" value="1" step="1" aria-label="Range end">'+
     '</div><div class="sg-ends"><span id="hmEnd0"></span><span id="hmEnd1"></span></div></div>';
  h+='<div class="hm-leg" id="hmLeg"></div>';
  h+='<div class="hm-chartwrap"><canvas id="hmChart"></canvas></div>';
  h+='<div class="hm-range" id="hmRange"></div>';
  h+='<div class="rs-collap" data-hmtbl="1">'+
       '<button type="button" class="rs-collap-h" data-hmtblb="1" id="hmTblH"></button>'+
       '<div class="rs-collap-b" id="hmTblBody"'+(st.tbl===true?'':' hidden')+'>'+
         '<div class="rs-tablewrap" id="hmTable"></div>'+
       '</div></div>';
  h+='<div class="ov-foot" id="hmFoot"></div>';
  h+='</div>';
  return h;
}

// ── Controls ─────────────────────────────────────────────────────────────────────
// With both directions on screen at once there is no Forward/Trailing switch — instead BOTH
// bases are pickable, each governing its own pair of lines. A basis whose lines are both hidden
// is disabled with the reason in its tooltip rather than silently doing nothing.
function modesHtml(){
  var b=function(attr,val,on,label,title,off){
    return '<button type="button" class="rs-view'+(on?' active':'')+'" data-'+attr+'="'+val+'"'+
      (off?' disabled':'')+(title?' title="'+esc(title)+'"':'')+'>'+esc(label)+'</button>';
  };
  var fwdOff = !(vis('pe_f')||vis('ev_f')), trailOff = !(vis('pe_t')||vis('ev_t'));
  var h='<div class="rs-views" title="'+(fwdOff?'Both forward lines are hidden':'The period the forward estimates are FOR')+'">'+
    FWD_H.map(function(k){ return b('hmhzf',k,st.hzF===k,HORIZONS[k].label,HORIZONS[k].title,fwdOff); }).join('')+'</div>';
  h+='<div class="rs-views" title="'+(trailOff?'Both trailing lines are hidden':'What the company had already reported')+'">'+
    TRAIL_H.map(function(k){ return b('hmhzt',k,st.hzT===k,HORIZONS[k].label,HORIZONS[k].title,trailOff); }).join('')+'</div>';
  h+='<div class="rs-views">'+
    b('hmgran','daily',st.gran==='daily','Daily','Every business day')+
    b('hmgran','q',st.gran==='q','Quarterly','One point per quarter — the average of the quarter')+
    b('hmgran','y',st.gran==='y','Annual','One point per year — the average of the year')+'</div>';
  return h;
}
function chip(k, label, color, dash, off, title){
  return '<button type="button" class="rs-leg'+(vis(k)?'':' off')+'" data-hmleg="'+k+'"'+
    (off?' disabled':'')+' title="'+esc(title||'Show / hide')+'">'+
    '<span class="'+(dash?'rs-leg-dash':'rs-leg-line')+'" style="background:'+color+'"></span>'+esc(label)+'</button>';
}
function legendHtml(){
  var h=SERIES.map(function(s){ return chip(s.k, labelOf(s), s.color, s.dash); }).join('');
  // The average only means something on ONE line: four dashed means is four more lines and no more
  // information. Disabled with the reason rather than hidden, so the control is never a mystery.
  var one=visSeries().length===1;
  h+=chip('avg','Average over the range','#8A93A0',true,!one,
      one?'The dashed mean of the one visible line':'Show a single line to get its average');
  // Rolls only exist on a basis that rolls. NTM slides and the trailing bases step at prints.
  var rollable = (st.hzF!=='ntm') && (vis('pe_f')||vis('ev_f'));
  if(rollable) h+=chip('roll','Fiscal-year rolls','#C0392B',true,false,
      'The dashed verticals where the forward period rolls to the next fiscal year');
  return h;
}
function tblHeadHtml(n){
  var open=st.tbl===true;
  var unit=st.gran==='y'?'year':'quarter';
  var vs=visSeries().length;
  return '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>Detail'+
    '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+vs+' line'+(vs===1?'':'s')+', '+
    n+' '+unit+(n===1?'':'s')+' in the selected range</span>';
}

// ── Chart ────────────────────────────────────────────────────────────────────────
// Two local plugins, in the spirit of the engine's rsConvRef/rsConvLast: one draws the "Avg: 41.2"
// tag on the dashed mean, the other the current-value badge at the right edge — one per visible
// line, in that line's own colour, stacked when they would collide.
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
var hmTags = {
  id:'hmTags',
  afterDatasetsDraw:function(chart, args, opts){
    var o=opts||{}, ctx=chart.ctx, ar=chart.chartArea;
    ctx.save(); ctx.font='700 11px Inter, sans-serif'; ctx.textBaseline='middle';
    if(o.avg!=null){
      var ys=chart.scales[o.avgAxis]||chart.scales.y, y=ys.getPixelForValue(o.avg);
      if(y>ar.top && y<ar.bottom){
        var t='Avg: '+o.avg.toFixed(1), w=ctx.measureText(t).width+10;
        ctx.fillStyle='#F7F9FB'; rr(ctx, ar.left+4, y-18, w, 15, 4); ctx.fill();
        ctx.fillStyle='#4A5563'; ctx.fillText(t, ar.left+9, y-10);
      }
    }
    var used=[];
    (o.last||[]).forEach(function(b){
      var sc=chart.scales[b.axis]; if(!sc || b.v==null) return;
      var y=sc.getPixelForValue(b.v);
      if(!(y>ar.top-20 && y<ar.bottom+20)) return;
      // stack rather than overprint: two lines can land on the same pixel row
      while(used.some(function(u){ return Math.abs(u-y)<17; })) y+=17;
      used.push(y);
      var t=b.v.toFixed(1), w=ctx.measureText(t).width+12;
      ctx.fillStyle=b.color; rr(ctx, ar.right-w+34, y-9, w, 18, 5); ctx.fill();
      ctx.fillStyle='#fff'; ctx.fillText(t, ar.right-w+40, y);
    });
    ctx.restore();
  }
};
var hmRolls = {
  id:'hmRolls',
  beforeDatasetsDraw:function(chart, args, opts){
    var idx=(opts&&opts.at)||[]; if(!idx.length) return;
    var ctx=chart.ctx, ar=chart.chartArea, xs=chart.scales.x;
    ctx.save(); ctx.strokeStyle='rgba(192,57,43,0.35)'; ctx.lineWidth=1;
    idx.forEach(function(p){
      var x=xs.getPixelForValue(p.i); if(x<ar.left||x>ar.right) return;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(x, ar.top); ctx.lineTo(x, ar.bottom); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle='rgba(192,57,43,0.75)'; ctx.font='700 9px Inter, sans-serif';
      ctx.fillText('→ FY'+p.fy, x+3, ar.top+9);
    });
    ctx.restore();
  }
};

// ── Framing an axis when one line blows up ───────────────────────────────────────
// A trailing multiple explodes whenever the denominator approaches zero: AMZN's LTM EPS collapsed
// in 2022-23, so trailing P/E goes to ~600× there. That is a REAL number and it is exactly what a
// collapsing earnings base does to a multiple — but on a shared axis it flattens the other three
// lines into the floor and the chart stops saying anything.
//
// So the axis frames the meaningful range and lets the spike run off the top, rather than dropping
// the points (which would hide the event) or scaling to it (which would hide everything else).
// Nothing is concealed: the range readout under the chart prints the true high, the tooltip gives
// the exact value, and a y-drag or double-click gets the full scale back.
function clipOf(data, axisId){
  if(st.full) return undefined;                    // the reader asked for the whole scale
  var vs=[];
  visSeries().forEach(function(s){
    if(s.axis!==axisId) return;
    data[s.k].pts.forEach(function(p){ if(p.v!=null) vs.push(p.v); });
  });
  if(vs.length<20) return undefined;
  vs.sort(function(a,b){ return a-b; });
  var med=vs[Math.floor(vs.length*0.5)], p90=vs[Math.floor(vs.length*0.9)], mx=vs[vs.length-1];
  // The test is against the MEDIAN, not a high percentile: a collapsing earnings base keeps a
  // trailing multiple absurd for months, so a p98 test sits inside the spike and never fires. Four
  // times the median is a blow-up; anything under that is just a volatile multiple and is left alone.
  if(mx <= med*4) return undefined;
  return Math.max(p90*1.2, med*2.5);
}
function clipped(data, axisId){
  var c=clipOf(data, axisId); if(c==null) return null;
  var over=[];
  visSeries().forEach(function(s){
    if(s.axis!==axisId) return;
    var hi=data[s.k].sm && data[s.k].sm.max;
    if(hi!=null && hi>c) over.push(s);
  });
  return over.length ? { at:c, series:over } : null;
}

function buildChart(scope, data){
  var cv=scope.querySelector('#hmChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(st.chart){ try{ st.chart.destroy(); }catch(e){} st.chart=null; }
  var vs=visSeries();
  if(!vs.length) return;                          // every chip off — nothing to draw, nothing broken

  var ref=data[vs[0].k].pts;
  var labels=ref.map(function(p){ return st.gran==='daily' ? dShort(p.d) : p.key; });
  var ds=[], badges=[];

  // the mean, only when exactly one line is on screen
  var solo = vs.length===1 ? vs[0] : null;
  var soloSm = solo ? data[solo.k].sm : null;
  if(solo && soloSm && vis('avg'))
    ds.push({ label:'Average', yAxisID:solo.axis, data:ref.map(function(){ return soloSm.avg; }),
      borderColor:'#8A93A0', borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false, tension:0 });

  vs.forEach(function(s){
    var pts=data[s.k].pts, sm=data[s.k].sm;
    ds.push({ label:labelOf(s), yAxisID:s.axis, _k:s.k,
      data:pts.map(function(p){ return p.v; }),
      borderColor:s.color, backgroundColor:s.color,
      borderWidth:st.gran==='daily'?1.4:2.4, borderDash:s.dash?[5,3]:undefined,
      tension:st.gran==='daily'?0:.25, fill:false, spanGaps:false,
      pointRadius:st.gran==='daily'?0:3, pointHoverRadius:4 });
    if(sm) badges.push({ v:sm.last, color:s.color, axis:s.axis });
  });

  // where the forward denominator rolls, for the marker plugin
  var rolls=[];
  if(vis('roll') && st.hzF!=='ntm' && (vis('pe_f')||vis('ev_f'))){
    var off = st.hzF==='fy1'?1 : st.hzF==='fy2'?2 : st.hzF==='fy3'?3 : 0;
    for(var i=1;i<ref.length;i++) if(dYear(ref[i-1].d)!==dYear(ref[i].d)) rolls.push({ i:i, fy:dYear(ref[i].d)+off });
  }

  var everyN=Math.max(1, Math.round(ref.length/8));
  var axisOpts=function(id, on, color, useYr){
    var cl=clipOf(data, id);
    return { position:'right', display:on, weight:(id==='y2'?1:0),
      grid:{ color:'#EEF2F7', drawOnChartArea:(id==='y') },
      min: (useYr && st.yr) ? st.yr[0] : undefined,
      // A brushed zoom always wins; otherwise the frame caps the axis and the spike runs off the
      // top, which is the whole point — and one click on the note below restores the full scale.
      max: (useYr && st.yr) ? st.yr[1] : cl,
      ticks:{ color:color, font:{ size:10 }, callback:function(v){ return v.toFixed(0)+'×'; } } };
  };
  st.chart=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:false },
        hmTags:{ avg:(solo&&soloSm&&vis('avg'))?soloSm.avg:null, avgAxis:solo?solo.axis:'y', last:badges },
        hmRolls:{ at:rolls },
        tooltip:{ callbacks:{
            title:function(items){ var p=ref[items[0].dataIndex];
              return st.gran==='daily' ? dLong(p.d) : p.key; },
            label:function(c){
              if(c.dataset.label==='Average') return 'Average over the range: '+fmtX(c.parsed.y);
              var s=serOf(c.dataset._k), p=data[s.k].pts[c.dataIndex];
              if(!p || p.v==null) return labelOf(s)+': no estimate on this date';
              // every tooltip shows its own arithmetic — the price ÷ the number that stood that day
              return labelOf(s)+': '+fmtX(p.v)+'  ·  '+fmtPxv(p.px)+
                '  ÷  '+METRICS[s.metric].denomName+' '+METRICS[s.metric].denomFmt(p.den);
            } } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 }, maxRotation:0, autoSkip:false,
            callback:function(v,i){ return i%everyN===0 ? labels[i] : ''; } } },
        y:  axisOpts('y',  anyOnAxis('y'),  C_PE_F, true),
        y2: axisOpts('y2', anyOnAxis('y2'), C_EV_F, false) } },
    plugins:[hmTags, hmRolls]
  });

  // Both axes zoom. Here x IS windowable — it is a date range — so onX is wired, unlike the
  // snapshot charts in the Target Multiple tab. A vertical drag reads off the P/E axis.
  rsAttachBrush(cv, st.chart,
    function(a,b){
      st.win=[ idxOfDay(ref[a].d), idxOfDay(ref[b].dEnd||ref[b].d) ];
      st.range=null; render(scope);
    },
    function(v1,v2){ st.yr=[v1,v2]; render(scope); },
    function(){ st.win=null; st.range='all'; st.yr=null; render(scope); });
}

// ── The range readout ────────────────────────────────────────────────────────────
// One inline pill per visible line — low to high over the selected range, in that line's colour.
// It replaced a row of six tiles: with four lines the tiles would have been twenty-four boxes,
// and the one number a reader actually wants beside a multiple chart is where it has traded.
function renderRange(scope, data){
  var el=scope.querySelector('#hmRange'); if(!el) return;
  var vs=visSeries();
  if(!vs.length){ el.innerHTML='<span class="hm-range-l">Every line is switched off — click a chip above</span>'; return; }
  var h='<span class="hm-range-l">Range</span>'+vs.map(function(s){
    var sm=data[s.k].sm;
    if(!sm) return '<span class="hm-range-i"><span class="hm-sw" style="background:'+s.color+'"></span>'+
      esc(s.short)+' <b>—</b> <span>no estimate this far back</span></span>';
    return '<span class="hm-range-i"><span class="hm-sw" style="background:'+s.color+'"></span>'+
      esc(s.short)+' <b>'+fmtX(sm.min)+' – '+fmtX(sm.max)+'</b>'+
      '<span>now '+fmtX(sm.last)+'</span></span>';
  }).join('');
  // If an axis is framed below a line's true high, say so — and make the note the control that
  // undoes it, because "the axis is hiding something" and "click here to see it" belong together.
  if(st.full){
    h+='<button type="button" class="hm-full" data-hmfull="1">↕ Full scale — reframe</button>';
  } else {
    ['y','y2'].forEach(function(ax){
      var c=clipped(data, ax); if(!c) return;
      h+='<button type="button" class="hm-full" data-hmfull="1">↑ '+esc(c.series.map(function(s){ return s.short; }).join(', '))+
         ' runs off the top — framed at '+fmtX(c.at)+', click for full scale</button>';
    });
  }
  el.innerHTML=h;
}

// ── Table ────────────────────────────────────────────────────────────────────────
// One row per period, one column per visible line, plus the price — because "why did the multiple
// move" is almost always answered by which half of the ratio moved.
function renderTable(scope){
  var g=(st.gran==='y')?'y':'q';                  // daily would be a thousand rows; group to quarters
  var w=winOf(PX.length), vs=visSeries();
  var el=scope.querySelector('#hmTable'); if(!el) return 0;
  if(!vs.length){ el.innerHTML=''; return 0; }
  var cols=vs.map(function(s){ return { s:s, pts:aggregate(buildSeries(s.metric, hzOf(s)).slice(w[0], w[1]+1), g) }; });
  var n=cols[0].pts.length, rows='';
  for(var i=n-1;i>=0;i--){                        // newest first
    var base=cols[0].pts[i];
    rows+='<tr><td><b>'+esc(base.key)+'</b></td>'+
      cols.map(function(c){ return '<td class="hm-out">'+fmtX(c.pts[i].v)+'</td>'; }).join('')+
      '<td>'+fmtPxv(base.px)+'</td>'+
      '<td>'+(base.den!=null ? METRICS[cols[0].s.metric].denomFmt(base.den) : '—')+'</td></tr>';
  }
  el.innerHTML='<table class="hm-tbl"><thead><tr><th>'+(g==='y'?'Year':'Quarter')+'</th>'+
    cols.map(function(c){ return '<th>'+esc(c.s.short)+'</th>'; }).join('')+
    '<th>Price</th><th>'+esc(METRICS[cols[0].s.metric].denomName)+' · '+esc(cols[0].s.short)+'</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';
  return n;
}

function footHtml(){
  return '<b>How the lines are built.</b> Each is a price divided by a number that stood on that day: '+
    '<b>P/E</b> = price ÷ EPS, <b>EV/EBITDA</b> = (price × diluted shares + net debt) ÷ EBITDA, on every business day. '+
    '<b>Forward</b> takes the estimate for the period you pick, <b>trailing</b> takes what the company had already reported. '+
    'The denominator is a <b>step series</b>: it changes only when the Street revises, or when the period it is FOR rolls forward — '+
    'which is what the vertical drops in a forward-multiple chart actually are, not a re-rating. '+
    '<b>NTM</b> avoids the staircase by blending: FY0 × (days left in FY0 ÷ 365) + FY1 × the rest. '+
    '<b>The two metrics keep separate axes</b>, both on the right and tinted their line\'s colour — P/E runs three to five times '+
    'EV/EBITDA, so one shared scale would flatten EV/EBITDA into a line along the floor. '+
    'Quarterly and annual points are the <b>average</b> over the period. The range readout follows the <b>selected range</b>, so it moves with '+
    'the slider. '+
    '<b>Sourcing.</b> Price is Massive\'s daily close. Diluted shares and net debt are derived each quarter from the same feed\'s ratios '+
    '(market cap ÷ price, and enterprise value − market cap). Consensus EPS and EBITDA read off the Bloomberg vintage archive AMZN already '+
    'carries (<code>estMatrix</code> — RESULTS_CONVENTIONS §8); forward FY EPS is the sum of that vintage\'s four quarters, so a fiscal year '+
    'with fewer than four quarters on file is blank rather than guessed. Trailing P/E is the real reported LTM EPS. '+
    '<b>EV/EBITDA has no LTM basis</b> — no quarterly EBITDA actual exists anywhere in the portal yet — use <b>Last FY</b> for the trailing '+
    'EV/EBITDA line, which reads the reported annual figure directly.';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
  if(!hmData.loaded || hmData.error){    // still fetching, or the fetch failed / came back empty
    var md0=scope.querySelector('#hmModes'); if(md0) md0.innerHTML='';
    var lg0=scope.querySelector('#hmLeg'); if(lg0) lg0.innerHTML='';
    var cw=scope.querySelector('.hm-chartwrap');
    if(cw) cw.innerHTML='<div class="hm-notice">'+
      (hmData.error ? '⚑ Live data unavailable ('+esc(hmData.error)+') — this pane needs the <code>get-market-history</code> edge function deployed.'
                    : 'Loading price history…')+
      '</div>';
    var rg0=scope.querySelector('#hmRange'); if(rg0) rg0.innerHTML='';
    var tbl0=scope.querySelector('#hmTable'); if(tbl0) tbl0.innerHTML='';
    var th0=scope.querySelector('#hmTblH'); if(th0) th0.innerHTML='';
    var ft0=scope.querySelector('#hmFoot'); if(ft0) ft0.innerHTML=footHtml();
    return;
  }
  // Loading (or the error state) may have overwritten the canvas with a text notice — put it back.
  var cwR=scope.querySelector('.hm-chartwrap');
  if(cwR && !cwR.querySelector('#hmChart')) cwR.innerHTML='<canvas id="hmChart"></canvas>';
  var md=scope.querySelector('#hmModes'); if(md) md.innerHTML=modesHtml();
  var lg=scope.querySelector('#hmLeg'); if(lg) lg.innerHTML=legendHtml();
  scope.querySelectorAll('[data-hmrange]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-hmrange')===st.range); });

  // build every visible line once, and hand the SAME objects to the chart, the range readout and
  // the table — one computation, so the three can never disagree
  var data={};
  visSeries().forEach(function(s){ var pts=pointsFor(s); data[s.k]={ pts:pts, sm:statsOf(pts) }; });

  syncSlider(scope);
  renderRange(scope, data);
  var n=renderTable(scope);
  var th=scope.querySelector('#hmTblH'); if(th) th.innerHTML=tblHeadHtml(n||0);
  var tb=scope.querySelector('#hmTblBody'); if(tb) tb.hidden=(st.tbl!==true);
  var ft=scope.querySelector('#hmFoot'); if(ft) ft.innerHTML=footHtml();

  requestAnimationFrame(function(){ buildChart(scope, data); });
}
function syncSlider(scope){
  var mn=scope.querySelector('#hmMin'), mx=scope.querySelector('#hmMax');
  if(!mn||!mx) return;
  var w=winOf(PX.length), n=PX.length-1;
  mn.max=String(n); mx.max=String(n);
  mn.value=String(w[0]); mx.value=String(w[1]);
  var f=scope.querySelector('#hmFill');
  if(f){ var a=w[0]/n*100, b=w[1]/n*100; f.style.left=a+'%'; f.style.width=(b-a)+'%'; }
  var e0=scope.querySelector('#hmEnd0'), e1=scope.querySelector('#hmEnd1');
  if(e0) e0.textContent=dLong(PX[w[0]].d);
  if(e1) e1.textContent=dLong(PX[w[1]].d);
}

// ── Init ─────────────────────────────────────────────────────────────────────────
function initHm(root){
  var scope=root.querySelector('.ovt-subpane[data-ovst="histmult"]');
  if(!scope || !scope.querySelector('#hmChart')) return;
  if(!scope._wired){
    scope._wired=true;
    scope.addEventListener('click', function(e){
      var t;
      if((t=e.target.closest('[data-hmhzf]'))){ st.hzF=t.getAttribute('data-hmhzf'); st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-hmhzt]'))){ st.hzT=t.getAttribute('data-hmhzt'); st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-hmgran]'))){ st.gran=t.getAttribute('data-hmgran'); st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-hmrange]'))){
        var k=t.getAttribute('data-hmrange');
        st.win=(k==='all')?null:presetWin(k);
        st.range=k; st.yr=null; return render(scope);
      }
      if((t=e.target.closest('[data-hmfull]'))){ st.full=!st.full; st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-hmleg]'))){
        var k2=t.getAttribute('data-hmleg'); st.hidden[k2]=!st.hidden[k2];
        st.yr=null;                          // the axis can change scale entirely — drop the zoom
        return render(scope);
      }
      if((t=e.target.closest('[data-hmtblb]'))){
        st.tbl=(st.tbl!==true);
        var b=scope.querySelector('#hmTblBody'); if(b) b.hidden=(st.tbl!==true);
        return render(scope);
      }
    });
    // The slider is the one control that cannot be delegated — a drag fires `input`, not `click`.
    var mn=scope.querySelector('#hmMin'), mx=scope.querySelector('#hmMax');
    function onSlide(){
      var a=+mn.value, b=+mx.value;
      st.win=[Math.min(a,b), Math.max(a,b)];       // either handle can be dragged past the other
      st.range=null; st.yr=null; render(scope);
    }
    mn.oninput=onSlide; mx.oninput=onSlide;
  }
  render(scope);                          // paint immediately: the loaded chart, or the loading state
  if(!hmData.loaded && !hmData.error) hmLoad().then(function(){ render(scope); });
}

export var amznHistMult = { body: hmBody, init: initHm };
