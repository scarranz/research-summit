// themes-data/sn.js — the SharkNinja theme record.
//
// Same contract as themes-data/amzn.js: the curated answer to "what has management actually
// said, and did it name a driver". Read by js/segments.js and surfaced as Top Line ▸ Segments
// ▸ "What management has said". `seg` is prose; segments.js maps it to the dataset key.
//
// FROZEN, not live. Every entry below comes from SharkNinja's own earnings calls, Q2 2023 (the
// first call as a public company) through Q2 2026 — thirteen calls, each read in full (prepared
// remarks and Q&A), retrieved through Quartr in Sep 2026 and written into the repo. The portal
// makes no runtime call to Quartr; the same remarks are in the company's webcast replays at
// ir.sharkninja.com. `src` on each update is the Quartr event, a convenience link — the authority
// is the call itself. See js/overviews/sharkninja-quartr.js for the retrieval pass.
//
// Anything inside quotation marks is verbatim (trimmed with "…", never reworded); it was
// string-matched against the transcript paragraph it came from. Transcript quirks worth knowing
// when reading back: the CFO seat changed hands — Larry Flynn (interim, 2023 to Q1 2024), Patraic
// Reagan (Q1 2024 to Q2 2025; transcripts misspell him three ways), Adam Quigley (Q3 2025 on); the
// operator on the Q4 2023 call calls it "Fourth Quarter 2024"; and the first Q&A answer on the Q4
// 2025 call is garbled in the transcript, so nothing is quoted from it.
//
// Updates run oldest → newest within each theme. A theme carries a quarter only when that call
// said something that named a driver — so AI starts in Q4 2025, and Pricing and Capital
// allocation skip the quarters where they were not discussed.

