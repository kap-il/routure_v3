'use client';

export default function MegaFooter() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '60px 28px 30px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, borderBottom: '1px solid rgba(236,231,222,0.2)' }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <div className="t-mono" style={{ marginBottom: 14, opacity: 0.6 }}>§ 05 — SUBSCRIBE / PAPER QUARTERLY + WEB</div>
          <div className="t-disp" style={{ fontSize: 64, fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.92 }}>
            Be{' '}
            <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600', color: 'var(--acid)' }}>first</span>{' '}
            in<br />the orbit.
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ marginTop: 28, display: 'flex', borderBottom: '1px solid var(--paper)' }}
          >
            <input
              placeholder="YOUR.EMAIL@DOMAIN"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--paper)',
                fontFamily: 'var(--f-mono)',
                fontSize: 14,
                padding: '14px 0',
                outline: 'none',
                letterSpacing: '0.04em',
              }}
            />
            <button
              type="submit"
              data-cursor="subscribe"
              style={{
                background: 'var(--acid)',
                color: 'var(--ink)',
                border: 'none',
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                padding: '0 18px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              SIGN UP →
            </button>
          </form>
          <div className="t-mono" style={{ marginTop: 14, opacity: 0.5, maxWidth: 380, lineHeight: 1.5 }}>
            ONE LETTER / FORTNIGHT. SHOOT PRE-RELEASES, UN-EDITED CONTACT SHEETS, OCCASIONAL PRINT RUN ANNOUNCEMENTS. NO ADS. UNSUB AT ANY TIME.
          </div>
        </div>

        <div style={{ gridColumn: '7 / 9' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>INDEX</div>
          {['Issues', 'Shoots', 'Archive', 'Journal', 'Shop 001', 'Submissions'].map((x) => (
            <div key={x} className="t-sans-cond" style={{ fontSize: 17, marginBottom: 8 }}>
              <a href="#" data-cursor="open">{x} →</a>
            </div>
          ))}
        </div>
        <div style={{ gridColumn: '9 / 11' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>EDITORIAL BOARD</div>
          {['Léa Aronson', 'Sadie Ouko', 'Dmitri Halász', 'Marta Pruss', 'Kobe Adeyemi', 'Ivo Kestel'].map((x) => (
            <div key={x} className="t-sans-cond" style={{ fontSize: 13, marginBottom: 6, opacity: 0.85 }}>{x}</div>
          ))}
        </div>
        <div style={{ gridColumn: '11 / 13' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>CONTACT</div>
          <div className="t-sans-cond" style={{ fontSize: 13, lineHeight: 1.6 }}>
            STUDIO.CANAL 47<br />
            22 GREENE, FL 4<br />
            NY NY 10013<br /><br />
            +1 (212) 555 · 0102<br />
            hello@routure.press
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '40px 0 0', overflow: 'hidden' }}>
        <div
          className="t-disp"
          style={{
            fontSize: 'clamp(180px, 27vw, 420px)',
            lineHeight: 0.78,
            letterSpacing: '-0.06em',
            padding: '0 14px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 200',
          }}
        >
          ROUTU
          <span style={{ fontStyle: 'italic', color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800' }}>R</span>
          E
        </div>

        <div
          className="t-mono"
          style={{
            position: 'absolute',
            bottom: '28%',
            left: 0,
            right: 0,
            textAlign: 'center',
            mixBlendMode: 'difference',
            color: 'var(--paper)',
          }}
        >
          TYPE-AS-IMAGE · SET IN FRAUNCES VARIABLE
        </div>
      </div>

      <div
        className="t-mono"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 18,
          padding: '14px 28px 22px',
          borderTop: '1px solid rgba(236,231,222,0.2)',
        }}
      >
        <span style={{ gridColumn: '1 / 4' }}>© ROUTURE PRESS 2025–2026</span>
        <span style={{ gridColumn: '4 / 7', opacity: 0.6 }}>SET IN FRAUNCES · ARCHIVO · ANTON · JBM</span>
        <span style={{ gridColumn: '7 / 10', opacity: 0.6 }}>BUILT WITH NEXT.JS 16 · REACT 19 · MOTION</span>
        <span style={{ gridColumn: '10 / 13', textAlign: 'right' }}>NO ADS — NO DATA — NO TRACKERS. /MANIFESTO →</span>
      </div>
    </footer>
  );
}
