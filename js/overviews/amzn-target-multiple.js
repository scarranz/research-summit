// overviews/amzn-target-multiple.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Target Multiple.
//
// Built around the actual desk workflow: every quarter, when the company reports, the numbers
// get revised and a forward multiple is chosen — BOTH EV/EBITDA and P/E — on FY2027. That gives
// a year-end price target, and the revision records which target was chosen.
//
// So this page reads as a revision log: one row per snapshot, the FY2027 underlying behind it,
// and the year-end target each multiple implies. Hold the multiples constant and everything that
// moves is the model being revised.
//
// ── Data (Summit DCF model, instrument AMZN, model be6d6393, FY2027) ─────────────
// AMZN:ebitda · AMZN:earnings · AMZN:shares, read per snapshot through the revision history.
// Revenue per snapshot is the one series not pulled yet — neither price-target path uses it, so
// it is omitted rather than guessed; it is one more query when wanted.
//
// ── Seven snapshots are NOT seven revisions ──────────────────────────────────────
// 2026-07-30 and 2026-08-03 carry byte-identical FY2027 EBITDA (303,160.67) and earnings
// (109,981.17). 08-03 is a re-parse, not a revision. The table marks each row as one or the
// other by comparing against the previous snapshot, so the revision log shows the ~quarterly
// cadence that actually happened rather than every time the file was ingested.
//
// ── The EBITDA definition break, and why it decides the forward-year roll ────────
// Across 2026-08-03 → 08-04: FY2027 EBITDA +9.8%, earnings +8.2% — comparable, so FY2027 is
// only mildly affected. The same break on FY2028 is EBITDA +38.3% against earnings +6.9%
// (311,084 → 430,088 vs 128,556 → 137,412), taking the implied FY2028 EBITDA margin from 28.8%
// to 39.1%. The redefinition lands almost entirely in the later years, which is exactly what
// makes rolling the forward year to FY2028 a judgement call rather than a routine step: the
// P/E leg rolls cleanly, the EV/EBITDA leg does not. Flagged on the row AND above the table.
//
// ── What the MCP cannot give ─────────────────────────────────────────────────────
// The workbook carries the chosen multiple and the recorded price target from column EM
// rightward on projection_history. An unfiltered pull of that sheet returns exactly 41 mapped
// series (DEFAULT / SEGM / BBG) and none is a multiple or a target — the connector stops well
// before column EM (the 143rd). So in Live the multiples are inputs. Preview shows the layout
// once those columns are ingested, with clearly-marked stand-ins.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var BREAK_ON = '2026-08-04';

// $M / shares in millions, straight from the model's snapshot history (AMZN:rev · ebitda ·
// earnings · shares on projection_history). The forward year rolls: FY2027 is this year's
// working year, FY2028 is next year's. Both are already in the model, so the roll is a toggle,
// not a rebuild — and the two years do NOT tell the same story. See FWD_NOTE below.
var SNAP_DATA = {
  2027: [
    { d:'2025-12-18', rev:909803, ebitda:237442, earn: 99503, sh:10721 },
    { d:'2026-02-10', rev:927372, ebitda:259787, earn: 98612, sh:10827 },
    { d:'2026-05-05', rev:941960, ebitda:261050, earn:108304, sh:10827 },
    { d:'2026-05-13', rev:941960, ebitda:301971, earn:109056, sh:10827 },
    { d:'2026-07-30', rev:943343, ebitda:303161, earn:109981, sh:10827 },
    { d:'2026-08-03', rev:943343, ebitda:303161, earn:109981, sh:10827 },
    { d:'2026-08-04', rev:959800, ebitda:332726, earn:119053, sh:10827 },
  ],
  2028: [
    { d:'2025-12-18', rev:1075129, ebitda:258487, earn:109171, sh:10721 },
    { d:'2026-02-10', rev:1096753, ebitda:278013, earn:109377, sh:10827 },
    { d:'2026-05-05', rev:1115060, ebitda:291994, earn:114955, sh:10827 },
    { d:'2026-05-13', rev:1078691, ebitda:309579, earn:127388, sh:10827 },
    { d:'2026-07-30', rev:1080618, ebitda:311084, earn:128556, sh:10827 },
    { d:'2026-08-03', rev:1080618, ebitda:311084, earn:128556, sh:10827 },
    { d:'2026-08-04', rev:1101190, ebitda:430088, earn:137412, sh:10827 },
  ],
};
var FWD_YEARS = [2027, 2028];
var FWD_YEAR = 2027;                       // current working year; the toggle rewrites this
var SNAPS = SNAP_DATA[FWD_YEAR];
function setFwd(y){ FWD_YEAR=y; SNAPS=SNAP_DATA[y]; }

