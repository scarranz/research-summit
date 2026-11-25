/* What can go wrong — ranked by how much each would change the conclusion */
const RISKS = [
  { t:'The rocket programme runs late', k:'timing',
    w:'Everything beyond today’s Starlink — V3 urban capacity, orbital compute, the launch-to-compute moat — sits behind one unsolved problem: surviving orbital re-entry repeatedly without rebuilding the heat shield. Delay postpones the case rather than destroying it, but postponing while spending $48B of capex in nine months changes its value.',
    seen:'Launches 113 vs 128 (−12%), mass to orbit −7%, Space EBITDA from +$803M to −$199M as R&D rose. Q3: 35 launches vs 46 expected by Clear Street.',
    watch:'FAA licences and investigations, flights and mass per quarter, and above all whether one vehicle re-flies in quick succession.',
    mit:'2026 Starlink capacity and 2027 revenue targets do not depend on Starship (management, as reported by Needham).' },
  { t:'Licences turn out to be political instruments', k:'answer?',
    w:'Orbital slots and spectrum are licensed, not owned: granted nationally, with deployment deadlines, and revocable. The founder is unusually exposed politically. A government that is also the largest single customer has two levers, not one.',
    watch:'Any proceeding to review existing authorisations, changes to deployment milestones, competitive re-bidding of work now awarded directly.' },
  { t:'The network is forced open to competitors', k:'changes the answer',
    w:'Telecoms that built dominant fixed networks were made to lease capacity to rivals at regulated prices. The same logic applies with unusual force: orbital shells and spectrum are finite public resources. Starlink would go from retail ISP with subscription margins to infrastructure landlord with regulated rents — a different business.',
    watch:'Competition probes framed around access to orbital capacity, any national regulator conditioning market access on wholesale terms, competitor lobbying.',
    mit:'Clear Street: Ku/Ka spectrum is "comparatively abundant", the barrier is economic. Against: governments distrust "a U.S.-controlled satellite monopoly", and the move into mobile and suburban retail widens the regulatory surface. Clear Street’s bear case (10×) halves its ~$94/share Connectivity value — the closest reference anyone gives. Open question 3.' },
  { t:'The AI spending cycle turns', k:'timing',
    w:'Rented compute was 40% of nine-month revenue and almost all the growth, on contracts either side can end on 90 days. Same chips at the same prices, same small group of buyers, same oversupply if it comes.',
    seen:'One SI customer (Customer B) was 34.5% of group revenue in 3Q26, up from 19.5% in 2Q26 (10-Qs). 2027 non-cancellable commitments are $25.6B, though ~$19.6B of that is the EchoStar spectrum purchase, not compute (Q3 10-Q, 424B4).',
    watch:'Renewal terms, the price per MW on new deals, any large client announcing its own facilities.',
    mit:'The fallback is reallocating capacity to Grok: the goal is to split compute "50/50, more or less" between internal use and rentals (Musk, Q3 call). Today pricing is rising: contracts are "renewing at higher dollars per watt, not lower" (Musk).' },
  { t:'Promised timelines are not met', k:'timing',
    w:'The case needs a reusable rocket, a satellite generation, a compute build-out and a chip fab to all work, on time, under one person’s attention. Announced programmes are not commitments. There is no succession plan in the filings.',
    watch:'Starship weekly in 1H27, twice weekly in 2H27; 13 GW by end-2027; Starlink Mobile US service in early 2028; Terafab volume around 3Q28 (all Q3 2026 call); ~$500B exit ARR in Dec 2027, Musk’s "best guess" (Baron conference, Nov 6), vs a $33–37B 1Q27 revenue guide.' },
  { t:'The rival with an unlimited balance sheet closes the gap', k:'timing',
    w:'Amazon is behind and missed its own targets, but it can fund Leo indefinitely from AWS without returning to capital markets — exactly what SpaceX cannot do.',
    watch:'Leo satellites in orbit vs the 578 needed to sell in the US; New Glenn cadence; Leo opex (> $1B a quarter in 2H26).' },
  { t:'Dual-use status invites consequences', k:'timing',
    w:'The network serves defence customers and a military constellation shares its hardware, which blurs the civil–commercial line. The practical threat is electronic — jamming, spoofing, cyber — not satellites destroyed. Defence revenue growth and this exposure are the same fact.',
    watch:'Wording and attribution of the 2022 Russian UN statement still to be verified before relying on it.' },
  { t:'Minority shareholders have little recourse', k:'governance',
    w:'Dual-class shares give the founder ~82% of the vote. Controlled-company exemptions apply; capital allocation (a $60B acquisition, affiliate deals) needs no minority approval. $12.9B of $38.8B debt is related-party.',
    seen:'Independent committees at SpaceX and Tesla are evaluating a combination, no terms agreed; Tesla needs 50% of all shares. Q3 other income included $561M from a related party.',
    watch:'Musk’s ~6.4B Class A shares unlock Jun 12 2027; S&P 500 entry expected around Aug 2027 (UBS).' },
  { t:'An orbital debris cascade is uninsurable', k:'tail',
    w:'Under the treaty, liability falls on the launching state. Commercial insurance for constellation-scale collision risk is thin and a cascade has no financial backstop. The loss would be the operating environment, not individual assets.',
    seen:'Starlink has de-orbited 1,446 satellites (Barclays) — end-of-life discipline exists.',
    watch:'Open question 7 — no source covers insurance. Our own work.' }
];

registerView({ id:'risk',
  html: `
  <div class="ins a"><strong>What the bad cases share:</strong> most postpone the case rather than refute it. Two are exceptions that change the answer, not just the timing —
  <strong>forced network sharing</strong> (#3) and <strong>data-residency rules blocking orbital compute</strong> (Orbital compute tab). Neither is modelled by any bank.</div>
  ${sec({ t:'Ranked by how much each would change the conclusion', s:'None requires a disaster; most are ordinary commercial outcomes',
    b:`<div class="rk"><div class="rk-l" id="risk-l"></div><div class="rk-d" id="risk-d"></div></div>`,
    n:'Our ranking. Facts in each card: Q3 2026 release and 10-Q, 424B4, Q2 and Q3 2026 calls, and the sell-side notes named.' })}
  `,
  init(){
    const tagOf = k => k === 'changes the answer' ? '<span class="tag open">Changes the answer</span>' : k === 'governance' ? '<span class="tag n">Governance</span>' : k === 'tail' ? '<span class="tag n">Tail</span>' : k === 'answer?' ? '<span class="tag wait">Could change it</span>' : '<span class="tag n">Timing</span>';
    $('#risk-l').innerHTML = RISKS.map((r,i) => `<button class="rk-b" data-i="${i}"><span class="n">${i+1}</span><span>${r.t}</span></button>`).join('');
    const pick = i => { const r = RISKS[i];
      $$('#risk-l .rk-b').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      $('#risk-d').innerHTML = `<h4>${i+1} · ${r.t}</h4><div style="margin-bottom:10px">${tagOf(r.k)}</div><p class="lede">${r.w}</p>` +
        (r.seen ? `<div class="blk"><div class="k">Already visible</div><p>${r.seen}</p></div>` : '') +
        (r.mit ? `<div class="blk"><div class="k">What the sources add</div><p>${r.mit}</p></div>` : '') +
        `<div class="blk"><div class="k">What to watch</div><p>${r.watch}</p></div>`; };
    $$('#risk-l .rk-b').forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(0);
  }
});
