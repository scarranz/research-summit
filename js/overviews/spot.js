// overviews/spot.js — custom Overview for Spotify Technology S.A. (NYSE: SPOT)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Sub-tabs:
//   • Overview     — snapshot, business description, headline KPIs (Summit DCF).
//   • Product Mix  — VISUAL-FIRST gross-margin story: how content economics shifted
//                    from a music-only royalty model to a three-format platform
//                    (music + podcasts + audiobooks), and why that re-rates the P&L.
//
// Sources: Spotify FY2024 Annual Report (Form 20-F), Q1 2026 Shareholder Deck &
// earnings call prepared remarks, historical 20-F income statements, and the Summit
// DCF model (snapshot 2026-05-22). Financial figures reported in EUR.

import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }

// ════════════════════════════════════════════════════════════════════════════
// PANE 1 — OVERVIEW (standardized · docs/OVERVIEW_CONVENTIONS.md §4, the 7 blocks)
//
// Replaced the legacy Overview (snapshot strip + lede + a 4-KPI box) on Jul 2026.
// NOTHING WAS LOST (Golden Rule #1): the old snapshot rows are absorbed into the
// richer Key Facts grid, the old description was rewritten to be non-redundant,
// and the old FY2025 KPI strip — which has no home among the 7 blocks (the
// conventions forbid a second snapshot box and any margins block) — was MOVED to
// Deep Dive ▸ Bottom Line as "FY2025 at a glance" (see fy25Glance).
//
// The old snapshot said "Founder & CEO — Daniel Ek". That has been WRONG since
// 1 Jan 2026: Spotify now has CO-CEOs (Norström + Söderström) with Ek as
// executive chairman. Verified against the 6-K filed 2025-09-30.
// ════════════════════════════════════════════════════════════════════════════
var BRAND='#1DB954', BRAND2='#0F7A38', BLACK='#191414', GRAY='#9AA4B0', SAND='#B7A57A';

function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ── Block 1 · Key Facts — exactly 10 cells (5×2). Filer status VERIFIED on EDGAR:
// CIK 1639920 has filed 20-F ×8 and 6-K ×91 and ZERO 10-K/10-Q/8-K ever — foreign
// private issuer, not inferred from the Luxembourg domicile.
var STD_FACTS=[
  ['Listing','NYSE: SPOT'],
  ['HQ','Stockholm, Sweden (operations)'],
  ['Incorporated','Luxembourg · S.A. · Dec 2006'],
  ['SEC filer','Foreign (20-F/6-K) · verified on EDGAR'],
  ['Founded','2006 · Daniel Ek & Martin Lorentzon'],
  ['Public since','Apr 3, 2018 · NYSE direct listing'],
  ['CEO','Co-CEOs Alex Norström & Gustav Söderström · both since Jan 2026'],
  ['Employees','~7,323 · Dec 2025'],
  ['Dividend','Non-payer · never paid one'],
  ['Market cap','live'],
];

var SPOT_LEDE='Spotify streams audio — music, podcasts and audiobooks — on demand to listeners in 184 countries, across phones, computers, speakers, cars, televisions and game consoles. It owns almost none of what it plays: the rights sit with record labels, music publishers, podcast creators and audiobook publishers, and Spotify pays them for essentially every stream it serves. The business is run from Stockholm beneath a Luxembourg holding company, reports in euros under IFRS, and has traded on the NYSE since 2018.';

// ── Block 3 · the 2×2 (each cell ≤ ~30 words) ──
var STD_BIZ=[
  ['What it sells','On-demand access to a licensed catalogue — over 100 million tracks, ~7 million podcasts and 500,000+ audiobooks — either ad-free for a monthly fee or free with advertising.'],
  ['Who buys it','Listeners in 184 countries, most of them not paying; advertisers who want that free audience (skewed 18–34); and telecom partners that bundle subscriptions into their own plans.'],
  ['How it earns','Subscriptions are price × subscribers and dominate the revenue line; advertising is impressions sold direct or, increasingly, through automated auctions.'],
  ['The edge','Scale in a market where nobody owns the content: the largest audience any rights-holder can reach, and two decades of listening data behind the recommendations.'],
];

// ── Block 4 · How it makes money. FY2025 per the Form 20-F. Two views of the SAME
// total — both reconcile to €17,186M exactly (segments 15,350+1,836; geography
// 6,470+13+10,703).
var GMM_SEG=[
  ['Premium', 89.3, '€15,350M', '89%', BRAND],
  ['Ad-Supported', 10.7, '€1,836M', '11%', SAND],
];
var GMM_GEO=[
  ['Other countries', 62.3, '€10,703M', '62%', GRAY],
  ['United States', 37.6, '€6,470M', '38%', BRAND],
  ['Luxembourg', 0.08, '€13M', '0.1%', BLACK],
];
var REV_DEFS=[
  { seg:'Premium — the subscription business',
    desc:'The paid tier: unlimited, ad-free, on-demand streaming, online and offline, with downloads and higher-quality audio. It earns a <b>monthly fee per account</b>, sold mostly direct to listeners and partly through <b>telecom partners</b> who bundle it into their own plans at a negotiated per-subscriber rate. Growth has two levers and only two: <b>more subscribers</b> — overwhelmingly converted from the free tier — and <b>price</b>, which Spotify left untouched for roughly fifteen years before starting to raise it. The plan line-up is deliberately segmented (individual, duo, family, student, a cheaper <i>Basic</i> plan without audiobook hours, and a US-only audiobook-hours tier) so that different willingness to pay can be captured without discounting the flagship. Audiobook listening hours are bundled into the main plan — a decision that also reshaped what Spotify owes music publishers.',
    econ:[['FY2025 revenue','€15,350M · 89% of total'],['Growth','+11% YoY'],['Gross profit','€5,166M · 33.7% margin'],['Share of group gross profit','~94%']],
    econNote:'FY2025 Form 20-F, Note 23, as reported. Effective 1 Jan 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023–25; on that restated basis FY2025 Premium is €15,391M. Total revenue is unchanged either way.' },
  { seg:'Ad-Supported — the free tier, and the funnel',
    desc:'The free tier: limited on-demand music plus unlimited podcasts, paid for by advertising rather than by the listener. It has <b>two jobs</b>, and Spotify is explicit that the second matters more than the first — it is a business in its own right, and it is <b>the acquisition channel for Premium</b>, supplying the bulk of new subscribers. It earns from <b>display, audio and video advertising</b>, sold either directly to agencies against an insertion order or, increasingly, through <b>automated real-time auctions</b>. The audience is the asset: skewed toward 18–34-year-olds, a demographic advertisers have historically struggled to reach elsewhere. Margins here are structurally far thinner than Premium\'s, and the segment is seasonal — advertising peaks in the December quarter and falls away sharply in the March quarter.',
    econ:[['FY2025 revenue','€1,836M · 11% of total'],['Growth','−1% YoY (0% restated)'],['Gross profit','€330M · 18.0% margin'],['Share of group gross profit','~6%']],
    econNote:'FY2025 Form 20-F, Note 23, as reported. On the restated basis Ad-Supported FY2025 revenue is €1,795M at a 17.4% margin. The margin roughly doubled from FY2024 while revenue went nowhere — the deliberate trade in the shift to automated selling.' },
  { seg:'Why the geography split looks strange',
    desc:'Spotify does <b>not</b> publish revenue by region. Its only geographic revenue disclosure is the one accounting standards require — <b>United States, Luxembourg, and everything else</b> — and Luxembourg, the country of incorporation, produces a rounding error because it is a holding-company domicile, not a market. Subscription revenue is attributed to the country the membership originates in; advertising to where the campaign runs. The regional picture Spotify <i>does</i> give is about <b>users, not money</b>, and it is the more revealing one: its two fastest-growing regions are also its hardest to monetize, which is why headline revenue grows more slowly than the listener count.',
    econ:[['United States','€6,470M · 37.6% of revenue'],['Other countries','€10,703M · 62.3%'],['Luxembourg','€13M · 0.08%'],['Users — Europe','26% of MAUs · +6% YoY'],['Users — Latin America','21% of MAUs · +10% YoY'],['Users — North America','16% of MAUs · +3% YoY'],['Users — Rest of world','37% of MAUs · +21% YoY']],
    econNote:'Revenue split: FY2025 Form 20-F, Note 23. User mix: FY2025 Form 20-F, Item 4.B — percentages of monthly active users, NOT revenue. The two are shown together deliberately: the growth is where the money is not.' },
];

// ── Block 5 · Products — two tiers: family card → pop-up → the specific products.
// Anything the filings do not name is left out rather than guessed (the widely
// reported "Music Pro" superfan tier is NOT in any Spotify filing or release, so
// it does not appear here).
var S_PRODUCTS=[
  { ic:'🎧', fam:'Premium subscription', d:'The paid plans and what is bundled into them.', items:[
    ['Individual · Duo · Family · Student','The core plan shapes. Family covers a primary account plus up to five sub-accounts; Duo covers two. Ad-free, offline, fully on-demand.'],
    ['Basic','A cheaper Premium variant in select markets that strips out extras — notably the monthly audiobook listening hours.'],
    ['Audiobook Access Tier (US only)','Audiobook hours without the rest of Premium — a way in for listeners who want books, not music.'],
    ['Audiobooks+','A paid add-on that buys extra audiobook hours beyond the monthly allowance. Launched July 2025.'],
    ['Lossless','24-bit/44.1 kHz FLAC streaming for Premium subscribers, launched September 2025 across 50+ markets.'],
  ]},
  { ic:'📻', fam:'Free tier & advertising', d:'The ad-funded side, and the tools that sell it.', items:[
    ['Ad-Supported service','The free tier: limited on-demand music, unlimited podcasts. Both a business and the main source of new Premium subscribers.'],
    ['Spotify Ad Exchange (SAX)','A programmatic marketplace letting advertisers buy inventory through real-time biddable auctions. Launched April 2025; the centre of the ad rebuild.'],
    ['Spotify Audience Network (SPAN)','An audio-ad marketplace spanning Spotify\'s own podcasts, enterprise publishers on Megaphone and independent creators — including inventory off Spotify itself.'],
    ['Megaphone','Podcast hosting and ad-insertion for enterprise publishers, acquired in 2020. It is the plumbing under a large share of SPAN\'s inventory.'],
  ]},
  { ic:'📚', fam:'Content verticals', d:'What is actually being streamed, beyond music.', items:[
    ['Music catalogue','Over 100 million tracks, licensed from the three major labels, Merlin for independents, and publishers.'],
    ['Podcasts','Around 7 million titles — a mix of licensed shows, Spotify-owned originals, and anything creators upload themselves.'],
    ['Video podcasts','Watchable podcasts, ad-free for Premium subscribers. The reason podcast costs began landing in the Premium segment.'],
    ['Audiobooks','A subscriber catalogue of 500,000+ titles, with Premium audiobook access live in 22 markets.'],
  ]},
  { ic:'🛠️', fam:'Creator & marketplace tools', d:'The two-sided platform: what rights-holders get.', items:[
    ['Spotify for Creators','Hosting and distribution for independent podcasters; its inventory feeds the advertising network.'],
    ['Spotify Partner Program','Audience-driven payouts for eligible video podcasts. Launched January 2025 in four markets, now in 19.'],
    ['Spotify for Authors','The route by which authors and publishers distribute audiobooks, paid on consumption.'],
    ['Marketplace promotion programs','Voluntary programs letting labels and artists have tracks favoured in recommendations in exchange for a discounted royalty rate — a direct gross-margin lever.'],
  ]},
  { ic:'🤖', fam:'Discovery, AI & social', d:'The recommendation layer and what has been built on it.', items:[
    ['AI DJ','A generative-AI presenter that sequences and introduces music for an individual listener.'],
    ['AI Playlist / Prompted Playlist','Playlists generated from a written prompt; the prompted variant keeps refreshing itself as listening habits move.'],
    ['Taste Profile · SongDNA · About the Song','Newer features letting listeners steer their own recommendations and read the context behind a track.'],
    ['Messages','In-app sharing and discussion of music, podcasts and audiobooks. Launched August 2025.'],
    ['OpenAI / ChatGPT partnership','Announced October 2025 — surfacing Spotify recommendations inside ChatGPT, extending the service into agentic AI assistants.'],
    ['Reserved by Spotify','Holds a pair of tour tickets for an artist\'s most engaged listeners ahead of general sale. US-only, with Live Nation and Ticketmaster.'],
  ]},
];

// ── Block 7 · Timeline — corporate lineage, not a news feed. ──
var TIMELINE=[
  { y:'2006', t:'<b>Genesis:</b> Daniel Ek and Martin Lorentzon found Spotify in Stockholm — and wrap it in a <b>Luxembourg holding company</b>.',
    d:'<ul class="ov-bullets"><li>The two met through a deal: Lorentzon had founded <b>Tradedoubler</b>, which bought Ek\'s advertising company Advertigo.</li><li><b>27 Dec 2006</b> — <b>Spotify Technology S.A.</b> is incorporated in Luxembourg (converted to a <i>société anonyme</i> in 2009). All operations stay Swedish: <b>Spotify AB</b> is, and remains, the main operating company.</li><li>How little Luxembourg is a business: FY2025 revenue booked there was <b>€13 million</b> — 0.08% of the group — and Spotify holds <b>no property or equipment</b> in the country at all.</li><li>The consequence still binding today: because the issuer is Luxembourgish, Spotify is a <b>foreign private issuer</b> — it files 20-F and 6-K, never a 10-Q, and is governed by Luxembourg company law.</li></ul>' },
  { y:'2008', t:'The service launches — shifting listeners from <b>owning</b> music to <b>accessing</b> it.',
    d:'<ul class="ov-bullets"><li>Spotify\'s own framing: it moved the industry from a "transaction-based" experience of buying music to an "access-based" model.</li><li>Ek and Lorentzon both join the board in <b>July 2008</b> — the governance structure that still runs the company predates the product having any scale.</li></ul>' },
  { y:'2018', t:'<b>The direct listing:</b> Spotify goes public on the NYSE <b>without raising a cent</b>.',
    d:'<ul class="ov-bullets"><li><b>3 Apr 2018</b> — trading opens under "SPOT". The mechanism was a <b>resale registration of existing shares</b>: no underwriters, no new shares, no lock-up, <b>no proceeds to Spotify</b>.</li><li>Why: the company did not need capital and did not want either the dilution or an underwriter-set price. The opening price was set by the NYSE market maker from collected orders.</li><li>Spotify conceded the novelty in the prospectus — a "novel method for commencing public trading" that could make the shares more volatile.</li><li>Control was locked in at the same moment through <b>beneficiary certificates</b>: votes with no economic rights, held by the founders. At end-2025 Ek and Lorentzon hold <b>69.3% of the votes</b> on a small minority of the economics.</li><li>It became the template later copied by Slack, Palantir and Coinbase — and Spotify has never done a follow-on equity offering since.</li></ul>' },
  { y:'2019–22', t:'<b>Business-model inflection:</b> ~€900M spent buying its way out of being a music-only company.',
    d:'<ul class="ov-bullets"><li><b>2019, in seven weeks</b> — Anchor (€136M, creator tooling), Gimlet (€172M, a studio) and Parcast (€49M). An entire vertical bought from a standing start.</li><li><b>2020</b> — The Ringer (€170M) for owned content, and <b>Megaphone (€195M)</b> for podcast hosting and ad insertion.</li><li><b>2022</b> — Podsights and Chartable (€83M, ad measurement), <b>Findaway (€117M)</b> — the origin of the entire audiobook business — and Sonantic (€93M), its first AI acquisition.</li><li>The strategic logic was <b>margin, not revenue</b>: podcasts and audiobooks carry no label royalty, so every hour shifted away from music structurally lifts gross margin.</li><li>These are the <b>last material acquisitions Spotify has made</b> — no significant business combination is disclosed in FY2023, FY2024 or FY2025.</li></ul>' },
  { y:'2023', t:'<b>The correction year:</b> three restructurings, a 20% smaller company — and the first price rise in fifteen years.',
    d:'<ul class="ov-bullets"><li><b>Jan 2023</b> — a reorganization cuts ~6% of staff. <b>Q2 2023</b> — the podcast bet is marked down: a realignment writes off <b>€29M of content assets</b>. <b>Dec 2023</b> — a further <b>17%</b> of the company goes.</li><li>Severance for the year: <b>€212M</b>. Average headcount falls from 9,123 (2023) to 7,287 (2025) — a permanent ~20% reduction.</li><li><b>Jul 2023</b> — the <b>first broad Premium price increase</b>, across 50+ markets. The US individual plan moves off the $9.99 it had held since launch.</li><li>Why it is the hinge: FY2023 was the worst year since listing (an operating loss of €446M). Every margin gain since is built on this cost base — and the company discovered it had pricing power all along.</li></ul>' },
  { y:'2024', t:'<b>The audiobook bundle</b> quietly cuts the music royalty rate — and triggers a lawsuit that is still live.',
    d:'<ul class="ov-bullets"><li>By bundling audiobook hours into Premium, Spotify reclassified the subscription as a <b>bundle</b> under US copyright rules — which lowers the mechanical royalty owed to <b>music publishers</b> on the music portion.</li><li><b>May 2024</b> — the Mechanical Licensing Collective sues, alleging Spotify underpaid by reporting Premium as a bundle. <b>Jan 2025</b> — dismissed with prejudice: the court holds it <i>is</i> a bundle.</li><li><b>Oct 2025</b> — the MLC files an amended complaint attacking how the bundle\'s components were valued. <b>The case is not over.</b></li><li>Spotify quantifies the exposure: if it ultimately loses, roughly <b>€358 million</b> for March 2024–December 2025, plus penalties and interest it cannot estimate.</li><li>Why it matters: this is arguably the most consequential product decision in Spotify\'s history in profit terms — the audiobook vertical bought in 2022 pays for itself through the <b>royalty line</b>, not the revenue line.</li></ul>' },
  { y:'2024', t:'<b>First profitable year</b> in the company\'s history — then it doubles.',
    d:'<ul class="ov-bullets"><li>The loss lineage: 2018 €(78)M · 2019 €(186)M · 2020 €(581)M · 2021 €(34)M · 2022 €(430)M · 2023 €(532)M.</li><li><b>2024: net income €1,138M.</b> 2025: <b>€2,212M</b>, on operating income of €2,198M — a 12.8% operating margin against a loss two years earlier.</li><li>A precision point worth keeping: 2021 had positive operating <i>and</i> pre-tax income but still a net loss, because tax expense was €283M. <b>FY2024 is the first year of positive net income.</b></li></ul>' },
  { y:'2025', t:'<b>Two inflections in one year:</b> podcasts start paying creators, and advertising is rebuilt around automated auctions.',
    d:'<ul class="ov-bullets"><li><b>Jan 2025</b> — the <b>Partner Program</b> launches: audience-driven payouts for video podcasts, ad-free for subscribers. It is the first time podcast economics crossed into the Premium segment.</li><li><b>Apr 2025</b> — the <b>Spotify Ad Exchange</b> launches, moving advertising from insertion orders to real-time biddable auctions.</li><li>The trade shows up immediately in the numbers: Ad-Supported gross margin roughly doubles year over year while <b>Ad-Supported revenue goes nowhere</b>. Spotify swapped advertising volume for advertising margin, on purpose.</li><li>Also 2025: a second buyback authorization, further price increases across many markets, Lossless, and an OpenAI partnership putting Spotify inside ChatGPT.</li></ul>' },
  { y:'2026', t:'<b>Founder succession:</b> co-CEOs take over on 1 January — and Ek keeps the board, the votes and capital allocation.',
    d:'<ul class="ov-bullets"><li>Announced <b>30 Sep 2025</b>, effective <b>1 Jan 2026</b>: <b>Alex Norström</b> (joined 2011) and <b>Gustav Söderström</b> (joined 2009) become <b>co-CEOs</b>; Daniel Ek becomes <b>executive chairman</b> after nineteen years as chief executive.</li><li>Spotify\'s framing is continuity, not rupture: the change "formalizes how Spotify has successfully operated since 2023."</li><li>Two facts cut the other way, and both are in the release: the co-CEOs <b>report to Ek</b>, and as executive chairman he <b>determines capital allocation</b> — explicitly modelled on "a European chairman setup."</li><li>The first accounting act of the new leadership: effective 1 Jan 2026 they <b>redrew the segment boundary</b>, moving revenue from Ad-Supported into Premium and restating 2023–25.</li></ul>' },
  { y:'2026', t:'<b>Investor Day:</b> the first public long-term financial framework — a 35–40% gross margin by 2030.',
    d:'<ul class="ov-bullets"><li><b>21 May 2026</b> — the co-CEOs\' first major public act. Targets to 2030: <b>mid-teens revenue growth, a 35–40% gross margin, and an operating margin above 20%.</b></li><li>Longer-term "north stars": a billion subscribers and $100 billion of revenue.</li><li>Why it is the whole equity story: FY2025 gross margin was <b>32.0%</b>. Getting to 35–40% requires the marketplace programs, the audiobook royalty effect, programmatic advertising margin and superfan pricing to compound at once.</li><li>Spotify also said it intends to begin returning excess capital — but <b>no dividend has been declared</b>; buybacks remain the only mechanism.</li></ul>' },
];

var OV_SOURCES='Sources — Spotify FY2025 Form 20-F (SEC EDGAR, CIK 1639920, filed Feb 2026) for all FY2025 revenue, segment, geographic, employee and dividend figures, the segment definitions and the product descriptions; Q1 2026 Form 6-K and shareholder update for the segment reclassification and the latest quarter; the 6-K of 30 Sep 2025 for the co-CEO transition; the 2018 direct-listing prospectus (424B4) for the listing mechanism; Spotify Newsroom for dated product launches and the May 2026 Investor Day targets. Filer status verified directly against the EDGAR submissions index. Spotify reports in EUR under IFRS — euro figures are as reported; market cap is live in USD (Massive). Peer multiples are labelled where seeded.';

// The old Overview KPI strip, relocated here per Golden Rule #1 — it has no home
// among the 7 Overview blocks (no second snapshot box, no margins block), but the
// figures are still worth showing, so they open the Bottom Line pane.
var FY25_KPIS = [
  { l:'Revenue (FY2025)',     v:'€17.19B', d:'+9.7% vs FY2024',        dir:'up' },
  { l:'Gross profit (FY2025)',v:'€5.50B',  d:'32.0% margin',           dir:'up' },
  { l:'Operating income',     v:'€2.20B',  d:'12.8% margin · FY2025',  dir:'up' },
  { l:'Net income',           v:'€2.21B',  d:'FY2025 · 2nd profitable year', dir:'up' },
];
function fy25Glance(){
  return sec('FY2025 at a glance',
    kpis(FY25_KPIS)+
    '<div class="ave-subh-note" style="margin-top:6px">Spotify FY2025 Form 20-F, consolidated statement of operations. Reported in EUR under IFRS. (These four figures previously sat in the Overview; the standardized Overview has no KPI box, so they live here.)</div>');
}

function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }

// ════════════════════════════════════════════════════════════════════════════
// OVERVIEW RENDERERS (the shared standardized pattern — same shape as amzn.js)
// ════════════════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v = (p[0]==='Market cap') ? '<span id="spotMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>';
  }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function gmmBars(arr){
  return '<div class="ov-mbars">'+arr.map(function(r){
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+Math.max(r[1],1.2)+'%;background:'+r[4]+';">'+esc(r[2])+'</div></div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">FY2025 revenue <b>€17,186M (+9.7%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b>. Both reconcile to the reported figure exactly.</div>';
  h+='<div class="mg-tog-row" style="display:flex;gap:14px;margin:2px 0 8px"><span class="mg-tog" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)">View: <span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px"><button type="button" class="mg-pill active" data-gmm="seg" style="border:none;background:var(--navy);color:#fff;font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Segments</button><button type="button" class="mg-pill" data-gmm="geo" style="border:none;background:transparent;color:var(--mu);font:inherit;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:999px;cursor:pointer">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+
     '<div class="ave-subh-note" style="margin-top:7px">This is the only geographic revenue split Spotify publishes. Luxembourg is the country of incorporation, not a market — hence €13M. Open the third card below for the regional picture, which Spotify reports for <b>users</b> rather than revenue.</div></div>';
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note" style="margin-top:6px">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">FY2025: gross profit <b>€5,496M (32.0%)</b> · operating income <b>€2,198M (12.8%)</b> · net income <b>€2,212M</b>. Premium is <b>89% of revenue but ~94% of gross profit</b> — the free tier earns its keep as a funnel, not as a business. <span class="ave-subh-note">Source: Spotify FY2025 Form 20-F (Note 23).</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+S_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':'';
    var cls=t.d?' ov-clickable':'', attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>';
}

// ── Block 6 · Competitors. Two families sit on this map deliberately: the
// DEMAND-side platforms Spotify competes with for a subscription, and the
// SUPPLY-side rights owners it licenses from — because the open question in
// music streaming is which of the two captures the value pool.
// Spotify's largest competitors in every vertical (Apple Music, YouTube Music,
// Amazon Music/Audible) are units of trillion-dollar parents with no separable
// multiple, so they cannot be plotted; they are called out below the chart.
// Multiples and growth read from stockanalysis.com on 2026-07-31 (each company's
// /statistics/ and /forecast/ page). A multiple is set to NULL — so the peer drops
// off that view rather than plotting at a fabricated position — wherever the number
// exists but does not MEAN anything: a P/E sitting on a tax-benefit-inflated or
// negative denominator is not a valuation.
var SC_SRC_NOTE='Multiples and growth: stockanalysis.com, read 31 Jul 2026 (trailing figures same-day; forward revenue growth as of each page\'s own update, 19 May–31 Jul). Market caps are live via Massive. Forward EV/EBITDA is NOT published for any of these names, so that view plots nothing — use trailing.';
var S_PEERS=[
  { tk:'SPOT', n:'Spotify', hl:true, peT:35.17, peF:35.27, evT:33.40, evF:null, gt:8.0, gf:13.25, mc:103.7,
    why:'The only listed pure-play audio platform at global scale — and the most expensive thing on this map on EV/EBITDA. Priced for the 2030 margin promise, not the 32% gross margin it earns today.' },
  { tk:'NFLX', n:'Netflix', peT:23.05, peF:21.13, evT:20.75, evF:null, gt:16.0, gf:13.34, mc:297.8,
    why:'The closest structural analogue anywhere: global direct-to-consumer subscription media, content-cost-led margin, a late ad tier and annual pricing power. Grows like Spotify and costs a third less on earnings.' },
  { tk:'TME', n:'Tencent Music', peT:11.50, peF:9.76, evT:7.02, evF:null, gt:15.4, gf:8.28, mc:14.8,
    why:'The other listed music-streaming pure play at scale — and the cheapest name here by a distance. A direct read-across on ARPU and label economics; Spotify also holds roughly 9% of it.' },
  { tk:'UMG', n:'Universal Music', peT:null, peF:18.16, evT:16.51, evF:null, gt:5.2, gf:8.43, mc:40.4,
    why:'The largest of the three majors Spotify licenses from — its multiple IS the market\'s answer to who captures the streaming value pool. Note: it fell ~25% on 31 Jul 2026 on an earnings miss, so it is priced post-shock while the rest of the map is not. Trailing P/E is omitted: TTM net income collapsed on below-the-line charges, making it meaningless.' },
  { tk:'WMG', n:'Warner Music', peT:30.59, peF:15.45, evT:14.08, evF:null, gt:12.6, gf:8.52, mc:13.6,
    why:'The second listed major, smaller and more levered. Same counterparty question as Universal from a different balance sheet — and the gap between its trailing and forward P/E is the market pricing a recovery.' },
  { tk:'SIRI', n:'Sirius XM', peT:12.11, peF:9.49, evT:8.65, evF:null, gt:0.4, gf:0.20, mc:10.1,
    why:'Satellite radio, and the owner of Pandora — the only listed window onto a US ad-supported-audio P&L. Flat revenue at a single-digit multiple: the low-growth anchor, and a warning about what audio looks like without subscriber growth.' },
  { tk:'DUOL', n:'Duolingo', peT:null, peF:49.90, evT:29.71, evF:null, gt:35.5, gf:16.46, mc:6.3,
    why:'Not audio, but the purest listed freemium-funnel comparable: an enormous free base, low single-digit paid conversion, subscriptions plus a small ad line. The fastest grower here and the most expensive on earnings. Trailing P/E omitted — a tax-valuation-allowance release makes it look artificially cheap; the forward figure also varies 38–50x by source.' },
  { tk:'LYV', n:'Live Nation', peT:null, peF:null, evT:28.62, evF:null, gt:10.8, gf:10.21, mc:40.6,
    why:'The listed proxy for the live and ticketing pool — a genuine peer since June 2026, when Spotify began reserving tour tickets for superfans with Live Nation and Ticketmaster. No P/E on either basis: it is loss-making, and next year\'s consensus EPS is still negative, so only EV/EBITDA is meaningful.' },
];

var S_SC={ metric:'pe', basis:'f', peers:null, _capsFetched:false };
function sScReset(){ if(!S_SC.peers) S_SC.peers=S_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function sScMult(p){ var key=(S_SC.metric==='pe'?'pe':'ev')+(S_SC.basis==='f'?'F':'T'); return p[key]; }
function sScMax(){ return S_SC.metric==='pe'?60:36; }   // headroom above the widest real value on each axis
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.asc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.asc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.asc-chip .x{color:var(--mu);font-weight:800}'+
    '.asc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.asc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.asc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#1DB954}</style>';
  h+='<div class="spot-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="spot-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="spot-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="spot-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips spot-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. <b>Only listed peers with a public multiple plot here.</b> Spotify\'s biggest rivals in every vertical — <b>Apple Music, YouTube Music and Amazon Music/Audible</b> — are units inside AAPL, GOOGL and AMZN with no separable financials, so they have no multiple to plot; the same goes for private rivals (SoundCloud, JOOX) and for the independent-rights agency Merlin. They belong in the competitive landscape, not on this chart. Apple is also Spotify\'s <b>distribution gatekeeper</b>, which is a structural relationship a scatter cannot express. <span class="ave-subh-note spot-sc-src"></span></div>';
  h+='<div class="mg-tip spot-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function sScRenderOne(wrap){
  var g=wrap.querySelector('.spot-sc-nodes'); if(!g||!S_SC.peers) return;
  var maxMult=sScMax(), X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.spot-sc-xlab'); if(lab) lab.textContent=(S_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(S_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===S_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===S_SC.metric); });
  // First pass: compute a position for every peer that HAS a multiple on this basis.
  // A peer with no meaningful multiple DROPS OUT of this view rather than being plotted
  // at a made-up position (conventions §4.6).
  var pts=[], dropped=[];
  S_SC.peers.forEach(function(p){
    if(!p.on) return;
    var m=sScMult(p);
    if(m==null||isNaN(m)){ dropped.push(p.n); return; }
    var growth=S_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    pts.push({ p:p,
      x:X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0),
      y:Y0-Math.max(0,Math.min(1,(growth||0)/30))*(Y0-Y1),
      r:Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)) });
  });
  // Second pass: keep the LABELS legible. Peers cluster (the three music majors sit within
  // a few turns of each other), and overlapping names are unreadable — so a node whose
  // label would collide with the previous one flips above the bubble instead of below.
  pts.sort(function(a,b){ return a.x-b.x; });
  var placed=[];   // label boxes already committed, in SVG units
  pts.forEach(function(pt){
    // Try each vertical slot in turn and take the first that clears every label
    // already placed. Half-width is generous (names run long) so near-misses still flip.
    var slots=[ pt.r+12, -(pt.r+6), pt.r+25 ];
    var halfW=Math.max(34, pt.p.n.length*3.4);
    for(var i=0;i<slots.length;i++){
      var box={ x:pt.x, y:pt.y+slots[i], hw:halfW };
      var clash=placed.some(function(q){ return Math.abs(q.x-box.x)<(q.hw+box.hw) && Math.abs(q.y-box.y)<12; });
      if(!clash || i===slots.length-1){ pt.ly=slots[i]; placed.push(box); break; }
    }
  });
  var frag='';
  pts.forEach(function(pt){
    var p=pt.p, r=pt.r, logo=scLogoUrl(p);
    var ly = pt.ly;
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+ly.toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND2:'#3A4552')+'" text-anchor="middle" stroke="#fff" stroke-width="3.5" paint-order="stroke" style="paint-order:stroke fill">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  // Say WHY a peer is missing — an absent dot must never read as an oversight.
  var src=wrap.querySelector('.spot-sc-src');
  if(src) src.textContent=(dropped.length?'Not plotted on this view (no meaningful multiple on this basis): '+dropped.join(', ')+'. ':'')+SC_SRC_NOTE;
}
function sScChipsOne(wrap){
  var box=wrap.querySelector('.spot-sc-chips'); if(!box||!S_SC.peers) return;
  var h=S_SC.peers.map(function(p,i){ return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="spot-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="spot-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function sScRenderAll(root){ root.querySelectorAll('.spot-sc').forEach(sScRenderOne); }
function sScChipsAll(root){ root.querySelectorAll('.spot-sc').forEach(function(w){ sScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  sScReset();
  root.querySelectorAll('.spot-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var g=wrap.querySelector('.spot-sc-nodes'), tip=wrap.querySelector('.spot-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ S_SC.basis=btn.getAttribute('data-mgbasis'); sScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ S_SC.metric=btn.getAttribute('data-mgmetric'); sScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.spot-sc-svg');
      var nodeOf=function(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; };
      var show=function(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; };
      var move=function(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; };
      var hide=function(){ tip.hidden=true; };
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  sScRenderAll(root); sScChipsAll(root); sScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.spot-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(S_SC.peers[i]){ S_SC.peers.splice(i,1); sScRenderAll(root); sScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.spot-sc-addbtn'), addIn=wrap.querySelector('.spot-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!S_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=S_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; S_SC.peers.push(o); }
      else S_SC.peers.push({ tk:tk, n:tk, on:true, mc:100, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
    }
    addIn.value=''; sScRenderAll(root); sScChipsAll(root); sLiveOne(root, tk); }; }
}
// Live market cap (the Key Facts cell + the peer bubbles) via Massive (api.liveQuote).
// Degrades gracefully: a null payload just leaves the labelled fallback in place.
function sLiveOne(root, tk){
  import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); })
    .then(function(res){
      var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return;
      var mcB=q.marketCap/1e9;
      if(S_SC.peers) S_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; });
      if(tk==='SPOT'){ var el=root.querySelector('#spotMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; }
      sScRenderAll(root);
    }).catch(function(){});
}
function sScFetchCaps(root){ if(S_SC._capsFetched||!S_SC.peers) return; S_SC._capsFetched=true; S_SC.peers.forEach(function(p){ if(p.tk) sLiveOne(root, p.tk); }); }

// ── The standardized Overview body: hook always visible, everything below collapsed ──
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND2+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '</style>';
  // The hook — always visible: Key Facts, description, 2×2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(SPOT_LEDE)+'</p>';
  h+=stdFourQuad();
  // Everything below the hook defaults collapsed (progressive disclosure).
  h+=collapsible('How Spotify makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Spotify', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}

// ── The pop-up (products + timeline "read more"). Hoisted to #co-detailview in
// init so it survives switching between the Overview and Deep Dive panes. ──
function wireModal(root){
  var back=root.querySelector('#spotModalBack'), mT=root.querySelector('#spotModalT'), mB=root.querySelector('#spotModalB');
  if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#spotModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=S_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    if(!/^(prod|hist):/.test(el.getAttribute('data-detail')||'')) return;   // leave sax/news handlers alone
    el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); };
  });
}