// ── PEG denominator: the prior year, read from the SAME vintage ──────────────────
// The growth behind a PEG has to come from one snapshot's own view of both years. Taking FY2027
// from the latest file and FY2026 from an older one would mix vintages and manufacture growth
// that nobody ever forecast. So for every snapshot we carry its own prior year.
// FY2028's prior year is FY2027, which the table already holds. FY2027's is FY2026, below —
// only the two profit lines, because those are the only ones a PEG can be built on here.
var SNAP_2026 = [
  { d:'2025-12-18', ebitda:198533, earn:77850 },
  { d:'2026-02-10', ebitda:199877, earn:79983 },
  { d:'2026-05-05', ebitda:208443, earn:85902 },
  { d:'2026-05-13', ebitda:238289, earn:85902 },
  { d:'2026-07-30', ebitda:241903, earn:88963 },
  { d:'2026-08-03', ebitda:241903, earn:88963 },
  { d:'2026-08-04', ebitda:250687, earn:92039 },
];
function priorOf(y){ return y===2028 ? SNAP_DATA[2027] : SNAP_2026; }

// The EBITDA redefinition of 2026-08-04 lands very differently on the two years, and that is the
// single thing to know before rolling forward. On FY2027 it is survivable; on FY2028 it is not:
// EBITDA +38.3% against earnings +6.9% in one day, which takes the implied EBITDA margin from
// 28.8% to 39.1%. No forecast revision moves a margin ten points overnight — that is a change in
// what the line MEANS, so an FY2028 EV/EBITDA target computed on 08-04 is not comparable with one
// computed on 07-30. The P/E leg is unaffected, which is why the two legs diverge so hard there.
var FWD_NOTE = {
  2027: null,
  2028: 'On FY2028 the 2026-08-04 EBITDA redefinition is severe: EBITDA <b>+38.3%</b> against earnings '+
        '<b>+6.9%</b> in a single day, taking the implied EBITDA margin from <b>28.8%</b> to <b>39.1%</b>. '+
        'A ten-point margin jump overnight is a change in definition, not in forecast. Treat the '+
        'EV/EBITDA leg as <b>not comparable</b> across that break — the P/E leg is unaffected.',
};

// Classify each row by what actually moved. Revenue and profitability move independently, and the
// classification is year-specific: 2026-05-13 left FY2027 revenue untouched (a pure margin re-cut)
// but CUT FY2028 revenue by 3.3% while lifting its EBITDA — same revision, different character.
function kindOf(i){
  if(i===0) return { rev:true, prof:true, label:'first vintage', cls:'rev' };
  var a=SNAPS[i], b=SNAPS[i-1];
  var rMoved = (a.rev !== b.rev);
  var pMoved = (a.ebitda !== b.ebitda || a.earn !== b.earn || a.sh !== b.sh);
  if(!rMoved && !pMoved) return { rev:false, prof:false, label:'re-parse', cls:'rep' };
  if(rMoved && !pMoved)  return { rev:true, prof:false, label:'top line only', cls:'rev' };
  if(!rMoved && pMoved)  return { rev:false, prof:true,  label:'margins only', cls:'rev' };
  return { rev:true, prof:true, label:'revision', cls:'rev' };
}
function isRevision(i){ var k=kindOf(i); return k.rev || k.prof; }

// Illustrative only — the paths the recorded multiples might have taken. NOT model data.
var MOCK_EV = [16.0, 15.5, 15.0, 14.5, 14.0, 14.0, 13.5];
var MOCK_PE = [34, 33, 32, 31, 30, 30, 29];

// ── State ────────────────────────────────────────────────────────────────────────
var _mode = 'preview';    // opens on Recorded multiple (the first toggle)
var _view = 'table';      // 'table' | 'chart'
var _cm   = 'pt';         // chart metric: 'pt' targets · 'delta' move per revision
var _mEv  = 14;
var _mPe  = 32;
var _pegB = 'pe';         // PEG basis: 'pe' earnings · 'ev' EBITDA. Picks BOTH the numerator
                          // (that leg's multiple) and the denominator (that same line's growth).
var _pegView = 'table';   // the PEG block has its own view toggle, independent of the log above
var _pegChart = null;
var _netDebt = 0;
var _px = null;
var _chart = null;

// ── Maths ────────────────────────────────────────────────────────────────────────
function eps(s){ return s.earn / s.sh; }
function ptEv(s, m){ return (s.ebitda * (m==null?_mEv:m) - _netDebt) / s.sh; }
function ptPe(s, m){ return eps(s) * (m==null?_mPe:m); }

// Mode-aware targets. In Live both legs use the single multiple you type, so the multiple is a
// constant and only the model moves. In Recorded multiple each snapshot carries its OWN multiple,
// so the target moves for both reasons at once — which is the whole point of storing it.
// The chart reads through these, which is why it works in both modes.
function evAt(s,i){ return _mode==='preview' ? ptEv(s, MOCK_EV[i]) : ptEv(s); }
function peAt(s,i){ return _mode==='preview' ? ptPe(s, MOCK_PE[i]) : ptPe(s); }
function recAt(s,i){ return (evAt(s,i)+peAt(s,i))/2; }   // the recorded target: midpoint of the two legs

