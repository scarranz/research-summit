// overviews/sharkninja-peers.js — SharkNinja's Valuation ▸ Peers, on AMAZON'S code.
//
// Extracted verbatim from js/overviews/amzn.js (stdPeerScatter · the comps table · wireScatters ·
// the live-cap fetch), so the pane is the same scatter, the same pills, the same chips and the same
// "numbers behind the map" table as Amazon's. The only edits:
//   • A_PEERS is built from SN_PEERS (sharkninja-data.js) — same seeded multiples as the Overview map
//   • no seeded market caps: bubbles size from the live quote (Amazon seeded approximate caps)
//   • the caption's "not plotted" sentence is SN's (SN_PEERS_QUAL); ex-AMZN → ex-SN; amzn-sc → sn-sc
//   • the `why` tooltips are SN's peers, below

import { SN_PEERS, SN_PEERS_QUAL } from './sharkninja-data.js';
import { SUMMIT_CAT } from '../viz-palette.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var BRAND=SUMMIT_CAT[0];

var SN_PEER_WHY={
  SN:'The subject: two brands (Shark, Ninja) across cleaning, cooking, food prep and beauty, compounding double-digit on launches and international expansion.',
  NWL:'Newell Brands — Sunbeam, Mr. Coffee and Crock-Pot in small appliances inside a much broader, slower consumer portfolio. No meaningful P/E on the seeded basis.',
  HELE:'Helen of Troy — hair care and home brands sold through the same big-box shelves. Low single-digit growth at a single-digit multiple.',
  WHR:'Whirlpool — major appliances plus KitchenAid small appliances. A cyclical, housing-linked name priced at a discount.',
  TTNDY:'Techtronic Industries — power tools plus floorcare (Hoover, Dirt Devil), SharkNinja\'s oldest category rival. US OTC line of the HKEX-listed 0669.'
};
// ─── Peers scatter — small-appliance and home-products peers. Toggles: metric (P/E ⇄ EV/EBITDA — never P/S) ×
// basis (Forward ⇄ Trailing, default Forward). Bubble = LIVE market cap (Massive). Multiples/
// growth are seeded approximations (Jul 2026), labeled — replaced by live values when confirmed.
// Seeds from stockanalysis.com (Jul 2026). Forward EV/EBITDA is not published there — the evF
// values are DERIVED approximations (trailing EV/EBITDA deflated by consensus revenue growth),
// labeled as such in the caption. Fiscal years differ (WMT Jan, COST Aug, MSFT Jun, BABA Mar).
var A_PEERS=SN_PEERS.map(function(p){
  return { tk:p.tk, n:p.name, peT:p.pe, peF:p.peF, evT:p.ev, evF:p.evF, gt:p.g, gf:p.gF,
    mc:null,   // no seeded cap: the bubble sizes from the live Massive quote, never from a guess
    hl:!!p.self, why:SN_PEER_WHY[p.tk]||'' };
});

