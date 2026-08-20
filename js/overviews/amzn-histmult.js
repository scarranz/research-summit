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
// ── DATA: EVERY NUMBER BELOW IS SYNTHETIC ────────────────────────────────────────
// Nothing here is sourced. The shapes are real, the paths are plausible, the values are invented
// to fix the layout while we agree on the idea — the UI says so in amber and the footnote repeats
// it. What each series has to come from once we wire it:
//
//   PRICE_M   daily closes                  → Massive (already behind liveQuote) or IBKR history
//   SHARES    diluted shares by quarter     → the Results dataset (AMZN:shares) — it is already there
//   NETDEBT   net debt by quarter           → Massive balance-sheet, or the model
//   EST       consensus EPS / EBITDA per fiscal year, WITH ITS REVISION DATES
//                                           → this is the hard one: it is a vintage archive, not a
//                                             current number. `estMatrix` in the Results dataset is
//                                             exactly this shape for AMZN (RESULTS_CONVENTIONS §8),
//                                             and Bloomberg covers the ticker — so the path exists.
//   ACT       LTM EPS / EBITDA at each print → derivable from the Results dataset's quarterly actuals
//
// The estimate archive is the only genuinely missing piece. Everything else is already in the
// portal in some form. Worth discussing before anyone buys a data feed for it.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
function dDow(n){ return new Date(n*DAY).getUTCDay(); }           // 0 = Sunday
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dShort(n){ return MON[dMon(n)]+" '"+String(dYear(n)).slice(2); }
function dLong(n){ return MON[dMon(n)]+' '+new Date(n*DAY).getUTCDate()+', '+dYear(n); }

var START = '2022-10-03', TODAY = '2026-08-19';   // the window the placeholder covers

// ── SYNTHETIC DATA ───────────────────────────────────────────────────────────────
// Monthly price anchors, interpolated to business days with a deterministic wiggle (see mkPrice).
var PRICE_M = [
  ['2022-10-01',102],['2022-11-01', 94],['2022-12-01', 84],
  ['2023-01-01',103],['2023-02-01', 94],['2023-03-01',103],['2023-04-01',105],['2023-05-01',120],['2023-06-01',130],
  ['2023-07-01',133],['2023-08-01',138],['2023-09-01',127],['2023-10-01',133],['2023-11-01',146],['2023-12-01',152],
  ['2024-01-01',155],['2024-02-01',176],['2024-03-01',180],['2024-04-01',175],['2024-05-01',176],['2024-06-01',193],
  ['2024-07-01',186],['2024-08-01',179],['2024-09-01',186],['2024-10-01',186],['2024-11-01',207],['2024-12-01',219],
  ['2025-01-01',238],['2025-02-01',212],['2025-03-01',190],['2025-04-01',184],['2025-05-01',205],['2025-06-01',219],
  ['2025-07-01',232],['2025-08-01',228],['2025-09-01',220],['2025-10-01',235],['2025-11-01',245],['2025-12-01',232],
  ['2026-01-01',240],['2026-02-01',252],['2026-03-01',244],['2026-04-01',238],['2026-05-01',255],['2026-06-01',268],
  ['2026-07-01',262],['2026-08-01',258],['2026-09-01',258],
];
// Step series: the value in force from that date until the next entry.
var SHARES  = [['2022-10-01',10250],['2023-06-30',10350],['2024-06-30',10520],['2025-06-30',10721],['2026-03-31',10827]]; // millions
var NETDEBT = [['2022-10-01',35000],['2023-06-30',18000],['2024-06-30',2000],['2025-03-31',-8000],['2026-03-31',15000]];  // $M, negative = net cash

// Fiscal years are calendar years for AMZN.
function fyEndDay(y){ return dnum(y+'-12-31'); }

