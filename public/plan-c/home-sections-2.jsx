// home-sections-2.jsx — Editorial band, Categories, Letter, Footer

const { useState: uS2, useRef: uR2, useEffect: uE2 } = React;

/* ============ 4. EDITORIAL PULLQUOTE BAND ============ */
function PullquoteBand() {
  const sectionRef = uR2(null);
  const p = useViewportProgress(sectionRef);
  // parallax: type scrolls slower than page (shifts upward less) so it feels pinned
  const typeShift = (p - 0.5) * -220;
  const bgShift = (p - 0.5) * 120;

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      height: '80vh',
      borderBottom: '1px solid var(--ink)',
      background: 'var(--ink)',
      color: 'var(--paper)',
      overflow: 'hidden'
    }}>
      {/* decorative background image strip, slow parallax */}
      <div style={{
        position: 'absolute',
        top: '-10%', left: 0, right: 0, height: '120%',
        transform: `translateY(${bgShift}px)`,
        opacity: 0.35,
      }}>
        <Placeholder palette="p-plum" style={{ width: '100%', height: '100%' }} label="EDITORIAL TEXTURE / DARK MATTER OUTTAKE" corner="tr" />
      </div>

      {/* top meta row */}
      <div style={{
        position: 'absolute', top: 22, left: 28, right: 28,
        display: 'flex', justifyContent: 'space-between',
        zIndex: 3
      }} className="t-mono">
        <span>§ 02 — EDITORIAL · PULLQUOTE</span>
        <span>FROM: "ON WEARING A PLANET" / LÉA ARONSON · 04.23</span>
      </div>

      {/* the quote */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        transform: `translate3d(0, ${typeShift}px, 0)`,
        zIndex: 2,
        padding: '0 24px'
      }}>
        <blockquote className="t-disp" style={{
          fontSize: 'clamp(48px, 6.6vw, 104px)',
          fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 300',
          lineHeight: 0.96,
          maxWidth: '1200px',
          letterSpacing: '-0.02em',
          textWrap: 'balance'
        }}>
          <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800', fontStyle: 'italic', marginRight: 8 }}>"</span>
          Clothes were never ornament.<br/>
          They are the last evidence<br/>
          that the body <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>refused</span><br/>
          to be only <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 700', fontStyle: 'italic' }}>weather</span>.
          <span style={{ color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800', fontStyle: 'italic', marginLeft: 8 }}>"</span>
        </blockquote>
      </div>

      {/* byline */}
      <div style={{
        position: 'absolute', bottom: 22, left: 28, right: 28,
        display: 'flex', justifyContent: 'space-between', zIndex: 3
      }} className="t-mono">
        <span>— LÉA ARONSON, CONTRIBUTING EDITOR</span>
        <a href="#article" data-cursor="read" style={{ borderBottom: '1px solid var(--paper)', paddingBottom: 2 }}>READ THE FULL ESSAY →</a>
      </div>

      <Anno x="4%" y="44%">Parallax band: type scrolls ~0.6× page speed; background shifts inverse. Quote is the "stop moment" on this viewport.</Anno>
    </section>
  );
}

