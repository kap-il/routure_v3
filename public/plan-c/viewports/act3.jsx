/* global React */
// ROUTURE — Act III: Editorial band + category sweep + CASTING CALL inline

// ————————————————————————————————————————————————————————————————
// V08 — Editorial letter: serif, narrow column, footnotes
function V08_EditorialBand() {
  return (
    <div className="rv" style={{ background: '#F2EEE5' }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>Act III · Editorial Band</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 08 · letter</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Annotations hover-expand from margin</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>06 / 22</div>

      <div style={{ position: 'absolute', left: 40, right: 40, top: 70, bottom: 70, display: 'grid', gridTemplateColumns: '1fr 560px 1fr', gap: 40 }}>
        {/* Left margin footnotes */}
        <div className="col" style={{ paddingTop: 80 }}>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>editors note § 02 — cosmic</div>
          <div className="r-mono" style={{ opacity: 0.65, marginTop: 40, lineHeight: 1.6 }}>
            ¹ The casting we extended to non-agency<br/>applicants. See call in-flow, viewport 10.<br/>
            <span style={{ color: '#FF3D1F' }}>—</span><br/><br/>
            ² "Commercialism" is here treated<br/>as a category of feeling, not finance.
          </div>
        </div>

        {/* Center letter */}
        <div className="col" style={{ paddingTop: 40 }}>
          <div className="r-display" style={{ fontSize: 52, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1.0 }}>
            From the <br/>editorial <br/>board,
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 18, lineHeight: 1.65, textAlign: 'justify', marginTop: 28, columnFill: 'balance' }}>
            <p style={{ marginTop: 0 }}>
              <span className="r-smallcaps" style={{ fontSize: 14, letterSpacing: '0.18em' }}>it is our contention</span> that a
              fashion publication must behave like its subject. Garments drape; we designed a site that drapes. Shoots
              accrete; we designed a site that accretes. Casting calls¹ are urgent and disposable; we surface them
              inline, then let them age out.
            </p>
            <p>
              This issue — COSMIC — is not about space. It is about the gravitational pull of surfaces: a salt wall,
              a vinyl seam, a model's lower lash-line caught in the ring-light. Surfaces have weather. We wanted to
              photograph the weather.
            </p>
            <p style={{ color: '#FF3D1F', fontStyle: 'italic', fontSize: 22 }}>
              — We are, all of us, in commerce with our own gravity.²
            </p>
            <p>
              Read in any order. The site will let you. Read it as text if you prefer plainer rooms; the toggle is
              at the top, by the masthead. Otherwise: scroll, linger, be pulled.
            </p>
            <p className="r-mono" style={{ fontSize: 11, letterSpacing: '0.12em', marginTop: 28, opacity: 0.65 }}>
              — The editorial board / Routure, April 2026
            </p>
          </div>
        </div>

        {/* Right: pullquote */}
        <div className="col center" style={{ justifyContent: 'flex-end' }}>
          <div className="r-display" style={{ fontSize: 96, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 0.9, textAlign: 'right' }}>
            "Surfaces <br/>have <br/><span style={{ color: '#FF3D1F' }}>weather.</span>"
          </div>
          <div className="r-mono" style={{ marginTop: 20, textAlign: 'right' }}>pullquote · breaks full-bleed on enter</div>
        </div>
      </div>

      <div className="anno anno--bl">
        Serif body column is 560px; footnotes live in left margin. Pullquote on right scales 1 → 1.04 on scroll.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V09 — Category sweep (full-viewport moment)
function V09_CategorySweep() {
  return (
    <div className="rv rv--dark" style={{ padding: 0 }}>
      <div className="folio" style={{ top: 24, left: 40, color: '#F2EEE5' }}>Category sweep · 3 / 5</div>
      <div className="folio" style={{ top: 24, right: 40, color: '#FF3D1F' }}>Act III · Viewport 09</div>
      <div className="folio" style={{ bottom: 24, left: 40, color: '#F2EEE5' }}>Each category holds one representative image + display type</div>
      <div className="folio" style={{ bottom: 24, right: 40, color: '#F2EEE5' }}>07 / 22</div>

      {/* Half-image, half-type */}
      <div className="ph ph--dark" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 720 }}>
        <div className="cornerL" style={{ color: '#F2EEE5' }}>representative · category 03</div>
        <div className="label" style={{ color: '#F2EEE5', borderColor: '#F2EEE5' }}>Experimentalism · plate · Momo in Weld-Set knit</div>
      </div>

      <div style={{ position: 'absolute', left: 740, right: 40, top: 60, bottom: 60 }} className="col between">
        <div>
          <div className="r-mono" style={{ color: '#FF3D1F' }}>Category 03 of 05 · sweep</div>
          <div className="r-mono" style={{ color: '#F2EEE5', opacity: 0.6, marginTop: 8 }}>
            Architecture · Sustainability · <span style={{ color: '#FF3D1F' }}>Experimentalism</span> · Commercialism · Community
          </div>
        </div>

        <div className="r-display" style={{ fontSize: 220, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.86, color: '#F2EEE5' }}>
          Experi-<br/>mental<span style={{ color: '#FF3D1F' }}>-</span><br/>ism.
        </div>

        <div style={{ maxWidth: 520 }}>
          <p style={{ fontFamily: 'var(--f-display)', color: '#F2EEE5', fontSize: 22, fontStyle: 'italic', lineHeight: 1.3, margin: 0 }}>
            Weld-Set, Haw-Mirer, Collateral's sub-label — six studios that refuse to be photographed twice the
            same way.
          </p>
          <div className="r-mono" style={{ color: '#F2EEE5', opacity: 0.65, marginTop: 14 }}>
            18 shoots tagged · 04 open callouts · filter flips pagination to experimental works only
          </div>
        </div>
      </div>

      {/* wayfinder */}
      <div className="wayfind" style={{ color: '#F2EEE5', right: 40, bottom: 'auto', top: 40 }}>
        <span>ACT III · CATEGORIES</span>
        <span className="bar"><i style={{ width: 72, position: 'absolute', left: 0, top: -1, height: 3, background: '#FF3D1F' }}/></span>
        <span style={{ opacity: 0.6 }}>58%</span>
      </div>

      <div className="anno anno--br">
        Five categories sweep past in 5 viewports. Click any to filter the archive (act IV) to that category.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V10 — CASTING CALL inline (urgent, distinct visual treatment)
function V10_CastingCall() {
  return (
    <div className="rv rv--hot">
      <div className="folio" style={{ top: 24, left: 40 }}>Casting call · inline · No. 02</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 10 — urgent interrupt</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>Scrawled display · hand-set type</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>08 / 22</div>

      {/* "Sticker" diagonal tag */}
      <div style={{
        position: 'absolute', left: 40, top: 76,
        background: '#0A0A0A', color: '#FF3D1F', padding: '8px 14px',
        transform: 'rotate(-3deg)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.14em'
      }}>OPEN CALL · CLOSES 12 MAY — APPLY FROM ANY NATION</div>

      {/* Gigantic scrawled type */}
      <div style={{ position: 'absolute', left: 40, right: 40, top: 140, bottom: 200 }} className="col between">
        <div className="r-display" style={{ fontSize: 230, lineHeight: 0.82, letterSpacing: '-0.04em', fontStyle: 'italic' }}>
          we are <br/>casting <br/>for <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>issue 03</span><span style={{ color: '#F2EEE5' }}>.</span>
        </div>

        <div className="flex between" style={{ alignItems: 'flex-end' }}>
          <div style={{ maxWidth: 560 }}>
            <div className="r-mono">Looking for — non-agency, trained &amp; untrained, 16+, any body, any gender. <br/>
            Submit — one photo from 2m, one from 0.3m, 30 seconds of you walking. <br/>
            Selected applicants paid union scale + travel. No portfolios required.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="r-mono" style={{ opacity: 0.8 }}>apply at</div>
            <div className="r-display" style={{ fontSize: 70, fontStyle: 'italic', textDecoration: 'underline', textDecorationThickness: 3 }}>
              routure.press/cast
            </div>
            <div className="r-mono" style={{ marginTop: 6 }}>→ opens overlay · 12 fields · 2 minutes</div>
          </div>
        </div>
      </div>

      {/* counter strip */}
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 70, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div className="r-mono">SUBMISSIONS SO FAR</div>
        <div className="r-display" style={{ fontSize: 52, fontStyle: 'italic' }}>2,341</div>
        <div style={{ flex: 1, height: 1, background: '#0A0A0A', opacity: 0.4 }}/>
        <div className="r-mono">CLOSES IN</div>
        <div className="r-display" style={{ fontSize: 52, fontStyle: 'italic' }}>19d · 04h · 12m</div>
      </div>

      {/* black paper-clip style marks */}
      <div style={{ position: 'absolute', right: 40, top: 60, width: 42, height: 42, border: '2px solid #0A0A0A', transform: 'rotate(20deg)' }}/>

      <div className="anno anno--tl" style={{ background: '#0A0A0A' }}>
        Casting calls hijack the flow — signature hue floods page. They age out of the feed once closed.
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// V11 — MERCH drop inline
function V11_MerchInline() {
  return (
    <div className="rv">
      <div className="folio" style={{ top: 24, left: 40, color: '#FF3D1F' }}>Drop 02 · Issue No. 02 merch</div>
      <div className="folio" style={{ top: 24, right: 40 }}>Viewport 11 · inline shop</div>
      <div className="folio" style={{ bottom: 24, left: 40 }}>No /shop route · add-to-cart is a cursor hold</div>
      <div className="folio" style={{ bottom: 24, right: 40 }}>09 / 22</div>

      <div style={{ position: 'absolute', left: 40, right: 40, top: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="r-display" style={{ fontSize: 120, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 0.9 }}>
          Drop <span style={{ color: '#FF3D1F' }}>02</span>.<br/>
          wear the <br/>issue.
        </div>
        <div className="r-mono" style={{ textAlign: 'right', lineHeight: 1.6 }}>
          Ships — 14 May / Limit — one per customer<br/>
          Printed — Zurich / Paper — Fedrigoni 300gsm<br/>
          Receipts routed to editorial board
        </div>
      </div>

      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 70, top: 400, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { t: 'ISSUE 02 POSTER', sub: '700×1000 · 24 panels', px: '€48', cursor: true },
          { t: 'SALT CATHEDRAL TEE', sub: 'heavyweight · ivory', px: '€95' },
          { t: 'ROUTURE CAP', sub: 'unstructured · black', px: '€60' },
          { t: '02 / 02 TOTE', sub: 'natural canvas', px: '€40' },
        ].map((m, i) => (
          <div key={i} className="col" style={{ border: '1px solid rgba(10,10,10,0.25)', padding: 14, gap: 12, background: '#F2EEE5', position: 'relative' }}>
            <div className="ph" style={{ aspectRatio: '1', width: '100%' }}>
              <div className="label">product plate · {String(i + 1).padStart(2, '0')}</div>
            </div>
            <div className="flex between">
              <div className="r-cond" style={{ fontSize: 13 }}>{m.t}</div>
              <div className="r-mono" style={{ color: '#FF3D1F' }}>{m.px}</div>
            </div>
            <div className="r-mono" style={{ opacity: 0.6 }}>{m.sub}</div>
            {m.cursor && (
              <div style={{ position: 'absolute', top: -14, right: -14 }}>
                <div className="cursor-ring" style={{ position: 'static', color: '#0A0A0A', borderColor: '#FF3D1F' }}>hold</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="anno anno--br">
        "Hold to buy" — press-and-hold the cursor over a plate and a ring fills. Releases to cart overlay.
      </div>
    </div>
  );
}

window.V08_EditorialBand = V08_EditorialBand;
window.V09_CategorySweep = V09_CategorySweep;
window.V10_CastingCall = V10_CastingCall;
window.V11_MerchInline = V11_MerchInline;
