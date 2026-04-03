import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getShootBySlug, getIssueForShoot, getIssues, getIssueMosaicData } from '@/lib/supabase/queries';
import { mockShootConcept } from '@/lib/data/mock';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const issues = await getIssues();
    const allShoots: { slug: string }[] = [];
    for (const issue of issues) {
      const items = await getIssueMosaicData(issue.id);
      const slugs = [...new Set(items.map(i => i.shootSlug))];
      allShoots.push(...slugs.map(s => ({ slug: s })));
    }
    return allShoots;
  } catch {
    return [];
  }
}

interface ShootConceptPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShootConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const shoot = await getShootBySlug(slug);
    if (shoot) return { title: `${shoot.title} | Routure` };
  } catch { /* fall through */ }
  return { title: `${mockShootConcept.title} | Routure` };
}

type GalleryImage = { url: string; width: number; height: number; aspectRatio: number };

type RowLayout =
  | { type: 'full'; images: GalleryImage[] }
  | { type: 'two'; images: GalleryImage[] }
  | { type: 'three'; images: GalleryImage[] };

function buildGalleryRows(images: GalleryImage[]): RowLayout[] {
  const rows: RowLayout[] = [];
  let cursor = 0;
  const patterns: { type: RowLayout['type']; count: number }[] = [
    { type: 'two', count: 2 },
    { type: 'full', count: 1 },
    { type: 'three', count: 3 },
    { type: 'two', count: 2 },
    { type: 'full', count: 1 },
  ];
  let patternIdx = 0;

  while (cursor < images.length) {
    const pattern = patterns[patternIdx % patterns.length];
    const remaining = images.length - cursor;
    const count = Math.min(pattern.count, remaining);
    const type: RowLayout['type'] = count === 1 ? 'full' : count === 2 ? 'two' : 'three';
    rows.push({ type, images: images.slice(cursor, cursor + count) });
    cursor += count;
    patternIdx++;
  }
  return rows;
}

export default async function ShootConceptPage({ params }: ShootConceptPageProps) {
  const { slug } = await params;

  let title = mockShootConcept.title;
  let issueLabel = mockShootConcept.issueLabel;
  let imageCount = mockShootConcept.imageCount;
  let credits: Record<string, string> | null = null;
  let heroImage: GalleryImage | null = null;
  let galleryImages: GalleryImage[] = [];
  let backHref = '/issue/spring-2026';
  let useMock = true;

  try {
    const [shoot, issue] = await Promise.all([
      getShootBySlug(slug),
      getIssueForShoot(slug),
    ]);
    if (shoot && shoot.images.length > 0) {
      useMock = false;
      title = shoot.title;
      credits = shoot.credits;
      const photoImages = shoot.images.filter(img => !img.is_article_page);
      imageCount = photoImages.length;

      const toGallery = (img: typeof photoImages[0]): GalleryImage => ({
        url: img.image_url,
        width: img.width,
        height: img.height,
        aspectRatio: Number(img.aspect_ratio),
      });

      heroImage = photoImages[0] ? toGallery(photoImages[0]) : null;
      galleryImages = photoImages.slice(1).map(toGallery);

      if (issue) {
        issueLabel = issue.title;
        backHref = `/issue/${issue.slug}`;
      }
    }
  } catch {
    // Tables may not exist yet
  }

  const galleryRows = buildGalleryRows(galleryImages);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ===== FULL-WIDTH HERO ===== */}
      <section className="mx-6 sm:mx-[80px] mt-4 rounded-sm overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={title}
            width={heroImage.width}
            height={heroImage.height}
            className="w-full h-auto"
            priority
            sizes="100vw"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full aspect-[3/2] bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] flex items-center justify-center">
            <span className="font-serif text-[36px] font-bold text-white/85">Main Image</span>
          </div>
        )}
      </section>

      {/* ===== SHOOT METADATA ===== */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pt-12 pb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-4">PHOTO SHOOT</p>
        <h1 className="font-serif text-[40px] font-bold leading-[1.15] text-[#1a1a1a] mb-2">{title}</h1>
        <div className="w-28 h-px bg-[#1a1a1a] mt-4 mb-4" />
        {credits && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-3 mb-4">
            {Object.entries(credits).map(([role, names]) => (
              <div key={role}>
                <p className="text-[11px] tracking-[1px] uppercase text-[#999] mb-0.5">{role}</p>
                <p className="text-[13px] text-[#555]">{names}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-[12px] text-[#AAA]">{issueLabel} · {imageCount} images</p>
      </div>

      {/* ===== GALLERY — natural aspect ratios, no cropping ===== */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-10">
        <div className="flex flex-col gap-4">
          {galleryRows.map((row, rowIdx) => {
            if (row.type === 'full') {
              const img = row.images[0];
              return (
                <div key={rowIdx} className="rounded-sm overflow-hidden">
                  <Image
                    src={img.url}
                    alt=""
                    width={img.width}
                    height={img.height}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) calc(100vw - 48px), calc(100vw - 160px)"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU2Ii8+PC9zdmc+"
                  />
                </div>
              );
            }

            // Multi-image row — distribute width by aspect ratio
            const totalAR = row.images.reduce((sum, img) => sum + img.aspectRatio, 0);
            return (
              <div key={rowIdx} className="flex gap-4">
                {row.images.map((img, i) => {
                  const widthPercent = (img.aspectRatio / totalAR) * 100;
                  return (
                    <div key={i} className="rounded-sm overflow-hidden" style={{ width: `${widthPercent}%` }}>
                      <Image
                        src={img.url}
                        alt=""
                        width={img.width}
                        height={img.height}
                        className="w-full h-auto"
                        sizes="(max-width: 768px) calc(100vw - 48px), 33vw"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU2Ii8+PC9zdmc+"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="h-px bg-[#E8E8E6] my-6" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-16">
        <Link href={backHref} className="inline-flex items-center gap-2 text-[13px] text-[#999] hover:text-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Issue
        </Link>
      </div>
    </div>
  );
}
