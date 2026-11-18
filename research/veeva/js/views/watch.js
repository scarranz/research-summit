/* What to watch — company-specific risks, open questions, data notes */
const VRISKS = [
  { t:'CRM customers move to Salesforce', w:'Salesforce sells its own life-sciences CRM with IQVIA’s CRM licensed to it. Some large Veeva CRM customers have committed to it and others have said they intend to move. Every customer must re-platform by 2029–30.', watch:'Top-20 commitments (12 now, ~14 expected), customers live on Vault CRM, Commercial subscription growth (+13% in Q2 FY27).' },
  { t:'Migration goes badly', w:'Moving thousands of users onto Vault CRM could cause outages or performance problems as volume ramps; the wind-down depends on Salesforce, which can end it early in some cases.', watch:'Go-live pace of top-20 accounts (5 live); any disclosed outage or delay.' },
  { t:'Concentration in one industry', w:'Top 10 customers are 28% of revenue and nearly all revenue is life sciences. Pharma mergers have cost user subscriptions before; drug-pricing rules, FDA staffing and limits on consumer drug ads (Crossix) reach Veeva directly.', watch:'Large pharma M&A; US drug-pricing and ad rules.' },
  { t:'Less revenue visibility', w:'Since Feb 2023 most multi-year contracts can be cancelled within a year; backlog (RPO) is no longer disclosed.', watch:'Deferred revenue year over year (it is seasonal, so not sequentially).' },
  { t:'AI disrupts the applications', w:'Competitors’ AI or customers building their own tools could displace Veeva apps. Veeva’s own agents run on third-party models (Anthropic, Amazon).', watch:'Falcon and AI-agent adoption; any pricing for AI.' },
  { t:'Growth keeps slowing', w:'Revenue growth went from 25–35% a year (FY17–22) to ~15–18%. The 10-K warns growth "may decline". The 2030 goal needs ~13% a year.', watch:'FY28 guidance; R&D & Quality vs Commercial growth.' },
  { t:'Public Benefit Corporation', w:'Directors must balance stockholders against customers, employees and community. A governance trade-off, not a near-term risk.', watch:'Capital allocation: the $2B buyback is the first return of cash.' }
];

registerView({ id:'watch',
  html: `
  ${sec({ t:'Risks specific to Veeva', s:'From the 10-K FY26 and 10-Q Q2 FY27, not boilerplate',
    b:`<div class="rk"><div class="rk-l" id="watch-l"></div><div class="rk-d" id="watch-d"></div></div>`,
    n:'10-K FY26 Item 1A; 10-Q Q2 FY27. Ordered by how directly each touches the current story.' })}

  ${sec({ t:'Open questions', s:'What the filings do not answer',
    b:`<div>
      <div class="st"><b>Losses to Salesforce</b><span><span class="tag open">Not disclosed</span></span><span>How many CRM customers, and how much revenue, are moving away. Commercial growth is the only proxy.</span></div>
      <div class="st"><b>Why services jumped</b><span><span class="tag wait">Inference</span></span><span>Services +24% in Q2 FY27 after two flat years. Migration work is plausible; the company does not say.</span></div>
      <div class="st"><b>2030 targets in full</b><span><span class="tag wait">Unverified</span></span><span>Third parties cite 35%+ non-GAAP margin and ~87% subscription by 2030; the Investor Day decks could not be read.</span></div>
      <div class="st"><b>Q3 FY27 print</b><span><span class="tag n">Early Dec</span></span><span>Guide $932–935M revenue, $417–420M non-GAAP op. income; Veeva said on Nov 5 it expects to meet or exceed.</span></div>
    </div>`,
    n:'SEC filings only; no Bloomberg consensus or Summit model for VEEV.' })}

  ${sec({ t:'Reading the numbers', s:'Quirks that change a chart if missed',
    b:`<ul class="pl">
      <li><strong>Fiscal year ends Jan 31:</strong> FY26 = Feb 2025–Jan 2026.</li>
      <li><strong>FY17–FY18 restated</strong> under ASC 606; FY16 is not. FY17 non-GAAP exists only on the old basis.</li>
      <li><strong>Two product-area definitions</strong> (Commercial Cloud / Vault to FY21; Commercial / R&D Solutions from FY20, recast). Never splice them.</li>
      <li><strong>Seasonality:</strong> annual billing in Q4 makes Q1 operating cash flow huge (${usd(VD.quarterly.Q1FY2027.cfo)} in Q1 FY27) and deferred revenue peak on Jan 31.</li>
      <li><strong>Free cash flow</strong> here is our CFO − capex; the capex line changed definition in FY21.</li>
    </ul>`,
    n:'Data pack built from SEC EDGAR (CIK 1393052): 10-K FY16–FY26, earnings releases (8-K Ex. 99.1) Q1 FY24–Q2 FY27, Investor Day 8-Ks Nov 2023, Nov 2024, Nov 2026.' })}
  `,
  init(){
    $('#watch-l').innerHTML = VRISKS.map((r,i) => `<button class="rk-b" data-i="${i}"><span class="n">${i+1}</span><span>${r.t}</span></button>`).join('');
    const pick = i => { const r = VRISKS[i];
      $$('#watch-l .rk-b').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      $('#watch-d').innerHTML = `<h4>${i+1} · ${r.t}</h4><p class="lede">${r.w}</p><div class="blk"><div class="k">What to watch</div><p>${r.watch}</p></div>`; };
    $$('#watch-l .rk-b').forEach(b => b.onclick = () => pick(+b.dataset.i)); pick(0);
  }
});
