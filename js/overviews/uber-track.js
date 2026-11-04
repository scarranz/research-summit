// overviews/uber-track.js — Uber Deep Dive ▸ Management ▸ Track Record (MG-TRACK, playbook §15).
//
// Card layout copied from js/overviews/googl-track.js (itself tsm-mgmt.js → sharkninja-mgmt.js → amzn.js amznTrackBody),
// on the shared .trk-* CSS. Unlike GOOGL/TSM, Uber's July profile carried ratings (TRACK_MGMT / TRACK_RATE in uber.js,
// relocation #93): they are KEPT, shown as a labelled editorial rating on each card (no coloured card fill, a thin
// left rule in a Summit state token), pending SAB's call at the MG-TRACK gate (playbook: "Claude propone, el analista
// califica"). If SAB drops them, delete the `rate` line in cardHtml — nothing else depends on them.
// Also moved here (relocation map): #69 the Investor Day 3-year targets (ub3yrTargets / TARGETS) — now with the record
// against them; #70 the turnaround hero (ubStrategyBody, its inline <style> dropped) merged with #93's CEO callout;
// #86 the capital-allocation record (ubCapAllocBody: FCF / buybacks / SBC / shares table, the priority stack, the
// repurchase program, the dividend) — its SBC paragraph went to Governance & SBC.
// Fixes against the July text: 2021 GAAP operating loss is −$3.8B (−$3,834M), not −$3.5B; the $20B authorization is
// July 2025 (10-Q 3Q25), and the $1.5B ASR (Jan 2025) was part of the $7B program, not on top of it; remaining
// authorization is the filed $19.2B (Dec 31 2025) / $15.7B (Jun 30 2026), not an estimate; Macdonald's and
// Krishnamurthy's roles and dates follow the 2026 proxy; the share counts are balance-sheet figures (the July table used
// a Summit-model count).
// `uber` / `prior` / `detail` are HTML (<b>, <p>, <i>). Modal: data-detail="exec:<id>" (uber.js wireModal → uberTrackPop).
import { SUMMIT_POS, SUMMIT_CAT } from '../viz-palette.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sec(title, inner){ return '<div class="ov-sec-h mg-sec-gap">'+esc(title)+'</div>'+inner; }

var RATE = { green:{ c:SUMMIT_POS, l:'Value creator' }, amber:{ c:SUMMIT_CAT[3], l:'Mixed / unproven' } };

