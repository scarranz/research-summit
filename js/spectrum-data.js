// spectrum-data.js — the Investment Spectrum's seed data.
//
// Two axes:
//   x  0 → 100   intangible (technology, IP, scalability) → tangible (assets, land, production)
//   y  0 → 100   asset-light (little capital per dollar of revenue) → asset-heavy
//
// x is seeded from the Investment Spectrum deck ("How companies create Value"), preserving the
// deck's left-to-right order. y is a judgment call — it is the axis the deck did not have, where
// the deck's vertical stacking only meant "same point on the line".
//
// Positions here are the SEED. What the team drags is stored separately (localStorage today,
// a Supabase table once the shape settles) and always wins over these numbers.

/* ─── Zones ───────────────────────────────────────────────────────────────
   Bands behind a continuous axis, not buckets. A company is allowed to sit
   on a boundary — that is information, not an error.

   `hue` drives the band, the header cell, the chips and the criteria column
   for that zone. The four run cool → warm across the board, so the map reads
   as abstract → physical before you have read a single label.

   The deck carries four headers but only three bullet groups: "Geographic
   Presence" and "Commodities" share one. Split here as footprint-and-
   throughput vs production-and-land; flagged so it can be corrected.        */

export const SPECTRUM_ZONES = [
  {
    id: 'tech',
    name: 'Company Technology',
    from: 0, to: 30,
    hue: '#4F46E5',
    criteria: ['Technology', 'Scalability', 'Intellectual Property', 'Heavy R&D dependent'],
    blurb: 'Value comes from what the company knows and can copy at zero marginal cost.'
  },
  {
    id: 'users',
    name: 'User Metrics',
    from: 30, to: 57,
    hue: '#0E8C9C',
    criteria: ['Users', 'Network Effects', 'Platform Economics', 'Software Centric'],
    blurb: 'Value comes from who is on the platform and what they do there.'
  },
  {
    id: 'geo',
    name: 'Geographic Presence',
    from: 57, to: 84,
    hue: '#D97706',
    criteria: ['Assets', 'Throughput (SSS)'],
    blurb: 'Value comes from a physical footprint and how much flows through it.',
    note: 'Deck shares one bullet group with Commodities; split proposed here.'
  },
  {
    id: 'commod',
    name: 'Commodities',
    from: 84, to: 100,
    hue: '#B4442E',
    criteria: ['Tangible Production', 'Land Ownership'],
    blurb: 'Value comes from owning the underlying thing, at a price you do not set.',
    note: 'Deck shares one bullet group with Geographic Presence; split proposed here.'
  }
];

/* ─── Companies ───────────────────────────────────────────────────────────
   `why` argues the x position (which business model), `capital` argues the y
   position (how much capital that model eats). `tension` is set where the two
   axes, or the deck and the numbers, tell different stories — those are the
   nodes worth arguing about.

   `profile` is the portal Overview slug where one exists, so a node can link
   through to real work. null = we do not cover it in the portal today.
   `domain` is only the logo fallback when the ticker lookup misses.          */

