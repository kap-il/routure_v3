import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getLetterBySlug, getIssues, getLettersByIssueId } from '@/lib/supabase/queries';

export const revalidate = 3600;
// Unknown slugs return a static 404 from the edge — no function call, no DB query.
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const issues = await getIssues();
    const allLetters: { slug: string }[] = [];
    for (const issue of issues) {
      const letters = await getLettersByIssueId(issue.id);
      allLetters.push(...letters.map(l => ({ slug: l.slug })));
    }
    return allLetters;
  } catch {
    return [];
  }
}

interface LetterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LetterPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const letter = await getLetterBySlug(slug);
    if (letter) return { title: `${letter.title} | Routure` };
  } catch { /* fall through */ }
  return { title: 'Letter | Routure' };
}

/** Split letter content into per-creator sections.
 *  A creator section ends when we see a name + title signature
 *  (two short consecutive paragraphs where the second is a role like "Creative Director"). */
interface CreatorLetter {
  name: string;
  role: string;
  paragraphs: string[];
  pullquote: string | null;
}

function splitIntoCreatorLetters(blocks: { type: string; text: string }[]): CreatorLetter[] {
  const KNOWN_ROLES = ['creative director', 'assistant creative director', 'president', 'editor', 'editor-in-chief', 'vice president', 'director', 'founder', 'co-founder'];

  const creators: CreatorLetter[] = [];
  let currentParagraphs: string[] = [];
  let currentPullquote: string | null = null;

  // Skip heading block
  const content = blocks.filter(b => b.type !== 'heading');

  for (let i = 0; i < content.length; i++) {
    const block = content[i];

    // Check if the NEXT block is a known role — that makes THIS block the name
    const nextBlock = i + 1 < content.length ? content[i + 1] : null;
    const nextIsRole = nextBlock &&
      nextBlock.type === 'paragraph' &&
      KNOWN_ROLES.includes(nextBlock.text.trim().toLowerCase());

    if (nextIsRole && currentParagraphs.length > 0) {
      creators.push({
        name: block.text,
        role: nextBlock.text,
        paragraphs: currentParagraphs,
        pullquote: currentPullquote,
      });
      currentParagraphs = [];
      currentPullquote = null;
      i++; // skip the role line
      continue;
    }

    // Pullquotes become the first line of the next creator's section
    if (block.type === 'pullquote') {
      currentParagraphs.push(block.text);
      continue;
    }

    currentParagraphs.push(block.text);
  }

  // Any remaining paragraphs without a signature
  if (currentParagraphs.length > 0) {
    creators.push({
      name: '',
      role: '',
      paragraphs: currentParagraphs,
      pullquote: currentPullquote,
    });
  }

  return creators;
}

export default async function LetterPage({ params }: LetterPageProps) {
  const { slug } = await params;

  const letter = await getLetterBySlug(slug);

  if (!letter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#999]">Letter not found.</p>
      </div>
    );
  }

  const creators = splitIntoCreatorLetters(letter.content);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pt-14 pb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-[#999] font-serif mb-4">
          FROM THE CREATORS
        </p>
        <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a1a] mb-2">
          {letter.title}
        </h1>
        <div className="w-28 h-px bg-[#1a1a1a] mt-4 mb-4" />
      </div>

      {/* Creator letters */}
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-20">
        {creators.map((creator, idx) => {
          const image = idx < letter.images.length ? letter.images[idx] : null;
          const textLeft = idx % 2 === 0;

          return (
            <div key={idx}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start py-12">
                {/* Text side */}
                <div className={`flex-1 min-w-0 ${!textLeft && image ? 'md:order-2' : ''}`}>
                  {/* Creator name & role */}
                  {creator.name && (
                    <div className="mb-8">
                      <h2 className="font-serif text-[24px] font-bold text-[#1a1a1a]">
                        {creator.name}
                      </h2>
                      {creator.role && (
                        <p className="text-[13px] tracking-[1px] text-[#999] uppercase mt-1">
                          {creator.role}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pullquote */}
                  {creator.pullquote && (
                    <blockquote className="border-l-2 border-[#1a1a1a] mb-8" style={{ paddingLeft: '2rem' }}>
                      <p className="font-serif text-[18px] italic leading-[1.6] text-[#333]">
                        &ldquo;{creator.pullquote}&rdquo;
                      </p>
                    </blockquote>
                  )}

                  {/* Letter paragraphs */}
                  <div className="flex flex-col gap-5">
                    {creator.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-[14px] leading-[1.85] text-[#555]">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Creator image */}
                {image && (
                  <div className={`shrink-0 rounded-sm overflow-hidden md:w-[40%] ${
                    !textLeft ? 'md:order-1' : ''
                  }`}>
                    <Image
                      src={image.image_url}
                      alt={creator.name || 'Creator'}
                      width={image.width}
                      height={image.height}
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                )}
              </div>

              {idx < creators.length - 1 && <div className="h-px bg-[#E8E8E6]" />}
            </div>
          );
        })}
      </div>

      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-16">
        <Link href="/issues" className="inline-flex items-center gap-2 text-[13px] text-[#999] hover:text-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Issues
        </Link>
      </div>
    </div>
  );
}
