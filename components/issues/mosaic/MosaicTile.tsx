'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MosaicImage } from '@/types/issue';

interface MosaicTileProps {
  image: MosaicImage;
  issueId: string;
  className?: string;
}

function ZoomOverlay({ src, alt, onClose }: {
  src: string; alt: string; onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        isolation: 'isolate',
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Close zoom"
      >
        <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        style={{ padding: '5rem 2rem 3rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '88vw',
            maxHeight: '72vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>,
    document.body
  );
}

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
          />
        ) : (
          <div
            className="w-full bg-[#E0E0E0]"
            style={{ aspectRatio: image.aspectRatio }}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

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
