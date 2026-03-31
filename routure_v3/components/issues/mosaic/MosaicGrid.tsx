'use client';

import { useMemo } from 'react';
import type { MosaicImage } from '@/types/issue';
import { MosaicTile } from './MosaicTile';

interface MosaicGridProps {
  images: MosaicImage[];
  issueId: string;
  gap?: number;
}

/**
 * Row layout types. Each row consumes N images and arranges them
 * using flexbox with aspect-ratio-based widths (no cropping).
 */
type RowType = 'full' | 'two' | 'three';

interface MosaicRow {
  type: RowType;
  images: MosaicImage[];
}

/**
 * Pattern sequence for visual variety.
 * Cycles through: full → 3 → 2 → full → 2 → 3 → 2 → full
 */
const patternSequence: { type: RowType; count: number }[] = [
  { type: 'full', count: 1 },
  { type: 'three', count: 3 },
  { type: 'two', count: 2 },
  { type: 'full', count: 1 },
  { type: 'two', count: 2 },
  { type: 'three', count: 3 },
  { type: 'two', count: 2 },
  { type: 'full', count: 1 },
];

function buildRows(images: MosaicImage[]): MosaicRow[] {
  const rows: MosaicRow[] = [];
  let cursor = 0;
  let patternIdx = 0;

  while (cursor < images.length) {
    const pattern = patternSequence[patternIdx % patternSequence.length];
    const remaining = images.length - cursor;

    // Adapt if not enough images for this pattern
    const count = Math.min(pattern.count, remaining);
    const type: RowType = count === 1 ? 'full' : count === 2 ? 'two' : 'three';

    rows.push({
      type,
      images: images.slice(cursor, cursor + count),
    });

    cursor += count;
    patternIdx++;
  }

  return rows;
}

export function MosaicGrid({ images, issueId, gap = 16 }: MosaicGridProps) {
  const rows = useMemo(() => buildRows(images), [images]);

  return (
    <div className="flex flex-col" style={{ gap }}>
      {rows.map((row, idx) => (
        <MosaicRowRenderer key={idx} row={row} issueId={issueId} gap={gap} />
      ))}
    </div>
  );
}

function MosaicRowRenderer({
  row,
  issueId,
  gap,
}: {
  row: MosaicRow;
  issueId: string;
  gap: number;
}) {
  if (row.type === 'full') {
    return (
      <MosaicTile image={row.images[0]} issueId={issueId} />
    );
  }

  // For multi-image rows, distribute width proportional to aspect ratio
  // so each image gets width proportional to how wide it is relative to its height.
  // This means all images in a row will have the same rendered height.
  const totalAR = row.images.reduce((sum, img) => sum + img.aspectRatio, 0);

  return (
    <div className="flex" style={{ gap }}>
      {row.images.map((img) => {
        const widthPercent = (img.aspectRatio / totalAR) * 100;
        return (
          <div key={img.id} style={{ width: `${widthPercent}%` }}>
            <MosaicTile image={img} issueId={issueId} />
          </div>
        );
      })}
    </div>
  );
}
