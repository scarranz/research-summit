// overviews/amzn-target-multiple.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Target Multiple / PEG.
//
// Built around the actual desk workflow: every quarter, when the company reports, the numbers
// get revised and a forward multiple is chosen — BOTH EV/EBITDA and P/E — on FY2027. That gives
// a year-end price target, and the revision records which target was chosen.
//
// So this page reads as a revision log: one row per snapshot, the FY2027 underlying behind it,
// and the year-end target each multiple implies. Hold the multiples constant and everything that
// moves is the model being revised.
//
// ── Aug 2026 · standardised against docs/CHART_ENGINE_REFERENCE.md §0 ────────────
// The first block (the revision log) is now a path-3 canvas built to the six non-negotiables of
// §0.2, using the §0.7 kit — the visual language comes from css/results.css, which index.html
// loads unconditionally, so no chart CSS is written here:
//
//   1 · both axes zoom, double-click resets   → rsAttachBrush (copied verbatim, see below)
//   2 · click a series to hide it             → chips + ONE predicate, vis(), feeding chart AND table
//   3 · a table under the chart in a dropdown → .rs-collap + a generated header that recounts
//   4 · the metric dropdown grouped by family → <optgroup> Price target ▸ … · Model ▸ …
//   5 · units and placeholders never ambiguous→ fmtLevel/fmtChange + the purple placeholder mark
//   6 · missing data renders nothing          → the guard at the top of tmBody()
//
// The chart and the table are no longer a Table|Chart either/or: the chart is the read and the
// table sits under it as the receipt, which is the §0.4 layout contract.
//
// Two §0.2 items land differently here and the reason is the same in both cases — the x axis is
// SNAPSHOTS, not periods:
//   · onX is null on the brush (only the y axis zooms), exactly as blocks D and E do — there is
//     no period window to narrow, and 7 snapshots do not want one.
//   · rsFwdZone is not used. It shades forward PERIODS, and every column here is a forecast of
//     the same fiscal year; there is no actual/estimate boundary to draw. The re-parse columns
//     are dimmed and the redefinition column is badged instead.
// The window control on the right of row 2 is therefore "which snapshots", not "which periods" —
// and every summary figure is computed over that window (invariant 9), never over the full array.
//
// ── Data (Summit DCF model, instrument AMZN, model be6d6393, FY2027) ─────────────
// AMZN:rev · ebitda · earnings · shares, read per snapshot through the revision history.
//
// ── Seven snapshots are NOT seven revisions ──────────────────────────────────────
// 2026-07-30 and 2026-08-03 carry byte-identical FY2027 EBITDA (303,160.67) and earnings
// (109,981.17). 08-03 is a re-parse, not a revision. The table marks each column as one or the
// other by comparing against the previous snapshot, so the revision log shows the ~quarterly
// cadence that actually happened rather than every time the file was ingested.
//
// ── The EBITDA definition break, and why it decides the forward-year roll ────────
// Across 2026-08-03 → 08-04: FY2027 EBITDA +9.8%, earnings +8.2% — comparable, so FY2027 is
// only mildly affected. The same break on FY2028 is EBITDA +38.3% against earnings +6.9%
// (311,084 → 430,088 vs 128,556 → 137,412), taking the implied FY2028 EBITDA margin from 28.8%
// to 39.1%. The redefinition lands almost entirely in the later years, which is exactly what
// makes rolling the forward year to FY2028 a judgement call rather than a routine step: the
// P/E leg rolls cleanly, the EV/EBITDA leg does not. Flagged on the column AND above the chart.
//
// ── What the MCP cannot give ─────────────────────────────────────────────────────
// The workbook carries the chosen multiple and the recorded price target from column EM
// rightward on projection_history. An unfiltered pull of that sheet returns exactly 41 mapped
// series (DEFAULT / SEGM / BBG) and none is a multiple or a target — the connector stops well
// before column EM (the 143rd). So in Live the multiples are inputs. Recorded multiple shows the
// layout once those columns are ingested, with clearly-marked stand-ins.

// ── Copied verbatim from js/results.js, per CHART_ENGINE_REFERENCE §0.7 ──────────
// The engine exports five names and none of them is a helper, so these are copies, not imports.
// esc — js/results.js:209. Used on EVERY interpolated string.
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// rsAttachBrush — js/results.js:1221–1299, unmodified. Drag-to-zoom on both axes with a
// double-click reset (§0.2 rule 1). It calls nothing else in that module, which is why it
// travels. onX = null here: the x axis is snapshots and has no window to narrow, so every drag
// is read as a y-drag rather than dying.
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
    var vertical = forcedY ? true : null;   // null = direction not decided yet
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
      if (vertical == null) return;                   // a click, not a drag
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

// Classify each snapshot by what actually moved. Revenue and profitability move independently,
// and the classification is year-specific: 2026-05-13 left FY2027 revenue untouched (a pure
// margin re-cut) but CUT FY2028 revenue by 3.3% while lifting its EBITDA — same revision,
// different character.
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
// _mode is the MULTIPLE SOURCE (recorded vs your own input); st.mode is the chart's reading
// (level vs change). Two different questions, deliberately two different controls.
var _mode = 'preview';    // 'preview' = Recorded multiple · 'live' = your own multiples
var _mEv  = 14;
var _mPe  = 32;
var _netDebt = 0;
var _px = null;

// The revision-log block's own state. `tbl` is initialised here rather than left undefined —
// §9.13's trap is a collapsible whose markup test and caret test disagree on a missing flag.
var st = {
  metric:'pt',      // 'pt' | 'spread' | 'rev' | 'ebitda' | 'earn' | 'eps'
  mode:'level',     // 'level' | 'chg'
  gunit:'pct',      // while mode === 'chg': '%' or the metric's own units
  win:'all',        // 'all' | 'rev' (revisions only) — the window every summary is computed over
  hidden:{},        // series key → hidden
  yr:null,          // y-range from the brush
  tbl:true,         // the table under the chart starts OPEN (see the note in tmBody)
  chart:null,
};

// The PEG block's own state. Blocks never reach into each other (§1): the window, the reading and
// the zoom are its own, and only FWD_YEAR is shared — that is the page's working year, and two
// controls setting it would let the two blocks disagree about which year the page is about.
var _pegB = 'pe';         // PEG basis: 'pe' earnings · 'ev' EBITDA. Picks BOTH the numerator
                          // (that leg's multiple) and the denominator (that same line's growth).
