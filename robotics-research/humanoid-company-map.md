# The Humanoid Company Map — What Is Actually Mappable

**Summit Research · Robotics Coverage · Phase 4**
**Prepared:** 14 July 2026 · **Owner:** SAB
**Companion docs:** [`humanoid-supply-chain.md`](humanoid-supply-chain.md) (Phase 3 — BOM & chokepoints) · [`HANDOFF_robotics_coverage.md`](HANDOFF_robotics_coverage.md) (master context) · [`robotics-technology-landscape.md`](robotics-technology-landscape.md) (Phase 1–2)
**Interactive companion:** `humanoid-company-map.html` (local)

**Provenance legend:** `[D]` Disclosed (filing / official document / management on the record) · `[I]` Independent third party (broker, teardown, named journalist) · `[C]` Company claim (promotional; unverified) · `[E]` Estimate or inference · **RUMOR** = unnamed sources / self-media, no company confirmation

---

## 0. The question, and the answer

**The question:** how much of the humanoid ecosystem can we actually map in terms of companies?

**The answer:** *as a supply chain — almost none of it. As a map of capability and exposure — most of it.* Those are two different maps, and the market is trading the first one while only the second one exists.

This document builds the second one. It is the company-level counterpart to the Phase-3 memo: where that document asked *"where does the money go?"*, this one asks *"which listed entity actually touches it, and how do we know?"*

**The three findings:**

**1. The supplier graph has ~6 verifiable edges in the entire sector.** Not 60. Six. Every other arrow drawn on every humanoid supply-chain map in circulation is a company claim, a Chinese self-media post, or — four times — a relationship the alleged supplier **publicly denied**. §2 counts them.

**2. Eight companies on earth disclose a humanoid number.** Everyone else in the seven-layer taxonomy reports zero, or reports nothing. That list — and its brutal shortness — is the single most useful table in this document. §3.

**3. What *is* fully mappable is physical capacity,** because it is published, auditable, and denominated in units rather than narrative. And when you map it, it locates the scarcity precisely where the Phase-3 memo said it was: **roller screws and the thread grinders behind them.** §4.

> **The reframing: stop trying to draw the supply chain. Draw the capability map and the disclosure ledger — and treat every unverified edge as what it is: a marketing asset of the company that wants you to own it.**

---

## 1. Why the supplier graph cannot be drawn

Three independent causes, each sufficient on its own:

**1. The OEMs that matter are vertically integrated, so there is no edge to draw.** Tesla designs its own actuators (6 custom types across 28 actuators) and has **never publicly named a single Optimus supplier** `[D]`. Figure states it is *"vertically integrated across... actuators, batteries, sensors, structures, and electronics, all of which were designed completely in-house"* `[C]` — and gives the reason: **the absence of an established supply chain.** Unitree names vertical integration in its **IPO prospectus** as the source of its cost leadership `[D]`. You cannot map a supplier relationship that the OEM has deliberately internalised.

**2. The volumes are below the materiality threshold that forces disclosure.** ~13–18k units shipped globally in 2025, mostly research and entertainment units from three Chinese firms. No supplier relationship at that scale crosses the bar that would put it in a filing.

**3. Consequently, Bloomberg SPLC — which is *built from* filings and transcripts — returns zero humanoid relationships.** We checked it directly (12 companies, incl. Tesla and UBTECH as humanoid OEMs). **Tesla's SPLC supplier list is a car supply chain:** CATL (14.5% of cost), LG Energy, Panasonic, NVIDIA, ST, Aptiv, Forvia, Autoliv, Hankook Tire `[D]`. Not one actuation, screw, or humanoid-specific name. *The absence is the finding.*

> **If humanoid procurement were material, it would appear in somebody's financials. It does not. The chain exists as a narrative, a capex cycle and a press-release corpus — not yet as money.**

### 1.1 A methodological warning about the SPLC data itself

Yesterday's parse of the Bloomberg export carried **"BYD = 12.2% of UBTECH's cost"** into the Phase-3 memo §5. On audit, the underlying cell reads **0.1215** in a column whose other values are unambiguously percent units (CATL = 14.5224 = 14.5% of Tesla's cost; file range 0.0008–52.6). Read consistently, **BYD is 0.12% of UBTECH's cost — 100x smaller.** The `Supply Chain Relationship Amount` column cannot arbitrate, because it does not reproduce `Cost Percentage` even for Tesla ($2.5bn of CATL against a ~$72bn COGS is ~3.5%, not 14.5% — Bloomberg estimates the percentage on a different basis).

