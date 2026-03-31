import Link from 'next/link';
import Image from 'next/image';
import { getIssues, getFeaturedShoot, getFeaturedArticle } from '@/lib/supabase/queries';

export const revalidate = 60; // re-randomize every 60s

export default async function Home() {
  let latestIssue: { title: string; slug: string; issue_number: number; cover_image_url: string | null; description: string | null } | null = null;
  let previousIssue: { title: string; slug: string; issue_number: number; cover_image_url: string | null } | null = null;
  let featuredShoot: { title: string; slug: string; heroImageUrl: string; imageCount: number } | null = null;
  let featuredArticle: { title: string; shootSlug: string; author: string | null; pullquote: string | null } | null = null;
  try {
    const [issues, shoot, article] = await Promise.all([getIssues(), getFeaturedShoot(), getFeaturedArticle()]);
    if (issues.length > 0) latestIssue = issues[0];
    if (issues.length > 1) previousIssue = issues[1];
    featuredShoot = shoot;
    featuredArticle = article;
  } catch { /* fallback to mock */ }
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ===== HERO — Random Shoot with Metadata ===== */}
      <section>
        <div className="mx-auto max-w-[1280px] px-[80px]">
          <div className="relative mt-10 rounded-sm overflow-hidden flex" style={{ height: '480px' }}>
            {/* Shoot image — left side only */}
            <div className="relative flex-1 min-w-0">
              {featuredShoot ? (
                <Image
                  src={featuredShoot.heroImageUrl}
                  alt={featuredShoot.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 890px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
              )}
            </div>

            {/* Solid black box on the right with shoot metadata */}
            <div className="w-[390px] shrink-0 flex items-center" style={{ backgroundColor: '#111111' }}>
              <div className="px-14 py-12">
                <p className="text-[11px] tracking-[3px] uppercase text-[#AAA] mb-6 font-serif">
                  FEATURED SHOOT
                </p>
                <h1 className="font-serif text-[38px] font-bold leading-[1.2] text-white mb-6">
                  {featuredShoot?.title ?? 'Explore Our Shoots'}
                </h1>
                <div className="w-20 h-px bg-white/50 mb-6" />
                {featuredShoot && (
                  <p className="text-[13px] text-[#999] mb-12">
                    {featuredShoot.imageCount} photographs
                  </p>
                )}
                <Link
                  href={featuredShoot ? `/shoot/${featuredShoot.slug}` : '/issues'}
                  className="text-[11px] tracking-[1.5px] text-[#AAA] hover:text-white transition-colors"
                >
                  VIEW SHOOT →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] mt-12">
        <div className="h-px bg-[#E0E0E0]" />
      </div>

      {/* ===== FEATURED ARTICLE SUMMARY + CATEGORIES ===== */}
      <section className="mx-auto max-w-[1280px] px-[80px] py-10">
        <div className="grid grid-cols-2 gap-10">
          {/* Left — Featured article card */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-10">
            <p className="text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-6">
              FEATURED ARTICLE
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-[1.25] text-[#1a1a1a] mb-4">
              {featuredArticle?.title ?? 'Featured Article'}
            </h2>
            <div className="h-px bg-[#E0E0E0] mb-6" />
            {featuredArticle?.author && (
              <p className="text-[13px] text-[#999] mb-8">
                By {featuredArticle.author}
              </p>
            )}
            {featuredArticle?.pullquote && (
              <blockquote className="border-l-2 border-[#1a1a1a] mb-8" style={{ paddingLeft: '2.5rem' }}>
                <p className="font-serif text-[16px] italic leading-[1.6] text-[#555]">
                  &ldquo;{featuredArticle.pullquote}&rdquo;
                </p>
              </blockquote>
            )}
            <Link
              href={featuredArticle ? `/shoot/${featuredArticle.shootSlug}/article` : '/issues'}
              className="text-[11px] tracking-[1.5px] font-medium text-[#1a1a1a] hover:text-[#666] transition-colors"
            >
              CONTINUE READING →
            </Link>
          </div>

          {/* Right — Categories list */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-10">
            <p className="text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-8">
              CATEGORIES
            </p>
            <div className="space-y-0">
              {[
                { name: 'Architecture' },
                { name: 'Sustainability' },
                { name: 'Experimentalism' },
                { name: 'Commercialism' },
                { name: 'Community' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase()}`}
                  className="flex items-center justify-between py-5 border-b border-[#EAEAEA] last:border-b-0 group"
                >
                  <span className="font-serif text-[20px] font-bold text-[#1a1a1a] group-hover:text-[#666] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[14px] text-[#AAA]">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST ISSUE SECTION ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px]">
        <div className="h-px bg-[#E0E0E0]" />
      </div>

      <section className="mx-auto max-w-[1280px] px-[80px] py-10">
        <div className="grid grid-cols-[620px_1fr] gap-5">
          {/* Main issue card */}
          <Link
            href={`/issue/${latestIssue?.slug ?? 'cosmic'}`}
            className="group relative rounded-sm overflow-hidden bg-[#1a1a1a]"
            style={{ height: '480px' }}
          >
            {latestIssue?.cover_image_url && (
              <Image
                src={latestIssue.cover_image_url}
                alt={latestIssue.title}
                fill
                sizes="620px"
                className="object-cover"
              />
            )}
            {/* Black-to-transparent gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
            <div className="relative z-10 pt-12 px-10">
              <p className="text-[11px] tracking-[3px] uppercase text-[#AAA] font-serif mb-4">
                LATEST ISSUE
              </p>
              <h3 className="font-serif text-[36px] font-bold text-white mb-2">
                {latestIssue?.title ?? 'Cosmic'}
              </h3>
              <p className="font-serif text-[15px] text-[#CCC] mb-6">
                Issue No. {latestIssue?.issue_number ?? 2}
              </p>
              <span className="inline-block px-6 py-2 rounded-full border border-white/40 text-[11px] tracking-[1.5px] text-white/80 group-hover:border-white group-hover:text-white transition-colors">
                VIEW ISSUE →
              </span>
            </div>
          </Link>

          {/* Right column — Previous + Archive cards stacked */}
          <div className="grid grid-cols-2 gap-5">
            <Link
              href={`/issue/${previousIssue?.slug ?? 'savour'}`}
              className="group relative rounded-sm overflow-hidden bg-[#1a1a1a]"
              style={{ height: '230px' }}
            >
              {previousIssue?.cover_image_url && (
                <Image
                  src={previousIssue.cover_image_url}
                  alt={previousIssue.title}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3))' }} />
              <div className="relative z-10 pt-8 px-6">
                <p className="text-[11px] tracking-[2px] uppercase text-[#AAA] font-serif mb-3">
                  PREVIOUS
                </p>
                <h4 className="font-serif text-[18px] font-bold text-white mb-1">
                  {previousIssue?.title ?? 'Savour'}
                </h4>
                <p className="text-[12px] text-[#CCC] mb-4">
                  Issue No. {previousIssue?.issue_number ?? 1}
                </p>
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/40 text-[10px] tracking-[1px] text-white/80 group-hover:border-white group-hover:text-white transition-colors">
                  VIEW →
                </span>
              </div>
            </Link>

            <Link
              href="/issues"
              className="group rounded-sm bg-[#F0EFED] flex flex-col items-center justify-center text-center"
              style={{ height: '230px' }}
            >
              <p className="text-[11px] tracking-[2px] uppercase text-[#999] font-serif mb-4">
                ARCHIVE
              </p>
              <h4 className="font-serif text-[18px] font-bold text-[#1a1a1a] mb-2">
                All Issues
              </h4>
              <span className="text-[10px] tracking-[1px] text-[#999] group-hover:text-[#333] transition-colors">
                BROWSE →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
