// overviews/meta-own.js — Meta Deep Dive ▸ Management ▸ Ownership (MG-OWN, playbook §15).
//
// The holder TABLE SAB chose for TSM (Oct 16 2026; .twrap + .rt, not Amazon's box layout), adapted to Meta's two
// share classes: Class A (1 vote) and Class B (10 votes, held almost entirely by Mark Zuckerberg). Value = (Class A +
// Class B) × the live share price (Massive); Class B converts to Class A one-for-one, so both carry the same price.
// Source: Meta 2026 proxy statement (DEF 14A, filed Apr 16 2026), "Security Ownership of Certain Beneficial Owners
// and Management", as of Apr 1 2026 — reported figures (rule 10 allows them in a file).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var OUT_A = 2196045588, OUT_B = 342377716;          // shares outstanding, Apr 1 2026
var VOTES = OUT_A + 10 * OUT_B;
// [name, position, group, Class A, Class B, note]
var INSIDERS = [
  ['Mark Zuckerberg', 'Founder, Chairman and CEO', 'exec', 639347, 341823978, 'Class A held by CZ Biohub (no pecuniary interest); Class B through his 2006 trust and Chan Zuckerberg entities'],
  ['Christopher K. Cox', 'Chief Product Officer', 'exec', 319428, 0, ''],
  ['Marc L. Andreessen', 'Director since 2008', 'board', 261784, 0, ''],
  ['Javier Olivan', 'Chief Operating Officer', 'exec', 136685, 0, ''],
  ['Andrew Bosworth', 'Chief Technology Officer', 'exec', 85558, 0, ''],
  ['Susan Li', 'Chief Financial Officer', 'exec', 31429, 0, ''],
  ['Nancy Killefer', 'Director since 2020', 'board', 12844, 0, ''],
  ['Tracey T. Travis', 'Director (retired at the 2026 annual meeting)', 'board', 12844, 0, ''],
  ['Andrew W. Houston', 'Director since 2020', 'board', 12761, 0, ''],
  ['Tony Xu', 'Director since 2022', 'board', 8269, 0, ''],
  ['Peggy Alford', 'Director since 2019', 'board', 3713, 0, ''],
  ['John Arnold', 'Director since 2024', 'board', 3162, 0, ''],
  ['Hock E. Tan', 'Director (retired at the 2026 annual meeting)', 'board', 3162, 0, ''],
  ['Robert M. Kimmitt', 'Director since 2020', 'board', 2378, 0, ''],
  ['John Elkann', 'Director since 2024', 'board', 1420, 0, ''],
  ['Dana White', 'Director since 2024', 'board', 1394, 0, ''],
  ['Charles Songhurst', 'Director since 2024', 'board', 1372, 0, ''],
  ['Patrick Collison', 'Director since 2025', 'board', 1063, 0, ''],
];
var GROUP = { a: 1555951, b: 341823978, n: 20 };    // all current executive officers and directors, as a group
// Other holders above 5% of a class (the proxy, from their Schedule 13G filings)
var HOLDERS5 = [
  ['Entities affiliated with BlackRock', 157849942, 0],
  ['Entities affiliated with FMR LLC', 134555687, 0],
];
var SRC = 'Meta 2026 proxy statement (DEF 14A, SEC EDGAR, filed Apr 16 2026), Security Ownership of Certain Beneficial Owners and Management, as of Apr 1 2026: 2,196,045,588 Class A and 342,377,716 Class B shares outstanding';

function fmtN(v){ return v ? Math.round(v).toLocaleString('en-US') : '—'; }
function fmtPct(p){ return p===0 ? '—' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var LIST = INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], a:r[3], b:r[4], note:r[5] }; })
  .sort(function(x,y){ return (y.a+y.b)-(x.a+x.b); });
function econ(h){ return (h.a + h.b) / (OUT_A + OUT_B); }
function votes(h){ return (h.a + 10 * h.b) / VOTES; }
function val(h){ return OWN.px!=null ? fmtUsd((h.a + h.b) * OWN.px) : NIL; }

function rowsHtml(){
  var list = LIST.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  return list.map(function(h, i){
    return '<tr><td class="own-rk">'+(i+1)+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
      '<td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(h.a)+'</td><td>'+fmtN(h.b)+'</td>'+
      '<td>'+fmtPct(econ(h))+'</td><td><b>'+fmtPct(votes(h))+'</b></td><td>'+val(h)+'</td></tr>';
  }).join('') +
  '<tr class="own-tot"><td></td><td>All executive officers and directors <span class="own-note">'+GROUP.n+' people, as a group</span></td><td></td>'+
    '<td>'+fmtN(GROUP.a)+'</td><td>'+fmtN(GROUP.b)+'</td><td>'+fmtPct(econ(GROUP))+'</td><td><b>'+fmtPct(votes(GROUP))+'</b></td><td>'+val(GROUP)+'</td></tr>';
}
function holders5Html(){
  return HOLDERS5.map(function(r){ var h={ a:r[1], b:r[2] };
    return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+fmtN(h.a)+'</td><td>'+fmtPct(h.a/OUT_A)+'</td><td>'+fmtPct(econ(h))+'</td><td><b>'+fmtPct(votes(h))+'</b></td><td>'+val(h)+'</td></tr>';
  }).join('');
}

export function metaOwnBody(){
  var h='';
  h+='<p class="ov-lede">Who owns Meta, and who controls it: through the 10-vote Class B shares, Mark Zuckerberg holds about 13% of the economics and about 61% of the votes.</p>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="meOwnPx">loading live price…</span></div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead><tr><th class="own-rk">#</th><th>Holder</th><th>Position at Meta</th>'+
     '<th>Class A</th><th>Class B</th><th>% of shares</th><th>% of votes</th><th>Value (live)</th></tr></thead><tbody id="meOwnBody">'+rowsHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Beneficial ownership as of Apr 1 2026, including shares from RSUs releasable within 60 days. Class B carries 10 votes per share and converts to Class A one-for-one; '+
     'the 12,000,000 Class B shares held by CZI Holdings I are pledged as collateral (proxy). Tracey Travis and Hock Tan left the board when their terms ended at the 2026 annual meeting.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Other holders above 5% of a class</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Holder</th><th>Class A</th><th>% of Class A</th><th>% of shares</th><th>% of votes</th><th>Value (live)</th></tr></thead><tbody id="meOwn5">'+holders5Html()+'</tbody></table></div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: '+esc(SRC)+'. % of votes = (Class A + 10 × Class B) ÷ all votes. Value = shares × the live price (Massive). Institutional holders below 5% are not disclosed in the proxy.</div>';
  return h;
}
export function metaOwnInit(root){
  var sp=root.querySelector('.ov-meta-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#meOwnBody'); if(b) b.innerHTML=rowsHtml();
    var b5=sp.querySelector('#meOwn5'); if(b5) b5.innerHTML=holders5Html();
    var px=sp.querySelector('#meOwnPx'); if(px) px.textContent=OWN.px!=null?('META $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live price unavailable — values blank':'loading live price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('META'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}
