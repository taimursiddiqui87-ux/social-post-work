import { supabaseAdmin } from "../src/lib/supabase";

(async () => {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("sources")
    .select("name,url,enabled")
    .order("name");
  if (error) throw error;
  console.log(`Total sources: ${data?.length ?? 0}`);
  console.log("");
  for (const s of data ?? []) {
    console.log(`  ${s.enabled ? "✓" : "✗"}  ${s.name.padEnd(28)} ${s.url}`);
  }
})();
