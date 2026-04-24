'use client';

import { useRef } from 'react';
import Placeholder from '../primitives/Placeholder';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useScrollY } from '../hooks/useScrollY';

export default function Hero() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const { x, y } = useMouseParallax(wrap, 26);
  const scrollY = useScrollY();

  const titleTransform = `translate3d(${x * 0.3}px, ${-scrollY * 0.15 + y * 0.2}px, 0)`;
  const imgTransform = `translate3d(${-x}px, ${-y - scrollY * 0.04}px, 0) scale(1.08)`;

  return (
    <section
      ref={wrap}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        borderBottom: '1px solid var(--ink)',
      }}
    >
      <div style={{ position: 'absolute', inset: '-6%', transform: imgTransform, transition: 'transform 120ms linear' }}>
        <Placeholder
          palette="p-night"
          style={{ width: '100%', height: '100%' }}
          label="COVER / COSMIC / APOGEE — HANA OYELARAN / PH. INES MARÉCHAL"
          corner="tr"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '-4vw', right: '-4vw', bottom: '-6vw',
          transform: titleTransform,
          transition: 'transform 120ms linear',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(240px, 42vw, 640px)',
            fontFamily: 'var(--f-display)',
            fontWeight: 200,
            fontVariationSettings: '"opsz" 144, "SOFT" 0, "wght" 200',
            letterSpacing: '-0.055em',
            color: 'var(--paper)',
            mixBlendMode: 'difference',
            whiteSpace: 'nowrap',
            lineHeight: 0.82,
          }}
        >
          Cosm
          <span style={{
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600',
          }}>ic</span>.
        </div>
      </div>

      <div style={{ position: 'absolute', top: 28, left: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference' }}>
        <div className="t-mono">ISSUE NO. 02</div>
        <div className="t-mono" style={{ marginTop: 4 }}>ON VIEW · 23.04.2026 — 22.07.2026</div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference', maxWidth: 360 }}>
        <div className="t-mono" style={{ marginBottom: 8 }}>FROM THE COVER</div>
        <div className="t-disp-ital" style={{ fontSize: 24, lineHeight: 1.05 }}>
          &ldquo;On orbit, gravity, and the<br/>clothes that prove we are here.&rdquo;
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference', textAlign: 'right' }}>
        <a href="#shoots" data-cursor="enter" className="t-mono" style={{ borderBottom: '1px solid currentColor', paddingBottom: 2 }}>
          ENTER THE COVER STORY →
        </a>
        <div className="t-mono" style={{ marginTop: 14, opacity: 0.75 }}>SCROLL · 07 shoots follow</div>
      </div>

      <div style={{
        position: 'absolute',
        top: 28, right: 28,
        zIndex: 3,
        background: 'var(--acid)',
        color: 'var(--ink)',
        padding: '6px 10px',
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        letterSpacing: '0.1em',
      }}>
        ● LIVE — 142 READERS
      </div>
    </section>
  );
}
