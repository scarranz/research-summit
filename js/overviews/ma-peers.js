// overviews/ma-peers.js — OV-6 "Competitors — the peer map" and Valuation ▸ Peers for Mastercard (NYSE: MA), ported from sofi-peers.js
// (playbook §8 OV-6 / §14). Rule 10: no multiple and no market cap is written as a figure to show. The file holds the DENOMINATORS from
// Bloomberg consensus: price, market cap and (when Massive has it) EV are live (api.liveQuote) and the multiple is computed in the browser:
// P/E = price ÷ EPS, EV/EBITDA = EV ÷ EBITDA.
//   epsT/epsF      GAAP-comparable EPS, US$. Trailing = last reported fiscal year (Bloomberg FY0), forward = the current-year consensus (FY+1).
//   ebitdaT/F      Bloomberg comparable EBITDA, US$ M. Not meaningful for a lender (Amex), so left null: it plots on P/E only.
//   nd             Bloomberg net debt, US$ M, used to build EV when Massive returns none.
//   gt/gf          revenue growth, % — last reported year vs the year before / current-year consensus vs last reported year.
//   nm             why a figure is not plotted (shown on the chip).
// Sources: Mastercard from BBG_CONSENSUS.txt (Oct 28 2026); the other six from the Bloomberg Equity Universe Consensus export (Oct 14 2026).
// Visa reports a September fiscal year, so its FY+1 is the year that closed Sep 30 2026 and is not yet reported. FIS and Global Payments
// carry deal effects in FY+1 (issuer-processing swap, Worldpay), so their forward growth and GAAP EPS are not like for like.
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function maTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
var BRAND2 = maTok('--navy', '#1E2733');   // Summit navy (token), for the profile company's thick border and label
function maMcCell(root, txt){ var el=(root||document).querySelector('#maMc'); if(el) el.textContent=txt; }   // the Key Facts market-cap cell (OV-1)

