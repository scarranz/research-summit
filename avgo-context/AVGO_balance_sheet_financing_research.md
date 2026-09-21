# Broadcom (AVGO) — Balance Sheet, M&A Capacity, AI Financing (XPV) & Multiple

Research notes, sessions of **2026-09-14** (§1–§6) and **2026-09-21** (§7 the multiple, §8 the M&A record, §9 M&A capacity). Chat-only research, **no portal changes yet**. This is the base for
continuing: (1) M&A / balance sheet / ratios / amortization, (2) the XPV financing platform,
(3) the valuation multiple over time. Complements `AVGO_PE_strategy.md` (the historical playbook).

> **Source tiers.** [P] = primary (10-Q/10-K, call transcripts, company/partner press releases).
> [N] = reputable press (Bloomberg, CNBC, Axios). [S] = secondary sites relaying Bloomberg/BofA
> (CryptoBriefing, BigGo, Investing.com, Fool) — use as a lead, verify before relying on it.
> [C] = my calculation / inference.
>
> Quartr company id **5734**. Key docs: Q3 FY26 10-Q `3694626` · Q2 FY26 10-Q `3531267` ·
> Q1 FY26 10-Q `3053129` · FY25 10-K `2523636` · Q3 call event `685349` · Q2 call event `581106` ·
> Goldman Sachs Communacopia (Sep 8 2026) doc `4137698`.

---

## 0. Headline

Broadcom went from **"de-lever after VMware to fund the next big deal"** to **"lend its A-rated balance
sheet so its two largest 2027–28 customers (Anthropic, OpenAI) can buy its chips."** Corporate leverage
looks healthy (~1x); the risk moved **off balance sheet** (Backstop + convertible notes), rating agencies
and bond spreads are already pricing it, and the odds of another mega-acquisition went down.

And the market has noticed. Over five years **89% of the stock's move came from forward EPS, not from the
multiple** — but in 2026 that link snapped: blended-forward EPS is **+69% year-to-date** while the multiple
went **42.1x → 20.4x**, and the correlation between the multiple and expected growth flipped from **+0.73**
(2021–25) to **−0.79** (2026). Broadcom is being handed the numbers and is not being paid for them (§7).

That matters more because of what it is being traded against. **Seven acquisitions in twenty years, no
impairment, no failed integration** — and a record in which every deal collapses ROIC to 6–9% in the
close year and earns it back past the prior peak within two to four years (§8). Broadcom is at
**~0.7x net leverage with $24B of cash**, the most capacity it has ever had, and **goodwill has been
flat since Q1 FY24** — the longest pause in its history as a serial acquirer. The capacity is now
pointed at the XPV backstop, not at a target — and §9 shows that is a choice, not a limit: even in the
harshest reading of the rating math the balance sheet still funds an **$82B all-cash deal**. What has
run out is not the capacity but the shopping list.

---

## 1. Balance sheet trajectory [P, Quartr standardized]

US$ B. Quarter label = fiscal quarter.

| Quarter | Cash | Total debt | Net debt | Goodwill | Intangibles | Equity |
|---|---|---|---|---|---|---|
| Q4 FY23 (pre-VMware) | 14.2 | 39.2 | 25.0 | 43.7 | 3.9 | 24.0 |
| Q1 FY24 (post-VMware peak) | 11.9 | 75.9 | **64.0** | 97.6 | 42.3 | 70.3 |
| Q4 FY24 | 9.3 | 67.6 | 58.2 | 97.9 | 40.6 | 67.7 |
| Q4 FY25 | 16.2 | 65.1 | 49.0 | 97.8 | 32.3 | 81.3 |
| Q2 FY26 | 19.6 | 64.9 | 45.3 | 97.8 | 28.3 | 87.7 |
| **Q3 FY26 (Aug 2 2026)** | **24.0** | **59.4** | **35.4** | 97.8 | **26.3** | 99.7 |

- Goodwill flat at $97.8B since VMware closed → **no material acquisition in ~3 years**.
- Q3 FY26: CFO $14.2B, FCF record $13.7B (46% of revenue), dividends $3.1B, $5.6B notes retired, cash still +$4.3B.

## 2. Debt detail (Q3 FY26 10-Q p.17–20) [P]

- **Principal $61,079M, 100% fixed rate**; carrying $59,419M (ST 2,252 + LT 57,167). Term loans are fixed (4.54%/4.49%, May-28).
- Weighted avg coupon **4%**, **7.4 yrs** (on $59.6B after the $1.5B Aug-26 VMware notes repaid post-quarter) — CFO, Q3 call.
- Revolver $7.5B (to Jan-2030) undrawn; CP program $4.0B, nothing outstanding. Covenants in compliance.
- **Maturity ladder (FY):** rest FY26 2,252 · FY27 0 · FY28 5,127 · FY29 2,405 · FY30 6,406 · after 44,889.
- **FY26 activity:** Q1 issued $4.5B (Jan-2026 notes: 2031/33/36/56) and retired $3.65B; Q2 retired $1.25B (VMware 3.9% Aug-27);
  Q3 retired **$5.64B via tenders/redemptions** (5.05% Jul-27 493, 5.05% Jul-29 2,250, 4.9% Feb-38 1,052, 4.926% May-37 1,846).
  9M: issued 4.5, retired 10.5; extinguishment loss $161M.
- Interest expense Q3 $778M; FY25 $3,210M. Fair value of debt $55,990M.
- **Tension:** Hock Tan (GS, Sep 8) says no reason to prepay "low cost" debt, yet Q3 tendered the 2037/2038 ~4.9% bonds (highest coupons in the stack).

## 3. Intangibles & remaining amortization [P]

| Type (Q3 FY26) | Gross | Accum. | Net | Remaining life |
|---|---|---|---|---|
| Purchased technology | 33,601 | (18,821) | 14,780 | 5 yrs |
| Customer contracts & relationships | 15,791 | (5,440) | 10,351 | 5 yrs |
| Trade names | 1,612 | (482) | 1,130 | 11 yrs |
| Other | 188 | (124) | 64 | 10 yrs |
| IPR&D | – | – | 0 (was 820 at FY25) | – |
| **Total** | 51,192 | (24,867) | **26,325** | |

**Expected future amortization (US$ M):**

| As of | Rest FY26 | FY27 | FY28 | FY29 | FY30 | After | Total |
|---|---|---|---|---|---|---|---|
| FY25 10-K (FY26 = full yr) | 7,880 | 6,805 | 5,673 | 4,547 | 3,365 | 3,183 | 31,453 |
| **Q3 FY26 10-Q p.15** | **2,008** | **6,980** | **5,833** | **4,686** | **3,479** | **3,339** | **26,325** |

- Schedule *rose* in Q3 because IPR&D was reclassified to purchased technology.
- Quarterly amortization ~$2.0B (≈1.5 COGS / 0.5 opex).
- **Implication [C]:** absent a new deal, the amortization gap between GAAP and non-GAAP shrinks from ~$8B/yr to ~$3.5B by FY30. SBC (~$2B/qtr) is the other big gap and does not run off.
- Goodwill by segment (FY25): Semis $26,013M, Software $71,788M.
- **VMware PPA** (FY24): consideration $86.3B (stock $53.4B, cash $30.8B, other); goodwill $54.2B; intangibles $45.6B (dev tech $24.2B 8y, customer $15.2B 8y, trade name $1.2B 14y, IPR&D $4.7B); assumed $8.25B VMware notes. EUC sold to KKR Jul-2024 for $3.5B.

