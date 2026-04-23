import Link from 'next/link';
import Image from 'next/image';
import IntroSplash from '@/components/IntroSplash';
import { getIssues, getFeaturedShoot, getFeaturedArticle } from '@/lib/supabase/queries';

export const revalidate = 3600;

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
  const todayFmt = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const issueNo = latestIssue ? String(latestIssue.issue_number).padStart(2, '0') : '02';
  const issueTitle = latestIssue?.title ?? 'Cosmic';

  const tickerItems = [
    `Issue ${issueNo} · ${issueTitle} — now reading`,
    featuredShoot ? `New shoot · ${featuredShoot.title}` : 'New shoots in the archive',
    'Letters from the Creators',
    'Subscribe · Spring dispatch',
    previousIssue ? `Archive · ${String(previousIssue.issue_number).padStart(2, '0')} ${previousIssue.title}` : 'Archive · every issue',
  ];

  return (
    <IntroSplash>
    <div className="min-h-screen">
      {/* ===== MASTHEAD — dateline + tagline + issue marker ===== */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 pt-7">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="eyebrow">{todayFmt}</div>
          <div className="eyebrow eyebrow-ink tracking-[0.28em]">A Curated Magazine Experience</div>
          <div className="eyebrow md:text-right">No. {issueNo} · {issueTitle}</div>
        </div>
        <div className="hairline-ink mt-5" />
      </div>

      {/* ===== HERO — Featured Shoot, split layout ===== */}
      <section>
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 mt-8 md:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] rounded-sm overflow-hidden md:h-[560px]">
            {/* Image side */}
            <Link
              href={featuredShoot ? `/shoot/${featuredShoot.slug}` : '/issues'}
              className="tile relative block min-h-[360px] md:min-h-0 overflow-hidden"
            >
              {featuredShoot ? (
                <Image
                  src={featuredShoot.heroImageUrl}
                  alt={featuredShoot.title}
                  fill
                  sizes="(min-width: 768px) 62vw, 100vw"
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b2a28] to-[#0e0d0b]" />
              )}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.28), transparent 40%)' }} />
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
                <h1 className="font-serif text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.015em] font-semibold text-white mb-6">
                  {featuredShoot?.title ?? 'Explore Our Shoots'}
                </h1>
                <div className="w-10 h-px bg-white/35 mb-6" />
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <MetaPair label="Photographer" value={featuredShoot ? '—' : '—'} />
                  <MetaPair label="Location" value={featuredShoot ? '—' : '—'} />
                  <MetaPair
                    label="Frames"
                    value={featuredShoot ? String(featuredShoot.imageCount).padStart(2, '0') : '—'}
                  />
                  <MetaPair label="Issue" value={`No. ${issueNo}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={featuredShoot ? `/shoot/${featuredShoot.slug}` : '/issues'}
                  className="readmore"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  View shoot <span className="arrow">→</span>
                </Link>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="block h-px w-[18px]" style={{ background: i === 0 ? '#fff' : 'rgba(255,255,255,0.25)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TICKER RIBBON ===== */}
      <div className="mt-9 border-y border-[color:var(--rule)] bg-[#FAFAF8] overflow-hidden">
        <div className="marquee py-2.5" aria-hidden="true">
          {[
            ...tickerItems,
            ...tickerItems,
          ].map((t, i) => (
            <span
              key={i}
              className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--gray-700)] inline-flex items-center"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--ink)] mr-3.5 align-middle" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED ARTICLE + CATEGORIES ===== */}
      <section className="mx-auto max-w-[1280px] px-5 md:px-[80px] py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Featured article card */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-6 md:p-10">
            <p className="text-[11px] md:text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-4 md:mb-6">
              FEATURED ARTICLE
            </p>
            <h2 className="font-serif text-[24px] md:text-[30px] font-bold leading-[1.25] text-[#1a1a1a] mb-3 md:mb-4">
              {featuredArticle?.title ?? 'Featured Article'}
            </h2>
            <div className="h-px bg-[#E0E0E0] mb-4 md:mb-6" />
            {featuredArticle?.author && (
              <p className="text-[12px] md:text-[13px] text-[#999] mb-6 md:mb-8">
                By {featuredArticle.author}
              </p>
            )}
            {featuredArticle?.pullquote && (
              <blockquote className="border-l-2 border-[#1a1a1a] pl-6 md:pl-10 mb-6 md:mb-8">
                <p className="font-serif text-[14px] md:text-[16px] italic leading-[1.6] text-[#555]">
                  &ldquo;{featuredArticle.pullquote}&rdquo;
                </p>
              </blockquote>
            )}
            <Link
              href={featuredArticle ? `/shoot/${featuredArticle.shootSlug}/article` : '/issues'}
              className="text-[10px] md:text-[11px] tracking-[1.5px] font-medium text-[#1a1a1a] hover:text-[#666] transition-colors"
            >
              CONTINUE READING →
            </Link>
          </div>

          {/* Categories list */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-6 md:p-10">
            <p className="text-[11px] md:text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-6 md:mb-8">
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
                  className="flex items-center justify-between py-4 md:py-5 border-b border-[#EAEAEA] last:border-b-0 group"
                >
                  <span className="text-[17px] md:text-[20px] font-bold text-[#1a1a1a] group-hover:text-[#666] transition-colors" style={{ fontFamily: 'Cochin, Georgia, serif' }}>
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
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px]">
        <div className="h-px bg-[#E0E0E0]" />
      </div>

      <section className="mx-auto max-w-[1280px] px-5 md:px-[80px] py-8 md:py-10">
        {/* --- MOBILE ISSUES --- */}
        <div className="md:hidden flex flex-col gap-4">
          <Link
            href={`/issue/${latestIssue?.slug ?? 'cosmic'}`}
            className="group relative rounded-sm overflow-hidden bg-[#1a1a1a]"
            style={{ height: '320px' }}
          >
            {latestIssue?.cover_image_url && (
              <Image
                src={latestIssue.cover_image_url}
                alt={latestIssue.title}
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 50%, transparent)' }} />
            <div className="relative z-10 pt-8 px-6">
              <p className="text-[10px] tracking-[3px] uppercase text-[#AAA] font-serif mb-3">
                LATEST ISSUE
              </p>
              <h3 className="font-serif text-[28px] font-bold text-white mb-2 uppercase">
                {latestIssue?.title ?? 'Cosmic'}
              </h3>
              <p className="font-serif text-[13px] text-[#CCC] mb-4">
                Issue No. {latestIssue?.issue_number ?? 2}
              </p>
              <span className="inline-block px-5 py-2 rounded-full border border-white/40 text-[10px] tracking-[1.5px] text-white/80">
                VIEW ISSUE →
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/issue/${previousIssue?.slug ?? 'savour'}`}
              className="group relative rounded-sm overflow-hidden bg-[#1a1a1a]"
              style={{ height: '180px' }}
            >
              {previousIssue?.cover_image_url && (
                <Image
                  src={previousIssue.cover_image_url}
                  alt={previousIssue.title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3))' }} />
              <div className="relative z-10 pt-5 px-4">
                <p className="text-[9px] tracking-[2px] uppercase text-[#AAA] font-serif mb-2">
                  PREVIOUS
                </p>
                <h4 className="font-serif text-[15px] font-bold text-white mb-1 uppercase">
                  {previousIssue?.title ?? 'Savour'}
                </h4>
                <p className="text-[11px] text-[#CCC] mb-3">
                  Issue No. {previousIssue?.issue_number ?? 1}
                </p>
                <span className="inline-block px-3 py-1 rounded-full border border-white/40 text-[9px] tracking-[1px] text-white/80">
                  VIEW →
                </span>
              </div>
            </Link>

            <Link
              href="/issues"
              className="group rounded-sm bg-[#F0EFED] flex flex-col items-center justify-center text-center"
              style={{ height: '180px' }}
            >
              <p className="text-[9px] tracking-[2px] uppercase text-[#999] font-serif mb-3">
                ARCHIVE
              </p>
              <h4 className="font-serif text-[15px] font-bold text-[#1a1a1a] mb-2">
                All Issues
              </h4>
              <span className="text-[9px] tracking-[1px] text-[#999]">
                BROWSE →
              </span>
            </Link>
          </div>
        </div>

        {/* --- DESKTOP ISSUES --- */}
        <div className="hidden md:flex">
        <div className="grid grid-cols-[620px_1fr] gap-5 w-full">
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
                loading="lazy"
              />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 50%, transparent)' }} />
            <div className="relative z-10 pt-12 px-10">
              <p className="text-[11px] tracking-[3px] uppercase text-[#AAA] font-serif mb-4">
                LATEST ISSUE
              </p>
              <h3 className="font-serif text-[36px] font-bold text-white mb-2 uppercase">
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
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3))' }} />
              <div className="relative z-10 pt-8 px-6">
                <p className="text-[11px] tracking-[2px] uppercase text-[#AAA] font-serif mb-3">
                  PREVIOUS
                </p>
                <h4 className="font-serif text-[18px] font-bold text-white mb-1 uppercase">
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
        </div>
      </section>
    </div>
    </IntroSplash>
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
