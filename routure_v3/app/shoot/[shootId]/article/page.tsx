import type { Metadata } from 'next';
import Link from 'next/link';
import { mockShootArticle } from '@/lib/data/mock';

interface ShootArticlePageProps {
  params: Promise<{ shootId: string }>;
}

export async function generateMetadata({ params }: ShootArticlePageProps): Promise<Metadata> {
  const { shootId } = await params;
  // TODO: fetch real shoot data
  return {
    title: `${mockShootArticle.article.title} | Routure`,
    description: `Photo shoot + article by ${mockShootArticle.article.author}`,
  };
}

/** Gradient palette for placeholder images */
const gradients = [
  'from-[#252525] to-[#1a1a1a]',
  'from-[#444] to-[#2a2a2a]',
  'from-[#3a3a3a] to-[#222]',
  'from-[#4a4a4a] to-[#2c2c2c]',
  'from-[#555] to-[#333]',
  'from-[#383838] to-[#1e1e1e]',
];

export default async function ShootArticlePage({ params }: ShootArticlePageProps) {
  const { shootId } = await params;

  // TODO: fetch real shoot + article data by shootId
  const shoot = mockShootArticle;
  const { article, images } = shoot;

  // Interleave article sections with images:
  // Each pair = one text section + one image, alternating sides
  const pairs: { text: string; imageIdx: number; textLeft: boolean }[] = [];
  const maxPairs = Math.max(article.sections.length, images.length);

  for (let i = 0; i < maxPairs; i++) {
    if (i < article.sections.length) {
      pairs.push({
        text: article.sections[i],
        imageIdx: i < images.length ? i : -1,
        textLeft: i % 2 === 0,
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ===== FULL SPREAD HERO — edge to edge, no modifications ===== */}
      <section className="relative w-full" style={{ height: '700px' }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[0]}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[40px] font-bold text-white/85">
            Full Spread Image
          </span>
          <span className="text-[12px] tracking-[3px] text-[#AAA]/50 mt-3 uppercase">
            EDGE TO EDGE — NO MODIFICATIONS — FILL TO SIZE
          </span>
        </div>
      </section>

      {/* ===== ARTICLE HEADER ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pt-14 pb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-4">
          PHOTO SHOOT + ARTICLE
        </p>
        <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a1a] mb-2">
          {article.title}
        </h1>
        <div className="w-28 h-px bg-[#1a1a1a] mt-4 mb-4" />
        <p className="text-[13px] text-[#777]">
          By {article.author} · Photographed by {shoot.photographer}
        </p>
      </div>

      {/* ===== ALTERNATING TEXT + IMAGE SECTIONS ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20">
        {pairs.map((pair, idx) => (
          <div key={idx}>
            <div
              className="flex gap-10 items-start py-10"
              style={{ flexDirection: pair.textLeft ? 'row' : 'row-reverse' }}
            >
              {/* Text column */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] leading-[1.85] text-[#555]">
                  {pair.text}
                </p>
              </div>

              {/* Image column */}
              {pair.imageIdx >= 0 && (
                <div
                  className="shrink-0 rounded-sm overflow-hidden relative"
                  style={{
                    width: pair.textLeft ? '48%' : '33%',
                    height: images[pair.imageIdx].aspectRatio < 1 ? '560px' : '480px',
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(pair.imageIdx + 1) % gradients.length]}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-[20px] text-[#CCC]/70">
                      {pair.textLeft ? 'Next Image' : 'Image'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider between sections */}
            {idx < pairs.length - 1 && (
              <div className="h-px bg-[#E8E8E6]" />
            )}
          </div>
        ))}
      </div>

      {/* ===== CONTINUATION INDICATOR ===== */}
      <div className="text-center pb-16">
        <p className="font-serif text-[16px] text-[#AAA] tracking-[1px] mb-2">
          — Alternating pattern continues —
        </p>
        <p className="text-[12px] text-[#CCC]">
          Article text ↔ Image · Image ↔ Article text
        </p>
      </div>

      {/* ===== BACK TO ISSUE ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-16">
        <Link
          href="/issue/spring-2026"
          className="inline-flex items-center gap-2 text-[13px] text-[#999] hover:text-[#333] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Issue
        </Link>
      </div>

      {/* ===== PAGE LABEL ===== */}
      <div className="pb-12 text-center">
        <p className="text-[10px] tracking-[2px] text-[#CCC] uppercase">
          SHOOT WITH ARTICLE VIEW
        </p>
      </div>
    </div>
  );
}
