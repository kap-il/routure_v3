'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';

/**
 * Seamlessly looping horizontal marquee. Items are duplicated so the scroll
 * wraps without a visible jump. Speed is px/s and the animation duration is
 * measured from the rendered track width so long/short strings behave the
 * same. Respects prefers-reduced-motion.
 */
export default function Marquee({
  items,
  speed = 60,
  sep = '✳',
  className = '',
  style,
}: {
  items: string[];
  speed?: number;
  sep?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const raf = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) setDuration(halfWidth / speed);
    });
    return () => cancelAnimationFrame(raf);
  }, [items, speed]);

  const line = (
    <>
      {items.map((t, i) => (
        <span
          key={i}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}
        >
          <span>{t}</span>
          <span style={{ color: 'var(--hot)' }}>{sep}</span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className={`routure-marquee ${className}`}
      style={{ overflow: 'hidden', width: '100%', ...style }}
    >
      <div
        ref={trackRef}
        className="routure-marquee-track"
        style={{
          display: 'inline-flex',
          gap: 18,
          whiteSpace: 'nowrap',
          animation: `routure-marquee ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {line}
        {line}
      </div>
      <style>{`
        @keyframes routure-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .routure-marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
