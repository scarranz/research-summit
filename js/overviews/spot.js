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
var PM_LEDE = 'For a decade Spotify was, in effect, one product — <b>music</b> — and ~70% of every euro went to record labels. Adding <b>podcasts</b> and <b>audiobooks</b> (which don’t pay that toll) flipped the story: gross margin broke out from the mid-20s% to a record <b>33%</b>.';

// — Hero: reported consolidated gross margin trajectory (20-F + Q1'26 deck).
// NON-monotonic: flat mid-20s% to 2021, dip in 2022 (peak podcast spend), breakout from 2024.
var GM_LABELS = ['2019','2020','2021','2022','2023','2024','2025','Q1’26'];
var GM_CONS   = [25.6, 25.6, 26.8, 24.9, 25.6, 30.1, 32.0, 33.0];   // consolidated (reported)
var GM_PREM   = [null, null, null, 28, 29, 33, 34, 34.8];           // Premium segment
var GM_ADS    = [null, null, null, 2,  4,  11, 17, 13.0];           // Ad-Supported segment

// — Inline format icons (clean SVG, brand-tinted).
var IC = {
  music: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
  pod:   '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a6 6 0 0 0-2 11.65V16a2 2 0 0 0 4 0v-2.35A6 6 0 0 0 12 2zm-1 18.93V22h2v-1.07a8 8 0 0 0 0-15.86V3a8 8 0 0 1 0 17.93z"/><circle cx="12" cy="8" r="3"/></svg>',
  book:  '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 4h7a2 2 0 0 1 2 2v14a3 3 0 0 0-2-1H4V4zm16 0h-3a2 2 0 0 0-2 2v13a3 3 0 0 1 2-1h3V4z"/></svg>',
};

// — "Where each euro goes" — share of revenue paid to rights holders (lower = more margin).
// Music ~70% is Spotify's framing; podcast/audiobook payouts are not disclosed (illustrative).
var FORMATS = [
  { ic:IC.music, n:'Music',      cost:70, tag:'pays the labels',         col:'#E2574C', note:'~70% to labels & publishers' },
  { ic:IC.book,  n:'Audiobooks', cost:40, tag:'licensed per title',      col:'#E8A33D', note:'wholesale, capped 15 hrs/mo' },
  { ic:IC.pod,   n:'Podcasts',   cost:25, tag:'owned / ad-supported',    col:'#1DB954', note:'no per-stream label royalty' },
];

// — The pivot, as a visual timeline (short labels).
var TIMELINE = [
  ['2019', 'Podcast land-grab — Gimlet, Anchor, Parcast'],
  ['2020', 'Buys Megaphone ad platform ($235M)'],
  ['2022', 'Acquires Findaway → enters audiobooks'],
  ['Nov 2023', 'Audiobooks bundled into Premium'],
  ['2023–25', 'First-ever Premium price increases'],
  ['2024', 'First full-year profit (€1.4B op. income)'],
];

// — Why it matters, as big stat cards.
var WHY_STATS = [
  { l:'Value of 1 margin point', v:'≈ €170M', d:'on €17B revenue',          dir:'up' },
  { l:'2030 gross-margin target', v:'35–40%', d:'raised at 2026 Investor Day', dir:'up' },
  { l:'Paid to rights holders',   v:'$11B+',  d:'2025 · Loud & Clear',       dir:'muted' },
  { l:'First full-year profit',   v:'FY2024', d:'driven by margin, not subs', dir:'up' },
];

var PM_SOURCES = 'Sources: Spotify FY2024 Annual Report (Form 20-F) MD&A; Q1 2026 Shareholder Deck & earnings call (Apr 2026); historical 20-F income statements (2018–2021); Loud & Clear 2025; Investor Day 2022 & 2026. Consolidated/segment gross margin as reported (EUR); per-format payout shares are illustrative.';

