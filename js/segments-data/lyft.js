// segments-data/lyft.js — the Top Line dataset for Lyft, Inc. (NASDAQ: LYFT), read by js/segments.js. Built 2026-11-05 (TL-GEN/SEG/OTH/CUS).
// SHAPE OF THIS COMPANY (same as SharkNinja): Lyft reports ONE operating segment (FY2025 10-K, Note 2), so `segments` has a single
// entry that carries the consolidated platform, its KPIs and the volume/value identities; the revenue analysis lives in `other`, which holds the
// two cuts of the same total the 10-K discloses (revenue line and geography). Both cuts are ANNUAL (FY2023-FY2025): quarterly splits
// would need the 10-Qs. Quarterly series are POINTERS into js/results-data/lyft.js (results:<key>); the engine reads `act` and falls
// back to `summit`, never `cons`. Generated from a script and checked against the FY2025 10-K (acc. 0001628280-26-006960).
export var lyftSegments = {
 "updated": "Nov 5, 2026",
 "company": "Lyft",
 "source": "Quarterly revenue, Gross Bookings, Rides, Active Riders and Adjusted EBITDA are read from the Results dataset (Lyft 8-K Exhibit 99.1 releases and the 2Q26 10-Q; forecast quarters are the Summit DCF submit of 2026-08-07, frozen). The revenue-line and geographic cuts are annual and come from Lyft’s FY2025 Form 10-K, revenue note (disaggregation and geography). Customer, product and KPI wording is from the FY2025 10-K Item 1 and Item 7 and the 2Q26 prepared remarks.",
 "axis": {
  "q": [
   "1Q24",
   "2Q24",
   "3Q24",
   "4Q24",
   "1Q25",
   "2Q25",
   "3Q25",
   "4Q25",
   "1Q26",
   "2Q26",
   "3Q26",
   "4Q26"
  ],
  "y": [
   "2022",
   "2023",
   "2024",
   "2025",
   "2026",
   "2027",
   "2028",
   "2029"
  ]
 },
 "shared": {
  "rev_mkt": {
   "label": "Ridesharing marketplace and other contracts (ASC 606)",
   "short": "Marketplace & other",
   "unit": "usdM",
   "src": "10-K revenue note",
   "scope": "company",
   "y": {
    "act": {
     "2023": 4116.2,
     "2024": 5365.5,
     "2025": 5895.5
    },
    "summit": {}
   }
  },
  "rev_rent": {
   "label": "Rental revenue (ASC 842)",
   "short": "Rentals",
   "unit": "usdM",
   "src": "10-K revenue note",
   "scope": "company",
   "y": {
    "act": {
     "2023": 287.4,
     "2024": 420.5,
     "2025": 420.8
    },
    "summit": {}
   }
  },
  "geo_us": {
   "label": "United States",
   "short": "United States",
   "unit": "usdM",
   "src": "10-K revenue note (geography)",
   "scope": "company",
   "y": {
    "act": {
     "2023": 4245.1,
     "2024": 5645.9,
     "2025": 6060.2
    },
    "summit": {}
   }
  },
  "geo_intl": {
   "label": "International",
   "short": "International",
   "unit": "usdM",
   "src": "10-K revenue note (geography)",
   "scope": "company",
   "y": {
    "act": {
     "2023": 158.5,
     "2024": 140.1,
     "2025": 256.0
    },
    "summit": {}
   }
  }
 },
 "derived": {
  "gbPerRide": {
   "label": "Gross Bookings per ride",
   "short": "$ / ride",
   "unit": "x",
   "num": "gb",
   "den": "rides"
  },
  "revYield": {
   "label": "Revenue as % of Gross Bookings",
   "short": "Revenue / GB",
   "unit": "pct",
   "num": "rev",
   "den": "gb"
  },
  "ridesPerRider": {
   "label": "Rides per Active Rider",
   "short": "Rides / rider",
   "unit": "x",
   "num": "rides",
   "den": "riders"
  },
  "ebitdaMargin": {
   "label": "Adjusted EBITDA as % of Gross Bookings",
   "short": "Adj. EBITDA / GB",
   "unit": "pct",
   "num": "ebitda",
   "den": "gb"
  }
 },
 "overview": {
  "lede": "",
  "tenK": {
   "text": "the Company has determined that it operates as one operating segment.",
   "where": "FY2025 Form 10-K, Note 2 — Summary of Significant Accounting Policies (Segment Information)"
  }
 },
 "customers": {
  "classes": [
   {
    "key": "riders",
    "label": "Riders",
    "where": "FY2025 Form 10-K, Item 1 — Business",
    "text": "Our Lyft mobile application (“Lyft App”) connect riders with drivers for on-demand ride services and supports a variety of other multimodal solutions."
   },
   {
    "key": "drivers",
    "label": "Drivers",
    "where": "FY2025 Form 10-K, Item 1 — Business",
    "text": "We collect service fees and commissions from drivers for their use of our ridesharing marketplace."
   },
   {
    "key": "orgs",
    "label": "Organizations",
    "where": "FY2025 Form 10-K, Item 1 — Business",
    "text": "making our ridesharing marketplace available to organizations through our Lyft Business offerings."
   }
  ],
  "concentration": {
   "disclosed": false,
   "note": "Lyft discloses no customer-concentration figure. Its revenue comes from a very large number of individual riders, and the Concentrations of Credit Risk note in the FY2025 10-K covers cash, cash equivalents and short-term investments, not customers. The absence is the finding: unlike a business-to-business supplier, no single buyer drives the line."
  },
  "cite": {
   "form": "10-K",
   "period": "2025-12-31",
   "accession": "0001628280-26-006960",
   "url": "https://www.sec.gov/Archives/edgar/data/1759509/000162828026006960/"
  },
  "splc": null
 },
 "other": [
  {
   "key": "revline",
   "label": "Revenue line",
   "sub": "marketplace vs rentals",
   "lede": "The same total revenue cut by accounting category. Marketplace and other contract revenue is the core and grew 10% in 2025; rental revenue, from Flexdrive and the shared bikes and scooters, was flat at about $0.42B.",
   "caveat": "Annual only: Lyft discloses this cut in the 10-K and 10-Q revenue note, and the history here is the three years of the FY2025 10-K. Lyft operates as one segment, so no profit exists for either line.",
   "note": "Marketplace and other contracts is revenue under ASC 606 (the ridesharing marketplace, licensing and data access, bike and station sales, advertising, Lyft Business); rentals is revenue under ASC 842. The two sum to reported revenue.",
   "tenK": {
    "text": "The Company also generates rental revenue from Flexdrive and its network of shared bikes and scooters, which is recognized in accordance with ASC 842.",
    "where": "FY2025 Form 10-K, Note 2 — Revenue recognition"
   },
   "cite": {
    "form": "10-K",
    "period": "2025-12-31",
    "accession": "0001628280-26-006960",
    "url": "https://www.sec.gov/Archives/edgar/data/1759509/000162828026006960/"
   },
   "axis": {
    "y": [
     "2023",
     "2024",
     "2025"
    ]
   },
   "views": [
    "y"
   ],
   "series": [
    {
     "key": "rev_mkt",
     "ref": "shared:rev_mkt",
     "label": "Marketplace & other contracts"
    },
    {
     "key": "rev_rent",
     "ref": "shared:rev_rent",
     "label": "Rentals"
    }
   ]
  },
  {
   "key": "geography",
   "label": "Geography",
   "sub": "United States vs International",
   "lede": "The same total revenue cut by where it is earned. The United States is still about 96% of revenue, but International rose from $140M to $256M in 2025 as Freenow closed on 31 July 2025 and consolidated for five months; 2026 will carry the first full year.",
   "caveat": "Annual only, revenue only. Freenow and TBR entered in 2H25, so 2025 is a partial year for International and the comparison with 2024 is not organic.",
   "note": "No individual country outside the United States is broken out in the FY2025 10-K.",
   "tenK": {
    "text": "Revenue by geographic area in the case of the ridesharing marketplace and bikes and scooters is determined by where the transaction occurred.",
    "where": "FY2025 Form 10-K, Note 2 — Revenue by geographic area"
   },
   "cite": {
    "form": "10-K",
    "period": "2025-12-31",
    "accession": "0001628280-26-006960",
    "url": "https://www.sec.gov/Archives/edgar/data/1759509/000162828026006960/"
   },
   "axis": {
    "y": [
     "2023",
     "2024",
     "2025"
    ]
   },
   "views": [
    "y"
   ],
   "series": [
    {
     "key": "geo_us",
     "ref": "shared:geo_us",
     "label": "United States"
    },
    {
     "key": "geo_intl",
     "ref": "shared:geo_intl",
     "label": "International"
    }
   ]
  }
 ],
 "segments": [
  {
   "key": "lyft",
   "label": "Lyft platform (consolidated)",
   "short": "Lyft",
   "summary": "One operating segment: a multimodal mobility platform whose ridesharing marketplace generates substantially all of the revenue.",
   "brief": "Lyft matches riders with independent drivers in an app and keeps a share of each fare, on top of which it runs shared bikes and scooters, rents cars to drivers and, since 2025, operates taxi and chauffeur businesses in Europe and worldwide. Because it reports a single segment, the company does not publish profit by product; what it does publish is how much volume moves through the platform and how much of it becomes revenue.",
   "sells": [
    {
     "name": "Ridesharing marketplace",
     "what": "Connects riders with independent drivers and collects service fees and commissions from drivers. Includes taxis, private hire vehicles, executive chauffeur services and car sharing, and ride options such as Wait & Save, Priority Pickup, XL, Extra Comfort, Black and Black SUV."
    },
    {
     "name": "Express Drive",
     "what": "A car rental program for drivers who lack a qualifying vehicle, through the Flexdrive subsidiary and rental car partners."
    },
    {
     "name": "Bikes and scooters",
     "what": "Shared bikes and scooters in a number of cities for shorter trips; Lyft Urban Solutions also sells bikes and bike station software and hardware."
    },
    {
     "name": "Lyft Business and other",
     "what": "Rides for organizations, licensing and data access agreements and advertising; the 10-K says advertising is not a significant component of revenue."
    }
   ],
   "products": [
    {
     "name": "Ridesharing marketplace",
     "what": "The on-demand ride: a rider requests a trip in the Lyft app and an independent driver accepts. Lyft sets pricing, handles payments and carries the insurance, and keeps a service fee or commission. In 2025 it widened to taxis, private hire vehicles and executive chauffeur services through Freenow and TBR.",
     "customers": {
      "archetype": {
       "text": "Riders paying per trip, and drivers paying service fees and commissions to use the marketplace.",
       "where": "FY2025 Form 10-K, Item 1 — Business"
      },
      "named": [
       {
        "name": "DoorDash",
        "q": "Q2 2026",
        "what": "Largest U.S. partnership; DoorDash-linked rides in the U.S. grew nearly 60% year over year and the partnership expanded to Canada."
       },
       {
        "name": "United",
        "q": "Q2 2026",
        "what": "Lyft appears in the United app; linked Rides grew 41% from Q1 and members have paid for Lyft rides with 170 million miles."
       },
       {
        "name": "Curb",
        "q": "Q2 2026",
        "what": "Taxi partner: riders in New York City may now be matched with a licensed taxi driver, after launches in Los Angeles and San Francisco."
       }
      ],
      "concentration": "No customer concentration is disclosed. About 30% of North American rideshare rides in Q2 2026 were linked to a partner, a record."
     },
     "management": [
      {
       "q": "Q2 2026",
       "text": "Rides increased 11.7% year over year, driven by many growth factors including continued strength in Canada and low-scale markets, growing demand following California's insurance reform, and operational excellence meeting incremental demand like the FIFA World Cup."
      }
     ]
    },
    {
     "name": "Express Drive",
     "what": "Lets a driver without a qualifying car rent one and use it on the Lyft platform. It is the main source of rental revenue under ASC 842, with the shared bikes and scooters.",
     "customers": {
      "archetype": {
       "text": "Drivers who want to drive using the platform but do not have access to a vehicle that meets its requirements.",
       "where": "FY2025 Form 10-K, Item 1 — Business"
      },
      "named": [],
      "concentration": "No customer concentration is disclosed."
     },
     "management": []
    },
    {
     "name": "Bikes and scooters",
     "what": "Bikeshare systems Lyft operates in cities, plus technology for other programs. Lyft Urban Solutions runs six of the largest U.S. bikeshare systems and supplies technology for 55+ programs in 14 countries.",
     "customers": {
      "archetype": {
       "text": "Riders using shared bikes and scooters for shorter trips, and cities and programs that buy bikes and technology.",
       "where": "FY2025 Form 10-K, Item 1 — Business"
      },
      "named": [],
      "concentration": "No customer concentration is disclosed."
     },
     "management": [
      {
       "q": "Q2 2026",
       "text": "Spring and summer are always strong for bikeshare, but this quarter LUS posted its best Q2 rides ever, breaking all-time daily, weekly, and monthly records in June."
      }
     ]
    }
   ],
   "tenK": {
    "text": "Substantially all of our revenue is generated from our ridesharing marketplace that connects drivers and riders.",
    "where": "FY2025 Form 10-K, Item 1 — Business",
    "verbatim": true
   },
   "drivers": {
    "rev": {
     "from": "results:rev"
    },
    "gb": {
     "from": "results:gb"
    },
    "rides": {
     "from": "results:rides"
    },
    "riders": {
     "from": "results:riders"
    },
    "ebitda": {
     "from": "results:ebitda"
    }
   },
   "kpis": [
    {
     "name": "Gross Bookings",
     "definition": "The total dollar value of transactions on the platform. The scale of the marketplace and one of the two lines Lyft guides.",
     "unit": "usdM",
     "periodicity": "Quarterly and annual",
     "source": "MD&A Key Metrics",
     "series": "results:gb",
     "filing": "We define Gross Bookings as the total dollar value of transactions including any applicable taxes, tolls and fees, for rides and other offerings provided by Lyft, excluding tips to drivers.",
     "filingWhere": "FY2025 Form 10-K, Item 7 — Key Metrics",
     "needs": "The definition was simplified in the fourth quarter of 2025; the 10-K says there was no impact to prior periods."
    },
    {
     "name": "Rides",
     "definition": "Completed rides on the multimodal platform. The volume term of the revenue identity.",
     "unit": "count",
     "periodicity": "Quarterly and annual",
     "source": "MD&A Key Metrics",
     "series": "results:rides",
     "filing": "We define Rides as the total number of rides completed on our multimodal platform that contribute to our revenue.",
     "filingWhere": "FY2025 Form 10-K, Item 7 — Key Metrics"
    },
    {
     "name": "Active Riders",
     "definition": "Unique riders in the quarter. A point-in-time level, not a sum across quarters.",
     "unit": "count",
     "periodicity": "Quarterly",
     "source": "MD&A Key Metrics",
     "series": "results:riders",
     "filing": "We define Active Riders as all unique riders who have taken at least one ride during the quarter.",
     "filingWhere": "FY2025 Form 10-K, Item 7 — Key Metrics"
    },
    {
     "name": "Revenue",
     "definition": "GAAP revenue. What Lyft keeps after driver pay and the accounting treatment of insurance and incentives.",
     "unit": "usdM",
     "periodicity": "Quarterly and annual",
     "source": "10-Q / 10-K income statement",
     "series": "results:rev"
    },
    {
     "name": "Adjusted EBITDA",
     "definition": "Lyft’s non-GAAP profit measure and the second line it guides; the margin is read as a percent of Gross Bookings.",
     "unit": "usdM",
     "periodicity": "Quarterly and annual",
     "source": "Non-GAAP reconciliation",
     "series": "results:ebitda"
    }
   ],
   "kpiNote": "Lyft publishes Gross Bookings, Rides and Active Riders for the whole platform and no KPI by product, geography or ride mode. It does not publish a take rate, a price list or a rides-per-rider figure; those are derived here from the three published lines.",
   "interactions": [
    {
     "name": "Rides × Gross Bookings per ride",
     "relation": "Gross Bookings = Rides × Gross Bookings per ride",
     "bridge": "volume",
     "lines": [],
     "why": "Volume splits into how many rides happen and what each is worth. In 2Q26 management said Gross Bookings rose on “higher overall average Gross Bookings per Ride including the addition of Freenow and strong growth in higher value modes”, so price and mix, not only volume, carried the quarter.",
     "data": "Rides and Gross Bookings are both reported; the per-ride value is derived. Lyft publishes no price list and announces no price increases, and the cost side (insurance cost per ride) belongs to Bottom Line ▸ unit economics, not built yet, so the durability of the per-ride value cannot be tested here."
    },
    {
     "name": "Gross Bookings × revenue yield",
     "relation": "Revenue = Gross Bookings × (Revenue ÷ Gross Bookings)",
     "bridge": "yield",
     "lines": [],
     "why": "Revenue is the part of each booking Lyft keeps after driver earnings, and the ratio moves with accounting as well as pricing. 4Q25 revenue carries a legal, tax and regulatory reserve charge booked partly as contra-revenue, which lowers the ratio that quarter without a change in pricing.",
     "data": "Both terms reported; the yield is derived and is not a take rate Lyft discloses."
    },
    {
     "name": "Active Riders × rides per rider",
     "relation": "Rides = Active Riders × Rides per Active Rider",
     "bridge": "frequency",
     "lines": [],
     "why": "Rides grow either because more people ride or because each rider rides more. 2Q26 Active Riders were 30.5M and management described frequency among high-frequency riders as durable.",
     "data": "Both terms reported; frequency is derived. From 3Q25 Active Riders include Freenow riders, so the step up is not organic."
    }
   ],
   "bridges": [
    {
     "key": "volume",
     "label": "Volume × value",
     "view": "q",
     "target": "gb",
     "kind": "decomposition",
     "terms": [
      "rides",
      "gbPerRide"
     ],
     "note": "A decomposition, not an independent build: Gross Bookings per ride is Gross Bookings divided by Rides, so the two terms multiply back to the line by construction. It separates volume from value per ride. Freenow enters both terms from 3Q25."
    },
    {
     "key": "yield",
     "label": "Bookings × yield",
     "view": "q",
     "target": "rev",
     "kind": "decomposition",
     "terms": [
      "gb",
      "revYield"
     ],
     "note": "A decomposition: the yield is revenue divided by Gross Bookings. It mixes pricing with accounting items, notably the 4Q25 contra-revenue reserve charge."
    },
    {
     "key": "frequency",
     "label": "Riders × frequency",
     "view": "q",
     "target": "rides",
     "kind": "decomposition",
     "terms": [
      "riders",
      "ridesPerRider"
     ],
     "note": "A decomposition: rides per rider is Rides divided by Active Riders. Active Riders is a quarterly level."
    }
   ],
   "highlights": [
    "gbPerRide",
    "revYield",
    "ridesPerRider",
    "ebitdaMargin"
   ]
  }
 ]
};
