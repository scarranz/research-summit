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
// ── The EBITDA definition break, sized on FY2027 ─────────────────────────────────
// Across 2026-08-03 → 08-04: FY2027 EBITDA +9.8%, earnings +8.2% — comparable, so FY2027 is
// only mildly affected. The same break on FY2028 was EBITDA +38.2% against earnings +6.9%.
// The redefinition lands mostly in the later years, so working on FY2027 largely sidesteps it.
// Still flagged on the row.
//
// ── What the MCP cannot give ─────────────────────────────────────────────────────
// The workbook carries the chosen multiple and the recorded price target from column EM
// rightward on projection_history. An unfiltered pull of that sheet returns exactly 41 mapped
// series (DEFAULT / SEGM / BBG) and none is a multiple or a target — the connector stops well
// before column EM (the 143rd). So in Live the multiples are inputs. Preview shows the layout
// once those columns are ingested, with clearly-marked stand-ins.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var FWD_YEAR = 2027;
var BREAK_ON = '2026-08-04';

// FY2027, $M / shares in millions, straight from the model's snapshot history.
var SNAPS = [
  { d:'2025-12-18', ebitda:237442, earn: 99503, sh:10721 },
  { d:'2026-02-10', ebitda:259787, earn: 98612, sh:10827 },
  { d:'2026-05-05', ebitda:261050, earn:108304, sh:10827 },
  { d:'2026-05-13', ebitda:301971, earn:109056, sh:10827 },
  { d:'2026-07-30', ebitda:303161, earn:109981, sh:10827 },
  { d:'2026-08-03', ebitda:303161, earn:109981, sh:10827 },
  { d:'2026-08-04', ebitda:332726, earn:119053, sh:10827 },
];
// A row is a revision when the underlying actually moved; otherwise it is a re-parse.
function isRevision(i){
  if(i===0) return true;
  var a=SNAPS[i], b=SNAPS[i-1];
  return !(a.ebitda===b.ebitda && a.earn===b.earn && a.sh===b.sh);
}

// Illustrative only — the paths the recorded multiples might have taken. NOT model data.
var MOCK_EV = [16.0, 15.5, 15.0, 14.5, 14.0, 14.0, 13.5];
var MOCK_PE = [34, 33, 32, 31, 30, 30, 29];

// ── State ────────────────────────────────────────────────────────────────────────
var _mode = 'live';
var _mEv  = 14;
var _mPe  = 32;
var _netDebt = 0;
var _px = null;