// ════════════════════════════════════════════════════════════════════════════
// PANE 2 — PRODUCT MIX  (visual-first)
// ════════════════════════════════════════════════════════════════════════════
var PM_LEDE = 'Follow <b>$10</b> of Premium revenue through Spotify. For years almost all of it was <b>music</b>, and about <b>two-thirds</b> flowed straight back out to rights holders — which is why gross margin sat in the mid-20s% for a decade. Then the <b>2024 audiobook “bundle”</b> quietly cut the songwriter (mechanical) royalty and — with price hikes and podcast discipline — Spotify’s <b>keep</b> climbed from <b>$2.70 → $3.20</b> per $10.';

// — Hero: reported consolidated gross margin trajectory (20-F + Q1'26 deck).
// NON-monotonic: flat mid-20s% to 2021, dip in 2022 (peak podcast spend), breakout from 2024.
var GM_LABELS = ['2019','2020','2021','2022','2023','2024','2025','Q1’26'];
var GM_CONS   = [25.6, 25.6, 26.8, 24.9, 25.6, 30.1, 32.0, 33.0];   // consolidated (reported)
var GM_PREM   = [null, null, null, 28, 29, 33, 34, 34.8];           // Premium segment
var GM_ADS    = [null, null, null, 2,  4,  11, 17, 13.0];           // Ad-Supported segment

// — "Where does $10 go?" — per-$10 allocation of Premium revenue across cost buckets,
//   BEFORE (~2023, pre-bundle · GM ~27%) vs AFTER (2024–25 · GM ~32%). Amounts are
//   ILLUSTRATIVE — Spotify does not disclose per-format payouts; shares are anchored to
//   reported gross margins and the MIDIA royalty split (~56% recording / 14% publishing /
//   30% Spotify). The bundle cut ONLY the U.S. mechanical (songwriter) royalty; label
//   (master) royalties were untouched (separately negotiated direct deals).
function flowAlloc(state){
  if(state === 'after') return [
    { n:'Record labels',                    sub:'master recordings',            amt:5.20, col:'#E2574C' },
    { n:'Publishers &amp; songwriters',      sub:'mechanical + performance',     amt:1.15, col:'#E8A33D' },
    { n:'Payment &amp; other cost of rev.',  sub:'processing · cloud · delivery', amt:0.45, col:'#9AA3AF' },
    { n:'Spotify gross profit',             sub:'what Spotify keeps',           amt:3.20, col:'#1DB954' },
  ];
  return [
    { n:'Record labels',                    sub:'master recordings',            amt:5.20, col:'#E2574C' },
    { n:'Publishers &amp; songwriters',      sub:'mechanical + performance',     amt:1.50, col:'#E8A33D' },
    { n:'Payment &amp; other cost of rev.',  sub:'processing · cloud · delivery', amt:0.60, col:'#9AA3AF' },
    { n:'Spotify gross profit',             sub:'what Spotify keeps',           amt:2.70, col:'#1DB954' },
  ];
}

// — Why it matters, as big stat cards.
var WHY_STATS = [
  { l:'Value of 1 margin point', v:'≈ €170M', d:'on €17B revenue',          dir:'up' },
  { l:'2030 gross-margin target', v:'35–40%', d:'raised at 2026 Investor Day', dir:'up' },
  { l:'Paid to rights holders',   v:'$11B+',  d:'2025 · Loud & Clear',       dir:'muted' },
  { l:'First full-year profit',   v:'FY2024', d:'driven by margin, not subs', dir:'up' },
];

var PM_SOURCES = 'Sources: royalty split — MIDIA Research 2024 (≈56% recording / 14% publishing / 30% Spotify), via CBC (Mar 2025) & Music Business Worldwide. Bundle mechanics & mechanical-rate reduction (15.35% → under 12%): Billboard & Variety (May 2024); Spotify’s own Form 6-K disclosed €205M less paid to songwriters (Mar 2024–Mar 2025); NMPA estimated $150–230M first-year impact. Gross margin: Spotify Q4 2024 Shareholder Deck & 6-K (consolidated ~26.7% → 32.2%), Q1 2026 deck (33.0% record). The per-$10 and per-format splits are ILLUSTRATIVE — Spotify does not disclose payouts by format, and the publishing haircut is U.S.-specific. Also from Summit DCF models.';

// The $10 flow map — an inline-SVG Sankey (CSP-safe, no library). A single "$10 in"
// source on the left fans out into cost buckets on the right, each ribbon/node sized
// by its share of the $10. Labels are decluttered so thin buckets stay readable.
function flowSvg(state){
  var A = flowAlloc(state);
  var top = 24, flowH = 260, gap = 10;
  var sx1 = 96, sx2 = 112, tx1 = 360, tx2 = 376, lx = 388;
  var hs = A.map(function(a){ return a.amt / 10 * flowH; });
  var span = flowH + (A.length - 1) * gap;                 // full target span incl. gaps
  var srcTop = top + (span - flowH) / 2;                   // vertically centre the source
  var sy = [], acc = srcTop;  A.forEach(function(a, i){ sy[i] = acc; acc += hs[i]; });
  var ty = [], acc2 = top;    A.forEach(function(a, i){ ty[i] = acc2; acc2 += hs[i] + gap; });
  var lc = A.map(function(a, i){ return ty[i] + hs[i] / 2; });
  for(var i = 1; i < lc.length; i++){ if(lc[i] < lc[i-1] + 32) lc[i] = lc[i-1] + 32; }
  var mid = (sx2 + tx1) / 2, parts = '';
  // flow ribbons
  A.forEach(function(a, i){
    var y1t = sy[i], y1b = sy[i] + hs[i], y2t = ty[i], y2b = ty[i] + hs[i];
    parts += '<path d="M'+sx2+','+y1t.toFixed(1)+' C'+mid+','+y1t.toFixed(1)+' '+mid+','+y2t.toFixed(1)+' '+tx1+','+y2t.toFixed(1)+
      ' L'+tx1+','+y2b.toFixed(1)+' C'+mid+','+y2b.toFixed(1)+' '+mid+','+y1b.toFixed(1)+' '+sx2+','+y1b.toFixed(1)+' Z" '+
      'fill="'+a.col+'" opacity="0.42"><title>'+a.n+' — $'+a.amt.toFixed(2)+' ('+a.sub+')</title></path>';
  });
  // target nodes + decluttered labels
  A.forEach(function(a, i){
    var cy = ty[i] + hs[i] / 2, pct = Math.round(a.amt * 100) / 10;
    parts += '<rect x="'+tx1+'" y="'+ty[i].toFixed(1)+'" width="'+(tx2-tx1)+'" height="'+hs[i].toFixed(1)+'" rx="2" fill="'+a.col+'"/>';
    if(Math.abs(cy - lc[i]) > 1) parts += '<line x1="'+tx2+'" y1="'+cy.toFixed(1)+'" x2="'+(lx-4)+'" y2="'+lc[i].toFixed(1)+'" stroke="'+a.col+'" stroke-width="1" opacity="0.45"/>';
    parts += '<text x="'+lx+'" y="'+(lc[i]-2).toFixed(1)+'" class="flow-nm">'+a.n+'</text>'+
      '<text x="'+lx+'" y="'+(lc[i]+13).toFixed(1)+'" class="flow-amt" fill="'+a.col+'">$'+a.amt.toFixed(2)+'<tspan class="flow-pct"> · '+pct+'%</tspan></text>';
  });
  // source node
  parts += '<rect x="'+sx1+'" y="'+srcTop.toFixed(1)+'" width="'+(sx2-sx1)+'" height="'+flowH+'" rx="2" fill="#14181f"/>'+
    '<text x="'+((sx1+sx2)/2)+'" y="'+(srcTop-8).toFixed(1)+'" class="flow-src" text-anchor="middle">$10.00</text>'+
    '<text x="'+((sx1+sx2)/2)+'" y="'+(srcTop+flowH+16).toFixed(1)+'" class="flow-src-s" text-anchor="middle">Premium in</text>';
  return '<svg viewBox="0 0 640 330" class="flow-svg" role="img" aria-label="Where each $10 of Spotify Premium revenue goes, '+state+' the bundle">'+parts+'</svg>';
}

// BEFORE pane — the pre-bundle split of $10.
function beforePane(){
  return '<div class="spot-state" data-state="before">'+
    '<div class="spot-state-h">Pre-bundle (~2023): of every <b>$10</b>, about <b>$6.70</b> flowed straight back to rights holders. Spotify kept <b>$2.70</b> — a <b>27%</b> gross margin.</div>'+
    '<div class="flow-wrap">'+flowSvg('before')+'</div>'+
    '<div class="ov-statline">Music dominates the mix, so ~67% of revenue is a royalty toll — the reason gross margin sat in the mid-20s% for a decade.</div>'+
  '</div>';
}
// AFTER pane — the post-bundle split of $10.
function afterPane(){
  return '<div class="spot-state" data-state="after" hidden>'+
    '<div class="spot-state-h">Post-bundle (2024–25): the <b>songwriter (mechanical) royalty shrank</b>, the <b>label share didn’t move</b>. Spotify now keeps <b>$3.20</b> — a <b>32%</b> gross margin.</div>'+
    '<div class="flow-wrap">'+flowSvg('after')+'</div>'+
    '<div class="ov-statline">The bundle shaved ~<b>$0.35</b> off publishers (effective mechanical rate 15.35% → under 12%). With price hikes &amp; podcast discipline, Spotify’s keep rose <b>$2.70 → $3.20</b> per $10.</div>'+
  '</div>';
}
// The bundle-mechanism explainer.
function flowNote(){
  return '<div class="flow-note">'+
    '<div class="flow-note-h">🎧 Audiobooks in → lower songwriter royalty out</div>'+
    '<p>In <b>March 2024</b> Spotify added ~15 hrs/month of audiobooks to Premium and reclassified Premium/Duo/Family as a <b>“bundle”</b> under U.S. mechanical-royalty rules (Phonorecords IV). A bundle lets Spotify value the music slice at a discount <i>before</i> applying the ~15% publisher rate — so the <b>mechanical royalty to songwriters fell</b>. Crucially, <b>record-label (master) royalties were untouched</b> — those run on separately negotiated direct deals, not the statutory bundle rate.</p>'+
    '<div class="flow-note-stats">'+
      '<div class="flow-note-stat"><div class="flow-note-stat-v">€205M</div><div class="flow-note-stat-l">less paid to songwriters in year one — Spotify’s own Form 6-K (Mar’24–Mar’25)</div></div>'+
      '<div class="flow-note-stat"><div class="flow-note-stat-v">≈130 bps</div><div class="flow-note-stat-l">direct gross-margin lift from that reduction</div></div>'+
      '<div class="flow-note-stat"><div class="flow-note-stat-v">$150–230M</div><div class="flow-note-stat-l">NMPA’s estimate of the first-year songwriter impact</div></div>'+
    '</div>'+
  '</div>';
}

