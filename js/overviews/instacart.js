// overviews/instacart.js — custom Overview for Instacart / Maplebear Inc. (NASDAQ: CART)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
// Hybrid structure: SEA-style chapters (sub-tabs) + Visa/Mastercard-style transaction
// dynamics (a multi-sided model + a "walk an order" flow showing who earns when).
// Four chapters: Overview · Marketplace · Advertising · Enterprise.
// Headline figures are approximate FY2024 and marked to refresh; time-series charts
// are placeholders pending the team's data. CART has a Summit DCF model — financials
// can be wired in later the same way as Mastercard's Financials tab.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: CART'],
  ['Legal name', 'Maplebear Inc.'],
  ['Founded', '2012'],
  ['IPO', 'Sep 2023 · $30.00'],
  ['HQ', 'San Francisco, CA'],
  ['CEO', 'Chris Rogers (2025–)'],
];
var DESC = 'Instacart (legally Maplebear Inc.) is <b>North America\'s leading grocery-technology platform</b>. It runs two connected motions: a consumer <b>Marketplace</b> — an app to order groceries from <b>~1,800 retail banners / 85,000+ stores</b>, fulfilled by a gig <b>shopper</b> network — and <b>Instacart Platform (Enterprise)</b>, the white-label e-commerce, fulfillment, ads and insights tech that powers retailers\' <i>own</i> websites and apps. Riding on top is a large, fast-growing and <b>high-margin Advertising</b> business, where <b>CPG brands</b> pay to be discovered at the point of purchase. Instacart does not own inventory or stores — it sits in the middle of a <b>multi-sided network</b> (consumers, retailers, shoppers, advertisers) and earns <b>transaction fees</b> on the volume it enables plus <b>advertising</b> on the demand it creates.';

var KPIS = [
  { l:'GTV (FY25)',          v:'$37.2B', d:'+11% YoY',                   dir:'up' },
  { l:'Orders (FY25)',       v:'339M',   d:'+12% YoY',                   dir:'up' },
  { l:'Advertising & other', v:'$1.08B', d:'~2.9% of GTV · high-margin', dir:'up' },
  { l:'Adj. EBITDA (FY25)',  v:'$1.09B', d:'profitable & scaling',       dir:'up' },
];
var AS_OF = 'Headline figures are <b>FY2025</b> actuals (fiscal year = calendar year), from the Summit DCF model. <b>GTV</b> = Gross Transaction Value (the dollar value of orders + fees flowing through the marketplace). Instacart reports revenue in two lines — <b>Transaction revenue</b> and <b>Advertising &amp; other revenue</b>; the three "motions" below (Marketplace / Advertising / Enterprise) are the strategic view. See the <b>Financials</b> tab for the historical KPI charts.';

var HOW_MONEY = [
  '<b>Not a grocer:</b> Instacart owns <b>no inventory and no stores</b>. It provides the technology, demand and fulfillment that connect shoppers, retailers and brands — and never takes grocery inventory risk.',
  '<b>Transaction revenue (the base):</b> fees from <b>retailers</b> (for the orders and tech it provides) and from <b>consumers</b> (service &amp; delivery fees), earned as a take of GTV. Includes both the Marketplace and the Enterprise platform.',
  '<b>Advertising &amp; other (the margin engine):</b> <b>CPG brands</b> pay for sponsored products, displays and premium placement at the moment of purchase — high-margin and growing faster than transactions. ~30% of revenue on ~3-4% of GTV.',
  '<b>Walk an order:</b> tap a party in the network below to see its role, then press Play to follow a single grocery order and see who earns at each step.',
];

