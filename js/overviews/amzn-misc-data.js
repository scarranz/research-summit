// amzn-misc-data.js — reported data for Amazon Deep Dive ▸ Miscellaneous ▸ Capacity → revenue (MISC-capacity, playbook §15b).
// Rule 10: filings, calls and the company's own published lists only — no Summit numbers here (they come from the frozen
// Results dataset), no market data.

// The chain, link by link: [link, measure, latest value, source, status]. Values are quoted as Amazon gave them.
export var AMZN_CHAIN = [
  ['1 · Money in', 'Purchases of property and equipment (gross), and AWS segment property and equipment additions',
   '$77.3B in 3Q26 (company); AWS additions $96.5B in FY2025', '8-K Ex. 99.1, Oct 29 2026; Form 10-K FY2025, segment note', 'Reported'],
  ['2 · Power added', 'Gigawatts of power capacity added',
   '3.99 GW in the twelve months to Dec 2025, 1.2 GW in 4Q25 alone; plan to double the 2025 power capacity by the end of 2027',
   'Earnings calls 4Q25 (Feb 5 2026) and 2Q26 (Jul 30 2026), Andy Jassy', 'Disclosed on calls — additions only'],
  ['3 · Installed capacity', 'Total gigawatts in service',
   'Not disclosed — Amazon gives additions and a doubling target, never the installed total', '—', 'The chain breaks here'],
  ['4 · Contracted demand', 'Performance obligations not yet recognized, primarily AWS',
   '$496B at Jun 30 2026; weighted-average remaining life 6.4 years', 'Form 10-Q 2Q26 (filed Jul 31 2026), Note 1 — Unearned Revenue', 'Reported'],
  ['5 · Revenue', 'AWS segment net sales',
   '$46.0B in 3Q26 (+39%), a $184B annualized run rate', '8-K Ex. 99.1, Oct 29 2026', 'Reported']
];
export var AMZN_BACKLOG_NOTE = 'Backlog = performance obligations on contracts with original terms over one year, "primarily related to AWS" (Form 10-Q); the quarterly series is Bloomberg\'s reading of that disclosure (BS_REMAINING_PERFORMANCE_OBLIG, as carried in the Top Line dataset). Amazon also quotes "AWS backlog" on the calls: $244B (4Q25), $364B (1Q26), $496B (2Q26).';

// AWS Regions by country — [country, Region, code, Availability Zones (null if announced), launch year, status].
// Source: AWS, "Regions and Availability Zones" (aws.amazon.com/about-aws/global-infrastructure/regions_az), page data read
// Oct 29 2026. The page headline counts 124 Availability Zones in 39 Regions plus 2 announced; its Region list carries 41
// entries (it includes the AWS European Sovereign Cloud in Germany). AWS publishes no capacity (MW) per Region.
export var AMZN_AWS_REGIONS = [
  ['Australia', 'Australia (Sydney)', 'ap-southeast-2', 3, '2012', 'Available'],
  ['Australia', 'Australia (Melbourne)', 'ap-southeast-4', 3, '2023', 'Available'],
  ['Bahrain', 'Middle East (Bahrain)', 'me-south-1', 3, '2019', 'Available'],
  ['Brazil', 'South America (São Paulo)', 'sa-east-1', 3, '2011', 'Available'],
  ['Canada', 'Canada (Central)', 'ca-central-1', 3, '2016', 'Available'],
  ['Canada', 'Canada West (Calgary)', 'ca-west-1', 3, '2023', 'Available'],
  ['Chile', 'South America (Chile)', 'sa-west-1', null, '', 'Announced'],
  ['China', 'Mainland China (Beijing)', 'cn-north-4', 3, '2016', 'Available'],
  ['China', 'Mainland China (Ningxia)', 'cn-northwest-4', 3, '2017', 'Available'],
  ['France', 'Europe (Paris)', 'eu-west-3', 3, '2017', 'Available'],
  ['Germany', 'Europe (Frankfurt)', 'eu-central-1', 3, '2014', 'Available'],
  ['Germany', 'AWS European Sovereign Cloud (Germany)', 'eu-sovereign-4', 3, '2026', 'Available'],
  ['Hong Kong', 'Asia Pacific (Hong Kong)', 'ap-east-1', 3, '2019', 'Available'],
  ['India', 'Asia Pacific (Mumbai)', 'ap-south-1', 3, '2016', 'Available'],
  ['India', 'Asia Pacific (Hyderabad)', 'ap-south-2', 3, '2022', 'Available'],
  ['Indonesia', 'Asia Pacific (Jakarta)', 'ap-southeast-3', 3, '2021', 'Available'],
  ['Ireland', 'Europe (Ireland)', 'eu-west-1', 3, '2007', 'Available'],
  ['Israel', 'Israel (Tel Aviv)', 'il-central-1', 3, '2023', 'Available'],
  ['Italy', 'Europe (Milan)', 'eu-south-1', 3, '2020', 'Available'],
  ['Japan', 'Asia Pacific (Tokyo)', 'ap-northeast-1', 4, '2011', 'Available'],
  ['Japan', 'Asia Pacific (Osaka)', 'ap-northeast-3', 3, '2021', 'Available'],
  ['Malaysia', 'Asia Pacific (Malaysia)', 'ap-southeast-5', 3, '2024', 'Available'],
  ['Mexico', 'Mexico (Central)', 'mx-central-1', 3, '2025', 'Available'],
  ['New Zealand', 'Asia Pacific (New Zealand)', 'ap-southeast-7', 3, '2025', 'Available'],
  ['Saudi Arabia', 'Kingdom of Saudi Arabia', 'me-south-2', null, '', 'Announced'],
  ['Singapore', 'Asia Pacific (Singapore)', 'ap-southeast-1', 3, '2010', 'Available'],
  ['South Africa', 'Africa (Cape Town)', 'af-south-1', 3, '2020', 'Available'],
  ['South Korea', 'Asia Pacific (Seoul)', 'ap-northeast-2', 4, '2016', 'Available'],
  ['Spain', 'Europe (Spain)', 'eu-south-2', 3, '2022', 'Available'],
  ['Sweden', 'Europe (Stockholm)', 'eu-north-1', 3, '2018', 'Available'],
  ['Switzerland', 'Europe (Zurich)', 'eu-central-2', 3, '2022', 'Available'],
  ['Taiwan', 'Asia Pacific (Taipei)', 'ap-northeast-4', 3, '2025', 'Available'],
  ['Thailand', 'Asia Pacific (Thailand)', 'ap-southeast-7x', 3, '2025', 'Available'],
  ['United Arab Emirates', 'Middle East (UAE)', 'me-central-1', 3, '2022', 'Available'],
  ['United Kingdom', 'Europe (London)', 'eu-west-2', 4, '2016', 'Available'],
  ['United States', 'US East (Northern Virginia)', 'us-east-1', 6, '2006', 'Available'],
  ['United States', 'US West (Northern California)', 'us-west-1', 3, '2009', 'Available'],
  ['United States', 'AWS GovCloud (US-West)', 'us-gov-west-1', 3, '2011', 'Available'],
  ['United States', 'US West (Oregon)', 'us-west-2', 4, '2011', 'Available'],
  ['United States', 'US East (Ohio)', 'us-east-2', 3, '2016', 'Available'],
  ['United States', 'AWS GovCloud (US-East)', 'us-gov-east-1', 3, '2018', 'Available']
];
export var AMZN_AWS_REGIONS_SRC = 'AWS, Regions and Availability Zones (aws.amazon.com/about-aws/global-infrastructure/regions_az), read Oct 29 2026';
