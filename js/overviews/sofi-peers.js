// overviews/sofi-peers.js — OV-6 "Competitors — the peer map" for SoFi Technologies (NASDAQ: SOFI), ported from
// meta.js (playbook §8 OV-6 / §14). Rule 10: no multiple and no market cap is written here. The file holds the
// DENOMINATORS from each peer's own filing (SEC EDGAR XBRL); price, market cap and (when Massive has it) EV are live
// (api.liveQuote) and the multiple is computed in the browser: P/E = price ÷ EPS, EV/EBITDA = EV ÷ EBITDA.
//   epsT/epsF  diluted EPS, US$ (GAAP). Forward = Bloomberg consensus, only for SOFI (the only name in BBG_CONSENSUS.txt).
//   ebitdaT    US$ M = operating income + D&A from the 10-K. Not meaningful for brokers and banks (HOOD, SCHW, IBKR),
//              so left null: those peers plot on P/E only.
//   gt/gf      revenue growth, % — FY vs prior FY (10-K) / FY2026 consensus vs FY2025 (SOFI only).
//   nm         why a figure is not plotted (shown on the chip).
// Peer set (analyst, 2026-10-26): HOOD, SCHW, IBKR, UPST, AFRM. Nu (NU) is left out: its FY2025 20-F was not provided.
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function soTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
var BRAND2 = soTok('--navy', '#1E2733');   // Summit navy (token), for the profile company's thick border and label
function soMcCell(){}   // the Key Facts market-cap cell is filled by sofi.js (OV-1)

var SO_PEERS = [
  { tk:'SOFI', n:'SoFi', hl:true, epsT:0.39, epsF:0.6014, ebitdaT:null, ebitdaF:null, nd:null, gt:35.1, gf:30.4,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Aug 3 2026',
    why:'The profile company: a digital bank that lends, runs everyday banking and investing, and sells technology to other banks.' },
  { tk:'HOOD', n:'Robinhood', epsT:2.05, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:51.6, gf:null,
    src:'10-K FY2025 (SEC EDGAR XBRL; the feed carries the 10-K/A filed Feb 20 2026)',
    why:'An app-first broker and crypto platform that competes for the same younger investors; EV/EBITDA does not apply to a broker.' },
  { tk:'SCHW', n:'Schwab', epsT:4.65, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:22.0, gf:null,
    src:'10-K FY2025 (SEC EDGAR XBRL)',
    why:'The largest US retail broker and a bank, the scale benchmark for deposits plus investing; EV/EBITDA does not apply.' },
  { tk:'IBKR', n:'Interactive Brokers', epsT:2.22, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:19.7, gf:null,
    src:'10-K FY2025 (SEC EDGAR XBRL); revenue is net of interest expense; EPS is for the public Class A shares',
    why:'An electronic broker for active and professional traders; the public shares own only part of the group, so EPS understates group earnings.' },
  { tk:'UPST', n:'Upstart', epsT:0.45, epsF:null, ebitdaT:67.5, ebitdaF:null, nd:null, gt:64.0, gf:null,
    src:'10-K FY2025 (SEC EDGAR XBRL); EBITDA = operating income $42.6M + D&A $24.8M',
    why:'An AI lending marketplace that sells loans to banks and credit unions, closest to SoFi\'s Loan Platform Business.' },
  { tk:'AFRM', n:'Affirm', epsT:null, epsF:null, ebitdaT:720.3, ebitdaF:null, nd:null, gt:32.2, gf:null,
    nm:'P/E not meaningful: FY2026 income tax benefit of $1.44B',
    src:'10-K FY2026, year ended Jun 30 2026 (SEC EDGAR XBRL); EBITDA = operating income $417.0M + D&A $303.3M',
    why:'Buy-now-pay-later and consumer credit at the point of sale. Its FY2026 net income includes a one-time tax benefit, so its P/E is not shown.' }
];

