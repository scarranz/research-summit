// overviews/uber-own.js — Uber Deep Dive ▸ Management ▸ Ownership (MG-OWN, playbook §15).
//
// COPIED from js/overviews/googl-own.js (the holder TABLE SAB chose for TSM, Oct 16 2026; .twrap + .rt, not Amazon's
// box layout), simplified to Uber's single share class (one vote a share). Relocation #90: the live Fiscal.ai table
// (#dd-mgmt-slot, filled by companies.js) stays at the foot of the pane.
// No "Top holders" funds toggle: there is no Bloomberg HDS export for UBER in G:\My Drive\Summit (searched Nov 3 2026),
// so the institutional view is the proxy's >5% table only.
// Sources: Uber 2026 proxy statement (DEF 14A, SEC EDGAR, filed Mar 23 2026; DEFR14A of Apr 20 2026), "Security
// Ownership of Certain Beneficial Owners & Management", as of Mar 2 2026 (2,042,946,343 shares outstanding) and its
// footnotes (1)–(19); Form 10-Q for 2Q26 (filed Aug 5 2026) for shares outstanding at Jun 30 2026 — reported figures.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var OUT = 2042946343;                                    // shares outstanding, Mar 2 2026 (proxy)
// [name, position, group, held (direct + trusts/family), exercisable options + RSUs vesting within 60 days +
//  vested-deferred director RSUs, note] — the two numeric columns add up to the proxy's "Shares" column.
var INSIDERS = [
  ['Turqi Alnowaiser', 'Director since 2023 · Deputy Governor, Public Investment Fund', 'board', 72846072, 0, '72,840,541 held by the Public Investment Fund (Saudi Arabia’s sovereign wealth fund); 5,531 held personally'],
  ['Dara Khosrowshahi', 'CEO · director since 2017', 'exec', 982544, 1397659, '900,701 options exercisable and 496,958 RSUs vesting within 60 days'],
  ['Tony West', 'SVP, Chief Legal Officer & Corporate Secretary', 'exec', 180997, 317168, '200,000 options exercisable and 117,168 RSUs vesting within 60 days'],
  ['Andrew Macdonald', 'President & COO', 'exec', 267726, 163616, 'RSUs vesting within 60 days'],
  ['Ronald Sugar', 'Independent Chair · director since 2018', 'board', 231909, 0, 'held by The Sugar Family Trust'],
  ['Jill Hazelbaker', 'President & Chief Corporate Affairs Officer', 'exec', 120064, 104147, 'includes 11,974 held by a family trust; RSUs vesting within 60 days'],
  ['John Thain', 'Director since 2017 · chairs Audit', 'board', 182447, 0, ''],
  ['Ursula Burns', 'Director since 2017', 'board', 155540, 26830, 'vested director RSUs, settlement deferred'],
  ['Robert Eckert', 'Director since 2020 · chairs Compensation', 'board', 28069, 21034, 'includes 15,740 held by his living trust; vested director RSUs, deferred'],
  ['Revathi Advaithi', 'Director since 2020', 'board', 10988, 22303, 'vested director RSUs, deferred'],
  ['Amanda Ginsberg', 'Director since 2020', 'board', 25813, 0, 'includes 3,892 held by a trust of which she is a trustee'],
  ['Alexander Wynaendts', 'Director since 2021', 'board', 23737, 0, ''],
  ['Nikesh Arora', 'Director since 2025', 'board', 1304, 557, 'held by the Aurora Trust; vested director RSUs, deferred'],
];
var FORMER = [
  ['Prashanth Mahendra-Rajah', 'CFO until Feb 16 2026 (a 2025 named executive officer)', 26847, 134795, '127,401 options exercisable and 7,394 RSUs vesting within 60 days'],
  ['David Trujillo', 'Director 2017 – May 2026 (did not stand for re-election)', 3782, 1019, 'vested director RSUs, deferred'],
];
// All current executive officers and directors as a group (16 people, proxy footnote 16)
var GROUP = { held:75534835, rights:2343652, n:16 };     // rights = 971,208 RSUs + 71,743 deferred + 1,300,701 options
// >5% holders (the proxy, from their Schedule 13G filings)
var HOLDERS5 = [
  ['The Vanguard Group', 190827921, 'Schedule 13G/A, Oct 31 2025'],
  ['BlackRock, Inc.', 139348552, 'Schedule 13G, Jan 26 2024'],
  ['Capital Research Global Investors', 118131681, 'Schedule 13G, Feb 13 2025'],
];
var OUT_JUN26 = 2039994000;                               // 10-Q 2Q26 balance sheet, Jun 30 2026
var OUT_DEC24 = 2107953000;                               // 10-K FY2025 balance sheet, Dec 31 2024

function fmtN(v){ return v ? Math.round(v).toLocaleString('en-US') : '—'; }
function fmtPct(p){ return p===0 ? '—' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var LIST = INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], held:r[3], rights:r[4], note:r[5] }; })
  .sort(function(x,y){ return (y.held+y.rights)-(x.held+x.rights); });
