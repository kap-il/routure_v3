import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIssueBySlug } from '@/lib/supabase/queries';

interface ShootPageProps {
  params: Promise<{ slug: string; shootSlug: string }>;
}

// No static params for shoots yet — they'll be generated on demand
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ShootPageProps): Promise<Metadata> {
  const { shootSlug } = await params;
  return {
    title: `${shootSlug.replace(/-/g, ' ')} | Routure`,
    description: `Photo editorial`,
  };
}

export default async function ShootPage({ params }: ShootPageProps) {
  const { slug, shootSlug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  // Shoot title derived from slug for now (until shoots table exists in Supabase)
  const shootTitle = shootSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-white">
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8">
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

      {/* Main Image — Full width, large */}
      <section className="mt-8">
        <div className="relative w-full h-[60vh] md:h-[75vh] bg-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-8xl text-white/10 italic">
              {shootTitle.charAt(0)}
            </span>
          </div>
        </div>
      </section>

      {/* Shoot Gallery */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-argue text-3xl sm:text-4xl mb-12">{shootTitle}</h1>

        {/* Placeholder gallery — images will come from Supabase shoots table */}
        <div className="space-y-12 lg:space-y-16">
          <div className="grid md:grid-cols-[2fr_3fr] gap-6 lg:gap-8 items-start">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/30 italic">02</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/30 italic">03</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[3fr_2fr] gap-6 lg:gap-8 items-start">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/30 italic">04</span>
              </div>
            </div>
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/30 italic">05</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
