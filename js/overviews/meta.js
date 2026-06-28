// overviews/meta.js — custom Overview for Meta Platforms, Inc. (NASDAQ: META)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model for META (snapshot 2026-05-22). We chart
// reported ACTUALS (FY2019–FY2025, actuals_history) plus the model's CONSOLIDATED
// 2026E–2027E projections (projection_history) for revenue, operating income,
// margin, capex and D&A — shown shaded. We deliberately EXCLUDE: segment-level
// (FoA/RL) projections and 2028+ (thin/unreliable in the model) and forward FCF
// (the model's interim quarters aren't formulated, so an FY FCF estimate isn't real).
// The "Spend Engine" decomposition (leases / cloud commitments) is an ANALYTICAL
// reconstruction by the Summit team from Meta 10-K/10-Q Note-8 commitments + vendor
// 8-Ks/press — it is NOT a clean company disclosure and lives outside the snapshots,
// so it is presented as estimated context (no per-line sourcing claimed).
// Qualitative content: Meta 10-Ks, Q4 2025 / Q1 2026 earnings calls, and a Summit
// "Ad Ecosystem" primer. Live data: price + market cap from Massive via the
// covered-calls-massive edge function (api.js → coveredCallsQuote), logged-in only.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting ──────────────────────────────────────────────────────────────
function money(m){ if(m==null) return '—'; var neg=m<0,a=Math.abs(m),s;
  if(a>=1000) s='$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; else s='$'+Math.round(a)+'M'; return (neg?'−':'')+s; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }

// ─── Brand: Meta blue + Reality Labs violet ──────────────────────────────────
var BRAND='#0866FF', BRAND2='#1877F2', FOA='#0866FF', AD='#0866FF', OTHER='#7AA9FF', RL='#8B5CF6', GRAY='#B8C0CA', NEG='#C0392B', GREEN='#16A34A', FC='#A8C7FF';

// ─── Annual ACTUALS, USD millions ────────────────────────────────────────────
var YEARS  = ['2019','2020','2021','2022','2023','2024','2025'];
var REV    = [70697, 85965, 117929, 116609, 134902, 164501, 200966];
var OPINC  = [23986, 32671, 46753, 28945, 46751, 69380, 83276];
var FCF    = [21212, 23584, 38993, 19044, 43847, 54072, 46109];
var CAPEX  = [15102, 15163, 18690, 31431, 27266, 37256, 69691];
var OPMARGIN = OPINC.map(function(v,i){ return v/REV[i]*100; });
// Depreciation & amortization, FY2021–2025 (the capex→D&A story).
var DA_YEARS = ['2021','2022','2023','2024','2025'];
var DA       = [7967, 8686, 11178, 15498, 18616];
// ── Summit DCF projections (snapshot 2026-05-22). The CONSOLIDATED 2026E–2027E
// lines are reliable; segment splits (FoA/RL) and 2028+ are NOT, so we only
// forecast company totals here. FCF projection is intentionally EXCLUDED — the
// model's interim quarters aren't formulated, so its FY FCF figure isn't a real
// estimate (we chart FCF actuals only).
var YEARS_F  = ['2026E','2027E'];
var REV_F    = [256182, 322461];
var OPINC_F  = [117085, 151691];
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
var SNAPSHOT=[
  ['Listing','NASDAQ: META'],['Founded','2004 — Cambridge, MA'],['IPO','May 2012 · $38.00'],
  ['CEO','Mark Zuckerberg (founder)'],['Segments','Family of Apps · Reality Labs'],['Control','Dual-class — founder voting control'],
];
var DESC='Meta is the world\'s largest social-advertising business. The <b>Family of Apps</b> — Facebook, Instagram, WhatsApp, Messenger and Threads (~3.5B daily people) — is the engine: a walled-garden advertising machine (Meta owns every layer of the ad stack, so it keeps essentially the whole ad dollar) running at a <b>~50%+ segment operating margin</b>. The <b>consolidated</b> company runs <b>~41%</b> — the gap is Reality Labs, the AR/VR + AI-hardware bet that loses ~$19B a year and which the FoA cash funds. Management guides Reality Labs losses to <b>peak in 2026</b>, then gradually narrow. The whole story is: how much of the FoA cash gets re-invested into AI capex, and whether it pays off.';
var KPIS=[
  { l:'Revenue',          v:'$201B', d:pctStr((REV[6]/REV[5]-1)*100)+' YoY',  dir:'up' },
  { l:'Operating Income', v:'$83.3B',d:'~41% op margin',                       dir:'up' },
  { l:'Free Cash Flow',   v:'$46.1B',d:'after record capex',                   dir:'up' },
  { l:'Capex',            v:'$69.7B',d:pctStr((CAPEX[6]/CAPEX[5]-1)*100)+' YoY · AI build', dir:'down' },
];
var AS_OF='Headline KPIs are FY2025 (reported). Revenue $201.0B (+22%), operating income $83.3B (~41% margin), free cash flow $46.1B, and a record $69.7B of capex (+87% YoY). ~3.5B daily active people across the Family of Apps; advertising is ~98% of revenue.';
var FY_NOTE='Two engines, one company. <b>Family of Apps</b> generated ~$199B of revenue and ~$102B of segment operating profit in FY2025 — that profit <b>funds Reality Labs</b>, which lost ~$19B (~$79B cumulative since 2020). Charts show reported actuals (FY2019–FY2025) plus the <b>Summit DCF\'s 2026E–2027E estimates</b> for company totals (shaded). Segment-level splits and 2028+ are charted as actuals only — the model\'s projection is reliable for consolidated totals but thin at the segment level and in the far out-years.';

// ── How Meta makes money: the ad auction (clickable chain) ──
var AD_FLOW=[
  { t:'A user opens Facebook / Instagram / Threads', d:'~3.5B daily people generate billions of ad impressions. Each impression is an <b>auction</b> held in real time — Meta\'s inventory is its attention.',
    detail:'Every time a feed, Story or Reel loads, Meta has milliseconds to decide which ad (if any) to show in each ad slot. The <b>supply</b> side is engagement: more daily users × more time-spent × more sessions = more impressions to auction. That is why the engagement work (Reels, AI-recommended content, Threads) feeds the ad business directly — it manufactures more auction inventory. Meta reports the two levers separately: <b>ad impressions delivered</b> (+18% YoY in Q4 2025) and <b>average price per ad</b> (+6%).' },
  { t:'Advertisers bid for the impression', d:'Advertisers set a budget and a goal (a click, install, purchase). Meta runs an <b>auction</b>, not a fixed price — so pricing rises with demand and ad quality.',
    detail:'Advertisers don\'t buy a fixed slot at a list price — they enter a continuous auction and state an <b>objective</b> (link clicks, app installs, purchases, leads) and a budget. Meta uses a <b>second-price-style</b> auction: you don\'t pay your full bid, you pay just enough to beat the next-best ad. Because the ranking also weights predicted relevance (next step), a <i>more relevant</i> ad can win while bidding <i>less</i> — which is what lets Meta raise price-per-ad and advertiser ROI at the same time.' },
  { t:'AI ranks the auction', d:'The winner ≈ <b>bid × estimated action rate × ad quality</b>. Meta\'s AI predicts who will convert — this is where AI turns directly into revenue.',
    detail:'The ranking score ≈ <b>bid × estimated action rate × ad quality</b>. The hard part is the middle term — predicting the probability <i>this</i> user takes <i>this</i> action — and that is what Meta\'s ad-ranking AI does. The current generation is <b>GEM (Generative Ads recommendation Model)</b>, a single large transformer-based model that replaced many smaller per-surface models (see the GEM explainer on this tab). Better predictions raised measured outcomes: <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025). Every accuracy gain is monetized immediately as higher conversion and higher winning bids.' },
  { t:'The ad is shown; advertiser pays per result', d:'Meta keeps essentially <b>all</b> of the ad revenue (it owns every layer of the ad stack — see the walled garden). Advertising is ~<b>98%</b> of total revenue.',
    detail:'In the open programmatic web a chain of middlemen (DSP, exchange, SSP, data vendors) skims ~45¢ of every advertiser dollar before it reaches the publisher. Meta is a <b>walled garden</b>: it is the publisher, the buy-side, the sell-side, the exchange and the data layer all at once, so essentially the <b>entire dollar</b> stays inside Meta — no leakage to intermediaries. That is why ~98% of revenue is advertising and why the margin structure is so different from open-web players. See "the walled garden" section for the full $1.00 breakdown.' },
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
var WALLED='In the <b>open web</b>, an advertiser\'s dollar passes through a chain of middlemen before it reaches the website showing the ad: a <b>DSP</b> (Demand-Side Platform — the software advertisers use to buy ad space, ~5–20%), an <b>ad exchange</b> (the marketplace that runs the auction), an <b>SSP</b> (Supply-Side Platform — the software publishers use to sell their ad space, ~10–25%), plus data &amp; verification vendors. After all those cuts, only ~<b>$0.55</b> of each $1.00 reaches the publisher. <b>Meta is a "walled garden": it IS every layer at once</b> — the publisher (FB/IG), the SSP, the DSP, the ad exchange, and the data &amp; verification platform, all in one closed loop. So Meta <b>keeps essentially the entire ad dollar</b> (no leakage to intermediaries), owns the user data end-to-end, and controls the whole auction. That full vertical integration is a structural margin <i>and</i> moat advantage that rivals dependent on third-party DSPs/SSPs can\'t match.';
var FOA_WINS=[
  '<b>AI ranking turns straight into revenue:</b> the new <b>GEM</b> ad model drove <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025); ad <b>impressions +18% YoY</b> with <b>price-per-ad +6%</b>.',
  '<b>AI recommendations lift time-spent:</b> AI-recommended (unconnected) content is now <b>40%+ of the Facebook feed</b>, and Facebook surfaces ~25% more same-day Reels — the same ranking AI that powers ads keeps users on-app longer, compounding impressions.',
  '<b>Reels monetization caught up to feed</b> — once a drag (lower-monetizing short video cannibalizing feed), Reels now monetizes at roughly feed levels while driving big time-spent gains.',
  '<b>Threads is ramping:</b> time-spent <b>+20% YoY</b> (Q4 2025) with ad monetization scaling — a near-zero-CAC surface built off the Instagram graph.',
  '<b>Business messaging:</b> click-to-WhatsApp / Instagram ads are among the fastest-growing ad products — turning messaging into the next monetization surface.',
];
// ── GEM explainer (what it is / how it works / what changed) ──
var GEM_WHAT='<b>GEM = Generative Ads recommendation Model.</b> It is the large AI model that decides, for each ad auction, how likely <i>you</i> are to act on <i>this</i> ad — the prediction that drives both the ranking and the price.';
var GEM_POINTS=[
  '<b>What it replaced:</b> for years Meta ran <b>many smaller, specialized models</b> — a different ranker per surface (Feed, Reels, Stories) and per objective (click, install, purchase). They were hard to improve in lockstep and couldn\'t share what they learned.',
  '<b>How it works:</b> GEM is a <b>single, much larger transformer-based model</b> (the same family of architecture behind LLMs), trained on far more data and signals at once. One big model generalizes across surfaces and objectives, so a pattern learned on Instagram conversions also sharpens Facebook click prediction. Meta scaled the training compute massively (a chunk of the AI capex) specifically to make this model bigger and more accurate.',
  '<b>What changes for the ad:</b> better conversion prediction means the auction shows each user a more relevant ad, which lifts measured results — <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025) — and lets Meta raise price-per-ad <i>and</i> advertiser ROI simultaneously. It also underpins <b>Advantage+</b>, where the advertiser just gives a goal + budget + creative and the AI does the targeting, bidding and optimization.',
];

// ── Reality Labs ──
var RL_WHAT='<b>What the segment actually is.</b> Reality Labs (RL) is Meta\'s <b>hardware + software bet on the next computing platform</b> — the businesses Meta hopes will, one day, reduce its dependence on phones (where Apple and Google control the rules). It is reported separately from advertising so investors can see its cost. It is <b>~1% of revenue and ~−$19B of operating profit</b>: a venture bet sitting inside a mega-cap, not a business that pays its own way yet. It traces back to the <b>2014 Oculus acquisition (~$2B)</b> and became a <b>separate reported segment with the Oct-2021 rebrand to "Meta"</b> — which is when its multi-billion-dollar losses became visible for the first time.';
var RL_PRODUCTS=[
  '<b>Meta Quest (VR/MR headsets):</b> the core hardware line (Quest 3 / 3S). Meta sells the headset <b>direct</b> and books the <b>full device price</b> as RL revenue, plus a cut of <b>Quest Store</b> app/game sales. Historically sold near or below cost to grow the install base.',
  '<b>Ray-Ban &amp; Oakley Meta smart glasses:</b> the breakout product — camera/audio/AI glasses built with <b>EssilorLuxottica</b>. <b>&gt;7M units sold in 2025</b>. Key accounting nuance: EssilorLuxottica is the <b>seller of record</b> and books the retail sale in its own Wearables division, so Meta recognizes only its <b>shared/partial economics, not the full retail price</b> — glasses can sell huge units while adding comparatively little reported RL revenue.',
  '<b>Horizon &amp; software platform:</b> Horizon Worlds (social VR) and the developer platform — a small "platform/proxy" revenue line today, strategically the bet on an owned social+OS layer.',
  '<b>Orion / AR (R&D, pre-revenue):</b> full augmented-reality glasses — still a <b>prototype</b>, not a product; the long-dated "personal superintelligence" ambition that absorbs much of the R&D loss.',
];
var RL_NOTE='Reality Labs is the long bet — and it is run at a deliberate, large loss. Two things matter for modelling it:';
var RL_POINTS=[
  '<b>Revenue mix &amp; recognition:</b> RL revenue ≈ a platform/"proxy" line + <b>Meta Quest</b> (Meta sells the headset directly and books the <b>full device price</b>) + <b>smart glasses</b> (Ray-Ban / Oakley Meta). Crucially, <b>EssilorLuxottica manufactures and is the device seller of record</b> for the glasses — it books the retail sales in its own Wearables division — so Meta recognizes only its <b>shared / partial economics, not the full retail price</b> (the exact split is undisclosed). So glasses can sell huge units while adding comparatively little reported RL revenue — versus Quest, which is full-device revenue.',
  '<b>The breakout is glasses, not VR:</b> Ray-Ban / Oakley Meta sold <b>&gt;7M units in 2025</b>; management is pivoting investment <b>toward wearables and away from VR/Horizon</b> (~1,500 RL roles cut), pitching glasses as the next platform for "personal superintelligence." Orion (full AR) is still a prototype.',
  '<b>Losses peak in 2026:</b> RL lost ~<b>$19B in 2025</b> (~$79B cumulative). Zuckerberg (Q4 2025 call): <b>2026</b> losses will be "<i>similar to last year, and this will likely be the peak as we start to gradually reduce our losses going forward.</i>" So 2026 — the year we are in — is the high-water mark, not the past. Still red, but the inflection the FoA cash machine is built to absorb.',
];

// ── The Spend Engine (the "devil's accounting") ──
// RL product details for modal pop-ups (resolved by wireModal as kind 'rl').
var RL_DETAIL = [
  { t:'Meta Quest \u2014 VR/MR headsets', h:'<b>The core hardware line</b> (Quest 3 / 3S). Meta sells the headset <b>direct</b> and books the <b>full device price</b> as RL revenue, plus a cut of Quest Store app/game sales. Historically sold near or below cost to grow the install base.<br><br><b>Revenue recognition:</b> full device revenue \u2192 Reality Labs segment. This is the cleanest RL revenue line.' },
  { t:'Ray-Ban & Oakley Meta \u2014 smart glasses', h:'<b>The breakout product</b> \u2014 camera/audio/AI glasses built with <b>EssilorLuxottica</b>. <b>>7M units sold in 2025</b>.<br><br><b>Key accounting nuance:</b> EssilorLuxottica is the <b>seller of record</b> and books the retail sale, so Meta recognizes only its <b>shared/partial economics, not the full retail price</b>. Glasses can sell huge units while adding comparatively little reported RL revenue.<br><br><b>Why it matters:</b> unit sales are a better signal of traction than RL revenue for this product.' },
  { t:'Horizon & Software Platform', h:'<b>Horizon Worlds</b> (social VR) and the developer platform. A small \u201cplatform/proxy\u201d revenue line today.<br><br><b>Strategic bet:</b> an owned social + OS layer that doesn\u2019t depend on Apple or Google. Management pivoting Horizon toward <b>mobile</b> (not just VR). AI-generated interactive content is the unlock.<br><br><b>Financial reality:</b> small revenue, large cost. Strategic, not financial, at this stage.' },
  { t:'Orion AR \u2014 full augmented reality', h:'<b>Full holographic AR glasses</b> \u2014 still a <b>prototype</b>, not a product. Absorbs a large share of RL\u2019s R&D loss.<br><br><b>Timeline:</b> years away from consumer product. The near-term bet is the Ray-Ban/Oakley line; Orion is the long-term option value.' },
];
var RL_READ_DETAIL = [
  { t:'Revenue recognition \u2014 why RL revenue understates traction', h:'RL revenue \u2248 platform/\u201cproxy\u201d line + <b>Quest</b> (full device price) + <b>smart glasses</b> (partial economics only).<br><br><b>EssilorLuxottica is the seller of record</b> for the glasses \u2014 it books the retail sale. Meta recognizes only its shared economics. So glasses can sell huge units while adding comparatively little RL revenue.<br><br><b>Implication:</b> don\u2019t read RL revenue as a proxy for glasses traction \u2014 it structurally understates the story.' },
  { t:'The breakout is glasses, not VR', h:'Ray-Ban / Oakley Meta sold <b>>7M units in 2025</b>. Management is pivoting investment <b>toward wearables and away from VR/Horizon</b> (~1,500 RL roles cut).<br><br>Zuckerberg\u2019s thesis: "glasses are the ideal form factor for AI \u2014 you can let your AI see what you see, hear what you hear." The pivot is from holographic metaverse (years away) to AI glasses (shipping now).' },
  { t:'Losses peak in 2026 \u2014 the inflection', h:'RL lost ~<b>$19B in 2025</b> (~$79B cumulative). Zuckerberg (Q4 2025 call): 2026 losses will be \u201c<i>similar to last year, and this will likely be the peak.</i>\u201d<br><br>2026 is the high-water mark. Losses are still enormous, but the direction changes. The FoA cash machine (~$102B segment OpInc) is built to absorb this.' },
];

var SPEND_LEDE='Meta\'s reported capex is enormous — but it is only part of the AI build. A lot of the spend lands in the P&L as <b>lease and cloud-commitment expense</b> rather than as capex, so the <b>true investment intensity</b> is hard to read off the headline number. To make it legible, the Summit team <b>reconstructed</b> the spend from Meta\'s 10-K/10-Q Note-8 commitment disclosures plus vendor 8-Ks and press. What follows is that <b>estimate</b> — not a clean company disclosure and not a live time series (it never will be), but enough to give a real notion of how the buildout is funded, in <b>three ways</b>:';
var SPEND_WAYS=[
  { k:'owned', t:'1 · Owned capex → depreciation',
    teaser:'Servers &amp; data centers Meta buys outright. Hits the P&L slowly, as <b>D&A</b>.',
    detail:'<b>What it is:</b> the servers, networking gear and data-center shells Meta <b>buys outright</b>.<br><br><b>How it hits the P&L:</b> capitalized as PP&E and expensed <b>gradually as depreciation &amp; amortization (D&A)</b> over the asset life — it does <i>not</i> hit earnings the year it is spent.<br><br><b>Why it matters:</b> D&A has exploded ($8B in 2021 → ~$18.6B in 2025 → ~$29.6B 2026E → ~$44B 2027E). This is the "clean," visible part — but the depreciation wave it builds pressures margins for years <i>after</i> the cash goes out.' },
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
var SOURCES='Quantitative series: Summit DCF model for META (snapshot 2026-05-22) — reported actuals FY2019–FY2025 plus the model\'s 2026E–2027E projections for company totals (revenue, operating income, margin, capex, D&A), shown shaded. Segment splits (FoA/RL) and 2028+ are charted as actuals only, and forward FCF is excluded — those parts of the model are not reliable enough to chart. Family DAP (~3.5B) and ARPP are company disclosures (not carried in this snapshot). The Spend Engine decomposition (leases, third-party cloud commitments by vendor) is a Summit analytical reconstruction from Meta 10-K/10-Q Note-8 commitment disclosures + vendor 8-Ks and press — estimates, shown for understanding and not sourced into the charts. Other qualitative content: Meta 10-Ks and Q4 2025 / Q1 2026 earnings calls, and a Summit "Ad Ecosystem" primer. Brand colors approximate Meta blue.';

// ── Ad-spend flow ("follow $1.00") — interactive diagram of who skims the dollar
//    in the open web vs Meta's walled garden. Open-web split is illustrative.
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
    cap:'The <b>SSP (Supply-Side Platform)</b> — the software publishers use to sell their ad space — takes ~<b>$0.20</b>, plus small data &amp; verification fees.' },
  { t:'4 · Publisher keeps the rest', on:['ssp','pub'], earnType:'pos', earn:'only $0.55 → publisher',
    cap:'After every middleman, the <b>publisher</b> actually showing the ad keeps only ~<b>$0.55</b> of the original $1.00. ~45¢ leaked to intermediaries.' },
  { t:'5 · Meta — the walled garden', on:['adv','dsp','exch','ssp','pub'], earnType:'pos', earn:'≈ $1.00 stays inside Meta',
    cap:'<b>Meta is all of these layers at once</b> — it is the DSP, the exchange, the SSP, the data platform <i>and</i> the publisher (Facebook / Instagram). No middlemen to pay, so Meta keeps <b>~the entire $1.00</b>. Owning the whole stack end-to-end is the walled-garden margin <i>and</i> data moat.' },
];
var FLOW_NOTE='The open-web split is illustrative (typical "ad-tech tax" ranges); Meta figures reflect its closed-loop ownership of the full ad stack. The point is structural, not penny-precise.';

// ── Model vs Reality (back-test): Summit DCF quarterly ESTIMATE vs reported ACTUAL.
//    Source: snapshot 2026-05-22 — projection_history (est) vs actuals_history (act).
//    Revenue and Operating income are the cleanly-populated quarterly series.
var Q13   = ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var REV_E = [28313,31023,34353,39659,35041,38455,41083,47346,42957,45970,50766,59296,52879];
var REV_A = [28645,31999,34146,40111,36455,39071,40589,48385,42314,47516,51242,59893,56311];
var OPI_E = [6799, 8300, 11827,14235,13578,15406,15774,19870,17394,18372,20904,24420,24990];
var OPI_A = [7227, 9392, 13748,16384,13818,14847,17350,23365,17555,20441,20535,24745,22872];
// Advertising revenue (~98% of total) — quarterly est vs act, populated from 1Q24.
var Q9    = ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var ADV_E = [34283,37798,40372,45673,42049,45228,49856,57543,51549];
var ADV_A = [35635,38329,39885,46783,41392,46563,50082,58137,55024];
// Operating margin (%) — DERIVED from the revenue & operating-income series.
var OPM_E = OPI_E.map(function(v,i){ return v/REV_E[i]*100; });
var OPM_A = OPI_A.map(function(v,i){ return v/REV_A[i]*100; });
var AVE={
  rev:    { label:'Revenue',            fmt:'usd', quarters:Q13, est:REV_E, act:REV_A, note:'Total revenue. The model tracked tightly through 2025; advertising re-accelerated into 1Q26, so the actual came in ahead of estimate.' },
  adv:    { label:'Advertising revenue', fmt:'usd', quarters:Q9, est:ADV_E, act:ADV_A, note:'Advertising revenue (~98% of the total). Tracked closely; 1Q26 came in well ahead as AI-driven ad pricing and impressions accelerated.' },
  opinc:  { label:'Operating income',   fmt:'usd', quarters:Q13, est:OPI_E, act:OPI_A, note:'GAAP operating income. Meta consistently out-earned the model through 2024–25; 1Q26 came in below estimate as the AI-capex ramp lifted the expense base.' },
  opmargin:{ label:'Operating margin',  fmt:'pct', quarters:Q13, est:OPM_E, act:OPM_A, note:'Consolidated operating margin (operating income ÷ revenue). The telling quarter is 1Q26: revenue BEAT but margin MISSED ~7pp — the AI-capex/expense ramp lifted the cost base faster than the model assumed, so a revenue beat still meant a margin (and operating-income) miss.' },
};
var _aveMetric='rev', AVE_GREEN='#16A34A', AVE_RED='#C0392B';


// ─── Supply Chain tab data (Bloomberg SPLC, as of 26-Jun-2026) ──────────────
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
var SC_NOTE='Source: Bloomberg Supply Chain Analysis (SPLC) for META US Equity, as of 26-Jun-2026. Total Relationship Size is Bloomberg\u2019s estimate of the dollar value of the commercial relationship. Cost Category indicates where the spend lands in Meta\u2019s financials. Supplier\u2019s Source Revenue % indicates the supplier\u2019s revenue dependency on Meta. Point-in-time snapshot, not a live feed.';

// ─── Earnings Calls tab — management narrative tracker ──────────────────────
var CALLS = [
  { q:'Q1 2026', date:'Apr 29, 2026', chg:-8.6,
    hl:[
      'CapEx raised AGAIN to $125\u2013145B \u2014 "higher component costs, particularly <b>memory pricing</b>."',
      'Muse Spark released (MSL\u2019s first model). "Fastest lab from standing up to widely accepted strong model."',
      'Narrative: assistant \u2192 <b>agent</b>. "Agents that understand your goals and work day and night to help you achieve them." Business AIs: 10M weekly conversations (from 1M at year start).',
    ]},
  { q:'Q4 2025', date:'Jan 28, 2026', chg:+10.4,
    hl:[
      '"RL losses will <b>peak in 2026</b>, then gradually reduce" \u2014 first concrete inflection guidance on Reality Labs.',
      'CapEx guided $115\u2013135B; expenses $162\u2013169B \u2014 but: "operating income above 2025." Spending through it, not at the expense of profit.',
      '"Personal superintelligence" \u2014 AI that understands your goals and tailors feeds + agents to help you achieve them.',
    ]},
  { q:'Q3 2025', date:'Oct 29, 2025', chg:-11.3,
    hl:[
      '"Front-load for the <b>most optimistic</b> superintelligence cases" \u2014 capex philosophy crystallized. If slower, "extra compute accelerates core business profitably."',
      'Instagram 3B MAU; Threads 150M DAP; Reels ARR >$50B \u2014 core business strength IS the funding mechanism.',
      'Display glasses sold out in 48 hours \u2014 "clearly leading." RL investment pivoting toward wearables, away from VR.',
    ]},
  { q:'Q2 2025', date:'Jul 30, 2025', chg:+11.2,
    hl:[
      '<b>Meta Superintelligence Labs (MSL)</b> founded \u2014 Wang, Friedman, Shengjia Zhao. "Highest talent-density lab in the industry."',
      '"Superintelligence is now <b>in sight</b>" \u2014 most aggressive timeline statement. Self-improvement: "slow for now, but undeniable."',
      'Infrastructure named: Prometheus (1GW+), Hyperion (5GW), multiple Titan clusters.',
    ]},
  { q:'Q1 2025', date:'Apr 30, 2025', chg:+4.2,
    hl:[
      'Five opportunities framework: improved ads, engaging experiences, business messaging, Meta AI, AI devices. "Don\u2019t need to succeed in ALL five to have good ROI."',
      'CapEx raised to $64\u201372B; 2026 will see "similarly significant dollar growth." GEM ads model: 2\u00d7 more efficient per unit of compute.',
      '~1B Meta AI MAU; standalone app launched \u2014 but re-set expectations: "at least the next year" focused on scaling, not monetizing.',
    ]},
  { q:'Q4 2024', date:'Jan 29, 2025', chg:+1.6,
    hl:[
      '"<b>48 weeks</b> to get on the trajectory we want in AI" \u2014 urgency framing. AI coding agent: "potentially one of the most important innovations in history."',
      'CapEx guided $60\u201365B for 2025 \u2014 nearly doubled. "Hundreds of billions over the long term."',
      'DeepSeek response: "more compute at inference means we can provide <b>higher quality of service</b> than those without the business model to sustain it."',
    ]},
  { q:'Q3 2024', date:'Oct 30, 2024', chg:-4.1,
    hl:[
      'Llama 4 training on a <b>100K+ H100</b> cluster \u2014 "bigger than anything I\u2019ve seen reported for what others are doing."',
      'Ray-Ban Meta clear edition sold out, reselling at >$1,000 \u2014 <b>glasses category validated</b> as real consumer electronics.',
      'Budget planning: "a lot of new opportunities to accelerate the core business with strong ROI \u2014 I think we should invest more."',
    ]},
  { q:'Q2 2024', date:'Jul 31, 2024', chg:+4.8,
    hl:[
      'Llama 3.1 released \u2014 "first frontier-level open source model; an <b>inflection point</b> where open source becomes the industry standard."',
      'Long-term ad vision: "advertisers will just tell us an objective and a budget, and <b>we\u2019ll do the rest</b>."',
      '"Significant CapEx growth in 2025" \u2014 first forward signal, preparing the market one quarter early.',
    ]},
  { q:'Q1 2024', date:'Apr 24, 2024', chg:-10.6,
    hl:[
      'Explicit investor warning: "<b>multi-year investment cycle</b> before Meta AI is profitable \u2014 expect stock volatility." Market sold off hard.',
      'CapEx raised to $35\u201340B (from $30\u201337B) \u2014 the opening move of the infrastructure ramp.',
      '"Meta AI with Llama 3 is the most intelligent AI assistant you can freely use" \u2014 quality claim staked; playbook: scale first, monetize later.',
    ]},
  { q:'Q4 2023', date:'Feb 1, 2024', chg:+20.3,
    hl:[
      'Year of Efficiency declared successful \u2014 leaner company as a <b>permanent operating philosophy</b>, not a one-off cost cut.',
      'Full general intelligence is now the stated product goal \u2014 "need reasoning, planning, coding, memory." FAIR moved closer to Gen AI team.',
      'First-ever dividend declared ($0.50/share quarterly) + $50B buyback auth \u2014 signaled the business can fund AI AND return cash.',
    ]},
];
var CALLS_NOTE='Highlights extracted from Meta Platforms earnings call transcripts. Written from the perspective of what was said AT THE TIME, not with hindsight. Stock-price changes are approximate next-trading-day moves. Source: Meta investor relations.';



// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(t,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(t)+'</div>'+inner+'</section>'; }
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
function bullets(a){ return '<ul class="ov-bullets">'+a.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function chain(arr, key){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(key?' ov-clickable':'');
  var attr=key?' data-detail="'+key+':'+i+'"':''; var more=key?' <span class="ov-tl-more">tap ›</span>':'';
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }

// ─── Pane: Overview ───────────────────────────────────────────────────────────

// ─── Pane: Supply Chain (Bloomberg SPLC) ─────────────────────────────────────
function scMoney(v){ if(v>=1000) return '$'+(v/1000).toFixed(1)+'B'; return '$'+Math.round(v)+'M'; }

// Build the supplier bars + detail rows for a given category filter.
function scRenderSuppliers(){
  var cat=_scFilter;
  var list=SC_SUPPLIERS.filter(function(s){ return cat==='ALL'||s.cat===cat; });
  var maxRel=list.length?list[0].rel:1;
  // Summary line
  var totalRel=0; list.forEach(function(s){ totalRel+=s.rel; });
  var sumEl=document.getElementById('scSum');
  if(sumEl){
    var label=cat==='ALL'?'All categories':(cat==='CAPEX'?'CAPEX \u2014 capitalized, hits P&L as D&A over asset life':(cat==='COGS'?'COGS \u2014 hits the P&L immediately':'SGA \u2014 selling, general & administrative'));
    sumEl.innerHTML='<b>'+list.length+' suppliers</b> \u00b7 '+scMoney(totalRel)+' total relationship \u00b7 <span class="ave-subh-note">'+label+'</span>';
  }
  // Bars + rows
  var box=document.getElementById('scBars'); if(!box) return;
  var h='';
  list.forEach(function(s){
    var w=Math.max(2, s.rel/maxRel*100);
    var dep=s.supRev>=15;
    var barColor=s.cat==='CAPEX'?BRAND:(s.cat==='COGS'?'#C0392B':'#8A93A0');
    h+='<div class="sc-row">';
    h+='<div class="sc-row-name">'+esc(s.n)+'<span class="sc-row-ind">'+esc(s.ind)+'</span></div>';
    h+='<div class="sc-row-bar"><div class="sc-row-fill" style="width:'+w.toFixed(1)+'%;background:'+barColor+'"></div></div>';
    h+='<div class="sc-row-val">'+scMoney(s.rel)+'</div>';
    h+='<div class="sc-row-meta"><span class="ov-chip'+(s.cat==='COGS'?' ov-chip-neg':'')+'">'+s.cat+'</span>';
    h+='<span class="sc-row-pct">'+s.costPct.toFixed(1)+'% of cost</span>';
    h+='<span class="sc-row-dep'+(dep?' sc-dep-warn':'')+'">'+s.supRev.toFixed(1)+'% dep'+(dep?' \u26a0':'')+'</span>';
    h+='</div></div>';
  });
  box.innerHTML=h;
}

function switchScFilter(root,cat){
  _scFilter=cat;
  root.querySelectorAll('.sc-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-sccat')===cat); });
  scRenderSuppliers();
}

