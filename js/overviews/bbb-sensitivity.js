// overviews/bbb-sensitivity.js — TBBB "Sensitivity" tab.
//
// Two-way valuation-sensitivity matrix: implied Enterprise Value to the two inputs
// the user defines — same-store sales (SSS) and store growth — for a chosen year.
// The user types the base store growth, base SSS and EV/EBITDA multiple; each axis
// then steps ±1pp around the typed base and shows the real rate.
//
//   Valuation (EV) = Adjusted EBITDA(year, scenario) × EV/EBITDA multiple
//
// Adjusted EBITDA build (Ps. millions, Summit DCF snapshot 2026-05-22):
//   • gross margin held flat at 16.2%
//   • operating expenses and revenue-per-new-store kept at the model's per-year logic
//   • Adjusted EBITDA = revenue × 16.2% − operating expenses
//   • store count compounds at the chosen store-growth rate; revenue = comparable
//     (prior-year × (1 + SSS)) + new-store revenue; assumptions applied flat to every
//     year from 2026 to the selected year.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var GM_FIX     = 0.162;   // gross margin, % of revenue
var SALES_PCT  = 0.103;   // sales expenses, % of revenue
var ADMIN_PCT  = 0.027;   // administrative expenses ex-SBC, % of revenue
var ADJ_MARGIN = GM_FIX - SALES_PCT - ADMIN_PCT;          // Adjusted EBITDA margin = 3.2% (SBC added back)
var SBC = { 2026: 2392, 2027: 882, 2028: 216, 2029: 50 };  // stock-based comp (Ps. MM), added back in Adj EBITDA
var FX = 19.5;        // MXN per USD (context only)
var YEARS = [2026, 2027, 2028, 2029];

// Editable state (defaults).
var _year = 2029;
var _sg   = 0.18;     // base store growth
var _sss  = 0.12;     // base SSS
var _mult = 12;       // EV/EBITDA multiple

var BASE = {
  2025: { stores: 3346, rev: 78153.39 },
  2026: { stores: 3976, sss: 0.16, rev: 103159.00, gp: 17039.72, eb: 3051.71 },
  2027: { stores: 4692, sss: 0.12, rev: 131354.88, gp: 21279.49, eb: 3654.07 },
  2028: { stores: 5537, sss: 0.12, rev: 167026.33, gp: 27058.27, eb: 4983.72 },
  2029: { stores: 6478, sss: 0.10, rev: 207545.27, gp: 34037.42, eb: 6801.82 },
};
(function(){
  var prev = BASE[2025];
  YEARS.forEach(function(y){
    var b = BASE[y];
    b.netNew    = b.stores - prev.stores;
    b.revPerNew = (b.rev - prev.rev * (1 + b.sss)) / b.netNew;   // model revenue per net-new store
    prev = b;
  });
})();

// Axis offsets (±1pp steps around the typed base).
var COL_OFF = [-0.02, -0.01, 0, 0.01, 0.02]; // store growth, low → high
var ROW_OFF = [ 0.02,  0.01, 0, -0.01, -0.02]; // SSS, high → low

// Adjusted EBITDA at flat (store growth, SSS) for a target year — compounds 2026→year.
function calc(gStore, gSss, year){
  var rPrev = BASE[2025].rev, sPrev = BASE[2025].stores, out = null;
  for (var i = 0; i < YEARS.length; i++){
    var y = YEARS[i], b = BASE[y];
    var stores = sPrev * (1 + gStore);
    var rev    = rPrev * (1 + gSss) + (stores - sPrev) * b.revPerNew;
    var eb     = rev * ADJ_MARGIN;   // Adjusted EBITDA = revenue × (16.2% − 10.3% − 2.7%)
    rPrev = rev; sPrev = stores;
    if (y === year){ out = { rev: rev, eb: eb, stores: stores }; break; }
  }
  return out;
}

function fmt(v){ return Math.round(v).toLocaleString('en-US'); }
function evB(eb){ return (eb * _mult) / 1000; }
function fmtB(eb){ return evB(eb).toFixed(1); }
function signPct(p){ return (p >= 0 ? '+' : '−') + (Math.abs(p) * 100).toFixed(1) + '%'; }
function pctLbl(v){ var s = v * 100; return (Math.abs(s - Math.round(s)) < 0.05 ? Math.round(s).toString() : s.toFixed(1)) + '%'; }

