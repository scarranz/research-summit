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
  moat         text,
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


-- ─── 4. Seed: holdings (Overview / Moat / Opportunity write-ups) ─
-- Sourced from FY2025 10-K/20-F filings, investor relations releases, and
-- SEC EDGAR as of July 2026. Original analysis -- Summit's own investment case.
-- Bold (**text**) is rendered as <strong> by the portal's prose renderer.

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'META', 'Meta Platforms, Inc.', 'meta.com', 'M', 'Meta owns the world''s biggest social apps: Facebook, Instagram, Messenger, and WhatsApp, used by **more than 3.5 billion people every day**. Almost all of its revenue comes from selling ads inside those apps, powered by AI that decides which ad each person sees. A separate unit, Reality Labs, builds VR/AR hardware like the Quest headset and Ray-Ban smart glasses; it''s still losing money, but it''s Meta''s bet on the next computing platform.

In FY2025 the core advertising business made **$130.5B in revenue at a 47% profit margin**, enough to fund Meta''s heavy AI and hardware spending without needing outside capital.', 'Every extra user makes Meta''s ad-targeting AI better, which makes its ads more valuable, letting Meta charge more per ad than almost any other platform. That scale is extremely hard to copy: a challenger would need billions of users and years of behavioral data just to match Meta''s targeting quality. WhatsApp and Instagram also give Meta control over how billions of people communicate and shop, a daily habit that''s difficult to displace once it''s formed.', 'We think the market undervalues how directly Meta''s AI spending is turning into profit. Ad performance keeps improving as the AI models get better, and that shows up in the **47% margin** even while Meta spends aggressively on AI infrastructure.

Reality Labs'' losses look like a distraction, but we see them as an option on the next interface layer: if wearables or smart glasses go mainstream, Meta already has the head start.', 1, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'AMZN', 'Amazon.com, Inc.', 'amazon.com', 'AZ', 'Amazon runs two giant businesses: its online store (including third-party sellers and Whole Foods) and Amazon Web Services (AWS), the world''s largest cloud computing provider. Retail makes money from product sales, seller fees, Prime subscriptions, and a fast-growing ads business. AWS rents out computing power and storage to other companies, and it''s far more profitable than retail.

In FY2025, AWS generated **$128.7B in revenue and $45.6B of operating profit**, while retail generated $588B in sales at a much thinner margin.', 'Amazon''s retail moat is its delivery network, built over two decades to ship faster and cheaper than almost any competitor, which keeps customers coming back through Prime. AWS''s moat is switching cost: once a company builds its software on AWS, moving to a different cloud provider is expensive and risky, so customers rarely leave. Both businesses also benefit from scale that smaller rivals simply can''t match on price.', 'AWS is re-accelerating as companies move AI workloads onto its infrastructure, and Amazon is spending more than ever to add capacity to keep up with demand.

Retail still has room to get more profitable as advertising and delivery automation grow. A fast-growing, high-margin cloud business layered on a retail business with untapped margin upside is why we think Amazon can keep growing profits faster than the market already assumes.', 2, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'GOOGL', 'Alphabet Inc.', 'google.com', 'G', 'Alphabet is the parent company of Google: the world''s dominant search engine, YouTube, and Google Cloud, plus early-stage projects like Waymo self-driving cars. Search and YouTube make money from advertising; Google Cloud sells computing power and AI tools to businesses, competing with AWS.

In FY2025, Google Cloud made **$58.7B in revenue, up 36%**, while Search brought in $224.5B, still Alphabet''s biggest profit engine by far.', 'Google Search is the default way billions of people look things up online, giving Alphabet an enormous, constantly updated stream of data that competitors can''t replicate. Its own AI chips (TPUs) let it run AI at a lower cost than rivals renting chips from Nvidia, a real cost edge in Cloud and in its own products. YouTube''s scale is a similar network effect: more creators bring more viewers, which brings more creators.', 'Alphabet is one of the only companies with the data, the users, and the computing power to build AI at the largest scale and make money from it immediately through ads and Cloud.

We think the market still prices Alphabet mainly as an ads business, undervaluing how fast Cloud is growing and how much better its margins are getting as it reaches AWS-like scale.', 3, 'active'
from investment_sectors where name = 'Big Tech'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'NVDA', 'NVIDIA Corporation', 'nvidia.com', 'NV', 'Nvidia designs the chips that power most of the world''s AI systems. Its Data Center chips, sold to companies like Microsoft, Amazon, Google, and Meta to train and run AI models, now make up **about 90% of its business**. It also sells graphics chips for PC gaming, a smaller but still profitable line.

In fiscal 2026, total revenue grew from about $131B to **$215.9B, a 65% jump in a single year**.', 'Nvidia''s biggest edge isn''t just its chips, it''s the software built around them (CUDA), which developers have used for almost two decades and are reluctant to abandon. That software lock-in matters as much as raw chip performance. Nvidia also ships a new, faster chip roughly every year, which makes it hard for competitors to catch up even when they build a good chip, because Nvidia is already shipping the next one.', 'Every major AI model builder and cloud company needs Nvidia''s chips, and demand keeps outpacing supply; management says the current chip generation is sold out well into next year.

