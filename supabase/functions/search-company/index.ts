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

// Cache the full company list in memory (refreshes each cold start)
let _cache: any[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getCompanyList(): Promise<any[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  const all: any[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const url = `${FISCAL_API}/v2/companies-list?pageSize=1000&pageNumber=${page}`;
    const resp = await fetch(url, { headers: { "X-Api-Key": FISCAL_KEY } });
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error(`Fiscal.ai companies-list page ${page} failed: ${resp.status} ${body}`);
      break;
    }
    const json = await resp.json();
    all.push(...(json.data || []));
    hasNext = json.pagination?.hasNextPage || false;
    page++;
  }

  // Only cache if we got results — avoid caching empty on API failure
  if (all.length) {
    _cache = all;
    _cacheTime = Date.now();
  }
  return _cache || all;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  // Verify the caller is an authenticated user
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const { query } = await req.json();
    if (!query || query.length < 1) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const companies = await getCompanyList();
    const q = query.toLowerCase();

    // Score and filter matches
    const matches = companies
      .map((c: any) => {
        const ticker = (c.ticker || "").toLowerCase();
        const name = (c.name || "").toLowerCase();
        let score = 0;

        // Exact ticker match — highest priority
        if (ticker === q) score = 100;
        // Ticker starts with query
        else if (ticker.startsWith(q)) score = 80;
        // Ticker contains query
        else if (ticker.includes(q)) score = 60;
        // Name starts with query
        else if (name.startsWith(q)) score = 50;
        // Name contains query word
        else if (name.includes(q)) score = 30;
        else return null;

        return { ...c, _score: score };
      })
      .filter((c: any) => c !== null)
      .sort((a: any, b: any) => b._score - a._score)
      .slice(0, 8)
      .map((c: any) => ({
        ticker: c.ticker,
        name: c.name,
        exchange: c.exchangeSymbol || c.exchangeName,
        sector: c.sector,
        industry: c.industryGroup,
        country: c.countryCode,
      }));

    return new Response(JSON.stringify({ data: matches }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