/* ============ 5. CATEGORY ARCHIVE (horizontal scroll) ============ */
function CategoryArchive() {
  const cats = window.ROUTURE_DATA.categories;
  const palettes = ['p-ember', 'p-moss', 'p-pool', 'p-clay', 'p-bone', 'p-plum', 'p-ash', 'p-night', 'p-acid'];
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
        <div style={{ gridColumn: '9 / 13', alignSelf: 'end', textAlign: 'right' }} className="t-mono">
          DRAG → OR USE ⟵ / ⟶ · TOTAL 57 PIECES
        </div>
      </div>

      {cats.map((c, ci) => (
        <div key={c.name} style={{ borderTop: '1px solid var(--rule)', padding: '18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '0 28px 14px' }}>
            <div className="t-disp" style={{ fontSize: 'clamp(40px, 4.8vw, 80px)', fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400', flexShrink: 0 }}>
              <span style={{ opacity: 0.35, fontSize: '0.5em', marginRight: 14, verticalAlign: 'middle' }}>№{String(ci+1).padStart(2,'0')}</span>
              {c.name}<span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>.</span>
            </div>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--rule)', marginTop: 14 }} />
            <div className="t-mono" style={{ opacity: 0.7 }}>{String(c.count).padStart(2,'0')} ENTRIES</div>
            <a href="#" data-cursor="enter" className="t-mono" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '6px 10px' }}>OPEN →</a>
          </div>
          <div style={{ overflowX: 'auto', padding: '0 28px 6px' }}>
            <div style={{ display: 'flex', gap: 14, width: 'max-content' }}>
              {Array.from({ length: 9 }).map((_, i) => {
                const tall = (ci + i) % 3 === 0;
                const wide = (ci + i) % 4 === 1;
                const w = wide ? 280 : 190;
                const h = tall ? 280 : 220;
                const pal = palettes[(ci*3 + i) % palettes.length];
                return (
                  <div key={i} data-cursor="preview" style={{ flexShrink: 0, width: w, height: h, position: 'relative' }}>
                    <Placeholder palette={pal} style={{ width: '100%', height: '100%' }} label={`${c.name.slice(0,4).toUpperCase()}-${String(i+1).padStart(2,'0')}`} corner="tr" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <Anno x="4%" y="180px">Categories shown as a scrolling horizontal archive — per the brief, NOT pill navigation. Each row drag-scrolls independently.</Anno>
    </section>
  );
}

/* ============ 6. LETTER FROM THE BOARD ============ */
function LetterFromBoard() {
  const letter = window.ROUTURE_DATA.articles.find(a => a.slug === 'letter');
  return (
    <section id="letter" style={{ borderBottom: '1px solid var(--ink)', padding: '80px 0', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px' }}>
        <div style={{ gridColumn: '1 / 4' }}>
          <div className="t-mono" style={{ marginBottom: 12 }}>§ 04</div>
          <div className="t-disp" style={{ fontSize: 'clamp(40px, 4.4vw, 72px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.92 }}>
            Letter
            <br/>
            <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>from the</span>
            <br/>
            Editorial
            <br/>
            Board.
          </div>
          <div className="t-mono" style={{ marginTop: 30, opacity: 0.6 }}>
            ISSUE 02 · COSMIC<br/>
            FILED 19.04.2026<br/>
            SET IN FRAUNCES (CL)<br/>
            & JETBRAINS MONO
          </div>
        </div>

        {/* narrow single column */}
        <div style={{ gridColumn: '5 / 9', fontSize: 15, lineHeight: 1.65, fontFamily: 'var(--f-sans)' }}>
          {letter.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: 16, textWrap: 'pretty' }}>
              {i === 0 && <span className="t-disp" style={{ fontSize: 62, float: 'left', lineHeight: 0.82, marginRight: 10, marginTop: 6, fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500' }}>{p[0]}</span>}
              {i === 0 ? p.slice(1) : p}
              {i === 0 && <sup style={{ color: 'var(--acid-deep)' }}> 1</sup>}
              {i === 1 && <sup style={{ color: 'var(--acid-deep)' }}> 2</sup>}
              {i === 2 && <sup style={{ color: 'var(--acid-deep)' }}> 3</sup>}
            </p>
          ))}
          <div className="t-disp-ital" style={{ fontSize: 24, marginTop: 24 }}>— The Board.</div>
        </div>

        {/* margin footnotes */}
        <aside style={{ gridColumn: '9 / 12', paddingLeft: 18, borderLeft: '1px solid var(--rule)' }}>
          <div className="t-mono" style={{ marginBottom: 14, opacity: 0.7 }}>MARGINALIA</div>
          {letter.footnotes.map((f, i) => (
            <p key={i} className="t-mono-lg" style={{ marginBottom: 14, lineHeight: 1.5, letterSpacing: '0.02em', fontSize: 11 }}>
              {f}
            </p>
          ))}
        </aside>
      </div>

      <Anno x="58%" y="120px" side="right">Single narrow column, serif body, footnote callouts in the margin — not overlay, actual grid column. The only "calm" surface on the page.</Anno>
    </section>
  );
}

/* ============ 7. MASSIVE FOOTER ============ */
function MegaFooter() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '60px 28px 30px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, borderBottom: '1px solid rgba(236,231,222,0.2)' }}>
        {/* newsletter */}
        <div style={{ gridColumn: '1 / 6' }}>
          <div className="t-mono" style={{ marginBottom: 14, opacity: 0.6 }}>§ 05 — SUBSCRIBE / PAPER QUARTERLY + WEB</div>
          <div className="t-disp" style={{ fontSize: 64, fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.92 }}>
            Be <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600', color: 'var(--acid)' }}>first</span> in<br/>the orbit.
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ marginTop: 28, display: 'flex', borderBottom: '1px solid var(--paper)' }}>
            <input placeholder="YOUR.EMAIL@DOMAIN" style={{
              flex: 1, background: 'transparent', border: 'none', color: 'var(--paper)',
              fontFamily: 'var(--f-mono)', fontSize: 14, padding: '14px 0', outline: 'none',
              letterSpacing: '0.04em'
            }} />
            <button data-cursor="subscribe" type="submit" style={{
              background: 'var(--acid)', color: 'var(--ink)', border: 'none',
              fontFamily: 'var(--f-mono)', fontSize: 11, padding: '0 18px',
              letterSpacing: '0.1em', cursor: 'pointer'
            }}>
              SIGN UP →
            </button>
          </form>
          <div className="t-mono" style={{ marginTop: 14, opacity: 0.5, maxWidth: 380, lineHeight: 1.5 }}>
            ONE LETTER / FORTNIGHT. SHOOT PRE-RELEASES, UN-EDITED CONTACT SHEETS, OCCASIONAL PRINT RUN ANNOUNCEMENTS. NO ADS. UNSUB AT ANY TIME.
          </div>
        </div>

        {/* sitemap columns */}
        <div style={{ gridColumn: '7 / 9' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>INDEX</div>
          {['Issues', 'Shoots', 'Archive', 'Journal', 'Shop 001', 'Submissions'].map(x => (
            <div key={x} className="t-sans-cond" style={{ fontSize: 17, marginBottom: 8 }}><a href="#" data-cursor="open">{x} →</a></div>
          ))}
        </div>
        <div style={{ gridColumn: '9 / 11' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>EDITORIAL BOARD</div>
          {['Léa Aronson', 'Sadie Ouko', 'Dmitri Halász', 'Marta Pruss', 'Kobe Adeyemi', 'Ivo Kestel'].map(x => (
            <div key={x} className="t-sans-cond" style={{ fontSize: 13, marginBottom: 6, opacity: 0.85 }}>{x}</div>
          ))}
        </div>
        <div style={{ gridColumn: '11 / 13' }}>
          <div className="t-mono" style={{ opacity: 0.5, marginBottom: 14 }}>CONTACT</div>
          <div className="t-sans-cond" style={{ fontSize: 13, lineHeight: 1.6 }}>
            STUDIO.CANAL 47<br/>
            22 GREENE, FL 4<br/>
            NY NY 10013<br/><br/>
            +1 (212) 555 · 0102<br/>
            hello@routure.press
          </div>
        </div>
      </div>

      {/* MASSIVE WORDMARK */}
      <div style={{ position: 'relative', padding: '40px 0 0', overflow: 'hidden' }}>
        <div className="t-disp" style={{
          fontSize: 'clamp(180px, 27vw, 420px)',
          lineHeight: 0.78,
          letterSpacing: '-0.06em',
          padding: '0 14px',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 200'
        }}>
          ROUTU<span style={{ fontStyle: 'italic', color: 'var(--acid)', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800' }}>R</span>E
        </div>

        {/* negative space inner sub-line */}
        <div style={{
          position: 'absolute',
          bottom: '28%', left: 0, right: 0,
          textAlign: 'center',
          mixBlendMode: 'difference',
          color: 'var(--paper)'
        }} className="t-mono">
          TYPE-AS-IMAGE · SET IN FRAUNCES VARIABLE
        </div>
      </div>

      {/* colophon bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '14px 28px 22px', borderTop: '1px solid rgba(236,231,222,0.2)' }} className="t-mono">
        <span style={{ gridColumn: '1 / 4' }}>© ROUTURE PRESS 2025–2026</span>
        <span style={{ gridColumn: '4 / 7', opacity: 0.6 }}>SET IN FRAUNCES · ARCHIVO · ANTON · JBM</span>
        <span style={{ gridColumn: '7 / 10', opacity: 0.6 }}>BUILT WITH NEXT.JS 16 · REACT 19 · MOTION</span>
        <span style={{ gridColumn: '10 / 13', textAlign: 'right' }}>NO ADS — NO DATA — NO TRACKERS. /MANIFESTO →</span>
      </div>

      <Anno x="28%" y="240px">Footer wordmark scales with viewport width so it always crops to fit. Acid R breathes on hover.</Anno>
    </footer>
  );
}

Object.assign(window, { PullquoteBand, CategoryArchive, LetterFromBoard, MegaFooter });
