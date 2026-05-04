import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingGrid } from "@/components/MarketingGrid";
import { MarketingCards } from "@/components/MarketingCards";
import { isAdminCaller } from "@/lib/limits";
import { getProject, PROJECTS } from "@/lib/marketing";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ project: p.id }));
}

export default async function ProjectMarketingPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  if (!(await isAdminCaller())) notFound();

  const { project: id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const totalVariants = project.posts.reduce((s, p) => s + p.bodies.length, 0);

  return (
    <div className="space-y-8">
      <Link href="/marketing" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-600 hover:text-zinc-900">
        ← All projects
      </Link>

      <section className={`anim-fade-up relative overflow-hidden rounded-[28px] border border-white/60 glass-strong px-7 py-9 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]`}>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className={`absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br ${project.pickerGradient} blur-3xl`} />
          <div className={`absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-br ${project.pickerGradient} blur-3xl`} />
        </div>
        <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${project.accent}`}>
          {project.pickerEmoji} Promote {project.name} · Admin only
        </p>
        <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
          {project.name}
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">
          {project.tagline}
        </p>
        <p className="mt-2 text-[12.5px] text-zinc-500">
          {project.cards.length} image cards · {project.posts.length} caption groups · {totalVariants} weekly variants
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.06em] text-zinc-500">🎨 Image cards</h2>
        <MarketingCards project={project} />
      </section>

      <section>
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.06em] text-zinc-500">📝 Caption library</h2>
        <MarketingGrid project={project} />
      </section>
    </div>
  );
}
