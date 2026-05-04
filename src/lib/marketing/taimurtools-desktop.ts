import type { MarketingProject } from "./types";

export const taimurtoolsDesktop: MarketingProject = {
  id: "taimurtools-desktop",
  name: "TaimurTools Desktop",
  tagline: "36 free AI tools as a native Windows app. Auto-updates included.",
  domain: "taimurtools.com",
  brandFooter: "TaimurTools — native Windows app",
  accent: "text-cyan-600",
  pickerEmoji: "💻",
  pickerSummary: "Native Windows app for all 36 taimurtools.com tools — Apple-style UI, auto-updates.",
  pickerGradient: "from-cyan-300/40 via-sky-300/30 to-indigo-300/30",

  posts: [
    /* ─────────────────────── LinkedIn ─────────────────────── */
    {
      platform: "linkedin",
      variant: "Founder story",
      bodies: [
        `Built a desktop app from a website in one afternoon.

Sounds like a hack — actually a deliberate strategy.

taimurtools.com had 36 AI tools. People kept asking "is there a desktop version?"

Most developers would build one from scratch. Months of work. Different codebase.

Instead, I wrapped the existing tools in Electron:
→ Native Windows window (1440×900, frameless, traffic-light buttons, Apple-style)
→ Sidebar with 8 tool categories
→ Real-time search (Ctrl+F)
→ Auto-update system (delta downloads, rollback support — works like Claude Desktop)
→ Status indicators
→ Portable .exe + NSIS installer variants

Same 36 tools. Native shell. Auto-updates seamlessly.

The unlock: API keys live in a single PHP proxy on the website. Update keys once, all installed apps get them. No re-deploys. No version mismatches.

Built TaimurTools Desktop in one focused build session. Shipped to users the same week.

Sometimes the right architecture is "wrap what you already have."`,

        `Three months after launching taimurtools.com, users kept asking the same thing:

"Why isn't there a desktop version?"

Two reasons people want desktop:
1. They prefer apps to browser tabs (especially power users)
2. They want one shortcut on the dock instead of bookmarks

So I built TaimurTools Desktop in a single weekend with Electron. Wrapped the existing web tools. Apple-style chrome. Auto-update system. Same 36 tools.

Why this took a weekend instead of months:
- All tool logic stays on the website
- Desktop app is just a native shell + window management
- API keys managed via PHP proxy (one update point for all installs)
- Auto-updates use electron-builder's standard pipeline

For solo devs: when users ask for "desktop version," consider wrapping over rebuilding. 90% of the value, 10% of the work.`,

        `What I learned shipping TaimurTools Desktop:

1. **Electron gets a bad rap, but it's the right tool here.** Tauri is smaller but the developer ergonomics for shipping fast aren't there yet. Electron's auto-update system is mature.

2. **Frameless + traffic-light buttons make Electron apps feel native.** Default Electron chrome screams "Electron app." Custom titlebar = looks like Linear/Notion.

3. **Auto-updates are a feature.** Most indie desktop apps skip this. Users don't manually download updates. Building electron-builder's auto-update pipeline = your app actually stays current.

4. **Embedded webview > separate codebase.** taimurtools.com has 36 tools. Desktop loads them in a webview. No code duplication. Bug fix on the website = bug fix in desktop, automatically.

5. **NSIS installer + portable .exe** — give users both. Some want install. Some want USB-portable.

For solo developers: ship a desktop wrapper of your web app. Users love it. Doesn't take long.`,

        `60-day update on TaimurTools Desktop:

→ 35 tools accessible via native Windows app
→ Auto-update system shipped (delta downloads working)
→ Rollback support tested (deliberately broke v1.1, rolled back to v1.0)
→ Portable .exe + NSIS installer both available
→ Apple-style frameless window (traffic-light buttons, drag region)
→ Sidebar nav with 8 categories + Ctrl+F search
→ Status indicators (all systems operational)

The interesting metric: desktop users are 3x more engaged than web users. They open the app daily, average session 14 minutes vs. 8 on web.

Theory: desktop = lower friction for daily use. Web = better for one-off searches.

Both have a place. Building both was the right call.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Problem-solution",
      bodies: [
        `Three reasons web apps lose to desktop apps for daily-use creator tools:

1. **Browser tab rot** — your tool gets buried among 40 tabs. Out of sight, out of mind.

2. **Login persistence is unreliable** — browser cookies expire. Desktop apps stay logged in.

3. **Performance feels worse in browser** — even when it isn't. Native window = instant feel.

TaimurTools Desktop solves all three for the 36 tools on taimurtools.com:
✓ One dock icon, always accessible
✓ Persistent state across sessions
✓ Native window chrome = feels instant
✓ Auto-updates so it always has latest tools

If you use creator tools daily, the desktop format compounds. Friction drops to near-zero.`,

        `Why I built TaimurTools Desktop with Electron, not Tauri:

I know — Tauri is smaller, faster, more "modern."

But Electron has:
1. Mature auto-update pipeline (electron-builder)
2. Better cross-platform consistency
3. Larger ecosystem of plugins
4. Faster development for solo devs

For a tool wrapper that mostly loads a webview, Electron's overhead doesn't matter. Final installer is ~80MB. Cold start is 1.2s. Users don't notice.

What matters: shipping. I shipped TaimurTools Desktop in a weekend. Tauri equivalent would've taken 2-3 weeks (less mature plugin ecosystem, more boilerplate for auto-updates).

Right tool for the right constraint. "Smallest binary" wasn't mine. "Fastest to ship" was.`,

        `Auto-updates are the most underrated feature in TaimurTools Desktop.

Without auto-updates:
- Users stay on v1.0 forever
- Bug fixes don't reach them
- New tools added on the website don't appear in their app
- You support multiple stale versions

With auto-updates:
- Users always run the latest
- Delta downloads = small (only what changed)
- Rollback support if a release is bad
- One support burden: always v-current

electron-builder's auto-update pipeline is mature. Took me 2 hours to wire up. Should be a default for every indie desktop app.`,

        `The architectural pattern behind TaimurTools Desktop:

→ Electron shell loads taimurtools.com/tools.html in a webview
→ All tool logic stays on the website (zero re-implementation)
→ API keys managed via /api-config.php proxy on the website
→ One key rotation = all installed apps updated immediately
→ Auto-update via electron-builder when shell itself changes

What this gives me as the developer:
✓ One codebase to maintain (the website)
✓ Bug fixes propagate to desktop without re-shipping
✓ New tools appear in desktop automatically
✓ API key security isolated to one server file

What this gives users:
✓ Native app experience
✓ Always up-to-date tools
✓ Same workflow as web, better wrapper
✓ Auto-updating shell

Wrap > rebuild. For most "I want a desktop version" requests, wrapping is the right answer.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Specific feature",
      bodies: [
        `The Apple-style window in TaimurTools Desktop:

Most Electron apps look like Electron apps:
- Default OS chrome
- Generic gray titlebar
- "App is loading..." splash

TaimurTools Desktop:
- Frameless window
- Custom traffic-light buttons (close, minimize, maximize)
- Draggable region across the top
- Sidebar that mimics native macOS spacing
- Glass-blur effects

Result: feels like a Linear or Notion app, not "an Electron wrapper."

The polish doesn't matter functionally. It matters for trust. Users assume polished UI = polished underlying tools.

Shipping native-feeling Electron is mostly:
1. Frameless window
2. Custom titlebar with traffic lights
3. Good padding + spacing
4. System fonts (San Francisco / Segoe UI)

Hours of work, not weeks.`,

        `Real-time search (Ctrl+F) in TaimurTools Desktop is the feature users hit hardest.

35 tools across 8 categories is a lot to navigate.

The search:
- Open with Ctrl+F (or Cmd+F on macOS)
- Type tool name OR keyword
- Filters tool grid in real-time
- Enter launches the highlighted tool

What users typed in the first month:
- "compress" → 3 tools shown (image, video, PDF)
- "pdf" → 4 tools shown
- "youtube" → thumbnail generator + caption generator
- "linkedin" → optimizer + outreach

Search-as-navigation is a Linear/Raycast pattern. Took 30 minutes to build. Massively better than clicking through categories.`,

        `Auto-update with rollback in TaimurTools Desktop:

The flow when I push an update:
1. Users on launch see "Update available — installing in background"
2. Delta downloaded (only what changed, ~2-5MB usually)
3. Restart prompt
4. New version runs

If something breaks (it has happened):
1. I push a "rollback" release
2. Users on launch see "Reverting to previous version"
3. Same delta-download mechanism, different direction
4. Back to working state

This is what Claude Desktop, VS Code, and Slack do. It's standard. But most indie Electron apps skip it.

Worth the 2-hour setup. Stops "should I update?" anxiety. Stops "broken update killed my workflow" rage.`,

        `The 8 categories in TaimurTools Desktop sidebar:

📁 AI Generators (image, video, writing, thumbnails, interior, ASMR, cinematic)
🖼️ Image Tools (compressor, resizer, converter, enhancer, BG remover, OCR, cropper)
🎥 Video & Audio (trimmer, GIF maker, converter, vocal remover, TTS)
📄 PDF Tools (PDF↔Word, Excel, Image; image to PDF)
💼 Business (resume builder, ATS checker, LinkedIn optimizer, lead enrichment)
📈 Marketing/SEO (descriptions, multilingual SEO, repurposer, captions, reviews)
🔧 Utilities (QR generator, password generator)
⚙️ Settings (about, updates, theme)

Same 8 categories on web. Same 36 tools. Native shell wrapping.

Wrap-don't-rebuild paid off again.`,
      ],
    },

    /* ─────────────────────── X / Twitter ─────────────────────── */
    {
      platform: "twitter",
      variant: "Punchy one-liner",
      bodies: [
        `built TaimurTools Desktop in a weekend.

wrapped 36 web tools in electron.
apple-style chrome.
auto-updates.

shipped same week.

wrap > rebuild.`,

        `users asked for "desktop version" of taimurtools.com.

i wrapped the existing site in electron.

same 36 tools. native shell. auto-updates.

90% of the value, 10% of the work.`,

        `for solo devs: when users ask for desktop, consider wrap-over-rebuild.

TaimurTools Desktop = electron + frameless window + auto-updater.

ship in a weekend.`,

        `most "is there a desktop version?" requests can be answered with electron in 48 hours.

TaimurTools Desktop proves it. 36 web tools, native windows app, auto-updating.

stop saying "next quarter." just wrap it.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Feature stack",
      bodies: [
        `TaimurTools Desktop — what's inside:

→ native windows app (electron)
→ 1440×900 frameless w/ traffic-light buttons
→ apple-style sidebar
→ 35 tools
→ ctrl+F real-time search
→ auto-updates (delta + rollback)
→ portable .exe + NSIS installer
→ status indicators

shipped in a weekend.`,

        `things TaimurTools Desktop does that the web version can't:

✓ persistent dock icon
✓ ctrl+F instant search
✓ auto-updates in background
✓ system notifications
✓ no browser tab rot
✓ portable .exe (run from USB)

native shell over web tools.`,

        `architecture of TaimurTools Desktop:

electron shell → loads taimurtools.com/tools.html in webview
all tool logic stays on website
API keys via PHP proxy
auto-update via electron-builder

one codebase. two delivery formats.`,

        `things I built in TaimurTools Desktop that EVERY electron app should:

1. frameless + traffic-light buttons
2. auto-update pipeline (electron-builder)
3. portable + installer variants
4. ctrl+F search-as-nav
5. native system fonts
6. minimal cold-start time

stops looking like an electron app.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Dev story",
      bodies: [
        `electron gets dunked on but for a website wrapper it's perfect.

tauri = smaller binary, slower to ship.
electron = mature auto-updater, weekend project.

TaimurTools Desktop = electron, shipped in 48 hours.`,

        `auto-update with rollback in 2 hours of work:

electron-builder + GH releases + signed updates.

users always on latest. broken release? push rollback.

works like claude desktop. should be every electron app's default.`,

        `desktop users are 3x more engaged than web users for the same tools.

theory: lower friction = daily habit.

if your web tool has frequent users, the wrap-in-electron play has real ROI.`,

        `for the "tauri vs electron" debate:

right answer = whichever ships faster.

for me with TaimurTools Desktop = electron. mature auto-updater alone justified it.

for you = depends. ship it.`,
      ],
    },

    /* ─────────────────────── Facebook ─────────────────────── */
    {
      platform: "facebook",
      variant: "Conversational",
      bodies: [
        `Built a desktop version of taimurtools.com — TaimurTools Desktop.

For users who prefer apps to browser tabs. 36 free AI tools, native Windows window, auto-updates included.

What's nice about it:
→ One dock icon, always accessible
→ Ctrl+F to search across all tools
→ Apple-style chrome (frameless, traffic-light buttons)
→ Auto-updates (always latest tools)
→ Portable .exe + standard installer

Same 36 tools as web. Native shell. Free download.

DM if you want the link.`,

        `Real talk for solo developers reading this:

When users ask "is there a desktop version of your web app?" — most of us hear it as a multi-month rewrite.

It usually isn't.

Built TaimurTools Desktop in a weekend by wrapping taimurtools.com in Electron. Same 36 tools. Native shell. Auto-updates.

90% of the user value of "real" desktop. 10% of the dev cost.

If you're sitting on user requests for desktop versions — wrap before you rebuild.`,

        `Question for creators using web tools daily:

Do you prefer browser tabs or desktop apps?

Most I've talked to lean desktop for daily-use tools (saved as separate app, not lost in tabs) and web for one-off tasks.

Built TaimurTools Desktop for the "daily-use" half. Same 36 tools as taimurtools.com, native Windows app, auto-updating.

Curious what shapes your preference — tab vs. app for tools?`,

        `Three reasons creators bookmark TaimurTools Desktop:

1. Always one click away (dock icon vs. lost in 40 tabs)
2. Auto-updates (no manual download for new tools)
3. Apple-style polish (looks like Linear, not "Electron app")

If you use creator tools daily, desktop format compounds — friction drops near zero, habit forms.

DM for download link.`,
      ],
    },
    {
      platform: "facebook",
      variant: "Launch announce",
      bodies: [
        `TaimurTools Desktop is now live.

Native Windows app for all 36 tools from taimurtools.com:

✨ AI generators (image, video, writing, thumbnails)
🖼️ Image tools (compress, resize, BG remove, OCR)
🎥 Video/audio tools (trim, GIF, vocal remove, TTS)
📄 PDF tools (PDF↔Word, Excel, Image)
💼 Business tools (resume, ATS, LinkedIn)
📈 Marketing/SEO tools

Apple-style frameless window. Ctrl+F search. Auto-updates. Portable + installer variants.

Free download. DM for link.`,

        `Big update on TaimurTools Desktop this week:

→ Auto-update system shipped (delta downloads working)
→ Rollback support tested + documented
→ Portable .exe variant for USB-portable use
→ NSIS installer with custom branding
→ 50% faster cold start

For Windows users who prefer apps over browser tabs — DM for download.`,

        `Quietly shipped TaimurTools Desktop a few weeks ago. Now battle-tested.

What it does:
- All 36 tools from taimurtools.com in a native Windows app
- Apple-style chrome (frameless + traffic-light buttons)
- Ctrl+F instant search
- Auto-updates with rollback
- Portable + installer download options

For daily-use creators who want one-click access to their tools. Free.`,

        `For Windows users reading this — three reasons to install TaimurTools Desktop:

1. 36 tools, one dock icon (vs. 40 browser tabs)
2. Auto-updates (always latest tools)
3. Free, no signup required

Same toolbox as taimurtools.com, native Windows wrapper.

DM for download link.`,
      ],
    },

    /* ─────────────────────── Instagram ─────────────────────── */
    {
      platform: "instagram",
      variant: "Save-worthy carousel hook",
      bodies: [
        `Windows users — save this.

TaimurTools Desktop:
→ 36 free AI tools in a native Windows app
→ Apple-style frameless window
→ Ctrl+F real-time search
→ Auto-updates (always latest)
→ Portable .exe + installer variants
→ Dock icon, always accessible

Same toolbox as taimurtools.com. Better daily-use experience.

Free download. Save this 📌`,

        `The native Windows app for free AI tools:

→ Frameless Apple-style window
→ Sidebar nav, 8 categories
→ Ctrl+F instant search
→ Auto-updates seamlessly
→ Portable .exe option
→ All 36 tools from taimurtools.com

TaimurTools Desktop. Save this 📌`,

        `If you currently use creator tools via:
❌ 40 browser tabs (lost forever)
❌ Bookmarks you forget about
❌ Web apps that feel slow
❌ Manual update checks

— save this.

TaimurTools Desktop: native Windows app, 36 tools, auto-updating.

Tag a Windows creator who'd love this 📌`,

        `Real talk for daily creators:

Web tools work for one-off tasks. Desktop apps work for daily habits.

TaimurTools Desktop wraps 36 free AI tools in a native Windows shell. Apple-style polish. Auto-updates. One-click access.

Save this if you use creator tools daily 📌`,
      ],
      hashtags: "#WindowsApp #FreeAITools #CreatorTools #DesktopApp #ProductivityTools #ElectronApp #IndieMaker #AITools #BuildInPublic #WrapDontRebuild",
    },
    {
      platform: "instagram",
      variant: "Direct CTA",
      bodies: [
        `Stop juggling browser tabs.

TaimurTools Desktop. 36 free AI tools. Native Windows app. Auto-updates.

Link in bio.`,

        `Native window.
Apple-style chrome.
Ctrl+F search.
Auto-updates.
36 tools.

TaimurTools Desktop. Free download.`,

        `If you use AI tools daily on Windows — stop opening browser tabs.

TaimurTools Desktop. One dock icon. 36 tools. Always up-to-date.

Link in bio.`,

        `Web tools = one-off use.
Desktop apps = daily habit.

TaimurTools Desktop turns the 36 tools at taimurtools.com into a daily habit.

Link in bio.`,
      ],
      hashtags: "#WindowsApp #FreeAITools #CreatorTools #DesktopApp #IndieMaker #ProductivityTools",
    },
    {
      platform: "instagram",
      variant: "Question hook",
      bodies: [
        `How many browser tabs do you have open right now?

For most creators: 30+.

How many tools do you actually use?

Probably 5 of those 30.

TaimurTools Desktop replaces the 5 with a native app. One dock icon.

Save this 📌`,

        `Quick question for Windows users:

Are your creator tools easier to find as bookmarks or as a desktop app?

Most say desktop, then keep using bookmarks anyway.

TaimurTools Desktop fixes the gap. Native window, 36 tools, auto-updating.

Save this 📌`,

        `What if your creator tools auto-updated like Claude Desktop or VS Code?

TaimurTools Desktop does this. Push an update from the website → user sees it next launch → delta download → done.

Save this if "manually checking for updates" annoys you 📌`,

        `For Windows creators reading this:

Are you more productive in a browser tab or in a dedicated app?

Same code. Different format. Different habit.

TaimurTools Desktop. Save this 📌`,
      ],
      hashtags: "#WindowsApp #FreeAITools #CreatorTools #DigitalTools #Productivity #DesktopApp #IndieMaker",
    },
  ],

  cards: [
    {
      kind: "hero",
      id: "hero",
      emoji: "💻",
      title1: "36 AI tools.",
      title2: "Native Windows.",
      subtitle: "Apple-style chrome. Auto-updates. Free.",
      pills: ["Frameless", "Auto-update", "Portable", "Installer"],
      palettes: [
        { from: "#06b6d4", via: "#0ea5e9", to: "#1d4ed8" },
        { from: "#0891b2", via: "#0284c7", to: "#4338ca" },
        { from: "#0c4a6e", via: "#1d4ed8", to: "#7c3aed" },
        { from: "#155e75", via: "#0ea5e9", to: "#1e40af" },
      ],
    },
    {
      kind: "stat",
      id: "tools",
      emoji: "📦",
      number: "36",
      label: "tools, one app",
      sublabel: "native Windows shell",
      items: ["AI gen", "Image", "Video", "Audio", "PDF", "Resume", "ATS", "LinkedIn", "SEO", "Captions", "QR", "Password"],
      palettes: [
        { from: "#06b6d4", via: "#7c3aed", to: "#ec4899" },
        { from: "#0891b2", via: "#4f46e5", to: "#a855f7" },
        { from: "#0e7490", via: "#1d4ed8", to: "#7c3aed" },
        { from: "#155e75", via: "#312e81", to: "#7c3aed" },
      ],
    },
    {
      kind: "duo",
      id: "delivery",
      emoji: "💾",
      top: "EXE",
      bottom: "MSI",
      caption: "Portable .exe + NSIS installer. Download whichever fits.",
      palettes: [
        { from: "#0ea5e9", via: "#1d4ed8", to: "#1e1b4b" },
        { from: "#06b6d4", via: "#4f46e5", to: "#0f172a" },
        { from: "#0891b2", via: "#1e40af", to: "#020617" },
        { from: "#0c4a6e", via: "#312e81", to: "#18181b" },
      ],
    },
    {
      kind: "centerpiece",
      id: "auto-update",
      emoji: "⚡",
      title1: "Auto-updates",
      title2: "with rollback.",
      caption1: "Delta downloads. Background install.",
      caption2: "Works like Claude Desktop.",
      palettes: [
        { from: "#facc15", via: "#06b6d4", to: "#1d4ed8" },
        { from: "#fde047", via: "#0ea5e9", to: "#4f46e5" },
        { from: "#fbbf24", via: "#7c3aed", to: "#1e40af" },
        { from: "#facc15", via: "#0891b2", to: "#312e81" },
      ],
    },
    {
      kind: "outreach",
      id: "search",
      emoji: "🔍",
      number: "⌘F",
      label: "real-time search",
      subtitle: "type to filter all 36 tools instantly.",
      rows: [
        { day: "TYPE", text: '→ "compress" — 3 tools shown' },
        { day: "TYPE", text: '→ "pdf" — 4 tools shown' },
        { day: "TYPE", text: '→ "linkedin" — optimizer + outreach' },
      ],
      palettes: [
        { from: "#0d9488", via: "#0ea5e9", to: "#7c3aed" },
        { from: "#10b981", via: "#06b6d4", to: "#4f46e5" },
        { from: "#0f766e", via: "#0891b2", to: "#a855f7" },
        { from: "#065f46", via: "#0e7490", to: "#7c3aed" },
      ],
    },
    {
      kind: "stack",
      id: "stack",
      emoji: "🪟",
      title1: "Native polish,",
      title2: "wrapper economics.",
      features: [
        { emoji: "🪟", label: "Frameless" },
        { emoji: "🚦", label: "Traffic lights" },
        { emoji: "🔍", label: "Ctrl+F search" },
        { emoji: "⚡", label: "Auto-updates" },
        { emoji: "💾", label: "Portable + MSI" },
        { emoji: "🆓", label: "100% free" },
      ],
      palettes: [
        { from: "#0f172a", via: "#0ea5e9", to: "#7c3aed" },
        { from: "#020617", via: "#06b6d4", to: "#4f46e5" },
        { from: "#1e293b", via: "#0891b2", to: "#a855f7" },
        { from: "#18181b", via: "#0e7490", to: "#1d4ed8" },
      ],
    },
  ],
};
