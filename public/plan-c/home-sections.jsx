// home-sections.jsx — ROUTURE homepage sections

const { useState: uS, useEffect: uE, useRef: uR, useLayoutEffect: uLE, useMemo: uM } = React;

/* ============ 1. MASTHEAD ============ */
function Masthead() {
  const now = new Date('2026-04-23T09:12:00');
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return (
    <header style={{ borderBottom: '1px solid var(--ink)' }}>
      {/* top row: date, issue marker, nav */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 28px 12px',
        borderBottom: '1px solid var(--rule)'
      }}>
        <div className="t-mono">
          <span>{dateStr}</span>
          <span style={{ margin: '0 12px', opacity: 0.4 }}>/</span>
          <span>NEW YORK · 52°F · WIND NNE</span>
        </div>
        <div className="t-mono" style={{ textAlign: 'center' }}>
          <span style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '3px 8px' }}>NO. 02</span>
          <span style={{ margin: '0 10px' }}>—</span>
          <span style={{ letterSpacing: '0.16em' }}>COSMIC</span>
        </div>
        <nav className="t-mono" style={{ textAlign: 'right', display: 'flex', gap: 22, justifyContent: 'flex-end' }}>
          <a data-cursor="view" href="#issues">ISSUES</a>
          <a data-cursor="view" href="#shoots">SHOOTS</a>
          <a data-cursor="view" href="#archive">ARCHIVE</a>
          <a data-cursor="read" href="#journal">JOURNAL</a>
          <a data-cursor="open" href="#shop">SHOP 001</a>
          <a data-cursor="subscribe" href="#subscribe" style={{ background: 'var(--acid)', padding: '3px 8px', color: 'var(--ink)' }}>SUBSCRIBE</a>
        </nav>
      </div>

      {/* wordmark row — huge, full-bleed, hanging letters */}
      <div style={{ position: 'relative', padding: '12px 0 6px', overflow: 'hidden' }}>
        <div className="t-disp" style={{
          fontSize: 'clamp(120px, 22.5vw, 340px)',
          fontWeight: 300,
          lineHeight: 0.82,
          letterSpacing: '-0.045em',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 0,
          position: 'relative'
        }}>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>R</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 400' }}>O</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 20, "wght" 600' }}>U</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 200' }}>T</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 800', fontStyle: 'italic' }}>U</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "wght" 300' }}>R</span>
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 500' }}>E</span>
        </div>
        {/* inline credits line */}
        <div className="t-mono" style={{
          position: 'absolute',
          right: 28, top: 16,
          maxWidth: 180,
          lineHeight: 1.45,
          textAlign: 'right'
        }}>
          AN INDEPENDENT<br/>PUBLICATION ON<br/>GARMENTS, WEATHER<br/>AND POSTURE. EST. 2025.
        </div>
        <Anno x="4%" y="40%">Wordmark — each letter uses a different opsz/wght/soft axis. Subtle breathing animation on idle, reflows on resize.</Anno>
      </div>

      {/* credits ticker */}
      <div style={{
        borderTop: '1px solid var(--ink)',
        borderBottom: '1px solid var(--ink)',
        padding: '10px 0',
        background: 'var(--paper)',
        position: 'relative'
      }}>
        <div className="t-mono" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'var(--paper)', paddingRight: 10, zIndex: 2 }}>
          LIVE CREDITS →
        </div>
        <div style={{ paddingLeft: 160 }}>
          <Marquee items={window.CREDITS_TICKER} speed={55} sep="✳" className="t-mono-lg" />
        </div>
        <Anno x="42%" y="26px" side="right">Credits ticker runs continuously. Hovering a name freezes the ticker and lifts that person's bio.</Anno>
      </div>
    </header>
  );
}

