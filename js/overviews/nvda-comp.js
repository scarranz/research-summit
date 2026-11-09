// nvda-comp.js — NVIDIA Deep Dive ▸ Miscellaneous ▸ Competitive position (MISC-comp, docs/PROFILE_PLAYBOOK.md §15b).
//
// Answers: why don't rivals take NVIDIA's place? The peer map (OV-6 / VA-PEERS) compares valuation; this compares the
// business. Evidence, not a verdict (no scores).
//   • the thesis: NVIDIA's own words on what decides the market (10-K FY2026, Item 1 "Competition") + the CUDA text of
//     the old Technology tab (B2 #22, kept verbatim in nvidia.js NV_CUDA_MOAT, passed in) + the CUDA flywheel of the old
//     unused differentiator block (B2 #39, DIFF.flywheel, passed in) — merged, as the relocation map says.
//   • three challenges chosen by SAB (Nov 9 2026): custom chips at the hyperscalers · AMD catching up · concentration and
//     financing — each with the evidence for and against, every line sourced.
//   • the competitor table (rows and metrics chosen by SAB, Nov 9 2026): comparable business, its revenue and operating
//     margin, R&D, the current AI chip and its date, the software platform and who can buy it. A figure a company does
//     not publish is "—", never estimated (§18). Divisions (Google TPU, AWS Trainium) publish no revenue or margin.
// Figures in US$ millions, each company's own latest fiscal year (fiscal years differ — the column says which).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function bn(m){ return m==null ? '—' : '$'+(m/1000).toFixed(1)+'B'; }
function pct(a, b){ return (a==null||b==null) ? '—' : (a/b*100).toFixed(1)+'%'; }

// What NVIDIA itself says decides the market — 10-K FY2026, Item 1, "Competition" (verbatim).
var Q_FACTORS = 'We believe that the principal competitive factors in this market are performance, breadth of product offerings, access to customers and partners and distribution channels, software support, conformity to industry standard APIs, manufacturing capabilities, processor pricing, and total system costs.';
var Q_RIVALS = 'large cloud services companies with internal teams designing hardware and software that incorporate accelerated or AI computing functionality as part of their internal solutions or platforms';

// ─── The competitor table ──────────────────────────────────────────────────────────────────────────
// biz = the comparable business; fy = its fiscal year; rev / op = its revenue and operating income ($M); rd = company
// R&D ($M); chip = current AI chip and date; next = what is announced next; sw = software platform; buy = who can buy it;
// src = where the row comes from.
var COMP = [
  { n:'NVIDIA', hl:true, biz:'Compute & Networking segment', fy:'FY2026 (to Jan 25, 2026)', rev:193479, op:130141, rd:18497,
    chip:'Blackwell Ultra (GB300), shipping since 2Q FY26', next:'Vera Rubin — production shipments from 3Q FY27',
    sw:'CUDA and its libraries', buy:'Anyone: sold as chips, boards and full racks',
    src:'10-K FY2026 (segment note; R&D); 10-Q for the quarter ended Jul 26, 2026 (Rubin)' },
  { n:'AMD', biz:'Data Center segment', fy:'FY2025 (to Dec 27, 2025)', rev:16635, op:3603, rd:8091,
    chip:'Instinct MI355X', next:'MI450 / Helios rack — first 1 GW for OpenAI from 2H 2026',
    sw:'ROCm (open source)', buy:'Anyone',
    src:'AMD 10-K FY2025 (segment note; R&D; MI355X); AMD–OpenAI release, Oct 6, 2025 (MI450, 6 GW)' },
  { n:'Intel', biz:'Data Center and AI (DCAI) segment', fy:'FY2025 (to Dec 27, 2025)', rev:16919, op:3422, rd:13774,
    chip:'Gaudi 3 (announced 2024)', next:'Crescent Island inference GPU — customer samples expected 2H 2026; “inference-optimized GPUs on a targeted annual cadence” (10-K)',
    sw:'Intel’s own (Gaudi software)', buy:'Anyone',
    src:'Intel 10-K FY2025 (DCAI segment results; R&D; roadmap sentence); Intel newsroom, Oct 2025 (Crescent Island)' },
  { n:'Broadcom', biz:'Semiconductor Solutions segment (AI and non-AI chips)', fy:'FY2025 (to Nov 2, 2025)', rev:36858, op:21232, rd:10977,
    chip:'Custom accelerators (XPUs) built to each customer’s specification', next:'AI semiconductor revenue +74% year on year in 4Q FY25',
    sw:'The customer’s own', buy:'Only the customer it is designed for (hyperscalers, AI model companies)',
    src:'Broadcom 10-K FY2025 (segment results; R&D; XPUs); 4Q FY25 release (8-K), Dec 11, 2025 (+74%)' },
  { n:'Marvell', biz:'Whole company (one segment; data center end market $6,100M)', fy:'FY2026 (to Jan 31, 2026)', rev:8195, op:1323, rd:2075,
    chip:'Custom ASICs for data-center customers', next:'“Progressing through 3nm designs now” (10-K)',
    sw:'The customer’s own', buy:'Only the customer it is designed for',
    src:'Marvell 10-K FY2026 (revenue by end market; custom ASICs); SEC XBRL (operating income, R&D)' },
  { n:'Google TPU', biz:'In-house chip of Alphabet (no separate figures)', fy:'—', rev:null, op:null, rd:null,
    chip:'Ironwood (TPU v7), generally available Nov 6, 2025', next:'Anthropic plans to use up to 1 million TPUs (Oct 2025)',
    sw:'XLA / JAX', buy:'Rented through Google Cloud; not sold as a chip',
    src:'Google Cloud, Ironwood general availability, Nov 6, 2025; Anthropic / Google announcement, Oct 2025' },
  { n:'AWS Trainium', biz:'In-house chip of Amazon (no separate figures)', fy:'—', rev:null, op:null, rd:null,
    chip:'Trainium3 (UltraServers up to 144 chips), generally available Dec 2, 2025', next:'Trainium4 to support NVIDIA NVLink Fusion',
    sw:'AWS Neuron SDK', buy:'Rented through AWS; not sold as a chip',
    src:'AWS, Trainium3 UltraServers availability, Dec 2, 2025 (Business Wire)' },
];

