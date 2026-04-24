'use client';

import { useRef } from 'react';
import { useMouseParallax } from '@/components/plan-c/hooks/useMouseParallax';

/**
 * Placeholder-filled plate that drifts with the pointer. Exists to exercise
 * useMouseParallax in the Phase 1 preview.
 */
export default function ParallaxPlate() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { x, y } = useMouseParallax(ref, 14);
  return (
    <div
      ref={ref}
      data-cursor="View"
      className="ph ph--dark"
      style={{
        height: 480,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: 'transform 0.18s cubic-bezier(0.2, 0.7, 0.2, 1)',
      }}
    >
      <span>Plate · Parallax · 14px</span>
    </div>
  );
}
