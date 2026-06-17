import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map common company names to their website domains
function guessDomain(name: string): string {
  const clean = name
    .replace(/,?\s*(Inc\.?|Corp\.?|Ltd\.?|plc|S\.A\.?|N\.V\.?|Co\.?|Group|Holdings?|Technologies|Platforms?)$/gi, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  return clean + ".com";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { ticker } = await req.json();
    if (!ticker) {
      return new Response(JSON.stringify({ error: "ticker is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const symbol = ticker.toUpperCase();

    // Try Yahoo Finance quote endpoint for company info
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}&fields=shortName,longName,exchange,sector,industry`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!resp.ok) {
      throw new Error(`Yahoo API returned ${resp.status}`);
    }

    const json = await resp.json();
    const quote = json?.quoteResponse?.result?.[0];

    if (!quote) {
      return new Response(JSON.stringify({ error: "Ticker not found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const name = quote.longName || quote.shortName || symbol;
    const result = {
      ticker: symbol,
      name: name,
      sector: quote.sector || "",
      industry: quote.industry || "",
      logo_domain: guessDomain(name),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
