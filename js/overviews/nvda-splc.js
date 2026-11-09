// nvda-splc.js — NVIDIA Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// COPIED from js/overviews/meta-splc.js (the guide-built copy of tsm-splc.js / amzn.js ddStat · A_SPLC_* · aSplcBody),
// then adapted to NVIDIA's export and filings:
//   • data: Bloomberg SPLC, NVDA US Equity — the 20 largest supplier relationships, compiled by hand from
//     nvidia-map-reference/SPLC_BBG.xlsx (the supplier side has no loader, §13). Each row carries its own period
//     (the supplier's reporting period, Q1 2025 … Q1 2026) and its own as-of date (Jun 4 2025 … Jun 25 2026), so the
//     sizes are shown one by one and NEVER summed: the 20 "% of cost" add to ~110%.
//   • the export has no supplier count, no facility list and no geography: there is no geography chart (SAB,
//     Nov 9 2026 — limitation stated first).
//   • filings block (SAB, Nov 9 2026): supply commitments by fiscal year (10-Q Q2 FY27, Note 10), the trajectory
//     $95.2B → $119B → $279B, inventories (10-Q balance-sheet note), and the 10-K sentence naming each supplier by
//     role (the supplier sentence of the old Overview description, B2 #3).
//   • Chain 1 = silicon (wafers, memory, packaging, test); Chain 2 = systems, optics, components and tools.
//   • formal skin (§21): Summit tokens, running text in black, no categorical colour; card readings are Summit's.

