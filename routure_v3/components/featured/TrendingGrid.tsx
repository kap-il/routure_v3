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

export function TrendingGrid() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">Explore</p>
          <h2 className="font-serif text-4xl font-normal mb-12">
            Trending Topics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