// ── PEG ──────────────────────────────────────────────────────────────────────────
// PEG = the multiple you chose ÷ the growth of the very line that multiple is priced off,
// in percentage points. Basis 'pe' → P/E over earnings growth; 'ev' → EV/EBITDA over EBITDA
// growth. Both legs of the ratio move with the basis, so the two are never mixed.
// The multiple is mode-aware for the same reason the targets are: in Recorded multiple each
// snapshot carries its own, so its PEG re-rates over time even when growth is flat.
var PEG_KEY = { pe:'earn', ev:'ebitda' };
function pegMult(i){
  if(_pegB==='ev') return _mode==='preview' ? MOCK_EV[i] : _mEv;
  return _mode==='preview' ? MOCK_PE[i] : _mPe;
}
function pegGrowth(i){
  var pri=priorOf(FWD_YEAR)[i]; if(!pri) return null;
  var k=PEG_KEY[_pegB], a=SNAPS[i][k], b=pri[k];
  if(a==null || !b) return null;
  return a/b - 1;
}
// Negative or zero growth makes PEG meaningless rather than merely large — a shrinking
// denominator flips the sign and the ratio stops meaning "years of growth you are paying for".
// Return null and let the cell show why, instead of printing a confident nonsense number.
function pegAt(i){
  var g=pegGrowth(i); if(g==null || g<=0) return null;
  return pegMult(i)/(g*100);
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){ var b=v/1000; return (Math.abs(b)>=1000)?('$'+(b/1000).toFixed(2)+'T'):('$'+Math.round(b)+'B'); }
function fmtPx(v){ return '$'+Math.round(v).toLocaleString('en-US'); }
function signPct(p){ return (p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'; }
function pctCell(p){ return p==null?'<span style="color:var(--mu)">—</span>'
  :'<span style="color:'+(p>=0?'#2E8B57':'#C0392B')+'">'+signPct(p)+'</span>'; }

// Under 1.0 reads cheap against its own growth, over 2.0 dear.
function pegColor(p){ return p<1 ? '#2E8B57' : (p>2 ? '#C0392B' : 'var(--navy)'); }
// The line the chosen basis is priced off, named for the column headers.
function pegLineLabel(){ return _pegB==='ev' ? 'EBITDA' : 'Earnings'; }

// ── Body ─────────────────────────────────────────────────────────────────────────
function tmBody(){
  var h = '';
  h += '<style>'+
    '.ovt-subpane[data-ovst="targetmult"] .sens-ctrl-l{min-width:0}'+
    '.ovt-subpane[data-ovst="targetmult"] .sens-ctrl{margin:0;gap:8px}'+
    '.tm-tbl{border-collapse:collapse;width:100%;font-size:12px;margin:4px 0}'+
    '.tm-tbl th,.tm-tbl td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.tm-tbl th:first-child,.tm-tbl td:first-child{text-align:left}'+
    '.tm-tbl thead th{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.tm-tbl tbody tr.tm-last{background:rgba(255,153,0,.07)}'+
    '.tm-tbl tbody tr.tm-rep{background:#FAFBFC;color:var(--mu)}'+
    '.tm-tbl td.tm-pt{font-weight:800;color:var(--navy)}'+
    '.tm-tag{display:inline-block;font-size:8.5px;font-weight:800;border-radius:20px;padding:1px 7px;margin-left:6px;vertical-align:1px}'+
    '.tm-tag-rev{color:#2E8B57;border:1px solid #2E8B57}'+
    '.tm-tag-rep{color:var(--mu);border:1px solid var(--bdr)}'+
    '.tm-tag-brk{color:#C0392B;border:1px solid #C0392B}'+
    '.tm-warn{border:1px solid rgba(192,57,43,.35);border-left:4px solid #C0392B;background:rgba(192,57,43,.05);'+
      'border-radius:9px;padding:11px 14px;font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    '.tm-ph{color:#8E44AD;font-weight:800;border-bottom:1px dashed #8E44AD}'+
    // the PEG column is the output of the row — shaded so the eye lands on it, not on the inputs
    '.tm-tbl th.peg-out,.tm-tbl td.peg-out{background:#F1F3F5;font-weight:800}'+
    '.tm-tbl tbody tr.tm-rep td.peg-out{background:#EDEFF1}'+
    '</style>';

  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Mode</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-tmmode="preview">Recorded multiple</button>'+
         '<button type="button" class="sens-year" data-tmmode="live">Live</button>'+
       '</div></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Forward year</span><div class="sens-years">'+
         FWD_YEARS.map(function(y){ return '<button type="button" class="sens-year" data-tmfy="'+y+'">FY'+y+'</button>'; }).join('')+
       '</div></div></div>';

  h += '<div class="sens-controls-row sens-row-inp" id="tmLiveCtrls">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="tmEvL">EV/EBITDA '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmEv" type="number" step="0.5" value="'+_mEv+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="tmPeL">P/E '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmPe" type="number" step="0.5" value="'+_mPe+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Net debt</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmNd" type="number" step="1000" value="'+_netDebt+'"><span class="sens-inp-u">$M</span></span></div>'+
       '</div>';


  h += '<div class="sens-controls-row sens-row-year" style="margin-top:4px">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">View</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-tmview="table">Table</button>'+
         '<button type="button" class="sens-year" data-tmview="chart">Chart</button>'+
       '</div></div>'+
       '<div class="sens-ctrl tm-cmwrap"><span class="sens-ctrl-l">Show</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-tmcm="pt">Price targets</button>'+
         '<button type="button" class="sens-year" data-tmcm="delta">Move per revision</button>'+
       '</div></div>'+
       '</div>';

  h += '<div id="tmFwdWarn"></div>';
  h += '<div class="dfin-wrap" id="tmTable"></div>';
  h += '<div id="tmChartWrap" style="height:340px;position:relative" hidden><canvas id="tmChart"></canvas></div>';
  h += '<div class="dd-note" id="tmChartNote" hidden></div>';
  h += '<div class="ov-foot" id="tmFoot"></div>';

  // ── PEG, as its own block ──────────────────────────────────────────────────────
  // Same shape as the log above — its own basis + view toggles, its own table and chart — because
  // the PEG asks a different question from the target. The target is "what is this worth"; the PEG
  // is "how much growth am I paying for", and it needs the two years side by side to show its work.
  h += '<div class="ov-sec" style="margin-top:20px"><div class="ov-sec-h">PEG</div>';
  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">PEG on</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-tmpeg="pe">P/E ÷ earnings growth</button>'+
         '<button type="button" class="sens-year" data-tmpeg="ev">EV/EBITDA ÷ EBITDA growth</button>'+
       '</div></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">View</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-pegview="table">Table</button>'+
         '<button type="button" class="sens-year" data-pegview="chart">Chart</button>'+
       '</div></div>'+
       '</div>';
  h += '<div class="dfin-wrap" id="pegTable"></div>';
  h += '<div id="pegChartWrap" style="height:320px;position:relative" hidden><canvas id="pegChart"></canvas></div>';
  h += '<div class="dd-note" id="pegNote"></div>';
  h += '</div>';
  return h;
}

// ── Chart ────────────────────────────────────────────────────────────────────────
var C_EV='#146EB4', C_PE='#FF9900';
var C_REC='#8E44AD';   // recorded target — purple, matching the placeholder columns in the table
var C_PEG='#5B6B7C';   // PEG — slate, deliberately not a target colour: it is a different question
function buildChart(scope){
  var cv=scope.querySelector('#tmChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(_chart){ try{ _chart.destroy(); }catch(e){} _chart=null; }
  var labels=SNAPS.map(function(s){ return s.d.slice(2); });   // yy-mm-dd
  // a re-parse is drawn hollow, the EBITDA redefinition ringed in red
  var ptStyle=function(){ return SNAPS.map(function(s,i){ return isRevision(i)?4.5:3; }); };
  var ptBorder=function(base){ return SNAPS.map(function(s){ return s.d===BREAK_ON?'#C0392B':base; }); };
  var ptFill=function(base){ return SNAPS.map(function(s,i){ return isRevision(i)?base:'#fff'; }); };
  var ds, yFmt, note;
  var rec = (_mode==='preview');

  // Which revision pulled the two legs apart hardest. Hardcoding 2026-05-13 was only right for
  // FY2027 — on FY2028 that revision cut revenue and lifted earnings more than EBITDA, so the
  // divergence lands elsewhere. Compute it instead of asserting it.
  var worst=null;
  SNAPS.forEach(function(s,i){
    if(i===0) return;
    var a=(evAt(s,i)/evAt(SNAPS[i-1],i-1)-1), b=(peAt(s,i)/peAt(SNAPS[i-1],i-1)-1);
    if(!worst || Math.abs(a-b)>Math.abs(worst.a-worst.b)) worst={ d:s.d, a:a, b:b };
  });

  if(_cm==='pt'){
    ds=[
      { label:(rec?'EV/EBITDA leg':_mEv+'× EV/EBITDA'), data:SNAPS.map(evAt), borderColor:C_EV,
        backgroundColor:C_EV, borderWidth:2.4, tension:.25, fill:false,
        pointRadius:ptStyle(), pointBackgroundColor:ptFill(C_EV), pointBorderColor:ptBorder(C_EV), pointBorderWidth:2 },
      { label:(rec?'P/E leg':_mPe+'× P/E'), data:SNAPS.map(peAt), borderColor:C_PE,
        backgroundColor:C_PE, borderWidth:2.4, tension:.25, fill:false,
        pointRadius:ptStyle(), pointBackgroundColor:ptFill(C_PE), pointBorderColor:ptBorder(C_PE), pointBorderWidth:2 },
    ];
    // In Recorded multiple the headline number is the midpoint, so plot it — it is the column the table leads with.
    if(rec) ds.push({ label:'Recorded target', data:SNAPS.map(recAt), borderColor:C_REC, backgroundColor:C_REC,
      borderWidth:3, tension:.25, fill:false, pointRadius:ptStyle(), pointBackgroundColor:ptFill(C_REC),
      pointBorderColor:ptBorder(C_REC), pointBorderWidth:2 });
    if(_px!=null) ds.push({ label:'Live price', data:SNAPS.map(function(){ return _px; }), borderColor:'#8A93A0',
      borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false });
    yFmt=function(v){ return '$'+Math.round(v); };
    note='Each point is one snapshot. <b>Hollow points are re-parses</b> (nothing moved); the red-ringed point is the 2026-08-04 EBITDA redefinition. '+
      (rec ? 'Each snapshot carries its own multiple here, so the lines move for <b>two</b> reasons at once — the model being revised and the multiple '+
             'being stepped down (EV/EBITDA '+MOCK_EV[0]+'× → '+MOCK_EV[MOCK_EV.length-1]+'×, P/E '+MOCK_PE[0]+'× → '+MOCK_PE[MOCK_PE.length-1]+'×). '+
             'The <b>recorded target</b> is the midpoint of the two legs. Those multiple paths are illustrative, not model data.'
          : 'The gap between the two lines is the disagreement between the methods at your multiples'+
             (worst ? ', which widens most at <b>'+esc(worst.d)+'</b>' : '')+'. The multiple is held constant, so everything that moves is the model.');
  } else {
    var step=function(fn){ return SNAPS.map(function(s,i){
      return i===0 ? null : (fn(s,i)/fn(SNAPS[i-1],i-1)-1)*100; }); };
    ds=[
      { label:(rec?'EV/EBITDA leg':'EV/EBITDA target'), data:step(evAt), backgroundColor:C_EV, borderRadius:2, maxBarThickness:26 },
      { label:(rec?'P/E leg':'P/E target'),             data:step(peAt), backgroundColor:C_PE, borderRadius:2, maxBarThickness:26 },
    ];
    if(rec) ds.push({ label:'Recorded target', data:step(recAt), backgroundColor:C_REC, borderRadius:2, maxBarThickness:26 });
    yFmt=function(v){ return v+'%'; };
    note='How much each revision moved the target. The two legs diverge whenever a revision hits EBITDA and earnings by different amounts'+
      (worst ? ' — widest at <b>'+esc(worst.d)+'</b>, where the EV/EBITDA leg moved <b>'+signPct(worst.a)+'</b> against <b>'+signPct(worst.b)+'</b> on P/E' : '')+'.'+
      (rec ? ' Here the stepping-down multiple drags every bar lower than the model alone would put it — that drag is exactly what the recorded '+
             'multiple lets you separate out.' : '');
  }

  _chart=new Chart(cv.getContext('2d'),{
    type:(_cm==='delta')?'bar':'line',
    data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ var v=ctx.parsed.y; if(v==null) return ctx.dataset.label+': —';
          return ctx.dataset.label+': '+(_cm==='pt'?('$'+v.toFixed(0)):((v>=0?'+':'')+v.toFixed(1)+'%')); },
          title:function(items){ var i=items[0].dataIndex; return SNAPS[i].d+(isRevision(i)?'':'  (re-parse)'); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:yFmt } } } }
  });
  var n=scope.querySelector('#tmChartNote'); if(n) n.innerHTML=note;
}

