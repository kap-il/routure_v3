'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface IntroSplashProps {
  children: React.ReactNode;
  skip?: boolean;
  duration?: number;
  /** Pool of shoot hero thumbnails — 3 distinct are shuffled in client-side and
   *  flash-carded after the slash, before the home page is revealed. */
  flashImages?: string[];
}

type Phase = 'idle' | 'slash' | 'slashDone' | 'flash' | 'split' | 'done';

const FLASH_START = 1450; // ms — after the slash beam settles
const FLASH_EACH = 600;   // ms each card is on screen
const SPLIT_DUR = 1400;   // ms for the diagonal reveal to finish

export default function IntroSplash({
  children,
  skip = false,
  duration = 2800,
  flashImages = [],
}: IntroSplashProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cards, setCards] = useState<string[]>([]);
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    const blocker = document.getElementById('intro-block');
    // No blocker = client-side navigation, skip the animation
    if (!blocker || skip) {
      setPhase('done');
      blocker?.remove();
      return;
    }
    // Show body so the black overlay is visible, but keep html bg black
    blocker.textContent = 'html{background:#000!important}';

    // Pick 3 distinct random heroes (different each load) + preload the thumbnails
    // so the cards aren't blank when the flash phase starts.
    const pool = [...flashImages];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picks = pool.slice(0, 3);
    setCards(picks);
    picks.forEach((src) => { const im = new window.Image(); im.src = src; });

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('slash'), 600));
    timers.push(setTimeout(() => setPhase('slashDone'), 1230));

    if (picks.length > 0) {
      timers.push(setTimeout(() => { setPhase('flash'); setFlashIndex(0); }, FLASH_START));
      for (let k = 1; k < picks.length; k++) {
        timers.push(setTimeout(() => setFlashIndex(k), FLASH_START + k * FLASH_EACH));
      }
      const splitAt = FLASH_START + picks.length * FLASH_EACH;
      timers.push(setTimeout(() => {
        setPhase('split');
        document.getElementById('intro-block')?.remove();
      }, splitAt));
      timers.push(setTimeout(() => setPhase('done'), splitAt + SPLIT_DUR));
    } else {
      // No heroes available — original flow (slash straight into the reveal)
      timers.push(setTimeout(() => {
        setPhase('split');
        document.getElementById('intro-block')?.remove();
      }, 1400));
      timers.push(setTimeout(() => setPhase('done'), duration));
    }

    return () => timers.forEach(clearTimeout);
  }, [skip, duration, flashImages]);

  return (
    <>
      <style>{`
        @keyframes slashMove {
          0% { top: -5%; left: -5%; }
          100% { top: 105%; left: 105%; }
        }
        @keyframes trailGrow {
          0% { stroke-dashoffset: 1.415; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes trailErase {
          0% { stroke-dashoffset: 1.415; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      {children}
      {phase !== 'done' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: phase === 'split' ? 'none' : 'auto' }}>
          {/* Solid black background */}
          <div style={{
            position: 'absolute', inset: 0, background: '#000',
            transition: 'opacity 1.0s ease',
            opacity: phase === 'split' ? 0 : 1,
          }} />
          {/* Upper-right half — slides right */}
          <div style={{
            position: 'absolute', inset: 0, background: '#000',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
            transition: 'transform 1.0s cubic-bezier(0.76,0,0.24,1)',
            transform: phase === 'split' ? 'translateX(105%)' : 'translateX(0)',
          }} />
          {/* Lower-left half — slides left */}
          <div style={{
            position: 'absolute', inset: 0, background: '#000',
            clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
            transition: 'transform 1.0s cubic-bezier(0.76,0,0.24,1)',
            transform: phase === 'split' ? 'translateX(-105%)' : 'translateX(0)',
          }} />
          {/* Slash beam — small dot with trail that travels corner to corner */}
          {phase === 'slash' && (
            <>
              {/* Trail that follows the dot and erases 50ms behind */}
              <svg
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  pointerEvents: 'none',
                }}
              >
                {/* White trail drawn by the dot */}
                <line
                  x1="0" y1="0" x2="1" y2="1"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="0.0015"
                  strokeDasharray="1.415"
                  strokeDashoffset="1.415"
                  style={{
                    animation: 'trailGrow 0.64s cubic-bezier(0.22,1,0.36,1) forwards',
                  }}
                />
                {/* Black line that erases the trail 50ms behind */}
                <line
                  x1="0" y1="0" x2="1" y2="1"
                  stroke="#000"
                  strokeWidth="0.003"
                  strokeDasharray="1.415"
                  strokeDashoffset="1.415"
                  style={{
                    animation: 'trailErase 0.64s cubic-bezier(0.22,1,0.36,1) 0.05s forwards',
                  }}
                />
              </svg>
              {/* Invisible dot driving the trail */}
              <div style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                background: 'transparent',
                animation: 'slashMove 0.64s cubic-bezier(0.22,1,0.36,1) forwards',
                pointerEvents: 'none',
              }} />
            </>
          )}
          {/* Flash cards — 3 hero thumbnails flipping through, post-slash */}
          {cards.length > 0 && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              perspective: '1400px', pointerEvents: 'none',
              opacity: phase === 'flash' ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}>
              {cards.map((src, i) => {
                const active = phase === 'flash' && i === flashIndex;
                const past = phase === 'flash' && i < flashIndex;
                const rot = active ? 0 : past ? -110 : 110; // flips in from the right, out to the left
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 'min(82vw, 440px)', height: 'min(72vh, 640px)',
                    borderRadius: '14px', overflow: 'hidden',
                    boxShadow: '0 28px 80px rgba(0,0,0,0.6)',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${rot}deg) scale(${active ? 1 : 0.9})`,
                    opacity: active ? 1 : 0,
                    transition: 'transform 0.34s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
                  }}>
                    <Image src={src} alt="" fill priority sizes="440px" style={{ objectFit: 'cover' }} />
                  </div>
                );
              })}
            </div>
          )}
          {/* Center icon — fades out once the flash cards take over */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.3s ease',
            opacity: phase === 'split' || phase === 'flash' ? 0 : 1,
            pointerEvents: 'none',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/routure_icon_white_resize.png" alt="Routure" style={{
              width: '120px', height: '120px', objectFit: 'contain',
              opacity: phase === 'idle' ? 0 : 1,
              transform: phase === 'idle' ? 'scale(0.8)' : 'scale(1)',
              transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }} />
          </div>
        </div>
      )}
    </>
  );
}
