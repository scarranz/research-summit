// overviews/tpl-gov.js — Texas Pacific Land Deep Dive ▸ Management ▸ Governance & SBC (MG-GOV, playbook §15).
//
// COPIED from js/overviews/googl-gov.js: lede · 4 KPIs · "How TPL is governed" as one .twrap/.rt table (A29: the box
// CSS lives only in Bottom Line) · capital returns against SBC · the governance history (trust → corporation, the
// Horizon Kinetics agreements and the court case, the charter and bylaw changes) · a pointer to the SBC chart · footer.
// No figure repeats Ownership: the holders, the 14.7% and the share count live there. The history is told only from
// filings (dates and wording as filed).
// Sources (reported figures, rule 10): TPL Form 10-K FY2025 (filed Feb 18 2026: cash flows, statements of income,
// Item 5, MD&A liquidity), Form 10-K FY2023 (filed Feb 21 2024: Stockholders' Agreement, Cooperation Agreement, legal
// proceedings, legal and professional fees), Form 10-Q for 2Q26 (filed Aug 5 2026), the 2026 proxy statement (DEF 14A,
// filed Sep 25 2026) and Forms 8-K of Aug 1 2023, Nov 13 2023, Feb 27 2024, Mar 7 2024, Nov 12 2024, Aug 8 2025, Aug 27 2025
// and May 6 2026, and the 8-K/A of Feb 28 2024.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// US$ thousand — Form 10-K FY2025 (cash flows: dividends paid, repurchases, SBC; revenue) and Form 10-Q 2Q26 (1H26)
var CAP = [
  { p:'FY2023', div:99972,  spec:0,      bb:42573, sbc:10343, rev:631595 },
  { p:'FY2024', div:347309, spec:229834, bb:29159, sbc:12498, rev:705823 },
  { p:'FY2025', div:147798, spec:0,      bb:8380,  sbc:15131, rev:798190 },
  { p:'1H26',   div:83183,  spec:0,      bb:0,     sbc:9451,  rev:null },
];
var Y = CAP[2];
function m(v){ return v>=1e6 ? '$'+(v/1e6).toFixed(2)+'B' : '$'+(v/1000).toFixed(1)+'M'; }

var ROWS = [
  ['Share class', 'One class, one vote',
   'A single class of common stock, one vote a share, no cumulative voting (2026 proxy). The charter allows up to 1,000,000 preferred shares without a stockholder vote; none are outstanding (10-Q 2Q26). No holder has special voting rights; the holders are in Ownership.'],
  ['Board', 'Independent Chair · 8 of 9 independent',
   'Rhys J. Best, independent and non-executive, has chaired the board since November 10, 2023 (8-K, Nov 13 2023); the CEO is the only management director. All nine directors stand each year for a one-year term, elected by a majority of votes cast, with a resignation policy for incumbents who miss it (2026 proxy).'],
  ['Committees', 'Four standing committees, all independent members',
   'Audit (chair Donna E. Epps; three audit committee financial experts), Compensation (chair Barbara J. Duganier), Nominating and Corporate Governance (chair Marguerite Woung-Chapman) and Strategic Acquisitions (chair Karl F. Kurz), which can itself approve cash acquisitions of $50–100 million, subject to an annual cap (2026 proxy).'],
  ['Stockholder rights', 'Proxy access · 25% special-meeting right',
   'Proxy access since August 5, 2025: a holder or group of up to 20 owning 3% for three years can nominate the greater of two directors or 25% of the board in the company’s proxy (8-K, Aug 8 2025). Holders of 25% of the shares can require a special meeting (charter amendment approved at the November 8, 2024 meeting, 8-K Nov 12 2024). The board recommends redomiciling from Delaware to Texas at the November 5, 2026 meeting (Proposal 4, needs a majority of outstanding shares); the Texas documents keep annual elections, majority voting, proxy access and the special-meeting right (2026 proxy).'],
  ['Largest holder', 'A designated director, with a standstill',
   'Horizon Kinetics’ co-CEO Peter Doyle joined the board on May 5, 2026 under a Board Representative Agreement with mutual non-disparagement and standstill terms for as long as he serves; he sits on Strategic Acquisitions. In December 2025 the Audit Committee reviewed Horizon Kinetics’ investment of about $47.5M in Bolt, in which TPL had invested $50.0M (2026 proxy, Transactions with Related Persons).'],
  ['Capital returns', 'A cash target, then specials or buybacks',
   'A target cash balance of about $700M; above it, "the majority of our free cash flow" goes to special dividends and/or buybacks. A $250M repurchase program has been in place since January 1, 2023. No debt; a $500M credit facility (October 2025) was undrawn at June 30, 2026 (10-K FY2025, 10-Q 2Q26).'],
  ['SBC against buybacks', 'Small, and below buybacks until 2025',
   'Stock-based compensation was '+m(Y.sbc)+' in 2025 ('+(Y.sbc/Y.rev*100).toFixed(1)+'% of revenue). Buybacks ran above it in 2023 and 2024 and below it in 2025; none were made in the first half of 2026. At least half of each executive officer’s long-term award is performance-based (10-K FY2025, Item 11).'],
];

