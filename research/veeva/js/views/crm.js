/* Vault CRM & growth drivers — the Salesforce break and where the next growth comes from */
const VCRM = QK.map(k => VD.quarterly[k]).map(q => {
  const v = q.vault_crm_customers_live; return v == null ? null : +String(v).replace('>', '');
});
const VT20 = Qv('top20_vault_crm_commitments');

registerView({ id:'crm',
  html: `
  <p class="lede">Veeva CRM was built on <strong>Salesforce</strong>. In late 2022 Veeva chose not to renew and to rebuild CRM on its own Vault platform; Salesforce now sells a competing pharma CRM, with IQVIA's CRM software licensed to it.
  <strong>Every Veeva CRM customer has to re-platform by 2029–30</strong> — a natural moment to switch vendor.</p>

  <div class="srow">
    ${tile('Customers live on Vault CRM', '180+', 'Q2 FY27; from 30+ two years earlier')}
    ${tile('Top-20 pharma committed', '12 of 20', 'Veeva expects about 14')}
    ${tile('Top-20 pharma live', '5', 'Q2 FY27')}
    ${tile('Legacy CRM supported until', 'Dec 31 2029', 'No new customers since Sep 2025')}
  </div>

  ${sec({ t:'Migration progress', s:'Company-reported counts; "more than" figures shown at the floor',
    b:`<div id="crm-c"></div>`,
    n:'Quarterly releases Q3 FY24–Q2 FY27. Veeva gives no count of losses: the 10-K says some large customers committed to Salesforce and others said they intend to move.' })}

  ${sec({ t:'The terms of the break', s:'What Veeva can and cannot do during the wind-down',
    b:`<div>
      <div class="st"><b>Late 2022</b><span><span class="tag n">Announced</span></span><span>CRM to move onto Vault; the Salesforce agreement will not be renewed (10-K FY23: "recently announced").</span></div>
      <div class="st"><b>Apr 2024</b><span><span class="tag ok">Launched</span></span><span>Vault CRM generally available to new customers; 13 CRM wins that quarter.</span></div>
      <div class="st"><b>Sep 1 2025</b><span><span class="tag wait">Expired</span></span><span>Salesforce agreement ends. Until Sep 1 2030 Veeva cannot sell the Salesforce-based CRM to new customers; existing ones are capped at 150% of their Sep 2025 seats.</span></div>
      <div class="st"><b>Dec 31 2029</b><span><span class="tag open">Deadline</span></span><span>End of support for legacy Veeva CRM. Salesforce can end the wind-down early in some cases (material breach, or Veeva acquired by named companies).</span></div>
    </div>`,
    n:'10-K FY26 and 10-Q Q2 FY27. Vault runs on AWS; legacy Veeva CRM runs on Salesforce’s infrastructure.' })}

  ${sec({ t:'Where the next growth comes from', s:'The levers management cites',
    b:`<div class="cols2">
      <ul class="pl">
        <li><strong>Development Cloud</strong> — "largest go-forward opportunity". 11+ clinical products, most early in adoption; Safety passed 100 customers with 6 top-20 wins.</li>
        <li><strong>Quality Cloud</strong> — 600+ customers on at least one app; LIMS targets its first top-20 go-live in 2026.</li></ul>
      <ul class="pl">
        <li><strong>Data Cloud</strong> — Compass (an alternative to IQVIA data), Link, Crossix ("breakout year" in FY26).</li>
        <li><strong>AI agents</strong> — "from an industry-specific application company to an … application and AI agent company" (Q1 FY27). Models from Anthropic and Amazon via Bedrock.</li></ul>
    </div>
    <div class="ins" style="margin-top:14px"><strong>The goal:</strong> a <strong>$6B revenue run rate by 2030</strong>, double the $3B reached in Q1 FY26. FY27 guidance (~$3.7B) implies ~13% a year from here to get there.</div>`,
    n:'Q3 FY25, Q3–Q4 FY26 and Q1 FY27 releases; 2030 goal from the Q3/Q4 FY26 releases. The "~13% a year" is our arithmetic ($3.7B → $6B over four years), not a company figure.' })}
  `,
  init(){
    chartBlock($('#crm-c'), { labels:QL, unit:'count', fmt:v => num(v), rowHead:'Quarter',
      series:[ { key:'l', label:'Customers live on Vault CRM', color:VC.com, data:VCRM },
               { key:'t', label:'Top-20 pharma committed', color:VC.rd, type:'line', data:VT20, axis:'y2', span:true } ],
      extra: c => { c.options.scales.y2 = { position:'right', min:0, max:20, grid:{display:false}, ticks:{ stepSize:5 }, title:{ display:true, text:'Top-20 committed', color:'#8A93A0', font:{size:10.5, weight:600} } }; },
      tableNote:'Q3 FY24: first customer live, 2 top-20 committed. Q4 FY25: 8 customers migrated from Veeva CRM. Q1 FY27: 27 new Vault CRM customers.' });
  }
});
