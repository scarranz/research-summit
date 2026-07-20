# Cross-OEM Supplier Recurrence — Where the Same Players Repeat

**Summit Research · Robotics · Non-Humanoid Workstream · Phase 3**
**Prepared:** 20 July 2026 · **Owner:** SAB
**Companions:** [`industrial-robotics-revealed-moats.md`](industrial-robotics-revealed-moats.md) (the build-vs-buy matrix) · [`oem-comparison.md`](oem-comparison.md) (the 6 profiles) · `oem-deepdives/*.md`

**Provenance:** `[D]` disclosed/teardown · `[I]` independent named source · `[C]` company claim · `[INF]` industry-structure inference. SPLC = Bloomberg Supply-Chain (team anchor).

---

## 0. The question (SAB's framing)

> Don't just profile ABB. **Compare all the big industrial-robotics OEMs side by side and find where the SAME supplier repeats in a specific component.** A player that shows up in that component across FANUC *and* ABB *and* Yaskawa *and* KUKA *and* Kawasaki — even the ones with every incentive and every decade to build it themselves — is where the real moat is. Recurrence across the incumbents = the answer.

This is the revealed-preference test applied **horizontally**: read each row across the six OEMs and count how many buy from the same name.

---

## 1. The recurrence matrix — one supplier per cell, read ACROSS the row

