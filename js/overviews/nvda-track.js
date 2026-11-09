// overviews/nvda-track.js — NVIDIA Deep Dive ▸ Management ▸ Track Record (MG-TRACK, playbook §15).
//
// COPIED from js/overviews/googl-track.js (itself tsm-mgmt.js tsmTrackBody), WITHOUT ratings (SAB, 2026-11-02, as for TSM
// and GOOGL): every card on the Summit accent, no verdict chip, no legend. Leaders = the six of Executives & Board.
// Roles and dates: FY2026 10-K (Item 1, Information About Our Executive Officers). Outcomes: reported figures already in
// the portal (Results dataset — 10-K / 10-Q — and Governance), and the 10-K's own history (Item 1, Item 1A, Note 2).
// No call transcripts yet (SAB to provide the official IR PDFs), so there are no management quotes.
// `at` / `prior` / `detail` are HTML (<b>, <p>). Modal: data-detail="ntrk:<id>" (nvidia.js wireModal).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var TRACK = [
  { id:'huang', n:'Jen-Hsun “Jensen” Huang', role:'Founder, President & CEO', since:'1993',
    at:'CEO for the company’s whole life. In the six years to FY2026, revenue went from <b>$10.9B (FY2020) to $215.9B (FY2026)</b>, Data Center from <b>$3.0B to $193.7B</b>, and GAAP operating income from <b>$2.8B to $130.4B</b>.',
    prior:'Microprocessor designer at AMD (1983–85), then LSI Logic (1985–93), where he ran Coreware, the system-on-chip unit.',
    detail:'<p><b>At NVIDIA (co-founded 1993).</b> The 10-K’s own history lists the bets made under him: the GPU (1999), CUDA (2006), the first Tensor Core GPU (2017), the Mellanox acquisition (2020), the Grace CPU (2023) and the Blackwell rack-scale platform (2024). Not every move landed: the $40B Arm deal was terminated in 2022, and US export rules cost a $4.5B H20 charge in Q1 FY2026.</p><p><b>The numbers in the portal.</b> Revenue $10,918M (FY2020) → $215,938M (FY2026); GAAP operating margin 26.1% → 60.4%; free cash flow $4.3B → $96.7B (Results ▸ Annual).</p>' },
  { id:'kress', n:'Colette M. Kress', role:'EVP & Chief Financial Officer', since:'2013',
    at:'CFO since 2013. In FY2026 NVIDIA bought back <b>$40.1B</b> of stock and paid <b>$974M</b> of dividends; diluted shares fell from <b>24,940M (FY2024) to 24,514M (FY2026)</b> while stock-based pay rose to $6.4B.',
    prior:'SVP and CFO of Cisco’s Business Technology and Operations Finance organization (2010–13); Microsoft (1997–2010), including CFO of Server and Tools; eight years at Texas Instruments.',
    detail:'<p><b>At NVIDIA (joined 2013).</b> Leads finance and investor relations through the Data Center scale-up. Buybacks went from $9.5B (FY2024) to $33.7B (FY2025) and $40.1B (FY2026); the board added $60.0B of authorization in August 2025 (Governance). In FY2027 NVIDIA changed its non-GAAP definition to stop excluding stock-based compensation, restating history (Feb 25 2026 release).</p>' },
  { id:'puri', n:'Ajay K. “Jay” Puri', role:'EVP, Worldwide Field Operations', since:'2005',
    at:'Runs global sales since 2005 (EVP since 2009). Data Center revenue went from <b>$47.5B (FY2024) to $193.7B (FY2026)</b>; in FY2026 two direct customers were 22% and 14% of revenue.',
    prior:'22 years at Sun Microsystems in sales, marketing and general management, after Hewlett-Packard, Booz Allen Hamilton and Texas Instruments.',
    detail:'<p><b>At NVIDIA (joined 2005).</b> SVP Worldwide Sales, then EVP Worldwide Field Operations from 2009 — the relationships with cloud providers, system makers and enterprise buyers. Concentration has risen with growth: one direct customer was 13% of revenue in FY2024 and 22% in FY2026 (10-K).</p>' },
  { id:'shoquist', n:'Debora Shoquist', role:'EVP, Operations', since:'2007',
    at:'Runs operations and the supply chain since 2007 (EVP since 2009). Inventory went from <b>$10.1B to $21.4B</b> over FY2026 as NVIDIA ramped Blackwell rack-scale systems; capex rose to <b>$6.0B</b>.',
    prior:'EVP Operations at JDS Uniphase (2004–07); SVP and GM of Electro-Optics at Coherent (2002–04); President of Quantum’s PC hard-drive division; Hewlett-Packard.',
    detail:'<p><b>At NVIDIA (joined 2007).</b> Fabless operations: foundry (TSMC), memory (SK hynix, Micron, Samsung), packaging and system assembly partners. Inventory $10,080M → $21,403M (Jan 2025 → Jan 2026, 10-K balance sheet); capex $3.2B (FY2025) → $6.0B (FY2026) (Results ▸ Annual).</p>' },
  { id:'teter', n:'Timothy S. Teter', role:'EVP, General Counsel & Secretary', since:'2017',
    at:'General Counsel since 2017 (EVP since 2018). His period covers the terminated Arm acquisition (2022), the US export-control rounds on China (2022–25) and China’s antitrust review of the Mellanox commitments (2025).',
    prior:'More than two decades at Cooley LLP litigating patent and technology cases; earlier an engineer at Lockheed Missiles and Space.',
    detail:'<p><b>At NVIDIA (joined 2017).</b> Legal, intellectual property and compliance. The 10-K records the matters of his period: the Arm deal terminated in February 2022 with a $1.36B charge; licence requirements on China exports from August 2022 through the April 2025 H20 rule ($4.5B charge); and China’s preliminary antitrust finding of September 15, 2025 on the Mellanox closing commitments. The Groq license of December 2025 was structured as a non-exclusive license plus hiring, with no equity bought (Note 2).</p>' },
  { id:'malachowsky', n:'Chris Malachowsky', role:'Co-founder & NVIDIA Fellow', since:'1993',
    at:'Co-founder (1993) and long-time engineering leader; now an NVIDIA Fellow. Not an executive officer, so the filings report no figures for his role.',
    prior:'Engineer before co-founding NVIDIA with Jensen Huang and Curtis Priem.',
    detail:'<p><b>At NVIDIA (co-founded 1993).</b> One of the three founders; held senior engineering and technical leadership roles and serves as an NVIDIA Fellow. He is neither an executive officer nor a director in the 2026 filings.</p>' },
];
var BENCH = 'The four other executive officers have worked alongside Huang for nine to twenty-one years, and the figures above all come from the AI build-out years (FY2020–FY2026); the filings name no successor, and the company’s direction still runs through its founder-CEO.';
var FOOT = 'Roles and dates: NVIDIA Form 10-K for fiscal 2026 (Item 1, Information About Our Executive Officers, as of Feb 20 2026). Outcomes: reported figures carried in the portal (Form 10-K and 10-Q via the Results dataset; Governance), the 10-K balance sheet (inventory) and the 10-K narrative (Item 1, Item 1A, Note 2). No ratings — a factual record, not a Summit verdict.';

