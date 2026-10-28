// meta-splc.js — Meta Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// COPIED from js/overviews/tsm-splc.js (the guide-built copy of amzn.js ddStat · A_SPLC_* · aSplcBody · aBuildSplc),
// then adapted to Meta's export:
//   • data: Bloomberg SPLC, META US Equity, export of Jun 26 2026 — the 19 largest supplier relationships plus the
//     supplier universe (283 suppliers, 3,590 facilities) and its geography by facility. Compiled by hand (the
//     supplier side has no loader, §13); moved here from meta.js (SC_SUPPLIERS, SC_GEO, SC_GEO_TOTAL).
//   • the export carries one relationship size per supplier (Bloomberg's estimate of the annual relationship) and
//     no per-row period or basis, so the cards show the dollar size and the share of Meta's cost as given.
//   • Chain 1 = the AI-infrastructure chain (capitalised, CAPEX); Chain 2 = cost of revenue and SG&A (COGS / SGA).
//   • formal skin (§21): Summit tokens, running text in black, no emojis; card readings are Summit's.

var BAR='#1E2733';   // navy — the formal skin (§21); one series, no categorical colour
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, META US Equity, supplier side ───────────────────────────────────────
// rel = Bloomberg's relationship size (US$M); cost = % of Meta's cost; their = % of the supplier's revenue from Meta;
// type = where the spend lands in Meta's financials (CAPEX capitalised · COGS cost of revenue · SGA).
var SPLC_ASOF='Jun 26, 2026';
var SPLC=[
  { n:'NVIDIA',            ind:'Semiconductors', rel:11182.59, cost:13.07, type:'CAPEX', their:4.10  },
  { n:'SK hynix',          ind:'Semiconductors', rel:4593.50,  cost:5.14,  type:'CAPEX', their:6.51  },
  { n:'GoerTek',           ind:'Tech hardware',  rel:4504.29,  cost:12.23, type:'COGS',  their:26.38 },
  { n:'Broadcom',          ind:'Semiconductors', rel:3682.44,  cost:4.89,  type:'CAPEX', their:5.11  },
  { n:'Celestica',         ind:'Tech hardware',  rel:1931.51,  cost:2.56,  type:'CAPEX', their:15.12 },
  { n:'AMD',               ind:'Semiconductors', rel:1688.28,  cost:2.55,  type:'CAPEX', their:5.49  },
  { n:'Western Digital',   ind:'Tech hardware',  rel:1530.89,  cost:1.79,  type:'CAPEX', their:12.69 },
  { n:'Accton Technology', ind:'Tech hardware',  rel:970.38,   cost:2.63,  type:'COGS',  their:9.95  },
  { n:'Qualcomm',          ind:'Semiconductors', rel:857.27,   cost:2.33,  type:'COGS',  their:1.90  },
  { n:'Ciena',             ind:'Tech hardware',  rel:590.95,   cost:0.78,  type:'CAPEX', their:9.41  },
  { n:'Corning',           ind:'Tech hardware',  rel:537.88,   cost:0.63,  type:'CAPEX', their:3.19  },
  { n:'Hanwha Solutions',  ind:'Chemicals',      rel:431.56,   cost:1.27,  type:'COGS',  their:4.84  },
  { n:'CoreWeave',         ind:'Software',       rel:388.83,   cost:1.14,  type:'COGS',  their:8.02  },
  { n:'TaskUS',            ind:'IT services',    rel:307.72,   cost:1.27,  type:'SGA',   their:26.00 },
  { n:'Zhongji Innolight', ind:'Tech hardware',  rel:285.46,   cost:0.43,  type:'CAPEX', their:6.36  },
  { n:'Jabil',             ind:'Tech hardware',  rel:253.27,   cost:0.84,  type:'COGS',  their:0.81  },
  { n:'Penguin Solutions', ind:'Semiconductors', rel:249.78,   cost:0.29,  type:'CAPEX', their:18.20 },
  { n:'Nokia',             ind:'Tech hardware',  rel:247.60,   cost:0.33,  type:'CAPEX', their:1.18  },
  { n:'Microsoft',         ind:'Software',       rel:225.80,   cost:0.75,  type:'COGS',  their:0.08  },
];
// Supplier universe and geography (by country of the supplier's facilities and domicile).
var SPLC_TOTAL={ suppliers:283, facilities:3590 };
var SPLC_GEO=[
  { c:'United States',  n:109, pct:38.52, fac:1184, facPct:32.98 },
  { c:'China',          n:35,  pct:12.37, fac:460,  facPct:12.81 },
  { c:'South Korea',    n:19,  pct:6.71,  fac:85,   facPct:2.37  },
  { c:'United Kingdom', n:17,  pct:6.01,  fac:130,  facPct:3.62  },
  { c:'Taiwan',         n:15,  pct:5.30,  fac:48,   facPct:1.34  },
  { c:'France',         n:14,  pct:4.95,  fac:111,  facPct:3.09  },
].sort(function(a,b){ return b.facPct-a.facPct; });   // drawn by facilities, so ranked by facilities
// What each supplier sells Meta — Summit's reading, not Bloomberg's.
var SPLC_WHAT={
  'NVIDIA':['AI accelerators','GPUs for training and running Meta\'s models, the largest single piece of the AI build.'],
  'SK hynix':['HBM memory','High-bandwidth memory packaged with the accelerators. Meta named higher memory pricing when it raised 2026 capex in Q1 2026.'],
  'Broadcom':['Custom silicon · networking','Co-develops Meta\'s in-house AI chips (MTIA) and supplies data-center networking silicon.'],
  'Celestica':['Server and rack assembly','Contract manufacturer of data-center servers and networking gear.'],
  'AMD':['AI accelerators · CPUs','MI-series accelerators and server CPUs, a second source next to NVIDIA.'],
  'Western Digital':['Storage','Hard drives for the data stored and used to train and serve models.'],
  'Ciena':['Optical networking','Optical transport that links data centers.'],
  'Corning':['Optical fiber','Fiber and connectivity inside and between data centers.'],
  'Zhongji Innolight':['Optical transceivers','High-speed optical modules that connect servers and switches.'],
  'Penguin Solutions':['AI cluster integration','Builds and manages high-performance computing clusters.'],
  'Nokia':['Data-center networking','IP routing and optical equipment.'],
  'GoerTek':['Device assembly','Assembles Quest headsets and supplies acoustic components (Reality Labs).'],
  'Accton Technology':['Network switches','Builds data-center switches to Meta\'s designs.'],
  'Qualcomm':['Device chips','Snapdragon chips for Quest headsets and AI glasses.'],
  'Hanwha Solutions':['Solar · chemicals','Makes solar modules (Qcells) and chemicals; the export does not say which of the two Meta buys.'],
  'CoreWeave':['Rented GPU capacity','Third-party cloud capacity; an operating cost, not capex.'],
  'TaskUS':['Content review','Outsourced content moderation and trust & safety.'],
  'Jabil':['Contract manufacturing','Electronics manufacturing for hardware programs.'],
  'Microsoft':['Cloud and software','Cloud services and software licences.'],
};
SPLC.forEach(function(s){ var w=SPLC_WHAT[s.n]||['','']; s.cat=w[0]; s.d=w[1]; });
var CHAIN1=SPLC.filter(function(s){ return s.type==='CAPEX'; });
var CHAIN2=SPLC.filter(function(s){ return s.type!=='CAPEX'; });
var TYPE_L={ CAPEX:'Capex', COGS:'Cost of revenue', SGA:'SG&A' };

