// overviews/tsm-mgmt-data.js — TSMC (NYSE: TSM) Deep Dive ▸ Management data (MG-TEAM; Ownership, Governance and
// Track Record join with their own units). Data only — the renderer is the shared makeManagement mold
// (js/overviews/management.js), mounted from ./tsm-mgmt.js exactly as amzn.js / sharkninja-mgmt.js do.
//
// Field-escaping contract (management.js): execs.name/title/since/line/bio and board.name/role are ESCAPED plain
// text (no HTML, no entities); gov.v/gov.d and lede are HTML.
//
// Primary source: TSMC Form 20-F for FY2025 (SEC EDGAR, CIK 0001046179, acc. 0001628280-26-025362, filed
// Apr 16 2026), Item 6 "Directors, Senior Management and Employees" — board, executive officers, positions and
// years with the company as of Feb 28 2026, biographies, and Board Practices (committee membership). TSMC is a
// foreign private issuer: there is no proxy (DEF 14A). Bios below are condensed from the 20-F's own wording;
// `line` is Summit's one-line read. Photos: tsmc.com > About TSMC > Executives (official headshots).
// Executives shown: the six SAB chose (Oct 16 2026) — CEO, the two Co-COOs, CFO, General Counsel, sales — out
// of the 28 executive officers the 20-F lists.

