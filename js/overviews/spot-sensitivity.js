// overviews/spot-sensitivity.js — Spotify (SPOT) Deep Dive ▸ Valuation ▸ Sensitivity Analysis (VA-SENS, playbook §14).
//
// COPIED from js/overviews/tsm-sensitivity.js (itself a copy of sharkninja-sensitivity.js and amzn-sensitivity.js).
// Same functions, markup, class names and interactions; only the data layer and the labels change. Pick any two
// drivers, hold everything else at the base, read the implied price per share off a 5×5 grid; exit multiple on
// EV/EBITDA or P/E.
//
// What changed for Spotify:
//   • EUR throughout: Spotify reports in euros and the Summit model is built in euros; the grid prices a EUR share.
//     No FX, no ADR wording, no US$ price. No WACC, no discounting, no 1−g anywhere.
//   • BASE = the Summit DCF model, ONE snapshot FROZEN in ./spot-sensitivity-data.js (rule 10: coded directly, not
//     live). Key 'summit' = the model and 'cons' = Street (Bloomberg), as in AMZN.
//   • SEGMENTS = Premium and Ad-Supported revenue, which add up to the model's revenue to the euro. Spotify reports
//     GROSS profit by segment, not operating income, so the margin driver is one consolidated operating margin.
//   • BASE YEAR 2025 = reported segment revenue (js/results-data/spot.js act): a growth on an axis compounds off it.
//   • STREET = Bloomberg consensus read through, never retyped: segment growth as a CAGR off the 2025 actual to the
//     export's segment revenue (./spot-bbg.js, FY2026–FY2028), operating margin = oi ÷ revenue. Where Bloomberg has no
//     figure (FY2029) the driver falls back to the model and the strip says so.
//   • D&A bridge = model EBITDA − operating income, held fixed ("D&A + non-operating").
//   • EXIT MULTIPLE starts at the model's own (./spot-target-multiple-data.js); yours to move.
//   • SHARES / TAX from the model. NET CASH from ./spot-sensitivity-data.js with its source named.
//   • NO LIVE PRICE: the grid is read against the base case (the share trades in US$ and the model prices in euros;
//     nothing is converted).
//   • inline <style> → css/overview.css (.ov-spot-dd); X = Y is blocked (keepDistinct, from AMZN).

import { SUMMIT_CAT, SUMMIT_POS, SUMMIT_NEG } from '../viz-palette.js';
import { spotResults } from '../results-data/spot.js';
import { spotBBG } from './spot-bbg.js';
import { SPOT_SENS, SPOT_NETCASH } from './spot-sensitivity-data.js';
import { SPOT_TM } from './spot-target-multiple-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = SPOT_SENS.snapshot;            // the Summit snapshot every figure comes from
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028, 2029];

// ── Data layer: the frozen Summit snapshot + the reported 2025 base, never re-typed here ─────────────
var MX = (spotResults && spotResults.views && spotResults.views.y) ? spotResults.views.y.metrics : {};
function yAct(key, year){ var m=MX[key]; if(!m||!m.periods) return null; var i=m.periods.indexOf(String(year)); return (i<0||!m.act)?null:m.act[i]; }
var SEGS = [
  { k:'prem', rk:'premrev', bk:'seg454645', n:'Premium',      c:SUMMIT_CAT[0] },
  { k:'ads',  rk:'adrev',   bk:'seg454644', n:'Ad-Supported', c:SUMMIT_CAT[1] },
];
// rev = segment revenue · op = operating income · eb = model EBITDA · earn = model net income ·
// tax = fraction · sh = diluted shares (M). EUR millions throughout.
var M = {};
M[BASE_YEAR] = {};
SEGS.forEach(function(sg){ M[BASE_YEAR][sg.k]={ rev:yAct(sg.rk, BASE_YEAR) }; });
M[BASE_YEAR].rev = SEGS.reduce(function(t,sg){ return t+(M[BASE_YEAR][sg.k].rev||0); }, 0);
YEARS.forEach(function(y){ var r=SPOT_SENS.y[y]; if(!r) return;
  M[y] = { rev:r.rev, op:r.op, eb:r.eb, earn:r.earn, tax:r.tax, sh:r.sh, eps:r.earn/r.sh };
  SEGS.forEach(function(sg){ M[y][sg.k]={ rev:r.seg[sg.k] }; });
});
var NET_DEBT_SEED = SPOT_NETCASH.value;   // EUR M, negative = net cash
var ND_SRC = SPOT_NETCASH.src;

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
  { k:'prem_g',  seg:'prem',  kind:'g', n:'Premium revenue growth',      step:0.02 },
  { k:'ads_g',   seg:'ads',   kind:'g', n:'Ad-Supported revenue growth', step:0.03 },
  { k:'op_m',    seg:null,    kind:'m', n:'Operating margin (consolidated)', step:0.01 },
  { k:'mult',    seg:null,    kind:'x', n:'Exit multiple',             step:1    },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── The comparison slot — Street (Bloomberg consensus), read through ─────────────────────────────────
