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

const MASSIVE_API = "https://api.massive.com";
const MASSIVE_KEY = Deno.env.get("MASSIVE_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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

    // Fetch analyst ratings from Massive (Benzinga)
    const url = `${MASSIVE_API}/benzinga/v1/ratings?ticker=${encodeURIComponent(ticker.toUpperCase())}&limit=30&sort=date.desc`;
    const resp = await fetch(url, {
      headers: { "Authorization": `Bearer ${MASSIVE_KEY}` },
    });

    if (!resp.ok) {
      const body = await resp.text();
      if (body.includes("not found") || body.includes("no data")) {
        return new Response(JSON.stringify({ success: true, ratings: 0, unavailable: true }), {
          headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        });
      }
      throw new Error(`Massive API ${resp.status}: ${body}`);
    }

    const json = await resp.json();
    const results = json.results || [];

    const ratings = results.map((r: any) => ({
      company_id: companyId,
      date: r.date,
      firm: r.firm || "Unknown",
      analyst: r.analyst || null,
      rating: r.rating || "—",
      previous_rating: r.previous_rating || null,
      rating_action: r.rating_action || null,
      price_target: r.price_target || null,
      previous_price_target: r.previous_price_target || null,
      price_target_action: r.price_target_action || null,
    }));

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Clear existing ratings for this company, then insert fresh
    await supabase.from("analyst_ratings").delete().eq("company_id", companyId);
    if (ratings.length) {
      const { error } = await supabase.from("analyst_ratings").insert(ratings);
      if (error) throw new Error(`Insert ratings: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      ratings: ratings.length,
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
