// overviews/googl-gov.js — Alphabet Deep Dive ▸ Management ▸ Governance & SBC (MG-GOV, playbook §15).
//
// The guide's layout (lede · 4 KPIs · "How Alphabet is governed" · a pointer to the SBC chart in Bottom Line · footer),
// written as one table in the portal's .twrap/.rt style instead of boxes (A29: the box CSS lives only in Bottom Line).
// No figure repeats Ownership: the voting split by class and by person lives there. Relocation: Dani's six governance
// rows (#48) are kept, checked and updated (2026 proxy; 10-K FY2025); the capital-return part of his Capital Allocation
// card (#44, buybacks and dividend) lands here — capex goes to Miscellaneous.
// Sources (reported figures, rule 10): Alphabet Form 10-K FY2025 (consolidated statements of cash flows and of
// stockholders' equity; SBC from the cash-flow statement), Form 10-Q 2Q26, the 2026 proxy statement (DEF 14A).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// US$ million — Form 10-K FY2025 (cash flows: repurchases, dividend payments, SBC) and the Results dataset (revenue)
var CAP = {
  2023: { buyback:62184, div:0,     sbc:22460, rev:307394, sh:12722 },
  2024: { buyback:62047, div:7363,  sbc:22785, rev:350018, sh:12447 },
  2025: { buyback:45398, div:10049, sbc:24953, rev:402836, sh:12230 },
};
var Y = 2025;
function b(v){ return '$'+(v/1000).toFixed(1)+'B'; }

var ROWS = [
  ['Share classes', 'Three classes, two tickers',
   'Class A (GOOGL, 1 vote), Class C (GOOG, no vote) and unlisted Class B (10 votes, held mostly by the founders). Class C lets Alphabet pay in stock and buy back shares without diluting the founders’ vote; the split by class and by holder is in Ownership.'],
  ['Board', 'Independent Chair · 7 of 10 independent',
   'John L. Hennessy has chaired the board since January 2018, separate from the CEO role; the other independents are Arnold, Chávez, Doerr, Ferguson, Shriram and Washington (2026 proxy).'],
  ['Committees', 'Four key committees, 100% independent',
   'Audit; Risk and Compliance (created October 2025); Leadership Development, Inclusion and Compensation; Nominating and Corporate Governance — every member and chair independent (2026 proxy).'],
  ['Capital returns', 'Buybacks first, a dividend since 2024',
   'Buybacks of '+b(CAP[2023].buyback)+' (2023), '+b(CAP[2024].buyback)+' (2024) and '+b(CAP[2025].buyback)+' (2025); the dividend began in 2024 at $0.20 a quarter and is $0.22 in 2026. In 2Q26 Alphabet bought back nothing and raised $49.6B of equity as capex outran cash flow (10-Q 2Q26).'],
  ['SBC against buybacks', 'Share count down 3.9% in two years',
   'Stock-based compensation was '+b(CAP[Y].sbc)+' in '+Y+' ('+(CAP[Y].sbc/CAP[Y].rev*100).toFixed(1)+'% of revenue); buybacks ran ahead of it, and diluted shares went from '+CAP[2023].sh.toLocaleString('en-US')+'M in 2023 to '+CAP[2025].sh.toLocaleString('en-US')+'M in 2025.'],
  ['Regulatory', 'Cases and fines in the background',
   'The September 2025 remedies ruling in the US search case kept Chrome and Android with Alphabet and left default-placement payments in place without exclusivity; the US ad-tech case (liability found in April 2025) was awaiting remedies when the July 2026 profile was written; the European Commission fined Alphabet $3.5B in 3Q25 (booked in G&amp;A).'],
  ['Disclosure', 'KPIs disclosed in streaks',
   'Alphabet gives no numeric revenue or margin guidance; it discloses chosen operating figures call after call (Gemini app users, Cloud backlog, tokens processed) — a figure that stops being disclosed is itself a signal, tracked in Evolution ▸ Earnings ▸ Notes.'],
];

export function googlGovBody(){
  var c=CAP[Y];
  var h='<p class="ov-lede">An independent Chair and fully independent committees sit on top of founder voting control; capital returns are mostly buybacks, which have kept the share count falling while stock-based pay grows.</p>';
  h+='<div class="ov-kpis">'+[
    ['7 of 10', 'independent directors · independent Chair (2026 proxy)'],
    [b(c.sbc), 'stock-based compensation, FY'+Y+' · '+(c.sbc/c.rev*100).toFixed(1)+'% of revenue'],
    [b(c.buyback), 'share repurchases, FY'+Y+' (FY'+(Y-1)+': '+b(CAP[Y-1].buyback)+')'],
    [b(c.div), 'dividends paid, FY'+Y+' · $0.22 a share a quarter in 2026'],
  ].map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-v">'+k[0]+'</div><div class="ov-kpi-d muted">'+esc(k[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-sec-h mg-sec-gap">How Alphabet is governed</div>';
  h+='<div class="twrap own-wrap"><table class="rt own-tbl gov-tbl"><thead><tr><th>Topic</th><th>In short</th><th>Detail</th></tr></thead><tbody>'+
    ROWS.map(function(r){ return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td><td class="own-role">'+r[2]+'</td></tr>'; }).join('')+'</tbody></table></div>';
  h+='<div class="ov-fynote">The SBC and diluted-share chart is in Bottom Line ▸ General ▸ Stock-based compensation; it is not drawn again here.</div>';
  h+='<div class="ov-foot">Sources: Alphabet Form 10-K FY2025 (statements of cash flows and of stockholders’ equity: repurchases, dividend payments, SBC; diluted shares) and Form 10-Q for 2Q26 (equity raised, buybacks); 2026 proxy statement (DEF 14A, filed Apr 24 2026) for the board and committees; CFO remarks on the 2Q26 call for the 2026 dividend.</div>';
  return h;
}
