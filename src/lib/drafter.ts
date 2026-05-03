import { supabaseAdmin } from "./supabase";

type Platform = "facebook" | "instagram" | "linkedin" | "twitter";

const PLATFORM_RULES: Record<Platform, string> = {
  twitter: `
- Audience: tech-savvy, fast-scroll, builders + journalists.
- Length: HARD CAP 280 characters total. Count carefully — over 280 will be rejected.
- Structure: hook → 1 concrete fact → URL on its own (counts in length).
- Tone: punchy, declarative, no fluff. No "thread incoming". No "Big news!".
- Hashtags: 0-2 maximum, only if they're highly specific (e.g. #LLMOps, #GenAI). Default: zero.
- Include the source URL — Twitter auto-shortens it to 23 chars regardless of actual length.
- One tweet only — no thread.`,
  linkedin: `
- Audience: professionals, founders, devs, PMs.
- Length: 1200-1800 chars. First line = scroll-stopping hook (under 90 chars).
- Structure: hook → 3-5 short paragraphs (1-2 sentences each, blank lines between) → takeaway → soft CTA (question or "what would you build with this?").
- Tone: confident, specific, no hype. No "🚀", no "Game-changer".
- Hashtags: 3-5 niche tags at the end (#GenAI, #LLMOps, etc — not #AI alone).
- AEO/GEO/AIO angle: include one concrete fact, number, or quote that an LLM-powered search would surface as the answer to "what is the latest in X".`,
  facebook: `
- Audience: broader, mixed-technical.
- Length: 400-700 chars. First line is the hook.
- Tone: conversational, curious, ask a question at the end.
- Hashtags: 2-3, end of post.
- Include the source link verbatim on its own line.`,
  instagram: `
- Audience: visual scrollers; caption supports an image/carousel.
- Length: 800-1500 chars caption. First line is hook (gets cut off at ~125 chars in feed — front-load the punchline).
- Structure: hook line → blank line → 3-4 punchy bullet-style lines (use "→ " prefix) → 1 takeaway → CTA ("Save this", "Tag a builder").
- Hashtags: 8-12 mixed-volume tags on a separate line at the bottom.
- No external links in caption (IG kills reach); say "link in bio".`,
};

const SYSTEM = `You write social posts about AI news for a builder/founder audience.

Quality bar (this matters more than anything else):
- Concrete, not generic. Name the model/tool/company. Include a number, date, or capability.
- A reader who skims should learn one specific thing they didn't know.
- No corporate filler, no "In today's fast-paced world", no "Game-changer", no rocket emojis.
- Don't claim things the source doesn't say. If unsure, hedge ("appears to", "reportedly").
- Optimize for being quoted by an LLM answering "what's new in AI this week" — that means: lead with the fact, attribute the source, use clean declarative sentences.

Output STRICT JSON only. No markdown, no preamble, no \`\`\`json fences. Just the JSON object.`;

export interface DraftOutput {
  hook: string;
  body: string;
  hashtags: string[];
  cta: string;
  relevance_score: number;
}

