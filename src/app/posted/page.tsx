import { supabaseAdmin } from "@/lib/supabase";
import { UnpostButton } from "@/components/UnpostButton";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  platform: "facebook" | "instagram" | "linkedin";
  body: string;
  posted_at: string;
  items: { title: string; url: string } | null;
}

const tone = {
  linkedin:  { bg: "bg-sky-500/10",  text: "text-sky-300",  ring: "ring-sky-500/20" },
  facebook:  { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/20" },
  instagram: { bg: "bg-pink-500/10", text: "text-pink-300", ring: "ring-pink-500/20" },
} as const;

export default async function PostedPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("drafts")
    .select("id,platform,body,posted_at,items(title,url)")
    .eq("status", "posted")
    .order("posted_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-[32px] font-semibold tracking-[-0.025em] leading-tight">Posted</h1>
        <p className="mt-2 text-[14px] text-neutral-400">{rows.length} {rows.length === 1 ? "post" : "posts"} published.</p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.015] p-20 text-center text-[13px] text-neutral-500 backdrop-blur-xl">
          No posts yet. Mark drafts as posted from the queue.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {rows.map(r => {
            const t = tone[r.platform];
            return (
              <li key={r.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-xl transition hover:border-white/[0.1]">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                    {r.platform}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11.5px] text-neutral-500">{new Date(r.posted_at).toLocaleString()}</span>
                    <UnpostButton id={r.id} />
                  </div>
                </div>
                {r.items?.title && (
                  <a href={r.items.url} target="_blank" rel="noreferrer"
                    className="text-[14.5px] font-medium tracking-tight text-neutral-100 hover:text-white">
                    {r.items.title}
                  </a>
                )}
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-[12.5px] leading-relaxed text-neutral-400">
                  {r.body}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
