// primitives.jsx — ROUTURE shared primitives (cursor, ticker, placeholder, annotation, hooks)

const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

/* ————— Custom cursor with label + size states ————— */
function CustomCursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState("");
  const [big, setBig] = useState(false);

  useEffect(() => {
    const el = ref.current;
    let x = window.innerWidth/2, y = window.innerHeight/2;
    let tx = x, ty = y;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', move);

    let raf;
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const over = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { setLabel(t.getAttribute('data-cursor') || ''); setBig(true); }
      else { setBig(false); setLabel(''); }
    };
    document.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className={`custom-cursor ${big ? 'lg' : ''}`}>
      {big && <span className="cursor-label">{label}</span>}
    </div>
  );
}

/* ————— Infinite horizontal marquee (credits ticker) ————— */
function Marquee({ items, speed = 60, sep = "✳", className = "" }) {
  // speed = px/s. We duplicate items for seamless loop using CSS animation.
  const innerRef = useRef(null);
  const [dur, setDur] = useState(60);
  useEffect(() => {
    if (!innerRef.current) return;
    const measure = () => {
      if (!innerRef.current) return;
      const w = innerRef.current.scrollWidth / 2;
      setDur(w / speed);
    };
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [items, speed]);

  const line = items.map((t, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
      <span>{t}</span>
      <span style={{ color: 'var(--acid-deep)' }}>{sep}</span>
    </span>
  ));

  return (
    <div className={`marquee ${className}`} style={{ overflow: 'hidden', width: '100%' }}>
      <div
        ref={innerRef}
        style={{
          display: 'inline-flex',
          gap: 18,
          whiteSpace: 'nowrap',
          animation: `routure-marquee ${dur}s linear infinite`
        }}
      >
        {line}{line}
      </div>
      <style>{`@keyframes routure-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ————— Placeholder image tile ————— */
function Placeholder({ palette = "p-clay", label, corner = "bl", style, className = "" }) {
  return (
    <div className={`ph ${palette} ${className}`} style={style}>
      {label && <span className={`ph-label ${corner === 'tr' ? 'tr' : ''}`}>{label}</span>}
    </div>
  );
}

/* ————— Annotation pin ————— */
function Anno({ x, y, children, side = "left" }) {
  return (
    <div className={`anno ${side === 'right' ? 'right' : ''}`} style={{ left: typeof x === 'number' ? `${x}px` : x, top: typeof y === 'number' ? `${y}px` : y }}>
      <div className="anno-dot" />
      <div className="anno-text">{children}</div>
    </div>
  );
}

/* ————— Annotations toggle ————— */
function AnnoToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('show-anno', on);
  }, [on]);
  return (
    <button className={`anno-toggle ${on ? 'active' : ''}`} onClick={() => setOn(v => !v)}>
      {on ? "Motion notes ON" : "Show motion notes"}
    </button>
  );
}

/* ————— useScroll: returns scrollY ————— */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf;
    const update = () => { setY(window.scrollY); raf = null; };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', on, { passive: true });
    update();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return y;
}

/* ————— useMouseOffset inside a ref ————— */
function useMouseParallax(ref, strength = 20) {
  const [o, setO] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setO({ x: dx * strength, y: dy * strength });
    };
    const onLeave = () => setO({ x: 0, y: 0 });
    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, strength]);
  return o;
}

/* ————— useInViewRatio: how much of an element is in the viewport 0..1 ————— */
function useViewportProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = null;
    const calc = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when top of el at bottom of vp; 1 when bottom of el at top of vp
      const total = vh + r.height;
      const past = vh - r.top;
      setP(Math.max(0, Math.min(1, past / total)));
      raf = null;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    calc();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ref]);
  return p;
}

/* ————— Letter-by-letter assembler as element scrolls in ————— */
function AssemblyText({ text, className = "", style = {} }) {
  const ref = useRef(null);
  const p = useViewportProgress(ref);
  const chars = text.split('');
  // progress 0..1 across assembly window roughly 0.2..0.6 of viewport progress
  const activated = Math.max(0, Math.min(1, (p - 0.2) / 0.4));
  return (
    <span ref={ref} className={className} style={style}>
      {chars.map((c, i) => {
        const localStart = i / chars.length * 0.7;
        const localEnd = localStart + 0.3;
        const t = Math.max(0, Math.min(1, (activated - localStart) / (localEnd - localStart)));
        const blur = (1 - t) * 12;
        const op = t;
        const ty = (1 - t) * 40;
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: op,
            transform: `translateY(${ty}px)`,
            filter: `blur(${blur}px)`,
            transition: 'none',
            whiteSpace: c === ' ' ? 'pre' : 'normal'
          }}>{c}</span>
        );
      })}
    </span>
  );
}

Object.assign(window, { CustomCursor, Marquee, Placeholder, Anno, AnnoToggle, useScrollY, useMouseParallax, useViewportProgress, AssemblyText });