// ── Maths ────────────────────────────────────────────────────────────────────────
function eps(s){ return s.earn / s.sh; }
function ptEv(s, m){ return (s.ebitda * (m==null?_mEv:m) - _netDebt) / s.sh; }
function ptPe(s, m){ return eps(s) * (m==null?_mPe:m); }

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){ var b=v/1000; return (Math.abs(b)>=1000)?('$'+(b/1000).toFixed(2)+'T'):('$'+Math.round(b)+'B'); }
function fmtPx(v){ return '$'+Math.round(v).toLocaleString('en-US'); }
function signPct(p){ return (p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'; }
function pctCell(p){ return p==null?'<span style="color:var(--mu)">—</span>'
  :'<span style="color:'+(p>=0?'#2E8B57':'#C0392B')+'">'+signPct(p)+'</span>'; }

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
    '.tm-mock{border:1px dashed #8E44AD;background:repeating-linear-gradient(45deg,rgba(142,68,173,.06),'+
      'rgba(142,68,173,.06) 6px,transparent 6px,transparent 12px);border-radius:9px;padding:11px 14px;'+
      'font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    '.tm-ph{color:#8E44AD;font-weight:800;border-bottom:1px dashed #8E44AD}'+
    '.tm-attr{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}'+
    '.tm-attr-c{border:1px solid var(--bdr);border-top:3px solid var(--brand);border-radius:10px;padding:11px 13px;background:#fff}'+
    '.tm-attr-v{font-size:18px;font-weight:800;line-height:1.15}'+
    '.tm-attr-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.tm-attr-s{font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.4}'+
    '</style>';

  h += '<p class="ov-lede"><b>The revision log.</b> One row per snapshot of the model. Each quarter the reported numbers get revised and a forward '+
       'multiple is picked on <b>FY'+FWD_YEAR+'</b> — EV/EBITDA and P/E — giving a <b>year-end price target</b>. Set both multiples below and hold them: '+
       'everything that then moves is the model being revised, not the multiple.</p>';

  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Mode</span><div class="sens-years">'+
         '<button type="button" class="sens-year" data-tmmode="live">Live — MCP data</button>'+
         '<button type="button" class="sens-year" data-tmmode="preview">Preview — with recorded multiple</button>'+
       '</div></div></div>';

  h += '<div class="sens-controls-row sens-row-inp" id="tmLiveCtrls">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">EV/EBITDA '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmEv" type="number" step="0.5" value="'+_mEv+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">P/E '+FWD_YEAR+'</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmPe" type="number" step="0.5" value="'+_mPe+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Net debt</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmNd" type="number" step="1000" value="'+_netDebt+'"><span class="sens-inp-u">$M</span></span></div>'+
       '</div>';

  h += '<div id="tmWarn"></div><div class="dfin-wrap" id="tmTable"></div><div class="ov-foot" id="tmFoot"></div>';
  return h;
}

// ── Live render ──────────────────────────────────────────────────────────────────
function renderLive(scope){
  var rows='', prevEv=null, prevPe=null, revs=0;
  SNAPS.forEach(function(s,i){
    var rev=isRevision(i); if(rev) revs++;
    var pe_=ptPe(s), ev_=ptEv(s);
    var dEv=(prevEv!=null)?(ev_/prevEv-1):null, dPe=(prevPe!=null)?(pe_/prevPe-1):null;
    var brk=(s.d===BREAK_ON);
    var cls=(i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"');
    rows+='<tr'+cls+'>'+
      '<td><b>'+esc(s.d)+'</b>'+
        (rev?'<span class="tm-tag tm-tag-rev">revision</span>':'<span class="tm-tag tm-tag-rep">re-parse</span>')+
        (brk?'<span class="tm-tag tm-tag-brk">EBITDA redefined</span>':'')+'</td>'+
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
      '<th>Snapshot</th><th>EBITDA '+FWD_YEAR+'</th><th>Earnings '+FWD_YEAR+'</th><th>EPS</th>'+
      '<th>Target @ '+_mEv+'× EV/EBITDA</th><th>Δ</th>'+
      '<th>Target @ '+_mPe+'× P/E</th><th>Δ</th><th>EV vs P/E</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';

  var f=SNAPS[0], l=SNAPS[SNAPS.length-1];
  scope.querySelector('#tmWarn').innerHTML=
    '<div class="dd-note" style="margin:10px 0"><b>'+revs+' of '+SNAPS.length+' snapshots are real revisions.</b> '+
    '2026-08-03 repeats 2026-07-30 byte for byte on FY'+FWD_YEAR+' EBITDA and earnings, so it is a re-parse and is greyed out — '+
    'the revision cadence that actually happened is roughly quarterly, as you would expect from reporting dates. '+
    'On FY'+FWD_YEAR+' the 08-04 EBITDA redefinition is mild (+9.8% against +8.2% on earnings); the same change on FY2028 was +38.2% against +6.9%, '+
    'so working the forward year at '+FWD_YEAR+' largely sidesteps it.</div>';

  scope.querySelector('#tmFoot').innerHTML=
    'FY'+FWD_YEAR+' EBITDA, earnings and share count per snapshot from the Summit DCF model (instrument AMZN, model be6d6393), read through the '+
    'revision history. <b>Year-end target</b> = EBITDA × your EV/EBITDA multiple less net debt over shares, and EPS × your P/E multiple — both '+
    'multiples shown side by side because the desk sets both. <b>EV vs P/E</b> is the spread between the two targets, which is the disagreement '+
    'between the two methods at your chosen multiples. Share count is the model\'s own and moves (10,721 in the first vintage, 10,827 after). '+
    'Net debt is '+fmtB(_netDebt)+', from the live quote. Revenue per snapshot is not pulled — neither target path uses it — and is one more query if wanted. '+
    'At the multiples above the '+FWD_YEAR+' target moved '+signPct(ptEv(l)/ptEv(f)-1)+' on EV/EBITDA and '+signPct(ptPe(l)/ptPe(f)-1)+' on P/E across the log. '+
    'The multiples are your input: the recorded ones live past column EM on projection_history and the connector does not reach them. '+
    'Data sourced from Summit DCF models.';
}

// ── Preview render ───────────────────────────────────────────────────────────────
function renderPreview(scope){
  var ph=function(t){ return '<span class="tm-ph">'+t+'</span>'; };
  var rows='', prev=null;
  SNAPS.forEach(function(s,i){
    var rev=isRevision(i);
    var mev=MOCK_EV[i], mpe=MOCK_PE[i];
    var pev=ptEv(s,mev), ppe=ptPe(s,mpe), rec=(pev+ppe)/2;   // "recorded" target, illustrative
    var d=(prev!=null)?(rec/prev-1):null;
    rows+='<tr'+((i===SNAPS.length-1)?' class="tm-last"':(rev?'':' class="tm-rep"'))+'>'+
      '<td><b>'+esc(s.d)+'</b>'+(rev?'<span class="tm-tag tm-tag-rev">revision</span>':'<span class="tm-tag tm-tag-rep">re-parse</span>')+'</td>'+
      '<td>'+fmtB(s.ebitda)+'</td><td>'+fmtB(s.earn)+'</td><td>$'+eps(s).toFixed(2)+'</td>'+
      '<td>'+ph(mev.toFixed(1)+'×')+'</td><td>'+ph(mpe.toFixed(0)+'×')+'</td>'+
      '<td class="tm-pt">'+ph(fmtPx(rec))+'</td><td>'+pctCell(d)+'</td>'+
      '</tr>';
    prev=rec;
  });

  var e0=eps(SNAPS[0]), e1=eps(SNAPS[SNAPS.length-1]);
  var m0=MOCK_PE[0], m1=MOCK_PE[MOCK_PE.length-1];
  var fund=(e1-e0)*m0, mult=(m1-m0)*e0, inter=(e1-e0)*(m1-m0), tot=e1*m1-e0*m0;
  function card(v,k,s2){ return '<div class="tm-attr-c"><div class="tm-attr-v" style="color:'+(v>=0?'#2E8B57':'#C0392B')+'">'+
    (v>=0?'+':'−')+'$'+Math.abs(v).toFixed(0)+'</div><div class="tm-attr-k">'+esc(k)+'</div><div class="tm-attr-s">'+esc(s2)+'</div></div>'; }

  scope.querySelector('#tmTable').innerHTML=
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th><th>EBITDA '+FWD_YEAR+'</th><th>Earnings '+FWD_YEAR+'</th><th>EPS</th>'+
      '<th>EV/EBITDA chosen</th><th>P/E chosen</th><th>Recorded year-end target</th><th>Δ</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>'+
    '<div class="tm-attr">'+
      card(tot,'Total move in the target','first revision to latest, on P/E')+
      card(fund,'From the model','earnings revised, multiple held')+
      card(mult,'From the multiple','re-rating, earnings held')+
      card(inter,'Interaction','both moving together')+
    '</div>';

  scope.querySelector('#tmWarn').innerHTML=
    '<div class="tm-mock"><b>Preview — the three purple columns are stand-ins, not data.</b> EBITDA, earnings, EPS and share count are '+
    '<b>real</b> FY'+FWD_YEAR+' figures from the snapshot history. The <span class="tm-ph">chosen multiples</span> follow hard-coded illustrative '+
    'paths (EV/EBITDA '+MOCK_EV[0]+'× → '+MOCK_EV[MOCK_EV.length-1]+'×, P/E '+MOCK_PE[0]+'× → '+MOCK_PE[MOCK_PE.length-1]+'×) and the '+
    '<span class="tm-ph">recorded target</span> is their midpoint. This is the shape the page takes once the workbook\'s own columns are ingested.</div>';

  scope.querySelector('#tmFoot').innerHTML=
    '<b>What the recorded multiple unlocks.</b> With the chosen multiple stored beside the target, the move in the target splits into the part that '+
    'came from <b>revising the business</b> and the part that came from <b>changing what you pay for it</b> — the cards above, computed on the P/E leg. '+
    'On the illustrative path EPS goes $'+e0.toFixed(2)+' to $'+e1.toFixed(2)+', worth <b>+$'+fund.toFixed(0)+'</b> at the original multiple, while the '+
    'multiple goes '+m0+'× to '+m1+'×, worth <b>−$'+Math.abs(mult).toFixed(0)+'</b>. That decomposition is the thing you cannot get today, because only '+
    'the underlying is readable. <b>To make it real:</b> the connector ingests projection_history past column EM, or drop the workbook where I can read it '+
    '(the xlsx parser from the AppLovin build handles it) — one file per revision for the history, otherwise the latest gives the current row only. '+
    'Underlying: Summit DCF model, instrument AMZN, model be6d6393, FY'+FWD_YEAR+'. Data sourced from Summit DCF models.';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
  scope.querySelectorAll('[data-tmmode]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmmode')===_mode); });
  var lc=scope.querySelector('#tmLiveCtrls');
  if(lc) lc.style.display=(_mode==='preview')?'none':'';
  if(_mode==='preview') renderPreview(scope); else renderLive(scope);
}

// ── Init ─────────────────────────────────────────────────────────────────────────
function initTm(root){
  var scope=root.querySelector('.ovt-subpane[data-ovst="targetmult"]');
  if(!scope || !scope.querySelector('#tmTable')) return;
  if(!scope._wired){
    scope._wired=true;
    scope.querySelectorAll('[data-tmmode]').forEach(function(b){ b.onclick=function(){
      _mode=b.getAttribute('data-tmmode'); render(scope); }; });
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
