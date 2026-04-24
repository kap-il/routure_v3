/* Routure — Home (polish pass)
   Inherits: palette (#FAFAF8 / #0A0A0A / gray ramp), Cochin-style serif headings, Geist sans, mono eyebrows.
   Changes are purely typographic rhythm, spacing, micro-interactions, and component composition.
*/

const { useState, useEffect, useRef } = React;

/* ---------- Tweak defaults (persisted by host) ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "normal",
  "ruleWeight": "hairline",
  "heroLayout": "split",
  "showEditorialStrip": true,
  "headlineScale": 1,
  "ornaments": "subtle",
  "showTickerRibbon": true
}/*EDITMODE-END*/;

/* ---------- Data (mirrors Supabase shape used in app/page.tsx) ---------- */
const FEATURED_SHOOT = {
  title: "The Weight of Soft Things",
  slug: "weight-of-soft-things",
  imageCount: 24,
  photographer: "Elena Voss",
  location: "Naoshima, JP",
  placeholder: "Featured shoot — editorial hero",
};

const FEATURED_ARTICLE = {
  title: "On quiet rooms and the architecture of pause",
  shootSlug: "weight-of-soft-things",
  author: "Mira Halberg",
  readTime: "8 min",
  category: "Architecture",
  pullquote: "The room, when built right, does not ask you to decorate it. It asks you to arrive.",
};

const LATEST_ISSUE = { title: "Cosmic", slug: "cosmic", issue_number: 2, date: "Spring 2026", placeholder: "Issue 02 — Cosmic" };
const PREV_ISSUE   = { title: "Savour", slug: "savour", issue_number: 1, date: "Autumn 2025", placeholder: "Issue 01 — Savour" };

const CATEGORIES = [
  { name: "Architecture",    count: 14 },
  { name: "Sustainability",  count: 11 },
  { name: "Experimentalism", count:  9 },
  { name: "Commercialism",   count:  7 },
  { name: "Community",       count: 12 },
];

const EDITORIAL = [
  { label: "Essay",     title: "The long quiet of the second city",    author: "R. Okafor",   read: "6 min" },
  { label: "Profile",   title: "A studio that refuses the grid",        author: "Hana Chen",   read: "9 min" },
  { label: "Field Note",title: "Clouds, slowly, from Taipei",           author: "J. Marwan",   read: "4 min" },
  { label: "Letter",    title: "From the editor, on softness",           author: "The Desk",    read: "3 min" },
];

const TICKER = [
  "Issue 02 · Cosmic — now reading",
  "New shoot · The Weight of Soft Things",
  "Letters from the Creators",
  "Subscribe · Spring dispatch",
  "Community · April meet in Berlin",
  "Archive · 01 Savour",
];

/* =========================================================
   Header
   ========================================================= */