var pst = {
  metric:'peg',    // 'peg' | 'mult' | 'growth' — the ratio, or one of the two inputs behind it
  mode:'level',    // 'level' | 'chg'
  gunit:'pct',
  win:'all',
  hidden:{},
  yr:null,
  tbl:true,
  chart:null,
};

// ── Maths ────────────────────────────────────────────────────────────────────────
function eps(s){ return s.earn / s.sh; }
function ptEv(s, m){ return (s.ebitda * (m==null?_mEv:m) - _netDebt) / s.sh; }
function ptPe(s, m){ return eps(s) * (m==null?_mPe:m); }

// Mode-aware targets. In Live both legs use the single multiple you type, so the multiple is a
// constant and only the model moves. In Recorded multiple each snapshot carries its OWN multiple,
// so the target moves for both reasons at once — which is the whole point of storing it.
function evAt(s,i){ return _mode==='preview' ? ptEv(s, MOCK_EV[i]) : ptEv(s); }
function peAt(s,i){ return _mode==='preview' ? ptPe(s, MOCK_PE[i]) : ptPe(s); }
function recAt(s,i){ return (evAt(s,i)+peAt(s,i))/2; }   // the recorded target: midpoint of the legs
function multEv(i){ return _mode==='preview' ? MOCK_EV[i] : _mEv; }
function multPe(i){ return _mode==='preview' ? MOCK_PE[i] : _mPe; }

// ── Metrics — §0.2 rule 4: families first, the lines inside them ─────────────────
// Every option reads standalone (a closed <select> shows the option, never its group header),
// which is why each carries its fiscal year.
var METRICS = {
  pt:     { group:'Year-end price target', label:function(){ return 'Year-end price target'; },      unit:'px'  },
  spread: { group:'Year-end price target', label:function(){ return 'EV/EBITDA vs P/E spread'; },    unit:'pct' },
  rev:    { group:'Model underlying',      label:function(){ return 'Revenue FY'+FWD_YEAR; },        unit:'m'   },
  ebitda: { group:'Model underlying',      label:function(){ return 'EBITDA FY'+FWD_YEAR; },         unit:'m'   },
  earn:   { group:'Model underlying',      label:function(){ return 'Net earnings FY'+FWD_YEAR; },   unit:'m'   },
  eps:    { group:'Model underlying',      label:function(){ return 'EPS FY'+FWD_YEAR; },            unit:'eps' },
};
var METRIC_ORDER = ['pt','spread','rev','ebitda','earn','eps'];
function metricM(){ if(!METRICS[st.metric]) st.metric='pt'; return METRICS[st.metric]; }
function unitOf(){ return metricM().unit; }

// ── Series — and the ONE predicate every surface reads (§0.2 rule 2) ─────────────
var C_EV='#146EB4', C_PE='#FF9900';
var C_REC='#8E44AD';   // recorded target — purple, matching the placeholder marks in the table
var C_SPREAD='#5B6B7C';
var C_MODEL='rgba(37,99,235,0.85)';   // RS_SUMMIT — this line IS the Summit model
var C_PX='#8A93A0';
// The RS palette is semantic (navy = reported, blue = us, gray = the Street) and two valuation
// METHODS are not sources, so the established EV/PE pair is kept rather than repainted; the one
// place the palette does map is the model underlying, which is Summit blue.

function seriesDefs(){
  if(st.metric==='pt'){
    var d=[{ k:'ev',  label:(_mode==='preview'?'EV/EBITDA leg':_mEv+'× EV/EBITDA'), color:C_EV },
           { k:'pe',  label:(_mode==='preview'?'P/E leg':_mPe+'× P/E'),             color:C_PE }];
    if(_mode==='preview') d.push({ k:'rec', label:'Recorded target', color:C_REC, wide:true });
    // A flat reference has no move to show, so it belongs to the level reading only.
    if(_px!=null && st.mode==='level') d.push({ k:'px', label:'Live price', color:C_PX, dash:true });
    return d;
  }
  if(st.metric==='spread') return [{ k:'spread', label:'EV/EBITDA vs P/E spread', color:C_SPREAD }];
  return [{ k:'model', label:metricM().label(), color:C_MODEL }];
}
function vis(k){ return !st.hidden[k]; }                    // ← the ONE predicate
function visSeries(){ return seriesDefs().filter(function(s){ return vis(s.k); }); }

// The window. "Revisions only" drops the re-parses — the snapshots where nothing moved — so the
// log shows the ~quarterly cadence that actually happened. Everything downstream iterates this.
function winIdx(){
  var all=SNAPS.map(function(s,i){ return i; });
  return st.win==='rev' ? all.filter(isRevision) : all;
}

// Raw value of one series at one snapshot, in that metric's own display units.
function raw(k,i){
  var s=SNAPS[i];
  switch(k){
    case 'ev':     return evAt(s,i);
    case 'pe':     return peAt(s,i);
    case 'rec':    return recAt(s,i);
    case 'px':     return _px;
    case 'spread': return (evAt(s,i)/peAt(s,i)-1)*100;
    case 'eps':    return eps(s);
    case 'rev': case 'ebitda': case 'earn': return s[k];
    // 'model' is whichever model line the metric picker is on — the chart's series key, so the
    // chart and the table resolve the same line through the same function.
    case 'model':  return st.metric==='eps' ? eps(s) : s[st.metric];
  }
  return null;
}
// The value under the current reading. In 'chg' the base is the previous snapshot IN THE WINDOW,
// so hiding the re-parses never invents a move that spans one.
function valAt(k, idx, p){
  var v=raw(k, idx[p]);
  if(st.mode==='level') return v;
  if(p===0) return null;
  var b=raw(k, idx[p-1]);
  if(v==null || b==null) return null;
  if(unitOf()==='pct' || st.gunit==='amt') return v-b;   // a percentage always differs in points
  return b===0 ? null : (v/b-1)*100;
}