function lerp(a, b, t){ return Math.round(a + (b - a) * t); }
function colorFor(pct, cap){
  if (cap <= 0) return '#ffffff';
  var t = Math.max(-1, Math.min(1, pct / cap));
  if (t >= 0) return 'rgb(' + lerp(255,168,t) + ',' + lerp(255,205,t) + ',' + lerp(255,160,t) + ')';
  t = -t;            return 'rgb(' + lerp(255,240,t) + ',' + lerp(255,176,t) + ',' + lerp(255,168,t) + ')';
}

// ─── Body ─────────────────────────────────────────────────────────────────────
function sensBody(c){
  var h = '';
  h += '<div class="ov-sec-h ovt-store-h">Valuation sensitivity — SSS × store growth</div>';
  h += '<p class="ov-lede">What is 3B worth under different same-store-sales and store-growth outcomes? Set your <b>base store growth</b>, '+
    '<b>base SSS</b> and <b>EV/EBITDA multiple</b> below — each axis steps ±1 point around your base. Each cell applies the multiple to that scenario\'s '+
    'Adjusted EBITDA (the assumptions below) to give an implied <b>Enterprise Value</b>.</p>';
  h += '<div class="sens-controls-row sens-row-year">'+
    '<div class="sens-ctrl"><span class="sens-ctrl-l">Year</span><div class="sens-years">' + YEARS.map(function(y){
      return '<button type="button" class="sens-year'+(y===_year?' active':'')+'" data-year="'+y+'">'+y+'</button>';
    }).join('') + '</div></div>'+
  '</div>';
  h += '<div class="sens-controls-row sens-row-inp">'+
    '<div class="sens-ctrl"><span class="sens-ctrl-l">Base SSS</span><span class="sens-inp-wrap"><input class="sens-inp" id="sensSSS" type="number" step="0.5" value="'+(_sss*100)+'"><span class="sens-inp-u">%</span></span></div>'+
    '<div class="sens-ctrl"><span class="sens-ctrl-l">Base store growth</span><span class="sens-inp-wrap"><input class="sens-inp" id="sensSG" type="number" step="0.5" value="'+(_sg*100)+'"><span class="sens-inp-u">%</span></span></div>'+
    '<div class="sens-ctrl"><span class="sens-ctrl-l">EV / EBITDA</span><span class="sens-inp-wrap"><input class="sens-inp" id="sensMult" type="number" step="0.5" value="'+_mult+'"><span class="sens-inp-u">×</span></span></div>'+
  '</div>';
  h += '<div class="sens-assum">'+
    '<span class="sens-assum-t">Assumptions held constant</span>'+
    '<span class="sens-assum-i">Gross margin <b>16.2%</b></span>'+
    '<span class="sens-assum-i">Sales expenses <b>10.3%</b> of rev</span>'+
    '<span class="sens-assum-i">Admin. ex-SBC <b>2.7%</b> of rev</span>'+
    '<span class="sens-assum-i sens-assum-hi">→ Adj. EBITDA margin <b>3.2%</b></span>'+
    '<span class="sens-assum-i sens-assum-sbc">SBC added back (Ps. MM): 2026 <b>2,392</b> · 2027 <b>882</b> · 2028 <b>216</b> · 2029 <b>50</b></span>'+
  '</div>';
  h += '<div class="sens-base-sum"></div>';
  h += '<div class="sens-matrix-wrap"></div>';
  h += '<div class="sens-legend"><span>Lower</span><div class="sens-legend-bar"></div><span>Higher</span>'+
    '<span class="sens-legend-n">(implied EV vs. your base case)</span></div>';
  h += '<div class="ov-foot">Implied Enterprise Value = Adjusted EBITDA × your EV/EBITDA multiple. You set the base store growth, base SSS and multiple; '+
    'the matrix steps each axis ±1 point and applies the rates flat to every year from 2026 to the selected year (compounding). '+
    'Adjusted EBITDA = revenue × (16.2% gross margin − 10.3% sales expenses − 2.7% admin ex-SBC) = revenue × 3.2%; stock-based compensation '+
    '(2026 Ps.2,392M · 2027 Ps.882M · 2028 Ps.216M · 2029 Ps.50M) is added back in Adjusted EBITDA. Revenue per new store follows the Summit DCF model\'s per-year values. '+
    'Equity value ≈ EV + net cash (3B is net cash); USD shown at ~'+FX+' MXN/USD for context. Anchored to the Summit DCF model (snapshot May 2026). Data sourced from Summit DCF models.</div>';
  return h;
}