**Status: the magnitude is UNRESOLVED and must not be quoted until the field definition is checked in the terminal (FLDS).** The *structural* claim is unaffected and stands: **UBTECH's disclosed suppliers are 100% Chinese — BYD, Orbbec (3D vision), Awinic** `[D]`.

*This is logged here rather than quietly fixed, because a 100x error that survived one document is exactly the failure mode the provenance discipline exists to catch. Phase-3 §5 is corrected accordingly.*

---

## 2. The edge register — every supplier→OEM relationship, graded

This is the whole supplier graph of the humanoid industry. It is this short.

### ✅ CONFIRMED — both endpoints named, in a filing or by the party itself

| Supplier | → | Customer | What | Evidence | Tag |
|---|---|---|---|---|---|
| **ABB** | → | **1X** | Harmonic drives | 1X names it on its own site, Apr 2026 | `[D]` |
| **Leaderdrive** | → | **Unitree, Galbot** | Harmonic reducers | Third-party reporting, 2026 | `[I]` |
| **BYD** | → | **UBTECH** | Components (magnitude unresolved — §1.1) | Bloomberg SPLC | `[D]` |
| **Orbbec** | → | **UBTECH** | 3D vision | Bloomberg SPLC | `[D]` |
| **Awinic** | → | **UBTECH** | Analog / audio semis | Bloomberg SPLC | `[D]` |
| **Huachen** | → | **Fulilwang** | **100 internal-thread grinders**, ~RMB 180M, 1-yr delivery, 25 Mar 2025 | Exchange disclosure | `[D]`/`[I]` |

**Six edges.** Note what they are *not*: not one of them touches Tesla or Figure. Five of the six point at second-tier OEMs. The sixth — Huachen→Fulilwang — is **capital equipment, not a robot part**, and it is nonetheless *the single most informative edge in the sector*: it is **the only dated, sized, customer-named order in the entire record**, and it is for the machines that make the bottleneck component.

### ❌ DENIED — by the alleged supplier itself, or by the alleged customer

| Rumoured edge | Alleged size | What actually happened |
|---|---|---|
| **Sanhua → Tesla** (linear actuators) | **$685M / >RMB 5bn (~180k robots)** | **DENIED, 15 Oct 2025: "传言不属实" — the rumour is untrue.** Sanhua also denied giving the interview it was attributed to. **This is the most-cited "Tesla supplier confirmation" in the market.** |
| **Wolong → Tesla** | 200,000 motors | **REFUTED** — Tesla is **<0.5%** of subsidiary SIR's operating income `[D]` |
| **PharmAGRI → Tesla** | LOI for 10,000 Optimus | **"Fake." — Elon Musk, on X** |
| **Xinqianglian → humanoids** | — | **"公司暂时没有进入人形机器人领域的计划"** — no plans to enter the field `[D]` |

### 🟡 RUMOUR — no filing, no company confirmation, still being traded

Leaderdrive as a Tesla second-source (10,000-unit 2026 order) · Shuanghuan/Huandong "Optimus-certified for waist/finger joints" · Hengli "in Tesla's supply chain" · Tuopu as "exclusive Optimus rotary actuator supplier" · Wanxiang "Optimus Gen-3 crossed-roller bearings at 5,000/week" · Wuzhou Xinchun "passed the Optimus factory audit" (**the company says it is NOT a direct Tesla supplier**) · "GSA supplies Optimus's 14 screws" · Zhongdali De "50,000-unit AgiBot order" · Tesla grinding roller screws in-house · Leadshine → Tesla (**a meeting at CES is not a design win**) · Mirle / Asia Optical → Tesla · LG Energy → Tesla/Boston Dynamics/Figure (unnamed sources — plausible, formally unconfirmed).

**Count: ~6 confirmed · 4 denied · ~12 rumoured.** The tradeable narrative is built almost entirely on the last two columns.

> **The headline: Tesla has never publicly named an Optimus supplier. Figure builds its own. Every "Optimus supply chain" position in the market is supplier self-disclosure, Chinese self-media, or a claim the alleged supplier denied on the record.**