function productMixBody(c){
  var h = '';
  h += '<p class="ov-lede">'+PM_LEDE+'</p>';

  // 1 — THE HERO: the $10 flow map, before vs after the bundle
  h += sec('Follow $10 through Spotify — before vs after the bundle',
    '<div class="spot-toggle">'+
      '<button type="button" class="spot-tg active" data-state="before">Before bundle</button>'+
      '<button type="button" class="spot-tg" data-state="after">After bundle</button>'+
    '</div>'+
    beforePane()+afterPane());

  // 2 — What the bundle actually did (the mechanism)
  h += sec('What the “bundle” actually did', flowNote());

  // 3 — The result: gross margin by year
  h += sec('The result — gross margin by year',
    '<div class="ov-chart-card"><div class="ov-chart-t">Consolidated gross margin <span>(%, reported · green = post-mix breakout)</span></div>'+
      '<div class="ov-chart-wrap ovt-mix-wrap"><canvas id="spotGmChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">Flat in the mid-20s% for a decade → dipped in 2022 on podcast spend → broke out past 30% from 2024 → <b>33.0%</b> record in Q1’26.</div>');

  // 5 — Why it matters (stat cards)
  h += sec('Why it matters', kpis(WHY_STATS));

  h += '<div class="ov-foot">'+esc(PM_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — GENERAL  (nested sub-tabs: MAU · ARPU)
// ════════════════════════════════════════════════════════════════════════════
// All figures reported by Spotify (year-end point-in-time; Q1'26 = latest quarter).
// Total MAU is NOT the sum of Premium + Ad-Supported — Spotify reports them as
// separate, non-additive counts. Sources: FY2021–FY2025 Form 20-F KPI tables,
// Q1 2026 6-K, and Q1 2026 Shareholder Deck (p.7, p.9, p.14–15, p.20).

// ─── MAU sub-tab ────────────────────────────────────────────────────────────
var US_LEDE = 'Spotify’s flywheel is reach: a huge free, ad-supported audience that funnels into paying <b>Premium</b> subscribers. Users have compounded for years — total monthly listeners crossed <b>761M</b> in Q1’26, with <b>293M</b> paying. The two tiers grow together, but Premium is what monetizes.';

// Annual year-end + latest quarter. Premium + Ad-Supported are non-additive vs. MAU.
var US_LABELS  = ['2021','2022','2023','2024','2025','Q1’26'];
var US_MAU     = [406, 489, 602, 675, 751, 761];   // total monthly active users
var US_PREM    = [180, 205, 236, 263, 290, 293];   // paying Premium subscribers
var US_ADS     = [236, 295, 379, 425, 476, 483];   // ad-supported MAUs

// Headline KPIs — Q1'26 vs Q1'25 (year-over-year).
var US_KPIS = [
  { l:'Monthly active users', v:'761M', d:'+12.2% Y/Y',            dir:'up' },
  { l:'Premium subscribers',  v:'293M', d:'+9.3% Y/Y',             dir:'up' },
  { l:'Ad-Supported MAUs',    v:'483M', d:'+14.2% Y/Y',            dir:'up' },
  { l:'Premium ARPU',         v:'€4.76', d:'+5.7% Y/Y (const. FX)', dir:'up' },
];

var US_SOURCES = 'Sources: Spotify FY2021–FY2025 Form 20-F KPI tables; Q1 2026 Form 6-K (pp. 27–28); Q1 2026 Shareholder Deck (p.7 user metrics, p.9 ARPU, p.20 Q2’26 outlook). Figures in millions; ARPU in EUR per month. Total MAU is reported separately from Premium and Ad-Supported counts and is not their sum.';

// ─── Regional MAU dynamics ───────────────────────────────────────────────────
// IMPORTANT: Spotify discloses regional MAU only as a SHARE of total MAU + YoY
// growth (FY2023–FY2025); absolute per-region MAU is given for Europe only
// (FY23 169M, FY24 181M). The implied millions below = share% × total MAU — a
// close proxy (Europe checks to within ~1M of the disclosed figure). There is
// NO regional split for Premium subscribers or ARPU in any filing.
var REG_YEARS  = ['2023','2024','2025'];
var REG_TOTAL  = [602, 675, 751];           // total MAU, for implied millions
// Ordered largest→ by FY2025 share. mix = [FY23, FY24, FY25] share %.
var REGIONS = [
  { n:'Rest of World', col:'#8E5BD0', mix:[32,34,37], g:'+21%', note:'Largest & fastest-growing — but monetizes the least' },
  { n:'Europe',        col:'#1DB954', mix:[28,27,26], g:'+6%',  note:'Largest mature market · among the top global ad markets' },
  { n:'Latin America', col:'#E8A33D', mix:[21,22,21], g:'+10%', note:'Second-fastest growth · still early on monetization' },
  { n:'North America', col:'#3B82C4', mix:[19,17,16], g:'+3%',  note:'Most mature & slowest · among the top global ad markets' },
];
var REG_LEDE = 'Spotify’s growth is increasingly an <b>emerging-markets</b> story. The mix is shifting away from Europe &amp; North America — mature, high-monetization, top global ad markets — toward <b>Rest of World</b> and <b>Latin America</b>, its two fastest-growing regions, which today monetize <i>less</i> well. Combined, Europe + North America fell from <b>47% → 42%</b> of MAU (FY23→FY25). That shift is the single biggest reason ARPU is roughly flat — see the ARPU sub-tab.';
var REG_NOTE = 'Regional figures are FY2023–FY2025 (as of Dec 31). Spotify discloses region MAU only as a share of total + YoY growth; “implied” millions = share × total MAU. Premium subscribers and ARPU are not disclosed by region. Q1’26 has no regional split (management noted MAU growth led by Rest of World & North America; Premium adds led by Latin America & Europe). Source: Form 20-F MD&A (FY23 p.36, FY24 p.33, FY25 p.38) and Q1 2026 Shareholder Deck pp.14–15.';

// Region cards — reuse the .spot-fmt* "toll bar" components from Product Mix.
function regionCards(){
  return '<div class="spot-fmts">'+REGIONS.map(function(r){
    var share = r.mix[2];                       // FY2025 share %
    var impl  = Math.round(share/100*REG_TOTAL[2]); // implied millions
    return '<div class="spot-fmt">'+
      '<div class="spot-fmt-h">'+
        '<span class="spot-fmt-ic" style="color:'+r.col+'">'+
          '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg></span>'+
        '<span class="spot-fmt-n">'+esc(r.n)+'</span>'+
        '<span class="spot-fmt-tag">'+esc(r.g)+' Y/Y</span></div>'+
      '<div class="spot-fmt-track"><div class="spot-fmt-fill" style="width:'+share+'%;background:'+r.col+'"></div></div>'+
      '<div class="spot-fmt-note"><b>'+share+'%</b> of MAU · ~'+impl+'M implied — '+esc(r.note)+'</div>'+
    '</div>';
  }).join('')+'</div>'+
  '<div class="spot-axis"><span>← bigger share of users</span><span>FY2025</span></div>';
}

function mauBody(c){
  var h = '';
  h += '<p class="ov-lede">'+US_LEDE+'</p>';

  // 1 — Headline KPI cards
  h += kpis(US_KPIS);

  // 2 — Growth chart: three lines (MAU / Premium / Ad-Supported) over time
  h += sec('Users over time',
    '<div class="ov-chart-card"><div class="ov-chart-t">Monthly active users by tier <span>(millions · year-end, latest = Q1’26 · counts are non-additive)</span></div>'+
      '<div class="ov-chart-wrap ovt-users-wrap"><canvas id="spotUsersChart"></canvas></div>'+
      '<div class="ovt-legend">'+
        '<span class="ovt-lg"><i style="background:#1DB954"></i>Total MAU</span>'+
        '<span class="ovt-lg"><i style="background:#0E7C3A"></i>Premium subscribers</span>'+
        '<span class="ovt-lg"><i style="background:#9AA3AF"></i>Ad-Supported MAU</span>'+
      '</div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">Total listeners nearly <b>doubled</b> since 2021 (406M → 761M). Premium grew steadily to <b>293M</b>, while the free, ad-supported base expanded even faster — feeding the funnel.</div>');

  // 3 — Premium penetration
  h += sec('How many listeners pay', penetrationBar());

  // 4 — By region — different dynamics
  h += sec('Where the users are — by region',
    '<p class="ov-lede" style="margin-top:-2px">'+REG_LEDE+'</p>'+
    regionCards()+
    '<div class="ov-chart-card" style="margin-top:18px"><div class="ov-chart-t">MAU mix by region <span>(% of total MAU · FY2023 → FY2025 · 100% stacked)</span></div>'+
      '<div class="ov-chart-wrap ovt-region-wrap"><canvas id="spotRegionChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">The bars tilt purple over time: <b>Rest of World</b> climbs 32% → 37% of MAU while Europe + North America recede — more users, but from <b>lower-ARPU</b> markets.</div>'+
    '<div class="ov-foot">'+esc(REG_NOTE)+'</div>');

  h += '<div class="ov-foot">'+esc(US_SOURCES)+'</div>';
  return h;
}

// Premium penetration split bar — of every monthly listener, how many pay.
function penetrationBar(){
  var prem = 293, mau = 761, pct = Math.round(prem / mau * 1000) / 10; // 38.5%
  var rest = Math.round((100 - pct) * 10) / 10;
  return '<div class="spot-euro">'+
    '<div class="spot-euro-bar">'+
      '<div class="spot-euro-seg" style="width:'+pct+'%;background:#1DB954">'+pct+'%<small>Premium (paying)</small></div>'+
      '<div class="spot-euro-seg" style="width:'+rest+'%;background:#C9CFD8;color:#3A4654">'+rest+'%<small>Free listeners</small></div>'+
    '</div>'+
    '<div class="spot-euro-cap">Of Spotify’s <b>761M</b> monthly listeners, <b>293M (~'+pct+'%)</b> pay for Premium. The large free base is the funnel — Spotify’s own filings describe it as driving a <b>significant portion of gross Premium additions</b>. Lifting that conversion is a core part of the growth story.</div>'+
  '</div>';
}

// ─── ARPU sub-tab ────────────────────────────────────────────────────────────
var ARPU_LEDE = 'Premium <b>ARPU</b> (average revenue per user, €/month) is the second lever after subscriber count. It dipped through 2023 as Spotify scaled lower-priced plans and emerging markets, then recovered on the first-ever Premium <b>price increases</b> (2023–2025). Reported ARPU looks ~flat because a strong euro (FX) and the regional mix shift mask the underlying price-led growth — on a <b>constant-currency</b> basis ARPU rose <b>+5.7%</b> in Q1’26.';

var ARPU_LABELS = ['2021','2022','2023','2024','2025','Q1’26'];
var ARPU_VALS   = [4.29, 4.52, 4.39, 4.69, 4.63, 4.76];   // Premium ARPU, €/month

var ARPU_KPIS = [
  { l:'Premium ARPU (Q1’26)',   v:'€4.76', d:'+5.7% Y/Y (const. FX)',  dir:'up' },
  { l:'Reported Y/Y',           v:'~Flat', d:'FX & mix mask price gains', dir:'muted' },
  { l:'Premium ARPU (FY2025)',  v:'€4.63', d:'−1% Y/Y reported',        dir:'down' },
  { l:'First-ever price hikes', v:'2023→', d:'recurring Premium increases', dir:'up' },
];

// FY2024 → FY2025 ARPU walk (€4.69 → €4.63): price up, FX + mix down. (20-F p.50)
var ARPU_BRIDGE = [
  { l:'Price increases',      v:'+€0.25', d:'recurring Premium price hikes',        dir:'up' },
  { l:'FX (currency)',        v:'−€0.17', d:'strong euro vs. local currencies',     dir:'down' },
  { l:'Product & market mix', v:'−€0.14', d:'shift to lower-ARPU plans & regions',  dir:'down' },
  { l:'Net change FY2025',    v:'−€0.06', d:'€4.69 → €4.63',                        dir:'down' },
];

var ARPU_SOURCES = 'Sources: Spotify FY2021–FY2025 Form 20-F KPI tables (Premium ARPU, €/month); Q1 2026 6-K (p.28) and Shareholder Deck (p.9) for Q1’26 €4.76 and the constant-currency figure; FY2025 ARPU bridge from the FY2025 20-F (p.50). ARPU is reported for the Premium segment only; Spotify does not disclose ARPU by region. Per-market prices are Premium Individual list prices from Spotify Newsroom & support pages and press (CNBC, Variety, Music Business Worldwide, Android Authority, Spotify Newsroom, ~mid-2026); non-US USD figures are approximate FX conversions and move with currencies. Emerging-market local amounts (Nigeria, South Africa, Philippines) are best-estimate and less firmly confirmed than major markets.';

// Premium Individual monthly price by market, ordered most→least expensive in USD.
// USD figures are approximate FX conversions (~mid-2026) and swing with currencies.
var PRICE_ROWS = [
  { r:'Europe',            m:'United Kingdom', loc:'£12.99',  usd:16.75 },
  { r:'Europe (Eurozone)', m:'Germany',        loc:'€12.99',  usd:15.05 },
  { r:'Europe (Eurozone)', m:'France',         loc:'€11.99',  usd:13.90 },
  { r:'North America',     m:'United States',  loc:'$12.99',  usd:12.99, base:true },
  { r:'Oceania',           m:'Australia',      loc:'A$15.99', usd:10.55 },
  { r:'Latin America',     m:'Mexico',         loc:'MX$129',  usd:6.90 },
  { r:'East Asia',         m:'Japan',          loc:'¥980',    usd:6.50 },
  { r:'Latin America',     m:'Brazil',         loc:'R$21.90', usd:4.10 },
  { r:'Africa',            m:'South Africa',   loc:'R59.99',  usd:3.33 },
  { r:'Southeast Asia',    m:'Philippines',    loc:'₱169',    usd:2.90 },
  { r:'South Asia',        m:'India',          loc:'₹119',    usd:1.40 },
  { r:'Africa',            m:'Nigeria',        loc:'₦1,300',  usd:0.87 },
];

// Major Spotify Premium price increases (Individual plan, with other tiers noted).
var PRICE_HIST = [
  { d:'Jul 2023', m:'United States (first-ever) + ~50 markets',
    c:'Individual $9.99 → $10.99 (+$1). First US rise since the 2011 launch. Also Duo $12.99→$14.99, Family $15.99→$16.99, Student $4.99→$5.99.' },
  { d:'Jun–Jul 2024', m:'United States + many markets (incl. UK)',
    c:'Individual $10.99 → $11.99 (+$1). US Family $16.99→$19.99, Duo $14.99→$16.99. UK Individual ~£10.99→£11.99.' },
  { d:'Aug–Sep 2025', m:'International — Europe, UK, LatAm, Africa, APAC (NOT the US)',
    c:'Individual up ~8–9%. Eurozone €10.99→€11.99 (Germany a step higher to €12.99); UK £11.99→£12.99; Australia A$13.99→A$15.99.' },
  { d:'Jan 2026', m:'United States (eff. Feb 2026) + parts of S. America, Europe & Asia',
    c:'Individual $11.99 → $12.99 (+$1). US Family $19.99→$21.99, Duo $16.99→$18.99, Student $5.99→$6.99. Third US rise in ~4 years.' },
];

function priceTable(){
  var max = PRICE_ROWS[0].usd;
  var rows = PRICE_ROWS.map(function(p){
    var w = Math.max(4, Math.round(p.usd/max*100));
    return '<tr'+(p.base?' class="pr-base"':'')+'>'+
      '<td class="ov-td-name">'+esc(p.m)+(p.base?' <span class="pr-tag">base</span>':'')+'</td>'+
      '<td>'+esc(p.r)+'</td>'+
      '<td class="pr-num">'+esc(p.loc)+'</td>'+
      '<td class="pr-usd"><div class="pr-usdwrap"><span class="pr-track"><span class="pr-fill" style="width:'+w+'%"></span></span><b>$'+p.usd.toFixed(2)+'</b></div></td>'+
    '</tr>';
  }).join('');
  return '<div class="ov-chart-card"><table class="ov-table pr-table">'+
    '<thead><tr><th>Market</th><th>Region</th><th>Local price</th><th>≈ USD / month</th></tr></thead>'+
    '<tbody>'+rows+'</tbody></table></div>';
}

function priceHistTable(){
  return '<div class="ov-chart-card"><table class="ov-table pr-hist">'+
    '<thead><tr><th>When</th><th>Markets</th><th>What changed</th></tr></thead><tbody>'+
    PRICE_HIST.map(function(x){
      return '<tr><td class="ov-td-name">'+esc(x.d)+'</td><td class="pr-mkt">'+esc(x.m)+'</td><td>'+esc(x.c)+'</td></tr>';
    }).join('')+
    '</tbody></table></div>';
}

function arpuBody(c){
  var h = '';
  h += '<p class="ov-lede">'+ARPU_LEDE+'</p>';

  // 1 — Headline KPIs
  h += kpis(ARPU_KPIS);

  // 2 — ARPU trajectory chart
  h += sec('Premium ARPU over time',
    '<div class="ov-chart-card"><div class="ov-chart-t">Premium ARPU <span>(€/month · annual, latest = Q1’26 · axis starts at €4.00 to show the dip &amp; recovery)</span></div>'+
      '<div class="ov-chart-wrap ovt-arpu-wrap"><canvas id="spotArpuChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">€4.52 (2022) → dipped to <b>€4.39</b> (2023) on plan &amp; market mix → recovered to <b>€4.76</b> (Q1’26) as price increases outpaced FX headwinds.</div>');

  // 3 — The FY2025 ARPU bridge (why reported ARPU looks flat)
  h += sec('Why reported ARPU looks flat — the FY2025 bridge', kpis(ARPU_BRIDGE));

  // 4 — Premium price by region (the ARPU story in one table)
  h += sec('What Premium costs around the world',
    priceTable()+
    '<div class="ov-statline" style="margin-top:10px">The spread <i>is</i> the ARPU story: mature markets sit at <b>$13–17/mo</b> while emerging markets run <b>$1–7</b>. Because Spotify’s user growth is led by low-price regions, blended Premium ARPU stays near <b>€4.76</b> even as headline prices keep rising. Non-US USD figures are approximate FX conversions (~mid-2026).</div>');

  // 5 — Price-increase history
  h += sec('Price-increase history',
    priceHistTable()+
    '<div class="ov-statline" style="margin-top:10px">Spotify held prices flat for over a decade, then began raising them in <b>2023</b>. The US has now risen <b>three times in ~4 years</b> ($9.99 → $12.99), while 2025’s big move was international-only.</div>');

  h += '<div class="ov-foot">'+esc(ARPU_SOURCES)+'</div>';
  return h;
}

// (The old "General" tab shell that wrapped MAU / ARPU / vs Netflix / Advertising is gone —
// those four bodies are now sub-panes of Deep Dive ▸ Top Line, wired by the shared
// `.ovt-subtab` convention. Nothing was lost; only the wrapper moved.)

// ════════════════════════════════════════════════════════════════════════════
// vs NETFLIX  (sub-tab of General) — context on the streaming/subscription space
// ════════════════════════════════════════════════════════════════════════════
var NF_LEDE = 'Spotify and Netflix are the two scaled subscription-media platforms — but they monetize <b>opposite</b> ways. Spotify plays for <b>reach</b>: ~760M listeners at low ARPU, monetizing only the Premium slice. Netflix plays for <b>value</b>: fewer, higher-paying members at roughly <b>2.5× the ARPU</b>. The charts below track how that scale-vs-monetization split has evolved — the metrics that actually separate them.';

// Diverging-bar comparison. sv/nv are the numeric magnitudes used for bar widths.
var VS_ROWS = [
  { m:'Paid subscribers', u:'millions',         s:'293M',   sv:293,  n:'325M',   nv:325,  note:'Spotify Premium (Q1’26) vs Netflix “crossed 325M” (FY2025 milestone). Netflix stopped reporting quarterly subs in 2025.' },
  { m:'Monthly ARPU',     u:'per subscriber',   s:'€4.76',  sv:4.76, n:'$11.70', nv:11.70,note:'Netflix global ARM (FY2024, last reported) ≈ 2.5× Spotify Premium ARPU. EUR vs USD — not converted.' },
  { m:'Revenue',          u:'fiscal year 2025', s:'€17.2B', sv:17.2, n:'~$45B',  nv:45,   note:'Spotify FY2025 €17.2B (+10%) vs Netflix FY2025 ~$45B (+16%). EUR vs USD.' },
];

// MAU / subscribers & ARPU time series (FY2019–FY2025) for the trend charts.
// Spotify MAU = total reach (free+paid); Spotify Premium = paying subs; Netflix
// = paid memberships (Netflix reports no MAU). Netflix FY2025 = "crossed 325M".
var VS_YEARS     = ['2019','2020','2021','2022','2023','2024','2025'];
var VS_SPOT_MAU  = [271, 345, 406, 489, 602, 675, 751];
var VS_SPOT_SUBS = [124, 155, 180, 205, 236, 263, 290];
var VS_NFLX_SUBS = [167, 204, 222, 231, 260, 302, 325];
// Monthly ARPU: Spotify Premium ARPU (€) vs Netflix global ARM ($, last reported FY2024).
var VS_SPOT_ARPU = [4.89, 4.31, 4.40, 4.55, 4.39, 4.72, 4.76];
var VS_NFLX_ARPU = [10.82, 10.91, 11.67, 11.76, 11.64, 11.70, null];

var VS_SOURCES = 'Sources: Netflix Q4’24 & Q4’25 shareholder letters and FY2024 10-K (memberships, global ARM $11.70, revenue, margins, FCF); Spotify FY2025 6-K and Q1 2026 materials; market data via stockanalysis.com (≈ Jun 2026). Netflix discontinued quarterly subscriber & ARM reporting in Q1 2025 — its latest official ARM is FY2024 and FY2025 membership is a milestone (“crossed 325M”). Netflix does not report MAU, so Spotify’s 761M reach is not directly comparable. Figures in native currency (EUR vs USD) — not FX-converted, so treat absolute €/$ comparisons as approximate. MAU/subscriber and ARPU time series compiled from Spotify and Netflix annual filings & shareholder letters (FY2019–FY2025); FY2025 Netflix membership is the “crossed 325M” milestone and its ARM is last reported for FY2024. Churn figures are management commentary (Spotify: Premium churn “at record lows”) and third-party panel estimates (Netflix ~2%/month), not standardized reported metrics.';

function vsRows(){
  return VS_ROWS.map(function(r){
    var max = Math.max(r.sv, r.nv);
    var sw = Math.max(5, Math.round(r.sv/max*100)), nw = Math.max(5, Math.round(r.nv/max*100));
    return '<div class="spot-vs-row">'+
      '<div class="spot-vs-v s">'+esc(r.s)+'</div>'+
      '<div class="spot-vs-track">'+
        '<div class="spot-vs-half l"><span class="spot-vs-fill s" style="width:'+sw+'%"></span></div>'+
        '<div class="spot-vs-mid">'+esc(r.m)+'<small>'+esc(r.u)+'</small></div>'+
        '<div class="spot-vs-half r"><span class="spot-vs-fill n" style="width:'+nw+'%"></span></div>'+
      '</div>'+
      '<div class="spot-vs-v n">'+esc(r.n)+'</div>'+
    '</div>'+
    '<div class="spot-vs-note">'+esc(r.note)+'</div>';
  }).join('');
}

function vsTrendCharts(){
  return '<div class="ov-chart-card"><div class="ov-chart-t">Users &amp; subscribers over time <span>(millions, FY-end · Spotify MAU is total reach; Netflix reports paid memberships, not MAU)</span></div>'+
      '<div class="ov-chart-wrap spot-vsc-wrap"><canvas id="spotVsUsersChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-chart-card" style="margin-top:14px"><div class="ov-chart-t">Monthly ARPU over time <span>(per subscriber · Spotify € vs Netflix $, not FX-converted · Netflix ARM last reported FY2024)</span></div>'+
      '<div class="ov-chart-wrap spot-vsc-wrap"><canvas id="spotVsArpuChart"></canvas></div>'+
    '</div>';
}

// Churn commentary — neither company reports a standardized quarterly churn rate.
var VS_CHURN = [
  { co:'Spotify', col:'#1DB954', t:'Premium churn near record lows',
    d:'Spotify doesn’t publish a fixed churn rate, but management repeatedly cites Premium churn at <b>all-time lows</b>. Music is a habitual, lean-back subscription — once it’s in your daily routine, retention is high, which is why Premium subs compound steadily even with ARPU roughly flat.' },
  { co:'Netflix', col:'#E50914', t:'Among the lowest churn in streaming',
    d:'Netflix is <b>widely estimated at ~2% monthly churn</b> (US, third-party panels) — best-in-class for streaming. Owned, must-watch franchises plus the 2023 paid-sharing crackdown keep cancellations low; Netflix no longer discloses churn directly.' },
];

function vsChurn(){
  return '<div class="spot-models">'+VS_CHURN.map(function(m){
    return '<div class="spot-model" style="border-top:3px solid '+m.col+'">'+
      '<div class="spot-model-h"><span class="spot-model-co" style="color:'+m.col+'">'+esc(m.co)+'</span></div>'+
      '<div class="spot-model-t">'+esc(m.t)+'</div>'+
      '<div class="spot-model-d">'+m.d+'</div>'+
    '</div>';
  }).join('')+'</div>';
}

function vsBody(c){
  var h = '';
  h += '<p class="ov-lede">'+NF_LEDE+'</p>';
  h += sec('Spotify vs Netflix — where they stand today',
    '<div class="spot-vs">'+
      '<div class="spot-vs-head"><span class="spot-vs-co s">● Spotify</span><span class="spot-vs-co n">Netflix ●</span></div>'+
      vsRows()+
    '</div>');
  h += sec('How MAU &amp; ARPU have evolved',
    vsTrendCharts()+
    '<div class="ov-statline" style="margin-top:12px"><b>Reading it:</b> Spotify’s <b>total reach</b> (MAU) is roughly 2× Netflix’s subscriber base and still climbing — but Spotify only monetizes the <b>Premium</b> slice, which tracks close to Netflix on subscriber count. ARPU is the whole story: Netflix earns <b>~2.5×</b> per subscriber. The metrics aren’t identical — Netflix reports paying members (no MAU), and its ARM is in USD, last reported FY2024.</div>');
  h += sec('What about churn?', vsChurn());
  h += '<div class="ov-foot">'+esc(VS_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// ADVERTISING  (sub-tab of General) — the ad strategy, rebuilt around programmatic
// ════════════════════════════════════════════════════════════════════════════
var AD_LEDE = 'Spotify’s ad business is being <b>rebuilt from the ground up</b>. The old model — owned podcasts (Megaphone) and direct, fixed-CPM sales — drove ad gross margin into a <b>2% trough in 2022</b>. Since 2023 Spotify cut podcast costs and pivoted to <b>programmatic, biddable</b> buying via the <b>Spotify Ad Exchange (SAX)</b>. Biddable is now <b>over a third</b> of ad revenue — but the transition is causing a near-term revenue dip (−5% reported in Q1’26, +3% constant-currency).';

var AD_KPIS = [
  { l:'Ad-Supported revenue (Q1’26)', v:'€385M', d:'−5% rep · +3% const. FX', dir:'muted' },
  { l:'Ad gross margin (FY2025)',     v:'18%',   d:'recovered from 2% in 2022', dir:'up' },
  { l:'Biddable / automated',         v:'>⅓',    d:'of ad revenue · growing fast', dir:'up' },
  { l:'Ad % of total revenue',        v:'11%',   d:'FY2025 · Premium is the rest', dir:'muted' },
];

// Ad-Supported gross margin vs Premium gross margin (%, FY2021–FY2025).
// FY2021 ad margin is web-sourced/approx; 2022 not recast for the 2026 reclassification.
var AD_LABELS  = ['2021','2022','2023','2024','2025'];
var AD_GM      = [10, 2, 4, 12, 18];     // Ad-Supported gross margin %
var AD_PREM_GM = [29, 28, 29, 33, 34];   // Premium gross margin % (contrast)

var AD_TIMELINE = [
  ['2019',     'Podcast land-grab — Gimlet, Anchor, Parcast to lift ad monetization beyond music'],
  ['2020',     'Buys Megaphone ($235M) — dynamic ad insertion & publisher tools'],
  ['2021',     'Streaming Ad Insertion + Spotify Audience Network (SAN) marketplace'],
  ['2022',     'Podcast overspend → ad gross margin bottoms at 2%'],
  ['2023',     'Restructuring & podcast cost cuts — margin still just 4%'],
  ['2024',     'Cost discipline lifts ad margin to 12%; pivot to automated buying'],
  ['Apr 2025', 'Spotify Ad Exchange (SAX) launches — programmatic, real-time biddable'],
  ['2025–26',  'Biddable becomes the model — now >⅓ of ad revenue'],
];

var AD_SAX_INTRO = 'Launched <b>April 1, 2025</b>, the Spotify Ad Exchange is a <b>programmatic marketplace</b> that lets advertisers buy Spotify’s audio, video and display inventory through <b>real-time biddable auctions</b> — plugging Spotify into the same automated pipes advertisers already use everywhere else. Monthly active advertisers on SAX have grown <b>+222%</b> since launch (+68% Y/Y in Q1’26).';

var AD_SAX_GROUPS = [
  { g:'Launch DSPs',  items:['The Trade Desk','Google DV360','Magnite'] },
  { g:'Added since',  items:['Yahoo DSP','Adform','~50 DSPs total'] },
  { g:'Identity',     items:['Unified ID 2.0','LiveRamp RampID','Google PAIR'] },
  { g:'Measurement',  items:['DoubleVerify','IAS','AppsFlyer','Kochava'] },
  { g:'Inventory',    items:['Audio','Video','Display','Programmatic Guaranteed'] },
];

var AD_QUOTES = [
  { q:'After a year and a half of rebuilding, the foundation is now in place.', a:'Alex Norström, Co-CEO' },
  { q:'The market shifted with advertisers favoring biddable buying. We had to evolve to capture that TAM. So we rebuilt our stack end-to-end. While this creates short-term pressure, it unlocks a much larger opportunity.', a:'Alex Norström, Co-CEO' },
  { q:'We expect improved growth in the second half of 2026 as our biddable channels continue to scale.', a:'Christian Luiga, CFO' },
];

var AD_SOURCES = 'Sources: Spotify FY2025 Form 20-F (Ad-Supported segment, MD&A & “Spotify Ad Exchange”, pp. 8, 44, 47–48, Note 23); Q1 2026 6-K (Note 20 segment information) & Shareholder Deck (advertising transformation); Q1 2026 earnings call prepared remarks (quotes). SAX partners and the +222% advertiser growth are web-corroborated (Spotify Newsroom, AdExchanger, eMarketer, The Trade Desk). FY2021 ad gross margin is web-sourced/approximate; figures are €/IFRS and a Jan 1 2026 reclassification moved some non-advertising activity to Premium (2023–2025 restated; 2022 not recast).';

function adChips(){
  return AD_SAX_GROUPS.map(function(grp){
      return '<div class="spot-chipgrp"><div class="spot-chipgrp-l">'+esc(grp.g)+'</div><div class="spot-chips">'+
        grp.items.map(function(it){ return '<span class="spot-chip">'+esc(it)+'</span>'; }).join('')+'</div></div>';
    }).join('');
}

function adBiddableBar(){
  return '<div class="spot-euro">'+
    '<div class="spot-euro-bar">'+
      '<div class="spot-euro-seg" style="width:35%;background:#1DB954">&gt;⅓<small>Biddable / programmatic</small></div>'+
      '<div class="spot-euro-seg" style="width:65%;background:#C9CFD8;color:#3A4654">~⅔<small>Legacy direct sales</small></div>'+
    '</div>'+
    '<div class="spot-euro-cap">Automated/biddable channels are now <b>over a third</b> of ad revenue and growing fast, while the <b>legacy direct-sales</b> channel stays “choppy.” That mix-shift is <i>why</i> reported ad revenue dipped −5% in Q1’26 even as the new channels grew +30%+ — the new engine isn’t yet big enough to offset the old one shrinking.</div>'+
  '</div>';
}

// ── SAX deep-dive: narrative, auction schematic, and before/after ────────────
var SAX_NARR =
  '<p class="sax-lead">Launched <b>April 1, 2025</b>, the <b>Spotify Ad Exchange (SAX)</b> is Spotify’s own programmatic marketplace: it auctions Spotify’s audio, video and display inventory in <b>real time</b> to the ~50 DSPs advertisers already use. Biddable is already <b>over a third of ad revenue</b> (advertisers <b>+222% since launch</b>). <b>Tap any box below</b> to see what it does and the players involved.</p>';

// One impression's journey through a real-time auction on SAX.
var SAX_STEPS = [
  'A listener opens Spotify and an <b>ad slot opens up</b>. SAX packages that one impression as a <b>bid request</b> carrying anonymised audience and context signals.',
  'SAX <b>broadcasts the impression</b> in real time to the ~50 connected DSPs.',
  'Each DSP <b>values the impression</b> using the advertiser’s own first-party data, matched through identity graphs (UID2 / RampID / PAIR), and returns a <b>bid</b>.',
  'SAX runs a <b>real-time auction</b> and picks the winning bid — the whole auction clears in <b>milliseconds</b>, before the ad even plays.',
  'The winning <b>ad is served</b> to the listener — as audio, video or display.',
  'Independent <b>measurement</b> partners verify delivery, viewability and outcomes, feeding results back so the next bid is smarter.'
];

// What biddable/SAX changes versus the legacy, direct-sold model.
var SAX_CMP = [
  ['How you buy',      'Manual insertion orders via a Spotify salesperson', 'Self-serve and automated through any connected DSP'],
  ['Pricing',          'Fixed, negotiated CPMs',                            'Real-time auction sets a market-clearing price'],
  ['Speed to live',    'Days to weeks of human back-and-forth',             'Minutes, programmatically'],
  ['Targeting',        'Broad segments Spotify defines',                    'Advertiser’s own first-party data via UID2 / RampID / PAIR'],
  ['Measurement',      'Spotify-reported metrics',                          'Independent third parties (DoubleVerify, IAS, AppsFlyer, Kochava)'],
  ['Access and scale', 'Gated by Spotify’s direct sales team',              'Bought alongside all other media in one workflow, at scale'],
];

var SAX_CHANGE_NOTE = 'The shift is structural: Spotify goes from being <b>a place you buy directly</b> to <b>a node on the open programmatic grid</b>. That widens the pool of advertisers who can reach Spotify and strips out friction — but it also <b>swaps fixed CPMs for auction pricing</b>. That is exactly why reported ad revenue dipped in the short term (−5% in Q1’26) even as biddable volume grew 30%+: the new auction-priced engine is not yet big enough to offset the shrinking legacy direct-sold book.';

// Interactive supply-chain schematic (Trade Desk IR style). Each box and base
// layer is clickable and drives the detail panel below with a one-line explainer
// plus the players involved, shown with their logos.
var SAX_NODES = {
  adv:  { t:'Advertiser', brief:'The brand and its budget — the demand that kicks off every auction. Any advertiser or agency can buy Spotify through the tools they already use.', players:[] },
  dsp:  { t:'DSP — demand-side platform', brief:'Where buyers set targeting and bids. SAX connects to ~50 DSPs, so advertisers buy Spotify inside their existing workflow.',
    players:[ {n:'The Trade Desk',d:'thetradedesk.com'}, {n:'Google DV360',d:'google.com'}, {n:'Yahoo DSP',d:'yahooinc.com'}, {n:'Adform',d:'adform.com'}, {n:'Magnite',d:'magnite.com'} ] },
  sax:  { t:'Spotify Ad Exchange (SAX)', brief:'Spotify’s own marketplace. It runs the real-time auction that matches buyer demand to Spotify’s inventory in milliseconds, before the ad plays.',
    players:[ {n:'Spotify',d:'spotify.com'} ] },
  inv:  { t:'Spotify inventory', brief:'The Spotify ad slots put up for auction — sold programmatically across every format.', players:[], types:['Audio','Video','Display','Programmatic Guaranteed'] },
  usr:  { t:'Listener', brief:'The Spotify user who hears or sees the winning ad — served instantly once the auction resolves.', players:[] },
  id:   { t:'Identity layer', brief:'Matches a listener to the advertiser’s first-party data without third-party cookies, so targeting works across the open internet.',
    players:[ {n:'Unified ID 2.0',d:'thetradedesk.com'}, {n:'LiveRamp RampID',d:'liveramp.com'}, {n:'Google PAIR',d:'google.com'} ] },
  meas: { t:'Measurement layer', brief:'Independent third parties verify that ads were delivered, viewable and effective — so Spotify isn’t marking its own homework.',
    players:[ {n:'DoubleVerify',d:'doubleverify.com'}, {n:'IAS',d:'integralads.com'}, {n:'AppsFlyer',d:'appsflyer.com'}, {n:'Kochava',d:'kochava.com'} ] }
};
var SAX_DETAIL_DEFAULT = '<div class="sax-detail-hint">Tap any box or layer above for a quick explainer and the companies involved.</div>';

// Logo chip — Clearbit by domain, falling back to a Google favicon (both allowed by CSP).
function saxLogo(p){
  var fav = 'https://www.google.com/s2/favicons?domain='+p.d+'&sz=64';
  return '<span class="sax-logo"><img src="https://logo.clearbit.com/'+p.d+'" alt="" loading="lazy" '+
    'onerror="this.onerror=null;this.src=\''+fav+'\'">'+esc(p.n)+'</span>';
}

function saxDetailHtml(key){
  var n = SAX_NODES[key];
  if(!n) return SAX_DETAIL_DEFAULT;
  var body = '';
  if(n.players && n.players.length) body = '<div class="sax-logos">'+n.players.map(saxLogo).join('')+'</div>';
  else if(n.types) body = '<div class="sax-logos">'+n.types.map(function(t){ return '<span class="sax-logo is-plain">'+esc(t)+'</span>'; }).join('')+'</div>';
  return '<div class="sax-detail-t">'+esc(n.t)+'</div><div class="sax-detail-d">'+esc(n.brief)+'</div>'+body;
}

function saxSchematic(){
  function node(k,t,s){ return '<div class="ttd-node" role="button" tabindex="0" data-sax="'+k+'"><b>'+t+'</b><span>'+s+'</span></div>'; }
  return '<div class="ttd-flow">'+
    '<div class="ttd-zones"><span>Demand · buy-side</span><span class="r">Supply · sell-side</span></div>'+
    '<div class="ttd-track">'+
      node('adv','Advertiser','Brand &amp; budget')+
      node('dsp','DSP','TTD · DV360 · ~50')+
      '<div class="ttd-hub" role="button" tabindex="0" data-sax="sax"><b>SAX</b><span>Real-time auction</span></div>'+
      node('inv','Spotify','Audio · Video · Display')+
      node('usr','Listener','Impression served')+
    '</div>'+
    '<div class="ttd-base">'+
      '<div class="ttd-base-cell" role="button" tabindex="0" data-sax="id"><span class="ttd-base-l">Identity layer</span>Unified ID 2.0 · RampID · PAIR</div>'+
      '<div class="ttd-base-cell" role="button" tabindex="0" data-sax="meas"><span class="ttd-base-l">Measurement layer</span>DoubleVerify · IAS · AppsFlyer · Kochava</div>'+
    '</div>'+
    '<div class="sax-detail" id="saxDetail">'+SAX_DETAIL_DEFAULT+'</div>'+
  '</div>';
}

function saxSteps(){
  return '<div class="sax-steps">'+SAX_STEPS.map(function(s,i){
    return '<div class="sax-step"><div class="sax-step-n">'+(i+1)+'</div><div class="sax-step-b">'+s+'</div></div>';
  }).join('')+'</div>';
}

function saxChanges(){
  var head = '<div class="sax-cmp-head"><div class="sp"></div>'+
    '<div class="old">Legacy direct sales</div><div class="new">Biddable via SAX</div></div>';
  var rows = SAX_CMP.map(function(r){
    return '<div class="sax-cmp-row">'+
      '<div class="sax-cmp-k">'+esc(r[0])+'</div>'+
      '<div class="sax-cell old"><span class="sax-tag old">Before</span>'+esc(r[1])+'</div>'+
      '<div class="sax-cell new"><span class="sax-tag new">Now</span>'+esc(r[2])+'</div>'+
    '</div>';
  }).join('');
  return '<div class="sax-cmp">'+head+rows+'</div>';
}

function adTimeline(){
  return '<div class="ov-timeline">'+AD_TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div>'+
      '<div class="ov-tl-yr">'+esc(t[0])+'</div>'+
      '<div class="ov-tl-body">'+esc(t[1])+'</div></div>';
  }).join('')+'</div>';
}
function adQuotes(){
  return '<div class="spot-quotes">'+AD_QUOTES.map(function(q){
    return '<blockquote class="spot-quote">'+esc(q.q)+'<cite>'+esc(q.a)+'</cite></blockquote>';
  }).join('')+'</div>';
}
function advertisingBody(c){
  var h = '';
  h += '<p class="ov-lede">'+AD_LEDE+'</p>';
  h += kpis(AD_KPIS);

  // 1 — WHY the rebuild happened: the margin trough and the climb out of it.
  h += sec('The margin story — why the ad stack had to be rebuilt',
    '<div class="ov-chart-wrap ovt-admargin-wrap"><canvas id="spotAdMarginChart"></canvas></div>'+
    '<p class="sax-note">Ad-Supported gross margin (bars, coloured by health) against Premium (line) for contrast. The <b>2% trough in 2022</b> is the podcast-overspend era; the recovery to <b>18%</b> is cost discipline plus the shift to automated buying. Ads still earn roughly half of Premium\'s margin — which is why an 11%-of-revenue segment gets this much management attention.</p>');

  // 2 — How it got here.
  h += sec('How the ad business got here', adTimeline());

  // 3 — SAX: what it is + interactive flow (click a box for the players) + who is plugged in.
  h += sec('Spotify Ad Exchange (SAX) — the new engine',
    '<p class="ov-lede">'+AD_SAX_INTRO+'</p>'+
    SAX_NARR + saxSchematic()+
    '<div style="margin-top:16px">'+adChips()+'</div>');

  // 4 — What it changes vs the old way of buying
  h += sec('What SAX changes vs the old model',
    saxChanges()+
    '<p class="sax-note">'+SAX_CHANGE_NOTE+'</p>');

  // 5 — Where the mix stands today
  h += sec('The pivot — biddable is now over a third of ad revenue', adBiddableBar());

  // 6 — Management on the record.
  h += sec('Management on the rebuild', adQuotes());

  h += '<div class="ov-foot">'+esc(AD_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// TAB — INVESTOR DAY 2026  (top-level, very visual)
// ════════════════════════════════════════════════════════════════════════════
// All figures are from Spotify's Investor Day 2026 recap (newsroom, May 21 2026),
// the Q1 2026 earnings call, and press corroboration. The ~1GB Investor Day deck
// PDF could not be parsed, so nothing here is read from the slides directly.
var ID_THEME = 'Raising Ambition for the Next Era of Media';
var ID_WHEN  = 'May 21, 2026 · Co-CEOs Alex Norström & Gustav Söderström · CFO Christian Luiga';

// The 2030 plan — from → to target cards.
var ID_TARGETS = [
  { l:'Gross margin',     now:'32%',  goal:'35–40%',       d:'by 2030 · up from 25% in 2022' },
  { l:'Operating margin', now:'~13%', goal:'20%+',         d:'by 2030 · up from −6% in 2022' },
  { l:'Revenue growth',   now:'~18%', goal:'mid-teens %',  d:'CAGR through 2030 (constant FX)' },
  { l:'Free cash flow',   now:'~€3B', goal:'sustained ↑',  d:'new headline KPI: FCF per share' },
];

// The directional "North Star" (reaffirmed from 2022 — no committed date).
var ID_NORTH = [
  { v:'€100B', l:'long-term revenue ambition' },
  { v:'40%+',  l:'long-term gross margin' },
  { v:'1B',    l:'subscribers — the North Star' },
];

var ID_PILLARS = [
  { ic:'⚡', t:'Power-law monetization', d:'Not one mega-tier — a stack of higher-ARPU add-ons (audiobooks, AI, fitness) for distinct niches.' },
  { ic:'🧠', t:'The generative (AI) era', d:'From Access → Personalization → Generation. A “Large Taste Model” trained on 3.4 trillion daily taste signals.' },
  { ic:'👥', t:'Multiplayer Spotify', d:'Passive → interactive, single-player → multiplayer: Jam, Blend, Wrapped Party, Messaging.' },
  { ic:'⏱️', t:'Time Well Spent', d:'Engagement philosophy — more days, devices and content types — driving retention and lifetime value.' },
  { ic:'🤝', t:'Deeper creator & live', d:'Record $11B+ paid to rights holders in 2025 ($70B+ all-time); live & fan-connection as differentiation.' },
];

// Each card is clickable → opens a visual explainer (newsDetailHtml). Fields:
//   d = short blurb on the card · icon/tagline/what = the explainer · facts = stat
//   chips · viz = a small inline visual ('flow' | 'tiles' | 'stack').
var ID_NEWS = [
  { tag:'Surprise',   t:'No “Super Premium” tier',
    d:'Against market expectations, Spotify chose the power-law add-on approach over a single high-priced tier.',
    icon:'🧩', tagline:'À-la-carte add-ons over one pricey tier',
    what:'The market expected a single expensive “Super Premium” plan. Instead, Spotify keeps standard Premium as the price anchor and monetizes power users through modular add-ons they buy individually — AI remix, Audiobooks+, superfan perks. It’s a “power-law” bet: a small share of superfans spend a lot, without raising the price for everyone else.',
    facts:[ {k:'Approach',v:'À-la-carte'}, {k:'Base price',v:'Unchanged'}, {k:'Upside',v:'Superfans'} ],
    viz:{ type:'stack' } },
  { tag:'AI',         t:'AI music creation & remix',
    d:'Landmark licensing with Universal Music Group & UMPG lets fans legally make AI covers/remixes — consent, credit, compensation. Launches as a paid Premium add-on.',
    icon:'🎛️', tagline:'Legal AI covers & remixes, built on consent',
    what:'A landmark licensing deal with Universal Music Group and UMPG lets fans legally create AI covers and remixes of real, licensed songs. It rests on three principles — consent (artists opt in), credit, and compensation (artists get paid) — and ships as a paid Premium add-on rather than a free feature.',
    facts:[ {k:'Partners',v:'UMG · UMPG'}, {k:'Principles',v:'Consent · Credit · Pay'}, {k:'Pricing',v:'Premium add-on'} ],
    viz:{ type:'flow', steps:[ {ic:'🎵',l:'Licensed track'}, {ic:'🤖',l:'Fan makes AI remix'}, {ic:'✅',l:'Artist consent · credit · pay'} ] } },
  { tag:'Superfans',  t:'Reserved by Spotify',
    d:'Premium superfans get 2 tour tickets held before general on-sale. Launches summer 2026 in the U.S. with Live Nation.',
    icon:'🎟️', tagline:'2 concert tickets held for superfans',
    what:'Spotify uses its listening data to spot an artist’s true superfans and reserves 2 concert tickets for them before the public on-sale — turning streaming engagement into real-world access. It launches summer 2026 in the U.S. in partnership with Live Nation.',
    facts:[ {k:'Tickets',v:'2 reserved'}, {k:'Launch',v:'Summer 2026'}, {k:'Market',v:'U.S.'}, {k:'Partner',v:'Live Nation'} ],
    viz:{ type:'flow', steps:[ {ic:'🎧',l:'Superfan identified'}, {ic:'🎟️',l:'2 tickets reserved'}, {ic:'⭐',l:'Buy before general on-sale'} ] } },
  { tag:'Audiobooks', t:'Audiobooks+ scaling',
    d:'On track for $100M annualized recurring revenue by July 2026 — 700k+ titles, 22 markets, +60% listening hours ’24→’25.',
    icon:'📚', tagline:'Marching toward $100M ARR',
    what:'Audiobooks+ has become a real business inside Spotify. Management says it’s on track to reach $100M in annualized recurring revenue by July 2026, powered by a deep catalog, wide reach, and fast-growing engagement — higher-margin content that lifts overall gross margin.',
    facts:[ {k:'ARR target',v:'$100M by Jul ’26'} ],
    viz:{ type:'tiles', tiles:[
      {ic:'📖',t:'700k+ titles',d:'A catalog rivaling dedicated audiobook apps.'},
      {ic:'🌍',t:'22 markets',d:'Live and expanding across regions.'},
      {ic:'📈',t:'+60% hours',d:'Listening hours grew ’24 → ’25.'} ] } },
  { tag:'AI',         t:'Studio by Spotify',
    d:'Creator/AI labs (research preview, 20+ markets), plus Podcast Memberships and new audiobook creation tools.',
    icon:'🛠️', tagline:'A creator & AI toolkit',
    what:'Studio by Spotify brings Spotify’s creator-facing tools together in one place, including AI-powered “labs” now in a research preview across 20+ markets. It adds Podcast Memberships (recurring revenue for podcasters) and new audiobook-creation tools — deepening Spotify’s role as a platform creators build on, not just distribute through.',
    facts:[ {k:'Stage',v:'Research preview'}, {k:'Reach',v:'20+ markets'} ],
    viz:{ type:'tiles', tiles:[
      {ic:'🧪',t:'Creator AI labs',d:'Experimental AI tools for creators.'},
      {ic:'🎙️',t:'Podcast Memberships',d:'Recurring revenue for podcasters.'},
      {ic:'📗',t:'Audiobook creation',d:'New tools to produce audiobooks.'} ] } },
  { tag:'Engagement', t:'Beyond music',
    d:'Fitness hub with Peloton content; DJ at 94M users; Taste Profile beta — widening “time well spent”.',
    icon:'🎧', tagline:'Widening “time well spent”',
    what:'Spotify is pushing engagement beyond music to keep users in the app longer. A new fitness hub brings in Peloton content, the AI DJ has reached 94M users, and a Taste Profile beta gives listeners a clearer view of their own tastes — all aimed at more “time well spent” and lower churn.',
    facts:[ {k:'AI DJ',v:'94M users'} ],
    viz:{ type:'tiles', tiles:[
      {ic:'🏃',t:'Fitness hub',d:'Workouts with Peloton content.'},
      {ic:'🎚️',t:'AI DJ',d:'94M users and growing.'},
      {ic:'🫧',t:'Taste Profile',d:'Beta — see your own listening taste.'} ] } },
];

var ID_SOURCES = 'Sources: Spotify Newsroom — Investor Day 2026 recap & co-CEO remarks (May 21, 2026); Q1 2026 earnings call prepared remarks (baseline figures); press corroboration (Fortune, Inderes, Globe and Mail). NOTE: the official Investor Day presentation PDF was too large to parse, so figures here come from Spotify’s published recap and the earnings materials, not the slides themselves. “North Star” items (€100B revenue, 40%+ gross margin, 1B subscribers) are directional ambitions with no committed date; sources differ on whether the 1B goal is users or subscribers.';

function idTargets(){
  return '<div class="spot-tgts">'+ID_TARGETS.map(function(t){
    return '<div class="spot-tgt">'+
      '<div class="spot-tgt-l">'+esc(t.l)+'</div>'+
      '<div class="spot-tgt-row"><span class="spot-tgt-now">'+esc(t.now)+'</span>'+
        '<span class="spot-tgt-arr">→</span>'+
        '<span class="spot-tgt-goal">'+esc(t.goal)+'</span></div>'+
      '<div class="spot-tgt-d">'+esc(t.d)+'</div>'+
    '</div>';
  }).join('')+'</div>'+
  '<div class="spot-axis"><span>where it is today</span><span>2030 target →</span></div>';
}

function idNorth(){
  return '<div class="spot-north">'+
    '<div class="spot-north-h">The North Star <small>directional ambition · no committed date</small></div>'+
    '<div class="spot-north-row">'+ID_NORTH.map(function(n){
      return '<div class="spot-north-cell"><div class="spot-north-v">'+esc(n.v)+'</div><div class="spot-north-l">'+esc(n.l)+'</div></div>';
    }).join('')+'</div></div>';
}

function idPenetration(){
  return '<div class="spot-euro">'+
    '<div class="spot-euro-bar">'+
      '<div class="spot-euro-seg" style="width:3.5%;background:#1DB954;min-width:62px">3.5%<small>subscribe</small></div>'+
      '<div class="spot-euro-seg" style="width:96.5%;background:#C9CFD8;color:#3A4654">96.5%<small>still to win</small></div>'+
    '</div>'+
    '<div class="spot-euro-cap">Only <b>~3.5% of the world</b> subscribes to Spotify today (293M of ~8B people). Management framed the runway bluntly: <b>“96% left to win over.”</b> The 1-billion-subscriber North Star is the long-term expression of that gap.</div>'+
  '</div>';
}

function idPillars(){
  return '<div class="spot-pillars">'+ID_PILLARS.map(function(p){
    return '<div class="spot-pillar"><div class="spot-pillar-ic">'+p.ic+'</div>'+
      '<div class="spot-pillar-t">'+esc(p.t)+'</div><div class="spot-pillar-d">'+esc(p.d)+'</div></div>';
  }).join('')+'</div>';
}

var NEWS_DETAIL_DEFAULT = '<div class="spot-news-hint">Tap any announcement above for a visual explainer of what it is and why it matters.</div>';

// Small inline visuals for the news explainer — CSP-safe HTML/SVG, no libraries.
function newsViz(v){
  if(!v) return '';
  if(v.type === 'flow') return '<div class="spot-nflow">'+v.steps.map(function(s,i){
    return (i ? '<span class="spot-nflow-arr">→</span>' : '')+
      '<div class="spot-nflow-step"><span class="spot-nflow-ic">'+s.ic+'</span>'+
      '<span class="spot-nflow-l">'+esc(s.l)+'</span></div>';
  }).join('')+'</div>';
  if(v.type === 'tiles') return '<div class="spot-ntiles">'+v.tiles.map(function(t){
    return '<div class="spot-ntile"><span class="spot-ntile-ic">'+t.ic+'</span>'+
      '<div class="spot-ntile-t">'+esc(t.t)+'</div><div class="spot-ntile-d">'+esc(t.d)+'</div></div>';
  }).join('')+'</div>';
  if(v.type === 'stack') return '<div class="spot-nstack">'+
    '<div class="spot-nstack-col"><div class="spot-nstack-cap">What the market expected</div>'+
      '<div class="spot-nstack-tier">One pricey<br>“Super Premium” tier</div></div>'+
    '<div class="spot-nstack-vs">vs</div>'+
    '<div class="spot-nstack-col"><div class="spot-nstack-cap">What Spotify chose</div>'+
      '<div class="spot-nstack-addon">＋ Superfan perks</div>'+
      '<div class="spot-nstack-addon">＋ Audiobooks+</div>'+
      '<div class="spot-nstack-addon">＋ AI remix</div>'+
      '<div class="spot-nstack-base">Premium base (unchanged)</div></div>'+
  '</div>';
  return '';
}

function newsDetailHtml(i){
  var n = ID_NEWS[i];
  if(!n) return NEWS_DETAIL_DEFAULT;
  var facts = (n.facts && n.facts.length) ? '<div class="spot-nfacts">'+n.facts.map(function(f){
    return '<div class="spot-nfact"><span class="spot-nfact-k">'+esc(f.k)+'</span>'+
      '<span class="spot-nfact-v">'+esc(f.v)+'</span></div>';
  }).join('')+'</div>' : '';
  return '<div class="spot-nd-head"><span class="spot-nd-ic">'+(n.icon || '✨')+'</span>'+
      '<div><span class="spot-news-tag">'+esc(n.tag)+'</span>'+
      '<div class="spot-nd-t">'+esc(n.t)+'</div>'+
      (n.tagline ? '<div class="spot-nd-tag">'+esc(n.tagline)+'</div>' : '')+'</div></div>'+
    '<div class="spot-nd-what">'+esc(n.what || n.d)+'</div>'+
    newsViz(n.viz)+
    facts;
}

function idNews(){
  var cards = '<div class="spot-news">'+ID_NEWS.map(function(n,i){
    return '<div class="spot-newscard is-clickable" role="button" tabindex="0" data-news="'+i+'" aria-label="'+esc(n.t)+' — open explainer">'+
      '<span class="spot-news-tag">'+esc(n.tag)+'</span>'+
      '<div class="spot-news-t">'+(n.icon ? '<span class="spot-news-ic">'+n.icon+'</span> ' : '')+esc(n.t)+'</div>'+
      '<div class="spot-news-d">'+esc(n.d)+'</div>'+
      '<span class="spot-news-more">Tap to explore →</span>'+
    '</div>';
  }).join('')+'</div>';
  return cards + '<div class="spot-news-detail" id="newsDetail">'+NEWS_DETAIL_DEFAULT+'</div>';
}

function investorDayBody(c){
  var h = '';
  h += '<div class="spot-hero">'+
    '<div class="spot-hero-badge">Investor Day · May 2026</div>'+
    '<div class="spot-hero-t">'+esc(ID_THEME)+'</div>'+
    '<div class="spot-hero-d">'+esc(ID_WHEN)+'</div>'+
  '</div>';
  h += sec('The 2030 plan', idTargets());
  h += idNorth();
  h += sec('How big is the runway?', idPenetration());
  h += sec('Five strategic pillars', idPillars());
  h += sec('What’s new — products & announcements', idNews());
  h += '<div class="ov-foot">'+esc(ID_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// SENSITIVITY — price-increase → valuation, driven off the Summit DCF
// ════════════════════════════════════════════════════════════════════════════
// Base figures are the Summit DCF FY2026 projection (snapshot 2026-05-22, EUR m)
// plus a live SPOT reference price. The model: a $Δ/mo price rise on premium subs
// in the selected regions → incremental revenue (net of churn & realization) →
// incremental EBIT (flow-through) → after-tax FCF → capitalized as a growing
// perpetuity (WACC, g) → Δ equity value → Δ per share vs the current price.
// Per-region premium-subscriber splits are an ANALYST ASSUMPTION (the DCF does not
// break subscribers out by region); base local prices reuse the ARPU-tab table.
var SENS_BASE = {
  fx:      1.08,    // EUR→USD (1 EUR = 1.08 USD)
  shares:  206.6,   // m, DCF FY2026
  price:   473.65,  // USD, live SPOT reference
  tax:     0.12,    // DCF FY2026 tax rate
  premRev: 17852,   // €m, DCF FY2026 Premium revenue
  fcf:     3357,    // €m, DCF FY2026 free cash flow
  // subs in millions (assumption); price = approx USD headline / mo (ARPU tab)
  regions: [
    { key:'eu',    name:'Europe',        subs:123, price:13.50 },
    { key:'na',    name:'North America', subs:77,  price:12.99 },
    { key:'latam', name:'Latin America', subs:68,  price:5.50  },
    { key:'row',   name:'Rest of World', subs:40,  price:3.50  },
  ],
  netCash: 6000,   // €m, approx net cash — used to bridge EV → equity for EV multiples
  // Summit DCF projection_history (snapshot 2026-05-22, €m). EBITDA = adj. EBITDA.
  fwd: {
    years:    [2026, 2027, 2028, 2029, 2030],
    fcf:      [3357, 4119, 5246, 6533, 7983],
    ebitda:   [3250, 4048, 5171, 6455, 7900],
    rev:      [19775, 22958, 26605, 30489, 34889],
    earnings: [2760, 3076, 4080, 5182, 6440],
    shares:   [206.6, 202.8, 198.9, 198.9, 198.9],
  },
};
var SENS_DEF = { dPrice:1, real:65, margin:55, churn:1, wacc:9, g:3, mult:22, year:2027, metric:'ebitda' };

function sensMoney(eurM){ // €m in → "$X.XB" / "$XXXm" USD
  var usd = eurM * SENS_BASE.fx;
  return usd>=1000 ? '$'+(usd/1000).toFixed(2)+'B' : '$'+Math.round(usd)+'m';
}
function sensEur(eurM){ return eurM>=1000 ? '€'+(eurM/1000).toFixed(2)+'B' : '€'+Math.round(eurM)+'m'; }

// Core calc. p = {dPrice, real, margin, churn (per $1), wacc, g, regions:{key:bool}}
function sensCalc(p){
  var B = SENS_BASE, dRevUsd = 0;
  B.regions.forEach(function(r){
    if(!p.regions[r.key]) return;
    var churnFrac = Math.min(0.9, (p.churn/100) * p.dPrice);   // subs lost
    var retained  = r.subs * (1 - churnFrac);
    dRevUsd += retained * p.dPrice * 12 * (p.real/100);         // $m / yr
  });
  var dRevEur = dRevUsd / B.fx;
  var dEbit   = dRevEur * (p.margin/100);
  var dFcf    = dEbit * (1 - B.tax);
  var denom   = Math.max(0.005, (p.wacc/100) - (p.g/100));
  var dEv     = dFcf * (1 + p.g/100) / denom;                  // €m
  var dPsEur  = dEv / B.shares;
  var dPsUsd  = dPsEur * B.fx;
  return { dRevUsd:dRevUsd, dRevEur:dRevEur, dFcf:dFcf, dEv:dEv,
           dPsUsd:dPsUsd, newPrice:B.price + dPsUsd, upside:dPsUsd / B.price };
}

// Forward-multiple valuation: apply a chosen multiple to a forward-year metric
// (EV/EBITDA, P/FCF or EV/Sales), before and after the price increase.
function sensCalcMult(p){
  var B = SENS_BASE, F = B.fwd;
  var i = F.years.indexOf(p.year); if(i < 0) i = 0;
  var shares = F.shares[i];
  var dRev = sensCalc(p).dRevEur;                 // €m incremental revenue (today's subs)
  var dEbitda = dRev * (p.margin/100);
  var dFcf = dEbitda * (1 - B.tax);
  var metric, dMetric, isEV, lbl;
  if(p.metric === 'fcf')        { metric=F.fcf[i];      dMetric=dFcf;    isEV=false; lbl='P/FCF'; }
  else if(p.metric === 'pe')    { metric=F.earnings[i]; dMetric=dFcf;    isEV=false; lbl='P/E'; }
  else if(p.metric === 'sales') { metric=F.rev[i];      dMetric=dRev;    isEV=true;  lbl='EV/Sales'; }
  else                          { metric=F.ebitda[i];   dMetric=dEbitda; isEV=true;  lbl='EV/EBITDA'; }
  var nc = isEV ? B.netCash : 0;
  var eqBase = p.mult*metric + nc, eqNew = p.mult*(metric+dMetric) + nc;
  var tb = eqBase*B.fx/shares, tn = eqNew*B.fx/shares;
  return { i:i, lbl:lbl, isEV:isEV, metric:metric, dMetric:dMetric, shares:shares,
           tgtBase:tb, tgtNew:tn, dShare:tn-tb, upBase:tb/B.price-1, upNew:tn/B.price-1 };
}

// Read the live control values out of the DOM.
function sensRead(root){
  var g = function(id){ return root.querySelector('#'+id); };
  var regions = {};
  root.querySelectorAll('.sens-region').forEach(function(b){
    regions[b.getAttribute('data-region')] = b.classList.contains('active');
  });
  var msel = g('sensMetric'), ysel = g('sensYear'), msl = g('sensMult');
  var wa = g('sensWacc'), gg = g('sensG');
  return {
    dPrice: parseFloat(g('sensPrice').value),
    real:   parseFloat(g('sensReal').value),
    margin: parseFloat(g('sensMargin').value),
    churn:  parseFloat(g('sensChurn').value),
    wacc:   wa ? parseFloat(wa.value) : SENS_DEF.wacc,
    g:      gg ? parseFloat(gg.value) : SENS_DEF.g,
    method: 'mult',
    metric: msel ? msel.value : SENS_DEF.metric,
    year:   ysel ? parseInt(ysel.value, 10) : SENS_DEF.year,
    mult:   msl ? parseFloat(msl.value) : SENS_DEF.mult,
    regions: regions,
  };
}

// Sensitivity grid — axes depend on the valuation method.
function sensHeat(p){
  var shade = function(up, cap){ var a=Math.max(0,Math.min(1,up/cap)); return 'rgba(29,185,84,'+(0.08+a*0.55).toFixed(2)+')'; };
  if(p.method === 'mult'){
    // multiple (rows) × forward year (cols) → target price ($, incl. the increase)
    var mults = [15,20,25,30,35], years = SENS_BASE.fwd.years;
    var rows = mults.map(function(m){
      var tds = years.map(function(y){
        var r = sensCalcMult(Object.assign({}, p, { mult:m, year:y }));
        var cur = (m === Math.round(p.mult/5)*5 && y === p.year) ? ' sens-heat-cur' : '';
        return '<td class="sens-heat-v'+cur+'" style="background:'+shade(r.upNew,0.6)+'">$'+r.tgtNew.toFixed(0)+'</td>';
      }).join('');
      return '<tr><th>'+m+'×</th>'+tds+'</tr>';
    }).join('');
    return '<table class="sens-heat-tbl"><thead><tr><th>×mult \\ FY</th>'+
      years.map(function(y){ return '<th>'+y+'</th>'; }).join('')+'</tr></thead><tbody>'+rows+'</tbody></table>';
  }
  // perpetuity: WACC (rows) × price increase (cols) → % upside
  var waccs = [7,8,9,10,11], prices = [0.5,1,1.5,2];
  var cells = waccs.map(function(w){
    var tds = prices.map(function(dp){
      var r = sensCalc(Object.assign({}, p, { wacc:w, dPrice:dp }));
      var cur = (w===Math.round(p.wacc) && dp===p.dPrice) ? ' sens-heat-cur' : '';
      return '<td class="sens-heat-v'+cur+'" style="background:'+shade(r.upside,0.35)+'">'+(r.upside>=0?'+':'')+(r.upside*100).toFixed(0)+'%</td>';
    }).join('');
    return '<tr><th>'+w+'%</th>'+tds+'</tr>';
  }).join('');
  return '<table class="sens-heat-tbl"><thead><tr><th>WACC \\ +$/mo</th>'+
    prices.map(function(dp){ return '<th>+$'+dp.toFixed(2)+'</th>'; }).join('')+'</tr></thead>'+
    '<tbody>'+cells+'</tbody></table>';
}

// Recompute everything and paint the outputs + heatmap.
function sensUpdate(root){
  if(!root) return;
  var p = sensRead(root);
  // reflect slider values in their little value badges
  var setv = function(id,txt){ var e=root.querySelector('#'+id+'V'); if(e) e.textContent=txt; };
  setv('sensPrice', '+$'+p.dPrice.toFixed(2)); setv('sensReal', p.real+'%');
  setv('sensMargin', p.margin+'%'); setv('sensChurn', p.churn.toFixed(1)+'% / $1');
  setv('sensWacc', p.wacc+'%'); setv('sensG', p.g+'%');

  setv('sensMult', p.mult+'×');
  // keep the method buttons + control groups in sync
  root.querySelectorAll('.sens-method button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-method')===p.method); });
  var pg = root.querySelector('#sensPerpCtrls'), mg = root.querySelector('#sensMultCtrls');
  if(pg) pg.hidden = (p.method !== 'perp');
  if(mg) mg.hidden = (p.method !== 'mult');

  var cards;
  if(p.method === 'mult'){
    var m = sensCalcMult(p);
    var ctx = p.mult+'× '+m.lbl+' · FY'+p.year;
    cards = [
      { l:'Δ '+m.lbl.split('/')[1]+' · FY'+p.year, v:sensMoney(m.dMetric), s:'from the price rise'+(m.isEV?'':' (equity)') },
      { l:'Base target price',   v:'$'+m.tgtBase.toFixed(0), s:ctx+(m.isEV?' + net cash':''), big:true },
      { l:'Target with +$'+p.dPrice.toFixed(2), v:'$'+m.tgtNew.toFixed(0), s:'incl. the price increase', big:true, up:true },
      { l:'Upside',              v:(m.upNew>=0?'+':'')+(m.upNew*100).toFixed(1)+'%', s:'vs $'+SENS_BASE.price.toFixed(0)+' today', up:m.upNew>=0 },
      { l:'Δ from price rise',   v:'+$'+m.dShare.toFixed(2), s:'per share' },
      { l:'Base upside (no rise)', v:(m.upBase>=0?'+':'')+(m.upBase*100).toFixed(1)+'%', s:'the multiple alone' },
    ];
  } else {
    var r = sensCalc(p);
    cards = [
      { l:'Δ Revenue / yr',        v:sensMoney(r.dRevEur), s:sensEur(r.dRevEur)+' · '+(r.dRevEur/SENS_BASE.premRev*100).toFixed(1)+'% of Premium rev' },
      { l:'Δ Free cash flow / yr', v:sensMoney(r.dFcf),    s:sensEur(r.dFcf)+' · after-tax, flow-through' },
      { l:'Δ Equity value',        v:sensMoney(r.dEv),     s:sensEur(r.dEv)+' · capitalized at WACC−g' },
      { l:'Δ Value / share',       v:'+$'+r.dPsUsd.toFixed(2), s:'on '+SENS_BASE.shares+'m shares' },
      { l:'Implied share price',   v:'$'+r.newPrice.toFixed(0), s:'from $'+SENS_BASE.price.toFixed(0)+' today', big:true },
      { l:'Upside',                v:(r.upside>=0?'+':'')+(r.upside*100).toFixed(1)+'%', s:'vs current price', big:true, up:r.upside>=0 },
    ];
  }
  var out = root.querySelector('#sensOut');
  if(out){
    out.innerHTML = cards.map(function(c){
      return '<div class="sens-card'+(c.big?' is-big':'')+(c.up?' is-up':'')+'">'+
        '<div class="sens-card-l">'+esc(c.l)+'</div>'+
        '<div class="sens-card-v">'+esc(c.v)+'</div>'+
        '<div class="sens-card-s">'+esc(c.s)+'</div></div>';
    }).join('');
  }
  var heat = root.querySelector('#sensHeat');
  if(heat) heat.innerHTML = sensHeat(p);
}

function sensSlider(id, label, min, max, step, def, unitHint){
  return '<div class="spl-item">'+
    '<div class="spl-head"><label for="'+id+'">'+esc(label)+'</label><span class="spl-val" id="'+id+'V"></span></div>'+
    '<input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+def+'">'+
    (unitHint?'<div class="spl-hint">'+esc(unitHint)+'</div>':'')+
  '</div>';
}

function sensPriceBody(c){
  var h = '';

  // Region toggles
  h += sec('1 · Which regions raise price?',
    '<div class="sens-regions">'+SENS_BASE.regions.map(function(r){
      return '<button type="button" class="sens-region active" data-region="'+r.key+'">'+
        '<span class="sens-region-n">'+esc(r.name)+'</span>'+
        '<span class="sens-region-d">'+r.subs+'m subs · ~$'+r.price.toFixed(2)+'/mo</span></button>';
    }).join('')+'</div>'+
    '<div class="ov-statline" style="margin-top:10px">Premium subscribers by region are an <b>analyst split</b> (the DCF carries only the aggregate); base prices reuse the ARPU-tab table. Toggle regions on/off.</div>');

  // Price levers (shared by both valuation methods)
  h += sec('2 · Price levers',
    '<div class="spl-grid">'+
      sensSlider('sensPrice','Price increase',   0, 3, 0.5, SENS_DEF.dPrice,  'Extra $/month per subscriber')+
      sensSlider('sensReal', 'Revenue realization',30,100,5, SENS_DEF.real,   'How much of the headline $ actually reaches ARPU (student / trials / promo)')+
      sensSlider('sensMargin','Incremental margin',30,90,5, SENS_DEF.margin,  'Flow-through of the extra revenue to EBIT / EBITDA (price hikes are highly accretive)')+
      sensSlider('sensChurn','Churn sensitivity', 0, 5, 0.5, SENS_DEF.churn,  '% of a region’s subs lost per +$1/mo')+
    '</div>');

  // Valuation method — perpetuity or forward multiple on a chosen year
  var yearOpts = SENS_BASE.fwd.years.map(function(y){
    return '<option value="'+y+'"'+(y===SENS_DEF.year?' selected':'')+'>FY'+y+'</option>'; }).join('');
  h += sec('3 · Forward-multiple valuation',
    '<div id="sensMultCtrls">'+
      '<div class="sens-selrow">'+
        '<div class="sens-sel"><label for="sensMetric">Multiple type</label><select id="sensMetric">'+
          '<option value="ebitda" selected>EV / EBITDA</option><option value="fcf">P / FCF</option><option value="pe">P / E</option><option value="sales">EV / Sales</option>'+
        '</select></div>'+
        '<div class="sens-sel"><label for="sensYear">Forward year</label><select id="sensYear">'+yearOpts+'</select></div>'+
      '</div>'+
      '<div class="spl-grid">'+
        sensSlider('sensMult','Multiple (×)', 5, 50, 1, SENS_DEF.mult, 'Applied to the chosen forward-year metric (from the Summit DCF) to set the valuation')+
      '</div>'+
    '</div>');

  // Outputs
  h += sec('Impact on valuation', '<div class="sens-out" id="sensOut"></div>');

  // Heatmap
  h += sec('Sensitivity grid',
    '<div class="sens-heat-wrap" id="sensHeat"></div>'+
    '<div class="ov-statline" style="margin-top:10px">Each cell is the implied <b>target price</b> across <b>multiple (rows) × forward year (cols)</b>, including the selected price increase and holding the other levers fixed. Your current selection is outlined.</div>');

  h += '<div class="ov-foot">Base: Summit DCF SPOT model (snapshot 2026-05-22) — FY2026 Premium revenue €17.9B, FCF €3.4B, 12% tax; forward FY2026–30 FCF / EBITDA / revenue / shares from the DCF projection; live SPOT reference $473.65; EUR→USD 1.08. Forward-multiple mode applies your multiple to the chosen forward-year metric, bridging EV multiples to equity with ~€6B net cash (approx). Regional premium-subscriber splits and per-region base prices are analyst assumptions layered on the DCF (Spotify does not disclose subscribers or ARPU by region). This is a simplified single-driver sensitivity, not the full multi-year DCF. Data sourced from Summit DCF models.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// SENSITIVITY · sub-tab 2 — "INVESTOR DAY TARGETS"
// ════════════════════════════════════════════════════════════════════════════
// Scenario: overlay Spotify's 2030 Investor Day targets onto the Summit DCF, build
// the 2030 target P&L, then value the company AT DEC-2029 by applying a user multiple
// to the FY2030 forward metric (in Dec-2029 the market discounts the next year, 2030).
// The sensitivity lever is that Dec-2029 multiple.
//   • Revenue 2030   = FY2025 revenue compounded at a mid-teens CAGR (adjustable).
//   • Gross margin   = 35–40% target (adjustable).       Operating margin = 20%+ (adjustable).
//   • FCF margin     = "sustained ↑" target (adjustable).
//   • Net cash @2029 = 2026 net cash + cumulative DCF FCF (2026–29) − buybacks.
var IDT_REV2025  = 17200;   // €m, Spotify FY2025 revenue (actual)
var IDT_DAPCT    = 2.6;     // D&A+ as % of revenue → adj. EBITDA = EBIT + rev×DAPCT (ties DCF 2030)
var IDT_BUYBACK  = 6000;    // €m, est. capital returned 2026–29 (buybacks + exchangeable notes)
var IDT_YEARS    = 3.42;    // yrs from today (Jul 2026) to Dec 2029, for the annualized return
var IDT_DEF      = { cagr:15, gm:37.5, om:20, fcfm:22, tax:12, metric:'ebit', mult:22 };
// Sensible default multiple per metric (used when the metric select changes).
var IDT_MULTDEF  = { sales:5, ebitda:18, ebit:22, pe:30, fcf:28 };

// Build the 2030 target scenario + the Dec-2029 valuation for a set of assumptions.
function idtScenario(p){
  var B = SENS_BASE, F = B.fwd;
  var shares = F.shares[3];                                  // FY2029 shares (198.9m)
  var rev  = IDT_REV2025 * Math.pow(1 + p.cagr/100, 5);      // €m, FY2030 revenue
  var gp   = rev * (p.gm/100);
  var ebit = rev * (p.om/100);
  var ebitda = ebit + rev * (IDT_DAPCT/100);
  var ni   = ebit * (1 - p.tax/100);                        // €m (approx; ignores net interest)
  var fcf  = rev * (p.fcfm/100);
  var eps  = ni / shares;                                   // €/sh
  var cumFcf   = F.fcf[0] + F.fcf[1] + F.fcf[2] + F.fcf[3]; // 2026–2029 DCF FCF
  var netCash  = B.netCash + cumFcf - IDT_BUYBACK;          // €m, net cash @ Dec-2029
  // pick the multiple's metric
  var metric, isEV, lbl;
  if(p.metric === 'pe')        { metric = ni;     isEV = false; lbl = 'P/E'; }
  else if(p.metric === 'fcf')  { metric = fcf;    isEV = false; lbl = 'P/FCF'; }
  else if(p.metric === 'sales'){ metric = rev;    isEV = true;  lbl = 'EV/Sales'; }
  else if(p.metric === 'ebitda'){ metric = ebitda; isEV = true; lbl = 'EV/EBITDA'; }
  else                         { metric = ebit;   isEV = true;  lbl = 'EV/EBIT'; }
  var ev     = p.mult * metric;                            // €m — EV or equity depending on metric
  var equity = isEV ? ev + netCash : ev;                   // €m
  var pxUsd  = (equity / shares) * B.fx;                   // $/sh at Dec-2029
  var upside = pxUsd / B.price - 1;
  var irr    = Math.pow(pxUsd / B.price, 1 / IDT_YEARS) - 1;
  return { rev:rev, gp:gp, ebit:ebit, ebitda:ebitda, ni:ni, fcf:fcf, eps:eps,
           netCash:netCash, shares:shares, lbl:lbl, isEV:isEV, metric:metric,
           ev:ev, equity:equity, pxUsd:pxUsd, upside:upside, irr:irr };
}

// Grid column axis adapts to the selected metric's main driver.
function idtDriver(metric, cur){
  if(metric === 'fcf')   return { key:'fcfm', label:'FCF margin', cols:[cur.fcfm-2, cur.fcfm, cur.fcfm+2, cur.fcfm+4] };
  if(metric === 'sales') return { key:'cagr', label:'Rev CAGR',   cols:[cur.cagr-2, cur.cagr-1, cur.cagr, cur.cagr+1, cur.cagr+2] };
  return { key:'om', label:'Op. margin', cols:[cur.om-2, cur.om, cur.om+2, cur.om+4] };
}

// Sensitivity grid: Dec-2029 multiple (rows) × the metric's driver margin (cols) → implied price.
function idtHeat(p){
  var shade = function(px){ var a = Math.max(0, Math.min(1, (px/SENS_BASE.price - 1) / 1.5)); return 'rgba(29,185,84,'+(0.08 + a*0.55).toFixed(2)+')'; };
  var mults = [-4, -2, 0, 2, 4, 6].map(function(d){ return Math.max(1, Math.round((p.mult + d)*2)/2); });
  var curM  = Math.round(p.mult*2)/2;
  var drv   = idtDriver(p.metric, p);
  var curC  = p[drv.key];
  var head  = '<th>×mult \\ '+esc(drv.label)+'</th>'+drv.cols.map(function(c){ return '<th>'+c.toFixed(0)+'%</th>'; }).join('');
  var rows  = mults.map(function(m){
    var tds = drv.cols.map(function(c){
      var pp = Object.assign({}, p, { mult:m }); pp[drv.key] = c;
      var r = idtScenario(pp);
      var cur = (m === curM && c === curC) ? ' sens-heat-cur' : '';
      return '<td class="sens-heat-v'+cur+'" style="background:'+shade(r.pxUsd)+'">$'+r.pxUsd.toFixed(0)+'</td>';
    }).join('');
    return '<tr><th>'+m.toFixed(1)+'×</th>'+tds+'</tr>';
  }).join('');
  return '<table class="sens-heat-tbl"><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table>';
}

function idtRead(root){
  var g = function(id){ return root.querySelector('#'+id); };
  var mt = g('idtMetric');
  return {
    cagr:   parseFloat(g('idtCagr').value),
    gm:     parseFloat(g('idtGm').value),
    om:     parseFloat(g('idtOm').value),
    fcfm:   parseFloat(g('idtFcfm').value),
    tax:    g('idtTax') ? parseFloat(g('idtTax').value) : IDT_DEF.tax,
    metric: mt ? mt.value : IDT_DEF.metric,
    mult:   parseFloat(g('idtMult').value),
  };
}

function idtUpdate(root){
  if(!root) return;
  var p = idtRead(root);
  var setv = function(id, txt){ var e = root.querySelector('#'+id+'V'); if(e) e.textContent = txt; };
  setv('idtCagr', p.cagr.toFixed(1)+'%'); setv('idtGm', p.gm.toFixed(1)+'%');
  setv('idtOm', p.om.toFixed(1)+'%');     setv('idtFcfm', p.fcfm.toFixed(1)+'%');
  setv('idtTax', p.tax.toFixed(0)+'%');   setv('idtMult', p.mult.toFixed(1)+'×');
  var s = idtScenario(p);

  // 2030 target P&L readout
  var pnl = root.querySelector('#idtPnl');
  if(pnl){
    var line = [
      { l:'Revenue',            v:sensMoney(s.rev),    s:p.cagr.toFixed(1)+'% CAGR from FY2025' },
      { l:'Gross profit',       v:sensMoney(s.gp),     s:p.gm.toFixed(1)+'% margin' },
      { l:'Operating income',   v:sensMoney(s.ebit),   s:p.om.toFixed(1)+'% margin (EBIT)' },
      { l:'Adj. EBITDA',        v:sensMoney(s.ebitda), s:'EBIT + D&A' },
      { l:'Net income',         v:sensMoney(s.ni),     s:'at '+p.tax.toFixed(0)+'% tax' },
      { l:'Free cash flow',     v:sensMoney(s.fcf),    s:p.fcfm.toFixed(1)+'% margin' },
      { l:'EPS',                v:'$'+(s.eps*SENS_BASE.fx).toFixed(2), s:'on '+s.shares+'m shares' },
    ];
    pnl.innerHTML = line.map(function(c){
      return '<div class="idt-pnl-cell"><div class="idt-pnl-l">'+esc(c.l)+'</div>'+
        '<div class="idt-pnl-v">'+esc(c.v)+'</div><div class="idt-pnl-s">'+esc(c.s)+'</div></div>';
    }).join('');
  }

  // Dec-2029 valuation cards
  var cards = [
    { l:'Implied price · Dec 2029', v:'$'+s.pxUsd.toFixed(0), s:p.mult.toFixed(1)+'× '+s.lbl+' on FY2030', big:true, up:true },
    { l:'Upside vs today',          v:(s.upside>=0?'+':'')+(s.upside*100).toFixed(0)+'%', s:'vs $'+SENS_BASE.price.toFixed(0)+' today', big:true, up:s.upside>=0 },
    { l:'Annualized return',        v:(s.irr>=0?'+':'')+(s.irr*100).toFixed(1)+'%/yr', s:'to Dec 2029 (~'+IDT_YEARS+' yrs)', up:s.irr>=0 },
    { l:(s.isEV?'Enterprise value':'Equity value'), v:sensMoney(s.ev), s:p.mult.toFixed(1)+'× FY2030 '+s.lbl.split('/')[1] },
    { l:'Equity value',             v:sensMoney(s.equity), s:s.isEV ? '+ '+sensMoney(s.netCash)+' net cash' : 'equity multiple' },
    { l:'Net cash · Dec 2029',      v:sensMoney(s.netCash), s:'2026 cash + cum. DCF FCF − buybacks' },
  ];
  var out = root.querySelector('#idtOut');
  if(out){
    out.innerHTML = cards.map(function(c){
      return '<div class="sens-card'+(c.big?' is-big':'')+(c.up?' is-up':'')+'">'+
        '<div class="sens-card-l">'+esc(c.l)+'</div><div class="sens-card-v">'+esc(c.v)+'</div>'+
        '<div class="sens-card-s">'+esc(c.s)+'</div></div>';
    }).join('');
  }

  var heat = root.querySelector('#idtHeat');
  if(heat) heat.innerHTML = idtHeat(p);
}

function idtBody(c){
  var h = '';
  h += '<div class="ov-statline" style="margin-bottom:16px">This scenario overlays Spotify’s <b>2030 Investor Day targets</b> onto the Summit DCF, builds the 2030 target P&amp;L, then values the company <b>at December 2029</b> — where the market discounts the next year (FY2030). Move the assumption sliders to hit the targets; the <b>sensitivity is the Dec-2029 multiple</b> you apply.</div>';

  // 1 — 2030 target assumptions
  h += sec('1 · 2030 targets (Investor Day) — assumptions',
    '<div class="spl-grid">'+
      sensSlider('idtCagr', 'Revenue CAGR ’25→’30', 12, 18, 0.5, IDT_DEF.cagr, 'Mid-teens % target (constant FX) → compounds FY2025 revenue to FY2030')+
      sensSlider('idtGm',   'Gross margin (2030)',   32, 42, 0.5, IDT_DEF.gm,   'Investor Day target 35–40% by 2030 (from 32% today)')+
      sensSlider('idtOm',   'Operating margin (2030)',15, 26, 0.5, IDT_DEF.om,  'Investor Day target 20%+ by 2030 (from ~13% today)')+
      sensSlider('idtFcfm', 'FCF margin (2030)',     15, 26, 0.5, IDT_DEF.fcfm, 'FCF as % of revenue — the new headline KPI (“sustained ↑”)')+
      sensSlider('idtTax',  'Tax rate (2030)',        5, 25, 1,   IDT_DEF.tax,  'Effective tax rate on operating income → net income / EPS (drives the P/E)')+
    '</div>'+
    '<div class="idt-pnl" id="idtPnl"></div>'+
    '<div class="ov-statline" style="margin-top:10px">The chips above are the <b>2030 target P&amp;L</b> these assumptions imply — the numbers Spotify would post if it hits its Investor Day plan.</div>');

  // 2 — Dec-2029 valuation lever (the multiple)
  h += sec('2 · Valuation at Dec 2029 — the multiple is the sensitivity',
    '<div class="sens-selrow">'+
      '<div class="sens-sel"><label for="idtMetric">Multiple type</label><select id="idtMetric">'+
        '<option value="ebit" selected>EV / EBIT (operating income)</option>'+
        '<option value="ebitda">EV / EBITDA</option>'+
        '<option value="pe">P / E (net income)</option>'+
        '<option value="fcf">P / FCF</option>'+
        '<option value="sales">EV / Sales</option>'+
      '</select></div>'+
    '</div>'+
    '<div class="spl-grid">'+
      sensSlider('idtMult', 'Dec-2029 multiple (×)', 3, 45, 0.5, IDT_DEF.mult, 'Applied to the FY2030 target metric at Dec-2029 (forward / NTM multiple)')+
    '</div>');

  // Outputs
  h += sec('If they hit the 2030 targets — valuation at Dec 2029', '<div class="sens-out" id="idtOut"></div>');

  // Sensitivity grid
  h += sec('Sensitivity grid — Dec-2029 multiple × margin',
    '<div class="sens-heat-wrap" id="idtHeat"></div>'+
    '<div class="ov-statline" style="margin-top:10px">Each cell is the implied <b>Dec-2029 price</b> across the <b>multiple (rows)</b> and the metric’s driver margin <b>(cols)</b>, holding the other assumptions fixed. Your current pick is outlined.</div>');

  h += '<div class="ov-foot">Scenario overlays Spotify’s 2030 Investor Day targets (gross margin 35–40%, operating margin 20%+, mid-teens revenue CAGR, sustained FCF) onto the Summit DCF (snapshot 2026-05-22). FY2030 revenue = FY2025 €17.2B compounded at the chosen CAGR; gross/operating/FCF margins as set; adj. EBITDA = EBIT + D&amp;A (~2.6% of revenue); net income at the chosen tax rate (ignores net interest). Valuation is AT DEC-2029: a forward multiple on the FY2030 metric, bridging EV→equity with net cash ≈ 2026 net cash + cumulative DCF FCF 2026–29 − ~€6B buybacks, on FY2029 shares (198.9m); EUR→USD 1.08. Annualized return runs from today’s $473.65 over ~3.4 years. Illustrative single-scenario sensitivity, not the full DCF. Targets: Spotify Investor Day (May 21, 2026) recap; financials: Summit DCF models.</div>';
  return h;
}

// Sensitivity shell — wraps the two sub-tabs (Price increase · Investor Day targets).
// (The old "Sensitivity" tab shell is gone — its two tools are now Deep Dive ▸ Valuation ▸
// Price Sensitivity and ▸ 2029 Targets, wired by the shared `.ovt-subtab` convention.)

// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ EARNINGS — the decision layer (docs/EARNINGS_CONVENTIONS.md v2.10)
//
//  The RENDERERS below are ported verbatim from js/overviews/googl.js, the
//  canonical v2.10 implementation — each overview owns its own copy, per the
//  conventions. Only the DATA is Spotify's: the IR/EDGAR URLs, CE_CONS,
//  CALL_EARNINGS, WL_ROWS and SPOT_THEMES.
//
//  ⏰ SPOTIFY REPORTS Q2 2026 ON TUE 4 AUG 2026, BEFORE MARKET OPEN. The tab is
//  therefore built Setup-first: the live quarter is an UPCOMING print, not a
//  post-mortem.
// ════════════════════════════════════════════════════════════════════════════

// Accent colours the ported renderers expect (same roles as in googl.js/amzn.js).
var BLUE='#2557D6', RED='#EA4335', YELLOW='#E8A00C', PURPLE='#7A5AF8', AMBER='#B7791F';

// The two mandatory source buttons (§6). Spotify is a foreign private issuer, so
// EDGAR carries 20-F/6-K rather than 10-K/10-Q.
var CE_IR_URL='https://investors.spotify.com/';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1639920&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/SPOT';

// ─── CE_CONS — the expectation grid ─────────────────────────────────────────
// ⚠ PROVENANCE, AND IT IS NOT THE USUAL ONE. Spotify has NO rows in
// BBG_CONSENSUS.txt (the archive carries GOOG/GOOGL/HOOD/KKR/MA/META/UBER only),
// so there is no rolling Street matrix to reconstruct. What Spotify DOES have is
// the most complete guidance of any name we cover — it guides FIVE metrics every
// quarter — so the guide is used as the expectation of record here, and the
// horizon matrix carries a single column ("the guide") rather than 4q/3q/2q/1q.
//
// ⚠ CURRENCY TRAP: Spotify guides in EUR; the syndicated consensus that circulates
// (revenue ~$5.47–5.60B, EPS ~$3.15–3.29) is in USD and is NOT comparable to the
// €4.8B guide without an FX assumption. At ~1.15 EUR/USD the guide is ≈$5.5B, i.e.
// the USD "consensus" sits at or slightly BELOW the company's own number — which is
// the opposite of how it reads if you put the two figures side by side. The Street
// column is therefore left empty rather than filled with a mismatched unit.
var CE_CONS = (function(){
  var q = ['Q2 2026'];
  function line(k, u, guide, act1, act4){
    return { k:k, u:u, t:'ok',
      // ceGrid reads the 1-quarter-out column (index 3) of the horizon matrix, so the
      // guide sits there even though Spotify has only one expectation horizon.
      qr:[[null,null,null,guide]],
      qa:[null],         // no actual yet — reports Aug 4, 2026
      qy:[act4],         // the year-ago quarter (for the YoY lens)
      qq:[act1] };       // the prior quarter (for the QoQ lens)
  }
  return {
    src:'Spotify\'s OWN Q2 2026 guidance, issued 28 Apr 2026 with the Q1 2026 shareholder deck. Spotify has no rows in the BBG_CONSENSUS.txt archive, so there is no Street matrix to reconstruct; syndicated USD consensus is noted per metric but not plotted against a EUR guide.',
    asOf:['2026-04-28 (the guide)'],
    q:q, hz:['company guide'], nHead:4,
    m:[
      // Revenue and operating income MUST share a unit — the margin row divides one by
      // the other, and a €B-over-€M mix silently prints a 13,125% margin.
      line('Revenue','€M', 4800, 4533, 4193),
      line('Operating income','€M', 630, 715, 406),
      line('Gross margin','%', 33.1, 33.0, 31.5),
      line('Premium subscribers','M', 299, 293, 276),
      line('Total MAU','M', 778, 761, 696),
      line('Premium ARPU','€', null, 4.76, 4.57),
      line('Ad-Supported revenue','€M', null, 385, 453),
      line('Free cash flow','€M', null, 824, 700)
    ]
  };
})();

// ─── CALL_EARNINGS — the quarters. Q2 2026 is UPCOMING (reports Tue 4 Aug 2026,
// before market open). Reported quarters are backfilled as the calls repository
// for SPOT gets built (docs/calls/SPOT*.md — not yet written; see the tab note).
var CALL_EARNINGS = { ticker:'SPOT', quarters:[
  { q:'Q2 2026', status:'upcoming', date:'reports Tue Aug 4, 2026 · BEFORE market open (Q&A 8:00am ET)',
    setup:{
      source:'Spotify Q2 2026 guidance, issued 28 Apr 2026 with the Q1 2026 shareholder deck', asOf:'2026-04-28',
      notes:{
        'Revenue':{ t:'€4.8B guided — and the USD "consensus" is a trap', h:'<p>Guided to <b>€4.8B</b> with an <b>~80bps FX headwind</b> assumed. Q1 printed €4,533M (+8% reported, <b>+14% constant-currency</b>) — the gap between those two numbers IS the story of this line: a strong euro has been masking real growth all year.</p><p>⚠ The syndicated consensus quoted around this print (<b>$5.47–5.60B</b>) is in <b>US dollars</b> against a <b>euro</b> guide. At ~1.15 EUR/USD the guide is ≈$5.5B — so the "consensus" is at or slightly BELOW the company\'s own number, the opposite of how it reads if you set the two side by side. Do not score this line against a USD figure.</p>' },
        'Operating income':{ t:'⚑ The number the whole print turns on', h:'<p>Guided to <b>€630M</b> — which is <b>BELOW the €715M Spotify just printed in Q1</b>, and came in roughly 8% under the ~€684M the Street was carrying. The stock fell on the Apr 28 guide despite Q1 beating on every line.</p><p>Bulls read conservatism plus the FX drag. Bears read a step-up in spend that breaks the 2025 margin story. This is the single line that decides the reaction.</p>' },
        'Gross margin':{ t:'33.1% guided — only +10bps sequentially', h:'<p>Guided to <b>33.1%</b> against Q1\'s record <b>33.0%</b>. Ten basis points of sequential progress is hard to reconcile with the <b>35–40% by 2030</b> ambition management put on the record at the May Investor Day.</p><p>The levers that have to do the work: the marketplace/discount-royalty programs, the audiobook-bundle effect on mechanical royalties, and the advertising margin recovery. Watch whether any of them shows up here.</p>' },
        'Premium subscribers':{ t:'299M guided · +6M net adds', h:'<p>Guided to <b>299M</b> from 293M — a ~6M add, in line with recent quarters. Subscriber adds have been the most reliably-hit of Spotify\'s five guided lines; a miss here would be a genuine surprise rather than a repricing of expectations.</p>' },
        'Total MAU':{ t:'778M guided · +17M net adds', h:'<p>Guided to <b>778M</b> from 761M. The regional mix matters more than the total: growth concentrates in Rest of World and Latin America, which monetize least — which is why MAU growth consistently outruns revenue growth.</p>' },
        'Premium ARPU':{ t:'Not guided — but this is the pricing test', h:'<p>Spotify does not guide ARPU. Q1 was <b>€4.76, +5.7% constant-currency</b>, carried by the Jan 2026 US increase and hikes across 150+ markets.</p><p>The reason Q2 matters: the <b>July and August 2025</b> increases <b>lap</b> during this quarter. If ARPU growth holds through that comp, pricing is compounding; if it fades, the 2025 cohort was a one-off step rather than a new cadence.</p>' },
        'Ad-Supported revenue':{ t:'Not guided — the SAX rebuild\'s first clean comp', h:'<p>Q1 printed <b>€385M, +3% constant-currency</b> — barely growing, against a company narrative that the pivot to its own exchange is already driving significant growth.</p><p>Q2 2025 is the first quarter fully after the <b>April 2025 SAX launch</b>, so this is the first comparison not distorted by the transition. Bull: the drag annualizes out. Bear: +3% cc IS the run-rate, and Spotify swapped a low-margin growing business for a flat one.</p>' },
        'Free cash flow':{ t:'Not guided — the quiet compounder', h:'<p>Q1 printed <b>€824M</b>, with LTM free cash flow around <b>€3.2B</b>. FCF has run consistently above operating income on favourable working capital (royalty accrual timing plus deferred subscription revenue). Not a contested line, but it is what funds the buyback.</p>' }
      },
      us:{},
      debate:{ rows:null, synth:'The one thing to resolve: is the <b>€630M operating-income guide</b> — below the €715M Spotify just printed, and ~8% under where the Street sat — conservatism plus an 80bps FX drag, or the first evidence that the 2025 margin expansion has stopped? Everything else on the card (a 33.1% gross-margin guide that adds ten basis points, an ad line growing 3% constant-currency, ARPU lapping last summer\'s price rises) either supports or undercuts that single question.' }
    },
    results:null, call:null }
]};

// ─── WL_ROWS — the Watch List. Seeded from the four genuinely contested questions
// going into the Aug 4 print (§6f: this list is OURS, not the model's).
var WL_ROWS=[
  { id:'wl001', q:'Q2 2026', rank:1, theme:'The operating-income guide: conservatism or the end of margin expansion?',
    tags:['margin','guidance'], trackSince:'Q2 2026', trackUntil:null,
    definition:'Spotify guided Q2 operating income BELOW the quarter it had just printed, and ~8% under the Street. Either FX plus habitual conservatism explains it, or the 2025 margin story has run its course. Every other line on the card is evidence for one reading or the other.',
    src:'Q1 2026 deck (28 Apr 2026): Q2 guide €630M vs €715M printed in Q1; Street was carrying ~€684M. The stock fell on the guide despite a clean Q1 beat.' },
  { id:'wl002', q:'Q2 2026', rank:2, theme:'Has the SAX rebuild stopped shrinking advertising?',
    tags:['advertising','sax'], trackSince:'Q2 2026', trackUntil:null,
    definition:'Spotify tore up its ad stack and rebuilt it around programmatic auctions, trading volume for margin. Ad gross margin roughly doubled while ad revenue went nowhere. Q2 is the first quarter with a clean comp against the April 2025 SAX launch — so it is the first honest read on whether the trade is working.',
    src:'Q1 2026: Ad-Supported revenue €385M, +3% constant-currency. FY2025: ad gross margin 18.0% (restated 17.4%) vs 11.2% in FY2024, on revenue that was flat to down.' },
  { id:'wl003', q:'Q2 2026', rank:3, theme:'Do the price increases compound, or was 2025 a one-off step?',
    tags:['pricing','arpu'], trackSince:'Q2 2026', trackUntil:null,
    definition:'Spotify held $9.99 for about fifteen years, then discovered pricing power and used it three times. Q2 is when the July and August 2025 increases LAP — so it separates a genuine pricing cadence from a single re-rate that is now in the base.',
    src:'Q1 2026: Premium ARPU €4.76, +5.7% constant-currency, on the Jan 2026 US move and increases across 150+ markets.' },
  { id:'wl004', q:'Q2 2026', rank:4, theme:'Gross margin against the 35–40% promise',
    tags:['margin','investor-day'], trackSince:'Q2 2026', trackUntil:null,
    definition:'At the May 2026 Investor Day management committed to a 35–40% gross margin by 2030 against 32.0% in FY2025. The Q2 guide adds ten basis points sequentially. This hook tracks the gap between the trajectory being guided and the trajectory required.',
    src:'Investor Day, 21 May 2026: mid-teens revenue CAGR, 35–40% gross margin, 20%+ operating margin by 2030. Q2 2026 gross-margin guide: 33.1% vs 33.0% printed in Q1.' },
  { id:'wl005', q:'Q2 2026', rank:5, theme:'MLC litigation — the audiobook bundle\'s royalty tail',
    tags:['legal','royalties'], trackSince:'Q2 2026', trackUntil:null,
    definition:'Bundling audiobooks into Premium lowered the mechanical royalty Spotify owes publishers. A court agreed it IS a bundle; the MLC is still attacking how the bundle was valued. Not a Q2 event, but it is a live claim against the exact mechanism that lifted gross margin.',
    src:'FY2025 20-F: if the MLC ultimately succeeds, ~€358M for Mar 2024–Dec 2025 plus penalties and interest. Dismissed with prejudice Jan 2025; amended complaint filed Oct 2025.' }
];

// ─── The theme record (§6, v2.3 fold-in). Threads across the recent calls.
var SRC_CALLS='Spotify FY2025 Form 20-F, the Q1 2026 6-K and shareholder update, the May 2026 Investor Day remarks, and earnings-day coverage. ⚠ A per-call record (docs/calls/SPOT*.md) has NOT been written yet — these threads are compiled from filings and decks, not from transcripts. Building the calls repository is the next step for this tab.';
var SPOT_THEMES=[
  { theme:'The gross-margin climb — and the 2030 promise', st:{ k:'trend', since:'Q1 2025', last:'Q1 2026' },
    why:'The entire equity story: 32.0% in FY2025 against a 35–40% commitment by 2030. Every lever is a different negotiation with a rights holder.',
    updates:[
      { q:'Q4 2025', items:['Consolidated gross margin <b>33.1%</b>, a record at the time; FY2025 closed at <b>32.0%</b> against 30.1% in FY2024.'] },
      { q:'Q1 2026', items:['<b>33.0%</b>, roughly +140bps YoY. Guidance for Q2 adds only <b>ten basis points</b> (33.1%) — the first quarter where the guided trajectory looks slower than the promised one.'] },
    ]},
  { theme:'Advertising rebuilt around the exchange (SAX)', st:{ k:'watch', since:'Q2 2025', last:'Q1 2026' },
    why:'Spotify deliberately traded advertising VOLUME for advertising MARGIN. The trade is visible in the margin; the growth has not come back yet.',
    updates:[
      { q:'Q2 2025', items:['<b>Spotify Ad Exchange launched 1 Apr 2025</b> — programmatic, real-time biddable auctions, replacing insertion-order selling.'] },
      { q:'Q4 2025', items:['Ad-Supported gross margin roughly <b>doubled</b> year over year (11.2% → 17.4% restated) while ad revenue was flat to down.'] },
      { q:'Q1 2026', items:['Ad revenue <b>€385M, +3% constant-currency</b> — automated channels described as the largest contributor to what growth there was. Q2 is the first clean comp against the launch.'] },
    ]},
  { theme:'Pricing power, discovered late and used repeatedly', st:{ k:'trend', since:'Q3 2023', last:'Q1 2026' },
    why:'Fifteen years at $9.99, then three increases in under three years. Whether that is a cadence or a one-off re-rate is still unresolved.',
    updates:[
      { q:'Q3 2023', items:['The <b>first broad Premium price increase</b>, across 50+ markets.'] },
      { q:'Q3 2025', items:['A further multi-market increase (Aug 2025) across South Asia, the Middle East, Africa, Europe, Latin America and Asia-Pacific.'] },
      { q:'Q1 2026', items:['US individual moved to <b>$12.99</b>; ARPU <b>€4.76, +5.7% cc</b>. The July/August 2025 increases lap in Q2 — the test of whether pricing compounds.'] },
    ]},
  { theme:'The audiobook bundle and the royalty it changed', st:{ k:'watch', since:'Q4 2023', last:'Q1 2026' },
    why:'The most consequential product decision in Spotify\'s history in profit terms — and the one being litigated.',
    updates:[
      { q:'Q4 2023', items:['Audiobooks folded into Premium — which reclassified the subscription as a <b>bundle</b>, lowering the mechanical royalty owed to music publishers.'] },
      { q:'Q1 2025', items:['The MLC\'s suit <b>dismissed with prejudice</b> — the court held the Premium Service IS a bundle.'] },
      { q:'Q1 2026', items:['The MLC\'s <b>amended complaint</b> (filed Oct 2025) attacks how the bundle\'s components were valued. Quantified exposure if it succeeds: <b>~€358M</b> for Mar 2024–Dec 2025, plus penalties and interest.'] },
    ]},
  { theme:'Founder succession and the new management view', st:{ k:'watch', since:'Q3 2025', last:'Q1 2026' },
    why:'The first CEO change in twenty years — and the new leadership\'s first act was to redraw the segments.',
    updates:[
      { q:'Q3 2025', items:['Announced 30 Sep 2025: <b>co-CEOs Norström and Söderström</b> from 1 Jan 2026, Daniel Ek to <b>executive chairman</b>. The co-CEOs <b>report to Ek</b>, who retains <b>capital allocation</b>.'] },
      { q:'Q1 2026', items:['First accounting act of the new leadership: effective 1 Jan 2026 revenue moved from <b>Ad-Supported into Premium</b> (2023–25 restated) to match what the new joint chief operating decision makers see.'] },
      { q:'Q1 2026', items:['<b>Investor Day, 21 May 2026</b> — the first public long-term framework: mid-teens revenue CAGR, <b>35–40% gross margin</b>, 20%+ operating margin by 2030.'] },
    ]},
];

function ceUpcoming(){ return CALL_EARNINGS.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }

function ceFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="ce-empty">'+(muted||'— to fill')+'</span>'; }

var CE_POP={};

function ceReg(id, t, h){ CE_POP[id]={t:t, h:ceProse(h)}; return id; }

function ceQ(id, t, h){ return '<span class="ce-info ov-clickable" data-detail="ce:'+ceReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
// ─── ceProse · the anti-wall transform ──────────────────────────────────────────────────────────
// Every pop-up body in this file was authored as flowing <p> prose — 81 of 81 with no bullets —
// and a reader who taps "＋ detail" got a paragraph block. This runs at REGISTRATION time so the
// rule cannot be forgotten by the next author, and so it applies to old content too:
//   · the first paragraph becomes the LEAD — one short block, set larger; if it is itself long,
//     only its first sentence leads and the remainder joins the bullets.
//   · any paragraph of 2+ sentences is split into <li> bullets, one sentence each.
//   · a paragraph opening "<b>Label:</b> …" keeps its label and becomes a labelled row.
// Content already carrying <ul>/<li> is left exactly as authored. (§6a-iv.)

// ─── ceProse · the anti-wall transform ──────────────────────────────────────────────────────────
// Every pop-up body in this file was authored as flowing <p> prose — 81 of 81 with no bullets —
// and a reader who taps "＋ detail" got a paragraph block. This runs at REGISTRATION time so the
// rule cannot be forgotten by the next author, and so it applies to old content too:
//   · the first paragraph becomes the LEAD — one short block, set larger; if it is itself long,
//     only its first sentence leads and the remainder joins the bullets.
//   · any paragraph of 2+ sentences is split into <li> bullets, one sentence each.
//   · a paragraph opening "<b>Label:</b> …" keeps its label and becomes a labelled row.
// Content already carrying <ul>/<li> is left exactly as authored. (§6a-iv.)
function ceSentences(s){
  // split on sentence end followed by a capital / tag-open — never inside "$1.5B" or "vs. the"
  return String(s).split(/(?<=[.!?])\s+(?=(?:<[a-z]+>)*[A-Z“"(])/).filter(function(x){ return x.trim(); });
}

function ceProse(h){
  h=String(h||'');
  if(!h || h.indexOf('<li>')>=0 || h.indexOf('<ul')>=0) return h;   // already structured
  var paras=h.match(/<p>[\s\S]*?<\/p>/g);
  if(!paras || paras.length===0) return h;
  var tail=h.replace(/<p>[\s\S]*?<\/p>/g,'').trim();               // anything not in a <p>
  var lead='', bullets=[];
  paras.forEach(function(p,i){
    var inner=p.replace(/^<p>/,'').replace(/<\/p>$/,'').trim();
    var lab=inner.match(/^<b>([^<]{1,42}[:—-])<\/b>\s*([\s\S]*)$/);
    if(lab){ bullets.push('<b>'+lab[1]+'</b> '+lab[2]); return; }
    var sents=ceSentences(inner);
    if(i===0){
      lead=sents.shift();
      sents.forEach(function(s){ bullets.push(s); });
    } else {
      sents.forEach(function(s){ bullets.push(s); });
    }
  });
  var out='';
  if(lead)          out+='<p class="ce-pop-lead">'+lead+'</p>';
  if(bullets.length) out+='<ul class="ce-pop-l">'+bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('')+'</ul>';
  return out+tail;
}

function ceStyle(){
  return '<style>.ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.ce-phtabs{display:inline-flex;gap:3px;background:rgba(66,133,244,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.ce-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.ce-phtab:hover{color:var(--navy)}.ce-phtab.active{background:'+BRAND+';color:#fff}'+
    '.ce-phpane[hidden]{display:none}'+
    /* quarter selector — one Earnings, many quarters; only the selected quarter renders (page stays light) */
    '.ce-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.ce-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-qpill:hover{color:var(--navy)}.ce-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.ce-qpill .ce-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.ce-qblock[hidden]{display:none}'+
    '.ce-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    /* watch-list theme tags (cross-quarter filter) + add-theme form */
    '.ce-wl-hint{font-size:10.5px;line-height:1.5;color:var(--navy);background:rgba(66,133,244,0.06);border:1px solid rgba(66,133,244,0.28);border-radius:9px;padding:8px 12px;margin:0 0 10px}'+'.ce-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.ce-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-tag:hover{background:rgba(122,90,248,0.08)}.ce-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.ce-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-bar-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.ce-wl-win{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 11px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-win.active{background:var(--navy);color:#fff}'+
    /* ── the Add / Edit theme form ── */
    '.ce-wl-addform{display:flex;flex-direction:column;gap:5px;border:1px dashed '+BRAND+';border-radius:10px;padding:14px 15px;margin:0 0 12px;background:rgba(66,133,244,0.03)}'+
    '.ce-wl-addform[hidden]{display:none}'+
    '.ce-wl-fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:4px}'+
    '.ce-wl-fh-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-fh-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-lb{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-top:5px}'+
    '.ce-wl-lb span{font-weight:600;text-transform:none;letter-spacing:0;color:var(--mu);font-size:10px;margin-left:5px}'+
    '.ce-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);width:100%;box-sizing:border-box}'+
    '.ce-wl-in:focus{outline:none;border-color:'+BRAND+'}'+
    '.ce-wl-ta{resize:vertical;line-height:1.5}'+
    '.ce-wl-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.ce-wl-2col{grid-template-columns:1fr}}'+
    '.ce-wl-tagpick{display:flex;gap:6px;flex-wrap:wrap;border:1px solid var(--bdr);border-radius:8px;padding:8px 9px;background:var(--w);min-height:20px}'+
    '.ce-wl-pick{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-pick:hover{background:rgba(122,90,248,0.08)}.ce-wl-pick.on{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-newtag{display:flex;gap:7px;align-items:center}.ce-wl-newtag .ce-wl-in{flex:1}'+
    '.ce-wl-newtag-go{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+PURPLE+';background:var(--w);color:'+PURPLE+';padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap}'+
    '.ce-wl-frow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}'+
    '.ce-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:7px 15px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.ce-wl-cancel{font:inherit;font-size:10.5px;font-weight:700;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:6px 12px;border-radius:8px;cursor:pointer}'+
    '.ce-wl-all[hidden]{display:none}.ce-w[data-wlhide]{display:none}'+
    /* ── the table: the storage view + the copy-out ── */
    '.ce-wl-tbl-sc[hidden]{display:none}'+'.ce-wl-tbl-wrap{margin-top:22px;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.ce-wl-tbl-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}'+
    '.ce-wl-tbl-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-tbl-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-tbl-n{margin-left:auto;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';background:rgba(52,168,83,0.10);border:1px solid rgba(52,168,83,0.3);border-radius:999px;padding:3px 11px;white-space:nowrap}'+
    '.ce-wl-copy{border:1px solid '+BRAND+';background:'+BRAND+';font:inherit;font-size:10px;font-weight:800;color:#fff;padding:4px 14px;border-radius:999px;cursor:pointer;letter-spacing:.03em;transition:.12s}'+
    '.ce-wl-copy:hover{filter:brightness(1.08)}'+
    '.ce-wl-copy.alt{background:var(--w);color:'+BRAND+'}.ce-wl-copy.alt:hover{background:rgba(66,133,244,0.08)}'+
    '.ce-wl-tbl-sc{overflow-x:auto;border:1px solid var(--bdr);border-radius:9px}'+
    '.ce-wl-tbl{width:100%;border-collapse:collapse;font-size:10.5px;min-width:1100px}'+
    '.ce-wl-tbl th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:7px 9px;border-bottom:1px solid var(--bdr);white-space:nowrap;position:sticky;top:0}'+
    '.ce-wl-tbl td{padding:7px 9px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top;max-width:270px}'+
    '.ce-wl-tbl tr:last-child td{border-bottom:none}'+
    '.ce-wl-tbl td.wl-key{white-space:nowrap;font-weight:800;color:var(--mu);font-size:10px}'+
    '.ce-wl-tbl td.wl-th{font-weight:800;min-width:190px}'+
    '.ce-wl-tbl tr.wl-open td.wl-key{color:'+BRAND2+'}'+
    '.ce-wl-tbl tbody tr:hover{background:rgba(66,133,244,0.035)}'+
    '.ce-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.ce-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.ce-grid4{grid-template-columns:1fr 1fr}}'+
    '.ce-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.ce-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.ce-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    /* Setup v2 — estimates toggle (Consensus ⇄ Summit ⇄ Both) */
    '.ce-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-ev-pill.active{background:var(--navy);color:#fff}'+
    '.ce-cell-custom{border-top-color:'+YELLOW+'}'+
    '.ce-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.ce-val{display:flex;align-items:baseline;gap:7px}'+
    '.ce-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.ce-val-cons .ce-val-lab{background:rgba(26,115,232,0.10);color:'+BLUE+'}'+
    '.ce-val-us .ce-val-lab{background:rgba(52,168,83,0.12);color:'+BRAND2+'}'+
    '.ce-evwrap[data-ev="cons"] .ce-val-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-val-cons{display:none}'+
    '.ce-evwrap:not([data-ev="both"]) .ce-val-lab{display:none}'+
    '.ce-evwrap[data-ev="both"] .ce-cell-v{font-size:13px}'+
    '.ce-evwrap[data-ev="both"] .ce-val{margin-top:3px}'+
    '.ce-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.ce-watch{display:flex;flex-direction:column;gap:11px}'+
    '.ce-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.ce-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    /* v2.6: the numbered rank badge is gone — a plain marker, so removing a theme never leaves a
       stale number behind. `rank` still orders the rows, it just is not rendered. */
    '.ce-w-dot{width:8px;height:8px;border-radius:50%;background:'+BRAND+';flex:none;margin:0 2px}'+
    '.ce-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    /* the definition — what the theme means, in our words. (v2.6 replaced the tell 🔎 box, which
       had been carrying the model's voice; no black slabs left anywhere in the watch cards.) */
    '.ce-w-def{color:var(--navy);border-left:3px solid rgba(66,133,244,0.35);padding:1px 0 1px 11px;font-size:12px;line-height:1.55;margin-top:7px}'+
    '.ce-w-def b{color:'+BLUE+'}'+
    /* per-card edit / delete (live quarter only) + the closed-hook badge */
    '.ce-w-ctl{margin-left:auto;display:inline-flex;gap:5px;flex:none}'+
    '.ce-w-ed,.ce-w-del{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);width:24px;height:24px;border-radius:7px;cursor:pointer;line-height:1;transition:.12s}'+
    '.ce-w-ed:hover{border-color:'+BRAND+';color:'+BRAND+'}.ce-w-del:hover{border-color:'+RED+';color:'+RED+'}'+
    '.ce-w-closed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;flex:none}'+
    '.ce-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.ce-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.ce-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.ce-info:hover{filter:brightness(1.1)}'+
    /* (retired Jul 2026: .ce-debate / .ce-dc / .ce-mech — the fear-vs-consensus pair and the
       mechanism chips. The Setup now goes straight from the estimates grid to the debate box.) */
    '.ce-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.ce-synth b{color:#AECBFA}'+
    '.ce-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.ce-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.ce-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3;color:var(--navy)}'+
    '.ce-w-chip.tag{background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3)}'+
    '.ce-w-chip.since{background:rgba(251,188,5,0.12);border:1px solid rgba(183,121,31,0.35)}'+
    '.ce-w-chip.until{background:#F2F5F8;border:1px solid var(--bdr);color:var(--mu)}'+
    '.ce-w-chip.cons{background:rgba(26,115,232,0.08);border:1px solid rgba(26,115,232,0.28)}'+
    /* .cons and .red are kept for the SPLC infra cards (Deep Dive ▸ SPLC), their only remaining user */
    '.ce-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28)}'+
    '.ce-w-chip b{font-weight:800}'+
    '.ce-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.ce-take b{color:#AECBFA}'+
    '.ce-hl{display:flex;flex-direction:column;gap:8px}'+
    '.ce-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.ce-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.ce-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.ce-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.ce-hl-row{grid-template-columns:auto 1fr}.ce-hl-more{display:none}}'+
    '.ce-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(66,133,244,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.ce-dots b{color:'+BRAND+'}'+
    '.ce-sc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.ce-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.ce-sc-c{font-size:11px;color:var(--mu)}.ce-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a{display:none}}'+
    '.ce-tc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.ce-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.ce-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.ce-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.ce-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    /* ── #1 · the chain: seededBy chip on watch items, landing chip on newQuestions ── */
    '.ce-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.ce-nq{display:flex;flex-direction:column;gap:5px}'+
    '.ce-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.ce-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.ce-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.ce-nq-row{grid-template-columns:1fr}.ce-nq-land{margin-top:3px}}'+
    /* ── #2 · scorecard: surprise bars, watch-rank badges, richer result kinds ── */
    '.ce-sc-row{grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto}'+
    '.ce-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(66,133,244,0.10);border:1px solid rgba(66,133,244,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.ce-sc-rk.blank{background:transparent;border:none}'+
    '.ce-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.ce-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.ce-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.ce-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    /* the legend that makes the row readable without a manual */
    '.ce-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.ce-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.ce-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a,.ce-sc-bw,.ce-sc-rk{display:none}}'+
    /* ── #3 · post-call highlight bands ── */
    '.ce-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.ce-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.ce-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.ce-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.ce-band-s{display:none}}'+
    '.ce-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    /* ── #4 · the deliverable: three minutes + what we are not bringing ── */
    '.ce-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(66,133,244,0.05),transparent)}'+
    '.ce-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.ce-3m-l{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}'+'@media(max-width:760px){.ce-3m-l{grid-template-columns:1fr}}'+'.ce-3m-n{width:22px;height:22px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none}'+'.ce-3m-bd{min-width:0}'+'.ce-3m-lead{display:block;font-size:13.5px;font-weight:800;color:var(--navy);line-height:1.4}'+'.ce-3m-ev{display:block;font-size:11px;font-weight:500;color:var(--mu);line-height:1.5;margin-top:4px}'+'.ce-3m-more{margin-top:6px}'+'.ce-3m-more>summary{font-size:9.5px;font-weight:800;color:'+BLUE+';cursor:pointer;list-style:none}'+'.ce-3m-more>summary::-webkit-details-marker{display:none}'+'.ce-3m-more[open]>summary{color:var(--mu)}'+
    '.ce-3m-i{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:11px 13px;background:#fff}'+
    
    '.ce-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.ce-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.ce-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.ce-nb-r b{color:var(--navy);font-weight:800}'+
    '.ce-nb-x{color:'+GRAY+';font-weight:800;flex:none}'+
    /* ── #5 · earnings-call theme status with age ── */
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
// ─── The IR button — every Earnings opens with it. On earnings day the source is ONE tap away:
// release, webcast, transcripts, straight from the company. Deliberately loud; convention for
// every company (EARNINGS_CONVENTIONS §6). GOOGL → https://investors.spotify.com/

var CE_SEC_SEAL='img/sec-seal.png';

function ceIRButton(){
  return '<style>'+
    '.ce-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.ce-srcrow{grid-template-columns:1fr}}'+
    '.ce-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1224 60%,#04060B 100%);border:1px solid rgba(66,133,244,.3);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.ce-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+RED+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.ce-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(26,115,232,.4);border-color:rgba(66,133,244,.75)}'+
    /* the giant watermark — the mark itself, monumental, bleeding off the card */
    '.ce-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.ce-ir:hover .ce-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    /* the emblem — transparent mark in a glowing ring, same treatment both cards */
    '.ce-ir-ic{width:72px;height:72px;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(138,180,248,.3),0 0 32px rgba(66,133,244,.55)}'+
    '.ce-ir-ic img{width:52px;height:52px;object-fit:contain;display:block;filter:drop-shadow(0 2px 10px rgba(0,0,0,.55))}'+
    '.ce-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.ce-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#8AB4F8;display:flex;align-items:center;gap:7px}'+
    '.ce-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(52,168,83,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(52,168,83,.6)}70%{box-shadow:0 0 0 8px rgba(52,168,83,0)}100%{box-shadow:0 0 0 0 rgba(52,168,83,0)}}'+
    '.ce-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.ce-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.ce-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BLUE+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.ce-ir:hover .ce-ir-go{gap:12px;box-shadow:0 4px 18px rgba(26,115,232,.55)}'+
    '@media(max-width:560px){.ce-ir{flex-wrap:wrap}.ce-ir-go{width:100%;justify-content:center}}'+
    /* EDGAR variant — federal weight: near-black + the gold of the seal, eagle front and center */
    '.ce-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.ce-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.ce-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.ce-ir.edgar .ce-ir-ic{box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.ce-ir.edgar .ce-ir-ic img{width:72px;height:72px}'+
    '.ce-ir.edgar .ce-ir-k{color:#E3C878}'+
    '.ce-ir.edgar .ce-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.ce-ir.edgar .ce-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.ce-ir.edgar:hover .ce-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.ce-ir.edgar .ce-ir-wm{opacity:.1}'+
    '.ce-ir.edgar:hover .ce-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="ce-srcrow">'+
  '<a class="ce-ir" href="'+CE_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Spotify logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Spotify Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Shareholder deck · webcast · press release — straight from investors.spotify.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">Spotify on EDGAR</span>'+
      '<span class="ce-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}

function ceQkey(q){ return String(q||'').replace(/\s/g,''); }
// Renders the quarter-pill selector (shared across the three phase panes via .ce-qblock filtering).
// The quarter selector is PHASE-AWARE: Setup & Watch List offer every quarter, but Post-Results
// only offers quarters that have a `results` block — the upcoming quarter has none, so it does not
// exist in that section (its data does not exist yet). The upcoming quarter is added to
// CALL_EARNINGS.quarters only once the PRIOR quarter's Post-Results (print + call highlights) is
// filled. data-ceqhas lists the phases each quarter is valid for.

// Renders the quarter-pill selector (shared across the three phase panes via .ce-qblock filtering).
// The quarter selector is PHASE-AWARE: Setup & Watch List offer every quarter, but Post-Results
// only offers quarters that have a `results` block — the upcoming quarter has none, so it does not
// exist in that section (its data does not exist yet). The upcoming quarter is added to
// CALL_EARNINGS.quarters only once the PRIOR quarter's Post-Results (print + call highlights) is
// filled. data-ceqhas lists the phases each quarter is valid for.
function ceQPhases(q){
  var ph=['setup','watch'];
  if(q.results) ph.push('results');
  return ph;
}

function ceQPills(){
  return '<div class="ce-qpills">'+CALL_EARNINGS.quarters.map(function(q,i){
    return '<button type="button" class="ce-qpill'+(i===0?' active':'')+'" data-ceqsel="'+esc(ceQkey(q.q))+'" data-ceqhas="'+ceQPhases(q).join(' ')+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="ce-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
// A · The Setup — the grid is BUILT FROM THE ARCHIVE, not hand-authored. CE_CONS carries the
// consensus and both growth bases, so the 13 cells, their YoY and their QoQ can never drift out of
// sync with the file. What stays hand-authored per quarter: `setup.us` (Summit's own number) and
// `setup.notes` (the caveat pop-ups), both keyed by metric name. (§6a-ii.)

// A · The Setup — the grid is BUILT FROM THE ARCHIVE, not hand-authored. CE_CONS carries the
// consensus and both growth bases, so the 13 cells, their YoY and their QoQ can never drift out of
// sync with the file. What stays hand-authored per quarter: `setup.us` (Summit's own number) and
// `setup.notes` (the caveat pop-ups), both keyed by metric name. (§6a-ii.)
function ceFmtV(u,v){
  if(v==null) return null;
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v)+'B';
  if(u==='B')  return (+v)+'B';
  return String(v);
}

// A line that IS ALREADY A RATE (gross margin %) gets no growth chip — the growth of a
// percentage is meaningless, and printing "+5%" against a margin invites exactly the
// misreading it looks like. Same guard META needed for its YoY ad KPIs.
function ceGrowth(m,qi,base){
  if(m.u==='%') return null;
  if(m.t==='basis') return null;                       // never a growth number off a basis mismatch
  var c=m.qr[qi]?m.qr[qi][3]:null;
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(c==null||b==null||!b) return null;
  return Math.round((c/b-1)*100);
}

function ceChip(g){
  if(g==null) return '';
  var up=g>=0;
  return '<span class="ce-gchip" style="color:'+(up?'#0a8f4c':'#C5221F')+'">'+(up?'+':'−')+Math.abs(g)+'%</span>';
}
// Margin lens (EXCEPTION, headline only): Gross profit / Operating income / EBITDA also carry a
// margin = the metric ÷ revenue, computed per column. Street margin = BBG metric ÷ BBG revenue;
// Summit margin = Summit metric ÷ Summit revenue (falls back to BBG revenue if Summit has none).
// Toggled in the estimates bar; lives in the SAME headline cell, never a new box. (§6a-ii.)

// Margin lens (EXCEPTION, headline only): Gross profit / Operating income / EBITDA also carry a
// margin = the metric ÷ revenue, computed per column. Street margin = BBG metric ÷ BBG revenue;
// Summit margin = Summit metric ÷ Summit revenue (falls back to BBG revenue if Summit has none).
// Toggled in the estimates bar; lives in the SAME headline cell, never a new box. (§6a-ii.)
var CE_MARGIN_ON={'Gross profit':1,'Operating income':1,'EBITDA':1};

function ceMarginPct(v, rev){ return (v==null||rev==null||!rev)?null:Math.round((v/rev*100)*10)/10; }

function ceMChip(p){ return p==null?'':'<span class="ce-mm">'+p+'% mgn</span>'; }
// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.

// A dedicated margin ROW for a cell (label + value + the base-period margin in parens). Sits on
// its own line so it always fits the box — the old inline chip overflowed (§6a-ii). The base
// swaps with the growth lens: YoY → same quarter a year ago, QoQ → prior quarter.
function ceMarginRow(cur, baseYoy, baseQoq){
  if(cur==null) return '';
  return '<div class="ce-mrow"><span class="ce-mrow-l">margin</span>'+
    '<span class="ce-mrow-v">'+cur+'%'+
      (baseYoy!=null?'<span class="ce-mm-b yoy"> (prev '+baseYoy+'%)</span>':'')+
      (baseQoq!=null?'<span class="ce-mm-b qoq"> (prev '+baseQoq+'%)</span>':'')+
    '</span></div>';
}
// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on

// Current margin + the margin of the period the growth chip compares against. The base swaps with
// the lens (YoY → the same quarter a year ago; QoQ → the prior quarter), so with Margin + YoY on
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null;      // BBG revenue for the quarter
  var revS=(us['Revenue']?us['Revenue'].v:null)||revC;   // Summit revenue, else BBG
  var revQy=revM?revM.qy[qi]:null, revQq=revM?revM.qq[qi]:null;   // revenue actual 1yr / 1q earlier
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    var mgn=CE_MARGIN_ON[m.k];
    var street=(c==null)
      ? '<span class="ce-empty">—</span>'+(m.t==='nocons'?'<span class="ce-nocons" title="The archive carries no forward estimate for this line — actuals only">no est.</span>':'')
      : ceFmtV(m.u,c)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq'))+'</span>';
    // margin row uses the Street (consensus) margin — the line the growth chips are about.
    var mRow=mgn?ceMarginRow(ceMarginPct(c,revC), ceMarginPct(m.qy[qi],revQy), ceMarginPct(m.qq[qi],revQq)):'';
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mcell-v">'+
        // LABEL CHANGED FOR SPOTIFY: this column is the COMPANY'S OWN GUIDANCE, not
        // Street consensus (Spotify is not in the BBG archive). Calling it "Street"
        // would misstate where the number came from.
        '<div class="ce-val ce-val-cons"><span class="ce-val-lab">Guide</span>'+street+'</div>'+
        '<div class="ce-val ce-val-us"><span class="ce-val-lab">Summit</span>'+(uv?ceFmtV(m.u,uv.v):'<span class="ce-empty">—</span>')+'</div>'+
        mRow+
      '</div></div>';
  }).join('')+'</div>';
}

function ceGridStyle(){
  return '<style>'+
    '.ce-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px;margin:4px 0}'+
    '.ce-mcell{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:8px 10px;background:#fff}'+
    '.ce-mcell.cust{border-left-color:'+BRAND2+'}'+
    '.ce-mcell.flagged{border-left-color:'+GRAY+';opacity:.72}'+
    '.ce-mcell-k{font-size:10px;font-weight:700;color:var(--mu);display:flex;align-items:center;gap:4px;line-height:1.3;min-height:26px}'+
    '.ce-mcell-v{margin-top:3px}'+
    '.ce-mcell .ce-val{display:flex;align-items:baseline;gap:5px;font-size:14px;font-weight:900;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-mcell .ce-val-lab{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none;width:38px}'+
    '.ce-gchip{font-size:10px;font-weight:800;margin-left:2px}'+
    '.ce-mm{display:none}'+'.ce-mm-b{display:none;font-size:9px;font-weight:700;color:var(--mu);white-space:nowrap}'+'.ce-evwrap[data-mm="on"][data-g="yoy"] .ce-mm-b.yoy{display:inline}'+'.ce-evwrap[data-mm="on"][data-g="qoq"] .ce-mm-b.qoq{display:inline}'+'.ce-mrow{display:none;align-items:baseline;gap:5px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--bdr)}'+'.ce-evwrap[data-mm="on"] .ce-mrow{display:flex}'+'.ce-mrow-l{font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none}'+'.ce-mrow-v{font-size:11px;font-weight:900;color:'+PURPLE+';font-variant-numeric:tabular-nums}'+
    '.ce-evwrap[data-mm="on"] .ce-mm{display:inline}'+
    '.ce-nocons{font-size:8.5px;font-weight:800;color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:1px 6px;margin-left:6px}'+
    /* the growth lens: CSS-driven, so switching does not re-render the grid */
    '.ce-evwrap[data-g="yoy"] .ce-gq,.ce-evwrap[data-g="qoq"] .ce-gy,'+
    '.ce-evwrap[data-g="off"] .ce-gy,.ce-evwrap[data-g="off"] .ce-gq{display:none}'+
    '.ce-gseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.ce-gseg button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+
    '.ce-gseg button.active{background:var(--navy);color:#fff}'+'.ce-vdf{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+'.ce-vdf button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+'.ce-vdf button.active{background:var(--navy);color:#fff}'+
    '.ce-fz[data-ev="cons"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdu="inline"]){display:none}'+
    '.ce-dbt{display:flex;flex-direction:column;gap:5px}'+
    '.ce-dbt-r{display:grid;grid-template-columns:1.3fr 1fr 1fr 70px;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:9px;padding:7px 12px;background:#fff}'+
    '.ce-dbt-r.above{border-left-color:#0a8f4c}.ce-dbt-r.below{border-left-color:'+RED+'}'+
    '.ce-dbt-k{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-dbt-v{font-size:11px;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-dbt-v b{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-dbt-d{font-size:12px;font-weight:900;text-align:right;font-variant-numeric:tabular-nums}'+
    '.ce-dbt-r.above .ce-dbt-d{color:#0a8f4c}.ce-dbt-r.below .ce-dbt-d{color:'+RED+'}'+
    '.ce-dbt-none{border:1px dashed var(--bdr);border-radius:10px;padding:10px 13px;font-size:11px;'+
      'line-height:1.55;color:var(--mu);background:#FAFBFD}'+
    '@media(max-width:640px){.ce-dbt-r{grid-template-columns:1fr auto}.ce-dbt-v{display:none}}'+
  '</style>';
}

function ceSetupBody(c){
  var h=ceStyle()+ceGridStyle();
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{}, hasGrid=(CE_CONS.q.indexOf(u.q)>=0);
    if(hasGrid){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?((frozen?'Reported <b>':'Reports <b>')+esc(u.date)+'</b>.'):'')+'</p>';
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="ce-ev-pill active" data-ceev="cons">Consensus</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="us">Summit</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="both">Both</button>'+
        '</span>'+
        // Growth lens. `fq-3` and `fq0` are both reported actuals, so the same consensus cell can
        // be read against either base — that is exactly why the archive carries fq-3.
        '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
          '<button type="button" data-ceg="qoq">QoQ</button>'+
          '<button type="button" data-ceg="off">Off</button></span>'+
        '<span class="ce-gseg"><button type="button" data-cemm="on">Margin</button>'+
          '<button type="button" class="active" data-cemm="off">Hide mgn</button></span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="ce-evwrap" data-ev="cons" data-g="yoy">';
      b+='<div class="ce-row-cap">Headline — every company, always</div>'+ceGrid(u,'head');
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — GOOGL</div>'+ceGrid(u,'cust');
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Growth chips are computed from the archive: <b>YoY</b> against <code>fq-3</code>, <b>QoQ</b> against <code>fq0</code> — both reported actuals. '+
         '<b>Street</b> = Bloomberg (BST), hardcoded from the export only. <b>Summit</b> = our own expectation. <b>?</b> = a number with a caveat worth knowing. '+
         'A line with no chip either has no like-for-like base or failed the basis test.</div>';
      // ── The debate — a LINE-BY-LINE comparison, not a paragraph ────────────────────────────
      // It answers one question: where does Summit differ from the Street, and by how much. Built
      // from the same two columns the grid shows, so it cannot disagree with them. Lines where we
      // have no number of our own are listed explicitly rather than silently dropped — an empty
      // Summit column IS the state of the work, and hiding it would misrepresent it (§6a-ii).
      var d=st.debate, dqi=CE_CONS.q.indexOf(u.q), dus=st.us||{};
      if(dqi>=0){
        var diffs=[], nous=[];
        CE_CONS.m.forEach(function(m){
          var c=m.qr[dqi]?m.qr[dqi][3]:null, uv=dus[m.k]?dus[m.k].v:null;
          if(c==null) return;
          if(uv==null){ nous.push(m.k); return; }
          diffs.push({ k:m.k, c:c, u:uv, d:((uv/c-1)*100), t:m.t, un:m.u });
        });
        diffs.sort(function(x,z){ return Math.abs(z.d)-Math.abs(x.d); });
        b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The debate — where Summit differs from the Street</b>'+
           '<span style="color:var(--mu);font-weight:600;font-size:10px"> · sorted by the size of the gap</span></div>';
        if(diffs.length){
          b+='<div class="ce-dbt">'+diffs.map(function(x){
            var side=(x.d>=0)?'above':'below';
            return '<div class="ce-dbt-r '+side+'">'+
              '<span class="ce-dbt-k">'+esc(x.k)+'</span>'+
              '<span class="ce-dbt-v"><b>Street</b> '+ceFmtV(x.un,x.c)+'</span>'+
              '<span class="ce-dbt-v"><b>Summit</b> '+ceFmtV(x.un,x.u)+'</span>'+
              '<span class="ce-dbt-d">'+(x.d>=0?'+':'−')+Math.abs(x.d).toFixed(1)+'%</span></div>';
          }).join('')+'</div>';
        }
        if(nous.length){
          b+='<div class="ce-dbt-none"><b>No Summit number yet on '+nous.length+' of '+(nous.length+diffs.length)+' lines:</b> '+
             esc(nous.join(' · '))+'.<br>Until those are filled the debate is the Street against itself — '+
             'the grid above still shows what it expects, and the track record below shows how often it has been wrong.</div>';
        }
        if(d&&d.synth) b+='<div class="ce-synth">'+d.synth+'</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    }
    if(st.pricedIn||st.oneLiner){
      if(!hasGrid){
        b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
        if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      } else {
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The contemporaneous read — written before the print, never rewritten</b></div>';
      }
      if(st.pricedIn) b+='<div class="ce-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="ce-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  h+=ceAnnualBody();
  return h;
}
// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; GOOGL does not, so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (SPOT_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.

// A1 · The annual picture — how the FY has looked, and what BBG vs Summit expect for the ones
// still open. Reported FY actuals are bars/line; the forward years carry two forward points,
// Bloomberg consensus (our txt) and Summit (the DCF, most-recent annual snapshot). If the company
// gave numeric FY guidance we would add a third; GOOGL does not, so we say so. (§6a-viii.)
// Quarterly is deliberately NOT wired yet — see the rules; the annual forecast is what exists today.
// ── The Setup chart IS the Results engine (js/results.js), one MERGED section (SPOT_SETUP dataset),
// rendered inside Earnings > Setup — the SAME chart + integrated table + period-lever + margin lines
// as the Results tab, clubbed into one (§6a-viii-bis, v2.9). The section key 'setup' keeps its engine
// canvases/tables/sliders UNIQUE, so the two engine instances (Setup + Results) coexist on the page.
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit pending): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('SPOT_SETUP')+'</div>';
}

function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }

function wireCeAnnual(root){ /* the engine self-wires via initResults->wireResults; the chart builds on Setup visibility (gBuildCeAnnual). */ }

// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// v3 (Jul 2026): the list is OURS, not the model's, and it is backed by the WL_ROWS table above.
// One card per row. idSfx keeps pop-up ids unique between the per-quarter and the cross-quarter
// (flat) renders; qLabel shows the quarter chip in the flat view; editable adds the ✎/✕ controls
// (live quarter only — frozen quarters are the historical record and stay read-only).

// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
// v3 (Jul 2026): the list is OURS, not the model's, and it is backed by the WL_ROWS table above.
// One card per row. idSfx keeps pop-up ids unique between the per-quarter and the cross-quarter
// (flat) renders; qLabel shows the quarter chip in the flat view; editable adds the ✎/✕ controls
// (live quarter only — frozen quarters are the historical record and stay read-only).
function ceWatchItem(w, qk, idSfx, qLabel, editable){
  var deep='';
  if(w.seededBy) deep+='<p style="border-left:3px solid '+PURPLE+';padding-left:9px;margin-bottom:10px"><b>'+(w.seededBy.tripped?'Seeded by a TRIPPED trigger':'Seeded by')+' '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>';
  // `definition` renders on the card itself now, so it is deliberately NOT repeated in here.
  if(w.src) deep+='<p><b>Why it earned a slot:</b> '+w.src+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?ceReg('watchwhy-'+(w.id||qk+'-'+(w.rank||0))+idSfx, esc(w.theme), deep):null;
  // No rank badge on the card by design (v2.6): a visible 1–5 goes stale the moment a theme is
  // removed, and renumbering the survivors implies a re-ranking we did not do. `rank` orders only.
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  // The chain, made visible: this item exists because the PRIOR quarter's call left it open.
  var seed=w.seededBy?'<span class="ce-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ thesis line broke in '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
  var open=wlOpen(w);
  var ctl=editable?'<span class="ce-w-ctl"><button type="button" class="ce-w-ed" data-wledit="'+esc(w.id||'')+'" title="Edit this theme (and close its hook by filling Tracking until)">✎</button>'+
    '<button type="button" class="ce-w-del" data-wldel="'+esc(w.id||'')+'" title="Remove this theme">✕</button></span>':'';
  return '<div class="ce-w" data-wltags="'+esc(tagsAttr)+'" data-wlid="'+esc(w.id||'')+'" data-wlopen="'+(open?'1':'0')+'">'+
    '<div class="ce-w-top"><span class="ce-w-dot" aria-hidden="true"></span><div class="ce-w-metric">'+esc(w.theme)+'</div>'+seed+
    (w.trackUntil?'<span class="ce-w-closed" title="Hook closed in '+esc(w.trackUntil)+'">closed</span>':'')+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(66,133,244,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="ce-why-btn ov-clickable" data-detail="ce:'+why+'" style="margin:0">'+(w.thread?'the thread':'background')+' ›</span>':'')+ctl+'</div>'+
    (w.definition?'<div class="ce-w-def">'+w.definition+'</div>':'')+
    '<div class="ce-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="ce-w-chip tag">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.trackSince?'<span class="ce-w-chip since"><b>Tracking since:</b> '+esc(w.trackSince)+'</span>':'')+
      (w.trackUntil?'<span class="ce-w-chip until"><b>Tracking until:</b> '+esc(w.trackUntil)+'</span>':'')+
    '</div>'+
  '</div>';
}
// The Add / Edit form. Tags are picked from the existing vocabulary (multi-select chips) and new
// ones can be created inline — a new tag is appended to the filter bar, so it becomes available
// to every theme from that moment on.
// The tracking-since / tracking-until fields are DROPDOWNS, not free text. A hand-typed
// "Q3 26" / "3Q2026" / "Q3-2026" breaks the open/closed filter and the cross-quarter sort
// silently, and the value is only ever one of a known, short list. Range: Q1 2024 through the
// quarter Earnings is currently on, derived from CALL_EARNINGS so it advances by itself (§6a-v).

// The Add / Edit form. Tags are picked from the existing vocabulary (multi-select chips) and new
// ones can be created inline — a new tag is appended to the filter bar, so it becomes available
// to every theme from that moment on.
// The tracking-since / tracking-until fields are DROPDOWNS, not free text. A hand-typed
// "Q3 26" / "3Q2026" / "Q3-2026" breaks the open/closed filter and the cross-quarter sort
// silently, and the value is only ever one of a known, short list. Range: Q1 2024 through the
// quarter Earnings is currently on, derived from CALL_EARNINGS so it advances by itself (§6a-v).
function ceQuarterOpts(sel, blankLabel){
  var latest=CALL_EARNINGS.quarters[0] ? ceQnum(CALL_EARNINGS.quarters[0].q) : null;
  var start=2024*4+1;                                  // Q1 2024
  var end=latest||(2026*4+3);
  var out='<option value="">'+esc(blankLabel||'—')+'</option>';
  for(var t=end; t>=start; t--){
    var lab='Q'+(((t-1)%4)+1)+' '+Math.floor((t-1)/4);
    out+='<option value="'+esc(lab)+'"'+(sel===lab?' selected':'')+'>'+esc(lab)+'</option>';
  }
  return out;
}

function ceWlForm(){
  return '<div class="ce-wl-addform" hidden>'+
    '<div class="ce-wl-fh"><b class="ce-wl-fh-t">New theme</b><span class="ce-wl-fh-s">the hunt list is ours — the model does not get a vote on this tab</span></div>'+
    '<input type="hidden" data-wlf="id">'+
    '<label class="ce-wl-lb">Theme <span>what we are hunting</span></label>'+
    '<input class="ce-wl-in" data-wlf="theme" placeholder="e.g. Regulatory: DOJ ad-tech remedies">'+
    '<label class="ce-wl-lb">Tags <span>click to select · they drive the cross-quarter filter</span></label>'+
    '<div class="ce-wl-tagpick" data-wlf="tagpick"></div>'+
    '<div class="ce-wl-newtag"><input class="ce-wl-in" data-wlf="newtag" placeholder="create a new tag (e.g. regulatory)"><button type="button" class="ce-wl-newtag-go">+ add tag</button></div>'+
    '<label class="ce-wl-lb">Definition <span>required — what the theme means, in our words</span></label>'+
    '<textarea class="ce-wl-in ce-wl-ta" data-wlf="definition" rows="3" placeholder="What this theme is and why it moves the thesis"></textarea>'+
    '<div class="ce-wl-2col">'+
      '<div><label class="ce-wl-lb">Tracking since</label><select class="ce-wl-in" data-wlf="trackSince">'+ceQuarterOpts(null,'— pick a quarter —')+'</select></div>'+
      '<div><label class="ce-wl-lb">Tracking until <span>empty = still open</span></label><select class="ce-wl-in" data-wlf="trackUntil">'+ceQuarterOpts(null,'— still open —')+'</select></div>'+
    '</div>'+
    '<div class="ce-wl-frow"><button type="button" class="ce-wl-add-go">Add to the live list</button>'+
      '<button type="button" class="ce-wl-cancel">cancel</button>'+
      '<span class="ave-subh-note">Lives for this session only. Persisting = COPY the table at the bottom and hardcode it into <code>WL_ROWS</code>.</span></div>'+
  '</div>';
}
// The table itself — the storage view, and the round-trip out. Regenerated from WL_ROWS on every
// add / edit / delete, with COPY (TSV, pasteable) and COPY JSON (exact, hardcodable).
// `rank` is the sort key, labelled "order" — it is never rendered on a card, so removing a theme
// cannot leave a gap in a visible numbering.

// The table itself — the storage view, and the round-trip out. Regenerated from WL_ROWS on every
// add / edit / delete, with COPY (TSV, pasteable) and COPY JSON (exact, hardcodable).
// `rank` is the sort key, labelled "order" — it is never rendered on a card, so removing a theme
// cannot leave a gap in a visible numbering.
var WL_COLS=[
  {k:'id',l:'id'},{k:'q',l:'quarter'},{k:'rank',l:'order'},{k:'theme',l:'theme'},
  {k:'tags',l:'tags'},{k:'definition',l:'definition'},
  {k:'trackSince',l:'tracking since'},{k:'trackUntil',l:'tracking until'}
];

function wlCellText(r, k){
  var v=r[k];
  if(k==='tags') return (v||[]).join(', ');
  if(v==null) return '';
  return String(v).replace(/<[^>]+>/g,'');
}
// The live proof that the table tracks the cards: both numbers move as rows are added, closed or
// deleted. It is re-rendered by the same rerender() that rebuilds the rows.

// The live proof that the table tracks the cards: both numbers move as rows are added, closed or
// deleted. It is re-rendered by the same rerender() that rebuilds the rows.
function wlCount(){
  var open=WL_ROWS.filter(wlOpen).length;
  return WL_ROWS.length+' rows · '+open+' open hook'+(open===1?'':'s')+' · live';
}

function ceWlTableRows(){
  return WL_ROWS.map(function(r){
    return '<tr'+(wlOpen(r)?' class="wl-open"':'')+'>'+WL_COLS.map(function(c){
      var t=wlCellText(r,c.k);
      var cls=(c.k==='theme')?' class="wl-th"':((c.k==='id'||c.k==='q'||c.k==='rank')?' class="wl-key"':'');
      return '<td'+cls+'>'+(t?esc(t):'<span class="ce-empty">—</span>')+'</td>';
    }).join('')+'</tr>';
  }).join('');
}

function ceWlTable(){
  return '<div class="ce-wl-tbl-wrap" id="googlWlTable">'+
    '<div class="ce-wl-tbl-h">'+
      '<span class="ce-wl-tbl-t">The Watch List table — one row per theme</span>'+
      '<span class="ce-wl-tbl-s">the storage view</span>'+
      // Replaces the old "refresh" button, which was a no-op: the table already rebuilds on every
      // add / edit / delete, so pressing it could never change anything and just read as broken.
      // This counter DOES change (rows, and how many hooks are open), which is the actual proof.
      '<span class="ce-wl-tbl-n">'+wlCount()+'</span>'+
      // Hiding the table must NOT disable the round-trip: COPY builds its payload from WL_ROWS,
      // never from the rendered rows, so it works whether or not the table is on screen (§6a-v).
      '<button type="button" class="ce-wl-copy alt" data-wltoggle="1">show table</button>'+
      '<button type="button" class="ce-wl-copy" data-wlcopy="tsv">COPY</button>'+
      '<button type="button" class="ce-wl-copy alt" data-wlcopy="json">copy JSON</button>'+
    '</div>'+
    '<div class="ce-wl-tbl-sc" data-wltblbody hidden>'+'<table class="ce-wl-tbl"><thead><tr>'+
      WL_COLS.map(function(c){ return '<th>'+esc(c.l)+'</th>'; }).join('')+
    '</tr></thead><tbody class="ce-wl-tbody">'+ceWlTableRows()+'</tbody></table></div>'+
    '<div class="ave-subh-note" style="margin-top:7px"><b>The round-trip:</b> add / edit / delete themes above → this table updates → hit <b>COPY</b> (tab-separated, drops straight into a sheet) or <b>copy JSON</b> (exact) → paste it back and it gets hardcoded into <code>WL_ROWS</code> in a commit. Editing from the portal <i>persistently</i> needs Supabase — pending assignment, see docs/EARNINGS_CONVENTIONS.md §6f.</div>'+
  '</div>';
}

function ceWatchBody(c){
  var h=ceStyle();
  // A one-line reminder of the append-only cadence, above the theme filter.
  h+='<div class="ce-wl-hint">🔁 <b>How quarters advance:</b> a new <i>upcoming</i> quarter appears in Setup & Watch List <b>only once the prior quarter\'s Post-Results (print + call highlights) is filled</b>. Fill Q(n) Post-Results → then Q(n+1) opens for prep.</div>';
  // ── Tag bar: select themes ACROSS quarters (multi-select). Empty selection = per-quarter view. ──
  h+='<div class="ce-wl-tagbar"><span class="ce-wl-bar-k">Filter by theme (across quarters):</span>'+
    wlTags().map(function(t){ return '<button type="button" class="ce-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="ce-wl-tag ce-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="ce-wl-add-btn">+ Add theme</button>'+
  '</div>';
  // ── Tracking-window filter: the hooks we have open vs the ones we closed. ──
  h+='<div class="ce-wl-tagbar" style="margin-top:-4px"><span class="ce-wl-bar-k">Tracking window:</span>'+
    '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
      '<button type="button" class="ce-wl-win active" data-wlwin="all">All</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="open">Open hooks</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="closed">Closed</button>'+
    '</span>'+
    '<span class="ave-subh-note" style="margin-left:4px">A theme is <b>open</b> while it has a <i>Tracking since</i> and no <i>Tracking until</i>. We open and close them by hand.</span>'+
  '</div>';
  h+=ceWlForm();
  // Per-quarter blocks (default view). The live quarter renders only OPEN hooks — that IS the list.
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var wl=wlFor(u.q, !frozen);
    b+='<p class="ov-lede"><b>'+(frozen?'The list as it was frozen — ':'Things to hunt — ')+esc(u.q)+'</b>'+
      (frozen?' <span style="color:var(--mu);font-weight:600">(scored afterwards in Post-Results)</span>':' <span style="color:var(--mu);font-weight:600">(the open hooks — a <i>Tracking since</i> with no <i>Tracking until</i>)</span>')+
      '. Each card carries its <b>definition</b> — what the theme means in our words — its <b>tags</b>, and its <b>tracking window</b>. Tap <b>the thread ›</b> for the grounding and the quarter-by-quarter evolution. Ordered by weight, deliberately <b>not numbered</b>: a visible 1–5 goes stale the moment a theme is removed.</p>';
    b+='<div class="ce-legend"><span class="ce-legend-i"><b>How to read the cards:</b></span>'+
      '<span class="ce-legend-i"><span class="ce-seed">left open by Q2 2026</span> it is on the list because last quarter\'s call did not settle it</span>'+
      '<span class="ce-legend-i"><span class="ce-w-chip since"><b>Tracking since:</b> Q4 2024</span> with no <i>Tracking until</i> ⇒ the hook is still open</span>'+
      (frozen?'':'<span class="ce-legend-i"><span class="ce-w-ed" style="pointer-events:none">✎</span> edit — including closing the hook by filling <i>Tracking until</i></span>')+
    '</div>';
    if(!wl.length){ b+='<div class="ce-note">No open hooks for '+esc(u.q)+' yet — add themes with <b>+ Add theme</b> above.</div>'; }
    else{ b+='<div class="ce-watch">'+wl.map(function(w){ return ceWatchItem(w, qk, '', null, !frozen); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results; its <code>newQuestions</code> seeded the next quarter.':'Ours to curate: Post-Results lets the model run (numbers + call highlights), but what earns a slot here is our call. Frozen once the quarter opens.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  // Flat cross-quarter container (hidden until a tag is selected)
  h+='<div class="ce-wl-all" hidden>';
  h+='<div class="ce-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="ce-watch">'+WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('')+'</div>';
  h+='</div>';
  // ── The table: the storage view + the copy-out that closes the loop back into the code. ──
  h+=ceWlTable();
  // ── FUSED: the full multi-year theme record (was the standalone Evolution ▸ Earnings Calls tab,
  // dissolved Jul 2026 — no two tabs on the same call highlights). Lives here, under the Watch List. ──
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="ce-band" style="--bc:'+BRAND+'"><span class="ce-band-i">▤</span><span class="ce-band-t">The theme record — every thread, across all calls</span><span class="ce-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="ce-band-l"></span></div>';
  h+=callsBody();
  h+='</div>';
  return h;
}
// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
// Scorecard result kinds. beat/miss/inline score against a consensus line; `nodisc` (a KPI
// management STOPPED disclosing) and `nocons` (a number nobody modelled) are not beats or misses —
// they are their own signal, and conflating them with a miss loses the point.

// Rows for one quarter. The LIVE (upcoming) quarter shows only OPEN hooks — a trackSince with no
// trackUntil. Frozen quarters show their record exactly as it stood. `rank` orders, never labels.
function wlFor(qLabel, openOnly){
  return WL_ROWS.filter(function(r){
    if(r.q!==qLabel) return false;
    if(openOnly && r.trackUntil) return false;
    return true;
  }).sort(function(a,z){
    var ar=(typeof a.rank==='number')?a.rank:99, zr=(typeof z.rank==='number')?z.rank:99;
    return ar-zr;
  });
}

function wlOpen(r){ return !!(r.trackSince && !r.trackUntil); }
// Every tag in use, across every quarter — the vocabulary of the filter bar. New tags created in
// the Add-theme form are appended live so they become available to everyone.

// Every tag in use, across every quarter — the vocabulary of the filter bar. New tags created in
// the Add-theme form are appended live so they become available to everyone.
function wlTags(){
  var set=[], seen={};
  WL_ROWS.forEach(function(r){ (r.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); });
  return set.sort();
}

function wlById(id){ for(var i=0;i<WL_ROWS.length;i++){ if(WL_ROWS[i].id===id) return WL_ROWS[i]; } return null; }

function wlNextId(){
  var mx=0; WL_ROWS.forEach(function(r){ var m=/^wl(\d+)$/.exec(r.id||''); if(m && +m[1]>mx) mx=+m[1]; });
  return 'wl'+String(mx+1).padStart(3,'0');
}
// Next sort slot for a quarter — keeps new rows at the end without ever renumbering the others.

// Next sort slot for a quarter — keeps new rows at the end without ever renumbering the others.
function wlNextRank(qLabel){
  var mx=0; WL_ROWS.forEach(function(r){ if(r.q===qLabel && typeof r.rank==='number' && r.rank>mx) mx=r.rank; });
  return mx+1;
}

// (Promise Tracker dissolved Jul 2026 — promise-type items now live as tracked themes inside the
// Watch List `thread`s and in Evolution ▸ Earnings Calls.)
// Scorecard result kinds. beat/miss/inline score against a consensus line; `nodisc` (a KPI
// management STOPPED disclosing) and `nocons` (a number nobody modelled) are not beats or misses —
// they are their own signal, and conflating them with a miss loses the point.
var CE_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };

var CE_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
// ─── The frozen Street number, straight from the archive ────────────────────────────────────────
// "Frozen expectations" used to mean whatever prose someone typed into `scorecard[].cons` before
// the print ("high-teens growth modeled"). That is a memory, not a record. The archive gives us
// the real thing: the snapshot immediately BEFORE the print carries the consensus that actually
// stood going in, so the comparison is reconstructed from data instead of recalled.
// Renders as a tile strip at the top of Post-Results. Revenue shows no surprise — different basis.
// ─── cePrintBlock · THE print, in one place ─────────────────────────────────────────────────────
// Formerly two blocks that said the same thing twice: the archive "frozen strip" (consensus →
// print, 13 standardized lines) and a hand-authored "scorecard — ranked by surprise". Merged.
// The archive is the spine — every number and every surprise is computed from BBG_CONSENSUS.txt,
// so it cannot drift. The hand-authored layer contributes only what a number cannot: a per-metric
// note (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`). Any
// bespoke row that is NOT one of the standardized metrics (an old "funding flip" card, a
// disclosure with no consensus like Gemini app MAU) is intentionally dropped — the standardized
// view is the metrics the archive tracks, ranked by how far each landed from the Street. (§6a-ii.)

// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
// ─── The frozen Street number, straight from the archive ────────────────────────────────────────
// "Frozen expectations" used to mean whatever prose someone typed into `scorecard[].cons` before
// the print ("high-teens growth modeled"). That is a memory, not a record. The archive gives us
// the real thing: the snapshot immediately BEFORE the print carries the consensus that actually
// stood going in, so the comparison is reconstructed from data instead of recalled.
// Renders as a tile strip at the top of Post-Results. Revenue shows no surprise — different basis.
// ─── cePrintBlock · THE print, in one place ─────────────────────────────────────────────────────
// Formerly two blocks that said the same thing twice: the archive "frozen strip" (consensus →
// print, 13 standardized lines) and a hand-authored "scorecard — ranked by surprise". Merged.
// The archive is the spine — every number and every surprise is computed from BBG_CONSENSUS.txt,
// so it cannot drift. The hand-authored layer contributes only what a number cannot: a per-metric
// note (`results.notes[metric]`) and the frozen-Watch-List rank (`results.watch[metric]`). Any
// bespoke row that is NOT one of the standardized metrics (an old "funding flip" card, a
// disclosure with no consensus like Gemini app MAU) is intentionally dropped — the standardized
// view is the metrics the archive tracks, ranked by how far each landed from the Street. (§6a-ii.)
function ceVerdict(m, c, a, surp){
  if(a==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(c==null) return {l:'no est.', c:'#7A5AF8', k:'noest'};       // nocons / noact: a print, nothing to score
  if(surp==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(Math.abs(surp)<2) return {l:CE_RES.inline.l, c:CE_RES.inline.c, k:'inline'};
  return surp>0 ? {l:CE_RES.beat.l, c:CE_RES.beat.c, k:'beat'} : {l:CE_RES.miss.l, c:CE_RES.miss.c, k:'miss'};
}

function cePrintBlock(qLabel, r, us){
  var qi=CE_CONS.q.indexOf(qLabel); if(qi<0) return '';
  r=r||{}; us=us||{};
  var notes=r.notes||{}, watch=r.watch||{};
  // Revenue for the quarter — the margin denominator (§6a-vi). Street, Summit, and the print.
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null, revA=revM?revM.qa[qi]:null;
  var revS=(us['Revenue']&&us['Revenue'].v!=null)?us['Revenue'].v:revC;   // Summit revenue, else BBG
  var tiles=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;   // Summit's FROZEN expectation for this line
    if(c==null&&a==null&&uexp==null) return null;
    // Surprise = actual / expected − 1, computed for BOTH bases. The estimate-view toggle (vs Street
    // ⇄ vs Summit) swaps which one drives the expected value, the surprise and the verdict.
    var cSurp=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uSurp=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    var cV=ceVerdict(m,c,a,cSurp), uV=ceVerdict(m,uexp,a,uSurp);
    // growth against the print, both bases — the shared YoY/QoQ lens (independent of the estimate view)
    var g=function(base){
      var bv=(base==='qoq')?m.qq[qi]:m.qy[qi];
      if(a==null||bv==null||!bv) return '<span class="ce-fz-g-e">—</span>';
      var gv=Math.round((a/bv-1)*100);
      return '<span style="color:'+(gv>=0?'#0a8f4c':'#C5221F')+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
    };
    var surpTag=function(s){ return (s==null)?'':'<span class="ce-fz-d '+(s>=0?'up':'dn')+'">'+(s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%</span>'; };
    // MARGIN (GP/OpInc/EBITDA only) — toggled, and it is EXPECTED-vs-REALIZED, not YoY/QoQ. Expected
    // = the margin IMPLIED by the estimate (estimate's metric ÷ estimate's revenue, same estimate on
    // both sides): Street = c/revC, Summit = uexp/revS. Realized = the print's own (a/revA). We show
    // the gap in pts. Basis caveat (see the ? pop-up): the Street's forward revenue runs below the
    // print, so the Street-implied margin sits above realized by construction — the Δ is partly that.
    var mgnOn=CE_MARGIN_ON[m.k], mReal=mgnOn?ceMarginPct(a,revA):null;
    var mExpC=mgnOn?ceMarginPct(c,revC):null, mExpU=mgnOn?ceMarginPct(uexp,revS):null;
    var dPts=function(exp){ if(mReal==null||exp==null) return ''; var d=Math.round((mReal-exp)*10)/10;
      return '<span class="ce-fz-mdl '+(d>=0?'up':'dn')+'">'+(d>=0?'+':'−')+Math.abs(d)+' pts</span>'; };
    var mRow='';
    if(mgnOn&&mReal!=null){
      mRow='<div class="ce-fz-mrow"><span class="ce-fz-gl">margin</span>'+
        '<span class="ce-fz-mexp ce-exp-cons">exp '+(mExpC!=null?mExpC+'%':'—')+dPts(mExpC)+'</span>'+
        '<span class="ce-fz-mexp ce-exp-us">exp '+(mExpU!=null?mExpU+'%':'—')+dPts(mExpU)+'</span>'+
        '<span class="ce-fz-ar">→</span><span class="ce-fz-mreal">'+mReal+'% realized</span>'+
        ceQ('mgn-'+ceQkey(qLabel)+'-'+ceQkey(m.k),'Margin — expected vs realized',
          '<p><b>Expected</b> is the margin <i>implied by the estimate</i>: the estimate\'s metric ÷ the estimate\'s own revenue (Street = BBG ÷ BBG, Summit = ours ÷ ours). <b>Realized</b> is the print\'s own margin (actual ÷ actual). This is expectation vs outcome for the quarter — <b>there is no YoY/QoQ on the margin</b>.</p>'+
          '<p><b>Basis caveat:</b> the Street\'s forward revenue runs materially <i>below</i> the print (FX + gross-vs-net), so the Street-implied margin sits above the realized one by construction. Read the Δ with that offset in mind — part of a negative gap is the revenue basis, not a margin miss.</p>')+
        '</div>';
    }
    var note=notes[m.k];
    var qb=note?ceReg('resnote-'+ceQkey(qLabel)+'-'+ceQkey(m.k), note.t||m.k, note.h||note):null;
    // watch[m.k] is the frozen Watch-List RANK; resolve it to the theme text for the chip.
    var wrRank=watch[m.k], wrTheme=null;
    if(wrRank){ var wrow=wlFor(qLabel,false).filter(function(x){ return x.rank===wrRank; })[0]; wrTheme=wrow?wrow.theme:null; }
    var wr=wrTheme||(wrRank?('Watch #'+wrRank):null);
    // data-vdc / data-vdu carry BOTH verdicts so the verdict filter is estimate-view-aware in pure CSS.
    return { sort:(cSurp==null?-1:Math.abs(cSurp)), html:
      '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'"'+(qb?' data-detail="ce:'+qb+'"':'')+'>'+
        '<div class="ce-fz-k">'+esc(m.k)+
          '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+'</span>'+
          '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+'</span></div>'+
        '<div class="ce-fz-r"><span class="ce-fz-c ce-exp-cons">'+(c==null?'—':ceTkFmt(m.u,c))+'</span>'+
          '<span class="ce-fz-c ce-exp-us">'+(uexp==null?'—':ceTkFmt(m.u,uexp))+'</span>'+
          '<span class="ce-fz-ar">→</span><span class="ce-fz-a">'+(a==null?'—':ceTkFmt(m.u,a))+'</span>'+
          '<span class="ce-fz-dw ce-exp-cons">'+surpTag(cSurp)+'</span><span class="ce-fz-dw ce-exp-us">'+surpTag(uSurp)+'</span></div>'+
        '<div class="ce-fz-gr"><span class="ce-fz-gl">growth</span>'+
          '<span class="ce-gy">'+g('yoy')+'</span><span class="ce-gq">'+g('qoq')+'</span></div>'+
        mRow+
        (wr?'<div class="ce-fz-wl" title="On the frozen Watch List: '+esc(wr)+'">on the list</div>':'')+
        (qb?'<div class="ce-fz-more">＋ detail</div>':'')+
      '</div>' };
  }).filter(Boolean);
  if(!tiles.length) return '';
  tiles.sort(function(x,z){ return z.sort-x.sort; });   // biggest surprise first (Street basis)
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="off"><div class="ce-fz-h">The print — ranked by surprise'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from <code>BBG_CONSENSUS.txt</code>: the last snapshot before the print carries the consensus (<code>fq+1</code>), a later snapshot carries the print (<code>fq0</code>). Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>vs Street ⇄ vs Summit</b> — swaps which frozen expectation the print is scored against (Street = Bloomberg, Summit = ours). No "Both" — one basis at a time. Where Summit had no number, Summit view reads <b>no est.</b></li>'+
      '<li><b>Margin</b> — GP / Operating income / EBITDA carry an expected-vs-realized margin (the estimate-implied margin → the print\'s own), Δ in pts. No YoY/QoQ on the margin.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise; <b>no est.</b> where that basis had no number</li>'+
      '<li><b>on the list</b> — this line was on the Watch List we froze before the call</li></ul>'+
      '<p>Lines the archive does not track are not shown here — a disclosure with no consensus (e.g. an app-MAU rung) is a supplemental call note (below the scorecard), not a scored line.</p>')+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg" style="margin-left:auto"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button></span>'+
    '<span class="ce-gseg"><button type="button" data-fzmm="on">Margin</button>'+
      '<button type="button" class="active" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div><div class="ce-fz-g" data-vdf-host>'+tiles.map(function(t){ return t.html; }).join('')+'</div>'+
    '<div class="ce-fz-f">Expectation (frozen, 1 quarter out) → the print → the print\'s own growth. Toggle <b>vs Street ⇄ vs Summit</b> and <b>Margin</b> above. Ranked by |surprise vs Street|. Source: <code>BBG_CONSENSUS.txt</code> + Summit.</div></div>';
}
// A collapsible block — secondary depth is folded away by default so the phase reads as a page,
// not a wall. Wired by the generic `.ov-collap-h` handler already in init().

// A collapsible block — secondary depth is folded away by default so the phase reads as a page,
// not a wall. Wired by the generic `.ov-collap-h` handler already in init().
function ceFold(title, sub, body, open){
  return '<div class="ov-collap ce-fold'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+
    '<span class="ce-fold-t">'+title+'</span>'+(sub?'<span class="ce-fold-s">'+sub+'</span>':'')+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+body+'</div></div>';
}

function cePhaseStyle(){
  return '<style>'+
    '.ce-fz{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;margin-bottom:14px;background:#FBFCFE}'+
    '.ce-fz-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin-bottom:9px}'+
    '.ce-fz-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}'+
    '@media(max-width:900px){.ce-fz-g{grid-template-columns:repeat(2,1fr)}}'+
    '@media(max-width:520px){.ce-fz-g{grid-template-columns:1fr}}'+
    '.ce-fz-t{border:1px solid var(--bdr);border-radius:9px;padding:7px 9px;background:#fff}'+
    '.ce-fz-t.basis{opacity:.62}'+
    '.ce-fz-k{font-size:9.5px;font-weight:700;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.ce-fz-r{display:flex;align-items:baseline;gap:4px;margin-top:2px;font-variant-numeric:tabular-nums}'+
    '.ce-fz-c{font-size:11px;color:var(--mu);font-weight:700}'+
    '.ce-fz-ar{font-size:9px;color:var(--mu)}'+
    '.ce-fz-a{font-size:13px;font-weight:900;color:var(--navy)}'+
    '.ce-fz-d{font-size:9.5px;font-weight:800;margin-left:auto}'+
    '.ce-fz-d.up{color:#0a8f4c}.ce-fz-d.dn{color:'+RED+'}.ce-fz-d.na{color:var(--mu);font-weight:700}'+
    '.ce-fz-f{font-size:9.5px;color:var(--mu);margin-top:8px}'+'.ce-fz-t{position:relative;transition:.14s}'+'.ce-fz-t[data-detail]{cursor:pointer}'+'.ce-fz-t[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.10);transform:translateY(-1px)}'+'.ce-fz-vd{margin-left:auto;font-size:8.5px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}'+'.ce-fz-k{display:flex;align-items:center;gap:5px}'+'.ce-fz-wl{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:'+BLUE+';margin-top:5px}'+'.ce-fz-more{position:absolute;right:9px;bottom:7px;font-size:8.5px;font-weight:800;color:'+BLUE+'}'+'.ce-fz-h{display:flex;align-items:center;gap:6px}'+'.ce-fz-gr{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:9.5px;font-weight:800}'+'.ce-fz-gl{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+'.ce-fz-mgn{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:11px;font-weight:900;color:'+PURPLE+'}'+'.ce-fz-mexp{font-size:9px;font-weight:700;color:var(--mu)}'+'.ce-fz-g-e{color:var(--mu);font-weight:600}'+'.ce-fz[data-g="yoy"] .ce-gq,.ce-fz[data-g="qoq"] .ce-gy,'+'.ce-fz[data-g="off"] .ce-fz-gr{display:none}'+
    /* estimate view (vs Street ⇄ vs Summit) — pure-CSS swap of expected value, surprise & verdict */
    '.ce-fz-h{flex-wrap:wrap}'+
    '.ce-vd-us,.ce-exp-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-cons,.ce-fz[data-ev="us"] .ce-exp-cons{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-us,.ce-fz[data-ev="us"] .ce-exp-us{display:inline}'+
    '.ce-fz-dw{margin-left:auto}'+
    /* margin row — expected(estimate-implied) → realized, toggled by data-mm; NO YoY/QoQ here */
    '.ce-fz-mrow{display:none;align-items:baseline;gap:5px;margin-top:4px;padding-top:4px;border-top:1px dashed var(--bdr);font-size:9.5px;font-weight:800}'+
    '.ce-fz[data-mm="on"] .ce-fz-mrow{display:flex;flex-wrap:wrap}'+
    '.ce-fz-mreal{font-size:11px;font-weight:900;color:'+PURPLE+'}'+
    '.ce-fz-mdl{font-weight:800;margin-left:3px}.ce-fz-mdl.up{color:#0a8f4c}.ce-fz-mdl.dn{color:'+RED+'}'+
    /* folds — secondary depth, closed by default */
    '.ce-fold{border:1px solid var(--bdr);border-radius:11px;margin:0 0 10px;overflow:hidden;background:#fff}'+
    '.ce-fold .ov-collap-h{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;background:#FAFBFD;'+
      'padding:9px 13px;cursor:pointer;font-family:inherit}'+
    '.ce-fold .ov-collap-h:hover{background:#F2F6FB}'+
    '.ce-fold .ov-collap-ic{font-size:10px;color:var(--mu)}'+
    '.ce-fold-t{font-size:11px;font-weight:800;color:var(--navy)}'+
    '.ce-fold-s{font-size:10px;color:var(--mu);font-weight:600;margin-left:auto;text-align:right}'+
    '.ce-fold .ov-collap-b{padding:12px 13px}'+
    /* the print, as cards rather than full-width rows */
    '.ce-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}'+
    '@media(max-width:760px){.ce-cards{grid-template-columns:1fr}}'+
    '.ce-card{border:1px solid var(--bdr);border-left:4px solid var(--sc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff}'+
    '.ce-card-h{display:flex;align-items:center;gap:6px;flex-wrap:wrap}'+
    '.ce-card-m{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-card-v{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--sc);margin-left:auto}'+
    '.ce-card-b{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;margin-top:6px;font-size:10.5px;line-height:1.45}'+
    '.ce-card-l{color:var(--mu);font-weight:700;white-space:nowrap}'+
    '.ce-card-x{color:var(--navy)}'+
    '.ce-card-f{display:flex;align-items:center;gap:6px;margin-top:7px}'+
    '.ce-chip{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 7px;border-radius:999px}'+
    '.ce-chip.list{background:rgba(26,115,232,.12);color:'+BLUE+'}'+
    '.ce-chip.hi{background:rgba(234,67,53,.12);color:'+RED+'}'+
    '.ce-chip.md{background:rgba(251,188,5,.18);color:#7A5B02}'+
    '.ce-chip.lo{background:#EEF1F5;color:var(--mu)}'+
    /* "Also on the call" — one box, a plain list, each point a native <details> dropdown (v2.9) */
    '.ce-alsobox{margin-top:18px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    '.ce-alsobox-h{padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr);display:flex;flex-direction:column;gap:2px}'+
    '.ce-alsobox-h>b{font-size:12px;color:var(--navy);font-weight:800}'+
    '.ce-alsobox-sub{font-size:9.5px;color:var(--mu);font-weight:600;line-height:1.4}'+
    '.ce-alsolist{display:flex;flex-direction:column}'+
    '.ce-also-i{border-bottom:1px solid var(--bdr)}'+'.ce-also-i:last-child{border-bottom:0}'+
    '.ce-also-s{display:flex;align-items:center;gap:8px;padding:9px 13px;cursor:pointer;list-style:none;font-size:11.5px;font-weight:600;color:var(--navy);line-height:1.45}'+
    '.ce-also-s::-webkit-details-marker{display:none}'+
    '.ce-also-s:hover{background:#FAFBFD}'+
    '.ce-also-tag{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--tc,#6b7684);border:1px solid currentColor;border-radius:999px;padding:1px 7px;flex:none;opacity:.85}'+
    '.ce-also-hd{flex:1;min-width:0}'+
    '.ce-also-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-also-i[open] .ce-also-ar{transform:rotate(180deg)}'+
    '.ce-also-body{padding:0 13px 12px 13px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.55;background:#FBFCFE}'+
    '.ce-also-body p{margin:6px 0}'+
    /* AI call summary — collapsible outer box + always-visible lede + nested dropdowns + glossary */
    '.ce-sum{border:1px solid var(--bdr);border-radius:12px;background:#fff;margin:2px 0 14px}'+
    '.ce-sum>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:12px;background:linear-gradient(180deg,rgba(122,90,248,.06),transparent)}'+
    '.ce-sum>summary::-webkit-details-marker{display:none}'+
    '.ce-sum-ic{font-size:15px}'+'.ce-sum-h b{font-size:13px;color:var(--navy)}'+
    '.ce-sum-tag{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:'+PURPLE+';background:rgba(122,90,248,.12);border:1px solid rgba(122,90,248,.25);border-radius:999px;padding:2px 8px;margin-left:auto}'+
    '.ce-sum[open]>summary{border-bottom:1px solid var(--bdr);border-radius:12px 12px 0 0}'+
    '.ce-sum-body{padding:12px 15px 15px}'+
    '.ce-sum-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px}'+
    '.ce-sum-tt{font-size:10px;color:var(--mu);font-weight:600;margin-right:auto}'+
    '.ce-sum-btn{font-size:9.5px;font-weight:800;color:'+BLUE+';border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.12s}'+
    '.ce-sum-btn:hover{border-color:'+BLUE+';background:rgba(26,115,232,.06)}'+
    /* the summary IS the prose: visible punch paragraphs, each with its own "＋ more" expander */
    '.ce-sum-block{margin:0 0 13px}'+
    '.ce-sum-para{font-size:12.5px;line-height:1.7;color:var(--navy);font-weight:500;margin:0}'+
    '.ce-sum-more{border:0!important;background:transparent!important;border-radius:0;margin:5px 0 0}'+
    '.ce-sum-more>.ce-sum-nt{padding:2px 0;font-size:10px;font-weight:800;color:'+BLUE+';text-transform:none}'+
    '.ce-sum-more>.ce-sum-nt .ce-sum-caret{color:'+BLUE+'}'+
    '.ce-sum-more>.ce-sum-nb{padding:7px 0 4px 13px;border-left:2px dashed var(--bdr);margin-top:5px;font-size:11.5px;line-height:1.65}'+
    '.ce-sum-nodes{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sum-n{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;background:#FBFCFE}'+
    '.ce-sum-n[data-d="1"]{border-left-color:'+BRAND2+';background:#fff}'+
    '.ce-sum-n[data-d="2"]{border-left-color:'+AMBER+'}'+
    '.ce-sum-nt{list-style:none;cursor:pointer;display:flex;align-items:center;gap:7px;padding:8px 11px;font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sum-nt::-webkit-details-marker{display:none}'+
    '.ce-sum-caret{font-size:9px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-sum-n[open]>.ce-sum-nt .ce-sum-caret{transform:rotate(90deg)}'+
    '.ce-sum-nb{padding:0 12px 11px 21px;font-size:11px;line-height:1.65;color:var(--navy);font-weight:500}'+
    '.ce-sum-nb .ce-sum-nodes{margin-top:9px}'+
    /* glossary term — dashed underline, attractive hover tooltip (CSS-only, no pop-up) */
    '.ce-gl{border-bottom:1px dashed '+BLUE+';cursor:help;position:relative}'+
    '.ce-gl:hover::after{content:attr(data-def);position:absolute;left:0;bottom:calc(100% + 8px);width:min(300px,74vw);white-space:normal;text-align:left;background:#10141A;color:#fff;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 12px;border-radius:9px;box-shadow:0 10px 28px rgba(16,24,40,.28);z-index:60}'+
    '.ce-gl:hover::before{content:"";position:absolute;left:16px;bottom:calc(100% + 3px);border:5px solid transparent;border-top-color:#10141A;z-index:61}'+
    /* highlights, as cards */
    '.ce-hcards{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}'+
    '@media(max-width:760px){.ce-hcards{grid-template-columns:1fr}}'+
    '.ce-hcard{border:1px solid var(--bdr);border-top:3px solid var(--hc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-hcard:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-hcard-t{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--hc)}'+
    '.ce-hcard-h{font-size:11px;color:var(--navy);line-height:1.5;margin-top:3px}'+
    '.ce-hcard-f{display:flex;align-items:center;gap:6px;margin-top:6px}'+
    '.ce-hcard-more{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-left:auto}'+
    '.ce-bandh{display:flex;align-items:center;gap:7px;margin:12px 0 7px}'+
    '.ce-bandh-i{font-size:12px;color:var(--bc)}'+
    '.ce-bandh-t{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--bc)}'+
    '.ce-bandh-s{font-size:9.5px;color:var(--mu);font-weight:600}'+
    /* thesis red-lines — verdict word, plain line, depth behind "why" */
    '.ce-rl{display:flex;flex-direction:column;gap:5px}'+
    '.ce-rl-row{display:grid;grid-template-columns:74px 1fr auto;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid #0a8f4c;border-radius:9px;padding:8px 12px;background:#fff}'+
    '.ce-rl-row.trip{border-left-color:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-rl-v{font-size:9.5px;font-weight:900;letter-spacing:.06em;color:#0a8f4c}'+
    '.ce-rl-row.trip .ce-rl-v{color:'+RED+'}'+
    '.ce-rl-l{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-rl-w{font-size:9.5px;font-weight:800;color:'+BLUE+';white-space:nowrap;cursor:pointer}'+
    '@media(max-width:600px){.ce-rl-row{grid-template-columns:64px 1fr}.ce-rl-w{display:none}}'+
    /* what this tees up — short boxes, always visible */
    '.ce-tee{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-tee-c{border:1px solid var(--bdr);border-top:3px solid '+AMBER+';border-radius:10px;'+
      'padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-tee-c:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-tee-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-tee-m{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-top:6px}'+
    /* the triage strip — three bands, always all three, colour is the meaning */
    '.ce-tri{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 10px}'+
    '@media(max-width:700px){.ce-tri{grid-template-columns:1fr}}'+
    '.ce-tri-b{display:grid;grid-template-columns:auto auto 1fr;grid-template-areas:"i t n" "s s s";'+
      'gap:2px 7px;align-items:center;text-align:left;border:1px solid var(--bdr);border-top:3px solid var(--bc);'+
      'border-radius:10px;padding:8px 11px;background:#fff;font:inherit;cursor:pointer;transition:.14s;opacity:.45}'+
    '.ce-tri-b.active{opacity:1;box-shadow:0 2px 10px rgba(16,24,40,.07)}'+
    '.ce-tri-b:hover{border-color:var(--bc)}'+
    '.ce-tri-i{grid-area:i;font-size:12px;color:var(--bc);line-height:1}'+
    '.ce-tri-t{grid-area:t;font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:var(--bc)}'+
    '.ce-tri-n{grid-area:n;justify-self:end;font-size:11px;font-weight:900;color:var(--navy)}'+
    '.ce-tri-s{grid-area:s;font-size:9.5px;color:var(--mu);font-weight:600}'+
    '.ce-hcard-b{margin-right:5px;color:var(--hc)}'+
    '.ce-hcard[hidden]{display:none}'+
    '.ce-bandh-n{margin-left:auto;font-size:9.5px;font-weight:800;color:var(--mu)}'+
  '</style>';
}

function ceResultsBody(c){
  var h=ceStyle()+cePhaseStyle();
  h+=CALL_EARNINGS.quarters.map(function(q,qi){
    var qk=ceQkey(q.q);
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    var r=q.results;
    if(!r){ b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b></p>'+
      '<div class="ce-note">Empty until the print lands.</div></div>'; return b; }
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the print, scored against what was frozen going in.</b> '+
       'Toggle <b>vs Street ⇄ vs Summit</b> to score the print against either expectation, and <b>Margin</b> for the expected-implied → realized margin. Below the scorecard, a supplemental <i>“Also on the call”</i> aside carries the colour — not the meeting-critical items.</p>';
    // 1 · THE print — archive spine + hand-authored notes, ranked by surprise (one block now).
    // Pass the quarter's FROZEN Summit expectations (setup.us) so the print can be scored against
    // Street OR Summit via the vs-Street ⇄ vs-Summit toggle (§6a-iii).
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    // 2 · the AI-generated call summary — replaces the old one-line "take" black box (v2.10).
    b+=ceSummaryBlock(q.q, r.summary);
    // 3 · thesis red-line check — folded unless something tripped
    if(r.thesisCheck&&r.thesisCheck.length){
      // One word for the verdict, then the red-line ITSELF in plain language. The reasoning goes
      // behind "why" — it is the interesting part, but it is not what you scan for (§6a-iv).
      var tc=r.thesisCheck.slice().sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); });
      var nTrip=tc.filter(function(t){ return t.tripped; }).length;
      b+='<div class="ov-diagram-cap" style="margin:14px 0 6px"><b>Thesis red-lines</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· '+
         (nTrip?('<b style="color:'+RED+'">'+nTrip+' tripped</b> of '+tc.length):('all '+tc.length+' held'))+'</span></div>';
      b+='<div class="ce-rl">'+tc.map(function(t,i){
        var id=t.note?ceReg('rl-'+qk+'-'+i, (t.tripped?'TRIPPED — ':'HELD — ')+t.line, '<p>'+t.note+'</p>'):null;
        return '<div class="ce-rl-row'+(t.tripped?' trip':'')+'">'+
          '<span class="ce-rl-v">'+(t.tripped?'TRIPPED':'HELD')+'</span>'+
          '<span class="ce-rl-l">'+esc(t.line)+'</span>'+
          (id?'<span class="ce-rl-w ov-clickable" data-detail="ce:'+id+'">why ＋</span>':'<span></span>')+
        '</div>';
      }).join('')+'</div>';
    }
    // 5 · what the numbers tee up — VISIBLE, as short boxes. Folding it away was hiding the
    // thing you walk into the call with; the fix was to shorten it, not to bury it (§6a-iv).
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>What this tees up for the call</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· go in hunting these</span></div>';
      b+='<div class="ce-tee">'+r.intoCall.map(function(x,i){
        // Everything up to the first em-dash is the hook; the rest is the argument behind it.
        var mm=String(x).match(/^([\s\S]*?)\s+—\s+([\s\S]*)$/);
        var head=mm?mm[1]:x, body=mm?mm[2]:'';
        var id=body?ceReg('tee-'+qk+'-'+i, String(head).replace(/<[^>]+>/g,''), '<p>'+body+'</p>'):null;
        return '<div class="ce-tee-c"'+(id?' data-detail="ce:'+id+'"':'')+'>'+
          '<div class="ce-tee-h">'+head+'</div>'+
          (id?'<div class="ce-tee-m">＋ the ask</div>':'')+'</div>';
      }).join('')+'</div>';
    }
    // 6 · "Also on the call" — the supplemental colour (was the Post-Call tab, dissolved Jul 2026).
    // Deliberately styled as a secondary aside; NOT the tracking layer (that is the Watch List) and
    // NOT the meeting-critical read (that is the scorecard). Includes non-trackable call colour.
    b+=ceHighlightsBlock(q.call, qk);
    b+='<div class="ov-foot">Numbers scored against the frozen expectation — <b>Street</b> (<code>BBG_CONSENSUS.txt</code>) or <b>Summit</b> via the toggle; actuals = reported. The <i>Also on the call</i> aside is supplemental colour — the tracking layer is the Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// E · "Also on the call" ── the supplemental colour from the call, rendered inside Post-Results as a
// SINGLE BOX holding a plain LIST, each point with its own native <details> dropdown (v2.9). The
// Context/Logged band classification and the triage strip are GONE (Dani did not want them). Still
// not the meeting-critical read (that is the scorecard + the Watch List): a thesis-mover (band:'lead')
// is tracked on the Watch List and stays filtered out here. `take`/`threeMinutes`/`notBringing`/
// `newQuestions` survive as data (newQuestions still seeds the next Watch List) but are not rendered.

// E · "Also on the call" ── the supplemental colour from the call, rendered inside Post-Results as a
// SINGLE BOX holding a plain LIST, each point with its own native <details> dropdown (v2.9). The
// Context/Logged band classification and the triage strip are GONE (Dani did not want them). Still
// not the meeting-critical read (that is the scorecard + the Watch List): a thesis-mover (band:'lead')
// is tracked on the Watch List and stays filtered out here. `take`/`threeMinutes`/`notBringing`/
// `newQuestions` survive as data (newQuestions still seeds the next Watch List) but are not rendered.
function ceHighlightsBlock(cc, qk){
  if(!cc||!cc.highlights||!cc.highlights.length) return '';
  // A thesis-mover (band:'lead') is tracked on the Watch List, never here — keep filtering it out.
  var hls=cc.highlights.filter(function(x){ return (x.band||'context')!=='lead'; });
  if(!hls.length) return '';
  var b='<div class="ce-alsobox"><div class="ce-alsobox-h"><b>Also on the call</b>'+
    '<span class="ce-alsobox-sub">supplemental colour — the meeting-critical items are the scorecard above and the Watch List</span></div>'+
    '<div class="ce-alsolist">';
  b+=hls.map(function(x){
    // No tag chips (tone/curious/connects-dots/…) — just the theme and its dropdown (v2.10).
    var det=x.detail||'';
    if(x.open) det+='<p><b>Still open:</b> '+x.open+'</p>';
    return '<details class="ce-also-i">'+
      '<summary class="ce-also-s">'+
        '<span class="ce-also-hd">'+x.head+'</span>'+
        (det?'<span class="ce-also-ar">▾</span>':'')+
      '</summary>'+
      (det?'<div class="ce-also-body">'+det+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></div>';
  return b;
}

// F · The AI-generated CALL SUMMARY — the "minute" (v2.10). Replaces the old one-line black "take".
// THE SUMMARY IS THE PROSE ITSELF: several always-visible PARAGRAPHS, each landing a punch on a
// specific theme (top line, the bill, EPS, the structural new thing…). Each paragraph carries its own
// "＋ more" dropdown to go DEEPER — and that deeper content can hold NESTED context-guide dropdowns
// (dropdowns within dropdowns: drivers → segments → backlog…). It is NOT one generalist paragraph
// followed by a list. Not pop-ups — inline <details>. Technical terms are wrapped
// `<span class="ce-gl" data-def="…">term</span>` and show their definition on hover. Expand-all /
// Collapse-all toggle only the "＋ more" dropdowns, never the visible paragraphs. A SUMMARY, not a
// transcript — no roll-call of every exec.

// F · The AI-generated CALL SUMMARY — the "minute" (v2.10). Replaces the old one-line black "take".
// THE SUMMARY IS THE PROSE ITSELF: several always-visible PARAGRAPHS, each landing a punch on a
// specific theme (top line, the bill, EPS, the structural new thing…). Each paragraph carries its own
// "＋ more" dropdown to go DEEPER — and that deeper content can hold NESTED context-guide dropdowns
// (dropdowns within dropdowns: drivers → segments → backlog…). It is NOT one generalist paragraph
// followed by a list. Not pop-ups — inline <details>. Technical terms are wrapped
// `<span class="ce-gl" data-def="…">term</span>` and show their definition on hover. Expand-all /
// Collapse-all toggle only the "＋ more" dropdowns, never the visible paragraphs. A SUMMARY, not a
// transcript — no roll-call of every exec.
function ceSumNodes(nodes, depth){   // nested context-guide dropdowns inside a "＋ more"
  if(!nodes||!nodes.length) return '';
  return '<div class="ce-sum-nodes">'+nodes.map(function(n){
    return '<details class="ce-sum-n" data-d="'+(depth>2?2:depth)+'">'+
      '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+n.t+'</span></summary>'+
      '<div class="ce-sum-nb">'+(n.body||'')+ceSumNodes(n.nodes, depth+1)+'</div>'+
    '</details>';
  }).join('')+'</div>';
}

function ceSumMore(more){   // a "＋ more": deeper prose (string) or { body, nodes:[…] }
  if(!more) return '';
  if(typeof more==='string') return more;
  return (more.body||'')+ceSumNodes(more.nodes, 1);
}

function ceSummaryBlock(qLabel, s){
  if(!s||!s.paras||!s.paras.length) return '';
  var body=s.paras.map(function(pa,i){
    var p='<div class="ce-sum-block">'+
      '<p class="ce-sum-para">'+(pa.p||'')+'</p>';   // the always-visible punch paragraph
    if(pa.more){
      p+='<details class="ce-sum-n ce-sum-more" data-d="0">'+
        '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+(pa.moreLabel||'＋ more — the detail behind this')+'</span></summary>'+
        '<div class="ce-sum-nb">'+ceSumMore(pa.more)+'</div>'+
      '</details>';
    }
    return p+'</div>';
  }).join('');
  return '<details class="ce-sum" open>'+
    '<summary class="ce-sum-h"><span class="ce-sum-ic">🧠</span><b>Call summary — the minute</b>'+
      '<span class="ce-sum-tag">AI-generated</span></summary>'+
    '<div class="ce-sum-body">'+
      '<div class="ce-sum-tools"><span class="ce-sum-tt">The summary is the text; each paragraph lands a point · open <b>＋ more</b> for the detail · hover a <span class="ce-gl" data-def="A term with a dashed underline — hover it to read its definition here.">dashed term</span> for its definition</span>'+
        '<button type="button" class="ce-sum-btn" data-sum="exp">⊕ Expand all</button>'+
        '<button type="button" class="ce-sum-btn" data-sum="col">⊖ Collapse all</button></div>'+
      body+
    '</div>'+
  '</details>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — SPOT_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/GOOGL.md + GOOGL-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS CALLS — SPOT_THEMES with By theme ⇄ By quarter toggle + accordion
// (9 threads across 10 calls, Q4 2023 → Q1 2026). Same contract as ibkr/uber/lyft/cart/ma/rely/v,
// ENHANCED with a status chip per theme (trend / promise-to-reconcile / watch) — the essence of
// the dissolved Promise Tracker. Source: docs/calls/GOOGL.md + GOOGL-latest.md.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var CE_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
// A promise open for one quarter and one open for four look identical without this. Age is the
// signal: how long has it been unreconciled, or how many quarters has the silence run?

// A promise open for one quarter and one open for four look identical without this. Age is the
// signal: how long has it been unreconciled, or how many quarters has the silence run?
function ceQnum(q){ var m=String(q||'').match(/Q(\d)\s+(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }

function ceStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_EARNINGS.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=ceQnum(st.since), b=ceQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}

function callsByQuarter(){
  var map={}, order=[];
  SPOT_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qval(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qval(b)-qval(a); });
  return { order:order, map:map };
}

function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:var(--navy);color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.lpb-acc-item{border:1px solid var(--bdr);border-radius:10px;margin-bottom:8px;overflow:hidden}'+
    '.lpb-acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.lpb-acc-h:hover{background:#EEF2F6}.lpb-acc-ic{color:var(--mu);font-weight:800}'+
    '.lpb-acc-body{padding:12px 14px;display:none}.lpb-acc-item.open .lpb-acc-body{display:block}'+
    '.ov-chip{display:inline-block;font-size:10px;font-weight:800;color:'+BRAND+';background:rgba(66,133,244,0.10);border-radius:20px;padding:2px 9px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads from <b>11 earnings calls</b> (Q4 2023 → Q2 2026). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered in a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a promise open one quarter and one open four quarters are not the same thing, and a silence that has run two quarters is louder than a fresh one. Tap any row to expand.</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  h+='<div class="lpb-acc" id="googlCallsTheme">';
  SPOT_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:ct.st;
    var st=CE_THST[sk]||CE_THST.watch;
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+ceStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    h+='<p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){
      h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span>';
      h+='<ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=callsByQuarter();
  h+='<div class="lpb-acc" id="googlCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){
      h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div>';
      h+='<ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Spotify Q4 2023–Q1 2026 earnings calls and prepared remarks (docs/calls/GOOGL). Highlights are qualitative and contemporaneous — written from the perspective of each call. Promise-status themes absorb the dissolved Promise Tracker.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — data (Bloomberg export FY sums + SEC releases + the call record)
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// ═══ Earnings · Setup charts (Chart.js, lazy — the pane must be visible or offsetParent is null)
// Quarterly only. Both charts read CE_CONS and redraw on the metric pills and the range control.
function ceTkFmt(u,v){
  if(v==null) return '';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v).toFixed(1)+'B';
  if(u==='B')  return (+v).toFixed(2)+'B';
  return String(v);
}

function wireCeTrack(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  // The lens defaults are asserted here as well as in the markup — Consensus + YoY, showing YoY.
  // Belt and braces: a half-applied default reads as a broken control (§6a-ii).
  function ceSetLens(v){
    // MUST scope to [data-ceg] — a bare '.ce-gseg button' also matches the margin toggle that
    // shares the .ce-gseg pill styling, and would clear its active state (§6a-v cross-check rule).
    pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceg')===v); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-g', v); });
    pane.querySelectorAll('.ce-fz').forEach(function(f){ f.setAttribute('data-g', v); });
  }
  ceSetLens('yoy');
  pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceev')==='cons'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev','cons'); });
  // Margin default: off, and its own segment's active state set independently of the growth lens.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-cemm')==='off'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm','off'); });
  pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(btn){ btn.onclick=function(){
    ceSetLens(btn.getAttribute('data-ceg'));
  }; });
  // Margin lens (headline GP/OpInc/EBITDA only) — CSS-driven via data-mm on the wrap.
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cemm');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm', v); });
  }; });
  // Post-Results print-block toggles — scoped to their own .ce-fz so each quarter's print block is
  // independent. These are SEPARATE from the Setup's Consensus/Summit/Both (which does not apply
  // here: Post-Results has no "Both"). `vs Street ⇄ vs Summit` sets data-ev (swaps the frozen
  // expectation the print is scored against); `Margin` sets data-mm (expected-implied → realized).
  pane.querySelectorAll('.ce-gseg button[data-fzev]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzev'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-ev', v);
  }; });
  pane.querySelectorAll('.ce-gseg button[data-fzmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzmm'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-mm', v);
  }; });
}
// ═══ Deep-dive charts (Chart.js, lazy per pane) ═════════════════════════════════════════════════

