import { Metadata } from 'next';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueGrid } from '@/components/issues/IssueGrid';
import { getCurrentIssue, getArchiveIssues } from '@/lib/data/issues';

export const metadata: Metadata = {
  title: 'Issues | Routure',
  description: 'Browse current and past issues of Routure magazine. Experience our interactive page-turning reader.',
};

export default function IssuesPage() {
  const currentIssue = getCurrentIssue();
  const archiveIssues = getArchiveIssues();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-12 pb-8 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 animate-fade-in">
            The Collection
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal animate-slide-up">
            Issues
          </h1>
        </div>
      </section>

      {/* Current Issue - Featured */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <IssueCard issue={currentIssue} featured />
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-px bg-gray-200" />
      </div>

      {/* Archive */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <IssueGrid
            issues={archiveIssues}
            title="Archive"
            subtitle="Past Issues"
          />
        </div>
      </section>

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
  );
}
