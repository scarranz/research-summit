// overviews/tpl-own.js — Texas Pacific Land Deep Dive ▸ Management ▸ Ownership (MG-OWN, playbook §15).
//
// COPIED from js/overviews/googl-own.js (the holder TABLE layout, .twrap + .rt), adapted to TPL's single class of
// common stock (one share, one vote; no dual class). Sources: TPL 2026 proxy statement (DEF 14A, acc.
// 0001104659-26-110963, filed Sep 25 2026), "Security Ownership of Certain Beneficial Owners and Management", as of
// Sep 10 2026, on 68,974,683 shares outstanding; share counts and repurchased shares from the Form 10-K FY2025
// (filed Feb 18 2026, consolidated statements of equity) and the Form 10-Q for 2Q26 (filed Aug 5 2026, balance sheet).
// Every share figure is after the two 3-for-1 splits (Mar 26 2024 and Dec 22 2025), as the filings present them.
// Reported figures (rule 10 allows them in a file).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var OUT = 68974683;                                  // common shares outstanding, Sep 10 2026 (proxy record date)
// [name, position, group, shares, note]
var INSIDERS = [
  ['Peter Doyle', 'Director since May 2026 · Co-CEO of Horizon Kinetics', 'board', 160027, '146,936 held directly, 11,286 by his spouse and 1,805 in a trust of which his spouse is trustee; excludes the 10.1M shares Horizon Kinetics manages for clients'],
  ['Tyler Glover', 'President & CEO · director since January 2021', 'exec', 44171, ''],
  ['Chris Steddum', 'Chief Financial Officer', 'exec', 12040, ''],
  ['Micheal W. Dobbs', 'SVP, Secretary & General Counsel', 'exec', 7845, ''],
  ['Robert Roosa', 'Director since November 2023', 'board', 4469, '1,769 held directly; 1,350 each by RSR Resources & Minerals Unvested, LLC and RSR Resources & Minerals Vested, LLC, of which he is manager'],
  ['Rhys J. Best', 'Chair of the Board · director since April 2022', 'board', 3299, ''],
  ['Donald G. Cook', 'Director since January 2021', 'board', 3086, ''],
  ['Barbara J. Duganier', 'Director since January 2021', 'board', 2921, ''],
  ['Donna E. Epps', 'Director since January 2021', 'board', 2921, ''],
  ['Karl F. Kurz', 'Director since April 2022', 'board', 2624, ''],
  ['Marguerite Woung-Chapman', 'Director since November 2023', 'board', 1769, ''],
];
var GROUP = { sh: 245172, n: 11 };                   // all directors and executive officers, as a group (proxy)
// Holders above 5% (the proxy's table, from their Schedule 13D / 13G filings) — [name, shares, %, filing]
var HOLDERS5 = [
  ['Horizon Kinetics Holding Corporation', 10109933, 14.7, 'Schedule 13D Amendment No. 11, May 7 2026 (through Horizon Kinetics Asset Management, sole voting and dispositive power; clients’ accounts)'],
  ['BlackRock, Inc.', 5445993, 7.9, 'Schedule 13G Amendment No. 2, Feb 5 2025 (split-adjusted; sole voting power over 5,073,825)'],
  ['Vanguard Capital Management LLC', 4348379, 6.3, 'Schedule 13G, Apr 30 2026 (sole voting power over 564,694)'],
  ['State Street Corporation', 3508116, 5.1, 'Schedule 13G, Nov 7 2025 (split-adjusted; shared voting power over 2,563,263)'],
];
// Share count — shares of common stock outstanding at period-end and shares repurchased in the period
// (10-K FY2025 statements of equity, split-adjusted; Jun 30 2026 from the 10-Q 2Q26)
var COUNT = [
  { p:'Dec 31 2022', sh:69261111, rep:null },
  { p:'Dec 31 2023', sh:69023043, rep:248571 },
  { p:'Dec 31 2024', sh:68915409, rep:128706 },
  { p:'Dec 31 2025', sh:68938230, rep:27000 },
  { p:'Jun 30 2026', sh:68974683, rep:0 },
];
var SRC = 'TPL 2026 proxy statement (DEF 14A, SEC EDGAR, filed Sep 25 2026, acc. 0001104659-26-110963), Security Ownership of Certain Beneficial Owners and Management, as of Sep 10 2026: 68,974,683 shares of common stock outstanding';

function fmtN(v){ return v ? Math.round(v).toLocaleString('en-US') : '—'; }
function fmtPct(p){ return p===0 ? '—' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var LIST = INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], sh:r[3], note:r[4] }; })
  .sort(function(x,y){ return y.sh-x.sh; });
