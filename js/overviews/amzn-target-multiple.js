// overviews/amzn-target-multiple.js — Amazon (AMZN) Deep Dive ▸ Valuation ▸ Target Multiple.
//
// One row per model snapshot: the multiple you assume, the price target it implies, and the
// underlying revenue / EBITDA / earnings that got you there. Hold the multiple constant and the
// only thing moving the price target is the model itself — that is the whole point of the view.
//
// ── What the model does and does not carry ───────────────────────────────────────
// Checked all 502 metrics in the catalogue: the Summit model stores NO price target and NO
// target multiple. Nothing matching target / multiple / WACC / discount / terminal exists.
// So the multiple here is an INPUT (yours) and the price target is the OUTPUT. This view cannot
// reconstruct what multiple was assumed at each historical vintage, because that was never stored.
//
// ── The EBITDA definition break — read this before trusting an EV/EBITDA target ──
// Between the 2026-08-03 and 2026-08-04 snapshots, one day apart:
//     revenue   +1.9%      earnings  +6.9%      EBITDA  +38.2%  (311.1B → 430.1B)
// Revenue and earnings moved like a normal revision. EBITDA did not — that is a change in how
// EBITDA is defined, not in what the business is expected to earn. A constant EV/EBITDA multiple
// therefore shows a fake +38% jump in the price target across that boundary. Earnings is the
// series that stays comparable across all seven snapshots; EBITDA is not. The UI flags the break
// on the affected row and in the P/E-vs-EV/EBITDA note. Flagged for the model owner.
//
// Source: Summit DCF model, instrument AMZN, model be6d6393. Target year 2028 (the horizon year
// populated in every snapshot). Values are AMZN:rev · AMZN:ebitda · AMZN:earnings · AMZN:shares
// read per snapshot via the model's revision history.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var TARGET_YEAR = 2028;
var BREAK_FROM  = '2026-08-04';        // first snapshot on the new EBITDA definition

// $M, and shares in millions, straight from the model's snapshot history for FY2028.
var SNAPS = [
  { d:'2025-12-18', rev:1075129, ebitda:258487, earn:109171, sh:10721 },
  { d:'2026-02-10', rev:1096753, ebitda:278013, earn:109377, sh:10827 },
  { d:'2026-05-05', rev:1115060, ebitda:291994, earn:114955, sh:10827 },
  { d:'2026-05-13', rev:1078691, ebitda:309579, earn:127388, sh:10827 },
  { d:'2026-07-30', rev:1080618, ebitda:311084, earn:128556, sh:10827 },
  { d:'2026-08-03', rev:1080618, ebitda:311084, earn:128556, sh:10827 },
  { d:'2026-08-04', rev:1101190, ebitda:430088, earn:137412, sh:10827 },
];

// ── PREVIEW MODE — the layout once the model's own columns are wired ─────────────
// The workbook carries the assumed multiple and the resulting price target from column EM
// rightward on the projection_history sheet. The MCP does not ingest that far: an unfiltered
// pull of projection_history returns exactly 41 mapped series (DEFAULT / SEGM / BBG) and none
// of them is a multiple or a target. So those two columns cannot be read yet.
//
// Preview mode shows the layout we would ship once they can be. Rule for the stand-in values,
// stated so nobody mistakes them for data: the multiple path below is HARD-CODED, and the
// "model" price target is simply EPS x that multiple. Underlying revenue / EBITDA / earnings /
// EPS / shares in preview mode are REAL, straight from the model's snapshot history.
var MOCK_MULT = [32, 31, 30, 29, 28, 28, 27];   // illustrative de-rating path — NOT model data

// ── State ────────────────────────────────────────────────────────────────────────
var _mode  = 'live';      // 'live' = what the MCP can actually serve · 'preview' = the mock
var _basis = 'pe';        // default to P/E: it is the series that survives the definition break
var _mEv   = 12;
var _mPe   = 30;
var _over  = {};          // snapshot date -> per-row multiple override
var _netDebt = 0;         // $M, from the live quote
var _px = null;           // live price

function baseMult(){ return _basis==='ev' ? _mEv : _mPe; }
function multFor(s){ return _over[s.d]!=null ? _over[s.d] : baseMult(); }
function multLabel(){ return _basis==='ev' ? 'EV/EBITDA' : 'P/E'; }
function isBroken(s){ return _basis==='ev' && s.d >= BREAK_FROM; }

