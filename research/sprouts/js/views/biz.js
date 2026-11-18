/* The business — what Sprouts sells, how a store works, how it makes money */
registerView({ id:'biz',
  html: `
  <p class="lede">Sprouts is a <strong>specialty grocer of fresh, natural and organic food</strong>. Produce sits in the middle of the store, the opposite of a normal supermarket,
  and the range leans to organic, plant-based and "attribute" items (keto, gluten-free, non-GMO). It wins on <strong>fresh product and discovery</strong>, not on being the cheapest.</p>

  <div class="srow">
    ${tile('Net sales · FY25', usd(LAST.net_sales), '<span class="up">+14%</span>; comps +7.3%')}
    ${tile('Stores · Sep 2026', num(LQ.stores_end), '25 states; a third in California')}
    ${tile('Gross margin · FY25', pctf(SD.derived_ratios.gross_margin.FY2025 * 100), 'From ~33.6% in 2016–19')}
    ${tile('Sprouts Brand', '>25%', 'Of sales, from ~10% in FY16')}
  </div>

  ${sec({ t:'How a store works', s:'Smaller, cheaper boxes aimed at two customer groups',
    b:`<div class="cols3">
      <div class="biz" style="--c:${SC.per}"><div class="k">The format</div><div class="n">21–25k sq ft new · ~27k fleet</div>
        <p>Open layout, low shelves, a farmers-market feel. New stores since 2020 are smaller: cheaper to build, less back room, lower occupancy cost. 75–100 team members each.</p></div>
      <div class="biz" style="--c:${SC.steel}"><div class="k">The customer</div><div class="n">Health enthusiasts · selective shoppers</div>
        <p>The second group was "experience seekers" until FY23. Sprouts targets them with innovation and "foraging" for new products, not broad promotions.</p></div>
      <div class="biz" style="--c:${SC.navy}"><div class="k">The supply chain</div><div class="n">6 fresh DCs within ~250 miles</div>
        <p>AZ, TX, 2× CA, CO, FL serve ~80% of stores; meat & seafood self-distributed to ~70% of stores (~95% in 2026). Dry grocery mostly from KeHE (52% of purchases).</p></div>
    </div>`,
    n:'10-K FY25 Item 1. Produce takes ~20% of selling space, which the company says is far more than most peers.' })}

  ${sec({ t:'Where $100 of sales goes', s:'FY25. Occupancy and buying costs sit in SG&A, not in cost of goods',
    b:`<div id="biz-w"></div>`,
    n:'10-K FY25 income statement; our arithmetic. Shrink (spoiled or lost product) is the main swing factor in gross margin — FY25 gained 70 bp on "improved shrink".' })}

  ${sec({ t:'What it sells', s:'Perishables are ~57% of sales and have barely moved in ten years',
    b:`<div id="biz-m"></div>`,
    n:'10-K revenue note. Perishables = produce, meat, seafood, deli, bakery, floral, dairy. Definition changed in the FY18 10-K (dairy and floral moved in); the chart uses the current definition only.' })}
  `,
  init(){
    const L = LAST, s = L.net_sales;
    const cogs = (s - L.gross_profit) / s * 100, sga = L.sga / s * 100, da = L.depreciation_line / s * 100, op = L.operating_income / s * 100;
    const other = 100 - cogs - sga - da - op;
    chartBlock($('#biz-w'), { labels:['Cost of goods','SG&A (stores, occupancy, buying)','Depreciation','Store closure & other','Operating profit'], horizontal:true, height:'s',
      unit:'$ per $100 of sales', fmt:v => '$' + num(v,1), rowHead:'Line',
      series:[ { key:'v', label:'$ per $100 of sales', color:SC.steel, data:[cogs, sga, da, other, op] } ],
      tableNote:'Net sales ' + usd(s) + '; gross profit ' + usd(L.gross_profit) + '; SG&A ' + usd(L.sga) + '; operating income ' + usd(L.operating_income) + '; net income ' + usd(L.net_income) + '.' });

    const yrs = FY.filter(k => SD.product_mix.perishables_current_definition[k] != null);
    chartBlock($('#biz-m'), { labels:yrs.map(k => 'FY' + k.slice(4)), unit:'% of sales', fmt:v => pctf(v,0), stacked:true, total:false, height:'s', rowHead:'Fiscal year',
      series:[ { key:'p', label:'Perishables', color:SC.per, data:yrs.map(k => SD.product_mix.perishables_current_definition[k]*100), stack:'a' },
               { key:'n', label:'Non-perishables', color:SC.non, data:yrs.map(k => 100 - SD.product_mix.perishables_current_definition[k]*100), stack:'a' } ],
      extra: c => { c.options.scales.y.max = 100; },
      tableNote:'Non-perishables = grocery, vitamins & supplements, bulk, frozen, beer & wine, body care.' });
  }
});
