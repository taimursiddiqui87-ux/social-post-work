"use client";

import { useState, useTransition } from "react";
import { updateEngagement } from "@/app/actions";

interface Props {
  id: string;
  initial: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export function EngagementEditor({ id, initial }: Props) {
  const [stats, setStats] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const totalEngagement = stats.likes + stats.comments + stats.shares;
  const hasStats = stats.views > 0 || totalEngagement > 0;

  const onSave = () => {
    start(async () => {
      await updateEngagement(id, stats);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };

  const StatField = ({ label, icon, value, onChange }: {
    label: string; icon: string; value: number; onChange: (v: number) => void;
  }) => (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
        {icon} {label}
      </span>
      <input
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="0"
        className="w-20 rounded-lg border border-black/[0.1] bg-white px-2 py-1 text-[13px] tabular-nums text-zinc-900 shadow-sm focus:border-emerald-400"
      />
    </label>
  );

  if (editing) {
    return (
      <div className="mt-3 rounded-xl bg-zinc-50 p-3 ring-1 ring-black/[0.04]">
        <div className="flex flex-wrap gap-3">
          <StatField label="Views"    icon="👁"  value={stats.views}    onChange={(v) => setStats({ ...stats, views: v })} />
          <StatField label="Likes"    icon="❤️" value={stats.likes}    onChange={(v) => setStats({ ...stats, likes: v })} />
          <StatField label="Comments" icon="💬" value={stats.comments} onChange={(v) => setStats({ ...stats, comments: v })} />
          <StatField label="Shares"   icon="🔁" value={stats.shares}   onChange={(v) => setStats({ ...stats, shares: v })} />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onSave}
            disabled={pending}
            className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-3.5 py-1 text-[12px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => { setEditing(false); setStats(initial); }}
            disabled={pending}
            className="rounded-full px-3 py-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-4 text-[12px] text-zinc-500">
      {hasStats ? (
        <div className="flex items-center gap-3 tabular-nums">
          <span title="Views">👁 <span className="text-zinc-700">{stats.views.toLocaleString()}</span></span>
          <span title="Likes">❤️ <span className="text-zinc-700">{stats.likes.toLocaleString()}</span></span>
          <span title="Comments">💬 <span className="text-zinc-700">{stats.comments.toLocaleString()}</span></span>
          <span title="Shares">🔁 <span className="text-zinc-700">{stats.shares.toLocaleString()}</span></span>
        </div>
      ) : (
        <span className="text-zinc-400">No engagement logged</span>
      )}
      <button
        onClick={() => setEditing(true)}
        className="text-[11.5px] font-semibold text-emerald-700 hover:text-emerald-800"
      >
        {hasStats ? "Edit" : "Log engagement"}
      </button>
      {saved && <span className="text-[11.5px] text-emerald-600">✓ Saved</span>}
    </div>
  );
}
