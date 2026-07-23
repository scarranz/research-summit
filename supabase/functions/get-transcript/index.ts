import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Earnings-call transcript proxy (Fiscal.ai Investor Relations endpoints).
// Generic — works for ANY ticker the Fiscal.ai plan covers; no per-company setup.
//   ?ticker=MA                       → list the company's IR events (earnings calls + eventKeys)
//   ?ticker=MA&eventKey=q2-2026     → structured transcript for that call
// Coverage is limited only by the Fiscal.ai plan (free tier: restricted company
// list; paid plan: 100K+ companies — no change needed here when upgrading).

const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

const FISCAL_API = "https://api.fiscal.ai";
const FISCAL_KEY = Deno.env.get("FISCAL_AI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });

  // Verify the caller is an authenticated user
  const authHeader = req.headers.get("authorization") || "";
  const authToken = authHeader.replace("Bearer ", "");
  if (!authToken) return json({ error: "Unauthorized" }, 401);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(authToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);

  try {
    // Accept ?ticker=MA&eventKey=q2-2026 (GET) or { ticker, eventKey } (POST).
    const u = new URL(req.url);
    let ticker = u.searchParams.get("ticker") || "";
    let eventKey = u.searchParams.get("eventKey") || "";
    if (!ticker && req.method === "POST") {
      try {
        const body = await req.json();
        ticker = body?.ticker || "";
        eventKey = body?.eventKey || "";
      } catch { /* ignore */ }
    }
    ticker = ticker.toUpperCase();
    if (!ticker || !/^[A-Z0-9.\-]{1,10}$/.test(ticker)) {
      return json({ error: "Invalid or missing ticker" }, 400);
    }
    // eventKey format: q{quarter}-{year} (e.g. q2-2026); keep validation permissive
    // but safe in case Fiscal.ai adds other event types later.
    if (eventKey && !/^[a-zA-Z0-9\-]{1,24}$/.test(eventKey)) {
      return json({ error: "Invalid eventKey format" }, 400);
    }

    // No eventKey → list the company's IR events (so the caller can pick one).
    // With eventKey → fetch that call's structured transcript.
    const path = eventKey
      ? `/v1/company/ir-events/transcript/${encodeURIComponent(eventKey)}`
      : "/v1/company/ir-events";
    const url = new URL(path, FISCAL_API);
    url.searchParams.set("ticker", ticker);

    const resp = await fetch(url.toString(), { headers: { "X-Api-Key": FISCAL_KEY } });
    const text = await resp.text();

    if (!resp.ok) {
      // Plan limitation (company not on our Fiscal.ai tier) → clean signal, not a hard error.
      if (
        resp.status === 403 ||
        text.includes("not available") || text.includes("free plan") || text.includes("upgrade")
      ) {
        return json({ ticker, eventKey: eventKey || null, unavailable: true, upstreamStatus: resp.status });
      }
      return json({ error: `Fiscal.ai ${resp.status}`, upstreamStatus: resp.status }, 502);
    }

    let data: unknown;
    try { data = JSON.parse(text); } catch { data = text; }
    return json({ ticker, eventKey: eventKey || null, unavailable: false, data });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