**Independent corroboration from another direction:** a **Goldman Sachs** report (Nov 2025) found that **no Chinese humanoid supplier had confirmed a substantial order or a clear production timeline**, despite RMB 6bn+ of announced capex. The companies then confirmed it themselves — Tuopu: *"no major orders currently"*; Sanhua: *"progressing normally"*; Best Precision: *"small-batch sampling only."* `[I]`

---

## 3. The disclosure ledger — who actually books humanoid money

Here is the mappable universe, ranked by the only metric that cannot be faked: **a humanoid number in a filing.**

| # | Company | Layer | The disclosed humanoid number | Date | Tag |
|---|---|---|---|---|---|
| 1 | **Harmonic Drive (6324 JP)** | Reducers | **Explicit "AI/humanoid" revenue line: ¥1.9bn FY25 → ¥2.3bn FY26 → ~¥7.1bn FY28 → ¥13.3bn FY30 (plan)** | 3 Jul 2026 | `[D]` |
| 2 | **UBTECH (9880 HK)** | OEM | **Humanoid revenue ¥820M (+2,204% y/y); net loss ¥789.8M; 1,079 full-size units delivered** | FY2025 | `[D]` |
| 3 | **Unitree (STAR, IPO approved 2 Jul 2026)** | OEM | **5,215 units sold; ASP ¥166,400 (−36% y/y); GM ~60%** | Prospectus | `[D]` |
| 4 | **Regal Rexnord (RRX)** | Motors | **Humanoid orders $40M (FY2025) → ~$1M (Q1 2026)** — a >90% collapse | 12 May 2026 | `[D]` |
| 5 | **Schaeffler (SHA GY)** | Screws / actuation | **5 contracts, "mid three-digit €m" lifetime; 32 sample + 1 serial order; addresses ~50% of BOM. <1% of 2025 sales — and EXPLICITLY EXCLUDED from its own 2028 targets** | 5 Feb / 5 May 2026 | `[D]` |
| 6 | **Agility Robotics (private)** | OEM | **~$37M TTM revenue; ~100 Digits with paying customers; ~$100M 2025 burn** | SPAC filing | `[D]` |
| 7 | **Zhaowei (003021 CH)** | Micro-drives | **Robotics revenue RMB 23.87M = 1.4% of sales** | FY2025 | `[D]` |
| 8 | **Best Precision (300580 CH)** | Roller screws | **Humanoid PRS revenue RMB 223,000 = 0.03% of revenue** | 5 Jul 2026 | `[D]` |

**Everyone else discloses nothing, or discloses zero.** Including — and this is the point — every US-listed ticker on both viral seven-layer maps: NVDA, QCOM, MU, TXN, ON, MPWR, WOLF, NVTS, CGNX, AMBA, ALGM, OUST, LSCC, CEVA, AME, ALNT, TKR, MOG.A, MP, ALB, UUUU, USAR, SYM, SERV, ISRG. **Not one of them reports a humanoid revenue line.**

**Two entries deserve reading twice:**

- **Sanhua** built an **RMB 3.8bn** robot-actuator base and **Tuopu** an **RMB 5bn** robot e-drive base (300k actuators/yr, live). Both are real capex, in filings. **Neither discloses any robot revenue** — and on 12 Nov 2025 Tuopu said it has **"no major orders currently"** `[D]`. *Capex is not demand. It is a bet on demand, made with shareholder money.*
- **Harmonic Drive's own plan is the sanity check on the entire sector.** ¥13.3bn of AI/humanoid revenue in FY2030 = 13% of its ¥100bn target. At ¥15–30k ASP that implies **~30–60k Optimus-class robots/yr in 2030** `[E]` — **an order of magnitude below the bull case.** The world's #1 strain-wave maker is not underwriting the story being sold in its name.

---

## 4. The capability map — what *is* mappable, and what it says

Since the money isn't traceable, map the physics instead. Every number below is published, and every layer answers one question: **at what robot volume does this layer actually break?**

