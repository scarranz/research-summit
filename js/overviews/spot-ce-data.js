// overviews/spot-ce-data.js — the DATA behind Spotify's Evolution ▸ Earnings.
//
// The rendering is the canonical Amazon/TSMC machinery, copied into ./spot-ce.js; this file is the only part
// that is Spotify's. Two objects, the same shape tsm-ce-data.js has:
//
//   SPOT_CE_CONS — the estimate grid and "The print" cards. BUILT AT LOAD from js/results-data/spot.js (no number
//     typed here), so Earnings and Results can never disagree. Per quarter: `qr[i][3]` = the Street (Bloomberg,
//     the last snapshot BEFORE that print — the archive keeps one snapshot per print, taken right after it, so
//     for a quarter that is the snapshot after the PREVIOUS print), `qa` = reported actual, `qy`/`qq` = the
//     year-ago and prior-quarter actuals the growth chips divide by, `qg` = the company's own guide.
//     Units: EUR millions (€M), EUR per share / per user (€), millions of users or shares (M), percent (%).
//
//   SPOT_CALL_EARNINGS — per quarter, newest first: setup notes (the "?" on each cell), results and the call.
//     Moved here unchanged from js/overviews/spot.js (Jul–Aug 2026 authoring); Q2 2026 gained the call record
//     (prepared remarks, Q&A, proposed notes) from the 4 Aug 2026 transcript. Summit (`setup.us`) is read from
//     js/results-data/spot.js (the model snapshot of 2026-08-05, frozen — rule 10).
//
// ⚠ CURRENCY: everything is EUR — guide, Street (Bloomberg's SPOT consensus is EUR), Summit and actuals.

import { spotResults } from '../results-data/spot.js';

var M = spotResults.views.q.metrics, SM = spotResults.estMatrix.cons;
var PERIODS = M.rev.periods.slice(0, M.rev.periods.indexOf('3Q26') + 1);   // the Setup grid stops at the upcoming print; Results/Top Line carry the Summit forecast beyond it

function qLabel(p){ return 'Q'+p.charAt(0)+' 20'+p.slice(2); }          // '3Q26' → 'Q3 2026'
function qn(p){ return (+p.slice(2))*4 + (+p.charAt(0)); }              // '3Q26' → 107
function rnd(x, d){ var f = Math.pow(10, d); return Math.round(x*f)/f; }

// The latest Bloomberg vintage whose last reported quarter is BEFORE `per` and that carries a number for it.
function pre(key, per){
  var best = null;
  SM.vintages.forEach(function(v){
    var row = SM.q[key] && SM.q[key][v.id], x = row ? row[per] : null;
    if(x != null && qn(v.lastActual.q) < qn(per) && (!best || qn(v.lastActual.q) >= qn(best.last))) best = { id:v.id, last:v.lastActual.q, v:x };
  });
  return best;
}

// Company guidance for gross margin is a percentage the Results dataset does not carry: Summit's guidance rows
// (GROSS_MARGIN_GUIDANCE_LOW/HIGH, snapshot 2026-08-05) hold ±0.2pt around Spotify's point.
var GM_GUIDE = { '4Q25':32.9, '1Q26':32.8, '2Q26':33.1, '3Q26':32.9 };

// The Jan 2026 reclassification moved revenue out of Ad-Supported into Premium and restated the comparatives
// (results-data notes): the YoY bases for 2026 are the deck's RESTATED figures, not the as-reported ones. 1Q26's
// QoQ would cross the break, so it carries none.
var BASE = {
  adrev:   { qy:{ '1Q26':407,  '2Q26':440,  '3Q26':437  }, qq:{ '1Q26':null } },
  premrev: { qy:{ '1Q26':3783, '2Q26':3753, '3Q26':3835 }, qq:{ '1Q26':null } }
};

// The grid's lines — labels are what the cards print and what `setup.notes` / `results.notes` key on.
// `m` = the Results metric (null for gross margin, derived), `d` = decimals shown.
var LINES = [
  { k:'Revenue',             key:'rev',     u:'€M', d:0 },
  { k:'Gross profit',        key:'gp',      u:'€M', d:0 },
  { k:'Operating income',    key:'opinc',   u:'€M', d:0 },
  { k:'EBITDA',              key:'ebitda',  u:'€M', d:0 },
  { k:'EPS (diluted)',       key:'eps',     u:'€',  d:2 },
  { k:'Operating cash flow', key:'ocf',     u:'€M', d:0 },
  { k:'Capex',               key:'capex',   u:'€M', d:0 },
  { k:'D&A',                 key:'dna',     u:'€M', d:0 },
  { k:'Diluted shares',      key:'shares',  u:'M',  d:1 },
  // ── custom KPIs (what Spotify guides, plus the two revenue lines and cash) ──
  { k:'Premium revenue',     key:'premrev', u:'€M', d:0 },
  { k:'Ad-Supported revenue',key:'adrev',   u:'€M', d:0 },
  { k:'Premium subscribers', key:'subs',    u:'M',  d:1 },
  { k:'Total MAU',           key:'mau',     u:'M',  d:1 },
  { k:'Ad-supported MAU',    key:'admau',   u:'M',  d:1 },
  { k:'Premium ARPU',        key:'arpu',    u:'€',  d:2 },
  { k:'Gross margin',        key:'gm',      u:'%',  d:1 },
  { k:'Free cash flow',      key:'fcf',     u:'€M', d:0 }
];

function actOf(L){
  if(L.key === 'gm') return PERIODS.map(function(p, i){ var g = M.gp.act[i], r = M.rev.act[i]; return (g == null || !r) ? null : rnd(g / r * 100, 1); });
  var m = M[L.key]; return PERIODS.map(function(p, i){ var v = m.act[i]; return v == null ? null : rnd(v, L.d); });
}
function streetOf(L){
  return PERIODS.map(function(p){
    if(L.key === 'gm'){ var g = pre('gp', p), r = pre('rev', p); return (g && r && g.id === r.id) ? rnd(g.v / r.v * 100, 1) : null; }
    var x = pre(L.key, p); return x ? rnd(x.v, L.d) : null;
  });
}
function guideOf(L){
  if(L.key === 'gm') return PERIODS.map(function(p){ return GM_GUIDE[p] == null ? null : GM_GUIDE[p]; });
  var m = M[L.key]; if(!m || !m.guideLo) return PERIODS.map(function(){ return null; });
  return PERIODS.map(function(p, i){ var v = m.guideLo[i]; return v == null ? null : rnd(v, L.d); });
}