// ── Live render ──────────────────────────────────────────────────────────────────
function renderLive(scope){
  var rows='', prevEv=null, prevPe=null;
  SNAPS.forEach(function(s,i){
    var k=kindOf(i), rev=isRevision(i);
    var pe_=ptPe(s), ev_=ptEv(s);
    var dEv=(prevEv!=null)?(ev_/prevEv-1):null, dPe=(prevPe!=null)?(pe_/prevPe-1):null;
    var brk=(s.d===BREAK_ON);
    var cls=(i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"');
    var revFlat = (i>0 && s.rev===SNAPS[i-1].rev);
    rows+='<tr'+cls+'>'+
      '<td><b>'+esc(s.d)+'</b>'+
        '<span class="tm-tag tm-tag-'+k.cls+'">'+esc(k.label)+'</span>'+
        (brk?'<span class="tm-tag tm-tag-brk">EBITDA redefined</span>':'')+'</td>'+
      '<td'+(revFlat?' style="color:var(--mu)"':'')+'>'+fmtB(s.rev)+'</td>'+
      '<td>'+fmtB(s.ebitda)+'</td>'+
      '<td>'+fmtB(s.earn)+'</td>'+
      '<td>$'+eps(s).toFixed(2)+'</td>'+
      '<td class="tm-pt">'+fmtPx(ev_)+'</td>'+
      '<td>'+pctCell(dEv)+'</td>'+
      '<td class="tm-pt">'+fmtPx(pe_)+'</td>'+
      '<td>'+pctCell(dPe)+'</td>'+
      '<td>'+signPct(ev_/pe_-1)+'</td>'+
      '</tr>';
    prevEv=ev_; prevPe=pe_;
  });
  scope.querySelector('#tmTable').innerHTML=
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th><th>Revenue '+FWD_YEAR+'</th><th>EBITDA '+FWD_YEAR+'</th><th>Earnings '+FWD_YEAR+'</th><th>EPS</th>'+
      '<th>Target @ '+_mEv+'× EV/EBITDA</th><th>Δ</th>'+
      '<th>Target @ '+_mPe+'× P/E</th><th>Δ</th><th>EV vs P/E</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';

  var f=SNAPS[0], l=SNAPS[SNAPS.length-1];
  scope.querySelector('#tmFoot').innerHTML=
    'FY'+FWD_YEAR+' EBITDA, earnings and share count per snapshot from the Summit DCF model (instrument AMZN, model be6d6393), read through the '+
    'revision history. <b>Year-end target</b> = EBITDA × your EV/EBITDA multiple less net debt over shares, and EPS × your P/E multiple — both '+
    'multiples shown side by side because the desk sets both. <b>EV vs P/E</b> is the spread between the two targets, which is the disagreement '+
    'between the two methods at your chosen multiples. Share count is the model\'s own and moves (10,721 in the first vintage, 10,827 after). '+
    'Net debt is '+fmtB(_netDebt)+', from the live quote. Revenue is shown for context — neither target path uses it — and is greyed when unchanged from the prior row. '+
    'At the multiples above the '+FWD_YEAR+' target moved '+signPct(ptEv(l)/ptEv(f)-1)+' on EV/EBITDA and '+signPct(ptPe(l)/ptPe(f)-1)+' on P/E across the log. '+
    'The multiples are your input: the recorded ones live past column EM on projection_history and the connector does not reach them. '+
    'Data sourced from Summit DCF models.';
}

// ── Preview render ───────────────────────────────────────────────────────────────
function renderPreview(scope){
  var ph=function(t){ return '<span class="tm-ph">'+t+'</span>'; };
  var rows='', prev=null;
  SNAPS.forEach(function(s,i){
    var k=kindOf(i), rev=isRevision(i);
    var mev=MOCK_EV[i], mpe=MOCK_PE[i];
    var pev=ptEv(s,mev), ppe=ptPe(s,mpe), rec=(pev+ppe)/2;   // "recorded" target, illustrative
    var d=(prev!=null)?(rec/prev-1):null;
    rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
      '<td><b>'+esc(s.d)+'</b><span class="tm-tag tm-tag-'+k.cls+'">'+esc(k.label)+'</span></td>'+
      '<td>'+fmtB(s.rev)+'</td><td>'+fmtB(s.ebitda)+'</td><td>'+fmtB(s.earn)+'</td><td>$'+eps(s).toFixed(2)+'</td>'+
      '<td>'+ph(mev.toFixed(1)+'×')+'</td><td>'+ph(mpe.toFixed(0)+'×')+'</td>'+
      '<td class="tm-pt">'+ph(fmtPx(rec))+'</td><td>'+pctCell(d)+'</td>'+
      '</tr>';
    prev=rec;
  });

  var e0=eps(SNAPS[0]), e1=eps(SNAPS[SNAPS.length-1]);
  var m0=MOCK_PE[0], m1=MOCK_PE[MOCK_PE.length-1];
  var fund=(e1-e0)*m0, mult=(m1-m0)*e0;

  scope.querySelector('#tmTable').innerHTML=
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th><th>Revenue '+FWD_YEAR+'</th><th>EBITDA '+FWD_YEAR+'</th><th>Earnings '+FWD_YEAR+'</th><th>EPS</th>'+
      '<th>EV/EBITDA chosen</th><th>P/E chosen</th><th>Recorded year-end target</th><th>Δ</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';

  scope.querySelector('#tmFoot').innerHTML=
    '<b>What the recorded multiple unlocks.</b> With the chosen multiple stored beside the target, the move in the target splits into the part that '+
    'came from <b>revising the business</b> and the part that came from <b>changing what you pay for it</b>. '+
    'On the illustrative path EPS goes $'+e0.toFixed(2)+' to $'+e1.toFixed(2)+', worth <b>+$'+fund.toFixed(0)+'</b> at the original multiple, while the '+
    'multiple goes '+m0+'× to '+m1+'×, worth <b>−$'+Math.abs(mult).toFixed(0)+'</b>. That decomposition is the thing you cannot get today, because only '+
    'the underlying is readable. <b>To make it real:</b> the connector ingests projection_history past column EM, or drop the workbook where I can read it '+
    '(the xlsx parser from the AppLovin build handles it) — one file per revision for the history, otherwise the latest gives the current row only. '+
    'Underlying: Summit DCF model, instrument AMZN, model be6d6393, FY'+FWD_YEAR+'. Data sourced from Summit DCF models.';
}

// ── PEG block ────────────────────────────────────────────────────────────────────
// Shows its own arithmetic: the multiple, both years of the line it is priced off, the growth
// between them, and the ratio. Every figure on the row comes from ONE snapshot, so the growth is
// what that vintage actually forecast rather than something assembled across files.
function renderPegTable(scope){
  var k=PEG_KEY[_pegB], y0=FWD_YEAR-1, prior=priorOf(FWD_YEAR);
  var rows='';
  SNAPS.forEach(function(s,i){
    var kd=kindOf(i), rev=isRevision(i);
    var pri=prior[i], g=pegGrowth(i), p=pegAt(i), m=pegMult(i);
    var cell = (p==null)
      ? '<span style="color:var(--mu)" title="'+esc(g==null ? 'no prior-year figure in this vintage'
          : 'growth is '+signPct(g)+' — PEG is undefined when growth is not positive')+'">—</span>'
      : '<span style="color:'+pegColor(p)+'">'+p.toFixed(2)+'</span>';
    rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
      '<td><b>'+esc(s.d)+'</b><span class="tm-tag tm-tag-'+kd.cls+'">'+esc(kd.label)+'</span></td>'+
      '<td>'+m.toFixed(1)+'×</td>'+
      '<td>'+(pri&&pri[k]!=null?fmtB(pri[k]):'—')+'</td>'+
      '<td>'+fmtB(SNAPS[i][k])+'</td>'+
      '<td>'+pctCell(g)+'</td>'+
      '<td class="peg-out">'+cell+'</td>'+
      '</tr>';
  });
  scope.querySelector('#pegTable').innerHTML=
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th>'+
      '<th>'+(_pegB==='ev'?'EV/EBITDA':'P/E')+' multiple</th>'+
      '<th>'+esc(pegLineLabel())+' '+y0+'</th>'+
      '<th>'+esc(pegLineLabel())+' '+FWD_YEAR+'</th>'+
      '<th>Growth</th>'+
      '<th class="peg-out">PEG</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';
}

function buildPegChart(scope){
  var cv=scope.querySelector('#pegChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(_pegChart){ try{ _pegChart.destroy(); }catch(e){} _pegChart=null; }
  var data=SNAPS.map(function(s,i){ return pegAt(i); });
  _pegChart=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:SNAPS.map(function(s){ return s.d.slice(2); }),
      datasets:[{ label:'PEG ('+(_pegB==='ev'?'EV/EBITDA':'P/E')+')', data:data,
        borderColor:C_PEG, backgroundColor:C_PEG, borderWidth:2.6, tension:.25, fill:false,
        spanGaps:true,
        pointRadius:SNAPS.map(function(s,i){ return isRevision(i)?4.5:3; }),
        pointBackgroundColor:SNAPS.map(function(s,i){ return isRevision(i)?C_PEG:'#fff'; }),
        pointBorderColor:SNAPS.map(function(s){ return s.d===BREAK_ON?'#C0392B':C_PEG; }),
        pointBorderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{
          label:function(ctx){ var v=ctx.parsed.y, i=ctx.dataIndex, g=pegGrowth(i);
            return v==null ? 'PEG: — (growth not positive)'
              : 'PEG '+v.toFixed(2)+'  ·  '+pegMult(i).toFixed(1)+'× ÷ '+(g*100).toFixed(1)+'%'; },
          title:function(items){ var i=items[0].dataIndex; return SNAPS[i].d+(isRevision(i)?'':'  (re-parse)'); } } } },
      scales:{ x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 },
          callback:function(v){ return v.toFixed(1); } } } } }
  });
}

