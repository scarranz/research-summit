// overviews/googl-own.js — Alphabet Deep Dive ▸ Management ▸ Ownership (MG-OWN, playbook §15).
//
// COPIED from js/overviews/meta-own.js (the holder TABLE SAB chose for TSM, Oct 16 2026; .twrap + .rt, not Amazon's box
// layout), adapted to Alphabet's three share classes: Class A (1 vote), Class B (10 votes, held mostly by the founders)
// and Class C (no vote). The proxy's ownership table covers only the VOTING classes (A and B), so "Value" is the voting
// shares only — a holder's Class C is not disclosed there. Class structure from the 10-Q 2Q26 cover (shares outstanding,
// Jul 15 2026). Relocation #47: Dani's "approximate" class bars are replaced by these filed figures.
// Sources: Alphabet 2026 proxy statement (DEF 14A, filed Apr 24 2026), "Common Stock Ownership of Certain Beneficial
// Owners and Management", as of Apr 6 2026; Form 10-Q for 2Q26 (filed Jul 23 2026), cover page — reported figures
// (rule 10 allows them in a file).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var OUT_A = 5823665113, OUT_B = 835779041;          // voting shares outstanding, Apr 6 2026 (proxy)
var VOTES = OUT_A + 10 * OUT_B;
// [name, position, group, Class A, Class B, note]
var INSIDERS = [
  ['Larry Page', 'Co-Founder · director since 1998', 'board', 0, 389051160, ''],
  ['Sergey Brin', 'Co-Founder · director since 1998', 'board', 37469, 358939978, 'includes 345,400 Class B held by two charitable remainder unitrusts of which he is sole trustee'],
  ['L. John Doerr', 'Director since 1999', 'board', 472165, 22348940, 'Class B held by Vallejo Ventures Trust; 402,465 Class A held by The Benificus Foundation (no pecuniary interest)'],
  ['K. Ram Shriram', 'Director since 1998', 'board', 1811108, 0, 'held directly, by his spouse, Janket Ventures LP and four family GRATs'],
  ['Sundar Pichai', 'CEO, Alphabet and Google · director since 2017', 'exec', 227560, 0, ''],
  ['Ruth M. Porat', 'President & Chief Investment Officer', 'exec', 28060, 0, 'held by the Passfield Hall Foundation (no pecuniary interest)'],
  ['John L. Hennessy', 'Chair of the Board · director since 2004', 'board', 20624, 0, 'held by the Hennessy 1993 Revocable Trust'],
  ['Anat Ashkenazi', 'SVP & CFO', 'exec', 0, 0, ''],
  ['Philipp Schindler', 'SVP & Chief Business Officer', 'exec', 0, 0, ''],
  ['Kent Walker', 'President, Global Affairs & CLO', 'exec', 0, 0, ''],
  ['Frances H. Arnold', 'Director since 2019', 'board', 0, 0, ''],
  ['R. Martin “Marty” Chávez', 'Director since 2022', 'board', 0, 0, ''],
  ['Roger W. Ferguson Jr.', 'Director since 2016', 'board', 0, 0, ''],
  ['Robin L. Washington', 'Director since 2019', 'board', 0, 0, ''],
];
var GROUP = { a: 2596986, b: 770340078, n: 14 };    // all executive officers and directors, as a group (proxy)
// Other holders above 5% of a class (the proxy, from their Schedule 13G filings)
var HOLDERS5 = [
  ['BlackRock, Inc.', 356934964, 0],
];
// Class structure — 10-Q 2Q26 cover, shares outstanding as of Jul 15 2026 (millions)
var CLASSES = [
  { c:'Class A', tk:'GOOGL', v:1,  sh:5868, who:'public; listed on Nasdaq' },
  { c:'Class B', tk:'—',     v:10, sh:835,  who:'mostly the founders; not listed, converts to Class A one-for-one' },
  { c:'Class C', tk:'GOOG',  v:0,  sh:5527, who:'public; listed on Nasdaq; used for stock pay and buybacks' },
];
var SRC = 'Alphabet 2026 proxy statement (DEF 14A, SEC EDGAR, filed Apr 24 2026), Common Stock Ownership of Certain Beneficial Owners and Management, as of Apr 6 2026: 5,823,665,113 Class A and 835,779,041 Class B shares outstanding';

function fmtN(v){ return v ? Math.round(v).toLocaleString('en-US') : '—'; }
function fmtPct(p){ return p===0 ? '—' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var LIST = INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], a:r[3], b:r[4], note:r[5] }; })
  .sort(function(x,y){ return (y.a+10*y.b)-(x.a+10*x.b); });
