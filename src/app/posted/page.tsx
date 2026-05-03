import { supabaseAdmin } from "@/lib/supabase";
import { UnpostButton } from "@/components/UnpostButton";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  platform: "facebook" | "instagram" | "linkedin" | "twitter";
  body: string;
  posted_at: string;
  items: { title: string; url: string } | null;
}

const tone = {
  linkedin:  { bg: "bg-sky-50",  text: "text-sky-700",  ring: "ring-sky-200/70" },
  twitter:   { bg: "bg-zinc-900",text: "text-white",    ring: "ring-zinc-800" },
  facebook:  { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200/70" },
  instagram: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200/70" },
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
        <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">Posted</h1>
        <p className="mt-2 text-[15.5px] text-zinc-600">{rows.length} {rows.length === 1 ? "post" : "posts"} published.</p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-black/[0.06] bg-white/70 p-20 text-center text-[14px] text-zinc-500 shadow-sm backdrop-blur-xl">
          No posts yet. Mark drafts as posted from the queue.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {rows.map(r => {
            const t = tone[r.platform];
            return (
              <li key={r.id} className="rounded-2xl border border-black/[0.06] bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:border-black/[0.1] hover:shadow">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                    {r.platform}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-zinc-500">{new Date(r.posted_at).toLocaleString()}</span>
                    <UnpostButton id={r.id} />
                  </div>
                </div>
                {r.items?.title && (
                  <a href={r.items.url} target="_blank" rel="noreferrer"
                    className="text-[16px] font-semibold tracking-tight text-zinc-900 hover:text-emerald-700">
                    {r.items.title}
                  </a>
                )}
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-600">
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
