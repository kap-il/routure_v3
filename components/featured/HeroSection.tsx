import Link from 'next/link';
import Image from 'next/image';
import { Issue } from '@/lib/supabase/types';

interface HeroSectionProps {
  featuredIssue?: Issue | null;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function HeroSection({ featuredIssue }: HeroSectionProps) {
  const issueLabel = featuredIssue && featuredIssue.issue_number > 0
    ? `Issue ${String(featuredIssue.issue_number).padStart(2, '0')}`
    : null;
  const dateLabel = featuredIssue ? formatDate(featuredIssue.publish_date) : null;

  return (
    <section className="relative min-h-[90vh] bg-black text-white overflow-hidden">
      {/* Background cover image */}
      {featuredIssue?.cover_image_url && (
        <Image
          src={featuredIssue.cover_image_url}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
      )}

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Decorative R monogram watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[80vw] h-auto max-w-4xl"
        >
          <path
            d="M20 20 Q0 60 20 100 Q40 140 80 160 L40 200 Q0 180 0 120 Q0 40 60 20 Z"
            fill="white"
          />
          <path
            d="M60 0 Q140 0 160 60 Q180 120 120 160 L180 220 L140 220 L80 152 Q140 128 128 72 Q120 32 72 32 L40 32 L40 0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 h-full min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-3xl">
          {issueLabel && dateLabel && (
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 animate-fade-in">
              {issueLabel} — {dateLabel}
            </p>
          )}

          <h1 className="font-argue text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] mb-8 animate-slide-up">
            {featuredIssue ? featuredIssue.title.toUpperCase() : 'ROUTURE'}
          </h1>

          {featuredIssue?.description && (
            <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {featuredIssue.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link
              href={featuredIssue ? `/issues/${featuredIssue.slug}` : '/issues'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors"
            >
              Read Current Issue
            </Link>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
            >
              Browse Archive
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-xs tracking-widest uppercase text-gray-500">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
