// spot-splc.js — Spotify Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// Same module shape as meta-splc.js / tsm-splc.js (5 KPIs · Chain 1 cards · Chain 2 table · Who needs whom · geography by
// facilities with its data table · standard source footer), on the Bloomberg SPLC screens for SPOT US Equity of
// 21 Oct 2026 (screenshots in G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\SPOT UPDATE). Currency of the
// screens: FRC (EUR), so every size here is in euros. Compiled by hand from the Key Metrics and Geo-Exposure tabs (the
// supplier side has no loader, §13).
//
//   • Only nine suppliers carry a relationship size. Bloomberg lists about 70 supplier names; the rest have no size,
//     no cost percentage and no category, so they are counted in the KPIs and not drawn.
//   • Chain 1 = the licensors (the two relationships that are 99% of the sized total); Chain 2 = everything else sized.
//   • Nothing here is written from memory: sizes, cost percentages, categories, dependencies and sources are the screens'.
//     The card text about the licensors reuses what the profile already says about them (spot.js peers).

var BAR='#1E2733';   // navy — the formal skin (§21); one series, no categorical colour
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, SPOT US Equity, suppliers ───────────────────────────────────────────
// rel = relationship size (EUR M); cost = Bloomberg's "SPOT's Cost %" (share of the cost category in `type`);
// their = "Supplier's Revenue %" (share of the supplier's revenue that comes from Spotify);
// type = Bloomberg's cost category (COGS · SGA); src = the filing basis of the figure; size = how the size was obtained.
var SPLC_ASOF='Oct 21, 2026';
var SPLC=[
  { n:'Universal Music Group', per:'2026Q2', ind:'Entertainment Content', rel:2486.19, cost:19.54, costTxt:'19.54', type:'COGS', their:20.07, size:'Bloomberg estimate', src:'Supplier\u2019s 2026Q2 filing' },
  { n:'Warner Music Group', per:'2025',    ind:'Entertainment Content', rel:1215.69, cost:63.45, costTxt:'63.45', type:'SGA',  their:20.00, size:'As reported',        src:'Supplier\u2019s 2025 annual filing' },
  { n:'Mattel', per:'2023',                ind:'Leisure Products',      rel:12.25,   cost:0.10,  costTxt:'0.10',  type:'COGS', their:0.42,  size:'Bloomberg estimate', src:'Supplier\u2019s 2023 annual filing' },
  { n:'Akamai Technologies', per:'2025',   ind:'Software',              rel:9.04,    cost:0.07,  costTxt:'0.07',  type:'COGS', their:0.24,  size:'Bloomberg estimate', src:'Supplier\u2019s 2025 annual filing' },
  { n:'Salesforce', per:'news',            ind:'Software',              rel:8.01,    cost:0.06,  costTxt:'0.06',  type:'COGS', their:0.02,  size:'Bloomberg estimate', src:'Company news' },
  { n:'Figma', per:'2026Q1',                 ind:'Software',              rel:3.25,    cost:0.03,  costTxt:'0.03',  type:'COGS', their:0.26,  size:'Bloomberg estimate', src:'Supplier\u2019s 2026Q1 filing' },
  { n:'UiPath', per:'2025Q3',                ind:'Software',              rel:1.73,    cost:0.01,  costTxt:'0.01',  type:'COGS', their:0.12,  size:'Bloomberg estimate', src:'Supplier\u2019s 2025Q3 filing' },
  { n:'PagerDuty', per:'2026Q2',             ind:'Software',              rel:0.72,    cost:0.005, costTxt:'<0.01', type:'COGS', their:0.17,  size:'Bloomberg estimate', src:'Supplier\u2019s 2026Q2 filing' },
  { n:'DoubleVerify', per:'2023Q4',          ind:'Software',              rel:0.65,    cost:0.005, costTxt:'<0.01', type:'COGS', their:0.10,  size:'Bloomberg estimate', src:'Supplier\u2019s 2023Q4 filing' },
];
// Supplier universe and geography (by country of the supplier's domicile and of its facilities).
var SPLC_TOTAL={ suppliers:67, facilities:1022 };   // Geo-Exposure tab, "Total" row: suppliers with a domicile, supplier facilities
var SPLC_GEO=[
  { c:'United States',  n:30, pct:44.78, fac:588, facPct:57.53 },
  { c:'Germany',        n:3,  pct:4.48,  fac:83,  facPct:8.12  },
  { c:'United Kingdom', n:10, pct:14.93, fac:59,  facPct:5.77  },
  { c:'Japan',          n:3,  pct:4.48,  fac:54,  facPct:5.28  },
  { c:'Canada',         n:0,  pct:null,  fac:29,  facPct:2.84  },
  { c:'Spain',          n:1,  pct:1.49,  fac:28,  facPct:2.74  },
  { c:'Mexico',         n:0,  pct:null,  fac:27,  facPct:2.64  },
  { c:'India',          n:4,  pct:5.97,  fac:25,  facPct:2.45  },
  { c:'China',          n:1,  pct:1.49,  fac:18,  facPct:1.76  },
  { c:'France',         n:4,  pct:5.97,  fac:17,  facPct:1.66  },
  { c:'Australia',      n:1,  pct:1.49,  fac:14,  facPct:1.37  },
  { c:'Italy',          n:0,  pct:null,  fac:13,  facPct:1.27  },
];
var GEO_CHART=SPLC_GEO.slice(0,6);   // drawn: the six countries with the most facilities; the table carries twelve
// What the two licensors are to Spotify — the profile's own wording (spot.js peers), not Bloomberg's.
var SPLC_WHAT={
  'Universal Music Group':['Licensor \u00b7 largest major label','The largest of the three major labels Spotify licenses its catalogue from. Bloomberg puts the relationship at about a fifth of Spotify\u2019s cost of revenue.'],
  'Warner Music Group':['Licensor \u00b7 major label','The second listed major Spotify licenses from, smaller and more levered than Universal. Bloomberg files this relationship under SG&A, not cost of revenue, and takes its size as reported in Warner\u2019s 2025 annual filing.'],
};
SPLC.forEach(function(s){ var w=SPLC_WHAT[s.n]||['','']; s.cat=w[0]; s.d=w[1]; });
var CHAIN1=SPLC.filter(function(s){ return SPLC_WHAT[s.n]; });
var CHAIN2=SPLC.filter(function(s){ return !SPLC_WHAT[s.n]; });
var TYPE_L={ COGS:'Cost of revenue', SGA:'SG&A' };

