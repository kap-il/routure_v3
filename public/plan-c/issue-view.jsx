/* Routure — Issue View (editorial polish pass, v2)
   Same structural decisions as v1. Tightened type, stronger hierarchy,
   more confident micro-interactions.
*/
const { useState, useEffect, useMemo, useRef } = React;

const ISSUE = {
  title: "Cosmic",
  number: 2,
  volume: "II",
  date: "Spring 2026",
  published: "04.23.2026",
  tagline: "On distance, softness, and the long quiet after light.",
  standfirst:
    "Five shoots and six essays gathered under one word. Read it as a field guide to the small, unhurried things that survive after the loud ones pass.",
  photoCount: 24,
  articleCount: 6,
  shootCount: 5,
  editors: [
    { name: "Mira Halberg",  role: "Editor-in-Chief" },
    { name: "R. Okafor",     role: "Art Director" },
    { name: "Hana Chen",     role: "Photo Editor" },
  ],
};

const EDITORIAL_ITEMS = [
  { id: "toc",      ico: "◫", title: "Table of Contents",     meta: "05 entries" },
  { id: "letter",   ico: "✉", title: "Letter from the Board", meta: "640 words" },
  { id: "colophon", ico: "§", title: "Colophon",              meta: "Masthead" },
];

/* Mirror MosaicGrid row pattern: full → 3 → 2 → full → 2 → 3 → 2 → full */
const PATTERN = [
  { type:"full",  count:1 },
  { type:"three", count:3 },
  { type:"two",   count:2 },
  { type:"full",  count:1 },
  { type:"two",   count:2 },
  { type:"three", count:3 },
  { type:"two",   count:2 },
  { type:"full",  count:1 },
];

function makeImages() {
  const shoots = [
    { id:"weight-soft",   title:"The Weight of Soft Things",  article:"On quiet rooms and the architecture of pause", hasArticle:true,  category:"Architecture" },
    { id:"long-quiet",    title:"The Long Quiet",              article:"A studio that refuses the grid",              hasArticle:true,  category:"Sustainability" },
    { id:"clouds-taipei", title:"Clouds, slowly, from Taipei", article:null,                                          hasArticle:false, category:"Field Note" },
    { id:"second-city",   title:"The Second City",             article:"The long quiet of the second city",           hasArticle:true,  category:"Community" },
    { id:"naoshima",      title:"Notes from Naoshima",         article:null,                                          hasArticle:false, category:"Experimentalism" },
  ];
  const ARS = [1.5, 0.75, 1.0, 1.33, 0.8, 1.6, 1.2, 0.9];
  const images = [];
  let pos = 0;
  shoots.forEach((s, si) => {
    const frames = [5,5,4,5,5][si];
    for (let i=0; i<frames; i++) {
      images.push({
        id: `${s.id}-${i}`,
        aspectRatio: ARS[(si*3 + i) % ARS.length],
        shootId: s.id,
        shootSlug: s.id.replace(/-/g, " ").toUpperCase(),
        shootTitle: s.title,
        hasArticle: s.hasArticle,
        articleTitle: s.article,
        articleCategory: s.category,
        isFirstInShoot: i === 0,
        isCover: si === 0 && i === 0,
        issuePosition: ++pos,
        shootIndex: si + 1,
        frameInShoot: i + 1,
        totalInShoot: frames,
      });
    }
  });
  return images;
}

