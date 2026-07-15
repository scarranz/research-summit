# The Tollbooth Screen — who wins regardless of which humanoid maker wins

**Summit Research · Robotics Coverage · Phase 5 (framework memo)**
**Prepared:** 15 July 2026 · **Owner:** SAB
**Companion:** [`humanoid-company-map.md`](humanoid-company-map.md) (Phase 4 — the ecosystem map, now updated with the July-2026 sweep) · [`humanoid-supply-chain.md`](humanoid-supply-chain.md) (Phase 3 — BOM & chokepoints)

**Provenance:** `[D]` disclosed · `[I]` independent named source · `[C]` company claim · `[E]` estimate/inference.

---

## 0. The thesis (SAB's framing)

> *"There will be many companies making humanoids, and it's very hard to say which one wins. But if we can find the player that supplies a component to **all** of them, that could be a high-value opportunity."*

This is the picks-and-shovels bet: don't pick the miner, own the tollbooth every miner has to pass through. It is the right instinct — and it is the bet the whole capability map has been circling. This memo makes it a **test**, applies the test to the chain, and ranks the survivors.

---

## 1. The test — a real tollbooth passes FOUR filters at once

A naïve "sells to everyone" screen picks the wrong names, because two traps kill most candidates:

| # | Filter | The trap it screens out |
|---|---|---|
| 1 | **Universality** — is it in *every* humanoid architecture? | Roller screws fail: the quasi-direct-drive Unitree G1 uses **zero**. A design change can route around you. |
| 2 | **Vertical-integration resistance** — will the OEMs that reach volume make it in-house? | ⚠️ **Trap #1.** Tesla, Figure, Unitree, XPeng build their own actuators/reducers/screws. The merchant TAM accrues to the *long tail* (1X, Neura, Apptronik, UBTECH), not the winners. |
| 3 | **Pricing power** — is the supplier concentrated, or commoditizing? | ⚠️ **Trap #2.** The parts everyone *does* buy and *doesn't* integrate are collapsing in price — Chinese tactile sensors ¥100k→¥199; harmonic ASP −29%/yr; frameless motors in oversupply. You win revenue, lose margin. |
| 4 | **Neutrality (the empirical core)** — how many *distinct* OEMs does it actually sell to? | The measurable version of "wins regardless." Counted from the edge register + a July-2026 sweep. |
| — | **Investability** — is there a liquid, Western-tradable owner? | The whole reason a pure node (roller screws, grinders) may not be ownable. |

**The tollbooth you want sits where filters 1–4 all hold AND it's investable.** That quadrant is nearly empty — which is itself the finding.

---

## 2. The neutrality axis — who actually sells to the most OEMs `[D]/[I]`

This is the piece the map didn't measure directly. From the 19 confirmed edges + the sweep:

| Supplier | Layer | Distinct humanoid OEMs it sells to | Grade |
|---|---|---|---|
| **Schaeffler (Ewellix)** | Actuation / screws | **Engaged with ~45 players; 5 firm contracts** — Neura (4–6k units), Humanoid (key actuator supplier, "≥1M actuators"), Hexagon (≥1,000), Leju — **and buys Agility/Neura robots itself.** Markets a "**Universal Actuator**." | `[D]` |
| **Harmonic Drive** | Reducers | Tesla (wrists/ankles), Boston Dynamics, Apptronik, Figure + the long tail. **Even vertically-integrated OEMs buy strain-wave for some joints.** 26-wk lead times. | `[I]` |
| **Hesai** | Perception / lidar | **#1 in humanoid+quadruped lidar** — Unitree, Galbot, MagicLab, Zhipu, HONOR, Vita Dynamics (6+ named). | `[D]` |
| **NVIDIA** | Compute | Figure, Apptronik, 1X, Boston Dynamics, Agility — **the highest neutrality of any name.** But immaterial revenue, and not a differentiator (XPeng/Tesla run own silicon). | `[C]` |
| **Leaderdrive** | Reducers | UBTECH, AgiBot, Universal Robots; **>1/3 of global harmonic; passed Tesla validation.** The Chinese neutral reducer. | `[I]` |
| **The grinder/abrasive upstream** | Capital equip. | **Sells to *every* screw maker, regardless of OEM** — structural maximum neutrality, one level up the chain. Handles: Qinchuan (000837), Huachen (300809), Asahi Diamond (6140), Klingelnberg (KLIN). | `[E]` |

**Read this against the traps:** NVIDIA wins the neutrality count outright but fails on materiality (humanoids ≈ rounding error). That is the warning the whole screen turns on — **neutrality alone is not enough; the component's economics must matter to the supplier.**

---

## 3. The screen — the whole chain, scored

🟢 pass · 🟡 partial · 🔴 fail

