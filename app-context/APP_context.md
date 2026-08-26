# AppLovin Corporation (NASDAQ: APP) — Research Context Pack

A consolidated context file for building the AppLovin company profile in the Summit Research Portal. Synthesizes the FY2025 Form 10-K, the 1Q26 and 2Q26 Form 10-Qs, and the Bloomberg consensus model (`APP_BBG_MODL.xlsx`, estimate source **BST**, projections to 2028).

> **Source discipline.** Company-disclosed figures (10-K, 10-Q) are ground truth and labeled with their period. Bloomberg consensus estimates are labeled **[BBG EST]** and are *consensus*, not company guidance — **AppLovin does not publish forward guidance in its SEC filings**, so there is no `[GUIDANCE]` tier in this pack. Figures I computed rather than read off a filing are labeled **[derived]**.

> **Fiscal calendar.** Calendar year. FY2025 = 12 months ended **Dec 31, 2025**. Quarter map: 1Q26 ended Mar 31, 2026 · 2Q26 ended Jun 30, 2026.

> **The single most important framing.** On **June 30, 2025 AppLovin sold its Apps (mobile-gaming) business** to Tripledot. Apps is presented as **discontinued operations in all periods**, and the company now reports as a **single operating and reportable segment**. Every "revenue," "margin," and "EPS" number below is **continuing operations = the advertising business only**, unless explicitly flagged. Any pre-2025 figure sourced from elsewhere that includes Apps is not comparable to these.

**Source documents (in the `APP/` working folder, outside the repo):** `2025 10k.pdf` · `1Q 10Q.pdf` (1Q26) · `2Q 10Q.pdf` (2Q26) · `APP_BBG_MODL.xlsx`.

---

## 1. Snapshot

| | |
|---|---|
| **Ticker / exchange** | APP / Nasdaq Global Select Market (Class A only; Class B and C are not listed) |
| **HQ** | 1100 Page Mill Road, Palo Alto, California 94304 |
| **Incorporation** | Delaware, **July 18, 2011** |
| **SEC filer** | Domestic — files 10-K/10-Q/8-K. Large accelerated filer |
| **IPO** | **April 15, 2021** at **$80.00/share**; first close $65.20 |
| **Reportable segments** | **One** (single segment since the Jun 30, 2025 Apps divestiture) |
| **FY2025 revenue** | **$5,480.7M (+70% YoY)** — continuing ops (advertising) |
| **FY2025 income from operations** | **$4,151.9M — 75.8% operating margin** |
| **FY2025 Adjusted EBITDA** | **$4,512.5M — 82.3% margin** |
| **FY2025 diluted EPS (GAAP)** | **$9.75** (continuing ops $10.04; disc. ops −$0.29) |
| **FY2025 cash from operations** | $3,971.1M · **FCF $3,952.0M** (company definition) |
| **Balance sheet (12/31/25)** | Cash $2,487.1M · Senior notes $3,550.0M principal · Total assets $7,259.6M |
| **Balance sheet (6/30/26)** | Cash $3,053.3M · Total assets $8,269.1M · Equity $3,163.0M |
| **Employees** | **898** (876 full-time, 22 part-time/intern) in 15 countries, as of 12/31/25 — ~60% outside the US |
| **CEO** | **Adam Foroughi** — co-founder, CEO and Chairperson since founding (2011) |
| **CFO** | **Matt Stumpf** |
| **Other named officers** | Vasily ("Basil") Shikin, CTO · Victoria Valenzuela, Chief Administrative & Legal Officer · Herald Chen, former President & CFO, now a director |
| **Auditor** | Deloitte & Touche LLP (San Jose), auditor **since 2015**; FY25 report dated Feb 19, 2026 |
| **Dividend** | **Non-payer** — "never paid cash dividends… do not anticipate paying any in the foreseeable future" |
| **Buyback** | Program authorized Feb 2022; **+$3.2B authorized in 2025**. $2.2B repurchased in FY25; **$1.8B remaining as of 6/30/26** |
| **Share count** | 335,291k total as of 6/30/26 (Class A 305,084k · Class B 30,208k · Class C nil) |
| **Public float proxy** | Non-affiliate market value **$102.7B** at Jun 30, 2025 (10-K cover) |

---

## 2. The Investment Narrative

Five threads define the AppLovin story across FY23–1H26:

1. **It stopped being a games company and became a pure ad-tech company.** The June 30, 2025 sale of the Apps business to Tripledot ($715.6M total consideration) completed a multi-year pivot. What remains is one segment: an AI-driven advertising platform. The optics matter — reported "revenue" fell from a combined ~$4.7B (2024, incl. Apps) to a *continuing-ops* $5.48B (2025), and the 2023–24 comparatives in this pack are all **restated to advertising-only**.

2. **Margin expansion is the story, and it is extreme.** Operating margin went **42% → 59% → 76%** (2023→2025) and Adjusted EBITDA margin **67.1% → 74.8% → 82.3%**, reaching **83.9–84.5%** in 1H26. This is not cost-cutting into a shrinking base — revenue grew 70% in 2025 while *total* costs and expenses grew 1.2% ($1,313M → $1,329M). Operating leverage is nearly total because the marginal cost of an incremental Axon-matched impression is datacenter capacity.

3. **Growth flipped from volume to price.** In 2024, revenue +75% came from installs **+50%** and net revenue per installation **+22%**. In 2025 the mix inverted: installs **+3%**, net revenue per install **+72%**. It got more extreme in 2026: **1Q26 installs −18% / NRPI +93%**, **2Q26 installs −2% / NRPI +58%**. *All* growth is now yield, not volume. **This is the single most important trend line to monitor** — it is the bull case (Axon monetizes each install far better) and the bear case (volume is flat-to-down) simultaneously.

