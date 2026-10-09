import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MASSIVE_API = "https://api.massive.com";
const MASSIVE_KEY = Deno.env.get("MASSIVE_API_KEY") || "";
const INGEST_KEY = Deno.env.get("NDX_INGEST_KEY") || "";

// NDX 100 Return Attribution data (Market Analysis ▸ Nasdaq-100 Analysis).
// The data lives in the ndx_snapshots table (sql/025_ndx_attribution.sql); every refresh
// inserts a new row and the portal always reads the newest one, so nothing changes until
// someone refreshes — and an older row is the rollback.
//
//   { action: 'get' }              any signed-in user  → newest snapshot { meta, hocs }
//   { action: 'ingest', hocs, … }  x-ndx-ingest-key    → full upload from the Excel extractor
//                                                        (scripts/ndx/extract_ndx.py --upload);
//                                                        the open HOC is re-priced before saving
//   { action: 'refresh-prices' }   x-ndx-ingest-key    → re-price only the open HOC of the newest
//                                                        snapshot and save it as a new row
//
// Closed HOCs keep the returns from the Excel (prices the analyst supplies). The open HOC's
// return per name = latest close ÷ close on the HOC's prev-close date − 1, both from Massive's
// grouped daily bars (adjusted=true, so a split inside the HOC cannot fake a return). That is
// two Massive calls for the whole index. A name Massive does not return keeps its Excel return
// and is listed in meta.priceMissing.
const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ndx-ingest-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TICKER_RE = /^\$?[A-Za-z0-9.\-/ ]{1,40}$/;   // '$' prefix = cash / futures line (not priced)

type Sec = { t: string; co: string; w: number; wi: number; r: number; s: string; g: string; p0?: number | null; p1?: number | null };
type Hoc = { n: number; eff: string; prev: string; close: string | null; sec: Sec[] };

function safeEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// Light structural validation of an uploaded HOC list
function validateHocs(hocs: unknown): string | null {
  if (!Array.isArray(hocs) || !hocs.length) return "hocs must be a non-empty array";
  let lastN = 0;
  for (const h of hocs as Hoc[]) {
    if (typeof h.n !== "number" || h.n <= lastN) return `HOC numbers must increase (at ${h.n})`;
    lastN = h.n;
    if (!DATE_RE.test(h.eff) || !DATE_RE.test(h.prev)) return `HOC ${h.n}: bad eff/prev date`;
    if (h.close !== null && !DATE_RE.test(String(h.close))) return `HOC ${h.n}: bad close date`;
    if (!Array.isArray(h.sec) || !h.sec.length) return `HOC ${h.n}: no securities`;
    for (const s of h.sec) {
      if (!TICKER_RE.test(String(s.t))) return `HOC ${h.n}: bad ticker ${s.t}`;
      if (![s.w, s.wi, s.r].every((v) => typeof v === "number" && isFinite(v))) return `HOC ${h.n} ${s.t}: non-numeric w/wi/r`;
    }
  }
  const open = (hocs as Hoc[]).filter((h) => !h.close);
  if (open.length > 1) return "more than one open HOC";
  if (open.length && open[0] !== (hocs as Hoc[])[(hocs as Hoc[]).length - 1]) return "the open HOC must be the last one";
  return null;
}

// Massive grouped daily bars for one date → { TICKER: close }
async function groupedCloses(date: string): Promise<Record<string, number>> {
  const url = `${MASSIVE_API}/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${MASSIVE_KEY}` } });
  if (!resp.ok) throw new Error(`Massive grouped ${date} returned ${resp.status}`);
  const body = await resp.json();
  const out: Record<string, number> = {};
  for (const r of body?.results || []) if (r?.T && typeof r.c === "number") out[r.T] = r.c;
  return out;
}

function isoDay(d: Date) { return d.toISOString().slice(0, 10); }

