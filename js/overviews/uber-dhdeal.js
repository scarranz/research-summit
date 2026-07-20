// overviews/uber-dhdeal.js — "Deep Dive" analysis for the Delivery Hero Acquisition.
// Rendered inside Uber ▸ Deep Dive ▸ Evolution ▸ Delivery Hero Acquisition ▸ Deep Dive
// (the sibling "Deal Snapshot" tab holds Deborah's deliveryHeroBody()).
//
// Self-contained: exports { body } returning static HTML (scoped .ov-uber-dhd, own
// dhd- classes + a scoped <style>). All charts are inline SVG / CSS bars with fixed
// viewBoxes, so they scale responsively with NO init/timing dependency. The inner
// 5-tab switching (.dhv-tab) is wired in uber.js init() with the same closest()-scoped
// pattern used for the DH map pills — no .ovt-subtab reuse (would collide with the
// parent Evolution subtab scanner).
//
// Sources: Uber FY2025 10-K (US GAAP); Delivery Hero Annual Report 2025 (IFRS, EUR→USD
// @1.12); announcement deck & transcript (16-Jul-2026); BBG Consensus DHER.

// ── Static multiple-bridge waterfall (fixed viewBox, scales via CSS) ──
function wfSvg(){
  var wf=[
    {label:'Headline', sub:'offer price, IFRS, ex-synergies', v:13.7, type:'base'},
    {label:'Blended cost', sub:'prior stake at $13.7bn', v:12.9, type:'down'},
    {label:'+ Synergies', sub:'$1.2bn added to EBITDA', v:6.9, type:'down'},
    {label:'US GAAP + perimeter', sub:'removes IFRS 16 benefit', v:8.0, type:'up'}
  ];
  var C={slot:'#6B7A8D',u:'#2C6ED5',warn:'#C8860B',ink:'#1E2733',mu:'#8A93A0',grid:'#E7EAEE'};
  var W=900,H=340,padT=42,padB=64,padL=8,padR=8,n=wf.length,gap=26;
  var bw=(W-padL-padR-gap*(n-1))/n, vmax=15, base=H-padB;
  function y(v){ return base-(v/vmax)*(base-padT); }
  var s='<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="EV/EBITDA multiple bridge">';
  [0,5,10,15].forEach(function(g){ var yy=y(g);
    s+='<line x1="'+padL+'" y1="'+yy+'" x2="'+(W-padR)+'" y2="'+yy+'" stroke="'+C.grid+'" stroke-width="1"/>';
    s+='<text x="'+(W-padR)+'" y="'+(yy-4)+'" text-anchor="end" font-size="11" fill="'+C.mu+'" font-family="Inter">'+g+'x</text>';
  });
  var pY=null,pX=null;
  wf.forEach(function(d,i){
    var x=padL+i*(bw+gap), col=d.type==='base'?C.slot:(d.type==='up'?C.warn:C.u), yt=y(d.v);
    if(pX!==null) s+='<line x1="'+(pX+bw)+'" y1="'+pY+'" x2="'+x+'" y2="'+pY+'" stroke="'+C.mu+'" stroke-width="1.5" stroke-dasharray="3 3"/>';
    s+='<rect x="'+x+'" y="'+yt+'" width="'+bw+'" height="'+(base-yt)+'" rx="5" fill="'+col+'"/>';
    if(i>0){ var dl=d.v-wf[i-1].v, dt=(dl>0?'+':'')+dl.toFixed(1)+'x', dc=d.type==='up'?C.warn:C.u;
      s+='<text x="'+(x+bw/2)+'" y="'+(Math.min(yt,pY)-24)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+dc+'" font-family="Inter">'+dt+'</text>'; }
    s+='<text x="'+(x+bw/2)+'" y="'+(yt-8)+'" text-anchor="middle" font-size="22" font-weight="800" fill="'+C.ink+'" font-family="Inter">'+d.v.toFixed(1)+'x</text>';
    s+='<text x="'+(x+bw/2)+'" y="'+(base+20)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+C.ink+'" font-family="Inter">'+d.label+'</text>';
    s+='<text x="'+(x+bw/2)+'" y="'+(base+37)+'" text-anchor="middle" font-size="11" fill="'+C.mu+'" font-family="Inter">'+d.sub+'</text>';
    pY=yt; pX=x;
  });
  s+='<text x="'+padL+'" y="'+(padT-22)+'" font-size="12" font-weight="700" fill="'+C.mu+'" font-family="Inter">Unadjusted spot multiple ~14x  →  deck&#39;s &quot;8x&quot;</text>';
  s+='</svg>';
  return s;
}

// grouped % of GMV bar row
function costRow(lab,u,d){
  var mx=22, wu=(u/mx*100).toFixed(1), wd=(d/mx*100).toFixed(1);
  function lbl(v,w){ return '<span class="dhd-val'+(w<14?' out':'')+'">'+v.toFixed(1)+'%</span>'; }
  return '<div class="dhd-brow"><div class="dhd-lab">'+lab+'</div><div class="dhd-track">'+
    '<div class="dhd-bar u" style="width:'+wu+'%">'+lbl(u,wu)+'</div>'+
    '<div class="dhd-bar d" style="width:'+wd+'%">'+lbl(d,wd)+'</div></div></div>';
}

function segRow(nm,v,ssw){
  var neg=1.0,pos=4.2,tot=neg+pos,zero=neg/tot*100,ref=zero+3.9/tot*100;
  var col=v>=0?(v<1?'var(--slot)':'var(--u)'):'var(--d)';
  var bar = v>=0
    ? '<div class="dhd-dbar" style="left:'+zero+'%;width:'+(v/tot*100)+'%;background:'+col+'"></div>'
    : '<div class="dhd-dbar" style="right:'+(100-zero)+'%;width:'+(Math.abs(v)/tot*100)+'%;background:'+col+'"></div>';
  return '<div class="dhd-segrow"><div class="dhd-nm">'+nm+(ssw?' <span class="dhd-ssw">→SSW</span>':'')+'</div>'+
    '<div class="dhd-div"><div class="dhd-zero" style="left:'+zero+'%"></div>'+bar+
    '<div class="dhd-ref" style="left:'+ref+'%"></div></div>'+
    '<div class="dhd-sval" style="color:'+col+'">'+v.toFixed(1)+'%</div></div>';
}

