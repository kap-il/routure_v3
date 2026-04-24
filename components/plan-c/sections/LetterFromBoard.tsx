import { ROUTURE_DATA } from '../data';

export default function LetterFromBoard() {
  const letter = ROUTURE_DATA.letter;

  return (
    <section
      id="letter"
      style={{ borderBottom: '1px solid var(--ink)', padding: '80px 0', position: 'relative' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px' }}>
        <div style={{ gridColumn: '1 / 4' }}>
          <div className="t-mono" style={{ marginBottom: 12 }}>§ 04</div>
          <div className="t-disp" style={{ fontSize: 'clamp(40px, 4.4vw, 72px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.92 }}>
            Letter
            <br />
            <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>from the</span>
            <br />
            Editorial
            <br />
            Board.
          </div>
          <div className="t-mono" style={{ marginTop: 30, opacity: 0.6 }}>
            ISSUE 02 · COSMIC<br />
            FILED 19.04.2026<br />
            SET IN FRAUNCES (CL)<br />
            &amp; JETBRAINS MONO
          </div>
        </div>

        <div style={{ gridColumn: '5 / 9', fontSize: 15, lineHeight: 1.65, fontFamily: 'var(--f-sans)' }}>
          {letter.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 16, textWrap: 'pretty' }}>
              {i === 0 && (
                <span
                  className="t-disp"
                  style={{
                    fontSize: 62,
                    float: 'left',
                    lineHeight: 0.82,
                    marginRight: 10,
                    marginTop: 6,
                    fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
                  }}
                >
                  {p[0]}
                </span>
              )}
              {i === 0 ? p.slice(1) : p}
              {i === 0 && <sup style={{ color: 'var(--acid-deep)' }}> 1</sup>}
              {i === 1 && <sup style={{ color: 'var(--acid-deep)' }}> 2</sup>}
              {i === 2 && <sup style={{ color: 'var(--acid-deep)' }}> 3</sup>}
            </p>
          ))}
          <div className="t-disp-ital" style={{ fontSize: 24, marginTop: 24 }}>— The Board.</div>
        </div>

        <aside style={{ gridColumn: '9 / 12', paddingLeft: 18, borderLeft: '1px solid var(--rule)' }}>
          <div className="t-mono" style={{ marginBottom: 14, opacity: 0.7 }}>MARGINALIA</div>
          {letter.footnotes.map((f, i) => (
            <p
              key={i}
              className="t-mono-lg"
              style={{ marginBottom: 14, lineHeight: 1.5, letterSpacing: '0.02em', fontSize: 11 }}
            >
              {f}
            </p>
          ))}
        </aside>
      </div>
    </section>
  );
}
