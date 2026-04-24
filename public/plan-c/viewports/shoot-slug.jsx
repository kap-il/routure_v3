/* global React */
// ROUTURE — Shoot slug page (SEO) + closing

// ————————————————————————————————————————————————————————————————
// V16 — /shoot/[slug] standalone page: quieter, editorial
function V16_ShootSlug() {
  return (
    <div className="rv" style={{ background: '#F2EEE5' }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>/shoot/salt-cathedral</div>
      <div className="folio" style={{ top: 24, right: 40 }}>SEO page · crawlable · self-contained</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Hero · gallery · article · credits</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>standalone · 01 / 01</div>

      {/* Quiet masthead */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0,
        padding: '20px 48px 14px',
        borderBottom: '1px solid #0A0A0A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div className="r-display" style={{ fontSize: 22, fontStyle: 'italic' }}>Routure</div>
        <div className="r-mono" style={{ display: 'flex', gap: 22 }}>
          <span>No. 02 — Cosmic</span>
          <span style={{ color: '#FF3D1F' }}>← back to issue</span>
          <span>share</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'absolute', left: 48, right: 48, top: 80, height: 340, display: 'grid', gridTemplateColumns: '1fr 460px', gap: 28 }}>
        <div className="ph" style={{ height: '100%' }}>
          <div className="cornerL">hero · plate 01</div>
          <div className="label">Salt Cathedral · cover image</div>
        </div>
        <div className="col between" style={{ paddingTop: 6 }}>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Architecture · shoot · 7 plates · 08 min read</div>
            <div className="r-display" style={{ fontSize: 90, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 0.88, marginTop: 10 }}>
              Salt Cathedral
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.5, margin: 0 }}>
              For seven days in February we lived two hundred metres below the snowline of Wieliczka. The coat
              grew a pelt of crystals overnight. We photographed it anyway.
            </p>
            <div className="r-mono" style={{ marginTop: 14, opacity: 0.7 }}>
              photography · Lila Acheampong &nbsp;/&nbsp; styling · Juno Weiss &nbsp;/&nbsp; model · Adaeze N.
            </div>
          </div>
        </div>
      </div>

      {/* Gallery thumbstrip */}
      <div style={{ position: 'absolute', left: 48, right: 48, top: 448, height: 130, display: 'flex', gap: 10 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="ph" style={{ flex: i === 0 ? 1.5 : 1, border: i === 0 ? '2px solid #FF3D1F' : 'none' }}>
            <div className="label" style={{ fontSize: 9 }}>plate {String(i + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Article excerpt + credits */}
      <div style={{ position: 'absolute', left: 48, right: 48, top: 600, bottom: 70, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>
        <article style={{ columns: 2, columnGap: 32, fontFamily: 'var(--f-display)', fontSize: 15.5, lineHeight: 1.6, textAlign: 'justify' }}>
          <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontStyle: 'italic', margin: '0 0 10px', columnSpan: 'all' }}>
            The cathedral is a verb.
          </h3>
          <p style={{ margin: '0 0 10px' }}>
            The shoot is an argument that couture and geology share a tense. Both accrete. Both ask to be read
            slowly, with a flashlight and a patience for salt. Adaeze stood in the cathedral for six hours
            without speaking.
          </p>
          <p style={{ margin: '0 0 10px' }}>
            When she did speak, the syllables doubled in the chamber's peculiar acoustic — "it is cold, and
            crystal, and the coat is alive." This issue takes that sentence as its premise.
          </p>
          <p style={{ margin: 0 }}>
            Each shoot proceeds from the same question: can a garment hold its own weather? In Wieliczka the
            answer is already on the coat's shoulder, growing there. We simply waited for a light that could
            see it.
          </p>
        </article>
        <aside style={{ borderLeft: '1px solid rgba(10,10,10,0.25)', paddingLeft: 22 }}>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>Full credits</div>
          <dl className="r-mono" style={{ lineHeight: 1.8, marginTop: 10 }}>
            <div className="flex between"><dt>Photography</dt><dd style={{ margin: 0 }}>Lila Acheampong</dd></div>
            <div className="flex between"><dt>Styling</dt><dd style={{ margin: 0 }}>Juno Weiss</dd></div>
            <div className="flex between"><dt>Set design</dt><dd style={{ margin: 0 }}>Office / Slow Weather</dd></div>
            <div className="flex between"><dt>Hair</dt><dd style={{ margin: 0 }}>Estelle Par</dd></div>
            <div className="flex between"><dt>Make-up</dt><dd style={{ margin: 0 }}>Inez V.</dd></div>
            <div className="flex between"><dt>Models</dt><dd style={{ margin: 0 }}>Adaeze, Pilar, Momo</dd></div>
            <div className="flex between"><dt>Location</dt><dd style={{ margin: 0 }}>Wieliczka, PL</dd></div>
            <div className="flex between" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(10,10,10,0.2)' }}><dt>First published</dt><dd style={{ margin: 0 }}>18 Apr 2026</dd></div>
          </dl>
        </aside>
      </div>

      <div className="anno anno--br">
        /shoot/[slug] is the forward-safe mirror — single hero, 7 plates, one essay, full credits. No cursor gestures.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V17 — Colophon / closing: end of the issue
function V17_Colophon() {
  return (
    <div className="rv rv--dark">
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5' }}>Colophon · End of issue No. 02</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Viewport 17 · tail</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>Scroll past = subscribe + contact form</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>15 / 22</div>

      <div style={{ position: 'absolute', left: 40, right: 40, top: 70, bottom: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div className="col between">
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>End of issue · thank you for scrolling</div>
            <div className="r-display" style={{ fontSize: 140, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 0.9, marginTop: 20 }}>
              that's <br/>everything.
            </div>
          </div>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Subscribe — one dispatch per issue</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <input placeholder="you@domain" style={{
                flex: 1, padding: '14px 16px', background: 'transparent',
                border: '1px solid #F2EEE5', color: '#F2EEE5',
                fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}/>
              <button style={{
                padding: '14px 20px', background: '#FF3D1F', color: '#0A0A0A',
                border: '1px solid #FF3D1F', fontFamily: 'var(--f-mono)', fontSize: 13,
                letterSpacing: '0.14em', textTransform: 'uppercase'
              }}>Send ↵</button>
            </div>
          </div>
        </div>

        <div className="col between" style={{ borderLeft: '1px solid rgba(242,238,229,0.3)', paddingLeft: 56 }}>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Colophon</div>
            <dl className="r-mono" style={{ color: '#F2EEE5', lineHeight: 1.85, marginTop: 16 }}>
              <div className="flex between"><dt>Edited by</dt><dd style={{ margin: 0 }}>Rya Oduya, Mert Kowal</dd></div>
              <div className="flex between"><dt>Design</dt><dd style={{ margin: 0 }}>Atelier Cursor</dd></div>
              <div className="flex between"><dt>Type</dt><dd style={{ margin: 0 }}>ABC Diatype, Pangea</dd></div>
              <div className="flex between"><dt>Built with</dt><dd style={{ margin: 0 }}>Next.js · Motion · Lenis</dd></div>
              <div className="flex between"><dt>Hosted at</dt><dd style={{ margin: 0 }}>Vercel · Supabase</dd></div>
              <div className="flex between"><dt>Page views</dt><dd style={{ margin: 0 }}>48,112</dd></div>
            </dl>
          </div>
          <div>
            <div className="r-mono" style={{ color: '#F2EEE5', opacity: 0.6 }}>Next issue · 04 AUG 2026</div>
            <div className="r-display" style={{ fontSize: 96, fontStyle: 'italic', color: '#F2EEE5', letterSpacing: '-0.03em', marginTop: 6 }}>
              No. 03 <span style={{ color: '#FF3D1F' }}>↗</span>
            </div>
            <div className="r-mono" style={{ color: '#F2EEE5', opacity: 0.6, marginTop: 4 }}>working title — &nbsp;<span style={{ color: '#FF3D1F' }}>VESSELS</span></div>
          </div>
        </div>
      </div>

      <div className="anno anno--bl">
        The issue ends; the archive begins scrolling sideways underneath. Subscribe form inherits black/hue palette.
      </div>
    </div>
  );
}

window.V16_ShootSlug = V16_ShootSlug;
window.V17_Colophon = V17_Colophon;
