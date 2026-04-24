// hero-title.jsx — Hero title variants + tweaks wiring for Routure
// Reads window.__ROUTURE_TWEAKS and subscribes to its updates.

const { useState: uHT, useEffect: uHTE } = React;

function useHeroTweaks() {
  const [t, setT] = uHT(() => window.__ROUTURE_TWEAKS || {});
  uHTE(() => {
    const handler = (e) => setT({ ...(window.__ROUTURE_TWEAKS || {}) });
    window.addEventListener('__routure_tweaks', handler);
    return () => window.removeEventListener('__routure_tweaks', handler);
  }, []);
  return t;
}

function HeroTitle({ titleTransform }) {
  const t = useHeroTweaks();
  const variant = t.heroTitle || 'cosmic';        // 'cosmic' | 'routure-logo' | 'routure-regular'
  const weight = t.heroWeight ?? 200;             // 100..900
  const tracking = t.heroTracking ?? -5.5;        // em*100
  const useAcid = !!t.heroAcidAccent;

  const baseStyle = {
    fontSize: 'clamp(240px, 42vw, 640px)',
    fontFamily: 'var(--f-display)',
    fontWeight: weight,
    fontVariationSettings: `"opsz" 144, "SOFT" 0, "wght" ${weight}`,
    letterSpacing: `${tracking / 100}em`,
    color: 'var(--paper)',
    mixBlendMode: 'difference',
    whiteSpace: 'nowrap',
    lineHeight: 0.82
  };

  let content;
  if (variant === 'routure-regular') {
    // Fraunces regular, single weight, uniform — the "Argue/Regular" read
    content = (
      <div style={{
        ...baseStyle,
        fontVariationSettings: `"opsz" 144, "SOFT" 30, "wght" ${weight}`,
        fontStyle: 'normal'
      }}>
        Routure<span style={{ color: useAcid ? 'var(--acid)' : 'inherit' }}>.</span>
      </div>
    );
  } else if (variant === 'routure-logo') {
    // "Logo" treatment: each letter uses a different opsz/wght/SOFT axis
    // so it reads like a proprietary wordmark, not a word
    const letters = [
      { ch: 'R', w: 300, s: 30, it: false },
      { ch: 'O', w: 400, s: 100, it: false },
      { ch: 'U', w: 600, s: 20, it: false },
      { ch: 'T', w: 200, s: 100, it: false },
      { ch: 'U', w: 800, s: 30, it: true  },
      { ch: 'R', w: 300, s: 60, it: false },
      { ch: 'E', w: 500, s: 100, it: false },
    ];
    content = (
      <div style={{
        ...baseStyle,
        display: 'flex',
        gap: '0.01em',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
      }}>
        {letters.map((l, i) => (
          <span key={i} style={{
            fontVariationSettings: `"opsz" 144, "SOFT" ${l.s}, "wght" ${l.w}`,
            fontStyle: l.it ? 'italic' : 'normal',
            color: useAcid && i === 4 ? 'var(--acid)' : 'inherit'
          }}>
            {l.ch}
          </span>
        ))}
      </div>
    );
  } else {
    // Default: "Cosmic." — original treatment
    content = (
      <div style={baseStyle}>
        Cosm<span style={{
          fontStyle: 'italic',
          fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 600',
          color: useAcid ? 'var(--acid)' : 'inherit'
        }}>ic</span>.
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      left: '-4vw', right: '-4vw', bottom: '-6vw',
      transform: titleTransform,
      transition: 'transform 120ms linear',
      pointerEvents: 'none',
      zIndex: 2
    }}>
      {content}
    </div>
  );
}

window.HeroTitle = HeroTitle;
