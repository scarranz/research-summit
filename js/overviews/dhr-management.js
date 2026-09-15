// dhr-management.js — Danaher, Deep Dive ▸ Management (4 sub-tabs).
//
// STRUCTURE: mirrors the Management pane in js/overviews/amzn.js. The first sub-tab is the
// SHARED MOLD — `makeManagement(cfg)` in js/overviews/management.js, already used by seven
// companies — so Executives & Board is a config, not code. The other three are bespoke, as
// they are for Amazon.
//
// SOURCES. Everything here is from two filings and nothing else:
//   P  = 2026 proxy statement (DEF 14A, filed 25-Mar-2026, accession 0000313616-26-000101)
//   K  = FY2025 Form 10-K (filed 24-Feb-2026, accession 0000313616-26-000062), Part I
//        "Information About Our Executive Officers"
// Share counts and compensation are as the proxy states them, as of 1-Mar-2026 for ownership.
// Stock-based compensation, buybacks, dividends and acquisition spend come from the Results and
// segments datasets rather than being retyped — see the imports.
//
// ── The thing that makes this company's governance unusual ────────────────────────────────────
// Two brothers who founded Danaher in 1984 still hold 10.7% of it between them, sit on the board
// as Chairman and Chairman of the Executive Committee, and chair the Executive and Finance
// committees. Neither is independent, which is why the board has a Lead Independent Director at
// all. And most of their stock is pledged against personal lines of credit under a 1983–88
// grandfather clause carved out of the company's own 2013 anti-pledging policy. None of that is
// hidden — the proxy says all of it plainly, including the Audit Committee's quarterly review of
// the pledges — but it does not appear in any screen, so it is set out here in full.

import { makeManagement } from './management.js';
import { esc, fMs, fPct, D_ACT, D_ADJ, D_REF, D_UP, D_DOWN, D_SEG, DHR_KIT_CSS } from './dhr-chartkit.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F';

