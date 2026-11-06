// overviews/lyft-sensitivity.js — Lyft (LYFT) Deep Dive ▸ Valuation ▸ Sensitivity Analysis (VA-SENS, playbook §14).
//
// COPIED from js/overviews/uber-sensitivity.js (amzn-sensitivity.js lineage), then adapted — never reimplemented.
//
// What changed for LYFT:
//   • BASE = the Summit DCF model, ONE snapshot FROZEN in ./lyft-sensitivity-data.js (2026-08-07, the latest valid submit; rule 10) —
//     the same one as the Results dataset and the last Target Multiple row.
//   • Lyft reports ONE operating segment, so the growth driver is total revenue growth (the SN pattern), and the margin driver is the
//     Adjusted EBITDA margin on revenue: the model's OP_INCOME is 0 in every projected year of this submit (doubt 2), so there is no
//     operating margin to move. The model records only an EV/EBITDA valuation for Lyft, so the grid is on EV/EBITDA alone (no P/E basis).
//   • BASE YEAR 2025 = reported revenue (js/results-data/lyft.js act: 6,316.3).
//   • STREET = Bloomberg consensus through js/results-data/lyft.js annual `cons` (revenue and Adjusted EBITDA to FY2028).
//   • EXIT MULTIPLE starts at the model's own target multiple (./lyft-target-multiple-data.js), never at a hand-picked number; yours to move.
//   • NET DEBT = Lyft's latest balance sheet (./lyft-histmult-data.js: the 3Q26 release), its source named (A23); the quote supplies the price only.
//   • The older scenario calculator (valuation.js via LYFT_VAL in lyft.js — gross bookings × take rate × EBITDA margin) stays in the
//     pane below this one's place in the file, untouched (golden rule 1).

import { SUMMIT_CAT, SUMMIT_POS, SUMMIT_NEG } from '../viz-palette.js';
import { lyftResults } from '../results-data/lyft.js';
import { LYFT_SENS } from './lyft-sensitivity-data.js';
import { LYFT_TM } from './lyft-target-multiple-data.js';
import { LYFT_HM_Q } from './lyft-histmult-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = LYFT_SENS.snapshot;            // the Summit snapshot every figure comes from
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028, 2029];

// ── Data layer: the frozen Summit snapshot + the reported 2025 base, never re-typed here ─────────────
var MX = (lyftResults && lyftResults.views && lyftResults.views.y) ? lyftResults.views.y.metrics : {};
function yAct(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.act)?null:m.act[i]; }
function yCons(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.cons)?null:m.cons[i]; }
var SEGS = [
  { k:'lyft', rk:'rev', n:'Revenue', c:SUMMIT_CAT[0] },   // Lyft's one operating segment (10-K Note 2): total revenue
];
// rev = total revenue · eb = the model's EBITDA row (Adjusted EBITDA) · earn = GAAP net income (record only) ·
// sh = diluted shares (M). $M throughout.
var M = {};
M[BASE_YEAR] = {};
SEGS.forEach(function(sg){ M[BASE_YEAR][sg.k]={ rev:yAct(sg.rk, BASE_YEAR) }; });
M[BASE_YEAR].rev = SEGS.reduce(function(t,sg){ return t+(M[BASE_YEAR][sg.k].rev||0); }, 0);
YEARS.forEach(function(y){ var r=LYFT_SENS.y[y]; if(!r) return;
  M[y] = { rev:r.rev, eb:r.eb, earn:r.earn, sh:r.sh };
  SEGS.forEach(function(sg){ M[y][sg.k]={ rev:r.line[sg.k] }; });
});
var _ndRow = LYFT_HM_Q[LYFT_HM_Q.length-1];
var NET_DEBT_SEED = _ndRow[6];            // $M, negative = net cash — Lyft balance sheet (long-term debt − cash and short-term investments; restricted cash and investments left out)
var ND_SRC = _ndRow[0]+' balance sheet, 3Q26 release of '+_ndRow[2];

// Every series the calc needs, for every year — if one is missing the pane says so instead of NaN.
function dataOk(){
  var ok=true;
  SEGS.forEach(function(sg){ if(M[BASE_YEAR][sg.k].rev==null) ok=false; });
  YEARS.forEach(function(y){
    if(!M[y]){ ok=false; return; }
    SEGS.forEach(function(sg){ if(M[y][sg.k].rev==null) ok=false; });
    if(M[y].eb==null || M[y].rev==null || !M[y].sh) ok=false;
  });
  return ok;
}

