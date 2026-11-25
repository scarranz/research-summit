// results-data/spcx.js — SpaceX. Contract in docs/RESULTS_CONVENTIONS.md §2. Reference for a no-Summit dataset: dhr.js.
//
// WHAT IS AND IS NOT IN HERE
//   `act`    — reported. FY2023–FY2025 and 1Q25 from the 424B4 prospectus (Jun 12 2026, notes to the financial
//              statements); 2Q25/2Q26 from the Q2 2026 10-Q; 3Q25/3Q26 from the Q3 2026 earnings release (8-K, Oct 20
//              2026); 1Q26 from the prospectus' interim statements. Every quarter was cross-checked against the
//              reported ("Rep") columns of the Bloomberg export below, and segment lines add to the totals. 4Q25 is
//              DERIVED as the fiscal year less the three published quarters (no 4Q25 release exists — SpaceX was private).
//   `cons`   — Bloomberg BEst consensus, SAB's export `SPCX BBG CONSENSUS.xlsx` (Research\DCF\Technology - SAB\SPCX),
//              Annual and Quarterly sheets, pulled Nov 25 2026. FORWARD PERIODS ONLY (4Q26 onward / FY2026 onward).
//   `summit` — EMPTY. SpaceX is not in the Summit DCF universe (`search_ticker('SPCX')` → no_matches, Nov 25 2026).
//   `guideLo/Hi` — the company's own numeric guidance from the Q3 2026 call (Oct 20 2026): 1Q27 revenue $33–37B and
//              4Q26 capex $35–40B. CFO and Musk targets in words (e.g. "$100B ARR by December") are not bands and live
//              in Miscellaneous ▸ Stated Targets, not here (§5.5).
//
// THE CONSENSUS DOES NOT ADD UP, AND THAT IS THE SOURCE, NOT A TYPO. Each Bloomberg field averages a different set of
// analysts, so (i) the segment lines do not sum to the total-revenue field (FY2028: segments $376.7B vs total $340.9B),
// (ii) the annual sheet is not the sum of the quarterly sheet (2027 revenue $187.4B annual vs $197.9B in quarters), and
// (iii) the quarterly compute (MW) field comes with broken units (5,004,753,750 for 2Q27). Rows here carry each field
// as Bloomberg gives it, normalised to MW for compute; the totals are never recomputed from segments.
//
// NO VINTAGE AXIS (`estMatrix`) AND NO `evolution` BLOCK: one Bloomberg export is one reading, not a series.
//
// Top Line ▸ Segments (js/segments-data/spcx.js, when built) reads these keys with `from: 'results:<key>'`.

var Q = ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27','1Q28','2Q28','3Q28','4Q28'];
var Y = ['2023','2024','2025','2026','2027','2028','2029','2030'];
var N7 = [null,null,null,null,null,null,null];          // reported quarters 1Q25–3Q26 carry no consensus
var N3 = [null,null,null];                               // reported years 2023–2025 carry no consensus
function q(act, cons){ return { periods:Q, act:act.concat([null,null,null,null,null,null,null,null,null]), summit:[], cons:N7.concat(cons) }; }
function y(act, cons){ return { periods:Y, act:act.concat([null,null,null,null,null]), summit:[], cons:N3.concat(cons) }; }
function m(meta, data){ return Object.assign({}, meta, data); }

var D4Q = '4Q25 is the fiscal year less the three published quarters.';