function pt(s){
  var m = multFor(s);
  return _basis==='ev' ? ((s.ebitda*m - _netDebt)/s.sh) : ((s.earn/s.sh)*m);
}
// What multiple today's price implies against that snapshot's underlying.
function impliedMult(s){
  if(_px==null) return null;
  return _basis==='ev' ? ((_px*s.sh + _netDebt)/s.ebitda) : (_px/(s.earn/s.sh));
}

// ── Formatting ───────────────────────────────────────────────────────────────────
function fmtB(v){ var b=v/1000; return (Math.abs(b)>=1000)?('$'+(b/1000).toFixed(2)+'T'):('$'+Math.round(b)+'B'); }
function fmtPx(v){ return '$'+Math.round(v).toLocaleString('en-US'); }
function signPct(p){ return (p>=0?'+':'−')+(Math.abs(p)*100).toFixed(1)+'%'; }
function pctCell(p){ return p==null?'—':'<span style="color:'+(p>=0?'#2E8B57':'#C0392B')+'">'+signPct(p)+'</span>'; }

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
    '.tm-tbl tbody tr:last-child{background:rgba(255,153,0,.07)}'+
    '.tm-tbl td.tm-pt{font-weight:800;color:var(--navy)}'+
    '.tm-brk{background:rgba(192,57,43,.07)}'+
    '.tm-flag{display:inline-block;font-size:9px;font-weight:800;color:#C0392B;border:1px solid #C0392B;border-radius:20px;padding:1px 6px;margin-left:6px;vertical-align:1px}'+
    '.tm-mi{width:52px;border:1px solid var(--bdr);border-radius:6px;padding:4px 6px;font:inherit;font-size:12px;font-weight:700;text-align:right;color:var(--navy)}'+
    '.tm-warn{border:1px solid rgba(192,57,43,.35);border-left:4px solid #C0392B;background:rgba(192,57,43,.05);'+
      'border-radius:9px;padding:11px 14px;font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    // preview mode: anything not real is hatched and carries a marker, so it cannot pass as data
    '.tm-mock{border:1px dashed #8E44AD;background:repeating-linear-gradient(45deg,rgba(142,68,173,.06),'+
      'rgba(142,68,173,.06) 6px,transparent 6px,transparent 12px);border-radius:9px;padding:11px 14px;'+
      'font-size:12px;line-height:1.55;color:var(--navy);margin:12px 0}'+
    '.tm-ph{color:#8E44AD;font-weight:800;border-bottom:1px dashed #8E44AD}'+
    '.tm-ph:after{content:"\\25CA";font-size:8px;vertical-align:6px;margin-left:2px}'+
    '.tm-attr{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}'+
    '.tm-attr-c{border:1px solid var(--bdr);border-top:3px solid var(--brand);border-radius:10px;padding:11px 13px;background:#fff}'+
    '.tm-attr-v{font-size:18px;font-weight:800;line-height:1.15}'+
    '.tm-attr-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.tm-attr-s{font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.4}'+
    '</style>';

  h += '<p class="ov-lede"><b>What each vintage of the model was worth.</b> Every row is one snapshot of the Summit model. '+
       'Set the multiple you want to assume, and the price target falls out of that snapshot\'s own '+TARGET_YEAR+' revenue, EBITDA and earnings. '+
       'Hold the multiple constant and the only thing moving the target is the model being revised.</p>';

  h += '<div class="tm-warn"><b>The workbook has the assumed multiple and the price target; the MCP does not serve them.</b> '+
       'They sit from column <b>EM</b> rightward on the <i>projection_history</i> sheet, but an unfiltered pull of that sheet returns exactly '+
       '<b>41 mapped series</b> (DEFAULT / SEGM / BBG) and none is a multiple or a target — the connector stops well before column EM (the 143rd). '+
       'So in <b>Live</b> the multiple below is <b>your input</b> and the price target is the <b>output</b>. '+
       '<b>Preview</b> shows the layout we would ship once those two columns are ingested.</div>';

  h += '<div class="sens-controls-row sens-row-year">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Mode</span><div class="sens-years">'+
         '<button type="button" class="sens-year'+(_mode==='live'?' active':'')+'" data-tmmode="live">Live — MCP data</button>'+
         '<button type="button" class="sens-year'+(_mode==='preview'?' active':'')+'" data-tmmode="preview">Preview — with model multiple</button>'+
       '</div></div>'+
       '</div>';

  h += '<div class="sens-controls-row sens-row-year" id="tmLiveCtrls">'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Multiple on</span><div class="sens-years">'+
         '<button type="button" class="sens-year'+(_basis==='pe'?' active':'')+'" data-tmbasis="pe">P/E</button>'+
         '<button type="button" class="sens-year'+(_basis==='ev'?' active':'')+'" data-tmbasis="ev">EV/EBITDA</button>'+
       '</div></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l" id="tmMultL">'+multLabel()+' assumed</span><span class="sens-inp-wrap">'+
         '<input class="sens-inp" id="tmMult" type="number" step="0.5" value="'+baseMult()+'"><span class="sens-inp-u">×</span></span></div>'+
       '<div class="sens-ctrl"><span class="sens-ctrl-l">Target year</span><span class="sens-ctrl-l" style="color:var(--navy)">'+TARGET_YEAR+'</span></div>'+
       '<button type="button" class="sens-year" id="tmReset" style="font-size:11px;padding:5px 11px">reset row multiples</button>'+
       '</div>';

  h += '<div id="tmWarn"></div>';
  h += '<div class="dfin-wrap" id="tmTable"></div>';
  h += '<div class="ov-foot" id="tmFoot"></div>';
  return h;
}