Investors worry that big tech companies building their own chips will hurt Nvidia, but we think that risk is overstated given how fast Nvidia''s own roadmap is moving. We see Nvidia less as a typical chip company and more as the toll collector on the entire AI buildout.', 1, 'active'
from investment_sectors where name = 'Semiconductors'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'TSM', 'Taiwan Semiconductor Manufacturing Company', 'tsmc.com', 'TS', 'TSMC manufactures the chips that other companies design, including Apple, Nvidia, and AMD. It doesn''t sell chips under its own name; it''s the factory behind almost every advanced chip in the world.

In FY2025, its most advanced processes (3-nanometer and 5-nanometer) made up **roughly 60% of its $122.4B in revenue**, and the company is spending heavily to build new factories in Arizona.', 'TSMC is years ahead of every other chip factory in the world at making the smallest, most advanced chips, and that lead is very hard to close because it takes billions of dollars and years to build the expertise. Because it''s essentially the only option for the most advanced chips, it can charge a premium instead of competing on price. Its packaging technology, which stacks memory next to AI chips, has also become a second bottleneck that only TSMC can solve at scale.', 'Virtually every AI chip in the world is made by TSMC, and Nvidia alone is estimated to use about 60% of TSMC''s most advanced packaging capacity, giving TSMC unusual pricing power for a manufacturer.

We like the combination of near-monopoly positioning, strong returns on the capital it spends, and a stock price that still discounts geopolitical risk in Taiwan, a risk that should shrink as the Arizona factories ramp up.', 2, 'active'
from investment_sectors where name = 'Semiconductors'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'UBER', 'Uber Technologies, Inc.', 'uber.com', 'UB', 'Uber runs the world''s largest ride-hailing and food delivery marketplace, connecting riders and eaters with drivers and couriers in roughly 70 countries, plus a smaller freight business.

In FY2025, total bookings reached **$193.5B, up 19%**, with Mobility (rides) making $29.7B in revenue and Delivery (food and grocery) making $17.2B and growing faster, at 25%.', 'Uber''s advantage is a two-sided network: more drivers mean shorter wait times, which attracts more riders, which attracts more drivers. That loop is hard for a new competitor to break into, since a smaller network simply can''t offer the same speed or price. Uber One, its membership program, also locks people into using both rides and delivery from the same app, making it stickier than a single-product rival.', 'Uber''s marketplace keeps getting more profitable as it grows: profit (Adjusted EBITDA) grew 35% in FY2025, faster than the 18% revenue growth.

Many investors worry self-driving cars will replace Uber, but we think the opposite is more likely: self-driving fleets need a marketplace to reach riders efficiently, and Uber''s network already gets higher utilization than any single company could build alone, which is why Waymo itself chose to distribute through Uber''s app.', 1, 'active'
from investment_sectors where name = 'Delivery/Ride Hailing'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'LYFT', 'Lyft, Inc.', 'lyft.com', 'LY', 'Lyft is the second-largest ride-hailing company in the U.S., plus a smaller presence in Canada and Europe through its 2024 acquisition of FREENOW.

In FY2025, bookings hit a record **$18.5B, up 15%**, revenue grew to $6.3B, and profit (Adjusted EBITDA) nearly doubled to $529M.', 'Lyft''s edge is smaller than Uber''s, but real: it still benefits from the same driver-rider network effect within the U.S. market it operates in, plus a loyal user base built over more than a decade. Its Flexdrive subsidiary, which manages vehicle fleets, gives it a service that autonomous-vehicle partners are willing to pay for, adding a second business on top of the core marketplace.', 'Lyft has turned a corner from a money-losing challenger into a durably profitable business, while slowly taking back market share from Uber in the U.S.

The more interesting development is its self-driving strategy: instead of building its own robotaxis, Lyft partnered with Waymo, May Mobility, Mobileye, and Baidu, turning what worried investors into a new source of revenue for Flexdrive. We think the stock is still priced like the old, unprofitable Lyft.', 2, 'active'
from investment_sectors where name = 'Delivery/Ride Hailing'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'TBBB', 'BBB Foods Inc.', 'tiendas3b.com', '3B', 'BBB Foods runs Tiendas 3B, a chain of small, no-frills grocery stores in Mexico that sell a limited selection of everyday groceries (about 850-900 items) at the lowest possible prices, similar to Aldi in Europe.

In FY2025, revenue grew **36% to Ps.78.2B**, and the company opened stores fast while keeping its profit margin steady at around 16%.', '3B''s edge is pure cost discipline: fewer products to manage means less waste and lower overhead, and its own store-brand products protect margin better than name brands would. Because each store is small and cheap to build, 3B can open new locations faster and with less risk than a traditional supermarket chain, letting it out-expand competitors in underserved, lower-income areas of Mexico.', 'Mexico still has far fewer of these discount stores per person than countries like Germany or Turkey, where the format now captures a large share of grocery spending; that gap is the growth runway.

