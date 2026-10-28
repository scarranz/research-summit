// overviews/sharkninja-sensitivity.js — SharkNinja (SN) Deep Dive ▸ Valuation ▸ Sensitivity Analysis,
// on AMAZON'S machinery.
//
// WHY THIS FILE EXISTS (Sep 2026). SAB wants SN's Valuation to look, be structured and behave exactly
// like Amazon's. A re-implementation drifts (the Earnings tab proved it three times), so this is a
// COPY of js/overviews/amzn-sensitivity.js — same functions, same markup, same class names, same
// inline CSS, same controls, same interactions — with only the data layer swapped. Pick any two
// drivers, hold everything else at the base, and read the implied share price off a 5×5 grid.
// Terminal value is an exit multiple — EV/EBITDA or P/E, your choice.
//
// Every change from amzn-sensitivity.js, so a diff against it is not a surprise:
//   • BASE. There is no Summit DCF model for SN. SAB decided the base is Bloomberg (BST) Street
//     consensus, read straight through from js/results-data/sn.js (snResults.views.y.metrics):
//     FY2025 reported actual + FY2026–FY2029 `cons`. Nothing is re-typed — M is BUILT from that
//     dataset at load, so the pane cannot drift from the Results tab.
//   • SEGMENTS. AMZN's three reportable segments (AWS · North America · International) become SN's
//     four product categories — Cleaning (segCleaning), Cooking & Beverage (segCookBev), Food
//     Preparation (segFoodPrep), Beauty & Home Environment (segBeautyHome) — on SUMMIT_CAT[0..3].
//     SN has ONE reportable segment and no operating income or EBITDA by category or region.
//   • DRIVERS. AMZN has growth + operating margin per segment. SN keeps one revenue-growth driver
//     per category, but only ONE margin driver: CONSOLIDATED operating margin (opIncome ÷ rev).
//     Category margins would be invented, so they are not offered. No second (Adj. EBITDA) margin
//     axis either: with D&A held fixed, EBITDA margin is not an independent driver of op margin —
//     AMZN's structure does not support both, so adding one would be a redesign.
//   • D&A. AMZN: segment EBITDA − segment operating income. SN: consolidated ebitdaAdj − opIncome,
//     held fixed per year. Note this bridge is WIDER than reported D&A (the `da` line) because
//     Adjusted EBITDA also adds back share-based comp and other adjustments — it is labelled
//     "D&A + adjustments" in the UI for that reason.
//   • EARNINGS / SHARES / TAX. earnings = niAdj (AMZN:earnings). Shares are NOT in the dataset:
//     derived per year as niAdj ÷ epsAdj (FY2026 ≈ 142.3M, in line with the company's ~142.5M
//     guided diluted count) — AMZN held one flat share count. Tax = taxRate (percent → fraction);
//     populated for every year, so nothing is held today, but a missing year holds the last
//     available value and is marked ⚠ exactly as AMZN marks its held values.
//   • NO CORPORATE LINE. AMZN adds corporate/other EBITDA; SN has no such split. Removed.
//   • NET DEBT. Seeded at −$61M (net CASH, Jun 30 2026, Aug 2026 investor deck — the same figure as
//     SN_VAL_FALLBACK in sharkninja-valuation.js); the live quote overrides it exactly as in AMZN.
//   • ASSUMPTIONS TOGGLE. Kept, with the internal keys unchanged. In AMZN key 'summit' = the model
//     (populated) and 'cons' = Street (placeholder). Here the populated base IS Street, so key
//     'summit' is LABELLED "Street (Bloomberg consensus)" and key 'cons' is the comparison slot,
//     LABELLED "Summit model" — and it is EMPTY (CONS.v has no figures, CONS.src null) because no
//     Summit DCF exists for SN. The module's own empty state renders: the side card states there is
//     nothing to compare, the grid carries no ring, and selecting it falls every driver back to
//     Street with the strip saying so. If a Summit model is ever built, fill CONS.v — no UI work.
//   • LABELS. Every "Summit model / the model / Summit DCF" string that referred to the populated
//     base now says "Street (Bloomberg consensus)" / "Street"; the footer is rewritten for SN.
//   • FORMAT. fmtB learns $M (SN is ~1/100th of AMZN: "$2B" would hide the whole grid's spread) and a
//     proper minus sign; figures ≥ $1B show two decimals below $100B.
//   • DEFAULTS. Axes default to Cleaning growth × operating margin (AMZN: AWS growth × AWS margin);
//     default exit P/E 20× (AMZN 30×) so the P/E and EV/EBITDA 12× bases land in the same range.
//     Both are the reader's input, not data.
//   • LIVE PRICE. liveQuote('SN') instead of liveQuote('AMZN').
//   • EMPTY STATE. If a required series is missing for any year, body() renders a stated
//     unavailable note instead of a grid of NaN (§0.2 rule 6).
//
// ── Reconciliation, stated rather than plugged ───────────────────────────────────
// 1. Categories vs net sales. The four category lines tie EXACTLY to net sales in FY2025 (reported:
//    6,399.2). In consensus they do not — Bloomberg's category estimates come from fewer brokers
//    than the total:  FY2026 7,452.0 vs 7,483.6 (−31.7, −0.4%) · FY2027 8,341.2 vs 8,478.2 (−137.1,
//    −1.6%) · FY2028 9,169.8 vs 9,413.5 (−243.7, −2.6%) · FY2029 9,887.4 vs 9,887.0 (+0.4).
//    The grid builds revenue from the categories and does NOT plug the gap, the same way AMZN leaves
//    its corporate drag out. The operating margin is applied to the category sum; the P/E leg flows
//    only the DELTA vs Street's own margin-on-that-sum onto niAdj, so the P/E base reproduces Street
//    Adj. EPS exactly, while the EV/EBITDA base sits below Street Adj. EBITDA by gap × margin. The
//    gap is shown in the strip above the grid for the selected year.
// 2. GAAP vs adjusted. The margin driver is GAAP operating margin; EBITDA and earnings are the
//    ADJUSTED lines (ebitdaAdj, niAdj, epsAdj) because those are what SN guides and the Street
//    values. The bridge between them (D&A + SBC + other adjustments) is held fixed, stated above.
// 3. Oddity in the source, flagged not smoothed: Street FY2029 has Beauty & Home falling (1,775.8 →
//    1,516.9) and Adj. EBITDA − op income dipping in FY2028 (181.9 vs 262.5 / 227.0 either side).