var MA_PEERS = [
  { tk:'MA', n:'Mastercard', epsT:16.52, epsF:19.59, ebitdaT:20544, ebitdaF:23611.0, nd:13034, gt:16.4, gf:13.7, src:'Bloomberg consensus export (BBG_CONSENSUS.txt), Oct 28 2026', hl:true, why:'The profile company: a card network that earns thin fees on volume and transactions, plus value-added services.' },
  { tk:'V', n:'Visa', epsT:10.2, epsF:12.6, ebitdaT:28314, ebitdaF:32108.0, nd:5606, gt:11.3, gf:14.6, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', why:'The larger open-loop network: more volume and acceptance, a smaller services mix and no credit risk. The closest comparison for Mastercard.' },
  { tk:'AXP', n:'American Express', epsT:15.38, epsF:17.64, ebitdaT:null, ebitdaF:null, nd:13806, gt:8.4, gf:-1.2, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', nm:'EV/EBITDA not meaningful for a lender', why:'A closed-loop network that also issues and lends, so credit risk and interest income sit in its results. EV/EBITDA does not apply to a lender, and the Street’s revenue basis changes between years.' },
  { tk:'PYPL', n:'PayPal', epsT:5.41, epsF:5.02, ebitdaT:7341, ebitdaF:6730.0, nd:460, gt:4.3, gf:4.6, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', why:'A digital wallet and checkout network on a different rail that partly competes with cards, while most of its funding still rides the card networks.' },
  { tk:'FIS', n:'FIS', epsT:0.73, epsF:6.43, ebitdaT:4329, ebitdaF:5748.0, nd:20430, gt:5.4, gf:28.0, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', why:'Core-banking and issuer processing that runs on the networks’ rails rather than competing with them. Consensus FY2026 includes the issuer-processing swap, so growth and GAAP EPS are not like for like.' },
  { tk:'GPN', n:'Global Payments', epsT:5.78, epsF:-3.12, ebitdaT:5532.0, ebitdaF:5761.0, nd:18146.0, gt:-0.4, gf:60.3, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', why:'A merchant acquirer and processor that rides the rails. Consensus FY2026 includes the Worldpay deal, so revenue growth is deal-driven and GAAP EPS is negative.' },
  { tk:'XYZ', n:'Block', epsT:2.1, epsF:1.7, ebitdaT:3467.0, ebitdaF:4505.0, nd:-1018.0, gt:0.3, gf:7.6, src:'Bloomberg Equity Universe Consensus, Oct 14 2026 (FY0 = last reported year, FY+1 = current-year estimate)', why:'Square (merchant acquiring) and Cash App (wallet and P2P): partly competes for merchant and P2P flow, but its cards and funding still ride the networks.' }
];

var MA_FALLBACK = { asOf: 'Oct 27 2026 close', src: 'Yahoo Finance chart endpoint (price); market cap = price \u00d7 FY2025 diluted shares (net income \u00f7 EPS, Bloomberg); EV = market cap + net debt (Bloomberg)', q: {
  MA: { px: 609.85, mc: 552.6, ev: 565.6 },
  V: { px: 401.86, mc: 790.2, ev: 795.9 },
  AXP: { px: 312.91, mc: 217.7, ev: null },
  PYPL: { px: 56.09, mc: 54.3, ev: 54.7 },
  FIS: { px: 35.61, mc: 18.6, ev: 39.1 },
  GPN: { px: 81.43, mc: 19.7, ev: 37.9 },
  XYZ: { px: 74.87, mc: 46.5, ev: 45.5 }
} };
var MA_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };   // Forward by default (playbook §8): every name has a Street figure
function maScReset(){ if(!MA_SC.peers) MA_SC.peers=MA_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function maScNum(v){ return v!=null && !isNaN(v); }
function maScMult(p){
  if(!maScNum(p.px)) return null;                                     // no live price → no bubble (no seeded fallback)
  var f=MA_SC.basis==='f';
  if(MA_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (maScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!maScNum(eb)||eb<=0) return null;
  var ev=maScNum(p.ev)?p.ev:(maScNum(p.mc)&&maScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return maScNum(ev)?ev/eb:null;
}
function maScGrowth(p){ return MA_SC.basis==='f'?p.gf:p.gt; }
function maScVisible(){ return (MA_SC.peers||[]).filter(function(p){ return p.on && maScNum(maScMult(p)) && maScNum(maScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function maScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function maScLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function maStdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="ma-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="rs-noguide ma-sc-live" hidden></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="ma-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="ma-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="ma-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="ma-sc-yhi">fast growth</text>'+
    '<g class="ma-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips ma-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here; the unlisted and state-run rails (UnionPay, UPI, Pix, FedNow) have no market multiple. Multiples = live price ÷ Bloomberg consensus EPS (trailing = last reported year, forward = current-year estimate). Market caps are live.</div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default — copied from
  // amzn.js maStdPeerScatter('dd').
  if(sfx==='dd') h+='<div class="rs-collap ma-sc-collap">'+
      '<button type="button" class="rs-collap-h ma-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b ma-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="ma-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip ma-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function maScRenderOne(wrap){
  var g=wrap.querySelector('.ma-sc-nodes'); if(!g||!MA_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var vis=maScVisible();
  var maxMult=maScNice(Math.max.apply(null, vis.map(maScMult).concat([1]))*1.12);
  var gs=vis.map(maScGrowth), gMax=maScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-maScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.ma-sc-xlab'); if(lab) lab.textContent=(MA_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(MA_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.ma-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.ma-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===MA_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===MA_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=maScMult(p), growth=maScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=maScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=maScLogoUrl(p);
    var read=(MA_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(maScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND2:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND2:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  maScChipsOne(wrap);
  maScTableOne(wrap);
}

// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function maScChipNote(p){
  if(p.nm && MA_SC.metric==='pe') return p.nm;
  if(!maScNum(p.epsT)&&!maScNum(p.ebitdaT)&&!maScNum(p.epsF)&&!maScNum(p.ebitdaF)) return 'no figures on file';
  if(!maScNum(p.px)) return 'no live price';
  if(MA_SC.basis==='f' && !maScNum(MA_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!maScNum(maScMult(p))) return MA_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function maScChipsOne(wrap){
  var box=wrap.querySelector('.ma-sc-chips'); if(!box||!MA_SC.peers) return;
  var keep=box.querySelector('.ma-sc-addtk'); var typed=keep?keep.value:'';
  var h=MA_SC.peers.map(function(p,i){ var nt=maScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="ma-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="ma-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.ma-sc-addtk'); if(inp) inp.value=typed;
}
function maScRenderAll(root){ root.querySelectorAll('.ma-sc').forEach(function(w){ maScRenderOne(w); maWireScChips(root, w); }); }
function maWireScatters(root){
  maScReset();
  root.querySelectorAll('.ma-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.ma-sc-tblh'), tblB=wrap.querySelector('.ma-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden;  };
    var g=wrap.querySelector('.ma-sc-nodes'), tip=wrap.querySelector('.ma-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ MA_SC.basis=btn.getAttribute('data-mgbasis'); maScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ MA_SC.metric=btn.getAttribute('data-mgmetric'); maScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.ma-sc-svg');
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
  maScRenderAll(root); maScFetchCaps(root);
}
function maWireScChips(root, wrap){
  wrap.querySelectorAll('.ma-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(MA_SC.peers[i]){ MA_SC.peers.splice(i,1); maScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.ma-sc-addbtn'), addIn=wrap.querySelector('.ma-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!MA_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=MA_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; MA_SC.peers.push(o); }
        else MA_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; maScRenderAll(root); maLiveOne(root, tk); };
  }
}
function maScApplyFallback(){
  (MA_SC.peers||[]).forEach(function(p){ var f=MA_FALLBACK.q[p.tk]; if(f && !maScNum(p.px)){ p.px=f.px; p.mc=f.mc; p.ev=(f.ev!=null?f.ev*1000:null); p.stale=true; } });
}
function maScLiveNote(root){
  var n=(MA_SC.peers||[]).length, live=(MA_SC.peers||[]).filter(function(p){ return maScNum(p.px) && !p.stale; }).length;
  var msg='';
  if(MA_SC._pend<=0 && live<n){
    maScApplyFallback();
    msg='Prices as of the '+MA_FALLBACK.asOf+'.';
    maScRenderAll(root);
  }
  document.querySelectorAll('.ma-sc-live').forEach(function(el){ el.textContent=msg; el.hidden=!msg; });
}
function maScFetchCaps(root){ if(MA_SC._capsFetched||!MA_SC.peers) return; MA_SC._capsFetched=true; MA_SC._pend=MA_SC.peers.length; MA_SC.peers.forEach(function(p){ if(p.tk) maLiveOne(root, p.tk); }); }

// Live market cap (Key Facts cell) via Massive (api.liveQuote). Market data is ALWAYS live — no seeded
// number is ever shown: until the quote arrives the cell says so, and if it fails it says that.
// The same quote feeds the peer bubbles: price (P/E), market cap (bubble size) and EV when Massive has one.
function maLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='MA') maMcCell(root,'live quote unavailable'); MA_SC._pend--; maScLiveNote(root); return; }
    var mcB=q.marketCap/1e9;
    (MA_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); p.stale=false; } });
    if(tk==='MA') maMcCell(root, '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}));
    MA_SC._pend--; maScRenderAll(root); maScLiveNote(root);
  }).catch(function(){ if(tk==='MA') maMcCell(root,'live quote unavailable'); MA_SC._pend--; maScLiveNote(root); }); }


// ─── The comps table under the peer map (Valuation ▸ Peers) — ported from meta.js ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median exclude Mastercard, the company the profile reads against. Premium in red, discount in green.
function maScFmtMult(v){ return maScNum(v)?v.toFixed(1)+'×':'—'; }
function maScFmtDen(p){ var f=MA_SC.basis==='f', v=MA_SC.metric==='pe'?(f?p.epsF:p.epsT):(f?p.ebitdaF:p.ebitdaT); return maScNum(v)?(MA_SC.metric==='pe'?'$'+v.toFixed(2):'$'+v.toFixed(1)+'M'):'<span class="asc-nilv">—</span>'; }
function maScFmtPct(v){ return maScNum(v)?v.toFixed(1)+'%':'—'; }
function maScFmtMc(v){ return maScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function maScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function maScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function maScVsAvg(m, avg){
  if(!maScNum(m)||!maScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function maScTableOne(wrap){
  var box=wrap.querySelector('.ma-sc-tbl'); if(!box||!MA_SC.peers) return;
  var mLab=(MA_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(MA_SC.basis==='f'?'forward':'trailing');
  var rows=MA_SC.peers.map(function(p){ return { p:p, m:maScMult(p), g:maScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=maScNum(a.m), bn=maScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=maScMean(peers.filter(function(r){ return maScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=maScMedian(peers.filter(function(r){ return maScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=maScMean(peers.filter(function(r){ return maScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=maScMedian(peers.filter(function(r){ return maScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return maScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(maScNum(r.m)?'':' asc-nil'), nt=maScNum(r.m)?'':maScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(maScLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+maScFmtMult(r.m)+'</td>'+
      '<td>'+maScFmtDen(p)+'</td>'+
      '<td>'+maScFmtPct(r.g)+'</td>'+
      '<td>'+maScFmtMc(p.mc)+'</td>'+
      '<td>'+maScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-Mastercard · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+maScFmtMult(avgM)+'</td><td><span class="asc-nilv">—</span></td><td>'+maScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-Mastercard</span></td>'+
      '<td>'+maScFmtMult(medM)+'</td><td><span class="asc-nilv">—</span></td><td>'+maScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th><th>'+(MA_SC.metric==='pe'?'EPS':'EBITDA')+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.ma-sc-tblh'), bd=wrap.querySelector('.ma-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}

// Valuation ▸ Peers (VA-PEERS): the same map as Overview ▸ Competitors, same MA_SC state (removing a peer here removes it
// there), plus the table of numbers. Multiples and caps are live; the file holds the denominators.
function maValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, with the numbers behind it. Multiples use live prices.</p>'+
    maStdPeerScatter('dd')+
    '<div class="ov-foot">Sources — EPS, EBITDA, net debt and revenue from Bloomberg consensus: Mastercard from the Oct 28 2026 export, Visa, American Express, PayPal, FIS, Global Payments and Block from the Equity Universe Consensus of Oct 14 2026. Trailing = last reported fiscal year, forward = the current-year estimate; both are GAAP-comparable EPS. Visa\u2019s fiscal year ends in September. FIS and Global Payments forward figures include deal effects (issuer-processing swap, Worldpay), so their growth and GAAP EPS are not like for like. Price, market cap and EV are live (Massive); when that service does not answer, the Oct 27 2026 close is used and the page says so. EBITDA is not meaningful for American Express, which plots on P/E only.</div>';
}

export { maStdPeerScatter, maWireScatters, maScRenderAll, maValuationPeersBody };
