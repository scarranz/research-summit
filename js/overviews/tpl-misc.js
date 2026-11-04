// overviews/tpl-misc.js — Texas Pacific Land Deep Dive ▸ Miscellaneous (playbook §15b). Approved by SAB, Nov 4 2026:
//   MISC-comp    Competitive Position — copy of googl-comp.js (itself a copy of meta-comp.js): lede = the moat thesis of
//                Overview OV-3 "The edge"; the challenges to it, one row each with the evidence on both sides; then the
//                business side by side with the five listed peers, FY2025, each company's own 10-K. Evidence, no verdict.
//   MISC-nextgen Next-Gen Land Use — the "next generation" uses TPL names in its 10-K (Item 1): a directory of every
//                disclosed project or transaction grouped by type with subtotals (§18), what has reached revenue, and
//                management's words, verbatim from the call transcripts.
// MISC-capacity (Capacity → revenue) was proposed and discarded: TPL's revenue is not bound by its own capacity.
// Data: ./tpl-misc-data.js. Static HTML; tplNextGenBuild only wires the fold of the directory groups.
// Styles: css/overview.css — the META/GOOGL .mcp-* and .mx-* blocks, widened to .ov-tpl-dd; .ew-tbl/.ew-q already were.
import { TPL_CHALLENGES, TPL_PEER_OPS, TPL_NEXTGEN, TPL_NG_REVENUE, TPL_NG_QUOTES } from './tpl-misc-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var NIL = '<span class="rs-ft-nil">—</span>';
function money(m){ if(m==null) return NIL; var a=Math.abs(m), s=m<0?'−':''; return a>=1000 ? s+'$'+(a/1000).toFixed(1)+'B' : s+'$'+Math.round(a)+'M'; }
function money1(m){ return m==null ? NIL : '$'+m.toFixed(1)+'M'; }
function pct(v){ return v==null ? NIL : (v<0?'−':'')+Math.abs(v).toFixed(1)+'%'; }
function num(v){ return v==null ? NIL : Math.round(v).toLocaleString('en-US'); }
function def(t){ return t ? '<span class="mcp-def">'+esc(t)+'</span>' : ''; }
function median(a){ var v=a.filter(function(x){ return x!=null; }).sort(function(x,y){ return x-y; }); if(v.length<3) return null; var m=v.length>>1; return v.length%2?v[m]:(v[m-1]+v[m])/2; }
function margin(r){ return r.rev && r.opi!=null ? r.opi/r.rev*100 : null; }

