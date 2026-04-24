// shoot-page.jsx — ROUTURE inner shoot page

const { useState: uSS, useRef: uRS, useEffect: uES } = React;

function ShootMasthead({ shoot, issue }) {
  return (
    <header style={{ borderBottom: '1px solid var(--ink)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', padding: '14px 28px', alignItems: 'center', borderBottom: '1px solid var(--rule)' }}>
        <div className="t-mono">
          <a href="index.html" data-cursor="back">← ROUTURE / INDEX</a>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>/</span>
          <span>ISSUE NO. {issue.issue_number} — {issue.title}</span>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>/</span>
          <span>SHOOT №01 OF 08</span>
        </div>
        <div className="t-mono" style={{ textAlign: 'center' }}>
          <span className="t-sans-cond" style={{ fontSize: 15, letterSpacing: '0.2em' }}>ROUTURE</span>
        </div>
        <nav className="t-mono" style={{ textAlign: 'right', display: 'flex', gap: 20, justifyContent: 'flex-end' }}>
          <a href="#" data-cursor="prev">← PREV · SOFT GRAVITY</a>
          <a href="#" data-cursor="next">NEXT · APOGEE →</a>
        </nav>
      </div>

      {/* title block */}
      <div style={{ padding: '36px 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, alignItems: 'end' }}>
        <div style={{ gridColumn: '1 / 10' }}>
          <div className="t-mono" style={{ marginBottom: 14 }}>SHOOT · EDITORIAL · 14 IMAGES · 00:04:12 READ</div>
          <h1 className="t-disp" style={{
            fontSize: 'clamp(120px, 18vw, 280px)',
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 300',
            lineHeight: 0.86,
            letterSpacing: '-0.045em'
          }}>
            <AssemblyText text={shoot.title} />
          </h1>
        </div>
        <div style={{ gridColumn: '10 / 13', textAlign: 'right', paddingBottom: 12 }}>
          <div className="t-mono" style={{ opacity: 0.65, marginBottom: 6 }}>COORDINATES</div>
          <div className="t-mono-lg" style={{ fontSize: 13 }}>40.6782° N<br/>73.9442° W</div>
          <div className="t-mono" style={{ marginTop: 10, opacity: 0.65 }}>{shoot.credits.location.toUpperCase()}</div>
        </div>
      </div>

      <Anno x="3%" y="140px">Title assembles letter-by-letter as it scrolls into view — blur + y-offset + opacity. The "stop moment" of this page.</Anno>
    </header>
  );
}

function ShootHero({ shoot }) {
  const ref = uRS(null);
  const { x, y } = useMouseParallax(ref, 30);
  return (
    <section ref={ref} style={{ position: 'relative', height: '112vh', overflow: 'hidden', borderBottom: '1px solid var(--ink)' }}>
      <div style={{
        position: 'absolute', inset: '-6%',
        transform: `translate3d(${-x}px, ${-y}px, 0) scale(1.08)`,
        transition: 'transform 150ms linear'
      }}>
        <Placeholder palette={shoot.palette} style={{ width: '100%', height: '100%' }} label={`HERO — ${shoot.title.toUpperCase()} / IS_HERO=TRUE`} corner="tr" />
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 28, color: 'var(--paper)', mixBlendMode: 'difference' }} className="t-mono">
        PLATE 01/14 · 35MM · NATURAL LIGHT · UN-GRADED
      </div>
      <div style={{ position: 'absolute', bottom: 24, right: 28, color: 'var(--paper)', mixBlendMode: 'difference' }} className="t-mono">
        SCROLL ↓ FOR CREDITS
      </div>
    </section>
  );
}

