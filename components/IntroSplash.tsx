'use client';

import { useState, useEffect } from 'react';

interface IntroSplashProps {
  children: React.ReactNode;
  skip?: boolean;
  duration?: number;
}

export default function IntroSplash({
  children,
  skip = false,
  duration = 2800,
}: IntroSplashProps) {
  const [phase, setPhase] = useState<'idle' | 'slash' | 'slashDone' | 'split' | 'done'>('idle');

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
    const t1 = setTimeout(() => setPhase('slash'), 600);
    const t2 = setTimeout(() => setPhase('slashDone'), 1230);
    const t3 = setTimeout(() => {
      setPhase('split');
      document.getElementById('intro-block')?.remove();
    }, 1400);
    const t4 = setTimeout(() => setPhase('done'), duration);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [skip, duration]);

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
          {/* Center icon */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.3s ease', opacity: phase === 'split' ? 0 : 1, pointerEvents: 'none',
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