// Results / Estimates panes come from the shared engine (js/results.js), driven by a per-ticker
// dataset in RESULTS_DATA. Until GOOGL's dataset (built from CE_CONS + the Summit projection export,
// per docs/RESULTS_CONVENTIONS.md §6) is registered, the engine returns '' and we show this note.
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>); it will populate once GOOGL\'s '+
    'dataset is registered in <code>RESULTS_DATA</code> (built from the CE_CONS archive + the Summit projection export, '+
    'per <code>docs/RESULTS_CONVENTIONS.md</code> §6).</div>';
}
// ═══ Sub-tab + Deep Dive tab machinery (standardized contract) ══════════════════════════════════

// Tab switches hide a tall pane and show a shorter one, so the browser clamps scrollTop and the
// page appears to jump to the top. Keep the clicked control visually anchored: measure its
// viewport position, run the change, then scroll by the delta so it does not move. (§6a-iv.)
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}

function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
// Earnings phase tabs — nested inside Evolution's earnings subpane, wired independently.
// Show only the quarter pills valid for `phase`; if the active pill just became invalid, activate
// the most-recent valid one and drive the same block-visibility the pill click would.

// Earnings phase tabs — nested inside Evolution's earnings subpane, wired independently.
// Show only the quarter pills valid for `phase`; if the active pill just became invalid, activate
// the most-recent valid one and drive the same block-visibility the pill click would.
function ceSelectQuarter(pane, qk){
  pane.querySelectorAll('.ce-qpill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceqsel')===qk); });
  pane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-ceq')!==qk); });
  pane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); });
  var flat=pane.querySelector('.ce-wl-all'); if(flat) flat.hidden=true;
}