// ─── Multi-sided network (hub) — parties & roles ─────────────────────────────
var PARTIES = [
  { k:'cust',  ic:'🛒', l:'Consumer',      s:'orders & pays fees' },
  { k:'shop',  ic:'🚗', l:'Shopper',       s:'picks & delivers' },
  { k:'ret',   ic:'🏬', l:'Retailer',      s:'sells the groceries' },
  { k:'brand', ic:'🏷️', l:'CPG brand',     s:'pays for ads' },
];
var PARTY_DETAIL = {
  cust:  { t:'Consumer', h:'The household placing the order. Pays for the groceries plus a <b>service fee</b>, <b>delivery fee</b> and <b>tip</b> (the tip passes through to the shopper). <b>Instacart+</b> members pay an annual fee to waive delivery on eligible orders — they order more often and with larger baskets.' },
  shop:  { t:'Shopper — the gig fulfillment network', h:'An independent contractor who shops the items in-store and delivers them. <b>Paid by Instacart</b> (a cost of fulfillment) plus the customer\'s tip. The shopper network is what lets Instacart serve tens of thousands of stores without owning logistics.' },
  ret:   { t:'Retailer', h:'The grocery banner (Kroger, Costco, Sprouts, etc.). Sells its own inventory and keeps the grocery margin. On the <b>Marketplace</b> it pays Instacart a fee for the demand &amp; fulfillment; on <b>Enterprise</b> it pays Instacart to power its own e-commerce. ~1,800 banners across 85,000+ stores.' },
  brand: { t:'CPG brand — the advertiser', h:'Consumer-packaged-goods brands (and increasingly others) that pay Instacart to be <b>discovered at the point of purchase</b> — sponsored products, displays, coupons. The highest-margin revenue and the main reason a unit of GTV is worth more over time. 6,000+ active advertisers.' },
  ic:    { t:'Instacart — the platform', h:'Sits in the middle of all four. Earns <b>transaction fees</b> (from retailers &amp; consumers) and <b>advertising</b> (from brands), and <b>pays the shopper</b>. Owns no inventory, no stores, no trucks — it monetizes the <b>data and demand</b> created when these parties interact.' },
};

