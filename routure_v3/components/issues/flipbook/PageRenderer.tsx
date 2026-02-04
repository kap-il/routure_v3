'use client';

interface PageRendererProps {
  pageNumber: number;
  totalPages: number;
  issueTitle: string;
  position?: 'left' | 'right' | 'cover';
}

export function PageRenderer({ pageNumber, totalPages, issueTitle, position = 'right' }: PageRendererProps) {
  // Placeholder page content - in production, this would render actual page images
  const isCover = position === 'cover';
  const isLastPage = pageNumber === totalPages - 1;
  const isLeftPage = position === 'left';

  return (
    <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
      {/* Page background */}
      <div className={`absolute inset-0 ${isCover ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`} />

      {/* Page content placeholder */}
      <div className="relative z-10 text-center p-4 sm:p-8">
        {isCover ? (
          <>
            <div className="font-serif text-6xl sm:text-8xl text-white/20 italic mb-6 sm:mb-8">R</div>
            <h2 className="font-serif text-xl sm:text-3xl text-white mb-2">{issueTitle}</h2>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase">Routure Magazine</p>
          </>
        ) : isLastPage ? (
          <>
            <div className="font-serif text-4xl sm:text-6xl text-gray-200 italic mb-6 sm:mb-8">R</div>
            <p className="text-xs sm:text-sm text-gray-500 tracking-widest uppercase mb-2">Thank you for reading</p>
            <h2 className="font-serif text-lg sm:text-2xl">{issueTitle}</h2>
          </>
        ) : (
          <>
            <span className="font-serif text-5xl sm:text-7xl text-gray-200 italic">
              {String(pageNumber).padStart(2, '0')}
            </span>
            <p className="text-xs text-gray-400 mt-4 tracking-widest uppercase">
              Page Content
            </p>
          </>
        )}
      </div>

      {/* Page number */}
      {!isCover && (
        <div className={`absolute bottom-4 ${isLeftPage ? 'left-4' : 'right-4'}`}>
          <span className="text-xs text-gray-400">{pageNumber}</span>
        </div>
      )}
    </div>
  );
}