| Node | 1 Universal | 2 VI-resistant | 3 Pricing power | 4 Neutrality | Investable (liquid) | Verdict |
|---|:--:|:--:|:--:|:--:|:--:|---|
| **Internal-thread grinders** (up-chain) | 🟢 | 🟢🟢 | 🟢 | 🟢🟢 | 🔴 Qinchuan 000837; rest private | **Purest tollbooth — worst liquidity** |
| **Abrasives / cBN wheels** (up-chain) | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 Asahi 6140, 3M, Saint-Gobain (diluted) | **Real tollbooth, diluted exposure** |
| **Harmonic reducers** | 🟢 | 🟡 winners integrate | 🔴 −29%/yr | 🟢 | 🟢 Harmonic Drive 6324 | **Most investable near-tollbooth — commoditizing** |
| **Merchant actuator (universal)** | 🟢 | 🟡 | 🟡 | 🟢🟢 ~45 OEMs | 🟢 Schaeffler SHA | **Best Western-liquid neutrality — but diluted** |
| **Roller screws** | 🟡 G1 = zero | 🟢 | 🟢 | 🟡 | 🔴 | Pure economics, no liquid vehicle |
| **NdFeB magnets** | 🟢 | 🟢 China-locked | 🟡 | 🟢 | 🟡 MP, USAR | Tollbooth by *geopolitics*; humanoids ~1.5% of demand |
| **Perception / lidar** | 🟢 | 🟡 | 🔴 cost collapse | 🟢 #1 Hesai | 🟢 Hesai HSAI | **Neutral + liquid + disclosed number — but price pool falling** |
| **Frameless motors** | 🟢 | 🔴 oversupply | 🔴 | 🟢 | 🟢 | ❌ No pricing power |
| **Compute SoC** | 🟢 | 🟡 | 🟡 | 🟢🟢 | 🟢 NVDA | ❌ Immaterial to the supplier |
| **Bearings** | 🟢 | 🟡 | 🟡 | 🟢 | 🟢 TKR, IKO | ❌ TAM <$700M at 1M robots |

---

## 4. The survivors — ranked "wins-regardless" candidates

Nothing clears all filters cleanly. Ranked by how close each comes, **Western-liquid first:**

1. **Schaeffler (SHA GY)** — *the single best expression of the thesis in liquid Western form.* It is literally building a **"Universal Actuator"** and is **engaged with ~45 humanoid makers**, supplying the long tail (Neura, Humanoid, Leju) while the winners integrate. It even hedges by *buying* robots (Agility). **The neutrality is unmatched.** The catch is materiality, not neutrality: humanoids are **<1% of sales and excluded from its own 2028 targets** — you're buying a €-billions auto/industrial supplier for a call option. *The deep-dive question: does the option get big enough, fast enough, to matter to an SHA holder?*

2. **Harmonic Drive (6324 JP)** — the reducer **even integrators buy** (Tesla wrists/ankles), #1 share, a disclosed AI/humanoid revenue line, 26-week lead times. High neutrality + liquid + a real number. The catch: **Leaderdrive is taking a third of the global market and ASPs are falling −29%/yr** — a tollbooth whose toll is dropping.

3. **Hesai (HSAI)** — #1 in humanoid/quadruped lidar, 6+ named OEMs, a disclosed robotics segment, Nasdaq-liquid. Best "eyes" neutrality. The catch: **perception is a collapsing price pool** — leadership in a commoditizing layer.

4. **The upstream tollbooth** (grinders → abrasives → metrology) — **the theoretically purest answer to the thesis:** it sells to *every* screw maker no matter which OEM wins, is nearly impossible to vertically integrate, and is supply-constrained. But the liquid handles are Chinese/diluted — **Qinchuan (000837)** builds the grinders, **Asahi Diamond (6140 JP)** the wheels, **Klingelnberg (KLIN, SIX)** the metrology. *The deep-dive question: is any of these a clean enough handle, or is this a private-markets/pre-IPO play?*

---

## 5. The honest conclusion

**SAB's instinct is correct, and it converges on a specific, defensible shortlist — but the screen also explains why the "obvious" tollbooth isn't sitting there to be bought.** The purest neutral nodes (grinders, roller screws) are private or Chinese; the most liquid neutral nodes (compute, motors, bearings) are either immaterial to the supplier or commoditizing. The two names that best resolve the tension are:

- **Schaeffler** — maximum neutrality, Western, liquid; question mark is *materiality*.
- **Harmonic Drive** — real toll, real number, liquid; question mark is *whether the toll holds*.

Both are answerable with one focused deep-dive each. **That is the natural next step whenever we choose to go a level deeper** — and unlike a bet on a single OEM, both are underwritten by the one thing we're confident about: *many* humanoid makers, *few* of whom will build these parts themselves.

---

*Framework memo — no security is valued here. Sources: Schaeffler press releases + Reuters/Forbes coverage (Nov 2025–May 2026); Harmonic Drive FY25 disclosure + teardown/industry reporting; Hesai FY2025 results + GGII/Yole rankings; the Phase-4 edge register (19 confirmed edges). Every `[C]` claim requires independent corroboration before any rating.*
