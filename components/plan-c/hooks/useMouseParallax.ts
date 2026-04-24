'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * Returns an {x, y} offset in pixels that mirrors the pointer's position
 * relative to the element's center, scaled by `strength`. Snaps back to
 * 0,0 on mouseleave.
 */
export function useMouseParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 20,
): { x: number; y: number } {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setOffset({ x: dx * strength, y: dy * strength });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);

  return offset;
}
