import type { MarketingProject } from "./types";

export const ecommWebApp: MarketingProject = {
  id: "ecomm-web-app",
  name: "TechNest Pakistan",
  tagline: "Pakistani e-commerce that actually works with JazzCash, Easypaisa, and COD.",
  domain: "technestpakistan.com",
  brandFooter: "Custom e-commerce — laptops + accessories",
  accent: "text-rose-600",
  pickerEmoji: "🛒",
  pickerSummary: "Custom e-commerce for laptops + accessories — JazzCash / Easypaisa / Safepay / COD.",
  pickerGradient: "from-rose-300/40 via-orange-300/30 to-amber-300/30",

  posts: [
    /* ─────────────────────── LinkedIn ─────────────────────── */
    {
      platform: "linkedin",
      variant: "Founder story",
      bodies: [
        `Pakistani e-commerce has a Shopify problem.

Shopify is built for North American merchants. It assumes Stripe + USPS + USD-denominated buyers.

For PK shops selling laptops to local customers, that means:
→ No native JazzCash / Easypaisa
→ No COD-first checkout flow
→ No SMS OTP (because nobody here uses email-only auth)
→ Subscription costs that don't match local margins

So I built TechNest Pakistan from scratch — a Next.js e-commerce platform tuned for Pakistani buyers.

What's working:
✓ 3-step checkout with real, persisted orders
✓ Phone OTP login (Twilio-backed, 6-digit, 5-min TTL)
✓ Payment provider abstraction — Safepay, JazzCash, Easypaisa, all swappable
✓ COD support as a first-class option
✓ Pricing engine with student (3% off) + B2B (7-12% off) tiers
✓ Server-side price recompute (no client-side tampering)
✓ Sandbox mode that works end-to-end without real credentials

If you're selling tech in Pakistan and frustrated with international platforms — I get it. Built one that fits.`,

        `For 2 years I told myself I'd "just use Shopify."

Then a customer tried to pay with JazzCash and bounced.

That was the moment I realized: international e-commerce platforms don't fit the Pakistani buyer.

So I built TechNest Pakistan:
- Native local payment methods (JazzCash, Easypaisa, Safepay)
- COD as a first-class checkout option, not an afterthought
- Phone OTP login (because email-only is broken for our market)
- B2B + student pricing tiers built in
- CSV bulk product import
- Full email loop (confirmation + status updates)

The unlock isn't features — it's fit. Software built for our market behaves differently.

If you're a PK retailer selling online and tired of forcing international tools to work — let's talk.`,

        `Most "Pakistani e-commerce" tutorials are just Shopify wrappers.

That's not a Pakistani solution. That's a US solution wearing a Pakistani sticker.

TechNest Pakistan is the real thing — built ground-up for our market:

→ Server-side price recomputation (security, not just UX)
→ JSON file-based catalog with atomic writes (no DB cost overhead initially)
→ SEO/AEO with JSON-LD, sitemaps, robots.txt
→ Mobile-first design (where 80%+ of PK shoppers are)
→ Sandbox mode for testing without real payment providers
→ Resend for transactional email + Twilio for SMS OTP

Three-month build. Production-ready. No SaaS subscription locking you in.

If you sell laptops, electronics, or accessories in Pakistan — your platform should be Pakistani.`,

        `What I learned shipping TechNest Pakistan to production:

1. **Phone OTP > email login** for our market. No exceptions.
2. **Sandbox mode is non-negotiable** — pretending payment works during dev hides a thousand integration bugs.
3. **COD needs special UX** — buyers want to know their COD limit, see clear messaging about availability per pincode.
4. **Server-side price recompute** is the only protection against client tampering. Trust nothing from the cart.
5. **Atomic JSON writes** beat database setup time for early-stage shops.
6. **Bulk CSV import** is the difference between "I'll add products tomorrow" and "products are added."

Not glamorous. All load-bearing.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Problem-solution",
      bodies: [
        `Three things every Pakistani online buyer expects:

1. JazzCash / Easypaisa as payment options
2. COD as a checkout choice
3. SMS-based login (not email)

Three things most international e-commerce platforms don't offer natively.

TechNest Pakistan is built around exactly these expectations. Local payments, COD-first flow, Twilio SMS OTP login.

If you're a Pakistani retailer and your e-commerce stack feels like fighting the platform — the platform is wrong. Not your business.`,

        `Pakistani retailers losing 30-50% of carts at checkout — here's why:

1. Payment method mismatch (no JazzCash/Easypaisa) → buyer abandons
2. Forced email signup → buyer abandons (most PK users don't check email regularly)
3. No COD option → conversion drops 40% in tier 2 cities
4. Slow mobile checkout → 80%+ of PK e-commerce is mobile

TechNest Pakistan addresses all four:
- 3 native payment providers + COD
- Phone OTP login (no email required)
- COD as a first-class checkout choice
- Mobile-first 3-step checkout

Cart conversion isn't a marketing problem. It's a fit problem.`,

        `Why we built TechNest Pakistan as custom code, not a Shopify theme:

Shopify charges $29-299/month per store. For PK margins on laptop accessories, that's a real cost.

Custom Next.js code:
- One-time build cost
- No recurring SaaS fees
- Full control over checkout logic
- Native PK payment provider integrations
- Modify any flow without "themes" or "apps"

For shops doing >$10k/month, custom pays for itself in months. Plus you own the platform.

If you're a PK retailer with technical ambition — buy the platform, don't rent it.`,

        `The Pakistani e-commerce stack we use in production at TechNest:

→ Next.js 14 (App Router, Server Components)
→ TypeScript end-to-end
→ Tailwind CSS
→ Resend for transactional email
→ Twilio for SMS OTP
→ Safepay + JazzCash + Easypaisa adapters
→ JSON file storage with atomic writes (not DB initially)
→ Mobile-first responsive design
→ JSON-LD structured data + sitemap.xml

No CMS. No theme system. No SaaS lock-in.

Open to questions if you're building similar in PK.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Specific feature",
      bodies: [
        `Sandbox mode in TechNest Pakistan was the most under-rated build decision.

The problem: testing payment integrations during dev usually means either real money flowing or hours of mocking.

The solution: TechNest works end-to-end without real credentials. Add SAFEPAY_SANDBOX=true and the checkout completes, the order persists, the email fires, status updates happen — all simulated.

What this enables:
- Demos to potential clients without burning real fees
- QA testing the full order lifecycle
- Onboarding new developers without giving them production keys
- Showing investors a fully working product

Built it on day 1. Saved hundreds of hours since.`,

        `Built the pricing engine in TechNest Pakistan with three-tier segmentation:

→ Regular customers: list price
→ Students with verified email: 3% discount
→ B2B accounts (verified business email + GST/NTN): 7-12% discount based on volume

Critical detail: ALL price calculations happen server-side. The cart sends product IDs + quantities. The server recomputes the price. The client never tells the server how much something costs.

Why: client-side price logic is easily bypassed. We've seen "deals" stolen by changing a single API parameter.

Server-side recompute is one extra round trip. Stops 100% of price tampering. Worth it.`,

        `CSV bulk product import in TechNest Pakistan — the unsexy feature shops love:

Paste a CSV with: SKU, name, description, price, category, stock, images (URLs).

Run import → 200 products live in 30 seconds.

What this fixes:
- Manual product entry (15 min per product × 200 products = 50 hours)
- Bulk price updates during sales
- Inventory sync from suppliers
- Easy migration from Excel-based catalogs

Without bulk import, "I'll add products tomorrow" becomes "this site never launches."

Boring tooling. Highest leverage.`,

        `Mobile-first checkout in TechNest Pakistan:

The hard data: 82% of Pakistani e-commerce traffic is mobile. Most stores design desktop-first and mobile-second.

We inverted the design priority:
→ Single-thumb reachable checkout buttons
→ 3-step flow (cart → contact → payment) — not 5+ pages
→ Auto-detect city from phone area code
→ Saved addresses keyed to phone number
→ Inline form validation (no full-page reloads)
→ Fast load — under 200KB initial JS bundle

Result: cart-to-completion conversion 2x our previous theme. Same products, same traffic.`,
      ],
    },

    /* ─────────────────────── X / Twitter ─────────────────────── */
    {
      platform: "twitter",
      variant: "Punchy one-liner",
      bodies: [
        `pakistani e-commerce with:
- jazzcash + easypaisa
- COD
- SMS OTP login
- B2B + student pricing
- mobile-first

= TechNest Pakistan.

shopify can't fit this market.`,

        `most "pakistani" e-commerce is shopify in a kurta.

TechNest Pakistan is custom-built for our market. native local payments. COD-first. SMS OTP. no subscription.

how it should've always been.`,

        `82% of pakistani e-commerce is mobile.

most stores still design desktop-first.

TechNest Pakistan is mobile-first. 3-step checkout. one-thumb reachable. 200kb JS budget.

conversion 2x'd.`,

        `pakistani buyer lost at checkout because:

→ no jazzcash → bounce
→ email-only signup → bounce
→ no COD → bounce in tier 2
→ slow mobile UX → bounce

TechNest Pakistan fixed all 4.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Feature stack",
      bodies: [
        `TechNest Pakistan — what's inside:

→ next.js 14, typescript end-to-end
→ jazzcash + easypaisa + safepay
→ COD as first-class option
→ phone OTP login (twilio)
→ pricing engine: student + B2B tiers
→ CSV bulk import
→ resend transactional email
→ JSON-LD SEO
→ sandbox mode

ground-up for PK.`,

        `every feature in TechNest Pakistan earned its keep:

✓ 3-step mobile checkout
✓ persisted orders
✓ phone OTP (5-min TTL)
✓ payment provider abstraction
✓ server-side price recompute
✓ atomic JSON writes
✓ admin panel
✓ email loop
✓ sandbox mode

pakistani buyer gets what they expect.`,

        `things TechNest Pakistan does that shopify can't (without 3rd party apps):

→ native jazzcash flow
→ native easypaisa flow
→ COD with pincode rules
→ SMS OTP only login
→ B2B price tiers w/ GST
→ urdu UI
→ bulk CSV import
→ no recurring fee

local market. local solution.`,

        `the real cost of running shopify in PK:

$29-299/month × 12 = $348-3600/year
+ per-app fees
+ payment provider fees
+ "we don't support this" frustration

custom platform: one-time build, own the code.

TechNest Pakistan. for shops that want to own their stack.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Pakistan-focused",
      bodies: [
        `pakistani retailers — quick reality check:

if your e-commerce platform doesn't natively support:
- jazzcash
- easypaisa
- COD
- SMS OTP
- urdu

it's not a pakistani platform.

TechNest Pakistan is.`,

        `shopify is a global tool.
TechNest Pakistan is a pakistani tool.

different. fundamentally.

native local payments. COD-first. mobile-first. priced for PK margins.`,

        `built TechNest Pakistan because pakistani buyers deserve software that doesn't treat them as edge cases.

native jazzcash. native easypaisa. native COD. native SMS OTP. native urdu.

not "international platform with PK plugin."`,

        `PSA for pakistani retailers:

your $99/month shopify plan is a tax on using the wrong tool.

custom-built local platform = one-time cost, full control, zero compromise on what pakistani buyers expect.

TechNest Pakistan does this.`,
      ],
    },

    /* ─────────────────────── Facebook ─────────────────────── */
    {
      platform: "facebook",
      variant: "Conversational",
      bodies: [
        `Pakistani retailers selling online — this one's for you.

We built TechNest Pakistan, a custom e-commerce platform tuned specifically for our market:
→ Native JazzCash, Easypaisa, Safepay support
→ COD as a first-class checkout option
→ SMS OTP login (not email-only)
→ B2B and student pricing tiers
→ Mobile-first checkout (where 82% of PK shoppers are)
→ One-time build, no recurring SaaS fees

If your store currently runs on Shopify and you've been frustrated with how it handles local payments — let's talk. There's a better fit available.`,

        `Real talk for PK shop owners:

How much do you pay for your e-commerce platform every month?

For most Shopify stores doing decent volume, it's $99-$300/month + per-app fees + transaction fees.

For most WooCommerce setups, it's hosting + 4-5 plugin subscriptions.

We built TechNest Pakistan as custom code. One-time cost. Full ownership. Native PK payment integrations included.

If your monthly SaaS bill is bigger than your monthly developer fee would be — flip the math.`,

        `Question for retailers selling in Pakistan:

What's your cart abandonment rate?

If you're using a global platform without native local payments, it's almost certainly higher than it should be. Most PK buyers won't click through "Pay with Stripe" — they're looking for JazzCash or COD.

TechNest Pakistan is built around this. Native local payments. COD on every product. SMS OTP login. Mobile-first checkout.

Cart conversion 2x'd vs. our previous Shopify setup. Same traffic, same products, different platform fit.`,

        `Three months in with TechNest Pakistan in production — what's working:

→ Phone OTP login: 4x signup conversion vs old email flow
→ COD option: brings tier 2 city orders we never got before
→ Bulk CSV import: 200 products live in 30 seconds, not 50 hours
→ Sandbox mode: demos and onboarding without burning real fees
→ B2B pricing tiers: corporate accounts now actually checkout

Custom code beats themed SaaS for our market. Hands down.`,
      ],
    },
    {
      platform: "facebook",
      variant: "Launch announce",
      bodies: [
        `TechNest Pakistan is now live.

Custom e-commerce platform for Pakistani retailers selling laptops + computer accessories. Built ground-up for our market:

🇵🇰 Native JazzCash, Easypaisa, Safepay
💳 COD as a checkout option (not an afterthought)
📱 Mobile-first 3-step checkout
🔐 SMS OTP login
🎓 Student + B2B pricing tiers
📦 CSV bulk product import
✉️ Resend-powered transactional email loop

Want one for your shop? DM us — we can spin up a similar platform in 2-3 weeks.`,

        `Big update on TechNest Pakistan this week:

→ Sandbox mode now works end-to-end (full checkout simulation, no real payments)
→ Server-side price recomputation (security against client tampering)
→ Atomic JSON writes for catalog (zero data loss in concurrent writes)
→ JSON-LD structured data for better Google rankings
→ Sitemap + robots.txt for SEO/AEO

For Pakistani retailers wanting custom e-commerce that fits this market — DM us.`,

        `Quietly shipped TechNest Pakistan a few months ago. Now scaling.

What it does:
- Custom Next.js e-commerce platform
- Built specifically for Pakistani market (local payments, COD, SMS OTP)
- One-time build, no SaaS fees
- Full ownership of code + data

If you're a retailer in PK selling tech, electronics, or accessories — this might fit better than your current Shopify setup. DM for a walkthrough.`,

        `For Pakistani retailers reading this — three reasons to consider TechNest Pakistan:

1. Native PK payment methods (JazzCash, Easypaisa, Safepay, COD)
2. Mobile-first (82% of PK e-commerce traffic)
3. One-time cost, not monthly subscription

Most international platforms force PK retailers to compromise on at least one of these.

We built one that doesn't. DM if interested.`,
      ],
    },

    /* ─────────────────────── Instagram ─────────────────────── */
    {
      platform: "instagram",
      variant: "Save-worthy carousel hook",
      bodies: [
        `Pakistani retailer? Save this.

We built TechNest Pakistan — custom e-commerce that actually fits our market:

→ Native JazzCash + Easypaisa + Safepay
→ COD as first-class option
→ SMS OTP login (no email required)
→ Mobile-first 3-step checkout
→ Student + B2B pricing tiers
→ Bulk CSV product import
→ One-time build, no SaaS fees

Cart conversion 2x'd vs Shopify.

Save this if you sell online in PK 📌`,

        `The Pakistani e-commerce stack that just works:

→ Native JazzCash / Easypaisa / Safepay
→ COD on every product
→ Phone OTP login
→ B2B + student tiers
→ Mobile-first checkout
→ Custom code, one-time cost

Built TechNest Pakistan to fix what Shopify doesn't.

Save this for the next retailer you know 📌`,

        `If your online store still uses:
❌ Stripe-only checkout
❌ Email-only signup
❌ No COD option
❌ Desktop-first design
❌ $99+/month SaaS fees

— save this.

TechNest Pakistan: custom e-commerce, native local payments, mobile-first, one-time cost.

Tag a retailer who needs to see this 📌`,

        `For Pakistani founders building e-commerce:

Most "Pakistani" platforms are Shopify in a kurta.

TechNest Pakistan is the real thing — Next.js custom code, native PK payment integrations, COD-first flow, mobile-first design.

Save this if you're tired of forcing international tools to work for our market 📌`,
      ],
      hashtags: "#PakistanEcommerce #JazzCash #Easypaisa #DigitalPakistan #PakistaniFounders #BuildInPublic #NextJS #SaaS #PakistanTech #StartupPK",
    },
    {
      platform: "instagram",
      variant: "Direct CTA",
      bodies: [
        `Stop renting Shopify.

TechNest Pakistan: custom e-commerce that actually fits our market.
→ JazzCash + Easypaisa + Safepay
→ COD-first
→ SMS OTP
→ Mobile-first
→ One-time cost

DM "demo" to see it.`,

        `Pakistani retailer.
Cart conversion stuck.
Reason: wrong tool for our market.

TechNest Pakistan. Built for Pakistan, not adapted to it.

DM to see the platform.`,

        `If you sell laptops, electronics, or accessories in PK — your platform should be PK.

TechNest Pakistan. Custom Next.js e-commerce. Local payments. COD. Mobile-first.

DM for a walkthrough.`,

        `Three things every PK buyer expects at checkout:
1. JazzCash / Easypaisa
2. COD
3. SMS OTP

Three things Shopify doesn't natively offer.

TechNest Pakistan does.

DM "demo" to see the difference.`,
      ],
      hashtags: "#PakistanEcommerce #JazzCash #Easypaisa #DigitalPakistan #PakistaniBusiness #PKStartups #EcommercePakistan",
    },
    {
      platform: "instagram",
      variant: "Question hook",
      bodies: [
        `What's your store's cart abandonment rate?

If you're using a global platform without native local payments, it's higher than it should be.

TechNest Pakistan fixes this — JazzCash, Easypaisa, COD all native.

Save this if you sell in PK 📌`,

        `Quick question for retailers:

How much are you paying per month for your e-commerce platform?

$29? $99? $299?

TechNest Pakistan is custom-built. One-time cost. No monthly. Native PK payment integrations.

Save this if your SaaS bill keeps growing 📌`,

        `If you sell tech in Pakistan, be honest:

Has a customer ever bounced because there was no JazzCash option?
No COD option?
No SMS OTP login?

It's not the customer's fault. Your platform doesn't fit our market.

TechNest Pakistan does. Save this 📌`,

        `What if your e-commerce platform was built for Pakistani buyers, not adapted from US ones?

TechNest Pakistan is exactly that.
→ Native local payments
→ COD-first checkout
→ Mobile-first design
→ Pakistani UX patterns

Save this if you've been forcing your tools to fit 📌`,
      ],
      hashtags: "#EcommercePakistan #JazzCash #Easypaisa #PakistanRetail #PakistaniFounders #PKBusiness #DigitalPakistan",
    },
  ],

  cards: [
    {
      kind: "hero",
      id: "hero",
      emoji: "🛒",
      title1: "Pakistani e-commerce,",
      title2: "actually built for PK.",
      subtitle: "JazzCash · Easypaisa · Safepay · COD",
      pills: ["JazzCash", "Easypaisa", "Safepay", "COD"],
      palettes: [
        { from: "#dc2626", via: "#f97316", to: "#facc15" },
        { from: "#be123c", via: "#ea580c", to: "#f59e0b" },
        { from: "#9d174d", via: "#dc2626", to: "#fb923c" },
        { from: "#7c2d12", via: "#dc2626", to: "#facc15" },
      ],
    },
    {
      kind: "stat",
      id: "checkout",
      emoji: "📱",
      number: "82%",
      label: "mobile checkout",
      sublabel: "where PK buyers actually are",
      items: ["3-step flow", "Single thumb", "<200KB JS", "Auto city detect", "Saved addrs", "Inline validate", "Fast load", "OTP login", "COD-first", "B2B tiers", "Student tier", "Bulk CSV"],
      palettes: [
        { from: "#ec4899", via: "#f97316", to: "#facc15" },
        { from: "#dc2626", via: "#ec4899", to: "#a855f7" },
        { from: "#7c3aed", via: "#ec4899", to: "#f97316" },
        { from: "#1e40af", via: "#7c3aed", to: "#ec4899" },
      ],
    },
    {
      kind: "duo",
      id: "tiers",
      emoji: "🏷️",
      top: "B2B",
      bottom: "EDU",
      caption: "Pricing tiers built in. 7-12% B2B, 3% student.",
      palettes: [
        { from: "#0d9488", via: "#facc15", to: "#dc2626" },
        { from: "#0f766e", via: "#ec4899", to: "#f97316" },
        { from: "#065f46", via: "#facc15", to: "#dc2626" },
        { from: "#0c4a6e", via: "#ec4899", to: "#f59e0b" },
      ],
    },
    {
      kind: "centerpiece",
      id: "otp",
      emoji: "🔐",
      title1: "SMS OTP login.",
      title2: "Not email.",
      caption1: "6-digit code · 5-min TTL · Twilio-backed.",
      caption2: "Built for how PK actually logs in.",
      palettes: [
        { from: "#1d4ed8", via: "#0ea5e9", to: "#10b981" },
        { from: "#312e81", via: "#7c3aed", to: "#06b6d4" },
        { from: "#0c4a6e", via: "#0891b2", to: "#22c55e" },
        { from: "#1e1b4b", via: "#1d4ed8", to: "#0ea5e9" },
      ],
    },
    {
      kind: "outreach",
      id: "checkout-flow",
      emoji: "✅",
      number: "3",
      label: "step checkout",
      subtitle: "cart → contact → payment. mobile-first, single thumb reachable.",
      rows: [
        { day: "STEP 1", text: "→ Cart review with line totals" },
        { day: "STEP 2", text: "→ Contact + delivery address" },
        { day: "STEP 3", text: "→ Pay (JazzCash / Easypaisa / Safepay / COD)" },
      ],
      palettes: [
        { from: "#facc15", via: "#10b981", to: "#0ea5e9" },
        { from: "#84cc16", via: "#22c55e", to: "#0d9488" },
        { from: "#22c55e", via: "#0ea5e9", to: "#7c3aed" },
        { from: "#10b981", via: "#06b6d4", to: "#1d4ed8" },
      ],
    },
    {
      kind: "stack",
      id: "stack",
      emoji: "⚙️",
      title1: "Built ground-up",
      title2: "for Pakistan.",
      features: [
        { emoji: "🇵🇰", label: "Local payments" },
        { emoji: "💵", label: "COD-first" },
        { emoji: "📲", label: "SMS OTP" },
        { emoji: "🏷️", label: "B2B + edu tiers" },
        { emoji: "📥", label: "CSV bulk import" },
        { emoji: "🧪", label: "Sandbox mode" },
      ],
      palettes: [
        { from: "#1c1917", via: "#dc2626", to: "#f97316" },
        { from: "#0f172a", via: "#be123c", to: "#facc15" },
        { from: "#020617", via: "#ec4899", to: "#f59e0b" },
        { from: "#18181b", via: "#dc2626", to: "#facc15" },
      ],
    },
  ],
};