// ─── Pane: Earnings Calls — management narrative tracker ─────────────────────
function callsBody(){
  var h='';
  h+='<p class="ov-lede">How management\u2019s narrative has evolved, call by call. Each entry shows the <b>2\u20133 most important qualitative takeaways</b> \u2014 the \u201cwhy,\u201d not the numbers \u2014 written from what was known <b>at the time</b>, not with hindsight. The badge shows the next-day stock reaction (close-to-close).</p>';
  h+='<div class="lpb-acc" id="meCallsAcc">';
  CALLS.forEach(function(c,i){
    var up=c.chg>=0;
    var badge='<span style="display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;margin-left:10px;'+(up?'background:#ECFDF5;color:#16A34A':'background:#FEF2F2;color:#C0392B')+'">'+(up?'\u25b2 +':'\u25bc ')+Math.abs(c.chg)+'%</span>';
    h+='<div class="lpb-acc-item'+(i===0?' open':'')+'">'+
      '<button type="button" class="lpb-acc-h"><span><b>'+esc(c.q)+'</b> \u00b7 '+esc(c.date)+badge+'</span><span class="lpb-acc-ic">'+(i===0?'\u2013':'+')+'</span></button>'+
      '<div class="lpb-acc-body"><ul class="ov-bullets">'+c.hl.map(function(h){return '<li>'+h+'</li>';}).join('')+'</ul></div>'+
    '</div>';
  });
  h+='</div>';
  h+='<div class="ov-foot">'+CALLS_NOTE+'</div>';
  return h;
}

