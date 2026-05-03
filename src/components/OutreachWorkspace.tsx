"use client";

import { useState, useTransition } from "react";
import { generateOutreachAction } from "@/app/actions";
import type { OutreachMessages, Prospect } from "@/lib/outreach";

const ASK_DAILY_LIMIT = 3;
const WHATSAPP_NUMBER = "923114488938";

type Mode = "single" | "bulk";

export function OutreachWorkspace() {
  const [mode, setMode] = useState<Mode>("single");
  return (
    <div className="space-y-5">
      <div className="flex rounded-full bg-zinc-100 p-1 ring-1 ring-black/[0.04] w-fit">
        {(["single", "bulk"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${
              mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {m === "single" ? "Single prospect" : "Bulk CSV"}
          </button>
        ))}
      </div>
      {mode === "single" ? <SinglePanel /> : <BulkPanel />}
    </div>
  );
}

/* ───────────────────────────── Single prospect ───────────────────────────── */

function SinglePanel() {
  const [prospect, setProspect] = useState<Prospect>({ name: "", role: "", company: "", observation: "" });
  const [messages, setMessages] = useState<OutreachMessages | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const [locked, setLocked] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      setMsg("Generating…");
      setMessages(null);
      const r = await generateOutreachAction(prospect);
      if (!r.ok) {
        setMsg(r.reason === "LIMIT_REACHED" ? "Free daily generation limit reached." : `Error: ${r.message}`);
        if (r.reason === "LIMIT_REACHED") setLocked(true);
        return;
      }
      setMessages(r.data);
      setMsg(`${r.usage.askUsed}/${ASK_DAILY_LIMIT} used today${r.usage.isAdmin ? " · admin" : ""}`);
    });
  };

  const update = (k: keyof Prospect) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProspect({ ...prospect, [k]: e.target.value });

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="rounded-3xl border border-black/[0.06] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold tracking-tight text-zinc-900">Prospect details</p>
          <span className="text-[11.5px] text-zinc-500">{msg || `Free: ${ASK_DAILY_LIMIT}/day`}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *"     value={prospect.name}    onChange={update("name")}    placeholder="e.g. Sarah Johnson" />
          <Field label="Role *"     value={prospect.role}    onChange={update("role")}    placeholder="e.g. Founder & CEO" />
          <Field label="Company *"  value={prospect.company} onChange={update("company")} placeholder="e.g. Acme Corp" />
          <Field label="Observation (optional)" value={prospect.observation ?? ""} onChange={update("observation")}
                 placeholder='e.g. "saw they posted about hiring SDRs"' />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="submit"
            disabled={pending || locked}
            className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
          >
            {pending ? "Generating…" : "Generate messages"}
          </button>
          {locked && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like an unlock code for Social Post Work.")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25D366] px-3 py-2 text-[12px] font-semibold text-white"
            >
              WhatsApp for unlimited
            </a>
          )}
        </div>
      </form>

      {messages && (
        <div className="space-y-3">
          <MessageCard label="🤝 Connection request" subtitle="Day 1 — initial connect (under 300 chars)" body={messages.connection} />
          <MessageCard label="💬 Follow-up 1" subtitle="Day 4 — light nudge" body={messages.followup1} />
          <MessageCard label="✨ Follow-up 2" subtitle="Day 7 — value-based nudge" body={messages.followup2} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-[14px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
      />
    </label>
  );
}

function MessageCard({ label, subtitle, body }: { label: string; subtitle: string; body: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold tracking-tight text-zinc-900">{label}</p>
          <p className="text-[11.5px] text-zinc-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] tabular-nums text-zinc-500">{body.length} chars</span>
          <button
            onClick={onCopy}
            className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ring-1 transition active:scale-[0.97] ${
              copied
                ? "bg-emerald-50 text-emerald-700 ring-emerald-300"
                : "bg-zinc-900 text-white ring-zinc-800 hover:bg-zinc-800"
            }`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-zinc-800">{body}</p>
    </div>
  );
}

/* ───────────────────────────── Bulk CSV ───────────────────────────── */

interface BulkRow extends Prospect {
  status: "pending" | "running" | "done" | "error";
  messages?: OutreachMessages;
  error?: string;
}

function parseCsv(text: string): Prospect[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  // Detect delimiter: tab > comma. Skip header row if first line contains keywords.
  const delim = lines[0].includes("\t") ? "\t" : ",";
  const splitLine = (l: string) => l.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));

  const header = splitLine(lines[0]).map((h) => h.toLowerCase());
  const isHeader = header.some((h) =>
    ["name", "first name", "first_name", "role", "title", "company", "observation", "context"].includes(h)
  );

  const colIdx = (...names: string[]) => names.map((n) => header.indexOf(n)).find((i) => i >= 0) ?? -1;
  const nameIdx = colIdx("name", "first name", "first_name");
  const roleIdx = colIdx("role", "title", "position");
  const compIdx = colIdx("company", "organization", "org");
  const obsIdx  = colIdx("observation", "context", "note");

  const rows: Prospect[] = [];
  const startLine = isHeader ? 1 : 0;
  for (let i = startLine; i < lines.length; i++) {
    const c = splitLine(lines[i]);
    if (c.length < 3) continue;
    rows.push({
      name:        isHeader && nameIdx >= 0 ? c[nameIdx] || "" : c[0] || "",
      role:        isHeader && roleIdx >= 0 ? c[roleIdx] || "" : c[1] || "",
      company:     isHeader && compIdx >= 0 ? c[compIdx] || "" : c[2] || "",
      observation: isHeader && obsIdx  >= 0 ? c[obsIdx]  || "" : c[3] || "",
    });
  }
  return rows.filter((p) => p.name && p.role && p.company);
}

function csvEscape(s: string): string {
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(rows: BulkRow[]): string {
  const header = ["name", "role", "company", "observation", "connection", "followup1", "followup2", "status", "error"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([
      r.name, r.role, r.company, r.observation ?? "",
      r.messages?.connection ?? "", r.messages?.followup1 ?? "", r.messages?.followup2 ?? "",
      r.status, r.error ?? "",
    ].map(csvEscape).join(","));
  }
  return lines.join("\n");
}

function BulkPanel() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [stopMsg, setStopMsg] = useState("");

  const onParse = () => {
    const parsed = parseCsv(text);
    setRows(parsed.map((p) => ({ ...p, status: "pending" })));
    setStopMsg(parsed.length === 0 ? "No valid rows found. Need columns: name, role, company, [observation]." : "");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || "");
      setText(txt);
      const parsed = parseCsv(txt);
      setRows(parsed.map((p) => ({ ...p, status: "pending" })));
    };
    reader.readAsText(f);
  };

  const onRun = async () => {
    if (running) return;
    setRunning(true);
    setStopMsg("");
    setProgress({ done: 0, total: rows.length });

    const updated = [...rows];
    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: "running" };
      setRows([...updated]);
      try {
        const r = await generateOutreachAction({
          name: updated[i].name,
          role: updated[i].role,
          company: updated[i].company,
          observation: updated[i].observation,
        });
        if (r.ok) {
          updated[i] = { ...updated[i], status: "done", messages: r.data };
        } else {
          updated[i] = { ...updated[i], status: "error", error: r.message };
          if (r.reason === "LIMIT_REACHED") {
            setStopMsg("Daily limit reached. Stopped early. Use admin login or unlock code for unlimited.");
            setRows([...updated]);
            setProgress({ done: i + 1, total: rows.length });
            break;
          }
        }
      } catch (e) {
        updated[i] = { ...updated[i], status: "error", error: (e as Error).message };
      }
      setRows([...updated]);
      setProgress({ done: i + 1, total: rows.length });
      // Brief pause to stay under Groq rate limit on big batches
      await new Promise((r) => setTimeout(r, 200));
    }

    setRunning(false);
  };

  const onDownload = () => {
    const csv = rowsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = rows.filter((r) => r.status === "done").length;
  const errCount  = rows.filter((r) => r.status === "error").length;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-black/[0.06] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <p className="mb-2 text-[13px] font-semibold tracking-tight text-zinc-900">
          Paste CSV or upload a file
        </p>
        <p className="mb-3 text-[12.5px] leading-relaxed text-zinc-600">
          Required columns: <code className="rounded bg-zinc-100 px-1 py-0.5">name</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">role</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">company</code>. Optional:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">observation</code>. Tabs or commas accepted. With or without header row.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={`name,role,company,observation\nSarah Johnson,Founder,Acme,saw they're hiring SDRs\nMike Lee,VP Marketing,BetaCo,posts daily about content`}
          className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white p-3.5 font-mono text-[12.5px] leading-relaxed text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={onParse}
            disabled={!text.trim() || running}
            className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50"
          >
            Parse rows
          </button>
          <label className="cursor-pointer rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50">
            Upload CSV
            <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
          </label>
          {rows.length > 0 && (
            <span className="text-[12.5px] text-zinc-600">
              {rows.length} rows ready
              {progress.total > 0 && ` · ${progress.done}/${progress.total} processed`}
              {doneCount > 0 && ` · ${doneCount} ✓`}
              {errCount > 0 && ` · ${errCount} ✗`}
            </span>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={onRun}
              disabled={running || rows.length === 0}
              className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] disabled:opacity-50"
            >
              {running ? `Generating ${progress.done}/${progress.total}…` : "Generate for all"}
            </button>
            <button
              onClick={onDownload}
              disabled={doneCount === 0}
              className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97] disabled:opacity-50"
            >
              Download CSV
            </button>
            {stopMsg && <span className="text-[12px] text-amber-700">{stopMsg}</span>}
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 shadow-sm">
            <table className="w-full text-[12.5px]">
              <thead className="bg-zinc-50 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                <tr>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Company</th>
                  <th className="px-4 py-2.5">Observation</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {rows.map((r, i) => (
                  <tr key={i} className={r.status === "running" ? "bg-emerald-50/40" : ""}>
                    <td className="px-4 py-2 font-medium text-zinc-900">{r.name}</td>
                    <td className="px-4 py-2 text-zinc-700">{r.role}</td>
                    <td className="px-4 py-2 text-zinc-700">{r.company}</td>
                    <td className="px-4 py-2 text-zinc-500 truncate max-w-[200px]" title={r.observation}>{r.observation || "—"}</td>
                    <td className="px-4 py-2">
                      {r.status === "pending" && <span className="text-zinc-400">pending</span>}
                      {r.status === "running" && <span className="text-emerald-700">running…</span>}
                      {r.status === "done"    && <span className="text-emerald-700 font-semibold">✓ done</span>}
                      {r.status === "error"   && <span className="text-red-600" title={r.error}>✗ {r.error?.slice(0, 30)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
