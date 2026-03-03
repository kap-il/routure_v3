import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles, getIssues } from '@/lib/supabase/queries';
import type { Article, Issue } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Articles | Routure',
  description: 'Browse all articles from Routure magazine.',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function estimateReadTime(content: string | null): string {
  if (!content) return '';
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 250));
  return `${minutes} min read`;
}

export default async function ArticlesPage() {
  let articles: Article[] = [];
  let issueMap = new Map<string, Issue>();

  try {
    const [allArticles, allIssues] = await Promise.all([
      getArticles(),
      getIssues(),
    ]);
    articles = allArticles;
    for (const issue of allIssues) {
      issueMap.set(issue.id, issue);
    }
  } catch {
    // Tables may not exist yet
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="pt-12 pb-10 text-center">
        <p className="text-[11px] tracking-[4px] uppercase text-[#AAA] font-serif mb-4">
          ALL ARTICLES
        </p>
        <h1 className="font-serif text-[48px] font-bold text-[#1a1a1a] mb-3">
          Articles
        </h1>
        <div className="mx-auto w-14 h-px bg-[#1a1a1a] mb-4" />
        <p className="text-[12px] tracking-[1px] text-[#999]">
          {articles.length} article{articles.length !== 1 ? 's' : ''} published
        </p>
      </header>

      {/* Article List */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20">
        {articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[14px] text-[#999]">No articles yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E8E6]">
            {articles.map((article, idx) => {
              const issue = article.issue_id ? issueMap.get(article.issue_id) : null;
              const issueSlug = issue?.slug;
              const href = issueSlug
                ? `/issues/${issueSlug}/articles/${article.slug}`
                : '#';

              return (
                <Link
                  key={article.id}
                  href={href}
                  className="group flex gap-8 py-10 first:pt-0 items-start"
                >
                  {/* Image */}
                  <div className="relative shrink-0 w-[280px] h-[200px] rounded-sm overflow-hidden bg-[#F0EFED]">
                    {article.featured_image_url ? (
                      <Image
                        src={article.featured_image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-5xl text-white/10 italic">
                            {article.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-1">
                    {/* Meta line */}
                    <div className="flex items-center gap-3 mb-3">
                      {article.is_featured && (
                        <span className="text-[10px] tracking-[2px] uppercase text-[#999] font-serif">
                          FEATURED
                        </span>
                      )}
                      {issue && (
                        <span className="text-[11px] text-[#AAA]">
                          Issue {String(issue.issue_number).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-[26px] font-bold leading-[1.25] text-[#1a1a1a] mb-3 group-hover:text-[#666] transition-colors">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    {article.content && (
                      <p className="text-[14px] leading-[1.6] text-[#777] mb-4 line-clamp-2">
                        {article.content.substring(0, 200)}...
                      </p>
                    )}

                    {/* Footer meta */}
                    <div className="flex items-center gap-4 text-[12px] text-[#AAA]">
                      {article.author && (
                        <span>By {article.author}</span>
                      )}
                      {article.publish_date && (
                        <>
                          <span className="text-[#DDD]">·</span>
                          <span>{formatDate(article.publish_date)}</span>
                        </>
                      )}
                      {article.content && (
                        <>
                          <span className="text-[#DDD]">·</span>
                          <span>{estimateReadTime(article.content)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 pt-8">
                    <span className="text-[12px] text-[#CCC] group-hover:text-[#333] transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
