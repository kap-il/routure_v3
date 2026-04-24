/* Routure — Issue View (polish pass)
   Source ref: app/issue/[slug]/page.tsx, components/issues/mosaic/*
   Inherits palette & type system; changes are compositional + typographic.
*/
const { useState, useEffect, useMemo, useRef } = React;

const ISSUE = {
  title: "Cosmic",
  number: 2,
  date: "Spring 2026",
  tagline: "On distance, softness, and the long quiet after light.",
  photoCount: 24,
  articleCount: 6,
  shootCount: 5,
  editors: ["Mira Halberg", "R. Okafor", "Hana Chen"],
  cover: "cover",
};

const EDITORIAL_ITEMS = [
  { id: "toc",     ico: "◫", title: "Table of Contents",    type: "toc" },
  { id: "letter",  ico: "✉", title: "Letter from the Board", type: "letter" },
  { id: "colophon",ico: "§", title: "Colophon",              type: "colophon" },
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

/* Generate mock images: 24 frames across 5 shoots. */
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
        shootTitle: s.title,
        hasArticle: s.hasArticle,
        articleTitle: s.article,
        articleCategory: s.category,
        isFirstInShoot: i === 0,
        isCover: si === 0 && i === 0,
        issuePosition: ++pos,
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
   Header (same wordmark as home)
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
      background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,1)",
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
              <a key={n} href="#" className="mono"
                 style={{fontSize:11, letterSpacing:".22em", textTransform:"uppercase", color:"var(--ink)"}}>{n}</a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Issue hero header — refined
   ========================================================= */
function IssueHeader() {
  const n = String(ISSUE.number).padStart(2,"0");
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"72px 40px 40px"}}>
      {/* Top meta strip */}
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:24, marginBottom:56}}>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)"}}>
          Volume II · {ISSUE.date}
        </div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"var(--ink)"}}>
          Issue · No. {n}
        </div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)", textAlign:"right"}}>
          {ISSUE.photoCount} frames · {ISSUE.articleCount} articles
        </div>
      </div>
      <div className="hairline-ink" style={{marginBottom:56}} />

      {/* Title block */}
      <div style={{display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0, 1fr)", gap:72, alignItems:"end"}}>
        <div>
          <div className="eyebrow" style={{marginBottom:24}}>The Issue</div>
          <h1 style={{
            fontSize:"clamp(96px, 13vw, 180px)", lineHeight:.86, letterSpacing:"-0.04em",
            color:"var(--ink)", fontWeight:600, textTransform:"uppercase", fontStyle:"italic"
          }}>
            {ISSUE.title}
          </h1>
        </div>
        <div style={{paddingBottom:20}}>
          <p className="serif" style={{fontSize:26, lineHeight:1.35, color:"var(--gray-700)", fontStyle:"italic", maxWidth:"34ch", margin:"0 0 32px"}}>
            {ISSUE.tagline}
          </p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:28, maxWidth:480}}>
            <Meta label="Photographs" value={String(ISSUE.photoCount).padStart(2,"0")} />
            <Meta label="Articles"    value={String(ISSUE.articleCount).padStart(2,"0")} />
            <Meta label="Shoots"      value={String(ISSUE.shootCount).padStart(2,"0")} />
          </div>
        </div>
      </div>

      <div className="hairline" style={{marginTop:56}} />
    </section>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="mono" style={{fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)", marginBottom:8}}>{label}</div>
      <div className="serif" style={{fontSize:30, fontWeight:600, color:"var(--ink)", lineHeight:1}}>{value}</div>
    </div>
  );
}

/* =========================================================
   Editorial strip — TOC / Letter / Colophon
   ========================================================= */