var TRACK = [
  { id:'dara', n:'Dara Khosrowshahi', role:'Chief Executive Officer', since:'2017', rate:'green',
    uber:'Took over in September 2017 a company in crisis (culture, the Waymo suit, city bans). Since then: the May 2019 IPO, the first full-year GAAP operating profit (<b>$1.1B in 2023</b>), S&amp;P 500 inclusion (December 2023), free cash flow of <b>$9.8B in 2025</b> and the first buybacks. Exited the self-driving unit (sold to Aurora) and unprofitable geographies, keeping equity stakes.',
    prior:'President &amp; CEO of <b>Expedia (2005–17)</b>; EVP and CFO of IAC/InterActiveCorp (2002–05); Allen &amp; Company (1991–98) (2026 proxy).',
    detail:'<p><b>At Uber (CEO since Sep 2017).</b> Hired to reset the post-founder culture (Holder report, harassment scandal, regulatory bans, the Waymo litigation). Delivered: the <b>May 2019 IPO</b>; the <b>first full-year GAAP operating profit (2023: $1.1B; 2025: $5.6B)</b>; <b>S&amp;P 500 inclusion (Dec 2023)</b>; free cash flow of <b>$9.8B</b> in 2025 and the first buybacks in 2024; and portfolio discipline — the self-driving unit (ATG) sold to Aurora, Uber Eats out of unprofitable geographies, several exits converted into equity stakes.</p>'+
      '<p><b>Before Uber.</b> CEO of <b>Expedia (2005–2017)</b> — revenue grew from about $2.1B to about $10B over his tenure, through acquisitions (Hotels.com, Hotwire, Trivago, HomeAway, Orbitz) and international expansion. Earlier at IAC (1998–2005, CFO 2002–05) under Barry Diller; began at Allen &amp; Company (1991).</p>'+
      '<p><b>Net read (editorial) — value creator.</b> One of the more successful "professional CEO into a crisis" cases in tech. Caveats, not disqualifying: very high pay, a tone-deaf 2021 Uber Eats "moonlighting" PR stunt, and years of cash burn before the profit inflection.</p>' },
  { id:'balaji', n:'Balaji Krishnamurthy', role:'Chief Financial Officer', since:'2019', rate:'amber',
    uber:'CFO since February 2026, promoted from inside: Head of Investor Relations (Dec 2020–Mar 2023), then Strategic Finance (VP from Sep 2023). Close to the core P&amp;L he now runs.',
    prior:'Vice President, Equity Research (US hardware and communications technology) at <b>Goldman Sachs</b>, 2011–2019 (2026 proxy).',
    detail:'<p><b>At Uber (since 2019; CFO from Feb 16, 2026).</b> Head of Investor Relations (December 2020–March 2023), Senior Director then Vice President, Strategic Finance (March 2023–February 2026); Uber’s leadership page also describes him as former divisional CFO for Mobility and Delivery. Continuity into the seat.</p>'+
      '<p><b>Before Uber.</b> Eight years at <b>Goldman Sachs</b> as a VP in equity research (2011–2019).</p>'+
      '<p><b>Net read (editorial) — mixed / unproven.</b> A credible insider with direct exposure to the core-segment finances, but he is <b>Uber’s third CFO since 2023</b> (after Nelson Chai and Prashanth Mahendra-Rajah), and a career mostly in investor relations and research means there is no record yet as a public-company CFO.</p>' },
  { id:'macdonald', n:'Andrew Macdonald', role:'President & Chief Operating Officer', since:'2012', rate:'green',
    uber:'Joined in 2012 as Toronto’s first general manager; ran Global Mobility as SVP from June 2019 to June 2025 — the years Mobility became the profit engine — and was promoted to President &amp; COO in June 2025, Uber’s first COO since 2019.',
    prior:'Consultant at <b>Bain &amp; Company</b> (2007–10) and co-founder of several early-stage companies; his executive record is essentially Uber’s (2026 proxy).',
    detail:'<p><b>At Uber (since 2012).</b> General-management and regional roles from 2012; Senior Vice President, Head of Global Mobility from June 2019; <b>President &amp; COO since June 2025</b>, over global Mobility, Delivery and Autonomous plus cross-platform functions (Uber One, support, safety). Director of Lime (since 2022) and Maple Leaf Foods (since 2023).</p>'+
      '<p><b>Before Uber.</b> Bain &amp; Company (2007–2010), then co-founded early-stage private companies.</p>'+
      '<p><b>Net read (editorial) — value creator, lightly caveated.</b> A proven internal operator who scaled Uber’s largest business; the caveat is that his record is almost entirely Uber’s, so there is little outside benchmark.</p>' },
  { id:'west', n:'Tony West', role:'SVP, Chief Legal Officer & Corporate Secretary', since:'2017', rate:'green',
    uber:'Chief Legal Officer since November 2017: steered the IPO through legal and regulatory risk, ended mandatory arbitration and NDAs for sexual-assault survivors, and published Uber’s first US safety report.',
    prior:'EVP, General Counsel at <b>PepsiCo</b> (2014–17); <b>17th Associate Attorney General of the US (2012–14)</b>, after leading the DOJ Civil Division (2009–12) (2026 proxy).',
    detail:'<p><b>At Uber (since Nov 2017).</b> Alongside Dara, a central figure in the cultural and governance recovery — the IPO’s legal and regulatory path, the end of mandatory arbitration and NDAs for sexual-assault survivors, a first-of-its-kind US safety transparency report, and the compliance programs.</p>'+
      '<p><b>Before Uber.</b> EVP Government Affairs, General Counsel and Corporate Secretary of <b>PepsiCo</b>; <b>Associate Attorney General of the US (2012–14)</b>, the DOJ’s third-ranking official, in the period of the large financial-crisis settlements with Bank of America and JPMorgan; earlier a Morrison &amp; Foerster partner (2001–09) and Assistant US Attorney.</p>'+
      '<p><b>Net read (editorial) — value creator.</b> Top-tier government-litigation credibility plus big-company GC experience; directly tied to Uber’s reputational recovery.</p>' },
  { id:'kansal', n:'Sachin Kansal', role:'Chief Product Officer', since:'2017', rate:'green',
    uber:'Joined as Uber’s first safety-technology product leader; Chief Product Officer since 2024, over Mobility and Delivery product and the new bets (autonomous, taxis, Uber for Teens).',
    prior:'VP Product at <b>Lookout</b> (mobile security, consumer line scaled to 120M+ users); CPO at Flywheel (taxi hailing); Director of Product at <b>Palm</b> (webOS).',
    detail:'<p><b>At Uber (since 2017).</b> First product leader focused on safety tech; <b>CPO since 2024</b>. Owns Mobility and Delivery product (PM, design, product ops) and the product strategy for new bets — autonomous, taxis, sustainability, Uber for Teens.</p>'+
      '<p><b>Before Uber.</b> VP Product at <b>Lookout</b>; CPO at <b>Flywheel Software</b>; Director of Product at <b>Palm</b> (webOS, later acquired by HP).</p>'+
      '<p><b>Net read (editorial) — solid, value-creator leaning.</b> A credible marketplace and safety product operator; Palm/webOS was a commercial failure at the company level, not a personal red flag.</p>' },
  { id:'naga', n:'Praveen Neppalli Naga', role:'Chief Technology Officer', since:'2015', rate:'green',
    uber:'Leads engineering and science — the core marketplace and data infrastructure — and is Uber’s public voice on its AI work.',
    prior:'About seven years of engineering leadership at <b>LinkedIn</b>, building early products and data infrastructure.',
    detail:'<p><b>At Uber (since 2015).</b> Leads engineering and science strategy across the core marketplace and the data infrastructure; a public voice on Uber’s AI strategy.</p>'+
      '<p><b>Before Uber.</b> About seven years at <b>LinkedIn</b> in its high-growth years.</p>'+
      '<p><b>Net read (editorial) — solid, value-creator leaning.</b> Long tenure and a scaling pedigree; no red flags found.</p>' },
  { id:'kannan', n:'Madhu Kannan', role:'Chief Business Officer', since:'2017', rate:'green',
    uber:'Business development, corporate development and investments — M&amp;A, partnerships, strategic capital. First joined in 2017 (Asia-Pacific), rejoined in 2023 as global CBO.',
    prior:'<b>Bank of America Securities</b>; Group Head of Business Development at <b>Tata Sons</b>; CEO of the <b>Bombay Stock Exchange</b>; NYSE Euronext.',
    detail:'<p><b>At Uber (2017; rejoined 2023).</b> Runs global business development, corporate development and investments — M&amp;A, partnerships, strategic capital.</p>'+
      '<p><b>Before Uber.</b> Global Corporate &amp; Investment Banking at <b>Bank of America Securities</b>; Group Head of BD at <b>Tata Sons</b>; <b>CEO of the Bombay Stock Exchange</b>; Merrill Lynch; NYSE Euronext.</p>'+
      '<p><b>Net read (editorial) — value-creator leaning.</b> A senior dealmaker with capital-markets depth; the caveat is a career of several exits and returns.</p>' },
];

