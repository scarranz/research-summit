# Veeva Systems (NYSE: VEEV): research notes

As of 2026-11-18. Fiscal year ends Jan 31, so FY2026 = Feb 2025 to Jan 2026. The latest reported quarter is **Q2 FY2027** (ended Jul 31 2026, reported Aug 26 2026). **Q3 FY2027 (ended Oct 31 2026) has not been reported yet.** At its Nov 5 2026 Investor Day, Veeva only said it "expect[s] to meet or exceed Q3'27 guidance" (8-K, Ex. 99.1, filed 2026-11-06).
Numbers are in `data.json` (USD millions). Abbreviations used below: "10-K FY26" = annual report for FY2026, "Q2 FY27 ER" = that quarter's earnings release (8-K Ex. 99.1). Accession numbers are in `data.json → sources`.

---

## (a) What Veeva sells, to whom, and how it gets paid

- **What it is.** Veeva sells cloud software built only for life sciences: pharma, biotech and medtech companies, plus the CROs and contract sales organizations that serve them. It also sells data and business consulting. The 10-K FY26 Item 1 describes it as "the leading provider of industry cloud solutions for the global life sciences industry."
- **Four product clouds** (10-K FY26 Item 1):
  - **Development Cloud** covers clinical trials (eTMF, CTMS, EDC, CDB, RTSM, Site Connect), drug safety (Veeva Safety) and regulatory (RIM). Everything runs on Veeva's own **Vault** platform.
  - **Quality Cloud** covers QMS, QualityDocs, Training and LIMS (lab software).
  - **Commercial Cloud** covers CRM for pharma sales reps. The legacy *Veeva CRM* product runs on Salesforce; the next-generation *Vault CRM* runs on Vault. It also includes PromoMats (marketing content review), Medical, and Crossix (marketing analytics).
  - **Data Cloud** includes OpenData (reference data on doctors and institutions), Link (expert and "deep" data), Compass (de-identified US patient and prescriber data) and HCP Access.
  - **AI layer:** Veeva AI agents, the Vault AI platform, and Veeva Falcon (described as "agentic labor" for clinical, regulatory and safety work). Per the Q2 FY27 ER, Falcon has 5 early adopters and the first go-lives are planned for this year.
- **Reporting split.** Revenue is reported in two product areas:
  - **Commercial Solutions** = Commercial Cloud + Data Cloud.
  - **R&D and Quality Solutions** = Development Cloud + Quality Cloud.
- **How it makes money.**
  - **Subscriptions are about 84% of revenue** (FY26: $2,684M of $3,195M).
  - **Professional services are the rest** (implementation, managed services, business consulting). They run at low margins: GAAP services gross margin was about 18% in FY26, versus about 86.5% for subscriptions.
  - **Contract terms.** Subscription orders are typically 1-year terms, billed annually or quarterly in advance. That is why deferred revenue peaks every Jan 31 and why Q1 operating cash flow is the strongest of the year (10-K FY26 MD&A).
  - **Pricing (CRM).** Core CRM is priced per user. Add-on users and apps are made coterminous with the core CRM order (10-K FY20).
  - **Pricing (Vault).** Many Vault orders are multi-year, are not based on user count, and have fees that escalate over the term (10-K FY20).
  - **Price escalator.** Some contracts include an annual inflation uplift capped at the lower of 4% or US CPI (10-K FY26 risk factors).
- **Customer concentration.**
  - **Top 10 customers were 28% of revenue** in each of FY24, FY25 and FY26. That is down from 56% in FY14, 50% in FY16 and 36% in FY20 (10-K FY16, FY20, FY26).
  - Customers at year end: **1,552 total** (FY26), of which **767 are Commercial and 1,196 are R&D & Quality**. The two groups overlap.
  - Named large customers include Bayer, Boehringer Ingelheim, Lilly, Gilead, Merck and Novartis (10-K FY26).
  - Top-20 pharma penetration: all top 20 biopharmas use Veeva eTMF, 19 use QualityDocs and 18 use Submissions (Q2 FY26 ER).
- **Public Benefit Corporation.** Veeva became a Delaware PBC on **Feb 1 2021** after a stockholder vote (10-K FY21). Its directors must balance stockholders' interests against those of customers, employees and the community.
- **Share structure and capital return.**
  - The dual-class structure ended on **Oct 15 2023**, when all Class B shares automatically converted into Class A (10-K FY24).
  - The first buyback, a **$2B program**, was authorized in Jan 2026. Veeva bought back $180M in FY26 and $467M in 6M FY27 (10-K FY26; 10-Q Q2 FY27).
  - The company has no debt, and cash plus short-term investments was **$7.2B** at Jul 31 2026.