The FY2025 net loss looks alarming on the surface, but it came from a one-time, non-cash stock-compensation charge tied to the IPO, not from weaker store economics, which actually kept improving. We think 3B is still early in a decades-long expansion across Mexico.', 1, 'active'
from investment_sectors where name = 'Consumer Defensive'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'CART', 'Maplebear Inc. (Instacart)', 'instacart.com', 'IC', 'Maplebear (Instacart) runs the leading online grocery delivery marketplace in North America, connecting shoppers with personal shoppers who pick and deliver from more than 1,800 retail chains.

Instacart makes money two ways: fees on each order, and a fast-growing advertising business that sells sponsored placement to grocery brands, which crossed **$1B in FY2025 revenue** out of $3.74B total.', 'Instacart''s advertising business is the real moat: brands pay to reach shoppers at the exact moment they''re buying groceries, a kind of targeting that''s hard to replicate outside a grocery marketplace. It also licenses its technology directly to grocers like Kroger and Publix to run their own websites, turning would-be competitors into paying customers instead. That combination of scale and switching cost is difficult for a new entrant to match.', 'Advertising keeps growing faster than the core marketplace and carries much higher profit margins, so as it becomes a bigger share of revenue, Instacart''s overall profitability should keep climbing.

Online grocery is still a small slice of total U.S. grocery spending compared to how much shopping has already moved online in other categories, which is why we see a long runway ahead, funded by a business that is already profitable today.', 2, 'active'
from investment_sectors where name = 'Consumer Defensive'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'SPOT', 'Spotify Technology S.A.', 'spotify.com', 'SP', 'Spotify is the world''s largest music and podcast streaming service, with **751 million monthly users and 290 million paying subscribers** at the end of FY2025.

Free users listen with ads; paying subscribers get an ad-free experience. Revenue reached EUR17.2B in FY2025, and for the first time the company was solidly profitable, with EUR2.2B of operating income.', 'Spotify''s edge is the largest catalog and recommendation engine in music streaming, built on years of listening data that makes its personalized playlists hard to copy. Its scale also gives it leverage when negotiating royalty deals with record labels. Switching services means losing years of saved playlists and listening history, a real form of lock-in for long-time users.', 'Spotify has finally proven it can turn revenue growth into profit growth: gross margin has expanded for several years straight as podcasts, audiobooks, and ads scale on top of the same subscriber base.

We think the bigger opportunity from here isn''t just adding more users, it''s getting more revenue out of each one, through price increases, bundled audiobooks, and a growing ad business, all of which Spotify has room to keep pulling.', 1, 'active'
from investment_sectors where name = 'Streaming'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'SOFI', 'SoFi Technologies, Inc.', 'sofi.com', 'SO', 'SoFi is an online-only bank offering loans, savings, investing, and a credit card, all in one app, backed by its own U.S. bank charter.

In FY2025, total revenue grew **35% to $3.61B**, with 13.65 million members and $37.5B in deposits, both growing faster than the loan book they fund.', 'Owning a bank charter lets SoFi fund loans with low-cost customer deposits instead of expensive borrowed money, a real cost advantage over fintech lenders that don''t have a charter. Because banking, investing, and loans all live in one app, each new product a member adds makes them more likely to stay and use SoFi for the next thing too, lowering the cost of winning new customers over time.', 'SoFi''s deposit base is growing even faster than its loan book, which means it has more low-cost funding than it currently needs, a healthy sign rather than a stretched balance sheet.

FY2025 profit looked flat only because of a one-time tax benefit the year before; the underlying business actually more than doubled its profit. We think SoFi is still a small player in U.S. consumer banking with a long growth runway ahead.', 1, 'active'
from investment_sectors where name = 'Banking & Payments'
on conflict (ticker) do nothing;

insert into investment_companies (sector_id, ticker, name, logo_domain, mono, overview, moat, opportunity, sort_order, status)
select id, 'MA', 'Mastercard Incorporated', 'mastercard.com', 'MA', 'Mastercard runs one of the world''s two dominant payment networks, processing card transactions between banks, merchants, and shoppers. It doesn''t lend money itself; the banks that issue Mastercard cards take on that risk.

In FY2025, net revenue grew to **$32.8B, up 16%**, split between its core payment network and a fast-growing "value-added services" business (fraud protection, data, and analytics) that grew even faster, at 23%.', 'Mastercard and Visa together dominate global card payments, and building a new global card network from scratch is close to impossible given the decades it takes to sign up banks and merchants everywhere. Its value-added services also deepen relationships with the same banks that already run its core network, making Mastercard harder to replace even in categories a rival might target.', 'The shift from cash to digital payments is a decades-long trend that keeps benefiting Mastercard, even in markets where card usage is already common.

We think the market underappreciates the value-added services business, which is growing faster than the core network and carries higher margins, along with Mastercard''s early moves into stablecoins (its 2026 purchase of BVNK), positioning it to benefit from digital-dollar settlement rather than be disrupted by it.', 2, 'active'
from investment_sectors where name = 'Banking & Payments'
on conflict (ticker) do nothing;