## 4. Target ratios / capital allocation [P unless noted]

- **No stated leverage target and no rating disclosure** in any FY26 call, the GS conference or 10-Qs.
- Implied target = **keep A-range ratings** [C].
  - Moody's **A3**, positive (upgraded Sep 2025) [S]; S&P **A-**, positive [S]; Fitch BBB+ [S].
  - S&P (Jun 11 2026) called the first XPV tranche **"credit negative"**, no rating action; per BofA, S&P leans to treat the guarantee **as debt** [S — verify original].
- Leverage [C/S]: ~1.0x gross / ~0.6x net adj. EBITDA (my estimate); BofA credit says 1.3x gross.
- **Dividend** $0.65/qtr ($2.60 FY26, +10%). "50% of prior-year FCF" wording **not found** in FY26 sources.
- **Buybacks:** Q1 $7.85B · Q2 $0.6B · **Q3 $0** (while stock fell). $10.1B authorization left (to Dec 31 2026).
- **Hock Tan, GS Sep 8:** capital allocation decided at the **December board**; "record amount of cash" by end FY26; options = raise dividend or buy back; paying down debt doesn't make sense. **No mention of M&A.**
- New 10-Q risk factor: downgrade risk "including due to backstops or guarantees and other financing arrangements" (p.51).
- CFO change: Kirsten Spears retired Jun 12 2026 → **Amie Thuener**.

## 5. Pending M&A [P]

- **None** disclosed (see **§8** for the full deal-by-deal record). Liquidity section keeps generic "potential acquisitions" language. Last moves: VMware EUC sale ($3.5B, 2024), Seagate SoC purchase ($600M, 2024).

## 6. The AI XPV platform (off-balance-sheet exposure)

### Structure [P]
- Announced **Jun 9 2026** with Apollo & Blackstone: **>20 GW** of XPU compute through 2028, **only for Anthropic and OpenAI** (Q3 call).
  Named "XPU platform" on the Q2 call, "XPV" from Q3.
- **Tranche 1: $35B** (Apollo-led) for **Anthropic's 1 GW** of Ironwood TPU racks at Fluidstack sites.
- Financial partner took over Broadcom's agreements to buy the AI racks and the related **5-year leases** with the customer.
- **Backstop** (10-Q p.23): if the customer defaults, Broadcom owes **85% of outstanding lease minus rack sale value**.
  **Max ~$29B** undiscounted (≈85% × $35B). Fair value "not material"; nothing paid.
  Remedies: assume the lease, sell racks **back to "the seller" at a fixed price** (seller unidentified), or arrange a sale.
  Signed **Jun 8 2026** (Q2 10-Q subsequent event).
- **Convertible notes:** "our customer may, under certain circumstances and if needed, issue to us convertible promissory notes up to **$42B**", proceeds only for its lease obligations; none issued. **First appears in the Q3 10-Q; never discussed on any call.** Issuer, conversion terms and trigger unknown.
- Purchase commitments **$126.8B** (FY27 52.7 / FY28 73.0) vs **$132M** at FY25. RPO **$179.2B** vs $33.3B at FY25.
- Working capital: inventory $4.5B (2x FY25), one distributor = 50% of Q3 revenue, $1.6B receivables factored in Q3.

### What management says [P]
- CFO: partners "independently underwrite and capitalize the assets… we may provide **modest residual value guarantees**… low risk." Future tranches "deal-by-deal", "unique features", "nothing to announce."
- Hock Tan (GS): "**This is not circular financing**." Economics: 1 GW → ~$30B ARR for the lab vs ~$10B/yr to run it.
- The other 4 XPU customers "fund themselves". Anthropic's IPO "will change its investment credit."
- Customer roadmap (Q3 call): **Anthropic** 1 GW 2026 → +5 GW TPU v8i 2027 → +10 GW 2028 = **largest XPU customer from 2027**. **OpenAI** 1.3 GW 2027 → >5 GW 2028 = #2. Meta 3 GW through 2028.
- AI revenue guide: **FY26 $58B · FY27 ~$115B · FY28 ~$230B**; "on target to exceed **$30 EPS in FY28**". Content $20–30B per GW.

### Inconsistencies / concerns [C]
1. **The two customers needing financing are the two largest of 2027–28** → much of the FY27/FY28 guide rests on weak-balance-sheet counterparties.
2. The label undersells it: it is a guarantee of **85% of lease payments**, collateralised by racks. **Wrong-way risk**: if Anthropic defaults, AI compute is likely in glut and rack values fall.
3. **Q2 call (Jun 3):** asked about a "backstop" with Anthropic, Tan: "it wasn't backstop in that sense"; on racks: "No rack. It's all chips." **Five days later** they signed a backstop on "AI racks."
4. Broadcom books revenue on chips funded by a third party with Broadcom's guarantee → accounting sale, economically close to vendor financing.

### Press / credit market [N/S]
- Tranche split: senior A1 ~$6B + A2 ~$24B backed by Broadcom; B ~$4.5B unbacked [S].
  Bloomberg (Jun 2): backed piece ~**5.75%** vs unbacked **8–9%** [N].
  → Broadcom is lending its A- credit; ~3pt spread on ~$25B ≈ **~$0.7B/yr** of value to Anthropic [C].
- **Follow-on vehicle** in talks: $60–100B (Bloomberg Aug 20) / $70–80B (CNBC Aug 21), part guaranteed by Broadcom; not closed as of late Aug [N].
- **BofA credit (Aug 11):** bonds cut to Marketweight.
  Tranche 1 peak exposure ~$26B (Sep 2027), modeled loss ~$2.9B. **Full 20 GW platform: exposure up to $370B by mid-2029**; loss ~$10.5B at 25% default, ~$42B if all default. Bonds 30–45bp wider than A-rated non-AI peers, +20–30bp since June [S].
  → Use **$370B** as the reference full-platform exposure (my naive $580B extrapolation is retired).
- Anthropic: Series H $65B at $965B post (May 28 2026) [P]; run-rate >$47B (May) [P], >$65B (end-Jul) [N]; draft S-1, IPO prep [N]; ~$517B of total compute commitments, mostly ~10 yrs (The Information via Yahoo, Sep 13) [N].

### Stock moves & attributed causes [N/S]

| Date | Move | Stated cause |
|---|---|---|
| Dec 12 2025 | −11% (−17% over 3 days) | AI angst (Oracle/Nvidia); gross margin dilution from system sales |
| Jun 3–4 2026 | sharp drop (sources disagree: −4% close to −16% intraday) | Q3 AI guide below whisper; Google share loss to MediaTek (Macquarie downgrade) |
| **Aug 14 2026** | **−5.9%** | **BofA $370B guarantee note** (+ VMware vCenter flaw) |
| Aug 19 2026 | down | Marvell–Google AI chip deal |
| Sep 3 2026 | −6.3% | Q4 guide slightly light; gross margin down on XPU mix |

