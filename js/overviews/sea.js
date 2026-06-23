// overviews/sea.js — custom Overview for Sea Limited (NYSE: SE)
// Built individually per the portal's per-company Overview model.
// Four sub-tabs (Overview, Shopee, Monee, Garena) rendered inside the Overview pane.
// FY2025 actuals from the Sea Limited 20-F / annual report; FY2026–2028E estimates
// from a Bloomberg financial model (BST). Estimate years are shown faded.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand / chart colors ─────────────────────────────────────────────────────
var C_SEA='#2C3E54', C_SHOPEE='#EE4D2D', C_MONEE='#6366F1', C_GARENA='#F59E0B';
var C_GRID='#EEF2F7', C_AXIS='#8A93A0', C_POS='#16A34A', C_NEG='#DC2626';
var LIGHT={}; LIGHT[C_SEA]='rgba(44,62,84,0.40)'; LIGHT[C_SHOPEE]='rgba(238,77,45,0.45)'; LIGHT[C_MONEE]='rgba(99,102,241,0.45)'; LIGHT[C_GARENA]='rgba(245,158,11,0.45)';
var FILL={};  FILL[C_SEA]='rgba(44,62,84,0.08)';  FILL[C_SHOPEE]='rgba(238,77,45,0.10)';  FILL[C_MONEE]='rgba(99,102,241,0.10)';  FILL[C_GARENA]='rgba(245,158,11,0.10)';

// ─── Formatters ───────────────────────────────────────────────────────────────
var fB    = function(v){ return '$'+(Math.round(v*10)/10)+'B'; };
var fM    = function(v){ return (v<0?'-':'')+'$'+Math.abs(Math.round(v)).toLocaleString()+'M'; };
var fPct  = function(v){ return v+'%'; };
var fUSD1 = function(v){ return '$'+(Math.round(v*100)/100).toFixed(2); };
var fCnt  = function(v){ return v+'B'; };

// ─── Time-series registry (driven by the timeline slider) ────────────────────
// pane: which sub-tab · est: estimate flag per point · fy: FY-style labels
var SERIES = {
  chartRevenue:{pane:'overview',type:'bar',color:C_SEA,fy:true,yfmt:fB,
    years:[2020,2021,2022,2023,2024,2025,2026,2027,2028],
    data:[4.38,9.96,12.45,13.06,16.82,22.94,30.26,36.74,42.76],
    est:[false,false,false,false,false,false,true,true,true]},
  chartOpInc:{pane:'overview',type:'bar',signed:true,posColor:C_POS,lightPos:'rgba(22,163,74,0.45)',fy:true,yfmt:fM,
    years:[2020,2021,2022,2023,2024,2025,2026,2027,2028],
    data:[-1300,-1583,-1488,225,662,1985,2433,3471,4711],
    est:[false,false,false,false,false,false,true,true,true]},
  chartEBTrend:{pane:'overview',type:'bar',signed:true,posColor:C_SEA,lightPos:'rgba(44,62,84,0.40)',fy:true,yfmt:fM,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[-594,-878,1179,1962,3437,3865,4929,6143],
    est:[false,false,false,false,false,true,true,true]},
  chartGMV:{pane:'shopee',type:'bar',color:C_SHOPEE,fy:false,yfmt:fB,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[62.6,73.5,78.5,100.5,127.4,159.8,189.1,216.3],
    est:[false,false,false,false,false,true,true,true]},
  chartTakeRate:{pane:'shopee',type:'line',color:C_SHOPEE,fy:false,pct:true,ymin:6,ymax:16,yfmt:fPct,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[8.2,9.9,11.5,12.4,13.0,13.8,14.1,14.3],
    est:[false,false,false,false,false,true,true,true]},
  chartOrders:{pane:'shopee',type:'bar',color:C_SHOPEE,fy:false,yfmt:fCnt,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[6.1,7.6,8.2,10.9,13.9,17.6,20.7,23.5],
    est:[false,false,false,false,false,true,true,true]},
  chartAOV:{pane:'shopee',type:'line',color:C_SHOPEE,fy:false,ymin:6,ymax:11,yfmt:fUSD1,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[7.42,9.70,9.57,9.22,9.17,9.10,9.12,9.19],
    est:[false,false,false,false,false,true,true,true]},
  chartLoans:{pane:'monee',type:'bar',color:C_MONEE,fy:false,yfmt:fB,
    years:[2023,2024,2025,2026,2027,2028],
    data:[3.3,5.1,9.2,13.3,17.3,21.6],
    est:[false,false,false,true,true,true]},
  chartNPL:{pane:'monee',type:'line',color:C_MONEE,fy:false,pct:true,ymin:0,ymax:3.5,yfmt:fPct,
    years:[2022,2023,2024,2025],
    data:[2.9,2.4,1.5,1.1],
    est:[false,false,false,false]},
  chartDFSRev:{pane:'monee',type:'bar',color:C_MONEE,fy:false,yfmt:fM,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[470,1222,1759,2368,3792,5386,6998,8650],
    est:[false,false,false,false,false,true,true,true]},
  chartBookingsAnn:{pane:'garena',type:'bar',color:C_GARENA,fy:true,yfmt:fB,
    years:[2021,2022,2023,2024,2025,2026,2027,2028],
    data:[4.6,2.8,1.8,2.1,2.9,3.22,3.38,3.41],
    est:[false,false,false,false,false,true,true,true]}
};

