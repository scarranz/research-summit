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

/**
 * Parse the Fiscal.ai segments response into flat rows for company_segments.
 *
 * The v2 response uses nested structures with metrics/segmentGroups/data.
 * We flatten into one row per (segmentGroup, segmentName, metric, period).
 *
 * Known response shapes from Fiscal.ai v2:
 *  - { metrics: [...], segmentGroups: [...], data: { metricsValues: {...} } }
 *  - { data: [ { segmentGroup, segmentName, kpiId, metricName, periods: [...] } ] }
 *
 * We handle both shapes defensively.
 */
function parseSegments(resp: any, companyId: string): any[] {
  const rows: any[] = [];

  // Shape A: flat array in resp.data with period values
  if (Array.isArray(resp.data)) {
    for (const item of resp.data) {
      const group = item.segmentGroup || item.segment_group || "Other";
      const name = item.segmentName || item.segment_name || group;
      const metric = item.metricName || item.metric_name || "Revenue";
      const kpiId = item.kpiId || item.kpi_id || null;

      // If item has periods array
      if (Array.isArray(item.periods)) {
        for (const p of item.periods) {
          rows.push({
            company_id: companyId,
            segment_group: group,
            segment_name: name,
            kpi_id: kpiId,
            metric_name: metric,
            period_type: p.periodType || p.period_type || "annual",
            fiscal_year: p.fiscalYear || p.fiscal_year || p.year,
            fiscal_quarter: p.fiscalQuarter ?? p.fiscal_quarter ?? null,
            value: p.value ?? null,
            currency: p.currency || "USD",
            sort_order: 0,
          });
        }
      }
      // If item has metricsValues (nested by period key)
      else if (item.metricsValues && typeof item.metricsValues === "object") {
        for (const [periodKey, val] of Object.entries(item.metricsValues)) {
          const year = parseInt(periodKey) || null;
          if (year) {
            rows.push({
              company_id: companyId,
              segment_group: group,
              segment_name: name,
              kpi_id: kpiId,
              metric_name: metric,
              period_type: "annual",
              fiscal_year: year,
              fiscal_quarter: null,
              value: val ?? null,
              currency: "USD",
              sort_order: 0,
            });
          }
        }
      }
      // If item has a direct value + fiscalYear
      else if (item.fiscalYear || item.fiscal_year) {
        rows.push({
          company_id: companyId,
          segment_group: group,
          segment_name: name,
          kpi_id: kpiId,
          metric_name: metric,
          period_type: item.periodType || item.period_type || "annual",
          fiscal_year: item.fiscalYear || item.fiscal_year,
          fiscal_quarter: item.fiscalQuarter ?? item.fiscal_quarter ?? null,
          value: item.value ?? null,
          currency: item.currency || "USD",
          sort_order: 0,
        });
      }
    }
  }

  // Shape B: nested with segmentGroups + metrics + data.metricsValues
  else if (resp.segmentGroups && resp.metrics && resp.data?.metricsValues) {
    const metrics = resp.metrics || [];
    const groups = resp.segmentGroups || [];
    const values = resp.data.metricsValues;

    for (const metric of metrics) {
      const metricId = String(metric.kpiId || metric.id || "");
      const metricName = metric.name || metric.metricName || "Unknown";

      for (const group of groups) {
        const groupName = group.name || group.segmentGroup || "Other";
        const segments = group.segments || [group];

        for (const seg of segments) {
          const segName = seg.name || seg.segmentName || groupName;
          const key = `${metricId}_${seg.id || segName}`;
          const periodValues = values[key] || values[metricId] || {};

          if (typeof periodValues === "object" && !Array.isArray(periodValues)) {
            for (const [periodKey, val] of Object.entries(periodValues)) {
              const year = parseInt(periodKey) || null;
              if (year) {
                rows.push({
                  company_id: companyId,
                  segment_group: groupName,
                  segment_name: segName,
                  kpi_id: metric.kpiId || null,
                  metric_name: metricName,
                  period_type: "annual",
                  fiscal_year: year,
                  fiscal_quarter: null,
                  value: val ?? null,
                  currency: "USD",
                  sort_order: 0,
                });
              }
            }
          }
        }
      }
    }
  }

  // Assign sort_order within each group
  const groupOrder: Record<string, number> = {};
  for (const row of rows) {
    const key = `${row.segment_group}__${row.metric_name}__${row.fiscal_year}`;
    groupOrder[key] = (groupOrder[key] || 0) + 1;
    row.sort_order = groupOrder[key];
  }

  return rows;
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
  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
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

    if (segResp._unavailable) {
      return new Response(JSON.stringify({ success: true, segments: 0, unavailable: true }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // ─── Parse and write to DB ────────────────────────────────
    const rows = parseSegments(segResp, companyId);

    const supabase = supabaseAuth;

    // Only delete+insert when we have new data
    if (rows.length) {
      await supabase.from("company_segments").delete().eq("company_id", companyId);
      const { error } = await supabase.from("company_segments").insert(rows);
      if (error) throw new Error(`Insert segments: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      segments: rows.length,
    }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