- **Price ATH ~$480 in Jun 2026** (Fool) ≠ **multiple peak 42.1x on Dec 10 2025** (BBG) → Dec-25→Jun-26 price rose while the multiple fell (EPS estimates rose faster).
- Since June both fell: price ~−26%, forward P/E ~20x (~19x FY27 EPS $19.39) [S].

---

## 7. Valuation multiple — decomposition 2021–2026

### Data sources
- **Daily BBG forward multiples, Sep 2 2021 → Sep 2 2026:**
  `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\BBG PORTFOLIO BENCH\multiples\AVGO 1GBF.xlsx` (+ `AVGO 2GY.xlsx`, `AVGO 3GY.xlsx`).
  Fields: PE_RATIO, HEADLINE_EV_TO_EBITDA, PX_TO_FCF (1,255 trading days). Start looks like a 5-yr pull limit.
- **Peer multiples, same pull, same dates:** `PE 1GBF.xlsx` in that folder — 18 tickers including NVDA, 2330 TT (TSMC), META, GOOGL, AMZN.
- **Daily price** (the BBG pull has no PX_LAST): Yahoo Finance chart API, split-adjusted closes, Aug 2021 → Sep 18 2026.
  The only split in the window is **10:1 on Jul 15 2024**; BBG's PE_RATIO is split-invariant, so the implied EPS below is consistently split-adjusted.
- **Pre-2021:** nothing clean. Ask Dani for the same BBG pull back to **2014-01-01** (monthly OK) + PX_LAST, CUR_MKT_CAP.
- `avgo-context/AVGO_BBG.xlsx` and `FA_AVGO_US.xlsx` = annual only (no history). `DCF AVGO.xlsm` "Ratios Year" multiples use next-year *actual* GAAP → hindsight, don't use as consensus.
- AVGO is **not** in `BBG_CONSENSUS.txt` nor in the Summit DCF MCP.

### What the three BBG horizons actually are [C — identified, not labelled in the pull]

Implied EPS = price ÷ multiple, matched against known anchors:

| Series | Meaning | Check |
|---|---|---|
| **1GBF** | 12-month **blended forward**: FY1 and FY2 weighted by months left in FY1 | Sep 2 2026: (2/12)×FY26 + (10/12)×FY27 = (2/12)×12.1 + (10/12)×19.2 = **18.0** = observed ✓ |
| **2GY** | **next fiscal year** (FY+1) | Sep 2 2026 implied EPS **$19.20** vs the $19.39 FY27 consensus already cited in §6 ✓ |
| **3GY** | **FY+2** | Sep 2 2026 implied EPS **$27.07**; management's "exceed $30 in FY28" sits above it ✓ |

2GY and 3GY step up discontinuously at each **December FY print** (the roll); 1GBF is continuous. **1GBF is therefore the only series usable for time-series work** — its change is not contaminated by the roll.

### Forward P/E / forward EV/EBITDA at quarter-end (1GBF)

| | Mar | Jun | Sep | Dec |
|---|---|---|---|---|
| 2021 | – | – | 15.8 / 13.2 | 19.9 / 16.3 |
| 2022 | 17.0 / 14.1 | 12.4 / 10.7 | 11.0 / 9.6 | 13.6 / 11.8 |
| 2023 | 15.1 / 12.9 | 19.8 / 16.7 | 18.4 / 15.7 | 23.4 / 18.4 |
| 2024 | 26.1 / 21.9 | 28.5 / 22.8 | 28.2 / 22.9 | 35.3 / 27.9 |
| 2025 | 23.4 / 19.1 | 35.7 / 28.8 | 36.1 / 28.7 | 32.4 / 25.2 |
| 2026 | 22.6 / 17.8 | 22.6 / 18.1 | 20.4 / 16.2 (Sep 2) | |

Low **10.6x / 9.3x** (Oct 14 2022). High **42.1x / 33.6x** (Dec 10 2025). Price ATH **$481.57 on Jun 2 2026**.

P/E ÷ EV/EBITDA stayed inside a **1.14–1.29** band the whole period, drifting up only mildly as VMware was paid down.
→ Leverage never distorted the read: **both multiples tell the same story**, so the P/E work below carries over to EV/EBITDA.

### The decomposition — price = multiple × blended-forward EPS

Exact in logs: `Δln(price) = Δln(P/E) + Δln(EPS)`.

| Period | End | Px | P/E | EPS(bf) | Δ%Px | Δ%P/E | Δ%EPS | Driver |
|---|---|---|---|---|---|---|---|---|
| Rate shock | Oct 14 2022 | 42.71 | 10.6 | 4.05 | −13% | **−35%** | +34% | multiple (estimates kept rising) |
| Recovery + VMware | Dec 7 2023 | 92.23 | 19.7 | 4.68 | +116% | **+87%** | +16% | **multiple — 81% of the move** |
| First AI year | Dec 12 2024 | 180.66 | 28.3 | 6.38 | +96% | +44% | +36% | **half and half** |
| To the multiple peak | Dec 10 2025 | 412.97 | 42.1 | 9.81 | +129% | +49% | +54% | **half and half** |
| Peak multiple → price ATH | Jun 2 2026 | 481.57 | 31.7 | 15.20 | +17% | −25% | **+55%** | **EPS alone; the multiple was already falling** |
| XPV de-rating | Sep 2 2026 | 367.24 | 20.4 | 18.00 | −24% | **−36%** | +19% | multiple |
| **Full 5 years** | Sep 2 2026 | 367.24 | 20.4 | 18.00 | **+647%** | **+25%** | **+497%** | **EPS = 89% of the log move** |
| 2026 YTD | Sep 2 2026 | 367.24 | 20.4 | 18.00 | +6% | **−37%** | **+69%** | the two cancel |

**Read:**
1. **Over five years the re-rating is almost irrelevant.** The stock is up 647% and the multiple contributed **25 points of it** — 89% of the log move is forward EPS, which went from $3.01 to $18.00. Broadcom is not a multiple story; it is an estimate story.
2. **2022 was rates, not the company.** Forward EPS rose 34% *while* the stock fell 13%: the multiple did all the damage.
3. **2023 was the mirror image** — the multiple did all the work (87% of a +116% move) on +16% EPS. That is the re-rating from "levered roll-up" to "AI name", and it happened *before* the earnings showed up.
4. **2024–2025 were balanced** — the only stretch where price, estimates and multiple moved together. That is what a healthy AI re-rating looks like.
5. **2026 is a refusal year.** Blended-forward EPS is up **69% year-to-date** and the stock is up **6%**. The multiple has absorbed the entire beat: 42.1x → 20.4x, **−52% from the peak while estimates rose 84%** over the same stretch. The market is being handed the numbers and declining to pay for them.

### Is the multiple correlated to growth?

Expected growth, measured same-vintage so the roll cannot contaminate it: **g = EPS(3GY)/EPS(2GY) − 1** (FY+2 over FY+1).

