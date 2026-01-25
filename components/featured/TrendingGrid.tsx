import Link from 'next/link';

const trendingTopics = [
  {
    id: 1,
    title: 'Sustainable Fashion',
    articleCount: 12,
  },
  {
    id: 2,
    title: 'Modern Living',
    articleCount: 8,
  },
  {
    id: 3,
    title: 'Art & Photography',
    articleCount: 15,
  },
  {
    id: 4,
    title: 'Travel Essays',
    articleCount: 10,
  },
  {
    id: 5,
    title: 'Food & Culture',
    articleCount: 7,
  },
  {
    id: 6,
    title: 'Design Thinking',
    articleCount: 9,
  },
];

const shopHighlights = [
  {
    id: 1,
    name: 'Issue 01 Print Edition',
    price: '$24',
    tag: 'New',
  },
  {
    id: 2,
    name: 'Routure Tote Bag',
    price: '$38',
    tag: 'Popular',
  },
  {
    id: 3,
    name: 'Annual Subscription',
    price: '$89',
    tag: 'Save 20%',
  },
];

export function TrendingGrid() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Trending Topics */}
          <div className="lg:col-span-2">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">Explore</p>
            <h2 className="font-serif text-4xl font-normal mb-12">
              Trending Topics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trendingTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href="/issues"
                  className="group flex items-center justify-between p-6 bg-white border border-gray-200 hover:border-black transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-lg mb-1 group-hover:text-gray-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {topic.articleCount} articles
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Highlights */}
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">Shop</p>
            <h2 className="font-serif text-4xl font-normal mb-12">
              Featured
            </h2>

            <div className="space-y-6">
              {shopHighlights.map((item) => (
                <Link
                  key={item.id}
                  href="/shop"
                  className="group block p-6 bg-white border border-gray-200 hover:border-black transition-colors"
                >
                  {/* Placeholder product image */}
                  <div className="aspect-square bg-gray-100 mb-4 flex items-center justify-center">
                    <span className="text-4xl text-gray-300">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block text-xs tracking-wide uppercase bg-black text-white px-2 py-1 mb-2">
                        {item.tag}
                      </span>
                      <h3 className="font-medium group-hover:text-gray-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <span className="font-medium">{item.price}</span>
                  </div>
                </Link>
              ))}

              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide uppercase hover:text-gray-600 transition-colors"
              >
                Visit Shop
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
