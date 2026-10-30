// themes-data/ma.js — Mastercard's theme record (Evolution ▸ Earnings ▸ Notes), the static seed.
//
// Contract: docs/PROFILE_PLAYBOOK.md §12 EV-NOTES and §24. Once the portal saves a record (Supabase, company_theme_record)
// that copy wins and this seed is no longer read.
//
// Source: the earnings calls Q4 2023 → Q3 2026 (docs/calls/MA.md and MA-latest.md, verbatim transcripts). The analyst has no
// handwritten Mastercard notes on file, so the threads are the ones management comes back to call after call: cross-border and
// the consumer, switching and issuer wins, commercial flows and Move, Value-Added Services and security, agentic commerce,
// stablecoins and BVNK, the annual guide, buybacks and regulation. Every note is a paraphrase of what management said (no
// quotation marks); each figure is a number stated on that call. Mastercard quotes non-GAAP, currency-neutral growth.
//
// Open vs closed hooks: a thread that had a beginning and an end (a quarterly guide resting on an assumption, a portfolio
// migration) is its own sub-theme with `trackUntil` = the quarter it was settled, and its last note says how it landed
// ("Reconciled: …"). Seed version: bump it when the seed is restructured; the Notes tab replaces a saved record older than this.
//
// Moved here from the earlier inline MA_THEMES in js/overviews/mastercard.js (Q4 2023 → Q1 2026 notes kept, regrouped under
// axes); the Q2 and Q3 2026 notes were added from the call transcripts.
export var MA_THEMES_V = 2;
export var MA_THEMES = [
  // ── Consumer payments ─────────────────────────────────────────────────────────────────────────
  { seg:'Consumer payments', theme:'Cross-border and the consumer', st:{ k:'trend', since:'Q4 2023', last:'Q3 2026' },
    why:'The highest-yield line and the demand pulse: cross-border growth, and the health of the consumer behind it, is the number to watch call after call.',
    updates:[
      { q:'Q4 2023', items:['Cross-border <b>+18%</b> in local currency; a healthy consumer supported by a strong labor market and the wealth effect.'] },
      { q:'Q2 2024', items:['Cross-border <b>+17%</b>; some moderation in the Middle East and Africa; a savvy, intentional consumer using the digital economy to find the best deal.'] },
      { q:'Q1 2025', items:['Cross-border <b>+15%</b>; consumer solid despite tariff uncertainty, with no meaningful pull-forward of spend.'] },
      { q:'Q3 2025', items:['Cross-border <b>+15%</b>; card-not-present ex-travel running near <b>20%</b>, partly on crypto on-ramp purchases; management credits winning cross-border-heavy affluent portfolios (Japan Airlines, the American Airlines renewal) and daily work on corridors. Consumer steady across affluent and mass market.'] },
      { q:'Q4 2025', items:['Cross-border <b>+14%</b>; card-not-present ex-travel eased against a year earlier, when crypto purchases lifted it; January travel hit by weather in Europe.'] },
      { q:'Q1 2026', items:['Cross-border <b>+13%</b>; card-not-present ex-travel <b>+18%</b>; travel pressured from March by the Middle East conflict and by portfolio shifts, with Ramadan and Easter timing on top. Cross-border travel growth fell from <b>8%</b> in the quarter to <b>2%</b> in the first four weeks of April.'] },
      { q:'Q2 2026', items:['Cross-border <b>+12%</b>; card-not-present ex-travel <b>+20%</b>, helped by Venezuela (more US dollars available, a debit market where Mastercard leads) and the timing of large retail promotions. Travel improved on April as the Middle East impact lightened. Cross-border assessments <b>+20%</b> against volume <b>+12%</b>, the gap being pricing and mix. July metrics stable.'] },
      { q:'Q3 2026', items:['Cross-border <b>+11%</b>, assessments <b>+16%</b>; card-not-present ex-travel <b>+15%</b> from <b>20%</b>, all of it on the lower-yielding intra-Europe leg (a new EU customs fee, the timing of large retail promotions and lower crypto purchases than a year earlier), while higher-yielding other cross-border held stable to slightly higher. Middle East impact stays near end-of-Q2 levels and outbound from Venezuela helps. October 1 to 21: cross-border <b>+10%</b>, intra-Europe <b>+8%</b>, other <b>+12%</b>, travel <b>+7%</b> on holiday timing. US GDV <b>+6%</b> (credit <b>+10%</b>, debit <b>+1%</b>); US switched volume <b>+7%</b> and <b>+9%</b> in October as the Capital One migration is lapped, commercial wins come in and gas spend rises.'] },
    ]},
  { seg:'Consumer payments', theme:'Switching and portfolio wins', st:{ k:'trend', since:'Q4 2025', last:'Q3 2026' },
    why:'Switched volume feeds the data behind the services. Watched through switching penetration, the share of switched transactions that grows and the issuer wins behind it.',
    updates:[
      { q:'Q4 2025', items:['More than <b>70%</b> of Mastercard transactions are now switched, up 10 points since 2020; more than <b>175B</b> transactions switched in the year. Switched transactions <b>+10%</b>; contactless <b>77%</b> of in-person purchases. More than <b>60</b> new affluent programs in 2025; <b>Apple Card</b> stays on Mastercard, with the issuer moving to JPMorgan Chase in about 24 months.'] },
      { q:'Q1 2026', items:['Switched transactions <b>+9%</b> (<b>+10%</b> excluding Capital One debit). Management ties the pace to geographic mix, since low-ticket markets such as Russia grew faster, and notes switching is now started in Japan and Mexico. <b>World Legend</b> cards show more than <b>3x</b> the cross-border spend of World Elite. Wins: CIB Egypt (5M+ cards), Westpac renewal, the Amazon US Small Business co-brand moving to Mastercard.'] },
      { q:'Q2 2026', items:['Switched transactions <b>+9%</b>; switching penetration <b>72%</b>; tokens above <b>40%</b> of switched transactions; contactless <b>80%</b> of in-person. Several hundred flips and expansions in the first half; renewals with <b>JPMorgan Chase</b> (Freedom Flex) and <b>Banamex</b> (about 19M cards); Revolut, Eurobank and Saudi National Bank added. Over <b>230M</b> net new Mastercards in twelve months. The UAE central bank subsidiary chose Mastercard to build part of the domestic switch, behind domestic debit and Jaywan co-badged credit.'] },
      { q:'Q3 2026', items:['Switched transactions <b>+9%</b>; contactless <b>81%</b> of in-person (+5 points); cards <b>3.8B</b> (+5%); merchant acceptance up <b>20%</b> in the first half. Wins and renewals: Pinnacle Financial\'s whole issuing portfolio from 2027; DSGV and DZ Bank renewed, Handelsbanken and Swedbank renewed after the SEB exclusive; China\'s top 15 issuers plus Bank of Communications (Hilton co-brand) and Bank of China (consumer debit); HDFC Bank small business (about <b>3M</b> cards); 15 Essential Debit programs in seven markets; 100 affluent programs won.'] },
    ]},
  { seg:'Consumer payments', theme:'Capital One debit migration', st:{ k:'promise', since:'Q4 2024', last:'Q2 2026' }, trackUntil:'Q1 2026',
    why:'A dated headwind: the Capital One debit portfolio moving to its own network, weighing on US debit and switched volume until the migration finished.',
    updates:[
      { q:'Q4 2024', items:['Capital One credit renewed, with Mastercard the network for a large share of new credit accounts; the debit portfolio moves to Discover over time.'] },
      { q:'Q3 2025', items:['The debit migration is underway: Mastercard will lose the associated revenue. Not material to 2025 net revenue, but further impacts in 2026 as cards move, partly offset by contractual obligations that do not fully cover the loss; the conversion completes in 2026 and the offset ends after it, so 2027 carries a further headwind. US switched volume growth stepped down from <b>8%</b> in Q3 to <b>5%</b> in early October. Credit stays a robust partnership.'] },
      { q:'Q4 2025', items:['Debit growth still held back by the migration, which continued through the quarter; US GDV <b>+4%</b>, debit <b>+2%</b>. Credit agreement extended and Capital One keeps using several Mastercard services.'] },
      { q:'Q1 2026', items:['Reconciled: the migration is basically complete. US debit GDV <b>+1%</b> (<b>+7%</b> excluding it); US switched volume flat on the quarter and over a point faster excluding Capital One.'] },
      { q:'Q2 2026', items:['After the migration: US GDV <b>+6%</b>, debit <b>+1%</b> (<b>+8%</b> excluding Capital One). US switched volume excluding Capital One <b>+10%</b>, two points up on the quarter, on fuel and broad spending.'] },
    ]},
  { seg:'Consumer payments', theme:'Europe and deal discipline', st:{ k:'watch', since:'Q2 2026', last:'Q3 2026' },
    why:'Whether slower European purchase volume is a lapping effect and a choice, not a share problem: management walks away from deals that do not pay.',
    updates:[
      { q:'Q2 2026', items:['Europe purchase volume grew <b>16%</b> in Q2 2024 on the Santander, NatWest and UniCredit wins, so the comparison now laps them. Mastercard passed on <b>Lloyds Credit</b> when the economics stopped making sense. Management says it chases profitable volume that raises net revenue yield, not volume for its own sake.'] },
      { q:'Q3 2026', items:['Intra-Europe cross-border fell sequentially for timing and comparison reasons that management calls not structural. The European consumer is described as resilient; some share shifts remain, offset by renewals (DSGV, DZ Bank, the Nordic banks) and strong VAS in Europe.'] },
    ]},
  // ── Commercial and new flows ──────────────────────────────────────────────────────────────────
  { seg:'Commercial and new flows', theme:'Commercial, B2B and Mastercard Move', st:{ k:'trend', since:'Q4 2023', last:'Q3 2026' },
    why:'The biggest disclosed pool of cash and check still to digitize: commercial cards, virtual cards and the disbursement and remittance rail, Mastercard Move.',
    updates:[
      { q:'Q4 2023', items:['Commercial <b>13%</b> of GDV, <b>+11%</b>; Move <b>+30% to 35%</b>; JPMorgan and Fleetcor renewals; virtual cards for Booking.com and Agoda.'] },
      { q:'Q2 2024', items:['Mobile virtual-card app (HSBC Australia and Westpac first); commercial point-of-sale bundles for small and mid-sized businesses.'] },
      { q:'Q3 2024', items:['Move transactions <b>+40%</b>; the Pepsi bottler CBC in Latin America reaches about 2M retailers; small-business cards in market <b>+10%</b>.'] },
      { q:'Q4 2024', items:['Commercial <b>13%</b> of GDV, <b>+11%</b>; Coupa Mastercard, WEX renewal, Amazon card in the UAE.'] },
      { q:'Q4 2025', items:['Commercial credit and debit were <b>13%</b> of GDV in 2025 and grew <b>11%</b>. Move transactions grew more than <b>35%</b> in the quarter and the year, with more than <b>17B</b> endpoints. Coupa Mastercard launched, WEX renewed, small business named as more than half the cash and check opportunity at commercial point of sale.'] },
      { q:'Q1 2026', items:['The <b>Amazon</b> US Small Business co-brand (issued by US Bank) moves to Mastercard. Fleet wins (Free, ryd) and B2B travel wins (Highnote, Travelsoft, Juniper, Bula); management expects slower short-term growth in travel but keeps the long-term view. Move extended with Bank of Shanghai and One Inc.'] },
      { q:'Q2 2026', items:['Commercial credit and debit volume <b>+12%</b>; about <b>6M</b> new small business cards a quarter for several quarters; Intuit, Truist (virtual cards for invoice payments) and the <b>Riyadh Air</b> program added. Move extended with WeChat Pay Hong Kong and FlyRemit. An exclusive partnership with Evermore rolls out a new food-assistance program in the US, about <b>$100B</b> of annual spend.'] },
      { q:'Q3 2026', items:['Tungsten Automation adds Mastercard virtual cards to its accounts-payable products (more than <b>25,000</b> customers); a large US retailer consolidated over <b>$100M</b> of supplier payments through Coupa, saving about <b>$35M</b> of onboarding cost. Travel: partners with <b>8 of the 10</b> largest players, Checkout.com expanded in the UAE, and the quarter\'s travel wins should bring over <b>$20B</b> of incremental spend across the agreements. Mastercard Move\'s <b>17B</b> endpoints are built into the Global Money Platform.'] },
    ]},
  // ── Value-added services ──────────────────────────────────────────────────────────────────────
  { seg:'Value-added services', theme:'Growth and the flywheel', st:{ k:'trend', since:'Q1 2024', last:'Q3 2026' },
    why:'The diversifier: about 40% of revenue, growing faster than the network and less exposed to regulation. Watched for organic growth and the share that is network-linked.',
    updates:[
      { q:'Q1 2024', items:['Decision Intelligence Pro (generative-AI fraud scoring, <b>+20%</b> detection) and personalization; about one in three services products AI-enabled.'] },
      { q:'Q3 2024', items:['Recorded Future and Minna announced; VAS <b>+19%</b> organic.'] },
      { q:'Q4 2024', items:['VAS <b>+21%</b> for the year (<b>18%</b> excluding acquisitions); about <b>60%</b> of VAS revenue is network-linked.'] },
      { q:'Q2 2025', items:['Cyber and security demand rising with AI-era fraud; personalization and data insights the standout drivers.'] },
      { q:'Q3 2025', items:['Threat Intelligence scaling across the network; VAS <b>+19%</b> organic; consulting and marketing services strong.'] },
      { q:'Q4 2025', items:['VAS <b>+22%</b> (about <b>3</b> points from acquisitions, <b>19%</b> organic); full year <b>+21%</b>. Management attributes it to the attach rate on network growth, more penetration of customers and new products; Credit Intelligence and Agent Suite launched.'] },
      { q:'Q1 2026', items:['VAS <b>+18%</b> with no acquisition impact; Ethoca products grew about <b>25%</b>; a foundation generative-AI model built with NVIDIA; consulting and marketing customers from 2024 returned and raised usage by more than <b>20%</b>.'] },
      { q:'Q2 2026', items:['VAS <b>+18%</b>, with minimal drag from dispositions (SessionM). About <b>60%</b> of VAS revenue is network-linked and the rest, mostly marketing and consulting, also grows at a healthy rate; management says one or two acquisitions will not change that balance. A partner program has more than <b>200</b> partners.'] },
      { q:'Q3 2026', items:['VAS <b>+19%</b> (Q2: <b>+18%</b>), minimal acquisition and disposition impact, now including BVNK; drivers: consumer acquisition and engagement, business and market insights, security, digital and authentication, and pricing. About <b>60%</b> of VAS is network-linked. Part of the quarter is services projects pulled forward from Q4, with a matching offset expected in Q4. Pricing: partly earlier pricing and partly new (tokens are the example), with some lapping expected in Q4.'] },
    ]},
  { seg:'Value-added services', theme:'Security and cyber', st:{ k:'trend', since:'Q3 2024', last:'Q3 2026' },
    why:'Where the AI-era fraud story meets the services line: Recorded Future, Threat Intelligence and identity, sold on top of the transaction data.',
    updates:[
      { q:'Q3 2024', items:['Recorded Future (threat intelligence) announced; closed in December 2024.'] },
      { q:'Q4 2024', items:['Mastercard Threat Intelligence launched, bringing Mastercard and Recorded Future data together.'] },
      { q:'Q1 2026', items:['More than <b>500</b> customers engaged with Threat Intelligence; takedowns of malicious domains tied to card theft across more than <b>10,000</b> e-commerce sites. Management sees demand for security solutions as a continued significant growth driver and says cyber now reaches the chief information security officer, not only fraud teams.'] },
      { q:'Q2 2026', items:['In its first three quarters Threat Intelligence found more than <b>7M</b> card-testing transactions across <b>192</b> countries, preventing an estimated <b>$172M</b> of fraud. Merchant Trust Services launched; Wipro added as a partner. Account-to-account scam protection started with a consortium of UK banks.'] },
      { q:'Q3 2026', items:['Digital Risk Protection reached nearly <b>800</b> enterprise customers after a few months in market; third-party risk offer combines RiskRecon and Recorded Future; fraud and identity extensions with Standard Bank, Monzo and Starling. Management stresses AI is both a source of demand and a tool for fraudsters and expects no sudden jump in growth.'] },
    ]},
  // ── Agentic and digital assets ────────────────────────────────────────────────────────────────
  { seg:'Agentic and digital assets', theme:'Agentic commerce', st:{ k:'watch', since:'Q2 2025', last:'Q3 2026' },
    why:'The newest and fastest-moving thread: tokens, rules and the fraud stack as the trust layer for AI agents that shop and pay on a user\'s behalf. Still early, so watched for volume, not announcements.',
    updates:[
      { q:'Q1 2025', items:['Agent Pay announced: a framework to recognize, register and secure AI agents, built on tokenization. Partners include Microsoft and OpenAI.'] },
      { q:'Q2 2025', items:['Scaling Agent Pay globally; framed as extending the trust of the brand to a new way to transact.'] },
      { q:'Q3 2025', items:['First agentic transaction on the network; US Bank and Citi cardholders enabled, other US issuers in November, global rollout early 2026.'] },
      { q:'Q4 2025', items:['US issuers enabled and the global issuer base targeted for the end of Q1 2026; Antom for card-based agentic payments in Asia; consulting with Lloyds, Elavon and Santander; a pilot with Majid Al Futtaim in the UAE. Management calls it early days and says it is ready.'] },
      { q:'Q1 2026', items:['Nearly all Mastercards enabled for Agent Pay. Partnership with <b>OpenAI</b> deepened toward agent-to-agent payments; <b>Verifiable Intent</b> launched with Google, now the base of FIDO Alliance security standards; Crossmint partnership. Volumes still early, with the larger prize expected in business payments.'] },
      { q:'Q2 2026', items:['Agent Pay for Machines launched for low-value machine-to-machine payments (APIs, compute, data) with on-chain permissioning and off-chain settlement and more than <b>30</b> launch partners, among them Adyen, Coinbase, Cloudflare and OKX; management calls it the only network protocol doing this. Cards expected to prevail in consumer and business agentic use; no volumes disclosed.'] },
      { q:'Q3 2026', items:['Management says numbers are not yet significant but agentic transactions are growing at impressive weekly rates and consumer adoption should build through the holidays. Four requirements: trust in the payment, the agent, the ecosystem, and reach (Agent Pay tokens, Verifiable Intent, Agentic Trust Intelligence). New: Agent Connect for merchant discoverability; Shopify (Shop Pay) using Agent Pay and network tokens; a broad strategic partnership with OpenAI covering Agent Pay, joint services growth and AI transformation. Firm line: one-time virtual card numbers are a processor bridge, not a solution Mastercard supports long term.'] },
    ]},
  { seg:'Agentic and digital assets', theme:'Stablecoins and digital assets', st:{ k:'watch', since:'Q4 2023', last:'Q3 2026' },
    why:'From another currency on the rails to a build-out: on and off ramps, settlement, an open-standard coin and the BVNK acquisition.',
    updates:[
      { q:'Q4 2023', items:['Multi-Token Network launched; crypto co-brands (MetaMask, Crypto.com); buy and spend crypto at more than 150M acceptance locations.'] },
      { q:'Q1 2024', items:['Stablecoin settlement enabled on the network (Nuvei); card issuance with Kraken, OKX and Bybit.'] },
      { q:'Q4 2024', items:['Gemini business stablecoin co-brand; Ripple settlement; about <b>130</b> crypto co-brand programs.'] },
      { q:'Q2 2025', items:['Stablecoins framed as another currency: Mastercard provides the on and off ramps, interoperability and trust.'] },
      { q:'Q3 2025', items:['Stablecoins embedded into Move (pre-funding and disbursements); on-ramp transactions <b>+25%</b> year to date.'] },
      { q:'Q4 2025', items:['Most crypto and stablecoin use is still trading; MetaMask scaling, Gemini business co-brand, Ripple settlement. Management sees it as another currency the network can support.'] },
      { q:'Q1 2026', items:['OKX crypto card extended into Europe; settlement in stablecoin integrated into Move; management sees tokenized money as a meaningful share of future money movement and says the CLARITY Act would help but does not hold the plan back.'] },
      { q:'Q2 2026', items:['Crypto co-brand volume more than tripled in two years; Bitget and Kraken expanded. <b>OpenUSD</b>, an open-standard coin run through a consortium of more than <b>140</b> companies, goes live later in 2026 as one coin among several the network will enable, alongside USDC and USDG. Management sees a role for stablecoins in some business and person-to-person flows but no problem to solve in person-to-merchant.'] },
      { q:'Q3 2026', items:['The first joint BVNK product, the Mastercard Global Money Platform, lets banks and fintechs offer accounts that hold, convert, send and receive fiat and stablecoins; Nuvei and Marqeta are among the first to integrate, more partners to come. Complements crypto co-brands and stablecoin settlement.'] },
    ]},
  { seg:'Agentic and digital assets', theme:'BVNK acquisition', st:{ k:'promise', since:'Q1 2026', last:'Q3 2026' }, trackUntil:'Q3 2026',
    why:'A dated promise: closing the BVNK deal and showing what the fiat-to-stablecoin bridge earns. Open until it closes and the first economics are disclosed.',
    updates:[
      { q:'Q1 2026', items:['Planned acquisition of BVNK announced: the interoperable layer to send, receive, convert and hold stablecoins, with the licenses and compliance tooling that are hard to get. Revenue is basis points on volume in a market Mastercard does not address today.'] },
      { q:'Q2 2026', items:['Expected to close in <b>Q3 2026</b>. Minimal net-revenue impact and some operating expense, already included in the guide reconciliations. No take-rate or margin disclosed yet.'] },
      { q:'Q3 2026', items:['Reconciled: closed in August, inside the Q3 window the Q2 call gave. Revenue impact minimal, off a small base; integration on track; the Global Money Platform is the first product. Take rate and margin still not disclosed.'] },
    ]},
  // ── Guidance, costs and capital ───────────────────────────────────────────────────────────────
  { seg:'Guidance, costs and capital', theme:'Q2 2026 guide and the Middle East', st:{ k:'promise', since:'Q1 2026', last:'Q2 2026' }, trackUntil:'Q2 2026',
    why:'A guide that rested on one assumption: the conflict ends in Q2. Closed once the quarter showed how the assumption landed.',
    updates:[
      { q:'Q1 2026', items:['Q2 net revenue growth guided to the <b>low end of low double digits</b>, currency-neutral, with the conflict assumed to end in Q2 and headwinds largest in Q2; without the conflict, growth would have been in line with Q1. Gulf Cooperation Council countries and Israel are about <b>6%</b> of cross-border volume. Full-year currency-neutral guide unchanged; the raise was FX. Management declined to model other scenarios.'] },
      { q:'Q2 2026', items:['Reconciled: net revenue <b>+12%</b>, above management\'s expectation; the Middle East impact moderated through the quarter and was less severe than assumed, and a Venezuela cross-border surge added upside. Management now assumes impacts stay near end-of-Q2 levels for the rest of the year.'] },
    ]},
  { seg:'Guidance, costs and capital', theme:'FY2026 guide', st:{ k:'promise', since:'Q4 2025', last:'Q3 2026' },
    why:'The open guide for 2026, on a currency-neutral basis. To reconcile when the year closes.',
    updates:[
      { q:'Q4 2025', items:['Net revenue growth at the <b>high end of low double digits</b>, ex-inorganic, with about <b>1 to 1.5</b> points of FX tailwind; first half growth lower than the second on tougher comps from FX volatility in 2025. Operating expense growth at the low end of low double digits. A restructuring charge of about <b>$200M</b> in Q1, affecting about <b>4%</b> of staff; tax rate <b>20% to 21%</b>.'] },
      { q:'Q1 2026', items:['Full-year growth unchanged in currency-neutral terms; the nominal raise is FX (about <b>1.5</b> points tailwind). Operating expense growth low double digits.'] },
      { q:'Q2 2026', items:['Same range, but expected higher within it: net revenue growth at the <b>high end of low double digits</b>, with about <b>1</b> point of FX tailwind. Q3 net revenue guided to the high end of low double digits, operating expense low double digits, other income and expense about <b>$125M</b> of expense, tax <b>20% to 21%</b> for Q3 and Q4.'] },
      { q:'Q3 2026', items:['Unchanged: net revenue at the <b>high end of low double digits</b>, FX tailwind about <b>1</b> point; operating expenses low double digits with a <b>0.5 to 1</b> point FX headwind. Q4: net revenue high end of low double digits, FX headwind about <b>1</b> point (stronger dollar); operating expenses high end of low double digits with a <b>1</b> point acquisition drag and a <b>0.5</b> point FX tailwind; other income and expense about <b>$115M</b> of expense; tax <b>20% to 21%</b>.'] },
    ]},
  { seg:'Guidance, costs and capital', theme:'Share repurchases', st:{ k:'trend', since:'Q4 2025', last:'Q3 2026' },
    why:'The pace of buybacks and what they add to EPS, set against the cash balance and the debt issued to fund them.',
    updates:[
      { q:'Q3 2025', items:['<b>$3.3B</b> in the quarter and <b>$1.2B</b> through October 27; EPS $4.38 including <b>$0.10</b> from buybacks, with net income <b>+8%</b> held back by a higher tax rate (Pillar Two, geographic mix and a discrete item).'] },
      { q:'Q4 2025', items:['<b>$3.6B</b> repurchased in the quarter and <b>$715M</b> more through January 26; EPS $4.76 including <b>$0.10</b> from buybacks.'] },
      { q:'Q1 2026', items:['<b>$4.0B</b> in the quarter and <b>$1.7B</b> through April 27; pace accelerated given valuation and conviction in long-term growth; EPS $4.60 including <b>$0.10</b> from buybacks.'] },
      { q:'Q2 2026', items:['<b>$4.9B</b> in the quarter and about <b>$700M</b> through July 27; EPS $5.04 including <b>$0.14</b> from buybacks. Debt issued in June lifts interest expense in Q3.'] },
      { q:'Q3 2026', items:['<b>$3.0B</b> in the quarter (5.3M shares) and <b>$648M</b> through October 26, with <b>$4.9B</b> left on the authorizations; EPS $5.31 including <b>$0.16</b> from buybacks.'] },
    ]},
  { seg:'Guidance, costs and capital', theme:'CFO transition', st:{ k:'watch', since:'Q2 2026', last:'Q3 2026' }, trackUntil:'Q3 2026',
    why:'The one new variable on the Q2 2026 call: a new CFO. Watched for any change in framing, cadence or disclosure.',
    updates:[
      { q:'Q2 2026', items:['Sachin Mehra\'s last call as CFO; he moves to Chief Business Officer. <b>Ling Hai</b>, President of Asia Pacific, Europe, Middle East and Africa, becomes CFO on <b>August 3</b>. Q3 is the first guide under the new CFO; continuity was stressed.'] },
      { q:'Q3 2026', items:['Reconciled: Ling Hai\'s first call as CFO. Formal 2027 guidance comes with the Q4 release. She frames rebates and incentives as an input and net revenue yield as the measure.'] },
    ]},
  { seg:'Guidance, costs and capital', theme:'Q3 timing pull-forward and the Q4 offset', st:{ k:'promise', since:'Q3 2026', last:'Q3 2026' },
    why:'A dated promise: the CFO said part of the Q3 revenue upside came from services projects and payment-network deals moved up from Q4, and that Q4 will show a similar offset. To reconcile in the Q4 print and the first 2027 guide.',
    updates:[
      { q:'Q3 2026', items:['Net revenue <b>+14%</b> against a guide of the high end of low double digits, about two points faster than Q2, above management\'s expectation on the continued strength of the business and the timing of services projects and payment-network deals. Q4 is guided to the <b>high end of low double digits</b> again, rebates and incentives as a share of gross assessments are expected <b>higher</b> than in Q3, and some pricing is expected to lap. Formal 2027 guidance comes with the Q4 release.'] },
    ]},
  // ── Regulation and litigation ─────────────────────────────────────────────────────────────────
  { seg:'Regulation and litigation', theme:'Credit Card Competition Act and the rate cap', st:{ k:'watch', since:'Q4 2024', last:'Q4 2025' },
    why:'The persistent tail risk: the routing mandate in the CCCA and a proposed 10% credit rate cap, plus the interchange litigation overhang.',
    updates:[
      { q:'Q1 2024', items:['US merchant interchange settlement reached, later rejected by the court, so the overhang persists.'] },
      { q:'Q4 2024', items:['CCCA back in the news; a proposed 10% credit rate cap discussed; Mastercard engaging on affordability and credit access.'] },
      { q:'Q4 2025', items:['Management says the CCCA, first introduced in 2023, has made little progress and faces united opposition, and argues it would move choice from consumers to merchants and risk security without passing savings on. On the 10% rate cap, Mastercard does not set rates; it is sharing data on credit access and working with issuers on affordability options. No probability offered.'] },
    ]},
];