// ═══ 1 · Executives & Board — the shared mold ═════════════════════════════════════════════════
export var DHR_MGMT = makeManagement({
  brand: BRAND,
  lede: "Danaher's <b>twelve executive officers</b> as of 2 February 2026, and the board that oversees them. " +
    "Two things stand out against a company this size. The operating bench is <b>almost entirely home-grown</b> " +
    "— the CEO and both segment EVPs came up through Danaher operating companies, and the CFO has been in the seat " +
    "since 2019. And the two <b>co-founders are still executive officers</b> forty-two years on, as Chairman of the " +
    "Board and Chairman of the Executive Committee. Tap anyone for the detail.",
  execs: [
    { id:'blair', lead:true, name:'Rainer M. Blair', title:'President & Chief Executive Officer',
      since:'CEO since Sep 2020 · joined 2010 · officer since 2014',
      line:'Came up through the operating companies; now running the post-Veralto, life-science-and-diagnostics Danaher.',
      bio:"President and Chief Executive Officer since September 2020, after serving as Executive Vice President from January 2017 to August 2020. Joined Danaher in 2010 and held a series of progressively more responsible general management positions, including Vice President – Group Executive from March 2014 to January 2017. The proxy cites his broad operating experience across end-markets and geographies, in-depth knowledge of the Danaher Business System, and leadership experience from service in the U.S. Army. Age 61. [P, K]" },
    { id:'mcgrew', name:'Matthew R. McGrew', title:'Executive Vice President & Chief Financial Officer',
      since:'CFO since Jan 2019', line:'The voice of the guide, and of the core-growth framing.',
      bio:"Executive Vice President and Chief Financial Officer since January 2019 — the seat through the Cytiva acquisition, the Veralto separation and the Masimo deal. 2025 total compensation $7,967,519. Age 53. [K, P]" },
    // ── The founders, who are still executive officers ──
    { id:'srales', name:'Steven M. Rales', title:'Chairman of the Board',
      since:'director since 1983 · Chairman since 1984',
      line:'Co-founder. CEO 1984–1990. Holds 6.0% of the company.',
      bio:"Co-founder of Danaher. On the board since 1983 and Chairman since 1984; was also CEO from 1984 to 1990. Beneficially owns 42,240,297 shares, 6.0% of the company — including 31,000,000 held by limited liability companies controlled by a revocable trust and 6,429,437 held by a charitable foundation of which he is director, which he disclaims. Brother of Mitchell P. Rales. <b>Not independent</b>, which is why the board is required to appoint a Lead Independent Director. Age 74. [K, P]" },
    { id:'mrales', name:'Mitchell P. Rales', title:'Chairman of the Executive Committee',
      since:'director since 1983 · Chairman of the Executive Committee since 1984',
      line:'Co-founder. President 1984–1990. Holds 4.7%; chairs Executive and Finance.',
      bio:"Co-founder of Danaher. On the board since 1983 and Chairman of the Executive Committee since 1984; was also President from 1984 to 1990. Chairs both the Executive Committee and the Finance Committee. Beneficially owns 33,001,391 shares, 4.7%. Also a director of ESAB Corporation. Brother of Steven M. Rales. Age 69. [K, P]" },
    // ── Segment and function leadership ──
    { id:'riley', name:'Christopher P. Riley', title:'Executive Vice President',
      since:'EVP since Jan 2024', line:'Ran Life Sciences, then Diagnostics, before the corporate seat.',
      bio:"Executive Vice President since January 2024, after serving as Vice President – Group Executive of Danaher's Life Sciences subsidiary from July 2022 to December 2023 and of the Diagnostics subsidiary from January 2020 to July 2022. 2025 total compensation $11,255,848 — the second-highest of the named executive officers, above the CFO. Age 52. [K, P]" },
    { id:'sawyer', name:'Julie Sawyer Montgomery', title:'Executive Vice President',
      since:'EVP since Jul 2024', line:'Ran Diagnostics and Beckman Coulter Diagnostics before it.',
      bio:"Executive Vice President since July 2024, after serving as Vice President – Group Executive of Danaher's Diagnostics subsidiary from January 2023 to June 2024 and President of Beckman Coulter Diagnostics from January 2020 to December 2022. Age 53. [K]" },
    { id:'milosevich', name:'Greg M. Milosevich', title:'Executive Vice President',
      since:'EVP since Jul 2025', line:'Life Science Innovations, then Beckman Coulter Life Sciences.',
      bio:"Executive Vice President since July 2025, after serving as Vice President – Group Executive of Danaher's Life Science Innovations subsidiary from November 2021 to June 2025 and as President of Beckman Coulter Life Sciences from June 2019 to October 2021. Age 59. [K]" },
    { id:'gray', name:'R. Bradley Gray', title:'Senior Vice President – Strategic Development',
      since:'joined Sep 2024', line:'Owns M&A. Came from outside, from a company that went bankrupt.',
      bio:"Senior Vice President – Strategic Development since joining Danaher in September 2024 — the M&A seat, filled from outside rather than from the bench. Previously President, CEO and a director of NanoString Technologies from 2010 to May 2024; <b>the 10-K states plainly that NanoString filed for bankruptcy in February 2024</b>. Age 49. [K]" },
    { id:'gutierrez', name:'Jose-Carlos Gutierrez-Ramos', title:'Senior Vice President – Chief Science Officer',
      since:'joined Dec 2020', line:'From AbbVie drug discovery; the science seat.',
      bio:"Senior Vice President – Chief Science Officer since joining Danaher in December 2020. Previously Vice President – Drug Discovery at AbbVie. A named executive officer, so his compensation is disclosed. Age 63. [K, P]" },
    { id:'leiken', name:'Jonathan Leiken', title:'Senior Vice President – Chief Legal Officer',
      since:'joined Aug 2025', line:'New in the seat; came from Dollar Tree and Diebold Nixdorf.',
      bio:"Senior Vice President – Chief Legal Officer since joining Danaher in August 2025. Previously EVP – Chief Legal Officer and Corporate Secretary of Dollar Tree from August 2023, and EVP – Chief Legal Officer and Secretary of Diebold Nixdorf from 2014 to August 2023; the 10-K notes Diebold Nixdorf completed pre-packaged debt restructuring proceedings between June and August 2023. Age 54. [K]" },
    { id:'ellis', name:'Brian W. Ellis', title:'Senior Vice President',
      since:'officer since 2016', line:'Was General Counsel until Aug 2025; still an officer.',
      bio:"Senior Vice President since August 2025, after serving as Senior Vice President – General Counsel from 2016 until August 2025. Age 59. [K]" },
    { id:'couchara', name:'Georgeann F. Couchara', title:'Senior Vice President – Human Resources',
      since:'SVP-HR since Apr 2022', line:'Owns the human-capital strategy the board reviews annually.',
      bio:"Senior Vice President – Human Resources since April 2022, after serving as Vice President – Talent from January 2021 and VP-HR for the Life Sciences subsidiary from July 2019. Reports directly to the CEO; the 10-K names this role as responsible for developing and executing the company's human capital strategy, which the board reviews annually. Age 49. [K]" }
  ],
  boardNote: 'eleven nominees for 2026 — the board shrinks from twelve as John T. Schwieters retires at the annual meeting',
  board: [
    { name:'Steven M. Rales',      role:'Chairman of the Board · co-founder · <b>not independent</b> · Executive, Finance, Science & Technology · director since 1983' },
    { name:'Mitchell P. Rales',    role:'Chairman of the Executive Committee · co-founder · <b>not independent</b> · chairs Executive and Finance · director since 1983' },
    { name:'Rainer M. Blair',      role:'President & CEO · <b>not independent</b> · Executive, Finance, Science & Technology · director since 2020 · also a director of Nestlé' },
    { name:'Linda Filler',         role:'<b>Lead Independent Director</b> · chairs Nominating & Governance · Science & Technology · director since 2005 · also Carlyle, Veralto' },
    { name:'A. Shane Sanders',     role:'Independent · <b>chairs Audit</b> · Nominating & Governance · director since 2021 · also Commvault' },
    { name:'Teri L. List',         role:'Independent · <b>chairs Compensation</b> · Audit · director since 2011 · also Microsoft, Visa, lululemon' },
    { name:'Elias A. Zerhouni, MD',role:'Independent · <b>chairs Science & Technology</b> · Nominating & Governance · director since 2009 · former NIH director · also OPKO Health' },
    { name:'Feroz Dewan',          role:'Independent · Finance, Nominating & Governance, Science & Technology · director since 2022 · CEO of Arena Holdings, ex-Tiger Global' },
    { name:'Raymond C. Stevens, PhD', role:'Independent · Audit, Science & Technology · director since 2017 · also Structure Therapeutics' },
    { name:'Alan G. Spoon',        role:'Independent · Compensation · director since 1999 — the longest-serving independent director · also Ralliant, IAC' },
    { name:'Charles W. Lamanna',   role:'Independent · Science & Technology · director since 2025 · age 38, the newest and by far the youngest' }
  ],
  gov: [
    { k:'Board size', v:'11', d:'from 2026; twelve until the annual meeting' },
    { k:'Independent', v:'8 of 11', d:'the CEO and both founders are not' },
    { k:'Lead Independent Director', v:'Linda Filler', d:'required because the Chairman is not independent' },
    { k:'Founder ownership', v:'10.7%', d:'Steven 6.0% + Mitchell 4.7%' },
    { k:'Board meetings in 2025', v:'6', d:'all directors attended ≥87%; ten attended 100%' },
    { k:'Auditor', v:'Ernst & Young', d:'PCAOB ID 00042; Tysons, Virginia' }
  ],
  foot: 'Sources — 2026 proxy statement (DEF 14A, filed 25-Mar-2026) for the board, committees, independence and ownership; ' +
        'FY2025 Form 10-K Part I, "Information About Our Executive Officers" (filed 24-Feb-2026), for the executive roster, ages ' +
        'and biographies. Public-filing detail only: no ownership counts or insider trades here — those are in the Pillars ▸ ' +
        'Management pillar, which syncs from Fiscal.ai.'
});

