'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type FeaturedShoot = {
  title: string;
  slug: string;
  heroImageUrl: string;
  imageCount: number;
};

const ROTATE_MS = 7000;

export default function FeaturedHero({
  shoots,
  issueNo,
  issueTitle,
}: {
  shoots: FeaturedShoot[];
  issueNo: string;
  issueTitle: string;
}) {
  const count = Math.max(shoots.length, 1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const listener = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || prefersReducedMotion.current) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  const active = shoots[index] ?? null;

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] rounded-sm overflow-hidden md:h-[560px]">
          {/* Image side */}
          <Link
            href={active ? `/shoot/${active.slug}` : '/issues'}
            className="tile relative block min-h-[360px] md:min-h-0 overflow-hidden"
          >
            {shoots.map((s, i) => (
              <span
                key={s.slug}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{ opacity: i === index ? 1 : 0 }}
                aria-hidden={i !== index}
              >
                <Image
                  src={s.heroImageUrl}
                  alt={i === index ? s.title : ''}
                  fill
                  sizes="(min-width: 768px) 62vw, 100vw"
                  className="object-cover"
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                />
              </span>
            ))}
            {shoots.length === 0 && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2b2a28] to-[#0e0d0b]" />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.28), transparent 40%)' }}
            />
            <div className="absolute top-6 left-6 flex items-center gap-2.5 text-white/80">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase">Now reading</span>
            </div>
          </Link>

          {/* Dark meta side */}
          <div className="bg-[#0F0E0D] text-white flex flex-col justify-between p-8 md:p-12">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-white/50 mb-7">
                Featured Shoot
              </div>
              <h1
                key={active?.slug ?? 'fallback'}
                className="font-serif text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.015em] font-semibold text-white mb-6 animate-[riseIn_0.6s_cubic-bezier(.2,.7,.2,1)_both]"
              >
                {active?.title ?? 'Explore Our Shoots'}
              </h1>
              <div className="w-10 h-px bg-white/35 mb-6" />
              <div className="grid grid-cols-2 gap-5 mb-6">
                <MetaPair
                  label="Frames"
                  value={active ? String(active.imageCount).padStart(2, '0') : '—'}
                />
                <MetaPair label="Issue" value={`No. ${issueNo}`} />
                <MetaPair label="Section" value="Shoot" />
                <MetaPair label="Series" value={issueTitle} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href={active ? `/shoot/${active.slug}` : '/issues'}
                className="readmore"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                View shoot <span className="arrow">→</span>
              </Link>

              {/* Indicator dashes — click to jump, auto-cycle otherwise */}
              <div className="flex gap-1.5" role="tablist" aria-label="Featured shoot carousel">
                {Array.from({ length: Math.max(count, 1) }).map((_, i) => {
                  const label = shoots[i]?.title ?? `Slide ${i + 1}`;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Show ${label}`}
                      onClick={() => setIndex(i)}
                      className="p-0 border-0 bg-transparent cursor-pointer"
                    >
                      <span
                        className="block h-px w-[18px] transition-colors"
                        style={{ background: i === index ? '#fff' : 'rgba(255,255,255,0.25)' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-white/40 mb-1.5">
        {label}
      </div>
      <div className="font-serif text-[18px] font-medium text-white tracking-[-0.005em]">
        {value}
      </div>
    </div>
  );
}
