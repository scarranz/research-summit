// overviews/googl-sensitivity.js — Alphabet (GOOGL) Deep Dive ▸ Valuation ▸ Sensitivity Analysis (VA-SENS, playbook §14).
//
// COPIED from js/overviews/meta-sensitivity.js (tsm- → sharkninja- → amzn-sensitivity.js) — same functions, markup,
// class names and interactions; only the data layer and the labels change. Pick any two drivers, hold everything
// else at the base, read the implied share price off a 5×5 grid; exit multiple EV/EBITDA or P/E.
//
// What changed for GOOGL:
//   • BASE = the Summit DCF model, ONE snapshot FROZEN in ./googl-sensitivity-data.js (2026-08-06; rule 10) — the same
//     snapshot as Results and Target Multiple, so the EBITDA here is the one Target Multiple values (A26).
//   • CATEGORIES = the three segments (Google Services · Google Cloud · Other Bets). One margin driver: consolidated
//     operating margin — the model projects segment operating income for 2026 only, so no segment margin is invented.
//   • BASE YEAR 2025 = reported segment revenue (js/results-data/googl.js act).
//   • EBITDA = adjusted (operating income + D&A + SBC), the model's own line; the D&A + SBC bridge is held fixed.
//   • STREET = Bloomberg consensus through js/results-data/googl.js annual `cons` (segment lines; operating margin =
//     consensus operating income ÷ the segment-sum revenue).
//   • EXIT MULTIPLE starts at the MODEL's own target multiples (EV/EBITDA 12.7×, P/E 24.0× on FY2027 — Target Multiple,
//     ./googl-target-multiple-data.js), never at a hand-picked number; yours to move.
//   • NET DEBT = Alphabet's latest 10-Q (./googl-histmult-data.js), its source named (A23); the quote supplies the price.
//   • Relocation #42: Dani's seeded sensitivity (FY2027E EBITDA "~$235B", 15×, sliders) is replaced by this pane.
//   • YEARS 2026–2028 (the snapshot has no 2029 EBITDA).

import { SUMMIT_CAT, SUMMIT_POS, SUMMIT_NEG } from '../viz-palette.js';
import { googlResults } from '../results-data/googl.js';
import { GOOGL_SENS } from './googl-sensitivity-data.js';
import { GOOGL_TM } from './googl-target-multiple-data.js';
import { GOOGL_HM_Q } from './googl-histmult-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = GOOGL_SENS.snapshot;            // the Summit snapshot every figure comes from
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028];

// ── Data layer: the frozen Summit snapshot + the reported 2025 base, never re-typed here ─────────────
var MX = (googlResults && googlResults.views && googlResults.views.y) ? googlResults.views.y.metrics : {};
function yAct(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.act)?null:m.act[i]; }
function yCons(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.cons)?null:m.cons[i]; }
var SEGS = [
  { k:'svc',   rk:'svc',   n:'Google Services', c:SUMMIT_CAT[0] },
  { k:'cloud', rk:'cloud', n:'Google Cloud',    c:SUMMIT_CAT[1] },
  { k:'bets',  rk:'bets',  n:'Other Bets',      c:SUMMIT_CAT[2] },
];
// rev = revenue by line · op = operating income · eb = adjusted EBITDA (op + D&A + SBC) · earn = model earnings (adj.) ·
// tax = fraction · sh = diluted shares (M). $M throughout.
var M = {};
M[BASE_YEAR] = {};
SEGS.forEach(function(sg){ M[BASE_YEAR][sg.k]={ rev:yAct(sg.rk, BASE_YEAR) }; });
M[BASE_YEAR].rev = SEGS.reduce(function(t,sg){ return t+(M[BASE_YEAR][sg.k].rev||0); }, 0);
YEARS.forEach(function(y){ var r=GOOGL_SENS.y[y]; if(!r) return;
  M[y] = { rev:r.rev, op:r.op, eb:r.eb, earn:r.earn, tax:r.tax, sh:r.sh, eps:r.earn/r.sh };
  SEGS.forEach(function(sg){ M[y][sg.k]={ rev:r.line[sg.k] }; });
});
var _ndRow = GOOGL_HM_Q[GOOGL_HM_Q.length-1];
var NET_DEBT_SEED = _ndRow[9];            // $M, negative = net cash — Alphabet 10-Q (long-term debt − cash and marketable securities)
var ND_SRC = _ndRow[0]+' 10-Q, filed '+_ndRow[2];