export var SN_THEMES = [
  {
    seg: 'SharkNinja', theme: 'Durability of double-digit growth',
    st: { k: 'trend', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'The central bear question — whether a $6.4Bn business can keep compounding double-digit in a market that is not growing. Management met it head-on rather than around it, and gave the arithmetic to test.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'The base rate management anchors on: "...a compound annual growth rate of <b>20%</b> over the last 15 years. We have delivered growth in 14 out of these 15 years, and this growth has been organic." (Barrocas) - organic-only is the claim to hold them to.',
        'Runway framed as penetration: "We estimate our current total global addressable market is above <b>$100 billion</b> and continues to grow. With net sales approaching $4 billion, our market penetration rate is still relatively low." (Barrocas)',
        'Asked whether double digits can persist when the category grows low single digits, Flynn <b>declined to give a long-term algo</b>: "...not something that we\'re necessarily commenting on, you know, at this point in time." FY23 guide was adj. net sales +10-12%.',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        'Guide raised on visibility, not just the quarter: "...we have good visibility for demand through the end of the year." Adj. net sales now <b>+12.5%-13.5%</b> (from 10%-12%). (Barrocas)',
        'What is carrying growth: "...our business is being driven by, you know, <b>higher ASP items</b>, you know, some of the more innovative products, some of the more media-driven products." (Barrocas)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'The first category build behind a guide (FY24 adj. net sales +7-9%): "...cleaning and cooking up, low, kind of mid-single digits, food prep, kind of mid-teens, and then kind of other, you know, which encompasses beauty and, and home environment as kind of <b>high teens</b>." (Flynn)',
        'Market assumption: after "two years now of market declines in 2022 and 2023", "our assumption for our guidance kind of assumes a <b>flat overall market</b>". (Barrocas) - growth is all share, launches and international.',
        'Asked what \'normal\' growth is, Flynn offered the single-digit guide as the frame: "...the 7-9% top line and, you know, probably not a, <b>not a bad template</b>, you know, kind of, as we look forward." - the bar is below double digits here.',
        'Phasing: "Q1 and Q2, you know, based in our guide, is kind of <b>low double digit</b> in the first two quarters of the year" - so the 7-9% year implies a clearly slower H2. (Flynn)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas split North America <b>+22%</b> into four drivers: a firmed core ("our core base business was healthy in the quarter"), compounding 2022/23 launches, new doors (Sephora, Ulta, Bass Pro, Dick\'s online) and replenishment after a strong Q4 - only the last is non-recurring.',
        'Barrocas: "we estimate our market penetration today is <b>less than 4%</b> of this total addressable market" - on ~$4.5B LTM sales against a TAM he puts close to $120B; the runway claim under the growth story.',
        'Guide raised to adj. net sales +12-14% (from +7-9%) on Q1 and Q2 visibility only; Barrocas: "we didn\'t, you know, touch our guidance significantly for the second half of the year…We\'re taking a <b>conservative position</b>."',
        'The base-market assumption, Barrocas: "Our outlook is that we think the industry will get back to <b>flat in the second half</b> of the year" - after calling the market down low single digits in Q1; growth above that is share.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Reagan on the raised guide (adj. net sales +22-24%, from +12-14%): H2 is "kind of the <b>mid- to high-mid-teens growth</b> over Q3 and Q4" - the deceleration path from +38% in Q2.',
        'Barrocas: "Our overall domestic business accelerated, growing an incredible 35%, and this performance was even more remarkable, considering the domestic market was <b>relatively flat</b>." - the growth is share, not market.',
        'Asked what in US growth is one-off, Barrocas: "I wouldn\'t necessarily say there\'s kind of <b>one time</b>" - base share gains, new categories at scale (extractors, FlexBreeze) and new retailers (sporting goods, grocery barely started).',
        'Macro, Barrocas: retailers are cautious, but "So I\'m not necessarily right now, Brooke, seeing <b>any slowdown</b>." - retailers ran out of stock on many SKUs by early December 2023.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Reagan\'s first 2025 frame: 2024 adds "over $1 billion in adjusted net sales and over $200 million in adjusted EBITDA year-over-year. This sets a <b>high bar</b> for us as we plan for 2025." - planning called prudent and measured.',
        'Barrocas: "Our market that we\'re in is kind of <b>flat to down a little bit</b>. So we\'re taking massive share growth" - Q2 +38%, Q3 +35% all from share, new categories and international.',
        'The 2025 bridge, Barrocas: "we launched <b>15 new products</b> just in the third quarter. A lot of that revenue is not going to hit in 2024."',
        'Q4 implied ~15% at the midpoint (analyst math) despite solid demand; Barrocas: hit products "SLUSHi, CRISPi, Luxe Café, are going to be <b>constrained from an inventory perspective</b>" - plus UK launches deferred and the Mexico transition.',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'Asked what a normal year looks like on a $5.5bn base, Barrocas: "we\'ve said that we believe that we are a <b>long-term double-digit growth company</b>" - yet the opening 2025 guide was net sales +10%-12%, after 2024 finished at +32% against a much lower initial guide.',
        'The split behind the guide (attributed to Barrocas in the transcript): "from a domestic business, you know, we\'re thinking and we\'re guiding in the <b>high single digit range</b>. From an international standpoint, roughly high teens" - i.e. a 2x international-vs-domestic growth arithmetic.',
        'The market assumption underneath: "I think we\'re assuming kind of a base case that <b>market is flat</b>" - so all of the guide has to come from share gains, new categories and new countries.',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Share, not market: "Net sales increased nearly 15% year over year globally <b>in a market that is not delivering much growth</b>, a reflection of demonstrable market share gains" (Barrocas) - eighth straight quarter of double-digit growth; FY guide raised to +11%-13%.',
        'Barrocas on why U.S. demand held: no pull-forward, "our products have an <b>average sell price of $199-$229</b>" - while the guide bakes in some North America revenue disruption from out-of-stocks on China-made products.',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'The share claim quantified: "our data indicates the end markets we participate in globally <b>declined in the low single-digit range</b> year-over-year when excluding SharkNinja\'s performance" (Barrocas, H1 2025) - while net sales grew ~16% in Q2.',
        'Domestic Q2 against the market: "when you remove SharkNinja\'s numbers, the market was down kind of mid, almost <b>mid to high single digits</b> in the second quarter" (Barrocas).',
        'FY guide raised again to +13%-15%, but "I think we\'ve <b>guided ourselves conservatively in the back half</b>" with H2 price increases whose demand effect is still to be seen (Barrocas).',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Growth is share, not market: Barrocas: "While our data indicates the total U.S. market that we participate in declined slightly year over year, excluding SharkNinja\'s performance, our own POS grew in the <b>low double digits</b>. The outperformance expanded in the last four weeks exiting the quarter, with our POS reaching mid-teens growth as the market weakened further" -- the gap to the category is the thing to track in Circana.',
        'Exit-rate commitment: Quigley: "For the fourth quarter of 2025, we expect our net sales growth to be <b>around 16%</b> year-over-year." -- an acceleration from Q3\'s +14.3% into a market management itself describes as declining; auditable in the Q4 print.',
        'Asked directly whether double-digit is a reasonable 2026 expectation, no commitment: Quigley: "We are not in a position right now to give <b>any guidance on 2026</b>." -- the double-digit claim was left as a track record, not a target, at this point.',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'Backdrop quantified: Barrocas: "the total U.S. market that we participate in declined in the <b>low single digits</b> year-over-year for the full year 2025, excluding SharkNinja\'s performance. Q4 was even more challenging for the industry, with <b>mid-single-digit declines</b>" -- Q4 domestic still +15.7%.',
        'The 2026 guide steps down, with a reason: Quigley: "cognizant of the tariff-related headwinds that are now fully manifesting in the P&L" ... "we expect our net sales to increase between <b>10% and 11%</b>" -- vs +15.7% in 2025.',
        'U.S. target restated after an audio failure garbled the original answer: Barrocas: "I think the U.S. should continue to grow at <b>double digits</b>."',
        'No macro tailwind assumed: Barrocas: "I would say the consumer is gonna be kind of expected to be <b>flat to where we were last year</b> in general."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Market still shrinking: Barrocas: "the U.S. market declined in the <b>low single-digit to mid-single-digit range across all four of our major categories</b> in Q1, according to Circana."',
        'Guide raised one quarter in: Quigley: "we now expect net sales to increase between <b>11.5% and 12.5%</b> compared to our prior guidance of a 10%-11% increase."',
        'The domestic formula, stated plainly: Barrocas: "the key building blocks for domestic growth are <b>a strong base business and layering on new innovation</b> on top of that."',
      ] },
      { q: 'Q2 2026', items: [
        'Barrocas named the skepticism himself: "When some investors ask me about SharkNinja\'s growth, I can sense some skepticism. It\'s hard to believe that <b>double-digit growth in a business our size in a market that isn\'t growing much can be durable</b>."',
        'The arithmetic offered in reply: "On average, over the last three years, our existing categories typically grow <b>mid-to-high single digits</b>. Layer on international expansion, layer on new category launches, add those three together. You can get a double-digit growth profile." — testable against the category cut in Other.',
        '13th consecutive quarter of double-digit net sales growth, accelerating to <b>+22.2%</b>, the fastest since 4Q24.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'The core vs the viral launches',
    st: { k: 'trend', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'The most misunderstood part of the business, per management: the products that make the brand famous are a small share of growth, and the base business is what actually compounds.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'The launch cadence to audit: "On an annual basis, we aim to launch more than <b>20 new products</b> across existing and new categories." (Barrocas)',
        'Category creation, not just share: CREAMi "quickly became the number one selling ice cream maker in the U.S., while also <b>doubling the entire category size</b>." (Barrocas)',
        'The core was flat while launches carried the quarter: cleaning "increased slightly to $414" (mix <b>53% to 44%</b>) as "Growth in the multi-floor care subcategory was partially offset by softness in the North America market, specifically in corded vacuums, as consumers shifted towards cordless." (Flynn) Cooking & beverage +68% on the U.K. and a first full quarter of outdoor grills.',
        'Thirsti is a different model - a razor/blade: "...a really exciting new category that is <b>very much consumable-led</b>." (Barrocas) - drink pods and CO2 canisters bought repeatedly.',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        '"We launched <b>four new subcategories</b> of products in 2023 that have runway for expansion moving forward." (Barrocas) - outdoor oven, Thirsti carbonation, carpet extraction, wet/dry (Mess Master).',
        'Launch ramp - a lag to model: products launched in Q3 "we won\'t kind of see, you know, full momentum until we get into <b>next year\'s holiday season</b>." (Barrocas) "...it kind of takes a year for us to really get to the place where the product has strong momentum behind it."',
        'Core cleaning shipments -9% while Other tripled; a falsifiable call: "Given our POS performance and our recent launch into the extraction category, we expect our fourth quarter growth in shipments in the cleaning category to <b>improve</b>." (Flynn)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'Most launches refresh the core: "Of the approximately 20-25 new products that we launch annually, about <b>80%</b> of them are within existing categories" - 25 in 2023, 20 of them in existing categories. (Barrocas)',
        '"If you look back over the last four years, we added <b>14 new subcategories</b>." (Barrocas)',
        'Q3\'s cleaning call delivered: "...significant sequential improvement relative to the third quarter decline of 9%" (Q4 <b>-3%</b>), robotic vacuums "up slightly", carpet extraction strong. (Flynn)',
        'Next front is outdoors: "...our entry into <b>two new billion-dollar subcategories</b> for the outdoors" - Shark FlexBreeze fan and Ninja FrostVault cooler. (Barrocas)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas on cadence: "Each year, we launch around <b>25 new products</b>, including 20 of those within existing categories." - 80% of launches refresh the core; the upgrade-cycle mechanism behind share gains.',
        'Barrocas: "the Shark brand and the Ninja brand will each launch into <b>at least one new product category a year</b>" - the falsifiable new-category commitment (18 subcategories entered since 2021, 33 in total).',
        'Core health check, Barrocas: "if you strip out kind of the impact of extractor, and you kind of look at our total global vacuum business, it was <b>up a few percent</b>" - in a market he called down; Q1 cleaning +6% leaned on the new carpet-extraction launch.',
        'Barrocas on consumables beyond Thirsti pods: "we\'re getting a very, very <b>high attach rate</b> in our carpet cleaners and stain cleaners with our proprietary chemicals" - recurring revenue riding the 2023 launches; not quantified.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Barrocas: "obviously the <b>lion\'s share</b> of the revenue was driven by existing products" - 2024 launches are still small; FlexBreeze tracking ~$50M vs the ~$40M flagged earlier.',
        'Cleaning (40%+ of 2023 sales) accelerated to +20% from +6% in Q1 and -5% in FY23; Barrocas: "core subcategories such as <b>uprights and cordless stick vacuums</b> performed particularly well" - the core, not the launches, carried the quarter.',
        'Barrocas: "we\'re on track to launch 25 new products this year, with <b>more than 80%</b> of the launches in existing categories" - while subcategories rose to 34 from 27 at end-2022.',
        'SLUSHi outran supply, Barrocas: "we right now have a wait list of <b>100,000 units</b> on that product"; the demand is not lost but "temporarily moved", caught up only in Q1 2025.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas: "We remain committed to entering at least <b>two new subcategories annually</b>. In 2024, we have exceeded that goal with entry into four new subcategories" - coolers, fans, frozen drinks, skincare.',
        'Barrocas: "what\'s encouraging, Megan, more than anything, is the <b>hit rate of the innovation is increasing</b>" - credited to pre-launch price, feature and marketing testing; a claim to audit launch by launch.',
        'The core keeps pace, Barrocas: "our innovation is helping us regain strength in the cleaning category. Adjusted net sales in cleaning grew <b>19%</b> in the quarter." - PowerDetect across robots, cordless and corded.',
        'Launches maturing into base, Barrocas: 2023 subcategories (carpet, shop vac, outdoor oven, in-home beverage) keep growing "<b>as we annualize the launches</b>, enter new markets, and additional channels".',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'The launch cadence as a commitment: "We\'re committed to entering <b>at least two new subcategories each year</b>. In 2024, we exceeded this goal by launching into four new subcategories: coolers, fans, frozen drink appliances, and skincare" - with 25 new products planned for 2025 (Barrocas).',
        'Barrocas on the base: "our base business remains strong, with healthy revenue, <b>stable average selling prices</b>, and solid gross margins" - cleaning, the largest core category, grew ~20% in Q4.',
        'Why 2024 launches are a 2025 driver: "It will generally take on some of these new products about <b>12 months before we scale them globally</b>" - SLUSHi does not reach Europe and the U.K. until Q2, full rollout Q3 (Barrocas).',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Category mix in Q1 per Reagan: food prep +45% on SLUSHi and Swirl, while cleaning +5% - "<b>corded and robotic vacuums lagged</b> a bit" - and cooking +5% against a tough U.K. air fryer compare.',
        'Innovation inside an existing hit: on Swirl, "we\'re actually seeing scores of <b>existing Creami owners interested in upgrading</b> to Swirl" (Barrocas) - the upgrade-cycle mechanism for categories that mature into core.',
        'Barrocas sizes FlexFlame\'s market: "We can\'t wait to see what we\'re able to accomplish in this <b>$5 billion-plus global market</b>" - calling it "the most disruptive product in years" in a category with little newness.',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'The launch split, stated: "<b>Nearly 20 of the 25 new products</b> per year come within existing categories to support the core business" (Barrocas).',
        'Viral hits into franchises: "SLUSHi and Lux Café are great examples of how we\'re <b>transforming products into franchises</b>" - assortments across price points and sizes, the path of "new categories that eventually transition into existing categories" (Barrocas).',
        'The concentration: food prep +53% on SLUSHi and CREAMi, while cooking & beverage fell 4% as Luxe Cafe was "offset by our <b>air fryer and outdoor grill subcategories</b>, mostly related to lapping a strong second quarter of 2024" (Reagan).',
        'Core reinvention in air fryers: with CRISPi "we\'re capturing new consumers into the market and even seeing <b>existing consumers retiring their legacy air fryers</b> to upgrade" (Barrocas).',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'A shift in where innovation lands: Barrocas: "The innovation is coming not just from new categories and kind of home-run new ideas, but it\'s coming from reinventing the base. I think as we go into 2026, I think we\'re going to see an <b>increasingly larger amount of new products coming from reinventing the base</b>." -- falsifiable against the 2026 launch list.',
        'The mechanism named for the core (StainForce, Blend Boss, Crispi Pro): Barrocas: "we believe we\'re delivering compelling newness to help <b>accelerate the replacement cycle</b> across these core franchises."',
        'The count to audit: Barrocas: "We\'re now officially in <b>38 subcategories</b> with the Q3 launch of Ninja Fireside360" -- and the 2025 roadmap of 25 new products was reaffirmed despite the tariff-driven supply disruption.',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'A cadence to audit: Barrocas: "In 2025, we met our goal of entering two additional subcategories, finishing the year at <b>38</b>" ... "We plan to add <b>two more categories</b> to our portfolio in 2026"',
        'A launch maturing into core, and the base getting its turn: Barrocas: "we\'ve created the <b>best-selling espresso SKU in the United States in under one year</b>." ... "In 2026, we plan to introduce breakthrough innovations across several legacy categories, including corded uprights and traditional blending"',
        'A viral category holding up after the peak: Quigley: "Our <b>overall air fryer sales increased in 2025</b>, despite the tough comparables in the U.K."',
        'How new categories are built -- capability first, then a family of products: Barrocas: "By <b>investing in propane expertise</b>, we successfully paved the way to launch the Ninja FlexFlame and Ninja Fireside 360, creating a foundation for future innovation."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Cadence check: Barrocas: BlastBoss "represents a new subcategory for SharkNinja, taking our total to <b>39</b>. We remain on track to enter another new subcategory in 2026, in line with our goal of <b>adding two per year</b>."',
        'The cost of a viral launch shows up a year later: food prep -3.3%, and Quigley: "Strong growth in our blending franchise was offset by <b>lapping a particularly large quarter of sell-in of our frozen treats</b> business in Q1 2025."',
        'Core carrying the quarter: cleaning +17%, and Quigley: "<b>Corded uprights, the largest subcategory in the company</b>, performed well, as did our carpet extraction business."',
        '2H base refresh named: Barrocas: "We have new products coming out in <b>upright vacuums and cordless vacuums</b>. We\'re <b>reinventing our whole blender category</b> in the second half of this year"',
      ] },
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
    st: { k: 'trend', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'The multi-year distributor-to-direct conversion and the DTC re-platforming both finished in 2Q26. That removes a drag and, on management\'s account, unlocks focus — worth auditing against international growth from 3Q26.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'The distributor-to-direct template: "We pivoted in the U.K. from a distributor model to a direct SharkNinja operation in 2014... Since then, we have grown our U.K. business <b>tenfold</b>, from $50 million to nearly 500 million in net sales last year." (Barrocas)',
        'Where the model is direct today: "...the U.S., Canada, U.K., Germany, France, Italy, and Spain, where we operate directly, and the remaining markets where we sell through distributors." (Barrocas) - <b>26 markets</b> in total.',
        'Two levers named for Europe (+80% in the quarter): "...deeper penetration in new markets, you know, like <b>Germany and France</b>, as well as just, you know, expanding into more product categories, in those markets as well." (Barrocas)',
        'Why the playbook ports: "...probably <b>80%</b> of the products that we\'re developing today are products that we\'re developing for a global consumer." (Barrocas)',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        'Category penetration gap as the runway: "...although we\'re in 31 product categories in North America, you know, we\'re still only in <b>18, 19 categories</b> in the U.K.." (Barrocas)',
        'Continental Europe is earlier still: "...in Germany and France, we\'re in, you know, <b>seven to eight product categories</b>, but we\'ve got, you know, 15-17 more that we think are very applicable to launch into those markets over the coming years." (Barrocas)',
        'International adj. net sales <b>+80%</b>, the strongest driver; "In Italy, Spain, and Latin America, we\'re in the early stages of establishing our presence." (Barrocas)',
        'The cost of entry: "...we\'re starting from a low point. You know, we\'ve got to <b>invest a lot</b> to really become a brand of choice and notoriety in the market." (Barrocas)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'FY23 international adj. net sales $1.1B (+66%): "U.K., which is our largest international market, grew nearly 60%, while markets like Germany, France, and Latin America, which are newer, grew at impressive <b>triple-digit rates</b>. We ended the year with presence in 32 countries, up from 26..." (Barrocas)',
        'The sizing claim: Germany and France "relatively similar in terms of size and scope to the U.K. market, with the long-term potential for <b>Germany to be even bigger</b> than the U.K. market for us." International "can be as large as, if not larger than, the U.S. over the long term." (Barrocas)',
        'What changed versus the U.K. entry: local insight - "we have <b>consumer insights teams</b> in Germany and France, we\'re in Italy, we\'re in Spain, we\'re in Mexico." (Barrocas)',
        'Pan-European retailers pull expansion: "...we might sell them in Germany, but they\'re driving us to sell them in <b>Poland and Turkey</b> and elsewhere." (Barrocas)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Category penetration abroad, Barrocas: in the UK "we\'re in about <b>20 of our 33 categories</b>", while Germany and France "for the most part, are really selling about 10 product categories" - the runway is category rollout, not only doors.',
        'Barrocas: "we believe our international business could <b>exceed our U.S. business</b> over the long term" - international was 31% of Q1 sales (adj. +42%; Germany, France and LatAm triple-digit; UK +15% on a +73% comp).',
        'The cost of the build-out, Barrocas: "in the first half of this year, you know, you\'re gonna see some <b>G&A investment</b> that is gonna be directly attributable to, EMEA expansion, Latin America expansion" - offices in London/Frankfurt/Paris with many open roles, in-store demonstrators expanded.',
        'Next markets, Barrocas: "In the second half of the year, you\'ll see a much bigger launch into the <b>Middle East</b>." LatAm led by beauty, with Ninja being pushed in behind it.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Sizing, Barrocas: "Our business in the U.K. this year will be <b>over $1 billion</b>." and "We believe that the German market could be over $1 billion." - France slightly under; both still triple-digit growth.',
        'Barrocas: "lots of these retailers in Europe are cross-border, which is driving our expansion <b>faster than we anticipated</b> into other markets in Europe." - Euronics pulling entry into Poland, Currys/Elkjop into the Nordics in H2.',
        'Distributor-to-direct, Barrocas: "We\'re also taking back our distributor in Mexico, starting <b>January 1st</b>." Brazil launches in Q4 through a distributor, but SharkNinja runs the advertising.',
        'Mix, Barrocas: international +46%, and "the majority of that growth, was driven by <b>outside of the U.K.</b>" - UK +7% on a +70% comp.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Reagan on distributor-market economics: "we split our profit model with our distributor. They take margin. We take a little bit less margin than we have in our other EMEA markets, but we have <b>very little operating expense</b>" - EBITDA roughly in line; UK highest margin, Germany/France still building.',
        'UK +6% on a +65% comp with its air fryer market down sharply; Barrocas: "we\'ve consciously moved some of our <b>U.K. product launches to the first half of 2025</b>" to supply North America.',
        'Mexico goes direct, Reagan: "We will experience a <b>transition period</b> as we shift away from our existing distributor and go direct." - small temporary hit in Q4 and early Q1; Brazil entered in September.',
        'Barrocas: "we\'re entering our first, what I would call, really <b>massive-scaled holiday season</b> in Germany and France" - with the upfront investment that required; international +62%.',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'Reagan: international net sales grew 49% "driven by <b>triple-digit growth in Germany and France</b>"; Barrocas frames continental Europe as still early, naming Spain, Poland, Benelux and the Nordics next.',
        'Mexico goes distributor-to-direct in Q1: "we are repurchasing distributor inventory, which triggers a <b>one-time revenue reversal</b>" - a Q1 headwind, with growth and margin expected from Q2 (Reagan).',
        'The size of the prize Reagan put on it (without quantifying the Q1 hit): "we see, you know, our opportunity in Mexico to be <b>at least $400 million</b> over the course of the next few years or so."',
        'U.K., the largest international market, was deliberately starved in Q4/Q1: "an intentional shift in our innovation cycle, <b>prioritizing North America</b>", with Q2 launches expected to drive a rebound (Barrocas) - auditable next quarter.',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'International +14% with both flagged headwinds landing: U.K. Easter shift and the Mexico repurchase, which "landed <b>almost entirely in Q1</b>, so we expect the Mexico business to grow once again for the remainder of the year" (Barrocas).',
        'Underlying rate ex the U.K.: "our international business outside of our <b>U.K. air fryer business</b> grew significantly across all regions, with particular strength in Central Europe" (Reagan).',
        'Tariffs re-route launches: "Products that were originally going to launch first in the U.S. this year are now going to <b>initially launch in other markets</b>" - LATAM and EMEA absorb capacity built for the U.S. (Barrocas).',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'Runway in one number: "we\'re in <b>37 different categories in the U.S.</b>, but in fast-growing countries like France and Germany, that number is only roughly 10 today" (Barrocas).',
        'Diversification test in the U.K.: "Despite an approximately <b>25% year-over-year decline in air fryers</b>, the largest category in the U.K., our net sales in this geography still grew"; next distributor-to-direct conversions: Benelux, Poland, the Nordics, with more in 2026 (Barrocas).',
        'The long-range target: the Global Growth High Impact Initiative is "focusing on how do we drive <b>50% of our sales outside of the U.S.</b>" - "I don\'t know that we get there in 2026" (Barrocas); Italy named as a future direct market.',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Lesson from the Mexico conversion: Barrocas: "I think the biggest learning was <b>not to approach these things from a big bang perspective</b>, that in each market, likely there is a role for a distributor." -- the hybrid model (direct with the few large retailers, distributor for the long tail) named for Spain, the Nordics, Poland, Italy and parts of South America.',
        'The stated destination: Barrocas: "we\'re very focused on the path to getting to <b>50% of our business outside of the U.S.</b>" -- and "our business in Germany, just because of the market size, will ultimately be bigger than the U.K."',
        'U.K. re-acceleration with a named cause: Barrocas: "a dramatic re-acceleration to <b>27%</b> year-over-year net sales growth compared to roughly 6% in the prior quarter" ... "The air fryer headwind we\'ve observed throughout 2025 in the U.K. has started to diminish."',
        'The binding constraint abroad is marketing, not supply: Barrocas: "Supply chain is a component of it, but I almost see <b>marketing as an equal or bigger component</b> of it." ... "I don\'t want to make the mistake of pushing too far too fast."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'Three more conversions done, two queued: Barrocas: "In Q4, we successfully transitioned to direct operating businesses in the <b>Nordics, Poland, and Benelux</b>, while preparing to convert <b>Italy and Spain</b> in the first half of 2026. In each case, we\'ve established a hybrid model"',
        'Disruption pre-announced with an end date: Barrocas: "In Q1, you know, there\'s some disruption as it relates to the movement of Spain and Italy." ... "By the <b>end of Q2</b>, we\'re still on track to kind of have a normalized business moving forward."',
        'Diversification absorbing a category decline: Quigley: "Even while air fryers, our single largest category in the U.K., declined throughout 2025, the rest of our portfolio of categories more than offset the headwind" ... international "grew <b>23.2%</b> in the second half of 2025, compared with 17.3% in the first half."',
        'LatAm spillover as the mechanism behind PriceSmart and the Mercado Libre expansion: Barrocas: "demand is being generated throughout Latin America by the, you know, social media and the demand generation that\'s happening in Mexico that\'s <b>spilling over into these other markets</b>."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'An unofficial run-rate after +31.6% in Q1: Quigley: "we feel, you know, very strong that international growth will remain in the <b>low 20s%</b>, right? Not official guidance"',
        'Last conversions cost Q1: Barrocas: "we\'re in the midst right now of transitioning <b>Italy and Spain</b> from a distributor market to a direct market, so we <b>took a bit of a hit in that in Q1</b>." ... "we\'ve now transitioned all the major markets that we wanna transition to direct."',
        'Spillover as the entry mechanism (South Africa launched the week of the call): Barrocas: "All of that media, <b>English language media that\'s generated in the U.S. and the U.K. spills over</b> into places like South Africa."',
        'Most mature market re-accelerating: Quigley: "net sales <b>up 18%</b> year-over-year to $220 million. This strong result underscores the power of the category diversification strategy that we intend to utilize across our global markets."',
      ] },
      { q: 'Q2 2026', items: [
        '"Importantly, we\'re <b>now done for the foreseeable future with these distributor conversions</b>, laying the groundwork for future growth. We\'ve also finished the rollout of our new direct-to-consumer platform across our major international markets." Italy and Spain were the last two.',
        'On how much runway is left: "A year ago, SharkNinja participated in a <b>low double-digit number of categories</b> in each market [France and Germany]. Today, that number is <b>up over 50%</b>… Even with the expansion, we estimate that we\'re still <b>less than 10% penetrated</b> on an overall category basis across EMEA today."',
        'International net sales <b>+36.6%</b> in the quarter, led by the UK (+18.7% to $255M), Europe and Latin America.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Social commerce as a new front door',
    st: { k: 'watch', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'Management frames TikTok Shop not as a place to sell viral products but as an acquisition channel for the OLDEST categories — and the CFO confirmed it carries a structurally higher gross margin. A margin tailwind that has not yet shown up in reported numbers.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'Organic social as demand creation: "...our Ninja CREAMi product that has nearly <b>800 million views on TikTok</b>. You know, our Shark FlexStyle with over 400 million views." (Barrocas) - credited with pulling in younger consumers.',
        '"Our direct-to-consumer business right now is the <b>fastest growing portion</b> of our overall business." (Barrocas) - and it caught demand retailers under-stocked: "...they are also turning to our direct-to-consumer channel, which is helping us as well."',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        '"Social media is a major focus of our advertising efforts." CREAMi "is fast approaching <b>1 billion views on TikTok</b>" (vs ~800 million in August). (Barrocas)',
        'DTC is where cross-sell is visible: "...we\'re continuing to see an uptick on our D2C business of consumers buying <b>more than one product</b> within an existing brand or buying products cross-brand." (Barrocas) - retail registrations too thin to see it there.',
        'DTC\'s cost sits in opex: part of the S&M rise "resulted from increased <b>delivery and distribution costs</b> driven by higher volumes, particularly in our direct-to-consumer business." (Flynn)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'Content is reused across markets: "...lots of social media that was run in <b>Mexico</b>, you know, how we\'re taking that content and leveraging it in Spain, and vice versa." (Barrocas)',
        'DTC mix is a named gross-margin driver: "...<b>D2C growing at a faster pace</b> than the rest of the business." (Flynn) - while its delivery costs keep lifting S&M.',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas on the FrostVault launch: "the business really drove through our <b>direct-to-consumer channels</b> and through some of our retail partners" - DTC and social content as the launch pad for a new category.',
        'DTC\'s cost line, Flynn: part of the S&M rise (20.1% of sales vs 17.8%) "resulted from increased <b>delivery and distribution costs</b> driven by higher volumes, particularly in our direct-to-consumer business" - DTC shipping sits in S&M, not COGS.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Barrocas: "Ninja SLUSHi became the <b>fastest-selling new product ever</b> during launch week on our direct-to-consumer site." - DTC as the launch channel; initial inventory sold out within days.',
        'Barrocas: "Ninja SLUSHi has already gone viral and is quickly becoming a <b>social media sensation</b>." - organic virality ahead of retail distribution later in the year.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas: the SLUSHi DTC waitlist peaked above 200,000 and "SLUSHi has garnered over <b>200 million impressions</b> on social media" - now co-marketed with ready-to-drink beverage brands to open grocery.',
        'Barrocas: "we\'re making other targeted strategic investments in a <b>new e-commerce platform</b>" - the DTC site experience needs to be better than today; replatform launches in 2025.',
        'Barrocas: DTC is "a really viable growth channel that will grow <b>even faster than our retail business</b> over the course of the next couple of years".',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'Barrocas: "DTC grew faster than the rest of the business in 2024. We expect that <b>DTC will grow faster than the rest of the business in 2025</b>."',
        'DTC as the launch window: "expect to see the <b>first 30 - 45 days</b> of many of these big, you know, viral product launches to be done through direct-to-consumer and then to expand out" - plus a move to Salesforce, live in North America end of Q3 2025, Europe likely Q1 2026 (Barrocas).',
        'The seeding mechanism replacing sell-through: the old rule of thumb was "we need to get <b>50-100,000 units</b> out of the market before we were able to get this kind of user-generated flywheel going"; CREAMi Swirl and CryoGlow did it pre-launch by seeding ~100 influencers (Barrocas).',
        'The $600m+ advertising line, decomposed by Barrocas into "a big chunk of lower funnel, there\'s a big chunk of upper funnel, and there\'s a big chunk of how do we start to create the <b>user-generated flywheel</b>" - no split given.',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'The installed-base/email file as a launch asset: Swirl launched "on a Tuesday morning at 9:00 A.M., and we were selling <b>a unit every eight seconds</b>" (Barrocas).',
        'The seeding playbook, specified: "We brought about <b>15, 20 really strong Creami influencers</b> behind the scenes. We let them use the product for 30 days" - a model working in the U.S., Canada and the U.K., still being tweaked for France, Germany and Mexico (Barrocas).',
        'Organic demand as pricing power: "The power of this organic demand allows us to <b>charge a premium</b> for these kinds of products without impacting overall sales trends" (Barrocas).',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'Unified DTC: "the consumer is going to land on a <b>SharkNinja website for the first time in our history</b>", enabling cross-sell and cross-brand loyalty; North America live Q4, international Q1 2026 (Barrocas).',
        'Early DTC signal: "Across our direct-to-consumer sites, we see <b>more repeat buying behavior and more cross-brand shopping</b> than ever before" (Barrocas).',
        'Content has to localize to scale abroad: "We\'ve got to develop it in the Spanish-speaking world. We\'ve got to develop it in French. We\'ve got to develop it in German" - the stated rationale for a <b>New York creative office</b> and global creative hires (Barrocas).',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'DTC re-platform (three domains consolidated into one sharkninja.com in October), with the claimed payoff: Barrocas: "we believe this can be an important driver of <b>traffic, conversion, and cross-selling</b> activity." ... "We will continue to roll out modernized DTC sites across Latin America and EMEA in the first half of 2026"',
        'The cost side of DTC shows up in G&A: Quigley: "The bulk of that increase relates to <b>higher merchant fees in our direct-to-consumer business</b>, driven by channel growth in EMEA."',
        'Localized creator network exported abroad: Barrocas: "We now have SharkNinja <b>content creators in these markets developing content every single day</b>." ... "The same playbook that we\'ve developed successfully in North America is now coming to the rest of the world."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'Audience growth, cited from a sell-side note: Barrocas: "SharkNinja reached three point nine million followers across Instagram and TikTok in 2025, reflecting a <b>119%</b> year-on-year growth, far outpacing peers who averaged just 8% growth"',
        'DTC re-platform claimed to be working, without numbers: Barrocas: "Our newly redesigned sharkninja.com is already delivering strong early results, with <b>higher engagement, improved conversion, and increased average order value</b>."',
        'Influencer buying moving to cross-border attribution: Barrocas: "we\'re now <b>tracking influencer content based on what countries view their content</b> and engage with their content."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Rollout milestone with a date: Barrocas: "When we come out of Q2, Randal, I mean, we\'re now gonna have the entire world on our new Salesforce platform. We\'re gonna have <b>TikTok Shop operating in seven countries</b>."',
        'The U.S./U.K. result is the stated basis for export: Barrocas: "Our success within TikTok Shop in the U.S. and the U.K. allows us to launch confidently in <b>Germany, France, Spain, and beyond</b>."',
        'Not disclosed, and the comp gets harder: Quigley: "we don\'t break out specifically, DTC and TikTok Shop overall." ... "those channels are growing at a faster rate, you know, than the overall domestic business" ... "we\'re <b>starting to annualize TikTok Shop</b>."',
        'Named as a gross-margin mix mover: Barrocas: "Our <b>D2C business and TikTok Shop business is growing faster than our retail business</b>."',
      ] },
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
    st: { k: 'trend', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'The stated profitability goal is adjusted EBITDA growing faster than net sales. Tariff annualization broke that in 2Q26 at the EBITDA line even as opex leverage held — worth tracking which one gives first.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'Adj. gross margin 43.5% (<b>+370 bp</b>) "primarily driven by cost tailwinds, including lower freight costs, as well as strong sales through our higher margin direct-to-consumer channel, specifically in the beauty category." (Flynn)',
        'Part of the margin was spent: sales & marketing <b>21.9% of sales vs 18.8%</b>, "mainly because of higher advertising, fulfillment, and personnel expenses to support our product launches and expansion into existing and new markets and subcategories." (Flynn)',
        'Timing of the tailwind: "...the full impact of some of those tailwinds, you know, will not really hit us until <b>kind of the end of Q3</b>" (Barrocas); Flynn expects H2 gross-margin expansion "expanding at a faster rate in the second half relative to the first half" after +330 bp in H1.',
        'FY23 guide embeds leverage: adj. EBITDA growth of <b>25%-31%</b> and ~200 bp margin expansion on adj. net sales +10-12%. (Barrocas)',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        'Adj. gross margin +950 bp on "continued supply chain tailwinds, cost optimization efforts, and a favorable pricing and promotional mix." The <b>45%</b> pre-COVID target: "We\'re currently on pace to hit that target this year, well ahead of plan." (Barrocas)',
        '"We took a portion of the gross margin upside in the quarter and <b>invested it back</b> in the business." (Barrocas) S&M 19.4% of sales vs 14.1%; adj. EBITDA margin still +340 bp.',
        'The mechanism: "...fueling healthy top-line growth through <b>media versus promotional activity</b>." (Flynn) - ad spend substituting for discounting, which is what supports gross margin.',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'Q4 adj. gross margin 47.4% (+970 bp); drivers beyond freight: beauty mix, D2C mix, and "ASPs were strong in the fourth quarter, you know, <b>discounted less than expected</b>, you know, really driving demand through our investments in media." (Flynn)',
        'FY24 shape: gross margin expansion "in the first half, you know, kind of <b>flattish</b> in the, in the second half", about 80-100 bp for the year, with adjusted opex "effectively flat as a % of sales". (Flynn)',
        'S&M was 23.9% of Q4 sales (vs 18.3%). Barrocas: "you will still continue to see more investment in sales and marketing. It just <b>won\'t be to the degree</b> that we\'ve seen the increase of 2023 versus 2022."',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Flynn: adj. gross margin 50.8% (<b>+210bp</b>), "primarily driven by continued supply chain tailwinds and cost optimization efforts" - adj. EBITDA margin only +30bp because the upside was reinvested.',
        'Barrocas\' FY24 opex map: "a little bit of leverage on the R&D side…But I think you should expect <b>sales and marketing to continue to deleverage</b>" - gross-margin gains are spent on new markets and categories, not dropped through.',
        'Structural reinvestment rates to audit, Barrocas: "a business that\'s investing, you know, over <b>6% of sales in R&D</b>, and over 9% of sales in marketing".',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Gross-margin sources named, Barrocas: "supplier diversification, competitive bidding, value engineering, and pricing management drove nearly <b>600 basis points</b> of Adjusted Gross Margin improvement" - adj. EBITDA margin up only ~90bp.',
        'Reagan\'s FY24 frame: "roughly about <b>175 to 200 basis points</b> of, expansion on a full year basis" - H2 expansion slows as it laps prior-year gains.',
        'Reagan: "we continue to reinvest a significant portion of our <b>gross margin upside</b> in product innovation, brand awareness, and global infrastructure" - S&M 24.3% of sales (vs 21.9%), R&D 7.2% (vs 6.4%).',
        'Payback lag on the international spend, Barrocas: "that investment today, you know, likely won\'t pay off until <b>next year or two years from now</b>" - alongside ~150 engineers hired in 2024.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas: ~200bp of adj. gross margin gain in 2024 despite Section 301 - "This is on top of approximately 700 basis points improvement last year, an incredible <b>900 basis points</b> increase over two years."',
        'Reagan: adj. EBITDA margin down ~130bp "as we continue to purposefully <b>reinvest gross margin upside</b> in product innovation, demand creation, and building our brand globally."',
        'Barrocas on 2025 margins: heavy Q3/Q4 supply-chain spend instead of spreading it over 12 months - "I think some of it is <b>accelerated into 2024 from 2025</b>."',
        'Barrocas on the alternative he rejected: "Should we haircut it <b>4%-5% spend</b> as a percentage of sales right now, or should we make the investments and set ourselves up really great for 2025 and beyond?"',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'FY24 adjusted EBITDA margin 17.2%, flat: "a <b>220 basis point improvement in adjusted gross margin</b> and a comparable rise in operating expenses as we continued reinvesting" (Reagan) - gross margin gains were reinvested, not dropped through.',
        'Gross margin drivers named: "<b>supplier diversification, competitive bidding, and value engineering</b>" - 200+ bps in 2024 on top of nearly 700 bps the prior year (Reagan).',
        'The 2025 stance: "For right now, I think we\'re planning a conservative, you know, <b>EBITDA will slightly grow faster than revenue</b>" - leverage from lapping 2024 people/infrastructure investment in H2 and lower year-on-year supply-chain costs (Barrocas).',
        'Phasing: "Q1 will be the <b>low point</b> in terms of, you know, margin expansion or better said contraction through the year", building through Q2-Q4 as production leaves China (attributed to Barrocas).',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Adjusted EBITDA -13% to $200m, margin 16.4% vs 21.6%, called "largely the purposeful result of <b>substantial investments</b> to fuel our growth" (Reagan): R&D +26%, S&M +29%.',
        'Adjusted gross margin -60 bps: "cost optimization and mix upside offset primarily by the <b>impact of tariffs</b> and the lapping of full-price sell-in" on products like air fryers (Reagan).',
        'The lever pulled for the tariff year: efficiency on "<b>headcount additions and certain media spending</b>", not R&D, so "we expect to see leverage on operating expenses as a percentage of net sales for the full year" (Barrocas) - FY adj. EBITDA guide raised to +15%-17% vs sales +11%-13%.',
        'Barrocas in Q&A: "We do need to get <b>more efficient with our marketing and advertising spending</b>."',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'The promised discipline delivered: "operating expenses as a percentage of net sales <b>decreasing by more than 200 basis points</b>" (Barrocas); adjusted EBITDA +33% on sales +15.7%, margin 15.5% (+210 bps).',
        'Gross margin +30 bps: "cost optimization and <b>favorability on pricing and promotional activity</b> partially offset by the impact of tariffs, with mix being a secondary offset" (Reagan).',
        'Where opex came out: R&D roughly flat "by incurring <b>lower professional and consulting fees</b>", G&A -11% on the same, while S&M still grew 18% (Reagan).',
        'DTC distribution: "greater efficiency in our distribution expenses, driven by <b>warehouse consolidation</b> and favorable outbound and transfer freight negotiations in North America" (Reagan); capex no longer pointed to the top of $180m-$200m.',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Quality of the +90bp adjusted gross margin: Quigley: "roughly <b>one-third</b> of the year-over-year expansion came from true outperformance, while <b>two-thirds</b> was the result of favorability related to the timing of tariffs flowing through the financials." -- most of the expansion is timing that reverses.',
        'Opex mix: R&D -3.2% while sales & marketing +20.7% (116bp deleverage). The R&D mechanism: Quigley: "we strategically <b>brought a portion of that talent in-house</b>, allowing us to retain and develop our knowledge base while optimizing overall operating costs."',
        'Q4 bridge given in advance: Quigley: tariff timing "will put pressure on our adjusted gross margin by <b>roughly 50 basis points</b>" ... "We also anticipate nearly <b>250 basis points</b> of year-over-year leverage on adjusted operating expense as a percentage of net sales." -- EBITDA margin expansion guided to come entirely from opex.',
        'Why gross margin can keep rising: Quigley names value engineering, sourcing, and mix -- "we are entering into new categories that are commanding <b>higher price points that have more structural, higher gross margins</b>."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'Gross-margin beat, two named drivers: Quigley: "First, our <b>international gross margins expanded</b> nicely based on a number of elements, including cost optimization and channel mix. Secondly, our overall <b>sales mix was more favorable</b> than anticipated"',
        'Sales & marketing +8% on sales +17.6% (~200bp leverage), with a mechanism: Quigley: "we have internally developed more sophisticated <b>social media optimization tools</b>. These help us more efficiently spend advertising dollars in social channels to drive strong ROI."',
        'Part of the +36% EBITDA is non-recurring: G&A -13%, and Quigley: "The bulk of the decrease this quarter relates to lower expenses on personnel, including <b>stock-based compensation favorability</b> year-over-year."',
        '1H26 shape given: Quigley: "the first half, we expect a <b>decent gross margin headwind driven by tariffs</b>, with slight offsets driven by all the cost optimization efforts" -- EBITDA-margin expansion again has to come from opex.',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Adjusted gross margin -100bp to 49.2%: Quigley: "Tariffs presented a sizable headwind with a <b>full quarter of impact</b> in Q1 of 2026 compared to a baseline with minimal tariffs" ... "favorable trends within pricing and mix also positively impacted margins"',
        'The model restated: Quigley: "An adaptable P&L that can <b>absorb challenges on the gross margin line while driving material OpEx leverage</b> to deliver on our Adjusted EBITDA goals." -- adjusted opex 35% of sales vs 36%.',
        'A cap on one leverage source: Barrocas: "I don\'t think, Steve, that we should think of it as that we\'re gonna get <b>media leverage</b>, you know, <b>on a long-term basis</b>." -- Europe and LatAm still need spend.',
        'GAAP G&A +22.4% vs +11% adjusted: Quigley: "The bulk of this increase came from <b>taxes related to share-based compensation</b>."',
      ] },
      { q: 'Q2 2026', items: [
        'Quigley: "SharkNinja has now driven <b>leverage on adjusted operating expense as a percentage of net sales for five quarters in a row</b>." Adjusted opex 35.6% of net sales vs 36.0% a year ago.',
        'But adjusted EBITDA grew <b>+18.6%</b> against net sales <b>+22.2%</b> — profitability growth trailed sales growth in the quarter, which management attributed to the annualization of 2025 tariffs, while reaffirming EBITDA ahead of sales for the full year.',
        'Adjusted EPS <b>+29.9%</b>, marking growth above 23% in 11 of the last 12 quarters.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'AI — "Jailbreak SharkNinja"',
    st: { k: 'watch', since: 'Q4 2025', last: 'Q2 2026' },
    why: 'Unusually concrete for a consumer company: named partners, a stated operating cadence, and a specific cost claim for 2027. All of it is promise rather than result so far — the audit is whether opex actually leverages next year.',
    updates: [
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'AI in the product, with a date: Barrocas: "Our goal is to embed a greater level of AI capabilities in all of our products going forward, some of which will debut as early as the <b>second half of 2026</b> in categories like coffee, air purification, and robotics."',
        'Headcount behind it: Barrocas: "We\'re on track to hire <b>100 new software engineers</b> to help drive this AI ambition."',
        'An operational use case with a before/after: Barrocas: "we\'ve moved from sampling <b>under 5%</b> of contact center calls to AI scoring <b>nearly 100%</b> of interactions for quality, empathy, and listening."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Bottom-up by design, contrasted with consultant-led rollouts: Barrocas: "our program incentivizes <b>broad-based experimentation by proliferating AI tools and trainings company-wide</b>."',
        'Claimed impact, no figure yet: Barrocas: "Operationally, we\'re discovering meaningful productivity gains." ... "<b>Over 150 employee submissions</b> and counting." -- backed by a $1 million prize fund.',
        'Hack Week scope: Barrocas: "we identified <b>20 cross-functional projects</b> spanning product development and quality to commercial and revenue and supply chain and operations" ... "We also hacked on <b>over 400 departmental projects</b>"',
        'The marketing use case: Barrocas: "Understanding how <b>TikTok Shop also drives demand off platform</b>, understanding how media in one market drives demand in another market." -- framed as media efficiency, not media leverage.',
      ] },
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
    st: { k: 'watch', since: 'Q2 2023', last: 'Q2 2026' },
    why: 'Shipments ran below POS in 2Q26 on Prime Day timing. Management reads retailer inventory as too LOW rather than too high — a sell-in tailwind into Q4 if it is right, and a warning sign if it is not.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'Destocking bottoming: "In Q2, you know, I think we saw a you know, a <b>leveling off of that destocking</b>, you know, where kind of POS was more matching inventory shipments." (Barrocas) - but restock for holiday "not planning for that to be significant."',
        'Shelf-space claim to audit: "From 2021 to 2022 alone, we gained an incremental <b>113,000 distribution points</b> at retail, driven by innovation and retailer support." (Barrocas)',
        'Channel, not demand, hit food prep (+4%): "...partially offset by timing of retailer shipments and <b>reduced retailer inventory</b>, with overall consumer demand remaining flat and our market share expanding slightly in the category." (Flynn)',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        '"In North America, our POS was up <b>high single digits</b> during Q3, according to NPD, compared to the 2% growth in shipments. So while destocking is mostly behind us, retailers continue to manage inventory tightly as we head into the holiday period." (Flynn)',
        '"...more, you know, desire for <b>just-in-time inventory</b>, taking promotional orders closer to the holiday season. In September, we did see a little bit of destocking pullback on the base business..." (Barrocas)',
        'Newer categories open new doors: "...retailers new to us, ranging from <b>Sephora and Ulta</b> to Cabela\'s Bass Pro Shops, Ace Hardware, and others." (Barrocas)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'North America shipments +8% while "North America POS was even stronger and was up <b>mid-teens</b>." (Flynn) Exit: "clean inventories and slightly lower weeks of supply with our retail partners." (Barrocas)',
        '"So the gap is, is <b>definitely closing</b> as we come out of Q4." For 2024: "...we\'re planning for shipments and POS to kind of match each other..." (Barrocas)',
        '"We are not assuming, you know, destocking in 2024, but our guidance also hasn\'t assumed any significant amount of <b>restocking</b>." (Barrocas) - restock is upside to the guide.',
        'New channels staffed up: outdoor/sporting goods and grocery - "we think that <b>sporting goods</b> will continue to be a bigger channel for us." (Barrocas)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas on US retailer weeks of supply: "at the end of Q1 2022, retailers had 11 weeks of supply. At the end of Q1 2023, they had 9 weeks of supply, and at the end of Q1 2024, they have <b>8 weeks of supply</b>." - and destock/restock is "a U.S.-only phenomenon".',
        'The Q1 gap, Barrocas: "our POS in the U.S., you know, grew <b>14%-15%</b>. You know, our shipments in North America, you know, grew 22%." - guide assumes "shipments and POS will match each other" for the rest of the year.',
        'Shelf space, Barrocas: "retailers are betting on us. I think they\'re supporting us with <b>incremental SKU placements</b> and stack outs and additional locations."',
        'New doors as a growth leg, Barrocas: "last year at this time in Q1, we weren\'t in Sephora, we weren\'t in Ulta, we weren\'t in <b>Bass Pro Shops</b>." - plus Dick\'s Sporting Goods online.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Barrocas: US retail shipments ~+30% vs POS ~+20%, weeks of supply "9.8 weeks of supply at the end of Q2 2023, and they\'re <b>8.6 weeks</b> of supply" - the gap is Amazon Prime Day stock shipped in June, sold in July.',
        'Barrocas: "our guidance for the balance of the year assumes that <b>POS and shipments are gonna be flat</b>" - i.e. no further restock in the numbers.',
        'Sporting goods, Barrocas: "the expansion into sporting goods, you know, <b>potentially hasn\'t even started</b>" - only Dick\'s shipped (small, out of stock); Academy Q3, Scheels Q4, meaningful revenue 2025+.',
        'Barrocas: "we\'re just starting, you know, to get products placed into the <b>grocery channel</b>" - new EMEA doors (Expert, Euronics, Fnac Darty, Boulanger, Corte Ingles) also in their infancy; small 2024 impact.',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas: "our ship and our POS were <b>flat in Q3</b>. We anticipated being flat in Q4 as well." - the constraint is now supply of hit products, not retailer buying.',
        'Reagan\'s two-year stack: "inventory is up roughly 50% on a two-year basis, and net revenue is up roughly <b>50%</b> on a two-year basis" - he called the destock/restock cycle largely over.',
        'Barrocas on sporting goods: "we <b>missed the season</b> this year on the cooler side" - 2025 plan is more SKUs, earlier, with more inventory.',
        'Grocery via SLUSHi, Barrocas: "we\'re having conversations with people like Walmart to put it into their <b>grocery areas</b>." - more beauty placement in Ulta and Sephora in 2025.',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'New shelves named: sporting goods (coolers, fans, outdoor cooking), beauty retailers (hair and skin) and grocery - "a Walmart wants to <b>double expose a SLUSHi</b> from us and put it in both the appliance section as well as the grocery section" (Barrocas).',
        'Europe after holiday 2024: "they believe in SharkNinja now. I mean, they <b>believe in SharkNinja like the U.S. retailers</b> believe in SharkNinja" (Barrocas) - the claim to audit is shelf-space gains in continental Europe.',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Sell-through vs sell-in: "<b>strong POS trends year to date ahead of shipments</b>" (Barrocas) - i.e. retailer inventory not being stuffed while SharkNinja\'s own inventory rose 30% to $973m.',
        'Trade spend as a tariff lever: "We\'ve taken steps to <b>reduce certain retailer programs and fixed expenses like NCAP placement</b> and instead collaborate on revenue-generating co-investments" (Barrocas).',
        'Europe shelf space: "we have recently completed new agreements with most of our major partners to gain <b>considerable additional shelf space</b> ahead of holiday 2025" (Barrocas) - auditable in Q4 international growth.',
        'What U.S. retailers ask amid vendor retrenchment - Barrocas: "I think the increases that we\'re talking about passing along are <b>smaller than what they\'re going to see from others</b> in certain categories."',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'Sell-through, not sell-in: "we really experienced good POS growth... We actually saw that <b>accelerate as we went through the quarter and into July</b>" (Barrocas).',
        'Walmart and Target meetings: retailers asking "How do they get a <b>leg up from a fair share standpoint</b> when new products come out into the market?" (Barrocas).',
        'International retailer pull: a European retailer in Italy asking to accelerate - "Italy hasn\'t been a direct market for us. It\'s going to <b>become a direct market</b>" (Barrocas).',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Shipment timing flagged: Barrocas: "Even with <b>some shipments moving out of Q3 into Q4</b>, as we anticipated, September was a record month for SharkNinja." -- Q3 understates sell-through; Q4 carries the shift.',
        'Against peers citing retailer \'wait and see\' destocking, a partial admission: Barrocas: "there are, of course, situations where maybe there <b>isn\'t the inventory levels that we\'d like them to be</b>." ... "We\'d love full retailer participation. In some cases, we get it. In some cases, we don\'t get it."',
        'Guide anchored on orders, not hope: Quigley: "our Q4 guidance is sort of the confidence that we have in the <b>retail orders that are ahead</b>."',
        'Why retailers would pick SN in a tight open-to-buy: Quigley: "I think we\'ve positioned ourselves really well for them to <b>prioritize us</b> because they know that we\'re going to stand behind the products."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'What the retailer relationship bought in 2025: Barrocas: "we deepened partnerships with key retailers, gaining <b>increased flexibility in pricing and promotions</b>."',
        'Holiday sell-in carried into the new year: Barrocas: "Our retailer partners gave us tremendous support in the holiday season, and they\'re <b>continuing to do that into 2026</b>."',
        'Abroad, shelf lags online: Barrocas: "it\'s always <b>slower to get into brick-and-mortar retailer placements</b>, but our pure player business is growing quite a bit."',
        'Asked about lapping retailer tariff stockpiling, declined to size it: Barrocas: "...there\'s always inventory issues that you\'re lapping or constraints or <b>one-offs or one-times</b>."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Sell-through ahead of sell-in, and why reported domestic (+8.4%) lags: Barrocas: "Our U.S. business was <b>up 10% on shipments</b>. It was up more than that in POS." ... "Our <b>Canada business</b> had some structural changes and kind of moves from direct import to domestic, you know, that had the Canada business down year-over-year."',
        'No destocking signal: Barrocas: "Kind of structurally we\'re <b>not hearing from any of our retailers that they\'re pulling back on weeks of supply</b>"',
        'Europe shelf commitments secured early: Barrocas: "SharkNinja has successfully earned <b>larger commitments from retailers throughout EMEA for the holiday season</b>."',
      ] },
      { q: 'Q2 2026', items: [
        'Barrocas: "if anything, I think <b>retailers could take a bit more inventory</b>. Not that they\'re consciously working down their inventory, but I think there\'s a lot of demand to capture. We will at least push for inventory levels to grow as we head into Q4."',
        'Quigley on the gap: POS outpaced shipments in the quarter on Prime Day timing, expected to normalize in the back half; retailer inventory described as "extremely healthy."',
        'On earning new doors: "We never sold any products other than hair care and skin care to <b>Ulta</b>, and we showed them our Shark ChillPill, and they said this would be an amazing product for them to add to their assortment." Walmart end caps and Target colorway promotions cited alongside.',
        'US shipments <b>+18%</b> with POS higher still; Canada <b>−17%</b> on the remaining transition, expected to grow in the back half.',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Tariffs & supply-chain diversification',
    st: { k: 'watch', since: 'Q2 2023', last: 'Q1 2026' },
    why: 'The one cost the company does not control. Sourcing started concentrated in China; management set a target to move US production out, then used pricing, supplier cost-downs and opex to absorb each tariff round. Audit the share of US volume made outside China, the tariff rate assumed in each guide, and when pre-built inventory stops flattering gross margin.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        '"We have a highly diversified supplier base across Asia, with low supplier concentration. We have purposely built redundancy into our supply chain for high-volume SKUs... if tariffs are reinstated, we expect we will be <b>well prepared</b>." (Barrocas)',
        'Agility as a cost/inventory lever: "...we have partnered with our factories to go from industry-typical 75-day PO lead time to <b>30-day PO lead time</b>." (Barrocas)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        '"We already have line of sight to a run rate of nearly <b>two-thirds</b> of our U.S. sales volume outside of China"; "...confident in our ability to move almost all of our U.S. volume out of China by the end of 2025." (Flynn)',
        'The cost claim: "...our cost of production outside of China was 15% higher than inside China... we are now at <b>cost parity</b> outside of China." (Flynn) - a hypothetical 60% tariff not expected to be "a long-term issue".',
        'Dual sourcing doubles as a margin lever: "...created dual sourcing capabilities, which has helped us to really kinda, you know, kinda optimize our cost base... but it\'s also given us <b>kinda leverage</b>..." with suppliers. (Flynn)',
        'Year-end inventory +28%, partly because "we <b>pre-built a few weeks of supply</b> in anticipation of 301 tariff exemptions that were expected to be reinstated on January 1, 2024, but have been pushed out to at least June 1." (Flynn)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas: working to "ensure capacity to produce almost all of our US volume outside of China by the <b>end of 2025</b>"; Section 301 reinstatement impact expected to be "relatively small" and already in guidance.',
        'Flynn: capex raised to $160-180M (from $120-140M), "driven primarily by incremental investments in <b>tooling</b> as we accelerate the diversification of our sourcing outside of China."',
        'Inventory $750M, +47% vs sales +28%; two of Flynn\'s four reasons are supply-chain hedges - extra weeks of supply for the Red Sea, and "we <b>pre-built inventory</b> in anticipation of Section 301 tariff exemptions expiring at the end of May."',
        'Freight, Barrocas: after carrier negotiations "our contracted rates are essentially <b>in line with our expectations</b>" - Red Sea handled with more weeks of supply rather than spot rates.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Reagan: "we remain on track to have the capacity to move almost all of our U.S. volume outside of China by the <b>end of 2025</b>" - Southeast Asia partners, more tooling; Section 301 reinstated June 1, impact small and in guidance.',
        'Freight, Reagan: guidance "does assume some cost impact from the ongoing disruption, but we expect the impact to be <b>immaterial</b>" - after the jump in container spot rates.',
        'Inventory $841M, +56%, partly a Section 301 pre-build; Reagan\'s two-year check: "our inventory is up <b>17%</b>, while our net sales are up 60% over the same period" (vs Q2 2022).',
        'Barrocas: "We\'re putting our foot on the gas and ramping up production <b>even faster outside of China</b>."',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas on accelerating ex-China, "not just because of the election": "we think that there\'s capacity outside of China, and we want to capture that capacity outside of China and <b>lock that up</b> for us."',
        'Reagan: "We have identified <b>new office space in Vietnam</b> and are hiring additional personnel" for quality control and compliance; target unchanged - almost all US volume capacity outside China by end-2025.',
        'Where the cost lands, Reagan: gross margin expansion "partially offset by <b>unfavorable impact of tariffs</b>", and R&D (+56%) carries "additional prototype costs and headcount to accelerate our manufacturing diversification outside of China".',
        'Lesson from the stock-outs, Barrocas: the need to "think about <b>more flexibility in our supply chain</b> and maybe how do we get kind of earlier read signals" on which launches take off.',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'Reagan: "nearly all U.S. volume expected to shift outside of China by the end of 2025 and <b>approaching 90% completed by the end of Q2</b>" - with inventory up 29% to $900m as a deliberate tariff pre-build, expected elevated through H1.',
        'Guide includes the new 10% China tariff; the pass-through lag per Barrocas: "across the, you know, the inventory spectrum, you know, you\'d probably look at maybe <b>60 to 75 days</b>."',
        'Reagan\'s framing of the 12-18 months of China exit spend and working-capital build: "what we view as our responsibility is <b>engineering a soft landing</b>."',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Three-part mitigation (buy side, sell side, opex); on value engineering, "we engaged in a large-scale value engineering effort to identify <b>over 1,500 cost savings opportunities</b>" in the first week after reciprocal tariffs (Barrocas).',
        'Pricing test case: Luxe Cafe raised "from <b>$499 - $549 with no degradation in demand</b>" (Barrocas).',
        'Not fully offset: "The impact of the tariffs was <b>hundreds of millions of dollars</b>. I wouldn\'t say that we have 100% mitigated the impact of that" (Barrocas).',
        'Guide assumes "<b>145% for China and 10%</b> for the remainder of Southeast Asia"; inventory +30%, just under half of the increase from tariff pre-builds (Reagan).',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'Milestone hit: "we have now achieved our goal of enabling approximately <b>90% of our U.S. volume</b> to be produced outside of China, and we remain on track to get to nearly 100% by the end of the year" (Barrocas).',
        'New guide assumes "<b>30% for China, 20% for Vietnam, and 19%</b> for Indonesia, Thailand, Malaysia, and Cambodia", with the impact "more weighted towards the second half of the year" (Reagan) - an H2 gross-margin test.',
        'Reagan: China from 145% to 30% is "<b>not a massive economic impact</b> to us because we weren\'t planning on shipping a lot of product at the 145% rate" - the gain is supply flexibility.',
        'Pricing so far: "Our targeted price changes to date have resulted in <b>minimal, if any, demand degradation</b>" (Barrocas); tariff pre-build in Q2 less than half of Q1\'s.',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Prebuild worked off, rates embedded in the guide: Quigley: "We\'ve worked through the majority of the <b>tariff prebuilt inventory</b> that we strategically added in late 2024 and early 2025." ... outlook assumes "minimum rates of <b>20% for China, 20% for Vietnam, 19%</b> for Indonesia, Thailand, Malaysia, and Cambodia."',
        'Sourcing as a margin lever, not just risk control: Quigley: "We also made further progress this quarter by diversifying production across our supply chain to drive further savings and flexibility with our <b>dual-source model</b>."',
        'Separation from JS Global on the supply side: Quigley: "the <b>two-year sourcing services agreement with JS Global ended</b> as planned on July 31 of this year."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'The diversification number: Barrocas: "Today, we have the ability to manufacture <b>nearly 100% of our U.S. volume outside of China</b>."',
        'From build-out to harvest: Barrocas: "With this supply chain transformation largely complete, 2026 represents our <b>first full year of optimization</b>"',
        'The cost is now in the P&L: Quigley: "We did start to see the <b>increased impact of tariffs on our domestic gross margins in Q4</b>, partially offset by this mix benefit"',
        'Prebuild fully gone: Quigley: "With all the <b>tariff prebuilt stock now sold through</b>" -- inventory $1.0B, +11.4%, now at full tariffed cost.',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Assumed rates halved: Quigley: outlook assumes "minimum rates that have shifted from <b>20%- 10%</b> for China, Vietnam, Indonesia, Thailand, Malaysia, and Cambodia."',
        'Upside left out, a new cost let in: Quigley: "our guidance <b>does not incorporate any potential tariff refund benefit</b>." ... on resins and the Middle East conflict, "We view the potential impact as manageable and have incorporated this into our guidance."',
        'Parity changes the sourcing game: Barrocas: "tariffs are <b>parity in China right now and outside of China in about 66% of our business</b>. It allows us now the flexibility of moving production back and forth very easily."',
        'Dual sourcing as pricing power over factories (orders now placed order-by-order): Barrocas: "<b>all of our top SKUs are sourced at more than one factory</b>. Most of our SKUs are sourced inside of China and outside of China."',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Beauty — from hair care to skincare',
    st: { k: 'trend', since: 'Q2 2023', last: 'Q1 2026' },
    why: 'The clearest test of the brands stretching beyond floorcare and kitchen: FlexStyle and FlexFusion in hair, then CryoGlow in skin, each opening prestige doors the core never reached. Audit Beauty & Home Environment growth, whether launches become a repeat franchise, and how far distribution widens beyond Sephora and Ulta.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'Other "nearly doubled to <b>$50 million</b>", "fueled by strong sales of our successful product launch in the beauty category, the Shark FlexStyle, at the end of 2022." (Flynn)',
        'The price-point ladder, same playbook as other categories: "the Smooth Style is gonna be sold for <b>$99</b>... our Speed Style at $199 and our FlexStyle at $299." (Barrocas) - the $99 SKU aimed at "a more opening price consumer".',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        'Other "more than tripled to <b>$67 million</b>", "fueled by the strong performance of our hair care products, including FlexStyle, Speed Style, and Smooth Style." (Flynn)',
        'The platform claim: "...as we think about beauty, we think it <b>goes beyond hair care</b>... now that we\'re in the bathroom, now that we\'re in a different subset of retailer partners, there are many other categories within the beauty space for us to bring innovation and excitement to." (Barrocas)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        '"...our U.S. market share of hairdryers and hot air stylers in 2023 increased to nearly <b>19%</b>, compared to 8% in 2022." (Barrocas)',
        'Growth was supply-capped: "We did run with <b>supply constraints</b> throughout the year on beauty as we were chasing supply." Europe and LatAm launched only at year-end, so FY24 carries full-year benefit. (Barrocas)',
        'Entry-price funnel: "At <b>$99</b>, the SmoothStyle has allowed us to bring in many more consumers into our beauty segment, and over time, we hope to graduate them into other beauty products." (Barrocas)',
      ] },
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas: "I think we\'ve created kind of <b>real beauty credibility</b> over the last two years with what we\'ve done in the hair space, and I\'m excited about additional categories within beauty" - distribution in Sephora and Ulta being expanded.',
        'Flynn: Other +66% to $110M; "This growth was powered by the continued strong performance of our <b>hair care products</b> within beauty." - plus the FlexBreeze fan launch.',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Barrocas: "we\'re on track to launch another very exciting <b>subcategory within beauty in Q4</b> of this year" - unnamed here; it turned out to be skincare.',
        'Other +250% (beauty, fans, air purifiers); Barrocas: "Beauty, led by <b>FlexStyle hot air stylers</b>, remains strong both in our domestic and international markets."',
        'Barrocas: Ulta and Sephora now reaching full-chain placement, and "There\'s still a lot of growth to come in the <b>beauty channels</b>, you know, as we expand and get more SKU placement."',
        'Beauty as the lead category in new markets - Brazil, Barrocas: "We\'re starting with <b>beauty</b> and with motorized kitchen appliances."',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Shark CryoGlow, Barrocas: "Our consumer research identified skincare as a concern for a <b>much broader audience</b>, including men and women of a variety of age groups." - priced below competing devices; UK and Mexico first.',
        'FlexFusion extends the hair franchise, Barrocas: "a key consumer need we\'ve identified: <b>hot tool styles without the hot tool damage</b>."',
        'Barrocas sets the timing on skin: "It <b>won\'t contribute a lot</b> from a revenue standpoint this fiscal year, but it\'s well set up to be able to do that for next fiscal year."',
      ] },
      { q: 'Q4 2024', src: 'https://web.quartr.com/companies/15145/events/238603/overview', items: [
        'A number to audit: "CryoGlow presents a <b>$100 million+ opportunity</b> for us this year", extrapolated from eight holiday weeks in the U.K. and Mexico (Barrocas).',
        'Distribution path: CryoGlow, the first FDA-cleared product, launched in the U.S. DTC first "with a planned <b>rollout to key beauty retailers in Q2</b>" (Barrocas); FlexFusion follows into major beauty retailers the same quarter.',
      ] },
      { q: 'Q1 2025', src: 'https://web.quartr.com/companies/15145/events/315494/overview', items: [
        'Barrocas, explaining new senior marketing hires: "we think beauty is going to be a category that is going to generate <b>significant global growth for us over the next five years</b>."',
        'Pricing at launch: CryoGlow was planned at $299 in the U.S., "but launched it at <b>$349</b> based on the strength of the product distinction and the consumer appetite" (Barrocas).',
      ] },
      { q: 'Q2 2025', src: 'https://web.quartr.com/companies/15145/events/344012/overview', items: [
        'The aspiration: "We aspire to establish Shark Beauty as the <b>runaway leader in beauty technology</b>" - several new hair and skincare products before year-end; CryoGlow into continental Europe (Barrocas).',
        'Where H2 innovation is concentrated: "I think we have <b>outsized innovation coming in beauty</b>" (Barrocas); Reagan points to the beauty marketing hires as the tell for H2 and 2026.',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Speed of the skincare entry: Barrocas: "In <b>under 12 months</b>, Shark CryoGlow is the number one skincare facial device in the U.S." (Circana).',
        'A consumable attached to the device (FacialPro Glow\'s replenishment topical, co-developed with a Korean formulator): Barrocas: "we\'re not just selling a product, but we\'re <b>selling a system</b> that the consumer will kind of ongoing engage with us." ... "I think you\'re going to see <b>broadened retail distribution</b> from us."',
        'Read the category line with care -- it mixes beauty with fans and purifiers: Quigley: "our beauty and home environment category increased <b>56.7%</b> year-over-year to $189 million. We experienced broad-based growth across fans, air purifiers, hair care, and skin care in the quarter."',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'Market-making, sized: Barrocas: "the total LED mask market in the United States was <b>$35 million in 2024</b>. We did, you know, <b>more than 2x that</b>, you know, just in 2025 ourselves. So what we\'re doing in skincare is a lot like what we did in with the Creami"',
        'A new customer cohort: Barrocas: "we\'re obviously attracting a <b>younger demographic</b>." -- including young men in skincare.',
        'Runway named beyond hair and skin: Barrocas: "<b>scalp</b>, I think, is an interesting place. You know, I think <b>nails</b> is an interesting place. I think <b>wellness</b>, you know, is quite interesting"',
        'Category line: Quigley: "our beauty and home environment category increased <b>63.2%</b> year-over-year to $326 million, our highest growth rate of the year." -- still blended with fans and air purifiers.',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Next adjacency dated: Barrocas: "our beauty business is gonna help us ultimately <b>expand into wellness in 2027</b>."',
        'Technology transfer across categories: Barrocas: "We derived the <b>InstaChill cooling plate technology</b> from the expertise we developed with our <b>Shark CryoGlow LED face mask</b>." -- the ChillPill (a cooling product) is a beauty spin-off.',
        'Skincare named as the driver: Quigley: "our beauty and home environment category increased <b>40.8%</b> year-over-year to $194 million. Our Shark Beauty technology portfolio was a standout in the quarter, particularly our <b>skincare business led by Shark CryoGlow</b>."',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Pricing, promotion & elasticity',
    st: { k: 'watch', since: 'Q1 2024', last: 'Q1 2026' },
    why: 'Management claims it wins demand with innovation and marketing rather than discounting. With tariffs lifting costs and US categories flat, the price-versus-units split is the quality-of-growth question — audit stated price actions against unit POS, promo depth and gross margin.',
    updates: [
      { q: 'Q1 2024', src: 'https://web.quartr.com/companies/15145/events/164472/overview', items: [
        'Barrocas: the market is down low single digits and "the low end of the market is quite promotional"; SharkNinja spends on sales and marketing because "that\'s the better way for us to drive demand than, you know, <b>bigger promo pricing</b>."',
        'Barrocas on the ceiling to margin: "we need to do it at an <b>extraordinary value</b> to the consumer. And, so we always got to keep that quotient in mind as we\'re thinking about pricing, and we\'re thinking about gross margin."',
        'Barrocas on why the core keeps getting refreshed (DoubleStack air fryer): "we stay ahead of the competition, gain additional share of the market, and <b>maintain our ASPs and margins</b>".',
      ] },
      { q: 'Q2 2024', src: 'https://web.quartr.com/companies/15145/events/192649/overview', items: [
        'Barrocas on the $499 Shark PowerDetect upright: "it\'s also gonna help us drive up <b>average sell price</b>. It\'s also gonna help us, you know, promote less." - innovating into the base instead of milking it.',
        'Barrocas on premiumisation (Luxe Cafe at $499; robots and beauty launches to push price points up): the test is "pushing price points up because we think there\'s an area of the market that we can penetrate, but still give the consumer <b>extraordinary value</b>".',
        'Reagan: alongside cost optimisation, mix and FX, "our continued focus on assortment and <b>promotional mix management</b> is helping us maintain healthy pricing".',
      ] },
      { q: 'Q3 2024', src: 'https://web.quartr.com/companies/15145/events/220027/overview', items: [
        'Barrocas on Q4: "our ASPs are strong. I mean, we\'re <b>not expecting to see more discounting</b> this holiday season than last holiday season."',
        'Premium as a retailer argument, Barrocas on the $499 Luxe Cafe: "we\'re bringing in great consumers into buying <b>high ASP items</b> into their stores or online."',
      ] },
      { q: 'Q3 2025', src: 'https://web.quartr.com/companies/15145/events/372004/overview', items: [
        'Price taken, deliberately small: Quigley: "We\'ve taken price. We\'ve done it <b>very, very cautiously</b>." -- while peers reported trouble passing tariffs through.',
        'The defence is breadth of price ladder: Quigley: "You could still buy a Shark or Ninja product for <b>$59 or for $999</b>."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'No list-price increase in the guide; price moves through launches instead: Barrocas: "there\'s <b>nothing at this point planned from a price increase standpoint</b>, in our guide through the end of the year." ... "we\'re probably <b>erring on the side of going a little bit higher as we launch</b>, and then seeing how it plays out in the numbers"',
        'A worked example: Barrocas: "We launched our Shark ChillPill at <b>$149</b>. You know, we think that\'s kind of the <b>upper range of what we tested at</b>"',
      ] },
    ],
  },
  {
    seg: 'SharkNinja', theme: 'Capital allocation — from separation to buybacks',
    st: { k: 'trend', since: 'Q2 2023', last: 'Q1 2026' },
    why: 'From a levered spin-off out of JS Global, through refinancing and one-off separation costs, to net cash and a first buyback. Audit leverage and the adjusted-to-GAAP gap early on; later, repurchase pace against SBC dilution and against reinvestment.',
    updates: [
      { q: 'Q2 2023', src: 'https://web.quartr.com/companies/15145/events/91000/overview', items: [
        'Refinanced away from the parent\'s lender: "...an <b>$810 million term loan</b> and a $500 million revolving credit facility. The new credit agreement fully replaced our prior facility with Bank of China." (Flynn) Pro forma net leverage ~1.0x.',
        'FY23 GAAP tax rate guided at 35%-36%, "inclusive of approximately <b>10-11 percentage points</b> of impact related to withholding taxes and nondeductible costs associated with the spin-off from JS Global." (Flynn)',
      ] },
      { q: 'Q3 2023', src: 'https://web.quartr.com/companies/15145/events/91026/overview', items: [
        'First cash return: "...a <b>special cash dividend of $1.08 per share</b>", reflecting "our ability to continue to generate strong free cash flow." (Flynn) Net leverage ~1.0x.',
        'G&A <b>$125 million vs $47 million</b>, "primarily due to costs related to the spin-off from JS Global and stock compensation expense associated with new RSU grants." (Flynn) - the GAAP/adjusted gap; GAAP net income $19M vs adjusted $133M.',
        'FY23 GAAP tax rate raised to 42%-43%, incl. "approximately <b>14%-15% percentage points</b> of impact related to withholding taxes and nondeductible costs associated with the spin-off from JS Global" plus ~3 points from the dividend. (Flynn)',
      ] },
      { q: 'Q4 2023', src: 'https://web.quartr.com/companies/15145/events/129667/overview', items: [
        'G&A $124M vs $97M on SBC plus "transaction costs related to the separation from our parent company, JS Global, and our <b>secondary offering</b> in December." FY23 GAAP tax rate 43%. (Flynn)',
        'Separation costs roll off in the FY24 guide: GAAP tax rate <b>24%-25%</b> (vs 43%), but net interest ~$65M vs $45M. (Flynn) Year-end net leverage 0.9x.',
      ] },
      { q: 'Q4 2025', src: 'https://web.quartr.com/companies/15145/events/399981/overview', items: [
        'First buyback, with a stated floor: Barrocas: net cash exiting 2025, board "authorized an inaugural <b>$750 million</b> share repurchase program" ... "to repurchase shares opportunistically, while also planning to <b>offset the natural dilution from stock-based compensation</b>"',
        'A stated shift in priorities: Quigley: "In 2024 and 2025, we prioritized flexibility around elements like inventory and working capital. In 2026 and beyond, we feel we are in a prime position to remain nimble, while also <b>prioritizing capital allocation in a more meaningful way</b>."',
        'Shareholder-base catalyst: Barrocas: "we\'ve achieved our goal of becoming a <b>domestic filer</b>. This is an exciting milestone for SharkNinja, and the final step needed to earn consideration for <b>broader index inclusion</b>."',
      ] },
      { q: 'Q1 2026', src: 'https://web.quartr.com/companies/15145/events/555079/overview', items: [
        'Slow start on the $750M authorization (~3%): Quigley: "Through the end of March, we have repurchased <b>roughly $20 million</b> worth of stock" ... "while <b>steadfastly reinvesting into the business as our priority</b>."',
        'The balance sheet\'s stated role: Quigley: "A robust balance sheet that enables us to <b>retain flexibility while also returning capital to shareholders</b>."',
      ] },
    ],
  },
];
