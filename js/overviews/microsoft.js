// overviews/microsoft.js — custom Overview for Microsoft Corp. (NASDAQ: MSFT)
// Neutral, factual, analyst-facing: what the business is, what each segment/sub-segment
// sells, and how it monetizes. Anchored on the latest reported period (Q3 FY2026).
// Segments are an interactive architecture map: each sub-segment opens a product sub-diagram.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: MSFT'],
  ['Founded', '1975 · IPO 1986'],
  ['HQ', 'Redmond, WA'],
  ['CEO', 'Satya Nadella'],
  ['CFO', 'Amy Hood'],
  ['FY end', 'June 30'],
];
var DESC = 'Microsoft is one of the world\'s largest enterprise-software and cloud companies, at an annualized revenue run-rate above ~$330B. It operates in three reportable segments: <b>Productivity &amp; Business Processes</b> (Microsoft 365, LinkedIn, Dynamics), <b>Intelligent Cloud</b> (Azure, GitHub, server software) and <b>More Personal Computing</b> (Windows, Gaming, Search). Revenue is largely recurring — per-seat subscriptions and metered cloud consumption — the result of a multi-decade shift from one-time software licenses to subscription and cloud models.';

var KPIS = [
  { l:'Q3 FY26 Revenue',   v:'$82.9B', d:'+18% YoY · +15% cc', dir:'up' },
  { l:'Microsoft Cloud',   v:'$54.5B', d:'+29% YoY',           dir:'up' },
  { l:'AI ARR',            v:'$37B',   d:'+123% YoY',          dir:'up' },
  { l:'Commercial RPO',    v:'$627B',  d:'~2.5 yrs contracted',dir:'up' },
];
var AS_OF = 'Figures are fiscal Q3 2026 (quarter ended March 31, 2026; reported April 29, 2026) — the latest reported period — unless noted. "cc" = constant currency. Microsoft\'s fiscal year ends June 30, so FY26 = Jul 2025–Jun 2026. Forward CapEx points are management guidance.';
var FY_NOTE = 'Latest-quarter segment mix (Q3 FY26): <b>Productivity &amp; Business Processes</b> $35.0B (~42% of revenue, ~60% operating margin), <b>Intelligent Cloud</b> $34.7B (~42%, ~40% margin, Azure +40% cc), <b>More Personal Computing</b> $13.2B (~16%, ~28% margin). Total operating margin 46.3%. "Microsoft Cloud" is a cross-segment roll-up (Azure + M365 Commercial cloud + Dynamics cloud + commercial LinkedIn).';

// ─── How Microsoft makes money (the monetization models) ─────────────────────
var HOW_MONEY = [
  ['Per-seat subscriptions', 'A recurring fee <b>per user, per month</b> for software people work in. <i>Where:</i> Microsoft 365 (commercial + consumer), Dynamics 365, LinkedIn Premium / Sales Navigator. <i>Grows via:</i> more seats × higher ARPU (tier upgrades + AI add-ons like Copilot). The highest-margin, most recurring revenue in the company — see the per-seat section below.'],
  ['Cloud consumption', '<b>Pay-as-you-go</b> for compute, storage, databases and AI, plus reserved-capacity commitments. <i>Where:</i> Azure. <i>Grows via:</i> usage (and AI tokens). Backed by <b>$627B of contracted RPO</b>. Lower gross margin than subscriptions, but the largest growth pool.'],
  ['Licenses & royalties', 'Per-device <b>Windows OEM royalties</b> (PC makers pay to pre-install Windows) and <b>on-prem server licenses</b> + Software Assurance maintenance. A legacy, slowly declining base that also acts as the on-ramp to Azure migration.'],
  ['Advertising', 'Auction / cost-per-click. <i>Where:</i> Bing search ads, LinkedIn Marketing Solutions, MSN display. A smaller, higher-margin line growing double-digits ex-TAC.'],
  ['Transactional & content', 'Game sales, <b>Game Pass</b> subscriptions and in-game spend (Xbox + Activision), LinkedIn Talent Solutions, the app store. Mixed margin and more cyclical.'],
  ['Hardware', 'Surface PCs and Xbox consoles, sold at near-zero or negative margin as reference hardware that supports the software / subscription ecosystem.'],
];

// ─── Per-seat economics (tiers, pricing, the discount change) ────────────────
var PERSEAT_POINTS = [
  '<b>Volume discounts were removed (Nov 2025).</b> Historically, larger commitments earned volume discounts (the "Level A–D" tiers under Enterprise Agreements) — more seats unlocked a lower per-seat price. <b>As of November 2025 Microsoft eliminated those volume-based discounts</b>, so per-seat pricing no longer falls with scale. For the largest customers this is effectively a price increase, and structurally it shifts ARPU upward.',
  '<b>With wholesale discounting gone, the ARPU lever is mix, not scale.</b> Growth in revenue-per-seat now comes from <b>moving customers up tiers (E5 → E7)</b> and <b>attaching Copilot</b> (+$30/user/mo), rather than from discounting large orders. That makes tier adoption the number to watch on the P&BP line.',
];
var TIERS = [
  ['E3', '~$36 / user / mo', 'Core productivity — Office, Teams, Exchange, SharePoint/OneDrive — plus basic security &amp; compliance. The entry enterprise tier.'],
  ['E5', '~$57 / user / mo', 'Adds advanced security (Defender, Entra ID P2), advanced compliance/governance (Purview), analytics (Power BI Pro) and Teams Phone. Historically the main upsell, ~+58% over E3.'],
  ['E7', '~$80–100+ / user / mo', 'New top tier (introduced 2026) bundling further security/governance and AI capabilities. The newest ARPU lever — a ~+40–75% step over E5, and the most debated.'],
];
var TIERS_NOTE = 'Research firms — <b>Gartner</b> among them — have questioned whether stepping up to <b>E7</b> is worth the ~+40–75% premium over E5: several of its components overlap with tools customers already license or can buy à-la-carte, and the incremental AI value is still being evaluated. The E7 uplift is real on paper, but it faces procurement scrutiny — so the pace of E5→E7 adoption is a genuine open question, not a given. <i>(Pricing approximate / list-level; enterprise pricing is negotiated.)</i>';

