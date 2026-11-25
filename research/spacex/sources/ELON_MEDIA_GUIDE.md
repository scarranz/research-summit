# SpaceX (SPCX): guide to Musk / Shotwell / CFO media on strategy, targets and timelines

*Compiled Nov 25, 2026 from web research. Not included: SpaceX's own Q2 (Aug 4, 2026) and Q3 (Oct 20, 2026) earnings calls. The analyst already has those transcripts; they are cited only where they fill in the timeline.*

**How to read this guide**
- **Topic tags:** [1] Starship · [2] Starlink / direct-to-cell / spectrum · [3] Ground AI compute, ARR, Grok/Cursor · [4] Orbital compute, solar, Terafab · [5] Funding, capex, IPO, Tesla combination · [6] Long-term vision / TAM
- **Relevance:** 1 to 5 (5 = must watch for the investment case)
- **Link status:** "Verified" means I opened the URL and it resolved to the right title or content. **UNVERIFIED** means the link comes from a reputable secondary source but I could not open it (X/Twitter broadcasts, some podcast pages, paywalled sites).
- **Bullets are paraphrased.** Most numbers come from transcripts or close write-ups. Third-party transcripts (Singju Post, HappyScribe, TeslaNorth) say they are not checked word for word, so check the recording before quoting a number in a note.
- **Timestamps:** Few were available. Where I give one, it is a chapter-level timestamp from the official show notes.

---

## 1. Top 10 to watch / listen to first

