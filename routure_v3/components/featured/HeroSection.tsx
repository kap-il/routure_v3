import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-black text-white overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Decorative R monogram watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[80vw] h-auto max-w-4xl"
        >
          <path
            d="M20 20 Q0 60 20 100 Q40 140 80 160 L40 200 Q0 180 0 120 Q0 40 60 20 Z"
            fill="white"
          />
          <path
            d="M60 0 Q140 0 160 60 Q180 120 120 160 L180 220 L140 220 L80 152 Q140 128 128 72 Q120 32 72 32 L40 32 L40 0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 h-full min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 animate-fade-in">
            Issue 01 — Winter 2026
          </p>

          <h1 className="font-argue text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] mb-8 animate-slide-up">
            THE ART OF <br />
            <span className="italic">QUIET LUXURY</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Exploring the new era of understated elegance, where craftsmanship speaks louder than logos and timelessness trumps trends.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors"
            >
              Read Current Issue
            </Link>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors"
            >
              Browse Archive
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-xs tracking-widest uppercase text-gray-500">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
