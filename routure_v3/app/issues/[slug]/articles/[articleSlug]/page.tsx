import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getArticles, getIssues, getIssueBySlug } from '@/lib/supabase/queries';

interface ArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateStaticParams() {
  try {
    const [issues, articles] = await Promise.all([getIssues(), getArticles()]);
    const params: { slug: string; articleSlug: string }[] = [];
    for (const article of articles) {
      const issue = issues.find((i) => i.id === article.issue_id);
      if (issue) {
        params.push({ slug: issue.slug, articleSlug: article.slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);

  if (!article) {
    return { title: 'Article Not Found | Routure' };
  }

  return {
    title: `${article.title} | Routure`,
    description: article.content ? article.content.substring(0, 160) : undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, articleSlug } = await params;
  const [article, issue] = await Promise.all([
    getArticleBySlug(articleSlug),
    getIssueBySlug(slug),
  ]);

  if (!article || !issue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Full Spread Image — No modifications, fill to size */}
      <section className="relative w-full h-[70vh] md:h-[80vh] bg-gray-200 overflow-hidden">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-8xl text-white/10 italic">
                {article.title.charAt(0)}
              </span>
            </div>
          </>
        )}
      </section>

      {/* Article Content */}
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
          <h1 className="font-argue text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6">
            {article.title}
          </h1>
          {article.author && (
            <p className="text-sm tracking-[0.2em] uppercase text-gray-500">
              By {article.author}
            </p>
          )}
        </header>

        {/* Article Body */}
        {article.content && (
          <div className="max-w-3xl">
            <div className="prose prose-lg prose-gray">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
