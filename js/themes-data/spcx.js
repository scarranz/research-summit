// themes-data/spcx.js — SpaceX’s theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24 (same shape as js/themes-data/googl.js). Two readers once
// registered: the theme record in Notes and Top Line ▸ Segments ▸ "What management has said" (js/segments.js,
// THEME_SEG maps 'Space' → space, 'Connectivity (Starlink)' → conn and 'SI (Super Intelligence)' → si; the other
// themes are company-wide). NOT REGISTERED YET — see the registration lines in the hand-off.
//
// Sources: the two earnings calls SpaceX has held as a public company — Q2 2026 (Aug 4 2026) and Q3 2026 (Oct 20 2026),
// from SAB’s transcript file "SPACEX CALLS AND CONFERENCES.txt". Paraphrased; quoted words are in quotation marks.
// Every figure checked against the Q2 and Q3 2026 10-Q (acc. 0001628280-26-052535, 0001628280-26-066880) and
// js/results-data/spcx.js; where a call and a filing disagree, the filing wins.
// Seed version: bump it when the seed is restructured.
export var SPCX_THEMES_V = 1;
export var SPCX_THEMES = [
  // ── Space ────────────────────────────────────────────────────────────────────────────────────
  { seg:'Space', theme:'Starship to operations and reuse', st:{ k:'promise', since:'Q2 2026', last:'Q3 2026' },
    why:'Starship development drives Space losses today and is the step change in launch cost and Starlink capacity.',
    updates:[
      { q:'Q2 2026', items:['Starship aims to quadruple payload and cut launch cost <b>10×</b> vs Falcon 9; building toward thousands of launches a year (Raptor, Gigabay, pads at Starbase and the Cape).', 'Space adjusted EBITDA <b>−$205M</b>, on higher Starship R&D.'] },
      { q:'Q3 2026', items:['Flight 14 reached orbit and deployed operational V3 Starlink satellites.', 'On track to bring both stages back to the tower this year, re-fly the second stage by early 2027 and attempt on-orbit refuelling early 2027.', 'Space revenue <b>$1.8B</b>, +84% QoQ on customer mix; segment operating loss narrowed to <b>−$7M</b>.'] }
    ]},
  { seg:'Space', theme:'Customer manifest and government launch', st:{ k:'trend', since:'Q2 2026', last:'Q3 2026' },
    why:'Customer launches are the only launches that earn Space revenue; most capacity goes to Starlink.',
    updates:[
      { q:'Q2 2026', items:['78 launches and 1,041 t to orbit in 1H26, mostly internal Starlink; "robust" commercial manifest and growing U.S. government demand.'] },
      { q:'Q3 2026', items:['35 launches: 21 Starlink on Falcon 9, 2 Starship, 12 customer missions (one Falcon Heavy for NASA’s Roman telescope), 6 national-security missions.', 'Won 3 more Dragon crew missions (through 2028), 18 new national-security missions and a Starship lunar-payload contract.'] }
    ]},
  // ── Connectivity ─────────────────────────────────────────────────────────────────────────────
  { seg:'Connectivity (Starlink)', theme:'Subscribers and ARPU', st:{ k:'trend', since:'Q2 2026', last:'Q3 2026' },
    why:'The consumer line is subscribers × ARPU; growth abroad lowers the price per subscriber.',
    updates:[
      { q:'Q2 2026', items:['Record <b>1.7M</b> consumer net adds; ARPU held at <b>$66</b>. Geographic expansion "may drive down blended ARPU over time".'] },
      { q:'Q3 2026', items:['<b>13.6M</b> consumer subscribers (+1.6M); ARPU <b>$69</b>, +5% QoQ on customer mix.', 'V5 kit supply constrained net adds; kits prioritised to retail before the holidays, so more activations expected in Q4.'] }
    ]},
  { seg:'Connectivity (Starlink)', theme:'Enterprise, aviation and government', st:{ k:'trend', since:'Q2 2026', last:'Q3 2026' },
    why:'Management expects enterprise and government revenue to exceed consumer revenue.',
    updates:[
      { q:'Q2 2026', items:['Enterprise & government revenue <b>+108%</b> YoY; American Airlines signed; more than $6B of U.S. contracts won for Space Force programs.'] },
      { q:'Q3 2026', items:['Enterprise & government revenue <b>+91%</b> YoY, +18% QoQ, led by Starshield and aviation.', '~12,000 planes contracted, almost a quarter of available aircraft; aviation production rates quadrupled this year.', 'Connectivity gross margin 55%, including a one-time benefit of roughly 3% (tariff refunds).'] }
    ]},
  { seg:'Connectivity (Starlink)', theme:'Starlink Mobile as a U.S. carrier', st:{ k:'promise', since:'Q2 2026', last:'Q3 2026' },
    why:'Direct-to-cell with owned spectrum is the next Connectivity revenue line.',
    updates:[
      { q:'Q2 2026', items:['New partnerships with SoftBank, NTT Docomo and Spark New Zealand; Mobile V2 satellites on Starship ahead of integrating the EchoStar spectrum.'] },
      { q:'Q3 2026', items:['22M+ monthly Starlink Mobile users, +37% QoQ; FCC approval for 15,000 Mobile V2 satellites and a low-band spectrum purchase.', 'Target: U.S. service in early 2028.'] }
    ]},
  // ── SI ───────────────────────────────────────────────────────────────────────────────────────
  { seg:'SI (Super Intelligence)', theme:'Compute rental: capacity and price per watt', st:{ k:'trend', since:'Q2 2026', last:'Q3 2026' },
    why:'SI revenue is megawatts × price per megawatt; whether the price holds decides the segment.',
    updates:[
      { q:'Q2 2026', items:['Cloud services agreements at Colossus added <b>$1.6B</b> of revenue in the quarter; 1.4 GW nameplate compute, over 2 GW expected at year end.', '$6.7B more cloud services revenue contracted in early Q3, over six months from October; payback on new compute under a year.'] },
      { q:'Q3 2026', items:['1.7 GW at quarter end; 2.5–3 GW expected by year end.', 'Pricing "slightly above the high end of the $30 to $50 per watt range"; renewals at higher dollars per watt.', 'SI revenue <b>$7.6B</b>; SI adjusted EBITDA <b>$5.0B</b>.'] }
    ]},
  { seg:'SI (Super Intelligence)', theme:'Grok, Cursor and X', st:{ k:'watch', since:'Q2 2026', last:'Q3 2026' },
    why:'The products that would make SI more than a landlord for compute.',
    updates:[
      { q:'Q2 2026', items:['Grok 4.5 token consumption tripled after the July release; Cursor acquisition pending.', 'Advertising +7% QoQ on a rebuilt ad platform.'] },
      { q:'Q3 2026', items:['Cursor closed mid-quarter: <b>$608M</b> of revenue and $1.2B of stock-based pay in SI operating income.', 'Grok Bot at 800,000 paid weekly users; Grok enterprise customers above $1M run-rate +50% QoQ (pro forma).', 'Advertising +19% YoY.'] }
    ]},
  // ── Company-wide ─────────────────────────────────────────────────────────────────────────────
  { seg:'Guidance & capital', theme:'Revenue run-rate, guidance and capex', st:{ k:'promise', since:'Q2 2026', last:'Q3 2026' },
    why:'Dated numeric targets the next prints will settle.',
    updates:[
      { q:'Q2 2026', items:['Target: <b>$100B</b> ARR by December 2026 (December revenue annualised), including Cursor.', 'IPO raised ~$85.7B net; $25B of senior notes; backlog $47.5B.'] },
      { q:'Q3 2026', items:['$100B December ARR reaffirmed; 1Q27 revenue guided to <b>$33–37B</b>.', '4Q26 capex guided to <b>$35–40B</b>; backlog <b>$63B</b>, ~$42B within a year.'] }
    ]}
];