function ceApplyPhaseQuarters(pane, phase){
  var pills=Array.prototype.slice.call(pane.querySelectorAll('.ce-qpill')), lastVisible=null, activeVisible=false;
  pills.forEach(function(b){
    var ok=(b.getAttribute('data-ceqhas')||'').split(' ').indexOf(phase)>=0;
    b.hidden=!ok;
    if(ok){ lastVisible=b; if(b.classList.contains('active')) activeVisible=true; }
  });
  // pills render newest-first, so the FIRST visible is the most recent valid quarter.
  var firstVisible=pills.filter(function(b){ return !b.hidden; })[0];
  if(!activeVisible && firstVisible) ceSelectQuarter(pane, firstVisible.getAttribute('data-ceqsel'));
}

function wireCallEarnings(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  // Call-summary Expand-all / Collapse-all — toggles only the inner dropdown nodes of THIS summary
  // box, never the always-visible lede or the outer box itself.
  pane.querySelectorAll('.ce-sum-btn').forEach(function(btn){ btn.onclick=function(e){
    e.preventDefault();
    var box=btn.closest('.ce-sum'); if(!box) return;
    var open=(btn.getAttribute('data-sum')==='exp');
    box.querySelectorAll('details.ce-sum-n').forEach(function(d){ d.open=open; });
  }; });
  pane.querySelectorAll('.ce-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cep');
    ceKeepPos(btn, function(){
    pane.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cep')!==key); });
    ceApplyPhaseQuarters(pane, key);
    });
    // Returning to Setup re-arms the Setup chart (the Results engine; canvases were hidden, so any
    // earlier build produced a zero-size chart).
    if(key==='setup') requestAnimationFrame(gBuildCeAnnual);
  }; });
  // Setup estimates toggle: Consensus ⇄ Summit ⇄ Both (CSS-driven via data-ev on the wrap)
  pane.querySelectorAll('.ce-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ceev');
    pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  // Quarter selector: one Earnings, many quarters — only the selected quarter's blocks render.
  // Picking a quarter also exits the cross-quarter tag view.
  pane.querySelectorAll('.ce-qpill').forEach(function(btn){ btn.onclick=function(){
    ceSelectQuarter(pane, btn.getAttribute('data-ceqsel'));
  }; });
  // initial phase is Setup — every quarter valid, nothing to hide, but keep it consistent.
  ceApplyPhaseQuarters(pane, 'setup');
  // Verdict filter on the print block: All / Beats / Misses / In line. Sets data-f on the tile
  // grid; CSS hides the non-matching tiles. Scoped per quarter block so the active quarter filters.
  pane.querySelectorAll('.ce-vdf button').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.parentNode, host=seg.closest('.ce-fz'); if(!host) return;
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var g=host.querySelector('.ce-fz-g'), v=btn.getAttribute('data-vdf');
    if(g){ if(v==='all') g.removeAttribute('data-f'); else g.setAttribute('data-f', v); }
  }; });
  // Band triage filter: each button shows/hides its own cards. All three start on, so the
  // reader sees the whole call and uses colour to triage; the filter is for narrowing, not for
  // hiding by default (§6a-iv). The highlight cards now live inside the Post-Results pane (the
  // Post-Call tab was dissolved Jul 2026), but the filter is pane-scoped so it still finds them.
  pane.querySelectorAll('.ce-tri-b').forEach(function(btn){ btn.onclick=function(){
    var on=btn.classList.toggle('active');
    var qk=btn.getAttribute('data-cebq'), band=btn.getAttribute('data-ceband');
    var host=pane.querySelector('.ce-hcards[data-cehl="'+qk+'"]'); if(!host) return;
    host.querySelectorAll('.ce-hcard[data-band="'+band+'"]').forEach(function(c){ c.hidden=!on; });
  }; });
  // ── Watch List v3: theme-tag filter (cross-quarter) · tracking-window filter · add/edit/delete
  // against WL_ROWS · and the table + COPY that carries the edits back into the code. ──────────
  var wpane=pane.querySelector('.ce-phpane[data-cep="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.ce-wl-all');
    var form=wpane.querySelector('.ce-wl-addform');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.ce-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function activeWin(){ var b=wpane.querySelector('.ce-wl-win.active'); return b?b.getAttribute('data-wlwin'):'all'; }
    function applyFilters(){
      var tags=activeTags(), on=tags.length>0, win=activeWin();
      // tag selection swaps the per-quarter view for the flat cross-quarter one
      if(on){ wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=true; }); }
      else{
        var act=pane.querySelector('.ce-qpill.active'); var qk=act?act.getAttribute('data-ceqsel'):null;
        wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-ceq')!==qk); });
      }
      if(flat) flat.hidden=!on;
      // both filters are card-level: tags decide WHICH themes, the window decides open vs closed
      wpane.querySelectorAll('.ce-w').forEach(function(card){
        var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
        var isOpen=card.getAttribute('data-wlopen')==='1';
        var hitTag=!on || tags.some(function(t){ return ct.indexOf(t)>=0; });
        var hitWin=(win==='all') || (win==='open'&&isOpen) || (win==='closed'&&!isOpen);
        if(hitTag&&hitWin) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
      });
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('ce-wl-clear')){ wpane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyFilters();
    }; }
    wpane.querySelectorAll('.ce-wl-tag').forEach(wireTag);
    wpane.querySelectorAll('.ce-wl-win').forEach(function(btn){ btn.onclick=function(){
      wpane.querySelectorAll('.ce-wl-win').forEach(function(b){ b.classList.toggle('active', b===btn); });
      applyFilters();
    }; });
    // Registers a tag in the filter bar (so a tag invented while writing a theme becomes available
    // to everyone) and in the form's picker.
    function registerTag(t){
      if(!wpane.querySelector('.ce-wl-tag[data-wltag="'+t+'"]')){
        var b=document.createElement('button'); b.type='button'; b.className='ce-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
        var clear=wpane.querySelector('.ce-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
      }
      var pick=form?form.querySelector('.ce-wl-tagpick'):null;
      if(pick&&!pick.querySelector('[data-pick="'+t+'"]')){
        var p=document.createElement('button'); p.type='button'; p.className='ce-wl-pick'; p.setAttribute('data-pick',t); p.textContent='#'+t;
        p.onclick=function(){ p.classList.toggle('on'); }; pick.appendChild(p);
      }
    }
    // ── the form: shared by add and edit (edit prefills and switches the button) ──
    function fld(k){ return form?form.querySelector('[data-wlf="'+k+'"]'):null; }
    function fval(k){ var el=fld(k); return el?el.value.trim():''; }
    function setF(k,v){ var el=fld(k); if(el) el.value=(v==null?'':v); }
    function pickedTags(){ return Array.prototype.map.call(form.querySelectorAll('.ce-wl-pick.on'), function(b){ return b.getAttribute('data-pick'); }); }
    function resetForm(){
      ['id','theme','definition','trackSince','trackUntil','newtag'].forEach(function(k){ setF(k,''); });
      form.querySelectorAll('.ce-wl-pick.on').forEach(function(b){ b.classList.remove('on'); });
      form.querySelector('.ce-wl-fh-t').textContent='New theme';
      form.querySelector('.ce-wl-add-go').textContent='Add to the live list';
    }
    if(form){
      wlTags().forEach(registerTag);
      var nt=form.querySelector('.ce-wl-newtag-go');
      if(nt) nt.onclick=function(){
        var raw=fval('newtag'); if(!raw) return;
        raw.split(',').forEach(function(t){
          t=t.trim().toLowerCase().replace(/\s+/g,'-'); if(!t) return;
          registerTag(t);
          var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on');
        });
        setF('newtag','');
      };
      var cancel=form.querySelector('.ce-wl-cancel');
      if(cancel) cancel.onclick=function(){ resetForm(); form.hidden=true; };
    }
    var addBtn=wpane.querySelector('.ce-wl-add-btn');
    if(addBtn&&form){ addBtn.onclick=function(){
      if(form.hidden){ resetForm(); form.hidden=false; } else form.hidden=true;
    }; }
    // Re-renders the live quarter's cards, the flat view and the table from WL_ROWS. Cheap enough
    // to do wholesale — this is a 20-row table, not a grid.
    function rerender(){
      var live=ceUpcoming(); if(!live) return;
      var qk=ceQkey(live.q);
      var host=wpane.querySelector('.ce-qblock[data-ceq="'+qk+'"] .ce-watch');
      var rows=wlFor(live.q, true);
      if(host) host.innerHTML=rows.map(function(w){ return ceWatchItem(w, qk, '', null, true); }).join('');
      var flatHost=flat?flat.querySelector('.ce-watch'):null;
      if(flatHost) flatHost.innerHTML=WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('');
      var tb=wpane.querySelector('.ce-wl-tbody');
      if(tb) tb.innerHTML=ceWlTableRows();
      var n=wpane.querySelector('.ce-wl-tbl-n');
      if(n) n.textContent=wlCount();   // the visible proof the table tracked the edit
      wireCards(); applyFilters();
    }
    // ✎ / ✕ on each live-quarter card.
    function wireCards(){
      wpane.querySelectorAll('[data-wledit]').forEach(function(btn){ btn.onclick=function(){
        var r=wlById(btn.getAttribute('data-wledit')); if(!r||!form) return;
        resetForm(); form.hidden=false;
        setF('id',r.id); setF('theme',r.theme); setF('definition',r.definition);
        setF('trackSince',r.trackSince); setF('trackUntil',r.trackUntil);
        (r.tags||[]).forEach(function(t){ registerTag(t); var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on'); });
        form.querySelector('.ce-wl-fh-t').textContent='Edit theme · '+r.id;
        form.querySelector('.ce-wl-add-go').textContent='Save changes';
        form.scrollIntoView({block:'nearest'});
      }; });
      wpane.querySelectorAll('[data-wldel]').forEach(function(btn){ btn.onclick=function(){
        var id=btn.getAttribute('data-wldel');
        var r=wlById(id); if(!r) return;
        if(!window.confirm('Remove "'+r.theme+'" from the Watch List?\n\nSession-only — the hardcoded table is untouched until you COPY it back.')) return;
        var i=WL_ROWS.indexOf(r); if(i>=0) WL_ROWS.splice(i,1);
        rerender();
      }; });
    }
    wireCards();
    var go=wpane.querySelector('.ce-wl-add-go');
    if(go&&form){ go.onclick=function(){
      var theme=fval('theme'); if(!theme){ var t=fld('theme'); if(t) t.focus(); return; }
      var live=ceUpcoming(); if(!live) return;
      var id=fval('id');
      var row=id?wlById(id):null;
      var isNew=!row;
      // New rows go to the end of the sort order — never renumbering the ones already there.
      if(isNew){ row={ id:wlNextId(), q:live.q, rank:wlNextRank(live.q) }; }
      row.theme=theme;
      row.tags=pickedTags();
      row.definition=fval('definition')||null;
      row.trackSince=fval('trackSince')||null;
      row.trackUntil=fval('trackUntil')||null;
      if(isNew) WL_ROWS.push(row);
      (row.tags||[]).forEach(registerTag);
      resetForm(); form.hidden=true;
      rerender();
    }; }
    // ── the copy-out: TSV for a sheet / a paste-back, JSON for an exact hardcode ──
    // Hide / show the table. COPY keeps working while hidden because it serialises WL_ROWS,
    // not the rendered rows — the table is a VIEW of the data, never the storage.
    wpane.querySelectorAll('[data-wltoggle]').forEach(function(btn){ btn.onclick=function(){
      var body=wpane.querySelector('[data-wltblbody]'); if(!body) return;
      var hide=!body.hasAttribute('hidden');
      if(hide) body.setAttribute('hidden',''); else body.removeAttribute('hidden');
      btn.textContent=hide?'show table':'hide table';
    }; });
    wpane.querySelectorAll('.ce-wl-copy[data-wlcopy]').forEach(function(btn){ btn.onclick=function(){
      var kind=btn.getAttribute('data-wlcopy'), txt;
      if(kind==='json'){ txt=JSON.stringify(WL_ROWS, null, 2); }
      else {
        txt=[WL_COLS.map(function(c){ return c.l; }).join('\t')].concat(
          WL_ROWS.map(function(r){ return WL_COLS.map(function(c){
            return wlCellText(r,c.k).replace(/[\t\n]+/g,' ');
          }).join('\t'); })).join('\n');
      }
      var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; }, 1500); };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
      else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
             try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
    }; });
    applyFilters();
  }
}