function val(sh){ return OWN.px!=null ? fmtUsd(sh * OWN.px) : NIL; }

function rowsHtml(){
  var list = LIST.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  return list.map(function(h, i){
    return '<tr><td class="own-rk">'+(i+1)+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
      '<td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(h.sh)+'</td><td><b>'+fmtPct(h.sh/OUT)+'</b></td><td>'+val(h.sh)+'</td></tr>';
  }).join('') +
  '<tr class="own-tot"><td></td><td>All directors and executive officers <span class="own-note">'+GROUP.n+' people, as a group</span></td><td></td>'+
    '<td>'+fmtN(GROUP.sh)+'</td><td><b>'+fmtPct(GROUP.sh/OUT)+'</b></td><td>'+val(GROUP.sh)+'</td></tr>';
}
function holders5Html(){
  return HOLDERS5.map(function(r){
    return '<tr><td><b>'+esc(r[0])+'</b><span class="own-note">'+esc(r[3])+'</span></td><td>'+fmtN(r[1])+'</td><td><b>'+r[2].toFixed(1)+'%</b></td><td>'+val(r[1])+'</td></tr>';
  }).join('');
}
function countHtml(){
  return COUNT.map(function(c, i){
    var prev = i ? COUNT[i-1].sh : null;
    return '<tr><td><b>'+esc(c.p)+'</b></td><td>'+fmtN(c.sh)+'</td><td>'+(prev?((c.sh/prev-1)*100).toFixed(2)+'%':'—')+'</td><td>'+(c.rep==null?'—':(c.rep?fmtN(c.rep):'0'))+'</td></tr>';
  }).join('');
}

export function tplOwnBody(){
  var h='';
  h+='<p class="ov-lede">One class of common stock, one vote a share. The largest holder is <b>Horizon Kinetics</b>, with 14.7% managed for its clients and a director on the board; the directors and executive officers together hold well under 1% (2026 proxy).</p>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="tpOwnPx">loading live price…</span></div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead><tr><th class="own-rk">#</th><th>Holder</th><th>Position at TPL</th>'+
     '<th>Shares</th><th>% of shares</th><th>Value (live)</th></tr></thead><tbody id="tpOwnBody">'+rowsHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Beneficial ownership as of Sep 10 2026 (proxy), after the 3-for-1 split of Dec 22 2025. Shares under PSUs are not counted until they vest. "Executive officers" are the three named in the proxy (CEO, CFO, General Counsel). The group total (245,172) is 0.36% of the shares.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Holders above 5%</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Holder</th><th>Shares</th><th>% of shares</th><th>Value (live)</th></tr></thead><tbody id="tpOwn5">'+holders5Html()+'</tbody></table></div>';
  h+='<div class="ov-fynote">The four holders above 5% hold 34.0% between them. Horizon Kinetics reports on Schedule 13D (an active holder) and holds its stake for clients; its count excludes shares held by its senior portfolio managers. Horizon Kinetics also held a 22.2% voting position in LandBridge (NYSE: LB) at Sep 30 2025 (10-K FY2025, Item 10).</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Share count</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Period-end</th><th>Shares outstanding</th><th>Change</th><th>Shares repurchased in the period</th></tr></thead><tbody>'+countHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">Split-adjusted for both 3-for-1 splits (Mar 26 2024, Dec 22 2025). The count fell 0.47% from end-2022 to end-2025: buybacks under the $250M program (effective Jan 1 2023) outweighed shares issued as stock pay in 2023 and 2024; with buybacks small in 2025 and none in the first half of 2026, it ticked back up. The dollar amounts of buybacks and dividends are in Governance &amp; SBC.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: '+esc(SRC)+'; holders above 5% as each reported on its Schedule 13D/13G (dates in the table). Share count: Form 10-K FY2025 (filed Feb 18 2026), consolidated statements of equity; Form 10-Q for 2Q26 (filed Aug 5 2026), balance sheet. LandBridge position: Form 10-K FY2025, Item 10. Value = shares × the live TPL price (Massive). Institutional holders below 5% are not disclosed in the proxy.</div>';
  return h;
}
export function tplOwnInit(root){
  var sp=root.querySelector('.ov-tpl-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#tpOwnBody'); if(b) b.innerHTML=rowsHtml();
    var b5=sp.querySelector('#tpOwn5'); if(b5) b5.innerHTML=holders5Html();
    var px=sp.querySelector('#tpOwnPx'); if(px) px.textContent=OWN.px!=null?('TPL $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live price unavailable — values blank':'loading live price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('TPL'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}
