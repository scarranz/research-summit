// overviews/amzn-sensitivity.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Sensitivity Analysis.
//
// Pick any two drivers, hold everything else at the Summit model, and read the implied share
// price off a 5×5 grid. Terminal value is an exit multiple — EV/EBITDA or P/E, your choice.
//
// ── Data ─────────────────────────────────────────────────────────────────────────
// Summit DCF model, instrument AMZN, snapshot 2026-08-04 (latest of 7), $M. Every figure below
// is read straight off the model — nothing is invented:
//   revenue          AMZN:aws · AMZN:usrev · AMZN:intrev          (ties exactly to AMZN:rev)
//   operating income AMZN:opinc3 (AWS) · AMZN:opinc (NA) · AMZN:opinc2 (International)
//   EBITDA           AMZN:aws_ebitda · AMZN:us_ebitda · AMZN:int_ebitda · AMZN:corp_other_ebitda
//   earnings         AMZN:earnings          shares AMZN:shares       tax AMZN:tax_rate
// Segment D&A is derived as segment EBITDA − segment operating income, which is the only
// consistent way to hold depreciation fixed while the operating margin moves.
//
// The model's own operating margins come out as round numbers (2028: AWS 37.0%, North America
// 9.0%, International 4.3%), i.e. these ARE the model's drivers — which is why the axes are
// built on operating margin rather than an EBITDA margin.
//
// ── Reconciliation, stated rather than plugged ───────────────────────────────────
// Sum of the three segment operating incomes vs the model's consolidated OP_INCOME:
//   2025   81,058  vs  79,975   → a 1.4% corporate/unallocated drag
// OP_INCOME is 0 (unpopulated) for 2026-2029, so that drag cannot be tracked forward and is
// NOT applied here. Separately, CORP_OTHER_EBITDA is unpopulated in 2029 and TAX_RATE stops
// after 2028 — both hold the 2028 value, marked ⚠ in the UI. Flagged for the model owner.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SNAP = '2026-08-04';
var BASE_YEAR = 2025;
var YEARS = [2026, 2027, 2028, 2029];
var SHARES = 10827;                       // millions, flat across the model horizon

// rev / op = operating income / eb = EBITDA, all $M straight from the model.
var M = {
  2025:{ aws:{rev:127053, op:44100,  eb:65794},  na:{rev:423912, op:31206, eb:47693}, intl:{rev:158890, op:5752,  eb:10620}, corp:20705, earn:64969,  tax:0.20 },
  2026:{ aws:{rev:173476, op:65881,  eb:107693}, na:{rev:474880, op:37306, eb:56833}, intl:{rev:182768, op:6915,  eb:12735}, corp:18853, earn:92039,  tax:0.16 },
  2027:{ aws:{rev:234193, op:84309,  eb:149526}, na:{rev:519993, op:46799, eb:67248}, intl:{rev:205614, op:8636,  eb:15110}, corp:19823, earn:119053, tax:0.16 },
  2028:{ aws:{rev:292741, op:108314, eb:183363}, na:{rev:571993, op:51479, eb:73567}, intl:{rev:236456, op:10168, eb:17339}, corp:40309, earn:137412, tax:0.20 },
  2029:{ aws:{rev:365926, op:139052, eb:235691}, na:{rev:629192, op:56627, eb:82723}, intl:{rev:271925, op:11965, eb:19797}, corp:null,  earn:169851, tax:null },
};
var OP_INCOME_2025 = 79975;               // model consolidated, for the reconciliation note

var SEGS = [
  { k:'aws',  n:'AWS',           c:'#FF9900' },
  { k:'na',   n:'North America', c:'#146EB4' },
  { k:'intl', n:'International', c:'#2E8B57' },
];

