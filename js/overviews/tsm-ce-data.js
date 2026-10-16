// overviews/tsm-ce-data.js — the DATA behind TSM's Evolution ▸ Earnings.
//
// The rendering is Amazon's, extracted into ./tsm-ce.js; this file is the only part that is TSMC's.
// Two objects, the same shape amzn.js inlines:
//
//   TSM_CE_CONS — the estimate grid and "The print" cards. BUILT AT LOAD from js/results-data/tsm.js
//     (no number typed here), so Earnings and Results can never disagree. Per quarter: `qr[i][3]` = the
//     Street (Bloomberg, last snapshot before that print), `qa` = reported actual, `qy`/`qq` = the
//     year-ago and prior-quarter actuals the growth chips divide by. Only the 1q-out column is read
//     by the machinery, so the 4q/3q/2q revision columns stay null.
//     Units: $B (EPS in US$ per ADR; shares in billions of ADR equivalents; margins in %).
//
//   TSM_CALL_EARNINGS — per quarter, newest first: setup notes (the "?" on each cell), results and the
//     call. Sources: TSMC's earnings releases and presentations (Form 6-K) and the call transcript in
//     docs/calls/TSM-latest.md. Summit (`setup.us`) stays EMPTY (rule 10): the column fills once the
//     portal reads the Summit model live.

import { tsmResults } from '../results-data/tsm.js';

var M = tsmResults.views.q.metrics;

// The grid's lines — labels are what the cards print and what `setup.notes` / `results.notes` key on.
var LINES = [
  { k:'Revenue',             key:'rev',    u:'$B' },
  { k:'Gross profit',        key:'gp',     u:'$B' },
  { k:'Operating income',    key:'opinc',  u:'$B' },
  { k:'EBITDA',              key:'ebitda', u:'$B' },
  { k:'EPS (diluted)',       key:'eps',    u:'$'  },
  { k:'Operating cash flow', key:'ocf',    u:'$B' },
  { k:'Capex',               key:'capex',  u:'$B' },
  { k:'D&A',                 key:'dna',    u:'$B' },
  { k:'Diluted shares',      key:'shares', u:'B'  },
  // ── custom KPIs (SAB, Oct 15 2026: platforms + the margins TSMC guides) ──
  { k:'HPC revenue',         key:'hpc',    u:'$B' },
  { k:'Smartphone revenue',  key:'smart',  u:'$B' },
  { k:'IoT revenue',         key:'iot',    u:'$B' },
  { k:'Automotive revenue',  key:'auto',   u:'$B' },
  { k:'Gross margin',        key:'gm',     u:'%'  },
  { k:'Operating margin',    key:'om',     u:'%'  },
];

function qLabel(p){ return 'Q'+p.charAt(0)+' 20'+p.slice(2); }   // '3Q26' → 'Q3 2026'
var PERIODS = M.rev.periods;
var QS = PERIODS.map(qLabel);
function scaleOf(u){ return (u==='$B' || u==='B') ? 1/1000 : 1; }   // dataset is US$M / millions
// Display precision, as Amazon's grid prints it: $B to one decimal, EPS and shares (B) to two, % to one.
function decOf(u){ return u==='$B' ? 1 : (u==='%' ? 1 : 2); }
function series(key, field, u){
  var m = M[key], f = scaleOf(u), p10 = Math.pow(10, decOf(u));
  return PERIODS.map(function(p){
    if(!m || !m[field]) return null;
    var i = m.periods.indexOf(p), v = i < 0 ? null : m[field][i];
    return v == null ? null : Math.round(v * f * p10) / p10;
  });
}