4. **An extraordinarily small company financially.** **898 employees** produced **$5.48B of revenue and $4.15B of operating income** in 2025 — roughly $6.1M of revenue and $4.6M of operating income *per employee*. ~380 people (42% of headcount) are in R&D. There is essentially no capex: **purchases of property and equipment were $0.5M in FY2025**. The business converts almost all EBITDA to cash.

5. **The capital story is buyback-only, and the incentive story is a moonshot.** No dividend, no M&A of scale; $2.2B of stock retired in 2025 and $1.5B in 1H26, funded entirely from FCF against $3.55B of fixed-rate senior notes. Meanwhile the **October 2025 PSU grant vests on market-capitalization milestones starting at $300B and running up to $1.0 trillion** over a 7-year window — the clearest possible statement of management's ambition, and the FY25 audit's Critical Audit Matter.

---

## 3. The Business

### 3.1 What it is
End-to-end, AI-powered advertising solutions. Revenue is earned when advertisers hit their **return-on-ad-spend (ROAS)** targets — the company is paid on performance, not on media placement. Substantially all revenue comes from fees collected from advertisers; revenue is booked **net of consideration paid or payable to publishers**.

### 3.2 The product suite
| Product | What it does | How it earns |
|---|---|---|
| **Axon Ads Manager** → renamed **AppLovin Ads** (in the 2Q26 10-Q) | The user/customer-acquisition engine and **the vast majority of revenue**. Powered by the **Axon AI** recommendation system; matches advertiser demand to publisher supply via microsecond-scale auctions | Dynamically priced against the advertiser's campaign goals |
| **MAX** | Publisher-side monetization / in-app bidding — runs a real-time competitive auction for a publisher's ad inventory | **A percentage of winning auction spend** (2Q26 wording; the 10-K said "percentage of client spend") |
| **Adjust** | Measurement, attribution and analytics marketing platform | **Annual software subscription fee** |
| **Wurl** | Connected-TV (CTV) platform — distributes streaming video for content companies, plus CTV ad/publishing tools | Usage-based and/or CPM, from content companies and streamers |

> **Adjust data firewall (worth quoting):** *"Adjust's marketing platform is operated by our wholly-owned subsidiary and data generated by Adjust's services is not shared with AppLovin or incorporated into or used to optimize its recommendation engine or other technologies unless directed by a customer."*

### 3.3 The flywheel (management's own framing)
More advertisers → more data on users and engagement → stronger scaled distribution → better insights for Axon AI → higher efficiency/effectiveness of Axon Ads Manager → more advertisers. The 10-K calls the link to the advertising ecosystem "a durable competitive advantage."

### 3.4 Growth strategy (10-K, Item 1)
- **Existing market expansion** within the mobile-app ecosystem.
- **Enhance/extend Axon AI** — compounding improvements as scale grows.
- **New verticals** — **web-based e-commerce and social media**; solutions already made available to web advertisers, explicitly described as *early*.
- **Other content industries** — **CTV via Wurl**, including applying Axon AI to CTV.
- **Talent**, and **opportunistic strategic transactions**.

### 3.5 Customers, competition, concentration
- Customers span indie studios to *"some of the largest global internet platforms, such as Meta and Google"* — who are simultaneously clients and competitors.
- **Named competitors:** Meta, Google, Amazon, Unity Software, plus various private companies "several of which are also our partners and clients."
- **No customer represented ≥10% of revenue** in 2023, 2024 or 2025, and none ≥10% of accounts receivable at 12/31/25 or 12/31/24. *(Note the tension with the "concentration of our revenue sources" risk factor — the 10% test is passed, but the risk factor is still flagged.)*
- **Seasonality:** yes, tied to mobile gaming and e-commerce (holidays, promotional events, school cycles, game launches). Management expects seasonality to **become more pronounced** as large e-commerce advertisers grow as a share of the mix.

---

## 4. Consolidated Financials — FY2023 / FY2024 / FY2025

### 4.1 Income statement (continuing operations, $000s)
| | FY2025 | FY2024 | FY2023 | 25 vs 24 |
|---|---|---|---|---|
| **Revenue** | **5,480,717** | 3,224,058 | 1,841,762 | **+70%** |
| Cost of revenue | 665,140 | 520,613 | 356,613 | +28% |
| Sales & marketing | 203,651 | 252,863 | 228,025 | (19)% |
| Research & development | 226,510 | 374,710 | 333,781 | (40)% |
| General & administrative | 233,502 | 164,916 | 150,932 | +42% |
| **Total costs and expenses** | **1,328,803** | 1,313,102 | 1,069,351 | **+1.2%** |
| **Income from operations** | **4,151,914** | 1,910,956 | 772,411 | +117% |
| Interest expense & loss on debt settlement | (207,016) | (317,209) | (273,508) | (35)% |
| Other income, net | 8,012 | 18,196 | 2,699 | (56)% |
| **Income before income taxes** | **3,952,910** | 1,611,943 | 501,602 | +145% |
| Provision for income taxes | 519,715 | 22,419 | 43,776 | nm |
| **Net income — continuing ops** | **3,433,195** | 1,589,524 | 457,826 | +116% |
| Loss from discontinued ops, net of tax | (99,444) | (9,748) | (101,115) | — |
| **Net income** | **3,333,751** | 1,579,776 | 356,711 | +111% |
| **Diluted EPS (GAAP)** | **$9.75** | $4.53 | $0.98 | +115% |
| Basic EPS | $9.84 | $4.68 | $1.01 | |
| Diluted WASO (000s) | 341,970 | 347,808 | 362,589 | |

**As a % of revenue:** cost of revenue 12% / 16% / 19%; S&M 4% / 8% / 12%; R&D 4% / 12% / 18%; G&A 4% / 5% / 8%; **total costs 24% / 41% / 58%**; **operating margin 76% / 59% / 42%**.