// Re-price the open HOC (if any) in place; returns the meta fields to store
async function priceOpenHoc(hocs: Hoc[]) {
  const open = hocs.find((h) => !h.close);
  if (!open) return { pricesAsOf: null, priceSource: null, priceMissing: [] as string[] };
  if (!MASSIVE_KEY) throw new Error("MASSIVE_API_KEY is not set");

  const base = await groupedCloses(open.prev);
  if (!Object.keys(base).length) throw new Error(`Massive has no closes for the HOC prev-close date ${open.prev}`);

  // Latest completed session: walk back from today (max 10 days) to the first date with bars
  let latest: Record<string, number> = {}, latestDate = "";
  const d = new Date();
  for (let i = 0; i < 10; i++) {
    const day = isoDay(d);
    if (day <= open.prev) break;
    const c = await groupedCloses(day);
    if (Object.keys(c).length) { latest = c; latestDate = day; break; }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  if (!latestDate) return { pricesAsOf: open.prev, priceSource: "Massive (no session since prev close)", priceMissing: [] as string[] };

  const missing: string[] = [];
  for (const s of open.sec) {
    if (s.t.startsWith("$")) continue;                     // cash / futures: keep as is
    const sym = s.t.replace("/", ".");
    const c0 = base[sym], c1 = latest[sym];
    if (typeof c0 === "number" && typeof c1 === "number" && c0 > 0) {
      s.r = Math.round((c1 / c0 - 1) * 1e6) / 1e6;
      s.p1 = c1;
    } else {
      missing.push(s.t);
    }
  }
  return { pricesAsOf: latestDate, priceSource: "Massive", priceMissing: missing };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "get");

  try {
    if (action === "get") {
      // Any signed-in user
      const authToken = (req.headers.get("authorization") || "").replace("Bearer ", "");
      if (!authToken) return json({ error: "Unauthorized" }, 401);
      const { data: { user }, error: authErr } = await supabase.auth.getUser(authToken);
      if (authErr || !user) return json({ error: "Unauthorized" }, 401);

      const { data, error } = await supabase.from("ndx_snapshots")
        .select("id, created_at, data").order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return json({ error: "no snapshot yet" }, 404);
      return json({ ...data.data, meta: { ...(data.data.meta || {}), snapshotId: data.id, savedAt: data.created_at } });
    }

    // Writes need the ingest key (held by the analyst's extractor, set by San/Oscar as a secret)
    if (!safeEqual(req.headers.get("x-ndx-ingest-key") || "", INGEST_KEY)) return json({ error: "Forbidden" }, 403);

    let hocs: Hoc[], meta: Record<string, unknown>, source: string;
    if (action === "ingest") {
      const bad = validateHocs(body.hocs);
      if (bad) return json({ error: bad }, 400);
      hocs = body.hocs as Hoc[];
      meta = { extractedAt: String(body.extractedAt || "").slice(0, 10) || null, sourceFile: String(body.sourceFile || "").slice(0, 200) || null };
      source = "excel";
    } else if (action === "refresh-prices") {
      const { data, error } = await supabase.from("ndx_snapshots")
        .select("data").order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return json({ error: "no snapshot to refresh — ingest first" }, 404);
      hocs = data.data.hocs; meta = { ...(data.data.meta || {}) };
      source = "prices";
    } else {
      return json({ error: `unknown action ${action}` }, 400);
    }

    const priced = await priceOpenHoc(hocs);
    const last = hocs[hocs.length - 1];
    const fullMeta = { ...meta, ...priced, latestDate: last.eff, totalHocs: hocs.length };
    const { data: row, error: insErr } = await supabase.from("ndx_snapshots").insert({
      source,
      extracted_at: fullMeta.extractedAt || null,
      prices_as_of: priced.pricesAsOf,
      hoc_count: hocs.length,
      note: String(body.note || "").slice(0, 500) || null,
      data: { meta: fullMeta, hocs },
    }).select("id, created_at").single();
    if (insErr) throw new Error(insErr.message);

    return json({ ok: true, snapshotId: row.id, savedAt: row.created_at, meta: fullMeta });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
