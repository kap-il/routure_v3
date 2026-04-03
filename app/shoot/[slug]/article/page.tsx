import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getShootBySlug, getIssueForShoot, getIssues, getIssueMosaicData } from '@/lib/supabase/queries';
import { mockShootArticle } from '@/lib/data/mock';
import type { ContentBlock } from '@/lib/supabase/types';

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

interface ShootArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShootArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const shoot = await getShootBySlug(slug);
    if (shoot?.article) return { title: `${shoot.article.title} | Routure` };
  } catch { /* fall through */ }
  return { title: `${mockShootArticle.article.title} | Routure` };
}

/** Convert ContentBlock[] into structured sections for rendering.
 *  Groups all leading non-paragraph blocks (heading, subheading, caption)
 *  into a single "header" section so they appear in the first box together. */
function blocksToSections(blocks: ContentBlock[]): { type: 'text' | 'header' | 'pullquote'; content: string; heading?: string; subtitle?: string }[] {
  const sections: { type: 'text' | 'header' | 'pullquote'; content: string; heading?: string; subtitle?: string }[] = [];

  // Collect leading preamble blocks (everything before the first paragraph)
  let i = 0;
  let heading = '';
  let subtitle = '';
  let caption = '';
  while (i < blocks.length && blocks[i].type !== 'paragraph') {
    const b = blocks[i];
    if (b.type === 'heading') heading = b.text;
    else if ((b.type as string) === 'subheading') subtitle = b.text;
    else if (b.type === 'caption') caption = b.text;
    i++;
  }
  if (heading || subtitle || caption) {
    sections.push({ type: 'header', content: caption, heading, subtitle });
  }

  // Process remaining blocks — each paragraph becomes its own section
  for (; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === 'heading') {
      sections.push({ type: 'header', content: '', heading: block.text });
    } else if (block.type === 'pullquote') {
      sections.push({ type: 'pullquote', content: block.text });
    } else if (block.text.trim()) {
      sections.push({ type: 'text', content: block.text.trim() });
    }
  }
  return sections;
}