// ═══ 2 · Ownership ════════════════════════════════════════════════════════════════════════════
// Beneficial ownership as of 1 March 2026 [P]. `pledged` is carried separately because the
// pledge is the finding, not the holding.
var OWN = [
  { n:'The Vanguard Group',  sh:60973344, pct:8.6, kind:'inst',
    note:'From a Schedule 13G filed 30-Jan-2026, as of 31-Dec-2025. Shared voting power over 6,222,423 shares; shared dispositive power over all of them.' },
  { n:'Steven M. Rales',     sh:42240297, pct:6.0, kind:'founder',
    note:'Co-founder and Chairman. Includes 31,000,000 shares held by LLCs whose sole member is a revocable trust he controls, 6,429,437 held by a charitable foundation of which he is director (disclaimed), 4,790,177 other indirect and 20,683 in his 401(k). <b>The LLC shares and 3,000,000 of the foundation shares are pledged.</b>' },
  { n:'BlackRock, Inc.',     sh:50771463, pct:7.2, kind:'inst',
    note:'⚠ From a Schedule 13G filed 26-<b>Jan-2024</b>, as of 31-Dec-2023 — the proxy carries a two-year-old filing here because BlackRock has not filed a newer one. Treat the 7.2% as stale.' },
  { n:'Mitchell P. Rales',   sh:33001391, pct:4.7, kind:'founder',
    note:'Co-founder and Chairman of the Executive Committee. Includes 26,171,000 shares held by LLCs whose sole member is a revocable trust he controls, 5,983,432 held by a charitable foundation of which he is a director (disclaimed), 838,092 other indirect and 819 in his 401(k). <b>The 26,171,000 LLC shares and 5,904,000 foundation shares are pledged.</b>' }
];
var OWN_INSIDER = { sh:76782313, pct:10.8, n:21,
  note:'All current executive officers and directors as a group — 21 people. Includes options over 1,183,289 shares, 31,853 shares in executive 401(k) accounts, 49,994 in the deferred compensation program and 28,337 director phantom shares.' };

