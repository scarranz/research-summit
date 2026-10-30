// overviews/amzn-sensitivity.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Sensitivity Analysis (VA-SENS, playbook §14).
//
// COPIED from js/overviews/googl-sensitivity.js (meta- → tsm- → sharkninja- → the original amzn-sensitivity.js) — same
// functions, markup, class names and interactions; only the data layer, the drivers and the labels change. Pick any two
// drivers, hold everything else at the base, read the implied share price off a 5×5 grid; exit multiple EV/EBITDA or P/E.
// It REPLACES the old Amazon pane: its `M` / `SHARES` typed without a snapshot date, its hand-picked 12× / 30× exit
// multiples, its invented `CONS` numbers (A24) and its inline <style> are gone.
//
// What changed for AMZN (vs googl-sensitivity.js):
//   • BASE = the Summit DCF model, ONE snapshot FROZEN in ./amzn-sensitivity-data.js (2026-10-30; rule 10) — the same
//     snapshot as the latest Target Multiple row.
//   • SEGMENTS = North America · International · AWS, each with a GROWTH and an OPERATING-MARGIN driver: unlike Alphabet,
//     the model projects segment operating income in every year (OPINC · OPINC2 · OPINC3), so the margins are the
//     model's own (back to the original Amazon pane's drivers).
//   • BASE YEAR 2025 = reported segment revenue (js/results-data/amzn.js act).
//   • EBITDA = the model's consolidated adjusted EBITDA (operating income + D&A + SBC) — the one Target Multiple values:
//     segment operating income moves with the drivers, the model's D&A + SBC bridge (EBITDA − operating income) is held
//     fixed, so the base case reproduces the model's EBITDA exactly. The segment EBITDAs (operating income + segment D&A,
//     no SBC) + unallocated D&A do NOT sum to it; the footer says so with the numbers (A26).
//   • STREET = Bloomberg consensus by segment from ./amzn-bbg.js (revenue and operating income, FY2026–2028, as of
//     newest snapshot, 2026-10-30): growth = CAGR off the 2025 actual to Bloomberg's estimate, margin = Bloomberg operating income ÷ revenue.
//     2029 has no Bloomberg figure — those drivers fall back to the model, visibly.
//   • EXIT MULTIPLE starts at the MODEL's own target multiples (EV/EBITDA 9.5×, P/E 25.0× on FY2027 in the 2026-10-30 submit — Target Multiple,
//     ./amzn-target-multiple-data.js), never at a hand-picked number; yours to move.
//   • NET DEBT = Amazon's latest reported balance sheet (./amzn-histmult-data.js), its source named (A23); the quote
//     supplies the price only.
//   • YEARS 2026–2029 (the snapshot carries every line through 2029). The footer compares the consolidated D&A with the
//     segment + unallocated D&A per year instead of asserting it (2026-10-30: equal from 2027, $1.4B apart in 2026).
//   • styles: css/overview.css (.sens-* / .as-* rules shared via :is(…) — .ov-amzn-dd has to be on those lists).

import { SUMMIT_CAT, SUMMIT_POS, SUMMIT_NEG } from '../viz-palette.js';
import { amznResults } from '../results-data/amzn.js';
import { amznBBG } from './amzn-bbg.js';
import { AMZN_SENS } from './amzn-sensitivity-data.js';
import { AMZN_TM } from './amzn-target-multiple-data.js';
import { AMZN_HM_Q } from './amzn-histmult-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = AMZN_SENS.snapshot;            // the Summit snapshot every figure comes from
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028, 2029];

