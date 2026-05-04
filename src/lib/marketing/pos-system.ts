import type { MarketingProject } from "./types";

export const posSystem: MarketingProject = {
  id: "pos-system",
  name: "Waqar POS",
  tagline: "Offline-first Windows POS with FBR e-invoicing and encrypted Drive backups.",
  domain: "waqar-pos.app",
  brandFooter: "Offline-first POS — FBR-compliant",
  accent: "text-amber-600",
  pickerEmoji: "🧾",
  pickerSummary: "Windows POS that works offline · FBR e-invoicing · encrypted Google Drive backups.",
  pickerGradient: "from-amber-300/40 via-orange-300/30 to-rose-300/30",

  posts: [
    /* ─────────────────────── LinkedIn ─────────────────────── */
    {
      platform: "linkedin",
      variant: "Founder story",
      bodies: [
        `Pakistani retail has a software problem nobody wants to talk about:

When the internet drops, half the country's "modern" POS systems stop selling.

PTCL maintenance. WAPDA outage. Router restart. Office shifting buildings.

Cloud-only POS = stop the business.

Built Waqar POS specifically to solve this:

→ 100% offline-first (Electron + SQLite locally)
→ Search/scan products, cart, multi-rate tax, cash discounts
→ Hold/resume sales (waiting on a customer? park the cart)
→ Real-time inventory with low-stock alerts
→ Staff roles (owner, manager, cashier) with bcrypt passwords
→ Encrypted Google Drive backups on a schedule
→ FBR e-invoicing (Pakistan IMS API, sandbox + production)
→ 80mm thermal printer support
→ Sales reports — daily, date range, by cashier, CSV export
→ Kiosk mode for self-checkout

Internet is a backup, not a dependency.

Reusable POS template. Re-skin via Settings → Appearance, brand updates everywhere.

For Pakistani computer accessory shops, electronics retailers, kirana stores who need POS that doesn't fail when WiFi does.`,

        `Spent 6 months in computer accessory shops watching how they actually work.

Three patterns repeated everywhere:
1. Internet drops 2-4 times a day. Everything pauses.
2. FBR digital invoicing requirement is real but most "POS" software doesn't handle it natively.
3. Backups are inconsistent. When a hard drive fails, weeks of sales data are gone.

Built Waqar POS around exactly these realities:

✓ Offline-first (works fully without internet)
✓ FBR IMS API integration (sandbox + production)
✓ Encrypted Google Drive backups on a schedule

Plus the standard POS features — products, cart, tax, discounts, hold/resume, low-stock alerts, staff roles, thermal printing, daily reports.

If your shop runs Windows and you've been forced to use cloud-only POS that fails when internet does — there's a better fit.`,

        `What I learned shipping Waqar POS to Pakistani retail shops:

1. **Offline isn't optional** — it's table stakes. Cloud-only POS doesn't survive PTCL outages.
2. **FBR e-invoicing is mandatory** — most software handles it via clunky 3rd party plugins. Native integration matters.
3. **Backups must be automatic** — shop owners forget. Schedule it, encrypt it, send it offsite.
4. **Receipts must be 80mm thermal** — every shop already has the printer. Software should support it day 1.
5. **Kiosk mode unlocks self-service** — small shops with one cashier can let customers scan their own items.
6. **Re-skinnable matters** — same POS code, different brand color/logo, different shop. Settings → Appearance handles it.

Boring fundamentals. Highest leverage in retail software.`,

        `Update on Waqar POS — 90 days in production at our pilot shop:

→ 8,000+ transactions processed
→ Zero downtime from internet outages (offline-first held up)
→ All FBR digital invoices submitted on time
→ Daily Google Drive backups encrypted + verified
→ Cashier shift reports automated (used to be manual end-of-day)
→ Low-stock alerts caught 14 SKUs before they hit zero

The shop owner's quote that summed it up:
"Pehli baar lagta hai software hum se kaam le raha hai, na ke hum software se."

(First time it feels like the software works for us, not us for the software.)

That's the bar.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Problem-solution",
      bodies: [
        `Three things every Pakistani retail shop needs from POS software:

1. Works offline (because internet drops, period)
2. FBR-compliant digital invoicing (because it's mandatory)
3. Reliable backups (because hard drives fail)

Three things most "modern" POS doesn't include natively.

Waqar POS includes all three from day 1. Plus the usual — products, cart, tax, discounts, multi-cashier, thermal receipts, daily reports, kiosk mode.

If you run a Pakistani shop and your POS is causing more problems than it solves — there's a fit-for-market alternative.`,

        `Cloud-only POS is a luxury most Pakistani shops can't afford.

Connection drops mid-transaction. Cart is lost. Customer walks away. Repeated 3x/day.

Waqar POS is offline-first. Local SQLite database. All features work without internet:
- Add products / scan barcodes
- Cart with discounts and tax
- Hold/resume sales
- Print thermal receipts
- View inventory + reports

Internet is used for: optional Google Drive backup + FBR e-invoicing submission.

Connection comes back? Background sync. Connection stays gone? Shop keeps running.

Fit your tools to your reality. Not the other way around.`,

        `FBR digital invoicing in Pakistani retail:

Every shop above the threshold must submit invoices to the Pakistan IMS API. In real time. With specific format compliance.

Most "POS" software in PK handles this through:
- A separate desktop app
- A clunky web portal
- A paid 3rd party plugin
- "Manually upload at end of day" (illegal)

Waqar POS handles it natively. Sandbox mode for testing. Production mode for live submissions. Auto-retry on failure. Audit log for every invoice.

If you're a PK retailer and FBR compliance is a recurring headache — fix the tool, not the workflow.`,

        `Why we built Waqar POS as a reusable template, not a single-tenant product:

Pakistani retail isn't one shop. It's electronics, accessories, groceries, pharmacies, salons, restaurants — each with similar core needs but different branding.

Waqar POS is built around Settings → Appearance:
- Change brand color
- Upload logo
- Set border radius (rounded vs sharp UI)
- Pick receipt header layout

Same POS engine. Different shop. Re-skin in 10 minutes, deploy.

For shop owners: get a custom-feeling POS without custom dev cost.
For developers: build once, deploy across multiple retailers.

Pakistani SaaS economics work better when you template-ize.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Specific feature",
      bodies: [
        `Encrypted Google Drive backups in Waqar POS — the feature that's saved real shops real data.

The setup:
- Connect shop's Google Drive once (OAuth)
- Set backup schedule (daily, weekly, after every shift)
- POS encrypts the SQLite database, uploads to Drive
- Owner gets email confirmation

What this protects against:
✓ Hard drive failure (replace machine, restore from Drive)
✓ Theft / loss of POS terminal
✓ Ransomware on the local machine (cloud copy is encrypted at rest)
✓ Power surge corrupting database

In production: one shop's terminal hard drive failed at 8pm Friday. Saturday morning we restored 6 weeks of sales data from Drive in 12 minutes. They opened on time.

Without this, that's a permanently lost shop history.`,

        `FBR IMS API integration in Waqar POS — built native, not bolted on:

Every transaction:
1. Sale is rung up locally (works offline)
2. Receipt prints immediately (no waiting on FBR)
3. In background, invoice is submitted to FBR IMS
4. Sandbox mode for testing without real submission
5. Production mode with retry logic on network failures
6. Full audit log: timestamp, status, response code per submission

What this gives shop owners:
- Compliance without compromise on speed
- No double-data-entry into separate FBR portal
- Audit trail if FBR queries an invoice
- Sandbox testing before going live

If your current POS makes you submit FBR invoices manually at end of day — you're risking penalties for the sake of bad software.`,

        `Kiosk mode in Waqar POS unlocks self-service for small shops:

The setup:
- Add a touchscreen monitor (~Rs 25k one-time)
- Enable Kiosk mode in Settings
- Mount near the entrance/checkout

What customers can do:
- Browse product catalog by category
- Search/scan their items into a cart
- See running total + discounts
- Print a "barcode receipt" they take to the cashier

What this enables:
- One cashier can serve more customers (parallel processing)
- Browsing customers don't need to interrupt staff
- Faster checkout for small purchases
- Modern feel for a small shop

Small shops, big retail energy. Cost: one touch monitor.`,

        `Hold/resume sales in Waqar POS — the small feature that prevents real revenue loss:

Scenario: customer is checking out. Halfway through, they realize they forgot one more item. They go back to the aisle.

In most POS:
- Cart sits open, blocking the cashier
- Or cashier voids and re-rings (slow, error-prone)

In Waqar POS:
- "Hold cart" with a label (customer name, "guy with red shirt", etc.)
- Cashier serves the next customer in queue
- Original customer comes back, "Resume cart" with one click
- Their items, discounts, taxes — all preserved

Small shops with single cashiers get throughput close to multi-counter shops. From one $0 feature.`,
      ],
    },

    /* ─────────────────────── X / Twitter ─────────────────────── */
    {
      platform: "twitter",
      variant: "Punchy one-liner",
      bodies: [
        `internet drops in karachi 4x a day.

your POS shouldn't stop selling when it does.

Waqar POS = offline-first. local SQLite. internet is a backup.`,

        `pakistani retail POS needs:
- offline mode
- FBR e-invoicing
- encrypted backups
- thermal printer

most cloud POS skips at least 2.

Waqar POS does all 4. native.`,

        `cloud POS in pakistan = paying more for less reliability.

local-first POS = sells when internet doesn't.

Waqar POS.`,

        `built Waqar POS because pakistani shops shouldn't need IT staff to keep selling.

Windows installer. one machine. sells offline. backs up to Drive. submits to FBR.

shop runs itself.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Feature stack",
      bodies: [
        `Waqar POS — what's inside:

→ offline-first (Electron + SQLite)
→ search/scan products
→ cart w/ multi-rate tax
→ cash discounts
→ hold/resume sales
→ low-stock alerts
→ staff roles + bcrypt
→ encrypted Drive backups
→ FBR e-invoicing
→ 80mm thermal print
→ kiosk mode

native to PK retail.`,

        `every feature in Waqar POS was built for pakistani retail reality:

✓ offline-first (PTCL doesn't break sales)
✓ FBR IMS API native (no manual submission)
✓ encrypted backups (HD failures don't kill data)
✓ thermal printer (every shop has one)
✓ kiosk mode (one cashier does more)
✓ re-skinnable (one engine, many shops)

context-aware engineering.`,

        `things Waqar POS does that cloud POS struggles with:

→ sells when internet's down
→ submits FBR invoices natively
→ encrypted backups to Drive
→ hold/resume carts
→ multi-cashier shifts
→ thermal receipts day 1
→ kiosk mode for self-service

local-first wins this market.`,

        `if your POS:
- stops working when wifi drops
- needs separate FBR submission
- has no auto-backup
- doesn't support 80mm thermal
- charges per-transaction fees
- has no offline mode

— you need Waqar POS.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Reusable template",
      bodies: [
        `Waqar POS is a re-skinnable template:

→ Settings → Appearance
→ change brand color
→ upload logo
→ set radius (rounded/sharp)
→ deploy

same POS engine, different shop, different brand. 10 minutes to customize.

PK retail SaaS economics, finally working.`,

        `built Waqar POS so we could deploy across 10 different shops without 10 different codebases.

re-skin via Settings. brand updates everywhere. one engine. many retailers.

custom-feeling POS without custom-dev cost.`,

        `pakistani SaaS works better when products are templates.

Waqar POS = one offline-first POS engine, re-skinnable per shop. computer accessories today, kirana store tomorrow, salon next month.

build once. monetize many.`,

        `for developers building POS in pakistan:

don't build single-tenant. build re-skinnable.

Waqar POS pattern: settings drive branding. one codebase, many deployments. ship 10 shops in the time it takes to build 1 from scratch.`,
      ],
    },

    /* ─────────────────────── Facebook ─────────────────────── */
    {
      platform: "facebook",
      variant: "Conversational",
      bodies: [
        `Pakistani shop owners reading this — quick check.

Has your POS ever stopped working because the internet dropped?

Most cloud-only systems do. PTCL maintenance, WAPDA outage, router restart — and your shop can't sell.

Waqar POS is offline-first. Built for Pakistani retail reality. Sells when internet doesn't. Backs up automatically. Submits FBR invoices natively.

If you run a computer accessories shop, electronics store, or general retail in PK — DM us. Happy to walk through a demo.`,

        `Real talk for retailers:

Three things break shops in Pakistan:
1. Internet drops mid-transaction → cloud POS fails
2. Hard drive crashes → years of sales data gone
3. FBR submission errors → penalties

Waqar POS addresses all three:
✓ Offline-first (sells without internet)
✓ Encrypted Google Drive backups (auto-scheduled)
✓ FBR IMS API native (real-time submission)

Plus the standard POS features — products, cart, tax, discounts, multi-cashier, thermal printing, daily reports.

Built for PK shops. DM for demo.`,

        `Question for shop owners using cloud POS:

How much do you pay per month? Per transaction?

For most "modern" cloud POS in PK, it's $30-$80/month + per-transaction fees + per-additional-cashier charges.

Waqar POS is one-time purchase. Windows installer. No subscription. No per-transaction fees. Owns the data, owns the software.

For shops doing decent volume, payback is 2-3 months.

If the math doesn't work for you — DM us.`,

        `Why we built Waqar POS as a Windows desktop app, not a web app:

Pakistani retail reality:
→ Internet is unreliable in many areas
→ Most shop terminals are Windows machines (Windows 7/10/11 mix)
→ Browser-based POS feels slower at the counter
→ Receipts need to print immediately
→ Customers don't want to wait for "loading..."

Native Windows = instant response, offline-first, prints fast, works everywhere.

If you've been forced to use a web POS that's slow or breaks offline — there's a better fit.`,
      ],
    },
    {
      platform: "facebook",
      variant: "Launch announce",
      bodies: [
        `Waqar POS is now live in beta.

Offline-first Windows POS for Pakistani retail. Built for shops that need to keep selling when the internet doesn't.

What's inside:
🛒 Products + cart with multi-rate tax + discounts
👥 Multi-cashier with secure roles
📦 Real-time inventory + low-stock alerts
🖨️ 80mm thermal printer support
☁️ Encrypted Google Drive auto-backups
🇵🇰 FBR e-invoicing (IMS API native)
🪑 Kiosk mode for self-service
📊 Daily / range / by-cashier reports + CSV export

For computer accessory shops, electronics retailers, general PK retail. DM for demo.`,

        `Big update on Waqar POS this week:

→ FBR IMS API now in production mode (sandbox tested for 60 days)
→ Encrypted backup verification (every backup checks integrity before completing)
→ Multi-cashier shift reports (auto end-of-day summary)
→ 50% faster startup (Windows install boot time improved)

For Pakistani retailers — DM us if you want to try it on your shop. One-time purchase, no subscription.`,

        `Quietly rolled out Waqar POS to our pilot shop 90 days ago. Now ready for more retailers.

Stats from production:
- 8,000+ transactions processed
- Zero downtime from internet outages
- All FBR invoices submitted on time
- Daily encrypted backups verified

If you run a Pakistani retail shop and current POS is causing more problems than it solves — DM us. Happy to do a demo.`,

        `For shop owners reading this — three reasons to consider Waqar POS:

1. Offline-first (your shop sells when internet doesn't)
2. FBR-native (no double-data-entry, no penalty risk)
3. One-time purchase (no monthly SaaS bills)

Most "modern POS" in PK fails on at least one of these.

Built one that doesn't. DM if interested.`,
      ],
    },

    /* ─────────────────────── Instagram ─────────────────────── */
    {
      platform: "instagram",
      variant: "Save-worthy carousel hook",
      bodies: [
        `Pakistani retailer? Save this.

Waqar POS — offline-first Windows POS built for our market:

→ Sells when internet drops
→ FBR e-invoicing native (IMS API)
→ Encrypted Google Drive backups
→ 80mm thermal printer support
→ Multi-cashier with secure roles
→ Hold/resume sales
→ Real-time inventory + low-stock alerts
→ Kiosk mode for self-checkout
→ Daily reports + CSV export

One-time purchase. No subscription.

Save this for the next shop owner you know 📌`,

        `The Pakistani retail POS that doesn't break when the internet does:

→ Offline-first (Electron + SQLite)
→ FBR-compliant (IMS API native)
→ Auto-encrypted backups to Drive
→ Multi-cashier roles
→ Thermal printer support
→ One-time cost

Save this if you sell offline + want software that survives PK reality 📌`,

        `If your POS still:
❌ Stops working when internet drops
❌ Needs separate FBR submission
❌ Has no automatic backup
❌ Charges per-transaction fees
❌ Doesn't support 80mm thermal

— save this.

Waqar POS: offline-first, FBR-native, encrypted backups, one-time purchase.

Tag a shop owner who needs to see this 📌`,

        `Real talk for Pakistani shop owners:

Most "modern POS" in PK is built for North American retail.

Waqar POS is built for our market:
→ Offline-first (PTCL drops don't matter)
→ FBR IMS API native
→ Encrypted Drive backups
→ Multi-cashier roles
→ Re-skinnable per shop

Save this if you've been forced to use international POS that doesn't fit 📌`,
      ],
      hashtags: "#PakistanRetail #POS #FBRCompliance #OfflineFirst #PakistaniBusiness #ShopOwner #PKRetail #SaaSPakistan #BuildInPublic #PakistanTech",
    },
    {
      platform: "instagram",
      variant: "Direct CTA",
      bodies: [
        `Stop renting cloud POS that breaks when the internet does.

Waqar POS — offline-first Windows. FBR-native. Encrypted Drive backups. One-time cost.

DM "demo" to see it.`,

        `Sells offline.
Submits to FBR.
Backs up encrypted.
One-time purchase.

Waqar POS. Built for Pakistani retail reality.

DM to see it.`,

        `If you run a shop in PK and your POS has ever failed because the internet did — DM us.

Waqar POS is offline-first. Your shop keeps selling regardless.`,

        `Waqar POS: the POS your Pakistani shop should've had years ago.
- Offline mode
- FBR compliance
- Encrypted backups
- Thermal printer
- Multi-cashier
- Kiosk mode

DM "demo" to see the difference.`,
      ],
      hashtags: "#PakistanPOS #FBRCompliance #PakistanRetail #ShopOwner #OfflineFirst #PKBusiness #PakistanShops",
    },
    {
      platform: "instagram",
      variant: "Question hook",
      bodies: [
        `Quick question for shop owners:

Has your POS ever stopped working because the internet dropped?

If yes — your POS is the problem.

Waqar POS sells offline. Cloud is a backup, not a dependency.

Save this 📌`,

        `What happens to your sales data if the shop's hard drive fails tomorrow?

For most shops: gone forever.

Waqar POS does encrypted Google Drive backups on a schedule. Hard drive dies, you restore in 12 minutes.

Save this if you've never thought about this 📌`,

        `Your shop's POS: monthly fee, online-only, FBR submission via separate portal.

Waqar POS: one-time, offline-first, FBR native.

Same retail, different software fit.

Save this 📌`,

        `If you sell in Pakistan, be honest:

Have you ever stopped a sale because:
- Internet dropped
- POS frozen
- FBR submission failed
- Payment terminal disconnected

It's not your fault. The tools were built elsewhere.

Waqar POS is built here, for here. Save this 📌`,
      ],
      hashtags: "#PakistanRetail #ShopOwner #POSPakistan #FBRCompliance #PKBusiness #DigitalPakistan #Retail",
    },
  ],

  cards: [
    {
      kind: "hero",
      id: "hero",
      emoji: "🧾",
      title1: "Sells offline.",
      title2: "Even when wifi doesn't.",
      subtitle: "Offline-first Windows POS for Pakistani retail.",
      pills: ["Offline", "FBR", "Encrypted", "Thermal"],
      palettes: [
        { from: "#f59e0b", via: "#dc2626", to: "#7c2d12" },
        { from: "#fb923c", via: "#dc2626", to: "#9d174d" },
        { from: "#facc15", via: "#f97316", to: "#dc2626" },
        { from: "#f59e0b", via: "#ea580c", to: "#7c2d12" },
      ],
    },
    {
      kind: "stat",
      id: "features",
      emoji: "⚡",
      number: "0",
      label: "internet required",
      sublabel: "all features work offline",
      items: ["Cart + tax", "Discounts", "Hold/resume", "Inventory", "Low stock", "Multi-cashier", "Roles + auth", "Thermal print", "Daily reports", "CSV export", "Kiosk mode", "Re-skinnable"],
      palettes: [
        { from: "#dc2626", via: "#f59e0b", to: "#facc15" },
        { from: "#9d174d", via: "#dc2626", to: "#f97316" },
        { from: "#7c2d12", via: "#dc2626", to: "#facc15" },
        { from: "#1c1917", via: "#dc2626", to: "#facc15" },
      ],
    },
    {
      kind: "duo",
      id: "modes",
      emoji: "☁️",
      top: "OFF",
      bottom: "LINE",
      caption: "Local SQLite + encrypted Drive backups. Internet is a bonus.",
      palettes: [
        { from: "#f97316", via: "#dc2626", to: "#1e293b" },
        { from: "#facc15", via: "#f97316", to: "#7c2d12" },
        { from: "#fb923c", via: "#dc2626", to: "#0f172a" },
        { from: "#f59e0b", via: "#9d174d", to: "#020617" },
      ],
    },
    {
      kind: "centerpiece",
      id: "fbr",
      emoji: "🇵🇰",
      title1: "FBR IMS API",
      title2: "native.",
      caption1: "Sandbox + production. Auto-retry.",
      caption2: "No separate portal. No double-entry.",
      palettes: [
        { from: "#065f46", via: "#facc15", to: "#dc2626" },
        { from: "#047857", via: "#f59e0b", to: "#7c2d12" },
        { from: "#064e3b", via: "#84cc16", to: "#dc2626" },
        { from: "#022c22", via: "#facc15", to: "#9d174d" },
      ],
    },
    {
      kind: "outreach",
      id: "backup",
      emoji: "🔐",
      number: "12",
      label: "min restore",
      subtitle: "encrypted Google Drive backups, restored in minutes.",
      rows: [
        { day: "STEP 1", text: "→ Connect Drive (one-time OAuth)" },
        { day: "STEP 2", text: "→ Schedule (daily / weekly / per-shift)" },
        { day: "STEP 3", text: "→ Encrypted upload + verification" },
      ],
      palettes: [
        { from: "#1d4ed8", via: "#0ea5e9", to: "#10b981" },
        { from: "#312e81", via: "#7c3aed", to: "#0891b2" },
        { from: "#1e3a8a", via: "#1d4ed8", to: "#06b6d4" },
        { from: "#0c4a6e", via: "#0891b2", to: "#22c55e" },
      ],
    },
    {
      kind: "stack",
      id: "stack",
      emoji: "🛒",
      title1: "Built for",
      title2: "PK retail reality.",
      features: [
        { emoji: "📴", label: "Offline-first" },
        { emoji: "🇵🇰", label: "FBR-native" },
        { emoji: "🔐", label: "Encrypted backups" },
        { emoji: "🖨️", label: "Thermal print" },
        { emoji: "🪑", label: "Kiosk mode" },
        { emoji: "🎨", label: "Re-skinnable" },
      ],
      palettes: [
        { from: "#1c1917", via: "#dc2626", to: "#facc15" },
        { from: "#0f172a", via: "#9d174d", to: "#f97316" },
        { from: "#020617", via: "#7c2d12", to: "#facc15" },
        { from: "#18181b", via: "#dc2626", to: "#f59e0b" },
      ],
    },
  ],
};