var BAR='#1E2733';   // navy — one series, no categorical colour
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, NVDA US Equity, supplier side ───────────────────────────────────────
// rel = Bloomberg's relationship size for the period (US$M, per quarter); cost = % of NVIDIA's cost of that type;
// their = % of the supplier's revenue from NVIDIA; type = cost account (COGS · CAPEX · R&D); per = the supplier's
// period; asof = Bloomberg's as-of date; src = 'est' (Bloomberg estimate) or 'cf' (the supplier's own filing).
var SPLC=[
  { n:'TSMC',              tk:'2330 TT', type:'COGS',  their:19.04, cost:37.35, per:'Q4 2025', asof:'Mar 11, 2026', rel:6416, src:'est' },
  { n:'SK hynix',          tk:'000660 KS', type:'COGS', their:26.98, cost:26.53, per:'Q3 2025', asof:'Feb 27, 2026', rel:4759, src:'est' },
  { n:'Wistron',           tk:'3231 TT', type:'COGS',  their:15.57, cost:16.58, per:'Q3 2025', asof:'Mar 6, 2026',  rel:2955, src:'est' },
  { n:'Micron',            tk:'MU US',   type:'COGS',  their:17.00, cost:13.62, per:'Q1 2026', asof:'Feb 26, 2026', rel:2320, src:'est' },
  { n:'Hon Hai (Foxconn)', tk:'2317 TT', type:'COGS',  their:1.60,  cost:5.03,  per:'Q2 2025', asof:'Aug 20, 2025', rel:933,  src:'est' },
  { n:'ASE Technology',    tk:'3711 TT', type:'COGS',  their:9.29,  cost:2.49,  per:'Q1 2026', asof:'Jun 25, 2026', rel:510,  src:'est' },
  { n:'Fabrinet',          tk:'FN US',   type:'COGS',  their:27.60, cost:2.13,  per:'FY 2025, quarterly avg.', asof:'Aug 19, 2025', rel:236,  src:'cf'  },
  { n:'Ibiden',            tk:'4062 JP', type:'COGS',  their:29.43, cost:1.23,  per:'FY 2026, quarterly avg.', asof:'Jun 18, 2026', rel:203,  src:'cf'  },
  { n:'Amkor',             tk:'AMKR US', type:'COGS',  their:7.47,  cost:0.98,  per:'Q3 2025', asof:'Jan 13, 2026', rel:149,  src:'est' },
  { n:'King Yuan (KYEC)',  tk:'2449 TT', type:'COGS',  their:36.02, cost:0.67,  per:'Q4 2025', asof:'Mar 24, 2026', rel:116,  src:'est' },
  { n:'Teradyne',          tk:'TER US',  type:'CAPEX', their:10.01, cost:8.44,  per:'Q4 2025', asof:'Mar 20, 2026', rel:108,  src:'est' },
  { n:'Quanta Computer',   tk:'2382 TT', type:'COGS',  their:0.66,  cost:0.56,  per:'Q1 2025', asof:'Jun 4, 2025',  rel:98,   src:'est' },
  { n:'Samsung Electronics', tk:'005930 KS', type:'COGS', their:0.17, cost:0.73, per:'Q2 2025', asof:'Oct 22, 2025', rel:93,  src:'est' },
  { n:'Keysight',          tk:'KEYS US', type:'R&D',   their:4.93,  cost:1.43,  per:'Q1 2026', asof:'Mar 29, 2026', rel:79,   src:'est' },
  { n:'Flex',              tk:'FLEX US', type:'COGS',  their:1.11,  cost:0.46,  per:'Q3 2026', asof:'Apr 16, 2026', rel:78,   src:'est' },
  { n:'Monolithic Power',  tk:'MPWR US', type:'COGS',  their:11.26, cost:0.58,  per:'Q2 2025', asof:'Oct 10, 2025', rel:75,   src:'est' },
  { n:'Western Digital',   tk:'WDC US',  type:'COGS',  their:2.30,  cost:0.30,  per:'Q3 2025', asof:'Jul 16, 2025', rel:53,   src:'est' },
  { n:'Jabil',             tk:'JBL US',  type:'COGS',  their:0.61,  cost:0.28,  per:'Q3 2025', asof:'Jul 29, 2025', rel:48,   src:'est' },
  { n:'Intel',             tk:'INTC US', type:'COGS',  their:0.33,  cost:0.30,  per:'Q4 2025', asof:'Jan 26, 2026', rel:46,   src:'est' },
  { n:'Corning',           tk:'GLW US',  type:'COGS',  their:1.07,  cost:0.26,  per:'Q4 2025', asof:'Mar 11, 2026', rel:45,   src:'est' },
];
var SPLC_RANGE='Jun 4, 2025 – Jun 25, 2026';
// The 10-K names these by role (Item 1, Manufacturing).
var NAMED_10K={ 'TSMC':1, 'Samsung Electronics':1, 'SK hynix':1, 'Micron':1, 'Hon Hai (Foxconn)':1, 'Wistron':1, 'Fabrinet':1 };
// What each supplier provides — Summit's reading. Where the 10-K names the supplier, the role is the 10-K's.
var SPLC_WHAT={
  'TSMC':['Foundry · CoWoS packaging','Makes NVIDIA’s GPU and CPU wafers; the 10-K names TSMC as a foundry and says NVIDIA uses CoWoS packaging, which TSMC also provides. The single largest dependency: about 37% of NVIDIA’s cost of revenue in Bloomberg’s estimate, while NVIDIA is about 19% of TSMC’s revenue.'],
  'SK hynix':['HBM memory','High-bandwidth memory stacked next to the GPU — the 10-K lists SK Hynix first among its memory suppliers. NVIDIA is about 27% of SK hynix’s revenue: each is the other’s most important counterparty in HBM.'],
  'Micron':['HBM and server memory','The second memory supplier named in the 10-K. About 17% of Micron’s revenue comes from NVIDIA in Bloomberg’s estimate.'],
  'Samsung Electronics':['Foundry · memory','The 10-K names Samsung both as a foundry and as a memory supplier, yet Bloomberg sizes the relationship small (0.7% of NVIDIA’s cost of revenue) — a qualification to watch rather than a large current flow.'],
  'ASE Technology':['Chip assembly and test','Outsourced assembly and test (OSAT). Not named in the 10-K; the size is Bloomberg’s estimate.'],
  'Amkor':['Chip assembly and test','Outsourced packaging and test, with US capacity under construction. Not named in the 10-K.'],
  'King Yuan (KYEC)':['Chip testing','Final test of NVIDIA chips. About 36% of KYEC’s revenue is NVIDIA — the most dependent supplier in the export.'],
  'Ibiden':['IC package substrates','The substrate the GPU package is built on. About 29% of Ibiden’s revenue is NVIDIA, from Ibiden’s own filing.'],
  'Wistron':['Board and system assembly','Named in the 10-K among the contract manufacturers that assemble, test and package NVIDIA’s final products. About 17% of NVIDIA’s cost of revenue — the largest supplier after the two chip inputs.'],
  'Hon Hai (Foxconn)':['Rack and system assembly','Named in the 10-K among the contract manufacturers. NVIDIA is about 1.6% of a very large Hon Hai.'],
  'Fabrinet':['Optical components and assembly','Named in the 10-K among the contract manufacturers. NVIDIA is about 28% of Fabrinet’s revenue, from Fabrinet’s own filing.'],
  'Quanta Computer':['Server assembly','Builds servers and racks on NVIDIA platforms.'],
  'Flex':['Contract manufacturing','Electronics manufacturing for data-center hardware.'],
  'Jabil':['Contract manufacturing','Electronics manufacturing.'],
  'Monolithic Power':['Power chips','Power-management chips for boards; about 11% of its revenue is NVIDIA.'],
  'Western Digital':['Storage','Drives.'],
  'Intel':['x86 CPUs','Processors.'],
  'Corning':['Optical fiber','Fiber and connectivity.'],
  'Teradyne':['Chip test equipment','Test equipment NVIDIA buys as capex; about 10% of Teradyne’s revenue.'],
  'Keysight':['Test and measurement','Instruments charged to R&D.'],
};
SPLC.forEach(function(s){ var w=SPLC_WHAT[s.n]||['','']; s.cat=w[0]; s.d=w[1]; });
var CHAIN1_N=['TSMC','SK hynix','Micron','ASE Technology','Ibiden','Amkor','King Yuan (KYEC)','Samsung Electronics'];
var CHAIN1=SPLC.filter(function(s){ return CHAIN1_N.indexOf(s.n)>=0; });
var CHAIN2=SPLC.filter(function(s){ return CHAIN1_N.indexOf(s.n)<0; });
var TYPE_L={ COGS:'cost of revenue', CAPEX:'capex', 'R&D':'R&D' };