## (b) How the business evolved (FY2016 to FY2026)

1. **A CRM business that bolted on Vault (FY16 to FY19).**
   - In FY16, about 79% of subscription revenue came from CRM (10-K FY16). Revenue was $409M.
   - Vault reached a $100M revenue run-rate at the end of FY16 (Q4 FY16 ER).
   - Under the old product split, Vault subscription revenue went from $133M (FY17) to $580M (FY21), while Commercial Cloud went from $308M to $599M (10-K FY19 and FY21).
2. **The original CRM was built on Salesforce.**
   - Veeva CRM was built on the Salesforce platform under a reseller agreement (VAR). That agreement required **$500M of minimum orders through Sep 1 2025** (10-K FY19, Note 13).
   - It also restricted Veeva CRM to selling only to drug makers (10-K FY23).
3. **The IQVIA dispute (2017 to 2025).**
   - IQVIA sued in Jan 2017, alleging Veeva used IQVIA data without authorization to build its data products (trade-secret claims).
   - Veeva countersued in Mar 2017 on antitrust grounds, alleging IQVIA blocked customers from using IQVIA data with Veeva OpenData and Network. Further suits followed in 2019 over Veeva Nitro (10-K FY24).
   - A related Veeva suit against Medidata and Sparta, over non-compete agreements, was settled in 2023 and 2024 (10-K FY24).
   - **Settlement on Aug 13 2025:** no damages were paid either way, all claims were dismissed, and the two companies announced a long-term global partnership (10-K FY26 Note; Q2 FY26 ER).
   - Settlement-related charges of $30.6M in FY26 are excluded from non-GAAP figures.
4. **Acquisitions:** Zinc Ahead (Sep 2015), Crossix (FY20, about $448M of cash), Ostro (Mar 2026, about $90M; AI chat for brands) and Copli (Q2 FY27).
5. **Product areas re-cut (Q3 FY22).**
   - "Commercial Cloud / Vault" became "Commercial Solutions / R&D Solutions." PromoMats and MedComms moved into Commercial (10-K FY22, Note 16).
   - R&D became the growth engine. On the new definition, R&D subscription revenue grew from $303M (FY20) to $1,427M (FY26). It **passed Commercial subscription revenue in Q1 FY25** ($272.6M vs $261.3M) and was 53% of subscription revenue in FY26.
6. **Moving CRM off Salesforce (announced late 2022).**
   - The 10-K FY23 (filed Mar 30 2023) says Veeva "recently announced plans to migrate [CRM] to our Veeva Vault platform" and "do[es] not intend to renew" the Salesforce agreement.
   - The **exact announcement date is not stated in the filings reviewed.** It is commonly reported as Dec 2022. The Q3 FY23 10-Q could not be downloaded (SEC 504 error) to confirm it.
   - **Wind-down terms:** the Salesforce agreement expired on **Sep 1 2025**. From Sep 1 2025 to Sep 1 2030, Veeva cannot sell the Salesforce-based CRM to new customers, and existing customers are capped at 150% of their Sep 2025 seats. Veeva CRM is supported until **Dec 31 2029** (10-K FY26).
   - Hosting already reflects the split: Vault runs on AWS, while legacy Veeva CRM runs on Salesforce's infrastructure (10-K FY26).
   - Salesforce is now the main CRM competitor. IQVIA has licensed its own CRM software to Salesforce (10-K FY26).
7. **The termination-for-convenience (TFC) contracting change (Feb 1 2023).**
   - Veeva standardized termination-for-convenience rights into its multi-year contracts. This shifted when revenue is recognized. Veeva estimated the hit to FY24 revenue and non-GAAP operating income at **about $90M** (Nov 9 2023 Investor Day 8-K).
   - As a result, FY24 GAAP operating income fell to $429M, from $459M in FY23.
   - Veeva also stopped disclosing a meaningful RPO (contracted revenue not yet recognized) from FY24 onward (10-K FY24).