// Static (non-timeline) charts
var DOUGHNUT_REVMIX = { labels:['Shopee','Monee','Garena','Other'], data:[16.6,3.8,2.4,0.1], colors:[C_SHOPEE,C_MONEE,C_GARENA,'#94A3B8'] };
var DOUGHNUT_EBMIX  = { labels:['Garena','Monee','Shopee'], data:[1600,1000,881], colors:[C_GARENA,C_MONEE,C_SHOPEE] };
var BOOKINGS_Q = { labels:["Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25"], data:[512,537,543,557,661,672,775,841] };

var Y0=2020, Y1=2028;
var _yrStart=2020, _yrEnd=2028, _showYoY=false, _activePane='overview', _charts={};

// ─── Qualitative content ──────────────────────────────────────────────────────
var DESC = 'Sea operates three integrated businesses across Southeast Asia, Taiwan and Latin America. <b>Shopee</b>, the pan-regional e-commerce marketplace, drives ~72% of revenue and is the customer-acquisition engine for the group. <b>Garena</b>, the original digital entertainment business, contributes ~10% of revenue but nearly half of segment EBITDA — anchored by Free Fire, an 8-year-old battle royale that grew 30%+ bookings in each of the last two years. <b>Monee</b> (rebranded from SeaMoney in 2025) is the digital financial services arm, built around consumer and SME credit, with a $9.2B loan book that grew 80% YoY while keeping 90-day NPLs at 1.1%. The three businesses are commercially integrated: Shopee distribution accelerates Monee customer acquisition, Monee credit lifts Shopee conversion, and Garena\'s mature cashflow seeded both.';

var SEG_CARDS = [
  ['S', C_SHOPEE, 'Shopee', 'E-Commerce · 72% of revenue', 'Pan-regional e-commerce marketplace and the group\'s customer-acquisition engine. ~400M active buyers and ~20M sellers across SEA, Taiwan and Brazil. Monetized through marketplace commissions, advertising and logistics services.'],
  ['M', C_MONEE, 'Monee', 'Digital Financial Services · 17% of revenue', 'Consumer & SME credit (SPayLater + cash loans), digital wallet and digital banking. $9.2B loan book (+80% YoY) with 90-day NPLs at just 1.1%. 37M+ active credit users, with ~80% of revenue from the credit business.'],
  ['G', C_GARENA, 'Garena', 'Digital Entertainment · 10% of revenue', 'The group\'s original cash engine, anchored by Free Fire — a top global mobile battle royale. ~633M quarterly active users and a 51% operating margin that funds investment in Shopee and Monee.']
];