export default async function ShootArticlePage({ params }: ShootArticlePageProps) {
  const { slug } = await params;

  let articleTitle = mockShootArticle.article.title;
  let articleAuthor = mockShootArticle.article.author;
  let credits: Record<string, string> | null = null;
  let heroImageUrl: string | null = null;
  let sections: { type: 'text' | 'header' | 'pullquote'; content: string; heading?: string; subtitle?: string }[] =
    mockShootArticle.article.sections.map(s => ({ type: 'text', content: s }));
  let imageUrls: { url: string; width: number; height: number }[] = [];
  let backHref = '/issue/spring-2026';
  let useMock = true;

  try {
    const [shoot, issue] = await Promise.all([
      getShootBySlug(slug),
      getIssueForShoot(slug),
    ]);
    if (shoot && shoot.article && shoot.images.length > 0) {
      useMock = false;
      articleTitle = shoot.article.title;
      articleAuthor = shoot.article.author ?? 'Unknown';
      credits = shoot.credits;

      // Only use photo images (not article text page scans)
      const photoImages = shoot.images.filter(img => !img.is_article_page);
      heroImageUrl = photoImages[0]?.image_url ?? null;
      imageUrls = photoImages.slice(1).map(img => ({
        url: img.image_url,
        width: img.width,
        height: img.height,
      }));

      if (shoot.article.content && shoot.article.content.length > 0) {
        sections = blocksToSections(shoot.article.content);
      } else {
        // No extracted content yet — show images as gallery
        sections = [];
      }

      if (issue) backHref = `/issue/${issue.slug}`;
    }
  } catch {
    // Tables may not exist yet
  }

  // Group text sections into chunks that fill ~60% of each image's height.
  // Heuristic: at 14px/1.85lh ≈ 26px/line, ~60 chars/line in the text column.
  // For portrait images (~0.75 AR) rendered at 45% of 1120px ≈ 504px wide → ~672px tall.
  // 60% of 672 ≈ 400px → ~15 lines → ~900 chars target per chunk.
  const TARGET_CHARS = 800;

  type TextGroup = typeof sections;
  const groups: { texts: TextGroup; image: typeof imageUrls[0] | null; textLeft: boolean }[] = [];
  let sIdx = 0;
  let imgIdx = 0;

  while (sIdx < sections.length && imgIdx < imageUrls.length) {
    const chunk: TextGroup = [];
    let charCount = 0;

    // Always include at least one section per group
    chunk.push(sections[sIdx]);
    charCount += sections[sIdx].content.length + (sections[sIdx].heading?.length ?? 0);
    sIdx++;

    // Keep adding sections until we hit the target
    while (sIdx < sections.length && charCount < TARGET_CHARS) {
      chunk.push(sections[sIdx]);
      charCount += sections[sIdx].content.length + (sections[sIdx].heading?.length ?? 0);
      sIdx++;
    }

    groups.push({ texts: chunk, image: imageUrls[imgIdx], textLeft: groups.length % 2 === 0 });
    imgIdx++;
  }

  // Remaining text sections without images
  while (sIdx < sections.length) {
    const chunk: TextGroup = [];
    let charCount = 0;
    while (sIdx < sections.length && (charCount < TARGET_CHARS || chunk.length === 0)) {
      chunk.push(sections[sIdx]);
      charCount += sections[sIdx].content.length;
      sIdx++;
    }
    groups.push({ texts: chunk, image: null, textLeft: true });
  }

  // Leftover images (more images than text) — go into mosaic
  const leftoverImages = imageUrls.slice(imgIdx);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ===== FULL SPREAD HERO ===== */}
      <section className="relative w-full" style={{ height: '700px' }}>
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={articleTitle} fill className="object-cover" priority sizes="100vw" fetchPriority="high" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#252525] to-[#1a1a1a]" />
        )}
      </section>

      {/* ===== ARTICLE HEADER ===== */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pt-14 pb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-4">PHOTO SHOOT + ARTICLE</p>
        <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a1a] mb-2">{articleTitle}</h1>
        <div className="w-28 h-px bg-[#1a1a1a] mt-4 mb-4" />
        <p className="text-[13px] text-[#777] mb-2">By {articleAuthor}</p>
        {credits && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-3">
            {Object.entries(credits).map(([role, names]) => (
              <div key={role}>
                <p className="text-[11px] tracking-[1px] uppercase text-[#999] mb-0.5">{role}</p>
                <p className="text-[13px] text-[#555]">{names}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ALTERNATING TEXT + IMAGE SECTIONS ===== */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-20">
        {groups.map((group, idx) => (
          <div key={idx}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start py-10">
              {/* Text side */}
              <div
                className={`flex-1 min-w-0 flex flex-col gap-6 ${
                  !group.textLeft && group.image ? 'md:order-2' : ''
                }`}
              >
                {group.texts.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    {section.type === 'header' ? (
                      <div>
                        {section.heading && (
                          <h2 className="font-serif text-[24px] font-bold text-[#1a1a1a] mb-3">
                            {section.heading}
                          </h2>
                        )}
                        {section.subtitle && (
                          <p className="font-serif text-[16px] italic text-[#666] mb-2">
                            {section.subtitle}
                          </p>
                        )}
                        {section.content && (
                          <p className="text-[13px] tracking-[1px] text-[#999] uppercase">
                            {section.content}
                          </p>
                        )}
                      </div>
                    ) : section.type === 'pullquote' ? (
                      <blockquote className="border-l-2 border-[#1a1a1a] pl-6 py-2">
                        <p className="font-serif text-[20px] italic leading-[1.6] text-[#333]">
                          {section.content}
                        </p>
                      </blockquote>
                    ) : (
                      <p className="text-[14px] leading-[1.85] text-[#555]">
                        {section.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Image side */}
              {group.image && (
                <div
                  className={`shrink-0 rounded-sm overflow-hidden ${
                    group.textLeft ? 'md:w-[45%]' : 'md:w-[40%] md:order-1'
                  }`}
                >
                  <Image
                    src={group.image.url}
                    alt=""
                    width={group.image.width}
                    height={group.image.height}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 45vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU2Ii8+PC9zdmc+"
                  />
                </div>
              )}
            </div>

            {idx < groups.length - 1 && <div className="h-px bg-[#E8E8E6]" />}
          </div>
        ))}

        {/* Leftover images in mosaic grid */}
        {leftoverImages.length > 0 && (
          <>
            <div className="h-px bg-[#E8E8E6] my-4" />
            <div className="columns-2 md:columns-3 gap-5 py-10">
              {leftoverImages.map((img, idx) => (
                <div key={idx} className="mb-5 break-inside-avoid rounded-sm overflow-hidden">
                  <Image
                    src={img.url}
                    alt=""
                    width={img.width}
                    height={img.height}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {sections.length === 0 && imageUrls.length === 0 && !useMock && (
          <p className="text-center text-[#999] text-[14px] py-10">
            Article content has not been extracted yet.
          </p>
        )}
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