// ── Formatting — §0.2 rule 5: no bare numbers, ever ──────────────────────────────
function fmtB(v){ var b=v/1000; return (Math.abs(b)>=1000)?('$'+(b/1000).toFixed(2)+'T'):('$'+Math.round(b)+'B'); }
function fmtPx(v){ return '$'+Math.round(v).toLocaleString('en-US'); }
function signPct(p){ return (p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'; }
function pctCell(p){ return p==null?'<span class="rs-ft-nil">—</span>'
  :'<span style="color:'+(Math.abs(p)<0.0005?'var(--mu)':(p>=0?'#2E8B57':'#C0392B'))+'">'+signPct(p)+'</span>'; }

function fmtLevel(v, unit){
  if(v==null) return '—';
  unit=unit||unitOf();
  if(unit==='px')  return fmtPx(v);
  if(unit==='pct') return (v>=0?'+':'−')+Math.abs(v).toFixed(1)+'%';
  if(unit==='eps') return '$'+v.toFixed(2);
  return fmtB(v);
}
// A move. Percentages differ in POINTS (§10), and below ±0.05 the cell stays neutral rather than
// claiming a line fell on a rounding artifact.
function fmtChange(v, unit){
  if(v==null) return '—';
  unit=unit||unitOf();
  // zero is not a positive move — an axis reading "+$0" at the baseline is a small lie
  var s=(v===0?'':(v>=0?'+':'−')), a=Math.abs(v);
  if(unit==='pct') return s+a.toFixed(1)+' pp';
  if(st.gunit==='pct') return s+a.toFixed(1)+'%';
  if(unit==='px')  return s+'$'+a.toFixed(0);
  if(unit==='eps') return s+'$'+a.toFixed(2);
  return s+fmtB(a);
}
function fmtVal(v){ return st.mode==='level' ? fmtLevel(v) : fmtChange(v); }
// The level button carries the UNIT itself, not the word "Levels" — the block knows its metric.
function levelLabel(){
  var u=unitOf();
  return u==='px' ? '$/share' : u==='pct' ? '%' : u==='eps' ? 'US$' : '$B';
}

// Under 1.0 reads cheap against its own growth, over 2.0 dear.
function pegColor(p){ return p<1 ? '#2E8B57' : (p>2 ? '#C0392B' : 'var(--navy)'); }
function pegLineLabel(){ return _pegB==='ev' ? 'EBITDA' : 'Earnings'; }

// ── PEG ──────────────────────────────────────────────────────────────────────────
// PEG = the multiple you chose ÷ the growth of the very line that multiple is priced off,
// in percentage points. Basis 'pe' → P/E over earnings growth; 'ev' → EV/EBITDA over EBITDA
// growth. Both legs of the ratio move with the basis, so the two are never mixed.
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
function pegAt(i){
  var g=pegGrowth(i); if(g==null || g<=0) return null;
  return pegMult(i)/(g*100);
}

// ── Body ─────────────────────────────────────────────────────────────────────────
function tmBody(){
  if(!SNAPS || !SNAPS.length) return '';        // §0.2 rule 6 — nothing, never broken

  var h = '';
  h += '<style>'+
    '.ovt-subpane[data-ovst="targetmult"] .sens-ctrl-l{min-width:0}'+
    '.ovt-subpane[data-ovst="targetmult"] .sens-ctrl{margin:0;gap:8px}'+
    // the window pills are stateful here (they pick a window and stay picked), so they need an
    // active state the engine's momentary presets never needed
    '.tm-blk .rs-preset.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.tm-leg{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0 8px}'+
    '.tm-chartwrap{position:relative;height:340px;margin:2px 0 6px}'+
    // the table keeps its original format; the wrapper is what stops it smearing off a narrow
    // screen (§0.5) — the same job .rs-ft-scroll does for the engine's own tables
    '#tmTable,#pegTable{overflow-x:auto}'+
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
    '.tm-tbl th.peg-out,.tm-tbl td.peg-out{background:#F1F3F5;font-weight:800}'+
    '.tm-tbl tbody tr.tm-rep td.peg-out{background:#EDEFF1}'+
    '</style>';

  // §0.4 — row 1 is IDENTITY (what am I looking at), row 2 is TREATMENT on the left and the
  // WINDOW on the right.
  h += '<div class="rs-block tm-blk" id="tmBlock">';
  h += '<div class="rs-block-top"><div class="rs-block-h">Target Multiple — revision log</div>'+
       '<select class="rs-msel tm-msel" id="tmMsel" aria-label="Metric"></select></div>';
  h += '<div class="rs-block-modes"><div class="rs-modes" id="tmModes"></div>'+
       '<div class="rs-quick"><span class="rs-quick-l">Snapshots</span>'+
         '<button type="button" class="rs-preset" data-tmwin="all">All</button>'+
         '<button type="button" class="rs-preset" data-tmwin="rev">Revisions only</button>'+
       '</div></div>';

  // The multiples live where the thing they change lives: they only exist in Live.
  h += '<div class="sens-controls-row sens-row-inp" id="tmLiveCtrls">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="tmEvL">EV/EBITDA '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmEv" type="number" step="0.5" value="'+_mEv+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="tmPeL">P/E '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmPe" type="number" step="0.5" value="'+_mPe+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Net debt</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmNd" type="number" step="1000" value="'+_netDebt+'"><span class="sens-inp-u">$M</span></span></div>'+
       '</div>';

  h += '<div id="tmFwdWarn"></div>';
  h += '<div class="tm-leg" id="tmLeg"></div>';
  h += '<div class="tm-chartwrap"><canvas id="tmChart"></canvas></div>';
  // §0.2 rule 3 — the receipt under the read. It opens by default here (one table, and it is the
  // block's own detail rather than an audit trail); the markup test and the caret test are both
  // the `=== true` idiom and `st.tbl` is initialised, which is the §9.13 trap avoided.
  h += '<div class="rs-collap" data-tmtbl="1">'+
         '<button type="button" class="rs-collap-h" data-tmtblb="1" id="tmTblH"></button>'+
         '<div class="rs-collap-b" id="tmTblBody"'+(st.tbl===true?'':' hidden')+'>'+
           '<div class="rs-tablewrap" id="tmTable"></div>'+
         '</div></div>';
  h += '<div class="ov-foot" id="tmFoot"></div>';
  h += '</div>';

  // ── PEG, as its own block ──────────────────────────────────────────────────────
  // Same standard as the log above, and for the same reason: the PEG asks a different question
  // from the target — not "what is this worth" but "how much growth am I paying for" — so it is
  // its own block with its own controls, its own window and its own zoom.
  h += '<div class="rs-block tm-blk" id="pegBlock">';
  h += '<div class="rs-block-top"><div class="rs-block-h">PEG</div>'+
       '<select class="rs-msel peg-msel" id="pegMsel" aria-label="Metric"></select></div>';
  h += '<div class="rs-block-modes"><div class="rs-modes" id="pegModes"></div>'+
       '<div class="rs-quick"><span class="rs-quick-l">Snapshots</span>'+
         '<button type="button" class="rs-preset" data-pegwin="all">All</button>'+
         '<button type="button" class="rs-preset" data-pegwin="rev">Revisions only</button>'+
       '</div></div>';
  h += '<div class="tm-leg" id="pegLeg"></div>';
  h += '<div class="tm-chartwrap" style="height:320px"><canvas id="pegChart"></canvas></div>';
  h += '<div class="rs-collap" data-pegtbl="1">'+
         '<button type="button" class="rs-collap-h" data-pegtblb="1" id="pegTblH"></button>'+
         '<div class="rs-collap-b" id="pegTblBody"'+(pst.tbl===true?'':' hidden')+'>'+
           '<div class="rs-tablewrap" id="pegTable"></div>'+
         '</div></div>';
  h += '<div class="dd-note" id="pegNote"></div>';
  h += '</div>';
  return h;
}

// ── Controls ─────────────────────────────────────────────────────────────────────
function selectHtml(){
  var groups=[], seen={};
  METRIC_ORDER.forEach(function(k){ var g=METRICS[k].group; if(!seen[g]){ seen[g]=[]; groups.push(g); } seen[g].push(k); });
  return groups.map(function(g){
    return '<optgroup label="'+esc(g)+'">'+seen[g].map(function(k){
      return '<option value="'+k+'"'+(st.metric===k?' selected':'')+'>'+esc(METRICS[k].label())+'</option>';
    }).join('')+'</optgroup>';
  }).join('');
}
function modesHtml(){
  var b=function(attr,val,on,label,title){
    return '<button type="button" class="rs-view'+(on?' active':'')+'" data-'+attr+'="'+val+'"'+
      (title?' title="'+esc(title)+'"':'')+'>'+esc(label)+'</button>';
  };
  var h='<div class="rs-views">'+
    b('tmmode','preview',_mode==='preview','Recorded multiple','Each snapshot carries the multiple that was chosen at the time')+
    b('tmmode','live',_mode==='live','Live','One multiple you type, held constant across every snapshot')+'</div>';
  h+='<div class="rs-views">'+
    b('tmread','level',st.mode==='level',levelLabel(),'The level at each snapshot')+
    b('tmread','chg',st.mode==='chg','Change','The move from the previous snapshot in the window')+'</div>';
  // §9.4 — Amount is the half people skip, and often the more honest one. A percentage always
  // differs in points, so a percentage metric gets no unit choice to make.
  if(st.mode==='chg' && unitOf()!=='pct'){
    h+='<div class="rs-views">'+
      b('tmgunit','pct',st.gunit==='pct','%')+
      b('tmgunit','amt',st.gunit==='amt','Amount')+'</div>';
  }
  h+='<div class="rs-views">'+FWD_YEARS.map(function(y){
    return b('tmfy',y,FWD_YEAR===y,'FY'+y,'Roll the forward year the multiple is applied to');
  }).join('')+'</div>';
  return h;
}
function legendHtml(){
  return seriesDefs().map(function(s){
    return '<button type="button" class="rs-leg'+(vis(s.k)?'':' off')+'" data-tmleg="'+s.k+'" title="Show / hide">'+
      '<span class="'+(s.dash?'rs-leg-dash':'rs-leg-line')+'" style="background:'+s.color+'"></span>'+esc(s.label)+'</button>';
  }).join('');
}
// The header is generated, never static: the metric, the count of series and the count of
// snapshots all follow the controls above it.
function tblHeadHtml(){
  var open=st.tbl===true, n=visSeries().length, ns=winIdx().length;
  return '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>Snapshot detail'+
    '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(metricM().label())+', '+
    n+' series drawn, '+ns+' snapshot'+(ns===1?'':'s')+' in the selected range</span>';
}

// ── Chart ────────────────────────────────────────────────────────────────────────
function buildChart(scope){
  var cv=scope.querySelector('#tmChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(st.chart){ try{ st.chart.destroy(); }catch(e){} st.chart=null; }

  var idx=winIdx(), sers=visSeries();
  var labels=idx.map(function(i){ return SNAPS[i].d.slice(2); });   // yy-mm-dd
  var pointR=idx.map(function(i){ return isRevision(i)?4.5:3; });
  var pointFill=function(c){ return idx.map(function(i){ return isRevision(i)?c:'#fff'; }); };
  var pointBrd =function(c){ return idx.map(function(i){ return SNAPS[i].d===BREAK_ON?'#C0392B':c; }); };
  var bar=(st.mode==='chg');

  var ds=sers.map(function(s){
    var data=idx.map(function(_,p){ return valAt(s.k, idx, p); });
    if(bar) return { label:s.label, data:data, backgroundColor:s.color, borderRadius:2, maxBarThickness:26 };
    return { label:s.label, data:data, borderColor:s.color, backgroundColor:s.color,
      borderWidth:s.wide?3:(s.dash?1.5:2.4), borderDash:s.dash?[5,4]:undefined, tension:.25, fill:false,
      spanGaps:true, pointRadius:s.dash?0:pointR, pointBackgroundColor:pointFill(s.color),
      pointBorderColor:pointBrd(s.color), pointBorderWidth:2 };
  });

  st.chart=new Chart(cv.getContext('2d'),{
    type:bar?'bar':'line',
    data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:false },                       // the chips ARE the legend
        tooltip:{ callbacks:{
          label:function(ctx){ return ctx.dataset.label+': '+fmtVal(ctx.parsed.y); },
          title:function(items){ var p=items[0].dataIndex, i=idx[p];
            return SNAPS[i].d+(isRevision(i)?'':'  (re-parse)')+(SNAPS[i].d===BREAK_ON?'  · EBITDA redefined':''); } } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        // §0.4 — the y axis goes on the right. min/max honour the brush; without this half the
        // drag paints a rectangle and does nothing.
        y:{ position:'right', grid:{ color:'#EEF2F7' },
            min: st.yr ? st.yr[0] : undefined,
            max: st.yr ? st.yr[1] : undefined,
            ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return fmtVal(v); } } } } }
  });

  // §0.2 rule 1. onX is null — the x axis is snapshots, with no window to narrow.
  rsAttachBrush(cv, st.chart, null,
    function(v1,v2){ st.yr=[v1,v2]; buildChart(scope); },
    function(){ st.yr=null; buildChart(scope); });
}

