import Link from 'next/link';
import Image from 'next/image';
import type { WeeklyRead } from '@/lib/supabase/queries';

export default function WeeklyReading({ reads }: { reads: WeeklyRead[] }) {
  if (reads.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 pt-20 md:pt-24">
      <div className="mb-9">
        <div className="flex justify-between items-end gap-5">
          <div>
            <div className="eyebrow mb-4">From the Desk</div>
            <h2 className="font-serif text-[32px] md:text-[44px] tracking-[-0.015em] text-[color:var(--ink)] font-semibold leading-[1.05]">
              This week in reading
            </h2>
          </div>
          <Link href="/issues" className="readmore hidden sm:inline-flex">
            All essays <span className="arrow">→</span>
          </Link>
        </div>
        <div className="hairline mt-7" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {reads.map((r, i) => (
          <Link
            key={`${r.shootSlug}-${i}`}
            href={`/shoot/${r.shootSlug}/article`}
            className="tile block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-[18px] bg-[#EAEAEA]">
              {r.heroImageUrl ? (
                <Image
                  src={r.heroImageUrl}
                  alt={r.title}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b2a28] to-[#0e0d0b]" />
              )}
            </div>
            <div className="flex justify-between mb-2.5">
              <span className="eyebrow">Article</span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--gray-500)]">
                {r.readMinutes} min
              </span>
            </div>
            <h3 className="font-serif text-[20px] md:text-[22px] leading-[1.15] tracking-[-0.01em] text-[color:var(--ink)] font-semibold mb-2.5 text-pretty">
              {r.title}
            </h3>
            {r.author && (
              <div className="font-serif italic text-[14px] text-[color:var(--gray-700)]">
                by {r.author}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
