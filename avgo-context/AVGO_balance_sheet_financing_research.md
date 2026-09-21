# Broadcom (AVGO) — Balance Sheet, M&A Capacity, AI Financing (XPV) & Multiple

Research notes, sessions of **2026-09-14** (§1–§6) and **2026-09-21** (§7). Chat-only research, **no portal changes yet**. This is the base for
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

- **None** disclosed. Liquidity section keeps generic "potential acquisitions" language. Last moves: VMware EUC sale ($3.5B, 2024), Seagate SoC purchase ($600M, 2024).

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

## 8. Open questions (for IR / next session)

1. $42B convertible notes: issuer, what they convert into, trigger, relation to the $29B Backstop.
2. Who is "the seller" in the fixed-price rack buy-back remedy? Could it be Broadcom?
3. Will the follow-on $60–100B vehicle carry a Broadcom guarantee, and how much?
4. How S&P / Moody's actually adjust leverage for the Backstop (find the primary S&P text).
5. December board capital allocation: dividend step-up vs buyback vs any M&A.
6. Confirm the Jun 4 2026 move size (sources still disagree: −4% close vs −16% intraday).
7. ~~Confirm the Dec-2025 vs Jun-2026 price/multiple peaks~~ — **done in §7**: multiple peak 42.1x on Dec 10 2025, price ATH $481.57 on Jun 2 2026. Jun 4 2026 still unconfirmed; the Sep 3 move was −2.7%, not −6.3%.

## 9. Next steps

1. ~~**Decompose the multiple 2021–2026**~~ — **DONE (Sep 21 2026), §7.** Answer: 89% of the five-year move is forward EPS, not the multiple; the growth↔multiple correlation is +0.73 until 2026 and **−0.79 in 2026**; M&A never moved it; TSMC never re-rated, so it is AVGO-specific.
2. **Why the 2026 sign flip** — the open question §7 leaves. Candidates to test: (a) the market discounting the FY27–28 AI ramp because Anthropic/OpenAI need Broadcom's balance sheet (§6), (b) gross-margin mix from XPU/system sales, (c) customer concentration / Google-MediaTek share loss. A per-quarter attribution of the estimate revisions (AI vs non-AI vs software) against the multiple would separate them.
3. Request the 2014+ BBG pull to cover LSI (2014), Broadcom Corp (2016), CA (2018), Qualcomm block (2018), Symantec (2019) — and re-run §7 over that window, where the M&A question can actually be tested.
4. M&A track record with numbers per deal: price, multiple paid, debt at close, quarters to de-lever, ROIC.
5. M&A capacity model: debt headroom at A-/A3 with and without the Backstop treated as debt.
