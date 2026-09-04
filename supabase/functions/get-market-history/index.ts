import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MASSIVE_API = "https://api.massive.com";
const MASSIVE_KEY = Deno.env.get("MASSIVE_API_KEY") || "";

// Market-history proxy. Two Massive routes, key injected server-side:
//   prices — daily close history (Polygon-shape aggs range), for a market-implied multiple chart.
//            Same URL family as the `fx` resource already proven in covered-calls-massive
//            (/v2/aggs/ticker/C:{t}/prev) — this is /range instead of /prev.
//   ratios — quarterly market_cap / enterprise_value / price history. Same
//            /stocks/financials/v1/ratios call covered-calls-massive already uses (there, with
//            limit=1 for a single live quote); here with timeframe=quarterly and a real limit, so
//            it is a parameter change on a proven route, not a new schema. shares = market_cap ÷
//            price; net debt = enterprise_value − market_cap, per quarter.
// No DB write — computed on the fly, like get-margins. First consumer: the AMZN Historic Multiple
// Deep Dive pane (js/overviews/amzn-histmult.js); generic for any ticker.
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
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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
    if (!TICKER_RE.test(ticker)) return json({ error: "invalid ticker" }, 400);

    let url: string;
    if (resource === "prices") {
      const from = String(body.from || "");
      const to = String(body.to || "");
      if (!DATE_RE.test(from) || !DATE_RE.test(to)) return json({ error: "invalid from/to (expect YYYY-MM-DD)" }, 400);
      url = `${MASSIVE_API}/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=50000`;
    } else if (resource === "ratios") {
      const limit = Math.min(Math.max(parseInt(String(body.limit ?? ""), 10) || 20, 1), 100);
      // covered-calls-massive's proven `ratios` call uses the singular `ticker=`; income/cash-flow
      // statements (get-margins) use the plural `tickers=`. Send both — an unrecognized param is
      // normally just ignored — rather than guess which this route actually reads.
      url = `${MASSIVE_API}/stocks/financials/v1/ratios?ticker=${ticker}&tickers=${ticker}&timeframe=quarterly&limit=${limit}&sort=fiscal_year.desc`;
    } else {
      return json({ error: `resource not allowed: ${resource}` }, 400);
    }

    const resp = await fetch(url, { headers: { Authorization: `Bearer ${MASSIVE_KEY}` } });
    // Pass Massive's JSON through unchanged — the caller parses its own shape.
    const text = await resp.text();
    return new Response(text, { status: resp.status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