// Euro-split hero bar: one €1 of MUSIC revenue.
function euroBar(){
  return '<div class="spot-euro">'+
    '<div class="spot-euro-bar">'+
      '<div class="spot-euro-seg" style="width:70%;background:#E2574C">~70%<small>Rights holders</small></div>'+
      '<div class="spot-euro-seg" style="width:30%;background:#1DB954">~30%<small>Spotify gross profit</small></div>'+
    '</div>'+
    '<div class="spot-euro-cap">Every <b>€1 of music</b> revenue — most flows straight to the labels &amp; publishers. Podcasts and audiobooks don’t carry that toll, so each one Spotify adds to the mix <b>lifts the blended margin</b>.</div>'+
  '</div>';
}

// Format "toll" bars (shorter = more profit kept).
function formatBars(){
  return '<div class="spot-fmts">'+FORMATS.map(function(f){
    return '<div class="spot-fmt">'+
      '<div class="spot-fmt-h"><span class="spot-fmt-ic" style="color:'+f.col+'">'+f.ic+'</span>'+
        '<span class="spot-fmt-n">'+esc(f.n)+'</span><span class="spot-fmt-tag">'+esc(f.tag)+'</span></div>'+
      '<div class="spot-fmt-track"><div class="spot-fmt-fill" style="width:'+f.cost+'%;background:'+f.col+'"></div></div>'+
      '<div class="spot-fmt-note">'+esc(f.note)+'</div>'+
    '</div>';
  }).join('')+'</div>'+
  '<div class="spot-axis"><span>← more margin for Spotify</span><span>more paid to rights holders →</span></div>';
}

function timelineBlock(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div>'+
      '<div class="ov-tl-body">'+esc(t[1])+'</div></div>';
  }).join('')+'</div>';
}

// BEFORE pane — the music-only model.
function beforePane(){
  return '<div class="spot-state" data-state="before">'+
    '<div class="spot-state-h">Almost every euro was <b>music</b> — and ~70% of it went straight to the record labels.</div>'+
    euroBar()+
    '<div class="spot-bigstat is-low"><span class="spot-bigstat-v">≈ 25%</span><span class="spot-bigstat-l">consolidated gross margin · stuck in the mid-20s% for a decade</span></div>'+
  '</div>';
}
// AFTER pane — the three-format platform.
function afterPane(){
  return '<div class="spot-state" data-state="after" hidden>'+
    '<div class="spot-state-h">Revenue now spreads across <b>three formats</b>. Podcasts &amp; audiobooks don’t pay the label toll, so they lift the blend.</div>'+
    formatBars()+
    '<div class="spot-bigstat is-high"><span class="spot-bigstat-v">33.0%</span><span class="spot-bigstat-l">consolidated gross margin · Q1 2026 record (+133 bps Y/Y)</span></div>'+
  '</div>';
}