// ─── Data — filings ─────────────────────────────────────────────────────────────────────────────
// 10-Q Q2 FY27 (quarter ended Jul 26, 2026), Note 10 — future commitments by fiscal year, $B.
var COMMIT_YRS=['Rest of FY27','FY28','FY29','FY30','FY31','FY32+'];
var COMMIT=[
  { k:'Supply and capacity',         v:[92,87,88,6,5,1],  t:279, draw:true },
  { k:'Cloud service agreements',    v:[3,8,7,6,4,1],     t:29 },
  { k:'Data center leases not commenced', v:[0,1,1,2,1,20], t:25 },
  { k:'Equity investments',          v:[18,3,2,2,0,0],    t:25 },
  { k:'Capital expenditures',        v:[7,1,0,0,0,0],     t:8 },
];
var COMMIT_TOT={ v:[120,100,98,16,10,22], t:366 };
// Supply and capacity commitments over time ($B): 10-K FY2026 Note 12; 10-Q Q2 FY27 Note 10 ("from $119 billion last quarter").
var COMMIT_PATH=[ { d:'Jan 25, 2026', v:95.2, s:'10-K FY2026' }, { d:'Apr 26, 2026', v:119, s:'10-Q Q2 FY27 ("last quarter")' }, { d:'Jul 26, 2026', v:279, s:'10-Q Q2 FY27' } ];
// Inventories ($M), 10-Q Q2 FY27 balance-sheet components.
var INV=[ { k:'Raw materials', a:3807, b:11341 }, { k:'Work in process', a:8822, b:13377 }, { k:'Finished goods', a:8774, b:6857 }, { k:'Total inventories', a:21403, b:31575, tot:true } ];
var Q_10K='We utilize foundries, such as Taiwan Semiconductor Manufacturing Company Limited, or TSMC, and Samsung Electronics Co., Ltd., or Samsung, to produce our semiconductor wafers. We purchase memory from SK Hynix Inc., Micron Technology, Inc., and Samsung. We utilize CoWoS technology for semiconductor packaging.';
var Q_10K2='While currently our supply chain is mainly concentrated in Asia, we are expanding into the U.S. and Latin America.';
var Q_10Q='These supply commitments are for our data center infrastructure systems, primarily memory and manufacturing facilities';

function money(m){ return '$'+(m>=1000?(m/1000).toFixed(1)+'B':Math.round(m)+'M'); }
function bn(v){ return v===0?'—':'$'+v; }
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function collap(id, sub, table){
  return '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-nsplc="'+id+'"><span class="rs-collap-ic">▸</span> Data — what the chart draws <span class="rs-collap-sub">'+sub+'</span></button>'+
    '<div class="rs-collap-b" hidden><div class="rs-ft-scroll">'+table+'</div></div></div>';
}

