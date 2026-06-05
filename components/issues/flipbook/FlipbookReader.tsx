'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FlipbookControls } from './FlipbookControls';
import { PageRenderer } from './PageRenderer';

interface PageData {
  page_number: number;
  image_url: string;
  thumbnail_url: string;
}

interface FlipbookReaderProps {
  issueSlug: string;
  issueTitle: string;
  pageCount: number;
  pages: PageData[];
}

/**
 * One full PDF page per turn. The Routure magazines are exported as pre-composed
 * spreads (interior pages are landscape full-bleed spreads; first/last are the
 * portrait covers), so we show each rendered page intact and flip one at a time —
 * never splitting a spread down the gutter.
 */
export function FlipbookReader({ issueSlug, issueTitle, pageCount, pages }: FlipbookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = pageCount;

  const getPageData = (pageIndex: number): PageData | undefined =>
    pages.find((p) => p.page_number === pageIndex + 1);

  const nextPage = useCallback(() => {
    if (currentPage < total - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 240);
    }
  }, [currentPage, total, isFlipping]);

  const prevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 240);
    }
  }, [currentPage, total, isFlipping]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < total && !isFlipping) setCurrentPage(page);
    },
    [total, isFlipping],
  );

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    // iOS Safari (iPhone) has no Fullscreen API on non-<video> elements, so fall
    // back to CSS pseudo-fullscreen (the container already renders fixed inset-0
    // when isFullscreen). Use native fullscreen only where it's actually enabled.
    const supportsNative = !!(document.fullscreenEnabled && el.requestFullscreen);
    if (!supportsNative) {
      setIsFullscreen((v) => !v);
      return;
    }
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((v) => !v); // native call blocked → pseudo-fullscreen
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          nextPage();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          prevPage();
          break;
        case 'Escape':
          if (isFullscreen) {
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, isFullscreen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) (diff > 0 ? nextPage : prevPage)();
    };
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  useEffect(() => {
    // Only sync from native events when the browser is actually in native fullscreen,
    // so a stray event can't drop us out of CSS pseudo-fullscreen on mobile.
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) setIsFullscreen(true);
      else if (document.fullscreenEnabled) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Lock background scroll while (pseudo-)fullscreen so the page behind doesn't move on mobile.
  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFullscreen]);

  useEffect(() => {
    localStorage.setItem(`routure-reading-${issueSlug}`, String(currentPage));
  }, [currentPage, issueSlug]);

  useEffect(() => {
    const saved = localStorage.getItem(`routure-reading-${issueSlug}`);
    if (saved) {
      const page = parseInt(saved, 10);
      if (!isNaN(page) && page >= 0 && page < total) setCurrentPage(page);
    }
  }, [issueSlug, total]);

  const pageData = getPageData(currentPage);
  // First and last pages are the portrait covers; interior pages are landscape spreads.
  const isPortrait = currentPage === 0 || currentPage === total - 1;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-[100]' : 'flex-1 min-h-0'}`}
    >
      <div className="flex-1 relative overflow-hidden">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize disabled:cursor-default group"
          aria-label="Previous page"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-black/50 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage >= total - 1}
          className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize disabled:cursor-default group"
          aria-label="Next page"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-black/50 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
          <div
            className={`
              relative h-full w-auto max-w-full bg-white shadow-2xl
              transition-transform duration-300 ease-out
              ${flipDirection === 'next' ? 'translate-x-[-1.5%]' : ''}
              ${flipDirection === 'prev' ? 'translate-x-[1.5%]' : ''}
            `}
            style={{ aspectRatio: isPortrait ? '0.773' : '1.55' }}
          >
            {pageData ? (
              <PageRenderer
                pageNumber={currentPage}
                totalPages={total}
                issueTitle={issueTitle}
                position="cover"
                imageUrl={pageData.image_url}
              />
            ) : (
              <div className="w-full h-full bg-gray-50" />
            )}
          </div>
        </div>
      </div>

      <FlipbookControls
        currentPage={currentPage}
        totalPages={total}
        onPrevious={prevPage}
        onNext={nextPage}
        onGoToPage={goToPage}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}
