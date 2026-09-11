// themes-data/dhr.js — the Danaher theme record (EARNINGS_CONVENTIONS §6, "the theme record").
//
// What management has actually said, quarter by quarter, and whether it named a driver. It lives
// here rather than inside the overview module for the same reason AMZN's does: that module pulls
// the Supabase SDK from a CDN, and importing it drags the whole chain along.
//
// `seg` is prose ('Biotechnology'); it matches the segment labels in js/segments-data/dhr.js.
//
// ── SOURCING, and its one real limit ──────────────────────────────────────────────────────────
// Every entry is contemporaneous and public: the quarterly 8-K EX-99.1 release (SEC EDGAR, CIK
// 0000313616) for the numbers and the guidance, and published coverage of the earnings call for
// what was said on it. Q2 2026 (21-Jul-2026) is the quarter with call-level detail — the Q&A
// exchanges, the speaker attributions and the figures given verbally. Q4 2025 and Q1 2026 carry
// what their releases carry, which is the print and the guide, and nothing is invented to fill
// the gap: an entry that only exists in a release says what a release says.
//
// ⚠ THE $1.6B AND THE $100M ARE SPOKEN FIGURES, not filed ones. They come from the Q2 2026 call
// as reported, not from a document Danaher signed. Treat them as management's characterisation —
// which is exactly what makes them worth tracking — and never fold them into a filed series.

