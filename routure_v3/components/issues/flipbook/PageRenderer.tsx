'use client';

import Image from 'next/image';

interface PageRendererProps {
  pageNumber: number;
  totalPages: number;
  issueTitle: string;
  position?: 'left' | 'right' | 'cover';
  imageUrl?: string;
  thumbnailUrl?: string;
}

export function PageRenderer({
  pageNumber,
  totalPages,
  issueTitle,
  position = 'right',
  imageUrl,
  thumbnailUrl,
}: PageRendererProps) {
  const isCover = position === 'cover';
  const isLastPage = pageNumber === totalPages - 1;
  const isLeftPage = position === 'left';

  // If we have a real image URL, render it
  if (imageUrl) {
    return (
      <div className="w-full h-full relative bg-white overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${issueTitle} — page ${pageNumber + 1}`}
          fill
          className="object-contain"
          sizes={isCover ? '(max-width: 768px) 90vw, 40vw' : '(max-width: 768px) 90vw, 30vw'}
          placeholder={thumbnailUrl ? 'blur' : undefined}
          blurDataURL={thumbnailUrl}
          priority={pageNumber <= 2}
        />
        {/* Page number */}
        {!isCover && (
          <div className={`absolute bottom-4 ${isLeftPage ? 'left-4' : 'right-4'} z-10`}>
            <span className="text-xs text-gray-400 bg-white/80 px-1 rounded">{pageNumber + 1}</span>
          </div>
        )}
      </div>
    );
  }

  // Fallback: placeholder content (no images uploaded yet)
  return (
    <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
      <div className={`absolute inset-0 ${isCover ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`} />

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
              {String(pageNumber + 1).padStart(2, '0')}
            </span>
            <p className="text-xs text-gray-400 mt-4 tracking-widest uppercase">
              Page Content
            </p>
          </>
        )}
      </div>

      {!isCover && (
        <div className={`absolute bottom-4 ${isLeftPage ? 'left-4' : 'right-4'}`}>
          <span className="text-xs text-gray-400">{pageNumber + 1}</span>
        </div>
      )}
    </div>
  );
}