// ════════════════════════════════════════════════════════════════════════════
// SHELL + CHART + INIT
// ════════════════════════════════════════════════════════════════════════════
function html(c){
  return '<div class="ov ov-spot" data-brand="SPOT" style="--brand:'+BRAND+';--brand-2:'+BRAND2+';--brand-soft:rgba(29,185,84,0.10)">'+
    stdOverviewBody(c)+
    '<div class="ov-modal-back" id="spotModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
      '<button class="ov-modal-x" id="spotModalX" aria-label="Close">×</button>'+
      '<div class="ov-modal-t" id="spotModalT"></div><div class="ov-modal-b" id="spotModalB"></div></div></div>'+
  '</div>';
}

// ════════════════════════════════════════════════════════════════════════════
// PANE 2 — DEEP DIVE (the standardized 5-tab spine)
//
// Restructured Jul 2026. SPOT previously nested everything INSIDE the Overview
// as top-level `ovt` tabs (Overview · General · Product Mix · Investor Day ·
// Sensitivity) — the "overview within an overview" the conventions forbid
// (docs/OVERVIEW_CONVENTIONS.md §1). Overview and Deep Dive are now SIBLING
// profile panes, and the old tabs were MOVED, never deleted (Golden Rule #1):
//
//   General ▸ MAU          -> Top Line ▸ Users
//   General ▸ ARPU         -> Top Line ▸ ARPU & Pricing
//   General ▸ Advertising  -> Top Line ▸ Advertising   (incl. the SAX deep-dive)
//   General ▸ vs Netflix   -> Top Line ▸ vs Netflix
//   Product Mix            -> Bottom Line ▸ Product Mix
//   Investor Day 2026      -> Evolution ▸ Investor Day 2026
//   Sensitivity ▸ Price    -> Valuation ▸ Price Sensitivity
//   Sensitivity ▸ ID targets -> Valuation ▸ 2029 Targets
//
// The nested sub-tabs also moved from SPOT's bespoke `ovg`/`ovs` classes to the
// SHARED convention (`.ovt-subtab` / `.ovt-subpane[data-ovst]`, pane-scoped
// switching) so Top Line, Evolution and Valuation cannot collide.
// ════════════════════════════════════════════════════════════════════════════
function ddStyle(){
  return '<style>'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:#0f7a38;border-bottom-color:#1DB954}'+
  '</style>';
}
function ddEmpty(what){
  return '<div class="add-empty">🚧 In progress — '+esc(what)+' is being built.</div>';
}
function deepDiveHtml(c){
  return '<div class="ov ov-spot ov-spot-dd" data-brand="SPOT" style="--brand:#1DB954">'+
    ddStyle()+
    '<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>'+
    // ── TOP LINE — who listens, what they pay, and the two other revenue surfaces. ──
    '<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="users">Users</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="arpu">ARPU &amp; Pricing</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ads">Advertising</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="vs">vs Netflix</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="users">'+mauBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="arpu" hidden>'+arpuBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="ads" hidden>'+advertisingBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="vs" hidden>'+vsBody(c)+'</div>'+
    '</div>'+
    // ── BOTTOM LINE — where the money actually stays: the royalty split and the margin climb. ──
    '<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="mix">Product Mix</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="mix">'+fy25Glance()+productMixBody(c)+'</div>'+
    '</div>'+
    // ── EVOLUTION — the print-by-print record (Earnings · Results · Estimates) plus the
    // Investor Day that reset the long-term frame. ──
    '<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="id2026">Investor Day 2026</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+
        ceIRButton()+
        '<div class="ce-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (the print scored against what was frozen, plus what management said). Append-only per quarter. <b>Spotify reports Q2 2026 on Tuesday 4 August, before market open</b> — so the live quarter here is a print that has not happened yet, and Post-Results stays empty until it does.</div>'+
        '<div class="ce-phtabs">'+
          '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
          '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>'+
          '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
        '</div>'+
        ceQPills()+
        '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>'+
        '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+resultsHtml('SPOT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('SPOT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="id2026" hidden>'+investorDayBody(c)+'</div>'+
    '</div>'+
    // ── VALUATION — the two interactive scenario tools that were the old Sensitivity tab. ──
    '<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="price">Price Sensitivity</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="idt">2029 Targets</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="price">'+sensPriceBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="idt" hidden>'+idtBody(c)+'</div>'+
    '</div>'+
    // ── MANAGEMENT — staged. Synced ownership / insider data stays in Pillars. ──
    '<div class="dd-pane" data-dd="mgmt" hidden>'+
      ddEmpty('Management (executives, board and governance)')+
    '</div>'+
  '</div>';
}

var _charts = {};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

function buildGmChart(){
  var id='spotGmChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return; // not visible yet
  destroy(id);
  var pf=function(v){ return v+'%'; };
  // Highlight the post-mix breakout (>=30%) in brand green; earlier years muted grey.
  var cols=GM_CONS.map(function(v){ return v>=30 ? '#1DB954' : '#C9CFD8'; });
  // Lightweight value-label plugin (no external dep) — prints the % above each bar.
  var valLabels={ id:'spotGmVals', afterDatasetsDraw:function(chart){
    var ctx=chart.ctx, meta=chart.getDatasetMeta(0);
    meta.data.forEach(function(bar,i){ var v=GM_CONS[i]; if(v==null) return;
      ctx.save(); ctx.fillStyle=(v>=30?'#11833b':'#8A93A0'); ctx.font='700 12px Inter, sans-serif';
      ctx.textAlign='center'; ctx.fillText((v%1?v.toFixed(1):v)+'%', bar.x, bar.y-7); ctx.restore(); });
  } };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{ labels:GM_LABELS, datasets:[
      { label:'Gross margin', data:GM_CONS, backgroundColor:cols, borderRadius:5, maxBarThickness:60 },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:18 } },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return 'Gross margin: '+ctx.parsed.y+'%'; } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:40, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:pf } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[valLabels] });
}

