import Link from 'next/link';

const footerColumns = [
  {
    heading: 'Magazine',
    links: [
      { name: 'Current Issue', href: '/issues' },
      { name: 'Archive', href: '/issues' },
      { name: 'Subscribe', href: '/#newsletter' },
      { name: 'Letters', href: '/coming-soon' },
    ],
  },
  {
    heading: 'Shop',
    links: [
      { name: 'All Products', href: '/coming-soon' },
      { name: 'New Arrivals', href: '/coming-soon' },
      { name: 'Best Sellers', href: '/coming-soon' },
      { name: 'Gift Cards', href: '/coming-soon' },
    ],
  },
  {
    heading: 'Routure',
    links: [
      { name: 'About', href: '/coming-soon' },
      { name: 'Masthead', href: '/coming-soon' },
      { name: 'Contact', href: '/coming-soon' },
      { name: 'Careers', href: '/coming-soon' },
    ],
  },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/routuremagazine/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@routure' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/routure-magazine/' },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 pt-20 md:pt-[80px] pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 md:gap-[60px] mb-16 md:mb-[72px]">
          {/* Wordmark + description + social pills */}
          <div>
            <div className="font-serif text-[36px] md:text-[44px] font-semibold tracking-[-0.02em] leading-none mb-4">
              Routure
            </div>
            <p className="font-serif italic text-[15px] md:text-[16px] leading-[1.5] text-white/60 max-w-[38ch] m-0">
              A curated magazine experience exploring the intersection of culture, style, and contemporary life.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-[0.2em] uppercase px-3.5 py-2.5 rounded-full border border-white/20 text-white/70 hover:border-white hover:text-white transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/45 mb-5 md:mb-[22px]">
                {col.heading}
              </div>
              <ul className="m-0 p-0 list-none grid gap-3.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14px] md:text-[15px] text-white/80 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10 mb-6" />
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/40">
            © {new Date().getFullYear()} Routure Magazine · All rights reserved
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/40">
            Privacy · Terms · Cookies
          </div>
        </div>
      </div>
    </footer>
  );
}