/* ============ 2. HERO ============ */
function Hero() {
  const wrap = uR(null);
  const { x, y } = useMouseParallax(wrap, 26);
  const scrollY = useScrollY();

  // cover title crops past viewport edge; shifts as you scroll
  const titleTransform = `translate3d(${x * 0.3}px, ${-scrollY * 0.15 + y * 0.2}px, 0)`;
  const imgTransform = `translate3d(${-x}px, ${-y - scrollY * 0.04}px, 0) scale(1.08)`;

  return (
    <section ref={wrap} style={{ position: 'relative', height: '100vh', overflow: 'hidden', borderBottom: '1px solid var(--ink)' }}>
      {/* full-bleed cover image */}
      <div style={{ position: 'absolute', inset: '-6%', transform: imgTransform, transition: 'transform 120ms linear' }}>
        <Placeholder palette="p-night" className="" style={{ width: '100%', height: '100%' }} label="COVER / COSMIC / APOGEE — HANA OYELARAN / PH. INES MARÉCHAL" corner="tr" />
      </div>

      {/* overlaid monstrous title */}
      <HeroTitle titleTransform={titleTransform} />

      {/* cover metadata */}
      <div style={{ position: 'absolute', top: 28, left: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference' }}>
        <div className="t-mono">ISSUE NO. 02</div>
        <div className="t-mono" style={{ marginTop: 4 }}>ON VIEW · 23.04.2026 — 22.07.2026</div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference', maxWidth: 360 }}>
        <div className="t-mono" style={{ marginBottom: 8 }}>FROM THE COVER</div>
        <div className="t-disp-ital" style={{ fontSize: 24, lineHeight: 1.05 }}>
          "On orbit, gravity, and the<br/>clothes that prove we are here."
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 3, color: 'var(--paper)', mixBlendMode: 'difference', textAlign: 'right' }}>
        <a href="shoot.html" data-cursor="enter" className="t-mono" style={{ borderBottom: '1px solid currentColor', paddingBottom: 2 }}>
          ENTER THE COVER STORY →
        </a>
        <div className="t-mono" style={{ marginTop: 14, opacity: 0.75 }}>SCROLL · 07 shoots follow</div>
      </div>

      {/* small chip of acid */}
      <div style={{ position: 'absolute', top: 28, right: 28, zIndex: 3, background: 'var(--acid)', color: 'var(--ink)', padding: '6px 10px', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em' }}>
        ● LIVE — 142 READERS
      </div>

      <Anno x="50%" y="38%">Cursor parallax on hero image + counter-parallax on cover title. Scroll drags the word off the bottom edge.</Anno>
      <Anno x="12%" y="72%" side="right">Mix-blend-difference makes every caption legible regardless of image content underneath.</Anno>
    </section>
  );
}

/* ============ 3. SHOOT GALLERY ============ */
function ShootGallery() {
  const shoots = window.ROUTURE_DATA.shoots;
  // pre-authored tile layout: each row is 12 cols, tiles span varying cols + heights
  const layout = [
    { i: 0, col: '1 / 6',  h: '88vh', orient: 'portrait'  },  // Event Horizon
    { i: 1, col: '7 / 13', h: '54vh', orient: 'landscape' },  // Soft Gravity
    { i: 2, col: '7 / 10', h: '62vh', orient: 'portrait'  },  // Apogee
    { i: 3, col: '10 / 13', h: '40vh', orient: 'portrait' },  // Low Earth Orbit
    { i: 4, col: '1 / 8',  h: '64vh', orient: 'landscape' },  // Dark Matter
    { i: 5, col: '9 / 13', h: '78vh', orient: 'portrait'  },  // Retrograde
    { i: 6, col: '1 / 9',  h: '48vh', orient: 'landscape' },  // Lagrangian
    { i: 7, col: '9 / 13', h: '48vh', orient: 'portrait'  },  // Terminator
  ];

  return (
    <section id="shoots" style={{ padding: '80px 0 40px', position: 'relative', background: 'var(--paper)' }}>
      {/* section header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px', alignItems: 'end', marginBottom: 40 }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <div className="t-mono" style={{ marginBottom: 18 }}>§ 01 — THE SHOOTS</div>
          <div className="t-disp" style={{ fontSize: 'clamp(60px, 9vw, 140px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            Eight <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600' }}>orbits</span>,
          </div>
          <div className="t-disp" style={{ fontSize: 'clamp(60px, 9vw, 140px)', fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 300' }}>
            one <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600' }}>atmosphere</span>.
          </div>
        </div>
        <div style={{ gridColumn: '8 / 13', justifySelf: 'end', textAlign: 'right', maxWidth: 360 }}>
          <div className="t-mono" style={{ marginBottom: 12, opacity: 0.7 }}>SPRING · COSMIC · SHOT 09.2025 — 03.2026</div>
          <p className="t-sans-cond" style={{ fontSize: 15, lineHeight: 1.35 }}>
            Eight shoots, thirty-one collaborators, four cities. Scroll to read; hover to unfold the credits. Nothing here has been color-graded.
          </p>
        </div>
      </div>

      {/* index line */}
      <div className="t-mono" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18, padding: '0 28px 24px', borderBottom: '1px solid var(--ink)' }}>
        <span style={{ gridColumn: '1/2' }}>№</span>
        <span style={{ gridColumn: '2/6' }}>TITLE</span>
        <span style={{ gridColumn: '6/9' }}>PHOTOGRAPHY</span>
        <span style={{ gridColumn: '9/11' }}>LOCATION</span>
        <span style={{ gridColumn: '11/13', textAlign: 'right' }}>ASPECT / OPEN →</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 18,
        padding: '28px',
        alignItems: 'start'
      }}>
        {layout.map(({ i, col, h, orient }) => {
          const s = shoots[i];
          return <ShootTile key={s.slug} shoot={s} gridColumn={col} height={h} orient={orient} index={i} />;
        })}
      </div>

      <Anno x="4%" y="600px">Shoot tiles: 12-col grid, wildly uneven aspect ratios by design. On hover the tile expands +8% and full credits slide in from the side.</Anno>
    </section>
  );
}

