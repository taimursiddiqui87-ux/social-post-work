import { supabaseAdmin } from "@/lib/supabase";
import { DraftCard } from "@/components/DraftCard";
import { Toolbar } from "@/components/Toolbar";

interface DraftRow {
  id: string;
  platform: "facebook" | "instagram" | "linkedin";
  body: string;
  hashtags: string[] | null;
  hook: string | null;
  status: string;
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
      .select("id,platform,body,hashtags,hook,status,created_at,item_id,items(title,url,relevance_score,published_at,sources(name))")
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
  const order: Record<string, number> = { linkedin: 0, facebook: 1, instagram: 2 };
  for (const arr of groups.values()) arr.sort((a, b) => order[a.platform] - order[b.platform]);

  const sortedGroups = [...groups.entries()].sort((a, b) => {
    const ra = a[1][0]?.items?.relevance_score ?? 0;
    const rb = b[1][0]?.items?.relevance_score ?? 0;
    if (rb !== ra) return rb - ra;
    return (b[1][0]?.items?.published_at ?? "").localeCompare(a[1][0]?.items?.published_at ?? "");
  });

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
        <Toolbar />
      </header>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Articles" value={groups.size} />
        <Stat label="Pending drafts" value={drafts.length} />
        <Stat label="Posted" value={postedCount} muted />
      </div>

      {draftsRes.error && <p className="text-sm text-red-400">{draftsRes.error.message}</p>}

      {groups.size === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800/80 p-16 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-neutral-900 text-neutral-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 4v5h5"/>
            </svg>
          </div>
          <p className="text-base font-medium text-neutral-200">Queue is empty</p>
          <p className="mt-1 text-sm text-neutral-500">{emptyHint ?? "Click Fetch news, then Generate drafts."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGroups.map(([itemId, items]) => {
            const head = items[0];
            const score = head.items?.relevance_score ?? 0;
            const tier =
              score >= 80 ? { dot: "bg-emerald-400", text: "text-emerald-300", label: "High" } :
              score >= 60 ? { dot: "bg-amber-400",   text: "text-amber-300",   label: "Medium" } :
                            { dot: "bg-neutral-600", text: "text-neutral-400", label: "Low" };
            return (
              <article key={itemId} className="group overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/60 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition hover:border-neutral-800">
                <header className="border-b border-neutral-900 px-6 py-5">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${tier.dot}`} />
                    <span className={tier.text}>{tier.label} signal · {score}</span>
                    <span className="text-neutral-700">·</span>
                    <span className="text-neutral-500 normal-case tracking-normal">{host(head.items?.url ?? "")}</span>
                    <span className="text-neutral-700">·</span>
                    <span className="text-neutral-500 normal-case tracking-normal">{timeAgo(head.items?.published_at ?? null)}</span>
                  </div>
                  <a href={head.items?.url} target="_blank" rel="noreferrer"
                    className="block text-[17px] font-semibold leading-snug text-neutral-100 hover:text-white">
                    {head.items?.title}
                  </a>
                </header>
                <div className="divide-y divide-neutral-900">
                  {items.map((d) => <DraftCard key={d.id} draft={d} />)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${muted ? "text-neutral-400" : "text-neutral-100"}`}>{value}</p>
    </div>
  );
}
