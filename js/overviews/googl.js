import { mountWatchList } from '../watchlist.js';
// overviews/googl.js — standardized Overview for Alphabet Inc. (NASDAQ: GOOGL / GOOG)
// Follows docs/OVERVIEW_CONVENTIONS.md and mirrors the standardized profile contract (uber.js /
// ibkr.js): a hooked Overview (Key Facts + lede + 2x2 quad + collapsibles) and a 5-tab Deep Dive
// spine (Top Line / Bottom Line / Evolution / Valuation / Management), each with ovt-subtabs.
//
// STATUS: Overview filled; Deep Dive is a staged scaffold (sections fill one by one) EXCEPT
// Evolution ▸ Earnings, which is live for the Q2 2026 cycle (reports Jul 22, 2026 after close).
//
// Sources: Alphabet Q4/FY2025 earnings release (SEC EDGAR, Ex-99.1, Feb 2026) for all FY2025
// figures; FY sub-splits derived from the four quarterly releases (labeled approximate); company
// IR / 10-K for qualitative content. Live market cap via api.liveQuote (Massive). Peer multiples
// are seeded approximations (mid-2026), labeled — never presented as live.

import { makeManagement } from './management.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';
import { googlCeHtml, googlCeWire, googlCeBuild, googlCePop } from './googl-ce.js';
import { GOOGL_CALL_EARNINGS } from './googl-ce-data.js';   // Watch List quarters (the EV-POST data; Dani's CALL_EARNINGS retired at F-FINAL)
import { googlBlGeneralHtml, googlBlGeneralBuild, googlBlSegmentsHtml, googlBlSegmentsBuild } from './googl-bl.js';
import { googlSplcBody, googlSplcBuild, googlSplcPop } from './googl-splc.js';
import { googlHistMult } from './googl-histmult.js';
import { googlTargetMult } from './googl-target-multiple.js';
import { googlSens } from './googl-sensitivity.js';
import { GOOGL_MGMT_DATA } from './googl-mgmt-data.js';
import { googlOwnBody, googlOwnInit } from './googl-own.js';
import { googlGovBody } from './googl-gov.js';
import { googlTrackBody, googlTrackPop } from './googl-track.js';
import { googlCapexBody, googlCapexBuild, googlCapacityBody, googlCapacityBuild, googlStrategyBody, googlTamBody } from './googl-misc.js';   // Misc ▸ Capex & Depreciation, Capacity → Revenue, Strategy, TAM (MISC-capex/-capacity/-strategy/-tam, copy of meta-misc.js)
import { googlCompBody } from './googl-comp.js';   // Misc ▸ Competitive Position (MISC-comp, copy of meta-comp.js)   // Management ▸ Track Record (MG-TRACK, copy of tsm-mgmt.js tsmTrackBody)   // Management ▸ Governance & SBC (MG-GOV)   // Management ▸ Ownership (MG-OWN, copy of meta-own.js)
import { SUMMIT_CAT } from '../viz-palette.js';
// Evolution ▸ Earnings = googl-ce.js · Bottom Line ▸ General/Segments = googl-bl.js · Supply Chain = googl-splc.js ·
// Valuation ▸ Historic Multiple = googl-histmult.js · Target Multiple = googl-target-multiple.js · Sensitivity = googl-sensitivity.js
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line engine (data: js/segments-data/googl.js)

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode it) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: the Google four-color palette ───────────────────────────────────────────────────────
var BRAND='#4285F4', BRAND2='#34A853', RED='#EA4335', YELLOW='#FBBC05', GRAY='#9AA4B0', BLUE='#1A73E8', PURPLE='#7A5AF8', AMBER='#B7791F';

// ─── Render helpers ─────────────────────────────────────────────────────────────────────────────
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DATA — Overview
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5 columns × 2 rows), canonical set (playbook §8 OV-1). Filer status verified on EDGAR
// (CIK 1652044 files 10-K/10-Q/8-K — domestic). HQ, incorporation and employees: FY2025 10-K (cover page; Item 1
// "As of December 31, 2025, Alphabet had 190,820 employees"). CEO since Dec 2019 = Alphabet CEO (Google CEO since 2015).
// Market cap is live only (rule 10): no seed — 'loading…' until the quote lands, 'unavailable' if it fails.
var STD_FACTS=[
  ['Listing','NASDAQ: GOOGL · GOOG'],
  ['HQ','Mountain View, California, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1998 (Larry Page & Sergey Brin)'],
  ['IPO','Aug 2004 · NASDAQ (Dutch auction)'],
  ['CEO','Sundar Pichai · joined 2004 · CEO since Dec 2019'],
  ['Employees','190,820 · Dec 2025'],
  ['Dividend','Payer · quarterly'],
  ['Market cap','loading live quote…'],
];

// OV-2 lede (playbook §8: 2–4 sentences, ~50–80 words, no numbers, neutral). Paraphrased from the FY2025 10-K,
// Item 1 ("Alphabet is a collection of businesses — the largest of which is Google"). The old lede's founder-control
// sentence moves to Management ▸ Ownership and its AI-stack sentence to the 2×2 "The edge" (B2 #2).
var UB_LEDE='Alphabet is the holding company of Google, set up in a 2015 reorganization. Google builds the products people use to find information and get things done — Search, YouTube, Android, Chrome and Maps — and earns most of its money from the advertising shown in them, while also selling computing, data and AI services to businesses through Google Cloud. Outside Google, Alphabet runs a group of earlier-stage ventures, the largest being Waymo.';

// 2x2 quadrant (each cell ≤ ~30 words)
var STD_BIZ=[
  ['What it sells','Attention and answers at global scale — search, video, maps, mobile OS — monetized with ads; plus cloud/AI computing for enterprises and consumer subscriptions.'],
  ['Who buys it','Advertisers (the core); enterprises & developers (Google Cloud); consumers (subscriptions, devices, app purchases); OEMs distributing Android.'],
  // FY2025 10-K: revenues by type (advertising 294,691 · Cloud 58,705 · subs/platforms/devices 48,030 of 402,836)
  // and the segment note (operating income: Services 139,404 · Cloud 13,910).
  ['How it earns','FY2025: ~73% advertising (Search · YouTube · Network) · ~15% Google Cloud · ~12% subscriptions, platforms & devices — but Services earns 10× Cloud\'s operating income ($139.4B vs $13.9B).'],
  ['The edge','Distribution through several billion-user products, the data loop of its ad auctions, and an AI stack it owns end to end: TPU chips → Gemini models → its own products.'],
];

// OV-4 How it makes money — FY2025 10-K (acc. 0001652044-26-000018): MD&A "revenues by type", Note 2 (revenues by
// geography, based on customer address) and the segment note (operating income). Two views of the SAME total; both
// reconcile to $402,836M with hedging gains (losses) of −$127M (shown in the caption, not as a bar):
//   Services 342,721 + Cloud 58,705 + Other Bets 1,537 − 127 = 402,836
//   US 194,229 + EMEA 117,152 + APAC 67,680 + Other Americas 23,902 − 127 = 402,836
// Bars are neutral greys ranked by size (gmmBars / .gmm-neutral); the fifth field is no longer used (playbook §8).
var GMM_SEG=[
  ['Google Services', 85.1, '$342.7B', '85%', null],
  ['Google Cloud',    14.6, '$58.7B',  '15%', null],
  ['Other Bets',       0.4, '$1.5B',   '<1%', null],
];
var GMM_GEO=[
  ['United States',  48.2, '$194.2B', '48%', null],
  ['EMEA',           29.1, '$117.2B', '29%', null],
  ['APAC',           16.8, '$67.7B',  '17%', null],
  ['Other Americas',  5.9, '$23.9B',  '6%',  null],
];
// One accordion per segment: what it is (no numbers) + "The numbers" (10-K figures). The old approximate sub-splits
// ("derived from the quarterly releases") are replaced by the 10-K's own revenue-by-type table (B2 #4).
var REV_DEFS=[
  { seg:'Google Services (ads, subscriptions, devices)',
    desc:'Everything consumer-facing: <b>advertising</b> sold on Google Search, YouTube and partner sites/apps (Google Network), plus <b>subscriptions, platforms and devices</b> — Google One, YouTube Premium & TV, Play Store fees and Pixel hardware. Advertising is priced largely through real-time auctions.',
    econ:[['FY2025 revenue','$342.7B · 85% of total'],['Growth','+12% (from $304.9B)'],['Operating income','$139.4B · 40.7% margin'],['Google advertising','$294.7B (+11%): Search & other $224.5B · YouTube ads $40.4B · Network $29.8B'],['Subscriptions, platforms & devices','$48.0B (+19%)']] },
  { seg:'Google Cloud (computing and AI for businesses)',
    desc:'Infrastructure and platform services for enterprises: <b>Google Cloud Platform</b> (compute, storage, and AI infrastructure — including Alphabet\'s own TPU chips — plus Vertex AI and Gemini for business), and <b>Google Workspace</b> (Gmail, Docs, Meet for organizations). Earns consumption-based fees and subscriptions.',
    econ:[['FY2025 revenue','$58.7B · 15% of total'],['Growth','+36% (from $43.2B)'],['Operating income','$13.9B · 23.7% margin (from $6.1B)'],['4Q25','$17.7B (+48% YoY) — a run-rate above $70B a year'],['Revenue backlog','$242.8B at Dec 31, 2025, mostly Google Cloud (Note 2)']] },
  { seg:'Other Bets (Waymo and the ventures)',
    desc:'A portfolio of earlier-stage businesses outside Google — most prominently <b>Waymo</b> (autonomous ride-hailing) plus Verily (health), Wing (drone delivery) and other ventures. Revenues come primarily from autonomous transportation and internet services.',
    econ:[['FY2025 revenue','$1.5B · under 1% of total'],['Growth','−7% (from $1.6B)'],['Operating income','−$7.5B (−$4.4B in 2024)']] },
  { seg:'The revenue lines (as the 10-K reports them)',
    desc:'The 10-K also splits the same total into six lines: three kinds of advertising, subscriptions and devices, Cloud and Other Bets.',
    econ:[['Google Search & other','$224.5B · 55.7% (+13%)'],['YouTube ads','$40.4B · 10.0% (+12%)'],['Google Network','$29.8B · 7.4% (−2%)'],['Subscriptions, platforms & devices','$48.0B · 11.9% (+19%)'],['Google Cloud','$58.7B · 14.6% (+36%)'],['Other Bets','$1.5B · 0.4% (−7%)'],['Hedging gains (losses)','−$0.1B']],
    econNote:'10-K MD&A, revenues by type. Growth vs FY2024. 4Q25 Cloud from the 4Q25 earnings release (8-K Ex. 99.1).' },
];