// ── Management against its own targets: Investor Day, Feb 2024 (3-year, 2024–2026) ──
// Actuals: the Results dataset (js/results-data/uber.js, reported) — Gross Bookings and Adjusted EBITDA as Uber
// reported them; FCF = cash from operations − capex (10-K).
var ACT = { gb:{ 2023:137865, 2024:162773, 2025:193454 }, ebitda:{ 2023:4052, 2024:6484, 2025:8730 }, fcf:{ 2023:3362, 2024:6895, 2025:9763 } };
function cagr(o){ return (Math.pow(o[2025]/o[2023], 1/2)-1)*100; }
var TARGETS = [
  { v:'Mid-to-high teens', l:'Gross Bookings CAGR', s:'Record so far: +'+((ACT.gb[2024]/ACT.gb[2023]-1)*100).toFixed(0)+'% (2024), +'+((ACT.gb[2025]/ACT.gb[2024]-1)*100).toFixed(0)+'% (2025) — '+cagr(ACT.gb).toFixed(1)+'% a year.' },
  { v:'High-30s to 40%', l:'Adjusted EBITDA CAGR', s:'Record so far: +'+((ACT.ebitda[2024]/ACT.ebitda[2023]-1)*100).toFixed(0)+'% (2024), +'+((ACT.ebitda[2025]/ACT.ebitda[2024]-1)*100).toFixed(0)+'% (2025) — '+cagr(ACT.ebitda).toFixed(1)+'% a year.' },
  { v:'&gt;90%', l:'FCF conversion (of Adj. EBITDA)', s:'Record so far: '+(ACT.fcf[2024]/ACT.ebitda[2024]*100).toFixed(0)+'% (2024), '+(ACT.fcf[2025]/ACT.ebitda[2025]*100).toFixed(0)+'% (2025).' },
];

