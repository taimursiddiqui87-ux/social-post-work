import { supabaseAdmin } from "@/lib/supabase";
import { DraftCard } from "@/components/DraftCard";
import { Toolbar } from "@/components/Toolbar";
import { CountUp } from "@/components/CountUp";
import { Spotlight } from "@/components/Spotlight";
import { computeTrending, TRENDING_THRESHOLD } from "@/lib/trending";

interface DraftRow {
  id: string;
  platform: "facebook" | "instagram" | "linkedin" | "twitter";
  body: string;
  hashtags: string[] | null;
  hook: string | null;
  status: string;
  language: string | null;
  created_at: string;
  item_id: string;
  items: {
    title: string;
    url: string;
    relevance_score: number | null;
    published_at: string | null;
    sources: { name: string } | null;
  } | null;
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.round(d / 60)}m ago`;
  if (d < 86400) return `${Math.round(d / 3600)}h ago`;
  return `${Math.round(d / 86400)}d ago`;
}
function host(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

interface QueueViewProps {
  title: string;
  subtitle: string;
  /** If set, only show drafts whose item belongs to a source in this list. */
  sourceFilter?: readonly string[];
  /** Empty-state copy when no drafts match. */
  emptyHint?: string;
}

export async function QueueView({ title, subtitle, sourceFilter, emptyHint }: QueueViewProps) {
  const sb = supabaseAdmin();
  const [draftsRes, postedCountRes] = await Promise.all([
    sb.from("drafts")
      .select("id,platform,body,hashtags,hook,status,language,created_at,item_id,items(title,url,relevance_score,published_at,sources(name))")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    sb.from("drafts").select("id", { count: "exact", head: true }).eq("status", "posted"),
  ]);

  let drafts = (draftsRes.data ?? []) as unknown as DraftRow[];
  if (sourceFilter && sourceFilter.length > 0) {
    const allow = new Set(sourceFilter);
    drafts = drafts.filter((d) => {
      const name = d.items?.sources?.name;
      return name ? allow.has(name) : false;
    });
  }
  const postedCount = postedCountRes.count ?? 0;

  const groups = new Map<string, DraftRow[]>();
  for (const d of drafts) {
    const arr = groups.get(d.item_id) ?? [];
    arr.push(d);
    groups.set(d.item_id, arr);
  }
  const order: Record<string, number> = { linkedin: 0, twitter: 1, facebook: 2, instagram: 3 };
  for (const arr of groups.values()) arr.sort((a, b) => order[a.platform] - order[b.platform]);

  // Compute trending for the items in this view
  const itemIds = [...groups.keys()];
  const trendMap = await computeTrending(itemIds);

  const sortedGroups = [...groups.entries()].sort((a, b) => {
    const trendA = (trendMap.get(a[0]) ?? 1) >= TRENDING_THRESHOLD ? 1 : 0;
    const trendB = (trendMap.get(b[0]) ?? 1) >= TRENDING_THRESHOLD ? 1 : 0;
    if (trendA !== trendB) return trendB - trendA;            // trending first
    const ra = a[1][0]?.items?.relevance_score ?? 0;
    const rb = b[1][0]?.items?.relevance_score ?? 0;
    if (rb !== ra) return rb - ra;
    return (b[1][0]?.items?.published_at ?? "").localeCompare(a[1][0]?.items?.published_at ?? "");
  });

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="anim-fade-up relative overflow-hidden rounded-[28px] border border-white/60 glass-strong px-7 py-9 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-300/40 to-cyan-300/30 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-fuchsia-300/30 to-violet-400/30 blur-3xl" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700/80">
              ✨ AI news → social drafts
            </p>
            <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">{subtitle}</p>
          </div>
          <Toolbar />
        </div>
      </section>

      {/* Stat tiles */}
      <div className="stagger grid grid-cols-3 gap-3">
        <Stat label="Articles" value={groups.size} accent="emerald" />
        <Stat label="Pending drafts" value={drafts.length} accent="violet" />
        <Stat label="Posted" value={postedCount} accent="zinc" muted />
      </div>

      {draftsRes.error && <p className="text-sm text-red-600">{draftsRes.error.message}</p>}

      {groups.size === 0 ? (
        <div className="rounded-3xl border border-black/[0.06] bg-white/70 p-20 text-center shadow-sm backdrop-blur-xl">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 ring-1 ring-black/[0.04]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 4v5h5"/>
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-zinc-900">Queue is empty</p>
          <p className="mt-1.5 text-[14px] text-zinc-500">{emptyHint ?? "Click Fetch news, then Generate drafts."}</p>
        </div>
      ) : (
        <div className="stagger space-y-4">
          {sortedGroups.map(([itemId, items]) => {
            const head = items[0];
            const score = head.items?.relevance_score ?? 0;
            const trendSize = trendMap.get(itemId) ?? 1;
            const isTrending = trendSize >= TRENDING_THRESHOLD;
            const tier =
              score >= 80 ? { dot: "bg-emerald-500", text: "text-emerald-700", label: "High" } :
              score >= 60 ? { dot: "bg-amber-500",   text: "text-amber-700",   label: "Medium" } :
                            { dot: "bg-zinc-400",    text: "text-zinc-500",    label: "Low" };
            return (
              <Spotlight as="article"
                key={itemId}
                className="group lift overflow-hidden rounded-3xl border border-white/60 glass shadow-sm hover:border-black/[0.1] hover:shadow-lg"
              >
                <header className="border-b border-black/[0.05] px-7 py-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.06em]">
                    {isTrending && (
                      <span className="anim-pulse-glow inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10.5px] text-orange-700 ring-1 ring-orange-200">
                        🔥 Trending · {trendSize} sources
                      </span>
                    )}
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${tier.dot}`} />
                    <span className={tier.text}>{tier.label} signal · {score}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-500 normal-case tracking-normal">{host(head.items?.url ?? "")}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-500 normal-case tracking-normal">{timeAgo(head.items?.published_at ?? null)}</span>
                  </div>
                  <a href={head.items?.url} target="_blank" rel="noreferrer"
                    className="block text-[20px] font-semibold leading-snug tracking-[-0.015em] text-zinc-900 transition hover:text-emerald-700">
                    {head.items?.title}
                  </a>
                </header>
                <div className="divide-y divide-black/[0.05]">
                  {items.map((d) => <DraftCard key={d.id} draft={d} />)}
                </div>
              </Spotlight>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = "emerald", muted }: { label: string; value: number; accent?: "emerald" | "violet" | "zinc"; muted?: boolean }) {
  const dot = {
    emerald: "bg-emerald-500",
    violet:  "bg-violet-500",
    zinc:    "bg-zinc-400",
  }[accent];
  return (
    <div className="lift relative overflow-hidden rounded-2xl border border-white/60 glass p-5 shadow-sm hover:border-black/[0.1] hover:shadow">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot} shadow-[0_0_8px_currentColor]`} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      </div>
      <p className={`text-[32px] font-semibold tabular-nums tracking-tight ${muted ? "text-zinc-500" : "text-zinc-900"}`}>
        <CountUp to={value} />
      </p>
    </div>
  );
}