| Year | n | Median P/E | Median g | corr(P/E, g) | Median PEG |
|---|---|---|---|---|---|
| 2021 | 84 | 17.2 | 6.2% | −0.19 | 2.76 |
| 2022 | 251 | 13.6 | 5.4% | −0.21 | 2.53 |
| 2023 | 250 | 18.7 | 5.8% | **+0.73** | 3.23 |
| 2024 | 252 | 26.6 | 13.4% | +0.57 | 1.98 |
| 2025 | 250 | 35.1 | 21.0% | **+0.73** | 1.68 |
| 2026 | 168 | 25.5 | **27.3%** | **−0.79** | **0.94** |
| **Full sample** | 1,255 | 22.9 | | **+0.73** | |

- **Yes — until 2026.** Across the five years the correlation is **+0.73**: the multiple tracked expected growth, and PEG compressed steadily from ~2.5–3.2x to ~1.7x as growth accelerated into the price.
- **2026 breaks it, hard: −0.79.** Expected growth is the highest of the whole sample (27%) and the multiple is going the other way. PEG has fallen to **0.94**, the lowest reading in five years by a wide margin.
- That sign flip is the whole question for the name: **the market has stopped paying for Broadcom's growth at exactly the moment the growth is largest.** §6 is the leading candidate for why — the growth being refused is the FY27–FY28 AI ramp, and the two customers behind it (Anthropic, OpenAI) are the two Broadcom had to finance.

### Was it M&A? No.

| Event | Date | P/E day before → day of | 1-day price |
|---|---|---|---|
| VMware announced | May 26 2022 | 14.16 → 14.31 | +3.6% |
| VMware closed | Nov 22 2023 | 21.35 → 21.06 | −0.9% |

Neither the largest acquisition in the company's history nor its closing moved the multiple, and the added leverage never showed up in the P/E ÷ EV/EBITDA ratio. **M&A is not a multiple driver for AVGO.** What re-rated the stock in 2023 was the AI narrative, arriving a full three quarters after the VMware deal closed. The relevant caveat runs the other way: the M&A that matters for the multiple is the one that **stopped** — goodwill flat since 2023 (§1) means the "serial acquirer" framing no longer earns anything.

### It is not a sector re-rating either — AVGO vs peers (P/E 1GBF, quarter-end)

| | AVGO | NVDA | TSMC | META | AVGO vs NVDA |
|---|---|---|---|---|---|
| Sep 2021 | 15.8 | 46.4 | 22.7 | 19.4 | **−66%** |
| Sep 2022 | 11.0 | 28.5 | 11.3 | 10.3 | −61% |
| Sep 2023 | 18.4 | 29.2 | – | 18.5 | −37% |
| Dec 2023 | 23.4 | 25.5 | 15.7 | 19.5 | −8% |
| Dec 2024 | 35.3 | 31.1 | 18.4 | 22.0 | **+13%** |
| Dec 2025 | 32.4 | 25.3 | 20.0 | 19.9 | **+28%** |
| Jun 2026 | 22.6 | 19.2 | 21.4 | 14.1 | +18% |
| Sep 2026 | 20.4 | 17.7 | 18.4 | 16.0 | +15% |

- Broadcom spent 2021–2022 at a **60–70% discount to Nvidia**, crossed into a **premium** at the end of 2024 and peaked at **+28%** in Dec 2025. The re-rating is Broadcom-specific: **TSMC never left an 11–22x band** over the same five years.
- The 2026 de-rating is **partly complex-wide, partly AVGO's own**: Dec 2025 → Sep 2026, NVDA −30%, META −20%, TSMC −8%, **AVGO −37%** (−52% from its Dec 10 peak). Roughly two-thirds of AVGO's de-rating is the AI complex; the remaining third is the premium it built in 2025 being handed back.

### Where the multiple sits now

- **20.4x** blended forward (Sep 2 2026) = the **44th percentile** of the last five years, but the **1st percentile** of the 2024–2026 AI era (median 28.1x).
- Past the BBG cut-off: the pull stops Sep 2; the Q3 FY26 print landed **Sep 3–4 2026** (revenue $29.59B, AI semis $16.7B +221% y/y, Q4 guide $34.8B vs ~$35.0B expected). Price Sep 2 $367.24 → **$357.61 on Sep 18**, so the multiple today is roughly **19–20x**, marginally lower.
- ⚠️ **Correction to §6:** the "Sep 3 2026 −6.3%" row in the stock-move table does not survive the price series. Sep 3 was **−2.7%** ($367.24 → $357.16) and Sep 4 was +0.2%. That figure was [S] — drop it or re-source it.

### Working files [local only, not committed]

`avgo_merged.csv` (date, price, the three P/E, EV/EBITDA and P/FCF horizons, implied EPS for each) and `peers_pe.csv`, rebuilt by the scratchpad scripts `xlsx2csv.ps1` → `merge.ps1` → `decomp.awk`. Regenerate rather than store — the BBG source is Dani's folder and it moves.

---

## 8. The M&A track record, deal by deal

`AVGO_PE_strategy.md` describes the playbook. This is the same ladder with the numbers attached:
what was paid, at what multiple, what it did to the balance sheet, how long the de-levering took,
and whether the capital earned a return.

### Method and sources [P unless noted]

- **Broadcom's own financials** — SEC XBRL company facts, quarterly, stitched across the three
  registrants the company has used: Avago Technologies Ltd (CIK 1441634) → Broadcom Ltd (1649338) →
  Broadcom Inc (1730168). Tags: `DebtLongtermAndShorttermCombinedAmount` (this is **principal**, which
  is why it reads $61,079M at Q3 FY26 against $59,419M carrying in §2), `Goodwill`,
  `CashAndCashEquivalentsAtCarryingValue`, `OperatingIncomeLoss`, `StockholdersEquity`, and D&A.
- **Target financials** — each target's own 10-K via XBRL (LSI 703360, Broadcom Corp 1054374,
  Emulex 350917, Brocade 1009626, CA 356028, Symantec 849399, VMware 1124610). The FY used is the
  last one ending before the deal closed; it is named in the table so the staleness is visible.
- **Deal terms** — Broadcom/Avago press releases and the counterparties' own announcements.
- **EBITDA is GAAP throughout** (operating income + D&A) so the series is consistent across twenty
  years and three registrants. It is *not* the adjusted EBITDA Broadcom quotes, and the difference is
  the point of the third table. FY20–FY22 amortization comes from the expected-amortization schedule
  (the cash-flow tag is missing those years); the proxy checks out on FY23 — schedule said 3,255,
  actual was 3,247. [C]

### 8.1 What was paid, and with what

| Deal | Announced | Closed | Transaction value | Cash | Stock | Goodwill added | Debt before → after |
|---|---|---|---|---|---|---|---|
| **LSI** | Dec 16 2013 | May 6 2014 (Q3 FY14) | **$6.6B** | all | — | +$1.2B | $0 → **$5.5B** |
| Emulex | Feb 25 2015 | May 5 2015 (Q3 FY15) | $0.61B | all | — | +$0.1B | — |
| **Broadcom Corp** | May 28 2015 | Feb 1 2016 (Q2 FY16) | **$37.0B** | $17.0B | $20.0B (140M sh) | **+$23.1B** | $3.9B → **$15.0B** |
| Brocade | Nov 2 2016 | Nov 17 2017 (Q1 FY18) | $5.9B ($5.5B + $0.4B net debt) | all | — | +$2.2B | $17.5B → $17.6B (pre-funded) |
| **CA Technologies** | Jul 11 2018 | **Nov 5 2018** (Q1 FY19) | **$18.9B** equity | all | — | +$9.7B | $17.6B → **$37.9B** |
| Symantec (enterprise) | Aug 8 2019 | **Nov 4 2019** (Q1 FY20) | **$10.7B** | all | — | +$6.8B | $33.1B → **$45.0B** |
| **VMware** | May 26 2022 | Nov 22 2023 (Q1 FY24) | ~$69B announced → **$86.3B** at close | $30.8B | $53.4B | **+$53.9B** | $39.2B → **$75.9B** |
| *Qualcomm* | Nov 2017 | **blocked** Mar 2018 | $117B bid | — | — | — | — |

