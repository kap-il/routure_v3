'use client';

import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface GridFlipRevealProps {
  children: React.ReactNode;
  /** Pool of shoot hero thumbnails. On mount (every navigation here) the screen
   *  fills with outlined boxes, then an anime.js wave (top-left → out) flips each
   *  box over to reveal a random hero, before the split reveals the page. */
  flashImages?: string[];
}

type Phase = 'gridShow' | 'grid' | 'split' | 'done';

interface Grid { cols: number; rows: number; cells: string[]; }

const T_WAVE = 600;        // ms — outlines sit briefly, then the wave begins
const STAGGER = 70;        // ms between adjacent cells (scaled by grid distance)
const FLIP_DUR = 900;      // ms per flip
const HOLD_AFTER_FLIP = 400; // ms the full image grid holds before the split
const SPLIT_DUR = 1400;    // ms for the diagonal reveal
const CELL_TARGET = 165;   // px — target cell size when sizing the grid

export default function GridFlipReveal({ children, flashImages = [] }: GridFlipRevealProps) {
  const [phase, setPhase] = useState<Phase>(flashImages.length ? 'gridShow' : 'done');
  const [grid, setGrid] = useState<Grid | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mount: build a screen-filling grid + start the timeline
  useEffect(() => {
    const blocker = document.getElementById('intro-block');
    if (!flashImages.length) { setPhase('done'); blocker?.remove(); return; }
    // Reveal the body (the blocker hid it to avoid a white flash) but keep the
    // html background black so the overlay sits on black until the split.
    if (blocker) blocker.textContent = 'html{background:#000!important}';

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
    setGrid({ cols, rows, cells });
    [...new Set(cells)].forEach((src) => { const im = new window.Image(); im.src = src; });

    const t = setTimeout(() => setPhase('grid'), T_WAVE);
    return () => clearTimeout(t);
  }, [flashImages]);

  // Wave: flip the grid open from the top-left corner, then trigger the split
  useEffect(() => {
    if (phase !== 'grid' || !gridRef.current || !grid) return;
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.grid-flip-card'));
    if (cards.length === 0) { setPhase('split'); return; }

    let done = false;
    let pauseTimer: ReturnType<typeof setTimeout>;
    // Once every box has flipped, hold the full image grid briefly, then split.
    const toSplit = () => { if (done) return; done = true; pauseTimer = setTimeout(() => setPhase('split'), HOLD_AFTER_FLIP); };
    animate(cards, {
      rotateY: 180,
      duration: FLIP_DUR,
      delay: stagger(STAGGER, { grid: [grid.cols, grid.rows], from: 0 }),
      ease: 'outQuad',
      onComplete: toSplit,
    });
    const fallback = setTimeout(toSplit, STAGGER * (grid.cols + grid.rows) + FLIP_DUR + 400);
    return () => { clearTimeout(fallback); clearTimeout(pauseTimer); };
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
                  className="grid-flip-card"
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
        </div>
      )}
    </>
  );
}