function renderPeg(scope){
  var chart=(_pegView==='chart');
  if(chart) requestAnimationFrame(function(){ buildPegChart(scope); });
  else { renderPegTable(scope); if(_pegChart){ try{ _pegChart.destroy(); }catch(e){} _pegChart=null; } }
  var t=scope.querySelector('#pegTable'), c=scope.querySelector('#pegChartWrap');
  if(t) t.hidden=chart;
  if(c) c.hidden=!chart;

  // Only the data-integrity flag survives here. It is not commentary: on this one combination the
  // denominator is inflated by the redefinition, so the ratio flatters and the reader has no way
  // to see that from the numbers alone.
  var n=scope.querySelector('#pegNote');
  if(n) n.innerHTML = (FWD_YEAR===2028 && _pegB==='ev')
    ? '<b>On FY2028 this basis inherits the 2026-08-04 EBITDA redefinition through its denominator</b>, which inflates '+
      'growth and flatters the ratio. The PEG does not repair that break.'
    : '';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
  // every toggle derives from state, so the buttons can never disagree with the content
  scope.querySelectorAll('[data-tmmode]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmmode')===_mode); });
  scope.querySelectorAll('[data-tmview]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmview')===_view); });
  scope.querySelectorAll('[data-tmcm]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmcm')===_cm); });
  scope.querySelectorAll('[data-tmfy]').forEach(function(b){
    b.classList.toggle('active', +b.getAttribute('data-tmfy')===FWD_YEAR); });
  scope.querySelectorAll('[data-tmpeg]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmpeg')===_pegB); });
  scope.querySelectorAll('[data-pegview]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-pegview')===_pegView); });

  // the multiple labels name the forward year, so they follow the toggle
  var el=scope.querySelector('#tmEvL'); if(el) el.textContent='EV/EBITDA '+FWD_YEAR;
  el=scope.querySelector('#tmPeL');     if(el) el.textContent='P/E '+FWD_YEAR;
  el=scope.querySelector('#tmFwdWarn');
  if(el) el.innerHTML = FWD_NOTE[FWD_YEAR] ? '<div class="tm-warn">'+FWD_NOTE[FWD_YEAR]+'</div>' : '';

  var lc=scope.querySelector('#tmLiveCtrls');
  if(lc) lc.style.display=(_mode==='preview')?'none':'';
  var cmw=scope.querySelector('.tm-cmwrap');
  if(cmw) cmw.style.display=(_view==='chart')?'':'none';

  if(_mode==='preview') renderPreview(scope); else renderLive(scope);

  // The chart works in both modes — evAt/peAt resolve the multiple from the mode.
  var showChart=(_view==='chart');
  var tw=scope.querySelector('#tmTable'), cw=scope.querySelector('#tmChartWrap'), cn=scope.querySelector('#tmChartNote');
  if(tw) tw.hidden=showChart;
  if(cw) cw.hidden=!showChart;
  if(cn) cn.hidden=!showChart;
  if(showChart) requestAnimationFrame(function(){ buildChart(scope); });
  else if(_chart){ try{ _chart.destroy(); }catch(e){} _chart=null; }

  renderPeg(scope);
}

