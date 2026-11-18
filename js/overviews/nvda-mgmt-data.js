// nvda-mgmt-data.js — NVIDIA Deep Dive ▸ Management ▸ Executives & Board (MG-TEAM), data for the shared engine
// js/overviews/management.js (makeManagement). Replaces the old LEADERS org tree of nvidia.js (relocation map #25).
// Executives (SAB, 2026-11-02): the five executive officers of the FY2026 10-K (Item 1, "Information About Our Executive
// Officers", as of Feb 20 2026) plus co-founder Chris Malachowsky. Board: the ten nominees of the 2026 proxy statement
// (DEF 14A, filed May 12 2026) — ages, "director since", independence, committees and the Lead Director structure.
// CEO TRANSITION (8-K filed Nov 12 2026, Item 5.02 + Ex. 99.1): Jensen Huang resigned as President, CEO and director on
// Nov 11 2026; Colette Kress is Interim CEO and stays EVP & CFO; Harvey C. Jones is the first-ever Chair. Huang is kept
// (co-founder, former CEO): moved out of the lead card, not deleted. Stephen Neal’s Lead Director role after a chair was
// appointed is not disclosed. Search firm and the new oversight committee: 3Q FY27 call (docs/calls/NVDA-latest.md).
// `line` and `bio` are plain text (escaped by the engine).
export var NVDA_MGMT_DATA = {
  lede:'NVIDIA is <b>between CEOs</b>: co-founder Jensen Huang, CEO since 1993, resigned as President, CEO and director on Nov 11 2026. CFO <b>Colette Kress is Interim CEO</b> (and stays CFO) while the board searches for a permanent chief executive among internal and external candidates. The four other executive officers have served together since 2017 or earlier. Harvey C. Jones became the board’s <b>first-ever Chair</b>; with Huang gone, every director is independent.',
  execs:[
    { id:'kress', img:'img/leadership/nvda-colette.jpg', lead:true, name:'Colette M. Kress', title:'Interim CEO · EVP & Chief Financial Officer', since:'Interim CEO since Nov 11 2026 · CFO since 2013 · ex-Cisco, Microsoft',
      line:'Interim CEO since Nov 11 2026 while still CFO; CFO through the move from a $4B gaming-chip company to a $216B data-center one.',
      bio:'Appointed Interim Chief Executive Officer on November 11, 2026, after Jensen Huang’s resignation; she continues as Executive Vice President and Chief Financial Officer until a permanent successor is named (8-K, Nov 12 2026). Joined NVIDIA in 2013 as Executive Vice President and Chief Financial Officer. Before that she was Senior Vice President and CFO of the Business Technology and Operations Finance organization at Cisco (from 2010), held finance roles at Microsoft from 1997 to 2010 — CFO of the Server and Tools division from 2006 — and spent eight years at Texas Instruments. B.S. in Finance from the University of Arizona and an M.B.A. from Southern Methodist University.' },
    { id:'huang', img:'img/leadership/nvda-jensen.jpg', name:'Jen-Hsun “Jensen” Huang', title:'Co-founder · former President & CEO (1993–Nov 2026)', since:'co-founded NVIDIA in 1993 · resigned Nov 11 2026',
      line:'Ran NVIDIA for 33 years, from PC graphics chips to data-center AI systems; resigned as President, CEO and director on Nov 11 2026.',
      bio:'Resigned as President, Chief Executive Officer and a member of the Board, effective immediately, on November 11, 2026 (8-K, Nov 12 2026). Co-founded NVIDIA in 1993 and served as President, CEO and a director from its inception. Before NVIDIA he worked at LSI Logic (1985–1993), where he was Director of Coreware, the unit responsible for LSI’s system-on-chip business, and was a microprocessor designer at AMD (1983–1985). B.S.E.E. from Oregon State University and M.S.E.E. from Stanford University. The largest individual shareholder (about 3.4% of the shares; see Ownership).' },
    { id:'puri', img:'img/leadership/nvda-jay.jpg', name:'Ajay K. “Jay” Puri', title:'EVP, Worldwide Field Operations', since:'since 2005 · EVP since 2009 · ex-Sun Microsystems',
      line:'Runs global sales and field operations — the relationships with the cloud providers and system makers.',
      bio:'Joined NVIDIA in 2005 as Senior Vice President, Worldwide Sales, and became Executive Vice President, Worldwide Field Operations in 2009. Before NVIDIA he spent 22 years at Sun Microsystems in sales, marketing and general management, after positions at Hewlett-Packard, Booz Allen Hamilton and Texas Instruments. B.S.E.E. from the University of Minnesota, M.S.E.E. from Caltech and an M.B.A. from Harvard Business School.' },
    { id:'shoquist', img:'img/leadership/nvda-debora.jpg', name:'Debora Shoquist', title:'EVP, Operations', since:'since 2007 · EVP since 2009 · ex-JDS Uniphase',
      line:'Runs operations and the supply chain — foundry, memory, packaging and system partners.',
      bio:'Joined NVIDIA in 2007 as Senior Vice President of Operations and became Executive Vice President of Operations in 2009. Before NVIDIA she was EVP of Operations at JDS Uniphase (2004–2007), SVP and General Manager of the Electro-Optics business at Coherent (2002–2004), and earlier President of the Personal Computer Hard Disk Drive Division at Quantum, after starting at Hewlett-Packard. B.S. in Electrical Engineering from Kansas State University and a B.S. in Biology from Santa Clara University.' },
    { id:'teter', img:'img/leadership/nvda-tim.jpg', name:'Timothy S. Teter', title:'EVP, General Counsel & Secretary', since:'since 2017 · EVP since Feb 2018 · ex-Cooley',
      line:'Chief legal officer — export controls, antitrust reviews and intellectual property sit with him.',
      bio:'Joined NVIDIA in 2017 as Senior Vice President, General Counsel and Secretary, and became Executive Vice President, General Counsel and Secretary in February 2018. Before NVIDIA he spent more than two decades at the law firm Cooley, litigating patent and technology matters, after working as an engineer at Lockheed Missiles and Space. B.S. in Mechanical Engineering from UC Davis and a J.D. from Stanford Law School.' },
    { id:'malachowsky', img:'img/leadership/nvda-chris.jpg', name:'Chris Malachowsky', title:'Co-founder & NVIDIA Fellow', since:'co-founded NVIDIA in 1993',
      line:'One of the three founders; a long-time engineering leader, now an NVIDIA Fellow. Not an executive officer.',
      bio:'Co-founded NVIDIA in April 1993 with Jensen Huang and Curtis Priem and has held senior engineering and technical leadership roles since. He serves as an NVIDIA Fellow. He is not one of the executive officers named in the 10-K and is not a director.' },
  ],
  board:[
    { name:'Harvey C. Jones', chair:true, independent:true, role:'Chair of the Board since Nov 11 2026 (NVIDIA’s first-ever chair) · Managing Partner, Square Wave Ventures · former CEO and Executive Chairman of Synopsys · Audit and Nominating committees · audit financial expert · director since 1993.' },
    { name:'Stephen C. Neal', independent:true, role:'Lead Director in the 2026 proxy (whether the role continues under the new Chair is not disclosed) · Chair of the Nominating & Corporate Governance Committee · Chairman Emeritus of Cooley LLP · director since 2019.' },
    { name:'Tench Coxe', independent:true, role:'Former Managing Director, Sutter Hill Ventures · Audit and Compensation committees · director since 1993.' },
    { name:'John O. Dabiri', independent:true, role:'Professor of Aeronautics and Mechanical Engineering, Caltech · Compensation and Nominating committees · director since 2020.' },
    { name:'Dawn Hudson', independent:true, role:'Former CMO, National Football League; former CEO, Pepsi-Cola North America · Chair of the Compensation Committee · director since 2013.' },
    { name:'Melissa B. Lora', independent:true, role:'Former President, Taco Bell International · Audit and Nominating committees · audit financial expert · director since 2023.' },
    { name:'A. Brooke Seawell', independent:true, role:'Venture Partner, New Enterprise Associates · former CFO of Synopsys · Chair of the Audit Committee · director since 1997.' },
    { name:'Aarti Shah', independent:true, role:'Former SVP and Chief Information & Digital Officer, Eli Lilly · Audit and Compensation committees · director since 2020.' },
    { name:'Mark A. Stevens', independent:true, role:'Managing Partner, S-Cubed Capital · former Managing Partner, Sequoia Capital · Compensation and Nominating committees · director since 2008 (and 1993–2006).' },
    { name:'Jen-Hsun Huang', role:'Former director: co-founder; President, CEO and director from 1993 until his resignation on Nov 11 2026 (8-K, Nov 12 2026). No longer on the board.' },
  ],
  boardNote:'nine directors, all independent, since Jensen Huang left the board on Nov 11 2026 (the ten nominated in the 2026 proxy, less Huang, listed last as a former director); Harvey C. Jones is the first-ever Chair (8-K, Nov 12 2026); three committees — Audit; Compensation; Nominating and Corporate Governance — all fully independent. On Nov 17 2026 the board added a National Security and Export Control Oversight Committee of independent directors with outside advisors (3Q FY27 call)',
  gov:[
    { k:'Board leadership', v:'Independent Chair', d:'Harvey C. Jones, a director since 1993, became NVIDIA’s first-ever Chair on Nov 11 2026 (8-K, Nov 12 2026). Until then the board had no chair and Stephen C. Neal was independent Lead Director (2026 proxy); his role since is not disclosed.' },
    { k:'Voting', v:'One share, one vote', d:'A single class of common stock; directors are elected by majority vote and stockholders can call a special meeting (2026 proxy).' },
    { k:'Pay', v:'Mostly performance stock', d:'Executive pay is mostly performance stock units tied to non-GAAP operating income and multi-year total shareholder return (2026 proxy, CD&A).' },
  ],
  foot:'CEO transition and Chair: NVIDIA Form 8-K filed Nov 12 2026 (Item 5.02 and Ex. 99.1 press release, “NVIDIA Announces CEO Transition”). CEO search firm (Heidrick & Struggles) and the National Security and Export Control Oversight Committee: 3Q FY27 earnings call, Nov 17 2026 (third-party transcript). Executives: NVIDIA Form 10-K for fiscal 2026 (Item 1, Information About Our Executive Officers, as of Feb 20 2026); Chris Malachowsky: NVIDIA. Board, committees and governance: NVIDIA 2026 proxy statement (DEF 14A, filed May 12 2026). Photos: img/leadership.',
};
