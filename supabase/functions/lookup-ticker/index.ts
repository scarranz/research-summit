import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Well-known ticker → domain overrides for companies whose domain can't be guessed
const DOMAIN_OVERRIDES: Record<string, string> = {
  "GOOGL": "google.com", "GOOG": "google.com", "META": "meta.com",
  "AMZN": "amazon.com", "MSFT": "microsoft.com", "BRK.B": "berkshirehathaway.com",
  "BRK.A": "berkshirehathaway.com", "TSLA": "tesla.com", "V": "visa.com",
  "JNJ": "jnj.com", "JPM": "jpmorganchase.com", "UNH": "unitedhealthgroup.com",
  "BAC": "bankofamerica.com", "WFC": "wellsfargo.com", "PG": "pg.com",
  "PAC": "aeropuertosgap.com.mx", "TBBB": "tiendas3b.com",
};

// Map company name to website domain — uses override first, then cleans name
function guessDomain(name: string, ticker: string): string {
  if (DOMAIN_OVERRIDES[ticker]) return DOMAIN_OVERRIDES[ticker];
  const clean = name
    .replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|plc|PLC|S\.A\.?|S\.A\.B\.\s*de\s*C\.V\.?|N\.V\.?|Co\.?|Company|Group|Holdings?|Technologies|Platforms?|Enterprises?|International|Global)$/gi, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return clean + ".com";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
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
    const { ticker } = await req.json();
    if (!ticker || typeof ticker !== "string") {
      return new Response(JSON.stringify({ error: "ticker is required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (ticker.length > 10 || !/^[A-Za-z0-9.\-]+$/.test(ticker)) {
      return new Response(JSON.stringify({ error: "Invalid ticker format" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const symbol = ticker.toUpperCase();

    // Try Yahoo Finance quote endpoint for company info
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}&fields=shortName,longName,exchange,sector,industry`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`Yahoo API returned ${resp.status}`);
    }

    const json = await resp.json();
    const quote = json?.quoteResponse?.result?.[0];

    if (!quote) {
      return new Response(JSON.stringify({ error: "Ticker not found" }), {
        status: 404,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const name = quote.longName || quote.shortName || symbol;
    const result = {
      ticker: symbol,
      name: name,
      sector: quote.sector || "",
      industry: quote.industry || "",
      logo_domain: guessDomain(name, symbol),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