// ─── Segments → sub-segments → products (interactive architecture map) ────────
var SEGMENTS = [
  { k:'pbp', n:'Productivity & Business Processes', accent:'#0078D4', rev:'$35.0B', margin:'~60% margin',
    subs:[
      { k:'m365c', n:'Microsoft 365 Commercial', rev:'$25.6B · +19%',
        what:'The per-employee subscription to the productivity + security suite across 450M+ seats — the single largest revenue line in the company.',
        monetizes:'Tiered per-seat subscriptions (E3 → E5 → E7) plus the Copilot AI add-on. Grows via seats × ARPU.',
        products:[
          {n:'Office apps', d:'Word, Excel, PowerPoint, Outlook — the universal document &amp; comms standard.'},
          {n:'Teams', d:'Meetings, chat, calling and collaboration, integrated across the suite.'},
          {n:'Exchange', d:'Enterprise email &amp; calendar.'},
          {n:'SharePoint / OneDrive', d:'Intranet + per-user cloud storage, synced with Office.'},
          {n:'Entra ID', d:'Enterprise identity / single sign-on (~85% share).'},
          {n:'Intune', d:'Device management (MDM) for laptops &amp; phones.'},
          {n:'Purview', d:'Compliance, data governance &amp; audit — key for regulated industries.'},
          {n:'Defender', d:'Endpoint &amp; email security.'},
          {n:'Copilot', d:'AI assistant grounded in org data; +$30/user/mo add-on (~20M seats).'},
        ], competition:'Google Workspace (~15% enterprise vs Microsoft ~80%+).' },
      { k:'m365con', n:'Microsoft 365 Consumer', rev:'$2.3B · +33%',
        what:'The same Office apps + 1TB OneDrive sold to individuals and families; ~95M subscribers.',
        monetizes:'Annual/monthly consumer subscriptions (~$70–100/yr) + periodic price increases.',
        products:[
          {n:'Microsoft 365 Personal/Family', d:'Office apps + 1TB OneDrive for up to 6 users.'},
          {n:'Outlook.com', d:'Consumer email.'},
          {n:'Designer / Copilot', d:'Consumer AI &amp; design features layered into the plans.'},
        ], competition:'Free Google Docs; Apple iCloud (storage only).' },
      { k:'linkedin', n:'LinkedIn', rev:'$4.8B · +12%',
        what:'The professional network — 1.3B members. Monetized across four distinct businesses.',
        monetizes:'A mix of recruiting fees, B2B ads and subscriptions.',
        products:[
          {n:'Talent Solutions', d:'Recruiters pay to find &amp; hire candidates — ~60% of LinkedIn revenue.'},
          {n:'Marketing Solutions', d:'B2B advertising targeting professionals.'},
          {n:'Premium Subscriptions', d:'Individual career tools + LinkedIn Learning.'},
          {n:'Sales Navigator', d:'Prospect intelligence for sales teams.'},
        ], competition:'No comparable substitute for the professional graph; ads compete with Meta/Google.' },
      { k:'dynamics', n:'Dynamics 365 + Power Platform', rev:'$2.3B · +22%',
        what:'Business applications — the systems that run a company\'s operations and customer relationships.',
        monetizes:'Per-user / per-app subscriptions.',
        products:[
          {n:'D365 Finance / Supply Chain', d:'ERP — finance, supply chain, manufacturing.'},
          {n:'Business Central', d:'All-in-one ERP for small/mid-market (vs NetSuite).'},
          {n:'D365 Sales / Service', d:'CRM — pipeline, customer service, field service.'},
          {n:'Power Apps / Power Automate', d:'Low-code app building + workflow automation.'},
          {n:'Copilot Studio', d:'Build and deploy custom AI agents.'},
        ], competition:'SAP (large-enterprise ERP), Oracle NetSuite (mid-market), Salesforce (CRM).' },
    ] },
  { k:'ic', n:'Intelligent Cloud', accent:'#7FBA00', rev:'$34.7B', margin:'~40% margin',
    subs:[
      { k:'azure', n:'Azure', rev:'largest · +40% cc',
        what:'A global network of data centers (70+ regions): instead of buying servers, companies rent compute/storage/AI and pay for what they use. #2 cloud (~30% share) behind AWS; differentiator is hybrid cloud.',
        monetizes:'Consumption (pay-as-you-go) + reserved commitments (incl. AI "PTUs"). AI is ~low-20s% of Azure.',
        products:[
          {n:'Compute', d:'Virtual Machines, Kubernetes (AKS), serverless Functions.'},
          {n:'Storage', d:'Blob, file and disk storage at any scale.'},
          {n:'Databases', d:'Azure SQL (relational), Cosmos DB (NoSQL), PostgreSQL.'},
          {n:'AI & ML', d:'Azure OpenAI Service, AI Foundry (multi-model catalog), AI Search.'},
          {n:'Data & Analytics', d:'Microsoft Fabric (unified data platform), Power BI.'},
          {n:'Security', d:'Defender for Cloud, Sentinel (SIEM/threat detection).'},
          {n:'Networking', d:'Virtual networks, load balancing, CDN, ExpressRoute.'},
        ], competition:'AWS (~42%), Google Cloud (~22%), Oracle OCI (~5%).' },
      { k:'server', n:'Server products & cloud services', rev:'declining',
        what:'On-premises software companies run on their own servers — the legacy base and the on-ramp into Azure.',
        monetizes:'Perpetual licenses + annual Software Assurance maintenance. Declining ~mid-single-digits.',
        products:[
          {n:'SQL Server', d:'Relational database (migrating to Azure SQL).'},
          {n:'Windows Server', d:'Server OS (migrating to Azure VMs).'},
          {n:'Visual Studio', d:'Developer IDE (~$ enterprise/seat).'},
          {n:'System Center', d:'IT management for fleets of servers.'},
        ], competition:'Open-source databases/OS; the structural pull is to Azure.' },
      { k:'github', n:'GitHub', rev:'180M+ devs',
        what:'Where the world\'s developers store, collaborate on and ship code — ~80% code-hosting share.',
        monetizes:'Enterprise subscriptions + Copilot + Actions usage.',
        products:[
          {n:'Repositories / Enterprise', d:'Private repos, security, compliance for 140K+ orgs.'},
          {n:'GitHub Copilot', d:'AI pair-programmer (moving to usage-based pricing).'},
          {n:'Actions', d:'Automated CI/CD pipelines.'},
          {n:'Advanced Security', d:'Code/secret scanning.'},
        ], competition:'GitLab (enterprises); Cursor and AI-native IDEs (individuals).' },
      { k:'nuance', n:'Nuance / Dragon Copilot', rev:'health AI',
        what:'AI that drafts clinical notes from doctor-patient conversations, saving clinicians 1–2 hrs/day.',
        monetizes:'SaaS subscriptions to health systems; ~21M patient encounters/quarter; runs on Azure.',
        products:[
          {n:'Dragon Copilot', d:'Ambient clinical documentation.'},
          {n:'Nuance DAX', d:'Conversational AI for healthcare workflows.'},
        ], competition:'Abridge, Suki (well-funded startups).' },
      { k:'eps', n:'Enterprise & Partner Services', rev:'declining (by design)',
        what:'Microsoft\'s own support and consulting — ceded to the partner ecosystem on purpose.',
        monetizes:'Annual support contracts + consulting engagements.',
        products:[
          {n:'Unified Support', d:'Premium 24/7 enterprise support contracts.'},
          {n:'Industry Solutions', d:'Consulting to design Azure/Dynamics/AI deployments.'},
        ], competition:'Accenture, Deloitte, IBM — who are also Microsoft\'s deployment partners.' },
    ] },
  { k:'mpc', n:'More Personal Computing', accent:'#F25022', rev:'$13.2B', margin:'~28% margin',
    subs:[
      { k:'windows', n:'Windows & Devices', rev:'PC-cycle',
        what:'The Windows franchise and first-party hardware — the most PC-market-cyclical part of Microsoft.',
        monetizes:'Per-device OEM royalties + commercial volume licensing; Surface hardware (near-zero margin).',
        products:[
          {n:'Windows OEM', d:'Royalty (~$20–150/device) PC makers pay to pre-install Windows.'},
          {n:'Windows Commercial', d:'Volume licensing + the on-prem components of M365.'},
          {n:'Surface', d:'First-party laptops/tablets — reference hardware, low margin.'},
        ], competition:'macOS (~15–20% enterprise), ChromeOS (education).' },
      { k:'gaming', n:'Gaming (Xbox + Activision)', rev:'−7%',
        what:'Consoles, a games subscription, and one of the largest owned-content libraries after the $75.4B Activision deal.',
        monetizes:'Hardware (near-zero margin), Game Pass subscriptions, game/IP sales, in-game spend.',
        products:[
          {n:'Xbox consoles', d:'Series X/S — a platform sold near cost.'},
          {n:'Game Pass', d:'~$15–20/mo subscription — "Netflix for games."'},
          {n:'Content / IP', d:'Call of Duty, WoW, Diablo, Candy Crush, Minecraft, Bethesda.'},
          {n:'Xbox Cloud Gaming', d:'Stream games to any device.'},
        ], competition:'Sony PlayStation (~60% console share).' },
      { k:'search', n:'Search & News advertising (Bing)', rev:'+12% ex-TAC',
        what:'Search and display advertising — small vs Google, but the structurally growing piece of the segment.',
        monetizes:'Cost-per-click search ads + display. ~3–5% search share; Bing reached 1B MAU.',
        products:[
          {n:'Bing search ads', d:'Advertisers bid on keywords (CPC).'},
          {n:'Edge browser', d:'Distribution surface — gaining share for 20+ quarters.'},
          {n:'MSN / News', d:'Display advertising (legacy, declining).'},
          {n:'Copilot in Bing', d:'AI answers integrated into search.'},
        ], competition:'Google (~90% search share); Amazon &amp; Meta in ads.' },
    ] },
];

