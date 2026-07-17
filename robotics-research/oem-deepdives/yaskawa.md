## Yaskawa Electric (6506 JP) — Deep-Dive

### 1. Snapshot
- **HQ / lineage:** Kitakyushu, Fukuoka, Japan. Founded **1915** as an electric-motor maker; trademarked the term **"mechatronics" in 1969** (granted 1972); launched the **Motoman** industrial-robot line in the mid/late-1970s (arc-welding robots since ~1975). [D/I] ([Wikipedia](https://en.wikipedia.org/wiki/Yaskawa_Electric_Corporation), [Yaskawa servo history](https://www.yaskawa-global.com/product/servomotor/history))
- **Ownership:** Public, listed Tokyo & Fukuoka exchanges; **Nikkei 225** constituent. Dispersed institutional base (Meiji Yasuda Life, domestic asset managers named among holders) — no controlling family/strategic block. [I] ([MarketScreener](https://www.marketscreener.com/quote/stock/YASKAWA-ELECTRIC-CORPORAT-6492333/company/))
- **Latest FY (FY2025, ended ~28 Feb 2026, IFRS):** Revenue **¥542.1bn (+0.8%)**, operating profit **¥47.3bn (−5.7%)**, **op margin 8.7%**, net income **¥35.2bn (−38.2%)**. [D] ([FY2025 earnings call summary](https://finance.biggo.com/news/JP_6506.T_2026-04-10); primary: [Yaskawa 4Q script](https://www.yaskawa-global.com/wp-content/uploads/2026/04/254Q_script_E.pdf))
- **Segment mix (FY2025 revenue):** Motion Control **¥236.1bn (~44%)**, Robotics **¥247.0bn (~46%)**, System Engineering **¥38.7bn (~7%)**, Other ¥20.3bn. Segment op margins: Motion Control 10.3%, Robotics **8.3%** (compressed by low-value-add China/Asia projects), System Engineering 12.9%. [D] ([BigGo](https://finance.biggo.com/news/JP_6506.T_2026-04-10))
- **FY2026 guidance:** Revenue ¥580bn (+7.0%), op profit **¥60bn (+26.8%)**, margin 10.3%; Q4 FY2025 orders **+20% YoY** on AI/semiconductor demand. [D]
- **Share:** ~**#1–2 global robot servo supplier (~21% robot-servo share)**; **~16% global AC-servo-drive share**; cumulative AC-servo-motor shipments **>20 million units**. Top-4 global industrial-robot maker. [I/C] ([Yaskawa 20M-unit release](https://www.yaskawa-global.com/newsrelease/news/36529))
- **Employees:** **~14,709**. [I] ([Wikipedia/GlobalData](https://en.wikipedia.org/wiki/Yaskawa_Electric_Corporation))

### 2. Source of competitive advantage
Ranked by what matters most:

1. **World-class servo/drive/mechatronics stack, fully in-house.** Yaskawa designs and builds the entire motion-electrical loop itself — servomotors, servo amplifiers/drives, **23-bit absolute encoders**, controllers, and motion software (Sigma-7/Sigma-X families) — using proprietary serial protocols. This is the deepest electronic integration of the six majors and the root of both its robot and its merchant businesses. [D/I] ([Yaskawa Sigma-7](https://www.yaskawa-global.com/product/servomotor), [YASKAWA Report 2025](https://www.yaskawa-global.com/wp-content/uploads/2025/09/YR2025E_A4.pdf))
2. **"Arms-dealer" merchant Motion Control business.** Yaskawa sells the same servos/inverters **merchant into other people's machines** — semiconductor manufacturing equipment, chip mounters/module-mounting, machine tools, plus inverters into US datacenter air-conditioning and solar power conditioners. This is a **picks-and-shovels position independent of its own robots**; Motion Control is guided to **~¥280bn revenue in FY2026 (≈ +19% YoY)** at a **15% op margin** on AI/semiconductor tailwinds. [D/I] ([BigGo call](https://finance.biggo.com/news/JP_6506.T_2026-04-10), [Yaskawa servomotor applications](https://www.yaskawa-global.com/product/servomotor), [Morningstar](https://www.morningstar.com/company-reports/1216576-semiconductor-applications-to-drive-yaskawas-medium-term-growth-in-robots-and-servo-motors))
3. **Arc-welding robot leadership.** Motoman is a long-standing leader in robotic arc-welding cells (welding robots since ~1975) — a defensible application niche where its servo control is a direct advantage. [I] ([Robots Done Right](https://robotsdoneright.com/Articles/yaskawa-motoman-arc-welding-robots.html))

The distinctive point: **Yaskawa's moat is electronic, not mechanical.** Unlike FANUC (which owns the servo-and-reducer-adjacent CNC franchise) or the reducer duopoly, Yaskawa's edge is the motion-control silicon-and-software loop, monetized twice — inside its robots and merchant into everyone else's equipment.

### 3. Supply-chain structure
- **Highest electronic vertical integration of the six.** Yaskawa makes its own motors, drives, amplifiers, encoders, controllers and motion software in-house — it does **not** outsource the electrical loop the way most robot OEMs do. [D/INF]
- **What it buys:** the two things it structurally cannot make — **precision reducers** (RV + strain-wave) and **rare-earth permanent magnets** — plus commodity semiconductors, bearings, and application-layer peripherals (vision, force-torque). [D/INF]
- **Dual role — OEM and merchant.** The same Motion Control components are (a) consumed internally by Robotics and (b) **sold merchant** to third-party equipment makers. This makes Yaskawa simultaneously a robot OEM and a **Tier-1 component supplier to its own industry's supply chain** — a structure none of ABB/KUKA/Kawasaki share, and only partially shared with FANUC. [D/INF]
- **Manufacturing footprint:** Japan (core; Kitakyushu region), **China** (incl. Changzhou — robot & servo production for Asia), **Kočevje, Slovenia** (main European robotics base — a €25m plant opened 2019 plus a further €32m distribution/production investment; targeted to process ≥80% of EMEA Motoman orders by FY2027), and the **US** (Yaskawa America, Ohio-based operations). [D/I] ([Slovenia.si](https://slovenia.si/business-and-innovation/yaskawas-production-is-fully-operational), [GOV.SI Kočevje 2026](https://www.gov.si/en/news/2026-07-02-yaskawa-makes-kocevje-its-leading-european-robotics-base-with-new-investment/))

### 4. Key suppliers (named)
| Component | Supplier(s) named | In-house or merchant | Source-grade |
|---|---|---|---|
| **Precision reducers — RV (proximal/large joints)** | **Nabtesco** | Merchant (bought) | [I] ([Nabtesco robot page](https://www.nabtesco.com/en/products/robot/); Bloomberg SPLC anchor) |
| **Precision reducers — strain-wave (wrist/small joints)** | **Harmonic Drive Systems** | Merchant (bought) | [D/I] (Motoman spare-part listings, e.g. [R-axis harmonic drive](https://industrialrobotix.com/robot-parts/motoman-robot-parts/motoman-rv-reducers/hw9380623-a-motoman-yaskawa-r-axis-harmonic-drive-for-sk16-mrc/)) |
| Servomotors | **Yaskawa (in-house)** | In-house | [D] |
| Servo drives / amplifiers | **Yaskawa (in-house)** | In-house | [D] |
| Encoders (23-bit absolute) | **Yaskawa (in-house)** | In-house | [D] ([Sigma-7](https://www.yaskawa-global.com/product/servomotor)) |
| Robot controllers / motion software | **Yaskawa (in-house)** | In-house | [D] |
| Machine vision | **Cognex** (via **MotoSight**; Cognex In-Sight sensors) | Merchant/partner | [D] ([Automate MotoSight](https://www.automate.org/products/yaskawa-america/motosight-2d)) |
| Force/torque sensing | **ATI Industrial Automation** (6-axis F/T, Smart Pendant integration) | Merchant/partner | [D] ([ATI-Yaskawa](https://www.ati-ia.com/YaskawaFTsw)) |
| Rare-earth magnets (NdFeB) | Not individually disclosed; **China-sourced** rare-earth supply chain (China refines ~90% of Nd/Dy) | Bought | [INF/I] (industry structure; no named Yaskawa contract found) |
| Bearings / semiconductors | Not individually disclosed | Bought | [INF] |

**The reducer split is the tell:** even as the **most electronically integrated** of the six, Yaskawa **still cannot make the precision reducer** and buys from the Nabtesco/Harmonic duopoly — it simply buys *less* per robot because it self-supplies everything else. Bloomberg SPLC shows Yaskawa as **Nabtesco's smallest major-OEM customer at ~0.88% of Nabtesco revenue** (FANUC 2.35, ABB 1.47, Kawasaki 1.35, KUKA 1.31). [D — SPLC, team anchor]

### 5. What makes Yaskawa DIFFERENT (comparison hooks)
1. **Most electronically integrated of the six** — owns motor + drive + encoder + controller + software end-to-end; its moat is silicon/software, not gearing. [D/INF]
2. **Only true "arms-dealer" among the pure robot OEMs** — Motion Control sells servos/inverters merchant into semiconductor equipment, chip mounters, machine tools and datacenter/solar, a growth engine (~+19% FY2026) **decoupled from its own robot cycle**. [D]
3. **Smallest Nabtesco customer despite highest integration** (~0.88% of Nabtesco rev) — the paradox that proves the reducer chokepoint is universal: integration reduces reducer *volume per robot*, not the *dependence*. [D]
4. **Arc-welding franchise leader** (Motoman) — an application moat few peers match. [I]

### 6. Company-specific bear case / risks
- **Reducer dependence persists.** No credible in-house RV/strain-wave path; remains a price/allocation taker to Nabtesco + Harmonic despite everything else being in-house. [INF]
- **China servo erosion.** Domestic Chinese brands now hold ~57% of China's servo-system market; **Inovance leads at ~26–28% share**, ranking ahead of Yaskawa/Mitsubishi in-country, with 2025 revenue ~¥42bn RMB (+22% vs ~6% sector). This threatens Yaskawa's servo share in its largest growth market and pressures Robotics margins (already down to 8.3% on low-value-add China projects). [I] ([MatrixBCG / Inovance landscape](https://matrixbcg.com/blogs/competitors/inovance))
- **Cyclicality / concentration in semiconductor capex.** The FY2026 upgrade rides AI/semiconductor and datacenter demand — a sharp, mean-reverting cycle; a semi-capex downturn hits both Motion Control (merchant) and Robotics simultaneously. [INF]
- **Rare-earth / China input exposure.** NdFeB magnet supply concentrated in China (~90% of refining) — a supply-security and cost risk on the one motor input it must buy. [I]
- **FX.** Large export/overseas base; yen strength compresses translated revenue and reported margin. [INF]

### Sources
- Yaskawa FY2025 4Q earnings script (primary): https://www.yaskawa-global.com/wp-content/uploads/2026/04/254Q_script_E.pdf
- Yaskawa FY2025 4Q Q&A: https://www.yaskawa-global.com/wp-content/uploads/2026/04/254Q_QA_EN.pdf
- FY2025 full-year earnings call summary (segments, FY2026 guidance): https://finance.biggo.com/news/JP_6506.T_2026-04-10
- YASKAWA Report 2025: https://www.yaskawa-global.com/wp-content/uploads/2025/09/YR2025E_A4.pdf
- Yaskawa servomotor product/applications & history: https://www.yaskawa-global.com/product/servomotor ; https://www.yaskawa-global.com/product/servomotor/history
- Yaskawa 20M-unit AC servo milestone: https://www.yaskawa-global.com/newsrelease/news/36529
- Wikipedia — Yaskawa Electric (founding, employees, ownership): https://en.wikipedia.org/wiki/Yaskawa_Electric_Corporation
- Morningstar — semiconductor demand driving Yaskawa robots & servos: https://www.morningstar.com/company-reports/1216576-semiconductor-applications-to-drive-yaskawas-medium-term-growth-in-robots-and-servo-motors
- Nabtesco robot reducers: https://www.nabtesco.com/en/products/robot/ ; Motoman harmonic-drive spare part: https://industrialrobotix.com/robot-parts/motoman-robot-parts/motoman-rv-reducers/hw9380623-a-motoman-yaskawa-r-axis-harmonic-drive-for-sk16-mrc/
- MotoSight (Cognex) vision: https://www.automate.org/products/yaskawa-america/motosight-2d
- ATI force/torque for Yaskawa: https://www.ati-ia.com/YaskawaFTsw
- Kočevje/Slovenia footprint: https://slovenia.si/business-and-innovation/yaskawas-production-is-fully-operational ; https://www.gov.si/en/news/2026-07-02-yaskawa-makes-kocevje-its-leading-european-robotics-base-with-new-investment/
- Inovance China servo competitive landscape: https://matrixbcg.com/blogs/competitors/inovance
- Bloomberg SPLC reducer-customer data (Yaskawa ~0.88% of Nabtesco rev) — team anchor, not independently re-verified here.
