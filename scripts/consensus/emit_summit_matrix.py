"""Emit the SUMMIT side of estMatrix from Summit-MCP snapshot dumps.

Contract: docs/RESULTS_CONVENTIONS.md 8. Companion to emit_matrix.py, which builds the
CONSENSUS side from the Bloomberg workbook.

The input is not a file on disk anywhere in the team's Drive: it is one saved
`get_fundamentals` response per model snapshot, pulled through the Summit MCP (Claude-side).
Save each response verbatim (the tool writes the big ones to a file already) into one folder
and point this script at it:

    py emit_summit_matrix.py UBER map_summit_uber.json <dump-dir>
    # -> out/estmatrix_summit_uber.js

Each dump is either {"result": "<json string>"} (the harness's saved tool result) or the raw
{"data": [...], "metadata": {...}} payload. Rows are grouped by the `snapshot_date` they
carry, so the file names do not matter and one dump may hold several snapshots.

Pull recipe (per snapshot, so the dumps stay small enough to be worth saving):
    get_fundamentals(ticker, snapshot_date=<vintage id>, sheet_sources=['projection_history'],
                     metric_ids=[...the UUIDs behind `metrics` in the config...],
                     period_keys=[...ONLY the periods forward of that vintage's lastActual...])

Why forward-only: a snapshot is an ESTIMATE only for periods after its own last reported one.
Its projection_history also holds frozen projections for already-reported quarters, but those
belong to whatever vintage stood before THAT print, not to this one - storing them here would
date them wrong. Periods before a vintage's lastActual are therefore absent by construction,
and `preprint` mode falls back to the dataset's hand-authored flat array for them.

A literal 0 means "row never populated" in these models (guidance rows, the Aug-2026 EBITDA
rows, the annual OP_INCOME rows). Zeros are dropped to null and reported, never emitted.
"""

import json
import os
import re
import sys
from collections import defaultdict

Q_RE = re.compile(r"^(\d{4})Q([1-4])$")


def canon_period(period_key):
    """'2026Q3' -> ('q', '3Q26'); '2026' -> ('y', '2026')."""
    m = Q_RE.match(period_key)
    if m:
        year, q = m.group(1), m.group(2)
        return "q", "%sQ%s" % (q, year[2:])
    if re.match(r"^\d{4}$", period_key):
        return "y", period_key
    return None, None


def load_rows(path):
    with open(path, "r", encoding="utf-8") as fh:
        blob = json.load(fh)
    if isinstance(blob, dict) and "result" in blob and isinstance(blob["result"], str):
        blob = json.loads(blob["result"])
    return blob.get("data", [])


def collect(dump_dir, prefer_source):
    """(snapshot, view, period, METRIC_LABEL) -> value, plus the conflicts found.

    A cell can arrive twice under different `source` tags (UBER's annual FCF: a DEFAULT row and
    a SEGM segment build-up that disagree by ~6%). `prefer_source` decides, deterministically,
    and every resolved conflict is reported rather than swallowed."""
    vals, conflicts, zeros = {}, [], []
    rank = {name: i for i, name in enumerate(prefer_source)}
    files = sorted(
        os.path.join(dump_dir, f) for f in os.listdir(dump_dir)
        if f.lower().endswith((".txt", ".json"))
    )
    if not files:
        sys.exit("no dumps found in %s" % dump_dir)
    for path in files:
        for row in load_rows(path):
            if row.get("sheet_source") != "projection_history":
                continue
            view, period = canon_period(row.get("period_key", ""))
            if not view:
                continue
            key = (row["snapshot_date"], view, period, row["metric_label"])
            try:
                value = float(row["value"])
            except (TypeError, ValueError):
                continue
            if value == 0:
                zeros.append(key)
                continue
            src = row.get("source")
            if key in vals:
                if abs(vals[key][0] - value) <= 1e-9:
                    continue
                conflicts.append((key, vals[key], (value, src)))
                if rank.get(src, 99) >= rank.get(vals[key][1], 99):
                    continue                      # the incumbent is the preferred source
            vals[key] = (value, src)
    return {k: v[0] for k, v in vals.items()}, conflicts, zeros, files


