/* Overview — what the company is, the nine-month numbers, what is established and what is not.
   Lede, key facts, segment order (Space · Connectivity · SI) and timeline follow the research portal's SPCX Overview
   (424B4 Business and history; Q3 2026 release; Q3 2026 10-Q cover for shares). */
const OV_FACTS = [
  ['Listing', 'NASDAQ: SPCX'],
  ['HQ · incorporated', 'Starbase, Texas · Texas corporation (reincorporated Feb 2024)'],
  ['Founded · CEO', '2002 · Elon Musk, founder and CEO since 2002'],
  ['IPO', 'Jun 12 2026 at $135 · $85.7B net proceeds'],
  ['Shares outstanding', num(CAP.q3.shares,1) + 'M · ' + CAP.q3.date + ' (Q3 10-Q cover)'],
  ['Employees', '22,000+ full-time · Mar 2026'],
  ['Voting control', 'Musk ~82% of the vote after the IPO (424B4)'],
  ['Dividend', 'Never paid one']
];
const OV_TIMELINE = [
  ['2002', 'Elon Musk founds Space Exploration Technologies.'],
  ['2008', 'Falcon 1 reaches orbit; NASA awards the first cargo-resupply contract.'],
  ['2010–12', 'Falcon 9 first flies; Dragon delivers cargo to the Space Station.'],
  ['2015–17', 'First Falcon 9 booster landing (Dec 2015) and reflight (2017).'],
  ['2019–21', 'Starlink launches (2019) and starts service (2020); Crew Dragon flies NASA astronauts (May 2020).'],
  ['2023', 'Starship first flies.'],
  ['Feb 2024', 'Reincorporates in Texas (Starbase HQ).'],
  ['Oct 2024', 'First Starship booster caught by the launch tower.'],
  ['Feb 2026', 'Combines with xAI (which had absorbed X): Grok, X and the Colossus data centres come in.'],
  ['Jun 2026', 'IPO on Nasdaq at $135 — $85.7B of net proceeds.'],
  ['Aug 2026', 'Acquires Cursor (AI coding) at an implied $60B equity value.'],
  ['Sep 2026', 'Starship reaches orbit on Flight 14, deploying 26 V3 Starlink satellites.']
];