import { SUMMIT_CAT } from '../viz-palette.js';
import { snResults } from '../results-data/sn.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = snResults.updated;             // 'Sep 2026' — the Bloomberg snapshot
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028, 2029];

// ── Data layer: built from js/results-data/sn.js, never re-typed ─────────────────
// Annual view; the reported actual wins where present, else Bloomberg Street consensus.
var MX = (snResults && snResults.views && snResults.views.y) ? snResults.views.y.metrics : {};
function yv(key, year){
  var m=MX[key]; if(!m || !m.periods) return null;
  var i=m.periods.indexOf(String(year)); if(i<0) return null;
  var a=m.act?m.act[i]:null; if(a!=null) return a;
  var c=m.cons?m.cons[i]:null; return c==null?null:c;
}
// rev = category revenue · op = GAAP operating income · eb = Adjusted EBITDA · earn = Adj. net
// income · eps = Adj. diluted EPS · tax = effective tax rate (fraction), all $M except eps.
var M = {};
[BASE_YEAR].concat(YEARS).forEach(function(y){
  var t = yv('taxRate', y);
  M[y] = { cln:{rev:yv('segCleaning',y)}, ckb:{rev:yv('segCookBev',y)}, fp:{rev:yv('segFoodPrep',y)}, bh:{rev:yv('segBeautyHome',y)},
           rev:yv('rev',y), op:yv('opIncome',y), eb:yv('ebitdaAdj',y), earn:yv('niAdj',y), eps:yv('epsAdj',y),
           tax:(t==null?null:t/100) };
});
var NET_DEBT_SEED = -61;                  // $M — NET CASH at Jun 30 2026, Aug 2026 investor deck

var SEGS = [
  { k:'cln', n:'Cleaning',           c:SUMMIT_CAT[0] },
  { k:'ckb', n:'Cooking & Beverage', c:SUMMIT_CAT[1] },
  { k:'fp',  n:'Food Preparation',   c:SUMMIT_CAT[2] },
  { k:'bh',  n:'Beauty & Home Env.', c:SUMMIT_CAT[3] },
];

