/* Routure — Issues Hub (archive landing)
   Job: sell Latest Issue, support with archive shelf of 7 past issues.
   Existing design system: #FAFAF8 bg, #1A1A1A ink, Cormorant (stand-in for Cochin),
   Geist body, IBM Plex Mono labels, rounded-sm only, hairline rules, uppercase
   wide-tracked mono eyebrows. No new palette.
*/
const { useState, useEffect, useMemo, useRef } = React;

/* ---------- Tweaks ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "portrait",
  "density": "normal",
  "ornaments": "full",
  "showRibbon": true,
  "heroLayout": "dominant"
}/*EDITMODE-END*/;

/* ---------- Data ---------- */
const LATEST = {
  n: 2, roman: "II", title: "Cosmic", date: "Spring 2026",
  published: "04.23.2026",
  tagline: "On distance, softness, and the long quiet after light.",
  frames: 24, essays: 6, shoots: 5,
};

/* 7 issues, latest first (but archive shelf typically renders the 6 prior) */
const ISSUES = [
  { n: 2, roman: "II",   title: "Cosmic",     date: "Spring 2026",   theme: "Distance",    palette: "cool"  },
  { n: 1, roman: "I",    title: "Savour",     date: "Autumn 2025",   theme: "Slowness",    palette: "warm"  },
  { n: 0, roman: "0",    title: "Pilot",      date: "Summer 2025",   theme: "Beginnings",  palette: "mono"  },
  { n:-1, roman: "PRE·I",title: "Threshold",  date: "Spring 2025",   theme: "Thresholds",  palette: "warm"  },
  { n:-2, roman: "PRE·II",title:"Lowlight",   date: "Winter 2024",   theme: "Shadow",      palette: "cool"  },
  { n:-3, roman: "PRE·III",title:"Draft One", date: "Autumn 2024",   theme: "Drafts",      palette: "mono"  },
  { n:-4, roman: "PRE·IV", title:"Offcuts",   date: "Summer 2024",   theme: "Fragments",   palette: "warm"  },
];

const SPINE_TICKER = ISSUES.map(i => `N° ${i.n < 0 ? "00" : String(i.n).padStart(2,"0")} · ${i.title}`);

/* =========================================================
   Tweaks panel (self-contained, uses the host protocol)
   ========================================================= */
function useTweaks(defaults) {
  const [state, setState] = useState(defaults);
  const setKey = (k, v) => {
    setState(s => ({...s, [k]: v}));
    try {
      window.parent.postMessage({type:"__edit_mode_set_keys", edits:{[k]: v}}, "*");
    } catch(_){}
  };
  return [state, setKey];
}

function TweaksPanel({ t, setT, open, onClose }) {
  if (!open) return null;
  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <span className="eyebrow">Tweaks</span>
        <button onClick={onClose} className="tweaks-close" aria-label="Close">✕</button>
      </div>

      <TRadio label="Hero layout"   value={t.heroLayout} options={["dominant","equal"]} onChange={v=>setT("heroLayout",v)} />
      <TRadio label="Card style"    value={t.cardStyle}  options={["portrait","landscape","list"]} onChange={v=>setT("cardStyle",v)} />
      <TRadio label="Density"       value={t.density}    options={["compact","normal","spacious"]} onChange={v=>setT("density",v)} />
      <TRadio label="Ornaments"     value={t.ornaments}  options={["minimal","subtle","full"]}     onChange={v=>setT("ornaments",v)} />
      <TToggle label="Editorial ribbon" value={t.showRibbon} onChange={v=>setT("showRibbon",v)} />

      <div className="tweaks-foot mono">
        Persisted on change · reload-safe
      </div>
    </div>
  );
}

