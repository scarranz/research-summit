// tsm-splc.js — TSMC Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// COPIED from js/overviews/amzn.js (ddStat · A_SPLC_* · aSplcBody · aBuildSplc), then adapted:
//   • data: Bloomberg SPLC export of the semiconductor map (nvidia-map-reference/SPLC_BBG.xlsx, subject
//     2330 TT Equity, supplier block) — compiled by hand (the supplier side has no loader, §13). It holds
//     only the TOP 20 suppliers: no supplier universe, no facility counts, no facility geography. The pane
//     says so first, and its geography is by the supplier's home country, not by facility.
//   • relationship periods differ row to row (a quarter for some, a year for others), so suppliers are
//     ranked by % of TSMC's cost — not by dollars — and every amount carries its own period.
//   • Chain 2 uses the .rs-ft table component (Amazon's .ce-tbl is not copied); the geography chart gets
//     the table Amazon's lacks (chart standard §0, rule 3).
//   • the card readings ("what they sell TSMC") are ours, not Bloomberg's.
import { SUMMIT_CAT } from '../viz-palette.js';

var BRAND2=SUMMIT_CAT[1];
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, 2330 TT Equity, supplier side (top 20) ─────────────────────────────────
// [ticker, name, cost type, % of supplier revenue from TSMC, % of TSMC cost, BBG period, BBG year,
//  basis ('disclosed' = the supplier's own filing, 'CF' in Bloomberg; 'estimate' = Bloomberg estimate),
//  relationship as-of date, amount US$M, home country]
var SPLC_ASOF='Jun 26, 2026';   // export file date; each relationship carries its own as-of below
var SPLC_RAW=[
  ['ASML','ASML Holding','CAPEX',16.56,15.32,'Q4',2025,'estimate','2026-05-27',1690.5,'Netherlands'],
  ['AMAT','Applied Materials','CAPEX',18.00,15.08,'C2',2025,'disclosed','2025-05-22',1283.9,'United States'],
  ['LRCX','Lam Research','CAPEX',18.00,8.37,'Q2',2026,'estimate','2026-02-10',962.1,'United States'],
  ['8035 JP','Tokyo Electron','CAPEX',12.92,5.00,'A',2026,'disclosed','2026-06-22',524.5,'Japan'],
  ['KLAC','KLA','CAPEX',17.00,4.88,'Q2',2026,'estimate','2026-02-10',560.6,'United States'],
  ['6857 JP','Advantest','CAPEX',12.33,1.85,'A',2025,'disclosed','2025-06-25',157.8,'Japan'],
  ['TER','Teradyne','CAPEX',19.03,1.79,'Q4',2025,'estimate','2026-03-20',206.2,'United States'],
  ['6383 JP','Daifuku','CAPEX',13.80,1.50,'A',2025,'disclosed','2026-03-24',152.9,'Japan'],
  ['4063 JP','Shin-Etsu Chemical','COGS',4.38,1.45,'Q2',2026,'estimate','2025-12-08',194.8,'Japan'],
  ['7735 JP','SCREEN Holdings','CAPEX',14.61,1.40,'A',2026,'disclosed','2026-06-25',147.0,'Japan'],
  ['6920 JP','Lasertec','CAPEX',26.30,1.18,'A',2025,'disclosed','2025-09-25',110.5,'Japan'],
  ['5201 JP','AGC','COGS',3.87,1.10,'Q4',2025,'estimate','2026-05-22',135.3,'Japan'],
  ['4186 JP','Tokyo Ohka Kogyo','COGS',33.60,1.08,'A',2025,'disclosed','2026-03-24',133.1,'Japan'],
  ['ENTG','Entegris','COGS',16.00,1.04,'A',2025,'disclosed','2026-02-11',127.9,'United States'],
  ['7751 JP','Canon','CAPEX',1.29,0.97,'Q4',2025,'estimate','2026-04-13',111.1,'Japan'],
  ['Q','Qnity Electronics','COGS',8.00,0.87,'Q1',2026,'disclosed','2026-05-13',105.2,'United States'],
  ['BAS GR','BASF','COGS',0.69,0.86,'Q3',2025,'estimate','2025-12-12',115.4,'Germany'],
  ['4004 JP','Resonac','COGS',3.99,0.72,'Q4',2025,'estimate','2026-03-26',91.3,'Japan'],
  ['AI FP','Air Liquide','COGS',1.08,0.69,'Q3',2025,'estimate','2026-04-22',83.8,'France'],
  ['WAF GR','Siltronic','COGS',25.40,0.66,'Q2',2025,'estimate','2026-01-13',86.4,'Germany']
];
// What each supplier sells TSMC — our reading (not Bloomberg's).
var SPLC_WHAT={
  'ASML':['Lithography','The only maker of EUV scanners, the tools every leading-edge node (N5, N3, N2) is printed with. No second source exists.'],
  'AMAT':['Deposition · etch · CMP','The broadest toolset in the fab: deposition, etch, planarisation and implant, used at every node.'],
  'LRCX':['Etch · deposition','Etch and deposition — the steps that multiply as transistors go 3-D (gate-all-around at N2) and memory stacks grow.'],
  '8035 JP':['Coater/developer · etch','Coater/developers paired with every lithography scanner, plus etch, deposition and cleaning.'],
  'KLAC':['Inspection · metrology','Process control: finds defects and measures each layer. More steps per wafer means more inspection.'],
  '6857 JP':['Test','Testers for finished chips, with high-performance computing and AI processors the fastest-growing part.'],
  'TER':['Test','Semiconductor test equipment — a second test vendor next to Advantest.'],
  '6383 JP':['Fab automation','Automated material handling: the overhead systems that move wafer pods between tools inside the fab.'],
  '4063 JP':['Silicon wafers · photoresist','The largest maker of silicon wafers, plus photoresists and other process materials.'],
  '7735 JP':['Wafer cleaning','Wafer cleaning equipment — the leading supplier of a step repeated many times per wafer.'],
  '6920 JP':['EUV mask inspection','Inspection of EUV photomasks and mask blanks — a niche where it is the main supplier.'],
  '5201 JP':['Glass · mask blanks','Specialty glass and EUV mask blanks, plus chemicals.'],
  '4186 JP':['Photoresist','Photoresists — the light-sensitive coating each lithography layer is printed into.'],
  'ENTG':['Filtration · materials','Filters, purifiers, specialty chemicals and wafer-handling containers that keep the process clean.'],
  '7751 JP':['Lithography (mature)','Older-generation lithography steppers (i-line, KrF) for the less critical layers.'],
  'Q':['CMP · lithography materials','DuPont\'s former electronics business: polishing pads and slurries, and lithography materials.'],
  'BAS GR':['Process chemicals','High-purity process chemicals.'],
  '4004 JP':['CMP slurry · gases','Polishing slurries, specialty gases and packaging materials.'],
  'AI FP':['Industrial gases','Ultra-pure gases supplied on site to TSMC fabs.'],
  'WAF GR':['Silicon wafers','Silicon wafers — one of the five large wafer makers.']
};
var SPLC=SPLC_RAW.map(function(r){ return { tk:r[0], n:r[1], type:r[2], their:r[3], cost:r[4], per:r[5], yr:r[6], basis:r[7], asof:r[8], amt:r[9], ctry:r[10],
  cat:(SPLC_WHAT[r[0]]||['',''])[0], d:(SPLC_WHAT[r[0]]||['',''])[1] }; });
