import type { MarketingProject } from "./types";

export const crmManagement: MarketingProject = {
  id: "crm-management",
  name: "School CRM v2.0",
  tagline: "13 modules, one beautifully organised school operating system.",
  domain: "DM for demo",
  brandFooter: "School ERP — web + Windows desktop",
  accent: "text-emerald-600",
  pickerEmoji: "🏫",
  pickerSummary: "Complete school ERP — admissions, fees, payroll, transport, AI assistant. Web + Windows.",
  pickerGradient: "from-emerald-300/40 via-teal-300/30 to-sky-300/30",

  posts: [
    /* ─────────────────────── LinkedIn ─────────────────────── */
    {
      platform: "linkedin",
      variant: "Founder story",
      bodies: [
        `Most schools I visit run on 10 spreadsheets, 3 notebooks, and a WhatsApp group.

So we built School CRM v2.0 — one system that replaces all of it.

13 integrated modules:
→ Student Information System (admissions to graduation)
→ Fee Management (monthly / quarterly / annual)
→ HR & Payroll with payslips + tax breakdown
→ Attendance for students, teachers, staff
→ Library with auto-fines on overdue books
→ Transport (routes, vehicles, drivers)
→ Smart substitute teacher allocation
→ Auto-generated report cards
→ AI Assistant — "Who's absent today?", "Show fee defaulters"

Web app + 100% offline Windows .exe.
No subscriptions. No cloud lock-in.

Built for Pakistani primary, secondary, higher secondary schools, academies, and madrasas.

If your school admin says "I'll just open Excel" one more time — show them this.`,

        `A principal told me last month: "We have software for fees. Different software for attendance. A WhatsApp group for announcements. A notebook for the library. And nothing talks to each other."

That's exactly the problem School CRM v2.0 solves.

One unified system. 13 modules. One login. One database.

Admissions, academics, fees, payroll, library, transport, finance, communications — all in one place.

Available as a web app AND as a fully offline Windows app for schools where internet is unreliable.

Built specifically for schools in Pakistan but deployable anywhere.

If you run a school and have ever said "we need to digitise this" — let's talk.`,

        `What I learned building school management software for 18 months:

The biggest pain isn't features. It's fragmentation.

Most schools use 4-6 different tools that don't share data. So a student transfer requires updating 6 systems. A fee reminder requires copy-pasting 3 times. A teacher's salary calculation pulls from 4 places.

School CRM v2.0 fixes this with one principle: every module shares one database.

Mark a student absent → it appears on the parent's WhatsApp + the report card + the substitute teacher allocation.

Pay a teacher's salary → it auto-deducts approved leaves + adds tax + generates a payslip.

The unlock isn't AI. It's integration.

(But yes, AI Assistant is built in — natural language queries on your school's data.)`,

        `Update on School CRM v2.0 — what's been shipping:

→ AI Assistant: ask in plain English, "Who hasn't paid this month?" → instant report
→ 17 KPI cards on the dashboard (enrolment, attendance, fees, expenses)
→ Smart substitute teacher allocation when someone's absent
→ Auto-generated report cards from grades + attendance
→ Role-based access (owner, principal, teacher, accountant, parent)
→ Works 100% offline as a Windows .exe — critical for schools with shaky internet

Schools running it now report 8-12 hours/week saved on admin work.

If you run an academy, school, or madrasa — DM me. Happy to set up a demo.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Problem-solution",
      bodies: [
        `The cost of running a school on spreadsheets is invisible until you measure it.

A school I worked with did the math:
- 6 hours/week reconciling fee sheets
- 4 hours/week chasing attendance
- 3 hours/week doing payroll manually
- 2 hours/week generating report cards
- 5 hours/week on parent communications

That's 20 hours/week of admin work. ~80 hours/month. ~1,000 hours/year.

School CRM v2.0 collapses all of this into one system. Most of it becomes automatic.

Same staff. Same students. 1,000 hours back per year.

That's not a productivity tool. That's a teacher you didn't have to hire.`,

        `Three things every school owner has asked me about software:

1. "Will it work without internet?"
   Yes — Windows desktop version is 100% offline.

2. "Is it monthly subscription?"
   No — one-time purchase.

3. "Can my office staff actually use it?"
   Yes — clean Apple-style UI, role-based dashboards, and an AI Assistant that answers in plain English.

School CRM v2.0 was built around what Pakistani schools actually need:
- Reliability when the internet drops
- No recurring costs
- Simple enough for non-technical staff
- Comprehensive enough to replace 6 other tools

13 modules. One login. Web + Windows.

Schools in Karachi, Lahore, and Islamabad already running it. DM for a demo.`,

        `Why we built School CRM v2.0 with both web AND a Windows desktop version:

Cloud-only software fails Pakistani schools.

Internet drops mid-class. PTCL maintenance during admission week. Power outage during finals.

For most "modern" SaaS — that's a complete operations halt.

Our Windows .exe runs entirely on the local machine. SQLite database, role-based access, full feature parity. Internet just isn't a dependency.

When connection comes back, optional sync. When it doesn't, you keep working.

If your school is in a market where uptime can't be guaranteed — buy software that doesn't assume uptime.`,

        `Pakistani schools have a software problem nobody talks about:

The "edtech" companies pitching them are mostly built for American or Indian markets. The features don't match the workflow. The pricing assumes 500-school chains.

School CRM v2.0 is the opposite — built for one school, with the workflows our schools actually use.

→ Fee structures match local terms (monthly/quarterly + arrears)
→ Payroll handles Pakistani tax brackets + leave types
→ Reports formatted for board exam patterns
→ Communication via WhatsApp, not email-first
→ Offline Windows version for unreliable internet
→ One-time purchase, not per-student-per-month

Built locally. Priced for local schools. Works the way Pakistani schools work.`,
      ],
    },
    {
      platform: "linkedin",
      variant: "Specific feature",
      bodies: [
        `The single most-used feature in School CRM v2.0 is the AI Assistant.

It sounds gimmicky until you watch a principal use it.

Instead of clicking through 4 menus to find "students with attendance below 75%," they just type the question.

"Who's absent today?"
"Show fee defaulters this month."
"Which teachers have leaves pending approval?"
"What's our enrolment vs. last year?"

Answers come back instantly with a table you can export.

No training needed. No documentation read. No "where's that report?" moments.

Office staff who refused to touch the old spreadsheets are now doing analytics on the school. Because the interface finally matches how humans think.`,

        `Smart substitute teacher allocation — the boring feature in School CRM v2.0 that schools love most:

Mark teacher absent → system instantly suggests subs based on:
- Subject expertise overlap
- Free periods today
- Already-assigned periods (no overload)
- Last 30 days of substitute load (fairness)
- Department + class level fit

What used to take the academic coordinator 30 minutes of scrambling now takes 30 seconds.

Multiply that by every absent day across a year. Then multiply by the cost of a class going without a teacher because the sub assignment was missed.

It's a small feature. Saves real money.`,

        `Auto-generated report cards in School CRM v2.0:

Grades come from teachers (entered once).
Attendance comes from the daily register (already logged).
Conduct + remarks come from the homeroom teacher's monthly notes.
Custom co-curricular sections from activity heads.

→ Click "generate" → PDF report card with school logo, signatures, formatted exactly like your existing template.

End-of-term week used to mean teachers spending 6+ hours per class doing manual report cards. Now it's a 5-minute review of pre-filled data.

The data was always there. We just connected it.`,

        `Library module in School CRM v2.0 — automation people don't expect from school software:

→ Barcode scan to issue/return books
→ Auto-fine calculation when a return is overdue
→ Email/WhatsApp reminders before due date
→ Per-student borrowing history
→ Most-borrowed reports for librarian
→ Lost book replacement workflow

Most school libraries run on paper registers. Books disappear. Fines aren't collected. Inventory is unknown.

After implementing this module, one school recovered ~40 books in the first month — books they didn't even know were missing because the register was 6 years old.

Boring software → real recovered assets.`,
      ],
    },

    /* ─────────────────────── X / Twitter ─────────────────────── */
    {
      platform: "twitter",
      variant: "Punchy one-liner",
      bodies: [
        `most schools run on:
- 4 spreadsheets
- 3 notebooks
- 2 WhatsApp groups
- 1 over-stretched office manager

built School CRM v2.0 to replace all of it.

13 modules. one login.`,

        `school admin says "I'll just open Excel."

show them School CRM v2.0.

13 modules, one login, web + offline desktop.

zero excels.`,

        `pakistani schools need software that:
- works without internet
- isn't $500/month
- doesn't assume 500 students

School CRM v2.0 — built for exactly that.`,

        `school's principal: "we need to digitise."
3 months of meetings later: still on excel.

show them a 13-module system that works offline + costs less than 1 month of admin overtime.

School CRM v2.0.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Feature stack",
      bodies: [
        `what's inside School CRM v2.0:

→ student information (admissions → graduation)
→ fees (monthly/quarterly/annual)
→ HR + payroll w/ payslips
→ attendance (students + staff)
→ library w/ auto-fines
→ transport (routes/drivers)
→ AI Assistant
→ web + Windows offline

13 modules. one db.`,

        `things School CRM v2.0 does so principals don't have to:

→ allocate substitute teachers
→ generate report cards
→ chase fee defaulters
→ calculate payroll + tax
→ track library books
→ manage transport routes
→ answer "who's absent today?"

humans: focus on actual education.`,

        `School CRM v2.0 — the unsexy features that matter:

✓ role-based access (owner / principal / teacher / parent)
✓ 17 KPI dashboard cards
✓ auto-generated report cards
✓ smart substitute allocation
✓ tax-detailed payslips
✓ AI Assistant in plain english
✓ 100% offline Windows version

built for schools, not demos.`,

        `every module in School CRM v2.0 earned its spot:

students. fees. payroll. attendance.
library. transport. exams. reports.
communications. inventory. accounts.
AI assistant. role permissions.

13 modules. one system. one price.`,
      ],
    },
    {
      platform: "twitter",
      variant: "Web vs desktop",
      bodies: [
        `cloud-only school software is a luxury most pakistani schools can't afford.

internet drops. PTCL goes down. power flickers.

School CRM v2.0 ships as both web AND a fully offline Windows .exe.

your school keeps running when the internet doesn't.`,

        `"will it work without internet?"

every pakistani school owner asks this first.

answer: yes. School CRM v2.0 has a fully offline Windows desktop version. SQLite local db. all 13 modules. zero connectivity required.

cloud-first software fails our market.`,

        `built School CRM v2.0 the way it should be:

→ web app for normal use
→ Windows .exe for offline-critical schools
→ same 13 modules
→ same database structure
→ optional sync when online

internet is not a dependency. it's a convenience.`,

        `if your school software:
- breaks when internet breaks
- charges per student per month
- requires IT staff to maintain
- doesn't speak Urdu
- has 6 different vendors for 6 different tasks

you need School CRM v2.0.`,
      ],
    },

    /* ─────────────────────── Facebook ─────────────────────── */
    {
      platform: "facebook",
      variant: "Conversational",
      bodies: [
        `Schools running on Excel and notebooks — this one's for you.

We built School CRM v2.0 — one app that handles admissions, fees, payroll, attendance, library, transport, exams, communications, and an AI Assistant. 13 modules total.

Web app + a 100% offline Windows version (for when internet is unreliable, which we all know happens).

If you run a school, academy, or madrasa, DM me — happy to walk you through a demo. No subscription, no cloud lock-in.`,

        `Genuine question for school owners + principals here:

How many separate tools does your school currently use? (Excel + WhatsApp + a separate fee app + a payroll spreadsheet + ?)

For most schools we talk to, it's 5-7 disconnected tools.

School CRM v2.0 replaces all of them with one integrated system. 13 modules — students, fees, HR, payroll, attendance, library, transport, exams, comms, accounts, AI Assistant — under one login.

Curious to hear what your current stack looks like.`,

        `Real talk for school owners:

The reason "going digital" never actually happens is friction, not budget.

Software is too complex. Staff resists. Training takes weeks. Three months in, everyone's back to spreadsheets.

School CRM v2.0 is the opposite:
→ Apple-style UI (your office staff will get it in a day)
→ AI Assistant — they ask questions in plain English
→ Role-based dashboards (everyone sees only what they need)
→ Web + Windows (use whatever works for your school)

The bottleneck has always been UX, not features. We fixed the UX.`,

        `Why we built School CRM v2.0 in Pakistan, for Pakistani schools:

International edtech is built for international workflows. The features don't match how our schools operate.

Our system handles:
→ Fee structures the way local schools structure them (monthly + arrears + adjustments)
→ Payroll with Pakistani tax brackets
→ Communication via WhatsApp (not Slack/email-first)
→ Local board exam result formats
→ Urdu-friendly UI elements
→ Offline operation for unreliable internet

Built locally because local context matters. If your school is in PK and you've been frustrated with international tools — let's talk.`,
      ],
    },
    {
      platform: "facebook",
      variant: "Launch announce",
      bodies: [
        `School CRM v2.0 is now live.

13 fully integrated modules:
🎓 Student Information System
💰 Fee Management
👥 HR & Payroll
📋 Attendance
📚 Library (with auto-fines)
🚌 Transport
📝 Exams & Report Cards
📊 17-card Dashboard
💬 Communications
🤖 AI Assistant
... and more.

Available as web app AND offline Windows desktop.

For schools, academies, and madrasas in Pakistan and beyond. DM for demo + pricing.`,

        `Big update on School CRM v2.0 this month:

→ AI Assistant now handles bilingual queries (English + Urdu)
→ Smart substitute teacher allocation
→ Auto-generated report cards (one click, fully formatted)
→ Tax-detailed payslips
→ Improved Windows desktop performance (50% faster startup)

Schools currently running it report 8-12 hours/week saved on admin work.

Owner-friendly pricing. One-time purchase. No per-student fees. DM if interested.`,

        `Quietly rolled out School CRM v2.0 last month — now in 5 schools across Karachi and Lahore.

What it does (1 line each):
- Replaces 5-7 separate tools with one system
- Web app + offline Windows version
- 13 integrated modules
- AI Assistant for natural-language queries
- Role-based access for owners, principals, teachers, accountants
- One-time purchase

If you're a school owner and tired of fragmented tools — try us.`,

        `For school owners reading this — three reasons to consider School CRM v2.0:

1. It's complete (13 modules, no add-ons, no surprises)
2. It works offline (Windows desktop = no internet dependency)
3. It's priced once, not monthly (own the software)

Most edtech in Pakistan is either too basic (just attendance) or too expensive (international SaaS at $500+/month for medium schools).

We built the in-between. DM if you want a 20-minute walkthrough.`,
      ],
    },

    /* ─────────────────────── Instagram ─────────────────────── */
    {
      platform: "instagram",
      variant: "Save-worthy carousel hook",
      bodies: [
        `Running a school? Save this.

We built School CRM v2.0 — one system that replaces 5+ tools:

→ Admissions to graduation tracking
→ Fees (monthly/quarterly/annual)
→ HR + Payroll with auto payslips
→ Attendance (students + teachers + staff)
→ Library with auto-fines
→ Transport routes + drivers
→ Smart substitute teacher allocation
→ Auto-generated report cards
→ AI Assistant ("who's absent today?")

Web app + 100% offline Windows version.

Built for Pakistani schools. One-time purchase.

Save this for the next school owner you know 📌`,

        `The school management workflow that ends spreadsheet chaos:

→ One database. 13 modules.
→ Students, fees, HR, payroll, attendance, library, transport, exams.
→ AI Assistant for plain-English queries.
→ Web + offline Windows.

Schools running it report 8-12 hours/week saved on admin.

That's a teacher you didn't have to hire.

Save this 📌`,

        `If your school still runs on:
❌ 4 separate Excel sheets
❌ Paper attendance registers
❌ Notebooks for the library
❌ A WhatsApp group for fees
❌ A different system for payroll

— save this.

School CRM v2.0 replaces all of it with one app. 13 modules. Web + offline Windows. Built for Pakistan.

Tag a school owner who needs to see this.`,

        `Real talk for school administrators:

Most "going digital" attempts fail because the software is too complex for staff.

School CRM v2.0 fixes this:
→ Apple-style clean UI
→ AI Assistant — staff ask questions in plain English
→ Role-based dashboards (each role sees only what they need)
→ Works offline (Windows version)
→ One-time purchase, not per-student-per-month

Save this if you've ever started + abandoned a digitisation project 📌`,
      ],
      hashtags: "#SchoolManagement #EdTech #PakistanEducation #SchoolERP #PrincipalLife #OfflineFirst #BuildInPublic #SchoolSoftware #SaaS #PakistanTech",
    },
    {
      platform: "instagram",
      variant: "Direct CTA",
      bodies: [
        `Stop running your school on Excel.

School CRM v2.0:
→ 13 modules in one app
→ Web + offline Windows
→ AI Assistant
→ One-time purchase

DM for demo.`,

        `1 system.
13 modules.
8-12 hrs/week saved.

School CRM v2.0. Built for Pakistani schools.

DM "demo" to see it in action.`,

        `Tired of 5 different tools that don't talk to each other?

School CRM v2.0 — one login, one database, 13 modules. Web + offline Windows.

DM to see it.`,

        `If you run a school and have ever said "we need to digitise this" — DM us.

School CRM v2.0:
- Admissions, fees, HR, payroll
- Library, transport, exams
- AI Assistant in plain English
- Web + 100% offline Windows version

20-min demo. No commitment.`,
      ],
      hashtags: "#SchoolERP #SchoolManagement #EdTech #Pakistan #PrincipalLife #SchoolOwner #DigitalSchool",
    },
    {
      platform: "instagram",
      variant: "Question hook",
      bodies: [
        `How many separate tools does your school currently use?

Most schools we talk to: 5-7.

School CRM v2.0 replaces all of them with one app.

Save this if you've been meaning to digitise 📌`,

        `Quick question for principals:

What's the most painful part of your week — fee follow-ups, payroll, or report cards?

For most, it's all three.

School CRM v2.0 automates all three (and 10 more workflows).

Save this for the next time admin work eats your evening 📌`,

        `What if "going digital" took 30 days, not 6 months?

School CRM v2.0 — designed for fast deployment:
→ 13 modules ready to go
→ Apple-style UI staff actually understand
→ AI Assistant means no training docs to read
→ Offline Windows option for connectivity issues

Save this if you've been delaying the switch 📌`,

        `Schools running on spreadsheets — be honest:

Have you ever lost a student's fee record? Misplaced an attendance register? Generated a wrong payslip?

It's not your fault. The tools were always inadequate.

School CRM v2.0 is one unified system. Same data, every module, every report.

Save this and let's talk 📌`,
      ],
      hashtags: "#SchoolManagement #PakistanEducation #PrincipalsOfPakistan #EdTech #SchoolERP #SchoolOwner #DigitalTransformation",
    },
  ],

  cards: [
    {
      kind: "hero",
      id: "hero",
      emoji: "🏫",
      title1: "Run your school,",
      title2: "not your spreadsheets.",
      subtitle: "13 modules. One login. Web + offline Windows.",
      pills: ["Students", "Fees", "Payroll", "AI Assistant"],
      palettes: [
        { from: "#10b981", via: "#0ea5e9", to: "#4f46e5" },
        { from: "#0d9488", via: "#0891b2", to: "#1d4ed8" },
        { from: "#065f46", via: "#0ea5e9", to: "#7c3aed" },
        { from: "#047857", via: "#0284c7", to: "#4338ca" },
      ],
    },
    {
      kind: "stat",
      id: "modules",
      emoji: "🧩",
      number: "13",
      label: "modules",
      sublabel: "one database",
      items: ["Students", "Fees", "HR", "Payroll", "Attendance", "Library", "Transport", "Exams", "Reports", "Comms", "Accounts", "AI Asst."],
      palettes: [
        { from: "#0ea5e9", via: "#10b981", to: "#facc15" },
        { from: "#0d9488", via: "#22c55e", to: "#84cc16" },
        { from: "#065f46", via: "#0ea5e9", to: "#facc15" },
        { from: "#0f172a", via: "#0d9488", to: "#22c55e" },
      ],
    },
    {
      kind: "duo",
      id: "platforms",
      emoji: "💻",
      top: "WEB",
      bottom: "EXE",
      caption: "Web app + 100% offline Windows desktop.",
      palettes: [
        { from: "#0ea5e9", via: "#4f46e5", to: "#1e40af" },
        { from: "#0891b2", via: "#0d9488", to: "#065f46" },
        { from: "#1d4ed8", via: "#7c3aed", to: "#10b981" },
        { from: "#0c4a6e", via: "#1d4ed8", to: "#22c55e" },
      ],
    },
    {
      kind: "centerpiece",
      id: "ai-assistant",
      emoji: "🤖",
      title1: "Ask, don't",
      title2: "click through menus.",
      caption1: 'AI Assistant: "Who\'s absent today?"',
      caption2: '"Show fee defaulters this month."',
      palettes: [
        { from: "#7c3aed", via: "#0ea5e9", to: "#10b981" },
        { from: "#4338ca", via: "#06b6d4", to: "#22c55e" },
        { from: "#312e81", via: "#0891b2", to: "#84cc16" },
        { from: "#1e1b4b", via: "#7c3aed", to: "#facc15" },
      ],
    },
    {
      kind: "outreach",
      id: "report-cards",
      emoji: "📝",
      number: "1",
      label: "click report cards",
      subtitle: "auto-generated from grades + attendance + remarks.",
      rows: [
        { day: "GRADES", text: "→ Teachers enter once" },
        { day: "ATTENDANCE", text: "→ Pulled from daily register" },
        { day: "OUTPUT", text: "→ Branded PDF, ready to print" },
      ],
      palettes: [
        { from: "#facc15", via: "#f97316", to: "#ec4899" },
        { from: "#22c55e", via: "#facc15", to: "#f59e0b" },
        { from: "#10b981", via: "#84cc16", to: "#facc15" },
        { from: "#0d9488", via: "#22c55e", to: "#facc15" },
      ],
    },
    {
      kind: "stack",
      id: "stack",
      emoji: "📋",
      title1: "Everything",
      title2: "a school needs.",
      features: [
        { emoji: "🎓", label: "Students" },
        { emoji: "💰", label: "Fees + accounts" },
        { emoji: "👥", label: "HR + payroll" },
        { emoji: "📚", label: "Library" },
        { emoji: "🚌", label: "Transport" },
        { emoji: "🤖", label: "AI Assistant" },
      ],
      palettes: [
        { from: "#0f172a", via: "#0d9488", to: "#22c55e" },
        { from: "#1e293b", via: "#0ea5e9", to: "#10b981" },
        { from: "#020617", via: "#0891b2", to: "#facc15" },
        { from: "#18181b", via: "#7c3aed", to: "#0ea5e9" },
      ],
    },
  ],
};