var KPI_OVERVIEW = [
  {l:'FY2025 Revenue', v:'$22.9B', d:'+36% YoY', dir:'up'},
  {l:'Operating Income', v:'$2.0B', d:'+200% YoY', dir:'up'},
  {l:'Adj. EBITDA', v:'$3.4B', d:'+75% YoY', dir:'up'},
  {l:'EPS (TTM)', v:'$2.58', d:'Profitable', dir:'up'}
];
var KPI_SHOPEE = [
  {l:'GMV (2025)', v:'$127.4B', d:'+27% YoY', dir:'up'},
  {l:'Take Rate (2025)', v:'13.0%', d:'+60bps YoY', dir:'up'},
  {l:'Orders (2025)', v:'13.9B', d:'+27% YoY', dir:'up'},
  {l:'MAU', v:'200M+', d:'#2 global app', dir:'muted'}
];
var KPI_MONEE = [
  {l:'Loan book (Q4\'25)', v:'$9.2B', d:'+80% YoY', dir:'up'},
  {l:'NPL 90+', v:'1.1%', d:'vs ~3% in 2022', dir:'up'},
  {l:'Active borrowers', v:'28M+', d:'Growing', dir:'up'},
  {l:'Op. income (Q4)', v:'$658M', d:'+34% YoY', dir:'up'}
];
var KPI_GARENA = [
  {l:'QAU', v:'670M', d:'+36% from trough', dir:'up'},
  {l:'QPU', v:'66M', d:'Recovered', dir:'up'},
  {l:'FY25 Bookings', v:'$2.95B', d:'+37% YoY', dir:'up'},
  {l:'Op. Margin', v:'51%', d:'Cash engine', dir:'muted'}
];

var TAKE_DRIVERS = [
  ['1','Advertising monetization','Ad revenue growing 50%+ YoY. Currently ~2% of GMV versus 4-5% at mature peers like Alibaba and Amazon. Each 1% take rate increase adds ~$1.2B in gross profit.'],
  ['2','Logistics fees (SPX Express)','In-house fulfillment covers 50%+ of orders. Sellers pay shipping and handling fees that flow directly to take rate. 1,000+ warehouses and delivery centres.'],
  ['3','Commission fees','Higher marketplace commissions as Shopee gains pricing power from dominant market share. Up to 6-8% on Shopee Mall verified brands.'],
  ['4','Live commerce and value-added','Premium seller tools, live-stream commerce integration, and Shopee Mall fees driving incremental take rate.']
];
var MSHARE_SEA = { title:'Southeast Asia GMV market share — 2024', src:'Source: Momentum Works', rows:[
  ['Shopee', 52, '$66.8B', C_SHOPEE],['TikTok Shop', 18, '$22.6B', '#64748B'],['Lazada', 14, '~$19B', '#475569'],['Others', 16, '~$20B', '#334155']
]};
var MSHARE_BR = { title:'Brazil e-commerce GMV market share — 2025', src:'Source: BTG Pactual / NeoFeed', rows:[
  ['Mercado Libre', 39, '~$26B', '#3B82F6'],['Shopee', 14, '~$9.4B', C_SHOPEE],['Amazon', 12, '~$8B', C_GARENA],['Mag. Luiza', 10, '~$6.7B', '#64748B'],['Others', 25, '~$16.7B', '#334155']
]};

var MONEE_ADV = ['Zero CAC — 400M Shopee users','AI credit scoring — 1.1% NPL','Ecosystem flywheel','Near-zero marginal cost per loan'];
var MONEE_FLYWHEEL = [
  ['1','Shopee data moat','400M users generate transaction, search, and behavioral data that feeds proprietary credit scoring models.'],
  ['2','Instant underwriting','AI-driven credit decisions in less than 2 seconds at checkout. 70% of SEA population lacks formal credit access.'],
  ['3','Low-cost distribution','Zero CAC for lending — credit offered at point of sale within the Shopee app via SPayLater and seller loans.'],
  ['4','Virtuous loop','More lending generates more data, enabling better risk models, lower NPLs, expanded credit, and ecosystem growth.']
];
var MONEE_STREAMS = [
  ['$','Interest income (~80%)','SPayLater / SLoan: 1.5-3.5%/mo rates on BNPL and cash loans. Largest Monee revenue driver.'],
  ['$','Payment fees','MDR of 0.5-2% per ShopeePay transaction. 400M users + offline QR and billers across 8 SEA markets.'],
  ['$','Banking NIM','SeaBank / MariBank: 5-12% NIM spread. Both banks profitable with full digital bank licenses.'],
  ['$','Insurtech and fees','Micro-insurance at checkout, FX spread, investment wrap fees, premium tiers.']
];
var FF_TIMELINE = [
  ['2017','Free Fire launches'],['2019','#1 battle royale mobile globally'],['2021','Peak: $4.3B bookings'],
  ['2022','India ban, post-COVID decline'],['2023','Trough: $1.8B bookings · India re-launch (Sep)'],
  ['2024','Recovery begins · 51% operating margin'],['2025','$2.95B bookings (+37% YoY) · 670M QAU']
];
var GARENA_DRIVERS = [
  ['1','India re-launch','Free Fire returned after 18-month ban. India now #1 contributor to QAU recovery (+130M users).'],
  ['2','Content cadence','Major collabs (Naruto, One Punch Man, Justin Bieber) drove QPU back above 60M from the 39M trough.'],
  ['3','Competitive positioning','Free Fire\'s 600MB client dominates on low-end Android versus PUBG\'s 2GB requirement. Gaining share in SEA.'],
  ['4','Ecosystem role','Cash engine funding Shopee/Monee. 670M gamers cross-sell into Shopee; in-game purchases drive Monee adoption.']
];

