/* Sources & open questions — who said what, what it implies, what is still open */
const QUESTIONS = [
  ['1 · Colossus renewals', 'wait', 'Advanced', 'Renewals price higher (Musk) and pricing runs "slightly above the high end" of $30–50/W (CFO, Q3 call); backlog $63B. Exit is open to either party and SpaceX can absorb capacity. The question is the price when supply catches up.'],
  ['2 · Law for data processed in orbit', 'open', 'Our work', 'No source touches it. Could bind before physics or cost.'],
  ['3 · Forced network sharing, quantified', 'open', 'Our work', 'Pieces exist (Clear Street Connectivity margins high-70s to mid-80s, its 10× bear case halves Connectivity value). Nobody models a regulated-utility case.'],
  ['4 · Compute obsolete before orbit', 'wait', 'Bounded', 'The risk is GPUs, not buildings. Clearest exposure: Colossus I (~100k H100) backing Anthropic to 2029. No bank models obsolescence.'],
  ['5 · Terafab EUV from ASML', 'wait', 'Unanswered', 'Asked directly on the Q3 call; Musk gave the schedule and thanked ASML but did not confirm an order. Look for the answer on ASML’s side.'],
  ['6 · Mobile: what it costs to enter as a carrier', 'wait', 'Reframed', '~79 MHz with EchoStar and 800 MHz deals; US carriers refused wholesale access; UBS assumes ~$200B of Connectivity capex to 2031.'],
  ['7 · Who insures a mega-constellation', 'open', 'Our work', 'No source covers it. Only data point: 1,446 satellites de-orbited.'],
  ['8 · Did Google get its capacity by Sep 30', 'wait', 'Ask IR', 'Not in the Q3 release or call. Termination / price-cut right after a month’s grace.'],
  ['9 · A Tesla combination for SPCX minorities', 'wait', 'Watching', 'Independent committees, no terms. Tesla needs 50% of all shares; Musk holds ~82% of the SpaceX vote.']
];
const GLOSSARY = [
  ['Falcon 9 / Starship','Rockets. Falcon 9 flies weekly and lands its booster (up to 34 flights); Starship carries ~100 t and is in testing.'],
  ['Starlink · V2 mini / V3','The satellite internet service and its satellite generations. V3 only fits in Starship.'],
  ['Colossus','The Memphis data centres. Buildings with chips, not in space.'],
  ['Nameplate compute','Installed power of those data centres, in gigawatts: 1.7 GW at Sep 30 2026.'],
  ['Starshield','The military version of the network: same hardware, government-grade encryption.'],
  ['IDIQ','Government contract that pre-approves a supplier up to a ceiling without committing to buy.'],
  ['Cost parity','Where orbital and terrestrial compute cost the same. Not zero cost.'],
  ['Adj. EBITDA','Excludes depreciation of satellites and chips — a real cost here ($8.9B in 9M).'],
  ['Data residency','Rules on where data may be processed. Satellites have no fixed place.'],
  ['Wholesale access','A duty to lease network capacity to rivals at regulated prices.'],
  ['De facto / de jure','In practice / in law. SpaceX’s orbital position is the first, never the second.']
];