// ── Data layer: the frozen Summit snapshot + the reported 2025 base, never re-typed here ─────────────
var MX = (amznResults && amznResults.views && amznResults.views.y) ? amznResults.views.y.metrics : {};
function yAct(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.act)?null:m.act[i]; }
// Fixed portal categorical slots, in the order of Amazon's segment note (10-K Note 10).
var SEGS = [
  { k:'na',   rk:'usrev',  n:'North America', c:SUMMIT_CAT[0] },
  { k:'intl', rk:'intrev', n:'International', c:SUMMIT_CAT[1] },
  { k:'aws',  rk:'aws',    n:'AWS',           c:SUMMIT_CAT[2] },
];
// Per segment: rev = revenue · op = operating income · eb = segment EBITDA (op + segment D&A, no SBC). Per year: rev / eb =
// consolidated revenue and adjusted EBITDA (op + D&A + SBC) · corp = unallocated D&A · dna = consolidated D&A ·
// earn = model earnings (adj.) · tax = fraction · sh = diluted shares (M). $M throughout.
var M = {};
M[BASE_YEAR] = {};
SEGS.forEach(function(sg){ M[BASE_YEAR][sg.k]={ rev:yAct(sg.rk, BASE_YEAR) }; });
M[BASE_YEAR].rev = SEGS.reduce(function(t,sg){ return t+(M[BASE_YEAR][sg.k].rev||0); }, 0);
YEARS.forEach(function(y){ var r=AMZN_SENS.y[y]; if(!r) return;
  M[y] = { rev:r.rev, eb:r.eb, corp:r.corp, dna:r.dna, earn:r.earn, tax:r.tax, sh:r.sh, eps:r.earn/r.sh };
  SEGS.forEach(function(sg){ var g=r[sg.k]||{}; M[y][sg.k]={ rev:g.rev, op:g.op, eb:g.eb }; });
});
var _ndRow = AMZN_HM_Q[AMZN_HM_Q.length-1];
var NET_DEBT_SEED = _ndRow[9];            // $M, negative = net cash — long-term debt − cash, equivalents and marketable securities
var ND_SRC = _ndRow[0]+(_ndRow[0]==='3Q26' ? ' balance sheet (8-K of '+_ndRow[2]+'; current portion of debt from the 10-Q of 2026-10-30)'
                                           : ' 10-Q / 10-K, filed '+_ndRow[2]);

// Every series the calc needs, for every year — if one is missing the pane says so instead of NaN.
function dataOk(){
  var ok=true;
  SEGS.forEach(function(sg){ if(M[BASE_YEAR][sg.k].rev==null) ok=false; });
  YEARS.forEach(function(y){
    if(!M[y]){ ok=false; return; }
    SEGS.forEach(function(sg){ if(M[y][sg.k].rev==null || M[y][sg.k].op==null) ok=false; });
    if(M[y].eb==null || M[y].earn==null || M[y].rev==null || M[y].tax==null || !M[y].sh) ok=false;
  });
  return ok;
}