function TRadio({ label, value, options, onChange }) {
  return (
    <div className="tctl">
      <div className="tctl-label mono">{label}</div>
      <div className="tctl-seg">
        {options.map(o=>(
          <button key={o}
            className={"tctl-chip mono" + (value === o ? " on" : "")}
            onClick={()=>onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TToggle({ label, value, onChange }) {
  return (
    <div className="tctl tctl-row">
      <div className="tctl-label mono">{label}</div>
      <button className={"tctl-switch" + (value ? " on" : "")} onClick={()=>onChange(!value)}>
        <span className="knob"/>
      </button>
    </div>
  );
}

/* =========================================================
   Header
   ========================================================= */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h(); window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header style={{
      position:"sticky", top:0, zIndex:40,
      background: scrolled ? "rgba(250,250,248,0.94)" : "rgba(250,250,248,1)",
      backdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
      WebkitBackdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
      borderBottom: "1px solid " + (scrolled ? "var(--rule)" : "transparent"),
      transition:"background .25s, border-color .25s",
    }}>
      <div style={{maxWidth:1440, margin:"0 auto", padding:"0 40px"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", height:72}}>
          <nav style={{display:"flex", gap:28, alignItems:"center"}}>
            {["Journal","Issues","Shop"].map((n,i)=>(
              <a key={n} href="#" className={"navlink mono" + (n==="Issues" ? " active" : "")}>{n}</a>
            ))}
          </nav>
          <a href="#" style={{fontFamily:"var(--serif)", fontWeight:600, fontSize:28, letterSpacing:"-0.02em", color:"var(--ink)"}}>Routure</a>
          <nav style={{display:"flex", gap:28, alignItems:"center"}}>
            <a href="#" className="navlink mono">Community</a>
            <a href="#" className="navlink mono">Subscribe</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Spine ticker — scale play, the run of all issue numerals
   ========================================================= */
function SpineTicker({ ornaments }) {
  if (ornaments === "minimal") return null;
  const items = [...SPINE_TICKER, ...SPINE_TICKER];
  return (
    <div className="spine">
      <div className="spine-track">
        {items.map((it,i)=>(
          <span key={i} className="spine-item">
            <span className="serif">{it.split(" · ")[0]}</span>
            <span className="mono spine-sep">·</span>
            <span className="serif spine-title">{it.split(" · ")[1]}</span>
            <span className="spine-dot"/>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Page masthead — the page itself, not the hero
   ========================================================= */
function PageMasthead({ ornaments }) {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"56px 40px 24px"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:24, marginBottom:36}}>
        <div className="folio"><span>The Archive</span><span className="tick">/</span><span>07 Issues</span></div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".32em", textTransform:"uppercase", color:"var(--ink)"}}>
          Routure · Issues
        </div>
        <div className="folio" style={{justifyContent:"flex-end"}}>
          <span>Updated {LATEST.published}</span>
        </div>
      </div>

      <div className="hairline-ink" style={{marginBottom:48}} />

      {/* Giant page wordmark */}
      <div style={{display:"grid", gridTemplateColumns:"minmax(0,1.55fr) minmax(0,1fr)", gap:56, alignItems:"end"}}>
        <h1 style={{
          fontSize:"clamp(88px, 12.5vw, 188px)",
          lineHeight:.84,
          letterSpacing:"-0.045em",
          color:"var(--ink)",
          fontWeight:600,
          textTransform:"uppercase",
          fontStyle:"italic",
          margin:0,
        }}>
          Issues<span style={{color:"var(--gray-400)"}}>.</span>
        </h1>
        <div style={{paddingBottom:20}}>
          <div className="eyebrow" style={{marginBottom:18}}>From the desk, in order</div>
          <p className="serif" style={{
            fontSize:20, lineHeight:1.45, color:"var(--gray-900)", fontStyle:"italic",
            margin:0, maxWidth:"38ch", letterSpacing:"-0.005em",
          }}>
            Every volume of Routure, from the newest reading through to the first pilot.
            The current issue sits at the top of the shelf; the archive follows.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Latest-issue hero
   ========================================================= */
function LatestHero({ heroLayout, ornaments }) {
  const dominant = heroLayout === "dominant";
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"32px 40px 64px"}}>
      <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:22}}>
        <div className="eyebrow">Now Reading · No. {String(LATEST.n).padStart(2,"0")}</div>
        <div style={{flex:1, height:1, background:"var(--rule)"}}/>
        <a href="#" className="readmore">Skip to archive <span className="arrow">↓</span></a>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns: dominant ? "minmax(0,1.55fr) minmax(0,1fr)" : "1fr 1fr",
        gap:32,
      }}>
        {/* Cover plate */}
        <a href="#" className="hero-plate">
          <div className="hero-ph placeholder">
            {/* Stamps */}
            <div className="hero-stamp tl">
              <span className="mono">Routure</span>
              <span className="mono" style={{opacity:.55}}>No. 02</span>
            </div>
            <div className="hero-stamp tr mono">{LATEST.date.toUpperCase()}</div>
            {/* Giant italic roman numeral */}
            <div className="hero-numeral serif">{LATEST.roman}</div>
            {/* Title, set on the cover */}
            <div className="hero-title">
              <span className="mono" style={{fontSize:10.5, letterSpacing:".32em", textTransform:"uppercase", color:"rgba(255,255,255,.7)"}}>The Issue</span>
              <span className="serif" style={{fontSize:"clamp(64px, 8vw, 112px)", fontStyle:"italic", fontWeight:600, color:"#fff", letterSpacing:"-0.03em", lineHeight:.92, textTransform:"uppercase", marginTop:8}}>
                {LATEST.title}<span style={{color:"rgba(255,255,255,.35)"}}>.</span>
              </span>
              <span className="serif" style={{fontSize:20, fontStyle:"italic", color:"rgba(255,255,255,.72)", marginTop:14, maxWidth:"36ch", lineHeight:1.35}}>
                {LATEST.tagline}
              </span>
            </div>
            <div className="hero-bottom">
              <span className="mono">{LATEST.frames} frames</span>
              <span className="mono tick">/</span>
              <span className="mono">{LATEST.essays} essays</span>
              <span className="mono tick">/</span>
              <span className="mono">{LATEST.shoots} shoots</span>
            </div>
          </div>
        </a>

        {/* Side panel */}
        <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", gap:24, paddingBottom:12}}>
          <div>
            <div className="eyebrow" style={{marginBottom:14}}>Volume {LATEST.roman} · {LATEST.date}</div>
            <h2 style={{fontSize:"clamp(56px, 6.2vw, 96px)", lineHeight:.88, letterSpacing:"-0.035em", color:"var(--ink)", fontStyle:"italic", fontWeight:600, textTransform:"uppercase", margin:"0 0 28px"}}>
              {LATEST.title}
            </h2>
            <p className="serif" style={{fontSize:20, lineHeight:1.45, color:"var(--gray-900)", fontStyle:"italic", margin:"0 0 28px", maxWidth:"34ch", letterSpacing:"-0.005em"}}>
              “{LATEST.tagline}”
            </p>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20, maxWidth:440}}>
              <Metric label="Frames"  value={String(LATEST.frames).padStart(2,"0")}/>
              <Metric label="Essays"  value={String(LATEST.essays).padStart(2,"0")}/>
              <Metric label="Shoots"  value={String(LATEST.shoots).padStart(2,"0")}/>
            </div>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:16, flexWrap:"wrap"}}>
            <a href="Routure Issue View.html" className="cta-ink">
              Open Issue No. 02
              <span className="cta-arr">→</span>
            </a>
            <a href="#" className="cta-ghost">
              Table of Contents
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)", marginBottom:8}}>{label}</div>
      <div className="serif" style={{fontSize:30, fontWeight:600, color:"var(--ink)", lineHeight:1}}>{value}</div>
    </div>
  );
}