// ── Init ─────────────────────────────────────────────────────────────────────────
function initTm(root){
  var scope=root.querySelector('.ovt-subpane[data-ovst="targetmult"]');
  if(!scope || !scope.querySelector('#tmTable')) return;
  if(!scope._wired){
    scope._wired=true;
    scope.querySelectorAll('[data-tmmode]').forEach(function(b){ b.onclick=function(){
      _mode=b.getAttribute('data-tmmode'); render(scope); }; });
    scope.querySelectorAll('[data-tmview]').forEach(function(b){ b.onclick=function(){
      _view=b.getAttribute('data-tmview'); render(scope); }; });
    scope.querySelectorAll('[data-tmcm]').forEach(function(b){ b.onclick=function(){
      _cm=b.getAttribute('data-tmcm'); render(scope); }; });
    scope.querySelectorAll('[data-tmfy]').forEach(function(b){ b.onclick=function(){
      setFwd(+b.getAttribute('data-tmfy')); render(scope); }; });
    scope.querySelectorAll('[data-tmpeg]').forEach(function(b){ b.onclick=function(){
      _pegB=b.getAttribute('data-tmpeg'); render(scope); }; });
    scope.querySelectorAll('[data-pegview]').forEach(function(b){ b.onclick=function(){
      _pegView=b.getAttribute('data-pegview'); render(scope); }; });
    function bind(id, set){ var el=scope.querySelector('#'+id);
      el.oninput=function(){ var v=parseFloat(el.value); if(isFinite(v)) { set(v); render(scope); } }; }
    bind('tmEv', function(v){ if(v>0) _mEv=v; });
    bind('tmPe', function(v){ if(v>0) _mPe=v; });
    bind('tmNd', function(v){ _netDebt=v; });
    import('../api.js').then(function(m){ return m && m.liveQuote ? m.liveQuote('AMZN') : null; })
      .then(function(res){ var q=res&&res.data?res.data:res; if(!q) return;
        if(q.price!=null) _px=q.price;
        if(q.netDebt!=null){ _netDebt=q.netDebt/1e6; var nd=scope.querySelector('#tmNd'); if(nd) nd.value=Math.round(_netDebt); }
        render(scope); }).catch(function(){});
  }
  render(scope);
}

export var amznTargetMult = { body: tmBody, init: initTm };
