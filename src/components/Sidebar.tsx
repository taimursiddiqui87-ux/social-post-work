"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOPICS } from "@/lib/topics";
import { signOut } from "@/app/actions";

export function Sidebar({ email }: { email?: string | null }) {
  const path = usePathname();
  if (path === "/login") return null;
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/[0.06] bg-white/60 px-3 py-6 backdrop-blur-2xl md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-3">
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] shadow-sm">
          <img src="/logo.png" alt="Logo" className="h-7 w-7 object-contain" />
        </span>
        <span className="text-[16px] font-semibold tracking-tight text-zinc-900">Social Post</span>
      </Link>

      <nav className="flex flex-col gap-0.5 px-1">
        <NavLink href="/"        label="Queue"  icon={<QueueIcon />}  active={path === "/"} />
        <NavLink href="/posted"  label="Posted" icon={<SentIcon />}  active={path === "/posted"} />
      </nav>

      <div className="mt-7 px-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">Topics</p>
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

      <div className="mt-auto rounded-2xl border border-black/[0.06] bg-white/70 p-3.5 shadow-sm backdrop-blur">
        {email && (
          <>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">Signed in</p>
            <p className="mt-0.5 truncate text-[13px] font-medium text-zinc-900" title={email}>{email}</p>
            <form action={signOut} className="mt-2.5">
              <button
                type="submit"
                className="w-full rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                Sign out
              </button>
            </form>
          </>
        )}
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
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition-all duration-200 ${
        active
          ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/[0.05]"
          : "text-zinc-600 hover:bg-white/60 hover:text-zinc-900"
      }`}
    >
      <span className={active ? (accent ?? "text-emerald-600") : "text-zinc-400 group-hover:text-zinc-600"}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {active && <span className={`absolute right-2 h-1.5 w-1.5 rounded-full ${accent ? "bg-current" : "bg-emerald-500"}`} />}
    </Link>
  );
}

function TopicIcon({ path }: { path: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}
function QueueIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="4" rx="1.2"/><rect x="3" y="10" width="18" height="4" rx="1.2"/><rect x="3" y="16" width="18" height="4" rx="1.2"/>
  </svg>;
}
function SentIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/>
  </svg>;
}