// ─── Charts (HARDCODED — latest reported period) ─────────────────────────────
var CH_NOTE = '<b>⚠ Hardcoded — not wired live.</b> Segment revenue &amp; margins from Microsoft\'s Q3 FY2026 segment disclosures (quarter ended Mar 31, 2026). Cloud market-share &amp; growth are Deutsche Bank estimates for calendar Q1 2026.';
var CH_SEGREV = { labels:['Productivity & Business Processes','Intelligent Cloud','More Personal Computing'], data:[35.0, 34.7, 13.2] };
var CH_SEGMARGIN = { labels:['P&BP','Intelligent Cloud','MPC'], data:[60, 40, 28] };
var CH_SHARE = { labels:['AWS','Azure','Google Cloud','Oracle OCI'], data:[42, 30, 22, 5], growth:['+28%','+39%','+60%','+81%'] };

// ─── Azure & the AI platform (factual) ───────────────────────────────────────
var AZURE = [
  '<b>The model:</b> Azure is metered cloud — customers rent compute, storage, databases and AI and <b>pay for consumption</b>, increasingly pre-committing capacity (reserved instances, AI "PTUs"). Revenue scales with usage, not seats.',
  '<b>The AI layer:</b> <b>Azure OpenAI Service</b> (managed access to GPT models) and <b>AI Foundry</b> (a multi-model catalog incl. OpenAI, Anthropic, Meta) let enterprises build AI on Azure. AI is ~low-20s% of Azure (Q3 FY26) vs ~10% a year earlier; company-wide AI ARR ~$37B (+123% YoY).',
  '<b>The near-term constraint is capacity, not demand:</b> management states demand has exceeded supply, and CapEx (~$190B guided for CY2026) is being deployed to add data-center capacity. That CapEx flows into cloud COGS as depreciation over 4–6 years, compressing cloud gross margins near-term.',
  '<b>Relative growth (the facts):</b> Azure grew +40% in Q3 FY26; over the same period Google Cloud grew ~+60% and Oracle OCI ~+81% (per DB). On <i>net-new</i> AI workloads, AWS and Google have been gaining, helped by more mature custom AI chips and earlier multi-model availability. Azure\'s ~30% aggregate share has been roughly stable; whether the CapEx converts into share gains in the highest-value AI segments is not yet evident in the relative growth rates.',
];

