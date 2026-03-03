import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ===== HERO — Featured Article Image + Title Overlay ===== */}
      <section>
        <div className="mx-auto max-w-[1280px] px-[80px]">
          <div className="relative mt-10 rounded-sm overflow-hidden" style={{ height: '480px' }}>
            {/* Article image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />

            {/* Featured article title overlay — right side */}
            <div className="absolute right-0 top-0 bottom-0 w-[390px] bg-[#111111]/75 flex items-center">
              <div className="px-14 py-12">
                <p className="text-[11px] tracking-[3px] uppercase text-[#AAA] mb-6 font-serif">
                  FEATURED
                </p>
                <h1 className="font-serif text-[38px] font-bold leading-[1.2] text-white mb-6">
                  The Silent
                  <br />
                  Language of
                  <br />
                  Design
                </h1>
                <div className="w-20 h-px bg-white/50 mb-6" />
                <p className="text-[13px] text-[#CCC] mb-16">
                  By Alexandra Chen
                </p>
                <Link
                  href="#"
                  className="text-[11px] tracking-[1.5px] text-[#AAA] hover:text-white transition-colors"
                >
                  READ NOW →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] mt-12">
        <div className="h-px bg-[#E0E0E0]" />
      </div>

      {/* ===== FEATURED ARTICLE SUMMARY + CATEGORIES ===== */}
      <section className="mx-auto max-w-[1280px] px-[80px] py-10">
        <div className="grid grid-cols-2 gap-10">
          {/* Left — Editor's Pick article card */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-10">
            <p className="text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-6">
              EDITOR&apos;S PICK
            </p>
            <h2 className="font-serif text-[30px] font-bold leading-[1.25] text-[#1a1a1a] mb-4">
              Reimagining
              <br />
              Urban Spaces
            </h2>
            <div className="h-px bg-[#E0E0E0] mb-6" />
            <p className="text-[14px] leading-[1.6] text-[#666] mb-8">
              A deep exploration of how contemporary
              <br />
              architects are reshaping the way we interact
              <br />
              with public and private environments,
              <br />
              balancing function with beauty.
            </p>
            <p className="text-[13px] text-[#999] mb-10">
              Spring 2026 · 12 min read
            </p>
            <Link
              href="#"
              className="text-[11px] tracking-[1.5px] font-medium text-[#1a1a1a] hover:text-[#666] transition-colors"
            >
              CONTINUE READING →
            </Link>
          </div>

          {/* Right — Categories list */}
          <div className="border border-[#EAEAEA] rounded-sm bg-white p-10">
            <p className="text-[12px] tracking-[2.5px] uppercase text-[#999] font-serif mb-8">
              CATEGORIES
            </p>
            <div className="space-y-0">
              {[
                { name: 'Architecture', count: 12 },
                { name: 'Photography', count: 24 },
                { name: 'Fashion', count: 18 },
                { name: 'Culture', count: 31 },
                { name: 'Travel', count: 9 },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href="#"
                  className="flex items-center justify-between py-5 border-b border-[#EAEAEA] last:border-b-0 group"
                >
                  <span className="font-serif text-[20px] font-bold text-[#1a1a1a] group-hover:text-[#666] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[14px] text-[#AAA]">
                    {cat.count} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST ISSUE SECTION ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px]">
        <div className="h-px bg-[#E0E0E0]" />
      </div>

      <section className="mx-auto max-w-[1280px] px-[80px] py-10">
        <p className="text-[11px] tracking-[3px] font-medium uppercase text-[#999] mb-5">
          LATEST ISSUE
        </p>

        <div className="grid grid-cols-[620px_1fr] gap-5">
          {/* Main issue card */}
          <Link
            href="/issue/spring-2026"
            className="group relative rounded-sm overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center text-center"
            style={{ height: '480px' }}
          >
            <h3 className="font-serif text-[36px] font-bold text-white/90 mb-2">
              Issue No. 24
            </h3>
            <p className="font-serif text-[16px] text-[#AAA] mb-6">
              Spring 2026
            </p>
            <div className="w-24 h-px bg-[#555] mb-8" />
            <p className="text-[13px] text-[#777] mb-8">
              8 Articles · 4 Photo Shoots
            </p>
            <span className="inline-block px-8 py-2.5 rounded-full border border-[#777] text-[11px] tracking-[1.5px] text-[#AAA] group-hover:border-white group-hover:text-white transition-colors">
              VIEW ISSUE
            </span>
          </Link>

          {/* Right column — Previous + Archive cards stacked */}
          <div className="grid grid-cols-2 gap-5">
            <Link
              href="#"
              className="group rounded-sm bg-[#F0EFED] flex flex-col items-center justify-center text-center"
              style={{ height: '230px' }}
            >
              <p className="text-[11px] tracking-[2px] uppercase text-[#999] font-serif mb-4">
                PREVIOUS
              </p>
              <h4 className="font-serif text-[18px] font-bold text-[#1a1a1a] mb-2">
                Issue No. 23
              </h4>
              <p className="text-[12px] text-[#777] mb-6">
                Winter 2025
              </p>
              <span className="text-[10px] tracking-[1px] text-[#999] group-hover:text-[#333] transition-colors">
                VIEW →
              </span>
            </Link>

            <Link
              href="#"
              className="group rounded-sm bg-[#F0EFED] flex flex-col items-center justify-center text-center"
              style={{ height: '230px' }}
            >
              <p className="text-[11px] tracking-[2px] uppercase text-[#999] font-serif mb-4">
                ARCHIVE
              </p>
              <h4 className="font-serif text-[18px] font-bold text-[#1a1a1a] mb-2">
                All Issues
              </h4>
              <p className="text-[12px] text-[#777] mb-6">
                24 Issues Published
              </p>
              <span className="text-[10px] tracking-[1px] text-[#999] group-hover:text-[#333] transition-colors">
                BROWSE →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