export var TSM_MGMT_CFG = {
  lede: 'Six of the <b>28 executive officers</b> TSMC lists in its 20-F: the CEO, the two Co-COOs, the CFO, the General Counsel and the head of sales. ' +
    'C.C. Wei holds <b>both the Chairman and CEO seats</b> (since June 2024), and the team is <b>home-grown</b> — five of the six have spent 27–39 years at TSMC. Tap a leader for the bio.',
  execs: [
    { id:'wei', lead:true, img:'img/leadership/tsm-wei.jpg', name:'C.C. Wei', title:'Chairman & Chief Executive Officer', since:'Chairman & CEO since Jun 2024 · joined 1998',
      line:'CEO since 2018 through the AI build-out; added the board chair in June 2024.',
      bio:'Chairman and CEO. CEO and Vice Chairman from June 2018 to June 2024; President and Co-CEO from November 2013 to June 2018; Executive Vice President and Co-Chief Operating Officer from March 2012 to November 2013; Senior Vice President of Business Development (2009–2012), of Mainstream Technology Business (2008–2009) and of Operations I (2005–2008). Held executive positions in TSMC fabs and Operations from 1998 to 2005. Before joining in 1998: Senior Vice President of Technology at Chartered Semiconductor Manufacturing (Singapore) and Senior Manager for Logic and SRAM technology development at STMicroelectronics (Texas). Chairman of the Taiwan Semiconductor Industry Association 2017–2019. Ph.D. in electrical engineering, Yale University. 28 years with TSMC.' },
    { id:'chyn', name:'Y.P. Chyn', title:'EVP & Co-Chief Operating Officer', since:'Co-COO since Feb 2024 · joined 1987',
      line:'The operations side of the Co-COO pair — fabs, overseas operations, product development.',
      bio:'Executive Vice President and Co-Chief Operating Officer. Senior Vice President of Operations and Overseas Operations Office from May 2020 to February 2024, and of Operations / Product Development from November 2016 to April 2020. Vice President of Operations (2009–2016) and of Advanced Technology Business (2008–2009); Senior Director of Operations II (2006–2008) and of Product Engineering & Services (2000–2006). Joined TSMC in 1987 and held positions in product and engineering functions. Master\'s degree in electrical engineering, National Cheng Kung University. 39 years with TSMC.' },
    { id:'mii', name:'Y.J. Mii', title:'EVP & Co-Chief Operating Officer', since:'Co-COO since Feb 2024 · joined 1994',
      line:'The technology side of the Co-COO pair — led R&D through N5, N3 and N2.',
      bio:'Executive Vice President and Co-Chief Operating Officer. Senior Vice President of Research & Development from November 2016 to February 2024; Vice President of Research & Development (2011–2016); Senior Director of Platform I Division (2006–2011). Joined TSMC in 1994 and has worked continuously on the development and manufacturing of advanced CMOS technologies in both Operations and R&D. Ph.D. in electrical engineering, University of California, Los Angeles. 32 years with TSMC.' },
    { id:'huang', name:'Wendell Huang', title:'SVP Finance & Chief Financial Officer', since:'CFO since Sep 2019 · joined 1999',
      line:'The voice of the guide on every call — margins, capex and the overseas-fab dilution.',
      bio:'Senior Vice President of Finance, Chief Financial Officer and Spokesperson; promoted to Senior Vice President in February 2024. Vice President of Finance and CFO / Spokesperson from September 2019 to February 2024, Deputy CFO from January to August 2019, and Senior Director of the Finance Division from 2010 to 2018. Before joining TSMC in 1999: Vice President of Corporate Finance at ING Barings. MBA, Cornell University. 27 years with TSMC.' },
    { id:'fang', name:'Sylvia Fang', title:'SVP Legal, General Counsel & Corporate Governance Officer', since:'General Counsel since Aug 2014 · joined 1995',
      line:'Runs legal and corporate governance; TSMC\'s Corporate Governance Officer.',
      bio:'Senior Vice President of Legal, General Counsel and Corporate Governance Officer; promoted to Senior Vice President in February 2024. Vice President of Legal and General Counsel from August 2014 to February 2024. Joined TSMC in 1995 and held various positions in legal functions. Master\'s degree in comparative law, University of Iowa; licensed to practice law in Taiwan. 31 years with TSMC.' },
    { id:'zhang', name:'Kevin Zhang', title:'SVP Business Development & Global Sales; Deputy Co-COO', since:'SVP since Aug 2020 · joined 2016',
      line:'The customer-facing executive — sales and business development; joined from Intel.',
      bio:'Senior Vice President of Business Development and Global Sales and Deputy Co-Chief Operating Officer; promoted to Senior Vice President in August 2020. Joined TSMC in November 2016 as Vice President of Research & Development / Design and Technology Platform. Before joining: Vice President of Technology and Manufacturing Group of Circuit Technology at Intel. Ph.D. in electrical engineering, Duke University. 10 years with TSMC.' }
  ],
  board: [
    { name:'C.C. Wei', chair:true, dual:true, independent:false, role:'Chairman & CEO · Nominating, Corporate Governance & Sustainability Committee.' },
    { name:'F.C. Tseng', independent:false, role:'Director · former Vice Chairman (2005–2018) and President · Chairman of TSMC China and Global Unichip.' },
    { name:'Chun-Hsien Yeh', independent:false, role:'Representative of the National Development Fund (Executive Yuan) · Minister of the National Development Council · since Sep 2025.' },
    { name:'Sir Peter L. Bonfield', independent:true, role:'Chairs Audit & Risk · former CEO of British Telecommunications · director 24 years.' },
    { name:'Michael R. Splinter', independent:true, role:'Chairs Compensation & People Development · former CEO and Chairman of Applied Materials.' },
    { name:'Moshe N. Gavrielov', independent:true, role:'Former President & CEO of Xilinx · director of NXP and Cadence.' },
    { name:'L. Rafael Reif', independent:true, role:'President Emeritus of MIT (President 2012–2022).' },
    { name:'Ursula M. Burns', independent:true, role:'Former Chairwoman & CEO of Xerox · director of Uber.' },
    { name:'Lynn L. Elsenhans', independent:true, role:'Former Chairwoman & CEO of Sunoco · director of Saudi Aramco.' },
    { name:'Chuan Lin', independent:true, role:'Chairs Nominating, Corporate Governance & Sustainability · former Premier and Minister of Finance of Taiwan.' }
  ],
  boardNote:'all 10 directors, 7 independent · Chairman and CEO combined (C.C. Wei) · the National Development Fund, one of the largest shareholders, has held a seat since the founding · three-year terms, all expiring 2027 · committees: Audit & Risk and Compensation & People Development (independent directors only), Nominating, Corporate Governance & Sustainability (three independents plus the CEO).',
  gov: [
    { k:'Board', v:'10 directors · 7 independent', d:'All seven independents sit on Audit &amp; Risk; Bonfield chairs it.' },
    { k:'Chair &amp; CEO', v:'Combined — C.C. Wei', d:'Chairman since June 2024; CEO since 2018. No lead independent director is named in the 20-F.' },
    { k:'Government seat', v:'National Development Fund', d:'A director seat since 1987, held through a representative (Dr. Chun-Hsien Yeh since Sep 2025).' }
  ],
  foot:'Board, committees, executive officers, positions, years with TSMC and biographies: TSMC Form 20-F for FY2025, Item 6 (as of Feb 28, 2026; filed Apr 16, 2026) — TSMC files no proxy. Photo: tsmc.com, About TSMC › Executives. One-line reads are Summit\'s. Ownership and insider activity live in Management › Ownership.'
};