function sensRow(l,m,hl){
  var mx=13;
  return '<div class="dhd-sensrow"><div class="dhd-sl">'+l+'</div>'+
    '<div class="dhd-sbar'+(hl?' hl':'')+'" style="width:'+(m/mx*100).toFixed(1)+'%"></div>'+
    '<div class="dhd-sm">'+m.toFixed(1)+'x</div></div>';
}

function styleBlock(){ return '<style>'+
'.ov-uber-dhd{--u:#2C6ED5;--d:#E23744;--warn:#C8860B;--good:#16A34A;--slot:#6B7A8D;'+
'--ink:#1E2733;--ink2:#48525f;--mu:#8A93A0;--bdr:#E7EAEE;--card:#fff;--soft:#F6F7F9;--grid:#EEF1F5;'+
'font-family:Inter,system-ui,sans-serif;color:var(--ink);font-size:14px;line-height:1.45}'+
'.ov-uber-dhd *{box-sizing:border-box}'+
/* inner tab row */
'.dhv-tabs{display:flex;gap:5px;flex-wrap:wrap;background:var(--soft);border:1px solid var(--bdr);border-radius:11px;padding:5px;margin:0 0 18px}'+
'.dhv-tab{flex:1;min-width:120px;border:none;background:transparent;color:var(--mu);font:700 12.5px Inter,sans-serif;padding:9px 12px;border-radius:7px;cursor:pointer;white-space:nowrap}'+
'.dhv-tab:hover{color:var(--ink);background:#fff}.dhv-tab.active{background:var(--navy,#1E2733);color:#fff}'+
'.dhv-pane[hidden]{display:none}'+
/* cards */
'.dhd-card{background:var(--card);border:1px solid var(--bdr);border-radius:14px;padding:20px 22px;margin-bottom:16px}'+
'.dhd-eye{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--steel,#3E5A82)}'+
'.dhd-t{font-size:18px;font-weight:800;margin:4px 0 2px;letter-spacing:-.2px}'+
'.dhd-lede{font-size:13px;color:var(--ink2);margin:0 0 16px;max-width:820px}.dhd-lede b{color:var(--ink);font-weight:700}'+
'.dhd-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}'+
/* legend */
'.dhd-legend{display:flex;gap:15px;align-items:center;font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:13px;flex-wrap:wrap}'+
'.dhd-legend .it{display:flex;align-items:center;gap:6px}.dhd-dot{width:11px;height:11px;border-radius:3px;display:inline-block}'+
'.dhd-dot.u{background:var(--u)}.dhd-dot.d{background:var(--d)}'+
/* horizontal grouped bars */
'.dhd-rows{display:flex;flex-direction:column;gap:12px}'+
'.dhd-brow{display:grid;grid-template-columns:128px 1fr;gap:12px;align-items:center}'+
'.dhd-lab{font-size:12px;font-weight:600;color:var(--ink2);text-align:right}'+
'.dhd-track{position:relative;display:flex;flex-direction:column;gap:4px}'+
'.dhd-bar{height:21px;border-radius:0 5px 5px 0;position:relative;min-width:2px}'+
'.dhd-bar.u{background:var(--u)}.dhd-bar.d{background:var(--d)}'+
'.dhd-val{position:absolute;right:8px;top:50%;transform:translateY(-50%);color:#fff;font-size:11px;font-weight:700}'+
'.dhd-val.out{right:auto;left:calc(100% + 7px);color:var(--ink)}'+
/* paradox */
'.dhd-para{display:grid;grid-template-columns:1fr 1fr;gap:24px}.dhd-para .col{text-align:center}'+
'.dhd-para h4{font-size:12px;font-weight:700;color:var(--ink2);margin:0 0 12px;text-transform:uppercase;letter-spacing:.4px}'+
'.dhd-vs{display:flex;justify-content:center;gap:24px;align-items:flex-end}'+
'.dhd-vw{display:flex;flex-direction:column;align-items:center;gap:8px}'+
'.dhd-vcol{height:150px;display:flex;align-items:flex-end}'+
'.dhd-vbar{width:60px;border-radius:7px 7px 0 0;position:relative}'+
'.dhd-vbar.u{background:var(--u)}.dhd-vbar.d{background:var(--d)}'+
'.dhd-vbar .top{position:absolute;top:-24px;left:0;right:0;text-align:center;font-size:17px;font-weight:800}'+
'.dhd-vn{font-size:12px;font-weight:700}.dhd-vn.u{color:var(--u)}.dhd-vn.d{color:var(--d)}'+
'.dhd-note{font-size:12px;color:var(--mu);margin-top:12px;font-weight:500}'+
/* callout */
'.dhd-call{margin-top:16px;background:var(--soft);border:1px solid var(--bdr);border-left:3px solid var(--steel,#3E5A82);border-radius:9px;padding:12px 14px;font-size:12.5px;color:var(--ink2)}'+
'.dhd-call b{color:var(--ink)}.dhd-call.warn{border-left-color:var(--warn)}.dhd-call.good{border-left-color:var(--good)}'+
/* segments */
'.dhd-seg{display:flex;flex-direction:column;gap:9px;margin-top:2px}'+
'.dhd-segrow{display:grid;grid-template-columns:118px 1fr 52px;gap:10px;align-items:center}'+
'.dhd-nm{font-size:12px;font-weight:600;color:var(--ink2);text-align:right}'+
'.dhd-sval{font-size:12.5px;font-weight:700}'+
'.dhd-ssw{font-size:9px;font-weight:700;background:#f7d6d6;color:var(--d);padding:1px 5px;border-radius:4px}'+
'.dhd-div{position:relative;height:23px}'+
'.dhd-zero{position:absolute;top:-4px;bottom:-4px;width:1.5px;background:var(--bdr)}'+
'.dhd-dbar{position:absolute;top:2px;height:19px;border-radius:4px}'+
'.dhd-ref{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--u);z-index:2}'+
/* SSW boxes */
'.dhd-box{background:var(--soft);border:1px solid var(--bdr);border-radius:11px;padding:14px 15px;margin-bottom:12px}'+
'.dhd-box h6{margin:0 0 4px;font-size:12.5px;font-weight:800;color:var(--d)}'+
'.dhd-box p{margin:0;font-size:12px;color:var(--ink2)}'+
'.dhd-stat{display:flex;gap:16px;justify-content:space-around;text-align:center;padding-top:2px}'+
'.dhd-stat .n{font-size:22px;font-weight:800;color:var(--ink)}.dhd-stat .k{font-size:11px;color:var(--mu);font-weight:600}'+
/* synergy */
'.dhd-syn{display:flex;flex-direction:column;gap:12px}.dhd-synrow{display:flex;align-items:center;gap:13px}'+
'.dhd-rank{width:29px;height:29px;flex:none;border-radius:8px;background:var(--navy,#1E2733);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}'+
'.dhd-sw{flex:1}.dhd-swt{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px}'+
'.dhd-swt .nm2{font-size:13px;font-weight:700;color:var(--ink)}'+
'.dhd-ty{font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:20px}'+
'.dhd-ty.cost{background:#dbe8fb;color:var(--u)}.dhd-ty.rev{background:#e7e2f5;color:#4a3aa7}'+
'.dhd-synbar{height:13px;border-radius:7px;background:linear-gradient(90deg,#3E5A82,var(--u))}'+
'.dhd-desc{font-size:11.5px;color:var(--mu);margin-top:4px}'+
/* sensitivity */
'.dhd-sens{display:flex;flex-direction:column;gap:10px}'+
'.dhd-sensrow{display:grid;grid-template-columns:150px 1fr 50px;gap:10px;align-items:center}'+
'.dhd-sl{font-size:12px;font-weight:600;color:var(--ink2)}.dhd-sl b{color:var(--ink)}'+
'.dhd-sbar{height:19px;border-radius:0 5px 5px 0;background:linear-gradient(90deg,#2C3E54,#3E5A82)}'+
'.dhd-sbar.hl{background:linear-gradient(90deg,#a06e0a,var(--warn))}'+
'.dhd-sm{font-size:13px;font-weight:800;text-align:right}'+
/* waterfall */
'.dhd-wf{width:100%;overflow-x:auto}.dhd-wf svg{display:block;max-width:100%;height:auto}'+
'.dhd-wfn{font-size:11.5px;color:var(--mu);margin-top:10px}'+
/* tables */
'.dhd-tscroll{width:100%;overflow-x:auto}'+
'.dhd-tbl{width:100%;border-collapse:collapse;font-size:12px;min-width:620px}'+
'.dhd-tbl.sm{min-width:290px}'+
'.dhd-tbl th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);font-weight:700;padding:8px 10px;border-bottom:1px solid var(--bdr)}'+
'.dhd-tbl th.uh{color:var(--u)}.dhd-tbl th.dh{color:var(--d)}.dhd-tbl th.n,.dhd-tbl td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}'+
'.dhd-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--ink2);vertical-align:top;line-height:1.4}'+
'.dhd-tbl tr:last-child td{border-bottom:none}'+
'.dhd-tbl td.c{font-weight:700;color:var(--ink)}.dhd-tbl td.tot{font-weight:800;color:var(--ink)}'+
'.dhd-tbl tr.rule td{border-top:2px solid var(--bdr)}'+
'.dhd-tbl .pos{color:var(--warn);font-weight:700}.dhd-tbl .neg{color:var(--good);font-weight:700}.dhd-tbl td.dim{color:var(--mu);font-size:10.5px}'+
'.dhd-cmp{font-size:10.5px;font-weight:700;white-space:nowrap}.dhd-cmp.ok{color:var(--good)}.dhd-cmp.warn{color:var(--warn)}'+
'.dhd-tnote{font-size:10.5px;color:var(--mu);margin:9px 0 0;line-height:1.55}.dhd-tnote b{color:var(--ink2)}'+
'.dhd-subh{font-size:13px;font-weight:800;color:var(--ink);margin:24px 0 4px}'+
'.dhd-subh .tg{font-size:10px;font-weight:700;color:var(--steel,#3E5A82);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px}'+
'.dhd-foot{font-size:10.5px;color:var(--mu);margin-top:8px;line-height:1.5}'+
/* principal/agent */
'.dhd-pa{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:6px 0 2px}'+
'.dhd-pabox{background:var(--soft);border:1px solid var(--bdr);border-radius:11px;padding:15px 16px}'+
'.dhd-pabox.p{border-top:3px solid var(--d)}.dhd-pabox.a{border-top:3px solid var(--u)}'+
'.dhd-pah{font-size:13px;font-weight:800}.dhd-pabox.p .dhd-pah{color:var(--d)}.dhd-pabox.a .dhd-pah{color:var(--u)}'+
'.dhd-pasub{font-size:11px;font-weight:600;color:var(--mu);margin:2px 0 9px}'+
'.dhd-pabox p{font-size:12px;color:var(--ink2);margin:0;line-height:1.5}.dhd-pabox p b{color:var(--ink)}'+
'.dhd-src{font-size:10.5px;color:var(--mu);margin-top:20px;padding-top:14px;border-top:1px solid var(--bdr)}'+
'@media(max-width:760px){.dhd-grid2,.dhd-para,.dhd-pa{grid-template-columns:1fr}}'+
'</style>'; }

