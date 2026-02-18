import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedIssues, getFeaturedArticles, getIssues } from '@/lib/supabase/queries';
import { CategoriesAccordion } from '@/components/featured/CategoriesAccordion';

export default async function Home() {
  let heroIssue = null;
  let featuredArticle = null;
  let latestIssue = null;
  let categories: { name: string; articles: { title: string; slug: string; issueSlug: string }[] }[] = [];

  try {
    const [issues, articles] = await Promise.all([
      getIssues(),
      getFeaturedArticles(),
    ]);
    latestIssue = issues[0] ?? null;
    featuredArticle = articles[0] ?? null;

    // Build categories from articles
    const categoryMap = new Map<string, { name: string; articles: { title: string; slug: string; issueSlug: string }[] }>();
    for (const article of articles) {
      // Use a generic category since Supabase articles don't have category field yet
      const categoryName = 'Featured';
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { name: categoryName, articles: [] });
      }
      categoryMap.get(categoryName)!.articles.push({
        title: article.title,
        slug: article.slug,
        issueSlug: '', // Will be populated when issues have article relations
      });
    }
    categories = Array.from(categoryMap.values());
  } catch {
    // Tables may not exist yet — render with empty data
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Featured Article Image + Title */}
      {featuredArticle && (
        <section className="border-b border-gray-200">
          <Link
            href={`/issues`}
            className="group block"
          >
            <div className="grid md:grid-cols-[2fr_1fr] min-h-[70vh]">
              {/* Article Image */}
              <div className="relative bg-gray-100 overflow-hidden min-h-[50vh] md:min-h-[70vh]">
                {featuredArticle.featured_image_url ? (
                  <Image
                    src={featuredArticle.featured_image_url}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-8xl text-white/10 italic">R</span>
                    </div>
                  </>
                )}
              </div>

              {/* Featured Article Title */}
              <div className="flex items-center p-8 lg:p-12 bg-white">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-4">
                    Featured Article
                  </p>
                  <h1 className="font-argue text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                    {featuredArticle.title}
                  </h1>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured Article Card + Categories */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Featured Article Title + Brief Summary */}
            {featuredArticle && (
              <Link
                href={`/issues`}
                className="group block"
              >
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">
                    Featured
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-4 group-hover:text-gray-600 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <div className="w-12 h-px bg-black mb-4" />
                  <p className="text-gray-600 leading-relaxed">
                    {featuredArticle.content ? featuredArticle.content.substring(0, 200) + '...' : ''}
                  </p>
                </div>
              </Link>
            )}

            {/* Categories Accordion */}
            {categories.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-6">
                  Categories
                </p>
                <CategoriesAccordion categories={categories} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Issue Section */}
      {latestIssue && (
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link href={`/issues/${latestIssue.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Issue Cover */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {latestIssue.cover_image_url ? (
                    <Image
                      src={latestIssue.cover_image_url}
                      alt={latestIssue.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-8xl text-white/10 italic">R</span>
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-[0.2em] uppercase">
                      Latest Issue
                    </span>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="flex flex-col justify-center">
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
                    Latest Issue
                  </p>
                  <h2 className="font-argue text-4xl sm:text-5xl lg:text-6xl font-normal mb-4 group-hover:text-gray-600 transition-colors">
                    {latestIssue.title}
                  </h2>
                  {latestIssue.description && (
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {latestIssue.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase group-hover:text-gray-600 transition-colors">
                    Read Issue
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