// ── Table ────────────────────────────────────────────────────────────────────────
// The original revision-log format, kept as it was: one ROW per snapshot, the underlying and the
// targets across the columns, the kind tag beside each date. It stays where the standard put it —
// under the chart, inside the Snapshot detail dropdown.
//
// Two things it does obey from §0: it iterates the selected WINDOW rather than the whole array
// (so "Revisions only" drops those rows here too), and a column whose series has been switched
// off in the legend leaves the table with it (§0.2 rule 2) — read through the same vis().
function rowVk(id){
  if(st.metric==='pt')     return (id==='ev'||id==='pe'||id==='rec'||id==='px') ? id : null;
  if(st.metric==='spread') return id==='spread' ? 'spread' : null;
  return id===st.metric ? 'model' : null;      // rev / ebitda / earn / eps
}
// Is a column on screen? A column that is not a drawn series is always shown; one that IS a
// drawn series follows its chip.
function colOn(id){ var vk=rowVk(id); return !vk || vis(vk); }

function renderTable(scope){
  var el=scope.querySelector('#tmTable'); if(!el) return;
  var idx=winIdx();
  var ph=function(t){ return '<span class="tm-ph">'+t+'</span>'; };
  var head='', rows='';

  // which columns survive the legend
  var cEv=colOn('ev'), cPe=colOn('pe'), cRec=colOn('rec'), cSpread=colOn('spread');
  var cRev=colOn('rev'), cEbitda=colOn('ebitda'), cEarn=colOn('earn'), cEps=colOn('eps');

  if(_mode==='preview'){
    head='<th>Snapshot</th>'+
      (cRev?'<th>Revenue '+FWD_YEAR+'</th>':'')+
      (cEbitda?'<th>EBITDA '+FWD_YEAR+'</th>':'')+
      (cEarn?'<th>Earnings '+FWD_YEAR+'</th>':'')+
      (cEps?'<th>EPS</th>':'')+
      (cEv?'<th>EV/EBITDA chosen</th>':'')+
      (cPe?'<th>P/E chosen</th>':'')+
      (cRec?'<th>Recorded year-end target</th><th>Δ</th>':'');
    var prev=null;
    idx.forEach(function(i,p){
      var s=SNAPS[i], k=kindOf(i), rev=isRevision(i);
      var mev=MOCK_EV[i], mpe=MOCK_PE[i];
      var recv=recAt(s,i);
      var d=(prev!=null)?(recv/prev-1):null;
      rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
        '<td><b>'+esc(s.d)+'</b><span class="tm-tag tm-tag-'+k.cls+'">'+esc(k.label)+'</span>'+
          (s.d===BREAK_ON?'<span class="tm-tag tm-tag-brk">EBITDA redefined</span>':'')+'</td>'+
        (cRev?'<td>'+fmtB(s.rev)+'</td>':'')+
        (cEbitda?'<td>'+fmtB(s.ebitda)+'</td>':'')+
        (cEarn?'<td>'+fmtB(s.earn)+'</td>':'')+
        (cEps?'<td>$'+eps(s).toFixed(2)+'</td>':'')+
        (cEv?'<td>'+ph(mev.toFixed(1)+'×')+'</td>':'')+
        (cPe?'<td>'+ph(mpe.toFixed(0)+'×')+'</td>':'')+
        (cRec?'<td class="tm-pt">'+ph(fmtPx(recv))+'</td><td>'+pctCell(d)+'</td>':'')+
        '</tr>';
      prev=recv;
    });
  } else {
    head='<th>Snapshot</th>'+
      (cRev?'<th>Revenue '+FWD_YEAR+'</th>':'')+
      (cEbitda?'<th>EBITDA '+FWD_YEAR+'</th>':'')+
      (cEarn?'<th>Earnings '+FWD_YEAR+'</th>':'')+
      (cEps?'<th>EPS</th>':'')+
      (cEv?'<th>Target @ '+_mEv+'× EV/EBITDA</th><th>Δ</th>':'')+
      (cPe?'<th>Target @ '+_mPe+'× P/E</th><th>Δ</th>':'')+
      ((cEv&&cPe&&cSpread)?'<th>EV vs P/E</th>':'');
    var prevEv=null, prevPe=null;
    idx.forEach(function(i,p){
      var s=SNAPS[i], k=kindOf(i), rev=isRevision(i);
      var pe_=ptPe(s), ev_=ptEv(s);
      var dEv=(prevEv!=null)?(ev_/prevEv-1):null, dPe=(prevPe!=null)?(pe_/prevPe-1):null;
      // greyed when unchanged from the prior row IN THE WINDOW, so the flag still reads right
      // once the re-parses are filtered out
      var revFlat=(p>0 && s.rev===SNAPS[idx[p-1]].rev);
      rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
        '<td><b>'+esc(s.d)+'</b><span class="tm-tag tm-tag-'+k.cls+'">'+esc(k.label)+'</span>'+
          (s.d===BREAK_ON?'<span class="tm-tag tm-tag-brk">EBITDA redefined</span>':'')+'</td>'+
        (cRev?'<td'+(revFlat?' style="color:var(--mu)"':'')+'>'+fmtB(s.rev)+'</td>':'')+
        (cEbitda?'<td>'+fmtB(s.ebitda)+'</td>':'')+
        (cEarn?'<td>'+fmtB(s.earn)+'</td>':'')+
        (cEps?'<td>$'+eps(s).toFixed(2)+'</td>':'')+
        (cEv?'<td class="tm-pt">'+fmtPx(ev_)+'</td><td>'+pctCell(dEv)+'</td>':'')+
        (cPe?'<td class="tm-pt">'+fmtPx(pe_)+'</td><td>'+pctCell(dPe)+'</td>':'')+
        ((cEv&&cPe&&cSpread)?'<td>'+signPct(ev_/pe_-1)+'</td>':'')+
        '</tr>';
      prevEv=ev_; prevPe=pe_;
    });
  }

  el.innerHTML='<table class="tm-tbl"><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table>';
}