// ── Ownership (MG-OWN, rebuilt per SAB Oct 16 2026: a structured holder table, insiders first) ───────────────
// Insiders = every director and executive officer in the 20-F FY2025 Item 6 "Share Ownership" table (as of
// Mar 18, 2026): [name, position, 'board'|'exec', common shares, ADSs (1 ADS = 5 shares), note]. Counts exclude
// related parties, ESPP/LTI trust shares and unvested restricted stock awards; nobody holds options.
// The National Development Fund is listed apart: its director (Dr. Chun-Hsien Yeh) holds no shares himself —
// the 1,653,709,980 shares are the Fund's. Institutional holders (Bloomberg HDS) join when the export exists.
export var TSM_SHARES_OUT = 25932524521;      // common shares outstanding, Feb 28, 2026 (20-F Item 7)
export var TSM_NDF = { name:'National Development Fund, Executive Yuan', role:'Government of Taiwan · board seat since 1987, represented by Dr. Chun-Hsien Yeh', common:1653709980, ads:0 };
export var TSM_INSIDERS = [
  ['C.C. Wei', 'Chairman; Chief Executive Officer', 'board', 7452349, 0],
  ['F.C. Tseng', 'Director', 'board', 29472675, 0],
  ['Sir Peter L. Bonfield', 'Independent Director', 'board', 0, 0],
  ['Michael R. Splinter', 'Independent Director', 'board', 0, 7565],
  ['Moshe N. Gavrielov', 'Independent Director', 'board', 0, 0],
  ['L. Rafael Reif', 'Independent Director', 'board', 0, 0],
  ['Ursula M. Burns', 'Independent Director', 'board', 0, 2000],
  ['Lynn L. Elsenhans', 'Independent Director', 'board', 0, 2050],
  ['Chuan Lin', 'Independent Director', 'board', 126826, 0],
  ['Y.P. Chyn', 'Executive Vice President; Co-Chief Operating Officer', 'exec', 5171935, 0],
  ['Y.J. Mii', 'Executive Vice President; Co-Chief Operating Officer', 'exec', 1254057, 25],
  ['Cliff Hou', 'Senior Vice President; Deputy Co-Chief Operating Officer; Chief Information Security Officer', 'exec', 662403, 0],
  ['Kevin Zhang', 'Senior Vice President; Deputy Co-Chief Operating Officer', 'exec', 329663, 2500],
  ['Lora Ho', 'Senior Vice President', 'exec', 4644012, 0, 'retired Apr 4, 2026'],
  ['Sylvia Fang', 'Senior Vice President; General Counsel; Corporate Governance Officer', 'exec', 858392, 0],
  ['Wendell Huang', 'Senior Vice President; Chief Financial Officer; Spokesperson', 'exec', 1811543, 0],
  ['Y.L. Wang', 'Senior Vice President', 'exec', 362392, 0, 'promoted SVP Feb 10, 2026'],
  ['T.S. Chang', 'Senior Vice President; TSMC Senior Fellow', 'exec', 317638, 0, 'promoted SVP Feb 10, 2026'],
  ['Michael Wu', 'Senior Vice President', 'exec', 630228, 0, 'promoted SVP Feb 10, 2026'],
  ['Geoffrey Yeap', 'Senior Vice President', 'exec', 212375, 0, 'promoted SVP Feb 10, 2026'],
  ['Min Cao', 'Vice President', 'exec', 507879, 0],
  ['Y.H. Liaw', 'Vice President; CEO of JASM', 'exec', 463054, 0],
  ['Simon Jang', 'Vice President', 'exec', 443879, 0],
  ['C.S. Yoo', 'Vice President', 'exec', 1797614, 0],
  ['Jun He', 'Vice President', 'exec', 120119, 1154],
  ['Chris Horng-Dar Lin', 'Vice President; Chief Information Officer', 'exec', 128184, 2800],
  ['Jonathan Lee', 'Vice President', 'exec', 506032, 0],
  ['Arthur Chuang', 'Vice President', 'exec', 2695165, 0],
  ['L.C. Lu', 'Vice President; TSMC Senior Fellow', 'exec', 276716, 0],
  ['K.C. Hsu', 'Vice President', 'exec', 178924, 6050],
  ['Ray Chuang', 'Vice President; CEO of TSMC Arizona', 'exec', 239738, 50, 'CEO of TSMC Arizona from Oct 1, 2025'],
  ['P.H. Chen', 'Vice President', 'exec', 433414, 0, 'promoted VP Feb 12, 2025'],
  ['Y.K. Hwang', 'Vice President', 'exec', 206418, 0, 'promoted VP Feb 10, 2026'],
  ['B.Z. Tien', 'Vice President', 'exec', 8051, 70, 'promoted VP Feb 10, 2026'],
  ['S.S. Lin', 'Vice President', 'exec', 21269, 0, 'promoted VP Feb 10, 2026'],
  ['Lipen Yuan', 'Vice President', 'exec', 3000, 0, 'promoted VP Feb 10, 2026']
];
export var TSM_INSIDER_GROUP = 60237681;      // directors and executive officers as a group, ex-NDF, Feb 28, 2026 (20-F Item 7)
export var TSM_OWN_SRC = 'TSMC Form 20-F for FY2025: Item 6 Share Ownership (as of Mar 18, 2026) and Item 7 Major Shareholders (as of Feb 28, 2026; 25,932,524,521 common shares outstanding)';

