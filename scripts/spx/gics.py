"""Canonical GICS sectors and industry groups (structure in force since March 2023).

Bloomberg truncates GICS_SECTOR_NAME / GICS_INDUSTRY_GROUP_NAME, so names are never
taken from the export as-is: the numeric code wins (GICS_SECTOR = 2 digits,
GICS_INDUSTRY_GROUP = 4 digits); without a code, a truncated name is matched by prefix
and must resolve to exactly one canonical name, otherwise it is reported.
"""
import re

SECTORS = {
    10: "Energy",
    15: "Materials",
    20: "Industrials",
    25: "Consumer Discretionary",
    30: "Consumer Staples",
    35: "Health Care",
    40: "Financials",
    45: "Information Technology",
    50: "Communication Services",
    55: "Utilities",
    60: "Real Estate",
}

INDUSTRY_GROUPS = {
    1010: "Energy",
    1510: "Materials",
    2010: "Capital Goods",
    2020: "Commercial & Professional Services",
    2030: "Transportation",
    2510: "Automobiles & Components",
    2520: "Consumer Durables & Apparel",
    2530: "Consumer Services",
    2550: "Consumer Discretionary Distribution & Retail",
    3010: "Consumer Staples Distribution & Retail",
    3020: "Food, Beverage & Tobacco",
    3030: "Household & Personal Products",
    3510: "Health Care Equipment & Services",
    3520: "Pharmaceuticals, Biotechnology & Life Sciences",
    4010: "Banks",
    4020: "Financial Services",
    4030: "Insurance",
    4510: "Software & Services",
    4520: "Technology Hardware & Equipment",
    4530: "Semiconductors & Semiconductor Equipment",
    5010: "Telecommunication Services",
    5020: "Media & Entertainment",
    5510: "Utilities",
    6010: "Equity Real Estate Investment Trusts (REITs)",
    6020: "Real Estate Management & Development",
}


def _norm(s):
    s = re.sub(r"(\.\.\.|…)$", "", str(s or "").strip())
    return re.sub(r"[^a-z0-9]+", " ", s.lower().replace("&", " and ")).strip()


def resolve(code=None, name=None, table=INDUSTRY_GROUPS):
    """Full canonical name from a code (preferred) or a possibly truncated name."""
    if code not in (None, ""):
        c = int(float(code))
        if c not in table:
            raise ValueError(f"unknown GICS code {code}")
        return table[c]
    n = _norm(name)
    hits = [v for v in table.values() if _norm(v) == n] or \
           [v for v in table.values() if _norm(v).startswith(n)]
    if len(hits) != 1:
        raise ValueError(f"GICS name {name!r} matches {hits or 'nothing'}")
    return hits[0]


def sector_of(ig_code):
    return SECTORS[int(float(ig_code)) // 100]