// Users & Growth chart — three lines (MAU / Premium / Ad-Supported) over time.
function buildUsersChart(){
  var id='spotUsersChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return; // not visible yet
  destroy(id);
  var mkLine=function(label,data,color,width){
    return { label:label, data:data, borderColor:color, backgroundColor:color, borderWidth:width,
      pointRadius:3, pointHoverRadius:5, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, tension:0.25 };
  };
  // Label the final value of each line (latest = Q1'26) so the endpoints read at a glance.
  var endLabels={ id:'spotUsersEnd', afterDatasetsDraw:function(chart){
    var ctx=chart.ctx; chart.data.datasets.forEach(function(ds,di){
      var meta=chart.getDatasetMeta(di); if(!meta.data.length) return;
      var pt=meta.data[meta.data.length-1], v=ds.data[ds.data.length-1];
      ctx.save(); ctx.fillStyle=ds.borderColor; ctx.font='700 12px Inter, sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText(v+'M', pt.x+9, pt.y); ctx.restore();
    });
  } };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:US_LABELS, datasets:[
      mkLine('Total MAU', US_MAU, '#1DB954', 3),
      mkLine('Premium subscribers', US_PREM, '#0E7C3A', 2.5),
      mkLine('Ad-Supported MAU', US_ADS, '#9AA3AF', 2.5),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ right:46 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+ctx.parsed.y+'M'; } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:820, grid:{ color:'#EEF2F7' },
            ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'M'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[endLabels] });
}