Six OEMs, ordered most→least vertically integrated. **🟩 in-house** (the OEM's own moat) · **🟥 merchant** (bought — where a supplier moat can live). The names in the merchant cells are the recurrence signal.

| Component (BOM layer) | FANUC | ABB | Yaskawa | KUKA | Kawasaki | Estun | Recurring player(s) | Verdict |
|---|---|---|---|---|---|---|---|---|
| **RV reducers** (large joints) | 🟥 **Nabtesco** | 🟥 **Nabtesco** (+some in-house cycloidal) | 🟥 **Nabtesco** | 🟥 **Nabtesco** | 🟥 **Nabtesco** | 🟥 Zhejiang Huandong (CN) | **Nabtesco — 5/6** (all incumbents) | 🔴 **THE moat** |
| **Strain-wave reducers** (wrist) | 🟥 **Harmonic Drive** | 🟥 **Harmonic Drive** | 🟥 **Harmonic Drive** | 🟥 **Harmonic Drive** → Midea Jiya localizing | 🟥 **Harmonic Drive** | 🟥 Chengdu Ruidrive (CN) | **Harmonic Drive — 5/6** | 🔴 **THE moat** |
| **Machine vision** | 🟩 in-house (iRVision) | 🟥 **Cognex** (rebadged) | 🟥 **Cognex** (MotoSight) | 🟥 **Cognex** (VisionTech=VisionPro) | 🟥 Cognex/Keyence (inferred) | 🟥 Euclid Labs (20%)+own | **Cognex — 3–4/6** | 🟠 software/ecosystem moat |
| **Force-torque sensing** | 🟩 in-house (FS-15iA) | 🟥 **ATI** | 🟥 **ATI** | 🟥 **ATI**/Schunk | 🟥 merchant (inferred) | 🟥 Barrett (minority) | **ATI (→Novanta) — 3/6** | 🟠 niche moat |
| **Servomotors** | 🟩 in-house | 🟩 in-house (ABB Motion) | 🟩 in-house | 🟥 **Kollmorgen**/Siemens → Midea Welling | 🟥 unconfirmed (likely merchant) | 🟩 in-house | (mostly in-house) | ⚪ OEM's own moat; KUKA the outlier |
| **Servo drives / amplifiers** | 🟩 in-house | 🟩 in-house | 🟩 in-house | 🟨 Midea (Welling) | 🟩 in-house design | 🟩 in-house | — | ⚪ OEM's own moat |
| **Controller + motion SW** | 🟩 in-house | 🟩 in-house (RobotStudio) | 🟩 in-house | 🟩 in-house (KRC) | 🟩 in-house (E/F) | 🟩 in-house (Trio IP) | — | ⚪ **the OEM moat** — nobody buys |
| **Encoders (position)** | 🟩 in-house | 🟨 mixed | 🟩 in-house (23-bit) | 🟨 mixed | 🟩 in-house design | 🟩 in-house | element: Heidenhain/Tamagawa | 🟡 upstream element merchant |
| **Bearings** | 🟥 NSK/NTN/SKF/THK | 🟥 same set | 🟥 same set | 🟥 same set | 🟥 same set | 🟥 mix CN+import | **NSK/NTN/SKF/THK — 6/6** | 🟡 universal but commoditized |
| **Linear guides / ballscrews** | 🟥 THK/NSK | 🟥 THK/NSK | 🟥 THK/NSK | 🟥 THK/NSK | 🟥 (inferred) | 🟥 CN+import | **THK/NSK/Hiwin — ~6/6** | 🟡 universal, low pricing power |
| **Power semis (IGBT)** | 🟥 Fuji | 🟥 merchant (exited 2020) | 🟥 merchant | 🟥 merchant | 🟥 merchant | 🟥 merchant | **Infineon/Mitsubishi/Fuji — 6/6** | 🟡 universal, robotics ≈ rounding error of TAM |

**Upstream (2nd-order) — the deepest recurrence, mostly private/geopolitical:**

| Upstream chokepoint | Recurs across | Names | Listed handle? |
|---|---|---|---|
| **Rare-earth NdFeB magnets** — *even the OEMs that make their own motors can't make the magnet* | **6/6** | Shin-Etsu · Proterial · TDK; ~90% China refining | Shin-Etsu, TDK; miners MP/Lynas/JL Mag |
| **Precision gear-grinders** — the machine *behind* the reducer | **6/6** (via the reducer makers) | **Reishauer** (>50%) · Kapp-Niles · Gleason | mostly **private** |
| **Encoder sensing element/ASIC** | 3–4/6 | Heidenhain · Tamagawa · iC-Haus | private (Heidenhain/Tamagawa) |
| **Joint holding brakes** | ~all | Kendrion · Ogura | Kendrion, Ogura |
| **Functional safety (SIL/PLe)** | ~all | SICK · Pilz · Keyence | SICK, Keyence |
| **Physical-AI sim stack (NEW)** | all standardizing | **NVIDIA** Omniverse/Isaac | NVDA |

---

## 2. Reading the matrix — the recurrence tiers

**Tier 0 — the unanimous recurrence (the answer):**
**Nabtesco (RV) + Harmonic Drive (strain-wave).** Every single incumbent — FANUC (most integrated OEM on earth), ABB, Yaskawa (most electronically integrated), KUKA, Kawasaki — buys **the same two Japanese firms** for the precision reducer. Six companies, 40–110 years of integration incentive, one unanimous verdict. The SPLC magnitudes even rank the dependence: **Nabtesco-% of revenue = FANUC 2.35 > ABB 1.47 > Kawasaki 1.35 > KUKA 1.31 > Yaskawa 0.88** — the *more* integrated the OEM, the *bigger* its Nabtesco bill. Only Estun (Chinese state-champion) has localized, to Chinese merchants (Huandong RV / Ruidrive harmonic) — and only at 70–85% of Japanese lifespan. **This row is the whole thesis.**

**Tier 1 — the strong recurrence:**
**Cognex** in machine vision (3–4 of 6 — ABB/Yaskawa/KUKA all rebadge Cognex; only FANUC self-makes) and **ATI (→Novanta)** in force-torque (3 of 6). Not mechanical moats — an imaging+algorithm+ecosystem moat (Cognex/Keyence, ~50% op margins) and a dexterous-manipulation niche. These grow *hardest* with physical AI (perception + touch are core to embodied robots).

**Tier 2 — universal but commoditized:**
Bearings (NSK/NTN/SKF/THK), linear guides (THK/NSK/Hiwin), power semis (Infineon/Mitsubishi/Fuji) recur 6/6 — but they're diversified giants where robotics is a thin slice, so recurrence ≠ pricing power.

**Tier 3 — the deepest, upstream, but un-investable cleanly:**
Rare-earth **magnets** and precision **grinders (Reishauer)** recur 6/6 *below* even the in-house layers — but they're private or geopolitical (China-gated), not liquid equities.

**The negative space matters too:** servomotors, drives, controllers and motion software are **in-house at almost everyone** → no supplier recurs there because *that's the OEM's own moat*. You can't buy "the reducer moat" by buying FANUC/Yaskawa — you buy it by buying what they're all forced to buy.

---

## 3. The answer

> **The players that repeat across the biggest industrial-robotics OEMs — in the value-dense components none of them could integrate — are, in order:**
> 1. **Nabtesco (6268 JP)** + **Harmonic Drive (6324 JP)** — precision reducers. Unanimous (5/6 incumbents), ~30% of the BOM, duopoly by architecture. **The crown jewel.**
> 2. **Cognex (CGNX)** + **Keyence (6861 JP)** — machine vision. Recurs 3–4/6, real pricing power, grows with physical AI.
> 3. **ATI → Novanta (NOVT)** — force-torque. Recurs 3/6, niche but dexterity-critical.
> 4. *(upstream, not clean equities)* rare-earth magnets (**Shin-Etsu, TDK, Proterial**) + **Reishauer** grinders — recur 6/6 but private/geopolitical.

This is the same conclusion the **build-vs-buy matrix** reached from the vertical angle and the **humanoid tollbooth screen** reached from the forward angle — now confirmed a third way, by **horizontal recurrence across the incumbents**. Triangulated from three independent directions, the toll is **the reducer**.

---

## 4. Gaps to close (worth a targeted research pass)

- **Kawasaki** is the thinnest column: servo-motor supplier unconfirmed; vision and force-torque not disclosed (inferred). Confirming these tightens the recurrence count.
- **ABB "in-house cycloidal"** — how much RV does ABB actually self-make vs buy from Nabtesco? Sizing this refines ABB's 1.47% dependence.
- **Per-OEM magnet & grinder tracing** — the upstream 6/6 recurrence is inferred from industry structure; naming the actual magnet supplier per OEM would harden Tier 3.
- **Estun's Chinese suppliers** (Huandong, Ruidrive) — are these the same names appearing behind *other* Chinese OEMs (Inovance, JAKA)? If Chinese reducer recurrence is consolidating, that's the erosion story quantified.

---

## 5. Next steps

1. **Port this recurrence matrix into `oem-comparison.html`** as a new tab (it already has a "supplier map" tab — this is the natural companion: a color-coded in-house/merchant grid with the recurring names highlighted).
2. **Close the Kawasaki + magnet/grinder gaps** with a short parallel-agent research pass (method that worked before).
3. **Deep-dive the two names it lands on** — Nabtesco (6268) + Harmonic Drive (6324): share, Chinese-erosion bear case, physical-AI kicker, valuation.

---

*Framework/coverage memo — no security valued here. Synthesized from the six provenance-graded OEM deep-dives, anchored on Bloomberg SPLC Nabtesco→OEM edges. Every `[C]`/`[I]` claim needs primary corroboration before any rating; SPLC magnitudes are algorithmic estimates — read exact figures off the terminal.*
