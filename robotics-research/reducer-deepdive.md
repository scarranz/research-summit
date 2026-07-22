# Reducer deep-dive — technology overview + light company overviews (Phase 4)

**Owner:** SAB. **Date:** 22 Jul 2026. **Branch:** `feat/robotics-industry`.
**Team split (meeting 21 Jul 2026):** SAB owns (1) the **reducer technology overview** and (2) **light/high-level overviews of both companies**. **Deborah and Daniel each own the DETAILED company deep-dive of one name** (Nabtesco 6268 / Harmonic Drive 6324) — so this document deliberately stops at the high level and hands off.

**Base material (do not duplicate — build on it):** Daniel's `dossier_maestro_reductores.md` (1,063-line master handoff: sector + Timken/Harmonic/Nabtesco, J-GAAP vs IFRS, access/liquidity) and his `industry_primer (1).html`. SPLC supplier/customer graphs (Harmonic pull 21-Jul-2026).

---

## Deliverables (both LOCAL-ONLY — `.html` is gitignored)

| File | What it is | Status |
|---|---|---|
| `reducer-technology-overview.html` | **Technology overview.** 5 tabs: 🎯 the chokepoint · ⚙️ the two mechanisms (live animated SVGs) · 🦾 where each goes (clickable body map) · 🏰 the moat decoded · 🧭 to the companies | Built 21 Jul, verified |
| `reducer-companies-overview.html` | **Light company overviews.** 4 tabs: ⚖️ both side by side · 🟦 Nabtesco 6268 · 🔵 Harmonic Drive 6324 · 🎯 head-to-head & how to own it | Built 22 Jul, verified |

