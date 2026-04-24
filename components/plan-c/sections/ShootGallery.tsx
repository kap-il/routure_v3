'use client';

import { useRef, useState } from 'react';
import Placeholder from '../primitives/Placeholder';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { ROUTURE_DATA, type Shoot } from '../data';

const LAYOUT = [
  { i: 0, col: '1 / 6', h: '88vh', orient: 'portrait' },
  { i: 1, col: '7 / 13', h: '54vh', orient: 'landscape' },
  { i: 2, col: '7 / 10', h: '62vh', orient: 'portrait' },
  { i: 3, col: '10 / 13', h: '40vh', orient: 'portrait' },
  { i: 4, col: '1 / 8', h: '64vh', orient: 'landscape' },
  { i: 5, col: '9 / 13', h: '78vh', orient: 'portrait' },
  { i: 6, col: '1 / 9', h: '48vh', orient: 'landscape' },
  { i: 7, col: '9 / 13', h: '48vh', orient: 'portrait' },
];

export default function ShootGallery() {
  return (
    <section id="shoots" style={{ padding: '80px 0 40px', position: 'relative', background: 'var(--paper)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px', alignItems: 'end', marginBottom: 40 }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <div className="t-mono" style={{ marginBottom: 18 }}>§ 01 — THE SHOOTS</div>
          <div className="t-disp" style={{ fontSize: 'clamp(60px, 9vw, 140px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            Eight <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600' }}>orbits</span>,
          </div>
          <div className="t-disp" style={{ fontSize: 'clamp(60px, 9vw, 140px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            one <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600' }}>atmosphere</span>.
          </div>
        </div>
        <div style={{ gridColumn: '8 / 13', justifySelf: 'end', textAlign: 'right', maxWidth: 360 }}>
          <div className="t-mono" style={{ marginBottom: 12, opacity: 0.7 }}>SPRING · COSMIC · SHOT 09.2025 — 03.2026</div>
          <p className="t-sans-cond" style={{ fontSize: 15, lineHeight: 1.35 }}>
            Eight shoots, thirty-one collaborators, four cities. Scroll to read; hover to unfold the credits. Nothing here has been color-graded.
          </p>
        </div>
      </div>

      <div className="t-mono" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px 24px', borderBottom: '1px solid var(--ink)' }}>
        <span style={{ gridColumn: '1/2' }}>№</span>
        <span style={{ gridColumn: '2/6' }}>TITLE</span>
        <span style={{ gridColumn: '6/9' }}>PHOTOGRAPHY</span>
        <span style={{ gridColumn: '9/11' }}>LOCATION</span>
        <span style={{ gridColumn: '11/13', textAlign: 'right' }}>ASPECT / OPEN →</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 18,
        padding: '28px',
        alignItems: 'start',
      }}>
        {LAYOUT.map(({ i, col, h, orient }) => {
          const shoot = ROUTURE_DATA.shoots[i];
          return (
            <ShootTile
              key={shoot.slug}
              shoot={shoot}
              gridColumn={col}
              height={h}
              orient={orient}
              index={i}
            />
          );
        })}
      </div>
    </section>
  );
}

function ShootTile({
  shoot, gridColumn, height, orient, index,
}: {
  shoot: Shoot; gridColumn: string; height: string; orient: string; index: number;
}) {
  const [hov, setHov] = useState(false);
  const tileRef = useRef<HTMLAnchorElement | null>(null);
  const { x, y } = useMouseParallax(tileRef, 14);

  return (
    <a
      href={`/shoot/${shoot.slug}`}
      data-cursor="open shoot"
      ref={tileRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        gridColumn,
        height,
        display: 'block',
        overflow: 'hidden',
        border: '1px solid var(--ink)',
        transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{
        position: 'absolute', inset: '-4%',
        transform: `translate3d(${hov ? x : 0}px, ${hov ? y : 0}px, 0) scale(${hov ? 1.08 : 1})`,
        transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <Placeholder
          palette={shoot.palette}
          style={{ width: '100%', height: '100%' }}
          label={`${shoot.title.toUpperCase()} / ${orient.toUpperCase()}`}
          corner="tr"
        />
      </div>

      <div style={{
        position: 'absolute', top: 12, left: 12,
        fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--paper)', mixBlendMode: 'difference',
        zIndex: 3,
      }}>
        №{String(index + 1).padStart(2, '0')} · {shoot.section_type.toUpperCase()}
      </div>

      <div style={{
        position: 'absolute',
        left: 14, right: 14, bottom: 14,
        color: 'var(--paper)',
        mixBlendMode: 'difference',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 18,
      }}>
        <div>
          <div className="t-disp" style={{
            fontSize: 'clamp(28px, 3.2vw, 56px)',
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400',
            lineHeight: 0.9,
            transform: hov ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)',
          }}>
            {shoot.title}
          </div>
          <div className="t-mono" style={{ marginTop: 6 }}>
            PH. {shoot.credits.photographer} · STY. {shoot.credits.stylist}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: 0, right: hov ? 0 : '-60%',
        width: '56%',
        height: '100%',
        background: 'var(--acid)',
        color: 'var(--ink)',
        padding: '18px 18px 18px 20px',
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        letterSpacing: '0.04em',
        transition: 'right 450ms cubic-bezier(.2,.8,.2,1)',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ fontSize: 10, opacity: 0.7, borderBottom: '1px solid var(--ink)', paddingBottom: 8 }}>
          CREDITS — {shoot.title.toUpperCase()}
        </div>
        {Object.entries(shoot.credits).map(([role, name]) => (
          <div key={role} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12 }}>
            <span style={{ opacity: 0.55 }}>{role.replace(/_/g, ' ').toUpperCase()}</span>
            <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>{name}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--ink)' }}>
          <span>№{String(index + 1).padStart(3, '0')}</span>
          <span>OPEN →</span>
        </div>
      </div>
    </a>
  );
}
