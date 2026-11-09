// overviews/nvda-own.js — NVIDIA Deep Dive ▸ Management ▸ Ownership (MG-OWN, playbook §15).
//
// COPIED from js/overviews/googl-own.js (the holder TABLE SAB chose for TSM, Oct 16 2026; .twrap + .rt, not Amazon's box
// layout), simplified to NVIDIA's single share class (one share, one vote). Replaces the old OWNERSHIP table of nvidia.js
// (relocation map #26). Two dated columns per insider (SAB, 2026-11-02): the 2026 proxy's beneficial ownership (as of
// Mar 23 2026) and the latest Form 4 position from the Bloomberg holdings export (NVDA_OWN.xlsx, HDS insider view,
// Jun 2026). Former directors still in that export are left out: Robert K. Burgess (died 2025), Persis S. Drell
// (resigned Jan 2026) and Ellen Ochoa (left in 2025), per the proxy. No "Top holders" toggle: the export's fund cache
// is stale (Dec 2023), so only the proxy's >5% holders are shown.
// Sources: NVIDIA 2026 proxy statement (DEF 14A, filed May 12 2026), Security Ownership of Certain Beneficial Owners and
// Management, as of Mar 23 2026 (24,312,141,810 shares outstanding); Form 4 filings via the Bloomberg export; Form 10-Q
// for 2Q FY27, cover page (24.1B shares outstanding as of Aug 21 2026) — reported figures (rule 10 allows them in a file).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var OUT_PROXY = 24312141810;     // shares outstanding, Mar 23 2026 (proxy)
var OUT_NOW = 24100000000;       // shares outstanding, Aug 21 2026 (10-Q 2Q FY27 cover, as reported)
// [name, position, group, proxy shares (Mar 23 2026), latest Form 4 shares, Form 4 net change, Form 4 date, note]
var INSIDERS = [
  ['Jen-Hsun Huang', 'Founder, President & CEO · director since 1993', 'exec', 870604104, 812004746, -45723, 'Jun 17 2026', 'mostly via family trusts; see note below'],
  ['Mark A. Stevens', 'Director since 2008 (and 1993–2006)', 'board', 34069572, 31769633, 1211, 'Jun 25 2026', ''],
  ['Tench Coxe', 'Director since 1993', 'board', 30555240, 30581218, 1211, 'Jun 25 2026', ''],
  ['Harvey C. Jones', 'Director since 1993', 'board', 7003687, 7004898, 1211, 'Jun 25 2026', ''],
  ['Colette M. Kress', 'EVP & CFO', 'exec', 4443523, 4851271, -40746, 'Jun 17 2026', 'incl. family trusts; see note below'],
  ['Ajay K. Puri', 'EVP, Worldwide Field Operations', 'exec', 3266897, 3665228, -36927, 'Jun 17 2026', ''],
  ['Timothy S. Teter', 'EVP, General Counsel & Secretary', 'exec', 2687197, 3052096, -35742, 'Jun 17 2026', ''],
  ['A. Brooke Seawell', 'Director since 1997 · Audit Committee chair', 'board', 2506607, 2507818, 1211, 'Jun 25 2026', ''],
  ['Debora Shoquist', 'EVP, Operations', 'exec', 1580729, 1946358, -35012, 'Jun 17 2026', ''],
  ['Dawn Hudson', 'Director since 2013 · Compensation Committee chair', 'board', 368887, 370098, 1211, 'Jun 25 2026', ''],
  ['Stephen C. Neal', 'Lead Director · director since 2019', 'board', 184867, 170578, 1211, 'Jun 25 2026', ''],
  ['Aarti Shah', 'Director since 2020', 'board', 25620, 37218, 1211, 'Jun 25 2026', ''],
  ['Melissa B. Lora', 'Director since 2023', 'board', 1799, 16868, 1211, 'Jun 25 2026', ''],
  ['John O. Dabiri', 'Director since 2020', 'board', 14788, 15374, 1211, 'Jun 25 2026', ''],
];
var GROUP = { proxy: 957313517, n: 14 };    // all directors and executive officers as a group (proxy, Mar 23 2026)
// Holders above 5% (the proxy, from their Schedule 13G/A filings)
var HOLDERS5 = [
  ['BlackRock, Inc.', 1805935550],
  ['Vanguard Capital Management', 1777408252],
];
var SRC = 'NVIDIA 2026 proxy statement (DEF 14A, SEC EDGAR, filed May 12 2026), Security Ownership of Certain Beneficial Owners and Management, as of Mar 23 2026 (24,312,141,810 shares outstanding); latest Form 4 positions from the Bloomberg holdings export (insider view, Jun 2026)';

