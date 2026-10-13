#!/usr/bin/env python3
"""
holdings_ytd.py: current-year YTD price return for every holding shown on the
Hedge Funds ▸ Superinvestors cards, written to js/hf-holdings-ytd.js.

Same cut-off and definition as the S&P 500 panel: price return (no dividends) from
the last close of the previous year to the cut-off of js/spx-data.js.
  - S&P 500 members: taken from js/spx-data.js (the analyst's Bloomberg extract).
  - Everything else (ADRs, foreign listings, ETFs, recent IPOs): the analyst's Bloomberg
    closes in scripts/spx/hf_bbg_prices.json when they cover the same dates; otherwise
    Yahoo Finance daily "close" (split-adjusted, NOT "adj close"). Yahoo matched
    Bloomberg to the cent except TEVA (Dec 31: 31.21 vs 28.61) and WBD (no Dec 31).
  - A 2026 IPO listed in the json's "ipo" block: return from the first-day open,
    flagged sinceIpo so the page labels it (it is not a YTD).
  - No price at the previous year-end (e.g. a 2026 IPO) or none at the cut-off
    (delisted / acquired): stored as null with a note; the page shows n/a.

Run after scripts/spx/extract_spx.py, whenever the cut-off moves:
  python scripts/spx/holdings_ytd.py            # dry run
  python scripts/spx/holdings_ytd.py --write
"""
import argparse, datetime as dt, json, os, re, sys, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "js", "hf-holdings-ytd.js")


def load_js_object(path, marker):
    src = open(path, encoding="utf-8").read()
    i = src.index(marker)
    start = src.index("{" if marker.endswith("{") or "SPX_DATA" in marker else "[", i)
    # the generated files are one JSON literal per line
    line_end = src.index("\n", start)
    return json.loads(src[start:line_end].rstrip().rstrip(";"))


def holdings_tickers():
    """Tickers (and names) of every holding on the investor cards (INVESTORS in portal-data.js)."""
    line = next(l for l in open(os.path.join(ROOT, "js", "portal-data.js"), encoding="utf-8")
                if l.startswith("export const INVESTORS="))
    out = {}
    for t, co in re.findall(r'"t":\s*"([A-Z0-9.\-]+)",\s*"co":\s*"([^"]*)"', line):
        out.setdefault(t, co)
    return out


def yahoo_closes(ticker, d0, d1):
    p1 = int(dt.datetime.fromisoformat(d0).replace(tzinfo=dt.timezone.utc).timestamp()) - 6 * 86400
    p2 = int(dt.datetime.fromisoformat(d1).replace(tzinfo=dt.timezone.utc).timestamp()) + 86400
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?period1={p1}&period2={p2}&interval=1d"
    r = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30))
    r = r["chart"]["result"][0]
    days = [dt.datetime.fromtimestamp(ts, dt.timezone.utc).date().isoformat() for ts in r.get("timestamp", [])]
    return {d: c for d, c in zip(days, r["indicators"]["quote"][0].get("close", [])) if c}


def last_on_or_before(closes, day, not_before=None):
    ds = [d for d in closes if d <= day and (not_before is None or d >= not_before)]
    return (max(ds), closes[max(ds)]) if ds else (None, None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    a = ap.parse_args()

    spx = load_js_object(os.path.join(ROOT, "js", "spx-data.js"), "SPX_DATA")
    as_of, year = spx["asOf"], spx["year"]
    base_day = f"{year - 1}-12-31"
    members = {m["t"]: m for m in spx["members"]}

    bbg = json.load(open(os.path.join(os.path.dirname(__file__), "hf_bbg_prices.json"), encoding="utf-8"))
    bbg_ok = bbg.get("base") == base_day and bbg.get("asOf") == as_of
    if not bbg_ok:
        print(f"note: hf_bbg_prices.json is for {bbg.get('base')} -> {bbg.get('asOf')}, not {base_day} -> {as_of}: Yahoo only")

    items, rows = {}, []
    for t, co in sorted(holdings_tickers().items()):
        if t in members:
            v = members[t].get("r" + str(year)[2:])
            items[t] = {"ytd": v, "src": "Bloomberg"}
            rows.append((t, co, v, "Bloomberg (S&P 500 extract)", ""))
            continue
        if bbg_ok and t in bbg["prices"]:
            p0, p1 = bbg["prices"][t]
            v = round((p1 / p0 - 1) * 100, 2)
            items[t] = {"ytd": v, "src": "Bloomberg", "p0": p0, "p1": p1}
            rows.append((t, co, v, "Bloomberg (analyst check)", ""))
            continue
        if bbg_ok and t in bbg.get("ipo", {}):
            ipo = bbg["ipo"][t]
            v = round((ipo["last"] / ipo["open"] - 1) * 100, 2)
            items[t] = {"ytd": v, "src": "Bloomberg", "sinceIpo": ipo["date"], "p0": ipo["open"], "p1": ipo["last"],
                        "note": f"listed {ipo['date']}: return since the first-day open, not YTD"}
            rows.append((t, co, v, "Bloomberg (since IPO)", items[t]["note"]))
            continue
        note = ""
        try:
            closes = yahoo_closes(t, base_day, as_of)
        except Exception as e:  # network / unknown ticker
            closes, note = {}, f"no Yahoo data ({str(e)[:40]})"
        d0, p0 = last_on_or_before(closes, base_day, not_before=f"{year - 1}-12-20")
        d1, p1 = last_on_or_before(closes, as_of, not_before=f"{as_of[:8]}01")
        v = None
        if p0 is None and closes:
            note = f"no {year - 1} year-end price (first trade {min(closes)})"
        elif p1 is None and closes:
            note = f"no price near {as_of} (last {max(closes)}: delisted or acquired?)"
        elif p0 and p1:
            v = round((p1 / p0 - 1) * 100, 2)
            if d1 != as_of:
                note = f"last close {d1}"
        items[t] = {"ytd": v, "src": "Yahoo", "p0": p0 and round(p0, 4), "p1": p1 and round(p1, 4)}
        if note:
            items[t]["note"] = note
        rows.append((t, co, v, "Yahoo close", note))

    print(f"cut-off {as_of} · base {base_day} · {len(rows)} tickers")
    for t, co, v, s, note in rows:
        print(f"  {t:<6} {co[:28]:<28} {'n/a' if v is None else f'{v:+.2f}%':>9}  {s}{'  ! ' + note if note else ''}")
    if not a.write:
        print("\n(dry run, nothing written: add --write)")
        return
    out = {"asOf": as_of, "base": base_day, "items": items}
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generated by scripts/spx/holdings_ytd.py -- do not edit by hand.\n")
        f.write("export const HF_HOLDINGS_YTD = " + json.dumps(out, separators=(",", ":")) + ";\n")
    print(f"\nwrote {os.path.relpath(OUT, ROOT)}")


if __name__ == "__main__":
    main()