export var SPOT_CE_CONS = {
  src: 'Street: Bloomberg consensus (BBG_CONSENSUS.txt, EUR) via js/results-data/spot.js — the newest snapshot that carries a number for the quarter (Q3 2026: the 2026-10-21 export) · guide: Spotify\'s own point for the quarter, from the prior quarter\'s deck · actuals: Spotify shareholder decks and 6-K, Bloomberg export for users and shares',
  q: PERIODS.map(qLabel),
  hz: ['4q out','3q out','2q out','1q out'],
  nHead: 9,
  m: LINES.map(function(L){
    var act = actOf(L), street = streetOf(L), guide = guideOf(L), ov = BASE[L.key] || {};
    return {
      k: L.k, u: L.u, t: 'ok',
      qr: PERIODS.map(function(p, i){ return [null, null, null, street[i]]; }),
      qa: act,
      qg: guide,
      qy: PERIODS.map(function(p, i){ return (ov.qy && ov.qy[p] !== undefined) ? ov.qy[p] : (i >= 4 ? act[i-4] : null); }),
      qq: PERIODS.map(function(p, i){ return (ov.qq && ov.qq[p] !== undefined) ? ov.qq[p] : (i >= 1 ? act[i-1] : null); })
    };
  })
};

// Summit's own number for a quarter = the `summit` series of js/results-data/spot.js (the DCF model snapshot of
// 2026-08-05 for 3Q26, the last pre-print snapshot for earlier quarters). Read through, never retyped. Gross
// margin = the model's gross profit over its revenue. Lines the model has no quarterly figure for stay empty.
function ceUs(per){
  var out = {};
  LINES.forEach(function(L){
    if(L.key === 'gm') return;
    var m = M[L.key], i = m ? m.periods.indexOf(per) : -1;
    if(i < 0 || !m.summit || m.summit[i] == null) return;
    out[L.k] = { v: rnd(m.summit[i], L.d) };
  });
  var gp = M.gp.summit[M.gp.periods.indexOf(per)], rv = M.rev.summit[M.rev.periods.indexOf(per)];
  if(gp != null && rv) out['Gross margin'] = { v: rnd(gp / rv * 100, 1) };
  return out;
}