var SPLC_EQ=SPLC.filter(function(s){ return s.type==='CAPEX'; }).sort(function(a,b){ return b.cost-a.cost; });
var SPLC_MAT=SPLC.filter(function(s){ return s.type==='COGS'; }).sort(function(a,b){ return b.cost-a.cost; });

function perLab(s){ return s.per==='A'?'FY'+s.yr:(s.per.charAt(0)==='C'?'C'+s.per.slice(1)+' '+s.yr:s.per+' '+s.yr); }
function amtLab(s){ return '$'+(s.amt>=1000?(s.amt/1000).toFixed(2)+'B':Math.round(s.amt)+'M')+' · '+perLab(s); }
function fmtDate(iso){ var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], p=iso.split('-'); return m[+p[1]-1]+' '+(+p[2])+', '+p[0]; }
function basisChip(s){ return s.basis==='disclosed'?'<span class="ce-w-chip tag">Disclosed by '+esc(s.n)+'</span>':'<span class="ce-w-chip cons">Bloomberg estimate</span>'; }
function geo(){
  var m={}; SPLC.forEach(function(s){ m[s.ctry]=(m[s.ctry]||0)+1; });
  return Object.keys(m).map(function(k){ return [k,m[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
}
var SPLC_GEO=geo();

function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}

export function tsmSplcBody(){
  var nDisc=SPLC.filter(function(s){ return s.basis==='disclosed'; }).length, top=SPLC_EQ[0], jp=SPLC_GEO.filter(function(g){ return g[0]==='Japan'; })[0];
  var dates=SPLC.map(function(s){ return s.asof; }).sort();
  var h='';
  h+='<div class="rs-noguide">⚑ Top 20 suppliers only</div>';
  h+='<p class="ov-lede">Bloomberg tracks TSMC\'s supply chain only as its <b>20 largest suppliers</b> in this export — there is no supplier universe, no facility count and no facility geography. '+
    'Relationship periods differ (a quarter for some, a year for others), so suppliers are ranked by <b>share of TSMC\'s cost</b>, and each dollar amount shows its own period.</p>';
  h+=ddStat([['20','suppliers tracked (Bloomberg top 20)'],[SPLC_EQ.length+' / '+SPLC_MAT.length,'equipment (capex) / materials (cost of revenue)'],
    [jp?jp[1]+' of 20':'–','suppliers based in Japan'],[nDisc+' of 20','relationships disclosed by the supplier itself'],
    [top.cost.toFixed(1)+'%','largest relationship ('+top.n+'), share of TSMC capex']]);
  h+='<div class="ov-diagram-cap tsm-splc-cap"><b>Chain 1 · the fab-equipment chain (capex)</b> — share of TSMC\'s capex; bar = relative size — tap a card for the read</div>';
  h+='<div class="ce-watch">'+SPLC_EQ.map(function(s){
    var i=SPLC.indexOf(s), w=Math.max(s.cost/SPLC_EQ[0].cost*100,2);
    return '<div class="ce-w ov-clickable tsm-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip tag">'+esc(s.cat)+'</span><span class="ce-w-chip tsm-splc-more">the read ›</span></div>'+
      '<div class="ov-mbar tsm-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip cons">'+s.cost.toFixed(1)+'% of TSMC capex</span><span class="ce-w-chip red"><b>Their dependency:</b> '+s.their.toFixed(1)+'% of '+esc(s.n)+' revenue</span>'+
      '<span class="ce-w-chip">'+esc(amtLab(s))+'</span>'+basisChip(s)+'</div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap tsm-splc-cap"><b>Chain 2 · the materials chain (cost of revenue)</b> — wafers, resists, chemicals and gases</div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Supplier</th><th>Relationship</th><th>TSMC cost %</th><th>Their exposure to TSMC</th><th>Category</th><th>Basis</th></tr></thead><tbody>'+
    SPLC_MAT.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+'</td><td>'+esc(amtLab(s))+'</td><td>'+s.cost.toFixed(2)+'%</td><td>'+s.their.toFixed(1)+'% of revenue</td><td>'+esc(s.cat)+'</td><td>'+(s.basis==='disclosed'?'Disclosed':'BBG estimate')+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  var dep=SPLC.slice().sort(function(a,b){ return b.their-a.their; }).slice(0,10);
  h+='<div class="ov-diagram-cap tsm-splc-cap"><b>Who needs whom — revenue dependency ON TSMC</b> (% of the supplier\'s revenue, top 10)</div>';
  h+='<div class="ov-mbars">'+dep.map(function(s){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(s.n)+' <span class="tsm-splc-sub">'+esc(s.cat)+'</span></div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+s.their.toFixed(1)+'%">'+s.their.toFixed(1)+'%</div></div><div class="ov-mbar-v">'+s.their.toFixed(1)+'%</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-sec tsm-splc-geo"><div class="ov-sec-h">Geography — where the top 20 suppliers are based (number of suppliers)</div>'+
    '<div class="tsm-splc-geo-c"><canvas id="tsmSplcGeo"></canvas></div>'+
    '<div class="ov-fynote">Home country of each supplier, not where its factories are — the export carries no facility data. Japan supplies most of the materials and much of the equipment; the three largest equipment relationships (ASML, Applied Materials, Lam) are Dutch and US.</div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h"><span class="rs-collap-ic">▸</span> Data — what the chart draws <span class="rs-collap-sub">'+SPLC_GEO.length+' rows</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Country</th><th>Suppliers</th><th>Names</th></tr></thead><tbody>'+
      SPLC_GEO.map(function(g){ return '<tr><td class="rs-ft-h">'+esc(g[0])+'</td><td>'+g[1]+'</td><td>'+esc(SPLC.filter(function(s){ return s.ctry===g[0]; }).map(function(s){ return s.n; }).join(', '))+'</td></tr>'; }).join('')+
      '</tbody></table></div></div></div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), 2330 TT Equity, supplier relationships, export of '+SPLC_ASOF+' (relationships dated '+fmtDate(dates[0])+' – '+fmtDate(dates[dates.length-1])+'). '+
    'Relationship sizes are Bloomberg estimates unless marked disclosed (taken from the supplier\'s own filings); directional, not audited. Periods: Q = quarter, FY = fiscal year, C = Bloomberg calendar period. '+
    'Top 20 suppliers only. Categories and card readings are Summit\'s.</div>';
  return h;
}

export function tsmSplcBuild(){
  var cv=chartReady('tsmSplcGeo'); if(!cv) return; destroy('tsmSplcGeo');
  _charts['tsmSplcGeo']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:SPLC_GEO.map(function(g){ return g[0]; }), datasets:[
      { label:'Suppliers (top 20)', data:SPLC_GEO.map(function(g){ return g[1]; }), backgroundColor:BRAND2, maxBarThickness:15 } ] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.parsed.x+' of 20 suppliers'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ stepSize:1, precision:0 } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by tsm.js's delegated handler.
export function tsmSplcPop(id){
  var s=SPLC[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="tsm-splc-sub">'+esc(amtLab(s))+' · '+s.cost.toFixed(1)+'% of TSMC '+(s.type==='CAPEX'?'capex':'cost of revenue')+'</span>',
    h:'<p>'+esc(s.d)+'</p><p>TSMC is <b>'+s.their.toFixed(1)+'%</b> of '+esc(s.n)+'\'s revenue'+(s.basis==='disclosed'?', as '+esc(s.n)+' discloses it':' (Bloomberg estimate)')+
      '. Relationship as of '+fmtDate(s.asof)+'; '+esc(s.ctry)+'-based.</p>' };
}
