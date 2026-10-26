// overviews/googl-comp.js — Alphabet Deep Dive ▸ Miscellaneous ▸ Competitive Position (MISC-comp, playbook §15b).
//
// COPIED from js/overviews/meta-comp.js (the challenges table + the competitor table), adapted (SAB, Oct 26 2026):
//   1. lede — the moat thesis, the same as Overview OV-3 "The edge"
//   2. the challenges to the moat — Dani's five arenas (relocation #17, DD_ARENA), one row each: evidence the challenge is
//      real · evidence the position holds · source. Evidence, not a verdict: no scores.
//   3. two competitor tables, the business not the valuation (SAB: Cloud + digital advertising) — each company's latest
//      reported quarter, from its own filing; what a company does not disclose is "—", never estimated.
// The peer valuation map that Dani placed here (stdPeerScatter('ind')) is not repeated: it lives in Valuation ▸ Peers.
// Market share is not shown: no primary source states it. Styles: css/overview.css, META's .mcp-* block extended.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var NIL = '<span class="rs-ft-nil">—</span>';
function money(m){ return m==null ? NIL : '$'+(m/1000).toFixed(1)+'B'; }
function pct(v){ return v==null ? NIL : (v<0?'−':'')+Math.abs(v).toFixed(1)+'%'; }
function growth(v){ if(v==null) return NIL; return (v>0?'▲ ':'▼ ')+Math.abs(v).toFixed(1)+'%'; }

var CHALLENGES = [
  { c:'Search vs AI answers (ChatGPT, Perplexity, Meta AI)',
    real:'Answers inside chatbots can replace a search; Alphabet retired its standing claim that AI Overviews monetize "at approximately the same rate" (2Q26), still runs no ads in the Gemini app ("not rushing"), and Google Network revenue has fallen in most quarters (−1% in 2Q26).',
    holds:'Search & other revenue growth accelerated through the AI rollout: +10% (1Q25) to +19% (1Q26) and +17% to $63.3B in 2Q26; AI Mode passed 1 billion monthly users and queries reached an all-time high.',
    src:'10-Q 2Q26; earnings calls 1Q25–2Q26' },
  { c:'Google Cloud vs AWS and Azure',
    real:'Both rivals are larger: AWS had $42.2B of quarterly revenue and Microsoft’s Intelligent Cloud $39.3B, with Azure growing 43% and a $678B commercial backlog; Google Cloud says it has been supply-constrained and will add higher-cost third-party capacity in 3Q26.',
    holds:'Google Cloud grew faster (+82% to $24.8B in 2Q26, against +37% at AWS and +32% at Intelligent Cloud), at a 35.6% operating margin, with a $514B backlog and its own TPU chips — now also sold to customers.',
    src:'Company filings (table below); Alphabet 2Q26 call' },
  { c:'YouTube vs TikTok, Netflix and Instagram',
    real:'Meta’s advertising grew faster than YouTube’s in 2Q26 (+27% against +13%), and short-form video competes for the same ad budgets and viewing time.',
    holds:'YouTube ranked first in US TV viewing time (Nielsen, June 2025); its ads and subscriptions passed $60B of revenue in 2025; Shorts earn as much per watch hour as long-form in the US (2Q25 call).',
    src:'10-Q 2Q26; Meta 10-Q 2Q26; calls 2Q25, 4Q25' },
  { c:'Gemini vs OpenAI and Anthropic',
    real:'The frontier labs compete for the same users and developers; management acknowledged areas to improve, coding and agentic coding among them (2Q26 call), and R&D grew 32% on AI hiring.',
    holds:'The Gemini app reached 950M monthly users and the model APIs about 22 billion tokens a minute (2Q26); the labs are also Google Cloud customers — 9 of the 10 largest, with Anthropic planning up to 1 million TPUs.',
    src:'Calls 3Q25, 2Q26' },
  { c:'Agentic commerce vs Amazon',
    real:'Amazon owns the store, checkout and the shopper data, and its advertising grew 26% to $19.8B in 2Q26.',
    holds:'Alphabet is building open rails instead of a store: the Universal Commerce Protocol, joined by Amazon, Meta, Microsoft, Salesforce and Stripe (1Q26), checkout inside AI Mode and Gemini, and Direct Offers for retailers.',
    src:'Amazon 10-Q 2Q26; Alphabet calls 4Q25–2Q26' },
];

