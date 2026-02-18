import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, issues } from '@/lib/data/issues';

interface ArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; articleSlug: string }[] = [];
  for (const issue of issues) {
    for (const article of issue.articles) {
      params.push({ slug: issue.slug, articleSlug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug, articleSlug } = await params;
  const result = getArticleBySlug(slug, articleSlug);

  if (!result) {
    return { title: 'Article Not Found | Routure' };
  }

  return {
    title: `${result.article.title} | Routure`,
    description: result.article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, articleSlug } = await params;
  const result = getArticleBySlug(slug, articleSlug);

  if (!result) {
    notFound();
  }

  const { issue, article } = result;

  return (
    <div className="min-h-screen bg-white">
      {/* Full Spread Image — No modifications, fill to size */}
      <section className="relative w-full h-[70vh] md:h-[80vh] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-8xl text-white/10 italic">
            {article.title.charAt(0)}
          </span>
        </div>
      </section>

      {/* Article Content — Alternating text + image layout */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
        {/* Back link */}
        <div className="mb-12">
          <Link
            href={`/issues/${issue.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {issue.title}
          </Link>
        </div>

        {/* Article Title */}
        <header className="mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
            {article.category}
          </p>
          <h1 className="font-argue text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            {article.summary}
          </p>
        </header>

        {/* Content Sections — Alternating article text + image */}
        <div className="space-y-16 lg:space-y-24">
          {article.content.map((section, index) => {
            const isEven = index % 2 === 0;

            if (section.type === 'text') {
              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-8 lg:gap-16 items-start ${
                    !isEven ? 'md:grid-cols-[1fr_1fr]' : 'md:grid-cols-[1fr_1fr]'
                  }`}
                >
                  {/* Text on alternating sides */}
                  <div className={`${!isEven ? 'md:order-2' : ''}`}>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {section.content}
                    </p>
                  </div>

                  {/* Companion image placeholder (from next content item if image) */}
                  {index + 1 < article.content.length && article.content[index + 1].type === 'image' ? (
                    <div className={`relative aspect-[3/4] bg-gray-100 overflow-hidden ${!isEven ? 'md:order-1' : ''}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                    </div>
                  ) : (
                    <div className={`${!isEven ? 'md:order-1' : ''}`} />
                  )}
                </div>
              );
            }

            // Skip standalone images that were already paired with text above
            if (section.type === 'image' && index > 0 && article.content[index - 1].type === 'text') {
              return null;
            }

            // Standalone image (not paired with text)
            if (section.type === 'image') {
              return (
                <div key={index} className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
