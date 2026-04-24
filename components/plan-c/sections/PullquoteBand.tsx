'use client';

import { useRef } from 'react';
import Placeholder from '../primitives/Placeholder';
import { useViewportProgress } from '../hooks/useViewportProgress';

export default function PullquoteBand() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useViewportProgress(ref);
  const typeShift = (p - 0.5) * -220;
  const bgShift = (p - 0.5) * 120;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        position: 'relative',
        height: '80vh',
        borderBottom: '1px solid var(--ink)',
        background: 'var(--ink)',
        color: 'var(--paper)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-10%', left: 0, right: 0, height: '120%',
        transform: `translateY(${bgShift}px)`,
        opacity: 0.35,
      }}>
        <Placeholder
          palette="p-plum"
          style={{ width: '100%', height: '100%' }}
          label="EDITORIAL TEXTURE / DARK MATTER OUTTAKE"
          corner="tr"
        />
      </div>

      <div
        className="t-mono"
        style={{
          position: 'absolute', top: 22, left: 28, right: 28,
          display: 'flex', justifyContent: 'space-between',
          zIndex: 3,
        }}
      >
        <span>§ 02 — EDITORIAL · PULLQUOTE</span>
        <span>FROM: &ldquo;ON WEARING A PLANET&rdquo; / LÉA ARONSON · 04.23</span>
      </div>

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        transform: `translate3d(0, ${typeShift}px, 0)`,
        zIndex: 2,
        padding: '0 24px',
      }}>
        <blockquote className="t-disp" style={{
          fontSize: 'clamp(48px, 6.6vw, 104px)',
          fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 300',
          lineHeight: 0.96,
          maxWidth: '1200px',
          letterSpacing: '-0.02em',
          textWrap: 'balance',
          margin: 0,
        }}>
          <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800', fontStyle: 'italic', marginRight: 8 }}>&ldquo;</span>
          Clothes were never ornament.<br/>
          They are the last evidence<br/>
          that the body <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>refused</span><br/>
          to be only <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 700', fontStyle: 'italic' }}>weather</span>.
          <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800', fontStyle: 'italic', marginLeft: 8 }}>&rdquo;</span>
        </blockquote>
      </div>

      <div
        className="t-mono"
        style={{
          position: 'absolute', bottom: 22, left: 28, right: 28,
          display: 'flex', justifyContent: 'space-between',
          zIndex: 3,
        }}
      >
        <span>— LÉA ARONSON, CONTRIBUTING EDITOR</span>
        <a
          href="#article"
          data-cursor="read"
          style={{ borderBottom: '1px solid var(--paper)', paddingBottom: 2 }}
        >
          READ THE FULL ESSAY →
        </a>
      </div>
    </section>
  );
}