> **Watch the expense lines — they are SBC-driven, not headcount-driven.** The FY25 *declines* in S&M (−19%) and R&D (−40%) are almost entirely lower stock-based-compensation payroll costs (−$57.1M and −$151.1M respectively), not operational retrenchment. The FY25 G&A *increase* (+42%) is +$31.6M professional services (divestiture support) and +$24.5M bad-debt expense "primarily related to new initiatives." This reverses hard in 2026 (see §5).

### 4.2 Non-GAAP bridge ($000s)
| | FY2025 | FY2024 | FY2023 |
|---|---|---|---|
| Net income | 3,333,751 | 1,579,776 | 356,711 |
| Loss from discontinued ops | 99,444 | 9,748 | 101,115 |
| Net income from continuing ops | 3,433,195 | 1,589,524 | 457,826 |
| + Interest expense & loss on settlement | 207,016 | 317,209 | 273,508 |
| − Other income, net | (15,694) | (23,396) | (4,729) |
| + Provision for income taxes | 519,715 | 22,419 | 43,776 |
| + Amortization, depreciation, write-offs | 130,724 | 128,791 | 119,152 |
| ± Non-operating FX | (3,949) | 1,642 | 837 |
| + Stock-based compensation | 207,958 | 357,431 | 342,551 |
| + Transaction-related expense | 27,579 | 885 | 1,047 |
| + Restructuring costs | 5,908 | 17,259 | 2,316 |
| **Adjusted EBITDA** | **4,512,452** | 2,411,764 | 1,236,284 |
| **Adjusted EBITDA margin** | **82.3%** | 74.8% | 67.1% |

**Free Cash Flow (company definition = CFO − capex − finance-lease principal):**
| | FY2025 | FY2024 | FY2023 |
|---|---|---|---|
| Net cash provided by operating activities | 3,971,094 | 2,099,011 | 1,061,510 |
| Purchase of property and equipment | (473) | (4,776) | (4,246) |
| Principal payments of finance leases | (18,669) | (20,875) | (20,170) |
| **Free Cash Flow** | **3,951,952** | 2,073,360 | 1,037,094 |
| Investing activities | 358,428 | (106,754) | (77,829) |
| Financing activities | (2,593,069) | (1,749,844) | (1,562,791) |

FCF/Adjusted EBITDA ≈ **87.6%** in FY25 **[derived]**. FCF conversion is the cleanest part of the story: capex is a rounding error.

### 4.3 Revenue by geography (based on **user location**, $000s)
| | FY2025 | FY2024 | FY2023 |
|---|---|---|---|
| United States | 2,827,248 (51.6%) | 1,726,202 (53.5%) | 1,015,897 (55.2%) |
| Rest of the world | 2,653,469 (48.4%) | 1,497,856 (46.5%) | 825,865 (44.8%) |
| **Total** | **5,480,717** | 3,224,058 | 1,841,762 |

*Percentages are [derived]. This is the **only** revenue disaggregation AppLovin publishes — there is no product-level or vertical-level revenue split. For the Overview's "How it makes money" block: **the ≥2-slice rule is satisfied by Geography only; Segments is a single slice and must not be drawn as a one-bar chart.***

### 4.4 Segment disclosure (Note 14)
Single reportable segment. CODM = the **Chief Executive Officer**; the segment measure of profit is **net income from continuing operations**. The significant expense categories the CODM reviews ($000s):

| | FY2025 | FY2024 | FY2023 |
|---|---|---|---|
| Revenue | 5,480,717 | 3,224,058 | 1,841,762 |
| Datacenter costs | 542,674 | 392,498 | 251,197 |
| Personnel related expenses | 207,278 | 259,711 | 230,762 |
| Interest expense & loss on settlement | 207,016 | 317,209 | 273,508 |
| Provision for income taxes | 519,715 | 22,419 | 43,776 |
| Amortization, depreciation, write-offs | 130,724 | 128,791 | 119,152 |
| Stock-based compensation | 207,958 | 357,431 | 342,551 |
| Other expenses | 232,157 | 156,475 | 122,990 |
| **Net income from continuing ops** | **3,433,195** | 1,589,524 | 457,826 |

> **Datacenter cost is the real COGS.** It grew 38% in 2025 to $542.7M — faster than total costs, and it is the one line that scales with volume. As a share of revenue it *fell* (13.6% → 12.2% → 9.9% across 2023→2025) **[derived]**.

**Long-lived assets by geography (12/31/25):** US $49.7M · Germany $62.7M · Netherlands $29.7M · other $5.8M · **total $147.9M**.

### 4.5 Balance sheet ($000s)
| | 6/30/2026 | 12/31/2025 | 12/31/2024 |
|---|---|---|---|
| Cash and cash equivalents | 3,053,306 | 2,487,096 | 697,030 |
| Accounts receivable, net | 2,171,017 | 1,819,366 | 1,283,335 |
| Total current assets | 5,392,316 | 4,430,792 | 2,312,190 |
| Goodwill | 1,518,587 | 1,539,986 | 1,457,685 |
| Intangible assets, net | 355,661 | 396,714 | 472,851 |
| Equity method investments (Tripledot) | 289,959 | 287,666 | — |
| **Total assets** | **8,269,131** | **7,259,610** | 5,869,259 |
| Accounts payable | 778,942 | 746,977 | 504,302 |
| Total current liabilities | 1,253,958 | 1,333,788 | 1,057,472 |
| Long-term debt | 3,515,072 | 3,512,987 | 3,508,983 |
| **Total liabilities** | **5,106,115** | **5,124,939** | 4,779,441 |
| Additional paid-in capital | 575,057 | 446,550 | 593,699 |
| Retained earnings | 2,661,753 | 1,735,097 | 599,204 |
| **Total stockholders' equity** | **3,163,016** | **2,134,671** | 1,089,818 |

