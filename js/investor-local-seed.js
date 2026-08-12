// investor-local-seed.js — LOCAL-DEV-ONLY preview data.
// Mirrors the seed rows in sql/014_investor_profiles.sql exactly, so the
// Hedge Funds investor detail page has something to show on localhost
// before San/Oscar run that migration in Supabase.
// Gated to location.hostname === 'localhost' in hedge-funds.js — never
// affects production.
// Delete this file once the migration has run and the real tables have data.

export const LOCAL_INVESTOR_RETURNS = [
  { investor_key: 'ackman', year: 2021, return_pct: 22.9 },
  { investor_key: 'ackman', year: 2022, return_pct: -7.8 },
  { investor_key: 'ackman', year: 2023, return_pct: 20.8 },
  { investor_key: 'ackman', year: 2024, return_pct: 8.2 },
  { investor_key: 'ackman', year: 2025, return_pct: 18.3 },
];

// Real Pershing Square Capital Management 13F-HR filings (SEC EDGAR CIK
// 0001336528), Q1 2020 through the latest quarter on file — see
// sql/014_investor_profiles.sql for the accession numbers and source notes.
// Pre-2023 filings report <value> in thousands of dollars; from 2022 Q4
// onward SEC filings report whole dollars — normalized to whole dollars
// here either way (verified against each filing's raw value, not assumed
// by date).
export const LOCAL_INVESTOR_HOLDINGS = [
  // 2020 Q1
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1054320000, weight_pct: 16.04, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'BRK.B', company_name: 'Berkshire Hathaway Inc Del', cusip: '084670702', value_usd: 997038000, weight_pct: 15.17, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 941002000, weight_pct: 14.32, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 904317000, weight_pct: 13.76, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 759910000, weight_pct: 11.56, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'SBUX', company_name: 'Starbucks Corp', cusip: '855244109', value_usd: 666012000, weight_pct: 10.13, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 616212000, weight_pct: 9.37, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 603825000, weight_pct: 9.19, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'BX', company_name: 'Blackstone Group Inc', cusip: '09260D107', value_usd: 24996000, weight_pct: 0.38, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 1, ticker: 'PK', company_name: 'Park Hotels Resorts Inc', cusip: '700517105', value_usd: 5362000, weight_pct: 0.08, rank: 10, source_type: 'sec_xml' },

  // 2020 Q2
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1717220000, weight_pct: 22.15, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1372252000, weight_pct: 17.7, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1222034000, weight_pct: 15.76, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 1115812000, weight_pct: 14.39, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1012845000, weight_pct: 13.06, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'SBUX', company_name: 'Starbucks Corp', cusip: '855244109', value_usd: 745541000, weight_pct: 9.62, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 2, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 567191000, weight_pct: 7.32, rank: 7, source_type: 'sec_xml' },

  // 2020 Q3
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2058004000, weight_pct: 23.33, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1444595000, weight_pct: 16.37, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1444236000, weight_pct: 16.37, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 1236365000, weight_pct: 14.01, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1140132000, weight_pct: 12.92, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'SBUX', company_name: 'Starbucks Corp', cusip: '855244109', value_usd: 870456000, weight_pct: 9.87, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 3, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 628877000, weight_pct: 7.13, rank: 7, source_type: 'sec_xml' },

  // 2020 Q4
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1988332000, weight_pct: 19.88, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1610292000, weight_pct: 16.1, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1530104000, weight_pct: 15.3, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1485344000, weight_pct: 14.85, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 1449856000, weight_pct: 14.49, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'SBUX', company_name: 'Starbucks Corp', cusip: '855244109', value_usd: 1077293000, weight_pct: 10.77, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2020, quarter: 4, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 861758000, weight_pct: 8.62, rank: 7, source_type: 'sec_xml' },

  // 2021 Q1
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2274232000, weight_pct: 21.74, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1557285000, weight_pct: 14.89, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1555232000, weight_pct: 14.87, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1543204000, weight_pct: 14.75, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 1500829000, weight_pct: 14.35, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1281402000, weight_pct: 12.25, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 1, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 748712000, weight_pct: 7.16, rank: 7, source_type: 'sec_xml' },

  // 2021 Q2
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1966957000, weight_pct: 18.37, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'A', company_name: 'Agilent Technologies Inc', cusip: '00846U101', value_usd: 1728762000, weight_pct: 16.14, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1683880000, weight_pct: 15.72, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1539117000, weight_pct: 14.37, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1527029000, weight_pct: 14.26, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1312787000, weight_pct: 12.26, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 2, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 951252000, weight_pct: 8.88, rank: 7, source_type: 'sec_xml' },

  // 2021 Q3
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2076571000, weight_pct: 21.94, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 2026035000, weight_pct: 21.41, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1702284000, weight_pct: 17.99, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1464720000, weight_pct: 15.48, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1195987000, weight_pct: 12.64, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 3, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 997897000, weight_pct: 10.54, rank: 6, source_type: 'sec_xml' },

  // 2021 Q4
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2645923000, weight_pct: 25.01, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1964590000, weight_pct: 18.57, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1948818000, weight_pct: 18.42, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1452512000, weight_pct: 13.73, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1386260000, weight_pct: 13.1, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2021, quarter: 4, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 1180692000, weight_pct: 11.16, rank: 6, source_type: 'sec_xml' },

  // 2022 Q1
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2063815000, weight_pct: 19.86, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1763528000, weight_pct: 16.97, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1510160000, weight_pct: 14.53, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1411185000, weight_pct: 13.58, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1393456000, weight_pct: 13.41, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'NFLX', company_name: 'Netflix Inc', cusip: '64110L106', value_usd: 1164962000, weight_pct: 11.21, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 841709000, weight_pct: 8.1, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 1, ticker: 'CP', company_name: 'Canadian Pac Ry Ltd', cusip: '13645T100', value_usd: 243019000, weight_pct: 2.34, rank: 8, source_type: 'sec_xml' },

  // 2022 Q2
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1782910000, weight_pct: 23.89, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1444794000, weight_pct: 19.36, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1194705000, weight_pct: 16.01, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1104215000, weight_pct: 14.8, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 926852000, weight_pct: 12.42, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'DPZ', company_name: 'Dominos Pizza Inc', cusip: '25754A201', value_usd: 803314000, weight_pct: 10.76, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 2, ticker: 'CP', company_name: 'Canadian Pac Ry Ltd', cusip: '13645T100', value_usd: 205627000, weight_pct: 2.76, rank: 7, source_type: 'sec_xml' },

  // 2022 Q3
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1948491000, weight_pct: 24.74, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1660862000, weight_pct: 21.08, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1286646000, weight_pct: 16.33, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1210009000, weight_pct: 15.36, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'CP', company_name: 'Canadian Pac Ry Ltd', cusip: '13645T100', value_usd: 1016616000, weight_pct: 12.91, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 3, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 754421000, weight_pct: 9.58, rank: 6, source_type: 'sec_xml' },

  // 2022 Q4
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2067075351, weight_pct: 23.53, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1564636715, weight_pct: 17.81, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1533465048, weight_pct: 17.46, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1267590449, weight_pct: 14.43, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1214706217, weight_pct: 13.83, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2022, quarter: 4, ticker: 'CP', company_name: 'Canadian Pac Ry Ltd', cusip: '13645T100', value_usd: 1136531112, weight_pct: 12.94, rank: 6, source_type: 'sec_xml' },

  // 2023 Q1
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 2006921717, weight_pct: 19.64, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1758148152, weight_pct: 17.21, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1624396305, weight_pct: 15.9, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1309955906, weight_pct: 12.82, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1278762560, weight_pct: 12.52, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'CP', company_name: 'Canadian Pac Ry Ltd', cusip: '13645T100', value_usd: 1172415105, weight_pct: 11.48, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 839256080, weight_pct: 8.21, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 1, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 226650050, weight_pct: 2.22, rank: 8, source_type: 'sec_xml' },

  // 2023 Q2
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 2039767512, weight_pct: 18.86, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1809947425, weight_pct: 16.73, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1685719445, weight_pct: 15.58, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1358396754, weight_pct: 12.56, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'HHC', company_name: 'Howard Hughes Corp', cusip: '44267D107', value_usd: 1307722394, weight_pct: 12.09, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1219265797, weight_pct: 11.27, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1134359279, weight_pct: 10.49, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 2, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 261544500, weight_pct: 2.42, rank: 8, source_type: 'sec_xml' },

  // 2023 Q3
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1746847743, weight_pct: 16.65, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1555452754, weight_pct: 14.82, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1547679990, weight_pct: 14.75, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 1468726924, weight_pct: 14, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1245896090, weight_pct: 11.87, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1236383161, weight_pct: 11.78, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1123258238, weight_pct: 10.7, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 3, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 569872269, weight_pct: 5.43, rank: 8, source_type: 'sec_xml' },

  // 2023 Q4
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1886737426, weight_pct: 18.15, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1824189788, weight_pct: 17.55, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1671801066, weight_pct: 16.08, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1612794075, weight_pct: 15.51, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1321528091, weight_pct: 12.71, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1193452444, weight_pct: 11.48, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 608325365, weight_pct: 5.85, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2023, quarter: 4, ticker: 'LOW', company_name: 'Lowes Cos Inc', cusip: '548661107', value_usd: 277189363, weight_pct: 2.67, rank: 8, source_type: 'sec_xml' },

  // 2024 Q1
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 2162590372, weight_pct: 20.1, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1958437506, weight_pct: 18.2, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1855009326, weight_pct: 17.24, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1427771711, weight_pct: 13.27, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1369036888, weight_pct: 12.72, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1330972704, weight_pct: 12.37, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 1, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 657273586, weight_pct: 6.11, rank: 7, source_type: 'sec_xml' },

  // 2024 Q2
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1953389678, weight_pct: 18.76, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1805270087, weight_pct: 17.34, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1628540681, weight_pct: 15.64, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1384377490, weight_pct: 13.3, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1221990788, weight_pct: 11.74, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1178244916, weight_pct: 11.32, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 726138789, weight_pct: 6.97, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 284736345, weight_pct: 2.73, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 2, ticker: 'NKE', company_name: 'Nike Inc', cusip: '654106103', value_usd: 229134749, weight_pct: 2.2, rank: 9, source_type: 'sec_xml' },

  // 2024 Q3
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 1739912181, weight_pct: 13.47, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1698823724, weight_pct: 13.15, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1660329807, weight_pct: 12.85, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1658825918, weight_pct: 12.84, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1459715316, weight_pct: 11.3, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'NKE', company_name: 'Nike Inc', cusip: '654106103', value_usd: 1439181879, weight_pct: 11.14, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1272634267, weight_pct: 9.85, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1261880235, weight_pct: 9.77, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 661159035, weight_pct: 5.12, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 57435934, weight_pct: 0.44, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 3, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215101', value_usd: 6179285, weight_pct: 0.05, rank: 11, source_type: 'sec_xml' },

  // 2024 Q4
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2004606527, weight_pct: 15.89, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1499199575, weight_pct: 11.88, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1486608040, weight_pct: 11.78, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1450100763, weight_pct: 11.5, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1437361516, weight_pct: 11.39, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'NKE', company_name: 'Nike Inc', cusip: '654106103', value_usd: 1420246144, weight_pct: 11.26, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 1344685349, weight_pct: 10.66, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1076695603, weight_pct: 8.54, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 754642178, weight_pct: 5.98, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2024, quarter: 4, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 140414651, weight_pct: 1.11, rank: 10, source_type: 'sec_xml' },

  // 2025 Q1
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'UBER', company_name: 'Uber Technologies Inc', cusip: '90353T100', value_usd: 2207742590, weight_pct: 18.5, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2149054073, weight_pct: 18.01, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1532780909, weight_pct: 12.85, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1396560901, weight_pct: 11.71, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1081582497, weight_pct: 9.07, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'CP', company_name: 'Canadian Pacific Kansas City', cusip: '13646K108', value_usd: 1039093677, weight_pct: 8.71, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 988003363, weight_pct: 8.28, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 686289227, weight_pct: 5.75, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 682825214, weight_pct: 5.72, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 107860557, weight_pct: 0.9, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 1, ticker: 'HTZ', company_name: 'Hertz Global Hldgs Inc', cusip: '42806J700', value_usd: 59100000, weight_pct: 0.5, rank: 11, source_type: 'sec_xml' },

  // 2025 Q2
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'UBER', company_name: 'Uber Technologies Inc', cusip: '90353T100', value_usd: 2827098321, weight_pct: 20.59, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2545770554, weight_pct: 18.54, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1524730589, weight_pct: 11.11, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'AMZN', company_name: 'Amazon Com Inc', cusip: '023135106', value_usd: 1277577297, weight_pct: 9.31, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1272514320, weight_pct: 9.27, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 1209537089, weight_pct: 8.81, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1121819859, weight_pct: 8.17, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 945117965, weight_pct: 6.88, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 807164145, weight_pct: 5.88, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'HTZ', company_name: 'Hertz Global Hldgs Inc', cusip: '42806J700', value_usd: 104096897, weight_pct: 0.76, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 2, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 93693497, weight_pct: 0.68, rank: 11, source_type: 'sec_xml' },

  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'UBER', company_name: 'Uber Technologies Inc', cusip: '90353T100', value_usd: 2965602648, weight_pct: 20.25, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2813167442, weight_pct: 19.21, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1549074099, weight_pct: 10.58, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1540217750, weight_pct: 10.52, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1469799913, weight_pct: 10.04, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'AMZN', company_name: 'Amazon Com Inc', cusip: '023135106', value_usd: 1278625494, weight_pct: 8.73, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 1177569836, weight_pct: 8.04, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'CMG', company_name: 'Chipotle Mexican Grill Inc', cusip: '169656105', value_usd: 844198727, weight_pct: 5.77, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 786253156, weight_pct: 5.37, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 115145038, weight_pct: 0.79, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 3, ticker: 'HTZ', company_name: 'Hertz Global Hldgs Inc', cusip: '42806J700', value_usd: 103639664, weight_pct: 0.71, rank: 11, source_type: 'sec_xml' },

  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2817787754, weight_pct: 18.15, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'UBER', company_name: 'Uber Technologies Inc', cusip: '90353T100', value_usd: 2468273945, weight_pct: 15.9, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'AMZN', company_name: 'Amazon Com Inc', cusip: '023135106', value_usd: 2217677936, weight_pct: 14.28, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 1934222720, weight_pct: 12.46, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'META', company_name: 'Meta Platforms Inc', cusip: '30303M102', value_usd: 1764796161, weight_pct: 11.37, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1560199922, weight_pct: 10.05, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1503829145, weight_pct: 9.69, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'HLT', company_name: 'Hilton Worldwide Hldgs Inc', cusip: '43300A203', value_usd: 869983734, weight_pct: 5.6, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 212306961, weight_pct: 1.37, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 99320131, weight_pct: 0.64, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2025, quarter: 4, ticker: 'HTZ', company_name: 'Hertz Global Hldgs Inc', cusip: '42806J700', value_usd: 78339393, weight_pct: 0.5, rank: 11, source_type: 'sec_xml' },

  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'BN', company_name: 'Brookfield Corp', cusip: '11271J107', value_usd: 2415946008, weight_pct: 17.62, rank: 1, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'AMZN', company_name: 'Amazon Com Inc', cusip: '023135106', value_usd: 2385104083, weight_pct: 17.39, rank: 2, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'UBER', company_name: 'Uber Technologies Inc', cusip: '90353T100', value_usd: 2154934398, weight_pct: 15.71, rank: 3, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'MSFT', company_name: 'Microsoft Corp', cusip: '594918104', value_usd: 2092970053, weight_pct: 15.26, rank: 4, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'QSR', company_name: 'Restaurant Brands Intl Inc', cusip: '76131D103', value_usd: 1673501194, weight_pct: 12.2, rank: 5, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'META', company_name: 'Meta Platforms Inc', cusip: '30303M102', value_usd: 1522358404, weight_pct: 11.1, rank: 6, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'HHH', company_name: 'Howard Hughes Holdings Inc', cusip: '44267T102', value_usd: 1192581569, weight_pct: 8.7, rank: 7, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'SEG', company_name: 'Seaport Entmt Group Inc', cusip: '812215200', value_usd: 107910794, weight_pct: 0.79, rank: 8, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'GOOG', company_name: 'Alphabet Inc', cusip: '02079K107', value_usd: 89421720, weight_pct: 0.65, rank: 9, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'HTZ', company_name: 'Hertz Global Hldgs Inc', cusip: '42806J700', value_usd: 70261595, weight_pct: 0.51, rank: 10, source_type: 'sec_xml' },
  { investor_key: 'ackman', year: 2026, quarter: 1, ticker: 'GOOGL', company_name: 'Alphabet Inc', cusip: '02079K305', value_usd: 9310043, weight_pct: 0.07, rank: 11, source_type: 'sec_xml' },
];