registerView({ id:'src',
  html: `
  ${sec({ t:'Who said what', s:'Every bank that initiated helped sell the listing. Read them for mechanics, not for the price',
    b:`<div id="src-c"></div>`,
    n:'Not cited as targets. Cestrian (Accumulate, no PT, "valuation meaningless" at 61× EV/sales) and Paragon/Heron (3 ex-sales staff) carry no target. Barclays’ note is on Amazon, not SpaceX.' })}

  ${sec({ t:'What those targets require', s:'Own arithmetic on the banks’ own numbers',
    b:`<ul class="pl">
      <li><strong>Wells Fargo:</strong> 30× $7.1 on ~13.2B shares implies <strong>~$93B of 2028 net income</strong>, against −$413M in 9M26.</li>
      <li><strong>UBS</strong> is already behind reality: it modelled $49.9B capex and −$10.9B FCF for all of 2026; nine months show $48.1B and −$35.0B.</li>
      <li><strong>Clear Street</strong> calls its model conservative and still sits 54% above FY27 revenue consensus.</li>
      <li><strong>No bank</strong> models compute obsolescence, forced network sharing or data residency.</li>
    </ul>`,
    n:'Our arithmetic on the banks’ published numbers and the Q3 2026 release. Inconsistencies we found across the notes: UBS shows net cash three ways, Needham names Meta for Google, aircraft counts range from 1,400 to ~12,000.' })}

  ${sec({ t:'Open questions', s:'Status after the Nov 17 2026 source review and Q3 call',
    ctl:`<div class="ctls">${seg('src-f','Show',[['all','All'],['open','Our own work'],['wait','In progress']],'all')}</div>`,
    b:`<div id="src-q"></div>`,
    n:'Questions 2 and 3 are the two outcomes that would change the answer rather than the timing.' })}

  ${sec({ t:'Reference', s:'Corrections made in the review and a plain-English glossary',
    b:`<details class="tbl"><summary>Corrected on Nov 17 2026 (9)</summary><div class="tw" style="padding:4px 13px"><ul class="pl">
        <li>90-day cancellation is open to <strong>either party</strong>, after a ramp period (10-Q).</li>
        <li>Falcon 9 at $2,700/kg is the <strong>2010</strong> cost.</li>
        <li>Ground stations: ~400, not ~150.</li>
        <li>"Blasting ahead of LEO" was Barclays on <strong>Amazon Leo</strong>, in an Amazon note.</li>
        <li>The ship was <strong>caught on Flight 15 (Nov 14 2026)</strong> (J.P. Morgan; press, not yet a company disclosure); re-flying the same ship (target early 2027) is the next test.</li>
        <li>Runway is <strong>~5 quarters</strong>, not ~two years.</li>
        <li>"Not about feasibility": engineering at scale (heat, radiation) is still open.</li>
        <li>SpaceX does not pay spot for third-party capacity: it <strong>rents its compute out</strong> at ~spot on short contracts.</li>
        <li>"Internal use could eventually consume most" was a Clear Street paraphrase, not a Musk quote.</li></ul></div></details>
      <details class="tbl"><summary>Glossary (${GLOSSARY.length} terms)</summary><div class="tw" style="padding:4px 13px">${GLOSSARY.map(g => `<div class="gl"><b>${g[0]}</b><span>${g[1]}</span></div>`).join('')}</div></details>`,
    n:'Primary: SpaceX Q3 2026 release and 10-Q, Q2 2026 10-Q, 424B4 (Jun 12 2026), Q2 (Aug 4 2026) and Q3 (Oct 20 2026) call transcripts. Sell-side: UBS, Needham, Clear Street ×2, Wells Fargo ×2, Deutsche Bank, Mizuho, Cestrian, Paragon/Heron, Barclays. Bloomberg SPLC (Nov 12 2026).' })}
  `,
  init(){
    const S = STREET;
    chartBlock($('#src-c'), { labels:S.map(s => s.b), unit:'$ per share', fmt:v => '$' + num(v), rowHead:'Bank', height:'s',
      series:[ { key:'bear', label:'Bear case', color:C.fog, data:S.map(s => s.bear ?? null) },
               { key:'pt', label:'Price target', color:C.steel, data:S.map(s => s.pt) },
               { key:'bull', label:'Bull case', color:C.conn, data:S.map(s => s.bull ?? null) } ],
      tableNote: S.map(s => `<b>${s.b}</b> (${s.d}, ${s.r}${s.prev ? ', from $' + s.prev : ''}): ${s.m}. <i>${s.c}</i>`).join('<br>') });
    const draw = f => { $('#src-q').innerHTML = QUESTIONS.filter(q => f === 'all' || q[1] === f)
      .map(q => `<div class="st"><b>${q[0]}</b><span><span class="tag ${q[1]}">${q[2]}</span></span><span>${q[3]}</span></div>`).join(''); };
    draw('all'); pills('#src-f', draw);
  }
});