// Every series the calc needs, for every year — if one is missing the pane says so instead of NaN.
function dataOk(){
  var ok=true;
  [BASE_YEAR].concat(YEARS).forEach(function(y){
    SEGS.forEach(function(s){ if(M[y][s.k].rev==null) ok=false; });
    if(y!==BASE_YEAR && (M[y].op==null || M[y].eb==null || M[y].earn==null || M[y].rev==null)) ok=false;
  });
  if(M[BASE_YEAR].tax==null || M[BASE_YEAR].earn==null || !M[BASE_YEAR].eps) ok=false;
  return ok;
}

// Axis drivers. `step` is the default grid increment; the user can override start and step.
var DRIVERS = [
  { k:'cln_g', seg:'cln', kind:'g', n:'Cleaning revenue growth',            step:0.02 },
  { k:'ckb_g', seg:'ckb', kind:'g', n:'Cooking & Beverage revenue growth',  step:0.02 },
  { k:'fp_g',  seg:'fp',  kind:'g', n:'Food Preparation revenue growth',    step:0.02 },
  { k:'bh_g',  seg:'bh',  kind:'g', n:'Beauty & Home Env. revenue growth',  step:0.02 },
  { k:'op_m',  seg:null,  kind:'m', n:'Operating margin (consolidated)',    step:0.01 },
  { k:'mult',  seg:null,  kind:'x', n:'Exit multiple',                      step:1    },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── The comparison slot — EMPTY FOR SN ───────────────────────────────────────────
// In AMZN this held Street consensus beside the Summit model. For SN the populated base already IS
// Street, so this slot is the Summit model — and no Summit DCF model exists for SN. Every figure is
// deliberately absent; the card, strip and grid render their own "nothing to compare" state.
// If a Summit model is ever built: fill CONS.v (same keys as DRIVERS, same years as YEARS; growth
// as a CAGR off the 2025 actual, margin as that year's consolidated operating margin, fractions),
// set CONS.src and CONS.asOf — nothing else changes.
var CONS = {
  src:  null,        // e.g. 'Summit DCF model' — null means "no such model for SN"
  asOf: null,
  v: {
    cln_g: {}, ckb_g: {}, fp_g: {}, bh_g: {},
    op_m:  {},
    // The exit multiple is the reader's own input, not something any model publishes.
    mult:  {},
  },
};
function consValue(k, year){ var row=CONS.v[k]; var v=row?row[year]:null; return v==null?null:v; }
function consPlaceholder(){ return !CONS.src; }
function consSrcLabel(){ return CONS.src ? (CONS.src + (CONS.asOf?(' · '+CONS.asOf):'')) : 'no Summit DCF model exists for SN'; }
function baseName(b){ return (b||_base)==='cons' ? 'the Summit model' : 'Street (Bloomberg consensus)'; }
function baseNameCap(b){ return (b||_base)==='cons' ? 'Summit model' : 'Street'; }
function altBase(){ return _base==='summit' ? 'cons' : 'summit'; }

// ── Whose number is this? ────────────────────────────────────────────────────────
// One function decides it for every driver. The comparison slot covers nothing for SN, so every
// figure falls back to Street; consFellBack() is what makes that fallback visible instead of silent.
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
var _year  = 2028;
var _base  = 'summit';    // key kept from AMZN: 'summit' = Street (populated) · 'cons' = Summit model slot (empty)
var _x     = 'cln_g';
var _y     = 'op_m';
var _basis = 'ev';        // 'ev' = EV/EBITDA · 'pe' = P/E
var _mEv   = 12;          // exit EV/EBITDA
var _mPe   = 20;          // exit P/E
var _netDebt = NET_DEBT_SEED;   // $M, overridden by the live quote (Massive) when it returns one
var _ndLive  = false;
var _rx = { start:null, step:null };   // null = auto from the base
var _ry = { start:null, step:null };
var _px = null;           // live share price

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }

