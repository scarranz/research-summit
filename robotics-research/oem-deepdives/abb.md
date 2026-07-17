## ABB Robotics (ABBN SW → SoftBank) — Deep-Dive

### 1. Snapshot

**Lineage.** ABB Robotics descends from **ASEA's IRB 6 (1974, Västerås, Sweden)** — the world's first all-electric, microprocessor-controlled industrial robot (Intel chipset, 5 axes, 6 kg payload; designed by Björn Weichbrodt et al.); ~1,900 units sold 1975–1992 [I]. ASEA (Sweden) merged with **Brown, Boveri & Cie (BBC, Switzerland)** in 1988 to form ABB [I]. This is an electrical-engineering conglomerate that grew up around the "electrical brain" — drives, motors, controllers, motion software — rather than around mechanical servo/gear integration [INF].

**Where Robotics sits.** Historically one of ABB's four business areas ("Robotics & Discrete Automation"). In the sale, the **Machine Automation unit (B&R)** is separated out and moved into ABB's **Process Automation** area; only the robotics business proper (industrial robots, cobots, AMRs) goes to SoftBank [D].

**Division economics (FY2024).** Revenue **~$2.3bn (~7% of ABB group)**; **~7,000 employees**; **Operational EBITA margin 12.1%** — materially below the group's high-teens level, a stated driver of the divestiture [D/I]. **Global #2** industrial-robot maker by position (behind FANUC) [I]; **>400,000 robots installed across 53 countries**, >50,000 in North America [C]. HQ/US factory: **Auburn Hills, Michigan** [D].

**SoftBank transaction (announced 8 Oct 2025).** SoftBank Group agreed to acquire **100%** of ABB's carved-out robotics holding company for **USD 5.375bn** [D]. ABB expects **~$5.3bn cash proceeds**, a **~$2.4bn pre-tax book gain**, **~$200m separation cost** (~half in 2025 guidance) and **$400–500m transaction tax outflows** [D]. Subject to regulatory approvals in the **EU, China and US**; **expected close mid-to-late 2026** [D]. This **replaces ABB's April 2025 plan to spin the division off as a separately listed company** (which had been prompted by sharply falling orders/revenue 2023→early-2025) — SoftBank's cash bid was judged superior [I]. Division president **Sami Atiya** exits (off the executive committee by Dec 2025; departs by end-2026) [I]. SoftBank's rationale: fold ABB into its **"Physical AI" / ASI** thesis and its **Robo Holdings** portfolio (AutoStore, Berkshire Grey, Agile Robots, Skild AI) — an industrial-robotics backbone for embodied AI [I].

### 2. Source of competitive advantage

Ranked, most-to-least decisive:

1. **Electrical/controls heritage + software (RobotStudio).** ABB's edge is the "electrical brain": IRC5/OmniCore controllers, motion control, **RobotStudio** offline simulation (widely regarded as best-in-class for programming/commissioning virtually before deployment), plus SafeMove and ABB Ability digital services [C/I]. This is a genuinely differentiated software moat, not a mechanical one [INF].
2. **Automotive & general-industry installed base + breadth of range.** Decades as a top automation supplier to automotive (body-in-white, welding) and an unusually **broad portfolio** — from large 6-axis arms to **paint robots** (a strong niche, incl. the sensor-equipped Connected Atomizer), the **YuMi collaborative robot** (2015, "first truly collaborative" dual-arm cobot, IRB 14000), and **AMRs** (via the 2021 **ASTI Mobile Robotics** acquisition, $191m) [C/I]. Range breadth + switching costs in installed lines are the durable part [INF].
3. **Global service and three-continent manufacturing** (below) give proximity to Western OEMs [INF].

The advantage is **integration/systems + software**, not component mastery — the opposite of the Japanese servo houses [INF].

### 3. Supply chain structure

**Vertical integration: partial, and asymmetric.** ABB is **deeply integrated on the electrical side** — it is one of the world's largest makers of **electric motors and drives** (ABB Motion), and it builds its own **controllers and motion software** in-house [D/INF]. But it is **much less mechanically integrated than FANUC/Yaskawa/Nabtesco-style houses**: it **buys the core precision gearing merchant** (RV and strain-wave reducers) rather than making it at scale, though it has begun using **in-house cycloidal designs in specific models** [I/INF]. Net: **makes** the brain (motors, drives, controllers, software); **buys** the precision joints, machine vision, and force-torque sensing [INF].

