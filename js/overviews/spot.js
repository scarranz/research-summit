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

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }

// ════════════════════════════════════════════════════════════════════════════
// PANE 1 — OVERVIEW
// ════════════════════════════════════════════════════════════════════════════
var SNAPSHOT = [
  ['Listing', 'NYSE: SPOT'],
  ['HQ', 'Stockholm, Sweden'],
  ['Incorporated', 'Luxembourg (S.A.)'],
  ['Founded', '2006'],
  ['Public since', '2018 (direct listing)'],
  ['Founder & CEO', 'Daniel Ek'],
];
var DESC = 'Spotify is the world’s largest audio-streaming platform, monetizing through a freemium model: a paid Premium tier (the bulk of revenue) and an ad-supported free tier that funnels users toward Premium. Beyond music, Spotify has expanded into podcasts and audiobooks to deepen engagement and — critically — to lift gross margin. The investment debate centers on durable subscriber growth, pricing power, and the long climb in gross margin as the higher-margin formats scale.';
var KPIS = [
  { l:'Revenue (FY2025)',   v:'€17.2B', d:'+9.7% vs FY2024',       dir:'up' },
  { l:'EBITDA (FY2025)',    v:'€2.55B', d:'≈ 14.8% margin',        dir:'up' },
  { l:'Free cash flow',     v:'€2.9B',  d:'FY2025 actual',         dir:'up' },
  { l:'Gross margin (Q1’26)', v:'33.0%', d:'+133 bps Y/Y · record', dir:'up' },
];
var OV_NOTE = 'Headline figures from the Summit DCF model (snapshot 2026-05-22) and Spotify filings. See the Product Mix tab for the gross-margin story. Data sourced from Summit DCF models.';

function snap(arr){ return '<div class="ov-snap">'+arr.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'; }
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }

function overviewBody(c){
  return snap(SNAPSHOT) + '<p class="ov-lede">'+esc(DESC)+'</p>' + kpis(KPIS) +
    '<div class="ov-asof">'+esc(OV_NOTE)+'</div>';
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
// SHELL + CHART + INIT
// ════════════════════════════════════════════════════════════════════════════
function html(c){
  return '<div class="ov ov-spot" data-brand="SPOT" style="--brand:#1DB954">'+
    overviewBody(c)+
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
      '<div class="ovt-subpane" data-ovst="mix">'+productMixBody(c)+'</div>'+
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
      '<div class="ovt-subpane" data-ovst="earnings">'+ddEmpty('the Earnings tab (docs/EARNINGS_CONVENTIONS.md v2.10)')+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+ddEmpty('Results (actuals vs Summit / Street / guidance)')+'</div>'+
      '<div class="ovt-subpane" data-ovst="estevo" hidden>'+ddEmpty('Estimates (the forecast by model vintage)')+'</div>'+
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

// The Overview pane carries no tabs and no charts — it is the standardized hook, so its init
// has nothing to wire today. Kept as the module contract's entry point.
function init(c){ /* no-op: the Overview pane is static markup */ }

// Deep Dive charts build lazily. companies.js calls this the first time the Deep Dive tab is
// opened, which is exactly when the canvases finally have a layout.
function deepDiveInit(c){
  var root = document.querySelector('.ov-spot-dd');
  if (!root) return;
  wireDD(root);
  wireDeepDiveBody(root);
  requestAnimationFrame(function(){ buildSub(root, activeDD(root), activeSub(root, activeDD(root))); });
}

export var spotOverview = { html: html, init: init, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
