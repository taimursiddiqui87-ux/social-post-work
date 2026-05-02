// Delete pending drafts whose item has no source (source was deleted earlier).
import { supabaseAdmin } from "../src/lib/supabase";

(async () => {
  const sb = supabaseAdmin();

  // Find pending drafts -> their items -> identify which item.source_id is null
  const { data: drafts } = await sb
    .from("drafts")
    .select("id,item_id,items(source_id)")
    .eq("status", "pending");

  type Row = { id: string; item_id: string; items: { source_id: string | null } | null };
  const orphans = ((drafts ?? []) as unknown as Row[]).filter((d) => !d.items?.source_id);

  if (orphans.length === 0) { console.log("No orphan drafts."); return; }

  const ids = orphans.map((o) => o.id);
  const { error } = await sb.from("drafts").delete().in("id", ids);
  if (error) throw error;
  console.log(`Deleted ${ids.length} orphan drafts (items with no source).`);
})();
