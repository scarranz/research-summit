/* ═════════════ DATA FOR THE MODEL TABS (Financials · Cash & financing · Valuation) ═════════════
   Frozen. Nothing is fetched. $ millions unless stated. Years are calendar (FYE Dec).
   CONS = Bloomberg consensus (BEst), file "SPCX BBG CONSENSUS.xlsx", Annual sheet, pulled Nov 25 2026.
   JPM  = J.P. Morgan, "Super Intelligence Singularity; Raising PT to $500" (Oct 21 2026), Figure 2 (new estimates).
   Index 0 = 2025A, 1..5 = 2026E..2030E. */

const MYEARS = ['2025A','2026E','2027E','2028E','2029E','2030E'];

const PRICE = { px:125.81, date:'Nov 24 2026', src:'Nasdaq close (Investing.com / TradingView)', sharesOut:13581.1 };

const CONS = {
  asof:'Nov 25 2026',
  space: { rev:[4086,4926.4,7147.6,8224.2,10827.5,17962.6], ebitda:[653,-158.1,1810.0,3130.3,3745.4,6728.0],
           capex:[3832,5842.9,12902.7,11462.8,13517.5,10824.5], da:[757,767.1,1197.5,1922.1,2731.1,3316.0],
           launches:[170,154,201,264,701,1103], starship:[5,4.7,48.7,101.2,522.5,1134.7] },
  conn:  { consumer:[7208,11046.8,16680.3,25580.3,37297.6,51256.7], entgov:[4179,7866.4,14031.2,26305.2,46910.2,75126.6],
           revField:[11387,18756.8,29655.1,50818.8,84300.7,132315.1],
           ebitda:[7168,11913.3,18408.3,32188.3,52029.7,80390.4], capex:[4178,6434.1,19013.1,23736.0,31894.2,39126.5],
           da:[2376,3684.9,5315.7,7101.0,9769.0,13489.6], subs:[8.9,16.02,27.85,46.43,71.46,104.56], arpu:[81,66.68,59.44,53.40,49.31,46.13] },
  si:    { ads:[1844,1997.8,3374.7,5443.6,8608.5,13694.7], infra:[1357,24013.3,156315.3,293574.9,383194.2,497679.9],
           revField:[3201,25643.2,153931.2,317640.8,443387.0,578849.8],
           ebitda:[-1237,14449.8,103890.9,206150.5,282379.9,389319.2], capexField:[12727,75405.4,254219.4,261100.7,268864.0,334972.4],
           da:[3568,9601.5,37015.0,66747.9,88573.0,122755.4], gw:[0.8,2.702,9.547,15.756,22.265,33.756] },
  /* Headline (company-level) fields — a different set of contributors from the segment fields, so segments do not add up to these */
  tot:   { rev:[18674,49399.4,187354.8,340943.0,510344.6,683326.3], ebitda:[6584,25580.7,119658.4,238436.2,350817.9,486023.3],
           cfo:[6785,27418.7,120360.6,235882.3,343237.3,443392.2], capex:[20737,82425.0,263353.5,269456.9,307641.2,378429.7],
           fcf:[-13952,-58272.8,-140369.9,-58300.0,20545.3,70615.5], da:[6701,13983.6,40433.1,74835.0,101752.7,140583.0],
           sbc:[1947,5941.2,12322.8,15401.2,15104.7,16384.6], netInt:[1453,862.7,6362.5,12417.6,15832.7,16763.6],
           tax:[718,-235.4,3076.9,1852.1,16171.1,47397.9], pretax:[-4219,4466.9,65186.5,138618.7,225387.9,316479.4],
           ni:[-4937,2542.2,49482.4,139237.4,217472.1,264255.8],
           shares:[2926,9388.7,12959.9,13143.8,13326.0,13444.9], epsAdj:[-1.69,0.409,4.407,9.542,14.579,18.388], epsGaap:[-1.69,0.275,4.22,8.528,13.189,18.006],
           debtProceeds:[16055,67406.5,156110.8,73075.3,19166.3,-6250.5], debt:[22896,41795.0,187860.5,280916.2,376654.4,420511.1] },
  /* 2027 by quarter (Quarterly sheet) — used only to shape the intra-year cash path */
  q27: { cfo:[19304.7,28542.3,36394.2,46505.5], capex:[47526.5,64821.3,78322.6,99680.4] },
  q4_26: { cfo:14788.8, capex:37511.4 }
};

