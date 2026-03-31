import { redirect } from 'next/navigation';

interface ShootPageProps {
  params: Promise<{ slug: string; shootSlug: string }>;
}

export async function generateStaticParams() {
  return [];
}

/**
 * Legacy route redirect.
 * Shoots are now accessed via /shoot/:shootSlug.
 */
export default async function ShootPage({ params }: ShootPageProps) {
  const { shootSlug } = await params;
  redirect(`/shoot/${shootSlug}`);
}