export var spcxResults = {
  updated: 'Nov 2026',
  intro: 'How SpaceX has grown quarter by quarter since 2025, and what the Street expects from here. Three segments: Space (launch and spacecraft), Connectivity (Starlink) and SI — Super Intelligence, formerly AI: rented compute, Grok, X and Cursor. Consensus is Bloomberg; there is no Summit model for SpaceX.',
  source: 'Reported: 424B4 prospectus (Jun 12 2026), Q2 2026 10-Q, Q3 2026 earnings release (8-K, Oct 20 2026) via SEC EDGAR; 4Q25 derived (fiscal year less three quarters). Consensus: Bloomberg BEst export (SPCX US Equity, Annual and Quarterly sheets), pulled Nov 25 2026, forward periods only. Guidance: Q3 2026 call (1Q27 revenue, 4Q26 capex). No Summit model.',

  views: {
    q: {
      label: 'Quarterly',
      note: 'Reported 1Q25–3Q26; consensus 4Q26–4Q28 (Bloomberg, Nov 25 2026). 4Q25 is derived. Each consensus row is the Bloomberg field as given, so segments do not add to the total and the quarters do not add to the annual consensus.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'space', 'conn', 'si'] },
                   { label: 'Revenue lines', keys: ['launchsvc', 'launchdev', 'consumer', 'entgov', 'ads', 'aiinfra'] },
                   { label: 'Operating metrics', keys: ['subs', 'arpu', 'gw', 'launches'] }] },
        { key: 'margins', label: 'Margins & profitability', defaultMetric: 'ebitda',
          groups: [{ label: 'Adjusted EBITDA', keys: ['ebitda', 'spaceebitda', 'connebitda', 'siebitda'] },
                   { label: 'GAAP', keys: ['opinc', 'ni', 'eps'] },
                   { label: 'Cash', keys: ['cfo', 'capex', 'fcf'] }] }
      ],
      metrics: {
        rev: m({ label:'Revenue', short:'Revenue', unit:'usdM' }, Object.assign(q([4067,4071,5576,4960,4694,7814,14575],
          [22849,33567,42783,54198,67322,85073,101992,120186,135708]),
          { guideLo:[null,null,null,null,null,null,null,null,33000,null,null,null,null,null,null,null],
            guideHi:[null,null,null,null,null,null,null,null,37000,null,null,null,null,null,null,null],
            note:'1Q27 guidance $33–37B (Q3 call, Oct 20 2026) — about four times the 3Q26 quarter. The Street sits at $33.6B, at the bottom of the band. ' + D4Q })),
        space: m({ label:'Space — revenue', short:'Space', unit:'usdM' }, Object.assign(q([865,746,1666,809,619,962,1767],
          [1581,1794,1859,1917,1888,2072,1968,2280,2134]), { note:'Launch services plus launch & development. Starlink launches are internal and earn no Space revenue. ' + D4Q })),
        conn: m({ label:'Connectivity (Starlink) — revenue', short:'Connectivity', unit:'usdM' }, Object.assign(q([2475,2588,3097,3227,3257,4291,5248],
          [5977,6301,7032,7849,8491,9285,10741,12961,14399]), { note:'Consumer plus enterprise & government. ' + D4Q })),
        si: m({ label:'SI (Super Intelligence) — revenue', short:'SI', unit:'usdM' }, Object.assign(q([727,737,813,924,818,2561,7560],
          [15114,25730,34139,44299,56786,68950,83045,99085,114694]), { note:'Advertising (X) plus AI solutions & infrastructure (rented compute, Grok, Cursor from Aug 2026). Called "AI" until 2026. The jump from 2Q26 is the compute rental contracts (Anthropic, Google, Reflection AI). ' + D4Q })),
        launchsvc: m({ label:'Launch services', short:'Launch svc', unit:'usdM' }, Object.assign(q([566,490,1000,520,330,648,1130],
          [875,1058,1193,1240,1345,1505,1260,1672,1374]), { note:'Space segment. ' + D4Q })),
        launchdev: m({ label:'Launch & development', short:'Launch & dev', unit:'usdM' }, Object.assign(q([299,256,666,289,289,314,637],
          [639,647,569,718,682,583,473,473,484]), { note:'Space segment: Dragon missions and development contracts (e.g. Starship for Artemis). ' + D4Q })),
        consumer: m({ label:'Starlink consumer', short:'Consumer', unit:'usdM' }, Object.assign(q([1492,1721,1986,2009,2148,2485,3121],
          [3286,3426,3780,4300,4642,5347,5791,6950,7369]), { note:'Connectivity segment: subscriptions and kits. ' + D4Q })),
        entgov: m({ label:'Starlink enterprise & government', short:'Ent. & gov.', unit:'usdM' }, Object.assign(q([983,867,1111,1218,1109,1806,2127],
          [2825,2799,3316,3775,4083,3904,4993,6022,6918]), { note:'Connectivity segment: aviation, maritime, enterprise, Starshield and other government. ' + D4Q })),
        ads: m({ label:'Advertising (X)', short:'Advertising', unit:'usdM' }, Object.assign(q([443,426,454,521,343,367,538],
          [737,740,835,852,1012,944,1023,1120,1294]), { note:'SI segment. ' + D4Q })),
        aiinfra: m({ label:'AI solutions & infrastructure', short:'AI solutions', unit:'usdM' }, Object.assign(q([284,311,359,403,475,2194,7022],
          [14664,25636,34421,44735,57551,68299,78748,89248,98931]), { note:'SI segment: compute rented to AI labs, Grok subscriptions and API, Cursor. ' + D4Q })),
        subs: m({ label:'Starlink subscribers', short:'Subscribers', unit:'count', unitLabel:'thousands' }, Object.assign(q([5000,6000,7200,8900,10300,12000,13600],
          [16017,18352,21035,23988,27107,28970,32343,35759,38843]), { note:'Consumer broadband subscribers at quarter end, thousands. 4Q25 = the year-end figure. Bloomberg reported column; the Q3 2026 release gives 13.6M.' })),
        arpu: m({ label:'Starlink consumer ARPU', short:'ARPU', unit:'eps' }, Object.assign(q([86,85,83,null,66,66,69],
          [65.01,60.15,57.84,56.74,54.74,52.77,51.59,51.30,49.76]), { note:'US$ per subscriber per month. Falls as growth shifts to cheaper markets; 4Q25 not disclosed by quarter.' })),
        gw: m({ label:'Compute — nameplate draw', short:'Compute (MW)', unit:'count', unitLabel:'MW' }, Object.assign(q([300,400,null,800,1000,1400,1700],
          [2703,3699,5005,7279,9554,10689,12460,14452,16312]), { note:'Megawatts of nameplate compute at quarter end (1,700 MW = 1.7 GW). Bloomberg\'s quarterly field mixes units (e.g. 5,004,753,750 for 2Q27); every cell is normalised to MW here. Management: 2.5–3 GW at end-2026 and +10 GW during 2027 (Q3 call).' })),
        launches: m({ label:'Rocket launches', short:'Launches', unit:'count', unitLabel:'launches' }, Object.assign(q([38,46,44,42,40,38,35],
          [42,42,45,50,58,46,46,47,54]), { note:'All SpaceX launches (Falcon and Starship) in the quarter. 3Q25 and 4Q25 from the 9M 2025 total (128) and the 2025 total (170). Launches fell in 2026 as Starship development took priority.' })),
        ebitda: m({ label:'Adjusted EBITDA', short:'Adj. EBITDA', unit:'usdM', marginOf:'rev', marginLabel:'Adjusted EBITDA margin' }, Object.assign(q([1730,1214,2169,1471,1127,3538,8809],
          [12523,20427,27166,35638,45281,57482,70292,83924,95236]), { note:'Company-defined adjusted EBITDA (excludes D&A, stock-based pay, acquisition costs, restructuring). Equal to the sum of the segments in every reported quarter. ' + D4Q })),
        spaceebitda: m({ label:'Space — adjusted EBITDA', short:'Space EBITDA', unit:'usdM', marginOf:'space', marginLabel:'Segment EBITDA margin' }, Object.assign(q([224,-93,674,-152,-351,-205,357],
          [43,462,483,524,466,913,898,917,1068]), { note:'Starship development is expensed here, which is why the segment loses money in most quarters. ' + D4Q })),
        connebitda: m({ label:'Connectivity — adjusted EBITDA', short:'Conn. EBITDA', unit:'usdM', marginOf:'conn', marginLabel:'Segment EBITDA margin' }, Object.assign(q([1618,1583,1923,2044,2087,2597,3499],
          [3750,3995,4331,4964,5411,5923,6908,8565,9552]), { note:'The profit engine. 3Q26 includes ~3 points of one-off tariff refunds (Q3 call). ' + D4Q })),
        siebitda: m({ label:'SI — adjusted EBITDA', short:'SI EBITDA', unit:'usdM', marginOf:'si', marginLabel:'Segment EBITDA margin' }, Object.assign(q([-112,-276,-428,-421,-609,1146,4953],
          [9115,15099,21415,28723,38170,41321,48468,56939,64438]), { note:'Turned positive with the compute rental contracts in 2Q26. ' + D4Q })),
        opinc: m({ label:'Operating income (GAAP)', short:'Op. income', unit:'usdM', marginOf:'rev', marginLabel:'Operating margin' }, Object.assign(q([27,-970,-273,-1373,-1943,-143,2791],
          [5468,10198,16005,22241,30970,37135,52206,67447,83601]), { note:'3Q26 SI operating income includes $1.2B of stock-based pay tied to the Cursor acquisition. ' + D4Q })),
        ni: m({ label:'Net income (GAAP)', short:'Net income', unit:'usdM', marginOf:'rev', marginLabel:'Net margin' }, Object.assign(q([-528,-1008,-1054,-2347,-4276,-541,4404],
          [4073,5799,11476,16010,22105,46164,57858,70564,82401]), { note:'3Q26 profit came largely from other income, interest on the IPO cash and a $390M tax credit — operating income was $2.8B. The 1Q28 consensus step reflects a different analyst set, not a modelled event. ' + D4Q })),
        eps: m({ label:'Diluted EPS', short:'EPS', unit:'eps' }, Object.assign(q([-0.18,-0.34,null,null,-1.27,-0.09,0.35],
          [0.40,0.69,0.96,1.28,1.70,2.30,3.03,3.71,4.35]), { note:'Reported quarters are GAAP (SpaceX reports no adjusted EPS). 3Q25 and 4Q25 not reported per quarter; FY2025 was −$1.69. Share count jumped with the xAI merger (Feb 2026) and the IPO (Jun 2026). Consensus is Bloomberg\'s adjusted diluted EPS field — its GAAP field mixes analyst sets (it drops in 1Q28) and is shown in the annual view.' })),
        cfo: m({ label:'Cash from operations', short:'CFO', unit:'usdM', marginOf:'rev', marginLabel:'CFO % of revenue' }, Object.assign(q([727,-376,3769,2665,1047,2419,9631],
          [14789,19305,28542,36394,46506,59883,70893,90477,103014]), { note:'Quarterly cash-flow statement (4Q25 derived).' })),
        capex: m({ label:'Capital expenditure', short:'CapEx', unit:'usdM', marginOf:'rev', marginLabel:'CapEx % of revenue' }, Object.assign(q([4140,2825,6881,6891,10107,18369,19593],
          [37511,47527,64821,78323,99680,67894,72174,88683,104817]),
          { guideLo:[null,null,null,null,null,null,null,35000,null,null,null,null,null,null,null,null],
            guideHi:[null,null,null,null,null,null,null,40000,null,null,null,null,null,null,null,null],
            note:'4Q26 guidance $35–40B (Q3 call). SI was 84% of 3Q26 capex. The 1Q28 drop is the consensus field, not a modelled slowdown: several contributors stop their quarterly capex in 2027.' })),
        fcf: m({ label:'Free cash flow', short:'FCF', unit:'usdM', marginOf:'rev', marginLabel:'FCF % of revenue' }, Object.assign(q([-3413,-3201,-3112,-4226,-9060,-15950,-9962],
          [-23711,-25727,-33056,-37450,-43940,-8010,-1280,1795,-1803]), { note:'Cash from operations less capex. The consensus field is its own average, so it does not equal CFO less capex consensus in every quarter.' }))
      }
    },

    y: {
      label: 'Annual',
      note: 'FY2023–FY2025 reported (424B4, consolidated with xAI and X); FY2026–FY2030 Bloomberg consensus, Nov 25 2026. FY2026 is three-quarters reported, so its consensus is mostly arithmetic on the first nine months.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'space', 'conn', 'si'] },
                   { label: 'Revenue lines', keys: ['launchsvc', 'launchdev', 'consumer', 'entgov', 'ads', 'aiinfra'] },
                   { label: 'Operating metrics', keys: ['subs', 'arpu', 'gw', 'launches'] }] },
        { key: 'margins', label: 'Margins & profitability', defaultMetric: 'ebitda',
          groups: [{ label: 'Adjusted EBITDA', keys: ['ebitda', 'spaceebitda', 'connebitda', 'siebitda'] },
                   { label: 'GAAP', keys: ['opinc', 'ni', 'eps'] },
                   { label: 'Cash', keys: ['cfo', 'capex', 'fcf'] }] }
      ],
      metrics: {
        rev: m({ label:'Revenue', short:'Revenue', unit:'usdM' }, Object.assign(y([10387,14015,18674],[49399,187355,340943,510345,683326]),
          { note:'The consensus total-revenue field. The segment consensus lines add to more than this from 2027 (FY2028: $376.7B) — different analyst sets.' })),
        space: m({ label:'Space — revenue', short:'Space', unit:'usdM' }, Object.assign(y([3557,3796,4086],[4926,7148,8224,10828,17963]), { note:'' })),
        conn: m({ label:'Connectivity (Starlink) — revenue', short:'Connectivity', unit:'usdM' }, Object.assign(y([3869,7599,11387],[18757,29655,50819,84301,132315]), { note:'' })),
        si: m({ label:'SI (Super Intelligence) — revenue', short:'SI', unit:'usdM' }, Object.assign(y([2961,2620,3201],[25643,153931,317641,443387,578850]), { note:'Called "AI" in the prospectus. Where the Street\'s growth sits: 2027 consensus is six times 2026.' })),
        launchsvc: m({ label:'Launch services', short:'Launch svc', unit:'usdM' }, Object.assign(y([1964,2584,2576],[2985,4194,4950,8524,17734]), { note:'' })),
        launchdev: m({ label:'Launch & development', short:'Launch & dev', unit:'usdM' }, Object.assign(y([1593,1212,1510],[1878,2617,3082,3657,4272]), { note:'' })),
        consumer: m({ label:'Starlink consumer', short:'Consumer', unit:'usdM' }, Object.assign(y([2817,4830,7208],[11047,16680,25580,37298,51257]), { note:'' })),
        entgov: m({ label:'Starlink enterprise & government', short:'Ent. & gov.', unit:'usdM' }, Object.assign(y([1052,2769,4179],[7866,14031,26305,46910,75127]), { note:'' })),
        ads: m({ label:'Advertising (X)', short:'Advertising', unit:'usdM' }, Object.assign(y([2323,1728,1844],[1998,3375,5444,8608,13695]), { note:'' })),
        aiinfra: m({ label:'AI solutions & infrastructure', short:'AI solutions', unit:'usdM' }, Object.assign(y([638,892,1357],[24013,156315,293575,383194,497680]), { note:'' })),
        subs: m({ label:'Starlink subscribers', short:'Subscribers', unit:'count', unitLabel:'thousands' }, Object.assign(y([2300,4400,8900],[16019,27854,46429,71460,104556]), { note:'Year end, thousands.' })),
        arpu: m({ label:'Starlink consumer ARPU', short:'ARPU', unit:'eps' }, Object.assign(y([99,91,81],[66.68,59.44,53.40,49.31,46.13]), { note:'US$ per subscriber per month.' })),
        gw: m({ label:'Compute — nameplate draw', short:'Compute (MW)', unit:'count', unitLabel:'MW' }, Object.assign(y([0,300,800],[2702,9547,15756,22265,33756]), { note:'Year end, MW. J.P. Morgan models 10.1 GW at end-2027 and 20.2 GW at end-2028 (Oct 21 2026).' })),
        launches: m({ label:'Rocket launches', short:'Launches', unit:'count', unitLabel:'launches' }, Object.assign(y([98,138,170],[154,201,264,701,1103]), { note:'Falcon plus Starship. The step from 2029 is the Street\'s Starship ramp.' })),
        ebitda: m({ label:'Adjusted EBITDA', short:'Adj. EBITDA', unit:'usdM', marginOf:'rev', marginLabel:'Adjusted EBITDA margin' }, Object.assign(y([3821,5350,6584],[25581,119658,238436,350818,486023]), { note:'Bloomberg comparable EBITDA field; the reported years match the company\'s adjusted EBITDA.' })),
        spaceebitda: m({ label:'Space — adjusted EBITDA', short:'Space EBITDA', unit:'usdM', marginOf:'space', marginLabel:'Segment EBITDA margin' }, Object.assign(y([997,1154,653],[-158,1810,3130,3745,6728]), { note:'' })),
        connebitda: m({ label:'Connectivity — adjusted EBITDA', short:'Conn. EBITDA', unit:'usdM', marginOf:'conn', marginLabel:'Segment EBITDA margin' }, Object.assign(y([1602,3849,7168],[11913,18408,32188,52030,80390]), { note:'' })),
        siebitda: m({ label:'SI — adjusted EBITDA', short:'SI EBITDA', unit:'usdM', marginOf:'si', marginLabel:'Segment EBITDA margin' }, Object.assign(y([1222,347,-1237],[14450,103891,206151,282380,389319]), { note:'' })),
        opinc: m({ label:'Operating income (GAAP)', short:'Op. income', unit:'usdM', marginOf:'rev', marginLabel:'Operating margin' }, Object.assign(y([-3505,466,-2589],[5901,77775,197255,290980,405811]), { note:'FY2023 includes a $3.8B impairment at X.' })),
        ni: m({ label:'Net income (GAAP)', short:'Net income', unit:'usdM', marginOf:'rev', marginLabel:'Net margin' }, Object.assign(y([-4628,791,-4937],[2542,49482,139237,217472,264256]), { note:'' })),
        eps: m({ label:'Diluted EPS (GAAP)', short:'EPS', unit:'eps' }, Object.assign(y([-1.68,0.08,-1.69],[0.28,4.22,8.53,13.19,18.01]), { note:'Bloomberg GAAP diluted EPS. The share count changes meaning across the xAI merger (Feb 2026) and the IPO (Jun 2026), so years before 2026 are not comparable per share.' })),
        cfo: m({ label:'Cash from operations', short:'CFO', unit:'usdM', marginOf:'rev', marginLabel:'CFO % of revenue' }, Object.assign(y([4520,5776,6785],[27419,120361,235882,343237,443392]), { note:'' })),
        capex: m({ label:'Capital expenditure', short:'CapEx', unit:'usdM', marginOf:'rev', marginLabel:'CapEx % of revenue' }, Object.assign(y([4415,11163,20737],[82425,263354,269457,307641,378430]), { note:'The total capex field. The three segment capex fields add to more ($286B in 2027).' })),
        fcf: m({ label:'Free cash flow', short:'FCF', unit:'usdM', marginOf:'rev', marginLabel:'FCF % of revenue' }, Object.assign(y([105,-5387,-13952],[-58273,-140370,-58300,20545,70615]), { note:'The Street does not see positive free cash flow until 2029.' }))
      }
    }
  }
};
