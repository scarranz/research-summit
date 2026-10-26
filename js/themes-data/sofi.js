// themes-data/sofi.js — SoFi's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Once the portal saves a record (Supabase, company_theme_record)
// that copy wins and this seed is no longer read.
//
// Source: the eleven earnings calls Q4 2023 → Q2 2026 (docs/calls/SOFI.md and SOFI-latest.md, verbatim, supplied by the analyst;
// Quartr is not used). The analyst has no handwritten SoFi notes on file, so the threads are the ones management comes back to
// call after call: the Loan Platform Business, credit, deposits and funding cost, the fee mix, the Technology Platform, crypto
// and the stablecoin, the tax rate, tangible book value, and the annual guides. Every note is a paraphrase of what management
// said (no quotation marks); each figure is a number stated on that call. SoFi guides ADJUSTED measures.
//
// Open vs closed hooks: a thread that had a beginning and an end (a full-year guide, a dated promise) is its own sub-theme with
// `trackUntil` = the quarter it was settled, and its last note says how it landed ("Reconciled: …"), the outcome taken from the
// 10-K annuals in js/results-data/sofi.js (adjusted net revenue, adjusted EBITDA, members).
// Seed version: bump it when the seed is restructured; the Notes tab replaces a saved record older than this with the seed.
export var SOFI_THEMES_V = 2;
export var SOFI_THEMES = [
  // ── Lending ───────────────────────────────────────────────────────────────────────────────────
  { seg:'Lending', theme:'Loan Platform Business', st:{ k:'trend', since:'Q3 2024', last:'Q2 2026' },
    why:'The capital-light way to lend: SoFi originates, a partner funds the loan, SoFi keeps the fee. Watched for how much volume goes to partners against the balance sheet.',
    updates:[
      { q:'Q3 2024', items:['Record quarter: <b>$56M</b> of fee-based revenue, <b>more than 5x</b> year over year, driven by personal loan volume.'] },
      { q:'Q4 2024', items:['Added <b>$67M</b> to adjusted net revenue across the two segments.', 'Initial terms agreed with <b>Blue Owl</b> for up to <b>$5B</b> of personal loans over two years.'] },
      { q:'Q1 2025', items:['<b>$1.6B</b> of originations; <b>$96M</b> of adjusted net revenue, <b>+44%</b> on the quarter.'] },
      { q:'Q2 2025', items:['<b>$2.4B</b> of originations; <b>$131M</b> of adjusted net revenue, <b>+36%</b> on the quarter.'] },
      { q:'Q3 2025', items:['<b>$3.4B</b> of originations; total originations a record <b>$9.9B</b>.'] },
      { q:'Q4 2025', items:['<b>$3.7B</b> of originations; total originations a record <b>$10.5B</b>.'] },
      { q:'Q1 2026', items:['<b>$3.0B</b> of the <b>$12.2B</b> originated; the platform lets SoFi serve more borrowers than the balance sheet alone.'] },
      { q:'Q2 2026', items:['<b>$3.1B</b> of the <b>$14.8B</b> originated. Management balances balance-sheet loans with platform volume, which gives visibility of net interest income for the next <b>six to eight quarters</b>.'] },
    ]},
  { seg:'Lending', theme:'Credit quality', st:{ k:'watch', since:'Q4 2023', last:'Q2 2026' },
    why:'Charge-offs and delinquencies on the personal and student loan books, and the quarterly sale of late-stage delinquent loans.',
    updates:[
      { q:'Q4 2023', items:['On-balance-sheet 90-day personal loan delinquency <b>56 bp</b>, annualized charge-off <b>4.0%</b>; both normalizing toward pre-COVID levels as expected.'] },
      { q:'Q1 2024', items:['Student loan 90-day delinquency <b>13 bp</b>, charge-off <b>60 bp</b>. Sold <b>$62.5M</b> of late-stage delinquent personal loans.'] },
      { q:'Q3 2024', items:['Delinquencies peaked in <b>March 2024</b>; the quarter improved on delinquencies and cumulative fair value adjustments.'] },
      { q:'Q1 2025', items:['Credit trends strong a year after the peak. Sold <b>$90M</b> of late-stage delinquent personal loans, about the pace of every quarter since.'] },
      { q:'Q2 2025', items:['On-balance-sheet personal loan 90-day delinquency <b>42 bp</b>, <b>4 bp</b> lower on the quarter.'] },
      { q:'Q3 2025', items:['Net charge-offs on personal and student loans down more than <b>20 bp</b> in the quarter.'] },
      { q:'Q4 2025', items:['Personal loan annualized charge-off <b>280 bp</b>, <b>20 bp</b> higher than Q3.'] },
      { q:'Q1 2026', items:['All-in annualized net charge-off rate <b>4.4%</b> excluding delinquent loan sales, flat on the quarter and about <b>40 bp</b> below Q1 2025.'] },
      { q:'Q2 2026', items:['All-in annualized net charge-off rate <b>3.7%</b> excluding delinquent loan sales; sold <b>$90M</b> of late-stage delinquent personal loans.'] },
    ]},
  // ── Financial Services ────────────────────────────────────────────────────────────────────────
  { seg:'Financial Services', theme:'Deposits and funding cost', st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:'Deposits fund the loan book. Watched for growth, how much comes from direct-deposit members, and the cost of funds.',
    updates:[
      { q:'Q4 2023', items:['Deposits grew <b>$11.3B</b> in 2023 to <b>$18.6B</b>; over <b>90%</b> of consumer deposits come from direct-deposit members (median FICO <b>744</b>).'] },
      { q:'Q1 2024', items:['<b>3.9M</b> SoFi Money accounts, <b>+61%</b> year over year.'] },
      { q:'Q4 2024', items:['Cost of funds down <b>68 bp</b>, mostly offset by a <b>62 bp</b> decline in average yields.'] },
      { q:'Q1 2025', items:['Deposits <b>$27.3B</b>, lowering funding expense by an estimated <b>$515M</b> a year.'] },
      { q:'Q2 2025', items:['Deposits <b>$29.5B</b> (+$2.3B); cost of funds down <b>11 bp</b>.'] },
      { q:'Q3 2025', items:['Deposits <b>$32.9B</b> (+$3.4B), mostly member deposits.'] },
      { q:'Q4 2025', items:['Deposits <b>$37.5B</b> (+$4.6B), mostly member deposits.'] },
      { q:'Q1 2026', items:['Deposits <b>$40.2B</b> (+$2.7B); cost of funds down <b>25 bp</b>.'] },
      { q:'Q2 2026', items:['Deposits <b>$45.5B</b> (+$5.3B), strong member deposit growth.'] },
    ]},
  { seg:'Financial Services', theme:'Fee-based revenue and the non-lending mix', st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:'Financial Services plus Technology Platform as a share of adjusted net revenue, and fee-based revenue, the less capital-intensive part of the mix.',
    updates:[
      { q:'Q4 2023', items:['Financial Services plus Technology Platform were <b>40%</b> of fourth-quarter adjusted net revenue, from 34% a year earlier.'] },
      { q:'Q1 2024', items:['<b>42%</b> of adjusted net revenue.'] },
      { q:'Q2 2024', items:['<b>45%</b> of adjusted net revenue (38% a year earlier); Financial Services <b>$176M</b>, <b>+80%</b>.'] },
      { q:'Q2 2025', items:['<b>$472M</b>, <b>+74%</b>, <b>55%</b> of revenue.'] },
      { q:'Q3 2025', items:['<b>$534M</b>, <b>+57%</b>, <b>56%</b> of revenue; fee-based revenue a record <b>$409M</b>, <b>+50%</b>.'] },
      { q:'Q4 2025', items:['<b>$579M</b>, <b>+61%</b>, <b>57%</b> of revenue; fee-based revenue a record <b>$443M</b>, <b>+53%</b>.'] },
      { q:'Q1 2026', items:['Over <b>$500M</b>, <b>+24%</b>, just under half of revenue.'] },
      { q:'Q2 2026', items:['<b>$551M</b>, <b>46%</b> of adjusted net revenue.'] },
    ]},
  { seg:'Financial Services', theme:'Crypto and the SoFiUSD stablecoin', st:{ k:'promise', since:'Q4 2024', last:'Q2 2026' },
    why:'Re-entry into crypto as a licensed bank and the stablecoin that would settle SoFi\'s own flows. A promise to reconcile against what ships.',
    updates:[
      { q:'Q4 2024', items:['Management recalls that members asked for crypto in a 2018 survey.'] },
      { q:'Q1 2025', items:['Plans to enter other crypto areas over the next <b>6 to 24 months</b>, sooner by acquisition or if regulation allows.'] },
      { q:'Q2 2025', items:['<b>60%</b> of members who invest in crypto would rather use a nationally licensed bank than their current exchange.'] },
      { q:'Q3 2025', items:['<b>SoFiUSD</b> stablecoin hoped for launch in <b>2026</b>, to be integrated into the SoFi Pay wallet.'] },
      { q:'Q4 2025', items:['2026 plans: crypto-secured lending, institutional trading, correspondent payments, stablecoin-as-a-service, custody and the SoFi Exchange Network (24/7 settlement).'] },
      { q:'Q1 2026', items:['Began <b>minting SoFiUSD</b>.'] },
      { q:'Q2 2026', items:['Began settling the trading business in <b>SoFiUSD</b>; the <b>SoFi Exchange Network</b> processed its first commercial client transactions 24/7.'] },
    ]},
  { seg:'Financial Services', theme:'FY2025 member guide', st:{ k:'promise', since:'Q4 2024', last:'Q4 2025' }, trackUntil:'Q4 2025',
    why:'The member-growth promise for 2025: set at the start of the year, raised in the fall.',
    updates:[
      { q:'Q4 2024', items:['Guide for 2025: add at least <b>2.8M</b> members, at least <b>+28%</b>.'] },
      { q:'Q3 2025', items:['Raised to about <b>3.5M</b> members (about <b>+34%</b>), from <b>3M</b> and <b>+30%</b>.'] },
      { q:'Q4 2025', items:['Reconciled: members <b>10.13M</b> to <b>13.65M</b>, <b>+3.5M</b> (<b>+34.8%</b>), in line with the raised guide.'] },
    ]},
  // ── Technology Platform ───────────────────────────────────────────────────────────────────────
  { seg:'Technology Platform', theme:'Technology Platform revenue', st:{ k:'watch', since:'Q4 2023', last:'Q2 2026' },
    why:'The slowest-growing segment and the one with customer concentration. Management does not guide accounts; it has pointed to low double-digit to teens revenue growth.',
    updates:[
      { q:'Q4 2023', items:['Segment growth accelerated to <b>13%</b> year over year, on the way to about <b>20%</b> the next year, at a <b>32%</b> contribution margin.'] },
      { q:'Q1 2024', items:['Net revenue <b>$94M</b>, <b>+21%</b> year over year, <b>-3%</b> on the quarter.'] },
      { q:'Q2 2024', items:['<b>$95M</b>, <b>+9%</b> year over year.'] },
      { q:'Q3 2024', items:['Record <b>$103M</b>, <b>+14%</b> year over year.'] },
      { q:'Q4 2024', items:['<b>$103M</b>, <b>+6%</b> year over year.'] },
      { q:'Q2 2025', items:['<b>$110M</b>, <b>+15%</b> year over year. No guidance on accounts; the revenue guide is low double digits to teens growth.'] },
      { q:'Q1 2026', items:['Net revenue <b>$75M</b>, hurt by the loss of a previously discussed <b>large customer</b>.'] },
    ]},
  // ── Costs & capital ───────────────────────────────────────────────────────────────────────────
  { seg:'Costs & capital', theme:'Tangible book value and capital', st:{ k:'trend', since:'Q4 2023', last:'Q2 2026' },
    why:'Capital is what lets a bank-chartered SoFi keep lending on balance sheet. Tangible book value, the capital raises and the total capital ratio.',
    updates:[
      { q:'Q4 2023', items:['Tangible book value up for the sixth straight quarter, to <b>$3.5B</b>; SoFi Bank net income <b>$129M</b>, a <b>27%</b> margin and <b>16.8%</b> annualized return on equity.'] },
      { q:'Q3 2024', items:['Tangible book value <b>$4.4B</b> (+$236M).'] },
      { q:'Q4 2024', items:['<b>$4.9B</b>, up nearly <b>$1.4B</b> on the year.'] },
      { q:'Q1 2025', items:['<b>$5.1B</b>, <b>$4.58</b> per share (<b>$3.90</b> a year earlier).'] },
      { q:'Q2 2025', items:['<b>$5.3B</b>.'] },
      { q:'Q3 2025', items:['<b>$7.2B</b>, including a <b>$1.7B</b> common equity raise in July.'] },
      { q:'Q4 2025', items:['<b>$8.9B</b>, about <b>$7</b> per share (<b>+$2</b>); <b>$3.2B</b> of new capital raised in the year.'] },
      { q:'Q1 2026', items:['<b>$9.2B</b>, <b>$7.21</b> per share, <b>+57%</b> year over year.'] },
      { q:'Q2 2026', items:['<b>$9.5B</b>, <b>$7.34</b> per share, <b>+56%</b> year over year.'] },
    ]},
  { seg:'Costs & capital', theme:'Effective tax rate', st:{ k:'watch', since:'Q4 2024', last:'Q2 2026' },
    why:'The rate assumed in the EPS guide has moved from 26% to the mid-teens and back up; it explains several EPS surprises.',
    updates:[
      { q:'Q4 2024', items:['Normalized effective tax rate about <b>26%</b> for 2025, subject to discrete items and mix.'] },
      { q:'Q1 2025', items:['EPS included a small benefit, about <b>$0.01</b>, from a lower-than-expected tax rate.'] },
      { q:'Q2 2025', items:['Again a benefit of about <b>$0.01</b> from a lower-than-expected tax rate.'] },
      { q:'Q3 2025', items:['Q4 EPS guide of about <b>$0.12</b> assumes a fourth-quarter tax rate of about <b>10%</b>.'] },
      { q:'Q4 2025', items:['The 2026 guide assumes a <b>mid-teens</b> effective tax rate.'] },
      { q:'Q2 2026', items:['Adjusted EPS <b>$0.12</b> included a negative impact of about half a cent from a higher-than-expected tax rate. The full-year guide now assumes about <b>22%</b>, with EPS still about <b>$0.60</b>.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2024 revenue guide', st:{ k:'promise', since:'Q4 2023', last:'Q4 2024' }, trackUntil:'Q4 2024',
    why:'The adjusted net revenue guide for 2024, raised on every call of the year.',
    updates:[
      { q:'Q4 2023', items:['2023 delivered <b>$2.1B</b> of adjusted net revenue, <b>+35%</b>.'] },
      { q:'Q1 2024', items:['Guide <b>$2.39B to $2.43B</b>, <b>$25M</b> above the implied prior range.'] },
      { q:'Q2 2024', items:['Raised to <b>$2.425B to $2.465B</b>.'] },
      { q:'Q3 2024', items:['Raised to <b>$2.535B to $2.550B</b>, <b>$85M</b> higher.'] },
      { q:'Q4 2024', items:['Reconciled: FY2024 adjusted net revenue <b>$2,606M</b>, above the top of the last range; adjusted EBITDA <b>$666M</b> against a guide of $640M to $645M.'] },
    ]},
  { seg:'Costs & capital', theme:'FY2026 guide', st:{ k:'promise', since:'Q4 2025', last:'Q2 2026' },
    why:'The open guide for 2026, on an adjusted basis. To reconcile when the year closes.',
    updates:[
      { q:'Q4 2025', items:['Members up at least <b>30%</b> in 2026; EPS guide assumes a mid-teens tax rate.'] },
      { q:'Q2 2026', items:['Adjusted net revenue raised to <b>$4.75B to $4.85B</b> (about <b>+32% to +35%</b>), from about <b>$4.655B</b>. Adjusted EBITDA about <b>$1.6B</b>, adjusted net income about <b>$825M</b>, adjusted EPS about <b>$0.60</b>, all unchanged, at a <b>22%</b> tax rate; members still up at least <b>30%</b>.'] },
    ]},
];