/* =========================================================
   Archive shelf
   ========================================================= */
function Archive({ cardStyle, density, ornaments }) {
  const shelf = ISSUES.slice(1); // the 6 prior
  const ribbonLabel =
    cardStyle === "portrait"  ? "Portrait shelf" :
    cardStyle === "landscape" ? "Landscape tiles" : "Catalogue index";

  const gap = density === "compact" ? 16 : density === "spacious" ? 40 : 24;
  const colCount = cardStyle === "landscape" ? 2 : 3;

  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"24px 40px 72px"}}>
      <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:28}}>
        <div className="eyebrow">The Archive · {shelf.length} past issues</div>
        <div style={{flex:1, height:1, background:"var(--rule)"}}/>
        <div className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)"}}>
          {ribbonLabel} · {density}
        </div>
      </div>

      {cardStyle === "list" ? (
        <ArchiveList issues={shelf} ornaments={ornaments}/>
      ) : (
        <div style={{display:"grid", gridTemplateColumns:`repeat(${colCount}, 1fr)`, gap}}>
          {shelf.map((iss, idx) => (
            cardStyle === "portrait"
              ? <PortraitCard key={iss.title} iss={iss} idx={idx} ornaments={ornaments}/>
              : <LandscapeCard key={iss.title} iss={iss} idx={idx} ornaments={ornaments}/>
          ))}
        </div>
      )}
    </section>
  );
}

