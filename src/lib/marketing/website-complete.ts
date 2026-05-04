import type { MarketingProject } from "./types";

export const websiteComplete: MarketingProject = {
  id: "website-complete",
  name: "taimurtools.com",
  tagline: "36 free AI tools. No signups. Browser-based. Built for creators.",
  domain: "taimurtools.com",
  brandFooter: "36 free AI tools — no signup",
  accent: "text-violet-600",
  pickerEmoji: "🛠️",
  pickerSummary: "36 free browser-based AI tools — image, video, PDF, marketing, business.",
  pickerGradient: "from-violet-300/40 via-fuchsia-300/30 to-sky-300/30",

  posts: [
    /* ─────────────────────── LinkedIn ─────────────────────── */
    {
      platform: "linkedin",
      variant: "Founder story",
      bodies: [
        `I got tired of paying for 8 different SaaS tools to do basic creator work.

→ Image compressor: $9/month
→ PDF to Word: $12/month
→ Video trimmer: $15/month
→ Resume builder: $10/month
→ SEO description generator: $20/month
... and so on.

That's $74/month for tools I use a few times a week.

So I built taimurtools.com — 36 free AI tools in one place. No signups. No data uploads stored. Browser-based processing wherever possible.

What's inside:
✓ 7 AI generators (image, video, writing, thumbnails, interior design)
✓ 7 image tools (compressor, resizer, converter, enhancer, BG remover, OCR)
✓ 5 video/audio tools (trimmer, GIF maker, vocal remover, TTS)
✓ 4 PDF tools (PDF ↔ Word, Excel, Image)
✓ 5 business tools (resume, ATS check, LinkedIn optimizer, lead enrichment)
✓ 5 marketing/SEO tools
✓ Utilities (QR, password gen)

5 free uses per tool per day. No credit card.

If you're a creator paying $50+/month for fragmented tools — try this first.`,

        `Most "AI for creators" platforms make you sign up before you see if the tool works.

I hated this. Friction = abandonment.

Built taimurtools.com on the opposite principle: 36 tools, all available immediately, no email required.

→ Open the page
→ Use the tool
→ Free for 5 uses per day per tool
→ Keep using or close the tab — your choice

What this enabled:
- Users from 13 countries on day 30 (zero ads)
- Average session: 8+ minutes (people actually use it)
- Highest-traffic tool: image compressor (free, instant, no signup)

The lesson: friction is a feature for the developer. It's a leak for the user.`,

        `What I learned shipping taimurtools.com (a vanilla-JS tool platform with 36 AI tools):

1. **No frameworks for tool sites** — vanilla HTML/CSS/JS loads in 200ms. React loads in 1.2s. Speed matters for tool platforms.

2. **Browser-side processing > server-side** — for image, video, PDF tools, do it client-side with ffmpeg.wasm, Tesseract.js, jsPDF. No file uploads, no server costs, no privacy concerns.

3. **Single PHP proxy for AI keys** — one /api-config.php file holds Gemini + HuggingFace keys. All client tools call through it. Update keys once, propagates everywhere.

4. **Free tier limits, not gates** — 5 uses/day per tool. No signup wall. Power users still get value, casual users don't bounce.

5. **Inline SVG icons** — no icon library. Cleaner code. Faster load.

The boring choices compounded into a fast, free, sticky tool platform.`,

        `60-day update on taimurtools.com:

→ 36 AI tools live across 7 categories
→ 13 countries reached (zero paid ads)
→ Browser-based processing for image/video/PDF (zero file storage)
→ Google Gemini 2.5 Flash + HuggingFace Flux for AI generators
→ Single PHP proxy for API key management
→ 7-page SEO-optimized site (sitemaps, JSON-LD, robots.txt)
→ Personal portfolio integrated (10+ years of AI dev / video editing / CS tutoring work)

What's working: zero-signup tool access. People come for one tool, discover 5 more.

What I'm building next: blog (lower-funnel SEO), individual tool pages (split tools.html into 36 pages for SEO long-tail).

If you build creator tools — happy to share what's working.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Problem-solution",
      bodies: [
        `The cost of "I'll just use that one tool" adds up.

For most creators:
- Photoshop ($21/month) for basic image edits
- Adobe Acrobat ($15/month) for PDF conversions
- Canva Pro ($15/month) for thumbnails
- Descript ($15/month) for audio cleanup
- Some random SEO tool ($30/month) for descriptions

That's $96/month for tools you don't use daily.

taimurtools.com solves this with 36 free browser-based tools covering:
- Image (compress, resize, convert, enhance, remove BG)
- Video/audio (trim, GIF, convert, vocal remove, TTS)
- PDF (to Word, Excel, image)
- Business (resume, ATS, LinkedIn optimizer)
- Marketing (SEO, captions, repurposer)
- Utilities (QR, password)

Free tier covers casual use. No signup. No card.

Stop renting tools you use twice a month.`,

        `Most "all-in-one creator platforms" fail because they're built for power users.

10 features deep in 2 categories. Useless for someone who needs to compress an image once.

taimurtools.com is the inverse: 36 tools, light/medium depth in many categories. Optimized for "I just need to do X once."

The user journey:
→ Search "compress jpeg online" on Google
→ Land on taimurtools.com
→ Use the compressor in 30 seconds
→ Discover 8 other tools they didn't know existed
→ Bookmark for next time

Friction-free → habit-forming. The opposite of every signup-required SaaS.`,

        `Why I built taimurtools.com without any frameworks:

Tool sites don't need React. They need to load fast.

→ Vanilla HTML/CSS/JS bundle: ~50kb gzipped
→ Equivalent React app: ~250kb minimum
→ Page load on slow 3G: 200ms vs 1.5s

Difference for users in markets with slower internet (Pakistan, India, parts of Africa, Latin America): massive.

Plus — single HTML file per tool means I can host on any cheap server. No build step. No CI. No "vercel cold start" issue.

Sometimes the right tech is the boring one.`,

        `Browser-side processing was the most underrated decision in taimurtools.com.

Image tools? Use Canvas API. No upload.
PDF tools? Use jsPDF + pdf-lib. No upload.
Video tools? Use ffmpeg.wasm. No upload.
OCR? Use Tesseract.js. No upload.
Audio? Web Audio API. No upload.

What this gives users:
✓ Zero privacy concerns (file never leaves browser)
✓ Instant feedback (no upload time)
✓ Works offline once loaded
✓ Zero server cost for me

What this gives me:
✓ No data storage liability
✓ No bandwidth bills
✓ Scales infinitely

Every "creator tool" SaaS I've used uploads files. None of them needed to. It was a server-side architecture choice that ignored what browsers can already do.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Specific feature",
      bodies: [
        `The 7 AI generators in taimurtools.com:

1. **Image generator** — Flux model, customizable size + style
2. **Video generator** — text-to-video via HuggingFace pipeline
3. **Writing assistant** — Gemini 2.5 Flash for blog/social/email drafts
4. **Thumbnail generator** — for YouTube creators
5. **Interior design** — upload room → get redesign concepts
6. **ASMR generator** — audio mood prompts
7. **Cinematic prompts** — for Midjourney/Sora users

All free 5x/day. No signups.

Built specifically because most "AI generator" tools require ChatGPT Plus or similar. Wanted to give creators free starter access without the credit card friction.`,

        `5 business tools in taimurtools.com that nobody talks about:

1. **Resume builder** — clean templates, ATS-friendly output
2. **ATS checker** — paste a JD + resume, get score + improvement notes
3. **LinkedIn optimizer** — analyzes your profile, suggests tweaks
4. **Lead enrichment** — paste a name + company, get LinkedIn + role + email patterns
5. **Doc writer** — meeting notes → polished doc, transcript → summary

Each one replaces a $20-30/month SaaS subscription.

Free 5x/day. No signups.

For job seekers and salespeople — start here before paying for premium tools.`,

        `Marketing/SEO tools in taimurtools.com that punch above their weight:

1. **SEO description generator** — meta descriptions tuned for click-through
2. **Multilingual SEO** — translate + localize for 20+ languages
3. **Content repurposer** — blog → tweet thread → LinkedIn post → IG carousel
4. **Caption generator** — for IG, TikTok, YouTube
5. **Review responder** — auto-drafts replies to Google/Facebook reviews

Each tool uses Gemini 2.5 Flash with carefully crafted prompts.

Free 5x/day. Want unlimited? Premium tier unlocks all.

Built because most SEO tools cost $99+/month. Wanted a free path for indie creators.`,

        `5 video/audio tools in taimurtools.com that work entirely in your browser:

1. **Video trimmer** — ffmpeg.wasm, no upload, no quality loss
2. **GIF maker** — from video clips, full client-side
3. **Format converter** — MP4 ↔ WebM ↔ MOV, browser-side
4. **Vocal remover** — separates vocals from instrumental, AI-powered
5. **Text-to-speech** — multiple voices + languages

What's wild: ffmpeg.wasm is so good now that browser-side video editing rivals desktop apps for basic operations.

Why pay for Premiere or Descript for a 30-second trim?

Free 5x/day. No signup.`,
      ],
    },

    /* ─────────────────────── X / Twitter ─────────────────────── */
    {
      platform: "twitter",
      variant: "Punchy one-liner",
      bodies: [
        `36 free AI tools. no signup. no upload.

taimurtools.com.

stop paying for SaaS you use twice a month.`,

        `built taimurtools.com because:

- $50/mo for image compressor = no
- email signup for "free" tool = no
- file uploaded to a server = no

36 tools. browser-side. instant. free.`,

        `every "free" AI tool: "sign up to continue."

taimurtools.com: just use it.

36 tools. 5 uses each per day. zero friction.`,

        `most creator tools are built backwards:

→ signup wall
→ free trial
→ feature gates
→ "upgrade for X"

taimurtools.com inverts:
→ open
→ use
→ optional premium

friction is a leak.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Tool stack",
      bodies: [
        `taimurtools.com — 36 free AI tools:

→ 7 AI generators (image, video, writing, thumbnails)
→ 7 image tools (compress, resize, BG remove, OCR)
→ 5 video tools (trim, GIF, vocal remove, TTS)
→ 4 PDF tools
→ 5 business tools (resume, ATS, LinkedIn)
→ 5 marketing/SEO tools

free 5x/day. no signup.`,

        `things taimurtools.com replaces for $0:

photoshop basic edits
adobe acrobat conversions
canva thumbnails
descript audio cleanup
SEO subscriptions
resume builders
PDF tools
QR generators

36 tools. browser-side. free.`,

        `tools in taimurtools.com that do real work:

✓ flux image generator (free!)
✓ ffmpeg.wasm video trim (no upload)
✓ tesseract OCR (browser-side)
✓ ATS resume checker
✓ LinkedIn profile optimizer
✓ multilingual SEO

5 free uses each per day.`,

        `built taimurtools.com w/ vanilla HTML+JS:

→ 50kb gzip vs 250kb React
→ 200ms load vs 1.5s
→ deploy to any cheap host
→ no build step
→ no cold starts

right tech for the right job.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Privacy / browser-side",
      bodies: [
        `taimurtools.com processes files in YOUR browser.

image compressor → canvas API
PDF conversion → jsPDF
video trim → ffmpeg.wasm
OCR → tesseract.js

your file never hits a server.

privacy + speed + zero my-bandwidth-cost.`,

        `every other "free PDF tool" uploads your file to a server.

your contract goes through someone else's machine.

taimurtools.com runs jsPDF + pdf-lib in your browser. file never leaves your computer.

privacy is a feature.`,

        `what browser-based processing in taimurtools.com gives users:

→ zero privacy concerns
→ instant feedback (no upload time)
→ works offline after first load
→ no rate limits on file size
→ no "your free tier ran out" surprises

the web platform is more capable than most SaaS thinks.`,

        `unpopular opinion:

most "AI for creators" SaaS uploads files server-side because it's easier to build, not because it's needed.

modern browsers can do image, PDF, video, OCR processing locally.

taimurtools.com proves it. 36 tools. zero file storage.`,
      ],
    },

    /* ─────────────────────── Facebook ─────────────────────── */
    {
      platform: "facebook",
      variant: "Conversational",
      bodies: [
        `Hey creators + freelancers + students — built something free for you.

taimurtools.com — 36 AI-powered tools in one place:
→ Image (compress, resize, BG remove, OCR)
→ Video (trim, GIF, vocal remove, TTS)
→ PDF (to Word, Excel, image)
→ Business (resume builder, ATS checker, LinkedIn optimizer)
→ Marketing (SEO, captions, repurposer)
→ AI generators (image, video, writing)

Free 5 uses per day per tool. No signup. Browser-based. Zero file uploads stored.

Try it. Tell me what's missing. Tag a friend who's drowning in $9/month tool subscriptions.`,

        `Real talk for creators paying for fragmented SaaS:

How much do you spend per month on tools you use less than weekly?

For most: $40-100/month across image editors, PDF converters, SEO tools, resume builders, etc.

Built taimurtools.com to bundle 36 of these into one free platform. No signups. Browser-side processing wherever possible.

If you've been paying for tools you use 2-3 times a month — try this first. Free tier covers most use cases.`,

        `Question for the creators here:

What's the most painful "I need to do this once and don't want to subscribe to a SaaS for it" task you face?

For me it was compressing images, trimming clips, and converting PDFs.

Built taimurtools.com to solve all three (and 33 more). Free. Browser-based. No signup.

Curious what other one-off tasks you'd want included. Drop the most painful below.`,

        `For creators in Pakistan + South Asia reading this:

Most "creator SaaS" doesn't make economic sense in PKR/INR markets. $20/month is reasonable in USD, painful in local currency.

Built taimurtools.com partly for this. 36 tools, free tier, browser-side processing.

Reach me if there's a tool you'd want added. Built it for our market reality first.`,
      ],
    },
    {
      platform: "facebook",
      variant: "Launch announce",
      bodies: [
        `taimurtools.com is now live.

36 free AI tools across 7 categories:
🎨 7 AI generators (image, video, writing, thumbnails, interior design, ASMR, cinematic)
🖼️ 7 image tools (compressor, resizer, converter, enhancer, BG remover, OCR)
🎥 5 video/audio tools (trimmer, GIF, converter, vocal remover, TTS)
📄 4 PDF tools (PDF ↔ Word/Excel/Image)
💼 5 business tools (resume, ATS, LinkedIn, lead enrichment, doc writer)
📈 5 marketing/SEO tools
🛠️ Utilities (QR, password generator)

Free 5 uses per day. No signups. No file uploads stored.

Bookmark + share with anyone who'd benefit.`,

        `Big update on taimurtools.com this month:

→ Added 5 new AI generators (interior design, ASMR, cinematic prompts, video, thumbnail)
→ Improved video trimmer (ffmpeg.wasm 0.12 — 40% faster)
→ Multilingual SEO now supports 20 languages
→ ATS checker scoring algorithm refined
→ Mobile-first redesign across all tools

For creators, freelancers, students — it's free. Bookmark it.`,

        `Quietly launched taimurtools.com earlier this year. Now serving users across 13 countries.

What it does:
- 36 AI tools in one place
- Browser-based processing (zero file uploads)
- Free tier covers casual use
- No signups, no email required
- Built with vanilla JS for speed

For anyone tired of paying $50+/month for tools they barely use — bookmark this.`,

        `For creators reading this — three reasons to bookmark taimurtools.com:

1. 36 tools cover most one-off creator tasks
2. Free tier (5 uses/day per tool) handles casual workloads
3. Browser-side processing = zero privacy concerns

If you find yourself paying for SaaS tools you use twice a month — start here instead.`,
      ],
    },

    /* ─────────────────────── Instagram ─────────────────────── */
    {
      platform: "instagram",
      variant: "Save-worthy carousel hook",
      bodies: [
        `Creators — save this.

taimurtools.com — 36 free AI tools in one place:

→ 7 AI generators (image, video, writing)
→ 7 image tools (compress, resize, BG remove)
→ 5 video tools (trim, GIF, vocal remove, TTS)
→ 4 PDF tools
→ 5 business tools (resume, ATS, LinkedIn)
→ 5 marketing/SEO tools
→ Utilities (QR, password)

Free 5 uses/day. No signup. No file uploads stored.

Stop paying $50+/month for fragmented SaaS.

Save this 📌`,

        `The free creator toolbox you didn't know you needed:

→ 36 AI tools
→ Browser-based processing
→ Zero signups
→ Zero file uploads
→ Free 5 uses/day per tool

taimurtools.com.

Save this for the next time you say "I need to compress this image / trim this clip / convert this PDF." 📌`,

        `If you currently pay for:
❌ Image compressor SaaS
❌ PDF to Word converter
❌ Video trimmer
❌ Resume builder
❌ SEO description tool

— save this.

taimurtools.com replaces all of them. Free. Browser-based. No signup.

Tag a creator drowning in subscriptions 📌`,

        `Real talk for creators paying for tools they barely use:

$9/month here.
$15/month there.
$20/month for "premium."

Adds up to $50-100/month for tools you open 4 times.

taimurtools.com — 36 tools, free tier covers casual use.

Save this if you've ever cancelled then re-subscribed to the same SaaS 📌`,
      ],
      hashtags: "#FreeAITools #CreatorTools #AITools #Productivity #SoloFounder #FreelancerLife #DigitalTools #BuildInPublic #SaaSAlternative #IndieMaker",
    },
    {
      platform: "instagram",
      variant: "Direct CTA",
      bodies: [
        `Stop paying for SaaS you use twice a month.

taimurtools.com — 36 free AI tools. No signup.

Link in bio.`,

        `36 tools.
0 signups.
0 file uploads stored.
Free 5 uses/day each.

taimurtools.com. Bookmark it.`,

        `Need to compress an image, trim a clip, convert a PDF, build a resume, or write SEO copy?

taimurtools.com does all of it. Free. No signup.

Link in bio.`,

        `One free creator toolbox.
36 tools.
Zero subscription.
Zero account required.

taimurtools.com. Tag a creator who needs this.`,
      ],
      hashtags: "#FreeAITools #CreatorTools #DigitalTools #FreelancerTools #ContentCreator #AITools #Productivity",
    },
    {
      platform: "instagram",
      variant: "Question hook",
      bodies: [
        `How much do you pay per month for SaaS tools you use less than weekly?

For most creators: $40-100/month.

taimurtools.com bundles 36 of those tools into one free platform.

Save this 📌`,

        `Quick check — when's the last time you used your $9/month image compressor SaaS?

Probably 2 weeks ago. Probably for one image.

taimurtools.com has the same compressor. Free. Browser-side. No signup.

Save this 📌`,

        `What if your "creator toolkit" wasn't 8 separate subscriptions?

taimurtools.com — 36 tools in one place. Free tier. No signups.

Save this if you've ever forgotten which SaaS you're subscribed to 📌`,

        `For freelancers + creators in PK / India / SEA:

Most creator SaaS prices in USD. $20/month is heavy in local currency.

taimurtools.com is free at the daily-use level. Built knowing not every market has $20/month tool budgets.

Save this 📌`,
      ],
      hashtags: "#FreeAITools #CreatorEconomy #FreelancerTools #DigitalPakistan #ContentCreator #ProductivityHacks #AITools",
    },
  ],

  cards: [
    {
      kind: "hero",
      id: "hero",
      emoji: "🛠️",
      title1: "36 free AI tools.",
      title2: "No signup.",
      subtitle: "Image · Video · PDF · Business · Marketing · AI",
      pills: ["Image", "Video", "PDF", "AI Gen"],
      palettes: [
        { from: "#7c3aed", via: "#ec4899", to: "#f97316" },
        { from: "#4338ca", via: "#a855f7", to: "#ec4899" },
        { from: "#312e81", via: "#7c3aed", to: "#f59e0b" },
        { from: "#1e1b4b", via: "#4f46e5", to: "#ec4899" },
      ],
    },
    {
      kind: "stat",
      id: "tools",
      emoji: "✨",
      number: "36",
      label: "free AI tools",
      sublabel: "across 7 categories",
      items: ["Image gen", "Video gen", "Writing", "Thumbnails", "Compressor", "Resizer", "BG remover", "OCR", "PDF↔Word", "Trimmer", "Vocal removr", "Resume bldr"],
      palettes: [
        { from: "#0ea5e9", via: "#7c3aed", to: "#ec4899" },
        { from: "#06b6d4", via: "#4f46e5", to: "#a855f7" },
        { from: "#0891b2", via: "#7c3aed", to: "#f97316" },
        { from: "#0c4a6e", via: "#1d4ed8", to: "#a855f7" },
      ],
    },
    {
      kind: "duo",
      id: "privacy",
      emoji: "🔒",
      top: "0",
      bottom: "UPLOADS",
      caption: "Browser-side processing. Files never leave your device.",
      palettes: [
        { from: "#10b981", via: "#0ea5e9", to: "#7c3aed" },
        { from: "#22c55e", via: "#06b6d4", to: "#4f46e5" },
        { from: "#0d9488", via: "#0891b2", to: "#7c3aed" },
        { from: "#065f46", via: "#0ea5e9", to: "#a855f7" },
      ],
    },
    {
      kind: "centerpiece",
      id: "no-signup",
      emoji: "⚡",
      title1: "Open the page.",
      title2: "Use the tool.",
      caption1: "No signup. No email. No card.",
      caption2: "Free 5 uses/day per tool.",
      palettes: [
        { from: "#facc15", via: "#f97316", to: "#dc2626" },
        { from: "#fde047", via: "#ec4899", to: "#7c3aed" },
        { from: "#fb923c", via: "#dc2626", to: "#9d174d" },
        { from: "#facc15", via: "#ec4899", to: "#7c3aed" },
      ],
    },
    {
      kind: "outreach",
      id: "categories",
      emoji: "📚",
      number: "7",
      label: "categories",
      subtitle: "everything a creator needs in one place.",
      rows: [
        { day: "AI GEN", text: "→ Image, video, writing, thumbnails" },
        { day: "MEDIA", text: "→ Image, video, audio, PDF tools" },
        { day: "WORK", text: "→ Resume, ATS, LinkedIn, SEO, captions" },
      ],
      palettes: [
        { from: "#06b6d4", via: "#7c3aed", to: "#ec4899" },
        { from: "#0891b2", via: "#4f46e5", to: "#f97316" },
        { from: "#1d4ed8", via: "#a855f7", to: "#dc2626" },
        { from: "#0c4a6e", via: "#7c3aed", to: "#facc15" },
      ],
    },
    {
      kind: "stack",
      id: "stack",
      emoji: "🌐",
      title1: "Built fast,",
      title2: "served free.",
      features: [
        { emoji: "⚡", label: "Vanilla JS" },
        { emoji: "🔒", label: "Browser-side" },
        { emoji: "🚫", label: "No signup" },
        { emoji: "🤖", label: "Gemini + Flux" },
        { emoji: "📱", label: "Mobile-ready" },
        { emoji: "🌍", label: "13 countries" },
      ],
      palettes: [
        { from: "#0f172a", via: "#7c3aed", to: "#ec4899" },
        { from: "#1e1b4b", via: "#4f46e5", to: "#f97316" },
        { from: "#020617", via: "#a855f7", to: "#facc15" },
        { from: "#18181b", via: "#7c3aed", to: "#0ea5e9" },
      ],
    },
  ],
};
