# Industrial-Robot OEMs — The Comparative Deep-Dive

**Summit Research · Robotics Coverage · Non-Humanoid Workstream · Phase 2**
**Prepared:** 17 July 2026 · **Owner:** SAB
**Companion:** [`industrial-robotics-revealed-moats.md`](industrial-robotics-revealed-moats.md) (the Big-4 *from outside* — the build-vs-buy matrix) · per-company profiles in [`oem-deepdives/`](oem-deepdives/)

**Provenance:** `[D]` disclosed/filing · `[I]` independent named source · `[C]` company claim · `[INF]` structure inference.

---

## 0. The question this memo answers

The revealed-moats memo looked at the incumbents *from the outside* — "what do all four leave merchant?" (answer: the reducer). This memo looks at them *as companies*: **for each OEM, (A) where does the competitive advantage actually come from, (B) how is the supply chain structured, and (C) who are the key suppliers** — so they can be ranked and compared. Peer set: **the Big 4 (FANUC, ABB, Yaskawa, KUKA) + Kawasaki + Estun.**

**The organizing finding:** the six sort onto a single **vertical-integration spectrum**, and *where a company sits on it is its identity*. At one end, the Japanese servo-houses make the entire electrical loop; at the other, Estun is trying to make everything *including* localizing the one part the Japanese never could. The Western names sit in the middle as integrators. **But every one of them, at every point on the spectrum, still buys the precision reducer** — the spectrum bends around that one fixed point.

---

## 1. The master comparison table

