/* ═════════════ DATA (frozen; € millions unless noted) ═════════════ */
const AS_OF = 'Oct 19 2026';
const MKT = { px: 1495.60, pxUsd: 1664.29, sharesM: 383.0, pxDate: 'Oct 19 2026 (intraday)' };  // shares = Q3'26 NI €4,960M ÷ basic EPS €12.95

const Q_LBL = ["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25","Q1'26","Q2'26","Q3'26","Q4'26E"];
const Q_TOT = [3534.4,5430.5,5778.3,6430.2,6746.2,6902.3,6673.0,7237.0,5290.0,6242.8,7467.3,9262.8,7741.5,7691.7,7516,9718,8767,9326,11662,14700];
const Q_SYS = [2287.2,4140.5,4255.0,4747.7,5342.0,5606.1,5308.0,5682.5,3965.9,4760.9,5926.0,7115.8,5740.2,5596.1,5553.8,7584.0,6279.0,6564,8373,11000];
const Q_GP  = [1731.0,2664.5,2993.7,3310.9,3413.2,3544.0,3461.6,3717.3,2696.6,3212.2,3793.4,4789.8,4179.7,4129.5,3880,5068,4645,5035,6700,8379];
const Q_OP  = [784.6,1653.4,1938.5,2124.2,2205.0,2263.0,2182.4,2391.6,1391.4,1834.6,2441.2,3355.4,2737.9,2664.1,2468,3431,3158,3456,5173,6779];
const Q_EST = 19;   // index of the first estimated quarter (Q4'26 guide midpoint: sales 14.7B, IBM 3.7B, GM 57%, opex 1.6B)
const Q_EPS = { "Q4'25":7.35, "Q1'26":7.15, "Q2'26":7.59, "Q3'26":12.95 };   // basic, €

const A_LBL = ['2022','2023','2024','2025','2026 9M'];
const A_MEM = [5.5,6.0,8.6,8.4,10.3];
const A_LOG = [10.0,16.0,13.2,16.1,11.0];
const A_IBM = [5.7,5.6,6.5,8.2,8.5];

const MIX = {
  "Q2'26": { sys: 6564,
    tech: [['EUV',57],['ArFi',29],['ArF dry',4],['KrF',6],['I-line',1],['Metrology & Insp.',3]],
    end:  [['Logic',51],['Memory',49]],
    reg:  [['South Korea',43],['Taiwan',30],['China',14],['USA',9],['Japan',4]],
    units:[['EUV',16],['ArFi',23],['ArF dry',8],['KrF',35],['I-line',9]] },
  "Q3'26": { sys: 8373,
    tech: [['EUV',49],['ArFi',39],['ArF dry',3],['KrF',5],['I-line',1],['Metrology & Insp.',3]],
    end:  [['Logic',54],['Memory',46]],
    reg:  [['Taiwan',32],['South Korea',31],['China',23],['USA',13],['Rest of Asia',1]],
    units:[['EUV',17],['ArFi',40],['ArF dry',10],['KrF',35],['I-line',19]] }
};
const C = { navy:'#1E2733', blue:'#2563EB', lblue:'#93B1F0', green:'#3E5A82', orange:'#5E8BEC', purple:'#7C8694', grey:'#A9B4C2', lgrey:'#C8D7F4', steel:'#3E5A82', deep:'#1B3F94', mid:'#7C8694', mu:'#8A93A0', bdr:'#E7EAEE', grid:'#EEF1F5' };  // Summit portal tokens (css/base.css) + the results.js blue ramp
const COL = { 'EUV':'#2563EB','ArFi':'#3E5A82','ArF dry':'#93B1F0','KrF':'#1E2733','I-line':'#A9B4C2','Metrology & Insp.':'#C8D7F4',
  'Logic':'#2563EB','Memory':'#1E2733','Taiwan':'#1E2733','South Korea':'#3E5A82','China':'#2563EB','USA':'#93B1F0','Japan':'#A9B4C2','Rest of Asia':'#C8D7F4' };

const ttmEps = Object.values(Q_EPS).reduce((a,b)=>a+b,0);