function footHtml(){
  var idx=winIdx(), f=SNAPS[idx[0]], l=SNAPS[idx[idx.length-1]], fi=idx[0], li=idx[idx.length-1];
  var common='FY'+FWD_YEAR+' revenue, EBITDA, earnings and share count per snapshot from the Summit DCF model (instrument AMZN, model be6d6393), '+
    'read through the revision history. <b>Year-end target</b> = EBITDA × the EV/EBITDA multiple less net debt over shares, and EPS × the P/E multiple — '+
    'both shown side by side because the desk sets both. The <b>spread</b> is the disagreement between the two methods. Share count is the model\'s own and '+
    'moves (10,721 in the first vintage, 10,827 after). Net debt is '+fmtB(_netDebt)+', from the live quote. ';
  if(_mode==='live'){
    return common+'At the multiples above the '+FWD_YEAR+' target moved '+signPct(ptEv(l)/ptEv(f)-1)+' on EV/EBITDA and '+
      signPct(ptPe(l)/ptPe(f)-1)+' on P/E across the selected snapshots. The multiples are your input: the recorded ones live past column EM on '+
      'projection_history and the connector does not reach them. Data sourced from Summit DCF models.';
  }
  var e0=eps(f), e1=eps(l), m0=MOCK_PE[fi], m1=MOCK_PE[li];
  var fund=(e1-e0)*m0, mult=(m1-m0)*e0;
  return '<b>What the recorded multiple unlocks.</b> With the chosen multiple stored beside the target, the move in the target splits into the part that '+
    'came from <b>revising the business</b> and the part that came from <b>changing what you pay for it</b>. On the illustrative path EPS goes $'+
    e0.toFixed(2)+' to $'+e1.toFixed(2)+', worth <b>+$'+fund.toFixed(0)+'</b> at the original multiple, while the multiple goes '+m0+'× to '+m1+'×, '+
    'worth <b>−$'+Math.abs(mult).toFixed(0)+'</b>. That decomposition is the thing you cannot get today, because only the underlying is readable. '+
    '<b>To make it real:</b> the connector ingests projection_history past column EM, or drop the workbook where I can read it (the xlsx parser from the '+
    'AppLovin build handles it) — one file per revision for the history, otherwise the latest gives the current row only. '+common+
    'Data sourced from Summit DCF models.';
}

