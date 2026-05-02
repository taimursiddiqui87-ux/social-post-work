import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] shadow-sm">
            <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-zinc-900">Social Post</span>
        </div>

        <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-tight text-zinc-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-[14.5px] text-zinc-600">
          We'll email you a sign-in link. No passwords.
        </p>

        <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[12.5px] text-zinc-500">
          AI news → social drafts. Powered by Groq + Supabase.
        </p>
      </div>
    </div>
  );
}
