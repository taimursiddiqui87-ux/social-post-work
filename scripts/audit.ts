// Diagnose why new sources aren't showing in the queue.
import { supabaseAdmin } from "../src/lib/supabase";

(async () => {
  const sb = supabaseAdmin();

  // Items per source, broken down by status
  const { data: sources } = await sb.from("sources").select("id,name").order("name");

  console.log("Items per source (status: new / drafted / rejected):");
  console.log("─".repeat(72));
  for (const s of sources ?? []) {
    const [n, d, r] = await Promise.all([
      sb.from("items").select("id", { count: "exact", head: true }).eq("source_id", s.id).eq("status", "new"),
      sb.from("items").select("id", { count: "exact", head: true }).eq("source_id", s.id).eq("status", "drafted"),
      sb.from("items").select("id", { count: "exact", head: true }).eq("source_id", s.id).eq("status", "rejected"),
    ]);
    const total = (n.count ?? 0) + (d.count ?? 0) + (r.count ?? 0);
    console.log(`  ${s.name.padEnd(28)} ${String(n.count ?? 0).padStart(4)} new  ${String(d.count ?? 0).padStart(4)} drafted  ${String(r.count ?? 0).padStart(4)} rejected  (${total} total)`);
  }

  console.log("");
  // Pending drafts per source
  console.log("Pending drafts in queue, grouped by source:");
  console.log("─".repeat(72));
  const { data: pending } = await sb
    .from("drafts")
    .select("id,items(source_id,sources(name))")
    .eq("status", "pending")
    .limit(500);
  const byName = new Map<string, number>();
  for (const d of (pending ?? []) as unknown as { items: { sources: { name: string } | null } | null }[]) {
    const n = d.items?.sources?.name ?? "(no source)";
    byName.set(n, (byName.get(n) ?? 0) + 1);
  }
  for (const [name, count] of [...byName.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name.padEnd(28)} ${count}`);
  }
  if (byName.size === 0) console.log("  (no pending drafts)");
})();
