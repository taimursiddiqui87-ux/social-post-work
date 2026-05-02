// Usage: npm run generate-drafts -- <user-id-uuid>
// Produces 6 drafts for the given user. Find your user-id in
// Supabase dashboard → Authentication → Users.

import { generateDraftsForUser } from "../src/lib/drafter";

(async () => {
  const userId = process.argv[2];
  if (!userId) {
    console.error("Usage: npm run generate-drafts -- <user-id-uuid>");
    process.exit(1);
  }
  const r = await generateDraftsForUser(userId, { limit: 6 });
  console.log(JSON.stringify(r, null, 2));
})();