**View:** `cd robotics-research && py -m http.server 8010` → `http://127.0.0.1:8010/<file>`
Both reuse the **portal design system** (Inter, navy/steel, `--hd` #2563EB / `--nb` #0E7490 / `--tkr` #B91C1C / `--cn` #C2410C) — a different system from Daniel's primer, deliberately.

---

## 1. The technology overview — the argument in one line per tab

1. **The chokepoint.** A motor is fast and weak; a joint must be slow and strong. The reducer does the conversion and is **~30% of robot BOM** — yet **0 of 6** major OEMs makes it in-house after 40–110 years. Joints go from ~6 (industrial arm) to 20–30 (humanoid): the 4–5× demand multiplier.
2. **The two mechanisms.** Four demands no single design wins (zero backlash · compact/light · torsional stiffness · shock survival). **Strain-wave** elastically bends a thin steel cup into an oval (light, near-zero backlash, but the flexspline is a fatigue part *by design*). **Cycloidal/RV** wobbles a rigid disc over ~12 pins (survives ~5× rated torque, very stiff, but heavier and backlash grows with wear). Both reduce via the **one-fewer tooth/lobe** counting trick.
3. **Where each goes.** Heavy proximal joints (base/shoulder/elbow) = RV/Nabtesco; fine distal joints (wrist/fingers/hand) = strain-wave/Harmonic. **They split the body → duopoly, not rivalry.** Caveat kept on the page: Tesla's Optimus uses **roller screws** for heavy leg joints, so "humanoids scale ⇒ Nabtesco wins the legs" is not guaranteed.
4. **The moat, decoded.** 5 µm max flexspline eccentricity · 12 manufacturing steps · >90% of the steel becomes swarf · the cup must be radially flexible yet torsionally rigid. **What the moat is NOT:** an ASML (EMAG/Gleason/Kapp-Niles/Reishauer sell openly; China buys freely) and not nanotech. **What it IS:** statistical process control + demonstrated field life. *"The advantage is not knowing how to make it — it's knowing why it came out wrong."* → **structurally weaker than a chip moat; erodes with volume and time.** Tiers are a **yield filter**, not separate lines. China reached parity in **MID, not PREMIUM** (Harmonic share ~70% → ~24%).
5. **To the companies.** Three listed ways to own it — Harmonic (humanoid beta HIGH), Nabtesco (MODERATE), Timken (LOW).

---

## 2. Light company overviews — the high-level read

### Nabtesco (TSE 6268 · sponsored ADR NCTKY) — the widest toll booth, inside a conglomerate

- **~60% global RV share, 7M+ units shipped, designed-in with all four Big-Four OEMs** (FANUC, ABB, KUKA, Yaskawa) — a quasi-tollbooth on industrial-robot growth. Teijin Seiki cycloidal heritage.
- **🔑 The tell:** robotics is only **~26% of sales** (Component Solutions ¥79.3B, op. profit ¥5.4B) but the anchors carry most of the earnings — **Accessibility ¥13.6B** (auto doors / platform screen doors, a service annuity) + **Transport ¥9.1B** (Shinkansen brakes, Boeing/Airbus flight-control actuators). **You buy trains and doors as much as robots.**
- **Financials (¥B):** FY22 308.7 / 24.0 → FY23 333.6 / 26.5 → FY24 280.5\* / 18.9 → FY25 307.9 / **30.3**. \*FY24 restated to continuing ops after the hydraulic-equipment sale to **Comer** ("focus & selection"). **Reshapes by portfolio surgery, not roll-up** — the anchor legs hold segment profit steady while the robotics leg cycles, which is why it can fund **doubling RV capacity** without balance-sheet stress.
- **Chain maps the segments:** Wabtec (rail brakes) · RTX/Woodward (aero actuation) · JTEKT/Nippon Thompson (bearings for the RVs) · Daedong KR (metals, **in distress**). Customers: Boeing 4.73%, all four Big-Four, Mercedes, Traton, JR operators, Cat/Komatsu/Sany — **74 customers, none above ~5%**. Geography ~50% JP / ~14% CN / ~8% US. Default grade **IG6 (0.046%)**.
- **Where the moat ends:** robotics segment cyclical + soft China · **RV may not travel outside industrial robots** (heavy for humanoids) · Chinese makers expanding into cycloidal · aero leg exposed to **737 MAX rates**.

### Harmonic Drive Systems (TSE 6324 · HSYDF) — the pure-play, with everything that implies

- **Pure-play on strain-wave**, owns the fine-joint bottleneck, **no second line to cushion it**. Mkt cap ¥633B (~$4.3B), 1,420 employees.
- **The cycle is the structural signature you underwrite:** operating profit ¥9.5B → **¥13.2B (FY3/23 peak)** → ¥3.6B → **¥0.006B = ¥6 MILLION (FY3/25)** → ¥2.57B (FY3/26) → **¥6.2B guided (FY3/27, +141%)**. Peak-to-trough OP **−99.95%** on a revenue decline of only −22%. Inflection is visible: Q4 FY3/26 ordinary profit +5.6× YoY, op. margin 2.2% → 7.9%, receivables +21.2%. But: stock **−7.75%** the day after the FY3/26 print, **payout ratio 117.7%**, and FY3/27 guidance cites **semis + automation, NOT humanoids**.
- **Product ladder = the strategic answer to China** (higher rung → harder to price-compare): 1 Component Sets (max moat, min capture, fully comparable) · 2 Gear Units (guarantees the spec **in the field** — strain-wave is assembly-sensitive) · 3 **Rotary Actuators — the complete joint, max value capture, where humanoid orders concentrate** because buyers are software firms · 4 Harmonic Planetary (**weakest line**, very contested) · 5 Motors & Drives (hollow-shaft).
- **Two concentration problems.** (a) **Nissan = 10.30% of Harmonic revenue** while Harmonic is **0.05% of Nissan's COGS** — asymmetric, no leverage to resist, and it is *automotive* revenue inside a robotics narrative; only 10 suppliers / 12 customers disclosed and two counterparties (**Nachi-Fujikoshi**, Nanyo) are both, so breadth is overstated. Nachi-Fujikoshi **also supplies Nabtesco** — a shared node of the Japanese complex. (b) **Koden Holdings is the PARENT at 34.77%**, not a supplier (SPLC classifies by commercial flow, not control — **always verify ownership separately**); free float 57.68%; T. Rowe 4.3%, Capital Research 3.2%, FIL already holders.
- **Segments are reported by GEOGRAPHY, not product line** (JP 40.95% · US 17.96% · DE 10.07% · **China 6.79%**) → **the actuator-vs-component mix cannot be verified from filings; any mix estimate is inference and must be labelled as such.**
- **Humanoid exposure, link by link — the first three hold, the last three fail:** ✅ joint count multiplies · ✅ mix favours fine joints · ✅ demand routes to actuators · ❌ incumbency protects (new platforms have no installed base to requalify) · ❌ the West chooses Japan (**Optimus uses Green Harmonic, China**; Leaderdrive is in at Tesla, UBTECH, Figure) · ❌ visible in the P&L today. **Correct framing: "Harmonic wins if humanoids scale AND Western platforms choose qualified Japanese supply over Chinese cost."**
- **Barbell exposure:** protected-but-slow (semis, aero/defence via Moog & BAE, medical) vs fast-but-besieged (industrial robots, humanoids). 3M screen: **Estun +57.8% > Harmonic +49.8%** — the market is not pricing the Chinese as losers.

### Head to head — the verdicts

Ties (they do different jobs): reducer type · joint served · global share. **Nabtesco wins** Big-Four design-ins (4 vs 1) · cyclical protection · customer concentration · scale (**~5×**) · credit (IG6 vs IG7) · **US access**. **Harmonic wins** humanoid beta (undiluted) and difficulty-of-copy — *but faces the more immediate Chinese assault*.

**Access is a real constraint, not a technicality:** Nabtesco has a **real sponsored ADR (NCTKY)**, usable at size. Harmonic has **NO ADR** — HSYDF is an unsponsored foreign ordinary (~100 shares on a recent day, wide spreads) → **the only practical route is 6324 on TSE Prime.**

**Accounting to carry into any comparison:** both are J-GAAP. Operating profit is systematically understated vs IFRS; net income is inflated in extraordinary years — **Harmonic's FY3/25 is the direct trap** (¥5.78B gain from selling its Nabtesco stake, below the operating line). Use operating profit and adjust. "Ordinary profit" (経常利益) has no equivalent outside Japan.

**Errors that keep resurfacing — do not repeat:** ✕ "Nabtesco bought Harmonic in 2020" (**false** — Harmonic *sold* its Nabtesco stake) · ✕ "Koden is a supplier" (it is the **parent**, 34.77%) · ✕ "HSYDF is the ADR" (there **is no ADR**).

---

## 3. The distilled question (what the detailed deep-dives must answer)

Not *"do you believe in humanoids."* It is **who captures the value — the Japanese moat owner or the Chinese low-cost challenger — and how much is already priced.** The tension, kept on the page rather than resolved: the moat is real but already penetrated in mid-tier; growth is in mid-tier; premium grows slowly; humanoids carry no incumbency to protect; Tesla, UBTECH and Figure have already chosen Chinese. **The moat is strongest where field history matters (slow markets) and weakest where the product is new (the market that supposedly explodes).**

**Open gaps for Deborah / Daniel:** (a) Harmonic's actuator-vs-component split — unverifiable from filings, needs channel/inference work with the caveat stated; (b) quantified China erosion by tier over time; (c) Nabtesco's RV capacity-doubling capex and what it implies about its own demand view; (d) whether roller screws displace RV in humanoid legs.