**Net debt** at 12/31/25 ≈ **$1,026M** (senior notes carrying $3,513M − cash $2,487M) **[derived]**; at 6/30/26 ≈ **$462M** **[derived]**. Bloomberg's `NET_DEBT` field shows $1,075M for 2025 (it includes lease liabilities) — a definitional difference, not a conflict.

### 4.6 Tax
FY2025 effective rate **13.1%** (vs 21% statutory). Rate reconciliation, FY2025:

| Item | $000s | Rate |
|---|---|---|
| At U.S. federal statutory rate | 830,036 | 21.0% |
| State, net of federal benefit | 18,017 | 0.5% |
| Singapore statutory rate difference | (66,298) | (1.7)% |
| Singapore local taxes at different rate | (33,280) | (0.8)% |
| Withholding taxes | 65,733 | 1.7% |
| GILTI | 43,051 | 1.1% |
| **Foreign-derived intangible income (FDII)** | **(113,539)** | **(2.9)%** |
| Foreign tax credits | (84,591) | (2.1)% |
| R&D credit | (16,122) | (0.4)% |
| **Stock-based compensation** | **(132,975)** | **(3.4)%** |
| Other / valuation allowances / UTBs | ~5,283 | ~0.1% |
| **Total** | **519,715** | **13.1%** |

- **Pillar 2 global minimum tax reduced the negotiated Singapore benefit by $82.7M** — the structural tax advantage is being eroded.
- The **SBC windfall benefit (−3.4%)** is a function of the share price; it shrinks if the stock stops compounding.
- Pre-tax income mix shifted dramatically: **US $2,210.6M / Foreign $1,742.3M in 2025**, versus **US $88.1M / Foreign $1,523.8M in 2024**. Expect the effective rate to drift toward the US statutory rate as US-sourced income dominates. *(1H26 already runs at ~15.8% [derived].)*
- **OBBBA** (enacted July 4, 2025) impact on FY25 was **immaterial**.
- Long-term uncertain tax positions: **$64.2M**.

### 4.7 Debt & liquidity
- **$3.55B senior unsecured notes**, issued December 2024, all fixed-rate, no maturities before 2029:

| Series | Principal | Coupon | Maturity | Effective rate |
|---|---|---|---|---|
| 2029 Notes | $1,000M | 5.125% | Dec 1, 2029 | 5.34% |
| 2031 Notes | $1,000M | 5.375% | Dec 1, 2031 | 5.56% |
| 2034 Notes | $1,000M | 5.500% | Dec 1, 2034 | 5.66% |
| 2054 Notes | $550M | 5.950% | Dec 1, 2054 | 6.07% |

- **$1.0B unsecured revolver** (2024 Credit Agreement), matures Dec 5, 2029 (+2×1-yr extension options). Drawn $200M in Mar 2025 to fund buybacks, fully repaid by May 2025. **$1.0B available** at 12/31/25. Covenant: **max total net debt/EBITDA 3.50x** (step-up to 4.00x post-qualifying-acquisition); in compliance.
- Fair value of the notes at 12/31/25 ≈ $3.6B (Level 2).
- **Contractual obligations (12/31/25):** non-cancelable purchase obligations **$702.8M**, primarily a **third-party cloud computing agreement**, of which $398.5M is due within 12 months. Non-cancelable lease obligations **$173.9M** ($140.3M server/network, $33.7M office).

---

## 5. FY2026 Quarterly Progression (the live trend)

### 5.1 Income statement ($000s)
| | 1Q26 | 1Q25 | 2Q26 | 2Q25 | 1H26 | 1H25 |
|---|---|---|---|---|---|---|
| **Revenue** | **1,842,449** | 1,158,974 | **1,923,686** | 1,258,754 | **3,766,135** | 2,417,728 |
| Revenue YoY | **+59%** | | **+53%** | | **+56%** | |
| Cost of revenue | 203,632 | 151,680 | 225,801 | 155,076 | 429,433 | 306,756 |
| Sales & marketing | 60,751 | 59,383 | 63,394 | 46,917 | 124,145 | 106,300 |
| Research & development | 94,104 | 56,406 | 99,901 | 44,032 | 194,005 | 100,438 |
| General & administrative | 44,029 | 51,523 | 40,313 | 55,047 | 84,342 | 106,570 |
| Total costs and expenses | 402,516 | 318,992 | 429,409 | 301,072 | 831,925 | 620,064 |
| **Income from operations** | **1,439,933** | 839,982 | **1,494,277** | 957,682 | **2,934,210** | 1,797,664 |
| **Operating margin** | **78.2%** | 72.5% | **77.7%** | 76.1% | **77.9%** | 74.4% |
| Interest expense | (51,159) | (52,888) | (51,156) | (51,409) | (102,315) | (104,297) |
| Other income (expense), net | 42,634 ᵈ | 7,512 ᵈ | 62,405 | (22,269) | 105,039 | (14,757) |
| Income before income taxes | 1,431,408 | 794,606 | 1,505,526 | 884,004 | 2,936,934 | 1,678,610 |
| Provision for income taxes | 225,795 | 71,068 | 238,988 | 112,148 | 464,783 | 183,216 |
| **Net income (continuing = total)** | **1,205,613** | 723,538 | **1,266,538** | 771,856 | **2,472,151** | 1,495,394 |
| **Diluted EPS** | **$3.56** | $1.67 | **$3.76** | $2.39 | **$7.32** | $4.06 |
| **Adjusted EBITDA** | **1,556,919** | 937,772 | **1,613,823** | 1,018,347 | **3,170,742** | 1,956,119 |
| **Adj. EBITDA margin** | **84.5%** | 80.9% | **83.9%** | 80.9% | **84.2%** | 80.9% |
| Cash from operations | 1,291,393 | 831,712 | 869,040 ᵈ | 772,226 ᵈ | 2,160,433 | 1,603,938 |
| **Free Cash Flow** | **1,286,748** | 825,731 | **863,317** ᵈ | 768,063 ᵈ | **2,150,065** | 1,593,794 |

