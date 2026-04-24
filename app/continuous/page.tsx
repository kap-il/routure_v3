import '../plan-c/tokens.css';
import CustomCursor from '@/components/plan-c/primitives/CustomCursor';
import Marquee from '@/components/plan-c/primitives/Marquee';
import AssemblyText from '@/components/plan-c/primitives/AssemblyText';
import ParallaxPlate from './ParallaxPlate';

export const metadata = {
  title: 'Routure — Continuous (Phase 1 foundation)',
};

const CREDITS = [
  'ISSUE No. 02 — COSMIC',
  'PHOTOGRAPHY — J. Okafor · M. Halberg',
  'STYLING — R. Chen',
  'TYPE — Fraunces · Barlow Condensed · JetBrains Mono',
  'BUILT ON — Supabase · Next.js · Vercel',
];

export default function ContinuousFoundation() {
  return (
    <div data-routure="plan-c" style={{ minHeight: '100vh' }}>
      <CustomCursor />

      {/* Masthead strip */}
      <header
        style={{
          position: 'relative',
          padding: '40px 48px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <span className="r-mono">ROUTURE · NYC</span>
        <span className="r-mono" data-cursor="Scroll">
          Phase 1 · Foundation
        </span>
        <span className="r-mono">2026 · 04 · 23</span>
      </header>

      {/* Hero plate */}
      <section
        style={{
          padding: '96px 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: 48,
          alignItems: 'end',
          minHeight: '80vh',
        }}
      >
        <div>
          <span className="r-mono" style={{ display: 'block', marginBottom: 24 }}>
            Issue No. 02 — Cosmic
          </span>
          <AssemblyText
            as="h1"
            text="Routure."
            className="r-display"
            style={{ fontSize: 220, margin: 0 }}
          />
          <p
            className="r-serif-italic"
            style={{ fontSize: 28, lineHeight: 1.2, maxWidth: 560, marginTop: 40 }}
          >
            A continuous publication. Scroll through four acts; the archive flips sideways at the end.
          </p>
        </div>
        <ParallaxPlate />
      </section>

      {/* Token swatches */}
      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--rule)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
          <span className="r-mono">§ 01 · Tokens</span>
          <span className="r-mono">Source: app/plan-c/tokens.css</span>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Swatch name="ink" value="#0A0A0A" />
          <Swatch name="paper" value="#F2EEE5" />
          <Swatch name="paper-2" value="#E8E2D4" />
          <Swatch name="hot" value="#FF3D1F" />
        </div>
      </section>

      {/* Type specimens */}
      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--rule)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
          <span className="r-mono">§ 02 · Type</span>
          <span className="r-mono">Fraunces · Barlow Condensed · JetBrains Mono</span>
        </header>
        <div style={{ display: 'grid', gap: 24 }}>
          <p className="r-display" style={{ fontSize: 120, margin: 0 }}>
            Cosmic
          </p>
          <p className="r-serif-italic" style={{ fontSize: 36, margin: 0 }}>
            — from the desk, with love.
          </p>
          <p className="r-cond" style={{ fontSize: 28, margin: 0 }}>
            Section · Shoot · Archive
          </p>
          <p className="r-mono" style={{ fontSize: 14, margin: 0 }}>
            Photography credit — shoot №02 · frame 04 — Naoshima, JP
          </p>
        </div>
      </section>

      {/* Marquee demo */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <Marquee items={CREDITS} speed={70} />
      </section>

      {/* Assembly text scroll demo */}
      <section style={{ padding: '160px 48px' }}>
        <AssemblyText
          as="h2"
          text="Scroll assembles each glyph."
          className="r-display"
          style={{ fontSize: 104, margin: 0, maxWidth: '16ch' }}
        />
      </section>

      <footer
        style={{
          padding: '48px',
          borderTop: '1px solid var(--rule)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span className="r-mono">End of Phase 1 · Foundation</span>
        <span className="r-mono">Next — Act I</span>
      </footer>
    </div>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div>
      <div
        style={{
          height: 120,
          background: value,
          border: '1px solid var(--rule)',
          marginBottom: 10,
        }}
      />
      <div className="r-mono">{name}</div>
      <div className="r-mono" style={{ opacity: 0.6 }}>
        {value}
      </div>
    </div>
  );
}
