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
var VS_SPOT_MAU  = [271, 345, 406, 489, 602, 675, 713];
var VS_SPOT_SUBS = [124, 155, 180, 205, 236, 263, 281];
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

function advertisingBody(c){
  var h = '';
  h += '<p class="ov-lede">'+AD_LEDE+'</p>';

  // 1 — SAX: what it is + interactive flow (click a box for the players)
  h += sec('Spotify Ad Exchange (SAX) — the new engine', SAX_NARR + saxSchematic());

  // 2 — What it changes vs the old way of buying
  h += sec('What SAX changes vs the old model',
    saxChanges()+
    '<p class="sax-note">'+SAX_CHANGE_NOTE+'</p>');

  // 3 — Where the mix stands today
  h += sec('The pivot — biddable is now over a third of ad revenue', adBiddableBar());

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

function sensitivityBody(c){
  var h = '';
  h += '<p class="ov-lede">A <b>live price-increase sensitivity</b> built on the <b>Summit DCF</b> (FY2026, snapshot May 2026). Pick which regions get a monthly price rise and by how much, then watch it flow through the model to <b>revenue, free cash flow, and the implied share price</b>. Every lever is adjustable — dial them to see how sensitive the valuation is.</p>';

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
// SHELL + CHART + INIT
// ════════════════════════════════════════════════════════════════════════════
function html(c){
  var h = '<div class="ov ov-spot" data-brand="SPOT" style="--brand:#1DB954">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="general">General</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mix">Product Mix</button>'+
    '<button type="button" class="ovt-tab" data-ovt="sens">Sensitivity</button>'+
    '<button type="button" class="ovt-tab" data-ovt="id2026">Investor Day 2026</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="general" hidden>'+generalBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="mix" hidden>'+productMixBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="sens" hidden>'+sensitivityBody(c)+'</div>';
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
function buildGeneral(root){
  var act = root.querySelector('.ovg-tab.active');
  var k = act ? act.getAttribute('data-ovg') : 'mau';
  if (k === 'arpu') buildArpuChart();
  else if (k === 'ads') buildAdMarginChart();
  else if (k === 'mau') { buildUsersChart(); buildRegionChart(); }
  else if (k === 'vs') { buildVsUsersChart(); buildVsArpuChart(); }
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
  else if (key === 'vs') requestAnimationFrame(function(){ buildVsUsersChart(); buildVsArpuChart(); });
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
  var active = root.querySelector('.ovt-tab.active');
  var ak = active && active.getAttribute('data-ovt');
  if (ak === 'mix') requestAnimationFrame(buildGmChart);
  if (ak === 'general') requestAnimationFrame(function(){ buildGeneral(root); });
}

export var spotOverview = { html: html, init: init };
