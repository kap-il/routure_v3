import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIssueBySlug, issues } from '@/lib/data/issues';
// Flipbook code preserved but commented out - uncomment to restore page-turning engine
// import { FlipbookReader } from '@/components/issues/flipbook/FlipbookReader';

interface IssuePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return issues.map((issue) => ({
    slug: issue.slug,
  }));
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) {
    return {
      title: 'Issue Not Found | Routure',
    };
  }

  return {
    title: `${issue.title} | Routure`,
    description: issue.description,
  };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const issueLabel = issue.issueNumber > 0
    ? `Issue ${String(issue.issueNumber).padStart(2, '0')}`
    : 'Archive';

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section — Cover + Spread side by side */}
      <section className="border-b border-gray-200">
        <div className="grid md:grid-cols-2 min-h-[60vh]">
          {/* Cover Image */}
          <div className="relative bg-gray-100 overflow-hidden min-h-[50vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <span className="font-serif text-8xl text-white/20 italic mb-4">R</span>
              <h1 className="font-argue text-3xl sm:text-4xl text-white mb-2">
                {issue.title}
              </h1>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400">
                {issueLabel} — {issue.season} {issue.year}
              </p>
            </div>
          </div>

          {/* Spread Image */}
          <div className="relative bg-gray-200 overflow-hidden min-h-[40vh] md:min-h-[60vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            <div className="absolute top-4 right-4">
              <span className="text-xs tracking-[0.2em] uppercase text-white/60">Spread</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two smaller images below the spread */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/50 italic">01</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/50 italic">02</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles — Image + Article Title, clickable */}
      {issue.articles.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-8">
              In This Issue
            </p>
            <div className="space-y-12">
              {issue.articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/issues/${issue.slug}/articles/${article.slug}`}
                  className="group block"
                >
                  <article className="grid md:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-center">
                    {/* Article Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-5xl text-gray-400/50 italic">
                          {article.title.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Article Title */}
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
                        {article.category}
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal group-hover:text-gray-600 transition-colors">
                        {article.title}
                      </h2>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shoots */}
      {issue.shoots.length > 0 && (
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-8">
              Photo Editorials
            </p>
            <div className="space-y-12">
              {issue.shoots.map((shoot) => (
                <Link
                  key={shoot.slug}
                  href={`/issues/${issue.slug}/shoots/${shoot.slug}`}
                  className="group block"
                >
                  <article className="grid md:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-center">
                    {/* Shoot Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-5xl text-gray-400/50 italic">
                          {shoot.title.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Shoot Title */}
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
                        Editorial
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal group-hover:text-gray-600 transition-colors">
                        {shoot.title}
                      </h2>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*
        ========================================
        FLIPBOOK READER — COMMENTED OUT
        Uncomment the section below to restore the interactive page-turning engine.
        ========================================
      */}
      {/*
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/issues"
                className="p-2 -ml-2 hover:bg-gray-100 transition-colors"
                aria-label="Back to issues"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500">
                  {issueLabel} — {issue.season} {issue.year}
                </p>
                <h1 className="font-serif text-xl font-normal">
                  {issue.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {issue.pageCount} pages
              </span>
              <button className="p-2 hover:bg-gray-100 transition-colors" aria-label="Download">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 transition-colors" aria-label="Share">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 0m-3.935 0a2.25 2.25 0 00-2.25-2.25m2.25 2.25l-9.566-5.314" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <FlipbookReader issue={issue} />

      <section className="py-16 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl mb-4">{issue.title}</h2>
              {issue.subtitle && (
                <p className="font-serif text-xl italic text-gray-500 mb-4">
                  {issue.subtitle}
                </p>
              )}
              <p className="text-gray-600 leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
                In This Issue
              </h3>
              <ul className="space-y-3">
                {issue.featuredArticles.map((article, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <span className="font-serif text-2xl text-gray-300 italic">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-700">{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-xs rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none sm:pointer-events-auto">
        Use arrow keys or swipe to navigate
      </div>
      */}
    </div>
  );
}
