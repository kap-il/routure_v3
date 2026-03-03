'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import type { MosaicImage } from '@/types/issue';
import { MosaicTile } from './MosaicTile';

interface MosaicGridProps {
  images: MosaicImage[];
  issueId: string;
  gap?: number;
}

/**
 * Row layout patterns for the mosaic.
 * Each pattern defines how many images it consumes and how they're arranged.
 */
type RowPattern =
  | { type: 'full'; count: 1 }
  | { type: 'portrait-stacked'; count: 3 }  // tall left + 2 stacked right
  | { type: 'three-equal'; count: 3 }
  | { type: 'wide-tall'; count: 2 }          // wide left + tall portrait right
  | { type: 'two-wide'; count: 2 }           // two equal-width panels
  | { type: 'two-small'; count: 2 };         // two smaller images in a sub-row

const rowPatterns: RowPattern[] = [
  { type: 'full', count: 1 },
  { type: 'portrait-stacked', count: 3 },
  { type: 'three-equal', count: 3 },
  { type: 'full', count: 1 },
  { type: 'wide-tall', count: 2 },
  { type: 'two-small', count: 2 },
  { type: 'two-wide', count: 2 },
  { type: 'full', count: 1 },
];

interface MosaicRow {
  pattern: RowPattern['type'];
  images: MosaicImage[];
}

/** Assign images to row patterns procedurally */
function buildRows(images: MosaicImage[]): MosaicRow[] {
  const rows: MosaicRow[] = [];
  let cursor = 0;
  let patternIdx = 0;

  while (cursor < images.length) {
    const pattern = rowPatterns[patternIdx % rowPatterns.length];
    const remaining = images.length - cursor;

    // If not enough images for this pattern, adapt
    if (remaining < pattern.count) {
      // Use remaining images in the simplest layout
      if (remaining === 1) {
        rows.push({ pattern: 'full', images: [images[cursor]] });
      } else if (remaining === 2) {
        rows.push({ pattern: 'two-wide', images: images.slice(cursor, cursor + 2) });
      } else {
        rows.push({ pattern: 'three-equal', images: images.slice(cursor, cursor + 3) });
      }
      break;
    }

    const slice = images.slice(cursor, cursor + pattern.count);
    rows.push({ pattern: pattern.type, images: slice });
    cursor += pattern.count;
    patternIdx++;
  }

  return rows;
}

export function MosaicGrid({ images, issueId, gap = 20 }: MosaicGridProps) {
  const rows = useMemo(() => buildRows(images), [images]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set([0, 1, 2]));

  // Intersection observer for lazy rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-row-idx'));
          if (entry.isIntersecting) {
            setVisibleRows((prev) => new Set([...prev, idx]));
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    const sentinels = container.querySelectorAll('[data-row-idx]');
    sentinels.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [rows]);

  return (
    <div ref={containerRef} className="flex flex-col" style={{ gap }}>
      {rows.map((row, idx) => (
        <div
          key={idx}
          data-row-idx={idx}
          style={{ minHeight: visibleRows.has(idx) ? undefined : '200px' }}
        >
          {visibleRows.has(idx) && (
            <MosaicRowRenderer row={row} issueId={issueId} gap={gap} />
          )}
        </div>
      ))}
    </div>
  );
}

function MosaicRowRenderer({ row, issueId, gap }: { row: MosaicRow; issueId: string; gap: number }) {
  switch (row.pattern) {
    case 'full':
      return <FullWidthRow image={row.images[0]} issueId={issueId} />;
    case 'portrait-stacked':
      return <PortraitStackedRow images={row.images} issueId={issueId} gap={gap} />;
    case 'three-equal':
      return <ThreeEqualRow images={row.images} issueId={issueId} gap={gap} />;
    case 'wide-tall':
      return <WideTallRow images={row.images} issueId={issueId} gap={gap} />;
    case 'two-wide':
      return <TwoWideRow images={row.images} issueId={issueId} gap={gap} />;
    case 'two-small':
      return <TwoSmallRow images={row.images} issueId={issueId} gap={gap} />;
    default:
      return null;
  }
}

// ============================================================
// Row pattern components
// ============================================================

/** Single full-width image */
function FullWidthRow({ image, issueId }: { image: MosaicImage; issueId: string }) {
  // Taller for hero/cover images, shorter for closing spreads
  const height = image.aspectRatio > 2.5 ? 440 : 560;
  const articleBarHeight = image.hasArticle ? 80 : 0;

  return (
    <MosaicTile
      image={image}
      issueId={issueId}
      style={{ width: '100%', height: height + articleBarHeight }}
    />
  );
}

/** Tall portrait left + two stacked landscape right */
function PortraitStackedRow({ images, issueId, gap }: { images: MosaicImage[]; issueId: string; gap: number }) {
  const [left, topRight, bottomRight] = images;
  const totalHeight = 720;
  const topArticleBar = topRight?.hasArticle ? 80 : 0;
  const bottomArticleBar = bottomRight?.hasArticle ? 80 : 0;
  const leftArticleBar = left?.hasArticle ? 80 : 0;

  return (
    <div className="flex" style={{ gap }}>
      {/* Left — tall portrait */}
      <MosaicTile
        image={left}
        issueId={issueId}
        style={{ width: '42%', height: totalHeight + leftArticleBar }}
      />

      {/* Right column — two stacked */}
      <div className="flex flex-col flex-1" style={{ gap }}>
        <MosaicTile
          image={topRight}
          issueId={issueId}
          style={{ width: '100%', height: (totalHeight - gap) / 2 + topArticleBar }}
        />
        <MosaicTile
          image={bottomRight}
          issueId={issueId}
          style={{ width: '100%', height: (totalHeight - gap) / 2 + bottomArticleBar }}
        />
      </div>
    </div>
  );
}

/** Three equal-width columns */
function ThreeEqualRow({ images, issueId, gap }: { images: MosaicImage[]; issueId: string; gap: number }) {
  return (
    <div className="flex" style={{ gap }}>
      {images.map((img) => (
        <MosaicTile
          key={img.id}
          image={img}
          issueId={issueId}
          style={{ flex: 1, height: 480 }}
        />
      ))}
    </div>
  );
}

/** Wide image left + tall portrait right */
function WideTallRow({ images, issueId, gap }: { images: MosaicImage[]; issueId: string; gap: number }) {
  const [wide, tall] = images;

  return (
    <div className="flex" style={{ gap }}>
      <MosaicTile
        image={wide}
        issueId={issueId}
        style={{ width: '60%', height: 400 }}
      />
      <MosaicTile
        image={tall}
        issueId={issueId}
        style={{ flex: 1, height: 640 }}
        className="-mt-0"
      />
    </div>
  );
}

/** Two equal-width wide panels */
function TwoWideRow({ images, issueId, gap }: { images: MosaicImage[]; issueId: string; gap: number }) {
  return (
    <div className="flex" style={{ gap }}>
      {images.map((img) => (
        <MosaicTile
          key={img.id}
          image={img}
          issueId={issueId}
          style={{ flex: 1, height: 360 }}
        />
      ))}
    </div>
  );
}

/** Two smaller images side by side */
function TwoSmallRow({ images, issueId, gap }: { images: MosaicImage[]; issueId: string; gap: number }) {
  return (
    <div className="flex" style={{ gap }}>
      {images.map((img) => {
        const articleBarHeight = img.hasArticle ? 60 : 0;
        return (
          <MosaicTile
            key={img.id}
            image={img}
            issueId={issueId}
            style={{ flex: 1, height: 220 + articleBarHeight }}
          />
        );
      })}
    </div>
  );
}
