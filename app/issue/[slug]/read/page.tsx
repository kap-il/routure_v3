import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssueBySlug, getIssues, getFlipbookPages } from '@/lib/supabase/queries';
import { FlipbookReader } from '@/components/issues/flipbook';

export const revalidate = 3600;
// Only issues that have rendered pages (page_count set) get a static /read page;
// every other slug returns a static edge 404. Appears after redeploy-on-publish.
export const dynamicParams = false;

interface ReadProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const issues = await getIssues();
    return issues.filter((i) => (i.page_count ?? 0) > 0).map((i) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ReadProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const issue = await getIssueBySlug(slug);
    if (issue) return { title: `${issue.title} — Read | Routure` };
  } catch {
    /* fall through */
  }
  return { title: 'Read | Routure' };
}

export default async function FlipbookPage({ params }: ReadProps) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);
  if (!issue || !issue.page_count) notFound();

  const pages = getFlipbookPages(issue);

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link
          href={`/issue/${slug}`}
          className="font-serif text-[13px] tracking-[1px] text-[#999] hover:text-[#1a1a1a] transition-colors"
        >
          ← Back to {issue.title}
        </Link>
        <span className="text-[10px] tracking-[2px] uppercase text-[#CCC]">Page-turner</span>
      </div>
      <FlipbookReader
        issueSlug={slug}
        issueTitle={issue.title}
        pageCount={issue.page_count}
        pages={pages}
      />
    </div>
  );
}
