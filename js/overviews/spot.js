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
import { spotResults } from '../results-data/spot.js';
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line (engine + js/segments-data/spot.js)
import { spotTargetMult } from './spot-target-multiple.js';   // Valuation ▸ Target Multiple / PEG (frozen Summit valuation)
import { spotCeHtml, spotCeWire, spotCeBuild, spotCePop } from './spot-ce.js';   // Evolution ▸ Earnings (canonical machinery + ./spot-ce-data.js)

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
  ['SEC filer','Foreign (20-F/6-K)'],
  ['Founded','2006 · Daniel Ek & Martin Lorentzon'],
  ['IPO','Apr 2018 · NYSE direct listing'],
  ['CEO','Alex Norström (joined 2011) & Gustav Söderström (joined 2009) · co-CEOs since Jan 2026'],
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
  ['Premium', 89.3, '€15,350M', '89%'],
  ['Ad-Supported', 10.7, '€1,836M', '11%'],
];
var GMM_GEO=[
  ['Other countries', 62.3, '€10,703M', '62%'],
  ['United States', 37.6, '€6,470M', '38%'],
  ['Luxembourg', 0.08, '€13M', '0.1%'],
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
function gmmRank(arr){ var o=arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }), rk=[];
  o.forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); }); return rk; }
function gmmBars(arr){
  var rk=gmmRank(arr);
  return '<div class="ov-mbars gmm-neutral">'+arr.map(function(r,i){
    var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill gmm-g'+rk[i]+'" style="width:'+Math.max(r[1],1.2)+'%">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div>'+
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
  var h='';   // peer-map classes (.mg-*, .asc-*) live in css/overview.css
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
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?'var(--navy)':'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+ly.toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'var(--navy)':'#3A4552')+'" text-anchor="middle" stroke="#fff" stroke-width="3.5" paint-order="stroke" style="paint-order:stroke fill">'+esc(p.n)+'</text></g>';
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
  var h='';   // no inline <style>: .stdkf, .q2, .acc, .stdp, .ov-collap, .ov-foot all live in css/overview.css (playbook §3.3, A1)
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
    // ⚠ THE `ce:` BRANCH WAS MISSING. The Earnings machinery populates its pop-ups —
    // the Watch List "the thread ›" chains, the Setup grid "?" notes, "+ detail" on each print
    // tile, "why +" on the thesis red-lines and "+ the ask" on the tee cards — and NOTHING ever
    // read it back, so the entire depth layer of the Earnings tab was dead: the controls
    // rendered, the cursor changed, the click did nothing. googl.js has this line (its
    // `resolve`); the splice into spot.js and lyft.js dropped it. ⚑ lyft.js is still missing it.
    if(kind==='ce'){ return spotCePop(id); }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    // `ce:` must be included here too — the old guard admitted only prod/hist, so even with a
    // resolver the Earnings pop-ups would never have been bound. `sax`/`news` keep their own
    // handlers elsewhere and are still deliberately excluded.
    if(!/^(prod|hist|ce):/.test(el.getAttribute('data-detail')||'')) return;
    el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); };
  });
}

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

function html(c){
  return '<div class="ov ov-spot" data-brand="SPOT">'+
    stdOverviewBody(c)+
    '<div class="ov-modal-back" id="spotModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
      '<button class="ov-modal-x" id="spotModalX" aria-label="Close">×</button>'+
      '<div class="ov-modal-t" id="spotModalT"></div><div class="ov-modal-b" id="spotModalB"></div></div></div>'+
  '</div>';
}
function deepDiveHtml(c){
  // Only sections with a built, canonical sub-tab appear (playbook §1: no placeholder sub-tabs). Top Line, Bottom Line,
  // Management and Miscellaneous return as each one is rebuilt on the shared engines; the SPOT-only panes that were
  // here (Users, ARPU & Pricing, Advertising, vs Netflix, Product Mix, Investor Day 2026, Price Sensitivity,
  // 2029 Targets) are not part of that structure and were removed (Dani, Oct 20 2026) — they live in git history.
  return '<div class="ov ov-spot ov-spot-dd" data-brand="SPOT" style="--brand:var(--steel);--brand-2:var(--steel)">'+
    '<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '</div>'+
    // ── TOP LINE — General · Segments · Customers (Other omitted: no revenue cut beyond the two segments is on file) ──
    '<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segov">General</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segdrv">Segments</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="segcus">Customers</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segov">'+segmentsOverviewHtml('SPOT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="segdrv" hidden>'+segmentsHtml('SPOT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="segcus" hidden>'+segmentsCustomersHtml('SPOT')+'</div>'+
    '</div>'+
    // ── EVOLUTION — Earnings (Setup · Post-Results · Notes) · Results · Estimates ──
    '<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+spotCeHtml(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+resultsHtml('SPOT')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('SPOT')+'</div>'+
    '</div>'+
    // ── VALUATION — Target Multiple / PEG (Summit valuation, frozen) ──
    '<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="targetmult">Target Multiple</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="targetmult">'+spotTargetMult.body()+'</div>'+
    '</div>'+
  '</div>';
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
    if (subKey === 'segdrv') initSegments(root, 'SPOT');
    else if (subKey === 'segcus') initSegmentsCustomers(root, 'SPOT');
    else initSegmentsOverview(root, 'SPOT');
  } else if (ddKey === 'evolution'){
    // The Results engine builds its charts on first paint of a VISIBLE pane, so it is init'd here.
    if (subKey === 'track'){
      var w = root.querySelector('.ovt-subpane[data-ovst="track"] .rs-wrap');
      if (w) initResults(w, 'SPOT');
    } else if (subKey === 'estevo'){
      if (root.querySelector('#rsEvoWrap')) initResultsEvo();
    } else if (subKey === 'earnings'){
      spotCeBuild(root);
    }
  } else if (ddKey === 'valuation'){
    if (subKey === 'targetmult') spotTargetMult.init(root);
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
  spotCeWire(root);   // Earnings: phase tabs · quarter pills · estimate toggles · Notes (theme record + editor)
  requestAnimationFrame(function(){ buildSub(root, activeDD(root), activeSub(root, activeDD(root))); });
}

export var spotOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