// Governance history — only what the filings say
var HIST = [
  ['1888 – 2020', 'Texas Pacific Land Trust, set up under a Declaration of Trust of February 1, 1888 to hold land of the Texas and Pacific Railway; on June 23, 2019 the trustees formed a Conversion Exploration Committee, which on January 21, 2020 recommended reorganising into a Delaware corporation (2026 proxy).'],
  ['Jun 11, 2020', 'After "a proxy contest mounted by certain holders of Sub-shares", the Trust signed a Stockholders’ Agreement (amended Dec 14, 2020) with Horizon Kinetics, SoftVest and Mission Advisors: Dana F. McGinnis, Eric L. Oliver and Murray Stahl joined the board at the conversion, and the parties agreed to vote their shares as the board recommended, subject to exceptions (10-K FY2023).'],
  ['Jan 11, 2021', 'The Trust became Texas Pacific Land Corporation, a Delaware corporation (2026 proxy).'],
  ['2022', 'Mr. McGinnis resigned in March 2022. At the 2022 annual meeting a dispute arose over how Horizon Kinetics and SoftVest voted on Proposal 4, raising the authorized common shares from 7,756,156 to 46,536,936; on November 23, 2022 TPL sued them in the Delaware Court of Chancery over their voting commitments (10-K FY2023; 8-K/A, Feb 28 2024).'],
  ['Jul 28, 2023', 'Cooperation Agreement with Horizon Kinetics and SoftVest: Stahl, Marguerite Woung-Chapman and Robert Roosa nominated for the 2023 meeting, the pre-signed resignation letters of Stahl and Oliver withdrawn, voting commitments, non-disparagement and a standstill while Stahl or Oliver sat on the board (10-K FY2023; 8-K, Aug 1 2023).'],
  ['Nov 10, 2023', 'Annual meeting: Roosa, Stahl and Woung-Chapman elected for one-year terms; Rhys J. Best appointed Chair. A non-binding stockholder proposal for a special-meeting right passed (8-K, Nov 13 2023). Legal and professional fees for 2023 were $31.5M (2022: $8.7M), "principally related to legal expenses associated with stockholder matters" (10-K FY2023).'],
  ['Dec 1, 2023 – Feb 26, 2024', 'The Court of Chancery ruled that the Investor Group’s 1,587,902 shares were deemed voted for Proposal 4, which was deemed approved; the Delaware Supreme Court affirmed on February 26, 2024. The charter was amended on March 1, 2024 and a 3-for-1 split followed on March 26, 2024 (8-K, Feb 27 2024; 8-K/A, Feb 28 2024; 8-K, Mar 7 2024).'],
  ['Nov 8, 2024', 'Stockholders approved the 25% special-meeting right; all six directors elected that year (Class I and Class III) took one-year terms (8-K, Nov 12 2024).'],
  ['2025', 'The board adopted proxy access on August 5, 2025 (8-K, Aug 8 2025). Mr. Oliver (SoftVest) told the company on August 26, 2025 that he would not stand for re-election at the 2025 meeting, citing no disagreement (8-K, Aug 27 2025). At the November 2025 meeting all nine directors were elected for one-year terms (8-K, Nov 12 2025); a second 3-for-1 split took effect on December 22, 2025 (2026 proxy; 10-K FY2025).'],
  ['Apr 7 – May 5, 2026', 'Murray Stahl died on April 7, 2026, which ended the Cooperation Agreement. On May 5, 2026 TPL signed a Board Representative Agreement with Horizon Kinetics, and its co-CEO Peter Doyle joined the board as its designee (2026 proxy; 8-K, May 6 2026).'],
];