export var DHR_THEMES = [

  // ── Biotechnology ────────────────────────────────────────────────────────────────────────────
  { seg:'Biotechnology', theme:'Bioprocessing — the revenue that moved to 2027',
    st:{ k:'promise', since:'Q2 2026', last:'Q2 2026' },
    why:'Management says roughly $100M+ of bioprocessing revenue slipped out of 2026 on customer timing, not demand. That is a claim with a date on it: it either comes back in 2027 or it was demand.',
    updates:[
      { q:'Q2 2026', items:[
        'Biotechnology core revenue <b>+2.5%</b>; bioprocessing specifically grew <b>low single digits</b>.',
        'Rainer Blair: about <b>$100M+ of bioprocessing revenue shifted into 2027</b> — <b>a few large commercial drug manufacturers</b> rescheduling <b>resin shipments</b> on production-schedule changes and site readiness. Not demand weakness.',
        'The offsetting evidence management put up: <b>mid-teens order growth in both consumables and equipment</b>. Pressed by Casey Woodring (J.P. Morgan) on whether that included the pushed-out revenue, Blair said the pushed-out orders were <b>already in backlog</b> and the mid-teens was new and broad-based.',
        'Michael Ryskin (BofA) and Dan Brennan (TD Cowen) both pushed on why it does not return in 3Q/4Q. Matt McGrew: <b>no change to the view that bioprocessing is high-single-digit over the long term</b>; management called it "highly unlikely" the revenue does not return in 2027.'
      ]}
    ]},

  { seg:'Biotechnology', theme:'Equipment — the return of the capex cycle',
    st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'Equipment revenue grew again after four quarters where only orders did. If management is right that this is a multi-year cycle, it changes the shape of the recovery from consumables-only to both.',
    updates:[
      { q:'Q2 2026', items:[
        'Asked by Tycho Peterson (Jefferies) why equipment revenue reappeared after <b>four quarters of order-only expansion</b>, Blair named <b>reshoring and brownfield expansion</b> plus ongoing biologic capacity need, and put Danaher "in the <b>early innings of a multi-year capex cycle</b>".'
      ]}
    ]},

  // ── Life Sciences ────────────────────────────────────────────────────────────────────────────
  { seg:'Life Sciences', theme:'The Life Sciences turn',
    st:{ k:'trend', since:'Q2 2026', last:'Q2 2026' },
    why:'The segment that took the whole FY23–FY25 profit decline (op. profit 1,209 → 879 → 520) printed its best core growth in several years. Whether that is the funding cycle turning or one strong product line is the question the number does not answer.',
    updates:[
      { q:'Q2 2026', items:[
        'Core growth <b>+5.5%</b> — management called it the <b>strongest quarter in several years</b>.',
        'The named drivers: <b>Pall applied filtration ~+10%</b>, led by <b>semiconductor microelectronics</b>; <b>Abcam\'s best quarter since acquisition</b>.',
        'Asked by Patrick Donnelly (Citi) where the confidence comes from, management listed pharma/biopharma progression, <b>biotech funding converting to spending</b>, modestly improving academia, and new launches (<b>Biacore 8S</b>, <b>SCIEX novus V55</b>, Beckman automation).',
        '⚑ Read against the filed line: reported segment operating profit was <b>$244M on $1,879M</b> of revenue — a 13.0% GAAP margin. The recovery is in growth, not yet in the segment\'s profit.'
      ]}
    ]},

  // ── Diagnostics ──────────────────────────────────────────────────────────────────────────────
  { seg:'Diagnostics', theme:'Respiratory — the drag with a size on it',
    st:{ k:'promise', since:'Q2 2026', last:'Q2 2026' },
    why:'Management has now put a full-year number on respiratory revenue and a basis-point number on the drag. Both are checkable next quarter, and the ex-respiratory line is the one they want you to read.',
    updates:[
      { q:'Q2 2026', items:[
        'Diagnostics core <b>+2.0%</b>, or <b>+5.0% excluding respiratory testing</b>. Cepheid non-respiratory grew <b>low double digits</b>; Leica Biosystems and Radiometer together <b>high single digits</b>.',
        'Respiratory testing revenue put at roughly <b>$1.6B for the full year</b>, and quantified forward as a <b>250bp headwind</b> to Q3 revenue growth.',
        'Dan Leonard (RBC) asked how Diagnostics reaches high-single-digit growth in Q4 against that. McGrew cited commercial execution, new product innovation and <b>moderating China policy headwinds</b> — no bridge was given.'
      ]}
    ]},

  { seg:'Diagnostics', theme:'Masimo — bought, closed early, not yet in the margin',
    st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'Masimo closed earlier than planned and is already carrying the FY26 EPS raise. The segment it landed in added $1.1B of consensus revenue for FY26 and almost no consensus profit — that gap is the thing to watch.',
    updates:[
      { q:'Q2 2026', items:[
        'Closed <b>early June</b>, ahead of schedule; the early close is one of the two reasons given for raising FY26 adjusted EPS.',
        'Blair: <b>high-single-digit revenue growth in the first half</b>, and an <b>FDA 510(k) clearance</b> for an AI-enabled respiratory-depression detection solution, offered to Scott Davis (Melius) as evidence the integration is working.',
        'It added <b>4.0pp</b> of Diagnostics\' reported growth in the quarter, and the print carries <b>$108M of pretax acquisition items</b> — which is why segment operating profit fell to <b>$416M</b> on rising revenue.'
      ]}
    ]},

  // ── Company ──────────────────────────────────────────────────────────────────────────────────
  { seg:'Company', theme:'The guide against the Street',
    st:{ k:'promise', since:'Q2 2026', last:'Q2 2026' },
    why:'Danaher guides FY26 core revenue growth of +3.0% to +4.0%. The Bloomberg consensus in our own dataset models +2.9% — below the low end. One of the two moves by the 4Q26 print.',
    updates:[
      { q:'Q4 2025', items:[
        'FY26 opened wide: core revenue growth <b>+3% to +6%</b>, adjusted EPS <b>$8.35–$8.50</b>.'
      ]},
      { q:'Q1 2026', items:[
        'Core <b>+0.5%</b> in the quarter — the low end of a 3–6% full-year range with three quarters left. The range was <b>held</b> and adjusted EPS was raised to <b>$8.35–$8.55</b> on the earnings performance, not on the top line.'
      ]},
      { q:'Q2 2026', items:[
        'The core range was <b>narrowed down</b>, +3–6% → <b>+3.0% to +4.0%</b>, and adjusted EPS raised again to <b>$8.45–$8.60</b>.',
        'Q3 guided at <b>+2.0% to +3.0%</b> core — the <b>first numeric quarterly guide</b> Danaher has given; every prior quarter was guided in words.',
        'Management said it expects to <b>exit Q4 at a mid-single-digit core growth rate</b>. That is the arithmetic that has to hold for +3–4% to land, and it is the single most falsifiable thing said on the call.'
      ]}
    ]},

  { seg:'Company', theme:'China',
    st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'China revenue fell every year from FY2022 ($3,611M) to FY2025 ($2,631M). Management now says pricing has stabilised — the first positive characterisation in the run.',
    updates:[
      { q:'Q2 2026', items:[
        'Grew <b>mid-single digits</b>; management said <b>pricing stabilised and volumes improved</b> after the earlier headwinds, and separately cited <b>moderating China policy headwinds</b> as part of the Diagnostics Q4 bridge.'
      ]}
    ]},

  { seg:'Company', theme:'Capital returned',
    st:{ k:'trend', since:'Q2 2026', last:'Q2 2026' },
    why:'Buybacks restarted in FY2024 ($5,979M) and continued in FY2025 ($3,088M) after years of none. Alongside a $9.9B acquisition year, the mix of buyback and M&A is the capital-allocation question.',
    updates:[
      { q:'Q2 2026', items:[
        'About <b>$900M</b> deployed to repurchase <b>5 million shares</b> in the quarter — against a Masimo close in the same quarter.'
      ]}
    ]},

  { seg:'Company', theme:'Academic and government funding',
    st:{ k:'watch', since:'Q2 2026', last:'Q2 2026' },
    why:'It sits under Life Sciences instruments, and management has now sized it in order to say it does not matter much.',
    updates:[
      { q:'Q2 2026', items:[
        'Scott Davis (Melius) asked when academic funding inflects. Blair made it conditional on government policy turning "more constructive" and sized the exposure at <b>less than 5% of Danaher revenue</b> — a deliberate de-escalation of a line the market had been trading.'
      ]}
    ]}
];