8. **The data business** grew through OpenData and Link, then Compass (launched in 2023-24 as an alternative to IQVIA data) and Crossix. Q1 FY25 ER: Compass Patient won a record 21 brands and Link passed 100 customers. Q4 FY26 ER: Crossix had a "breakout year."
9. **Long-term goals.**
   - $1B revenue by FY2020: achieved (FY20 revenue was $1,104M).
   - $3B revenue run rate in 2025: set in Oct 2019 (per a secondary source), and **achieved in Q1 FY26** (Q1 FY26 ER).
   - **$6B revenue run rate by 2030**, i.e. doubling: set at the 2024 Investor Day (the 8-K of Nov 7 2024 refers to "long-term financial goals for 2030") and reaffirmed in the Q3 and Q4 FY26 ERs.
   - Third-party summaries of the Investor Day decks add a **35%+ non-GAAP operating margin** and about **87% subscription mix by 2030**. These were *not verified* against primary text, because the deck PDFs could not be text-extracted.
   - Ten-year scale: revenue rose **7.8x** from FY16 to FY26 ($409M to $3,195M). GAAP operating margin went from 19% to 29%. Non-GAAP operating margin went from 27% to 45%. Free cash flow was $1.39B in FY26.

## (c) Where it stands now

- **FY26 (ended Jan 2026).**
  - Revenue was **$3,195M, up 16%**. Subscription revenue was $2,684M, up 17.5%.
  - GAAP operating income was $916M (28.7% margin). Non-GAAP operating income was **$1,434M (44.9% margin)**.
  - GAAP EPS was $5.44 and non-GAAP EPS was $8.10. Operating cash flow was $1,415M.
- **Q2 FY27 (ended Jul 2026).**
  - Revenue was **$928.0M, up 18%**, against guidance of $902–905M. Subscription revenue was $766.8M, up 16%.
  - Non-GAAP operating income was $415.9M (44.8% margin), against guidance of $392–395M. Non-GAAP EPS was $2.35, against guidance of $2.21–2.22. GAAP EPS was $1.66.
  - By product area: R&D & Quality subscription revenue grew 19%; Commercial subscription revenue grew 13%.
  - Services revenue grew 24%. The release gives no driver breakdown; Vault CRM migrations are a plausible contributor, but that is our inference.
- **FY27 guidance** has been raised twice:
  - Revenue went from $3,585–3,600M (Mar 4) to $3,635–3,645M (Jun 3) to **$3,682–3,687M** (Aug 26), about +15% year over year.
  - Non-GAAP operating income went from about $1,590M to about $1,610M to **about $1,640M**.
  - Non-GAAP EPS went from about $8.85 to about $9.05 to **about $9.21**.
  - Q3 FY27 guidance is revenue of $932–935M (subscription about $782M), non-GAAP operating income of $417–420M, and non-GAAP EPS of $2.33–2.34.
