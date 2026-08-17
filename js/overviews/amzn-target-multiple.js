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

// ── State ────────────────────────────────────────────────────────────────────────
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
    '</style>';

  h += '<p class="ov-lede"><b>What each vintage of the model was worth.</b> Every row is one snapshot of the Summit model. '+
       'Set the multiple you want to assume, and the price target falls out of that snapshot\'s own '+TARGET_YEAR+' revenue, EBITDA and earnings. '+
       'Hold the multiple constant and the only thing moving the target is the model being revised.</p>';

  h += '<div class="tm-warn"><b>The model stores no price target and no target multiple.</b> All 502 metrics in the catalogue were checked — '+
       'nothing for target, multiple, WACC, discount or terminal value exists. So the multiple below is <b>your input</b> and the price target is '+
       'the <b>output</b>; this cannot recover what multiple was actually assumed at each past vintage, because that was never stored.</div>';

  h += '<div class="sens-controls-row sens-row-year">'+
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

// ── Render ───────────────────────────────────────────────────────────────────────
function render(scope){
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