// OV-5 Products — two tiers: family card → pop-up with the specific products (key = prod:i). Paraphrases the
// FY2025 10-K Item 1 and the 2Q26 10-Q (Note 2: TPU system sales in Google Cloud; Note 8: Wiz closed Mar 11, 2026),
// plus Google's product pages. Descriptive, no opinion (playbook §19).
var G_PRODUCTS=[
  { ic:'🔍', fam:'Search & assistant', d:'Finding information and answers.', items:[
    ['Google Search','The core product, with trillions of searches a year (10-K) — answers increasingly generated by AI.'],
    ['AI Overviews & AI Mode','Generative-AI answers inside Search itself, built on the Gemini models.'],
    ['Gemini app','The stand-alone AI assistant, on mobile and the web.'],
    ['Maps & Lens','Local search, navigation and visual search.'] ]},
  { ic:'📺', fam:'YouTube', d:'Video: ads and subscriptions.', items:[
    ['YouTube ads','Ads shown in videos and in Shorts.'],
    ['Shorts','Short-form vertical video inside YouTube.'],
    ['YouTube Premium & Music','Ad-free viewing and music subscriptions.'],
    ['YouTube TV & NFL Sunday Ticket','A live-TV bundle in the US, plus the NFL Sunday Ticket package.'] ]},
  { ic:'🤖', fam:'Android, Chrome & Play', d:'Where Google\'s services reach users.', items:[
    ['Android','The mobile operating system, licensed free to device makers; it carries Google\'s services (Search, Play) onto phones.'],
    ['Google Play','The app and content store — Alphabet earns on app sales and in-app purchases.'],
    ['Chrome','The web browser; another way people reach Search.'] ]},
  { ic:'☁️', fam:'Google Cloud', d:'Computing and AI for businesses.', items:[
    ['Google Cloud Platform (GCP)','Compute, storage, data, networking and AI infrastructure, paid mostly by consumption.'],
    ['TPU systems','Alphabet\'s own AI chips, now also sold to customers as systems — recorded as Cloud product sales (2Q26 10-Q).'],
    ['Vertex AI & Gemini Enterprise','The platform where businesses build on Google\'s models.'],
    ['Workspace','Gmail, Docs, Drive and Meet for organizations, sold as subscription seats.'],
    ['Security','Mandiant threat intelligence and <b>Wiz</b>, the cloud-security platform acquired in March 2026 for $29.5B.'] ]},
  { ic:'🧠', fam:'AI models & silicon', d:'The models and the chips.', items:[
    ['Gemini models','Google\'s frontier model family, used in Search, the Gemini app, Cloud and Workspace.'],
    ['Google DeepMind','The research unit that builds the models (also AlphaFold).'],
    ['TPUs','Custom-built AI accelerator chips; Ironwood is the seventh generation (10-K). Google trains and serves its models on them.'],
    ['Gemma','Open-weight models for developers.'] ]},
  { ic:'📢', fam:'Ads platforms', d:'The tools advertisers and publishers use.', items:[
    ['Google Ads','Auction-based buying across Search, YouTube, Maps and partner sites.'],
    ['Ad Manager · AdSense · AdMob','Tools for publishers and app developers to sell ad space — the Google Network business.'],
    ['Display & Video 360','Media buying for large advertisers and agencies.'] ]},
  { ic:'💳', fam:'Subscriptions & devices', d:'Paid consumer services and hardware.', items:[
    ['Google One','Storage plus access to Google\'s most capable Gemini models (10-K).'],
    ['Pixel','Phones, watches and earbuds — Pixel 10 and Pixel Watch 4 are the latest (10-K).'],
    ['Nest & Fitbit','Smart-home devices and wearables.'] ]},
  { ic:'🚗', fam:'Other Bets', d:'Waymo and the early-stage ventures.', items:[
    ['Waymo','Fully autonomous ride-hailing; the largest of the Other Bets.'],
    ['Wing','Drone delivery.'],
    ['Verily','Life sciences and health data.'],
    ['X','The incubator for new ventures.'] ]},
];

// Timeline — corporate lineage per the conventions rubric (genesis, inflections, material M&A,
// the one defining legal matter, latest $T milestone only). Depth in Read More pop-ups (hist:i).
var TIMELINE=[
  { y:'1996–98', t:'<b>Genesis:</b> Stanford PhD students Larry Page & Sergey Brin build "BackRub" → incorporate <b>Google Inc.</b> (Sep 1998).',
    d:'<ul class="ov-bullets"><li>1996 — Page & Brin build <b>BackRub</b> at Stanford: ranking pages by their inbound links (<b>PageRank</b>) instead of keyword counts.</li><li>Aug 1998 — Andy Bechtolsheim (Sun co-founder) writes a <b>$100k check to "Google Inc." before the company exists</b>.</li><li>Sep 1998 — incorporated; first office is Susan Wojcicki\'s garage in Menlo Park.</li><li>Organically the same core company today — no spin-off or reverse merger; the 2015 Alphabet restructuring (below) is a holding-company reorganization, not a change of lineage.</li></ul>' },
  { y:'2000–03', t:'<b>The earning model arrives:</b> AdWords (2000) then AdSense (2003) — auction-priced ads turn search into a business.',
    d:'<ul class="ov-bullets"><li>2000 — <b>AdWords</b> launches: advertisers bid in real-time auctions to appear against queries. The business-model inflection that made Google Google.</li><li>2002 — pay-per-click + auction pricing refined (influenced by Overture\'s model, later litigated and settled with a stock payment to Yahoo).</li><li>2003 — <b>AdSense</b> extends the auction to third-party sites: the beginning of today\'s Google Network.</li></ul>' },
  { y:'Aug 2004', t:'<b>IPO</b> on NASDAQ — an unusual <b>Dutch-auction</b> offering, with a dual-class structure preserving founder control.',
    d:'<ul class="ov-bullets"><li>Priced at $85 via an open Dutch auction (retail investors could bid) — a deliberate break with Wall Street bookbuilding.</li><li><b>Dual-class from day one:</b> Class B shares (10 votes, founders/insiders) vs Class A (1 vote). A third class (C, no votes — today\'s GOOG) was added in 2014.</li><li>Founders\' letter: "Google is not a conventional company. We do not intend to become one."</li></ul>' },
  { y:'2005–06', t:'The two defining acquisitions: <b>Android</b> (~$50M, 2005) and <b>YouTube</b> ($1.65B, 2006).',
    d:'<ul class="ov-bullets"><li><b>Android (2005, ~$50M)</b> — a small startup purchase that became the mobile operating system carrying Google\'s services onto most of the world\'s smartphones.</li><li><b>YouTube (2006, $1.65B in stock)</b> — widely questioned at the time; by FY2025 YouTube ads alone are ~$40B/yr and YouTube ads + subscriptions exceed <b>$60B/yr</b> (company disclosure).</li></ul>' },
  { y:'2007', t:'<b>DoubleClick</b> acquired ($3.1B) — the ad-serving stack behind today\'s Network / publisher business.' },
  { y:'2012–14', t:'<b>Motorola Mobility:</b> bought for $12.5B, sold to Lenovo for $2.9B — the failed hardware bet; kept the patents.',
    d:'<ul class="ov-bullets"><li>2012 — acquires Motorola Mobility for <b>$12.5B</b>, largely for its patent portfolio during the smartphone patent wars.</li><li>2014 — sells the handset business to Lenovo for <b>$2.91B</b>, retaining most patents.</li><li>Later hardware (Pixel) was built in-house instead.</li></ul>' },
  { y:'2014–16', t:'<b>The AI turn:</b> DeepMind acquired (2014) · "AI-first" declared (2016) · first in-house <b>TPU</b> chip.',
    d:'<ul class="ov-bullets"><li>2014 — acquires London-based <b>DeepMind</b> (~$500M+).</li><li>2016 — Pichai declares Google an <b>"AI-first"</b> company; first <b>TPU</b> (self-designed AI chip) revealed.</li><li>2017 — Google researchers publish the <b>Transformer</b> paper ("Attention Is All You Need") — the architecture underlying essentially all modern generative AI.</li></ul>' },
  { y:'2015', t:'<b>Alphabet restructuring</b> — Google reorganizes under a new holding company; <b>Sundar Pichai becomes CEO of Google</b>.',
    d:'<ul class="ov-bullets"><li>Google creates <b>Alphabet Inc.</b> as parent, separating core Google from the "Other Bets" (Waymo, Verily, etc.).</li><li>Goal: capital discipline and reporting transparency — the Bets\' losses become visible instead of buried in Google\'s P&L.</li><li>Page & Brin move up to Alphabet; <b>Pichai takes over Google</b>.</li></ul>' },
  { y:'2019', t:'<b>Pichai becomes CEO of Alphabet</b> — the founders step back from operations but keep voting control.' },
  { y:'2023–25', t:'<b>The Gemini era:</b> generative AI goes <i>into</i> Search itself (AI Overviews → AI Mode) on Alphabet\'s own models and TPUs.',
    d:'<ul class="ov-bullets"><li>2023 — Bard launches; DeepMind + Google Brain merge into <b>Google DeepMind</b>; <b>Gemini</b> models ship at year-end.</li><li>2024–25 — <b>AI Overviews</b> then <b>AI Mode</b> roll into Search: the second business-model inflection in the company\'s history, this time <i>inside</i> the core earning engine.</li><li>Built on a <b>full stack</b> it owns: its own TPU chips (Ironwood is the seventh generation) → its own frontier models → its own products.</li></ul>' },
  { y:'Apr 2024', t:'<b>First-ever dividend</b> declared ($0.20 a quarter), alongside a buyback.' },
  { y:'2024–25', t:'<b>US v. Google:</b> search ruled an illegal monopoly (Aug 2024); remedies land Sep 2025 — <b>no Chrome divestiture</b>.',
    d:'<ul class="ov-bullets"><li>Aug 2024 — Judge Mehta rules Google <b>illegally maintained its search monopoly</b> (the defining legal matter in company history).</li><li>Sep 2025 — remedies: Google <b>keeps Chrome and Android</b>; default-placement payments (e.g. to Apple) survive with restrictions (non-exclusive, annually renegotiable); Google must share certain search data with qualified competitors.</li><li>No divestiture was ordered. A separate ad-tech case proceeds on its own track.</li></ul>' },
  { y:'Sep 2025', t:'Crosses <b>$3 trillion</b> in market cap (the latest trillion-dollar milestone).' },
  { y:'Mar 2026', t:'<b>Wiz</b> acquired for <b>$29.5B</b> — cloud security, now part of Google Cloud; the largest acquisition in company history.',
    d:'<ul class="ov-bullets"><li>Mar 2025 — agreement to buy Wiz for $32.0B in cash, subject to regulatory approval (FY2025 10-K).</li><li>Mar 11, 2026 — closed for $29.5B after purchase-price adjustments; Wiz reports inside the Google Cloud segment (2Q26 10-Q, Note 8).</li></ul>' },
];

