// tsm-fabs-data.js — TSMC Deep Dive ▸ Miscellaneous ▸ Fabs & Capacity (MISC-fabs).
//
// Two kinds of number live here and every row says which it is:
//   • REPORTED — TSMC Form 20-F for FY2025, Item 4 "Manufacturing Capacity and Technology": the fab list with
//     year of commercial production, wafer size and most advanced node in volume production (as of Feb 28, 2026 /
//     2025 year-end) and the annual capacity (>17M 12-inch-equivalent wafers in 2025); quarterly wafer shipments
//     from TSMC's quarterly Management Reports (compiled in SAB's TSMC dashboard v7, Oct 16 2026).
//   • ESTIMATE — per-fab capacity (K wafers per month), CoWoS capacity, stages of fabs not yet in the 20-F list, and
//     the 2015–2019 annual shipments: SAB's TSMC dashboard v7, from TrendForce, JPMorgan and TSMC call commentary.
//     TSMC does not disclose capacity by fab, node or region. Shown with an "estimate" tag (SAB, Oct 16 2026).
// Locations are the science-park / city coordinates, not plant addresses.

// [key, fab, location, country, lat, lon, start year (20-F) or stage, wafer, most advanced node (20-F, nm), status, est. capacity K wfpm, note]
// status: 'op' in operation (20-F list) · 'ramp' ramping · 'build' under construction · 'plan' planned · 'pkg' advanced packaging
export var TSM_FABS = [
  ['f2',  'Fab 2',  'Hsinchu Science Park',        'TW', 24.78, 121.00, '1990', '6-inch',  '450', 'op',   null, ''],
  ['f3',  'Fab 3',  'Hsinchu Science Park',        'TW', 24.77, 121.01, '1995', '8-inch',  '150', 'op',   null, ''],
  ['f5',  'Fab 5',  'Hsinchu Science Park',        'TW', 24.78, 121.02, '1997', '8-inch',  '150', 'op',   null, ''],
  ['f8',  'Fab 8',  'Hsinchu Science Park',        'TW', 24.77, 121.00, '1998', '8-inch',  '110', 'op',   null, ''],
  ['f6',  'Fab 6',  'Southern Taiwan Science Park','TW', 23.10, 120.27, '2000', '8-inch',  '110', 'op',   null, ''],
  ['f12', 'Fab 12', 'Hsinchu Science Park',        'TW', 24.82, 121.02, '2001', '12-inch', '40',  'op',   80,   'Dashboard lists N7/N10/N16 capacity here; the 20-F gives 40 nm as the most advanced node in volume production at 2025 year-end.'],
  ['f14', 'Fab 14', 'Southern Taiwan Science Park','TW', 23.02, 120.23, '2004', '12-inch', '16',  'op',   120,  '28 nm / 40 nm and specialty hub.'],
  ['f15', 'Fab 15', 'Central Taiwan Science Park', 'TW', 24.21, 120.62, '2012', '12-inch', '7',   'op',   166,  'Largest single-fab capacity in the dashboard estimate.'],
  ['f18', 'Fab 18', 'Southern Taiwan Science Park','TW', 22.96, 120.16, '2020', '12-inch', '3',   'op',   120,  'The main N3 production site.'],
  ['f20', 'Fab 20', 'Hsinchu Science Park',        'TW', 24.80, 121.08, '2025', '12-inch', '2',   'ramp', 30,   'N2 — volume production began in 2025; estimate ramps to ~65K wfpm.'],
  ['f22', 'Fab 22', 'Southern Taiwan Science Park (Kaohsiung)','TW', 22.73, 120.32, '2025', '12-inch', '2', 'ramp', 10, 'Second N2 site; estimate ramps to ~65K wfpm.'],
  ['f10', 'Fab 10', 'Shanghai, China',             'CN', 31.03, 121.23, '2004', '8-inch',  '150', 'op',   null, ''],
  ['f16', 'Fab 16', 'Nanjing, China',              'CN', 32.06, 118.78, '2018', '12-inch', '16',  'op',   32,   'Wholly owned; U.S. export rules limit upgrades.'],
  ['f11', 'Fab 11 (WaferTech)', 'Camas, Washington, U.S.', 'US', 45.59, -122.40, '1998', '8-inch', '150', 'op', 10, ''],
  ['f21', 'Fab 21 (Arizona), phase 1', 'Phoenix, Arizona, U.S.', 'US', 33.75, -112.13, '2024', '12-inch', '5', 'op', 15, 'N4 volume production since 4Q24; estimate ramps to ~24K wfpm.'],
  ['f23', 'Fab 23 (JASM)', 'Kumamoto, Japan',      'JP', 32.88, 130.83, '2024', '12-inch', '28',  'op',   40,   'Joint venture (JASM) with Sony, Denso and Toyota.'],
  ['az2', 'Fab 21 (Arizona), phase 2', 'Phoenix, Arizona, U.S.', 'US', 33.73, -112.10, 'Volume 3Q27 (TSMC guide)', '12-inch', '3 (N3)', 'build', null, 'Tool move-in under way (Oct 2026).'],
  ['az3', 'Fab 21 (Arizona), phase 3', 'Phoenix, Arizona, U.S.', 'US', 33.71, -112.07, 'Planned', '12-inch', '2 / A16', 'plan', null, 'Groundwork started Mar 2025.'],
  ['j2',  'JASM fab 2',  'Kumamoto, Japan',         'JP', 32.91, 130.88, 'Under construction', '12-inch', 'N3/N6/N7', 'build', null, 'Plan upgraded to N3.'],
  ['f24', 'Fab 24 (ESMC)', 'Dresden, Germany',      'DE', 51.12, 13.71, 'Production targeted 2027', '12-inch', '12–28', 'build', null, 'Joint venture (ESMC); in the 20-F 2026 capex plan.'],
  ['f25', 'Fab 25',  'Central Taiwan Science Park', 'TW', 24.24, 120.66, 'Planned', '12-inch', 'A14', 'plan', null, ''],
  ['ap6', 'AP6 (advanced packaging)', 'Zhunan, Taiwan', 'TW', 24.68, 120.89, '2023', '—', 'CoWoS / SoIC', 'pkg', 20, ''],
  ['ap8', 'AP8 (advanced packaging)', 'Tainan, Taiwan', 'TW', 22.98, 120.18, '2025', '—', 'CoWoS-L',      'pkg', 15, ''],
  ['ap7', 'AP7 (advanced packaging)', 'Chiayi, Taiwan', 'TW', 23.45, 120.30, 'Equipment move-in 1Q26', '—', 'CoWoS-L / SoIC', 'pkg', null, 'Planned as the largest packaging site.']
];
export var TSM_CAPACITY_2025 = '>17M';   // 12-inch-equivalent wafers, 2025 (20-F Item 4); ~17M in 2024

