// Apply the canonical source list (src/lib/sources-config.ts) to Supabase.
// Idempotent — adds new sources, updates URLs of existing ones (matched by name).
// Run with: npm run sync-sources

import { supabaseAdmin } from "../src/lib/supabase";
import { SOURCES } from "../src/lib/sources-config";

(async () => {
  const sb = supabaseAdmin();

  // Upsert by name. Schema's primary key is `id` (uuid), and there's no unique
  // constraint on `name`, so we do select-then-insert/update manually.
  const { data: existing, error: selErr } = await sb
    .from("sources")
    .select("id,name,url,enabled");
  if (selErr) throw selErr;

  const byName = new Map((existing ?? []).map((r) => [r.name as string, r as { id: string; name: string; url: string; enabled: boolean }]));

  const toInsert: { name: string; url: string; kind: string; enabled: boolean }[] = [];
  const toUpdate: { id: string; url: string }[] = [];
  let unchanged = 0;

  for (const s of SOURCES) {
    const cur = byName.get(s.name);
    if (!cur) {
      toInsert.push({ name: s.name, url: s.url, kind: s.kind, enabled: true });
    } else if (cur.url !== s.url) {
      toUpdate.push({ id: cur.id, url: s.url });
    } else {
      unchanged++;
    }
  }

  let inserted = 0;
  if (toInsert.length) {
    const { data, error } = await sb.from("sources").insert(toInsert).select("id");
    if (error) throw error;
    inserted = data?.length ?? 0;
  }

  let updated = 0;
  for (const u of toUpdate) {
    const { error } = await sb.from("sources").update({ url: u.url }).eq("id", u.id);
    if (error) throw error;
    updated++;
  }

  console.log(`Sync complete:`);
  console.log(`  inserted:  ${inserted}`);
  console.log(`  updated:   ${updated}`);
  console.log(`  unchanged: ${unchanged}`);
  console.log(`  total in canonical config: ${SOURCES.length}`);
  console.log("");

  // Show full state after
  const { data: after } = await sb.from("sources").select("name,enabled").order("name");
  console.log("Active sources in DB:");
  for (const s of after ?? []) console.log(`  ${s.enabled ? "✓" : "✗"} ${s.name}`);
})();