// ── Governance & SBC (MG-GOV) — TSMC Form 20-F FY2025: Item 6 Compensation (accrued 2025, NT$ million, US$ at the
// 20-F convenience rate), Board Practices (committees, meetings in 2025), Note 29 (profit sharing bonus to employees
// and compensation to directors), statements of changes in equity (share-based payment expense) and cash flows
// (cash dividends, treasury stock). Revenue 2025 NT$3,809,054.3M for the % of revenue.
export var TSM_GOV = {
  kpis: [
    ['7 of 10', 'directors independent · Chairman and CEO combined (C.C. Wei)'],
    ['US$77.2M', 'CEO total pay accrued for 2025 · 37% cash bonus incl. profit sharing'],
    ['NT$103.1B', 'profit sharing bonus to employees, 2025 · US$3.3B, 2.7% of revenue'],
    ['NT$1.2B', 'share-based payment expense, 2025 · ~US$39M — 1% of the profit-sharing pool']
  ],
  // [holder, salary, bonus (cash + profit sharing), stock awards, all other (LTI, pension, cars), total NT$M, total US$M]
  execPay: [
    ['C.C. Wei — Chairman & CEO', 17.3, 895.8, 367.1, 1142.5, 2422.7, 77.2],
    ['Wendell Huang — SVP & CFO', 6.8, 206.9, 41.7, 84.1, 339.5, 10.8],
    ['All other executive officers (aggregate, incl. those who left in 2025)', 174.5, 3778.0, 805.5, 1539.8, 6297.8, 200.8]
  ],
  execPayTotal: ['Total', 198.6, 4880.7, 1214.3, 2766.4, 9060.0, 288.8],
  // [committee, chair, members, composition, meetings in 2025]
  committees: [
    ['Audit & Risk', 'Sir Peter L. Bonfield', 'Bonfield, Splinter, Gavrielov, Reif, Burns, Elsenhans, Lin', 'All 7 independent directors', 4],
    ['Compensation & People Development', 'Michael R. Splinter', 'Splinter, Bonfield, Gavrielov, Burns', 'Independent only', 4],
    ['Nominating, Corporate Governance & Sustainability', 'Chuan Lin', 'Lin, C.C. Wei, Reif, Elsenhans', '3 independent + the CEO', 4]
  ],
  // [year, profit sharing to employees, share-based payment expense, compensation to directors, cash dividends paid, treasury stock bought] NT$M
  pool: [
    ['2023', 50090.5, 477.7, 552.0, 291721.9, 0],
    ['2024', 70296.3, 1222.8, 359.0, 363055.2, 3089.2],
    ['2025', 103073.0, 1231.1, 156.3, 466779.2, 0]
  ],
  howPaid: 'TSMC’s Articles of Incorporation set the pay pools as a share of profit: <b>at least 1%</b> to employees as profit sharing (at least 30% of it to entry-level staff) and <b>at most 0.3%</b> to directors, paid in cash; directors who are also executives get no director pay. Executives are paid mostly through that <b>cash bonus</b>, plus restricted stock awards (RSA rules for 2022, 2023 and 2024; vesting 50% / 25% / 25% over three years, set by the CEO and approved by the Compensation and Audit committees and the board), a <b>Long-Term Incentive</b> plan from 2025 (cash credited to a trust that buys TSMC shares, tied to financials, relative TSR and ESG) and an employee stock purchase plan with a <b>15%</b> company match. Equity is a small part of pay — the share-based expense was NT$1.2B in 2025, against NT$103.1B of profit sharing.',
  foot: 'TSMC Form 20-F for FY2025: Item 6 Compensation (amounts accrued for 2025; US$ at the 20-F’s convenience rate), Board Practices (committee membership and meetings in 2025), Employee Restricted Stock Awards, LTI and ESPP descriptions; Note 29 (profit sharing bonus to employees, compensation to directors); consolidated statements of changes in equity (share-based payment expense) and of cash flows (cash dividends, treasury stock). % of revenue on FY2025 net revenue of NT$3,809.1B.'
};

