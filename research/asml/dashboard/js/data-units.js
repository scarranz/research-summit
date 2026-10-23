/* MACHINE VOLUMES — data shared by The Machines view (moved out of the retired Volume Model view, vm.v3.bak, Oct 23 2026). */
/* ═════════════ VOLUME MODEL (vm) — how many machines, of which kind, and how many can ASML ship? ═════════════
   Every number is frozen here. Sources:
   - Annual litho units by technology 2015–2025: 20-F Note 2 / segment note (FY2017, FY2019, FY2022, FY2025 20-F), via asml-work/data/annual.json.
     EUV split NXE (0.33 NA) / EXE (High-NA) from the FY2025 20-F (2023 EXE = 0). 2015–2022 are reported as "EUV" only; High-NA did not exist
     yet (first EXE revenue Q4 2024), so they sit in the 0.33 NA series and High-NA is left empty (null), not zero.
   - Quarterly litho units by technology Q1'22–Q3'26: 6-K presentations "Net system sales breakdown (Quarterly)", via asml-work/data/quarterly.json.
   - New / used litho units: Q4 results 6-Ks (annual) and quarterly press releases. Logic / memory units: 20-F Note 2 (systems incl. M&I).
   - Consensus: Bloomberg BST, Oct 16 2026 (asml-work/data/bbg_s1.tsv annual, bbg_s2.tsv quarterly). Low-NA / High-NA rows, not BBG's "EUV" row.
   - Investor Day unit grids and capacity: asml-work/data/targets.json (6-Ks listed there). Q3'26 capacity wording: Q3 2026 press release (6-K, Oct 14 2026). */

/* ── families (colours = BRIEF palette) ── */
const VM_FAM = [
  { k:'hna',  n:'High-NA EUV',     c:'#1B3F94' },
  { k:'euv',  n:'EUV (0.33 NA)',   c:'#2563EB' },
  { k:'arfi', n:'ArFi',            c:'#3E5A82' },
  { k:'arfd', n:'ArF dry',         c:'#93B1F0' },
  { k:'krf',  n:'KrF',             c:'#1E2733' },
  { k:'il',   n:'i-line',          c:'#A9B4C2' }
];
const VM_FAM_Q = [ { k:'eua', n:'EUV (all NA)', c:'#2563EB' }, ...VM_FAM.slice(2) ];   // quarterly: High-NA not stated every quarter → EUV combined

/* ── annual, litho units (new + used), 20-F; 2026E–2029E Bloomberg consensus Oct 16 2026 (fractional = average of contributors) ── */
const VM_A_LBL = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026E','2027E','2028E','2029E'];
const VM_A_EST = 11;   // index of first consensus year
const VM_A = {
  hna:  [null,null,null,null,null,null,null,null,0,2,4,            4.9393,5.3536,7.8135,12.3636],
  euv:  [1,4,11,18,26,31,42,40,53,42,44,                            65.1369,88.0317,112.0727,111.1667],
  arfi: [67,70,76,86,82,68,81,81,125,129,131,                       132.1944,167.0632,206.0513,207.6],
  arfd: [9,6,13,16,22,22,22,28,32,28,16,                            35.6667,44.4667,48.6429,47.375],
  krf:  [74,57,71,78,65,103,131,151,184,152,78,                     142.6121,151.7455,162.7143,164.495],
  il:   [18,20,26,26,34,34,33,45,55,65,54,                          59.8571,69.4267,75.564,73.22]
};
/* Bloomberg's own aggregate rows (bbg_s1.tsv rows 33, 36, 54, 41) — shown as memo lines because they do not add up to the family rows */
const VM_BBG_ROW = { euv:[69.0833,92.2817,117.8974,122], duv:[417,438,480,null], tot:[435.4667,515.0854,590.2601,592.44], mi:[221.7539,266.8288,366.5575,349.1246] };

/* ── quarterly, litho units by technology (6-K) + Bloomberg quarterly consensus Q4'26E–Q4'27E (bbg_s2.tsv; EUV = Low-NA + High-NA rows) ── */
const VM_Q_LBL = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26",
                  "Q4'26E","Q1'27E","Q2'27E","Q3'27E","Q4'27E"];
