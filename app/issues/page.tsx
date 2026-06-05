import { Metadata } from 'next';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueGrid } from '@/components/issues/IssueGrid';
import GridFlipReveal from '@/components/GridFlipReveal';
import { getIssues, getShootHeroPool } from '@/lib/supabase/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Issues | Routure',
  description: 'Browse current and past issues of Routure magazine.',
};

export default async function IssuesPage() {
  let allIssues: Awaited<ReturnType<typeof getIssues>> = [];
  let heroPool: string[] = [];
  try {
    [allIssues, heroPool] = await Promise.all([getIssues(), getShootHeroPool()]);
  } catch {
    // Tables may not exist yet
  }
  const currentIssue = allIssues[0] ?? null;
  const archiveIssues = allIssues.slice(1);

  return (
    <GridFlipReveal flashImages={heroPool}>
    <div className="min-h-screen">
      {/* Hero — matches Community page header style */}
      <section className="px-6 pt-32 pb-20 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] mb-6 animate-slide-up">
            Issues
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in">
            The Archive.
          </p>
        </div>
      </section>

      {/* Current Issue - Featured */}
      {currentIssue && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <IssueCard issue={currentIssue} featured />
          </div>
        </section>
      )}

      {/* Divider */}
      {archiveIssues.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="h-px bg-gray-200" />
        </div>
      )}

      {/* Archive */}
      {archiveIssues.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <IssueGrid
              issues={archiveIssues}
              title="Archive"
              subtitle="Past Issues"
            />
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-24 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">
            Never Miss an Issue
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal mb-6">
            Subscribe to Routure
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Be the first to know when new issues drop. Plus, get exclusive content and behind-the-scenes access.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
    </GridFlipReveal>
  );
}
