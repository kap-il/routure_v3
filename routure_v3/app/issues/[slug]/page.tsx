import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIssueBySlug, getIssuePages, getIssues } from '@/lib/supabase/queries';
import { FlipbookReader } from '@/components/issues/flipbook/FlipbookReader';

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

  const pages = await getIssuePages(issue.id);

  const issueLabel = issue.issue_number > 0
    ? `Issue ${String(issue.issue_number).padStart(2, '0')}`
    : 'Archive';

  const dateLabel = formatDate(issue.publish_date);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Flipbook Reader */}
      <FlipbookReader
        issueSlug={issue.slug}
        issueTitle={issue.title}
        pageCount={issue.page_count ?? 0}
        pages={pages}
      />

      {/* Issue info footer */}
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

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white text-xs rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none sm:pointer-events-auto">
        Use arrow keys or swipe to navigate
      </div>
    </div>
  );
}