*ᵈ = **[derived]**. Other income for 1Q is backed out of the disclosed subtotals (operating income − interest expense + X = pre-tax income); 2Q cash flows are the six-month figure minus the three-month figure, because the 10-Q reports cash flows cumulatively.*

*1Q25/2Q25 net income above is **continuing ops**; reported total net income in those quarters was $576,419 (1Q25, after a −$147,119 disc-ops loss) and $819,531 (2Q25, after a +$47,675 disc-ops gain).*

### 5.2 The volume/price decomposition — the key trend line
| Period | Volume of installations | Net revenue per installation | Revenue growth |
|---|---|---|---|
| FY2024 | **+50%** | +22% | +75% |
| FY2025 | **+3%** | **+72%** | +70% |
| 1Q26 | **(18)%** | **+93%** | +59% |
| 2Q26 | **(2)%** | **+58%** | +53% |
| 1H26 | **(10)%** | **+75%** | +56% |

> Read this carefully before writing any thesis. Growth is entirely monetization-per-install. 2Q26's install decline moderated sharply (−18% → −2%) while NRPI decelerated (+93% → +58%) — consistent with the mix maturing, but it means **the growth engine depends on continued yield gains, and yield gains have a mathematical ceiling.**

### 5.3 Revenue by geography, 2026 ($000s)
| | 1Q26 | 1Q25 | 2Q26 | 2Q25 | 1H26 | 1H25 |
|---|---|---|---|---|---|---|
| United States | 907,219 | 615,703 | 989,626 | 658,321 | 1,896,845 | 1,274,024 |
| Rest of the world | 935,230 | 543,271 | 934,060 | 600,433 | 1,869,290 | 1,143,704 |
| **Total** | **1,842,449** | 1,158,974 | **1,923,686** | 1,258,754 | **3,766,135** | 2,417,728 |

RoW briefly overtook the US in 1Q26 (50.8%) before the US retook the lead in 2Q26 (51.4%) **[derived]** — the geographic mix is now essentially 50/50.

### 5.4 What changed in the expense base in 2026
- **R&D +127% YoY in 2Q26** (+$55.9M), of which **+$54.8M is stock-based-compensation payroll**. This is the **October 2025 PSU grant** ($410.5M grant-date fair value) beginning to amortize. Total SBC went from $34.6M (2Q25) to $85.8M (2Q26). Expect this elevated run-rate to persist — unrecognized SBC was **$489.0M over a 1.95-year weighted-average period** at 12/31/25, *before* accounting for the new grant's full effect.
- **G&A −27% YoY in 2Q26** — the FY25 bad-debt (−$9.5M) and divestiture professional-services (−$5.2M) costs annualizing out.
- **S&M +35% YoY in 2Q26** driven by **+$17.2M of actual advertising and marketing program spend** — the first time in years this line reflects real demand-generation rather than SBC noise.
- **Other income swung +$84.7M YoY in 2Q26**: a +$31.3M fair-value gain on non-marketable equity securities (vs −$20.4M loss), +$21.3M interest income on the growing cash pile, +$12.0M FX.
- **Cash taxes exploded**: $639.8M paid in 1H26 vs $100.6M in 1H25. Cash tax is now catching up to book tax.

### 5.5 Capital returns in 2026
| | 1Q26 | 1H26 |
|---|---|---|
| Shares repurchased | 2,170,041 | 3,275,252 |
| Aggregate cost (incl. commissions/taxes/fees) | $1.0B | $1.5B |
| Remaining authorization (period end) | $2.3B | **$1.8B** |

At the 1H26 pace (~$1.5B/half), the existing authorization is exhausted around **mid-2027** absent a new authorization. Average price paid in 1H26 ≈ **$460–470/share** **[derived]** — $458 using the equity note's rounded $1.5B, $468 using the cash-flow-statement outflow of $1,532,952k (which carries settlement-timing differences, incl. $18,457k accrued at quarter-end).

---

## 6. The Apps Divestiture (Note 3) — everything you need to restate history

- **Announced:** non-binding term sheet Feb 12, 2025 → Purchase Agreement **May 7, 2025** → amended Jun 30, 2025 → **closed June 30, 2025**.
- **Counterparty:** Tripledot Studios (with Eton Games Inc. and Tripledot Group Holdings Ltd).
- **Consideration: $715.6M total** = **$430.6M cash** ($400.0M contractual + $30.6M purchase-price adjustments) + **596.9M Tripledot ordinary shares valued at $285.0M** (≈**22% of outstanding**, ≈**20% fully diluted** at closing). No promissory note was ultimately issued.
- **Accounting:** derecognized net assets of $591.2M; **pre-tax gain $106.2M** after $18.3M of transaction costs. Tripledot stake held at **equity method**, recorded **one quarter in arrears**; carrying value $287.7M (12/31/25) → $290.0M (6/30/26).
- **Tax:** the transfer was treated as an asset sale for certain subsidiaries → **$125.6M deferred-tax-asset write-off** (in disc-ops tax). A **$204.3M capital loss** was generated and **fully offset by a valuation allowance** (i.e. no benefit taken).
- **Goodwill impairment:** an interim test at Mar 31, 2025 (triggered by the term sheet + Q1 negotiations) produced a **$188.9M non-cash goodwill impairment** on the Apps reporting unit, booked in discontinued operations.