// Every series the calc needs, for every year — if one is missing the pane says so instead of NaN.
function dataOk(){
  var ok=true;
  SEGS.forEach(function(sg){ if(M[BASE_YEAR][sg.k].rev==null) ok=false; });
  YEARS.forEach(function(y){
    if(!M[y]){ ok=false; return; }
    SEGS.forEach(function(sg){ if(M[y][sg.k].rev==null) ok=false; });
    if(M[y].op==null || M[y].eb==null || M[y].earn==null || M[y].rev==null || M[y].tax==null || !M[y].sh) ok=false;
  });
  return ok;
}

// Axis drivers. `step` is the default grid increment; the user can override start and step.
var DRIVERS = [
  { k:'svc_g',   seg:'svc',   kind:'g', n:'Google Services revenue growth', step:0.02 },
  { k:'cloud_g', seg:'cloud', kind:'g', n:'Google Cloud revenue growth',    step:0.05 },
  { k:'bets_g',  seg:'bets',  kind:'g', n:'Other Bets revenue growth',      step:0.05 },
  { k:'op_m',  seg:null,  kind:'m', n:'Operating margin (consolidated)', step:0.01 },
  { k:'mult',  seg:null,  kind:'x', n:'Exit multiple',                step:1    },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── The comparison slot — Street (Bloomberg consensus), read through ─────────────────────────────────
// Growth = CAGR off the 2025 reported revenue of the line to Bloomberg's estimate for that year; operating margin
// = Bloomberg operating income ÷ revenue. A year Bloomberg does not cover stays empty and falls back visibly.
function streetCagr(rk, year){ var a=yAct(rk, BASE_YEAR), c=yCons(rk, year); return (a&&c)?(Math.pow(c/a, 1/(year-BASE_YEAR))-1):null; }
function streetMargin(year){ var o=yCons('opinc', year), r=yCons('rev', year); return (o!=null&&r)?o/r:null; }
var _cv = googlResults.estMatrix && googlResults.estMatrix.cons && googlResults.estMatrix.cons.vintages;
var CONS = { src:'Bloomberg consensus', asOf:(_cv&&_cv.length)?_cv[_cv.length-1].id:null, v:{ op_m:{}, mult:{} } };
SEGS.forEach(function(sg){ CONS.v[sg.k+'_g']={}; });
YEARS.forEach(function(y){
  SEGS.forEach(function(sg){ var g=streetCagr(sg.rk, y); if(g!=null) CONS.v[sg.k+'_g'][y]=g; });
  var m=streetMargin(y); if(m!=null) CONS.v.op_m[y]=m;
});
function consValue(k, year){ var row=CONS.v[k]; var v=row?row[year]:null; return v==null?null:v; }
function consPlaceholder(){ return !CONS.src; }
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
  var m = (_base==='cons') ? consValue('op_m', year) : null;
  return m==null ? modelOpMargin(year) : m;
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
var _year  = (function(){ var s=GOOGL_TM.snaps[GOOGL_TM.snaps.length-1]; return s.val.ev?s.val.ev.year:2027; })();   // the model's target year
var _base  = 'summit';    // 'summit' = the Summit model (populated) · 'cons' = Street (Bloomberg)
var _x     = 'cloud_g';
var _y     = 'op_m';
var _basis = 'ev';        // 'ev' = EV/EBITDA · 'pe' = P/E
var _mEv   = null;        // exit EV/EBITDA — starts at the model's target multiple (startAtMarket below)
var _mPe   = null;        // exit P/E — likewise
var _mTouched = false;    // once the user moves the multiple, a later quote no longer resets it
var _netDebt = NET_DEBT_SEED;   // $M, Alphabet's latest 10-Q; the live quote does not override it (A23)
var _rx = { start:null, step:null };   // null = auto from the base
var _ry = { start:null, step:null };
var _px = null;           // live share price

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
// The exit multiple starts at the MODEL's own target multiples (Target Multiple, latest submit) — never today's market
// multiple, never a guess. The name is kept from the copy so every caller stays unchanged.
var _tmLast = GOOGL_TM.snaps[GOOGL_TM.snaps.length-1].val;
function startAtMarket(){
  if(_tmLast.ev) _mEv=_tmLast.ev.mult;
  if(_tmLast.pe) _mPe=_tmLast.pe.mult;
}
startAtMarket();
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }

// ── Model reads ──────────────────────────────────────────────────────────────────
function lastYearWith(field, year){ for(var y=year; y>=BASE_YEAR; y--) if(M[y] && M[y][field]!=null) return y; return YEARS[0]; }
function taxFor(year){ return M[year].tax==null ? M[lastYearWith('tax',year)].tax : M[year].tax; }
function sharesFor(year){ return M[year].sh; }   // the model's diluted shares (held flat)
function sharesHeld(year){ return false; }
function heldFlags(year){ return M[year].tax==null; }
function catSum(year){ var t=0; SEGS.forEach(function(sg){ t += M[year][sg.k].rev; }); return t; }
// D&A + SBC, held fixed: the model's adjusted EBITDA − operating income (EBITDA = operating income + D&A + SBC).
function dnaFor(year){ return M[year].eb - M[year].op; }
function modelOpMargin(year){ return M[year].op / M[year].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}
// The model's operating margin applied to the sum of the lines — the reference the P/E delta is taken off.
function modelOpTotal(year){ return catSum(year) * modelOpMargin(year); }

// The model's own value for a driver — the axis default centres on this.
function modelValue(k, year){
  var d = drv(k);
  if(d.kind==='x') return activeMult();
  return d.kind==='g' ? modelCagr(d.seg, year) : modelOpMargin(year);
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
  // One consolidated margin — the snapshot has no usable segment operating income.
  var om = over.op_m!=null ? over.op_m : baseMargin(year);
  var opTotal = revTotal * om;
  var dna = dnaFor(year);                                 // D&A + non-operating, held at the model
  var ebitda = opTotal + dna;
  var tax = taxFor(year);
  var shares = sharesFor(year);
  // Flow the operating-income delta through tax onto the model's own net income, so the base case
  // reproduces the model's EPS exactly and only the delta is modelled.
  var earnings = M[year].earn + (opTotal - modelOpTotal(year)) * (1 - tax);
  var mult = over.mult!=null ? over.mult : activeMult();
  var ev, equity, px;
  if(_basis==='ev'){ ev = ebitda*mult; equity = ev - _netDebt; px = equity/shares; }
  else             { px = (earnings/shares)*mult; equity = px*shares; ev = equity + _netDebt; }
  return { parts:parts, rev:revTotal, om:om, dna:dna, opTotal:opTotal, ebitda:ebitda, earnings:earnings,
           mult:mult, ev:ev, equity:equity, px:px, eps:earnings/shares, shares:shares };
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){
  if(Math.abs(v)<0.5) v=0;                       // no "−$0M" from a rounding residue
  var s=v<0?'−':'', a=Math.abs(v);
  if(a<1000) return s+'$'+Math.round(a).toLocaleString('en-US')+'M';
  var b=a/1000;
  return s+(b>=1000 ? ('$'+(b/1000).toFixed(2)+'T') : ('$'+(b<100?b.toFixed(2):Math.round(b))+'B'));
}
function fmtPx(v){ return '$'+Math.round(v).toLocaleString('en-US'); }
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
    return '<div class="rs-noguide">Sensitivity analysis is unavailable: a series it needs (revenue by line, operating income, '+
      'D&A, net income, tax rate or shares) is missing from the frozen Summit snapshot in js/overviews/meta-sensitivity-data.js. '+
      'Nothing is estimated in its place.</div>';
  }
  var h = '';
  // styles: css/overview.css (:is(.ov-tsm-dd, .ov-meta-dd) — the pane-scoped .sens-ctrl fixes and the .as-* card)
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
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Exit multiple on</span><div class="sens-years">'+
         '<button type="button" class="sens-year'+(_basis==='ev'?' active':'')+'" data-asbasis="ev">EV/EBITDA</button>'+
         '<button type="button" class="sens-year'+(_basis==='pe'?' active':'')+'" data-asbasis="pe">P/E</button>'+
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
  var items = SEGS.map(function(s){
    var live = (drv(_x).seg===s.k) || (drv(_y).seg===s.k);
    // a Street run that quietly used model figures would read as Street; say which fell back
    var fb = consFellBack(s.k+'_g', year);
    return '<span class="sens-assum-i'+(live?' sens-assum-hi':'')+'">'+esc(s.n)+
      ' growth <b>'+pctLbl(baseValue(s.k+'_g',year))+'</b>'+
      (live?' <i>(on an axis)</i>':'')+(fb?' <i>(no Street figure — held at the model)</i>':'')+'</span>';
  }).join('');
  var mLive = drv(_x).kind==='m' || drv(_y).kind==='m';
  var mFb = consFellBack('op_m', year);
  var gap = catSum(year) - M[year].rev;
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')</span>'+items+
    '<span class="sens-assum-i'+(mLive?' sens-assum-hi':'')+'">Operating margin (consolidated) <b>'+pctLbl(baseValue('op_m',year))+'</b>'+
      (mLive?' <i>(on an axis)</i>':'')+(mFb?' <i>(no Street figure — held at the model)</i>':'')+'</span>'+
    // these stay the model's under either base, and say so rather than inheriting the strip's title
    '<span class="sens-assum-i">D&amp;A + SBC <b>'+fmtB(dnaFor(year))+'</b> <i>(model, held'+(_base==='cons'?' at the model':'')+')</i></span>'+
    '<span class="sens-assum-i">Tax <b>'+pctLbl(taxFor(year))+'</b>'+(M[year].tax==null?' <i>(held at '+lastYearWith('tax',year)+')</i>':(_base==='cons'?' <i>(model)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+sharesFor(year).toFixed(1)+'M</b> <i>(diluted, model — held flat)</i></span>'+
    '<span class="sens-assum-i">Net debt <b>'+fmtB(_netDebt)+'</b> <i>(net cash — '+esc(ND_SRC)+')</i></span>';
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
      ? 'The exit multiple starts at today’s market multiple on the model’s '+_year+' numbers and is yours to move; Bloomberg publishes none.'
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
      ' · '+(_basis==='ev' ? ('EBITDA '+fmtB(r.ebitda)+' × '+r.mult.toFixed(1)+'×')
                           : ('EPS $'+r.eps.toFixed(2)+' × '+r.mult.toFixed(1)+'×'))+
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
        (_basis==='ev' ? ('EBITDA '+fmtB(c.r.ebitda)+' × '+c.r.mult.toFixed(1)+'× = EV '+fmtB(c.r.ev)+' → equity '+fmtB(c.r.equity))
                       : ('EPS $'+c.r.eps.toFixed(2)+' × '+c.r.mult.toFixed(1)+'× (earnings '+fmtB(c.r.earnings)+')'))+
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
           '<div class="sens-card-s">'+(_basis==='ev' ? ('EBITDA '+fmtB(r.ebitda)) : ('EPS $'+r.eps.toFixed(2)))+
           (up!=null?(' · '+signPct(up)):'')+'</div></div>';
  }).join('');
  scope.querySelector('#asYears').innerHTML = '<div class="sens-regions">'+ys+'</div>';

  scope.querySelector('#asFoot').innerHTML =
    'Every base figure is the <b>Summit DCF model</b> for GOOGL, snapshot '+esc(SNAP)+' (after '+esc(GOOGL_SENS.after)+'), frozen into the portal on '+esc(GOOGL_SENS.pulled)+
    ' (not live; a new submit replaces it): revenue by segment (Google Services · Google Cloud · Other Bets — their sum is the model’s total revenue to within its −$74M of 2026 hedging), operating income, '+
    'adjusted EBITDA, the model’s adjusted earnings (without the gains on equity securities), tax rate and diluted shares (held flat in the model). The model projects segment operating income for 2026 only, so the margin '+
    'driver is <b>consolidated</b> operating margin. A growth on an axis is a <b>flat rate compounded from Alphabet’s reported '+BASE_YEAR+' revenue for that segment</b>; a margin is '+
    'that year’s. <b>EBITDA</b> = operating income + the model’s D&amp;A and SBC, held fixed — the same adjusted EBITDA Target Multiple values. '+
    '<b>EV/EBITDA</b>: EV = EBITDA × multiple, less net debt, over shares. <b>P/E</b>: the operating-income delta flows through tax onto the model’s earnings, so '+
    'the base reproduces the model’s EPS. <b>Exit multiple</b>: starts at the model’s own target multiples (EV/EBITDA '+(_tmLast.ev?_tmLast.ev.mult.toFixed(1)+'×':'—')+', P/E '+(_tmLast.pe?_tmLast.pe.mult.toFixed(1)+'×':'—')+' on FY'+(_tmLast.ev?_tmLast.ev.year:'—')+', Target Multiple) and is yours to move. '+
    '<b>Net debt</b> = '+fmtB(_netDebt)+' ('+esc(ND_SRC)+'; long-term debt minus cash and marketable securities, which from 2Q26 include $87.1B of marketable equity securities). '+
    '<b>Street (Bloomberg consensus</b>'+(CONS.asOf?', as of '+esc(CONS.asOf):'')+'): growth of each segment as a CAGR off the 2025 actual to Bloomberg’s estimate, operating margin = '+
    'Bloomberg operating income ÷ the sum of its segment revenue; where Bloomberg has no figure the driver stays at the model and the strip says so. '+
    'The card beside the grid always shows <b>the other side</b> for the two axis drivers. Live price via Massive'+(_px!=null?'':' (unavailable — the grid waits for it)')+'. '+
    'This pane replaces the July profile’s seeded sensitivity (FY2027E EBITDA about $235B at 15×): the model’s FY2027 EBITDA is '+fmtB(M[2027]?M[2027].eb:null)+'. '+
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
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('GOOGL') : null; })
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

export var googlSens = { body: sensBody, init: initSens };