// ═══ PEG block ═══════════════════════════════════════════════════════════════════
// Built to the same §0 standard as the log above, with the same shape: chart on top, the original
// table underneath inside its dropdown. Its own state, its own window, its own zoom.

// §0.2 rule 4 — the ratio in one family, the two numbers it is built from in the other. Both
// inputs are read through the basis pills, so an option never means two things at once.
var PEG_METRICS = {
  peg:    { group:'The ratio',    label:function(){ return 'PEG ratio'; },                                unit:'ratio' },
  mult:   { group:'Its two inputs', label:function(){ return 'Multiple applied'; },                       unit:'mult'  },
  growth: { group:'Its two inputs', label:function(){ return 'Growth of '+pegLineLabel().toLowerCase(); },unit:'pct'   },
};
var PEG_METRIC_ORDER = ['peg','mult','growth'];
function pegM(){ if(!PEG_METRICS[pst.metric]) pst.metric='peg'; return PEG_METRICS[pst.metric]; }
function pegUnitOf(){ return pegM().unit; }

var C_PEG='#5B6B7C';       // slate — deliberately not a target colour: a different question
var C_PEG_GUIDE='#C7CED6';

function pegSeriesDefs(){
  var d=[{ k:'peg', label:pegM().label()+' · '+(_pegB==='ev'?'EV/EBITDA basis':'P/E basis'), color:C_PEG }];
  // The 1.0 / 2.0 marks are the reading everyone applies in their head — under 1 cheap against its
  // own growth, over 2 dear. They are reference lines, not data, so they carry no table column.
  if(pst.metric==='peg' && pst.mode==='level')
    d.push({ k:'guide', label:'Cheap / dear marks (1.0 · 2.0)', color:C_PEG_GUIDE, dash:true });
  return d;
}
function pegVis(k){ return !pst.hidden[k]; }                     // ← the ONE predicate
function pegVisSeries(){ return pegSeriesDefs().filter(function(s){ return pegVis(s.k); }); }
function pegWinIdx(){
  var all=SNAPS.map(function(s,i){ return i; });
  return pst.win==='rev' ? all.filter(isRevision) : all;
}
// Raw value of the plotted line at one snapshot, in its own units.
function pegRaw(i){
  if(pst.metric==='mult')   return pegMult(i);
  if(pst.metric==='growth'){ var g=pegGrowth(i); return g==null?null:g*100; }
  return pegAt(i);
}
function pegValAt(idx, p){
  var v=pegRaw(idx[p]);
  if(pst.mode==='level') return v;
  if(p===0) return null;
  var b=pegRaw(idx[p-1]);
  if(v==null || b==null) return null;
  if(pegUnitOf()==='pct' || pst.gunit==='amt') return v-b;   // a percentage differs in points
  return b===0 ? null : (v/b-1)*100;
}
function pegFmtLevel(v){
  if(v==null) return '—';
  var u=pegUnitOf();
  return u==='mult' ? v.toFixed(1)+'×' : u==='pct' ? ((v>=0?'+':'−')+Math.abs(v).toFixed(1)+'%') : v.toFixed(2);
}
function pegFmtChange(v){
  if(v==null) return '—';
  var u=pegUnitOf(), s=(v===0?'':(v>=0?'+':'−')), a=Math.abs(v);
  if(u==='pct')          return s+a.toFixed(1)+' pp';
  if(pst.gunit==='pct')  return s+a.toFixed(1)+'%';
  if(u==='mult')         return s+a.toFixed(1)+'×';
  return s+a.toFixed(2);                                    // the ratio moves in ratio points
}
function pegFmtVal(v){ return pst.mode==='level' ? pegFmtLevel(v) : pegFmtChange(v); }
// The level button carries the unit itself, not the word "Levels".
function pegLevelLabel(){ var u=pegUnitOf(); return u==='mult' ? '×' : u==='pct' ? '%' : 'Ratio'; }

