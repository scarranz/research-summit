// overviews/amzn-ce-data.js — the DATA behind Amazon's Evolution ▸ Earnings (EV-SET / EV-POST).
//
// The rendering is the guide's formal machinery in ./amzn-ce.js (a copy of ./googl-ce.js); this file is the part that
// is Amazon's. Both objects were moved here unchanged from amzn.js on Oct 29 2026 (AMZN restructure), then:
//   AMZN_CE_CONS — Bloomberg BBG_CONSENSUS.txt archive parse (Aug 2026, to 2026-08-06), REBUILT AT LOAD from
//     js/results-data/amzn.js for every line Results carries: `1q out` = the dataset's Bloomberg pre-print, `4q/3q/2q
//     out` = the estMatrix vintage that many quarters before, `qa` = the reported actual. EBITDA, operating cash
//     flow, D&A and diluted shares keep the archive, with Q3 2026 added below (actual from the 8-K; 1q out = the
//     Bloomberg snapshot of Sep 10 2026).
//   AMZN_CALL_EARNINGS — per quarter, newest first. `setup.us` (Summit) is READ from the Results dataset, where the
//     model is frozen at its dated snapshot — never typed (A17). The analysis texts (results.summary, pricedIn,
//     oneLiner, debate, call.take) stay in the data but are not rendered (SAB, 2026-10-29, as in META).
//     Call records (Q4 2025, Q1 2026, Q2 2026): every management quote is verbatim from The Motley Fool's transcripts
//     (fool.com, calls of Feb 5, Apr 29 and Jul 30 2026; fetched Oct 29 2026), checked quote by quote (77 · 84 · 66) —
//     SAB, Oct 29 2026. They replace records reconstructed from press coverage, whose quotes were not verbatim. Motley Fool
//     flags its transcripts as partly AI-assisted; Amazon publishes no official transcript. Q3 2026: pending the Fool
//     transcript (not posted on Oct 29).

import { amznResults } from '../results-data/amzn.js';

export var AMZN_CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:["2023-10-29","2024-02-04","2024-05-03","2024-08-04","2024-11-03","2025-02-09","2025-05-04","2025-08-03","2025-11-02","2026-02-08","2026-05-02","2026-08-06"],
  q:["Q4 2022","Q1 2023","Q2 2023","Q3 2023","Q4 2023","Q1 2024","Q2 2024","Q3 2024","Q4 2024","Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026","Q1 2027","Q2 2027"],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:9,
  m:[
    { k:"Revenue", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,165.5],[null,null,141.8,142.4],[null,149.5,150.1,149.1],[158.6,159.3,159.4,157.6],[188.1,187.8,186.8,187.2],[158.9,158.8,158.8,155.3],[164.8,164.3,162.6,162],[175.5,174.3,172.9,176.5],[206.2,204.1,207.2,210.7],[170.7,172.7,174.7,177],[183.3,186.2,188.3,194.7],[199.2,201.7,203.8,201.7],[237.7,241.6,244.6,null],[204.1,208.9,null,null],[229.5,null,null,null]],
      qa:[149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6,null,null,null,null],
      qy:[null,null,null,null,149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6],
      qq:[null,149.2,127.4,134.4,143.1,170,143.3,148,158.9,187.8,155.7,167.7,180.2,213.4,181.5,200.6,null,null,null] },
    { k:"Gross profit", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,74.6],[null,null,67.8,68.6],[null,73.1,73.8,73.7],[76.9,77.4,77.4,77.1],[87.3,88,87.8,90.3],[79.2,79.4,79.6,77.9],[83.4,83.8,82.8,81.8],[87.7,87.1,85.8,88.3],[99.2,97.6,99.9,102.1],[86.9,88.4,91.5,90.8],[95.8,100.5,98.7,101.9],[106.3,104.1,105.3,105.2],[117.5,120.2,122.3,null],[108.5,111.5,null,null],[123.1,null,null,null]],
      qa:[63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8,null,null,null,null],
      qy:[null,null,null,null,63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8],
      qq:[null,63.6,59.6,65,68.1,77.4,70.7,74.2,77.9,88.9,78.7,86.9,91.5,103.4,94.1,104.8,null,null,null] },
    { k:"Operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10],[null,null,9,10.8],[null,11.3,12.6,13.6],[12.9,14.2,15.5,14.9],[16.1,18.1,17.7,18.6],[17.4,17.6,17.9,17.5],[17.9,18.4,18.2,17.1],[20.2,20.5,19.4,19.7],[24.3,23.3,23.7,24.4],[21.7,21.7,21.9,20.9],[22.6,23.3,23.1,23.3],[24.7,24.6,24.5,26],[30.3,30.9,32.5,null],[28.6,30.6,null,null],[34.7,null,null,null]],
      qa:[2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5,null,null,null,null],
      qy:[null,null,null,null,2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5],
      qq:[null,2.7,4.8,7.7,11.2,13.2,15.3,14.7,17.4,21.2,18.4,19.2,17.4,25,23.9,27.5,null,null,null] },
    { k:"EBITDA", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,28.4],[null,null,26.4,28.7],[null,30.4,32,32.5],[31.8,33.6,34.3,33.4],[36.8,37.8,37.5,39.7],[35.4,36.2,37.4,37.1],[38.3,39.7,40,37.8],[41.5,42.1,40.4,41.4],[47.3,46,47.1,48.5],[43.2,43.5,44.5,44.7],[48.1,49.5,50.3,51.1],[51.3,52.4,52.4,53.2],[59.9,61.1,62.6,null],[58.7,61.3,null,null],[68.8,null,null,null]],
      qa:[21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5,null,null,null,null],
      qy:[null,null,null,null,21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5],
      qq:[null,21,20.6,26.4,29.1,33.3,32,33.4,36.2,41.8,32.7,40.9,39.1,48.8,46.8,53.5,null,null,null] },
    { k:"EPS (diluted)", u:"$", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,0.73],[null,null,0.69,0.8],[null,0.88,0.92,1.02],[1.01,1.05,1.16,1.14],[1.21,1.35,1.35,1.45],[1.26,1.3,1.37,1.37],[1.36,1.46,1.42,1.32],[1.58,1.6,1.51,1.53],[1.9,1.78,1.84,1.94],[1.64,1.69,1.73,1.63],[1.79,1.85,1.81,1.81],[1.96,1.94,1.96,1.96],[2.35,2.37,2.44,null],[2.25,2.4,null,null],[2.68,null,null,null]],
      qa:[0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75,null,null,null,null],
      qy:[null,null,null,null,0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75],
      qq:[null,0.2,0.34,0.63,0.83,1.01,0.98,1.26,1.43,1.86,1.59,1.68,1.95,1.95,2.78,5.75,null,null,null] },
    { k:"Operating cash flow", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.9],[null,null,20.1,21.2],[null,24.4,25.8,28.8],[25.3,26.7,29.9,28.9],[44.1,48,47.5,48.6],[22.9,26.4,28.6,26.3],[33.6,35.5,35.3,36.6],[35.7,33.8,33.9,36.8],[53,54.4,56.4,52.4],[30.8,31.1,35.3,30.5],[42.5,48.5,42.7,51.5],[43.9,44.9,45.9,59.4],[64,65.5,69.6,null],[41.8,41.1,null,null],[50.7,null,null,null]],
      qa:[29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4,null,null,null,null],
      qy:[null,null,null,null,29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4],
      qq:[null,29.2,4.8,16.5,21.2,42.5,19,25.3,26,45.6,17,32.5,35.5,54.5,26,45.4,null,null,null] },
    { k:"Capex", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10.7],[null,null,11.6,13.3],[null,11,12.8,14.7],[11.9,13.4,14.8,18.8],[15.1,16.2,20.6,22.7],[14,17,18.8,25],[19.2,20.3,25.5,26.9],[22.8,26.5,26.6,30.2],[27,27.5,31,33.9],[26,30.4,33.9,41.8],[32.5,36.9,46.5,48],[38.2,50.1,51.3,57.6],[54.2,56.1,64.1,null],[49.7,63.8,null,null],[69.7,null,null,null]],
      qa:[16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2,null,null,null,null],
      qy:[null,null,null,null,16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2],
      qq:[null,16.6,14.2,11.5,12.5,14.6,14.9,17.6,22.6,27.8,25,32.2,35.1,39.5,44.2,54.2,null,null,null] },
    { k:"D&A", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,12.8],[null,null,12.3,12.6],[null,12.8,13,12.9],[13.2,13.4,13.8,13.6],[14.1,14.1,14.1,14.4],[13.3,13.3,13.9,14.5],[14.3,14.8,15.2,14.9],[15.2,16.2,15.8,16.1],[17.7,17.5,17.8,18.1],[16.6,17.2,17.9,19.2],[18.1,18.9,20.5,21],[20,21.8,22.3,22.1],[24.2,24.8,24.9,null],[24.5,24.3,null,null],[26.3,null,null,null]],
      qa:[12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20,null,null,null,null],
      qy:[null,null,null,null,12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20],
      qq:[null,12.7,11.1,11.6,12.1,13.8,11.7,12,13.4,15.6,14.3,15.2,16.8,19.5,18.9,20,null,null,null] },
    { k:"Diluted shares", u:"B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,10.52],[null,null,10.08,10.59],[null,10.1,10.63,10.65],[10.13,10.66,10.67,10.67],[10.69,10.7,10.7,10.71],[10.16,10.25,10.75,10.75],[10.28,10.78,10.78,10.77],[10.81,10.82,10.81,10.81],[10.85,10.84,10.84,10.82],[10.98,10.91,10.87,10.87],[10.97,10.9,10.9,10.87],[10.93,10.93,10.9,10.91],[10.96,10.93,10.93,null],[10.99,10.98,null,null],[11.01,null,null,null]],
      qa:[10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9,null,null,null,null],
      qy:[null,null,null,null,10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9],
      qq:[null,10.31,10.35,10.45,10.56,10.61,10.67,10.71,10.73,10.77,10.79,10.81,10.85,10.86,10.87,10.9,null,null,null] },
    { k:"AWS net sales", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,24.2],[null,null,24.1,24.1],[null,25.2,25.3,25.9],[26.4,26.5,27.2,27.4],[28,28.6,28.8,28.8],[29.2,29.5,29.7,29.4],[30.9,31.1,30.9,30.8],[32.5,32.5,32.2,32.4],[34.1,33.9,34.1,34.8],[34.5,34.7,35.7,35.6],[36.6,38,37.5,39.1],[40.7,39.9,41.7,44.3],[42.5,44.9,48,null],[46.2,49.7,null,null],[54.2,null,null,null]],
      qa:[21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2,null,null,null,null],
      qy:[null,null,null,null,21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2],
      qq:[null,21.4,21.4,22.1,23.1,24.2,25,26.3,27.5,28.8,29.3,30.9,33,35.6,37.6,42.2,null,null,null] },
    { k:"North America net sales", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,102.7],[null,null,84,84.6],[null,89.8,90.5,90],[95.5,96.1,95.7,95.3],[115.1,115.2,114.3,114.5],[94.3,93.9,94.1,92.7],[97.8,98.1,97.6,97.2],[104,103.5,102.8,104.4],[125.2,124.4,125.8,126.9],[99.6,100.5,105.9,102],[108.1,114.7,109.1,112.4],[122.3,116,115.4,112.8],[138.8,139,139.8,null],[112.6,113.3,null,null],[125.3,null,null,null]],
      qa:[93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null,null],
      qy:[null,null,null,null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2],
      qq:[null,93.4,76.9,82.5,87.9,105.5,86.3,90,95.5,115.6,92.9,100.1,106.3,127.1,104.1,116.2,null,null,null] },
    { k:"International net sales", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.9],[null,null,32.9,32.9],[null,34,33.8,32.9],[36.6,36.4,35.7,34.7],[44.5,44.4,43.3,43.9],[34.9,34.6,35,33.1],[35.2,35.2,34,34.1],[39.2,38.2,37.9,39.9],[46.9,46.5,48.2,49.6],[36,37.3,40.3,38.5],[39.1,43.3,40.7,42.2],[47.2,45,45.1,43.5],[55.3,56.6,56.2,null],[43.1,43.9,null,null],[47.6,null,null,null]],
      qa:[34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2,null,null,null,null],
      qy:[null,null,null,null,34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2],
      qq:[null,34.5,29.1,29.7,32.1,40.2,31.9,31.7,35.9,43.4,33.5,36.8,40.9,50.7,39.8,42.2,null,null,null] },
    { k:"AWS operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,6.6],[null,null,6.6,7.1],[null,7,7.4,8.4],[7.6,8.1,8.8,9],[8.3,9.1,9.2,10.1],[9.8,10,10.4,10.3],[10.1,10.6,10.6,10.8],[11.4,11.4,11.6,11.3],[11.9,12,11.8,11.6],[12.6,12.5,12.3,12.4],[12.2,11.7,12.1,12.5],[13,13.3,13.7,16.3],[14.4,14.8,17.8,null],[16.2,18.2,null,null],[19.9,null,null,null]],
      qa:[5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6,null,null,null,null],
      qy:[null,null,null,null,5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6],
      qq:[null,5.2,5.1,5.4,7,7.2,9.4,9.3,10.4,10.6,11.5,10.2,11.4,12.5,14.2,16.6,null,null,null] },
    { k:"North America operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,4.2],[null,null,3.2,4],[null,4.3,4.9,5.1],[5.1,5.6,5.9,5.4],[7.1,7.7,7.5,7.4],[6.2,6.1,6.1,6.1],[6.7,6.5,6.5,5.6],[7.2,7.3,6.3,7.1],[10.5,9.5,10.3,10.6],[7,7.4,7.6,7.2],[8.7,9.1,8.7,8.4],[8.7,9,8.2,7.3],[13.7,13.3,12.4,null],[9.4,9.4,null,null],[10.7,null,null,null]],
      qa:[-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1,null,null,null,null],
      qy:[null,null,null,null,-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1],
      qq:[null,-0.2,0.9,3.2,4.3,6.5,5,5.1,5.7,9.3,5.8,7.5,4.8,11.5,8.3,9.1,null,null,null] },
    { k:"International operating income", u:"$B", t:'ok',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,-1],[null,null,-0.8,-0.7],[null,-0.3,-0.2,-0.2],[-0.5,0.2,0.7,0.6],[0.3,0.7,1,1.1],[1.4,1.9,1.5,1.1],[1.4,1.3,1,0.7],[2,2,1.5,1.6],[2.2,1.8,2.1,2.3],[1.9,2,1.8,1.2],[1.7,2.1,1.8,1.9],[2,2.3,1.8,2.1],[2.3,2.4,2.2,null],[2.1,2.7,null,null],[3.4,null,null,null]],
      qa:[-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7,null,null,null,null],
      qy:[null,null,null,null,-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7],
      qq:[null,-2.2,-1.2,-0.9,-0.1,-0.4,0.9,0.3,1.3,1.3,1,1.5,1.2,1,1.4,1.7,null,null,null] }
  ]
};

