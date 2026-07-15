# Industrial Robotics: The Revealed Moats

**Summit Research · Robotics Coverage · Non-Humanoid Workstream · Phase 1**
**Prepared:** 15 July 2026 · **Owner:** SAB
**Companion:** [`humanoid-tollbooth-screen.md`](humanoid-tollbooth-screen.md) (the same thesis, forward-looking) · [`humanoid-supply-chain.md`](humanoid-supply-chain.md)

**Provenance:** `[D]` disclosed / teardown / company doc · `[I]` independent named source · `[C]` company claim · `[INF]` industry-structure inference · RUMOR.

---

## 0. The question, and the method

**The question (SAB):** in a world where *many* companies will build robots and it's impossible to pick the end-layer winner, is there a component player that gets **required no matter who wins** — a tollbooth that rides the physical-AI wave regardless?

**The method — revealed preference of vertical integration.** The four industrial-robot majors (FANUC, ABB, Yaskawa, KUKA) have had **40–110 years** and every commercial incentive to vertically integrate their bill of materials. After all that time, **what they still buy merchant is, by revealed preference, the layer that carries a genuine supplier moat** — a complexity or scale advantage the OEM could not beat. This is a far stronger signal than any humanoid pitch: it is the market voting, for four decades, with real POs. We profiled each incumbent's build-vs-buy across 10 BOM layers. This is the result.

---

## 1. The master matrix — who makes what, across the Big 4

**In-house** = the OEM designs *and* manufactures it · **Merchant** = bought from an outside specialist · **Mixed** = designs/assembles but the core component/element is bought.

| BOM layer | FANUC | ABB | Yaskawa | KUKA | Verdict |
|---|---|---|---|---|---|
| **1. Precision reducers** (RV + strain-wave) | Merchant | Merchant | Merchant | Merchant | 🔴 **UNIVERSAL MERCHANT — the moat** |
| **2. Servomotors** | In-house | In-house | In-house | **Merchant** (Kollmorgen/Siemens) | Servo houses integrate; the integrator buys |
| **3. Servo drives / amplifiers** | In-house | In-house | In-house | In-house | ✅ All integrate |
| **4. Controller & motion software** | In-house | In-house | In-house | In-house | ✅ All integrate — the OEM's own moat |
| **5. Encoders / feedback** | In-house | Mixed | In-house | Mixed | Servo houses in-house; integrators mixed |
| **6. Bearings** | Merchant | Merchant | Merchant | Merchant | 🔴 **UNIVERSAL MERCHANT** (NSK/NTN/SKF/THK) |
| **7. Ballscrews / linear guides** | Merchant | Merchant | Merchant | Merchant | 🔴 **UNIVERSAL MERCHANT** (THK/NSK/Hiwin) |
| **8. Machine vision** | **In-house** (iRVision) | Merchant (Cognex) | Merchant (Cognex) | Merchant (Cognex) | 🟠 3 of 4 buy — vision moat, ex-FANUC |
| **8b. Force-torque** | **In-house** (FS-15iA) | Merchant (ATI) | Mixed (ATI cell) | Merchant (ATI/Schunk) | 🟠 3 of 4 buy |
| **9. Power semiconductors** | Merchant (Fuji) | Merchant (*exited 2020*) | Merchant | Merchant | 🔴 **UNIVERSAL MERCHANT** silicon |
| **10. Structure** (castings, harness) | Mixed | Mixed | Mixed | Mixed | Design in-house, fab outsourced |

**The single most important row is the top one.** Every one of the four — including FANUC, the most vertically integrated manufacturer on earth, which makes its own servos, drives, encoders, CNC, controller *and* vision — **still buys its precision reducers.** Forty years, four companies, one unanimous verdict.

---

## 2. The revealed moats — the uniformly-merchant layers

The layers *all four* buy after decades of incentive to integrate = where the durable supplier advantages live:

