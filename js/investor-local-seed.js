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
// 0001336528), four consecutive quarters — see sql/014_investor_profiles.sql
// for the accession numbers and source notes.
export const LOCAL_INVESTOR_HOLDINGS = [
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