var SOURCES = 'Sources: Sea Limited FY2025 20-F / annual report (GMV, orders, take rate, revenue, loan book), a Bloomberg financial model for FY2026–2028E estimates (BST), and the research team\'s segment notes. Estimate years (faded / dashed) are projections, not reported results.';

// ─── HTML render helpers ──────────────────────────────────────────────────────
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){
  return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
}).join('')+'</div>'; }

function segHead(card){
  return '<div class="ov-seg"><div class="ov-seg-icon" style="background:'+card[1]+'1A;color:'+card[1]+';">'+esc(card[0])+'</div>'+
    '<div><div class="ov-seg-name">'+esc(card[2])+'</div><div class="ov-seg-tag">'+esc(card[3])+'</div></div></div>';
}

function chartCard(id, title, sub, ts){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+(sub?' <span>'+esc(sub)+'</span>':'')+'</div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div>'+(ts?'<div class="ov-statline" id="stat-'+id+'"></div>':'')+'</div>';
}

function flywheel(arr, color){ return '<div class="ov-fly">'+arr.map(function(f){
  return '<div class="ov-fly-item"><div class="ov-fly-num" style="background:'+color+'1A;color:'+color+';">'+esc(f[0])+'</div>'+
    '<div class="ov-fly-h">'+esc(f[1])+'</div><div class="ov-fly-p">'+esc(f[2])+'</div></div>';
}).join('')+'</div>'; }

function mshare(m){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(m.title)+' <span>'+esc(m.src)+'</span></div><div class="ov-mbars">'+
    m.rows.map(function(r){
      return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
        '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
        '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
    }).join('')+'</div></div>';
}

function doughnutCard(id, title, sub, centerBig, centerSmall, legend){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap ov-donut-wrap"><canvas id="'+id+'"></canvas>'+
    '<div class="ov-donut-c"><div class="ov-donut-big">'+esc(centerBig)+'</div><div class="ov-donut-small">'+esc(centerSmall)+'</div></div></div>'+
    '<div class="ov-legend">'+legend.map(function(l){return '<span class="ov-legend-i"><span class="ov-legend-dot" style="background:'+l[1]+';"></span>'+esc(l[0])+'</span>';}).join('')+'</div></div>';
}

