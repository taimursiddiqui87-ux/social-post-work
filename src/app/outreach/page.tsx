import { OutreachWorkspace } from "@/components/OutreachWorkspace";

export const dynamic = "force-dynamic";

export default function OutreachPage() {
  return (
    <div className="space-y-8">
      <section className="anim-fade-up relative overflow-hidden rounded-[28px] border border-white/60 glass-strong px-7 py-9 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-sky-300/40 to-indigo-300/30 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-300/30 to-amber-300/30 blur-3xl" />
        </div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700/80">
          🤝 LinkedIn outreach
        </p>
        <h1 className="gradient-text text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
          Outreach
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-zinc-600">
          Generate personalized LinkedIn messages — connection request + 2 follow-ups — that sound human.
          Hand the output to <a href="https://salesrobot.co" target="_blank" rel="noreferrer" className="font-medium text-emerald-700 underline-offset-2 hover:underline">Salesrobot</a> or any LinkedIn automation tool to send.
        </p>
      </section>
      <OutreachWorkspace />
    </div>
  );
}
