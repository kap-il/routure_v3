'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Issue } from '@/types/issue';
import { FlipbookControls } from './FlipbookControls';
import { PageRenderer } from './PageRenderer';

interface FlipbookReaderProps {
  issue: Issue;
}

export function FlipbookReader({ issue }: FlipbookReaderProps) {
  // currentSpread: 0 = cover only, 1 = pages 1-2, 2 = pages 3-4, etc.
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = issue.pageCount;

  // Calculate total spreads: cover (1) + internal spreads + possible last single page
  const totalSpreads = Math.ceil((totalPages + 1) / 2);

  // Get the page numbers for the current spread
  const getSpreadPages = (spread: number): { left: number | null; right: number | null } => {
    if (spread === 0) {
      // Cover page - show only on right side
      return { left: null, right: 0 };
    }

    const leftPage = spread * 2 - 1;
    const rightPage = spread * 2;

    return {
      left: leftPage < totalPages ? leftPage : null,
      right: rightPage < totalPages ? rightPage : null,
    };
  };

  // Convert spread to approximate page number for progress
  const currentPage = currentSpread === 0 ? 0 : Math.min(currentSpread * 2 - 1, totalPages - 1);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages && !isFlipping) {
      // Convert page to spread
      const spread = page === 0 ? 0 : Math.ceil(page / 2);
      setCurrentSpread(spread);
    }
  }, [totalPages, isFlipping]);

  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    }
  }, [currentSpread, totalSpreads, isFlipping]);

  const prevSpread = useCallback(() => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    }
  }, [currentSpread, isFlipping]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          nextSpread();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          prevSpread();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSpread, prevSpread, isFullscreen]);

  // Touch/swipe support
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSpread();
        } else {
          prevSpread();
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSpread, prevSpread]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Save reading progress to localStorage
  useEffect(() => {
    localStorage.setItem(`routure-reading-${issue.slug}`, String(currentSpread));
  }, [currentSpread, issue.slug]);

  // Restore reading progress
  useEffect(() => {
    const saved = localStorage.getItem(`routure-reading-${issue.slug}`);
    if (saved) {
      const spread = parseInt(saved, 10);
      if (!isNaN(spread) && spread >= 0 && spread < totalSpreads) {
        setCurrentSpread(spread);
      }
    }
  }, [issue.slug, totalSpreads]);

  const { left: leftPage, right: rightPage } = getSpreadPages(currentSpread);
  const isCoverSpread = currentSpread === 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[80vh]'}`}
    >
      {/* Reader area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Click zones for navigation */}
        <button
          onClick={prevSpread}
          disabled={currentSpread === 0}
          className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize disabled:cursor-default group"
          aria-label="Previous spread"
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
          onClick={nextSpread}
          disabled={currentSpread >= totalSpreads - 1}
          className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize disabled:cursor-default group"
          aria-label="Next spread"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-black/50 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Book container */}
        <div className="absolute inset-4 sm:inset-8 flex items-center justify-center">
          <div
            className={`
              relative w-full h-full max-h-full flex
              transition-transform duration-300 ease-out
              ${flipDirection === 'next' ? 'translate-x-[-1%]' : ''}
              ${flipDirection === 'prev' ? 'translate-x-[1%]' : ''}
              ${isCoverSpread ? 'justify-center' : 'justify-center'}
            `}
          >
            {/* Book spread */}
            <div
              className={`
                relative flex shadow-2xl
                ${isCoverSpread ? 'w-auto' : 'w-full max-w-6xl'}
                h-full max-h-[calc(100vh-200px)]
              `}
              style={{ aspectRatio: isCoverSpread ? '3/4' : '3/2' }}
            >
              {/* Left page */}
              {!isCoverSpread && (
                <div className="relative w-1/2 h-full bg-white border-r border-gray-200">
                  {leftPage !== null ? (
                    <PageRenderer
                      pageNumber={leftPage}
                      totalPages={totalPages}
                      issueTitle={issue.title}
                      position="left"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50" />
                  )}
                  {/* Left page inner shadow */}
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Center spine */}
              {!isCoverSpread && (
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 z-10" />
              )}

              {/* Right page */}
              <div className={`relative ${isCoverSpread ? 'w-full' : 'w-1/2'} h-full bg-white`}>
                {rightPage !== null ? (
                  <PageRenderer
                    pageNumber={rightPage}
                    totalPages={totalPages}
                    issueTitle={issue.title}
                    position={isCoverSpread ? 'cover' : 'right'}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
                {/* Right page inner shadow */}
                {!isCoverSpread && (
                  <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
                )}
              </div>

              {/* Book edge shadows */}
              <div className="absolute -left-2 top-2 bottom-2 w-2 bg-gradient-to-r from-transparent to-black/10 rounded-l" />
              <div className="absolute -right-2 top-2 bottom-2 w-2 bg-gradient-to-l from-transparent to-black/10 rounded-r" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <FlipbookControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={prevSpread}
        onNext={nextSpread}
        onGoToPage={goToPage}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}
