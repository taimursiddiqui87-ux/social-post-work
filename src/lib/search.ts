import { supabaseAdmin } from "./supabase";

export interface SearchHit {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  published_at: string | null;
  source_name: string | null;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

/**
 * Substring search across recent items. Looks at title + summary.
 * Returns up to 30 most relevant (recency-tied).
 */
export async function searchItems(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const sb = supabaseAdmin();

  // Use Postgres ILIKE — case-insensitive substring match.
  const pattern = `%${q.replace(/[%_]/g, "\\$&")}%`;
  const { data, error } = await sb
    .from("items")
    .select("id,title,summary,url,published_at,sources(name)")
    .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(30);
  if (error) throw error;

  type Row = {
    id: string; title: string; summary: string | null; url: string;
    published_at: string | null; sources: { name: string } | null;
  };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    url: r.url,
    published_at: r.published_at,
    source_name: r.sources?.name ?? null,
  }));
}

const SYSTEM = `You are a knowledgeable assistant focused on AI, technology, and current events. Answer the user's question helpfully and accurately.

You may receive a set of recent articles as context. Use them when they're relevant to the question:
- If the articles directly answer the question, cite specific article titles in your answer.
- If the articles partially address it, combine article facts with your general knowledge but be clear which is which.
- If the articles aren't relevant or none were provided, answer from your general knowledge — that's fine, just say so briefly.

Rules:
- Don't invent companies, models, or numbers. If unsure, hedge ("appears to", "reportedly", "as of my training").
- Output plain text — no markdown headings, no asterisks, just clean prose with paragraph breaks.
- 2-6 short paragraphs.
- If you cited articles, end with one line: "Sources from your feed: <titles, comma-separated>".
- If you used only general knowledge, end with: "(General knowledge — not from your fetched articles.)"`;

/**
 * Ask AI a question over a set of articles. Articles are passed as context.
 */
export async function askGroq(question: string, articles: SearchHit[]): Promise<string> {
  const context = articles.slice(0, 8).map((a, i) =>
    `[${i + 1}] TITLE: ${a.title}
SOURCE: ${a.source_name ?? "?"}
PUBLISHED: ${a.published_at ?? "?"}
URL: ${a.url}
SUMMARY: ${(a.summary ?? "").slice(0, 600)}`
  ).join("\n\n");

  const userPrompt = articles.length > 0
    ? `Question: ${question}

Articles available as context:
${context}

Answer the question. Use the articles when relevant, otherwise use your general knowledge.`
    : `Question: ${question}

(No matching articles found in the user's RSS feed cache.)

Answer the question from your general knowledge.`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json() as { choices: { message: { content: string } }[] };
  return json.choices[0]?.message?.content ?? "(no response)";
}
