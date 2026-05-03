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

const SYSTEM = `You are an AI news analyst. Given a user's question and a set of recent AI articles, write a concise, accurate answer.

Rules:
- Cite specific article titles and what they reported.
- If the articles disagree, point that out.
- If the articles don't actually answer the question, say so directly.
- Don't invent facts or company names not in the source articles.
- Output is plain text — no markdown headings, no bullet stars, just prose.
- 3-6 short paragraphs maximum.
- End with a one-line "Sources:" listing the titles you used (comma-separated).`;

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

  const userPrompt = `Question: ${question}

Articles:
${context}

Answer the question based ONLY on the articles above.`;

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
