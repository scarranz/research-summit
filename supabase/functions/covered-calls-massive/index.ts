import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MASSIVE_API = "https://api.massive.com";
const MASSIVE_KEY = Deno.env.get("MASSIVE_API_KEY") || "";

// Covered Calls — Massive proxy. Ports covered-calls/server.ps1: serves the
// option chain, equity snapshot/details/ratios, and FX previous close from
// Massive, injecting the API key server-side. Only an allowlisted set of
// resources/params is forwarded. Requires an authenticated portal user.
const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const TICKER_RE = /^[A-Z0-9.\-]{1,10}$/;
const enc = (v: unknown) => encodeURIComponent(String(v));

// resource -> Massive path. {t} = validated ticker. `p` is the caller's params;
// only the keys listed per resource are ever forwarded (everything else dropped).
function resolveRoute(resource: string, t: string, p: Record<string, unknown>): string | null {
  switch (resource) {
    case "details":  return `/v3/reference/tickers/${t}`;
    case "snapshot": return `/v2/snapshot/locale/us/markets/stocks/tickers/${t}`;
    case "ratios":   return `/stocks/financials/v1/ratios?ticker=${t}&limit=1`;
    case "fx":       return `/v2/aggs/ticker/C:${t}/prev?adjusted=true`;
    case "chain": {
      const keys = ["contract_type", "expiration_date", "strike_price", "strike_price.gte", "strike_price.lte", "limit", "order", "sort"];
      const qs = keys.filter((k) => p[k] != null && p[k] !== "").map((k) => `${k}=${enc(p[k])}`);
      return `/v3/snapshot/options/${t}${qs.length ? "?" + qs.join("&") : ""}`;
    }
    case "expirations": {
      const base = [`underlying_ticker=${t}`, "contract_type=call", "expired=false", "limit=1000", "sort=expiration_date", "order=asc"];
      for (const k of ["expiration_date.gte", "expiration_date.lte", "strike_price.gte", "strike_price.lte"]) {
        if (p[k] != null && p[k] !== "") base.push(`${k}=${enc(p[k])}`);
      }
      return `/v3/reference/options/contracts?${base.join("&")}`;
    }
    default: return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });

  // Verify the caller is an authenticated user
  const authToken = (req.headers.get("authorization") || "").replace("Bearer ", "");
  if (!authToken) return json({ error: "Unauthorized" }, 401);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(authToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);

  try {
    const body = await req.json().catch(() => ({}));
    const resource = String(body.resource || "");
    const ticker = String(body.ticker || "").toUpperCase();
    const params = (body.params && typeof body.params === "object") ? body.params : {};
    if (!TICKER_RE.test(ticker)) return json({ error: "invalid ticker" }, 400);
    const route = resolveRoute(resource, ticker, params);
    if (!route) return json({ error: `resource not allowed: ${resource}` }, 400);

    const resp = await fetch(MASSIVE_API + route, { headers: { Authorization: `Bearer ${MASSIVE_KEY}` } });
    // Pass Massive's JSON and status through unchanged.
    const text = await resp.text();
    return new Response(text, { status: resp.status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