// Quarterly wafer shipments, million 12-inch-equivalent wafers — TSMC quarterly Management Reports.
export var TSM_WAFERS_Q = {
  q: ["4Q19","1Q20","2Q20","3Q20","4Q20","1Q21","2Q21","3Q21","4Q21","1Q22","2Q22","3Q22","4Q22","1Q23","2Q23","3Q23","4Q23","1Q24","2Q24","3Q24","4Q24","1Q25","2Q25","3Q25","4Q25","1Q26","2Q26","3Q26"],
  v: [2.823,2.925,2.985,3.240,3.246,3.359,3.449,3.646,3.725,3.778,3.799,3.974,3.702,3.227,2.916,2.902,2.957,3.030,3.125,3.338,3.418,3.259,3.718,4.085,3.961,4.174,4.336,4.476]
};
// CoWoS capacity, K wafers per month, year-end — ESTIMATE (TrendForce / JPMorgan via SAB's dashboard); 2026 = target.
export var TSM_COWOS = { y: ['2022','2023','2024','2025','2026E'], v: [8, 13, 35, 78, 127] };
export var TSM_FABS_SRC = 'Reported: TSMC Form 20-F for FY2025, Item 4 (fab list as of Feb 28, 2026; capacity >17M 12-inch-equivalent wafers in 2025) and TSMC quarterly Management Reports (wafer shipments). Estimates: per-fab capacity, CoWoS capacity and the stages of fabs not yet in the 20-F list — SAB’s TSMC dashboard (Oct 16, 2026) from TrendForce, JPMorgan and TSMC call commentary; TSMC does not disclose capacity by fab, node or region.';
