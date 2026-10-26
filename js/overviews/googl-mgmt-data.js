// googl-mgmt-data.js — Alphabet Deep Dive ▸ Management ▸ Executives & Board (MG-TEAM), data for the shared engine
// js/overviews/management.js (makeManagement). Moved out of googl.js (relocation map #46, #50) and checked against the
// 2026 proxy statement (DEF 14A, filed Apr 24, 2026): Page and Brin directors since 1998 and Doerr since 1999 (the July
// file said 2015 and 2016); Porat President & CIO since September 2023; Kent Walker added (an executive officer named in
// the proxy); Kurian's line updated to the 2Q26 print. `line` and `bio` are plain text (escaped by the engine).
export var GOOGL_MGMT_DATA = {
  lede:'Alphabet is <b>founder-controlled but operator-run</b>: Larry Page and Sergey Brin hold voting control (Class B) and board seats but stepped out of operations in 2019, leaving a deep professional bench under <b>Sundar Pichai</b> — with the divisional CEOs (Cloud, DeepMind, YouTube) running their own P&Ls at unusual autonomy.',
  execs:[
    { id:'pichai', img:'img/leadership/googl-pichai.jpg', lead:true, name:'Sundar Pichai', title:'CEO, Alphabet & Google', since:'at Google since 2004 · Google CEO 2015 · Alphabet CEO 2019',
      line:'From Chrome PM to the AI-era CEO; architect of the full-stack response.',
      bio:'Joined in 2004; ran Chrome and Android before becoming Google CEO in the 2015 Alphabet restructuring and Alphabet CEO in 2019 when the founders stepped back. Declared the company "AI-first" in 2016 (the TPU/DeepMind groundwork), absorbed the 2023 "code red," and delivered the Gemini-era turnaround — reorganizing research (DeepMind merge), shipping Gemini 1→3 in 24 months, and committing the largest capital program in corporate history.' },
    { id:'anat', img:'img/leadership/googl-ashkenazi.jpg', name:'Anat Ashkenazi', title:'SVP & CFO', since:'since Jul 2024 · ex-Eli Lilly CFO',
      line:'Owns the capex-ladder narrative: raises with proof attached, depreciation flagged unprompted.',
      bio:'CFO since July 2024, after two decades at Eli Lilly (CFO 2021-24). Brought pharma-style capital discipline to the AI build-out: ROIC framing on every allocation question, per-call depreciation candor, the backlog-conversion disclosure, and the first material debt issuance — executed while group margins expanded.' },
    { id:'schindler', img:'img/leadership/googl-schindler.jpg', name:'Philipp Schindler', title:'SVP & Chief Business Officer', since:'at Google since 2005',
      line:'Runs the ads franchise — carried it through the AI transition accelerating, not shrinking.',
      bio:'Chief Business Officer since 2015; two decades at Google across European and global sales. Owns the advertiser relationship end-to-end — the AI-campaign migration (AI Max, PMax, Demand Gen), the new-surface monetization ladder (AIO ads, Direct Offers, UCP), and the vertical franchises (retail, finance). Notably candid on his own numbers (the volunteered FX caveat, Q1 2026).' },
    { id:'porat', img:'img/leadership/googl-porat.jpg', name:'Ruth Porat', title:'President & Chief Investment Officer', since:'at Alphabet since 2015 · CFO 2015–2024 · President & CIO since Sep 2023',
      line:'The discipline era\'s CFO, now running Other Bets investment and the capital relationships.',
      bio:'CFO 2015-2024 (ex-Morgan Stanley CFO) — brought the cost discipline that made "Other Bets" a reported, bounded number and built the buyback program. As President & CIO since September 2023, oversees Alphabet\'s investment portfolio and the Bets\' external-capital strategy (Waymo\'s $16B round, Verily/GFiber deconsolidations bear her signature).' },
    { id:'walker', name:'Kent Walker', title:'President, Global Affairs & Chief Legal Officer', since:'at Google since 2006 · CLO since 2018 · President since Nov 2021',
      line:'Runs legal, policy, risk and compliance: the US search and ad-tech cases, the EU fines and AI regulation sit with him.',
      bio:'President, Global Affairs, and Chief Legal Officer of Alphabet and Google since November 2021, and Secretary of Alphabet since January 2020; Senior Vice President, Global Affairs and Chief Legal Officer of Google from June 2018. Oversees content policy and responsible AI development, government and regulatory affairs, and legal, risk and compliance. Since joining Google in 2006 he has led its advocacy on competition, content, copyright and privacy; earlier he held executive positions at Netscape, AOL and eBay and was an Assistant U.S. Attorney in San Francisco and Washington, D.C. (2026 proxy statement).' },
    { id:'kurian', img:'img/leadership/googl-kurian.jpg', name:'Thomas Kurian', title:'CEO, Google Cloud', since:'since 2019 · ex-Oracle (22 yrs)',
      line:'2.6% → 35.6% segment margin from 1Q23 to 2Q26, while growth accelerated to +82%.',
      bio:'Left Oracle\'s product organization to run Google Cloud in 2019, inheriting a loss-making #3. Systematized enterprise sales, priced the AI portfolio (Vertex, Gemini Enterprise — 8M paid seats in four months), and delivered the sector\'s fastest large-scale margin build alongside its fastest growth. The $462B backlog is his book.' },
    { id:'hassabis', img:'img/leadership/googl-hassabis.jpg', name:'Demis Hassabis', title:'CEO, Google DeepMind', since:'DeepMind founder 2010 · acquired 2014 · merged 2023',
      line:'Nobel laureate; turned the research jewel into the revenue engine\'s core input.',
      bio:'Chess prodigy, neuroscientist, DeepMind founder. AlphaFold won him the 2024 Nobel Prize in Chemistry; the 2023 Brain-DeepMind merger under his leadership produced Gemini — now the fastest-adopted model family in company history, powering Search, Cloud and the app. The clearest research-to-product transmission in the industry.' },
    { id:'mohan', img:'img/leadership/googl-mohan.jpg', name:'Neal Mohan', title:'CEO, YouTube', since:'since 2023 · at Google since 2008',
      line:'#1 US streamer three straight years; the Shorts defense turned profitable.',
      bio:'Ad-tech veteran (DoubleClick) who became YouTube\'s product chief and then CEO in 2023. Record: US streaming watch-time leadership three consecutive years, Shorts monetization parity with in-stream (US), the subscriptions twin-engine (>$60B/yr combined), NFL Sunday Ticket and the living-room pivot.' },
  ],
  board:[
    { name:'John L. Hennessy', chair:true, independent:true, role:'Independent Chair since 2018 (Lead Independent Director 2007–2018) · ex-Stanford president · Turing Award winner · director since 2004.' },
    { name:'Larry Page', independent:false, role:'Co-founder · Class B holder · stepped back from operations in 2019 · director since 1998.' },
    { name:'Sergey Brin', independent:false, role:'Co-founder · Class B holder · returned hands-on for the Gemini effort · director since 1998.' },
    { name:'Sundar Pichai', dual:true, independent:false, role:'CEO · director since 2017.' },
    { name:'Frances H. Arnold', independent:true, role:'Nobel laureate (Chemistry) · Caltech professor · director since 2019.' },
    { name:'R. Martin "Marty" Chávez', independent:true, role:'ex-Goldman Sachs CFO/CIO · Sixth Street vice chairman · director since 2022.' },
    { name:'L. John Doerr', independent:true, role:'Chair of Kleiner Perkins · early investor (1999 round) · director since 1999.' },
    { name:'Roger W. Ferguson Jr.', independent:true, role:'ex-Federal Reserve vice chairman · ex-TIAA CEO · now CIO, Red Cell Partners · director since 2016.' },
    { name:'K. Ram Shriram', independent:true, role:'Managing Partner, Sherpalo Ventures · founding board member & one of Google\'s earliest investors · longest-tenured director, since 1998.' },
    { name:'Robin L. Washington', independent:true, role:'President & COO/CFO of Salesforce · ex-Gilead CFO · audit expertise · director since 2019.' },
  ],
  boardNote:'the full 10-member board elected at the June 5, 2026 annual meeting (2026 proxy statement, filed Apr 24, 2026): 7 independent, an independent Chair separate from the CEO, and the four key committees — Audit, Risk and Compliance (created Oct 2025), Leadership Development, Inclusion and Compensation, Nominating and Corporate Governance — 100% independent',
  gov:[
    { k:'Board leadership', v:'Independent Chair', d:'John L. Hennessy has chaired the board since January 2018, separate from the CEO role (2026 proxy).' },
    { k:'Voting control', v:'Founders via Class B', d:'Class B carries 10 votes a share and is held mainly by Larry Page and Sergey Brin; Class C has no vote — the split is in Ownership.' },
    { k:'Pay', v:'Mostly equity', d:'Executive pay is mostly stock awards; the CEO received no new award in 2025 (2026 proxy, pay-versus-performance).' },
  ],
  foot:'Executives: Alphabet 2026 proxy statement (DEF 14A, filed Apr 24, 2026) for the executive officers, and abc.xyz for the division CEOs (Google Cloud, Google DeepMind, YouTube); board and committees: the same proxy. Photos: img/leadership.',
};
