// generate-investment-writeup — researches a public company via Claude + web search
// and drafts the Investment tab's Overview / Opportunity sections in Summit's house
// tone. Used by the "Research & write" button in the Investment tab's Add modal.
//
// Requires a new Supabase secret (San/Oscar only): ANTHROPIC_API_KEY
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref bvflqjndivouhgwqfbrq
// Deploy: supabase functions deploy generate-investment-writeup --project-ref bvflqjndivouhgwqfbrq
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

const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const MODEL = "claude-opus-4-8";

// One real write-up (Meta) as a style anchor — tone/structure reference only.
// The model must research and write original content for the requested company,
// never reuse these facts.
const STYLE_EXAMPLE = `OVERVIEW:
Meta owns the world's biggest social apps: Facebook, Instagram, Messenger, and WhatsApp, used by **more than 3.5 billion people every day**. Almost all of its revenue comes from selling ads inside those apps, powered by AI that decides which ad each person sees. A separate unit, Reality Labs, builds VR/AR hardware like the Quest headset and Ray-Ban smart glasses; it's still losing money, but it's Meta's bet on the next computing platform.

In FY2025 the core advertising business made **$130.5B in revenue at a 47% profit margin**, enough to fund Meta's heavy AI and hardware spending without needing outside capital.

MOAT:
Every extra user makes Meta's ad-targeting AI better, which makes its ads more valuable, letting Meta charge more per ad than almost any other platform. That scale is extremely hard to copy: a challenger would need billions of users and years of behavioral data just to match Meta's targeting quality. WhatsApp and Instagram also give Meta control over how billions of people communicate and shop, a daily habit that's difficult to displace once it's formed.

OPPORTUNITY:
We think the market undervalues how directly Meta's AI spending is turning into profit. Ad performance keeps improving as the AI models get better, and that shows up in the **47% margin** even while Meta spends aggressively on AI infrastructure.

Reality Labs' losses look like a distraction, but we see them as an option on the next interface layer: if wearables or smart glasses go mainstream, Meta already has the head start.`;

const SYSTEM_PROMPT = `You are a research analyst at Summit Management Technologies, an investment fund. You write internal investment dossiers for the fund's "Investment" tab -- a single readable page per holding meant for ANYONE at the fund to understand quickly, not just other analysts.

## Sourcing
Research the requested company using web search. Prioritize, in order: (1) the company's own investor-relations site, SEC/EDGAR filings (10-K/10-Q/20-F/8-K), and official press releases; (2) recent earnings releases and investor presentations; (3) reputable financial press. Never use a forum or blog as your primary source. Prefer the most recent fiscal year's reported figures and cite concrete numbers (revenue, growth rates, segment breakdowns, margins) rather than vague claims.

## Tone and structure
Write in plain, simple language that a non-finance colleague could follow -- short sentences, everyday words, minimal jargon (spell out or briefly explain any acronym you use). Confident and specific, never hypey (avoid "disruptive," "revolutionary," "best-in-class," "world-class"). Original analysis only, never copied from any source.

Use **bold** (double asterisks) around the single most important fact or number in a paragraph -- typically a key revenue figure, growth rate, or margin -- so a skimming reader catches the headline number. Don't bold more than one short phrase per paragraph. Avoid em dashes and double-hyphen constructions ("--"); prefer commas, periods, or "which/that" clauses instead, and only use a dash if a sentence genuinely needs one.

Below is ONE example of the target tone, structure, and formatting for a DIFFERENT company (Meta) -- use it only to calibrate voice and paragraph length. Do not reuse any fact, number, or sentence from it; research and write entirely original content for the company you are asked about.

<style_example>
${STYLE_EXAMPLE}
</style_example>

## Output format (follow exactly)
Respond with ONLY the following, no preamble or closing remarks:

OVERVIEW:
<1-2 short paragraphs: what the company does in plain terms, its main business lines, how it makes money, with one or two key FY figures bolded. Separate paragraphs with a blank line.>

MOAT:
<One paragraph of 3-4 sentences: the company's durable competitive advantage, explained simply -- why a well-funded competitor couldn't just copy it.>

OPPORTUNITY:
<1-2 short paragraphs: the investment case in plain terms -- why the fund holds this, the growth driver, what could make the stock worth more over time.>

Do not add any other section or heading. No markdown besides the **bold** described above (no #, no bullet lists, no additional formatting).`;

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicMessage {
  content: AnthropicContentBlock[];
  stop_reason: string;
}

async function callClaude(messages: Array<{ role: string; content: unknown }>): Promise<AnthropicMessage> {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
      messages,
    }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Anthropic API error ${resp.status}: ${body}`);
  }
  return await resp.json();
}

function extractText(content: AnthropicContentBlock[]): string {
  return content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join("\n").trim();
}

function parseSections(text: string): { overview: string; moat: string; opportunity: string } {
  const overviewMatch = text.match(/OVERVIEW:\s*([\s\S]*?)(?=\nMOAT:|$)/i);
  const moatMatch = text.match(/MOAT:\s*([\s\S]*?)(?=\nOPPORTUNITY:|$)/i);
  const opportunityMatch = text.match(/OPPORTUNITY:\s*([\s\S]*)$/i);
  return {
    overview: (overviewMatch ? overviewMatch[1] : "").trim(),
    moat: (moatMatch ? moatMatch[1] : "").trim(),
    opportunity: (opportunityMatch ? opportunityMatch[1] : "").trim(),
  };
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
    const { ticker, name, sector } = await req.json();
    if (!ticker || !name) {
      return new Response(JSON.stringify({ error: "ticker and name are required" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Research ${name} (ticker: ${ticker})${sector ? `, which Summit categorizes under the "${sector}" sector` : ""}. Write its Overview and Opportunity sections now.`;
    const messages: Array<{ role: string; content: unknown }> = [
      { role: "user", content: userPrompt },
    ];

    let response = await callClaude(messages);

    // Server-side web search runs its own internal loop (up to 10 rounds); if it
    // hits that limit mid-research, stop_reason is "pause_turn" — resend the
    // conversation as-is (no extra "continue" message) to let it finish.
    let guard = 0;
    while (response.stop_reason === "pause_turn" && guard < 3) {
      messages.push({ role: "assistant", content: response.content });
      response = await callClaude(messages);
      guard++;
    }

    const text = extractText(response.content);
    const { overview, moat, opportunity } = parseSections(text);

    if (!overview || !moat || !opportunity) {
      return new Response(JSON.stringify({ error: "Model did not return all three sections. Try again or fill in manually." }), {
        status: 502, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: { overview, moat, opportunity } }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
