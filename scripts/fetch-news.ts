import { fetchAllSources } from "../src/lib/fetch-news";

(async () => {
  const r = await fetchAllSources();
  console.log(JSON.stringify(r, null, 2));
})();