// ── EV-SET: the grid is REBUILT AT LOAD from the Results dataset, so Earnings and Results never disagree.
(function(){
  var M=amznResults.views.q.metrics, MX=amznResults.estMatrix&&amznResults.estMatrix.cons;
  function pOf(q){ return q.charAt(1)+'Q'+q.slice(-2); }                    // 'Q3 2026' → '3Q26'
  function ord(p){ var m=/^(\d)Q(\d{2})$/.exec(p); return m?(2000+(+m[2]))*4+(+m[1]):null; }
  var Q=AMZN_CE_CONS.q, QP=Q.map(pOf);
  function rnd(v,u){ if(v==null) return null; var d=((u==='$B'&&Math.abs(v)>=10)||u==='%')?10:100; return Math.round(v*d)/d; }
  function growth(m){
    m.qa=m.qa.map(function(v){ return rnd(v,m.u); }); m.qr=m.qr.map(function(r){ return r.map(function(v){ return rnd(v,m.u); }); });
    m.qy=Q.map(function(q,i){ return i>=4?m.qa[i-4]:null; }); m.qq=Q.map(function(q,i){ return i>=1?m.qa[i-1]:null; }); }
  function fromResults(m, key, scale){
    var r=M[key]; if(!r) return m;
    function at(arr,p){ var i=r.periods.indexOf(p); return (i<0||!arr||arr[i]==null)?null:arr[i]/scale; }
    m.qa=QP.map(function(p){ return at(r.act,p); });
    m.qr=QP.map(function(p){
      var row=[null,null,null,at(r.cons,p)], op=ord(p), rows=MX&&MX.q&&MX.q[key];
      if(rows) MX.vintages.forEach(function(v){   // oldest → newest, so the latest vintage at each horizon wins
        var h=op-ord(v.lastActual.q); if(h<2||h>4) return;
        var x=rows[v.id]&&rows[v.id][p]; if(x!=null) row[4-h]=x/scale; });
      return row; });
    growth(m); return m; }
  var RS={ 'Revenue':['rev',1000], 'Gross profit':['gp',1000], 'Operating income':['opinc',1000], 'EPS (diluted)':['eps',1],
           'Capex':['capex',1000], 'AWS net sales':['aws',1000], 'North America net sales':['usrev',1000],
           'International net sales':['intrev',1000], 'AWS operating income':['awsopinc',1000],
           'North America operating income':['naopinc',1000], 'International operating income':['intopinc',1000] };
  AMZN_CE_CONS.m.forEach(function(m){ if(RS[m.k]) fromResults(m, RS[m.k][0], RS[m.k][1]); });
  // Archive lines, Q3 2026: actual (8-K Ex. 99.1, Oct 29 2026) and the Sep 10 2026 Bloomberg 1q-out.
  // EBITDA = operating income + D&A + SBC ($28.1B + $20.9B + $5.4B), Bloomberg's IS_COMPARABLE_EBITDA basis.
  var i3=Q.indexOf('Q3 2026');
  [['EBITDA',54.4,53.3],['Operating cash flow',42.4,57.8],['D&A',20.9,22.1],['Diluted shares',10.93,10.91]].forEach(function(x){
    AMZN_CE_CONS.m.forEach(function(m){ if(m.k===x[0] && i3>=0){ m.qa[i3]=x[1]; m.qr[i3]=[m.qr[i3][0],m.qr[i3][1],m.qr[i3][2],x[2]];
      m.qy=Q.map(function(q,i){ return i>=4?m.qa[i-4]:null; }); m.qq=Q.map(function(q,i){ return i>=1?m.qa[i-1]:null; }); } }); });
  var nv=MX&&MX.vintages[MX.vintages.length-1];
  AMZN_CE_CONS.src='Bloomberg (BST) · BBG_CONSENSUS.txt — via js/results-data/amzn.js (estMatrix'+(nv?', newest snapshot '+nv.id:'')+'); EBITDA, cash flow, D&A and shares from the archive parse (to 2026-08-06) plus the Sep 10 2026 snapshot';
})();
// Summit for a quarter's Setup (`setup.us`): READ from the Results dataset (the model's per-quarter projection held
// going into that print; frozen, dated snapshot — rule 10). Only the lines the model projects by quarter.
function ceSummitUs(p){
  var M=amznResults.views.q.metrics, out={};
  [['Revenue','rev'],['Operating income','opinc'],['AWS net sales','aws'],['North America net sales','usrev'],
   ['International net sales','intrev'],['AWS operating income','awsopinc'],['North America operating income','naopinc'],
   ['International operating income','intopinc']].forEach(function(x){
    var r=M[x[1]], i=r?r.periods.indexOf(p):-1, v=(i>=0&&r.summit)?r.summit[i]:null;
    if(v!=null){ v=v/1000; out[x[0]]={ v:Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*100)/100 }; } });
  return out;
}
var SRC_PRE='Bloomberg (BST) — the last snapshot before the print, via js/results-data/amzn.js · Summit DCF model — the per-quarter projection held going into the print (frozen)';
var SRC_Q3='Bloomberg (BST) — BBG_CONSENSUS.txt, snapshot 2026-09-10 (the newest before the print) · Summit DCF model — snapshot 2026-08-04, frozen';