**🔴 1. Precision reducers — the flagship moat. Nabtesco (6268 JP) + Harmonic Drive (6324 JP).**
- **Universal & unanimous.** All four design product lines *around* Nabtesco RV (large joints) and Harmonic Drive strain-wave (wrists). Even Midea-owned KUKA — with every incentive to localize — still buys Nabtesco and is building its *own harmonic line from scratch* rather than beating them at RV.
- **Biggest hardware line in the BOM (~30%, range 15–35%).** Maximal integration incentive — and still nobody integrated.
- **Why it's unbeatable:** micron-level cycloidal-gear machining, post-heat-treat distortion control, decades of tribology/durability know-how, and multi-million-dollar grinders (Mägerle) that only pay off at Nabtesco's ~60% global scale. Chinese Tier-1 reached backlash parity but only **70–85% of Japanese lifespan/torque** `[I]`.
- **SPLC-proven, and the magnitudes tell the story.** Of Nabtesco's revenue: **FANUC 2.35% · ABB 1.47% · Kawasaki 1.35% · KUKA 1.31% · Yaskawa 0.88%.** The ordering is the thesis: FANUC (highest robot volume, most integrated) is Nabtesco's *biggest* customer — because even it doesn't make reducers; Yaskawa (the servo champion) is the *smallest* — it makes everything electronic itself, yet **still can't make the gear.**
- Both **listed and liquid.**

**🟠 2. Machine vision — the software/ecosystem moat. Cognex (CGNX) + Keyence (6861 JP).**
- 3 of 4 buy (ABB "Integrated Vision" and Yaskawa "MotoSight" are re-badged **Cognex**; KUKA VisionTech is **Cognex** VisionPro). Only FANUC built its own (iRVision).
- Not a mechanical moat — an **imaging + algorithm + ecosystem** moat, with genuine **pricing power** (Keyence ~50% operating margins). The one perception layer that doesn't commoditize.

**🟡 3. Precision linear motion & bearings — the metallurgy moat. THK (6481) · NSK · SKF · Schaeffler.**
- Universal merchant (all four buy). But **lower pricing power** — big diversified names, more commoditized, robotics a modest share.

**🟡 4. Force-torque — a niche moat. ATI (→ Novanta NOVT) · Schunk.**
- 3 of 4 buy the sensor cell (FANUC makes its own). ATI is owned by listed Novanta; Schunk is private.

**🟡 5. Power semiconductors — universal merchant, but not ownable as a robotics play.** Fuji/Infineon-class silicon; ABB even *exited* its own IGBT business (2020). A moat so capital-intensive the incumbent walked away — but robotics is a rounding error in the power-semi TAM.

**What they all DID integrate** — servo drives, controllers, motion software (and, for the servo houses, motors + encoders). **This is the OEM's own moat: the coordinated electrical/control package — not a component.** It's why FANUC/Yaskawa are great businesses, but you can't buy "the reducer moat" by buying them.

---

## 3. The answer — the tollbooth ranking

Ranked by concentration × defensibility × pricing power × investability × physical-AI growth:

| # | The toll | Names (listed) | Why it wins regardless | The catch |
|---|---|---|---|---|
| **1** | **Precision reducers** | **Nabtesco 6268 · Harmonic Drive 6324** | Universal, unanimous, ~30% of BOM, 40 yrs un-integrated, duopoly by architecture. **The crown jewel.** | Chinese closing the low end (backlash parity, −ASP); mature/cyclical base demand |
| **2** | **Machine vision** | **Keyence 6861 · Cognex CGNX** | 3 of 4 buy + real pricing power + grows hardest with physical AI (perception is core to embodied AI) | FANUC self-makes; competitive AI-vision entrants |
| **3** | **Precision linear / bearings** | **THK 6481 · NSK** | Universal merchant, metallurgy moat | Commoditized, diversified, low robotics mix |
| **4** | **Force-torque** | **Novanta NOVT** (owns ATI) | Merchant for dexterous manipulation | Niche; small $ |

