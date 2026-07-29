// overviews/meta.js — standardized Overview + Deep Dive for Meta Platforms, Inc. (NASDAQ: META)
// Rebuilt to the NEW standardized format (same spine as UBER/LYFT/CART → MA → V):
//   Overview  = 7-block hook (Key Facts · Description · 2×2 · progressive-disclosure collapsibles).
//   Deep Dive = 5-tab spine (Top Line · Bottom Line · Evolution · Valuation · Management),
//               a sibling profile tab; Pillars absorbed (Fiscal.ai ownership → #dd-mgmt-slot,
//               Massive analyst ratings → #dd-val-slot). Golden Rule #1: every old piece migrated.
//
// Quantitative series: Summit DCF model for META (snapshot 2026-05-22). Reported ACTUALS
// (FY2019–FY2025) plus the model's CONSOLIDATED 2026E–2027E projections for revenue, operating
// income, earnings, EBITDA, capex and D&A (shown shaded). Deliberately EXCLUDED: segment-level
// (FoA/RL) projections and 2028+ (thin/terminal-artifact in the model) and forward FCF as a
// headline (charted where the model is clean). NOTE: GAAP 2025 earnings ($60.5B) are depressed by
// a one-time OBBBA deferred-tax charge; the model-normalized 2025 earnings line is ~$73.9B.
// The "Spend Engine" lease/cloud-commitment decomposition is a Summit analytical reconstruction
// (Meta 10-K/10-Q Note-8 + vendor 8-Ks/press) — an estimate, not a clean disclosure or live series.
// Supply Chain: Bloomberg SPLC (SPLC), META US Equity, as-of 26-Jun-2026 (point-in-time snapshot).
// Qualitative: Meta 10-Ks, Q4 2023 → Q1 2026 earnings calls, a Summit "Ad Ecosystem" primer.
// Live data: price / market cap / EV via Massive (api.liveQuote), logged-in only; graceful fallback.

