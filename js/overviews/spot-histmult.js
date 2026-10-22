// overviews/spot-histmult.js — Spotify (SPOT) Deep Dive ▸ Valuation ▸ Historic Multiple (VA-HIST, playbook §14).
//
// COPIED from js/overviews/tsm-histmult.js (itself the AMZN module), then adapted — never reimplemented. The idea the chart is built on
// is unchanged: a multiple is two series on different clocks; forward denominators step and roll; NTM blends FY0 and FY1.
//
// What changed for SPOT:
//   · currency — Spotify reports in EUR and the share trades in US$ on the NYSE. Every line is computed in EUR: the daily US$ close
//               is divided by the ECB euro reference rate of the same day (US$ per euro, fetched live from the ECB data API, which
//               allows browser requests; a weekend or holiday carries the last rate). No rate is written in the file.
//   · price   — the NYSE daily close, live from Massive via get-market-history (the same undeployed path TSMC and Meta use).
//   · EPS     — diluted, EUR. Forward = Bloomberg's ANNUAL EPS per vintage (estMatrix.cons.y.eps). Trailing = the last fiscal year
//               less the same year-to-date a year earlier plus the year-to-date now, from the filings (./spot-histmult-data.js).
//   · EBITDA  — forward = estMatrix.cons.y.ebitda. Trailing = the four reported quarters: Results (Bloomberg basis) from 1Q24, the
//               filings before (operating income + D&A + share-based compensation; see the data file for the difference).
//   · shares  — weighted diluted shares per quarter from the statements, stepped at the filing.
//   · net debt — Exchangeable Notes less cash and short term investments, from Spotify's 6-K and 20-F balance sheets, stepped on the
//               day each was filed. Spotify has been net cash every quarter since 1Q21.
//   · EV/EBITDA is drawn only where EBITDA is positive; P/E only where EPS is positive. A line without its denominator is not drawn,
//     never a 0×. Spotify's 2022-2023 losses therefore leave those years empty on the trailing lines, and that is the honest picture.
//   · the error state is one ⚑ note per missing source, with the real reason: the price service, the exchange rate.

import { spotResults } from '../results-data/spot.js';
import { fetchPriceHistory } from '../api.js';
import { SUMMIT_CAT, SUMMIT_MUTE, SUMMIT_NEG, fade } from '../viz-palette.js';
import { SPOT_HM, SPOT_HM_FY } from './spot-histmult-data.js';

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
        // Read the drag off whichever value axis is on screen (EV/EBITDA alone has no P/E axis).
        var bAx = (chart.scales.y && chart.options.scales.y.display !== false) ? chart.scales.y : (chart.scales.y2 || chart.scales.y);
        var v1 = bAx.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = bAx.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
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
// The window opens with the first Bloomberg vintage on file — before it there is no forward denominator.
var START = SPOT_HM_FY[0][1], TODAY = todayStr();   // the first date a denominator exists: the FY2020 20-F

// Fiscal years are calendar years for Spotify (20-F: fiscal year ends December 31).
function fyEndDay(y){ return dnum(y+'-12-31'); }

// Step lookup: the entry in force on day `d`, or null when the series has not started yet.
function stepAt(list, d){
  var v=null;
  for(var i=0;i<list.length;i++){ if(dnum(list[i][0])<=d) v=list[i][1]; else break; }
  return v;
}

// ── Real data, built from js/results-data/spot.js, ./spot-histmult-data.js, get-market-history and the ECB rate ──
// PX/SHARES/NETDEBT/EST/ACT/ACT_FY/ACT_FY_V start empty and are filled once by hmLoad(); every
// reader below (denomAt, numerAt, buildSeries…) is unchanged from when they read synthetic arrays.
var PX = [];                              // [{d, px}] — daily, EUR
var FX = [];                              // step list [[dateStr, US$ per EUR]]
var SHARES = [], NETDEBT = [];            // step lists [[dateStr, value]]
var EST = { eps:{}, ebitda:{} };          // EST[metric][fiscalYear] = step list
var ACT = { eps:[], ebitda:[] };          // ACT[metric] = step list (LTM)
var ACT_FY = [];                          // step list [[dateStr, fiscalYear]]
var ACT_FY_V = { eps:{}, ebitda:{} };     // ACT_FY_V[metric][fiscalYear] = value
var hmData = { loading:false, loaded:false, error:null, fxError:null };