// Axis drivers. `step` is the default grid increment; the user can override start and step.
var DRIVERS = [
  { k:'na_g',   seg:'na',   kind:'g', n:'North America revenue growth',   step:0.01  },
  { k:'na_m',   seg:'na',   kind:'m', n:'North America operating margin', step:0.01  },
  { k:'intl_g', seg:'intl', kind:'g', n:'International revenue growth',   step:0.01  },
  { k:'intl_m', seg:'intl', kind:'m', n:'International operating margin', step:0.005 },
  { k:'aws_g',  seg:'aws',  kind:'g', n:'AWS revenue growth',             step:0.02  },
  { k:'aws_m',  seg:'aws',  kind:'m', n:'AWS operating margin',           step:0.02  },
  { k:'mult',   seg:null,   kind:'x', n:'Exit multiple',                  step:1     },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── The comparison slot — Street (Bloomberg consensus by segment), read through ───────────────────────
// ./amzn-bbg.js `seg` carries Bloomberg's segment revenue and operating income: 2023–2025 actual (a) and FY2026–2028
// estimates (f). Growth = CAGR off Bloomberg's own 2025 actual (the reported figure) to its estimate for that year;
// margin = Bloomberg operating income ÷ Bloomberg revenue. A year Bloomberg does not cover stays empty and falls back
// visibly. No figure here is typed.
function bbgSeg(seg, line, year){
  var s=amznBBG && amznBBG.seg && amznBBG.seg[seg] && amznBBG.seg[seg][line]; if(!s) return null;
  if(year===BASE_YEAR){ var ia=amznBBG.yearsA.indexOf(year); return ia<0?null:s.a[ia]; }
  var i=amznBBG.yearsF.indexOf(year); return (i<0||s.f[i]==null)?null:s.f[i];
}
function streetCagr(seg, year){ var a=bbgSeg(seg,'rev',BASE_YEAR), c=bbgSeg(seg,'rev',year); return (a&&c)?(Math.pow(c/a, 1/(year-BASE_YEAR))-1):null; }
function streetMargin(seg, year){ var o=bbgSeg(seg,'oi',year), r=bbgSeg(seg,'rev',year); return (o!=null&&r)?o/r:null; }
function isoOf(us){ var p=String(us||'').split('/'); return p.length===3 ? (p[2]+'-'+('0'+p[0]).slice(-2)+'-'+('0'+p[1]).slice(-2)) : null; }
var CONS = { src:'Bloomberg consensus', asOf:isoOf(amznBBG && amznBBG.asOf), v:{ mult:{} } };
SEGS.forEach(function(sg){ CONS.v[sg.k+'_g']={}; CONS.v[sg.k+'_m']={}; });
YEARS.forEach(function(y){
  SEGS.forEach(function(sg){
    var g=streetCagr(sg.k, y); if(g!=null) CONS.v[sg.k+'_g'][y]=g;
    var m=streetMargin(sg.k, y); if(m!=null) CONS.v[sg.k+'_m'][y]=m;
  });
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
function baseMargin(seg, year){
  var m = (_base==='cons') ? consValue(seg+'_m', year) : null;
  return m==null ? modelOpMargin(seg, year) : m;
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
var _year  = (function(){ var s=AMZN_TM.snaps[AMZN_TM.snaps.length-1]; return s.val.ev?s.val.ev.year:2027; })();   // the model's target year
var _base  = 'summit';    // 'summit' = the Summit model (populated) · 'cons' = Street (Bloomberg)
var _x     = 'aws_g';
var _y     = 'aws_m';
var _basis = 'ev';        // 'ev' = EV/EBITDA · 'pe' = P/E
var _mEv   = null;        // exit EV/EBITDA — starts at the model's target multiple (startAtMarket below)
var _mPe   = null;        // exit P/E — likewise
var _mTouched = false;    // once the user moves the multiple, a later quote no longer resets it
var _netDebt = NET_DEBT_SEED;   // $M, Amazon's latest reported balance sheet; the live quote does not override it (A23)
var _rx = { start:null, step:null };   // null = auto from the base
var _ry = { start:null, step:null };
var _px = null;           // live share price

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
// The exit multiple starts at the MODEL's own target multiples (Target Multiple, latest submit) — never today's market
// multiple, never a guess. The name is kept from the copy so every caller stays unchanged.
var _tmLast = AMZN_TM.snaps[AMZN_TM.snaps.length-1].val;
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
function heldFlags(year){ return M[year].tax==null; }
function catSum(year){ var t=0; SEGS.forEach(function(sg){ t += M[year][sg.k].rev; }); return t; }
function modelOpTotal(year){ var t=0; SEGS.forEach(function(s){ t += M[year][s.k].op; }); return t; }
// D&A + SBC, held fixed: the model's consolidated adjusted EBITDA − its operating income (the sum of the three segments,
// summit-map). Adding it back to the driven operating income reproduces the model's EBITDA in the base case.
function dnaFor(year){ return M[year].eb - modelOpTotal(year); }
function modelOpMargin(seg, year){ return M[year][seg].op / M[year][seg].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}

// The model's own value for a driver — the axis default centres on this.
function modelValue(k, year){
  var d = drv(k);
  if(d.kind==='x') return activeMult();
  return d.kind==='g' ? modelCagr(d.seg, year) : modelOpMargin(d.seg, year);
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
  var parts=[], revTotal=0, opTotal=0;
  SEGS.forEach(function(s){
    var gK=s.k+'_g', mK=s.k+'_m', rev;
    if(over[gK]!=null){                                   // flat rate compounded 2026 → year
      rev = M[BASE_YEAR][s.k].rev;
      for(var y=BASE_YEAR+1; y<=year; y++) rev *= (1 + over[gK]);
    } else rev = baseRev(s.k, year);                      // off the axes: whichever base is selected
    var om = over[mK]!=null ? over[mK] : baseMargin(s.k, year);
    var op = rev * om;
    revTotal += rev; opTotal += op;
    parts.push({ k:s.k, n:s.n, c:s.c, rev:rev, om:om, op:op });
  });
  var dna = dnaFor(year);                                 // D&A + SBC, held at the model
  var ebitda = opTotal + dna;
  var tax = taxFor(year);
  var shares = sharesFor(year);
  // Flow the operating-income delta through tax onto the model's own earnings, so the base case
  // reproduces the model's EPS exactly and only the delta is modelled.
  var earnings = M[year].earn + (opTotal - modelOpTotal(year)) * (1 - tax);
  var mult = over.mult!=null ? over.mult : activeMult();
  var ev, equity, px;
  if(_basis==='ev'){ ev = ebitda*mult; equity = ev - _netDebt; px = equity/shares; }
  else             { px = (earnings/shares)*mult; equity = px*shares; ev = equity + _netDebt; }
  return { parts:parts, rev:revTotal, dna:dna, opTotal:opTotal, ebitda:ebitda, earnings:earnings,
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
  if(cap<=0) return 'white';
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
    return '<div class="rs-noguide">Sensitivity analysis is unavailable: a series it needs (segment revenue or operating income, '+
      'EBITDA, earnings, tax rate or shares) is missing from the frozen Summit snapshot in js/overviews/amzn-sensitivity-data.js. '+
      'Nothing is estimated in its place.</div>';
  }
  var h = '';
  // styles: css/overview.css (:is(…, .ov-amzn-dd) — the pane-scoped .sens-ctrl fixes and the .as-* card)
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
    var gk=s.k+'_g', mk=s.k+'_m';
    var gLive = (_x===gk) || (_y===gk), mLive = (_x===mk) || (_y===mk);
    // a Street run that quietly used model figures would read as Street; say which fell back
    var gFb = consFellBack(gk, year), mFb = consFellBack(mk, year);
    return '<span class="sens-assum-i'+(gLive?' sens-assum-hi':'')+'">'+esc(s.n)+
      ' growth <b>'+pctLbl(baseValue(gk,year))+'</b>'+
      (gLive?' <i>(on an axis)</i>':'')+(gFb?' <i>(no Street figure — held at the model)</i>':'')+'</span>'+
      '<span class="sens-assum-i'+(mLive?' sens-assum-hi':'')+'">'+esc(s.n)+
      ' margin <b>'+pctLbl(baseValue(mk,year))+'</b>'+
      (mLive?' <i>(on an axis)</i>':'')+(mFb?' <i>(no Street figure — held at the model)</i>':'')+'</span>';
  }).join('');
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')</span>'+items+
    // these stay the model's under either base, and say so rather than inheriting the strip's title
    '<span class="sens-assum-i">D&amp;A + SBC <b>'+fmtB(dnaFor(year))+'</b> <i>(model, held'+(_base==='cons'?' at the model':'')+')</i></span>'+
    '<span class="sens-assum-i">Tax <b>'+pctLbl(taxFor(year))+'</b>'+(M[year].tax==null?' <i>(held at '+lastYearWith('tax',year)+')</i>':(_base==='cons'?' <i>(model)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+sharesFor(year).toLocaleString('en-US')+'M</b> <i>(diluted, model — held flat)</i></span>'+
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
      ? 'The exit multiple starts at the model’s own target multiple (Target Multiple) and is yours to move; Bloomberg publishes none.'
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

  var y=_year, mY=M[y], segEb=SEGS.reduce(function(t,s){ return t+(mY[s.k].eb||0); },0)+(mY.corp||0);
  scope.querySelector('#asFoot').innerHTML =
    'Every base figure is the <b>Summit DCF model</b> for AMZN, snapshot '+esc(SNAP)+' (after '+esc(AMZN_SENS.after)+'), frozen into the portal on '+esc(AMZN_SENS.pulled)+
    ' (not live; a new submit replaces it): revenue and operating income by segment (North America · International · AWS — revenue sums to the model’s total, operating income to its operating income), '+
    'adjusted EBITDA, the model’s adjusted earnings (without the non-operating gains), tax rate and diluted shares (held flat in the model). '+
    'A growth on an axis is a <b>flat rate compounded from Amazon’s reported '+BASE_YEAR+' revenue for that segment</b>; a margin is that segment’s operating margin in that year. '+
    '<b>EBITDA</b> = the driven operating income + the model’s D&amp;A and SBC (its EBITDA − operating income), held fixed — so the base case is the same adjusted EBITDA Target Multiple values ('+fmtB(mY.eb)+' in '+y+'). '+
    '<b>Not the sum of the segment EBITDAs:</b> the model’s segment EBITDA is operating income + segment D&amp;A with no SBC; the three segments plus unallocated D&amp;A sum to '+fmtB(segEb)+' in '+y+
    ', against '+fmtB(mY.eb)+' consolidated — the consolidated line adds SBC'+(function(){
      // segment D&A + unallocated = the segment EBITDAs + corp − segment operating income; compared, never asserted
      var segDna=segEb-SEGS.reduce(function(t,s){ return t+(mY[s.k].op||0); },0), d=mY.dna-segDna;
      return ', and its D&amp;A ('+fmtB(mY.dna)+') '+(Math.abs(d)<=Math.abs(segDna)*0.005?'equals':(d>0?'is larger than':'is smaller than'))+
        ' the segment plus unallocated D&amp;A ('+fmtB(segDna)+')'; })()+(mY.corp===0?' (the model leaves unallocated D&amp;A at 0 in '+y+')':'')+'. '+
    '<b>EV/EBITDA</b>: EV = EBITDA × multiple, less net debt, over shares. <b>P/E</b>: the operating-income delta flows through tax onto the model’s earnings, so '+
    'the base reproduces the model’s EPS. <b>Exit multiple</b>: starts at the model’s own target multiples (EV/EBITDA '+(_tmLast.ev?_tmLast.ev.mult.toFixed(1)+'×':'—')+', P/E '+(_tmLast.pe?_tmLast.pe.mult.toFixed(1)+'×':'—')+' on FY'+(_tmLast.ev?_tmLast.ev.year:'—')+', Target Multiple) and is yours to move. '+
    '<b>Net debt</b> = '+fmtB(_netDebt)+' ('+esc(ND_SRC)+'; long-term debt minus cash, equivalents and marketable securities, leases excluded). '+
    '<b>Street (Bloomberg consensus</b>'+(CONS.asOf?', as of '+esc(CONS.asOf):'')+'): growth of each segment as a CAGR off the 2025 actual to Bloomberg’s estimate, margin = '+
    'Bloomberg segment operating income ÷ segment revenue, FY2026–2028; where Bloomberg has no figure (2029) the driver stays at the model and the strip says so. '+
    'The card beside the grid always shows <b>the other side</b> for the two axis drivers. '+(_px!=null?'Live price via Massive. ':'Live price unavailable — the grid is read against the base case. ')+
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
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('AMZN') : null; })
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

export var amznSens = { body: sensBody, init: initSens };