function productMixBody(c){
  var h = '';
  h += '<p class="ov-lede">'+PM_LEDE+'</p>';

  // ── EXPLANATION first ──
  // 1 — Before / After toggle + swappable panes
  h += sec('How the model changed',
    '<div class="spot-toggle">'+
      '<button type="button" class="spot-tg active" data-state="before">Before</button>'+
      '<button type="button" class="spot-tg" data-state="after">After</button>'+
    '</div>'+
    beforePane()+afterPane());

  // 2 — The pivot timeline (what happened in between)
  h += sec('How Spotify changed the mix', timelineBlock());

  // ── RESULT last ──
  // 3 — Gross margin BAR chart, full width, at the bottom
  h += sec('The result — gross margin by year',
    '<div class="ov-chart-card"><div class="ov-chart-t">Consolidated gross margin <span>(%, reported · green = post-mix breakout)</span></div>'+
      '<div class="ov-chart-wrap ovt-mix-wrap"><canvas id="spotGmChart"></canvas></div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">Flat in the mid-20s% for a decade → dipped in 2022 on podcast spend → broke out past 30% from 2024 → <b>33.0%</b> record in Q1’26.</div>');

  // 4 — Why it matters (stat cards)
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

// Q2'26 guidance (Shareholder Deck p.20).
var US_GUIDE = [
  { l:'Total MAUs (Q2’26 guide)',      v:'778M', d:'≈ +17M net adds',  dir:'up' },
  { l:'Premium subs (Q2’26 guide)',    v:'299M', d:'≈ +6M net adds',   dir:'up' },
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

  // 5 — Forward guidance
  h += sec('What’s next — Q2’26 guidance', kpis(US_GUIDE));

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

var ARPU_SOURCES = 'Sources: Spotify FY2021–FY2025 Form 20-F KPI tables (Premium ARPU, €/month); Q1 2026 6-K (p.28) and Shareholder Deck (p.9) for Q1’26 €4.76 and the constant-currency figure; FY2025 ARPU bridge from the FY2025 20-F (p.50). ARPU is reported for the Premium segment only; Spotify does not disclose ARPU by region.';

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

  h += '<div class="ov-foot">'+esc(ARPU_SOURCES)+'</div>';
  return h;
}

// ─── General tab shell — wraps the MAU / ARPU sub-tabs ───────────────────────
function generalBody(c){
  return '<div class="ovg-tabs">'+
      '<button type="button" class="ovg-tab active" data-ovg="mau">MAU</button>'+
      '<button type="button" class="ovg-tab" data-ovg="arpu">ARPU</button>'+
      '<button type="button" class="ovg-tab" data-ovg="vs">vs Netflix</button>'+
      '<button type="button" class="ovg-tab" data-ovg="ads">Advertising</button>'+
    '</div>'+
    '<div class="ovg-pane" data-ovg="mau">'+mauBody(c)+'</div>'+
    '<div class="ovg-pane" data-ovg="arpu" hidden>'+arpuBody(c)+'</div>'+
    '<div class="ovg-pane" data-ovg="vs" hidden>'+vsBody(c)+'</div>'+
    '<div class="ovg-pane" data-ovg="ads" hidden>'+advertisingBody(c)+'</div>';
}

// ════════════════════════════════════════════════════════════════════════════
// vs NETFLIX  (sub-tab of General) — context on the streaming/subscription space
// ════════════════════════════════════════════════════════════════════════════
var NF_LEDE = 'Spotify and Netflix are the two scaled subscription-media platforms — but they monetize <b>opposite</b> ways. Netflix runs <b>fewer, higher-value</b> subscribers at ~2.5× the ARPU and roughly double the margins, because it <b>owns</b> much of its content. Spotify runs <b>enormous reach</b> (761M listeners) at low ARPU and thin-but-rising margins, because ~70% of revenue flows out as <b>music royalties</b>. The gap is both the opportunity and the debate.';

// Diverging-bar comparison. sv/nv are the numeric magnitudes used for bar widths.
var VS_ROWS = [
  { m:'Paid subscribers', u:'millions',         s:'293M',   sv:293,  n:'325M',   nv:325,  note:'Spotify Premium (Q1’26) vs Netflix “crossed 325M” (FY2025 milestone). Netflix stopped reporting quarterly subs in 2025.' },
  { m:'Monthly ARPU',     u:'per subscriber',   s:'€4.76',  sv:4.76, n:'$11.70', nv:11.70,note:'Netflix global ARM (FY2024, last reported) ≈ 2.5× Spotify Premium ARPU. EUR vs USD — not converted.' },
  { m:'Revenue',          u:'fiscal year 2025', s:'€17.2B', sv:17.2, n:'~$45B',  nv:45,   note:'Spotify FY2025 €17.2B (+10%) vs Netflix FY2025 ~$45B (+16%). EUR vs USD.' },
  { m:'Gross margin',     u:'% of revenue',     s:'~32%',   sv:32,   n:'~46%',   nv:46,   note:'Spotify is structurally capped — ~70% of revenue is paid out as royalties to labels & publishers.' },
  { m:'Operating margin', u:'% of revenue',     s:'12.8%',  sv:12.8, n:'29.5%',  nv:29.5, note:'Spotify FY2025 12.8% (rising fast from 8.7%) vs Netflix FY2025 29.5%.' },
  { m:'Free cash flow',   u:'fiscal year 2025', s:'~€2.9B', sv:2.9,  n:'$9.5B',  nv:9.5,  note:'EUR vs USD — consistent with the ~$45B vs €17B revenue gap.' },
  { m:'Market cap',       u:'≈ Jun 2026',       s:'~$95B',  sv:94.6, n:'~$399B', nv:399,  note:'Yet Spotify trades at a HIGHER P/E (~31× vs ~24×) — the market prices in margin-expansion upside.' },
];

var VS_MODELS = [
  { co:'Spotify', col:'#1DB954', tag:'NYSE: SPOT',   t:'Licenses music royalties', pts:['Enormous reach — 761M listeners, 293M paying','Low ARPU (€4.76/mo) across 184 markets','~70% of revenue paid to labels & publishers','Thin-but-rising margins: ~32% gross · ~13% operating'] },
  { co:'Netflix', col:'#E50914', tag:'NASDAQ: NFLX', t:'Owns & licenses content',  pts:['Fewer, higher-value subs — ~325M households','High ARPU ($11.70+/mo, ~2.5× Spotify)','Content is amortized capex, not a revenue share','Fat margins: ~46% gross · ~30% operating'] },
];

var VS_SOURCES = 'Sources: Netflix Q4’24 & Q4’25 shareholder letters and FY2024 10-K (memberships, global ARM $11.70, revenue, margins, FCF); Spotify FY2025 6-K and Q1 2026 materials; market data via stockanalysis.com (≈ Jun 2026). Netflix discontinued quarterly subscriber & ARM reporting in Q1 2025 — its latest official ARM is FY2024 and FY2025 membership is a milestone (“crossed 325M”). Netflix does not report MAU, so Spotify’s 761M reach is not directly comparable. Figures in native currency (EUR vs USD) — not FX-converted, so treat absolute €/$ comparisons as approximate.';

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

function vsModels(){
  return '<div class="spot-models">'+VS_MODELS.map(function(m){
    return '<div class="spot-model" style="border-top:3px solid '+m.col+'">'+
      '<div class="spot-model-h"><span class="spot-model-co" style="color:'+m.col+'">'+esc(m.co)+'</span><span class="spot-model-tag">'+esc(m.tag)+'</span></div>'+
      '<div class="spot-model-t">'+esc(m.t)+'</div>'+
      '<ul class="spot-model-list">'+m.pts.map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('')+'</ul>'+
    '</div>';
  }).join('')+'</div>';
}

function vsBody(c){
  var h = '';
  h += '<p class="ov-lede">'+NF_LEDE+'</p>';
  h += sec('Spotify vs Netflix — the numbers',
    '<div class="spot-vs">'+
      '<div class="spot-vs-head"><span class="spot-vs-co s">● Spotify</span><span class="spot-vs-co n">Netflix ●</span></div>'+
      vsRows()+
    '</div>'+
    '<div class="ov-statline" style="margin-top:14px">The pattern is consistent: <b>Netflix monetizes deeper</b> (2.5× ARPU, ~2× margins) on fewer relationships; <b>Spotify monetizes wider</b> (761M reach) but shallower. The bull case is Spotify closing that margin gap as higher-ARPU formats scale.</div>');
  h += sec('Two opposite business models', vsModels());
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
  return '<div class="spot-sax"><div class="spot-sax-t">Spotify Ad Exchange (SAX)</div><div class="spot-sax-d">'+AD_SAX_INTRO+'</div></div>'+
    AD_SAX_GROUPS.map(function(grp){
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

function advertisingBody(c){
  var h = '';
  h += '<p class="ov-lede">'+AD_LEDE+'</p>';

  // 1 — Headline KPIs
  h += kpis(AD_KPIS);

  // 2 — Ad gross margin trough & recovery (vs Premium)
  h += sec('Ad gross margin — the trough & the recovery',
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross margin by segment <span>(%, reported · green bars = Ad-Supported · line = Premium for contrast)</span></div>'+
      '<div class="ov-chart-wrap ovt-admargin-wrap"><canvas id="spotAdMarginChart"></canvas></div>'+
      '<div class="ovt-legend">'+
        '<span class="ovt-lg"><i style="background:#1DB954"></i>Ad-Supported gross margin</span>'+
        '<span class="ovt-lg"><i style="background:#9AA3AF"></i>Premium gross margin</span>'+
      '</div>'+
    '</div>'+
    '<div class="ov-statline" style="margin-top:10px">Ad margin cratered to <b>2% (2022)</b> under podcast costs, then climbed back to <b>18% (2025)</b> on cost discipline — still only about <b>half</b> of Premium’s ~34%.</div>');

  // 3 — Strategy timeline
  h += sec('How the strategy evolved', '<div class="ov-timeline">'+AD_TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div>'+
      '<div class="ov-tl-body">'+esc(t[1])+'</div></div>';
  }).join('')+'</div>');

  // 4 — The pivot to biddable
  h += sec('The pivot — from direct sales to biddable', adBiddableBar());

  // 5 — SAX & the programmatic stack
  h += sec('The programmatic stack & partners', adChips());

  // 6 — Latest commentary
  h += sec('Latest commentary — Q1 2026 call',
    '<div class="spot-quotes">'+AD_QUOTES.map(function(q){
      return '<blockquote class="spot-quote">“'+esc(q.q)+'”<cite>— '+esc(q.a)+'</cite></blockquote>';
    }).join('')+'</div>');

  // 7 — Structural ceiling
  h += sec('The structural ceiling',
    '<div class="spot-bigstat is-low"><span class="spot-bigstat-v">483M</span><span class="spot-bigstat-l">Ad-Supported MAUs (Q1’26, +14% Y/Y) — but growth is led by <b>Latin America & Rest of World</b>, exactly where ads monetize <b>worst</b>. The free base scales in low-ARPU regions while ad dollars concentrate in mature Europe & North America. That is the core reason ad revenue lags user growth.</span></div>');

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

var ID_NEWS = [
  { tag:'Surprise',   t:'No “Super Premium” tier', d:'Against market expectations, Spotify chose the power-law add-on approach over a single high-priced tier.' },
  { tag:'AI',         t:'AI music creation & remix', d:'Landmark licensing with Universal Music Group & UMPG lets fans legally make AI covers/remixes — consent, credit, compensation. Launches as a paid Premium add-on.' },
  { tag:'Superfans',  t:'Reserved by Spotify', d:'Premium superfans get 2 tour tickets held before general on-sale. Launches summer 2026 in the U.S. with Live Nation.' },
  { tag:'Audiobooks', t:'Audiobooks+ scaling', d:'On track for $100M annualized recurring revenue by July 2026 — 700k+ titles, 22 markets, +60% listening hours ’24→’25.' },
  { tag:'AI',         t:'Studio by Spotify', d:'Creator/AI labs (research preview, 20+ markets), plus Podcast Memberships and new audiobook creation tools.' },
  { tag:'Engagement', t:'Beyond music', d:'Fitness hub with Peloton content; DJ at 94M users; Taste Profile beta — widening “time well spent”.' },
];

var ID_CAPITAL = [
  { l:'Buyback mandate',     v:'10M shares', d:'over 5 years · approved at the April 2026 AGM' },
  { l:'Cash position',       v:'€8.8B',      d:'no debt (ex-leases) · Q1 2026' },
  { l:'Q1’26 repurchased',   v:'$361M',      d:'plus $1.5B exchangeable notes settled in cash' },
  { l:'New headline KPI',    v:'FCF / share',d:'signals a capital-returns orientation' },
];

var ID_QUOTES = [
  { q:'3.5% of the world subscribes to Spotify. Giving us 96% left to win over.', a:'Alex Norström, Co-CEO' },
  { q:'The generative era rewards scale, data, and deep user understanding more than any era before.', a:'Gustav Söderström, Co-CEO' },
  { q:'Our bet is on applying general intelligence to something proprietary, dynamic, and deeply personal.', a:'Gustav Söderström, Co-CEO' },
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

function idNews(){
  return '<div class="spot-news">'+ID_NEWS.map(function(n){
    return '<div class="spot-newscard"><span class="spot-news-tag">'+esc(n.tag)+'</span>'+
      '<div class="spot-news-t">'+esc(n.t)+'</div><div class="spot-news-d">'+esc(n.d)+'</div></div>';
  }).join('')+'</div>';
}

function idQuotes(){
  return '<div class="spot-quotes">'+ID_QUOTES.map(function(q){
    return '<blockquote class="spot-quote">“'+esc(q.q)+'”<cite>— '+esc(q.a)+'</cite></blockquote>';
  }).join('')+'</div>';
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
  h += sec('Capital allocation', kpis(ID_CAPITAL));
  h += sec('In their words', idQuotes());
  h += '<div class="ov-foot">'+esc(ID_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// SHELL + CHART + INIT
// ════════════════════════════════════════════════════════════════════════════
function html(c){
  var h = '<div class="ov ov-spot" data-brand="SPOT" style="--brand:#1DB954">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="general">General</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mix">Product Mix</button>'+
    '<button type="button" class="ovt-tab" data-ovt="id2026">Investor Day 2026</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="general" hidden>'+generalBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="mix" hidden>'+productMixBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="id2026" hidden>'+investorDayBody(c)+'</div>';
  h += '</div>';
  return h;
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
function buildGeneral(root){
  var act = root.querySelector('.ovg-tab.active');
  var k = act ? act.getAttribute('data-ovg') : 'mau';
  if (k === 'arpu') buildArpuChart();
  else if (k === 'ads') buildAdMarginChart();
  else if (k === 'mau') { buildUsersChart(); buildRegionChart(); }
  // 'vs' is static — no charts
}

// Before / After toggle inside the Product Mix pane.
function showState(root, state){
  root.querySelectorAll('.spot-tg').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-state')===state); });
  root.querySelectorAll('.spot-state').forEach(function(p){ p.hidden = (p.getAttribute('data-state')!==state); });
}

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'mix') requestAnimationFrame(buildGmChart);
  if (key === 'general') requestAnimationFrame(function(){ buildGeneral(root); });
}

// Switch the nested General sub-tab (MAU / ARPU); build its chart(s) lazily.
function showOvg(root, key){
  root.querySelectorAll('.ovg-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovg') === key); });
  root.querySelectorAll('.ovg-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovg') !== key); });
  if (key === 'arpu') requestAnimationFrame(buildArpuChart);
  else if (key === 'ads') requestAnimationFrame(buildAdMarginChart);
  else if (key === 'mau') requestAnimationFrame(function(){ buildUsersChart(); buildRegionChart(); });
  // 'vs' is static — no charts
}

function init(c){
  var root = document.querySelector('.ov-spot');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  root.querySelectorAll('.spot-tg').forEach(function(btn){
    btn.onclick = function(){ showState(root, btn.getAttribute('data-state')); };
  });
  root.querySelectorAll('.ovg-tab').forEach(function(btn){
    btn.onclick = function(){ showOvg(root, btn.getAttribute('data-ovg')); };
  });
  var active = root.querySelector('.ovt-tab.active');
  var ak = active && active.getAttribute('data-ovt');
  if (ak === 'mix') requestAnimationFrame(buildGmChart);
  if (ak === 'general') requestAnimationFrame(function(){ buildGeneral(root); });
}

export var spotOverview = { html: html, init: init };
