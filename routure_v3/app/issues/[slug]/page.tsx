import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIssueBySlug, getIssuePages, getIssues, getArticles } from '@/lib/supabase/queries';
// Flipbook code preserved but commented out - uncomment to restore page-turning engine
// import { FlipbookReader } from '@/components/issues/flipbook/FlipbookReader';

interface IssuePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const issues = await getIssues();
    return issues.map((issue) => ({ slug: issue.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    return {
      title: 'Issue Not Found | Routure',
    };
  }

  return {
    title: `${issue.title} | Routure`,
    description: issue.description ?? undefined,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  // Fetch articles for this issue
  let issueArticles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    const allArticles = await getArticles();
    issueArticles = allArticles.filter((a) => a.issue_id === issue.id);
  } catch {
    // Articles table may not exist yet
  }

  const issueLabel = issue.issue_number > 0
    ? `Issue ${String(issue.issue_number).padStart(2, '0')}`
    : 'Archive';

  const dateLabel = formatDate(issue.publish_date);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section — Cover + Spread side by side */}
      <section className="border-b border-gray-200">
        <div className="grid md:grid-cols-2 min-h-[60vh]">
          {/* Cover Image */}
          <div className="relative bg-gray-100 overflow-hidden min-h-[50vh]">
            {issue.cover_image_url ? (
              <img
                src={issue.cover_image_url}
                alt={issue.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <span className="font-serif text-8xl text-white/20 italic mb-4">R</span>
              <h1 className="font-argue text-3xl sm:text-4xl text-white mb-2">
                {issue.title}
              </h1>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400">
                {issueLabel} — {dateLabel}
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
      {issueArticles.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-8">
              In This Issue
            </p>
            <div className="space-y-12">
              {issueArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/issues/${issue.slug}/articles/${article.slug}`}
                  className="group block"
                >
                  <article className="grid md:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-center">
                    {/* Article Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      {article.featured_image_url ? (
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-5xl text-gray-400/50 italic">
                              {article.title.charAt(0)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Article Title */}
                    <div>
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

      {/* Issue description */}
      {issue.description && (
        <section className="py-16 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl mb-4">{issue.title}</h2>
              <p className="text-gray-600 leading-relaxed">
                {issue.description}
              </p>
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
                  {issueLabel} — {dateLabel}
                </p>
                <h1 className="font-serif text-xl font-normal">
                  {issue.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {issue.page_count && (
                <span className="text-sm text-gray-500 hidden sm:block">
                  {issue.page_count} pages
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <FlipbookReader
        issueSlug={issue.slug}
        issueTitle={issue.title}
        pageCount={issue.page_count ?? 0}
        pages={pages}
      />

      {issue.description && (
        <section className="py-16 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl mb-4">{issue.title}</h2>
              <p className="text-gray-600 leading-relaxed">
                {issue.description}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-xs rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none sm:pointer-events-auto">
        Use arrow keys or swipe to navigate
      </div>
      */}
    </div>
  );
}
