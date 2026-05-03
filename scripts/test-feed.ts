// One-off: test specific feed URLs against rss-parser to see what we get.
import Parser from "rss-parser";

const parser = new Parser({ timeout: 12000, headers: { "User-Agent": "SocialPostWork/0.1 (+rss)" } });

const URLS = [
  "https://www.technologyreview.com/topic/artificial-intelligence/feed",
  "https://research.facebook.com/feed.xml",
];

(async () => {
  for (const url of URLS) {
    try {
      const f = await parser.parseURL(url);
      console.log(`✓ ${url}`);
      console.log(`  title: ${f.title}`);
      console.log(`  items: ${f.items?.length ?? 0}`);
      if (f.items?.[0]) console.log(`  first: "${f.items[0].title?.slice(0, 60)}" — ${f.items[0].link}`);
      console.log("");
    } catch (e) {
      console.log(`✗ ${url}: ${(e as Error).message}`);
      console.log("");
    }
  }
})();
