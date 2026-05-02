-- Run this in Supabase SQL editor to update sources for an existing project.
-- Drops MIT Tech Review (low volume) + the noisy "AI" HN feed,
-- adds vendor-direct + commentary feeds.

delete from sources where name in ('MIT Tech Review AI', 'Hacker News (AI)', 'Anthropic News');

insert into sources (name, url, kind) values
  ('Hugging Face Blog',     'https://huggingface.co/blog/feed.xml', 'rss'),
  ('Simon Willison',        'https://simonwillison.net/atom/everything/', 'rss'),
  ('Latent Space',          'https://www.latent.space/feed', 'rss'),
  ('AI News (smol)',        'https://buttondown.email/ainews/rss', 'rss'),
  ('Show HN AI Launches',   'https://hnrss.org/show?q=AI+OR+LLM+OR+%22AI+tool%22+OR+%22AI+agent%22&points=20', 'rss')
on conflict do nothing;

-- One-off URL fixes from earlier
update sources set url='https://www.theverge.com/rss/ai-artificial-intelligence/index.xml'
  where name='The Verge AI';