/* J.P. Morgan, Oct 21 2026 (new estimates). Index 1..5 = 2026E..2030E; index 0 = 2025A from the same table where given. */
const JPM = {
  date:'Oct 21 2026', pt:500, ptBasis:'~20× 2028E GAAP EPS, Dec-2027 target',
  ptHistory:[['Jul 7 2026',225,'~41× 2028E GAAP EPS of $5.50'],['Aug 5 2026',240,''],['Oct 21 2026',500,'~20× 2028E GAAP EPS of ~$25']],
  rev:[18674,51057,254127,616492,822552,1127693], ebitda:[6585,27023,167992,410215,567321,836411],
  capex:[null,87192,294566,389119,286800,400011], fcf:[null,-48228,-81609,-31072,276742,355990],
  cfo:[6786,38965,212957,358047,null,null], epsGaap:[null,0.68,8.24,25.41,30.82,37.71],
  space:{ rev:[4086,5128,7591,7819,8054,8456], ebitda:[653,-64,2861,3117,2961,3674], capex:[3832,5592,11364,5372,6322,6799] },
  conn: { rev:[11387,19083,28576,49244,81706,140208], ebitda:[7168,12134,18070,29450,47124,78126], capex:[4178,5814,22823,25712,38657,50552],
          subs:[8.9,15.8,27.3,42.3,64.3,94.3], arpu:[81,67,55,48,42,38] },
  si:   { rev:[3201,26846,217960,559429,732792,979028], ebitda:[-1237,14953,147061,377648,517235,754610], capex:[12727,75786,260379,358035,241821,342660],
          gw:[0.8,2.8,10.1,20.2,29.3,48.3] },
  arrGrid:{ gw:[7,8,9,10,11,12,13], perW:[20,30,40,50,60] },   // FAQ deck, "Illustrative YE27 ARR potential" = GW × $/W
  launches:{ yrs:['2027E','2028E','2029E','2030E','2031E'], supply:[60,300,1000,2250,5000] },
  /* Illustrative neocloud model per 1 GW (initiation, Jul 2026, Figure 9 / 93) */
  perGW:{ dcBuild:10.0, dcBuildTrad:13.5, itEquip:22.8, itEquipHigh:35, opex:1.73,
          cases:[['$15/W',15,87.2,23.3],['$20/W',20,90.4,40.6],['$50/W',50,96.2,129.9]], highCost15:{ irr:7.2, npv:-5.6 } },
  anthropicBlended:29, anthropicHopper:13, blackwell:50
};

/* Debt stack. On balance sheet: 10-Q Q2 2026 note 9 (Jun 30) and Q3 release total (Sep 30). Saturn: press (Bloomberg, Nov 20–21 2026). */
const DEBT = {
  bsTotal:38844, related:12897, liquidity:89855,
  tranches:[ ['2031',5.350],['2033',5.650],['2036',5.875],['2046',6.600],['2056',6.650] ],
  bondTotal:25000, bondCoupon:5.855, bondEff:6.03, bondWAM:11.7,
  stack:[ ['SpaceX Notes (Jun 2026 bond)',25000,'Unsecured, investment grade, 5 tranches 2031–2056, 5.855% avg coupon'],
          ['Valor sale-leasebacks (related party)',13329,'Colossus equipment sold and leased back; booked as debt (Nov 2025, Jan & Apr 2026)'],
          ['Finance leases',1079,''], ['X notes remnant',27,'2027 and 2030 notes'] ],
  maturities:{ '2026':944, '2027':2402, '2028':2867, '2029':3422, '2030':3597, later:25201 },
  saturn:{ notes:32000, package:44000, gpus:47300, yieldA3:8.259, rating:'Moody\'s A3 / KBRA A- (prelim.)', term:'~5-year lease, hell-or-high-water',
           tranches:[['Class A-3 (Apr 2033)',25200],['Class A-2 (Apr 2031)',4400],['Class B (subordinated)',2400]] },
  bond2031Yield:7.2
};
