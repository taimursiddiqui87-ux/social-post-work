"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("from") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const sb = supabaseBrowser();
      const { error } = mode === "signin"
        ? await sb.auth.signInWithPassword({ email, password })
        : await sb.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          });
      if (error) {
        setError(error.message);
        return;
      }
      // Force a full reload so middleware sees the new session cookie.
      window.location.href = next;
    });
  };

  return (
    <>
      <div className="mb-4 flex rounded-full bg-zinc-100 p-1 ring-1 ring-black/[0.04]">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); }}
            className={`flex-1 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
              mode === m
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

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

        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-700">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            className="w-full rounded-xl border border-black/[0.1] bg-white px-3.5 py-2.5 text-[14.5px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
          />
        </label>

        <button
          type="submit"
          disabled={pending || !email || password.length < 6}
          className="w-full rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50"
        >
          {pending
            ? (mode === "signin" ? "Signing in…" : "Creating account…")
            : (mode === "signin" ? "Sign in" : "Create account")}
        </button>

        {error && <p className="text-[12.5px] text-red-600">{error}</p>}
      </form>

      <p className="mt-4 text-center text-[12px] text-zinc-500">
        {mode === "signin" ? "New here? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
      </p>
    </>
  );
}
