import { supabaseAdmin } from "@/lib/supabase";
import { BrandVoiceManager } from "@/components/BrandVoiceManager";

export const dynamic = "force-dynamic";

interface VoiceExample {
  id: string;
  platform: "facebook" | "instagram" | "linkedin" | "twitter";
  body: string;
  label: string | null;
  created_at: string;
}

export default async function SettingsPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("brand_voice_examples")
    .select("id,platform,body,label,created_at")
    .order("created_at", { ascending: false });
  const examples = (data ?? []) as VoiceExample[];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">Settings</h1>
        <p className="mt-2 text-[15.5px] text-zinc-600">
          Customize how the AI writes drafts for you.
        </p>
      </header>

      <section>
        <div className="mb-4">
          <h2 className="text-[22px] font-semibold tracking-tight text-zinc-900">Brand voice</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-zinc-600">
            Paste your best past posts (or examples that match the tone you want).
            The drafter uses up to 3 most-recent examples per platform as few-shot
            references, so new drafts come out in your style.
          </p>
        </div>
        <BrandVoiceManager initial={examples} />
      </section>
    </div>
  );
}