export var TSM_CE_CONS = {
  src: 'Bloomberg consensus (BBG_CONSENSUS.txt / Consensus_Portal.xlsm) via js/results-data/tsm.js — last snapshot before each print; actuals from TSMC 6-K releases and quarterly financial statements',
  q: QS,
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: LINES.map(function(L){
    var act = series(L.key, 'act', L.u), cons = series(L.key, 'cons', L.u);
    return {
      k: L.k, u: L.u, t: 'ok',
      qr: QS.map(function(q, i){ return [null, null, null, cons[i]]; }),
      qa: act,
      qy: act.map(function(_, i){ return i >= 4 ? act[i-4] : null; }),
      qq: act.map(function(_, i){ return i >= 1 ? act[i-1] : null; }),
    };
  }),
};

// Summit's own number for a quarter = the `summit` series of js/results-data/tsm.js (the DCF model snapshot of
// Oct 15 2026, frozen there — rule 10). Read through, never retyped; margins = the model's line ÷ its revenue.
// Lines the model has no quarterly figure for (EBITDA, EPS, cash flow, capex, D&A, shares) stay empty.
var SUMMIT_SRC = 'Summit: DCF model snapshot of Oct 15 2026 (frozen, not live) — taken before the model absorbed the 3Q26 print and the 4Q26 guide (its 4Q26 revenue sits below the guided range).';
var SUMMIT_NONE = 'Summit: no model snapshot predates this print (the first is Oct 15 2026).';
function summitUs(per){
  var out = {};
  LINES.forEach(function(L){
    var m = M[L.key]; if(!m || !m.summit) return;
    var i = m.periods.indexOf(per), v = i < 0 ? null : m.summit[i];
    if(v != null){ var f = scaleOf(L.u), p10 = Math.pow(10, decOf(L.u)); out[L.k] = { v: Math.round(v * f * p10) / p10 }; }
  });
  function mg(numKey){ var n = M[numKey], r = M.rev, i = r.periods.indexOf(per);
    return (i < 0 || !n.summit || n.summit[i] == null || !r.summit[i]) ? null : Math.round(n.summit[i] / r.summit[i] * 1000) / 10; }
  var g = mg('gp'), o = mg('opinc');
  if(g != null) out['Gross margin'] = { v: g };
  if(o != null) out['Operating margin'] = { v: o };
  return out;
}