function perLab(s){ return s.per==='news' ? 'company news' : s.per; }
function basisChip(s){ return '<span class="ce-w-chip spot-splc-chip">'+(s.size==='As reported' ? 'Reported by '+esc(s.n) : 'Bloomberg estimate')+'</span>'; }
function money(m){ return '\u20ac'+(m>=1000?(m/1000).toFixed(1)+'B':(m>=10?Math.round(m):m.toFixed(2))+'M'); }
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function geoRow(c){ for(var i=0;i<SPLC_GEO.length;i++){ if(SPLC_GEO[i].c===c) return SPLC_GEO[i]; } return null; }

export function spotSplcBody(){
  var top=SPLC[0], us=geoRow('United States'), cn=geoRow('China');
  var tot=0, c1=0; SPLC.forEach(function(s){ tot+=s.rel; }); CHAIN1.forEach(function(s){ c1+=s.rel; });
  var h='';
  h+='<div class="rs-noguide">\u2691 Only '+SPLC.length+' suppliers carry a size</div>';
  h+='<p class="ov-lede">Bloomberg lists about 70 supplier names for Spotify and sizes the relationship for only <b>'+SPLC.length+'</b> of them; the rest have no size, no cost percentage and no category, so they are counted and not ranked. '+
    'Relationship periods differ (a quarter for some, a year for others), so each amount shows its own period. The nine sized relationships add up to <b>'+money(tot)+'</b>, and <b>'+(c1/tot*100).toFixed(0)+'%</b> of that is the two music licensors, Universal and Warner.</p>';
  h+=ddStat([[String(SPLC_TOTAL.suppliers),'suppliers tracked (with a domicile)'],[SPLC_TOTAL.facilities.toLocaleString('en-US'),'supplier facilities'],
    [us.facPct.toFixed(1)+'%','of facilities in the US'],[cn.facPct.toFixed(1)+'%','of facilities in China'],
    [money(top.rel),'largest relationship ('+top.n+'), '+top.cost.toFixed(1)+'% of Spotify\u2019s cost of revenue']]);
  h+='<div class="ov-diagram-cap spot-splc-cap"><b>Chain 1 \u00b7 the licensors (cost of revenue and SG&amp;A)</b> \u2014 share of Spotify\u2019s cost; bar = relative size \u2014 tap a card for the read</div>';
  h+='<div class="ce-watch">'+CHAIN1.map(function(s){
    var i=SPLC.indexOf(s), w=Math.max(s.rel/CHAIN1[0].rel*100,2);
    return '<div class="ce-w ov-clickable spot-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip spot-splc-chip">'+esc(s.cat)+'</span><span class="ce-w-chip spot-splc-more">the read \u203a</span></div>'+
      '<div class="ov-mbar spot-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip spot-splc-chip">'+s.costTxt+'% of Spotify\u2019s '+(s.type==='SGA'?'SG&amp;A':'cost of revenue')+'</span>'+
      '<span class="ce-w-chip spot-splc-chip"><b>Their dependency:</b> '+s.their.toFixed(1)+'% of '+esc(s.n)+' revenue</span>'+
      '<span class="ce-w-chip spot-splc-chip">'+money(s.rel)+' \u00b7 '+esc(perLab(s))+'</span>'+basisChip(s)+'</div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap spot-splc-cap"><b>Chain 2 \u00b7 software and other suppliers with a size (cost of revenue)</b></div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Supplier</th><th>Relationship</th><th>Spotify cost %</th><th>Their exposure to Spotify</th><th>Category</th><th>Lands in</th><th>Basis</th></tr></thead><tbody>'+
    CHAIN2.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+'</td><td>'+money(s.rel)+' \u00b7 '+esc(perLab(s))+'</td><td>'+s.costTxt+'%</td><td>'+s.their.toFixed(2)+'% of revenue</td><td>'+esc(s.ind)+'</td><td>'+TYPE_L[s.type]+'</td><td>'+(s.size==='As reported'?'Disclosed':'BBG estimate')+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  var dep=SPLC.slice().sort(function(a,b){ return b.their-a.their; });
  h+='<div class="ov-diagram-cap spot-splc-cap"><b>Who needs whom \u2014 revenue dependency ON Spotify</b> (% of the supplier\u2019s revenue; relationship size at the right)</div>';
  h+='<div class="ov-mbars">'+dep.map(function(s){
    var w=Math.max(s.their/dep[0].their*100,1.5), inside=w>=14;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(s.n)+' <span class="spot-splc-sub">'+esc(s.ind)+'</span></div>'+
      '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%">'+(inside?s.their.toFixed(2)+'%':'')+'</div>'+
      (inside?'':'<span class="spot-splc-in" style="left:calc(max('+w.toFixed(1)+'%, 18px) + 8px)">'+s.their.toFixed(2)+'%</span>')+'</div>'+
      '<div class="ov-mbar-v">'+money(s.rel)+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-sec spot-splc-geo"><div class="ov-sec-h">Geography \u2014 share of supplier facilities by country (the six countries with the most facilities)</div>'+
    '<div class="spot-splc-geo-c"><canvas id="spotSplcGeo"></canvas></div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-ssplc="1"><span class="rs-collap-ic">\u25b8</span> Data \u2014 what the chart draws <span class="rs-collap-sub">'+SPLC_GEO.length+' rows</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Country</th><th>Facilities</th><th>% of facilities</th><th>Suppliers domiciled</th><th>% of suppliers</th></tr></thead><tbody>'+
      SPLC_GEO.map(function(g){ return '<tr><td class="rs-ft-h">'+esc(g.c)+'</td><td>'+g.fac.toLocaleString('en-US')+'</td><td>'+g.facPct.toFixed(1)+'%</td><td>'+(g.n?g.n:'\u2014')+'</td><td>'+(g.pct==null?'\u2014':g.pct.toFixed(1)+'%')+'</td></tr>'; }).join('')+
      '</tbody></table></div></div></div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), SPOT US Equity, as of '+SPLC_ASOF+', currency EUR. Relationship sizes are Bloomberg estimates unless marked as reported; directional, not audited. '+
    '\u201cSpotify cost %\u201d = the relationship as a share of Spotify\u2019s cost in the category shown; \u201ctheir exposure\u201d = Spotify\u2019s share of the supplier\u2019s revenue. '+
    'Bloomberg lists about 70 supplier names; only the nine shown carry a size. Sony Group appears in the list without one.</div>';
  return h;
}

export function spotSplcBuild(){
  // The data table under the chart toggles itself (data-selfwired: no global handler flips it twice).
  var pane=document.querySelector('.ov-spot-dd .ovt-subpane[data-ovst="supplychain"]');
  if(pane && !pane._sspWired){ pane._sspWired=true;
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-ssplc]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'\u25be':'\u25b8'; }); }
  var cv=chartReady('spotSplcGeo'); if(!cv) return; destroy('spotSplcGeo');
  _charts['spotSplcGeo']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:GEO_CHART.map(function(g){ return g.c; }), datasets:[
      { label:'% of facilities', data:GEO_CHART.map(function(g){ return g.facPct; }), backgroundColor:BAR, maxBarThickness:15 } ] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var g=GEO_CHART[ctx.dataIndex]; return g.facPct.toFixed(1)+'% of facilities ('+g.fac.toLocaleString('en-US')+')'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return v+'%'; } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by spot.js's wireModal.
export function spotSplcPop(id){
  var s=SPLC[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="spot-splc-sub">'+money(s.rel)+' \u00b7 '+s.costTxt+'% of Spotify\u2019s '+(s.type==='SGA'?'SG&amp;A':'cost of revenue')+'</span>',
    h:'<p>'+esc(s.d)+'</p><p>Spotify is <b>'+s.their.toFixed(1)+'%</b> of '+esc(s.n)+'\u2019s revenue. Size: '+esc(s.size.toLowerCase())+'; basis: '+esc(s.src.toLowerCase())+'. The spend lands in Spotify\u2019s '+TYPE_L[s.type].toLowerCase()+' (Bloomberg\u2019s classification).</p>' };
}
