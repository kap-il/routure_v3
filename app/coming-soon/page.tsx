import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Coming Soon | Routure',
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-6">
          COMING SOON
        </p>
        <h1 className="font-serif text-[48px] font-bold leading-[1.15] text-[#1a1a1a] mb-4">
          Something New Is Brewing
        </h1>
        <div className="w-20 h-px bg-[#1a1a1a] mx-auto mt-6 mb-6" />
        <p className="text-[15px] text-[#777] max-w-md mx-auto leading-relaxed mb-10">
          We're working on something special. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full border border-[#1a1a1a] text-[11px] tracking-[1.5px] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
