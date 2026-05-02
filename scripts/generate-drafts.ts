import { generateDraftsForNewItems } from "../src/lib/drafter";

(async () => {
  const r = await generateDraftsForNewItems({ limit: 6 });
  console.log(JSON.stringify(r, null, 2));
})();
