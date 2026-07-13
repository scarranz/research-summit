# The Humanoid Robot Supply Chain — Where the Money Actually Is

**Summit Research · Robotics Coverage · Phase 3**
**Prepared:** 13 July 2026 · **Owner:** SAB
**Companion docs:** [`HANDOFF_robotics_coverage.md`](HANDOFF_robotics_coverage.md) (master context) · [`robotics-technology-landscape.md`](robotics-technology-landscape.md) (Phase 1–2: taxonomy & value chain) · [`aeva_research_memo.md`](companies/aeva_research_memo.md)

**Provenance legend:** `[D]` Disclosed (filing / official document / management on the record) · `[I]` Independent third party (broker, teardown, named journalist) · `[C]` Company claim (promotional; unverified) · `[E]` Estimate or inference (ours, or an untraceable third party's) · **RUMOR** = unnamed sources / self-media, no company confirmation

> **Contrarian posture (per the handoff):** company materials are promotional by default; a "Strong" call requires third-party verification. This document is built to *falsify* the humanoid supply-chain narrative, not to support it. Where the narrative survives contact with primary evidence, we say so. Where it doesn't, we name the number and kill it.

---

## 0. Executive summary — the six findings

**1. The humanoid supply chain does not yet exist as a flow of money.** It exists as a narrative, a capex cycle, and a set of press releases. Bloomberg's SPLC relationship data — built from filings and transcripts — contains **zero humanoid-specific supplier relationships**. Tesla's SPLC supplier list is a *car* supply chain (CATL 14.5% of cost, LG Energy, Panasonic, NVIDIA). Harmonic Drive's disclosed customers are Nissan, FANUC, Toyota, BAE — and **Moog**. Nabtesco's are Boeing, ABB, KUKA, Caterpillar. `[D, Bloomberg SPLC]` If humanoid procurement were material, it would appear in somebody's financials. It does not.

**2. Actuation is the largest cost pool — but it is *not* the bottleneck.** This is the single most important correction to the consensus (including our own prior). Actuation is 40–60% of BOM `[I]`, but the harmonic-reducer layer is running at **~25–40% utilization** with global capacity of 4.9M units against 1.2M units of consumption `[I, GGII]`, prices falling ~15–29%/yr `[D]`, and the world's #1 maker quoting **1–2 month lead times** with "zero" delivery disruption `[C, HDS CEO, 21 May 2026]`.

**3. The real bottleneck is two layers deeper: planetary roller screws, and the internal-thread grinding machines that make them.** Imported thread grinders cost ≥RMB 12M each with **~2-year lead times**, are export-restricted into China, and represent **46% of a screw line's capex** `[I, The Paper, 20 May 2025]`. Total world PRS output across *all* end uses is plausibly 200–600k units/yr `[E]`; one million Optimus-class robots would need **14 million**.

**4. The two companies closest to actual humanoid demand are both decelerating — this month.** Regal Rexnord's humanoid orders went from **$40M (FY2025) to ~$1M (Q1 2026)**, a >90% collapse, disclosed by the CEO on the record `[D, 12 May 2026]`. Leaderdrive **delayed its fully-funded 1-million-unit expansion by two years** citing low capacity utilization, four days before this was written `[D, 9 Jul 2026]`. Neither fact is being priced.

**5. The OEMs that will reach volume are the ones that buy the least.** Tesla designs its own actuators. Figure designs its actuators, batteries, sensors, structures and electronics in-house `[C, and it says so explicitly]`. Unitree names vertical integration in its **IPO prospectus** as the reason it can sell a robot for ¥29,900 `[D]`. The merchant-module TAM accrues to the long tail — 1X, Neura, UBTECH — not to the winners.

**6. There is exactly one place a foreign government can stop a Western humanoid program: magnets.** NdFeB is 90–94% China `[I]`; heavy-rare-earth separation is 98–99% China `[I]`; the export-licence regime of April 2025 **has never been suspended** and Musk stated on the record that Optimus production was "impacted" by it `[D, 23 Apr 2025]`. But note the asymmetry — humanoid demand is only **~1.5% of the magnet market even at 1 million robots/yr** `[E]`. **Own magnets for the geopolitics, not for the humanoid story.**

> **The one-line thesis:** The street is buying seven layers of tickers in a supply chain that, measured in traceable dollars, has not started. The scarcity rent — if the ramp is ever real — sits in precision roller screws and thread grinders, which almost nobody owns. Everything else is a narrative trade at this point in the cycle.

---

## 1. Why this document exists — and what triggered it

The proximate input was two Instagram carousels circulating in the team (The Fox of Stocks; stockswithanubhav), each presenting a "7-layer humanoid supply chain" with a ticker list per layer. They are reproduced here **only as the object of analysis**, not as evidence:

| | Fox of Stocks (7 layers) | stockswithanubhav (7 layers) |
|---|---|---|
| 1 | Brain — NVDA, QCOM | AI Brains — NVDA, QCOM |
| 2 | Eyes — CGNX, AMBA, OUST | Sensors — CGNX, ALGM, OUST, VPG |
| 3 | Muscles — RRX | Edge AI — LSCC, AMBA, CEVA |
| 4 | Bones (rare earth) — MP, ALB | Motors — AME, Nidec, RRX, RBC |
| 5 | Memory — MU | Joints & Actuators — ALNT, TKR, **MOG.A**, Harmonic Drive (6324.T), THK (6481.T) |
| 6 | Body (OEMs) — TSLA, ISRG | Power electronics — TXN, STM, IFX, ON, RNECY, MPWR, WOLF, NVTS |
| 7 | Deployment — SYM, SERV | Rare earth — MP, LYSCF, ENS, UUUU, USAR |

**Two taxonomies, no overlap in structure, ~30 tickers, and not one causal link to a humanoid unit.** Under the handoff's own provenance discipline these are tier `[C]` at best. They also contain plain errors (Micron did not post "$28.2 billion in profit in a single quarter").

Their genuine value is as a **hypothesis of the ticker universe** — a list of names to falsify. That is what §§2–7 do. Their genuine danger is that this is what the marginal buyer of these stocks believes.

---

## 2. The demand denominator — how many humanoids actually exist

Everything downstream is arithmetic on this number, so it goes first.

### 2.1 Units shipped in 2025 — three counts, ±40% apart

| Source | 2025 units | 2026 forecast | Definition |
|---|---|---|---|
| Omdia `[I]` | ~13,000 | 2.6M by 2035 | Includes wheeled / dual-arm |
| **Yano Research** `[I]`, 30 Apr 2026 | **16,580** (+648%) | 81,690 | Locomotion required; excludes torsos/arms |
| IDC `[I]`, Jan 2026 | ~18,000 (+508%) | >510,000 by 2030 | — |
| TrendForce `[I]` | — | >50,000 | — |

The "16,000 shipped in 2025" figure circulating in the carousels is **traceable — to Yano Research** — but it is **not consensus**. The ±40% spread exists because **there is no agreed definition of "humanoid."** Note also that AgiBot claims #1 (per Omdia) and Unitree claims #1 (per its own PR) for the same year; both are right under their own definitions. **Any bottom-up model inherits this ambiguity.**

### 2.2 What those units actually are

| OEM | 2025 actual | Tag | What it really is |
|---|---|---|---|
| **AgiBot / Zhiyuan** | **5,168** shipped, 39% share | `[I]` Omdia | Omdia's own categories: entertainment, research & education, exhibition/reception |
| **Unitree** | **5,215 sold** (prospectus) | `[D]` STAR prospectus | ASP ¥166,400, −36% y/y. R&D platforms and content props |
| **UBTECH (9880.HK)** | **1,079** full-size delivered | `[D]` FY2025 results | Humanoid revenue ¥820M (+2,204%); **net loss ¥789.8M**. The largest genuinely-paid *industrial* humanoid revenue line on earth |
| **Agility Robotics** | ~**100** Digits with paying customers | `[D]` SPAC filing | ~**$37M TTM revenue**, ~$100M 2025 burn. The only auditable Western OEM |
| **Figure** | **350+ produced** (not sold) | `[C]` | No disclosed customer unit count or revenue |
| **Tesla (Optimus)** | **~0 external**; several hundred internal | `[C]`/`[E]` | **Musk, Jan 2026: admitted zero Optimus were doing useful work** |
| Boston Dynamics, 1X, Apptronik, Neura, XPeng, Sunday, Galbot | ~0 external at volume | `[C]` | Pilots, pre-orders, captive demand |

> **The load-bearing correction:** the June-2026 "Humanoid Robot Makers" map in `humanoids-context/` attributes **5,168 units to UBTECH**. That figure is **AgiBot's**, per Omdia. **UBTECH shipped 1,079.** Do not carry the map's number into any model.

**Read-through:** ~11,500 of the ~13–18k units came from three Chinese firms, mostly into labs, universities, showrooms and entertainment. **Western industrial humanoids doing paid work in 2025 numbered in the low hundreds.** 2026 base case is 50,000–82,000 units — a **~$2–4bn hardware market at blended ASPs**. *The entire global humanoid industry in 2026 is smaller than a single mid-cap industrial's revenue line.*

### 2.3 The TAM forecasts — and why they cannot all be right

| House | Number | Skeptic's note |
|---|---|---|
| Morgan Stanley `[I]` | $5T by 2050; >1bn units; unit cost → $50k | **$5T ÷ $50k = 100M units/yr in 2050 — more than the entire global light-vehicle market (~90M).** Adoption is explicitly back-loaded past 2035. Zero near-term falsifiability. |
| BofA `[I]` | 1M units/yr by 2030; 90,000 in 2026 | The **2026** number is already at risk: BofA 90k vs TrendForce >50k vs Yano 82k. |
| **Goldman Sachs** `[I]` | **$38bn by 2035; 1.4M units** | The most defensible number on the page — and **~130x smaller than Morgan Stanley's.** Note it was **revised up 6x** from $6bn. *A house that moves its own TAM 6x has no anchor.* |
| Jensen Huang `[C]` | **"$40 trillion"** | No report, no methodology, no unit or price assumption. It is **global labour cost, relabelled**. He sells compute to every OEM in this document. Cite only as evidence of narrative intensity. |

> **When three bulge-bracket houses disagree by 5x on a five-year number from the same starting data, the honest position is that nobody has a model. They have a narrative with a spreadsheet fitted to it.**

---

## 3. The BOM — what a humanoid actually costs, and who gets the money

### 3.1 The consensus split (weighting only named, methodology-bearing sources)

| Subsystem | Share of BOM | Best-evidenced range | Source anchor |
|---|---|---|---|
| **Linear actuators** (motor + planetary roller screw + encoder) | ~27% | 20–30% | BofA `[I]`; Schaeffler IR deck says ~30% `[D]` |
| **Rotary actuators** (frameless motor + harmonic reducer + encoder + driver) | ~24% | 20–30% | BofA `[I]`; Schaeffler ~25% `[D]` |
| — *of which reducers + screws alone* | **~33% of total BOM** | 25–35% | J.P. Morgan `[I]`; McKinsey: gearbox = 30–50% *of actuator cost* `[I]` |
| **ACTUATION SUBTOTAL** | **~50%** | **33–70%** | McKinsey 40–60%; SemiAnalysis 50–70% |
| **Dexterous hands** | **15–20%** | 12–20% | BofA 19%; MS 17.2% (Optimus) |
| Sensors (vision, depth, LiDAR, F/T, tactile, IMU) | 8–12% | 8–20% | G1 teardown: LiDAR + depth = 13.7% `[I]` |
| Compute (SoC) | 3–10% | 3–15% | G1 uses RK3588 at 3.4% of BOM `[I]` |
| Battery | 5–8% | 5–12% | No good primary data |
| Structure / housing | 5–8% | 5–10% | `[I]` |
| Wiring / power electronics / assembly | 5–8% | 5–10% | China Post booked assembly at 7.2% `[I]` |

**Why the actuation range is 33–70% — it is definitional, not empirical.** Include the hands' motors and joint-integrated encoders/drivers → ~65–70%. Body rotary + linear actuators only → ~50%. Reducers and screws only → ~33%. **State the definition before quoting the number.**

**Encoders and bearings are almost never broken out** in any public source — they are absorbed into the joint-module line. Any bottom-up model that itemises them is inventing numbers.

### 3.2 The only hard data in existence: two Unitree G1 teardowns — which disagree by 56%

**There is no published line-item BOM for any Western humanoid.** Not Optimus, not Figure 03, not NEO. Everything circulating is broker should-cost modelling. The only physical teardowns are both of a **Chinese** robot:

**China Post Securities, 29 Apr 2026 — G1 base, RMB 41,574 (~$5,740)** `[I]`:

| Line | RMB | % BOM |
|---|---|---|
| **23 joint modules** (14 small @ ¥1,000; 9 large @ ¥1,500) | 27,500 | **66.1%** |
| DJI Livox MID360 LiDAR | 3,840 | 9.2% |
| Intel RealSense D435i depth camera | 1,869 | 4.5% |
| Rockchip RK3588 compute | 1,415 | 3.4% |
| Processing & assembly | 3,000 | 7.2% |
| Residual (battery, structure, wiring) | ~3,950 | ~9.5% |

**SemiAnalysis, 8 Jun 2026** `[I]`: G1 BOM **$8,976**, pre-tax price $27,300, ~67% GM. No public line-item split.

**Reconciliation:** the 56% gap is most likely **configuration** (SemiAnalysis priced an EDU-class unit; China Post priced the ¥85,000 base) and secondarily **should-cost vs paid-cost**. **Cross-check against disclosure:** Unitree's prospectus shows FY2025 gross margin ~60% `[D]` — a ~60% GM on a $16k list price is consistent with a mid-single-digit-thousand-dollar COGS, which **corroborates China Post over SemiAnalysis for the base unit.**

Both agree on the structure: **joint modules ≈ two-thirds of a QDD humanoid's BOM.**

### 3.3 The insight that reframes everything: architecture determines cost structure

| | **Optimus / Figure** | **Unitree G1** |
|---|---|---|
| Architecture | Harmonic reducers + **planetary roller screws** | **Quasi-direct-drive (QDD)** |
| Actuator count | 28 (14 rotary + 14 linear), ~6 unique designs `[D]` | 23 joints, 4-in-1 integrated modules |
| Gearing cost | Roller screw is the priciest single part | Gearbox **up to 80% cheaper** `[I, SemiAnalysis]` |
| Joint module cost | not disclosed | **RMB 1,000–1,500 (~$140–210)** — measured `[I]` |
| Total BOM | **~$55k** (MS, Gen 2) `[I]`; Western pilot $90–100k `[I]` | **$5,740–8,976** — measured `[I]` |
| Supply chain | Japan / Switzerland anchored, constrained | Commodity, machinable, Chinese |
| Trade-off | torque density, backdrivability, payload | G1 sustains 5 kg for only 10–15 min, needs 5–10 min cooldowns |

> **Unitree did not remove the most expensive, most supply-constrained part of the BOM by achieving scale. It removed it by a design choice** — and has a *measured* ~60% gross margin at a $16k price to prove it. The question for Tesla and Figure is whether roller-screw torque density is worth a 3–10x BOM. **That question, not the cost-down curve, is the actual investment question in this sector.**

### 3.4 The 10x should-cost gap

McKinsey's most actionable finding: **a ~10x difference between distributor list price and manufacturing should-cost for actuators** `[I]`. Most sell-side BOM models are built from catalogue prices. **They are therefore structurally too high** — and this is why Unitree's vertical integration produces a number half of what outside modellers assume.

### 3.5 Component unit costs — what is actually published

| Component | Price | Source | Tag |
|---|---|---|---|
| Planetary roller screw | $1,350–$2,700 | J.P. Morgan via Fast Company | `[I]` — **but see §9, the "19% of robot cost" version of this is folklore** |
| Harmonic reducer, Chinese (Leaderdrive) | **40–60% of HDS price** | 36Kr | `[I]` |
| Harmonic reducer ASP, Leaderdrive | **RMB 1,319 → 1,119** (−15% y/y) | derived from FY2025 report | `[E]` from `[D]` |
| Harmonic reducer ASP, **Laifual** | **RMB 802 (2023) → 573 (2025), −29%** | HKEX prospectus | **`[D]` — the best price disclosure in the sector** |
| Joint module (Unitree, in-house) | RMB 1,000 / 1,500 (~$140/$210) | China Post teardown | `[I]` |
| Dexterous hand, mainstream China | ¥50,000–100,000 (~$7–14k) ≈ 20% of machine cost | Tianxia Gongchang | `[I]` |
| Optimus hands (pair) | ~$9.5–10k | Morgan Stanley, Jun 2024 | `[I]` |
| Tactile sensor, China | **as low as ¥199** (vs >¥100,000 imported 5 yrs ago) | Chinese brokers | `[I]` |
| LiDAR — Livox MID360 | RMB 3,840 (~$530) | teardown | `[I]` |
| Compute — Rockchip RK3588 | RMB 1,415 (~$195) | teardown | `[I]` |
| Compute — NVIDIA Jetson AGX Thor | **$3,499** (dev kit) | NVIDIA | `[D]` |
| Battery — Optimus | 2.3 kWh, ~52V — **no cost disclosed** | Tesla | `[D]` spec |

**Encoders and bearings: no published unit prices exist. Anyone quoting them is estimating.**

---

## 4. Chokepoint scorecard — real vs narrative

This is the core deliverable. Each layer is graded on whether it is **physically constrained** (few suppliers, long lead times, capital/know-how barriers) or **a commodity with a robotics story attached**.

| Layer | Verdict | The evidence that decides it |
|---|---|---|
| **Planetary roller screws** | 🔴 **REAL — the bottleneck** | World output across *all* end uses ~200–600k units/yr `[E]`; 1M robots need **14M**. Hengli's own filing: new plant makes **750 PRS e-cylinders/yr** `[D]`. Xinjian shipped **3,280 screws in all of Feb 2026** `[C]`. |
| **Internal-thread grinding machines** | 🔴 **REAL — the bottleneck behind the bottleneck** | Imported grinders **≥RMB 12M each, ~2-year lead times**, **46% of a screw line's capex**, export-restricted into China `[I]`. |
| **Sintered NdFeB magnets** | 🔴 **REAL — the only geopolitical kill-switch** | 90–94% China `[I]`; licence-gated since Apr 2025 and **never suspended**; US-bound magnet exports **−30.6% y/y in Mar 2026** while the global aggregate rose `[I]`; **Musk stated Optimus was "impacted"** `[D]`. |
| **Heavy-RE separation (Dy/Tb)** | 🔴 REAL — **but possibly not binding for humanoids** | 98–99% China, no substitute, Myanmar-fed. **BUT** humanoid actuators run intermittent, cooled, near-ambient — unlike EV traction motors at >150°C — so they may need little or no Dy/Tb, and **Proterial is already shipping Dy/Tb-free grades** `[I]`. **Verify before underwriting. This single question flips the thesis.** |
| **Dexterous hands / tactile sensing** | 🟠 **Genuinely hard, rapidly commoditizing** | 15–20% of BOM, the hardest engineering in the robot — but Chinese tactile sensors fell from >¥100,000 to **¥199** in five years `[I]`. Technical moat, no pricing moat. |
| **Harmonic / strain-wave reducers** | 🟡 **NOT a bottleneck today — OVERSUPPLIED** | Global capacity **4.9M units vs 1.22M consumed** (2024) `[I, GGII]` → **~25–40% utilization**. HDS lead times **1–2 months**, CEO says "zero" disruption `[C]`. **Leaderdrive delayed its 1M-unit line by 2 years citing low utilization, 9 Jul 2026** `[D]`. Prices −15% to −29%/yr `[D]`. |
| **Frameless torque motors** | 🟢 **NARRATIVE — commoditizing into oversupply** | Morgan Stanley's own note: **"lower technical barriers"** `[I]`. **Xinje alone is building capacity for ~2M sets in 2026** vs a market that may build 20–30k robots `[C]/[E]`. |
| **Bearings (incl. crossed-roller)** | 🟢 **NARRATIVE — and too small to matter anyway** | **~$350–650/robot = 1–2% of BOM** `[E]`. Even a *monopoly* at 1M robots/yr is a **<$700M market split ~10 ways.** IKO — the purest listed CRB play — calls humanoid CRB **"prototype stage"** and **cut growth capex ¥15bn → ¥7bn** `[C]`. |
| **Batteries** | 🟢 **NARRATIVE** | 2.3 kWh/robot. **1M robots = 2.3 GWh = ~0.15% of global li-ion capacity**, which is in structural oversupply. Four+ qualified suppliers fighting over it. Runtime is a *product* problem, not a *supply* problem. |
| **Power electronics / motor-control semis** | 🟢 **NARRATIVE — the weakest link in the bull case** | **~$1,400 of semis per robot** `[I, UBS]` × 1M robots = **$1.4bn of TAM split across TI, ST, Infineon, onsemi, Renesas, MPS, ADI…** TI alone does ~$16–17bn of revenue. At *today's* volumes the revenue is **literally immaterial.** The analog/discrete segment is **working off elevated inventory** into 2026. |
| **Compute (NVDA/QCOM)** | 🟠 Real capability, immaterial humanoid revenue | 3–10% of BOM. Jetson Thor is a genuine product; humanoids are a rounding error in NVDA's P&L. The Isaac/GR00T position is strategic, not financial — *for now*. |
| **RE mining (as distinct from refining)** | 🟢 NOT a chokepoint | Only ~60–70% China; four continents mine it. **Pure mining equities are levered to the wrong stage of the chain.** |

### 4.1 The reducer layer — the falsification test that just failed for the bulls

This deserves its own box because it is where the consensus (and our own prior) was wrong.

- **Global harmonic capacity 4,897,000 units (2024) → ~6M (2025E); industrial consumption 1,218,700 units.** Industry utilization ~25–40%. `[I, GGII]`
- **HDS CEO Maruyama, 21 May 2026 earnings call** `[C]`: normal lead time **1–2 months**; the Q4 order surge did not change it; there is **"zero"** delivery disruption. CFO: **no large capacity investment planned for 1–2 years.**
- **HDS scrapped its own 2024–26 mid-term plan on 13 May 2026** because AI-robot adoption "deviated considerably from our initial assumptions." `[D]`
- **HDS's new FY2026–30 plan discloses an explicit "AI・humanoid robot" revenue line** `[D]` — the single most useful humanoid number in this entire document:

| FY | 2025 | 2026 | 2028 | **2030** |
|---|---|---|---|---|
| AI/humanoid sales (¥bn) | 1.9 | 2.3 | ~7.1 | **13.3** |

  That is 13% of a ¥100bn target. At ¥15–30k ASP it implies **~30–60k Optimus-class robots/yr in 2030** `[E]`. **The world's #1 strain-wave maker is planning for a humanoid market an order of magnitude below the bull case.**

- **Leaderdrive, 9 July 2026** `[D]`: pushed completion of its **funded** 1,000,000-unit expansion from 31 Dec 2026 to **31 Dec 2028**. Only RMB 85.3M (6.08%) of RMB 1.4bn spent. Stated reason: **低产能利用率 — low capacity utilization** (42.67% in 2024 → 67.76% in 2025). This came **three weeks after** management told its AGM that "orders are ample, capacity is ramping."

> **A company with a genuine humanoid order boom does not slip a fully-funded 1M-unit line by two years.** This is the cleanest falsification test in the sector, and it failed four days before this document was written.

**When does the reducer layer actually break?**

| Humanoid program | Harmonic units @14/robot | vs 2024 consumption (1.22M) | vs 2024 capacity (4.9M) |
|---|---|---|---|
| 10k robots/yr | 140k | 11% | 3% |
| **100k robots/yr** | **1.4M** | **115%** | 29% |
| 500k robots/yr | 7.0M | 5.7x | **1.4x** |
| 1M robots/yr (Musk's target) | 14M | 11x | **2.9x** |

**A 100k-unit program consumes the entire world's current industrial-robot harmonic output — but still only ~30% of installed nameplate. The layer does not break until humanoids clear ~300–500k units/yr.** *That is the asymmetry, and HDS is the highest-torque way to own it — but you would be paying for optionality that HDS's own management is not underwriting.*

### 4.2 The magnet layer — the licence queue is the weapon

- **Three stages, three very different Chinese shares** `[I]`: mining ~60–70% · **light-RE separation ~90%** · **heavy-RE (Dy/Tb) separation 98–99%** · **sintered NdFeB magnets 90–94%**. The chokepoint is stages 2–3, **not mining**.
- **April 2025 (MOFCOM Announcement 18)** `[D]`: licensing on 7 heavy/medium REEs **and magnets containing them**. **This regime has never been suspended and is in force today.** The widely-reported "truce" refers to a *different* package.
- **October 2025 (Announcements 55–62)** `[D]`: +5 elements, a **0.1% de-minimis extraterritorial rule**, a **Foreign Direct Product Rule** on rare-earth *technology*, and an export ban on **skilled personnel**. **Suspended — not repealed — until 10 Nov 2026 and 27 Nov 2026.** *Two cliffs sit inside the next four months.*
- **December 2025** `[I]`: MOFCOM issued **general licences** to pre-cleared exporters — first recipients **JL Mag, Zhongke Sanhuan, Ningbo Yunsheng**. *Licence relief flows to Chinese magnet champions and their approved customer lists, not to the market.*
- **The observable effect** `[I, CSIS 27 Apr 2026; Reuters/Kitco]`: Q1 2026 aggregate magnet exports **+4.8% y/y** — but **exports to the US fell for a fifth straight month to 406 t in March 2026, −30.6% y/y.** Aggregate normalisation masks a **targeted US squeeze**. Yttrium to the US: 17 t (Apr–Dec 2025) vs 333 t pre-restriction.
- **The two-tier price** `[I, trade sources — directional only]`: Dy oxide **$190/kg inside China vs $317/kg FOB export (+67%)**; Tb **$804 vs $1,182 (+47%)**. **A Chinese robot maker's magnet bill is structurally ~50–65% cheaper.**
- **Direct humanoid evidence** `[D]`: **Musk, Q1 2025 earnings call (23 Apr 2025): Optimus production was "impacted" by China's magnet controls; Tesla was seeking export licences.** As of March 2026 **Tesla has not publicly confirmed resolution.**
- **Industrial-policy alignment, not a written rule** `[I]`: on **16 June 2026** the China Rare Earth Industry Association visited the **Beijing Humanoid Robot Innovation Center** and called for a "permanent communication mechanism" linking government, rare-earth producers, motor makers and robot assemblers.

> **You do not need a robotics-specific export ban when the licensing queue itself is the weapon.**

**Ex-China magnet supply — the honest tally** `[E]`: credible, financed, non-China sintered NdFeB capacity by **end-2027** ≈ MP 1,000 t + USAR 1,200 t + Neo 2,000 t + e-VAC 1,500 t + Noveon 2,000 t + Shin-Etsu/Proterial ~6,000 t ≈ **~14,000 t/yr against a ~230,000 t/yr global market — about 6%.** And most of it is **contractually pre-sold**: the DoD takes **100% of MP's 10X output for 10 years**; Bosch has reserved Neo capacity; Proterial and Shin-Etsu serve Toyota/Honda/Nissan.

> **For a Western humanoid program scaling in 2026–2028 the realistic answer is: you buy Chinese magnets under licence, or you don't ship.** Vertical integration (Figure, 1X) mitigates *assembly* risk, not *magnet* risk.

**BUT — the counter-argument that could kill this whole layer's thesis** `[I, Rare Earth Exchanges, 13 May 2026]`: humanoid actuators run **intermittent duty, actively cooled, near-ambient**, unlike EV traction motors and wind turbines at sustained >150°C. They may therefore be buildable with **standard high-remanence NdFeB and little or no Dy/Tb**. **Proterial launched a mass-production line for Dy/Tb-free magnets in 2025.** If that holds, the humanoid magnet problem is a *light-RE + sintering-capacity* problem — **much more solvable ex-China** (MP, Lynas, Solvay, Neo all separate NdPr). **We should treat "humanoids need Dy/Tb" as UNPROVEN and press any management team that asserts it.**

---

## 5. The supplier register — confirmed vs denied vs rumour

This is the section the handoff's provenance discipline exists for.

### ✅ CONFIRMED (in a filing, or management on the record)

| Fact | Amount | Date | Tag |
|---|---|---|---|
| **Harmonic Drive: explicit AI/humanoid revenue line** | ¥1.9bn FY25 → ¥2.3bn FY26 → **¥13.3bn FY30 plan** | 3 Jul 2026 | `[D]` |
| **Harmonic Drive scrapped its 2024–26 mid-term plan** — AI-robot adoption "deviated from assumptions" | — | 13 May 2026 | `[D]` |
| **Regal Rexnord humanoid orders: $40M (FY2025) → ~$1M (Q1 2026)** | **>90% collapse** | 12 May 2026 | `[D]`/`[C]` CEO Pinkham on the call |
| **Leaderdrive delayed its funded 1M-unit expansion by 2 years** — low utilization | RMB 1.4bn project, 6.08% spent | **9 Jul 2026** | `[D]` |
| **Schaeffler humanoid order book** | **5 contracts, "mid three-digit €m"** lifetime; 32 sample + **1 serial** order; addresses ~50% of BOM; **<1% of 2025 sales; explicitly EXCLUDED from 2028 targets** | 5 Feb / 5 May 2026 | `[D]` |
| **Huachen ↔ Fulilwang: 100 thread grinders** for PRS nuts | ~RMB 180M, 1-yr delivery | 25 Mar 2025 | `[D]`/`[I]` — *the only dated, sized, customer-named equipment order in the entire record* |
| **ABB → 1X**: harmonic drives | named by 1X on its own site | Apr 2026 | `[D]` |
| **Leaderdrive → Unitree, Galbot**: harmonic reducers | — | 2026 | `[I]` |
| Sanhua: RMB 3.8bn robot actuator base | capex real — **but FY2025 report discloses NO robot revenue** | Jan 2024 / Mar 2026 | `[D]` |
| Tuopu: RMB 5bn robot e-drive base | 300k actuators/yr live — **but on 12 Nov 2025 Tuopu said it has "no major orders currently"** | 2024 / 2025 | `[D]` |
| Best Precision: humanoid PRS revenue | **RMB 223,000 — 0.03% of revenue** | 5 Jul 2026 | `[D]` |
| Zhaowei: robotics revenue | **RMB 23.87M = 1.4% of sales** | FY2025 | `[D]` |
| **Timken ← Spinea** (NOT Nabtesco — see §9) | **$151.2M**, completed 31 May 2022 | — | `[D]` |
| **Schaeffler ← Ewellix** (SKF *sold* it) | €582M + €120M net debt ≈ €702M EV | Jan 2023 | `[D]` |
| **Bloomberg SPLC: UBTECH's disclosed suppliers** | **BYD (12.2% of cost)**, Orbbec (3D vision), Awinic — **100% Chinese** | 2025–26 | `[D]` |
| **Bloomberg SPLC: Harmonic Drive sells to Moog** | — | 2024 | `[D]` — *in actuation, Moog is a **customer** of the chokepoint, not its owner* |

### ❌ DENIED OR REFUTED **BY THE ALLEGED SUPPLIER ITSELF**

| Rumour | Size | Outcome |
|---|---|---|
| **Sanhua ← Tesla Optimus linear actuators** | **$685M / >RMB 5bn (~180k robots)** | **DENIED, 15 Oct 2025 — "传言不属实" (the rumour is untrue).** Sanhua also denied giving the interview it was attributed to. **This is the single most-cited "Tesla supplier confirmation" in the market, and it is a denied rumour.** |
| **Wolong ← Tesla**: 200,000 motors | — | **REFUTED** — Tesla is **<0.5%** of subsidiary SIR's operating income `[D]` |
| **PharmAGRI ← Tesla**: LOI for 10,000 Optimus | — | **"Fake." — Elon Musk, on X** |
| Xinqianglian entering humanoids | — | **"公司暂时没有进入人形机器人领域的计划"** — no plans to enter `[D]` |

### 🟡 RUMOUR ONLY — no company confirmation, no filing

Leaderdrive as a Tesla second-source with a 10,000-unit 2026 order · Shuanghuan/Huandong "Optimus-certified for waist/finger joints" · Hengli "in Tesla's supply chain" · Tuopu as "exclusive Optimus rotary actuator supplier" · Wanxiang "Optimus Gen-3 CRB at 5,000/week" · Wuzhou Xinchun "passed the Optimus factory audit" (**the company says it is NOT a direct Tesla supplier**) · "GSA supplies Optimus's 14 screws" · Zhongdali De "50,000-unit AgiBot order" · Tesla making roller screws in-house on its own grinders · Leadshine ← Tesla (**a meeting at CES is not a design win**) · Mirle / Asia Optical → Tesla · LG Energy → Tesla/BD/Figure (**KED Global, unnamed sources — plausible but formally unconfirmed**).

> **THE HEADLINE OF THIS SECTION: Tesla has never publicly named a single Optimus supplier. Figure designs its actuators in-house and says so. Every "Optimus supplier" position in the market is supplier self-disclosure, Chinese self-media, or — twice — a claim the alleged supplier publicly denied.**

**Corroboration from an independent direction:** a **Goldman Sachs** report (Nov 2025) found that **no Chinese humanoid supplier had confirmed a substantial order or a clear production timeline**, despite RMB 6bn+ of announced capex. The sector fell three straight sessions and the companies confirmed it themselves — Tuopu: "no major orders"; Sanhua: "progressing normally"; Best Precision: "small-batch sampling only." `[I]`

---

## 6. Vertical integration — why the "picks and shovels" trade may be backwards

The entire supplier thesis rests on OEMs buying **modules**. The evidence says the OEMs that will actually reach volume buy **parts** — or nothing at all.

| OEM | Actuator strategy | Evidence |
|---|---|---|
| **Tesla** | **Designs in-house**, outsources manufacture. Tried off-the-shelf actuators, rejected them, engineered 6 custom types across 28 actuators. | `[D]` AI Day. **Tesla owns the design rent; suppliers get build-to-print BOM economics.** |
| **Figure** | The most integrated Western OEM: *"vertically integrated across many critical module builds including **actuators, batteries, sensors, structures, and electronics, all of which were designed completely in-house**."* Reason given: **the absence of an established supply chain.** | `[C]` — but a direct company statement, so `[D]`-grade on intent |
| **Unitree** | **Full stack** — motors, reducers, encoders, drivers, joint modules, LiDAR, cameras. **Named in the IPO prospectus as the source of cost leadership.** | `[D]` STAR prospectus. *Caveat: Leaderdrive is reported to supply it harmonic reducers — integration is partial, not absolute.* |
| **XPeng** | In-house Turing chips, in-house harmonic joint, solid-state battery. Automaker playbook. | `[C]` |
| **1X** | **Explicit merchant buyer** — names **ABB (harmonic drives)**, Belden, Corning. Self-describes as an integrator. | `[C]` |
| **UBTECH** | No in-house reducer claim, no supplier disclosure. Likely the most merchant-dependent Chinese volume player. | `[E]` — inference from absence |

> **The OEMs that win are structurally the OEMs that buy the least. The merchant module TAM accrues to the long tail.**
>
> **Value pools that survive vertical integration:** rare-earth magnets · precision bearings · **ball/planetary roller screws** · harmonic/RV reducers (for mid-tier OEMs only) · force/tactile sensors · battery cells · compute.
> **Value pools at risk:** integrated joint modules · complete actuator assemblies · robot-level contract manufacturing.

*Note the irony: Morgan Stanley's own "Humanoid Tech 25" is a bet on components, not brands — Wall Street has already conceded the OEM layer may not be where the money is. But the same logic cuts the other way once the OEMs integrate **down** into components.*

---

## 7. The Moog question — VERDICT: our hypothesis is CONFIRMED

The handoff (§6) asked us to stress-test the call that **Moog is "largely orthogonal to the mass-market humanoid wave."** **The evidence supports it, strongly.**

1. **Moog has no humanoid product, program, or customer — anywhere in its own disclosure.** Its robotics page does not mention humanoids. The only robot named is the **HyQ Real quadruped**, a research collaboration with the Istituto Italiano di Tecnologia on **micro-hydraulics** `[C]` — and micro-hydraulics is precisely the technology the humanoid industry has moved *away* from. Every serious humanoid (Optimus, Figure, Apollo, Digit, Unitree) is electric.
2. **The word "humanoid" does not appear in any Moog earnings call, FY2025–FY2026.** No orders, no guidance, no design win. Contrast Regal Rexnord, whose CEO gives a hard humanoid order number every quarter (and just told you it collapsed).
3. **The Industrial segment's actual growth driver is data centers.** Q2 FY2026: **Industrial +9% to $256M, "driven by strong demand for data center cooling pumps"** `[D]`. Industrial was $956M of FY2025 revenue and it **shrank 4%** on divestitures — Moog is **simplifying and divesting** in Industrial under 80/20, i.e. moving *away* from fragmented low-volume industrial motion.
4. **~76% of Moog is aerospace and defense**, and that is where the record backlog is. FY2026 guidance ~$4.30bn, raised on **defense and space** `[D]`.
5. **The business model is structurally incompatible.** Moog's competence is flight-critical, qualification-heavy, low-volume, high-ASP servoactuation — economics built on certification moats and captive aftermarket. A humanoid actuator program requires the opposite muscle: high-volume, cost-down, automotive-style manufacturing. **Moog has been selling the businesses that look like that.**
6. **And per Bloomberg SPLC, Moog is a *customer* of Harmonic Drive** `[D]` — it buys the chokepoint, it does not own it.

**Where the counter-evidence comes from — and why it fails:** Moog sits in the KraneShares humanoid ETF (KOID) at a **2.42% weight, +83% since inception** `[I]` — but KraneShares' own rationale is **generic capability language** ("integrated smart actuators… precise force and position control") citing **no Moog humanoid product, program or customer.** Every other "Moog is a humanoid supplier" claim traces to **AI-generated content farms** with no source. One of them fabricates a supporting detail — "harmonic gearset lead times already at 26 weeks" — that **directly contradicts Harmonic Drive's CEO on the record (1–2 months).**

> **VERDICT: Moog is a defense/aerospace actuation compounder that was swept into the humanoid basket by an ETF taxonomy and a layer of unsourced SEO. There is no product, no program, no customer, no management commentary, and a segment strategy pointed the other way. Any humanoid premium in MOG.A is unearned.**
>
> **Consequence for our coverage:** the `moog_company_overview_dashboard.html` must not carry a humanoid angle. And per the handoff §4.1, its segment mix (28.8 / 24.8 / 23.4 / 23.0) and customer split (60/27/13) remain **unverified** and still need reconciling against the FY2025 10-K.

*(One honest asymmetry: Moog's Industrial driver — **data-center cooling pumps** — is the same "physical AI infrastructure" trade Kerrisdale uses to justify being long RRX. If you want the Moog story to be about AI, **that** is the credible version of it. It has nothing to do with humanoids.)*

---

## 8. Where this leaves Summit's robotics coverage

Mapping our two names, plus the gap, onto what we now know:

```
PERCEPTION (eyes)          COMPUTE (brain)         ACTUATION (muscle)         MATERIALS (bones)
   Aeva                       [STILL A GAP]           Moog                        [NO NAME]
   ─────                      ────────────            ────                        ─────────
   FMCW 4D LiDAR              NVDA/QCOM own it        aerospace servo             NdFeB magnets
   Omni (2H26) aimed at       humanoid rev is a       NOT a humanoid play         the ONLY real
   robotics — ZERO            rounding error in       (§7, confirmed)             geopolitical
   announced customers        their P&L               = customer of the           kill-switch
   pre-SOP, negative GM                               chokepoint, not owner       — but humanoids
                                                                                  are ~1.5% of the
                              THE BOTTLENECK ────────────────────┐                magnet market
                              planetary roller screws +          │
                              internal-thread grinders           │
                              → NOBODY IN COVERAGE OWNS THIS ◄───┘
```

**What the analysis changes:**

- **Aeva's robotics angle is weaker than it looks.** Sensors are 8–12% of BOM and the Chinese cost collapse is brutal (tactile sensors from >¥100,000 to ¥199; Livox LiDAR at $530 inside the G1). Omni has **zero announced customers**. The Aeva thesis remains what the memo says it is — design-win-to-production conversion in *automotive* — and humanoids are not a rescue.
- **Moog's humanoid angle does not exist.** Confirmed. Do not build one.
- **The compute gap is real but may not be worth filling** — humanoid compute revenue is immaterial to NVDA and QCOM. The honest way to own "physical AI" through those names is not the humanoid line item.
- **The layer nobody in our coverage owns is the one that actually matters:** roller screws and thread grinders. The listed exposure is thin and mostly Chinese (Beite, Xinjian [unlisted], Hengli, Zhenyu) plus **Schaeffler** (which bought Ewellix, addresses ~50% of BOM, and is the only Western franchise with a *disclosed* humanoid order book — 5 contracts, mid-three-digit €m lifetime, **explicitly excluded from its own 2028 targets**).

---

## 9. Numbers we refuse to carry into a note

Per the handoff's provenance discipline, these are in circulation and we are killing them:

| Claim | Why it dies |
|---|---|
| **"5,168 units — UBTECH"** (the June 2026 industry map) | That is **AgiBot's** number per Omdia. **UBTECH shipped 1,079.** |
| **"$685M Sanhua–Tesla order"** | **Publicly denied by Sanhua.** "传言不属实." |
| **"Roller screw = $1,350–2,700 each / 19% of robot cost"** | The "19%" version traces to a July-2025 Substack that **explicitly gives no source.** Folklore. |
| **"$46,000 China / $131,000 non-China BOM"** | Untraceable. Appears only in content farms with no attribution to any bank, teardown or filing. |
| **36Kr's Optimus split** (actuators 35% / reducers 15% / screws 18% / motors 12%) | **Double-counts** — reducers and motors are *inside* actuators. Arithmetically incoherent. |
| **"Actuators = 56% of Optimus BOM"; "Tesla AI5 chip = $5,000–6,000"** | Self-attributed to "Morgan Stanley" but findable in no MS publication. |
| **"20–40 harmonic reducers per humanoid"** | Physically implausible on a 28-actuator robot where half the joints are linear. Optimus needs **14**. |
| **"Harmonic gearset lead times at 26 weeks"** | **HDS's CEO says 1–2 months, on the record.** |
| **"Harmonic Drive has >80% global share"** | Stale 2021-era figure. **HDS + Leaderdrive combined were only 41.5% of China in 2024** `[D]`. |
| **"Nabtesco bought Spinea"** | **Timken bought Spinea**, in 2022. (The error appears in KraneShares' own January-2026 humanoid piece.) |
| **"Nabtesco doubling RV capacity by 2026"** | The disclosed plan is **by 2030**. |
| **"Micron posted $28.2bn of profit in a single quarter"** (Fox of Stocks carousel) | Not a real number. |
| **"Jensen Huang: $40 trillion market"** | No report, no methodology. It is **global labour cost, relabelled**, by the man selling compute to every OEM in this document. |
| **"GSA is German"** | **Swiss.** |
| **"Best Precision (300580) = Beite (603009)"** | **Different companies.** The RMB 1.85bn Kunshan roller-screw base is **Beite's**. |

---

## 10. What to monitor — ranked by information value

1. **🔴 A dated, sized, customer-named thread-grinder order at Reishauer / Kapp Niles / Drake / Matrix / Leistritz — or evidence Tesla is buying thread grinders.** *This is the highest-value monitorable in the entire sector.* You cannot build 14 million roller screws a year without first buying the machines that grind them, and those machines have **2-year lead times**. **As of July 2026 this signal has not fired**, and GrindingHub 2026 describes the German machine-tool industry as *"under pressure: declining production, weaker exports."* **Until it fires, the humanoid ramp is not real in the physical world.**
2. **🔴 Whirling.** Leistritz claims **8–10x throughput vs thread grinding**, cutting to 65 HRC, dry. **If anyone qualifies a whirled, humanoid-grade roller screw, the grinder bottleneck evaporates and the PRS scarcity trade dies overnight.** Nobody has published lead-accuracy data either way. *This is the key technical risk to any roller-screw-scarcity long.*
3. **🟠 Does Tesla's Fremont line actually start in Jul/Aug 2026 — and does Tesla ever give a unit number?** Musk refused to give a 2026 target on the Q1 call: *"It will move as fast as the least lucky, slowest, dumbest part in the entire 10,000."*
4. **🟠 Does UBTECH physically deliver 10,000+ U1s between 16 Sept and 31 Dec 2026?** Off a base of 1,079 units in **all of 2025**. Pre-orders on a consumer robot are not a backlog. **Watch for a Q4 slip.**
5. **🟠 The 10 Nov / 27 Nov 2026 rare-earth cliffs** — when the suspended October-2025 package (0.1% de-minimis + FDPR) is due to snap back. **The live binary event in this space.**
6. **🟠 Regal Rexnord's humanoid order line, quarterly.** It is the only Western company that discloses one. $40M → $1M. Does it recover?
7. **🟡 Harmonic Drive's AI/humanoid revenue line vs its own ¥13.3bn FY2030 plan.** The incumbent's own forecast is the sanity check on every bull case.
8. **🟡 Does the Dy/Tb question get settled?** A teardown or actuator-grade magnet spec would tell us whether the heavy-rare-earth chokepoint binds for humanoids at all. **It flips the entire materials thesis.**
9. **🟡 Unitree's STAR listing** (approved 2 Jul 2026, ≥¥42bn) — **the first true public mark on a humanoid OEM.**
10. **🟡 Does Figure or BMW ever put a fleet number in a press release?** See §11.

---

## 11. The credibility file — what happened when people checked

Kept deliberately, because in a sector with no revenue, **management credibility is the asset being priced.**

- **Figure / BMW (Fortune, 6 Apr 2025)** `[I]`. Adcock claimed BMW had "a fleet of robots performing end-to-end operations." **BMW's spokesman said there was only ONE Figure robot at Spartanburg at any given time, moving parts in the body shop during NON-PRODUCTION HOURS.** Adcock called the article "downright lies" and threatened litigation — then **skipped a live demo and sidestepped BMW questions on stage** two months later (TechCrunch, 6 Jun 2025). Subsequent claims of a 40-unit commercial fleet at $25/robot-hour appear **only in secondary blogs; no Figure or BMW press release confirms them.**
- **Tesla** `[D]`. Guided ~10,000 Optimus for 2025 in Jan 2025. **In Jan 2026 Musk admitted zero Optimus were doing useful work.** On the Q1 2026 call he **refused to give a 2026 target at all.**
- **Amazon kills Blue Jay (TechCrunch, 18 Feb 2026)** `[I]`. Shut down **<6 months** after unveiling — high manufacturing cost, poor performance. Followed by 100+ robotics-division layoffs. **The most sophisticated automation buyer on earth just killed a robot for being too expensive and not good enough** — and Amazon is this sector's most-cited anchor customer.
- **Hyundai union blocks Atlas (May 2026)** `[I]`. Hyundai committed 25,000 Atlas units to its own plants; **the union has blocked deployment absent a labour agreement.** Labour is a live, underpriced gating factor — and it is precisely the unionised plants that have the wage arbitrage worth attacking.
- **Sanhua, Wolong, PharmAGRI** — three separate Tesla-order claims, **all three killed by the alleged counterparty or by Musk himself.**

---

## 12. Open questions we could not close

1. **Do humanoid magnets actually need Dy/Tb?** Trade press assumes yes; the thermal-duty argument and Proterial's Dy/Tb-free production line say no. **This single question flips the entire heavy-rare-earth thesis for robotics.** Needs a teardown or a direct actuator-grade magnet spec.
2. **Did Tesla ever obtain its Chinese magnet export licences?** Unconfirmed publicly as of March 2026.
3. **Is a whirled roller screw good enough?** No published lead-accuracy data either way. The single best-defined open technical question in the supply chain.
4. **What is Optimus's actual linear-actuator content cost?** The two circulating estimates are **~$270/actuator** (back-solved from the *denied* Sanhua order) and **RMB 4,000/module ≈ $16,000/robot** (a Chinese brokerage) — **4x apart, and the $16,000 figure is arithmetically impossible against a sub-$20,000 BOM target.**
5. **Who is Agility's undisclosed $300M / ~1,000-robot customer?** One unnamed counterparty is ~all of the Western humanoid order book.
6. **Harmonic reducer market share** — one source says Leaderdrive ~25%, another ~10% with HDS at ~80%. **Unresolved.**
7. **Citi's humanoid GPS forecast** — primary not obtained. Do not cite until it is.

---

## 13. Method note

**Primary sources used:** Bloomberg SPLC relationship data (`robotics-splc-parsed.json`, 12 companies incl. Tesla and UBTECH as humanoid OEMs); SEC filings and earnings-call transcripts (Moog, Regal Rexnord, RBC Bearings, Timken, Tesla); Japanese TDnet disclosures and earnings decks (Harmonic Drive Systems, Nabtesco, IKO/Nippon Thompson, THK, NSK, Nidec); Chinese exchange filings via cninfo/SSE (Leaderdrive, Shuanghuan/Huandong, Zhongdali De, Sanhua, Tuopu, Best Precision, Wanxiang, Beite); the Unitree STAR Market prospectus and the Laifual HKEX prospectus; Schaeffler's IR deck and Q1 2026 call; MOFCOM export-control announcements via CSET/law-firm analysis; MP Materials, USA Rare Earth, Energy Fuels and Lynas quarterly disclosures.

**Named third-party research:** Morgan Stanley (Humanoid 100; Humanoid Tech 25), BofA (Humanoid Robots 101; Physical AI pt.2), Goldman Sachs, J.P. Morgan, McKinsey, UBS, GGII, Omdia, IDC, Yano Research, TrendForce, Interact Analysis, CSIS, SemiAnalysis, China Post Securities, Dongwu Securities, Fortune, TechCrunch, Reuters.

**Source-quality caveat, stated plainly:** the magnet-per-robot figures, per-actuator masses and rare-earth price series come from trade blogs and vendor sites, **not** from primary filings or paid price assessments (Argus/Fastmarkets). They are directionally corroborated but should not go into a client deck without a primary subscription. The **structural** claims — China's share of each stage, the export-control law, MP/USAR/Lynas/Neo capacity and timing, Musk's statements, every filing-based number in §5 — are anchored in filings, law-firm briefs, exchange disclosures or major press, and are solid. **Weight accordingly.**

**What this document does NOT do:** it does not size the roller-screw or magnet TAM bottom-up with dollar precision, and it does not value any security. Those are the next steps.

---

*Prepared for Summit Research robotics coverage. Provenance discipline per `HANDOFF_robotics_coverage.md` §2. Every `[C]` claim in this document requires independent corroboration before any rating. When in doubt, verify against primary filings before asserting.*
