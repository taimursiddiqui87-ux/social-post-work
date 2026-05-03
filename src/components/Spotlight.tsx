"use client";

import { type ReactNode, type CSSProperties, useRef, useCallback } from "react";

/**
 * Wraps any element so a soft radial glow follows the cursor on hover.
 * Wraps `.spotlight` CSS utility from globals.css with the pointer-tracking JS.
 */
export function Spotlight({
  children, className = "", as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, []);

  // @ts-expect-error generic refs across element tags
  return <Tag ref={ref} onPointerMove={onMove} className={`spotlight ${className}`} style={{} as CSSProperties}>
    {children}
  </Tag>;
}