function html(c){
  var h = '<div class="ov ov-se" data-brand="SE">';

  // Sub-tab bar
  h += '<div class="ov-subtabs">'+
    '<button class="ov-subtab active" data-seatab="overview">Overview</button>'+
    '<button class="ov-subtab" data-seatab="shopee">Shopee</button>'+
    '<button class="ov-subtab" data-seatab="monee">Monee</button>'+
    '<button class="ov-subtab" data-seatab="garena">Garena</button>'+
  '</div>';

  // Timeline range control
  h += '<div class="ov-rangebar">'+
    '<div class="ov-range-head"><span class="ov-range-title">Timeline</span>'+
      '<span class="ov-range-val" id="ovRangeVal">2020 – 2028E</span>'+
      '<label class="ov-range-toggle"><input type="checkbox" id="ovYoY"> Show YoY per year</label></div>'+
    '<div class="ov-range-slider"><div class="ov-range-track"></div><div class="ov-range-fill" id="ovRangeFill"></div>'+
      '<input type="range" id="ovRangeMin" min="2020" max="2028" step="1" value="2020">'+
      '<input type="range" id="ovRangeMax" min="2020" max="2028" step="1" value="2028">'+
      '<div class="ov-range-ticks" id="ovRangeTicks"></div></div>'+
  '</div>';

  // ── Pane: Overview ──
  h += '<div class="ov-pane active" data-seapane="overview">';
  h += '<p class="ov-lede">'+DESC+'</p>';
  h += '<div class="ov-segcards">'+SEG_CARDS.map(function(card){
    return '<div class="ov-segcard">'+segHead(card)+'<p class="ov-segcard-p">'+esc(card[4])+'</p></div>';
  }).join('')+'</div>';
  h += kpis(KPI_OVERVIEW);
  h += '<div class="ov-charts ov-charts-2">'+
    chartCard('chartRevenue','Total revenue ($B)','FY20 – FY28E', true)+
    doughnutCard('chartRevMix','Revenue mix','FY2025','$22.9B','Total',[['Shopee 72%',C_SHOPEE],['Monee 17%',C_MONEE],['Garena 10%',C_GARENA],['Other 1%','#94A3B8']])+
    chartCard('chartOpInc','Operating income ($M)','Path to profitability', true)+
    doughnutCard('chartEBMix','EBITDA mix','FY2025','$3.4B','Adj. EBITDA',[['Garena 46%',C_GARENA],['Monee 29%',C_MONEE],['Shopee 25%',C_SHOPEE]])+
  '</div>';
  h += '<div class="ov-charts ov-charts-1">'+chartCard('chartEBTrend','Adjusted EBITDA ($M)','FY21 – FY28E', true)+'</div>';
  h += '</div>';

  // ── Pane: Shopee ──
  h += '<div class="ov-pane" data-seapane="shopee">';
  h += segHead(['S',C_SHOPEE,'Shopee','E-Commerce · $16.5B Revenue · 72% of Sea']);
  h += kpis(KPI_SHOPEE);
  h += '<div class="ov-charts ov-charts-2">'+
    chartCard('chartGMV','GMV ($B)','FY21 – FY28E', true)+
    chartCard('chartTakeRate','Take rate (%)','Ads + logistics monetization', true)+
    chartCard('chartOrders','Gross orders (B)','FY21 – FY28E', true)+
    chartCard('chartAOV','Average order value ($)','Stabilizing around $9', true)+
  '</div>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Take Rate Expansion Drivers</div>'+flywheel(TAKE_DRIVERS, C_SHOPEE)+'</section>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Market Position</div><div class="ov-charts ov-charts-1">'+mshare(MSHARE_SEA)+mshare(MSHARE_BR)+'</div></section>';
  h += '</div>';

  // ── Pane: Monee ──
  h += '<div class="ov-pane" data-seapane="monee">';
  h += segHead(['M',C_MONEE,'Monee','Digital Financial Services · $3.8B Revenue · 17% of Sea']);
  h += kpis(KPI_MONEE);
  h += '<div class="ov-charts ov-charts-2">'+
    chartCard('chartLoans','Loans outstanding ($B)','2023 – 2028E', true)+
    chartCard('chartNPL','NPL 90+ rate (%)','2022 – 2025 · historical', true)+
  '</div>';
  h += '<div class="ov-charts ov-charts-1">'+chartCard('chartDFSRev','DFS revenue ($M)','FY21 – FY28E', true)+'</div>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Structural Advantages</div><div class="ov-pills">'+
    MONEE_ADV.map(function(a){return '<span class="ov-pill">'+esc(a)+'</span>';}).join('')+'</div></section>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Credit Flywheel</div>'+flywheel(MONEE_FLYWHEEL, C_MONEE)+'</section>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Revenue Streams</div>'+flywheel(MONEE_STREAMS, C_MONEE)+'</section>';
  h += '</div>';

  // ── Pane: Garena ──
  h += '<div class="ov-pane" data-seapane="garena">';
  h += segHead(['G',C_GARENA,'Garena','Digital Entertainment · $2.4B Revenue · 51% Op. Margin']);
  h += kpis(KPI_GARENA);
  h += '<section class="ov-sec"><div class="ov-sec-h">Free Fire Timeline</div><div class="ov-timeline">'+
    FF_TIMELINE.map(function(t){ return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+esc(t[1])+'</div></div>'; }).join('')+
  '</div></section>';
  h += '<div class="ov-charts ov-charts-2">'+
    chartCard('chartBookingsAnn','Annual bookings ($B)','Peak → trough → recovery', true)+
    chartCard('chartBookingsQ','Quarterly bookings ($M)','Q1\'24 – Q4\'25', false)+
  '</div>';
  h += '<section class="ov-sec"><div class="ov-sec-h">Recovery Drivers</div>'+flywheel(GARENA_DRIVERS, C_GARENA)+'</section>';
  h += '</div>';

  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  h += '</div>';
  return h;
}