// ═══ OV-6 Competitors — the peer map (the same G_PEERS / G_SC feed Valuation ▸ Peers) — copied from meta.js ═══
// Rule 10: no multiple and no market cap is written here. The file holds the DENOMINATORS, from each company's
// latest 10-K (SEC EDGAR XBRL); price, market cap and (when Massive has it) EV are live (api.liveQuote) and the
// multiple is computed in the browser: P/E = price ÷ EPS, EV/EBITDA = EV ÷ EBITDA (EV = live EV, else live
// market cap + net debt below).
//   epsT/epsF  diluted EPS, US$ (GAAP; forward = Bloomberg consensus FY2026)
//   ebitdaT    US$ M = operating income + depreciation & amortization from the 10-K; ebitdaF = Bloomberg FY2026
//   nd         net debt, US$ M = debt ex leases − cash and equivalents, at the 10-K balance-sheet date
//   gt/gf      revenue growth, % — last fiscal year vs the one before (10-K) / FY2026 consensus vs FY2025 on the
//              SAME Bloomberg basis (Alphabet's Bloomberg revenue is net of TAC, so it is never divided by GAAP revenue)
// Fiscal years differ: Microsoft ends June (FY2026 = Jul 2025–Jun 2026), Oracle ends May (FY2026), Apple ends
// September (FY2025). Forward exists only for the names in BBG_CONSENSUS.txt: GOOGL and META (Sep 8 2026), AMZN
// (Sep 10 2026). Alphabet, Meta and Amazon denominators are the same ones Meta's profile uses (meta.js ME_PEERS).
// Peer set: SAB, 2026-10-26 (Dani's four + Oracle).
// Alphabet's EPS is ex-OI&E (SAB, 2026-10-26, as in Valuation ▸ Historic Multiple): FY2025 = the four quarters of operating
// income × (1 − tax rate) ÷ diluted shares (js/overviews/googl-histmult-data.js), US$8.81 against US$10.81 GAAP, which
// carries the gains on equity securities. No forward EPS for Alphabet: Bloomberg's consensus is GAAP. Peers stay GAAP.
var G_PEERS=[
  { tk:'GOOGL', n:'Alphabet', hl:true, epsT:8.81, epsF:null, epsFNote:'no forward P/E — Street EPS is GAAP, with the gains', ebitdaT:150175, ebitdaF:226428, nd:18377, gt:15.1, gf:26.8,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 8 2026',
    why:'The profile company: Search and YouTube ads, subscriptions and devices, and Google Cloud.' },
  { tk:'MSFT', n:'Microsoft', epsT:17.95, epsF:null, ebitdaT:194237, ebitdaF:null, nd:19359, gt:17.8, gf:null,
    src:'10-K FY2026 (year to Jun 30 2026)',
    why:'Azure and Microsoft 365 compete with Google Cloud and Workspace; Bing competes with Search.' },
  { tk:'AMZN', n:'Amazon', epsT:7.17, epsF:12.66, ebitdaT:145731, ebitdaF:220794, nd:-17974, gt:12.4, gf:15.6,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 10 2026',
    why:'AWS is the largest cloud rival; Amazon also sells search and retail-media ads.' },
  { tk:'META', n:'Meta', epsT:23.49, epsF:31.61, ebitdaT:101892, ebitdaF:119147, nd:22871, gt:22.2, gf:26.4,
    src:'10-K FY2025; forward: Bloomberg consensus FY2026, Sep 8 2026',
    why:'The other large digital-ad platform; competes with YouTube and Search for ad budgets.' },
  { tk:'AAPL', n:'Apple', epsT:7.46, epsF:null, ebitdaT:144748, ebitdaF:null, nd:54744, gt:6.4, gf:null,
    src:'10-K FY2025 (year to Sep 27 2025)',
    why:'Android competes with the iPhone; Apple is also a large distribution partner for Google Search.' },
  { tk:'ORCL', n:'Oracle', epsT:5.83, epsF:null, ebitdaT:29900, ebitdaF:null, nd:98252, gt:17.3, gf:null,
    src:'10-K FY2026 (year to May 31 2026)',
    why:'Oracle Cloud Infrastructure competes with Google Cloud for AI computing contracts.' },
];