const VM_Q_EST = 19;
const VM_Q = {
  eua:  [3,12,12,13,17,12,11,13,11,8,11,14,14,11,9,14,16,16,17,       20.8611,20.5,22.7111,25.1,25.5],
  arfi: [18,21,20,22,25,39,32,29,20,32,38,39,25,31,38,37,17,23,40,     51.6875,39.25,40.75,42.6759,46.0833],
  arfd: [6,8,6,8,7,6,9,10,4,11,7,6,3,4,4,5,5,8,10,                    13.2667,11.75,11,11.3333,12.75],
  krf:  [26,38,38,49,43,43,44,54,25,33,42,52,22,16,11,29,30,35,35,     42.2,35.8333,36.5833,38.0152,42.1667],
  il:   [9,12,10,14,8,13,16,18,10,16,18,21,13,14,10,17,11,9,19,       22.2857,15.6364,17.0909,16.4545,18.4]
};
/* High-NA (EXE) systems recognised, as stated by ASML (quarterly_notes.md); null = not stated (Q1–Q3'25 sum to 2 from the FY total of 4) */
const VM_Q_HNA = [0,0,0,0,0,0,0,0,0,0,0,2,null,null,null,2,2,1,null];
const VM_Q_NEW  = [59,83,80,95,96,107,105,113,66,89,106,119,73,67,66,94,67,86,113];
const VM_Q_USED = [3,8,6,11,4,6,7,11,4,11,10,13,4,9,6,8,12,5,8];

/* ── new vs used (litho units, Q4 6-Ks) and logic vs memory (systems incl. M&I, 20-F Note 2) ── */
const VM_NU_LBL  = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026 9M'];
const VM_NU_NEW  = [144,139,173,207,203,236,286,317,421,380,300,266];
const VM_NU_USED = [25,18,24,17,26,22,23,28,28,38,27,25];
const VM_LM_LOG  = [null,null,145,125,238,260,327,357,439,399,364,null];   // 2015–16 split as Foundry/IDM in € only; 2026 not disclosed in units
const VM_LM_MEM  = [null,null,147,213,106,135,178,204,161,184,171,null];

/* ── capacity: Investor Day grids (ASML litho units) + 2022 capacity plan; groups ── */
const VM_GRP = [
  { k:'lna', n:'Low-NA EUV',  fam:['euv'] },
  { k:'hna', n:'High-NA EUV', fam:['hna'] },
  { k:'arfi',n:'ArFi',        fam:['arfi'] },
  { k:'dry', n:'Dry DUV',     fam:['arfd','krf','il'] },
  { k:'duv', n:'All DUV',     fam:['arfi','arfd','krf','il'] },
  { k:'tot', n:'Total litho', fam:['hna','euv','arfi','arfd','krf','il'] }
];
// Investor Day 2022 (6-K 0001193125-22-283523 Ex.99.3): ASML units, low / high market. Dry = ArF dry + KrF + i-line.
const VM_CMD22 = { 2025:{ low:{hna:5,lna:65,arfi:75,dry:180,tot:325}, high:{hna:5,lna:80,arfi:105,dry:385,tot:575} },
                   2030:{ low:{hna:15,lna:65,arfi:85,dry:250,tot:415}, high:{hna:30,lna:80,arfi:115,dry:425,tot:650} } };
// Investor Day 2021 2025 grid, restated as ASML units in the 2022 CFO deck
const VM_CMD21 = { low:{hna:5,lna:48,arfi:63,dry:124,tot:240}, high:{hna:5,lna:70,arfi:78,dry:189,tot:342} };
// Investor Day 2018 2025 grid — WORLDWIDE litho units (not ASML), four modeled points; quadrant labels garbled in the source
const VM_CMD18 = [ {hna:9,lna:55,arfi:60,dry:200,tot:324}, {hna:7,lna:43,arfi:40,dry:150,tot:240}, {hna:5,lna:32,arfi:35,dry:140,tot:212}, {hna:3,lna:45,arfi:40,dry:150,tot:238} ];
// Investor Day 2022 capacity plan: 90 low-NA EUV + 600 DUV a year (2025–26), High-NA 20 a year (2027–28). Not restated at the 2024 Investor Day.
const VM_CAP = { lna:{v:90, yrs:['2025','2026']}, duv:{v:600, yrs:['2025','2026']}, hna:{v:20, yrs:['2027','2028']} };