export const LOCAL_INVESTOR_LETTERS = [
  { investor_key: 'ackman', year: 2025, title: '2025 Annual Report', category: 'annual_letter', date: '2026-02-18', type: 'link', url: 'https://assets.pershingsquareholdings.com/wp-content/uploads/2026/02/18175039/Pershing-Square-Holdings-Ltd.-2025-Annual-Report.pdf', sort_order: 1 },
  { investor_key: 'ackman', year: 2024, title: '2024 Annual Report', category: 'annual_letter', date: '2025-03-14', type: 'link', url: 'https://assets.pershingsquareholdings.com/2025/03/14183709/Pershing-Square-Holdings-Ltd.-2024-Annual-Report-1.pdf', sort_order: 2 },
  { investor_key: 'ackman', year: 2023, title: '2023 Annual Report', category: 'annual_letter', date: '2024-03-22', type: 'link', url: 'https://assets.pershingsquareholdings.com/2024/03/22201541/Pershing-Square-Holdings-Ltd.-2023-Annual-Report.pdf', sort_order: 3 },
  { investor_key: 'ackman', year: 2022, title: '2022 Annual Report', category: 'annual_letter', date: '2023-03-29', type: 'link', url: 'https://assets.pershingsquareholdings.com/2023/03/29160536/Pershing-Square-Holdings-Ltd.-2022-Annual-Report.pdf', sort_order: 4 },
  { investor_key: 'ackman', year: 2021, title: '2021 Annual Report', category: 'annual_letter', date: '2022-03-29', type: 'link', url: 'https://assets.pershingsquareholdings.com/2022/03/29140526/Pershing-Square-Holdings-Ltd.-2021-Annual-Report.pdf', sort_order: 5 },
  { investor_key: 'ackman', year: 2025, title: 'June 2025 Interim Report', category: 'investor_message', date: '2025-06-30', type: 'link', url: 'https://assets.pershingsquareholdings.com/wp-content/uploads/2025/08/20192925/Pershing-Square-Holdings-Ltd.-June-2025-Interim.pdf', sort_order: 10 },
];