function fmtN(v){ return v ? Math.round(v).toLocaleString('en-US') : '—'; }
function fmtChg(v){ return v ? (v>0?'+':'−')+Math.abs(v).toLocaleString('en-US') : '—'; }
function fmtPct(p){ return p===0 ? '—' : (p<0.0001 ? '&lt;0.01%' : (p*100).toFixed(2)+'%'); }
function fmtUsd(v){ return v>=1e9 ? '$'+(v/1e9).toFixed(2)+'B' : v>=1e6 ? '$'+(v/1e6).toFixed(1)+'M' : v>=1e3 ? '$'+Math.round(v/1e3)+'K' : (v>0 ? '$'+Math.round(v) : '—'); }
var NIL = '<span class="own-nil">–</span>';
var OWN = { filter:'all', px:null, failed:false };
var LIST = INSIDERS.map(function(r){ return { name:r[0], role:r[1], grp:r[2], proxy:r[3], f4:r[4], chg:r[5], date:r[6], note:r[7] }; })
  .sort(function(x,y){ return y.f4-x.f4; });
function val(sh){ return OWN.px!=null ? fmtUsd(sh * OWN.px) : NIL; }

function rowsHtml(){
  var list = LIST.filter(function(h){ return OWN.filter==='all' || h.grp===OWN.filter; });
  return list.map(function(h, i){
    return '<tr><td class="own-rk">'+(i+1)+'</td><td><b>'+esc(h.name)+'</b>'+(h.note?'<span class="own-note">'+esc(h.note)+'</span>':'')+'</td>'+
      '<td class="own-role">'+esc(h.role)+'</td><td>'+fmtN(h.proxy)+'</td><td><b>'+fmtN(h.f4)+'</b></td>'+
      '<td>'+fmtChg(h.chg)+'<span class="own-note">'+esc(h.date)+'</span></td><td>'+fmtPct(h.f4/OUT_NOW)+'</td><td>'+val(h.f4)+'</td></tr>';
  }).join('') +
  '<tr class="own-tot"><td></td><td>All directors and executive officers <span class="own-note">'+GROUP.n+' people, as a group (proxy)</span></td><td></td>'+
    '<td>'+fmtN(GROUP.proxy)+'</td><td>'+NIL+'</td><td></td><td>'+fmtPct(GROUP.proxy/OUT_PROXY)+'</td><td>'+val(GROUP.proxy)+'</td></tr>';
}
function holders5Html(){
  return HOLDERS5.map(function(r){
    return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+fmtN(r[1])+'</td><td>'+fmtPct(r[1]/OUT_PROXY)+'</td><td>'+val(r[1])+'</td></tr>';
  }).join('');
}

