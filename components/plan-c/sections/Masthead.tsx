'use client';

import Marquee from '../primitives/Marquee';
import { CREDITS_TICKER } from '../data';

const DATE_STR = new Date('2026-04-23T09:12:00').toLocaleDateString('en-US', {
  weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
}).toUpperCase();

export default function Masthead() {
  return (
    <header style={{ borderBottom: '1px solid var(--ink)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 28px 12px',
        borderBottom: '1px solid var(--rule)',
      }}>
        <div className="t-mono">
          <span>{DATE_STR}</span>
          <span style={{ margin: '0 12px', opacity: 0.4 }}>/</span>
          <span>NEW YORK · 52°F · WIND NNE</span>
        </div>
        <div className="t-mono" style={{ textAlign: 'center' }}>
          <span style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '3px 8px' }}>NO. 02</span>
          <span style={{ margin: '0 10px' }}>—</span>
          <span style={{ letterSpacing: '0.16em' }}>COSMIC</span>
        </div>
        <nav className="t-mono" style={{ textAlign: 'right', display: 'flex', gap: 22, justifyContent: 'flex-end' }}>
          <a data-cursor="view" href="#issues">ISSUES</a>
          <a data-cursor="view" href="#shoots">SHOOTS</a>
          <a data-cursor="view" href="#archive">ARCHIVE</a>
          <a data-cursor="read" href="#journal">JOURNAL</a>
          <a data-cursor="open" href="#shop">SHOP 001</a>
          <a data-cursor="subscribe" href="#subscribe" style={{ background: 'var(--acid)', padding: '3px 8px', color: 'var(--ink)' }}>SUBSCRIBE</a>
        </nav>
      </div>

      <div style={{ position: 'relative', padding: '12px 0 6px', overflow: 'hidden' }}>
        <div className="t-disp" style={{
          fontSize: 'clamp(120px, 22.5vw, 340px)',
          fontWeight: 300,
          lineHeight: 0.82,
          letterSpacing: '-0.045em',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 0,
          position: 'relative',
        }}>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>R</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 400' }}>O</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 20, "wght" 600' }}>U</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 200' }}>T</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 800', fontStyle: 'italic' }}>U</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "wght" 300' }}>R</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>E</span>
        </div>
        <div className="t-mono" style={{
          position: 'absolute',
          right: 28, top: 16,
          maxWidth: 180,
          lineHeight: 1.45,
          textAlign: 'right',
        }}>
          AN INDEPENDENT<br/>PUBLICATION ON<br/>GARMENTS, WEATHER<br/>AND POSTURE. EST. 2025.
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--ink)',
        borderBottom: '1px solid var(--ink)',
        padding: '10px 0',
        background: 'var(--paper)',
        position: 'relative',
      }}>
        <div className="t-mono" style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          background: 'var(--paper)', paddingRight: 10, zIndex: 2,
        }}>
          LIVE CREDITS →
        </div>
        <div style={{ paddingLeft: 160 }}>
          <Marquee items={CREDITS_TICKER} speed={55} sep="✳" className="t-mono-lg" />
        </div>
      </div>
    </header>
  );
}