// EST[metric][fiscalYear] = the consensus figure and the date it started standing at that level.
// This is the vintage archive the whole chart hangs on: not "what consensus says", but "what
// consensus said, on each date". EPS in $/share, EBITDA in $M.
var EST = {
  eps: {
    2022: [['2022-10-01',0.20]],
    2023: [['2022-10-01',1.20],['2023-02-03',1.05],['2023-05-01',1.35],['2023-08-04',1.90],['2023-11-01',2.55],['2024-02-02',2.90]],
    2024: [['2022-10-01',2.10],['2023-02-03',1.90],['2023-08-04',2.55],['2024-02-02',3.60],['2024-08-02',4.60],['2024-11-01',5.20],['2025-02-07',5.53]],
    2025: [['2023-08-04',3.30],['2024-02-02',4.60],['2024-08-02',5.60],['2025-02-07',6.30],['2025-08-01',6.60],['2026-02-06',6.90]],
    2026: [['2024-08-02',6.80],['2025-02-07',7.50],['2025-08-01',8.10],['2026-02-06',8.55],['2026-05-01',8.60]],
    2027: [['2025-08-01',9.60],['2026-02-06',10.40],['2026-05-01',10.90],['2026-08-04',11.00]],
    2028: [['2026-02-06',12.20],['2026-08-04',12.70]],
    2029: [['2026-08-04',15.70]],
  },
  ebitda: {
    2022: [['2022-10-01',54000]],
    2023: [['2022-10-01',72000],['2023-02-03',68000],['2023-05-01',76000],['2023-08-04',82000],['2023-11-01',85000],['2024-02-02',85500]],
    2024: [['2022-10-01',92000],['2023-02-03',88000],['2023-08-04',104000],['2024-02-02',114000],['2024-08-02',119000],['2025-02-07',121000]],
    2025: [['2023-08-04',124000],['2024-02-02',136000],['2024-08-02',146000],['2025-02-07',152000],['2025-08-01',155000],['2026-02-06',157000]],
    2026: [['2024-08-02',168000],['2025-02-07',180000],['2025-08-01',190000],['2026-02-06',196000],['2026-05-01',198000]],
    2027: [['2025-08-01',220000],['2026-02-06',234000],['2026-05-01',240000],['2026-08-04',243000]],
    2028: [['2026-02-06',268000],['2026-08-04',280000]],
    2029: [['2026-08-04',318000]],
  },
};
// ACT[metric] = the LTM figure that stood from each report date. Steps once per print.
var ACT = {
  eps: [['2022-10-27',-0.10],['2023-02-02',0.20],['2023-04-27',0.60],['2023-08-03',1.20],['2023-10-26',1.90],
        ['2024-02-01',2.90],['2024-04-30',3.55],['2024-08-01',4.20],['2024-10-31',4.85],['2025-02-06',5.53],
        ['2025-05-01',5.90],['2025-07-31',6.20],['2025-10-30',6.55],['2026-02-05',6.90],['2026-04-30',7.35],['2026-08-03',7.90]],
  ebitda: [['2022-10-27',50000],['2023-02-02',54000],['2023-04-27',62000],['2023-08-03',72000],['2023-10-26',79000],
           ['2024-02-01',85500],['2024-04-30',95000],['2024-08-01',104000],['2024-10-31',112000],['2025-02-06',121000],
           ['2025-05-01',131000],['2025-07-31',139000],['2025-10-30',147000],['2026-02-05',157000],['2026-04-30',168000],['2026-08-03',180000]],
};
// The last fiscal year fully reported, from each report date — the "Last FY" trailing basis.
var ACT_FY = [['2022-10-27',2021],['2023-02-02',2022],['2024-02-01',2023],['2025-02-06',2024],['2026-02-05',2025]];
var ACT_FY_V = {
  eps:    { 2021:3.24, 2022:0.20, 2023:2.90, 2024:5.53, 2025:6.90 },
  ebitda: { 2021:59000, 2022:54000, 2023:85500, 2024:121000, 2025:157000 },
};

// Step lookup: the entry in force on day `d`, or null when the series has not started yet.
function stepAt(list, d){
  var v=null;
  for(var i=0;i<list.length;i++){ if(dnum(list[i][0])<=d) v=list[i][1]; else break; }
  return v;
}

// ── Building the daily series ────────────────────────────────────────────────────
// A deterministic wiggle, not Math.random: the same page must draw the same line every time, and
// a chart that redraws differently on every toggle is unreadable and untestable.
function lcg(seed){ return function(){ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }; }
function mkPrice(){
  var out=[], rnd=lcg(20260819), noise=0;
  var a0=dnum(START), a1=dnum(TODAY);
  for(var d=a0; d<=a1; d++){
    var w=dDow(d); if(w===0||w===6) continue;                    // business days only
    // piecewise-linear between the monthly anchors
    var lo=PRICE_M[0], hi=PRICE_M[PRICE_M.length-1];
    for(var i=0;i<PRICE_M.length-1;i++){
      if(dnum(PRICE_M[i][0])<=d && d<dnum(PRICE_M[i+1][0])){ lo=PRICE_M[i]; hi=PRICE_M[i+1]; break; }
    }
    var t=(d-dnum(lo[0]))/Math.max(1,(dnum(hi[0])-dnum(lo[0])));
    var base=lo[1]+(hi[1]-lo[1])*Math.max(0,Math.min(1,t));
    noise = noise*0.86 + (rnd()-0.5)*0.028;                      // AR(1) — trends for a few days
    out.push({ d:d, px: base*(1+noise) });
  }
  return out;
}
var PX = mkPrice();

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
  if(!PX.length) return '';                                     // §0.2 rule 6

  var h='<style>'+
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
    '<b>⚑ Every figure in this tab is synthetic</b> — a plausible path invented to fix the layout while we agree on the idea; nothing here is a '+
    'price, an estimate or a multiple anyone published. To make it real: daily closes (Massive or IBKR), diluted shares and LTM actuals (both '+
    'already in the Results dataset), net debt (Massive), and the one genuinely missing piece — <b>consensus EPS and EBITDA per fiscal year with '+
    'their revision dates</b>. That last one is a vintage archive, the same shape as the <code>estMatrix</code> the Results pane already carries '+
    'for AMZN, so the path exists rather than needing a new feed.';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
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
  render(scope);
}

export var amznHistMult = { body: hmBody, init: initHm };