function ownBody(){
  var rows = OWN.slice().sort(function(a, b){ return b.sh - a.sh; });
  var h = DHR_KIT_CSS + MG_CSS + '<div class="dhr-mg">' +
    '<p class="dbl-lede">Two brothers who founded the company in 1984 still own <b>10.7%</b> of it between them — more ' +
      'than BlackRock, and within striking distance of Vanguard. That is the single most important governance fact ' +
      'about Danaher and it does not appear in any screen. The second most important is what those shares are doing: ' +
      'most of them are pledged against personal lines of credit.</p>' +
    '<div class="mg-own">' + rows.map(function(o){
      return '<div class="mg-own-r mg-own-' + o.kind + '">' +
        '<div class="mg-own-n">' + esc(o.n) + '<span class="mg-own-k">' + (o.kind === 'founder' ? 'founder' : 'institution') + '</span></div>' +
        '<div class="mg-own-bar"><div class="mg-own-f" style="width:' + (o.pct/9*100).toFixed(1) + '%;background:' +
          (o.kind === 'founder' ? BRAND : D_REF) + '"></div></div>' +
        '<div class="mg-own-v"><b>' + o.pct.toFixed(1) + '%</b><span>' + (o.sh/1e6).toFixed(1) + 'M shares</span></div>' +
        '<div class="mg-own-note">' + o.note + '</div></div>';
    }).join('') + '</div>' +
    '<div class="mg-kpis">' +
      '<div><b>10.7%</b><span>the two founders combined</span></div>' +
      '<div><b>' + OWN_INSIDER.pct + '%</b><span>all officers &amp; directors (' + OWN_INSIDER.n + ' people)</span></div>' +
      '<div><b>~63M</b><span>founder shares pledged as collateral</span></div>' +
      '<div><b>≤25%</b><span>secured debt vs pledged market value, 31-Dec-2025</span></div>' +
    '</div>' +
    '<div class="mg-h">The pledge, and why it is carved out of Danaher\'s own policy</div>' +
    '<p class="mg-p">In 2013 the board adopted a policy prohibiting any director or executive officer from pledging ' +
      'Danaher stock — <b>except for shares already pledged on the day it was adopted</b>. Both founders\' holdings ' +
      'were exempted on the grounds that they had been pledged for decades, to secure lines of credit that reduce the ' +
      'need to sell shares for liquidity. The proxy notes the brothers bought these shares in cash transactions ' +
      'between 1983 and 1988 and did not receive them as compensation. Those pledged shares do not count toward the ' +
      'company\'s stock ownership requirements.</p>' +
    '<p class="mg-p">The Audit Committee reviews the pledges quarterly and has concluded they do not pose undue risk, ' +
      'citing: that the maximum secured indebtedness permitted under the lines of credit would not exceed <b>25% of the ' +
      'market value</b> of the pledged collateral at 31 December 2025; the number and percentage of shares pledged; and ' +
      'a <b>more than 15% reduction</b> in the aggregate pledged since 2013. <b>All of that is disclosure, not our ' +
      'assessment.</b> What it means for a reader is simple: a large block of insider stock is collateral, and a deep ' +
      'enough drawdown is the scenario in which it stops being a passive holding.</p>' +
    '<div class="dbl-note">As of 1 March 2026 [2026 proxy]. Percentages are the proxy\'s own. ' +
      '<b>BlackRock\'s line is two years stale</b> — the proxy cites a January 2024 Schedule 13G because no newer one ' +
      'has been filed, so its 7.2% describes end-2023 and is not comparable with Vanguard\'s end-2025 figure. ' +
      'Officers and directors as a group is 21 people against the twelve executive officers and eleven nominees ' +
      'listed on the first sub-tab, because the group counts everyone in office rather than only those standing.</div>' +
    '</div>';
  return h;
}

