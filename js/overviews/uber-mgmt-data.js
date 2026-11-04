// uber-mgmt-data.js — Uber Deep Dive ▸ Management ▸ Executives & Board (MG-TEAM), data for the shared engine
// js/overviews/management.js (makeManagement). Moved out of uber.js UBER_MGMT (relocation map #89) and checked
// against the primary documents (Nov 3 2026):
//   • executives = the ten on uber.com/about/leadership (read Nov 3 2026), titles as published there;
//   • executive-officer dates and prior roles = the 2026 proxy statement (DEF 14A filed Mar 23 2026, amended by the
//     DEFR14A of Apr 20 2026 — the amendment only corrects Nikesh Arora's committees) and the 8-K of May 11 2026
//     (Jill Hazelbaker promoted to President & Chief Corporate Affairs Officer; Nikki Krishnamurthy, Chief People
//     Officer, stepped down);
//   • board = the ten directors elected at the May 4 2026 annual meeting (8-K of May 8 2026); committees and
//     "director since" from the proxy. David Trujillo (director since 2017) left the board at that meeting.
// Changes against the July file: brand → Summit token (set in uber.js); lede no longer says the finance seat "turned
// over three times in three years" (it is three CFOs since 2023: Chai → Mahendra-Rajah → Krishnamurthy); the foot no
// longer points to Pillars for ownership (A30); Susan Anderson (Head of Delivery) is no longer on the leadership page,
// so her card is out of the grid — her July entry is kept below, commented, for SAB to restore if wanted.
// `line` and `bio` are plain text (escaped by the engine); `gov[].v/.d` and `boardNote` are HTML.
export var UBER_MGMT_DATA = {
  lede:'Uber is run by a long-tenured operating bench under CEO <b>Dara Khosrowshahi</b> (since 2017), most of it promoted from inside: the President &amp; COO, the President &amp; Chief Corporate Affairs Officer and the CFO all came up through Uber. The one seat that has moved is finance — <b>Balaji Krishnamurthy</b> (February 2026) is the third CFO since 2023.',
  execs:[
    { id:'dara', lead:true, name:'Dara Khosrowshahi', title:'Chief Executive Officer', since:'CEO and director since Sep 2017', img:'img/leadership/uber-dara.jpg',
      line:'CEO since 2017; previously CEO of Expedia for twelve years and CFO of IAC.',
      bio:'Chief Executive Officer and a director of Uber since September 2017. President and CEO of Expedia (2005-2017); at IAC/InterActiveCorp from 1998 to 2005, including Executive Vice President and CFO (2002-2005) and CEO of IAC Travel (2005); Allen & Company from 1991 to 1998. Serves on the boards of Expedia Group and Grab Holdings; earlier on the boards of Aurora Innovation (2021-2024), The New York Times Company (2015-2017) and TripAdvisor (2011-2013) (2026 proxy).' },
    { id:'macdonald', name:'Andrew Macdonald', title:'President & Chief Operating Officer', since:'At Uber since 2012 · President & COO since Jun 2025', img:'img/leadership/uber-macdonald.jpg',
      line:'Runs Mobility, Delivery and Autonomous operations; Uber’s first COO since 2019.',
      bio:'President and Chief Operating Officer since June 2025. Senior Vice President, Head of Global Mobility from June 2019 to June 2025, and general-management and regional roles from 2012 (he joined as the first general manager in Toronto). Before Uber, a consultant at Bain & Company (2007-2010) and co-founder of several early-stage companies. Director of Neutron Holdings (Lime) since 2022 and Maple Leaf Foods since 2023 (2026 proxy).' },
    { id:'hazelbaker', name:'Jill Hazelbaker', title:'President & Chief Corporate Affairs Officer', since:'At Uber since 2015 · President since May 2026', img:'img/leadership/uber-hazelbaker.jpg',
      line:'Marketing, communications, public policy, people and safety operations.',
      bio:'President and Chief Corporate Affairs Officer since May 11, 2026, when she took over the people function from Nikki Krishnamurthy and added oversight of Safety Operations (8-K, May 11 2026). Chief Marketing Officer and Senior Vice President, Communications and Public Policy, from June 2019; SVP Communications and Public Policy 2017-2019; VP from 2015. Before Uber: Snap (2014-2015), Google (2010-2014), and communications director of Senator John McCain’s 2008 presidential campaign.' },
    { id:'balaji', name:'Balaji Krishnamurthy', title:'Chief Financial Officer', since:'At Uber since 2019 · CFO since Feb 2026', img:'img/leadership/uber-balaji.png',
      line:'Internal promotion: ex-head of Investor Relations and Strategic Finance; ex-Goldman Sachs.',
      bio:'Chief Financial Officer since February 2026, succeeding Prashanth Mahendra-Rajah. Vice President, Strategic Finance (September 2023-February 2026), Senior Director, Strategic Finance (2023) and Head of Investor Relations (December 2020-March 2023). Before Uber, Vice President of Equity Research, US Hardware and Communications Technology, at Goldman Sachs (2011-2019) (2026 proxy).' },
    { id:'west', name:'Tony West', title:'SVP, Chief Legal Officer & Corporate Secretary', since:'At Uber since Nov 2017', img:'img/leadership/uber-west.jpg',
      line:'Ex-US Associate Attorney General; ex-General Counsel of PepsiCo.',
      bio:'Senior Vice President, Chief Legal Officer and Corporate Secretary since November 2017. Executive Vice President, Government Affairs, General Counsel and Corporate Secretary of PepsiCo (2014-2017); the 17th Associate Attorney General of the United States (2012-2014) after leading the Justice Department’s Civil Division (2009-2012); partner at Morrison & Foerster (2001-2009). Director of BXP since 2023 (2026 proxy).' },
    { id:'kannan', name:'Madhu Kannan', title:'Chief Business Officer', since:'Joined 2017 · rejoined 2023', img:'img/leadership/uber-kannan.jpg',
      line:'Business development, corporate development and strategy; ex-BofA, ex-CEO of the Bombay Stock Exchange.',
      bio:'Chief Business Officer; oversees global business development and corporate strategy. First joined Uber in 2017 and returned in 2023 from Bank of America Securities (Uber leadership page).' },
    { id:'kansal', name:'Sachin Kansal', title:'Chief Product Officer', since:'At Uber since 2017', img:'img/leadership/uber-kansal.jpg',
      line:'Mobility and Delivery product, plus autonomous and sustainability.',
      bio:'Chief Product Officer; joined in 2017 as the first product leader for safety technology. Oversees Mobility and Delivery products plus autonomous and sustainability initiatives (Uber leadership page).' },
    { id:'maredia', name:'Sarfraz Maredia', title:'Head of Autonomous Mobility & Delivery', since:'At Uber since 2014', img:'img/leadership/uber-maredia.jpg',
      line:'Runs the autonomous-vehicle partnerships across rides and delivery.',
      bio:'Head of Autonomous Mobility and Delivery; leads Uber’s AV efforts. Joined in 2014; previously ran US & Canada Mobility and the Americas for Uber Eats (Uber leadership page).' },
    { id:'praveen', name:'Praveen Neppalli Naga', title:'Chief Technology Officer', since:'At Uber since 2015', img:'img/leadership/uber-praveen.jpg',
      line:'Engineering and science; ex-LinkedIn.',
      bio:'Chief Technology Officer; leads engineering and science strategy. Joined in 2015; previously about seven years at LinkedIn building products and data infrastructure (Uber leadership page).' },
    { id:'pradeep', name:'Pradeep Parameswaran', title:'Head of Mobility', since:'At Uber since 2017', img:'img/leadership/uber-pradeep.jpg',
      line:'Runs ride-hailing across the 70+ countries Uber operates in.',
      bio:'Head of Mobility; runs global ride-sharing. Joined in 2017; previously led mobility in India, South Asia and Asia-Pacific (Uber leadership page).' },
    // Not on uber.com/about/leadership as of Nov 3 2026 — kept for SAB (July 2026 entry):
    // { id:'anderson', name:'Susan Anderson', title:'Head of Delivery', since:'At Uber since 2016', img:'img/leadership/uber-anderson.jpg',
    //   line:'Runs Uber Eats across 30+ countries.',
    //   bio:'Head of Delivery; runs Uber Eats and global grocery/on-demand delivery. Joined in 2016, starting by leading Uber Eats in Queensland, Australia. Prior: Amazon, Bain, Capital One.' },
  ],
  board:[
    { name:'Ronald Sugar', chair:true, independent:true, role:'Independent Chair since Jul 2018 · ex-Chairman & CEO of Northrop Grumman · chairs Nominating & Governance; Compensation · director since 2018.' },
    { name:'Dara Khosrowshahi', dual:true, independent:false, role:'Chief Executive Officer · no committees · director since 2017.' },
    { name:'Revathi Advaithi', independent:true, role:'CEO of Flex · Audit · director since 2020.' },
    { name:'Turqi Alnowaiser', independent:true, role:'Deputy Governor, Saudi Public Investment Fund (holder of 3.6% of Uber) · Audit · director since 2023.' },
    { name:'Nikesh Arora', independent:true, role:'Chairman & CEO of Palo Alto Networks · Nominating & Governance; Compensation · director since 2025.' },
    { name:'Ursula Burns', independent:true, role:'Co-founder, Integrum Holdings · ex-CEO of Xerox and VEON · Audit; Nominating & Governance · director since 2017.' },
    { name:'Robert Eckert', independent:true, role:'Operating Partner, FFL Partners · ex-CEO of Mattel · chairs Compensation; Nominating & Governance · director since 2020.' },
    { name:'Amanda Ginsberg', independent:true, role:'Operating Partner, Advent International · ex-CEO of Match Group · Compensation; Nominating & Governance · director since 2020.' },
    { name:'John Thain', independent:true, role:'Founding Partner, Pine Island Capital · ex-CEO of CIT Group and Merrill Lynch · chairs Audit · director since 2017.' },
    { name:'Alexander Wynaendts', independent:true, role:'ex-CEO & Chairman of Aegon · Audit · director since 2021.' },
  ],
  boardNote:'the full 10-member board elected at the May 4, 2026 annual meeting: 9 independent, an independent Chair that the governance guidelines require to be separate from the CEO, and three committees (Audit, Compensation, Nominating &amp; Governance) made up only of independent directors. David Trujillo left the board at that meeting',
  gov:[
    { k:'Share & voting', v:'One class · 1 vote a share', d:'No dual-class stock, no poison pill, no classified board; majority voting for directors (2026 proxy).' },
    { k:'Board', v:'9 of 10 independent', d:'Independent Chair separate from the CEO · all directors elected every year.' },
    { k:'CEO pay · FY2025', v:'$35.6M · 96% at risk', d:'Base salary $1.1M (raised 10% in 2025, the first rise since 2017); CEO-to-median pay ratio 360 to 1 (2026 proxy).' },
  ],
  foot:'Executives: uber.com/about/leadership (read Nov 3 2026); dates and prior roles of the executive officers from Uber’s 2026 proxy statement (DEF 14A, SEC EDGAR, filed Mar 23 2026; DEFR14A of Apr 20 2026) and the Form 8-K of May 11 2026. Board, committees and pay: the same proxy; directors elected per the Form 8-K of May 8 2026. Photos: img/leadership. Holdings are in Ownership.',
};