Two things the XBRL confirms that the narrative only asserted:

- **The Q1 timing is real, and tighter than "Q1".** CA closed **Nov 5 2018**; FY18 ended **Nov 4 2018**.
  Symantec closed **Nov 4 2019**; FY19 ended **Nov 3 2019**. Both closed *the day after* the fiscal year
  ended. Every integration charge lands in Q1 of a fresh year, and the year-over-year comparison is
  never split by a deal.
- **Goodwill is the deal ledger and it never reverses.** $391M (FY13) → $1.6B → $24.7B → $26.9B →
  $36.7B → $43.5B → **$97.8B**, flat since Q1 FY24. Seven steps, seven deals, no impairment in twenty
  years.

**Price net of what was immediately sold back.** Tan underwrites the *franchise*, not the company, and
the non-franchise parts are sold within months — which lowers the effective price:

| Deal | Headline | Sold off | Effective |
|---|---|---|---|
| LSI | $6.6B | Axxia networking → Intel **$650M** (Aug 2014); Flash Components + Accelerated Solutions → Seagate **$450M** (closed Sep 2 2014) | **~$5.5B** |
| Brocade | $5.9B | Ruckus Wireless + ICX switching → Arris **$800M** (Dec 1 2017); data-center networking → Extreme Networks | **~$5.0B** |
| VMware | $86.3B | End-User Computing → KKR **$3.5B** (Jul 2024) | **~$82.8B** |

### 8.2 The multiple paid — headline versus underwritten

| Deal | Target FY used | Target revenue | Target GAAP EBITDA | EV/Rev | **EV/EBITDA as reported** | **EV/EBITDA as underwritten** |
|---|---|---|---|---|---|---|
| LSI | FY13 (Dec 2013) | $2,370M | $305M | 2.8x | **21.6x** | not disclosed |
| Emulex | FY14 (Jun 2014) | $447M | −$1M | 1.4x | n/m | not disclosed |
| Broadcom Corp | FY14 (Dec 2014) | $8,428M | $872M | 4.4x | **42.4x** | not disclosed |
| Brocade | FY16 (Oct 2016) | $2,346M | $431M | 2.5x | **13.7x** | not disclosed |
| CA | FY18 (Mar 2018) | $4,235M | $1,497M | 4.5x | **12.6x** | combined LTM adj. EBITDA guided to ~$11.6B |
| Symantec (ent.) | carve-out, n/a | ~$2.3B stated | n/a | ~4.6x | n/a | **8.2x** ($10.7B ÷ $1.3B pro-forma EBITDA incl. synergies) |
| VMware | FY22 (Jan 2022) | $12,851M | $3,497M | 5.4x | **19.7x** (on the $69B announced) | **8.1x** ($69B ÷ the $8.5B three-year EBITDA target) |
| VMware at close | FY23 (Feb 2023) | $13,350M | $3,256M | 6.5x | **26.5x** (on $86.3B) | **10.2x** |

**This table is the playbook in one line.** On the numbers the seller reported, Broadcom paid 13x to
42x EBITDA — multiples that look indefensible for a company that has never once been accused of
overpaying. The deals are underwritten on a *different* EBITDA: the one that exists after 30–50% of
the cost base is removed and the non-franchise revenue is sold. Where Broadcom disclosed that number
(Symantec, VMware) the underwritten multiple is **8–10x**. The gap between the two columns is not
financial engineering — it is the entire thesis, and it is why the deals only work for an operator
who will actually cut.

⚠️ The "as reported" column is deliberately unflattering: GAAP EBITDA at Broadcom Corp (2014) and LSI
(2013) was depressed by restructuring and impairments, so 42x and 21.6x overstate what a normalised
multiple would be. Read the column as *the multiple a passive buyer would have been paying*, which is
the relevant comparison.

### 8.3 What it cost the balance sheet, and how fast it came back

Net debt ÷ LTM GAAP EBITDA, computed quarterly from XBRL. "Quarters to de-lever" = from the quarter
the deal closed in to the first quarter back under **2.0x**.

| Deal | Close quarter | Leverage at close | **Peak** | Peak quarter | Back under 2.0x | **Quarters** |
|---|---|---|---|---|---|---|
| LSI | Q3 FY14 | 4.55x | **4.55x** | Q3 FY14 | Q1 FY15 (1.21x) | **2** |
| Broadcom Corp | Q2 FY16 | 3.90x | **4.25x** | Q3 FY16 | Q2 FY17 (1.60x) | **4** |
| Brocade | Q1 FY18 | 1.52x | 1.63x | Q3 FY18 | never breached | **0** |
| CA | Q1 FY19 | 3.10x | **3.29x** | Q3 FY19 | Q4 FY21 (1.90x) | **11** ⚠ |
| Symantec | Q1 FY20 | **4.18x** | **4.18x** | Q1 FY20 | Q4 FY21 (1.90x) | **7** |
| VMware | Q1 FY24 | 2.66x | **2.79x** | Q2 FY24 | Q3 FY25 (1.78x) | **6** |

⚠ CA's count is contaminated: Symantec closed twelve months later, before CA had de-levered. The two
should be read as a single $29.6B software campaign that took **11 quarters** from first close to
under 2.0x — by far the slowest stretch in the record, and the only time Broadcom went to the well
twice before finishing.

**The counter-intuitive result: VMware, the largest deal in the company's history and the largest in
software history, was the second-easiest to digest.** It peaked at **2.79x** — below LSI (4.55x, a
$6.6B deal), below Broadcom Corp (4.25x) and well below Symantec (4.18x). Two reasons, both in the
tables above: **62% of the consideration was stock** ($53.4B of $86.3B — only $30.8B was cash), and the EBITDA base absorbing
the debt was already $20B. The company that bought VMware was not the company that bought CA.

Where it stands now: Q3 FY26 net debt **$37.1B**, and on the FY26 amortization schedule leverage is
roughly **0.7x net** — the lowest since before LSI. §4 is right that there is no stated target; the
balance sheet is simply the most unencumbered it has been in twelve years.

### 8.4 Did the capital earn a return?

