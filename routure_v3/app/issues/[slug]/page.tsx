import { redirect } from 'next/navigation';
import { getIssues } from '@/lib/supabase/queries';

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

/** Redirects from old /issues/:slug to new /issue/:slug route */
export default async function IssuePage({ params }: IssuePageProps) {
  const { slug } = await params;
  redirect(`/issue/${slug}`);
}
