'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Replaces the native cursor with a difference-blended ring that grows and
 * shows a label when it enters an element marked with data-cursor="LABEL".
 *
 * Disabled on coarse-pointer devices via CSS (see app/plan-c/tokens.css).
 * SSR-safe: mounts on useEffect; renders nothing server-side.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState('');
  const [big, setBig] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(hover: none)').matches) return;
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf: number | null = null;
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (ref.current) {
        ref.current.style.left = `${x}px`;
        ref.current.style.top = `${y}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      if (target) {
        setLabel(target.getAttribute('data-cursor') ?? '');
        setBig(true);
      } else {
        setBig(false);
        setLabel('');
      }
    };
    document.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`routure-cursor ${big ? 'is-big' : ''}`} aria-hidden="true">
      {big ? label : null}
    </div>
  );
}