// ── Preview render — the layout once columns EM+ are ingested ────────────────────
function renderPreview(scope){
  var ph = function(t){ return '<span class="tm-ph">'+t+'</span>'; };
  var rows = '', prevPt = null;
  SNAPS.forEach(function(s, i){
    var eps = s.earn/s.sh;
    var mm  = MOCK_MULT[i];                 // would be the model's own assumed multiple
    var mpt = eps * mm;                     // would be the model's own price target
    var dPrev = (prevPt!=null) ? (mpt/prevPt - 1) : null;
    rows += '<tr>'+
      '<td><b>'+esc(s.d)+'</b>'+(i===SNAPS.length-1?' <span style="font-size:9.5px;color:var(--mu)">latest</span>':'')+'</td>'+
      '<td>'+fmtB(s.rev)+'</td>'+
      '<td>'+fmtB(s.ebitda)+'</td>'+
      '<td>'+fmtB(s.earn)+'</td>'+
      '<td>$'+eps.toFixed(2)+'</td>'+
      '<td>'+ph(mm.toFixed(1)+'×')+'</td>'+
      '<td class="tm-pt">'+ph(fmtPx(mpt))+'</td>'+
      '<td>'+pctCell(dPrev)+'</td>'+
      '</tr>';
    prevPt = mpt;
  });

  // Δ price target decomposed: how much came from the model, how much from the re-rating.
  var e0 = SNAPS[0].earn/SNAPS[0].sh, m0 = MOCK_MULT[0];
  var e1 = SNAPS[SNAPS.length-1].earn/SNAPS[SNAPS.length-1].sh, m1 = MOCK_MULT[MOCK_MULT.length-1];
  var fund = (e1-e0)*m0, mult = (m1-m0)*e0, inter = (e1-e0)*(m1-m0), tot = e1*m1 - e0*m0;
  function card(v, k, s2){
    return '<div class="tm-attr-c"><div class="tm-attr-v" style="color:'+(v>=0?'#2E8B57':'#C0392B')+'">'+
      (v>=0?'+':'−')+'$'+Math.abs(v).toFixed(0)+'</div><div class="tm-attr-k">'+esc(k)+'</div>'+
      '<div class="tm-attr-s">'+esc(s2)+'</div></div>';
  }

  scope.querySelector('#tmTable').innerHTML =
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th><th>Revenue '+TARGET_YEAR+'</th><th>EBITDA '+TARGET_YEAR+'</th>'+
      '<th>Earnings '+TARGET_YEAR+'</th><th>EPS</th>'+
      '<th>Multiple assumed <span class="tm-ph" style="border:none"></span></th>'+
      '<th>Model price target</th><th>vs prior snap</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>'+
    '<div class="tm-attr">'+
      card(tot,  'Total move in the target', 'first vintage to latest')+
      card(fund, 'From the model',           'earnings revised, multiple held')+
      card(mult, 'From the multiple',        're-rating, earnings held')+
      card(inter,'Interaction',              'both moving together')+
    '</div>';

  scope.querySelector('#tmWarn').innerHTML =
    '<div class="tm-mock"><b>Preview — the two purple columns are stand-ins, not data.</b> Revenue, EBITDA, earnings, EPS and share count are '+
    '<b>real</b>, read from the model\'s snapshot history. The <span class="tm-ph">multiple</span> follows a hard-coded illustrative path '+
    '('+MOCK_MULT.join('× → ')+'×) and the <span class="tm-ph">price target</span> is simply EPS × that multiple. '+
    'They are here to show the shape, and every one of them is marked.</div>';

  scope.querySelector('#tmFoot').innerHTML =
    '<b>What this unlocks.</b> With the model\'s own multiple beside its own price target, the change in the target splits cleanly into the part '+
    'that came from <b>revising the business</b> and the part that came from <b>changing what you pay for it</b> — the four cards above. On the '+
    'illustrative path that is the whole story of the year: earnings went from $'+e0.toFixed(2)+' to $'+e1.toFixed(2)+' of EPS, worth '+
    '<b>+$'+fund.toFixed(0)+'</b> at the original multiple, while the multiple went '+m0+'× to '+m1+'×, worth <b>−$'+Math.abs(mult).toFixed(0)+'</b> — '+
    'so a materially better model produced a target that barely moved. That decomposition is impossible today, because only one of the two inputs is readable. '+
    '<b>To make this real:</b> either the connector ingests projection_history past column EM, or drop the workbook somewhere I can read it '+
    '(the xlsx parser from the AppLovin build handles it) — one file per snapshot if you want the history, otherwise the latest gives the current row only. '+
    'Underlying figures: Summit DCF model, instrument AMZN, model be6d6393, FY'+TARGET_YEAR+'. Data sourced from Summit DCF models.';
}

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
  // Drive the toggles off _mode/_basis here, so the buttons can never disagree with the content.
  scope.querySelectorAll('[data-tmmode]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmmode')===_mode); });
  scope.querySelectorAll('[data-tmbasis]').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tmbasis')===_basis); });
  var lc = scope.querySelector('#tmLiveCtrls');
  if(lc) lc.style.display = (_mode==='preview') ? 'none' : '';
  if(_mode==='preview'){ renderPreview(scope); return; }
  var rows = '', prevPt = null;
  SNAPS.forEach(function(s, i){
    var p = pt(s), im = impliedMult(s);
    var dPrev = (prevPt!=null) ? (p/prevPt - 1) : null;
    var up = (_px!=null) ? (p/_px - 1) : null;
    var brk = isBroken(s) && i>0 && !isBroken(SNAPS[i-1]);
    rows += '<tr'+(brk?' class="tm-brk"':'')+'>'+
      '<td><b>'+esc(s.d)+'</b>'+(i===SNAPS.length-1?' <span style="font-size:9.5px;color:var(--mu)">latest</span>':'')+
        (brk?'<span class="tm-flag">definition break</span>':'')+'</td>'+
      '<td>'+fmtB(s.rev)+'</td>'+
      '<td'+(isBroken(s)?' style="color:#C0392B"':'')+'>'+fmtB(s.ebitda)+'</td>'+
      '<td>'+fmtB(s.earn)+'</td>'+
      '<td>$'+(s.earn/s.sh).toFixed(2)+'</td>'+
      '<td><input class="tm-mi" type="number" step="0.5" data-tmrow="'+esc(s.d)+'" value="'+multFor(s)+'"></td>'+
      '<td class="tm-pt">'+fmtPx(p)+'</td>'+
      '<td>'+pctCell(dPrev)+'</td>'+
      '<td>'+(im!=null ? im.toFixed(1)+'×' : '—')+'</td>'+
      '<td>'+pctCell(up)+'</td>'+
      '</tr>';
    prevPt = p;
  });

  scope.querySelector('#tmTable').innerHTML =
    '<table class="tm-tbl"><thead><tr>'+
      '<th>Snapshot</th><th>Revenue '+TARGET_YEAR+'</th><th>EBITDA '+TARGET_YEAR+'</th>'+
      '<th>Earnings '+TARGET_YEAR+'</th><th>EPS</th><th>Multiple</th><th>Price target</th>'+
      '<th>vs prior snap</th><th>Implied at spot</th><th>Upside</th>'+
    '</tr></thead><tbody>'+rows+'</tbody></table>';

  var first = pt(SNAPS[0]), last = pt(SNAPS[SNAPS.length-1]);
  scope.querySelector('#tmWarn').innerHTML = (_basis==='ev')
    ? '<div class="tm-warn"><b>You are on EV/EBITDA, which breaks across the 2026-08-04 snapshot.</b> Between 08-03 and 08-04 — one day — '+
      'revenue moved +1.9% and earnings +6.9%, but EBITDA moved <b>+38.2%</b> ($311B → $430B). That is a change in how EBITDA is defined, not in '+
      'what the business is expected to earn, so the jump in the price target on that row is an artefact. <b>Switch to P/E</b> for a like-for-like '+
      'read across all seven vintages.</div>'
    : '<div class="dd-note" style="margin:10px 0">Earnings is the series that stays comparable across all seven snapshots '+
      '(109.2B → 137.4B, a steady climb). EV/EBITDA is available above but breaks on 2026-08-04 — see the flag on that row.</div>';

  scope.querySelector('#tmFoot').innerHTML =
    'One row per snapshot of the Summit DCF model (instrument AMZN, model be6d6393), read through the model\'s revision history for FY'+TARGET_YEAR+': '+
    'AMZN:rev, AMZN:ebitda, AMZN:earnings and AMZN:shares. <b>Price target</b> = '+
    (_basis==='ev' ? 'that snapshot\'s EBITDA × the multiple, less net debt, over that snapshot\'s share count'
                   : 'that snapshot\'s earnings ÷ its share count × the multiple')+
    '. The multiple is set by you — globally at the top, or per row — because the model stores none. '+
    '<b>Implied at spot</b> reverses it: the multiple today\'s price is paying against that vintage\'s '+(_basis==='ev'?'EBITDA':'EPS')+'. '+
    'Share count is the model\'s own and does move (10,721 in the 2025-12-18 vintage, 10,827 after). Net debt is '+fmtB(_netDebt)+', from the live quote. '+
    'The '+TARGET_YEAR+' target year is fixed for now — it is the horizon year populated in every snapshot; other years are one more data pull. '+
    'Price target moved '+signPct(last/first-1)+' from the first vintage to the latest at a constant multiple. '+
    'Data sourced from Summit DCF models.';
}