var A_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };
function aScReset(){ if(!A_SC.peers) A_SC.peers=A_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function aScMult(p){ var key=(A_SC.metric==='pe'?'pe':'ev')+(A_SC.basis==='f'?'F':'T'); return p[key]; }
function aScMax(){ return A_SC.metric==='pe'?45:30; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.asc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.asc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.asc-chip .x{color:var(--mu);font-weight:800}'+
    '.asc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.asc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.asc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#FFB84D}</style>';
  h+='<div class="sn-sc" data-sfx="'+sfx+'">';
  // The comps table under the map. Same visual language as the Target Multiple tables (.tm-tbl),
  // written here rather than imported because this canvas carries its own styles already.
  h+='<style>.asc-tblwrap{overflow-x:auto}'+
    '.asc-tbl{border-collapse:collapse;width:100%;font-size:12px;margin:4px 0}'+
    '.asc-tbl th,.asc-tbl td{padding:7px 10px;text-align:right;border-bottom:1px solid var(--bdr);white-space:nowrap}'+
    '.asc-tbl th:first-child,.asc-tbl td:first-child{text-align:left}'+
    '.asc-tbl thead th{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);border-bottom:2px solid var(--bdr)}'+
    '.asc-tbl td.asc-m{font-weight:800;color:var(--navy)}'+
    '.asc-tbl tbody tr.asc-hl{background:rgba(255,153,0,.07)}'+
    '.asc-tbl tbody tr.asc-nil td{color:var(--mu)}'+
    '.asc-tbl tfoot td{border-top:2px solid var(--bdr);border-bottom:none;font-weight:800;color:var(--navy);background:#F7F9FB}'+
    '.asc-tbl tfoot tr.asc-med td{background:#FAFBFC;font-weight:700;color:var(--mu)}'+
    '.asc-nm{display:inline-flex;align-items:center;gap:7px}'+
    '.asc-nm img{width:16px;height:16px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.asc-tk{color:var(--mu);font-weight:700;font-size:10.5px}'+
    '.asc-up{color:#C0392B;font-weight:700}.asc-dn{color:#2E8B57;font-weight:700}'+
    '.asc-nilv{color:var(--mu)}'+
    '</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="sn-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="sn-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="sn-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips sn-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. '+SN_PEERS_QUAL+' <span class="ave-subh-note">Multiples & growth are seeded approximations (Sep 2026); market caps are live.</span></div>';
  // §0.2 rule 3 — the receipt under the read. It is .rs-collap markup so it reads like every other
  // table in the portal, but it OPENS by default: there is one table, it is the block's own detail,
  // and the whole point of the sub-tab is the numbers (Pablo, Aug 20 2026).
  if(sfx==='dd') h+='<div class="rs-collap sn-sc-collap">'+
      '<button type="button" class="rs-collap-h sn-sc-tblh"></button>'+
      '<div class="rs-collap-b sn-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="sn-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip sn-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function aScRenderOne(wrap){
  var g=wrap.querySelector('.sn-sc-nodes'); if(!g||!A_SC.peers) return;
  var maxMult=aScMax(), X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.sn-sc-xlab'); if(lab) lab.textContent=(A_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(A_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===A_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===A_SC.metric); });
  var frag='';
  A_SC.peers.forEach(function(p){
    if(!p.on) return; var m=aScMult(p); if(m==null||isNaN(m)) return;
    var growth=A_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/25))*(Y0-Y1);
    var r=Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32));
    var logo=scLogoUrl(p);
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#C7761A':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  aScTableOne(wrap);
}
function aScChipsOne(wrap){
  var box=wrap.querySelector('.sn-sc-chips'); if(!box||!A_SC.peers) return;
  var h=A_SC.peers.map(function(p,i){ return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="sn-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="sn-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function aScRenderAll(root){ root.querySelectorAll('.sn-sc').forEach(aScRenderOne); }
// ─── The comps table under the peer map (Valuation ▸ Peers) ─────────────────────────────────────
// §0.2 rule 3: everything the scatter draws, as numbers, in the units it draws them in. It reads
// the SAME state as the bubbles — the metric/basis pills pick the column, removing a chip drops the
// row, and a ticker added by hand appears here with an em dash until a multiple exists for it.
//
// The average and the median EXCLUDE Amazon. They are the set Amazon is being read against, so
// folding the subject into its own benchmark would shrink whatever gap the table exists to show.
// AMZN keeps its highlighted row and its "vs peer avg" is its premium/discount to them.
// Both statistics are shown because this set is skewed: COST and MELI in the 40s against BABA at
// 17 drag a mean that seven names cannot defend, and the median is the honest middle.
function aScGrowth(p){ var g=A_SC.basis==='f'?p.gf:p.gt; if(g==null) g=(p.gf!=null?p.gf:p.gt); return g; }
function aScNum(v){ return v!=null && !isNaN(v); }
function aScFmtMult(v){ return aScNum(v)?v.toFixed(1)+'×':'—'; }
function aScFmtPct(v){ return aScNum(v)?v.toFixed(1)+'%':'—'; }
function aScFmtMc(v){ return aScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function aScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function aScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function aScVsAvg(m, avg){
  if(!aScNum(m)||!aScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function aScTableOne(wrap){
  var box=wrap.querySelector('.sn-sc-tbl'); if(!box||!A_SC.peers) return;
  var mLab=(A_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(A_SC.basis==='f'?'forward':'trailing');
  var rows=A_SC.peers.map(function(p){ return { p:p, m:aScMult(p), g:aScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple. A name with no multiple on file sinks to the bottom
  // instead of sorting as zero, which would read as "the cheapest name on the map".
  rows.sort(function(a,b){
    var an=aScNum(a.m), bn=aScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=aScMean(peers.filter(function(r){ return aScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=aScMedian(peers.filter(function(r){ return aScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=aScMean(peers.filter(function(r){ return aScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=aScMedian(peers.filter(function(r){ return aScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return aScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(aScNum(r.m)?'':' asc-nil');
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+'</span></span></span></td>'+
      '<td class="asc-m">'+aScFmtMult(r.m)+'</td>'+
      '<td>'+aScFmtPct(r.g)+'</td>'+
      '<td>'+aScFmtMc(p.mc)+'</td>'+
      '<td>'+aScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-SN · '+nM+' names</span></td>'+
      '<td>'+aScFmtMult(avgM)+'</td><td>'+aScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-SN</span></td>'+
      '<td>'+aScFmtMult(medM)+'</td><td>'+aScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.sn-sc-tblh'), bd=wrap.querySelector('.sn-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
function aScChipsAll(root){ root.querySelectorAll('.sn-sc').forEach(function(w){ aScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  aScReset();
  root.querySelectorAll('.sn-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.sn-sc-tblh'), tblB=wrap.querySelector('.sn-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; aScRenderOne(wrap); };
    var g=wrap.querySelector('.sn-sc-nodes'), tip=wrap.querySelector('.sn-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ A_SC.basis=btn.getAttribute('data-mgbasis'); aScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ A_SC.metric=btn.getAttribute('data-mgmetric'); aScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.sn-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  aScRenderAll(root); aScChipsAll(root); aScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.sn-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(A_SC.peers[i]){ A_SC.peers.splice(i,1); aScRenderAll(root); aScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.sn-sc-addbtn'), addIn=wrap.querySelector('.sn-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!A_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=A_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; A_SC.peers.push(o); }
      else A_SC.peers.push({ tk:tk, n:tk, on:true, mc:100, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
    }
    addIn.value=''; aScRenderAll(root); aScChipsAll(root); aLiveOne(root, tk); }; }
}
// Live market cap (Key Facts cell + peer bubbles) via Massive (api.liveQuote). Degrades gracefully.
function aLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; A_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='SN'){ var el=root.querySelector('#snMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } aScRenderAll(root); }).catch(function(){}); }
function aScFetchCaps(root){ if(A_SC._capsFetched||!A_SC.peers) return; A_SC._capsFetched=true; A_SC.peers.forEach(function(p){ if(p.tk) aLiveOne(root, p.tk); }); }

// ════ SN entry points ═══════════════════════════════════════════════════════════════════════════
// amzn.js valuationPeersBody(), verbatim but for the company.
export function snPeersBody(){
  return '<p class="ov-lede"><b>The peer map.</b> The same live-cap scatter as the Overview, kept beside the valuation work: X = multiple (P/E ⇄ EV/EBITDA, forward ⇄ trailing), Y = expected growth, bubble = live market cap. Peer multiples are seeded approximations (Sep 2026) — directional, not live.</p>'+stdPeerScatter('dd');
}
export { wireScatters as snPeersInit };