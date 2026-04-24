import '../plan-c/tokens.css';
import CustomCursor from '@/components/plan-c/primitives/CustomCursor';
import Masthead from '@/components/plan-c/sections/Masthead';
import Hero from '@/components/plan-c/sections/Hero';
import ShootGallery from '@/components/plan-c/sections/ShootGallery';
import PullquoteBand from '@/components/plan-c/sections/PullquoteBand';
import CategoryArchive from '@/components/plan-c/sections/CategoryArchive';
import LetterFromBoard from '@/components/plan-c/sections/LetterFromBoard';
import MegaFooter from '@/components/plan-c/sections/MegaFooter';

export const metadata = {
  title: 'Routure — Continuous (Plan C)',
};

export default function Continuous() {
  return (
    <div data-routure="plan-c">
      <CustomCursor />
      <Masthead />
      <Hero />
      <ShootGallery />
      <PullquoteBand />
      <CategoryArchive />
      <LetterFromBoard />
      <MegaFooter />
    </div>
  );
}