// ── Capital allocation record (US$ M; shares = period-end, M) — 10-K FY2023–FY2025, 10-Q 2Q26 ──
var CAP = [
  { fy:'FY2022', fcf:390,  bb:0,    sbc:1793, sh:2005.5 },
  { fy:'FY2023', fcf:3362, bb:0,    sbc:1935, sh:2071.1 },
  { fy:'FY2024', fcf:6895, bb:1252, sbc:1796, sh:2108.0 },
  { fy:'FY2025', fcf:9763, bb:6523, sbc:1826, sh:2067.9 },
  { fy:'1H26',   fcf:5078, bb:3529, sbc:1023, sh:2040.0 },
];
function m$(v){ if(!v) return '—'; return v>=1000?'$'+(v/1000).toFixed(1)+'B':'$'+v+'M'; }

var BENCH = 'The operating bench is long-tenured and mostly home-grown — the COO, the President &amp; Chief Corporate Affairs Officer, the CFO and the heads of product, technology, mobility and autonomous all came up inside Uber. The thin spot is finance: three CFOs since 2023, the current one with no record yet as a public-company CFO. And every record above was built in an expansion; this team has not yet run Uber through a downturn as a profitable company.';
var FOOT = 'Roles and dates: Uber 2026 proxy statement (DEF 14A filed Mar 23 2026; DEFR14A Apr 20 2026) for the executive officers and uber.com/about/leadership (read Nov 3 2026) for the others; prior-role outcomes from company and press sources (July 2026 profile). Targets: Uber Investor Update, Feb 14 2024. Record: reported Gross Bookings and Adjusted EBITDA (Results dataset; Uber stopped treating Adjusted EBITDA as a key measure in 2Q26), GAAP operating income, free cash flow (cash from operations − capex), repurchases and SBC from the Form 10-K FY2025 (filed Feb 13 2026) and earlier 10-Ks, shares outstanding from the balance sheets, 1H26 from the Form 10-Q for 2Q26 (filed Aug 5 2026); repurchase authorizations from the 10-Qs for 1Q25 and 3Q25.';

function cardHtml(m){
  var r = null;   // ratings dropped (SAB, 2026-11-03: evidence only, as GOOGL); `rate` stays in the data
  return '<div class="ov-clickable trk-card" data-detail="exec:'+esc(m.id)+'"'+(r?' style="border-left-color:'+r.c+'"':'')+'>'+
    '<div class="trk-n">'+esc(m.n)+'</div>'+
    '<div class="trk-r">'+esc(m.role)+' · at Uber since '+esc(m.since)+'</div>'+
    (r?'<div class="trk-t"><b class="trk-c">Editorial rating:</b> '+esc(r.l)+'</div>':'')+
    '<div class="trk-t"><b class="trk-k">At Uber:</b> '+m.uber+'</div>'+
    '<div class="trk-t"><b class="trk-c">Context:</b> '+m.prior+'</div>'+
    '<div class="trk-more">Full track record ›</div></div>';
}

