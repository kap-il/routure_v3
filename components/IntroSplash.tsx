'use client';

import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface IntroSplashProps {
  children: React.ReactNode;
  skip?: boolean;
  duration?: number;
  /** Pool of shoot hero thumbnails. The intro fills the screen with a grid of
   *  outlined boxes, then an anime.js wave (top-left → out) flips each box over
   *  to reveal a random hero, before the split reveals the home page. */
  flashImages?: string[];
}

type Phase = 'idle' | 'slash' | 'slashDone' | 'gridShow' | 'grid' | 'split' | 'done';

interface Grid { cols: number; rows: number; cells: string[]; }

// Timeline (ms from mount)
const T_SLASH = 600;
const T_SLASH_DONE = 1230;
const T_GRID_SHOW = 1450; // outline boxes fade in
const T_WAVE = 1950;      // wave of flips begins (≈500ms of outlines first)
// Wave tuning
const STAGGER = 70;       // ms between adjacent cells (scaled by grid distance)
const FLIP_DUR = 900;     // ms per flip
const SPLIT_DUR = 1400;   // ms for the diagonal reveal
const CELL_TARGET = 165;  // px — target cell size when sizing the grid

export default function IntroSplash({
  children,
  skip = false,
  duration = 2800,
  flashImages = [],
}: IntroSplashProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [grid, setGrid] = useState<Grid | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mount: set up the grid + drive the phase timeline
  useEffect(() => {
    const blocker = document.getElementById('intro-block');
    if (!blocker || skip) {
      setPhase('done');
      blocker?.remove();
      return;
    }
    blocker.textContent = 'html{background:#000!important}';

    // Build a screen-filling grid; assign random heroes, cycling reshuffled
    // copies of the pool so the whole screen fills even if the pool is small.
    let g: Grid | null = null;
    if (flashImages.length > 0) {
      const cols = Math.max(3, Math.round(window.innerWidth / CELL_TARGET));
      const rows = Math.max(3, Math.round(window.innerHeight / CELL_TARGET));
      const count = cols * rows;
      const cells: string[] = [];
      while (cells.length < count) {
        const s = [...flashImages];
        for (let i = s.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [s[i], s[j]] = [s[j], s[i]];
        }
        cells.push(...s);
      }
      cells.length = count;
      g = { cols, rows, cells };
      setGrid(g);
      // preload the unique thumbnails so the flip reveals an image, not a blank
      [...new Set(cells)].forEach((src) => { const im = new window.Image(); im.src = src; });
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('slash'), T_SLASH));
    timers.push(setTimeout(() => setPhase('slashDone'), T_SLASH_DONE));
    if (g) {
      timers.push(setTimeout(() => setPhase('gridShow'), T_GRID_SHOW));
      timers.push(setTimeout(() => setPhase('grid'), T_WAVE));
    } else {
      // No heroes — original flow straight into the reveal
      timers.push(setTimeout(() => setPhase('split'), 1400));
    }
    return () => timers.forEach(clearTimeout);
  }, [skip, flashImages]);

  // Wave: flip the grid open from the top-left corner, then trigger the split
  useEffect(() => {
    if (phase !== 'grid' || !gridRef.current || !grid) return;
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.intro-flip-card'));
    if (cards.length === 0) { setPhase('split'); return; }

    let done = false;
    const toSplit = () => { if (!done) { done = true; setPhase('split'); } };

    animate(cards, {
      rotateY: 180,
      duration: FLIP_DUR,
      delay: stagger(STAGGER, { grid: [grid.cols, grid.rows], from: 0 }),
      ease: 'outQuad',
      onComplete: toSplit,
    });
    // safety: don't hang if onComplete is missed
    const fallback = setTimeout(toSplit, STAGGER * (grid.cols + grid.rows) + FLIP_DUR + 400);
    return () => clearTimeout(fallback);
  }, [phase, grid]);

  // Split: drop the html-black blocker and finish
  useEffect(() => {
    if (phase !== 'split') return;
    document.getElementById('intro-block')?.remove();
    const t = setTimeout(() => setPhase('done'), SPLIT_DUR);
    return () => clearTimeout(t);
  }, [phase]);

  const gridVisible = phase === 'gridShow' || phase === 'grid';

  return (
    <>
      <style>{`
        @keyframes slashMove { 0% { top: -5%; left: -5%; } 100% { top: 105%; left: 105%; } }
        @keyframes trailGrow { 0% { stroke-dashoffset: 1.415; } 100% { stroke-dashoffset: 0; } }
        @keyframes trailErase { 0% { stroke-dashoffset: 1.415; } 100% { stroke-dashoffset: 0; } }
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

          {/* Image grid — outlined boxes that flip open to reveal heroes */}
          {grid && (
            <div
              ref={gridRef}
              style={{
                position: 'absolute', inset: 0, background: '#000',
                display: 'grid',
                gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                gap: '10px', padding: '10px',
                perspective: '1400px',
                opacity: gridVisible ? 1 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }}
            >
              {grid.cells.map((src, i) => (
                <div
                  key={i}
                  className="intro-flip-card"
                  style={{ position: 'relative', transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                  {/* front: gray outline */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    border: '1px solid #4a4a4a', borderRadius: '4px',
                    backfaceVisibility: 'hidden',
                  }} />
                  {/* back: the hero photo (pre-flipped) */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '4px', overflow: 'hidden',
                    transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slash beam — small dot with trail that travels corner to corner */}
          {phase === 'slash' && (
            <>
              <svg viewBox="0 0 1 1" preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="0" y1="0" x2="1" y2="1" stroke="rgba(255,255,255,0.25)" strokeWidth="0.0015"
                  strokeDasharray="1.415" strokeDashoffset="1.415"
                  style={{ animation: 'trailGrow 0.64s cubic-bezier(0.22,1,0.36,1) forwards' }} />
                <line x1="0" y1="0" x2="1" y2="1" stroke="#000" strokeWidth="0.003"
                  strokeDasharray="1.415" strokeDashoffset="1.415"
                  style={{ animation: 'trailErase 0.64s cubic-bezier(0.22,1,0.36,1) 0.05s forwards' }} />
              </svg>
              <div style={{
                position: 'absolute', width: '1px', height: '1px', background: 'transparent',
                animation: 'slashMove 0.64s cubic-bezier(0.22,1,0.36,1) forwards', pointerEvents: 'none',
              }} />
            </>
          )}

          {/* Center icon — fades out once the grid takes over */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.3s ease',
            opacity: phase === 'split' || phase === 'grid' || phase === 'gridShow' ? 0 : 1,
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