// ─── The three challenges (SAB, Nov 9 2026) ─────────────────────────────────────────────────────────
var CHALLENGES = [
  { h:'The biggest customers are designing NVIDIA out', q:'Google, Amazon and the companies Broadcom and Marvell design for are building their own accelerators.',
    pro:[ 'NVIDIA’s 10-K lists “large cloud services companies with internal teams designing hardware” — Alphabet, Amazon, Microsoft — among its competitors.',
          'Google made its seventh TPU (Ironwood) generally available in Nov 2025, and Anthropic plans to use up to 1 million TPUs; AWS made Trainium3 generally available in Dec 2025.',
          'Broadcom’s AI semiconductor revenue grew 74% year on year in its 4Q FY25 (8-K, Dec 2025).' ],
    con:[ 'Scale: Broadcom’s whole Semiconductor Solutions segment ($36.9B, AI and non-AI) is a fifth of NVIDIA’s Compute & Networking ($193.5B).',
          'In-house chips are rented only inside their owner’s cloud (TPU on Google Cloud, Trainium on AWS); NVIDIA sells to every cloud, model builder and enterprise.',
          'AWS says Trainium4 will support NVIDIA’s NVLink Fusion interconnect — the in-house chip plugs into NVIDIA’s networking rather than replacing it.' ] },
  { h:'AMD is catching up', q:'AMD sells the closest merchant alternative and has won OpenAI.',
    pro:[ 'AMD and OpenAI agreed to deploy 6 GW of AMD Instinct GPUs, the first 1 GW of MI450 from 2H 2026 (AMD release, Oct 6, 2025).',
          'AMD’s Data Center segment grew 32% in FY2025, to $16.6B (10-K).',
          'ROCm is open source, which lowers the cost of moving off CUDA.' ],
    con:[ 'AMD’s Data Center segment ($16.6B, operating margin 21.7%) is less than a tenth of NVIDIA’s Compute & Networking ($193.5B, 67.3%) — and AMD’s segment also includes server CPUs.',
          'NVIDIA has shipped full racks (GB200 / GB300 NVL72) since FY2026; AMD’s first rack, Helios, is slated for 2H 2026.',
          'NVIDIA names software support and conformity to industry-standard APIs among the principal competitive factors (10-K) — where CUDA’s twenty years count.' ] },
  { h:'Revenue rests on a few customers — and NVIDIA is financing demand', q:'Two direct customers are a third of revenue, and NVIDIA now commits capital to its customers’ build-outs.',
    pro:[ 'Two direct customers were 22% and 14% of FY2026 revenue, both mainly Compute & Networking (10-K).',
          'As of Jul 26, 2026 NVIDIA had committed $36B to AI cloud agreements (it buys back capacity from AI clouds that buy its systems), $20B of data center leases for third parties and $25B of equity investments (10-Q, Note 10).',
          '“Financing arrangements with certain investment-grade customers, including extended payment terms under large, multi-quarter agreements, will continue to affect the timing of our operating cash flows” (10-Q). Receivables rose from $38.5B to $63.1B in six months.' ],
    con:[ 'The concentration is in direct customers (system builders and distributors); NVIDIA says end demand is spread across clouds, consumer internet, enterprises and sovereigns (10-K, customer classes — Top Line ▸ Customers).',
          'The financing is described as with investment-grade customers, and the AI cloud commitments fall as third parties use the capacity (10-Q, Note 10).',
          'Operating cash flow was $74.4B in the first half of FY2027 even with the receivables build (10-Q).' ] },
];