| # | Item | Date | Why first |
|---|---|---|---|
| 1 | **Ron Baron fireside chat, Baron Investment Conference** (#C1) | Nov 6, 2026 | The most recent and most investor-oriented Musk interview: >$100B ARR in Dec-26, ~$500B ARR in Dec-27 ("best guess"), $1T ARR odds ~2%, Starmind launches in Q3-27, <$100/kg, Terafab at 1 TW/yr. |
| 2 | **TomorrowX Summit with Gavin Baker and Antonio Gracias** (#C3) | Nov 18, 2026 | The latest operating detail: +0.5 GW of compute added per month, heading to >1 GW/month by end-2027, a claimed cost ~60% of industry consensus per 10 GW, first Terafab test chip ~Jun-27, the post-catch view of Starship, and a 200 GW/yr solar-cell target. |
| 3 | **SpaceX all-hands (internal address, released on X)** (#C8) | Aug 11, 2026 | Where the AI economics are set out: 1.4 GW running, 10 GW by end-2027, "$300–500B a year in revenue" if 10 GW is online, AI to be ~99% of SpaceX value in 4–5 years. |
| 4 | **"SpaceX AI Satellites" interview, with Ian Dahl, moderated by Dan Huot (Bastrop)** (#C13) | Jun 9, 2026 | The only official deep-dive on the AI-1 satellite: 150 kW peak, the radiator and solar assumptions, and the space-compute ramp from ~1 GW/yr at end-2027 to 10 GW to 100 GW. Also 1M tons/yr to orbit in ~3 years. |
| 5 | **Dwarkesh Podcast / Cheeky Pint (with John Collison)** (#C20) | Feb 5, 2026 | The definitive long-form case for orbital compute. Space is the cheapest place for AI in <36 months (likely ~30). Also 10k Starship launches per 100 GW, Terafab logic, memory and packaging, and Musk's own admission that he sets deadlines at ~50% odds. |
| 6 | **All-In Summit: Musk + Shotwell** (#C6) | Sep 14–15, 2026 | The first joint stage appearance. Covers the Tesla-merger question, the Starship path to full reuse (early 2027), Falcon 9 retirement, Starlink penetration, EchoStar direct-to-cell, Terafab "crawl-walk-run" and compute demand. |
| 7 | **IPO roadshow video (CFO Bret Johnsen) + roadshow deck** (#C14) | Jun 4, 2026 | The official investor framing: 70% gross margin and ~45% net margin targets, the $28.5T TAM ($26.5T of it AI), and the use of proceeds. |
| 8 | **Terafab launch event (Austin, X livestream)** (#C16) | Mar 21–22, 2026 | Launch of the joint Tesla/SpaceX/xAI fab: 1 TW/yr of compute, ~80% for space, two chip families, a 100 kW "mini" data-centre satellite. Essential for the capex debate. |
| 9 | **NYT DealBook Summit (Andrew Ross Sorkin)** (#C4) | Nov 18, 2026 | Latest on the Tesla combination ("probably" better together), Anthropic possibly taking another ~10 GW, the second-generation direct-to-cell constellation in 2027 (~40x bandwidth), and 800 MHz micro-cells entering production in 2027. |
| 10 | **CFO Johnsen with Gavin Baker at Mission Control** (#C12) + **Goldman Communacopia** (#C7) | Jun 8 & Sep 10, 2026 | The CFO view of capital allocation and the year-end GW path (>2 GW at end-2026, 5–10 GW in 2027), plus Starmind in 2027. This is the counterweight to Musk's numbers. |

Runners-up: Davos with Larry Fink (Jan 22, 2026), the Moonshots #220 deep-dive (Jan 6, 2026), the xAI all-hands (Feb 11, 2026), Shotwell on CNBC on IPO day (Jun 12, 2026), and the May 2025 Starship/Mars update (the baseline for judging Mars slippage).

---

## 2. Full catalogue

Listed newest first. Numbering (#C1…) is used in the target table in section 3.

### A. Post-IPO (June–November 2026)

#### #C1 — Ron Baron fireside chat, 33rd Baron Investment Conference
- **Date / venue:** Nov 6, 2026. Musk joined by video link; the conference was in New York (reports variously say Lincoln Center / Metropolitan Opera House).
- **Platform / duration:** X live broadcast. Duration not stated (the TeslaNorth write-up is a "44-minute read").
- **URL:** https://x.com/i/broadcasts/2YRYWgMNjapKgM (**UNVERIFIED**: X broadcasts do not load in my fetcher; the link is cited by TeslaNorth). Baron Capital may post a replay on its own site or YouTube (not checked).
- **Transcript:** Third-party full transcript at TeslaNorth: https://teslanorth.com/2026/11/07/elon-musks-full-ron-baron-interview-2026-tesla-spacex-starship-ai-and-more/ (verified; not checked word for word). Write-up: https://www.investmentnews.com/equities/elon-musk-touts-data-centers-in-space-at-baron-investment-conference/268925 (verified).
- **Key claims:**
  - Revenue grew >80% from Q2 to Q3 2026, and Musk expects ~70% growth from Q3 to Q4.
  - On track for **ARR >$100B in December 2026**. **~$500B ARR in December 2027** is his "best guess, not a promise". He puts **$1T ARR** at roughly **2%** odds.
  - **Starmind** compute satellites, co-designed with NVIDIA, launch in **Q3 2027**, ramp significantly in 2028 and reach "very, very large volume" in 2029. A prototype GPU satellite and a TPU satellite are already in orbit.
  - Long-run space compute of 100–200 GW/yr, rising to ~1 TW/yr (about twice average US power use).
  - Cost to orbit falls **below $100/kg**, possibly within 2–3 years. Starship cuts the cost of access 100x or more.
  - Starlink: ~11,000 satellites in orbit. V3 has >10x the capability of V2, so ~100x the bandwidth in 2–3 years. V4 is another 10x. Laser links go from 100 Gbps to 10 Tbps. He floated buying a legacy telco for spectrum.
  - Terafab: 1 TW/yr of chips, about 30x global output. The research fab is at Giga Texas and production is in Grimes County, TX. He admits it could fail.
  - The ship catch (Ship 42) was planned for about a week later, and it happened on Nov 14.
- **Why it matters:** The cleanest source for the ARR trajectory, and his explicit confidence levels give you a probability-weighted range. **Relevance 5.** Tags [1][2][3][4][6]
- **Updates / contradictions:** The $1T ARR "2%" framing is far more cautious than the Aug 4 Q2-call talk of $1T revenue by 2030. Baron's own $14–15T valuation and $1T Starlink-revenue figures are **Baron's numbers, not Musk's**.

#### #C2 — Isaacson / Builders tie-in: see #C5.

#### #C3 — TomorrowX Summit (iConnections / Atreides / Valor), with Gavin Baker and Antonio Gracias
- **Date / venue:** Nov 18, 2026. Austin investor conference; Musk joined by video from Shenzhen. Close to 1 hour.
- **URL:** https://www.youtube.com/watch?v=DY8clym2-jQ (verified title: "Elon Musk on Why the Future Should Make You Glad to Be Alive | TomorrowX Summit").
- **Transcript:** YouTube auto-captions. Detailed summary at Dealroom: https://dealroom.co/news/174425-musk-at-tomorrowx-xai-s-rebuilt-training-stack-half-a-gigawatt-of-new-co/ (verified).
- **Key claims:**
  - SpaceX is adding **~0.5 GW of AI compute per month** (~220k GB300s plus networking and cooling, measured at the power plant). He expects **>1 GW per month by end-2027**.
  - Industry estimates for 10 GW are "off by a factor of two": his cost is about **60% of consensus**. Data-centre construction is largely in-house, and Megapacks smooth GPU power swings.
  - xAI training, RL and inference stack rewritten in C/C++ over 6–8 months by former Starlink/Starship software leads. Grok 4.8 is in RL.
  - **Terafab:** a research-fab test chip around **June 2027**; phase-1 volume production toward **end-2028**; ~100M sq ft at full size.
  - Solar-cell capacity aimed at **200 GW/yr** for space. The Starmind compute unit is about ¼ the size of a Vera Rubin NVL72 rack and simpler than Starlink V3.
  - The upper-stage catch was "the final major piece". Full and rapid reuse brings ~100x cheaper access and million-tonne-per-year scale.
- **Why it matters:** The freshest build-rate data, which you can turn directly into ARR and capex. **Relevance 5.** Tags [1][3][4]
- **Updates:** The solar target doubled, from "100 GW/yr each at SpaceX and Tesla" (Feb, #C20) to 200 GW/yr for space.

#### #C4 — NYT DealBook Summit with Andrew Ross Sorkin
- **Date:** Nov 18, 2026. Remote from China. About 47 minutes.
- **URLs:** https://www.youtube.com/watch?v=zWeT91uH7LI (verified, but the title is "Elon Musk Says He's 'Not MAGA'" and it **appears to be a clip, not the full interview**). The full video is on nytimes.com/DealBook (not located). Audio: NYT *The Daily* "Sunday Special: Elon Musk at DealBook" (listing seen on HappyScribe; Spotify/Apple episode links **UNVERIFIED**).
- **Transcript:** Singju Post: https://singjupost.com/?p=65352 (verified). Summaries: TeslaNorth https://teslanorth.com/2026/11/19/musk-dealbook-tesla-spacex-model-y-starlink/ and Dealroom https://dealroom.co/news/174185-musk-at-dealbook-spacex-and-tesla-probably-better-together-anthropic-wan/ (both verified).
- **Key claims:**
  - Tesla and SpaceX would "probably" be better together but don't need to be. A deal needs shareholder votes, which "may or may not succeed" at Tesla. Musk should not vest Tesla awards because of a merger.
  - **Anthropic** rents compute on contracts terminable at 3–6 months' notice. Musk says Anthropic's most likely outcome is an **extra ~10 GW** from SpaceX. That is a possibility, not a signed contract.
  - **Direct-to-cell V2 constellation launches in 2027** with ~40x the bandwidth of V1. **800 MHz** spectrum will be used for rooftop/terrestrial micro-cells, with **production starting in 2027**. He does not expect AT&T or Verizon to go out of business.
  - Space compute will eventually be essentially all compute ("round up to 100%").
  - Starlink revenue funds Starship. Moon and Mars settlement remain the goal, with no new dates.
- **Why it matters:** The latest public stance on the Tesla combination, the Anthropic concentration risk and the plan to become a mobile carrier. **Relevance 4.** Tags [2][3][5]

#### #C5 — *The Builders with Walter Isaacson*, debut episode
- **Date:** Published Oct 20, 2026 (recorded Aug 6, 2026).
- **URL:** https://www.youtube.com/watch?v=AQnwQHMnCrE (**UNVERIFIED**; cited by Dealroom). Audio feed "The Builders" on iHeart: https://www.iheart.com/podcast/1119-the-builders-347224769 (search result, not opened).
- **Transcript:** HappyScribe ("Elon Musk: Humans Won't Be in Control…") and Singju Post: https://singjupost.com/transcript-walter-isaacson-interviews-elon-musk-the-builders-podcast/
- **Key claims:** Mostly AI safety, DOGE regrets, and the claim that AI and robots will have to fix the deficit. Robots plus space could make the economy "potentially a million times" the size of Earth's. Almost no SpaceX operating detail.
- **Relevance 2.** Tags [6]

#### #C6 — All-In Summit 2026: Elon Musk and Gwynne Shotwell
- **Date:** Sep 14–15, 2026 (stage session; released as an All-In episode).
- **URLs:** Podcast (libsyn): https://allinchamathjason.libsyn.com/elon-musk-gwynne-shotwell-on-ai-risks-and-peer-review-starship-terafab-spacextesla-merger (cited by Shortform; **UNVERIFIED**). The video is on the All-In YouTube channel under the title "Elon Musk & Gwynne Shotwell on AI Risks and Peer Review, Starship, Terafab, SpaceX/Tesla Merger" (URL not located; **UNVERIFIED**). Spotify/Apple: All-In feed (episode link not verified).
- **Transcript:** HappyScribe: https://podcasts.happyscribe.com/all-in-with-chamath-jason-sacks-friedberg/tesla-merger (blocked to my fetcher, 403). Summary: Shortform https://www.shortform.com/podcast/episode/all-in-with-chamath-jason-sacks-friedberg-2026-09-15-episode-summary-elon-musk-gwynne-shotwell-on-ai-risks-and-peer-review-starship-terafab-spacex-tesla-merger (verified; contains apparent date errors, see below).
- **Key claims:**
  - Flight 14 is the last uncrewed test before catch attempts on Flight 15. The **first fully reusable orbital flight is expected by early 2027**.
  - Falcon 9's expendable upper stage costs about as much as a mid-size jet. SpaceX plans to **retire Falcon 9 and move customers to Starship** (no date), after ensuring Starliner is covered.
  - Shotwell: Starlink penetration is **1.5–2%** depending on the country. The EchoStar spectrum is for direct-to-cell (rural dead zones). "No drop in demand at all" for compute. Land prices jump from $3k to $180k per acre once data-centre plans are public. "Real estate in space is infinite." A solar-panel factory is being built outside Austin.
  - Terafab: "crawl, walk, run". Reducing ASML dependence is a long-term aim. Musk elsewhere framed the fab as insurance against Taiwan risk.
  - On merging with Tesla, Musk gave a non-answer: "you can imagine what action one might take when there's so much close collaboration." The name "Elon Web Services" was teased.
- **Why it matters:** The best single place to hear Shotwell and Musk together on execution. It is also the first public airing of the merger question, which became the special committees disclosed on the Oct 20 call. **Relevance 5.** Tags [1][2][3][4][5]
- **Caveat:** The Shortform summary says "useful chips in 2025" and "AI satellites in 2024". These are almost certainly transcription or summary errors (probably 2027). Check the audio.

#### #C7 — CFO Bret Johnsen at the Goldman Sachs Communacopia + Technology conference
- **Date:** Sep 10, 2026.
- **URL:** Webcast via SpaceX IR / Goldman (not located; **UNVERIFIED**). Write-up: BGR https://bgr.com/2274086/spacex-reveals-orbital-data-center-faster-expected/ (verified). Stocktwits coverage (403 to my fetcher).
- **Transcript:** Possibly via the IR site or Quartr/AlphaSense. Not checked.
- **Key claims:** A recent hosting deal raised his confidence in **$100B ARR by year-end**. He expects to end **2026 with a little more than 2 GW** and stand up **5–10 GW in 2027**. **First Starmind satellites in 2027.** Flight 14 would be the first revenue Starship flight, carrying production Starlinks. Reported: orbital cost parity "as soon as next year" (single source, unconfirmed).
- **Why it matters:** CFO-level guidance on GW. Compare the "a little more than 2 GW" at end-2026 with Musk's 2.5–3 GW on Oct 20. **Relevance 4.** Tags [3][4][5]

#### #C8 — SpaceX company all-hands address (released publicly)
- **Date:** Aug 11, 2026. About 29 minutes.
- **URL:** SpaceX post on X: https://x.com/SpaceX/status/2087283977866379361 (**UNVERIFIED**; cited by Teslarati). Write-up: https://www.teslarati.com/spacexs-next-trillion-dollar-bet-has-nothing-to-do-with-rockets-musk-tells-staff/ (verified).
- **Transcript:** X auto-captions only. No published transcript found.
- **Key claims:**
  - AI revenue overtakes all other SpaceX lines "probably in September" 2026 and pulls further ahead in Q4.
  - **1.4 GW** of AI compute running. **10 GW by end-2027.**
  - With 10 GW online by end of next year, "**$300–500B a year in revenue**".
  - In 4–5 years AI will be **~99% of SpaceX's value**. SpaceX "must win on AI" to fund Starship and Mars.
- **Why it matters:** The cleanest statement of the GW-to-revenue maths (~$30–50B of revenue per GW-year). **Relevance 5.** Tags [3][5][6]

#### #C9 — *Sean Hannity Show* (radio), Gov. Greg Abbott guest-hosting
- **Date:** Jul 7, 2026 (reported Jul 8). Audio link not located.
- **Write-up:** https://www.kbtx.com/2026/07/09/elon-musk-talks-space-based-ai-with-gov-abbott-national-radio/ (verified).
- **Key claims:** First AI satellites launch "next year" (2027). Texas is supportive.
- **Relevance 1.** Tags [4]

*Context: on Jul 10, 2026 Musk pulled out of a live CNBC Halftime interview (Wapner/Boorstin), billed as his first TV interview since the IPO. I found no reports that it was rescheduled.*

#### #C10 — Gwynne Shotwell, CNBC *Squawk on the Street* (IPO day, from Nasdaq)
- **Date:** Jun 12, 2026. Interviewer: Morgan Brennan.
- **URL:** https://www.cnbc.com/video/2026/06/12/gwynne-shotwell-on-spacex-ai-look-at-ourselves-as-an-infrastructure-companya.html (taken from CNBC's official transcript release; video page not opened).
- **Transcript:** Official CNBC transcript: https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-exclusive-transcript-spacex-president-and-coo-gwynne-shotwell-speaks-cnbcs (verified).
- **Key claims:** SpaceX is "an infrastructure company" building data centres on the ground and soon in orbit. **Full AI-1 satellites launch "late next year" (2027)**, with compute flown first as "canary" sets on some Starlink broadband and mobile satellites. She expects SpaceX to need **less capex than peers** ("I hope we don't have to spend that much money"). She would not endorse the $28.5T TAM and pointed instead to compute demand from digital humans, robots and autonomous vehicles. Retail investors took ~33% of the round. She doesn't want to manage to quarterly earnings.
- **Note:** TeslaNorth quotes Shotwell saying a Tesla combination "might make Elon's life a little easier". **That line is not in the official CNBC transcript**, so treat it as unverified or from another segment.
- **Relevance 4.** Tags [3][4][5]

#### #C11 — (reserved) Shotwell, Fortune/NYT profiles around the IPO
These are secondary profiles, not interviews, and are useful only for background: Fortune Jun 12, 2026 (https://fortune.com/2026/06/12/spacex-ipo-gwynne-shotwell-elon-musk-operator/) and Jun 15, 2026. **Relevance 1.**

#### #C12 — CFO Bret Johnsen interviewed by Gavin Baker (Atreides) at SpaceX Mission Control
- **Date:** ~Jun 8–9, 2026 (pre-pricing). About 48 minutes.
- **URLs:** Shared by Musk on X: https://x.com/elonmusk/status/2064196509780893957 (**UNVERIFIED**). Also on YouTube and the TBPN feed (TBPN: "Gavin Baker: SpaceX might be the greatest company of all time" — https://pocketcasts.com/podcast/tbpn/affe1600-64c6-013d-7b54-0ef99577e22d/gavin-baker-spacex-might-be-the-greatest-company-of-all-time/867b4004-a00c-4722-87b2-63b328380716; this may be a separate Baker appearance, **UNVERIFIED**).
- **Transcript:** Quote fragments on ceointerviews.ai (https://ceointerviews.ai/interview/972472/) and a Podwise summary (https://podwise.ai/episodes/8198041).
- **Key claims:** The first V3 flight was a major success, and ~100 t to LEO is pivotal. AI compute is the next big market and needs Starship. Capital allocation is the hardest part of the job. "10 million customers can become…" (the Starlink growth framing). For context, the same week's S-1/blog numbers: 2025 revenue $18.7B, Starlink $11.4B with $4.4B operating profit, adjusted EBITDA $6.6B, GAAP net loss –$4.9B, Q1-26 revenue ~$5B. *Check these against the S-1.*
- **Relevance 4.** Tags [1][2][3][5]

#### #C13 — "SpaceX AI Satellites": Musk with Ian Dahl (Starlink), moderated by Dan Huot, Starlink factory in Bastrop
- **Date:** Filmed ~Jun 8, posted Jun 9, 2026. About 30 minutes.
- **URL:** https://x.com/elonmusk/status/2064187087184650253 (**UNVERIFIED**; cited by Olhar Digital as Musk's post of the clip).
- **Transcript:** Singju Post: https://singjupost.com/interview-elon-musk-on-spacex-plans-transcript/ (verified; it mislabels the show title).
- **Key claims:**
  - **AI-1 satellite:** 150 kW peak / 120 kW sustained (about one GB300 NVL72 rack). Assumes 250 W/m² of solar and ~1,400 W/m² of double-sided radiators. Radiators are about the size of V3 arrays (~70 m span). Orbit at 600–800 km, ~3 ms latency, ~1 Tbps laser links. Uses mostly V3 Starlink technology.
  - **Space compute ramp (Musk's "best guesses"):** ~**1 GW/yr annualised by end-2027**, **10 GW/yr ~2.5 years out**, **100 GW/yr ~3.5 years out**, then ~1 TW/yr.
  - Solar and AI-satellite production at "reasonable volume" by **end-2027**.
  - Mass to orbit: from ~2,500 t/yr today to **~1M t/yr in ~3 years**. SpaceX already launches ~85–90% of Earth's upmass.
  - **Full Starship reusability "hopefully later this year"** (2026). In time Starship flies "more than once per hour".
  - Terafab ~100M sq ft (~10x Giga Texas). 1 TW/yr ≈ 1B chips at ~1 kW each. Eventually a lunar mass driver.
- **Why it matters:** The official technical underpinning of the orbital-compute part of the valuation. **Relevance 5.** Tags [1][2][4][6]

#### #C14 — IPO roadshow video (CFO Bret Johnsen) and roadshow deck
- **Date:** Jun 4, 2026 (roadshow Jun 3–11; priced Jun 11 at $135; listed Jun 12).
- **URLs:** IR event page: https://ir.spacex.com/events/event-details/2026/Q4-and-Full-Year-2028-Financial-Results/default.aspx (verified; despite the URL slug it is the "IPO Roadshow" event). Deck PDF: https://s21.q4cdn.com/184289198/files/doc_events/SpaceX_IPO_Roadshow_Final.pdf (resolves but is >10 MB, so I could not parse it). Video: an embedded X post (id 2062630481087082874), also on spacexipo.com.
- **Duration:** ~17 minutes. Johnsen is reportedly the only on-screen presenter, although the deck lists Musk, Shotwell and Johnsen.
- **Key claims:** Long-term gross margin target **~70%** (vs 49% in 2025). Net margin **~45%** (vs –26%). Data centres in space. Starlink expansion. Multiplanetary mission. **S-1 TAM: $28.5T** = AI $26.5T (of which enterprise AI $22.7T) + connectivity $1.6T + space $0.37T, excluding China and Russia.
- **Why it matters:** These are the official long-term model targets the market priced the IPO on. **Relevance 5.** Tags [5][6]

#### #C15 — Gwynne Shotwell, TIME cover interview (print, reported from Starbase by Jeffrey Kluger)
- **Date:** Late Mar 2026 (April 2026 issue).
- **URL:** TIME article (syndicated by AOL as "SpaceX's Gwynne Shotwell Aims to Put AI on the Moon": https://www.aol.com/articles/spacexs-gwynne-shotwell-aims-put-110101960.html). Not opened.
- **Key claims:** On the lunar architecture: "we're gunning for 2028" (crewed landing). AI satellites can be put in orbit faster than ground power can be built. The company has ~23,000 employees.
- **Relevance 3.** Tags [1][4]

#### #C16 — Terafab launch event (Seaholm Power Plant, Austin; X livestream)
- **Date:** Mar 21, 2026 (US evening; much coverage dates it Mar 22).
- **URL:** X livestream (exact URL not located; **UNVERIFIED**). Coverage: Fortune https://fortune.com/2026/03/22/musk-terafab-chip-project-tesla-spacex-xai-space-data-center-satellite/ (verified) and SiliconANGLE https://siliconangle.com/2026/03/22/elon-musk-announces-ambitious-20b-terafab-project-manufacture-chips-space-based-ai
- **Key claims:** A joint Tesla / SpaceX / xAI fab. Eventually **1 TW of compute per year**, ~80% for space and ~20% for the ground (100–200 GW/yr of ground chips). 2 nm process. Two chip families: an edge/inference chip for cars, Cybercab and Optimus, and a high-power space chip mostly for xAI/SpaceX. A "mini" data-centre satellite of ~100 kW, with megawatt-class satellites later. **No construction timeline or cost was given**; press estimates put phase 1 at ~$20–25B. Tesla's CFO said Terafab is not in Tesla's 2026 capex plan.
- **Why it matters:** The capex and governance question (how the costs split between Tesla and SpaceX) underlies the merger debate. **Relevance 5.** Tags [4][5]

### B. xAI combination to IPO filing (January–May 2026)

#### #C17 — Moonshots with Peter Diamandis #239 (recorded live at Abundance360) and #247
- **Date:** #239 released ~Mar 17, 2026. #247 (Apr 2026) is a hosts' discussion and may not feature Musk directly.
- **URL:** Pocket Casts episode page (#239): https://pocketcasts.com/podcast/moonshots-with-peter-diamandis/82a3e000-26f8-013b-ef5a-0acc26574db2/elon-musk-optimus-3-is-coming-recursive-self-improvement-is-already-here-and-the-singularity-239/801b20dd-8b22-4fa9-95c0-c28f5f6a359c (403 to my fetcher; **UNVERIFIED**). Moonshots on Apple: https://podcasts.apple.com/us/podcast/moonshots-with-peter-diamandis/id1648228034
- **Key claims:** Mostly Optimus 3 and recursive self-improvement. I could not confirm any SpaceX-specific numbers.
- **Relevance 2.** Tags [6]

#### #C18 — xAI all-hands (first after the SpaceX combination; posted publicly on X)
- **Date:** Held Feb 10, posted Feb 11, 2026. 45 minutes.
- **URL:** xAI post on X (exact URL not captured; **UNVERIFIED**). Write-ups: TechCrunch https://techcrunch.com/2026/02/11/xai-lays-out-interplanetary-ambitions-in-public-all-hands/ (verified) and https://techcrunch.com/2026/02/12/musk-needed-a-new-vision-for-spacex-and-xai-he-landed-on-moonbase-alpha
- **Key claims:** Reorganised into four teams: Grok (with Voice), Grok Code, Imagine, Macrohard. Many founding members left in "restructuring layoffs". A Moon-based factory for AI satellites with a **lunar mass driver**, potentially capturing "a few percent of the sun's energy". X subscriptions ARR just crossed **$1B** (Nikita Bier). XChat and XMoney due within months. **No dates were given for the Moon plans.**
- **Why it matters:** The origin of the "Moonbase Alpha" framing and of the post-merger AI organisation. Useful for judging xAI execution risk. **Relevance 4.** Tags [3][4][6]

#### #C19 — Musk on X: the Moon-first pivot
- **Date:** Feb 8, 2026. A text post, not a video, but strategy-defining.
- **URL:** https://x.com/elonmusk/status/2020640004628742577 (**UNVERIFIED**; cited by Scientific American: https://scientificamerican.com/article/elon-musk-says-spacex-to-prioritize-landing-on-the-moon-instead-of-mars-city/, verified).
- **Key claims:** SpaceX will prioritise a **self-growing city on the Moon, possible within ~10 years**. Mars work resumes in **5–7 years**. The late-2026 Mars window is dropped (WSJ reported the pause). Reports point to an **uncrewed lunar landing targeted for ~March 2027**.
- **Relevance 4.** Tags [1][6]

#### #C20 — Dwarkesh Podcast: "Elon Musk — 'In 36 months, the cheapest place to put AI will be space'" (co-host John Collison; also released on Stripe's *Cheeky Pint*)
- **Date:** Feb 5, 2026. ~2h49m.
- **URLs:** Show page with full transcript and chapters: https://www.dwarkesh.com/p/elon-musk (verified). YouTube: https://youtu.be/BYXbuik3dgA (verified title). Spotify show: https://open.spotify.com/show/4JH4tybY1zX6e5hjCwU6gF (link from the Dwarkesh page; find the Feb 5 episode in the show). Apple show: https://podcasts.apple.com/us/podcast/dwarkesh-podcast/id1516093381 (link from the Dwarkesh page). Cheeky Pint version ("Elon Musk on Space GPUs, AI, Optimus, and his manufacturing method"): https://share.transistor.fm/s/342083e8 (search result, not opened).
- **Transcript:** Official, on dwarkesh.com. Also HappyScribe and Singju Post.
- **Chapters:** 00:00 Orbital data centres · 36:46 Grok and alignment · 59:56 xAI's business plan · 1:17:21 Optimus · 1:30:22 China · 1:44:16 Lessons from running SpaceX · 2:20:08 DOGE · 2:38:28 TeraFab.
- **Key claims:**
  - (00:00) Space becomes the cheapest place for AI in **<36 months, "maybe 30"** (so ~mid/late 2028). Solar in orbit yields ~5x the energy of ground panels and is ~10x cheaper with no batteries. Gas turbines are sold out to 2030.
  - (00:00) In ~5 years SpaceX launches more AI compute each year than the cumulative total on Earth, reaching "a few hundred GW/yr". ~1 TW/yr from Earth before propellant becomes the constraint. **100 GW ≈ 10,000 Starship launches**. A fleet of 20–30 ships could fly 10k launches/yr. **~1M t/yr to orbit in 3–4 years.**
  - (36:46–59:56) Digital human emulation ("Macrohard") is solved by **end-2026**. Public markets have 10–100x the capital of private markets, which was a hint at the IPO rationale.
  - (1:44:16) Musk sets deadlines at about **50% odds**, so expect half to be late. Starship's heat shield has ~40k tiles, the main barrier to full reuse. The goal is flights "like once per hour".
  - (2:38:28) Terafab will cover logic, memory and packaging, targeting **~100 GW of chips by 2030**. Chips are the binding constraint in 3–4 years and power within 1 year. Memory is his biggest worry. SpaceX and Tesla are each building toward 100 GW/yr of solar.
- **Why it matters:** The single best source for why SpaceX and xAI combined and for the orbital-compute thesis. It also sets out the timeline-reliability caveat in Musk's own words. **Relevance 5.** Tags [1][3][4][5][6]

#### #C21 — Davos 2026: "Conversation with Elon Musk" (with Larry Fink)
- **Date:** Jan 22, 2026. ~32 minutes. Musk's first time at the World Economic Forum.
- **URLs:** YouTube: https://www.youtube.com/watch?v=IgifEgm1-e0 (verified title: "Conversation with Elon Musk | World Economic Forum Annual Meeting 2026"). WEF *Meet the Leader* podcast and transcript: https://weforum.org/podcasts/meet-the-leader/episodes/conversation-with-elon-musk-davos-2026 (403 to my fetcher; official). Pocket Casts: https://pocketcasts.com/podcast/meet-the-leader/1f859010-ebfb-0138-e7fa-0acc26574db2/davos-2026-conversation-with-elon-musk/0a19ff21-a109-4aef-9d33-38442077dda8
- **Key claims:** Space will be the lowest-cost place for AI data centres. Full-scale solar-powered space AI is possible **in 2–3 years**. **Full rocket reusability is the major breakthrough target for 2026.** Electricity is the limiting factor: "very soon we'll be producing more chips than we can power". AI smarter than any human "this year" and than all of humanity by ~2030. Robots for everyone.
- **Relevance 4.** Tags [1][4][6]

#### #C22 — Moonshots with Peter Diamandis #220 (Giga Texas, with Dave Blundin)
- **Date:** Recorded/released Jan 6, 2026. ~3 hours.
- **URLs:** Pocket Casts: https://pocketcasts.com/podcast/moonshots-with-peter-diamandis/82a3e000-26f8-013b-ef5a-0acc26574db2/elon-musk-on-agi-timeline-us-vs-china-job-markets-clean-energy-humanoid-robots-220/690e068b-ec76-4fd4-a84f-4958d1eff17e (search result). YouTube on the Peter H. Diamandis channel (URL not located; **UNVERIFIED**).
- **Transcript:** Singju Post: https://singjupost.com/moonshots-220-w-elon-musk-on-agi-abundance-and-the-future-of-humanity-transcript/ (verified).
- **Key claims:** A path to **100 GW/yr** of solar-powered AI satellites, needing ~10,000 Starship flights a year ("a reasonable number"). **~1M t/yr** to orbit at ~100 kW per ton. Then ~1 TW/yr, and ~100 TW/yr with lunar manufacturing and a mass driver. Launch cost must go "**well below $100/kg**". ~9,000 Starlinks; V3 at ~330–350 km. **Orbital refuelling "towards the end of the year"** (2026). Mars by end-2026 is low probability and "a distraction", with **2028–29 "not out of the question"**. A permanently crewed Moon base.
- **Why it matters:** The first full exposition of the 100 GW/yr space thesis, made before the merger. **Relevance 4.** Tags [1][2][4][6]

### C. 2025 landmarks (pre-merger baseline)

#### #C23 — People by WTF (Nikhil Kamath), Ep. 16
- **Date:** Nov 30, 2025. ~2 hours.
- **URL:** Pocket Casts: https://pocketcasts.com/podcast/people-by-wtf/680924f0-28ae-013e-d30a-0eeccf47baff/elon-musk-a-different-conversation-full-episode-people-by-wtf-ep-16/22530117-916f-4a26-b0f1-93ef019ab449 (search result). The YouTube/Spotify versions are on the People by WTF channel (**UNVERIFIED**).
- **Key claims:** Starlink is for rural and underserved users and **cannot beat towers in dense cities** ("simple physics"). He wants India in the 150-country footprint. Work becomes optional in 10–15 years.
- **Why it matters:** A useful counterpoint to the later "become a mobile carrier" stance (#C4). **Relevance 2.** Tags [2][6]

#### #C24 — US–Saudi Investment Forum panel with Jensen Huang (Washington)
- **Date:** Nov 19, 2025.
- **Coverage:** Benzinga / Gulf News / Fortune: https://fortune.com/2025/11/20/saudi-visit-kennedy-center-trump-mbs-huang-musk-1-trillion/ (search result). Video: forum livestream (**UNVERIFIED**).
- **Key claims:** The lowest-cost AI compute in **4–5 years** will be solar-powered AI satellites (single-source report). Space cooling advantage: Huang said ~1.95 of a 2-ton rack is cooling. xAI, Humain and NVIDIA announced a **500 MW** Saudi data centre.
- **Updates:** The "cheapest in space" horizon shortened from **4–5 years (Nov 2025)** to **2–3 years (Jan 2026)** and then **30–36 months (Feb 2026)**.
- **Relevance 3.** Tags [3][4]

#### #C25 — Joe Rogan Experience #2404
- **Date:** Oct 31, 2025. ~3h20m.
- **URLs:** Official JRE YouTube and Spotify (episode URL not located; search "JRE #2404"). Transcript: HappyScribe https://podcasts.happyscribe.com/the-joe-rogan-experience/2404-elon-musk; Singju Post https://singjupost.com/transcript-business-magnate-elon-musk-on-joe-rogan-podcast-2404/
- **Key claims:** SpaceX carries ~90% of global upmass in 2025, mostly Starlink. >500 Falcon landings. Raptor 3 thrust has nearly doubled vs Raptor 1. Starship tests to failure. Starbase incorporated as a city. No hard Mars dates.
- **Relevance 3** (good colour, few numbers). Tags [1][6]

#### #C26 — All-In Podcast: "Elon Musk on DOGE, Optimus, Starlink Smartphones…"
- **Date:** Sep 10, 2025 (days after the ~$17B EchoStar spectrum deal of Sep 8, 2025).
- **Transcript:** Singju Post: https://singjupost.com/transcript-elon-musk-on-doge-optimus-starlink-smartphones-on-all-in-podcast ; HappyScribe: https://podcasts.happyscribe.com/all-in-with-chamath-jason-sacks-friedberg/elon-musk-on-doge-optimus-starlink-smartphones-evolving-with-ai-why-the-west-is-imploding
- **Key claims (by topic; numbers not extracted):** Starlink-native smartphones, the direct-to-cell rationale after EchoStar (50 MHz AWS-4/H-block plus later spectrum). Check the transcript for specifics.
- **Relevance 3.** Tags [2]

#### #C27 — "The Road to Making Life Multiplanetary" (SpaceX Starship/Mars update, Starbase)
- **Date:** Recorded ~May 27, released May 29, 2025.
- **URL:** https://x.com/SpaceX/status/1928185351933239641 (**UNVERIFIED**; cited by secondary sources). Also on spacex.com/updates.
- **Key claims:** Uncrewed Starships to Mars in the **late-2026 window at ~50/50 odds**. Crewed flights possibly 2028–29. ~20 ships in 2028–29, ~100 in 2030–31 and ~500 in 2033. V3/Block-3 ship, Raptor 3, Starship V3 first flight targeted for late 2025. Booster reuse and the ship catch were near-term goals.
- **Track record:** The odds were cut to a "slight chance" (Aug 2025), then "2028 more likely". The 2026 Mars window was **dropped in Feb 2026** (#C19). Starship V3 first flew in 2026, not 2025. **Relevance 4** (the baseline for slippage). Tags [1][6]

#### #C28 — SpaceX all-hands Mars talk, Starbase
- **Date:** Apr 6, 2024 (landmark; widely mirrored, e.g. https://singularityhub.com/2024/04/12/elon-musk-doubles-down-on-mars-dreams-and-details-whats-next-for-spacexs-starship/).
- **Key claims:** A self-sustaining Mars city of ~1M people in 20–30 years. Starship V3 ~200 t reusable. Mars launches in 2026. Later Mars-related claims trace back to this framework.
- **Relevance 2.** Tags [1][6]

#### #C29 — Tesla 2025 Annual Shareholder Meeting
- **Date:** Nov 6, 2025. Transcript: https://singjupost.com/teslas-2025-annual-shareholder-meeting-transcript/
- **SpaceX relevance:** Low. Shareholders split on the advisory proposal for Tesla to invest in xAI; Tesla later invested ~$2B (Jan 2026). This is background to the Tesla–SpaceX overlap debate. **Relevance 1.** Tags [5]

### D. Context only (excluded per brief — the analyst has these transcripts)
- **Q2 2026 earnings call, Aug 4, 2026** (transcript PDF: https://s21.q4cdn.com/184289198/files/doc_financials/2026/q2/SpaceX-Q2-2026-Earnings_Transcript-FINAL.pdf). Musk said Starship could fly **at least once a day "probably a year from now"**. **$1T revenue by 2030** came up. Flight 14 at "end of this month" with an upper-stage catch attempt. Starlink to carry most of the world's internet in 10 years. 1M then 10M t/yr ambition. Q2 capex $18.4B ($15.8B of it AI).
- **Q3 2026 earnings call, Oct 20, 2026.** **2.5–3 GW online by year-end 2026; +10 GW during 2027.** Starship **weekly in H1-27 and 2+ per week by end-2027**. $100B ARR (December run-rate) reaffirmed. Q1-27 revenue guidance $33–37B. Tesla and SpaceX have each formed **independent special committees** on a potential combination.

---

## 3. Targets and timelines Musk (or SpaceX management) has stated, by date

Status as of Nov 25, 2026, based on public sources: **Met** · **Partly met** · **Slipped/walked back** · **Open** · **Unverified**.

| Claim | Date stated | Source | Status (Nov 2026) |
|---|---|---|---|
| Mars city of ~1M people in 20–30 years; Mars launches in 2026 | Apr 2024 | #C28 | Slipped (see below) |
| Uncrewed Starships to Mars in the late-2026 window (~50/50) | May 2025 | #C27 | **Slipped/dropped.** "Slight chance" in Aug 2025; window abandoned for the Moon in Feb 2026 (#C19) |
| Mars crewed / 2028–29 "not out of the question" | Jan 2026 | #C22 | Then Feb 2026: Mars work resumes in 5–7 years (#C19). **Walked back** |
| Moon: "gunning for 2028" crewed landing (Shotwell); uncrewed lunar landing ~Mar 2027 (reports); Moon city within ~10 years | Feb–Mar 2026 | #C15, #C19 | Open |
| Cheapest place for AI is space within 4–5 yrs → 2–3 yrs → <36 months (~30) | Nov 2025 → Jan 2026 → Feb 2026 | #C24, #C21, #C20 | Open (implies ~mid/late 2028). The S-1 says orbital compute "as early as 2028". Bank models (MS/DB/SemiAnalysis, per press) say 2031–late 2030s |
| Full Starship reusability is the 2026 breakthrough; "hopefully later this year" | Jan & Jun 2026 | #C21, #C13 | **Partly met.** Ship 42 caught from orbit on **Nov 14, 2026** (Flight 15), but the booster was lost in the Gulf and neither stage has reflown. Reflight now "early 2027" (#C6) |
| Upper-stage catch on Flight 14, "end of August" | Aug 4, 2026 | Q2 call | **Slipped ~3 months.** Flight 14 reached orbit (~Oct) without a catch; the catch came on Flight 15 (Nov 14) |
| Orbital propellant refuelling by end-2026 | Jan 2026 | #C22 | **Slipping.** Reports now say early 2027 |
| Starship ≥1 flight/day "probably a year from now" | Aug 4, 2026 | Q2 call | **Walked back** on Oct 20 to weekly (H1-27) → 2+ per week (end-2027). Open |
| ~1M t/yr to orbit in ~3 (3–4) years; ~10k launches/yr capability | Feb & Jun 2026 | #C20, #C13 | Open (~2029). ~2,500 t/yr today |
| Launch cost below $100/kg, possibly within 2–3 years | Jan & Nov 2026 | #C22, #C1 | Open |
| Ground AI compute: 1.4 GW now → 10 GW by end-2027 | Aug 11, 2026 | #C8 | Open |
| Ground compute: a little more than 2 GW at end-2026; 5–10 GW in 2027 (CFO) | Sep 10, 2026 | #C7 | Raised on Oct 20 to **2.5–3 GW at YE26 and +10 GW in 2027**. Open; check on the Q4 call |
| +0.5 GW/month now; >1 GW/month by end-2027 | Nov 18, 2026 | #C3 | Open. Implies ~3+ GW at end-2026 if the pace holds |
| 10 GW online → $300–500B/yr revenue | Aug 11, 2026 | #C8 | Open |
| AI revenue overtakes all other segments "probably in September" 2026 | Aug 11, 2026 | #C8 | **Unverified.** Check the Q3 segment split |
| **$100B ARR by Dec 2026** (December run-rate) | Aug 2026 onward; repeated Sep, Oct, Nov | Q2 call, #C7, #C1 | Open. Reported compute contracts alone ~$46B ARR (Anthropic $1.25B/month, Google $920M/month, among others, per press) |
| ~$500B ARR in Dec 2027 ("best guess") | Nov 6, 2026 | #C1 | Open |
| $1T revenue by 2030 (Q2 call) / $1T ARR at ~2% odds by Dec 2027 | Aug & Nov 2026 | Q2 call, #C1 | Open |
| AI ~99% of SpaceX value in 4–5 years | Aug 11, 2026 | #C8 | Open (not falsifiable near term) |
| Digital human emulation / Macrohard solved by end-2026 | Feb 2026 | #C20 | Open; looks likely to miss |
| AI satellites: "reasonable volume" by end-2027; first full AI-1 sats "late next year"; Starmind first launch **Q3 2027**, big in 2028, very large in 2029 | Jun–Nov 2026 | #C13, #C10, #C9, #C7, #C1 | Open. Consistent across sources since June |
| Space compute 1 GW/yr (end-2027) → 10 GW/yr (~late 2028) → 100 GW/yr (~late 2029) → ~1 TW/yr | Jun 9, 2026 | #C13 | Open |
| Terafab: 1 TW/yr of compute, ~80% space; ~100 GW of chips by 2030; test chip ~Jun 2027; phase-1 volume ~end-2028 | Feb, Mar, Nov 2026 | #C20, #C16, #C3 | Open. No cost or schedule was given at launch |
| Solar cells: 100 GW/yr each at SpaceX and Tesla → 200 GW/yr for space | Feb → Nov 2026 | #C20, #C3 | Open |
| Starlink V3: ~100x bandwidth in 2–3 years; V4 another 10x; majority of world internet in 10 years | Aug & Nov 2026 | Q2 call, #C1 | Open. First V3s launched on Starship (26 on Flight 15) |
| Direct-to-cell V2 constellation in 2027 (~40x V1); 800 MHz micro-cells in production in 2027 | Nov 18, 2026 | #C4 | Open |
| Long-run margins ~70% gross / ~45% net | Jun 4, 2026 | #C14 | Open |
| Tesla combination: "probably better together"; special committees formed | Sep → Oct → Nov 2026 | #C6, Q3 call, #C4 | Open. No terms or timeline |

**Reading the track record.** Musk said himself on Dwarkesh (#C20) that he sets deadlines at about 50% odds. The 2026 pattern fits that:
- **Hardware milestones slip by roughly one to two quarters.** The ship catch came ~3 months later than the Q2-call promise; full reuse slipped from "2026" to "early 2027"; refuelling slipped from "end-2026" to "early 2027".
- **Mars dates slip by full launch windows.**
- **Cadence promises get walked back within a quarter.** "Daily within a year" in August became "weekly → 2x weekly in 2027" in October.
- **Compute build-out guidance has so far been raised, not cut** (CFO >2 GW in September → 2.5–3 GW in October), as has the solar target.
- **The orbital-compute dates have been stable since June** (first launches in 2027, ramp in 2028–29). They will be the key test of credibility next year.

---

## 4. Notes on source quality

1. **Official / primary (highest weight):** the IR roadshow page, deck and video (#C14); the earnings-call transcripts on q4cdn (excluded); the dwarkesh.com official transcript (#C20); the CNBC official Shotwell transcript (#C10); the WEF transcript (#C21); and SpaceX/Musk X posts (#C8, #C13, #C19). X-hosted video is the main source for SpaceX's own interviews, but my fetcher could not load X, so those links are marked UNVERIFIED and should be clicked through.
2. **Full recordings on YouTube or podcasts (high weight, but check exact wording):** Dwarkesh, TomorrowX, Davos, JRE, All-In, Moonshots, Isaacson. YouTube auto-captions are the fallback transcript.
3. **Third-party transcripts (medium):** Singju Post, HappyScribe, TeslaNorth's "full transcript" of the Baron chat. They are complete but say they are not checked word for word, and misheard numbers are common (e.g. "$0.25–30/W", "GV300" for GB300, the "radical" vs "rack" confusion in #C13).
4. **Secondary write-ups (use for orientation only):** TeslaNorth, Teslarati, Dealroom news, Basenor, Shortform, Podwise, Blockchain.news, Stocktwits. Several are AI-generated summaries with clear errors. Example: Shortform's All-In summary says "AI satellites in 2024" and "useful chips 2025". Basenor's financial table has no linked filing. **Never cite a number to a client from these without checking the recording or the S-1/10-Q.**
5. **Mainstream press (good for dates and context, light on numbers):** Fortune, TechCrunch, CNBC, NYT/DealBook, Bloomberg, Reuters, Scientific American, Space.com.
6. **Clips vs full sessions:** The DealBook YouTube link (#C4) is a clip. Get the full session from NYT or *The Daily* feed. Many "Musk says…" YouTube uploads from fan channels are cut-downs with no context. Prefer the host's own channel.
7. **Attribution traps:** Ron Baron's valuation figures, Gavin Baker's framing, Palihapitiya's capex estimates and Dwarkesh's launch maths are sometimes reported as Musk's claims. In this guide, bullets attribute them to the person who said them.
8. **Gaps I could not close:**
   - the Goldman Communacopia webcast and transcript (#C7)
   - the full roadshow deck, which is >10 MB and could not be parsed
   - episode-level Spotify links: I give show links, and the episode can be found by its date
   - the YouTube URLs for All-In Summit 2026 and Moonshots #220/#239
   - whether Musk ever rescheduled the July 10 CNBC interview

   Quartr or AlphaSense (both list SPCX events) are the fastest way to get the CFO conference transcripts.
