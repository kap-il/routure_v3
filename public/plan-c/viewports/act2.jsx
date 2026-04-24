/* global React */
// ROUTURE — Act II: The Issue (shoot intros, full-bleeds, article interleave, transitions)

// ————————————————————————————————————————————————————————————————
// V03 — Shoot intro: huge type assembling
function V03_ShootIntro() {
  return (
    <div className="rv" style={{ background: '#F2EEE5' }}>
      <div className="folio" style={{ top: 24, left: 40 }}>No. 02 — Cosmic</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Act II · Shoot 01 / 06</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Viewport 03 — shoot title assembly</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>Architecture</div>

      {/* layered display type */}
      <div style={{ position: 'absolute', left: 40, right: 40, top: 80, bottom: 80 }}>
        <div className="r-mono" style={{ color: '#FF3D1F' }}>Shoot 01 · Architecture · Cover</div>
        <div className="r-display" style={{ fontSize: 300, lineHeight: 0.82, letterSpacing: '-0.04em', marginTop: 18 }}>
          Salt&nbsp;<span style={{ fontStyle: 'italic' }}>Cathe-</span><br/>
          <span style={{ fontStyle: 'italic' }}>dral,</span>&nbsp;<span style={{ color: '#FF3D1F' }}>04:41</span>
        </div>
        <div className="flex between" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'flex-end' }}>
          <div style={{ maxWidth: 440 }} className="r-mono">
            Photography — Lila Acheampong / Styling — Juno Weiss / Set — Office for Slow Weather /
            Models — Adaeze, Pilar, Momo, Vega
          </div>
          <div className="r-display" style={{ fontSize: 42, fontStyle: 'italic' }}>№&nbsp;01</div>
        </div>
      </div>

      {/* subtle guides */}
      <div style={{ position: 'absolute', left: 40, right: 40, top: 76, height: 1, background: 'rgba(10,10,10,0.2)' }} />
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 76, height: 1, background: 'rgba(10,10,10,0.2)' }} />

      <div className="anno anno--tr">
        Shoot title scrambles in from condensed → display over 800ms on enter. "04:41" is the time the shoot was taken.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V04 — Full-bleed image + margin credits