registerView({ id:'ov',
  html: `
  <p class="lede">SpaceX designs, builds and launches reusable rockets and spacecraft, and operates <strong>Starlink</strong>, a low-Earth-orbit satellite internet network.
  Since combining with xAI in February 2026 it is also an <strong>AI company</strong>, building its own models and the data centres that train and run them.
  It reports three segments: <strong>Space</strong>, <strong>Connectivity</strong> and <strong>SI</strong>. The AI data centres are on the ground, in Memphis and Southaven; <strong>nothing in orbit bills a dollar yet.</strong></p>

  <div class="srow">
    ${tile('Revenue · 9M26', usd(IS9M.rev.total[1]), '<span class="up">+97%</span> vs 9M25')}
    ${tile('Operating income · 9M26', usd(IS9M.opinc.total[1]), 'From ' + usd(IS9M.opinc.total[0]) + ' a year earlier')}
    ${tile('Net income · 9M26', usd(IS9M.net[1]), 'Still a loss; Q3 alone showed +$4.4B')}
    ${tile('Free cash flow · 9M26', usd(IS9M.fcf[1]), 'Capex ' + usd(-IS9M.capex[1]) + ', up 247%')}
  </div>

  ${sec({ t:'Three segments, one parent', s:'They share a balance sheet and little else',
    b:`<div class="cols3">
      <div class="biz" style="--c:${C.space}"><div class="k">Space · launch</div><div class="n">${usd(IS9M.rev.space[1])} revenue · ${usd(IS9M.opinc.space[1])} op. income</div>
        <p>Falcon 9 and Falcon Heavy launches, Dragon missions and development contracts. Starship, the rocket everything long-term depends on, reached orbit in Sep 2026 and is still in testing. Rising Starship R&amp;D drives the loss.</p>
        <div class="w">Where: Starbase, Texas (Starship); Falcon flies from Florida and California</div></div>
      <div class="biz" style="--c:${C.conn}"><div class="k">Connectivity · Starlink</div><div class="n">${usd(IS9M.rev.conn[1])} revenue · ${usd(IS9M.opinc.conn[1])} op. income</div>
        <p>Satellite internet: ${num(CONN.subs[1],1)}M consumer subscribers, over ${num(CONN.sats)} satellites, ${CONN.markets} markets; plus Starlink Mobile and Starshield. <strong>The only segment that funds the rest.</strong></p>
        <div class="w">Where: in orbit at ~550 km; ~400 ground stations</div></div>
      <div class="biz" style="--c:${C.si}"><div class="k">SI · AI &amp; compute</div><div class="n">${usd(IS9M.rev.si[1])} revenue · ${usd(IS9M.opinc.si[1])} op. income</div>
        <p>What came with xAI: Colossus compute rented to AI labs (Anthropic, Google, Reflection AI), Grok, advertising on X and, since Aug 2026, Cursor. NVIDIA GPUs bought at market prices.</p>
        <div class="w">Where: Memphis, Tennessee and Southaven, Mississippi</div></div>
    </div>`,
    n:'SpaceX Q3 2026 release (Oct 20 2026), nine months to Sep 30; satellites from the Q3 2026 10-Q ("over 11,100"); ground stations from Needham (Jul 2026). SI = "Super Intelligence", the AI segment.' })}

  ${sec({ t:'The company in brief', s:'Key facts and the milestones that made it',
    b:`<div class="cols2">
      <div><div class="pt">Key facts</div>${OV_FACTS.map(f => `<div class="gl"><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div>
      <div><div class="pt">Timeline</div>${OV_TIMELINE.map(t => `<div class="gl"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    </div>`,
    n:'424B4 prospectus (Jun 12 2026): history, Texas reincorporation, headcount, voting power, IPO price; Q3 2026 cash-flow statement (IPO net proceeds $85,675M); Q3 2026 10-Q cover (shares); Q3 2026 release (Flight 14, Cursor).' })}

  ${sec({ t:'Nine months against nine months', s:'The quarter points the opposite way from the year, so the page uses 9M vs 9M',
    ctl: `<div class="ctls">${seg('ov-m','Metric',[['rev','Revenue'],['op','Operating income']],'rev')}</div>`,
    b:`<div id="ov-c"></div>`,
    n:'Q3 2026 release, $M. Q3 net income of $4,404M came from $1,025M other income, $873M interest income and a $390M tax benefit; nine months lost $413M.' })}

  ${sec({ t:'What the review concludes', s:'Our read of the evidence, not a verdict. Valuation is on hold on purpose: first the bad scenarios',
    b:`<div class="cols2">
      <div><div class="pt"><i style="background:${C.pos}"></i>Established on the evidence</div><ul class="pl">
        <li><strong>Satellite internet works commercially:</strong> ${num(CONN.subs[1],1)}M subscribers, ${usd(CONN.ebitda[1])} segment adj. EBITDA in 9M, +57% revenue.</li>
        <li><strong>No rival matches its launch cost</strong> without first building a reusable heavy rocket.</li>
        <li><strong>Orbital compute physics is sound;</strong> heat and radiation at scale are open engineering problems.</li>
        <li><strong>Military demand</strong> is large, growing and proven in a real conflict.</li>
        <li>The barrier to entry is <strong>industrial and economic, not legal</strong>.</li></ul></div>
      <div><div class="pt"><i style="background:${C.neg}"></i>Unresolved, and material</div><ul class="pl">
        <li><strong>Launches fell 12%</strong> in 9M while Starship is still in testing.</li>
        <li><strong>SI is 40% of revenue,</strong> on compute contracts either party can end on 90 days; one SI customer was ${(SI.custB3Q*100).toFixed(1)}% of Q3 revenue.</li>
        <li><strong>Runway is ~5 quarters,</strong> and the +10 GW 2027 plan implies capex of the order of $300B.</li>
        <li><strong>Share count more than doubled;</strong> stock pay ran at 14% of revenue. A third of debt is related-party.</li>
        <li><strong>Two outcomes change the answer, not just the timing:</strong> forced network sharing, and data-residency rules blocking orbital compute.</li></ul></div>
    </div>`,
    n:'Sources: Q3 2026 release and 10-Q (customer concentration, debt), 424B4, Q2 and Q3 2026 call transcripts, and the sell-side notes named in each tab. The runway and the ~$300B are our arithmetic.' })}
  `,
  init(){
    const L = ['Space','Connectivity','SI'];
    const mk = m => { const s = m === 'rev' ? IS9M.rev : IS9M.opinc; return {
      labels:L, unit:'$M', fmt:v => usd(v), rowHead:'Segment', total:false,
      series:[ { key:'p', label:'9M 2025', color:C.fog, data:[s.space[0], s.conn[0], s.si[0]] },
               { key:'c', label:'9M 2026', color:C.steel, data:[s.space[1], s.conn[1], s.si[1]] } ],
      tableNote: m === 'rev' ? `Total revenue ${usd(IS9M.rev.total[0])} → ${usd(IS9M.rev.total[1])} (+97%).` : `Total operating income ${usd(IS9M.opinc.total[0])} → ${usd(IS9M.opinc.total[1])}. Net income ${usd(IS9M.net[0])} → ${usd(IS9M.net[1])}; attributable ${usd(IS9M.netAttrib[1])}.` }; };
    const blk = chartBlock($('#ov-c'), mk('rev'));
    pills('#ov-m', v => blk.set(mk(v)));
  }
});
