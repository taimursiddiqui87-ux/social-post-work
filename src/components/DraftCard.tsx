"use client";
import { useState, useTransition } from "react";
import { markPosted, rejectDraft, updateDraftBody } from "@/app/actions";

interface Props {
  draft: {
    id: string;
    platform: "facebook" | "instagram" | "linkedin";
    body: string;
    hashtags: string[] | null;
  };
}

const platforms = {
  linkedin: {
    label: "LinkedIn",
    color: "sky",
    composeUrl: "https://www.linkedin.com/feed/?shareActive=true",
    icon: <LinkedinIcon />,
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
  sky:  { bg: "bg-sky-500/10",  text: "text-sky-300",  ring: "ring-sky-500/20",  hover: "hover:bg-sky-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/20", hover: "hover:bg-blue-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-300", ring: "ring-pink-500/20", hover: "hover:bg-pink-500/20" },
} as const;

export function DraftCard({ draft }: Props) {
  const [body, setBody] = useState(draft.body);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<"posted" | "rejected" | null>(null);

  const p = platforms[draft.platform];
  const c = colorMap[p.color];

  const onCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 px-6 py-4 text-sm">
        <span className={`grid h-7 w-7 place-items-center rounded-md ${c.bg} ${c.text} ring-1 ${c.ring}`}>{p.icon}</span>
        <span className="text-neutral-500">
          {done === "posted" ? `Marked ${p.label} as posted` : `${p.label} skipped`}
        </span>
      </div>
    );
  }

  return (
    <div className="px-6 py-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-7 w-7 place-items-center rounded-md ${c.bg} ${c.text} ring-1 ${c.ring}`}>{p.icon}</span>
          <span className="text-sm font-medium text-neutral-200">{p.label}</span>
        </div>
        <span className="text-xs tabular-nums text-neutral-500">{body.length} chars</span>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => body !== draft.body && start(() => updateDraftBody(draft.id, body))}
        rows={Math.min(16, Math.max(5, Math.ceil(body.length / 70)))}
        className="w-full resize-none rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 text-[14px] leading-[1.65] text-neutral-100 placeholder-neutral-600 transition focus:border-neutral-700 focus:bg-neutral-900/60 focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition ${
            copied
              ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
              : `${c.bg} ${c.text} ${c.ring} ${c.hover}`
          }`}
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
        <a
          href={p.composeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-neutral-100"
        >
          Open {p.label}
          <ExternalIcon />
        </a>

        <div className="flex-1" />

        <button
          disabled={pending}
          onClick={() => start(async () => { await markPosted(draft.id); setDone("posted"); })}
          className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-500 disabled:opacity-50"
        >Mark as posted</button>
        <button
          disabled={pending}
          onClick={() => start(async () => { await rejectDraft(draft.id); setDone("rejected"); })}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-300 disabled:opacity-50"
        >Skip</button>
      </div>
    </div>
  );
}

/* --- icons --- */
function CopyIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>;
}
function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>;
}
function ExternalIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>;
}
function LinkedinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 9.5H5.67v8.83H8.34V9.5Zm-1.34-4a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Zm11.34 12.83v-4.83c0-2.59-1.4-3.79-3.27-3.79-1.51 0-2.18.83-2.56 1.42v-1.21H9.84v8.41h2.67v-4.69c0-1.25.24-2.46 1.78-2.46 1.52 0 1.54 1.42 1.54 2.54v4.61h2.51Z"/></svg>;
}
function FacebookIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93Z"/></svg>;
}
function InstagramIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85 0 3.2 0 3.58-.07 4.85-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58 0-4.85-.07-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85 0-3.2 0-3.58.07-4.85.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.16 8.8 2.16 12 2.16Zm0 1.94c-3.14 0-3.51.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.82-.39.39-.62.75-.82 1.27-.15.39-.33.97-.38 2.04C2.7 9.92 2.69 10.29 2.69 13.43c0 3.14.01 3.51.07 4.74.05 1.07.23 1.65.38 2.04.2.51.43.88.82 1.27.39.39.75.62 1.27.82.39.15.97.33 2.04.38 1.23.06 1.6.07 4.73.07 3.14 0 3.51-.01 4.74-.07 1.07-.05 1.65-.23 2.04-.38.51-.2.88-.43 1.27-.82.39-.39.62-.75.82-1.27.15-.39.33-.97.38-2.04.06-1.23.07-1.6.07-4.74 0-3.14-.01-3.51-.07-4.74-.05-1.07-.23-1.65-.38-2.04a3.42 3.42 0 0 0-.82-1.27 3.42 3.42 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38-1.23-.06-1.6-.07-4.74-.07Zm0 3.3a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0 9.24a3.64 3.64 0 1 0 0-7.28 3.64 3.64 0 0 0 0 7.28Zm7.13-9.45a1.31 1.31 0 1 1-2.62 0 1.31 1.31 0 0 1 2.62 0Z"/></svg>;
}