export var SPOT_CALL_EARNINGS = { ticker:'SPOT', quarters:[
  { q:'Q3 2026', status:'upcoming', date:'reports late Oct / early Nov 2026 · exact date not yet announced by IR',
    setup:{
      source:'Guide: Spotify Q3 2026 guidance, issued 4 Aug 2026 with the Q2 2026 shareholder deck · Street: Bloomberg snapshot of 9 Sep 2026 (after the guide) · Summit: DCF model snapshot of 5 Aug 2026 (frozen, not live)', asOf:'guide 2026-08-04 · Street 2026-09-09 · Summit 2026-08-05',
      us: ceUs('3Q26'),
      notes:{
        'Revenue':{ t:'€5.0B guided — above consensus, and the currency has turned', h:'<p>Guided to <b>€5.0B</b>, which is <b>ahead of the ~€4.93B</b> the Street was carrying (LSEG) — the one line on this card guided above expectations. On the reported €4,272M base of 3Q25 that arithmetic is ~17% YoY, and the guide assumes a <b>~200bps FX TAILWIND</b> struck on USD:EUR 0.8756 at the June 30 close — the first tailwind after two years of headwinds (2Q26 carried ~70bps of drag, 1Q26 ~670bps).</p><p>⚠ On the call Luiga characterised the guide as “approximately €5 billion in quarter three <b>or 14% growth</b>”, without stating the basis. That does not tie to ~17% on the reported base even after backing out the FX assumption, so treat 14% as a currency-neutral or otherwise adjusted framing and <b>do not mix it with the reported number</b>. Either way the message is the same: underlying growth is flat-to-slightly-down from Q2\'s +15% cc, and the headline acceleration is currency. <b>Summit sits at €5,023M</b>, +0.5% above the guide, and the <b>Bloomberg Street of 9 Sep is €4,977M</b>, 0.5% under it: the Street has moved up from the ~€4.93B it carried before the guide but still sits below the company\'s own number.</p>' },
        'Operating income':{ t:'⚑ €670M guided — below the pre-guide Street; Summit now sits on it', h:'<p>Guided to <b>€670M</b> against the €655M just printed — and against the ~<b>€677.8M</b> the Street was carrying (Visible Alpha). Guiding profit ~1% light while guiding revenue ahead is half of why the shares fell; the MAU line is the other half.</p><p>The guide embeds <b>€9M of social charges</b> struck on a $459.13 quarter-end share price — so if the stock rallies through the quarter this line gets mechanically squeezed, and if it falls it gets a free beat. That is exactly the mechanism that produced most of the Q2 beat, running the other way. Disclosed sensitivity: <b>±€21M for a 10% move</b> in the shares.</p><p>The cost side is now sized: Luiga put the marketing and AI investment at “approximately <b>€200 million in incremental operating expense for the full year</b>”, with personnel flat, and Söderström said the year started with investment and is now “focusing on cost and efficiency” — it is “compute and marketing… within our control, <b>not long-term CapEx</b>”. <b>Summit carries €672.5M, 0.4% above the guide</b> — the model that sat 4.3% above it before the print now sits on it. The <b>Bloomberg Street of 9 Sep is €678.4M</b> (+1.3%), so the Street is still calling the guide mildly conservative, as it has been for five straight quarters.</p>' },
        'Gross margin':{ t:'32.9% — a step down from the record, but an explained one', h:'<p>Guided to <b>32.9%</b> against the <b>33.4% all-time record just printed</b> — a 50bp sequential decline. On the Q2 call Luiga explained it: the outlook “incorporates continued strengthening in our core business, reinvestments into new products, and <b>a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets</b>”.</p><p>He also reframed the comparison — <b>~130bp ABOVE the prior year</b>, which is the trend that matters. So this is a recurring Q3 item plus reinvestment, not a break in the path to <b>35–40% by 2030</b>. Summit\'s two segment gross profits (€1,543M Premium + €110M Ad-Supported) imply <b>32.9%</b> on €5,023M of revenue, i.e. the model now carries the guide, regulatory charge included; the Bloomberg Street implies the same 32.9% (gross profit €1,639M on €4,977M).</p><p>What to verify: that the fee really is annual and Q3-seated, by checking 3Q25 and 3Q24 margins against their own guides.</p>' },
        'Premium subscribers':{ t:'305M guided · +5M net adds, the slowest in a year', h:'<p>Guided to <b>305M</b> from 300M — a <b>5M add against the 7M just delivered</b> and 6M guided a quarter ago. Subscriber adds have been the most reliably-hit of Spotify\'s five guided lines and Q2 beat by 1M, so the deceleration is a choice in the forecast rather than an observed trend.</p><p>Worth noting the Q2 add was flattered by a one-off: the 20th-anniversary in-app experience drove <b>Spotify\'s biggest single day of subscriber intake ever</b>. Some of the Q3 step-down is that promotion not repeating.</p>' },
        'Total MAU':{ t:'⚑ 788M guided · +11M — deliberate, says management; below consensus, says the tape', h:'<p>Guided to <b>788M</b> from 777M, an <b>11M add against 16M delivered</b> in Q2 (itself 1M short of guidance). The Street was carrying ~<b>793.6M</b> (Visible Alpha), so the guide is ~5.6M light — the single biggest gap on the Q3 card and the main reason the shares fell ~4% pre-market.</p><p><b>Management says this is a choice.</b> Norström: “sometimes we pull the growth lever, and sometimes we pull the monetization lever. Here we\'re starting to pull the <b>monetization lever</b>.” The measures are emerging-market specific — tighter sign-up for “higher quality MAU throughput”, deprecating lower-end Android support, and “friction in both <b>ad load</b> and some limitations in our <b>free tier</b>”. Luiga: “growth rates in developed markets remain stable.”</p><p>The falsifiable claim: it “will not affect subs growth in the near term”, and Norström said he is “very confident” in long-term subscriber growth when pressed on labels reporting an industry-wide slowdown. <b>Q3 is the first test.</b> If subs land at 305M with ARPU holding, the story survives; if both slow, it does not.</p>' },
        'Premium ARPU':{ t:'Not guided — the comp gets easier from here', h:'<p>Spotify does not guide ARPU. Q2 printed <b>€4.89, +7% (+7.4% constant-currency)</b> and, critically, held that growth THROUGH the lapping of the July/August 2025 increases — which was the test set a quarter ago, and it passed.</p><p>From here the comp includes the Jan 2026 US move to $12.99, and FX turns from a drag into a tailwind. If ARPU growth does not hold in Q3 it will be for mix reasons (Rest of World and Latin America growing fastest), not pricing.</p>' },
        'Ad-Supported revenue':{ t:'⚑ Not guided per quarter — but H2 double-digit growth IS now a commitment', h:'<p>Q2 printed <b>€446M, +1% reported and +3% constant-currency</b> — the same +3% cc as Q1, in the quarter that was the clean comp against the April 2025 exchange launch.</p><p>On the call Luiga committed to the recovery: “we continue to expect our ads business to <b>inflect towards double-digit growth in the second half of 2026</b>.” Norström called the rebuild finished — <b>99% of impressions on Spotify\'s own stack</b>, automated channels ~40% of ad revenue (from 30%), <b>33,000 active advertisers, +60% YoY</b>. Luiga on the margin runway: from “the 20% range we have today <b>towards 40% over time</b>”.</p><p><b>Summit carries €512M</b> (~+17% on the restated €437M of 3Q25) and the <b>Bloomberg Street €491M</b> (~+12%). Management\'s wording is “double-digit”, so the Street sits inside the commitment and the model above it. Q3 is the first of the two quarters that have to deliver it, so this is the single most checkable promise on the card.</p>' },
        'Free cash flow':{ t:'Not guided — funding a buyback that is now running 30% hot', h:'<p>Q2 printed <b>€797M</b>, a record second quarter, taking LTM free cash flow to <b>€3.3B</b> and cash to €9.4B. Summit carries €742M for Q3 and the Bloomberg Street €849M.</p><p>The use of it is becoming material: <b>$662M repurchased year to date through Aug 3</b>, about 30% ahead of the same point in 2025, ~2.2M shares (≈1% of the count) since buybacks resumed. With the shares down sharply on this print, the pace of Q3 repurchase is itself a signal worth reading.</p>' }
      },
      debate:{ rows:null, synth:'<b>Spotify guided revenue ABOVE consensus and users and profit BELOW it</b> — €5.0B vs ~€4.93B, but 788M MAU vs ~793.6M and €670M of operating income vs ~€677.8M. That mix is why the shares fell ~4% on a quarter that beat. The call then removed two of the three worries: the <b>gross-margin step to 32.9%</b> is “a typical charge we take in the third quarter to account for our annual exposure to regulatory fees”, and is still ~130bp above the prior year; the <b>advertising line</b> got a dated commitment to “inflect towards double-digit growth in the second half of 2026”, which puts the Street\'s €491M inside the commitment and Summit\'s €512M above it. What is left is the one that matters: <b>the 11M MAU guide</b>. Management calls it deliberate — pulling “the monetization lever” via sign-up friction, ad load and free-tier limits in emerging markets — and insists it “will not affect subs growth in the near term”. That is a coherent story and an unfalsifiable one for exactly one quarter. Summit now sits <b>0.4% above the operating-income guide</b> with segment lines implying 32.9% gross margin, i.e. it carries the regulatory charge and has stopped betting on conservatism; the Bloomberg Street (9 Sep) is at €678M, 1.3% above the guide. <b>The quarter resolves to a single test:</b> do subscribers land at 305M with ARPU still compounding while MAU slows? If yes, the funnel is being optimised. If both slow, the lever framing was a description of a problem, not a decision.' }
    },
    results:null, call:null },
  { q:'Q2 2026', status:'reported', date:'reported Tue Aug 4, 2026 · BEFORE market open (Q&A 8:00am ET)',
    setup:{
      source:'Guide: Spotify Q2 2026 guidance, issued 28 Apr 2026 with the Q1 2026 shareholder deck · Street: Bloomberg snapshot of 3 May 2026 (the one after the Q1 print) · Summit: the last model snapshot before the print', asOf:'guide 2026-04-28 · Street 2026-05-03',
      notes:{
        'Revenue':{ t:'€4.8B guided — and the USD "consensus" is a trap', h:'<p>Guided to <b>€4.8B</b> with an <b>~80bps FX headwind</b> assumed. Q1 printed €4,533M (+8% reported, <b>+14% constant-currency</b>) — the gap between those two numbers IS the story of this line: a strong euro has been masking real growth all year.</p><p>⚠ The syndicated consensus quoted around this print (<b>$5.47–5.60B</b>) is in <b>US dollars</b> against a <b>euro</b> guide. At ~1.15 EUR/USD the guide is ≈$5.5B — so the "consensus" is at or slightly BELOW the company\'s own number, the opposite of how it reads if you set the two side by side. Do not score this line against a USD figure.</p>' },
        'Operating income':{ t:'⚑ The number the whole print turns on', h:'<p>Guided to <b>€630M</b> — which is <b>BELOW the €715M Spotify just printed in Q1</b>, and came in roughly 8% under the ~€684M the Street was carrying. The stock fell on the Apr 28 guide despite Q1 beating on every line.</p><p>Bulls read conservatism plus the FX drag. Bears read a step-up in spend that breaks the 2025 margin story. This is the single line that decides the reaction.</p>' },
        'Gross margin':{ t:'33.1% guided — only +10bps sequentially', h:'<p>Guided to <b>33.1%</b> against Q1\'s record <b>33.0%</b>. Ten basis points of sequential progress is hard to reconcile with the <b>35–40% by 2030</b> ambition management put on the record at the May Investor Day.</p><p>The levers that have to do the work: the marketplace/discount-royalty programs, the audiobook-bundle effect on mechanical royalties, and the advertising margin recovery. Watch whether any of them shows up here.</p>' },
        'Premium subscribers':{ t:'299M guided · +6M net adds', h:'<p>Guided to <b>299M</b> from 293M — a ~6M add, in line with recent quarters. Subscriber adds have been the most reliably-hit of Spotify\'s five guided lines; a miss here would be a genuine surprise rather than a repricing of expectations.</p>' },
        'Total MAU':{ t:'778M guided · +17M net adds', h:'<p>Guided to <b>778M</b> from 761M. The regional mix matters more than the total: growth concentrates in Rest of World and Latin America, which monetize least — which is why MAU growth consistently outruns revenue growth.</p>' },
        'Premium ARPU':{ t:'Not guided — but this is the pricing test', h:'<p>Spotify does not guide ARPU. Q1 was <b>€4.76, +5.7% constant-currency</b>, carried by the Jan 2026 US increase and hikes across 150+ markets.</p><p>The reason Q2 matters: the <b>July and August 2025</b> increases <b>lap</b> during this quarter. If ARPU growth holds through that comp, pricing is compounding; if it fades, the 2025 cohort was a one-off step rather than a new cadence.</p>' },
        'Ad-Supported revenue':{ t:'Not guided — the SAX rebuild\'s first clean comp', h:'<p>Q1 printed <b>€385M, +3% constant-currency</b> — barely growing, against a company narrative that the pivot to its own exchange is already driving significant growth.</p><p>Q2 2025 is the first quarter fully after the <b>April 2025 SAX launch</b>, so this is the first comparison not distorted by the transition. Bull: the drag annualizes out. Bear: +3% cc IS the run-rate, and Spotify swapped a low-margin growing business for a flat one.</p>' },
        'Free cash flow':{ t:'Not guided — the quiet compounder', h:'<p>Q1 printed <b>€824M</b>, with LTM free cash flow around <b>€3.2B</b>. FCF has run consistently above operating income on favourable working capital (royalty accrual timing plus deferred subscription revenue). Not a contested line, but it is what funds the buyback.</p>' }
      },
      // Summit's FROZEN pre-print expectation for Q2 2026 — the quarterly projections held on the last
      // snapshot BEFORE the print, read from js/results-data/spot.js (the Oct 2026 rebuild no longer retypes
      // them). The model carries no consolidated subscriber, MAU or gross-margin line for that quarter, so
      // those stay absent rather than derived.
      us: ceUs('2Q26'),
      debate:{ rows:null, synth:'The one thing to resolve: is the <b>€630M operating-income guide</b> — below the €715M Spotify just printed, and ~8% under where the Street sat — conservatism plus an 80bps FX drag, or the first evidence that the 2025 margin expansion has stopped? Everything else on the card (a 33.1% gross-margin guide that adds ten basis points, an ad line growing 3% constant-currency, ARPU lapping last summer\'s price rises) either supports or undercuts that single question.' }
    },
    results:{
      // Which frozen Watch-List hook each line speaks to (rank within Q2 2026).
      watch:{ 'Operating income':1, 'Ad-Supported revenue':2, 'Premium ARPU':3, 'Gross margin':4 },
      notes:{
        'Revenue':{ t:'In line — and the constant-currency number is the one that moved', h:'<p><b>€4,777M against a €4,800M guide</b> — €23M short, half a percent, which the company itself called "in-line". FactSet consensus on the wire was €4,790M, so the print landed between the two.</p><p>The number that actually changed is underneath: <b>+14% reported but +15% constant-currency</b>, an acceleration, and the FX drag came in at ~70bps against the ~80bps assumed. The euro stopped fighting. For Q3 the assumption flips to a <b>~200bps tailwind</b>, which is why the €5.0B guide looks like a step change and mostly is not one.</p>' },
        'Operating income':{ t:'⚑ Beat — but read the social charges before you read leverage', h:'<p><b>€655M against a €630M guide, +4%.</b> Before crediting operating leverage, note where €9M of the €25M came from: the guide embedded <b>€10M of social charges</b> struck on a $484.91 share price, the stock FELL over the quarter, and the actual charge came in at <b>€1M</b>. The prior-year quarter carried €115M of these.</p><p>That is the same mechanism that caused the misses in 1Q24, 4Q24, 1Q25 and 2Q25, running in reverse. Strip it out and the beat is ~€16M on gross-margin strength, against operating expenses that grew <b>19% YoY excluding FX and social charges</b> — marketing plus cloud and AI. This is the fifth consecutive quarter at or above the guided point, but it is not five quarters of the same thing.</p>' },
        'Gross margin':{ t:'Beat — an all-time record, and the step down was explained on the call', h:'<p><b>33.4% against a 33.1% guide</b>, +30bp, and <b>+193bp YoY</b> — an all-time high. Both segments contributed: Premium <b>34.9%</b> (+174bp, revenue growth outpacing music costs net of marketplace programs, audiobook and video-podcast costs) and Ad-Supported <b>19.1%</b> (+179bp, on favourable podcast and tax impacts).</p><p>The deck guided Q3 to <b>32.9%</b> — a 50bp sequential decline — and offered no reason. <b>The call supplied one.</b> Christian Luiga: the outlook “incorporates continued strengthening in our core business, reinvestments into new products, and <b>a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets</b>.” He also framed it as <b>~130bp ABOVE the prior year</b>, which is the more useful comparison — the sequential step is a recurring Q3 item plus reinvestment, not a break in the trend.</p><p>That materially de-escalates this line: a seasonal charge that recurs every Q3 is not evidence against the 35–40% by 2030 path. Worth confirming the size of the fee against prior third quarters.</p>' },
        'Premium subscribers':{ t:'Above the guide — 300M, and one day did a lot of the work', h:'<p><b>300M against 299M guided</b> — a 7M net add against 6M guided, +9% YoY, with growth in every region. The headline milestone of the quarter.</p><p>One detail worth carrying forward: the 20th-anniversary in-app experience drew ~100M users in six days and drove <b>Spotify\'s biggest single day of subscriber intake ever</b>. That is a real result, but it is a promotion, not a run rate — and Q3 is guided to a 5M add, the slowest in this dataset.</p>' },
        'Total MAU':{ t:'⚑ Below the guide — and the call says the deceleration is deliberate', h:'<p><b>777M against 778M guided</b> — Luiga: “our net additions of 16 million were <b>one million below forecast</b>.” In percentage terms that is a rounding error and the tile scores it in line, which is why the tile is the wrong place to read this line.</p><p>The sequence is what matters: under plan this quarter, then Q3 guided to just <b>11M adds</b>. <b>The call reframed this from a miss into a choice.</b> Norström: “Gustav and I have this saying where we say sometimes we pull the growth lever, and sometimes we pull the monetization lever. <b>Here we\'re starting to pull the monetization lever</b>.” The concrete measures, all in emerging markets: “tweaking the sign-up to get a <b>higher quality MAU throughput</b>”, deprecating “lower-end Android device support”, and “carefully introduced some friction in both <b>ad load</b> and some limitations in our <b>free tier</b>”. Luiga added that “growth rates in developed markets remain stable”.</p><p>So the free base is being throttled on purpose to convert better, and management says it “will not affect subs growth in the near term”. That is a coherent story — but it is also unfalsifiable for a quarter or two, and it is being told about the exact line that just missed. The test is whether subscriber adds and ARPU hold while MAU slows.</p>' },
        'Premium ARPU':{ t:'⚑ The pricing test passed — €4.89, +7.4% cc THROUGH the lap', h:'<p>Not guided, so it scores as "no est." — but this was the single most informative line of the print. <b>€4.89, +7% reported and +7.4% constant-currency.</b></p><p>The reason it matters: the <b>July and August 2025 price increases lapped inside this quarter</b>. Watch-List hook #3 asked whether Spotify has a pricing cadence or whether 2025 was a one-off re-rate now sitting in the base. ARPU growth held through the comp, driven by price-increase benefits partially offset by product/market mix. That is the cadence answer, and it is the bullish one.</p>' },
        'Ad-Supported revenue':{ t:'⚑ Failed its clean comp — but management now guides an inflection', h:'<p><b>€446M, +1% reported and +3% constant-currency</b> on the restated basis. Watch-List hook #2 set this quarter up as the test: 2Q25 was the first quarter fully after the April 2025 Spotify Ad Exchange launch, so this was the first comparison not distorted by the transition. The result is <b>the same +3% cc as Q1</b> — the drag did not annualize out on its own.</p><p><b>The call put a number and a date on the recovery.</b> Luiga: “we continue to expect our ads business to <b>inflect towards double-digit growth in the second half of 2026</b>.” Norström declared the rebuild finished — “<b>99% of all the impressions</b> [are] now on our own ad stack” — and gave the supporting metrics: automated channels rose to <b>~40% of ad revenue from 30%</b>, and there are <b>33,000 active advertisers, up 60% year over year</b>, 7,000 of them using the AI audio asset-creation tool. Luiga also framed the margin runway: from “the 20% range we have today <b>towards 40% over time</b>”.</p><p>That changes the reading of Summit\'s €496M Q3 estimate. It needs ~+11% against a +3% run rate, which looked heroic against the deck alone — but it is now roughly <i>in line with what management is guiding</i>. The number to hold them to is the H2 double-digit, and Q3 is the first half of it.</p>' },
        'Free cash flow':{ t:'A record second quarter — €797M, and the buyback is running hot', h:'<p>Not guided. <b>€797M</b>, a record for a Q2, on €816M of operating cash flow less €21M of capex, taking <b>LTM free cash flow to €3.3B</b> and cash to €9.4B. Cumulative free cash flow since 2016 is now €8.8B.</p><p>The use of it is becoming material: <b>$662M repurchased year to date through Aug 3</b>, ~30% ahead of 2025, and ~2.2M shares (≈1% of the count) since repurchases resumed last year.</p>' }
      },
    },
    // ─── The Q2 2026 earnings call, 4 Aug 2026, 8:00am ET ────────────────────────────────────
    // Bryan Goldberg (IR) · Alex Norström & Gustav Söderström (Co-CEOs) · Christian Luiga (CFO).
    // Source: the published transcript. The meeting-critical answers (gross margin, MAU, ads,
    // opex) live in the per-metric notes above, not here — this aside is
    // the SUPPLEMENTAL colour. ⚠ `band:'lead'` items render NOWHERE (ceHighlightsBlock filters
    // them out by design because they belong on the Watch List), so everything here is 'context'.
    call:{
      take:'A good quarter attached to a cautious forecast, and the forecast won. Management beat its own gross-margin and operating-income guide, crossed 300M subscribers and reported 15% constant-currency revenue growth, then guided Q3 MAU +11M on purpose (“the monetization lever”), subscribers +5M, and operating income to €670M inside a ~€200M investment year that “moderates” in Q4. The advertising line got a dated commitment (double-digit growth in H2 2026) and nothing else changed in the outlook.',
      prepared:[
        { topic:'Q2: revenue +15% cc, record gross margin, 300M subscribers', theme:'Results',
          body:'Alex Norström: “Revenue grew 15% year-over-year on a constant currency basis, accelerating from 14% in Q1. Gross margin hit a record of 33.4%.” Christian Luiga: MAU 12% higher (net additions of 16 million, “one million below forecast”), 7M net subscribers to 300 million (one million ahead of guidance), revenue €4.8B (+15%), Premium revenue about +16% on subscribers +9% and ARPU +7.4%, Ad-Supported +3%, operating income €655M (€25M above guidance, of which €9M social charges), free cash flow €797M (+14% YoY).' },
        { topic:'MAU: product optimisation in emerging markets', theme:'Users',
          body:'Norström: Spotify is “adjusting elements like product optimization and ad load, among other things, in select emerging markets… This will show itself in our Q3 MAU, but we believe it’s well worth it.” The free-to-paid cycle in emerging markets “grows differently”; he said it should not “come at the expense of our subscriber growth”.' },
        { topic:'Advertising: automated channels near 40% of revenue', theme:'Advertising',
          body:'Automated channels were “nearly 40%” of ad-supported revenue (just over 30% in Q1); active advertisers +60% YoY. Luiga: the price-optimisation work “is now complete”, the direct channel “is stabilizing”, the migration to the in-house ad server is done, and “we continue to expect our ads business to inflect towards double-digit growth in the second half of 2026”.' },
        { topic:'What shipped since Investor Day', theme:'Product & AI',
          body:'Söderström: Talk to Spotify, Personal Podcasts and Studio are live; Prompted Playlist is coming to audiobooks; the large taste model raised active days in the first two months of its autoplay system; Messages is live; Running Mode began rolling out; Song DNA has been used by more than 100M subscribers. A Merlin agreement (30,000 labels) joins UMG for covers and remixes. Norström: Audiobooks+ “has passed EUR 100 million in annual recurring revenue”; Reserved, launched in the US in June with Live Nation, has “nearly 100,000 tickets reserved”.' },
        { topic:'Cost discipline: compute and marketing, not people', theme:'Margins',
          body:'Söderström: “Over the last three years, we have not increased headcount while revenue per employee is on track to double… the operating expense growth is not coming from people. It’s coming from compute and marketing.” Chirp routes work to the best price-performance model, including hosted open-source ones, so Spotify is “never locked in”; he called margin “a managed outcome, not a by-product”.' },
        { topic:'Q3 guide: MAU 788M, subscribers 305M, revenue ~€5.0B, margin 32.9%, operating income €670M', theme:'Guidance',
          body:'Luiga: MAU +11M “includes product optimization activities in emerging markets, while growth rates in developed markets remain stable”; subscribers 305M (+5M); revenue about €5 billion “or 14% growth” with ARPU growth consistent with Q2; gross margin 32.9% (“approximately 130 basis points above the prior year”) after “a typical charge we take in the third quarter to account for our annual exposure to regulatory fees in one of our markets”; operating income €670M. About €200M of incremental opex for the year, with Q4 “well positioned to see a moderation”; employees flat; gross and operating margin both expected to improve for the full year, with “meaningful year-over-year growth in free cash flow”.' },
        { topic:'Capital allocation: buyback up 30%, €9.4B of cash', theme:'Capital',
          body:'Luiga: $662 million repurchased year to date through August 3 (+30% on 2025), nearly 2.2 million shares (about 1% of shares outstanding) since buybacks resumed in 2025; €9.4 billion of cash and no debt other than leases. “Given the stronger cash flow in the years ahead, even with M&A, we expect that we will also return cash to shareholders.”' },
      ],
      qanda:[
        { q:'Which products matter most over the next three to five years?', analyst:'Jessica Reif Ehrlich', theme:'Product & AI',
          qFull:'You have a unique global platform for both audio and video products and gave a robust roadmap in May. What products are you most excited about in the near term, and where will you get the most traction over the next three to five years?',
          a:'<b>Gustav Söderström:</b> “What I am most excited about is the system that we’ve built… inference adds a variable cost per user”, so the model changes: Spotify decides “how much inference we want to put into the free tier, how much we want to put into the premium tier”, and lets “some people who are prepared to pay for it run ahead of other users” (audiobooks gives ~15 hours in Premium). By product: <b>Reserved</b> (“one of the biggest values that we’ve put in Premium ever”), the <b>large taste model</b> (“we’re seeing these scaling laws play out”), <b>Song DNA</b> (100M+ users), music videos, Gen Pods, Running Mode, and longer term Remix and Covers and Talk to Spotify.' },
        { q:'Advertising has been subdued: what is the outlook, and what drives momentum?', analyst:'Jessica Reif Ehrlich', theme:'Advertising',
          qFull:'Advertising growth in the past year has been subdued despite programmatic now being over 25% of ad-supported revenue. Can you give an outlook for the coming year or years, and what can you do to drive momentum in a very high-margin business?',
          a:'<b>Alex Norström:</b> the transition is done: “99% of all the impressions that we serve are now on our own ad stack”; automated channels are almost 40% “and it’s even going up further from here”; active advertisers are 33,000, up 60%, and 7,000 use the AI audio-asset tool. On supply, “the supply picture has actually never been stronger”. <b>Christian Luiga:</b> “we can move from the 20% range we have today towards 40% over time” on ad margin.' },
        { q:'Are you surprised more artists have not signed on to the AI music tier?', analyst:'Rich Greenfield', theme:'Product & AI',
          qFull:'Are you surprised more artists have not signed on to the AI music tier to enable you to launch? What is stopping artists from participating?',
          a:'<b>Management:</b> the Merlin deal adds 30,000 labels to UMG; the principle is “consent… credit… compensation”, “the first legal way to partake in this AI tailwind that we see coming for interactive music”. Expect “a research preview” in which fans of an artist rate remixes, giving the preference data for reinforcement learning: “We have now 777 million people and music fans to do reinforcement learning with.” A full catalogue is not required to launch.' },
        { q:'Open-source models versus Claude and others: costs and benefits', analyst:'Justin Patterson', theme:'Margins',
          qFull:'Over 2026 we have seen meaningful momentum in open source. How are you thinking about the costs and benefits of deploying open source more broadly versus how you use Anthropic’s Claude and other models today?',
          a:'<b>Management:</b> “The large taste model is based on open source… continuous pre-training.” Chirp lets engineers “seamlessly switch between one of the paid models and a hosted open-source model, keeping the context”, and Spotify will offer it to other companies. Token prices are falling: “for a certain feature of level of quality, the costs are coming down quite fast.”' },
        { q:'What is behind the slower MAU guide for Q3?', analyst:'Batya Levi', theme:'Users',
          qFull:'What is informing your guidance for slower MAU growth in the third quarter? Do you see a change in the competitive environment or the general intake for your campaigns? (Also Benjamin Black: initiatives to drive MAU growth in the future.)',
          a:'<b>Management:</b> several quarters of outperformance came from emerging markets (India, Indonesia and similar). Spotify is changing sign-up “to get a higher quality MAU throughput”, has “deprecated a lower-end Android device support” and “carefully introduced some friction in both ad load and some limitations in our free tier”. “Sometimes we pull the growth lever, and sometimes we pull the monetization lever. Here we’re starting to pull the monetization lever… this will not affect subs growth in the near term.”' },
        { q:'Reserved: how many tours, conversion to Premium, positioning in live events', analyst:'Rich Greenfield', theme:'Product & AI',
          qFull:'You started a meaningful ad campaign for Reserved after Role Model. How many concert tours have you worked with since? Are you seeing an uptick in conversion to paid tiers to access Reserved? How does Spotify’s positioning in live events evolve?',
          a:'<b>Management:</b> “It’s been a few” tours; “U.S. only for premium right now”; “about 100,000 tickets reserved”; in some instances Spotify has “blown through the allocation and Live Nation has even upsized them mid-run”. On monetization: “currently about increasing the value to price ratio on premium.”' },
        { q:'Do you need deals with all the majors before launching AI music?', analyst:'Jason Bazinet', theme:'Product & AI',
          qFull:'You now have AI music deals with UMG and Merlin. Do you need deals with all the majors before you launch an AI service? Why or why not?',
          a:'<b>Management:</b> “We do not need a deal with all the majors… Spotify started without significant parts of the catalog.” The next step is the research preview so the model improves in public; “we’ll decide when we launch based on where we are”.' },
        { q:'How should investors think about monetization scope at 300M subscribers?', analyst:'Eric Sheridan', theme:'Pricing & ARPU',
          qFull:'On the heels of Premium reaching 300 million, how should investors think about the scope for monetization efforts from more interactive tools and live-event integrations across the subscriber base?',
          a:'<b>Management:</b> “We’re now close to 4% of the world’s population… it’s not implausible that we’ll get to 15% penetration of the world.” The priority is to “drive the value to price ratio upwards”; audiobooks is “a great example of an add-on… that basically generates more sort of structural ARPU increase than just price increases”, with a different approach for developing and established markets.' },
        { q:'How can time spent evolve (211B hours vs Netflix 191B)?', analyst:'Justin Patterson', theme:'Users',
          qFull:'In 2025 you streamed 211 billion hours of content versus Netflix’s 191 billion. As you expand into fitness and deepen personalization, how do you believe time spent can evolve?',
          a:'<b>Management:</b> Spotify spans “speakers… gaming consoles… cars… sleep… studying”, and the metric it prizes is <b>active days</b>: “over 100 million of our subscribers spending more than 20 days in a month with us”, which “correlate[s] very well with lifetime value” and increased again this quarter for Premium.' },
        { q:'What KPI benefits are you seeing from the AI products?', analyst:'Deepak Madhavan', theme:'Product & AI',
          qFull:'You have launched several AI-powered products in the last six months, including Prompted Playlists. What benefits are you seeing in KPIs such as listening hours, conversion or churn?',
          a:'<b>Management:</b> AI-powered experiences “now reach about a quarter of our active users”; Prompted Playlist has reached “14 million of the 100 million actives”. The large taste model is moving “active days”, “the metrics that are absolutely the hardest to move”; “since 2010 when we started investing in personalization, the correlation between personalization and retention has been super clear”.' },
        { q:'What drives the implied acceleration in Q3 operating expenses?', analyst:'Doug Anmuth', theme:'Margins',
          qFull:'Can you talk about the drivers of the implied acceleration in operating expenses in Q3?',
          a:'<b>Christian Luiga:</b> “Excluding currency and social charges, we see our expense growth to be roughly consistent in quarter three with quarter two growth”, then “well-positioned to actually moderate this into quarter four”. The ~€200M is “not structural”; personnel is flat; the spend is marketing to “increase engagement and LTV” and AI. <b>Söderström:</b> “We started this year by investing… now we’re starting to focus on cost and efficiency… These are not long-term CapEx investments that need years to roll back.”' },
        { q:'Timing of add-on tiers and their impact on Premium ARPU', analyst:'Doug Anmuth', theme:'Pricing & ARPU',
          qFull:'Can you help us understand the timing of add-on tier rollouts across verticals, and how we should think about their impact on Premium ARPU in the second half of this year and into 2027?',
          a:'<b>Alex Norström:</b> “We don’t comment on timing for launches, we don’t give guidance on ARPU either.” Audiobooks+ has “now doubled… just in a select few markets”; when an add-on succeeds “it’ll structurally increase ARPU in a different way. In the price to quantity equation, we’re really providing a different type of price increase.”' },
        { q:'Read-through from Apple Music’s price increase', analyst:'Jason Helfstein', theme:'Pricing & ARPU',
          qFull:'Is there any read-through from the Apple Music price increase announced in July? How does it affect your thinking about price increases going forward?',
          a:'<b>Management:</b> “We don’t comment on other companies’ price increases”; it shows “continued value in music streaming services”. “The more value we deliver, the more pricing power we will have. As of right now, we’re happy to be the price leader in our category.”' },
        { q:'How confident are you in long-term premium growth, given the labels’ comments?', analyst:'Jason Bazinet', theme:'Users',
          qFull:'You had solid Premium net adds, but the record labels suggested industry premium growth slowed in Q2. How confident are you in the long-term growth of Premium subscribers for the industry and for Spotify?',
          a:'<b>Management:</b> “I’m very confident. We don’t give guidance for long-term, but what we’re optimizing for is a healthy funnel. This not only builds our business… it’s of course aimed at helping our subscriber growth and not slowing it down.”' },
      ],
      newQuestions:[
        { n:'Does 3Q26 land the guide: 788M MAU, 305M subscribers, €5.0B revenue, 32.9% gross margin and €670M operating income, with ARPU growth “consistent with quarter two”?', landed:{ q:'Q3 2026', rank:1 } },
        { n:'Emerging-market MAU optimisation (sign-up friction, lower-end Android deprecated, ad load, free-tier limits): does it stop at the 11M guide, or does MAU slow further in Q4 while subscribers hold?', landed:{ q:'Q3 2026', rank:1 } },
        { n:'Advertising “inflect towards double-digit growth in the second half of 2026”: does Q3 print double digits, with automated channels past 40% of revenue and ad margin moving from ~20% toward 40%?', landed:{ q:'Q3 2026', rank:2 } },
        { n:'Does operating-expense growth ex-FX and social charges stay “roughly consistent” with Q2 in Q3 and then moderate in Q4, with the ~€200M incremental for the year and flat headcount?', landed:{ q:'Q3 2026', rank:3 } },
        { n:'Is the Q3 gross-margin step to 32.9% really the annual regulatory-fee charge (~130bp above the prior year), and does the full-year margin still improve?', landed:{ q:'Q3 2026', rank:4 } },
        { n:'Add-ons and AI products: does a research preview of covers and remixes launch, and do Audiobooks+ (over €100M ARR) and credit add-ons start to show up in ARPU beyond price rises?' },
      ],
      highlights:[
      { head:'The AI answer is an <b>efficiency</b> story first, not a product story', band:'context',
        detail:'<p>Söderström spent his opening on internal tooling rather than features: <b>“Honk”</b>, which lets engineers fix bugs from Slack, and <b>“Chirp”</b>, a model-agnostic inference engine that “seamlessly switch[es] between… paid models and a hosted open-source model”.</p><p>The number that lands: <b>“over the last three years, we have not increased headcount while revenue per employee is on track to double.”</b> Set that against the 19% ex-FX operating-expense growth — the spend is compute and marketing, not people, which is what makes management\'s “temporary” framing credible.</p>',
        open:'Whether inference cost per user falls fast enough to fund the free tier as AI features reach beyond the ~25% of actives that touch them today.' },
      { head:'A second AI-music licence: <b>Merlin</b>, adding ~30,000 labels', band:'context',
        detail:'<p>Norström announced a Merlin agreement alongside the existing UMG deal, bringing “30,000 labels” into the framework, governed by what he called the <b>three Cs — consent, credit and compensation</b>.</p><p>Söderström drew the boundary hard: the products are for <b>“real artists, not fake artists”</b>. On sequencing, he said Spotify “do[es] not need a deal with all the majors” before launching, citing Spotify\'s own early history without full major-label catalogues, and described the next step as a <b>“research preview”</b> that would enable “reinforcement learning” from the 777M user base.</p>',
        open:'Which majors are still outstanding, and whether a research preview without them is commercially meaningful or just a data-gathering exercise.' },
      { head:'<b>Audiobooks+ has passed €100M of annual recurring revenue</b>', band:'context',
        detail:'<p>Penetration “more than doubled this year”, and Norström used it as the template for a different kind of ARPU growth: add-ons “structurally increase ARPU in a different way… [a] price to quantity equation” rather than through headline price rises.</p><p>He <b>declined to give launch timing or ARPU guidance</b> for the new Audiobooks+ tiers, and for Family and Student.</p><p>⚠ Note the tension with Watch-List hook #5: the audiobook bundle is the same mechanism the MLC is litigating, and Spotify is expanding it.</p>',
        open:'The size of the add-on ARPU contribution in FY2027, which management explicitly would not frame.' },
      { head:'<b>Reserved</b>: ~100,000 tickets, US-only, Premium-only', band:'context',
        detail:'<p>The Live Nation ticketing partnership has reserved “100,000 tickets” with some allocations selling through 100%. Currently <b>“U.S. only for premium”</b>.</p><p>Norström positioned it not as a revenue line but as <b>“increasing the value to price ratio on premium”</b> — i.e. as pricing-power infrastructure. That is the through-line of his whole call: “the more value we deliver, the more pricing power we will have.”</p>' },
      { head:'Engagement framed on <b>active days</b>, not hours — and 211B hours vs Netflix\'s 191B', band:'context',
        detail:'<p>Asked about time spent, Norström distinguished Spotify\'s multi-device model — “speakers… gaming consoles… cars… sleep… studying” — and said Spotify tracks <b>active days</b> as the LTV proxy rather than total hours. <b>“Over 100 million of our subscribers spend more than 20 days in a month”</b>, and active days rose overall for Premium subscribers.</p><p>On the AI features specifically, Söderström said the Large Taste Model is “moving some of the metrics that are absolutely the hardest to move, which are active days”. AI experiences now reach <b>~25% of active users</b>; Prompted Playlists have 14M of 100M actives; Song DNA has passed 100M users.</p>' },
      { head:'On pricing: <b>“we\'re happy to be the price leader in our category”</b>', band:'context',
        detail:'<p>Asked to read across from Apple Music\'s increase, Norström declined to comment on a competitor but treated it as ecosystem validation, then restated the doctrine: value first, price follows.</p><p>Paired with ARPU holding at +7.4% cc through the lapping of the 2025 rises, this is the strongest version of the pricing-cadence case management has put on the record.</p>' },
      { head:'Pushback on the labels\' claim that industry premium growth slowed', band:'context',
        detail:'<p>Bazinet put it to management that record labels had signalled industry-wide premium subscriber growth slowed in Q2. Norström: <b>“I\'m very confident”</b>, framing the strategy as “optimizing for a healthy funnel… aimed at helping our subscriber growth and <b>not slowing it down</b>”.</p><p>This is the direct rebuttal to the bear read of the 11M MAU guide, and it is worth holding as a quotable commitment — it is falsifiable within two quarters.</p>',
        open:'Whether Q3/Q4 subscriber adds hold at ~5–7M while MAU decelerates. If both slow, the "monetization lever" framing does not survive.' }
    ] } }
]};