def fmt(value, decimals):
    out = round(value, decimals)
    return repr(int(out)) if out == int(out) else repr(out)


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    ticker, cfg_path, dump_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    with open(cfg_path, "r", encoding="utf-8") as fh:
        cfg = json.load(fh)

    vals, conflicts, zeros, files = collect(dump_dir, cfg.get("prefer_source", []))
    metrics, derived = cfg["metrics"], cfg.get("derived", {})
    decimals, axis = cfg.get("decimals", {}), cfg["axis"]
    vintages = cfg["vintages"]
    known = {v["id"] for v in vintages}

    seen_snaps = sorted({k[0] for k in vals})
    unknown = [s for s in seen_snaps if s not in known]
    if unknown:
        print("!! dumps carry snapshots not declared in the config: %s" % ", ".join(unknown))

    # (view, dataset key, vintage id) -> {period: value}
    cells = defaultdict(dict)
    for view in ("q", "y"):
        for mkey in cfg["views"][view]:
            for v in vintages:
                row = {}
                for period in axis[view]:
                    # FORWARD-ONLY, enforced here rather than by how the pull was framed. A
                    # dump that also carries already-reported periods (the evolution pull does)
                    # must not leak them into the matrix: a snapshot is an estimate for nothing
                    # it already knew, and dating those cells to this snapshot would be wrong.
                    if not (order(view, v["lastActual"][view]) < order(view, period)):
                        continue
                    if mkey in derived:
                        parts = [vals.get((v["id"], view, period, lbl)) for lbl in derived[mkey]]
                        value = sum(parts) if all(p is not None for p in parts) else None
                    else:
                        value = vals.get((v["id"], view, period, metrics[mkey]))
                    if value is not None:
                        row[period] = value
                if row:
                    cells[(view, mkey, v["id"])] = row

    dec_default = decimals.get("_default", 1)
    lines = ["    summit: {", "      vintages: ["]
    for v in vintages:
        lines.append(
            "        { id: '%s', label: '%s', lastActual: { q: '%s', y: '%s' } },"
            % (v["id"], v["label"], v["lastActual"]["q"], v["lastActual"]["y"])
        )
    lines.append("      ],")
    for view in ("q", "y"):
        lines.append("      %s: {" % view)
        for mkey in cfg["views"][view]:
            rows = [(v["id"], cells[(view, mkey, v["id"])]) for v in vintages
                    if cells.get((view, mkey, v["id"]))]
            if not rows:
                print("-- no cells at all for %s.%s (every vintage empty or zero)" % (view, mkey))
                continue
            lines.append("      %s: {" % mkey)
            dec = decimals.get(mkey, dec_default)
            for vid, row in rows:
                body = ", ".join("'%s': %s" % (p, fmt(row[p], dec)) for p in axis[view] if p in row)
                lines.append("        '%s': { %s }," % (vid, body))
            lines.append("      },")
        lines.append("      },")
    lines.append("    },")
    block = "\n".join(lines) + "\n"

    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "estmatrix_summit_%s.js" % ticker.lower())
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(block)

    print("read %d dump file(s), %d facts, snapshots: %s"
          % (len(files), len(vals), ", ".join(seen_snaps)))
    print("wrote %s (%d lines)" % (out_path, len(lines)))
    if conflicts:
        print("!! %d cell(s) had two different values from different `source` tags:" % len(conflicts))
        for key, a, b in conflicts[:20]:
            print("   %s  %s vs %s" % (key, a, b))
    if zeros:
        by_metric = defaultdict(list)
        for snap, view, period, label in zeros:
            by_metric[label].append("%s@%s" % (period, snap))
        print("-- dropped %d literal-zero cell(s) (never-populated model rows):" % len(zeros))
        for label in sorted(by_metric):
            print("   %-18s %s" % (label, " ".join(sorted(by_metric[label]))))

    # The acceptance check (docs/RESULTS_CONVENTIONS.md 8.4 step 3): resolve `preprint` off the
    # matrix exactly the way the engine does, and diff it against the flat `summit` array the
    # dataset already ships. Every mismatch is rounding, a genuine refresh, or a bug - classify
    # each one before pasting the block.
    js_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                           "js", "results-data", "%s.js" % ticker.lower())
    js = open(os.path.normpath(js_path), encoding="utf-8").read()
    print("\n=== derived pre-print  vs  shipped summit ===")
    for view in ("q", "y"):
        for mkey in cfg["views"][view]:
            periods, shipped_arr = shipped(js, view, mkey, "summit")
            _, act = shipped(js, view, mkey, "act")
            if periods is None:
                print("  %s.%-7s NOT FOUND in the dataset" % (view, mkey))
                continue
            dec = decimals.get(mkey, dec_default)
            # The dataset rounds (annual rows to integers), so a sub-unit gap is rounding, not a
            # revision. EPS needs a tight one; a DERIVED sum inherits its components' rounding.
            tol = 0.51 if dec <= 1 else 0.0011
            if mkey in derived:
                tol *= len(derived[mkey])
            ok, uncovered, stale, notes = 0, 0, [], []
            for i, period in enumerate(periods):
                best = None
                for v in vintages:
                    row = cells.get((view, mkey, v["id"]))
                    if not row or period not in row:
                        continue
                    last = order(view, v["lastActual"][view])
                    if not (last < order(view, period)):
                        continue
                    if best is None or last > best[0] or (last == best[0] and v["id"] > best[1]):
                        best = (last, v["id"], row[period])
                got = round(best[2], dec) if best else None
                want = shipped_arr[i] if shipped_arr and i < len(shipped_arr) else None
                reported = bool(act) and i < len(act) and act[i] is not None
                if got is None and want is None:
                    continue
                if got is None:
                    # Expected for every period already reported when the OLDEST snapshot was
                    # saved: no vintage can date it. The frozen flat series covers those.
                    uncovered += 1
                elif want is None:
                    notes.append("%s: js=- matrix=%s (%s) FILLS A HOLE" % (period, got, best[1]))
                elif abs(got - want) <= tol:
                    ok += 1
                elif reported:
                    # The dataset carries the projection the model FROZE at the print; the matrix
                    # can only see saved snapshots. They diverge by however much the model moved
                    # between its last save and the print. The frozen one stays authoritative.
                    stale.append("%s js=%s vs %s(%s)" % (period, want, got, best[1][5:]))
                else:
                    notes.append("%s: js=%s matrix=%s (%s) DIFF ON A FORWARD PERIOD"
                                 % (period, want, got, best[1]))
            print("  %s.%-7s %2d match · %2d uncovered (pre-snapshot history)%s"
                  % (view, mkey, ok, uncovered,
                     ("  · frozen-vs-saved: " + "; ".join(stale)) if stale else ""))
            for n in notes:
                print("        %s" % n)