// Growth = CAGR off the 2025 reported segment revenue to Bloomberg's estimate for that year; operating margin
// = Bloomberg operating income ÷ revenue. A year Bloomberg does not cover stays empty and falls back visibly.
function streetCagr(bk, year){ var j=spotBBG.yearsF.indexOf(year), sr=spotBBG.seg[bk]&&spotBBG.seg[bk].rev, a=yAct(SEGS.filter(function(g){ return g.bk===bk; })[0].rk, BASE_YEAR), c=(j<0||!sr)?null:sr.f[j]; return (a&&c)?(Math.pow(c/a, 1/(year-BASE_YEAR))-1):null; }
function streetMargin(year){ var j=spotBBG.yearsF.indexOf(year), oi=spotBBG.is.oi, rv=spotBBG.is.revenue;
  return (j<0||!oi||!rv||oi.f[j]==null||!rv.f[j])?null:oi.f[j]/rv.f[j]; }
var CONS = { src:'Bloomberg consensus', asOf:spotBBG.asOf, v:{ op_m:{}, mult:{} } };
SEGS.forEach(function(sg){ CONS.v[sg.k+'_g']={}; });
YEARS.forEach(function(y){
  SEGS.forEach(function(sg){ var g=streetCagr(sg.bk, y); if(g!=null) CONS.v[sg.k+'_g'][y]=g; });
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
var _tm    = SPOT_TM.snaps[SPOT_TM.snaps.length-1].val;
var _year  = (_tm.ev && _tm.ev.year) || 2027;   // the year the model's own target multiple is applied to
var _base  = 'summit';    // 'summit' = the Summit model (populated) · 'cons' = Street (Bloomberg)
var _x     = 'prem_g';
var _y     = 'op_m';
var _basis = 'ev';        // 'ev' = EV/EBITDA · 'pe' = P/E
var _mEv   = _tm.ev ? _tm.ev.mult : 20;   // exit EV/EBITDA — starts at the model's own target multiple
var _mPe   = _tm.pe ? _tm.pe.mult : 28;   // exit P/E — likewise
var _netDebt = NET_DEBT_SEED;   // EUR M, net cash (call, see ./spot-sensitivity-data.js)
var _rx = { start:null, step:null };   // null = auto from the base
var _ry = { start:null, step:null };

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }

// ── Model reads ──────────────────────────────────────────────────────────────────
function lastYearWith(field, year){ for(var y=year; y>=BASE_YEAR; y--) if(M[y] && M[y][field]!=null) return y; return YEARS[0]; }
function taxFor(year){ return M[year].tax==null ? M[lastYearWith('tax',year)].tax : M[year].tax; }
function sharesFor(year){ return M[year].sh; }   // the model's diluted shares
function sharesHeld(year){ return false; }
function heldFlags(year){ return M[year].tax==null; }
function catSum(year){ var t=0; SEGS.forEach(function(sg){ t += M[year][sg.k].rev; }); return t; }
// D&A + non-operating, held fixed: the model's EBITDA − operating income.
function dnaFor(year){ return M[year].eb - M[year].op; }
function modelOpMargin(year){ return M[year].op / M[year].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}
// The model's operating margin applied to the platform sum — the reference the P/E delta is taken off.
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
  // One consolidated margin — Spotify reports gross profit by segment, not operating income.
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
  if(a<1000) return s+'€'+Math.round(a).toLocaleString('en-US')+'M';
  var b=a/1000;
  return s+'€'+(b<100?b.toFixed(2):Math.round(b))+'B';
}
function fmtPx(v){ return '€'+Math.round(v).toLocaleString('en-US'); }
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
    return '<div class="rs-noguide">Sensitivity analysis is unavailable: a series it needs (segment revenue, operating income, '+
      'EBITDA, net income, tax rate or shares) is missing from the frozen Summit snapshot in js/overviews/spot-sensitivity-data.js. '+
      'Nothing is estimated in its place.</div>';
  }
  var h = '';
  // styles: css/overview.css (.ov-spot-dd — the pane-scoped .sens-ctrl fixes and the .as-* comparison card)
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
         '<input class="sens-inp" id="asMult" type="number" step="0.5" value="'+activeMult()+'"><span class="sens-inp-u">×</span></span></div>'+
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
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')</span>'+items+
    '<span class="sens-assum-i'+(mLive?' sens-assum-hi':'')+'">Operating margin (consolidated) <b>'+pctLbl(baseValue('op_m',year))+'</b>'+
      (mLive?' <i>(on an axis)</i>':'')+(mFb?' <i>(no Street figure — held at the model)</i>':'')+'</span>'+
    // these stay the model's under either base, and say so rather than inheriting the strip's title
    '<span class="sens-assum-i">D&amp;A + non-operating <b>'+fmtB(dnaFor(year))+'</b> <i>(model EBITDA − op income, held'+(_base==='cons'?' at the model':'')+')</i></span>'+
    '<span class="sens-assum-i">Tax <b>'+pctLbl(taxFor(year))+'</b>'+(M[year].tax==null?' <i>(held at '+lastYearWith('tax',year)+')</i>':(_base==='cons'?' <i>(model)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+sharesFor(year).toFixed(1)+'M</b> <i>(diluted, model)</i></span>'+
    '<span class="sens-assum-i">Net cash <b>'+fmtB(-_netDebt)+'</b> <i>('+esc(ND_SRC)+')</i></span>';
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
      ? 'The exit multiple starts at the model\'s own target multiple ('+(_basis==='ev'?(_tm.ev?_tm.ev.mult:'—'):(_tm.pe?_tm.pe.mult:'—'))+'×) and is yours to move; Bloomberg publishes none.'
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
  var year=_year, r=altCalc(year);
  var isCons=(altBase()==='cons');
  var h='<div class="as-cons-h">What '+(isCons?'Street (Bloomberg consensus)':'the Summit model')+' assumes</div>'+
    '<div class="as-cons-src">'+esc(isCons?consSrcLabel():('Summit DCF model · snapshot '+SNAP))+' · '+year+
    ' · the two drivers on the axes</div>';
  h += consRowHtml('X →', _x, year);
  h += consRowHtml('Y ↓', _y, year);

  if(r){
    var hasX = drv(_x).kind!=='x' && altValue(_x,year)!=null;
    var hasY = drv(_y).kind!=='x' && altValue(_y,year)!=null;
    var lbl  = (hasX&&hasY) ? 'Implied at both' : ('Implied at the '+(hasX?'X':'Y')+' figure alone');
    var where = (hasX&&hasY)
      ? (cell ? 'Ringed on the grid.' : 'Off the current grid — widen a range to see it.')
      : ('The '+(hasX?esc(drv(_y).n):esc(drv(_x).n))+' axis keeps your own input, so this cannot be '+
         'placed on the grid.');
    h += '<div class="as-cons-px"><div class="as-cons-k">'+lbl+'</div>'+
      '<div class="v">'+fmtPx(r.px)+'</div>'+
      '<div class="s">'+(_basis==='ev' ? ('EBITDA '+fmtB(r.ebitda)+' × '+r.mult.toFixed(1)+'×')
                           : ('EPS €'+r.eps.toFixed(2)+' × '+r.mult.toFixed(1)+'×'))+
      '<br>'+where+
      '</div></div>';
  }
  el.innerHTML=h;
}

function renderMatrix(scope){
  var year=_year, dX=drv(_x), dY=drv(_y);
  var aX=axis(_x,_rx,year), aY=axis(_y,_ry,year);
  var base=calc(year,{}), ref=base.px;

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
                       : ('EPS €'+c.r.eps.toFixed(2)+' × '+c.r.mult.toFixed(1)+'× (earnings '+fmtB(c.r.earnings)+')'))+
        ' → '+fmtPx(c.r.px)+'/sh ('+signPct(c.up)+' vs base case)'+
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
  if(lg) lg.textContent = '(implied price vs. the base case)';

  var ys = YEARS.map(function(y){
    var r=calc(y,{});
    return '<div class="sens-card"><div class="sens-card-l">'+y+(heldFlags(y)?' ⚠':'')+'</div>'+
           '<div class="sens-card-v">'+fmtPx(r.px)+'</div>'+
           '<div class="sens-card-s">'+(_basis==='ev' ? ('EBITDA '+fmtB(r.ebitda)) : ('EPS €'+r.eps.toFixed(2)))+
           '</div></div>';
  }).join('');
  scope.querySelector('#asYears').innerHTML = '<div class="sens-regions">'+ys+'</div>';

  var tmEv=_tm.ev, tmPe=_tm.pe;
  scope.querySelector('#asFoot').innerHTML =
    'Every base figure is the <b>Summit DCF model</b>, snapshot '+esc(SNAP)+' (after '+esc(SPOT_SENS.after)+'), frozen into the portal on '+esc(SPOT_SENS.pulled)+
    ' (not live; a new submit replaces it): revenue by segment (Premium · Ad-Supported, which add up to the model\'s revenue), operating income, EBITDA, net income (the model\'s own definition), '+
    'tax rate and diluted shares. All figures are in <b>euros</b>, the currency Spotify reports in and the model is built in; nothing is converted and nothing is discounted. '+
    'Spotify reports <b>gross profit</b> by segment but no operating income, so growth moves per segment while the margin driver is <b>consolidated</b> operating margin. '+
    'A growth on an axis is a <b>flat rate compounded from Spotify\'s reported '+BASE_YEAR+' segment revenue</b>; a margin is that year\'s. '+
    '<b>D&amp;A + non-operating</b> = model EBITDA − operating income, held fixed (the model\'s EBITDA includes non-operating items). '+
    '<b>EV/EBITDA</b>: EV = EBITDA × multiple, plus net cash, over shares. <b>P/E</b>: the operating-income delta flows through tax onto the model\'s net income, so '+
    'the base reproduces the model\'s EPS. <b>Exit multiple</b> starts at the model\'s own target multiple ('+(tmEv?tmEv.mult+'× EV/EBITDA':'')+(tmPe?', '+tmPe.mult+'× P/E':'')+
    ' on FY'+(tmEv?tmEv.year:_year)+') and is yours to move. <b>Net cash</b> = '+fmtB(-_netDebt)+' ('+esc(ND_SRC)+'); the Summit model has no net-debt line. '+
    'This grid values the model\'s year at an exit multiple; it is not the workbook\'s recorded price target, which Target Multiple shows. '+
    '<b>Street (Bloomberg consensus</b>, export as of '+esc(spotBBG.asOf)+'): segment growth as a CAGR off the 2025 actual to the export\'s segment revenue, operating margin = '+
    'Bloomberg operating income ÷ revenue; where Bloomberg has no figure (FY2029) the driver stays at the model and the strip says so. '+
    'The card beside the grid always shows <b>the other side</b> for the two axis drivers. '+
    'Data sourced from Summit DCF models and Bloomberg consensus.';
}

function render(scope){ syncAxisInputs(scope); renderAssum(scope); renderMatrix(scope); }

// ── Init ─────────────────────────────────────────────────────────────────────────
function initSens(root){
  var scope = root.querySelector('.ovt-subpane[data-ovst="sensitivity"]');
  if(!scope || !scope.querySelector('#asMatrix')) return;

  if(!scope._wired){
    scope._wired = true;

    scope.querySelectorAll('[data-asyear]').forEach(function(b){ b.onclick=function(){
      _year = +b.getAttribute('data-asyear');
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

  }
  render(scope);
}

export var spotSens = { body: sensBody, init: initSens };
