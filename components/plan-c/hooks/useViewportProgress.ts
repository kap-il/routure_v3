'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * Returns how far an element has scrolled through the viewport, 0..1.
 * 0 = top of element is at the bottom of the viewport (just entering),
 * 1 = bottom of element is at the top of the viewport (just leaving).
 */
export function useViewportProgress<T extends HTMLElement>(ref: RefObject<T | null>): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number | null = null;

    const calc = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + r.height;
      const past = vh - r.top;
      setP(Math.max(0, Math.min(1, past / total)));
      raf = null;
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(calc);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    calc();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return p;
}