// ── Init ─────────────────────────────────────────────────────────────────────────
function initTm(root){
  var scope = root.querySelector('.ovt-subpane[data-ovst="targetmult"]');
  if(!scope || !scope.querySelector('#tmTable')) return;

  if(!scope._wired){
    scope._wired = true;
    scope.querySelectorAll('[data-tmmode]').forEach(function(b){ b.onclick=function(){
      _mode = b.getAttribute('data-tmmode');
      scope.querySelectorAll('[data-tmmode]').forEach(function(x){ x.classList.toggle('active', x===b); });
      render(scope);
    }; });
    scope.querySelectorAll('[data-tmbasis]').forEach(function(b){ b.onclick=function(){
      _basis = b.getAttribute('data-tmbasis'); _over = {};
      scope.querySelectorAll('[data-tmbasis]').forEach(function(x){ x.classList.toggle('active', x===b); });
      scope.querySelector('#tmMultL').textContent = multLabel()+' assumed';
      scope.querySelector('#tmMult').value = baseMult();
      render(scope);
    }; });
    var mi = scope.querySelector('#tmMult');
    mi.oninput = function(){ var v=parseFloat(mi.value); if(!isFinite(v)||v<=0) return;
      if(_basis==='ev') _mEv=v; else _mPe=v; _over={}; render(scope); };
    scope.querySelector('#tmReset').onclick = function(){ _over={}; render(scope); };
    // per-row multiple overrides (delegated — the table is re-rendered on every change)
    scope.querySelector('#tmTable').addEventListener('input', function(e){
      var el = e.target.closest('[data-tmrow]'); if(!el) return;
      var v = parseFloat(el.value); if(!isFinite(v)||v<=0) return;
      _over[el.getAttribute('data-tmrow')] = v;
      var keep = el.getAttribute('data-tmrow');
      render(scope);
      var again = scope.querySelector('[data-tmrow="'+keep+'"]'); if(again) again.focus();
    });

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

export var amznTargetMult = { body: tmBody, init: initTm };