**Discontinued operations P&L ($000s):**
| | FY2025 (6 months) | FY2024 | FY2023 |
|---|---|---|---|
| Revenue | 640,830 | 1,485,190 | 1,441,325 |
| Total costs and expenses | 775,432 | 1,522,687 | 1,565,529 |
| Goodwill impairment (within above) | 188,943 | — | — |
| Loss from operations | (134,602) | (37,497) | (124,204) |
| Gain on divestiture, net | 106,229 | — | — |
| Provision for (benefit from) taxes | 72,590 | (26,190) | (19,917) |
| **Loss from disc. ops, net of tax** | **(99,444)** | (9,748) | (101,115) |

**Assets/liabilities of disc. ops at 12/31/2024:** total assets $1,128.6M (incl. goodwill $345.7M, intangibles $423.8M); total liabilities $138.5M.

**Related-party consequence:** Tripledot became a related party at closing. AppLovin recognized **$19.0M of revenue** from Tripledot and subsidiaries' use of its advertising solutions from closing through 12/31/25, plus a Transition Services Agreement (≤6 months, amounts not material).

---

## 7. Capital Structure, Ownership & Governance

- **Triple-class stock:** Class A **1 vote**; Class B **20 votes**; Class C **no vote**. Class B is beneficially held entirely by **Adam Foroughi and Herald Chen** (with affiliated trusts) — 8 holders of record.
- A **Voting Agreement** provides that all Class B shares held by the parties are voted as **determined jointly by Foroughi and Chen** (each votes at their own discretion if they disagree).
- Class B converts to Class A automatically on certain transfers, or 61–180 days after either the Voting Agreement terminates **or Adam Foroughi ceases to be a director or executive officer**. Class C converts after all Class B has converted.
- **AppLovin is a "controlled company" under Nasdaq corporate governance rules** — a named risk factor and a real governance consideration for the Overview.
- Shares outstanding 12/31/25: **338,313k** (Class A 307,955k · Class B 30,358k · Class C nil). As of **Feb 13, 2026**: Class A 307,070k · Class B 30,208k.
- Only ~32 holders of record of Class A (most shares held in street name).
- **Authorized:** 1,850,000k common (Class A 1,500,000k / B 200,000k / C 150,000k) + 100,000k preferred (none issued).

### Stock-based compensation & the moonshot PSUs
| Grant | Size | Vesting condition | Status |
|---|---|---|---|
| **Mar 2023** | 6,902,000 PSUs **each** to Adam Foroughi (CEO) and Vasily Shikin (CTO) | 5 tranches, stock-price targets **$36 → $79** (30-day minimum close, 5-yr window) | **Fully vested by 12/31/2024** |
| Apr 2023 | 3,451,000 PSUs to non-executives | same targets | Fully vested by 12/31/2024 |
| Nov 2024 | 348,327 PSUs to non-executives | 3 tranches, **$184.35 → $294.96** | Fully vested by 12/31/2024 |
| **Oct 2025** | **920,526 PSUs to key non-executive engineering employees** | **Market-capitalization milestones: initial $300.0B, additional milestones up to $1.0 trillion**, 30-day measurement, **7-year performance period** | Outstanding; **grant-date fair value $410.5M** |

Oct 2025 Monte Carlo assumptions: stock price at grant **$620.62**, expected volatility **70.95%**, risk-free **3.85%**, discount for lack of marketability **20.34%**, dividend yield 0%. This valuation was the **Critical Audit Matter** in Deloitte's FY25 report.

Other equity data: RSUs granted in FY25 at a weighted-average grant-date fair value of **$360.48**; total FY25 RSU vest value $695.7M. Options: 1,256,114 outstanding at $6.10 WAEP, all vested, aggregate intrinsic value $838.7M. Unrecognized SBC **$489.0M / 1.95 years** at 12/31/25. Plan capacity at 12/31/25: 86.1M shares under the 2021 Plan, 20.9M under the ESPP, 1.5M under the 2021 Partner Plan — **substantial future dilution capacity**, with a 5%-of-shares annual evergreen on the 2021 Plan.

---

## 8. Legal — the one material matter

**Securities class action (consolidated as the "Brownback Action," N.D. Cal.).** Filed beginning **March 2025** against the Company, **Adam Foroughi, Matthew Stumpf, Herald Chen**, and (added in the Sept 12, 2025 Amended Complaint) **Basil Shikin**. Alleges §10(b)/§20(a) and Rule 10b-5 violations — that defendants **made materially false and misleading statements regarding the Company's advertising solutions and financial growth**. Putative class period **November 7, 2024 → March 27, 2025**. Motion to dismiss filed November 2025; **hearing scheduled March 2026**. Company: "these allegations lack merit and will vigorously contest."

**Shareholder derivative actions** (from late March 2025) allege §14(a) violations, breach of fiduciary duty, unjust enrichment, abuse of control, gross mismanagement, waste. **Consolidated and stayed** pending the motion-to-dismiss ruling in Brownback.

No loss estimate is possible: *"we cannot reasonably estimate the maximum potential exposure or range of possible loss."*

> This is the **single defining legal matter** for the timeline block under `OVERVIEW_CONVENTIONS.md` §4.7 (which permits at most one). It follows the short-seller reports and the March 2025 stock drawdown — context that should be sourced independently before being asserted, as the filings do not describe it.

**Other related-party items:** the $50.0M Feb 2024 investment in **Humans, Inc.** (Flip Shop) — where director **Eduardo Vivas** was COO and a board member — was **fully impaired in 2025** on deteriorating financial condition and going-concern uncertainty. Vivas resigned from both Humans positions in September 2025. **KKR Denali** (>10% holder) exited fully in 2024 and ceased to be a related party as of 12/31/2024.

---