var G_SC={ metric:'pe', basis:'t', peers:null, _capsFetched:false };   // Trailing by default: only GOOGL, META and AMZN have a Street forward
function gTok(name, fb){ try{ var v=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v||fb; }catch(e){ return fb; } }
function gScReset(){ if(!G_SC.peers) G_SC.peers=G_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function gScNum(v){ return v!=null && !isNaN(v); }
function gScMult(p){
  if(!gScNum(p.px)) return null;                                      // no live price → no bubble (no seeded fallback)
  var f=G_SC.basis==='f';
  if(G_SC.metric==='pe'){ var eps=f?p.epsF:p.epsT; return (gScNum(eps)&&eps>0)?p.px/eps:null; }
  var eb=f?p.ebitdaF:p.ebitdaT; if(!gScNum(eb)||eb<=0) return null;
  var ev=gScNum(p.ev)?p.ev:(gScNum(p.mc)&&gScNum(p.nd)?p.mc*1000+p.nd:null);   // US$ M
  return gScNum(ev)?ev/eb:null;
}
function gScGrowth(p){ return G_SC.basis==='f'?p.gf:p.gt; }
function gScVisible(){ return (G_SC.peers||[]).filter(function(p){ return p.on && gScNum(gScMult(p)) && gScNum(gScGrowth(p)); }); }
// Axes come from the data (max of the visible peers + headroom), never fixed caps.
function gScNice(v){ var step=v<=20?5:(v<=100?10:25); return Math.ceil(v/step)*step; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<div class="googl-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap asc-cap-top">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span class="asc-hint">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill" data-mgbasis="f">Forward</button><button type="button" class="mg-pill active" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="googl-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="googl-sc-xlab">P/E · trailing</text>'+
    '<text x="74" y="225" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="googl-sc-ylo">slow</text>'+
    '<text x="74" y="60" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end" class="googl-sc-yhi">fast growth</text>'+
    '<g class="googl-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips googl-sc-chips"></div>';
  h+='<div class="ov-diagram-cap asc-cap-end">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only listed peers plot here. '+
    '<span class="ave-subh-note">Multiples = live price ÷ figures from each company\'s latest 10-K (fiscal years differ: Microsoft to June, Oracle to May, Apple to September), or Bloomberg consensus FY2026 (as of Sep 2026) where it exists; market caps are live. Alphabet\'s P/E uses EPS ex-OI&amp;E (without the gains on equity securities), so it has no forward P/E.</span></div>';
  // Valuation ▸ Peers only: the receipt under the read (chart standard rule 3), OPEN by default.
  if(sfx==='dd') h+='<div class="rs-collap googl-sc-collap">'+
      '<button type="button" class="rs-collap-h googl-sc-tblh" data-selfwired="1"></button>'+
      '<div class="rs-collap-b googl-sc-tblb">'+
        '<div class="rs-tablewrap asc-tblwrap"><div class="googl-sc-tbl"></div></div>'+
      '</div></div>';
  h+='<div class="mg-tip googl-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function gScRenderOne(wrap){
  var g=wrap.querySelector('.googl-sc-nodes'); if(!g||!G_SC.peers) return;
  var X0=80, X1=612, Y0=222, Y1=56;   // data area; the axis line sits lower (y 252) so bottom labels clear the axis text
  var NAVY=gTok('--navy','#1E2733');
  var vis=gScVisible();
  var maxMult=gScNice(Math.max.apply(null, vis.map(gScMult).concat([1]))*1.12);
  var gs=vis.map(gScGrowth), gMax=gScNice(Math.max.apply(null, gs.concat([1]))*1.12), gMin=Math.min.apply(null, gs.concat([0]));
  gMin=gMin<0?-gScNice(-gMin*1.5):0;
  var lab=wrap.querySelector('.googl-sc-xlab'); if(lab) lab.textContent=(G_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(G_SC.basis==='f'?'forward':'trailing')+' · axis 0–'+maxMult+'×';
  var yhi=wrap.querySelector('.googl-sc-yhi'); if(yhi) yhi.textContent='+'+gMax+'% growth';
  var ylo=wrap.querySelector('.googl-sc-ylo'); if(ylo) ylo.textContent=gMin<0?(gMin+'%'):'0%';
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===G_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===G_SC.metric); });
  var frag='';
  vis.forEach(function(p){
    var m=gScMult(p), growth=gScGrowth(p);
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth-gMin)/(gMax-gMin)))*(Y0-Y1);
    var r=gScNum(p.mc)?Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32)):11;
    var logo=scLogoUrl(p);
    var read=(G_SC.metric==='pe'?'P/E ':'EV/EBITDA ')+m.toFixed(1)+'× · revenue growth '+(growth>0?'+':'')+growth.toFixed(1)+'%'+(gScNum(p.mc)?' · market cap $'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):'');
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" data-read="'+esc(read)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?NAVY:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" pointer-events="none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?NAVY:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
  gScChipsOne(wrap);
  gScTableOne(wrap);
}
// ─── The comps table under the peer map (Valuation ▸ Peers) — copied from meta.js meScTableOne ─────────
// Everything the map draws, as numbers: the metric/basis pills pick the column, removing a chip drops the
// row. Average and median EXCLUDE Alphabet (the set it is read against). Premium in red, discount in green.
function gScFmtMult(v){ return gScNum(v)?v.toFixed(1)+'×':'—'; }
function gScFmtPct(v){ return gScNum(v)?v.toFixed(1)+'%':'—'; }
function gScFmtMc(v){ return gScNum(v)?('$'+(v>=1000?(v/1000).toFixed(2)+'T':Math.round(v)+'B')):'—'; }
function gScMean(a){ if(!a.length) return null; return a.reduce(function(s,v){ return s+v; },0)/a.length; }
function gScMedian(a){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }), h=Math.floor(s.length/2); return s.length%2?s[h]:(s[h-1]+s[h])/2; }
function gScVsAvg(m, avg){
  if(!gScNum(m)||!gScNum(avg)||avg===0) return '<span class="asc-nilv">—</span>';
  var d=(m/avg-1)*100;
  return '<span class="'+(d>=0?'asc-up':'asc-dn')+'">'+(d>=0?'+':'')+Math.round(d)+'%</span>';
}
function gScTableOne(wrap){
  var box=wrap.querySelector('.googl-sc-tbl'); if(!box||!G_SC.peers) return;
  var mLab=(G_SC.metric==='pe'?'P/E':'EV/EBITDA'), bLab=(G_SC.basis==='f'?'forward':'trailing');
  var rows=G_SC.peers.map(function(p){ return { p:p, m:gScMult(p), g:gScGrowth(p) }; });
  // Cheapest first on the ACTIVE multiple; a name with no multiple sinks to the bottom (never sorts as zero).
  rows.sort(function(a,b){
    var an=gScNum(a.m), bn=gScNum(b.m);
    if(!an&&!bn) return 0; if(!an) return 1; if(!bn) return -1; return a.m-b.m;
  });
  var peers=rows.filter(function(r){ return !r.p.hl; });
  var avgM=gScMean(peers.filter(function(r){ return gScNum(r.m); }).map(function(r){ return r.m; }));
  var medM=gScMedian(peers.filter(function(r){ return gScNum(r.m); }).map(function(r){ return r.m; }));
  var avgG=gScMean(peers.filter(function(r){ return gScNum(r.g); }).map(function(r){ return r.g; }));
  var medG=gScMedian(peers.filter(function(r){ return gScNum(r.g); }).map(function(r){ return r.g; }));
  var nM=peers.filter(function(r){ return gScNum(r.m); }).length;
  var body=rows.map(function(r){
    var p=r.p, cls=(p.hl?'asc-hl':'')+(gScNum(r.m)?'':' asc-nil'), nt=gScNum(r.m)?'':gScChipNote(p);
    return '<tr class="'+cls.trim()+'">'+
      '<td><span class="asc-nm"><img src="'+esc(scLogoUrl(p))+'" alt="" onerror="this.style.display=\'none\'">'+
        '<span>'+esc(p.n)+' <span class="asc-tk">'+esc(p.tk)+(nt?' · '+esc(nt):'')+'</span></span></span></td>'+
      '<td class="asc-m">'+gScFmtMult(r.m)+'</td>'+
      '<td>'+gScFmtPct(r.g)+'</td>'+
      '<td>'+gScFmtMc(p.mc)+'</td>'+
      '<td>'+gScVsAvg(r.m, avgM)+'</td></tr>';
  }).join('');
  var foot='<tr class="asc-avg"><td>Peer average <span class="asc-tk">ex-Alphabet · '+nM+' name'+(nM===1?'':'s')+'</span></td>'+
      '<td>'+gScFmtMult(avgM)+'</td><td>'+gScFmtPct(avgG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>'+
    '<tr class="asc-med"><td>Peer median <span class="asc-tk">ex-Alphabet</span></td>'+
      '<td>'+gScFmtMult(medM)+'</td><td>'+gScFmtPct(medG)+'</td>'+
      '<td><span class="asc-nilv">—</span></td><td><span class="asc-nilv">—</span></td></tr>';
  box.innerHTML='<table class="asc-tbl"><thead><tr>'+
      '<th>Peer</th><th>'+esc(mLab)+' · '+esc(bLab)+'</th>'+
      '<th>Rev growth · '+esc(bLab)+'</th><th>Market cap</th><th>vs peer avg</th></tr></thead>'+
    '<tbody>'+body+'</tbody><tfoot>'+foot+'</tfoot></table>';
  var hd=wrap.querySelector('.googl-sc-tblh'), bd=wrap.querySelector('.googl-sc-tblb');
  if(hd){ var open=!(bd&&bd.hidden);
    hd.innerHTML='<span class="rs-collap-ic">'+(open?'▾':'▸')+'</span>The numbers behind the map'+
      '<span class="rs-collap-sub">'+(open?'hide':'show')+' · '+esc(mLab)+' · '+esc(bLab)+
      ', '+rows.length+' names</span>'; }
}
// A chip says why its peer is missing from the current view (no forward, negative EPS, no live price).
function gScChipNote(p){
  if(!gScNum(p.epsT)&&!gScNum(p.ebitdaT)&&!gScNum(p.epsF)&&!gScNum(p.ebitdaF)) return 'no figures on file';
  if(!gScNum(p.px)) return 'no live price';
  if(G_SC.basis==='f' && G_SC.metric==='pe' && p.epsFNote) return p.epsFNote;
  if(G_SC.basis==='f' && !gScNum(G_SC.metric==='pe'?p.epsF:p.ebitdaF)) return 'trailing only — no Street file';
  if(!gScNum(gScMult(p))) return G_SC.metric==='pe'?'no P/E — loss':'no EBITDA on file';
  return '';
}
function gScChipsOne(wrap){
  var box=wrap.querySelector('.googl-sc-chips'); if(!box||!G_SC.peers) return;
  var keep=box.querySelector('.googl-sc-addtk'); var typed=keep?keep.value:'';
  var h=G_SC.peers.map(function(p,i){ var nt=gScChipNote(p); return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+(nt?' <span class="asc-chip-note">· '+esc(nt)+'</span>':'')+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="googl-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="googl-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
  var inp=box.querySelector('.googl-sc-addtk'); if(inp) inp.value=typed;
}
function gScRenderAll(root){ root.querySelectorAll('.googl-sc').forEach(function(w){ gScRenderOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  gScReset();
  root.querySelectorAll('.googl-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var tblH=wrap.querySelector('.googl-sc-tblh'), tblB=wrap.querySelector('.googl-sc-tblb');
    if(tblH&&tblB) tblH.onclick=function(){ tblB.hidden=!tblB.hidden; gScTableOne(wrap); };
    var g=wrap.querySelector('.googl-sc-nodes'), tip=wrap.querySelector('.googl-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ G_SC.basis=btn.getAttribute('data-mgbasis'); gScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ G_SC.metric=btn.getAttribute('data-mgmetric'); gScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.googl-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why')+'<div class="mgt-m">'+node.getAttribute('data-read')+'</div>'; tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  gScRenderAll(root); gScFetchCaps(root);
}
function wireScChips(root, wrap){
  wrap.querySelectorAll('.googl-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(G_SC.peers[i]){ G_SC.peers.splice(i,1); gScRenderAll(root); } }; });
  var addBtn=wrap.querySelector('.googl-sc-addbtn'), addIn=wrap.querySelector('.googl-sc-addtk');
  if(addBtn&&addIn){
    addIn.onkeydown=function(e){ if(e.key==='Enter') addBtn.click(); };
    addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!G_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=G_PEERS.filter(function(p){ return p.tk===tk; })[0];   // re-adding a known peer restores its file data
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; G_SC.peers.push(o); }
        else G_SC.peers.push({ tk:tk, n:tk, on:true, epsT:null, epsF:null, ebitdaT:null, ebitdaF:null, nd:null, gt:null, gf:null,
          why:'Added by ticker — live market cap only; no reported figures on file, so it plots once they are added.' });
      }
      addIn.value=''; gScRenderAll(root); gLiveOne(root, tk); };
  }
}
function gScFetchCaps(root){ if(G_SC._capsFetched||!G_SC.peers) return; G_SC._capsFetched=true; G_SC.peers.forEach(function(p){ if(p.tk) gLiveOne(root, p.tk); }); }

// Live quote via Massive (api.liveQuote). Market data is ALWAYS live — no seeded number is ever shown: the
// Key Facts cell says "loading…" until the quote arrives and "unavailable" if it fails. The same quote feeds the
// peer bubbles (price → P/E, market cap → bubble size, EV when Massive has one) and the old Sensitivity pane.
function gLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res;
    if(!q||q.marketCap==null){ if(tk==='GOOGL') gMcFail(root); return; }
    var mcB=q.marketCap/1e9;
    gScReset();
    (G_SC.peers||[]).forEach(function(p){ if(p.tk===tk){ p.px=q.price; p.mc=mcB; p.ev=(q.ev!=null?q.ev/1e6:null); } });
    if(tk==='GOOGL'){ var el=root.querySelector('#googlMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live, '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      if(q.price!=null){ SENS.price=q.price; renderSens(root); } }
    gScRenderAll(root);
  }).catch(function(){ if(tk==='GOOGL') gMcFail(root); }); }
function gMcFail(root){ var el=root.querySelector('#googlMc'); if(el) el.textContent='live quote unavailable'; }

function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ═══ Standardized Overview body ═════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="googlMc">'+esc(p[1])+'</span>'; }
    else v=esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
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
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 revenues <b>$402.8B (+15%)</b> — the same total, two ways: by <b>segment</b> or by <b>geography</b> (where customers are based). Both reconcile to the reported figure, with hedging losses of −$0.1B.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Segments</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Geography</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+'</div>';
  h+='<div class="mm-defs acc-list">'+REV_DEFS.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: operating income <b>$129.0B</b> (32.0% margin) · net income <b>$132.2B</b> · diluted EPS <b>$10.81</b>. Net income is above operating income because of <b>$29.8B of other income</b>, mostly gains on equity stakes in private companies. '+
    '<span class="ave-subh-note">Source: Alphabet FY2025 Form 10-K (MD&A revenues by type; Note 2 Revenues; segment note; income statement). Geography is by customer address, as Note 2 reports it.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px"><b>Tap any family</b> for the specific products inside it.</div>'+
    '<div class="stdp">'+G_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
// OV-F — the Overview's one source footer (the collapsibles carry none of their own; playbook §8, §22).
var OV_SOURCES='Sources — Alphabet FY2025 Form 10-K (SEC EDGAR, filed Feb 5, 2026) for revenue, segment, geographic, margin, EPS and headcount figures and the business description; Q2 2026 Form 10-Q (filed Jul 23, 2026) for the Wiz closing and TPU system sales; Q4 2025 earnings release (8-K Ex. 99.1) for fourth-quarter Cloud revenue; Alphabet IR and product pages for qualitative content and history; SEC EDGAR for filer status. Market cap and peer multiples are live (Massive price ÷ figures from each company\'s latest 10-K, or Bloomberg consensus FY2026 as of Sep 2026). Forward figures are estimates, not company guidance.';
function stdOverviewBody(c){
  var h='<style>'+
    ''+
    ''+
    ''+
    ''+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    ''+
    ''+
    ''+
    ''+
    '.acc-list '+
    ''+
    ''+
    '.famd b{font-weight:800}'+
    ''+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+BRAND+';border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    /* deep-dive shared components */
    '.gdd-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}'+
    '.gdd-kpi{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:10px;padding:10px 12px;background:var(--w);text-align:center}'+
    '.gdd-kpi-v{font-size:16px;font-weight:800;color:var(--navy);line-height:1.15}.gdd-kpi-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);margin-top:3px}'+
    '.gdd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}'+
    '.gdd-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--w);transition:.13s}'+
    '.gdd-card.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.gdd-card-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}.gdd-ic{font-size:19px;line-height:1}'+
    '.gdd-card-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.gdd-tag{font-size:9.5px;font-weight:800;color:var(--mu);background:#F2F5F8;border-radius:20px;padding:2px 9px;margin-left:auto;white-space:nowrap}'+
    '.gdd-card-t{font-size:11.5px;color:var(--navy);line-height:1.5}.gdd-more{font-size:10px;font-weight:800;color:'+BRAND+';margin-top:7px}'+
    '@media(max-width:640px){.gdd-gov-row{grid-template-columns:1fr}}'+
    '.ov-foot{font-size:10px;color:var(--mu);line-height:1.5;margin:16px 0 4px;padding-top:10px;border-top:1px solid var(--bdr)}'+
    '.ov-callout{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:10px;padding:11px 14px;background:#F7F9FB;font-size:12px;line-height:1.55;color:var(--navy)}'+
    '.ave-subh-note{font-size:10px;color:var(--mu);font-weight:600}'+
    '.ce-pop-lead{font-size:13px;line-height:1.55;color:var(--navy);font-weight:600;margin:0 0 10px;padding-left:11px;border-left:3px solid "+BRAND+"}'+'.ce-pop-l{margin:0;padding-left:18px}'+'.ce-pop-l li{font-size:12px;line-height:1.55;color:var(--navy);margin-bottom:6px}'+'</style>';
  // The hook — always visible: Key Facts, description, 2x2 quadrant.
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+UB_LEDE+'</p>';
  h+=stdFourQuad();
  // Everything below the hook defaults collapsed (progressive disclosure).
  h+=collapsible('How Alphabet makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', stdProducts(), false);
  h+=collapsible('Competitors — the peer map', stdPeerScatter('ov'), false);
  h+=collapsible('Timeline — how it became today\'s Alphabet', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}




// ═══════════════════════════════════════════════════════════════════════════════════════════════
// WATCH LIST — THE TABLE (v2.6 · Jul 2026)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// The Watch List is not a model output. Post-Results still gives the model free rein over what a
// print and a transcript said (numbers + call highlights); the HUNT LIST is ours — we decide what matters and what
// the model failed to detect. So it is stored as a TABLE, not as prose nested inside each quarter:
// one flat array of rows with explicit columns, shaped 1:1 against the Supabase table it becomes.
//
//   id          req · stable row key (the future primary key)
//   q           req · the quarter list this row belongs to — the frozen record
//   rank        req · sort order inside the quarter. NOT rendered — the cards carry no numbers,
//                     so deleting a theme never leaves a gap or a renumbering to explain.
//   theme       req · the thing to hunt
//   tags[]      req · theme tags; they power the cross-quarter filter bar
//   definition  req · what the theme actually means / why it is relevant — ours, in our words
//   trackSince       · the quarter the hook opened
//   trackUntil       · the quarter the hook closed. EMPTY MEANS STILL OPEN — the live quarter's
//                      list is exactly the rows with a trackSince and no trackUntil.
//   seededBy         · {q,n,tripped} — the prior call's open question that put it here
//   src              · grounding: why it earned a slot
//   thread[]         · [{q,n}] the quarter-by-quarter evolution
//
// v2.6 dropped three columns that had been carrying the model's voice rather than ours: `tell`
// (the 🔎 standing read), `trigger` (the validate/invalidate condition) and `cons` (the Street
// line). Their text is still in git history and in docs/calls/GOOGL.md, which is where it came from.
//
// _co holds the open company (id + ticker), captured when the profile HTML is built (html /
// deepDiveHtml), so wireCallEarnings can hand the SHARED Watch List engine (js/watchlist.js) the
// right company. The Watch List's data lives in Supabase now (table company_themes); the engine
// owns all rendering + persistence + sorting, so nothing theme-related is kept in this file.
var _co=null;
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'GOOGL_SETUP'); }   // (kept name: called from buildSub / phase-tab wiring)

// Deep-dive segment cards (numbers live here, unlike the Overview's qualitative defs).
var DD_SEGS=[
  { id:'services', ic:'🟦', n:'Google Services', col:BRAND, kpi:'$342.7B · 85% of revenue',
    teaser:'Search & other ads, YouTube, Network, plus subscriptions/platforms/devices — the cash engine (40.7% segment margin).',
    detail:'<p><b>The engine.</b> FY2025 revenue $342.7B (+12%) at a <b>40.7% segment operating margin</b> ($139.4B of segment profit). Inside: Search & other ~$224B, YouTube ads ~$40B, Network ~$30B (structurally declining), subscriptions/platforms/devices ~$48B.</p><p><b>The AI read:</b> Search ACCELERATED through the AI transition (+10→+19% across 2025-26) while AI Overviews/AI Mode rolled into the core product — monetization held "at approximately the same rate," and management now claims upside to the historical ~20% ads-coverage of queries.</p>' },
  { id:'cloud', ic:'🟩', n:'Google Cloud', col:BRAND2, kpi:'$58.7B · fastest grower',
    teaser:'GCP (compute + AI infra + models) and Workspace — 6.6x revenue in six years, margin 2.6% → 32.9% in three.',
    detail:'<p><b>The acceleration story.</b> FY2025 revenue $58.7B (+36%), exiting at a >$70B run-rate and accelerating: +48% in Q4 2025, <b>+63% in Q1 2026</b> to $20B — with backlog exploding $106B → $155B → $240B → <b>$462B</b> in four quarters (>50% converts to revenue within 24 months, per the CFO).</p><p><b>The margin ladder is the quiet miracle:</b> segment operating margin went 2.6% (1Q23) → <b>32.9% (1Q26)</b> — from a loss-making also-ran to bulge-bracket software economics while growth sped up. Enterprise AI is now Cloud\'s primary growth driver (GenAI-product revenue +~800% YoY in Q1 2026).</p>' },
  { id:'bets', ic:'🟨', n:'Other Bets', col:YELLOW, kpi:'~$1.5B · option value',
    teaser:'Waymo above all — plus Wing and the X pipeline. Now explicitly pruned (Verily and GFiber deconsolidated).',
    detail:'<p><b>Waymo is the bet that matters:</b> 500K fully-autonomous paid rides/week (2x in under a year), 11 US cities, UK/Japan next — and a <b>$16B external round (the largest private raise ever)</b> that finally put a market price on it.</p><p><b>The portfolio is being rationalized:</b> Verily deconsolidated (Q1 2026), GFiber merging into Astound (deconsolidates Q4 2026). Revenue ~$1.5B, operating loss ~$2-3B/yr — option value, deliberately smaller.</p>' },
];

// Customers — who actually pays Alphabet (four demand pools).
var DD_CUST=[
  { ic:'📣', n:'Advertisers', tag:'~73% of revenue', col:BRAND,
    teaser:'Millions of businesses buying auction ads — retail & financial services lead every quarter.',
    detail:'<p>From SMBs to global brands, priced almost entirely by <b>real-time auction</b>. Retail is the #1 vertical (holiday quarters: Black Friday + Cyber Monday each >$1B of ad revenue), then financial services (insurance) and health.</p><p><b>The AI shift:</b> >30% of Search ad spend already runs through AI-enabled campaigns (AI Max, PMax); Gemini-built creatives (~70M assets in Q4 2025 alone) and intent-matching let ads reach "longer, more complex queries previously difficult to monetize."</p>' },
  { ic:'🏢', n:'Enterprises & governments', tag:'Cloud demand pool', col:BRAND2,
    teaser:'120K+ enterprises build with Gemini; 95% of the top-20 SaaS companies; 8M Gemini Enterprise paid seats.',
    detail:'<p>The Cloud customer base: from AI-native unicorns (nearly all GenAI unicorns use Google Cloud; 9 of the top-10 AI labs) to Apple, Mercedes-Benz, Citi, American Express and governments.</p><p><b>Behavior:</b> new-customer acquisition doubled YoY (Q1 2026), $100M–$1B deals doubled, customers outpace their committed spend by 45% — and AI customers use 1.8x as many products as non-AI customers.</p>' },
  { ic:'👤', n:'Consumers (subscriptions)', tag:'350M paid subs', col:PURPLE,
    teaser:'YouTube Premium/Music/TV, Google One and the AI plans — the fastest-compounding demand pool.',
    detail:'<p>270M (Q1 2025) → 300M → 325M → <b>350M paid subscriptions</b> (Q1 2026), led by YouTube and Google One — with the AI plans (Pro/Ultra) now the marginal driver ("our strongest quarter ever for consumer AI plans").</p><p>This is the pool that turns AI engagement into non-ads revenue — and the reason management keeps saying "not rushing" on Gemini-app ads: subscriptions are working first.</p>' },
  { ic:'🧑‍💻', n:'Developers & partners', tag:'the ecosystem moat', col:AMBER,
    teaser:'13M+ developers on the generative models; 500M+ open-model downloads; OEMs distributing Android/Gemini.',
    detail:'<p>13M+ developers have built with Google\'s generative models; open models (Gemma) passed 500M downloads; 16B tokens/min flow through the direct APIs (up from 10B a quarter earlier).</p><p>Distribution partners multiply reach: Samsung (Gemini across Galaxy), Reliance Jio (500M consumers), and the UCP council (Amazon, Meta, Microsoft, Salesforce, Stripe + retail founders) for agentic commerce.</p>' },
];

// Industry arenas (qualitative competitive map — consistent with the scatter's listed peers;
// private rivals appear HERE because they have no market multiple).
var DD_ARENA=[
  { id:'answers', ic:'🔍', n:'Search / answers', tag:'defending the core', col:BRAND,
    teaser:'vs ChatGPT, Perplexity, Meta AI — the existential front.',
    detail:'<p>The one arena where Alphabet plays defense. The empirical score so far: Search <b>accelerated</b> (10→19%) through the AI transition, queries at all-time highs, AI Mode with 75M+ DAU. The threat is real but the "cannibalization" prediction keeps failing — the company\'s own framing: an <b>expansionary moment</b>.</p><p>Watch: the standing phrase ("monetization at approximately the same rate") and the Gemini-app race vs ChatGPT (last disclosed: 750M MAU).</p>' },
  { id:'cloud', ic:'☁️', n:'Cloud & AI infrastructure', tag:'#3 closing fast', col:BRAND2,
    teaser:'vs AWS and Azure — growing ~2x the leaders\' rate.',
    detail:'<p>Still #3 by share, but growing at +63% vs the leaders\' ~20-35%, with a differentiated pitch: <b>the only full first-party stack</b> (TPUs → Gemini models → Vertex/Gemini Enterprise → security). Proof points rivals can\'t match: Apple as a customer, 9-of-10 AI labs, Anthropic\'s 1M-TPU plan, OpenAI using Google Cloud.</p>' },
  { id:'video', ic:'📺', n:'Video & attention', tag:'leading', col:RED,
    teaser:'vs TikTok, Netflix, Meta Reels — #1 US streaming watch time, 3 straight years.',
    detail:'<p>YouTube has led US streaming watch time for three consecutive years (Nielsen), monetizing both sides: ads (~$40B/yr) + subscriptions (>$20B/yr run rate across Premium/Music/TV). Shorts out-earns in-stream per watch-hour in the US — the TikTok defense turned profitable.</p>' },
  { id:'models', ic:'🧠', n:'Frontier models', tag:'co-leader', col:PURPLE,
    teaser:'vs OpenAI, Anthropic — while SELLING infrastructure to both sides.',
    detail:'<p>Gemini 3 took the fastest-adoption crown internally and the leaderboards externally; the unique position is structural: Alphabet <b>competes with the labs at the frontier while renting them silicon</b> (Anthropic\'s TPUs, OpenAI on Google Cloud). Heads it wins the model race; tails it sells the shovels.</p>' },
  { id:'commerce', ic:'🛒', n:'Agentic commerce', tag:'emerging', col:AMBER,
    teaser:'vs Amazon — laying the open rails (UCP) instead of owning the store.',
    detail:'<p>The strategy is visible in the UCP protocol: co-opt the ecosystem (Shopify, Target, Wayfair… and now Amazon itself on the council) so agent-era shopping runs through open rails Google helped define — monetized via Direct Offers and AI-Mode formats rather than a marketplace take-rate.</p>' },
];

// Guidance — Alphabet gives no revenue/EPS guidance; it commits to a philosophy (cards → pop-ups).
var G_GUIDE=[
  { id:'capex', ic:'🏗️', col:BRAND, k:'Invest ahead of demand', v:'FY26 $180–190B',
    teaser:'The only number they guide — and they re-raise it with proof attached.',
    d:'<p>The capex guide is the closest thing to formal guidance Alphabet gives: $75B → $85B → $91–93B (FY25) → $175–185B → <b>$180–190B (FY26)</b>, with 2027 "significantly" higher. The pattern: every raise arrives WITH a demand proof (backlog, Cloud acceleration) in the same print.</p><p>Sundar\'s standing frame (Q2 2024): <i>"the risk of underinvesting is dramatically greater than the risk of overinvesting."</i></p>' },
  { id:'deprec', ic:'📉', col:AMBER, k:'Warn on depreciation', v:'unprompted, every call',
    teaser:'The candor commitment: they flag the P&L pressure before anyone asks.',
    d:'<p>Every call since Q4 2024, the CFO volunteers the same warning: capex → depreciation acceleration (+28% FY24, +38% FY25, "meaningfully increase" FY26) plus data-center opex (energy). Candor against interest — and the honest yardstick for judging the margin story.</p>' },
  { id:'search', ic:'🔍', col:BRAND2, k:'"An expansionary moment"', v:'for Search',
    teaser:'The qualitative commitment on the existential question.',
    d:'<p>The repeated, testable claim: AI <b>expands</b> Search (more queries, more complex queries, more commercial queries) rather than cannibalizing it — backed each quarter by query growth at all-time highs and the frozen monetization phrase ("at approximately the same rate"). The day this language changes, the thesis changes.</p>' },
  { id:'margin', ic:'⚖️', col:PURPLE, k:'Efficiency funds the build', v:'margins up while capex 2x',
    teaser:'Op margin expanded through the largest capex ramp in corporate history.',
    d:'<p>The implicit commitment: AI-driven efficiency (serving costs −78% in 2025; ~50% of code agent-written; agents in back-office flows) grows faster than the depreciation bill. Evidence so far: op margin 27% (FY23) → 32% (FY24/25) → 36.1% (Q1 2026) <i>during</i> the ramp.</p>' },
  { id:'capret', ic:'💵', col:RED, k:'Return what\'s left', v:'dividend +5%/yr · buybacks flex',
    teaser:'Dividend (born 2024) rises steadily; buybacks are the shock absorber.',
    d:'<p>First-ever dividend Apr 2024 ($0.20/qtr), raised +5% in 2025 and +5% again in Apr 2026 — a steady, signal-bearing line. Buybacks are the flex: $62B (2023) → ~$70B returned (2024) → slowing to $5.5B in Q4 2025 as capex bit. Watch buybacks, not the dividend, for the cash-squeeze tell.</p>' },
];

// Track record — the operators, rated (cards → pop-ups).
var G_TRACK=[
  { id:'pichai', n:'Sundar Pichai', role:'CEO, Alphabet & Google', since:'2004 · CEO 2015/2019', rate:'delivering', col:BRAND2,
    line:'From the Bard stumble to Gemini 3 leadership in under two years — the AI turnaround is his record now.',
    detail:'<p><b>The case for:</b> took the company from "code red" (2023) to co-leadership at the frontier — Gemini 3 fastest-adopted model in company history, Search accelerating THROUGH the transition, Cloud from afterthought to +63%, 11 straight double-digit quarters. Reorganized (DeepMind merge) and re-platformed the whole company on its own silicon.</p><p><b>The case against:</b> was late to ship generative AI despite inventing the Transformer; the capex bill of the catch-up is now the bear case. Verdict lives in the 2026-27 conversion.</p>' },
  { id:'anat', n:'Anat Ashkenazi', role:'CFO (since Jul 2024)', since:'ex-Eli Lilly CFO', rate:'delivering', col:BRAND2,
    line:'Owns the capex-ladder communication: every raise delivered WITH its proof, depreciation flagged unprompted.',
    detail:'<p>Inherited the largest capital program in corporate history and made it legible: ROIC framing, per-call depreciation candor, backlog-conversion disclosure (>50% in 24 months), and the funding shift (first big debt raises) executed without drama. Ex-Lilly CFO — pharma discipline applied to hyperscale.</p>' },
  { id:'porat', n:'Ruth Porat', role:'President & Chief Investment Officer', since:'CFO 2015–2024', rate:'delivering', col:BRAND2,
    line:'The discipline-era CFO — made "Other Bets" a bounded, accountable line and built the buyback; now runs the Bets\' capital strategy.',
    detail:'<p><b>The case for:</b> as CFO (2015–2024, ex-Morgan Stanley CFO) she brought the cost discipline that repriced the whole equity story — segment reporting that turned Other Bets into a bounded, accountable number, the first buyback program, and margin expansion carried into the AI build. As President & CIO since 2024 she oversees Alphabet\'s investment portfolio and the Bets\' external-capital strategy — Waymo\'s $16B round (the largest private raise ever) and the Verily/GFiber deconsolidations bear her signature.</p><p><b>The case against:</b> the CIO mandate is newer and less proven than the CFO record, and the Bets still lose money — the payoff, Waymo aside, is unproven.</p>' },
  { id:'kurian', n:'Thomas Kurian', role:'CEO, Google Cloud (since 2019)', since:'ex-Oracle', rate:'delivering', col:BRAND2,
    line:'The margin ladder is his: 2.6% → 32.9% in three years, while growth ACCELERATED to +63%.',
    detail:'<p>Took a loss-making #3 and built bulge-bracket software economics: FY19 $8.9B revenue / deep losses → FY25 $58.7B / $13.9B segment profit — then Q1 2026 at +63% with a $462B backlog. The enterprise-AI portfolio (Gemini Enterprise: 8M paid seats in 4 months) gave Cloud its own product identity instead of an AWS shadow.</p>' },
  { id:'hassabis', n:'Demis Hassabis', role:'CEO, Google DeepMind', since:'DeepMind 2010 · merged 2023', rate:'delivering', col:BRAND2,
    line:'Nobel laureate (2024) whose lab went from research jewel to the revenue engine\'s core input.',
    detail:'<p>AlphaFold → Nobel Prize in Chemistry; then the practical pivot: Gemini 1 → 3 in 24 months, closing the gap to OpenAI and taking leaderboard leadership, with the serving-cost curve (−78% in 2025) that makes deployment economics work. The research-to-product transmission is the company\'s core differentiation now.</p>' },
  { id:'schindler', n:'Philipp Schindler', role:'SVP & Chief Business Officer', since:'at Google since 2005', rate:'delivering', col:BRAND2,
    line:'Carried the ads franchise through the AI transition without a single down quarter — and tells you the caveats himself.',
    detail:'<p>The ads P&L through the most feared transition in its history: Search accelerating, AI campaign adoption >30% of spend, new formats (Direct Offers, UCP) laid before the old ones eroded. Notably candid — volunteered the FX caveat on his own beat (Q1 2026).</p>' },
  { id:'mohan', n:'Neal Mohan', role:'CEO, YouTube (since 2023)', since:'at Google since 2008', rate:'delivering', col:BRAND2,
    line:'#1 US streamer three straight years; Shorts monetization gap closed; subs >$20B run-rate.',
    detail:'<p>Defended against TikTok (Shorts now out-earns in-stream per watch-hour in the US), moved YouTube to the living room (#1 in streaming watch time, 3 years running), and built the twin-engine model — >$60B/yr across ads + subscriptions, with NFL Sunday Ticket its flagship bet.</p>' },
];

// ═══ Deep-dive bodies ═══════════════════════════════════════════════════════════════════════════
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}
function ddCards(arr, kind){
  return '<div class="gdd-cards">'+arr.map(function(x,i){
    return '<div class="gdd-card ov-clickable" data-detail="'+kind+':'+i+'" style="border-top:3px solid '+(x.col||BRAND)+'">'+
      '<div class="gdd-card-h"><span class="gdd-ic">'+x.ic+'</span><span class="gdd-card-n">'+esc(x.n)+'</span>'+(x.tag||x.kpi?'<span class="gdd-tag">'+esc(x.tag||x.kpi)+'</span>':'')+'</div>'+
      '<div class="gdd-card-t">'+esc(x.teaser)+'</div>'+
      '<div class="gdd-more">More ›</div></div>';
  }).join('')+'</div>';
}
function segmentsBody(c){
  var h='';
  h+=ddStat([['5T+','searches / year'],['15','products ≥500M users'],['350M','paid subscriptions'],['$462B','Cloud backlog (Q1 26)'],['16B','API tokens / minute'],['190.8K','employees (FY25)']]);
  h+='<p class="ov-lede" style="margin-top:14px"><b>One machine, three reported segments.</b> Services throws off the cash (40.7% margin) that funds the AI build-out; Cloud converts the build-out into the fastest-growing hyperscale P&L in the market; Other Bets holds the priced option (Waymo). Tap a card for the numbers.</p>';
  h+='<div class="ov-diagram" style="height:280px;position:relative;margin:6px 0 12px"><canvas id="gChartSeg"></canvas></div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 12px">Revenue by segment, FY2019 → FY2025 ($B). Cloud: <b>6.6x in six years</b>; Services nearly 2.2x. <span class="ave-subh-note">Source: Bloomberg export (FY sums of reported quarters).</span></div>';
  h+=ddCards(DD_SEGS,'dds');
  return h;
}
function customersBody(c){
  var h='<p class="ov-lede"><b>Four demand pools pay Alphabet</b> — and all four are compounding at once. Tap for the behavior inside each.</p>';
  h+=ddCards(DD_CUST,'ddc');
  h+='<div class="ov-callout" style="margin-top:12px"><b>The cross-pool read:</b> the same AI investment monetizes four times — advertisers pay for better intent-matching, enterprises rent the infrastructure, consumers subscribe to the models, and developers lock in the ecosystem. That is the practical meaning of "full stack."</div>';
  return h;
}
// ─── Valuation ▸ Sensitivity — EV/EBITDA anchored to FY2027E (the standing convention) ──────────
var SENS={ ebitda:235, mult:15, netCash:49, shares:12.24, price:null };
function renderSens(root){
  var ev=SENS.ebitda*SENS.mult;
  var eq=ev+SENS.netCash;
  var px=eq/SENS.shares;
  var set=function(id,txt){ var el=root.querySelector('#'+id); if(el) el.textContent=txt; };
  set('gSensEbitdaV','$'+SENS.ebitda+'B'); set('gSensMultV',SENS.mult+'x');
  set('gSensEV','$'+(ev/1000).toFixed(2)+'T'); set('gSensPx','$'+px.toFixed(0));
  if(SENS.price){ set('googlSensLive','$'+SENS.price.toFixed(2)); set('gSensUp',((px/SENS.price-1)*100).toFixed(0)+'%'); }
}
// Valuation ▸ Peers (VA-PEERS): the same map as Overview ▸ Competitors — same G_SC state, so removing a peer here
// removes it there — with the table open. Multiples and caps are live; the file holds denominators (G_PEERS).
// Relocation #43: Dani's seeded-multiples table is replaced by the live table; its callout becomes the lede's question.
function googlValuationPeersBody(){
  return '<p class="ov-lede">The same peer map as the Overview, with the numbers behind it; multiples use live prices. The July profile’s question, now answered live: Alphabet grows like Microsoft and earns margins like Meta — does it still trade below both?</p>'+
    stdPeerScatter('dd')+
    '<div class="ov-foot">Sources — denominators from each company’s latest 10-K on SEC EDGAR (EPS GAAP diluted, except Alphabet’s, which is ex-OI&amp;E — without the gains on equity securities; EBITDA = operating income + D&amp;A; net debt = debt ex leases − cash and equivalents); forward = Bloomberg consensus FY2026 (as of Sep 8–10 2026) for Alphabet, Meta and Amazon only. Price, market cap and EV live (Massive). Peer set: SAB, Oct 26 2026.</div>';
}
// ─── Management ─────────────────────────────────────────────────────────────────────────────────
var GOOGL_MGMT = makeManagement(Object.assign({ brand:SUMMIT_CAT[0] }, GOOGL_MGMT_DATA));   // MG-TEAM — data in ./googl-mgmt-data.js

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ASSEMBLY — html / deepDiveHtml
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function html(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-googl" data-brand="GOOGL" style="--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="googlModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="googlModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="googlModalT"></div><div class="ov-modal-b" id="googlModalB"></div></div></div>';
  h+='</div>';
  return h;
}
// Sub-tab block for one Deep Dive section: the first entry starts active and visible.
function subtabs(group, list, hidden){
  var h='<div class="dd-pane" data-dd="'+group+'"'+(hidden?' hidden':'')+'><div class="ovt-subtabs">';
  list.forEach(function(s,i){ h+='<button type="button" class="ovt-subtab'+(i?'':' active')+'" data-ovst="'+s.k+'">'+esc(s.l)+'</button>'; });
  h+='</div>';
  list.forEach(function(s,i){ h+='<div class="ovt-subpane" data-ovst="'+s.k+'"'+(i?' hidden':'')+'>'+s.body+'</div>'; });
  return h+'</div>';
}
// Deep Dive — the Amazon spine (docs/PROFILE_PLAYBOOK.md §5), set in F1 (2026-10-26). Until each unit is
// rebuilt, the old panes sit at their approved B2 destination (docs/profiles/GOOGL.md §5); sub-tabs with
// nothing to show yet (Top Line ▸ Segments/Other, Bottom Line ▸ Segments, Estimates, Historic Multiple) are
// added when their unit is built (golden rule 5).
function deepDiveHtml(c){
  _co=c;   // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-googl ov-googl-dd" data-brand="GOOGL" style="--brand:var(--steel);--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
      '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
    '</div>';
  h+=subtabs('topline',[
    // The shared segments engine (TL-GEN · TL-SEG · TL-OTH · TL-CUS). The old segmentsBody / customersBody panes
    // are retired into it (B2 #9–14): their text lives in segments-data/googl.js; their data constants stay here.
    { k:'segov', l:'General', body:segmentsOverviewHtml('GOOGL') },
    { k:'segdrv', l:'Segments', body:segmentsHtml('GOOGL') },
    { k:'segoth', l:'Other', body:segmentsOtherHtml('GOOGL') },
    { k:'segcus', l:'Customers', body:segmentsCustomersHtml('GOOGL') },
  ]);
  h+=subtabs('bottomline',[
    { k:'margins', l:'General', body:googlBlGeneralHtml() },   // BL-GEN-1…5; Dani's #19–22 → expense dives, #29–30 → margin notes, #31 → BL-SEG, #45 → EV-RES + BL-GEN-1
    { k:'segments', l:'Segments', body:googlBlSegmentsHtml() },   // BL-SEG; Dani's #31 Cloud margin ladder → Profit by segment ▸ Google Cloud
    { k:'supplychain', l:'Supply Chain', body:googlSplcBody() },   // BL-SPLC: Dani's SPLC figures (#23–28) in the guide format
  ], true);
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
      '</div>'+
      // Earnings on the guide's machinery (./googl-ce.js, copy of meta-ce.js). The old Setup / Watch List / Post-Results
      // panes, the IR button and the intro are retired (B2 #32–36); their data constants stay in this file until F-FINAL.
      '<div class="ovt-subpane" data-ovst="earnings">'+googlCeHtml(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+resultsHtml('GOOGL')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+resultsEvoHtml('GOOGL')+'</div>'+   // EV-EST (B2 #38)
    '</div>';
  h+=subtabs('valuation',[
    { k:'histmult', l:'Historic Multiple', body:googlHistMult.body() },   // VA-HIST (live price + filings + BBG consensus)
    { k:'peers', l:'Peers', body:googlValuationPeersBody() },   // VA-PEERS: the OV-6 map + table (Dani's #43 seeded table → live)
    { k:'targetmult', l:'Target Multiple', body:googlTargetMult.body() },   // VA-TM (Summit model valuation, frozen)
    { k:'sensitivity', l:'Sensitivity Analysis', body:googlSens.body() },   // VA-SENS (Summit 08-06 frozen; Dani's #42 seeded SENS replaced)
  ], true);
  h+=subtabs('mgmt',[
    { k:'team', l:'Executives & Board', body:GOOGL_MGMT.body() },
    { k:'ownership', l:'Ownership', body:googlOwnBody() },   // MG-OWN: insider table + share classes (Dani's #47 approximate bars replaced)
    { k:'governance', l:'Governance & SBC', body:googlGovBody() },   // MG-GOV: Dani's six rows (#48) checked + capital returns (#44)
    { k:'track', l:'Track Record', body:googlTrackBody() },   // MG-TRACK: no ratings (SAB); Dani's #49 cards + #51 caveat
  ], true);
  h+=subtabs('misc',[
    { k:'comp', l:'Competitive Position', body:googlCompBody() },      // MISC-comp (Dani #17 arenas → challenges; #18 scatter → Valuation ▸ Peers)
    { k:'capex', l:'Capex & Depreciation', body:googlCapexBody() },    // MISC-capex (Dani #44 capex/debt cards → this pane; buybacks/dividend in MG-GOV)
    { k:'capacity', l:'Capacity → Revenue', body:googlCapacityBody() }, // MISC-capacity (SAB: include it, showing where the chain breaks)
    { k:'strategy', l:'Strategy', body:googlStrategyBody() },          // MISC-strategy (Dani #40 five-step loop + broaden the box → formal table, as META)
    { k:'tam', l:'TAM', body:googlTamBody() },                          // MISC-tam (Dani #15–16 vectors; third-party sizes with source and date)
  ], true);
  h+='</div>';
  return h;
}

// ═══ Sub-tab + Deep Dive tab machinery (standardized contract) ══════════════════════════════════
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'GOOGL'); });
    else if(key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'GOOGL'); });
    else if(key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'GOOGL'); });
    else requestAnimationFrame(function(){ initSegmentsOverview(root, 'GOOGL'); });
  } else if(group==='bottomline'){
    if(key==='margins') requestAnimationFrame(function(){ googlBlGeneralBuild(root); });
    if(key==='segments') requestAnimationFrame(function(){ googlBlSegmentsBuild(root); });
    if(key==='supplychain') requestAnimationFrame(googlSplcBuild);
  } else if(group==='valuation'){
    if(key==='histmult') requestAnimationFrame(function(){ googlHistMult.init(root); });
    if(key==='peers') requestAnimationFrame(function(){ wireScatters(root); });
    if(key==='targetmult') requestAnimationFrame(function(){ googlTargetMult.init(root); });
    if(key==='sensitivity') requestAnimationFrame(function(){ googlSens.init(root); });
  } else if(group==='mgmt'){
    if(key==='team') GOOGL_MGMT.init(root);
    if(key==='ownership') googlOwnInit(root);
  } else if(group==='misc'){
    if(key==='comp') { /* static tables */ }
    else if(key==='capex') requestAnimationFrame(function(){ googlCapexBuild(root); });
    else if(key==='capacity') requestAnimationFrame(function(){ googlCapacityBuild(root); });
  } else if(group==='evolution'){
    // The Setup's track-record charts. Only build when Earnings is the visible subpane AND the
    // Setup phase is the active one — Chart.js needs a non-null offsetParent.
    if(key==='earnings') googlCeBuild(root);   // the Setup chart (Results engine, GOOGL_SETUP) when Setup is the active phase
    // Amazon-style Results / Estimates engine — build lazily when the pane is visible (Chart.js needs
    // a non-null offsetParent). Pass the pane's OWN wrap + ticker so this second engine instance
    // (beside the Setup chart) re-establishes its dataset and wires the right wrap.
    else if(key==='results') requestAnimationFrame(function(){
      initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'GOOGL'); });
    // The montage must pass the ticker (playbook §11), or Growth / table buttons stop responding.
    else if(key==='estevo') requestAnimationFrame(function(){ initResultsEvo('GOOGL'); });
  }
}
// Tab switches hide a tall pane and show a shorter one, so the browser clamps scrollTop and the
// page appears to jump to the top. Keep the clicked control visually anchored: measure its
// viewport position, run the change, then scroll by the delta so it does not move. (§6a-iv.)
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
function activeSubKey(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null;
  var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null;
}
function showSub(root, pane, group, key){
  var btn=pane.querySelector('.ovt-subtab[data-ovst="'+key+'"]');
  ceKeepPos(btn||pane, function(){
    pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
    pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
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
  // ── Watch List: mount the SHARED engine (js/watchlist.js). It owns rendering + Supabase
  // persistence + sorting; nothing company-specific leaks in beyond the id, ticker and quarters.
  // Re-mounting on tab re-init is idempotent (it rebuilds the host). ──
  var wmount=pane.querySelector('[data-wlmount]');
  if(wmount && _co && _co.id){
    mountWatchList(wmount, { companyId:_co.id, ticker:_co.ticker, quarters:GOOGL_CALL_EARNINGS.quarters,
      colors:{ brand:BRAND, brand2:BRAND2, purple:PURPLE, gray:GRAY, red:RED } });
  }
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  var btn=root.querySelector('.dd-tab[data-dd="'+key+'"]');
  ceKeepPos(btn||root, function(){
    root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
    root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// ═══ Modal + resolve ════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#googlModalBack'), mT=root.querySelector('#googlModalT'), mB=root.querySelector('#googlModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#googlModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=G_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    if(kind==='ce'){ return googlCePop(id); }
    if(kind==='dds'){ var sg=DD_SEGS[+id]; return sg?{t:sg.ic+' '+esc(sg.n)+' <span class="ov-modal-sub">'+esc(sg.kpi)+'</span>',h:sg.detail}:null; }
    if(kind==='ddc'){ var cu=DD_CUST[+id]; return cu?{t:cu.ic+' '+esc(cu.n)+' <span class="ov-modal-sub">'+esc(cu.tag)+'</span>',h:cu.detail}:null; }
    if(kind==='arena'){ var ar=DD_ARENA[+id]; return ar?{t:ar.ic+' '+esc(ar.n)+' <span class="ov-modal-sub">'+esc(ar.tag)+'</span>',h:ar.detail}:null; }
    if(kind==='guide'){ var gd=G_GUIDE[+id]; return gd?{t:gd.ic+' '+esc(gd.k),h:gd.d}:null; }
    if(kind==='splc'){ return googlSplcPop(id); }
    if(kind==='gtrk'){ return googlTrackPop(id); }   // Management ▸ Track Record cards (googl-track.js)   // Bottom Line ▸ Supply Chain cards (googl-splc.js)
    if(kind==='gexec'){ var ex=G_TRACK[+id]; return ex?{t:esc(ex.n)+' <span class="ov-modal-sub">'+esc(ex.role)+' · '+esc(ex.since)+'</span>',h:ex.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

// ═══ init / deepDiveInit ════════════════════════════════════════════════════════════════════════
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireSubtabs(root,'misc'); googlCeWire(root);   // Earnings: phase tabs · quarter pills · toggles · Notes (record + Watch List)
  wireModal(root);
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Money-map accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Money-map view toggle (Segments ⇄ Geography)
  root.querySelectorAll('.ov-googl .mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.ov-googl .mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.ov-googl .gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });
  // Sensitivity sliders (Valuation ▸ Sensitivity)
  var se=root.querySelector('#gSensEbitda'), sm=root.querySelector('#gSensMult');
  if(se) se.oninput=function(){ SENS.ebitda=parseFloat(se.value); renderSens(root); };
  if(sm) sm.oninput=function(){ SENS.mult=parseFloat(sm.value); renderSens(root); };
  renderSens(root);
  // Peer scatter (Overview collapsible — builds fine on expand since it is pure SVG)
  wireScatters(root);
  // Live market cap (Key Facts cell) — also triggered per peer inside wireScatters
  gLiveOne(root, 'GOOGL');
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  var detail=document.getElementById('co-detailview');
  if(detail){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='googlModalBack') m.remove(); });
    var md=root.querySelector('#googlModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}
export var googlOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
