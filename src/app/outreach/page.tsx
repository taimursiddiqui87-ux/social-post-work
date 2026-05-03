import { OutreachWorkspace } from "@/components/OutreachWorkspace";

export const dynamic = "force-dynamic";

export default function OutreachPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">
          Outreach
        </h1>
        <p className="mt-2 text-[15.5px] leading-relaxed text-zinc-600">
          Generate personalized LinkedIn messages — connection request + 2 follow-ups — that sound human.
          Hand the output to <a href="https://salesrobot.co" target="_blank" rel="noreferrer" className="text-emerald-700 underline-offset-2 hover:underline">Salesrobot</a> or any LinkedIn automation tool to send.
        </p>
      </header>
      <OutreachWorkspace />
    </div>
  );
}