export function tplGovBody(){
  var h='<p class="ov-lede">One share, one vote, an independent Chair and fully independent committees; the largest holder, Horizon Kinetics, has a director and a standstill, after a 2022–24 court fight over a voting agreement that TPL won. Cash goes back mostly as dividends; stock pay is small.</p>';
  h+='<div class="ov-kpis">'+[
    ['8 of 9', 'independent directors · independent Chair (2026 proxy)'],
    [m(Y.sbc), 'stock-based compensation, FY2025 · '+(Y.sbc/Y.rev*100).toFixed(1)+'% of revenue'],
    [m(Y.div), 'dividends paid, FY2025 · $0.60 a share a quarter in 2026'],
    [m(Y.bb), 'share repurchases, FY2025 (FY2024: '+m(CAP[1].bb)+'; none in 1H26)'],
  ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h mg-sec-gap">How TPL is governed</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl gov-tbl"><thead><tr><th>Topic</th><th>In short</th><th>Detail</th></tr></thead><tbody>'+
    ROWS.map(function(r){ return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td><td class="own-role">'+esc(r[2])+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ov-sec-h mg-sec-gap">Capital returned against stock-based pay</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl"><thead><tr><th>Period</th><th>Dividends paid</th><th>of which special</th><th>Share repurchases</th><th>SBC</th><th>SBC % of revenue</th></tr></thead><tbody>'+
    CAP.map(function(r){ return '<tr><td><b>'+r.p+'</b></td><td>'+m(r.div)+'</td><td>'+(r.spec?m(r.spec)+' ($3.33 a share)':'—')+'</td><td>'+(r.bb?m(r.bb):'$0')+'</td><td>'+m(r.sbc)+'</td><td>'+(r.rev?(r.sbc/r.rev*100).toFixed(1)+'%':'—')+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
  h+='<div class="ov-fynote">Regular dividends were $1.44 a share in 2023, $1.70 in 2024 and $2.13 in 2025 (split-adjusted), plus the $3.33 special in 2024. The SBC and diluted-share chart is in Bottom Line ▸ General ▸ Stock-based compensation; it is not drawn again here.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">From trust to corporation, and the Horizon Kinetics agreements</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl gov-tbl"><thead><tr><th>When</th><th>What the filings say</th></tr></thead><tbody>'+
    HIST.map(function(r){ return '<tr><td><b>'+esc(r[0])+'</b></td><td class="own-role">'+esc(r[1])+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ov-foot">Sources: TPL Form 10-K FY2025 (filed Feb 18 2026; statements of cash flows, income and equity — dividends, repurchases, SBC, revenue; liquidity and capital resources — cash target, credit facility; Item 11 — pay design) and Form 10-Q for 2Q26 (filed Aug 5 2026; 1H26 dividends, SBC, no repurchases, facility undrawn); Form 10-K FY2023 (filed Feb 21 2024; Stockholders’ Agreement, Cooperation Agreement, legal proceedings, legal and professional fees); 2026 proxy statement (DEF 14A, filed Sep 25 2026, acc. 0001104659-26-110963; board, committees, stockholder rights, Board Representative Agreement, related-person transactions, Texas redomestication, the Trust’s history); Forms 8-K of Aug 1 2023, Nov 13 2023, Feb 27 2024, Mar 7 2024, Nov 12 2024, Aug 8 2025, Aug 27 2025, Nov 12 2025 and May 6 2026, and 8-K/A of Feb 28 2024. Figures as reported; share and per-share figures split-adjusted.</div>';
  return h;
}