// ═══ 3 · Governance & SBC ═════════════════════════════════════════════════════════════════════
// The 2025 pay figures are the proxy's Summary Compensation Table. SBC in dollars is the
// company-wide expense from the cash-flow statement, which is a different thing and says so.
var NEO = [
  { n:'Rainer M. Blair',            t:'President & CEO',      sal:1400000, stock:9292370, opt:8386657, inc:4194400, oth:521853, tot:23795280 },
  { n:'Christopher P. Riley',       t:'Executive VP',         sal: 848000, stock:4425309, opt:4294467, inc:1587880, oth:100192, tot:11255848 },
  { n:'Matthew R. McGrew',          t:'Executive VP & CFO',   sal:1005330, stock:2519058, opt:2273537, inc:1882480, oth:287114, tot: 7967519 }
];
var SBC_Y = { '2021':184, '2022':295, '2023':306, '2024':288, '2025':298 };   // $M, cash-flow statement

function govBody(){
  var h = DHR_KIT_CSS + MG_CSS + '<div class="dhr-mg">' +
    '<p class="dbl-lede">The CEO was paid <b>$23.8M</b> in 2025, <b>343 times</b> the median Danaher employee\'s ' +
      '$69,440. Three quarters of that is equity, and until this year essentially all of the performance half of it ' +
      'turned on <b>one</b> measure: total shareholder return against the S&amp;P 500. For 2026 the company changed ' +
      'both the benchmark and the measure — which is the item on this tab worth an argument.</p>' +
    '<div class="mg-h">2025 compensation, as the proxy reports it</div>' +
    '<div class="rs-tablewrap"><div class="rs-ft-cap">$ · Summary Compensation Table, 2026 proxy · named executive ' +
      'officers only — Danaher discloses five NEOs and the three largest are shown</div>' +
      '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Officer</th>' +
        '<th>Salary</th><th>Stock awards</th><th>Option awards</th><th>Incentive plan</th><th>All other</th><th>Total</th>' +
      '</tr></thead><tbody>' +
      NEO.map(function(p){
        return '<tr class="rs-ft-main"><td class="rs-ft-h">' + esc(p.n) + '<br><span class="rs-ft-dim" style="font-weight:400">' + esc(p.t) + '</span></td>' +
          [p.sal, p.stock, p.opt, p.inc, p.oth, p.tot].map(function(v, i){
            return '<td' + (i === 5 ? ' style="font-weight:800"' : '') + '>$' + Math.round(v).toLocaleString('en-US') + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '<tr class="rs-ft-nb"><td class="rs-ft-h">Equity as a share of total</td>' +
        NEO.map(function(){ return ''; }).join('') +
        '<td colspan="6" class="rs-ft-dim">Blair ' + fPct((NEO[0].stock + NEO[0].opt)/NEO[0].tot*100) +
        ' · Riley ' + fPct((NEO[1].stock + NEO[1].opt)/NEO[1].tot*100) +
        ' · McGrew ' + fPct((NEO[2].stock + NEO[2].opt)/NEO[2].tot*100) + '</td></tr>' +
      '</tbody></table></div></div>' +
    '<p class="mg-p"><b>Riley out-earned the CFO by $3.3M</b>, on a salary $157k lower. The whole difference is equity, ' +
      'and the proxy does not explain the grant — worth a question rather than a conclusion.</p>' +

    '<div class="mg-h">How the performance half is measured — and what changed for 2026</div>' +
    '<div class="mg-two">' +
      '<div class="mg-box mg-box-old"><div class="mg-box-h">PSUs granted through 2025</div>' +
        '<ul class="mg-ul">' +
        '<li><b>100%</b> relative total shareholder return, measured against the <b>S&amp;P 500 Index</b></li>' +
        '<li>A <b>ROIC modifier</b> of ±10% on the outcome, on three-year average ROIC against the baseline year</li>' +
        '<li>Payout capped at 100% if absolute TSR is negative; a <b>minimum 25%</b> vests if absolute TSR is positive</li>' +
        '<li>Two-year post-vest holding period; dividends credited but paid only on shares that actually vest</li>' +
        '</ul></div>' +
      '<div class="mg-box mg-box-new"><div class="mg-box-h">PSUs granted from 2026</div>' +
        '<ul class="mg-ul">' +
        '<li>Relative TSR cut from <b>100% to 50%</b> of the award</li>' +
        '<li>Benchmark changed from the S&amp;P 500 to the <b>S&amp;P 500 Health Care Index</b></li>' +
        '<li>A <b>three-year adjusted EPS target</b> added at the other 50%</li>' +
        '<li>Threshold payout re-anchored to the 25th percentile, target to the 50th</li>' +
        '<li>The 25% minimum payout for positive absolute TSR was <b>deleted</b>; the 100% cap for negative TSR stayed</li>' +
        '</ul></div>' +
    '</div>' +
    '<p class="mg-p">The company\'s stated reason is Danaher\'s "evolution into a more focused life science and ' +
      'diagnostics company", so the comparison sits against the companies it competes with for investors. Both readings ' +
      'are available and the tab does not pick one: <b>the benign read</b> is that a diversified industrial\'s benchmark ' +
      'stopped fitting a life-science company, and half the award now turns on something management controls directly. ' +
      '<b>The sceptical read</b> is that the benchmark was changed and the hurdle re-anchored after three years of ' +
      'falling operating margin, and that deleting the positive-TSR minimum is the only change that unambiguously ' +
      'lowers a payout.</p>' +

    '<div class="mg-h">Stock-based compensation — the company-wide expense</div>' +
    '<div class="mg-spark">' + Object.keys(SBC_Y).map(function(y){
      var v = SBC_Y[y], mx = 320;
      return '<div class="mg-sb' + (y === '2025' ? ' on' : '') + '"><div class="mg-sb-v">$' + v + 'M</div>' +
        '<div class="mg-sb-bar" style="height:' + Math.round(v/mx*100) + '%"></div><div class="mg-sb-l">' + y + '</div></div>';
    }).join('') + '</div>' +
    '<p class="mg-p">$298M on $24,568M of sales — <b>1.2% of revenue</b>, and about a sixth of the acquisition ' +
      'amortisation that dominates the GAAP-to-adjusted bridge. For a company of this size that is unremarkable, and ' +
      'it is the reason this tab spends its space on the pledge and the PSU redesign instead.</p>' +

    '<div class="mg-h">The rest of the governance file</div>' +
    '<div class="mg-gov">' +
      '<div><b>No hedging</b><span>prohibited for directors and executive officers</span></div>' +
      '<div><b>Anti-pledging since 2013</b><span>with both founders grandfathered — see Ownership</span></div>' +
      '<div><b>5× cash retainer</b><span>director stock ownership requirement, within five years</span></div>' +
      '<div><b>343 : 1</b><span>CEO to median employee ($69,440)</span></div>' +
      '<div><b>Annual elections</b><span>all eleven nominees stand each year</span></div>' +
      '<div><b>Ernst &amp; Young</b><span>auditor; shareholders ratify annually</span></div>' +
    '</div>' +
    '<div class="dbl-note">Compensation, pay ratio, PSU design and the governance policies are from the <b>2026 proxy ' +
      'statement</b> (DEF 14A, filed 25-Mar-2026). Stock-based compensation is the company-wide expense from the ' +
      'cash-flow statement via SEC XBRL — <b>a different figure from the grant-date values in the table above</b>, which ' +
      'cover five people. The named executive officers are Blair, McGrew, Riley, Sawyer Montgomery and ' +
      'Gutierrez-Ramos; the three largest are shown.</div>' +
    '</div>';
  return h;
}

// ═══ 4 · Track record ═════════════════════════════════════════════════════════════════════════
// Capital allocation, from the same XBRL pull behind Bottom Line. Everything here is a reported
// cash-flow figure; the judgement is confined to the closing paragraph and is labelled.
var CAP = [
  { y:'2021', acq:10901, bb:null, div:742, note:'Aldevron ($9.6B) — the year after Cytiva' },
  { y:'2022', acq:  582, bb:0,    div:818, note:'A pause' },
  { y:'2023', acq: 5610, bb:0,    div:821, note:'Abcam ($5.7B), and Veralto separated in September' },
  { y:'2024', acq:  558, bb:5979, div:768, note:'The first buyback of any size in the series' },
  { y:'2025', acq:    0, bb:3088, div:878, note:'<b>No acquisitions at all</b> — then Masimo closed in June 2026' }
];
var SEPARATIONS = [
  { y:'2016', n:'Fortive',  what:'Industrial technologies — professional instrumentation and industrial technologies, roughly half the company by revenue at the time.' },
  { y:'2019', n:'Envista',  what:'Dental. IPO in September 2019, full separation by December.' },
  { y:'2023', n:'Veralto',  what:'Water quality and product identification — $4,828M of FY2022 revenue. Completed 30 September 2023; VLTO traded regular-way from 2 October.' }
];
function trackBody(){
  var maxA = 11000;
  var h = DHR_KIT_CSS + MG_CSS + '<div class="dhr-mg">' +
    '<p class="dbl-lede">Danaher has spent forty years buying companies and, lately, giving them away. In seven years ' +
      'it separated <b>three</b> businesses — Fortive, Envista, Veralto — and became a life-science and diagnostics ' +
      'company by subtraction as much as by purchase. The record below is what management actually did with the cash, ' +
      'not what it said about it.</p>' +
    '<div class="mg-h">What the cash went to</div>' +
    '<div class="rs-tablewrap"><div class="rs-ft-cap">$M · from the consolidated statements of cash flows, SEC XBRL ' +
      '(CIK 0000313616) · acquisitions are net of cash acquired</div>' +
      '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Year</th>' +
        '<th>Acquisitions</th><th>Buybacks</th><th>Dividends</th><th>What happened</th></tr></thead><tbody>' +
      CAP.map(function(r){
        return '<tr class="rs-ft-main"><td class="rs-ft-h">FY' + r.y.slice(2) + '</td>' +
          '<td>' + (r.acq == null ? '<span class="rs-ft-nil">—</span>' : fMs(r.acq)) + '</td>' +
          '<td>' + (r.bb == null ? '<span class="rs-ft-nil">n/d</span>' : fMs(r.bb)) + '</td>' +
          '<td>' + fMs(r.div) + '</td><td class="rs-ft-dim">' + r.note + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
    '<p class="mg-p"><b>The shape changed in 2024.</b> Through 2023 Danaher bought companies and paid a token dividend; ' +
      'it repurchased nothing at all in 2022 or 2023. Then it spent <b>$5,979M</b> on buybacks in 2024 and $3,088M in ' +
      '2025 while acquisition spending went to <b>zero</b> — and then closed Masimo in June 2026, taking gross debt from ' +
      '$18.4B to $26.6B in a quarter. Two years of returning cash for want of a target, followed immediately by the ' +
      'largest deal since Cytiva.</p>' +

    '<div class="mg-h">What it gave away</div>' +
    '<div class="mg-tl">' + SEPARATIONS.map(function(s){
      return '<div class="mg-tli"><div class="mg-tlq">' + s.y + ' · ' + esc(s.n) + '</div>' +
        '<div class="mg-tlt">' + esc(s.what) + '</div></div>';
    }).join('') + '</div>' +
    '<p class="mg-p">The consequence for anyone reading the financials is mechanical and catches people out: <b>a ' +
      'long-run revenue CAGR off the reported totals is meaningless.</b> FY2022 to FY2023 looks like a 24% collapse ' +
      'and is almost entirely Veralto leaving. See Top Line ▸ Other ▸ Before Veralto for the same years on both bases.</p>' +

    '<div class="mg-h">What the incentive actually rewarded</div>' +
    '<p class="mg-p">Through 2025 the performance half of executive equity turned entirely on <b>total shareholder ' +
      'return against the S&amp;P 500</b>, with a ±10% modifier for three-year average ROIC. So the plan paid for the ' +
      'share price and nudged for returns on capital — it did not pay for revenue growth, for margin, or for the ' +
      'success of any individual acquisition. From 2026 half of it pays for three-year adjusted EPS instead. Details ' +
      'and both readings of that change are on the Governance &amp; SBC tab.</p>' +
    '<div class="mg-note-ours"><b>Ours, not the filing\'s.</b> The record above is reported cash flow; this paragraph ' +
      'is a read. The last five years are a company that stopped being able to deploy capital into deals at its ' +
      'historic rate — $0 of acquisitions in FY2025 against $10.9B in FY2021 — and returned $9.1B to shareholders in ' +
      'the meantime, before spending it again on one asset. Whether that reads as discipline or as a shrinking ' +
      'opportunity set is the question Masimo answers, and it will take three years to answer it.</div>' +
    '<div class="dbl-note">Cash-flow figures from SEC XBRL, FY2021–FY2025, newest filing per period. Buybacks are not ' +
      'tagged before FY2022, which is why FY2021 shows n/d rather than zero. <b>Acquisition purchase prices are not in ' +
      'this dataset</b> — Aldevron and Abcam are cited from the deal announcements, and no price for Masimo or StatLab ' +
      'has been located in anything filed.</div>' +
    '</div>';
  return h;
}

// ═══ CSS ══════════════════════════════════════════════════════════════════════════════════════
var MG_CSS = '<style>' +
  '.dhr-mg{max-width:1000px}' +
  '.mg-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + BRAND2 + ';margin:26px 0 10px;display:flex;align-items:center;gap:8px}' +
  '.mg-h::after{content:"";flex:1;height:1px;background:var(--bdr)}' +
  '.mg-p{font-size:12.5px;line-height:1.62;color:var(--tx);margin:10px 0;max-width:84ch}' +
  '.mg-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px;margin:18px 0 4px}' +
  '.mg-kpis>div{border:1px solid var(--bdr);border-top:3px solid ' + BRAND + ';border-radius:10px;padding:11px 13px}' +
  '.mg-kpis b{display:block;font-size:20px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums;letter-spacing:-.02em}' +
  '.mg-kpis span{font-size:10px;color:var(--mu);font-weight:600;line-height:1.35;display:block;margin-top:3px}' +
  '.mg-own{margin:16px 0 4px}' +
  '.mg-own-r{display:grid;grid-template-columns:210px 1fr 120px;gap:12px;align-items:center;padding:11px 0;border-top:1px solid var(--bdr)}' +
  '.mg-own-r:first-child{border-top:0}' +
  '.mg-own-n{font-size:13px;font-weight:800;color:var(--navy)}' +
  '.mg-own-k{display:block;font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin-top:2px}' +
  '.mg-own-bar{height:22px;background:#EEF2F6;border-radius:5px;overflow:hidden}' +
  '.mg-own-f{height:100%;border-radius:5px}' +
  '.mg-own-v{text-align:right}.mg-own-v b{font-size:17px;font-weight:800;color:var(--navy);font-variant-numeric:tabular-nums}' +
  '.mg-own-v span{display:block;font-size:10px;color:var(--mu);font-weight:600}' +
  '.mg-own-note{grid-column:1/-1;font-size:11px;line-height:1.55;color:var(--mu);margin-top:-2px}' +
  '.mg-own-founder .mg-own-n{color:' + BRAND + '}' +
  '.mg-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 4px}' +
  '@media(max-width:640px){.mg-two{grid-template-columns:1fr}.mg-own-r{grid-template-columns:1fr}}' +
  '.mg-box{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--card,#fff)}' +
  '.mg-box-old{border-left:3px solid var(--mu)}.mg-box-new{border-left:3px solid ' + BRAND + '}' +
  '.mg-box-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:7px}' +
  '.mg-ul{margin:0;padding-left:17px}.mg-ul li{font-size:11.5px;line-height:1.55;color:var(--tx);margin-bottom:5px}' +
  '.mg-spark{display:flex;align-items:flex-end;gap:10px;height:110px;margin:14px 0 4px;max-width:420px}' +
  '.mg-sb{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;height:100%}' +
  '.mg-sb-v{font-size:10px;font-weight:800;color:var(--navy)}' +
  '.mg-sb-bar{width:100%;border-radius:4px 4px 0 0;background:#B7CBE0}.mg-sb.on .mg-sb-bar{background:' + BRAND + '}' +
  '.mg-sb-l{font-size:9.5px;color:var(--mu);font-weight:600}' +
  '.mg-gov{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px;margin:12px 0 4px}' +
  '.mg-gov>div{border:1px solid var(--bdr);border-radius:9px;padding:10px 12px}' +
  '.mg-gov b{display:block;font-size:13px;font-weight:800;color:var(--navy)}' +
  '.mg-gov span{font-size:10.5px;color:var(--mu);font-weight:600;line-height:1.4;display:block;margin-top:2px}' +
  '.mg-tl{position:relative;margin:14px 0 4px;padding-left:22px}' +
  '.mg-tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--bdr)}' +
  '.mg-tli{position:relative;margin-bottom:14px}.mg-tli:last-child{margin-bottom:2px}' +
  '.mg-tli::before{content:"";position:absolute;left:-21px;top:3px;width:10px;height:10px;border-radius:50%;background:' + BRAND + ';border:2px solid var(--card,#fff);box-shadow:0 0 0 1px var(--bdr)}' +
  '.mg-tlq{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy)}' +
  '.mg-tlt{font-size:12.5px;line-height:1.6;color:var(--tx);margin-top:3px;max-width:82ch}' +
  '.mg-note-ours{border-left:3px solid ' + BRAND + ';background:rgba(15,125,194,.06);border-radius:0 9px 9px 0;padding:11px 14px;margin:14px 0 4px;font-size:12px;line-height:1.6;color:var(--navy);max-width:84ch}' +
  '</style>';

// ═══ Exports ══════════════════════════════════════════════════════════════════════════════════
export function dhrMgmtTeamHtml(){ return DHR_MGMT.body(); }
export function dhrMgmtOwnHtml(){ return ownBody(); }
export function dhrMgmtGovHtml(){ return govBody(); }
export function dhrMgmtTrackHtml(){ return trackBody(); }
// Only the shared mold needs wiring — it owns the CV modal. The other three are prose and tables.
export function dhrMgmtTeamInit(root){ DHR_MGMT.init(root); }
