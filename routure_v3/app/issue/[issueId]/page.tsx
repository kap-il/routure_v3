import type { Metadata } from 'next';
import { mockIssue, mockMosaicImages } from '@/lib/data/mock';
import { MosaicGrid } from '@/components/issues/mosaic/MosaicGrid';

interface IssueViewProps {
  params: Promise<{ issueId: string }>;
}

export async function generateMetadata({ params }: IssueViewProps): Promise<Metadata> {
  const { issueId } = await params;
  return {
    title: `Issue ${issueId} | Routure`,
    description: 'Browse the full issue — scroll and click any image to explore.',
  };
}

export default async function IssueViewPage({ params }: IssueViewProps) {
  const { issueId } = await params;

  // TODO: fetch real issue data by issueId from Supabase
  // For now, use mock data
  const issue = mockIssue;
  const images = mockMosaicImages;

  return (
    <div className="min-h-screen bg-[#F5F4F2]">
      {/* ===== ISSUE HEADER ===== */}
      <header className="pt-10 pb-8 text-center">
        <p className="text-[11px] tracking-[4px] uppercase text-[#AAA] font-serif mb-4">
          ISSUE NO. {issue.issueNumber}
        </p>
        <h1 className="font-serif text-[48px] font-bold text-[#1a1a1a] mb-3">
          {issue.title}
        </h1>
        <div className="mx-auto w-14 h-px bg-[#1a1a1a] mb-4" />
        <p className="text-[12px] tracking-[1px] text-[#999]">
          {issue.photoCount} photographs · {issue.articleCount} articles · {issue.subtitle}
        </p>
      </header>

      {/* Click hint */}
      <div className="mx-auto max-w-[1280px] px-[80px] mb-6">
        <p className="text-right text-[9px] tracking-[1.5px] text-[#CCC] uppercase">
          CLICK ANY IMAGE TO VIEW
        </p>
      </div>

      {/* ===== MOSAIC GRID ===== */}
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20">
        <MosaicGrid images={images} issueId={issueId} gap={20} />
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

      {/* ===== PAGE LABEL ===== */}
      <div className="pb-12 text-center">
        <p className="text-[10px] tracking-[2px] text-[#CCC] uppercase">
          ISSUE VIEW — MOSAIC READING EXPERIENCE
        </p>
      </div>
    </div>
  );
}
