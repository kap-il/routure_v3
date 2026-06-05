import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/supabase/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Articles | Routure',
  description: 'Browse every article from Routure magazine across all issues.',
};

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getAllArticles>> = [];
  try {
    articles = await getAllArticles();
  } catch { /* fallback empty */ }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-8 md:pt-12 pb-8 md:pb-10 text-center px-5 md:px-0">
        <p className="text-[10px] md:text-[11px] tracking-[4px] uppercase text-[#AAA] font-serif mb-4">
          BROWSE
        </p>
        <h1 className="font-serif text-[36px] md:text-[48px] font-bold text-[#1a1a1a] mb-3">
          Articles
        </h1>
        <div className="mx-auto w-14 h-px bg-[#1a1a1a] mb-4" />
        <p className="text-[11px] md:text-[12px] tracking-[1px] text-[#999]">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Article List */}
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px] pb-16 md:pb-20">
        {articles.length === 0 ? (
          <p className="text-center text-[14px] text-[#999] py-16">
            No articles yet.
          </p>
        ) : (
          <div>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/shoot/${article.shootSlug}/article`}
                className="group flex flex-col md:flex-row gap-4 md:gap-8 py-7 md:py-8 md:items-start border-b"
                style={{ borderColor: '#E8E8E6' }}
              >
                {/* Preview image */}
                <div className="relative w-full md:w-[240px] shrink-0 rounded-sm overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '3/2' }}>
                  {article.heroImageUrl ? (
                    <Image
                      src={article.heroImageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
                  )}
                </div>

                {/* Article info */}
                <div className="flex-1 min-w-0 md:py-1">
                  {article.category && (
                    <p className="mb-2 text-[10px] md:text-[11px] tracking-[2px] uppercase text-[#AAA] font-serif">
                      {article.category}
                    </p>
                  )}
                  <h2 className="font-serif text-[20px] md:text-[24px] font-bold leading-[1.3] text-[#1a1a1a] mb-2 group-hover:text-[#666] transition-colors">
                    {article.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-[12px] text-[#AAA]">
                    {article.author && (
                      <>
                        <span>By {article.author}</span>
                        <span className="text-[#DDD]">·</span>
                      </>
                    )}
                    <span>{article.issueTitle} — Issue No. {article.issueNumber}</span>
                  </div>

                  <span className="inline-block mt-3 text-[10px] md:text-[11px] tracking-[1px] text-[#999] group-hover:text-[#333] transition-colors md:hidden">
                    READ ARTICLE →
                  </span>
                </div>

                {/* Arrow — desktop only */}
                <div className="hidden md:block shrink-0 pt-4">
                  <span className="text-[14px] text-[#CCC] group-hover:text-[#333] transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Back to home */}
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px] pb-12 md:pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12px] md:text-[13px] text-[#999] hover:text-[#333] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Featured
        </Link>
      </div>
    </div>
  );
}
