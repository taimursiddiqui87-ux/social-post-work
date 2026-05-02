# Deploy + install as desktop app

The end goal: a real desktop icon that opens the app online — no more `localhost:3001` hunting.
The path: deploy to Vercel (free), then "Install app" from Edge/Chrome (free, native-feeling).

## 1. Push the code to GitHub (5 min)

```bash
cd "C:/Users/Taimur/Documents/Social Post Work App"
git init
git add .
git commit -m "Initial: AI news → social drafts pipeline"
```

Then on https://github.com → **New repository** → name it (e.g. `social-post-work`) → Private → Create.
GitHub shows commands to push an existing repo — copy the two lines starting with `git remote add` and `git push`.

## 2. Deploy to Vercel (3 min)

1. Go to https://vercel.com → Sign in with GitHub.
2. **Add New → Project** → pick your repo → Import.
3. Framework: Next.js (auto-detected). Don't change anything yet.
4. Expand **Environment Variables** — paste each line from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`
   - `CRON_SECRET`
5. Click **Deploy**. After ~2 min you get a URL like `https://social-post-work.vercel.app`.

## 3. Install as a desktop app (1 min)

In Edge or Chrome, open your new Vercel URL.

- **Edge:** click the Apps icon in the address bar (looks like a monitor with an arrow), or `Settings → Apps → Install this site as an app`.
- **Chrome:** click the install icon in the address bar (right side, looks like a screen with a down-arrow), or `⋮ menu → Cast, save, share → Install page as app`.

You now have:
- A **desktop icon** (and Start menu entry) called "Social Post Work"
- An app window with no browser chrome (no URL bar, no tabs) — looks like a native app
- It always points to your live Vercel URL, so updates are instant when you push code

## 4. Future updates

Any `git push` to your GitHub repo redeploys automatically. The desktop app shows the new version on next open.

## Optional: real native wrapper

The PWA above covers ~99% of "feels like a desktop app." If you ever want a true native installer (.exe on Windows), the cheapest path is **Tauri** — wraps the same web app, ~3MB binary, but adds a Rust toolchain to your build. Not worth it unless you need OS integrations like notifications or auto-launch.

## Updating sources after deploy

The Supabase project is shared between local + production, so SQL migrations only need to run once. To add a new RSS feed without code:
```sql
insert into sources (name, url, kind) values ('Some new AI blog', 'https://example.com/feed', 'rss');
```