export function uberTrackBody(){
  var h='<p class="ov-lede">The people running Uber today, on <b>what they have actually built</b> — roles from the proxy, outcomes from the reported numbers, and the record against management’s own Investor Day targets and capital-allocation promises. <b>Tap a card</b> for the full history.</p>';
  h+='<div class="trk-grid">'+TRACK.map(cardHtml).join('')+'</div>';

  h+=sec('The turnaround, in numbers',
    '<div class="ov-kpis">'+[
      ['−$3.8B → +$5.6B', 'GAAP operating income, 2021 → 2025 (first quarterly profit: $326M in 2Q23)'],
      ['$0.4B → $9.8B', 'free cash flow, 2022 → 2025 (1H26: $5.1B)'],
      ['2,108M → 2,040M', 'shares outstanding, Dec 2024 → Jun 2026 — the first sustained fall'],
      ['$0', 'dividends — all capital returned goes through buybacks'],
    ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+esc(k[0])+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>');

  h+=sec('Against its own targets — Investor Day, February 2024 (three years, 2024–2026)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+b.v+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote">Two of the three years are in: Gross Bookings sit at the top of the range, Adjusted EBITDA above it and cash conversion above the floor. Since 2Q26 Uber no longer treats Adjusted EBITDA as a key measure, so the EBITDA target will be judged on a figure the company has de-emphasised.</div>');

  h+=sec('Capital allocation — what was promised and what was done',
    '<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Period</th><th>Free cash flow</th><th>Share repurchases</th><th>Repurchases ÷ FCF</th><th>SBC</th><th>Shares outstanding, period-end</th></tr></thead><tbody>'+
      CAP.map(function(r){ return '<tr><td><b>'+r.fy+'</b></td><td>'+m$(r.fcf)+'</td><td>'+m$(r.bb)+'</td><td>'+(r.bb?Math.round(r.bb/r.fcf*100)+'%':'—')+'</td><td>'+m$(r.sbc)+'</td><td>'+r.sh.toLocaleString('en-US',{minimumFractionDigits:1})+'M</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ov-fynote"><b>The stated order</b> (Q4 2025 remarks): (1) reinvest in growth where lifetime value beats acquisition cost · (2) fund the autonomous strategy, asset-light and partner-financed · (3) selective bolt-on M&amp;A at a "high bar" · (4) return excess capital through buybacks · (5) keep a solid investment-grade rating. The buyback language hardened: at the February 2024 launch repurchases were to "partially offset" stock-based pay; by 2025 the aim was to "steadily reduce our share count".</div>'+
    '<div class="ov-fynote"><b>The program.</b> $7.0B authorized in February 2024 (including a $1.5B accelerated repurchase completed in 1Q25) and another $20.0B in July 2025 — $27.0B in all; $19.2B was left at Dec 31 2025 and $15.7B at Jun 30 2026. Repurchases went from nothing to $1.3B (2024), $6.5B (2025) and $3.5B in the first half of 2026. Uber has never paid a dividend. The equity stakes management says it will sell over time (Didi, Grab, Aurora) are in Miscellaneous ▸ Insurance &amp; balance sheet.</div>');

  h+='<div class="ew-note"><b>The bench, in one line.</b> '+BENCH+'</div>';
  h+='<div class="ov-foot">'+FOOT+'</div>';
  return h;
}
export function uberTrackPop(id){
  var m=TRACK.filter(function(x){ return x.id===id; })[0]; if(!m) return null;
  var r=RATE[m.rate];
  return { t:esc(m.n)+' <span class="trk-pop-r">'+esc(m.role)+' · at Uber since '+esc(m.since)+''+'</span>', h:String(m.detail||'').replace(/<p><b>Net read[\s\S]*?<\/p>/g, '') };   // editorial reads dropped from view (SAB, 2026-11-03); kept in the data
}