function voting(h){ return (h.a + h.b) / (OUT_A + OUT_B); }
function votes(h){ return (h.a + 10 * h.b) / VOTES; }
function val(h){ return OWN.px!=null ? fmtUsd((h.a + h.b) * OWN.px) : NIL; }

function rowsHtml(){
  var list = LIST.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  return list.map(function(h, i){
    return '<tr><td class="own-rk">'+(i+1)+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
      '<td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(h.a)+'</td><td>'+fmtN(h.b)+'</td>'+
      '<td>'+fmtPct(voting(h))+'</td><td><b>'+fmtPct(votes(h))+'</b></td><td>'+val(h)+'</td></tr>';
  }).join('') +
  '<tr class="own-tot"><td></td><td>All executive officers and directors <span class="own-note">'+GROUP.n+' people, as a group</span></td><td></td>'+
    '<td>'+fmtN(GROUP.a)+'</td><td>'+fmtN(GROUP.b)+'</td><td>'+fmtPct(voting(GROUP))+'</td><td><b>'+fmtPct(votes(GROUP))+'</b></td><td>'+val(GROUP)+'</td></tr>';
}
function holders5Html(){
  return HOLDERS5.map(function(r){ var h={ a:r[1], b:r[2] };
    return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+fmtN(h.a)+'</td><td>'+fmtPct(h.a/OUT_A)+'</td><td><b>'+fmtPct(votes(h))+'</b></td><td>'+val(h)+'</td></tr>';
  }).join('');
}
function classesHtml(){
  var tot=CLASSES.reduce(function(a,c){ return a+c.sh; },0), vt=CLASSES.reduce(function(a,c){ return a+c.sh*c.v; },0);
  return CLASSES.map(function(c){
    return '<tr><td><b>'+esc(c.c)+'</b><span class="own-note">'+esc(c.who)+'</span></td><td>'+esc(c.tk)+'</td><td>'+c.v+'</td><td>'+c.sh.toLocaleString('en-US')+'M</td>'+
      '<td>'+(c.sh/tot*100).toFixed(1)+'%</td><td><b>'+(vt?(c.sh*c.v/vt*100).toFixed(1):'0.0')+'%</b></td></tr>'; }).join('');
}

export function googlOwnBody(){
  var h='';
  h+='<p class="ov-lede">Who owns Alphabet, and who controls it: the founders’ 10-vote Class B stock is about 6% of all shares and carries a majority of the votes — Larry Page 27.4% and Sergey Brin 25.3% (2026 proxy).</p>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="ggOwnPx">loading live price…</span></div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead><tr><th class="own-rk">#</th><th>Holder</th><th>Position at Alphabet</th>'+
     '<th>Class A</th><th>Class B</th><th>% of voting shares</th><th>% of votes</th><th>Value of voting shares (live)</th></tr></thead><tbody id="ggOwnBody">'+rowsHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Beneficial ownership as of Apr 6 2026 (proxy). The proxy covers only the voting classes: non-voting Class C held by each person is not disclosed there, so "Value" counts Class A and Class B only and understates each holding. Class B carries 10 votes per share and converts to Class A one-for-one.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">The three share classes</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Class</th><th>Ticker</th><th>Votes per share</th><th>Shares outstanding</th><th>% of all shares</th><th>% of votes</th></tr></thead><tbody>'+classesHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Shares outstanding as of Jul 15 2026 (Form 10-Q for 2Q26, cover page). Class C exists so Alphabet can pay in stock and buy back shares without diluting the founders’ vote.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Other holders above 5% of a class</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Holder</th><th>Class A</th><th>% of Class A</th><th>% of votes</th><th>Value (live)</th></tr></thead><tbody id="ggOwn5">'+holders5Html()+'</tbody></table></div>';
  h+='<div class="ov-fynote">BlackRock per its Schedule 13G/A of Feb 12 2024, as the proxy reports it. Vanguard reported about 8.5% of Class A (3.5% of the votes) in Feb 2024 but, after an internal realignment, no longer reports on an aggregated basis, so the proxy does not list it.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: '+esc(SRC)+'. Class structure: Form 10-Q for 2Q26 (filed Jul 23 2026). % of votes = (Class A + 10 × Class B) ÷ all votes. Value = shares × the live GOOGL price (Massive). Institutional holders below 5% are not disclosed in the proxy.</div>';
  return h;
}
export function googlOwnInit(root){
  var sp=root.querySelector('.ov-googl-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#ggOwnBody'); if(b) b.innerHTML=rowsHtml();
    var b5=sp.querySelector('#ggOwn5'); if(b5) b5.innerHTML=holders5Html();
    var px=sp.querySelector('#ggOwnPx'); if(px) px.textContent=OWN.px!=null?('GOOGL $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live price unavailable — values blank':'loading live price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('GOOGL'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}
