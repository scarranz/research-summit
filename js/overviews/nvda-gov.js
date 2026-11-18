// overviews/nvda-gov.js — NVIDIA Deep Dive ▸ Management ▸ Governance & SBC (MG-GOV, playbook §15).
//
// Copied from js/overviews/googl-gov.js: lede · 4 KPIs · "How NVIDIA is governed" as one .twrap/.rt table (A29: the box
// CSS lives only in Bottom Line) · a pointer to the SBC chart in Bottom Line · footer. No figure repeats Ownership (the
// holdings and the one-share-one-vote point live there).
// Sources (reported figures, rule 10): NVIDIA Form 10-K FY2026 (statements of cash flows: share repurchases, dividends
// paid, stock-based compensation; diluted shares; Item 5 repurchase authorization), the Results dataset (revenue), and
// the 2026 proxy statement (DEF 14A, filed May 12 2026: board, committees, majority voting, special meetings, pay).
// CEO transition and first-ever Chair: 8-K filed Nov 12 2026 (Item 5.02 + Ex. 99.1); new oversight committee and the CEO
// search firm: 3Q FY27 call, Nov 17 2026 (docs/calls/NVDA-latest.md).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// US$ million — Form 10-K FY2026 (cash flows) and the Results dataset (revenue); diluted shares in millions (split-adjusted)
var CAP = {
  2024: { buyback:9533,  div:395, sbc:3549, rev:60922,  sh:24940 },
  2025: { buyback:33706, div:834, sbc:4737, rev:130497, sh:24804 },
  2026: { buyback:40086, div:974, sbc:6386, rev:215938, sh:24514 },
};
var Y = 2026;
function b(v){ return '$'+(v/1000).toFixed(1)+'B'; }
function m(v){ return '$'+Math.round(v).toLocaleString('en-US')+'M'; }

var ROWS = [
  ['Board', 'Independent Chair · 9 of 9 independent',
   'Harvey C. Jones became NVIDIA’s first-ever Chair on Nov 11 2026, when Jensen Huang resigned as President, CEO and director; every remaining director is independent (8-K, Nov 12 2026). Until then the board had no chair and Stephen C. Neal was the independent Lead Director (2026 proxy); his role since is not disclosed.'],
  ['CEO succession', 'Interim CEO · search under way',
   'Colette Kress, EVP and CFO since 2013, is Interim CEO and remains CFO until a permanent successor is named; the board will consider internal and external candidates (8-K, Nov 12 2026) and has retained Heidrick &amp; Struggles to lead the search (3Q FY27 call).'],
  ['Committees', 'Three committees, all independent · a fourth added Nov 2026',
   'Audit (chair A. Brooke Seawell; Seawell, Jones and Lora are audit financial experts), Compensation (chair Dawn Hudson) and Nominating &amp; Corporate Governance (chair Stephen C. Neal) — every member independent (2026 proxy). On Nov 17 2026 the board established a National Security and Export Control Oversight Committee of independent directors, senior external advisors and legal counsel (3Q FY27 call).'],
  ['Stockholder rights', 'Majority voting · special meetings',
   'Directors are elected by a majority of votes cast, and stockholders can call a special meeting (2026 proxy).'],
  ['Board tenure', 'Long-serving core, recent additions',
   'Two directors have served since 1993 (Coxe, Jones) and Seawell since 1997; Dabiri and Shah joined in 2020 and Lora in 2023. Persis Drell resigned in January 2026 (2026 proxy); Jensen Huang, a director since 1993, left the board on Nov 11 2026 (8-K).'],
  ['Capital returns', 'Buybacks, plus a token dividend',
   'Repurchases of '+b(CAP[2024].buyback)+' (FY2024), '+b(CAP[2025].buyback)+' (FY2025) and '+b(CAP[2026].buyback)+' (FY2026); dividends of '+m(CAP[2026].div)+' in FY2026. The board added $60.0B of authorization in August 2025, leaving $58.5B at FY-end (10-K).'],
  ['SBC against buybacks', 'Share count down 1.7% in two years',
   'Stock-based compensation was '+b(CAP[Y].sbc)+' in FY'+Y+' ('+(CAP[Y].sbc/CAP[Y].rev*100).toFixed(1)+'% of revenue); buybacks ran six times ahead of it, and diluted shares went from '+CAP[2024].sh.toLocaleString('en-US')+'M in FY2024 to '+CAP[2026].sh.toLocaleString('en-US')+'M in FY2026.'],
  ['Executive pay', 'Mostly performance stock',
   'Executive pay is mostly performance stock units: single-year units tied to non-GAAP operating income and multi-year units tied to total shareholder return (2026 proxy, Compensation Discussion and Analysis).'],
];

export function nvdaGovBody(){
  var c=CAP[Y];
  var h='<p class="ov-lede">An interim CEO (the CFO) since the founder resigned in November 2026, under a fully independent board with its first-ever independent Chair; capital returns are almost all buybacks, which have outrun stock-based pay and kept the share count falling.</p>';
  h+='<div class="ov-kpis">'+[
    ['9 of 9', 'independent directors · independent Chair since Nov 11 2026 (8-K)'],
    [b(c.sbc), 'stock-based compensation, FY'+Y+' · '+(c.sbc/c.rev*100).toFixed(1)+'% of revenue'],
    [b(c.buyback), 'share repurchases, FY'+Y+' (FY'+(Y-1)+': '+b(CAP[Y-1].buyback)+')'],
    [m(c.div), 'dividends paid, FY'+Y+' — $0.01 a share a quarter'],
  ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h mg-sec-gap">How NVIDIA is governed</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl gov-tbl"><thead><tr><th>Topic</th><th>In short</th><th>Detail</th></tr></thead><tbody>'+
    ROWS.map(function(r){ return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td><td class="own-role">'+r[2]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ov-fynote">The SBC and diluted-share chart will be in Bottom Line ▸ General ▸ Stock-based compensation; it is not drawn again here.</div>';
  h+='<div class="ov-foot">Sources: NVIDIA Form 10-K for fiscal 2026 (SEC EDGAR, filed Feb 25 2026): statements of cash flows (repurchases, dividends paid, SBC), diluted shares and Item 5 (repurchase authorization); revenue from the Results dataset (10-K); 2026 proxy statement (DEF 14A, filed May 12 2026) for the board, committees, stockholder rights and executive pay; NVIDIA Form 8-K filed Nov 12 2026 (Item 5.02 and Ex. 99.1 press release, “NVIDIA Announces CEO Transition”) for the CEO transition and the Chair; 3Q FY27 earnings call (Nov 17 2026, third-party transcript) for the search firm and the new oversight committee. Fiscal years end in late January.</div>';
  return h;
}