// Dated fallback for market data (analyst, Oct 26 2026: never leave the map blank). Market data is live first (api.liveQuote); when that
// service does not answer (for example from a deploy preview), the last close below is used and the page says so, with the date.
// Source: Yahoo Finance (chart and quote endpoints), regular-session close of Oct 26 2026. px in US$, mc and ev in US$ billions.
// IBKR's EV is negative (net cash from customer-related balances), so its EV/EBITDA is not shown.
var SO_FALLBACK = { asOf: 'Oct 26 2026 close', src: 'Yahoo Finance', q: {
  SOFI: { px: 14.46, mc: 18.676, ev: 18.925 },
  HOOD: { px: 92.84, mc: 83.471, ev: 84.557 },
  SCHW: { px: 89.73, mc: 155.173, ev: 128.022 },
  IBKR: { px: 80.59, mc: 137.310, ev: null },
  UPST: { px: 23.00, mc: 2.238,   ev: 3.914 },
  AFRM: { px: 69.49, mc: 23.447,  ev: 31.967 }
} };
var SO_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: only SOFI has a Street forward
function soScReset(){ if(!SO_SC.peers) SO_SC.peers=SO_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function soScNum(v){ return v!=null && !isNaN(v); }
function soScMult(p){
  if(!soScNum(p.px)) return null;                                     // no live price → no bubble (no seeded fallback)
  var f=SO_SC.basis==='f';
  if(SO_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (soScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!soScNum(eb)||eb<=0) return null;
  var ev=soScNum(p.ev)?p.ev:(soScNum(p.mc)&&soScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return soScNum(ev)?ev/eb:null;
}
function soScGrowth(p){ return SO_SC.basis==='f'?p.gf:p.gt; }
function soScVisible(){ return (SO_SC.peers||[]).filter(function(p){ return p.on && soScNum(soScMult(p)) && soScNum(soScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function soScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function soScLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function soStdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="so-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="rs-noguide so-sc-live" hidden></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="so-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="so-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="so-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="so-sc-yhi">fast growth</text>'+
    '<g class="so-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips so-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here; Nu is not mapped. Multiples = live price ÷ reported diluted EPS (10-K, FY2025; Affirm FY2026); forward exists only for SoFi (Bloomberg consensus, Oct 2026). Market caps are live.</div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default — copied from
  // amzn.js soStdPeerScatter('dd').
  if(sfx==='dd') h+='<div class="rs-collap so-sc-collap">'+
      '<button type="button" class="rs-collap-h so-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b so-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="so-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip so-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function soScRenderOne(wrap){
  var g=wrap.querySelector('.so-sc-nodes'); if(!g||!SO_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var vis=soScVisible();
  var maxMult=soScNice(Math.max.apply(null, vis.map(soScMult).concat([1]))*1.12);
  var gs=vis.map(soScGrowth), gMax=soScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-soScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.so-sc-xlab'); if(lab) lab.textContent=(SO_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(SO_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.so-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.so-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===SO_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===SO_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=soScMult(p), growth=soScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=soScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=soScLogoUrl(p);
    var read=(SO_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(soScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND2:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND2:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  soScChipsOne(wrap);
  soScTableOne(wrap);
}

// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function soScChipNote(p){
  if(p.nm && SO_SC.metric==='pe') return p.nm;
  if(!soScNum(p.epsT)&&!soScNum(p.ebitdaT)&&!soScNum(p.epsF)&&!soScNum(p.ebitdaF)) return 'no figures on file';
  if(!soScNum(p.px)) return 'no live price';
  if(SO_SC.basis==='f' && !soScNum(SO_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!soScNum(soScMult(p))) return SO_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function soScChipsOne(wrap){
  var box=wrap.querySelector('.so-sc-chips'); if(!box||!SO_SC.peers) return;
  var keep=box.querySelector('.so-sc-addtk'); var typed=keep?keep.value:'';
  var h=SO_SC.peers.map(function(p,i){ var nt=soScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="so-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="so-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.so-sc-addtk'); if(inp) inp.value=typed;
}
function soScRenderAll(root){ root.querySelectorAll('.so-sc').forEach(function(w){ soScRenderOne(w); soWireScChips(root, w); }); }
function soWireScatters(root){
  soScReset();
  root.querySelectorAll('.so-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.so-sc-tblh'), tblB=wrap.querySelector('.so-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden;  };
    var g=wrap.querySelector('.so-sc-nodes'), tip=wrap.querySelector('.so-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ SO_SC.basis=btn.getAttribute('data-mgbasis'); soScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ SO_SC.metric=btn.getAttribute('data-mgmetric'); soScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.so-sc-svg');
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
  soScRenderAll(root); soScFetchCaps(root);
}
function soWireScChips(root, wrap){
  wrap.querySelectorAll('.so-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(SO_SC.peers[i]){ SO_SC.peers.splice(i,1); soScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.so-sc-addbtn'), addIn=wrap.querySelector('.so-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!SO_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=SO_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; SO_SC.peers.push(o); }
        else SO_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; soScRenderAll(root); soLiveOne(root, tk); };
  }
}
function soScApplyFallback(){
  (SO_SC.peers||[]).forEach(function(p){ var f=SO_FALLBACK.q[p.tk]; if(f && !soScNum(p.px)){ p.px=f.px; p.mc=f.mc; p.ev=(f.ev!=null?f.ev*1000:null); p.stale=true; } });
}
function soScLiveNote(root){
  var n=(SO_SC.peers||[]).length, live=(SO_SC.peers||[]).filter(function(p){ return soScNum(p.px) && !p.stale; }).length;
  var msg='';
  if(SO_SC._pend<=0 && live<n){
    soScApplyFallback();
    msg='Prices as of the '+SO_FALLBACK.asOf+'.';
    soScRenderAll(root);
  }
  document.querySelectorAll('.so-sc-live').forEach(function(el){ el.textContent=msg; el.hidden=!msg; });
}
function soScFetchCaps(root){ if(SO_SC._capsFetched||!SO_SC.peers) return; SO_SC._capsFetched=true; SO_SC._pend=SO_SC.peers.length; SO_SC.peers.forEach(function(p){ if(p.tk) soLiveOne(root, p.tk); }); }

// Live market cap (Key Facts cell) via Massive (api.liveQuote). Market data is ALWAYS live — no seeded
// number is ever shown: until the quote arrives the cell says so, and if it fails it says that.
// The same quote feeds the peer bubbles: price (P/E), market cap (bubble size) and EV when Massive has one.
function soLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='SOFI') soMcCell(root,'live quote unavailable'); SO_SC._pend--; soScLiveNote(root); return; }
    var mcB=q.marketCap/1e9;
    (SO_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); p.stale=false; } });
    if(tk==='SOFI') soMcCell(root, '$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}));
    SO_SC._pend--; soScRenderAll(root); soScLiveNote(root);
  }).catch(function(){ if(tk==='SOFI') soMcCell(root,'live quote unavailable'); SO_SC._pend--; soScLiveNote(root); }); }


// ─── The comps table under the peer map (Valuation ▸ Peers) — ported from meta.js ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median exclude SoFi, the company the profile reads against. Premium in red, discount in green.
function soScFmtMult(v){ return soScNum(v)?v.toFixed(1)+'×':'—'; }
function soScFmtDen(p){ var f=SO_SC.basis==='f', v=SO_SC.metric==='pe'?(f?p.epsF:p.epsT):(f?p.ebitdaF:p.ebitdaT); return soScNum(v)?(SO_SC.metric==='pe'?'$'+v.toFixed(2):'$'+v.toFixed(1)+'M'):'<span class="asc-nilv">—</span>'; }
function soScFmtPct(v){ return soScNum(v)?v.toFixed(1)+'%':'—'; }
function soScFmtMc(v){ return soScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function soScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function soScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function soScVsAvg(m, avg){
  if(!soScNum(m)||!soScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function soScTableOne(wrap){
  var box=wrap.querySelector('.so-sc-tbl'); if(!box||!SO_SC.peers) return;
  var mLab=(SO_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(SO_SC.basis==='f'?'forward':'trailing');
  var rows=SO_SC.peers.map(function(p){ return { p:p, m:soScMult(p), g:soScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=soScNum(a.m), bn=soScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=soScMean(peers.filter(function(r){ return soScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=soScMedian(peers.filter(function(r){ return soScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=soScMean(peers.filter(function(r){ return soScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=soScMedian(peers.filter(function(r){ return soScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return soScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(soScNum(r.m)?'':' asc-nil'), nt=soScNum(r.m)?'':soScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(soScLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+soScFmtMult(r.m)+'</td>'+
      '<td>'+soScFmtDen(p)+'</td>'+
      '<td>'+soScFmtPct(r.g)+'</td>'+
      '<td>'+soScFmtMc(p.mc)+'</td>'+
      '<td>'+soScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-SoFi · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+soScFmtMult(avgM)+'</td><td><span class="asc-nilv">—</span></td><td>'+soScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-SoFi</span></td>'+
      '<td>'+soScFmtMult(medM)+'</td><td><span class="asc-nilv">—</span></td><td>'+soScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th><th>'+(SO_SC.metric==='pe'?'EPS':'EBITDA')+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.so-sc-tblh'), bd=wrap.querySelector('.so-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}

// Valuation ▸ Peers (VA-PEERS): the same map as Overview ▸ Competitors, same SO_SC state (removing a peer here removes it
// there), plus the table of numbers. Multiples and caps are live; the file holds the denominators.
function soValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, with the numbers behind it. Multiples use live prices.</p>'+
    soStdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company\'s latest annual report on SEC EDGAR (Robinhood, Schwab, Interactive Brokers and Upstart FY2025; Affirm FY2026, year ended Jun 30 2026); forward = Bloomberg consensus FY2026 (as of Aug 3 2026) for SoFi only. Price, market cap and EV are live (Massive). EBITDA = operating income + D&A and is not meaningful for brokers, so HOOD, SCHW and IBKR plot on P/E only. Affirm\'s FY2026 net income includes a $1.44B income tax benefit, so its P/E is not shown. Nu is not mapped.</div>';
}

export { soStdPeerScatter, soWireScatters, soScRenderAll, soValuationPeersBody };