- **Vault CRM migration** (company-reported KPIs from the earnings releases):
  - **Customers live on Vault CRM:** more than 30 (Q3 FY25), more than 50 (Q4 FY25, with 8 migrated from Veeva CRM), more than 100 (Q2 FY26), 115 (Q3 FY26), more than 125 (Q4 FY26), more than 150 (Q1 FY27), and **more than 180 (Q2 FY27), including 5 top-20 biopharmas live**.
  - **Top-20 pharma commitments to Vault CRM:** 2 (Q3 FY24), 4 (Nov 2024), 7 (Aug 2025), 10 (Q4 FY26, when Veeva said it expects "about 14 of the top 20"), and **12 (Aug 2026)**.
  - **Losses to Salesforce:** Veeva gives no numbers. The 10-K FY26 and the 10-Q for Q2 FY27 say that "Salesforce ... has announced that certain large Veeva CRM customers have committed to purchasing its CRM solutions and a number of our customers have informed us of their intent to move to Salesforce."
  - Implication: the top-20 accounts that do not commit (roughly 6 of 20 on the company's own "about 14" expectation) are the at-risk pool.

## (d) Growth levers management cites

- **Development Cloud is the "largest go-forward opportunity"** (Q3 FY26 ER). Clinical has 11 or more products, mostly early in adoption. Safety recently passed 100 customers and has 6 top-20 wins. RTSM and EDC are also cited.
- **Quality Cloud:** more than 600 customers on at least one Quality app (Q3 FY25). LIMS is targeting its first top-20 go-live in 2026.
- **Vault CRM upgrades plus "agentic CRM":** the Agentic Call Report, Campaign Manager, Service Center and Patient CRM. These go together with migration services revenue.
- **Data Cloud:** Compass, Link, CRM Pulse and Crossix, built as connected software plus data.
- **AI:** Veeva AI agents in every application, Vault AI (all Vault apps from Aug 2026), Falcon (agentic labor), and Ostro's conversational AI for brands. Management frames this as a shift from "an industry-specific application company to an industry-specific application and AI agent company" (Q1 FY27 ER).
- **Business consulting** and Vault Basics (packaged apps for emerging biotechs).
- **Capital return:** the $2B buyback.

## (e) Company-specific risks (10-K FY26 / 10-Q Q2 FY27), not boilerplate

1. **CRM competition and migration risk.**
   - Salesforce now sells its own life-sciences CRM, with IQVIA's CRM software licensed to it. Some large Veeva CRM customers have committed to Salesforce, and others have said they intend to move.
   - Every Veeva CRM customer has to re-platform by end-2029/2030. That is a natural decision point for customers to switch vendors.
   - The migration could also cause outages or performance problems on Vault as user volume ramps.
2. **Dependence on Salesforce during the wind-down.** Salesforce can end the wind-down early in some cases, including a material breach by Veeva or Veeva being acquired by specified companies (after 12 months' notice).
3. **Concentration.**
   - The top 10 customers are 28% of revenue.
   - Consolidation in the pharma industry has already led to lost user subscriptions or non-renewals in the past.
   - Nearly all revenue comes from life sciences, so the business is exposed to drug-pricing regulation, government funding and FDA staffing, and limits on direct-to-consumer advertising (which would hit Crossix).
4. **Shorter contracts after the TFC change.** Most multi-year contracts can now be cancelled within a year. This weakens revenue visibility, and RPO is no longer meaningful.
5. **AI disruption.** Competitors' AI, or customers building their own software, could displace Veeva's applications. Veeva's own AI agents use third-party models (Anthropic and Amazon, via Amazon Bedrock).
6. **Data and privacy.** Crossix and Compass process US patient health data, so they are exposed to HIPAA, GDPR and state privacy laws. Veeva also depends on third-party data, such as IQVIA's, being usable alongside its applications. The partnership with IQVIA reduces that risk.
7. **Slowing growth.** The 10-K warns that growth rates "may decline." Revenue growth has slowed from 25–35% a year (FY17–FY22) to about 15–18% now.
8. **Governance trade-off from the PBC status:** directors may prioritize stakeholders over stockholder returns.

## (f) Data quirks (read before charting)

- **ASC 606 restatement.** FY17 and FY18 are shown restated under the ASC 606 accounting standard: revenue was 550.5 (originally 544.0) and 690.6 (originally 685.6). FY16 is ASC 605 and is not restated. The FY17 non-GAAP figures exist only on the ASC 605 basis. FY18 non-GAAP is shown restated (219.2 / $0.96; originally 212.0 / $0.93).
- **Two product-area definitions; do not splice them.**
  - "Commercial Cloud vs Vault" covers FY17–FY21.
  - "Commercial Solutions vs R&D Solutions" covers FY20–FY26, with FY20–21 recast by the company. Under this definition PromoMats and MedComms moved from Vault into Commercial.
  - FY23 Commercial included Veeva Claims. FY23–25 R&D included RegulatoryOne/QualityOne (consumer-products apps). From FY26 the area is named "R&D and Quality Solutions," and neither Claims nor RegulatoryOne/QualityOne is listed any more. Veeva says nothing about whether prior periods were adjusted for these smaller changes.
- **FY16 has no product-area table**; only CRM-share percentages are available.
- **Capex definition changed.** It is PP&E + capitalized software through FY20, then a single "Long-term assets" investing line from FY21 (FY20 restated to 4.3). FCF in the pack is derived by me as CFO − capex.
- **Non-GAAP definition drift.** Non-GAAP excludes stock-based comp and amortization of intangibles throughout. Earlier years also excluded Zinc Ahead deferred compensation. FY25–FY26 also exclude litigation settlement charges. The FY19 non-GAAP operating income was later shown as 306.6, versus 305.9 originally reported.
- **RPO** is disclosed only for FY19–FY23 (737.7 → 1,663). It is null from FY24 because of TFC.
- **Customer counts** are reported only at fiscal year end. The product-area customer counts overlap, so they sum to more than the total. FY20 also has old-definition counts: 390 Commercial Cloud and 715 Vault (Q4 FY20 ER).
- **Seasonality.** Deferred revenue peaks on Jan 31 and bottoms on Oct 31. Q1 CFO is very large (for example, $1,127M in Q1 FY27). Compare quarters year over year, not sequentially.
- **One-off quarters.** Q1 FY24 GAAP operating income was only $61.5M because of the TFC change. Q2 FY26 GAAP operating income was $195.9M, with G&A elevated by IQVIA settlement-related charges.
- **Not available:** FY27 subscription revenue guidance is only in the IR presentation PDF, which could not be text-extracted. Calculated billings are not computed. Primary-source text for the 2030 margin and mix targets was not verified.