function PortraitCard({ iss, idx, ornaments }) {
  const palClass = "pal-" + iss.palette;
  return (
    <a href="#" className="pcard">
      <div className={"pcard-cover " + palClass}>
        {ornaments !== "minimal" && (
          <>
            <div className="pcard-stamp tl mono">
              <span>Routure</span>
              <span style={{opacity:.55}}>No. {iss.n < 0 ? "0" + Math.abs(iss.n) : String(iss.n).padStart(2,"0")}</span>
            </div>
            <div className="pcard-stamp tr mono">{iss.date.toUpperCase()}</div>
          </>
        )}
        <div className="pcard-numeral serif">{iss.roman}</div>
        <div className="pcard-footstamp">
          <span className="mono">{iss.theme.toUpperCase()}</span>
        </div>
      </div>
      <div className="pcard-meta">
        <div style={{display:"flex", alignItems:"baseline", gap:10}}>
          <span className="mono pcard-num">No. {iss.n < 0 ? "0" + Math.abs(iss.n) : String(iss.n).padStart(2,"0")}</span>
          <span className="mono pcard-date">{iss.date}</span>
        </div>
        <div className="serif pcard-title">{iss.title}<span style={{color:"var(--gray-400)"}}>.</span></div>
        <div className="pcard-arr mono">
          <span>Open issue</span>
          <span className="arr">→</span>
        </div>
      </div>
    </a>
  );
}