export function nvdaSplcBody(){
  var top=SPLC[0], inv=INV[0];
  var dep=SPLC.slice().sort(function(a,b){ return b.their-a.their; });
  var h='';
  // Limitation first (§13).
  h+='<p class="ov-lede">NVIDIA designs its chips and systems and has others make them: TSMC makes the wafers, SK hynix and Micron the memory, and contract manufacturers such as Wistron, Hon Hai and Fabrinet assemble the products. Since January it has <b>almost tripled what it is committed to buy from suppliers, to $279B</b>, mostly memory and manufacturing capacity.</p>';
  h+='<div class="nv-splc-lim"><b>Coverage.</b> The Bloomberg export lists NVIDIA’s 20 largest supplier relationships only — no supplier count and no facility geography. Each row is the supplier’s own latest period (Q1 2025 to Q1 2026), so the sizes are read one by one and are not added up.</div>';
  h+=ddStat([[bn(279)+'B','supply and capacity commitments (Jul 26, 2026)'],
    [top.cost.toFixed(0)+'%','of NVIDIA’s cost of revenue is TSMC (largest supplier)'],
    ['$'+(inv.b/1000).toFixed(1)+'B','raw materials in inventory, from $'+(inv.a/1000).toFixed(1)+'B in January'],
    [dep[0].their.toFixed(0)+'%','of '+dep[0].n+'’s revenue is NVIDIA (most dependent supplier)'],
    [String(SPLC.length),'supplier relationships in the Bloomberg export']]);

  // 1 · Filings — what NVIDIA has committed to its suppliers.
  h+='<div class="ov-sec"><div class="ov-sec-h">What NVIDIA has committed to its suppliers</div>';
  h+='<p class="nv-splc-p">Supply and capacity commitments went from <b>$95.2B</b> (Jan 25, 2026) to <b>$119B</b> (Apr 26) and <b>$279B</b> (Jul 26). NVIDIA: “'+esc(Q_10Q)+'.” Almost two thirds (63%) falls due in fiscal 2028 and 2029.</p>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Supply and capacity commitments by fiscal year</b> ($B, as of Jul 26, 2026)</div>';
  h+='<div class="nv-splc-c"><canvas id="nvSplcCommit"></canvas></div>';
  h+=collap('commit', (COMMIT.length+1)+' rows', '<table class="rs-ft"><thead><tr><th class="rs-ft-h">Commitment ($B)</th>'+COMMIT_YRS.map(function(y){ return '<th>'+y+'</th>'; }).join('')+'<th>Total</th></tr></thead><tbody>'+
    COMMIT.map(function(r){ return '<tr><td class="rs-ft-h">'+esc(r.k)+(r.draw?' (drawn)':'')+'</td>'+r.v.map(function(v){ return '<td>'+bn(v)+'</td>'; }).join('')+'<td>'+bn(r.t)+'</td></tr>'; }).join('')+
    '<tr class="nv-splc-tot"><td class="rs-ft-h">Total commitments</td>'+COMMIT_TOT.v.map(function(v){ return '<td>'+bn(v)+'</td>'; }).join('')+'<td>'+bn(COMMIT_TOT.t)+'</td></tr>'+
    '<tr><td class="rs-ft-h" colspan="8">Supply and capacity over time: '+COMMIT_PATH.map(function(p){ return '$'+p.v+'B ('+p.d+', '+p.s+')'; }).join(' → ')+'</td></tr>'+
    '</tbody></table>');
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Inventories</b> ($M) — raw materials nearly tripled as NVIDIA buys memory and components itself</div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Inventories ($M)</th><th>Jan 25, 2026</th><th>Jul 26, 2026</th><th>Change</th></tr></thead><tbody>'+
    INV.map(function(r){ return '<tr'+(r.tot?' class="nv-splc-tot"':'')+'><td class="rs-ft-h">'+esc(r.k)+'</td><td>'+r.a.toLocaleString('en-US')+'</td><td>'+r.b.toLocaleString('en-US')+'</td><td>'+(r.b>=r.a?'+':'−')+Math.abs(r.b-r.a).toLocaleString('en-US')+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Who the 10-K names</b></div>';
  h+='<p class="nv-splc-p">“'+esc(Q_10K)+'” Contract manufacturers such as Hon Hai, Wistron and Fabrinet assemble, test and package the final products. “'+esc(Q_10K2)+'”</p>';
  h+='</div>';

  // 2 · Chain 1 — silicon.
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 1 · silicon — wafers, memory, packaging and test</b> (Bloomberg relationship size per quarter; bar = relative to the largest). Tap a card for the read.</div>';
  h+='<div class="ce-watch">'+CHAIN1.map(function(s){
    var i=SPLC.indexOf(s), w=Math.max(s.rel/CHAIN1[0].rel*100,2);
    return '<div class="ce-w ov-clickable meta-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip meta-splc-chip">'+esc(s.cat)+'</span>'+(NAMED_10K[s.n]?'<span class="ce-w-chip meta-splc-chip">named in the 10-K</span>':'')+'<span class="ce-w-chip meta-splc-more">the read ›</span></div>'+
      '<div class="ov-mbar meta-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip meta-splc-chip"><b>'+money(s.rel)+'</b> in '+esc(s.per)+'</span><span class="ce-w-chip meta-splc-chip">'+s.cost.toFixed(1)+'% of NVIDIA’s '+TYPE_L[s.type]+'</span>'+
      '<span class="ce-w-chip meta-splc-chip"><b>Their dependency:</b> '+s.their.toFixed(1)+'% of '+esc(s.n)+' revenue</span></div>'+
    '</div>';
  }).join('')+'</div>';

  // 3 · Chain 2 — systems, optics, components and tools.
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 2 · systems, optics, components and tools</b></div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Supplier</th><th>Relationship</th><th>Period</th><th>NVIDIA cost %</th><th>Their exposure to NVIDIA</th><th>Category</th></tr></thead><tbody>'+
    CHAIN2.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+(NAMED_10K[s.n]?' <span class="meta-splc-sub">10-K</span>':'')+'</td><td>'+money(s.rel)+'</td><td>'+esc(s.per)+'</td><td>'+s.cost.toFixed(2)+'% of '+TYPE_L[s.type]+'</td><td>'+s.their.toFixed(1)+'% of revenue</td><td>'+esc(s.cat)+'</td></tr>'; }).join('')+
  '</tbody></table></div>';

  // 4 · Who needs whom.
  var top10=dep.slice(0,10);
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Who needs whom — revenue dependency ON NVIDIA</b> (% of the supplier’s revenue, top 10)</div>';
  h+='<div class="ov-mbars">'+top10.map(function(s){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(s.n)+' <span class="meta-splc-sub">'+esc(s.cat)+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+s.their.toFixed(1)+'%">'+s.their.toFixed(1)+'%</div></div><div class="ov-mbar-v">'+money(s.rel)+'</div></div>';
  }).join('')+'</div>';

  h+='<div class="ov-foot">Sources — Bloomberg Supply Chain Analysis (SPLC), NVDA US Equity, relationships dated '+SPLC_RANGE+' (each supplier’s own latest period; Fabrinet and Ibiden from their own annual filings, shown as a quarter of the annual figure; the rest Bloomberg estimates). Relationship sizes are Bloomberg estimates; directional, not audited. '+
    '"NVIDIA cost %" = the relationship as a share of NVIDIA’s cost of that type (cost of revenue, capex or R&D); "their exposure" = NVIDIA’s share of the supplier’s revenue. '+
    'Commitments: Form 10-Q for the quarter ended Jul 26, 2026, Note 10; Form 10-K FY2026 (Jan 25, 2026), Note 12. Inventories: same 10-Q. Supplier roles: 10-K FY2026, Item 1, Manufacturing. Categories and card readings are Summit’s.</div>';
  return h;
}