| Layer | Content per robot | World capacity / output | Breaks at | Who owns it (listed) |
|---|---|---|---|---|
| **Planetary roller screws** | ~14 (linear joints) | **200–600k units/yr across ALL end uses** `[E]` | **🔴 Already binding.** 1M robots need **14M** — a 20–70x gap | Beite (603009), Hengli, Best Precision (300580), Zhenyu, **Schaeffler/Ewellix** — thin, mostly Chinese |
| **Internal-thread grinders** | (capital equipment) | ≥RMB 12M each · **~2-yr lead times** · **46% of a screw line's capex** · export-restricted into China `[I]` | **🔴 The bottleneck behind the bottleneck** | Reishauer, Kapp Niles, Drake, Matrix, **Leistritz** — **almost all private** |
| **Sintered NdFeB magnets** | ~2–4 kg `[E]` | 90–94% China; ex-China ≈ **14,000 t/yr by end-2027 vs a 230,000 t market ≈ 6%** — and mostly pre-sold `[E]` | **🔴 Binding for geopolitics, not for volume** — humanoids are **~1.5% of the magnet market even at 1M robots/yr** | MP, USAR, Lynas, Neo, Energy Fuels · JL Mag, Zhongke Sanhuan, Ningbo Yunsheng (the licence winners) |
| **Harmonic reducers** | ~14 (rotary joints) | **Capacity 4.9M units vs 1.22M consumed (2024)** → **~25–40% utilization** `[I, GGII]` | **🟡 ~300–500k robots/yr.** A 100k program eats all current *consumption* but only ~30% of *nameplate* | **Harmonic Drive (6324)**, Leaderdrive (688017), Laifual, Nabtesco (6268, RV) |
| **Frameless torque motors** | ~28 | **Xinje alone is building ~2M sets of capacity for 2026** `[C]` vs a market that may build 20–30k robots | 🟢 Never — commoditizing into oversupply. Morgan Stanley's own note: **"lower technical barriers"** | RRX, Nidec, AME, ALNT, Xinje |
| **Bearings (incl. crossed-roller)** | ~$350–650/robot = **1–2% of BOM** `[E]` | Ample | 🟢 Never — **even a monopoly at 1M robots/yr is a <$700M market split ~10 ways.** IKO calls humanoid CRB **"prototype stage"** and cut growth capex **¥15bn → ¥7bn** `[C]` | TKR, RBC, THK, NSK, IKO |
| **Batteries** | **2.3 kWh** (Optimus) `[D]` | **1M robots = 2.3 GWh = ~0.15% of global li-ion capacity** — which is in structural oversupply | 🟢 Never | CATL, LGES, Panasonic, BYD |
| **Power-electronics semis** | **~$1,400/robot** `[I, UBS]` | — | 🟢 Never — **1M robots = $1.4bn of TAM split across TI, ST, Infineon, onsemi, Renesas, MPS, ADI.** TI alone does $16–17bn of revenue | TXN, STM, IFX, ON, RNECY, MPWR, WOLF, NVTS |
| **Compute (SoC)** | 3–10% of BOM · Jetson Thor **$3,499** `[D]`; the G1 uses an **RK3588 at RMB 1,415** `[I]` | — | 🟠 Real capability, **immaterial revenue** — humanoids are a rounding error in NVDA's P&L | NVDA, QCOM, Rockchip, LSCC, AMBA, CEVA |
| **Sensors / perception** | 8–12% of BOM | — | 🟠 Hard engineering, **no pricing moat** — Chinese tactile sensors fell from **>¥100,000 to ¥199** in five years `[I]` | **AEVA**, OUST, CGNX, AMBA, ALGM, Orbbec, DJI/Livox ($530 in the G1) |

> **Read the "Breaks at" column top to bottom. Exactly two layers are physically constrained at any plausible 2026–2030 volume, and one of them (grinders) is almost entirely private. That is the entire scarcity map of the humanoid economy.**

---

## 5. What this does to Summit's coverage

```
PERCEPTION (eyes)        COMPUTE (brain)       ACTUATION (muscle)      MATERIALS (bones)
   Aeva                     [STILL A GAP]         Moog                    [NO NAME]
   ────                     ────────────          ────                    ─────────
   8–12% of BOM             immaterial            NOT a humanoid play     ~1.5% of the magnet
   Chinese cost collapse    humanoid revenue      (§7 Phase 3 — a         market even at 1M
   Omni: ZERO announced     in NVDA/QCOM          CUSTOMER of Harmonic    robots/yr
   customers, pre-SOP       P&L                   Drive, per SPLC)
                                                                          
                    THE BOTTLENECK ─────────────────────────┐
                    planetary roller screws + thread grinders │
                    → NOBODY IN COVERAGE OWNS THIS ◄─────────┘
                       (and the grinder makers are private)
```