function EditorialRow() {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"0 40px 48px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:16}}>
        <div className="eyebrow">Front Matter</div>
        <a href="#" className="readmore">Letters from the Creators <span className="arrow">→</span></a>
      </div>
      <div style={{display:"flex", flexWrap:"wrap", gap:12}}>
        {EDITORIAL_ITEMS.map(e=>(
          <a key={e.id} href="#" className="editorial-chip">
            <span className="ico">{e.ico}</span>
            <span className="ttl">{e.title}</span>
            <span className="arr">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Mosaic tile (polished version of MosaicTile.tsx)
   ========================================================= */
function MosaicTile({ image }) {
  const label = `${image.articleCategory.toUpperCase()} · FRAME ${String(image.issuePosition).padStart(2,"0")}`;
  return (
    <a href="#" className="mtile" style={{aspectRatio: image.aspectRatio}}>
      <div className="ph placeholder">
        <span style={{position:"absolute", inset:0, display:"grid", placeItems:"center"}}>
          <span className="serif" style={{fontSize: Math.min(120, 28 + image.aspectRatio*40), fontStyle:"italic", color:"rgba(255,255,255,.05)"}}>
            R
          </span>
        </span>
      </div>
      <span className="num-stamp">{String(image.issuePosition).padStart(2,"0")}</span>

      {image.hasArticle && !image.isCover && !image.isFirstInShoot && (
        <span className="art-dot">
          <span style={{width:5, height:5, borderRadius:"50%", background:"#fff"}}/>
          Article
        </span>
      )}

      <span className="zoom">⌕</span>

      <div className="hover-veil">
        {!image.isCover && image.hasArticle && image.articleTitle && (
          <div className="hover-text">“{image.articleTitle}”</div>
        )}
        {!image.isCover && (
          <div className="hover-btn">{image.hasArticle ? "Read More" : "View Shoot"}</div>
        )}
      </div>

      {image.isFirstInShoot && !image.isCover && (
        <div className="shoot-bar">
          <span className="t">{image.shootTitle}</span>
          {image.hasArticle && image.articleTitle && (
            <span className="f">/ Feature: {image.articleTitle}</span>
          )}
        </div>
      )}
    </a>
  );
}

/* =========================================================
   Mosaic grid — uses the same row pattern logic
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
   Scroll progress rail (right side)
   ========================================================= */
function ScrollRail({ count }) {
  const [pct, setPct] = useState(0);
  useEffect(()=>{
    const h = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(Math.min(1, Math.max(0, window.scrollY / Math.max(1,max))));
    };
    h(); window.addEventListener("scroll", h, {passive:true});
    return ()=>window.removeEventListener("scroll", h);
  },[]);
  const n = 8;
  const active = Math.round(pct * (n-1));
  return (
    <div style={{position:"fixed", right:22, top:"50%", transform:"translateY(-50%)", zIndex:20}}>
      <div className="mono" style={{fontSize:9.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)", writingMode:"vertical-rl", marginBottom:14, transform:"rotate(180deg)"}}>
        {String(Math.round(pct*100)).padStart(2,"0")}%
      </div>
      <div className="dotcol">
        {Array.from({length:n}).map((_,i)=>(
          <span key={i} className={"dot" + (i<=active ? " on" : "")}/>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Legend
   ========================================================= */
function Legend() {
  return (
    <section style={{maxWidth:1280, margin:"0 auto", padding:"56px 40px 16px"}}>
      <div className="hairline" style={{marginBottom:32}}/>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:32}}>
        <LegendRow swatch="bar" text="Shoot title bar — anchors the first frame of each shoot; the italic fragment after the slash marks an attached feature article." />
        <LegendRow swatch="dot" text="Article badge — any frame with this marker opens the attached essay. Un-marked frames open the shoot concept view." />
      </div>
      <div className="hairline" style={{marginTop:56}}/>
    </section>
  );
}

function LegendRow({ swatch, text }) {
  return (
    <div style={{display:"flex", alignItems:"flex-start", gap:16}}>
      <div style={{flexShrink:0, width:58, height:24, display:"grid", placeItems:"center"}}>
        {swatch === "bar" ? (
          <div style={{width:58, height:14, background:"rgba(17,17,17,.88)", borderRadius:2}}/>
        ) : (
          <div style={{display:"flex", alignItems:"center", gap:6, padding:"4px 8px", background:"rgba(17,17,17,.88)", borderRadius:999, color:"#fff", fontFamily:"var(--mono)", fontSize:8, letterSpacing:".2em"}}>
            <span style={{width:4, height:4, borderRadius:"50%", background:"#fff"}}/>
            ART
          </div>
        )}
      </div>
      <p className="serif" style={{margin:0, fontSize:15, lineHeight:1.55, color:"var(--gray-700)", fontStyle:"italic", maxWidth:"56ch"}}>
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   Footer — minimal issue-context footer
   ========================================================= */
function FooterIssue() {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"16px 40px 96px"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:24, alignItems:"center"}}>
        <a href="#" className="back"><span className="arr">←</span> Previous · No. 01 Savour</a>
        <div className="mono" style={{fontSize:10, letterSpacing:".28em", textTransform:"uppercase", color:"var(--gray-500)", textAlign:"center"}}>
          End of Issue No. 02
        </div>
        <a href="#" className="back" style={{justifyContent:"flex-end"}}>Back to top <span className="arr" style={{transform:"rotate(90deg)"}}>→</span></a>
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
        <div style={{marginBottom:16, display:"flex", justifyContent:"flex-end"}}>
          <span className="mono" style={{fontSize:9.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-400)"}}>
            Click any frame to view · ⌕ zoom
          </span>
        </div>
        <MosaicGrid images={images} gap={20}/>
      </div>

      <Legend/>
      <FooterIssue/>
      <ScrollRail count={images.length}/>

      <button className="toc-fab" onClick={()=>setTocOpen(!tocOpen)}>
        ◫ Contents
      </button>

      {tocOpen && (
        <div onClick={()=>setTocOpen(false)} style={{
          position:"fixed", inset:0, zIndex:50, background:"rgba(10,10,10,.58)",
          backdropFilter:"blur(6px)", display:"flex", justifyContent:"flex-end"
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:"min(520px, 92vw)", height:"100%", background:"var(--bg)", padding:"48px 44px", overflowY:"auto"
          }}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32}}>
              <div className="eyebrow">Contents · No. 02</div>
              <button onClick={()=>setTocOpen(false)} style={{border:"none", background:"none", fontSize:22, cursor:"pointer", color:"var(--gray-500)"}}>✕</button>
            </div>
            <h2 style={{fontSize:54, lineHeight:1, letterSpacing:"-0.02em", color:"var(--ink)", marginBottom:32, textTransform:"uppercase", fontStyle:"italic"}}>Cosmic</h2>
            <div className="hairline" style={{marginBottom:24}}/>
            {[
              {n:"I",   t:"The Weight of Soft Things", c:"Architecture", p:"03"},
              {n:"II",  t:"The Long Quiet",             c:"Sustainability", p:"08"},
              {n:"III", t:"Clouds, slowly, from Taipei",c:"Field Note", p:"13"},
              {n:"IV",  t:"The Second City",            c:"Community", p:"17"},
              {n:"V",   t:"Notes from Naoshima",        c:"Experimentalism", p:"22"},
            ].map(s=>(
              <a key={s.n} href="#" style={{display:"grid", gridTemplateColumns:"28px 1fr auto", gap:18, alignItems:"baseline", padding:"18px 0", borderBottom:"1px solid var(--gray-100)"}}>
                <span className="mono" style={{fontSize:10, letterSpacing:".2em", color:"var(--gray-400)"}}>{s.n}</span>
                <div>
                  <div className="serif" style={{fontSize:22, fontWeight:600, color:"var(--ink)", lineHeight:1.15}}>{s.t}</div>
                  <div className="mono" style={{fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)", marginTop:6}}>{s.c}</div>
                </div>
                <span className="mono" style={{fontSize:10, letterSpacing:".2em", color:"var(--gray-400)"}}>p. {s.p}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