function compTable(){
  return '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Company</th><th>Comparable business</th><th>Fiscal year</th><th>Revenue</th><th>Operating margin</th><th>R&amp;D (company)</th><th>Current AI chip</th><th>Next / latest news</th><th>Software</th><th>Who can buy it</th></tr></thead><tbody>'+
    COMP.map(function(c){
      return '<tr'+(c.hl?' class="nv-comp-hl"':'')+'><td class="rs-ft-h">'+esc(c.n)+'</td><td>'+esc(c.biz)+'</td><td>'+esc(c.fy)+'</td><td>'+bn(c.rev)+'</td><td>'+pct(c.op, c.rev)+'</td><td>'+bn(c.rd)+'</td>'+
        '<td>'+esc(c.chip)+'</td><td>'+esc(c.next)+'</td><td>'+esc(c.sw)+'</td><td>'+esc(c.buy)+'</td></tr>';
    }).join('')+
  '</tbody></table></div>';
}
function card(c){
  var li=function(a){ return '<ul class="nv-comp-ul">'+a.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>'; };
  return '<div class="ov-callout nv-comp-card"><div class="ov-sec-h nv-comp-h">'+esc(c.h)+'</div><p class="nv-comp-q">'+esc(c.q)+'</p>'+
    '<div class="ov-grid2"><div><div class="nv-comp-lbl">Evidence for the challenge</div>'+li(c.pro)+'</div>'+
    '<div><div class="nv-comp-lbl">Evidence against it</div>'+li(c.con)+'</div></div></div>';
}

// cudaHtml = NV_CUDA_MOAT (B2 #22); flywheel = DIFF.flywheel (B2 #39) — both handed in by nvidia.js so the text stays where it was.
export function nvdaCompBody(cudaHtml, flywheel){
  var h='';
  h+='<p class="ov-lede">NVIDIA sells a platform rather than a chip — CUDA and its libraries, the networking and complete systems, designed together. The question for a rival is not whether it can match a chip, but whether it can match all of that, and who can buy it.</p>';
  h+='<div class="ov-sec"><div class="ov-sec-h">What decides the market, in NVIDIA’s words</div>'+
    '<p class="nv-comp-p">“'+esc(Q_FACTORS)+'” (10-K FY2026)</p>'+
    '<div class="ov-callout">'+cudaHtml+'</div>'+
    (flywheel&&flywheel.length?'<div class="nv-comp-fly"><div class="nv-comp-lbl">The CUDA flywheel</div><ol class="nv-comp-ol">'+flywheel.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ol></div>':'')+
  '</div>';
  h+='<div class="ov-sec"><div class="ov-sec-h">The challenges, with the evidence on both sides</div>'+CHALLENGES.map(card).join('')+'</div>';
  h+='<div class="ov-sec"><div class="ov-sec-h">The competitors, side by side</div>'+
    '<p class="nv-comp-p">The companies NVIDIA itself names as competitors include AMD, Intel and “'+esc(Q_RIVALS)+'” (10-K). Each row is the business that competes, on its own latest fiscal year; a division that publishes no figures shows “—”.</p>'+
    compTable()+'</div>';
  h+='<div class="ov-foot">Sources — NVIDIA Form 10-K FY2026 (Item 1 Competition; segment note; customer concentration) and Form 10-Q for the quarter ended Jul 26, 2026 (Note 10 commitments; receivables; cash flow; Rubin). '+
    'AMD Form 10-K FY2025 and the AMD–OpenAI release of Oct 6, 2025; Intel Form 10-K FY2025 and Intel newsroom (Crescent Island, Oct 2025); Broadcom Form 10-K FY2025 and its 4Q FY25 release (8-K, Dec 11, 2025); Marvell Form 10-K FY2026 and SEC XBRL (operating income, R&amp;D); '+
    'Google Cloud (Ironwood availability, Nov 6, 2025) and the Anthropic–Google announcement (Oct 2025); AWS (Trainium3 availability, Dec 2, 2025). Operating margin = the segment’s operating income ÷ its revenue (Marvell: the whole company, GAAP). '+
    'Fiscal years differ by company. The CUDA text and flywheel are Summit’s, carried from the earlier Technology tab. Evidence only — no score or verdict.</div>';
  return h;
}
