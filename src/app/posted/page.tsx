import { supabaseAdmin } from "@/lib/supabase";
import { UnpostButton } from "@/components/UnpostButton";
import { EngagementEditor } from "@/components/EngagementEditor";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  platform: "facebook" | "instagram" | "linkedin" | "twitter";
  body: string;
  posted_at: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  items: { title: string; url: string } | null;
}

const tone = {
  linkedin:  { bg: "bg-sky-50",  text: "text-sky-700",  ring: "ring-sky-200/70" },
  twitter:   { bg: "bg-zinc-900",text: "text-white",    ring: "ring-zinc-800" },
  facebook:  { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200/70" },
  instagram: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200/70" },
} as const;

function score(r: Row) {
  return (r.likes ?? 0) * 5 + (r.comments ?? 0) * 10 + (r.shares ?? 0) * 20 + (r.views ?? 0);
}

export default async function PostedPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("drafts")
    .select("id,platform,body,posted_at,views,likes,comments,shares,items(title,url)")
    .eq("status", "posted")
    .order("posted_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as Row[];

  // Top performers (require some engagement to qualify)
  const topPerformers = [...rows]
    .filter((r) => score(r) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="anim-fade-up relative overflow-hidden rounded-[28px] border border-white/60 glass-strong px-7 py-9 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-amber-300/40 to-rose-300/30 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-300/30 to-cyan-300/30 blur-3xl" />
        </div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700/80">
          🏆 Track what works
        </p>
        <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
          Posted
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">
          {rows.length} {rows.length === 1 ? "post" : "posts"} published. Log engagement to see what resonates.
        </p>
      </section>

      {topPerformers.length > 0 && (
        <section>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
            🏆 Top performers
          </h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {topPerformers.map((r) => {
              const t = tone[r.platform];
              return (
                <li key={r.id} className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 p-4 shadow-sm">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1 ${t.bg} ${t.text} ${t.ring}`}>
                      {r.platform}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      score {score(r).toLocaleString()}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[13px] font-medium text-zinc-800">
                    {r.items?.title}
                  </p>
                  <div className="mt-2 flex gap-2 text-[11px] tabular-nums text-zinc-600">
                    <span>👁 {(r.views ?? 0).toLocaleString()}</span>
                    <span>❤️ {(r.likes ?? 0).toLocaleString()}</span>
                    <span>💬 {(r.comments ?? 0).toLocaleString()}</span>
                    <span>🔁 {(r.shares ?? 0).toLocaleString()}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/[0.08] p-20 text-center text-[14px] text-zinc-500">
          No posts yet. Mark drafts as posted from the queue.
        </div>
      ) : (
        <ul className="stagger space-y-2.5">
          {rows.map(r => {
            const t = tone[r.platform];
            return (
              <li key={r.id} className="lift rounded-2xl border border-black/[0.06] bg-white/80 p-5 shadow-sm backdrop-blur-xl hover:border-black/[0.1] hover:shadow">
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
                <EngagementEditor
                  id={r.id}
                  initial={{
                    views:    r.views    ?? 0,
                    likes:    r.likes    ?? 0,
                    comments: r.comments ?? 0,
                    shares:   r.shares   ?? 0,
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
