"use client";

import { useState, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
        setState("error");
      } else {
        setState("sent");
      }
    });
  };

  if (state === "sent") {
    return (
      <div className="space-y-3 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-zinc-900">Check your email</p>
        <p className="text-[13.5px] leading-relaxed text-zinc-600">
          We sent a sign-in link to <span className="font-medium text-zinc-900">{email}</span>.
          Click the link to continue.
        </p>
        <button
          onClick={() => { setState("idle"); setEmail(""); }}
          className="text-[12.5px] font-medium text-emerald-700 hover:text-emerald-800"
        >Use a different email</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-700">Email</span>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-black/[0.1] bg-white px-3.5 py-2.5 text-[14.5px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
        />
      </label>
      <button
        type="submit"
        disabled={pending || !email}
        className="w-full rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Sending link…" : "Send sign-in link"}
      </button>
      {error && <p className="text-[12.5px] text-red-600">{error}</p>}
    </form>
  );
}
