"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ to, durationMs = 700 }: { to: number; durationMs?: number }) {
  const [n, setN] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      if (startedAt.current === null) startedAt.current = t;
      const elapsed = t - startedAt.current;
      const progress = Math.min(1, elapsed / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setN(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);

  return <>{n.toLocaleString()}</>;
}