// ─── Switching costs (interactive hub) ───────────────────────────────────────
var SWITCH_CENTER = 'The enterprise account · 450M+ M365 seats';
var SWITCH_NODES = [
  { k:'identity', ic:'🔑', l:'Identity', s:'Entra ID — the login layer',
    detail:'<b>What it is:</b> Entra ID (formerly Azure AD) is the enterprise single sign-on — ~85% identity share. Employees log into third-party apps (Salesforce, SAP, Workday, ServiceNow) <i>through</i> it.<br><br><b>Why it raises switching costs:</b> replacing the identity layer means re-integrating every connected application and re-provisioning every user and policy — a project most IT departments avoid. It also pulls security (Defender, Conditional Access) into the same stack.<br><br><b>Where it is contested:</b> pure-play identity vendors (Okta, Ping) compete, but have generally been losing enterprise share to the bundled Microsoft option.' },
  { k:'data', ic:'🧠', l:'Organizational data', s:'Work IQ — Copilot\'s grounding',
    detail:'<b>What it is:</b> the index of a customer\'s own emails, documents, meetings and chats (~17 exabytes, +35% YoY) that <b>Copilot is grounded in</b>.<br><br><b>Why it raises switching costs:</b> Copilot\'s usefulness comes from this private context, which an external AI cannot access without Microsoft\'s permission — and the value compounds the longer it is used. It is <b>model-agnostic</b> (Copilot can swap the underlying model), so the lock-in is the data access, not any one AI vendor.<br><br><b>Where it is contested:</b> Google has the equivalent for Workspace customers; standalone assistants (ChatGPT, Claude) compete on raw capability but lack the grounded enterprise context.' },
  { k:'bundle', ic:'📦', l:'The bundle', s:'Office + Teams as the standard',
    detail:'<b>What it is:</b> Office as the de-facto document standard (~80%+ enterprise), plus Teams, plus security/compliance — sold as one per-seat suite.<br><br><b>Why it raises switching costs:</b> file-format lock-in, a workforce trained on the apps, and bundle pricing that is typically cheaper than buying best-of-breed tools separately. Moving off means retraining and re-integrating multiple categories at once.<br><br><b>Where it is contested:</b> Google Workspace (~15% enterprise) in productivity; Slack/Zoom in collaboration; Notion and others in pieces of the suite.' },
  { k:'dev', ic:'💻', l:'Developers', s:'GitHub + VS Code',
    detail:'<b>What it is:</b> GitHub (~80% code-hosting share, 180M+ developers) plus VS Code (the dominant editor) — where new software is written.<br><br><b>Why it raises switching costs:</b> codebases, CI/CD pipelines (Actions) and developer habits live there, and GitHub Copilot is layered on top — anchoring the next generation of software on Microsoft rails.<br><br><b>Where it is contested:</b> GitLab competes for enterprises; AI-native IDEs (e.g. Cursor) are gaining among individual developers.' },
  { k:'distribution', ic:'🤝', l:'Distribution', s:'Field + partner ecosystem',
    detail:'<b>What it is:</b> ~14,500 direct enterprise relationships plus a partner ecosystem (Accenture, Deloitte and 300k+ partners) that drives the majority of enterprise sales.<br><br><b>Why it raises switching costs:</b> Microsoft can attach new products (Azure, Copilot, Security) into existing enterprise agreements and ride partner-led deployments — lowering the friction to expand within an account.<br><br><b>Where it is contested:</b> the same partners work with every major vendor, so distribution is an advantage of scale, not exclusivity.' },
];
var SWITCH_NOTE = 'Taken together these layers <b>slow displacement</b> — a competitor usually has to win one layer at a time against an installed, trained, integrated base. They do not prevent competition: in cloud AI specifically, AWS and Google have been growing faster on net-new dollars (see the Azure section).';

