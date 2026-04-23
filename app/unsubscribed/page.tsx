import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Unsubscribed — Routure',
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="font-serif text-[32px] font-bold text-[#1a1a1a] mb-4">
          You've been unsubscribed
        </h1>
        <p className="text-[14px] text-[#666] leading-relaxed mb-8">
          You won't receive any more emails from us. If this was a mistake, you can resubscribe anytime from our homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white text-sm tracking-wider uppercase hover:bg-gray-900 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
