# HANDOFF — Non-Humanoid Robotics Workstream (resume here)

**Owner:** SAB · **Last worked:** 15 July 2026 (evening) · **Branch:** `feat/robotics-industry`
**Read this first, then open `industrial-robotics-revealed-moats.md`.**

---

## 0. One-paragraph state

The analyst team split robotics into different angles; **SAB's angle = Path 1, robotics that is NOT humanoids** (industrial automation — where the picks-and-shovels thesis pays with real invoices, not promises). We ran the analysis in two passes, both **DONE**: (1) a **vertical-integration matrix** of the Big 4 (FANUC, ABB, Yaskawa, KUKA) across 10 BOM layers, and (2) a **deeper supplier-web pass** (integrator-lens, ABB as anchor) that found the second-order moats. Everything is written up in **`industrial-robotics-revealed-moats.md`** (§0–§4b + bear case + histories + next steps). Nothing is half-finished. **The next move is choosing a direction from §7 (below).**

## 1. The thesis (why this works)

**Revealed preference of vertical integration.** The Big 4 have had 40–110 years and every incentive to make every part in-house. **What they still buy merchant = the real supplier moats** (complexity or a supplier advantage the OEM couldn't beat). This is far stronger evidence than any humanoid pitch — it's the market voting for four decades with real POs. Goal: find the component players **required no matter who wins the end layer** (OEM/integrator), that ride the physical-AI wave regardless.

## 2. The answer (what we found)

**Tier-1 (component) moats — the listed handles:**
- 🥇 **Precision reducers — Nabtesco (6268 JP) + Harmonic Drive (6324 JP).** Universal, unanimous (all 4 buy, even FANUC the most-integrated), ~30% of BOM, duopoly by architecture. The crown jewel. SPLC-proven: Nabtesco-% of revenue = FANUC 2.35 > ABB 1.47 > Kawasaki 1.35 > KUKA 1.31 > Yaskawa 0.88 (biggest customer = most integrated = the proof).
- 🥈 **Machine vision — Keyence (6861 JP) + Cognex (CGNX).** 3 of 4 buy (FANUC self-makes iRVision); real pricing power (Keyence ~50% op margin); grows hardest with physical AI.
- 🥉 Linear/bearings (THK 6481, NSK); force-torque (ATI → Novanta NOVT).

**Tier-2 (deeper) moats — mostly PRIVATE or GEOPOLITICAL (from the §4b deep pass):**
- 🧲 **Rare-earth NdFeB magnets** (Shin-Etsu/Proterial/TDK; ~90% China) — even the servo houses that make their own motors can't make the magnet.
- ⚙️ **Precision gear-grinding machines** (Reishauer >50%, Kapp-Niles, Gleason) — the chokepoint *behind* the reducer. Mostly private.
- Encoder sensing element (Heidenhain/Tamagawa — LTN folded into Heidenhain Apr-2026); IGBTs (Infineon/Mitsubishi/Fuji); joint brakes (Kendrion/Ogura); functional safety (SICK/Pilz — a *regulatory* moat); grippers (Schunk); dress-packs (igus/BizLink); bearing steel (Sanyo Special Steel); and the NEW software layer: **NVIDIA Omniverse/Isaac** (all 4 standardizing their sim-to-real on it).

**Two structural insights:** (1) the integrators are *themselves* arms dealers — Yaskawa/FANUC sell servos merchant into others' machines (Yaskawa Motion Control guided +19% FY26). (2) Midea is eroding KUKA's moats from inside (its Jiya reducer passed KUKA's 10,000-hr test; Chinese reducers now >30% of Chinese robot units) — the concrete mechanism of the Chinese-erosion bear case; but the deepest layers (grinders, encoders, magnet refining) are NOT localized.

## 3. 🎯 THE headline — the triple convergence

**Two upstream chokepoints — rare-earth magnets and precision grinders — are the SAME two the humanoid analysis independently found.** They are the deepest moats in BOTH the mature industrial economy AND the future humanoid one. At the deepest level, the pick-and-shovel that wins regardless is **the magnet and the grinder** — but both are largely private/geopolitical. The cleanest **listed** plays stay one tier up: **Nabtesco 6268, Harmonic Drive 6324, Keyence 6861.**

## 4. The bear case (don't forget)

Mature/cyclical base demand; Chinese eroding the low end (backlash parity, Harmonic Drive humanoid ASP −29%/yr, Midea localizing KUKA); diversification dilutes (Nabtesco is also aero/rail; THK/Keyence are diversified giants); the purest moats are Japanese mid-caps or private/geopolitical, not liquid Western names — same conclusion as the humanoid work.

## 5. Files (all in `robotics-research/`, gitignored dir — only `.md` are git-tracked)

| File | What | Git |
|---|---|---|
| `industrial-robotics-revealed-moats.md` | **THE deliverable** — matrix + moats + §4b deep web + convergence. Read this. | committed (7933009) + §4b commit |
| `HANDOFF-nonhumanoid-robotics.md` | this file | committed |
| `humanoid-tollbooth-screen.md` | the humanoid version of the same thesis (Phase 5) — the convergence partner | committed (b2ea354) |
| `humanoid-company-map.html` / `-OFFLINE.html` | the interactive humanoid map (5 tabs incl. Tollbooth screen); OFFLINE copy is self-contained | local only |
| `SPLC_BBG.xlsx` / `splc-reparsed.json` / `robotics-splc-parsed.json` | **Bloomberg SPLC** — the Nabtesco→Big-4 edges (the proof). **Keep local, never commit.** | local only |

## 6. How to resume tomorrow

1. `git checkout feat/robotics-industry && git pull origin main` if needed; the memos are on GitHub (synced to the other computer).
2. Read `industrial-robotics-revealed-moats.md` (esp. §3 ranking, §4b deep moats, §7 next steps).
3. To view the humanoid interactive map: `cd robotics-research && py -m http.server 8010` → open `http://127.0.0.1:8010/humanoid-company-map.html`.
4. Research method that worked: **parallel research agents, one per company/topic, provenance-graded [D]/[I]/[C]/[INF], anchored on the SPLC edges.** Reuse it.

## 7. Next steps — DIRECTION CHOSEN (17 Jul 2026)

**SAB's pick: the per-company deep-dive comparison of the OEMs themselves.** Not the component names — the *incumbents*. Lens per company: **(A) where the competitive advantage comes from, (B) how the supply chain is structured, (C) who the key suppliers are** — so they can be compared side by side. This complements the existing `industrial-robotics-revealed-moats.md` (which looked at the Big 4 *from outside*, via the build-vs-buy matrix); the new work profiles them *as companies*.

**Peer set chosen: Big 4 + Kawasaki + Estun (6).**
- **FANUC** (6954) — most integrated; Nabtesco's #1 customer (2.35%).
- **ABB** (ABBN → SoftBank) — integrator not servo-house; exited power semis; Robotics being sold to SoftBank (~$5.375bn, Oct 2025).
- **Yaskawa** (6506) — most electronically integrated + servo arms-dealer; Nabtesco's smallest OEM customer (0.88%).
- **KUKA** (Midea-owned) — most integrator-like; the live Chinese-erosion case study.
- **Kawasaki** (7012) — robotics is a tiny segment of a heavy-industry conglomerate; semiconductor-transfer-robot niche.
- **Estun** (002747 CH) — the Chinese challenger integrating UPWARD by design + M&A (Trio, Cloos); the contrast company. No SPLC edge — researched fresh.

**Method:** 6 parallel research agents (one per company), provenance-graded [D]/[I]/[C]/[INF], each anchored on its SPLC Nabtesco-% where available. Fired 17 Jul. **DONE:** the 6 profiles are in `oem-deepdives/*.md`; the synthesis is `oem-comparison.md` (the deliverable — organizing insight = the vertical-integration spectrum, all six sort onto it and every one still buys the reducer).

**Phase 2b DONE (17 Jul) — interactive page built:** `oem-comparison.html` (LOCAL-ONLY, like the humanoid map). Reuses the portal design system. 4 tabs: (1) **integration spectrum** — 6 clickable nodes ordered FANUC→Yaskawa→Estun→ABB→Kawasaki→KUKA, each opens a full profile panel (advantage / supply-chain / suppliers table / hooks / bear); (2) **master comparison** matrix; (3) **supplier map** — Nabtesco-% bars + build-vs-buy grid; (4) **fault lines & thesis**. Verified in-browser (no console errors). View: `cd robotics-research && py -m http.server 8010` → `http://127.0.0.1:8010/oem-comparison.html`. **Next options:** FANUC single-name deep-dive (quality end) · component deep-dive Nabtesco/Harmonic (moat end) · Estun/erosion quantification.

### Deferred options (were the earlier open decision):
1. Deep-dive Nabtesco (6268) + Harmonic Drive (6324) — the two component names it all lands on.
2. Port to an interactive page — the build-vs-buy matrix + tiered moat map, in the humanoid-map design.
3. Quantify the physical-AI TAM overlay.
4. The NVIDIA-Omniverse software-chokepoint angle.

## 8. Reminders

- **Never `git push` or open a PR without SAB's explicit go** — commit + tell him, that's it (`ask-before-opening-pr`).
- `.md` files are force-tracked (`git add -f`); `.html` and Bloomberg data stay local.
- Cross-links: the humanoid workstream (`humanoid-supply-chain.md`, `humanoid-company-map.md`, `humanoid-tollbooth-screen.md`) is the forward-looking twin of this backward-looking analysis — they converge on magnets + grinders.
