// tsm-asml-data.js — TSMC Deep Dive ▸ Miscellaneous ▸ TSMC × ASML (MISC-asml). History only (SAB, Oct 16 2026).
// Source: SAB's TSMC dashboard v7 (Oct 16 2026), which compiles:
//   • ASML Form 20-F / Annual Reports — sales to ASML's LARGEST customer (€M and % of total net sales). ASML does not
//     name the customer; the dashboard identifies it as TSMC by cross-referencing ASML's Taiwan regional sales.
//   • ASML Annual Reports — total net sales; ASML Q3 2026 results (Oct 14 2026) — 2026 guidance, EUV units, backlog.
//   • TSMC Form 20-F — capital expenditures (US$). Sales to TSMC in US$ are the dashboard's € → US$ conversion.
//   • EUV units by customer — ESTIMATE (the dashboard's split; ASML does not report units by customer).

// [year, sales to largest customer €M, % of ASML total net sales] — ASML 20-F
export var ASML_TOP_CUST = [
  ['2017', 2454, 27.4], ['2018', 2477, 22.6], ['2019', 4689, 39.7], ['2020', 4390, 31.4], ['2021', 6880, 37.0],
  ['2022', 7050, 33.3], ['2023', 8770, 31.8], ['2024', 4680, 16.6], ['2025', 7800, 23.9]
];
// [year, TSMC capex US$B (20-F), ASML sales to TSMC US$B (converted), ASML total net sales US$B (converted)]
export var TSM_CAPEX_ASML = [
  ['2019', 14.9, 5.2, 13.2], ['2020', 17.2, 5.4, 17.0], ['2021', 30.0, 7.7, 20.8], ['2022', 36.3, 7.3, 22.1],
  ['2023', 30.4, 9.4, 29.5], ['2024', 29.8, 5.0, 30.5], ['2025', 40.9, 8.4, 35.2]
];
// [year, TSMC, Samsung, others] — low-NA EUV systems by customer, ESTIMATE
export var ASML_EUV_SPLIT = [
  ['2019', 10, 6, 6], ['2020', 12, 10, 9], ['2021', 17, 14, 11], ['2022', 16, 13, 11], ['2023', 21, 16, 16],
  ['2024', 18, 13, 13], ['2025', 19, 15, 14]
];
// ASML's own disclosures (Q3 2026 results, Oct 14 2026; backlog = last published, end-2025)
export var ASML_GUIDE = { sales2026: '€44–45B', euv2026: '~65', euv2027cap: '~85', backlog: '€38.8B', asOf: 'Oct 14, 2026' };
export var TSM_ASML_SRC = 'ASML Form 20-F / Annual Reports (sales to the largest customer, total net sales), ASML Q3 2026 results of Oct 14, 2026 (2026 guidance, EUV units, last published backlog), TSMC Form 20-F (capital expenditures) — compiled in SAB’s TSMC dashboard (Oct 16, 2026). ASML does not name its largest customer; it is identified as TSMC by cross-reference to ASML’s Taiwan sales. US$ figures are converted from €. Estimates and model rows, tagged on screen: EUV units by customer and to TSMC (ASML reports no customer split), Samsung sales (derived from ASML’s top-2 disclosure), machine economics (ASML Investor Day, Nov 2024, and industry data) and the EUV-to-N2 capacity model for 2026–2030 (SAB’s dashboard).';

// ── Added Oct 16 2026 (SAB: "todo lo necesario") — the rest of the dashboard's ASML view, every estimate tagged ──
// ASML net sales by customer group, € billion: [year, TSMC (largest customer, 20-F), Samsung (ESTIMATE: derived from
// ASML's disclosed top-2 share, 2021–2025 only), others, ASML total net sales]
export var ASML_BY_CUST = [
  ['2019', 4.69, null, 7.12, 11.81], ['2020', 4.39, null, 9.59, 13.98], ['2021', 6.88, 5.45, 6.27, 18.60],
  ['2022', 7.05, 4.77, 9.38, 21.20], ['2023', 8.77, 6.10, 12.73, 27.60], ['2024', 4.68, 3.93, 19.69, 28.30],
  ['2025', 7.80, 4.61, 20.29, 32.70]
];
// Low-NA EUV systems: [year, ASML production ceiling, delivered, of which to TSMC]. 2024–2025 delivered = ASML
// reported; 2026 = ASML guide (~65); 2027 ceiling = ASML's +30% capacity plan (~85); later years and every
// "to TSMC" figure = ESTIMATE (dashboard model).
export var ASML_EUV_CEIL = [
  ['2024', 65, 44, 18], ['2025', 65, 48, 19], ['2026E', 65, 65, 26], ['2027E', 85, 85, 34],
  ['2028E', 90, 90, 36], ['2029E', 100, 95, 38], ['2030E', 100, 100, 40]
];
// Machine economics — ESTIMATES (dashboard, from ASML Investor Day Nov 2024 and industry data). wfpm/machine =
// effective wafers per month ÷ critical passes per wafer.
// [system, unit cost, nominal wafers/hour, availability, effective wafers/month, node, passes per wafer, wafers/month per machine, constraint]
export var ASML_TOOL_ECON = [
  ['EUV NXE:3800E', '€227M', '185', '90%', '~120K', 'N2', '3–4 EUV', '~30–40K', 'Yes — the #1 bottleneck'],
  ['EUV NXE:3800E', '€227M', '185', '90%', '~120K', 'N3', '2–3 EUV', '~40–60K', 'Yes — the #1 bottleneck'],
  ['ArFi NXT:2050i', '€82M', '310', '88%', '~197K', 'N3 (non-EUV layers)', '10–14 ArFi', '~14–20K', 'Secondary'],
  ['ArFi NXT:2050i', '€82M', '310', '88%', '~197K', '28 nm mainstream', '4–6 ArFi', '~33–49K', 'Ample'],
  ['KrF NSR-S631E', '€38M', '250', '85%', '~153K', '28 nm+ specialty', '3–5 KrF', '~31–51K', 'Ample'],
  ['High-NA EXE:5200B', '€380M', '~90', '~85%', '~55K', 'A14 / A10 (future)', '2–3 High-NA', '~18–28K', 'Future bottleneck']
];
// EUV → N2 capacity: [year, EUV delivered to TSMC, allocated to N2, cumulative N2 fleet, N2 capacity K wfpm, implied
// wfpm per tool, context]. 2024–2025 capacity reflects TSMC's N2 start (volume production 2025); everything else,
// and all 2026–2030 rows, is the dashboard's MODEL (ESTIMATE).
export var TSM_EUV_N2 = [
  ['2024', 18, 5, 5, 3, 600, 'N2 pilot only; most EUV to N3 production'],
  ['2025', 19, 12, 17, 50, 2941, 'Volume production from 4Q; early yields'],
  ['2026E', 26, 18, 35, 115, 3286, 'Fab 20 and Fab 22 phase 2 online'],
  ['2027E', 34, 22, 57, 165, 2895, 'Arizona phase 2 takes its first EUV; split with N3'],
  ['2028E', 36, 28, 85, 195, 2294, 'A16 starts — EUV shared by N2, N3 and A16'],
  ['2029E', 38, 26, 111, 215, 1937, 'A14 risk production — a fourth EUV user'],
  ['2030E', 40, 24, 135, 232, 1719, 'N2 at peak; new EUV goes to the A14 ramp']
];