export var AMZN_CALL_EARNINGS = { ticker:'AMZN', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ends Sep 2026; reports ~late October 2026) ──
  //
  // CONSENSUS PROVENANCE — the dataset's forward consensus is the Jul-2026 BBG BEst export, i.e.
  // PRE-2Q26-print: the Street had Q3 revenue at $203.9B BEFORE Amazon guided $197–202B with the
  // Prime-Day flip. Expect those cells to re-base; refresh when Dani re-exports.
  { q:'Q3 2026', status:'reported', date:'Thu Oct 29, 2026 · after close (call 2pm PT / 5pm ET)',
    setup:{
      source:SRC_Q3, asOf:'2026-09-10',
      notes:{
        'Revenue':{ t:'Guided $197–202B — with the Prime-Day flip working AGAINST the quarter', h:'<p>Guided <b>$197–202B (+9–12%)</b>, assuming <b>~80bps unfavorable FX</b>. The optics warning is pre-loaded: Prime Day sat in Q3 last year and in Q2 this year, so reported growth runs <b>~400bps LOWER</b> than the underlying rate — Amazon said so in the release itself.</p>' },
        'Operating income':{ t:'Guided $22.5–26.5B — against a charges-dirty comp', h:'<p>Guided <b>$22.5–26.5B</b> vs $17.4B in Q3 2025 — but that comp carried <b>$4.3B of charges</b> (the FTC settlement + severance), so the implied clean growth is mid-teens, not +40%. New assumption language: the guide excludes <b>energy-derivative contract remeasurements</b> — the accounting line that flattered the Q2 AWS margin now carries its own disclaimer. Amazon has beaten the top of this guide in 12 of 14 prints.</p>' },
        'EPS (diluted)':{ t:'Mind the marks — both directions now', h:'<p>Consensus $1.96 (Bloomberg, Sep 10). 2Q26 printed <b>$5.75 against a $1.82 bar</b> on <b>$53.4B of pre-tax other income</b> (primarily the Anthropic mark) — and a mark can swing the other way. Amazon does not guide EPS; score the operating line first, always.</p>' },
        'Capex':{ t:'The frame is now ~$220B', h:'<p>The FY26 cash-capex frame was <b>RAISED to ~$220B</b> (from ~$200B) on the Q2 call, with memory-cost inflation named as a driver. 1H26 ran <b>$98.4B gross</b>, so the frame implies a ~$120B second half. Bloomberg consensus for Q3: $58.3B (Sep 10).</p>' },
        'AWS net sales':{ t:'After +37%, the bar resets', h:'<p>Consensus <b>$45.4B (+38%)</b> (Bloomberg, Sep 10), after AWS printed <b>+37%</b> (fastest in 18 quarters, $169B run-rate). The demand math behind the next print: backlog <b>$496B</b> (~2.5x YoY), 2027 capacity "largely reserved", some 2028 "already spoken for". No company guidance for AWS.</p>' },
        'North America net sales':{ t:'The Prime-Day flip lands here', h:'<p>Consensus $113.0B (Bloomberg, Sep 10). The Q3/Q2 Prime-Day timing swing hits North America hardest. The segment margin (7.9% in Q2) still carries the ~$1B/quarter LEO cost ramp until capitalization begins in Q4 — with robotics as the offset.</p>' },
        'International net sales':{ t:'The line to sanity-check', h:'<p>Consensus $43.6B (Bloomberg, Sep 10). Q2 printed $42.2B (+15%) — a touch UNDER both the Street ($42.7B) and Summit ($43.4B), the only line on the card that missed. The model\'s over-call pattern on this segment continues.</p>' },
        'Advertising':{ t:'The accelerating profit engine', h:'<p>Pre-print consensus <b>$21.0B (+19%)</b> — set before ads printed <b>+26%</b> in Q2 (an acceleration from +22%, sponsored products the named driver). The line that audits whether agentic surfaces keep compounding into ad dollars.</p>' }
      },
      us:ceSummitUs('3Q26'),
      debate:{ rows:null, synth:'The one thing to resolve: does the <b>$496B book convert</b> fast enough to hold AWS in the high-30s with 2027 capacity already reserved — or does the first <b>negative-FCF year</b> (TTM −$7.6B, frame raised to ~$220B) plus the Prime-Day growth optics re-open the bill debate the Q2 print had just closed?' }
    },
    results:{ basisNote:'<b>Basis.</b> GAAP. Net income includes a <b>$1.2B</b> non-operating expense, against <b>$10.7B</b> of non-operating income in Q3 2025, which carried <b>$9.5B</b> of pre-tax gains on the Anthropic investment (release). Q3 2025 operating income carried the $2.5B FTC settlement and $1.8B of severance.',
      notes:{
        'Revenue':{ t:'At the top of the guide; in line with the Street', h:'<p><b>$201.9B (+12%; +13% ex-FX)</b> against a $197–202B guide and $201.9B consensus. Prime Day fell in Q2 this year and in Q3 last year; the release puts the effect at about 400 bps of growth.</p>' },
        'Operating income':{ t:'Above the top of the guide; 13.9% margin', h:'<p><b>$28.1B</b> against a $22.5–26.5B guide and $26.0B consensus. Operating margin <b>13.9%</b>, which the release calls Amazon\'s highest ever.</p>' },
        'AWS net sales':{ t:'+39%, a $184B run rate', h:'<p><b>$46.0B (+39%)</b> against $45.4B consensus; the release calls it AWS\'s fastest growth in nearly five years.</p>' },
        'AWS operating income':{ t:'38.7% margin', h:'<p><b>$17.8B</b> (+55%) against $16.3B consensus; margin 38.7%, from 39.4% in Q2.</p>' },
        'North America net sales':{ t:'+6%, the Prime Day quarter moved', h:'<p><b>$112.9B (+6%)</b> against $113.0B consensus. Segment operating income $8.7B, a 7.7% margin.</p>' },
        'International net sales':{ t:'+5% (+8% ex-FX); profit below the Street', h:'<p><b>$43.1B (+5%)</b> against $43.6B consensus. Segment operating income $1.6B against $2.0B consensus; FX cost $125M of it.</p>' },
        'EPS (diluted)':{ t:'$1.89 against $1.96', h:'<p>GAAP diluted EPS <b>$1.89</b> against $1.96 consensus and $1.95 a year ago, when Anthropic gains added to non-operating income.</p>' },
        'Capex':{ t:'$77.3B in the quarter; the ~$220B year stands', h:'<p>Purchases of property and equipment <b>$77.3B</b> gross (Q2 $54.2B), against $58.3B consensus. The release keeps 2026 cash capex at <b>~$220B</b>. TTM free cash flow <b>−$42.4B</b>.</p>' },
        'Operating cash flow':{ t:'Below the Street', h:'<p>$42.4B in the quarter against $57.8B consensus; TTM $168.3B (+29%).</p>' },
        'Gross profit':{ t:'53.2% gross margin', h:'<p>$107.4B (net sales − cost of sales) against $105.3B consensus.</p>' }
      } },
    call:null },

  // ── REPORTED: Q2 2026 (quarter ended Jun 2026; reported Jul 30, 2026 AMC, call 5pm ET) ──
  { q:'Q2 2026', status:'reported', date:'July 30, 2026',
    setup:{
      source:SRC_PRE, asOf:'Jul 2026',
      notes:{
        'Revenue':{ t:'Guided $194–199B — Prime Day moved INTO the quarter', h:'<p>Guided <b>$194–199B</b> (+16–19%), with <b>Prime Day in Q2 for most major geographies</b> this year (Q3 for Australia, Brazil, India, Japan) — a comp helper to remember when reading the growth rate. FX ~neutral (~10bps headwind assumed). Consensus $197.0B sits mid-range; the actual has landed at or above the TOP of guidance in 10 of the last 13 prints.</p>' },
        'Operating income':{ t:'The Street models the TOP of the guide', h:'<p>Guided <b>$20–24B</b>; consensus sits at <b>$23.7B</b> — right at the top. The guide embeds three flagged headwinds: the seasonal <b>SBC step-up</b>, <b>~$1B YoY of Amazon LEO costs</b> (satellite manufacturing + launch; capitalization only begins Q4), and fuel-inflation transport costs. Actuals beat the top of the op-income guide in 11 of the last 13 prints — the Street is betting on the pattern.</p>' },
        'EPS (diluted)':{ t:'Mind the Anthropic marks', h:'<p>Consensus $1.82. 1Q26 printed <b>$2.78 vs $1.64 expected</b> — inflated by <b>~$16.8B of pre-tax Anthropic valuation gains</b>. Amazon does not guide EPS; score the operating line first and read EPS ex-marks.</p>' },
        'Capex':{ t:'The ~$200B year, quarter by quarter', h:'<p>The Street models <b>$48.7B</b> for the quarter (vs $44.2B in Q1 and $32.2B a year ago) — the FY26 "~$200B, predominantly AWS" frame from the Q4 call, now with <b>memory-cost inflation</b> management says has "skyrocketed". Amazon guides capex only qualitatively; the model carries it annually ($205.8B FY26).</p>' },
        'AWS net sales':{ t:'The line the market trades on — a 16th-quarter high?', h:'<p>Consensus <b>$40.5B (+31%)</b> — modelling ANOTHER acceleration on top of Q1\'s +28% (itself the fastest in 15 quarters, $150B run-rate). The demand math behind it: backlog <b>$364B</b> + the <b>$100B+ Anthropic deal</b> excluded from it. No company guidance for AWS — the consensus IS the bar.</p>' },
        'North America net sales':{ t:'Watch the margin, not just the sales', h:'<p>Consensus $114.0B. The Q1 segment margin was 7.9%; the LEO cost step-up lands in North America, and the robotics rollout (every 2026 US large-format launch) is the offset. Segment consensus exists only from this quarter forward (BBG export).</p>' },
        'International net sales':{ t:'Profitable, but the model has over-called it', h:'<p>Consensus $42.7B. The segment turned profitable in 2024; Summit\'s frozen projections have recently run $0.5–1.2B ABOVE the printed op income — the line to sanity-check rather than celebrate.</p>' },
        'Advertising':{ t:'The third profit engine', h:'<p>Consensus <b>$19.3B (+23%)</b>. Q1 printed +22% with the Netflix/Comcast/Samsung partnerships ramping and ~20% of Rufus brand-prompt shoppers continuing the conversation. Street models ~18–19% growth through 2027.</p>' }
      },
      us:ceSummitUs('2Q26'),
      debate:{ rows:null, synth:'The one thing to resolve: does <b>AWS accelerate again</b> (the Street\'s +31% vs Summit\'s +29%) with backlog converting — or does the quarter turn into a bill story (SBC step-up + $1B of LEO + memory-inflated capex) where the record 13.1% margin proves to be the peak, not the base?' },
      pricedIn:'The Street at the top of both guides — revenue $197.0B mid-range, operating income $23.7B right at the guide top — with AWS modelled to accelerate AGAIN to +31%. The open worry was the bill: memory inflation, the ~$1B LEO step-up and the seasonal SBC, all flagged inside the guide itself. The tape went in hot: AMZN closed +3.9% on earnings day as money rotated into AI winners.',
      oneLiner:'The bar was "accelerate again and absorb the bill" — Amazon cleared both: AWS +37% (fastest in 18 quarters), revenue AND operating income above the tops of their guides, a new margin record. The bill grew too: the capex frame went to ~$220B and TTM free cash flow turned negative.' },
    // ── SINGLE FILL (v2.8): results + call landed together, 2026-07-31, from the Jul 30 8-K
    // (Ex. 99.1, accession 0001018724-26-000024) + the earnings-call record (5:00pm ET; see
    // docs/calls/AMZN-latest.md — verbatim IR transcript still pending from Dani).
    results:{
      summary:{
        paras:[
          { p:'<b>AWS turned from a demand question into a supply question, and that changes what the model actually hinges on.</b> For six quarters the live debate was whether AWS demand was real. This print settles it: contracted <span class="ce-gl" data-def="Contracted future revenue not yet recognised; AWS reports it as remaining performance obligations.">backlog</span> now covers roughly two build-years forward, with 2027 largely reserved and parts of 2028 already committed, so the growth ahead is booked rather than hoped. The consequence for the analysis is that the variable to underwrite is no longer the demand curve but the conversion rate: how fast Amazon can stand up reserved capacity and turn it into recognised revenue. Forward estimates now key off installation and utilisation cadence, not off whether customers show up.',
            more:'The one soft line, International revenue, is immaterial to the thesis. What matters analytically is that the acceleration arrived while supply, not demand, was the binding constraint, which is the tell that the book is converting faster than capacity is being added.' },
          { p:'<b>The margin record matters as evidence, not as a number: Amazon is absorbing a historic investment cycle without profitability giving way.</b> The most direct bear case was that the build would compress margins before the revenue arrived, and this quarter closes off that path. The stronger signal is behavioural. Management volunteered that part of the AWS margin gain came from an energy-derivative accounting item and pointed the Street to the clean figure instead. Disclosing a flattering item against its own interest tells you the underlying margin is the one they are willing to be judged on, which raises the credibility of the whole operating trajectory.',
            moreLabel:'＋ more — why the EPS line is not the read',
            more:{ body:'GAAP EPS is dominated by a non-operating Anthropic valuation mark, so it says nothing about the economics of the quarter. It matters only for two second-order reasons.',
              nodes:[
                { t:'Cash tax and the balance sheet', body:'The mark is unrealised, so the large tax provision it created is mostly deferred rather than cash. Read it as an accounting entry, not a cash outflow that changes the funding picture.' },
                { t:'Why the Q3 guide reads cleaner', body:'Management fenced energy-derivative remeasurements out of the forward guide by assumption. The item that flattered this quarter\'s AWS margin will not distort the next comparison, which makes the guide more useful to model against.' } ] } },
          { p:'<b>Free cash flow going negative is less important than what the market decided it means.</b> The development to weigh is not the capex figure but the re-rating around it: the stock rose after the print, so investors are underwriting the spend as pre-sold against the backlog rather than as overreach. For the analysis this redirects the diligence. The question stops being whether Amazon is spending too much and becomes whether the backlog is high quality and will convert, so the work moves to cancellation terms, customer concentration and installation timelines. The capex itself only turns into a risk if conversion slips, at which point the same negative <span class="ce-gl" data-def="Operating cash flow minus capital expenditure — the cash the business keeps after paying for its own growth.">free cash flow</span> would read very differently.',
            moreLabel:'＋ more — where the funding grace could break',
            more:{ body:'Operating cash flow no longer covers the build, and the gap is being closed with debt. That is durable only while the backlog keeps converting on schedule.',
              nodes:[
                { t:'The single condition to watch', body:'If conversion pace slows for even one quarter, negative FCF funded by rising debt loses its pre-sold justification. This is the one variable that flips the print from strong to fragile, and it is the thing to monitor above the headline numbers.' },
                { t:'Why the frame keeps rising', body:'The capex frame moved up on memory-cost inflation, not on added capacity. Cost inflation on a fixed build is a margin and funding question rather than a demand signal, so it should be tracked separately from the backlog story.' } ] } },
          { p:'<b>Custom silicon crossed from an internal cost lever into an external competitive moat.</b> The meaningful change is validation. Both leading frontier labs have now committed to Amazon\'s chips, which undercuts the argument that AWS is merely reselling someone else\'s GPUs and puts a differentiated asset behind its capex. For the thesis this narrows the open question to monetisation. The silicon advantage is proven for internal and anchor-tenant use, but whether it ever sells beyond that, through a merchant or rack path, is unresolved. That is the next catalyst worth tracking, because it would convert a cost advantage into a new revenue line rather than a defensive one.' },
          { p:'<b>The Q3 guide should not be read as a slowdown, and the more durable signal sits in retail.</b> The headline growth step-down is a calendar artifact from Prime Day shifting quarters, so treating the guide as deceleration misreads it. The signal that compounds is structural: retail efficiency, where units grow faster than fulfilment cost, plus fast-commerce adoption, are becoming permanent features rather than a recovery. That supports the North America margin path independently of AWS, which matters because it means the profit story is no longer carried by a single engine. The lower the reliance on any one segment, the lower the risk that a miss in that segment breaks the whole thesis.' }
        ]
      },
      notes:{
        'Revenue':{ t:'Above the top of the guide — again', h:'<p><b>$200.6B (+20%; FX +$0.1B favorable)</b> vs $196.4B consensus and a $194–199B guide — above the top for the 11th time in 14 prints, with the Prime-Day-in-Q2 helper. Paid units +17%; every revenue line grew double-digit except physical stores (+4%).</p>' },
        'Operating income':{ t:'Beat the guide top by $3.5B — new margin record', h:'<p><b>$27.5B (+43%, 13.7% margin — the highest ever)</b> vs the $20–24B guide and $23.7B modelled. The guide\'s three flagged headwinds (SBC step-up, ~$1B of LEO, fuel) were absorbed whole. AWS did the lifting: $16.6B of segment operating income (+64%, 39.4% margin); North America 7.9%; International 4.1%.</p>' },
        'EPS (diluted)':{ t:'⚠ $5.75 is a mark, not a quarter', h:'<p>$5.75 vs $1.82 expected — but <b>$53.4B of pre-tax other income (primarily the Anthropic mark)</b> sits inside it, against $1.1B a year ago. Net income $62.6B (+245%); deferred tax $17.7B of an $18.2B provision. The honest operating read is the $27.5B. Score EPS ex-marks or be scored by them.</p>' },
        'Capex':{ t:'$54.2B — and the frame moved to ~$220B', h:'<p><b>$54.2B gross</b> in the quarter ($53.1B net of proceeds; vs $48.7B modelled) — 1H26 $98.4B. On the call the FY26 cash-capex frame was <b>raised to ~$220B</b> from ~$200B, partly on the "higher cost of memory". TTM free cash flow <b>−$7.6B</b>, negative for the first time in the build; long-term debt +$63B in the half.</p>' },
        'AWS net sales':{ t:'+37% — fastest in 18 quarters, third straight acceleration', h:'<p><b>$42.2B (+37%, $169B run-rate)</b> vs $40.5B consensus — after +28% and +24%. Backlog <b>$496B</b> (~2.5x YoY, growing triple-digit); 2027 capacity "largely reserved", some 2028 "spoken for". The AI business and the chips business <b>each exceed a $25B run-rate, both triple-digit</b>. Segment margin 39.4% (+650bps; ~+520bps excluding derivative gains).</p>' },
        'Advertising':{ t:'+26% — an acceleration at $20B scale', h:'<p><b>$19.8B (+26%)</b> vs $19.4B modelled — accelerating from +22%, with sponsored products the named driver. The agentic-commerce claim (multi-turn conversations create more ad surfaces, not fewer) keeps converting into reported dollars.</p>' },
        'North America net sales':{ t:'In line, with the LEO drag still inside it', h:'<p>$116.2B (+16%) vs $114.0B modelled; segment operating income $9.1B at a 7.9% margin — flat with Q1 while absorbing roughly $1B of LEO cost and delivering ~$600M of tariff refunds as offset.</p>' },
        'International net sales':{ t:'The one line under the Street', h:'<p>$42.2B (+15%) vs $42.7B modelled and Summit\'s $43.4B — a −1.2% miss, the only one on the card. Segment operating income $1.7B (4.1% margin) landed between the Street ($1.6B) and Summit ($1.5B).</p>' }
      },
      watch:{ 'AWS net sales':1, 'Capex':2, 'Operating income':3, 'Advertising':4 },
      thesisCheck:[
        { line:'AWS growth stalls below ~25% or the backlog stops converting', tripped:false, note:'+37% — the fastest in 18 quarters and the third straight acceleration — with backlog at $496B, roughly 2.5x a year ago. The demand side is now contractual out to 2028: 2027 capacity largely reserved, some 2028 already spoken for.' },
        { line:'The capex frame outruns the cash (the FCF red line)', tripped:true, note:'⚑ TTM free cash flow printed NEGATIVE (−$7.6B) and the frame was RAISED to ~$220B — the red line the Q4-2025 model flip predicted has now fired in reported actuals. It is demand-led (see the line above) and debt-funded ($67B of new long-term debt in 1H26) — but it fired as written.' },
        { line:'The 13.1% margin proves the peak, not the base', tripped:false, note:'13.7% — a new record, absorbing the SBC step-up, ~$1B of LEO and fuel inflation the guide had flagged. AWS at 39.4% (+650bps, ~520bps clean) did the lifting.' },
        { line:'Agentic commerce fails to compound into ad dollars', tripped:false, note:'Advertising accelerated to +26% (from +22%) at a $20B quarterly scale, with sponsored products named as the driver. The usage-to-dollars chain keeps converting.' },
        { line:'Custom silicon stays an internal cost edge', tripped:false, note:'The chips business is now above a $25B run-rate growing triple-digit — and BOTH Anthropic and OpenAI have committed multi-year, multi-gigawatt to Trainium. From one anchor tenant to the two leading labs in two quarters.' },
      ],
      intoCall:[
        '☁️ <b>Conversion pace</b> — $496B of backlog against capacity reserved through 2027: how fast does the book become recognised revenue? (On the list.)',
        '💸 <b>The ~$220B frame</b> — memory inflation now quantified into the frame, TTM FCF negative, $67B of new debt: where does the funding mix go from here? (On the list.)',
        '📊 <b>Margin quality</b> — a 39.4% AWS margin that includes ~130bps of derivative accounting: is the clean ~38% sustainable under the depreciation ramp?',
        '🤖 <b>The merchant silicon path</b> — with OpenAI joining Anthropic on multi-gigawatt commitments, does rack/external sale move from "a possibility" to a plan?',
      ],
      priceReaction:'+9.1% after hours on Jul 30 (from a $235.50 close, itself +3.9% on the day) and about +12.5% in the Jul 31 pre-market (~$265) — the tape bought the AWS acceleration and looked straight through the negative free cash flow. The next-day close was still pending at fill time; confirm before quoting a settled number.' },
      call:{
      prepared:[
        { topic:'Revenue $200.6B, up 20%; operating income $27.5B, up 43%', theme:'Margins',
          body:'<b>Andy Jassy:</b> "We\'re reporting <b>$200.6 billion in revenue, up 20%</b> year-over-year. Operating income was <b>$27.5 billion, up 43%</b> year-over-year."<br><b>Brian Olsavsky:</b> "This includes the benefit from two items that reduced expenses by <b>approximately $1.2 billion</b> during the quarter. First, we received tariff-related refunds of approximately $600 million." … "Second, we recorded a separate benefit of approximately $600 million related to the change in fair value measurement of energy contracts subject to derivative accounting. This primarily impacts the AWS segment."' },
        { topic:'AWS +36.7%, fifth straight acceleration; backlog $496B', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "Revenue growth of <b>36.7%</b> year-over-year, accelerating for the fifth straight quarter, our fastest growth in 18 quarters" … "We added over $4.6 billion in revenue quarter-over-quarter, about 80% more than our largest increase ever. Our backlog stands at <b>$496 billion</b>, growing triple digits year-over-year." … "AWS is now a <b>$169 billion</b> annualized revenue run rate business"' },
        { topic:'AWS operating income $16.6B; Q2 cash capex $53.1B', theme:'Margins',
          body:'<b>Brian Olsavsky:</b> "AWS operating income was <b>$16.6 billion</b>, which reflects our strong growth, coupled with our focus on driving efficiencies across the business." … "Now turning to our cash CapEx, which is <b>$53.1 billion</b> in Q2. This primarily relates to AWS and generative AI as we invest to support strong customer demand."' },
        { topic:'Chips and AI each above a $25B run-rate; Anthropic and OpenAI on Trainium', theme:'Custom silicon',
          body:'<b>Andy Jassy:</b> "Our chips business now has an annual revenue run rate of <b>over $25 billion</b>, growing triple-digit percentages year-over-year. Our AI revenue run rate climbed significantly quarter-over-quarter, and is now also <b>over $25 billion</b>" … "In addition to the two leading AI labs in the world, Anthropic and OpenAI, making <b>multi-year, multi-gigawatt commitments to Trainium</b>" … "Graviton is used by <b>98% of our top 1,000 EC2 customers</b>."' },
        { topic:'2026 cash capex now ~$220B, up from ~$200B on memory costs', theme:'Capex',
          body:'<b>Andy Jassy:</b> "We now believe we will spend <b>approximately $220 billion</b> in cash CapEx in 2026. The higher cost of memory pushing this number up from our prior estimate of about $200 billion. Even at that amount, we will still <b>not have enough capacity</b> to meet all the demand we have in 2026, and I believe this dynamic will also be true in 2027, too."' },
        { topic:'The capex return math: servers break even in under three years, data centers last 30-plus', theme:'Capex',
          body:'<b>Andy Jassy:</b> "At this level of spend and higher, we have <b>clear line of sight to strong financial returns</b>." … "For servers and networking equipment, on average, it takes <b>a little less than three years to break even</b> on that investment. The servers currently have a useful life of at least five to six years, and most of our AI capacity these days is being contracted for at least five-year terms." … "we\'ll spend a lot of CapEx and encounter <b>free cash flow headwinds</b> until these data centers come online"' },
        { topic:'AWS could become a trillion-dollar revenue business', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "In fact, the demand we already have for 2028 is striking." … "We long believed AWS could become a few hundred billion-dollar revenue business and now believe it\'ll be at least double that, and very possibly be a <b>trillion-dollar annual revenue business</b> for us in time"' },
        { topic:'Robotic-arm fleet to more than double in 2026; fuel and line-haul costs', theme:'Robotics',
          body:'<b>Brian Olsavsky:</b> "we expect to <b>more than double our fleet of robotic arms</b>, like Cardinal and Sparrow, in 2026. We continue to lower our overall cost to serve, even as we face heightened transportation costs driven by fuel inflation from the conflict in the Middle East and higher line haul rates from driver capacity limitations." … "North America segment operating income was $9.1 billion with an operating margin of <b>7.9%</b>."' },
        { topic:'Advertising $19.8B, up 26%; perishables customers +50% this year', theme:'Robotics',
          body:'<b>Andy Jassy:</b> "Moving on to Amazon Ads, we saw strong growth across our offerings, generating <b>$19.8 billion of revenue, up 26%</b> year-over-year. Sponsored Products continues to be our largest offering and a key driver of growth." … "The number of monthly active perishables customers <b>grew over 50%</b> since the start of the year."' },
        { topic:'Q3 guide: revenue $197-202B, operating income $22.5-26.5B; Prime Day worth ~400bps', theme:'Margins',
          body:'<b>Brian Olsavsky:</b> "Q3 net sales are expected to be between <b>$197 billion and $202 billion</b>." … "Excluding the impact of Prime Day in both 2025 and 2026, third quarter 2026 year-over-year growth would have been <b>nearly 400 basis points higher</b>." … "Q3 operating income is expected to be between <b>$22.5 billion and $26.5 billion</b>."' },
      ],
      qanda:[
        { q:'Drivers and sustainability of the 39% AWS margin; does Amazon need its own frontier model', analyst:'Doug Anmuth · J.P. Morgan', theme:'Margins',
          qFull:'Many assumed AI workloads would carry lower margins near term: what drove the 39% AWS operating margin in Q2 and how sustainable is it? And with Bedrock spending in the quarter above all prior quarters combined, does Amazon need its own leading model at the frontier?',
          a:'<b>Brian Olsavsky:</b> "AWS margins have continued to remain strong, and we\'re <b>up 650 basis points</b> year-over-year. <b>520 basis points if you exclude the derivative accounting gain</b> that I mentioned." … "I would say that the profitability you\'re seeing from AWS <b>isn\'t random</b>." … "Again, they\'ll fluctuate, but very strong performance year-over-year, and we\'ll take it."<br><b>Andy Jassy:</b> "My view of it is that AWS and Amazon can have a <b>wildly successful business without its own frontier model</b>." … "All that said, <b>we are pursuing our own frontier model</b>, and we\'re doing it for a few reasons. First of which is it just gives us additional control over cost."' },
        { q:'Was the AWS acceleration capacity-driven; capacity adds in 2H26 and 2027', analyst:'Justin Post · Bank of America', theme:'Backlog',
          qFull:'Was the AWS acceleration mainly a function of capacity coming online in the quarter? How much capacity is being added in the second half versus the first, and how should 2027 be thought about?',
          a:'<b>Andy Jassy:</b> "It\'s fifth straight acceleration quarter, largest acceleration in 18 quarters." … "Remember, by the way, that <b>85% of the global IT spend is still on premises</b>." … "Yes, we\'re adding a lot of capacity, there are a lot of other reasons why it\'s growing." … "we said we expect to have <b>double the power capacity by the end of 2027</b> that we had in 2025, and we continue to be on that track."' },
        { q:'Can long-lived data-center spend slow in 2027; selling Trainium to third-party data centers', analyst:'Brian Nowak · Morgan Stanley', theme:'Custom silicon',
          qFull:'Looking at 2027 demand, can the long-lived data-center spend start to slow, or will new data centers keep opening for several more years? And on selling Trainium to third-party data centers: when could that happen, and how do its returns compare with core AWS workloads?',
          a:'<b>Andy Jassy:</b> "the lion\'s share of capacity in 2027" … "is <b>largely reserved</b>, and we have quite a bit of capacity that\'s <b>already been reserved for 2028</b>." … "We think, as I mentioned earlier, it has the potential to be a $1 trillion revenue business for AWS" … "We do have an increasing number of customers who are interested in us providing the Trainium chips to them, separate from our cloud" … "I expect there\'s <b>a real chance we\'ll do that in the future</b>."' },
        { q:'Moving into the application layer (Kiro, Transform, workplace tools); sources of capital for the build-out', analyst:'Colin Sebastian · Baird', theme:'Capex',
          qFull:'Is there a more concerted push into the application layer with Kiro, Transform and workplace productivity tools, and does it lift the broader platform? And given the demand signals and capacity plans, what are the sources of capital for the build-out over the next couple of years?',
          a:'<b>Andy Jassy:</b> "<b>You\'ve seen us issue debt this year.</b> We have a lot of options available to us as we continue to fund this growth that we\'re seeing in AWS. We\'ll continue to look at all the options and make the appropriate decision at the right time, but <b>nothing to share today</b>." … "we see a very substantial opportunity both for our customers and for AWS in building some of these agentic applications."' },
        { q:'What the RPO expansion means for 2028+ capacity; AWS pricing against cost inflation', analyst:'Ken Gawrelski · Wells Fargo', theme:'Backlog',
          qFull:'RPO is now about 2.5x its 3Q25 level, when the doubling-of-capacity-by-2027 target was given: what does it imply, at least qualitatively, for capacity in 2028 and beyond? And with capex raised for supply-chain inflation, how does AWS pricing account for future cost inflation, and do long-term contracts keep returns stable?',
          a:'<b>Andy Jassy:</b> "We know about that backlog, obviously, so that\'s <b>all taken into account in our CapEx projections</b>." … "The deals that you sign, those will be the prices and those will be the agreements that we have over the duration of that contract. New agreements that you sign, <b>you always take into account what your costs are</b> and how you ultimately build a price that you agree to with your customers." … "there are inflated prices right now on some of the components like <b>memory and hard drives and SSDs</b>."' },
        { q:'Consumer signal from fast commerce, groceries and everyday essentials', analyst:'Eric Sheridan · Goldman Sachs', theme:'Robotics',
          qFull:'As fast commerce and a wider grocery and everyday-essentials assortment scale, what signal are consumers giving on adoption and overall spend, and do outcomes differ by country or geography?',
          a:'<b>Andy Jassy:</b> "Last year, it was <b>over $150 billion in gross merchandise sales</b>, making us the second largest grocer in the U.S." … "we\'re now able to offer <b>same-day perishables in 2,300 cities</b> around the U.S." … "The number of monthly active perishable customers has increased <b>50% since the start of this year</b>. For same-day orders with perishables, on average, they average <b>three times more units per order</b>."' },
      ],
      highlights:[
        { tag:'thesis', band:'lead', open:'Conversion pace: how fast does $496B of contracted demand become recognised revenue when capacity is the binding constraint?',
          head:'Backlog $496B, growing triple digits; 2027 capacity largely reserved and some 2028 already reserved, with AWS up 36.7%',
          detail:'<p><b>Andy Jassy:</b> "the lion\'s share of capacity in 2027" … "is <b>largely reserved</b>, and we have quite a bit of capacity that\'s already been reserved for 2028." … "At this level of spend and higher, we have <b>clear line of sight to strong financial returns</b>." … "we expect to have <b>double the power capacity by the end of 2027</b> that we had in 2025, and we continue to be on that track."</p>' },
        { tag:'watch', band:'lead', open:'The funding mix under a ~$220B frame with TTM FCF negative — more debt, a partner vehicle, or does operating cash flow close the gap?',
          head:'The 2026 frame moved to ~$220B on the higher cost of memory; TTM free cash flow was −$7.6B and long-term debt nearly doubled to $129B in six months',
          detail:'<p><b>Andy Jassy:</b> "We now believe we will spend <b>approximately $220 billion</b> in cash CapEx in 2026. The higher cost of memory pushing this number up from our prior estimate of about $200 billion." … "<b>You\'ve seen us issue debt this year.</b> We have a lot of options available to us as we continue to fund this growth that we\'re seeing in AWS." … "nothing to share today." The release shows TTM free cash flow of −$7.6B and $67.0B of long-term debt raised in the first half (long-term debt $128.9B at June 30, from $65.6B at year-end).</p>' },
        { tag:'thesis', band:'context',
          head:'AWS margin 39.4%, up 650bps YoY; Olsavsky put the expansion at 520bps excluding the energy-derivative accounting gain',
          detail:'<p><b>Brian Olsavsky:</b> "520 basis points if you exclude the derivative accounting gain that I mentioned." … "I would say that the profitability you\'re seeing from AWS <b>isn\'t random</b>. It\'s a result of disciplined efficiency gains, capacity optimization, which we benefited quite a bit from in Q2, and always closely managing our fixed costs." … "While the impact of these fair value measurements can vary, these adjustments have not been significant in prior quarters." The release states the Q3 guidance assumes no impact from energy derivative contract remeasurements.</p>' },
        { tag:'thesis', band:'context',
          head:'The chips business and the AI business each above a $25B run-rate, growing triple digits, with Anthropic and OpenAI both committed multi-year, multi-gigawatt to Trainium',
          detail:'<p><b>Andy Jassy:</b> "Graviton5 is growing nearly 2x faster as Graviton4 did." … "The fact that we have multi-year, multi-gigawatt commitments from the two largest AI labs, Anthropic and OpenAI" … "We do have an increasing number of customers who are interested in us providing the Trainium chips to them, separate from our cloud, and we\'re actively having those conversations and exploring, and I expect there\'s <b>a real chance we\'ll do that in the future</b>."</p>' },
        { tag:'curious', band:'context',
          head:'Retail: monthly active perishables customers up 50% since January, same-day perishables orders at 3x the units, paid units +17%',
          detail:'<p><b>Andy Jassy:</b> "We have finally found something that is a <b>real needle mover</b> for us in offering perishables in our same-day facilities" … "If you look in those cities, nine of the top 10 best sellers in those geographies are perishables."<br><b>Brian Olsavsky:</b> "Worldwide paid units grew <b>17%</b> year-over-year."</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: about $600M of tariff-related refunds landed in Q2 · Kiro, Amazon Q and Transform push AWS into applications · advertising +26% on Sponsored Products',
          detail:'<p><b>Brian Olsavsky:</b> "First, we received tariff-related refunds of approximately $600 million. This is included in our North America segment and represents the <b>significant majority of refunds we expect to receive</b>."<br><b>Andy Jassy:</b> "we see a very substantial opportunity both for our customers and for AWS in building some of these agentic applications." … "Sponsored Products continues to be our largest offering and a key driver of growth."</p>' },
        { tag:'watch', band:'logged', open:'A dated marker: does Amazon Leo begin initial service and show revenue beside its cost line?',
          head:'Amazon Leo close to 400 satellites in orbit, enough to begin initial satellite internet service this year',
          detail:'<p><b>Andy Jassy:</b> "Finally, Amazon Leo is close to <b>400 satellites in orbit</b>, enough to begin initial satellite internet service this year. We already have <b>meaningful revenue commitments</b> from enterprises and government customers, and we have more than 20 partners who will extend the reach of our network across the globe."</p>' },
      ],
      newQuestions:[
        { n:'Conversion pace: $496B of backlog against reserved capacity — does AWS hold the high-30s?', landed:{ q:'Q3 2026', rank:1 } },
        { n:'The funding mix under ~$220B with TTM FCF negative — more debt, or a partner vehicle?', landed:{ q:'Q3 2026', rank:2 }, tripped:true },
        { n:'Is the clean ~38% AWS margin sustainable under the depreciation ramp?', landed:{ q:'Q3 2026', rank:3 } },
        { n:'Does advertising hold 25%+ through the Prime-Day flip quarter?', landed:{ q:'Q3 2026', rank:4 } },
        { n:'Trainium merchant path: with OpenAI and Anthropic both multi-gigawatt, do rack sales move from "possibility" to plan?', landed:{ q:'Q3 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 29, 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 29, 2026',
    setup:{
      source:'Refinitiv/LSEG pre-print consensus (via js/results-data/amzn.js) — the number that stood going in', asOf:'2026-04',
      notes:{
        'Operating income':{ t:'No pre-print Street line — the guide is the bar', h:'<p>The dataset carries no pre-print op-income consensus for this quarter; the bar was Amazon\'s own guide, <b>$16.5–21.5B</b>. The print beat the TOP by $2.4B.</p>' }
      },
      us:ceSummitUs('1Q26'),
      debate:{ rows:null, synth:'Going in: the Feb call had set the ~$200B capex frame and a soft-looking Q1 guide ($16.5–21.5B op income vs $23.9B just printed in Q4) — the bar was whether AWS keeps accelerating fast enough to make the spend read as demand-led.' },
      pricedIn:'Post-Q4 nerves about the ~$200B capex year and the soft Q1 op-income guide; AWS re-acceleration (+24% in Q4, backlog $244B) mostly believed, with the Street watching whether the Anthropic/Trainium demand shows up in reported growth.',
      oneLiner:'The bar was "prove the spend is demand-led" — Amazon beat it everywhere: AWS +28% (fastest in 15 quarters), record 13.1% operating margin, and a backlog that grew to $364B EXCLUDING a $100B+ Anthropic deal.' },
    results:{
      headline:'The proof quarter: AWS accelerated to +28% with a record 13.1% company margin — while the backlog ($364B + $100B Anthropic outside it) pre-sold the capex the bears were worried about.',
      notes:{
        'Revenue':{ t:'Above the top of the guide', h:'<p><b>$181.5B (+17%; +15% ex-FX)</b> vs $177.3B consensus and a $173.5–178.5B guide — above the top. Store unit growth +15%, the highest since COVID; everyday essentials growing ~2x the rest.</p>' },
        'Operating income':{ t:'Record margin — beat the guide top by $2.4B', h:'<p><b>$23.9B (13.1% margin — highest ever)</b> vs the $16.5–21.5B guide. AWS margin strength + fulfillment efficiency (unit growth +15% vs fulfillment expense +9% FX-neutral) did it; robotics now deploys in every 2026 US large-format launch.</p>' },
        'EPS (diluted)':{ t:'⚠ $2.78 is marks-flattered', h:'<p>$2.78 vs $1.64 expected — but <b>~$16.8B of pre-tax Anthropic valuation gains</b> sit inside it. The honest operating read is the $23.9B op income; treat the EPS beat as optics.</p>' },
        'Capex':{ t:'$44.2B — the ladder climbing to ~$200B', h:'<p>$44.2B in the quarter (8-K basis; the call quoted $43.2B cash capex), "primarily AWS and generative AI". Management: memory component costs have <b>"skyrocketed"</b>; supply allocations were locked with strategic suppliers mid-to-late 2025 — a scarcity now accelerating enterprise cloud migration.</p>' },
        'AWS net sales':{ t:'+28% — fastest in 15 quarters', h:'<p><b>$37.6B (+28%, $150B run-rate)</b> vs $36.6B consensus — a 480bps acceleration. "Very unusual for a business to grow this fast on a base this large." AI run-rate $15B+; Bedrock spend +170% sequentially; tokens processed in Q1 exceeded all prior years combined. Backlog <b>$364B</b>, excluding the <b>$100B+ Anthropic deal</b>.</p>' },
        'Advertising':{ t:'+22% at scale', h:'<p>$17.2B (+22%). Netflix, Comcast and Samsung partnerships signed; CreativeAgent in 7 more countries; Rufus MAU +115% with engagement +400%.</p>' }
      },
      watch:{ 'AWS net sales':1, 'Capex':2, 'Operating income':3, 'Advertising':4 },
      thesisCheck:[
        { line:'AWS growth stalls below ~25% or the backlog stops converting', tripped:false, note:'+28% (15-quarter high) and backlog $364B + $100B Anthropic outside it. The acceleration thesis strengthened.' },
        { line:'The ~$200B capex year swamps margins before the demand shows', tripped:false, note:'The opposite print: record 13.1% margin WITH $44.2B of quarterly capex. But memory costs "skyrocketed" — the cost side opened a new front.' },
        { line:'Custom silicon stays a science project', tripped:false, note:'$20B run-rate (+~40% QoQ), $225B+ of Trainium commitments, Trainium3 nearly fully subscribed. Held emphatically.' },
        { line:'Retail efficiency stalls (units vs fulfillment cost)', tripped:false, note:'Units +15% vs fulfillment expense +9% — the gap IS the margin story; a service engine rebuilt in 65 days vs 40–50 person-years.' },
      ],
      intoCall:[
        '☁️ <b>AWS +28% and $364B of backlog</b> — how fast can capacity actually come online, and does the Anthropic $100B start converting? (Watch #1.)',
        '💰 <b>Memory costs "skyrocketed"</b> — what does that do to the ~$200B frame and to AWS gross margin?',
        '🤖 <b>Trainium rack sales</b> — "very much a possibility": how big, how soon?',
        '🛰️ <b>LEO $1B YoY cost step-up in Q2</b> — the new drag to model before commercial revenue starts (Q3).',
      ],
      priceReaction:'To fill from a trusted source — coverage framed it as a broad beat ("results exceed expectations").' },
    call:{
      prepared:[
        { topic:'Revenue $181.5B, up 17%; operating income $23.9B at a record 13.1% margin', theme:'Margins',
          body:'<b>Andy Jassy:</b> "We are reporting <b>$181.5 billion in revenue, up 17%</b> year over year. Excluding the $2.9 billion favorable impact from foreign exchange, net sales increased 15%. Operating income was $23.9 billion."<br><b>Brian Olsavsky:</b> "Worldwide operating income was $23.9 billion, with an operating margin of <b>13.1%, our highest operating margin ever</b>."' },
        { topic:'AWS $37.6B, up 28% (fastest in 15 quarters); $150B run rate; operating income $14.2B', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "Starting with AWS, growth continued to accelerate, <b>up 28% year over year</b>, the fastest growth rate in 15 quarters" … "AWS is now a <b>$150 billion annualized revenue run rate</b> business. It is very unusual for a business to grow this fast on a base this large"<br><b>Brian Olsavsky:</b> "Moving to our AWS segment, revenue was <b>$37.6 billion</b> and growth accelerated 480 basis points to 28% year over year, driven by both core and AI services." … "AWS operating income was <b>$14.2 billion</b>"' },
        { topic:'AI run rate over $15B; Bedrock customer spend up 170% quarter over quarter; OpenAI models in Bedrock', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "In the first three years of this AI wave, AWS’s AI revenue run rate is <b>over $15 billion</b>—nearly 260 times larger." … "Bedrock, which saw <b>170% growth in customer spend quarter over quarter</b> and processed more tokens in Q1 than all prior years combined." … "Yesterday, we added OpenAI’s GPT-5.4 model, with 5.5 coming soon."<br><b>Brian Olsavsky:</b> "Our AI revenue is growing <b>triple digits</b> year over year."' },
        { topic:'Chips run rate over $20B (nearly +40% QoQ), $50B as a standalone; over $225B of Trainium commitments', theme:'Custom silicon',
          body:'<b>Andy Jassy:</b> "We saw nearly 40% quarter over quarter growth in Q1, and our annual revenue run rate is now <b>over $20 billion</b> and growing triple-digit percentages year over year" … "our annual revenue run rate would be <b>$50 billion</b>." … "we now have <b>over $225 billion in revenue commitments for Trainium</b>." … "Trainium3, which just started shipping in 2026 and is 30% to 40% more price performant than Trainium2, is nearly fully subscribed, and much of Trainium4, which is still about 18 months from broad availability, has already been reserved."' },
        { topic:'Graviton used by 98% of the top 1,000 EC2 customers; Trainium to save tens of billions of capex a year', theme:'Custom silicon',
          body:'<b>Andy Jassy:</b> "That is why Meta chose Graviton, which delivers up to 40% better price performance than any other x86 processors, and is now used by <b>98% of the top 1,000 EC2 customers</b>." … "For perspective, at scale, we expect Trainium will save us <b>tens of billions of dollars of CapEx each year</b> and provide several hundred basis points of operating margin advantage versus relying on other chips for inference."' },
        { topic:'Cash capex $43.2B in Q1; early free cash flow challenged while capex outgrows revenue', theme:'Capex',
          body:'<b>Brian Olsavsky:</b> "Our cash CapEx is <b>$43.2 billion</b> in Q1. This primarily relates to AWS and generative AI, as we invest to support strong customer demand."<br><b>Andy Jassy:</b> "Of the AWS CapEx we intend to spend in 2026, much of which will be installed in future years, we have high confidence this will be monetized well, as we already have <b>customer commitments for a substantial portion of it</b>" … "in times of very high growth like now, where the CapEx growth meaningfully outpaces the revenue growth, <b>the early years’ free cash flow is challenged</b> until these initial tranches of capacity are being monetized"' },
        { topic:'Units +15%, the highest since COVID; fulfillment expense +9%; latest robotics in all 2026 US large-format launches', theme:'Robotics',
          body:'<b>Andy Jassy:</b> "Units grew <b>15% year over year</b>, the highest we have seen since the tail end of COVID lockdowns." … "with more than <b>$150 billion in gross sales in 2025</b>, we are now the second-largest grocer in the U.S."<br><b>Brian Olsavsky:</b> "Overall unit growth of 15% continues to outpace our cost to operate the fulfillment network, as outbound shipping costs grew 12% year over year and <b>fulfillment expense grew 9%</b> year over year, both on an FX-neutral basis." … "All of our U.S. large-format fulfillment center launches in 2026 will have this latest generation technology."' },
        { topic:'Advertising $17.2B, up 22%; Rufus monthly active users up over 115%', theme:'Advertisement',
          body:'<b>Andy Jassy:</b> "generating <b>$17.2 billion of revenue in the quarter and up 22%</b> year over year." … "Monthly active users are <b>up over 115%</b> and engagement is up nearly 400% year over year." … "we are seeing nearly 20% of shoppers who interact with a brand prompt in Rufus continue the conversation about that brand."' },
        { topic:'Amazon LEO commercial service in a few months; Globalstar acquisition and Apple agreement', theme:'LEO',
          body:'<b>Andy Jassy:</b> "Amazon LEO continues gaining momentum, with <b>commercial service on track to launch in a few months</b>." … "We also announced that we plan to acquire Globalstar, which will expand LEO’s satellite network with direct-to-device capabilities, and we entered an agreement with Apple for Amazon LEO to power satellite services for iPhones and Apple Watches."' },
        { topic:'Q2 guide: net sales $194-199B, operating income $20-24B; about $1B of LEO cost and fuel inflation inside it', theme:'Margins',
          body:'<b>Brian Olsavsky:</b> "Q2 net sales are expected to be between <b>$194 billion and $199 billion</b>." … "Q2 operating income is expected to be between <b>$20 billion and $24 billion</b>." … "we do expect a year-over-year cost increase of <b>approximately $1 billion related to Amazon LEO</b>" … "our guidance anticipates higher transportation costs related to fuel inflation, which is partially offset by the recently implemented fuel- and logistics-related FBA surcharge."' },
      ],
      qanda:[
        { q:'Investment needed to meet the backlog; custom silicon as a scale advantage', analyst:'Eric Sheridan · Goldman Sachs', theme:'Capex',
          qFull:'Given the recent AWS announcements and the shareholder letter, what level of investment is needed over the next couple of years to scale compute and capacity against the current revenue backlog, and how does the custom silicon and AI infrastructure approach position Amazon to build that scale?',
          a:'<b>Andy Jassy:</b> "So <b>I do not have a new update on capital</b>." … "we do view this as <b>truly a once-in-a-lifetime opportunity</b> where every application that we know of is going to be reinvented" … "we have the leading CPU chip in Graviton, and we have the leading price-performance AI silicon chip in Trainium—it means that we are <b>unusually well positioned</b> for the inflection that we are seeing"' },
        { q:'AWS backlog size and breadth; agentic commerce priorities for Rufus', analyst:'Brian Nowak · Morgan Stanley', theme:'Backlog',
          qFull:'What does the AWS backlog look like, and how broad is it beyond the big AI labs? And on Rufus and agentic commerce, what is Amazon most focused on accomplishing in 2026 to stay at the leading edge?',
          a:'<b>Andy Jassy:</b> "On the backlog, the backlog for Q1 is <b>$364 billion</b>. That does not include the recent deal that we announced with Anthropic for over $100 billion. There is <b>reasonable breadth</b> in that as well—it is not just one customer or two customers." … "They are not often able to get the pricing right or the product information right." … "we are aiming to have it be <b>the best shopping assistant anywhere</b>, and I think we are on that path."' },
        { q:'OpenAI models in Bedrock; selling Trainium racks externally', analyst:'Justin Post · Bank of America', theme:'Custom silicon',
          qFull:'How big an unlock is access to the full suite of OpenAI models on Bedrock, and how focused is Amazon on its own Nova model? And the shareholder letter said Amazon might sell Trainium racks: given capacity constraints, what is the timing and size of that opportunity?',
          a:'<b>Andy Jassy:</b> "I think the fact that we are going to have <b>all the OpenAI models available in Bedrock</b> is a big deal." … "I think the future of using these models is a stateful model, a stateful API." … "But I expect over time there is a good chance <b>we are going to sell racks in the next couple of years</b>."' },
        { q:'LEO revenue opportunity, ramp constraints, Globalstar and the long-term vision', analyst:'Rob Sanderson · Loop Capital Markets', theme:'LEO',
          qFull:'How large is the Amazon LEO revenue opportunity in consumer and enterprise over the next few years, and what limits the ramp? What new services does the Globalstar infrastructure and spectrum enable, and could the long-term vision include non-communication services such as orbital data centers?',
          a:'<b>Andy Jassy:</b> "I think we will be about <b>2x better on the downlink</b> than existing alternatives and about <b>6x better on the uplink</b> performance than existing alternatives." … "We have over 20 launches planned this year. We have over 30 launches planned in 2027. I think the business has a chance to be a <b>very large, many-billion-dollar revenue business</b>" … "They have <b>unusual and scarce global spectrum</b> that is required to provide direct-to-device."' },
        { q:'Memory and supply-chain inflation and capex; advertising in agentic commerce', analyst:'Shweta Khajuria · Wolfe Research', theme:'Capex',
          qFull:'How is Amazon thinking about higher memory and storage prices and supply-chain inflation, and their impact on capex this year and next? And if agents end up doing the shopping, what does agentic commerce mean for the advertising opportunity?',
          a:'<b>Andy Jassy:</b> "I think everybody knows that the cost of components, particularly memory, has <b>skyrocketed</b>." … "it is a <b>further impetus pushing companies who have on-premises infrastructure into the cloud</b>." … "I believe that <b>advertising will do well in a world of agentic commerce</b>."' },
        { q:'AI demand from early adopters versus the broad enterprise base; internal use of AI', analyst:'Colin Sebastian · Baird', theme:'Backlog',
          qFull:'How does incremental AI demand from early adopters and the largest AWS customers compare with the demand curve across the broader enterprise base? And where does Amazon see the most opportunity to use AI internally, both in products and in operating efficiency?',
          a:'<b>Andy Jassy:</b> "There are several of those labs, but we also see <b>quite a bit of enterprise adoption</b> and usage of AI." … "all these customer experiences we know are going to be <b>completely reinvented</b>." … "Normally, that would have taken 40 or 50 people about a year to do. We took five really smart, AI-forward-thinking people building on agentic coding tools, and those five people <b>rebuilt it in 65 days</b>."' },
      ],
      highlights:[
        { tag:'thesis', band:'lead', open:'How fast does the $364B + $100B Anthropic book convert to revenue — and can supply keep up?',
          head:'The demand proof: backlog $364B excluding the $100B+ Anthropic deal, with AWS at +28% and over $225B of Trainium commitments',
          detail:'<p><b>Andy Jassy:</b> "It is very unusual for a business to grow this fast on a base this large" … "the backlog for Q1 is <b>$364 billion</b>. That does not include the recent deal that we announced with Anthropic for over $100 billion." … "our annual revenue run rate is now <b>over $20 billion</b>" … "we now have <b>over $225 billion in revenue commitments for Trainium</b>." … "Trainium3 … is nearly fully subscribed, and much of Trainium4, which is still about 18 months from broad availability, has already been reserved."</p><p><b>Open:</b> conversion pace. <b>Andy Jassy:</b> "typically six to 24 months before we start billing customers depending on the component."</p>' },
        { tag:'watch', band:'lead', open:'Does memory inflation move the ~$200B frame — and where does it show first, capex or AWS margin?',
          head:'The cost front opened: memory "skyrocketed", and the Q2 guide carries the SBC step-up, ~$1B of LEO cost and fuel inflation',
          detail:'<p><b>Andy Jassy:</b> "the cost of components, particularly memory, has <b>skyrocketed</b>." … "we have worked with our strategic suppliers to get a significant amount of supply." … "it is a further impetus pushing companies who have on-premises infrastructure into the cloud."</p><p><b>Brian Olsavsky:</b> "this assessment includes the impact of our <b>seasonal step-up in stock-based compensation expense</b> in Q2" … "we do expect a year-over-year cost increase of <b>approximately $1 billion related to Amazon LEO</b>" … "and we expect to begin capitalizing certain costs in Q4." … "our guidance anticipates higher transportation costs related to fuel inflation"</p>' },
        { tag:'thesis', band:'context',
          head:'Record 13.1% operating margin: units +15% vs fulfillment expense +9%, latest robotics in every 2026 US large-format launch',
          detail:'<p><b>Brian Olsavsky:</b> "with an operating margin of <b>13.1%, our highest operating margin ever</b>." … "Overall unit growth of 15% continues to outpace our cost to operate the fulfillment network, as outbound shipping costs grew 12% year over year and <b>fulfillment expense grew 9%</b> year over year, both on an FX-neutral basis." … "All of our U.S. large-format fulfillment center launches in 2026 will have this latest generation technology."</p><p><b>Andy Jassy:</b> "Normally, that would have taken 40 or 50 people about a year to do." … "those five people <b>rebuilt it in 65 days</b>. That is a very different world of operating."</p>' },
        { tag:'curious', band:'context',
          head:'Agentic commerce numbers: Rufus monthly active users up over 115%, engagement up nearly 400%; Jassy expects advertising to do well',
          detail:'<p><b>Andy Jassy:</b> "Monthly active users are <b>up over 115%</b> and engagement is up nearly 400% year over year." … "They are not often able to get the pricing right or the product information right. They do not have any personalization data or any shopping history." … "I actually believe that <b>we are going to like this for advertising</b>." … "In that process of having multi-turns, there are multiple opportunities to surface relevant products to customers, many of which will be organic and some of which will be sponsored." … "generating <b>$17.2 billion of revenue in the quarter and up 22%</b> year over year."</p>' },
        { tag:'curious', band:'logged',
          head:'LEO: over 250 satellites in space, commercial service in Q3, Delta/JetBlue/AT&T/Vodafone/NASA committed, Apple agreement',
          detail:'<p><b>Andy Jassy:</b> "we have <b>over 250 satellites</b> in space" … "We already have meaningful revenue commitments from enterprises and governments including Delta Air Lines, JetBlue, AT&T, Vodafone, DIRECTV Latin America, Australia’s National Broadband Network, DP World Tour, NASA, and others." … "I think the business has a chance to be a <b>very large, many-billion-dollar revenue business</b>"</p><p><b>Brian Olsavsky:</b> "Amazon LEO’s commercial service is on track to launch in Q3"</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: Alexa+ twice the conversation and 3x device purchases · OpenAI models in Bedrock (GPT-5.4 live) · grocery $150B+ gross sales',
          detail:'<p><b>Andy Jassy:</b> "Customers are loving Alexa Plus, talking to Alexa <b>twice as much</b> and for longer durations across a wider breadth of topics, completing purchases on devices <b>3x more</b>" … "Yesterday, we added OpenAI’s GPT-5.4 model, with 5.5 coming soon." … "Amazon Bedrock, which is used expansively by <b>over 125,000 customers</b>, runs most of its inference on Trainium. Almost 80% of the Fortune 100 companies are using Bedrock." … "with more than <b>$150 billion in gross sales in 2025</b>, we are now the second-largest grocer in the U.S." … "perishable sales have grown over 40x year over year"</p>' },
      ],
      newQuestions:[
        { n:'Does AWS accelerate AGAIN (Street +31%) with backlog converting?', landed:{ q:'Q2 2026', rank:1 } },
        { n:'What does memory inflation do to the ~$200B frame / AWS margin?', landed:{ q:'Q2 2026', rank:2 } },
        { n:'Is 13.1% margin the peak or the base (SBC + LEO + fuel in the guide)?', landed:{ q:'Q2 2026', rank:3 } },
        { n:'Agentic commerce: do Rufus numbers keep compounding into ads?', landed:{ q:'Q2 2026', rank:4 } },
        { n:'Trainium rack sales — from "possibility" to plan?', landed:{ q:'Q2 2026', rank:5 } },
      ],
    } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Feb 5, 2026) ──
  { q:'Q4 2025', status:'reported', date:'February 5, 2026',
    setup:{
      source:'Refinitiv/LSEG pre-print consensus (via js/results-data/amzn.js) — the number that stood going in', asOf:'2026-01',
      notes:{
        'EPS (diluted)':{ t:'The one line that did not beat', h:'<p>Consensus $1.97 vs a $1.95 print — the only miss on the card, and it is the charges: the quarter carries <b>$2.4B of special items</b> ($1.1B Italy tax settlement, $730M severance, $610M store impairments).</p>' }
      },
      us:ceSummitUs('4Q25'),
      debate:{ rows:null, synth:'Going in: the holiday quarter had to prove AWS\'s +34%→? re-acceleration was real and set a credible 2026 spend frame — with the tape braced for a very large capex number.' },
      pricedIn:'A record holiday quarter (units, ads, same-day records) with AWS re-accelerating past +24%; the open question was the SIZE of the 2026 capex frame and whether guidance would absorb it without breaking the margin story.',
      oneLiner:'The bar was "cap the year, frame the spend" — Amazon beat on revenue and AWS, then dropped the ~$200B capex number that repriced the whole debate; the soft Q1 guide did the rest (stock dipped despite the beat).' },
    results:{
      headline:'A record holiday close (revenue $213.4B, AWS +24% at a 13-quarter high, backlog $244B) — overshadowed by the ~$200B FY26 capex frame and a soft Q1 guide.',
      notes:{
        'Revenue':{ t:'Above the top of the guide', h:'<p><b>$213.4B (+12% ex-FX)</b> vs $211.3B consensus and a $206–213B guide — above the top for the 10th time in 13 prints. Paid units +12% (best of 2025); 3P units 61% of the total.</p>' },
        'Operating income':{ t:'$25.0B WITH $2.4B of charges', h:'<p>$25.0B against a $21–26B guide — <b>ex the $2.4B of special charges</b> (Italy tax $1.1B · severance $730M · store impairments $610M), ~$27.4B, above the top. NA margin 9% (from 8%); International 2.1%.</p>' },
        'EPS (diluted)':{ t:'The charges line', h:'<p>$1.95 vs $1.97 — GAAP grazed under on the special items; operationally a beat. TTM free cash flow $11.2B — the number the ~$200B capex frame then made the story.</p>' },
        'Capex':{ t:'The number that repriced the year', h:'<p>Q4 capex $39.5B; FY25 $131.8B. The news: <b>"about $200 billion" for 2026, "predominantly in AWS"</b> — the frame that sent the Summit model\'s FY26 capex from $151B to $205B (+36%) at the next snapshot and flipped its FY26 FCF forecast negative.</p>' },
        'AWS net sales':{ t:'+24% — 13-quarter high, 35% margin', h:'<p><b>$35.6B (+24%)</b> vs $34.9B consensus, $142B run-rate, margin 35% (+40bps). Backlog <b>$244B (+40% YoY, +22% QoQ)</b>. Added >1GW of capacity in Q4 — "more than any other company in the world" for 2025; 3.99GW of power added in the year, doubling again by 2027.</p>' },
        'Advertising':{ t:'$21.3B (+22%)', h:'<p>$12B of incremental ad revenue in 2025; Prime Video ads at 315M viewers in 16 countries; TNF most-streamed NFL season on record.</p>' }
      },
      watch:{ 'Capex':1, 'AWS net sales':2, 'Revenue':3 },
      thesisCheck:[
        { line:'AWS re-acceleration stalls', tripped:false, note:'+24%, a 13-quarter high, with backlog +40% and 35% margin — the acceleration thesis held and compounded.' },
        { line:'The 2026 spend frame breaks the FCF story', tripped:true, note:'⚑ "~$200B, predominantly AWS" against $11.2B of TTM FCF — the model flipped FY26 FCF negative at the next snapshot. Demand-led, but the red-line as written fired: the frame outran the cash.' },
        { line:'Holiday retail loses efficiency', tripped:false, note:'NA margin UP to 9% in the heaviest quarter; a million robots in the network; 8B+ same/next-day items (+30%).' },
        { line:'Custom silicon fails to scale', tripped:false, note:'$10B+ run-rate; Trainium triple-digit growth; Project Rainier at 500K chips for Anthropic\'s next Claude model; Trainium3 supply "nearly all committed by mid-2026".' },
      ],
      intoCall:[
        '💸 <b>~$200B</b> — composition, cadence, and what it does to FY26 FCF?',
        '☁️ <b>Backlog $244B (+40%)</b> — conversion pace vs capacity installs?',
        '🤖 <b>Rainier 500K chips → 1M?</b> — the Anthropic/Trainium flywheel.',
        '🛒 <b>Rufus 300M users, 60% completion lift</b> — does agentic commerce compress or expand the funnel?',
      ],
      priceReaction:'Stock dipped on the print despite the beats (coverage: revenue beat, stock down) — the ~$200B frame + the soft Q1 guide ($16.5–21.5B op income) set the tone.' },
    call:{
      // ③ THE CALL, CLASSIFIED. Quotes verbatim from The Motley Fool transcript, "Amazon (AMZN) Q4 2025 Earnings Call Transcript"
      // (https://www.fool.com/earnings/call-transcripts/2026/02/05/amazon-amzn-q4-2025-earnings-call-transcript/), call Feb 5, 2026.
      prepared:[
        { topic:'Revenue $213.4B, up 12% ex-FX; operating income $25.0B; TTM free cash flow $11.2B', theme:'Margins',
          body:'<b>Andy Jassy:</b> "We are reporting <b>$213.4 billion in revenue, up 12%</b> year over year excluding the impact from foreign exchange rates. Operating income was <b>$25 billion</b>, and trailing twelve-month free cash flow was <b>$11.2 billion</b>."' },
        { topic:'AWS $35.6B, up 24% (13-quarter high); $142B run-rate; operating income $12.5B', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "AWS growth continued to accelerate to <b>24%</b>, the fastest we\'ve seen in thirteen quarters." … "AWS is now a <b>$142 billion annualized run rate</b> business."<br><b>Brian Olsavsky:</b> "Revenue was <b>$35.6 billion</b>, and growth accelerated to 24% year over year." … "This growth was helped in part by the <b>more than one gigawatt of capacity</b> we added in Q4." … "In 2025, AWS added more data center capacity than any other company in the world. AWS operating income was <b>$12.5 billion</b>."' },
        { topic:'Chips business over $10B run-rate; Graviton +50%; 1.4M Trainium2 chips landed', theme:'Custom silicon',
          body:'<b>Andy Jassy:</b> "And our chips business, inclusive of Graviton and Trainium, is now <b>over $10 billion in annual revenue run rate</b> growing triple-digit percentages year over year." … "Graviton itself is a multibillion-dollar annualized run rate business growing <b>more than 50%</b> year over year." … "We\'ve landed over <b>1.4 million Trainium two chips</b> our fastest ramping chip launch ever." … "We are seeing very strong demand for Trainium three and expect nearly all of our Trainium three supply of chips to be <b>committed by mid-2026</b>."' },
        { topic:'Bedrock a multibillion-dollar run-rate, customer spend +60% QoQ', theme:'Backlog',
          body:'<b>Andy Jassy:</b> "Bedrock is now a <b>multibillion-dollar annualized run rate</b> business, and customer spend grew <b>60% quarter over quarter</b>." … "For example, the number of developers using Curo grew more than 150% quarter over quarter."' },
        { topic:'About $200B of 2026 capex, predominantly AWS', theme:'Capex',
          body:'<b>Andy Jassy:</b> "We expect to invest about <b>$200 billion in capital expenditures</b> across Amazon.com, Inc., but predominantly in AWS, because we have very high demand." … "And we are monetizing capacity as fast as we can install it."' },
        { topic:'Stores: everyday essentials one in three units; lowest-priced US retailer 9th year; Rufus 300M customers', theme:'Robotics',
          body:'<b>Andy Jassy:</b> "In 2025, everyday essentials grew nearly twice as fast as all other categories in The US, representing <b>one out of three units</b> sold in our store." … "A recent study from Profitero showed that Amazon.com, Inc. is America\'s lowest priced retailer for the <b>ninth straight year</b>." … "Last year, <b>more than 300 million customers</b> used Rufus."<br><b>Brian Olsavsky:</b> "Last year, US Prime members received <b>over 8 billion items</b> the same or next day. Up more than 30% year over year."' },
        { topic:'Advertising $21.3B, up 22%; $12B added in 2025; Prime Video ads 315M viewers', theme:'Advertisement',
          body:'<b>Andy Jassy:</b> "We are pleased with the continued strong growth across our full funnel offerings generating <b>$21.3 billion</b> of revenue in the quarter and growing <b>22%</b> year over year." … "Prime Video has an average ad supported audience of <b>315 million viewers</b> globally, up from 200 million in early 2024."<br><b>Brian Olsavsky:</b> "we added over <b>$12 billion of incremental revenue</b> in 2025 alone."' },
        { topic:'$2.4B of special charges; North America margin 9%', theme:'Margins',
          body:'<b>Brian Olsavsky:</b> "This operating income includes three special charges, which reduced operating income by <b>$2.4 billion</b>. The first charge of $1.1 billion is for the resolution of tax disputes associated with our stores business in Italy, and the settlement of a lawsuit." … "The second charge is $730 million for the estimated severance costs." … "The third charge of $610 million is for asset impairments primarily related to physical stores." … "North America segment operating income was $11.5 billion with an operating margin of <b>9%</b>. Up from an 8% margin in 2024."' },
        { topic:'Q1 2026 guide: net sales $173.5-178.5B; about $1B more Amazon LEO cost in North America', theme:'Margins',
          body:'<b>Brian Olsavsky:</b> "Q1 net sales are expected to be between <b>$173.5 billion and $178.5 billion</b>." … "Within the North America segment, we do expect a year over year cost increase of approximately <b>$1 billion</b> related to Amazon LEO." … "We expect that later in the year, many of these costs, such as satellite manufacturing and launch services, will be capitalized."<br><b>Andy Jassy:</b> "We\'ve launched <b>180 satellites</b> have more than 20 launches planned in 2026, more than 30 in 2027, and expect to launch commercially in 2026."' },
      ],
      qanda:[
        { q:'Return on the capex, duration of the cycle, a free cash flow floor', analyst:'Mark Mahaney · Evercore ISI', theme:'Margins',
          qFull:'The debate is the long-term return on invested capital: how will investors see it, how long does this capex cycle last, what profitability should we expect, and is there a minimum free cash flow level you will not go below?',
          a:'<b>Brian Olsavsky:</b> "AWS is <b>35% operating margin</b> through Q4, up 40 basis points year over year." … "It certainly has a headwind from the investments in AI and the depreciation on that CapEx. But we also work very hard to offset that with efficiencies." … "And what we are continuing to see is as fast as we install this capacity, this AI capacity, <b>we are monetizing it</b>. So it\'s just a very unusual opportunity."' },
        { q:'Project Rainier after its first full quarter; 500K vs 1M chips; spending guardrails', analyst:'Douglas Anmuth · JPMorgan', theme:'Custom silicon',
          qFull:'How is Project Rainier with Anthropic running after its first full quarter, and how do the 500,000 chips in the release square with the 1,000,000 mentioned earlier? Are there financial guardrails on the spend, in operating income growth or positive free cash flow?',
          a:'<b>Andy Jassy:</b> "Anthropic is building their next they\'re training the next Claude model on top of Trainium two. And that\'s what Project Rainier is. We talked about <b>500,000 chips</b> there. You will see that continuing to increase." … "Trainium is a multibillion-dollar annualized run rate business at this point and it\'s <b>fully subscribed</b>." … "we are going to <b>invest aggressively</b> here to be the leaders"' },
        { q:'How top-heavy AI demand changes in 2026; extending the OpenAI relationship', analyst:'Ross Sandler · Barclays', theme:'Backlog',
          qFull:'AI spend has clustered around a few AI-native labs: how does that change into 2026, and how could the relationship with a company like OpenAI extend to help Amazon\'s AI efforts on both retail and AWS?',
          a:'<b>Andy Jassy:</b> "it\'s really kind of a <b>barbelled market demand</b>" … "But I think that middle part of the barbell very well may end up being the <b>largest and the most durable</b>" … "I think we announced an agreement with OpenAI in November. We\'re excited about that agreement." … "It\'s gonna be <b>thousands of companies</b> over time."' },
        { q:'Agentic shopping: what it means for retail and on-site ads', analyst:'Michael Morton · MoffettNathanson', theme:'Advertisement',
          qFull:'With Rufus data points and other platforms rolling out agentic protocols, how does agentic shopping play out for the retail business and for on-site ads, given a possible compression of the funnel as consumers get better answers?',
          a:'<b>Andy Jassy:</b> "Customers who used Rufus are about <b>60% more likely to complete a purchase</b>" … "these horizontal agents don\'t have any of your shopping history, they get a lot of the product details wrong. They get a lot of the pricing wrong." … "I think a lot of customers are ultimately gonna choose to use a <b>great shopping agent from that retailer</b>"' },
        { q:'Retail in 2026: sources of efficiency vs areas of investment', analyst:'Brian Nowak · Morgan Stanley', theme:'Robotics',
          qFull:'On the global retail business this year, where are the sources of efficiency and cost-to-serve savings, and where is the investment for more durable growth, robotics included?',
          a:'<b>Andy Jassy:</b> "we\'ve extended the number of regions. You know, it was <b>eight. It\'s now 10</b>." … "we\'ve made a huge amount of progress in being able to get <b>more units into each box</b>." … "we have <b>over a million robots</b> today in our fulfillment network."' },
        { q:'AWS backlog at Q4; internal vs external demand; closing the supply gap', analyst:'Eric Sheridan · Goldman Sachs', theme:'Backlog',
          qFull:'What is the AWS revenue backlog at Q4, how do internal and external AI needs compare given any supply and demand imbalance, and how does the gap close as capacity comes online through 2026?',
          a:'<b>Andy Jassy:</b> "our backlog is <b>$244 billion</b>. That\'s up 40% year over year. I think it\'s up 22% quarter over quarter." … "the vast majority of our the capital that we spend and the capacity that we have consumed by <b>external customers</b>." … "in the last twelve months, we added <b>3.99 gigawatts</b> of power." … "We expect to double it again by the \'27."' },
      ],
      highlights:[
        { tag:'watch', band:'lead', open:'Composition + cadence of the $200B — and what FY26 FCF looks like under it.',
          head:'About $200B of 2026 capex, predominantly AWS, against $11.2B of TTM free cash flow',
          detail:'<p><b>Andy Jassy:</b> "We expect to invest about <b>$200 billion in capital expenditures</b> across Amazon.com, Inc., but predominantly in AWS, because we have very high demand." … "in the last twelve months, we added <b>3.99 gigawatts</b> of power. Just for perspective, that\'s twice what we had in 2022" … "We expect to double it again by the \'27. We added 1.2 gigawatts of power in Q4 just quarter over quarter."<br><b>Brian Olsavsky:</b> "as fast as we install this capacity, this AI capacity, we are monetizing it. So it\'s just a very unusual opportunity."</p>' },
        { tag:'thesis', band:'context',
          head:'AWS up 24% (13-quarter high), backlog $244B (+40% YoY), operating margin 35%',
          detail:'<p><b>Brian Olsavsky:</b> "We added <b>$2.6 billion</b> in quarter over quarter revenue" … "AWS is <b>35% operating margin</b> through Q4, up 40 basis points year over year."<br><b>Andy Jassy:</b> "our backlog is <b>$244 billion</b>. That\'s up 40% year over year." … "the vast majority of our the capital that we spend and the capacity that we have consumed by external customers." … "always a very small fraction of the total" … "We have over a thousand AI applications that we\'ve either deployed or in the process of building"</p>' },
        { tag:'thesis', band:'context',
          head:'Chips business over $10B run-rate growing triple digits; Rainier at 500K chips',
          detail:'<p><b>Andy Jassy:</b> "Graviton itself is a multibillion-dollar annualized run rate business growing <b>more than 50%</b> year over year." … "is used expansively by over 90% of AWS\'s top thousand customers." … "Trainium two is <b>30 to 40% more price performance</b> than comparable GPUs." … "We talked about 500,000 chips there. You will see that continuing to increase." … "expect nearly all of our Trainium three supply of chips to be committed by mid-2026."</p>' },
        { tag:'curious', band:'context',
          head:'Rufus used by 300M customers in 2025; users about 60% more likely to complete a purchase',
          detail:'<p><b>Andy Jassy:</b> "Customers who used Rufus are about <b>60% more likely to complete a purchase</b>" … "they want really broad selection, They want low prices. They want really fast delivery. And then they want they want a retailer that they can trust and that takes care of them." … "It can also now shop tens of millions of items in other online stores and make purchases for customers using our agentic buy for me feature." … "And they did it 45% more year over year."</p>' },
        { tag:'watch', band:'logged',
          head:'$2.4B of special charges: Italy tax and lawsuit $1.1B · severance $730M · asset impairments $610M',
          detail:'<p><b>Brian Olsavsky:</b> "This operating income includes three special charges, which reduced operating income by <b>$2.4 billion</b>." … "The second charge is $730 million for the estimated severance costs." … "Excluding the impact of special charges mentioned earlier, International segment operating margins also expanded year over year."</p>' },
        { tag:'logged', band:'logged',
          head:'Call colour: 1M+ robots in the network · 8B+ same/next-day items (+30%) · Prime Video ads 315M viewers · Alexa+ free for Prime',
          detail:'<p><b>Andy Jassy:</b> "we have <b>over a million robots</b> today in our fulfillment network." … "Prime Video has an average ad supported audience of 315 million viewers globally" … "We just made Alexa Plus available to all customers in The US, free for prime members and $19.99 a month for non prime members." … "We\'ve launched 180 satellites have more than 20 launches planned in 2026"<br><b>Brian Olsavsky:</b> "Last year, US Prime members received over 8 billion items the same or next day. Up more than 30% year over year."</p>' },
      ],
      newQuestions:[
        { n:'Does AWS keep accelerating into the $200B build?', landed:{ q:'Q1 2026', rank:1 } },
        { n:'What is the capex cadence and FCF path under the frame?', landed:{ q:'Q1 2026', rank:2 } },
        { n:'Does retail efficiency hold outside the holiday peak?', landed:{ q:'Q1 2026', rank:3 } },
        { n:'Rufus/agentic commerce: usage → dollars?', landed:{ q:'Q1 2026', rank:4 } },
        { n:'Rainier: 500K chips → 1M?', landed:{ q:'Q1 2026', rank:5 } },
      ],
    } },
]};
