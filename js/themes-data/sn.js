// themes-data/sn.js — the SharkNinja theme record.
//
// Same contract as themes-data/amzn.js: the curated answer to "what has management actually
// said, and did it name a driver". Read by js/segments.js and surfaced as Top Line ▸ Segments
// ▸ "What management has said". `seg` is prose; segments.js maps it to the dataset key.
//
// FROZEN, not live. Every entry below is verbatim from the Q2 2026 earnings call (Aug 5, 2026),
// retrieved through Quartr in Sep 2026 and written into the repo — the portal makes no runtime
// call to Quartr. The same remarks are in the company's own webcast replay and transcript at
// ir.sharkninja.com. See js/overviews/sharkninja-quartr.js for the retrieval pass.
//
// Only one call has been mined so far, so every theme currently carries a single Q2 2026
// update. That is a gap to fill by working backwards through 3Q23-1Q26, not a defect in the
// shape — themes accumulate quarters as they are read.

export var SN_THEMES = [
  {
    seg: 'SharkNinja', theme: 'Durability of double-digit growth',
    st: { k: 'trend', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'The central bear question — whether a $6.4Bn business can keep compounding double-digit in a market that is not growing. Management met it head-on rather than around it, and gave the arithmetic to test.',
    updates: [
      { q: 'Q2 2026', items: [
        'Barrocas named the skepticism himself: "When some investors ask me about SharkNinja\'s growth, I can sense some skepticism. It\'s hard to believe that <b>double-digit growth in a business our size in a market that isn\'t growing much can be durable</b>."',
        'The arithmetic offered in reply: "On average, over the last three years, our existing categories typically grow <b>mid-to-high single digits</b>. Layer on international expansion, layer on new category launches, add those three together. You can get a double-digit growth profile." — testable against the category cut in Other.',
        '13th consecutive quarter of double-digit net sales growth, accelerating to <b>+22.2%</b>, the fastest since 4Q24.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'The core vs the viral launches',
    st: { k: 'trend', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'The most misunderstood part of the business, per management: the products that make the brand famous are a small share of growth, and the base business is what actually compounds.',
    updates: [
      { q: 'Q2 2026', items: [
        'On where the R&D actually goes: "<b>Roughly 20 of the 25 new products we launch each year go into existing categories.</b> That\'s deliberate. A vibrant, healthy base business is what powers everything else we do at SharkNinja."',
        'On the framing: "I don\'t think about our core and our new categories as two separate stories. They\'re the <b>same story told at different stages</b>… our newest categories will eventually mature into core, the same way things like Ninja CREAMi have."',
        'On identity: "SharkNinja is <b>not a cleaning company or a kitchen appliances company</b>. We\'re a consumer problem-solving company… Every category we\'ve ever entered started the same way. Not with a product we wanted to create, but with a problem we noticed."',
        'Ninja CREAMi cited as the worked example of a 2021 launch that matured into a scaled global franchise with revenue from over 30 countries.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'International — transition complete',
    st: { k: 'trend', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'The multi-year distributor-to-direct conversion and the DTC re-platforming both finished in 2Q26. That removes a drag and, on management\'s account, unlocks focus — worth auditing against international growth from 3Q26.',
    updates: [
      { q: 'Q2 2026', items: [
        '"Importantly, we\'re <b>now done for the foreseeable future with these distributor conversions</b>, laying the groundwork for future growth. We\'ve also finished the rollout of our new direct-to-consumer platform across our major international markets." Italy and Spain were the last two.',
        'On how much runway is left: "A year ago, SharkNinja participated in a <b>low double-digit number of categories</b> in each market [France and Germany]. Today, that number is <b>up over 50%</b>… Even with the expansion, we estimate that we\'re still <b>less than 10% penetrated</b> on an overall category basis across EMEA today."',
        'International net sales <b>+36.6%</b> in the quarter, led by the UK (+18.7% to $255M), Europe and Latin America.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Social commerce as a new front door',
    st: { k: 'watch', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'Management frames TikTok Shop not as a place to sell viral products but as an acquisition channel for the OLDEST categories — and the CFO confirmed it carries a structurally higher gross margin. A margin tailwind that has not yet shown up in reported numbers.',
    updates: [
      { q: 'Q2 2026', items: [
        '"At the end of the quarter, we were live with <b>TikTok Shop in seven countries, compared to zero</b> in the year ago period… In the case of Germany, within weeks, our sales volume in this channel started to reach levels that took us months to achieve in the U.S. and U.K." Goal of more than doubling the country count by holiday 2026; 13 referenced for Q4.',
        'The counter-intuitive part: the Ninja NeverDull cutlery system — a category sold for almost five years — became a top-three seller in the channel in the US, reaching a younger buyer than usual.',
        'Quigley on the margin consequence: "DTC, TikTok Shop, overall social commerce <b>does come at a higher structural gross margin</b>… And then as we scale that business, we start to see overall benefits across our distribution network, across customer service."',
        'Barrocas declined to size it: "<b>We don\'t break out the percentage of our D2C business</b>" — but expects DTC and affiliates to grow faster than the rest of the business through the end of 2027.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Operating leverage',
    st: { k: 'trend', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'The stated profitability goal is adjusted EBITDA growing faster than net sales. Tariff annualization broke that in 2Q26 at the EBITDA line even as opex leverage held — worth tracking which one gives first.',
    updates: [
      { q: 'Q2 2026', items: [
        'Quigley: "SharkNinja has now driven <b>leverage on adjusted operating expense as a percentage of net sales for five quarters in a row</b>." Adjusted opex 35.6% of net sales vs 36.0% a year ago.',
        'But adjusted EBITDA grew <b>+18.6%</b> against net sales <b>+22.2%</b> — profitability growth trailed sales growth in the quarter, which management attributed to the annualization of 2025 tariffs, while reaffirming EBITDA ahead of sales for the full year.',
        'Adjusted EPS <b>+29.9%</b>, marking growth above 23% in 11 of the last 12 quarters.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'AI — "Jailbreak SharkNinja"',
    st: { k: 'watch', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'Unusually concrete for a consumer company: named partners, a stated operating cadence, and a specific cost claim for 2027. All of it is promise rather than result so far — the audit is whether opex actually leverages next year.',
    updates: [
      { q: 'Q2 2026', items: [
        'On how it is run: "<b>The concept of a six to nine-month project no longer exists at SharkNinja.</b> If we don\'t see tangible progress on an initiative every two weeks, resources are reallocated elsewhere." Eight big-bet and 20 quick-win projects, reviewed on a two-week cycle.',
        'Named partners: <b>Palantir</b> for promotions and pricing optimization (phase one live, phase two a four-month build, benefits expected in Q4 US/UK/Germany/France) and <b>AWS</b> for media optimization, going live end-September and scaling in 2027.',
        'The cost claim to audit: "I think you\'re going to see us be able to really <b>leverage compensation in a big way in 2027</b>… we\'re going to continue to be able to keep growing the business on <b>roughly flat headcount</b>."',
        'Also used in consumer insight: AI lifted the capture rate of organic social content from under 20% (hashtag-only) to 60%+ across the full ecosystem.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Retail relationships & channel inventory',
    st: { k: 'watch', since: 'Q2 2026', last: 'Q2 2026' },
    why: 'Shipments ran below POS in 2Q26 on Prime Day timing. Management reads retailer inventory as too LOW rather than too high — a sell-in tailwind into Q4 if it is right, and a warning sign if it is not.',
    updates: [
      { q: 'Q2 2026', items: [
        'Barrocas: "if anything, I think <b>retailers could take a bit more inventory</b>. Not that they\'re consciously working down their inventory, but I think there\'s a lot of demand to capture. We will at least push for inventory levels to grow as we head into Q4."',
        'Quigley on the gap: POS outpaced shipments in the quarter on Prime Day timing, expected to normalize in the back half; retailer inventory described as "extremely healthy."',
        'On earning new doors: "We never sold any products other than hair care and skin care to <b>Ulta</b>, and we showed them our Shark ChillPill, and they said this would be an amazing product for them to add to their assortment." Walmart end caps and Target colorway promotions cited alongside.',
        'US shipments <b>+18%</b> with POS higher still; Canada <b>−17%</b> on the remaining transition, expected to grow in the back half.',
      ] },
    ],
  },
];