// ─── Matrix render ────────────────────────────────────────────────────────────
function renderMatrix(scope){
  var year = _year;
  var baseEb = calc(_sg, _sss, year).eb;
  var rows = ROW_OFF.map(function(ro){ return COL_OFF.map(function(co){
    var gS = _sg + co, gSss = _sss + ro;
    var r = calc(gS, gSss, year);
    return { eb: r.eb, rev: r.rev, stores: r.stores, pct: r.eb / baseEb - 1, gS: gS, gSss: gSss, co: co, ro: ro };
  }); });
  var cap = 0.0001;
  rows.forEach(function(r){ r.forEach(function(c){ cap = Math.max(cap, Math.abs(c.pct)); }); });

  var h = '<table class="sens-mx"><thead>'+
    '<tr><th class="sens-corner" rowspan="2">Implied EV<br><small>Ps. B · SSS&nbsp;↓ × store&nbsp;growth&nbsp;→</small></th>'+
      '<th class="sens-colcap" colspan="5">Store growth</th></tr>'+
    '<tr>' + COL_OFF.map(function(co){ return '<th>'+pctLbl(_sg + co)+'</th>'; }).join('') + '</tr>'+
  '</thead><tbody>';
  rows.forEach(function(row, ri){
    h += '<tr><th class="sens-rowh">'+pctLbl(_sss + ROW_OFF[ri])+'</th>';
    row.forEach(function(c){
      var isBase = (c.co === 0 && c.ro === 0);
      var ttl = year + ' · SSS ' + pctLbl(c.gSss) + ' · store growth ' + pctLbl(c.gS) +
        ' → EV Ps.' + fmtB(c.eb) + 'B (' + signPct(c.pct) + ' vs base) · Adj EBITDA Ps.' + fmt(c.eb) + 'M @ ' + _mult + '× · ' + fmt(c.stores) + ' stores';
      h += '<td class="sens-cell'+(isBase?' sens-base':'')+'" style="background:'+colorFor(c.pct, cap)+'" title="'+esc(ttl)+'">'+
        '<div class="sens-eb">'+fmtB(c.eb)+'</div>'+
        '<div class="sens-pct">'+(isBase ? 'Base' : signPct(c.pct))+'</div>'+
      '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  scope.querySelector('.sens-matrix-wrap').innerHTML = h;

  scope.querySelector('.sens-base-sum').innerHTML =
    'Base case <b>'+year+'</b>: store growth <b>'+pctLbl(_sg)+'</b> · SSS <b>'+pctLbl(_sss)+'</b> · '+
    'Adj EBITDA <b>Ps.'+fmt(baseEb)+'M</b> × <b>'+_mult+'×</b> → EV <b>Ps.'+fmtB(baseEb)+'B</b> '+
    '<span class="sens-base-gm">(≈ US$'+(evB(baseEb)/FX).toFixed(1)+'B · gross margin held at 16.2%)</span>';
}

function initSens(root){
  var scope = root.querySelector('.ovt-pane[data-ovt="sens"]') || root;
  if (!scope.querySelector('.sens-matrix-wrap')) return;
  renderMatrix(scope);
  scope.querySelectorAll('.sens-year').forEach(function(btn){
    btn.onclick = function(){
      _year = +btn.getAttribute('data-year');
      scope.querySelectorAll('.sens-year').forEach(function(b){ b.classList.toggle('active', b === btn); });
      renderMatrix(scope);
    };
  });
  function bindInput(id, set){
    var el = scope.querySelector('#' + id); if (!el) return;
    el.oninput = function(){ var v = parseFloat(el.value); if (!isNaN(v)){ set(v); renderMatrix(scope); } };
  }
  bindInput('sensSG',   function(v){ _sg  = v / 100; });
  bindInput('sensSSS',  function(v){ _sss = v / 100; });
  bindInput('sensMult', function(v){ _mult = v; });
}

export var bbbSensitivity = { body: sensBody, init: initSens };
