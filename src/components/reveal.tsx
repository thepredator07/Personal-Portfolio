"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content in once as it scrolls into view.
 *
 * Progressive enhancement: content is only hidden when the `js` class is on
 * <html> (set by an inline script before paint), so crawlers, no-JS visitors
 * and reduced-motion users always see everything.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Tells the inline safety script in layout.tsx that JS is alive.
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
