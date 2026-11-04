// tpl-mgmt-data.js — Texas Pacific Land Deep Dive ▸ Management ▸ Executives & Board (MG-TEAM), data for the shared engine
// js/overviews/management.js (makeManagement). Structure copied from googl-mgmt-data.js.
// Executives: the management team TPL publishes (texaspacific.com/about/management-team, read Nov 4 2026), in the
// page's order; titles, start dates and prior roles from the 2026 proxy statement (DEF 14A, acc. 0001104659-26-110963,
// filed Sep 25 2026, "Executive Officers" and "Significant Employees") where it covers the person, otherwise from the
// company page. `since` = the year the person joined TPL (or the Trust); left blank where no filing or company page
// gives it. Board, independence and committees: the same proxy ("Board Structure and Committees", as of Sep 25 2026).
// `line` and `bio` are plain text (escaped by the engine).
export var TPL_MGMT_DATA = {
  lede:'TPL is run by a <b>small, home-grown team</b>: the company had 132 employees on Aug 1 2026, and its CEO, <b>Tyler Glover</b>, CFO and General Counsel all joined the old Texas Pacific Land Trust before its January 2021 conversion to a corporation. The board is eight independents plus the CEO, with an independent Chair and a director designated by the largest holder, Horizon Kinetics.',
  execs:[
    { id:'glover', lead:true, name:'Tyler Glover', title:'President & Chief Executive Officer', since:'at TPL since 2014 · CEO of the Trust Nov 2016 · CEO of the corporation since Jan 2021',
      line:'Has run TPL since 2016, through the creation of the water business (2017) and the conversion from a trust to a corporation (2021).',
      bio:'President and Chief Executive Officer of Texas Pacific Land Corporation and a director since January 11, 2021. Before the conversion he was Chief Executive Officer, Co-General Agent and Secretary of the Texas Pacific Land Trust (November 2016 to January 2021) and, earlier, Assistant General Agent of the Trust (December 2014 to November 2016). Also President and Chief Executive Officer of Texas Pacific Water Resources LLC, the wholly owned water subsidiary, since its formation in June 2017. More than 17 years of energy services and land management experience (2026 proxy statement).' },
    { id:'steddum', name:'Chris Steddum', title:'Chief Financial Officer', since:'at TPL since 2019 · CFO since Jun 2021',
      line:'Promoted from investor relations to CFO in 2021, after a decade in oil and gas investment banking.',
      bio:'Chief Financial Officer since June 1, 2021. Before that he was Vice President, Finance and Investor Relations of TPL and of the Trust, which he joined in 2019. Earlier he spent 10 years in oil and gas investment banking, most recently as a Director at Stifel Financial Corporation (2016-2019) and before that as a Director at GMP Securities (2014-2016) (2026 proxy statement); the company page also lists Credit Suisse’s oil and gas coverage team.' },
    { id:'dobbs', name:'Micheal W. Dobbs', title:'Senior Vice President, Secretary & General Counsel', since:'at TPL since 2020',
      line:'General Counsel since the conversion; the company’s chief compliance officer.',
      bio:'Senior Vice President, Secretary and General Counsel since January 11, 2021, after serving as Senior Vice President and General Counsel of the Trust from August 2020. Previously an equity partner at Kelley Drye & Warren LLP and managing partner of its Houston office (2026 proxy statement). More than two decades of experience in property and mineral rights, water rights, easements and leaseholds (company page). The General Counsel serves as TPL’s chief compliance officer and reports to the CEO (2026 proxy).' },
    { id:'buffington', name:'Stephanie Buffington', title:'Chief Accounting Officer', since:'at TPL since 2017',
      line:'Chief Accounting Officer since 2021; built TPL’s financial reporting from the Trust days.',
      bio:'Chief Accounting Officer since June 1, 2021. Joined in December 2017 as Director of Financial Reporting and was Vice President of Financial Reporting from September 2020 to May 2021. Previously Vice President of Financial Reporting at Monogram Residential Trust, Inc., a listed REIT (2014-2017); more than 25 years of public company experience, beginning at KPMG. Licensed CPA in Texas (2026 proxy statement).' },
    { id:'keenan', name:'Katie Keenan', title:'SVP, Commercial Transactions & Assistant General Counsel', since:'at TPL since 2017',
      line:'Joined as Land Manager in 2017; now runs commercial transactions.',
      bio:'Joined TPL in January 2017 as Land Manager, then served as Vice President, Land and Legal at Texas Pacific Water Resources. Previously worked at BHP Billiton in the Permian Basin. Licensed attorney in Texas (company page).' },
    { id:'smith', name:'Jeremy Smith', title:'SVP, Business Development',
      line:'Business development; came from EOG Resources’ water sourcing team.',
      bio:'Senior Vice President, Business Development. Came from EOG Resources, where he negotiated water sourcing and purchasing agreements in the Permian Basin and the Eagle Ford Shale; earlier he led a real estate brokerage service (company page).' },
    { id:'labanowski', name:'Lawrence Labanowski', title:'SVP, Mergers & Acquisitions',
      line:'Runs acquisitions; ex-UBS energy investment banker.',
      bio:'Senior Vice President, Mergers & Acquisitions. Previously a Managing Director in UBS Investment Bank’s Global Energy Group. B.S. in Economics, the Wharton School of the University of Pennsylvania (company page).' },
    { id:'gabriel', name:'Jamie Gabriel', title:'Vice President, New Ventures',
      line:'New ventures; about 20 years in oil and gas investment banking.',
      bio:'Vice President, New Ventures. About 20 years in investment banking, most recently as a Managing Director on Intrepid Financial Partners’ oil and gas team, and earlier at Bank of America, Credit Suisse and Citigroup. M.B.A., University of Chicago Booth School of Business; B.S. in Engineering, Vanderbilt University (company page).' },
    { id:'boyd', name:'Brandon Boyd', title:'Vice President, Corporate Strategy',
      line:'Corporate strategy; ex-EOG Resources.',
      bio:'Vice President, Corporate Strategy. Came from EOG Resources, where he led strategic initiatives across the Permian Basin and the Eagle Ford Shale. M.B.A., University of Oklahoma; B.A., University of Texas at Austin (company page).' },
    { id:'amini', name:'Shawn Amini', title:'Vice President, Finance & Investor Relations',
      line:'Investor relations; ex-Invesco energy infrastructure analyst.',
      bio:'Vice President, Finance and Investor Relations. Previously a senior research analyst at Invesco focused on North American energy infrastructure; began his career in Credit Suisse’s oil and gas investment banking coverage (company page).' },
    { id:'crain', name:'Robert A. Crain', title:'Executive Vice President, Texas Pacific Water Resources', since:'at TPL since 2017',
      line:'Has run the water business since it was formed in June 2017.',
      bio:'Executive Vice President of Texas Pacific Water Resources LLC since its formation in June 2017. From 2015 to 2017 he was Water Resources Manager at EOG Resources, leading its water resource development across basins including the Permian and the Eagle Ford (2026 proxy statement, "Significant Employees"). Dual B.S. degrees from Texas State University and an M.B.A. from the University of Texas at Tyler (company page).' },
  ],
  board:[
    { name:'Rhys J. Best', chair:true, independent:true, role:'Independent, non-executive Chair · ex-Chairman, President & CEO of Lone Star Technologies · chairman of Arcosa · director since April 2022.' },
    { name:'Tyler Glover', dual:true, independent:false, role:'President & CEO · director since January 2021.' },
    { name:'Gen. Donald G. Cook, USAF (Ret.)', independent:true, role:'Retired four-star general · ex-director of Crane Co. and BNSF · Audit, Compensation, Nominating & Corporate Governance · director since January 2021.' },
    { name:'Peter Doyle', independent:true, role:'Co-founder and Co-CEO of Horizon Kinetics, the largest holder · Horizon’s designee under the May 2026 Board Representative Agreement · Strategic Acquisitions · director since May 2026.' },
    { name:'Barbara J. Duganier', independent:true, role:'CPA · ex-Accenture and Arthur Andersen · chairs Compensation; Audit, Strategic Acquisitions · director since January 2021.' },
    { name:'Donna E. Epps', independent:true, role:'CPA · ex-Deloitte partner · chairs Audit; Nominating & Corporate Governance · director since January 2021.' },
    { name:'Karl F. Kurz', independent:true, role:'Ex-COO of Anadarko · chairman of American Water Works · chairs Strategic Acquisitions; Compensation · director since April 2022.' },
    { name:'Robert Roosa', independent:true, role:'CEO of Brigham Royalties · ex-CEO of Brigham Minerals · Audit, Compensation, Strategic Acquisitions · director since November 2023.' },
    { name:'Marguerite Woung-Chapman', independent:true, role:'Ex-general counsel of EP Energy · ex-corporate secretary of El Paso Corp. · chairs Nominating & Corporate Governance; Audit · director since November 2023.' },
  ],
  boardNote:'all nine directors, every one standing for a one-year term at the November 5, 2026 annual meeting (2026 proxy statement, filed Sep 25, 2026): 8 independent, an independent Chair separate from the CEO, and four standing committees — Audit, Compensation, Nominating and Corporate Governance, Strategic Acquisitions — made up only of independent directors. Murray Stahl (Horizon Kinetics) served from January 2021 until his death on April 7, 2026',
  gov:[
    { k:'Board leadership', v:'Independent Chair', d:'Rhys J. Best is the non-executive Chair, separate from the CEO; the guidelines require a lead independent director if the Chair is ever not independent (2026 proxy).' },
    { k:'Largest holder on the board', v:'Horizon Kinetics designee', d:'Peter Doyle joined on May 5, 2026 under a Board Representative Agreement with Horizon Kinetics (14.7% of the shares), with standstill and non-disparagement terms (2026 proxy).' },
    { k:'Pay', v:'At least half of LTI performance-based', d:'Salary, an annual cash incentive and long-term equity, of which at least 50% of each executive officer’s award is performance-based; say-on-pay received about 87% of votes cast in November 2025 (10-K FY2025, Item 11). The CEO’s, CFO’s and General Counsel’s employment agreements now run to December 31, 2029 (8-K, Sep 25 2026).' },
  ],
  foot:'Executives: texaspacific.com/about/management-team (read Nov 4 2026) for the team and its order; titles, start dates and prior roles from the TPL 2026 proxy statement (DEF 14A, filed Sep 25 2026, acc. 0001104659-26-110963) for the executive officers and significant employees, the company page for the others. Board, independence and committees: the same proxy (as of Sep 25 2026); Doyle’s appointment: Form 8-K of May 6 2026. Headcount: 2026 proxy ("Human Capital Resources"). Say-on-pay: Form 10-K FY2025 (filed Feb 18 2026), Item 11; employment agreements: Form 8-K of Sep 25 2026.',
};