// ─── Chart engine ─────────────────────────────────────────────────────────────
function lblYr(y,est,fy){ var b=fy?('FY'+String(y).slice(2)):String(y); return b+(est?'E':''); }
function slice(s){
  var o={years:[],labels:[],data:[],est:[]};
  for(var i=0;i<s.years.length;i++){ if(s.years[i]>=_yrStart && s.years[i]<=_yrEnd){
    o.years.push(s.years[i]); o.data.push(s.data[i]); o.est.push(s.est[i]); o.labels.push(lblYr(s.years[i],s.est[i],s.fy)); } }
  return o;
}
function datasetFor(s, sl){
  if(s.type==='bar'){
    var bg;
    if(s.signed){ bg=sl.data.map(function(v,i){ return v<0?C_NEG:(sl.est[i]?s.lightPos:s.posColor); }); }
    else { bg=sl.est.map(function(e){ return e?LIGHT[s.color]:s.color; }); }
    return {data:sl.data, backgroundColor:bg, borderRadius:6, barPercentage:0.66, maxBarThickness:46};
  }
  return {data:sl.data, borderColor:s.color, backgroundColor:(FILL[s.color]||'rgba(0,0,0,0.05)'),
    fill:true, tension:0.3, borderWidth:2.5, pointRadius:3, pointHoverRadius:5,
    pointBackgroundColor: sl.est.map(function(e){ return e?LIGHT[s.color]:s.color; }),
    segment:{ borderDash:function(ctx){ return sl.est[ctx.p1DataIndex]?[6,4]:undefined; } } };
}
function optsFor(s){
  var o={ responsive:true, maintainAspectRatio:false,
    interaction:{mode:'index',intersect:false},
    plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+s.yfmt(ctx.parsed.y); } } } },
    scales:{ x:{ grid:{display:false}, ticks:{color:C_AXIS,font:{size:10}} },
             y:{ grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:s.yfmt} } } };
  if(s.ymin!=null) o.scales.y.min=s.ymin;
  if(s.ymax!=null) o.scales.y.max=s.ymax;
  return o;
}
function statFor(id, s, sl){
  var el=document.getElementById('stat-'+id); if(!el) return;
  var n=sl.data.length;
  if(n<2){ el.innerHTML='<span class="ov-stat-mut">Pick a wider range</span>'; return; }
  var a=sl.data[0], z=sl.data[n-1], yoy=(z/sl.data[n-2]-1)*100;
  function cl(x){return x>=0?'pos':'neg';} function sg(x){return x>=0?'+':'';}
  var main;
  if(s.pct){ var dpp=z-a; main='<b>'+sl.labels[0]+'</b> '+a+'% → <b>'+sl.labels[n-1]+'</b> '+z+'% · <span class="'+cl(dpp)+'">'+sg(dpp)+dpp.toFixed(1)+'pp</span>'; }
  else if(a>0&&z>0){ var cagr=(Math.pow(z/a,1/(sl.years[n-1]-sl.years[0]))-1)*100;
    main='CAGR '+sl.labels[0]+'–'+sl.labels[n-1]+': <span class="'+cl(cagr)+'">'+sg(cagr)+cagr.toFixed(1)+'%</span> · YoY '+sl.labels[n-1]+': <span class="'+cl(yoy)+'">'+sg(yoy)+yoy.toFixed(1)+'%</span>'; }
  else { main='YoY '+sl.labels[n-1]+': <span class="'+cl(yoy)+'">'+sg(yoy)+yoy.toFixed(1)+'%</span> · '+sl.labels[0]+' '+s.yfmt(a)+' → '+sl.labels[n-1]+' '+s.yfmt(z); }
  var html=main;
  if(_showYoY){
    var chips='';
    for(var i=1;i<n;i++){ var txt;
      if(s.pct){ var d=sl.data[i]-sl.data[i-1]; txt=sg(d)+d.toFixed(1)+'pp'; }
      else if(sl.data[i-1]>0&&sl.data[i]>0){ var r=(sl.data[i]/sl.data[i-1]-1)*100; txt=sg(r)+r.toFixed(0)+'%'; }
      else txt='n/m';
      chips+='<span class="ov-yoychip">'+sl.labels[i]+' '+txt+'</span>'; }
    html+='<div class="ov-yoychips">'+chips+'</div>';
  }
  el.innerHTML=html;
}
function makeSeries(id){
  var s=SERIES[id]; var cv=document.getElementById(id); if(!cv) return;
  var sl=slice(s);
  _charts[id]=new Chart(cv.getContext('2d'), { type:s.type, data:{labels:sl.labels, datasets:[datasetFor(s,sl)]}, options:optsFor(s) });
  statFor(id, s, sl);
}
function makeDoughnut(id, d){
  var cv=document.getElementById(id); if(!cv) return;
  _charts[id]=new Chart(cv.getContext('2d'), { type:'doughnut',
    data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:d.colors, borderWidth:0 }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{display:false} } } });
}
function makeBarStatic(id, d, color){
  var cv=document.getElementById(id); if(!cv) return;
  _charts[id]=new Chart(cv.getContext('2d'), { type:'bar',
    data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:color, borderRadius:6, barPercentage:0.66, maxBarThickness:34 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return ' $'+ctx.parsed.y+'M';}}}},
      scales:{ x:{grid:{display:false},ticks:{color:C_AXIS,font:{size:9},maxRotation:0,autoSkip:true}}, y:{grid:{color:C_GRID},ticks:{color:C_AXIS,font:{size:10},callback:function(v){return '$'+v+'M';}}} } } });
}
function destroyCharts(){ Object.keys(_charts).forEach(function(id){ try{_charts[id].destroy();}catch(e){} }); _charts={}; }

