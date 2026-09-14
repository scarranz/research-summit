# Broadcom (AVGO) — Balance Sheet, M&A Capacity, AI Financing (XPV) & Multiple

Research notes, session of **2026-09-14**. Chat-only research, **no portal changes yet**. This is the base for
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

## 7. Valuation multiple — data & first read

### Data sources
- **Daily BBG forward multiples, Sep 2 2021 → Sep 2 2026:**
  `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\BBG PORTFOLIO BENCH\multiples\AVGO 1GBF.xlsx` (+ `AVGO 2GY.xlsx`, `AVGO 3GY.xlsx`).
  Fields: PE_RATIO, HEADLINE_EV_TO_EBITDA, PX_TO_FCF (1,255 trading days). Start looks like a 5-yr pull limit.
- **Pre-2021:** nothing clean. Ask Dani for the same BBG pull back to **2014-01-01** (monthly OK) + PX_LAST, CUR_MKT_CAP.
- `avgo-context/AVGO_BBG.xlsx` and `FA_AVGO_US.xlsx` = annual only (no history). `DCF AVGO.xlsm` "Ratios Year" multiples use next-year *actual* GAAP → hindsight, don't use as consensus.
- AVGO is **not** in `BBG_CONSENSUS.txt` nor in the Summit DCF MCP.

### Forward P/E / forward EV/EBITDA at quarter-end (1GBF)

| | Mar | Jun | Sep | Dec |
|---|---|---|---|---|
| 2021 | – | – | 15.8 / 13.2 | 19.9 / 16.3 |
| 2022 | 17.0 / 14.1 | 12.4 / 10.7 | 11.0 / 9.6 | 13.6 / 11.8 |
| 2023 | 15.1 / 12.9 | 19.8 / 16.7 | 18.4 / 15.7 | 23.4 / 18.4 |
| 2024 | 26.1 / 21.9 | 28.5 / 22.8 | 28.2 / 22.9 | 35.3 / 27.9 |
| 2025 | 23.4 / 19.1 | 35.7 / 28.8 | 36.1 / 28.7 | 32.4 / 25.2 |
| 2026 | 22.6 / 17.8 | 22.6 / 18.1 | 20.4 / 16.2 (Sep 2) | |

Low 10.6x / 9.3x (Oct 14 2022). High 42.1x / 33.6x (Dec 10 2025).

**First read:**
- VMware (closed Nov 2023) did **not** compress the multiple; it kept rising through 2024 → the AI narrative dominated.
- The 2026 de-rating needs splitting into price vs forward-EPS change.

---

## 8. Open questions (for IR / next session)

1. $42B convertible notes: issuer, what they convert into, trigger, relation to the $29B Backstop.
2. Who is "the seller" in the fixed-price rack buy-back remedy? Could it be Broadcom?
3. Will the follow-on $60–100B vehicle carry a Broadcom guarantee, and how much?
4. How S&P / Moody's actually adjust leverage for the Backstop (find the primary S&P text).
5. December board capital allocation: dividend step-up vs buyback vs any M&A.
6. Confirm the Jun 4 2026 move size and the Dec-2025 vs Jun-2026 price/multiple peaks against BBG PX_LAST.

## 9. Next steps (agreed direction, not started)

1. **Decompose the multiple 2021–2026** with the DAA 1GBF file: implied forward EPS = price / P/E; split each period into Δprice vs ΔEPS; overlay events (VMware close, Dec-25 print, Jun-26 XPV, Aug-14 BofA, Sep-3 print).
2. Request the 2014+ BBG pull to cover LSI (2014), Broadcom Corp (2016), CA (2018), Qualcomm block (2018), Symantec (2019).
3. M&A track record with numbers per deal: price, multiple paid, debt at close, quarters to de-lever, ROIC.
4. M&A capacity model: debt headroom at A-/A3 with and without the Backstop treated as debt.