| | **FANUC** (6954) | **Yaskawa** (6506) | **ABB** (ABBN→SoftBank) | **KUKA** (Midea) | **Kawasaki** (7012) | **Estun** (002747) |
|---|---|---|---|---|---|---|
| **Identity** | Most-integrated pure-play | Servo-house + arms-dealer | Electrical integrator | Systems integrator | Conglomerate division | Chinese challenger |
| **Origin** | Fujitsu CNC (1972) | Motor/"mechatronics" (1915/1969) | ASEA IRB 6 (1974) | Augsburg 1898 / FAMULUS 1973 | Unimate license (1969) | Servo/motion-control (1993) |
| **Ownership** | Public, no controlling holder | Public, dispersed | → **SoftBank 100%** (close mid/late-26) | **Midea 100%**, delisted 2022 | Div. of KHI conglomerate | Founder ~38%, SZSE+HK listed |
| **Robot revenue** | ~¥386bn (~45% of ¥858bn) | ~¥247bn (~46% of ¥542bn) | ~$2.3bn (~7% of group) | ~€3.7–3.9bn (robotics-led) | ~¥86bn (**~4% of group**) | ~RMB 4.0bn (~US$553m) |
| **Profitability** | Op margin **~21%** | Op margin ~9% | Robotics EBITA **12.1%** | EBIT collapsed −52% FY24 | Segment blended | **Loss-making** (−RMB 817m FY24) |
| **Global share** | **#1** (~17–20%) | Top-4 (~#3–4) | **#2** | Top-5 | ~8%, smallest major | ~#2 in China, top domestic |
| **Advantage source** | Integrated loop **+ CNC dominance** | Servo/drive tech, sold merchant too | Controllers + **RobotStudio** SW + range | **BIW integration** + China channel | **Wafer-transfer niche** + surgical JV | **In-house servo** + localization + state |
| **Makes servos?** | ✅ in-house | ✅ in-house (+ sells merchant) | ✅ in-house (ABB Motion) | ❌ buys (Kollmorgen/Siemens) | ~in-house electronics, motor unconfirmed | ✅ in-house (its origin) |
| **Makes reducers?** | ❌ | ❌ | ❌ (some in-house cycloidal) | ❌ | ❌ | ❌ (buys **Chinese** merchant) |
| **Nabtesco % of rev** | **2.35** (its #1 customer) | **0.88** (smallest) | 1.47 | 1.31 | 1.35 | n/a (Chinese reducers) |

---

## 2. The vertical-integration spectrum — the core organizing insight

```
MOST INTEGRATED (electrical loop in-house)                         LEAST (buys the loop)
◄─────────────────────────────────────────────────────────────────────────────────►
 FANUC ──── Yaskawa ──── Estun ──── ABB ──── Kawasaki ──── KUKA
  │           │            │          │          │            │
 servos+      servos+      servos+    servos+    controllers  controllers
 drives+      drives+      drives+    drives+    +electronics +software ONLY;
 encoders+    encoders+    controllers motors    (motor       buys motors,
 CNC+         +sells       (buys      (buys      supplier     reducers, vision
 vision+      merchant     reducers   reducers,  unconfirmed; merchant
 force        (arms-       from       vision,    buys
 (buys        dealer)      China)     force      reducers)
 reducers)                            merchant)
```

**Read it left-to-right:**
- **FANUC & Yaskawa (Japanese servo-houses)** — deepest electrical integration. FANUC adds a **second engine, CNC (~50–65% global share)**, that no one else has and that pulls robots through its installed base. Yaskawa adds the **arms-dealer twist**: it sells the same servos/drives *merchant* into semiconductor & datacenter equipment (Motion Control, guided ~+19% FY26) — a picks-and-shovels line decoupled from its own robot cycle.
- **Estun (the anomaly)** — sits surprisingly *far left* on make-vs-buy because its origin is servo/motion-control, so it makes servos, drives and controllers in-house like the Japanese. The difference is **quality and profitability, not integration**: it makes the electrical loop but at lower reliability, and loses money doing it. It even localized the reducer — to *Chinese* merchants (Zhejiang Huandong RV, Chengdu Ruidrive harmonic), the mirror-image of the Japanese chokepoint.
- **ABB & KUKA (Western integrators)** — moat is **software + systems integration + relationships**, not components. ABB owns motors/drives (ABB Motion) and world-class simulation software (RobotStudio) but **exited power-semis** and buys reducers/vision merchant. KUKA is the extreme: it buys even its **servomotors** merchant — its value-add is control software + automotive body-in-white integration.
- **Kawasaki (the outlier)** — robotics is **~4% of a heavy-industry conglomerate** and not even a standalone segment. In-house controllers/electronics, but no merchant component business and (uniquely) an **unconfirmed servomotor source**. Its real edge is a **niche**: #1 in atmospheric wafer-transfer clean robots for semis, plus the Medicaroid surgical-robot JV.

---

## 3. Where each company's advantage ACTUALLY comes from (ranked, per company)

| Company | #1 advantage (most durable) | Nature of the moat |
|---|---|---|
| **FANUC** | CNC dominance → robot pull-through (unique) | Distribution flywheel + integration + reliability |
| **Yaskawa** | Servo/drive tech monetized twice (robots + merchant) | Component tech + a demand stream decoupled from robots |
| **ABB** | Controllers + RobotStudio software + range breadth | Software + installed base + switching costs |
| **KUKA** | Automotive body-in-white line integration | Relationships + process IP (NOT components) |
| **Kawasaki** | Semiconductor wafer-transfer niche leadership | Application niche + conglomerate engineering base |
| **Estun** | In-house servo stack + China localization + state tailwind | Cost + policy + vertical integration by design/M&A |

**The pattern:** only **FANUC and Yaskawa** have advantages rooted in *component technology they own*. ABB and KUKA have advantages rooted in *software and relationships* — which is why they are the most exposed to a component-localizer. Kawasaki's is a *niche*. Estun's is *cost + policy*. **This is why the reducer chokepoint matters more to the integrators than to the servo-houses** — and why the servo-houses (FANUC, Yaskawa) are the higher-quality businesses even though they, too, buy the reducer.

---

## 4. The three structural fault lines the comparison exposes

**1. Two of the six are leaving the "independent Japanese/Western OEM" model entirely.**
- **ABB → SoftBank** ($5.375bn, closes mid/late-2026): robotics severed from its conglomerate parent, folded into a financial owner's "Physical AI" thesis. Loses group motor/drive captive supply + procurement scale; gains capital + a software/AI repositioning. **Governance discontinuity.**
- **KUKA → Midea** (100%, delisted 2022): a Chinese appliance giant owns a German champion — and is **localizing its supply chain from the inside** (Jiya harmonic reducer passed KUKA's 10,000-hr test; Welling motors/drives; MR SEMI chips). KUKA is simultaneously an OEM *and* the vehicle through which Chinese components get tier-1 certification.

**2. The Chinese-erosion thesis has a face, and it's Estun.** Estun is the concrete mechanism of the bear case that runs through all six: it hit **#1 in China overall (H1 2025)**, is built the inverse way (integrate upward, localize the reducer to Chinese suppliers), and prices 15–60% below imports. The counter: it is **loss-making**, and its bought-in Chinese reducers still run only ~70–85% of Japanese lifespan/torque. **The whole incumbent moat rests on that last 15–30% quality gap holding.**

**3. Kawasaki proves "robot exposure" and "robot investability" are different things.** At ~4% of a ¥2.1trn aerospace/ships/rail/motorcycle group, 7012 is *uninvestable as a robotics thesis* — the opposite of FANUC. It's the clean illustration that the way to get robotics exposure is not to buy a conglomerate that happens to contain robots.

---

## 5. What the comparison means for the thesis (the tie-back)

The revealed-moats memo already established the **component** conclusion: reducers (Nabtesco/Harmonic) are the tollbooth. This company-level comparison adds the **OEM-level** conclusion:

> **The reducer chokepoint is invariant across the entire spectrum.** From FANUC (most integrated, Nabtesco's #1 customer at 2.35%) to KUKA (least integrated, buys even its motors) to Estun (integrating upward, forced to localize the reducer to *Chinese* merchants) — **not one of the six makes its own precision reducer.** Six companies, four countries, three ownership models, two continents of manufacturing, and one unanimous verdict: nobody integrates the gear. The company-by-company view doesn't just confirm the component thesis — it shows the thesis survives *every* strategic posture an OEM can adopt.

**The one nuance the comparison adds:** the *listed-OEM* layer is where the quality differences live (FANUC's 21% margins and CNC moat vs KUKA's opacity and Estun's losses), but the *component* layer (Nabtesco/Harmonic/Keyence) is where the **cross-cutting, posture-invariant** moat lives. If you want to own the OEM quality, FANUC is the standout on this comparison (integration + CNC + margins + governance). If you want to own the moat that doesn't care which OEM wins, you're back to the reducers.

---

## 6. Open items / where the research is thin

- **Kawasaki servomotor sourcing** — could not confirm who makes/supplies its servo *motors*; flagged [INF]. Worth a targeted dig (teardown / parts catalog) before any Kawasaki view.
- **Estun Cloos ownership %** — sources conflict (100% vs ~32.5% + CRCI consortium). Resolve before citing.
- **KUKA post-delisting financials** — unit volumes / segment margins no longer cleanly disclosed; treat KUKA financials as directional.
- **ABB–SoftBank close** — deal not closed (EU/China/US clearances, mid/late-26). ABB robotics is a moving target until then.
- **Estun FY2025 profitability** — top-line recovery (~+22%) reported; profitability unconfirmed.

---

## 7. Next steps (for discussion)

1. **Port this comparison to an interactive page** — the integration spectrum (§2) + the master table (§1) as an interactive, in the humanoid-map design. *(Best for presenting to the analysts — this comparison is very visual.)*
2. **Turn FANUC into a full single-name deep-dive** — it's the standout OEM on this comparison (integration + CNC + margins). The quality end of the barbell.
3. **Deep-dive the component names** (Nabtesco 6268 / Harmonic Drive 6324 / Keyence 6861) — the posture-invariant moat end of the barbell. *(The deferred option from Phase 1.)*
4. **Estun / Chinese-erosion deep-dive** — size and time the quality-gap closure; it's the single variable the whole thesis hinges on.

---

*Framework/coverage memo — no security is valued here. Built from six parallel per-company supply-chain profiles (see `oem-deepdives/`), each provenance-graded, anchored on the Bloomberg SPLC Nabtesco→OEM edges. Every `[C]`/`[I]` claim needs primary corroboration before any rating. SPLC magnitudes are algorithmic estimates — read exact figures off the terminal.*