**Manufacturing footprint — three regional hubs** [D/I]:
- **Shanghai "mega factory"** — 67,000 m², ~$150m, opened Dec 2022, "robots making robots," serves Asia (largest single robot market; also ABB's most exposed front vs Chinese competition).
- **Auburn Hills, Michigan** — 538,000 ft², serves the Americas.
- **Västerås, Sweden** — European hub, historic home; ~$280m expansion announced 2023.
- ~$450m invested across the three sites since 2018.

**Under SoftBank.** As a stand-alone, SoftBank-owned asset it loses ABB group's motor/drive captive supply and procurement scale, but gains SoftBank's capital and its **Physical-AI software stack** [INF]. Expect continuity near-term (regulatory close mid/late-2026) and a likely software/AI-forward repositioning; the China factory's role amid domestic-share loss is the key open question [INF].

### 4. Key suppliers (named)

| Component | Supplier(s) named | In-house / merchant | Source |
|---|---|---|---|
| **Precision reducers — large joints (RV/cycloidal)** | **Nabtesco** (global RV leader, ~60% share) | Merchant; ABB ~1.47% of Nabtesco revenue (2nd-largest Nabtesco customer after FANUC 2.35%); some **in-house cycloidal** in specific ABB models | [I] SPLC / [I] trade |
| **Precision reducers — small joints (strain-wave)** | **Harmonic Drive Systems** | Merchant | [INF]/[I] |
| **Electric motors (servo)** | ABB (ABB Motion) | Largely **in-house** — core competency | [D]/[INF] |
| **Drives / servo amplifiers** | ABB | **In-house** | [D]/[INF] |
| **Controllers & motion software (OmniCore/IRC5, RobotStudio)** | ABB | **In-house** — key differentiator | [C]/[INF] |
| **Machine vision** | **Cognex** | Merchant — ABB **"Integrated Vision" is rebadged Cognex** (In-Sight cameras with ABB firmware; won't work with standard Cognex units) | [I] |
| **Force/torque sensing** | **ATI Industrial Automation** | Merchant | [I] (per anchor / industry standard) |
| **Bearings** | (not individually disclosed; likely NSK/NTN/JTEKT/SKF-class) | Merchant | [INF] |
| **Power semiconductors (IGBTs) for drives** | **Merchant** since exit — e.g. Hitachi Energy / Infineon-class | Merchant (formerly in-house) | [D]/[INF] |
| **Rare-earth magnets (servo motors)** | Not disclosed; NdFeB, China-dominated supply | Merchant | [INF] |

**Semis exit detail:** ABB's high-power semiconductor operation went to Hitachi inside the **Power Grids** divestiture — **80.1% sold in 2020** (EV ~$11bn for 100%; $6.85bn for the 80.1% stake), remaining **19.9% sold 2022**. Those IGBT lines now sit in **Hitachi Energy** [D/I]. ABB therefore **buys the power silicon inside its own drives merchant** [INF].

### 5. What makes ABB DIFFERENT (comparison hooks)

1. **"Integrator/electrical-systems house," not a servo house.** Unlike **FANUC and Yaskawa** (vertically integrated down to servomotors, drives *and* — for FANUC — even its own reducers/CNC), ABB's moat is **controllers + RobotStudio software + range breadth + services**, while it **buys precision gearing merchant** (Nabtesco/Harmonic). Closer in DNA to **KUKA** (also a Western integrator that buys Japanese reducers) than to the Japanese [INF].
2. **The semiconductor exit.** ABB deliberately **left power-semis** (to Hitachi, 2020/22) — the opposite of the vertical-integration-down-the-stack instinct; it now sources the silicon at the heart of its own drives [D/INF].
3. **Now a SoftBank-owned stand-alone (mid/late-2026).** Uniquely among the majors, ABB Robotics is being **severed from its industrial-conglomerate parent** and folded into a financial owner's **Physical-AI/ASI** portfolio — a governance and strategy discontinuity none of FANUC/Yaskawa/Kawasaki/Estun face; KUKA's precedent is being bought by China's Midea (2016) [D/I].
4. **Breadth beyond arms** — one of the few majors spanning industrial arms + **paint** (a genuine niche lead) + **cobots (YuMi)** + **AMRs (ASTI)** — vs the more arm-centric Japanese [C/INF].

### 6. Company-specific bear case / risks

- **Divestiture / ownership uncertainty.** Deal doesn't close until **mid-to-late 2026** and needs **EU, China and US** clearances (China review is non-trivial given a Japanese acquirer and a Shanghai factory) [D/INF]. Integration into SoftBank — whose robotics track record (Boston Dynamics sold to Hyundai; Pepper) is mixed — is unproven [I].
- **Sub-scale in mechanics.** No captive precision-reducer supply at scale means **structural dependence on Nabtesco/Harmonic** — cost and lead-time disadvantage vs FANUC's integrated stack, and exposure to a two-supplier Japanese chokepoint [INF].
- **China competition (the acute risk).** Domestic brands took **>51.6% of China in 2024 (56.2% by Q3-2025)**; **Estun (~9.5%) and Inovance (~8.8%)** now rival foreign leaders in China, undercutting on price and delivery speed where ABB "cannot match" [I]. ABB's largest growth market is where it is losing share fastest [INF].
- **Cyclicality & margin gap.** Robotics is capex-cyclical; orders/revenue "**fell sharply 2023→early-2025**," and the **12.1% margin** trailed the group — the very reason ABB sold [D/I]. As a stand-alone it loses group procurement/motor-drive synergies [INF].

### Sources

- ABB press release, "ABB to divest Robotics division to SoftBank Group" — https://new.abb.com/news/detail/129685/abb-to-divest-robotics-division-to-softbank-group
- SoftBank Group press release / PDF, "Acquisition of ABB Ltd's Robotics Business" (8 Oct 2025) — https://group.softbank/en/news/press/20251008 · https://group.softbank/media/Project/sbg/sbg/news/press/2025/20251008/pdf/20251008_en.pdf
- The Robot Report, "ABB Group sells ABB Robotics to SoftBank for $5.375B" — https://www.therobotreport.com/abb-group-sells-abb-robotics-softbank-5-3b/
- Morrison Foerster, deal advisory note ($5.375bn) — https://www.mofo.com/resources/news/251008-morrison-foerster-advises-softbank
- CNBC, "SoftBank to buy ABB robotics unit for $5.4 billion" — https://www.cnbc.com/2025/10/08/softbank-to-buy-abb-robotics-unit-for-5point4-billion-in-ai-push.html
- TechCrunch, "SoftBank bulks up its robotics portfolio…" — https://techcrunch.com/2025/10/08/softbank-bulks-up-its-robotics-portfolio-with-abb-groups-robotics-unit/
- ABB news, "ABB plans to spin off its robotics division" (Apr 2025) — https://new.abb.com/news/detail/125281/
- ABB news, Shanghai mega factory — https://new.abb.com/news/detail/97670/ · https://new.abb.com/news/detail/9410/
- ABB news, Auburn Hills expansion — https://new.abb.com/news/detail/100845/ ; Västerås $280m — https://new.abb.com/news/detail/107115/
- ABB / Automate on YuMi (2015) — https://www.automate.org/robotics/news/abb-introduces-yumi-world-s-first-truly-collaborative-dual-arm-robot
- ABB Integrated Vision (rebadged Cognex) — https://library.e.abb.com/public/e96516866ecc466ebedc25fbd7937aa6/ABB+Integrated+Vision_20240125.pdf ; robot-forum threads — https://www.robot-forum.com/robotforum/thread/43327-integrated-vision-with-detachable-cognex-cameras/
- Nabtesco RV reducers / OEM customer base — https://www.nabtesco.com/en/products/robot/ · https://www.jaredwatkins.com/research/robotics/actuators/nabtesco/
- ABB→Hitachi Power Grids & semiconductors divestiture — https://new.abb.com/news/detail/64657/ · https://new.abb.com/news/detail/98507/
- China market share (FANUC/Estun/Inovance; domestic >51.6%) — https://www.evsint.com/china-industrial-robot-manufacturers/
- IRB 6 / ASEA history — https://www.historyofinformation.com/detail.php?entryid=4352 · https://library.e.abb.com/public/44ef07ec2d252e1fc1256b6b005b93f6/25%20years%20of%20ABB%20robots.pdf
- Asian Robotics Review, "ABB Bails on Robotics! Why?" — https://asianroboticsreview.com/home755-html
