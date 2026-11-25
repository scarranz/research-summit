/* Defense — the revenue that keeps growing, and the rules of the road */
registerView({ id:'def',
  html: `
  <div class="srow">
    ${tile('Defense obligations · FY26 to date', usd(DEF.oblig9M26), 'First 3 quarters of US fiscal 2026 vs ' + usd(DEF.obligFY25) + ' in all of FY25 (Bloomberg Government)')}
    ${tile('Federal share of 2025 revenue', '~20%', 'Needham')}
    ${tile('Government share, Q4 2026', '< 10%', 'Musk on X, Nov 6 (press); < 5% a year from now')}
    ${tile('Golden Dome, total', '> $175B', 'UBS; $25B initial funding')}
  </div>

  ${sec({ t:'The contracts', s:'Headline values are ceilings and programme totals, not committed revenue',
    b:`<div id="def-c"></div>`,
    n:'Sources: Bloomberg Government (Nov 2026; AMTI and Space Data Network Backbone values from Space Command); Space Force NSSL Phase 3 award (press); other values from press reports of the awards. Q3 2026 release: 18 NSSL, 3 crewed ISS and 3 Starfall missions added to the pipeline. UBS counts > $20B of US government contracts.' })}

  ${sec({ t:'A falling government share is a trade, not a win', s:'The mix swaps political exposure for exposure to the AI capital cycle',
    b:`<div class="cols2">
      <ul class="pl">
        <li><strong>Government work</strong> is sticky, good-margin and proven in conflict (Ukraine changed the DoD’s stance). It also concentrates revenue in a buyer that sets terms.</li>
        <li><strong>What replaces it</strong> is rented compute: 40% of revenue, cancellable on 90 days, from a handful of AI developers — more correlated with the rest of a portfolio.</li></ul>
      <ul class="pl">
        <li><strong>Golden Dome sets the architectural precedent.</strong> Once a defence constellation is designed around SpaceX hardware and protocols, switching costs for the DoD are very large, and allies tend to follow the standard.</li>
        <li><strong>Dual use is the same fact as risk #7:</strong> defence growth and exposure to jamming, spoofing and escalation cannot be judged separately.</li></ul>
    </div>`,
    n:'Our read. Government-share figures: Musk on X, Nov 6 2026 (MT Newswires).' })}

  ${sec({ t:'Owning the ship, not the sea', s:'The company owns its satellites but cannot own the orbits they occupy',
    b:`<div class="cols3">
      <div class="biz" style="--c:${C.pos}"><div class="k">Owned outright</div><p>Satellites, ground stations, rockets, patents. Ordinary property.</p></div>
      <div class="biz" style="--c:#B45309"><div class="k">Licensed, not owned</div><p>Spectrum and orbital positions. Granted nationally, with deployment deadlines. <strong>Revocable — use it or lose it.</strong></p></div>
      <div class="biz" style="--c:${C.neg}"><div class="k">Nobody can own</div><p>Orbital shells, the Moon, any volume of space. No legal mechanism transfers title.</p></div>
    </div>
    <details class="tbl"><summary>Outer Space Treaty (1967) — what binds SpaceX</summary><div class="tw">${table(['Provision','Effect','Consequence'],[
      ['No national appropriation','Space cannot be claimed by sovereignty, use or occupation','No title over an orbit for any company or state'],
      ['State responsibility for private operators','Each state authorises and supervises its companies','The US answers for SpaceX in orbit — the basis of its licensing lever'],
      ['Launching-state liability','Damage liability falls on the launching state','Collision and debris liability reaches the government'],
      ['State-of-registry jurisdiction','Objects stay under the registering state','Private property under US jurisdiction wherever it flies'],
      ['Weapons restriction','WMD banned in orbit; conventional military activity is not','Nothing bans a conventional attack on a satellite']
    ])}</div><div class="snote" style="margin:0;border:none;border-top:1px solid var(--bdr);border-radius:0">Ratified by well over a hundred states including every significant launcher; core provisions are widely treated as general international law.</div></details>`,
    n:'Outer Space Treaty (1967). Our read: the position is secured by occupation, de facto not de jure — the natural-monopoly pattern that historically ends in regulated access (risk #3). Market-by-market approvals are an operating cost; a withdrawal by the home regulator would be existential.' })}
  `,
  init(){
    chartBlock($('#def-c'), { labels:DEF_CONTRACTS.map(r => r[0]), horizontal:true, unit:'$M', fmt:v => usd(v,1), rowHead:'Contract',
      series:[ { key:'v', label:'Headline value', color:C.steel, data:DEF_CONTRACTS.map(r => r[1]) } ],
      tableNote: DEF_CONTRACTS.map(r => '<b>' + r[0] + '</b>: ' + r[2]).join(' · ') });
  }
});