// Axis drivers. `step` is the default grid increment; the user can override start and step.
var DRIVERS = [
  { k:'aws_g',  seg:'aws',  kind:'g', n:'AWS revenue growth',              step:0.02  },
  { k:'aws_m',  seg:'aws',  kind:'m', n:'AWS operating margin',            step:0.02  },
  { k:'na_g',   seg:'na',   kind:'g', n:'North America revenue growth',    step:0.01  },
  { k:'na_m',   seg:'na',   kind:'m', n:'North America operating margin',  step:0.01  },
  { k:'intl_g', seg:'intl', kind:'g', n:'International revenue growth',    step:0.01  },
  { k:'intl_m', seg:'intl', kind:'m', n:'International operating margin',  step:0.005 },
  { k:'mult',   seg:null,   kind:'x', n:'Exit multiple',                   step:1     },
];
function drv(k){ for(var i=0;i<DRIVERS.length;i++) if(DRIVERS[i].k===k) return DRIVERS[i]; return DRIVERS[0]; }

var NCELL = 5;

// ── Street consensus — THE MAP IS REAL, THE NUMBERS ARE NOT ──────────────────────
// What consensus assumes for the two drivers on the axes, shown beside the grid so the matrix can
// be read against someone other than us.
//
// ⚠ The workbook this comes from is not wired yet. Every figure in CONS.v below is INVENTED to
// show the layout — placed a little under the model, which is where the Street usually sits, but
// it is not Street data and the card says so in amber until it is. Nothing else in this file is
// invented (see the header): keep that line clean by replacing these numbers, not by adding more.
//
// The shape IS the mapping, and it is what the sheet has to supply: one value per driver key per
// valuation year. Wiring it up is three things and no UI work —
//   1. fill CONS.v from the sheet (same keys as DRIVERS, same years as YEARS),
//   2. set CONS.src ('Bloomberg consensus', 'Visible Alpha', whatever it is) and CONS.asOf,
//   3. nothing else — the amber placeholder badge disappears on its own once CONS.src is set.
//
// Units match the drivers exactly: growth is a CAGR off the 2025 actual (the same basis the axis
// applies), margin is that year's operating margin, both as fractions.
var CONS = {
  src:  null,        // e.g. 'Bloomberg consensus' — null means "still a placeholder"
  asOf: null,        // e.g. '2026-08-04'
  v: {
    aws_g:  { 2026:0.345, 2027:0.335, 2028:0.300, 2029:0.285 },
    aws_m:  { 2026:0.365, 2027:0.350, 2028:0.355, 2029:0.360 },
    na_g:   { 2026:0.110, 2027:0.100, 2028:0.097, 2029:0.095 },
    na_m:   { 2026:0.075, 2027:0.082, 2028:0.084, 2029:0.086 },
    intl_g: { 2026:0.138, 2027:0.128, 2028:0.130, 2029:0.126 },
    intl_m: { 2026:0.035, 2027:0.038, 2028:0.040, 2029:0.042 },
    // The exit multiple is the reader's own input, not something consensus publishes. Left empty
    // on purpose: it is the null path the sheet will also hit, and it should render as a stated
    // absence rather than as a number nobody chose.
    mult:   {},
  },
};
function consValue(k, year){ var row=CONS.v[k]; var v=row?row[year]:null; return v==null?null:v; }
function consPlaceholder(){ return !CONS.src; }
function consSrcLabel(){ return CONS.src ? (CONS.src + (CONS.asOf?(' · '+CONS.asOf):'')) : 'placeholder'; }
function baseName(b){ return (b||_base)==='cons' ? 'Street consensus' : 'the Summit model'; }
function baseNameCap(b){ return (b||_base)==='cons' ? 'Street consensus' : 'Summit model'; }
function altBase(){ return _base==='summit' ? 'cons' : 'summit'; }

// ── Whose number is this? ────────────────────────────────────────────────────────
// One function decides it for every driver, and everything downstream — the grid's defaults, the
// axis centring, the assumptions strip and the year cards — reads it. Consensus does not cover
// every driver (the exit multiple is nobody's but yours), so a missing figure falls back to the
// model rather than blanking the grid; consFellBack() is what makes that fallback visible instead
// of silent.
function baseValue(k, year){
  if(_base==='cons'){ var c=consValue(k,year); if(c!=null) return c; }
  return modelValue(k, year);
}
function consFellBack(k, year){ return _base==='cons' && consValue(k,year)==null; }
// Segment defaults under the current base. Growth is applied the same way an axis applies it —
// a flat rate compounded off the 2025 actual — so a consensus CAGR and an axis CAGR mean the same
// thing and the base case sits exactly on the grid.
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

