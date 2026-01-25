import Link from 'next/link';
import { Issue } from '@/types/issue';

interface IssueCardProps {
  issue: Issue;
  featured?: boolean;
}

export function IssueCard({ issue, featured = false }: IssueCardProps) {
  const issueLabel = issue.issueNumber > 0
    ? `Issue ${String(issue.issueNumber).padStart(2, '0')}`
    : 'Archive';

  if (featured) {
    return (
      <Link href={`/issues/${issue.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cover */}
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-8xl text-white/10 italic">R</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-[0.2em] uppercase">
                Current Issue
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">
              {issueLabel} — {issue.season} {issue.year}
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal mb-4 group-hover:text-gray-600 transition-colors">
              {issue.title}
            </h2>

            {issue.subtitle && (
              <p className="font-serif text-xl sm:text-2xl italic text-gray-500 mb-6">
                {issue.subtitle}
              </p>
            )}

            <p className="text-gray-600 leading-relaxed mb-8 max-w-lg">
              {issue.description}
            </p>

            <div className="mb-8">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Featured Articles</p>
              <ul className="space-y-2">
                {issue.featuredArticles.map((article, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="w-4 h-px bg-gray-300" />
                    {article}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase group-hover:text-gray-600 transition-colors">
                Read Issue
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="text-sm text-gray-400">{issue.pageCount} pages</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article>
        {/* Cover */}
        <div className="relative aspect-[3/4] bg-gray-100 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-6xl text-white/10 italic">R</span>
          </div>
        </div>

        {/* Details */}
        <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
          {issueLabel} — {issue.season} {issue.year}
        </p>

        <h3 className="font-serif text-2xl font-normal mb-2 group-hover:text-gray-600 transition-colors">
          {issue.title}
        </h3>

        {issue.subtitle && (
          <p className="font-serif text-base italic text-gray-500 mb-3">
            {issue.subtitle}
          </p>
        )}

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {issue.description}
        </p>
      </article>
    </Link>
  );
}