function dhdBody(c){
  var h = '<div class="ov-uber-dhd">'+styleBlock();
  h += '<div class="dhv-wrap">'+
    '<div class="dhv-tabs">'+
      '<button type="button" class="dhv-tab active" data-dhv="ov">GB vs GMV</button>'+
      '<button type="button" class="dhv-tab" data-dhv="cost">Cost Breakdown</button>'+
      '<button type="button" class="dhv-tab" data-dhv="seg">Segments &amp; Divestiture</button>'+
      '<button type="button" class="dhv-tab" data-dhv="syn">Synergy</button>'+
      '<button type="button" class="dhv-tab" data-dhv="val">Valuation Bridge</button>'+
    '</div>';

  // ── OVERVIEW ──
  h += '<div class="dhv-pane" data-dhv="ov">'+
    '<div class="dhd-card">'+
      '<div class="dhd-eye">Starting point</div>'+
      '<div class="dhd-t">The paradox: higher take rate, lower margin</div>'+
      '<p class="dhd-lede">Comparing delivery to delivery (Uber Eats vs Delivery Hero, FY2025). Delivery Hero captures <b>more revenue per dollar of GMV</b> — yet converts <b>far less of it into EBITDA</b>. The gap is not pricing; it is cost.</p>'+
      '<div class="dhd-para">'+
        '<div class="col"><h4>Take rate — revenue ÷ GMV</h4><div class="dhd-vs">'+
          '<div class="dhd-vw"><div class="dhd-vcol"><div class="dhd-vbar u" style="height:66px"><span class="top">19.0%</span></div></div><span class="dhd-vn u">Uber Eats</span></div>'+
          '<div class="dhd-vw"><div class="dhd-vcol"><div class="dhd-vbar d" style="height:100px"><span class="top">28.6%</span></div></div><span class="dhd-vn d">Delivery Hero</span></div>'+
        '</div><div class="dhd-note">DH captures a ~50% higher take rate…</div></div>'+
        '<div class="col"><h4>Margin — Adj. EBITDA ÷ GMV</h4><div class="dhd-vs">'+
          '<div class="dhd-vw"><div class="dhd-vcol"><div class="dhd-vbar u" style="height:140px"><span class="top">3.9%</span></div></div><span class="dhd-vn u">Uber Eats</span></div>'+
          '<div class="dhd-vw"><div class="dhd-vcol"><div class="dhd-vbar d" style="height:64px"><span class="top">1.8%</span></div></div><span class="dhd-vn d">Delivery Hero</span></div>'+
        '</div><div class="dhd-note">…yet earns less than half the margin.</div></div>'+
      '</div>'+
      '<div class="dhd-call"><b>Why?</b> Two drivers: (1) <b>accounting</b> — a portion of DH\'s higher take rate is grocery / quick-commerce recognized <b>gross</b> (as principal), i.e. thin-margin retail revenue; (2) <b>operating</b> — sub-scale costs, principally <b>technology</b>. Meanwhile Uber Eats\' margin is <b>expanding</b> (3.3%→3.9% in one year): the gap is widening. <span style="color:var(--mu)">Full detail under Cost Breakdown.</span></div>'+
    '</div>'+
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The root cause</div>'+
      '<div class="dhd-t">Why DH\'s take rate is higher: it owns part of the stores</div>'+
      '<p class="dhd-lede">DH\'s 28.6% take rate is not richer economics than Uber\'s ~19% — it reflects a different <b>revenue-recognition model</b> on part of the business. Under IFRS 15, whether you book gross or net turns on <b>who owns the goods</b>.</p>'+
      '<div class="dhd-pa">'+
        '<div class="dhd-pabox p"><div class="dhd-pah">Principal → books GROSS</div><div class="dhd-pasub">Dmarts grocery + own delivery · ~13% of GMV</div>'+
          '<p>DH <b>owns and operates its own grocery dark-stores ("Dmarts")</b> — it buys, stocks and holds the inventory, bears the inventory risk, then sells directly to the consumer, exactly like a retailer. Being primarily responsible for the goods makes DH the <b>principal</b>, so it recognizes the <b>full sale value (GMV ex-VAT)</b> as revenue, with the merchandise in cost of sales.</p></div>'+
        '<div class="dhd-pabox a"><div class="dhd-pah">Agent → books NET</div><div class="dhd-pasub">Restaurant marketplace · commission only</div>'+
          '<p>When a customer orders from a <b>third-party restaurant</b>, DH merely arranges the transaction — it never owns the food or bears inventory risk. That makes DH an <b>agent</b>, so it books only its <b>commission</b> (net), not the value of the meal. This is how Uber Eats recognizes almost all of its revenue.</p></div>'+
      '</div>'+
      '<div class="dhd-call warn"><b>Net effect:</b> the owned-store model grosses up DH\'s reported revenue and lifts the take rate to 28.6% vs Uber\'s mostly-net ~19% — but it is <b>thin-margin retail revenue</b> (Dmarts converts just 0.1% of GMV into EBITDA), not a structurally better take. This is precisely why revenue and take rate are not comparable across the two, and why every margin comparison here uses <b>Adj. EBITDA / GMV</b> instead.</div>'+
    '</div></div>';

  // ── COST BREAKDOWN ──
  h += '<div class="dhv-pane" data-dhv="cost" hidden>'+
    // 1 of 3
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The breakdown · 1 of 3</div>'+
      '<div class="dhd-t">Where each dollar of GMV goes</div>'+
      '<p class="dhd-lede">Each cost bucket as a <b>% of GMV</b> — a neutral denominator that removes the gross-vs-net distortion. Wherever DH\'s red bar exceeds Uber\'s blue, margin is leaking.</p>'+
      '<div class="dhd-legend"><div class="it"><span class="dhd-dot u"></span>Uber (consolidated)</div><div class="it"><span class="dhd-dot d"></span>Delivery Hero</div><div class="it" style="color:var(--mu)">Scale: % of GMV</div></div>'+
      '<div class="dhd-rows">'+
        costRow('Cost of sales',16.2,21.6)+costRow('Marketing',2.5,2.9)+costRow('Technology',1.8,1.0)+costRow('G&amp;A / overhead',1.7,2.9)+costRow('Adj. EBITDA',4.5,1.8)+
      '</div>'+
      '<div class="dhd-call warn"><b>The visible gap is overhead:</b> DH\'s G&amp;A is <b>2.9%</b> of GMV vs Uber\'s <b>1.7%</b> (~1.2pp higher) — the <b>shared-services / headcount</b> bucket, i.e. synergy #2. DH\'s true cost of technology is higher than Uber\'s but sits buried within cost of sales; that is synergy #1 and is not fully visible in the reported lines.</div>'+
    '</div>'+
    // 2 of 3
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The breakdown · 2 of 3</div>'+
      '<div class="dhd-t">What each cost line is — and how the two P&amp;Ls translate</div>'+
      '<p class="dhd-lede">The two companies run the <b>same underlying economics</b> (a marketplace layered on a courier-logistics network), but report it under different frameworks. This map shows how each economic cost block appears in each P&amp;L, and whether the lines are directly comparable.</p>'+
      '<div class="dhd-tscroll"><table class="dhd-tbl">'+
        '<thead><tr><th>Economic cost block</th><th class="uh">Uber — US GAAP line</th><th class="dh">Delivery Hero — IFRS line</th><th>Comparable?</th></tr></thead><tbody>'+
        '<tr><td class="c">Fulfilment &amp; merchandise</td><td>Cost of revenue — courier pay (in principal markets), insurance, payment processing, data-center &amp; networking</td><td>Cost of sales — own-delivery / rider cost (~68% of COGS) + Dmarts merchandise (grocery)</td><td><span class="dhd-cmp warn">⚠ Partial</span> — gross vs net differ</td></tr>'+
        '<tr><td class="c">Support &amp; operations</td><td>Operations &amp; support (own line)</td><td>Folded into cost of sales / G&amp;A (no separate line)</td><td><span class="dhd-cmp warn">⚠ Reclassified</span></td></tr>'+
        '<tr><td class="c">Demand generation</td><td>Sales &amp; marketing</td><td>Marketing expenses</td><td><span class="dhd-cmp ok">✓ Comparable</span></td></tr>'+
        '<tr><td class="c">Technology</td><td>Research &amp; development + Platform R&amp;D (inside Corporate)</td><td>IT expenses (+ further tech inside cost of sales)</td><td><span class="dhd-cmp warn">⚠ Buried both</span></td></tr>'+
        '<tr><td class="c">Corporate overhead</td><td>General &amp; administrative</td><td>General administrative expenses</td><td><span class="dhd-cmp ok">✓ Comparable</span> — gap visible</td></tr>'+
        '</tbody></table></div>'+
      '<div class="dhd-grid2" style="margin-top:18px">'+
        '<div class="dhd-box" style="border-top:3px solid var(--good)"><h6 style="color:var(--good)">✓ Where they are alike</h6>'+
          '<p style="margin-bottom:9px"><b>Same four cost blocks</b> — courier / fulfilment, demand-gen marketing, platform technology, corporate overhead.</p>'+
          '<p style="margin-bottom:9px"><b>Both report an "Adjusted EBITDA"</b> — each adds back SBC, D&amp;A, restructuring, legal / regulatory and M&amp;A items.</p>'+
          '<p style="margin-bottom:9px"><b>Mixed principal / agent model</b> — pure marketplace = agent (net); own-delivery &amp; grocery = principal (gross).</p>'+
          '<p style="margin-bottom:9px"><b>A high-margin advertising layer</b> on top of GMV (DH ~3%, Uber a few %).</p>'+
          '<p><b>GMV as the scale metric</b>, with revenue a downstream take-rate slice.</p></div>'+
        '<div class="dhd-box" style="border-top:3px solid var(--warn)"><h6 style="color:var(--warn)">⚠ Where they diverge</h6>'+
          '<p style="margin-bottom:9px"><b>1 · Accounting framework.</b> Uber US GAAP vs DH IFRS — headline figures not like-for-like.</p>'+
          '<p style="margin-bottom:9px"><b>2 · Gross vs net revenue.</b> DH recognises more gross (grocery / Dmarts as principal at GMV-ex-VAT; own-delivery fees gross), inflating revenue &amp; take rate. Compare on GMV &amp; EBITDA / GMV, never revenue.</p>'+
          '<p style="margin-bottom:9px"><b>3 · IFRS 16 leases.</b> DH\'s Adj. EBITDA excludes right-of-use depreciation, structurally lifting it; US GAAP keeps operating-lease cost inside EBITDA.</p>'+
          '<p style="margin-bottom:9px"><b>4 · Adjusted-EBITDA definition.</b> DH also excludes goodwill impairment &amp; books large "management adjustments"; Uber applies its own 14-item bridge. Uber restated DH to US GAAP for the ~8x.</p>'+
          '<p style="margin-bottom:9px"><b>5 · Line classification.</b> Uber isolates "Operations &amp; support" &amp; puts insurance / payments in cost of revenue; DH folds these into cost of sales / G&amp;A.</p>'+
          '<p><b>6 · Hyperinflation (IAS 29).</b> DH restates Türkiye &amp; Argentina; US GAAP has no equivalent.</p></div>'+
      '</div>'+
      '<p class="dhd-foot">Uber consolidated includes the higher-margin Mobility segment, so the company-level bars in 1/3 are directional; the clean delivery-vs-delivery comparison is the Overview tab (Uber Eats 3.9% vs DH 1.8% Adj. EBITDA / GMV).</p>'+
    '</div>'+
    // 3 of 3
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The breakdown · 3 of 3 · technical detail</div>'+
      '<div class="dhd-t">The numbers, side by side — sizing where the synergy sits</div>'+
      '<p class="dhd-lede">Absolute figures straight from the filings (Uber FY2025 10-K, US GAAP, $M; Delivery Hero FY2025 Annual Report, IFRS, €M, converted at 1.12). The point is not the raw size — Uber is 3.5x DH\'s GMV and carries Mobility — but the <b>cost intensity per unit of GMV</b>, and the delivery-segment head-to-head.</p>'+
      '<div class="dhd-subh"><span class="tg">The cleanest comparison</span>Delivery vs delivery — near-equal revenue, 3.5x the profit</div>'+
      '<div class="dhd-tscroll"><table class="dhd-tbl">'+
        '<thead><tr><th>Metric ($M)</th><th class="n uh">Uber Delivery</th><th class="n dh">Delivery Hero (group)</th><th class="n">Uber advantage</th></tr></thead><tbody>'+
        '<tr><td class="c">GMV / Gross Bookings</td><td class="n">90,864</td><td class="n">55,100</td><td class="n dim">1.6x scale</td></tr>'+
        '<tr><td class="c">Revenue</td><td class="n">17,248</td><td class="n">15,747</td><td class="n dim">near-equal</td></tr>'+
        '<tr><td class="c">Take rate (rev / GMV)</td><td class="n">19.0%</td><td class="n">28.6%</td><td class="n dim">DH higher*</td></tr>'+
        '<tr class="rule"><td class="c tot">Adj. EBITDA</td><td class="n tot">3,572</td><td class="n tot">1,011</td><td class="n pos">3.5x</td></tr>'+
        '<tr><td class="c">Adj. EBITDA / GMV</td><td class="n">3.9%</td><td class="n">1.8%</td><td class="n pos">+2.1pp</td></tr>'+
        '<tr><td class="c">Adj. EBITDA / revenue</td><td class="n">20.7%</td><td class="n">6.4%</td><td class="n pos">+14.3pp</td></tr>'+
        '</tbody></table></div>'+
      '<p class="dhd-tnote">*DH\'s higher take rate is largely a gross-vs-net artifact (see revenue build below), not richer economics. <b>Same revenue scale, 3.5x the EBITDA</b> — the entire synergy case in one line.</p>'+
      '<div class="dhd-subh"><span class="tg">Full P&amp;L, absolute &amp; intensity</span>Every reported cost line, sized against its own GMV</div>'+
      '<div class="dhd-tscroll"><table class="dhd-tbl">'+
        '<thead><tr><th>Line</th><th class="n uh">Uber $M</th><th class="n uh">% GB</th><th class="n dh">DH €M</th><th class="n dh">DH $M</th><th class="n dh">% GMV</th><th class="n">Δ pp</th></tr></thead><tbody>'+
        '<tr><td class="c">Revenue</td><td class="n">52,017</td><td class="n">26.9%</td><td class="n">14,059.6</td><td class="n">15,747</td><td class="n">28.6%</td><td class="n dim">+1.7</td></tr>'+
        '<tr><td class="c">Cost of fulfilment¹</td><td class="n">31,338</td><td class="n">16.2%</td><td class="n">10,626.5</td><td class="n">11,902</td><td class="n">21.6%</td><td class="n pos">+5.4</td></tr>'+
        '<tr><td class="c">Operations &amp; support²</td><td class="n">2,854</td><td class="n">1.5%</td><td class="n dim" colspan="3" style="text-align:center">folded into COGS / G&amp;A</td><td class="n dim">—</td></tr>'+
        '<tr><td class="c">Marketing</td><td class="n">4,898</td><td class="n">2.5%</td><td class="n">1,419.6</td><td class="n">1,590</td><td class="n">2.9%</td><td class="n pos">+0.4</td></tr>'+
        '<tr><td class="c">Technology³</td><td class="n">3,402</td><td class="n">1.8%</td><td class="n">485.0</td><td class="n">543</td><td class="n">1.0%</td><td class="n dim">−0.8*</td></tr>'+
        '<tr><td class="c">G&amp;A / overhead</td><td class="n">3,241</td><td class="n">1.7%</td><td class="n">1,411.3</td><td class="n">1,581</td><td class="n">2.9%</td><td class="n pos">+1.2</td></tr>'+
        '<tr><td class="c">D&amp;A⁴</td><td class="n">719</td><td class="n">0.4%</td><td class="n">445.7</td><td class="n">499</td><td class="n">0.9%</td><td class="n dim">+0.5</td></tr>'+
        '<tr class="rule"><td class="c tot">Adj. EBITDA</td><td class="n tot">8,730</td><td class="n tot">4.5%</td><td class="n tot">903.0</td><td class="n tot">1,011</td><td class="n tot">1.8%</td><td class="n pos">−2.7</td></tr>'+
        '<tr><td class="c dim">memo: Stock-based comp</td><td class="n dim">1,826</td><td class="n dim">0.9%</td><td class="n dim">224.1</td><td class="n dim">251</td><td class="n dim">0.5%</td><td class="n dim">−0.5</td></tr>'+
        '</tbody></table></div>'+
      '<p class="dhd-tnote"><b>Δ pp</b> = DH % of GMV minus Uber % of GB; orange marks where DH runs heavier. Uber = <b>consolidated</b> (Mobility + Delivery + Freight), so absolute sizes are not like-for-like — read the intensity columns. ¹ Not comparable: DH books couriers &amp; grocery gross; Uber nets couriers in agent markets (incl. ~€2.2bn Dmarts merchandise). ² Uber isolates Operations &amp; support; DH folds it in. ³ <b>The reported tech lines mislead</b> — Uber\'s tech also sits in Platform R&amp;D (inside the $2.7bn Corporate item) and infra within cost of revenue; management states DH\'s <b>fully-loaded cost of tech per GB is higher</b> than Uber\'s — the reverse of the reported 1.8% vs 1.0%. ⁴ DH D&amp;A is inflated by IFRS 16 (capitalised leases).</p>'+
      '<div class="dhd-grid2" style="margin-top:6px">'+
        '<div><div class="dhd-subh"><span class="tg">DH revenue build (IFRS)</span>Why the take rate looks inflated</div>'+
          '<div class="dhd-tscroll"><table class="dhd-tbl sm"><thead><tr><th>Revenue stream</th><th class="n">€M</th><th class="n">% GMV</th></tr></thead><tbody>'+
            '<tr><td>Commission fees <span class="dim">(agent / net)</span></td><td class="n">5,790.8</td><td class="n">11.8%</td></tr>'+
            '<tr><td>Delivery fees <span class="dim">(principal / gross)</span></td><td class="n">3,308.9</td><td class="n">6.7%</td></tr>'+
            '<tr><td>Dmarts grocery <span style="color:var(--d)">(principal / gross)</span></td><td class="n">2,888.2</td><td class="n">5.9%</td></tr>'+
            '<tr><td>Advertising &amp; listing</td><td class="n">1,459.5</td><td class="n">3.0%</td></tr>'+
            '<tr><td>Service fees</td><td class="n">601.0</td><td class="n">1.2%</td></tr>'+
            '<tr><td>Payment fees</td><td class="n">540.8</td><td class="n">1.1%</td></tr>'+
            '<tr><td>Subscription fees</td><td class="n">256.9</td><td class="n">0.5%</td></tr>'+
            '<tr><td>Other</td><td class="n">151.2</td><td class="n">0.3%</td></tr>'+
            '<tr><td>Less: vouchers</td><td class="n neg">(937.8)</td><td class="n">−1.9%</td></tr>'+
            '<tr class="rule"><td class="tot">Revenue</td><td class="n tot">14,059.6</td><td class="n tot">28.6%</td></tr>'+
            '</tbody></table></div>'+
          '<p class="dhd-tnote"><b>~13% of GMV</b> is booked gross (delivery fees + Dmarts), most of DH\'s take-rate premium. Dmarts revenue €2,888m on €2,245m merchandise = ~22% retail margin.</p></div>'+
        '<div><div class="dhd-subh"><span class="tg">DH cost of sales, decomposed</span>A logistics-heavy cost base</div>'+
          '<div class="dhd-tscroll"><table class="dhd-tbl sm"><thead><tr><th>Component</th><th class="n">€M</th><th class="n">% of COGS</th></tr></thead><tbody>'+
            '<tr><td>Own-delivery / rider cost</td><td class="n">7,258</td><td class="n">68.3%</td></tr>'+
            '<tr><td>Dmarts merchandise (grocery)</td><td class="n">2,245.5</td><td class="n">21.1%</td></tr>'+
            '<tr><td>Payment, packaging &amp; other</td><td class="n">1,123</td><td class="n">10.6%</td></tr>'+
            '<tr class="rule"><td class="tot">Cost of sales</td><td class="n tot">10,626.5</td><td class="n tot">100%</td></tr>'+
            '</tbody></table></div>'+
          '<p class="dhd-tnote">Uber does not disclose a numeric split of its $31.3bn cost of revenue. FY2025 <b>incremental</b> drivers: +$1.6bn courier pay, +$1.6bn driver pay, +$0.9bn insurance.</p></div>'+
      '</div>'+
      // synergy sits
      '<div class="dhd-subh"><span class="tg">Where the synergy sits</span>Mapping the gap to the $1.2bn target</div>'+
      '<div class="dhd-tscroll"><table class="dhd-tbl">'+
        '<thead><tr><th>Lever (management rank)</th><th>What the data shows</th><th class="n">Indicative size</th><th>Type</th></tr></thead><tbody>'+
        '<tr><td class="c">1 · Tech re-platform</td><td>Reported tech lines not comparable; management: DH\'s fully-loaded cost of tech per GB exceeds Uber\'s, closed by migrating to one global platform</td><td class="n">Largest <span class="dim">(undisclosed)</span></td><td style="color:var(--u);font-weight:700">Cost</td></tr>'+
        '<tr><td class="c">2 · Shared services / G&amp;A</td><td>Visible gap of +1.2pp of GMV in overhead; plus courier payments, support, insurance at Uber scale</td><td class="n">~$0.5–0.65bn</td><td style="color:var(--u);font-weight:700">Cost</td></tr>'+
        '<tr><td class="c">3 · Fulfilment efficiency</td><td>Within the +5.4pp COGS gap, net of the gross/net &amp; Dmarts distortion — routing, batching, payments via Uber tech</td><td class="n dim">Portion of gap</td><td style="color:var(--u);font-weight:700">Cost</td></tr>'+
        '<tr><td class="c">4 · Cross-platform</td><td>Revenue synergy; conservative assumptions, upside excluded</td><td class="n dim">Small</td><td style="color:#4a3aa7;font-weight:700">Revenue</td></tr>'+
        '</tbody></table></div>'+
      '<div class="dhd-call"><b>The anchor:</b> lifting DH group from 1.8% to Uber Delivery\'s 3.9% Adj. EBITDA / GMV is worth <b>~$1.15bn</b> of EBITDA on DH\'s ~$55bn GMV (~$0.56bn on the retained ~$42bn perimeter, already at 2.6%). The <b>$1.2bn plan therefore implies reaching — and likely exceeding — Uber\'s current delivery margin</b> on the acquired base: achievable given DH\'s higher-growth markets (MENA/Talabat is already at 3.7%), but almost entirely an execution story in technology and shared-services cost, not revenue.</div>'+
    '</div></div>';

  // ── SEGMENTS & DIVESTITURE ──
  h += '<div class="dhv-pane" data-dhv="seg" hidden>'+
    '<div class="dhd-grid2">'+
      '<div class="dhd-card">'+
        '<div class="dhd-eye">By segment</div><div class="dhd-t">Uber retained the profitable markets</div>'+
        '<p class="dhd-lede">Margin (Adj. EBITDA ÷ GMV) by Delivery Hero region. The <span style="color:var(--u);font-weight:700">blue line</span> marks Uber Eats (3.9%). Europe is loss-making — and it is precisely what is being divested to SSW.</p>'+
        '<div class="dhd-seg">'+
          segRow('MENA / Talabat',3.7,false)+segRow('Americas',2.5,false)+segRow('Asia',1.6,false)+segRow('Integ. Verticals',0.1,false)+segRow('Europe',-0.8,true)+
        '</div>'+
        '<div class="dhd-call good" style="margin-top:14px"><b>MENA / Talabat (3.7%) is already more profitable than Uber Eats.</b> The transaction is priced on an already-cleaned perimeter, excluding the loss-making markets.</div>'+
      '</div>'+
      '<div class="dhd-card">'+
        '<div class="dhd-eye">The 14 markets to SSW</div><div class="dhd-t">A dual rationale for the divestiture</div>'+
        '<p class="dhd-lede">Delivery Hero divests 14 markets to SSW Partners for <b>~$1.6bn</b>. The selection is deliberate.</p>'+
        '<div class="dhd-box"><h6>① Overlap with Uber Eats</h6><p>Markets where Uber Eats <b>already operates</b> → removes the delivery-on-delivery antitrust concern. <span style="color:var(--mu)">(Press release, verbatim)</span></p></div>'+
        '<div class="dhd-box"><h6>② The loss-making markets</h6><p>Concentrated in <b>Europe</b> (−0.8% margin): Glovo Spain, foodora, Yemeksepeti (Türkiye)…</p></div>'+
        '<div class="dhd-stat"><div><div class="n">$11<span style="font-size:12px">bn</span></div><div class="k">GMV divested</div></div><div><div class="n">14</div><div class="k">markets</div></div><div><div class="n">$1.6<span style="font-size:12px">bn</span></div><div class="k">SSW price</div></div></div>'+
      '</div>'+
    '</div></div>';

  // ── SYNERGY ──
  h += '<div class="dhv-pane" data-dhv="syn" hidden>'+
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The synergy</div><div class="dhd-t">Where the &gt;$1.2bn (run-rate, 18 months) comes from</div>'+
      '<p class="dhd-lede">Management was explicit: it is <b>predominantly cost, not revenue</b>. Relative magnitude of the buckets (bar size is indicative — no figures were disclosed):</p>'+
      '<div class="dhd-syn">'+
        '<div class="dhd-synrow"><div class="dhd-rank">1</div><div class="dhd-sw"><div class="dhd-swt"><span class="nm2">Migration to Uber\'s common technology platform</span><span class="dhd-ty cost">COST</span></div><div class="dhd-synbar" style="width:100%"></div><div class="dhd-desc">The largest driver. DH runs sub-scale local stacks; Uber operates a single global platform → technology-cost leverage.</div></div></div>'+
        '<div class="dhd-synrow"><div class="dhd-rank">2</div><div class="dhd-sw"><div class="dhd-swt"><span class="nm2">Shared services and headcount</span><span class="dhd-ty cost">COST</span></div><div class="dhd-synbar" style="width:62%"></div><div class="dhd-desc">Cost of payments, support, insurance and corporate functions. Observable: G&amp;A of 2.9% vs Uber\'s 1.7% of GMV.</div></div></div>'+
        '<div class="dhd-synrow"><div class="dhd-rank">3</div><div class="dhd-sw"><div class="dhd-swt"><span class="nm2">Cross-platform / revenue synergy</span><span class="dhd-ty rev">REVENUE</span></div><div class="dhd-synbar" style="width:24%;background:linear-gradient(90deg,#6a5cc0,#4a3aa7)"></div><div class="dhd-desc">The smallest, on conservative assumptions — upside excluded. Cross-platform users generate ~3× the gross bookings of single-product users.</div></div></div>'+
      '</div>'+
      '<div class="dhd-call"><b>Why it is credible:</b> DH (excluding Baemin / Korea) already runs on a common backend architecture → not a multi-year re-platforming, but a migration of brands onto Uber\'s existing platform.</div>'+
    '</div></div>';

  // ── VALUATION BRIDGE ──
  h += '<div class="dhv-pane" data-dhv="val" hidden>'+
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The valuation bridge · the central exhibit</div><div class="dhd-t">How a ~14x multiple is presented as "~8x"</div>'+
      '<p class="dhd-lede">EV / 2027E EBITDA, step by step. The deck\'s "8x" is <b>not</b> a market multiple: it is forward, struck at a blended cost, and calculated <b>after adding the synergies to the denominator</b>. The unadjusted spot multiple is ~14x.</p>'+
      '<div class="dhd-wf">'+wfSvg()+'</div>'+
      '<div class="dhd-legend" style="margin-top:12px;justify-content:center"><div class="it"><span class="dhd-dot" style="background:var(--slot)"></span>Starting point</div><div class="it"><span class="dhd-dot" style="background:var(--u)"></span>Lever that LOWERS the multiple</div><div class="it"><span class="dhd-dot" style="background:var(--warn)"></span>Adjustment that RAISES it (conservative)</div></div>'+
      '<div class="dhd-wfn">EV ≈ $17.9bn (equity of $13.7bn, adjusted for the prior stake acquired below the offer price, plus $4.2bn of net debt and minority interests). 2027E Adj. EBITDA (BBG consensus) = €1,218.8M ($1.39bn). Synergies &gt;$1.2bn.</div>'+
    '</div>'+
    '<div class="dhd-card">'+
      '<div class="dhd-eye">The dependency</div><div class="dhd-t">The "8x" holds only if the synergies are delivered</div>'+
      '<p class="dhd-lede">Multiple paid (EV $17.9bn ÷ 2027E EBITDA) as a function of synergy realized. Absent any synergy, Uber pays <b>~13x</b>.</p>'+
      '<div class="dhd-sens">'+
        sensRow('<b>$0</b> — none',12.9,false)+sensRow('<b>$0.6bn</b> — half',9.0,false)+sensRow('<b>$1.2bn</b> — plan',6.9,true)+sensRow('<b>$1.8bn</b> — upside',5.6,false)+
      '</div>'+
      '<div class="dhd-call warn"><b>The entire "attractive valuation" thesis rests on cost execution</b> (technology + shared services) — the same dependency the cost structure reveals. It is not a revenue-growth thesis.</div>'+
    '</div></div>';

  h += '<div class="dhd-src">Sources: Uber FY2025 Form 10-K (US GAAP) · Delivery Hero Annual Report 2025 (IFRS) · Announcement deck &amp; transcript (July 16, 2026) · BBG Consensus DHER. FX EUR/USD 1.12 (P&amp;L) / 1.14 (transaction).</div>';
  h += '</div>'; // dhv-wrap
  h += '</div>'; // ov-uber-dhd
  return h;
}

export var uberDhDeepDive = { body: dhdBody };