export function nvdaSplcBuild(root){
  var pane=(root||document).querySelector('.ov-nvda-dd .ovt-subpane[data-ovst="supplychain"]');
  if(pane && !pane._nsplcWired){ pane._nsplcWired=true;
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-nsplc]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  var cv=chartReady('nvSplcCommit'); if(!cv) return; destroy('nvSplcCommit');
  var sup=COMMIT[0];
  _charts['nvSplcCommit']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:COMMIT_YRS, datasets:[ { label:'Supply and capacity ($B)', data:sup.v, backgroundColor:BAR, maxBarThickness:42 } ] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return '$'+ctx.parsed.y+'B of supply and capacity commitments'; } } } },
      scales:{ y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'B'; } } }, x:{ grid:{ display:false } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by nvidia.js's delegated handler.
export function nvdaSplcPop(id){
  var s=SPLC[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="meta-splc-sub">'+money(s.rel)+' in '+esc(s.per)+' · '+s.cost.toFixed(1)+'% of NVIDIA’s '+TYPE_L[s.type]+'</span>',
    h:'<p>'+esc(s.d)+'</p><p>NVIDIA is <b>'+s.their.toFixed(1)+'%</b> of '+esc(s.n)+'’s revenue ('+(s.src==='cf'?esc(s.n)+'’s own filing':'Bloomberg estimate')+', '+esc(s.per)+', as of '+esc(s.asof)+').</p>' };
}
