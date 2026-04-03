import { redirect } from 'next/navigation';

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateStaticParams() {
  return [];
}

/**
 * Legacy route redirect.
 * Articles are now accessed via /shoot/:shootSlug/article.
 * This page exists to avoid 404s from old links.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  redirect(`/issue/${slug}`);
}
