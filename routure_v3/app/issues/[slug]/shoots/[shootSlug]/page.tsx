import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getShootBySlug, issues } from '@/lib/data/issues';

interface ShootPageProps {
  params: Promise<{ slug: string; shootSlug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; shootSlug: string }[] = [];
  for (const issue of issues) {
    for (const shoot of issue.shoots) {
      params.push({ slug: issue.slug, shootSlug: shoot.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ShootPageProps): Promise<Metadata> {
  const { slug, shootSlug } = await params;
  const result = getShootBySlug(slug, shootSlug);

  if (!result) {
    return { title: 'Shoot Not Found | Routure' };
  }

  return {
    title: `${result.shoot.title} | Routure`,
    description: `Photo editorial: ${result.shoot.title}`,
  };
}

export default async function ShootPage({ params }: ShootPageProps) {
  const { slug, shootSlug } = await params;
  const result = getShootBySlug(slug, shootSlug);

  if (!result) {
    notFound();
  }

  const { issue, shoot } = result;

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
              {shoot.title.charAt(0)}
            </span>
          </div>
        </div>
      </section>

      {/* Alternating portrait + landscape image pairs */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-argue text-3xl sm:text-4xl mb-12">{shoot.title}</h1>

        <div className="space-y-12 lg:space-y-16">
          {shoot.images.slice(1).map((_, index) => {
            // Create alternating layout: portrait (left) + landscape (right), then repeat
            if (index % 2 === 0) {
              return (
                <div key={index} className="grid md:grid-cols-[2fr_3fr] gap-6 lg:gap-8 items-start">
                  {/* Portrait image (narrower, taller) */}
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-4xl text-gray-500/30 italic">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Landscape image (wider, shorter) */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-4xl text-gray-500/30 italic">
                        {String(index + 3).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* If odd number of remaining images, show last one full width */}
          {(shoot.images.length - 1) % 2 !== 0 && (
            <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-4xl text-gray-500/30 italic">
                  {String(shoot.images.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