// ═══ MISC-comp — Competitive Position ══════════════════════════════════════════════════════════════════
function challengesHtml(){
  return '<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-chal"><thead><tr><th>Challenge</th><th>Evidence it is real</th><th>Evidence the position holds</th><th>Source</th></tr></thead><tbody>'+
    TPL_CHALLENGES.map(function(r){ return '<tr><td class="mcp-c">'+esc(r.c)+'</td><td>'+esc(r.real)+'</td><td>'+esc(r.holds)+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
}
function peersHtml(){
  var rows=TPL_PEER_OPS.slice().sort(function(a,b){ return b.rev-a.rev; });   // by FY2025 revenue, largest first
  var peers=rows.filter(function(r){ return !r.me; });
  var h='<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-peers"><thead><tr><th>Company</th><th class="mcp-num">Surface acres</th><th class="mcp-num">Net royalty acres</th>'+
    '<th class="mcp-num">Royalty production, Boe/d</th><th>Water volumes</th><th class="mcp-num">Revenue FY2025</th><th class="mcp-num">Op. margin</th><th class="mcp-num">Net debt</th><th>Source</th></tr></thead><tbody>';
  h+=rows.map(function(r){
    return '<tr class="'+(r.me?'mcp-me':'')+'"><td class="mcp-name"><b>'+esc(r.n)+'</b> <span class="mcp-tk">'+esc(r.tk)+'</span></td>'+
      '<td class="mcp-num">'+num(r.surface)+def(r.surfaceNote)+'</td>'+
      '<td class="mcp-num">'+num(r.nra)+def(r.nraNote)+'</td>'+
      '<td class="mcp-num">'+num(r.boed)+def(r.boedNote)+'</td>'+
      '<td class="mcp-src">'+(r.water?esc(r.water):NIL)+'</td>'+
      '<td class="mcp-num">'+money(r.rev)+def(r.revNote)+'</td>'+
      '<td class="mcp-num">'+pct(margin(r))+def(r.opiNote)+'</td>'+
      '<td class="mcp-num">'+money(r.nd)+def(r.ndNote)+'</td>'+
      '<td class="mcp-src">'+esc(r.src)+'</td></tr>';
  }).join('');
  var mBoe=median(peers.map(function(r){ return r.boed; })), mRev=median(peers.map(function(r){ return r.rev; })),
      mMar=median(peers.map(margin)), mNd=median(peers.map(function(r){ return r.nd; }));
  h+='<tr class="mcp-stat"><td>Median of the five peers</td><td class="mcp-num">'+NIL+'</td><td class="mcp-num">'+NIL+'</td><td class="mcp-num">'+num(mBoe)+'</td><td>'+NIL+'</td>'+
    '<td class="mcp-num">'+money(mRev)+'</td><td class="mcp-num">'+pct(mMar)+'</td><td class="mcp-num">'+money(mNd)+'</td><td class="mcp-src">excludes TPL; only where at least three peers report</td></tr>';
  return h+'</tbody></table></div>';
}

export function tplCompBody(){
  var h='<p class="ov-lede">TPL’s edge: a Permian land position of a scale no neighbour matches, perpetual royalties that need no drilling capital, and surface that pipelines, water and power projects must cross. '+
    'Below, the serious challenges to that position, each with the evidence on both sides, and the listed land and royalty companies side by side.</p>';
  h+='<div class="ov-sec-h">The challenges to the position</div>'+challengesHtml();
  h+='<div class="ov-sec-h mg-sec-gap">Land, royalties and water — the business, not the valuation</div>'+peersHtml();
  h+='<div class="ov-fynote">FY2025, each company’s own Form 10-K. Only TPL and LandBridge own surface; Viper, Black Stone, Kimbell and Dorchester hold mineral and royalty interests only, so their surface and water cells are empty. Net royalty acres are not on one basis — TPL and Dorchester normalize to a 1/8 royalty, Viper does not, Black Stone and Kimbell report gross acres — and are not comparable across rows. Production is each company’s FY2025 average share. Operating margin = operating income ÷ total revenues; net debt = debt drawn less cash at Dec 31 2025 (the same figures as Valuation ▸ Peers). Private Permian landowners and ranches publish none of these figures and are not shown. A dash means the company does not disclose the figure; nothing is estimated.</div>';
  h+='<div class="ov-foot">Sources — Texas Pacific Land Form 10-K FY2025 (filed Feb 18 2026), 10-Q 1Q26 and 2Q26, and the 3Q26 earnings release (8-K, Nov 4 2026); earnings calls of May 7 and Aug 6 2026; 2026 proxy statement; Horizon Kinetics Schedule 13D/A (May 7 2026); 8-Ks of May 6 and Sep 25 2026; 10-K FY2023 (stockholder matters). '+
    'Peers: LandBridge 10-K FY2025 (filed Feb 26 2026) and 10-Q 2Q26 (Aug 6 2026); Viper Energy 10-K FY2025 (Feb 25 2026); Black Stone Minerals 10-K FY2025 (Feb 24 2026); Kimbell Royalty Partners 10-K FY2025 (Feb 26 2026); Dorchester Minerals 10-K FY2025 (Feb 24 2026) — all on SEC EDGAR, read Nov 4 2026. Net debt from each 10-K’s balance sheet (XBRL). Reported figures only; the water price per barrel is revenue ÷ volume from the 3Q26 release. Peer set: SAB, Nov 4 2026.</div>';
  return h;
}

// ═══ MISC-nextgen — Next-Gen Land Use ════════════════════════════════════════════════════════════════════
var NG_COLS = ['Project','Counterparty','Type','County / location','Amount','Date','Status','Source'];
function groups(){
  var order=[], g={};
  TPL_NEXTGEN.forEach(function(r){ if(!g[r.type]){ g[r.type]=[]; order.push(r.type); } g[r.type].push(r); });
  var list=order.map(function(t){ var rs=g[t], amts=rs.filter(function(r){ return r.amt!=null; });
    return { t:t, rows:rs, n:rs.length, sum:amts.length?amts.reduce(function(s,r){ return s+r.amt; },0):null }; });
  return list.sort(function(a,b){ return (b.sum||0)-(a.sum||0); });   // §18: groups by subtotal, largest first
}
function directoryHtml(){
  var G=groups(), tot=0, n=0, body='';
  G.forEach(function(gr, gi){
    tot+=gr.sum||0; n+=gr.n;
    body+='<tr class="ew-tgrp" data-tngrp="'+gi+'" role="button" tabindex="0" aria-expanded="true"><td colspan="4"><span class="rs-collap-ic">▾</span> '+esc(gr.t)+' · '+gr.n+' item'+(gr.n>1?'s':'')+'</td>'+
      '<td class="mx-n">'+(gr.sum!=null?money1(gr.sum):'not disclosed')+'</td><td colspan="3"></td></tr>';
    gr.rows.forEach(function(r){
      body+='<tr data-tngin="'+gi+'"><td class="mx-k">&emsp;'+esc(r.p)+'<span class="mcp-def">'+esc(r.note)+'</span></td><td>'+esc(r.who)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.where)+'</td>'+
        '<td class="mx-n">'+money1(r.amt)+'</td><td>'+esc(r.date)+'</td><td>'+esc(r.status)+'</td><td class="mx-src">'+esc(r.src)+'</td></tr>';
    });
  });
  body+='<tr class="mx-tot"><td colspan="4">Total · '+n+' items</td><td class="mx-n">'+money1(tot)+'</td><td colspan="3">disclosed amounts only</td></tr>';
  return '<div class="twrap mx-twrap mcp-wrap"><table class="rt mx-tbl ew-tbl"><thead><tr>'+NG_COLS.map(function(c,i){ return '<th'+(i===4?' class="mx-n"':'')+'>'+c+'</th>'; }).join('')+'</tr></thead><tbody>'+body+'</tbody></table></div>';
}
function revenueHtml(){
  return '<div class="twrap mx-twrap"><table class="rt mx-tbl"><thead><tr><th>Item</th><th class="mx-n">Amount</th><th>Period</th><th>Source</th></tr></thead><tbody>'+
    TPL_NG_REVENUE.map(function(r){ return '<tr><td class="mx-k">'+esc(r[0])+'</td><td class="mx-n">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td class="mx-src">'+esc(r[3])+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
}
function quotesHtml(){
  return TPL_NG_QUOTES.map(function(x){ return '<div class="ew-q">“'+esc(x.q)+'”<span class="ew-att">'+esc(x.who)+' · '+esc(x.when)+'</span></div>'; }).join('');
}

export function tplNextGenBody(){
  var h='<p class="ov-lede">TPL’s 10-K calls them “next generation” uses of its surface: data centers, power generation, renewables, grid-connected batteries and carbon capture and sequestration, usually on multi-year terms paid as royalty, fee, profit sharing, lease or rent. '+
    'Below, every project or transaction it has disclosed, what has reached revenue, and what management has said about them.</p>';
  h+='<div class="ew-h">Disclosed projects and transactions, by type</div>'+directoryHtml();
  h+='<div class="ov-fynote">Amounts are as disclosed and mix directions: the land sale is consideration received (most of it paid over 20 years); the acquisition, the investment and the desalination spend are money TPL put in. The Kilby land sale and the 1Q26 sale to an unnamed power-plant developer are the same transaction — the 2Q26 10-Q named Chevron. The $122.7M of land also covers tracts in Winkler and Reeves that TPL does not split out. Water supply and lease terms are not disclosed, so those groups carry no amount.</div>';
  h+='<div class="ew-h">What has reached revenue so far</div>'+revenueHtml();
  h+='<div class="ew-h">What management has said</div>'+quotesHtml();
  h+='<div class="ov-fynote">Word for word from the earnings-call transcripts (4Q25, 1Q26 and 2Q26 calls); the last quote is from the 3Q26 earnings release. The 3Q26 call is on Nov 5 2026.</div>';
  h+='<div class="ov-foot">Sources — Texas Pacific Land Form 10-K FY2025 (Item 1, Recent Developments and revenue recognition; filed Feb 18 2026), 10-K FY2024 and FY2023 (Item 1); Form 10-Q 1Q26 (May 6 2026) and 2Q26 (Aug 5 2026), Note 4 Real Estate Activity and Liquidity; 3Q26 earnings release (8-K, Nov 4 2026) — SEC EDGAR. Earnings-call transcripts of Feb 19, May 7 and Aug 6 2026. The 3Q26 10-Q was not yet filed when this was read (Nov 4 2026). Reported figures only; nothing estimated.</div>';
  return h;
}

// Fold/unfold a directory group (each starts open). Scoped to the sub-pane; wired once.
export function tplNextGenBuild(root){
  var sp=root.querySelector('.ovt-subpane[data-ovst="nextgen"]'); if(!sp||sp._ngWired) return; sp._ngWired=true;
  function toggle(tr){
    var k=tr.getAttribute('data-tngrp'), open=tr.getAttribute('aria-expanded')!=='true';
    tr.setAttribute('aria-expanded', open?'true':'false');
    var ic=tr.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸';
    sp.querySelectorAll('tr[data-tngin="'+k+'"]').forEach(function(r){ r.hidden=!open; });
  }
  sp.addEventListener('click', function(e){ var tr=e.target.closest&&e.target.closest('tr[data-tngrp]'); if(tr) toggle(tr); });
  sp.addEventListener('keydown', function(e){ if(e.key!=='Enter'&&e.key!==' ') return; var tr=e.target.closest&&e.target.closest('tr[data-tngrp]'); if(tr){ e.preventDefault(); toggle(tr); } });
}