def shipped(js, view_key, mkey, arr_name):
    """Pull periods[] and one series out of js/results-data/<tk>.js (same approach as
    verify_preprint.py, which reads the `cons` side)."""
    marker = "\n    %s: {" % view_key
    if marker not in js:
        return None, None
    vi = js.index(marker)
    vend = js.index("\n    },", vi)
    blk = js[vi:vend]
    mi = blk.find("\n        %s: {" % mkey)
    if mi < 0:
        return None, None
    mend = blk.find("\n        ", mi + 10)
    while mend > 0 and not re.match(r"\n        \w+: \{", blk[mend:mend + 40]):
        nxt = blk.find("\n        ", mend + 1)
        if nxt < 0:
            break
        mend = nxt
    mb = blk[mi:mend if mend > 0 else len(blk)]

    def arr(name):
        m = re.search(name + r":\s*\[([^\]]*)\]", mb)
        if not m:
            return None
        out = []
        for x in m.group(1).split(","):
            x = x.strip()
            if not x:
                continue
            out.append(None if x == "null" else (x.strip("\"'") if x[0] in "\"'" else float(x)))
        return out

    return arr("periods"), arr(arr_name)


def order(view, period):
    if view == "q":
        m = re.match(r"^([1-4])Q(\d{2})$", period)
        return (2000 + int(m.group(2))) * 4 + int(m.group(1)) if m else -10 ** 9
    return int(period) if re.match(r"^\d{4}$", period) else -10 ** 9


if __name__ == "__main__":
    main()