export const SPECTRUM_COMPANIES = [
  {
    ticker: 'NVDA', name: 'NVIDIA', x: 4, y: 20, profile: 'nvidia', domain: 'nvidia.com',
    why: 'Fabless. Owns the architecture, the instruction set and CUDA; rents the fabs. What it sells is IP with silicon attached.',
    capital: 'R&D-heavy but capex-light — the fabs belong to TSMC. Capital goes into people and into supply commitments, not plants.',
    tension: 'Asset-light on its own balance sheet only because someone else carries the fab. Reads differently if you consolidate the supply chain.'
  },
  {
    ticker: 'TSM', name: 'Taiwan Semiconductor', x: 9, y: 95, profile: null, domain: 'tsmc.com',
    why: 'Its moat is process technology — nodes, yield, and the R&D that gets there first. By what creates the value, it belongs beside NVIDIA.',
    capital: 'And by what the value costs, it belongs at the very bottom of the board: the fabs are among the largest capital programmes in manufacturing, running at a third to a half of revenue year after year.',
    tension: 'The exact mirror of NVIDIA, and the most useful pair on the board. Same zone, opposite ends of the vertical axis — the fabless/foundry split IS the y axis. On the deck\'s single line these two would be neighbours, which hides the entire point.'
  },
  {
    ticker: 'AMZN', name: 'Amazon.com', x: 14, y: 86, profile: 'amzn', domain: 'amazon.com',
    why: 'Placed left by the deck on the strength of AWS and advertising — the parts that scale like software.',
    capital: 'The heaviest capex programme of any company on this map: data centres, fulfilment, last-mile fleet.',
    tension: 'The clearest disagreement between the two axes on the board. Far left by business model, near the bottom by what it costs to run. Worth asking whether the retail half belongs further right on its own.'
  },
  {
    ticker: 'GOOGL', name: 'Alphabet', x: 18, y: 66, profile: 'googl', domain: 'abc.xyz',
    why: 'Search, YouTube and Android are distribution the company owns outright, ranked by models and run on silicon it designs itself. Software economics at the top of the funnel.',
    capital: 'The AI build-out turned one of the lightest businesses in the index into one of the heaviest spenders — on a revenue base large enough to absorb it better than its peers can.',
    tension: 'Lands above Meta here, which will look wrong at first glance: its capex is larger in dollars but smaller against sales. Which of the two is "heavier" depends entirely on which denominator you accept.'
  },
  {
    ticker: 'META', name: 'Meta Platforms', x: 24, y: 78, profile: 'meta', domain: 'meta.com',
    why: 'Attention sold to advertisers, ranked by models the company owns. Software economics on the revenue line.',
    capital: 'Was genuinely asset-light until the AI build-out; capex now runs at a share of revenue that no ad business used to carry.',
    tension: 'Migrating down the y axis year by year. The x position has not moved; the capital intensity has.'
  },
  {
    ticker: 'SPOT', name: 'Spotify Technology', x: 28, y: 8, profile: 'spot', domain: 'spotify.com',
    why: 'Software distribution over a catalogue it licenses rather than owns — the scalability is real, the IP is rented.',
    capital: 'Close to the lightest on the board: no plants, no fleet, no inventory. Cash goes to content deals, not to capex.',
    tension: 'Sits in Company Technology but owns almost no technology moat — the labels hold the IP. Arguably belongs further right, next to the platforms.'
  },
  {
    ticker: 'UBER', name: 'Uber Technologies', x: 39, y: 14, profile: 'uber', domain: 'uber.com',
    why: 'The reference case for the middle: value is the two-sided network, measured in users and trips, not in what Uber owns.',
    capital: 'Owns no cars. Capital intensity is close to zero at the operating level.',
    tension: null
  },
  {
    ticker: 'LYFT', name: 'Lyft', x: 44, y: 20, profile: 'lyft', domain: 'lyft.com',
    why: 'Same model as Uber in one geography and one vertical — which is exactly why the deck stacks them.',
    capital: 'Asset-light on the same logic as Uber; the bike and scooter fleet is the only real hardware.',
    tension: null
  },
  {
    ticker: 'MA', name: 'Mastercard', x: 45, y: 5, profile: 'mastercard', domain: 'mastercard.com',
    why: 'A toll on a network it owns neither end of. Value is cards on one side and acceptance on the other — the purest network effect on the board.',
    capital: 'Almost nothing. No lending, no inventory, no plant: the rails are software and the banks carry the balance sheet.',
    tension: 'The deck puts it with the platforms, which is right, but its economics are more extreme than anything near it. It may deserve to anchor the top of the board rather than share the middle.'
  },
  {
    ticker: 'SOFI', name: 'SoFi Technologies', x: 53, y: 57, profile: 'sofi', domain: 'sofi.com',
    why: 'A digital bank that grows by adding members and cross-selling them — user metrics are literally the reported KPI.',
    capital: 'Capital-intensive in a way this axis was not built for: the constraint is regulatory capital and deposits, not property.',
    tension: 'Almost no PP&E, but a balance sheet that has to be funded. If y is measured as capex over revenue it lands near the top; as capital employed, near the bottom. The axis needs a rule for lenders.'
  },
  {
    ticker: 'IBKR', name: 'Interactive Brokers', x: 47, y: 44, profile: 'ibkr', domain: 'interactivebrokers.com',
    why: 'Accounts, platform, execution — a software business whose unit of growth is the funded account.',
    capital: 'Same problem as SoFi: a very large balance sheet, almost no fixed assets. Automation is the whole point of the model.',
    tension: 'Arguably the most software-like company in the middle of the board, and the deck places it with the platforms rather than with the technology names.'
  },
  {
    ticker: 'DIS', name: 'The Walt Disney Company', x: 58, y: 80, profile: 'dis', domain: 'thewaltdisneycompany.com',
    why: 'Two business models under one roof: an IP library that is pure intangible, and parks, ships and hotels that are as physical as anything here. Placed on the boundary because it genuinely straddles one.',
    capital: 'Experiences carries the weight — parks and cruise ships are multi-year, multi-billion commitments that the streaming half never needs.',
    tension: 'The board has no way to draw a company that is two models at once. Either it sits on the border, as here, or it argues for splitting the node in two.'
  },
  {
    ticker: 'PAC', name: 'Grupo Aeroportuario del Pacífico', x: 62, y: 92, profile: null, domain: 'aeropuertosgap.com.mx',
    why: 'A concession over specific runways in specific cities. Geography is not a feature of the model — it is the model.',
    capital: 'The heaviest on the board: terminals and runways, built to a committed investment programme, with tariffs regulated against it.',
    tension: null
  },
  {
    ticker: 'TBBB', name: 'BBB Foods (Tiendas 3B)', x: 80, y: 62, profile: 'bbb', domain: 'tiendas3b.com',
    why: 'Hard discount: value comes from store count, density and same-store sales — throughput through a physical footprint.',
    capital: 'Every unit of growth is a store that must be built and stocked, though leases carry much of the property.',
    tension: null
  },
  {
    ticker: 'TPL', name: 'Texas Pacific Land', x: 93, y: 15, profile: null, domain: 'texaspacific.com',
    why: 'Land ownership in its purest form: royalties on production it does not carry out, over acreage it has held since the railroad.',
    capital: 'A royalty, not an operator. Almost no capital consumed — the operators drill, TPL collects.',
    tension: 'The single best argument for the second axis. Furthest right on the board and almost the lightest, at the same time. On a one-line spectrum it would sit next to PAC, which is wrong in every way that matters.'
  }
];

/* ─── Axis definitions, shown in the UI ─────────────────────────────────── */

export const SPECTRUM_AXES = {
  x: {
    label: 'How value is created',
    left: 'Intangible — technology, scalability, IP',
    right: 'Tangible — assets, throughput, production, land'
  },
  y: {
    label: 'Capital intensity',
    top: 'Asset-light',
    bottom: 'Asset-heavy',
    note: 'the measured version (capex/revenue, PP&E/assets) is the next step, and will not cover the whole board — GOOGL, TSM, DIS, PAC, TPL and IBKR have no Summit model.'
  }
};