// Axis drivers. `step` is the default grid increment; the user can override start and step.
var DRIVERS = [
  { k:'lyft_g', seg:'lyft', kind:'g', n:'Revenue growth', step:0.02 },
  { k:'eb_m',   seg:null,   kind:'m', n:'Adjusted EBITDA margin (% of revenue)', step:0.01 },
  { k:'mult',   seg:null,   kind:'x', n:'Exit multiple (EV/EBITDA)', step:1 },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── The comparison slot — Street (Bloomberg consensus), read through ─────────────────────────────────
// Growth = CAGR off the 2025 reported revenue of the line to Bloomberg's estimate for that year; operating margin
// = Bloomberg operating income ÷ revenue. A year Bloomberg does not cover stays empty and falls back visibly.
function streetCagr(rk, year){ var a=yAct(rk, BASE_YEAR), c=yCons(rk, year); return (a&&c)?(Math.pow(c/a, 1/(year-BASE_YEAR))-1):null; }
function streetMargin(year){ var o=yCons('ebitda', year), r=yCons('rev', year); return (o!=null&&r)?o/r:null; }
var _cv = lyftResults.estMatrix && lyftResults.estMatrix.cons && lyftResults.estMatrix.cons.vintages;
var CONS = { src:'Bloomberg consensus', asOf:(_cv&&_cv.length)?_cv[_cv.length-1].id:null, v:{ eb_m:{}, mult:{} } };
SEGS.forEach(function(sg){ CONS.v[sg.k+'_g']={}; });
YEARS.forEach(function(y){
  SEGS.forEach(function(sg){ var g=streetCagr(sg.rk, y); if(g!=null) CONS.v[sg.k+'_g'][y]=g; });
  var m=streetMargin(y); if(m!=null) CONS.v.eb_m[y]=m;
});
function consValue(k, year){ var row=CONS.v[k]; var v=row?row[year]:null; return v==null?null:v; }

function consSrcLabel(){ return CONS.src + (CONS.asOf?(' · as of '+CONS.asOf):''); }
function baseName(b){ return (b||_base)==='cons' ? 'Street (Bloomberg consensus)' : 'the Summit model'; }
function baseNameCap(b){ return (b||_base)==='cons' ? 'Street' : 'Summit model'; }
function altBase(){ return _base==='summit' ? 'cons' : 'summit'; }

// ── Whose number is this? ────────────────────────────────────────────────────────
// One function decides it for every driver. On Street, a driver Bloomberg does not cover falls back to the
// model; consFellBack() is what makes that fallback visible instead of silent.
function baseValue(k, year){
  if(_base==='cons'){ var c=consValue(k,year); if(c!=null) return c; }
  return modelValue(k, year);
}
function consFellBack(k, year){ return _base==='cons' && consValue(k,year)==null; }
// Category defaults under the current base. Growth is applied the same way an axis applies it —
// a flat rate compounded off the 2025 actual.
function baseRev(seg, year){
  var g = (_base==='cons') ? consValue(seg+'_g', year) : null;
  if(g==null) return M[year][seg].rev;
  var rev = M[BASE_YEAR][seg].rev;
  for(var y=BASE_YEAR+1; y<=year; y++) rev *= (1+g);
  return rev;
}
function baseMargin(year){
  var m = (_base==='cons') ? consValue('eb_m', year) : null;
  return m==null ? modelEbMargin(year) : m;
}

// The OTHER side, for the card beside the grid.
function altValue(k, year){ return _base==='summit' ? consValue(k, year) : modelValue(k, year); }
// The same calc as any grid cell, with the other side substituted for the two drivers on the axes
// and everything else left at the current base — so the number is directly comparable to a cell.
function altCalc(year){
  var over={}, any=false;
  var ax=altValue(_x,year), ay=altValue(_y,year);
  if(drv(_x).kind!=='x' && ax!=null){ over[_x]=ax; any=true; }
  if(drv(_y).kind!=='x' && ay!=null){ over[_y]=ay; any=true; }
  return any ? calc(year, over) : null;
}

// ── State ────────────────────────────────────────────────────────────────────────
var _year  = (function(){ var s=LYFT_TM.snaps[LYFT_TM.snaps.length-1]; return s.val.ev?s.val.ev.year:2027; })();   // the model's target year
var _base  = 'summit';    // 'summit' = the Summit model (populated) · 'cons' = Street (Bloomberg)
var _x     = 'lyft_g';
var _y     = 'eb_m';
var _basis = 'ev';        // EV/EBITDA only: the model records no P/E valuation for Lyft
var _mEv   = null;        // exit EV/EBITDA — starts at the model's target multiple (startAtMarket below)
var _mPe   = null;        // exit P/E — likewise
var _mTouched = false;    // once the user moves the multiple, a later quote no longer resets it
var _netDebt = NET_DEBT_SEED;   // $M, Lyft's latest balance sheet; the live quote does not override it (A23)
var _rx = { start:null, step:null };   // null = auto from the base
var _ry = { start:null, step:null };
var _px = null;           // live share price

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
// The exit multiple starts at the MODEL's own target multiples (Target Multiple, latest submit) — never today's market
// multiple, never a guess. The name is kept from the copy so every caller stays unchanged.
var _tmLast = LYFT_TM.snaps[LYFT_TM.snaps.length-1].val;
function startAtMarket(){
  if(_tmLast.ev) _mEv=_tmLast.ev.mult;
  if(_tmLast.pe) _mPe=_tmLast.pe.mult;
}
startAtMarket();
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }


function sharesFor(year){ return M[year].sh; }   // the model's diluted shares for that year

function heldFlags(year){ return false; }

function modelEbMargin(year){ return M[year].eb / M[year].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}


// The model's own value for a driver — the axis default centres on this.
function modelValue(k, year){
  var d = drv(k);
  if(d.kind==='x') return activeMult();
  return d.kind==='g' ? modelCagr(d.seg, year) : modelEbMargin(year);
}
// Axis geometry: start + step, defaulting to "the BASE's value sits in the middle".
function axis(k, st, year){
  var d = drv(k);
  var step  = (st.step!=null)  ? st.step  : d.step;
  var start = (st.start!=null) ? st.start : (baseValue(k, year) - Math.floor(NCELL/2)*step);
  var vals = []; for(var i=0;i<NCELL;i++) vals.push(start + i*step);
  return { start:start, step:step, vals:vals, auto:(st.start==null && st.step==null) };
}

// ── The calculation ──────────────────────────────────────────────────────────────
function calc(year, over){
  over = over || {};
  var parts=[], revTotal=0;
  SEGS.forEach(function(s){
    var gK=s.k+'_g', rev;
    if(over[gK]!=null){                                   // flat rate compounded 2026 → year
      rev = M[BASE_YEAR][s.k].rev;
      for(var y=BASE_YEAR+1; y<=year; y++) rev *= (1 + over[gK]);
    } else rev = baseRev(s.k, year);                      // off the axes: whichever base is selected
    revTotal += rev;
    parts.push({ k:s.k, n:s.n, c:s.c, rev:rev });
  });
  // One consolidated Adjusted EBITDA margin on revenue (the model's operating income is not usable, doubt 2).
  var em = over.eb_m!=null ? over.eb_m : baseMargin(year);
  var ebitda = revTotal * em;
  var shares = sharesFor(year);
  var mult = over.mult!=null ? over.mult : activeMult();
  var ev = ebitda*mult, equity = ev - _netDebt, px = equity/shares;
  return { parts:parts, rev:revTotal, em:em, ebitda:ebitda, mult:mult, ev:ev, equity:equity, px:px, shares:shares };
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){
  if(Math.abs(v)<0.5) v=0;                       // no "−$0M" from a rounding residue
  var s=v<0?'−':'', a=Math.abs(v);
  if(a<1000) return s+'$'+Math.round(a).toLocaleString('en-US')+'M';
  var b=a/1000;
  return s+(b>=1000 ? ('$'+(b/1000).toFixed(2)+'T') : ('$'+(b<100?b.toFixed(2):Math.round(b))+'B'));
}
function fmtPx(v){ return '$'+v.toFixed(2); }   // a ~$20 stock: cents matter
function pctLbl(v){ var s=v*100; return (Math.abs(s-Math.round(s))<0.05 ? Math.round(s) : s.toFixed(1))+'%'; }
function axisLbl(k,v){ return drv(k).kind==='x' ? (v.toFixed(1)+'×') : pctLbl(v); }
function signPct(p){ return (p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'; }
function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
function colorFor(up, cap){
  if(cap<=0) return '#ffffff';
  var t = Math.max(-1, Math.min(1, up/cap));
  if(t>=0) return 'rgb('+lerp(255,168,t)+','+lerp(255,205,t)+','+lerp(255,160,t)+')';
  t=-t;    return 'rgb('+lerp(255,240,t)+','+lerp(255,176,t)+','+lerp(255,168,t)+')';
}
// Inputs show percentages as points, multiples as-is.
function toInp(k,v){ return drv(k).kind==='x' ? v : +(v*100).toFixed(3); }
function fromInp(k,v){ return drv(k).kind==='x' ? v : v/100; }

// ── Body ─────────────────────────────────────────────────────────────────────────
function selHtml(id, cur){
  return '<select class="sens-sel" id="'+id+'">'+DRIVERS.map(function(d){
    return '<option value="'+d.k+'"'+(d.k===cur?' selected':'')+'>'+esc(d.n)+'</option>';
  }).join('')+'</select>';
}
function sensBody(){
  if(!dataOk()){
    return '<div class="rs-noguide">Sensitivity analysis is unavailable: a series it needs (revenue, '+
      'Adjusted EBITDA or shares) is missing from the frozen Summit snapshot in js/overviews/lyft-sensitivity-data.js. '+
      'Nothing is estimated in its place.</div>';
  }
  var h = '';
  // styles: css/overview.css (:is(…, .ov-lyft-dd, …) — the pane-scoped .sens-ctrl fixes and the .as-* card)
  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Valuation year</span><div class="sens-years">'+
         YEARS.map(function(y){ return '<button type="button" class="sens-year'+(y===_year?' active':'')+'" data-asyear="'+y+'">'+y+'</button>'; }).join('')+
       '</div></div>'+
       // Whose assumptions the grid is built on. Everything OFF the two axes is held here, so this
       // is the control that changes what the whole matrix means — hence its place on the top row.
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Assumptions</span><div class="sens-years">'+
         '<button type="button" class="sens-year'+(_base==='summit'?' active':'')+'" data-asbase="summit"'+
           ' title="Every driver off the axes held at the Summit model (snapshot '+esc(SNAP)+')">Summit model</button>'+
         '<button type="button" class="sens-year'+(_base==='cons'?' active':'')+'" data-asbase="cons"'+
           ' title="Every driver off the axes held at Bloomberg consensus where it has a figure; the rest stay at the model">'+
           'Street (Bloomberg consensus)</button>'+
       '</div></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="asMultL">'+multLabel()+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asMult" type="number" step="0.5" value="'+(activeMult()==null?'':activeMult())+'"><span class="sens-inp-u">×</span></span></div>'+
       '</div>';

  h += '<div class="sens-controls-row sens-row-inp">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">X axis →</span>'+selHtml('asX', _x)+'</div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">starts at</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asXs" type="number" step="0.5"><span class="sens-inp-u" id="asXsU">%</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">step</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asXd" type="number" step="0.25"><span class="sens-inp-u" id="asXdU">pp</span></span></div>'+
       '<button type="button" class="sens-year as-reset" id="asXr" title="Back to the base-centred range">reset</button>'+
       '</div>';
  h += '<div class="sens-controls-row sens-row-inp">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Y axis ↓</span>'+selHtml('asY', _y)+'</div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">starts at</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYs" type="number" step="0.5"><span class="sens-inp-u" id="asYsU">%</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">step</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYd" type="number" step="0.25"><span class="sens-inp-u" id="asYdU">pp</span></span></div>'+
       '<button type="button" class="sens-year as-reset" id="asYr" title="Back to the base-centred range">reset</button>'+
       '</div>';

  h += '<div class="sens-assum" id="asAssum"></div>';
  h += '<div class="as-mxrow">'+
         '<div class="sens-matrix-wrap" id="asMatrix"></div>'+
         '<div class="as-cons" id="asCons"></div>'+
       '</div>';
  h += '<div class="sens-legend"><span>Lower</span><div class="sens-legend-bar"></div><span>Higher</span>'+
       '<span class="sens-legend-n" id="asLegendN"></span></div>';

  h += '<div class="ov-sec as-years-sec"><div class="ov-sec-h">The same base case across years</div>'+
       '<div id="asYears"></div>'+
       '<div class="ov-fynote">The Summit model untouched, valued at the multiple above. It climbs across years purely because the model compounds — '+
       'nothing here is discounted back, so read the later years as "what the model implies you would be paying for", not as a target price.</div></div>';

  h += '<div class="ov-foot" id="asFoot"></div>';
  return h;
}

// ── Render ───────────────────────────────────────────────────────────────────────
function syncAxisInputs(scope){
  [['x',_x,_rx,'asXs','asXd','asXsU','asXdU'],['y',_y,_ry,'asYs','asYd','asYsU','asYdU']].forEach(function(a){
    var k=a[1], st=a[2], ax=axis(k, st, _year), d=drv(k);
    var si=scope.querySelector('#'+a[3]), di=scope.querySelector('#'+a[4]);
    if(si && document.activeElement!==si) si.value = toInp(k, ax.start);
    if(di && document.activeElement!==di) di.value = toInp(k, ax.step);
    var su=scope.querySelector('#'+a[5]), du=scope.querySelector('#'+a[6]);
    if(su) su.textContent = d.kind==='x' ? '×' : '%';
    if(du) du.textContent = d.kind==='x' ? '×' : 'pp';
  });
}

function renderAssum(scope){
  var year=_year;
  var live = (drv(_x).seg==='lyft') || (drv(_y).seg==='lyft');
  var fb = consFellBack('lyft_g', year);
  var mLive = drv(_x).kind==='m' || drv(_y).kind==='m';
  var mFb = consFellBack('eb_m', year);
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')</span>'+
    '<span class="sens-assum-i'+(live?' sens-assum-hi':'')+'">Revenue growth <b>'+pctLbl(baseValue('lyft_g',year))+'</b>'+
      (live?' <i>(on an axis)</i>':'')+(fb?' <i>(no Street figure — held at the model)</i>':'')+'</span>'+
    '<span class="sens-assum-i'+(mLive?' sens-assum-hi':'')+'">Adjusted EBITDA margin (% of revenue) <b>'+pctLbl(baseValue('eb_m',year))+'</b>'+
      (mLive?' <i>(on an axis)</i>':'')+(mFb?' <i>(no Street figure — held at the model)</i>':'')+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+sharesFor(year).toFixed(1)+'M</b> <i>(diluted, model; Lyft had 379.2M outstanding at Sep 30, 2026)</i></span>'+
    '<span class="sens-assum-i">Net debt <b>'+fmtB(_netDebt)+'</b> <i>('+(_netDebt<0?'net cash — ':'')+esc(ND_SRC)+')</i></span>';
}

// ── The other side, at the right of the grid ─────────────────────────────────────
// Always shows whichever base you are NOT reading: Street while the grid is on the Summit model, the model
// while it is on Street. A driver the other side has no figure for says so rather than inventing a comparison.
function consRowHtml(role, k, year){
  var d=drv(k), av=altValue(k,year), bv=baseValue(k,year);
  var h='<div class="as-cons-r"><div class="as-cons-k">'+esc(role)+' &nbsp;'+esc(d.n)+'</div>';
  if(d.kind==='x' || av==null){
    // stated, not blank
    return h+'<div class="as-cons-nil">'+(d.kind==='x'
      ? 'The exit multiple starts at the model’s own target multiple (Target Multiple, latest submit) and is yours to move; Bloomberg publishes none.'
      : 'No Bloomberg figure for this driver in '+year+' — the grid holds it at the model.')+'</div></div>';
  }
  var gap=av-bv;
  var gapTxt = d.kind==='x' ? ((gap>=0?'+':'−')+Math.abs(gap).toFixed(1)+'×')
                            : ((gap>=0?'+':'−')+Math.abs(gap*100).toFixed(1)+' pp');
  var col = Math.abs(gap) < (d.kind==='x'?0.05:0.0005) ? 'var(--mu)' : (gap>=0?SUMMIT_POS:SUMMIT_NEG);
  return h+
    '<div class="as-cons-v">'+axisLbl(k,av)+'<small>'+esc(baseNameCap())+' '+axisLbl(k,bv)+'</small></div>'+
    '<div class="as-cons-d" style="color:'+col+'">'+gapTxt+' vs '+esc(baseName())+'</div></div>';
}
function renderCons(scope, aX, aY, cell){
  var el=scope.querySelector('#asCons'); if(!el) return;
  var year=_year, r=altCalc(year), live=_px;
  var isCons=(altBase()==='cons');
  var h='<div class="as-cons-h">What '+(isCons?'Street (Bloomberg consensus)':'the Summit model')+' assumes</div>'+
    '<div class="as-cons-src">'+esc(isCons?consSrcLabel():('Summit DCF model · snapshot '+SNAP))+' · '+year+
    ' · the two drivers on the axes</div>';
  h += consRowHtml('X →', _x, year);
  h += consRowHtml('Y ↓', _y, year);

  if(r){
    var up = live ? (r.px/live-1) : null;
    var hasX = drv(_x).kind!=='x' && altValue(_x,year)!=null;
    var hasY = drv(_y).kind!=='x' && altValue(_y,year)!=null;
    var lbl  = (hasX&&hasY) ? 'Implied at both' : ('Implied at the '+(hasX?'X':'Y')+' figure alone');
    var where = (hasX&&hasY)
      ? (cell ? 'Ringed on the grid.' : 'Off the current grid — widen a range to see it.')
      : ('The '+(hasX?esc(drv(_y).n):esc(drv(_x).n))+' axis keeps your own input, so this cannot be '+
         'placed on the grid.');
    h += '<div class="as-cons-px"><div class="as-cons-k">'+lbl+'</div>'+
      '<div class="v">'+fmtPx(r.px)+'</div>'+
      '<div class="s">'+(up!=null ? (signPct(up)+' vs the live quote') : 'live quote unavailable')+
      ' · EBITDA '+fmtB(r.ebitda)+' × '+r.mult.toFixed(1)+'×'+
      '<br>'+where+
      '</div></div>';
  }
  el.innerHTML=h;
}

function renderMatrix(scope){
  var year=_year, dX=drv(_x), dY=drv(_y);
  var aX=axis(_x,_rx,year), aY=axis(_y,_ry,year);
  var base=calc(year,{}), live=_px, ref=live||base.px, refIsLive=!!live;

  var rowsY = aY.vals.slice().reverse();      // highest at the top

  // Where the OTHER side lands on this grid. Nearest cell, but only when it is genuinely inside
  // the range. Null means "off the grid", which the card says out loud.
  function nearest(vals, v, step){
    if(v==null) return -1;
    var lo=Math.min.apply(null,vals), hi=Math.max.apply(null,vals);
    if(v < lo-step/2 || v > hi+step/2) return -1;
    var bi=0, bd=Infinity;
    vals.forEach(function(x,i){ var d=Math.abs(x-v); if(d<bd){ bd=d; bi=i; } });
    return bi;
  }
  var cxi = drv(_x).kind==='x' ? -1 : nearest(aX.vals, altValue(_x,year), aX.step);
  var cyi = drv(_y).kind==='x' ? -1 : nearest(rowsY,   altValue(_y,year), aY.step);
  var consCell = (cxi>=0 && cyi>=0) ? { x:cxi, y:cyi } : null;
  var grid = rowsY.map(function(vy){
    return aX.vals.map(function(vx){
      var over={}; over[_x]=vx; over[_y]=vy;
      var r=calc(year, over);
      return { r:r, vx:vx, vy:vy, up:r.px/ref-1 };
    });
  });
  var cap=0.0001;
  grid.forEach(function(row){ row.forEach(function(c){ cap=Math.max(cap, Math.abs(c.up)); }); });

  var h='<table class="sens-mx"><thead>'+
    '<tr><th class="sens-corner" rowspan="2">Implied price<br><small>'+esc(dY.n)+'&nbsp;↓ × '+esc(dX.n)+'&nbsp;→</small></th>'+
      '<th class="sens-colcap" colspan="'+NCELL+'">'+esc(dX.n)+'</th></tr>'+
    '<tr>'+aX.vals.map(function(v){ return '<th>'+axisLbl(_x,v)+'</th>'; }).join('')+'</tr>'+
  '</thead><tbody>';
  grid.forEach(function(row, ri){
    h += '<tr><th class="sens-rowh">'+axisLbl(_y, rowsY[ri])+'</th>';
    row.forEach(function(c, ci){
      var isCons = !!(consCell && consCell.x===ci && consCell.y===ri);
      var ttl = year+' · '+dX.n+' '+axisLbl(_x,c.vx)+' · '+dY.n+' '+axisLbl(_y,c.vy)+' → '+
        ('EBITDA '+fmtB(c.r.ebitda)+' × '+c.r.mult.toFixed(1)+'× = EV '+fmtB(c.r.ev)+' → equity '+fmtB(c.r.equity))+
        ' → '+fmtPx(c.r.px)+'/sh ('+signPct(c.up)+(refIsLive?' vs live price)':' vs base case)')+
        (isCons ? ('  ·  closest cell to '+baseName(altBase())) : '');
      h += '<td class="sens-cell'+(isCons?' as-cons-cell':'')+'" style="background:'+colorFor(c.up,cap)+'" title="'+esc(ttl)+'">'+
           '<div class="sens-eb">'+fmtPx(c.r.px)+'</div>'+
           '<div class="sens-pct">'+signPct(c.up)+'</div></td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  scope.querySelector('#asMatrix').innerHTML = h;
  renderCons(scope, aX, aY, consCell);

  var lg = scope.querySelector('#asLegendN');
  if(lg) lg.textContent = refIsLive ? '(implied price vs. the live quote)'
                                    : '(implied price vs. the base case — live quote unavailable)';

  var ys = YEARS.map(function(y){
    var r=calc(y,{}), up = live ? (r.px/live-1) : null;
    return '<div class="sens-card"><div class="sens-card-l">'+y+(heldFlags(y)?' ⚠':'')+'</div>'+
           '<div class="sens-card-v">'+fmtPx(r.px)+'</div>'+
           '<div class="sens-card-s">'+('EBITDA '+fmtB(r.ebitda))+
           (up!=null?(' · '+signPct(up)):'')+'</div></div>';
  }).join('');
  scope.querySelector('#asYears').innerHTML = '<div class="sens-regions">'+ys+'</div>';

  scope.querySelector('#asFoot').innerHTML =
    'Every base figure is the <b>Summit DCF model</b> for Lyft (DCF LYFT.xlsm), snapshot '+esc(SNAP)+' (after '+esc(LYFT_SENS.after)+'), frozen into the portal on '+esc(LYFT_SENS.pulled)+
    ' (not live; a new submit replaces it): total revenue (Lyft reports one operating segment), Adjusted EBITDA and diluted shares. The model’s operating income is 0 in every projected year of this submit, '+
    'so the margin driver is the <b>Adjusted EBITDA margin on revenue</b>, not an operating margin. '+
    'A growth on an axis is a <b>flat rate compounded from Lyft’s reported '+BASE_YEAR+' revenue</b> (FY2025 10-K: $6,316.3M); a margin is that year’s. '+
    '<b>EV/EBITDA</b>: EV = Adjusted EBITDA × multiple, less net debt, over shares; the model records no P/E valuation for Lyft, so there is no P/E basis here. '+
    '<b>Exit multiple</b>: starts at the model’s own target multiple (EV/EBITDA '+(_tmLast.ev?_tmLast.ev.mult.toFixed(1)+'× on FY'+_tmLast.ev.year:'—')+', Target Multiple, latest submit); move it in the box. '+
    '<b>Shares</b>: the model’s diluted count for the year (about 359M), below the 379.2M Lyft had outstanding at Sep 30, 2026 (3Q26 release) — the model’s share count steps down from 417.7M in FY2025 (model doubt 4), so every implied price here carries that. '+
    '<b>Net debt</b> = '+fmtB(_netDebt)+' ('+esc(ND_SRC)+'; long-term debt − cash and short-term investments; restricted cash and restricted investments, which back insurance claims, are left out). '+
    'This grid prices the year alone, so its base cells do not equal the workbook’s recorded target ($'+(_tmLast.ev?_tmLast.ev.pt.toFixed(2):'—')+'): the workbook also adds the present value of the cash flows generated up to the target year and discounts the terminal value at its WACC. '+
    '<b>Street (Bloomberg consensus</b>'+(CONS.asOf?', as of '+esc(CONS.asOf):'')+'): growth as a CAGR off the 2025 actual to Bloomberg’s revenue estimate, margin = Bloomberg Adjusted EBITDA ÷ Bloomberg revenue; where Bloomberg has no figure the driver stays at the model and the strip says so. '+
    'The card beside the grid always shows <b>the other side</b> for the two axis drivers. Live price via Massive'+(_px!=null?'':' (unavailable — the grid is read against the base case instead)')+'. '+
    'Data sourced from Summit DCF models and Bloomberg consensus.';
}

function render(scope){
  if(activeMult()==null){   // no seeded multiple (rule 10): wait for the live quote
    var mx=scope.querySelector('#asMatrix'); if(mx) mx.innerHTML='<div class="rs-noguide">⚑ Live data pending — the exit multiple starts at today’s market multiple, which needs the live price.</div>';
    renderAssum(scope); return; }
  syncAxisInputs(scope); renderAssum(scope); renderMatrix(scope); }

// ── Init ─────────────────────────────────────────────────────────────────────────
function initSens(root){
  var scope = root.querySelector('.ovt-subpane[data-ovst="sensitivity"]');
  if(!scope || !scope.querySelector('#asMatrix')) return;

  if(!scope._wired){
    scope._wired = true;

    scope.querySelectorAll('[data-asyear]').forEach(function(b){ b.onclick=function(){
      _year = +b.getAttribute('data-asyear'); if(!_mTouched) startAtMarket();
      _rx={start:null,step:null}; _ry={start:null,step:null};      // ranges re-centre on the new year
      scope.querySelectorAll('[data-asyear]').forEach(function(x){ x.classList.toggle('active', x===b); });
      render(scope);
    }; });

    // Switching the base moves every default on the grid, so the auto-centred ranges have to
    // re-centre with it.
    scope.querySelectorAll('[data-asbase]').forEach(function(b){ b.onclick=function(){
      _base = b.getAttribute('data-asbase');
      _rx={start:null,step:null}; _ry={start:null,step:null};
      scope.querySelectorAll('[data-asbase]').forEach(function(x){ x.classList.toggle('active', x===b); });
      render(scope);
    }; });

    scope.querySelectorAll('[data-asbasis]').forEach(function(b){ b.onclick=function(){
      _basis = b.getAttribute('data-asbasis');
      scope.querySelectorAll('[data-asbasis]').forEach(function(x){ x.classList.toggle('active', x===b); });
      scope.querySelector('#asMultL').textContent = multLabel();
      scope.querySelector('#asMult').value = activeMult();
      if(drv(_x).kind==='x') _rx={start:null,step:null};           // the multiple axis re-centres
      if(drv(_y).kind==='x') _ry={start:null,step:null};
      render(scope);
    }; });

    var sx=scope.querySelector('#asX'), sy=scope.querySelector('#asY');
    // X = Y would make a meaningless grid — the other axis moves to the next driver (from amzn-sensitivity.js)
    function keepDistinct(changed){ if(_x!==_y) return; var other=changed==='x'?sy:sx;
      var alt=[].slice.call(other.options).filter(function(o){ return o.value!==_x; })[0]; if(!alt) return;
      other.value=alt.value; if(changed==='x'){ _y=alt.value; _ry={start:null,step:null}; } else { _x=alt.value; _rx={start:null,step:null}; } }
    sx.onchange=function(){ _x=sx.value; _rx={start:null,step:null}; keepDistinct('x'); render(scope); };
    sy.onchange=function(){ _y=sy.value; _ry={start:null,step:null}; keepDistinct('y'); render(scope); };

    var mi=scope.querySelector('#asMult');
    mi.oninput=function(){ var v=parseFloat(mi.value); if(!isFinite(v)||v<=0) return;
      _mTouched=true;
      if(_basis==='ev') _mEv=v; else _mPe=v;
      if(drv(_x).kind==='x' && _rx.start==null) {} // auto axes follow the new centre
      render(scope); };

    // reads _rx/_ry at input time — a reset or an axis change REPLACES those objects, so binding the object
    // itself (sharkninja-sensitivity.js) left the start/step inputs dead after the first change (fixed in AMZN)
    function bindRange(inpId, kind, getK, axis){
      var el=scope.querySelector('#'+inpId);
      el.oninput=function(){ var v=parseFloat(el.value); if(!isFinite(v)) return;
        (axis==='x' ? _rx : _ry)[kind] = fromInp(getK(), v); render(scope); };
    }
    bindRange('asXs','start',function(){ return _x; }, 'x');
    bindRange('asXd','step', function(){ return _x; }, 'x');
    bindRange('asYs','start',function(){ return _y; }, 'y');
    bindRange('asYd','step', function(){ return _y; }, 'y');
    scope.querySelector('#asXr').onclick=function(){ _rx={start:null,step:null}; render(scope); };
    scope.querySelector('#asYr').onclick=function(){ _ry={start:null,step:null}; render(scope); };

    // live price (Massive); net debt keeps its balance-sheet source. The grid still renders if this fails.
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('LYFT') : null; })
      .then(function(res){
        var q = res && res.data ? res.data : res; if(!q) return;
        if(q.price!=null){ _px = q.price;
          if(!_mTouched) startAtMarket();
          scope.querySelector('#asMult').value = activeMult()==null ? '' : activeMult();
          render(scope); }
      }).catch(function(){});
  }
  render(scope);
}

export var lyftSens = { body: sensBody, init: initSens };