function V04_FullBleed() {
  return (
    <div className="rv rv--dark" style={{ padding: 0 }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5', zIndex: 2 }}>Salt Cathedral</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F', zIndex: 2 }}>Image 02 / 07</div>

      {/* Image fills near-full bleed */}
      <div className="ph ph--dark" style={{ position: 'absolute', left: 40, right: 320, top: 60, bottom: 60 }}>
        <div className="cornerL">Look 02 · coat, gown</div>
        <div className="cornerR">1.50 × 1 · film</div>
        <div className="label">editorial shot · Adaeze in Maison Collateral coat</div>
      </div>

      {/* Margin credits column */}
      <div style={{ position: 'absolute', right: 40, top: 60, bottom: 60, width: 240 }} className="col between">
        <div>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>Credits — Look 02</div>
          <div style={{ height: 1, background: 'rgba(242,238,229,0.3)', margin: '10px 0 16px' }}/>
          <dl className="r-mono" style={{ color: '#F2EEE5', lineHeight: 1.7, margin: 0 }}>
            <div className="flex between"><dt>Coat</dt><dd style={{ margin: 0 }}>Collateral FW26</dd></div>
            <div className="flex between"><dt>Gown</dt><dd style={{ margin: 0 }}>Private archive</dd></div>
            <div className="flex between"><dt>Jewels</dt><dd style={{ margin: 0 }}>Mikayla&nbsp;T.</dd></div>
            <div className="flex between"><dt>Boots</dt><dd style={{ margin: 0 }}>Ourlen</dd></div>
            <div className="flex between"><dt>Hair</dt><dd style={{ margin: 0 }}>Estelle Par</dd></div>
            <div className="flex between"><dt>Make-up</dt><dd style={{ margin: 0 }}>Inez V.</dd></div>
            <div className="flex between"><dt>Model</dt><dd style={{ margin: 0 }}>Adaeze N.</dd></div>
          </dl>
        </div>
        <div className="r-display" style={{ fontSize: 64, fontStyle: 'italic', color: '#F2EEE5' }}>
          "Cold <br/>& <span style={{ color: '#FF3D1F' }}>crystal</span>."
        </div>
        <div className="r-mono" style={{ color: 'rgba(242,238,229,0.6)' }}>
          credits appear on scroll pause — cursor magnifies image, darkens margin
        </div>
      </div>

      {/* Cursor with magnify label */}
      <div className="cursor-ring" style={{ left: 560, top: 470, color: '#F2EEE5' }}>zoom</div>

      <div className="anno anno--bl">
        Full-bleed images sit in black band. On pause, credits fade in at right margin. Cursor magnifies the plate.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V05 — Article interleave: scroll-driven prose + pullquote
function V05_ArticleInterleave() {
  return (
    <div className="rv">
      <div className="folio" style={{ top: 24, left: 40 }}>Salt Cathedral · article</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Viewport 05 · prose break</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>§ running text interleaves between plates</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>03 / 22</div>

      <div style={{ position: 'absolute', left: 40, right: 40, top: 70, bottom: 70, display: 'grid', gridTemplateColumns: '360px 1fr 360px', gap: 48 }}>
        {/* Left: annotation column */}
        <div className="col" style={{ gap: 28 }}>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>Essay · Aïda Feral · 08 min</div>
          <div className="r-display" style={{ fontSize: 82, fontStyle: 'italic', lineHeight: 0.9 }}>
            The <br/>cathedral <br/>is a <br/>verb.
          </div>
          <div className="r-mono" style={{ opacity: 0.55, marginTop: 'auto' }}>
            ¹ see Wigley, "architecture of deconstruction", 1993.<br/>
            ² the salt mine shaft was decommissioned in 2011.
          </div>
        </div>

        {/* Center: running prose, two columns of serif */}
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 17, lineHeight: 1.55, columns: 2, columnGap: 36, textAlign: 'justify', hyphens: 'auto' }}>
          <p style={{ marginTop: 0, textIndent: 0 }}>
            <span className="r-smallcaps" style={{ fontSize: 13, letterSpacing: '0.18em' }}>for seven days in february</span> we lived two hundred metres below the snowline of Wieliczka,
            in a salt chamber the mining guild still calls the cathedral. The walls bore fifteenth-century initials.
            The floor had the dull gleam of a sea that had forgotten it was one.
          </p>
          <p>
            Juno Weiss brought thirty looks and left with twenty-four. The others refused the chamber; the humidity
            warped the sequins, and one coat — a Collateral archival piece — grew a pelt of crystals overnight.¹
            We photographed it anyway.
          </p>
          <p>
            The shoot is an argument that couture and geology share a tense. Both accrete. Both ask to be read
            slowly, with a flashlight and a patience for salt. Adaeze stood in the cathedral for six hours without
            speaking. When she did speak, the syllables doubled in the chamber's peculiar acoustic²—
          </p>
          <p style={{ color: '#FF3D1F', fontStyle: 'italic' }}>
            — "it is cold, and crystal, and the coat is alive."
          </p>
          <p>
            This issue takes that sentence as its premise. Each shoot proceeds from the same question: can a
            garment hold its own weather?
          </p>
        </div>

        {/* Right: small inset image + caption */}
        <div className="col" style={{ gap: 16 }}>
          <div className="ph" style={{ width: '100%', aspectRatio: '0.78' }}>
            <div className="cornerL">inset · B-roll</div>
            <div className="label">behind · salt shaft 2</div>
          </div>
          <div className="r-mono" style={{ opacity: 0.7, lineHeight: 1.5 }}>
            FIG. 03 — Juno Weiss pins a Collateral coat against the east wall of the chamber. The salt crystals
            on the garment were not dressed; they grew overnight.
          </div>
          <div style={{ borderTop: '1px solid rgba(10,10,10,0.2)', paddingTop: 12, marginTop: 'auto' }} className="r-mono">
            pullquote on next viewport → breaks full-bleed
          </div>
        </div>
      </div>

      <div className="anno anno--br">
        Prose is scroll-driven — lines fade up as they enter. Footnotes expand on hover in the left margin.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V06 — Transition: color wipe / type morph between shoots
function V06_Transition() {
  return (
    <div className="rv rv--hot">
      <div className="folio" style={{ top: 24, left: 40 }}>Transition · Shoot 01 → Shoot 02</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 06 — color wipe</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Motion: 1100ms · ease [0.22, 1, 0.36, 1]</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>§ 01 → § 02</div>

      {/* morphing huge word */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div className="r-display" style={{ fontSize: 360, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.85 }}>
          <div style={{ textDecoration: 'line-through', textDecorationThickness: 8, opacity: 0.55 }}>Cathedral</div>
          <div style={{ textAlign: 'right' }}>Mirage.</div>
        </div>
      </div>

      {/* arrow run */}
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 80, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div className="r-mono">shoot 01 — Salt Cathedral</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(10,10,10,0.35)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: '62%', background: '#0A0A0A' }}/>
        </div>
        <div className="r-mono">shoot 02 — Mirage for the Commercialists</div>
      </div>

      <div className="anno anno--tl" style={{ background: '#0A0A0A' }}>
        Color wipes from paper → signature hue → next shoot's palette. Old title strikes through; next title drops in.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V07 — Second shoot full-bleed: paired grid, diff choreography
function V07_ShootTwoGrid() {
  return (
    <div className="rv">
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>Shoot 02 · Commercialism · Mirage</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 07 · paired grid</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Parallax: plates scroll 0.85×, captions 1.15×</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>04 / 22</div>

      {/* Title strip */}
      <div style={{ position: 'absolute', left: 40, right: 40, top: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="r-display" style={{ fontSize: 140, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 0.85 }}>
          Mirage <span style={{ color: '#FF3D1F' }}>&</span><br/>the Commercialists
        </div>
        <div className="r-mono" style={{ textAlign: 'right', lineHeight: 1.6 }}>
          photo · Rui Moretti<br/>styling · Juno Weiss<br/>cast · Pilar, Vega<br/>location · Rotterdam, Zeche 3
        </div>
      </div>

      {/* Paired grid */}
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 70, top: 360, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr', gap: 16 }}>
        <div className="ph" style={{ gridColumn: 'span 2' }}>
          <div className="cornerL">Plate A · look 04</div>
          <div className="label">Pilar in Ourlen vinyl · mid-shot</div>
        </div>
        <div className="ph">
          <div className="cornerL">Plate B</div>
          <div className="label">detail · vinyl seam</div>
        </div>
        <div className="ph">
          <div className="cornerL">Plate C · look 05</div>
          <div className="label">Vega · triple-layer suit</div>
        </div>
      </div>

      {/* cursor reveal label */}
      <div className="cursor-ring" style={{ left: 980, top: 620 }}>credits</div>

      <div className="anno anno--br">
        Hover a plate and the cursor reveals its credits as a ring-tooltip. Plate A parallaxes slower than captions.
      </div>
    </div>
  );
}

window.V03_ShootIntro = V03_ShootIntro;
window.V04_FullBleed = V04_FullBleed;
window.V05_ArticleInterleave = V05_ArticleInterleave;
window.V06_Transition = V06_Transition;
window.V07_ShootTwoGrid = V07_ShootTwoGrid;
