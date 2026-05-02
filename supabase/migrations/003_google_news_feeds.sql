-- Adds Google News RSS feeds to fill coverage gaps for vendors
-- without official RSS (Anthropic/Claude, xAI/Grok) and topic-specific
-- updates (Veo 3, Gemini API, AI API changes).
--
-- Run this in the Supabase SQL editor.

insert into sources (name, url, kind) values
  ('Claude / Anthropic',
   'https://news.google.com/rss/search?q=Anthropic+Claude+OR+%22Claude+API%22&hl=en-US&gl=US&ceid=US:en',
   'rss'),
  ('Grok / xAI',
   'https://news.google.com/rss/search?q=Grok+xAI&hl=en-US&gl=US&ceid=US:en',
   'rss'),
  ('Veo / Google AI Models',
   'https://news.google.com/rss/search?q=%22Veo+3%22+OR+%22Google+Gemini+API%22&hl=en-US&gl=US&ceid=US:en',
   'rss'),
  ('AI API Updates',
   'https://news.google.com/rss/search?q=%22API+update%22+AI+OpenAI+OR+Anthropic+OR+Google&hl=en-US&gl=US&ceid=US:en',
   'rss')
on conflict do nothing;