// ─── History — the evolution of the business model ───────────────────────────
var TIMELINE = [
  { y:'1975', head:'<b>Founded</b> on a bet that software, not hardware, is the business.',
    detail:'Gates &amp; Allen start Microsoft writing a BASIC interpreter for early microcomputers. The founding insight — sell the software that runs on other companies\' hardware — defines the licensing model that still underpins Windows OEM royalties today.' },
  { y:'1980–85', head:'<b>MS-DOS licensed non-exclusively to IBM</b> — the royalty model is born.',
    detail:'Microsoft licenses MS-DOS to IBM <i>non-exclusively</i>, so every PC clone also needs DOS. The company collects a per-device royalty across the whole industry rather than depending on one hardware maker — the same per-device royalty structure that is still how <b>Windows OEM</b> earns money today.' },
  { y:'1986', head:'<b>IPO</b> (Mar 1986).',
    detail:'Microsoft goes public in March 1986. Over the next two decades it runs a packaged-software model: design once, sell millions of licenses at near-zero marginal cost — the structurally high software margins that persist in the business today.' },
  { y:'1990', head:'<b>Windows 3.0 + Office</b> — the install base today\'s subscriptions monetize.',
    detail:'Windows brings the graphical interface to mainstream PCs and Office bundles Word, Excel and PowerPoint into the standard. The format lock-in and corporate install base built here are exactly what <b>Microsoft 365\'s 450M+ seats</b> monetize as subscriptions today.' },
  { y:'2001', head:'<b>Xbox</b> + <b>Dynamics</b> begin — consumer content and business apps.',
    detail:'Microsoft enters console gaming with Xbox (today\'s Gaming sub-segment) and, via the Great Plains/Navision acquisitions, enters ERP/CRM — the foundation of today\'s <b>Dynamics 365</b>.' },
  { y:'2008–11', head:'<b>Azure &amp; Office 365 launch</b> — the shift to cloud + subscription begins.',
    detail:'Azure (GA 2010) and Office 365 (2011) start the transition from <b>one-time perpetual licenses</b> to <b>recurring subscriptions and metered cloud consumption</b> — the revenue model that defines Microsoft now.' },
  { y:'2014', head:'<b>Satya Nadella becomes CEO</b> — "cloud-first" accelerates the transition.',
    detail:'Nadella reprioritizes the company around Azure and subscriptions, deemphasizes the Windows-centric strategy, and embraces cross-platform. Recurring cloud revenue compounds through the decade; the model shifts from license sales to durable recurring revenue.' },
  { y:'2016–18', head:'<b>LinkedIn ($26.2B) &amp; GitHub ($7.5B)</b> — recurring revenue into new domains.',
    detail:'Microsoft extends the subscription model into professional identity (LinkedIn) and developer workflows (GitHub). Both later become distribution surfaces for AI (Copilot).' },
  { y:'2019–23', head:'<b>OpenAI partnership &amp; ChatGPT</b> — the AI layer on top of the model.',
    detail:'Microsoft invests in OpenAI (from 2019) and makes Azure its compute provider. After ChatGPT, Microsoft layers AI onto the existing model two ways: a <b>per-seat Copilot add-on</b> (a new ARPU lever on 450M+ M365 seats) and <b>Azure AI consumption</b> (a new growth pool).' },
  { y:'Oct 2023', head:'<b>Closes the $75.4B Activision deal</b> — content for the subscription model.',
    detail:'Microsoft\'s largest acquisition adds Call of Duty, WoW, Diablo and Minecraft — content intended to drive the <b>Game Pass</b> subscription. The strategic logic is the same recurring-revenue playbook; results so far are mixed.' },
  { y:'Apr 2026', head:'<b>OpenAI agreement restructured</b> — terms reset for the next phase.',
    detail:'Microsoft retains IP rights to OpenAI\'s models through 2032 and removes the AGI termination clause; OpenAI\'s 20% revenue share to Microsoft continues through 2030 while Microsoft\'s payments are capped (~$38B). Azure exclusivity ends, letting OpenAI use other clouds.' },
];

// ─── M&A (chronological; terms + outcome) ────────────────────────────────────
var MNA = [
  { n:'Great Plains', y:'2001', deal:'$1.1B', terms:'all stock', own:'Public', cat:'Business apps',
    detail:'<b>Terms:</b> ~$1.1B in stock.<br><br><b>What it added:</b> mid-market accounting/ERP software (with Navision, acquired 2002).<br><br><b>How it shows up today:</b> the foundation of <b>Dynamics 365</b> — Business Central descends directly from this.' },
  { n:'aQuantive', y:'2007', deal:'$6.3B', terms:'all cash', own:'Public', cat:'Advertising', miss:true,
    detail:'<b>Terms:</b> $6.3B, all cash.<br><br><b>What it was for:</b> a digital-advertising platform to compete with Google in display ads.<br><br><b>Outcome:</b> <b>written off almost entirely (~$6.2B impairment in 2012)</b> — one of Microsoft\'s clearest acquisition failures, relevant to its capital-allocation track record.' },
  { n:'Fast Search & Transfer', y:'2008', deal:'~$1.2B', terms:'all cash', own:'Public', cat:'Enterprise search',
    detail:'<b>Terms:</b> ~$1.2B, all cash (Norwegian enterprise-search firm).<br><br><b>What it added:</b> enterprise search technology.<br><br><b>How it shows up today:</b> folded into SharePoint search and early Bing efforts.' },
  { n:'Skype', y:'2011', deal:'$8.5B', terms:'all cash', own:'Private', cat:'Communications',
    detail:'<b>Terms:</b> $8.5B, all cash; bought from a Silver Lake-led investor group.<br><br><b>What it added:</b> consumer VoIP/video at scale.<br><br><b>Outcome:</b> largely superseded by <b>Teams</b> and retired in 2025 — the value migrated into the M365 bundle rather than the acquired product.' },
  { n:'Yammer', y:'2012', deal:'$1.2B', terms:'all cash', own:'Private', cat:'Enterprise social',
    detail:'<b>Terms:</b> $1.2B, all cash.<br><br><b>What it added:</b> enterprise social networking.<br><br><b>How it shows up today:</b> absorbed into the M365 collaboration stack (later "Viva Engage").' },
  { n:'Nokia Devices & Services', y:'2014', deal:'~$7.2B', terms:'all cash', own:'Public (unit)', cat:'Phones / hardware', miss:true,
    detail:'<b>Terms:</b> ~$7.2B (€5.4B), all cash — Nokia\'s phone business.<br><br><b>What it was for:</b> a first-party smartphone platform for Windows Phone.<br><br><b>Outcome:</b> <b>written off ~$7.6B in 2015</b> with ~18,000 job cuts; Microsoft exited phones — the other landmark acquisition failure, and the end of its mobile-hardware ambitions.' },
  { n:'Mojang / Minecraft', y:'2014', deal:'$2.5B', terms:'all cash', own:'Private', cat:'Gaming content',
    detail:'<b>Terms:</b> $2.5B, all cash.<br><br><b>What it added:</b> <b>Minecraft</b>, one of the best-selling games ever (155M+ monthly players).<br><br><b>How it shows up today:</b> a durable first-party franchise and an early, successful content acquisition in Gaming.' },
  { n:'LinkedIn', y:'2016', deal:'$26.2B', terms:'all cash', own:'Public (LNKD)', cat:'Professional network', big:true,
    detail:'<b>Terms:</b> $26.2B, all cash ($196.00/share).<br><br><b>What it added:</b> the professional-identity graph — now 1.3B members.<br><br><b>How it monetizes today:</b> four streams inside P&BP — Talent Solutions (the largest), Marketing Solutions, Premium, and Sales Navigator.' },
  { n:'GitHub', y:'2018', deal:'$7.5B', terms:'all stock', own:'Private', cat:'Developer platform',
    detail:'<b>Terms:</b> $7.5B in Microsoft stock.<br><br><b>What it added:</b> the home of 180M+ developers (~80% code-hosting share).<br><br><b>How it monetizes today:</b> Enterprise subscriptions + <b>GitHub Copilot</b> + Actions — and a central position in the AI-coding race.' },
  { n:'ZeniMax / Bethesda', y:'2021', deal:'$7.5B', terms:'all cash', own:'Private', cat:'Gaming content',
    detail:'<b>Terms:</b> $7.5B, all cash.<br><br><b>What it added:</b> Bethesda\'s studios and IP — The Elder Scrolls, Fallout, Doom, Starfield.<br><br><b>How it shows up today:</b> first-party content for Xbox and Game Pass.' },
  { n:'Nuance', y:'2022', deal:'~$19.7B', terms:'all cash', own:'Public (NUAN)', cat:'Healthcare AI',
    detail:'<b>Terms:</b> ~$19.7B incl. debt ($56.00/share, all cash); closed Mar 2022.<br><br><b>What it added:</b> a leader in clinical speech recognition.<br><br><b>How it monetizes today:</b> <b>Dragon Copilot</b> — ambient AI that drafts clinical notes (~21M encounters/quarter), sold as SaaS to health systems on Azure.' },
  { n:'Activision Blizzard', y:'2023', deal:'~$75.4B', terms:'all cash', own:'Public (ATVI)', cat:'Gaming content', big:true,
    detail:'<b>Terms:</b> ~$75.4B, all cash ($95.00/share); closed Oct 2023 after a ~21-month regulatory review — Microsoft\'s largest acquisition.<br><br><b>What it added:</b> the largest Western games library — Call of Duty, WoW, Diablo, Overwatch, Candy Crush.<br><br><b>How it monetizes today:</b> feeds Game Pass and game/IP sales. Results so far are mixed (gaming revenue −7% in Q3 FY26), and ~$51B of related goodwill carries write-down risk.' },
];