// Cloud — each company's latest reported quarter, its own filing. capex = company-wide purchases of property and
// equipment in that quarter. backlog = what each company reports (Alphabet: Google Cloud backlog; Amazon: commitments
// in customer contracts, "primarily related to AWS"; Microsoft: commercial RPO, company-wide; Oracle: RPO, company-wide).
var CLOUD = [
  { n:'Google Cloud', tk:'GOOGL', me:true, q:'Apr–Jun 2026', rev:24768, g:81.8, om:35.6, back:'$514B', capex:44924, src:'Alphabet 10-Q 2Q26' },
  { n:'AWS', tk:'AMZN', q:'Apr–Jun 2026', rev:42232, g:36.8, om:39.4, back:'$496B', capex:54208, src:'Amazon 10-Q 2Q26' },
  { n:'Intelligent Cloud', tk:'MSFT', q:'Apr–Jun 2026', rev:39306, g:31.6, om:40.6, back:'$678B', capex:35802, note:'Azure and other cloud services +43%; the segment also includes server products', src:'Microsoft 8-K Ex. 99.1, Jul 29 2026 (fiscal Q4)' },
  { n:'Cloud Infrastructure (OCI)', tk:'ORCL', q:'Jun–Aug 2026', rev:7400, g:121, om:null, back:'$664B', capex:28499, note:'segment margin not disclosed', src:'Oracle 8-K Ex. 99.1, Sep 10 2026 (fiscal Q1)' },
];
// Digital advertising — latest quarter. margin = the segment that holds the ads business, where one is reported.
var ADS = [
  { n:'Google advertising', tk:'GOOGL', me:true, q:'Apr–Jun 2026', rev:81629, g:14.4, om:41.8, note:'margin = Google Services, which also holds subscriptions and devices', src:'Alphabet 10-Q 2Q26' },
  { n:'Meta advertising', tk:'META', q:'Apr–Jun 2026', rev:59363, g:27.5, om:38.8, note:'margin = Family of Apps', src:'Meta 10-Q 2Q26' },
  { n:'Amazon advertising services', tk:'AMZN', q:'Apr–Jun 2026', rev:19809, g:26.2, om:null, note:'no segment margin for advertising', src:'Amazon 10-Q 2Q26' },
  { n:'Microsoft search & news advertising', tk:'MSFT', q:'Apr–Jun 2026', rev:null, g:10, om:null, note:'growth excluding traffic acquisition costs; revenue not stated in the release', src:'Microsoft 8-K Ex. 99.1, Jul 29 2026' },
];

function challengesHtml(){
  return '<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-chal"><thead><tr><th>Challenge</th><th>Evidence it is real</th><th>Evidence the position holds</th><th>Source</th></tr></thead><tbody>'+
    CHALLENGES.map(function(r){ return '<tr><td class="mcp-c">'+esc(r.c)+'</td><td>'+esc(r.real)+'</td><td>'+esc(r.holds)+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>'; }).join('')+
    '</tbody></table></div>';
}
function tableHtml(rows, revLab, extra){
  var h='<div class="twrap mcp-wrap"><table class="rt mcp-tbl mcp-peers"><thead><tr><th>Business</th><th>Quarter</th><th class="mcp-num">'+revLab+'</th><th class="mcp-num">Growth y/y</th><th class="mcp-num">Op. margin</th>'+
    (extra?'<th class="mcp-num">Backlog / RPO</th><th class="mcp-num">Capex (company)</th>':'')+'<th>Note</th><th>Source</th></tr></thead><tbody>';
  h+=rows.map(function(r){
    return '<tr class="'+(r.me?'mcp-me':'')+'"><td class="mcp-name"><b>'+esc(r.n)+'</b> <span class="mcp-tk">'+esc(r.tk)+'</span></td><td>'+esc(r.q)+'</td>'+
      '<td class="mcp-num">'+money(r.rev)+'</td><td class="mcp-num">'+growth(r.g)+'</td><td class="mcp-num">'+pct(r.om)+'</td>'+
      (extra?'<td class="mcp-num">'+esc(r.back)+'</td><td class="mcp-num">'+money(r.capex)+'</td>':'')+
      '<td class="mcp-src">'+(r.note?esc(r.note):'')+'</td><td class="mcp-src">'+esc(r.src)+'</td></tr>';
  }).join('');
  return h+'</tbody></table></div>';
}

export function googlCompBody(){
  var h='<p class="ov-lede">Alphabet’s edge: distribution through several billion-user products, the data loop of its ad auctions, and an AI stack it owns end to end — TPU chips, Gemini models, its own products. '+
    'Below, the serious challenges to that position, each with the evidence on both sides, and the competing businesses side by side.</p>';
  h+='<div class="ov-sec-h">The challenges to the position</div>'+challengesHtml();
  h+='<div class="ov-sec-h mg-sec-gap">Cloud — the business, not the valuation</div>'+tableHtml(CLOUD, 'Revenue', true);
  h+='<div class="ov-fynote">Each company’s latest reported quarter: Oracle’s fiscal quarter ends in August, Microsoft’s in June. Backlog definitions differ — Alphabet reports Google Cloud’s; Amazon its customer-contract commitments, “primarily related to AWS”; Microsoft and Oracle company-wide remaining performance obligations. Capex is company-wide purchases of property and equipment. Market share is not shown: no primary source states it.</div>';
  h+='<div class="ov-sec-h mg-sec-gap">Digital advertising</div>'+tableHtml(ADS, 'Ad revenue', false);
  h+='<div class="ov-fynote">The operating margin is the segment that holds each advertising business, where one is reported; none of the four reports a margin for advertising alone.</div>';
  h+='<div class="ov-foot">Sources — Alphabet Form 10-Q for 2Q26 (filed Jul 23 2026) and earnings calls 1Q25–2Q26 (official transcripts); Amazon Form 10-Q for 2Q26 (filed Jul 31 2026); Meta Form 10-Q for 2Q26; Microsoft Form 8-K, Exhibit 99.1 (Jul 29 2026, fiscal fourth quarter); Oracle Form 8-K, Exhibit 99.1 (Sep 10 2026, fiscal first quarter) — all on SEC EDGAR. Nielsen viewing share as cited on Alphabet’s 2Q25 call. Reported figures only; no estimates, no market data. Relocated from the July profile’s Industry Analysis (five arenas).</div>';
  return h;
}