var FLOW_NODES = [
  { k:'cust', ic:'🛒', l:'Consumer' }, { k:'brand', ic:'🏷️', l:'CPG brand' }, { k:'ic', ic:'🥕', l:'Instacart' }, { k:'ret', ic:'🏬', l:'Retailer' }, { k:'shop', ic:'🚗', l:'Shopper' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A ~$110 grocery order on Instacart. Press <b>Play</b> to follow the order and see where each party earns (or pays).', earn:'', earnType:'none' },
  { t:'1 · Browse + discovery', on:['cust','ic','brand'], cap:'The consumer opens the app and sees a retailer\'s catalog — interleaved with <b>sponsored products</b> from CPG brands.', earn:'Advertising meters start: a <b>brand</b> pays Instacart when its sponsored product is shown / clicked / bought. <b>High-margin ad revenue → INSTACART.</b>', earnType:'ad' },
  { t:'2 · Order placed', on:['cust','ic'], cap:'The consumer checks out: items + <b>service fee</b> + <b>delivery fee</b> + <b>tip</b> (Instacart+ may waive delivery).', earn:'Instacart books <b>consumer fees</b> (service / delivery) → part of transaction revenue. The <b>tip</b> is earmarked for the shopper.', earnType:'ic' },
  { t:'3 · Shop & deliver', on:['ic','shop','ret'], cap:'A <b>shopper</b> picks the items in the retailer\'s store and delivers them to the door.', earn:'Instacart <b>PAYS the shopper</b> (a fulfillment cost) and passes through the tip. This is the main cost of an order.', earnType:'cost' },
  { t:'4 · Retailer fulfilled', on:['ret','ic'], cap:'The <b>retailer</b> sells its groceries for the order; it pays Instacart for the demand &amp; fulfillment (Marketplace) or for the tech (Enterprise).', earn:'Instacart books the <b>retailer fee</b> → the other half of transaction revenue. The retailer keeps its <b>grocery margin</b>.', earnType:'ic' },
  { t:'5 · Who got what', on:['cust','brand','ic','ret','shop'], cap:'The consumer got delivery; the retailer sold groceries; the shopper got paid + tip.', earn:'<b>Instacart earns transaction revenue (consumer + retailer fees) + high-margin advertising</b>, minus what it pays the shopper. Thin per-order economics × scale + a rich ad layer = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Instacart earns most when an order carries <b>advertising</b> on top of the transaction — a brand paying to be discovered is far higher-margin than the delivery fee itself. That is why <b>more orders → more shopper/retailer/consumer data → a more valuable ad network</b>, which is the real profit engine (see Advertising).';

// ─── Revenue structure: the three motions ────────────────────────────────────
var SEGMENTS = [
  { k:'mkt', n:'Marketplace', accent:'#0AAD0A', rev:'consumer app', margin:'the demand engine',
    subs:[
      { k:'mkt-tx', n:'Transaction fees', rev:'% of GTV',
        what:'Fees from <b>retailers</b> (for demand &amp; fulfillment) and <b>consumers</b> (service &amp; delivery) on orders placed in the Instacart app.',
        monetizes:'A take of <b>GTV</b>; grows with orders × basket size. Instacart owns the customer relationship here.',
        products:[{n:'Retailer fees', d:'Paid by the grocery banner for orders Instacart drives & fulfills.'},{n:'Consumer fees', d:'Service + delivery fees (waived for many Instacart+ orders).'}],
        competition:'DoorDash, Uber Eats, Amazon Fresh, Walmart, retailer-direct.' },
      { k:'mkt-plus', n:'Instacart+ membership', rev:'subscription',
        what:'A paid annual membership that waives delivery on eligible orders and adds perks.',
        monetizes:'Recurring subscription + <b>higher frequency &amp; larger baskets</b> from members (more GTV and ad inventory).',
        products:[{n:'Membership fee', d:'Annual/-monthly recurring revenue.'},{n:'Loyalty lift', d:'Members order more often → more GTV & ads.'}],
        competition:'Amazon Prime, Walmart+.' },
    ] },
  { k:'ads', n:'Advertising & Other', accent:'#FF7009', rev:'~30% of revenue', margin:'the margin engine',
    subs:[
      { k:'ads-sp', n:'Sponsored products', rev:'highest-margin',
        what:'CPG brands pay to appear when shoppers search/browse — <b>discovery at the point of purchase</b>, with closed-loop attribution (the ad and the sale are the same session).',
        monetizes:'Auction-based ad spend; very <b>high gross margin</b> and growing faster than transactions. The single biggest profit driver.',
        products:[{n:'Sponsored product', d:'Promoted items in search & browse.'},{n:'Displays & coupons', d:'Banners, featured deals, digital coupons.'}],
        competition:'Amazon Ads, retail-media networks (Walmart Connect, Kroger).' },
      { k:'ads-other', n:'Insights & other', rev:'data products',
        what:'Selling brands and retailers <b>data, measurement and insights</b> on what sells and why.',
        monetizes:'Subscriptions / managed services; deepens advertiser stickiness.',
        products:[{n:'Measurement', d:'Closed-loop ad attribution & analytics.'},{n:'Audience tools', d:'Targeting and campaign optimization.'}],
        competition:'Retail-media measurement vendors.' },
    ] },
  { k:'ent', n:'Enterprise — Instacart Platform', accent:'#3A7BD5', rev:'embedded in transactions', margin:'strategic / sticky',
    subs:[
      { k:'ent-store', n:'White-label storefront', rev:'tech fees',
        what:'Instacart powers the <b>retailer\'s own</b> website/app e-commerce — the retailer (not Instacart) owns the customer.',
        monetizes:'Platform/usage fees; lower take than Marketplace but <b>strategically sticky</b> and defends against retailers leaving.',
        products:[{n:'Storefront / Storefront Pro', d:'Retailer-branded e-commerce.'},{n:'Fulfillment as a service', d:'Picking & delivery on the retailer\'s own orders.'}],
        competition:'DoorDash Drive, Uber Direct, in-house builds.' },
      { k:'ent-tech', n:'In-store & ads tech (Carrot)', rev:'tech suite',
        what:'The "Carrot" technology suite: <b>smart carts (Caper)</b>, electronic shelf labels, in-store fulfillment and the retailer\'s own ad tools.',
        monetizes:'Hardware + software fees; extends Instacart from online into the <b>physical store</b>.',
        products:[{n:'Caper Carts', d:'AI smart shopping carts.'},{n:'Carrot Ads / Tags', d:'Retailer-run ads + e-shelf labels.'}],
        competition:'Amazon (Just Walk Out), Shopic, in-house.' },
    ] },
];

// ─── Unit economics of one order ─────────────────────────────────────────────
var UE_STATS = [
  { v:'~$110', l:'GTV per order', s:'items + fees in a typical basket' },
  { v:'~7-8%', l:'Transaction take', s:'retailer + consumer fees ÷ GTV' },
  { v:'~3-4%', l:'Ad take (of GTV)', s:'highest-margin layer, on top' },
];
var UE_BULLETS = [
  '<b>Transaction revenue</b> ≈ a single-digit % of the ~$110 order — split between the <b>retailer fee</b> and <b>consumer fees</b> (service/delivery).',
  '<b>The big cost</b> is paying the <b>shopper</b> to pick and deliver; that, plus payment and support, is most of the cost of an order.',
  '<b>Advertising is where the margin is.</b> A few % of GTV in ad spend carries very high gross margin and turns a thin-margin delivery into a profitable order — so the <b>ad attach rate</b> is the metric that matters most.',
  '<b>Larger baskets help everything</b>: fixed fulfillment cost is spread over more items, take rate holds, and there is more to advertise against — why Instacart+ members (bigger, more frequent baskets) are so valuable.',
];

// ─── Customer types (who pays Instacart) ─────────────────────────────────────
var CUSTOMERS = [
  ['Consumers', 'Households ordering groceries — especially <b>larger-basket, suburban</b> and <b>Instacart+</b> members who order weekly. They pay fees (and tips to shoppers).'],
  ['Retailers', '~<b>1,800 banners / 85,000+ stores</b>. Pay for marketplace demand & fulfillment, or for the Enterprise tech to run their own e-commerce.'],
  ['CPG advertisers', '<b>6,000+ brands</b> paying to be discovered at the point of purchase — the highest-margin customer and the fastest-growing.'],
  ['Shoppers', 'Not a payer but the <b>fulfillment supply</b>: the gig network Instacart pays to shop and deliver. Their density & reliability is a core asset.'],
];

// ─── Advertising flywheel ────────────────────────────────────────────────────
var AD_FLY = [
  ['1','More consumers & orders','Every order generates first-party purchase data — what people buy, search and substitute.'],
  ['2','A richer ad network','That data makes Instacart\'s ads more targetable and measurable (closed-loop: the ad and the sale are the same session).'],
  ['3','More brand spend','CPG brands shift budget to where it converts at the shelf → high-margin ad revenue.'],
  ['4','Subsidize the marketplace','Ad profit funds better prices, perks and selection → more consumers and orders, and the loop compounds.'],
];

// ─── Enterprise deep dive ────────────────────────────────────────────────────
var ENTERPRISE = [
  '<b>What it is:</b> the same technology that runs Instacart\'s own app, sold to retailers to power <b>their own</b> e-commerce, fulfillment, ads and in-store tech — the retailer keeps the customer relationship.',
  '<b>Why it matters:</b> it turns a potential competitor (a retailer wanting its own online channel) into a <b>customer</b>, and embeds Instacart deep in the retailer\'s operations — a defensive, sticky moat even if Marketplace economics are lower.',
  '<b>From online to the aisle:</b> via the <b>Carrot</b> suite (Caper smart carts, electronic shelf labels, in-store fulfillment) Instacart now reaches the <b>physical store</b>, not just delivery — expanding the addressable market well beyond online grocery.',
];

// ─── Tailwinds / Headwinds ───────────────────────────────────────────────────
var TAILWINDS = [
  '<b>Low online-grocery penetration.</b> Online is still a low-teens % of US grocery — <i>mechanism:</i> a long runway as more of a huge, frequent, non-discretionary category moves online.',
  '<b>Advertising compounding.</b> Retail media is one of the fastest-growing ad pools, and Instacart has closed-loop, point-of-purchase data — <i>mechanism:</i> high-margin ad revenue grows faster than transactions and lifts whole-company margins.',
  '<b>Enterprise + in-store (Carrot).</b> Powering retailers\' own channels and physical stores — <i>mechanism:</i> widens the moat and the addressable market beyond Instacart\'s own app.',
];
var HEADWINDS = [
  '<b>Intense competition.</b> DoorDash, Uber Eats, and especially <b>Amazon and Walmart</b> (own logistics + scale) — <i>mechanism:</i> pressure on take rate, consumer fees and retailer loyalty.',
  '<b>Gig-labor regulation.</b> Worker-classification rules can raise shopper costs — <i>mechanism:</i> the largest cost line is fulfillment, so reclassification risk hits unit economics directly.',
  '<b>Thin grocery economics & retailer concentration.</b> Low category margins and dependence on a few large banners — <i>mechanism:</i> a big retailer leaving (or building in-house) can move volume materially.',
];

var SOURCES = 'Sources: Instacart (Maplebear Inc., NASDAQ: CART) — KPI &amp; financial charts (GTV, orders, transaction &amp; advertising revenue, adjusted EBITDA) are <b>historical actuals from the Summit DCF model (FY2021–2025)</b>; qualitative content from public filings &amp; investor materials (10-K / quarterly results, S-1). Some segment splits are the strategic view, not the two reported revenue lines. Forecast years are excluded by design.';

// ─── KPIs & Financials (HISTORICAL ONLY, from the Summit DCF model) ──────────
// Annual; $ in USD millions, orders in millions. We deliberately use ACTUALS
// ONLY (FY2021–2025): the stored Summit DCF doesn't carry complete/reliable
// forecasts (several series leave future years blank), so we treat the DCF as a
// source of history, not projections. Source: Summit DCF for CART
// (GTV / ORD / TRANSACTION_REVENUE / ADVERTISING_REVENUE / EBITDA_ADJ).
var FIN_YEARS = [2021, 2022, 2023, 2024, 2025];
var fB = function(v){ return v==null ? '—' : '$'+(v/1000).toFixed(1)+'B'; };
var fM = function(v){ return v==null ? '—' : Math.round(v)+'M'; };
var FIN_SERIES = {
  finGTV:    { label:'GTV', unit:'$B', fmt:fB, type:'bar', color:'#0AAD0A', data:[24909,28826,31986,33646,37225] },
  finORD:    { label:'Orders', unit:'M', fmt:fM, type:'bar', color:'#3A7BD5', data:[223,263,295,302,339] },
  finMix:    { label:'Revenue — Transaction vs Advertising', unit:'$B', fmt:fB, type:'stack',
               stack:[ {name:'Transaction', color:'#0AAD0A', data:[1262,1935,2239,2420,2677]},
                       {name:'Advertising', color:'#FF7009', data:[572,740,871,958,1079]} ] },
  finEbitda: { label:'Adjusted EBITDA', unit:'$B', fmt:fB, type:'bar', color:'#7A8699', data:[null,207,641,885,1087] },
};
var FIN_INTRO = 'Instacart\'s KPIs &amp; financials — <b>historical actuals (FY2021–2025)</b>, pulled from the <b>Summit DCF model</b>. Forecast years are intentionally excluded (the stored model\'s projections aren\'t complete/reliable), so this shows reported history only.';
var FIN_NOTE  = 'GTV &amp; revenue in USD billions; orders in millions. Source: Summit DCF for CART (actuals). The <b>Transaction vs Advertising</b> split shows the high-margin ad engine rising as a share of revenue. Adj. EBITDA starts in 2022 (2021 pre-profitability). Reads from the model, not hand-typed.';
var C_AXIS='#8A93A0', C_GRID='#EEF2F7', _finCharts={};

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }
function snap(arr){ return '<div class="ov-snap">'+arr.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'; }
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div><div class="ov-statline" id="stat-'+id+'"></div></div>';
}
function makeFin(id){
  var s=FIN_SERIES[id]; var cv=document.getElementById(id); if(!cv) return;
  var labels=FIN_YEARS.map(String), datasets;
  if(s.type==='stack'){
    datasets=s.stack.map(function(d){ return { label:d.name, data:d.data, backgroundColor:d.color, borderRadius:4, stack:'s', maxBarThickness:46 }; });
  } else {
    datasets=[{ data:s.data, backgroundColor:s.color, borderRadius:5, maxBarThickness:46 }];
  }
  _finCharts[id]=new Chart(cv.getContext('2d'), { type:'bar', data:{labels:labels, datasets:datasets},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{ display:s.type==='stack', position:'bottom', labels:{boxWidth:10,font:{size:10},color:C_AXIS} },
        tooltip:{ callbacks:{
          label:function(ctx){ return ' '+(s.type==='stack'?ctx.dataset.label+': ':'')+s.fmt(ctx.parsed.y); },
          footer:(s.type==='stack' ? function(items){ var t=0; items.forEach(function(i){ t+=i.parsed.y; }); return 'Total: '+s.fmt(t); } : undefined) } } },
      scales:{ x:{ stacked:s.type==='stack', grid:{display:false}, ticks:{color:C_AXIS,font:{size:10}} },
               y:{ stacked:s.type==='stack', grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:s.fmt} } } }
  });
  var el=document.getElementById('stat-'+id); if(!el) return;
  var vals = s.type==='stack' ? FIN_YEARS.map(function(_,i){ return s.stack.reduce(function(a,d){ return a+(d.data[i]||0); },0); }) : s.data;
  var idxs=[]; for(var i=0;i<vals.length;i++) if(vals[i]!=null && vals[i]!==0) idxs.push(i);
  if(idxs.length>=2){ var fi=idxs[0],li=idxs[idxs.length-1],a=vals[fi],z=vals[li],yrs=FIN_YEARS[li]-FIN_YEARS[fi];
    var cagr=(Math.pow(z/a,1/(yrs||1))-1)*100;
    el.innerHTML='<b>'+FIN_YEARS[fi]+'</b> '+s.fmt(a)+' → <b>'+FIN_YEARS[li]+'</b> '+s.fmt(z)+' · CAGR <span class="'+(cagr>=0?'pos':'neg')+'">'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</span>'; }
}
function renderFin(){ if (typeof Chart==='undefined') return; Object.keys(_finCharts).forEach(function(id){ try{_finCharts[id].destroy();}catch(e){} }); _finCharts={}; Object.keys(FIN_SERIES).forEach(makeFin); }
function subDetailHtml(s){
  return '<div class="ov-sub-line"><b>What it is.</b> '+s.what+'</div>'+
    '<div class="ov-sub-mon"><b>How it monetizes:</b> '+s.monetizes+'</div>'+
    (s.products && s.products.length ? '<div class="ov-subh" style="margin-top:14px">Inside it</div><div class="ov-prod">'+s.products.map(function(p){ return '<div class="ov-prod-tile"><div class="ov-prod-n">'+esc(p.n)+'</div><div class="ov-prod-d">'+p.d+'</div></div>'; }).join('')+'</div>' : '')+
    (s.competition ? '<div class="ov-sub-comp"><b>Competition:</b> '+s.competition+'</div>' : '');
}
function pillarCards(segKey){
  var seg = SEGMENTS.filter(function(s){ return s.k===segKey; })[0]; if(!seg) return '';
  return '<div class="ov-cards">'+seg.subs.map(function(s){
    return '<div class="ov-card ov-clickable" data-detail="sub:'+esc(s.k)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(s.n)+'</span><span class="ov-chip">'+esc(s.rev)+'</span></div>'+
      '<div class="ov-card-s">'+s.what+'</div><div class="ov-more">How it monetizes ›</div></div>';
  }).join('')+'</div>';
}
function hubHtml(){
  return '<div class="ov-hub"><div class="ov-hub-center">'+
    '<div class="ov-hub-box ov-clickable" data-detail="party:ic">🥕 Instacart</div><div class="ov-hub-stem"></div></div>'+
    '<div class="ov-hub-nodes">'+PARTIES.map(function(p){
      return '<div class="ov-hub-node ov-clickable" data-detail="party:'+p.k+'"><div class="ov-hub-ic">'+p.ic+'</div><div class="ov-hub-l">'+esc(p.l)+'</div><div class="ov-hub-s">'+esc(p.s)+'</div></div>';
    }).join('')+'</div></div>';
}
function flowHtml(){
  return '<div class="ov-flow" id="ovFlow">'+
    '<div class="ov-flow-nodes">'+FLOW_NODES.map(function(n){ return '<div class="ov-flow-node" data-node="'+n.k+'"><div class="ov-flow-ic">'+n.ic+'</div><div class="ov-flow-l">'+esc(n.l)+'</div></div>'; }).join('<span class="ov-flow-link">→</span>')+'</div>'+
    '<div class="ov-flow-stage"><span class="ov-flow-step" id="ovFlowStep">Setup</span><div class="ov-flow-cap" id="ovFlowCap">'+FLOW_STEPS[0].cap+'</div>'+
      '<div class="ov-flow-earn" id="ovFlowEarn" hidden></div></div>'+
    '<div class="ov-flow-ctrl">'+
      '<button class="ov-flow-btn" id="ovFlowPlay">▶ Play</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowPrev">‹ Prev</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowNext">Next ›</button>'+
      '<div class="ov-flow-dots" id="ovFlowDots">'+FLOW_STEPS.map(function(s,i){ return '<span class="ov-flow-dot'+(i===0?' on':'')+'" data-i="'+i+'"></span>'; }).join('')+'</div>'+
    '</div><div class="ov-flow-note">'+FLOW_NOTE+'</div></div>';
}