import { makeManagement } from './management.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting ──────────────────────────────────────────────────────────────
function money(m){ if(m==null) return '—'; var neg=m<0,a=Math.abs(m),s;
  if(a>=1000) s='$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; else s='$'+Math.round(a)+'M'; return (neg?'−':'')+s; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }

// ─── Brand: Meta blue + Reality Labs violet ──────────────────────────────────
var BRAND='#0866FF', BRAND2='#1877F2', FOA='#0866FF', AD='#0866FF', OTHER='#7AA9FF', RL='#8B5CF6', GRAY='#B8C0CA', NEG='#C0392B', GREEN='#16A34A', FC='#A8C7FF';

// ═══════════════════════════════════════════════════════════════════════════
//  FINANCIAL SERIES (Summit DCF, snapshot 2026-05-22)
// ═══════════════════════════════════════════════════════════════════════════
// Annual ACTUALS, USD millions.
var YEARS  = ['2019','2020','2021','2022','2023','2024','2025'];
var REV    = [70697, 85965, 117929, 116609, 134902, 164501, 200966];
var OPINC  = [23986, 32671, 46753, 28945, 46751, 69380, 83276];
var FCF    = [21212, 23584, 38993, 19044, 43847, 54072, 46109];
var CAPEX  = [15102, 15163, 18690, 31431, 27266, 37256, 69691];
var EARN   = [18485, 29146, 39370, 23201, 39098, 62360, 60458];  // GAAP net income (2025 hit by one-time tax)
var EBITDA = [35389, 46578, 64438, 49683, 73079, 103566, 126140];
var SHARES = [2876, 2888, 2859, 2702, 2629, 2614, 2574];         // diluted, millions
var OPMARGIN = OPINC.map(function(v,i){ return v/REV[i]*100; });
// D&A, FY2021–2025 (the capex→D&A story).
var DA_YEARS = ['2021','2022','2023','2024','2025'];
var DA       = [7967, 8686, 11178, 15498, 18616];
// Summit DCF projections (2026E–2027E consolidated totals — reliable; segment & 2028+ excluded).
var YEARS_F  = ['2026E','2027E'];
var REV_F    = [256182, 322461];
var OPINC_F  = [117085, 151691];
var EARN_F   = [99776, 129423];   // model-normalized net income
var EBITDA_F = [168428, 220074];
var FCF_F    = [3185, 17096];     // FCF collapses on capex 2026E, recovers 2027E
var CAPEX_F  = [140900, 174129];
var DA_F     = [29600, 43641];
var YEARS_X    = YEARS.concat(YEARS_F);
var REV_X      = REV.concat(REV_F);
var OPINC_X    = OPINC.concat(OPINC_F);
var CAPEX_X    = CAPEX.concat(CAPEX_F);
var DA_YEARS_X = DA_YEARS.concat(YEARS_F);
var DA_X       = DA.concat(DA_F);
var EST_CAP = 'Shaded / lighter bars (2026E–2027E) are <b>Summit DCF estimates</b> (snapshot May 2026), not reported actuals.';
// Segment split — clean from FY2021.
var SEG_YEARS = ['2021','2022','2023','2024','2025'];
var FOA_REV = [115655, 114450, 133005, 162354, 198758];
var RL_REV  = [2274, 2159, 1896, 2146, 2207];
var FOA_OP  = [56947, 42662, 62870, 87109, 102469];
var RL_OP   = [-10194, -13717, -15849, -17729, -19193];
// Family of Apps revenue = Advertising + Other (FY2021–2025).
var ADV_S = [114934, 113641, 131948, 160632, 196174];
var OTH_S = [721, 809, 1057, 1722, 2584];
var RL_CUM = 78781; // cumulative Reality Labs operating loss 2020–2025 (~$78.8B)

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var DESC='Meta is the world\'s largest social-advertising business. The <b>Family of Apps</b> — Facebook, Instagram, WhatsApp, Messenger and Threads (~3.5B daily people) — is the engine: a walled-garden advertising machine (Meta owns every layer of the ad stack, so it keeps essentially the whole ad dollar) running at a <b>~50%+ segment operating margin</b>. The <b>consolidated</b> company runs <b>~41%</b> — the gap is Reality Labs, the AR/VR + AI-hardware bet that loses ~$19B a year and which the FoA cash funds. Management guides Reality Labs losses to <b>peak in 2026</b>, then gradually narrow. The whole story is how much of the FoA cash gets re-invested into AI capex, and whether it pays off.';
var KPIS=[
  { l:'Revenue',          v:'$201B', d:pctStr((REV[6]/REV[5]-1)*100)+' YoY',  dir:'up' },
  { l:'Operating Income', v:'$83.3B',d:'~41% op margin',                       dir:'up' },
  { l:'Free Cash Flow',   v:'$46.1B',d:'after record capex',                   dir:'up' },
  { l:'Capex',            v:'$69.7B',d:pctStr((CAPEX[6]/CAPEX[5]-1)*100)+' YoY · AI build', dir:'down' },
];
var AS_OF='Headline KPIs are FY2025 (reported). Revenue $201.0B (+22%), operating income $83.3B (~41% margin), free cash flow $46.1B, and a record $69.7B of capex (+87% YoY). ~3.5B daily active people across the Family of Apps; advertising is ~98% of revenue.';
var FY_NOTE='Two engines, one company. <b>Family of Apps</b> generated ~$199B of revenue and ~$102B of segment operating profit in FY2025 — that profit <b>funds Reality Labs</b>, which lost ~$19B (~$79B cumulative since 2020). Charts show reported actuals (FY2019–FY2025) plus the <b>Summit DCF\'s 2026E–2027E estimates</b> for company totals (shaded). Segment-level splits and 2028+ are charted as actuals only — the model\'s projection is reliable for consolidated totals but thin at the segment level and in the far out-years.';

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW DATA (the 7 blocks)
// ═══════════════════════════════════════════════════════════════════════════
// Block 1 — Key Facts (exactly 10, 5×2). Market-cap cell is live (#meMc).
var META_FACTS=[
  ['Listing','NASDAQ: META'],
  ['HQ','Menlo Park, CA, USA'],
  ['Founded','2004 — Cambridge, MA'],
  ['IPO','May 2012 · $38.00'],
  ['CEO','Mark Zuckerberg · founder, since 2004'],
  ['Segments','Family of Apps · Reality Labs'],
  ['Control','Dual-class — founder voting control'],
  ['Capital return','Dividend (since 2024) + buybacks'],
  ['Employees','~76,000 · 2025'],
  ['Market cap','~$1.8T · est'],
];
function metaKeyFacts(){
  return '<div class="stdkf">'+META_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="meMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
// Block 3 — the 4-quadrant (each cell ≤ ~30 words).
var META_BIZ=[
  ['What it sells','Attention. Ad space across Facebook, Instagram, WhatsApp, Messenger and Threads, sold by real-time auction; plus a small Reality Labs hardware line (Quest, Ray-Ban / Oakley Meta glasses).'],
  ['Who buys it','~10M+ advertisers — from global brands to small businesses — bidding for ~3.5B daily people. No single customer is material; the advertiser base is the ultimate diversification.'],
  ['How it earns','Advertising is ~98% of revenue: impressions × price-per-ad, both AI-driven. FY2025 revenue $201B; Family-of-Apps segment ~50%+ op margin, consolidated ~41% after Reality Labs.'],
  ['The edge','A walled garden — Meta is the publisher, buy-side, sell-side, exchange and data layer at once, so it keeps ~the whole ad dollar; ~3.5B-user data network + the best direct-response AI.'],
];
function metaFourQuad(){
  return '<div class="q2">'+META_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ─── Standardized render helpers ─────────────────────────────────────────────
function sec(t,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(t)+'</div>'+inner+'</section>'; }
function bullets(a){ return '<ul class="ov-bullets">'+a.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
function chain(arr, key){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(key?' ov-clickable':'');
  var attr=key?' data-detail="'+key+':'+i+'"':''; var more=key?' <span class="ov-tl-more">tap ›</span>':'';
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }
function rangeSlider(key,maxI,a,b){
  return '<div class="sg-controls"><div class="sg-slider">'+
    '<div class="sg-track"><div class="sg-fill" id="'+key+'Fill"></div></div>'+
    '<input type="range" id="'+key+'Min" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start">'+
    '<input type="range" id="'+key+'Max" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End">'+
    '</div><div class="sg-ends"><span>'+esc(a)+'</span><span>'+esc(b)+'</span></div>'+
    '<div class="sg-readout" id="'+key+'Readout"></div></div>';
}
function flowHtml(){
  return '<div class="ov-flow" id="meFlow">'+
    '<div class="ov-flow-nodes">'+
      FLOW_NODES.map(function(n){ return '<div class="ov-flow-node" data-node="'+n.k+'"><div class="ov-flow-ic">'+n.ic+'</div><div class="ov-flow-l">'+esc(n.l)+'</div></div>'; }).join('<span class="ov-flow-link">→</span>')+
    '</div>'+
    '<div class="ov-flow-stage"><span class="ov-flow-step" id="meFlowStep">Setup</span><div class="ov-flow-cap" id="meFlowCap">'+FLOW_STEPS[0].cap+'</div>'+
      '<div class="ov-flow-earn" id="meFlowEarn" hidden></div></div>'+
    '<div class="ov-flow-ctrl">'+
      '<button class="ov-flow-btn" id="meFlowPlay">▶ Play</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="meFlowPrev">‹ Prev</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="meFlowNext">Next ›</button>'+
      '<div class="ov-flow-dots" id="meFlowDots">'+FLOW_STEPS.map(function(s,i){ return '<span class="ov-flow-dot'+(i===0?' on':'')+'" data-i="'+i+'"></span>'; }).join('')+'</div>'+
    '</div>'+
    '<div class="ov-flow-note">'+FLOW_NOTE+'</div>'+
  '</div>';
}

// ═══════════════════════════════════════════════════════════════════════════
//  MIGRATED CONTENT — the ad engine, walled garden, Reality Labs, Spend Engine
// ═══════════════════════════════════════════════════════════════════════════
// How Meta makes money: the ad auction (clickable chain).
var AD_FLOW=[
  { t:'A user opens Facebook / Instagram / Threads', d:'~3.5B daily people generate billions of ad impressions. Each impression is an <b>auction</b> held in real time — Meta\'s inventory is its attention.',
    detail:'Every time a feed, Story or Reel loads, Meta has milliseconds to decide which ad (if any) to show in each ad slot. The <b>supply</b> side is engagement: more daily users × more time-spent × more sessions = more impressions to auction. That is why the engagement work (Reels, AI-recommended content, Threads) feeds the ad business directly — it manufactures more auction inventory. Meta reports the two levers separately: <b>ad impressions delivered</b> (+18% YoY in Q4 2025) and <b>average price per ad</b> (+6%).' },
  { t:'Advertisers bid for the impression', d:'Advertisers set a budget and a goal (a click, install, purchase). Meta runs an <b>auction</b>, not a fixed price — so pricing rises with demand and ad quality.',
    detail:'Advertisers don\'t buy a fixed slot at a list price — they enter a continuous auction and state an <b>objective</b> (link clicks, app installs, purchases, leads) and a budget. Meta uses a <b>second-price-style</b> auction: you don\'t pay your full bid, you pay just enough to beat the next-best ad. Because the ranking also weights predicted relevance (next step), a <i>more relevant</i> ad can win while bidding <i>less</i> — which is what lets Meta raise price-per-ad and advertiser ROI at the same time.' },
  { t:'AI ranks the auction', d:'The winner ≈ <b>bid × estimated action rate × ad quality</b>. Meta\'s AI predicts who will convert — this is where AI turns directly into revenue.',
    detail:'The ranking score ≈ <b>bid × estimated action rate × ad quality</b>. The hard part is the middle term — predicting the probability <i>this</i> user takes <i>this</i> action — and that is what Meta\'s ad-ranking AI does. The current generation is <b>GEM (Generative Ads recommendation Model)</b>, a single large transformer-based model that replaced many smaller per-surface models (see the GEM explainer). Better predictions raised measured outcomes: <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025). Every accuracy gain is monetized immediately as higher conversion and higher winning bids.' },
  { t:'The ad is shown; advertiser pays per result', d:'Meta keeps essentially <b>all</b> of the ad revenue (it owns every layer of the ad stack — see the walled garden). Advertising is ~<b>98%</b> of total revenue.',
    detail:'In the open programmatic web a chain of middlemen (DSP, exchange, SSP, data vendors) skims ~45¢ of every advertiser dollar before it reaches the publisher. Meta is a <b>walled garden</b>: it is the publisher, the buy-side, the sell-side, the exchange and the data layer all at once, so essentially the <b>entire dollar</b> stays inside Meta — no leakage to intermediaries. That is why ~98% of revenue is advertising and why the margin structure is so different from open-web players. See the walled-garden section for the full $1.00 breakdown.' },
  { t:'It converts to cash at high margin', d:'Family-of-Apps <b>segment</b> operating margin is ~<b>50%+</b> (consolidated ~41% after Reality Labs); the cash funds capex, buybacks, a dividend and the AI bet.', payoff:true,
    detail:'Because Meta keeps the whole ad dollar and its cost base (data centers, R&D, S&M) grows slower than revenue, incremental ad dollars drop through at very high margins — the <b>FoA segment</b> runs ~50%+ operating margin. At the <b>consolidated</b> level the company runs ~41%, the gap being Reality Labs\' ~$19B annual loss. That FoA cash is what funds the four uses of capital: the record AI capex build, the Reality Labs bet, buybacks, and the dividend (first paid 2024).' },
];
// The ad ecosystem (Summit primer): in the OPEN web each intermediary takes a cut.
var ECO_OPEN=[
  ['Advertiser pays', 100, '$1.00', '#1E2733'],
  ['DSP (buy-side)', 15, '−$0.15', '#9AA7B8'],
  ['Ad Exchange', 10, '−$0.10', '#B8C0CA'],
  ['SSP (sell-side)', 20, '−$0.20', '#CBD3DD'],
  ['→ Publisher keeps', 55, '$0.55', GREEN],
];
var WALLED='In the <b>open web</b>, an advertiser\'s dollar passes through a chain of middlemen before it reaches the website showing the ad: a <b>DSP</b> (Demand-Side Platform — the software advertisers use to buy ad space, ~5–20%), an <b>ad exchange</b> (the marketplace that runs the auction), an <b>SSP</b> (Supply-Side Platform — the software publishers use to sell their ad space, ~10–25%), plus data & verification vendors. After all those cuts, only ~<b>$0.55</b> of each $1.00 reaches the publisher. <b>Meta is a "walled garden": it IS every layer at once</b> — the publisher (FB/IG), the SSP, the DSP, the ad exchange, and the data & verification platform, all in one closed loop. So Meta <b>keeps essentially the entire ad dollar</b> (no leakage to intermediaries), owns the user data end-to-end, and controls the whole auction. That full vertical integration is a structural margin <i>and</i> moat advantage that rivals dependent on third-party DSPs/SSPs can\'t match.';
var FOA_WINS=[
  '<b>AI ranking turns straight into revenue:</b> the new <b>GEM</b> ad model drove <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025); ad <b>impressions +18% YoY</b> with <b>price-per-ad +6%</b>.',
  '<b>AI recommendations lift time-spent:</b> AI-recommended (unconnected) content is now <b>40%+ of the Facebook feed</b>, and Facebook surfaces ~25% more same-day Reels — the same ranking AI that powers ads keeps users on-app longer, compounding impressions.',
  '<b>Reels monetization caught up to feed</b> — once a drag (lower-monetizing short video cannibalizing feed), Reels now monetizes at roughly feed levels while driving big time-spent gains.',
  '<b>Threads is ramping:</b> time-spent <b>+20% YoY</b> (Q4 2025) with ad monetization scaling — a near-zero-CAC surface built off the Instagram graph.',
  '<b>Business messaging:</b> click-to-WhatsApp / Instagram ads are among the fastest-growing ad products — turning messaging into the next monetization surface.',
];
// GEM explainer.
var GEM_WHAT='<b>GEM = Generative Ads recommendation Model.</b> It is the large AI model that decides, for each ad auction, how likely <i>you</i> are to act on <i>this</i> ad — the prediction that drives both the ranking and the price.';
var GEM_POINTS=[
  '<b>What it replaced:</b> for years Meta ran <b>many smaller, specialized models</b> — a different ranker per surface (Feed, Reels, Stories) and per objective (click, install, purchase). They were hard to improve in lockstep and couldn\'t share what they learned.',
  '<b>How it works:</b> GEM is a <b>single, much larger transformer-based model</b> (the same family of architecture behind LLMs), trained on far more data and signals at once. One big model generalizes across surfaces and objectives, so a pattern learned on Instagram conversions also sharpens Facebook click prediction. Meta scaled the training compute massively (a chunk of the AI capex) specifically to make this model bigger and more accurate.',
  '<b>What changes for the ad:</b> better conversion prediction means the auction shows each user a more relevant ad, which lifts measured results — <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025) — and lets Meta raise price-per-ad <i>and</i> advertiser ROI simultaneously. It also underpins <b>Advantage+</b>, where the advertiser just gives a goal + budget + creative and the AI does the targeting, bidding and optimization.',
];
// Reality Labs.
var RL_WHAT='<b>What the segment actually is.</b> Reality Labs (RL) is Meta\'s <b>hardware + software bet on the next computing platform</b> — the businesses Meta hopes will, one day, reduce its dependence on phones (where Apple and Google control the rules). It is reported separately from advertising so investors can see its cost. It is <b>~1% of revenue and ~−$19B of operating profit</b>: a venture bet sitting inside a mega-cap, not a business that pays its own way yet. It traces back to the <b>2014 Oculus acquisition (~$2B)</b> and became a <b>separate reported segment with the Oct-2021 rebrand to "Meta"</b> — which is when its multi-billion-dollar losses became visible for the first time.';
var RL_NOTE='Reality Labs is the long bet — and it is run at a deliberate, large loss. Two things matter for modelling it:';
var RL_DETAIL = [
  { t:'Meta Quest — VR/MR headsets', h:'<b>The core hardware line</b> (Quest 3 / 3S). Meta sells the headset <b>direct</b> and books the <b>full device price</b> as RL revenue, plus a cut of Quest Store app/game sales. Historically sold near or below cost to grow the install base.<br><br><b>Revenue recognition:</b> full device revenue → Reality Labs segment. This is the cleanest RL revenue line.' },
  { t:'Ray-Ban & Oakley Meta — smart glasses', h:'<b>The breakout product</b> — camera/audio/AI glasses built with <b>EssilorLuxottica</b>. <b>>7M units sold in 2025</b>.<br><br><b>Key accounting nuance:</b> EssilorLuxottica is the <b>seller of record</b> and books the retail sale, so Meta recognizes only its <b>shared/partial economics, not the full retail price</b>. Glasses can sell huge units while adding comparatively little reported RL revenue.<br><br><b>Why it matters:</b> unit sales are a better signal of traction than RL revenue for this product.' },
  { t:'Horizon & Software Platform', h:'<b>Horizon Worlds</b> (social VR) and the developer platform. A small “platform/proxy” revenue line today.<br><br><b>Strategic bet:</b> an owned social + OS layer that doesn’t depend on Apple or Google. Management pivoting Horizon toward <b>mobile</b> (not just VR). AI-generated interactive content is the unlock.<br><br><b>Financial reality:</b> small revenue, large cost. Strategic, not financial, at this stage.' },
  { t:'Orion AR — full augmented reality', h:'<b>Full holographic AR glasses</b> — still a <b>prototype</b>, not a product. Absorbs a large share of RL’s R&D loss.<br><br><b>Timeline:</b> years away from consumer product. The near-term bet is the Ray-Ban/Oakley line; Orion is the long-term option value.' },
];
var RL_READ_DETAIL = [
  { t:'Revenue recognition — why RL revenue understates traction', h:'RL revenue ≈ platform/“proxy” line + <b>Quest</b> (full device price) + <b>smart glasses</b> (partial economics only).<br><br><b>EssilorLuxottica is the seller of record</b> for the glasses — it books the retail sale. Meta recognizes only its shared economics. So glasses can sell huge units while adding comparatively little RL revenue.<br><br><b>Implication:</b> don’t read RL revenue as a proxy for glasses traction — it structurally understates the story.' },
  { t:'The breakout is glasses, not VR', h:'Ray-Ban / Oakley Meta sold <b>>7M units in 2025</b>. Management is pivoting investment <b>toward wearables and away from VR/Horizon</b> (~1,500 RL roles cut).<br><br>Zuckerberg’s thesis: "glasses are the ideal form factor for AI — you can let your AI see what you see, hear what you hear." The pivot is from holographic metaverse (years away) to AI glasses (shipping now).' },
  { t:'Losses peak in 2026 — the inflection', h:'RL lost ~<b>$19B in 2025</b> (~$79B cumulative). Zuckerberg (Q4 2025 call): 2026 losses will be “<i>similar to last year, and this will likely be the peak.</i>”<br><br>2026 is the high-water mark. Losses are still enormous, but the direction changes. The FoA cash machine (~$102B segment OpInc) is built to absorb this.' },
];
// The Spend Engine (the "devil's accounting").
var SPEND_LEDE='Meta\'s reported capex is enormous — but it is only part of the AI build. A lot of the spend lands in the P&L as <b>lease and cloud-commitment expense</b> rather than as capex, so the <b>true investment intensity</b> is hard to read off the headline number. To make it legible, the Summit team <b>reconstructed</b> the spend from Meta\'s 10-K/10-Q Note-8 commitment disclosures plus vendor 8-Ks and press. What follows is that <b>estimate</b> — not a clean company disclosure and not a live time series (it never will be), but enough to give a real notion of how the buildout is funded, in <b>three ways</b>:';
var SPEND_WAYS=[
  { k:'owned', t:'1 · Owned capex → depreciation',
    teaser:'Servers & data centers Meta buys outright. Hits the P&L slowly, as <b>D&A</b>.',
    detail:'<b>What it is:</b> the servers, networking gear and data-center shells Meta <b>buys outright</b>.<br><br><b>How it hits the P&L:</b> capitalized as PP&E and expensed <b>gradually as depreciation & amortization (D&A)</b> over the asset life — it does <i>not</i> hit earnings the year it is spent.<br><br><b>Why it matters:</b> D&A has exploded ($8B in 2021 → ~$18.6B in 2025 → ~$29.6B 2026E → ~$44B 2027E). This is the "clean," visible part — but the depreciation wave it builds pressures margins for years <i>after</i> the cash goes out.' },
  { k:'leases', t:'2 · Leases (data centers)',
    teaser:'Much of the footprint is <b>leased</b>, not bought. Hits the P&L as lease cost.',
    detail:'<b>What it is:</b> a large part of the data-center footprint is <b>leased</b>, not owned — operating + finance leases under GAAP lease accounting (ASC 842).<br><br><b>How it hits the P&L:</b> as <b>lease cost</b> (plus interest and ROU-asset amortization on finance leases), recognized over the lease term as capacity is used — not upfront.<br><br><b>Why it matters:</b> disclosed lease obligations ballooned from ~$34B (2024) to ~$104B (2025) toward ~$183B (2026E) — a long-dated (≈13–15-yr) commitment at ~4.1–4.3% that sits in the P&L for over a decade.' },
  { k:'cloud', t:'3 · Third-party cloud commitments',
    teaser:'Meta also <b>rents</b> compute via multi-year deals. The murkiest piece — mostly opex.',
    detail:'<b>What it is:</b> multi-year deals to <b>rent</b> compute from outside vendors — <b>Google Cloud (~$10B), Oracle OCI (~$20B), CoreWeave (~$14B + ~$21B), Nebius (~$12B + ~$9B)</b> and more; total purchase commitments hit ~<b>$237.7B</b> (10-K Note 8).<br><br><b>How it hits the P&L:</b> mostly as <b>operating expense</b>, not capex — ~71% of the 2026 commitments due land in COGS (inference serving) and R&D (model training); only ~29% is capex-adjacent.<br><br><b>Why it matters:</b> because it is opex, this huge spend is <i>invisible</i> in the capex line yet sits straight in the cost base — the core of the "where is the AI spend?" question (see the common-size split below).' },
];
// Common-size: where the ~$42B of 2026 cloud commitments lands (Summit bridge estimate).
var SPEND_MIX=[
  ['COGS — inference serving', 42, '~$17.8B', '#0866FF'],
  ['R&D — model training', 29, '~$12.1B', '#7AA9FF'],
  ['Capex-adjacent (servers / DC)', 29, '~$12.3B', '#B8C0CA'],
];
var SPEND_NOTE='<b>Why it matters:</b> a large share of Meta\'s "AI spend" lands in cost of revenue and R&D as lease and cloud-commitment expense rather than as capex — so the true investment intensity is larger than the headline capex line, and the depreciation + commitment run-off becomes a multi-year margin question. Summit\'s <b>commitment bridge</b> estimates that of the cloud commitments coming due in <b>2026, ~71% is recognized as operating expense</b> (split COGS for <b>inference</b> serving and R&D for <b>training</b>) and ~<b>29%</b> is capex-adjacent (server purchases / data-center construction). <span class="ave-subh-note">All Spend-Engine figures are a Summit analytical reconstruction from Meta\'s 10-K/10-Q Note-8 commitments + vendor 8-Ks/press — an estimate, not a clean company breakdown and not a live series; shown to convey the shape of the spend, not sourced into the charts.</span>';
var EFFIC=[
  '<b>Custom silicon (MTIA):</b> MTIA Gen-2 is in production for recommendation inference, and a Broadcom partnership targets <b>&gt;1 GW</b> of in-house silicon — cited as meaningfully cheaper per inference than merchant GPUs.',
  '<b>Silicon diversification:</b> the Andromeda inference engine now spans <b>NVIDIA + AMD + MTIA</b>, with compute efficiency reportedly ~<b>tripled</b> — lowering cost per inference as workloads scale.',
  '<b>AI-driven productivity + headcount discipline:</b> AI coding/agents plus the post-"Year of Efficiency" posture (~8,000 roles cut around Q1 2026) keep headcount growth well below revenue growth.',
  '<b>Operating leverage:</b> the FoA ad engine\'s ~50%+ margin means incremental revenue drops through hard — the offset to the depreciation wave.',
];

// ─── Timeline / Peers / Winds ────────────────────────────────────────────────
var TIMELINE=[
  { y:'2004', t:'<b>Facebook founded</b> by Mark Zuckerberg at Harvard.' },
  { y:'2012', t:'<b>IPO</b> on NASDAQ at $38.00; acquires <b>Instagram</b> (~$1B).',
    d:'Meta (then Facebook) IPO\'d in May 2012 at <b>$38.00</b> — a famously rocky debut that traded down sharply before the mobile-advertising pivot re-rated it. The same year it bought <b>Instagram</b> for ~$1B, one of the best acquisitions in tech history.' },
  { y:'2014', t:'Acquires <b>WhatsApp</b> (~$19B) and <b>Oculus</b> (~$2B) — messaging scale + the VR seed.',
    d:'<b>WhatsApp</b> (~$19B) brought global messaging scale (now ~3B users and the base for click-to-message ads); <b>Oculus</b> (~$2B) seeded what became Reality Labs.' },
  { y:'2021', t:'Rebrands to <b>Meta</b>; carves out <b>Reality Labs</b> as a reported segment.',
    d:'The October 2021 rebrand to <b>Meta</b> signaled the metaverse pivot and introduced <b>Reality Labs</b> as a separate reporting segment — making its multi-billion-dollar losses visible for the first time.' },
  { y:'2022', t:'<b>The crash</b> — ad recession, Apple ATT, metaverse spend; stock falls to ~$88.',
    d:'A brutal year: Apple\'s <b>App Tracking Transparency</b> (ATT) hit ad targeting (~$10B headwind), a macro ad recession, TikTok competition, and surging Reality Labs spend collapsed the stock to ~$88. It set up the turnaround.' },
  { y:'2023', t:'<b>"Year of Efficiency"</b> — ~21k layoffs; margins and stock recover sharply.',
    d:'Zuckerberg declared a <b>"Year of Efficiency,"</b> cutting ~21,000 roles, flattening management and refocusing on AI and Reels. Operating margin re-expanded and the stock more than tripled.' },
  { y:'2024–26', t:'<b>AI re-rate</b> — record profit, the all-in AI push, and the FTC win.',
    d:'AI-driven ad improvements lifted price and conversion; revenue and profit hit records and Meta paid its <b>first dividend</b> (2024). In 2025 it went all-in: a <b>$14.3B stake in Scale AI</b> bringing <b>Alexandr Wang</b> as Chief AI Officer, the new <b>Superintelligence Labs</b>, a costly talent war, and an open→closed model pivot. It <b>won the FTC antitrust case (Nov 2025)</b> — no Instagram/WhatsApp breakup — and ramped <b>capex toward ~$125–145B</b> (2026 guide) for AI infrastructure.' },
];
var PEERS=[
  ['Alphabet (Google)', 'The other ad giant — Search + YouTube; also a walled garden.', 'Both re-rating on AI and both keep the ad dollar in-house. Meta owns <b>social/feed</b> attention and the best <b>direct-response</b> engine; Google owns <b>intent</b> (search). Both face the same AI-capex test — but Google has a cloud business to absorb its spend; Meta must monetize internally.'],
  ['TikTok (ByteDance)', 'Short-video attention machine.', 'The sharpest <b>attention</b> rival; Meta\'s answer is <b>Reels</b> (now monetizing near feed levels). A US ban / forced sale would be a direct tailwind.'],
  ['Amazon', 'Fast-growing retail-media ad business + AWS.', 'Competes for lower-funnel (purchase-intent) ad budgets; less a feed rival than a share-of-wallet one.'],
  ['Apple', 'Platform gatekeeper, not an ad peer.', 'ATT privacy changes structurally taxed Meta\'s targeting; Apple controls the iOS rules Meta lives under — a standing strategic risk.'],
];
var TAILWINDS=[
  '<b>AI monetizes directly:</b> Advantage+ is moving from "AI-assisted targeting" to a <b>full campaign autopilot</b> (Zuckerberg\'s "agentic" advertising: a business states a goal + budget + product, Meta\'s AI does the rest) — AI capex showing up as ad revenue.',
  '<b>Walled-garden economics:</b> Meta keeps the whole ad dollar (vs ~$0.55 to publishers in the open web) — full vertical integration is a structural margin + data moat.',
  '<b>Engagement wins:</b> Reels at feed-level monetization, AI-lifted time-spent (40%+ of FB feed AI-recommended), Threads +20% time-spent, business messaging as the next surface.',
  '<b>Operating discipline:</b> post-"Year of Efficiency" the FoA runs ~50%+ margin; management guides 2026 operating income <i>above</i> 2025 despite the capex step-up ("spend through it").',
  '<b>Legal overhang cleared:</b> the FTC antitrust case was <b>dismissed (Nov 2025)</b> — no breakup; plus the first dividend (2024) and large buybacks.',
];
var HEADWINDS=[
  '<b>The most binary AI-capex bet in megacap:</b> 2026 capex guided to ~<b>$125–145B</b> (raised in Apr 2026 from $115–135B), and Meta must earn the return <b>entirely through its own products</b> — unlike Amazon/Microsoft/Google, it has <b>no external cloud business</b> to rent that compute to and defray the cost. Every server only pays off if it lifts Meta\'s own ad monetization, which makes the bet unusually all-or-nothing; the stock fell ~9% on the Q1 2026 capex raise.',
  '<b>A large, long-dated spending commitment:</b> beyond headline capex, Meta has ~<b>$183B</b> of lease obligations and ~<b>$237.7B</b> of multi-year cloud-purchase commitments. The headwind isn\'t that they\'re disclosed opaquely — it\'s the <b>sheer magnitude and the future P&L drag</b>: as this depreciation, lease cost and committed spend run through the income statement over the next several years, it pressures margins well before the AI returns are proven.',
  '<b>Reality Labs burn:</b> ~$19B/yr (~$79B cumulative); losses guided to <b>peak in 2026</b> then narrow, but stay negative for years — tolerated only while FoA delivers.',
  '<b>AI strategy whiplash:</b> a costly talent war, the $14.3B Scale AI deal, and an open→closed Llama pivot have caused internal churn; the differentiated product is unproven.',
  '<b>Regulatory + governance:</b> EU DMA "pay-or-consent" fights and teen/AI-safety pressure persist; dual-class control leaves minority holders little say.',
];
// Master source (used ONCE at the end of the Deep Dive). Per-tab bodies carry their own short foots.
var SOURCES='Financials: Summit DCF model for META (snapshot 2026-05-22) — actuals FY2019–25 + 2026E–27E consolidated estimates (shaded); segment splits (FoA/RL) and 2028+ are actuals-only (thin/terminal in the model). GAAP 2025 earnings are depressed by a one-time OBBBA deferred-tax charge (model-normalized ~$73.9B). DAP (~3.5B) & ARPP are company disclosures (not in the snapshot). Spend Engine (leases + cloud commitments) is a Summit analytical reconstruction from Meta 10-K/10-Q Note-8 + vendor 8-Ks/press — estimate, not charted. Supply chain: Bloomberg SPLC, 26-Jun-2026. Qualitative: Meta 10-Ks + Q4 2023–Q1 2026 earnings calls + a Summit Ad-Ecosystem primer. Live price/market cap via Massive.';
var OV_SOURCE='Financials: Summit DCF model (snapshot 2026-05-22); actuals FY19–25 + 2026E–27E est. Operating KPIs (DAP ~3.5B, ARPP) are company disclosures. Qualitative: Meta 10-Ks + Q4 2023–Q1 2026 earnings calls. Live price/market cap via Massive. Peer multiples are web-sourced approximations (mid-2026); market caps are live.';
var SRC_FIN='Summit DCF model for META, snapshot 2026-05-22. 2028+ excluded (terminal-artifact). GAAP 2025 net income depressed by a one-time OBBBA deferred-tax charge (model-normalized ~$73.9B).';
var SRC_CALLS='Meta Q4 2023–Q1 2026 earnings-call transcripts & prepared remarks. Contemporaneous highlights — written from each call, not with hindsight.';
var SRC_SC='Bloomberg Supply Chain Analysis (SPLC), META US Equity, as-of 26-Jun-2026. Total Relationship Size is Bloomberg\'s dollar estimate of the commercial relationship; point-in-time, not live. Refresh source to be confirmed.';

// ── Ad-spend flow ("follow $1.00") — open web vs Meta's walled garden. ──
var FLOW_NODES=[
  { k:'adv',  ic:'🧑‍💼', l:'Advertiser' },
  { k:'dsp',  ic:'🟦', l:'DSP · buy-side' },
  { k:'exch', ic:'🔁', l:'Ad exchange' },
  { k:'ssp',  ic:'🟧', l:'SSP · sell-side' },
  { k:'pub',  ic:'📱', l:'Publisher / app' },
];
var FLOW_STEPS=[
  { t:'Setup', on:['adv'], cap:'An advertiser commits <b>$1.00</b> to win a single ad impression. In the <b>open web</b> that dollar must pass through a chain of middlemen before it reaches the app showing the ad — watch how much leaks out at each hop.' },
  { t:'1 · DSP takes its cut', on:['adv','dsp'], earnType:'neg', earn:'−$0.15 → DSP',
    cap:'The <b>DSP (Demand-Side Platform)</b> — the software advertisers use to buy ad space programmatically across many sites — takes ~<b>$0.15</b>.' },
  { t:'2 · Ad exchange takes its cut', on:['dsp','exch'], earnType:'neg', earn:'−$0.10 → exchange',
    cap:'The <b>ad exchange</b> — the marketplace that runs the real-time auction matching buyers to inventory — takes ~<b>$0.10</b>.' },
  { t:'3 · SSP takes its cut', on:['exch','ssp'], earnType:'neg', earn:'−$0.20 → SSP',
    cap:'The <b>SSP (Supply-Side Platform)</b> — the software publishers use to sell their ad space — takes ~<b>$0.20</b>, plus small data & verification fees.' },
  { t:'4 · Publisher keeps the rest', on:['ssp','pub'], earnType:'pos', earn:'only $0.55 → publisher',
    cap:'After every middleman, the <b>publisher</b> actually showing the ad keeps only ~<b>$0.55</b> of the original $1.00. ~45¢ leaked to intermediaries.' },
  { t:'5 · Meta — the walled garden', on:['adv','dsp','exch','ssp','pub'], earnType:'pos', earn:'≈ $1.00 stays inside Meta',
    cap:'<b>Meta is all of these layers at once</b> — it is the DSP, the exchange, the SSP, the data platform <i>and</i> the publisher (Facebook / Instagram). No middlemen to pay, so Meta keeps <b>~the entire $1.00</b>. Owning the whole stack end-to-end is the walled-garden margin <i>and</i> data moat.' },
];
var FLOW_NOTE='The open-web split is illustrative (typical "ad-tech tax" ranges); Meta figures reflect its closed-loop ownership of the full ad stack. The point is structural, not penny-precise.';

// ── Model vs Reality (back-test): Summit DCF quarterly ESTIMATE vs reported ACTUAL. ──
var Q13   = ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var REV_E = [28313,31023,34353,39659,35041,38455,41083,47346,42957,45970,50766,59296,52879];
var REV_A = [28645,31999,34146,40111,36455,39071,40589,48385,42314,47516,51242,59893,56311];
var OPI_E = [6799, 8300, 11827,14235,13578,15406,15774,19870,17394,18372,20904,24420,24990];
var OPI_A = [7227, 9392, 13748,16384,13818,14847,17350,23365,17555,20441,20535,24745,22872];
var Q9    = ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var ADV_E = [34283,37798,40372,45673,42049,45228,49856,57543,51549];
var ADV_A = [35635,38329,39885,46783,41392,46563,50082,58137,55024];
var OPM_E = OPI_E.map(function(v,i){ return v/REV_E[i]*100; });
var OPM_A = OPI_A.map(function(v,i){ return v/REV_A[i]*100; });
var AVE={
  rev:    { label:'Revenue',            fmt:'usd', quarters:Q13, est:REV_E, act:REV_A, note:'Total revenue. The model tracked tightly through 2025; advertising re-accelerated into 1Q26, so the actual came in ahead of estimate.' },
  adv:    { label:'Advertising revenue', fmt:'usd', quarters:Q9, est:ADV_E, act:ADV_A, note:'Advertising revenue (~98% of the total). Tracked closely; 1Q26 came in well ahead as AI-driven ad pricing and impressions accelerated.' },
  opinc:  { label:'Operating income',   fmt:'usd', quarters:Q13, est:OPI_E, act:OPI_A, note:'GAAP operating income. Meta consistently out-earned the model through 2024–25; 1Q26 came in below estimate as the AI-capex ramp lifted the expense base.' },
  opmargin:{ label:'Operating margin',  fmt:'pct', quarters:Q13, est:OPM_E, act:OPM_A, note:'Consolidated operating margin (operating income ÷ revenue). The telling quarter is 1Q26: revenue BEAT but margin MISSED ~7pp — the AI-capex/expense ramp lifted the cost base faster than the model assumed, so a revenue beat still meant a margin (and operating-income) miss.' },
};
var _aveMetric='rev', AVE_GREEN='#16A34A', AVE_RED='#C0392B';

// ── Guidance (revenue, next-qtr) — GUIDED band vs DELIVERED. Summit REVENUE_GUIDANCE_*. ──
// q = quarter guided; lo/hi = the guided range set at the prior call; act = delivered (null=pending).
var GUIDE=[
  { q:'1Q24', lo:34500, hi:37000, act:36455 },
  { q:'2Q24', lo:36500, hi:39000, act:39071 },
  { q:'3Q24', lo:38500, hi:41000, act:40589 },
  { q:'4Q24', lo:45000, hi:48000, act:48385 },
  { q:'1Q25', lo:39500, hi:41800, act:42314 },
  { q:'2Q25', lo:42500, hi:45500, act:47516 },
  { q:'3Q25', lo:47500, hi:50500, act:51242 },
  { q:'4Q25', lo:56000, hi:59000, act:59893 },
  { q:'1Q26', lo:53500, hi:56500, act:56311 },
  { q:'2Q26', lo:58000, hi:61000, act:null  },
];
// Capex-guidance escalation (the defining META guidance story — from the calls).
var CAPEX_GUIDE=[
  { d:'Q4 2023 (Feb 2024)', g:'$30–37B', n:'the opening move of the infrastructure ramp' },
  { d:'Q1 2024 (Apr 2024)', g:'$35–40B', n:'"multi-year investment cycle"; stock sold off ~11%' },
  { d:'Q4 2024 (Jan 2025)', g:'$60–65B', n:'nearly doubled; "hundreds of billions over the long term"' },
  { d:'Q1 2025 (Apr 2025)', g:'$64–72B', n:'"2026 similarly significant dollar growth"' },
  { d:'Q4 2025 (Jan 2026)', g:'$115–135B', n:'the 2026 guide; "operating income above 2025"' },
  { d:'Q1 2026 (Apr 2026)', g:'$125–145B', n:'raised on higher memory pricing; stock fell ~9%' },
];

// ─── Supply Chain (Bloomberg SPLC, as-of 26-Jun-2026) ──────────────────────
var SC_SUPPLIERS = [
  { n:'NVIDIA',             ind:'Semiconductors',  rel:11182.59, costPct:13.07, cat:'CAPEX', supRev:4.10  },
  { n:'SK hynix',           ind:'Semiconductors',  rel:4593.50,  costPct:5.14,  cat:'CAPEX', supRev:6.51  },
  { n:'GoerTek',            ind:'Tech Hardware',   rel:4504.29,  costPct:12.23, cat:'COGS',  supRev:26.38 },
  { n:'Broadcom',           ind:'Semiconductors',  rel:3682.44,  costPct:4.89,  cat:'CAPEX', supRev:5.11  },
  { n:'Celestica',          ind:'Tech Hardware',   rel:1931.51,  costPct:2.56,  cat:'CAPEX', supRev:15.12 },
  { n:'AMD',                ind:'Semiconductors',  rel:1688.28,  costPct:2.55,  cat:'CAPEX', supRev:5.49  },
  { n:'Western Digital',    ind:'Tech Hardware',   rel:1530.89,  costPct:1.79,  cat:'CAPEX', supRev:12.69 },
  { n:'Accton Technology',  ind:'Tech Hardware',   rel:970.38,   costPct:2.63,  cat:'COGS',  supRev:9.95  },
  { n:'Qualcomm',           ind:'Semiconductors',  rel:857.27,   costPct:2.33,  cat:'COGS',  supRev:1.90  },
  { n:'Ciena',              ind:'Tech Hardware',   rel:590.95,   costPct:0.78,  cat:'CAPEX', supRev:9.41  },
  { n:'Corning',            ind:'Tech Hardware',   rel:537.88,   costPct:0.63,  cat:'CAPEX', supRev:3.19  },
  { n:'Hanwha Solutions',   ind:'Chemicals',       rel:431.56,   costPct:1.27,  cat:'COGS',  supRev:4.84  },
  { n:'CoreWeave',          ind:'Software',        rel:388.83,   costPct:1.14,  cat:'COGS',  supRev:8.02  },
  { n:'TaskUS',             ind:'IT Services',     rel:307.72,   costPct:1.27,  cat:'SGA',   supRev:26.00 },
  { n:'Zhongji Innolight',  ind:'Tech Hardware',   rel:285.46,   costPct:0.43,  cat:'CAPEX', supRev:6.36  },
  { n:'Jabil',              ind:'Tech Hardware',   rel:253.27,   costPct:0.84,  cat:'COGS',  supRev:0.81  },
  { n:'Penguin Solutions',  ind:'Semiconductors',  rel:249.78,   costPct:0.29,  cat:'CAPEX', supRev:18.20 },
  { n:'Nokia',              ind:'Tech Hardware',   rel:247.60,   costPct:0.33,  cat:'CAPEX', supRev:1.18  },
  { n:'Microsoft',          ind:'Software',        rel:225.80,   costPct:0.75,  cat:'COGS',  supRev:0.08  },
];
var _scFilter = 'ALL';
var SC_GEO = [
  { c:'United States',  n:109, pct:38.52, fac:1184, facPct:32.98 },
  { c:'China',          n:35,  pct:12.37, fac:460,  facPct:12.81 },
  { c:'South Korea',    n:19,  pct:6.71,  fac:85,   facPct:2.37  },
  { c:'United Kingdom', n:17,  pct:6.01,  fac:130,  facPct:3.62  },
  { c:'Taiwan',         n:15,  pct:5.30,  fac:48,   facPct:1.34  },
  { c:'France',         n:14,  pct:4.95,  fac:111,  facPct:3.09  },
];
var SC_GEO_TOTAL = { suppliers:283, facilities:3590 };
var SC_CUST_TOP = [
  { n:'TD SYNNEX',                rel:41.01,  revPct:'0.02' },
  { n:'Casino Guichard Perrachon',rel:35.99,  revPct:'0.02' },
  { n:'CDW Corp',                 rel:11.55,  revPct:'<0.01' },
  { n:'Insight Enterprises',      rel:4.54,   revPct:'<0.01' },
  { n:'El Puerto de Liverpool',   rel:2.46,   revPct:'<0.01' },
];
var SC_CUST_GEO = { total:244, facilities:2722 };
// Per-supplier "what they supply / why it matters" for the click-through pop-up.
var SC_SUP_WHAT={
  'NVIDIA':'GPUs (H100/Blackwell) — the core of the AI-training + inference build. Meta\'s single largest relationship and the #1 reason capex is exploding. Meta is diversifying (MTIA custom silicon, AMD) to reduce this dependence.',
  'SK hynix':'HBM (high-bandwidth memory) that sits on the GPUs — the component whose price spike Meta blamed for the Q1 2026 capex raise. A genuine bottleneck for the whole industry.',
  'GoerTek':'Assembles Meta Quest headsets (and acoustic components). One of Meta\'s most dependent suppliers (~26% of its revenue from Meta) — a Reality Labs hardware lever.',
  'Broadcom':'Co-developing Meta\'s custom AI silicon (the >1 GW in-house program) + networking. The strategic hedge against NVIDIA — and why ex-director Hock Tan moved to an advisor role.',
  'Celestica':'Contract manufacturer for data-center hardware (servers, networking) — builds the physical AI infrastructure. CAPEX, depreciates over years.',
  'AMD':'Alternative AI accelerators (MI-series) in the Andromeda inference engine — the multi-vendor strategy that lowers cost-per-inference and reduces NVIDIA reliance.',
  'Western Digital':'Storage (HDD/SSD) for the data lakes that feed model training. CAPEX infrastructure.',
  'Accton Technology':'Networking / switch hardware (ODM) — the fabric connecting GPU clusters. Books as COGS.',
  'Qualcomm':'Chips for Quest / smart-glasses (Snapdragon XR) — the Reality Labs device silicon.',
  'CoreWeave':'Rented GPU cloud capacity — part of the ~$237.7B third-party cloud commitments. Hits the P&L as opex, invisible in the capex line.',
  'TaskUS':'Content moderation / trust-and-safety BPO. Most Meta-dependent supplier here (~26%) — an SG&A relationship, not infrastructure.',
  'Corning':'Optical fiber / glass for data-center interconnect (and Gorilla Glass for devices).',
};
var SC_NOTE='Source: Bloomberg Supply Chain Analysis (SPLC) for META US Equity, as of 26-Jun-2026. Total Relationship Size is Bloomberg’s estimate of the dollar value of the commercial relationship. Cost Category indicates where the spend lands in Meta’s financials. Supplier’s Source Revenue % indicates the supplier’s revenue dependency on Meta. Point-in-time snapshot, not a live feed.';

// ─── Earnings Calls — management narrative tracker ──────────────────────────
var CALLS = [
  { q:'Q1 2026', date:'Apr 29, 2026', chg:-8.6,
    hl:[ 'CapEx raised AGAIN to $125–145B — "higher component costs, particularly <b>memory pricing</b>."',
      'Muse Spark released (MSL’s first model). "Fastest lab from standing up to widely accepted strong model."',
      'Narrative: assistant → <b>agent</b>. "Agents that understand your goals and work day and night to help you achieve them." Business AIs: 10M weekly conversations (from 1M at year start).' ]},
  { q:'Q4 2025', date:'Jan 28, 2026', chg:+10.4,
    hl:[ '"RL losses will <b>peak in 2026</b>, then gradually reduce" — first concrete inflection guidance on Reality Labs.',
      'CapEx guided $115–135B; expenses $162–169B — but: "operating income above 2025." Spending through it, not at the expense of profit.',
      '"Personal superintelligence" — AI that understands your goals and tailors feeds + agents to help you achieve them.' ]},
  { q:'Q3 2025', date:'Oct 29, 2025', chg:-11.3,
    hl:[ '"Front-load for the <b>most optimistic</b> superintelligence cases" — capex philosophy crystallized. If slower, "extra compute accelerates core business profitably."',
      'Instagram 3B MAU; Threads 150M DAP; Reels ARR >$50B — core business strength IS the funding mechanism.',
      'Display glasses sold out in 48 hours — "clearly leading." RL investment pivoting toward wearables, away from VR.' ]},
  { q:'Q2 2025', date:'Jul 30, 2025', chg:+11.2,
    hl:[ '<b>Meta Superintelligence Labs (MSL)</b> founded — Wang, Friedman, Shengjia Zhao. "Highest talent-density lab in the industry."',
      '"Superintelligence is now <b>in sight</b>" — most aggressive timeline statement. Self-improvement: "slow for now, but undeniable."',
      'Infrastructure named: Prometheus (1GW+), Hyperion (5GW), multiple Titan clusters.' ]},
  { q:'Q1 2025', date:'Apr 30, 2025', chg:+4.2,
    hl:[ 'Five opportunities framework: improved ads, engaging experiences, business messaging, Meta AI, AI devices. "Don’t need to succeed in ALL five to have good ROI."',
      'CapEx raised to $64–72B; 2026 will see "similarly significant dollar growth." GEM ads model: 2× more efficient per unit of compute.',
      '~1B Meta AI MAU; standalone app launched — but re-set expectations: "at least the next year" focused on scaling, not monetizing.' ]},
  { q:'Q4 2024', date:'Jan 29, 2025', chg:+1.6,
    hl:[ '"<b>48 weeks</b> to get on the trajectory we want in AI" — urgency framing. AI coding agent: "potentially one of the most important innovations in history."',
      'CapEx guided $60–65B for 2025 — nearly doubled. "Hundreds of billions over the long term."',
      'DeepSeek response: "more compute at inference means we can provide <b>higher quality of service</b> than those without the business model to sustain it."' ]},
  { q:'Q3 2024', date:'Oct 30, 2024', chg:-4.1,
    hl:[ 'Llama 4 training on a <b>100K+ H100</b> cluster — "bigger than anything I’ve seen reported for what others are doing."',
      'Ray-Ban Meta clear edition sold out, reselling at >$1,000 — <b>glasses category validated</b> as real consumer electronics.',
      'Budget planning: "a lot of new opportunities to accelerate the core business with strong ROI — I think we should invest more."' ]},
  { q:'Q2 2024', date:'Jul 31, 2024', chg:+4.8,
    hl:[ 'Llama 3.1 released — "first frontier-level open source model; an <b>inflection point</b> where open source becomes the industry standard."',
      'Long-term ad vision: "advertisers will just tell us an objective and a budget, and <b>we’ll do the rest</b>."',
      '"Significant CapEx growth in 2025" — first forward signal, preparing the market one quarter early.' ]},
  { q:'Q1 2024', date:'Apr 24, 2024', chg:-10.6,
    hl:[ 'Explicit investor warning: "<b>multi-year investment cycle</b> before Meta AI is profitable — expect stock volatility." Market sold off hard.',
      'CapEx raised to $35–40B (from $30–37B) — the opening move of the infrastructure ramp.',
      '"Meta AI with Llama 3 is the most intelligent AI assistant you can freely use" — quality claim staked; playbook: scale first, monetize later.' ]},
  { q:'Q4 2023', date:'Feb 1, 2024', chg:+20.3,
    hl:[ 'Year of Efficiency declared successful — leaner company as a <b>permanent operating philosophy</b>, not a one-off cost cut.',
      'Full general intelligence is now the stated product goal — "need reasoning, planning, coding, memory." FAIR moved closer to Gen AI team.',
      'First-ever dividend declared ($0.50/share quarterly) + $50B buyback auth — signaled the business can fund AI AND return cash.' ]},
];
var CALLS_NOTE='Highlights extracted from Meta Platforms earnings call transcripts. Written from the perspective of what was said AT THE TIME, not with hindsight. Stock-price changes are approximate next-trading-day moves. Source: Meta investor relations.';
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ CALL PREP — the decision layer (docs/CALL_PREP_CONVENTIONS.md v2.4)
//  Ported from the Visa build. Setup · Watch List · Post-Results · Post-Call as
//  per-quarter blocks behind a quarter selector. The theme record (META_THEMES) is
//  FOLDED into the Watch List (v2.3). META holds an earnings call + a same-day
//  Follow-Up Q&A per quarter — per §3 they are ONE call (docs/calls/META*.md).
//  Palette: reuses META's BRAND (#0866FF) + GREEN; adds the accents the machinery
//  needs without clobbering META's existing BRAND2/GRAY. Consensus/Summit/customs
//  render 'to fill'/'to define' until the export lands.
// ════════════════════════════════════════════════════════════════════════════
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F', CP_GRAY='#6B7684';
var CALL_PREP = { ticker:'META', quarters:[
  // ── UPCOMING: Q2 2026 (quarter ending Jun 2026; reports ~late July 2026) ──
  { q:'Q2 2026', status:'upcoming', date:'reports ~late July 2026',
    setup:{ source:'Bloomberg BST consensus — to import from the export', asOf:null,
      headline:[
        {k:'Revenue', cons:null, us:null, note:{t:'Guided $58–61B',h:'Management guided Q2 2026 total revenue to <b>$58–61B</b>, with FX an ~2% tailwind. Ad demand + price/ad the drivers; comps toughen vs Q2 2025. Street/Summit fill from the Bloomberg export.'}},
        {k:'Operating income', cons:null, us:null, note:{t:'FY26 op income above FY25',h:'Management reiterated FY26 operating income above 2025 — but the swing is total-expense growth ($162–169B FY) and the capex-driven depreciation ramp.'}},
        {k:'EPS', cons:null, us:null, note:{t:'Watch the tax line',h:'Recent EPS has been distorted by tax items (the Q3\'25 $15.93B non-cash charge partially relieved by an $8.03B Q1\'26 benefit). Guided tax rate 13–16% for the rest of 2026 — read EPS ex the discrete items.'}},
        {k:'EBITDA', cons:null, us:null},
      ],
      custom:[ {k:null},{k:null},{k:null},{k:null} ], // 4 custom KPIs — to define with Dani (candidates: FoA ad revenue · ad impressions growth · price per ad · capex)
      marketDebate:{
        fear:'That capex keeps escalating with no ROIC framework — FY26 raised AGAIN to $125–145B, a $107B step-up in contractual commitments, and peers flagging a big 2027 step-up — while the AI payoff (Muse/MSL) is still qualitative.',
        real:'Consensus sees the ad engine (revenue +33%, price/ad +12%, 41% op margin) comfortably funding the build; it treats the spend as the cost of a credible AI position and debates the TIMING of monetization, not solvency.',
        mech:[ {k:'Capex FY26',v:'raised to $125–145B',dir:'up'}, {k:'Contractual commitments',v:'+$107B step-up',dir:'up'}, {k:'Depreciation / FCF',v:'pressure builds',dir:'down'}, {k:'Ad engine',v:'+33%, price +12%',dir:'up'} ],
        synth:'The one thing to resolve: does the AI investment start showing <b>monetization / ROIC signposts</b> — or does another capex raise (plus the hinted 2027 step-up) arrive with the payoff still described in adjectives?'
      },
      debate:null },
    watchList:[
      { rank:1, metric:'Capex escalation + 2027 signposts', since:'Q1 2026', tags:['capex','commitments','roic'],
        pista:'Does the capex guide hold at $125–145B, and does management put ANY framework on 2027 / the $107B commitment step-up and the ROIC of the AI build?',
        breaks:'Another capex raise arrives with 2027 still unquantified and no monetization/ROIC signpost — spend running further ahead of proof.',
        seededBy:{ q:'Q1 2026', n:'FY26 capex raised to $125–145B (from $115–135B) on memory/component costs; $107B step-up in contractual commitments; Susan declined a 2027 number ("dynamic planning"); Brian Nowak pushed on ROIC signposts and got qualitative milestones only.' },
        src:'Q1 2026: capex guide $125–145B; $107B commitment step-up (multi-year cloud + infra); FY expenses $162–169B.',
        why:'The capex trajectory is the whole bear case on FCF/returns — if it keeps rising without a monetization signpost, the multiple is exposed.',
        thread:[ {q:'Q4 2025',n:'Initial FY26 capex guide $115–135B; Meta Compute announced.'},{q:'Q1 2026',n:'Raised to $125–145B; $107B commitments; no 2027 figure.'} ] },
      { rank:2, metric:'Muse / MSL monetization', since:'Q1 2026', tags:['ai','muse','msl'],
        pista:'Beyond engagement gains — any revenue/monetization signal from Muse Spark / Meta Superintelligence Labs products, or a clearer product-to-revenue path?',
        breaks:'The AI products stay engagement-only with no monetization path as the second model ships.',
        seededBy:{ q:'Q1 2026', n:'Muse Spark (first MSL model) drove double-digit Meta-AI session gains but no revenue; Mark framed ROIC as "build leading models → leading products → monetize at scale" with no financial milestones.' },
        src:'Q1 2026: Muse Spark powering Meta AI; MSL "on track to be a leading lab"; next models in training.',
        why:'The capex is justified by the AI product bet — the bet needs to convert engagement into revenue to underwrite the spend.',
        thread:[ {q:'Q4 2025',n:'MSL rebuilt in 2025; first models "shipping over coming months."'},{q:'Q1 2026',n:'Muse Spark shipped; +double-digit Meta AI sessions/user; monetization TBD.'} ] },
      { rank:3, metric:'Ad-engine durability into tougher comps', since:'Q1 2026', tags:['ads','price-per-ad','impressions'],
        pista:'Do ad revenue / price-per-ad / impressions hold as comps toughen — is the GEM/Lattice/Adaptive-Ranking gain durable?',
        breaks:'Ad revenue decelerates sharply below ~20% as comps toughen and price/ad normalizes.',
        seededBy:{ q:'Q1 2026', n:'Ad rev +33%, price/ad +12%, impressions +19% on AI ranking gains (GEM, Lattice, Adaptive Ranking Model, value-optimization run-rate >$20B) — the cash engine funding the AI build.' },
        src:'Q1 2026: FoA ad revenue $55.0B (+33%); price/ad +12%; impressions +19%; Q2 revenue guided $58–61B.',
        why:'The ad engine funds everything; any crack in it pulls the rug from the AI-capex thesis.',
        thread:[ {q:'Q4 2025',n:'Ad rev +24%, price/ad +6%, impressions +18%; record holiday demand.'},{q:'Q1 2026',n:'Ad rev +33%, price/ad +12% — acceleration on AI ranking.'} ] },
      { rank:4, metric:'Reality Labs loss trajectory', since:'Q1 2026', tags:['reality-labs','glasses'],
        pista:'Do RL losses actually peak this year and start declining, with the glasses pivot offsetting Quest weakness?',
        breaks:'RL losses grow rather than peak, or the glasses ramp stalls.',
        seededBy:{ q:'Q4 2025', n:'Management said RL losses would be ~flat this year and this "will likely be the peak," pivoting investment to glasses/wearables; AI glasses sales tripled.' },
        src:'Q1 2026: RL revenue $402M (−2%) — Quest down, glasses up; losses framed as peaking.',
        why:'RL is the persistent drag; the glasses pivot + loss peak is the turn the bulls need.',
        thread:[ {q:'Q4 2025',n:'RL rev $955M (−12%); losses "peak" this year; glasses tripled.'},{q:'Q1 2026',n:'RL rev $402M (−2%); glasses growth offsetting Quest.'} ] },
      { rank:5, metric:'Regulatory / legal (EU + US youth trials)', since:'Q1 2026', tags:['regulatory','legal'],
        pista:'Any resolution or escalation on the EU headwinds and the US youth-related trials flagged as a possible material loss?',
        breaks:'A trial or EU action lands as a material loss or forces a product/monetization change.',
        seededBy:{ q:'Q1 2026', n:'Management flagged EU + US headwinds, scrutiny on youth issues, and "additional trials scheduled this year in the US, which may ultimately result in a material loss."' },
        src:'Q1 2026: legal expense elevated; youth-related US trials scheduled; EU DMA/regulatory overhang.',
        why:'A tail risk that can hit both the P&L (fines/accruals) and the ad model (consent/targeting).',
        thread:[ {q:'Q4 2025',n:'Legal expense growth (accruals + charges); EU DMA overhang.'},{q:'Q1 2026',n:'US youth trials this year; possible material loss flagged.'} ] },
    ],
    results:null, call:null },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 29 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 29, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'Strong ad growth (high-20s/low-30s), 40%+ op margin, and the first model from Meta Superintelligence Labs. The open questions: how much higher does capex go, and does the AI investment show any ROIC signpost?',
      oneLiner:'The bar was "ad engine keeps humming + first AI model lands" — Meta beat on revenue but raised capex AGAIN and gave no ROIC framework, so the debate stayed spend-vs-proof.' },
    watchList:[
      { rank:1, metric:'Capex FY26 guide trajectory', since:'Q4 2025', tags:['capex'],
        pista:'Does the FY26 capex guide hold at $115–135B, or get raised again?', breaks:'Capex raised materially with no monetization signpost.',
        seededBy:{ q:'Q4 2025', n:'Q4 set the initial FY26 capex guide at $115–135B and announced Meta Compute; the question into Q1 was whether it holds.' },
        src:'Q4 2025: FY26 capex guide $115–135B.', why:'The core FCF/returns debate.' },
      { rank:2, metric:'AI product roadmap / first models', since:'Q4 2025', tags:['ai','msl'],
        pista:'Do the first MSL models ship and show a credible trajectory?', breaks:'Models slip or underwhelm vs the "leading lab" claim.',
        seededBy:{ q:'Q4 2025', n:'Q4: models "shipping over coming months"; MSL rebuilt in 2025; the question was execution.' },
        src:'Q4 2025: first models to ship over coming months; personal-superintelligence vision.', why:'Justifies the capex.' },
      { rank:3, metric:'Ad-engine strength into comps', since:'Q4 2025', tags:['ads'],
        pista:'Does ad growth hold as comps toughen off a record holiday quarter?', breaks:'Ad revenue decelerates below ~20%.',
        seededBy:{ q:'Q4 2025', n:'Q4 ad rev +24% on record holiday demand + AI ranking; the question was durability.' },
        src:'Q4 2025: ad rev +24%; price/ad +6%; impressions +18%.', why:'Funds everything.' },
      { rank:4, metric:'Reality Labs losses (peak?)', since:'Q4 2025', tags:['reality-labs'],
        pista:'Do RL losses stay ~flat and confirm the peak, with glasses offsetting Quest?', breaks:'RL losses grow.',
        seededBy:{ q:'Q4 2025', n:'Q4: RL losses ~flat this year and "likely the peak"; glasses pivot.' },
        src:'Q4 2025: RL rev $955M (−12%); losses peaking; glasses tripled.', why:'The persistent drag turning.' },
      { rank:5, metric:'Efficiency / headcount', since:'Q4 2025', tags:['efficiency','headcount'],
        pista:'Does the "leaner, AI-native" operating model show up in headcount / opex discipline?', breaks:'Opex growth outruns the efficiency narrative.',
        seededBy:{ q:'Q4 2025', n:'Q4: investing in AI-native tooling, elevating ICs, flattening teams; the question was whether it shows in the numbers.' },
        src:'Q4 2025: 78,800 employees (+6%); AI-native operating-model framing.', why:'The offset to the capex ramp.' },
    ],
    results:{
      headline:'A strong ad print overshadowed by the spend: revenue $56.3B (+33%), op income $22.9B (41% margin) — but capex was RAISED again to $125–145B, contractual commitments stepped up $107B, and EPS ($10.44) was flattered by an $8.03B tax benefit (ex-benefit $7.31).',
      thesisCheck:[
        {line:'Ad engine strong into comps', tripped:false, note:'Ad rev +33%, price/ad +12%, impressions +19% — accelerated on AI ranking; held strongly.'},
        {line:'Capex FY26 guide holds ($115–135B)', tripped:true, note:'⚑ RAISED to $125–145B on memory/component costs; +$107B contractual commitments — the guide did not hold.'},
        {line:'First MSL model ships credibly', tripped:false, note:'Muse Spark shipped; double-digit Meta-AI session gains; "leading lab on track" — held (engagement, not revenue yet).'},
        {line:'RL losses peaking; glasses offset', tripped:false, note:'RL rev $402M (−2%); glasses up, Quest down — consistent with the peak framing; held.'},
      ],
      scorecard:[
        {metric:'Capex FY26 guide', cons:null, actual:'raised to $125–145B (from $115–135B)', result:'nocons', surprise:80, watchRank:1, note:{t:'The real news in the print',h:'Raised on higher component/memory pricing + additional data-center costs; plus a $107B step-up in contractual commitments (multi-year cloud + infra). No 2027 figure — "dynamic planning."'}},
        {metric:'Revenue', cons:null, actual:'$56.3B (+33%)', result:'beat', surprise:60, watchRank:3, note:{t:'FX +~? tailwind',h:'FoA ad revenue $55.0B (+33%; +29% cc); price/ad +12%; impressions +19%.'}},
        {metric:'EPS (GAAP)', cons:null, actual:'$10.44 (ex-tax-benefit $7.31)', result:'beat', surprise:55, watchRank:null, note:{t:'Tax-flattered',h:'An $8.03B tax benefit partially relieved the Q3\'25 $15.93B non-cash charge; Q1 tax rate −23% (14% absent the benefit). Read EPS ex the discrete items.'}},
        {metric:'Operating income', cons:null, actual:'$22.9B (41% margin)', result:'beat', surprise:45, watchRank:null},
        {metric:'Price per ad', cons:null, actual:'+12%', result:'beat', surprise:45, watchRank:3, note:{t:'Accelerating',h:'Up from +6% in Q4 on ad-performance improvements, better macro, and FX; partially offset by lower-monetizing-region impression mix.'}},
        {metric:'Total expenses (FY26 guide)', cons:null, actual:'$162–169B (unchanged)', result:'nocons', surprise:30, watchRank:5, note:{t:'Opex guide held',h:'Unchanged from prior; the escalation is in capex, not opex. Headcount reduction planned for May.'}},
        {metric:'Reality Labs revenue', cons:null, actual:'$402M (−2%)', result:'inline', surprise:20, watchRank:4},
        {metric:'Q2 revenue guide', cons:null, actual:'$58–61B', result:'nocons', surprise:35, watchRank:null, note:{t:'~2% FX tailwind',h:'Comps toughen vs Q2 2025; the guide implies continued strong ad growth.'}},
      ],
      intoCall:[
        'How much higher does capex go — any 2027 framework or ROIC signpost?',
        'Does Muse Spark / MSL have any monetization path, or is it engagement-only?',
        'How durable is the ad-engine acceleration (price/ad +12%) into tougher comps?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A strong ad print whose <b>story is the spend</b>: revenue +33% and a 41% op margin, but capex was raised AGAIN to $125–145B with a $107B step-up in contractual commitments — and management framed the AI payoff (Muse Spark / MSL) in <b>milestones, not dollars</b>. The ad engine is funding a bet whose ROIC is still asserted, not shown; EPS optics ($10.44) were tax-flattered.',
      highlights:[
        { tag:'watch', band:'lead', head:'Capex raised AGAIN to <b>$125–145B</b> + a <b>$107B</b> step-up in contractual commitments — with no 2027 number.',
          open:'Where is the ROIC framework? Brian Nowak asked for signposts; Mark gave qualitative milestones (model quality → product scale → monetization), and Susan declined a 2027 figure ("dynamic planning").',
          detail:'<p>The FY26 capex guide went from $115–135B (Q4) to <b>$125–145B</b> on higher memory/component pricing plus additional data-center costs. On top, multi-year cloud deals + infrastructure purchase agreements drove a <b>$107B step-up in contractual commitments</b> this quarter — spend that lands over 2026–2027.</p><p>Peers flagged a big 2027 step-up on their own calls; Susan would not quantify Meta\'s, citing a "very dynamic planning process." So the spend keeps climbing while the return remains a <b>trajectory, not a number</b> — the core tension of the print.</p>' },
        { tag:'thesis', band:'lead', head:'Muse Spark / MSL: the first model landed, but the payoff is <b>engagement, not revenue</b>.',
          open:'What monetizes it? Double-digit Meta-AI session gains are promising, but there is no revenue signal or product-to-revenue timeline — the thing the $125–145B is meant to earn.',
          detail:'<p>Muse Spark — the first model from Meta Superintelligence Labs — now powers Meta AI across the Family of Apps, driving <b>double-digit percent increases in Meta-AI sessions per user</b> and a top-of-app-store ranking. Mark: the lab is "on track to be a leading lab," with more advanced models in training.</p><p>His ROIC formula ("build leading models → leading products → monetize at scale") is the same one Meta has run for 20 years — but for now the AI bet is validated on <b>usage and model quality</b>, not dollars. That is the gap the next few prints have to close.</p>' },
        { tag:'thesis', band:'context', head:'The ad engine <b>accelerated</b> — revenue +33%, price/ad +12%, impressions +19%.',
          detail:'<p>FoA ad revenue $55.0B (+33%); price/ad +12% (up from +6% in Q4); impressions +19%. Driven by AI ranking (GEM, Lattice, Adaptive Ranking Model), value-optimization run-rate now >$20B (2x YoY), partnership-ads run-rate $10B (2x). This is the cash engine underwriting the AI build — settled strength.</p>' },
        { tag:'thesis', band:'context', head:'Business AIs scaling — <b>10M conversations/week</b>, up from 1M at the start of the year.',
          detail:'<p>Business AIs expanded on WhatsApp (LatAm, Indonesia) and Messenger (APAC); the Meta AI business assistant fully rolled out to eligible advertisers (20% higher issue-resolution rate). 8M+ advertisers using gen-AI creative tools. Early monetization surface for the AI stack.</p>' },
        { tag:'thesis', band:'context', head:'Leaner operating model — headcount reduction planned for <b>May</b>; opex guide unchanged.',
          detail:'<p>77,900 employees (−1% QoQ); a further reduction announced internally for May. FY26 total-expense guide held at $162–169B. The "AI-native, flatter teams" framing as the offset to the capex ramp.</p>' },
        { tag:'watch', band:'logged', head:'EPS $10.44 <b>tax-flattered</b> — $8.03B benefit vs the Q3\'25 $15.93B charge.',
          detail:'<p>Q1 tax rate −23% on an $8.03B benefit partially relieving the prior R&D-capitalization charge; ex-benefit EPS would be $7.31 and tax rate 14%. Guided 13–16% for the rest of 2026. Read the EPS line ex the discrete items.</p>' },
        { tag:'watch', band:'logged', head:'Regulatory: US <b>youth trials</b> this year — "may result in a material loss"; EU headwinds.',
          detail:'<p>Legal expense elevated; management flagged additional US youth-related trials in 2026 and continued EU/US scrutiny that "could significantly impact our business and financial results."</p>' },
        { tag:'watch', band:'logged', head:'Custom silicon + Reality Labs pivot — Broadcom 1GW, AMD, Nvidia; glasses tripling.',
          detail:'<p>Rolling out >1GW of Meta\'s own Broadcom-developed silicon + AMD to complement Nvidia ("Meta Compute" efficiency edge). RL revenue $402M (−2%): Quest down, AI glasses tripling YoY; losses framed as peaking this year.</p>' },
      ],
      dots:'The two lead items are the same trade from both sides: the <b>capex keeps rising</b> (now $125–145B + $107B commitments) precisely because the <b>AI products are working on engagement</b> (Muse Spark) — but neither the spend nor the payoff has a number attached (no 2027 capex, no AI revenue). The ad engine (+33%, price +12%) is the only fully-quantified part of the story, and it is funding a bet the market is asked to take on trajectory. The next print\'s job: put a number on either side.',
      threeMinutes:[
        '<b>The print is about the spend, not the beat.</b> Revenue +33% and a 41% margin are great, but capex was raised AGAIN to $125–145B with a $107B step-up in contractual commitments — and management gave no 2027 figure and no ROIC framework (Brian Nowak asked; Mark gave qualitative milestones). The debate stays spend-vs-proof.',
        '<b>Muse Spark landed — the AI bet is validated on engagement, not revenue.</b> The first Meta-Superintelligence-Labs model drove double-digit Meta-AI session gains, but there\'s no monetization path yet. That\'s the gap the capex is meant to close, and the next prints have to start closing it.',
        '<b>The ad engine is the only fully-quantified part of the story — and it\'s accelerating.</b> Ad revenue +33%, price/ad +12% (from +6%), impressions +19% on AI ranking; value-optimization run-rate >$20B. It\'s funding everything; watch it as the tell if the AI spend is ever going to be underwritten.',
      ],
      notBringing:[
        {item:'EPS $10.44 headline', why:'Tax-flattered by an $8.03B benefit; the clean number is ~$7.31 — leading with the headline EPS misreads the quarter.'},
        {item:'Reality Labs quarterly revenue', why:'$402M (−2%) is noise; the signal is the loss-peak framing + glasses pivot, not the print.'},
        {item:'Individual ad-product features', why:'GEM/Lattice/Adaptive Ranking are real but everyone has the release; the debate is capex ROIC, not feature lists.'},
      ],
      newQuestions:[
        {n:'How much higher does capex go — any 2027 framework or ROIC signpost?', landed:{q:'Q2 2026', rank:1}, tripped:true},
        {n:'Does Muse Spark / MSL have a monetization path, or engagement-only?', landed:{q:'Q2 2026', rank:2}},
        {n:'How durable is the ad-engine acceleration into tougher comps?', landed:{q:'Q2 2026', rank:3}},
        {n:'Do Reality Labs losses actually peak and start declining?', landed:{q:'Q2 2026', rank:4}},
        {n:'How do the US youth trials / EU headwinds resolve?', landed:{q:'Q2 2026', rank:5}},
      ] } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Jan 28 2026) ──
  { q:'Q4 2025', status:'reported', date:'January 28, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A record holiday quarter: mid-20s ad growth, 40%+ margin, and the initial FY26 capex/expense frame. The open question was how big the 2026 AI-infra step-up would be and whether the AI product roadmap was credible.',
      oneLiner:'The bar was "finish 2025 strong and set a credible FY26 spend frame" — Meta beat (+24%, 41% margin) and set FY26 capex at $115–135B, framing 2026 as the year AI changes how it works.' },
    watchList:[
      { rank:1, metric:'FY26 capex / infra step-up', since:'Q3 2025', tags:['capex'],
        pista:'How big is the initial FY26 capex guide, and how is the AI-infra ramp framed?', breaks:'A guide so large it swamps FCF with no product payoff.',
        src:'Q3 2025: 2026 capex flagged to step up significantly.', why:'The core spend debate.' },
      { rank:2, metric:'AI roadmap / superintelligence', since:'Q3 2025', tags:['ai','msl'],
        pista:'Is the rebuilt AI program (MSL) going to ship credible models in 2026?', breaks:'Roadmap slips or lacks specificity.',
        src:'Q3 2025: MSL formed; talent war; models being rebuilt.', why:'Justifies the spend.' },
      { rank:3, metric:'Ad-engine holiday strength', since:'Q3 2025', tags:['ads'],
        pista:'Does the holiday quarter deliver record ad demand + AI-ranking gains?', breaks:'Ad growth decelerates below ~20%.',
        src:'Q3 2025: ad growth strong on AI ranking (GEM/Advantage+).', why:'Funds everything.' },
      { rank:4, metric:'Reality Labs losses', since:'Q3 2025', tags:['reality-labs'],
        pista:'Does management frame an RL loss peak + glasses pivot?', breaks:'Losses set to grow further.',
        src:'Q3 2025: RL losses large; glasses momentum building.', why:'The persistent drag.' },
      { rank:5, metric:'Tax / one-time noise', since:'Q3 2025', tags:['tax'],
        pista:'How does the Q3\'25 $15.93B non-cash tax charge flow through / reverse?', breaks:'Further large tax/legal charges distort the print.',
        src:'Q3 2025: $15.93B non-cash tax charge (R&D capitalization).', why:'EPS optics.' },
    ],
    results:{
      headline:'A record close to 2025: revenue $59.9B (+24%), op income $24.7B (41% margin), EPS $8.88 — with the initial FY26 capex frame ($115–135B) and "2026 is the year AI changes how we work" as the setup.',
      thesisCheck:[
        {line:'Ad engine record holiday strength', tripped:false, note:'Ad rev +24% on record holiday demand + AI ranking; held.'},
        {line:'Credible FY26 capex frame', tripped:false, note:'Set at $115–135B with Meta Compute; framed but large — held (and later raised in Q1).'},
        {line:'AI roadmap credible', tripped:false, note:'First models "shipping over coming months"; MSL rebuilt — held (execution TBD).'},
        {line:'RL losses framed to peak', tripped:false, note:'Losses ~flat this year and "likely the peak"; glasses pivot — held.'},
      ],
      scorecard:[
        {metric:'FY26 capex guide (initial)', cons:null, actual:'$115–135B', result:'nocons', surprise:65, watchRank:1, note:{t:'The setup for the year',h:'Initial FY26 frame; Meta Compute announced (efficiency edge); Dina Powell McCormick joins to lead sovereign/strategic-capital partnerships for capacity.'}},
        {metric:'Revenue', cons:null, actual:'$59.9B (+24%; +23% cc)', result:'beat', surprise:50, watchRank:3, note:{t:'Record holiday demand',h:'FoA ad revenue $58.1B (+24%); price/ad +6%; impressions +18%.'}},
        {metric:'Operating income', cons:null, actual:'$24.7B (41% margin)', result:'beat', surprise:40, watchRank:null},
        {metric:'EPS', cons:null, actual:'$8.88', result:'beat', surprise:40, watchRank:5, note:{t:'Tax rate 10%',h:'Tax rate 10% (below the 12–15% outlook) on settlements; a cleaner quarter than the tax-noisy Q3\'25/Q1\'26.'}},
        {metric:'Total expenses', cons:null, actual:'$35.1B (+40%)', result:'miss', surprise:45, watchRank:null, note:{t:'The cost ramp',h:'Up 40% on employee comp (AI talent), legal expense, and infrastructure (depreciation + cloud). The margin held at 41% only because revenue grew fast.'}},
        {metric:'Reality Labs revenue', cons:null, actual:'$955M (−12%)', result:'inline', surprise:20, watchRank:4, note:{t:'Quest lapping',h:'Down on lapping Quest 3S + Q3 channel-fill; losses framed as peaking; glasses tripled for the year.'}},
        {metric:'Headcount', cons:null, actual:'78,800 (+6% YoY)', result:'nodisc', surprise:25, watchRank:null, note:{t:'Hiring AI + compliance',h:'Up on monetization, infrastructure, MSL, and regulation/compliance hiring — the "leaner" pivot comes in 2026.'}},
      ],
      intoCall:[
        'How big does the 2026 capex ramp get, and is the AI roadmap specific?',
        'Does the ad engine hold as holiday comps roll off?',
        'Is the Reality Labs loss peak real, and how fast do glasses scale?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A record close to 2025 (revenue +24%, 41% margin, EPS $8.88) that set the frame for the year to come: FY26 capex at <b>$115–135B</b>, Meta Compute as an efficiency thesis, and "2026 is the year AI changes how we work." Strong ad engine, but the story is the setup for a very large spend year.',
      highlights:[
        { tag:'thesis', band:'lead', head:'FY26 capex framed at <b>$115–135B</b> + Meta Compute — the spend year is set.',
          open:'How much does it climb from here, and what returns? The frame is large and explicitly a starting point; the ROIC question was left for execution.',
          detail:'<p>Management set the initial FY26 capex guide at $115–135B and introduced <b>Meta Compute</b> — the thesis that being the most efficient at building infrastructure becomes a strategic advantage. <b>Dina Powell McCormick</b> joined as President & Vice Chairman to lead sovereign / strategic-capital partnerships for long-term capacity. The setup for a very large, AI-driven spend year.</p>' },
        { tag:'thesis', band:'context', head:'Ad engine record holiday strength — revenue +24%, price/ad +6%, impressions +18%.',
          detail:'<p>Record-breaking holiday demand + AI-ranking gains (Reels watch-time +30% YoY US; Facebook video double-digit). The cash engine funding the AI build.</p>' },
        { tag:'thesis', band:'context', head:'"2026 is the year AI changes how we work" — leaner, AI-native, flatter teams.',
          detail:'<p>Mark: investing in AI-native tooling, elevating ICs, flattening teams; "projects that used to require big teams now done by a single talented person." The efficiency offset to the capex ramp — to show up in 2026.</p>' },
        { tag:'thesis', band:'context', head:'Reality Labs — losses "likely the peak" this year; investment pivots to glasses.',
          detail:'<p>RL rev $955M (−12%) on Quest lapping; losses ~flat this year and "likely the peak," then gradually declining. Investment redirected to glasses/wearables (tripled sales) + making Horizon/VR sustainable.</p>' },
        { tag:'watch', band:'logged', head:'Expenses +40% — the cost ramp is real; margin held only on revenue speed.',
          detail:'<p>Total expenses $35.1B (+40%) on AI-talent comp, legal expense, and infrastructure (depreciation + cloud). The 41% margin held because revenue grew +24% — a dynamic to watch as growth normalizes.</p>' },
        { tag:'watch', band:'logged', head:'Tax rate 10% — a clean quarter between the tax-noisy Q3\'25 and Q1\'26.',
          detail:'<p>Tax rate 10% (below the 12–15% outlook) on settlements. Contrast with the Q3\'25 $15.93B non-cash R&D-capitalization charge and the Q1\'26 $8.03B partial reversal.</p>' },
      ],
      dots:'The Q4 print planted the two tensions that dominate 2026: the <b>capex frame</b> ($115–135B, explicitly a floor) and the <b>AI roadmap</b> (models "shipping soon"). Both resolved toward "bigger and later" in Q1 2026 — capex raised to $125–145B and the first model (Muse Spark) shipping on engagement, not revenue — which is exactly the spend-vs-proof debate that carried forward.',
      threeMinutes:[
        '<b>Record close to 2025, but the story is the setup for a huge spend year.</b> Revenue +24%, 41% margin, EPS $8.88 — and FY26 capex framed at $115–135B (a floor) with Meta Compute as the efficiency thesis. Watch how much higher it climbs.',
        '<b>The ad engine delivered a record holiday</b> (+24%, price/ad +6%) on AI ranking — the cash engine that has to fund the AI build. Durability into 2026 comps is the tell.',
        '<b>Two forward tensions planted:</b> the capex frame (explicitly a starting point) and the AI roadmap (models "shipping soon"). Both are the spend-vs-proof debate that defines the year — and 2026 is framed as when AI changes how Meta itself works (leaner, flatter).',
      ],
      notBringing:[
        {item:'Reality Labs quarterly revenue', why:'$955M (−12%) is Quest-lapping noise; the signal is the loss-peak framing.'},
        {item:'Tax rate 10%', why:'A clean quarter, but tax is noise across these prints — not thesis-moving.'},
        {item:'Individual engagement stats', why:'Reels/video gains are real but everyone has the release; the debate is the capex frame.'},
      ],
      newQuestions:[
        {n:'How big does the 2026 capex ramp get from the $115–135B frame?', landed:{q:'Q1 2026', rank:1}},
        {n:'Do the first MSL models ship credibly?', landed:{q:'Q1 2026', rank:2}},
        {n:'Does the ad engine hold as holiday comps roll off?', landed:{q:'Q1 2026', rank:3}},
        {n:'Is the Reality Labs loss peak real?', landed:{q:'Q1 2026', rank:4}},
        {n:'Does the "leaner, AI-native" model show up in headcount/opex?', landed:{q:'Q1 2026', rank:5}},
      ] } },
]};

function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-phtabs{display:inline-flex;gap:3px;background:rgba(8,102,255,0.06);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.cp-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.cp-phtab:hover{color:var(--navy)}.cp-phtab.active{background:'+BRAND+';color:#fff}'+
    '.cp-phpane[hidden]{display:none}'+
    '.cp-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.cp-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-qpill:hover{color:var(--navy)}.cp-qpill.active{background:'+BRAND+';color:#fff;border-color:'+BRAND+'}'+
    '.cp-qpill .cp-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.cp-qblock[hidden]{display:none}'+
    '.cp-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+CP_GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    '.cp-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.cp-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-wl-tag:hover{background:rgba(122,90,248,0.08)}.cp-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.cp-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.cp-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-wl-addform{display:flex;flex-direction:column;gap:7px;border:1px dashed '+BRAND+';border-radius:10px;padding:12px;margin:0 0 12px;background:rgba(8,102,255,0.03)}'+
    '.cp-wl-addform[hidden]{display:none}'+
    '.cp-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy)}'+
    '.cp-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:6px 13px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.cp-wl-all[hidden]{display:none}.cp-w[data-wlhide]{display:none}'+
    '.cp-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.cp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.cp-grid4{grid-template-columns:1fr 1fr}}'+
    '.cp-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.cp-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.cp-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    '.cp-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-ev-pill.active{background:'+BRAND+';color:#fff}'+
    '.cp-cell-custom{border-top-color:'+YELLOW+'}'+
    '.cp-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.cp-val{display:flex;align-items:baseline;gap:7px}'+
    '.cp-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.cp-val-cons .cp-val-lab{background:rgba(37,87,214,0.10);color:'+BLUE+'}'+
    '.cp-val-us .cp-val-lab{background:rgba(22,163,74,0.12);color:'+GREEN+'}'+
    '.cp-evwrap[data-ev="cons"] .cp-val-us{display:none}'+
    '.cp-evwrap[data-ev="us"] .cp-val-cons{display:none}'+
    '.cp-evwrap:not([data-ev="both"]) .cp-val-lab{display:none}'+
    '.cp-evwrap[data-ev="both"] .cp-cell-v{font-size:13px}'+
    '.cp-evwrap[data-ev="both"] .cp-val{margin-top:3px}'+
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(8,102,255,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.cp-watch{display:flex;flex-direction:column;gap:11px}'+
    '.cp-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.cp-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    '.cp-w-rank{width:26px;height:26px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}'+
    '.cp-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.cp-w-q{display:flex;gap:8px;align-items:flex-start;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;margin-top:8px}.cp-w-q .mic{flex:none}'+
    '.cp-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.cp-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.cp-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.cp-info:hover{filter:brightness(1.1)}'+
    '.cp-debate{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:4px 0}@media(max-width:600px){.cp-debate{grid-template-columns:1fr}}'+
    '.cp-dc{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.cp-dc.fear{border-top:4px solid '+RED+';background:linear-gradient(180deg,rgba(234,67,53,0.04),transparent)}'+
    '.cp-dc.real{border-top:4px solid '+GREEN+';background:linear-gradient(180deg,rgba(22,163,74,0.05),transparent)}'+
    '.cp-dc-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}'+
    '.cp-dc.fear .cp-dc-h{color:'+RED+'}.cp-dc.real .cp-dc-h{color:'+GREEN+'}'+
    '.cp-dc-b{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-mech{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0}'+
    '.cp-mech-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:800;border:1px solid var(--bdr);border-radius:9px;padding:7px 12px;background:var(--w);color:var(--navy)}'+
    '.cp-mech-ar{font-size:15px;color:var(--mu)}'+
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#E8A00C}'+
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(37,87,214,0.08);border:1px solid rgba(37,87,214,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#E8A00C}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(8,102,255,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
    '.cp-tc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.cp-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.cp-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.cp-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.cp-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    '.cp-sc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-sc-row{display:grid;grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.cp-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.cp-sc-c{font-size:11px;color:var(--mu)}.cp-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.cp-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '.cp-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(8,102,255,0.10);border:1px solid rgba(8,102,255,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.cp-sc-rk.blank{background:transparent;border:none}'+
    '.cp-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.cp-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.cp-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.cp-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    '.cp-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.cp-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.cp-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.cp-sc-row{grid-template-columns:1fr auto}.cp-sc-c,.cp-sc-a,.cp-sc-bw,.cp-sc-rk{display:none}}'+
    '.cp-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.cp-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.cp-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.cp-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.cp-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.cp-band-s{display:none}}'+
    '.cp-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    '.cp-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(8,102,255,0.05),transparent)}'+
    '.cp-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.cp-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.cp-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.cp-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.cp-3m-l{display:flex;flex-direction:column;gap:8px;counter-reset:m3}'+
    '.cp-3m-i{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;font-size:12.5px;line-height:1.55;color:var(--navy)}'+
    '.cp-3m-i::before{counter-increment:m3;content:counter(m3);width:20px;height:20px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none;margin-top:1px}'+
    '.cp-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.cp-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.cp-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.cp-nb-r b{color:var(--navy);font-weight:800}'+
    '.cp-nb-x{color:'+CP_GRAY+';font-weight:800;flex:none}'+
    '.cp-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.cp-nq{display:flex;flex-direction:column;gap:5px}'+
    '.cp-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.cp-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.cp-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.cp-nq-row{grid-template-columns:1fr}.cp-nq-land{margin-top:3px}}'+
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
function cpFmtC(o){ if(!o||o.v==null) return '<span class="cp-empty">—</span>';
  var un=o.unit||'', v=o.v, s;
  if(un==='$') s='$'+v; else if(un==='$M') s='$'+v+'M'; else if(un==='$B') s='$'+v+'B';
  else if(un==='%') s=v+'%'; else s=String(v);
  return s+(o.yoy!=null?'<span style="font-size:10px;color:#0a8f4c;font-weight:800;margin-left:5px">+'+o.yoy+'%</span>':''); }
function cpEvCell(key, m, isCustom){
  var name=m&&m.k?m.k:null;
  var q=(m&&m.note)?cpQ('setnote-'+key, m.note.t, m.note.h):'';
  var kHtml=name?esc(name):'<span class="cp-empty">Custom KPI — to define</span>';
  return '<div class="cp-cell'+(isCustom?' cp-cell-custom':'')+'"><div class="cp-cell-k">'+kHtml+q+'</div>'+
    '<div class="cp-cell-v">'+
      '<div class="cp-val cp-val-cons"><span class="cp-val-lab">Street</span>'+cpFmtC(m&&m.cons)+'</div>'+
      '<div class="cp-val cp-val-us"><span class="cp-val-lab">Summit</span>'+cpFmtC(m&&m.us)+'</div>'+
    '</div></div>';
}
// The source buttons — every Call Prep opens with IR + EDGAR (docs/CALL_PREP_CONVENTIONS §6).
var CP_IR_URL='https://investor.atmeta.com/';
var CP_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1326801&owner=exclude';
var CP_LOGO_URL='https://assets.parqet.com/logos/symbol/META';
var CP_SEC_SEAL='img/sec-seal.png';
function cpIRButton(){
  return '<style>'+
    '.cp-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.cp-srcrow{grid-template-columns:1fr}}'+
    '.cp-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1024 60%,#04060B 100%);border:1px solid rgba(8,102,255,.4);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.cp-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BLUE+','+YELLOW+','+GREEN+');height:4px;top:0}'+
    '.cp-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(8,102,255,.45);border-color:rgba(8,102,255,.85)}'+
    '.cp-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.cp-ir-ic{width:72px;height:72px;border-radius:18px;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(232,160,12,.35),0 0 32px rgba(8,102,255,.6)}'+
    '.cp-ir-ic img{width:52px;height:52px;object-fit:contain;display:block}'+
    '.cp-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.cp-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#E8A00C;display:flex;align-items:center;gap:7px}'+
    '.cp-ir-dot{width:7px;height:7px;border-radius:50%;background:'+GREEN+';box-shadow:0 0 0 0 rgba(22,163,74,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}70%{box-shadow:0 0 0 8px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}'+
    '.cp-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.cp-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BRAND+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{gap:12px;box-shadow:0 4px 18px rgba(8,102,255,.6)}'+
    '@media(max-width:560px){.cp-ir{flex-wrap:wrap}.cp-ir-go{width:100%;justify-content:center}}'+
    '.cp-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cp-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.cp-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.cp-ir.edgar .cp-ir-ic{background:transparent;box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.cp-ir.edgar .cp-ir-ic img{width:72px;height:72px}'+
    '.cp-ir.edgar .cp-ir-k{color:#E3C878}'+
    '.cp-ir.edgar .cp-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.cp-ir.edgar .cp-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.cp-ir.edgar:hover .cp-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.cp-ir.edgar .cp-ir-wm{opacity:.1}'+
    '.cp-ir.edgar:hover .cp-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="cp-srcrow">'+
  '<a class="cp-ir" href="'+CP_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_LOGO_URL+'" alt="Meta logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="cp-ir-t" style="display:block">Meta Investor Relations</span>'+
      '<span class="cp-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.atmeta.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CP_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="cp-ir-t" style="display:block">Meta on EDGAR</span>'+
      '<span class="cp-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}
function cpQkey(q){ return String(q||'').replace(/\s/g,''); }
function cpQPills(){
  return '<div class="cp-qpills">'+CALL_PREP.quarters.map(function(q,i){
    return '<button type="button" class="cp-qpill'+(i===0?' active':'')+'" data-cpqsel="'+esc(cpQkey(q.q))+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="cp-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
function cpSetupBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{};
    if(st.headline){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?('Reports <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      var hl=st.headline||[], cu=st.custom||[];
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="cp-ev-pill active" data-cpev="cons">Consensus</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="us">Summit</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="both">Both</button>'+
        '</span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="cp-evwrap" data-ev="cons">';
      b+='<div class="cp-row-cap">Headline — every company, always</div>';
      b+='<div class="cp-grid4">'+hl.map(function(m,i){ return cpEvCell('hl-'+qk+'-'+i, m, false); }).join('')+'</div>';
      b+='<div class="cp-row-cap" style="margin-top:12px">Custom KPIs — Meta</div>';
      b+='<div class="cp-grid4">'+cu.map(function(m,i){ return cpEvCell('cu-'+qk+'-'+i, m, true); }).join('')+'</div>';
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Green = YoY. <b>Street</b> = Bloomberg (BST) consensus, hardcoded from the team\'s export only. <b>Summit</b> = our own expectation (Summit model / analyst → to fill). <b>?</b> = a number with a caveat worth knowing.</div>';
      var md=st.marketDebate;
      if(md){
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The setup, in one picture — what the print will settle</b></div>';
        b+='<div class="cp-debate">'+
          '<div class="cp-dc fear"><div class="cp-dc-h">What the tape fears</div><div class="cp-dc-b">'+md.fear+'</div></div>'+
          '<div class="cp-dc real"><div class="cp-dc-h">What consensus actually models</div><div class="cp-dc-b">'+md.real+'</div></div>'+
        '</div>';
        if(md.mech&&md.mech.length){
          b+='<div class="cp-mech">'+md.mech.map(function(m,i){ var ar=m.dir==='up'?'<span style="color:#0a8f4c">▲</span>':(m.dir==='down'?'<span style="color:'+RED+'">▼</span>':''); return (i>0?'<span class="cp-mech-ar">→</span>':'')+'<span class="cp-mech-chip">'+ar+' '+esc(m.k)+' <span style="color:var(--mu);font-weight:700">'+esc(m.v)+'</span></span>'; }).join('')+'</div>';
        }
        if(md.synth) b+='<div class="cp-synth">'+md.synth+'</div>';
      }
      var d=st.debate;
      b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The debate — where Summit differs from the Street, and why</b></div>';
      if(d){
        if(d.rows&&d.rows.length){
          b+='<div class="cp-tc">'+d.rows.map(function(r){
            return '<div class="cp-tc-row" style="border-left:3px solid '+BRAND+'"><span style="font-weight:800;color:var(--navy);white-space:nowrap">'+esc(r.k)+'</span><span><b>Street:</b> '+esc(r.street||'—')+' · <b>Summit:</b> '+esc(r.us||'—')+'<br><span style="color:var(--mu)">'+ (r.why||'') +'</span></span></div>';
          }).join('')+'</div>';
        }
        if(d.synth) b+='<div class="cp-synth">'+d.synth+'</div>';
      } else {
        b+='<div class="cp-note">Fills once both estimate sets are in (Bloomberg export + Summit expectations): line-by-line disparities and the mechanism behind why we see it differently.</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    } else {
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      if(st.pricedIn) b+='<div class="cp-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="cp-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results / Post-Call for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  return h;
}
function cpWatchItem(w, qk, idSfx, qLabel){
  var deep='';
  if(w.seededBy) deep+='<p style="border-left:3px solid '+PURPLE+';padding-left:9px;margin-bottom:10px"><b>'+(w.seededBy.tripped?'Seeded by a TRIPPED red-line':'Seeded by')+' '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>';
  if(w.src) deep+='<p><b>Why it\'s on the list:</b> '+w.src+'</p>';
  if(w.why) deep+='<p><b>Why it matters:</b> '+w.why+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?cpReg('watchwhy-'+qk+'-'+(w.rank||0)+idSfx, esc(w.metric), deep):null;
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  var seed=w.seededBy?'<span class="cp-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ red-line tripped in '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
  return '<div class="cp-w" data-wltags="'+esc(tagsAttr)+'"><div class="cp-w-top"><div class="cp-w-rank">'+(w.rank||'•')+'</div><div class="cp-w-metric">'+esc(w.metric)+'</div>'+seed+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(8,102,255,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why'+(w.thread?' + the thread':'')+' ›</span>':'')+'</div>'+
    '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
    '<div class="cp-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="cp-w-chip" style="background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);color:var(--navy)">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.since?'<span class="cp-w-chip" style="background:rgba(232,160,12,0.14);border:1px solid rgba(183,121,31,0.35);color:var(--navy)"><b>Tracking since:</b> '+esc(w.since)+'</span>':'')+
      (w.bbg?'<span class="cp-w-chip cons"><b>Cons:</b> '+esc(w.bbg)+'</span>':'')+
      (w.breaks?'<span class="cp-w-chip red"><b>Breaks if:</b> '+esc(w.breaks)+'</span>':'')+
    '</div>'+
  '</div>';
}
function cpWatchTags(){
  var set=[], seen={};
  CALL_PREP.quarters.forEach(function(u){ (u.watchList||[]).forEach(function(w){ (w.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); }); });
  return set;
}
function cpWatchBody(c){
  var h=cpStyle();
  h+='<div class="cp-wl-tagbar"><span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)">Filter by theme (across quarters):</span>'+
    cpWatchTags().map(function(t){ return '<button type="button" class="cp-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="cp-wl-tag cp-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="cp-wl-add-btn">+ Add theme</button>'+
  '</div>';
  h+='<div class="cp-wl-addform" hidden>'+
    '<input class="cp-wl-in" data-wlf="metric" placeholder="Theme (e.g. Regulatory: CCCA routing mandate)">'+
    '<input class="cp-wl-in" data-wlf="tags" placeholder="tags, comma-separated (e.g. regulatory, cross-border)">'+
    '<input class="cp-wl-in" data-wlf="pista" placeholder="The tell 🔎 — a standing read, not a question">'+
    '<input class="cp-wl-in" data-wlf="breaks" placeholder="Breaks if… (the falsifiable red-line)">'+
    '<div><button type="button" class="cp-wl-add-go">Add to this quarter\'s list</button><span class="ave-subh-note" style="margin-left:8px">Lives for this session — to persist it, it gets committed into CALL_PREP.</span></div>'+
  '</div>';
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    b+='<p class="ov-lede"><b>Five things to hunt — '+esc(u.q)+'</b>'+(frozen?' <span style="color:var(--mu);font-weight:600">(the list as it was frozen before this call — scored afterwards in Post-Results)</span>':'')+', numbered 1–5 by <b>how much they move the stock × how debated they are</b>. Each card carries: the <b>tell</b> (🔎) — what to actually watch for; what the <b>Street expects</b>; and the <b>red-line</b> that would break the thesis. Tap <b>why ›</b> for the grounding and the quarter-by-quarter thread.</p>';
    b+='<div class="cp-legend"><span class="cp-legend-i"><b>How to read the cards:</b></span>'+
      '<span class="cp-legend-i"><span class="cp-seed">left open by Q1 FY2026</span> it is on the list because last quarter\'s call did not settle it</span>'+
      '<span class="cp-legend-i"><span class="cp-seed">⚑ red-line tripped in Q1 FY2026</span> stronger — a thesis line actually broke last quarter</span>'+
    '</div>';
    var wl=u.watchList||[];
    if(!wl.length){ b+='<div class="cp-note">Watch List builds from the earnings-call record + the Bloomberg export — 5 ranked, grounded, falsifiable items per the conventions.</div>'; }
    else{ b+='<div class="cp-watch">'+wl.map(function(w){ return cpWatchItem(w, qk, '', null); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results/Post-Call; its newQuestions seeded the next quarter.':'Frozen once the quarter opens; scored against Post-Results / Post-Call. Themes carry their quarter-by-quarter thread — promise-type items are tracked here and in the theme record below.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  h+='<div class="cp-wl-all" hidden>';
  h+='<div class="cp-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="cp-watch">'+CALL_PREP.quarters.map(function(u){
    var qk=cpQkey(u.q);
    return (u.watchList||[]).map(function(w){ return cpWatchItem(w, qk, '-f', u.q); }).join('');
  }).join('')+'</div>';
  h+='</div>';
  // ── FUSED (v2.3): the full multi-year theme record — the former standalone Earnings Calls tab. ──
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="cp-band" style="--bc:'+BRAND+'"><span class="cp-band-i">▤</span><span class="cp-band-t">The theme record — every thread, across all calls</span><span class="cp-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="cp-band-l"></span></div>';
  h+=callsBody();
  h+='</div>';
  return h;
}
var CP_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
var CP_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
function cpResultsBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+GREEN+'">② Post-Results</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b> Results land first (release ~4pm, call comes later) — the read on the <b>print itself</b>, before management says a word.</p>';
    var r=q.results;
    if(!r){ b+='<div class="cp-note">Empty until the print lands. Then the scorecard and thesis red-line check fill here.</div></div>'; return b; }
    b+='<div style="border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;margin-bottom:14px;background:var(--w)">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· reported '+esc(q.date?q.date.replace(/ · .*/,''):'')+'</span></div>';
    if(r.headline) b+='<div class="cp-take" style="border-left-color:'+GREEN+'">🎯 '+r.headline+'</div>';
    if(r.thesisCheck&&r.thesisCheck.length){
      var tc=r.thesisCheck.slice().sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); });
      var nTrip=tc.filter(function(t){ return t.tripped; }).length;
      b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:2px 0 6px">Thesis red-line check — vs this quarter\'s frozen Watch List'+
        (nTrip?'<span style="color:'+RED+';margin-left:7px">⚑ '+nTrip+' tripped</span>':'<span style="color:#0a8f4c;margin-left:7px">✓ all held</span>')+'</div>';
      b+='<div class="cp-tc">'+tc.map(function(t){ var col=t.tripped?RED:'#0a8f4c'; var ic=t.tripped?'⚑ TRIPPED':'✓ held';
        return '<div class="cp-tc-row" style="border-left:3px solid '+col+'"><span style="font-weight:800;color:'+col+';white-space:nowrap">'+ic+'</span><span><b>'+esc(t.line)+'</b> — '+esc(t.note||'')+'</span></div>';
      }).join('')+'</div>';
    }
    if(r.scorecard&&r.scorecard.length) b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:15px 0 6px">The print — ranked by surprise</div>';
    if(r.scorecard&&r.scorecard.length){
      var sc=r.scorecard.slice().sort(function(a,z){ return (z.surprise||0)-(a.surprise||0); });
      b+='<div class="cp-legend">'+
        '<span class="cp-legend-i"><b>How to read this table:</b></span>'+
        '<span class="cp-legend-i"><span class="cp-sc-rk">WATCH #1</span> flagged before the call as one of the five most contested items (its rank on that list)</span>'+
        '<span class="cp-legend-i">A blank here just means the line was not one of those five — every line below is covered.</span>'+
        '<span class="cp-legend-i"><span class="cp-sc-surp hi">big surprise</span> the number landed far from expectations — our judgement, not a calculation</span>'+
      '</div>';
      b+='<div class="cp-sc">'+sc.map(function(d,i){ var rr=CP_RES[d.result]||CP_RES.inline;
        var qb=d.note?cpQ('resnote-'+qk+'-'+i, d.note.t||'Context', d.note.h||d.note):'';
        var rk=d.watchRank?'<div class="cp-sc-rk" title="This was item #'+esc(String(d.watchRank))+' on the Watch List we froze before the call">WATCH #'+esc(String(d.watchRank))+'</div>'
                          :'<div class="cp-sc-rk blank"></div>';
        var sv=d.surprise;
        var sl=(sv==null)?'<div class="cp-sc-bw"></div>'
          :'<div class="cp-sc-bw"><div class="cp-sc-surp '+(sv>=70?'hi':(sv>=30?'md':'lo'))+'">'+(sv>=70?'big surprise':(sv>=30?'some surprise':'as expected'))+'</div></div>';
        return '<div class="cp-sc-row" style="--sc:'+rr.c+'">'+rk+'<div class="cp-sc-m">'+esc(d.metric)+qb+'</div><div class="cp-sc-c">expected: '+cpFill(d.cons,'—')+'</div><div class="cp-sc-a">'+esc(d.actual||'')+'</div>'+sl+'<div class="cp-sc-v">'+rr.l+'</div></div>';
      }).join('')+'</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Rows are ordered biggest-surprise first, not in release order. <b>Not disclosed</b> = management stopped reporting a number it used to give. <b>No consensus</b> = nobody had an estimate for it. Neither is a miss.</div>';
    }
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="cp-dots" style="margin-top:14px">🎯 <b>What the numbers tee up for the call</b> — go in hunting these:'+
        '<ul class="ov-bullets" style="margin-top:6px">'+r.intoCall.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div>';
    }
    b+='<div style="margin-top:10px;font-size:11.5px;color:var(--navy)"><b>Price reaction:</b> '+cpFill(r.priceReaction,'to fill from a trusted source')+'</div>';
    b+='</div>';
    b+='<div class="ov-foot">Scored against the frozen Watch List. Consensus = Bloomberg export; actuals = reported (Bloomberg / release).</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
function cpCallBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+RED+'">③ Post-Call</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — not a restatement of the numbers; the story behind them.</b> What the call <i>implied</i> for the thesis, the curious one-mention details, and the dots that connect. Tap any highlight for the depth.</p>';
    b+='<div class="cp-legend"><span class="cp-legend-i"><b>Highlights are grouped by what you DO with them in the meeting:</b></span>'+
      '<span class="cp-legend-i"><span style="color:'+RED+';font-weight:800">▲ Lead with this</span> — open with it: it moves the thesis and something is still unanswered</span>'+
      '<span class="cp-legend-i"><span style="color:'+BLUE+';font-weight:800">● Context</span> — worth saying, but settled; there is nothing to argue</span>'+
      '<span class="cp-legend-i"><span style="color:'+CP_GRAY+';font-weight:800">○ Logged</span> — recorded for later, not meeting material</span>'+
      '<span class="cp-legend-i"><span class="cp-hl-open">open</span> flags the specific thing management left unanswered</span>'+
    '</div>';
    var cc=q.call;
    if(!cc){ b+='<div class="cp-note">Empty until the call/transcript is in. Then the meeting take, theme-by-theme highlights and the connect-the-dots line fill here.</div></div>'; return b; }
    b+='<div style="margin-bottom:18px">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· call '+esc(q.date||'')+'</span></div>';
    if(cc.take) b+='<div class="cp-take">🎯 '+cc.take+'</div>';
    if(cc.highlights&&cc.highlights.length){
      var bands=[
        { k:'lead',    i:'▲', c:RED,     t:'Lead with this', s:'moves the thesis — and something is still unresolved' },
        { k:'context', i:'●', c:BLUE,    t:'Context',        s:'matters, but it is settled — mention, don\'t debate' },
        { k:'logged',  i:'○', c:CP_GRAY,    t:'Logged',         s:'on the record for later; not meeting material' },
      ];
      var hi=0;
      bands.forEach(function(bd){
        var items=cc.highlights.filter(function(x){ return (x.band||'context')===bd.k; });
        if(!items.length) return;
        b+='<div class="cp-band" style="--bc:'+bd.c+'"><span class="cp-band-i">'+bd.i+'</span><span class="cp-band-t">'+bd.t+'</span><span class="cp-band-s">'+bd.s+'</span><span class="cp-band-l"></span></div>';
        b+='<div class="cp-hl">'+items.map(function(x){ var tg=CP_HLTAG[x.tag]||{c:'#6b7684',l:x.tag||''};
          var det=x.detail||'';
          if(x.open) det+='<p style="border-left:3px solid '+AMBER+';padding-left:9px;margin-top:10px"><b>Still open:</b> '+x.open+'</p>';
          var id=det?cpReg('hl-'+qk+'-'+(hi++), tg.l+' — '+String(x.head).replace(/<[^>]+>/g,''), det):null;
          var op=x.open?' <span class="cp-hl-open" title="'+esc(x.open)+'">open</span>':'';
          return '<div class="cp-hl-row" style="--hc:'+tg.c+'"'+(id?' data-detail="cp:'+id+'"':'')+'><span class="cp-hl-tag">'+esc(tg.l)+'</span><span class="cp-hl-head">'+x.head+op+'</span>'+(id?'<span class="cp-hl-more">＋</span>':'<span></span>')+'</div>';
        }).join('')+'</div>';
      });
    }
    if(cc.dots) b+='<div class="cp-dots">🧩 '+cc.dots+'</div>';
    if(cc.threeMinutes&&cc.threeMinutes.length){
      b+='<div class="cp-3m"><div class="cp-3m-h"><span class="cp-3m-t">🎤 Three minutes</span>'+
        '<span class="cp-3m-sub">the spoken version — if you get one slot, this is it</span>'+
        '<button type="button" class="cp-3m-copy" data-cp3m="'+esc(qk)+'">copy</button></div>';
      b+='<div class="cp-3m-l" data-cp3mlist="'+esc(qk)+'">'+cc.threeMinutes.map(function(t){ return '<div class="cp-3m-i"><span>'+t+'</span></div>'; }).join('')+'</div>';
      if(cc.notBringing&&cc.notBringing.length){
        b+='<div class="cp-nb"><div class="cp-nb-h">✕ Deliberately not bringing — and why, if asked</div>'+
          cc.notBringing.map(function(x){ return '<div class="cp-nb-r"><span class="cp-nb-x">✕</span><span><b>'+esc(x.item)+'</b> — '+esc(x.why)+'</span></div>'; }).join('')+'</div>';
      }
      b+='</div>';
    }
    if(cc.newQuestions&&cc.newQuestions.length){
      b+='<div style="margin-top:12px"><div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin-bottom:5px">➡ What this call left unanswered — and where each question went next</div>';
      b+='<div class="cp-nq">'+cc.newQuestions.map(function(x){
        var n=(typeof x==='string')?x:x.n, land=(typeof x==='string')?null:x.landed;
        var trip=(typeof x!=='string'&&x.tripped)?'<span style="color:'+RED+';font-weight:800;margin-right:5px" title="A thesis red-line actually broke on this one">⚑</span>':'';
        var chip=land?'<span class="cp-nq-land">became '+esc(land.q)+' Watch item #'+esc(String(land.rank))+'</span>'
                     :'<span class="cp-nq-land open">still open — not yet on a list</span>';
        return '<div class="cp-nq-row"><span>'+trip+esc(n)+'</span>'+chip+'</div>';
      }).join('')+'</div></div>';
    }
    b+='</div>';
    b+='<div class="ov-foot">Insight-first, not fact-first. Append-only — prior quarters are never overwritten; newQuestions feeds the next Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
var CP_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
function cpQnum(q){ var m=String(q||'').match(/Q(\d)\s+(?:FY)?(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
function cpStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_PREP.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=cpQnum(st.since), b=cpQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}
function wireCallPrep(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="callprep"]'); if(!pane) return;
  pane.querySelectorAll('.cp-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cpp');
    pane.querySelectorAll('.cp-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cpp')!==key); });
  }; });
  pane.querySelectorAll('.cp-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cpev');
    pane.querySelectorAll('.cp-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  pane.querySelectorAll('.cp-qpill').forEach(function(btn){ btn.onclick=function(){
    var qk=btn.getAttribute('data-cpqsel');
    pane.querySelectorAll('.cp-qpill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-cpq')!==qk); });
    pane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); });
    var flat=pane.querySelector('.cp-wl-all'); if(flat) flat.hidden=true;
  }; });
  pane.querySelectorAll('.cp-3m-copy').forEach(function(btn){ btn.onclick=function(){
    var qk=btn.getAttribute('data-cp3m');
    var list=pane.querySelector('.cp-3m-l[data-cp3mlist="'+qk+'"]'); if(!list) return;
    var txt=Array.prototype.map.call(list.querySelectorAll('.cp-3m-i'), function(el,i){
      return (i+1)+'. '+el.textContent.trim();
    }).join('\n\n');
    var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; }, 1400); };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
    else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
           try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
  }; });
  var wpane=pane.querySelector('.cp-phpane[data-cpp="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.cp-wl-all');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.cp-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function applyTags(){
      var tags=activeTags();
      var on=tags.length>0;
      wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ if(on) blk.hidden=true; });
      if(!on){
        var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):null;
        wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-cpq')!==qk); });
      }
      if(flat){ flat.hidden=!on;
        if(on) flat.querySelectorAll('.cp-w').forEach(function(card){
          var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
          var hit=tags.some(function(t){ return ct.indexOf(t)>=0; });
          if(hit) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
        });
      }
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('cp-wl-clear')){ wpane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyTags();
    }; }
    wpane.querySelectorAll('.cp-wl-tag').forEach(wireTag);
    var addBtn=wpane.querySelector('.cp-wl-add-btn'), form=wpane.querySelector('.cp-wl-addform');
    if(addBtn&&form){ addBtn.onclick=function(){ form.hidden=!form.hidden; }; }
    var go=wpane.querySelector('.cp-wl-add-go');
    if(go&&form){ go.onclick=function(){
      function val(k){ var el=form.querySelector('[data-wlf="'+k+'"]'); return el?el.value.trim():''; }
      var metric=val('metric'); if(!metric) return;
      var tags=val('tags').split(',').map(function(t){ return t.trim().toLowerCase().replace(/\s+/g,'-'); }).filter(Boolean);
      var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):cpQkey(CALL_PREP.quarters[0].q);
      var qLbl=act?act.textContent.replace(/upcoming/i,'').trim():CALL_PREP.quarters[0].q;
      var w={ rank:'+', metric:metric, tags:tags, pista:val('pista')||null, breaks:val('breaks')||null, since:qLbl };
      var target=wpane.querySelector('.cp-qblock[data-cpq="'+qk+'"] .cp-watch');
      if(target) target.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-add'+Date.now()%100000, null));
      var flatList=flat?flat.querySelector('.cp-watch'):null;
      if(flatList) flatList.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-addf'+Date.now()%100000, qLbl));
      tags.forEach(function(t){
        if(!wpane.querySelector('.cp-wl-tag[data-wltag="'+t+'"]')){
          var b=document.createElement('button'); b.type='button'; b.className='cp-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
          var clear=wpane.querySelector('.cp-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
        }
      });
      form.querySelectorAll('.cp-wl-in').forEach(function(i){ i.value=''; }); form.hidden=true;
      applyTags();
    }; }
  }
}