function money(m){ return '$'+(m>=1000?(m/1000).toFixed(1)+'B':Math.round(m)+'M'); }
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function geoRow(c){ for(var i=0;i<SPLC_GEO.length;i++){ if(SPLC_GEO[i].c===c) return SPLC_GEO[i]; } return null; }

export function metaSplcBody(){
  var top=SPLC[0], us=geoRow('United States'), cn=geoRow('China');
  var c1=0, c2=0; CHAIN1.forEach(function(s){ c1+=s.rel; }); CHAIN2.forEach(function(s){ c2+=s.rel; });
  var h='';
  h+='<p class="ov-lede">Bloomberg tracks <b>'+SPLC_TOTAL.suppliers+' suppliers</b> to Meta. The '+SPLC.length+' largest relationships add up to <b>'+money(c1+c2)+'</b>, and <b>'+money(c1)+'</b> of that is data-center hardware that Meta capitalises (Chain 1). The rest is devices, network gear, rented compute and services charged to the income statement (Chain 2).</p>';
  h+=ddStat([[String(SPLC_TOTAL.suppliers),'suppliers tracked'],[SPLC_TOTAL.facilities.toLocaleString('en-US'),'supplier facilities'],
    [us.facPct.toFixed(1)+'%','of facilities in the US'],[cn.facPct.toFixed(1)+'%','of facilities in China'],
    [money(top.rel),'largest relationship ('+top.n+'), '+top.cost.toFixed(1)+'% of Meta\'s cost']]);
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 1 · the AI-infrastructure chain (capex)</b> — relationship size; bar = relative to the largest. Tap a card for the read.</div>';
  h+='<div class="ce-watch">'+CHAIN1.map(function(s){
    var i=SPLC.indexOf(s), w=Math.max(s.rel/CHAIN1[0].rel*100,2);
    return '<div class="ce-w ov-clickable meta-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip meta-splc-chip">'+esc(s.cat)+'</span><span class="ce-w-chip meta-splc-more">the read ›</span></div>'+
      '<div class="ov-mbar meta-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip meta-splc-chip"><b>'+money(s.rel)+'</b> relationship</span><span class="ce-w-chip meta-splc-chip">'+s.cost.toFixed(1)+'% of Meta\'s cost</span>'+
      '<span class="ce-w-chip meta-splc-chip"><b>Their dependency:</b> '+s.their.toFixed(1)+'% of '+esc(s.n)+' revenue</span></div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 2 · devices, rented compute and services (cost of revenue and SG&amp;A)</b></div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Supplier</th><th>Relationship</th><th>Meta cost %</th><th>Their exposure to Meta</th><th>Category</th><th>Lands in</th></tr></thead><tbody>'+
    CHAIN2.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+'</td><td>'+money(s.rel)+'</td><td>'+s.cost.toFixed(2)+'%</td><td>'+s.their.toFixed(1)+'% of revenue</td><td>'+esc(s.cat)+'</td><td>'+TYPE_L[s.type]+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  var dep=SPLC.slice().sort(function(a,b){ return b.their-a.their; }).slice(0,10);
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Who needs whom — revenue dependency ON Meta</b> (% of the supplier\'s revenue, top 10)</div>';
  h+='<div class="ov-mbars">'+dep.map(function(s){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(s.n)+' <span class="meta-splc-sub">'+esc(s.cat)+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+s.their.toFixed(1)+'%">'+s.their.toFixed(1)+'%</div></div><div class="ov-mbar-v">'+money(s.rel)+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-sec meta-splc-geo"><div class="ov-sec-h">Geography — share of supplier facilities by country (the six countries with the most suppliers)</div>'+
    '<div class="meta-splc-geo-c"><canvas id="metaSplcGeo"></canvas></div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-msplc="1"><span class="rs-collap-ic">▸</span> Data — what the chart draws <span class="rs-collap-sub">'+SPLC_GEO.length+' rows</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Country</th><th>Facilities</th><th>% of facilities</th><th>Suppliers domiciled</th><th>% of suppliers</th></tr></thead><tbody>'+
      SPLC_GEO.map(function(g){ return '<tr><td class="rs-ft-h">'+esc(g.c)+'</td><td>'+g.fac.toLocaleString('en-US')+'</td><td>'+g.facPct.toFixed(1)+'%</td><td>'+g.n+'</td><td>'+g.pct.toFixed(1)+'%</td></tr>'; }).join('')+
      '</tbody></table></div></div></div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), META US Equity, as of '+SPLC_ASOF+'. Relationship sizes are Bloomberg estimates; directional, not audited. '+
    '"Meta cost %" = the relationship as a share of Meta\'s cost; "their exposure" = Meta\'s share of the supplier\'s revenue. Categories and card readings are Summit\'s.</div>';
  return h;
}

export function metaSplcBuild(){
  // The data table under the chart toggles itself (data-selfwired: no global handler in meta.js flips it twice).
  var pane=document.querySelector('.ov-meta-dd .ovt-subpane[data-ovst="supplychain"]');
  if(pane && !pane._msplcWired){ pane._msplcWired=true;
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-msplc]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  var cv=chartReady('metaSplcGeo'); if(!cv) return; destroy('metaSplcGeo');
  _charts['metaSplcGeo']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:SPLC_GEO.map(function(g){ return g.c; }), datasets:[
      { label:'% of facilities', data:SPLC_GEO.map(function(g){ return g.facPct; }), backgroundColor:BAR, maxBarThickness:15 } ] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var g=SPLC_GEO[ctx.dataIndex]; return g.facPct.toFixed(1)+'% of facilities ('+g.fac.toLocaleString('en-US')+')'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by meta.js's delegated handler.
export function metaSplcPop(id){
  var s=SPLC[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="meta-splc-sub">'+money(s.rel)+' · '+s.cost.toFixed(1)+'% of Meta\'s cost</span>',
    h:'<p>'+esc(s.d)+'</p><p>Meta is <b>'+s.their.toFixed(1)+'%</b> of '+esc(s.n)+'\'s revenue (Bloomberg estimate). The spend lands in Meta\'s '+TYPE_L[s.type].toLowerCase()+'.</p>' };
}
