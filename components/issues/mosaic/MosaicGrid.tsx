'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import type { MosaicImage } from '@/types/issue';
import { MosaicTile } from './MosaicTile';

interface MosaicGridProps {
  images: MosaicImage[];
  issueId: string;
  gap?: number;
}

// Justified-gallery tuning.
const TARGET_ROW_HEIGHT = 460; // preferred row height; rows flex around this to fill width
const MAX_ROW_HEIGHT = 880;    // never let a sparse row balloon taller than this
const DEFAULT_WIDTH = 1520;    // SSR / pre-measure fallback (matches max-w-[1600px] - padding)

interface JustifiedRow {
  images: MosaicImage[];
  height: number;
  fills: boolean; // true if the row spans the full container width
}

/** Largest height a row can take without upscaling ANY of its images
 *  (display height <= native height for every image). */
function maxRowHeight(row: MosaicImage[]): number {
  let h = Infinity;
  for (const img of row) {
    if (img.width) h = Math.min(h, img.width / img.aspectRatio); // native height = width / AR
  }
  return h;
}

/**
 * Pack images into rows that fill the full container width. Each row's height is
 * solved so the row spans the width exactly, then capped so no image is ever scaled
 * beyond its native resolution. Result: edge-to-edge mosaic, no whitespace, no upscaling.
 */
function buildJustifiedRows(images: MosaicImage[], containerW: number, gap: number): JustifiedRow[] {
  const rows: JustifiedRow[] = [];
  let row: MosaicImage[] = [];
  let arSum = 0;

  const closeRow = (isLast: boolean) => {
    if (!row.length) return;
    const totalGap = gap * (row.length - 1);
    const fillHeight = (containerW - totalGap) / arSum;     // height that fills the width exactly
    const cap = maxRowHeight(row);                           // no-upscale ceiling
    let height: number;
    let fills: boolean;
    if (isLast && fillHeight > TARGET_ROW_HEIGHT && row.length <= 2) {
      // A sparse final row: don't stretch a couple of images across the whole width.
      height = Math.min(TARGET_ROW_HEIGHT, cap);
      fills = false;
    } else {
      height = Math.min(fillHeight, cap, MAX_ROW_HEIGHT);
      fills = height >= fillHeight - 0.5;                    // capped rows won't fully fill
    }
    rows.push({ images: row, height, fills });
    row = [];
    arSum = 0;
  };

  for (const img of images) {
    row.push(img);
    arSum += img.aspectRatio;
    const naturalW = arSum * TARGET_ROW_HEIGHT + gap * (row.length - 1);
    if (naturalW >= containerW) closeRow(false);
  }
  closeRow(true);
  return rows;
}

export function MosaicGrid({ images, issueId, gap = 16 }: MosaicGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => buildJustifiedRows(images, width, gap), [images, width, gap]);

  return (
    <div ref={ref} className="flex flex-col" style={{ gap }}>
      {rows.map((row, idx) => (
        <div key={idx} className="flex" style={{ gap, height: row.height }}>
          {row.images.map((img) => (
            <div key={img.id} style={{ width: row.height * img.aspectRatio, flexShrink: 0 }}>
              <MosaicTile image={img} issueId={issueId} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