function Header({ onMenu }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h = () => setScrolled(window.scrollY > 8);
    h(); window.addEventListener("scroll", h, { passive:true });
    return ()=>window.removeEventListener("scroll", h);
  },[]);
  return (
    <header
      style={{
        position:"sticky", top:0, zIndex:40,
        background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,1)",
        backdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
        borderBottom: "1px solid " + (scrolled ? "var(--rule)" : "transparent"),
        transition:"background .25s ease, border-color .25s ease",
      }}
    >
      <div style={{maxWidth:1440, margin:"0 auto", padding:"0 40px"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", height:72, gap:24}}>
          {/* Left — wordmark */}
          <a href="#top" style={{display:"flex", alignItems:"center", gap:10, flexShrink:0}}>
            <span style={{
              fontFamily:"var(--serif)", fontWeight:600, fontSize:26, letterSpacing:"-0.02em",
              color:"var(--ink)", lineHeight:1
            }}>Routure</span>
          </a>

          {/* Right — nav */}
          <nav style={{display:"flex", justifyContent:"flex-end", gap:28, alignItems:"center", flexWrap:"nowrap"}}>
            {["Issues","Shop","Community"].map(n=>(
              <a key={n} href="#" className="mono"
                 style={{fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--ink)", whiteSpace:"nowrap"}}>{n}</a>
            ))}
            <span style={{width:1, height:12, background:"var(--gray-200)"}} />
            <a href="#newsletter" className="mono"
               style={{fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gray-700)", whiteSpace:"nowrap"}}>
              Subscribe →
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Ticker ribbon
   ========================================================= */
function Ticker({ visible }) {
  if (!visible) return null;
  const items = [...TICKER, ...TICKER];
  return (
    <div style={{
      borderTop:"1px solid var(--rule)",
      borderBottom:"1px solid var(--rule)",
      overflow:"hidden",
      background:"var(--bg)",
    }}>
      <div className="marquee" style={{padding:"10px 0"}}>
        {items.map((t,i)=>(
          <span key={i} className="mono"
                style={{fontSize:10.5, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gray-700)"}}>
            <span style={{display:"inline-block", width:6, height:6, borderRadius:"50%", background:"var(--ink)", marginRight:14, verticalAlign:"middle"}}/>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Masthead — issue dateline strip
   ========================================================= */
function Masthead() {
  const today = new Date("2026-04-23");
  const fmt = today.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  return (
    <div style={{maxWidth:1440, margin:"0 auto", padding:"28px 40px 0"}}>
      <div style={{
        display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:24,
      }}>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gray-500)"}}>
          {fmt}
        </div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"var(--ink)"}}>
          A Curated Magazine Experience
        </div>
        <div className="mono" style={{fontSize:10.5, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gray-500)", textAlign:"right"}}>
          No. 02 · Cosmic
        </div>
      </div>
      <div className="hairline-ink" style={{marginTop:20, height:1}} />
    </div>
  );
}

/* =========================================================
   Placeholder Image — striped editorial filler
   ========================================================= */
function PH({ label, dark = true, style, showLabel = true, children }) {
  return (
    <div className={dark?"placeholder":"placeholder-light"}
         style={{position:"absolute", inset:0, ...style}}>
      {showLabel && <span className={dark?"placeholder-label":"placeholder-label dark"}>{label}</span>}
      {children}
    </div>
  );
}

/* =========================================================
   HERO — Featured Shoot
   ========================================================= */
function Hero({ layout, headlineScale }) {
  const h1Size = Math.round(64 * headlineScale);

  if (layout === "full") {
    return (
      <section style={{maxWidth:1440, margin:"0 auto", padding:"32px 40px 0"}}>
        <div style={{position:"relative", height:640, overflow:"hidden", borderRadius:2}} className="tile">
          <PH label="FEATURED SHOOT · 24 FRAMES · NAOSHIMA, JP" />
          <div style={{position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 40%, rgba(0,0,0,.55) 100%)"}} />
          <div style={{position:"absolute", inset:0, padding:"56px 56px", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <span className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.7)"}}>
                Featured Shoot · 01 / 24
              </span>
              <span className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.7)"}}>
                Photography · {FEATURED_SHOOT.photographer}
              </span>
            </div>
            <div style={{maxWidth:820}}>
              <h1 style={{fontSize:Math.round(84*headlineScale), lineHeight:.98, letterSpacing:"-0.02em", color:"#fff", fontWeight:600, marginBottom:20}}>
                {FEATURED_SHOOT.title}
              </h1>
              <div style={{display:"flex", alignItems:"center", gap:24}}>
                <a href="#" className="btn-ghost">View shoot <span>→</span></a>
                <span className="mono" style={{fontSize:10.5, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.6)"}}>
                  {FEATURED_SHOOT.imageCount} photographs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // split (default)
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"32px 40px 0"}}>
      <div style={{display:"grid", gridTemplateColumns:"minmax(0,1.6fr) minmax(0,1fr)", borderRadius:2, overflow:"hidden", height:560}} className="rise">
        <div style={{position:"relative", overflow:"hidden"}} className="tile">
          <PH label="FEATURED SHOOT · 24 FRAMES" />
          <div style={{position:"absolute", inset:0, background:"linear-gradient(to right, rgba(0,0,0,.28), transparent 40%)"}} />
          <div style={{position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,.8)"}}>
            <span style={{width:8, height:8, borderRadius:"50%", background:"#fff"}}/>
            <span className="mono" style={{fontSize:10, letterSpacing:".28em", textTransform:"uppercase"}}>Now reading</span>
          </div>
        </div>
        <div style={{background:"#0F0E0D", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"44px 48px"}}>
          <div>
            <div className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.5)", marginBottom:28}}>
              Featured Shoot
            </div>
            <h1 style={{fontSize:h1Size, lineHeight:1.02, letterSpacing:"-0.015em", fontWeight:600, color:"#fff", marginBottom:24}}>
              {FEATURED_SHOOT.title}
            </h1>
            <div style={{width:42, height:1, background:"rgba(255,255,255,.35)", marginBottom:22}}/>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:26}}>
              <MetaPair label="Photographer" value={FEATURED_SHOOT.photographer}/>
              <MetaPair label="Location" value={FEATURED_SHOOT.location}/>
              <MetaPair label="Frames" value={String(FEATURED_SHOOT.imageCount).padStart(2,"0")}/>
              <MetaPair label="Issue" value="No. 02"/>
            </div>
          </div>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <a href="#" className="readmore" style={{color:"rgba(255,255,255,.9)"}}>
              View shoot <span className="arrow">→</span>
            </a>
            <div style={{display:"flex", gap:6}}>
              {[0,1,2].map(i=>(
                <span key={i} style={{width:18, height:1, background: i===0 ? "#fff" : "rgba(255,255,255,.25)"}}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaPair({label, value}) {
  return (
    <div>
      <div className="mono" style={{fontSize:9.5, letterSpacing:".24em", textTransform:"uppercase", color:"rgba(255,255,255,.4)", marginBottom:6}}>{label}</div>
      <div className="serif" style={{fontSize:18, fontWeight:500, color:"#fff", letterSpacing:"-0.005em"}}>{value}</div>
    </div>
  );
}

/* =========================================================
   Featured Article + Categories
   ========================================================= */
function FeatureAndCategories({ ruleWeight, ornaments }) {
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"var(--section-pad) 40px 0"}}>
      <div style={{display:"grid", gridTemplateColumns:"minmax(0,1.35fr) minmax(0,1fr)", gap:40}}>
        {/* Featured article */}
        <article className="card" style={{padding:"44px 52px", position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28}}>
            <span className="eyebrow">Featured Article · {FEATURED_ARTICLE.category}</span>
            <span className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"var(--gray-500)"}}>
              {FEATURED_ARTICLE.readTime}
            </span>
          </div>

          <h2 style={{fontSize:44, lineHeight:1.08, letterSpacing:"-0.015em", color:"var(--ink)", marginBottom:24, fontWeight:600, maxWidth:"18ch"}}>
            {FEATURED_ARTICLE.title}
          </h2>

          <div className="hairline" style={{margin:"4px 0 28px"}} />

          <blockquote style={{margin:0, paddingLeft:28, borderLeft:"2px solid var(--ink)"}}>
            <p className="serif" style={{fontSize:20, lineHeight:1.5, color:"var(--gray-700)", fontStyle:"italic", margin:0, maxWidth:"46ch"}}>
              “{FEATURED_ARTICLE.pullquote}”
            </p>
          </blockquote>

          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:36}}>
            <div style={{display:"flex", alignItems:"center", gap:14}}>
              <div style={{
                width:38, height:38, borderRadius:"50%",
                background:"linear-gradient(135deg,#2b2a28,#0e0d0b)",
                display:"grid", placeItems:"center", color:"#fff",
                fontFamily:"var(--serif)", fontStyle:"italic", fontWeight:600, fontSize:14
              }}>
                {FEATURED_ARTICLE.author.split(" ").map(s=>s[0]).join("")}
              </div>
              <div>
                <div className="mono" style={{fontSize:9.5, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gray-500)"}}>By</div>
                <div className="serif" style={{fontSize:16, color:"var(--ink)", fontWeight:600}}>{FEATURED_ARTICLE.author}</div>
              </div>
            </div>
            <a href="#" className="readmore">Continue reading <span className="arrow">→</span></a>
          </div>

          {ornaments !== "off" && (
            <div aria-hidden="true" style={{
              position:"absolute", top:22, right:22,
              fontFamily:"var(--serif)", fontSize:44, lineHeight:1, color:"var(--gray-200)", fontStyle:"italic"
            }}>§</div>
          )}
        </article>

        {/* Categories */}
        <aside className="card" style={{padding:"44px 44px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28}}>
            <span className="eyebrow">Categories</span>
            <span className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"var(--gray-400)"}}>
              05 · sections
            </span>
          </div>
          <div>
            {CATEGORIES.map((c, i) => (
              <a key={c.name} href="#" className="cat-row">
                <span className="num">{String(i+1).padStart(2,"0")}</span>
                <span className="name">{c.name}</span>
                <span className="arr">
                  <span className="mono" style={{fontSize:10, letterSpacing:".2em", color:"var(--gray-400)", marginRight:14}}>{String(c.count).padStart(2,"0")}</span>
                  →
                </span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* =========================================================
   Editorial Strip — rotating reads
   ========================================================= */
function EditorialStrip({ visible }) {
  if (!visible) return null;
  return (
    <section style={{maxWidth:1440, margin:"0 auto", padding:"var(--section-pad) 40px 0"}}>
      <SectionHead eyebrow="From the Desk" title="This week in reading" right="All essays →" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, minmax(0,1fr))", gap:28}}>
        {EDITORIAL.map((a, i) => (
          <a key={i} href="#" className="tile" style={{display:"block"}}>
            <div style={{position:"relative", aspectRatio:"4/5", overflow:"hidden", borderRadius:2, marginBottom:18}}>
              <PH label={`${a.label.toUpperCase()} · PHOTO ${String(i+1).padStart(2,"0")}`} />
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
              <span className="eyebrow">{a.label}</span>
              <span className="mono" style={{fontSize:10, letterSpacing:".22em", color:"var(--gray-500)", textTransform:"uppercase"}}>{a.read}</span>
            </div>
            <h3 style={{fontSize:22, lineHeight:1.15, letterSpacing:"-0.01em", color:"var(--ink)", fontWeight:600, marginBottom:10, textWrap:"pretty"}}>
              {a.title}
            </h3>
            <div className="serif" style={{fontSize:14, fontStyle:"italic", color:"var(--gray-700)"}}>
              by {a.author}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, right }) {
  return (
    <div style={{marginBottom:36}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:20}}>
        <div>
          <div className="eyebrow" style={{marginBottom:16}}>{eyebrow}</div>
          <h2 style={{fontSize:44, letterSpacing:"-0.015em", color:"var(--ink)", fontWeight:600, lineHeight:1.05}}>{title}</h2>
        </div>
        {right && <a href="#" className="readmore">{right.replace(" →","")} <span className="arrow">→</span></a>}
      </div>
      <div className="hairline" style={{marginTop:28}}/>
    </div>
  );
}

/* =========================================================
   Latest Issue grid (big + two small tiles)
   ========================================================= */
function LatestIssues() {
  return (
    <section id="latest" style={{maxWidth:1440, margin:"0 auto", padding:"var(--section-pad) 40px 0"}}>
      <SectionHead eyebrow="From the Archive" title="Read an issue" right="Browse all →" />

      <div style={{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:24}}>
        <a href="#" className="tile" style={{position:"relative", height:540, overflow:"hidden", borderRadius:2, display:"block", background:"#111"}}>
          <PH label={LATEST_ISSUE.placeholder} showLabel={false} />
          <div className="overlay" style={{position:"absolute", inset:0}}/>
          <div style={{position:"absolute", top:32, left:32, right:32, color:"#fff"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14}}>
              <span style={{width:8, height:8, borderRadius:"50%", background:"#fff"}}/>
              <span className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.85)"}}>Latest Issue</span>
            </div>
            <div className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"rgba(255,255,255,.55)", marginBottom:8}}>
              Issue No. {String(LATEST_ISSUE.issue_number).padStart(2,"0")} · {LATEST_ISSUE.date}
            </div>
            <h3 style={{fontSize:68, letterSpacing:"-0.02em", fontWeight:600, color:"#fff", lineHeight:1, marginBottom:8, textTransform:"uppercase"}}>
              {LATEST_ISSUE.title}
            </h3>
          </div>
          <div style={{position:"absolute", left:32, right:32, bottom:32, display:"flex", alignItems:"flex-end", justifyContent:"space-between"}}>
            <span className="btn-ghost">Open issue <span>→</span></span>
            <div style={{color:"rgba(255,255,255,.55)"}}>
              <div className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", marginBottom:6}}>Contents</div>
              <div className="serif" style={{fontSize:14}}>86 photographs · 12 articles</div>
            </div>
          </div>
        </a>

        <div style={{display:"grid", gridTemplateRows:"1fr 1fr", gap:24}}>
          <a href="#" className="tile" style={{position:"relative", overflow:"hidden", borderRadius:2, display:"block", background:"#111"}}>
            <PH label={PREV_ISSUE.placeholder} showLabel={false} />
            <div className="overlay" style={{position:"absolute", inset:0}}/>
            <div style={{position:"absolute", top:24, left:24, right:24, color:"#fff"}}>
              <div className="mono" style={{fontSize:10, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.6)", marginBottom:10}}>
                Previous · No. {String(PREV_ISSUE.issue_number).padStart(2,"0")}
              </div>
              <h4 style={{fontSize:38, letterSpacing:"-0.015em", fontWeight:600, color:"#fff", lineHeight:1, textTransform:"uppercase"}}>
                {PREV_ISSUE.title}
              </h4>
            </div>
            <div style={{position:"absolute", left:24, right:24, bottom:20, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <span className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"rgba(255,255,255,.55)"}}>{PREV_ISSUE.date}</span>
              <span className="readmore" style={{color:"rgba(255,255,255,.85)"}}>View <span className="arrow">→</span></span>
            </div>
          </a>

          <a href="#" className="tile-light" style={{position:"relative", overflow:"hidden", borderRadius:2, display:"block", background:"var(--paper)", transition:"background .3s"}}>
            <div style={{position:"absolute", inset:0, padding:"28px", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
              <div>
                <div className="eyebrow" style={{marginBottom:12}}>Archive</div>
                <h4 style={{fontSize:34, letterSpacing:"-0.015em", color:"var(--ink)", fontWeight:600, lineHeight:1.02, maxWidth:"14ch"}}>
                  Every issue, every shoot, every letter.
                </h4>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end"}}>
                <div>
                  <div className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"var(--gray-500)", marginBottom:4}}>
                    Vol. I–II
                  </div>
                  <div className="serif" style={{fontSize:14, color:"var(--gray-700)"}}>02 issues · since 2025</div>
                </div>
                <span className="readmore">Browse <span className="arrow">→</span></span>
              </div>
              {/* decorative corner ticks */}
              <span aria-hidden="true" style={{position:"absolute", top:18, right:18, fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", color:"var(--gray-400)"}}>◫</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Newsletter — inline, dark
   ========================================================= */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section id="newsletter" style={{marginTop:"var(--section-pad)", background:"#0A0A0A", color:"#fff"}}>
      <div style={{maxWidth:1440, margin:"0 auto", padding:"96px 40px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"end"}}>
          <div>
            <div className="mono" style={{fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.45)", marginBottom:20}}>
              The Dispatch · Quarterly
            </div>
            <h2 style={{fontSize:72, letterSpacing:"-0.02em", lineHeight:.98, color:"#fff", fontWeight:600, maxWidth:"14ch"}}>
              Slow reading, in your inbox.
            </h2>
          </div>
          <div>
            <p className="serif" style={{fontSize:19, color:"rgba(255,255,255,.75)", lineHeight:1.55, maxWidth:"44ch", marginTop:0, marginBottom:28, fontStyle:"italic"}}>
              A letter from the desk each quarter — new issues, unreleased photographs, and the occasional notebook page.
            </p>
            <form onSubmit={(e)=>{e.preventDefault(); if(email) setOk(true);}} style={{display:"grid", gridTemplateColumns:"1fr auto", alignItems:"end", gap:20}}>
              <div>
                <label className="mono" style={{fontSize:10, letterSpacing:".24em", textTransform:"uppercase", color:"rgba(255,255,255,.45)"}}>
                  Email address
                </label>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="nl-input" placeholder="you@somewhere.world" type="email" required/>
              </div>
              <button type="submit" className="btn-solid" style={{whiteSpace:"nowrap"}}>
                {ok ? "Subscribed ✓" : "Subscribe →"}
              </button>
            </form>
            <div className="mono" style={{fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.35)", marginTop:18}}>
              No spam · unsubscribe with one click
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function Footer() {
  const cols = [
    { h:"Magazine", links:["Current Issue","Archive","Subscribe","Letters"] },
    { h:"Shop", links:["All Products","New Arrivals","Best Sellers","Gift Cards"] },
    { h:"Routure", links:["About","Masthead","Contact","Careers"] },
  ];
  return (
    <footer style={{background:"#000", color:"#fff"}}>
      <div style={{maxWidth:1440, margin:"0 auto", padding:"80px 40px 40px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:60, marginBottom:72}}>
          <div>
            <div style={{fontFamily:"var(--serif)", fontSize:44, fontWeight:600, letterSpacing:"-0.02em", marginBottom:18}}>Routure</div>
            <p className="serif" style={{fontStyle:"italic", fontSize:16, lineHeight:1.5, color:"rgba(255,255,255,.6)", maxWidth:"38ch", margin:0}}>
              A curated magazine experience exploring the intersection of culture, style, and contemporary life.
            </p>
            <div style={{display:"flex", gap:12, marginTop:24}}>
              {["Instagram","TikTok","LinkedIn"].map(s=>(
                <a key={s} href="#" className="mono"
                   style={{fontSize:10, letterSpacing:".2em", textTransform:"uppercase",
                           padding:"10px 14px", border:"1px solid rgba(255,255,255,.2)", borderRadius:999,
                           color:"rgba(255,255,255,.7)", transition:"border-color .3s, color .3s"}}
                   onMouseEnter={e=>{e.currentTarget.style.borderColor="#fff"; e.currentTarget.style.color="#fff";}}
                   onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; e.currentTarget.style.color="rgba(255,255,255,.7)";}}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map(c=>(
            <div key={c.h}>
              <div className="mono" style={{fontSize:10, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.45)", marginBottom:22}}>
                {c.h}
              </div>
              <ul style={{listStyle:"none", margin:0, padding:0, display:"grid", gap:14}}>
                {c.links.map(l=>(
                  <li key={l}>
                    <a href="#" style={{color:"rgba(255,255,255,.8)", fontSize:15, transition:"color .2s"}}
                       onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                       onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.8)"}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{height:1, background:"rgba(255,255,255,.12)", marginBottom:24}}/>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:20, flexWrap:"wrap"}}>
          <div className="mono" style={{fontSize:10.5, letterSpacing:".22em", textTransform:"uppercase", color:"rgba(255,255,255,.4)"}}>
            © 2026 Routure Magazine · All rights reserved
          </div>
          <div className="mono" style={{fontSize:10.5, letterSpacing:".22em", textTransform:"uppercase", color:"rgba(255,255,255,.4)"}}>
            Privacy · Terms · Cookies
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   Tweaks panel
   ========================================================= */
function Tweaks({ t, setTweak }) {
  const TP = window.TweaksPanel;
  const TS = window.TweakSection;
  const TR = window.TweakRadio;
  const TT = window.TweakToggle;
  const TSL = window.TweakSlider;
  if (!TP) return null;
  return (
    <TP title="Tweaks">
      <TS label="Layout"/>
      <TR label="Hero layout" value={t.heroLayout}
          onChange={v=>setTweak("heroLayout", v)}
          options={[{value:"split",label:"Split"},{value:"full",label:"Full-bleed"}]}/>
      <TR label="Density" value={t.density}
          onChange={v=>setTweak("density", v)}
          options={[{value:"cozy",label:"Cozy"},{value:"normal",label:"Normal"},{value:"airy",label:"Airy"}]}/>
      <TS label="Typography"/>
      <TSL label="Headline scale" value={t.headlineScale} min={0.85} max={1.2} step={0.01}
           onChange={v=>setTweak("headlineScale", v)}/>
      <TS label="Ornaments"/>
      <TR label="Editorial marks" value={t.ornaments}
          onChange={v=>setTweak("ornaments", v)}
          options={[{value:"off",label:"Off"},{value:"subtle",label:"Subtle"}]}/>
      <TT label="Editorial strip" value={t.showEditorialStrip} onChange={v=>setTweak("showEditorialStrip", v)}/>
      <TT label="Ticker ribbon" value={t.showTickerRibbon} onChange={v=>setTweak("showTickerRibbon", v)}/>
    </TP>
  );
}

/* =========================================================
   App
   ========================================================= */
function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(()=>{
    document.body.className = "density-" + t.density;
  },[t.density]);

  return (
    <div id="top">
      <Header/>
      <Masthead/>
      <Hero layout={t.heroLayout} headlineScale={t.headlineScale}/>
      <div style={{marginTop:36}}>
        <Ticker visible={t.showTickerRibbon}/>
      </div>
      <FeatureAndCategories ruleWeight={t.ruleWeight} ornaments={t.ornaments}/>
      <EditorialStrip visible={t.showEditorialStrip}/>
      <LatestIssues/>
      <Newsletter/>
      <Footer/>
      <Tweaks t={t} setTweak={setTweak}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
