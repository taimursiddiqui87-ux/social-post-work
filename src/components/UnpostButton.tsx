"use client";
import { useTransition } from "react";
import { unmarkPosted } from "@/app/actions";

export function UnpostButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(() => unmarkPosted(id))}
      className="text-xs text-neutral-500 hover:text-neutral-300 disabled:opacity-50"
    >Move back to queue</button>
  );
}
