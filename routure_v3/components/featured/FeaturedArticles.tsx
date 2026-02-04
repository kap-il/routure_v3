'use client';

import Link from 'next/link';

const featuredArticles = [
  {
    id: 1,
    category: 'Culture',
    title: 'The Rise of Digital Minimalism',
    excerpt: 'How a new generation is finding peace by disconnecting from the constant noise.',
    readTime: '8 min read',
  },
  {
    id: 2,
    category: 'Style',
    title: 'Timeless Wardrobe Essentials',
    excerpt: 'Building a collection that transcends seasons and trends.',
    readTime: '6 min read',
  },
  {
    id: 3,
    category: 'Design',
    title: 'The Architecture of Calm',
    excerpt: 'Exploring spaces designed for contemplation and clarity.',
    readTime: '10 min read',
  },
  {
    id: 4,
    category: 'Lifestyle',
    title: 'Rituals of the Morning',
    excerpt: 'How the first hours shape our days and define our intentions.',
    readTime: '5 min read',
  },
];

export function FeaturedArticles() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">Featured</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal">
              Editor&apos;s Picks
            </h2>
          </div>
          <Link
            href="/issues"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {featuredArticles.map((article, index) => (
            <Link
              key={article.id}
              href="/issues"
              className="group"
            >
              <article className="flex flex-col h-full">
                {/* Placeholder image */}
                <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-6xl text-gray-400/50 italic">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs tracking-[0.2em] uppercase text-gray-500">
                      {article.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs text-gray-400">
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-3 group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/issues"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
