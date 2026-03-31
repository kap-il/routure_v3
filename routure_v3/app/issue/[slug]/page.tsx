import type { Metadata } from 'next';
import Link from 'next/link';
import { getIssueBySlug, getIssueMosaicData, getIssueEditorialItems, getIssues, getLettersByIssueId } from '@/lib/supabase/queries';
import { mockIssue, mockMosaicImages } from '@/lib/data/mock';
import { MosaicGrid } from '@/components/issues/mosaic/MosaicGrid';
import type { IssueEditorialItem } from '@/lib/supabase/types';

interface IssueViewProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const issues = await getIssues();
    return issues.map((i) => ({ slug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: IssueViewProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const issue = await getIssueBySlug(slug);
    if (issue) {
      return { title: `${issue.title} | Routure`, description: issue.description ?? undefined };
    }
  } catch { /* fall through */ }
  return { title: `Issue | Routure` };
}

export default async function IssueViewPage({ params }: IssueViewProps) {
  const { slug } = await params;

  // Try real data, fall back to mock
  let issueTitle = mockIssue.title;
  let issueNumber = mockIssue.issueNumber;
  let photoCount = mockIssue.photoCount;
  let articleCount = mockIssue.articleCount;
  let useMock = true;
  let realItems: { id: string; src: string; aspectRatio: number; shootId: string; shootTitle?: string; hasArticle: boolean; articleTitle?: string; articleCategory?: string; issuePosition: number }[] = [];
  let editorialItems: IssueEditorialItem[] = [];
  let letterSlug: string | null = null;

  try {
    const issue = await getIssueBySlug(slug);
    if (issue) {
      issueTitle = issue.title;
      issueNumber = issue.issue_number;
      const [items, editorials, letters] = await Promise.all([
        getIssueMosaicData(issue.id),
        getIssueEditorialItems(issue.id),
        getLettersByIssueId(issue.id),
      ]);
      editorialItems = editorials;
      if (letters.length > 0) {
        letterSlug = letters[0].slug;
      }
      if (items.length > 0) {
        useMock = false;
        photoCount = items.length;
        articleCount = new Set(items.filter(i => i.hasArticle).map(i => i.shootSlug)).size;
        realItems = items.map(item => ({
          id: item.id,
          src: item.src,
          aspectRatio: item.aspectRatio,
          shootId: item.shootSlug,
          shootTitle: item.shootTitle,
          hasArticle: item.hasArticle,
          articleTitle: item.articleTitle ?? undefined,
          articleCategory: item.articleCategory ?? undefined,
          issuePosition: item.issuePosition * 100 + item.imagePosition,
          isFirstInShoot: item.isFirstInShoot,
          isCover: item.isCover,
        }));
      }
    }
  } catch {
    // Tables may not exist yet
  }

  const mosaicImages = useMock ? mockMosaicImages : realItems;

  return (
    <div className="min-h-screen bg-[#F5F4F2]">
      {/* ===== ISSUE HEADER ===== */}
      <header className="pt-10 pb-8 text-center">
        <p className="text-[11px] tracking-[4px] uppercase text-[#AAA] font-serif mb-4">
          ISSUE NO. {issueNumber}
        </p>
        <h1 className="font-serif text-[48px] font-bold text-[#1a1a1a] mb-3">
          {issueTitle}
        </h1>
        <div className="mx-auto w-14 h-px bg-[#1a1a1a] mb-4" />
        <p className="text-[12px] tracking-[1px] text-[#999]">
          {photoCount} photographs · {articleCount} articles · scroll to explore
        </p>
      </header>

      {/* ===== Letters link ===== */}
      {letterSlug && (
        <div className="text-center mb-6">
          <Link
            href={`/letter/${letterSlug}`}
            className="font-serif text-[13px] tracking-[1px] text-[#999] hover:text-[#1a1a1a] transition-colors"
          >
            Letters from the Creators →
          </Link>
        </div>
      )}

      {/* ===== EDITORIAL LINKS (TOC, Letters from Board) ===== */}
      {editorialItems.length > 0 && (
        <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] mb-8">
          <div className="flex flex-wrap justify-center gap-6">
            {editorialItems.map(item => {
              const href = item.hasArticle
                ? `/shoot/${item.slug}/article`
                : `/shoot/${item.slug}`;
              const icon = item.sectionType === 'toc' ? '◫' : '✉';
              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group flex items-center gap-3 px-6 py-3 border border-[#E0E0E0] rounded-sm hover:border-[#999] hover:bg-white transition-all"
                >
                  <span className="text-[14px] text-[#999] group-hover:text-[#333] transition-colors">
                    {icon}
                  </span>
                  <span className="font-serif text-[14px] text-[#666] group-hover:text-[#1a1a1a] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#CCC] group-hover:text-[#999] transition-colors">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Click hint */}
      <div className="mx-auto max-w-[1280px] px-[80px] mb-6">
        <p className="text-right text-[9px] tracking-[1.5px] text-[#CCC] uppercase">
          CLICK ANY IMAGE TO VIEW
        </p>
      </div>

      {/* ===== MOSAIC GRID ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20">
        <MosaicGrid images={mosaicImages} issueId={slug} gap={20} />
      </div>

      {/* ===== LEGEND ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-16">
        <div className="h-px bg-[#E0E0E0] mb-8" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[12px] rounded-[1px] bg-[#111]/[0.88]" />
            <span className="text-[11px] text-[#999]">
              = Image has an attached article (clickable → Shoot with Article view)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-[#DDD] flex items-center justify-center">
              <span className="text-[8px] text-[#AAA]">↗</span>
            </div>
            <span className="text-[11px] text-[#999]">
              = Photo only (clickable → Shoot Concept view)
            </span>
          </div>
        </div>
      </div>

      <div className="pb-12 text-center">
        <p className="text-[10px] tracking-[2px] text-[#CCC] uppercase">
          ISSUE VIEW — MOSAIC READING EXPERIENCE
        </p>
      </div>
    </div>
  );
}
