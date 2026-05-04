import { notFound } from "next/navigation";
import { MarketingGrid } from "@/components/MarketingGrid";
import { MarketingCards } from "@/components/MarketingCards";
import { isAdminCaller } from "@/lib/limits";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
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
          📣 Promote THS Post · Admin only
        </p>
        <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
          Marketing kit
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">
          Ready-to-paste copy + downloadable image cards to introduce THS Post.
          Copy text or download the visuals below.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.06em] text-zinc-500">🎨 Image cards</h2>
        <MarketingCards />
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.06em] text-zinc-500">📝 Caption library</h2>
        <MarketingGrid />
      </section>
    </div>
  );
}
