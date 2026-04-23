'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Issues', href: '/issues' },
  { name: 'Shop', href: '/coming-soon' },
  { name: 'Community', href: '/coming-soon' },
];

const HEADER_OFFSET = 88;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToNewsletter(e: React.MouseEvent) {
    if (pathname === '/') {
      e.preventDefault();
      const target = document.getElementById('newsletter');
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: prefersReduce ? 'auto' : 'smooth' });
      setMobileMenuOpen(false);
    } else {
      // Cross-page: let Next navigate to / with the hash, then browser jumps.
      setMobileMenuOpen(false);
      router.push('/#newsletter');
      e.preventDefault();
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-200"
      style={{
        backgroundColor: scrolled ? 'rgba(250,250,248,0.92)' : '#FAFAF8',
        backdropFilter: scrolled ? 'saturate(140%) blur(10px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(10px)' : undefined,
        borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
      }}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-10 h-[72px] gap-6">
        {/* Logo — R mark + ROUTURE wordmark (Argue Regular, uppercase) */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="Routure — Home">
          <Image
            src="/routure_icon_black_resize.png"
            alt=""
            width={40}
            height={40}
            className="h-7 w-auto"
            priority
          />
          <span className="font-argue text-[22px] leading-none tracking-[0.08em] uppercase text-[#1A1A1A]">
            Routure
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7 justify-end">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-[color:var(--ink)] whitespace-nowrap hover:opacity-70 transition-opacity"
            >
              {item.name}
            </Link>
          ))}
          <span className="w-px h-3 bg-[color:var(--gray-200)]" aria-hidden="true" />
          <Link
            href="/#newsletter"
            onClick={scrollToNewsletter}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-[color:var(--gray-700)] whitespace-nowrap hover:text-[color:var(--ink)] transition-colors"
          >
            Subscribe →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-t border-[color:var(--rule)]">
          <div className="px-6 py-5 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block font-mono text-[12px] tracking-[0.22em] uppercase text-[color:var(--ink)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#newsletter"
              onClick={scrollToNewsletter}
              className="block font-mono text-[12px] tracking-[0.22em] uppercase text-[color:var(--gray-700)]"
            >
              Subscribe →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
