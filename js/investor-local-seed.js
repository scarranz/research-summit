// investor-local-seed.js — LOCAL-DEV-ONLY preview data.
// Mirrors the seed rows in sql/014_investor_profiles.sql exactly, so the
// Hedge Funds investor pop-up has something to show on localhost before
// San/Oscar run that migration in Supabase.
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

export const LOCAL_INVESTOR_HOLDINGS = [
  { investor_key: 'ackman', year: 2025, ticker: 'BN', company_name: 'Brookfield Corp', weight_pct: 18.15, rank: 1 },
  { investor_key: 'ackman', year: 2025, ticker: 'UBER', company_name: 'Uber Technologies', weight_pct: 15.9, rank: 2 },
  { investor_key: 'ackman', year: 2025, ticker: 'AMZN', company_name: 'Amazon.com', weight_pct: 14.28, rank: 3 },
  { investor_key: 'ackman', year: 2025, ticker: 'GOOG', company_name: 'Alphabet Cl C', weight_pct: 12.46, rank: 4 },
  { investor_key: 'ackman', year: 2025, ticker: 'META', company_name: 'Meta Platforms', weight_pct: 11.37, rank: 5 },
];

export const LOCAL_INVESTOR_LETTERS = [
  { investor_key: 'ackman', year: 2025, title: '2025 Annual Report', category: 'annual_letter', date: '2026-02-18', type: 'link', url: 'https://assets.pershingsquareholdings.com/wp-content/uploads/2026/02/18175039/Pershing-Square-Holdings-Ltd.-2025-Annual-Report.pdf', sort_order: 1 },
  { investor_key: 'ackman', year: 2024, title: '2024 Annual Report', category: 'annual_letter', date: '2025-03-14', type: 'link', url: 'https://assets.pershingsquareholdings.com/2025/03/14183709/Pershing-Square-Holdings-Ltd.-2024-Annual-Report-1.pdf', sort_order: 2 },
  { investor_key: 'ackman', year: 2023, title: '2023 Annual Report', category: 'annual_letter', date: '2024-03-22', type: 'link', url: 'https://assets.pershingsquareholdings.com/2024/03/22201541/Pershing-Square-Holdings-Ltd.-2023-Annual-Report.pdf', sort_order: 3 },
  { investor_key: 'ackman', year: 2022, title: '2022 Annual Report', category: 'annual_letter', date: '2023-03-29', type: 'link', url: 'https://assets.pershingsquareholdings.com/2023/03/29160536/Pershing-Square-Holdings-Ltd.-2022-Annual-Report.pdf', sort_order: 4 },
  { investor_key: 'ackman', year: 2021, title: '2021 Annual Report', category: 'annual_letter', date: '2022-03-29', type: 'link', url: 'https://assets.pershingsquareholdings.com/2022/03/29140526/Pershing-Square-Holdings-Ltd.-2021-Annual-Report.pdf', sort_order: 5 },
  { investor_key: 'ackman', year: 2025, title: 'June 2025 Interim Report', category: 'investor_message', date: '2025-06-30', type: 'link', url: 'https://assets.pershingsquareholdings.com/wp-content/uploads/2025/08/20192925/Pershing-Square-Holdings-Ltd.-June-2025-Interim.pdf', sort_order: 10 },
];
