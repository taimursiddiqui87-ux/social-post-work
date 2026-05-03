"use client";
import { useState, useTransition } from "react";
import { markPosted, rejectDraft, updateDraftBody } from "@/app/actions";

interface Props {
  draft: {
    id: string;
    platform: "facebook" | "instagram" | "linkedin" | "twitter";
    body: string;
    hashtags: string[] | null;
    language?: string | null;
  };
}

const platforms = {
  linkedin: {
    label: "LinkedIn",
    color: "sky",
    composeUrl: "https://www.linkedin.com/feed/?shareActive=true",
    icon: <LinkedinIcon />,
  },
  twitter: {
    label: "X / Twitter",
    color: "zinc",
    composeUrl: "https://twitter.com/intent/tweet",
    icon: <XIcon />,
  },
  facebook: {
    label: "Facebook",
    color: "blue",
    composeUrl: "https://www.facebook.com/",
    icon: <FacebookIcon />,
  },
  instagram: {
    label: "Instagram",
    color: "pink",
    composeUrl: "https://www.instagram.com/",
    icon: <InstagramIcon />,
  },
} as const;

const colorMap = {
  sky:  { bg: "bg-sky-50",  text: "text-sky-700",  ring: "ring-sky-200/70",  hover: "hover:bg-sky-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200/70", hover: "hover:bg-blue-100" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-200/70", hover: "hover:bg-pink-100" },
  zinc: { bg: "bg-zinc-900", text: "text-white",  ring: "ring-zinc-800",     hover: "hover:bg-zinc-800" },
} as const;

export function DraftCard({ draft }: Props) {
  const [body, setBody] = useState(draft.body);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<"posted" | "rejected" | null>(null);

  const p = platforms[draft.platform];
  const c = colorMap[p.color];
  const isUrdu = draft.language === "ur";

  const onCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 px-7 py-4 text-[14px]">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring}`}>{p.icon}</span>
        <span className="text-zinc-500">
          {done === "posted" ? `Marked ${p.label} as posted` : `${p.label} skipped`}
        </span>
      </div>
    );
  }

  return (
    <div className="px-7 py-6">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring}`}>{p.icon}</span>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">{p.label}</span>
          {isUrdu && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              🇵🇰 Urdu
            </span>
          )}
        </div>
        <span className="text-[12px] tabular-nums text-zinc-500">{body.length} chars</span>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => body !== draft.body && start(() => updateDraftBody(draft.id, body))}
        rows={Math.min(16, Math.max(5, Math.ceil(body.length / 70)))}
        dir={isUrdu ? "rtl" : "ltr"}
        className={`w-full resize-none rounded-2xl border border-black/[0.08] bg-white p-4 leading-[1.7] text-zinc-900 placeholder-zinc-400 shadow-inner shadow-black/[0.02] transition focus:border-emerald-400 focus:bg-white ${
          isUrdu ? "text-[16px]" : "text-[15px]"
        }`}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold ring-1 transition active:scale-[0.97] ${
            copied
              ? "bg-emerald-50 text-emerald-700 ring-emerald-300"
              : `${c.bg} ${c.text} ${c.ring} ${c.hover}`
          }`}
        >
          {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
        </button>
        <a
          href={p.composeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.97]"
        >
          Open {p.label}
          <ExternalIcon />
        </a>

        <div className="flex-1" />

        <button
          disabled={pending}
          onClick={() => start(async () => { await markPosted(draft.id); setDone("posted"); })}
          className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
        >Mark posted</button>
        <button
          disabled={pending}
          onClick={() => start(async () => { await rejectDraft(draft.id); setDone("rejected"); })}
          className="rounded-full px-3 py-2 text-[12.5px] font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50"
        >Skip</button>
      </div>
    </div>
  );
}

/* --- icons --- */
function CopyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>;
}
function ExternalIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>;
}
function XIcon() {
  // X (formerly Twitter) mark
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.4 8.46L23 22h-6.84l-5.36-6.99L4.5 22H1.244l7.92-9.06L1 2h7l4.86 6.43L18.244 2Zm-2.4 18h1.92L7.24 4h-2.06l10.66 16Z"/></svg>;
}
function LinkedinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 9.5H5.67v8.83H8.34V9.5Zm-1.34-4a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Zm11.34 12.83v-4.83c0-2.59-1.4-3.79-3.27-3.79-1.51 0-2.18.83-2.56 1.42v-1.21H9.84v8.41h2.67v-4.69c0-1.25.24-2.46 1.78-2.46 1.52 0 1.54 1.42 1.54 2.54v4.61h2.51Z"/></svg>;
}
function FacebookIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93Z"/></svg>;
}
function InstagramIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85 0 3.2 0 3.58-.07 4.85-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58 0-4.85-.07-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85 0-3.2 0-3.58.07-4.85.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.16 8.8 2.16 12 2.16Zm0 1.94c-3.14 0-3.51.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.82-.39.39-.62.75-.82 1.27-.15.39-.33.97-.38 2.04C2.7 9.92 2.69 10.29 2.69 13.43c0 3.14.01 3.51.07 4.74.05 1.07.23 1.65.38 2.04.2.51.43.88.82 1.27.39.39.75.62 1.27.82.39.15.97.33 2.04.38 1.23.06 1.6.07 4.73.07 3.14 0 3.51-.01 4.74-.07 1.07-.05 1.65-.23 2.04-.38.51-.2.88-.43 1.27-.82.39-.39.62-.75.82-1.27.15-.39.33-.97.38-2.04.06-1.23.07-1.6.07-4.74 0-3.14-.01-3.51-.07-4.74-.05-1.07-.23-1.65-.38-2.04a3.42 3.42 0 0 0-.82-1.27 3.42 3.42 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38-1.23-.06-1.6-.07-4.74-.07Zm0 3.3a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0 9.24a3.64 3.64 0 1 0 0-7.28 3.64 3.64 0 0 0 0 7.28Zm7.13-9.45a1.31 1.31 0 1 1-2.62 0 1.31 1.31 0 0 1 2.62 0Z"/></svg>;
}