function html(c){
  var h = '<div class="ov ov-cart" data-brand="CART">';

  h += '<div class="ov-subtabs">'+
    '<button class="ov-subtab active" data-catab="overview">Overview</button>'+
    '<button class="ov-subtab" data-catab="marketplace">Marketplace</button>'+
    '<button class="ov-subtab" data-catab="advertising">Advertising</button>'+
    '<button class="ov-subtab" data-catab="enterprise">Enterprise</button>'+
    '<button class="ov-subtab" data-catab="fin">Financials</button>'+
  '</div>';

  // ══ PANE 1 — Overview ══
  h += '<div class="ov-pane active" data-capane="overview">';
  h += snap(SNAPSHOT);
  h += '<p class="ov-lede">'+DESC+'</p>';
  h += kpis(KPIS);
  h += '<div class="ov-asof">'+AS_OF+'</div>';
  h += sec('How Instacart Makes Money',
    bullets(HOW_MONEY)+
    '<div class="ov-diagram-cap" style="margin:4px 0 10px"><b>The multi-sided network.</b> Tap any party for its role.</div>'+hubHtml()+flowHtml());
  h += sec('Revenue Structure — Three Motions',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Reported as <b>Transaction</b> + <b>Advertising &amp; other</b> revenue; shown here as the three strategic motions. <b>Tap any line</b> for detail.</div>'+
    '<div class="ov-segmap">'+SEGMENTS.map(function(seg){
      return '<div class="ov-segpanel" style="border-top-color:'+seg.accent+'">'+
        '<div class="ov-segpanel-h"><div class="ov-segpanel-n">'+esc(seg.n)+'</div><div class="ov-segpanel-m">'+esc(seg.rev)+' · '+esc(seg.margin)+'</div></div>'+
        '<div class="ov-segnodes">'+seg.subs.map(function(s){ return '<div class="ov-segnode ov-clickable" data-detail="sub:'+esc(s.k)+'"><span class="ov-segnode-n">'+esc(s.n)+'</span><span class="ov-segnode-r">'+esc(s.rev)+'</span></div>'; }).join('')+'</div></div>';
    }).join('')+'</div>');
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div></div>');
  h += '</div>'; // end overview

  // ══ PANE 2 — Marketplace ══
  h += '<div class="ov-pane" data-capane="marketplace">';
  h += '<p class="ov-lede">The <b>Marketplace</b> is Instacart\'s consumer app — it owns the customer relationship and is the demand engine that feeds advertising. It monetizes a take of <b>GTV</b> (retailer + consumer fees) plus the <b>Instacart+</b> membership.</p>';
  h += sec('Marketplace Lines', pillarCards('mkt'));
  h += sec('Unit Economics of an Order',
    '<div class="ov-corr-stats">'+UE_STATS.map(function(s){ return '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(s.v)+'</div><div class="ov-corr-l">'+esc(s.l)+'<br><span style="font-weight:400">'+esc(s.s)+'</span></div></div>'; }).join('')+'</div>'+
    '<div class="ov-callout" style="margin-top:14px">'+bullets(UE_BULLETS)+'</div>');
  h += sec('Who Uses Instacart — Customer Types',
    '<div class="ov-cards ov-cards-mna">'+CUSTOMERS.map(function(cu){ return '<div class="ov-card"><div class="ov-card-h"><span class="ov-card-n">'+esc(cu[0])+'</span></div><div class="ov-card-s">'+cu[1]+'</div></div>'; }).join('')+'</div>');
  h += '</div>'; // end marketplace

  // ══ PANE 3 — Advertising ══
  h += '<div class="ov-pane" data-capane="advertising">';
  h += '<p class="ov-lede"><b>Advertising</b> is the margin engine: CPG brands pay to be discovered at the point of purchase, with <b>closed-loop attribution</b> (the ad and the sale happen in the same session). ~30% of revenue on ~3-4% of GTV, very high-margin and growing faster than transactions.</p>';
  h += sec('Advertising Lines', pillarCards('ads'));
  h += sec('The Advertising Flywheel',
    '<div class="ov-fly">'+AD_FLY.map(function(f){ return '<div class="ov-fly-item"><div class="ov-fly-num" style="background:#FF70091A;color:#FF7009">'+esc(f[0])+'</div><div class="ov-fly-h">'+esc(f[1])+'</div><div class="ov-fly-p">'+esc(f[2])+'</div></div>'; }).join('')+'</div>');
  h += '</div>'; // end advertising

  // ══ PANE 4 — Enterprise ══
  h += '<div class="ov-pane" data-capane="enterprise">';
  h += '<p class="ov-lede"><b>Instacart Platform (Enterprise)</b> sells Instacart\'s own technology to retailers to power <b>their</b> e-commerce, fulfillment, ads and in-store tech — the retailer keeps the customer. Lower take than the Marketplace, but strategically sticky and a defensive moat.</p>';
  h += sec('Why Enterprise Matters', '<div class="ov-callout">'+bullets(ENTERPRISE)+'</div>');
  h += sec('Enterprise Lines', pillarCards('ent'));
  h += '<div class="ov-fynote">Marketplace vs Enterprise, in one line: in the <b>Marketplace</b> Instacart owns the consumer and earns a full take + ads; in <b>Enterprise</b> the retailer owns the consumer and Instacart earns a smaller tech fee — trading take rate for reach and stickiness.</div>';
  h += '</div>'; // end enterprise

  // ══ PANE 5 — Financials (historical KPIs from the DCF) ══
  h += '<div class="ov-pane" data-capane="fin">';
  h += '<p class="ov-lede">'+FIN_INTRO+'</p>';
  h += '<div class="ov-charts ov-charts-2">'+
    finCard('finGTV','GTV','FY21–FY25 · $B')+
    finCard('finORD','Orders','FY21–FY25 · M')+
    finCard('finMix','Revenue mix','Transaction vs Advertising · $B')+
    finCard('finEbitda','Adjusted EBITDA','FY22–FY25 · $B')+
  '</div>';
  h += '<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  h += '</div>'; // end fin pane

  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  h += '<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';
  h += '</div>';
  return h;
}

function init(c){
  var root = document.querySelector('.ov-cart'); if (!root) return;

  // Sub-tab switching
  root.querySelectorAll('.ov-subtab').forEach(function(b){
    b.onclick = function(){
      root.querySelectorAll('.ov-subtab').forEach(function(x){ x.classList.toggle('active', x===b); });
      var tab = b.getAttribute('data-catab');
      root.querySelectorAll('.ov-pane').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-capane')===tab); });
      if (tab==='fin') requestAnimationFrame(renderFin); // charts need a visible (sized) canvas
    };
  });

  // Modal
  var back = root.querySelector('#ovModalBack'), mT = root.querySelector('#ovModalT'), mB = root.querySelector('#ovModalB');
  function openModal(t, b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeModal(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function onEsc(e){ if (e.key==='Escape') closeModal(); }
  root.querySelector('#ovModalX').onclick = closeModal;
  back.onclick = function(e){ if (e.target===back) closeModal(); };
  function findSub(id){ var hit=null; SEGMENTS.forEach(function(seg){ seg.subs.forEach(function(s){ if(s.k===id) hit=s; }); }); return hit; }
  function resolve(key){
    var parts=key.split(':'), kind=parts[0], id=parts.slice(1).join(':');
    if (kind==='party'){ var p=PARTY_DETAIL[id]; return p && { t:p.t, h:p.h }; }
    if (kind==='sub'){ var s=findSub(id); return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:subDetailHtml(s) }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.addEventListener('click', function(){ var d=resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });

  // Flow animation
  var flow = root.querySelector('#ovFlow');
  if (flow){
    var idx=0, timer=null;
    var nodes=flow.querySelectorAll('.ov-flow-node');
    var stepEl=flow.querySelector('#ovFlowStep'), capEl=flow.querySelector('#ovFlowCap'), earnEl=flow.querySelector('#ovFlowEarn');
    var dots=flow.querySelectorAll('.ov-flow-dot'), playBtn=flow.querySelector('#ovFlowPlay');
    function apply(i){
      idx=i; var s=FLOW_STEPS[i];
      nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node'))!==-1); });
      stepEl.textContent=s.t; capEl.innerHTML=s.cap;
      if (s.earn){ earnEl.hidden=false; earnEl.className='ov-flow-earn earn-'+s.earnType; earnEl.innerHTML=s.earn; } else { earnEl.hidden=true; }
      dots.forEach(function(d, di){ d.classList.toggle('on', di===i); });
    }
    function stop(){ if (timer){ clearInterval(timer); timer=null; } playBtn.textContent='▶ Play'; }
    function play(){ if (timer){ stop(); return; } if (idx>=FLOW_STEPS.length-1) apply(0); playBtn.textContent='❚❚ Pause'; timer=setInterval(function(){ if (idx>=FLOW_STEPS.length-1){ stop(); return; } apply(idx+1); }, 2600); }
    playBtn.onclick=play;
    flow.querySelector('#ovFlowPrev').onclick=function(){ stop(); apply(Math.max(0, idx-1)); };
    flow.querySelector('#ovFlowNext').onclick=function(){ stop(); apply(Math.min(FLOW_STEPS.length-1, idx+1)); };
    dots.forEach(function(d){ d.onclick=function(){ stop(); apply(parseInt(d.getAttribute('data-i'),10)); }; });
    apply(0);
  }
}

export var instacartOverview = { html: html, init: init };