function supplyBody(){
  var h='';
  h+='<style>'+
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
  h+='<p class="ov-lede">Who receives Meta\u2019s dollars \u2014 and who depends on Meta for theirs. The supplier side shows <b>where the AI-capex buildout actually lands</b>; the customer side shows the <b>structural absence of concentration</b> that defines the walled garden. Data: Bloomberg Supply Chain Analysis (SPLC), 26-Jun-2026.</p>';

  // ── Top suppliers with category filter ──
  h+=sec('Top suppliers by relationship size',
    '<p class="ov-lede" style="margin:0 0 12px">Bloomberg\u2019s estimate of the dollar value of each supplier relationship. Filter by cost category to see what\u2019s capitalized infrastructure (CAPEX) vs what hits the income statement now (COGS).</p>'+
    '<div class="ave-pills" id="scPills">'+
      '<button type="button" class="ave-pill sc-pill active" data-sccat="ALL">All</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="CAPEX">CAPEX</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="COGS">COGS</button>'+
      '<button type="button" class="ave-pill sc-pill" data-sccat="SGA">SGA</button>'+
    '</div>'+
    '<div class="sc-sum" id="scSum"></div>'+
    '<div class="sc-bars" id="scBars"></div>'+
    '<div class="ov-fynote">\u26a0 = supplier derives >15% of revenue from Meta \u2014 concentration risk for the supplier (and a negotiating lever for Meta). <b>NVIDIA</b> is the largest relationship (~$11.2B, 13% of Meta\u2019s cost) but Meta is only ~4% of NVIDIA\u2019s revenue. <b>GoerTek</b> (Quest assembly) and <b>TaskUS</b> (content moderation) are the most Meta-dependent (~26% each). CAPEX items depreciate over years; COGS items hit the P&L immediately.</div>');

  // ── Where the spend lands (aggregate) ──
  var capexS=0,cogsS=0,sgaS=0;
  SC_SUPPLIERS.forEach(function(s){ if(s.cat==='CAPEX') capexS+=s.rel; else if(s.cat==='COGS') cogsS+=s.rel; else sgaS+=s.rel; });
  var totalS=capexS+cogsS+sgaS;
  h+=sec('Where the supplier spend lands',
    '<p class="ov-lede" style="margin:0 0 12px">Of the top-19 supplier relationships (~'+scMoney(totalS)+' total), the split by cost category shows what is capitalized infrastructure vs what hits the income statement immediately:</p>'+
    mbars([
      ['CAPEX (capitalized \u2192 D&A)', Math.round(capexS/totalS*100), scMoney(capexS)+' ('+Math.round(capexS/totalS*100)+'%)', BRAND],
      ['COGS (P&L immediate)', Math.round(cogsS/totalS*100), scMoney(cogsS)+' ('+Math.round(cogsS/totalS*100)+'%)', '#C0392B'],
      ['SGA', Math.max(1,Math.round(sgaS/totalS*100)), scMoney(sgaS)+' ('+Math.round(sgaS/totalS*100)+'%)', GRAY],
    ])+
    '<div class="ov-fynote">This ties directly to the <b>Spend Engine</b>: the CAPEX bucket (NVIDIA, SK hynix, Broadcom, Celestica, AMD) is the AI-infrastructure build that depreciates over years. The COGS bucket (GoerTek, Accton, CoreWeave, Qualcomm) hits the P&L now. The reason the \u201ctrue investment intensity\u201d is hard to read: COGS suppliers are invisible in the capex headline but sit straight in the cost base.</div>');

  // ── Geographic concentration ──
  h+=sec('Supplier geographic concentration',
    '<p class="ov-lede" style="margin:0 0 12px">'+SC_GEO_TOTAL.suppliers+' suppliers across '+SC_GEO_TOTAL.facilities+' facilities. Top countries by suppliers domiciled:</p>'+
    mbars(SC_GEO.map(function(g){ return [g.c, Math.round(g.pct), g.n+' suppliers ('+g.pct+'%)', g.c==='United States'?BRAND:(g.c==='China'?'#C0392B':(g.c==='Taiwan'||g.c==='South Korea'?RL:GRAY))]; }))+
    '<div class="ov-fynote">The silicon supply chain runs through Asia: <b>China</b> (12.4%), <b>South Korea</b> (6.7% \u2014 SK hynix), <b>Taiwan</b> (5.3% \u2014 TSMC fabrication). A US\u2013China decoupling or Taiwan disruption would stress the AI buildout directly. MTIA custom silicon and the Broadcom partnership are partial hedges, but NVIDIA (fabbed by TSMC) remains the #1 relationship.</div>');

  // ── Customer concentration ──
  h+=sec('Customer concentration \u2014 there is none',
    '<p class="ov-lede" style="margin:0 0 12px">'+SC_CUST_GEO.total+' customer relationships across '+SC_CUST_GEO.facilities+' facilities. The largest is <b>$41M</b> \u2014 that is <b>0.02%</b> of Meta\u2019s revenue.</p>'+
    '<div style="overflow-x:auto"><table class="ov-table"><thead><tr>'+
    '<th>Customer</th><th style="text-align:right">Relationship ($M)</th>'+
    '<th style="text-align:right">% of META revenue</th></tr></thead><tbody>'+
    SC_CUST_TOP.map(function(c){
      return '<tr><td class="ov-td-name">'+esc(c.n)+'</td>'+
        '<td style="text-align:right;font-variant-numeric:tabular-nums">'+scMoney(c.rel)+'</td>'+
        '<td style="text-align:right;font-variant-numeric:tabular-nums">'+c.revPct+'%</td></tr>';
    }).join('')+
    '<tr><td class="ov-td-name" style="color:var(--mu)">\u2026 239 more</td><td style="text-align:right;color:var(--mu)">all < $2.5M</td><td style="text-align:right;color:var(--mu)">all < 0.01%</td></tr>'+
    '</tbody></table></div>'+
    '<div class="ov-callout"><ul class="ov-bullets">'+
    '<li><b>This IS the walled garden in data form.</b> ~10M+ advertisers; no single customer is remotely material. Compare to enterprise software where a top-5 customer might be 10\u201320% of revenue.</li>'+
    '<li><b>Negotiating implication:</b> Meta sets the auction rules and the take rate. No advertiser has leverage to demand a discount \u2014 the ad auction IS the pricing power.</li>'+
    '<li><b>The asymmetry:</b> NVIDIA alone is ~$11.2B (13% of Meta\u2019s cost base). The supplier side has real concentration; the customer side has none \u2014 the reverse of most businesses.</li>'+
    '</ul></div>');

  h+='<div class="ov-foot">'+SC_NOTE+'</div>';
  return h;
}

