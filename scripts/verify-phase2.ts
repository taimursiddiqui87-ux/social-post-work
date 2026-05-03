import { supabaseAdmin } from "../src/lib/supabase";

(async () => {
  const sb = supabaseAdmin();
  const checks: string[] = [];

  // 1. usage_limits table exists with expected columns
  const { data: usage, error: usageErr } = await sb
    .from("usage_limits")
    .select("ip,fetch_count,draft_count,ask_count,unlocked,reset_date")
    .limit(1);
  if (usageErr) checks.push(`✗ usage_limits: ${usageErr.message}`);
  else checks.push(`✓ usage_limits table OK (${usage?.length ?? 0} rows visible)`);

  // 2. drafts has language column
  const { error: langErr } = await sb
    .from("drafts")
    .select("id,language")
    .limit(1);
  if (langErr) checks.push(`✗ drafts.language: ${langErr.message}`);
  else checks.push(`✓ drafts.language column OK`);

  // 3. drafts platform constraint allows 'twitter'
  const testInsert = await sb.from("drafts").insert({
    item_id: "00000000-0000-0000-0000-000000000000",
    platform: "twitter",
    body: "test",
  }).select("id").maybeSingle();
  if (testInsert.error?.code === "23503") {
    // FK violation = constraint accepted 'twitter', just rejected fake item_id
    checks.push(`✓ drafts.platform allows 'twitter'`);
  } else if (testInsert.error?.message?.includes("drafts_platform_check")) {
    checks.push(`✗ drafts.platform constraint blocks 'twitter': ${testInsert.error.message}`);
  } else if (testInsert.error) {
    checks.push(`? drafts.platform check: ${testInsert.error.message}`);
  } else if (testInsert.data?.id) {
    // Unlikely (fake FK) but clean up
    await sb.from("drafts").delete().eq("id", testInsert.data.id);
    checks.push(`✓ drafts.platform allows 'twitter'`);
  }

  // 4. UNLOCK_CODE env present
  if (process.env.UNLOCK_CODE) {
    checks.push(`✓ UNLOCK_CODE set: ${process.env.UNLOCK_CODE.slice(0, 4)}…`);
  } else {
    checks.push(`✗ UNLOCK_CODE not set in .env.local`);
  }

  console.log(checks.join("\n"));
})();