// Narrative threads across the 10 calls Q4'23 → Q1'26 (theme ⇄ quarter toggle).
var META_THEMES=[
  { theme:'The AI-capex escalation', st:{ k:'watch', since:'Q1 2024', last:'Q1 2026' },
    why:'The number that actually moves the stock: capex guidance has been raised at nearly every call, from ~$30B to ~$145B in two years.',
    updates:[
      { q:'Q4 2023', items:['First-ever dividend + $50B buyback — "the business can fund AI <b>and</b> return cash."'] },
      { q:'Q1 2024', items:['CapEx raised to <b>$35–40B</b>; explicit warning of a "<b>multi-year investment cycle</b> before Meta AI is profitable — expect volatility." Stock −11%.'] },
      { q:'Q4 2024', items:['2025 CapEx guided <b>$60–65B</b> — nearly doubled. "Hundreds of billions over the long term."'] },
      { q:'Q1 2025', items:['CapEx raised to <b>$64–72B</b>; 2026 to see "similarly significant dollar growth."'] },
      { q:'Q4 2025', items:['2026 CapEx guided <b>$115–135B</b>; expenses $162–169B — but "<b>operating income above 2025</b>." Spending through it.'] },
      { q:'Q1 2026', items:['CapEx raised AGAIN to <b>$125–145B</b> — "higher component costs, particularly <b>memory pricing</b>." Stock −9%.'] },
    ]},
  { theme:'Superintelligence & the talent war', st:{ k:'watch', since:'Q2 2025', last:'Q1 2026' },
    why:'The 2025 pivot: from open Llama to a closed, frontier "personal superintelligence" push — bought with a $14.3B Scale AI stake and an aggressive talent raid.',
    updates:[
      { q:'Q2 2024', items:['Llama 3.1 — "first frontier-level <b>open source</b> model; an inflection point." (The open-first era.)'] },
      { q:'Q1 2025', items:['~1B Meta AI MAU; standalone app launched — but "at least the next year" is about scaling, not monetizing.'] },
      { q:'Q2 2025', items:['<b>Meta Superintelligence Labs (MSL)</b> founded — Wang, Friedman, Zhao. "Superintelligence is now <b>in sight</b>." (The closed pivot.)'] },
      { q:'Q3 2025', items:['"Front-load for the <b>most optimistic</b> superintelligence cases." If it comes slower, "extra compute accelerates the core business profitably."'] },
      { q:'Q1 2026', items:['<b>Muse Spark</b> released — MSL\'s first model. "Fastest lab from standing up to a widely accepted strong model."'] },
    ]},
  { theme:'Reality Labs → the glasses pivot', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The long, expensive bet re-aimed: away from the holographic metaverse and toward AI glasses shipping now — with the first concrete loss-peak guidance.',
    updates:[
      { q:'Q3 2024', items:['Ray-Ban Meta clear edition sold out, reselling >$1,000 — <b>glasses validated</b> as real consumer electronics.'] },
      { q:'Q3 2025', items:['Display glasses sold out in 48 hours — "clearly leading." RL investment <b>pivoting toward wearables</b>, away from VR.'] },
      { q:'Q4 2025', items:['"RL losses will <b>peak in 2026</b>, then gradually reduce" — first concrete inflection guidance.'] },
    ]},
  { theme:'The ad engine — GEM & Advantage+', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'Where AI capex turns straight into revenue: better ranking models lift clicks/conversions and price-per-ad at the same time, moving toward full "agentic" advertising.',
    updates:[
      { q:'Q2 2024', items:['Long-term ad vision: "advertisers will just tell us an objective and a budget, and <b>we\'ll do the rest</b>."'] },
      { q:'Q1 2025', items:['<b>GEM</b> ads model 2× more efficient per unit of compute; five-opportunities framework ("don\'t need to win all five").'] },
      { q:'Q4 2025', items:['GEM drove <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more IG conversions</b>; impressions +18%, price-per-ad +6%.'] },
      { q:'Q1 2026', items:['Narrative shifts assistant → <b>agent</b>; business AIs at 10M weekly conversations (from ~1M at year start).'] },
    ]},
  { theme:'Engagement — the inventory machine', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'Engagement manufactures ad inventory: Reels catching up to feed, AI-recommended content, Threads and Meta AI all feed more impressions to auction.',
    updates:[
      { q:'Q4 2023', items:['Year of Efficiency declared a success — a leaner company as a <b>permanent operating philosophy</b>.'] },
      { q:'Q3 2025', items:['Instagram <b>3B MAU</b>; Threads <b>150M DAP</b>; Reels ARR >$50B — "core business strength IS the funding mechanism."'] },
      { q:'Q4 2025', items:['AI-recommended content 40%+ of the FB feed; Threads time-spent +20% YoY.'] },
    ]},
];
function metaCallsByQuarter(){
  var map={}, order=[];
  META_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}

