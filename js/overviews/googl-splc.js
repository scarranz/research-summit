// googl-splc.js — Alphabet Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// COPIED from js/overviews/meta-splc.js (the guide-built copy of tsm-splc.js / amzn.js A_SPLC_* · aSplcBody), then fed
// with Alphabet's data:
//   • data: Bloomberg SPLC, GOOGL US Equity, as of Jul 22 2026 — the figures DOAA351 compiled for the July profile
//     (googl.js SPLC_INFRA · SPLC_CONTENT · SPLC_DEP and the KPI strip), used as they were (SAB, Oct 26 2026: the
//     export file itself is not in the repo or in Drive, so nothing could be re-read or added). Moved here from googl.js
//     (relocation map #23–#28). The export Dani worked from gave relationship sizes for the capex suppliers only;
//     the content partners and the dependency list come with the supplier's revenue share alone.
//   • Chain 1 = the AI-infrastructure chain (capex); Chain 2 = the content ecosystem paid through revenue share
//     (cost of revenues and SG&A).
//   • formal skin (§21): Summit tokens, running text in black, no emojis, no categorical colours; card readings are
//     Summit's (Dani's text, kept).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, GOOGL US Equity, supplier side (as compiled by DOAA351) ────────────────
// rel = Bloomberg's relationship size (US$M); cost = % of Alphabet's capex costs; their = % of the supplier's revenue
// from Alphabet.
var SPLC_ASOF='Jul 22, 2026';
var SPLC_TOTAL={ suppliers:728, customers:1166, facilities:7353, distressedSupp:22, distressedCust:67, sanctioned:5 };
var CHAIN1=[
  { n:'NVIDIA', cat:'AI accelerators', rel:13300, cost:11.9, their:4.9,
    d:'The single biggest supplier relationship — the GPU fleet (Blackwell, Hopper, the coming Vera Rubin) that Alphabet both uses and rents out through Google Cloud. Alphabet is a large buyer, yet only about 4.9% of NVIDIA’s revenue: neither side is captive.' },
  { n:'Broadcom', cat:'TPU co-design · networking', rel:9200, cost:9.6, their:12.8,
    d:'The TPU relationship: Broadcom co-designs and supplies the custom silicon at the heart of the full-stack strategy; about 12.8% of Broadcom’s revenue traces to Alphabet. TSMC does not appear among the top direct suppliers — the foundry exposure runs through Broadcom, so Alphabet’s most critical single dependency is second-order and does not show in the first-order map.' },
  { n:'Hon Hai (Foxconn)', cat:'Server and rack assembly', rel:6000, cost:6.7, their:2.6,
    d:'Server and rack assembly at hyperscale. Taiwan-headquartered with a global footprint — part of why supplier facilities concentrate in Asia even where domiciles do not.' },
  { n:'SK hynix', cat:'HBM memory', rel:5200, cost:4.4, their:7.3,
    d:'High-bandwidth memory, the scarcest input of the AI build. 7.3% of SK hynix’s revenue from one buyer makes Alphabet a priority customer in the tightest part of the chain.' },
  { n:'Celestica', cat:'Networking and ODM hardware', rel:3800, cost:4.0, their:30.1,
    d:'About 30% of Celestica’s revenue is Alphabet (networking and ODM hardware): close to captive capacity, and its results are a public read-through on Alphabet’s data-center build cadence.' },
  { n:'Optics and networking cluster', cat:'800G optics · switching', rel:null, relTxt:'Zhongji · Lumentum · Ciena · Arista · Marvell', cost:2.5, costTxt:'about 2.5% of capex costs combined', their:null, theirTxt:'Zhongji 22.4% · Lumentum 21.0% of their revenue',
    d:'The 800G-optics and switching layer: Zhongji Innolight (22.4% of its revenue from Alphabet) and Lumentum (21.0%), plus Ciena, Arista (4.6%), Marvell (3.6%), Jabil and MediaTek. Individually small for Alphabet; large for several of them.' },
];
// Chain 2 — the content ecosystem: "suppliers" Alphabet pays through revenue share (YouTube licensing, Google Play).
var CHAIN2=[
  { n:'Warner Music',    their:12.0, cat:'YouTube licensing', lands:'SG&A' },
  { n:'Universal Music', their:5.6,  cat:'YouTube licensing', lands:'Cost of revenues' },
  { n:'Take-Two',        their:22.9, cat:'Google Play and ads revenue share', lands:'Cost of revenues' },
  { n:'GREE',            their:21.8, cat:'Google Play ecosystem', lands:'Cost of revenues' },
  { n:'GungHo',          their:17.6, cat:'Google Play ecosystem', lands:'Cost of revenues' },
  { n:'Koei Tecmo',      their:10.1, cat:'Google Play ecosystem', lands:'Cost of revenues' },
];
// Who needs whom — % of the counterpart's revenue from Alphabet.
var DEP=[
  ['System1', 67, 'ad-tech riding Google demand'], ['Mobirix', 53, 'mobile games — Google Play'], ['Drecom', 35, 'games — Google Play'],
  ['Celestica', 30, 'ODM hardware'], ['Duolingo', 23, 'Google Play and ads'], ['Take-Two', 23, 'Google Play revenue share'],
  ['Zhongji Innolight', 22, '800G optics'], ['Lumentum', 21, 'optics'],
];
// Geography — the countries Dani's compilation names (share of supplier facilities; suppliers domiciled).
var GEO=[ { c:'United States', facPct:27.8, n:null }, { c:'China', facPct:11.8, n:69 }, { c:'Germany', facPct:6.0, n:null },
          { c:'Japan', facPct:null, n:67 }, { c:'South Korea', facPct:null, n:49 }, { c:'Taiwan', facPct:null, n:42 } ];