function buildRows(images) {
  const rows = []; let cursor = 0; let p = 0;
  while (cursor < images.length) {
    const pat = PATTERN[p % PATTERN.length];
    const remaining = images.length - cursor;
    const count = Math.min(pat.count, remaining);
    const type = count === 1 ? "full" : count === 2 ? "two" : "three";
    rows.push({ type, images: images.slice(cursor, cursor+count) });
    cursor += count; p++;
  }
  return rows;
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
          <a href="#" className="back">
            <span className="arr">←</span> All Issues
          </a>
          <a href="#" style={{fontFamily:"var(--serif)", fontWeight:600, fontSize:26, letterSpacing:"-0.02em", color:"var(--ink)"}}>Routure</a>
          <nav style={{display:"flex", gap:28, alignItems:"center"}}>
            {["Issues","Shop","Community"].map(n=>(
              <a key={n} href="#" className="navlink mono">
                {n}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Issue hero — folio, wordmark, standfirst, meta column
   ========================================================= */
function IssueHeader() {
  const n = String(ISSUE.number).padStart(2,"0");
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"64px 40px 32px"}}>
      {/* Folio line — three column mono strip */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center",
        gap:24, marginBottom:40,
      }}>
        <div className="mono folio">
          <span>Vol. {ISSUE.volume}</span>
          <span className="tick">/</span>
          <span>{ISSUE.date}</span>
        </div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".32em", textTransform:"uppercase", color:"var(--ink)"}}>
          Routure · No. {n}
        </div>
        <div className="mono folio" style={{justifyContent:"flex-end"}}>
          <span>{ISSUE.photoCount} frames</span>
          <span className="tick">/</span>
          <span>{ISSUE.articleCount} essays</span>
          <span className="tick">/</span>
          <span>{ISSUE.shootCount} shoots</span>
        </div>
      </div>

      <div className="hairline-ink" style={{marginBottom:48}} />

      {/* Title + meta split */}
      <div style={{display:"grid", gridTemplateColumns:"minmax(0,1.35fr) minmax(0,1fr)", gap:72, alignItems:"end"}}>
        <div>
          <div className="eyebrow" style={{marginBottom:28}}>The {ISSUE.volume}<sup style={{fontSize:7, marginLeft:2, letterSpacing:0}}>ND</sup> Issue · Published {ISSUE.published}</div>
          <h1 style={{
            fontSize:"clamp(96px, 14vw, 200px)",
            lineHeight:.84,
            letterSpacing:"-0.045em",
            color:"var(--ink)",
            fontWeight:600,
            textTransform:"uppercase",
            fontStyle:"italic",
            margin:0,
          }}>
            {ISSUE.title}<span style={{color:"var(--gray-400)", fontStyle:"italic", marginLeft:".06em"}}>.</span>
          </h1>
          <div style={{marginTop:28, display:"flex", alignItems:"center", gap:14}}>
            <div style={{height:1, background:"var(--ink)", flex:"0 0 56px"}}/>
            <span className="mono" style={{fontSize:10, letterSpacing:".28em", textTransform:"uppercase", color:"var(--gray-700)"}}>
              A field guide to the quiet
            </span>
          </div>
        </div>

        <div style={{paddingBottom:8}}>
          <p className="serif standfirst" style={{margin:"0 0 28px"}}>
            <span style={{
              float:"left", fontFamily:"var(--serif)", fontSize:64, lineHeight:.82,
              marginRight:8, marginTop:6, color:"var(--ink)", fontWeight:600, fontStyle:"italic",
            }}>{ISSUE.tagline.charAt(0)}</span>
            {ISSUE.tagline.slice(1)}
          </p>
          <p className="serif" style={{fontSize:16, lineHeight:1.6, color:"var(--gray-700)", margin:"0 0 32px", maxWidth:"46ch"}}>
            {ISSUE.standfirst}
          </p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24, maxWidth:440}}>
            <Meta label="Photographs" value={String(ISSUE.photoCount).padStart(2,"0")} />
            <Meta label="Essays"      value={String(ISSUE.articleCount).padStart(2,"0")} />
            <Meta label="Shoots"      value={String(ISSUE.shootCount).padStart(2,"0")} />
          </div>
        </div>
      </div>

      {/* Masthead row */}
      <div style={{
        display:"grid", gridTemplateColumns:"auto 1fr auto", gap:32, alignItems:"center",
        marginTop:64, paddingTop:24, borderTop:"1px solid var(--rule)",
      }}>
        <div className="eyebrow">Masthead</div>
        <div style={{display:"flex", flexWrap:"wrap", gap:"8px 28px"}}>
          {ISSUE.editors.map((e,i)=>(
            <div key={i} style={{display:"inline-flex", alignItems:"baseline", gap:10}}>
              <span className="serif" style={{fontSize:15, color:"var(--ink)", fontWeight:600}}>{e.name}</span>
              <span className="mono" style={{fontSize:9.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)"}}>{e.role}</span>
            </div>
          ))}
        </div>
        <a href="#" className="readmore">Full colophon <span className="arrow">→</span></a>
      </div>
    </section>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)", marginBottom:10}}>{label}</div>
      <div className="serif" style={{fontSize:34, fontWeight:600, color:"var(--ink)", lineHeight:1, fontFeatureSettings:'"lnum" 1'}}>{value}</div>
    </div>
  );
}

