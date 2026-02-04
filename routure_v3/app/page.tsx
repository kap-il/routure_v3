import { HeroSection } from '@/components/featured/HeroSection';
import { FeaturedArticles } from '@/components/featured/FeaturedArticles';
import { TrendingGrid } from '@/components/featured/TrendingGrid';
import { NewsletterSignup } from '@/components/featured/NewsletterSignup';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedArticles />
      <TrendingGrid />
      <NewsletterSignup />
    </>
  );
}