function LandscapeCard({ iss, idx, ornaments }) {
  const palClass = "pal-" + iss.palette;
  return (
    <a href="#" className="lcard">
      <div className={"lcard-cover " + palClass}>
        <div className="lcard-numeral serif">{iss.roman}</div>
        <div className="lcard-overlay">
          {ornaments !== "minimal" && (
            <div className="mono lcard-top">
              <span>Routure · No. {iss.n < 0 ? "0" + Math.abs(iss.n) : String(iss.n).padStart(2,"0")}</span>
              <span className="tick" style={{opacity:.5}}>/</span>
              <span style={{opacity:.7}}>{iss.date.toUpperCase()}</span>
            </div>
          )}
          <div className="lcard-title-block">
            <span className="mono" style={{fontSize:10, letterSpacing:".3em", textTransform:"uppercase", color:"rgba(255,255,255,.6)"}}>The Issue</span>
            <span className="serif lcard-title">{iss.title}<span style={{color:"rgba(255,255,255,.35)"}}>.</span></span>
            <span className="serif lcard-theme">On {iss.theme.toLowerCase()}</span>
          </div>
          <div className="lcard-bottom">
            <span className="mono">Open →</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function ArchiveList({ issues, ornaments }) {
  return (
    <div className="archive-list">
      <div className="archive-list-head">
        <span className="mono">No.</span>
        <span className="mono">Issue</span>
        <span className="mono">Theme</span>
        <span className="mono">Dated</span>
        <span/>
      </div>
      {issues.map((iss) => (
        <a key={iss.title} href="#" className="archive-row">
          <span className="mono archive-num">{iss.n < 0 ? "0" + Math.abs(iss.n) : String(iss.n).padStart(2,"0")}</span>
          <div className="archive-title-wrap">
            <span className="serif archive-title">{iss.title}<span style={{color:"var(--gray-400)"}}>.</span></span>
            <span className="mono archive-roman">{iss.roman}</span>
          </div>
          <span className="serif archive-theme">On {iss.theme.toLowerCase()}</span>
          <span className="mono archive-date">{iss.date}</span>
          <span className="archive-leader" aria-hidden/>
          <span className="mono archive-arr">Open →</span>
        </a>
      ))}
    </div>
  );
}

/* =========================================================
   Editorial ribbon — thin strip (only when toggled on)
   ========================================================= */
function Ribbon() {
  const items = [
    { l: "Letter", t: "From the editors, on softness", a: "The Desk" },
    { l: "Essay",  t: "The long quiet of the second city", a: "R. Okafor" },
    { l: "Shop",   t: "Print editions · Issue 02", a: "Routure Press" },
  ];
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"24px 40px 64px"}}>
      <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:20}}>
        <div className="eyebrow">Desk Matter</div>
        <div style={{flex:1, height:1, background:"var(--rule)"}}/>
      </div>
      <div className="ribbon">
        {items.map((it,i)=>(
          <a key={i} href="#" className="ribbon-cell">
            <span className="mono ribbon-l">{it.l}</span>
            <span className="serif ribbon-t">{it.t}</span>
            <span className="mono ribbon-a">{it.a} <span className="arr">→</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function Footer() {
  return (
    <footer style={{background:"#000", color:"#fff", marginTop:32}}>
      <div style={{maxWidth:1440, margin:"0 auto", padding:"72px 40px 40px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:48, marginBottom:64}}>
          <div>
            <div className="serif" style={{fontSize:64, fontStyle:"italic", fontWeight:600, letterSpacing:"-0.035em", lineHeight:.92}}>
              Routure<span style={{color:"rgba(255,255,255,.4)"}}>.</span>
            </div>
            <div className="mono" style={{fontSize:10, letterSpacing:".26em", textTransform:"uppercase", color:"rgba(255,255,255,.55)", marginTop:18}}>
              A field guide to the quiet
            </div>
          </div>
          <FooterCol title="Read" items={["Latest issue","Archive","Shop","Community"]}/>
          <FooterCol title="Desk" items={["Letters","Masthead","Submissions","Press"]}/>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:28, borderTop:"1px solid rgba(255,255,255,.12)", flexWrap:"wrap", gap:16}}>
          <span className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"rgba(255,255,255,.55)"}}>
            © Routure {LATEST.date}
          </span>
          <span className="serif" style={{fontSize:14, fontStyle:"italic", color:"rgba(255,255,255,.45)"}}>
            Set in Cormorant Garamond, Geist, and IBM Plex Mono.
          </span>
          <span className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"rgba(255,255,255,.55)"}}>
            Published {LATEST.published}
          </span>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }) {
  return (
    <div>
      <div className="mono" style={{fontSize:10, letterSpacing:".26em", textTransform:"uppercase", color:"rgba(255,255,255,.55)", marginBottom:22}}>{title}</div>
      <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:14}}>
        {items.map(i=>(
          <li key={i}><a href="#" className="serif" style={{fontSize:18, color:"#fff", fontStyle:"italic", fontWeight:500}}>{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   App
   ========================================================= */
function App() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(false);

  // Host protocol
  useEffect(()=>{
    const onMsg = (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "__activate_edit_mode") setPanelOpen(true);
      if (d.type === "__deactivate_edit_mode") setPanelOpen(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({type:"__edit_mode_available"}, "*"); } catch(_){}
    return ()=>window.removeEventListener("message", onMsg);
  }, []);

  const closePanel = () => {
    setPanelOpen(false);
    try { window.parent.postMessage({type:"__edit_mode_dismissed"}, "*"); } catch(_){}
  };

  // Apply density/ornament variables globally
  const cssVars = {
    "--shelf-gap": t.density === "compact" ? "16px" : t.density === "spacious" ? "40px" : "24px",
    "--row-pad":   t.density === "compact" ? "14px" : t.density === "spacious" ? "28px" : "20px",
    "--ornaments": t.ornaments,
  };

  return (
    <div style={cssVars} data-ornaments={t.ornaments}>
      <Header/>
      <SpineTicker ornaments={t.ornaments}/>
      <PageMasthead ornaments={t.ornaments}/>
      <LatestHero heroLayout={t.heroLayout} ornaments={t.ornaments}/>
      <Archive cardStyle={t.cardStyle} density={t.density} ornaments={t.ornaments}/>
      {t.showRibbon && <Ribbon/>}
      <Footer/>

      <TweaksPanel t={t} setT={setT} open={panelOpen} onClose={closePanel}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
