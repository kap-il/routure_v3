import { HeroSection } from '@/components/featured/HeroSection';
import { FeaturedArticles } from '@/components/featured/FeaturedArticles';
import { TrendingGrid } from '@/components/featured/TrendingGrid';
import { NewsletterSignup } from '@/components/featured/NewsletterSignup';
import { getFeaturedIssues, getFeaturedArticles } from '@/lib/supabase/queries';

export default async function Home() {
  let heroIssue = null;
  let featuredArticles: Awaited<ReturnType<typeof getFeaturedArticles>> = [];

  try {
    const [issues, articles] = await Promise.all([
      getFeaturedIssues(),
      getFeaturedArticles(),
    ]);
    heroIssue = issues[0] ?? null;
    featuredArticles = articles;
  } catch {
    // Tables may not exist yet — render with empty data
  }

  return (
    <>
      <HeroSection featuredIssue={heroIssue} />
      <FeaturedArticles articles={featuredArticles} />
      <TrendingGrid />
      <NewsletterSignup />
    </>
  );
}
