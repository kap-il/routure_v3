/* global React */
// ROUTURE — Act IV: Living Archive (horizontal scroll) + Gestural UI + Shoot page

// ————————————————————————————————————————————————————————————————
// V12 — Archive: vertical → horizontal flip moment
function V12_ArchiveFlip() {
  return (
    <div className="rv rv--dark" style={{ padding: 0 }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5' }}>Act IV · Living Archive</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Viewport 12 · direction flip</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>Vertical scroll maps to horizontal · custom axis lock</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>10 / 22</div>

      {/* HUGE display with rotation to signal flip */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div className="r-display" style={{
            position: 'absolute', left: 40, top: 120, color: '#F2EEE5', fontSize: 300, fontStyle: 'italic', lineHeight: 0.85
          }}>
            the <br/>archive <br/>runs <span style={{ color: '#FF3D1F' }}>sideways</span>.
          </div>

          {/* 90° turned instruction */}
          <div style={{
            position: 'absolute', right: 80, top: 0, bottom: 0, width: 40,
            display: 'grid', placeItems: 'center'
          }}>
            <div className="r-mono" style={{
              color: '#FF3D1F',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '0.24em'
            }}>
              ← scroll · axis has turned · drag to drift
            </div>
          </div>
        </div>
      </div>

      {/* bottom: direction indicator */}
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 64, display: 'flex', alignItems: 'center', gap: 22, color: '#F2EEE5' }}>
        <div className="r-mono">scroll ↓</div>
        <div style={{ flex: 1, position: 'relative', height: 1, background: 'rgba(242,238,229,0.3)' }}>
          <div style={{ position: 'absolute', top: -8, left: '42%', color: '#FF3D1F', fontSize: 20 }}>↘</div>
        </div>
        <div className="r-mono" style={{ color: '#FF3D1F' }}>→ reads as →</div>
      </div>

      <div className="anno anno--bl">
        At archive entry, wheel/trackpad Y binds to X. An onboarding overlay shows once per session.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V13 — Archive: poster tiles horizontally, one hovered
function V13_ArchivePosters() {
  return (
    <div className="rv" style={{ background: '#F2EEE5', padding: 0 }}>
      <div className="folio" style={{ top: 24, left: 40 }}>Living archive · 12 issues</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Viewport 13 · horizontal tiles</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Hover reveals shoot list in stacked column</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>11 / 22</div>

      {/* scroll indicator */}
      <div style={{ position: 'absolute', top: 70, left: 40, right: 40, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div className="r-mono" style={{ color: '#FF3D1F' }}>← 01/12 — now viewing 02–05 — 12/12 →</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(10,10,10,0.25)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '14%', width: '32%', height: 3, top: -1, background: '#0A0A0A' }}/>
        </div>
        <div className="r-mono">drag to drift</div>
      </div>

      {/* Row of posters */}
      <div style={{ position: 'absolute', top: 120, bottom: 80, left: -40, right: -40, display: 'flex', gap: 22, paddingLeft: 40, paddingRight: 40 }}>
        {[
          { no: '05', name: 'Subsoil', year: '25', color: '#0A0A0A', accent: '#FF3D1F' },
          { no: '04', name: 'Motherboard', year: '25', color: '#3a2a12', accent: '#F2EEE5' },
          { no: '03', name: 'Vespertine', year: '24', color: '#1a2a3a', accent: '#FF3D1F' },
          { no: '02', name: 'Cosmic', year: '26', color: '#FF3D1F', accent: '#0A0A0A', active: true },
          { no: '01', name: 'Index', year: '24', color: '#8a8474', accent: '#0A0A0A' },
        ].map((p, i) => (
          <div key={i} style={{
            width: 360, minWidth: 360, background: p.color, color: p.accent, position: 'relative',
            padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: p.active ? '2px solid #0A0A0A' : '1px solid rgba(10,10,10,0.2)',
            transform: p.active ? 'translateY(-10px)' : 'none',
          }}>
            <div className="flex between" style={{ alignItems: 'flex-start' }}>
              <div className="r-mono" style={{ color: p.accent }}>No. {p.no} / 20{p.year}</div>
              {p.active && <div className="r-mono" style={{ color: '#0A0A0A', background: '#F2EEE5', padding: '3px 6px' }}>Current</div>}
            </div>
            <div>
              <div className="r-display" style={{ fontSize: 84, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
                {p.name}
              </div>
              <div className="r-mono" style={{ marginTop: 10, opacity: 0.85 }}>06 shoots · 02 essays · 01 call</div>
            </div>

            {/* Hover column — shown on second tile as "hovered" */}
            {i === 2 && (
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: -180,
                background: '#F2EEE5', color: '#0A0A0A',
                padding: 14, border: '1px solid #0A0A0A'
              }}>
                <div className="r-mono" style={{ color: '#FF3D1F' }}>Shoots in 03 · Vespertine</div>
                <ol className="r-mono" style={{ paddingLeft: 14, margin: '10px 0 0', lineHeight: 1.8 }}>
                  <li>Unbuilt, at Dusk — Ruiz/Park</li>
                  <li>The Long Return — Acheampong</li>
                  <li>Caravan Song — Moretti</li>
                  <li>Sermon for Lace — Feral</li>
                  <li>Closing Credits — Kowal</li>
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* cursor ring drifted */}
      <div className="cursor-ring" style={{ left: 820, top: 440 }}>open</div>

      <div className="anno anno--tr">
        Hover a tile and its shoot list drops from below. Click opens that issue inline as a new vertical sub-scroll.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V14 — Gestural nav overlay: masthead revealed + search overlay
function V14_GestureOverlay() {
  return (
    <div className="rv rv--dark">
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>Overlay · Gestural nav + Search</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#F2EEE5' }}>Viewport 14 — depicted over Act II</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>No nav bar · lives behind cursor gestures</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>12 / 22</div>

      {/* Background image as context */}
      <div className="ph ph--dark abs-fill" style={{ opacity: 0.45 }}>
        <div className="label" style={{ color: '#F2EEE5', borderColor: '#F2EEE5' }}>Act II in background (dimmed 55%)</div>
      </div>

      {/* Masthead pulldown — drops when cursor reaches top 80px */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0,
        background: '#0A0A0A',
        padding: '22px 40px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottom: '1px solid #FF3D1F',
        color: '#F2EEE5',
      }}>
        <div className="r-display" style={{ fontSize: 28, fontStyle: 'italic', letterSpacing: '-0.02em' }}>Routure <span style={{ color: '#FF3D1F' }}>·</span> No. 02</div>
        <nav style={{ display: 'flex', gap: 32 }}>
          {['Issue 02','Archive','Casting','Merch','Letter','Subscribe'].map((n, i) => (
            <a key={i} className="r-cond" style={{ color: i === 0 ? '#FF3D1F' : '#F2EEE5', fontSize: 13, textDecoration: 'none' }}>{n}</a>
          ))}
        </nav>
        <div className="r-mono" style={{ color: '#F2EEE5' }}>
          read as text <span style={{ color: '#FF3D1F' }}>◯ off</span> &nbsp;·&nbsp; / search
        </div>
      </div>

      {/* Search overlay */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%', top: 160,
        background: 'rgba(10,10,10,0.94)',
        border: '1px solid #FF3D1F',
        padding: '28px 32px',
        color: '#F2EEE5',
      }}>
        <div className="flex between" style={{ alignItems: 'center' }}>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>/ search — shoots · articles · credits</div>
          <div className="r-mono" style={{ opacity: 0.6 }}>esc to close</div>
        </div>
        <div style={{ marginTop: 16, borderBottom: '1px solid #F2EEE5', paddingBottom: 10 }}>
          <span className="r-display" style={{ fontSize: 52, fontStyle: 'italic' }}>salt</span>
          <span className="r-display" style={{ fontSize: 52, fontStyle: 'italic', color: '#FF3D1F' }}>|</span>
        </div>

        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Shoots — 3</div>
            <ol className="r-mono" style={{ paddingLeft: 14, lineHeight: 1.8, marginTop: 8 }}>
              <li>Salt Cathedral · No. 02</li>
              <li>Salt Flats, Mexico · No. 04</li>
              <li>Salt Sermon · No. 03</li>
            </ol>
          </div>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Articles — 2</div>
            <ol className="r-mono" style={{ paddingLeft: 14, lineHeight: 1.8, marginTop: 8 }}>
              <li>The cathedral is a verb.</li>
              <li>A taxonomy of salt</li>
            </ol>
          </div>
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F' }}>Credits — 4</div>
            <ol className="r-mono" style={{ paddingLeft: 14, lineHeight: 1.8, marginTop: 8 }}>
              <li>Lila Acheampong (photo)</li>
              <li>Juno Weiss (styling)</li>
              <li>Maison Collateral (coat)</li>
              <li>Ourlen (boots)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* wayfinder visible in corner */}
      <div className="wayfind" style={{ color: '#F2EEE5' }}>
        <span className="dot"></span>
        <span>ACT II · SALT CATHEDRAL</span>
        <span className="bar"><i style={{ width: 38, position: 'absolute', left: 0, top: -1, height: 3, background: '#FF3D1F' }}/></span>
        <span style={{ opacity: 0.6 }}>23%</span>
      </div>

      <div className="anno anno--bl">
        / opens search. Cursor-to-top reveals masthead. Read-as-text toggle flattens the whole document.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V15 — Read-as-text mode (accessibility + power users)
function V15_ReadAsText() {
  return (
    <div className="rv" style={{ background: '#F2EEE5' }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>Read as text · linear mode</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 15 · accessibility fallback</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Same DOM · CSS reset to single-column</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>13 / 22</div>

      {/* Minimal print-style masthead */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: '22px 80px 12px', borderBottom: '1px solid #0A0A0A', display: 'flex', justifyContent: 'space-between' }}>
        <div className="r-display" style={{ fontSize: 22, fontStyle: 'italic' }}>Routure — No. 02 Cosmic</div>
        <div className="r-mono">READ AS TEXT · <span style={{ color: '#FF3D1F' }}>◉ on</span></div>
      </div>

      <div style={{ position: 'absolute', left: 80, right: 80, top: 90, bottom: 80, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 56 }}>
        {/* TOC */}
        <aside>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>Contents</div>
          <ol style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.08em', lineHeight: 2, paddingLeft: 14, marginTop: 10 }}>
            <li>Editor's letter</li>
            <li>Salt Cathedral</li>
            <li>Mirage &amp; Commercialists</li>
            <li>Subsoil Weather</li>
            <li>Casting — Issue 03</li>
            <li>Band's Letter</li>
            <li>Archive index</li>
          </ol>
        </aside>

        {/* Linear text body */}
        <article style={{ overflow: 'hidden' }}>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>§ 01 Editor's letter</div>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 64, fontStyle: 'italic', margin: '8px 0 18px', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
            We are not a magazine.
          </h1>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.65, textAlign: 'justify', margin: '0 0 14px' }}>
            The website you are reading is the issue. There is no homepage, no archive to click through, no
            categories in a sidebar. Issue No. 02 unfolds beneath your cursor — and when it ends, the archive
            runs sideways into the past. Scroll is the turning of a page that never quite finishes.
          </p>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.65, textAlign: 'justify', margin: '0 0 14px' }}>
            This issue — COSMIC — is not about space. It is about the gravitational pull of surfaces.
          </p>

          <div className="r-mono" style={{ color: '#FF3D1F', marginTop: 26 }}>§ 02 Salt Cathedral — photographed by Lila Acheampong</div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 42, fontStyle: 'italic', margin: '8px 0 14px' }}>
            The cathedral is a verb.
          </h2>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.65, textAlign: 'justify', margin: '0 0 10px' }}>
            For seven days in February we lived two hundred metres below the snowline of Wieliczka, in a salt
            chamber the mining guild still calls the cathedral. The walls bore fifteenth-century initials. The
            floor had the dull gleam of a sea that had forgotten it was one.
          </p>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.65, textAlign: 'justify', margin: '0 0 10px', color: 'rgba(10,10,10,0.55)' }}>
            [FIG. 01 — Adaeze in Maison Collateral coat. Image not rendered in text mode.]
          </p>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.65, textAlign: 'justify', margin: 0 }}>
            Juno Weiss brought thirty looks and left with twenty-four. The others refused the chamber; the
            humidity warped the sequins, and one coat — a Collateral archival piece — grew a pelt of crystals
            overnight. We photographed it anyway.
          </p>
        </article>
      </div>

      <div className="anno anno--br">
        Same DOM, different stylesheet. Images become [FIG.] placeholders with alt text inline. Works with JS off.
      </div>
    </div>
  );
}

window.V12_ArchiveFlip = V12_ArchiveFlip;
window.V13_ArchivePosters = V13_ArchivePosters;
window.V14_GestureOverlay = V14_GestureOverlay;
window.V15_ReadAsText = V15_ReadAsText;