// EST[metric][fy] — cons.y.<metric> carries the fiscal-year row per vintage, for EPS and EBITDA alike;
// one point per vintage that has it.
function buildEstY(metric){
  var vs=spotResults.estMatrix.cons.vintages, y=spotResults.estMatrix.cons.y[metric]||{}, out={};
  vs.forEach(function(v){
    var row=y[v.id]; if(!row) return;
    Object.keys(row).forEach(function(fy){
      var val=row[fy]; if(val==null) return;
      (out[fy]||(out[fy]=[])).push([v.id, val]);
    });
  });
  return out;
}
// ACT.eps — the reported LTM diluted EPS (built from reported figures in the data file), stepped at each filing.
function buildActEps(){
  var out=[];
  SPOT_HM.forEach(function(r){ if(r[4]!=null) out.push([r[2], r[4]]); });
  return out;
}
// ACT.ebitda — the four reported quarters summed, stepped at each filing. Quarters from 1Q24 are Results' (Bloomberg basis);
// earlier ones come from the filings file.
function buildActEbitda(){
  var rq=spotResults.views.q.metrics.ebitda, fromResults={};
  rq.periods.forEach(function(p,i){ if(rq.act[i]!=null) fromResults[p]=rq.act[i]; });
  var q=SPOT_HM.map(function(r){ return fromResults[r[0]]!=null ? fromResults[r[0]] : r[3]; });
  var out=[];
  for(var i=3;i<SPOT_HM.length;i++){
    var v=[q[i-3],q[i-2],q[i-1],q[i]];
    if(v.some(function(x){ return x==null; })) continue;
    out.push([SPOT_HM[i][2], v[0]+v[1]+v[2]+v[3]]);
  }
  return out;
}
// ACT_FY — the last fiscal year fully reported, stepped at the day its 20-F was filed.
function buildActFy(){ return SPOT_HM_FY.map(function(r){ return [r[1], r[0]]; }); }
// ACT_FY_V — annual actuals: EPS from the 20-F; EBITDA from the filings, except the years Results carries on the Bloomberg basis.
function buildActFyV(metric){
  var out={};
  SPOT_HM_FY.forEach(function(r){ out[r[0]]=(metric==='eps')?r[2]:r[3]; });
  if(metric==='ebitda'){
    var m=spotResults.views.y.metrics.ebitda;
    if(m) m.periods.forEach(function(y,i){ if(m.act[i]!=null) out[y]=m.act[i]; });
  }
  return out;
}
// The daily price series, from get-market-history's `prices` rows ({t: ms epoch, c: US$ close}), turned into EUR with the ECB rate
// of the same day (carried over weekends and holidays). A day with no rate yet is dropped rather than guessed.
function buildPxEur(rows){
  return rows.map(function(r){ return { d: Math.floor(r.t/DAY), c: num(r.c) }; })
    .filter(function(p){ return p.c!=null; })
    .sort(function(a,b){ return a.d-b.d; })
    .map(function(p){ var fx=stepAt(FX, p.d); return (fx==null||fx<=0) ? null : { d:p.d, px:p.c/fx }; })
    .filter(function(p){ return p!=null; });
}
// SHARES — weighted diluted shares (millions) per quarter, stepped at the filing.
// NETDEBT — Exchangeable Notes less cash and short term investments (EUR M, negative = net cash), stepped at the filing.
function buildShares(){ return SPOT_HM.map(function(r){ return [r[2], r[5]]; }); }
function buildNetDebt(){ return SPOT_HM.map(function(r){ return [r[2], r[9]]; }); }

