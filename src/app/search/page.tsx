import { SearchPanel } from "@/components/SearchPanel";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-[36px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">Search</h1>
        <p className="mt-2 text-[15.5px] text-zinc-600">
          Search across all fetched AI articles. Then ask AI a question about the results.
        </p>
      </header>
      <SearchPanel />
    </div>
  );
}
