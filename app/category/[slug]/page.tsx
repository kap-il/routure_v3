import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByCategory, CATEGORIES } from '@/lib/supabase/queries';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/** Map slug back to the canonical category name */
function categoryNameFromSlug(slug: string): string | null {
  return CATEGORIES.find((c) => c.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = categoryNameFromSlug(slug) ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${name} | Routure`,
    description: `Browse ${name} articles from Routure magazine.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const name = categoryNameFromSlug(slug) ?? slug.charAt(0).toUpperCase() + slug.slice(1);

  let articles: Awaited<ReturnType<typeof getArticlesByCategory>> = [];
  try {
    articles = await getArticlesByCategory(name);
  } catch { /* fallback empty */ }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="pt-12 pb-10 text-center">
        <p className="text-[11px] tracking-[4px] uppercase text-[#AAA] font-serif mb-4">
          CATEGORY
        </p>
        <h1 className="font-serif text-[48px] font-bold text-[#1a1a1a] mb-3">
          {name}
        </h1>
        <div className="mx-auto w-14 h-px bg-[#1a1a1a] mb-4" />
        <p className="text-[12px] tracking-[1px] text-[#999]">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Article List */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20">
        {articles.length === 0 ? (
          <p className="text-center text-[14px] text-[#999] py-16">
            No articles in this category yet.
          </p>
        ) : (
          <div className="divide-y divide-[#E8E8E6]">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/shoot/${article.shootSlug}/article`}
                className="group flex gap-8 py-8 items-start"
              >
                {/* Preview image */}
                <div className="relative shrink-0 w-[240px] h-[160px] rounded-sm overflow-hidden bg-[#1a1a1a]">
                  {article.heroImageUrl ? (
                    <Image
                      src={article.heroImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
                  )}
                </div>

                {/* Article info */}
                <div className="flex-1 min-w-0 py-1">
                  <h2 className="font-serif text-[24px] font-bold leading-[1.3] text-[#1a1a1a] mb-2 group-hover:text-[#666] transition-colors">
                    {article.title}
                  </h2>

                  <div className="flex items-center gap-3 text-[12px] text-[#AAA]">
                    {article.author && (
                      <>
                        <span>By {article.author}</span>
                        <span className="text-[#DDD]">·</span>
                      </>
                    )}
                    <span>{article.issueTitle} — Issue No. {article.issueNumber}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 pt-4">
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
      <div className="mx-auto max-w-[1280px] px-[80px] pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-[#999] hover:text-[#333] transition-colors"
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