// ─── Peers ───────────────────────────────────────────────────────────────────
var PEER_COLS = ['Microsoft', 'Google', 'Amazon AWS', 'Oracle'];
var PEER_ROWS = [
  ['Cloud platform', 'Azure (~30% share)', 'Google Cloud (~22%)', 'AWS (~42%, leader)', 'OCI (~5%)'],
  ['Cloud growth (cc)', '+39%', '+60%', '+28%', '+81%'],
  ['Custom AI silicon', 'Maia — early, 1P only', 'TPU — most mature (gen 6+), still uses NVIDIA', 'Trainium 2 — scaling', 'Mainly NVIDIA'],
  ['Disclosed AI run-rate', '~$37B', 'Undisclosed', '~$15B', 'Backlog-led'],
  ['Positioning', 'Hybrid + the M365 install base', 'AI silicon + data/search', 'Breadth + scale (incumbent)', 'Price + database migration'],
  ['Net cash position', '+$38B (AAA)', '+$49B', 'positive, higher debt', 'net debt'],
];
var PEER_NOTE = 'Azure holds ~30% of the four-provider cloud market, roughly stable, with the M365 install base (450M+ seats) as a distribution advantage. On <i>net-new</i> AI dollars, Google and AWS have been growing faster, helped by more mature custom AI chips and earlier multi-model availability — the area where Microsoft is currently behind. In software, Office, identity and GitHub are dominant; Dynamics is gaining in mid-market; Gaming is a distant #2 to Sony. <b>Sources:</b> cloud share &amp; growth are Deutsche Bank estimates (calendar Q1 2026); revenue, net cash and AI run-rate per company filings (latest reported quarter); custom-silicon assessments per company disclosures and industry reporting.';

// ─── Tailwinds / Headwinds (structural drivers, factual) ─────────────────────
var TAILWINDS = [
  '<b>ARPU optionality on the highest-margin base.</b> E7 (~$80–100+ vs E5 $57) and the end of volume discounts lift per-seat revenue across ~90–110M E5 seats, plus the $30 Copilot add-on (~20M seats) — <i>mechanism:</i> grows P&BP revenue at low incremental cost.',
  '<b>Cloud + AI migration is still early.</b> A large share of enterprise workloads remain on-prem and AI adoption is nascent — <i>mechanism:</i> a multi-year conversion runway into Azure and the Copilot family, sold into an installed base Microsoft already serves.',
  '<b>Recurring revenue + AAA balance sheet.</b> Mostly subscription/consumption revenue, net cash, AAA rating — <i>mechanism:</i> funds the CapEx cycle internally and sustains pricing power through switching costs.',
];
var HEADWINDS = [
  '<b>The AI build compresses margins &amp; cash flow near-term.</b> ~$190B CY2026 CapEx flows into cloud COGS as depreciation; free cash flow is pressured while revenue catches up — <i>mechanism:</i> depreciation lags the cash spend by 4–6 years, so reported cloud margins fall before they recover.',
  '<b>Relative cloud growth &amp; the custom-silicon gap.</b> Azure has not out-accelerated Google/AWS, and Maia covers only first-party workloads — <i>mechanism:</i> Azure serves frontier AI on costlier NVIDIA capacity, raising COGS and constraining capacity for external AI customers.',
  '<b>OpenAI concentration.</b> ~45% of RPO is one customer; the restructured terms ended Azure exclusivity — <i>mechanism:</i> revenue concentration plus a model-layer dependency for Copilot.',
  '<b>Cyclical / legacy drags.</b> Windows tracks the PC cycle and Gaming/Activision is under-earning with goodwill-impairment risk — <i>mechanism:</i> MPC caps headline growth and adds non-operating volatility.',
];