// ── Street reads ─────────────────────────────────────────────────────────────────
function lastYearWith(field, year){ for(var y=year; y>=BASE_YEAR; y--) if(M[y] && M[y][field]!=null) return y; return BASE_YEAR; }
function taxFor(year){ return M[year].tax==null ? M[lastYearWith('tax',year)].tax : M[year].tax; }
// Diluted shares are not in the dataset: derived as Adj. net income ÷ Adj. diluted EPS.
function sharesFor(year){
  for(var y=year; y>=BASE_YEAR; y--) if(M[y].earn!=null && M[y].eps) return M[y].earn/M[y].eps;
  return null;
}
function sharesHeld(year){ return !(M[year].earn!=null && M[year].eps); }
function heldFlags(year){ return (M[year].tax==null || sharesHeld(year)); }
function catSum(year){ var t=0; SEGS.forEach(function(s){ t += M[year][s.k].rev; }); return t; }
// Consolidated D&A + adjustments, held fixed: Adjusted EBITDA − GAAP operating income.
function dnaFor(year){ return M[year].eb - M[year].op; }
function modelOpMargin(year){ return M[year].op / M[year].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}
// Street's operating margin applied to the category sum — the reference the P/E delta is taken off.
function modelOpTotal(year){ return catSum(year) * modelOpMargin(year); }

