// themes-data/amzn.js — the AMZN theme record.
//
// The curated answer to "what has management actually said, and did it name a driver". It has
// TWO readers: the Notes tab in js/overviews/amzn.js, which is where it is edited, and the
// Segments tab, which reads it per segment. It lives here rather than inside the overview module
// because that module imports the Supabase SDK from a CDN — importing it drags the whole CDN
// chain along and costs any consumer its offline syntax check.
//
// `seg` is prose ('Amazon US'); js/segments.js maps it to the dataset keys.
export var AMZN_THEMES = [
  // ── Amazon US ──────────────────────────────────────────────────────────────────────────────────
  { seg:'Amazon US', theme:'Agentic commerce', st:{ k:'watch', since:'Q4 2025', last:'Q2 2026' },
    why:'Whether AI compresses the shopping funnel or expands it — management argues the retailer\'s own agent wins.',
    updates:[
      { q:'Q4 2025', items:['Rufus: <b>300M customers</b> in 2025, users "<b>60% more likely to complete a purchase</b>"; can shop tens of millions of items in OTHER stores.'] },
      { q:'Q1 2026', items:['Rufus MAU <b>+115%</b>, engagement +400%; "we\'re going to like this for advertising" — sponsored prompts working, multi-turn = more surfaces.'] },
      { q:'Q2 2026', items:['The claim that agentic surfaces <b>expand rather than compress</b> the funnel keeps showing up in reported dollars (see <i>Advertisement</i>).'] },
    ]},
  { seg:'Amazon US', theme:'Advertisement', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'Management argues ads WIN in agentic commerce — the dollars are accelerating at a $20B quarterly scale.',
    updates:[
      { q:'Q4 2025', items:['Ads <b>$21.3B (+22%)</b>; Prime Video ads 315M viewers.'] },
      { q:'Q1 2026', items:['Ads <b>$17.2B (+22%)</b>; Netflix / Comcast / Samsung signed.'] },
      { q:'Q2 2026', items:['Advertising <b>$19.8B (+26%)</b> — an <b>acceleration</b> from +22%, at a $20B quarterly scale, with <b>sponsored products</b> named as the driver.','The next audit is structural: Q3 loses the Prime-Day event to the comp, so holding 25%+ would separate the engine from the calendar.'] },
    ]},
  { seg:'Amazon US', theme:'Robotics — the efficiency flywheel', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'The quiet half of the AI story: unit growth outpacing fulfillment cost growth is what pays for the build without breaking margins.',
    updates:[
      { q:'Q4 2025', items:['<b>1M+ robots</b> in the network; 8B+ items same/next-day (+30%); NA margin 9% in the holiday peak; regions extended 8 → 10.'] },
      { q:'Q1 2026', items:['Units <b>+15% vs fulfillment expense +9%</b>; record 13.1% consolidated margin; robotics in every 2026 US large-format launch; a service engine rebuilt in <b>65 days vs 40–50 person-years</b>.'] },
      { q:'Q2 2026', items:['A <b>new consolidated margin record: 13.7%</b> — set while absorbing the seasonal SBC step-up, ~$1B of LEO cost and fuel inflation the guide had flagged. Paid units <b>+17%</b>.','Fast commerce is where the flywheel now shows: <b>same-day perishables customers +50%</b> since January, and same-day orders carrying <b>3x the units</b> per order. Roughly <b>$600M of tariff-related refunds</b> landed as one-off relief inside the North America margin.'] },
    ]},
  // ── Amazon International ────────────────────────────────────────────────────────────────────────
  // No seeded sub-themes: a sub-theme exists only once it holds a REAL note, never as an empty
  // placeholder (Dani, Aug 2026). International hooks (segment margin, country build-out) get filed
  // here as the notes come in — via ＋ add note, Propose Notes, or the ✎ editor.
  // ── AWS ────────────────────────────────────────────────────────────────────────────────────────
  { seg:'AWS', theme:'Backlog', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'From +24% to +37% (fastest in 18 quarters) with the forward book compounding faster than revenue converts.',
    updates:[
      { q:'Q4 2025', items:['<b>+24%</b> (13-quarter high), $142B run-rate; backlog <b>$244B (+40%)</b>; >1GW added in Q4; 3.99GW of power added in 2025, doubling again by 2027.'] },
      { q:'Q1 2026', items:['<b>+28%</b> ($150B run-rate) — "very unusual for a business to grow this fast on a base this large"; backlog <b>$364B</b> EXCLUDING the <b>$100B+ Anthropic deal</b>; Bedrock spend +170% QoQ; Q1 tokens exceeded all prior years combined.'] },
      { q:'Q2 2026', items:['<b>+37%</b> ($169B run-rate) — the <b>fastest in 18 quarters</b> and the third straight acceleration; backlog <b>$496B</b>, roughly <b>2.5x</b> a year ago and still growing triple-digit.','Capacity is the constraint, and it is pre-committed: <b>2027 "largely reserved"</b>, some <b>2028 "already spoken for."</b> The AI business and the chips business <b>each above a $25B run-rate</b>, both triple-digit. Jassy: AWS "can be a trillion-dollar annual revenue business."'] },
    ]},
  { seg:'AWS', theme:'Capex', st:{ k:'watch', since:'Q4 2025', last:'Q2 2026' },
    why:'The number that reprices the stock: a ~$220B capex year against negative TTM FCF, defended with contracted demand.',
    updates:[
      { q:'Q4 2025', items:['"About <b>$200 billion</b> in capital expenditures… predominantly in AWS, because we have very high demand." TTM FCF $11.2B; the Summit model flipped FY26 FCF negative at its next snapshot. Olsavsky: "as fast as we install this capacity… we are monetizing it."'] },
      { q:'Q1 2026', items:['Q1 capex <b>$44.2B</b>; memory costs "<b>skyrocketed</b>" — allocations locked with strategic suppliers mid-to-late 2025.'] },
      { q:'Q2 2026', items:['The frame moved: FY26 cash capex <b>~$200B → ~$220B</b>, Olsavsky attributing part of the raise to the "<b>higher cost of memory</b>". Q2 capex <b>$54.2B</b> gross (1H26 $98.4B).','⚑ The cash line broke: <b>TTM free cash flow −$7.6B</b> (from +$18.2B a year ago) against $161.4B of TTM operating cash flow — funded with <b>$67B of new long-term debt</b> in one half ($65.6B → $128.9B). The Q4-2025 red line fired in reported actuals.'] },
    ]},
  { seg:'AWS', theme:'Margins', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'AWS segment profitability — expanding even through the AI build, helped by custom silicon and (in Q2) energy-derivative gains.',
    updates:[
      { q:'Q4 2025', items:['Segment margin <b>35%</b> (+40bps).'] },
      { q:'Q2 2026', items:['Segment margin <b>39.4%</b> (+650bps YoY, ~+520bps excluding energy-derivative gains).'] },
    ]},
  { seg:'AWS', theme:'Useful lives & Data Center Lifecycles', st:{ k:'watch', since:'Q1 2026', last:'Q1 2026' },
    why:'How Amazon depreciates the build: the install-to-billing lag and asset lives set the margin optics of the capex cycle.',
    updates:[
      { q:'Q1 2026', items:['Capacity installs <b>6–24 months before billing</b>; data centers <b>30+ year</b> assets, chips <b>5–6</b>.'] },
    ]},
  { seg:'AWS', theme:'Custom silicon — Graviton, Trainium, Rainier', st:{ k:'trend', since:'Q4 2025', last:'Q2 2026' },
    why:'The margin lever under the AI build — and possibly a merchant business (rack sales) with NVIDIA-adjacent economics.',
    updates:[
      { q:'Q4 2025', items:['$10B+ run-rate; Trainium at triple-digit growth; <b>Project Rainier: 500K chips</b> training the next Claude model; Trainium3 "nearly all supply committed by mid-2026"; Graviton >50% growth, >90% of top-1,000 customers.'] },
      { q:'Q1 2026', items:['Run-rate doubled to <b>$20B (+~40% QoQ)</b>; <b>$225B+ Trainium revenue commitments</b>; Trainium4 largely reserved ~18 months out; rack sales "<b>very much a possibility</b>"; Meta committed to tens of millions of Graviton cores.'] },
      { q:'Q2 2026', items:['The chips business passed a <b>$25B annualized run-rate</b>, growing triple-digit — and the tenant list stopped being a concentration argument: <b>Anthropic AND OpenAI</b> are each making <b>multi-year, multi-gigawatt</b> Trainium commitments. <b>Graviton5</b> reached general availability.','The merchant question survives the quarter: Nowak asked about Trainium sales into third-party data centres, and the answer stayed short of a plan.'] },
    ]},
];