export function nvdaTrackBody(){
  var cards=TRACK.map(function(m){
    return '<div class="ov-clickable trk-card" data-detail="ntrk:'+esc(m.id)+'">'+
      '<div class="trk-n">'+esc(m.n)+'</div>'+
      '<div class="trk-r">'+esc(m.role)+' · at NVIDIA since '+esc(m.since)+'</div>'+
      '<div class="trk-t"><b class="trk-k">At NVIDIA:</b> '+m.at+'</div>'+
      '<div class="trk-t"><b class="trk-c">Context:</b> '+m.prior+'</div>'+
      '<div class="trk-more">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running NVIDIA today, on <b>what they have actually built</b> — roles from the 10-K, outcomes from the reported numbers. <b>Tap a card</b> for the full history.</p>';
  h+='<div class="trk-grid">'+cards+'</div>';
  h+='<div class="ew-note"><b>The bench, in one line.</b> '+BENCH+'</div>';
  h+='<div class="ov-foot">'+FOOT+'</div>';
  return h;
}
export function nvdaTrackPop(id){
  var m=TRACK.filter(function(x){ return x.id===id; })[0]; if(!m) return null;
  return { t:esc(m.n)+' <span class="trk-pop-r">'+esc(m.role)+'</span>', h:m.detail };
}