---

## 4. The convergence — why this is the strong result

**Two completely independent analyses now point at the SAME chokepoint.**

- The **forward-looking** humanoid tollbooth screen (`humanoid-tollbooth-screen.md`) — built from the future BOM — put **Harmonic Drive** at #2 and reducers as a core toll.
- This **backward-looking** revealed-preference analysis — built from 40 years of what incumbents never integrated — puts **reducers (Nabtesco + Harmonic Drive) at #1.**

They agree. The picks-and-shovels play SAB was looking for is **validated from both ends at once**: it's the toll the mature industry proves with four decades of POs, *and* the toll the physical-AI wave makes bigger (a humanoid needs ~14 reducers vs a ~6-axis industrial arm's 4–6; Harmonic Drive already books a disclosed "AI/humanoid" revenue line). **You don't have to pick the winning robot — every robot, industrial or humanoid, rolls through Nabtesco and Harmonic Drive.**

---

## 5. The bear case (state it honestly)

- **The base is mature and cyclical.** Industrial-robot reducer demand grows GDP-ish and swings with the auto/electronics capex cycle. The *growth* kicker is entirely physical AI — which is exactly the unproven part.
- **The low end is eroding.** Chinese reducer makers (Leaderdrive, Zhongda) hit backlash parity; Harmonic Drive's own ASP fell −29%/yr in the humanoid segment. The moat is real at the high end, softening at the low end — same dynamic we flagged in the humanoid work.
- **Diversification dilutes.** Nabtesco is aerospace/rail/auto too; Harmonic Drive is the purest, but small. THK/NSK/Keyence are diversified giants where robotics is a slice.
- **The purest moat may be a Japanese mid-cap, not a Western liquid name** — echoing the humanoid conclusion.

---

## 6. Company histories (one line each)

- **FANUC (6954)** — Fujitsu CNC spin-out (1972); ~50–65% global CNC; the "one yellow" lights-out machine; the most integrated OEM on earth — makes servos/drives/encoders/CNC/controller/vision, buys reducers/bearings/silicon.
- **ABB (ABBN)** — ASEA's IRB 6 (1974), first all-electric robot; an electrical conglomerate that integrates the electrical brain, exited power semis (2020), and is **selling Robotics to SoftBank ($5.375bn, Oct 2025)**.
- **Yaskawa (6506)** — coined "mechatronics" (1969); top-2 servo/drive house; Motoman (1977); integrates the entire motion loop, splits its reducer buy Nabtesco (proximal) / Harmonic Drive (wrist).
- **KUKA (private, Midea-owned since 2016/2022)** — Augsburg 1898; FAMULUS first 6-axis (1973); the most integrator-like — in-sources control, buys even motors merchant; moat is control + integration + automotive base.

---

## 7. Next steps (for discussion)

1. **Deep-dive Nabtesco (6268) and Harmonic Drive (6324)** — the two names this analysis lands on. Business quality, share, the Chinese-erosion bear case, the physical-AI kicker, valuation.
2. **Machine vision deep-dive — Keyence vs Cognex** — the #2 toll, and the one with the best pricing power.
3. **Port this to an interactive page** — the master matrix as a build-vs-buy grid + the tollbooth ranking, matching the humanoid map's design.
4. **The physical-AI overlay, quantified** — size the reducer/vision TAM uplift from humanoids on top of the mature industrial base.

---

*Framework/coverage memo — no security is valued here. Built from four parallel incumbent supply-chain profiles (FANUC, ABB, Yaskawa, KUKA), each provenance-graded, anchored on the Bloomberg SPLC Nabtesco→Big-4 edges. Every `[C]`/`[I]` claim requires primary corroboration before any rating. Bloomberg SPLC magnitudes are algorithmic estimates — read exact figures off the terminal.*
