'use client';

import Placeholder from '../primitives/Placeholder';
import { ROUTURE_DATA } from '../data';

const PALETTES = ['p-ember', 'p-moss', 'p-pool', 'p-clay', 'p-bone', 'p-plum', 'p-ash', 'p-night', 'p-acid'];

export default function CategoryArchive() {
  const cats = ROUTURE_DATA.categories;

  return (
    <section style={{ borderBottom: '1px solid var(--ink)', padding: '60px 0 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px 28px' }}>
        <div style={{ gridColumn: '1 / 8' }}>
          <div className="t-mono" style={{ marginBottom: 16 }}>§ 03 — CATEGORIES · CONCEPTUAL LENSES, NOT TAXONOMY</div>
          <div className="t-disp" style={{ fontSize: 'clamp(56px, 7.6vw, 120px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            Five <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>lenses</span> to read
          </div>
          <div className="t-disp" style={{ fontSize: 'clamp(56px, 7.6vw, 120px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            every garment through.
          </div>
        </div>
        <div
          className="t-mono"
          style={{ gridColumn: '9 / 13', alignSelf: 'end', textAlign: 'right' }}
        >
          DRAG → OR USE ⟵ / ⟶ · TOTAL 57 PIECES
        </div>
      </div>

      {cats.map((c, ci) => (
        <div key={c.name} style={{ borderTop: '1px solid var(--rule)', padding: '18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '0 28px 14px' }}>
            <div className="t-disp" style={{ fontSize: 'clamp(40px, 4.8vw, 80px)', fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400', flexShrink: 0 }}>
              <span style={{ opacity: 0.35, fontSize: '0.5em', marginRight: 14, verticalAlign: 'middle' }}>№{String(ci + 1).padStart(2, '0')}</span>
              {c.name}
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>.</span>
            </div>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--rule)', marginTop: 14 }} />
            <div className="t-mono" style={{ opacity: 0.7 }}>{String(c.count).padStart(2, '0')} ENTRIES</div>
            <a
              href={`#${c.name.toLowerCase()}`}
              data-cursor="enter"
              className="t-mono"
              style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '6px 10px' }}
            >
              OPEN →
            </a>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 28px 6px' }}>
            <div style={{ display: 'flex', gap: 14, width: 'max-content' }}>
              {Array.from({ length: 9 }).map((_, i) => {
                const tall = (ci + i) % 3 === 0;
                const wide = (ci + i) % 4 === 1;
                const w = wide ? 280 : 190;
                const h = tall ? 280 : 220;
                const pal = PALETTES[(ci * 3 + i) % PALETTES.length];
                return (
                  <div
                    key={i}
                    data-cursor="preview"
                    style={{ flexShrink: 0, width: w, height: h, position: 'relative' }}
                  >
                    <Placeholder
                      palette={pal}
                      style={{ width: '100%', height: '100%' }}
                      label={`${c.name.slice(0, 4).toUpperCase()}-${String(i + 1).padStart(2, '0')}`}
                      corner="tr"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