// The OTHER side, for the card beside the grid: consensus while you are reading the model, the
// model while you are reading consensus.
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
var _base  = 'summit';    // whose assumptions everything OFF the axes is held at: 'summit' | 'cons'
var _x     = 'aws_g';
var _y     = 'aws_m';
var _basis = 'ev';        // 'ev' = EV/EBITDA · 'pe' = P/E
var _mEv   = 12;          // exit EV/EBITDA
var _mPe   = 30;          // exit P/E
var _netDebt = 0;         // $M, seeded from the live quote (Massive)
var _rx = { start:null, step:null };   // null = auto from the model
var _ry = { start:null, step:null };
var _px = null;           // live share price

function activeMult(){ return _basis==='ev' ? _mEv : _mPe; }
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }

// ── Model reads ──────────────────────────────────────────────────────────────────
function corpFor(year){ return M[year].corp==null ? M[2028].corp : M[year].corp; }
function taxFor(year){ return M[year].tax==null ? M[2028].tax : M[year].tax; }
function heldFlags(year){ return (M[year].corp==null || M[year].tax==null); }
function segDna(seg, year){ return M[year][seg].eb - M[year][seg].op; }
function modelOpMargin(seg, year){ return M[year][seg].op / M[year][seg].rev; }
function modelCagr(seg, year){
  var n = year - BASE_YEAR;
  return Math.pow(M[year][seg].rev / M[BASE_YEAR][seg].rev, 1/n) - 1;
}
function modelOpTotal(year){ var t=0; SEGS.forEach(function(s){ t += M[year][s.k].op; }); return t; }

