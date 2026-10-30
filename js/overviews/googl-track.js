// overviews/googl-track.js — Alphabet Deep Dive ▸ Management ▸ Track Record (MG-TRACK, playbook §15).
//
// COPIED from js/overviews/tsm-mgmt.js tsmTrackBody / tsmTrackPop (itself sharkninja-mgmt.js → amzn.js amznTrackBody),
// WITHOUT ratings (SAB, Oct 26 2026, as for TSM): every card on the Summit accent, no verdict chip, no legend.
// Leaders = the eight of Executives & Board. Roles and dates: 2026 proxy statement (DEF 14A) and abc.xyz for the division
// CEOs. Outcomes: reported figures already in the portal (Results dataset and Bottom Line — 10-K / 10-Q), and the
// official earnings-call transcripts (quoted). Relocation: Dani's G_TRACK (#49) — his seven "delivering" ratings are
// logged in docs/profiles/GOOGL.md, not shown; his caveat callout (#51) becomes "The bench, in one line".
// `at` / `prior` / `detail` are HTML (<b>, <p>). Modal: data-detail="gtrk:<id>" (googl.js wireModal).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var TRACK = [
  { id:'pichai', n:'Sundar Pichai', role:'CEO, Alphabet and Google', since:'2004',
    at:'Google CEO since 2015, Alphabet CEO since December 2019. Revenue went from <b>$161.9B (2019) to $402.8B (2025)</b> and the operating margin from <b>21.1% to 32.0%</b>; diluted shares fell from about 13,970M to 12,230M.',
    prior:'Joined in 2004 and led Chrome and then Android before becoming Google CEO in the 2015 reorganisation into Alphabet. Director since 2017.',
    detail:'<p><b>At Alphabet (joined 2004).</b> Product management on the toolbar and Chrome; led Chrome, then Android; Google CEO from August 2015; Alphabet CEO and director. Under his tenure as Alphabet CEO the company merged Google Brain and DeepMind (2023) and shipped the Gemini models.</p><p><b>Outcomes in the portal.</b> Revenue $161.9B (2019) → $402.8B (2025); operating margin 21.1% → 32.0% (Bottom Line ▸ General); capex $91.4B in 2025 and a $195–205B guide for 2026 (Results).</p>' },
  { id:'anat', n:'Anat Ashkenazi', role:'SVP & Chief Financial Officer', since:'2024',
    at:'CFO since July 2024. Capex went from <b>$52.5B (2024) to $91.4B (2025)</b> with a <b>$195–205B</b> guide for 2026; long-term debt rose from $46.5B to $77.5B in 1Q26 and Alphabet raised <b>$49.6B of equity</b> in 2Q26, when free cash flow turned negative (−$5.9B).',
    prior:'Executive Vice President and CFO of Eli Lilly (February 2021 – July 2024), where she had worked since 2001 across finance, strategy and operations (2026 proxy).',
    detail:'<p><b>At Alphabet (joined July 2024).</b> SVP and CFO of Alphabet and Google. Her period is the funding of the AI build: capex $52.5B (2024) → $91.4B (2025) → a $195–205B guide for 2026, the first large debt issuance, and an equity raise in 2Q26 with buybacks at zero.</p><p><b>On the record.</b> “The significant increase in our investments and technical infrastructure will continue to put pressure on the P&amp;L in the form of higher depreciation expense and related data center operations costs, such as energy.” (2Q26 call)</p>' },
  { id:'schindler', n:'Philipp Schindler', role:'SVP & Chief Business Officer', since:'2005',
    at:'Chief Business Officer since August 2015, over Google’s and YouTube’s sales. Google Services revenue went from <b>$272.5B (2023) to $342.7B (2025)</b> and its operating margin from <b>35.2% to 40.7%</b>.',
    prior:'At Google since 2005: Managing Director Germany, President Northern and Central Europe (2009–12), VP Global Sales and Operations (2012–15) (2026 proxy).',
    detail:'<p><b>At Alphabet (joined 2005).</b> Runs the advertiser relationship, technical and consumer support, partnerships and country operations. Search &amp; other grew +17% in 2Q26; more than 30% of Search ad spend runs through AI-powered campaigns (1Q26 call).</p><p><b>Outcomes in the portal.</b> Google Services revenue $272.5B (2023) → $342.7B (2025); segment margin 35.2% → 40.7% (Bottom Line ▸ Segments).</p>' },
  { id:'porat', n:'Ruth Porat', role:'President & Chief Investment Officer', since:'2015',
    at:'CFO from May 2015 to July 2024; President & CIO since September 2023. As CFO, revenue went from <b>$75.0B (2015) to $307.4B (2023)</b>, Other Bets was reported as its own segment from the 2015 reorganisation, and buybacks reached <b>$62.2B</b> in 2023.',
    prior:'EVP and CFO of Morgan Stanley (2010–15), after senior roles there from 1996 (2026 proxy).',
    detail:'<p><b>At Alphabet (joined May 2015).</b> CFO through the Alphabet reorganisation, the separate reporting of Other Bets and Cloud, and the build-up of buybacks ($62.2B in 2023). President and Chief Investment Officer since September 2023, covering the investment portfolio and the Other Bets’ outside capital (Waymo’s $16B round in 4Q25).</p>' },
  { id:'walker', n:'Kent Walker', role:'President, Global Affairs & Chief Legal Officer', since:'2006',
    at:'Chief Legal Officer since 2018 and President, Global Affairs since November 2021 — the period of the US search and ad-tech cases and the EU fines. The September 2025 search remedies left Chrome and Android with Alphabet; the European Commission fined it <b>$3.5B</b> in 3Q25.',
    prior:'Executive roles at Netscape, AOL and eBay; Assistant U.S. Attorney in San Francisco and Washington, D.C. (2026 proxy).',
    detail:'<p><b>At Alphabet (joined 2006).</b> Led Google’s advocacy on competition, content, copyright and privacy; SVP Global Affairs and CLO from June 2018; President, Global Affairs and CLO since November 2021; Secretary of Alphabet since January 2020. Oversees content policy and responsible AI, government affairs, and legal, risk and compliance.</p><p><b>Context.</b> A legal and policy role without a stand-alone financial outcome; fines and legal accruals land in G&amp;A (Bottom Line ▸ Expense lines).</p>' },
  { id:'kurian', n:'Thomas Kurian', role:'CEO, Google Cloud', since:'2018',
    at:'Google Cloud CEO since late 2018. Cloud revenue went from <b>$8.9B (2019) to $58.7B (2025)</b>, from an operating loss of <b>$4.6B</b> to a profit of <b>$13.9B</b>; the quarterly margin reached <b>35.6%</b> in 2Q26 on revenue growth of +82%, with a <b>$514B</b> backlog.',
    prior:'More than two decades at Oracle, latterly President of Product Development.',
    detail:'<p><b>At Alphabet (joined 2018).</b> Built the enterprise sales organisation and the AI portfolio — Vertex, Gemini Enterprise (more than 8 million paid seats four months after launch, 4Q25 call) and, from 2Q26, TPU systems sold into customers’ data centers.</p><p><b>Outcomes in the portal.</b> Cloud margin 2.6% (1Q23) → 35.6% (2Q26); backlog $106B (2Q25) → $514B (2Q26) (Bottom Line ▸ Segments, Results).</p>' },
  { id:'hassabis', n:'Demis Hassabis', role:'CEO, Google DeepMind', since:'2014',
    at:'DeepMind co-founder (2010), acquired by Google in 2014; CEO of Google DeepMind since the 2023 merger with Google Brain. Shared the <b>2024 Nobel Prize in Chemistry</b> for AlphaFold. The Gemini app reached <b>950M</b> monthly users in 2Q26.',
    prior:'Neuroscientist and games designer before co-founding DeepMind.',
    detail:'<p><b>At Alphabet (since 2014).</b> His lab builds the Gemini models used across Search, Cloud and the Gemini app. Management reported Gemini serving unit costs down 78% over 2025 (4Q25 call) and the pre-training of Gemini 4 under way (2Q26 call).</p><p><b>Context.</b> The general AI-model research he leads sits partly in the unallocated “Alphabet-level activities” costs (10-K Note 15), so it has no segment P&amp;L of its own.</p>' },
  { id:'mohan', n:'Neal Mohan', role:'CEO, YouTube', since:'2008',
    at:'YouTube CEO since February 2023. YouTube ads went from <b>$31.5B (2023) to $40.4B (2025)</b>, and YouTube’s revenue across ads and subscriptions passed <b>$60B</b> in 2025 (4Q25 call).',
    prior:'Joined Google with the DoubleClick acquisition (2008); ran display and video ads, then was YouTube’s Chief Product Officer.',
    detail:'<p><b>At Alphabet (joined 2008).</b> Display and video ads, then YouTube product; CEO since February 2023. Shorts now earn as much revenue per watch hour as traditional content in the US (2Q25 call); YouTube Music and Premium had their best non-trial subscriber growth in 1Q26.</p><p><b>On the record.</b> “YouTube’s annual revenues surpassed $60 billion across Ads and Subscriptions.” (Sundar Pichai, 4Q25 call)</p>' },
];
var BENCH = 'Nearly every record above was built during the AI cycle; this team has not run Alphabet through a downturn together, and voting control sits with two founders who no longer run the company. The division CEOs — Cloud, YouTube, DeepMind — carry records of their own that can be read in the segment numbers.';
var FOOT = 'Roles and dates: Alphabet 2026 proxy statement (DEF 14A, filed Apr 24 2026) for the executive officers; abc.xyz for the division CEOs. Outcomes: reported figures carried in the portal (Form 10-K and 10-Q via the Results dataset and Bottom Line) and Alphabet’s official earnings-call transcripts (quoted). No ratings are given (SAB); the reads are editorial, not a Summit output.';

export function googlTrackBody(){
  var cards=TRACK.map(function(m){
    return '<div class="ov-clickable trk-card" data-detail="gtrk:'+esc(m.id)+'">'+
      '<div class="trk-n">'+esc(m.n)+'</div>'+
      '<div class="trk-r">'+esc(m.role)+' · at Alphabet since '+esc(m.since)+'</div>'+
      '<div class="trk-t"><b class="trk-k">At Alphabet:</b> '+m.at+'</div>'+
      '<div class="trk-t"><b class="trk-c">Context:</b> '+m.prior+'</div>'+
      '<div class="trk-more">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running Alphabet today, on <b>what they have actually built</b> — roles from the proxy, outcomes from the reported numbers. <b>Tap a card</b> for the full history.</p>';
  h+='<div class="trk-grid">'+cards+'</div>';
  h+='<div class="ew-note"><b>The bench, in one line.</b> '+BENCH+'</div>';
  h+='<div class="ov-foot">'+FOOT+'</div>';
  return h;
}
export function googlTrackPop(id){
  var m=TRACK.filter(function(x){ return x.id===id; })[0]; if(!m) return null;
  return { t:esc(m.n)+' <span class="trk-pop-r">'+esc(m.role)+'</span>', h:m.detail };
}
