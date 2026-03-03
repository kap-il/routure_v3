'use client';

import Link from 'next/link';
import type { MosaicImage } from '@/types/issue';

interface MosaicTileProps {
  image: MosaicImage;
  issueId: string;
  style?: React.CSSProperties;
  className?: string;
}

/** Gradient palette for placeholder tiles — each tile gets a unique visual identity */
const gradients = [
  'from-[#2c2c2c] to-[#1a1a1a]',
  'from-[#3d3d3d] to-[#222]',
  'from-[#4a4a4a] to-[#2a2a2a]',
  'from-[#383838] to-[#1e1e1e]',
  'from-[#555] to-[#333]',
  'from-[#3a3a3a] to-[#1c1c1c]',
  'from-[#444] to-[#252525]',
  'from-[#505050] to-[#2e2e2e]',
];

function getGradient(position: number) {
  return gradients[position % gradients.length];
}

export function MosaicTile({ image, issueId, style, className = '' }: MosaicTileProps) {
  const href = image.hasArticle
    ? `/shoot/${image.shootId}/article`
    : `/shoot/${image.shootId}`;

  const gradient = getGradient(image.issuePosition);

  return (
    <Link
      href={href}
      className={`group relative block rounded-[3px] overflow-hidden ${className}`}
      style={style}
    >
      {/* Image placeholder with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Image label number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {image.issuePosition === 1 ? (
          <>
            <span className="font-serif text-[28px] text-white/80">
              Cover Spread
            </span>
            <span className="text-[11px] tracking-[2px] text-[#999] mt-2">
              {String(image.issuePosition).padStart(2, '0')}
            </span>
          </>
        ) : (
          <>
            <span className="font-serif text-[20px] text-white/70">
              Image
            </span>
            <span className="text-[11px] tracking-[2px] text-[#888] mt-2">
              {String(image.issuePosition).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {/* Click hint arrow */}
      <div className="absolute top-4 right-4">
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[12px] text-white">↗</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Article title bar — only when hasArticle */}
      {image.hasArticle && (
        <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-[#111]/[0.88] flex items-center px-7">
          <span className="font-serif text-[11px] tracking-[2px] text-[#999] uppercase mr-6">
            {image.articleCategory}
          </span>
          <span className="font-serif text-[18px] font-bold text-white flex-1 truncate">
            {image.articleTitle}
          </span>
          <span className="text-[10px] text-[#777] ml-4 shrink-0">
            → Read
          </span>
        </div>
      )}
    </Link>
  );
}
