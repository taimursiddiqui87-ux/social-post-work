"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Queue",  icon: <QueueIcon /> },
  { href: "/claude", label: "Claude", icon: <ClaudeIcon />, accent: "text-amber-400" },
  { href: "/posted", label: "Posted", icon: <SentIcon /> },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-900 bg-neutral-950/40 px-4 py-6 backdrop-blur md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <SparkIcon />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Social Post</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {nav.map(n => {
          const active = path === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
              }`}
            >
              <span className={active ? (n.accent ?? "text-emerald-400") : "text-neutral-500"}>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-neutral-900 bg-neutral-950/60 p-3 text-xs text-neutral-500">
        <p className="mb-1 font-medium text-neutral-300">Tip</p>
        <p className="leading-relaxed">Click <span className="text-neutral-300">Copy text</span> on any draft, then open the platform and paste.</p>
      </div>
    </aside>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
function QueueIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1"/>
      <rect x="3" y="10" width="18" height="4" rx="1"/>
      <rect x="3" y="16" width="18" height="4" rx="1"/>
    </svg>
  );
}
function ClaudeIcon() {
  // Stylized "C" — evokes Claude's mark without using the trademark.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 7.5a6 6 0 1 0 0 9"/>
      <circle cx="12" cy="12" r="9.5" opacity="0.35"/>
    </svg>
  );
}
function SentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13"/>
      <path d="m22 2-7 20-4-9-9-4 20-7Z"/>
    </svg>
  );
}
