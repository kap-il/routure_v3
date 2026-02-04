'use client';

interface FlipbookControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToPage: (page: number) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function FlipbookControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onGoToPage,
  onToggleFullscreen,
  isFullscreen,
}: FlipbookControlsProps) {
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 0}
          className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Center - Page indicator and progress */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>
        <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-gray-100 transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