// Regional MAU mix — 100% stacked bars across FY2023–FY2025.
function buildRegionChart(){
  var id='spotRegionChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  var ds=REGIONS.map(function(r){
    return { label:r.n, data:r.mix.slice(), backgroundColor:r.col, borderRadius:3, maxBarThickness:80, stack:'mix' };
  });
  // In-bar % labels (only when the segment is tall enough to read).
  var segLabels={ id:'spotRegSeg', afterDatasetsDraw:function(chart){
    var ctx=chart.ctx;
    chart.data.datasets.forEach(function(d,di){
      var meta=chart.getDatasetMeta(di);
      meta.data.forEach(function(bar,i){ var v=d.data[i]; if(v==null||v<8) return;
        ctx.save(); ctx.fillStyle='#fff'; ctx.font='700 11px Inter, sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(v+'%', bar.x, bar.y); ctx.restore(); });
    });
  } };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{ labels:REG_YEARS, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      indexAxis:'y',
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#3A4654' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+ctx.parsed.x+'% of MAU'; } } } },
      scales:{
        x:{ stacked:true, max:100, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } },
        y:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12, weight:'600' } } } } },
    plugins:[segLabels] });
}

// Premium ARPU trajectory — bars with €-value labels, truncated y-axis.
function buildArpuChart(){
  var id='spotArpuChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  // Colour the dip year (2023) amber, the rest brand green.
  var cols=ARPU_VALS.map(function(v,i){ return ARPU_LABELS[i]==='2023' ? '#E8A33D' : '#1DB954'; });
  var valLabels={ id:'spotArpuVals', afterDatasetsDraw:function(chart){
    var ctx=chart.ctx, meta=chart.getDatasetMeta(0);
    meta.data.forEach(function(bar,i){ var v=ARPU_VALS[i]; if(v==null) return;
      ctx.save(); ctx.fillStyle='#11833b'; ctx.font='700 12px Inter, sans-serif';
      ctx.textAlign='center'; ctx.fillText('€'+v.toFixed(2), bar.x, bar.y-7); ctx.restore(); });
  } };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{ labels:ARPU_LABELS, datasets:[
      { label:'Premium ARPU', data:ARPU_VALS, backgroundColor:cols, borderRadius:5, maxBarThickness:60 },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:18 } },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return 'ARPU: €'+ctx.parsed.y.toFixed(2)+'/mo'; } } } },
      scales:{
        y:{ min:4.0, suggestedMax:5.0, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return '€'+v.toFixed(1); } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[valLabels] });
}

// vs Netflix — users/subscribers over time (Spotify MAU + Premium vs Netflix members).
function buildVsUsersChart(){
  var id='spotVsUsersChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  var mk=function(label,data,color,width,dash){
    return { label:label, data:data, borderColor:color, backgroundColor:color, borderWidth:width, borderDash:dash||[],
      pointRadius:3, pointHoverRadius:5, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, tension:0.25 };
  };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:VS_YEARS, datasets:[
      mk('Spotify — total MAU', VS_SPOT_MAU, '#1DB954', 3),
      mk('Spotify — Premium subs', VS_SPOT_SUBS, '#0E7C3A', 2.5, [5,4]),
      mk('Netflix — paid memberships', VS_NFLX_SUBS, '#E50914', 3),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#3A4654' } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+ctx.parsed.y+'M'; } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:820, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'M'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } }
  });
}

// vs Netflix — monthly ARPU over time (Spotify € vs Netflix $, not FX-converted).
function buildVsArpuChart(){
  var id='spotVsArpuChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  var mk=function(label,data,color,sym){
    return { label:label, data:data, borderColor:color, backgroundColor:color, borderWidth:3, _sym:sym,
      pointRadius:3, pointHoverRadius:5, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, tension:0.25 };
  };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:VS_YEARS, datasets:[
      mk('Spotify Premium ARPU (€)', VS_SPOT_ARPU, '#1DB954', '€'),
      mk('Netflix ARM ($)', VS_NFLX_ARPU, '#E50914', '$'),
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ boxWidth:12, font:{ size:11 }, color:'#3A4654' } },
        tooltip:{ callbacks:{ label:function(ctx){ var s=ctx.dataset._sym||''; return ctx.dataset.label+': '+s+ctx.parsed.y.toFixed(2)+'/mo'; } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:14, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } }
  });
}

// Ad gross margin (bars) vs Premium gross margin (line) — the trough & recovery.
function buildAdMarginChart(){
  var id='spotAdMarginChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return;
  destroy(id);
  // Colour ad bars by health: <5% red, <15% amber, >=15% green.
  var cols=AD_GM.map(function(v){ return v<5 ? '#E2574C' : (v<15 ? '#E8A33D' : '#1DB954'); });
  var valLabels={ id:'spotAdVals', afterDatasetsDraw:function(chart){
    var ctx=chart.ctx, meta=chart.getDatasetMeta(0);
    meta.data.forEach(function(bar,i){ var v=AD_GM[i]; if(v==null) return;
      ctx.save(); ctx.fillStyle='#3A4654'; ctx.font='700 12px Inter, sans-serif';
      ctx.textAlign='center'; ctx.fillText(v+'%', bar.x, bar.y-7); ctx.restore(); });
  } };
  _charts[id]=new Chart(cv.getContext('2d'),{
    data:{ labels:AD_LABELS, datasets:[
      { type:'bar', label:'Ad-Supported gross margin', data:AD_GM, backgroundColor:cols, borderRadius:5, maxBarThickness:54, order:2 },
      { type:'line', label:'Premium gross margin', data:AD_PREM_GM, borderColor:'#9AA3AF', backgroundColor:'#9AA3AF', borderWidth:2.5, borderDash:[5,4], pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:'#9AA3AF', tension:0.25, order:1 },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:18 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+ctx.parsed.y+'%'; } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:40, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[valLabels] });
}

// Build whichever General sub-tab is active (MAU shows two charts; vs is static).
// (buildGeneral is gone — the per-sub-tab chart dispatch now lives in buildSub, keyed by the
// Deep Dive pane AND its sub-tab so the same function serves every section.)

// Before / After toggle inside the Product Mix pane.
function showState(root, state){
  root.querySelectorAll('.spot-tg').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-state')===state); });
  root.querySelectorAll('.spot-state').forEach(function(p){ p.hidden = (p.getAttribute('data-state')!==state); });
}

// ── Deep Dive tab switching (top level) + the SHARED nested sub-tab convention ──────────────
// Nested switching is PANE-SCOPED: every Deep Dive pane owns its own `.ovt-subtab` set, so
// Top Line, Evolution and Valuation cannot fight over the same selector (the same rule the
// TBBB profile established). Charts build lazily on the first paint of a visible pane —
// Chart.js needs a non-null offsetParent.
function activeDD(root){ var b = root.querySelector('.dd-tab.active'); return b ? b.getAttribute('data-dd') : 'topline'; }
function activeSub(root, ddKey){
  var pane = root.querySelector('.dd-pane[data-dd="'+ddKey+'"]');
  if (!pane) return null;
  var b = pane.querySelector('.ovt-subtab.active');
  return b ? b.getAttribute('data-ovst') : null;
}
function buildSub(root, ddKey, subKey){
  if (ddKey === 'topline'){
    if (subKey === 'users') { buildUsersChart(); buildRegionChart(); }
    else if (subKey === 'arpu') buildArpuChart();
    else if (subKey === 'ads') buildAdMarginChart();
    else if (subKey === 'vs') { buildVsUsersChart(); buildVsArpuChart(); }
  } else if (ddKey === 'bottomline'){
    if (subKey === 'mix') buildGmChart();
  } else if (ddKey === 'evolution'){
    // The Results engine builds its charts on first paint of a VISIBLE pane, so it is
    // init'd here rather than in deepDiveInit (js/results.js, RESULTS_CONVENTIONS).
    if (subKey === 'track'){
      var w = root.querySelector('.ovt-subpane[data-ovst="track"] .rs-wrap');
      if (w) initResults(w, 'SPOT');
    } else if (subKey === 'estevo'){
      // Estimate Evolution binds to #rsEvoWrap and builds its charts on visibility.
      if (root.querySelector('#rsEvoWrap')) initResultsEvo();
    }
  } else if (ddKey === 'valuation'){
    // The scenario tools render from their inputs, so a re-show just recomputes.
    if (subKey === 'price' && root.querySelector('#sensOut')) sensUpdate(root);
    else if (subKey === 'idt' && root.querySelector('#idtOut')) idtUpdate(root);
  }
}
function showSub(root, pane, key){
  pane.querySelectorAll(':scope > .ovt-subtabs .ovt-subtab').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-ovst') === key);
  });
  pane.querySelectorAll(':scope > .ovt-subpane').forEach(function(p){
    p.hidden = (p.getAttribute('data-ovst') !== key);
  });
  var ddKey = pane.getAttribute('data-dd');
  requestAnimationFrame(function(){ buildSub(root, ddKey, key); });
}
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd') === key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-dd') !== key); });
  var sub = activeSub(root, key);
  requestAnimationFrame(function(){ buildSub(root, key, sub); });
}
function wireDD(root){
  root.querySelectorAll('.dd-tab').forEach(function(btn){
    btn.onclick = function(){ showDD(root, btn.getAttribute('data-dd')); };
  });
  root.querySelectorAll('.dd-pane').forEach(function(pane){
    pane.querySelectorAll(':scope > .ovt-subtabs .ovt-subtab').forEach(function(btn){
      btn.onclick = function(){ showSub(root, pane, btn.getAttribute('data-ovst')); };
    });
  });
}

// Wires everything that lives INSIDE the Deep Dive panes (the interactive pieces that came
// across from the old nested tabs). Called from deepDiveInit, never from the Overview's init.
function wireDeepDiveBody(root){
  root.querySelectorAll('.spot-tg').forEach(function(btn){
    btn.onclick = function(){ showState(root, btn.getAttribute('data-state')); };
  });
  // Interactive SAX schematic: clicking (or Enter/Space on) a box shows its detail.
  root.querySelectorAll('[data-sax]').forEach(function(el){
    var pick = function(){
      var k = el.getAttribute('data-sax');
      root.querySelectorAll('[data-sax]').forEach(function(x){ x.classList.toggle('is-active', x === el); });
      var d = root.querySelector('#saxDetail');
      if (d) d.innerHTML = saxDetailHtml(k);
    };
    el.onclick = pick;
    el.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } };
  });
  // Investor Day "What's new" cards: click (or Enter/Space) opens a visual explainer.
  root.querySelectorAll('[data-news]').forEach(function(el){
    var pick = function(){
      var i = el.getAttribute('data-news');
      root.querySelectorAll('[data-news]').forEach(function(x){ x.classList.toggle('is-active', x === el); });
      var d = root.querySelector('#newsDetail');
      if (d) d.innerHTML = newsDetailHtml(+i);
    };
    el.onclick = pick;
    el.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } };
  });
  // Sensitivity tab: live recompute on any slider move or region toggle.
  root.querySelectorAll('.spl-grid input[type=range]').forEach(function(sl){
    sl.oninput = function(){ sensUpdate(root); };
  });
  root.querySelectorAll('.sens-region').forEach(function(b){
    b.onclick = function(){ b.classList.toggle('active'); sensUpdate(root); };
  });
  root.querySelectorAll('.sens-method button').forEach(function(b){
    b.onclick = function(){
      root.querySelectorAll('.sens-method button').forEach(function(x){ x.classList.toggle('active', x===b); });
      sensUpdate(root);
    };
  });
  root.querySelectorAll('#sensMetric, #sensYear').forEach(function(sel){
    sel.onchange = function(){ sensUpdate(root); };
  });
  if (root.querySelector('#sensOut')) sensUpdate(root);
  // Investor Day targets scenario: recompute on any slider or metric change.
  root.querySelectorAll('#idtCagr, #idtGm, #idtOm, #idtFcfm, #idtTax, #idtMult').forEach(function(sl){
    sl.oninput = function(){ idtUpdate(root); };
  });
  var idtMetric = root.querySelector('#idtMetric');
  if (idtMetric) idtMetric.onchange = function(){
    var msl = root.querySelector('#idtMult');
    if (msl && IDT_MULTDEF[idtMetric.value] != null) msl.value = IDT_MULTDEF[idtMetric.value];
    idtUpdate(root);
  };
  if (root.querySelector('#idtOut')) idtUpdate(root);
}

// The standardized Overview: collapsibles, the money-map accordions and view toggle, the peer
// scatter (pure SVG, so it builds fine on expand) and the live market-cap cell.
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireModal(root);
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){
    var cc=btn.parentElement, open=cc.classList.toggle('open');
    var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open;
    var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸';
  }; });
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){
    var b=btn.nextElementSibling; if(!b) return;
    var open=b.hidden; b.hidden=!open;
    var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+';
  }; });
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ var on=(b===btn); b.style.background=on?'var(--navy)':'transparent'; b.style.color=on?'#fff':'var(--mu)'; });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  wireScatters(root);
  sLiveOne(root, 'SPOT');
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  // (an inactive .copane is display:none).
  var detail=document.getElementById('co-detailview');
  if(detail){
    var md=root.querySelector('#spotModalBack');
    if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}

// Deep Dive charts build lazily. companies.js calls this the first time the Deep Dive tab is
// opened, which is exactly when the canvases finally have a layout.
function deepDiveInit(c){
  var root = document.querySelector('.ov-spot-dd');
  if (!root) return;
  wireDD(root);
  wireDeepDiveBody(root);
  wireCallEarnings(root);   // Earnings phase tabs, quarter pills, Watch List authoring
  requestAnimationFrame(function(){ buildSub(root, activeDD(root), activeSub(root, activeDD(root))); });
}

export var spotOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
