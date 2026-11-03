// overviews/uber-ov.js — Uber's Overview (OV-1 … OV-7, OV-F), the renderer. Copied from googl.js (2026-11-03): the std*
// blocks, the live peer map (G_SC → U_SC) and the live quote, with Uber's data from ./uber-ov-data.js. Rule 10: market cap,
// prices and multiples are live (api.liveQuote); nothing is seeded. The inline <style> of googl.js stdOverviewBody is not
// copied (Annex A1): every class used here is in css/overview.css.
import { STD_FACTS, UB_LEDE, STD_BIZ, GMM_SEG, GMM_GEO, MM_CAP_TOP, MM_CAP_END, REV_DEFS, U_PRODUCTS, U_PEERS, OV_SOURCES } from './uber-ov-data.js';
import { TIMELINE } from './uber-ov-timeline.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
var U_ON_PRICE=null;
var U_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: only UBER and LYFT have a Street forward (Bloomberg)
function uTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
function uScReset(){ if(!U_SC.peers) U_SC.peers=U_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function uScNum(v){ return v!=null && !isNaN(v); }
function uScMult(p){
  if(!uScNum(p.px)) return null;                                      // no live price → no bubble (no seeded fallback)
  var f=U_SC.basis==='f';
  if(U_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (uScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!uScNum(eb)||eb<=0) return null;
  var ev=uScNum(p.ev)?p.ev:(uScNum(p.mc)&&uScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return uScNum(ev)?ev/eb:null;
}
function uScGrowth(p){ return U_SC.basis==='f'?p.gf:p.gt; }
function uScVisible(){ return (U_SC.peers||[]).filter(function(p){ return p.on && uScNum(uScMult(p)) && uScNum(uScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function uScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="uber-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="uber-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="uber-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="uber-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="uber-sc-yhi">fast growth</text>'+
    '<g class="uber-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips uber-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only listed peers plot here. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures from each company’s latest annual filing (10-K; Grab: 20-F, IFRS), or the Bloomberg consensus FY2026 where it exists (Uber, Lyft); market caps and EV are live (Massive). Trailing EBITDA is GAAP operating income + D&amp;A; forward is Bloomberg’s adjusted EBITDA, so the bases differ.</span></div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default.
  if(sfx==='dd') h+='<div class="rs-collap uber-sc-collap">'+
      '<button type="button" class="rs-collap-h uber-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b uber-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="uber-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip uber-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function uScRenderOne(wrap){
  var g=wrap.querySelector('.uber-sc-nodes'); if(!g||!U_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var NAVY=uTok('--navy','#1E2733');
  var vis=uScVisible();
  var maxMult=uScNice(Math.max.apply(null, vis.map(uScMult).concat([1]))*1.12);
  var gs=vis.map(uScGrowth), gMax=uScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-uScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.uber-sc-xlab'); if(lab) lab.textContent=(U_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(U_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.uber-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.uber-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===U_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===U_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=uScMult(p), growth=uScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=uScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=scLogoUrl(p);
    var read=(U_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(uScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?NAVY:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?NAVY:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  uScChipsOne(wrap);
  uScTableOne(wrap);
}
// ─── The comps table under the peer map (Valuation ▸ Peers) — copied from meta.js meScTableOne ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median EXCLUDE Uber (the set it is read against). Premium in red, discount in green.
function uScFmtMult(v){ return uScNum(v)?v.toFixed(1)+'×':'—'; }
function uScFmtPct(v){ return uScNum(v)?v.toFixed(1)+'%':'—'; }
function uScFmtMc(v){ return uScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function uScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function uScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function uScVsAvg(m, avg){
  if(!uScNum(m)||!uScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function uScTableOne(wrap){
  var box=wrap.querySelector('.uber-sc-tbl'); if(!box||!U_SC.peers) return;
  var mLab=(U_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(U_SC.basis==='f'?'forward':'trailing');
  var rows=U_SC.peers.map(function(p){ return { p:p, m:uScMult(p), g:uScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=uScNum(a.m), bn=uScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=uScMean(peers.filter(function(r){ return uScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=uScMedian(peers.filter(function(r){ return uScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=uScMean(peers.filter(function(r){ return uScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=uScMedian(peers.filter(function(r){ return uScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return uScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(uScNum(r.m)?'':' asc-nil'), nt=uScNum(r.m)?'':uScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+uScFmtMult(r.m)+'</td>'+
      '<td>'+uScFmtPct(r.g)+'</td>'+
      '<td>'+uScFmtMc(p.mc)+'</td>'+
      '<td>'+uScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-Uber · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+uScFmtMult(avgM)+'</td><td>'+uScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-Uber</span></td>'+
      '<td>'+uScFmtMult(medM)+'</td><td>'+uScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.uber-sc-tblh'), bd=wrap.querySelector('.uber-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function uScChipNote(p){
  if(!uScNum(p.epsT)&&!uScNum(p.ebitdaT)&&!uScNum(p.epsF)&&!uScNum(p.ebitdaF)) return 'no figures on file';
  if(!uScNum(p.px)) return 'no live price';
  if(U_SC.basis==='f' && U_SC.metric==='pe' && p.epsFNote) return p.epsFNote;
  if(U_SC.basis==='f' && !uScNum(U_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!uScNum(uScMult(p))) return U_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function uScChipsOne(wrap){
  var box=wrap.querySelector('.uber-sc-chips'); if(!box||!U_SC.peers) return;
  var keep=box.querySelector('.uber-sc-addtk'); var typed=keep?keep.value:'';
  var h=U_SC.peers.map(function(p,i){ var nt=uScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="uber-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="uber-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.uber-sc-addtk'); if(inp) inp.value=typed;
}
function uScRenderAll(root){ root.querySelectorAll('.uber-sc').forEach(function(w){ uScRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  uScReset();
  root.querySelectorAll('.uber-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.uber-sc-tblh'), tblB=wrap.querySelector('.uber-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; uScTableOne(wrap); };
    var g=wrap.querySelector('.uber-sc-nodes'), tip=wrap.querySelector('.uber-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ U_SC.basis=btn.getAttribute('data-mgbasis'); uScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ U_SC.metric=btn.getAttribute('data-mgmetric'); uScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.uber-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  uScRenderAll(root); uScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.uber-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(U_SC.peers[i]){ U_SC.peers.splice(i,1); uScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.uber-sc-addbtn'), addIn=wrap.querySelector('.uber-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!U_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=U_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; U_SC.peers.push(o); }
        else U_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; uScRenderAll(root); uLiveOne(root, tk); };
  }
}
function uScFetchCaps(root){ if(U_SC._capsFetched||!U_SC.peers) return; U_SC._capsFetched=true; U_SC.peers.forEach(function(p){ if(p.tk) uLiveOne(root, p.tk); }); }

// Live quote via Massive (api.liveQuote). Market data is ALWAYS live — no seeded number is ever shown: the
// Key Facts cell says "loading…" until the quote arrives and "unavailable" if it fails. The same quote feeds the
// peer bubbles (price → P/E, market cap → bubble size, EV when Massive has one) and the old Sensitivity pane.
function uLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='UBER') uMcFail(root); return; }
    var mcB=q.marketCap/1e9;
    uScReset();
    (U_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='UBER'){ var el=root.querySelector('#uberMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      if(typeof U_ON_PRICE==='function' && q.price!=null) U_ON_PRICE(q.price); }
    uScRenderAll(root);
  }).catch(function(){ if(tk==='UBER') uMcFail(root); }); }
function uMcFail(root){ var el=root.querySelector('#uberMc'); if(el) el.textContent='live quote unavailable'; }

function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ═══ Standardized Overview body ═════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="uberMc">'+esc(p[1])+'</span>'; }
    else v=esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function gmmRank(arr){ var o=arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }), rk=[];
  o.forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); }); return rk; }
function gmmBars(arr){
  var rk=gmmRank(arr);
  return '<div class="ov-mbars gmm-neutral">'+arr.map(function(r,i){
    var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill gmm-g'+rk[i]+'" style="width:'+Math.max(r[1],1.2)+'%">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">'+MM_CAP_TOP+'</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Segments</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Region</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">'+MM_CAP_END+'</div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+U_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'">'+(f.ic?'<div class="stdp-ic">'+f.ic+'</div>':'')+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
// OV-F — the Overview's one source footer (the collapsibles carry none of their own; playbook §8, §22).
function stdOverviewBody(c){
  var h=stdKeyFacts();
  h+='<p class="ov-lede">'+UB_LEDE+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How Uber makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Uber', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// ── exports ──
export function uberOvBody(c){ return stdOverviewBody(c); }
export function uberPeersDdBody(){ return stdPeerScatter('dd'); }
export function uberOvInit(root, onPrice){
  U_ON_PRICE=onPrice||null;
  root.querySelectorAll('.ov-uber .mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.ov-uber .mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-uber .gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  wireScatters(root);
  uLiveOne(root, 'UBER');
}
export function uberOvPop(kind, id){
  if(kind==='prod'){ var f=U_PRODUCTS[+id]; if(!f) return null;
    return { t:esc(f.fam), h:'<div class="famd ov-pop-sub">'+esc(f.d)+'</div>'+f.items.map(function(it){ return '<div class="ov-pop-item"><div class="ov-pop-item-n">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('') }; }
  if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{ t:t.y, h:t.d }:null; }
  return null;
}
