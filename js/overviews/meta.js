// overviews/meta.js — custom Overview for Meta Platforms, Inc. (NASDAQ: META)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model for META (actuals_history sheet, snapshot
// 2026-05-22). HISTORICAL ONLY — the model's projection_history out-years are
// unreliable for META (e.g. 2028 revenue prints ~$3B), so per the team's DCF
// policy we chart reported ACTUALS (FY2019–FY2025) and exclude forecast years.
// Qualitative content: Meta 10-Ks, quarterly results & earnings calls. No live API
// except the shared get-quote price banner.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting ──────────────────────────────────────────────────────────────
function money(m){ if(m==null) return '—'; var neg=m<0,a=Math.abs(m),s;
  if(a>=1000) s='$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; else s='$'+Math.round(a)+'M'; return (neg?'−':'')+s; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }
function cagr(v0,v1,yrs){ if(v0==null||v1==null||v0<=0||v1<=0||yrs<=0) return null; return (Math.pow(v1/v0,1/yrs)-1)*100; }

// ─── Brand: Meta blue + Reality Labs accent ──────────────────────────────────
var BRAND='#0866FF', BRAND2='#1877F2', FOA='#0866FF', RL='#8B5CF6', GRAY='#B8C0CA', NEG='#C0392B';

// ─── Annual ACTUALS (FY2019..FY2025), USD millions ───────────────────────────
var YEARS  = ['2019','2020','2021','2022','2023','2024','2025'];
var REV    = [70697, 85965, 117929, 116609, 134902, 164501, 200966];
var OPINC  = [23986, 32671, 46753, 28945, 46751, 69380, 83276];
var FCF    = [21212, 23584, 38993, 19044, 43847, 54072, 46109];
var CAPEX  = [15102, 15163, 18690, 31431, 27266, 37256, 69691]; // cash capex (outflow, shown positive)
var ADV    = [69655, 84169, 114934, 113641, 131948, 160632, 196174];
// Segment split — clean from FY2021 (FoA vs Reality Labs).
var SEG_YEARS = ['2021','2022','2023','2024','2025'];
var FOA_REV = [115655, 114450, 133005, 162354, 198758];
var RL_REV  = [2274, 2159, 1896, 2146, 2207];
var FOA_OP  = [56947, 42662, 62870, 87109, 102469];
var RL_OP   = [-10194, -13717, -15849, -17729, -19193];
var RL_CUM  = 78781; // cumulative Reality Labs operating loss 2020–2025 (~$78.8B)

var OPMARGIN = OPINC.map(function(v,i){ return v/REV[i]*100; });

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT=[
  ['Listing','NASDAQ: META'],['Founded','2004 — Cambridge, MA'],['IPO','May 2012 · $38.00'],
  ['CEO','Mark Zuckerberg (founder)'],['Segments','Family of Apps · Reality Labs'],['Control','Dual-class — founder voting control'],
];
var DESC='Meta runs the world\'s largest social-advertising network — Facebook, Instagram, WhatsApp, Messenger and Threads (the "Family of Apps", ~3.4B daily users) — monetized almost entirely by AI-targeted advertising. A second segment, Reality Labs, invests heavily in AR/VR and AI hardware at large operating losses. The thesis: an AI-supercharged ad engine throwing off enormous cash, funding a costly, long-dated bet on the next computing platform.';
var KPIS=[
  { l:'Revenue',          v:'$201B', d:pctStr((REV[6]/REV[5]-1)*100)+' YoY',  dir:'up' },
  { l:'Operating Income', v:'$83.3B',d:'~41% op margin',                       dir:'up' },
  { l:'Free Cash Flow',   v:'$46.1B',d:'after record capex',                   dir:'up' },
  { l:'Capex',            v:'$69.7B',d:pctStr((CAPEX[6]/CAPEX[5]-1)*100)+' YoY · AI build', dir:'down' },
];
var AS_OF='Headline KPIs are FY2025 (reported). Revenue $201.0B (+22%), operating income $83.3B (~41% margin), free cash flow $46.1B, and a record $69.7B of capex (+87% YoY) as Meta scales AI infrastructure. ~3.4B daily active people across the Family of Apps.';
var FY_NOTE='Two engines inside one company: <b>Family of Apps</b> (FB, IG, WhatsApp, Messenger, Threads) generates essentially all revenue and ~$102B of segment operating profit, which <b>funds Reality Labs</b> — the AR/VR + metaverse bet that lost ~$19B in 2025 (~$79B cumulative since 2020). Forward years are intentionally excluded: the Summit DCF\'s META projection is unreliable in the out-years, so this overview charts reported actuals only (FY2019–FY2025).';

// How Meta makes money — the ad auction, as a step chain (clickable).
var AD_FLOW=[
  { t:'A user opens Facebook / Instagram', d:'~<b>3.4B daily</b> people generate billions of ad impressions. Each impression is an <b>auction</b> held in real time — Meta\'s inventory is its attention.' },
  { t:'Advertisers bid for the impression', d:'Advertisers set a budget and a goal (a click, install, purchase). Meta runs an <b>auction</b>, not a fixed price — so pricing rises with demand and ad quality.' },
  { t:'AI ranks the auction', d:'The winner = <b>bid × estimated action rate × ad quality</b>. Meta\'s AI (Andromeda ranking, Advantage+ automation) predicts who will convert — lifting both <b>price per ad</b> and <b>conversions</b>. This is where AI directly turns into revenue.' },
  { t:'The ad is shown; advertiser pays per result', d:'Meta keeps essentially <b>all</b> of the ad revenue (no inventory cost like a marketplace) — advertising is ~<b>98%</b> of total revenue.' },
  { t:'It converts to cash at high margin', d:'Family-of-Apps operating margin is ~<b>50%+</b>; the cash funds buybacks, a dividend, and the Reality Labs + AI capex bet.', payoff:true },
];
var SEGMENTS=[
  ['Family of Apps', '<b>The cash machine.</b> Facebook, Instagram, WhatsApp, Messenger, Threads. ~$199B revenue (FY25) — ~98% advertising — at ~50%+ operating margin. Driver: <b>impressions × price per ad</b>, both lifted by AI ranking and Reels/Advantage+.'],
  ['Reality Labs', '<b>The long bet.</b> Quest VR headsets, Ray-Ban Meta smart glasses, Orion AR prototype, and the metaverse/AI-device platform. ~$2.2B revenue but a <b>~$19B operating loss (FY25)</b> — ~$79B cumulative since 2020.'],
  ['Advertising', '~98% of revenue. AI-driven targeting + auction pricing; Reels and business messaging (WhatsApp/click-to-message) are the newer growth surfaces.'],
  ['AI infrastructure', 'Not a segment but the swing cost: $69.7B capex in FY25 (+87%), guided higher — GPUs and data centers powering both the ad engine and the consumer AI assistant (Meta AI).'],
];
var TIMELINE=[
  { y:'2004', t:'<b>Facebook founded</b> by Mark Zuckerberg at Harvard.' },
  { y:'2012', t:'<b>IPO</b> on NASDAQ at $38.00; acquires <b>Instagram</b> (~$1B).',
    d:'Meta (then Facebook) IPO\'d in May 2012 at <b>$38.00</b> — a famously rocky debut that traded down sharply before the mobile-advertising pivot re-rated it. The same year it bought <b>Instagram</b> for ~$1B, one of the best acquisitions in tech history.' },
  { y:'2014', t:'Acquires <b>WhatsApp</b> (~$19B) and <b>Oculus</b> (~$2B) — messaging scale + the VR seed.',
    d:'<b>WhatsApp</b> (~$19B) brought global messaging scale (now ~3B users); <b>Oculus</b> (~$2B) seeded what became Reality Labs. Both define today\'s two-engine structure — a messaging/ads juggernaut and a hardware moonshot.' },
  { y:'2021', t:'Rebrands to <b>Meta</b>; carves out <b>Reality Labs</b> as a reported segment.',
    d:'The October 2021 rebrand to <b>Meta</b> signaled the metaverse pivot and introduced <b>Reality Labs</b> as a separate reporting segment — making its multi-billion-dollar losses visible for the first time, which framed the bull/bear debate that followed.' },
  { y:'2022', t:'<b>The crash</b> — ad recession, Apple ATT, metaverse spend; stock falls to ~$88.',
    d:'A brutal year: Apple\'s <b>App Tracking Transparency</b> (ATT) hit ad targeting (~$10B revenue headwind), a macro ad recession, TikTok competition, and surging Reality Labs spend collapsed the stock to ~$88. It set up the turnaround.' },
  { y:'2023', t:'<b>"Year of Efficiency"</b> — ~21k layoffs; margins and stock recover sharply.',
    d:'Zuckerberg declared a <b>"Year of Efficiency,"</b> cutting ~21,000 roles, flattening management and refocusing on AI and Reels. Operating margin re-expanded and the stock more than tripled off the lows.' },
  { y:'2024–26', t:'<b>AI re-rate</b> — record profit and a massive AI-capex buildout.',
    d:'AI-driven ad improvements (Andromeda, Advantage+) lifted price and conversion; revenue and profit hit records. Meta initiated its <b>first dividend</b> (2024) and ramped <b>capex toward $70B+</b> for AI infrastructure — the central debate of the current thesis: durable ROI vs. over-spend.' },
];
var PEERS=[
  ['Alphabet (Google)', 'The other ad giant — Search + YouTube.', 'The largest digital-ad rival; both are re-rating on AI. Meta owns <b>social/feed</b> attention and the best <b>direct-response</b> engine; Google owns <b>intent</b> (search). Both face the same AI-capex test.'],
  ['TikTok (ByteDance)', 'Short-video attention machine.', 'The sharpest <b>attention</b> competitor; Meta\'s answer is <b>Reels</b> (now monetizing near feed levels). A US ban/forced-sale would be a direct tailwind for Meta.'],
  ['Amazon', 'Fast-growing retail-media ad business.', 'Competes for ad budgets lower in the funnel (purchase intent); less a feed rival than a share-of-wallet one.'],
  ['Apple', 'Platform owner — not an ad peer, a <b>gatekeeper</b>.', 'ATT privacy changes structurally taxed Meta\'s targeting; Apple controls the iOS rules Meta lives under — a standing strategic risk, not a product competitor.'],
];
var TAILWINDS=[
  '<b>AI is monetizing directly:</b> Andromeda ranking + Advantage+ automation lift price-per-ad <i>and</i> conversions — AI capex showing up as ad revenue, not just cost.',
  '<b>Reels &amp; business messaging:</b> Reels monetization now near feed levels; WhatsApp/click-to-message and paid messaging are large, under-monetized surfaces.',
  '<b>Operating discipline:</b> post-"Year of Efficiency" the Family of Apps runs at ~50%+ margin — a cash machine funding everything else.',
  '<b>Optionality:</b> Threads, Meta AI (consumer assistant at scale), and Ray-Ban Meta glasses are cheap call options on the next platform.',
  '<b>Capital returns:</b> first dividend (2024) + large buybacks on top of ~$46B free cash flow.',
];
var HEADWINDS=[
  '<b>AI-capex ROI:</b> $69.7B capex (+87%) guided higher — the bet that AI infrastructure earns its cost is the single biggest debate; depreciation will pressure margins.',
  '<b>Reality Labs burn:</b> ~$19B/yr operating loss (~$79B cumulative) with no near-term path to profit — a permanent drag the market tolerates only while FoA delivers.',
  '<b>Regulatory / antitrust:</b> the <b>FTC</b> case seeking to unwind Instagram/WhatsApp, the EU <b>DMA</b>, and global privacy rules are open existential-tail risks.',
  '<b>Platform dependence:</b> Apple ATT showed a gatekeeper can tax targeting overnight; AI-driven content/answers could also shift attention.',
  '<b>Governance:</b> dual-class structure gives the founder voting control — minority holders have little say.',
];
var SOURCES='Quantitative series: Summit DCF model for META, actuals_history sheet (snapshot 2026-05-22) — reported FY2019–FY2025; the model\'s projection out-years are excluded as unreliable (per the team\'s DCF-historical-only policy). Segment split (Family of Apps vs Reality Labs) is clean from FY2021. Qualitative content: Meta 10-Ks, quarterly results and earnings calls; ~3.4B daily-active-people and ~98%-advertising mix are company disclosures. Forward figures are not shown. Brand colors approximate Meta blue.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(t,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(t)+'</div>'+inner+'</section>'; }
function bullets(a){ return '<ul class="ov-bullets">'+a.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function chain(arr, key){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(key?' ov-clickable':'');
  var attr=key?' data-detail="'+key+':'+i+'"':''; var more=key?' <span class="ov-tl-more">tap ›</span>':'';
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }

// ─── Pane: Overview ───────────────────────────────────────────────────────────
function overviewBody(){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="meLive" hidden></div>';
  h+='<p class="ov-lede">'+esc(DESC)+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue <span>($B, FY · actuals)</span></div><div class="ov-chart-wrap"><canvas id="meRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating Income <span>($B, FY · actuals)</span></div><div class="ov-chart-wrap"><canvas id="meOp"></canvas></div></div>'+
  '</div>';
  h+=sec('How Meta Makes Money — the ad auction',
    '<p class="ov-lede" style="margin:0 0 14px">Almost all revenue is advertising sold by real-time auction — <b>tap any step</b>.</p>'+chain(AD_FLOW,'ad'));
  h+=sec('Segments & Products', SEGMENTS.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join(''));
  h+=sec('History & Milestones','<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>');
  h+=sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they are</th><th>How Meta differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+p[1]+'</td><td>'+p[2]+'</td></tr>';}).join('')+'</tbody></table>');
  h+=sec('Tailwinds & Headwinds',
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Segments (FoA vs Reality Labs) ─────────────────────────────────────
function segBody(){
  var h='';
  h+='<p class="ov-lede">Meta is <b>two businesses in a trench coat</b>: the Family of Apps, a ~50%-margin advertising cash machine, and Reality Labs, a multi-billion-dollar annual loss that the first one funds. The whole thesis is whether that trade is worth it.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FOA+'"></span>Family of Apps</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+RL+'"></span>Reality Labs</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue by segment <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meSegRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating income by segment <span>($B, FY · RL is a loss)</span></div><div class="ov-chart-wrap"><canvas id="meSegOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">Family of Apps generated ~<b>$102B</b> of operating profit in FY2025; Reality Labs <b>lost ~$19B</b>. Cumulative Reality Labs operating loss since 2020 is ~<b>$'+(RL_CUM/1000).toFixed(0)+'B</b> — the price of the long bet.</div>';
  h+=sec('Family of Apps — the cash machine', '<div class="ov-callout">'+bullets([
    '~<b>3.4B daily active people</b> across Facebook, Instagram, WhatsApp, Messenger and Threads — the largest attention pool on earth.',
    'Revenue is ~<b>98% advertising</b>, driven by <b>impressions × price per ad</b>. AI ranking lifts both; Reels and business messaging add new surfaces.',
    'Runs at ~<b>50%+ operating margin</b> — the profit that funds Reality Labs, AI capex, buybacks and the dividend.',
  ])+'</div>');
  h+=sec('Reality Labs — the long bet', '<div class="ov-callout">'+bullets([
    '<b>Products:</b> Quest VR, <b>Ray-Ban Meta</b> smart glasses (the breakout hit), the <b>Orion</b> AR prototype, and Meta\'s on-device AI ambitions.',
    '<b>Economics:</b> ~$2.2B revenue against a ~<b>$19B operating loss</b> in FY2025 — losses have widened every year.',
    '<b>The debate:</b> a visionary bet on the next computing platform, or a ~$79B-and-counting money pit. The market tolerates it only while the Family of Apps keeps delivering.',
  ])+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Financials ─────────────────────────────────────────────────────────
function finBody(){
  var h='';
  h+='<p class="ov-lede">Reported financials from the Summit DCF (actuals, FY2019–FY2025). The story of the last three years: profit and cash recovered hard off the 2022 trough — while <b>capex is exploding</b> on AI infrastructure, the central swing factor for future free cash flow.</p>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating margin <span>(% of revenue)</span></div><div class="ov-chart-wrap"><canvas id="meMargin"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Free cash flow <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meFcf"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr;margin-top:14px">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Capex <span>($B, FY · the AI build)</span></div><div class="ov-chart-wrap"><canvas id="meCapex"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Advertising revenue <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meAdv"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">Capex jumped from ~$37B (2024) to <b>$69.7B (2025)</b> — and management guides higher. Even so, free cash flow held at ~$46B because the ad engine is so profitable. Whether capex out-runs cash flow is the number to watch.</div>';
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Shell ────────────────────────────────────────────────────────────────────
function html(c){
  var h='<div class="ov ov-meta" data-brand="META">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="segments">Segments</button>'+
    '<button type="button" class="ovt-tab" data-ovt="fin">Financials</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="segments" hidden>'+segBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="fin" hidden>'+finBody()+'</div>';
  h+='<div class="ov-modal-back" id="meModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="meModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="meModalT"></div><div class="ov-modal-b" id="meModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══ Charts ═══════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }
function bar(id, labels, data, color, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  var colors=Array.isArray(color)?color:labels.map(function(){ return color; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ { id:'vl', afterDatasetsDraw:function(ch){ var ctx=ch.ctx; ch.getDatasetMeta(0).data.forEach(function(b,i){ var v=ch.data.datasets[0].data[i];
      ctx.save(); ctx.textAlign='center'; ctx.font='700 10.5px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(fmt(v), b.x, (v<0?b.y+14:b.y-7)); ctx.restore(); }); } } ] });
}
function grouped(id, labels, s1, s2, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:s1.label, data:s1.data, backgroundColor:s1.color, borderRadius:3, maxBarThickness:26 },
      { label:s2.label, data:s2.data, backgroundColor:s2.color, borderRadius:3, maxBarThickness:26 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'14%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function line(id, labels, data, color, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:labels, datasets:[{ data:data, borderColor:color, backgroundColor:'rgba(8,102,255,0.06)', borderWidth:2.5, tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:fmt } }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function pf(v){ return v.toFixed(0)+'%'; }
function buildOverview(){ bar('meRev', YEARS, REV, BRAND, money); bar('meOp', YEARS, OPINC, BRAND2, money); }
function buildSegments(){
  grouped('meSegRev', SEG_YEARS, { label:'Family of Apps', data:FOA_REV, color:FOA }, { label:'Reality Labs', data:RL_REV, color:RL }, money);
  grouped('meSegOp', SEG_YEARS, { label:'Family of Apps', data:FOA_OP, color:FOA }, { label:'Reality Labs', data:RL_OP, color:RL }, money);
}
function buildFin(){ line('meMargin', YEARS, OPMARGIN, BRAND, pf); bar('meFcf', YEARS, FCF, BRAND2, money);
  bar('meCapex', YEARS, CAPEX, CAPEX.map(function(v,i){ return i===CAPEX.length-1?NEG:GRAY; }), money); bar('meAdv', YEARS, ADV, BRAND, money); }

// ─── Live price (shared get-quote edge fn; hides gracefully if not deployed) ──
function fetchQuote(t){ var env=(typeof window!=='undefined')&&window.ENV; if(!env||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return Promise.reject();
  var base=String(env.SUPABASE_URL).replace(/\/+$/,'');
  return fetch(base+'/functions/v1/get-quote?ticker='+t,{ headers:{ apikey:env.SUPABASE_ANON_KEY, Authorization:'Bearer '+env.SUPABASE_ANON_KEY } })
    .then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(j){ if(j&&typeof j.price==='number') return j; throw 0; }); }
function renderLive(root){ var el=root.querySelector('#meLive'); if(!el) return; el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('META').then(function(q){ var p=q.changePct, up=(p==null||p>=0); var t=q.time?new Date(q.time*1000):null, hh=t?(('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)):'';
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">META</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NASDAQ')+(hh?(' · '+hh):'')+'</span>';
  }).catch(function(){ el.hidden=true; el.innerHTML=''; }); }

// ─── Orchestration ────────────────────────────────────────────────────────────
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(buildOverview);
  if(key==='segments') requestAnimationFrame(buildSegments);
  if(key==='fin')      requestAnimationFrame(buildFin);
}
function wireModal(root){
  var back=root.querySelector('#meModalBack'), mT=root.querySelector('#meModalT'), mB=root.querySelector('#meModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#meModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){ var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='ad'){ var s=AD_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    return null; }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
function init(c){
  var root=document.querySelector('.ov-meta'); if(!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  wireModal(root);
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var metaOverview = { html: html, init: init };
