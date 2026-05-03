import { SearchPanel } from "@/components/SearchPanel";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">Ask AI</h1>
        <p className="mt-2 text-[15.5px] text-zinc-600">
          Ask anything about AI, models, tools, or current events. The AI uses your fetched articles when relevant — and its general knowledge when not.
        </p>
      </header>
      <SearchPanel />
    </div>
  );
}