// The model's own value for a driver — the axis default centres on this.
function modelValue(k, year){
  var d = drv(k);
  if(d.kind==='x') return activeMult();
  return d.kind==='g' ? modelCagr(d.seg, year) : modelOpMargin(d.seg, year);
}
// Axis geometry: start + step, defaulting to "the BASE's value sits in the middle" — so switching
// to consensus re-centres the grid on consensus rather than leaving it around the model.
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
  var parts=[], opTotal=0, ebitda=0;
  SEGS.forEach(function(s){
    var gK=s.k+'_g', mK=s.k+'_m', rev;
    if(over[gK]!=null){                                   // flat rate compounded 2026 → year
      rev = M[BASE_YEAR][s.k].rev;
      for(var y=BASE_YEAR+1; y<=year; y++) rev *= (1 + over[gK]);
    } else rev = baseRev(s.k, year);                      // off the axes: whichever base is selected
    var om = over[mK]!=null ? over[mK] : baseMargin(s.k, year);
    var op = rev * om;
    var dna = segDna(s.k, year);                          // depreciation held at the model
    opTotal += op;
    ebitda  += op + dna;
    parts.push({ k:s.k, n:s.n, c:s.c, rev:rev, om:om, op:op, dna:dna, eb:op+dna });
  });
  ebitda += corpFor(year);
  var tax = taxFor(year);
  // Flow the operating-income delta through tax onto the model's own earnings line, so the
  // base case reproduces AMZN:earnings exactly and only the delta is modelled.
  var earnings = M[year].earn + (opTotal - modelOpTotal(year)) * (1 - tax);
  var mult = over.mult!=null ? over.mult : activeMult();
  var ev, equity, px;
  if(_basis==='ev'){ ev = ebitda*mult; equity = ev - _netDebt; px = equity/SHARES; }
  else             { px = (earnings/SHARES)*mult; equity = px*SHARES; ev = equity + _netDebt; }
  return { parts:parts, corp:corpFor(year), opTotal:opTotal, ebitda:ebitda, earnings:earnings,
           mult:mult, ev:ev, equity:equity, px:px, eps:earnings/SHARES };
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){ var b=v/1000; return (Math.abs(b)>=1000) ? ('$'+(b/1000).toFixed(2)+'T') : ('$'+Math.round(b)+'B'); }
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
    // the grid and the consensus card sit side by side; the card drops under the grid when the
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
    // the consensus cell, ringed on the grid — purple, the same "not model data" colour the
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
           ' title="Every driver off the axes held at the Summit model">Summit model</button>'+
         '<button type="button" class="sens-year'+(_base==='cons'?' active':'')+'" data-asbase="cons"'+
           ' title="Every driver off the axes held at consensus'+(consPlaceholder()?' — placeholder numbers until the workbook is wired':'')+'">'+
           'Street consensus'+(consPlaceholder()?' ⚑':'')+'</button>'+
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
       '<button type="button" class="sens-year as-reset" id="asXr" title="Back to the model-centred range">reset</button>'+
       '</div>';
  h += '<div class="sens-controls-row sens-row-inp">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Y axis ↓</span>'+selHtml('asY', _y)+'</div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">starts at</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYs" type="number" step="0.5"><span class="sens-inp-u" id="asYsU">%</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">step</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="asYd" type="number" step="0.25"><span class="sens-inp-u" id="asYdU">pp</span></span></div>'+
       '<button type="button" class="sens-year as-reset" id="asYr" title="Back to the model-centred range">reset</button>'+
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
       '<div class="ov-fynote">The model untouched, valued at the multiple above. It climbs across years purely because the model compounds — '+
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
    // a consensus run that quietly used model figures for a segment the sheet does not cover
    // would read as consensus; say which lines fell back instead
    var fb = consFellBack(s.k+'_g', year) || consFellBack(s.k+'_m', year);
    return '<span class="sens-assum-i'+(live?' sens-assum-hi':'')+'">'+esc(s.n)+
      ' growth <b>'+pctLbl(baseValue(s.k+'_g',year))+'</b> · op margin <b>'+pctLbl(baseValue(s.k+'_m',year))+'</b>'+
      (live?' <i>(on an axis)</i>':'')+(fb?' <i>(no consensus figure — held at the model)</i>':'')+'</span>';
  }).join('');
  scope.querySelector('#asAssum').innerHTML =
    '<span class="sens-assum-t">Held at '+esc(baseName())+' ('+year+')'+
      (_base==='cons' && consPlaceholder() ? ' ⚑ placeholder' : '')+'</span>'+items+
    // consensus covers the six segment drivers and nothing else — these three stay the model's
    // under either base, and say so rather than inheriting the strip's title
    '<span class="sens-assum-i">Corporate / other EBITDA <b>'+fmtB(corpFor(year))+'</b>'+(M[year].corp==null?' <i>(2029 unpopulated — held at 2028)</i>':(_base==='cons'?' <i>(model)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Tax <b>'+pctLbl(taxFor(year))+'</b>'+(M[year].tax==null?' <i>(held at 2028)</i>':(_base==='cons'?' <i>(model)</i>':''))+'</span>'+
    '<span class="sens-assum-i">Shares <b>'+SHARES.toLocaleString('en-US')+'M</b> <i>(flat in the model)</i></span>'+
    '<span class="sens-assum-i">Net debt <b>'+fmtB(_netDebt)+'</b></span>';
}

// ── The other side, at the right of the grid ─────────────────────────────────────
// Always shows whichever base you are NOT reading: consensus while the grid is on the Summit
// model, the model while the grid is on consensus. One row per axis driver — its figure, the
// current base's figure, and the gap — then the price those two figures imply, computed exactly
// like a cell so it is comparable.
function consRowHtml(role, k, year){
  var d=drv(k), av=altValue(k,year), bv=baseValue(k,year);
  var h='<div class="as-cons-r"><div class="as-cons-k">'+esc(role)+' &nbsp;'+esc(d.n)+'</div>';
  if(d.kind==='x' || av==null){
    // stated, not blank: an empty row here would read as "consensus says nothing" when the truth
    // is that this driver is the reader's own input
    return h+'<div class="as-cons-nil">'+(d.kind==='x'
      ? 'The exit multiple is your input — consensus does not publish one.'
      : 'No consensus figure for this driver; the grid holds it at the model.')+'</div></div>';
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
  var h='<div class="as-cons-h">What '+(isCons?'consensus':'the Summit model')+' assumes'+
        (isCons && consPlaceholder()?'<span class="as-cons-ph">placeholder</span>':'')+'</div>'+
    '<div class="as-cons-src">'+esc(isCons?consSrcLabel():('Summit DCF model · '+SNAP))+' · '+year+
    ' · the two drivers on the axes</div>';
  h += consRowHtml('X →', _x, year);
  h += consRowHtml('Y ↓', _y, year);

  if(r){
    var up = live ? (r.px/live-1) : null;
    // Which drivers consensus actually spoke about. With only one of them covered the price is a
    // hybrid — consensus on that driver, your own input on the other — and the label has to say so
    // rather than claiming "at both".
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
    h += '<div class="rs-noguide" style="margin-top:10px">⚑ The consensus figures are invented, shown to '+
         'fix the layout. They land here from the consensus workbook once it is wired — nothing else changes.</div>';
  }
  el.innerHTML=h;
}

function renderMatrix(scope){
  var year=_year, dX=drv(_x), dY=drv(_y);
  var aX=axis(_x,_rx,year), aY=axis(_y,_ry,year);
  var base=calc(year,{}), live=_px, ref=live||base.px, refIsLive=!!live;

  var rowsY = aY.vals.slice().reverse();      // highest at the top

  // Where the OTHER side lands on this grid. Nearest cell, but only when it is genuinely inside
  // the range — half a step past either end and the ring would be claiming a precision the grid
  // does not have. Null means "off the grid", which the card says out loud.
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
          (altBase()==='cons' && consPlaceholder() ? ' (placeholder)' : '')) : '');
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
    'Every figure is read from the Summit DCF model (snapshot '+SNAP+'): segment revenue (AMZN:aws · usrev · intrev), segment '+
    '<b>operating income</b> (AMZN:opinc3 · opinc · opinc2), segment EBITDA, AMZN:earnings, AMZN:shares and AMZN:tax_rate. '+
    'Segment depreciation is derived as segment EBITDA − segment operating income and is <b>held fixed</b>, so moving an operating margin moves '+
    'operating income and EBITDA together. A driver on an axis is applied as a <b>flat rate compounded from the '+BASE_YEAR+' actual</b> '+
    '(growth) or as that year\'s margin (margin). <b>EV/EBITDA</b> values EV = EBITDA × multiple, less net debt, over shares. <b>P/E</b> flows the '+
    'operating-income delta through tax onto the model\'s own earnings line and applies the multiple to EPS, so the base case reproduces '+
    'AMZN:earnings exactly. <b>Reconciliation:</b> the three segment operating incomes sum to '+fmtB(modelOpTotal(2025))+' in 2025 against the '+
    'model\'s consolidated OP_INCOME of '+fmtB(OP_INCOME_2025)+' — a 1.4% corporate/unallocated drag that is left OUT rather than plugged, because '+
    'OP_INCOME is unpopulated for 2026-2029. Corporate/other EBITDA (2029) and the tax rate (2029) are likewise unpopulated and hold the 2028 value, '+
    'marked ⚠. All three flagged for the model owner. The exit multiple is your input, not a model output. Live price and net debt via Massive. '+
    '<b>Assumptions</b> switches whose figures every driver OFF the two axes is held at: the Summit model, or Street consensus. Consensus covers the '+
    'six segment drivers only — the exit multiple stays your input, and corporate/other EBITDA, tax and shares stay the model\'s, each marked in the '+
    'strip above the grid. Growth is applied identically under both (a flat CAGR off the '+BASE_YEAR+' actual), so a consensus base case sits exactly '+
    'on the grid. The card beside the grid always shows <b>the other side</b> — consensus while you read the model, the model while you read consensus — '+
    'with the two axis drivers substituted and everything else left at the current base, so its price is directly comparable to a cell. '+
    (consPlaceholder()
      ? '<b>⚑ The consensus figures are a layout placeholder: invented, not Street data, badged amber wherever they appear until the consensus '+
        'workbook is wired.</b> '
      : '<b>Consensus read from '+esc(consSrcLabel())+'.</b> ')+
    'Data sourced from Summit DCF models.';
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
    // re-centre with it — leaving them where they were would show a consensus grid framed around
    // the model's numbers.
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
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('AMZN') : null; })
      .then(function(res){
        var q = res && res.data ? res.data : res; if(!q) return;
        if(q.price!=null) _px = q.price;
        if(q.netDebt!=null) _netDebt = q.netDebt/1e6;
        render(scope);
      }).catch(function(){});
  }
  render(scope);
}

export var amznSens = { body: sensBody, init: initSens };
