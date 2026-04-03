'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import type { MosaicImage } from '@/types/issue';

interface MosaicTileProps {
  image: MosaicImage;
  issueId: string;
  className?: string;
}

// Dynamically import ZoomOverlay — only loads when user actually zooms an image
const ZoomOverlay = dynamic(() => import('@/components/ui/ZoomOverlay'), { ssr: false });

export function MosaicTile({ image, issueId, className = '' }: MosaicTileProps) {
  const [zoomed, setZoomed] = useState(false);

  const href = image.hasArticle
    ? `/shoot/${image.shootId}/article`
    : `/shoot/${image.shootId}`;

  const handleZoom = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => setZoomed(false), []);

  const Wrapper = image.isCover ? 'div' : Link;
  const wrapperProps = image.isCover ? {} : { href };

  return (
    <>
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
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU2Ii8+PC9zdmc+"
          />
        ) : (
          <div
            className="w-full bg-[#E0E0E0]"
            style={{ aspectRatio: image.aspectRatio }}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center gap-4">
          {!image.isCover && (
            <>
              {image.hasArticle && image.articleTitle && (
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-serif text-[16px] italic text-white text-center max-w-[80%] leading-relaxed">
                  &ldquo;{image.articleTitle}&rdquo;
                </p>
              )}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 rounded-full border border-white text-[12px] tracking-[1.5px] uppercase text-white font-medium">
                {image.hasArticle ? 'Read More' : 'View Shoot'}
              </span>
            </>
          )}
        </div>

        {/* Zoom button — visible on hover, top-right */}
        {image.src && (
          <button
            onClick={handleZoom}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Zoom image"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </button>
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

      {zoomed && image.src && (
        <ZoomOverlay
          src={image.src}
          alt={image.articleTitle ?? `Image ${image.issuePosition}`}
          onClose={handleCloseZoom}
        />
      )}
    </>
  );
}