function pegSelectHtml(){
  var groups=[], seen={};
  PEG_METRIC_ORDER.forEach(function(k){ var g=PEG_METRICS[k].group; if(!seen[g]){ seen[g]=[]; groups.push(g); } seen[g].push(k); });
  return groups.map(function(g){
    return '<optgroup label="'+esc(g)+'">'+seen[g].map(function(k){
      return '<option value="'+k+'"'+(pst.metric===k?' selected':'')+'>'+esc(PEG_METRICS[k].label())+'</option>';
    }).join('')+'</optgroup>';
  }).join('');
}
function pegModesHtml(){
  var b=function(attr,val,on,label,title){
    return '<button type="button" class="rs-view'+(on?' active':'')+'" data-'+attr+'="'+val+'"'+
      (title?' title="'+esc(title)+'"':'')+'>'+esc(label)+'</button>';
  };
  // The basis is a treatment control: it changes what the number MEANS, picking both the
  // numerator (that leg's multiple) and the denominator (that same line's growth) at once.
  var h='<div class="rs-views">'+
    b('tmpeg','pe',_pegB==='pe','P/E ÷ earnings growth','The P/E multiple over the growth of the earnings it is priced off')+
    b('tmpeg','ev',_pegB==='ev','EV/EBITDA ÷ EBITDA growth','The EV/EBITDA multiple over the growth of the EBITDA it is priced off')+'</div>';
  h+='<div class="rs-views">'+
    b('pegread','level',pst.mode==='level',pegLevelLabel(),'The level at each snapshot')+
    b('pegread','chg',pst.mode==='chg','Change','The move from the previous snapshot in the window')+'</div>';
  if(pst.mode==='chg' && pegUnitOf()!=='pct'){
    h+='<div class="rs-views">'+
      b('peggunit','pct',pst.gunit==='pct','%')+
      b('peggunit','amt',pst.gunit==='amt','Amount')+'</div>';
  }
  return h;
}
function pegLegendHtml(){
  return pegSeriesDefs().map(function(s){
    return '<button type="button" class="rs-leg'+(pegVis(s.k)?'':' off')+'" data-pegleg="'+s.k+'" title="Show / hide">'+
      '<span class="'+(s.dash?'rs-leg-dash':'rs-leg-line')+'" style="background:'+s.color+'"></span>'+esc(s.label)+'</button>';
  }).join('');
}
function pegTblHeadHtml(){
  var open=pst.tbl===true, ns=pegWinIdx().length;
  return '<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>Snapshot detail'+
    '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(pegM().label())+' on the '+
    (_pegB==='ev'?'EV/EBITDA':'P/E')+' basis, '+ns+' snapshot'+(ns===1?'':'s')+' in the selected range</span>';
}

function buildPegChart(scope){
  var cv=scope.querySelector('#pegChart');
  if(!cv || typeof Chart==='undefined' || cv.offsetParent===null) return;
  if(pst.chart){ try{ pst.chart.destroy(); }catch(e){} pst.chart=null; }

  var idx=pegWinIdx(), sers=pegVisSeries();
  var labels=idx.map(function(i){ return SNAPS[i].d.slice(2); });
  var bar=(pst.mode==='chg');
  var ds=[];
  sers.forEach(function(s){
    if(s.k==='guide'){
      [1,2].forEach(function(g){
        ds.push({ label:'PEG '+g.toFixed(1), data:idx.map(function(){ return g; }), borderColor:C_PEG_GUIDE,
          borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false, tension:0 });
      });
      return;
    }
    var data=idx.map(function(_,p){ return pegValAt(idx,p); });
    if(bar){ ds.push({ label:s.label, data:data, backgroundColor:s.color, borderRadius:2, maxBarThickness:26 }); return; }
    ds.push({ label:s.label, data:data, borderColor:s.color, backgroundColor:s.color,
      borderWidth:2.6, tension:.25, fill:false, spanGaps:true,
      pointRadius:idx.map(function(i){ return isRevision(i)?4.5:3; }),
      pointBackgroundColor:idx.map(function(i){ return isRevision(i)?s.color:'#fff'; }),
      pointBorderColor:idx.map(function(i){ return SNAPS[i].d===BREAK_ON?'#C0392B':s.color; }),
      pointBorderWidth:2 });
  });

  pst.chart=new Chart(cv.getContext('2d'),{
    type:bar?'bar':'line',
    data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:false },                      // the chips ARE the legend
        tooltip:{ filter:function(ctx){ return ctx.dataset.label.indexOf('PEG 1.0')!==0 && ctx.dataset.label.indexOf('PEG 2.0')!==0; },
          callbacks:{
            label:function(ctx){
              var v=ctx.parsed.y, p=ctx.dataIndex, i=idx[p], g=pegGrowth(i);
              if(v==null) return ctx.dataset.label+': — (growth not positive)';
              var base=ctx.dataset.label+': '+pegFmtVal(v);
              // the ratio shows its own arithmetic, which is the whole point of the block
              return (pst.metric==='peg' && pst.mode==='level' && g!=null && g>0)
                ? base+'  ·  '+pegMult(i).toFixed(1)+'× ÷ '+(g*100).toFixed(1)+'%' : base;
            },
            title:function(items){ var i=idx[items[0].dataIndex];
              return SNAPS[i].d+(isRevision(i)?'':'  (re-parse)')+(SNAPS[i].d===BREAK_ON?'  · EBITDA redefined':''); } } } },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        y:{ position:'right', grid:{ color:'#EEF2F7' },
            min: pst.yr ? pst.yr[0] : undefined,
            max: pst.yr ? pst.yr[1] : undefined,
            ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return pegFmtVal(v); } } } } }
  });

  rsAttachBrush(cv, pst.chart, null,
    function(v1,v2){ pst.yr=[v1,v2]; buildPegChart(scope); },
    function(){ pst.yr=null; buildPegChart(scope); });
}

// The table keeps its original format — one row per snapshot, showing its own arithmetic: the
// multiple, both years of the line it is priced off, the growth between them, and the ratio.
// Every figure on a row comes from ONE snapshot, so the growth is what that vintage actually
// forecast rather than something assembled across files.
function renderPegTable(scope){
  var el=scope.querySelector('#pegTable'); if(!el) return;
  var k=PEG_KEY[_pegB], y0=FWD_YEAR-1, prior=priorOf(FWD_YEAR), idx=pegWinIdx();
  // §0.2 rule 2 — a column that IS the drawn series follows its chip
  var cOut=(pst.metric!=='peg') || pegVis('peg');
  var cMult=(pst.metric!=='mult') || pegVis('peg');
  var cGrow=(pst.metric!=='growth') || pegVis('peg');
  var rows='';
  idx.forEach(function(i){
    var kd=kindOf(i), rev=isRevision(i);
    var pri=prior[i], g=pegGrowth(i), p=pegAt(i), m=pegMult(i);
    var cell = (p==null)
      ? '<span style="color:var(--mu)" title="'+esc(g==null ? 'no prior-year figure in this vintage'
          : 'growth is '+signPct(g)+' — PEG is undefined when growth is not positive')+'">—</span>'
      : '<span style="color:'+pegColor(p)+'">'+p.toFixed(2)+'</span>';
    rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
      '<td><b>'+esc(SNAPS[i].d)+'</b><span class="tm-tag tm-tag-'+kd.cls+'">'+esc(kd.label)+'</span>'+
        (SNAPS[i].d===BREAK_ON?'<span class="tm-tag tm-tag-brk">EBITDA redefined</span>':'')+'</td>'+
      (cMult?'<td>'+m.toFixed(1)+'×</td>':'')+
      '<td>'+(pri&&pri[k]!=null?fmtB(pri[k]):'—')+'</td>'+
      '<td>'+fmtB(SNAPS[i][k])+'</td>'+
      (cGrow?'<td>'+pctCell(g)+'</td>':'')+
      (cOut?'<td class="peg-out">'+cell+'</td>':'')+
      '</tr>';
  });
  el.innerHTML=
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th>'+
      (cMult?'<th>'+(_pegB==='ev'?'EV/EBITDA':'P/E')+' multiple</th>':'')+
      '<th>'+esc(pegLineLabel())+' '+y0+'</th>'+
      '<th>'+esc(pegLineLabel())+' '+FWD_YEAR+'</th>'+
      (cGrow?'<th>Growth</th>':'')+
      (cOut?'<th class="peg-out">PEG</th>':'')+
    '</tr></thead><tbody>'+rows+'</tbody></table>';
}

