/* global React */
// ROUTURE — Act I: Entry viewports (1-2)

const { useState, useEffect } = React;

// ————————————————————————————————————————————————————————————————
// V01 — Black screen, wordmark assembling
function V01_Entry() {
  return (
    <div className="rv rv--dark">
      {/* corner folios */}
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5' }}>Routure — Digital Publication</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Live · 04.23.26</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>Viewport 01 / 22 · ENTRY</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>No. 02 — Cosmic</div>

      {/* Assembling wordmark — letters at different opacities/offsets */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', width: 1240, height: 260 }}>
          {/* ghost previous-frame letters */}
          <div className="r-display" aria-hidden style={{
            position: 'absolute', inset: 0, fontSize: 260, letterSpacing: '-0.04em',
            color: 'rgba(242,238,229,0.12)', fontStyle: 'italic',
            transform: 'translate(-14px, 6px)',
          }}>ROUTURE</div>

          <div className="r-display" style={{
            position: 'absolute', inset: 0, fontSize: 260, letterSpacing: '-0.04em',
            color: '#F2EEE5', display: 'flex', justifyContent: 'space-between',
            lineHeight: 1,
          }}>
            {['R','O','U','T','U','R','E'].map((ch, i) => (
              <span key={i} style={{
                display: 'inline-block',
                transform: i === 2 ? 'translateY(10px)' : i === 4 ? 'translateY(-6px)' : 'none',
                opacity: i < 5 ? 1 : 0.35,
                filter: i === 6 ? 'blur(2px)' : 'none',
              }}>{ch}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Issue marker */}
      <div style={{ position: 'absolute', left: 40, bottom: 110, color: '#F2EEE5' }}>
        <div className="r-mono" style={{ color: '#FF3D1F' }}>Issue No. 02 / Spring–Summer 26</div>
        <div className="r-display" style={{ fontSize: 82, fontStyle: 'italic', marginTop: 8 }}>Cosmic</div>
      </div>

      {/* Scroll cue — breathing text */}
      <div style={{ position: 'absolute', right: 40, bottom: 92, textAlign: 'right', color: '#F2EEE5' }}>
        <div className="r-mono" style={{ opacity: 0.5 }}>hold cursor · pull down</div>
        <div className="r-display" style={{ fontSize: 46, fontStyle: 'italic', marginTop: 6, letterSpacing: '-0.02em' }}>
          begin <span style={{ color: '#FF3D1F' }}>↓</span>
        </div>
      </div>

      {/* Cursor ring — top-left region */}
      <div className="cursor-ring" style={{ left: 720, top: 640, color: '#F2EEE5' }}>pull</div>

      <div className="anno anno--tl">
        Type assembles letter by letter. Ghost R echoes previous frame — pulls the eye forward.
      </div>
      <div className="anno anno--br">
        Scroll cue IS the nav — cursor "pulls" the issue into view instead of arrow-down.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V02 — Editorial letter setup
function V02_Premise() {
  return (
    <div className="rv rv--dark">
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5' }}>No. 02 — Cosmic</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Act I · Entry · 02 / 22</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>Editorial · letter · excerpt</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>Scroll to enter the issue</div>

      {/* Big italic display over grid */}
      <div style={{ position: 'absolute', left: 40, right: 40, top: 90, bottom: 130, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div className="col between">
          <div>
            <div className="r-mono" style={{ color: '#FF3D1F', marginBottom: 12 }}>A letter from the editors</div>
            <div className="r-display" style={{ fontSize: 116, fontStyle: 'italic', letterSpacing: '-0.03em' }}>
              We are<br/>not a<br/><span style={{ color: '#FF3D1F' }}>magazine.</span>
            </div>
          </div>
          <div className="r-mono" style={{ opacity: 0.55 }}>— Rya Oduya, Mert Kowal · editors-at-large</div>
        </div>
        <div className="col between" style={{ paddingTop: 14 }}>
          <p style={{ fontFamily: 'var(--f-display)', fontSize: 26, lineHeight: 1.35, fontStyle: 'italic', maxWidth: 520 }}>
            The website you are reading <em style={{ fontStyle: 'normal', textDecoration: 'underline', textDecorationStyle: 'wavy', textDecorationColor: '#FF3D1F' }}>is</em> the issue.
            There is no homepage, no archive to click through, no categories in a sidebar. Issue No. 02 unfolds
            beneath your cursor — and when it ends, the archive runs sideways into the past. Scroll is the
            turning of a page that never quite finishes.
          </p>
          <div className="flex between" style={{ alignItems: 'flex-end' }}>
            <div className="r-mono" style={{ opacity: 0.6, maxWidth: 260 }}>
              06 shoots · 01 casting call · 02 drops · 01 sermon · assembled 18 APR 2026
            </div>
            <div className="r-display" style={{ fontSize: 56, fontStyle: 'italic', color: '#FF3D1F' }}>§ 01</div>
          </div>
        </div>
      </div>

      {/* Wayfinding marker */}
      <div className="wayfind" style={{ color: '#F2EEE5' }}>
        <span className="dot"></span>
        <span>ACT I · ENTRY</span>
        <span className="bar"><i style={{ width: 28, position: 'absolute', left: 0, top: -1, height: 3, background: '#FF3D1F' }}/></span>
        <span style={{ opacity: 0.6 }}>09%</span>
      </div>

      <div className="anno anno--tr">
        Section wayfinder appears when cursor idles 2s — tracks scroll progress through the issue.
      </div>
    </div>
  );
}

window.V01_Entry = V01_Entry;
window.V02_Premise = V02_Premise;
