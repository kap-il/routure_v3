import type { Metadata } from 'next';
import Link from 'next/link';
import { mockShootConcept } from '@/lib/data/mock';

interface ShootConceptPageProps {
  params: Promise<{ shootId: string }>;
}

export async function generateMetadata({ params }: ShootConceptPageProps): Promise<Metadata> {
  const { shootId } = await params;
  // TODO: fetch real shoot data
  return {
    title: `${mockShootConcept.title} | Routure`,
    description: `Photo shoot by ${mockShootConcept.photographer}`,
  };
}

/** Gradient palette for placeholder images */
const gradients = [
  'from-[#2c2c2c] to-[#1a1a1a]',
  'from-[#3a3a3a] to-[#222]',
  'from-[#444] to-[#2a2a2a]',
  'from-[#555] to-[#333]',
  'from-[#4a4a4a] to-[#2c2c2c]',
  'from-[#383838] to-[#1e1e1e]',
];

/**
 * Procedurally lay out shoot images in a repeating pattern:
 * Pattern A: Portrait (left) + Landscape (right) side by side
 * Pattern B: Full-width image
 * Pattern C: Two equal images side by side
 * Repeats for any number of images.
 */
type RowLayout =
  | { type: 'portrait-landscape'; images: number[] }
  | { type: 'full'; images: number[] }
  | { type: 'two-equal'; images: number[] };

function buildGalleryRows(imageCount: number): RowLayout[] {
  const rows: RowLayout[] = [];
  let cursor = 0;

  // Repeating pattern sequence
  const patterns: Array<{ type: RowLayout['type']; count: number }> = [
    { type: 'portrait-landscape', count: 2 },
    { type: 'full', count: 1 },
    { type: 'two-equal', count: 2 },
  ];

  let patternIdx = 0;

  while (cursor < imageCount) {
    const pattern = patterns[patternIdx % patterns.length];
    const remaining = imageCount - cursor;

    if (remaining < pattern.count) {
      // Handle leftover images
      if (remaining === 1) {
        rows.push({ type: 'full', images: [cursor] });
      } else {
        rows.push({ type: 'two-equal', images: [cursor, cursor + 1] });
      }
      break;
    }

    const indices: number[] = [];
    for (let i = 0; i < pattern.count; i++) {
      indices.push(cursor + i);
    }
    rows.push({ type: pattern.type, images: indices });

    cursor += pattern.count;
    patternIdx++;
  }

  return rows;
}

export default async function ShootConceptPage({ params }: ShootConceptPageProps) {
  const { shootId } = await params;

  // TODO: fetch real shoot data by shootId
  const shoot = mockShootConcept;
  const galleryRows = buildGalleryRows(shoot.images.length);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page type label */}
      <div className="absolute top-20 right-8 z-10">
        <span className="text-[10px] tracking-[2px] text-[#CCC] uppercase">
          SHOOT CONCEPT — NO ARTICLE
        </span>
      </div>

      {/* ===== FULL-WIDTH HERO ===== */}
      <section className="relative mx-[80px] mt-4 rounded-sm overflow-hidden" style={{ height: '640px' }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[0]}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[36px] font-bold text-white/85">
            Main Image
          </span>
          <span className="text-[12px] tracking-[3px] text-[#AAA]/60 mt-3 uppercase">
            HERO — FULL BLEED
          </span>
        </div>
      </section>

      {/* ===== SHOOT METADATA ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pt-12 pb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-4">
          PHOTO SHOOT
        </p>
        <h1 className="font-serif text-[40px] font-bold leading-[1.15] text-[#1a1a1a] mb-2">
          {shoot.title}
        </h1>
        <div className="w-28 h-px bg-[#1a1a1a] mt-4 mb-4" />
        <p className="text-[14px] text-[#777] mb-1">
          Photographed by {shoot.photographer}
        </p>
        <p className="text-[12px] text-[#AAA]">
          {shoot.issueLabel} · {shoot.imageCount} images
        </p>
      </div>

      {/* ===== GALLERY — Procedural layout ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-10">
        <div className="flex flex-col gap-5">
          {galleryRows.map((row, rowIdx) => {
            switch (row.type) {
              case 'portrait-landscape':
                return (
                  <div key={rowIdx} className="flex gap-5 items-start">
                    {/* Portrait — left */}
                    <div
                      className="relative rounded-sm overflow-hidden shrink-0"
                      style={{ width: '33%', height: '580px' }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(row.images[0] + 1) % gradients.length]}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-[20px] text-[#CCC]/70">Portrait</span>
                      </div>
                    </div>
                    {/* Landscape — right */}
                    <div
                      className="relative rounded-sm overflow-hidden flex-1"
                      style={{ height: '420px' }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(row.images[1] + 2) % gradients.length]}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-[22px] text-[#CCC]/70">Next Image</span>
                      </div>
                    </div>
                  </div>
                );

              case 'full':
                return (
                  <div key={rowIdx}>
                    <div
                      className="relative w-full rounded-sm overflow-hidden"
                      style={{ height: '480px' }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(row.images[0] + 3) % gradients.length]}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-[22px] text-[#CCC]/70">Full Width Image</span>
                      </div>
                    </div>
                  </div>
                );

              case 'two-equal':
                return (
                  <div key={rowIdx} className="flex gap-5">
                    {row.images.map((imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative flex-1 rounded-sm overflow-hidden"
                        style={{ height: '240px' }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[(imgIdx + 4) % gradients.length]}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-[18px] text-[#CCC]/70">Image</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Image captions */}
        <div className="flex justify-between mt-3">
          <span className="text-[11px] tracking-[1px] text-[#AAA]">01 / {shoot.imageCount}</span>
          <span className="text-[11px] tracking-[1px] text-[#AAA]">{String(shoot.images.length).padStart(2, '0')} / {shoot.imageCount}</span>
        </div>

        {/* Dividers between sections */}
        <div className="h-px bg-[#E8E8E6] my-6" />
      </div>

      {/* ===== CONTINUATION INDICATOR ===== */}
      <div className="text-center pb-8">
        <p className="text-[11px] tracking-[2px] text-[#AAA] uppercase">
          SO ON & SO FORTH
        </p>
        <div className="mx-auto mt-3">
          <svg className="mx-auto w-3 h-6 text-[#AAA]" viewBox="0 0 10 20" fill="none" stroke="currentColor" strokeWidth={1}>
            <line x1="5" y1="0" x2="5" y2="16" />
            <polyline points="2,13 5,18 8,13" />
          </svg>
        </div>
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
    </div>
  );
}