## 9. Risk Factors (10-K Item 1A, summary as the company ranks them)

**Business / operational / industry:** results-of-operations volatility · security breaches and cyber incidents · **reliance on third-party platforms (Apple App Store, Google Play)** · reliance on key employees · maintaining culture · attracting/retaining clients and client spend · competition and technological change · technical limitations and scaling infrastructure · **concentration of revenue sources** · expansion into new business opportunities · macro and geopolitical conditions · international operations · expansion/diversification incl. strategic transactions · integration and managing growth · rapid growth · **no long-term agreements with clients** · brand and reputation · third-party performance.

**Legal & regulatory:** privacy/data protection/consumer protection/**AI**/advertising/tracking/targeting/protection of minors · unsettled US and foreign law · **development and use of AI in offerings** · anti-bribery, export controls, sanctions · **changes in tax law / greater-than-anticipated tax liabilities** · sales/VAT assertions · **ability to realize tax savings from the international structure** · liability for content served · legal/regulatory proceedings costs.

**Intellectual property:** protection and enforcement of proprietary rights · IP disputes · open-source compliance.

**Financial & accounting:** disclosure controls and ICFR · **goodwill impairment charge risk** · indebtedness and obligations · ability to service debt · availability of additional capital.

**Ownership & governance:** **multi-class structure and the Voting Agreement** · **"controlled company" status** · share-price volatility · buybacks may not deliver long-term value · dilution from equity plans/financings/acquisitions · Delaware-law and charter/bylaw anti-takeover provisions · exclusive forum provisions.

**Reading the top 5 for a thesis:** (1) third-party platform dependency — Apple/Google set the rules on IDFA/ATT-style signal and can change them unilaterally; (2) AI regulation, given Axon *is* the product; (3) the international tax structure, already eroding under Pillar 2; (4) key-person risk concentrated in Foroughi; (5) growth concentration in a single product (AppLovin Ads is "the vast majority of revenue") sold to advertisers with **no long-term contracts** and terms **cancelable at any time**.

---

## 10. Bloomberg Consensus Model — projections to 2028 **[BBG EST]**

Source: `APP_BBG_MODL.xlsx`, periodicity annual, currency USD, **estimate source BST (Bloomberg consensus)**, actuals from Bloomberg. Figures in $M.

### 10.1 Headline consensus
| | 2025A | 2026E | 2027E | 2028E |
|---|---|---|---|---|
| **Revenue** | 5,480.7 | **8,142.9** | **10,521.5** | **13,111.2** |
| Revenue growth | +70% | **+48.6%** | **+29.2%** | **+24.6%** |
| **Adjusted EBITDA** | 4,512.5 | **6,820.8** | **8,783.5** | **10,963.9** |
| Adj. EBITDA margin **[derived]** | 82.3% | **83.8%** | **83.5%** | **83.6%** |
| Operating income | 4,151.9 | 6,344.7 | 8,306.5 | 10,209.8 |
| Pre-tax income (ex-SBC basis) | 3,952.9 | 6,287.0 | 8,150.8 | 10,446.3 |
| Net income (GAAP) | 3,333.8 | 5,377.1 | 6,997.3 | 8,801.0 |
| Adjusted net income | 3,333.8 | 5,325.9 | 6,923.6 | 8,782.7 |
| **Adjusted diluted EPS** | **$9.75** | **$15.79** | **$20.70** | **$26.42** |
| Adj. EPS growth **[derived]** | | **+62.0%** | **+31.1%** | **+27.7%** |
| GAAP diluted EPS | $9.75 | $15.77 | $20.54 | $26.52 |
| **Free Cash Flow** | 3,971.1¹ | **5,290.7** | **7,053.6** | **8,616.5** |
| Cash from operations | 3,971.1 | 5,289.4 | 7,106.5 | 8,696.7 |
| Cash & equivalents (EOP) | 2,487.1 | 5,260.0 | 10,019.1 | 15,046.5 |
| **Net debt (cash)** | 1,075.1 | **(1,430.5)** | **(5,644.9)** | **(10,181.5)** |
| Share repurchases | 2,191.9 | 2,620.1 | 2,860.9 | 3,452.1 |
| SBC | 208.0 | 323.0 | 341.3 | 435.1 |
| Cost of revenue | 665.1 | 938.6 | 1,206.7 | 1,704.0 |
| Total operating expenses | 663.7 | 840.4 | 1,036.8 | 1,676.1 |
| Revenue — United States | 2,827.2 | 4,166.2 | 5,456.0 | 6,989.6 |
| Revenue — Rest of world | 2,653.5 | 3,919.3 | 5,206.7 | 6,748.4 |

¹ Bloomberg's `CF_FREE_CASH_FLOW` for 2025 equals CFO ($3,971.1M) because it does not deduct finance-lease principal; **the company's own FY25 FCF is $3,952.0M**. Definitional difference, not a conflict.

### 10.2 Cross-check against the filings — the model's actuals tie exactly
Every 2025 actual in the Bloomberg model reconciles to the 10-K: revenue 5,480.717 ✓ · Adjusted EBITDA 4,512.452 ✓ · US revenue 2,827.248 ✓ · RoW 2,653.469 ✓ · cash 2,487.096 ✓ · total assets 7,259.610 ✓ · long-term debt 3,512.987 ✓ · total equity 2,134.671 ✓ · CFO 3,971.094 ✓ · SBC 207.958 ✓. **The model's historical column mapping is verified** — treat its actuals as reliable.

### 10.3 Implied 2H26 vs 1H26 actuals **[derived]**
Consensus FY26 revenue of $8,142.9M against 1H26 actual of $3,766.1M implies **2H26 revenue ≈ $4,376.8M** — +16.2% half-over-half and **+42.9% YoY** (2H25 was $3,063.0M). Implied **2H26 Adjusted EBITDA ≈ $3,650.1M (83.4% margin)** against 1H26's $3,170.7M. Consensus therefore embeds a *deceleration* from 1H26's +56% to ~+43% in 2H26 — a reasonable bar, not an aggressive one.

