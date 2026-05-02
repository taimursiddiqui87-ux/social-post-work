"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOPICS } from "@/lib/topics";

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-neutral-950/40 px-3 py-6 backdrop-blur-2xl md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 text-emerald-300 ring-1 ring-emerald-400/30 shadow-lg shadow-emerald-500/10">
          <SparkIcon />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Social Post</span>
      </Link>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-1">
        <NavLink href="/"        label="Queue"  icon={<QueueIcon />}  active={path === "/"} />
        <NavLink href="/posted"  label="Posted" icon={<SentIcon />}  active={path === "/posted"} />
      </nav>

      {/* Topic filters */}
      <div className="mt-7 px-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">Topics</p>
      </div>
      <nav className="mt-2 flex flex-col gap-0.5 px-1">
        {TOPICS.map((t) => (
          <NavLink
            key={t.slug}
            href={`/topic/${t.slug}`}
            label={t.label}
            icon={<TopicIcon path={t.iconPath} />}
            active={path === `/topic/${t.slug}`}
            accent={t.accent}
          />
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs text-neutral-400 backdrop-blur">
        <p className="mb-1 font-medium text-neutral-200">Tip</p>
        <p className="leading-relaxed">Click <span className="text-neutral-200">Copy</span>, then <span className="text-neutral-200">Open</span> the platform to paste.</p>
      </div>
    </aside>
  );
}

function NavLink({
  href, label, icon, active, accent,
}: { href: string; label: string; icon: React.ReactNode; active: boolean; accent?: string }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] transition-all duration-200 ${
        active
          ? "bg-white/[0.06] text-white shadow-sm shadow-black/20"
          : "text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100"
      }`}
    >
      <span className={active ? (accent ?? "text-emerald-300") : "text-neutral-500 group-hover:text-neutral-300"}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {active && <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-current opacity-60" />}
    </Link>
  );
}

function TopicIcon({ path }: { path: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
function SparkIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.5L19 10l-5.2 1.5L12 17l-1.8-5.5L5 10l5.2-1.5L12 3Z"/>
  </svg>;
}
function QueueIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="4" rx="1.2"/><rect x="3" y="10" width="18" height="4" rx="1.2"/><rect x="3" y="16" width="18" height="4" rx="1.2"/>
  </svg>;
}
function SentIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/>
  </svg>;
}