function overviewBody(){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="meLive" hidden></div>';
  h+='<p class="ov-lede">'+DESC+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+FY_NOTE+'</div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue <span>($B, FY · actuals + Summit est.)</span></div><div class="ov-chart-wrap"><canvas id="meRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating Income <span>($B, FY · actuals + Summit est.)</span></div><div class="ov-chart-wrap"><canvas id="meOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-diagram-cap">'+EST_CAP+'</div>';
  h+=sec('How Meta Makes Money — the ad auction',
    '<p class="ov-lede" style="margin:0 0 14px">~98% of revenue is advertising sold by real-time auction — <b>tap any step</b>.</p>'+chain(AD_FLOW,'ad'));
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

// ─── Pane: Family of Apps (the engine) ────────────────────────────────────────
function foaBody(){
  var h='';
  h+='<p class="ov-lede"><b>This is where everything that matters happens.</b> The Family of Apps is ~99% of revenue and all of the profit — an advertising machine of ~3.5B daily people, run at ~50% operating margin. Revenue is <b>Advertising</b> (Core: Facebook · Instagram · Threads, plus <b>WhatsApp</b> click-to-message) + a small <b>Other</b> line.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+AD+'"></span>Advertising</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+OTHER+'"></span>Other revenue</span></div>';
  h+='<div class="ov-chart-t">Family of Apps revenue <span>($B, FY · Advertising + Other)</span></div>';
  h+='<div class="ov-chart-wrap ovs-tall"><canvas id="meFoaRev"></canvas></div>';
  h+='<div class="ov-fynote">Advertising is ~<b>98% of total revenue</b>. Within it, the <b>Core</b> apps (FB/IG/Threads) are the bulk and <b>WhatsApp</b> click-to-message is among the fastest-growing pieces. <span class="ave-subh-note">(Meta no longer discloses Core-vs-WhatsApp or per-app ARPU separately; the solid KPIs today are <b>Family DAP</b> ~3.5B and <b>Family ARPP</b>, both rising — these are company disclosures, not in the Summit snapshot.)</span></div>';
  h+=sec('The ad engine — follow $1.00 of ad spend',
    '<p class="ov-lede" style="margin:0 0 12px">'+WALLED+'</p>'+
    '<div class="ov-sec-h ovt-store-h">Where each $1.00 of advertiser spend goes <span class="ave-subh-note">(tap a node, or press ▶ Play to step through)</span></div>'+
    flowHtml());
  h+=sec('GEM — the AI model behind the ads', '<p class="ov-lede" style="margin:0 0 12px">'+GEM_WHAT+'</p><div class="ov-callout">'+bullets(GEM_POINTS)+'</div>');
  h+=sec('Family of Apps — recent wins', '<div class="ov-callout">'+bullets(FOA_WINS)+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Reality Labs (the bet) ─────────────────────────────────────────────
function rlBody(){
  var h='';
  h+='<p class="ov-lede">Reality Labs is the <b>bet</b>, not the business — a deliberate, large loss the Family of Apps is built to absorb. Keep the focus proportional: it is ~1% of revenue and ~\u2212$19B of profit.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FOA+'"></span>Family of Apps</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+RL+'"></span>Reality Labs</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue by segment <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meSegRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating income by segment <span>($B, FY \u00b7 RL is a loss)</span></div><div class="ov-chart-wrap"><canvas id="meSegOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">Family of Apps made ~<b>$102B</b> of operating profit in FY2025; Reality Labs <b>lost ~$19B</b> \u2014 cumulative ~<b>$'+(RL_CUM/1000).toFixed(0)+'B</b> since 2020.</div>';

  // ── Product portfolio — compact cards, tap for detail (modal) ──
  h+=sec('What Reality Labs is \u2014 the product portfolio',
    '<p class="ov-lede" style="margin:0 0 14px">'+RL_WHAT+'</p>'+
    '<div class="ov-cards" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-card ov-clickable" style="border-top-color:'+RL+'" data-detail="rl:0"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">\ud83e\udd7d</span><span class="ov-card-n">Meta Quest</span><span class="ov-chip">Shipping</span></div><div class="ov-card-s">VR/MR headsets \u2014 full device revenue to RL segment</div><div class="ov-more">Details \u203a</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#06C167" data-detail="rl:1"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">\ud83d\udd76\ufe0f</span><span class="ov-card-n">Ray-Ban & Oakley Meta</span><span class="ov-chip" style="background:#ECFDF5;color:#06C167">>7M units</span></div><div class="ov-card-s">AI glasses w/ EssilorLuxottica \u2014 <b>partial</b> revenue recognition</div><div class="ov-more">Details \u203a</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#7AA9FF" data-detail="rl:2"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">\ud83c\udf10</span><span class="ov-card-n">Horizon & Platform</span><span class="ov-chip" style="background:#EEF0FE;color:#6366F1">Building</span></div><div class="ov-card-s">Social VR + developer platform \u2014 strategic, not financial yet</div><div class="ov-more">Details \u203a</div></div>'+
    '<div class="ov-card ov-clickable" style="border-top-color:#F59E0B" data-detail="rl:3"><div class="ov-card-h"><span style="font-size:20px;margin-right:4px">\ud83d\udd2e</span><span class="ov-card-n">Orion AR</span><span class="ov-chip" style="background:#FEF3E2;color:#D97706">Prototype</span></div><div class="ov-card-s">Full AR glasses \u2014 pre-revenue, absorbs most of R&D loss</div><div class="ov-more">Details \u203a</div></div>'+
    '</div>');

  // ── How to read RL — 3 key analyst insights, tap for detail ──
  h+=sec('How to read Reality Labs',
    '<p class="ov-lede" style="margin:0 0 12px">'+RL_NOTE+'</p>'+
    '<div class="ov-drivers" style="grid-template-columns:1fr 1fr 1fr">'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid '+RL+'" data-detail="rlread:0"><div class="ov-driver-t">Revenue understates traction</div><div class="ov-driver-d">Glasses sell millions but EssilorLuxottica books the sale \u2014 RL revenue is structurally misleading.</div><div class="ov-more">Why \u203a</div></div>'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid #06C167" data-detail="rlread:1"><div class="ov-driver-t">Glasses are the bet, not VR</div><div class="ov-driver-d">>7M units sold; investment pivoting toward wearables, away from VR/Horizon.</div><div class="ov-more">Why \u203a</div></div>'+
    '<div class="ov-driver ov-clickable" style="border-top:2px solid #C0392B" data-detail="rlread:2"><div class="ov-driver-t">Losses peak in 2026</div><div class="ov-driver-d">~$19B/yr, ~$79B cumulative \u2014 management guided the inflection is now.</div><div class="ov-more">Why \u203a</div></div>'+
    '</div>');

  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}



function spendBody(){
  var h='';
  h+='<p class="ov-lede">'+SPEND_LEDE+'</p>';
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
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Shell ────────────────────────────────────────────────────────────────────
function html(c){
  var h='<div class="ov ov-meta" data-brand="META">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="foa">Family of Apps</button>'+
    '<button type="button" class="ovt-tab" data-ovt="rl">Reality Labs</button>'+
    '<button type="button" class="ovt-tab" data-ovt="spend">Spend Engine</button>'+
    '<button type="button" class="ovt-tab" data-ovt="model">Model vs. Reality</button>'+
    '<button type="button" class="ovt-tab" data-ovt="supply">Supply Chain</button>'+
    '<button type="button" class="ovt-tab" data-ovt="calls">Earnings Calls</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="foa" hidden>'+foaBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="rl" hidden>'+rlBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="spend" hidden>'+spendBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="model" hidden>'+modelBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="supply" hidden>'+supplyBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="calls" hidden>'+callsBody()+'</div>';
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
function line(id, labels, data, color, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:labels, datasets:[{ data:data, borderColor:color, backgroundColor:'rgba(8,102,255,0.06)', borderWidth:2.5, tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:fmt } }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function pf(v){ return v.toFixed(0)+'%'; }
function fcCol(labels, solid){ return labels.map(function(l){ return /E$/.test(l)?FC:solid; }); }
function buildOverview(){ bar('meRev', YEARS_X, REV_X, fcCol(YEARS_X,BRAND), money); bar('meOp', YEARS_X, OPINC_X, fcCol(YEARS_X,BRAND2), money); }
function buildFoa(){ stacked2('meFoaRev', SEG_YEARS, { label:'Advertising', data:ADV_S, color:AD }, { label:'Other', data:OTH_S, color:OTHER }, money); }
function buildRl(){
  grouped('meSegRev', SEG_YEARS, { label:'Family of Apps', data:FOA_REV, color:FOA }, { label:'Reality Labs', data:RL_REV, color:RL }, money);
  grouped('meSegOp', SEG_YEARS, { label:'Family of Apps', data:FOA_OP, color:FOA }, { label:'Reality Labs', data:RL_OP, color:RL }, money);
}
function buildSpend(){ bar('meCapex', YEARS_X, CAPEX_X, YEARS_X.map(function(l,i){ return /E$/.test(l)?FC:(i===6?NEG:GRAY); }), money); bar('meDa', DA_YEARS_X, DA_X, fcCol(DA_YEARS_X,RL), money); }

// ═══ Model vs. Reality (quarterly back-test) ══════════════════════════════════
function groupRow(label,items){ return '<div class="ave-group"><span class="ave-group-l">'+esc(label)+'</span><div class="ave-pills">'+items.map(function(it){ return '<button type="button" class="ave-pill" data-ave="'+it[0]+'">'+esc(it[1])+'</button>'; }).join('')+'</div></div>'; }
function aveFmt(m,v){ if(v==null) return '—'; return m.fmt==='pct'?v.toFixed(1)+'%':money(v); }
function aveSurprise(m,i){ var e=m.est[i]; if(e==null) return 0; if(m.fmt==='pct') return m.act[i]-e; if(e===0) return 0; return (m.act[i]-e)/Math.abs(e)*100; }
function avePctS(v){ return (v<0?'−':'+')+Math.abs(v).toFixed(1)+'%'; }
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
  root.querySelectorAll('.ave-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ave')===k); });
  var m=AVE[k], t=document.getElementById('meAveT'), note=document.getElementById('meAveNote');
  if(t) t.innerHTML=esc(m.label)+' — surprise vs estimate <span>(%, per quarter · hover for value)</span>';
  if(note) note.textContent=m.note; setupAveSlider();
}
function buildModelTab(){ var root=document.querySelector('.ov-meta'); if(!root) return; buildAveChart(); switchAveMetric(root,_aveMetric); }
function modelBody(){
  var h='';
  h+='<p class="ov-lede" style="margin-bottom:14px">How the <b>Summit DCF</b>\'s quarterly estimate stacked up against what Meta actually reported. Each bar is the <b>surprise</b> (actual vs estimate); green = favorable (beat), red = unfavorable (miss). Pick a metric and drag the handles to window the quarters — chart and tiles recompute live.</p>';
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

// ─── Live price + market cap ──────────────────────────────────────────────────
// Sourced from Massive via the covered-calls-massive edge function (api.js →
// coveredCallsQuote): `snapshot` = live equity quote, `ratios` = market cap.
// Requires a logged-in portal user (the edge fn verifies the JWT); on any failure
// (not logged in, off-hours error, vendor hiccup) the banner hides gracefully.
// Dynamic import keeps this module loadable in non-browser contexts.
// Compact $ formatter (sign-aware): 1.92e12 -> "$1.92T"; 1.7e10 -> "$17B".
function meBig(m){ if(m==null) return null; var a=Math.abs(m); if(a>=1e12) return '$'+(a/1e12).toFixed(2)+'T'; if(a>=1e9) return '$'+(a/1e9).toFixed(a/1e9>=100?0:1)+'B'; return '$'+Math.round(a/1e6)+'M'; }
// Live price + valuation for META via the shared api.liveQuote (Massive): price,
// change %, market cap, enterprise value, net cash/debt and shares. Each field is
// optional; the banner hides only if no price can be sourced (not logged in / off-hours).
function renderLive(root){
  var el=root.querySelector('#meLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live data…</span>';
  import('../api.js').then(function(api){ return api.liveQuote('META'); }).then(function(res){
    var q=(res && res.success) ? res.data : null;
    if(!q || q.price==null){ el.hidden=true; el.innerHTML=''; return; }
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

// ─── Orchestration ────────────────────────────────────────────────────────────
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(buildOverview);
  if(key==='foa')      requestAnimationFrame(buildFoa);
  if(key==='rl')       requestAnimationFrame(buildRl);
  if(key==='spend')    requestAnimationFrame(buildSpend);
  if(key==='model')    requestAnimationFrame(buildModelTab);
  if(key==='supply')   requestAnimationFrame(scRenderSuppliers);
}
function wireModal(root){
  var back=root.querySelector('#meModalBack'), mT=root.querySelector('#meModalT'), mB=root.querySelector('#meModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#meModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){ var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='ad'){ var s=AD_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:(s.detail||s.d)}:null; }
    if(kind==='spend'){ var w=SPEND_WAYS.filter(function(x){return x.k===id;})[0]; return w?{t:w.t,h:w.detail}:null; }
        if(kind==='rl'){ var rlD=RL_DETAIL[+id]; return rlD?{t:rlD.t,h:rlD.h}:null; }
    if(kind==='rlread'){ var rlR=RL_READ_DETAIL[+id]; return rlR?{t:rlR.t,h:rlR.h}:null; }
    return null; }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
// Ad-spend flow player (open web vs walled garden).
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
  var root=document.querySelector('.ov-meta'); if(!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  root.querySelectorAll('.ave-pill').forEach(function(b){ b.onclick=function(){ switchAveMetric(root, b.getAttribute('data-ave')); }; });
  wireModal(root);
  wireFlow(root);
  // Earnings calls accordion
  root.querySelectorAll('#meCallsAcc .lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'\u2013':'+'; }; });
  root.querySelectorAll('.sc-pill').forEach(function(b){ b.onclick=function(){ switchScFilter(root, b.getAttribute('data-sccat')); }; });
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var metaOverview = { html: html, init: init };
