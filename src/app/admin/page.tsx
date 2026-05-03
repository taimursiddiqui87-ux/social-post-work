import { redirect } from "next/navigation";
import { isAdminCaller, loginAsAdmin, logoutAdmin } from "@/lib/limits";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";
  const secret = String(formData.get("secret") ?? "");
  const ok = await loginAsAdmin(secret);
  if (ok) redirect("/?admin=ok");
  redirect("/admin?error=invalid");
}

async function logoutAction() {
  "use server";
  await logoutAdmin();
  redirect("/admin");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const isAdmin = await isAdminCaller();
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] shadow-sm">
            <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-zinc-900">Admin</span>
        </div>

        {isAdmin ? (
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 p-6 shadow-sm">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Admin mode active
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">You're signed in as admin</h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">
              You have unlimited access on this browser. The cookie persists for 1 year. Other users still hit the daily limits unless they enter the unlock code.
            </p>
            <form action={logoutAction} className="mt-5 flex gap-2">
              <a href="/" className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2 text-[13px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97]">
                Go to app
              </a>
              <button
                type="submit"
                className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97]"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <>
            <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">
              Admin sign-in
            </h1>
            <p className="mt-2 text-[14.5px] text-zinc-600">
              For your eyes only. Sets a persistent admin cookie that bypasses all daily limits on this browser.
            </p>

            <form action={loginAction} className="mt-8 space-y-3 rounded-2xl border border-black/[0.06] bg-white/80 p-6 shadow-sm backdrop-blur-xl">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-700">Admin secret</span>
                <input
                  type="password"
                  name="secret"
                  required
                  autoFocus
                  autoComplete="off"
                  className="w-full rounded-xl border border-black/[0.1] bg-white px-3.5 py-2.5 text-[14.5px] text-zinc-900 placeholder-zinc-400 shadow-sm transition focus:border-emerald-400"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow shadow-emerald-500/30 ring-1 ring-emerald-600/30 transition hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98]"
              >
                Sign in as admin
              </button>
              {error === "invalid" && (
                <p className="text-[12.5px] text-red-600">Invalid secret. Try again.</p>
              )}
            </form>

            <p className="mt-6 text-center text-[12px] text-zinc-500">
              Set <code className="rounded bg-zinc-100 px-1 py-0.5">ADMIN_SECRET</code> in your env first.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
