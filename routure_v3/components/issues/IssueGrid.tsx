import { Issue } from '@/types/issue';
import { IssueCard } from './IssueCard';

interface IssueGridProps {
  issues: Issue[];
  title?: string;
  subtitle?: string;
}

export function IssueGrid({ issues, title, subtitle }: IssueGridProps) {
  if (issues.length === 0) return null;

  return (
    <section className="py-16">
      {(title || subtitle) && (
        <div className="mb-12">
          {subtitle && (
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {issues.map((issue) => (
          <IssueCard key={issue.slug} issue={issue} />
        ))}
      </div>
    </section>
  );
}
