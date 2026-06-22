import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const FISCAL_API = "https://api.fiscal.ai";
const FISCAL_KEY = Deno.env.get("FISCAL_AI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

async function fiscalGet(path: string, params: Record<string, string>) {
  const url = new URL(path, FISCAL_API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const resp = await fetch(url.toString(), {
    headers: { "X-Api-Key": FISCAL_KEY },
  });
  if (!resp.ok) {
    const body = await resp.text();
    if (body.includes("not available") || body.includes("free plan") || body.includes("upgrade")) {
      return { data: [], _unavailable: true };
    }
    throw new Error(`Fiscal.ai ${resp.status}: ${body}`);
  }
  return resp.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  try {
    const { ticker, companyId } = await req.json();
    if (!ticker || !companyId) {
      return new Response(JSON.stringify({ error: "ticker and companyId are required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (ticker.length > 10 || !/^[A-Za-z0-9.\-]+$/.test(ticker)) {
      return new Response(JSON.stringify({ error: "Invalid ticker format" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (!/^[0-9a-f\-]{36}$/.test(companyId)) {
      return new Response(JSON.stringify({ error: "Invalid companyId format" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // ─── Fetch segments & KPIs from Fiscal.ai ─────────────────
    const segResp = await fiscalGet("/v2/company/segments-and-kpis", {
      ticker: ticker.toUpperCase(),
      periodType: "annual",
      currency: "USD",
    });

    // Log the raw response so we can see the actual structure
    console.log("=== FISCAL.AI SEGMENTS RAW RESPONSE ===");
    console.log(JSON.stringify(segResp, null, 2));
    console.log("=== END RAW RESPONSE ===");

    if (segResp._unavailable) {
      return new Response(JSON.stringify({ success: true, segments: 0, unavailable: true }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      raw: segResp,
      message: "Discovery mode — raw response returned for inspection",
    }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