var SOURCES = 'Sources: Microsoft FY2026 Q3 results &amp; press release (Apr 29, 2026) and the FY26 Q3 10-Q (incl. the restructured OpenAI agreement, Apr 2026); IR earnings commentary (Satya Nadella / Amy Hood); FY2025 10-K and prior filings for segment structure and historical detail; Microsoft acquisition press releases / SEC filings for M&A terms; Microsoft licensing announcements for the Nov-2025 volume-discount change; Gartner and other research-firm commentary on E5/E7 value; and Deutsche Bank estimates for cloud market-share &amp; growth (calendar Q1 2026). Headline figures are Q3 FY2026; cloud market share is C1Q2026; tier pricing is approximate / list-level; forward CapEx is management guidance.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(s){ return '<div class="ov-row"><div class="ov-row-k">'+s[0]+'</div><div class="ov-row-v">'+s[1]+'</div></div>'; }).join(''); }
function chartCard(id, title, sub){ return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div><div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div></div>'; }
// Sub-segment "sub-diagram" rendered inside the modal: what / monetizes / product grid / competition.
function subDetailHtml(s){
  return '<div class="ov-sub-line"><b>What it is.</b> '+s.what+'</div>'+
    '<div class="ov-sub-mon"><b>How it monetizes:</b> '+s.monetizes+'</div>'+
    '<div class="ov-subh" style="margin-top:14px">Products — what\'s actually offered</div>'+
    '<div class="ov-prod">'+s.products.map(function(p){ return '<div class="ov-prod-tile"><div class="ov-prod-n">'+esc(p.n)+'</div><div class="ov-prod-d">'+p.d+'</div></div>'; }).join('')+'</div>'+
    (s.competition ? '<div class="ov-sub-comp"><b>Competition:</b> '+s.competition+'</div>' : '');
}

function html(c){
  var h = '<div class="ov ov-msft" data-brand="MSFT">';

  // 1 — Snapshot + lede
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('') + '</div>';
  h += '<p class="ov-lede">'+DESC+'</p>';

  // 2 — KPIs
  h += '<div class="ov-kpis">' + KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+FY_NOTE+'</div>';

  // 3 — How it makes money
  h += sec('How Microsoft Makes Money', rows(HOW_MONEY));

  // 4 — Per-seat economics
  h += sec('Per-Seat Economics — Tiers, Pricing & the Discount Change',
    bullets(PERSEAT_POINTS)+
    '<div class="ov-subh" style="margin-top:16px">The enterprise tier ladder</div>'+
    '<table class="ov-table"><thead><tr><th>Tier</th><th>List price</th><th>What it adds</th></tr></thead><tbody>'+
    TIERS.map(function(t){ return '<tr><td class="ov-td-name">'+esc(t[0])+'</td><td>'+t[1]+'</td><td>'+t[2]+'</td></tr>'; }).join('')+
    '</tbody></table>'+
    '<div class="ov-callout" style="margin-top:12px">'+TIERS_NOTE+'</div>'
  );

  // 5 — Charts
  h += sec('The Business at a Glance',
    '<div class="ov-fynote" style="margin-bottom:14px">'+CH_NOTE+'</div>'+
    '<div class="ov-charts">'+
      chartCard('msSegRev', 'Revenue by Segment', 'Q3 FY26 · $B') +
      chartCard('msSegMargin', 'Operating Margin by Segment', 'Q3 FY26 · %') +
      chartCard('msShare', 'Cloud Market Share', 'C1Q26 · share % (growth in tooltip)') +
    '</div>'
  );

  // 6 — Segment architecture map (sub-segments open product sub-diagrams)
  h += sec('Segments & Products — The Architecture',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Microsoft\'s three segments and their sub-segments. <b>Tap any sub-segment</b> for what it is, the products it offers, and how it monetizes.</div>'+
    '<div class="ov-segmap">'+SEGMENTS.map(function(seg){
      return '<div class="ov-segpanel" style="border-top-color:'+seg.accent+'">'+
        '<div class="ov-segpanel-h"><div class="ov-segpanel-n">'+esc(seg.n)+'</div><div class="ov-segpanel-m">'+esc(seg.rev)+' · '+esc(seg.margin)+'</div></div>'+
        '<div class="ov-segnodes">'+seg.subs.map(function(s){
          return '<div class="ov-segnode ov-clickable" data-detail="sub:'+esc(s.k)+'"><span class="ov-segnode-n">'+esc(s.n)+'</span><span class="ov-segnode-r">'+esc(s.rev)+'</span></div>';
        }).join('')+'</div>'+
      '</div>';
    }).join('')+'</div>'
  );

  // 7 — Azure & AI
  h += sec('Azure & the AI Platform', '<div class="ov-callout">'+bullets(AZURE)+'</div>');

  // 8 — Switching costs (interactive hub)
  h += sec('Switching Costs & Competitive Position',
    '<div class="ov-hub">'+
      '<div class="ov-hub-center"><div class="ov-hub-box">'+esc(SWITCH_CENTER)+'</div></div>'+
      '<div class="ov-hub-stem"></div>'+
      '<div class="ov-hub-nodes">'+SWITCH_NODES.map(function(s){
        return '<div class="ov-hub-node ov-clickable" data-detail="switch:'+esc(s.k)+'"><div class="ov-hub-ic">'+s.ic+'</div><div class="ov-hub-l">'+esc(s.l)+'</div><div class="ov-hub-s">'+esc(s.s)+'</div><div class="ov-hub-more">Tap ›</div></div>';
      }).join('')+'</div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin-top:12px">'+SWITCH_NOTE+'</div>'
  );

  // 9 — History
  h += sec('History — How the Business Model Evolved',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">From software licensing to packaged software to cloud subscriptions and AI — <b>tap any milestone</b> for how it connects to today\'s model.</div>'+
    '<div class="ov-timeline">'+TIMELINE.map(function(t,i){
      return '<div class="ov-tl-item is-click" data-detail="hist:'+i+'"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body"><div class="ov-tl-head">'+t.head+'</div><div class="ov-tl-more">Full story ›</div></div></div>';
    }).join('')+'</div>');

  // 10 — M&A
  h += sec('M&A — Terms & What Each Deal Added',
    '<div class="ov-cards ov-cards-mna">'+MNA.map(function(m){
      var chipCls = m.miss ? ' ov-chip-neg' : '';
      return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
        '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span><span class="ov-chip'+chipCls+'">'+esc(m.cat)+'</span></div>'+
        '<div class="ov-card-kpis"><span>'+esc(m.y)+'</span><span>'+esc(m.deal)+'</span><span>'+esc(m.terms)+'</span><span>'+esc(m.own)+'</span></div>'+
        '<div class="ov-more">What it added ›</div></div>';
    }).join('')+'</div>'
  );

  // 11 — Peers
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table ov-cmp"><thead><tr><th>Dimension</th><th>'+PEER_COLS.map(esc).join('</th><th>')+'</th></tr></thead><tbody>'+
    PEER_ROWS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td>'+r.slice(1).map(function(cell){ return '<td>'+cell+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table><div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>'
  );

  // 12 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 13 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  // Modal scaffold
  h += '<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';

  h += '</div>';
  return h;
}