function tot(h){ return h.held + h.rights; }
function pct(h){ return tot(h) / OUT; }
function val(h){ return OWN.px!=null ? fmtUsd(tot(h) * OWN.px) : NIL; }
function rowHtml(h, rk){
  return '<tr><td class="own-rk">'+rk+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
    '<td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(h.held)+'</td><td>'+fmtN(h.rights)+'</td><td><b>'+fmtN(tot(h))+'</b></td>'+
    '<td><b>'+fmtPct(pct(h))+'</b></td><td>'+val(h)+'</td></tr>';
}
function rowsHtml(){
  var list = LIST.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  return list.map(function(h, i){ return rowHtml(h, i+1); }).join('') +
  '<tr class="own-tot"><td></td><td>All current executive officers and directors <span class="own-note">'+GROUP.n+' people, as a group — includes Balaji Krishnamurthy (CFO) and Nikki Krishnamurthy, who are not listed one by one</span></td><td></td>'+
    '<td>'+fmtN(GROUP.held)+'</td><td>'+fmtN(GROUP.rights)+'</td><td><b>'+fmtN(tot(GROUP))+'</b></td><td><b>'+fmtPct(pct(GROUP))+'</b></td><td>'+val(GROUP)+'</td></tr>';
}
function formerHtml(){
  return FORMER.map(function(r){ var h={ name:r[0], role:r[1], held:r[2], rights:r[3], note:r[4] };
    return '<tr><td><b>'+esc(h.name)+'</b><span class="own-note">'+esc(h.note)+'</span></td><td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(tot(h))+'</td><td>'+fmtPct(pct(h))+'</td></tr>';
  }).join('');
}
function holders5Html(){
  return HOLDERS5.map(function(r){ var h={ held:r[1], rights:0 };
    return '<tr><td><b>'+esc(r[0])+'</b><span class="own-note">'+esc(r[2])+'</span></td><td>'+fmtN(h.held)+'</td><td><b>'+fmtPct(pct(h))+'</b></td><td>'+val(h)+'</td></tr>';
  }).join('');
}

export function uberOwnBody(){
  var big = HOLDERS5[0], grp = tot(GROUP);
  var h='';
  h+='<p class="ov-lede">One share, one vote: Uber has a single class of common stock, so whoever holds the shares holds the votes. Index funds are the largest holders; the only large stake on the board is the Saudi Public Investment Fund’s 3.6%, represented by director Turqi Alnowaiser (2026 proxy).</p>';
  h+='<div class="ov-kpis">'+[
    [fmtPct(big[1]/OUT), 'largest holder — '+big[0]+' (13G/A, Oct 2025)'],
    ['1 class', 'one vote a share; no dual-class or founder stock (2026 proxy)'],
    [fmtPct(grp/OUT), 'all 16 directors and executive officers — of which 3.57 pts are the PIF stake'],
    [(OUT_JUN26/1e6).toLocaleString('en-US',{maximumFractionDigits:0})+'M', 'shares outstanding, Jun 30 2026 · '+((OUT_JUN26/OUT_DEC24-1)*100).toFixed(1)+'% since Dec 2024 (10-K, 10-Q)'],
  ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="ubOwnPx">loading live price…</span></div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead><tr><th class="own-rk">#</th><th>Holder</th><th>Position at Uber</th>'+
     '<th>Shares held</th><th>Options &amp; RSUs (60 days)</th><th>Beneficially owned</th><th>% of shares</th><th>Value (live)</th></tr></thead><tbody id="ubOwnBody">'+rowsHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Beneficial ownership as of Mar 2 2026 (proxy). "Options &amp; RSUs" = options exercisable and RSUs vesting within 60 days, plus vested director RSUs whose settlement is deferred; they count as owned under SEC rules. % = beneficially owned ÷ the 2,042.9M shares outstanding on Mar 2 2026 (the proxy also adds each person’s own options to the denominator, so its percentages can differ in the last digit; it shows “less than 1%” for everyone but Alnowaiser).</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Listed in the proxy, no longer in office</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Holder</th><th>Position</th><th>Beneficially owned</th><th>% of shares</th></tr></thead><tbody>'+formerHtml()+'</tbody></table></div>';
  h+='<div class="ov-sec-h mg-sec-gap">Holders above 5%</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Holder</th><th>Shares</th><th>% of shares</th><th>Value (live)</th></tr></thead><tbody id="ubOwn5">'+holders5Html()+'</tbody></table></div>';
  h+='<div class="ov-fynote">As the proxy reports them, from each holder’s latest Schedule 13G; the filing dates differ, so the stakes are not all as of the same day. No Bloomberg holders export (HDS) exists for UBER yet, so holders below 5% are not shown.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: Uber 2026 proxy statement (DEF 14A, SEC EDGAR, filed Mar 23 2026; DEFR14A of Apr 20 2026), Security Ownership of Certain Beneficial Owners &amp; Management, as of Mar 2 2026, footnotes (1)–(19). Shares outstanding: Form 10-K FY2025 (filed Feb 13 2026) and Form 10-Q for 2Q26 (filed Aug 5 2026), balance sheets. Value = shares × the live UBER price (Massive). Live table below: Fiscal.ai.</div>';
  return h;
}
export function uberOwnInit(root){
  var sp=root.querySelector('.ov-uber-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#ubOwnBody'); if(b) b.innerHTML=rowsHtml();
    var b5=sp.querySelector('#ubOwn5'); if(b5) b5.innerHTML=holders5Html();
    var px=sp.querySelector('#ubOwnPx'); if(px) px.textContent=OWN.px!=null?('UBER $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live price unavailable — values blank':'loading live price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('UBER'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}