// The customer side SPLC can trace (relocation map #28: the advertisers do not show; these are the Cloud and telecom book).
var CUST=[ ['Verizon','$1.5B estimated relationship · 2.7% of its costs'], ['Equifax','7.8% of its cost base (a heavy Google Cloud commitment)'],
           ['TD SYNNEX · AT&T · T-Mobile · Computacenter · Insight','telecom carriers and IT resellers'] ];

function money(m){ return '$'+(m>=1000?(m/1000).toFixed(1)+'B':Math.round(m)+'M'); }
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function geoRow(c){ for(var i=0;i<GEO.length;i++){ if(GEO[i].c===c) return GEO[i]; } return null; }

export function googlSplcBody(){
  var top=CHAIN1[0], us=geoRow('United States'), cn=geoRow('China'), sized=CHAIN1.filter(function(s){ return s.rel!=null; });
  var c1=0; sized.forEach(function(s){ c1+=s.rel; });
  var h='';
  h+='<p class="ov-lede"><b>What SPLC can and cannot see.</b> Alphabet’s real demand side — millions of advertisers — is invisible to Bloomberg’s supply-chain data; what it traces is the supplier base. Bloomberg tracks <b>'+SPLC_TOTAL.suppliers+' suppliers</b>, and two chains stand out: the AI-infrastructure vendors behind the capex (the '+sized.length+' largest relationships add up to <b>'+money(c1)+'</b>), and a content ecosystem of record labels and game studios paid through revenue share.</p>';
  h+=ddStat([[String(SPLC_TOTAL.suppliers),'suppliers tracked'],[SPLC_TOTAL.facilities.toLocaleString('en-US'),'supplier facilities'],
    [us.facPct.toFixed(1)+'%','of supplier facilities in the US'],[cn.facPct.toFixed(1)+'%','of supplier facilities in China'],
    [money(top.rel),'largest relationship ('+top.n+'), '+top.cost.toFixed(1)+'% of capex costs']]);
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 1 · the AI-infrastructure chain (capex)</b> — relationship size; bar = relative to the largest. Tap a card for the read.</div>';
  h+='<div class="ce-watch">'+CHAIN1.map(function(s,i){
    var w=s.rel!=null?Math.max(s.rel/top.rel*100,2):Math.max(s.cost/top.cost*100,2);
    return '<div class="ce-w ov-clickable meta-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip meta-splc-chip">'+esc(s.cat)+'</span><span class="ce-w-chip meta-splc-more">the read ›</span></div>'+
      '<div class="ov-mbar meta-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip meta-splc-chip">'+(s.rel!=null?'<b>'+money(s.rel)+'</b> relationship':esc(s.relTxt))+'</span><span class="ce-w-chip meta-splc-chip">'+(s.costTxt?esc(s.costTxt):s.cost.toFixed(1)+'% of capex costs')+'</span>'+
      '<span class="ce-w-chip meta-splc-chip"><b>Their dependency:</b> '+(s.their!=null?s.their.toFixed(1)+'% of '+esc(s.n)+' revenue':esc(s.theirTxt))+'</span></div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 2 · the content ecosystem — “suppliers” paid through revenue share</b></div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Partner</th><th>Their exposure to Alphabet</th><th>Category</th><th>Lands in</th></tr></thead><tbody>'+
    CHAIN2.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+'</td><td>'+s.their.toFixed(1)+'% of revenue</td><td>'+esc(s.cat)+'</td><td>'+esc(s.lands)+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ew-note ew-small meta-splc-cap">YouTube licensing (labels) and Google Play revenue shares (studios) show in SPLC as supplier costs: a large slice of cost of revenues is payouts to the ecosystem, not parts. The export gives no relationship size for these partners.</div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Who needs whom — revenue dependency ON Alphabet</b> (% of the counterpart’s revenue)</div>';
  h+='<div class="ov-mbars">'+DEP.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+' <span class="meta-splc-sub">'+esc(r[2])+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%">'+r[1]+'%</div></div><div class="ov-mbar-v">'+r[1]+'%</div></div>';
  }).join('')+'</div>';
  h+='<div class="ew-note ew-small meta-splc-cap">No supplier Alphabet buys from holds it captive — NVIDIA is about 12% of its capex costs, but Alphabet is only about 5% of NVIDIA — while a tier of vendors depends heavily on Alphabet’s orders. The exceptions are the scarce inputs: HBM memory and the foundry, reached through Broadcom.</div>';
  var geoF=GEO.filter(function(g){ return g.facPct!=null; });
  h+='<div class="ov-sec meta-splc-geo"><div class="ov-sec-h">Geography — share of supplier facilities by country (the countries the compilation names)</div>'+
    '<div class="meta-splc-geo-c"><canvas id="googlSplcGeo"></canvas></div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-gsplc="1"><span class="rs-collap-ic">▸</span> Data — what the chart draws, and suppliers domiciled <span class="rs-collap-sub">'+GEO.length+' rows</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Country</th><th>% of supplier facilities</th><th>Suppliers domiciled</th></tr></thead><tbody>'+
      GEO.map(function(g){ return '<tr><td class="rs-ft-h">'+esc(g.c)+'</td><td>'+(g.facPct==null?'<span class="rs-ft-nil">–</span>':g.facPct.toFixed(1)+'%')+'</td><td>'+(g.n==null?'<span class="rs-ft-nil">–</span>':g.n)+'</td></tr>'; }).join('')+
      '</tbody></table></div></div></div></div>';
  h+='<div class="ov-sec meta-splc-geo"><div class="ov-sec-h">Risk flags and the customer side SPLC can trace</div>'+
    '<div class="rs-ft-scroll"><table class="rs-ft"><tbody>'+
      '<tr><td class="rs-ft-h">Risk flags</td><td>'+SPLC_TOTAL.sanctioned+' sanctioned suppliers and '+SPLC_TOTAL.distressedSupp+' distressed suppliers — none among the top-tier infrastructure names; '+SPLC_TOTAL.distressedCust+' of the '+SPLC_TOTAL.customers.toLocaleString('en-US')+' tracked customers screen as distressed. 69 suppliers are domiciled in China (9.5%).</td></tr>'+
      CUST.map(function(c){ return '<tr><td class="rs-ft-h">'+esc(c[0])+'</td><td>'+esc(c[1])+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ew-note ew-small meta-splc-cap">The traceable customers are the Google Cloud and telecom-distribution book; the advertisers who make up most of revenue do not appear in SPLC.</div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), GOOGL US Equity, as of '+SPLC_ASOF+', as compiled for the July 2026 profile (DOAA351); the export file itself is not in the repository. Relationship sizes are Bloomberg estimates; directional, not audited. '+
    '“Capex costs %” = the relationship as a share of Alphabet’s capex costs; “their exposure” = Alphabet’s share of the counterpart’s revenue. Categories and card readings are Summit’s.</div>';
  return h;
}

export function googlSplcBuild(){
  var pane=document.querySelector('.ov-googl-dd .ovt-subpane[data-ovst="supplychain"]');
  if(pane && !pane._gsplcWired){ pane._gsplcWired=true;
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-gsplc]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  var cv=chartReady('googlSplcGeo'); if(!cv) return; destroy('googlSplcGeo');
  var G=GEO.filter(function(g){ return g.facPct!=null; });
  _charts['googlSplcGeo']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:G.map(function(g){ return g.c; }), datasets:[
      { label:'% of supplier facilities', data:G.map(function(g){ return g.facPct; }), backgroundColor:getComputedStyle(document.documentElement).getPropertyValue('--navy').trim()||'#1E2733', maxBarThickness:15 } ] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return G[ctx.dataIndex].facPct.toFixed(1)+'% of supplier facilities'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by googl.js's delegated handler.
export function googlSplcPop(id){
  var s=CHAIN1[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="meta-splc-sub">'+(s.rel!=null?money(s.rel)+' · '+s.cost.toFixed(1)+'% of capex costs':esc(s.costTxt))+'</span>',
    h:'<p>'+esc(s.d)+'</p>'+(s.their!=null?'<p>Alphabet is <b>'+s.their.toFixed(1)+'%</b> of '+esc(s.n)+'’s revenue (Bloomberg estimate). The spend is capitalised (capex).</p>':'') };
}