**(a) ROIC — the roll-up signature.** NOPAT at a flat 14% tax (so the series is comparable across
registrants and across Broadcom's very noisy effective rate) ÷ (debt + equity − cash). [C]

| FY | ROIC | | FY | ROIC | |
|---|---|---|---|---|---|
| 2013 | **25.0%** | pre-LSI | 2020 | 6.0% | ← Symantec |
| 2014 | **6.0%** | ← LSI | 2021 | 13.9% | |
| 2015 | 20.7% | | 2022 | 24.6% | |
| 2016 | **−1.2%** | ← Broadcom Corp | 2023 | **28.4%** | pre-VMware peak |
| 2017 | 7.7% | | 2024 | **9.0%** | ← VMware |
| 2018 | 11.0% | | 2025 | 16.6% | |
| 2019 | **5.6%** | ← CA | LTM Q3 FY26 | **26.9%** | |

The shape repeats five times without exception: **a deal collapses ROIC to 6–9% in the close year,
then it climbs back past the prior peak within two to four years.** That is the machine working —
capital deployed at a low initial return that gets earned back through cost removal and pricing, not
through growth. The two failures of the pattern are informative: FY16 went *negative* (Broadcom Corp
was the only deal large enough to push GAAP operating income below zero), and FY19–FY20 stalled at
5.6% / 6.0% because CA and Symantec were stacked on top of each other.

**(b) EBITDA yield on capital deployed.** ΔGAAP EBITDA over the era ÷ price paid. Includes organic
growth, so read it as an upper bound. [C]

| Era | Capital deployed | EBITDA before → after | Δ | **Yield** |
|---|---|---|---|---|
| LSI + Emulex (FY13 → FY15) | $7.2B | $739M → $2,594M | +$1,855M | **26%** |
| Broadcom Corp (FY15 → FY17) | $37.0B | $2,594M → $7,120M | +$4,526M | **12%** |
| Brocade (FY17 → FY18) | $5.9B | $7,120M → $9,216M | +$2,096M | 35% (one year) |
| CA + Symantec (FY18 → FY21) | $29.6B | $9,216M → $14,476M | +$5,260M | **18%** |
| VMware (FY23 → FY25) | $86.3B | $19,956M → $34,120M | +$14,164M | 16% ⚠ AI |

**(c) VMware on its own — the only deal that can be isolated**, because it sits almost entirely inside
the Infrastructure Software segment, which Broadcom reports separately:

| | FY23 (pre-VMware) | FY25 | Δ |
|---|---|---|---|
| Infrastructure software revenue | $7,637M | ~$27,000M | **+$19.4B** |
| Segment operating income | $5,639M | $20,765M | **+$15.1B** |
| Segment operating margin | 73.8% | 76.9% | +3.1 pts |

**+$15.1B of segment operating income on $86.3B paid = a 17.5% pre-tax yield in year two**, against a
promise of **$8.5B of EBITDA within three years**. Segment operating income is struck before
acquisition-intangible amortization and SBC, so it is the right like-for-like against that promise —
and VMware is running at roughly **1.8× what was underwritten**, a year early. On the record available,
VMware is the best deal Broadcom has done, not merely the biggest.

### 8.5 What the record says

1. **Seven deals, twenty years, no impairment, no failed integration, one blocked bid.** There is no
   bad deal in the record to point at. That is rare enough to be the base case for judging the next one.
2. **The multiple paid is never the multiple underwritten**, and the gap is 2–4x. Anyone valuing
   Broadcom's M&A on reported target EBITDA will conclude it overpays every time, and will be wrong
   every time.
3. **De-levering is fast and getting faster relative to size** — 2 to 7 quarters, except the one
   stretch (CA + Symantec, 11 quarters) when Tan stacked two deals. VMware, 13x the size of LSI,
   peaked at lower leverage than LSI did.
4. **Stock as currency changed the risk profile.** Two deals used it — Broadcom Corp (54%) and VMware
   (62%) — and they are the two largest. It is the mechanism that let the largest deal ever carry the
   lowest peak leverage.
5. **The cadence has broken.** Goodwill has been flat at $97.8B since Q1 FY24 — the longest gap without
   a deal in the company's history as a serial acquirer. §5 confirms nothing is pending, and §4 has Tan
   discussing December capital allocation in terms of dividend versus buyback, **with no mention of
   M&A**. Meanwhile leverage is ~0.7x net and cash is $24B: the capacity has never been larger and the
   pipeline has never been emptier.
6. **§7 prices exactly that.** The multiple stopped tracking growth in 2026, and one candidate reading
   is that the market is no longer paying for the optionality of the next deal — the "serial acquirer"
   premium — at the same time it declines to pay for the AI ramp. The balance-sheet capacity is now
   pointed at the XPV backstop (§6) rather than at an acquisition, and that is a different, worse-paid
   use of the same A-rated credit.

### 8.6 What is still missing

- **CA's underwritten multiple.** Broadcom never disclosed a standalone CA EBITDA or synergy target —
  only the ~$11.6B *combined* LTM adjusted EBITDA. Backing out Broadcom's own standalone figure from
  the Q3 FY18 non-GAAP reconciliation would close this.
- **Pre-2014 deals** — the Agilent carve-out (2005, $2.65B) and the KKR/Silver Lake era predate XBRL
  and predate the multiple history in §7. Worth having if the 2014+ BBG pull (§10.3) arrives.
- **Cash returned per deal.** The divestiture column is what I could verify; there were smaller
  disposals (Symantec's consumer piece stayed with NortonLifeLock, VMware's Carbon Black) that are not
  in it.
- **An IRR per deal** would need the acquired business's cash flows separated out, which Broadcom only
  makes possible for VMware (and only at the segment level).

### Working files [local only, not committed]

`avgo_fin.csv` (quarterly) and `avgo_fin_fy.csv` (fiscal year) are built from the EDGAR XBRL
`companyconcept` endpoint by `xbrl2.ps1` / `xbrl2_fy.ps1`; `targets.ps1` does the same for each target
at announcement and `targets_close.ps1` at close; `lev.awk` produces the quarterly leverage path.
Regenerate rather than store.

---

## 9. M&A capacity — how big a deal could Tan do today?

§8 established what Broadcom has bought and what it cost the balance sheet. This asks the forward
question: **at the current rating, how much could it spend, and what does the XPV backstop take away?**

The answer turns out to be uncomfortable for the way the question is usually posed. Leverage is not
the binding constraint and has not been for two years.

### 9.1 What the agencies have tolerated, rung by rung

Broadcom's rating is not a fixed constraint — it is a ladder it spent five years climbing, and the
leverage attached to each rung is on the record:

| Date | S&P | Moody's | Leverage at the time | Event |
|---|---|---|---|---|
| Nov 2018 | BBB− | Baa3 | Moody's saw total debt/EBITDA going **2.0x → 3.7x** | CA closes |
| FY2020 | BBB− | Baa3 | adjusted debt/EBITDA **~3.7x** | post-Symantec |
| Nov 28 2023 | **BBB−→BBB** | Baa3, outlook→positive | — | VMware closes |
| Oct 29 2024 | BBB | **Baa3→Baa1** (two notches) | S&P: FY24 adjusted **2.0x** | de-levering |
| Jan 13 2025 | **BBB→BBB+** | Baa1 | S&P: FY25 **1.2x** | |
| Sep 17 2025 | **BBB+→A−**, positive | **Baa1→A3**, positive | S&P: FY26E **~0.8x**; Moody's: **<1.5x** by FYE26 | AI momentum |
| Today (Q3 FY26) | A− positive | A3 positive | **0.72x net / 1.19x gross** (computed) | §2 |

Sources: S&P and Moody's actions as relayed by the financial press [S — the primary S&P research
updates are paywalled; §10 keeps "find the primary text" open]. Leverage at Q3 FY26 is computed from
§8's series.