interface ItemRow {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  published_at: string | null;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

type Language = "en" | "ur";

const LANG_INSTRUCTION: Record<Language, string> = {
  en: "Write the post in English.",
  ur: "Write the post in Urdu (script: Urdu, اردو). Keep technical terms (model names like GPT-4, Claude, Gemini, company names like OpenAI, Anthropic, Google, and the source URL) in English. The hook, body, and CTA should be in fluent natural Urdu — not transliterated. Hashtags can be a mix of English and Urdu.",
};

async function draftOne(item: ItemRow, platform: Platform, language: Language, voiceExamples: string[]): Promise<DraftOutput> {
  const voiceBlock = voiceExamples.length > 0
    ? `\n\nBrand voice — match the tone, rhythm, and sentence shapes of these example posts the user has previously written:\n${voiceExamples.map((e, i) => `--- Example ${i + 1} ---\n${e}`).join("\n\n")}\n\nWrite the new post in the same voice (but with the new article's content).`
    : "";

  const userPrompt = `Source article:
TITLE: ${item.title}
URL: ${item.url}
PUBLISHED: ${item.published_at ?? "unknown"}
SUMMARY: ${item.summary ?? "(none)"}

Platform: ${platform.toUpperCase()}
Language: ${LANG_INSTRUCTION[language]}
Platform rules:${PLATFORM_RULES[platform]}${voiceBlock}

Return JSON:
{
  "hook": "first line of the post",
  "body": "the COMPLETE post body, ready to publish, including hashtags where rules say so",
  "hashtags": ["tag1","tag2"],
  "cta": "the call to action line",
  "relevance_score": 0-100
}`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json() as { choices: { message: { content: string } }[] };
  const content = json.choices[0]?.message?.content ?? "";
  return JSON.parse(content) as DraftOutput;
}

export async function generateDraftsForNewItems(opts?: { limit?: number; platforms?: Platform[]; language?: Language }) {
  const limit = opts?.limit ?? 6;
  const platforms = opts?.platforms ?? ["linkedin", "twitter", "facebook", "instagram"];
  const language: Language = opts?.language ?? "en";
  const sb = supabaseAdmin();

  // Load up to 3 most-recent voice examples per platform for few-shot prompting.
  const voiceMap = new Map<Platform, string[]>();
  for (const p of platforms) {
    const { data: examples } = await sb
      .from("brand_voice_examples")
      .select("body")
      .eq("platform", p)
      .order("created_at", { ascending: false })
      .limit(3);
    voiceMap.set(p, (examples ?? []).map((e) => e.body as string));
  }

  // Selection strategy:
  //   1) Pull a large pool of recent "new" items with their source name.
  //   2) Drop orphans (items whose source was deleted -> source_id is null).
  //   3) Score: vendor/topic-direct sources score higher than mainstream press.
  //   4) Take top `limit` by score, breaking ties on recency.
  //
  // Doing the priority filter client-side because PostgREST .in() doesn't
  // filter on joined-table columns — it gets silently ignored.
  const PRIORITY = new Map<string, number>([
    // Vendor-direct (highest priority)
    ["OpenAI Blog", 10],
    ["Google AI Blog", 10],
    ["Hugging Face Blog", 10],
    // Vendor coverage via Google News
    ["Claude / Anthropic", 9],
    ["Grok / xAI", 9],
    ["Veo / Google AI Models", 9],
    ["AI API Updates", 9],
    // Topic-specific
    ["AI Agents News", 8],
    ["AI Music News", 8],
    ["AI Video News", 8],
    // Indie commentary (excellent quality)
    ["Simon Willison", 8],
    ["Latent Space", 7],
    ["AI News (smol)", 7],
    // Tool launches
    ["Show HN AI Launches", 7],
    ["Product Hunt AI", 6],
    // Press
    ["TechCrunch AI", 4],
    ["The Verge AI", 4],
    ["VentureBeat AI", 4],
  ]);

  const POOL_SIZE = Math.max(60, limit * 10);
  const { data: pool, error: poolErr } = await sb
    .from("items")
    .select("id,title,summary,url,published_at,sources(name)")
    .eq("status", "new")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(POOL_SIZE);
  if (poolErr) throw poolErr;

  type PoolRow = ItemRow & { sources: { name: string } | null };
  const candidates = ((pool ?? []) as unknown as PoolRow[]).filter((r) => r.sources != null);

  candidates.sort((a, b) => {
    const sa = PRIORITY.get(a.sources!.name) ?? 0;
    const sb = PRIORITY.get(b.sources!.name) ?? 0;
    if (sb !== sa) return sb - sa;
    // tie-break: more recent first
    return (b.published_at ?? "").localeCompare(a.published_at ?? "");
  });

  const items: ItemRow[] = candidates.slice(0, limit).map(({ sources: _, ...rest }) => rest);

  const results: { item_id: string; platforms: string[]; error?: string }[] = [];

  for (const item of (items ?? []) as ItemRow[]) {
    const made: string[] = [];
    try {
      for (const p of platforms) {
        const d = await draftOne(item, p, language, voiceMap.get(p) ?? []);
        const { error: insErr } = await sb.from("drafts").insert({
          item_id: item.id,
          platform: p,
          language,
          body: d.body,
          hashtags: d.hashtags,
          hook: d.hook,
          cta: d.cta,
        });
        if (insErr) throw insErr;
        if (made.length === 0) {
          await sb.from("items").update({ relevance_score: d.relevance_score }).eq("id", item.id);
        }
        made.push(p);
      }
      await sb.from("items").update({ status: "drafted" }).eq("id", item.id);
      results.push({ item_id: item.id, platforms: made });
    } catch (e) {
      results.push({ item_id: item.id, platforms: made, error: (e as Error).message });
    }
  }
  return results;
}
