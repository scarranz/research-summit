-- ============================================================
-- Research Summit -- Investment tab (sectors + holdings)
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ─── 1. investment_sectors ─────────────────────────────────────

create table investment_sectors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table investment_sectors enable row level security;

create policy "authenticated_read_investment_sectors" on investment_sectors
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investment_sectors" on investment_sectors
  for insert with check (auth.uid() is not null);


-- ─── 2. investment_companies ────────────────────────────────────

create table investment_companies (
  id           uuid primary key default gen_random_uuid(),
  sector_id    uuid not null references investment_sectors(id) on delete restrict,
  ticker       text not null unique,
  name         text not null,
  logo_domain  text,
  mono         text,
  overview     text,
  opportunity  text,
  sort_order   int not null default 0,
  status       text not null default 'active',
  created_by   uuid references auth.users(id),
  updated_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger investment_companies_updated_at
  before update on investment_companies
  for each row
  execute function set_updated_at();

alter table investment_companies enable row level security;

create policy "authenticated_read_investment_companies" on investment_companies
  for select using (auth.uid() is not null);

create policy "authenticated_insert_investment_companies" on investment_companies
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_investment_companies" on investment_companies
  for update using (auth.uid() is not null);


-- ─── 3. Seed: sectors ────────────────────────────────────────────

insert into investment_sectors (name, sort_order) values
  ('Big Tech', 1),
  ('Semiconductors', 2),
  ('Delivery/Ride Hailing', 3),
  ('Consumer Defensive', 4),
  ('Streaming', 5),
  ('Banking & Payments', 6)
on conflict (name) do nothing;


-- ─── 4. Seed: holdings (Overview + Opportunity write-ups) ───────
-- Sourced from FY2025 10-K/20-F filings, investor relations releases, and
-- SEC EDGAR as of July 2026. Original analysis -- Summit's own investment case.

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'META', 'Meta Platforms, Inc.', 'meta.com', 'M', 'Meta Platforms is the world''s largest social media and messaging company, built around a family of consumer apps -- Facebook, Instagram, Messenger, and WhatsApp -- used by more than 3.5 billion people daily. The company reports results across two segments: Family of Apps (FoA), which generated $130.5B of revenue in FY2025, almost entirely from advertising sold against News Feed, Reels, and Stories inventory; and Reality Labs (RL), the augmented/virtual reality hardware and software unit behind the Quest headset line and Ray-Ban Meta smart glasses, which remains an early-stage bet on the next computing platform and lost roughly $19B in FY2025 on about $3.4B of revenue.

Meta monetizes attention: advertisers bid for placement across its apps, and Meta''s own AI ranking and generative models (Advantage+, Llama) determine which ad each user sees and how compelling it is. FoA''s operating margin, near 47%, is what funds Reality Labs'' longer-horizon build-out.', 'Meta has repositioned itself as one of the highest-return deployers of AI capital in the industry, using machine learning to lift both ad conversion and time spent at once -- a combination that used to trade off against each other. Its scale gives every model improvement a uniquely large dataset to train on and a uniquely large audience to monetize immediately, a flywheel few advertisers can substitute away from.

We think the market still underprices how directly Meta''s AI investment translates into Family of Apps operating leverage, and treats Reality Labs'' losses as pure cost rather than as an option on wearables and the next interface layer. At a proven core operating margin near 47% and mid-teens-plus revenue growth, we see Meta as a self-funding compounder trading below what its combination of growth, margin, and platform optionality would command as a standalone advertising business.', 1, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'AMZN', 'Amazon.com, Inc.', 'amazon.com', 'AZ', 'Amazon runs two category-defining franchises under one roof: e-commerce retail (Amazon.com, third-party Marketplace, and physical/Whole Foods stores) and Amazon Web Services (AWS), the largest public cloud infrastructure provider. In FY2025, North America segment sales reached $426.3B (operating income $29.6B), International sales were $161.9B, and AWS -- the profit engine -- generated $128.7B of revenue (+20%) and $45.6B of operating income, at a structurally higher incremental margin than retail.

Retail earns through direct product sales, third-party seller fees, Prime subscriptions, and a fast-growing advertising business layered on top of shopping traffic; AWS earns on compute, storage, and database consumption billed by usage, with switching costs anchored by workloads already built on its APIs. Amazon''s owned logistics network, fulfilling hundreds of billions of dollars of gross merchandise value a year, is retail''s structural advantage over pure marketplaces.', 'AWS is re-accelerating as enterprises move AI training and inference workloads onto hyperscale infrastructure, and Amazon has responded with the largest capital expenditure program in its history to add capacity -- a bet we think gets absorbed quickly given AWS has historically run capacity-constrained rather than over-built.

Retail still has margin runway: at a mid-single-digit operating margin today, we see room for structural expansion as advertising (high incremental margin) and logistics automation scale, and as same-day delivery penetration deepens Prime engagement. The combination -- a cloud franchise compounding at AWS''s growth-and-margin profile, layered on a retail business with underappreciated margin torque -- is why we think Amazon can compound revenue and earnings per share at a rate the current multiple does not fully capture.', 2, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'GOOGL', 'Alphabet Inc.', 'google.com', 'G', 'Alphabet is the parent of Google, the dominant global search engine, YouTube (the largest video platform), Google Cloud, and Waymo (autonomous driving) among other early-stage "Other Bets." The core business runs on three engines: Google Search & Other ($224.5B in FY2025), the advertising business that captures intent at the moment someone searches; YouTube (over $60B of combined advertising and subscription revenue), which monetizes both ad-supported and subscription video and music consumption; and Google Cloud ($58.7B, +36%), which sells compute, storage, and AI infrastructure and software to enterprises, competing directly with AWS and Microsoft Azure.

Alphabet''s proprietary Tensor Processing Units (TPUs) and its DeepMind research lab (the Gemini model family) underpin both its own AI products -- like AI Overviews in Search -- and the infrastructure it rents out through Cloud.', 'Alphabet is one of a handful of companies with the data, distribution, and computing infrastructure to both build frontier AI models and monetize them at internet scale, and its FY2025 results show that scale converting into growth rather than disruption risk: Search revenue accelerated even as AI Overviews rolled out to billions of users, and Cloud''s operating margin has climbed from roughly breakeven to the mid-20s as it approaches AWS-like scale.

We see three separate compounding engines -- Search''s continued query growth, YouTube''s advertising and subscription mix shift, and Cloud''s infrastructure land-grab -- inside one holding, with the vertically integrated TPU stack acting as a structural cost advantage over GPU-dependent AI competitors. At a valuation that still discounts Alphabet as an advertising business first, we think the market underappreciates the optionality embedded in Cloud and Waymo.', 3, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'NVDA', 'NVIDIA Corporation', 'nvidia.com', 'NV', 'Nvidia designs the graphics and AI accelerator chips that have become the primary computing substrate for training and running large-scale AI models. Data Center is now essentially the entire business -- $193.7B of fiscal 2026 revenue, roughly 90% of Nvidia''s $215.9B total -- sold to hyperscalers, sovereign AI programs, and enterprises, bundling GPUs (Blackwell, and the newly-shipping Rubin architecture) with its CUDA software layer and high-speed networking (InfiniBand/NVLink, via the Mellanox acquisition).

Gaming ($16.0B) remains a meaningful, profitable legacy business selling GeForce GPUs to PC gamers, with smaller Professional Visualization and Automotive segments rounding out the mix. Nvidia''s moat is as much software as silicon: CUDA has been the default programming layer for GPU computing for close to two decades, which locks in developer workflows well beyond any single chip generation.', 'Nvidia sits at the choke point of the AI buildout -- every major model developer and cloud provider needs its chips to train and serve models at scale, and Blackwell has reportedly been sold out through mid-2026 even as the Rubin architecture ships ahead of schedule. Management has pointed to roughly $1 trillion of visible AI infrastructure demand through 2027, which if realized implies several more years of a supply-constrained, price-setting market position.

The risk most investors focus on -- custom silicon (ASICs) from hyperscalers competing away Nvidia''s share -- is real but, we believe, overstated relative to how quickly Nvidia''s roadmap (a new accelerator architecture shipping roughly every year, not once every two years) is compounding its lead. We see Nvidia less as a cyclical semiconductor stock and more as the toll-taker on the largest infrastructure buildout in a generation.', 1, 'active'
from investment_sectors where name = 'Semiconductors'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'TSM', 'Taiwan Semiconductor Manufacturing Company', 'tsmc.com', 'TS', 'TSMC is the world''s largest dedicated semiconductor foundry, manufacturing chips designed by its customers -- Apple, Nvidia, AMD, and virtually every other fabless chip company -- rather than selling chips under its own brand. It reports less by end-market segment than by process node: in FY2025, the leading-edge 3-nanometer and 5-nanometer nodes together made up roughly 60% of $122.4B of total revenue, with 7-nanometer-and-below ("advanced technology") accounting for about 74% of wafer revenue.

TSMC earns a premium for being first to volume-produce each new process node, and increasingly from advanced packaging (CoWoS), the process that stacks memory next to an AI accelerator die -- a step that has become as important a bottleneck as the wafers themselves. The company is expanding capacity outside Taiwan, including a growing Arizona campus with committed investment now raised to as much as $265 billion, to diversify geopolitical risk and serve customers who require onshore supply.', 'TSMC is effectively the single supplier every AI accelerator in the world runs through -- Nvidia alone is estimated to account for roughly 60% of TSMC''s CoWoS advanced-packaging capacity -- which gives it pricing power unusual for a capital-intensive manufacturer. Its multi-generation lead in process technology, as the only foundry consistently first to each new node, means it captures outsized economics on every AI chip cycle regardless of which fabless customer ultimately wins share.

We see the combination of near-monopoly positioning in leading-edge fabrication and advanced packaging, disciplined capital allocation with among the highest returns on invested capital in heavy industry, and a valuation that continues to embed a geopolitical "Taiwan discount" as an attractive setup -- particularly as the Arizona buildout gradually reduces single-geography concentration.', 2, 'active'
from investment_sectors where name = 'Semiconductors'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'UBER', 'Uber Technologies, Inc.', 'uber.com', 'UB', 'Uber operates the world''s largest mobility and delivery marketplace, connecting riders and eaters with drivers and couriers across roughly 70 countries, plus a smaller freight brokerage business. FY2025 gross bookings reached $193.5B (+19%) across three segments: Mobility ($29.7B revenue, +18%), the core rideshare business; Delivery ($17.2B revenue, +25%), covering Uber Eats and grocery/retail delivery; and Freight ($5.1B revenue), a lower-margin logistics brokerage.

Uber earns a take rate on each transaction, and profitability has scaled sharply with density -- Mobility now runs at roughly 27% Adjusted EBITDA margin on gross bookings and Delivery has crossed 20%, while Freight remains roughly breakeven. Membership program Uber One, which cross-sells rides and delivery from a single app, is central to deepening engagement and lowering blended acquisition costs.', 'Uber''s network-effect marketplace -- more drivers improve wait times and prices, which attracts more riders, which attracts more drivers -- has produced accelerating operating leverage, with FY2025 Adjusted EBITDA up 35% on 18% revenue growth.

We think the market still discounts Uber for perceived autonomous-vehicle disruption risk, when in practice Uber''s marketplace model looks positioned to benefit from AV proliferation rather than lose to it: AV fleets face high fixed costs and need utilization, and Uber''s network already delivers meaningfully higher utilization than comparable first-party fleets -- which is why Waymo and a growing list of other AV operators have chosen to distribute through Uber''s app rather than build a competing consumer marketplace from scratch. With Delivery now approaching Mobility''s margin profile and Uber One deepening multi-product engagement, we see continued double-digit bookings growth converting into faster earnings growth for several years.', 1, 'active'
from investment_sectors where name = 'Delivery/Ride Hailing'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'LYFT', 'Lyft, Inc.', 'lyft.com', 'LY', 'Lyft is the second-largest rideshare marketplace in the United States, connecting riders and drivers primarily in the U.S. and Canada, with recent European expansion via its 2024 acquisition of FREENOW. FY2025 gross bookings reached a record $18.5B (+15%) on 945.5 million rides (+14%) and 51.3 million annual riders (+16%), producing $6.3B of revenue (+9%) and $529M of Adjusted EBITDA (+38%).

Lyft earns a take rate on completed rides and, through its Flexdrive subsidiary, also manages fleet logistics -- maintenance, depots, and vehicle supply -- services it is now extending to autonomous-vehicle partners. Unlike Uber, Lyft is a single-product (rideshare) company, which makes it more exposed to, but also more focused on, the U.S. ride-hailing category specifically.', 'Lyft has turned the corner from a share-losing, cash-burning challenger into a durably profitable business -- Adjusted EBITDA nearly doubled and FY2025 was Lyft''s first full year of sizable GAAP net income -- while continuing to take modest domestic share back from Uber.

We think the more important development is Lyft''s autonomous-vehicle positioning: rather than building or funding its own AV stack, Lyft has signed partnerships with Waymo (Nashville), May Mobility (Atlanta), Mobileye, and Baidu (Europe), turning what markets have treated as an existential threat into a distribution and fleet-management opportunity for Flexdrive. At a valuation still priced for a structurally weaker also-ran, we see optionality in both a continued profitability inflection and a credible, capital-light AV strategy the market has not yet given Lyft credit for.', 2, 'active'
from investment_sectors where name = 'Delivery/Ride Hailing'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'TBBB', 'BBB Foods Inc.', 'tiendas3b.com', '3B', 'BBB Foods operates Tiendas 3B, a hard-discount grocery chain in Mexico modeled on Germany and Turkey''s Aldi/BIM-style format: a limited assortment of roughly 850-900 SKUs of everyday groceries, sold at the lowest sustainable price through small-format stores built for speed of expansion. It is a single reportable segment, and revenue is almost entirely retail merchandise sales; FY2025 revenue grew 36% to Ps.78.2B on 825 million transactions (+23%), with gross margin holding near 16%.

The hard-discount model earns through cost discipline rather than scale-driven pricing power: a narrow assortment reduces inventory complexity and shrink, private-label penetration protects margin, and small-box formats keep build-out capital and time-to-open low, allowing rapid unit growth into underserved, lower-income Mexican markets.', 'Mexico''s grocery market remains underpenetrated by modern hard-discount formats relative to markets like Germany, Poland, or Turkey, where the format now commands a large share of grocery spend -- BIM, the Turkish chain 3B explicitly modeled itself on, is the clearest analog for the runway still ahead. We see 3B compounding through the same unit-economics flywheel that built BIM: each new store reaches profitability quickly given the low build cost and lean format, funding the next wave of openings without heavy external capital.

FY2025''s reported net loss is a distraction from the underlying story -- it was driven by a one-time, non-cash stock-compensation charge tied to the company''s IPO-linked Liquidity Event Share Plan, not by any deterioration in store-level economics, which continued to improve. With same-store sales growth, transaction growth, and unit growth all positive at once, we think 3B is early in a multi-decade format rollout across Mexico.', 1, 'active'
from investment_sectors where name = 'Consumer Defensive'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'CART', 'Maplebear Inc. (Instacart)', 'instacart.com', 'IC', 'Maplebear Inc. (Instacart) operates the leading online grocery marketplace in North America, connecting consumers with personal shoppers who pick and deliver orders from more than 1,800 retail banners and roughly 85,000 stores. The business has two economic engines: transaction revenue -- fees charged to consumers and retailers on each order -- and advertising, a rapidly scaling business selling sponsored placements to CPG brands across Instacart''s app, which crossed $1B of annual revenue in FY2025 with close to 9,000 active advertising brands.

FY2025 revenue reached roughly $3.74B on GTV growth of 14%, Instacart''s strongest in three years, and the company remains solidly GAAP-profitable (about $447M of net income). A growing share of GTV now flows through Instacart Platform, white-labeled e-commerce and fulfillment technology Instacart licenses directly to retailers such as Kroger and Publix.', 'Advertising is the story: it converts a large share of incremental GTV growth into high-margin revenue, and its growth has consistently outpaced the marketplace''s own order growth, which should keep lifting Instacart''s blended margins as it scales.

We also think the market undervalues Instacart''s shift from a pure marketplace into retail infrastructure -- the Instacart Platform licensing model turns former marketplace competitors (large grocers building their own e-commerce) into paying technology customers instead, widening Instacart''s moat rather than narrowing it. With U.S. online grocery penetration still a fraction of overall grocery spend relative to other e-commerce categories, and a capital-light, already-profitable model funding continued advertising and platform investment, we see a long runway for Instacart to keep compounding GTV, advertising revenue, and margin together.', 2, 'active'
from investment_sectors where name = 'Consumer Defensive'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'SPOT', 'Spotify Technology S.A.', 'spotify.com', 'SP', 'Spotify is the world''s largest audio streaming platform, with 751 million monthly active users and 290 million Premium subscribers at the end of FY2025, across two segments: Premium (paid, ad-free subscriptions, the large majority of revenue) and Ad-Supported (free-tier listening monetized through advertising, and increasingly a discovery funnel that converts into Premium).

FY2025 revenue reached EUR17.2B, the first year above the EUR17B mark, with EUR2.2B of operating income -- a milestone in Spotify''s transition from a growth-at-all-costs streaming platform to a structurally profitable one. Spotify licenses music and podcast content from labels and rightsholders and pays out the large majority of Premium revenue in royalties, so profitability has been driven primarily by pricing power, a growing higher-margin advertising and podcast business, and cost discipline rather than by renegotiating the underlying royalty structure.', 'Spotify has proven out the operating leverage bulls had long expected but that hadn''t shown up in the numbers: gross margin has expanded for several consecutive years as podcasting, audiobooks, and advertising scale on top of the same subscriber base, and headcount discipline has kept opex growth well below revenue growth.

We think the market still treats Spotify primarily as a subscriber-count story, when the more important driver going forward is monetization per user -- price increases have been absorbed with minimal churn, and bundling audiobooks into Premium, alongside a growing advertising marketplace, gives Spotify multiple levers to lift average revenue per user independent of subscriber growth. With MAU growth still healthy at global scale and a now-proven path from revenue growth to operating income growth, we see continued margin expansion as the primary source of upside from here.', 1, 'active'
from investment_sectors where name = 'Streaming'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'SOFI', 'SoFi Technologies, Inc.', 'sofi.com', 'SO', 'SoFi is a member-centric, one-stop digital financial services company operating its own nationally chartered bank across three segments: Lending ($1.85B of FY2025 net revenue) -- personal, student, and home loans, funded increasingly through fee-based loan-platform sales to third parties as well as SoFi''s own balance sheet; Financial Services ($1.54B, +88%) -- SoFi Money, Invest, Credit Card, and Crypto, monetized through deposit-funded net interest income and interchange; and a B2B Technology Platform ($361M) -- Galileo and Technisys, the card-issuing and core-banking infrastructure SoFi licenses to other fintechs and banks.

FY2025 total net revenue grew 35% to $3.61B, with 13.65 million members (+35%) and $37.5B of deposits (+44%) funding roughly 96% of the loan book.', 'SoFi''s advantage is structural, not promotional: its own bank charter and roughly 96% deposit funding give it a meaningfully lower cost of capital than non-bank fintech lenders, while its single-app, multi-product design -- SoFi calls it the Financial Services Productivity Loop -- lowers acquisition costs over time as existing members add products (43% of new products in Q1 2026 came from existing members).

FY2025 GAAP net income looked roughly flat year-over-year, but that''s an artifact of a one-time tax benefit in the prior year; on an underlying basis, adjusted net income more than doubled and adjusted EBITDA grew 58%, evidence the model is scaling as designed. With Financial Services now growing faster than Lending and carrying a comparable margin, we see SoFi''s earnings mix shifting toward its highest-quality, most capital-light segment, supporting continued profitable growth from what is still a small share of U.S. consumer banking.', 1, 'active'
from investment_sectors where name = 'Banking & Payments'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, opportunity, sort_order, status)
select id, 'MA', 'Mastercard Incorporated', 'mastercard.com', 'MA', 'Mastercard operates one of the world''s two dominant global payment networks, processing card transactions between banks, merchants, and consumers without extending credit itself -- Mastercard is a network, not a lender; issuing banks bear the credit risk. Revenue splits into two categories: payment network revenue ($19.5B in FY2025, +12%), earned on switched transaction volume ($10.6 trillion of gross dollar volume, +9% local currency) as cards move through Mastercard''s rails; and value-added services and solutions ($13.3B, +23%) -- cybersecurity, fraud prevention, data analytics, and loyalty products sold to banks and merchants, now Mastercard''s fastest-growing and most differentiated segment.

Total FY2025 net revenue reached $32.8B, up 16%. Mastercard earns a small fee on an enormous, still-growing base of digital transactions, with minimal capital intensity and negligible credit exposure.', 'Mastercard''s core business benefits from the secular, multi-decade shift from cash to digital payments, which continues even in mature markets and accelerates faster in still-underpenetrated regions. What we think is underappreciated is the value-added services flywheel: cybersecurity and analytics products, cross-sold into the same issuing-bank relationships that already run Mastercard''s core rails, are compounding faster than the network itself and carry higher margins, structurally improving the business mix over time.

We also see stablecoins and blockchain settlement as an option Mastercard is positioned to win rather than be disrupted by -- its 2026 acquisition of stablecoin infrastructure provider BVNK and participation in the multi-bank Open USD consortium put it at the center of digital-dollar settlement rather than on the sidelines. With a duopoly-like competitive position alongside Visa, high incremental margins, and multiple growth vectors beyond core switched volume, we view Mastercard as a high-quality compounder levered to the growth of global digital payments broadly.', 2, 'active'
from investment_sectors where name = 'Banking & Payments'
on conflict (ticker) do nothing;