function renderPane(){
  if (typeof Chart === 'undefined') return;
  destroyCharts();
  Object.keys(SERIES).forEach(function(id){ if(SERIES[id].pane===_activePane) makeSeries(id); });
  if(_activePane==='overview'){ makeDoughnut('chartRevMix', DOUGHNUT_REVMIX); makeDoughnut('chartEBMix', DOUGHNUT_EBMIX); }
  if(_activePane==='garena'){ makeBarStatic('chartBookingsQ', BOOKINGS_Q, C_GARENA); }
}

// ─── Init / wiring ────────────────────────────────────────────────────────────
function init(c){
  var root=document.querySelector('.ov-se'); if(!root) return;
  _activePane='overview';
  root.querySelectorAll('.ov-subtab').forEach(function(b){
    b.onclick=function(){
      root.querySelectorAll('.ov-subtab').forEach(function(x){ x.classList.toggle('active', x===b); });
      root.querySelectorAll('.ov-pane').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-seapane')===b.getAttribute('data-seatab')); });
      _activePane=b.getAttribute('data-seatab');
      requestAnimationFrame(renderPane);
    };
  });
  // Timeline wiring
  var mn=root.querySelector('#ovRangeMin'), mx=root.querySelector('#ovRangeMax');
  var fill=root.querySelector('#ovRangeFill'), val=root.querySelector('#ovRangeVal'), yo=root.querySelector('#ovYoY'), tk=root.querySelector('#ovRangeTicks');
  if(mn){
    var th=''; for(var y=Y0;y<=Y1;y++){ th+='<span>'+"'"+String(y).slice(2)+(y>=2026?'E':'')+'</span>'; } tk.innerHTML=th;
    var paint=function(){
      var lo=Math.min(+mn.value,+mx.value), hi=Math.max(+mn.value,+mx.value);
      _yrStart=lo; _yrEnd=hi;
      var pa=(lo-Y0)/(Y1-Y0)*100, pb=(hi-Y0)/(Y1-Y0)*100;
      fill.style.left=pa+'%'; fill.style.width=(pb-pa)+'%';
      val.textContent=lblYr(lo,lo>=2026,false)+' – '+lblYr(hi,hi>=2026,false);
    };
    var onIn=function(){ paint(); renderPane(); };
    mn.oninput=onIn; mx.oninput=onIn;
    yo.onchange=function(){ _showYoY=yo.checked; renderPane(); };
    paint();
  }
  requestAnimationFrame(renderPane);
}

export var seaOverview = { html: html, init: init };