### 10.4 ⚠️ Known bad fields in the Bloomberg model — do not use
The forward columns contain several mechanically mis-mapped or stale series. Verified problems:

| Row / field | Problem |
|---|---|
| **Apps Revenue** (`SEG0000801071`) — 2026E 426.1 / 2027E 982.6 / 2028E 1,076.2 | **The Apps business was sold on 6/30/2025.** These are stale segment estimates for a business AppLovin no longer owns. Ignore entirely. |
| **Business Revenue** (`SEG0000566362`) — 2026E 7,275.2 / 2027E 8,805.1 / 2028E 9,114.3 | Doesn't reconcile to total revenue or to any disclosed segment. Artifact. |
| **In-App Purchase / In-App Advertising Revenue** forward columns | Same problem — divested product lines. |
| **Non-Controlling Interest** — 2026E 10,760.5 / 2027E 15,466.6 / 2028E 21,858.7 | Nonsense: AppLovin's actual NCI is **$0**. Field is mis-mapped (values track total equity/assets). |
| **Basic/Diluted weighted-average shares** — 2026E 397.7 / 2027E 399.3 / 2028E 337.7 diluted | Implausible: 2025 actual diluted was **342.0M** and the company is *retiring* 3.3M shares per half. A jump to ~398M then back to ~338M is a contributor-averaging artifact. **Derive share counts yourself** from the buyback pace. |
| **Average Monthly Active Payers** | A metric of the divested Apps business. Irrelevant. |
| **Adjusted EBITDA margin** field (`CB_IS_ADJ_EBITDA_MARGIN`) 2026E = 84.31% | Doesn't equal Adj. EBITDA ÷ revenue (83.76%). Compute the margin yourself. |
| **Advertising Revenue** (`SEG0000580152`) 2026E 8,147.3 | ≈ total revenue 8,142.9 — harmless, but it is *the same thing as total revenue* now, not a segment. Don't present it as a breakdown. |

**Bottom line:** use the Bloomberg model for **revenue, Adjusted EBITDA, EPS, FCF, cash/net-debt and buyback** forward lines. **Do not use** its segment, share-count, or NCI forward lines.

---

## 11. Data Notes & Open Items for the Overview build

- **Single segment → the "How it makes money" block must use Geography only.** `OVERVIEW_CONVENTIONS.md` §4.4's ≥2-slice rule forbids a one-bar Segments chart. State "single reportable segment" in one line and render the US / Rest-of-world split (which reconciles exactly to total revenue in every period — the mandatory cross-check passes).
- **No product-level revenue disclosure exists.** AppLovin never sizes AppLovin Ads vs MAX vs Adjust vs Wurl. The 10-K says only that AppLovin Ads is "the vast majority of revenue." **Any percentage split by product would be fabricated** — do not invent one (Golden Rule #4, no fake precision).
- **No forward guidance in the filings.** Anything forward-looking in this pack is Bloomberg consensus, labeled as such. If the Overview needs company guidance, it must come from the earnings call/press release — **which are not in the `APP/` folder** and would need to be sourced separately.
- **Product naming is mid-transition.** "Axon Ads Manager" (10-K, 1Q26 10-Q) became **"AppLovin Ads"** in the 2Q26 10-Q; "Axon AI recommendation *engine*" became "recommendation *system*." Use the current name (AppLovin Ads) with the former name noted once.
- **Key Facts cell sourcing:** Listing/HQ/incorporation/founded/IPO/CEO/employees/dividend are all confirmed above from the 10-K. **Market cap must come live from `api.liveQuote('APP')`** per §3 of the conventions — the $102.7B non-affiliate value on the 10-K cover is a **June 30, 2025** figure and is *not* market cap; do not use it as one.
- **Filer status was read off the 10-K cover (Form 10-K, large accelerated filer, Commission File 001-40325)** — the conventions still require an EDGAR verification pass before shipping.
- **Peers for the competitor scatter:** the 10-K names **Meta, Google (Alphabet), Amazon, Unity Software**. Unity is the only true pure-play comparable; Meta/Alphabet/Amazon are conglomerates whose multiples reflect other businesses. Consider adding The Trade Desk / Magnite as listed ad-tech peers, but note they are **not** named by the company — flag any peer not in the 10-K as analyst-selected.
- **Timeline genesis:** founded 2011 in Delaware by app developers; **traditional IPO April 15, 2021 at $80.00** (not a SPAC/direct listing). Timeline-worthy events available from these documents: 2011 founding · 2021 IPO · Dec 2024 $3.55B senior notes refinancing (replacing the 2018 credit agreement, $4.2B repaid) · **Jun 30 2025 Apps divestiture → single-segment ad-tech company** (a genuine business-model inflection) · Mar 2025 securities litigation · Oct 2025 $300B–$1T market-cap PSU grant. **No first-ever dividend (never paid one); no trillion-dollar milestone reached; no bankruptcy; no name/ticker change.** KKR's ownership and exit (2018 investment → full exit 2024) is worth researching for the genesis section but is only partially documented in these filings.
- **Not in these documents (would need separate sourcing):** earnings-call transcripts and prepared remarks · investor presentations · the March 2025 short-seller reports and the market reaction · the Tripledot stake's subsequent marks · any e-commerce vertical sizing · monthly/quarterly active-advertiser counts.

---

*Prepared for the APP company profile build on branch `feat/applovin`. Source PDFs live in `APP/` outside the repo (they are gitignored by convention, as with DIS/SPOT).*