export function nvdaOwnBody(){
  var h='';
  h+='<p class="ov-lede">One share, one vote: NVIDIA has a single class of stock, so ownership and control are the same thing. Jensen Huang is the largest individual holder, with about 3.4% of the company; all directors and executive officers together held 3.9% in the 2026 proxy.</p>';
  h+='<div class="ov-sec-h mg-sec-gap">Insiders — directors and executive officers</div>';
  h+='<div class="mg-tog-row own-ctl"><span class="mg-tog">Show: <span class="mg-seg">'+
     [['all','All'],['board','Board'],['exec','Executive officers']].map(function(f){ return '<button type="button" class="mg-pill'+(OWN.filter===f[0]?' active':'')+'" data-ownf="'+f[0]+'">'+f[1]+'</button>'; }).join('')+
     '</span></span><span class="own-px" id="nvOwnPx">loading live price…</span></div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-ins"><thead><tr><th class="own-rk">#</th><th>Holder</th><th>Position at NVIDIA</th>'+
     '<th>Shares<br>proxy, Mar 23 2026</th><th>Shares<br>latest Form 4</th><th>Last Form 4<br>change</th><th>% of<br>shares</th><th>Value<br>(live)</th></tr></thead><tbody id="nvOwnBody">'+rowsHtml()+'</tbody></table></div>';
  h+='<div class="ov-fynote">“% of shares” and “Value” use the latest Form 4 position; % against the 24.1B shares outstanding on the 2Q FY27 10-Q cover (Aug 21 2026). “Last Form 4 change” is the net change on the holder’s most recent Form 4, as reported. Chris Malachowsky is not a Section 16 officer, so his holding is not reported. Jensen Huang holds mostly through family trusts and TARG LLCs, and his proxy figure includes 58.7M shares of the Huang Foundation, in which he has no pecuniary interest; Colette Kress’s includes shares held by family members, an LLC and four grantor retained annuity trusts (proxy).</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Holders above 5%</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl own-h5"><thead><tr><th>Holder</th><th>Shares</th><th>% of shares</th><th>Value (live)</th></tr></thead><tbody id="nvOwn5">'+holders5Html()+'</tbody></table></div>';
  h+='<div class="ov-fynote">As the proxy reports them, from each holder’s Schedule 13G/A; percentages against the 24.31B shares outstanding on Mar 23 2026. Other institutional holders are below 5% and are not disclosed in the proxy.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Executives &amp; insider activity — live from Fiscal.ai</div>';
  h+='<div id="dd-mgmt-slot"></div>';
  h+='<div class="ov-fynote">Fiscal.ai’s share counts can differ from the latest Form 4 (it does not state how it counts indirect and trust holdings); the insider table above, from the proxy and Form 4 filings, is the primary source.</div>';   // filled by companies.js (the same live table as Pillars ▸ Management)
  h+='<div class="ov-foot">Holdings: '+esc(SRC)+'. Shares outstanding now: Form 10-Q for 2Q FY27 (filed Aug 26 2026), cover page. Value = shares × the live NVDA price (Massive). Insider activity: Fiscal.ai, live.</div>';
  return h;
}
export function nvdaOwnInit(root){
  var sp=root.querySelector('.ov-nvda-dd .ovt-subpane[data-ovst="ownership"]'); if(!sp) return;
  function paint(){
    var b=sp.querySelector('#nvOwnBody'); if(b) b.innerHTML=rowsHtml();
    var b5=sp.querySelector('#nvOwn5'); if(b5) b5.innerHTML=holders5Html();
    var px=sp.querySelector('#nvOwnPx'); if(px) px.textContent=OWN.px!=null?('NVDA $'+OWN.px.toFixed(2)+' · live'):(OWN.failed?'live price unavailable — values blank':'loading live price…');
    sp.querySelectorAll('[data-ownf]').forEach(function(x){ x.classList.toggle('active', x.getAttribute('data-ownf')===OWN.filter); });
  }
  if(!sp._ownWired){ sp._ownWired=true;
    sp.addEventListener('click', function(e){ var t=e.target.closest&&e.target.closest('[data-ownf]'); if(!t) return; OWN.filter=t.getAttribute('data-ownf'); paint(); });
    import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote('NVDA'):null; }).then(function(res){
      var q=res&&res.data?res.data:res; if(q&&q.price!=null) OWN.px=q.price; else OWN.failed=true; paint(); }).catch(function(){ OWN.failed=true; paint(); });
  }
  paint();
}