// ── Track Record (MG-TRACK) — the six leaders of Executives & Board, on what they have built. NO ratings (SAB,
// Oct 16 2026: history only, no colour verdict). Roles and dates: 20-F FY2025 Item 6. Outcomes: TSMC's reported
// figures as carried in the portal (js/results-data/tsm.js — US$ revenue and platform split from the earnings
// releases; gross margin from the Bloomberg export / 20-F), the 20-F (dividends, 2nm volume production in 2025)
// and the 3Q26 call (docs/calls/TSM-latest.md, quoted). `at` / `prior` / `detail` are HTML (<b>, <i>, <p>).
export var TSM_TRACK = [
  { id:'wei', n:'C.C. Wei', role:'Chairman & CEO', since:'1998',
    at:'CEO since June 2018 (Co-CEO from 2013), Chairman since June 2024. Revenue <b>US$34.2B (2018) to US$122.4B (2025)</b>, gross margin <b>48.3% to 59.9%</b>; the 2nm node entered volume production in 2025.',
    prior:'Chartered Semiconductor (SVP Technology) and STMicroelectronics before 1998; at TSMC ran fabs, Operations and Business Development before the top job. Ph.D., Yale.',
    detail:'<p><b>At TSMC (joined 1998).</b> Fab and Operations roles 1998–2005; SVP Operations I (2005–08), Mainstream Technology Business (2008–09) and Business Development (2009–12); EVP & Co-COO (2012–13); President & Co-CEO (2013–18); CEO & Vice Chairman (2018–24); Chairman & CEO since June 2024.</p><p><b>What the numbers show over his tenure as CEO.</b> US$ revenue about 3.6× from 2018 to 2025 and gross margin up more than 11 points, with HPC rising to 58% of revenue in 2025. Chairs the Nominating, Corporate Governance & Sustainability Committee.</p>' },
  { id:'mii', n:'Y.J. Mii', role:'EVP & Co-Chief Operating Officer', since:'1994',
    at:'Ran Research & Development as SVP from 2016 to 2024 — the period of TSMC’s leading-edge node cadence — and the 2nm node his organisation developed entered volume production in 2025. Co-COO since February 2024.',
    prior:'Joined in 1994 and has worked on advanced CMOS development and manufacturing in both Operations and R&D; VP R&D 2011–16, Senior Director of Platform I 2006–11. Ph.D., UCLA.',
    detail:'<p><b>At TSMC (joined 1994).</b> Senior Director, Platform I Division (2006–11); VP Research & Development (2011–16); SVP Research & Development (2016–24); EVP & Co-COO since February 2024 — the technology half of the Co-COO pair.</p><p><b>Context.</b> The R&D organisation he led is the one whose nodes now carry HPC, 58% of 2025 revenue.</p>' },
  { id:'chyn', n:'Y.P. Chyn', role:'EVP & Co-Chief Operating Officer', since:'1987',
    at:'Ran Operations and the Overseas Operations Office as SVP from May 2020 to February 2024 — the start of the Arizona, Japan and Germany build-out. Co-COO since February 2024. On the 3Q26 call the CFO put the overseas-fab margin dilution “closer to 2%”, widening “to 3%-4% in the next few years”.',
    prior:'Joined in 1987 — 39 years at TSMC in product and engineering functions; VP Operations (2009–16), SVP Operations / Product Development (2016–20). M.S., National Cheng Kung University.',
    detail:'<p><b>At TSMC (joined 1987).</b> Senior Director, Product Engineering & Services (2000–06) and Operations II (2006–08); VP Advanced Technology Business (2008–09) and Operations (2009–16); SVP Operations / Product Development (2016–20); SVP Operations and Overseas Operations Office (2020–24); EVP & Co-COO since February 2024 — the operations half of the pair.</p><p><b>Context.</b> The overseas fabs are the cost side of TSMC’s margin story; see Earnings › Post-Results for the CFO’s 3Q26 comments.</p>' },
  { id:'huang', n:'Wendell Huang', role:'SVP Finance & CFO', since:'1999',
    at:'CFO since September 2019. Over his tenure gross margin rose to 59.9% (2025), the quarterly dividend went from <b>NT$13 (2023) to NT$22 (2025) per share a year</b>, and TSMC ended June 2026 with about <b>US$78.7B of net cash</b>.',
    prior:'Joined in 1999 from ING Barings (VP Corporate Finance); Senior Director of Finance 2010–18, Deputy CFO 2019. MBA, Cornell.',
    detail:'<p><b>At TSMC (joined 1999).</b> Senior Director, Finance Division (2010–18); Deputy CFO (Jan–Aug 2019); VP Finance, CFO & Spokesperson (2019–24); SVP since February 2024. The voice of the quarterly guidance.</p><p><b>Context.</b> Cash dividends paid: NT$291.7B (2023), NT$363.1B (2024), NT$466.8B (2025); no buyback program.</p>' },
  { id:'zhang', n:'Kevin Zhang', role:'SVP Business Development & Global Sales; Deputy Co-COO', since:'2016',
    at:'SVP since August 2020, now running business development and global sales. Over that period HPC grew from <b>41% of revenue (2022) to 58% (2025)</b>.',
    prior:'Joined in November 2016 from Intel (VP, Technology and Manufacturing Group, Circuit Technology) as VP R&D / Design and Technology Platform. Ph.D., Duke.',
    detail:'<p><b>At TSMC (joined 2016).</b> VP Research & Development / Design and Technology Platform (2016–20); SVP since August 2020; Business Development and Global Sales and Deputy Co-COO today.</p><p><b>Context.</b> TSMC names no customer; the 20-F shows two customers above 10% of 2025 revenue (19% and 17%).</p>' },
  { id:'fang', n:'Sylvia Fang', role:'SVP Legal, General Counsel & Corporate Governance Officer', since:'1995',
    at:'General Counsel since August 2014 and the company’s Corporate Governance Officer; SVP since February 2024.',
    prior:'Joined in 1995 and held legal positions throughout. Master’s in comparative law, University of Iowa; licensed in Taiwan.',
    detail:'<p><b>At TSMC (joined 1995).</b> Legal functions from 1995; VP Legal & General Counsel (2014–24); SVP since February 2024; Corporate Governance Officer.</p><p><b>Context.</b> A legal and governance role without a stand-alone financial outcome to measure.</p>' }
];
export var TSM_TRACK_BENCH = 'A home-grown bench: five of the six joined TSMC between 1987 and 1999, succession runs through two Co-COOs (operations and technology), and the CEO also holds the chair.';
export var TSM_TRACK_FOOT = 'Roles and dates: TSMC Form 20-F for FY2025, Item 6 (as of Feb 28, 2026). Outcomes: reported figures carried in the portal (US$ revenue and platform split from TSMC’s quarterly earnings releases; gross margin from the 20-F / Bloomberg export; net cash from the 6-K balance sheet of Jun 30, 2026), dividends and 2nm volume production from the 20-F, and the 3Q26 earnings call (quoted). No ratings are given (SAB); the reads are editorial, not a Summit output.';