export var TSM_CALL_EARNINGS = { ticker:'TSM', quarters:[
  // ── UPCOMING: Q4 2026 (quarter ends Dec 31, 2026; TSMC reports mid-January 2027) ──
  // CONSENSUS PROVENANCE: the Street cells are the Bloomberg snapshot of Jul 21 2026 — it PREDATES the
  // 3Q26 print and the 4Q26 guide (SAB, Oct 15 2026: use it and say so until the next export).
  { q:'Q4 2026', status:'upcoming', date:'reports mid-January 2027',
    setup:{
      source:'Street: Bloomberg snapshot of Jul 21 2026 (before the 3Q26 print and the 4Q26 guide) · guidance: TSMC 3Q26 earnings release and call, Oct 15 2026 · '+SUMMIT_SRC, asOf:'Jul 21 2026 (Street) · Oct 15 2026 (guide)',
      notes:{
        'Revenue':{ t:'Guided $52.3–54.3B — the July Street is below the whole range', h:'<p>TSMC guided <b>US$52.3–54.3B</b>: "a 14% sequential increase or a 58% year-over-year increase at the midpoint." The Bloomberg snapshot on file (Jul 21) has <b>$49.3B</b>, set before the 3Q26 beat and the new guide, so it sits under the bottom of the range. The CEO raised the full year to "around 44% year-over-year in U.S. dollar term".</p>' },
        'Gross profit':{ t:'Gross margin guided 65–67%, down 40bp at the midpoint', h:'<p>"Gross margin is expected to be between 65% and 67%" at NT$31.8 per US$. The CFO: down "40 basis points to 66% at the midpoint, primarily due to the continued margin dilution from the steep ramp-up of our 2 nm technology, as well as dilution from overseas fabs." The July Street implies ~66.1%.</p>' },
        'Operating income':{ t:'Operating margin guided 56.5–58.5%', h:'<p>Guide <b>56.5–58.5%</b> (3Q26 printed 58.7%). The July Street implies ~58.1% on $28.6B of operating income — but on revenue below the guide.</p>' },
        'EBITDA':{ t:'No guide; D&A rises with the 2nm ramp', h:'<p>TSMC does not guide EBITDA. July Street <b>$36.5B</b>. Depreciation is the line to watch as N2 ramps "in multiple phases at both Hsinchu and Kaohsiung" and more overseas fabs start.</p>' },
        'EPS (diluted)':{ t:'July Street $4.76 per ADR, after $4.60 in 3Q26', h:'<p>3Q26 printed <b>NT$29.43 (US$4.60 per ADR)</b>. The July Street for 4Q26 is <b>$4.76</b>, from before the 3Q beat and the 4Q guide.</p>' },
        'Capex':{ t:'FY2026 budget reiterated at $60–64B', h:'<p>"We reiterate our full year 2026 capital budget to be between $60 billion and $64 billion." 1Q–3Q26 capex was about <b>$40.7B</b> (US$13.8B in 3Q26), which leaves <b>~$19–23B</b> for 4Q26 against a July Street of $17.7B. Capex 2026–2028 is expected to be "even more significantly higher than the past three years".</p>' },
        'Operating cash flow':{ t:'3Q26: "about TWD 920 billion"', h:'<p>The CFO: "we generated about TWD 920 billion in cash from operations" in 3Q26. The quarterly financial statements (with the exact figure) are filed about a month after the print.</p>' },
        'D&A':{ t:'Exact 3Q26 figure comes with the financial statements', h:'<p>TSMC does not state D&A in the release; it comes in the quarterly financial statements (Form 6-K), filed about a month after the print.</p>' },
        'HPC revenue':{ t:'68% of revenue after +22% QoQ', h:'<p>"HPC increased 22% quarter-over-quarter to account for 68% of our third-quarter revenue." The CEO pointed to agentic AI, AI accelerators, "agentic AI CPUs" and networking chips as the drivers. July Street for 4Q26: <b>$29.7B</b>.</p>' },
        'Smartphone revenue':{ t:'21% of revenue; the CEO flagged consumer weakness', h:'<p>Smartphone "increased 10% to account for 21%" in 3Q26. The CEO: "consumer and price-sensitive end market segment are being challenged due to the impact of rising component prices and macroeconomic uncertainties."</p>' },
        'Gross margin':{ t:'Guide 65–67% (midpoint 66.0%)', h:'<p>2nm ramp dilution plus overseas fabs. The CFO now expects overseas-fab dilution "closer to 2%", widening "to 3%-4% in the next few years" as more US fabs ramp.</p>' },
        'Operating margin':{ t:'Guide 56.5–58.5% (midpoint 57.5%)', h:'<p>3Q26 printed 58.7% with operating expenses at 7.8% of revenue.</p>' },
      },
      us:summitUs('4Q26'),   // the model's own 4Q26 (frozen snapshot of Oct 15 2026)
      debate:{ rows:null, synth:'' },
    },
    results:null, call:null },

  // ── REPORTED: Q3 2026 (quarter ended Sep 30, 2026; reported Oct 15, 2026) ──
  // Setup frozen as it stood before the print: Street = Bloomberg Jul 21 2026; guide = Jul 16 2026 release.
  // Post-Results (results + call) is filled in unit EV-POST from the 3Q26 release and docs/calls/TSM-latest.md.
  { q:'Q3 2026', status:'reported', date:'October 15, 2026',
    setup:{
      source:'Street: Bloomberg snapshot of Jul 21 2026 · guidance: TSMC 2Q26 earnings release, Jul 16 2026 · '+SUMMIT_NONE, asOf:'Jul 21 2026',
      notes:{
        'Revenue':{ t:'Guided $44.6–45.8B; Street $45.1B', h:'<p>TSMC guided <b>US$44.6–45.8B</b> with the 2Q26 results. The Bloomberg snapshot of Jul 21 had <b>$45.1B</b>, inside the range.</p>' },
        'Gross margin':{ t:'Guided 65–67%', h:'<p>Guide <b>65–67%</b> at NT$32 per US$, with the 2nm ramp beginning to dilute.</p>' },
        'Operating margin':{ t:'Guided 56–58%', h:'<p>Guide <b>56–58%</b>.</p>' },
      },
      us:{},
      debate:{ rows:null, synth:'' },
    },
    // "The print" cards are built from TSM_CE_CONS (actual vs the frozen Street). The fields below are the
    // call: Call Summary (prepared + qanda), Also on the call (highlights) and Propose Notes (newQuestions).
    // Every answer is a direct quote from docs/calls/TSM-latest.md (transcript wording kept as spoken).
    results:{},
    call:{
      take:'Management answered the demand question with conviction and the margin question with a schedule: revenue beat the top of the guide, the 4Q26 guide implies +58% YoY, and the full-year growth view rose to around 44% in US dollars. The cost side is named and dated: 2nm ramp dilution now, overseas fabs widening to 3–4 points in the second half of the five-year period.',
      highlights:[
        { tag:'thesis', band:'context', open:'Any concluded US expansion beyond Arizona?',
          head:'Texas evaluated and Terafab under discussion — but "the fab has to be run by TSMC"',
          detail:'<p>C.C. Wei: "Texas is one. We send the teams to Texas to do all the evaluation. We also talk to one of our customer who try to build a fab, Terafab, let me be more specific. We are discussing with them… <b>We are still in discussion.</b>" On structure: "It\'s not either way, it would be possible, but <b>the fab has to be run by TSMC</b>."</p>' },
        { tag:'curious', band:'logged',
          head:'Advanced packaging: 5x reticle in volume production, 9x and 14x next',
          detail:'<p>"We are in the real-world production of <b>5x reticle size</b>. I don\'t believe that anybody can do that today except at TSMC, and the yield is excellent… We are working on the 9x reticle size and moving into the 14x reticle size." Asked whether TSMC would back up a customer whose competing packaging (EMIB-T) fell short: "let me say that, yes, we will be."</p>' },
        { tag:'logged', band:'logged',
          head:'High NA EUV from 2030, with a 12-inch photomask planned with ASML by 2031',
          detail:'<p>"We say in 2030 we will start to use it because we also think at that time, High NA will be mature… working very closely with our ASML to establish a 12 in photomask by 2031." On adopting later than competitors: "we have confidence that we are still the best company to offer the most advanced technology to our customers."</p>' },
        { tag:'logged', band:'logged',
          head:'No secondary wafer market: customers cannot sublet or auction capacity',
          detail:'<p>"The principle of TSMC is we do not allow our customer to sublet or auction off the capacity. But in certain cases, customer can collaborate through a mask licensing agreement… The amount is very, very small."</p>' },
        { tag:'logged', band:'logged',
          head:'GlobalFoundries silicon interposers: back-end capacity is short',
          detail:'<p>"This is part of our overall strategy in the back-end supply… Definitely, we have a little bit shortage on the back end, and we would like to work with our so-called partner with GlobalFoundries."</p>' },
        { tag:'logged', band:'logged',
          head:'Dividend: "sustainable and steadily increasing" per share',
          detail:'<p>The CFO: "We also remain committed to a sustainable and steadily increasing cash dividend per share on both an annual and quarterly basis."</p>' },
      ],
      prepared:[
        { topic:'Revenue above the top of the guide; 2nm dilutes the margin', theme:'Results',
          body:'Revenue rose 16.2% sequentially to $46.7 billion in US dollars, "above the high end of our third-quarter guidance". Gross margin fell 1.3 points to 66.4%, "primarily due to margin dilution from 2 nm ramp"; operating margin 58.7% with operating expenses at 7.8% of revenue; EPS NT$29.43 and ROE 45.5%.' },
        { topic:'Node and platform mix', theme:'Technology',
          body:'2nm contributed 8% of wafer revenue, 3nm 33%, 5nm 28% and 7nm 10%; advanced technologies (7nm and below) were 79%. HPC grew 22% quarter-on-quarter to 68% of revenue; smartphone grew 10% to 21%, automotive 23% to 4%, IoT 5% to 4%, and DCE declined 12% to 1%.' },
        { topic:'4Q26 guide: +58% YoY at the midpoint, margin down 40bp', theme:'Guidance',
          body:'Revenue US$52.3–54.3B ("a 14% sequential increase or a 58% year-over-year increase at the midpoint"); gross margin 65–67% and operating margin 56.5–58.5% at NT$31.8 per US$. The CFO put the 40bp step-down on "the steep ramp-up of our 2 nm technology, as well as dilution from overseas fabs", with overseas dilution now "closer to 2%" and widening "to 3%-4% in the next few years".' },
        { topic:'Capex: $60–64B for 2026, more to come', theme:'Capex',
          body:'The 2026 budget was reiterated at $60–64 billion, and capex for 2026–2028 is expected "to be even more significantly higher than the past three years". Tool supply is tight but planned with suppliers in advance; the commitment to a "steadily increasing cash dividend" stands.' },
        { topic:'Full-year growth raised to around 44%; consumer softness flagged', theme:'Demand',
          body:'C.C. Wei: consumer and price-sensitive segments "are being challenged due to the impact of rising component prices and macroeconomic uncertainties", so TSMC is "being prudent in our business planning going into 2027". But leading-edge demand "continue to be extremely robust", and full-year 2026 revenue growth is now expected "to be around 44% year-over-year in U.S. dollar term".' },
        { topic:'AI demand: agentic AI, CPUs and networking', theme:'AI demand',
          body:'"We observe increasing AI demand fueled by the rising adoption of agentic AI as we transition from chatbot to AI assistance", plus open-source models lowering the barrier to use. Beyond accelerators, "the emergence of agentic AI CPUs and the continued demand for networking chips are driving further silicon demand." "All the AI players are working with TSMC."' },
        { topic:'Capacity: nearly 20 fabs, N2 doubling, A14, more 3nm', theme:'Capacity',
          body:'"Nearly 20 fabs worldwide in progress" — 13 leading-edge and advanced-packaging fabs in Taiwan and five to six overseas. N2 entered volume production in 4Q25 and its annual capacity should "more than double in 2027"; A14 risk production in 2027, volume in 2028. A new Tainan 3nm fab starts 1H27 and another was added for 1H28; Arizona\'s second fab moves to volume in 3Q27, "slightly ahead of our previous schedule"; Japan\'s second fab runs 3nm in 2028. "We have no intention to leave food on the table for others."' },
      ],
      qanda:[
        { q:'AI demand versus power and supply-chain bottlenecks: how is overbuilding avoided?', analyst:'Laura Chen · Citi', theme:'AI demand',
          qFull:'Given the increasingly aggressive AI semiconductor demand, how does TSMC reconcile customers\' capacity requirements with concerns about data-center power, funding, and constraints in HBM, advanced packaging and networking lasers — and how would TSMC adjust capacity to minimize potential overbuilding?',
          a:'<b>C.C. Wei:</b> "We have a very sophisticated capacity planning process… we put every possibility we can, talking about the CSPs, CapEx, data center build-out, financial, power supply, and also other component supply, et cetera, into our consideration. We make our own judgment, and then based on our assessment the demand, <b>we still think the demand is higher than the supply</b>, and we are working very hard to narrow the gap."' },
        { q:'Any update to the AI accelerator CAGR (mid-to-high 50s, 2024–2029)?', analyst:'Laura Chen · Citi', theme:'AI demand',
          qFull:'TSMC had guided its AI accelerator revenue (a narrow definition) to grow at a mid-to-high-50s percent CAGR from 2024 to 2029. Is there any update to that number?',
          a:'<b>C.C. Wei:</b> "All I can say right now is the demand is extremely robust, okay? <b>We did not see any sign of slowdown.</b> Whether it is a high 50 CAGR, it does not matter. <b>It probably will be higher.</b>"' },
        { q:'High NA EUV, capex intensity, pricing power and long-term gross margin', analyst:'Laura Chen · Citi', theme:'Margins',
          qFull:'With a much bigger capex cycle and High NA EUV adoption around 2030, should productivity accelerate revenue growth, and how should we think about pricing power, long-term gross margin and the return on capital?',
          a:'<b>C.C. Wei:</b> "High NA definitely is a very good tool. So far, I think our plan is to use it in 2030. Again, our CapEx will be much higher than today… <b>there is no ceiling for TSMC\'s profitability, but a dramatic increase will not happen overnight either.</b> Our philosophy or our strategy always are working with our customer, and we want to make them be successful, and then we can gain our value."' },
        { q:'Can wafer capacity grow above 10% a year?', analyst:'Gokul Hariharan · J.P. Morgan', theme:'Capacity',
          qFull:'TSMC has not added more than 10% capacity a year for about a decade. Given the accelerated build-out, can wafer capacity growth approach or exceed 10% in the next couple of years, and will 2027 be even tighter than 2026?',
          a:'<b>C.C. Wei:</b> "The demand is very, very high. <b>The gap between demand and supply are still quite big</b>, and that is why we put all our strengths to increase the capacity… I cannot answer this question right now because of my customer continue to increase their demand." <b>Wendell Huang:</b> "It is a bit too early to talk about capacity increase percentage going forward… <b>the increase in advanced nodes are really the main driver</b> for the capacity increase."' },
        { q:'US expansion: Texas, Terafab, and the terms of any partnership', analyst:'Gokul Hariharan · J.P. Morgan', theme:'Capacity',
          qFull:'Could you update on the accelerated overseas plan, especially reports of a Texas fab cluster and discussions with a customer (Terafab) — would these be TSMC-run fabs, on principles like JASM or ESMC?',
          a:'<b>C.C. Wei:</b> "We did expand our capacities consideration to see outside Arizona whether we can get another chance to expand our capacity. <b>Texas is one.</b> We send the teams to Texas to do all the evaluation. We also talk to one of our customer who try to build a fab, Terafab… We are still in discussion." On structure: "It\'s not either way, it would be possible, but <b>the fab has to be run by TSMC</b>."' },
        { q:'Is a secondary wafer market emerging among customers?', analyst:'Krish Sankar · TD Cowen', theme:'Pricing',
          qFull:'Some customers describe passing their wafer allocation to another customer. Is this a small, customer-specific case, or an emerging trend that TSMC allows?',
          a:'<b>C.C. Wei:</b> "To say whether this is a new strategy, new methodology, the answer is no. <b>The principle of TSMC is we do not allow our customer to sublet or auction off the capacity.</b> But in certain cases, customer can collaborate through a mask licensing agreement, but this is not our common practice. The amount is very, very small."' },
        { q:'Is adopting High NA later than competitors a disadvantage?', analyst:'Krish Sankar · TD Cowen', theme:'Technology',
          qFull:'TSMC historically led EUV adoption, but will adopt High NA around 2030–31, after some competitors. Is that a competitive disadvantage?',
          a:'<b>C.C. Wei:</b> "If we want to put into the mass production, it got to be the best technology with a very reasonable cost, and most important is the best maturity… We say in 2030 we will start to use it because we also think at that time, High NA will be mature… Whether that our technology, because we are using it later than our competitor, so disadvantage to TSMC? <b>No, because we have confidence that we are still the best company to offer the most advanced technology to our customers.</b>"' },
        { q:'An IDM customer insourcing more — and is A14 still bigger than N2?', analyst:'Charlie Chan · Morgan Stanley', theme:'Technology',
          qFull:'One IDM customer is expanding its own capacity aggressively and may insource more. How will TSMC deal with that, and does the view that A14 will be a bigger node than N2 assume that IDM outsources more server CPUs at A14?',
          a:'<b>C.C. Wei:</b> "We treat every customer fairly. Whether it is IDM or it is purely fabless, we treat them the same. But of course, we take into consideration of their internal capacity… <b>in our A14, we have seen more and more customer actually higher than the 2 nm activities so far. We expect that the A14 will be a bigger node than our current N2 technologies.</b>" On the specific customer: "I don\'t comment on a specific customer, but let me guarantee you that we take everything into consideration."' },
        { q:'Advanced packaging at larger reticle sizes, and backing up EMIB-T', analyst:'Charlie Chan · Morgan Stanley', theme:'Packaging',
          qFull:'As reticle sizes grow toward 14x, can TSMC\'s SoW and 3.5D roadmap keep pace, and if a customer that chose Intel\'s EMIB-T cannot get enough supply, would TSMC support it with CoWoS capacity?',
          a:'<b>C.C. Wei:</b> "We are in the real-world production of <b>5x reticle size</b>. I don\'t believe that anybody can do that today except at TSMC, and the yield is excellent… We are working on the 9x reticle size and moving into the 14x reticle size… <b>the CoWoS is still the number one choice for our customer.</b>" On being a backup: "I try to avoid to answer it directly, but let me say that, yes, we will be."' },
        { q:'Capex beyond 2026, capital intensity and tool-price inflation', analyst:'Sunny Lin · UBS', theme:'Capex',
          qFull:'Should capex beyond 2026 grow in line with or faster than sales, and is tool-price inflation a meaningful driver of a much higher 2027 capex?',
          a:'<b>Wendell Huang:</b> "It\'s a bit too early to share the CapEx number beyond this year\'s… our CapEx from 2026 to 2028 is expected to be <b>significantly higher than the past three years</b>… <b>The tool price inflation is real.</b> The tool price, material, labor cost, et cetera. However, the majority of the CapEx is always related to the long-term demand… Capital intensity-wise, as we always said, <b>if do our job right, the increase in revenue will outpace the increase in CapEx</b>, and that is still the case."' },
        { q:'What drives the wider overseas-fab dilution?', analyst:'Sunny Lin · UBS', theme:'Margins',
          qFull:'Overseas-fab margin dilution is widening to 3–4% from 2027. Does that reflect pulling in Arizona\'s later phases?',
          a:'<b>Wendell Huang:</b> "We are doing everything we can wherever we can to increase our capacity… We are also accelerating everywhere, including in the U.S. We did mention before that <b>the latter part of the five-year period, the margin dilution from overseas fab will be 3 percentage point to 4 percentage point</b>, and that still remain the case."' },
        { q:'Is AI demand shifting from accelerators to CPUs and networking?', analyst:'Haas Liu · Bank of America', theme:'AI demand',
          qFull:'With AI demand spreading into agentic AI CPUs and networking switches, are customers shifting toward more efficient compute as monetization matters more, and what does that mean for TSMC\'s manufacturing and packaging?',
          a:'<b>C.C. Wei:</b> "AI\'s demand is extremely robust. Whether it\'s come from accelerator or is more from the CPU side, it\'s not for me to make a comment. Although <b>we did see the demand from agentic AI CPUs continue to increase.</b> Yes, that is a trend today… the demand actually is <b>still far above our capability today to supply.</b>"' },
        { q:'Two process architectures at once (Super Power Rail vs conventional): harder yield learning?', analyst:'Haas Liu · Bank of America', theme:'Technology',
          qFull:'New nodes used to ramp on small, simple dies. With mobile on conventional power delivery and HPC on Super Power Rail at the same time, is the learning curve harder, and what does it mean for gross margin?',
          a:'<b>C.C. Wei:</b> "We now have a very strong demand from smartphone and also AI HPC applications. So the smaller die size per se or the big die size in the accelerator, they happen at the same time. <b>This is to TSMC\'s advantage</b>, let me say that… So the learning curve, yes, but we are doing a reasonable job, and so the customer are very happy today."' },
        { q:'Is power a gating factor, and does it push customers to Super Power Rail?', analyst:'Arthur Lai · Macquarie', theme:'AI demand',
          qFull:'Have power-grid constraints ever led TSMC to cut customer forecasts, and could tighter power accelerate adoption of Super Power Rail?',
          a:'<b>C.C. Wei:</b> "Definitely power supply situation is one of the consideration factor that we are looking into… we have done all the study, and <b>so far so good</b>, let me say that. Whether this kind of situation change our customers\' behavior and move more into the backside power rail? <b>Answer is no.</b> Whether you use the backside power… is based on your need for your product."' },
        { q:'Does the AI accelerator forecast include CPUs?', analyst:'Arthur Lai · Macquarie', theme:'AI demand',
          qFull:'Does the mid-to-high-50s AI growth framework include CPUs, and when would it be refreshed if CPU demand rises significantly?',
          a:'<b>C.C. Wei:</b> "<b>It is not included in our AI demands calculation.</b> The reason is very simple, because we cannot identify which CPU user in the conventional server CPU or AI server CPU… So far today, we stick to our initial very narrow definition on the AI\'s demand." <b>Jeff Su:</b> "It is a narrow definition, but it is certainly part of our business."' },
        { q:'Price increases: existing contracts or only incremental capacity?', analyst:'Sahej Singh · Stifel', theme:'Pricing',
          qFull:'With N3 now accretive, N2 still dilutive and overseas dilution widening, there are reports of significant price increases across mature and advanced nodes. Do they apply to the existing contracted book or mainly to incremental capacity?',
          a:'<b>C.C. Wei:</b> "<b>Our pricing strategy is very strategic.</b> It also depends on the market segment, depends on the location, and depends on the technology and something. Once we offer the flexibility of the physical location, like in the U.S., it will be a little bit different from the one we produce in Taiwan. No matter what, we try to get our value to be recognized."' },
        { q:'Sourcing silicon interposers from GlobalFoundries', analyst:'Sahej Singh · Stifel', theme:'Packaging',
          qFull:'GlobalFoundries announced it will supply silicon interposers to TSMC. How does TSMC decide between procuring from specialty foundries and building in-house?',
          a:'<b>C.C. Wei:</b> "This is part of our overall strategy in the back-end supply. Actually, our number one priority is to help our customer to be successful in their market… <b>Definitely, we have a little bit shortage on the back end</b>, and we would like to work with our so-called partner with GlobalFoundries so that both TSMC and GlobalFoundries can support TSMC\'s customer."' },
      ],
      newQuestions:[
        { n:'Does 4Q26 land inside the $52.3–54.3B guide with gross margin near the 66% midpoint as the 2nm ramp steepens?', landed:{ q:'Q4 2026', rank:1 } },
        { n:'AI accelerator CAGR (mid-to-high 50s, 2024–2029): does TSMC formally raise it, after "It probably will be higher"?', landed:{ q:'Q4 2026', rank:2 } },
        { n:'Overseas-fab dilution: does it stay "closer to 2%" before widening to 3–4 points, as Arizona\'s second fab reaches volume in 3Q27?', landed:{ q:'Q4 2026', rank:3 } },
        { n:'2027 capex: how far above the $60–64B 2026 budget, given "significantly higher" 2026–2028 and real tool-price inflation?', landed:{ q:'Q4 2026', rank:4 } },
        { n:'Consumer and price-sensitive weakness from rising component prices: does smartphone (21% of revenue, about flat YoY in 3Q26) soften further into 2027?', landed:{ q:'Q4 2026', rank:5 } },
        { n:'US beyond Arizona: is a Texas site or the Terafab discussion concluded, and is the fab TSMC-run?', landed:{ q:'Q4 2026', rank:6 } },
      ],
    } },
]};