function renderPeg(scope){
  var ms=scope.querySelector('#pegMsel'); if(ms) ms.innerHTML=pegSelectHtml();
  var md=scope.querySelector('#pegModes'); if(md) md.innerHTML=pegModesHtml();
  scope.querySelectorAll('[data-pegwin]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-pegwin')===pst.win); });
  var lg=scope.querySelector('#pegLeg'); if(lg) lg.innerHTML=pegLegendHtml();

  renderPegTable(scope);
  var th=scope.querySelector('#pegTblH'); if(th) th.innerHTML=pegTblHeadHtml();
  var tb=scope.querySelector('#pegTblBody'); if(tb) tb.hidden=(pst.tbl!==true);
  requestAnimationFrame(function(){ buildPegChart(scope); });

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
  // every control derives from state, so the buttons can never disagree with the content
  var ms=scope.querySelector('#tmMsel'); if(ms) ms.innerHTML=selectHtml();
  var md=scope.querySelector('#tmModes'); if(md) md.innerHTML=modesHtml();
  scope.querySelectorAll('[data-tmwin]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmwin')===st.win); });

  var lg=scope.querySelector('#tmLeg'); if(lg) lg.innerHTML=legendHtml();

  // the multiple labels name the forward year, so they follow the toggle
  var el=scope.querySelector('#tmEvL'); if(el) el.textContent='EV/EBITDA '+FWD_YEAR;
  el=scope.querySelector('#tmPeL');     if(el) el.textContent='P/E '+FWD_YEAR;
  el=scope.querySelector('#tmFwdWarn');
  if(el) el.innerHTML = FWD_NOTE[FWD_YEAR] ? '<div class="tm-warn">'+FWD_NOTE[FWD_YEAR]+'</div>' : '';
  var lc=scope.querySelector('#tmLiveCtrls');
  if(lc) lc.style.display=(_mode==='preview')?'none':'';

  renderTable(scope);
  var th=scope.querySelector('#tmTblH'); if(th) th.innerHTML=tblHeadHtml();
  var tb=scope.querySelector('#tmTblBody'); if(tb) tb.hidden=(st.tbl!==true);
  var ft=scope.querySelector('#tmFoot'); if(ft) ft.innerHTML=footHtml();

  requestAnimationFrame(function(){ buildChart(scope); });
  renderPeg(scope);
}

// ── Init ─────────────────────────────────────────────────────────────────────────
function initTm(root){
  var scope=root.querySelector('.ovt-subpane[data-ovst="targetmult"]');
  if(!scope || !scope.querySelector('#tmTable')) return;
  if(!scope._wired){
    scope._wired=true;

    // Delegated, bound to THIS pane and not to document (§12, invariant 2) — which is also what
    // lets the control row be re-rendered without re-binding anything.
    scope.addEventListener('click', function(e){
      var t;
      if((t=e.target.closest('[data-tmmode]'))){ _mode=t.getAttribute('data-tmmode'); st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-tmread]'))){ st.mode=t.getAttribute('data-tmread'); st.yr=null; return render(scope); }
      if((t=e.target.closest('[data-tmgunit]'))){ st.gunit=t.getAttribute('data-tmgunit'); st.yr=null; return render(scope); }
      // the forward year is the page's working year: both blocks read it, so both drop their zoom
      if((t=e.target.closest('[data-tmfy]'))){ setFwd(+t.getAttribute('data-tmfy')); st.yr=null; pst.yr=null; return render(scope); }
      if((t=e.target.closest('[data-tmwin]'))){ st.win=t.getAttribute('data-tmwin'); return render(scope); }
      if((t=e.target.closest('[data-tmleg]'))){ var k=t.getAttribute('data-tmleg'); st.hidden[k]=!st.hidden[k]; return render(scope); }
      if((t=e.target.closest('[data-tmtblb]'))){
        st.tbl=(st.tbl!==true);
        var b=scope.querySelector('#tmTblBody'); if(b) b.hidden=(st.tbl!==true);
        t.innerHTML=tblHeadHtml();
        return;
      }
      // ── the PEG block, same shape, its own state ──
      if((t=e.target.closest('[data-tmpeg]'))){ _pegB=t.getAttribute('data-tmpeg'); pst.yr=null; return renderPeg(scope); }
      if((t=e.target.closest('[data-pegread]'))){ pst.mode=t.getAttribute('data-pegread'); pst.yr=null; return renderPeg(scope); }
      if((t=e.target.closest('[data-peggunit]'))){ pst.gunit=t.getAttribute('data-peggunit'); pst.yr=null; return renderPeg(scope); }
      if((t=e.target.closest('[data-pegwin]'))){ pst.win=t.getAttribute('data-pegwin'); return renderPeg(scope); }
      if((t=e.target.closest('[data-pegleg]'))){ var pk=t.getAttribute('data-pegleg'); pst.hidden[pk]=!pst.hidden[pk]; return renderPeg(scope); }
      if((t=e.target.closest('[data-pegtblb]'))){
        pst.tbl=(pst.tbl!==true);
        var pb=scope.querySelector('#pegTblBody'); if(pb) pb.hidden=(pst.tbl!==true);
        t.innerHTML=pegTblHeadHtml();
        return;
      }
    });
    scope.addEventListener('change', function(e){
      // ⚠ the units change with the metric, so a y-range captured on $B would crop a % axis to
      // nothing. Every mode control in the engine drops the zoom for exactly this reason.
      if(e.target.closest('.tm-msel')){ st.metric=e.target.value; st.yr=null; return render(scope); }
      if(e.target.closest('.peg-msel')){ pst.metric=e.target.value; pst.yr=null; return renderPeg(scope); }
    });

    function bind(id, set){ var el=scope.querySelector('#'+id);
      if(el) el.oninput=function(){ var v=parseFloat(el.value); if(isFinite(v)){ set(v); render(scope); } }; }
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