/* =========================================================
   Editorial strip — TOC / Letter / Colophon
   ========================================================= */
function EditorialRow() {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"32px 40px 56px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20, flexWrap:"wrap", gap:16}}>
        <div className="eyebrow">Front Matter · 01 – 03</div>
        <a href="#" className="readmore">Letters from the creators <span className="arrow">→</span></a>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:0, border:"1px solid var(--rule)", borderRadius:2, background:"#fff"}}>
        {EDITORIAL_ITEMS.map((e,i)=>(
          <a key={e.id} href="#" className="editorial-chip" style={{borderLeft: i===0 ? "none" : "1px solid var(--rule)"}}>
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <span className="ico">{e.ico}</span>
              <span className="ttl">{e.title}</span>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:16}}>
              <span className="meta">{e.meta}</span>
              <span className="arr">→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Mosaic tile
   ========================================================= */
function MosaicTile({ image }) {
  const pos = String(image.issuePosition).padStart(2,"0");
  const shootPos = `SHOOT ${String(image.shootIndex).padStart(2,"0")} · FRAME ${String(image.frameInShoot).padStart(2,"0")}/${String(image.totalInShoot).padStart(2,"0")}`;
  return (
    <a href="#" className="mtile" style={{aspectRatio: image.aspectRatio}}>
      <div className="ph placeholder">
        {/* Corner stamps */}
        <span className="corner tl mono">
          <span>F.{pos}</span>
          <span className="tick" style={{opacity:.4}}>/</span>
          <span style={{opacity:.55}}>{image.articleCategory.toUpperCase()}</span>
        </span>
        <span className="corner tr mono">
          <span style={{opacity:.5}}>AR</span> {image.aspectRatio.toFixed(2)}
        </span>
        {/* Large italic numeral watermark */}
        <span style={{
          position:"absolute", inset:0, display:"grid", placeItems:"center", pointerEvents:"none",
        }}>
          <span className="serif" style={{
            fontSize: `clamp(80px, ${Math.round(28 + image.aspectRatio*60)}%, 260px)`,
            fontStyle:"italic", fontWeight:500,
            color:"rgba(255,255,255,.055)",
            letterSpacing:"-0.04em",
            lineHeight:1,
          }}>
            {pos}
          </span>
        </span>
        {/* Subtle baseline hint */}
        <span className="corner bl mono">{shootPos}</span>
      </div>

      {image.hasArticle && !image.isCover && !image.isFirstInShoot && (
        <span className="art-dot">
          <span style={{width:5, height:5, borderRadius:"50%", background:"#fff"}}/>
          Essay attached
        </span>
      )}

      <span className="zoom" aria-hidden>⌕</span>

      <div className="hover-veil">
        {!image.isCover && image.hasArticle && image.articleTitle && (
          <div className="hover-text">“{image.articleTitle}”</div>
        )}
        {!image.isCover && (
          <div className="hover-btn">
            <span>{image.hasArticle ? "Read Essay" : "View Shoot"}</span>
            <span className="btn-arr">→</span>
          </div>
        )}
      </div>

      {image.isFirstInShoot && !image.isCover && (
        <div className="shoot-bar">
          <span className="shoot-idx mono">SHOOT {String(image.shootIndex).padStart(2,"0")}</span>
          <span className="t">{image.shootTitle}</span>
          {image.hasArticle && image.articleTitle && (
            <span className="f">/ Feature: {image.articleTitle}</span>
          )}
        </div>
      )}

      {image.isCover && (
        <div className="cover-strap">
          <span className="mono" style={{fontSize:10, letterSpacing:".3em", textTransform:"uppercase", opacity:.65}}>The Cover · No. 02</span>
          <span className="serif" style={{fontSize:28, fontStyle:"italic", fontWeight:500, color:"#fff", marginTop:8, lineHeight:1.15}}>
            “{ISSUE.tagline}”
          </span>
        </div>
      )}
    </a>
  );
}

/* =========================================================
   Mosaic grid
   ========================================================= */
function MosaicGrid({ images, gap = 20 }) {
  const rows = useMemo(() => buildRows(images), [images]);
  return (
    <div style={{display:"flex", flexDirection:"column", gap}}>
      {rows.map((row, ri) => {
        if (row.type === "full") {
          return <MosaicTile key={ri} image={row.images[0]} />;
        }
        const totalAR = row.images.reduce((s,i)=>s+i.aspectRatio, 0);
        return (
          <div key={ri} style={{display:"flex", gap}}>
            {row.images.map(img => (
              <div key={img.id} style={{width:`${(img.aspectRatio/totalAR)*100}%`}}>
                <MosaicTile image={img} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   Mosaic scroll ruler — numeric frame counter + ticks
   ========================================================= */
function ScrollRail({ total }) {
  const [pct, setPct] = useState(0);
  useEffect(()=>{
    const h = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(Math.min(1, Math.max(0, window.scrollY / Math.max(1,max))));
    };
    h(); window.addEventListener("scroll", h, {passive:true});
    return ()=>window.removeEventListener("scroll", h);
  },[]);
  const ticks = 16;
  const active = pct * ticks;
  const frame = Math.min(total, Math.max(1, Math.round(pct * total) || 1));
  return (
    <div className="scroll-rail">
      <div className="rail-label mono">
        <span>Frame</span>
        <span className="rail-num serif">{String(frame).padStart(2,"0")}</span>
        <span>/ {String(total).padStart(2,"0")}</span>
      </div>
      <div className="rail-ticks">
        {Array.from({length:ticks}).map((_,i)=>(
          <span key={i} className={"rt" + (i < active ? " on" : "") + (i % 4 === 0 ? " major" : "")}/>
        ))}
      </div>
      <div className="rail-pct mono">{String(Math.round(pct*100)).padStart(2,"0")}%</div>
    </div>
  );
}

/* =========================================================
   Legend
   ========================================================= */
function Legend() {
  return (
    <section style={{maxWidth:1280, margin:"0 auto", padding:"64px 40px 16px"}}>
      <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:24}}>
        <div className="eyebrow">How to read the grid</div>
        <div style={{flex:1, height:1, background:"var(--rule)"}}/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:32}}>
        <LegendRow swatch="bar" text="Shoot title bar — anchors the first frame of each shoot. The italic fragment after the slash marks an attached feature essay." />
        <LegendRow swatch="dot" text="Essay badge — any frame with this marker opens the attached piece. Un-marked frames open the shoot concept view." />
      </div>
      <div className="hairline" style={{marginTop:56}}/>
    </section>
  );
}

function LegendRow({ swatch, text }) {
  return (
    <div style={{display:"flex", alignItems:"flex-start", gap:20}}>
      <div style={{flexShrink:0, width:90, display:"grid", placeItems:"flex-start"}}>
        {swatch === "bar" ? (
          <div style={{width:90, height:20, background:"rgba(17,17,17,.9)", borderRadius:2, display:"flex", alignItems:"center", padding:"0 6px"}}>
            <span className="mono" style={{fontSize:7, letterSpacing:".2em", color:"rgba(255,255,255,.65)"}}>SHOOT</span>
          </div>
        ) : (
          <div style={{display:"inline-flex", alignItems:"center", gap:6, padding:"5px 10px", background:"rgba(17,17,17,.9)", borderRadius:999, color:"#fff", fontFamily:"var(--mono)", fontSize:8, letterSpacing:".22em"}}>
            <span style={{width:4, height:4, borderRadius:"50%", background:"#fff"}}/>
            ESSAY
          </div>
        )}
      </div>
      <p className="serif" style={{margin:0, fontSize:15, lineHeight:1.6, color:"var(--gray-700)", fontStyle:"italic", maxWidth:"56ch"}}>
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function FooterIssue() {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"16px 40px 32px"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:24, alignItems:"center"}}>
        <a href="#" className="nav-prev">
          <span className="arr">←</span>
          <span style={{display:"flex", flexDirection:"column", gap:4}}>
            <span className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)"}}>Previous Issue · No. 01</span>
            <span className="serif" style={{fontSize:22, fontStyle:"italic", fontWeight:500, color:"var(--ink)"}}>Savour</span>
          </span>
        </a>
        <div className="mono" style={{fontSize:9.5, letterSpacing:".32em", textTransform:"uppercase", color:"var(--gray-500)", textAlign:"center"}}>
          End of Issue · No. 02
        </div>
        <a href="#" className="nav-next" style={{justifySelf:"flex-end"}}>
          <span style={{display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end"}}>
            <span className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)"}}>Return to top</span>
            <span className="serif" style={{fontSize:22, fontStyle:"italic", fontWeight:500, color:"var(--ink)"}}>Cosmic, from the start</span>
          </span>
          <span className="arr">↑</span>
        </a>
      </div>

      {/* Colophon strap */}
      <div className="hairline" style={{margin:"56px 0 28px"}}/>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:24}}>
        <span className="mono" style={{fontSize:9.5, letterSpacing:".28em", textTransform:"uppercase", color:"var(--gray-500)"}}>
          © Routure Magazine · {ISSUE.date}
        </span>
        <span className="serif" style={{fontSize:14, fontStyle:"italic", color:"var(--gray-500)"}}>
          Set in Cormorant Garamond, Geist, and IBM Plex Mono.
        </span>
        <span className="mono" style={{fontSize:9.5, letterSpacing:".28em", textTransform:"uppercase", color:"var(--gray-500)", textAlign:"right"}}>
          Published {ISSUE.published}
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   App
   ========================================================= */
function App() {
  const images = useMemo(makeImages, []);
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div>
      <Header/>
      <IssueHeader/>
      <EditorialRow/>

      <div style={{maxWidth:1440, margin:"0 auto", padding:"0 40px", position:"relative"}}>
        <div style={{marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:16}}>
          <div className="eyebrow">The Mosaic · {ISSUE.photoCount} frames</div>
          <span className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)"}}>
            Click any frame to view · ⌕ zoom
          </span>
        </div>
        <MosaicGrid images={images} gap={20}/>
      </div>

      <Legend/>
      <FooterIssue/>
      <ScrollRail total={images.length}/>

      <button className="toc-fab" onClick={()=>setTocOpen(!tocOpen)}>
        <span style={{fontSize:13, lineHeight:1}}>◫</span>
        <span>Contents</span>
      </button>

      {tocOpen && (
        <div onClick={()=>setTocOpen(false)} style={{
          position:"fixed", inset:0, zIndex:50, background:"rgba(10,10,10,.58)",
          backdropFilter:"blur(6px)", display:"flex", justifyContent:"flex-end",
          animation:"tocFade .25s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} className="toc-drawer">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40}}>
              <div className="eyebrow">Contents · Issue No. 02</div>
              <button onClick={()=>setTocOpen(false)} className="toc-close">Close ✕</button>
            </div>

            <div className="mono" style={{fontSize:10, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)", marginBottom:8}}>Volume {ISSUE.volume} · {ISSUE.date}</div>
            <h2 style={{fontSize:72, lineHeight:.86, letterSpacing:"-0.035em", color:"var(--ink)", margin:"4px 0 40px", textTransform:"uppercase", fontStyle:"italic", fontFamily:"var(--serif)", fontWeight:600}}>
              Cosmic<span style={{color:"var(--gray-400)"}}>.</span>
            </h2>
            <div className="hairline-ink" style={{marginBottom:8}}/>
            {[
              {n:"I",   t:"The Weight of Soft Things", c:"Architecture",     p:"03", kind:"Essay + Shoot"},
              {n:"II",  t:"The Long Quiet",             c:"Sustainability",   p:"08", kind:"Essay + Shoot"},
              {n:"III", t:"Clouds, slowly, from Taipei",c:"Field Note",       p:"13", kind:"Shoot"},
              {n:"IV",  t:"The Second City",            c:"Community",        p:"17", kind:"Essay + Shoot"},
              {n:"V",   t:"Notes from Naoshima",        c:"Experimentalism",  p:"22", kind:"Shoot"},
            ].map(s=>(
              <a key={s.n} href="#" className="toc-row">
                <span className="toc-num mono">{s.n}</span>
                <div>
                  <div className="serif toc-title">{s.t}</div>
                  <div className="mono toc-sub">
                    <span>{s.c}</span>
                    <span className="tick" style={{opacity:.4}}>/</span>
                    <span>{s.kind}</span>
                  </div>
                </div>
                <div className="toc-leader" aria-hidden/>
                <span className="mono toc-page">p.&thinsp;{s.p}</span>
              </a>
            ))}

            <div className="hairline" style={{margin:"32px 0 20px"}}/>
            <div className="mono" style={{fontSize:9.5, letterSpacing:".26em", textTransform:"uppercase", color:"var(--gray-500)"}}>
              {ISSUE.photoCount} frames · {ISSUE.articleCount} essays · {ISSUE.shootCount} shoots
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