// ═══════════════════════════════════════════════════════════════════════════
//  VALUATION — peer scatter · multiples · sensitivity · capital allocation
// ═══════════════════════════════════════════════════════════════════════════
// Peer scatter: X = valuation multiple, Y = revenue growth, bubble = LIVE market cap.
// ⚠ Multiples & growth are web-sourced approximations (mid-2026); market caps are live.
// cat = category (drives bubble color + legend). meta = the highlighted subject.
var META_CATS={ meta:{c:'#0866FF',l:'Meta'}, giant:{c:'#F59E0B',l:'Ad giants (Search/retail-media)'}, social:{c:'#14B8A6',l:'Social-ad platforms'}, sub:{c:'#8B5CF6',l:'Subscription / attention'}, perf:{c:'#EC4899',l:'Performance ad'}, adtech:{c:'#64748B',l:'Open-web ad-tech'} };
var META_PEERS=[
  { tk:'META', n:'Meta',      cat:'meta',   evT:18, evF:15, peT:27, peF:22, gt:22, gf:19, mc:1800, hl:true, why:'The social-advertising leader — a walled garden that keeps ~the whole ad dollar and the best direct-response AI. Premium growth (~20%) at a mid-20s P/E, discounted for the most binary AI-capex bet in megacap (no external cloud to defray the compute).' },
  { tk:'GOOGL', n:'Alphabet', cat:'giant',  evT:16, evF:14, peT:24, peF:20, gt:14, gf:13, mc:2400, why:'The other ad giant (Search + YouTube) — also a walled garden, similar multiple, slower top-line but with a Cloud business that absorbs AI capex Meta must monetize internally.' },
  { tk:'AMZN', n:'Amazon',    cat:'giant',  evT:18, evF:15, peT:34, peF:28, gt:11, gf:11, mc:2300, why:'Retail-media ads (fast-growing) + AWS. Competes for lower-funnel budgets; a higher P/E on a lower-margin retail base plus a cloud engine.' },
  { tk:'NFLX', n:'Netflix',   cat:'sub',    evT:30, evF:26, peT:40, peF:34, gt:15, gf:14, mc:520, why:'A streaming subscription model layering on an ad tier — a premium multiple on content-led growth; competes for attention and ad dollars at the margin, not for the feed.' },
  { tk:'RDDT', n:'Reddit',    cat:'social', evT:40, evF:30, peT:70, peF:50, gt:45, gf:38, mc:30, why:'A high-growth social platform monetizing via ads + data-licensing — the fastest grower here at the richest multiple; a small direct rival for social-ad budgets.' },
  { tk:'SNAP', n:'Snap',      cat:'social', evT:20, evF:16, peT:null, peF:40, gt:12, gf:13, mc:14, why:'A younger-skewing social-ad platform — much smaller, thinner margins, a contested moat; the clearest pure-play social-ad comparable to how hard Meta\'s scale is to match.' },
  { tk:'PINS', n:'Pinterest', cat:'social', evT:18, evF:15, peT:26, peF:21, gt:16, gf:15, mc:22, why:'A commerce-intent visual-discovery ad platform — mid-teens growth at a Meta-like multiple; competes for lower-funnel, shopping-intent ad budgets.' },
  { tk:'APP', n:'AppLovin',   cat:'perf',   evT:28, evF:22, peT:38, peF:30, gt:30, gf:25, mc:120, why:'A mobile-app ad network + AXON AI engine — very high growth and margins in performance advertising; a rising challenger for app-install and direct-response budgets.' },
  { tk:'TTD', n:'Trade Desk', cat:'adtech', evT:28, evF:22, peT:45, peF:35, gt:18, gf:17, mc:35, why:'The largest independent <b>DSP</b> — the buy-side of the OPEN web that Meta\'s walled garden bypasses. Its multiple shows the market still pays up for open-internet ad-tech, but it lives on the ~45¢ Meta keeps in-house.' },
];
var META_SC={ type:'pe', basis:'f', peers:null };
function metaScReset(){ META_SC.peers=META_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function metaScMult(p){ if(META_SC.type==='ev') return META_SC.basis==='f'?p.evF:p.evT; return META_SC.basis==='f'?p.peF:p.peT; }

// Multiples table (approx, web-sourced mid-2026; labeled). Bubble/mkt-cap live via scatter.
var MULT_ROWS=[
  { n:'Meta (META)',    pe:'~22× fwd', ev:'~15× fwd', g:'~19%', m:'~41% op', note:'walled garden; binary AI-capex bet' },
  { n:'Alphabet (GOOGL)',pe:'~20× fwd', ev:'~14× fwd', g:'~13%', m:'~32% op', note:'has Cloud to absorb AI spend' },
  { n:'Amazon (AMZN)',  pe:'~28× fwd', ev:'~15× fwd', g:'~11%', m:'~11% op', note:'retail-media + AWS; lower-margin base' },
  { n:'Netflix (NFLX)', pe:'~34× fwd', ev:'~26× fwd', g:'~14%', m:'~28% op', note:'subscription + ad tier' },
  { n:'AppLovin (APP)', pe:'~30× fwd', ev:'~22× fwd', g:'~25%', m:'high',     note:'performance-ad network, AXON AI' },
];

// Sensitivity — multi-driver: ad-rev growth × op margin × buyback → EPS → × P/E → implied price.
var SENS_BASE={ adRev2025:196174, opMargin:41.4, sharesM:2574, otherRev:4792, taxRate:15, pxFallback:740, peBase:24, normEps2025:28.7 };
var SENS_DRIVERS=[
  { k:'growth', label:'Ad-revenue growth (next yr)', min:5, max:30, step:1, val:19, unit:'%', hint:'Advertising is ~98% of revenue; the master driver.' },
  { k:'opm',    label:'Operating margin',            min:32, max:48, step:1, val:44, unit:'%', hint:'FoA ~50%+; consolidated flexes with RL burn + capex/D&A.' },
  { k:'buyback',label:'Net share reduction (yr)',    min:0, max:3, step:0.5, val:1.5, unit:'%', hint:'Buybacks net of SBC; the model holds shares flat, reality shrinks them.' },
  { k:'pe',     label:'Forward P/E',                 min:15, max:34, step:1, val:24, unit:'×', hint:'Re-rate lever; where the market pays for the AI payoff — or doesn\'t.' },
];
var _sens=null, _metaLivePx=null;

// Capital allocation — FY actuals ($B). Model carries shares; buyback/dividend are public facts.
var CAP_YEARS=['2021','2022','2023','2024','2025'];
var CAP_FCF   =[38.99,19.04,43.85,54.07,46.11];
var CAP_BUYBK =[44.5,27.9,20.0,30.1,29.0]; // gross repurchases $B (approx, public 10-K/press)
var CAP_DIV   =[0,0,0,5.1,5.3];            // dividends paid $B (first dividend 2024)
var CAP_SHARES=[2859,2702,2629,2614,2574];
var CAP_NOTE='Meta declared its <b>first dividend in 2024</b> ($0.50/qtr, raised to $0.525 in 2025) and authorized large buybacks (a $50B addition in 2024). The Summit model carries the <b>share count</b> (2,859M FY21 → 2,574M FY25, ~10% net reduction) but not a repurchase/dividend line — buyback and dividend dollars here are approximate, from public 10-K/press disclosures, and should be confirmed against the latest 10-K/8-K. FCF is the Summit series. Buybacks have run well above the dividend: Meta returns cash primarily by shrinking the share count.';

// Financials (DCF range-slider) — annual series with estimate flags.
var FIN_YEARS=['2019','2020','2021','2022','2023','2024','2025','2026E','2027E'];
var FIN_EST  =['2026E','2027E'];
var FIN_SERIES={
  rev:    { label:'Revenue',          color:BRAND,  data:REV.concat(REV_F),        fmt:'usd' },
  opinc:  { label:'Operating income', color:BRAND2, data:OPINC.concat(OPINC_F),    fmt:'usd' },
  earn:   { label:'Net income (GAAP)',color:'#0EA5E9', data:EARN.concat(EARN_F),   fmt:'usd' },
  ebitda: { label:'EBITDA',           color:'#6366F1', data:EBITDA.concat(EBITDA_F),fmt:'usd' },
  fcf:    { label:'Free cash flow',   color:GREEN,  data:FCF.concat(FCF_F),        fmt:'usd' },
  capex:  { label:'Capex',            color:NEG,    data:CAPEX.concat(CAPEX_F),    fmt:'usd' },
};
var _finMetric='rev', _finStart=0, _finEnd=8;

// ═══════════════════════════════════════════════════════════════════════════
//  MANAGEMENT · TRACK RECORD · GOVERNANCE · STRATEGY · TAM
// ═══════════════════════════════════════════════════════════════════════════
var META_MGMT = makeManagement({
  brand: BRAND,
  lede: 'Meta is <b>founder-controlled</b>: Mark Zuckerberg is Chairman & CEO and, through super-voting Class B stock, holds majority voting power despite a ~13% economic stake. The executive bench pairs long-tenured product/finance leaders (Li, Cox, Olivan) with a 2025 AI infusion (Alexandr Wang, from the $14.3B Scale AI deal). <span class="ave-subh-note">Public-source bios; ownership counts & insider trades sync separately (Fiscal.ai) into Ownership — note META is not on the Fiscal free plan, so that panel may be empty until upgrade.</span>',
  execs:[
    { id:'zuck', lead:true, name:'Mark Zuckerberg', title:'Founder, Chairman & CEO', since:'CEO since 2004', line:'Founder-CEO with voting control; drove the 2022 crash → Year of Efficiency → AI re-rate and the all-in "personal superintelligence" bet.', bio:'Founded Facebook in 2004 at Harvard. Holds majority voting power via Class B super-voting shares (~13% economic). Personally leads the AI + Reality Labs strategy: the 2023 "Year of Efficiency," the record AI-capex ramp, the 2025 Superintelligence Labs push (incl. the $14.3B Scale AI stake), and the pivot from holographic metaverse to AI glasses. His conviction and control are both the bull case (decisive, long-horizon capital allocation) and the governance risk (minority holders have little say).' },
    { id:'powell', name:'Dina Powell McCormick', title:'President & Vice Chairman', since:'since Jan 2026', line:'New #2-style role (Jan 2026); ex-Goldman Sachs partner and White House deputy national-security adviser — statecraft + capital-markets weight.', bio:'Joined Meta\'s board in April 2025, then moved into an executive role as President & Vice Chairman in January 2026. Former Goldman Sachs partner (global head of sovereign business) and US deputy national security adviser. A senior counterweight/relationships asset as Meta navigates global policy, capital markets and the AI build.' },
    { id:'li', name:'Susan Li', title:'Chief Financial Officer', since:'CFO since Nov 2022', line:'Long-time internal finance leader; the voice on capex discipline and "spending through it" while guiding operating income above prior year.', bio:'Joined Meta in 2008; VP of Finance before succeeding Dave Wehner as CFO in November 2022. Runs the capital-allocation message — the record capex ramp, the first dividend (2024), and the framing that 2026 operating income can rise even as capex steps up. The market\'s key interlocutor on the AI-spend ROI question.' },
    { id:'cox', name:'Chris Cox', title:'Chief Product Officer', since:'CPO since 2020', line:'Oversees Facebook, Instagram, WhatsApp, Threads and Meta AI product; among Zuckerberg\'s most senior and trusted lieutenants.', bio:'One of Meta\'s earliest and most influential product leaders (joined 2005). Left in 2019, returned in 2020 as CPO. Owns the app roadmap that manufactures ad inventory — Reels, AI-recommended content, Threads, business messaging and the Meta AI assistant.' },
    { id:'olivan', name:'Javier Olivan', title:'Chief Operating Officer', since:'COO since 2022', line:'Runs the business/ads org, infrastructure, and growth after Sheryl Sandberg\'s 2022 departure.', bio:'Joined 2007 building the growth team that globalized Facebook. Became COO in 2022 when Sheryl Sandberg stepped down — a more operations/infrastructure-weighted COO role than Sandberg\'s ad-sales-centric one, reflecting AI-era priorities.' },
    { id:'boz', name:'Andrew "Boz" Bosworth', title:'Chief Technology Officer', since:'CTO since 2022', line:'Leads Reality Labs (Quest, Ray-Ban/Oakley Meta glasses, Orion) and much of the AI infrastructure effort.', bio:'Long-tenured executive (joined 2006; built the News Feed ads engine). As CTO he runs Reality Labs — the ~$19B/yr bet — and champions the pivot toward AI glasses as the next platform. The public face of the hardware/AR strategy.' },
    { id:'wang', name:'Alexandr Wang', title:'Chief AI Officer · Meta Superintelligence Labs', since:'joined Jun 2025', line:'Founder of Scale AI; brought in via the $14.3B stake to lead the Superintelligence Labs talent push.', bio:'Co-founded and led Scale AI; joined Meta in June 2025 as part of the ~$14.3B investment, becoming Chief AI Officer and leading Meta Superintelligence Labs (MSL) alongside recruited researchers. The centerpiece of Meta\'s aggressive, costly 2025 AI-talent war and the shift toward frontier "superintelligence" models.' },
    { id:'mahoney', name:'C.J. Mahoney', title:'Chief Legal Officer', since:'CLO since Jan 2026', line:'New top lawyer (Jan 2026); ex-Microsoft GC and former deputy US Trade Representative — inherits EU DMA + AI-safety litigation.', bio:'Named Meta\'s Chief Legal Officer in January 2026, succeeding Jennifer Newstead (who left to become Apple\'s General Counsel). Former General Counsel at Microsoft and a deputy US Trade Representative. Leads Meta\'s legal agenda post-FTC-case (dismissed Nov 2025): EU DMA "pay-or-consent," teen-safety and AI-liability litigation.' },
    { id:'kaplan', name:'Joel Kaplan', title:'President, Global Affairs', since:'since Jan 2025', line:'Succeeded Nick Clegg as head of policy/government relations amid a shift in Meta\'s political posture.', bio:'Long-time Meta policy executive; became head of global affairs in January 2025 when Nick Clegg departed. Oversees Meta\'s global policy, content and government-relations agenda during a period of changing platform-governance stance.' },
  ],
  board:[
    { name:'Mark Zuckerberg', role:'Chairman & CEO', chair:true, dual:true, independent:false },
    { name:'Peggy Alford', role:'EVP, PayPal — chair of Audit & Risk', independent:true },
    { name:'Marc Andreessen', role:'Co-founder & GP, Andreessen Horowitz', independent:true },
    { name:'John Arnold', role:'Co-founder & Co-Chair, Arnold Ventures (joined 2024)', independent:true },
    { name:'Patrick Collison', role:'Co-founder & CEO, Stripe (joined 2025)', independent:true },
    { name:'John Elkann', role:'Chairman, Exor / Stellantis / Ferrari (joined 2025)', independent:true },
    { name:'Andrew Houston', role:'Co-founder & CEO, Dropbox', independent:true },
    { name:'Nancy Killefer', role:'Former Senior Partner, McKinsey', independent:true },
    { name:'Robert Kimmitt', role:'Former US Deputy Treasury Secretary — lead independent director', independent:true },
    { name:'Charles Songhurst', role:'Technology investor (joined 2025)', independent:true },
    { name:'Dana White', role:'CEO, UFC / TKO (joined 2025)', independent:true },
    { name:'Tony Xu', role:'Co-founder & CEO, DoorDash', independent:true },
  ],
  boardNote:'controlled company — founder holds voting majority; 12-member board per the May 2026 annual meeting (Hock Tan & Tracey Travis did not stand for re-election)',
  gov:[
    { k:'Voting control', v:'Founder majority', d:'Dual-class: Class B = 10 votes/share (founder-held); Zuckerberg controls ~61% of voting power with ~13% economics.' },
    { k:'Board leadership', v:'Combined CEO + Chair', d:'Independent lead director (R. Kimmitt); "controlled company" status limits some independence requirements.' },
    { k:'Capital return', v:'Dividend + buybacks', d:'First dividend 2024 ($0.50→$0.525/qtr); large repurchases (share count −~10% since FY21).' },
    { k:'Say-on-pay', v:'Advisory only', d:'Founder voting control means minority holders effectively cannot force governance change.' },
  ],
  foot:'Roster, titles and board membership from Meta public disclosures / company site as of mid-2026. Compensation and ownership specifics come from the annual proxy (DEF 14A) — confirm there. Ownership & insider-transaction data syncs from Fiscal.ai into the Ownership subtab (note: META is not on the Fiscal free plan, so that panel may show no data until the plan is upgraded).',
});
// Track Record — rate the MANAGEMENT (and key board) on value creation, green/amber/red,
// each with a Meta record (co) and a prior/external one (ext). Editorial reads from tenure +
// what they built, not a Meta statement. matr: pop-ups.
var META_TRACK_RATE={ green:{c:'#0F9D58',bg:'rgba(15,157,88,0.07)',l:'Value creator'}, amber:{c:'#E8A00C',bg:'rgba(232,160,12,0.08)',l:'Mixed / unproven'}, red:{c:'#C0392B',bg:'rgba(192,57,43,0.07)',l:'Value destroyer'} };
var META_TRACK=[
  { id:'zuck', n:'Mark Zuckerberg', r:'Founder, Chairman & CEO', t:'CEO since 2004', rate:'green',
    one:'Turned a college network into a ~$1.8T company — and twice re-invented it under fire.',
    co:['Built the mobile-ad machine, then the AI-ad machine (revenue $70B → $201B, FY19→25)','Called the 2022 bottom: "Year of Efficiency" → margin ~20%→~41%, stock >10× off the low','Voting control lets him make the long-horizon AI/RL bets no hired CEO could'],
    ext:['One of the great capital allocators of the era — Instagram/WhatsApp are landmark deals','The same control that enables the bets removes minority-holder checks (the governance flag)'],
    note:'Elite builder + allocator; the open question is the return on the AI capex he alone is steering. Green.' },
  { id:'li', n:'Susan Li', r:'Chief Financial Officer', t:'CFO since Nov 2022 · at Meta since 2008', rate:'green',
    one:'Disciplined internal CFO who ran the Year-of-Efficiency and now frames the capex/ROI debate.',
    co:['Owned the cost reset that re-expanded margins, then the pivot to record capex','Started the first dividend (2024) + large buybacks while funding the AI build','The credible voice the market tests on "spend-through-it" ROI'],
    ext:['15-year Meta insider (VP Finance) — deep institutional knowledge, promoted from within'],
    note:'Rigorous, trusted operator through both the cut and the ramp. Green.' },
  { id:'cox', n:'Chris Cox', r:'Chief Product Officer', t:'CPO since 2020 · at Meta since 2005', rate:'green',
    one:'Owns the product engine that manufactures ad inventory — Reels, AI feed, Threads, Meta AI.',
    co:['Reels caught up to feed monetization; AI-recommended content now 40%+ of the FB feed','Threads scaled off the IG graph; Meta AI to ~1B users'],
    ext:['One of Meta\'s most influential early product leaders; left 2019, returned 2020'],
    note:'The engagement → inventory flywheel is his; proven product builder. Green.' },
  { id:'olivan', n:'Javier Olivan', r:'Chief Operating Officer', t:'COO since 2022 · at Meta since 2007', rate:'green',
    one:'Runs ads, business and infrastructure — the operating spine behind the numbers.',
    co:['Took the COO seat after Sandberg; re-weighted it toward ops/infra for the AI era','Built the growth org that globalized Facebook'],
    ext:['15-year insider — the execution counterpart to Zuckerberg\'s strategy'],
    note:'Steady operator running the monetization + infra machine. Green.' },
  { id:'boz', n:'Andrew "Boz" Bosworth', r:'Chief Technology Officer', t:'CTO since 2022 · at Meta since 2006', rate:'amber',
    one:'Owns Reality Labs — real glasses traction, but a ~$79B cumulative loss is on his ledger.',
    co:['Ray-Ban / Oakley Meta glasses the breakout (>7M units 2025); pivot VR→AI glasses','Built the original News Feed ads engine'],
    ext:['Long-tenured, technically deep; the public face of the hardware bet'],
    note:'Credible builder, but RL is the value question — glasses promising, losses enormous. Amber until the segment inflects. ' },
  { id:'wang', n:'Alexandr Wang', r:'Chief AI Officer · MSL', t:'joined Jun 2025', rate:'amber',
    one:'The $14.3B superintelligence bet in one hire — huge ambition, zero Meta track record yet.',
    co:['Leads Meta Superintelligence Labs; MSL\'s first model (Muse Spark) shipped fast'],
    ext:['Founder/CEO of Scale AI — built a real data-labeling business from scratch'],
    note:'Centerpiece of the most expensive, least-proven bet Meta has made. Amber — high option value, unproven. ' },
  { id:'powell', n:'Dina Powell McCormick', r:'President & Vice Chairman', t:'exec since Jan 2026', rate:'amber',
    one:'Statecraft + capital-markets weight in a brand-new #2-style role — relationships, not P&L (yet).',
    co:['Moved from the board (2025) into the executive suite Jan 2026'],
    ext:['Goldman Sachs partner (sovereign business); US deputy national security adviser'],
    note:'Heavyweight profile; too new to grade, and the seat is relationship-oriented. Amber. ' },
  { id:'mahoney', n:'C.J. Mahoney', r:'Chief Legal Officer', t:'CLO since Jan 2026', rate:'amber',
    one:'New top lawyer inheriting the EU/AI-safety litigation wave — strong pedigree, unproven here.',
    co:['Succeeds Jennifer Newstead (who left for Apple) after the FTC case was dismissed'],
    ext:['General Counsel at Microsoft; deputy US Trade Representative'],
    note:'Blue-chip legal/policy pedigree; brand-new to Meta. Amber. ' },
  { id:'kaplan', n:'Joel Kaplan', r:'President, Global Affairs', t:'since Jan 2025', rate:'amber',
    one:'Runs policy/government relations through a shifting platform-governance posture — not a P&L owner.',
    co:['Succeeded Nick Clegg; steward of the content/policy agenda'],
    ext:['Long-time Meta policy executive; White House background'],
    note:'Real policy value; not an operating growth seat. Amber by design. ' },
];
var META_BOARD_TRACK=[
  { n:'Patrick Collison', rate:'green', r:'Co-founder & CEO, Stripe', note:'Built Stripe into the defining payments-infrastructure company — a genuine builder\'s perspective on the board (joined 2025).' },
  { n:'Tony Xu', rate:'green', r:'Co-founder & CEO, DoorDash', note:'Scaled DoorDash to category leadership and profitability — a sitting founder-operator.' },
  { n:'Marc Andreessen', rate:'green', r:'Co-founder & GP, a16z', note:'Netscape founder and top-tier VC — deep tech/product judgment; long-tenured Meta director (note: a16z portfolio overlaps raise conflict questions).' },
  { n:'Peggy Alford', rate:'green', r:'EVP, PayPal', note:'Senior payments/fintech operator; chairs Audit & Risk — a substantive governance seat.' },
  { n:'John Elkann', rate:'amber', r:'Chairman, Exor / Stellantis / Ferrari', note:'Elite capital-allocator pedigree in a different industry; governance/relationships value (joined 2025).' },
  { n:'John Arnold', rate:'amber', r:'Co-founder, Arnold Ventures', note:'Ex-Centaurus energy trader turned philanthropist/investor; policy & data-driven lens (joined 2024), not an operator.' },
];
// Governance & SBC data.
var SBC_YEARS=['2021','2022','2023','2024','2025'];
var SBC_DOLLARS=[9.16,11.99,14.03,15.36,17.6];   // SBC expense $B (approx, from 10-K)
var SBC_NOTE='Meta\'s stock-based compensation has risen with headcount and AI-talent competition (~$9B in 2021 → ~$17-18B in 2025), but buybacks have run well ahead of it, so the diluted share count still <b>fell ~10%</b> over the period. The 2025 AI talent war (incl. the Scale AI hires) is the pressure to watch on future SBC. Single class of economic ownership for public holders, but <b>super-voting Class B</b> gives the founder control — the defining governance feature.';
// Strategy verbs + drivers.
var STRAT_HERO=[['Engage','Manufacture more attention — Reels, AI-recommended content, Threads — which makes more ad inventory to auction.'],['Rank','Turn attention into revenue with better AI (GEM, Advantage+): more relevant ads, higher price-per-ad AND higher ROI at once.'],['Build','Own the next platform (AI glasses, superintelligence) so Meta is never again a tenant on someone else\'s device.']];
var STRAT_DRIVERS=[
  { k:'agentic', t:'Agentic advertising', d:'Advantage+ from AI-assisted → full campaign autopilot: a business states a goal + budget + product, Meta\'s AI does targeting, bidding, creative and optimization. The clearest path from AI capex to ad revenue.' },
  { k:'messaging', t:'Business messaging', d:'Click-to-WhatsApp / Instagram ads turn ~3B messaging users into the next monetization surface — high-growth, and structurally hard for open-web rivals to match.' },
  { k:'superint', t:'Personal superintelligence', d:'Meta Superintelligence Labs (Wang et al.) + frontier models + the AI capex build. The most expensive and least proven bet; the option value on owning frontier AI.' },
  { k:'glasses', t:'AI glasses as the next platform', d:'Ray-Ban / Oakley Meta (>7M units 2025) → Orion AR. The bid to escape phone-OS dependence (Apple/Google) and own the hardware layer for AI.' },
];
var STRAT_NOTE='The strategy is a loop: <b>engagement manufactures ad inventory → AI ranks it into revenue → the cash funds the next platform bet</b>. Everything — Reels, GEM, Advantage+, the capex ramp, glasses, superintelligence — is a link in that chain. The bull case is the loop compounds; the bear case is the capex outruns the monetization.';
// TAM.
var TAM_BARS=[
  ['Global advertising (~$1T+)', 100, '~$1T+ total', GRAY],
  ['Digital advertising', 75, '~$750B+', OTHER],
  ['Meta ad revenue (~$197B)', 26, '~$197B FY25', BRAND],
];
var TAM_NEW=[
  '<b>Business messaging:</b> turning ~3B WhatsApp/Messenger users into commerce + support conversations — a large, under-monetized surface.',
  '<b>AI agents & assistant:</b> ~1B Meta AI users; monetization is deliberately deferred ("scale first"), but it is a future ad + agent surface.',
  '<b>AI glasses / wearables:</b> a new device category (>7M units 2025) — hardware today, an AI + ad platform tomorrow if it scales.',
  '<b>Reality Labs / metaverse:</b> the long-dated option — a new computing platform Meta would own end-to-end; pre-revenue, deeply loss-making today.',
];
var TAM_NOTE='Meta\'s core TAM is the global ad market (~$1T+, shifting to digital) where it holds a large share of <b>social + direct-response</b> budgets. The growth optionality is in <b>new surfaces</b> — business messaging, the AI assistant, and (longer-dated) glasses and the metaverse — where dollar TAM is not cleanly sized yet, so we frame them qualitatively rather than invent a number.';

// ── M&A — the deals that built (and are building) Meta. mna: pop-ups. ──
var META_MNA=[
  { k:'insta', yr:'2012', n:'Instagram', tag:'~$1B', kind:'core', ic:'📷',
    h:'<b>~$1B, 2012.</b> Widely called one of the best acquisitions in tech history. A ~13-person photo app became a <b>~3B-MAU</b> platform and Meta\'s primary growth + premium-ad engine — Reels, Shopping and the youth franchise all run through it. The deal that de-risked the mobile transition.' },
  { k:'wa', yr:'2014', n:'WhatsApp', tag:'~$19B', kind:'core', ic:'💬',
    h:'<b>~$19B, 2014.</b> Bought global messaging scale (~3B users). Long an under-monetized asset; now the base for <b>click-to-WhatsApp / business messaging</b> — one of the fastest-growing ad products and the "next monetization surface."' },
  { k:'oculus', yr:'2014', n:'Oculus', tag:'~$2B', kind:'bet', ic:'🥽',
    h:'<b>~$2B, 2014.</b> Seeded what became <b>Reality Labs</b>. The long, expensive bet on owning the next computing platform (~$79B cumulative operating loss since 2020) — strategic option value, not yet a business.' },
  { k:'ctrl', yr:'2019', n:'CTRL-labs', tag:'~$0.5–1B', kind:'bet', ic:'🧠',
    h:'<b>~$0.5–1B, 2019.</b> Neural-interface (EMG wristband) technology — the input layer for AR glasses. Feeds the Orion / wearables roadmap; pre-revenue R&D.' },
  { k:'kustomer', yr:'2021', n:'Kustomer', tag:'~$1B', kind:'tuck', ic:'🎧',
    h:'<b>~$1B, 2021.</b> A CRM/customer-service platform to build out business messaging on WhatsApp/Messenger. Later <b>divested</b> (2023–24) as Meta refocused — a rare walk-back.' },
  { k:'within', yr:'2022', n:'Within (Supernatural)', tag:'~$400M', kind:'bet', ic:'🏋️',
    h:'<b>~$400M, 2022.</b> VR-fitness app. Notable mostly because the <b>FTC sued to block it</b> (and lost) — an early test of antitrust scrutiny on Meta\'s vertical VR expansion.' },
  { k:'scale', yr:'2025', n:'Scale AI (stake)', tag:'~$14.3B', kind:'bet', ic:'🤖',
    h:'<b>~$14.3B for ~49%, 2025.</b> Not a clean acquisition — a large minority stake that brought <b>Alexandr Wang</b> in as Chief AI Officer to lead Meta Superintelligence Labs. The centerpiece of the 2025 AI-talent war; the most expensive and least-proven bet on this list.' },
];
var MNA_KIND={ core:{c:'#0F9D58',l:'Franchise-maker'}, bet:{c:'#8B5CF6',l:'Platform bet'}, tuck:{c:'#8A93A0',l:'Tuck-in / walked back'} };

// ── Industry threats (what could erode the ad machine). threat: pop-ups. ──
var META_THREATS=[
  { k:'tiktok', sev:'high', ic:'🎵', n:'TikTok / short-video attention', teaser:'The sharpest rival for time-spent, especially with the young.',
    h:'<b>The attention war.</b> TikTok proved short-video can out-engage the feed; Meta\'s answer — <b>Reels</b> — now monetizes near feed levels, but the fight for minutes is permanent. A US ban / forced sale would be a direct tailwind; a resurgent TikTok is the clearest threat to engagement (and therefore ad inventory).' },
  { k:'ai-ads', sev:'high', ic:'🤖', n:'AI chat disrupting the ad model', teaser:'If users get answers from assistants, the feed (and its ad slots) shrink.',
    h:'<b>The zero-click risk — and the hedge.</b> If AI assistants (ChatGPT, Gemini, Meta AI) absorb queries and tasks, time in feed and search could erode, shrinking ad inventory. Meta\'s hedge is to <b>be</b> the assistant (Meta AI ~1B users) and to turn AI into better ad ranking (GEM, Advantage+). Double-edged: the same tech that could disrupt the model is the one lifting monetization today.' },
  { k:'google', sev:'med', ic:'🔎', n:'Google — intent + the other walled garden', teaser:'Owns search intent and a cloud to absorb AI capex Meta must monetize alone.',
    h:'<b>The other ad giant.</b> Google owns <b>intent</b> (search) and YouTube; Meta owns <b>social/feed</b> attention and the best direct-response engine. Both re-rating on AI — but Google has a <b>cloud business</b> to defray AI capex, while Meta must earn its return entirely through its own ad products. Not a share-stealer so much as the benchmark for the capex bet.' },
  { k:'amazon', sev:'med', ic:'🛒', n:'Amazon retail media', teaser:'Fast-growing lower-funnel, purchase-intent ad budgets.',
    h:'<b>Share-of-wallet, not the feed.</b> Amazon (and Walmart/retail media) compete for <b>lower-funnel, purchase-intent</b> ad dollars with first-party purchase data. Less an attention rival than a budget rival — pressures the highest-ROI end of Meta\'s ad demand.' },
  { k:'apple', sev:'med', ic:'🍎', n:'Apple — the platform gatekeeper', teaser:'Controls the iOS rules Meta lives under; ATT already taxed targeting.',
    h:'<b>The landlord risk.</b> Apple\'s App Tracking Transparency (2021) structurally taxed Meta\'s targeting (~$10B headwind at the time). Apple sets the iOS rules Meta operates under — the standing strategic reason Meta wants to own the next hardware platform (glasses) and escape phone-OS dependence.' },
  { k:'reg', sev:'med', ic:'⚖️', n:'Regulation — DMA, antitrust, teen safety', teaser:'EU "pay-or-consent," AI-safety and youth pressure persist.',
    h:'<b>The persistent overhang.</b> The FTC monopolization case was <b>dismissed (Nov 2025)</b> — a big clear — but EU DMA "pay-or-consent" fights, teen-safety litigation and emerging AI-liability rules continue. Dual-class control also draws governance criticism. Chronic cost/complexity rather than an existential break-up risk post-FTC.' },
];

// ═══════════════════════════════════════════════════════════════════════════
//  BODY BUILDERS
// ═══════════════════════════════════════════════════════════════════════════
function scMoney(v){ if(v>=1000) return '$'+(v/1000).toFixed(1)+'B'; return '$'+Math.round(v)+'M'; }
var SC_STYLE='<style>'+
  '.sc-sum{font-size:12px;color:var(--navy);margin:6px 0 14px;line-height:1.5}.sc-sum b{font-weight:700}'+
  '.sc-bars{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}'+
  '.sc-row{display:grid;grid-template-columns:160px 1fr 70px;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--bdr)}'+
  '.sc-row:last-child{border-bottom:none}'+
  '.sc-row-name{font-size:12px;font-weight:600;color:var(--navy);line-height:1.3}'+
  '.sc-row-ind{display:block;font-size:10px;font-weight:500;color:var(--mu)}'+
  '.sc-row-bar{height:22px;background:var(--surface);border-radius:5px;overflow:hidden}'+
  '.sc-row-fill{height:100%;border-radius:5px;min-width:2px;transition:width .25s}'+
  '.sc-row-val{font-size:12px;font-weight:700;color:var(--navy);text-align:right;font-variant-numeric:tabular-nums}'+
  '.sc-row-meta{grid-column:1/-1;display:flex;gap:8px;align-items:center;padding:2px 0 4px}'+
  '.sc-row-pct{font-size:10.5px;color:var(--mu)}'+
  '.sc-row-dep{font-size:10.5px;color:var(--mu)}'+
  '.sc-dep-warn{color:#C0392B;font-weight:600}'+
  '@media(max-width:860px){.sc-row{grid-template-columns:120px 1fr 60px}}'+
'</style>';
function scRenderSuppliers(){
  var cat=_scFilter;
  var list=SC_SUPPLIERS.filter(function(s){ return cat==='ALL'||s.cat===cat; });
  var maxRel=list.length?list[0].rel:1;
  var totalRel=0; list.forEach(function(s){ totalRel+=s.rel; });
  var sumEl=document.getElementById('scSum');
  if(sumEl){
    var label=cat==='ALL'?'All categories':(cat==='CAPEX'?'CAPEX — capitalized, hits P&L as D&A over asset life':(cat==='COGS'?'COGS — hits the P&L immediately':'SGA — selling, general & administrative'));
    sumEl.innerHTML='<b>'+list.length+' suppliers</b> · '+scMoney(totalRel)+' total relationship · <span class="ave-subh-note">'+label+'</span>';
  }
  var box=document.getElementById('scBars'); if(!box) return;
  var h='';
  list.forEach(function(s){
    var w=Math.max(2, s.rel/maxRel*100);
    var dep=s.supRev>=15;
    var barColor=s.cat==='CAPEX'?BRAND:(s.cat==='COGS'?'#C0392B':'#8A93A0');
    h+='<div class="sc-row ov-clickable" data-detail="sup:'+esc(s.n)+'">';
    h+='<div class="sc-row-name">'+esc(s.n)+'<span class="sc-row-ind">'+esc(s.ind)+'</span></div>';
    h+='<div class="sc-row-bar"><div class="sc-row-fill" style="width:'+w.toFixed(1)+'%;background:'+barColor+'"></div></div>';
    h+='<div class="sc-row-val">'+scMoney(s.rel)+' ›</div>';
    h+='<div class="sc-row-meta"><span class="ov-chip'+(s.cat==='COGS'?' ov-chip-neg':'')+'">'+s.cat+'</span>';
    h+='<span class="sc-row-pct">'+s.costPct.toFixed(1)+'% of cost</span>';
    h+='<span class="sc-row-dep'+(dep?' sc-dep-warn':'')+'">'+s.supRev.toFixed(1)+'% dep'+(dep?' ⚠':'')+'</span>';
    h+='</div></div>';
  });
  box.innerHTML=h;
  // rows are rebuilt on filter change → (re)bind their modal clicks
  if(typeof _scBindDetails==='function') _scBindDetails();
}
function switchScFilter(root,cat){
  _scFilter=cat;
  root.querySelectorAll('.sc-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-sccat')===cat); });
  scRenderSuppliers();
}
// Bottom Line ▸ Suppliers — who Meta pays (where the AI-capex build lands).
function suppliersBody(){
  var h=SC_STYLE;
  h+='<p class="ov-lede"><b>Meta\'s supply chain is the inverse of most businesses.</b> One thesis to take away: the <b>supplier</b> side has real concentration — a handful of chip/hardware vendors funding the AI build — while the <b>customer</b> side (see Top Line ▸ Customers) has none. So this tab is really the <b>AI-capex story in vendor form</b>: who Meta is paying to build the compute, and where each dollar lands in the P&L.</p>';
  h+=sec('The asymmetry, in numbers',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Largest supplier (NVIDIA)</div><div class="ov-kpi-v">~$11.2B</div><div class="ov-kpi-d down">~13% of Meta\'s cost base</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">…but Meta is of NVIDIA</div><div class="ov-kpi-v">~4%</div><div class="ov-kpi-d muted">of its revenue — Meta needs it more</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Most Meta-dependent</div><div class="ov-kpi-v">~26%</div><div class="ov-kpi-d muted">GoerTek (Quest) · TaskUS (moderation)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Largest customer</div><div class="ov-kpi-v">0.02%</div><div class="ov-kpi-d up">of revenue — no concentration</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">The read: Meta\'s spend is <b>concentrated in AI hardware</b> (NVIDIA, SK hynix, Broadcom, AMD) and <b>geographically in Asia</b> — the supply-chain risk to the buildout. Its revenue is <b>diversified across ~10M advertisers</b> — no single customer has leverage.</div>');
  h+=sec('Top suppliers by relationship size',
    '<p class="ov-lede" style="margin:0 0 12px">Bloomberg\'s estimate of the dollar value of each supplier relationship. Filter by cost category (capitalized <b>CAPEX</b> vs income-statement <b>COGS</b>) — and <b>tap any supplier</b> for what they provide and why it matters.</p>'+
    '<div class="ave-pills" id="scPills">'+
      '<button type="button" class="ave-pill sc-pill active" data-sccat="ALL">All</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="CAPEX">CAPEX</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="COGS">COGS</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="SGA">SGA</button>'+
    '</div>'+
    '<div class="sc-sum" id="scSum"></div>'+
    '<div class="sc-bars" id="scBars"></div>'+
    '<div class="ov-fynote">⚠ = supplier derives >15% of revenue from Meta — concentration risk for the supplier (and a negotiating lever for Meta). <b>NVIDIA</b> is the largest relationship (~$11.2B, 13% of Meta\'s cost) but Meta is only ~4% of NVIDIA\'s revenue. <b>GoerTek</b> (Quest assembly) and <b>TaskUS</b> (content moderation) are the most Meta-dependent (~26% each). CAPEX items depreciate over years; COGS items hit the P&L immediately.</div>');
  var capexS=0,cogsS=0,sgaS=0;
  SC_SUPPLIERS.forEach(function(s){ if(s.cat==='CAPEX') capexS+=s.rel; else if(s.cat==='COGS') cogsS+=s.rel; else sgaS+=s.rel; });
  var totalS=capexS+cogsS+sgaS;
  h+=sec('Where the supplier spend lands',
    '<p class="ov-lede" style="margin:0 0 12px">Of the top-19 supplier relationships (~'+scMoney(totalS)+' total), the split by cost category shows what is capitalized infrastructure vs what hits the income statement immediately:</p>'+
    mbars([
      ['CAPEX (capitalized → D&A)', Math.round(capexS/totalS*100), scMoney(capexS)+' ('+Math.round(capexS/totalS*100)+'%)', BRAND],
      ['COGS (P&L immediate)', Math.round(cogsS/totalS*100), scMoney(cogsS)+' ('+Math.round(cogsS/totalS*100)+'%)', '#C0392B'],
      ['SGA', Math.max(1,Math.round(sgaS/totalS*100)), scMoney(sgaS)+' ('+Math.round(sgaS/totalS*100)+'%)', GRAY],
    ])+
    '<div class="ov-fynote">This ties directly to the <b>Spend Engine</b>: the CAPEX bucket (NVIDIA, SK hynix, Broadcom, Celestica, AMD) is the AI-infrastructure build that depreciates over years. The COGS bucket (GoerTek, Accton, CoreWeave, Qualcomm) hits the P&L now. The reason the "true investment intensity" is hard to read: COGS suppliers are invisible in the capex headline but sit straight in the cost base.</div>');
  h+=sec('Supplier geographic concentration',
    '<p class="ov-lede" style="margin:0 0 12px">'+SC_GEO_TOTAL.suppliers+' suppliers across '+SC_GEO_TOTAL.facilities+' facilities. Top countries by suppliers domiciled:</p>'+
    mbars(SC_GEO.map(function(g){ return [g.c, Math.round(g.pct), g.n+' suppliers ('+g.pct+'%)', g.c==='United States'?BRAND:(g.c==='China'?'#C0392B':(g.c==='Taiwan'||g.c==='South Korea'?RL:GRAY))]; }))+
    '<div class="ov-fynote">The silicon supply chain runs through Asia: <b>China</b> (12.4%), <b>South Korea</b> (6.7% — SK hynix), <b>Taiwan</b> (5.3% — TSMC fabrication). A US–China decoupling or Taiwan disruption would stress the AI buildout directly. MTIA custom silicon and the Broadcom partnership are partial hedges, but NVIDIA (fabbed by TSMC) remains the #1 relationship.</div>');
  h+='<div class="ov-foot">'+SC_NOTE+'</div>';
  return h;
}
// Top Line ▸ Customers — the walled garden in data form (no concentration).
function customersBody(){
  var h='<p class="ov-lede">Here is the punchline of the whole business, in one stat: Meta has <b>~10M+ advertisers</b> and its <b>single largest customer is 0.02% of revenue</b>. There is <b>no customer concentration to speak of</b> — the advertiser base is so fragmented that no one can negotiate. <b>That fragmentation IS the pricing power.</b></p>';
  // Hero contrast: Meta's largest customer vs a typical enterprise-software concentration.
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0 4px">'+
    '<div style="border-radius:13px;padding:16px 18px;color:#fff;background:linear-gradient(135deg,#0866FF 0%,#1877F2 100%)"><div style="font-size:30px;font-weight:900;line-height:1">0.02%</div><div style="font-size:11.5px;opacity:.93;margin-top:6px;line-height:1.4">Meta\'s <b>largest</b> customer, as a share of revenue (~$41M of ~$201B). The top 5 combined are &lt;0.1%.</div></div>'+
    '<div style="border-radius:13px;padding:16px 18px;border:1px solid var(--bdr);background:var(--w)"><div style="font-size:30px;font-weight:900;line-height:1;color:var(--mu)">10–20%</div><div style="font-size:11.5px;color:var(--navy);margin-top:6px;line-height:1.4">what a <b>top-5 customer</b> is worth at a typical enterprise-software company — the concentration Meta simply does not have.</div></div>'+
  '</div>';
  h+='<div class="ov-fynote">'+SC_CUST_GEO.total+' tracked customer relationships across '+SC_CUST_GEO.facilities+' facilities (Bloomberg SPLC) — and these are just the <i>tracked resellers</i>; the real base is ~10M+ advertisers Bloomberg can\'t even enumerate.</div>';
  h+=sec('The "biggest" customers — and why they\'re trivial',
    '<div style="overflow-x:auto"><table class="ov-table"><thead><tr>'+
    '<th>Customer</th><th>What they are</th><th style="text-align:right">Relationship</th>'+
    '<th style="text-align:right">% of META rev</th></tr></thead><tbody>'+
    SC_CUST_TOP.map(function(c){ var wh=({'TD SYNNEX':'IT distributor (resells Meta/WhatsApp business services)','Casino Guichard Perrachon':'French retailer (ad spend)','CDW Corp':'IT reseller','Insight Enterprises':'IT solutions reseller','El Puerto de Liverpool':'Mexican retailer (ad spend)'})[c.n]||'reseller / large advertiser';
      return '<tr><td class="ov-td-name">'+esc(c.n)+'</td><td style="font-size:11px;color:var(--mu)">'+esc(wh)+'</td>'+
        '<td style="text-align:right;font-variant-numeric:tabular-nums">'+scMoney(c.rel)+'</td>'+
        '<td style="text-align:right;font-variant-numeric:tabular-nums">'+c.revPct+'%</td></tr>';
    }).join('')+
    '<tr><td class="ov-td-name" style="color:var(--mu)">… 239 more tracked</td><td></td><td style="text-align:right;color:var(--mu)">all < $2.5M</td><td style="text-align:right;color:var(--mu)">all < 0.01%</td></tr>'+
    '</tbody></table></div>'+
    '<div class="ov-diagram-cap" style="margin-top:8px">Even the "largest" are IT resellers and retailers — not marquee advertisers. Meta\'s actual demand is millions of small businesses running Advantage+ campaigns.</div>');
  h+=sec('Why this matters',
    '<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>No one can demand a discount.</b> Meta sets the auction rules and the take rate; an advertiser\'s only lever is to bid less — and the auction just clears at the next bid. <b>The auction IS the pricing power.</b></li>'+
    '<li><b>Recession-resilient demand.</b> Losing any single advertiser is a rounding error; demand is diversified across ~10M+ businesses and every vertical.</li>'+
    '<li><b>The mirror image of the supplier side.</b> NVIDIA alone is ~13% of Meta\'s <i>cost</i>; no customer is even 0.03% of its <i>revenue</i>. Concentrated where it pays, diversified where it earns — the reverse of most businesses. (See Bottom Line ▸ Suppliers.)</li>'+
    '</ul></div>');
  h+='<div class="ov-foot">'+SC_NOTE+' Customer descriptions are Summit annotations.</div>';
  return h;
}
// Evolution ▸ Earnings Calls — narrative threads, By theme ⇄ By quarter (none open by default).
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads from the <b>10 earnings calls</b> Q4 2023 → Q1 2026. Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered on a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a watch running two quarters is louder than a fresh one. Tap any row to expand. (Quarterly guided-vs-delivered revenue is in the <b>Guidance</b> tab.)</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  h+='<div class="lpb-acc" id="meCallsTheme">';
  META_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CP_THST[sk]||CP_THST.watch;
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+cpStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=metaCallsByQuarter();
  h+='<div class="lpb-acc" id="meCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){ h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-foot">'+SRC_CALLS+'</div>';
  return h;
}
// Top Line ▸ Segments — the two engines.
function segmentsBody(){
  var h='<p class="ov-lede"><b>Two engines, one company</b> — and the whole story is the gap between them.</p>';
  h+='<div class="ov-drivers" style="grid-template-columns:1fr 1fr;margin:2px 0 12px">'+
    '<div class="ov-driver" style="border-top:2px solid '+FOA+'"><div class="ov-driver-t" style="color:'+FOA+'">Family of Apps · the engine</div><div class="ov-driver-d"><ul class="ov-bullets" style="margin:2px 0 0">'+
      '<li>FB · IG · WhatsApp · Messenger · Threads — ~<b>3.5B daily people</b></li>'+
      '<li>~<b>99% of revenue</b>, ~<b>$102B</b> segment operating profit (FY25)</li>'+
      '<li>~<b>50%+ op margin</b> — the walled-garden ad machine</li></ul></div></div>'+
    '<div class="ov-driver" style="border-top:2px solid '+RL+'"><div class="ov-driver-t" style="color:'+RL+'">Reality Labs · the bet</div><div class="ov-driver-d"><ul class="ov-bullets" style="margin:2px 0 0">'+
      '<li>Quest · Ray-Ban/Oakley Meta glasses · Orion AR</li>'+
      '<li>~<b>1% of revenue</b>, a ~<b>−$19B</b> annual operating loss</li>'+
      '<li>~<b>$'+(RL_CUM/1000).toFixed(0)+'B cumulative loss</b> since 2020 — the FoA cash funds it</li></ul></div></div>'+
  '</div>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FOA+'"></span>Family of Apps</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+RL+'"></span>Reality Labs</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue by segment <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meSegRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating income by segment <span>($B, FY · RL is a loss)</span></div><div class="ov-chart-wrap"><canvas id="meSegOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">The <b>~$19B RL loss is the entire gap</b> between the FoA segment margin (~50%+) and the consolidated company margin (~41%). Segment splits are charted as actuals only — the model\'s segment projections are unreliable.</div>';
  h+=kpis(KPIS);
  h+='<div class="ov-diagram-cap" style="margin-top:8px">Deep dives: the ad engine is in <b>Family of Apps</b>; the bet is in <b>Reality Labs</b>; the cost of the AI build is in <b>Bottom Line ▸ Spend Engine</b>.</div>';
  h+='<div class="ov-foot">'+SRC_FIN+'</div>';
  return h;
}
// Top Line ▸ Family of Apps — the ad engine (visual, distilled).
function foaBody(){
  var h='<style>.foa-eq{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:4px 0 2px}'+
    '.foa-lv{border:1px solid var(--bdr);border-top:3px solid var(--fc);border-radius:12px;padding:12px 16px;text-align:center;min-width:120px;background:var(--w)}'+
    '.foa-lv-v{font-size:20px;font-weight:900;color:var(--fc)}.foa-lv-l{font-size:10.5px;color:var(--mu);font-weight:700;margin-top:2px}.foa-lv-s{font-size:10px;color:var(--mu);margin-top:2px}'+
    '.foa-op{font-size:20px;font-weight:800;color:var(--mu)}'+
    '.foa-formula{background:linear-gradient(135deg,#0866FF 0%,#1877F2 100%);color:#fff;border-radius:13px;padding:16px 18px;text-align:center;margin:4px 0 10px}'+
    '.foa-formula-eq{font-size:15px;font-weight:800;line-height:1.5}.foa-formula-eq b{background:rgba(255,255,255,.22);padding:1px 7px;border-radius:6px}'+
    '.gem-ba{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin:6px 0}@media(max-width:640px){.gem-ba{grid-template-columns:1fr}}'+
    '.gem-box{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}.gem-box-h{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px}'+
    '.gem-arrow{font-size:22px;color:'+BRAND+';text-align:center;font-weight:800}@media(max-width:640px){.gem-arrow{transform:rotate(90deg)}}'+
    '.foa-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px}'+
    '.foa-tile{border:1px solid var(--bdr);border-radius:11px;padding:12px 13px;background:var(--w)}'+
    '.foa-tile-v{font-size:17px;font-weight:900;color:'+BRAND+'}.foa-tile-l{font-size:11px;color:var(--navy);font-weight:700;margin-top:3px;line-height:1.35}.foa-tile-s{font-size:10px;color:var(--mu);margin-top:3px;line-height:1.4}</style>';
  h+='<p class="ov-lede"><b>The whole company is this one machine:</b> ~3.5B daily people generate ad impressions; a real-time AI auction turns them into revenue at ~50% margin. Two levers drive it — <b>how many ads</b> and <b>how much each costs</b>.</p>';
  h+='<div class="foa-eq">'+
    '<div class="foa-lv" style="--fc:'+BRAND+'"><div class="foa-lv-v">+18%</div><div class="foa-lv-l">Ad impressions</div><div class="foa-lv-s">YoY · Q4 2025</div></div>'+
    '<div class="foa-op">×</div>'+
    '<div class="foa-lv" style="--fc:#8B5CF6"><div class="foa-lv-v">+6%</div><div class="foa-lv-l">Price per ad</div><div class="foa-lv-s">YoY · Q4 2025</div></div>'+
    '<div class="foa-op">=</div>'+
    '<div class="foa-lv" style="--fc:#0F9D58"><div class="foa-lv-v">ad<br>revenue</div><div class="foa-lv-l">~98% of total</div><div class="foa-lv-s">both AI-driven</div></div>'+
  '</div>';
  h+='<div class="ov-chart-t" style="margin-top:14px">Family of Apps revenue <span>($B, FY · Advertising + Other)</span></div>';
  h+='<div class="ov-chart-wrap"><canvas id="meFoaRev"></canvas></div>';
  h+='<div class="ov-fynote"><b>Family DAP ~3.5B</b> and <b>ARPP</b> (avg revenue per person) both keep rising — the two disclosed KPIs. Meta no longer breaks out per-app ARPU. <span class="ave-subh-note">DAP/ARPP are company disclosures, not in the Summit snapshot.</span></div>';
  h+=sec('The auction, in one line',
    '<div class="foa-formula"><div class="foa-formula-eq">Winning ad &nbsp;≈&nbsp; <b>your bid</b> &nbsp;×&nbsp; <b>predicted action rate</b> &nbsp;×&nbsp; <b>ad quality</b></div></div>'+
    '<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>The AI\'s whole job is the middle term</b> — predicting how likely <i>you</i> are to act on <i>this</i> ad.</li>'+
    '<li><b>Relevance can beat a higher bid</b> — a more relevant ad wins while paying less, so Meta lifts <b>advertiser ROI and price-per-ad at the same time</b>.</li>'+
    '<li><b>That is why engagement = revenue:</b> more Reels/Threads/AI-feed time → more impressions to auction. <span class="ave-subh-note">Want the full 5-step walk-through? It\'s the <b>$1.00 flow</b> in Bottom Line ▸ Unit Economics.</span></li>'+
    '</ul></div>');
  h+=sec('GEM — the model doing the predicting',
    '<div class="gem-ba"><div class="gem-box"><div class="gem-box-h" style="color:var(--mu)">Before</div><div style="font-size:12px;color:var(--navy);line-height:1.5"><b>Many small models</b> — one per surface (Feed/Reels/Stories) and objective (click/install/purchase). Couldn\'t share what they learned.</div></div>'+
    '<div class="gem-arrow">→</div>'+
    '<div class="gem-box" style="border-color:'+BRAND+'"><div class="gem-box-h" style="color:'+BRAND+'">Now · GEM</div><div style="font-size:12px;color:var(--navy);line-height:1.5"><b>One large transformer</b> (same family as LLMs) trained on everything at once — a pattern learned on IG conversions also sharpens FB clicks.</div></div></div>'+
    '<div class="foa-formula" style="background:linear-gradient(135deg,#0F9D58 0%,#0a7d46 100%)"><div class="foa-formula-eq">Result: <b>+3.5% ad clicks</b> on Facebook &nbsp;·&nbsp; <b>&gt;1% more conversions</b> on Instagram &nbsp;<span style="font-weight:600;opacity:.9">(Q4 2025)</span></div></div>'+
    '<div class="ov-diagram-cap">Every accuracy gain is monetized immediately as higher conversion and higher winning bids — this is the clearest line from <b>AI capex → ad revenue</b>. GEM also powers <b>Advantage+</b>: give a goal + budget + creative, the AI does the rest.</div>');
  h+=sec('Where the growth is coming from',
    '<div class="foa-tiles">'+
    '<div class="foa-tile"><div class="foa-tile-v">Reels</div><div class="foa-tile-l">now monetizes at ~feed levels</div><div class="foa-tile-s">once a drag, now a driver</div></div>'+
    '<div class="foa-tile"><div class="foa-tile-v">40%+</div><div class="foa-tile-l">of the FB feed is AI-recommended</div><div class="foa-tile-s">more time-spent → more impressions</div></div>'+
    '<div class="foa-tile"><div class="foa-tile-v">+20%</div><div class="foa-tile-l">Threads time-spent YoY</div><div class="foa-tile-s">near-zero-CAC, off the IG graph</div></div>'+
    '<div class="foa-tile"><div class="foa-tile-v">WhatsApp</div><div class="foa-tile-l">click-to-message among the fastest-growing ad products</div><div class="foa-tile-s">messaging as the next surface</div></div>'+
    '</div>');
  h+='<div class="ov-foot">Segment revenue: Summit DCF (FY21–25 actuals). Ad-engine metrics (impressions, price/ad, GEM, Advantage+): Meta 10-Ks & Q4 2025 earnings call. DAP/ARPP are company disclosures.</div>';
  return h;
}
// Top Line ▸ Reality Labs — the bet.
function rlBody(){
  var h='<p class="ov-lede">Reality Labs is the <b>bet</b>, not the business — a deliberate, large loss the Family of Apps is built to absorb. Keep the focus proportional: it is ~1% of revenue and ~−$19B of profit.</p>';
  h+=sec('What Reality Labs is — the product portfolio',
    '<p class="ov-lede" style="margin:0 0 14px">'+RL_WHAT+'</p>'+
    '<div class="ov-cards" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-card ov-clickable" style="border-top-color:'+RL+'" data-detail="rl:0"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">🥽</span><span class="ov-card-n">Meta Quest</span><span class="ov-chip">Shipping</span></div><div class="ov-card-s">VR/MR headsets — full device revenue to RL segment</div><div class="ov-more">Details ›</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#06C167" data-detail="rl:1"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">🕶️</span><span class="ov-card-n">Ray-Ban & Oakley Meta</span><span class="ov-chip" style="background:#ECFDF5;color:#06C167">>7M units</span></div><div class="ov-card-s">AI glasses w/ EssilorLuxottica — <b>partial</b> revenue recognition</div><div class="ov-more">Details ›</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#7AA9FF" data-detail="rl:2"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">🌐</span><span class="ov-card-n">Horizon & Platform</span><span class="ov-chip" style="background:#EEF0FE;color:#6366F1">Building</span></div><div class="ov-card-s">Social VR + developer platform — strategic, not financial yet</div><div class="ov-more">Details ›</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#F59E0B" data-detail="rl:3"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">🔮</span><span class="ov-card-n">Orion AR</span><span class="ov-chip" style="background:#FEF3E2;color:#D97706">Prototype</span></div><div class="ov-card-s">Full AR glasses — pre-revenue, absorbs most of R&D loss</div><div class="ov-more">Details ›</div></div>'+
    '</div>');
  h+=sec('How to read Reality Labs',
    '<p class="ov-lede" style="margin:0 0 12px">'+RL_NOTE+'</p>'+
    '<div class="ov-drivers" style="grid-template-columns:1fr 1fr 1fr">'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid '+RL+'" data-detail="rlread:0"><div class="ov-driver-t">Revenue understates traction</div><div class="ov-driver-d">Glasses sell millions but EssilorLuxottica books the sale — RL revenue is structurally misleading.</div><div class="ov-more">Why ›</div></div>'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid #06C167" data-detail="rlread:1"><div class="ov-driver-t">Glasses are the bet, not VR</div><div class="ov-driver-d">>7M units sold; investment pivoting toward wearables, away from VR/Horizon.</div><div class="ov-more">Why ›</div></div>'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid #C0392B" data-detail="rlread:2"><div class="ov-driver-t">Losses peak in 2026</div><div class="ov-driver-d">~$19B/yr, ~$79B cumulative — management guided the inflection is now.</div><div class="ov-more">Why ›</div></div>'+
    '</div>');
  h+='<div class="ov-foot">Reality Labs figures: Summit DCF (segment actuals FY21–25) + Meta 10-Ks & Q3–Q4 2025 earnings calls (glasses units, loss-peak guidance). RL revenue understates glasses traction (EssilorLuxottica is seller of record).</div>';
  return h;
}
// Top Line ▸ TAM.
function tamBody(){
  var h='<p class="ov-lede">Meta\'s core market is the <b>global ad budget</b> shifting to digital; the optionality is in new surfaces it is only beginning to monetize.</p>';
  h+=sec('The ad opportunity — where Meta sits',
    mbars(TAM_BARS)+
    '<div class="ov-fynote">Meta captures a large share of <b>social + direct-response</b> digital ad budgets. Bars are approximate industry sizing, not a precise TAM waterfall.</div>');
  h+=sec('Growth optionality — the new surfaces', '<div class="ov-callout">'+bullets(TAM_NEW)+'</div>');
  h+='<div class="ov-foot">'+TAM_NOTE+'</div>';
  return h;
}
// Top Line ▸ Industry Analysis.
function industryBody(){
  var sevCol={high:'#C0392B',med:'#E8A00C',low:'#0F9D58'}, sevL={high:'High',med:'Medium',low:'Low'};
  var h='<style>.mth-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0}@media(max-width:720px){.mth-grid{grid-template-columns:1fr}}'+
    '.mth-card{border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:11px;padding:12px 14px;cursor:pointer;background:var(--w);transition:box-shadow .15s}.mth-card:hover{box-shadow:0 3px 12px rgba(8,102,255,0.09)}'+
    '.mth-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.mth-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.mth-sev{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:9px;padding:2px 7px;white-space:nowrap;color:#fff}'+
    '.mth-teaser{font-size:11.5px;color:var(--mu);line-height:1.5;margin:6px 0 6px}.mth-more{font-size:11px;font-weight:800}'+
    '.mbb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0}@media(max-width:720px){.mbb{grid-template-columns:1fr}}'+
    '.mbb-col{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--w)}.mbb-bull{border-top:3px solid #0F9D58}.mbb-bear{border-top:3px solid #C0392B}'+
    '.mbb-h{font-size:13px;font-weight:800;color:var(--navy);margin-bottom:6px}</style>';
  h+='<p class="ov-lede">Meta fights on two fronts: for <b>attention</b> (TikTok, YouTube, Snap) and for <b>ad budgets + AI</b> (Google, Amazon, the assistants). It is one of the two <b>walled-garden</b> ad giants — the useful question isn\'t "who\'s the peer" but <b>what could erode the ad machine</b>. First the arena, then the threats — <b>tap any threat card</b>.</p>';
  h+=sec('The arena, in numbers',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Daily people (Family of Apps)</div><div class="ov-kpi-v">~3.5B</div><div class="ov-kpi-d muted">the largest attention pool on earth</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Advertising share of revenue</div><div class="ov-kpi-v">~98%</div><div class="ov-kpi-d muted">a pure attention-monetizer</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Ad dollar kept (walled garden)</div><div class="ov-kpi-v">~$1.00</div><div class="ov-kpi-d up">vs ~$0.55 to open-web publishers</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">FoA segment op margin</div><div class="ov-kpi-v">~50%+</div><div class="ov-kpi-d muted">consolidated ~41% after RL</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">The moat is a <b>data + scale + vertical-integration</b> flywheel: ~3.5B users generate the data that trains the ad AI that keeps ~the whole ad dollar. Two players earn walled-garden ad economics at this scale — Meta and Google.</div>');
  h+=sec('What to watch — the threats to the ad machine',
    '<div class="mth-grid">'+META_THREATS.map(function(t){ return '<div class="mth-card ov-clickable" data-detail="threat:'+t.k+'" style="border-left-color:'+sevCol[t.sev]+'">'+
      '<div class="mth-top"><div class="mth-n">'+t.ic+' '+esc(t.n)+'</div><span class="mth-sev" style="background:'+sevCol[t.sev]+'">'+sevL[t.sev]+'</span></div>'+
      '<div class="mth-teaser">'+esc(t.teaser)+'</div><div class="mth-more" style="color:'+sevCol[t.sev]+'">the detail ›</div></div>'; }).join('')+'</div>');
  h+=sec('The investment forces — bull vs bear (with the evidence)',
    '<div class="mbb"><div class="mbb-col mbb-bull"><div class="mbb-h">▲ Bull</div>'+bullets([
      '<b>AI monetizes directly:</b> GEM lifted FB clicks +3.5% and IG conversions >1% (Q4 2025); Advantage+ is becoming a full campaign autopilot — capex showing up as ad revenue.',
      '<b>Walled-garden economics:</b> keeps ~the whole ad dollar (vs ~$0.55 open-web) on ~3.5B daily users — a structural margin + data moat.',
      '<b>Engagement compounding:</b> Reels at feed-level monetization, AI content 40%+ of the FB feed, Threads +20% time-spent, business messaging ramping.',
      '<b>Operating discipline:</b> guides 2026 operating income <i>above</i> 2025 despite the capex step-up; FoA ~50%+ margin funds everything.',
      '<b>Overhang cleared:</b> FTC antitrust case dismissed (Nov 2025) — no break-up; first dividend + large buybacks.']) +'</div>'+
    '<div class="mbb-col mbb-bear"><div class="mbb-h">▼ Bear</div>'+bullets([
      '<b>The most binary AI-capex bet in megacap:</b> ~$125–145B 2026 capex with <b>no external cloud</b> to defray it — every server must pay off through Meta\'s own ads; stock −9% on the Q1\'26 raise.',
      '<b>A long-dated spending commitment:</b> ~$183B leases + ~$237.7B cloud commitments; the D&A + lease run-off pressures margins for years before the AI return is proven.',
      '<b>Reality Labs burn:</b> ~$19B/yr (~$79B cumulative); losses guided to peak 2026 then narrow, but stay red for years.',
      '<b>Attention + AI disruption:</b> TikTok for minutes; AI assistants could shrink feed/search inventory faster than Meta re-monetizes.',
      '<b>Governance:</b> dual-class founder control leaves minority holders little say — a standing discount.']) +'</div></div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>What to watch:</b> (1) capex ROI — ad-revenue acceleration vs the D&A wave; (2) Reality Labs loss trajectory (2026 peak?); (3) Reels/Threads/business-messaging monetization; (4) AI-assistant engagement vs feed cannibalization; (5) a TikTok ban/sale; (6) EU DMA outcomes.</div>');
  h+=sec('Peers — the competitive map',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they are</th><th>How Meta differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+p[1]+'</td><td>'+p[2]+'</td></tr>';}).join('')+'</tbody></table>'+
    '<div class="ov-diagram-cap" style="margin-top:8px">This is the qualitative arena (includes private TikTok). The <b>listed-peer valuation map</b> with live market caps is in <b>Overview ▸ Competitors</b> and <b>Valuation ▸ Multiples</b>.</div>');
  h+='<div class="ov-foot">Meta 10-Ks + Q4 2023–Q1 2026 earnings calls; competitive/threat framing is Summit editorial. Regulatory items per public reporting (FTC dismissal Nov 2025; EU DMA).</div>';
  return h;
}
// Bottom Line ▸ Unit Economics — the walled garden ($1.00 flow + margin structure).
function unitEconBody(){
  var h='<p class="ov-lede">The unit of economics here is <b>one ad dollar</b>. In the open web ~45¢ leaks to middlemen; inside Meta\'s walled garden ~the whole dollar stays — and drops through at ~50%+ segment margin. <b>That is the entire moat, in one number.</b></p>';
  h+=sec('Follow $1.00 of ad spend — open web vs the walled garden',
    '<div class="ov-callout" style="margin-bottom:12px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:6px">In the open web, a dollar passes through a chain of middlemen:</div><ul class="ov-bullets">'+
    '<li><b>DSP</b> (Demand-Side Platform) — the software advertisers buy through — takes ~<b>$0.15</b>.</li>'+
    '<li><b>Ad exchange</b> — the marketplace running the auction — takes ~<b>$0.10</b>.</li>'+
    '<li><b>SSP</b> (Supply-Side Platform) — the software publishers sell through — takes ~<b>$0.20</b> (plus small data/verification fees).</li>'+
    '<li><b>→ The publisher</b> showing the ad keeps only ~<b>$0.55</b>. ~45¢ leaked to intermediaries.</li>'+
    '<li><b>Meta is ALL of those layers at once</b> — publisher, DSP, exchange, SSP and data platform — so it keeps <b>~the entire $1.00</b>. No leakage, full data ownership, control of the whole auction.</li>'+
    '</ul></div>'+
    '<div class="ov-sec-h ovt-store-h">Watch it flow <span class="ave-subh-note">(tap a node, or press ▶ Play to step through)</span></div>'+
    flowHtml());
  h+=sec('Why the margin is structurally high',
    '<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>No intermediary leakage:</b> Meta keeps ~the entire ad dollar vs ~$0.55 to open-web publishers.</li>'+
    '<li><b>Cost base grows slower than revenue:</b> data centers, R&D and S&M scale sub-linearly to ad revenue, so incremental dollars drop through hard — FoA segment ~50%+ op margin.</li>'+
    '<li><b>The consolidated ~41%</b> is the FoA ~50%+ <i>minus</i> Reality Labs\' ~$19B loss — the gap between the two margins IS the RL bet.</li>'+
    '<li><b>The swing factor now:</b> the AI-capex depreciation wave (D&A ~$18.6B → ~$44B by 2027E) is the pressure on that ~41% — see Spend Engine & Margins.</li>'+
    '</ul></div>');
  h+='<div class="ov-foot">'+FLOW_NOTE+' Meta figures reflect its closed-loop ownership of the full ad stack.</div>';
  return h;
}
// Bottom Line ▸ Spend Engine.
function spendBody(){
  var h='<p class="ov-lede">'+SPEND_LEDE+'</p>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Capex <span>($B, FY · actuals + Summit est.)</span></div><div class="ov-chart-wrap"><canvas id="meCapex"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Depreciation & amortization <span>($B, FY · the wave + est.)</span></div><div class="ov-chart-wrap"><canvas id="meDa"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-diagram-cap">'+EST_CAP+' Capex ~doubles to ~$141B (2026E) and ~$174B (2027E); the D&A wave roughly triples by 2028 — the multi-year margin question.</div>';
  h+=sec('Three ways the buildout is funded',
    '<div class="ov-diagram-cap" style="margin:0 0 12px"><b>Tap any card</b> for what the spend is, how it lands in the P&L, and why it matters.</div>'+
    '<div class="ov-drivers">'+SPEND_WAYS.map(function(w){ return '<div class="ov-driver ov-clickable" data-detail="spend:'+w.k+'"><div class="ov-driver-t">'+esc(w.t)+'</div><div class="ov-driver-d">'+w.teaser+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+=sec('Where the AI spend actually lands — clearing the fog',
    '<p class="ov-lede" style="margin:0 0 12px">The reason the AI spend is hard to see: most of it is <b>not</b> capex. Of the ~<b>$42B</b> of cloud commitments coming due in 2026, this is the common-size split of where it hits the income statement — ~<b>71% is operating expense</b> (COGS + R&D), only ~29% capex-adjacent.</p>'+
    '<div class="ov-sec-h ovt-store-h">Where each $1 of 2026 cloud commitments lands <span class="ave-subh-note">(common size · Summit estimate)</span></div>'+
    mbars(SPEND_MIX)+
    '<div class="ov-fynote" style="margin-top:20px">'+SPEND_NOTE+'</div>');
  h+=sec('Where tomorrow\'s efficiencies could come from', '<div class="ov-callout">'+bullets(EFFIC)+'</div>');
  h+='<div class="ov-foot">Capex & D&A: Summit DCF (actuals + 2026E–27E est). The lease/cloud-commitment decomposition is a Summit analytical reconstruction from Meta 10-K/10-Q Note-8 + vendor 8-Ks/press — an estimate, not charted.</div>';
  return h;
}
// Bottom Line ▸ Margins — live via Massive (api.fetchMargins), fallback to seeded history.
var MRG_METRICS=[
  { key:'gross', label:'Gross margin', color:'#0EA5E9' },
  { key:'op',    label:'Operating margin', color:BRAND },
  { key:'net',   label:'Net margin', color:RL },
  { key:'ebitda',label:'EBITDA margin', color:'#6366F1' },
  { key:'fcf',   label:'FCF margin', color:GREEN },
];
var MRG_FALLBACK=[
  { year:'2021', gross:80.8, op:39.6, net:33.4, ebitda:54.6, fcf:33.1 },
  { year:'2022', gross:80.1, op:24.8, net:19.9, ebitda:42.6, fcf:16.3 },
  { year:'2023', gross:80.8, op:34.7, net:29.0, ebitda:54.2, fcf:32.5 },
  { year:'2024', gross:81.7, op:42.2, net:37.9, ebitda:63.0, fcf:32.9 },
  { year:'2025', gross:81.8, op:41.4, net:30.1, ebitda:62.8, fcf:22.9 },
  { year:'2026E', op:45.7, ebitda:65.7, fcf:1.2, net:39.0, gross:81.5, proj:true },
];
var _mrgRows=MRG_FALLBACK.slice(), _mrgSrc='fallback';
var MRG_NOTE_SEED='Margins computed from the Summit DCF series (gross approximated from filings). <b>2026E</b> is shaded (estimate). Note GAAP 2025 net margin dips on the one-time OBBBA tax charge; FCF margin collapses in 2026E as capex peaks, then recovers.';
var MRG_NOTE_LIVE='Historical margins now sourced <b>live from Massive</b> (get-margins); the FY2026E projection is kept from the Summit model. Gross approximated from filings.';
function buildMargins(){
  var id='meMrg', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  var labels=_mrgRows.map(function(r){ return r.year; });
  var ds=MRG_METRICS.map(function(m){ return { label:m.label, data:_mrgRows.map(function(r){ return r[m.key]==null?null:r[m.key]; }), borderColor:m.color, backgroundColor:m.color, borderWidth:2, tension:.25, spanGaps:true, fill:false, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:m.color, pointBorderWidth:2 }; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function loadMargins(){
  if(_mrgSrc==='massive') return;
  import('../api.js').then(function(api){ return api.fetchMargins?api.fetchMargins('META'):null; }).then(function(res){
    if(!res||!res.success||!res.data||res.data.length<3) return;
    var proj=MRG_FALLBACK[MRG_FALLBACK.length-1];
    _mrgRows=res.data.concat(proj&&proj.proj?[proj]:[]);
    _mrgSrc='massive';
    var note=document.getElementById('meMrgNote'); if(note) note.innerHTML=MRG_NOTE_LIVE;
    buildMargins();
  }).catch(function(){});
}
function marginsBody(){
  var h='<p class="ov-lede">The profitability picture: a <b>~80%+ gross margin</b> software business whose operating margin flexes with (1) Reality Labs\' burn and (2) the AI-capex depreciation wave. FoA segment runs ~50%+; consolidated ~41%.</p>';
  h+='<div class="ov-chart-t">Profitability & cash margins <span>(%, FY · actuals + FY2026E est.)</span></div>';
  h+='<div class="ov-chart-wrap ovs-tall"><canvas id="meMrg"></canvas></div>';
  h+='<div class="ov-fynote" id="meMrgNote">'+MRG_NOTE_SEED+'</div>';
  h+='<div class="ov-foot">'+SRC_FIN+' Margins computed from the model series (gross approximated from filings); historical margins swap to live Massive data when available.</div>';
  return h;
}
// Evolution ▸ Guidance — revenue guided band vs delivered (CSS visual) + capex-guide escalation.
function guideLand(g){
  if(g.act==null) return { t:'guide only', c:'guid-mut' };
  var mid=(g.lo+g.hi)/2;
  if(g.act>g.hi) return { t:'above range', c:'guid-up' };
  if(g.act>=mid)  return { t:'upper half', c:'' };
  if(g.act>=g.lo-200) return { t:'in range', c:'' };
  return { t:'below range', c:'guid-dn' };
}
function guideBody(){
  var maxV=62000; // common scale ($M) for the bands
  var h='<style>.gbd{display:flex;flex-direction:column;gap:9px;margin:6px 0 4px}'+
    '.gbd-row{display:grid;grid-template-columns:52px 1fr 118px;gap:10px;align-items:center}'+
    '.gbd-q{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.gbd-tr{position:relative;height:22px;background:var(--surface);border-radius:6px}'+
    '.gbd-band{position:absolute;top:0;bottom:0;background:rgba(8,102,255,.20);border:1px solid rgba(8,102,255,.5);border-radius:5px}'+
    '.gbd-dot{position:absolute;top:50%;width:11px;height:11px;border-radius:50%;transform:translate(-50%,-50%);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.25)}'+
    '.gbd-meta{font-size:10.5px;color:var(--mu);text-align:right}'+
    '.gbd-meta b{font-weight:800}'+
    '.guid-up{color:#16A34A}.guid-dn{color:#C0392B}.guid-mut{color:var(--mu)}'+
  '</style>';
  h+='<p class="ov-lede">Meta gives a <b>next-quarter revenue range</b> at each call (it does not guide full-year metric-by-metric like some peers). The story below: Meta guides <b>conservatively</b> and delivers <b>at or above the top of the range</b> almost every quarter — a track record of under-promising on the top line.</p>';
  h+='<div class="gbd">';
  GUIDE.forEach(function(g){
    var loX=g.lo/maxV*100, hiX=g.hi/maxV*100, land=guideLand(g);
    var dotColor=g.act==null?'#B8C0CA':(g.act>g.hi?'#16A34A':(g.act>=g.lo?BRAND:'#C0392B'));
    var dot=g.act==null?'':'<div class="gbd-dot" style="left:'+(g.act/maxV*100)+'%;background:'+dotColor+'"></div>';
    h+='<div class="gbd-row"><div class="gbd-q">'+esc(g.q)+'</div>'+
      '<div class="gbd-tr"><div class="gbd-band" style="left:'+loX.toFixed(1)+'%;width:'+(hiX-loX).toFixed(1)+'%"></div>'+dot+'</div>'+
      '<div class="gbd-meta">$'+(g.lo/1000).toFixed(1)+'–'+(g.hi/1000).toFixed(1)+'B'+(g.act!=null?' · <b class="'+land.c+'">'+(g.act/1000).toFixed(1)+'B '+land.t+'</b>':' · <b class="guid-mut">'+land.t+'</b>')+'</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote">Blue band = the <b>guided revenue range</b> set at the prior call; dot = <b>delivered actual</b> (green = above the top of the range). Meta beat the top of its range in 8 of the last 9 reported quarters. Source: Summit (REVENUE_GUIDANCE_HIGH/LOW) + reported actuals; 2Q26 shows the guide only (not yet reported at snapshot).</div>';
  h+=sec('The capex guide — the number that actually moves the stock',
    '<p class="ov-lede" style="margin:0 0 10px">Revenue guidance is steady; the <b>capex</b> guide is where the drama is. It has been raised at nearly every call — the market\'s real debate:</p>'+
    '<div style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Call</th><th>Capex guide</th><th>Note</th></tr></thead><tbody>'+
    CAPEX_GUIDE.map(function(c){ return '<tr><td class="ov-td-name">'+esc(c.d)+'</td><td style="font-weight:800;color:'+BRAND+'">'+esc(c.g)+'</td><td>'+esc(c.n)+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ov-fynote">From ~$30–37B (early 2024) to ~$125–145B (2026) — a ~4× step-up in two years. Twice the raise sent the stock down sharply (Q1\'24 −11%, Q1\'26 −9%): the market keeps testing whether the return justifies the spend.</div>');
  h+='<div class="ov-foot">Revenue guidance: Summit model (REVENUE_GUIDANCE_HIGH/LOW), snapshot 2026-05-22, vs reported actuals. Capex-guide figures from the earnings calls.</div>';
  return h;
}
// Evolution ▸ Strategy — the flywheel (visual), then the four bets.
var STRAT_LOOP=[
  { ic:'👥', t:'Engage', d:'Reels, AI-recommended content, Threads manufacture more attention', col:'#0866FF' },
  { ic:'🤖', t:'Rank', d:'AI (GEM, Advantage+) turns attention into ad revenue — more relevant ads, higher price', col:'#8B5CF6' },
  { ic:'💵', t:'Cash', d:'FoA keeps ~the whole ad dollar at ~50%+ margin — the profit engine', col:'#0F9D58' },
  { ic:'🚀', t:'Build', d:'The cash funds the next platform (AI, glasses) so Meta is never a tenant again', col:'#F59E0B' },
];
function strategyBody(){
  var h='<style>.fly{display:grid;grid-template-columns:repeat(4,1fr);gap:0;align-items:stretch;margin:8px 0 4px}@media(max-width:720px){.fly{grid-template-columns:1fr 1fr}}'+
    '.fly-node{position:relative;border:1px solid var(--bdr);border-top:3px solid var(--fc);border-radius:12px;padding:13px 12px;background:var(--w);margin:0 6px}'+
    '.fly-ic{font-size:24px;line-height:1}.fly-t{font-size:14px;font-weight:900;color:var(--navy);margin-top:5px}.fly-d{font-size:10.5px;color:var(--mu);line-height:1.45;margin-top:4px}'+
    '.fly-ar{position:absolute;right:-11px;top:50%;transform:translateY(-50%);font-size:16px;color:var(--mu);z-index:2}@media(max-width:720px){.fly-ar{display:none}}'+
    '.sh-hero{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:2px 0 6px}@media(max-width:640px){.sh-hero{grid-template-columns:1fr}}'+
    '.sh{border-radius:13px;padding:14px 15px;color:#fff}.sh-v{font-size:15px;font-weight:900;line-height:1.15}.sh-l{font-size:11px;opacity:.93;margin-top:5px;line-height:1.4}</style>';
  h+='<p class="ov-lede">Meta\'s strategy is <b>one loop</b> run at enormous scale: engagement manufactures ad inventory → AI ranks it into revenue → the cash funds the next platform bet → which drives more engagement. The bull case is the loop compounds; the bear case is the capex outruns the monetization.</p>';
  h+='<div class="fly">'+STRAT_LOOP.map(function(n,i){ return '<div class="fly-node" style="--fc:'+n.col+'"><div class="fly-ic">'+n.ic+'</div><div class="fly-t" style="color:'+n.col+'">'+esc(n.t)+'</div><div class="fly-d">'+esc(n.d)+'</div>'+(i<STRAT_LOOP.length-1?'<span class="fly-ar">→</span>':'')+'</div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin:6px 0 14px;text-align:center">↻ &nbsp;<b>Build</b> feeds back into <b>Engage</b> — the loop closes.</div>';
  h+='<div class="sh-hero">'+STRAT_HERO.map(function(s,i){ var cols=['#0866FF','#8B5CF6','#F59E0B']; return '<div class="sh" style="background:linear-gradient(135deg,'+cols[i]+' 0%,'+cols[i]+'cc 100%)"><div class="sh-v">'+esc(s[0])+'</div><div class="sh-l">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
  h+=sec('The four bets that carry it',
    '<div class="ov-diagram-cap" style="margin:0 0 12px"><b>Tap any card</b> for the detail.</div>'+
    '<div class="ov-drivers">'+STRAT_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="strat:'+d.k+'"><div class="ov-driver-t">'+esc(d.t)+'</div><div class="ov-driver-d">'+d.d.slice(0,90)+'…</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:14px">'+STRAT_NOTE+'</div>');
  h+='<div class="ov-foot">Strategy framing is Summit editorial, grounded in Meta\'s Q4 2023–Q1 2026 earnings calls & 10-Ks.</div>';
  return h;
}
// Valuation ▸ Multiples.
function multiplesBody(){
  var h='<p class="ov-lede">Meta trades at a <b>mid-20s forward P/E</b> — a premium to the ad-and-cloud peers but a discount to high-growth performance-ad names — with the discount reflecting the binary AI-capex bet (no external cloud to defray the compute).</p>';
  h+='<div style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Company</th><th style="text-align:right">P/E</th><th style="text-align:right">EV/EBITDA</th><th style="text-align:right">Rev growth</th><th style="text-align:right">Op margin</th><th>Note</th></tr></thead><tbody>'+
    MULT_ROWS.map(function(r){ var me=/META/.test(r.n); return '<tr'+(me?' style="background:rgba(8,102,255,.06)"':'')+'><td class="ov-td-name">'+esc(r.n)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums'+(me?';font-weight:800;color:'+BRAND:'')+'">'+esc(r.pe)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums">'+esc(r.ev)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums">'+esc(r.g)+'</td><td style="text-align:right">'+esc(r.m)+'</td><td>'+esc(r.note)+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  h+='<div class="ov-fynote"><b>How to read it:</b> Meta and Alphabet — the two profitable, walled-garden ad giants — anchor the group at ~20–22× forward. Amazon and Netflix carry higher P/Es on lower-margin or content-led models. AppLovin sits richest on the fastest growth. The interactive valuation-vs-growth map (with live market caps) is in <b>Overview ▸ Competitors</b>. <span class="ave-subh-note">Multiples & growth are web-sourced approximations (mid-2026), directional not exact.</span></div>';
  h+='<div class="ov-foot">Peer multiples & growth are web-sourced approximations (mid-2026), directional not exact. Meta financials from the Summit model. Live market caps drive the Overview scatter.</div>';
  return h;
}
// Valuation ▸ Sensitivity — drivers → EPS → implied price vs live.
function sensCompute(d){
  var revNext=SENS_BASE.adRev2025*(1+d.growth/100)+SENS_BASE.otherRev;
  var opInc=revNext*(d.opm/100);
  var netInc=opInc*(1-SENS_BASE.taxRate/100);
  var sharesNext=SENS_BASE.sharesM*(1-d.buyback/100);
  var eps=netInc/sharesNext;
  var price=eps*d.pe;
  return { rev:revNext, opInc:opInc, netInc:netInc, eps:eps, price:price };
}
function sensBody(){
  var h='<style>.sens-grid{display:flex;flex-direction:column;gap:12px;margin:8px 0 6px}'+
    '.sens-drv{display:grid;grid-template-columns:1fr;gap:3px}'+
    '.sens-drv-top{display:flex;justify-content:space-between;align-items:baseline}'+
    '.sens-drv-l{font-size:12px;font-weight:700;color:var(--navy)}'+
    '.sens-drv-v{font-size:13px;font-weight:800;color:'+BRAND+';font-variant-numeric:tabular-nums}'+
    '.sens-drv input{width:100%}'+
    '.sens-drv-h{font-size:10.5px;color:var(--mu)}'+
  '</style>';
  h+='<p class="ov-lede">A back-of-envelope: move the four drivers → implied EPS → implied price at the chosen P/E, versus the live price. <b>Not a price target</b> — a way to see which lever matters.</p>';
  h+='<div class="sens-grid">'+SENS_DRIVERS.map(function(d){
    return '<div class="sens-drv" data-sk="'+d.k+'"><div class="sens-drv-top"><span class="sens-drv-l">'+esc(d.label)+'</span><span class="sens-drv-v" id="sensV-'+d.k+'">'+d.val+d.unit+'</span></div>'+
      '<input type="range" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+d.val+'" data-sk="'+d.k+'">'+
      '<div class="sens-drv-h">'+esc(d.hint)+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-kpis" id="meSensTiles" style="grid-template-columns:repeat(4,1fr)"></div>';
  h+='<div class="ov-diagram-cap" id="meSensLive" style="margin-top:10px"></div>';
  h+='<div class="ov-foot">Anchors (Summit / filings): FY2025 advertising ~$196B, other revenue ~$4.8B, diluted shares ~2,574M, ~15% tax rate. EPS ≈ [ad-rev×(1+g)+other] × op-margin × (1−tax) ÷ shares; implied price = EPS × P/E. Simplifications: excludes net interest income and one-time tax items (so it approximates a normalized EPS); the model holds shares flat while reality shrinks them. Directional only.</div>';
  return h;
}
function sensRender(root){
  var d={}; SENS_DRIVERS.forEach(function(x){ d[x.k]=x.val; });
  var r=sensCompute(d);
  var tiles=root.querySelector('#meSensTiles');
  if(tiles){ function t(l,v,sub,dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
    tiles.innerHTML=t('Implied revenue','$'+(r.rev/1000).toFixed(0)+'B','next-year, driver-implied','muted')+
      t('Implied net income','$'+(r.netInc/1000).toFixed(0)+'B','op margin × (1−tax)','muted')+
      t('Implied EPS','$'+r.eps.toFixed(2),'net income ÷ shares','muted')+
      t('Implied price','$'+r.price.toFixed(0),'EPS × P/E','up'); }
  var live=root.querySelector('#meSensLive');
  if(live){ var px=_metaLivePx||SENS_BASE.pxFallback; var up=r.price>=px; var diff=(r.price/px-1)*100;
    live.innerHTML='Implied <b>$'+r.price.toFixed(0)+'</b> vs '+(_metaLivePx?'<b>live $'+px.toFixed(0)+'</b>':'~$'+px.toFixed(0)+' (est)')+' — <b style="color:'+(up?'#16A34A':'#C0392B')+'">'+(up?'+':'−')+Math.abs(diff).toFixed(0)+'%'+(up?' upside':' downside')+'</b> at these assumptions.'; }
}
function sensInit(root){
  SENS_DRIVERS.forEach(function(x){ x.val=x.val; });
  root.querySelectorAll('#dd-detail .sens-drv input, .ovt-subpane[data-ovst="sensitivity"] .sens-drv input').forEach(function(){});
  root.querySelectorAll('.sens-drv input').forEach(function(inp){
    inp.oninput=function(){ var k=inp.getAttribute('data-sk'); var drv=null; SENS_DRIVERS.forEach(function(x){ if(x.k===k) drv=x; }); if(!drv) return;
      drv.val=parseFloat(inp.value); var vEl=root.querySelector('#sensV-'+k); if(vEl) vEl.textContent=drv.val+drv.unit; sensRender(root); };
  });
  sensRender(root);
}
// Valuation ▸ Capital Allocation.
function capAllocBody(){
  var h='<p class="ov-lede">Meta funds a record AI build <b>and</b> returns cash — primarily by shrinking the share count (~10% since FY21), plus a small dividend started in 2024. Buybacks run well ahead of the dividend.</p>';
  h+=kpis([
    { l:'FY2025 FCF', v:'$46.1B', d:'after $69.7B capex', dir:'up' },
    { l:'Buybacks (FY25)', v:'~$29B', d:'primary cash return', dir:'up' },
    { l:'Dividend (FY25)', v:'~$5.3B', d:'$0.525/qtr · since 2024', dir:'muted' },
    { l:'Shares', v:'2,574M', d:'−~10% since FY21', dir:'up' },
  ]);
  h+='<div class="ov-chart-t">Capital return vs free cash flow <span>($B, FY · buybacks + dividends vs FCF)</span></div>';
  h+='<div class="ov-chart-wrap"><canvas id="meCap"></canvas></div>';
  h+='<div style="overflow-x:auto;margin-top:8px"><table class="ov-table"><thead><tr><th>FY</th><th style="text-align:right">FCF</th><th style="text-align:right">Buybacks</th><th style="text-align:right">Dividends</th><th style="text-align:right">Shares (M)</th></tr></thead><tbody>'+
    CAP_YEARS.map(function(y,i){ return '<tr><td class="ov-td-name">'+y+'</td><td style="text-align:right">$'+CAP_FCF[i].toFixed(1)+'B</td><td style="text-align:right">$'+CAP_BUYBK[i].toFixed(1)+'B</td><td style="text-align:right">'+(CAP_DIV[i]?'$'+CAP_DIV[i].toFixed(1)+'B':'—')+'</td><td style="text-align:right">'+CAP_SHARES[i]+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  h+='<div class="ov-fynote">'+CAP_NOTE+'</div>';
  h+='<div class="ov-foot">FCF & share count from the Summit model; buyback & dividend dollars approximate (public 10-K/press) — confirm against the latest 10-K/8-K.</div>';
  return h;
}
// Valuation ▸ Financials (DCF range slider).
function finSlice(){ var s=FIN_SERIES[_finMetric]; return { years:FIN_YEARS.slice(_finStart,_finEnd+1), data:s.data.slice(_finStart,_finEnd+1) }; }
function buildFinChart(){
  var id='meFin', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  var sl=finSlice(), s=FIN_SERIES[_finMetric];
  var colors=sl.years.map(function(y){ return /E$/.test(y)?FC:s.color; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:sl.years, datasets:[{ data:sl.data, backgroundColor:colors, borderRadius:4, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return money(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ { id:'vl', afterDatasetsDraw:function(ch){ var ctx=ch.ctx; ch.getDatasetMeta(0).data.forEach(function(b,i){ var v=ch.data.datasets[0].data[i];
      ctx.save(); ctx.textAlign='center'; ctx.font='700 10px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(money(v), b.x, (v<0?b.y+13:b.y-6)); ctx.restore(); }); } } ] });
}
function renderFin(){
  var root=document.querySelector('.ov-meta-dd')||document.querySelector('.ov-meta'); if(!root) return;
  buildFinChart();
  var t=document.getElementById('meFinT'); var s=FIN_SERIES[_finMetric];
  if(t) t.innerHTML=esc(s.label)+' <span>($B, FY · actuals + Summit 2026E–2027E est.)</span>';
}
function switchFinMetric(root,k){ if(!FIN_SERIES[k]) return; _finMetric=k;
  root.querySelectorAll('.fin-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-finm')===k); }); renderFin(); }
function finBody(){
  var h='<p class="ov-lede">The Summit DCF financials, one series at a time. Actuals FY2019–FY2025 plus the model\'s <b>2026E–2027E</b> consolidated estimates (shaded). Drag the handles to window the years.</p>';
  h+='<div class="ave-pills" style="margin-bottom:10px">'+Object.keys(FIN_SERIES).map(function(k){ return '<button type="button" class="ave-pill fin-pill'+(k==='rev'?' active':'')+'" data-finm="'+k+'">'+esc(FIN_SERIES[k].label)+'</button>'; }).join('')+'</div>';
  h+='<div class="ov-chart-t" id="meFinT">Revenue <span>($B, FY · actuals + Summit 2026E–2027E est.)</span></div>';
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="meFin"></canvas></div>';
  h+=rangeSlider('fin', FIN_YEARS.length-1, FIN_YEARS[0], FIN_YEARS[FIN_YEARS.length-1]);
  h+='<div class="ov-fynote" style="margin-top:12px">'+EST_CAP+' GAAP net income (2025) is depressed by a one-time OBBBA deferred-tax charge; EBITDA and operating income are unaffected. FCF collapses in 2026E as capex peaks (~$141B), then recovers in 2027E.</div>';
  h+='<div class="ov-foot">Summit DCF model, snapshot 2026-05-22. 2028+ excluded (terminal-artifact in the model).</div>';
  return h;
}
// Management ▸ Track Record.
function trackBody(){
  var card=function(p){ var rt=META_TRACK_RATE[p.rate];
    return '<div class="mtk-card ov-clickable" data-detail="matr:'+p.id+'" style="border-left:3px solid '+rt.c+';background:'+rt.bg+'">'+
      '<div class="mtk-top"><div><div class="mtk-n">'+esc(p.n)+'</div><div class="mtk-r">'+esc(p.r)+'</div></div><span class="mtk-badge" style="color:'+rt.c+';border-color:'+rt.c+'">'+rt.l+'</span></div>'+
      '<div class="mtk-t">'+esc(p.t)+'</div><div class="mtk-one">'+p.one+'</div>'+
      '<div class="mtk-more" style="color:'+rt.c+'">Read more ›</div></div>'; };
  var bcard=function(b){ var rt=META_TRACK_RATE[b.rate];
    return '<div class="mtk-bcard" style="border-left:3px solid '+rt.c+'"><div class="mtk-btop"><span class="mtk-bn">'+esc(b.n)+'</span><span class="mtk-bdot" style="background:'+rt.c+'"></span></div><div class="mtk-br">'+esc(b.r)+'</div><div class="mtk-bnote">'+b.note+'</div></div>'; };
  var h='<style>.mtk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 4px}@media(max-width:720px){.mtk-grid{grid-template-columns:1fr}}'+
    '.mtk-card{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;cursor:pointer;transition:box-shadow .15s}.mtk-card:hover{box-shadow:0 3px 12px rgba(8,102,255,0.09)}'+
    '.mtk-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}'+
    '.mtk-n{font-size:14px;font-weight:800;color:var(--navy)}.mtk-r{font-size:11px;color:var(--mu);margin-top:1px}'+
    '.mtk-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border:1px solid;border-radius:9px;padding:2px 7px;white-space:nowrap}'+
    '.mtk-t{font-size:10.5px;color:var(--mu);margin:7px 0 5px}.mtk-one{font-size:12px;color:var(--navy);line-height:1.5}.mtk-more{font-size:11px;font-weight:800;margin-top:8px}'+
    '.mtk-bgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}@media(max-width:720px){.mtk-bgrid{grid-template-columns:1fr}}'+
    '.mtk-bcard{border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;background:var(--w)}'+
    '.mtk-btop{display:flex;align-items:center;justify-content:space-between;gap:6px}.mtk-bn{font-size:12px;font-weight:800;color:var(--navy)}.mtk-bdot{width:9px;height:9px;border-radius:50%;flex:none}'+
    '.mtk-br{font-size:10.5px;color:var(--mu);margin:1px 0 4px}.mtk-bnote{font-size:11px;color:var(--navy);line-height:1.45}</style>';
  h+='<p class="ov-lede">The people running Meta, rated on <b>value creation</b> (a Meta record and a prior/external one) — the color is the net read. The signature feature: a <b>founder with voting control</b> plus a long-tenured inner circle (Li · Cox · Olivan), now bolted onto a <b>brand-new, expensive AI/legal/president bench</b> (Wang · Mahoney · Powell McCormick). <b>Tap any card</b> for the full read.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(META_TRACK_RATE).map(function(k){ var rt=META_TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+rt.c+'"></span>'+rt.l+'</span>'; }).join('')+'</div>';
  h+='<div class="mtk-grid">'+META_TRACK.map(card).join('')+'</div>';
  h+='<div class="ov-sec-h" style="margin:18px 0 8px">Board — value-creation reads</div>';
  h+='<div class="mtk-bgrid">'+META_BOARD_TRACK.map(bcard).join('')+'</div>';
  h+='<div class="ov-foot">Editorial reads from tenure + what each person built (not a Meta statement). Roster verified current as of Jul 2026; see Executives & Board for full bios. Financial trajectory from the Summit model.</div>';
  return h;
}
// Management ▸ Governance & SBC.
function buildSbc(){
  var id='meSbc', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:SBC_YEARS, datasets:[
      { type:'bar', label:'SBC ($B)', data:SBC_DOLLARS, backgroundColor:RL, borderRadius:4, maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Diluted shares (M)', data:SBC_YEARS.map(function(y,i){ return CAP_SHARES[i]; }), borderColor:BRAND, backgroundColor:BRAND, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:BRAND, pointBorderWidth:2, yAxisID:'y1' } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.datasetIndex===0?'$'+ctx.parsed.y.toFixed(1)+'B':ctx.parsed.y+'M'); } } } },
      scales:{ y:{ position:'left', grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } },
        y1:{ position:'right', grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function govBody(){
  var h='<p class="ov-lede">The defining governance feature is <b>founder voting control</b> via a dual-class structure — decisive, long-horizon capital allocation on the one hand; little minority-holder say on the other.</p>';
  h+='<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>Dual-class:</b> Class B = 10 votes/share (founder-held), Class A = 1 vote. Zuckerberg controls <b>~61% of voting power</b> with ~13% economics.</li>'+
    '<li><b>Controlled company:</b> combined CEO + Chair; an independent lead director (R. Kimmitt); some independence rules waived under "controlled company" status.</li>'+
    '<li><b>Capital return:</b> first dividend 2024 ($0.50 → $0.525/qtr) + large buybacks; share count −~10% since FY21.</li>'+
    '<li><b>Minority say:</b> say-on-pay and director elections are effectively advisory given the voting majority — the governance discount in the multiple.</li>'+
    '</ul></div>';
  h+=sec('Stock-based compensation vs the share count',
    '<div class="ov-chart-t">SBC expense vs diluted shares <span>($B and M shares, FY)</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="meSbc"></canvas></div>'+
    '<div class="ov-fynote">'+SBC_NOTE+'</div>');
  h+='<div class="ov-foot">Voting/ownership from Meta proxy disclosures; SBC from the 10-K cash-flow statement (approx). Confirm specifics in the latest DEF 14A.</div>';
  return h;
}
// Evolution ▸ Timeline & M&A.
function timelineBody(){
  var h='<style>.mna-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin:6px 0 2px}'+
    '.mna-card{border:1px solid var(--bdr);border-top:3px solid var(--mu);border-radius:11px;padding:12px 13px;cursor:pointer;background:var(--w);transition:box-shadow .15s}.mna-card:hover{box-shadow:0 3px 12px rgba(8,102,255,0.09)}'+
    '.mna-top{display:flex;align-items:center;gap:8px}.mna-ic{font-size:20px}.mna-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.mna-yr{font-size:10px;color:var(--mu);font-weight:700}.mna-tag{font-size:13px;font-weight:900;margin-top:6px}'+
    '.mna-kind{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-top:4px}.mna-more{font-size:10.5px;font-weight:800;margin-top:6px}</style>';
  h+='<p class="ov-lede">Two decades: a college network → a ~$1.8T ad-and-AI company — via the best acquisitions in tech, the 2022 crash, and the AI re-rate.</p>';
  h+=sec('Company history — the arc',
    '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
      var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
      return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
    }).join('')+'</div>');
  h+=sec('M&A — how Meta bought its way to the next platform',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Meta\'s M&A splits cleanly: a few <b>franchise-makers</b> (Instagram, WhatsApp) that de-risked the business, and a run of <b>platform bets</b> (Oculus → Scale AI) that are still unproven. <b>Tap any deal.</b></div>'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(MNA_KIND).map(function(k){ return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+MNA_KIND[k].c+'"></span>'+MNA_KIND[k].l+'</span>'; }).join('')+'</div>'+
    '<div class="mna-grid">'+META_MNA.map(function(m){ var kc=MNA_KIND[m.kind];
      return '<div class="mna-card ov-clickable" data-detail="mna:'+m.k+'" style="border-top-color:'+kc.c+'"><div class="mna-top"><span class="mna-ic">'+m.ic+'</span><div><div class="mna-n">'+esc(m.n)+'</div><div class="mna-yr">'+esc(m.yr)+'</div></div></div><div class="mna-tag" style="color:'+kc.c+'">'+esc(m.tag)+'</div><div class="mna-kind" style="color:'+kc.c+'">'+kc.l+'</div><div class="mna-more" style="color:'+kc.c+'">Details ›</div></div>';
    }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px">The pattern: <b>Instagram + WhatsApp</b> (~$20B combined) built the modern franchise; everything since Oculus is a <b>platform bet</b> the ad machine funds — Reality Labs (~$79B cumulative loss) and now the ~$14.3B Scale AI stake. Meta buys optionality on <i>not</i> being a tenant on someone else\'s platform.</div>');
  h+='<div class="ov-foot">Deal values are widely-reported approximates (press + 10-Ks). Company arc from Meta 10-Ks & investor history.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  OVERVIEW HOOK BLOCKS — money map · products · moat · peer scatter
// ═══════════════════════════════════════════════════════════════════════════
function moneyMapBody(){
  var h='<p class="ov-lede" style="margin:0 0 10px">Meta makes money one way: <b>advertising</b> (~98% of revenue), sold by real-time auction across the Family of Apps. Everything else — Reality Labs hardware, WhatsApp business messaging — is small today.</p>';
  h+=mbars([
    ['Advertising (Family of Apps)', 98, '~$197B · FY25', BRAND],
    ['Reality Labs + other', 2, '~$4B · FY25', RL],
  ]);
  h+='<div class="ov-diagram-cap" style="margin:10px 0 6px">The revenue engine, step by step — <b>tap any step</b> for detail:</div>';
  h+=chain(AD_FLOW,'ad');
  h+='<div class="ov-diagram-cap" style="margin-top:8px">The full economics (why Meta keeps ~the whole ad dollar) are in <b>Deep Dive ▸ Bottom Line ▸ Unit Economics</b>; the ad engine in <b>Top Line ▸ Family of Apps</b>.</div>';
  return h;
}
function productsBody(){
  var h='<div class="stdp-group"><div class="stdp-seg">Family of Apps — the ad engine (~99% of revenue)</div><div class="stdp">'+
    '<div class="stdp-card"><div class="stdp-ic">📘</div><div class="stdp-n">Facebook</div><div class="stdp-d">The original social graph — feed, groups, Marketplace, video. Still a huge ad surface.</div></div>'+
    '<div class="stdp-card"><div class="stdp-ic">📷</div><div class="stdp-n">Instagram</div><div class="stdp-d">Visual/short-video (Reels) — the growth engine and a premium ad surface; ~3B MAU.</div></div>'+
    '<div class="stdp-card"><div class="stdp-ic">💬</div><div class="stdp-n">WhatsApp</div><div class="stdp-d">~3B users; click-to-message ads + business messaging — the next monetization surface.</div></div>'+
    '<div class="stdp-card"><div class="stdp-ic">🧵</div><div class="stdp-n">Threads / Messenger</div><div class="stdp-d">Threads (text, time-spent +20% YoY) + Messenger — newer surfaces ramping monetization.</div></div>'+
  '</div></div>';
  h+='<div class="stdp-group"><div class="stdp-seg">Reality Labs — the platform bet (~1% of revenue, ~−$19B)</div><div class="stdp">'+
    '<div class="stdp-card ov-clickable" data-detail="rl:0"><div class="stdp-ic">🥽</div><div class="stdp-n">Meta Quest</div><div class="stdp-d">VR/MR headsets — full device revenue to RL.</div><div class="stdp-more">Details ›</div></div>'+
    '<div class="stdp-card ov-clickable" data-detail="rl:1"><div class="stdp-ic">🕶️</div><div class="stdp-n">Ray-Ban & Oakley Meta</div><div class="stdp-d">AI glasses (>7M units 2025) — the breakout, partial revenue recognition.</div><div class="stdp-more">Details ›</div></div>'+
    '<div class="stdp-card ov-clickable" data-detail="rl:3"><div class="stdp-ic">🔮</div><div class="stdp-n">Orion AR</div><div class="stdp-d">Full AR glasses — prototype; absorbs most of RL\'s R&D loss.</div><div class="stdp-more">Details ›</div></div>'+
  '</div></div>';
  return h;
}
function moatBody(){
  var h='<p class="ov-lede" style="margin:0 0 10px">Meta\'s moat is the <b>walled garden</b>: it owns every layer of the ad stack, so it keeps ~the whole ad dollar where open-web publishers keep ~$0.55.</p>';
  h+=mbars(ECO_OPEN);
  h+='<div class="ov-fynote" style="margin-top:10px">Open web: ~45¢ of each $1.00 leaks to the DSP, exchange, SSP and data vendors before the publisher is paid. <b>Meta is all of those layers at once</b> — no leakage, full data ownership, control of the whole auction. That vertical integration is the structural margin <i>and</i> data moat. The interactive "$1.00 flow" is in <b>Deep Dive ▸ Bottom Line ▸ Unit Economics</b>.</div>';
  return h;
}
// Peer scatter (dynamic; live market caps).
function metaScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-dot{transition:.15s}.mg-node text{pointer-events:none}'+
    '.masc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.masc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.masc-chip .x{color:var(--mu);font-weight:800}'+
    '.masc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.masc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.masc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-node .mg-dot{transition:stroke-width .12s}.mg-node:hover .mg-dot{stroke-width:4.5}.mg-node:hover{filter:drop-shadow(0 3px 7px rgba(16,20,26,.25))}'+
    '.mg-tip{position:fixed;z-index:60;width:262px;background:#fff;color:var(--navy);border-radius:12px;padding:0;overflow:hidden;box-shadow:0 12px 30px rgba(16,20,26,.28);pointer-events:none;border:1px solid var(--bdr)}'+
    '.mgt-hd{display:flex;align-items:center;gap:9px;padding:11px 13px 8px}'+
    '.mgt-logo{width:32px;height:32px;border-radius:50%;border:2px solid;background:#fff;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}.mgt-logo img{width:100%;height:100%;object-fit:cover;border-radius:50%}'+
    '.mgt-n{font-weight:800;font-size:14px}'+
    '.mgt-chips{display:flex;flex-wrap:wrap;gap:5px;padding:0 13px 8px}'+
    '.mgt-chip{font-size:10px;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:7px;padding:2px 7px}.mgt-chip b{color:var(--navy);font-weight:800}'+
    '.mgt-why{font-size:11px;line-height:1.5;color:var(--navy);padding:8px 13px 12px;border-top:1px solid var(--bdr);background:#F8FAFC}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD</b>. <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill active" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="meScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="meScXlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="meScNodes"></g>'+
  '</svg></div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:12px;margin:8px 0 2px;font-size:10.5px;color:var(--mu)">'+Object.keys(META_CATS).map(function(k){ return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:50%;background:'+META_CATS[k].c+'"></span>'+esc(META_CATS[k].l)+'</span>'; }).join('')+'</div>';
  h+='<div class="masc-chips" id="meScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Each company is its <b>logo</b>, ringed by <b>category color</b> and sized by <b>live market cap</b> — <b>hover (or tap) for the read</b>. The arena: ad giants (<b>Alphabet, Amazon</b>), subscription/attention (<b>Netflix</b>), social-ad pure-plays (<b>Reddit, Snap, Pinterest</b>), performance-ad (<b>AppLovin</b>) and the open-web buy-side (<b>Trade Desk</b> — the DSP Meta\'s walled garden bypasses). Remove a peer with the <b>×</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026); market caps are live. Directional, not exact.</span></div>';
  h+='<div id="meScTip" class="mg-tip" hidden></div>';
  return h;
}
function metaScRender(root){
  var g=root.querySelector('#meScNodes'); if(!g||!META_SC.peers) return;
  // Domain min/max per multiple so bubbles spread across the plot instead of clustering.
  var mLo=META_SC.type==='ev'?8:14, mHi=META_SC.type==='ev'?34:52;
  var gLo=6, gHi=42, X0=84, X1=610, Y0=250, Y1=46;
  var lab=root.querySelector('#meScXlab'); if(lab) lab.textContent=(META_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(META_SC.basis==='f'?'forward':'trailing');
  var frag='';
  META_SC.peers.forEach(function(p){
    if(!p.on) return; var m=metaScMult(p); if(m==null||isNaN(m)) return;
    var growth=META_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var col=(META_CATS[p.cat]||META_CATS.social).c;
    var x=X0+Math.max(0,Math.min(1,(m-mLo)/(mHi-mLo)))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,((growth||0)-gLo)/(gHi-gLo)))*(Y0-Y1);
    var r=Math.max(15,Math.min(26, 13+Math.sqrt(Math.max(1,p.mc))*0.30)); var ri=r-2.5;
    var mono=esc((p.tk||p.n).slice(0,4));
    frag+='<g class="mg-node" data-tk="'+esc(p.tk)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" style="cursor:pointer">'+
      '<clipPath id="meClip-'+esc(p.tk)+'"><circle r="'+ri.toFixed(1)+'"/></clipPath>'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="#fff" stroke="'+col+'" stroke-width="'+(p.hl?3.5:2)+'"></circle>'+
      '<text class="mg-mono" y="4" text-anchor="middle" font-family="Inter,sans-serif" font-size="'+(ri>18?12:10)+'" font-weight="800" fill="'+col+'">'+mono+'</text>'+
      '<image href="https://assets.parqet.com/logos/symbol/'+esc(p.tk)+'" x="'+(-ri).toFixed(1)+'" y="'+(-ri).toFixed(1)+'" width="'+(2*ri).toFixed(1)+'" height="'+(2*ri).toFixed(1)+'" clip-path="url(#meClip-'+esc(p.tk)+')" preserveAspectRatio="xMidYMid slice" onerror="this.remove()"></image>'+
      (p.hl?'<circle r="'+(r+3).toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"></circle>':'')+
      '</g>';
  });
  g.innerHTML=frag;
}
function metaScChips(root){
  var box=root.querySelector('#meScChips'); if(!box||!META_SC.peers) return;
  var h=META_SC.peers.map(function(p,i){ return '<span class="masc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  box.innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  CHART ENGINES + segment/spend/capital builders
// ═══════════════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }
function fcCol(labels, solid){ return labels.map(function(l){ return /E$/.test(l)?FC:solid; }); }
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
function stacked2(id, labels, s1, s2, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:s1.label, data:s1.data, backgroundColor:s1.color, stack:'s', maxBarThickness:48 },
      { label:s2.label, data:s2.data, backgroundColor:s2.color, stack:'s', maxBarThickness:48, borderRadius:3 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }, y:{ stacked:true, display:false, grace:'14%' } } },
    plugins:[ { id:'tot', afterDatasetsDraw:function(ch){ var ctx=ch.ctx, top=ch.getDatasetMeta(1).data;
      top.forEach(function(b,i){ var tot=s1.data[i]+s2.data[i]; ctx.save(); ctx.textAlign='center'; ctx.font='700 10.5px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(fmt(tot), b.x, b.y-6); ctx.restore(); }); } } ] });
}
function grouped(id, labels, s1, s2, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:s1.label, data:s1.data, backgroundColor:s1.color, borderRadius:3, maxBarThickness:24 },
      { label:s2.label, data:s2.data, backgroundColor:s2.color, borderRadius:3, maxBarThickness:24 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function buildFoa(){ stacked2('meFoaRev', SEG_YEARS, { label:'Advertising', data:ADV_S, color:AD }, { label:'Other', data:OTH_S, color:OTHER }, money); }
function buildSegments(){
  grouped('meSegRev', SEG_YEARS, { label:'Family of Apps', data:FOA_REV, color:FOA }, { label:'Reality Labs', data:RL_REV, color:RL }, money);
  grouped('meSegOp', SEG_YEARS, { label:'Family of Apps', data:FOA_OP, color:FOA }, { label:'Reality Labs', data:RL_OP, color:RL }, money);
}
function buildSpend(){ bar('meCapex', YEARS_X, CAPEX_X, YEARS_X.map(function(l,i){ return /E$/.test(l)?FC:(i===6?NEG:GRAY); }), money); bar('meDa', DA_YEARS_X, DA_X, fcCol(DA_YEARS_X,RL), money); }
function buildCapital(){
  var id='meCap', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:CAP_YEARS, datasets:[
      { label:'Buybacks', data:CAP_BUYBK, backgroundColor:BRAND, stack:'r', maxBarThickness:40 },
      { label:'Dividends', data:CAP_DIV, backgroundColor:RL, stack:'r', maxBarThickness:40, borderRadius:3 },
      { type:'line', label:'Free cash flow', data:CAP_FCF, borderColor:GREEN, backgroundColor:GREEN, borderWidth:2.5, tension:.25, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:GREEN, pointBorderWidth:2 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:10, font:{ size:10.5 }, color:'#6b7684' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }, y:{ stacked:true, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '$'+v+'B'; } } } } } });
}

// ═══════════════════════════════════════════════════════════════════════════
//  MODEL vs REALITY (AVE back-test) — migrated verbatim
// ═══════════════════════════════════════════════════════════════════════════
function groupRow(label,items){ return '<div class="ave-group"><span class="ave-group-l">'+esc(label)+'</span><div class="ave-pills">'+items.map(function(it){ return '<button type="button" class="ave-pill" data-ave="'+it[0]+'">'+esc(it[1])+'</button>'; }).join('')+'</div></div>'; }
function aveFmt(m,v){ if(v==null) return '—'; return m.fmt==='pct'?v.toFixed(1)+'%':money(v); }
function aveSurprise(m,i){ var e=m.est[i]; if(e==null) return 0; if(m.fmt==='pct') return m.act[i]-e; if(e===0) return 0; return (m.act[i]-e)/Math.abs(e)*100; }
function aveSurpStr(m,v){ return (v<0?'−':'+')+Math.abs(v).toFixed(1)+(m&&m.fmt==='pct'?'pp':'%'); }
var aveLabels={ id:'aveLabels', afterDatasetsDraw:function(chart){
  var surp=chart.$surp||[], bars=chart.getDatasetMeta(0).data, ctx=chart.ctx, area=chart.chartArea;
  if(area){ var y0=chart.scales.y.getPixelForValue(0); ctx.save(); ctx.strokeStyle='#D7DDE4'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(area.left,y0); ctx.lineTo(area.right,y0); ctx.stroke(); ctx.restore(); }
  for(var i=0;i<surp.length;i++){ var bar=bars[i]; if(!bar) continue; var above=surp[i]>=0;
    ctx.save(); ctx.textAlign='center'; ctx.font='700 11px Inter, sans-serif'; ctx.fillStyle=above?AVE_GREEN:AVE_RED;
    ctx.fillText((above?'▲ ':'▼ ')+aveSurpStr(AVE[_aveMetric],surp[i]), bar.x, above?bar.y-7:bar.y+15); ctx.restore(); } } };
function buildAveChart(){
  var id='meAveChart', cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:[], datasets:[{ data:[], backgroundColor:[], borderRadius:3, maxBarThickness:54 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:24, bottom:22 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{
        title:function(items){ return (_charts.meAveChart.$q||[])[items[0].dataIndex]||''; },
        label:function(ctx){ var i=ctx.dataIndex,m=AVE[_aveMetric]; return ['Estimate: '+aveFmt(m,(_charts.meAveChart.$est||[])[i]),'Actual: '+aveFmt(m,(_charts.meAveChart.$act||[])[i]),'Surprise: '+aveSurpStr(m,(_charts.meAveChart.$surp||[])[i])]; } } } },
      scales:{ y:{ display:false, grace:'22%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ aveLabels ] });
}
function computeAveStats(m,a,b){
  var surp=[],beats=0,best={s:-Infinity,q:''},worst={s:Infinity,q:''};
  for(var i=a;i<=b;i++){ var s=aveSurprise(m,i); surp.push(s); if(s>=0) beats++; if(s>best.s) best={s:s,q:m.quarters[i]}; if(s<worst.s) worst={s:s,q:m.quarters[i]}; }
  var n=surp.length,sum=surp.reduce(function(t,v){return t+v;},0),sumAbs=surp.reduce(function(t,v){return t+Math.abs(v);},0);
  var sorted=surp.slice().sort(function(x,y){return x-y;}),mid=Math.floor(n/2),median=n===0?0:(n%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2),avg=n?sum/n:0;
  return { n:n,beats:beats,misses:n-beats,beatRate:n?beats/n*100:0,missRate:n?(n-beats)/n*100:0,avg:avg,avgAbs:n?sumAbs/n:0,median:median,best:best,worst:worst,last:{ s:surp[n-1],q:m.quarters[b] } };
}
function renderAveStats(m,a,b){
  var box=document.getElementById('meAveStats'); if(!box) return; var s=computeAveStats(m,a,b);
  function tile(l,v,sub,dir){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(l)+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d '+(dir||'muted')+'">'+esc(sub)+'</div></div>'; }
  var u=m.fmt==='pct'?'pp':'%';
  box.innerHTML=tile('Beat rate', s.beatRate.toFixed(0)+'%', s.beats+' of '+s.n+' above estimate', s.beatRate>=s.missRate?'up':'down')+
    tile('Miss rate', s.missRate.toFixed(0)+'%', s.misses+' of '+s.n+' below estimate', s.missRate>s.beatRate?'down':'muted')+
    tile('Avg surprise', aveSurpStr(m,s.avg), s.avg>=0?'model ran conservative':'model ran optimistic', s.avg>=0?'up':'down')+
    tile('Median surprise', aveSurpStr(m,s.median), 'middle quarter', s.median>=0?'up':'down')+
    tile('Avg gap (abs)', s.avgAbs.toFixed(1)+u, 'typical distance from estimate', 'muted')+
    tile('Biggest beat', aveSurpStr(m,s.best.s), s.best.q, 'up')+
    tile('Biggest miss', aveSurpStr(m,s.worst.s), s.worst.q, 'down')+
    tile('Latest ('+s.last.q+')', aveSurpStr(m,s.last.s), s.last.s>=0?'beat estimate':'missed estimate', s.last.s>=0?'up':'down');
}
function renderAve(a,b){
  var m=AVE[_aveMetric], ch=_charts.meAveChart;
  if(ch){ var labels=[],est=[],act=[],surp=[],colors=[]; for(var i=a;i<=b;i++){ var s=aveSurprise(m,i); labels.push(m.quarters[i]); est.push(m.est[i]); act.push(m.act[i]); surp.push(+s.toFixed(1)); colors.push(s>=0?AVE_GREEN:AVE_RED); }
    ch.data.labels=labels; ch.data.datasets[0].data=surp; ch.data.datasets[0].backgroundColor=colors; ch.$surp=surp; ch.$est=est; ch.$act=act; ch.$q=labels; ch.update('none'); }
  renderAveStats(m,a,b);
}
function setupAveSlider(){
  var mn=document.getElementById('aveMin'), mx=document.getElementById('aveMax'), fill=document.getElementById('aveFill'); if(!mn||!mx||!fill) return;
  var m=AVE[_aveMetric], maxI=m.quarters.length-1; mn.max=maxI; mx.max=maxI; mn.value=0; mx.value=maxI;
  function apply(){ var a=+mn.value,b=+mx.value; fill.style.left=(a/maxI*100)+'%'; fill.style.width=((b-a)/maxI*100)+'%'; renderAve(a,b); }
  mn.oninput=function(){ if(+mn.value>=+mx.value) mn.value=+mx.value-1; apply(); };
  mx.oninput=function(){ if(+mx.value<=+mn.value) mx.value=+mn.value+1; apply(); };
  apply();
}
function switchAveMetric(root,k){
  if(!AVE[k]) return; _aveMetric=k;
  root.querySelectorAll('.ave-pill[data-ave]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ave')===k); });
  var m=AVE[k], t=document.getElementById('meAveT'), note=document.getElementById('meAveNote');
  if(t) t.innerHTML=esc(m.label)+' — surprise vs estimate <span>(%, per quarter · hover for value)</span>';
  if(note) note.textContent=m.note; setupAveSlider();
}
function buildModelTab(){ var root=document.querySelector('.ov-meta-dd')||document.querySelector('.ov-meta'); if(!root) return; buildAveChart(); switchAveMetric(root,_aveMetric); }
function modelBody(){
  var h='<p class="ov-lede" style="margin-bottom:14px">How the <b>Summit DCF</b>\'s quarterly estimate stacked up against what Meta actually reported. Each bar is the <b>surprise</b> (actual vs estimate); green = favorable (beat), red = unfavorable (miss). Pick a metric and drag the handles to window the quarters — chart and tiles recompute live.</p>';
  h+='<div class="ave-groups">'+
    groupRow('Revenue', [['rev','Total revenue'],['adv','Advertising revenue']])+
    groupRow('Profitability', [['opinc','Operating income'],['opmargin','Operating margin']])+
    '</div>';
  h+='<div class="ave-leg"><span class="ave-leg-i"><span class="ave-leg-up">▲</span> favorable (beat)</span><span class="ave-leg-i"><span class="ave-leg-dn">▼</span> unfavorable (miss)</span></div>';
  h+='<div class="ov-chart-t" id="meAveT"></div>';
  h+='<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="meAveChart"></canvas></div>';
  h+=rangeSlider('ave', 1, '', '');
  h+='<div class="ave-subh-note" id="meAveNote" style="margin:6px 2px 16px"></div>';
  h+='<div class="ov-kpis" id="meAveStats" style="grid-template-columns:repeat(4,1fr)"></div>';
  h+='<div class="ov-foot">Estimates are the model\'s projection_history; actuals are reported. Quarterly back-test 1Q23–1Q26 (Advertising revenue starts 1Q24). Operating margin is derived (operating income ÷ revenue) and its surprise is shown in <b>percentage points (pp)</b>. Snapshot 2026-05-22.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  SHELL — standardized Overview + Deep Dive spine
// ═══════════════════════════════════════════════════════════════════════════
var STD_STYLE='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
  '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
  '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
  '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
  '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
  '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
  '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
  '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
  '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
  '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND+';margin-bottom:5px}'+
  '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
  '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
  '.stdp-seg{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 7px}.stdp-group:first-child .stdp-seg{margin-top:2px}'+
  '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
  '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);transition:.14s}'+
  '.stdp-card.ov-clickable{cursor:pointer}.stdp-card.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
  '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
  '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND+';margin-top:6px}'+
  '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
  '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
  '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
  '.dd-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 14px;border-bottom:1px solid var(--bdr);padding-bottom:10px}'+
  '.dd-tab{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:12px;font-weight:800;color:var(--mu);padding:7px 14px;border-radius:999px;cursor:pointer}'+
  '.dd-tab.active{background:'+BRAND+';color:#fff;border-color:'+BRAND+'}</style>';
function html(c){
  var h='<div class="ov ov-meta" data-brand="META">'+STD_STYLE;
  h+=metaKeyFacts();
  h+='<div class="ov-live" id="meLive" hidden></div>';
  h+='<p class="ov-lede">'+DESC+'</p>';
  h+=metaFourQuad();
  h+=collapsible('How Meta makes money — the ad auction', moneyMapBody());
  h+=collapsible('What it makes — the products', productsBody());
  h+=collapsible('The walled garden — Meta\'s moat', moatBody());
  h+=collapsible('Competitors — valuation vs growth', metaScatter());
  h+=collapsible('Timeline', '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>');
  h+='<div class="ov-foot">'+esc(OV_SOURCE)+'</div>';
  h+='<div class="ov-modal-back" id="meModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="meModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="meModalT"></div><div class="ov-modal-b" id="meModalB"></div></div></div>';
  h+='</div>';
  return h;
}
// Deep Dive — the 5-tab spine (sibling profile tab). Pillars absorbed via dd-*-slot.
function subtabs(group, subs){
  var bar='<div class="ovt-subtabs">'+subs.map(function(s,i){ return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; }).join('')+'</div>';
  var panes=subs.map(function(s,i){ return '<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i===0?'':' hidden')+'>'+s.body+'</div>'; }).join('');
  return '<div class="dd-pane" data-dd="'+group+'"'+(group==='topline'?'':' hidden')+'>'+bar+panes+'</div>';
}
function deepDiveHtml(c){
  var h='<div class="ov ov-meta ov-meta-dd" data-brand="META">'+STD_STYLE;
  h+='<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
  '</div>';
  h+=subtabs('topline',[
    { k:'segments', l:'Segments', body:segmentsBody() },
    { k:'foa', l:'Family of Apps', body:foaBody() },
    { k:'rl', l:'Reality Labs', body:rlBody() },
    { k:'customers', l:'Customers', body:customersBody() },
    { k:'tam', l:'TAM', body:tamBody() },
    { k:'industry', l:'Industry Analysis', body:industryBody() },
  ]);
  h+=subtabs('bottomline',[
    { k:'unit', l:'Unit Economics', body:unitEconBody() },
    { k:'spend', l:'Spend Engine', body:spendBody() },
    { k:'suppliers', l:'Suppliers', body:suppliersBody() },
    { k:'margins', l:'Margins', body:marginsBody() },
  ]);
  h+=subtabs('evolution',[
    { k:'callprep', l:'Call Prep', body:
      cpIRButton()+
      '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer, in three phases: <b>① Pre-Call</b> (Setup · Watch List, themes tracked across quarters) → <b>② Post-Results</b> (the numbers, which land before the call) → <b>③ Post-Call</b> (what management said + the meeting take). Append-only per quarter — pick a quarter below. Each quarter combines Meta\'s earnings call + same-day Follow-Up Q&A as <b>one call</b> (docs/calls/META*.md). The <b>Watch List</b> is the single home for theme-tracking — the old <i>Earnings Calls</i> tab is folded into it. <b>Consensus (Bloomberg) + Summit + the 4 custom KPIs render "to fill / to define" until the export lands.</b></div>'+
      cpQPills()+
      '<div class="cp-phtabs">'+
        '<button type="button" class="cp-phtab active" data-cpp="setup">Setup</button>'+
        '<button type="button" class="cp-phtab" data-cpp="watch">Watch List</button>'+
        '<button type="button" class="cp-phtab" data-cpp="results">Post-Results</button>'+
        '<button type="button" class="cp-phtab" data-cpp="postcall">Post-Call</button>'+
      '</div>'+
      '<div class="cp-phpane" data-cpp="setup">'+cpSetupBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="watch" hidden>'+cpWatchBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="results" hidden>'+cpResultsBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="postcall" hidden>'+cpCallBody(c)+'</div>' },
    { k:'results', l:'Results', body:resultsHtml('META') },
    { k:'estevo', l:'Estimates', body:resultsEvoHtml('META') },
    // Model vs Reality + Guidance retired from the bar (SAB, Jul 2026) — superseded
    // by Results/Estimates; modelBody()/guideBody() kept below for salvage.
    { k:'strategy', l:'Strategy', body:strategyBody() },
    { k:'timeline', l:'Timeline', body:timelineBody() },
  ]);
  h+=subtabs('valuation',[
    { k:'ratings', l:'Analyst Ratings', body:'<div id="dd-val-slot"></div>' },
    { k:'multiples', l:'Multiples', body:multiplesBody() },
    { k:'sensitivity', l:'Sensitivity', body:sensBody() },
    { k:'capalloc', l:'Capital Allocation', body:capAllocBody() },
    { k:'balance', l:'Financials', body:finBody() },
  ]);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:META_MGMT.body() },
    { k:'track', l:'Track Record', body:trackBody() },
    { k:'gov', l:'Governance & SBC', body:govBody() },
    { k:'ownership', l:'Ownership', body:'<div id="dd-mgmt-slot"></div>' },
  ]);
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  h+='</div>';
  return h;
}

// ─── Live price + market cap (Massive via api.liveQuote) ─────────────────────
function meBig(m){ if(m==null) return null; var a=Math.abs(m); if(a>=1e12) return '$'+(a/1e12).toFixed(2)+'T'; if(a>=1e9) return '$'+(a/1e9).toFixed(a/1e9>=100?0:1)+'B'; return '$'+Math.round(a/1e6)+'M'; }
function renderLive(root){
  var el=root.querySelector('#meLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live data…</span>';
  import('../api.js').then(function(api){ return api.liveQuote('META'); }).then(function(res){
    var q=(res && res.success) ? res.data : null;
    if(!q || q.price==null){ el.hidden=true; el.innerHTML=''; return; }
    _metaLivePx=q.price; try{ sensRender(root); }catch(e){}
    if(q.marketCap!=null){ var mcEl=root.querySelector('#meMc'); if(mcEl){ var mcB=q.marketCap/1e9; mcEl.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; }
      META_SC.peers && META_SC.peers.forEach(function(p){ if(p.tk==='META') p.mc=q.marketCap/1e9; }); metaScRender(root); }
    var up=(q.changePct==null||q.changePct>=0);
    var html='<span class="ov-live-dot"></span><span class="ov-live-tk">META</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>';
    if(q.changePct!=null) html+='<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(q.changePct).toFixed(2)+'%</span>';
    if(q.marketCap!=null) html+='<span class="ov-live-mc">'+meBig(q.marketCap)+' mkt cap</span>';
    if(q.ev!=null)        html+='<span class="ov-live-mc">'+meBig(q.ev)+' EV</span>';
    if(q.netDebt!=null)   html+='<span class="ov-live-mc">'+(q.netDebt<0?'net cash ':'net debt ')+meBig(q.netDebt)+'</span>';
    if(q.shares!=null)    html+='<span class="ov-live-mc">'+(q.shares/1e9).toFixed(2)+'B sh</span>';
    html+='<span class="ov-live-ts">live · NASDAQ · Massive</span>';
    el.innerHTML=html;
  }).catch(function(){ el.hidden=true; el.innerHTML=''; });
}
// Live market caps for peer bubbles.
function metaLiveOne(root,tk){
  import('../api.js').then(function(m){ return m&&m.liveQuote?m.liveQuote(tk):null; }).then(function(res){
    var q=(res&&res.success)?res.data:null; if(!q||q.marketCap==null) return;
    META_SC.peers && META_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=q.marketCap/1e9; }); metaScRender(root);
  }).catch(function(){});
}

// ═══════════════════════════════════════════════════════════════════════════
//  ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════
function activeDD(root){ var t=root.querySelector('.dd-tab.active'); return t?t.getAttribute('data-dd'):'topline'; }
function activeSubKey(root, group){ var p=root.querySelector('.dd-pane[data-dd="'+group+'"] .ovt-subtab.active'); return p?p.getAttribute('data-ovst'):null; }
function buildSub(root, group, key){
  if(group==='topline' && key==='segments') buildSegments();
  if(group==='topline' && key==='foa') buildFoa();
  if(group==='bottomline' && key==='spend') buildSpend();
  if(group==='bottomline' && key==='suppliers') scRenderSuppliers();
  if(group==='bottomline' && key==='margins'){ buildMargins(); loadMargins(); }
  if(group==='evolution' && key==='results') initResults();
  if(group==='evolution' && key==='estevo') initResultsEvo();
  if(group==='valuation' && key==='sensitivity') sensInit(root);
  if(group==='valuation' && key==='capalloc') buildCapital();
  if(group==='valuation' && key==='balance') renderFin();
  if(group==='mgmt' && key==='team') META_MGMT.init(root);
  if(group==='mgmt' && key==='gov') buildSbc();
}
function buildDD(root, group){ var key=activeSubKey(root, group); if(key) buildSub(root, group, key); }
function showSub(root, group, key){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
  pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.onclick=function(){ showSub(root, group, b.getAttribute('data-ovst')); }; });
}
function showDD(root, group){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===group); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==group); });
  requestAnimationFrame(function(){ buildDD(root, group); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(b){ b.onclick=function(){ showDD(root, b.getAttribute('data-dd')); }; }); }

// Peer scatter interactions.
function wireScatter(root){
  metaScReset(); metaScRender(root); metaScChips(root);
  var tip=root.querySelector('#meScTip');
  function reRender(){ metaScRender(root); metaScChips(root); wireChips(); wireNodes(); }
  root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.onclick=function(){ META_SC.type=b.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(x){ x.classList.toggle('active', x===b); }); metaScRender(root); wireNodes(); }; });
  root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.onclick=function(){ META_SC.basis=b.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(x){ x.classList.toggle('active', x===b); }); metaScRender(root); wireNodes(); }; });
  function peerByTk(tk){ var r=null; (META_SC.peers||[]).forEach(function(p){ if(p.tk===tk) r=p; }); return r; }
  function wireNodes(){ root.querySelectorAll('#meScNodes .mg-node').forEach(function(n){
    function show(e){ if(!tip) return; var p=peerByTk(n.getAttribute('data-tk')); if(!p) return;
      var col=(META_CATS[p.cat]||META_CATS.social).c;
      var pe=(META_SC.basis==='f'?p.peF:p.peT), ev=(META_SC.basis==='f'?p.evF:p.evT), gr=(META_SC.basis==='f'?p.gf:p.gt);
      var chip=function(l,v){ return v==null?'':'<span class="mgt-chip"><b>'+v+'</b> '+l+'</span>'; };
      tip.hidden=false;
      tip.innerHTML='<div class="mgt-hd"><span class="mgt-logo" style="border-color:'+col+'"><img src="https://assets.parqet.com/logos/symbol/'+esc(p.tk)+'" alt="" onerror="this.remove()"></span><span class="mgt-n" style="color:'+col+'">'+esc(p.n)+'</span></div>'+
        '<div class="mgt-chips">'+chip('P/E',pe?pe+'×':null)+chip('EV/EBITDA',ev?ev+'×':null)+chip('growth',gr?gr+'%':null)+chip('mkt cap',p.mc?'$'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):null)+'</div>'+
        '<div class="mgt-why">'+(p.why||'')+'</div>';
      var x=(e.touches?e.touches[0].clientX:e.clientX), y=(e.touches?e.touches[0].clientY:e.clientY); tip.style.left=Math.min(x+14, window.innerWidth-280)+'px'; tip.style.top=Math.min(y+14, window.innerHeight-180)+'px'; }
    function hide(){ if(tip) tip.hidden=true; }
    n.onmousemove=show; n.onmouseenter=show; n.onmouseleave=hide; n.onclick=show; }); }
  function wireChips(){ root.querySelectorAll('#meScChips .masc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); META_SC.peers.splice(i,1); reRender(); }; }); }
  wireNodes(); wireChips();
}

function wireModal(root){
  var back=root.querySelector('#meModalBack'); if(back && back.parentNode!==root) root.appendChild(back);
  var mT=root.querySelector('#meModalT'), mB=root.querySelector('#meModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#meModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){ var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='cp'){ return CP_POP[id]||null; }
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='ad'){ var s=AD_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:(s.detail||s.d)}:null; }
    if(kind==='spend'){ var w=SPEND_WAYS.filter(function(x){return x.k===id;})[0]; return w?{t:w.t,h:w.detail}:null; }
    if(kind==='rl'){ var rlD=RL_DETAIL[+id]; return rlD?{t:rlD.t,h:rlD.h}:null; }
    if(kind==='rlread'){ var rlR=RL_READ_DETAIL[+id]; return rlR?{t:rlR.t,h:rlR.h}:null; }
    if(kind==='strat'){ var st=STRAT_DRIVERS.filter(function(x){return x.k===id;})[0]; return st?{t:st.t,h:st.d}:null; }
    if(kind==='mna'){ var m=META_MNA.filter(function(x){return x.k===id;})[0]; return m?{t:m.n+' · '+m.yr,h:m.h}:null; }
    if(kind==='threat'){ var th=META_THREATS.filter(function(x){return x.k===id;})[0]; return th?{t:th.ic+' '+th.n,h:th.h}:null; }
    if(kind==='sup'){ var sp=null; SC_SUPPLIERS.forEach(function(x){ if(x.n===id) sp=x; }); if(!sp) return null;
      var catL=sp.cat==='CAPEX'?'CAPEX — capitalized, depreciates over years':(sp.cat==='COGS'?'COGS — hits the P&L now':'SG&A');
      var chip=function(l,v){ return '<span class="mgt-chip"><b>'+v+'</b> '+l+'</span>'; };
      var body='<div style="font-size:12px;color:var(--mu);margin-bottom:8px">'+esc(sp.ind)+'</div>'+
        '<div class="mgt-chips" style="padding:0;margin-bottom:10px">'+chip('relationship',scMoney(sp.rel))+chip('of Meta cost',sp.costPct.toFixed(1)+'%')+chip('supplier\'s rev from Meta',sp.supRev.toFixed(1)+'%')+'</div>'+
        '<div class="ov-fynote" style="margin:0 0 10px">'+catL+(sp.supRev>=15?' · <b style="color:#C0392B">⚠ '+sp.supRev.toFixed(0)+'% dependent on Meta</b> — concentration risk for the supplier (a Meta negotiating lever).':'')+'</div>'+
        '<div style="font-size:12.5px;line-height:1.6;color:var(--navy)">'+(SC_SUP_WHAT[sp.n]||('A '+sp.ind.toLowerCase()+' supplier to Meta, booked as '+sp.cat+'. Relationship '+scMoney(sp.rel)+' (~'+sp.costPct.toFixed(1)+'% of Meta\'s cost base).'))+'</div>';
      return { t:esc(sp.n), h:body }; }
    if(kind==='matr'){ var tr=META_TRACK.filter(function(x){return x.id===id;})[0]; if(!tr) return null; var rt=META_TRACK_RATE[tr.rate];
      var body='<div style="font-size:12px;color:var(--mu);margin-bottom:4px">'+esc(tr.r)+' · '+esc(tr.t)+'</div>'+
        '<div style="margin:6px 0 10px"><span class="ov-chip" style="background:'+rt.bg+';color:'+rt.c+';border:1px solid '+rt.c+'">'+rt.l+'</span></div>'+
        '<div class="mtk-one" style="font-size:13px;margin-bottom:10px">'+tr.one+'</div>'+
        '<div class="ov-subh" style="margin:6px 0 4px">At Meta</div>'+bullets(tr.co)+
        '<div class="ov-subh" style="margin:10px 0 4px">Prior / external</div>'+bullets(tr.ext)+
        '<div class="ov-fynote" style="margin-top:10px">'+tr.note+'</div>';
      return { t:tr.n, h:body }; }
    return null; }
  // Delegated: catches static AND dynamically-rebuilt [data-detail] elements (e.g. supplier rows).
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer'; });
  root.addEventListener('click', function(e){ var el=e.target.closest?e.target.closest('[data-detail]'):null; if(!el||!root.contains(el)) return; var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); });
}
// Ad-spend flow player.
function wireFlow(root){
  var flow=root.querySelector('#meFlow'); if(!flow) return;
  var idx=0, timer=null;
  var nodes=flow.querySelectorAll('.ov-flow-node'), stepEl=flow.querySelector('#meFlowStep'), capEl=flow.querySelector('#meFlowCap'),
      earnEl=flow.querySelector('#meFlowEarn'), dots=flow.querySelectorAll('.ov-flow-dot'), playBtn=flow.querySelector('#meFlowPlay');
  function apply(i){ idx=i; var s=FLOW_STEPS[i];
    nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node'))!==-1); });
    stepEl.textContent=s.t; capEl.innerHTML=s.cap;
    if(s.earn){ earnEl.hidden=false; earnEl.className='ov-flow-earn earn-'+(s.earnType||'pos'); earnEl.innerHTML=s.earn; } else { earnEl.hidden=true; }
    dots.forEach(function(d,di){ d.classList.toggle('on', di===i); }); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } playBtn.textContent='▶ Play'; }
  function play(){ if(timer){ stop(); return; } if(idx>=FLOW_STEPS.length-1) apply(0); playBtn.textContent='❚❚ Pause';
    timer=setInterval(function(){ if(idx>=FLOW_STEPS.length-1){ stop(); return; } apply(idx+1); }, 2600); }
  playBtn.onclick=play;
  flow.querySelector('#meFlowPrev').onclick=function(){ stop(); apply(Math.max(0, idx-1)); };
  flow.querySelector('#meFlowNext').onclick=function(){ stop(); apply(Math.min(FLOW_STEPS.length-1, idx+1)); };
  dots.forEach(function(d){ d.onclick=function(){ stop(); apply(parseInt(d.getAttribute('data-i'),10)); }; });
  nodes.forEach(function(n){ n.style.cursor='pointer'; n.onclick=function(){ stop();
    var k=n.getAttribute('data-node'); for(var i=0;i<FLOW_STEPS.length;i++){ if(FLOW_STEPS[i].on.indexOf(k)!==-1){ apply(i); break; } } }; });
  apply(0);
}
function init(c){
  var root=document.querySelector('#co-detailview')||document.querySelector('.ov-meta'); if(!root) return;
  // Overview: collapsibles
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var c2=btn.parentElement; var body=c2.querySelector('.ov-collap-b'); var open=c2.classList.toggle('open'); if(body) body.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  renderLive(root);
  wireScatter(root);
  META_PEERS.forEach(function(p){ if(p.tk!=='META') metaLiveOne(root, p.tk); });
  wireModal(root);
  wireFlow(root);
  // Deep Dive machinery
  wireDD(root);
  ['topline','bottomline','evolution','valuation','mgmt'].forEach(function(g){ wireSubtabs(root, g); });
  wireCallPrep(root);
  // AVE metric pills + Financials metric pills
  root.querySelectorAll('.ave-pill[data-ave]').forEach(function(b){ b.onclick=function(){ switchAveMetric(root, b.getAttribute('data-ave')); }; });
  root.querySelectorAll('.fin-pill').forEach(function(b){ b.onclick=function(){ switchFinMetric(root, b.getAttribute('data-finm')); }; });
  // Accordions (earnings themes/quarters etc.) — none open by default
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  // Earnings-calls By theme ⇄ By quarter toggle
  root.querySelectorAll('.calls-pill[data-callsv]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-callsv');
    root.querySelectorAll('.calls-pill[data-callsv]').forEach(function(x){ x.classList.toggle('active', x===b); });
    var th=root.querySelector('#meCallsTheme'), qu=root.querySelector('#meCallsQuarter'); if(th) th.style.display=(v==='theme'?'':'none'); if(qu) qu.style.display=(v==='quarter'?'':'none'); }; });
  root.querySelectorAll('.sc-pill').forEach(function(b){ b.onclick=function(){ switchScFilter(root, b.getAttribute('data-sccat')); }; });
  // Paint the initially-visible Deep Dive pane if it is already in the DOM (openCo renders DD after Overview).
  requestAnimationFrame(function(){ if(root.querySelector('.dd-pane')) buildDD(root, activeDD(root)); });
}
function deepDiveInit(c){
  var root=document.querySelector('#co-detailview')||document.querySelector('.ov-meta-dd'); if(!root) return;
  var g=activeDD(root); requestAnimationFrame(function(){ buildDD(root, g); });
}
export var metaOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