**The one explicit threshold on the record.** In its September 17 2025 upgrade to A−, S&P said it
would consider a further upgrade if Broadcom "consistently outgrows the overall IT industry **and
maintains net leverage below 2.5x through acquisitions and shareholder returns**" [S].

That sentence is the single most useful number in this section, and note what it is *not*: it is not a
downgrade trigger. It is the level at which S&P would still go **up**. The downgrade tolerance sits
above it, and the historical record says where: **Broadcom carried 3.7x at BBB−/Baa3**, the bottom
rung of investment grade.

**So the ladder prices itself.** Roughly:

| Net leverage | What it implies |
|---|---|
| **≤ 2.5x** | compatible with an **upgrade to A** (S&P's own words) |
| **~3.0x** | the A−/A3 rung holds; upgrade path parked |
| **~3.7x** | BBB−/Baa3 — three to four notches down, the 2018–2020 experience |

A deal that takes leverage to 3.7x is not "still investment grade". It is handing back five years of
ratings work — which, with a $29B guarantee already outstanding and a new risk factor about
downgrades "including due to backstops or guarantees" (§4), is a different decision than it was in 2018.

### 9.2 The base — what EBITDA is being levered [C]

The whole answer scales with this number, so it is worth being explicit about it.

| | FY26E | FY27E (BBG consensus) |
|---|---|---|
| Revenue | **$105.9B** (Q1 19.3 + Q2 22.2 + Q3 29.6 + Q4 guide 34.8) | $173.3B |
| GAAP operating income | ~$54.1B (Q4 at Q3's 53.9% margin) | — |
| + D&A (FY26 amortization schedule 7.88 + depreciation ~0.6) | ~$8.5B | — |
| **GAAP EBITDA** | **~$62.5B** | — |
| + SBC (~$2B/qtr, §3) | ~$8B | — |
| **Adjusted EBITDA** | **~$70B** | **~$116B** (at the BBG 67% margin) |

Cross-check: the BBG margin ladder puts EBITDA margin at ~67%, and 67% × $105.9B = **$70.9B**. The two
routes agree, so ~$70B is solid for FY26.

⚠️ **FY27 is the fork.** $116B of EBITDA is BBG consensus, and §7 is the finding that **the market is
currently declining to pay for exactly that number**. Using it to size debt capacity would assume away
the live debate. Everything below is therefore run on **both** bases, and the FY26 column is the one to
believe.

### 9.3 The capacity grid

**Maximum incremental net debt (US$B)** = L × EBITDA − adjusted net debt, starting from Q3 FY26 net
debt of **$37.1B**.

| Base / backstop treatment | L=2.5x | L=3.0x | L=3.7x |
|---|---|---|---|
| **FY26E $70B** / backstop excluded | **$138B** | $173B | $222B |
| FY26E $70B / **backstop $29B counted as debt** | **$109B** | $144B | $193B |
| FY26E $70B / + a follow-on guarantee (~$79B total) | **$59B** | $94B | $143B |
| FY27E $116B / backstop excluded | $253B | $311B | $392B |
| FY27E $116B / backstop $29B as debt | $224B | $282B | $363B |
| FY27E $116B / + follow-on (~$79B total) | $174B | $232B | $313B |

**Maximum all-cash deal price**, allowing for the fact that the target brings its own EBITDA — priced
at the **9x underwritten multiple** §8.2 established (post-synergy, which is how Tan actually
underwrites):

| Base / backstop treatment | L=2.5x | L=3.0x | L=3.7x |
|---|---|---|---|
| **FY26E $70B** / backstop excluded | **$191B** | $259B | $377B |
| FY26E $70B / backstop $29B as debt | **$151B** | $216B | $328B |
| **FY26E $70B / + follow-on ~$79B** | **$82B** | $141B | $243B |
| FY27E $116B / backstop excluded | $350B | $466B | $666B |
| FY27E $116B / + follow-on ~$79B | $241B | $348B | $532B |

**Read the most punitive cell first.** FY26 EBITDA only, the backstop *and* a follow-on guarantee both
counted as debt, and held to the leverage S&P says is compatible with an **upgrade**: Broadcom can
still write a **$82B all-cash cheque**. That is a second VMware, in cash, in the worst corner of the
grid.

And that is before stock. VMware was **62% stock** (§8.1). Re-run the 2.5x constraint with the VMware
cash/stock mix and leverage stops binding at any deal size that exists — the cash portion grows more
slowly than the acquired EBITDA. **Stock plus a $70B EBITDA base removes leverage from the problem
entirely.**

**Interest coverage doesn't bind either.** $100B of new debt at ~5.5% is $5.5B of incremental interest
against ~$70B of EBITDA; coverage stays above 10x. And Broadcom does not need to borrow to accumulate:
at Q3's 46% FCF margin, FY26 free cash flow is roughly **$47B** against a **$12.7B** dividend
(4.89B shares × $2.60). **~$34B of surplus cash per year — three years of retained FCF alone funds a
$100B deal with no new debt at all.**

### 9.4 What the capacity actually buys

At the 9x underwritten multiple, a $150B deal needs a target capable of **~$17B of post-synergy
EBITDA**. At the ~77% segment operating margin Broadcom has actually achieved in software (§8.4), that
is a target with roughly **$20–25B of revenue**.

The problem is not the cheque. It is that §8.2 also shows **what Tan pays on revenue**:

| Deal | EV/Revenue paid |
|---|---|
| Emulex | 1.4x |
| Brocade | 2.5x |
| LSI | 2.8x |
| Broadcom Corp | 4.4x |
| CA | 4.5x |
| VMware | 5.4x |

**Median ~3.6x revenue, and never above 5.4x in twenty years.** Every single target was an unloved
asset: a mainframe business growing at 0%, a storage-networking business in structural decline, a
virtualization franchise the market had written off as ex-growth. Tan has never once bought a
high-multiple growth asset.

That is the real constraint. The list of enterprise-software franchises with $20B+ of revenue, genuine
switching costs, an under-priced renewal base **and** a 3–5x revenue multiple is close to empty in
2026 — the same AI re-rating that took Broadcom from 16x to 42x and back (§7) also took the multiple
of every plausible target out of Tan's historical range. **The capacity is unprecedented and the
shopping list is shorter than it has ever been.** That, not the balance sheet, is the most likely
explanation for goodwill sitting flat at $97.8B since Q1 FY24 (§8.5).

### 9.5 Revealed preference — what Tan has actually been willing to do

Two scalings of the historical record, both computed from §8:

| Deal | Price ÷ own EBITDA at the time | Price ÷ own market cap | Equivalent today |
|---|---|---|---|
| Brocade (2016) | 0.83x | 8% | $58B / $140B |
| Symantec (2019) | 1.16x | 10% | $81B / $175B |
| CA (2018) | 2.05x | 17% | $144B / $297B |
| VMware (2022) | 3.46x (announced) | 29% | $242B / $507B |
| LSI (2013) | 8.9x | 51% | $623B / $892B |
| Broadcom Corp (2015) | 14.3x | **97%** | $1.0T / $1.7T |

Market cap today: 4.887B diluted shares × $357.61 = **$1.75T**.

Tan has bought a company **larger than himself** once, and a company half his size once. The median
deal is ~2.8x his own EBITDA, which today is **~$196B**. Nothing in the historical pattern suggests
$82B — the worst cell in the grid — is a ceiling he would feel.

### 9.6 Where the backstop actually bites

The $29B backstop is close to irrelevant to M&A capacity on its own: it moves net debt from $37.1B to
$66.1B, which on FY26E EBITDA is **0.94x** instead of 0.72x. The break-even is worth stating plainly —
**EBITDA would have to fall to $26.4B** for net debt plus the backstop to reach 2.5x. Broadcom's GAAP
EBITDA was $34.1B in FY25 and is tracking ~$62.5B in FY26. The backstop alone cannot threaten the
rating.

The full platform is a different question. Taking BofA's **$370B** peak-exposure estimate for all 20 GW
by mid-2029 (§6) and asking what EBITDA keeps ($37.1B + $370B) under 2.5x:

| Requires | vs consensus |
|---|---|
| **$162.8B of EBITDA** | FY28E ~$152B (226.7 × 67%) → **2.68x, above the line** |
| | FY29E ~$210B (312.7 × 67%) → **1.94x, back under** |

So: **if the entire 20 GW platform is built and the agencies treat all of it as debt, Broadcom crosses
2.5x on FY28 numbers and comes back under on FY29.** Both halves of that sentence are load-bearing —
it assumes the full platform *and* the full consensus. Neither is committed.

And notice what it means: the backstop is only a rating problem **if the FY27–28 AI revenue doesn't
arrive**. If it arrives, the guarantee is comfortably carried. If it doesn't, the guarantee is being
called at the same time the EBITDA is missing — the wrong-way risk already flagged in §6. **The
backstop and the multiple are pricing the same uncertainty**, which is why §7's 2026 sign flip and
this section keep landing on the same question.

### 9.7 The conclusion

1. **Leverage is not the constraint and has not been since FY24.** In the harshest corner of the grid
   — FY26 EBITDA only, backstop and a follow-on guarantee both treated as debt, held to the level S&P
   says supports an *upgrade* — Broadcom can still buy an **$82B** target for cash. With stock in the
   mix, the constraint disappears.
2. **Retained cash flow alone is a ~$100B deal in three years.** ~$34B of post-dividend FCF a year,
   with zero incremental debt.
3. **The $29B backstop costs ~0.2x of leverage.** It is a rounding error against the capacity. The
   *follow-on* vehicle is what matters, and only at full 20 GW scale, and only if the EBITDA misses.
4. **The binding constraint is the target list, not the balance sheet.** Tan has never paid more than
   5.4x revenue and has never bought a growth asset. Very little at $20B+ of revenue is available in
   that range in 2026.
5. **Which reframes the question for §7.** If the "serial acquirer" optionality is part of what the
   market used to pay for, it is not being taken away by the balance sheet — the balance sheet has
   never been more capable. It is being taken away by price. That is a different, and more durable,
   reason for a lower multiple than a financing scare.

### 9.8 What would sharpen this

- **The primary S&P and Moody's texts** (§10.4) — the downgrade triggers are the one input here taken
  from press relays rather than the source, and the whole grid keys off them.
- **How the agencies actually adjust for the backstop.** BofA says S&P leans to treat the guarantee as
  debt; that is a second-hand characterisation. The primary treatment would collapse the three
  backstop rows into one.
- **The December board meeting** (§4). Tan framed capital allocation as dividend versus buyback with
  no mention of M&A. Given the capacity above, that silence is information — and December is when it
  gets priced.

### Working files [local only, not committed]

Capacity grid computed in-session from §8's XBRL series plus the FY26 guide; no new files. Share count
`WeightedAverageNumberOfDilutedSharesOutstanding` (Q3 FY26, 4,887M) and the long price history come
from the same EDGAR / Yahoo pulls as §7.

---

## 10. Open questions (for IR / next session)

1. $42B convertible notes: issuer, what they convert into, trigger, relation to the $29B Backstop.
2. Who is "the seller" in the fixed-price rack buy-back remedy? Could it be Broadcom?
3. Will the follow-on $60–100B vehicle carry a Broadcom guarantee, and how much?
4. How S&P / Moody's actually adjust leverage for the Backstop (find the primary S&P text).
5. December board capital allocation: dividend step-up vs buyback vs any M&A.
6. Confirm the Jun 4 2026 move size (sources still disagree: −4% close vs −16% intraday).
7. ~~Confirm the Dec-2025 vs Jun-2026 price/multiple peaks~~ — **done in §7**: multiple peak 42.1x on Dec 10 2025, price ATH $481.57 on Jun 2 2026. Jun 4 2026 still unconfirmed; the Sep 3 move was −2.7%, not −6.3%.

## 11. Next steps

1. ~~**Decompose the multiple 2021–2026**~~ — **DONE (Sep 21 2026), §7.** Answer: 89% of the five-year move is forward EPS, not the multiple; the growth↔multiple correlation is +0.73 until 2026 and **−0.79 in 2026**; M&A never moved it; TSMC never re-rated, so it is AVGO-specific.
2. **Why the 2026 sign flip** — the open question §7 leaves. Candidates to test: (a) the market discounting the FY27–28 AI ramp because Anthropic/OpenAI need Broadcom's balance sheet (§6), (b) gross-margin mix from XPU/system sales, (c) customer concentration / Google-MediaTek share loss. A per-quarter attribution of the estimate revisions (AI vs non-AI vs software) against the multiple would separate them.
3. Request the 2014+ BBG pull to cover LSI (2014), Broadcom Corp (2016), CA (2018), Qualcomm block (2018), Symantec (2019) — and re-run §7 over that window. §8 now has the deal-by-deal numbers to overlay on it, which is where the "does M&A move the multiple" question can finally be tested on more than VMware.
5. ~~**M&A capacity model**~~ — **DONE (Sep 21 2026), §9.** Answer: leverage is not the constraint. Worst corner of the grid (FY26 EBITDA only, backstop + a follow-on guarantee both counted as debt, held to the 2.5x S&P says supports an *upgrade*) still funds an **$82B all-cash deal**; with stock in the mix it stops binding. The $29B Backstop costs ~0.2x of leverage. **The binding constraint is the target list** — Tan has never paid above 5.4x revenue. Inputs to sharpen listed in §9.8.
6. **The target screen** — the natural follow-on to §9.4. Who actually fits: $15B+ revenue, mission-critical with switching costs, an under-priced renewal base, and 3–5x EV/revenue. Run it as a screen rather than a guess, and the answer to "why has Tan not bought anything since 2023" becomes testable.
7. **Price the optionality** — §9.7 raises it and neither §7 nor §9 settles it: how much of the multiple was ever "next deal" optionality, and is its disappearance part of the 2026 de-rating? A cross-sectional look at serial acquirers that stopped acquiring would frame it.
