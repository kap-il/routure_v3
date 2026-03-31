'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { MosaicImage } from '@/types/issue';

interface MosaicTileProps {
  image: MosaicImage;
  issueId: string;
  className?: string;
}

export function MosaicTile({ image, issueId, className = '' }: MosaicTileProps) {
  const href = image.hasArticle
    ? `/shoot/${image.shootId}/article`
    : `/shoot/${image.shootId}`;

  const Wrapper = image.isCover ? 'div' : Link;
  const wrapperProps = image.isCover ? {} : { href };

  return (
    <Wrapper
      {...wrapperProps as any}
      className={`group relative block overflow-hidden rounded-[3px] ${className}`}
    >
      {/* Actual image from S3 — uses natural aspect ratio */}
      {image.src ? (
        <Image
          src={image.src}
          alt={image.articleTitle ?? `Image ${image.issuePosition}`}
          width={800}
          height={Math.round(800 / image.aspectRatio)}
          className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
        />
      ) : (
        <div
          className="w-full bg-[#E0E0E0]"
          style={{ aspectRatio: image.aspectRatio }}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Click hint arrow (non-cover only) */}
      {!image.isCover && (
        <div className="absolute top-3 right-3">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[12px] text-white">↗</span>
          </div>
        </div>
      )}

      {/* Shoot title bar — on first image of every shoot (not covers) */}
      {image.isFirstInShoot && !image.isCover && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#111]/[0.88] flex items-center px-5 py-3">
          <span className="font-serif text-[15px] font-bold text-white truncate">
            {image.shootTitle ?? image.shootId}
            {image.hasArticle && image.articleTitle && (
              <span className="font-normal text-[#999]">
                {' '}/ Feature: {image.articleTitle}
              </span>
            )}
          </span>
        </div>
      )}
    </Wrapper>
  );
}
