import { supabaseAdmin } from "./supabase";

export interface Prospect {
  name: string;
  role: string;
  company: string;
  observation?: string;     // Optional context: "saw they're hiring SDRs", "they posted about X yesterday"
}

export interface OutreachMessages {
  connection: string;       // Initial connection request — under 300 chars (LinkedIn limit)
  followup1: string;        // Light nudge, sent ~Day 4
  followup2: string;        // Value-based nudge, sent ~Day 7
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

const SYSTEM = `You write LinkedIn outreach messages that sound human, NOT like a salesperson or recruiter.

Quality bar (this matters more than anything):
- 3 lines max per message. Often shorter is better.
- No salesy language. No "I hope this finds you well", no "I came across your profile", no "synergy", no "circle back".
- No generic compliments ("amazing work", "impressive background").
- Reference something SPECIFIC about the prospect from the observation field. If observation is empty, reference their role + company contextually but don't fake specifics.
- Casual, peer-to-peer tone. Like a thoughtful person reaching out, not a vendor.
- End with a low-pressure soft CTA. Question is good; "open to a chat?" is fine; "let me know if useful" is fine. Avoid "book a call" or "demo".
- Connection message stays under 300 characters (LinkedIn's hard limit for connect-with-note).
- Follow-ups can be slightly longer (under 500 chars each) but still 1-3 lines.

Three messages, in sequence:
1. CONNECTION — initial connect request. Hook with their context, hint at why you're reaching out, soft CTA.
2. FOLLOW-UP 1 — sent if no reply by Day 4. Light nudge. Casual. "Just bumping this up" energy. 1-2 lines.
3. FOLLOW-UP 2 — sent if no reply by Day 7. Add a small value angle or insight. Give them a reason to respond. 2-3 lines.

Output STRICT JSON only. No markdown, no preamble, no code fences. Just the JSON object.`;

export async function generateOutreach(prospect: Prospect): Promise<OutreachMessages> {
  // Pull up to 3 LinkedIn brand-voice examples to mimic the user's tone.
  const sb = supabaseAdmin();
  const { data: examples } = await sb
    .from("brand_voice_examples")
    .select("body")
    .eq("platform", "linkedin")
    .order("created_at", { ascending: false })
    .limit(3);
  const voiceExamples = (examples ?? []).map((e) => e.body as string);

  const voiceBlock = voiceExamples.length > 0
    ? `\n\nBRAND VOICE — match the tone, rhythm, and word choices of these example posts the user has previously written:\n${voiceExamples.map((e, i) => `--- Example ${i + 1} ---\n${e}`).join("\n\n")}\n\nUse the same voice in the outreach messages (but adapted to a 1-on-1 conversational tone, not a public post).`
    : "";

  const userPrompt = `Prospect:
- Name: ${prospect.name}
- Role: ${prospect.role}
- Company: ${prospect.company}
- Observation / context: ${prospect.observation?.trim() || "(none — write the messages without faking specifics)"}${voiceBlock}

Return JSON:
{
  "connection": "the initial connection-request message (under 300 chars)",
  "followup1": "first follow-up message (1-2 lines)",
  "followup2": "second follow-up with a small value angle (2-3 lines)"
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

  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json() as { choices: { message: { content: string } }[] };
  const content = json.choices[0]?.message?.content ?? "";
  return JSON.parse(content) as OutreachMessages;
}
