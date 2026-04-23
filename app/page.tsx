import Link from 'next/link';
import Image from 'next/image';
import IntroSplash from '@/components/IntroSplash';
import NewsletterInline from '@/components/home/NewsletterInline';
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
                  <MetaPair
                    label="Frames"
                    value={featuredShoot ? String(featuredShoot.imageCount).padStart(2, '0') : '—'}
                  />
                  <MetaPair label="Issue" value={`No. ${issueNo}`} />
                  <MetaPair label="Section" value="Shoot" />
                  <MetaPair label="Series" value={issueTitle} />
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
      <section className="mx-auto max-w-[1440px] px-6 md:px-10 pt-20 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 md:gap-10">
          {/* Featured article card */}
          <article className="card relative p-8 md:p-13">
            <div className="flex justify-between items-center mb-7">
              <span className="eyebrow">
                Featured Article{featuredArticle ? ' · Issue' : ''}
              </span>
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[color:var(--gray-500)]">
                Long read
              </span>
            </div>

            <h2 className="font-serif text-[32px] md:text-[44px] leading-[1.08] tracking-[-0.015em] text-[color:var(--ink)] font-semibold mb-6 max-w-[18ch]">
              {featuredArticle?.title ?? 'Featured Article'}
            </h2>

            <div className="hairline my-1 mb-7" />

            {featuredArticle?.pullquote && (
              <blockquote className="m-0 pl-7 border-l-2 border-[color:var(--ink)]">
                <p className="font-serif italic text-[18px] md:text-[20px] leading-[1.5] text-[color:var(--gray-700)] max-w-[46ch] m-0">
                  &ldquo;{featuredArticle.pullquote}&rdquo;
                </p>
              </blockquote>
            )}

            <div className="flex items-center justify-between mt-9">
              {featuredArticle?.author ? (
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-[38px] h-[38px] rounded-full grid place-items-center text-white font-serif italic font-semibold text-[14px]"
                    style={{ background: 'linear-gradient(135deg,#2b2a28,#0e0d0b)' }}
                    aria-hidden="true"
                  >
                    {featuredArticle.author
                      .split(' ')
                      .map((s) => s[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[color:var(--gray-500)]">
                      By
                    </div>
                    <div className="font-serif text-[16px] font-semibold text-[color:var(--ink)]">
                      {featuredArticle.author}
                    </div>
                  </div>
                </div>
              ) : (
                <span />
              )}
              <Link
                href={featuredArticle ? `/shoot/${featuredArticle.shootSlug}/article` : '/issues'}
                className="readmore"
              >
                Continue reading <span className="arrow">→</span>
              </Link>
            </div>

            <span
              aria-hidden="true"
              className="absolute top-5 right-5 font-serif italic text-[44px] leading-none text-[color:var(--gray-200)]"
            >
              §
            </span>
          </article>

          {/* Categories */}
          <aside className="card p-8 md:p-11">
            <div className="flex justify-between items-center mb-7">
              <span className="eyebrow">Categories</span>
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[color:var(--gray-400)]">
                05 · sections
              </span>
            </div>
            <div>
              {[
                { name: 'Architecture' },
                { name: 'Sustainability' },
                { name: 'Experimentalism' },
                { name: 'Commercialism' },
                { name: 'Community' },
              ].map((cat, i) => (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase()}`}
                  className="cat-row"
                >
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="name">{cat.name}</span>
                  <span className="arr">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ===== LATEST ISSUE SECTION ===== */}
      <section id="latest" className="mx-auto max-w-[1440px] px-6 md:px-10 pt-20 md:pt-24">
        <div className="mb-9">
          <div className="flex justify-between items-end gap-5">
            <div>
              <div className="eyebrow mb-4">From the Archive</div>
              <h2 className="font-serif text-[32px] md:text-[44px] tracking-[-0.015em] text-[color:var(--ink)] font-semibold leading-[1.05]">
                Read an issue
              </h2>
            </div>
            <Link href="/issues" className="readmore hidden sm:inline-flex">
              Browse all <span className="arrow">→</span>
            </Link>
          </div>
          <div className="hairline mt-7" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
          {/* Big latest tile */}
          <Link
            href={`/issue/${latestIssue?.slug ?? 'cosmic'}`}
            className="tile relative block rounded-sm overflow-hidden bg-[#111] min-h-[360px] md:h-[540px]"
          >
            {latestIssue?.cover_image_url && (
              <Image
                src={latestIssue.cover_image_url}
                alt={latestIssue.title}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            )}
            <div className="overlay absolute inset-0" />
            <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 text-white">
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-white/85">
                  Latest Issue
                </span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/55 mb-2">
                Issue No. {issueNo}
              </div>
              <h3 className="font-serif text-[44px] md:text-[68px] tracking-[-0.02em] font-semibold text-white leading-none uppercase">
                {issueTitle}
              </h3>
            </div>
            <div className="absolute left-6 md:left-8 right-6 md:right-8 bottom-6 md:bottom-8 flex items-end justify-between">
              <span className="btn-ghost">Open issue <span>→</span></span>
            </div>
          </Link>

          {/* Right column: previous + archive paper */}
          <div className="grid grid-rows-[1fr_1fr] gap-6">
            <Link
              href={`/issue/${previousIssue?.slug ?? 'savour'}`}
              className="tile relative block rounded-sm overflow-hidden bg-[#111] min-h-[220px]"
            >
              {previousIssue?.cover_image_url && (
                <Image
                  src={previousIssue.cover_image_url}
                  alt={previousIssue.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              )}
              <div className="overlay absolute inset-0" />
              <div className="absolute top-6 left-6 right-6 text-white">
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/60 mb-2.5">
                  Previous · No. {previousIssue ? String(previousIssue.issue_number).padStart(2, '0') : '01'}
                </div>
                <h4 className="font-serif text-[28px] md:text-[38px] tracking-[-0.015em] font-semibold text-white leading-none uppercase">
                  {previousIssue?.title ?? 'Savour'}
                </h4>
              </div>
              <div className="absolute left-6 right-6 bottom-5 flex items-center justify-end">
                <span className="readmore text-white/85">
                  View <span className="arrow">→</span>
                </span>
              </div>
            </Link>

            <Link
              href="/issues"
              className="tile-light relative block rounded-sm overflow-hidden paper min-h-[220px]"
            >
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div>
                  <div className="eyebrow mb-3">Archive</div>
                  <h4 className="font-serif text-[26px] md:text-[34px] tracking-[-0.015em] text-[color:var(--ink)] font-semibold leading-[1.02] max-w-[14ch]">
                    Every issue, every shoot, every letter.
                  </h4>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-[color:var(--gray-500)] mb-1">
                      Vol. I–II
                    </div>
                    <div className="font-serif text-[14px] text-[color:var(--gray-700)]">
                      since 2025
                    </div>
                  </div>
                  <span className="readmore">Browse <span className="arrow">→</span></span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER — dark dispatch ===== */}
      <section id="newsletter" className="mt-20 md:mt-24 bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-end">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-white/45 mb-5">
                The Dispatch · Quarterly
              </div>
              <h2 className="font-serif text-[40px] md:text-[72px] tracking-[-0.02em] leading-[0.98] text-white font-semibold max-w-[14ch]">
                Slow reading, in your inbox.
              </h2>
            </div>
            <div>
              <p className="font-serif italic text-[16px] md:text-[19px] text-white/75 leading-[1.55] max-w-[44ch] mb-7">
                A letter from the desk each quarter — new issues, unreleased photographs, and the occasional notebook page.
              </p>
              <NewsletterInline />
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mt-4.5">
                No spam · unsubscribe with one click
              </div>
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
