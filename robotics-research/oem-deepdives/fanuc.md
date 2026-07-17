## FANUC (6954 JP) — Deep-Dive

### 1. Snapshot
- **HQ / lineage:** Oshino-mura, Yamanashi Prefecture, at the foot of Mt. Fuji. Founded 1955 as the numerical-control division of **Fujitsu** under engineer **Dr. Seiuemon Inaba**; spun out as an independent company in 1972. "FANUC" = *Fuji Automatic Numerical Control*. Still Inaba-led (Dr. Yoshiharu Inaba, chairman/CEO lineage), but the family is culturally influential, **not** a controlling shareholder. [D/I]
- **Ownership:** No controlling shareholder — fragmented institutional base. Foreign institutions (BlackRock, Vanguard, State Street, JPMorgan et al.) hold ~45% of shares; institutions ~70% total. Conservative **net-cash** balance sheet; ~60% total-payout target (dividends + buybacks). [I — secondary/aggregator sources, directionally reliable]
- **Latest FY (ended March 2026, "FY2025"):** Net sales **¥857.8bn** (+7.6% YoY, record), operating income **¥183.8bn** (+15.7%), **operating margin 21.4%** (+1.5pp). [I — from a summary of FANUC's official results presentation; the raw filing PDF at fanuc.co.jp corroborates but could not be machine-parsed here]
- **Segment mix (FY2025, approximate):** ROBOT ~45%, FA/CNC ~26%, Robomachine (Robodrill/Roboshot/Robocut) ~16%, Service ~13%. *Caveat:* mix is from a secondary summary — treat the exact splits as soft; the structural point (Robot now the largest segment, FA/CNC ~¼) is the reliable takeaway. [I]
- **Global share:** #1 in industrial robots (~**17–20%** unit share) and dominant in **CNC controls (~50–65%** of the world market; ~65% cited most often, ≥50% since 1982). [I]
- **Employees:** ~8,300 (parent, 2023); consolidated group larger via 240+ JVs/subsidiaries across 46+ countries. [D]
- **China:** ~25% of revenue. [I]

### 2. Source of competitive advantage
Ranked by how much they actually matter:

1. **The integrated electrical/control loop (the core moat).** FANUC designs and builds *the entire electrical drivetrain in-house* — **servomotors, servo amplifiers/drives, encoders, the CNC/controller, and the motion-control software** — plus its own sensing (iRVision machine vision, FS-series 6-axis force-torque). Because one company owns motor + drive + encoder + control law + robot kinematics, it tunes the closed loop end-to-end for reliability and MTBF that a systems-integrator OEM buying merchant drives cannot match. This is the root advantage; everything else compounds on it. [D/I]
2. **CNC dominance → robot pull-through.** ~50–65% global CNC share means **millions of FANUC CNCs already sit inside the world's machine tools**, especially in China. That installed base is a natural, low-friction channel for FANUC robots (same controls language, same service network) — a defensive, self-reinforcing distribution moat. [I]
3. **"Lights-out" reliability + installed base + yellow standardization/scale.** FANUC runs automated "robots-making-robots" plants (~11,000 robots/month capacity), which forces its own products to be ultra-reliable and gives it low unit cost. The standardized yellow fleet + global service/parts network raises switching costs on a huge installed base. [D/I]

Bottom line: (1) is the *irreplaceable* edge; (2) is the distribution flywheel unique to FANUC among the six; (3) is durable but more replicable.

### 3. Supply chain structure
FANUC is the **most vertically integrated robot OEM on earth** — but integration stops precisely at the reducer.

| Layer | Status |
|---|---|
| Motion control / CNC / software | **In-house** — the crown jewel [D] |
| Servomotors | **In-house** [D] |
| Servo amplifiers / drives | **In-house** [D] |
| Encoders (position feedback) | **In-house** [D] |
| Machine vision (iRVision) | **In-house** [D] |
| Force-torque sensing (FS-15iA / FS-series) | **In-house** [D] |
| **Precision reducers (RV + strain-wave)** | **Merchant — the one gap** [D] |
| Bearings, ballscrews/linear, power semis, magnets, castings | **Merchant** [I/INF] |

- **The reducer gap is the thesis proof.** Even FANUC cannot economically make precision reducers. Per Bloomberg SPLC, **FANUC is Nabtesco's single largest customer at ~2.35% of Nabtesco revenue — the highest exposure of any OEM** (vs ABB 1.47, Kawasaki 1.35, KUKA 1.31, Yaskawa 0.88). Nabtesco RV reducers go in the high-torque base/shoulder/elbow joints; Harmonic Drive strain-wave units go in the wrist/small joints. Together these two Japanese firms hold ~75% of global precision-reducer supply. [D — SPLC; I — reducer market structure]
- **Manufacturing footprint:** Highly concentrated at the **Oshino / Mt. Fuji HQ complex** (HQ robot factory alone ~6,000 units/month; total Japan capacity ~11,000/month), plus **Shanghai-FANUC Robotics** (JV) and Shanghai-FANUC Robomachine for the China market, and regional assembly/service worldwide. [D]
- **Concentration risk:** Two-sided — (a) core production geographically clustered around one Japanese site (natural-disaster / single-region exposure), and (b) a hard external dependency on **two** reducer suppliers for a component it cannot substitute.

### 4. Key suppliers (named)

| Component | Supplier(s) named | In-house / merchant | Source grade |
|---|---|---|---|
| CNC / controller / motion software | FANUC | In-house | [D] |
| Servomotors | FANUC | In-house | [D] |
| Servo amplifiers / drives | FANUC | In-house | [D] |
| Encoders | FANUC | In-house | [D] |
| Machine vision | FANUC (iRVision) | In-house | [D] |
| Force-torque sensor | FANUC (FS-15iA / FS-series) | In-house | [D] |
| **RV (cycloidal) reducers** | **Nabtesco** | **Merchant** | [D — SPLC, ~2.35% of Nabtesco rev; FANUC = its #1 customer] |
| **Strain-wave reducers** | **Harmonic Drive Systems** | **Merchant** | [D/I] |
| Bearings | NSK / NTN / SKF / THK (industry-standard set) | Merchant | [I/INF — anchor; not FANUC-specific-disclosed] |
| Linear guides / ballscrews | THK / NSK-class suppliers | Merchant | [INF] |
| Power semiconductors | Fuji Electric (anchor) | Merchant | [I/INF] |
| Rare-earth magnets (motor) | Japanese magnet supply chain (e.g., Shin-Etsu / TDK-class; not FANUC-disclosed) | Merchant | [INF — not sourced to a named FANUC contract] |
| Castings / structural | Regional foundries (not publicly named) | Merchant | [INF] |

*Note:* Reducers and (Fuji) semis are the well-sourced merchant inputs; bearings, ballscrews, magnets and castings are inferred from the industry-standard Japanese supplier set and should not be read as FANUC-disclosed relationships.

### 5. What makes FANUC DIFFERENT (comparison hooks)
1. **Deepest in-house electrical/control stack of the six.** FANUC builds motor + drive + encoder + CNC + control law + vision + force sensing itself. ABB and KUKA are far more integration/systems houses buying merchant motion components; Yaskawa is the closest peer (it *does* make its own servos/drives) but leans harder into being a merchant drive/motor supplier to others. Estun is emerging-integrated but not at FANUC's maturity. **Only FANUC pairs full electrical integration with CNC dominance.** [INF/I]
2. **CNC is the second engine — unique.** None of the other five owns a ~50–65% CNC franchise. This gives FANUC a robotics distribution channel (installed CNC base) the others structurally lack. [I]
3. **It STILL buys the reducer — and is the *most* exposed.** The most integrated OEM is also **Nabtesco's #1 customer (~2.35%)**, the highest of the group. The reducer is the universal un-integratable component; FANUC proves it at the extreme. [D]
4. **"Robots making robots" lights-out manufacturing + net-cash, no-controlling-shareholder governance.** A distinctly Japanese, capital-return-disciplined, single-complex production model vs KUKA (Midea-owned, China-controlled), Kawasaki (conglomerate division), and Estun (China-domestic). [D/I]

### 6. Company-specific bear case / risks
- **China concentration + local erosion:** ~25% of revenue from China, where **domestic brands crossed 56% share in Q3 2025** and now out-ship FANUC/ABB/KUKA in volume for the first time. **Estun and Inovance** undercut on price (~20–30%) with faster local service; FANUC's China position is increasingly *defensive* (CNC install base) rather than a growth engine. [I]
- **Cyclicality:** Robots + CNC are late-cycle capex plays tied to auto (incl. EV retooling), electronics and machine-tool cycles — earnings swing hard with global capex. [INF]
- **Reducer dependence:** No in-house reducer; a Nabtesco/Harmonic Drive supply shock, price move, or capacity constraint hits FANUC harder than any peer (it is Nabtesco's largest customer). [D/INF]
- **Chinese reducer/robot vertical integration:** As Chinese OEMs and reducer makers (e.g., Leaderdrive, Zhongda) scale, the merchant-reducer moat FANUC relies on could commoditize downstream, compressing the mid-tier robot market FANUC is already losing. [INF]
- **Succession / governance:** Long Inaba-family stewardship with no controlling stake — key-person/culture risk, plus persistent activist pressure on its large cash pile. [I]
- **FX:** Heavily export-driven from Japan; yen strength directly compresses reported sales and margins (and vice-versa — recent yen weakness has flattered results). [INF]
- **Production concentration:** Core capacity clustered at the Mt. Fuji complex — single-region operational/disaster risk. [INF]

### Sources
- FANUC FY2025 results reference (official): https://www.fanuc.co.jp/en/ir/announce/pdf/2026/reference202603_e.pdf
- FY2025 results summary (secondary): https://note.com/shiny_mink5097/n/nbcdf91a5fac8?hl=en ; https://note.com/sankituushin/n/nfe25afc1fd72?hl=en
- FANUC — Wikipedia (lineage, HQ, CNC ~65%, structure): https://en.wikipedia.org/wiki/FANUC
- FANUC production/factories: https://www.fanuc.co.jp/en/profile/production/ ; https://www.fanuc.eu/eu-en/fanuc-factories
- Shanghai-FANUC Robotics JV: https://www.fanuc.co.jp/en/service/asia/shanghai.html
- Morningstar — CNC/robot competitive position: https://www.morningstar.com/company-reports/1275896-fanucs-long-term-outlook-remains-bright-with-irreplaceable-cnc-and-competitive-robot-products
- iRVision / force sensor (in-house sensing): https://www.fanucamerica.com/products/robots/vision-products ; https://www.fanucamerica.com/products/accessories/force-sensor
- Reducers — Nabtesco RV / Harmonic Drive strain-wave, ~75% duopoly: https://www.evsint.com/industrial-robot-reducers-harmonic-cycloidal-rv-comparison-2026/ ; https://roboticpaint.com/how-japanese-speed-reducer-monopolize-the-industry/ ; https://www.jaredwatkins.com/research/robotics/actuators/nabtesco/
- Nabtesco SPLC customer exposure (~2.35%, FANUC #1): Bloomberg SPLC (team anchor data, not a public URL)
- China share shift / Estun competition: https://www.thewirechina.com/2025/12/17/china-is-falling-behind-at-the-sharp-end-of-the-global-robot-race-china-industrial-advanced-robotics/ ; https://matrixbcg.com/blogs/competitors/fanuc
- Ownership structure (net cash, ~45% foreign, no controlling holder): https://matrixbcg.com/blogs/owners/fanuc ; https://www.marketscreener.com/quote/stock/FANUC-CORPORATION-6492019/company-shareholders/
