// spectrum-metrics-data.js - GENERATED. Do not edit by hand.
//
// Source: SEC XBRL company concepts (data.sec.gov) - 10-K for the US filers, 20-F for TSMC,
// Spotify, Grupo Aeroportuario and Tiendas 3B. Regenerate with:
//
//   .\scripts\spectrum\fetch-metrics.ps1
//
// Every figure is as-filed. `years` runs oldest to newest and is spined on the revenue line,
// so a year appears only if revenue was tagged for it; `null` on any other field means the
// company does not report that line, and the metric built on it is left blank rather than
// guessed. `ttm` is the last full year plus the current year to date less the same stretch of
// the prior year - null where the filer publishes no interim XBRL, which is the normal case
// for the 20-F names.
//
// Amounts are in each filer's own reporting currency (see `currency`). Only ratios are shown
// in the UI, and each divides two figures from the same filing, so no FX is involved.
//
// Generated 2026-08-26.

export const SPECTRUM_METRICS_DATA = [
    {
        "ticker":  "NVDA",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2016-01-31",
                          "fy":  2016,
                          "revenue":  5010000000,
                          "grossProfit":  2811000000,
                          "operating":  747000000,
                          "cfo":  1175000000,
                          "capex":  null,
                          "da":  197000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-01-29",
                          "fy":  2017,
                          "revenue":  6910000000,
                          "grossProfit":  4063000000,
                          "operating":  1934000000,
                          "cfo":  1672000000,
                          "capex":  null,
                          "da":  187000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-01-28",
                          "fy":  2018,
                          "revenue":  9714000000,
                          "grossProfit":  5822000000,
                          "operating":  3210000000,
                          "cfo":  3502000000,
                          "capex":  null,
                          "da":  199000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-01-27",
                          "fy":  2019,
                          "revenue":  11716000000,
                          "grossProfit":  7171000000,
                          "operating":  3804000000,
                          "cfo":  3743000000,
                          "capex":  null,
                          "da":  262000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-01-26",
                          "fy":  2020,
                          "revenue":  10918000000,
                          "grossProfit":  6768000000,
                          "operating":  2846000000,
                          "cfo":  4761000000,
                          "capex":  null,
                          "da":  381000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-01-31",
                          "fy":  2021,
                          "revenue":  16675000000,
                          "grossProfit":  10396000000,
                          "operating":  4532000000,
                          "cfo":  5822000000,
                          "capex":  null,
                          "da":  1098000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-01-30",
                          "fy":  2022,
                          "revenue":  26914000000,
                          "grossProfit":  17475000000,
                          "operating":  10041000000,
                          "cfo":  9108000000,
                          "capex":  976000000,
                          "da":  1174000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-01-29",
                          "fy":  2023,
                          "revenue":  26974000000,
                          "grossProfit":  15356000000,
                          "operating":  4224000000,
                          "cfo":  5641000000,
                          "capex":  1833000000,
                          "da":  1544000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-01-28",
                          "fy":  2024,
                          "revenue":  60922000000,
                          "grossProfit":  44301000000,
                          "operating":  32972000000,
                          "cfo":  28090000000,
                          "capex":  1069000000,
                          "da":  1508000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-01-26",
                          "fy":  2025,
                          "revenue":  130497000000,
                          "grossProfit":  97858000000,
                          "operating":  81453000000,
                          "cfo":  64089000000,
                          "capex":  3236000000,
                          "da":  1864000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2026-01-25",
                          "fy":  2026,
                          "revenue":  215938000000,
                          "grossProfit":  153463000000,
                          "operating":  130387000000,
                          "cfo":  102718000000,
                          "capex":  6042000000,
                          "da":  2843000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-04-26",
                    "note":  "FY to 2026-01-25 + 90d to 2026-04-26 - same stretch to 2025-04-27",
                    "priorRevenue":  148515000000,
                    "revenue":  253491000000,
                    "grossProfit":  187952000000,
                    "operating":  162285000000,
                    "cfo":  125648000000,
                    "capex":  6572000000,
                    "da":  3229000000
                },
        "tags":  {
                     "revenue":  "Revenues",
                     "grossProfit":  "GrossProfit",
                     "costOfSales":  "CostOfRevenue",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquireProductiveAssets",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "TSM",
        "currency":  "TWD",
        "years":  [
                      {
                          "end":  "2015-12-31",
                          "fy":  2015,
                          "revenue":  843497400000,
                          "grossProfit":  410394900000,
                          "operating":  320047800000,
                          "cfo":  529879400000,
                          "capex":  257516800000,
                          "da":  222505600000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  947938300000,
                          "grossProfit":  474832100000,
                          "operating":  377957800000,
                          "cfo":  539834600000,
                          "capex":  328045300000,
                          "da":  223828400000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  977447200000,
                          "grossProfit":  494826400000,
                          "operating":  385559200000,
                          "cfo":  585318200000,
                          "capex":  330588200000,
                          "da":  260142700000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  1031473600000,
                          "grossProfit":  497874300000,
                          "operating":  383623500000,
                          "cfo":  573954300000,
                          "capex":  315581900000,
                          "da":  292546300000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  1069985400000,
                          "grossProfit":  492701900000,
                          "operating":  372701100000,
                          "cfo":  615138700000,
                          "capex":  460422200000,
                          "da":  286884200000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  1339254800000,
                          "grossProfit":  711130100000,
                          "operating":  566783700000,
                          "cfo":  822666200000,
                          "capex":  507238700000,
                          "da":  331724600000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  1587415000000,
                          "grossProfit":  819537300000,
                          "operating":  649980900000,
                          "cfo":  1112160700000,
                          "capex":  839195700000,
                          "da":  422394900000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  2263891300000,
                          "grossProfit":  1348354800000,
                          "operating":  1121278900000,
                          "cfo":  1610599200000,
                          "capex":  1082672100000,
                          "da":  437254300000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  2161735800000,
                          "grossProfit":  1175110600000,
                          "operating":  921465600000,
                          "cfo":  1241967300000,
                          "capex":  949816800000,
                          "da":  532190900000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  2894307700000,
                          "grossProfit":  1624353600000,
                          "operating":  1322053000000,
                          "cfo":  1826177100000,
                          "capex":  956006500000,
                          "da":  662796600000,
                          "form":  "20-F"
                      }
                  ],
        "ttm":  null,
        "tags":  {
                     "revenue":  "Revenue",
                     "grossProfit":  "GrossProfit",
                     "costOfSales":  "CostOfSales",
                     "operating":  "ProfitLossFromOperatingActivities",
                     "cfo":  "CashFlowsFromUsedInOperatingActivities",
                     "capex":  "PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities",
                     "daDep":  "DepreciationExpense",
                     "daAmort":  "AmortisationExpense"
                 }
    },
    {
        "ticker":  "AMZN",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  135987000000,
                          "grossProfit":  47722000000,
                          "operating":  4186000000,
                          "cfo":  17203000000,
                          "capex":  6737000000,
                          "da":  8116000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  177866000000,
                          "grossProfit":  65932000000,
                          "operating":  4106000000,
                          "cfo":  18365000000,
                          "capex":  11955000000,
                          "da":  11478000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  232887000000,
                          "grossProfit":  93731000000,
                          "operating":  12421000000,
                          "cfo":  30723000000,
                          "capex":  13427000000,
                          "da":  15341000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  280522000000,
                          "grossProfit":  114986000000,
                          "operating":  14541000000,
                          "cfo":  38514000000,
                          "capex":  16861000000,
                          "da":  21789000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  386064000000,
                          "grossProfit":  152757000000,
                          "operating":  22899000000,
                          "cfo":  66064000000,
                          "capex":  40140000000,
                          "da":  25180000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  469822000000,
                          "grossProfit":  197478000000,
                          "operating":  24879000000,
                          "cfo":  46327000000,
                          "capex":  61053000000,
                          "da":  34433000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  513983000000,
                          "grossProfit":  225152000000,
                          "operating":  12248000000,
                          "cfo":  46752000000,
                          "capex":  63645000000,
                          "da":  41921000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  574785000000,
                          "grossProfit":  270046000000,
                          "operating":  36852000000,
                          "cfo":  84946000000,
                          "capex":  52729000000,
                          "da":  48663000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  637959000000,
                          "grossProfit":  311671000000,
                          "operating":  68593000000,
                          "cfo":  115877000000,
                          "capex":  82999000000,
                          "da":  52795000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  716924000000,
                          "grossProfit":  360510000000,
                          "operating":  79975000000,
                          "cfo":  139514000000,
                          "capex":  131819000000,
                          "da":  65756000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  670038000000,
                    "revenue":  775680000000,
                    "grossProfit":  393810000000,
                    "operating":  93712000000,
                    "cfo":  161403000000,
                    "capex":  173028000000,
                    "da":  75200000000
                },
        "tags":  {
                     "revenue":  "RevenueFromContractWithCustomerExcludingAssessedTax",
                     "grossProfit":  "GrossProfit",
                     "costOfSales":  "CostOfGoodsAndServicesSold",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquireProductiveAssets",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "GOOGL",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2015-12-31",
                          "fy":  2015,
                          "revenue":  74989000000,
                          "grossProfit":  46825000000,
                          "operating":  19360000000,
                          "cfo":  26572000000,
                          "capex":  9950000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  90272000000,
                          "grossProfit":  55134000000,
                          "operating":  23716000000,
                          "cfo":  36036000000,
                          "capex":  10212000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  110855000000,
                          "grossProfit":  65272000000,
                          "operating":  26178000000,
                          "cfo":  37091000000,
                          "capex":  13184000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  136819000000,
                          "grossProfit":  77270000000,
                          "operating":  27524000000,
                          "cfo":  47971000000,
                          "capex":  25139000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  161857000000,
                          "grossProfit":  89961000000,
                          "operating":  34231000000,
                          "cfo":  54520000000,
                          "capex":  23548000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  182527000000,
                          "grossProfit":  97795000000,
                          "operating":  41224000000,
                          "cfo":  65124000000,
                          "capex":  22281000000,
                          "da":  null,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  257637000000,
                          "grossProfit":  146698000000,
                          "operating":  78714000000,
                          "cfo":  91652000000,
                          "capex":  24640000000,
                          "da":  10273000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  282836000000,
                          "grossProfit":  156633000000,
                          "operating":  74842000000,
                          "cfo":  91495000000,
                          "capex":  31485000000,
                          "da":  13475000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  307394000000,
                          "grossProfit":  174062000000,
                          "operating":  84293000000,
                          "cfo":  101746000000,
                          "capex":  32251000000,
                          "da":  11946000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  350018000000,
                          "grossProfit":  203712000000,
                          "operating":  112390000000,
                          "cfo":  125299000000,
                          "capex":  52535000000,
                          "da":  15311000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  402836000000,
                          "grossProfit":  240301000000,
                          "operating":  129039000000,
                          "cfo":  164713000000,
                          "capex":  91447000000,
                          "da":  21136000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  371399000000,
                    "revenue":  445866000000,
                    "grossProfit":  271517000000,
                    "operating":  147628000000,
                    "cfo":  185675000000,
                    "capex":  132402000000,
                    "da":  25237000000
                },
        "tags":  {
                     "revenue":  "Revenues",
                     "costOfSales":  "CostOfRevenue",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "daDep":  "Depreciation"
                 }
    },
    {
        "ticker":  "META",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2015-12-31",
                          "fy":  2015,
                          "revenue":  17928000000,
                          "grossProfit":  15061000000,
                          "operating":  6225000000,
                          "cfo":  10320000000,
                          "capex":  2523000000,
                          "da":  1945000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  27638000000,
                          "grossProfit":  23849000000,
                          "operating":  12427000000,
                          "cfo":  16108000000,
                          "capex":  4491000000,
                          "da":  2342000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  40653000000,
                          "grossProfit":  35199000000,
                          "operating":  20203000000,
                          "cfo":  24216000000,
                          "capex":  6733000000,
                          "da":  3025000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  55838000000,
                          "grossProfit":  46483000000,
                          "operating":  24913000000,
                          "cfo":  29274000000,
                          "capex":  13915000000,
                          "da":  4315000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  70697000000,
                          "grossProfit":  57927000000,
                          "operating":  23986000000,
                          "cfo":  36314000000,
                          "capex":  15102000000,
                          "da":  5741000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  85965000000,
                          "grossProfit":  69273000000,
                          "operating":  32671000000,
                          "cfo":  38747000000,
                          "capex":  15163000000,
                          "da":  6862000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  117929000000,
                          "grossProfit":  95280000000,
                          "operating":  46753000000,
                          "cfo":  57683000000,
                          "capex":  18690000000,
                          "da":  7967000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  116609000000,
                          "grossProfit":  91360000000,
                          "operating":  28944000000,
                          "cfo":  50475000000,
                          "capex":  31186000000,
                          "da":  8686000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  134902000000,
                          "grossProfit":  108943000000,
                          "operating":  46751000000,
                          "cfo":  71113000000,
                          "capex":  27045000000,
                          "da":  11178000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  164501000000,
                          "grossProfit":  134340000000,
                          "operating":  69380000000,
                          "cfo":  91328000000,
                          "capex":  37256000000,
                          "da":  15498000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  200966000000,
                          "grossProfit":  164791000000,
                          "operating":  83276000000,
                          "cfo":  115800000000,
                          "capex":  69691000000,
                          "da":  18616000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  178804000000,
                    "revenue":  228247000000,
                    "grossProfit":  186586000000,
                    "operating":  86926000000,
                    "cfo":  130301000000,
                    "capex":  89325000000,
                    "da":  22729000000
                },
        "tags":  {
                     "revenue":  "RevenueFromContractWithCustomerExcludingAssessedTax",
                     "costOfSales":  "CostOfRevenue",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "SPOT",
        "currency":  "EUR",
        "years":  [
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  2952000000,
                          "grossProfit":  401000000,
                          "operating":  -349000000,
                          "cfo":  101000000,
                          "capex":  27000000,
                          "da":  38000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  4090000000,
                          "grossProfit":  849000000,
                          "operating":  -378000000,
                          "cfo":  179000000,
                          "capex":  36000000,
                          "da":  54000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  5259000000,
                          "grossProfit":  1353000000,
                          "operating":  -43000000,
                          "cfo":  344000000,
                          "capex":  125000000,
                          "da":  32000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  6764000000,
                          "grossProfit":  1722000000,
                          "operating":  -73000000,
                          "cfo":  573000000,
                          "capex":  135000000,
                          "da":  87000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  7880000000,
                          "grossProfit":  2015000000,
                          "operating":  -293000000,
                          "cfo":  259000000,
                          "capex":  78000000,
                          "da":  111000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  9668000000,
                          "grossProfit":  2591000000,
                          "operating":  94000000,
                          "cfo":  361000000,
                          "capex":  85000000,
                          "da":  127000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  11727000000,
                          "grossProfit":  2926000000,
                          "operating":  -659000000,
                          "cfo":  46000000,
                          "capex":  25000000,
                          "da":  171000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  13247000000,
                          "grossProfit":  3397000000,
                          "operating":  -446000000,
                          "cfo":  680000000,
                          "capex":  6000000,
                          "da":  158000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  15673000000,
                          "grossProfit":  4724000000,
                          "operating":  1365000000,
                          "cfo":  2301000000,
                          "capex":  17000000,
                          "da":  121000000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  17186000000,
                          "grossProfit":  5496000000,
                          "operating":  2198000000,
                          "cfo":  2933000000,
                          "capex":  61000000,
                          "da":  102000000,
                          "form":  "20-F"
                      }
                  ],
        "ttm":  null,
        "tags":  {
                     "revenue":  "Revenue",
                     "grossProfit":  "GrossProfit",
                     "costOfSales":  "CostOfSales",
                     "operating":  "ProfitLossFromOperatingActivities",
                     "cfo":  "CashFlowsFromUsedInOperatingActivities",
                     "capex":  "PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities",
                     "daDep":  "AdjustmentsForDepreciationExpense",
                     "daAmort":  "AdjustmentsForAmortisationExpense"
                 }
    },
    {
        "ticker":  "UBER",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  7932000000,
                          "grossProfit":  3772000000,
                          "operating":  -4080000000,
                          "cfo":  -1418000000,
                          "capex":  821000000,
                          "da":  510000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  10433000000,
                          "grossProfit":  5647000000,
                          "operating":  -3033000000,
                          "cfo":  -1541000000,
                          "capex":  558000000,
                          "da":  426000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  13000000000,
                          "grossProfit":  6939000000,
                          "operating":  -8596000000,
                          "cfo":  -4321000000,
                          "capex":  588000000,
                          "da":  472000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  11139000000,
                          "grossProfit":  5985000000,
                          "operating":  -4863000000,
                          "cfo":  -2745000000,
                          "capex":  616000000,
                          "da":  575000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  17455000000,
                          "grossProfit":  8104000000,
                          "operating":  -3834000000,
                          "cfo":  -445000000,
                          "capex":  298000000,
                          "da":  902000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  31877000000,
                          "grossProfit":  12218000000,
                          "operating":  -1832000000,
                          "cfo":  642000000,
                          "capex":  252000000,
                          "da":  947000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  37281000000,
                          "grossProfit":  14824000000,
                          "operating":  1110000000,
                          "cfo":  3585000000,
                          "capex":  223000000,
                          "da":  823000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  43978000000,
                          "grossProfit":  17327000000,
                          "operating":  2799000000,
                          "cfo":  7137000000,
                          "capex":  242000000,
                          "da":  711000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  52017000000,
                          "grossProfit":  20679000000,
                          "operating":  5565000000,
                          "cfo":  10099000000,
                          "capex":  336000000,
                          "da":  719000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  47331000000,
                    "revenue":  55227000000,
                    "grossProfit":  23364000000,
                    "operating":  6700000000,
                    "cfo":  10424000000,
                    "capex":  308000000,
                    "da":  745000000
                },
        "tags":  {
                     "revenue":  "Revenues",
                     "costOfSales":  "CostOfGoodsAndServiceExcludingDepreciationDepletionAndAmortization",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "LYFT",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  1059881000,
                          "grossProfit":  400348000,
                          "operating":  -708272000,
                          "cfo":  -393526000,
                          "capex":  null,
                          "da":  2611000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  2106021000,
                          "grossProfit":  862621000,
                          "operating":  -977711000,
                          "cfo":  -280673000,
                          "capex":  null,
                          "da":  18752000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  3465473000,
                          "grossProfit":  1289004000,
                          "operating":  -2702480000,
                          "cfo":  -105702000,
                          "capex":  null,
                          "da":  108429000,
                          "form":  "10-K/A"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  2208656000,
                          "grossProfit":  761140000,
                          "operating":  -1808382000,
                          "cfo":  -1378899000,
                          "capex":  null,
                          "da":  157353000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  2957979000,
                          "grossProfit":  1255662000,
                          "operating":  -1135217000,
                          "cfo":  -101721000,
                          "capex":  null,
                          "da":  139347000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  3811993000,
                          "grossProfit":  1376257000,
                          "operating":  -1458916000,
                          "cfo":  -237285000,
                          "capex":  null,
                          "da":  154798000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  4116216000,
                          "grossProfit":  1572262000,
                          "operating":  -475604000,
                          "cfo":  -98244000,
                          "capex":  null,
                          "da":  116513000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  5365534000,
                          "grossProfit":  2027820000,
                          "operating":  -118912000,
                          "cfo":  849737000,
                          "capex":  null,
                          "da":  148892000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  5895475000,
                          "grossProfit":  2197822000,
                          "operating":  -188374000,
                          "cfo":  1168438000,
                          "capex":  null,
                          "da":  135227000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  5685276000,
                    "revenue":  6538198000,
                    "grossProfit":  2848588000,
                    "operating":  -119723000,
                    "cfo":  1195080000,
                    "capex":  null,
                    "da":  146417000
                },
        "tags":  {
                     "revenue":  "RevenueFromContractWithCustomerExcludingAssessedTax",
                     "costOfSales":  "CostOfRevenue",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "MA",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2014-12-31",
                          "fy":  2014,
                          "revenue":  9473000000,
                          "grossProfit":  null,
                          "operating":  5106000000,
                          "cfo":  3407000000,
                          "capex":  175000000,
                          "da":  321000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  10776000000,
                          "grossProfit":  null,
                          "operating":  5761000000,
                          "cfo":  4637000000,
                          "capex":  215000000,
                          "da":  373000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  12497000000,
                          "grossProfit":  null,
                          "operating":  6622000000,
                          "cfo":  5664000000,
                          "capex":  300000000,
                          "da":  437000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  21831000000,
                          "grossProfit":  null,
                          "operating":  7282000000,
                          "cfo":  6223000000,
                          "capex":  330000000,
                          "da":  459000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  24980000000,
                          "grossProfit":  null,
                          "operating":  9664000000,
                          "cfo":  8183000000,
                          "capex":  422000000,
                          "da":  522000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  23616000000,
                          "grossProfit":  null,
                          "operating":  8081000000,
                          "cfo":  7224000000,
                          "capex":  339000000,
                          "da":  580000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  29845000000,
                          "grossProfit":  null,
                          "operating":  10082000000,
                          "cfo":  9463000000,
                          "capex":  407000000,
                          "da":  726000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  22237000000,
                          "grossProfit":  null,
                          "operating":  12264000000,
                          "cfo":  11195000000,
                          "capex":  442000000,
                          "da":  750000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  25098000000,
                          "grossProfit":  null,
                          "operating":  14008000000,
                          "cfo":  11980000000,
                          "capex":  371000000,
                          "da":  799000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  28167000000,
                          "grossProfit":  null,
                          "operating":  15582000000,
                          "cfo":  14780000000,
                          "capex":  474000000,
                          "da":  897000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  32791000000,
                          "grossProfit":  null,
                          "operating":  18897000000,
                          "cfo":  17648000000,
                          "capex":  489000000,
                          "da":  1143000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  30241000000,
                    "revenue":  35083000000,
                    "grossProfit":  null,
                    "operating":  20465000000,
                    "cfo":  17437000000,
                    "capex":  735000000,
                    "da":  1195000000
                },
        "tags":  {
                     "revenue":  "Revenues",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "da":  "DepreciationAmortizationAndAccretionNet",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "SOFI",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  442659000,
                          "grossProfit":  326332000,
                          "operating":  null,
                          "cfo":  -54733000,
                          "capex":  37590000,
                          "da":  15955000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  565532000,
                          "grossProfit":  386636000,
                          "operating":  null,
                          "cfo":  -479336000,
                          "capex":  24549000,
                          "da":  69832000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  984872000,
                          "grossProfit":  727892000,
                          "operating":  null,
                          "cfo":  -1350217000,
                          "capex":  52261000,
                          "da":  101568000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  1573535000,
                          "grossProfit":  1260309000,
                          "operating":  null,
                          "cfo":  -7255858000,
                          "capex":  93201000,
                          "da":  151360000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  2122789000,
                          "grossProfit":  1742791000,
                          "operating":  null,
                          "cfo":  -7227139000,
                          "capex":  111409000,
                          "da":  201416000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  2674859000,
                          "grossProfit":  2213226000,
                          "operating":  null,
                          "cfo":  -1119807000,
                          "capex":  154265000,
                          "da":  203498000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  3613354000,
                          "grossProfit":  3004356000,
                          "operating":  null,
                          "cfo":  -3742458000,
                          "capex":  242444000,
                          "da":  234151000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  3057949000,
                    "revenue":  4305695000,
                    "grossProfit":  3611392000,
                    "operating":  null,
                    "cfo":  -8502490000,
                    "capex":  290499000,
                    "da":  262809000
                },
        "tags":  {
                     "revenue":  "RevenuesNetOfInterestExpense",
                     "costOfSales":  "CostOfRevenue",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquireProductiveAssets",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "IBKR",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2015-12-31",
                          "fy":  2015,
                          "revenue":  1189000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  725000000,
                          "capex":  null,
                          "da":  22000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  1396000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  635000000,
                          "capex":  null,
                          "da":  25000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  1702000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  1065000000,
                          "capex":  null,
                          "da":  25000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  1903000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  2356000000,
                          "capex":  null,
                          "da":  26000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  1937000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  2666000000,
                          "capex":  null,
                          "da":  31000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  2218000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  8068000000,
                          "capex":  null,
                          "da":  42000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  2714000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  5896000000,
                          "capex":  null,
                          "da":  50000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  3067000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  3968000000,
                          "capex":  null,
                          "da":  58000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  4340000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  4544000000,
                          "capex":  null,
                          "da":  65000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  5185000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  8724000000,
                          "capex":  null,
                          "da":  67000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  6205000000,
                          "grossProfit":  null,
                          "operating":  null,
                          "cfo":  15811000000,
                          "capex":  null,
                          "da":  61000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  5659000000,
                    "revenue":  6863000000,
                    "grossProfit":  null,
                    "operating":  null,
                    "cfo":  15915000000,
                    "capex":  null,
                    "da":  64000000
                },
        "tags":  {
                     "revenue":  "RevenuesNetOfInterestExpense",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "da":  "DepreciationAmortizationAndAccretionNet",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "DIS",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2017-09-30",
                          "fy":  2017,
                          "revenue":  55137000000,
                          "grossProfit":  null,
                          "operating":  14775000000,
                          "cfo":  null,
                          "capex":  3623000000,
                          "da":  2782000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-09-28",
                          "fy":  2019,
                          "revenue":  69607000000,
                          "grossProfit":  null,
                          "operating":  14847000000,
                          "cfo":  5984000000,
                          "capex":  4876000000,
                          "da":  4167000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-10-03",
                          "fy":  2020,
                          "revenue":  65388000000,
                          "grossProfit":  null,
                          "operating":  8108000000,
                          "cfo":  7616000000,
                          "capex":  4022000000,
                          "da":  5345000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-10-02",
                          "fy":  2021,
                          "revenue":  67418000000,
                          "grossProfit":  null,
                          "operating":  7766000000,
                          "cfo":  5566000000,
                          "capex":  3578000000,
                          "da":  5111000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-10-01",
                          "fy":  2022,
                          "revenue":  82722000000,
                          "grossProfit":  null,
                          "operating":  12121000000,
                          "cfo":  6002000000,
                          "capex":  4943000000,
                          "da":  5163000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-09-30",
                          "fy":  2023,
                          "revenue":  88898000000,
                          "grossProfit":  null,
                          "operating":  12863000000,
                          "cfo":  9866000000,
                          "capex":  4969000000,
                          "da":  5369000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-09-28",
                          "fy":  2024,
                          "revenue":  91361000000,
                          "grossProfit":  null,
                          "operating":  15601000000,
                          "cfo":  13971000000,
                          "capex":  5412000000,
                          "da":  4990000000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-09-27",
                          "fy":  2025,
                          "revenue":  94425000000,
                          "grossProfit":  null,
                          "operating":  17551000000,
                          "cfo":  18101000000,
                          "capex":  8024000000,
                          "da":  5326000000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-27",
                    "note":  "FY to 2025-09-27 + 272d to 2026-06-27 - same stretch to 2025-06-28",
                    "priorRevenue":  94535000000,
                    "revenue":  98861000000,
                    "grossProfit":  null,
                    "operating":  18238000000,
                    "cfo":  16989000000,
                    "capex":  8696000000,
                    "da":  5529000000
                },
        "tags":  {
                     "revenue":  "Revenues",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    },
    {
        "ticker":  "PAC",
        "currency":  "MXN",
        "years":  [
                      {
                          "end":  "2015-12-31",
                          "fy":  2015,
                          "revenue":  8106909000,
                          "grossProfit":  6548651000,
                          "operating":  4088600000,
                          "cfo":  4904753000,
                          "capex":  707558000,
                          "da":  1156435000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2016-12-31",
                          "fy":  2016,
                          "revenue":  11107561000,
                          "grossProfit":  9325190000,
                          "operating":  5234892000,
                          "cfo":  5641203000,
                          "capex":  16120000,
                          "da":  1348387000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2017-12-31",
                          "fy":  2017,
                          "revenue":  12365918000,
                          "grossProfit":  10255511000,
                          "operating":  6281731000,
                          "cfo":  6168702000,
                          "capex":  68046000,
                          "da":  1443562000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  14122890000,
                          "grossProfit":  11669168000,
                          "operating":  7244652000,
                          "cfo":  7235619000,
                          "capex":  240811000,
                          "da":  1569637000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  16226021000,
                          "grossProfit":  13481157000,
                          "operating":  8017238000,
                          "cfo":  8164057000,
                          "capex":  null,
                          "da":  1776137000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  11866373000,
                          "grossProfit":  9197666000,
                          "operating":  3819989000,
                          "cfo":  3566567000,
                          "capex":  null,
                          "da":  2000361000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  19014906000,
                          "grossProfit":  null,
                          "operating":  8857193000,
                          "cfo":  11095446000,
                          "capex":  null,
                          "da":  2050539000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  27380376000,
                          "grossProfit":  null,
                          "operating":  13814195000,
                          "cfo":  12519706000,
                          "capex":  null,
                          "da":  2313321000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  33224144000,
                          "grossProfit":  null,
                          "operating":  15138713000,
                          "cfo":  13934854000,
                          "capex":  null,
                          "da":  2545702000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  33614374000,
                          "grossProfit":  null,
                          "operating":  15050644000,
                          "cfo":  16674340000,
                          "capex":  null,
                          "da":  3061039000,
                          "form":  "20-F"
                      }
                  ],
        "ttm":  null,
        "tags":  {
                     "revenue":  "Revenue",
                     "costOfSales":  "CostOfSales",
                     "operating":  "ProfitLossFromOperatingActivities",
                     "cfo":  "CashFlowsFromUsedInOperatingActivities",
                     "capex":  "AdditionsOtherThanThroughBusinessCombinationsPropertyPlantAndEquipment",
                     "da":  "DepreciationAndAmortisationExpense",
                     "daDep":  "DepreciationExpense",
                     "daAmort":  "AmortisationExpense"
                 }
    },
    {
        "ticker":  "TBBB",
        "currency":  "MXN",
        "years":  [
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  23091181000,
                          "grossProfit":  3436091000,
                          "operating":  394053000,
                          "cfo":  1366308000,
                          "capex":  532173000,
                          "da":  436087000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  32580397000,
                          "grossProfit":  4924754000,
                          "operating":  520269000,
                          "cfo":  2116335000,
                          "capex":  1122877000,
                          "da":  667236000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  44078459000,
                          "grossProfit":  7039917000,
                          "operating":  793863000,
                          "cfo":  3140349000,
                          "capex":  1798019000,
                          "da":  905043000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  57439019000,
                          "grossProfit":  9376106000,
                          "operating":  1328509000,
                          "cfo":  3748537000,
                          "capex":  2435695000,
                          "da":  1237696000,
                          "form":  "20-F"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  78152943000,
                          "grossProfit":  12643474000,
                          "operating":  -675230000,
                          "cfo":  4681613000,
                          "capex":  3548943000,
                          "da":  1583365000,
                          "form":  "20-F"
                      }
                  ],
        "ttm":  null,
        "tags":  {
                     "revenue":  "Revenue",
                     "grossProfit":  "GrossProfit",
                     "costOfSales":  "CostOfSales",
                     "operating":  "ProfitLossFromOperatingActivities",
                     "cfo":  "CashFlowsFromUsedInOperatingActivities",
                     "capex":  "PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities",
                     "da":  "DepreciationAndAmortisationExpense",
                     "daDep":  "DepreciationPropertyPlantAndEquipment",
                     "daAmort":  "AdjustmentsForAmortisationExpense"
                 }
    },
    {
        "ticker":  "TPL",
        "currency":  "USD",
        "years":  [
                      {
                          "end":  "2018-12-31",
                          "fy":  2018,
                          "revenue":  300220000,
                          "grossProfit":  null,
                          "operating":  260834000,
                          "cfo":  195448000,
                          "capex":  47878000,
                          "da":  2583000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2019-12-31",
                          "fy":  2019,
                          "revenue":  490496000,
                          "grossProfit":  null,
                          "operating":  399573000,
                          "cfo":  342790000,
                          "capex":  32209000,
                          "da":  8906000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2020-12-31",
                          "fy":  2020,
                          "revenue":  302564000,
                          "grossProfit":  null,
                          "operating":  217261000,
                          "cfo":  207037000,
                          "capex":  5086000,
                          "da":  14395000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2021-12-31",
                          "fy":  2021,
                          "revenue":  450958000,
                          "grossProfit":  null,
                          "operating":  362393000,
                          "cfo":  265163000,
                          "capex":  16415000,
                          "da":  16257000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2022-12-31",
                          "fy":  2022,
                          "revenue":  667422000,
                          "grossProfit":  null,
                          "operating":  562307000,
                          "cfo":  447149000,
                          "capex":  18967000,
                          "da":  15376000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2023-12-31",
                          "fy":  2023,
                          "revenue":  631595000,
                          "grossProfit":  null,
                          "operating":  486053000,
                          "cfo":  418288000,
                          "capex":  null,
                          "da":  14757000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2024-12-31",
                          "fy":  2024,
                          "revenue":  705823000,
                          "grossProfit":  null,
                          "operating":  539138000,
                          "cfo":  490672000,
                          "capex":  null,
                          "da":  25162000,
                          "form":  "10-K"
                      },
                      {
                          "end":  "2025-12-31",
                          "fy":  2025,
                          "revenue":  798190000,
                          "grossProfit":  null,
                          "operating":  592161000,
                          "cfo":  545910000,
                          "capex":  null,
                          "da":  62533000,
                          "form":  "10-K"
                      }
                  ],
        "ttm":  {
                    "end":  "2026-06-30",
                    "note":  "FY to 2025-12-31 + 180d to 2026-06-30 - same stretch to 2025-06-30",
                    "priorRevenue":  742873000,
                    "revenue":  897541000,
                    "grossProfit":  null,
                    "operating":  672482000,
                    "cfo":  603151000,
                    "capex":  17199000,
                    "da":  67575000
                },
        "tags":  {
                     "revenue":  "RevenueFromContractWithCustomerExcludingAssessedTax",
                     "operating":  "OperatingIncomeLoss",
                     "cfo":  "NetCashProvidedByUsedInOperatingActivities",
                     "capex":  "PaymentsToAcquirePropertyPlantAndEquipment",
                     "da":  "DepreciationDepletionAndAmortization",
                     "daDep":  "Depreciation",
                     "daAmort":  "AmortizationOfIntangibleAssets"
                 }
    }
];