function CreditsBlock({ shoot }) {
  const entries = Object.entries(shoot.credits);
  return (
    <section style={{ padding: '100px 0 80px', borderBottom: '1px solid var(--ink)', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px' }}>
        <div style={{ gridColumn: '1 / 4' }}>
          <div className="t-mono" style={{ marginBottom: 24 }}>§ CREDITS</div>
          <div className="t-disp" style={{ fontSize: 80, fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.88 }}>
            31 people
            <br/>
            <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>made this.</span>
          </div>
          <div className="t-mono" style={{ marginTop: 24, maxWidth: 260, lineHeight: 1.5, opacity: 0.65 }}>
            INCLUDES UN-CREDITED ASSISTANTS, DRIVERS, ON-SET CATERING, AND A NIGHT-SHIFT CLEANER AT WAREHOUSE 9 WHO LET US STAY UNTIL 4AM.
          </div>
        </div>

        <div style={{ gridColumn: '5 / 13' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 48px' }}>
            {entries.map(([role, name], i) => (
              <div key={role} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                padding: '18px 0',
                borderBottom: '1px solid var(--rule)',
                alignItems: 'baseline'
              }}>
                <span className="t-mono" style={{ opacity: 0.7 }}>{role.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="t-mono-lg" style={{ fontSize: 15, letterSpacing: 0 }}>{name}</span>
              </div>
            ))}
            {/* extra staff rows */}
            {[
              ['PRODUCER', 'Eva Monsegur'],
              ['PHOTO ASSISTANT', 'Caleb Odeyemi, Rafi Khorsandi'],
              ['STYLING ASSISTANT', 'Tallulah Brown'],
              ['STUDIO', 'Routure Workroom, Brooklyn'],
              ['POST', '—'],
              ['RETOUCH', 'NONE — UN-GRADED'],
              ['FILM', 'Cinestill 800T, Portra 400'],
              ['LAB', 'Indie Photo, NYC'],
            ].map(([r, n]) => (
              <div key={r} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                padding: '18px 0', borderBottom: '1px solid var(--rule)', alignItems: 'baseline'
              }}>
                <span className="t-mono" style={{ opacity: 0.7 }}>{r}</span>
                <span className="t-mono-lg" style={{ fontSize: 15, letterSpacing: 0 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Anno x="34%" y="80px">Credits block: 2-col monospace grid, role LEFT / name RIGHT. Rules dissolve on hover to reveal a collaborator's bio card.</Anno>
    </section>
  );
}

function ImageSequence({ shoot }) {
  // sequence alternates full-bleed portraits/landscapes + articles between
  const frames = [
    { kind: 'img', palette: 'p-night', label: 'PLATE 02 · PORTRAIT · 120mm', h: '120vh' },
    { kind: 'caption', text: 'Jacket & trousers, Routure Lot 07. Boots stylist\'s own.' },
    { kind: 'pair',
      left:  { palette: 'p-ember', label: 'PLATE 03 · DETAIL · LEFT SLEEVE' },
      right: { palette: 'p-clay',  label: 'PLATE 04 · FRAME · HALLWAY' } },
    { kind: 'heading', text: 'On the third night, the chamber went silent.' },
    { kind: 'para', text: 'We had been shooting for four hours in a room designed to absorb every echo, and the hair makeup trailer outside was humming through the wall at a frequency that did not belong to us. Then someone closed a door in the building and the sound left. Hana stopped mid-turn and said, "I can hear my hair." We kept the roll that frame belongs to, even though her eyes are closed.' },
    { kind: 'img', palette: 'p-plum', label: 'PLATE 05 · LANDSCAPE · 35mm', h: '80vh' },
    { kind: 'pullquote', text: 'She could hear her hair. We kept the frame.' },
    { kind: 'img', palette: 'p-moss', label: 'PLATE 06 · PORTRAIT · 50mm', h: '118vh' },
    { kind: 'triptych',
      items: [
        { palette: 'p-pool',  label: 'PLATE 07' },
        { palette: 'p-bone',  label: 'PLATE 08' },
        { palette: 'p-ash',   label: 'PLATE 09' },
      ]},
    { kind: 'para', text: 'The fourth night was about nothing. We unspooled twelve rolls and not one of them is in the issue. We include this paragraph instead, as a credit to the work that got us to the fifth night.' },
    { kind: 'img', palette: 'p-ember', label: 'PLATE 10 · PORTRAIT · 85mm', h: '125vh' },
    { kind: 'caption', text: 'Full look, Routure Lot 07. Earrings, archival.' },
    { kind: 'img', palette: 'p-night', label: 'PLATE 11 · LANDSCAPE · ROOM WIDE · 24mm', h: '72vh' },
    { kind: 'pullquote', text: 'Clothes do not hang in silence. They ring.' },
    { kind: 'img', palette: 'p-clay', label: 'PLATE 12 · CLOSING FRAME · 35mm', h: '110vh' },
  ];

  return (
    <section style={{ padding: '0', borderBottom: '1px solid var(--ink)' }}>
      {frames.map((f, i) => {
        if (f.kind === 'img') {
          return (
            <div key={i} style={{ position: 'relative', height: f.h, overflow: 'hidden' }}>
              <Placeholder palette={f.palette} style={{ width: '100%', height: '100%' }} label={f.label} corner="tr" />
              <div className="t-mono" style={{ position: 'absolute', bottom: 18, left: 28, color: 'var(--paper)', mixBlendMode: 'difference' }}>
                {String(i + 2).padStart(2, '0')} / 14
              </div>
            </div>
          );
        }
        if (f.kind === 'caption') {
          return (
            <div key={i} style={{ padding: '28px', borderBottom: '1px solid var(--rule)' }}>
              <div className="t-mono" style={{ maxWidth: 520, margin: '0 auto', textTransform: 'none', letterSpacing: 0, fontSize: 13, lineHeight: 1.55 }}>
                <span style={{ opacity: 0.5, marginRight: 10 }}>FIG.</span>{f.text}
              </div>
            </div>
          );
        }
        if (f.kind === 'pair') {
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', height: '92vh' }}>
              <div style={{ position: 'relative' }}>
                <Placeholder palette={f.left.palette} style={{ width: '100%', height: '100%' }} label={f.left.label} corner="tr" />
              </div>
              <div style={{ position: 'relative', borderLeft: '1px solid var(--ink)' }}>
                <Placeholder palette={f.right.palette} style={{ width: '100%', height: '100%' }} label={f.right.label} corner="tr" />
              </div>
            </div>
          );
        }
        if (f.kind === 'triptych') {
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '78vh' }}>
              {f.items.map((it, j) => (
                <div key={j} style={{ position: 'relative', borderLeft: j === 0 ? 'none' : '1px solid var(--ink)' }}>
                  <Placeholder palette={it.palette} style={{ width: '100%', height: '100%' }} label={it.label} corner="tr" />
                </div>
              ))}
            </div>
          );
        }
        if (f.kind === 'heading') {
          return (
            <div key={i} style={{ padding: '100px 28px 60px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
              <h2 className="t-disp" style={{
                gridColumn: '3 / 11',
                fontSize: 72,
                fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400',
                lineHeight: 0.95,
                textWrap: 'balance'
              }}>
                {f.text}
              </h2>
            </div>
          );
        }
        if (f.kind === 'para') {
          return (
            <div key={i} style={{ padding: '0 28px 80px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
              <p style={{ gridColumn: '4 / 10', fontSize: 17, lineHeight: 1.65, fontFamily: 'var(--f-sans)', textWrap: 'pretty' }}>
                {f.text}
              </p>
            </div>
          );
        }
        if (f.kind === 'pullquote') {
          return (
            <div key={i} style={{
              background: 'var(--ink)', color: 'var(--paper)', padding: '120px 28px',
              position: 'relative'
            }}>
              <blockquote className="t-disp" style={{
                fontSize: 'clamp(48px, 6vw, 96px)',
                fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 300',
                lineHeight: 0.98,
                maxWidth: 1100, margin: '0 auto',
                textWrap: 'balance'
              }}>
                <span style={{ color: 'var(--acid)', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800' }}>"</span>
                {f.text}
                <span style={{ color: 'var(--acid)', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 800' }}>"</span>
              </blockquote>
              <div className="t-mono" style={{ position: 'absolute', bottom: 22, left: 28, opacity: 0.6 }}>
                — LÉA ARONSON, ON EVENT HORIZON
              </div>
            </div>
          );
        }
      })}
      <Anno x="50%" y="300px">Image sequence: one plate per viewport, text interleaved. Pullquotes break full-bleed on black — the chrome disappears.</Anno>
    </section>
  );
}

function ShootOutro({ shoot, issue }) {
  return (
    <section style={{ padding: '80px 28px', borderBottom: '1px solid var(--ink)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <div className="t-mono" style={{ marginBottom: 18 }}>END OF SHOOT №01</div>
          <div className="t-disp" style={{ fontSize: 80, fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300', lineHeight: 0.9 }}>
            Continue<br/>
            <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>through</span><br/>
            the issue.
          </div>
        </div>
        <div style={{ gridColumn: '7 / 13', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {[window.ROUTURE_DATA.shoots[1], window.ROUTURE_DATA.shoots[2]].map((s, i) => (
            <a key={s.slug} href="shoot.html" data-cursor={i === 0 ? "prev" : "next"} style={{ position: 'relative', height: 520, display: 'block' }}>
              <Placeholder palette={s.palette} style={{ width: '100%', height: '100%' }} label={`${i === 0 ? '← PREV' : 'NEXT →'}`} corner="tr" />
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, color: 'var(--paper)', mixBlendMode: 'difference' }}>
                <div className="t-mono">{i === 0 ? 'PREVIOUS' : 'UP NEXT'} · SHOOT №{i === 0 ? '—' : '02'}</div>
                <div className="t-disp" style={{ fontSize: 52, fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400', lineHeight: 0.92, marginTop: 6 }}>{s.title}</div>
                <div className="t-mono" style={{ marginTop: 8, opacity: 0.8 }}>PH. {s.credits.photographer}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ShootMasthead, ShootHero, CreditsBlock, ImageSequence, ShootOutro });
