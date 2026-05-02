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
    <div className="space-y-8">
      <header>
        <h1 className="text-[28px] font-semibold tracking-tight">Posted</h1>
        <p className="mt-1 text-sm text-neutral-500">{rows.length} {rows.length === 1 ? "post" : "posts"} marked as published.</p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800/80 p-16 text-center text-sm text-neutral-500">
          No posts yet. Mark drafts as posted from the queue.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map(r => {
            const t = tone[r.platform];
            return (
              <li key={r.id} className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4 transition hover:border-neutral-800">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                    {r.platform}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500">{new Date(r.posted_at).toLocaleString()}</span>
                    <UnpostButton id={r.id} />
                  </div>
                </div>
                {r.items?.title && (
                  <a href={r.items.url} target="_blank" rel="noreferrer"
                    className="text-sm font-medium text-neutral-200 hover:underline">
                    {r.items.title}
                  </a>
                )}
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-neutral-400">
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