// The ECB euro reference rate, US dollar per euro, daily — the public data API, no key (it allows browser requests).
function fetchFx(from, to){
  var url='https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?format=csvdata&startPeriod='+from+'&endPeriod='+to;
  return fetch(url).then(function(r){
    if(!r.ok) throw new Error('the ECB data API answered '+r.status);
    return r.text();
  }).then(function(txt){
    var lines=txt.split(/\r?\n/), head=lines[0].split(','), it=head.indexOf('TIME_PERIOD'), iv=head.indexOf('OBS_VALUE'), out=[];
    if(it<0||iv<0) throw new Error('the ECB file came back without the expected columns');
    for(var i=1;i<lines.length;i++){ var c=lines[i].split(','); if(c.length<=Math.max(it,iv)) continue; var v=parseFloat(c[iv]); if(isFinite(v)) out.push([c[it], v]); }
    if(!out.length) throw new Error('the ECB file had no rates for the period');
    return out;
  });
}

// Fetch once (cached for the life of the page); every call after the first is a no-op that
// resolves immediately. Errors leave hmData.error / fxError set rather than throwing, so a pane whose
// source is not available yet shows one clear message per source instead of a broken chart (§0.2 rule 6).
function hmLoad(){
  if(hmData.loaded || hmData.loading) return Promise.resolve();
  hmData.loading=true;
  var pPrice=fetchPriceHistory('SPOT', START, TODAY)
    .catch(function(e){ return { success:false, error:{message:(e&&e.message)||'price fetch failed'} }; });
  var pFx=fetchFx(START, TODAY).then(function(rows){ return { rows:rows }; })
    .catch(function(e){ return { error:(e&&e.message)||'exchange-rate fetch failed' }; });
  return Promise.all([pPrice, pFx]).then(function(res){
    var priceRes=res[0], fxRes=res[1];
    var priceRows=(priceRes && priceRes.success && Array.isArray(priceRes.data)) ? priceRes.data : [];
    FX = fxRes.rows || [];
    PX = (FX.length) ? buildPxEur(priceRows) : [];
    SHARES = buildShares(); NETDEBT = buildNetDebt();
    EST.ebitda = buildEstY('ebitda');
    EST.eps = buildEstY('eps');
    ACT.eps = buildActEps();
    ACT.ebitda = buildActEbitda();
    ACT_FY = buildActFy();
    ACT_FY_V.ebitda = buildActFyV('ebitda');
    ACT_FY_V.eps = buildActFyV('eps');
    hmData.loading=false; hmData.loaded=true;
    hmData.error = priceRows.length ? null : ((priceRes && priceRes.error && priceRes.error.message) || 'the price service returned no rows for SPOT');
    hmData.fxError = fxRes.error || null;
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
  var sh=stepAt(SHARES, d), nd=stepAt(NETDEBT, d);
  if(sh==null || nd==null) return null;                           // a gap, never px × null + null = a fabricated 0×
  return (px * sh) + nd;                                          // $M: EV
}

// The two metrics, and how each one's denominator is written down. `metric` is the key into EST /
// ACT; `denomFmt` is what the tooltip and the table print, because a multiple with an unlabelled
// denominator is a number nobody can check.
var METRICS = {
  pe:       { label:'P/E',        metric:'eps',    denomName:'EPS',
              denomFmt:function(v){ return '€'+v.toFixed(2); } },
  evebitda: { label:'EV/EBITDA',  metric:'ebitda', denomName:'EBITDA',
              denomFmt:function(v){ return '€'+(Math.abs(v)>=1000 ? (v/1000).toFixed(1)+'B' : Math.round(v)+'M'); } },
};

// One point per business day: the multiple, plus the two halves it came from, so every tooltip and
// every table cell can show its own arithmetic instead of asking the reader to trust the ratio.
function buildSeries(mk, hz){
  var m=METRICS[mk], out=[];
  PX.forEach(function(p){
    var den=denomAt(m.metric, hz, p.d);
    var num=numerAt(m.metric, p.d, p.px);
    out.push({ d:p.d, px:p.px, num:num, den:den, v:(num==null || den==null || den<=0)?null:(num/den) });
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
// Two identities (P/E, EV/EBITDA) → the portal's fixed categorical slots 0 and 1, never a hand-picked
// hue. Trailing is the SAME hue faded, not a different colour — confidence is alpha, identity is hue
// (viz-palette.js's own rule). Was '#146EB4'/'#7FB3E0'/'#E08700'/'#F5C57A' — the EV/EBITDA pair in
// particular was Amazon's old smile-orange family, exactly what Stage 2 removed everywhere else.
var C_PE_F=SUMMIT_CAT[0], C_PE_T=fade(SUMMIT_CAT[0],0.45), C_EV_F=SUMMIT_CAT[1], C_EV_T=fade(SUMMIT_CAT[1],0.45);
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
function fmtPxv(v){ return '€'+(v>=100?Math.round(v).toLocaleString('en-US'):v.toFixed(2)); }
function signPct(p){ return p==null?'—':((p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'); }

// ── Body ─────────────────────────────────────────────────────────────────────────
function hmBody(){
  var h='';   // styles: css/overview.css (.ov-spot-dd .hm-*)
  h+='<div class="rs-block hm-blk" id="hmBlock">';
  // Row 1 is identity. There is no metric select: the four chips ARE the picker, and a dropdown
  // repeating them would be a second control for the same choice.
  h+='<div class="rs-block-top"><div class="rs-block-h">Historic Multiple</div>'+
     '<span class="rs-quick-l hm-hint">P/E and EV/EBITDA, forward and trailing — click a chip to drop one</span></div>';
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
  h+=chip('avg','Average over the range',SUMMIT_MUTE,true,!one,
      one?'The dashed mean of the one visible line':'Show a single line to get its average');
  // Rolls only exist on a basis that rolls. NTM slides and the trailing bases step at prints.
  var rollable = (st.hzF!=='ntm') && (vis('pe_f')||vis('ev_f'));
  if(rollable) h+=chip('roll','Fiscal-year rolls',SUMMIT_NEG,true,false,
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
    ctx.save(); ctx.strokeStyle=fade(SUMMIT_NEG,0.35); ctx.lineWidth=1;
    idx.forEach(function(p){
      var x=xs.getPixelForValue(p.i); if(x<ar.left||x>ar.right) return;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(x, ar.top); ctx.lineTo(x, ar.bottom); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle=fade(SUMMIT_NEG,0.75); ctx.font='700 9px Inter, sans-serif';
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
    if(s.axis!==axisId || !data[s.k]) return;   // a line toggled on after this render has no points yet
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
    if(s.axis!==axisId || !data[s.k]) return;   // a line toggled on after this render has no points yet
    var hi=data[s.k].sm && data[s.k].sm.max;
    if(hi!=null && hi>c) over.push(s);
  });
  return over.length ? { at:c, series:over } : null;
}

function buildChart(scope, data){
  var cv=scope.querySelector('#hmChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(st.chart){ try{ st.chart.destroy(); }catch(e){} st.chart=null; }
  // only the lines this render computed: a chip clicked between render() and this frame must not crash the draw
  var vs=visSeries().filter(function(s){ return data[s.k]; });
  if(!vs.length) return;                          // every chip off — nothing to draw, nothing broken

  var ref=data[vs[0].k].pts;
  var labels=ref.map(function(p){ return st.gran==='daily' ? dShort(p.d) : p.key; });
  var ds=[], badges=[];

  // the mean, only when exactly one line is on screen
  var solo = vs.length===1 ? vs[0] : null;
  var soloSm = solo ? data[solo.k].sm : null;
  if(solo && soloSm && vis('avg'))
    ds.push({ label:'Average', yAxisID:solo.axis, data:ref.map(function(){ return soloSm.avg; }),
      borderColor:SUMMIT_MUTE, borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false, tension:0 });

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
              // P/E: price ÷ EPS. EV/EBITDA: EV (price × shares + net debt) ÷ EBITDA — never "price ÷ EBITDA".
              var numTxt = s.metric==='eps' ? fmtPxv(p.px) : (p.num!=null ? 'EV $'+(p.num/1000).toFixed(0)+'B' : 'EV');
              return labelOf(s)+': '+fmtX(p.v)+'  ·  '+numTxt+
                '  ÷  '+METRICS[s.metric].denomName+' '+METRICS[s.metric].denomFmt(p.den);
            } } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:SUMMIT_MUTE, font:{ size:10 }, maxRotation:0, autoSkip:false,
            callback:function(v,i){ return i%everyN===0 ? labels[i] : ''; } } },
        y:  axisOpts('y',  anyOnAxis('y'),  C_PE_F, anyOnAxis('y')),
        y2: axisOpts('y2', anyOnAxis('y2'), C_EV_F, !anyOnAxis('y')) } },   // the zoom lands on the axis it was read from
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
  var n0=SPOT_HM[0], n1=SPOT_HM[SPOT_HM.length-1], vs=spotResults.estMatrix.cons.vintages;
  return '<b>How the lines are built.</b> Each is a price divided by a number that stood on that day, all in <b>euros</b>: '+
    '<b>P/E</b> = share price ÷ diluted EPS, <b>EV/EBITDA</b> = (share price × diluted shares + net debt) ÷ EBITDA, on every business day. '+
    '<b>Forward</b> takes the estimate for the period you pick, <b>trailing</b> takes what Spotify had already reported. '+
    'The denominator is a <b>step series</b>: it changes only when the Street revises, or when the period it is FOR rolls forward — '+
    'the vertical drops in a forward-multiple chart are that roll, not a re-rating. '+
    '<b>NTM</b> blends FY0 × (days left in FY0 ÷ 365) + FY1 × the rest, so it slides instead of stepping. '+
    'The two metrics keep separate axes, both on the right and tinted their line\'s colour. Quarterly and annual points are the <b>average</b> over the period. '+
    'A multiple is not drawn where its denominator is zero or negative: Spotify lost money in 2022 and 2023, so the trailing lines start when it turned profitable. '+
    '<b>Sources.</b> Price: Massive daily close of the NYSE share in US$ (live), converted to euros with the ECB euro reference rate of the same day (live, data-api.ecb.europa.eu). '+
    'Consensus EPS and EBITDA: Bloomberg consensus export, one vintage per print ('+esc(vs[0].id)+' to '+esc(vs[vs.length-1].id)+'), annual rows as Bloomberg carries them. '+
    'Reported EPS, EBITDA, shares and net debt: Spotify 6-K interim statements and 20-F, SEC EDGAR ('+esc(n0[0])+'–'+esc(n1[0])+'); '+
    'net debt = Exchangeable Notes less cash and short term investments (EUR '+(-n1[9]/1000).toFixed(1)+'B net cash at '+esc(n1[0])+'), so EV is below market cap; lease liabilities and long term investments are left out. '+
    'EBITDA is the Bloomberg basis in Results from 1Q24 and operating income + D&A + share-based compensation from the filings before. All figures IFRS as reported.';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
  if(!hmData.loaded || hmData.error || hmData.fxError){    // still fetching, or a source failed / came back empty
    var md0=scope.querySelector('#hmModes'); if(md0) md0.innerHTML='';
    var lg0=scope.querySelector('#hmLeg'); if(lg0) lg0.innerHTML='';
    var cw=scope.querySelector('.hm-chartwrap');
    if(cw){
      var notes='';
      if(hmData.error) notes+='<div class="rs-noguide">⚑ Live data pending — daily price unavailable</div>'+
        '<div class="hm-notice">This chart reads Spotify\'s daily close live from Massive (get-market-history). The request failed: '+esc(hmData.error)+'. Nothing is estimated or frozen in the meantime.</div>';
      if(hmData.fxError) notes+='<div class="rs-noguide">⚑ Live data pending — EUR/US$ rate unavailable</div>'+
        '<div class="hm-notice">The price is in US$ and Spotify reports in euros, so the chart needs the ECB euro reference rate for every day. The request failed: '+esc(hmData.fxError)+'.</div>';
      cw.innerHTML = notes || '<div class="hm-notice">Loading price history…</div>';
    }
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

export var spotHistMult = { body: hmBody, init: initHm };