// Street's own value for a driver — the axis default centres on this.
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
  // One consolidated margin — SN discloses no operating income by category.
  var om = over.op_m!=null ? over.op_m : baseMargin(year);
  var opTotal = revTotal * om;
  var dna = dnaFor(year);                                 // D&A + adjustments held at Street
  var ebitda = opTotal + dna;
  var tax = taxFor(year);
  var shares = sharesFor(year);
  // Flow the operating-income delta through tax onto Street's own Adj. net income, so the base
  // case reproduces Street Adj. EPS exactly and only the delta is modelled.
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
    return '<div class="rs-noguide">Sensitivity analysis is unavailable: a series it needs (category revenue, operating income, '+
      'Adjusted EBITDA, Adjusted net income or tax rate) is missing from the Street (Bloomberg consensus) dataset in '+
      'js/results-data/sn.js. Nothing is estimated in its place.</div>';
  }
  var h = '';
  // overview.css carries two competing .sens-ctrl rules: the slider style (~line 416) sets
  // .sens-ctrl-l { min-width:200px } and the matrix style (~line 509) never clears it, so every
  // label reserved 200px and pushed the reset button onto its own line. Neutralise it for THIS
  // pane only — editing the global rule would shift TBBB's and SOFI's sensitivity layouts.
  h += '<style>'+
    '.ovt-subpane[data-ovst="sensitivity"] .sens-ctrl-l{min-width:0}'+
    '.ovt-subpane[data-ovst="sensitivity"] .sens-ctrl{margin:0;gap:8px}'+
    '.ovt-subpane[data-ovst="sensitivity"] .sens-row-inp{gap:12px 18px}'+
    '.ovt-subpane[data-ovst="sensitivity"] .as-reset{padding:5px 11px;font-size:11px}'+
    // the grid and the comparison card sit side by side; the card drops under the grid when the
    // pane gets narrow rather than squeezing the matrix
    '.as-mxrow{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;margin:10px 0 4px}'+
    '.as-mxrow>.sens-matrix-wrap{flex:1 1 520px;min-width:0;margin:0}'+
    '.as-cons{flex:0 0 258px;border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;background:#FCFCFD}'+
    '.as-cons-h{font-size:11px;font-weight:800;color:var(--navy);letter-spacing:.02em;margin-bottom:2px}'+
    '.as-cons-src{font-size:10px;color:var(--mu);margin-bottom:10px}'+
    '.as-cons-r{padding:8px 0;border-top:1px solid var(--bdr)}'+
    '.as-cons-k{font-size:10.5px;font-weight:700;color:var(--mu);margin-bottom:3px}'+
    '.as-cons-v{display:flex;align-items:baseline;gap:8px;font-size:13px;font-weight:800;color:var(--navy)}'+
    '.as-cons-v small{font-size:10px;font-weight:600;color:var(--mu)}'+
    '.as-cons-d{font-size:10.5px;font-weight:700;margin-top:2px}'+
    '.as-cons-nil{font-size:10.5px;color:var(--mu);line-height:1.45}'+
    '.as-cons-px{margin-top:10px;padding-top:10px;border-top:2px solid var(--bdr)}'+
    '.as-cons-px .v{font-size:20px;font-weight:800;color:var(--navy);line-height:1.1}'+
    '.as-cons-px .s{font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.45}'+
    // the comparison cell, ringed on the grid — purple, the same "not base data" colour the
    // Target Multiple block uses for its stand-ins
    '.sens-cell.as-cons-cell{outline:2px solid #8E44AD;outline-offset:-2px}'+
    '.as-cons-ph{display:inline-block;font-size:9px;font-weight:800;border-radius:20px;padding:1px 7px;'+
      'color:#8E44AD;border:1px solid #8E44AD;margin-left:6px;vertical-align:1px}'+
    '</style>';
  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Valuation year</span><div class="sens-years">'+
         YEARS.map(function(y){ return '<button type="button" class="sens-year'+(y===_year?' active':'')+'" data-asyear="'+y+'">'+y+'</button>'; }).join('')+
       '</div></div>'+
       // Whose assumptions the grid is built on. Everything OFF the two axes is held here, so this
       // is the control that changes what the whole matrix means — hence its place on the top row.
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Assumptions</span><div class="sens-years">'+
         '<button type="button" class="sens-year'+(_base==='summit'?' active':'')+'" data-asbase="summit"'+
           ' title="Every driver off the axes held at Street (Bloomberg consensus)">Street (Bloomberg consensus)</button>'+
         '<button type="button" class="sens-year'+(_base==='cons'?' active':'')+'" data-asbase="cons"'+
           ' title="Every driver off the axes held at the Summit model'+(consPlaceholder()?' — no Summit DCF model exists for SN, so every driver falls back to Street':'')+'">'+
           'Summit model'+(consPlaceholder()?' ⚑':'')+'</button>'+
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
       '<button type="button" class="sens-year as-reset" id="asXr" title="Back to the Street-centred range">reset</button>'+
       '</div>';
  h += '<div class="sens-controls-row sens-row-inp">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Y axis ↓</span>'+selHtml('asY', _y)+'</div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">starts at</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYs" type="number" step="0.5"><span class="sens-inp-u" id="asYsU">%</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">step</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYd" type="number" step="0.25"><span class="sens-inp-u" id="asYdU">pp</span></span></div>'+
       '<button type="button" class="sens-year as-reset" id="asYr" title="Back to the Street-centred range">reset</button>'+
       '</div>';

  h += '<div class="sens-assum" id="asAssum"></div>';
  h += '<div class="as-mxrow">'+
         '<div class="sens-matrix-wrap" id="asMatrix"></div>'+
         '<div class="as-cons" id="asCons"></div>'+
       '</div>';
  h += '<div class="sens-legend"><span>Lower</span><div class="sens-legend-bar"></div><span>Higher</span>'+
       '<span class="sens-legend-n" id="asLegendN"></span></div>';

  h += '<div class="ov-sec" style="margin-top:16px"><div class="ov-sec-h">The same base case across years</div>'+
       '<div id="asYears"></div>'+
       '<div class="ov-fynote">Street (Bloomberg consensus) untouched, valued at the multiple above. It climbs across years purely because the Street compounds — '+
       'nothing here is discounted back, so read the later years as "what the Street implies you would be paying for", not as a target price.</div></div>';

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
    // a Summit-model run that quietly used Street figures would read as Summit; say which fell back
    var fb = consFellBack(s.k+'_g', year);
    return '<span class="sens-assum-i'+(live?' sens-assum-hi':'')+'">'+esc(s.n)+
      ' growth <b>'+pctLbl(baseValue(s.k+'_g',year))+'</b>'+
      (live?' <i>(on an axis)</i>':'')+(fb?' <i>(no Summit figure — held at Street)</i>':'')+'</span>';
  }).join('');
  var mLive = drv(_x).kind==='m' || drv(_y).kind==='m';
  var mFb = consFellBack('op_m', year);
  var gap = catSum(year) - M[year].rev;
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')'+
      (_base==='cons' && consPlaceholder() ? ' ⚑ no Summit model for SN' : '')+'</span>'+items+
    '<span class="sens-assum-i'+(mLive?' sens-assum-hi':'')+'">Operating margin (consolidated) <b>'+pctLbl(baseValue('op_m',year))+'</b>'+
      (mLive?' <i>(on an axis)</i>':'')+(mFb?' <i>(no Summit figure — held at Street)</i>':'')+'</span>'+
    // these stay Street's under either base, and say so rather than inheriting the strip's title
    '<span class="sens-assum-i">Categories vs net sales <b>'+fmtB(gap)+'</b> <i>(not plugged)</i></span>'+
    '<span class="sens-assum-i">D&amp;A + adjustments <b>'+fmtB(dnaFor(year))+'</b> <i>(Adj. EBITDA − op income, held'+(_base==='cons'?' at Street':'')+')</i></span>'+
    '<span class="sens-assum-i">Tax <b>'+pctLbl(taxFor(year))+'</b>'+(M[year].tax==null?' <i>(held at '+lastYearWith('tax',year)+')</i>':(_base==='cons'?' <i>(Street)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+sharesFor(year).toFixed(1)+'M</b> <i>('+(sharesHeld(year)?'held — ':'')+'Adj. net income ÷ Adj. EPS)</i></span>'+
    '<span class="sens-assum-i">Net debt <b>'+fmtB(_netDebt)+'</b>'+(_ndLive?'':' <i>(net cash, Jun 30 2026)</i>')+'</span>';
}

// ── The other side, at the right of the grid ─────────────────────────────────────
// Always shows whichever base you are NOT reading: the Summit model slot while the grid is on
// Street, Street while the grid is on the Summit slot. For SN the Summit slot is empty, so the rows
// state that rather than inventing a comparison.
function consRowHtml(role, k, year){
  var d=drv(k), av=altValue(k,year), bv=baseValue(k,year);
  var h='<div class="as-cons-r"><div class="as-cons-k">'+esc(role)+' &nbsp;'+esc(d.n)+'</div>';
  if(d.kind==='x' || av==null){
    // stated, not blank
    return h+'<div class="as-cons-nil">'+(d.kind==='x'
      ? 'The exit multiple is your input — neither the Street nor a model publishes one.'
      : 'No Summit model figure for this driver — no Summit DCF model exists for SN; the grid holds it at Street.')+'</div></div>';
  }
  var gap=av-bv;
  var gapTxt = d.kind==='x' ? ((gap>=0?'+':'−')+Math.abs(gap).toFixed(1)+'×')
                            : ((gap>=0?'+':'−')+Math.abs(gap*100).toFixed(1)+' pp');
  var col = Math.abs(gap) < (d.kind==='x'?0.05:0.0005) ? 'var(--mu)' : (gap>=0?'#2E8B57':'#C0392B');
  return h+
    '<div class="as-cons-v">'+axisLbl(k,av)+'<small>'+esc(baseNameCap())+' '+axisLbl(k,bv)+'</small></div>'+
    '<div class="as-cons-d" style="color:'+col+'">'+gapTxt+' vs '+esc(baseName())+'</div></div>';
}
function renderCons(scope, aX, aY, cell){
  var el=scope.querySelector('#asCons'); if(!el) return;
  var year=_year, r=altCalc(year), live=_px;
  var isCons=(altBase()==='cons');
  var h='<div class="as-cons-h">What '+(isCons?'the Summit model':'Street (Bloomberg consensus)')+' assumes'+
        (isCons && consPlaceholder()?'<span class="as-cons-ph">none for SN</span>':'')+'</div>'+
    '<div class="as-cons-src">'+esc(isCons?consSrcLabel():('Street (Bloomberg consensus) · '+SNAP))+' · '+year+
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
  if(consPlaceholder()){
    h += '<div class="rs-noguide" style="margin-top:10px">⚑ No Summit DCF model exists for SharkNinja, so there is nothing to '+
         'set against Street here. The figures land in this card on their own if one is built — nothing else changes.</div>';
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
        (isCons ? ('  ·  closest cell to '+baseName(altBase())+
          (altBase()==='cons' && consPlaceholder() ? ' (none for SN)' : '')) : '');
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

  var gapTxt = YEARS.map(function(y){ var g=catSum(y)-M[y].rev; return y+' '+fmtB(g)+' ('+signPct(g/M[y].rev)+')'; }).join(' · ');
  scope.querySelector('#asFoot').innerHTML =
    'Every figure is read from Street (Bloomberg consensus) — the Bloomberg (BST) FA_SN company-financials export, '+esc(SNAP)+' snapshot, carried in '+
    'js/results-data/sn.js: FY'+BASE_YEAR+' reported actual, FY2026–FY2029 consensus. There is <b>no Summit DCF model for SN</b>. Inputs: category net sales '+
    '(Cleaning · Cooking &amp; Beverage · Food Preparation · Beauty &amp; Home Environment), GAAP <b>operating income</b>, Adjusted EBITDA, Adjusted net income, '+
    'Adjusted diluted EPS and the effective tax rate. SharkNinja reports <b>one segment</b> and discloses no operating income or EBITDA by category or region, so '+
    'revenue growth moves per category but the margin driver is <b>consolidated</b> operating margin — no category margin is invented. '+
    'D&amp;A + adjustments is derived as Adjusted EBITDA − GAAP operating income and is <b>held fixed</b>, so moving the operating margin moves '+
    'operating income and EBITDA together; it is wider than reported D&amp;A because Adjusted EBITDA also adds back share-based compensation and other items. '+
    'Diluted shares are not in the dataset and are <b>derived</b> as Adjusted net income ÷ Adjusted diluted EPS (FY2026 '+sharesFor(2026).toFixed(1)+'M, against the ~142.5M '+
    'the company guides). A driver on an axis is applied as a <b>flat rate compounded from the '+BASE_YEAR+' actual</b> '+
    '(growth) or as that year\'s margin (margin). <b>EV/EBITDA</b> values EV = Adjusted EBITDA × multiple, less net debt, over shares. <b>P/E</b> flows the '+
    'operating-income delta through tax onto Street\'s own Adjusted net income and applies the multiple to EPS, so the base case reproduces '+
    'Street Adjusted EPS exactly. <b>Reconciliation:</b> the four categories sum exactly to net sales in FY'+BASE_YEAR+' (company-reported), but not in consensus, '+
    'where category estimates come from fewer brokers than the total — '+gapTxt+'. That gap is left OUT rather than plugged: the operating margin applies to the '+
    'category sum, so the EV/EBITDA base sits below Street Adjusted EBITDA by gap × margin. The margin driver is GAAP while EBITDA and earnings are the adjusted '+
    'lines SharkNinja guides and the Street values; the bridge between them is the held D&amp;A + adjustments line. A tax rate or share count missing for a year '+
    'holds the last available value, marked ⚠ (none today). The exit multiple is your input, not a consensus output. Live price via Massive; net debt from the live '+
    'quote where available, else net cash of $61M at Jun 30, 2026 (August 2026 investor presentation). '+
    '<b>Assumptions</b> switches whose figures every driver OFF the two axes is held at: Street (Bloomberg consensus), or a Summit model. '+
    'The card beside the grid always shows <b>the other side</b>, with the two axis drivers substituted and everything else left at the current base, so its price is '+
    'directly comparable to a cell. '+
    (consPlaceholder()
      ? '<b>⚑ No Summit DCF model exists for SN, so the Summit side is empty: selecting it holds every driver at Street and says so in the strip.</b> '
      : '<b>Summit figures read from '+esc(consSrcLabel())+'.</b> ')+
    'Data sourced from Bloomberg (BST) Street consensus.';
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
    sx.onchange=function(){ _x=sx.value; _rx={start:null,step:null}; render(scope); };
    sy.onchange=function(){ _y=sy.value; _ry={start:null,step:null}; render(scope); };

    var mi=scope.querySelector('#asMult');
    mi.oninput=function(){ var v=parseFloat(mi.value); if(!isFinite(v)||v<=0) return;
      if(_basis==='ev') _mEv=v; else _mPe=v;
      if(drv(_x).kind==='x' && _rx.start==null) {} // auto axes follow the new centre
      render(scope); };

    function bindRange(inpId, kind, getK, st){
      var el=scope.querySelector('#'+inpId);
      el.oninput=function(){ var v=parseFloat(el.value); if(!isFinite(v)) return;
        st[kind] = fromInp(getK(), v); render(scope); };
    }
    bindRange('asXs','start',function(){ return _x; }, _rx);
    bindRange('asXd','step', function(){ return _x; }, _rx);
    bindRange('asYs','start',function(){ return _y; }, _ry);
    bindRange('asYd','step', function(){ return _y; }, _ry);
    scope.querySelector('#asXr').onclick=function(){ _rx={start:null,step:null}; render(scope); };
    scope.querySelector('#asYr').onclick=function(){ _ry={start:null,step:null}; render(scope); };

    // live price + net debt (Massive); the grid still renders if this fails.
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('SN') : null; })
      .then(function(res){
        var q = res && res.data ? res.data : res; if(!q) return;
        if(q.price!=null) _px = q.price;
        if(q.netDebt!=null){ _netDebt = q.netDebt/1e6; _ndLive = true; }
        render(scope);
      }).catch(function(){});
  }
  render(scope);
}

export var snSens = { body: sensBody, init: initSens };
