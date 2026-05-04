import { notFound } from "next/navigation";
import Link from "next/link";
import { isAdminCaller } from "@/lib/limits";
import { PROJECTS } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export default async function MarketingPickerPage() {
  // Admin-only — non-admin users get a 404, no leak that this page exists.
  if (!(await isAdminCaller())) notFound();

  return (
    <div className="space-y-8">
      <section className="anim-fade-up relative overflow-hidden rounded-[28px] border border-white/60 glass-strong px-7 py-9 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-fuchsia-300/40 to-rose-300/30 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-amber-300/30 to-emerald-300/30 blur-3xl" />
        </div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia-700/80">
          📣 Marketing kits · Admin only
        </p>
        <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
          Pick a project
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">
          Each project ships with image cards + a weekly-rotating caption library
          for LinkedIn, X, Facebook, and Instagram.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
          {PROJECTS.length} projects
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((p) => {
            const totalVariants = p.posts.reduce((s, x) => s + x.bodies.length, 0);
            return (
              <li key={p.id}>
                <Link
                  href={`/marketing/${p.id}`}
                  className="lift block overflow-hidden rounded-2xl border border-white/60 glass shadow-sm transition hover:shadow"
                >
                  <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${p.pickerGradient}`}>
                    <div className="absolute inset-0 grid place-items-center text-[64px]">{p.pickerEmoji}</div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[15.5px] font-semibold tracking-tight text-zinc-900">{p.name}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{p.pickerSummary}</p>
                    <p className="mt-3 text-[11.5px] tabular-nums text-zinc-500">
                      {p.cards.length} cards · {p.posts.length} captions · {totalVariants} variants
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