// ─── Interactivity ───────────────────────────────────────────────────────────
function init(c){
  var root = document.querySelector('.ov-msft');
  if (!root) return;

  var back = root.querySelector('#ovModalBack');
  var mT = root.querySelector('#ovModalT');
  var mB = root.querySelector('#ovModalB');
  function openModal(title, bodyHtml){
    mT.innerHTML = title; mB.innerHTML = bodyHtml;
    back.hidden = false; requestAnimationFrame(function(){ back.classList.add('on'); });
    document.addEventListener('keydown', onEsc);
  }
  function closeModal(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden = true; }, 180); }
  function onEsc(e){ if (e.key === 'Escape') closeModal(); }
  root.querySelector('#ovModalX').onclick = closeModal;
  back.onclick = function(e){ if (e.target === back) closeModal(); };

  function findSub(id){ var hit=null; SEGMENTS.forEach(function(seg){ seg.subs.forEach(function(s){ if(s.k===id) hit=s; }); }); return hit; }
  function resolve(key){
    var parts = key.split(':'); var kind = parts[0], id = parts.slice(1).join(':');
    if (kind === 'sub'){ var s = findSub(id); return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:subDetailHtml(s) }; }
    if (kind === 'mna'){ var m = MNA.filter(function(x){return x.n===id;})[0]; return m && { t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>', h:m.detail }; }
    if (kind === 'hist'){ var t = TIMELINE[parseInt(id,10)]; return t && { t:t.y, h:t.detail }; }
    if (kind === 'switch'){ var w = SWITCH_NODES.filter(function(x){return x.k===id;})[0]; return w && { t:w.l+' <span class="ov-modal-sub">switching-cost layer</span>', h:w.detail }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor = 'pointer';
    el.addEventListener('click', function(){ var d = resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });

  // Charts
  if (typeof window !== 'undefined' && window.Chart){
    function mk(id, cfg){ var cv = root.querySelector('#'+id); if (!cv) return; var ex = window.Chart.getChart && window.Chart.getChart(cv); if (ex) ex.destroy(); new window.Chart(cv, cfg); }
    var blue='#0078D4', green='#7FBA00', red='#F25022', grid='#EEF0F4';

    mk('msSegRev', { type:'doughnut',
      data:{ labels:CH_SEGREV.labels, datasets:[{ data:CH_SEGREV.data, backgroundColor:[blue, green, red], borderColor:'#fff', borderWidth:1 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'56%',
        plugins:{ legend:{position:'bottom', labels:{boxWidth:9, font:{size:9}, padding:6}},
          tooltip:{ callbacks:{ label:function(c2){ var t=c2.dataset.data.reduce(function(a,b){return a+b;},0); return c2.label+': $'+c2.parsed+'B ('+Math.round(c2.parsed/t*100)+'%)'; } } } } } });

    mk('msSegMargin', { type:'bar',
      data:{ labels:CH_SEGMARGIN.labels, datasets:[{ data:CH_SEGMARGIN.data, backgroundColor:[blue, green, red], borderRadius:4, maxBarThickness:54 }] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c2){ return c2.parsed.y+'% operating margin'; } } } },
        scales:{ x:{ ticks:{font:{size:10}}, grid:{display:false} }, y:{ ticks:{font:{size:9}, callback:function(v){return v+'%';}}, grid:{color:grid}, max:70 } } } });

    mk('msShare', { type:'doughnut',
      data:{ labels:CH_SHARE.labels, datasets:[{ data:CH_SHARE.data, backgroundColor:['#FF9900', '#0078D4', '#34A853', '#C74634'], borderColor:'#fff', borderWidth:1 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'56%',
        plugins:{ legend:{position:'bottom', labels:{boxWidth:9, font:{size:9}, padding:6}},
          tooltip:{ callbacks:{ label:function(c2){ return c2.label+': ~'+c2.parsed+'% share · '+CH_SHARE.growth[c2.dataIndex]+' cc growth'; } } } } } });
  }
}

export var msftOverview = { html: html, init: init };