- **Aeva** — the humanoid angle is weaker than it looks. Sensors are 8–12% of BOM into a brutal cost collapse, and **Omni has zero announced customers**. The thesis remains design-win→production conversion in *automotive*. Humanoids are not a rescue.
- **Moog** — no humanoid exposure. **Confirmed** (Phase 3 §7). Do not build one. Its Industrial growth driver is **data-center cooling pumps** — if you want an AI story in Moog, that is the credible one.
- **The compute gap** is real but may not be worth filling: humanoid compute revenue is immaterial to NVDA and QCOM.
- **The layer that matters is the one nobody in coverage owns** — and the honest problem is that **it is barely investable in listed form**: the grinder makers are private, and the screw makers are mostly Chinese small-caps. The single Western franchise with a *disclosed* humanoid order book is **Schaeffler** — which addresses ~50% of the BOM, and **excludes the whole thing from its own 2028 targets.**

> **The mapping exercise ends with an uncomfortable conclusion: the best-evidenced way to own the humanoid bottleneck may not exist as a liquid Western equity. Everything that *is* liquid is either immaterially exposed or exposed to a layer that is oversupplied.**

---

## 6. How to use the interactive map

`humanoid-company-map.html` renders this as four views, all driven by one dataset:

1. **Layer map** — every company by layer, colour-coded by **evidence grade of its humanoid exposure**: 🟩 discloses a number · 🟦 capacity/product evidence, no revenue · ⬜ zero evidence · 🟥 denied. *The visual point: how much of the board is grey.*
2. **Edge register** — the ~22 relationships, filterable by confirmed / denied / rumour.
3. **Capacity calculator** — set robots/yr and watch each layer's required units cross (or fail to cross) world capacity. **This is the falsification engine:** it shows, live, that at any 2026–2030 volume only screws and grinders break.
4. **Disclosure ledger** — the 8 companies with a humanoid number, and the long list of tickers with none.

---

## 7. Open questions this map cannot close

1. **The SPLC `Cost Percentage` field definition** (§1.1) — must be checked in the terminal before any SPLC magnitude is quoted. *Highest-priority housekeeping item in the robotics folder.*
2. **Who is Agility's undisclosed ~$300M / ~1,000-robot customer?** One unnamed counterparty is approximately the entire Western humanoid order book.
3. **Do humanoid magnets need Dy/Tb?** (Carried from Phase 3 §12.) Actuators run cool and intermittent; Proterial ships Dy/Tb-free grades. **This single question flips the materials layer of this map.**
4. **Is a whirled roller screw good enough?** If Leistritz's whirling (8–10x throughput vs grinding) qualifies for humanoid-grade screws, **the grinder bottleneck evaporates and the scarcity trade in §4 dies overnight.** No published lead-accuracy data either way.
5. **The private-company problem.** The most-exposed entities in this map — Reishauer, Kapp Niles, Drake, Xinjian, Figure, Agility, AgiBot — are **unlisted**. Any listed-equity expression of this thesis is a second-best proxy, and should be underwritten as one.

---

## 8. Method note

**Built from:** the Phase-3 memo (`humanoid-supply-chain.md`), which carries the full source list; a direct re-audit of the Bloomberg SPLC export (`SPLC_BBG.xlsx`, 12 companies — re-parsed by column header after discovering that the Suppliers and Customers blocks do not share a column order, and cross-checked row-by-row against counterparty tickers); and the IFR-anchored value chain from Phase 1–2.

**What this document does NOT do:** it does not size the roller-screw or magnet TAM bottom-up in dollars, and it does not value any security. It maps who touches what, and how well we know it.

---

*Prepared for Summit Research robotics coverage. Provenance discipline per `HANDOFF_robotics_coverage.md` §2. Every `[C]` claim requires independent corroboration before any rating. An unverified edge on a supply-chain map is a marketing asset of the company that wants you to own it.*