function ShootTile({ shoot, gridColumn, height, orient, index }) {
  const [hov, setHov] = uS(false);
  const tileRef = uR(null);
  const { x, y } = useMouseParallax(tileRef, 14);

  return (
    <a
      href="shoot.html"
      data-cursor="open shoot"
      ref={tileRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        gridColumn,
        height,
        display: 'block',
        overflow: 'hidden',
        border: '1px solid var(--ink)',
        transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      {/* image */}
      <div style={{
        position: 'absolute', inset: '-4%',
        transform: `translate3d(${hov ? x : 0}px, ${hov ? y : 0}px, 0) scale(${hov ? 1.08 : 1})`,
        transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)'
      }}>
        <Placeholder palette={shoot.palette} style={{ width: '100%', height: '100%' }} label={`${shoot.title.toUpperCase()} / ${orient.toUpperCase()}`} corner="tr" />
      </div>

      {/* number badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--paper)', mixBlendMode: 'difference',
        zIndex: 3
      }}>
        №{String(index + 1).padStart(2, '0')} · {shoot.section_type.toUpperCase()}
      </div>

      {/* Title + one credit (default) */}
      <div style={{
        position: 'absolute',
        left: 14, right: 14, bottom: 14,
        color: 'var(--paper)',
        mixBlendMode: 'difference',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 18
      }}>
        <div>
          <div className="t-disp" style={{
            fontSize: 'clamp(28px, 3.2vw, 56px)',
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 400',
            lineHeight: 0.9,
            transform: hov ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)'
          }}>
            {shoot.title}
          </div>
          <div className="t-mono" style={{ marginTop: 6 }}>
            PH. {shoot.credits.photographer} · STY. {shoot.credits.stylist}
          </div>
        </div>
      </div>

      {/* full credits panel (hover) */}
      <div style={{
        position: 'absolute',
        top: 0, right: hov ? 0 : '-60%',
        width: '56%',
        height: '100%',
        background: 'var(--acid)',
        color: 'var(--ink)',
        padding: '18px 18px 18px 20px',
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        letterSpacing: '0.04em',
        transition: 'right 450ms cubic-bezier(.2,.8,.2,1)',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div style={{ fontSize: 10, opacity: 0.7, borderBottom: '1px solid var(--ink)', paddingBottom: 8 }}>CREDITS — {shoot.title.toUpperCase()}</div>
        {Object.entries(shoot.credits).map(([role, name]) => (
          <div key={role} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12 }}>
            <span style={{ opacity: 0.55 }}>{role.replace(/_/g, ' ').toUpperCase()}</span>
            <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>{name}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--ink)' }}>
          <span>№{String(index+1).padStart(3,'0')}</span>
          <span>OPEN →</span>
        </div>
      </div>
    </a>
  );
}

Object.assign(window, { Masthead, Hero, ShootGallery });
